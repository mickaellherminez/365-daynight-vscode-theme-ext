'use strict';

// Logique de choix du thème, sans dépendance à VS Code : elle se teste sans lancer l'éditeur

// Enum pour les types de thèmes (valeurs = suffixes des labels dans package.json)
const ThemeType = {
  LIGHT: 'Light',
  DARK: 'Dark',
  HIGH_CONTRAST: 'High Contrast'
};

const MONTH_NAMES = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December"
];

// Plage horaire du thème clair en mode automatique (7h - 19h)
const DAY_START_HOUR = 7;
const NIGHT_START_HOUR = 19;

// Valeurs de vscode.ColorThemeKind
const ColorThemeKind = {
  LIGHT: 1,
  DARK: 2,
  HIGH_CONTRAST: 3,
  HIGH_CONTRAST_LIGHT: 4
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
  const month = date.getMonth();
  const monthNumber = (month + 1).toString().padStart(2, '0');
  return `365 ${monthNumber}-${MONTH_NAMES[month]} ${themeType}`;
}

/**
 * Type de thème (clair ou sombre) attendu par le mode automatique
 * @param {string} mode Valeur du réglage 365DayNight.mode
 * @param {number} hour Heure locale, de 0 à 23
 */
function getAutoThemeType(mode, hour) {
  if (mode === 'day') {
    return ThemeType.LIGHT;
  }
  if (mode === 'night') {
    return ThemeType.DARK;
  }
  return hour >= DAY_START_HOUR && hour < NIGHT_START_HOUR ? ThemeType.LIGHT : ThemeType.DARK;
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
 * Type de thème suivant dans le cycle du bouton : Light, Dark, High Contrast, puis Light
 * @param {string} themeType
 */
function getNextThemeType(themeType) {
  if (themeType === ThemeType.LIGHT) {
    return ThemeType.DARK;
  }
  if (themeType === ThemeType.DARK) {
    return ThemeType.HIGH_CONTRAST;
  }
  return ThemeType.LIGHT;
}

/**
 * Type de thème à appliquer au clic sur le bouton : depuis un thème qui n'est pas un thème 365,
 * le premier clic applique le thème 365 du même type au lieu d'avancer dans le cycle
 * @param {{ type: string, month: number | undefined }} state
 */
function getToggleThemeType(state) {
  return state.month === undefined ? state.type : getNextThemeType(state.type);
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

module.exports = {
  ThemeType,
  MONTH_NAMES,
  ColorThemeKind,
  getThemeTypeFromKind,
  getThemeMonth,
  getThemeState,
  getThemeLabel,
  getAutoThemeType,
  getAutoPeriod,
  getNextThemeType,
  getToggleThemeType,
  isThemeMaskedByWorkspace
};
