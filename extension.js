'use strict';

// Import du module vscode
const vscode = require('vscode');
const {
  ThemeType,
  getThemeState,
  getThemeMonth,
  getThemeTypeFromKind,
  getThemeLabelForMonth,
  createMonthSelection,
  getSelectedMonth,
  getAdjacentMonth,
  getStatusBarText,
  getAutoThemeType,
  getAutoPeriod,
  getToggleThemeType,
  isThemeMaskedByWorkspace
} = require('./theme-logic');

// Éléments de la barre d'état : VS Code n'autorise qu'une action par élément, d'où trois éléments côte à côte
/** @type {vscode.StatusBarItem} */
let previousMonthItem;
/** @type {vscode.StatusBarItem} */
let statusBarItem;
/** @type {vscode.StatusBarItem} */
let nextMonthItem;

// Clics sur les flèches pas encore appliqués : des clics rapides donnent un seul changement de thème
let pendingMonthSteps = 0;

// Fréquence de vérification du mode automatique (1 minute)
const AUTO_CHECK_INTERVAL_MS = 60 * 1000;

// Délai laissé à VS Code pour activer un thème demandé, avant de relire le thème réellement actif
const THEME_ACTIVATION_TIMEOUT_MS = 2000;

// État du thème actif : son type et, pour un thème 365, son mois
/** @type {{ type: string, month: number | undefined }} */
let themeState = { type: ThemeType.LIGHT, month: undefined };

// Dernière période traitée par le mode automatique (ex. "2026-05 Light"), conservée entre les
// fenêtres et les redémarrages : un choix manuel reste jusqu'au prochain changement de période
const LAST_AUTO_PERIOD_KEY = 'lastAutoPeriod';

// Mois choisi par l'utilisateur, conservé jusqu'au prochain mois réel (ex. { month: 3, realMonth: "2026-10" })
const SELECTED_MONTH_KEY = 'selectedMonth';

// Mémoire de l'extension, partagée entre les fenêtres
/** @type {vscode.Memento} */
let globalState;

// Dernière période pour laquelle un échec du mode automatique a été signalé
/** @type {string | undefined} */
let lastAutoFailurePeriod;

// Thème demandé que VS Code n'a pas encore activé
/** @type {{ label: string, type: string, timer: ReturnType<typeof setTimeout>, resolve: (activated: boolean | undefined) => void } | undefined} */
let pendingTheme;

// Les changements de thème s'exécutent un par un : chacun part de l'état laissé par le précédent
/** @type {Promise<unknown>} */
let themeChangeQueue = Promise.resolve();

/**
 * Ajoute un changement de thème à la file d'attente
 * @template T
 * @param {() => Promise<T>} task
 * @returns {Promise<T>}
 */
function enqueueThemeChange(task) {
  const result = themeChangeQueue.then(task);
  themeChangeQueue = result.catch(() => {});
  return result;
}

/**
 * Ne plus attendre l'activation d'un thème demandé
 * @param {boolean} [activated] true : activé ; false : pas activé à temps ; undefined : remplacé par un autre thème
 */
function settlePendingTheme(activated) {
  if (pendingTheme) {
    const { timer, resolve } = pendingTheme;
    pendingTheme = undefined;
    clearTimeout(timer);
    resolve(activated);
  }
}

/**
 * Attend que VS Code active le thème demandé. Le résultat n'est connu qu'ainsi : l'API ne dit pas
 * si le système est en contraste élevé, un cas où VS Code ignore le réglage workbench.colorTheme.
 * @param {string} label
 * @param {string} type
 * @returns {Promise<boolean | undefined>}
 */
function waitForThemeActivation(label, type) {
  settlePendingTheme();
  if (getThemeTypeFromKind(vscode.window.activeColorTheme.kind) === type) {
    return Promise.resolve(true);
  }
  return new Promise((resolve) => {
    pendingTheme = {
      label,
      type,
      resolve,
      timer: setTimeout(() => {
        settlePendingTheme(false);
        syncThemeState();
      }, THEME_ACTIVATION_TIMEOUT_MS)
    };
  });
}

/**
 * Relit l'état du thème actif dans VS Code et met à jour le bouton
 */
function syncThemeState() {
  const themeName = vscode.workspace.getConfiguration().get('workbench.colorTheme');
  const state = getThemeState(themeName, vscode.window.activeColorTheme.kind);

  if (pendingTheme && pendingTheme.label === themeName) {
    // VS Code signale encore le thème précédent : le bouton garde le thème demandé
    if (pendingTheme.type !== state.type) {
      return;
    }
    settlePendingTheme(true);
  } else {
    // Un autre thème a été choisi entre-temps
    settlePendingTheme();
  }

  themeState = state;
  updateStatusBarItem();
}

/**
 * Mois réel, de 1 à 12
 */
function getCurrentMonth() {
  return new Date().getMonth() + 1;
}

/**
 * Mois affiché par le bouton, ou le mois réel si le thème actif n'est pas un thème 365
 */
function getDisplayedMonth() {
  return themeState.month ?? getCurrentMonth();
}

/**
 * Mémorise le mois d'un thème 365 devenu actif, sans écriture inutile
 * @param {number} month
 */
async function rememberSelectedMonth(month) {
  const selection = createMonthSelection(month, new Date());
  if (JSON.stringify(selection) !== JSON.stringify(globalState.get(SELECTED_MONTH_KEY))) {
    await globalState.update(SELECTED_MONTH_KEY, selection);
  }
}

/**
 * Réagit à un changement de thème, y compris dans le sélecteur de thèmes.
 * Le démarrage ne passe pas par ici : rouvrir VS Code sur un ancien mois n'est pas un nouveau choix.
 */
function onActiveThemeChanged() {
  syncThemeState();
  const month = getThemeMonth(vscode.workspace.getConfiguration().get('workbench.colorTheme'));
  if (month !== undefined) {
    rememberSelectedMonth(month);
  }
}

/**
 * Applique le thème d'un type et d'un mois. Le bouton ne change qu'après la réussite.
 * @param {string} themeType
 * @param {number} [month] Mois, de 1 à 12 : le mois réel par défaut
 * @returns {Promise<{ ok: true, label: string, activated: Promise<boolean | undefined> } | { ok: false, blocked?: boolean, message: string }>}
 */
async function applyTheme(themeType, month = getCurrentMonth()) {
  const label = getThemeLabelForMonth(themeType, month);
  const config = vscode.workspace.getConfiguration();

  // VS Code ignorerait le réglage workbench.colorTheme : rien n'est écrit
  if (config.get('window.autoDetectColorScheme')) {
    return {
      ok: false,
      blocked: true,
      message: "VS Code follows your system's color mode (window.autoDetectColorScheme) and picks its preferred themes, so this 365 theme can't be applied. Turn this setting off to use it."
    };
  }
  if (isThemeMaskedByWorkspace(config.inspect('workbench.colorTheme'), label)) {
    return {
      ok: false,
      blocked: true,
      message: "This workspace sets its own theme in its settings (workbench.colorTheme), so 365 themes can't be applied here."
    };
  }

  try {
    await config.update('workbench.colorTheme', label, vscode.ConfigurationTarget.Global);
  } catch (error) {
    return { ok: false, message: `Failed to change theme: ${error.message}` };
  }

  const activated = waitForThemeActivation(label, themeType);
  themeState = { type: themeType, month };
  updateStatusBarItem();
  return { ok: true, label, activated };
}

/**
 * Message affiché quand VS Code n'a pas activé le thème demandé
 * @param {string} label
 */
function getNotActivatedMessage(label) {
  const followsHighContrast = vscode.workspace.getConfiguration().get('window.autoDetectHighContrast', true);
  return followsHighContrast
    ? `VS Code did not switch to ${label}. If your system uses high contrast, VS Code follows it (window.autoDetectHighContrast).`
    : `VS Code did not switch to ${label}.`;
}

/**
 * Signale l'échec d'un changement demandé par l'utilisateur : la réussite se voit à l'écran
 * @param {Awaited<ReturnType<typeof applyTheme>>} result
 */
function reportThemeChange(result) {
  if (!result.ok) {
    vscode.window.showErrorMessage(result.message);
    return;
  }

  // Sans attendre : les clics suivants ne doivent pas dépendre de l'activation de ce thème
  result.activated.then((activated) => {
    if (activated === false) {
      vscode.window.showErrorMessage(getNotActivatedMessage(result.label));
    }
  });
}

/**
 * Change de variante à la demande de l'utilisateur, en gardant le mois affiché
 * @param {() => string} getThemeType Évalué au moment du changement, dans l'ordre des clics
 */
function applyThemeFromCommand(getThemeType) {
  return enqueueThemeChange(async () => {
    reportThemeChange(await applyTheme(getThemeType(), getDisplayedMonth()));
  });
}

/**
 * Avance ou recule d'un mois en gardant la variante
 * @param {number} steps 1 pour le mois suivant, -1 pour le précédent
 */
function moveMonth(steps) {
  pendingMonthSteps += steps;
  return enqueueThemeChange(async () => {
    const stepsToApply = pendingMonthSteps;
    pendingMonthSteps = 0;
    // Déjà appliqué avec un clic précédent, ou clics opposés qui s'annulent
    if (stepsToApply === 0) {
      return;
    }
    reportThemeChange(await applyTheme(themeState.type, getAdjacentMonth(getDisplayedMonth(), stepsToApply)));
  });
}

/**
 * Revient au mois réel en gardant la variante
 */
function goToCurrentMonth() {
  return enqueueThemeChange(async () => {
    pendingMonthSteps = 0;
    reportThemeChange(await applyTheme(themeState.type));
  });
}

/**
 * Oublie la dernière période traitée, sans écriture inutile si elle est déjà oubliée
 */
async function forgetAutoPeriod() {
  if (globalState.get(LAST_AUTO_PERIOD_KEY) !== undefined) {
    await globalState.update(LAST_AUTO_PERIOD_KEY, undefined);
  }
}

/**
 * Applique le thème automatique s'il a changé depuis la dernière réussite
 */
function checkAutoTheme() {
  const config = vscode.workspace.getConfiguration('365DayNight');
  if (!config.get('enable', false)) {
    lastAutoFailurePeriod = undefined;
    return forgetAutoPeriod();
  }

  const now = new Date();
  const themeType = getAutoThemeType(config.get('mode', 'auto'), now.getHours());
  const period = getAutoPeriod(themeType, now);

  return enqueueThemeChange(async () => {
    if (period === globalState.get(LAST_AUTO_PERIOD_KEY)) {
      return;
    }

    // Le mois choisi reste jusqu'au prochain mois réel. Le contraste élevé est un choix
    // d'accessibilité : il n'est jamais remplacé, seul le mois est mis à jour
    const month = getSelectedMonth(globalState.get(SELECTED_MONTH_KEY), now) ?? now.getMonth() + 1;
    const result = await applyTheme(themeState.type === ThemeType.HIGH_CONTRAST ? ThemeType.HIGH_CONTRAST : themeType, month);
    if (result.ok) {
      await globalState.update(LAST_AUTO_PERIOD_KEY, period);
      lastAutoFailurePeriod = undefined;
    } else if (!result.blocked && lastAutoFailurePeriod !== period) {
      // Le contrôle suivant réessaiera : l'échec n'est signalé qu'une fois par période.
      // Un thème fixé par le workspace ou le système est un choix de l'utilisateur : rien à signaler.
      lastAutoFailurePeriod = period;
      vscode.window.showErrorMessage(result.message);
    }
  });
}

/**
 * Fonction d'activation de l'extension
 * @param {vscode.ExtensionContext} context
 */
function activate(context) {
  console.log("Extension 365-daynight activée");
  globalState = context.globalState;

  // Créer les trois éléments du bouton, ‹ 10 DRK ›, et lire le thème actif au démarrage.
  // À droite de la barre d'état, la priorité la plus haute est la plus à gauche.
  previousMonthItem = createStatusBarControl('previousMonth', 'Previous month', 102, 'extension.previousMonth', '$(chevron-left)');
  statusBarItem = createStatusBarControl('theme', 'Light and Dark', 101, 'extension.toggleTheme', '');
  nextMonthItem = createStatusBarControl('nextMonth', 'Next month', 100, 'extension.nextMonth', '$(chevron-right)');
  statusBarItem.tooltip = 'Switch between Light and Dark themes.';
  syncThemeState();
  statusBarItem.show();

  // Enregistrer les commandes
  context.subscriptions.push(
    vscode.commands.registerCommand('extension.toggleTheme', () => applyThemeFromCommand(() => getToggleThemeType(
      themeState,
      vscode.workspace.getConfiguration('365DayNight').get('toggleIncludesHighContrast', false)
    ))),
    vscode.commands.registerCommand('extension.setLightTheme', () => applyThemeFromCommand(() => ThemeType.LIGHT)),
    vscode.commands.registerCommand('extension.setDarkTheme', () => applyThemeFromCommand(() => ThemeType.DARK)),
    vscode.commands.registerCommand('extension.setHighContrastTheme', () => applyThemeFromCommand(() => ThemeType.HIGH_CONTRAST)),
    vscode.commands.registerCommand('extension.nextMonth', () => moveMonth(1)),
    vscode.commands.registerCommand('extension.previousMonth', () => moveMonth(-1)),
    vscode.commands.registerCommand('extension.currentMonth', goToCurrentMonth),
    previousMonthItem,
    statusBarItem,
    nextMonthItem,
    { dispose: () => settlePendingTheme() }
  );

  // Garder le bouton synchronisé quand le thème est changé ailleurs (sélecteur de thèmes, settings.json...)
  // et réagir aux changements de configuration du mode automatique
  context.subscriptions.push(
    vscode.window.onDidChangeActiveColorTheme(onActiveThemeChanged),
    vscode.workspace.onDidChangeConfiguration((event) => {
      if (event.affectsConfiguration('365DayNight.enable') || event.affectsConfiguration('365DayNight.mode')) {
        lastAutoFailurePeriod = undefined;
        forgetAutoPeriod().then(checkAutoTheme);
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
 * Crée un élément de la barre d'état, sans l'afficher
 * @param {string} id
 * @param {string} name Nom affiché dans le menu de la barre d'état
 * @param {number} priority
 * @param {string} command
 * @param {string} text
 */
function createStatusBarControl(id, name, priority, command, text) {
  const item = vscode.window.createStatusBarItem(`365DayNight.${id}`, vscode.StatusBarAlignment.Right, priority);
  item.name = `365 Day & Night: ${name}`;
  item.tooltip = name;
  item.command = command;
  item.text = text;
  return item;
}

/**
 * Met à jour le bouton dans la barre d'état : les flèches n'apparaissent qu'avec un thème 365
 */
function updateStatusBarItem() {
  statusBarItem.text = getStatusBarText(themeState);
  for (const item of [previousMonthItem, nextMonthItem]) {
    if (themeState.month === undefined) {
      item.hide();
    } else {
      item.show();
    }
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
