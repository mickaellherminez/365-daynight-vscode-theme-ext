'use strict';

// Vérifie un paquet .vsix décompressé avant sa publication.
// Usage : node scripts/verify-package.cjs <dossier décompressé>

const fs = require('fs');
const path = require('path');

const root = process.argv[2];
if (!root) {
  console.error('Usage: node scripts/verify-package.cjs <unzipped vsix folder>');
  process.exit(2);
}

const extensionDir = path.join(root, 'extension');
const problems = [];

/**
 * @param {string} relativePath Chemin relatif à la racine de l'extension
 */
function exists(relativePath) {
  return fs.existsSync(path.join(extensionDir, relativePath));
}

/**
 * Vérifie un fichier JavaScript et, récursivement, les fichiers locaux qu'il charge
 * @param {string} relativePath
 * @param {Set<string>} seen
 */
function checkScript(relativePath, seen = new Set()) {
  const normalized = path.normalize(relativePath);
  if (seen.has(normalized)) {
    return;
  }
  seen.add(normalized);

  if (!exists(normalized)) {
    problems.push(`Missing script: ${normalized}`);
    return;
  }

  const source = fs.readFileSync(path.join(extensionDir, normalized), 'utf8');
  for (const [, target] of source.matchAll(/require\(['"](\.{1,2}\/[^'"]+)['"]\)/g)) {
    const resolved = path.join(path.dirname(normalized), target);
    checkScript(resolved.endsWith('.js') ? resolved : `${resolved}.js`, seen);
  }
}

const packagedManifestPath = path.join(extensionDir, 'package.json');
if (!fs.existsSync(packagedManifestPath)) {
  console.error(`No extension/package.json in ${root}`);
  process.exit(1);
}

const manifest = JSON.parse(fs.readFileSync(packagedManifestPath, 'utf8'));
const { version: expectedVersion } = require('../package.json');

if (manifest.version !== expectedVersion) {
  problems.push(`Version ${manifest.version} does not match package.json (${expectedVersion})`);
}

checkScript(manifest.main);

if (manifest.icon && !exists(manifest.icon)) {
  problems.push(`Missing icon: ${manifest.icon}`);
}

const themes = manifest.contributes.themes;
for (const theme of themes) {
  if (!exists(theme.path)) {
    problems.push(`Missing theme: ${theme.path} (${theme.label})`);
  }
}

if (problems.length > 0) {
  console.error(problems.join('\n'));
  console.error(`\n${problems.length} problem(s) in the package`);
  process.exit(1);
}

console.log(`Package OK: version ${manifest.version}, ${themes.length} themes`);
