'use strict';

// Import du module vscode
const vscode = require('vscode');
const {
  ThemeType,
  SYSTEM_DECIDES_HINT,
  MONTH_NAMES,
  getThemeDisplayName,
  getSwitchHint,
  getThemeState,
  getThemeMonth,
  getThemeTypeFromKind,
  getThemeKind,
  getThemeLabelForMonth,
  createMonthSelection,
  getSelectedMonth,
  getAdjacentMonth,
  getStatusBarText,
  getAutoThemeType,
  getAutoPeriod,
  getToggleThemeType,
  isThemeMaskedByWorkspace,
  getActiveThemeSetting,
  getSystemThemeSettings,
  isSystemThemeValue
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

// Valeurs des réglages avant le mode system, pour les rendre en le quittant : { saved, complete }.
// saved ne contient que les réglages présents chez l'utilisateur, une absence reste donc une absence.
// complete devient vrai une fois tous les réglages écrits : avant, une écriture peut être à refaire.
const SYSTEM_BACKUP_KEY = 'systemModeBackup';

const DETECT_COLOR_SCHEME_SETTING = 'window.autoDetectColorScheme';

// Réglages modifiés par le mode system. La détection vient en premier en quittant le mode,
// pour que VS Code ne passe pas par les thèmes préférés d'origine.
const PREFERRED_SETTINGS = Object.keys(getSystemThemeSettings(1));
const SYSTEM_SETTINGS = [DETECT_COLOR_SCHEME_SETTING, ...PREFERRED_SETTINGS];

// Explication quand un changement de variante est demandé en mode system
const SYSTEM_DECIDES_MESSAGE = 'Your system decides between Light and Dark, because 365DayNight.mode is set to system. The arrows still change the month.';

// Mémoire de l'extension, partagée entre les fenêtres
/** @type {vscode.Memento} */
let globalState;

// Dernière période pour laquelle un échec du mode automatique a été signalé
/** @type {string | undefined} */
let lastAutoFailurePeriod;

// L'échec de la restauration des réglages n'est signalé qu'une fois
let restoreFailureReported = false;

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
  if (vscode.window.activeColorTheme.kind === getThemeKind(type)) {
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
 * Nom du thème actif, lu dans le réglage qui en décide : VS Code ne le donne pas directement
 */
function getActiveThemeName() {
  return vscode.workspace.getConfiguration().get(getCurrentThemeSetting());
}

/**
 * Réglage qui décide du thème actif
 */
function getCurrentThemeSetting() {
  const config = vscode.workspace.getConfiguration();
  return getActiveThemeSetting(vscode.window.activeColorTheme.kind, {
    colorTheme: config.get('workbench.colorTheme'),
    followsColorScheme: Boolean(config.get(DETECT_COLOR_SCHEME_SETTING)),
    followsHighContrast: Boolean(config.get('window.autoDetectHighContrast', true))
  });
}

/**
 * Le mode system est demandé
 */
function isSystemModeSelected() {
  const config = vscode.workspace.getConfiguration('365DayNight');
  return config.get('enable', false) && config.get('mode', 'auto') === 'system';
}

/**
 * Le mode system est demandé et VS Code suit bien le système : c'est lui qui choisit la variante
 */
function isFollowingSystem() {
  return isSystemModeSelected() && Boolean(vscode.workspace.getConfiguration().get(DETECT_COLOR_SCHEME_SETTING));
}

/**
 * Relit l'état du thème actif dans VS Code et met à jour le bouton
 */
function syncThemeState() {
  const state = getThemeState(getActiveThemeName(), vscode.window.activeColorTheme.kind);

  if (pendingTheme && pendingTheme.label === vscode.workspace.getConfiguration().get('workbench.colorTheme')) {
    // VS Code signale encore le thème précédent : le bouton garde le thème demandé
    if (vscode.window.activeColorTheme.kind !== getThemeKind(pendingTheme.type)) {
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
  // Quand VS Code suit le système, un changement de thème ne vient pas forcément d'un choix
  if (vscode.workspace.getConfiguration().get(DETECT_COLOR_SCHEME_SETTING)) {
    return;
  }
  const month = getThemeMonth(getActiveThemeName());
  if (month !== undefined) {
    rememberSelectedMonth(month);
  }
}

/**
 * Réagit au changement d'un réglage préféré. Seul le réglage du thème actif, dans la fenêtre qui a
 * le focus, peut être un choix : le sélecteur de thèmes y écrit le mois choisi, qui s'étend alors
 * aux autres réglages. Les écritures d'une autre fenêtre, ou celles de l'extension, ne comptent pas.
 */
function onPreferredThemeChanged() {
  const previousMonth = themeState.month;
  syncThemeState();
  if (!isFollowingSystem() || !vscode.window.state.focused || themeState.month === undefined || themeState.month === previousMonth) {
    return;
  }
  enqueueThemeChange(async () => {
    const month = getThemeMonth(getActiveThemeName());
    if (month !== undefined) {
      reportThemeChange(await applySystemMonth(month));
    }
  });
}

/**
 * Écrit le mois dans les réglages préférés. Un réglage qui contient autre chose qu'un thème 365 de
 * la bonne variante est un choix de l'utilisateur : il reste, sauf s'il fait partie de ceux à remplacer.
 * @param {number} month
 * @param {string[]} [replacedSettings] Réglages à écrire, quelle que soit leur valeur
 */
async function writeSystemThemes(month, replacedSettings = []) {
  const config = vscode.workspace.getConfiguration();
  for (const [setting, label] of Object.entries(getSystemThemeSettings(month))) {
    const current = config.inspect(setting)?.globalValue;
    if (current !== label && (isSystemThemeValue(setting, current) || replacedSettings.includes(setting))) {
      await config.update(setting, label, vscode.ConfigurationTarget.Global);
    }
  }
}

/**
 * Applique un mois en mode system, à la demande de l'utilisateur, et le mémorise
 * @param {number} month
 * @param {string[]} [replacedSettings] Réglages à écrire, quelle que soit leur valeur
 * @returns {Promise<Awaited<ReturnType<typeof applyTheme>>>}
 */
async function applySystemMonth(month, replacedSettings) {
  try {
    await writeSystemThemes(month, replacedSettings);
  } catch (error) {
    return { ok: false, message: `Failed to change theme: ${error.message}` };
  }
  await rememberSelectedMonth(month);
  syncThemeState();
  return { ok: true, label: getThemeLabelForMonth(themeState.type, month), activated: Promise.resolve(true) };
}

/**
 * Applique le mois du mode system. Le premier passage sauvegarde les réglages de l'utilisateur,
 * puis remplace aussi ceux qui contiennent un autre thème et active la détection.
 * @param {number} month
 * @returns {Promise<{ ok: true } | { ok: false, message: string }>}
 */
async function setUpSystemMode(month) {
  const config = vscode.workspace.getConfiguration();
  let backup = globalState.get(SYSTEM_BACKUP_KEY);
  if (!backup) {
    const saved = {};
    for (const setting of SYSTEM_SETTINGS) {
      const value = config.inspect(setting)?.globalValue;
      if (value !== undefined) {
        saved[setting] = value;
      }
    }
    backup = { saved, complete: false };
    await globalState.update(SYSTEM_BACKUP_KEY, backup);
  }

  try {
    if (backup.complete) {
      await writeSystemThemes(month);
    } else {
      await writeSystemThemes(month, PREFERRED_SETTINGS);
      if (config.inspect(DETECT_COLOR_SCHEME_SETTING)?.globalValue !== true) {
        await config.update(DETECT_COLOR_SCHEME_SETTING, true, vscode.ConfigurationTarget.Global);
      }
      await globalState.update(SYSTEM_BACKUP_KEY, { ...backup, complete: true });
    }
  } catch (error) {
    return { ok: false, message: `Failed to change theme: ${error.message}` };
  }
  syncThemeState();
  return { ok: true };
}

/**
 * Quitte le mode system : rend les valeurs d'origine, sauf celles que l'utilisateur a changées entre-temps.
 * Tant que ce n'est pas réussi, la sauvegarde reste et le contrôle suivant réessaie.
 * @returns {Promise<boolean>} true si plus rien n'est à restaurer
 */
async function leaveSystemMode() {
  const backup = globalState.get(SYSTEM_BACKUP_KEY);
  if (!backup) {
    return true;
  }

  const config = vscode.workspace.getConfiguration();
  try {
    for (const setting of SYSTEM_SETTINGS) {
      const current = config.inspect(setting)?.globalValue;
      const isOurs = setting === DETECT_COLOR_SCHEME_SETTING ? current === true : isSystemThemeValue(setting, current);
      if (isOurs && current !== backup.saved[setting]) {
        await config.update(setting, backup.saved[setting], vscode.ConfigurationTarget.Global);
      }
    }
  } catch (error) {
    if (!restoreFailureReported) {
      restoreFailureReported = true;
      vscode.window.showErrorMessage(`Failed to restore your theme settings: ${error.message}`);
    }
    return false;
  }

  restoreFailureReported = false;
  await globalState.update(SYSTEM_BACKUP_KEY, undefined);
  syncThemeState();
  return true;
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
  // Un contraste élevé actif peut venir du système, que VS Code suit : le thème demandé ne
  // s'activera peut-être jamais, et le bouton attend donc le thème réellement actif
  const mayBeSystemHighContrast = getThemeTypeFromKind(vscode.window.activeColorTheme.kind) === ThemeType.HIGH_CONTRAST
    && config.get('window.autoDetectHighContrast', true);

  if (isFollowingSystem()) {
    return { ok: false, blocked: true, message: SYSTEM_DECIDES_MESSAGE };
  }

  // VS Code ignorerait le réglage workbench.colorTheme : rien n'est écrit
  if (config.get(DETECT_COLOR_SCHEME_SETTING)) {
    return {
      ok: false,
      blocked: true,
      message: "VS Code follows your system's color mode (window.autoDetectColorScheme) and picks its preferred themes, so this 365 theme can't be applied. Turn this setting off to use it, or set 365DayNight.mode to system to follow your system with 365 themes."
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
  if (!mayBeSystemHighContrast) {
    themeState = { type: themeType, month };
    updateStatusBarItem();
  }
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
 * Clic sur le bouton central. En mode system, le système choisit la variante : le clic l'explique,
 * sauf depuis un thème d'un autre éditeur, où il ramène le thème 365 comme dans les autres modes.
 */
function toggleTheme() {
  return enqueueThemeChange(async () => {
    if (!isFollowingSystem()) {
      reportThemeChange(await applyTheme(getToggleThemeType(
        themeState,
        vscode.workspace.getConfiguration('365DayNight').get('toggleIncludesHighContrast', false)
      ), getDisplayedMonth()));
    } else if (canBringBack365Theme()) {
      reportThemeChange(await applySystemMonth(getDisplayedMonth(), [getCurrentThemeSetting()]));
    } else {
      vscode.window.showInformationMessage(SYSTEM_DECIDES_MESSAGE);
    }
  });
}

/**
 * En mode system, un thème d'un autre éditeur est actif et un thème 365 peut le remplacer.
 * Ce n'est pas le cas en contraste élevé clair, tant que cette variante n'existe pas.
 */
function canBringBack365Theme() {
  return themeState.month === undefined && PREFERRED_SETTINGS.includes(getCurrentThemeSetting());
}

/**
 * Applique un mois à la demande de l'utilisateur, en gardant la variante
 * @param {number} month
 */
function applyMonth(month) {
  return isFollowingSystem() ? applySystemMonth(month, [getCurrentThemeSetting()]) : applyTheme(themeState.type, month);
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
    reportThemeChange(await applyMonth(getAdjacentMonth(getDisplayedMonth(), stepsToApply)));
  });
}

/**
 * Revient au mois réel en gardant la variante
 */
function goToCurrentMonth() {
  return enqueueThemeChange(async () => {
    pendingMonthSteps = 0;
    reportThemeChange(await applyMonth(getCurrentMonth()));
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
  // Le mois réel a pu changer : le lien « mois en cours » de l'infobulle en dépend
  updateStatusBarItem();

  const config = vscode.workspace.getConfiguration('365DayNight');
  if (!config.get('enable', false)) {
    lastAutoFailurePeriod = undefined;
    return enqueueThemeChange(async () => {
      await leaveSystemMode();
      await forgetAutoPeriod();
    });
  }

  const now = new Date();
  if (config.get('mode', 'auto') === 'system') {
    return checkSystemMode(now);
  }

  const themeType = getAutoThemeType(config.get('mode', 'auto'), now.getHours());
  const period = getAutoPeriod(themeType, now);

  return enqueueThemeChange(async () => {
    if (!await leaveSystemMode() || period === globalState.get(LAST_AUTO_PERIOD_KEY)) {
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
 * Met en place le mode system, puis met à jour le mois à chaque nouveau mois réel
 * @param {Date} now
 */
function checkSystemMode(now) {
  const period = getAutoPeriod('System', now);

  return enqueueThemeChange(async () => {
    const backup = globalState.get(SYSTEM_BACKUP_KEY);
    if (backup?.complete && period === globalState.get(LAST_AUTO_PERIOD_KEY)) {
      return;
    }
    // Avec plusieurs fenêtres ouvertes, seule celle qui a le focus sauvegarde les réglages : une autre
    // risquerait de lire les valeurs déjà écrites et de les prendre pour celles de l'utilisateur.
    if (!backup && !vscode.window.state.focused) {
      return;
    }

    const result = await setUpSystemMode(getSelectedMonth(globalState.get(SELECTED_MONTH_KEY), now) ?? now.getMonth() + 1);
    if (result.ok) {
      await globalState.update(LAST_AUTO_PERIOD_KEY, period);
      lastAutoFailurePeriod = undefined;
    } else if (lastAutoFailurePeriod !== period) {
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
  // Les réglages suivent Settings Sync : leurs valeurs d'origine doivent les suivre
  globalState.setKeysForSync([SYSTEM_BACKUP_KEY]);

  // Créer les trois éléments du bouton, ‹ 10 DRK ›, et lire le thème actif au démarrage.
  // À droite de la barre d'état, la priorité la plus haute est la plus à gauche. Ces valeurs très
  // proches, sous celles de VS Code (100,1 à 100,5), gardent les trois éléments côte à côte :
  // sans place, VS Code masque d'abord les éléments les plus à gauche.
  previousMonthItem = createStatusBarControl('previousMonth', 'Previous month', 99.12, 'extension.previousMonth', '$(chevron-left)');
  statusBarItem = createStatusBarControl('theme', 'Light and Dark', 99.11, 'extension.toggleTheme', '');
  nextMonthItem = createStatusBarControl('nextMonth', 'Next month', 99.1, 'extension.nextMonth', '$(chevron-right)');
  syncThemeState();
  statusBarItem.show();

  // Enregistrer les commandes
  context.subscriptions.push(
    vscode.commands.registerCommand('extension.toggleTheme', toggleTheme),
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
    vscode.debug.onDidChangeActiveDebugSession(updateStatusBarItem),
    vscode.workspace.onDidChangeConfiguration((event) => {
      // Le sélecteur de thèmes signale le changement à l'aperçu, avant d'écrire le réglage :
      // son nom n'est connu qu'ici, à la validation
      if (event.affectsConfiguration('workbench.colorTheme')) {
        onActiveThemeChanged();
      }
      if (event.affectsConfiguration(DETECT_COLOR_SCHEME_SETTING) || event.affectsConfiguration('window.autoDetectHighContrast')) {
        syncThemeState();
      }
      if (PREFERRED_SETTINGS.some((setting) => event.affectsConfiguration(setting))) {
        onPreferredThemeChanged();
      }
      if (event.affectsConfiguration('365DayNight.toggleIncludesHighContrast')) {
        updateStatusBarItem();
      }
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
  const includeHighContrast = vscode.workspace.getConfiguration('365DayNight').get('toggleIncludesHighContrast', false);
  const name = getThemeDisplayName(themeState);
  const followingSystem = isFollowingSystem();
  const hint = followingSystem && themeState.month === undefined && !canBringBack365Theme()
    ? SYSTEM_DECIDES_HINT
    : getSwitchHint(themeState, includeHighContrast, followingSystem);

  // La barre d'état change de fond pendant un débogage : la couleur du mois n'y serait plus lisible
  const color = vscode.debug.activeDebugSession ? undefined : new vscode.ThemeColor('365DayNight.statusBarButton');
  for (const item of [previousMonthItem, statusBarItem, nextMonthItem]) {
    item.color = color;
  }

  statusBarItem.text = getStatusBarText(themeState);
  statusBarItem.tooltip = createThemeTooltip(name, hint, followingSystem);
  statusBarItem.accessibilityInformation = { label: `${name}. ${hint}`, role: 'button' };

  updateMonthArrow(previousMonthItem, 'Previous month', -1);
  updateMonthArrow(nextMonthItem, 'Next month', 1);
}

/**
 * Affiche une flèche avec un thème 365, en nommant le mois auquel elle mène
 * @param {vscode.StatusBarItem} item
 * @param {string} name
 * @param {number} steps
 */
function updateMonthArrow(item, name, steps) {
  if (themeState.month === undefined) {
    item.hide();
    return;
  }
  const label = `${name}: ${MONTH_NAMES[getAdjacentMonth(themeState.month, steps) - 1]}`;
  item.tooltip = label;
  item.accessibilityInformation = { label, role: 'button' };
  item.show();
}

/**
 * Infobulle du bouton central : le thème, l'effet d'un clic et les liens utiles
 * @param {string} name
 * @param {string} hint
 * @param {boolean} followingSystem En mode system, le contraste élevé dépend du système
 */
function createThemeTooltip(name, hint, followingSystem) {
  const links = [];
  if (themeState.month !== undefined && themeState.month !== getCurrentMonth()) {
    links.push('[Back to the current month](command:extension.currentMonth)');
  }
  if (themeState.type !== ThemeType.HIGH_CONTRAST && !followingSystem) {
    links.push('[High Contrast](command:extension.setHighContrastTheme)');
  }

  const tooltip = new vscode.MarkdownString([`**${name}**`, hint, links.join(' · ')].filter(Boolean).join('\n\n'));
  // Seules ces deux commandes peuvent être lancées depuis l'infobulle
  tooltip.isTrusted = { enabledCommands: ['extension.currentMonth', 'extension.setHighContrastTheme'] };
  return tooltip;
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
