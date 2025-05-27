// @ts-check
/** @type {import('vscode')} */
/** @typedef {import('vscode').ExtensionContext} ExtensionContext */
// @ts-nocheck

'use strict';

// Import du module vscode
const vscode = require('vscode');

// Variable globale pour le bouton de la barre d'état
let statusBarItem;

// Enum pour les types de thèmes
const ThemeType = {
  LIGHT: 'Light',
  DARK: 'Dark',
  HIGH_CONTRAST: 'High Contrast'
};

// Variable pour suivre l'état du thème actuel
let currentThemeType = ThemeType.LIGHT;

/**
 * Fonction d'activation de l'extension
 * @param {vscode.ExtensionContext} context 
 */
function activate(context) {
  console.log("Extension 365-daynight activée");

  // Déterminer le thème actuel au démarrage
  const currentTheme = vscode.workspace.getConfiguration().get('workbench.colorTheme');
  if (currentTheme && currentTheme.includes('Dark')) {
    currentThemeType = ThemeType.DARK;
  } else if (currentTheme && currentTheme.includes('High Contrast')) {
    currentThemeType = ThemeType.HIGH_CONTRAST;
  } else {
    currentThemeType = ThemeType.LIGHT;
  }

  // Créer le bouton
  statusBarItem = vscode.window.createStatusBarItem(vscode.StatusBarAlignment.Right, 100);
  updateStatusBarItem(); // Définir le texte initial
  statusBarItem.tooltip = 'Switch between Light, Dark, and High Contrast themes.';
  statusBarItem.command = 'extension.toggleTheme';
  statusBarItem.show();

  // Fonction commune pour basculer entre les thèmes
  function toggleThemeHandler() {
    // Basculer les types de thèmes en cycle
    if (currentThemeType === ThemeType.LIGHT) {
      currentThemeType = ThemeType.DARK;
    } else if (currentThemeType === ThemeType.DARK) {
      currentThemeType = ThemeType.HIGH_CONTRAST;
    } else {
      currentThemeType = ThemeType.LIGHT;
    }

    // Mettre à jour le texte du bouton
    updateStatusBarItem();

    applyCurrentTheme();
  }

  // Fonction pour appliquer le thème actuel
  function applyCurrentTheme() {
    // Obtenir le thème actuel
    const currentMonth = new Date().getMonth();
    const monthNames = [
      "January", "February", "March", "April", "May", "June",
      "July", "August", "September", "October", "November", "December"
    ];
    const monthName = monthNames[currentMonth];
    const monthNumber = (currentMonth + 1).toString().padStart(2, '0');

    // Déterminer le thème à appliquer
    let themeToApply;

    switch (currentThemeType) {
      case ThemeType.LIGHT:
        themeToApply = `365 ${monthNumber}-${monthName} Light`;
        break;
      case ThemeType.DARK:
        themeToApply = `365 ${monthNumber}-${monthName} Dark`;
        break;
      case ThemeType.HIGH_CONTRAST:
        themeToApply = `365 ${monthNumber}-${monthName} High Contrast`;
        break;
    }

    // Changer le thème de VS Code
    vscode.workspace
      .getConfiguration()
      .update("workbench.colorTheme", themeToApply, true)
      .then(() => {
        // Afficher un message de confirmation
        vscode.window.showInformationMessage(`Thème changé pour ${themeToApply}`);
      }, (error) => {
        vscode.window.showErrorMessage(`Erreur lors du changement de thème: ${error.message}`);
      });
  }

  // Fonctions pour définir directement un type de thème spécifique
  function setLightTheme() {
    currentThemeType = ThemeType.LIGHT;
    updateStatusBarItem();
    applyCurrentTheme();
  }

  function setDarkTheme() {
    currentThemeType = ThemeType.DARK;
    updateStatusBarItem();
    applyCurrentTheme();
  }

  function setHighContrastTheme() {
    currentThemeType = ThemeType.HIGH_CONTRAST;
    updateStatusBarItem();
    applyCurrentTheme();
  }

  // Enregistrer les commandes
  let toggleThemeCommand = vscode.commands.registerCommand('extension.toggleTheme', toggleThemeHandler);
  let setLightThemeCommand = vscode.commands.registerCommand('extension.setLightTheme', setLightTheme);
  let setDarkThemeCommand = vscode.commands.registerCommand('extension.setDarkTheme', setDarkTheme);
  let setHighContrastThemeCommand = vscode.commands.registerCommand('extension.setHighContrastTheme', setHighContrastTheme);

  // Ajouter au contexte
  context.subscriptions.push(toggleThemeCommand);
  context.subscriptions.push(setLightThemeCommand);
  context.subscriptions.push(setDarkThemeCommand);
  context.subscriptions.push(setHighContrastThemeCommand);
  context.subscriptions.push(statusBarItem);
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
 * Fonction de désactivation
 */
function deactivate() {
  if (statusBarItem) {
    statusBarItem.dispose();
  }
}

// Exporter les fonctions
module.exports = {
  activate,
  deactivate
}; 