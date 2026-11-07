"""Test de variété : les mois d'une même déclinaison doivent se distinguer à l'œil.

Compare chaque paire de mois dans chaque déclinaison (Light, Dark, High Contrast, High Contrast Light) :
66 paires pour 12 mois. Le ΔE est l'écart de couleur perçu (CIE76, voir colorlib.py) : plus il est grand,
plus les deux couleurs diffèrent.

Contrôles bloquants (vision normale) :
- fond de l'éditeur : ΔE d'au moins 8 entre deux mois, 4 dans les déclinaisons à contraste élevé ;
- accent (pastille de la barre d'activité) : ΔE d'au moins 25 ;
- syntaxe : moyenne des ΔE de 6 rôles (mot-clé, fonction, chaîne, nombre, classe, commentaire) d'au moins 10 ;
- au plus 3 mois dans la même famille de teinte, séparément pour le fond et pour l'accent.

La barre d'état est mesurée à titre d'information. Les mêmes mesures, simulées pour les trois formes de
daltonisme, sont aussi affichées à titre d'information : elles ne font jamais échouer le test. La colonne
ΔE2000 donne la moyenne avec CIEDE2000, plus fidèle à la perception mais sur une autre échelle : les seuils
restent ceux de CIE76.

Usage :
    python3 scripts/themes/variety.py      # résumé par déclinaison, 5 paires en échec au plus par mesure
    python3 scripts/themes/variety.py -v   # toutes les paires en échec

Code de sortie 1 si au moins un contrôle bloquant échoue.
"""
import itertools
import json
import math
import os
import re
import sys

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from audit import load_theme, token_colors  # noqa: E402
from colorlib import CVD, delta_e, delta_e_2000, lab  # noqa: E402

ROOT = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

VARIANTS = {'vs': 'Light', 'vs-dark': 'Dark', 'hc-black': 'High Contrast', 'hc-light': 'High Contrast Light'}
HIGH_CONTRAST = ('hc-black', 'hc-light')
SYNTAX_ROLES = ('mot-clé', 'fonction', 'chaîne', 'nombre', 'classe', 'commentaire')

# Seuils de départ, à ajuster avec l'ébauche des 12 mois
MIN_BACKGROUND = 8
MIN_BACKGROUND_HC = 4
MIN_ACCENT = 25
MIN_SYNTAX = 10
MAX_PER_FAMILY = 3

# Familles de teinte : 8 secteurs de 45° de l'angle de teinte CIELAB, nommés d'après leur centre.
# Une couleur presque neutre (chroma sous 4) forme une famille à part : sa teinte ne se voit pas.
FAMILIES = ('rose', 'rouge-orangé', 'jaune', 'vert', 'vert-bleu', 'cyan', 'bleu', 'violet')
NEUTRAL = 'neutre'
NEUTRAL_CHROMA = 4

# Surfaces comparées : (nom affiché, clé de couleur). Leurs seuils sont fixés dans measures()
SURFACES = (('Fond de l\'éditeur', 'editor.background'), ('Barre d\'état', 'statusBar.background'),
            ('Accent', 'activityBarBadge.background'))
MAX_LISTED = 5


def hue_family(color):
    """Famille de teinte d'une couleur : un des 8 secteurs de 45°, ou « neutre » si sa chroma est sous 4."""
    _, a, b = lab(color)
    if math.hypot(a, b) < NEUTRAL_CHROMA:
        return NEUTRAL
    hue = math.degrees(math.atan2(b, a)) % 360
    return FAMILIES[int(((hue + 22.5) % 360) // 45)]


def surface_delta(a, b, matrix=None, metric=delta_e):
    """Écart entre les couleurs d'une surface de deux mois (CIE76 par défaut, ou CIEDE2000)."""
    return metric(a, b, matrix)


def syntax_delta(a, b, matrix=None, metric=delta_e):
    """Moyenne des écarts entre les couleurs de syntaxe de deux mois, rôle par rôle."""
    return sum(metric(a[role], b[role], matrix) for role in SYNTAX_ROLES) / len(SYNTAX_ROLES)


def load_variants():
    """{uiTheme: {mois: thème}} pour les thèmes 365 déclarés dans package.json."""
    package = json.load(open(os.path.join(ROOT, 'package.json'), encoding='utf-8'))
    variants = {ui: {} for ui in VARIANTS}
    for entry in package['contributes']['themes']:
        match = re.match(r'365 (\d{2})-', entry['label'])
        if match and entry['uiTheme'] in variants:
            variants[entry['uiTheme']][int(match.group(1))] = load_theme(os.path.join(ROOT, entry['path']))
    return {ui: months for ui, months in variants.items() if months}


def measures(ui, months):
    """Mesures comparées entre mois : (nom, {mois: valeur}, fonction de distance, seuil ou None)."""
    background = MIN_BACKGROUND_HC if ui in HIGH_CONTRAST else MIN_BACKGROUND
    thresholds = {'editor.background': background, 'statusBar.background': None, 'activityBarBadge.background': MIN_ACCENT}
    for theme in months.values():
        missing = [key for _, key in SURFACES if not theme.get('colors', {}).get(key)]
        if missing:
            sys.exit(f'{theme.get("name")} : couleur(s) introuvable(s) : {", ".join(missing)}')
    result = [(name, {m: t['colors'][key] for m, t in months.items()}, surface_delta, thresholds[key]) for name, key in SURFACES]
    syntax = {}
    for month, theme in months.items():
        tokens = token_colors(theme)
        missing = [role for role in SYNTAX_ROLES if role not in tokens]
        if missing:
            sys.exit(f'{theme.get("name")} : rôle(s) de syntaxe introuvable(s) : {", ".join(missing)}')
        syntax[month] = tokens
    result.append(('Syntaxe (6 rôles)', syntax, syntax_delta, MIN_SYNTAX))
    return result


def pair_distances(values, distance, matrix=None, metric=delta_e):
    """[(ΔE, mois a, mois b)] pour chaque paire de mois, du plus proche au plus éloigné."""
    return sorted((distance(values[a], values[b], matrix, metric), a, b)
                  for a, b in itertools.combinations(sorted(values), 2))


def report(ui, months, verbose=False):
    """Affiche le rapport d'une déclinaison et renvoie le nombre de contrôles bloquants en échec."""
    count = len(months)
    pairs = count * (count - 1) // 2
    print(f'== {VARIANTS[ui]} : {count} mois, {pairs} paire(s)')
    failures = 0
    rows = measures(ui, months)
    if pairs:
        print(f'   {"Mesure":20} {"ΔE moyen":>9} {"ΔE2000":>7} {"sous le seuil":>14} {"seuil":>6}   paire la plus proche')
        for name, values, distance, minimum in rows:
            distances = pair_distances(values, distance)
            mean = sum(d for d, _, _ in distances) / pairs
            # CIEDE2000, à titre d'information : les seuils restent ceux de CIE76
            mean_2000 = sum(d for d, _, _ in pair_distances(values, distance, metric=delta_e_2000)) / pairs
            closest = '%02d/%02d %.1f' % (distances[0][1], distances[0][2], distances[0][0])
            if minimum is None:
                print(f'   {name:20} {mean:9.1f} {mean_2000:7.1f} {"info":>14} {"-":>6}   {closest}')
                continue
            below = [p for p in distances if p[0] < minimum]
            failures += len(below)
            status = 'OK' if not below else 'ÉCHEC'
            print(f'   {name:20} {mean:9.1f} {mean_2000:7.1f} {f"{len(below)}/{pairs}":>14} {minimum:>6}   {closest}   {status}')
            shown = below if verbose else below[:MAX_LISTED]
            if shown:
                listed = ', '.join('%02d/%02d %.1f' % (a, b, d) for d, a, b in shown)
                more = '' if len(shown) == len(below) else f' … et {len(below) - len(shown)} autre(s), -v pour tout voir'
                print(f'      {listed}{more}')
    else:
        print('   Un seul mois dans cette déclinaison : aucune paire à comparer')

    for name, key in (SURFACES[0], SURFACES[2]):
        families = {}
        for month, theme in sorted(months.items()):
            families.setdefault(hue_family(theme['colors'][key]), []).append(month)
        crowded = {f: m for f, m in families.items() if len(m) > MAX_PER_FAMILY}
        failures += len(crowded)
        listed = ', '.join(f'{f} {len(m)} ({" ".join("%02d" % x for x in m)})'
                           for f, m in sorted(families.items(), key=lambda item: (-len(item[1]), item[0])))
        print(f'   Familles, {name.lower()} (au plus {MAX_PER_FAMILY}) : {listed}   {"ÉCHEC" if crowded else "OK"}')

    if pairs:
        print('   Daltonisme, à titre d\'information (ΔE moyen, paires sous le seuil) :')
        for view, matrix in CVD.items():
            parts = []
            for name, values, distance, minimum in rows:
                if minimum is None:
                    continue
                distances = pair_distances(values, distance, matrix)
                mean = sum(d for d, _, _ in distances) / pairs
                below = sum(1 for d, _, _ in distances if d < minimum)
                parts.append(f'{name.split(" (")[0].lower()} {mean:.1f}, {below}/{pairs}')
            print(f'      {view:7} : {" ; ".join(parts)}')
    return failures


def main(argv):
    verbose = '-v' in argv
    failures = sum(report(ui, months, verbose) for ui, months in load_variants().items())
    print(f'\n{failures} problème(s) de variété')
    return 1 if failures else 0


if __name__ == '__main__':
    sys.exit(main(sys.argv[1:]))
