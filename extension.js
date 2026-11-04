'use strict';

// Import du module vscode
const vscode = require('vscode');
const {
  ThemeType,
  getThemeTypeFromName,
  getThemeLabel,
  getAutoThemeType,
  getNextThemeType
} = require('./theme-logic');

// Variable globale pour le bouton de la barre d'état
/** @type {vscode.StatusBarItem} */
let statusBarItem;

// Fréquence de vérification du mode automatique (1 minute)
const AUTO_CHECK_INTERVAL_MS = 60 * 1000;

// Variable pour suivre l'état du thème actuel
let currentThemeType = ThemeType.LIGHT;

// Dernière période traitée par le mode automatique (ex. "365 05-May Light") : un choix
// manuel est conservé jusqu'au prochain changement de période (jour/nuit ou mois)
/** @type {string | undefined} */
let lastAutoPeriod;

/**
 * Applique le thème du mois en cours pour le type donné
 * @param {string} themeType
 * @param {boolean} notify Afficher un message de confirmation
 */
function applyTheme(themeType, notify) {
  currentThemeType = themeType;
  updateStatusBarItem();

  const themeToApply = getThemeLabel(themeType);

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
  applyTheme(currentThemeType === ThemeType.HIGH_CONTRAST ? ThemeType.HIGH_CONTRAST : themeType, false);
}

/**
 * Fonction d'activation de l'extension
 * @param {vscode.ExtensionContext} context
 */
function activate(context) {
  console.log("Extension 365-daynight activée");

  // Déterminer le thème actuel au démarrage
  currentThemeType = getThemeTypeFromName(vscode.workspace.getConfiguration().get('workbench.colorTheme'));

  // Créer le bouton
  statusBarItem = vscode.window.createStatusBarItem(vscode.StatusBarAlignment.Right, 100);
  updateStatusBarItem(); // Définir le texte initial
  statusBarItem.tooltip = 'Switch between Light, Dark, and High Contrast themes.';
  statusBarItem.command = 'extension.toggleTheme';
  statusBarItem.show();

  // Enregistrer les commandes
  context.subscriptions.push(
    vscode.commands.registerCommand('extension.toggleTheme', () => applyTheme(getNextThemeType(currentThemeType), true)),
    vscode.commands.registerCommand('extension.setLightTheme', () => applyTheme(ThemeType.LIGHT, true)),
    vscode.commands.registerCommand('extension.setDarkTheme', () => applyTheme(ThemeType.DARK, true)),
    vscode.commands.registerCommand('extension.setHighContrastTheme', () => applyTheme(ThemeType.HIGH_CONTRAST, true)),
    statusBarItem
  );

  // Garder le bouton synchronisé quand le thème est changé ailleurs (sélecteur de thèmes, settings.json...)
  // et réagir aux changements de configuration du mode automatique
  context.subscriptions.push(
    vscode.workspace.onDidChangeConfiguration((event) => {
      if (event.affectsConfiguration('workbench.colorTheme')) {
        currentThemeType = getThemeTypeFromName(vscode.workspace.getConfiguration().get('workbench.colorTheme'));
        updateStatusBarItem();
      }
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
}

/**
 * Met à jour l'apparence du bouton dans la barre d'état
 */
function updateStatusBarItem() {
  switch (currentThemeType) {
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
