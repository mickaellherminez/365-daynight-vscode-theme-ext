"""Génère le rapport d'audit public : docs/AUDIT.md et docs/audit-report.json.

Usage :
    python3 scripts/themes/report.py          # écrit les deux fichiers
    python3 scripts/themes/report.py --check  # code de sortie 1 s'ils ne sont plus à jour

Le rapport ne contient aucune date, pour ne changer que si les résultats changent.
"""
import json
import os
import re
import sys

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
import audit  # noqa: E402
import variety  # noqa: E402

ROOT = audit.ROOT
OUTPUTS = {'markdown': os.path.join('docs', 'AUDIT.md'), 'json': os.path.join('docs', 'audit-report.json')}
MONTHS = ('January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October',
          'November', 'December')
VIEW_NAMES = {'normal': 'normal', 'protan': 'protanopia', 'deutan': 'deuteranopia', 'tritan': 'tritanopia'}
ROLE_NAMES = {
    'mot-clé': 'keyword', 'fonction': 'function', 'chaîne': 'string', 'nombre': 'number', 'classe': 'class',
    'commentaire': 'comment', 'variable': 'variable', 'erreur': 'error', 'avertissement': 'warning', 'info': 'info',
    'ajout': 'added', 'modification': 'modified', 'suppression': 'deleted', 'test réussi': 'test passed',
    'test échoué': 'test failed', **{f'graphe {i}': f'Git graph {i}' for i in range(1, 6)},
}
MEASURE_NAMES = {'Fond de l\'éditeur': 'Editor background', 'Cadre': 'Window frame',
                 'Barre d\'état': 'Status bar', 'Accent': 'Accent', 'Syntaxe (6 rôles)': 'Syntax (6 roles)'}
TEXT_MINIMUMS = (4.5, 7)


def month_of(theme):
    return int(re.match(r'365 (\d{2})-', theme['name']).group(1))


def theme_result(theme, hc):
    """Résultats d'un thème : contrôles, contraste, basse vision, distinction des couleurs."""
    rows = audit.checks(theme, hc)
    text = [r for r in rows if r[2] in TEXT_MINIMUMS and r[1]]
    editor = next(r[1] for r in text if r[0] == 'Éditeur : texte / fond')
    worst = min(text, key=lambda r: r[1])
    vision = {}
    for view, (pairs, alert_pairs) in audit.distinctness(theme).items():
        delta, first, second = min(pairs + alert_pairs)
        vision[VIEW_NAMES[view]] = {'deltaE': round(delta, 1), 'closest': [ROLE_NAMES[first], ROLE_NAMES[second]]}
    grays = audit.information(theme)['achromatopsie']
    return {
        'name': theme['name'],
        'checks': {'passed': sum(r[3] == 'OK' for r in rows), 'total': len(rows)},
        'contrast': {'editorText': round(editor, 2), 'lowestText': round(worst[1], 2)},
        'lowVision': {
            'textChecks': len(text),
            'atLeast4.5': round(100 * sum(r[1] >= 4.5 for r in text) / len(text), 1),
            'atLeast7': round(100 * sum(r[1] >= 7 for r in text) / len(text), 1),
        },
        'colorVision': vision,
        'achromatopsia': {'pairsBelowThreshold': sum(d < audit.MIN_DELTA_E for d, _, _ in grays), 'pairs': len(grays)},
    }


def variety_result(ui, months):
    """Écart entre les mois d'une déclinaison, pour chaque mesure qui a un seuil."""
    result = []
    for name, values, distance, minimum in variety.measures(ui, months):
        if minimum is None:
            continue
        distances = variety.pair_distances(values, distance)
        delta, first, second = distances[0]
        result.append({
            'measure': MEASURE_NAMES.get(name, name), 'threshold': minimum,
            'closest': {'deltaE': round(delta, 1), 'months': [MONTHS[first - 1], MONTHS[second - 1]]},
            'pairsBelowThreshold': sum(d < minimum for d, _, _ in distances), 'pairs': len(distances),
        })
    return result


def collect():
    """Toutes les données du rapport."""
    themes = {}
    for path, hc in sorted(audit.ui_themes().items()):
        theme = audit.load_theme(path)
        themes[theme['name']] = theme_result(theme, hc)
    variants = {}
    for ui, months in variety.load_variants().items():
        label = variety.VARIANTS[ui]
        rows = [themes[months[m]['name']] for m in sorted(months)]
        variants[label] = {'themes': rows, 'variety': variety_result(ui, months)}
    return {
        'themeCount': len(themes),
        'checks': {'passed': sum(t['checks']['passed'] for t in themes.values()),
                   'total': sum(t['checks']['total'] for t in themes.values())},
        'thresholds': {'colorDistinctionDeltaE': audit.MIN_DELTA_E, 'textContrast': 4.5, 'textContrastHighContrast': 7},
        'variants': variants,
    }


LIMITS = """## Limits of this audit

These results are measurements and simulations. Here is what they do not show.

- **No testing with real users yet.** Color blindness and low vision are simulated or calculated. No calculation replaces testing with the people concerned, and [feedback is welcome](https://github.com/mickaellherminez/365-daynight-vscode-theme-ext/issues/47).
- **Complete color blindness only.** Protanopia, deuteranopia and tritanopia are simulated at full severity. Partial forms, which are more common, are not simulated.
- **Achromatopsia is information only.** Without color, many syntax colors are close in lightness, as the table shows. They then differ only by style where the theme sets one, for comments, deprecated and invalid code for example.
- **Thresholds are project rules.** WCAG sets the contrast minimums. The color distinction threshold (ΔE 12 on the CIE76 scale) and the variety thresholds are practical rules chosen for this project, not standards.
- **WCAG 2 contrast only.** APCA, the contrast model drafted for WCAG 3, is not applied.
- **Colors, not rendering.** The audit reads the theme files. It checks the color pairs listed in its code, with one TextMate scope per token category. It does not look at a rendered window, antialiasing or your display.
- **Not every VS Code color.** A theme defines about 485 of the roughly 970 colors documented by VS Code. The others use the defaults of VS Code, and only those of the recent surfaces are audited, as they are in VS Code 1.145. A future version may change them.
- **Other conditions are not modeled.** There is no score for cataracts, glaucoma or macular degeneration, because no reliable model is used here.
"""


def fmt(value):
    return f'{value:.1f}'


def to_markdown(data):
    lines = [
        '# Accessibility audit report', '',
        '*Generated by `npm run themes:report` from the theme files. Do not edit by hand.*', '',
        f"**{data['themeCount']} themes, {data['checks']['passed']} of {data['checks']['total']} checks passed.**"
        ' The audit runs on every push and must pass before each publication.', '',
        'The same results are available as [JSON](audit-report.json).', '',
        '## How to read the tables', '',
        '- **Checks:** contrast, font style and required color checks passed by the theme.',
        '- **Editor text:** contrast of normal text on the editor background.',
        '- **Lowest text:** the lowest contrast among all the text checks. The minimum is 4.5:1, and 7:1 for most text in High Contrast themes.',
        '- **≥ 4.5:1 and ≥ 7:1:** share of the text checks above each level. The W3C links these levels to a visual acuity of about 20/40 and 20/80 ([WCAG, Understanding 1.4.3](https://www.w3.org/WAI/WCAG22/Understanding/contrast-minimum.html)).',
        f"- **Normal, Protanopia, Deuteranopia, Tritanopia:** the smallest color difference (ΔE, CIE76) between syntax colors or between alerts, after simulation ([Machado et al., 2009](https://www.inf.ufrgs.br/~oliveira/pubs_files/CVD_Simulation/CVD_Simulation.html)). The audit fails under {data['thresholds']['colorDistinctionDeltaE']}.",
        '- **Achromatopsia:** pairs of main syntax colors closer than the threshold in lightness alone. For information, it never fails the audit.', '',
    ]
    for label, variant in data['variants'].items():
        lines += [f'## {label}', '',
                  '| Month | Checks | Editor text | Lowest text | ≥ 4.5:1 | ≥ 7:1 | Normal | Protanopia | Deuteranopia | Tritanopia | Achromatopsia |',
                  '| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |']
        for theme in variant['themes']:
            vision = theme['colorVision']
            low = theme['lowVision']
            gray = theme['achromatopsia']
            lines.append(
                f"| {MONTHS[month_of(theme) - 1]} | {theme['checks']['passed']}/{theme['checks']['total']}"
                f" | {theme['contrast']['editorText']:.2f}:1 | {theme['contrast']['lowestText']:.2f}:1"
                f" | {fmt(low['atLeast4.5'])}% | {fmt(low['atLeast7'])}%"
                f" | {fmt(vision['normal']['deltaE'])} | {fmt(vision['protanopia']['deltaE'])}"
                f" | {fmt(vision['deuteranopia']['deltaE'])} | {fmt(vision['tritanopia']['deltaE'])}"
                f" | {gray['pairsBelowThreshold']}/{gray['pairs']} |")
        lines += ['', 'Difference between months:', '',
                  '| Measure | Minimum ΔE | Closest months | ΔE | Pairs below the minimum |', '| --- | --- | --- | --- | --- |']
        for row in variant['variety']:
            closest = row['closest']
            lines.append(f"| {row['measure']} | {row['threshold']} | {' and '.join(closest['months'])}"
                         f" | {fmt(closest['deltaE'])} | {row['pairsBelowThreshold']}/{row['pairs']} |")
        lines.append('')
    return '\n'.join(lines) + '\n' + LIMITS


def to_json(data):
    return json.dumps(data, indent=2, ensure_ascii=False, sort_keys=True) + '\n'


def outputs():
    """{chemin relatif : contenu attendu}"""
    data = collect()
    return {OUTPUTS['markdown']: to_markdown(data), OUTPUTS['json']: to_json(data)}


def stale(expected, root=ROOT):
    """Fichiers absents ou différents du contenu attendu."""
    result = []
    for path, content in expected.items():
        full = os.path.join(root, path)
        if not os.path.exists(full) or open(full, encoding='utf-8').read() != content:
            result.append(path)
    return result


def main(argv):
    expected = outputs()
    if '--check' in argv:
        outdated = stale(expected)
        for path in outdated:
            print(f'{path} is out of date: run npm run themes:report')
        print(f'Audit report: {len(outdated)} file(s) out of date')
        return 1 if outdated else 0
    for path, content in expected.items():
        with open(os.path.join(ROOT, path), 'w', encoding='utf-8') as handle:
            handle.write(content)
        print(f'Written: {path}')
    return 0


if __name__ == '__main__':
    sys.exit(main(sys.argv[1:]))
