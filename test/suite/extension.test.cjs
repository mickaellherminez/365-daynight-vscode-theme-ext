const assert = require('assert');
const vscode = require('vscode');
const { ThemeType, getThemeLabel } = require('../../theme-logic');

const EXTENSION_ID = 'mickaellherminez.365-daynight-vscode-theme-ext';

suite('Extension Test Suite', () => {
	test('Extension should be present', () => {
		assert.ok(vscode.extensions.getExtension(EXTENSION_ID));
	});

	test('Extension should activate and register its commands', async () => {
		await vscode.extensions.getExtension(EXTENSION_ID).activate();
		const commands = await vscode.commands.getCommands(true);
		for (const command of ['toggleTheme', 'setLightTheme', 'setDarkTheme', 'setHighContrastTheme']) {
			assert.ok(commands.includes(`extension.${command}`), `extension.${command} is not registered`);
		}
	});

	test('Toggle command should move from the Light theme to the Dark theme of the current month', async () => {
		await vscode.extensions.getExtension(EXTENSION_ID).activate();
		const activeTheme = () => vscode.workspace.getConfiguration().get('workbench.colorTheme');

		await vscode.commands.executeCommand('extension.setLightTheme');
		assert.strictEqual(activeTheme(), getThemeLabel(ThemeType.LIGHT));

		await vscode.commands.executeCommand('extension.toggleTheme');
		assert.strictEqual(activeTheme(), getThemeLabel(ThemeType.DARK));
	});
});
