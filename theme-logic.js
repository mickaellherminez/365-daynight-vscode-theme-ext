'use strict';

// Logique de choix du thème, sans dépendance à VS Code : elle se teste sans lancer l'éditeur

// Enum pour les types de thèmes (valeurs = suffixes des labels dans package.json)
const ThemeType = {
  LIGHT: 'Light',
  DARK: 'Dark',
  HIGH_CONTRAST: 'High Contrast'
};

// Libellés à 3 lettres du bouton : leur largeur reste stable
const VARIANT_LABELS = {
  [ThemeType.LIGHT]: 'LGT',
  [ThemeType.DARK]: 'DRK',
  [ThemeType.HIGH_CONTRAST]: 'HCT'
};

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

// Ce que dit le bouton central quand le système choisit la variante
const SYSTEM_DECIDES_HINT = 'Your system decides between Light and Dark.';

// Réglages préférés de VS Code, utilisés quand il suit le système
const PREFERRED_THEME_SETTINGS = {
  [ColorThemeKind.LIGHT]: 'workbench.preferredLightColorTheme',
  [ColorThemeKind.DARK]: 'workbench.preferredDarkColorTheme',
  [ColorThemeKind.HIGH_CONTRAST]: 'workbench.preferredHighContrastColorTheme',
  [ColorThemeKind.HIGH_CONTRAST_LIGHT]: 'workbench.preferredHighContrastLightColorTheme'
};

// Réglages préférés tenus par le mode system. Le contraste élevé clair attend ses thèmes.
const SYSTEM_THEME_TYPES = {
  [PREFERRED_THEME_SETTINGS[ColorThemeKind.LIGHT]]: ThemeType.LIGHT,
  [PREFERRED_THEME_SETTINGS[ColorThemeKind.DARK]]: ThemeType.DARK,
  [PREFERRED_THEME_SETTINGS[ColorThemeKind.HIGH_CONTRAST]]: ThemeType.HIGH_CONTRAST
};

const THEME_LABEL_PATTERN = new RegExp(`^365 (\\d{2})-([A-Za-z]+) (?:${Object.values(ThemeType).join('|')})$`);

/**
 * Type de thème correspondant au genre de thème actif indiqué par VS Code
 * @param {number} kind Valeur de vscode.ColorThemeKind
 */
function getThemeTypeFromKind(kind) {
  if (kind === ColorThemeKind.HIGH_CONTRAST || kind === ColorThemeKind.HIGH_CONTRAST_LIGHT) {
    return ThemeType.HIGH_CONTRAST;
  }
  return kind === ColorThemeKind.DARK ? ThemeType.DARK : ThemeType.LIGHT;
}

/**
 * Genre de thème qu'un thème 365 de ce type donne une fois actif.
 * Les thèmes 365 à contraste élevé sont tous sombres.
 * @param {string} themeType
 */
function getThemeKind(themeType) {
  if (themeType === ThemeType.HIGH_CONTRAST) {
    return ColorThemeKind.HIGH_CONTRAST;
  }
  return themeType === ThemeType.DARK ? ColorThemeKind.DARK : ColorThemeKind.LIGHT;
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
  return MONTH_NAMES[month - 1] === match[2] ? month : undefined;
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
    : `Click to switch to ${getNextThemeType(state.type, includeHighContrast)}.`;
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
 * Type de thème suivant dans le cycle du bouton : Light et Dark, avec High Contrast si demandé.
 * Tant que High Contrast n'a pas de variante claire, il mène à Light : un clic doit toujours agir.
 * @param {string} themeType
 * @param {boolean} [includeHighContrast]
 */
function getNextThemeType(themeType, includeHighContrast = false) {
  if (themeType === ThemeType.LIGHT) {
    return ThemeType.DARK;
  }
  if (themeType === ThemeType.DARK && includeHighContrast) {
    return ThemeType.HIGH_CONTRAST;
  }
  return ThemeType.LIGHT;
}

/**
 * Type de thème à appliquer au clic sur le bouton : depuis un thème qui n'est pas un thème 365,
 * le premier clic applique le thème 365 du même type au lieu d'avancer dans le cycle
 * @param {{ type: string, month: number | undefined }} state
 * @param {boolean} [includeHighContrast]
 */
function getToggleThemeType(state, includeHighContrast = false) {
  return state.month === undefined ? state.type : getNextThemeType(state.type, includeHighContrast);
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
 * contraste élevé : un genre de thème à contraste élevé est attribué au système, sauf si le
 * réglage workbench.colorTheme contient lui-même un thème 365 à contraste élevé et que le genre
 * actif est le sien : un genre à contraste élevé clair ne peut donc pas venir de ce réglage.
 * @param {number} kind Valeur de vscode.ColorThemeKind
 * @param {{ colorTheme: string | undefined, followsColorScheme: boolean, followsHighContrast: boolean }} context
 */
function getActiveThemeSetting(kind, { colorTheme, followsColorScheme, followsHighContrast }) {
  const isHighContrast = getThemeTypeFromKind(kind) === ThemeType.HIGH_CONTRAST;
  if (isHighContrast) {
    const pickedByHand = !followsColorScheme && kind === getThemeKind(ThemeType.HIGH_CONTRAST)
      && getThemeMonth(colorTheme) !== undefined && colorTheme.endsWith(ThemeType.HIGH_CONTRAST);
    return followsHighContrast && !pickedByHand ? PREFERRED_THEME_SETTINGS[kind] : 'workbench.colorTheme';
  }
  return followsColorScheme ? PREFERRED_THEME_SETTINGS[kind] : 'workbench.colorTheme';
}

/**
 * Valeurs des réglages préférés pour un mois en mode system
 * @param {number} month Mois, de 1 à 12
 * @returns {Record<string, string>}
 */
function getSystemThemeSettings(month) {
  return Object.fromEntries(
    Object.entries(SYSTEM_THEME_TYPES).map(([setting, type]) => [setting, getThemeLabelForMonth(type, month)])
  );
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
  resolveSchedule,
  getAutoPeriod,
  getNextThemeType,
  getToggleThemeType,
  isThemeMaskedByWorkspace,
  getActiveThemeSetting,
  getSystemThemeSettings,
  isSystemThemeValue
};
