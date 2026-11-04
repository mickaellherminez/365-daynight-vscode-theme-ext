const assert = require('assert');
const vscode = require('vscode');
const { ThemeType, ColorThemeKind, getThemeLabel } = require('../../theme-logic');

const EXTENSION_ID = 'mickaellherminez.365-daynight-vscode-theme-ext';

/**
 * Applique un thème et attend que VS Code le rende actif
 * @param {string} themeName
 * @param {number} kind Genre attendu du thème
 */
async function setThemeAndWait(themeName, kind) {
	const applied = new Promise((resolve, reject) => {
		const timer = setTimeout(() => reject(new Error(`${themeName} did not become active`)), 8000);
		const listener = vscode.window.onDidChangeActiveColorTheme((theme) => {
			if (theme.kind === kind && vscode.workspace.getConfiguration().get('workbench.colorTheme') === themeName) {
				clearTimeout(timer);
				listener.dispose();
				resolve();
			}
		});
	});
	await vscode.workspace.getConfiguration().update('workbench.colorTheme', themeName, vscode.ConfigurationTarget.Global);
	await applied;
}

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

	test('ColorThemeKind values should match the VS Code API', () => {
		assert.strictEqual(ColorThemeKind.LIGHT, vscode.ColorThemeKind.Light);
		assert.strictEqual(ColorThemeKind.DARK, vscode.ColorThemeKind.Dark);
		assert.strictEqual(ColorThemeKind.HIGH_CONTRAST, vscode.ColorThemeKind.HighContrast);
		assert.strictEqual(ColorThemeKind.HIGH_CONTRAST_LIGHT, vscode.ColorThemeKind.HighContrastLight);
	});

	test('State should follow the active theme, including a third-party dark theme', async function () {
		this.timeout(20000);
		const { getThemeState } = await vscode.extensions.getExtension(EXTENSION_ID).activate();
		const month = new Date().getMonth() + 1;

		// Partir d'un thème clair pour que le passage à Monokai soit un vrai changement de genre
		await setThemeAndWait(getThemeLabel(ThemeType.LIGHT), vscode.ColorThemeKind.Light);
		assert.deepStrictEqual(getThemeState(), { type: ThemeType.LIGHT, month });

		// Monokai est sombre, mais son nom ne contient pas « Dark »
		await setThemeAndWait('Monokai', vscode.ColorThemeKind.Dark);
		assert.deepStrictEqual(getThemeState(), { type: ThemeType.DARK, month: undefined });

		// Le premier clic applique le thème 365 du même type, le suivant avance dans le cycle
		await vscode.commands.executeCommand('extension.toggleTheme');
		assert.strictEqual(vscode.workspace.getConfiguration().get('workbench.colorTheme'), getThemeLabel(ThemeType.DARK));
		await vscode.commands.executeCommand('extension.toggleTheme');
		assert.strictEqual(vscode.workspace.getConfiguration().get('workbench.colorTheme'), getThemeLabel(ThemeType.HIGH_CONTRAST));
	});
});
