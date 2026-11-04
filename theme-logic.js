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

/**
 * Déduit le type de thème à partir du nom du thème VS Code
 * @param {string | undefined} themeName
 */
function getThemeTypeFromName(themeName) {
  // "High Contrast" doit être testé avant "Dark" (ex. "Dark High Contrast")
  if (themeName && themeName.includes('High Contrast')) {
    return ThemeType.HIGH_CONTRAST;
  }
  if (themeName && themeName.includes('Dark')) {
    return ThemeType.DARK;
  }
  return ThemeType.LIGHT;
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

module.exports = {
  ThemeType,
  MONTH_NAMES,
  getThemeTypeFromName,
  getThemeLabel,
  getAutoThemeType,
  getNextThemeType
};
