# Quick Start Guide

## Installation

### Option 1: Install from VSIX
1. Download or build the `.vsix` file
2. Open VSCode
3. Press `Ctrl+Shift+P` (or `Cmd+Shift+P` on Mac)
4. Type "Extensions: Install from VSIX"
5. Select the `.vsix` file

### Option 2: Run from Source (Development)
1. Clone this repository
2. Run `npm install`
3. Run `npm run compile`
4. Press `F5` to open a new VSCode window with the extension loaded

## Building the VSIX Package

```bash
npm install
npm run compile
npx vsce package
```

This will create a `base-file-highlight-*.vsix` file that can be shared and installed.

## How to Use

Once installed, the extension automatically starts working:

1. Open a project folder in VSCode
2. Look at the file explorer on the left sidebar
3. Files that only import external packages will be highlighted in mint green (default)
4. Files that import local modules will remain in the default color

## Configuration

To customize the behavior:

1. Open Settings: `File > Preferences > Settings` (or `Ctrl+,`)
2. Search for "Base File Highlight"
3. Adjust the settings:
   - Toggle `enabled` to turn the extension on/off
   - Change `highlightColor` to use a different color
   - Enable `useSymbol` to show a symbol instead of changing text color
   - Modify `fileExtensions` to analyze different file types

Example settings in `settings.json`:

```json
{
  "baseFileHighlight.enabled": true,
  "baseFileHighlight.highlightColor": "#98FF98",
  "baseFileHighlight.useSymbol": false,
  "baseFileHighlight.symbolColor": "#98FF98",
  "baseFileHighlight.fileExtensions": [".py", ".js", ".ts", ".jsx", ".tsx"]
}
```

## Troubleshooting

**Files aren't being highlighted**
- Make sure the extension is enabled in settings
- Check that your files have one of the supported extensions
- Try reloading the window: `Ctrl+Shift+P` → "Developer: Reload Window"

**Wrong files are being highlighted**
- The extension analyzes import/require statements
- Complex or dynamic imports may not be detected correctly
- Check the example files to understand expected behavior

**Colors don't appear as expected**
- VSCode theme may override the colors
- Try using `useSymbol` mode instead
- Use VSCode theme color IDs instead of hex codes

## Testing with Example Files

The repository includes example files in the `examples/` directory:

```bash
# Open this repository in VSCode
code .

# Navigate to examples/python/ or examples/javascript/
# Observe which files are highlighted
```

Expected behavior:
- `base_file.py` and `base_file.jsx` → Highlighted (only external imports)
- `dependent_file.py` and `dependent_file.jsx` → Not highlighted (local imports)

## Supported Languages

Currently supports:
- **Python** (`.py`): Detects `import` and `from...import` statements
- **JavaScript** (`.js`, `.jsx`): Detects ES6 `import` and CommonJS `require()`
- **TypeScript** (`.ts`, `.tsx`): Detects ES6 `import` and CommonJS `require()`

## How It Works

The extension:
1. Scans all files with configured extensions in your workspace
2. Parses import/require statements
3. Determines if imports are external packages or local files
4. Applies decorations to files that only have external dependencies
5. Updates automatically when files change

## Next Steps

- Star the repository if you find it useful!
- Report issues or suggest features
- Contribute improvements via pull requests

## Links

- [Repository](https://github.com/Grayjou/BaseFileHighlight)
- [Issues](https://github.com/Grayjou/BaseFileHighlight/issues)
- [VSCode Extension API](https://code.visualstudio.com/api)
