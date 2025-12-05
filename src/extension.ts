import * as vscode from 'vscode';
import * as path from 'path';
import * as fs from 'fs';

const INITIAL_REFRESH_DELAY_MS = 1000;

export function activate(context: vscode.ExtensionContext) {
    console.log('Base File Highlight extension is now active');

    const decorationProvider = new BaseFileDecorationProvider();
    context.subscriptions.push(
        vscode.window.registerFileDecorationProvider(decorationProvider)
    );

    // Watch for file changes
    const watcher = vscode.workspace.createFileSystemWatcher('**/*');
    context.subscriptions.push(watcher);

    watcher.onDidCreate(() => decorationProvider.refresh());
    watcher.onDidChange(() => decorationProvider.refresh());
    watcher.onDidDelete(() => decorationProvider.refresh());

    // Refresh on configuration change
    context.subscriptions.push(
        vscode.workspace.onDidChangeConfiguration(e => {
            if (e.affectsConfiguration('baseFileHighlight')) {
                decorationProvider.refresh();
            }
        })
    );

    // Initial refresh
    setTimeout(() => decorationProvider.refresh(), INITIAL_REFRESH_DELAY_MS);
}

export function deactivate() {}

class BaseFileDecorationProvider implements vscode.FileDecorationProvider {
    private _onDidChangeFileDecorations = new vscode.EventEmitter<vscode.Uri | vscode.Uri[] | undefined>();
    readonly onDidChangeFileDecorations = this._onDidChangeFileDecorations.event;
    private baseFiles = new Set<string>();

    constructor() {
        this.analyzeWorkspace();
    }

    refresh() {
        this.analyzeWorkspace();
        // Fire undefined to refresh all decorations
        this._onDidChangeFileDecorations.fire(undefined);
    }

    provideFileDecoration(uri: vscode.Uri): vscode.ProviderResult<vscode.FileDecoration> {
        const config = vscode.workspace.getConfiguration('baseFileHighlight');
        const enabled = config.get<boolean>('enabled', true);

        if (!enabled) {
            return undefined;
        }

        const filePath = uri.fsPath;
        const isBaseFile = this.baseFiles.has(filePath);

        if (isBaseFile) {
            const useSymbol = config.get<boolean>('useSymbol', false);
            const highlightColor = config.get<string>('highlightColor', '#98FF98');
            const symbolColor = config.get<string>('symbolColor', '#98FF98');

            if (useSymbol) {
                return {
                    badge: '●',
                    color: new vscode.ThemeColor(symbolColor),
                    tooltip: 'Base file (no local dependencies)'
                };
            } else {
                return {
                    color: new vscode.ThemeColor(highlightColor),
                    tooltip: 'Base file (no local dependencies)'
                };
            }
        }

        return undefined;
    }

    private async analyzeWorkspace() {
        this.baseFiles.clear();

        if (!vscode.workspace.workspaceFolders) {
            return;
        }

        const config = vscode.workspace.getConfiguration('baseFileHighlight');
        const extensions = config.get<string[]>('fileExtensions', ['.py', '.js', '.ts', '.jsx', '.tsx']);

        for (const folder of vscode.workspace.workspaceFolders) {
            const pattern = `**/*{${extensions.join(',')}}`;
            const files = await vscode.workspace.findFiles(
                new vscode.RelativePattern(folder, pattern),
                '**/node_modules/**'
            );

            for (const file of files) {
                if (await this.isBaseFile(file.fsPath)) {
                    this.baseFiles.add(file.fsPath);
                }
            }
        }
    }

    private async isBaseFile(filePath: string): Promise<boolean> {
        try {
            const content = await fs.promises.readFile(filePath, 'utf-8');
            const ext = path.extname(filePath);

            if (ext === '.py') {
                return this.analyzePythonImports(content, filePath);
            } else if (['.js', '.ts', '.jsx', '.tsx'].includes(ext)) {
                return this.analyzeJavaScriptImports(content);
            }

            return false;
        } catch (error) {
            return false;
        }
    }

    private analyzePythonImports(content: string, filePath: string): boolean {
        const lines = content.split('\n');
        const fileDir = path.dirname(filePath);

        for (const line of lines) {
            const trimmed = line.trim();

            // Skip comments and empty lines
            if (trimmed.startsWith('#') || trimmed === '') {
                continue;
            }

            // Match import statements
            const importMatch = trimmed.match(/^import\s+([a-zA-Z0-9_.,\s]+)/);
            const fromMatch = trimmed.match(/^from\s+([a-zA-Z0-9_.]+)\s+import/);

            if (importMatch) {
                const modules = importMatch[1].split(',').map(m => m.trim().split(' ')[0]);
                for (const module of modules) {
                    if (this.isLocalModule(module, fileDir, '.py')) {
                        return false;
                    }
                }
            } else if (fromMatch) {
                const module = fromMatch[1];
                if (this.isLocalModule(module, fileDir, '.py')) {
                    return false;
                }
            }
        }

        return true;
    }

    private analyzeJavaScriptImports(content: string): boolean {
        // Match ES6 imports: import ... from '...'
        const es6ImportRegex = /import\s+(?:[\w{},\s*]+\s+from\s+)?['"]([^'"]+)['"]/g;
        // Match CommonJS requires: require('...')
        const requireRegex = /require\s*\(\s*['"]([^'"]+)['"]\s*\)/g;

        const imports: string[] = [];
        let match;

        while ((match = es6ImportRegex.exec(content)) !== null) {
            imports.push(match[1]);
        }

        while ((match = requireRegex.exec(content)) !== null) {
            imports.push(match[1]);
        }

        for (const importPath of imports) {
            if (this.isLocalImport(importPath)) {
                return false;
            }
        }

        return true;
    }

    private isLocalModule(moduleName: string, fileDir: string, ext: string): boolean {
        // Check if it's a relative import (starts with . or ..)
        if (moduleName.startsWith('.')) {
            return true;
        }

        // Check if a local file with this name exists
        const possiblePaths = [
            path.join(fileDir, `${moduleName}${ext}`),
            path.join(fileDir, moduleName, `__init__${ext}`)
        ];

        for (const possiblePath of possiblePaths) {
            if (fs.existsSync(possiblePath)) {
                return true;
            }
        }

        return false;
    }

    private isLocalImport(importPath: string): boolean {
        // Check if it's a relative import (starts with ./ or ../ or /)
        if (importPath.startsWith('./') || importPath.startsWith('../') || importPath.startsWith('/')) {
            return true;
        }

        // Check if it looks like a local file path
        // Node modules typically don't have file extensions in imports
        if (importPath.includes('/') && !this.isNodeModule(importPath)) {
            return true;
        }

        return false;
    }

    private isNodeModule(importPath: string): boolean {
        // Common patterns for node modules
        // e.g., @scope/package, @scope/package/subpath, package, package/subpath
        const nodeModulePattern = /^@?[a-z0-9-]+(?:\/[a-z0-9-]+)?(?:\/.*)?$/i;
        
        // If it doesn't start with . or /, and matches the pattern, it's likely a node module
        if (!importPath.startsWith('.') && !importPath.startsWith('/')) {
            const packagePath = this.extractPackagePath(importPath);
            return nodeModulePattern.test(packagePath);
        }

        return false;
    }

    private extractPackagePath(importPath: string): string {
        // Extract the package name from the import path
        // For @scope/package/subpath, returns @scope/package
        // For package/subpath, returns package
        const parts = importPath.split('/');
        if (parts[0].startsWith('@') && parts.length > 1) {
            return `${parts[0]}/${parts[1]}`;
        }
        return parts[0];
    }
}
