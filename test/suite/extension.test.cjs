const assert = require('assert');
const vscode = require('vscode');
const { ThemeType, ColorThemeKind, getThemeLabel, getThemeLabelForMonth, getAdjacentMonth } = require('../../theme-logic');

const EXTENSION_ID = 'mickaellherminez.365-daynight-vscode-theme-ext';

/**
 * Applique un thème et attend que VS Code le rende actif
 * @param {string} themeName
 * @param {number} kind Genre attendu du thème
 */
async function setThemeAndWait(themeName, kind) {
	// Déjà actif : VS Code ne signalerait aucun changement
	if (vscode.window.activeColorTheme.kind === kind && vscode.workspace.getConfiguration().get('workbench.colorTheme') === themeName) {
		return;
	}

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

/**
 * Attend qu'une condition devienne vraie
 * @param {() => boolean} condition
 * @param {string} description
 */
async function waitFor(condition, description) {
	const deadline = Date.now() + 8000;
	while (!condition()) {
		if (Date.now() > deadline) {
			throw new Error(`Timed out waiting for: ${description}`);
		}
		await new Promise((resolve) => setTimeout(resolve, 50));
	}
}

suite('Extension Test Suite', () => {
	test('Extension should be present', () => {
		assert.ok(vscode.extensions.getExtension(EXTENSION_ID));
	});

	test('Extension should activate and register its commands', async () => {
		await vscode.extensions.getExtension(EXTENSION_ID).activate();
		const commands = await vscode.commands.getCommands(true);
		for (const command of ['toggleTheme', 'setLightTheme', 'setDarkTheme', 'setHighContrastTheme', 'setHighContrastLightTheme', 'nextMonth', 'previousMonth', 'currentMonth']) {
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

	test('Commands should not write the theme while VS Code follows the system color mode', async function () {
		this.timeout(10000);
		await vscode.extensions.getExtension(EXTENSION_ID).activate();
		const config = () => vscode.workspace.getConfiguration();

		await setThemeAndWait(getThemeLabel(ThemeType.LIGHT), vscode.ColorThemeKind.Light);
		await config().update('window.autoDetectColorScheme', true, vscode.ConfigurationTarget.Global);
		try {
			const before = config().inspect('workbench.colorTheme').globalValue;
			await vscode.commands.executeCommand('extension.setDarkTheme');
			assert.strictEqual(config().inspect('workbench.colorTheme').globalValue, before);
		} finally {
			await config().update('window.autoDetectColorScheme', undefined, vscode.ConfigurationTarget.Global);
		}
	});

	test('Month commands should change the theme and stay fast when clicked quickly', async function () {
		this.timeout(20000);
		await vscode.extensions.getExtension(EXTENSION_ID).activate();
		const activeTheme = () => vscode.workspace.getConfiguration().get('workbench.colorTheme');
		const month = new Date().getMonth() + 1;

		await setThemeAndWait(getThemeLabelForMonth(ThemeType.DARK, month), vscode.ColorThemeKind.Dark);

		await vscode.commands.executeCommand('extension.nextMonth');
		assert.strictEqual(activeTheme(), getThemeLabelForMonth(ThemeType.DARK, getAdjacentMonth(month, 1)));

		const start = Date.now();
		await Promise.all(Array.from({ length: 5 }, () => vscode.commands.executeCommand('extension.nextMonth')));
		const duration = Date.now() - start;
		console.log(`5 fast clicks on an arrow: ${duration} ms`);
		assert.strictEqual(activeTheme(), getThemeLabelForMonth(ThemeType.DARK, getAdjacentMonth(month, 6)));
		assert.ok(duration < 3000, `5 fast clicks took ${duration} ms`);

		await vscode.commands.executeCommand('extension.currentMonth');
		assert.strictEqual(activeTheme(), getThemeLabelForMonth(ThemeType.DARK, month));
	});

	test('ColorThemeKind values should match the VS Code API', () => {
		assert.strictEqual(ColorThemeKind.LIGHT, vscode.ColorThemeKind.Light);
		assert.strictEqual(ColorThemeKind.DARK, vscode.ColorThemeKind.Dark);
		assert.strictEqual(ColorThemeKind.HIGH_CONTRAST, vscode.ColorThemeKind.HighContrast);
		assert.strictEqual(ColorThemeKind.HIGH_CONTRAST_LIGHT, vscode.ColorThemeKind.HighContrastLight);
	});

	test('The click should switch October between its two High Contrast variants', async function () {
		this.timeout(20000);
		const { getThemeState } = await vscode.extensions.getExtension(EXTENSION_ID).activate();
		const octoberHighContrast = getThemeLabelForMonth(ThemeType.HIGH_CONTRAST, 10);

		await setThemeAndWait(octoberHighContrast, vscode.ColorThemeKind.HighContrast);
		assert.deepStrictEqual(getThemeState(), { type: ThemeType.HIGH_CONTRAST, month: 10 });

		// VS Code charge le nouveau thème comme un thème clair à contraste élevé
		await vscode.commands.executeCommand('extension.toggleTheme');
		await waitFor(() => vscode.window.activeColorTheme.kind === vscode.ColorThemeKind.HighContrastLight, 'High Contrast Light to be active');
		assert.strictEqual(vscode.workspace.getConfiguration().get('workbench.colorTheme'), getThemeLabelForMonth(ThemeType.HIGH_CONTRAST_LIGHT, 10));
		assert.deepStrictEqual(getThemeState(), { type: ThemeType.HIGH_CONTRAST_LIGHT, month: 10 });

		await vscode.commands.executeCommand('extension.toggleTheme');
		await waitFor(() => vscode.window.activeColorTheme.kind === vscode.ColorThemeKind.HighContrast, 'High Contrast to be active');
		assert.strictEqual(vscode.workspace.getConfiguration().get('workbench.colorTheme'), octoberHighContrast);
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
		assert.strictEqual(vscode.workspace.getConfiguration().get('workbench.colorTheme'), getThemeLabel(ThemeType.LIGHT));
	});

	test('System mode should apply the monthly themes through the preferred settings, then restore them', async function () {
		this.timeout(30000);
		// Seule la fenêtre qui a le focus met le mode en place
		if (!vscode.window.state.focused) {
			console.log('System mode test skipped: the test window has no focus');
			this.skip();
		}
		const { getThemeState } = await vscode.extensions.getExtension(EXTENSION_ID).activate();
		const month = new Date().getMonth() + 1;
		const config = () => vscode.workspace.getConfiguration();
		const userValue = (key) => config().inspect(key).globalValue;
		const preferredLight = 'workbench.preferredLightColorTheme';
		const preferredDark = 'workbench.preferredDarkColorTheme';

		await setThemeAndWait('Monokai', vscode.ColorThemeKind.Dark);
		await config().update(preferredDark, 'Default Dark Modern', vscode.ConfigurationTarget.Global);
		await config().update('365DayNight.mode', 'system', vscode.ConfigurationTarget.Global);
		await config().update('365DayNight.enable', true, vscode.ConfigurationTarget.Global);
		try {
			await waitFor(() => userValue('window.autoDetectColorScheme') === true, 'the detection to be on');
			assert.strictEqual(userValue(preferredLight), getThemeLabelForMonth(ThemeType.LIGHT, month));
			assert.strictEqual(userValue(preferredDark), getThemeLabelForMonth(ThemeType.DARK, month));
			assert.strictEqual(userValue('workbench.preferredHighContrastColorTheme'), getThemeLabelForMonth(ThemeType.HIGH_CONTRAST, month));

			// VS Code a bien activé un thème du mois, sans toucher au réglage workbench.colorTheme
			await waitFor(() => getThemeState().month === month, 'a theme of the month to be active');
			assert.strictEqual(userValue('workbench.colorTheme'), 'Monokai');

			// Le système choisit la variante : le bouton central ne change rien
			await vscode.commands.executeCommand('extension.toggleTheme');
			assert.strictEqual(getThemeState().month, month);

			await vscode.commands.executeCommand('extension.nextMonth');
			assert.strictEqual(userValue(preferredDark), getThemeLabelForMonth(ThemeType.DARK, getAdjacentMonth(month, 1)));
			await waitFor(() => getThemeState().month === getAdjacentMonth(month, 1), 'the next month to be active');
			await vscode.commands.executeCommand('extension.currentMonth');
		} finally {
			await config().update('365DayNight.enable', undefined, vscode.ConfigurationTarget.Global);
			await config().update('365DayNight.mode', undefined, vscode.ConfigurationTarget.Global);
		}

		await waitFor(() => userValue('window.autoDetectColorScheme') === undefined, 'the detection to be restored');
		await waitFor(() => userValue(preferredLight) === undefined, 'the absent setting to be removed');
		await waitFor(() => userValue(preferredDark) === 'Default Dark Modern', 'the original value to come back');
		await waitFor(() => getThemeState().month === undefined, 'the previous theme to come back');
		await config().update(preferredDark, undefined, vscode.ConfigurationTarget.Global);
	});
});
