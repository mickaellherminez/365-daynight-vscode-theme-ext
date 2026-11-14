// Translations of the texts that the scripts write into the page.
// The build places the current language's file from site/i18n/ in <script id="i18n">,
// so the page never loads another file or flashes English before its own language.

const data = JSON.parse(document.getElementById('i18n').textContent);

/** Language code of the page, for example "fr". */
export const lang = data.meta.code;

const numberLocale = data.meta.numberLocale || lang;
const formats = new Map();

// Elision of the language, from meta.elision: a short word before a value that starts with a vowel,
// as in French "de" + "avril" → "d’avril". Only the languages that give it are concerned. A word
// before "h" keeps its full form, since French elides before some h and not others.
const elisions = data.meta.elision || {};
const VOWEL = /^[aeiouyàâäæéèêëîïôöœùûü]/i;
const LAST_WORD = /(^|[\s(«“])(\p{L}+) $/u;

/** The text placed before a value, with its last word elided when the language does so. */
function elide(before, item) {
  const word = before.match(LAST_WORD)?.[2];
  const short = word && elisions[word.toLowerCase()];
  if (!short || !VOWEL.test(String(item))) return before;
  const cased = word[0] === word[0].toLowerCase() ? short : short[0].toUpperCase() + short.slice(1);
  return before.slice(0, before.length - word.length - 1) + cased;
}

/** The parts of a translated text: plain strings, and the values given for its {{placeholders}}. */
function parts(key, vars) {
  const pieces = template(key).split(/(\{\{\w+\}\})/);
  return pieces.map((part, index) => {
    const name = part.match(/^\{\{(\w+)\}\}$/)?.[1];
    if (name) return value(key, vars, name);
    const next = pieces[index + 1]?.match(/^\{\{(\w+)\}\}$/)?.[1];
    return next ? elide(part, value(key, vars, next)) : part;
  });
}

function template(key) {
  const text = key.split('.').reduce((node, part) => (node == null ? node : node[part]), data.js);
  if (typeof text !== 'string') throw new Error(`Missing translation: ${key}`);
  return text;
}

function value(key, vars, name) {
  if (!(name in vars)) throw new Error(`Missing value for {{${name}}} in ${key}`);
  return vars[name];
}

/**
 * Text of a key such as "chart.summary", with {{name}} replaced by vars.name.
 * A missing key is an error: the build checks that every language has every key.
 * @param {string} key
 * @param {Record<string, string | number | {text: string}>} [vars]
 */
export function t(key, vars = {}) {
  return parts(key, vars).map(String).join('');
}

/**
 * A technical expression (color code, ratio, ΔE value or range, theme name) that always reads
 * left to right, even inside an Arabic sentence. The whole expression is isolated, with its
 * signs and unit, so the bidirectional algorithm never reorders its parts.
 * @param {string | number} text
 * @param {{code?: boolean}} [options] code: also mark it as code, as for color values
 */
export function ltr(text, { code = false } = {}) {
  return { text: String(text), code, toString() { return this.text; } };
}

/** The element of a technical expression: <bdi dir="ltr">, around <code> when asked. */
export function isolate(expression) {
  const item = typeof expression === 'object' ? expression : ltr(expression);
  const bdi = document.createElement('bdi');
  bdi.dir = 'ltr';
  if (item.code) {
    const code = document.createElement('code');
    code.textContent = item.text;
    bdi.append(code);
  } else bdi.textContent = item.text;
  return bdi;
}

/**
 * Same as t(), as nodes: each value made with ltr() becomes an isolated element,
 * the rest stays plain text. Use it with replaceChildren() wherever such values appear.
 */
export function tNodes(key, vars = {}) {
  const fragment = document.createDocumentFragment();
  parts(key, vars).forEach((item) => {
    if (item && typeof item === 'object') fragment.append(isolate(item));
    else if (item !== '') fragment.append(document.createTextNode(String(item)));
  });
  return fragment;
}

const fullForms = new WeakMap();

/**
 * Write a name into an element of a translated text, such as <span data-month-name>, and elide
 * the word just before it when the language does so: "la palette de <span>" + "avril" reads
 * "la palette d’avril". The word comes back in full for the next name, "de mars".
 */
export function setName(node, name) {
  const before = node.previousSibling;
  if (before?.nodeType === Node.TEXT_NODE) {
    if (!fullForms.has(before)) fullForms.set(before, before.data);
    const text = elide(fullForms.get(before), name);
    // A text node holds plain text: replaceData() changes its characters, never markup.
    if (before.data !== text) before.replaceData(0, before.length, text);
  }
  node.textContent = name;
}

/** A number in the page language, with exactly `digits` decimals (4.5 → "4,5" in French). */
export function num(value, digits = 0) {
  const id = String(digits);
  if (!formats.has(id)) formats.set(id, new Intl.NumberFormat(numberLocale, { minimumFractionDigits: digits, maximumFractionDigits: digits }));
  return formats.get(id).format(value);
}

/** A contrast ratio such as "4.5:1", in the page language. */
export const ratio = (value, digits = 2) => `${num(value, digits)}:1`;

/** Lowercase a name inside a sentence, only in languages that do so (not German). */
export const inSentence = (name) => (data.meta.lowercaseInSentence ? name.toLocaleLowerCase(lang) : name);

/** Month names: { name, short } for each of the twelve months. */
export const monthNames = data.months;

/** A short date such as "13 Nov", in the page language. */
export function shortDate(date) {
  return new Intl.DateTimeFormat(data.meta.dateLocale || lang, { day: 'numeric', month: 'short' }).format(date);
}
