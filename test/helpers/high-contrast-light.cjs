// Les tests du repli vers High Contrast ont besoin de mois sans thème High Contrast Light.
// Depuis que les 12 mois en ont un, ils retrouvent la situation où seul octobre en avait un.
const { HIGH_CONTRAST_LIGHT_MONTHS } = require('../../theme-logic');

const ALL_MONTHS = [...HIGH_CONTRAST_LIGHT_MONTHS];

function onlyOctober() {
	HIGH_CONTRAST_LIGHT_MONTHS.splice(0, HIGH_CONTRAST_LIGHT_MONTHS.length, 10);
}

function allMonths() {
	HIGH_CONTRAST_LIGHT_MONTHS.splice(0, HIGH_CONTRAST_LIGHT_MONTHS.length, ...ALL_MONTHS);
}

module.exports = { ALL_MONTHS, onlyOctober, allMonths };
