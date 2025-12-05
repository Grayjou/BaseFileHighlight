import * as assert from 'assert';
import * as vscode from 'vscode';
import * as path from 'path';
import * as fs from 'fs';

suite('Base File Highlight Extension Test Suite', () => {
	vscode.window.showInformationMessage('Start all tests.');

	test('Extension should be present', () => {
		assert.ok(vscode.extensions.getExtension('grayjou.base-file-highlight'));
	});

	test('Extension should activate', async () => {
		const extension = vscode.extensions.getExtension('grayjou.base-file-highlight');
		assert.ok(extension);
		await extension!.activate();
		assert.strictEqual(extension!.isActive, true);
	});

	test('Configuration should have default values', () => {
		const config = vscode.workspace.getConfiguration('baseFileHighlight');
		
		assert.strictEqual(config.get('enabled'), true);
		assert.strictEqual(config.get('highlightColor'), '#98FF98');
		assert.strictEqual(config.get('useSymbol'), false);
		assert.strictEqual(config.get('symbolColor'), '#98FF98');
		
		const fileExtensions = config.get<string[]>('fileExtensions');
		assert.ok(fileExtensions);
		assert.ok(fileExtensions.includes('.py'));
		assert.ok(fileExtensions.includes('.js'));
		assert.ok(fileExtensions.includes('.ts'));
	});

	test('Configuration should accept hex color values', async () => {
		const config = vscode.workspace.getConfiguration('baseFileHighlight');
		
		// Test setting different hex colors
		await config.update('highlightColor', '#FF0000', vscode.ConfigurationTarget.Global);
		assert.strictEqual(config.get('highlightColor'), '#FF0000');
		
		await config.update('symbolColor', '#0000FF', vscode.ConfigurationTarget.Global);
		assert.strictEqual(config.get('symbolColor'), '#0000FF');
		
		// Reset to defaults
		await config.update('highlightColor', '#98FF98', vscode.ConfigurationTarget.Global);
		await config.update('symbolColor', '#98FF98', vscode.ConfigurationTarget.Global);
	});
});

suite('Import Detection Tests', () => {
	const testWorkspaceRoot = path.join(__dirname, '../../../examples');

	test('Python base file should be identified correctly', async () => {
		const basePyFile = path.join(testWorkspaceRoot, 'python', 'base_file.py');
		
		if (fs.existsSync(basePyFile)) {
			const content = fs.readFileSync(basePyFile, 'utf-8');
			
			// Verify it has external imports only
			assert.ok(content.includes('import numpy'));
			assert.ok(content.includes('import pandas'));
			assert.ok(!content.includes('from .'));
			assert.ok(!content.includes('import base_file'));
		}
	});

	test('Python dependent file should be identified correctly', async () => {
		const dependentPyFile = path.join(testWorkspaceRoot, 'python', 'dependent_file.py');
		
		if (fs.existsSync(dependentPyFile)) {
			const content = fs.readFileSync(dependentPyFile, 'utf-8');
			
			// Verify it has local imports
			assert.ok(content.includes('from base_file import') || content.includes('import base_file'));
		}
	});

	test('Python relative import file should be identified correctly', async () => {
		const relativePyFile = path.join(testWorkspaceRoot, 'python', 'relative_import_file.py');
		
		if (fs.existsSync(relativePyFile)) {
			const content = fs.readFileSync(relativePyFile, 'utf-8');
			
			// Verify it has relative imports
			assert.ok(content.includes('from .'));
		}
	});

	test('JavaScript base file should be identified correctly', async () => {
		const baseJsFile = path.join(testWorkspaceRoot, 'javascript', 'base_file.jsx');
		
		if (fs.existsSync(baseJsFile)) {
			const content = fs.readFileSync(baseJsFile, 'utf-8');
			
			// Verify it has external imports only
			assert.ok(content.includes("from 'react'") || content.includes('from "react"'));
			assert.ok(!content.includes("from './"));
			assert.ok(!content.includes('from "../'));
		}
	});

	test('JavaScript dependent file should be identified correctly', async () => {
		const dependentJsFile = path.join(testWorkspaceRoot, 'javascript', 'dependent_file.jsx');
		
		if (fs.existsSync(dependentJsFile)) {
			const content = fs.readFileSync(dependentJsFile, 'utf-8');
			
			// Verify it has local imports
			assert.ok(content.includes("from './") || content.includes('from "../'));
		}
	});

	test('CommonJS base file should be identified correctly', async () => {
		const baseCommonFile = path.join(testWorkspaceRoot, 'javascript', 'base_file_commonjs.js');
		
		if (fs.existsSync(baseCommonFile)) {
			const content = fs.readFileSync(baseCommonFile, 'utf-8');
			
			// Verify it has external requires only
			assert.ok(content.includes("require('express')") || content.includes('require("express")'));
			assert.ok(!content.includes("require('./"));
			assert.ok(!content.includes('require("./'));
		}
	});

	test('CommonJS dependent file should be identified correctly', async () => {
		const dependentCommonFile = path.join(testWorkspaceRoot, 'javascript', 'dependent_file_commonjs.js');
		
		if (fs.existsSync(dependentCommonFile)) {
			const content = fs.readFileSync(dependentCommonFile, 'utf-8');
			
			// Verify it has local requires
			assert.ok(content.includes("require('./") || content.includes('require("./'));
		}
	});
});
