"""Aide au choix des couleurs de syntaxe d'une nouvelle palette.

Pour chaque rôle (mot-clé, nombre, fonction...), cherche dans sa famille de teintes les couleurs qui
respectent le contraste demandé et qui restent le plus distinctes entre elles pour les 4 visions
(normale, protanopie, deutéranopie, tritanopie). Les propositions sont un point de départ :
elles maximisent la distinction mais pas l'esthétique, à ajuster à la main puis à vérifier avec build.py.

Usage :
    python3 scripts/themes/optimize.py --bg '#FAF4EE' --fg '#3B2718' --sel '#B6D1EE'
    python3 scripts/themes/optimize.py --bg '#0D0A07' --fg '#FFF3E6' --min 7
"""
import argparse
import itertools
import os
import sys

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from colorlib import VIEWS, contrast, delta_e, lch_to_hex  # noqa: E402

# Familles : (teinte min, teinte max, chroma min, chroma max) en CIE LCh
TOKEN_FAMILIES = {
    'keyword': (35, 60, 30, 80),     # orange brûlé
    'number': (65, 95, 30, 80),      # or / ambre
    'function': (235, 275, 25, 70),  # bleu
    'string': (150, 200, 20, 60),    # vert / sarcelle
    'klass': (290, 345, 25, 75),     # violet / magenta
    'comment': (50, 80, 4, 20),      # brun désaturé
}
ALERT_FAMILIES = {
    'error': (0, 40, 40, 90),        # rouge / cramoisi
    'warning': (60, 95, 40, 90),     # ambre
    'info': (235, 275, 25, 70),      # bleu
    'added': (150, 200, 20, 70),     # vert / sarcelle
}


def score(colors):
    """Plus petite distance perçue entre deux couleurs, toutes paires et toutes visions confondues."""
    return min(delta_e(colors[a], colors[b], m) for a, b in itertools.combinations(colors, 2) for m in VIEWS.values())


def optimize(families, fixed, accept, rounds=6):
    candidates = {}
    for role, (h0, h1, c0, c1) in families.items():
        found = set()
        for L in range(10, 96, 2):
            for C in range(c0, c1 + 1, 4):
                for H in range(h0, h1 + 1, 5):
                    color = lch_to_hex(L, C, H % 360)
                    if color and accept(color):
                        found.add(color)
        if not found:
            sys.exit(f'Aucune couleur possible pour « {role} » avec ces contraintes')
        candidates[role] = sorted(found)
    current = {r: candidates[r][len(candidates[r]) // 2] for r in families}
    # Descente par coordonnées : on améliore un rôle à la fois
    for _ in range(rounds):
        for role in families:
            current[role] = max(candidates[role], key=lambda c: score({**fixed, **current, role: c}))
    return current, score({**fixed, **current})


def main():
    parser = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
    parser.add_argument('--bg', required=True, help="fond de l'éditeur")
    parser.add_argument('--fg', required=True, help="texte de l'éditeur (couleur des variables)")
    parser.add_argument('--sel', help='fond de la sélection (contrôle du texte sélectionné)')
    parser.add_argument('--min', type=float, default=4.5, help='contraste minimal des jetons (7 pour High Contrast)')
    parser.add_argument('--sel-min', type=float, default=3.0, help='contraste minimal sur la sélection')
    parser.add_argument('--alert-min', type=float, help='contraste minimal des alertes (défaut : --min)')
    args = parser.parse_args()

    def accept_token(c):
        return contrast(c, args.bg) >= args.min and (not args.sel or contrast(c, args.sel) >= args.sel_min)

    def accept_alert(c):
        return contrast(c, args.bg) >= (args.alert_min or args.min)

    tokens, s1 = optimize(TOKEN_FAMILIES, {'variable': args.fg}, accept_token)
    print('Jetons  (ΔE minimal %.1f) :' % s1)
    for role, color in tokens.items():
        print(f'   {role:9} {color}  contraste {contrast(color, args.bg):.2f}')
    alerts, s2 = optimize(ALERT_FAMILIES, {}, accept_alert)
    print('Alertes (ΔE minimal %.1f) :' % s2)
    for role, color in alerts.items():
        print(f'   {role:9} {color}  contraste {contrast(color, args.bg):.2f}')


if __name__ == '__main__':
    main()
