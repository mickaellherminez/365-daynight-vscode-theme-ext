'use strict';

// Faux module vscode : fait tourner le vrai extension.js sans lancer l'éditeur,
// pour simuler ce que VS Code ne permet pas de provoquer (échec d'écriture, réglage de workspace...)

const Module = require('module');
const path = require('path');

const EXTENSION_PATH = path.resolve(__dirname, '../../extension.js');
const THEME_SETTING = 'workbench.colorTheme';

const ColorThemeKind = { Light: 1, Dark: 2, HighContrast: 3, HighContrastLight: 4 };

/**
 * Genre du thème d'après son nom : suffit pour les thèmes utilisés dans les tests
 * @param {string} themeName
 */
function kindOf(themeName) {
  if (themeName.includes('High Contrast')) {
    return ColorThemeKind.HighContrast;
  }
  return themeName.includes('Dark') || themeName === 'Monokai' ? ColorThemeKind.Dark : ColorThemeKind.Light;
}

/**
 * Active extension.js avec un faux VS Code
 * @param {object} [options]
 * @param {string} [options.theme] Thème actif au démarrage
 * @param {Record<string, unknown>} [options.settings] Réglages utilisateur
 * @param {Record<string, unknown>} [options.workspaceSettings] Réglages de workspace
 * @param {boolean} [options.holdThemeEvents] Retenir les changements de thème jusqu'à deliverThemeEvent()
 * @param {boolean} [options.systemHighContrast] Le système d'exploitation est en contraste élevé
 * @param {boolean} [options.failWrites] Faire échouer les écritures dès le démarrage
 * @param {Map<string, unknown>} [options.globalState] Mémoire de l'extension, à réutiliser pour simuler
 *   un rechargement, une nouvelle fenêtre ou un redémarrage
 * @param {Date} [options.now] Date et heure simulées
 */
function loadExtension(options = {}) {
  const theme = options.theme || 'Monokai';
  const userSettings = new Map(Object.entries({ [THEME_SETTING]: theme, ...options.settings }));
  const workspaceSettings = new Map(Object.entries(options.workspaceSettings || {}));
  const effective = (key) => (workspaceSettings.has(key) ? workspaceSettings.get(key) : userSettings.get(key));

  // VS Code applique d'abord le contraste élevé du système (activé par défaut), puis le mode du système
  const followsSystemHighContrast = () => Boolean(options.systemHighContrast) && effective('window.autoDetectHighContrast') !== false;
  const followsSystem = () => followsSystemHighContrast() || effective('window.autoDetectColorScheme') === true;

  const fake = {
    writes: [],
    infoMessages: [],
    errorMessages: [],
    failWrites: Boolean(options.failWrites),
    debugSession: undefined,
    debugListeners: [],
    /** Démarre ou arrête une session de débogage */
    setDebugging(active) {
      fake.debugSession = active ? { name: 'test' } : undefined;
      fake.debugListeners.forEach((listener) => listener(fake.debugSession));
    },
    statusBarItems: [],
    /** Élément central de la barre d'état, celui qui change de variante */
    get statusBarItem() {
      return fake.statusBarItems.find((item) => item.command === 'extension.toggleTheme');
    },
    /** Élément de la barre d'état relié à une commande */
    itemFor(command) {
      return fake.statusBarItems.find((item) => item.command === command);
    },
    commands: new Map(),
    themeListeners: [],
    configListeners: [],
    pendingThemeEvents: [],
    intervals: [],
    timeouts: new Map(),
    activeKind: followsSystemHighContrast() ? ColorThemeKind.HighContrast : kindOf(effective(THEME_SETTING))
  };

  const deliverThemeEvent = () => {
    const kind = fake.pendingThemeEvents.shift();
    if (kind !== undefined) {
      fake.activeKind = kind;
      fake.themeListeners.forEach((listener) => listener({ kind }));
    }
  };

  const vscode = {
    ColorThemeKind,
    ConfigurationTarget: { Global: 1, Workspace: 2, WorkspaceFolder: 3 },
    StatusBarAlignment: { Left: 1, Right: 2 },
    MarkdownString: class {
      constructor(value = '') {
        this.value = value;
      }
    },
    ThemeColor: class {
      constructor(id) {
        this.id = id;
      }
    },
    debug: {
      get activeDebugSession() {
        return fake.debugSession;
      },
      onDidChangeActiveDebugSession(listener) {
        fake.debugListeners.push(listener);
        return { dispose() {} };
      }
    },
    window: {
      get activeColorTheme() {
        return { kind: fake.activeKind };
      },
      createStatusBarItem(id, alignment, priority) {
        const item = {
          id,
          alignment,
          priority,
          text: '',
          visible: false,
          show() {
            item.visible = true;
          },
          hide() {
            item.visible = false;
          },
          dispose() {}
        };
        fake.statusBarItems.push(item);
        return item;
      },
      showInformationMessage: (message) => fake.infoMessages.push(message),
      showErrorMessage: (message) => fake.errorMessages.push(message),
      onDidChangeActiveColorTheme(listener) {
        fake.themeListeners.push(listener);
        return { dispose() {} };
      }
    },
    commands: {
      registerCommand(id, handler) {
        fake.commands.set(id, handler);
        return { dispose() {} };
      }
    },
    workspace: {
      getConfiguration(section) {
        const fullKey = (key) => (section ? `${section}.${key}` : key);
        return {
          get(key, defaultValue) {
            const value = effective(fullKey(key));
            return value === undefined ? defaultValue : value;
          },
          inspect(key) {
            return { globalValue: userSettings.get(fullKey(key)), workspaceValue: workspaceSettings.get(fullKey(key)) };
          },
          async update(key, value) {
            if (fake.failWrites) {
              throw new Error('simulated write failure');
            }
            fake.writes.push(value);
            userSettings.set(fullKey(key), value);
            if (fullKey(key) === THEME_SETTING && effective(THEME_SETTING) === value && !followsSystem()) {
              fake.pendingThemeEvents.push(kindOf(value));
              if (!options.holdThemeEvents) {
                deliverThemeEvent();
              }
            }
          }
        };
      },
      onDidChangeConfiguration(listener) {
        fake.configListeners.push(listener);
        return { dispose() {} };
      }
    }
  };

  // Le temps est piloté par le test : les vrais minuteurs de mocha restent intacts
  const realTimers = {
    setInterval: global.setInterval,
    clearInterval: global.clearInterval,
    setTimeout: global.setTimeout,
    clearTimeout: global.clearTimeout
  };
  let nextTimerId = 1;
  global.setInterval = (callback) => {
    fake.intervals.push(callback);
    return nextTimerId++;
  };
  global.clearInterval = () => {};
  global.setTimeout = (callback) => {
    const id = nextTimerId++;
    fake.timeouts.set(id, callback);
    return id;
  };
  global.clearTimeout = (id) => fake.timeouts.delete(id);

  const RealDate = global.Date;
  let currentTime = options.now ? options.now.getTime() : RealDate.now();
  global.Date = class extends RealDate {
    constructor(...args) {
      if (args.length === 0) {
        super(currentTime);
      } else {
        super(...args);
      }
    }

    static now() {
      return currentTime;
    }
  };

  const globalState = options.globalState || new Map();
  fake.globalState = globalState;
  fake.globalStateWrites = 0;
  const memento = {
    get: (key, defaultValue) => (globalState.has(key) ? globalState.get(key) : defaultValue),
    async update(key, value) {
      fake.globalStateWrites++;
      if (value === undefined) {
        globalState.delete(key);
      } else {
        globalState.set(key, value);
      }
    }
  };

  const realLoad = Module._load;
  Module._load = function (request, ...rest) {
    return request === 'vscode' ? vscode : realLoad.call(this, request, ...rest);
  };

  delete require.cache[EXTENSION_PATH];
  const extension = require(EXTENSION_PATH);
  const api = extension.activate({ subscriptions: [], globalState: memento });

  const settle = () => new Promise((resolve) => setImmediate(resolve));

  return Object.assign(fake, {
    getThemeState: api.getThemeState,
    theme: () => effective(THEME_SETTING),
    deliverThemeEvent,
    settle,
    /** Avance l'horloge simulée */
    setNow(date) {
      currentTime = date.getTime();
    },
    /** Modifie un réglage comme le ferait l'utilisateur et prévient l'extension */
    async setSetting(key, value) {
      userSettings.set(key, value);
      const affectsConfiguration = (section) => key === section || key.startsWith(`${section}.`);
      fake.configListeners.forEach((listener) => listener({ affectsConfiguration }));
      await settle();
    },
    /** Retire un réglage de workspace */
    removeWorkspaceSetting(key) {
      workspaceSettings.delete(key);
    },
    /** Choisit un thème hors de l'extension, sans prévenir encore l'extension */
    async configurationUpdate(themeName) {
      userSettings.set(THEME_SETTING, themeName);
      await settle();
    },
    /**
     * Choisit un thème dans le sélecteur de thèmes de VS Code, dans le même ordre que lui :
     * l'aperçu active le thème sans écrire le réglage, puis la validation écrit le réglage
     * sans nouveau signal de changement de thème
     */
    async setTheme(themeName) {
      fake.pendingThemeEvents.push(kindOf(themeName));
      deliverThemeEvent();
      userSettings.set(THEME_SETTING, themeName);
      const affectsConfiguration = (section) => THEME_SETTING === section || THEME_SETTING.startsWith(`${section}.`);
      fake.configListeners.forEach((listener) => listener({ affectsConfiguration }));
      await settle();
    },
    /** Exécute une commande de l'extension et attend sa fin */
    async run(commandId) {
      await fake.commands.get(commandId)();
      await settle();
    },
    /** Lance le contrôle périodique du mode automatique */
    async runAutoCheck() {
      fake.intervals.forEach((callback) => callback());
      await settle();
    },
    /** Écoule les délais en attente */
    async runTimeouts() {
      const callbacks = [...fake.timeouts.values()];
      fake.timeouts.clear();
      callbacks.forEach((callback) => callback());
      await settle();
    },
    /** Rétablit l'environnement d'origine */
    dispose() {
      Module._load = realLoad;
      Object.assign(global, realTimers);
      global.Date = RealDate;
      delete require.cache[EXTENSION_PATH];
    }
  });
}

module.exports = { loadExtension };
