'use strict';

// Logique de choix du thème, sans dépendance à VS Code : elle se teste sans lancer l'éditeur

// Enum pour les types de thèmes (valeurs = suffixes des labels dans package.json)
const ThemeType = {
  LIGHT: 'Light',
  DARK: 'Dark',
  HIGH_CONTRAST: 'High Contrast',
  HIGH_CONTRAST_LIGHT: 'High Contrast Light'
};

// Libellés à 3 lettres du bouton : leur largeur reste stable
const VARIANT_LABELS = {
  [ThemeType.LIGHT]: 'LGT',
  [ThemeType.DARK]: 'DRK',
  [ThemeType.HIGH_CONTRAST]: 'HCT',
  [ThemeType.HIGH_CONTRAST_LIGHT]: 'HCL'
};

// Mois qui ont déjà un thème High Contrast Light : octobre sert d'essai avant les autres mois.
// Doit correspondre aux thèmes déclarés dans package.json (vérifié par les tests).
const HIGH_CONTRAST_LIGHT_MONTHS = [10];

const MONTH_NAMES = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December"
];

// Horaires par défaut du thème clair en mode automatique, au format des réglages
const DEFAULT_TIMES = { dayStart: '07:00', nightStart: '19:00' };

// Heure sur 24 heures, avec ou sans zéro initial : 7:05, 07:05 ou 23:59.
// Le même motif valide les réglages dans package.json.
const TIME_PATTERN = /^([01]?[0-9]|2[0-3]):([0-5][0-9])$/;

// Valeurs de vscode.ColorThemeKind
const ColorThemeKind = {
  LIGHT: 1,
  DARK: 2,
  HIGH_CONTRAST: 3,
  HIGH_CONTRAST_LIGHT: 4
};

// Genre de thème que donne chaque type de thème 365 une fois actif
const KIND_BY_TYPE = {
  [ThemeType.LIGHT]: ColorThemeKind.LIGHT,
  [ThemeType.DARK]: ColorThemeKind.DARK,
  [ThemeType.HIGH_CONTRAST]: ColorThemeKind.HIGH_CONTRAST,
  [ThemeType.HIGH_CONTRAST_LIGHT]: ColorThemeKind.HIGH_CONTRAST_LIGHT
};

// Ce que dit le bouton central quand le système choisit la variante
const SYSTEM_DECIDES_HINT = 'Your system decides between Light and Dark.';

// Réglages préférés de VS Code, utilisés quand il suit le système
const PREFERRED_THEME_SETTINGS = {
  [ColorThemeKind.LIGHT]: 'workbench.preferredLightColorTheme',
  [ColorThemeKind.DARK]: 'workbench.preferredDarkColorTheme',
  [ColorThemeKind.HIGH_CONTRAST]: 'workbench.preferredHighContrastColorTheme',
  [ColorThemeKind.HIGH_CONTRAST_LIGHT]: 'workbench.preferredHighContrastLightColorTheme'
};

// Réglages préférés tenus par le mode system
const SYSTEM_THEME_TYPES = {
  [PREFERRED_THEME_SETTINGS[ColorThemeKind.LIGHT]]: ThemeType.LIGHT,
  [PREFERRED_THEME_SETTINGS[ColorThemeKind.DARK]]: ThemeType.DARK,
  [PREFERRED_THEME_SETTINGS[ColorThemeKind.HIGH_CONTRAST]]: ThemeType.HIGH_CONTRAST,
  [PREFERRED_THEME_SETTINGS[ColorThemeKind.HIGH_CONTRAST_LIGHT]]: ThemeType.HIGH_CONTRAST_LIGHT
};

const THEME_LABEL_PATTERN = new RegExp(`^365 (\\d{2})-([A-Za-z]+) (${Object.values(ThemeType).join('|')})$`);

/**
 * Type de thème correspondant au genre de thème actif indiqué par VS Code
 * @param {number} kind Valeur de vscode.ColorThemeKind
 */
function getThemeTypeFromKind(kind) {
  const type = Object.keys(KIND_BY_TYPE).find((themeType) => KIND_BY_TYPE[themeType] === kind);
  return type ?? ThemeType.LIGHT;
}

/**
 * Genre de thème qu'un thème 365 de ce type donne une fois actif
 * @param {string} themeType
 */
function getThemeKind(themeType) {
  return KIND_BY_TYPE[themeType];
}

/**
 * Indique si un type de thème est l'une des deux variantes à contraste élevé
 * @param {string} themeType
 */
function isHighContrastType(themeType) {
  return themeType === ThemeType.HIGH_CONTRAST || themeType === ThemeType.HIGH_CONTRAST_LIGHT;
}

/**
 * Indique si un mois a un thème de ce type. Seul High Contrast Light manque encore à certains mois.
 * @param {string} themeType
 * @param {number} month Mois, de 1 à 12
 */
function hasThemeType(themeType, month) {
  return themeType !== ThemeType.HIGH_CONTRAST_LIGHT || HIGH_CONTRAST_LIGHT_MONTHS.includes(month);
}

/**
 * Type de thème à appliquer pour un mois : High Contrast Light devient High Contrast pour un mois
 * qui ne l'a pas encore, pour rester en contraste élevé
 * @param {string} themeType
 * @param {number} month Mois, de 1 à 12
 */
function getAvailableThemeType(themeType, month) {
  return hasThemeType(themeType, month) ? themeType : ThemeType.HIGH_CONTRAST;
}

/**
 * Type d'un thème 365 d'après son nom, ou undefined pour tout autre thème
 * @param {string | undefined} themeName
 */
function getThemeNameType(themeName) {
  return getThemeMonth(themeName) === undefined ? undefined : THEME_LABEL_PATTERN.exec(themeName)[3];
}

/**
 * Mois (de 1 à 12) d'un thème 365, ou undefined pour tout autre thème
 * @param {string | undefined} themeName
 */
function getThemeMonth(themeName) {
  const match = themeName && THEME_LABEL_PATTERN.exec(themeName);
  if (!match) {
    return undefined;
  }
  const month = Number(match[1]);
  return MONTH_NAMES[month - 1] === match[2] && hasThemeType(match[3], month) ? month : undefined;
}

/**
 * État du thème actif : son type et, pour un thème 365, son mois
 * @param {string | undefined} themeName
 * @param {number} kind Valeur de vscode.ColorThemeKind
 */
function getThemeState(themeName, kind) {
  return { type: getThemeTypeFromKind(kind), month: getThemeMonth(themeName) };
}

/**
 * Construit le label du thème 365 pour un type et une date, ex. "365 05-May Dark"
 * @param {string} themeType
 * @param {Date} [date]
 */
function getThemeLabel(themeType, date = new Date()) {
  return getThemeLabelForMonth(themeType, date.getMonth() + 1);
}

/**
 * Construit le label du thème 365 pour un type et un mois, ex. "365 05-May Dark"
 * @param {string} themeType
 * @param {number} month Mois, de 1 à 12
 */
function getThemeLabelForMonth(themeType, month) {
  return `365 ${formatMonth(month)}-${MONTH_NAMES[month - 1]} ${themeType}`;
}

/**
 * Nom complet du thème pour l'infobulle et les lecteurs d'écran, ex. "October Dark"
 * @param {{ type: string, month: number | undefined }} state
 */
function getThemeDisplayName(state) {
  return state.month === undefined ? state.type : `${MONTH_NAMES[state.month - 1]} ${state.type}`;
}

/**
 * Ce que fait un clic sur le bouton central
 * @param {{ type: string, month: number | undefined }} state
 * @param {boolean} [includeHighContrast]
 * @param {boolean} [systemDecides] Le mode system est actif : c'est le système qui choisit la variante
 */
function getSwitchHint(state, includeHighContrast = false, systemDecides = false) {
  if (state.month === undefined) {
    return `Click to apply the 365 ${state.type} theme.`;
  }
  return systemDecides
    ? SYSTEM_DECIDES_HINT
    : `Click to switch to ${getNextThemeType(state.type, includeHighContrast, state.month)}.`;
}

/**
 * Année et mois réels d'une date, ex. "2026-10"
 * @param {Date} date
 */
function getRealMonth(date) {
  return `${date.getFullYear()}-${formatMonth(date.getMonth() + 1)}`;
}

/**
 * Sélection à mémoriser pour un mois : elle vaut jusqu'à la fin du mois réel.
 * Choisir le mois réel revient à n'avoir aucune sélection.
 * @param {number} month Mois choisi, de 1 à 12
 * @param {Date} date Date du choix
 * @returns {{ month: number, realMonth: string } | undefined}
 */
function createMonthSelection(month, date) {
  return month === date.getMonth() + 1 ? undefined : { month, realMonth: getRealMonth(date) };
}

/**
 * Mois choisi encore valable à cette date, ou undefined
 * @param {{ month: number, realMonth: string } | undefined} selection
 * @param {Date} date
 */
function getSelectedMonth(selection, date) {
  return selection && selection.realMonth === getRealMonth(date) ? selection.month : undefined;
}

/**
 * Mois sur deux chiffres : le bouton garde la même largeur et les flèches ne bougent pas sous le curseur
 * @param {number} month Mois, de 1 à 12
 */
function formatMonth(month) {
  return month.toString().padStart(2, '0');
}

/**
 * Mois atteint en avançant ou en reculant, décembre étant suivi de janvier
 * @param {number} month Mois de départ, de 1 à 12
 * @param {number} steps Nombre de mois, négatif pour reculer
 */
function getAdjacentMonth(month, steps) {
  return ((month - 1 + steps) % 12 + 12) % 12 + 1;
}

/**
 * Texte du bouton central : le mois et la variante, ex. "10 DRK", ou la variante seule hors thème 365
 * @param {{ type: string, month: number | undefined }} state
 */
function getStatusBarText(state) {
  const variant = VARIANT_LABELS[state.type];
  return state.month === undefined ? variant : `${formatMonth(state.month)} ${variant}`;
}

/**
 * Minutes écoulées depuis minuit pour une heure au format HH:MM, ou undefined si elle est invalide
 * @param {unknown} value
 */
function parseTime(value) {
  const match = typeof value === 'string' ? TIME_PATTERN.exec(value) : null;
  return match ? Number(match[1]) * 60 + Number(match[2]) : undefined;
}

/**
 * Heure au format HH:MM pour un nombre de minutes depuis minuit, ex. 420 -> "07:00"
 * @param {number} minutes
 */
function formatTime(minutes) {
  return `${formatMonth(Math.floor(minutes / 60))}:${formatMonth(minutes % 60)}`;
}

/**
 * Horaires du mode automatique, en minutes depuis minuit. Une heure invalide est remplacée par
 * sa valeur par défaut. Deux heures identiques ne laissent aucune place au jour ou à la nuit :
 * les deux valeurs par défaut sont alors utilisées. Un début de journée placé après le début de
 * la nuit est valable : le thème clair passe minuit.
 * @param {{ dayStart?: unknown, nightStart?: unknown }} times Valeurs des réglages
 * @returns {{ dayStart: number, nightStart: number, problem: string | undefined }}
 */
function resolveSchedule(times) {
  const problems = [];
  const resolved = {};
  for (const name of ['dayStart', 'nightStart']) {
    const value = times[name] ?? DEFAULT_TIMES[name];
    resolved[name] = parseTime(value);
    if (resolved[name] === undefined) {
      resolved[name] = parseTime(DEFAULT_TIMES[name]);
      problems.push(`365DayNight.${name} "${value}" is not a valid time, so ${DEFAULT_TIMES[name]} is used instead. Use the HH:MM format, for example ${DEFAULT_TIMES[name]}.`);
    }
  }
  if (problems.length === 0 && resolved.dayStart === resolved.nightStart) {
    resolved.dayStart = parseTime(DEFAULT_TIMES.dayStart);
    resolved.nightStart = parseTime(DEFAULT_TIMES.nightStart);
    problems.push(`365DayNight.dayStart and 365DayNight.nightStart have the same time, so ${DEFAULT_TIMES.dayStart} and ${DEFAULT_TIMES.nightStart} are used instead.`);
  }
  return { dayStart: resolved.dayStart, nightStart: resolved.nightStart, problem: problems.length ? problems.join(' ') : undefined };
}

/**
 * Type de thème (clair ou sombre) attendu par le mode automatique
 * @param {string} mode Valeur du réglage 365DayNight.mode
 * @param {Date} date Date et heure locales
 * @param {{ dayStart: number, nightStart: number }} [schedule] Horaires, 7:00 et 19:00 par défaut
 */
function getAutoThemeType(mode, date, schedule = resolveSchedule({})) {
  if (mode === 'day') {
    return ThemeType.LIGHT;
  }
  if (mode === 'night') {
    return ThemeType.DARK;
  }
  const minutes = date.getHours() * 60 + date.getMinutes();
  const { dayStart, nightStart } = schedule;
  // Si le jour commence après la nuit, il passe minuit
  const isDay = dayStart < nightStart
    ? minutes >= dayStart && minutes < nightStart
    : minutes >= dayStart || minutes < nightStart;
  return isDay ? ThemeType.LIGHT : ThemeType.DARK;
}

/**
 * Période du mode automatique : elle change avec le jour et la nuit, le mois et l'année
 * @param {string} themeType Type attendu par le mode automatique
 * @param {Date} date
 */
function getAutoPeriod(themeType, date) {
  const month = (date.getMonth() + 1).toString().padStart(2, '0');
  return `${date.getFullYear()}-${month} ${themeType}`;
}

/**
 * Type de thème suivant dans le cycle du bouton. Light et Dark alternent. Les deux variantes à
 * contraste élevé alternent entre elles, pour qu'un clic ne quitte pas le contraste élevé par erreur.
 * Avec includeHighContrast, le cycle passe par les quatre variantes : Light, Dark, High Contrast,
 * High Contrast Light. Un mois qui n'a pas encore High Contrast Light passe de High Contrast à Light :
 * un clic doit toujours agir.
 * @param {string} themeType
 * @param {boolean} [includeHighContrast]
 * @param {number} [month] Mois affiché, de 1 à 12 : sans mois, High Contrast Light n'est pas proposé
 */
function getNextThemeType(themeType, includeHighContrast = false, month = undefined) {
  switch (themeType) {
    case ThemeType.LIGHT:
      return ThemeType.DARK;
    case ThemeType.DARK:
      return includeHighContrast ? ThemeType.HIGH_CONTRAST : ThemeType.LIGHT;
    case ThemeType.HIGH_CONTRAST:
      return hasThemeType(ThemeType.HIGH_CONTRAST_LIGHT, month) ? ThemeType.HIGH_CONTRAST_LIGHT : ThemeType.LIGHT;
    default:
      return includeHighContrast ? ThemeType.LIGHT : ThemeType.HIGH_CONTRAST;
  }
}

/**
 * Type de thème à appliquer au clic sur le bouton : depuis un thème qui n'est pas un thème 365,
 * le premier clic applique le thème 365 du même type au lieu d'avancer dans le cycle
 * @param {{ type: string, month: number | undefined }} state
 * @param {boolean} [includeHighContrast]
 */
function getToggleThemeType(state, includeHighContrast = false) {
  return state.month === undefined ? state.type : getNextThemeType(state.type, includeHighContrast, state.month);
}

/**
 * Indique si un réglage de workspace empêcherait un thème de s'appliquer :
 * il l'emporte sur le réglage utilisateur, seul à être écrit par l'extension
 * @param {{ workspaceValue?: unknown, workspaceFolderValue?: unknown } | undefined} inspection
 * @param {string} themeLabel
 */
function isThemeMaskedByWorkspace(inspection, themeLabel) {
  const workspaceTheme = inspection?.workspaceFolderValue ?? inspection?.workspaceValue;
  return workspaceTheme !== undefined && workspaceTheme !== themeLabel;
}

/**
 * Réglage qui décide du thème actif, dans l'ordre de VS Code : le contraste élevé du système,
 * puis le mode du système, sinon workbench.colorTheme. L'API ne dit pas si le système est en
 * contraste élevé : un genre de thème à contraste élevé est attribué au système, sauf si un autre
 * réglage contient lui-même un thème 365 de ce genre :
 * - workbench.colorTheme, quand VS Code ne suit pas le mode du système ;
 * - la préférence claire ou sombre, quand il le suit et que la préférence de contraste élevé ne
 *   contient pas un tel thème : le sélecteur de thèmes écrit dans la préférence du mode actuel du
 *   système, quel que soit le thème choisi.
 * @param {number} kind Valeur de vscode.ColorThemeKind
 * @param {{ colorTheme: string | undefined, followsColorScheme: boolean, followsHighContrast: boolean,
 *   preferredThemes?: Record<string, string | undefined> }} context preferredThemes : valeur de chaque réglage préféré
 */
function getActiveThemeSetting(kind, { colorTheme, followsColorScheme, followsHighContrast, preferredThemes = {} }) {
  if (!isHighContrastType(getThemeTypeFromKind(kind))) {
    return followsColorScheme ? PREFERRED_THEME_SETTINGS[kind] : 'workbench.colorTheme';
  }
  const isOfActiveKind = (themeName) => {
    const type = getThemeNameType(themeName);
    return type !== undefined && getThemeKind(type) === kind;
  };
  const highContrastSetting = PREFERRED_THEME_SETTINGS[kind];
  if (!followsColorScheme) {
    return followsHighContrast && !isOfActiveKind(colorTheme) ? highContrastSetting : 'workbench.colorTheme';
  }
  if (followsHighContrast && isOfActiveKind(preferredThemes[highContrastSetting])) {
    return highContrastSetting;
  }
  const schemeSetting = [ColorThemeKind.LIGHT, ColorThemeKind.DARK]
    .map((schemeKind) => PREFERRED_THEME_SETTINGS[schemeKind])
    .find((setting) => isOfActiveKind(preferredThemes[setting]));
  return schemeSetting ?? (followsHighContrast ? highContrastSetting : 'workbench.colorTheme');
}

/**
 * Valeurs des réglages préférés pour un mois en mode system. Un réglage dont le mois n'a pas encore
 * de thème vaut undefined : il garde la valeur de l'utilisateur.
 * @param {number} month Mois, de 1 à 12
 * @returns {Record<string, string | undefined>}
 */
function getSystemThemeSettings(month) {
  return Object.fromEntries(Object.entries(SYSTEM_THEME_TYPES).map(([setting, type]) => [
    setting,
    hasThemeType(type, month) ? getThemeLabelForMonth(type, month) : undefined
  ]));
}

/**
 * Indique si un réglage préféré contient ce que le mode system y écrit, pour n'importe quel mois.
 * Toute autre valeur est un choix de l'utilisateur.
 * @param {string} setting
 * @param {string | undefined} value
 */
function isSystemThemeValue(setting, value) {
  const month = getThemeMonth(value);
  return month !== undefined && value === getThemeLabelForMonth(SYSTEM_THEME_TYPES[setting], month);
}

module.exports = {
  ThemeType,
  SYSTEM_DECIDES_HINT,
  MONTH_NAMES,
  ColorThemeKind,
  getThemeTypeFromKind,
  getThemeKind,
  isHighContrastType,
  hasThemeType,
  getAvailableThemeType,
  getThemeMonth,
  getThemeState,
  getThemeLabel,
  getThemeLabelForMonth,
  createMonthSelection,
  getSelectedMonth,
  getAdjacentMonth,
  getStatusBarText,
  getThemeDisplayName,
  getSwitchHint,
  getAutoThemeType,
  parseTime,
  formatTime,
  resolveSchedule,
  getAutoPeriod,
  getNextThemeType,
  getToggleThemeType,
  isThemeMaskedByWorkspace,
  getActiveThemeSetting,
  getSystemThemeSettings,
  isSystemThemeValue
};
