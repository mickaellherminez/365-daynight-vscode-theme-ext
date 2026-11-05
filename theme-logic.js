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
 */
function getSwitchHint(state, includeHighContrast = false) {
  return state.month === undefined
    ? `Click to apply the 365 ${state.type} theme.`
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

module.exports = {
  ThemeType,
  MONTH_NAMES,
  ColorThemeKind,
  getThemeTypeFromKind,
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
  getAutoPeriod,
  getNextThemeType,
  getToggleThemeType,
  isThemeMaskedByWorkspace
};
