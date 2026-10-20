"""Audit d'accessibilité des thèmes : contrastes WCAG et distinction des couleurs pour les daltoniens.

Usage :
    python3 scripts/themes/audit.py                      # tous les thèmes de package.json
    python3 scripts/themes/audit.py themes/365-10-*.json # thèmes choisis
    python3 scripts/themes/audit.py -v ...               # affiche aussi les contrôles réussis

Code de sortie 1 si au moins un contrôle échoue.
"""
import itertools
import json
import os
import re
import sys

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from colorlib import CVD, VIEWS, contrast, delta_e, over  # noqa: E402

ROOT = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

# Scope TextMate représentatif de chaque catégorie de jeton
TOKEN_PROBES = {
    'commentaire': 'comment', 'mot-clé': 'keyword', 'fonction': 'entity.name.function', 'chaîne': 'string',
    'nombre': 'constant.numeric', 'classe': 'entity.name.class', 'variable': 'variable', 'opérateur': 'keyword.operator',
    'ponctuation': 'punctuation', 'balise': 'entity.name.tag', 'attribut': 'entity.other.attribute-name',
    'regex': 'string.regexp', 'clé JSON': 'support.type.property-name.json', 'invalide': 'invalid',
}

# Catégories qui doivent rester distinguables entre elles, y compris pour les daltoniens
DISTINCT_TOKENS = ('mot-clé', 'fonction', 'chaîne', 'nombre', 'classe', 'commentaire', 'variable')
DISTINCT_ALERTS = (('erreur', 'avertissement'), ('erreur', 'info'), ('ajout', 'suppression'),
                   ('ajout', 'modification'), ('modification', 'suppression'))
ALERT_KEYS = {
    'erreur': 'editorError.foreground', 'avertissement': 'editorWarning.foreground', 'info': 'editorInfo.foreground',
    'ajout': 'editorGutter.addedBackground', 'modification': 'editorGutter.modifiedBackground',
    'suppression': 'editorGutter.deletedBackground',
}
MIN_DELTA_E = 10


def load_theme(path):
    """Charge un thème JSONC (VS Code accepte les commentaires et les virgules finales)."""
    text = open(path, encoding='utf-8').read()
    text = re.sub(r'^\s*//.*$', '', text, flags=re.M)
    text = re.sub(r',(\s*[}\]])', r'\1', text)
    return json.loads(text)


def token_colors(theme):
    """Couleur de chaque catégorie de jeton (la dernière règle correspondante l'emporte, comme dans VS Code)."""
    found = {}
    for rule in theme.get('tokenColors', []):
        scopes = rule.get('scope', [])
        if isinstance(scopes, str):
            scopes = scopes.split(',')
        scopes = {s.strip() for s in scopes}
        color = rule.get('settings', {}).get('foreground')
        if not color:
            continue
        for label, probe in TOKEN_PROBES.items():
            if probe in scopes:
                found[label] = color
    found.setdefault('variable', theme.get('colors', {}).get('editor.foreground'))
    return {k: v for k, v in found.items() if v}


def checks(theme, hc):
    """Liste de (libellé, ratio, minimum, statut)."""
    c = theme.get('colors', {})
    g = c.get
    bg = g('editor.background')
    rows = []
    if not bg:
        return [('editor.background', None, 0, 'MANQUANT')]

    def chk(label, fg, back, minimum):
        if fg is None or back is None:
            rows.append((label, None, minimum, 'MANQUANT'))
            return
        back = back if len(back) == 7 else over(back, bg)
        fg = fg if len(fg) == 7 else over(fg, back)
        ratio = contrast(fg, back)
        rows.append((label, ratio, minimum, 'OK' if ratio >= minimum else 'ÉCHEC'))

    text = 7 if hc else 4.5
    sel = g('editor.selectionBackground')
    tbg = g('terminal.background', g('panel.background'))
    tsel = g('terminal.selectionBackground')
    wsel = g('selection.background')

    # Éditeur
    chk('Éditeur : texte / fond', g('editor.foreground'), bg, 7)
    chk('Éditeur : texte / ligne courante', g('editor.foreground'), g('editor.lineHighlightBackground', bg), 7)
    chk('Éditeur : sélection visible / fond', over(sel, bg) if sel else None, bg, 3 if hc else 1.35)
    chk('Éditeur : texte sélectionné', g('editor.selectionForeground') if hc else g('editor.foreground'), sel, 7 if hc else 4.5)
    isel = g('editor.inactiveSelectionBackground')
    chk('Éditeur : sélection inactive visible', over(isel, bg) if isel else None, bg, 1.25)
    chk('Éditeur : texte / sélection inactive', g('editor.foreground'), isel, 4.5)
    line = over(g('editor.lineHighlightBackground', bg), bg)
    chk('Éditeur : sélection ≠ ligne courante', over(sel, bg) if sel else None, line, 1.2)
    chk('Recherche : texte / résultat actif', g('editor.foreground'), g('editor.findMatchBackground'), 4.5)
    chk('Recherche : bordure résultat actif', g('editor.findMatchBorder'), bg, 3)
    chk('Recherche : texte / autres résultats', g('editor.foreground'), g('editor.findMatchHighlightBackground'), 4.5)
    chk('Occurrences : bordure', g('editor.selectionHighlightBorder') or g('editor.wordHighlightBorder'), bg, 3 if hc else 2)
    chk('Numéros de ligne', g('editorLineNumber.foreground'), bg, 4.5)
    chk('Numéro de ligne actif', g('editorLineNumber.activeForeground'), bg, text)
    chk('Curseur', g('editorCursor.foreground'), bg, 3)
    for key in ('editorError.foreground', 'editorWarning.foreground', 'editorInfo.foreground',
                'editorGutter.addedBackground', 'editorGutter.modifiedBackground', 'editorGutter.deletedBackground'):
        chk('Indicateur ' + key, g(key), bg, 3)
    for i in (1, 2, 3):
        chk(f'Paires de crochets {i}', g(f'editorBracketHighlight.foreground{i}'), bg, text)
    chk('Indicateur de focus', g('focusBorder'), bg, 3)

    # Terminal
    chk('Terminal : texte / fond', g('terminal.foreground'), tbg, 7)
    chk('Terminal : sélection visible', over(tsel, tbg) if tsel and tbg else None, tbg, 3 if hc else 1.35)
    chk('Terminal : texte sélectionné', g('terminal.selectionForeground') or g('terminal.foreground'),
        over(tsel, tbg) if tsel and tbg else None, 7 if hc else 4.5)
    tisel = g('terminal.inactiveSelectionBackground')
    chk('Terminal : sélection inactive visible', over(tisel, tbg) if tisel and tbg else None, tbg, 1.25)
    for key in sorted(k for k in c if k.startswith('terminal.ansi')):
        name = key[len('terminal.ansi'):]
        # Noir sur thème sombre et blanc sur thème clair sont prévus pour le fond opposé
        if (theme.get('type') == 'light' and not hc and name in ('White', 'BrightWhite')) or \
                (theme.get('type') != 'light' and name == 'Black'):
            continue
        chk('Terminal ANSI ' + name, g(key), tbg, 3 if name.endswith('Black') else text)

    # Console de débogage (le texte garde sa couleur sur la sélection)
    chk('Console : sélection visible', over(wsel, tbg) if wsel and tbg else None, tbg, 2 if hc else 1.35)
    for key in ('terminal.foreground', 'debugConsole.infoForeground', 'debugConsole.warningForeground',
                'debugConsole.errorForeground', 'debugConsole.sourceForeground'):
        name = key.split('.')[-1]
        chk(f'Console : {name}', g(key), tbg, text)
        chk(f'Console : {name} sélectionné', g(key), over(wsel, tbg) if wsel and tbg else None, 4.5)

    # Interface
    side = g('sideBar.background', bg)
    for fgk, bgk, minimum in [
        ('sideBar.foreground', 'sideBar.background', 7),
        ('list.activeSelectionForeground', 'list.activeSelectionBackground', text),
        ('list.inactiveSelectionForeground', 'list.inactiveSelectionBackground', text),
        ('list.hoverForeground', 'list.hoverBackground', text),
        ('list.highlightForeground', 'sideBar.background', 4.5),
        ('sideBarSectionHeader.foreground', 'sideBarSectionHeader.background', text),
        ('activityBar.foreground', 'activityBar.background', text),
        ('activityBar.inactiveForeground', 'activityBar.background', 4.5),
        ('activityBarBadge.foreground', 'activityBarBadge.background', 4.5),
        ('badge.foreground', 'badge.background', 4.5),
        ('statusBar.foreground', 'statusBar.background', text),
        ('statusBar.debuggingForeground', 'statusBar.debuggingBackground', 4.5),
        ('statusBarItem.remoteForeground', 'statusBarItem.remoteBackground', 4.5),
        ('statusBarItem.prominentForeground', 'statusBarItem.prominentBackground', 4.5),
        ('statusBarItem.prominentForeground', 'statusBarItem.prominentHoverBackground', 4.5),
        ('titleBar.activeForeground', 'titleBar.activeBackground', text),
        ('titleBar.inactiveForeground', 'titleBar.inactiveBackground', 4.5),
        ('tab.activeForeground', 'tab.activeBackground', text),
        ('tab.inactiveForeground', 'tab.inactiveBackground', 4.5),
        ('tab.unfocusedActiveForeground', 'tab.unfocusedActiveBackground', 4.5),
        ('panelTitle.activeForeground', 'panel.background', text),
        ('panelTitle.inactiveForeground', 'panel.background', 4.5),
        ('button.foreground', 'button.background', 4.5),
        ('button.foreground', 'button.hoverBackground', 4.5),
        ('button.secondaryForeground', 'button.secondaryBackground', 4.5),
        ('button.secondaryForeground', 'button.secondaryHoverBackground', 4.5),
        ('input.foreground', 'input.background', text),
        ('input.placeholderForeground', 'input.background', 4.5),
        ('dropdown.foreground', 'dropdown.background', text),
        ('editorWidget.foreground', 'editorWidget.background', text),
        ('editorSuggestWidget.foreground', 'editorSuggestWidget.background', text),
        ('editorSuggestWidget.selectedForeground', 'editorSuggestWidget.selectedBackground', text),
        ('editorSuggestWidget.highlightForeground', 'editorSuggestWidget.background', 4.5),
        ('editorHoverWidget.foreground', 'editorHoverWidget.background', text),
        ('notifications.foreground', 'notifications.background', text),
        ('quickInput.foreground', 'quickInput.background', text),
        ('quickInputList.focusForeground', 'quickInputList.focusBackground', text),
        ('menu.foreground', 'menu.background', text),
        ('menu.selectionForeground', 'menu.selectionBackground', text),
        ('peekViewResult.selectionForeground', 'peekViewResult.selectionBackground', text),
        ('peekViewTitleLabel.foreground', 'peekViewTitle.background', text),
        ('breadcrumb.foreground', 'breadcrumb.background', 4.5),
        ('textLink.foreground', 'editor.background', 4.5),
        ('textPreformat.foreground', 'textCodeBlock.background', 4.5),
        ('inputValidation.errorForeground', 'inputValidation.errorBackground', 4.5),
        ('descriptionForeground', 'sideBar.background', 4.5),
        ('gitDecoration.modifiedResourceForeground', 'sideBar.background', 4.5),
        ('gitDecoration.addedResourceForeground', 'sideBar.background', 4.5),
        ('gitDecoration.deletedResourceForeground', 'sideBar.background', 4.5),
        ('gitDecoration.untrackedResourceForeground', 'sideBar.background', 4.5),
        ('gitDecoration.conflictingResourceForeground', 'sideBar.background', 4.5),
        ('gitDecoration.ignoredResourceForeground', 'sideBar.background', 3),
        ('list.errorForeground', 'sideBar.background', 4.5),
        ('list.warningForeground', 'sideBar.background', 4.5),
        ('settings.headerForeground', 'editor.background', text),
        ('keybindingLabel.foreground', 'keybindingLabel.background', text),
    ]:
        back = g(bgk)
        if back is not None and len(back) == 9:
            back = over(back, side if bgk.startswith('list') else bg)
        chk(f'{fgk} / {bgk}', g(fgk), back, minimum)

    # Jetons de syntaxe
    for label, color in token_colors(theme).items():
        chk('Jeton : ' + label, color, bg, text)
        if sel:
            chk('Jeton : ' + label + ' sélectionné', g('editor.selectionForeground') if hc else color, sel, 7 if hc else 3)
    return rows


def distinctness(theme):
    """Paires de couleurs les plus proches pour chaque vision (normale, protan, deutan, tritan)."""
    tokens = {k: v for k, v in token_colors(theme).items() if k in DISTINCT_TOKENS}
    alerts = {k: theme.get('colors', {}).get(v) for k, v in ALERT_KEYS.items()}
    result = {}
    for view, matrix in VIEWS.items():
        pairs = sorted((delta_e(tokens[a], tokens[b], matrix), a, b) for a, b in itertools.combinations(tokens, 2))
        apairs = sorted((delta_e(alerts[a], alerts[b], matrix), a, b) for a, b in DISTINCT_ALERTS if alerts[a] and alerts[b])
        result[view] = (pairs[:3], apairs[:1])
    return result


def report(theme, hc, verbose=False):
    """Affiche le rapport d'un thème et renvoie le nombre de contrôles en échec."""
    rows = checks(theme, hc)
    bad = [r for r in rows if r[3] != 'OK']
    print(f"== {theme.get('name')} : {len(rows) - len(bad)}/{len(rows)} contrôles OK")
    for label, ratio, minimum, status in (rows if verbose else bad):
        value = '%.2f' % ratio if ratio else '-'
        print(f'   {status:8} {label:72} {value:>6} (min {minimum})')
    for view, (pairs, apairs) in distinctness(theme).items():
        line = ', '.join(f'{a}/{b} {d:.0f}' for d, a, b in pairs + apairs)
        flag = '' if all(d >= MIN_DELTA_E for d, _, _ in pairs + apairs) else '   <-- confusion possible'
        print(f'   ΔE {view:7} : {line}{flag}')
        bad += [p for p in pairs + apairs if p[0] < MIN_DELTA_E]
    return len(bad)


def ui_themes():
    """Chemin du thème -> True si c'est un thème à contraste élevé (d'après package.json)."""
    pkg = json.load(open(os.path.join(ROOT, 'package.json'), encoding='utf-8'))
    return {os.path.normpath(os.path.join(ROOT, t['path'])): t['uiTheme'].startswith('hc')
            for t in pkg['contributes']['themes']}


def main(argv):
    verbose = '-v' in argv
    paths = [a for a in argv if not a.startswith('-')]
    hc_by_path = ui_themes()
    paths = [os.path.normpath(os.path.abspath(p)) for p in paths] or sorted(hc_by_path)
    failures = 0
    for path in paths:
        theme = load_theme(path)
        failures += report(theme, hc_by_path.get(path, False), verbose)
    print(f'\n{failures} problème(s) sur {len(paths)} thème(s)')
    return 1 if failures else 0


if __name__ == '__main__':
    sys.exit(main(sys.argv[1:]))
