'use strict';

// Import du module vscode
const vscode = require('vscode');
const {
  ThemeType,
  getThemeState,
  getThemeLabel,
  getAutoThemeType,
  getToggleThemeType
} = require('./theme-logic');

// Variable globale pour le bouton de la barre d'état
/** @type {vscode.StatusBarItem} */
let statusBarItem;

// Fréquence de vérification du mode automatique (1 minute)
const AUTO_CHECK_INTERVAL_MS = 60 * 1000;

// État du thème actif : son type et, pour un thème 365, son mois
/** @type {{ type: string, month: number | undefined }} */
let themeState = { type: ThemeType.LIGHT, month: undefined };

// Dernière période traitée par le mode automatique (ex. "365 05-May Light") : un choix
// manuel est conservé jusqu'au prochain changement de période (jour/nuit ou mois)
/** @type {string | undefined} */
let lastAutoPeriod;

/**
 * Relit l'état du thème actif dans VS Code et met à jour le bouton
 */
function syncThemeState() {
  themeState = getThemeState(
    vscode.workspace.getConfiguration().get('workbench.colorTheme'),
    vscode.window.activeColorTheme.kind
  );
  updateStatusBarItem();
}

/**
 * Applique le thème du mois en cours pour le type donné
 * @param {string} themeType
 * @param {boolean} notify Afficher un message de confirmation
 */
function applyTheme(themeType, notify) {
  const now = new Date();
  themeState = { type: themeType, month: now.getMonth() + 1 };
  updateStatusBarItem();

  const themeToApply = getThemeLabel(themeType, now);

  // Changer le thème de VS Code
  return vscode.workspace
    .getConfiguration()
    .update("workbench.colorTheme", themeToApply, vscode.ConfigurationTarget.Global)
    .then(() => {
      if (notify) {
        vscode.window.showInformationMessage(`Theme changed to ${themeToApply}`);
      }
    }, (error) => {
      vscode.window.showErrorMessage(`Failed to change theme: ${error.message}`);
    });
}

/**
 * Applique le thème automatique s'il a changé depuis la dernière vérification
 */
function checkAutoTheme() {
  const config = vscode.workspace.getConfiguration('365DayNight');
  if (!config.get('enable', false)) {
    lastAutoPeriod = undefined;
    return;
  }

  const themeType = getAutoThemeType(config.get('mode', 'auto'), new Date().getHours());
  const period = getThemeLabel(themeType);
  if (period === lastAutoPeriod) {
    return;
  }

  lastAutoPeriod = period;
  // Le contraste élevé est un choix d'accessibilité : il n'est jamais remplacé,
  // seul le mois est mis à jour
  applyTheme(themeState.type === ThemeType.HIGH_CONTRAST ? ThemeType.HIGH_CONTRAST : themeType, false);
}

/**
 * Fonction d'activation de l'extension
 * @param {vscode.ExtensionContext} context
 */
function activate(context) {
  console.log("Extension 365-daynight activée");

  // Créer le bouton et lire le thème actif au démarrage
  statusBarItem = vscode.window.createStatusBarItem(vscode.StatusBarAlignment.Right, 100);
  syncThemeState();
  statusBarItem.tooltip = 'Switch between Light, Dark, and High Contrast themes.';
  statusBarItem.command = 'extension.toggleTheme';
  statusBarItem.show();

  // Enregistrer les commandes
  context.subscriptions.push(
    vscode.commands.registerCommand('extension.toggleTheme', () => applyTheme(getToggleThemeType(themeState), true)),
    vscode.commands.registerCommand('extension.setLightTheme', () => applyTheme(ThemeType.LIGHT, true)),
    vscode.commands.registerCommand('extension.setDarkTheme', () => applyTheme(ThemeType.DARK, true)),
    vscode.commands.registerCommand('extension.setHighContrastTheme', () => applyTheme(ThemeType.HIGH_CONTRAST, true)),
    statusBarItem
  );

  // Garder le bouton synchronisé quand le thème est changé ailleurs (sélecteur de thèmes, settings.json...)
  // et réagir aux changements de configuration du mode automatique
  context.subscriptions.push(
    vscode.window.onDidChangeActiveColorTheme(syncThemeState),
    vscode.workspace.onDidChangeConfiguration((event) => {
      if (event.affectsConfiguration('365DayNight')) {
        lastAutoPeriod = undefined;
        checkAutoTheme();
      }
    })
  );

  // Mode automatique : vérification au démarrage puis à intervalle régulier
  checkAutoTheme();
  const autoThemeTimer = setInterval(checkAutoTheme, AUTO_CHECK_INTERVAL_MS);
  context.subscriptions.push({ dispose: () => clearInterval(autoThemeTimer) });

  // Accessible depuis les tests d'intégration
  return { getThemeState: () => themeState };
}

/**
 * Met à jour l'apparence du bouton dans la barre d'état
 */
function updateStatusBarItem() {
  switch (themeState.type) {
    case ThemeType.LIGHT:
      statusBarItem.text = '$(symbol-color) LGT';
      break;
    case ThemeType.DARK:
      statusBarItem.text = '$(circle-large-filled) DRK';
      break;
    case ThemeType.HIGH_CONTRAST:
      statusBarItem.text = '$(lightbulb-autofix) HCT';
      break;
  }
}

/**
 * Fonction de désactivation (les ressources sont libérées via context.subscriptions)
 */
function deactivate() {}

// Exporter les fonctions
module.exports = {
  activate,
  deactivate
};
