const assert = require('assert');
const vscode = require('vscode');

suite('Extension Test Suite', () => {
	test('Extension should be present', () => {
		assert.ok(vscode.extensions.getExtension('mickaellherminez.365-daynight-vscode-theme-ext'));
	});
});
