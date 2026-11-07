"""Ébauche les palettes d'un mois à partir de son ambiance (direction.json).

    python3 scripts/themes/draft.py 01            # affiche les couleurs de syntaxe choisies
    python3 scripts/themes/draft.py 01 --write    # écrit scripts/themes/palettes/01.json
    python3 scripts/themes/draft.py all --write   # les 12 mois

Puis générer les thèmes : python3 scripts/themes/build.py 01 --write

Modèle de structure : les 4 palettes d'octobre d'avant la refonte (draft-template.json). Les surfaces prennent
la teinte du fond du mois, l'accent et les barres celle de l'accent. Les alertes, la sélection et le terminal
restent ceux du modèle, puis sont adaptés au nouveau fond. La syntaxe est cherchée dans les teintes du mois :
contraste WCAG sur toutes les surfaces du code, ΔE d'au moins 12 visé pour les 3 daltonismes simulés (Machado
2009), clartés étagées pour l'achromatopsie.
"""
import itertools
import json
import math
import os
import random
import sys

HERE = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, HERE)
from colorlib import ACHROMATOPSIA, CVD, contrast, delta_e, lab, lch_to_hex, over  # noqa: E402

TEMPLATE = json.load(open(os.path.join(HERE, 'draft-template.json'), encoding='utf-8'))
DIRECTION = json.load(open(os.path.join(HERE, 'direction.json'), encoding='utf-8'))['months']
VARIANT_TEXT = {'light': ('claire', '≥ 4.5:1 (AA)'), 'dark': ('sombre', '≥ 4.5:1 (AA)'),
                'hc': ('à contraste élevé', '≥ 7:1 (AAA)'), 'hcLight': ('à contraste élevé claire', '≥ 7:1 (AAA)')}

SURFACE = ['bg', 'bgAlt', 'bgDeep', 'bgWidget', 'bgInput', 'bgHover', 'bgLine', 'border', 'listInactive', 'listHover',
           'wordHl', 'wordHlStrong', 'secondaryHoverBg', 'listSel', 'lineBorder', 'contrastBorder']
TEXT = ['fg', 'fgMuted', 'fgFaint', 'borderStrong', 'wordHlBorder', 'wordHlStrongBorder', 'listSelFg', 'statusFg', 'shadow']
ACCENT = ['accent', 'accentHover', 'statusRemoteBg', 'statusProminentHoverBg', 'contrastActiveBorder']
# Clés qui suivent l'accent seulement quand le modèle les y relie (même couleur que l'accent du modèle)
MAYBE_ACCENT = ['focus', 'findBorder', 'findHlBorder', 'borderStrong', 'wordHlStrongBorder']


def to_lch(color):
    L, a, b = lab(color[:7])
    return L, math.hypot(a, b), math.degrees(math.atan2(b, a)) % 360


def lch(L, C, H):
    L = max(0, min(100, L))
    C = max(0, C)
    while C >= 0:
        c = lch_to_hex(L, C, H)
        if c:
            return c
        C -= 0.5
    return lch_to_hex(L, 0, 0)


def shift(color, base_from, base_to, chroma_cap=None):
    """Reporte une couleur du modèle vers une nouvelle base : même écart de clarté, chroma à l'échelle, teinte de la base."""
    if color is None:
        return None
    alpha = color[7:]
    L, C, H = to_lch(color)
    L0, C0, _ = to_lch(base_from)
    L1, C1, H1 = to_lch(base_to)
    ratio = C1 / C0 if C0 > 1 else 1
    newC = C * ratio
    if chroma_cap is not None:
        newC = min(newC, chroma_cap)
    return lch(L + (L1 - L0), newC, H1 if C1 > 1.5 else H) + alpha


def tint(color, hue, chroma_max):
    """Garde la clarté, prend la teinte du mois avec peu de chroma."""
    if color is None:
        return None
    alpha = color[7:]
    L, C, _ = to_lch(color)
    return lch(L, min(C, chroma_max), hue) + alpha


def readable_fg(background):
    return '#FFFFFF' if contrast('#FFFFFF', background) >= contrast('#101010', background) else '#101010'


def derive(variant, bg, accent, tint_chroma):
    t = TEMPLATE[variant]
    p = json.loads(json.dumps(t))
    _, _, bg_hue = to_lch(bg)
    accent_keys = set(ACCENT) | {k for k in MAYBE_ACCENT if t.get(k) and t[k][:7] == t['accent']}
    # Les surfaces ne sont jamais plus saturées que le fond lui-même (×1,3 au plus) : sinon les barres criardes
    bg_L, bg_chroma, _ = to_lch(bg)
    for key in SURFACE:
        if t.get(key) and key not in accent_keys:
            if variant in ('hc', 'hcLight') and t[key][:7] in ('#000000', '#FFFFFF'):
                # Noir ou blanc pur dans le modèle : la surface prend la teinte du fond du mois, pour que toute la
                # fenêtre change (barre latérale, barre d'activité, barre de titre, onglets), pas seulement l'éditeur
                p[key] = frame(key, t[key], t['bg'], bg) + t[key][7:]
            else:
                p[key] = shift(t[key], t['bg'], bg, chroma_cap=max(2, bg_chroma * 1.3))
    for key in TEXT:
        if t.get(key) and key not in accent_keys:
            p[key] = tint(t[key], bg_hue, tint_chroma)
    for key in accent_keys:
        if t.get(key):
            p[key] = shift(t[key], t['accent'], accent)
    p['accentFg'] = readable_fg(p['accent'])
    if t['type'] == 'light' and variant == 'light':
        # Barre d'état foncée dans la teinte de l'accent : le bouton de l'extension peut y atteindre 7:1
        L, C, H = to_lch(accent)
        p['statusBg'] = lch(22, min(C * 0.55, 30), H)
        p['statusFg'] = '#FFFFFF'
    elif variant == 'hcLight':
        L, C, H = to_lch(accent)
        p['statusBg'] = lch(20, min(C * 0.5, 25), H)
    elif variant in ('dark', 'hc'):
        p['statusBg'] = p['bgDeep']
    return p


# Cadre de la fenêtre : barre latérale (bgAlt), barre d'activité, barre de titre et onglets inactifs (bgDeep)
FRAME = ('bgAlt', 'bgDeep')


def frame(key, color, base_from, base_to):
    """Surface neutre du modèle (noir ou blanc pur) reportée dans la teinte et la chroma du nouveau fond.

    Contraste élevé sombre : 80 % de la clarté de l'éditeur, un peu plus foncé que lui comme en Dark.
    Contraste élevé clair : le cadre est un peu plus foncé que l'éditeur (clarté −3, chroma ×1,3) pour que la teinte
    se voie près du blanc ; les champs et les fenêtres flottantes restent plus clairs que l'éditeur, comme le modèle.
    Les bordures du contraste élevé séparent les zones ; l'audit vérifie les contrastes.
    """
    L, _, _ = to_lch(color)
    L1, C1, H1 = to_lch(base_to)
    if L < 50:
        return lch(L1 * 0.8, C1, H1)
    if key in FRAME:
        return lch(L1 - 3, C1 * 1.3, H1)
    return lch(min(99.5, L + (L1 - to_lch(base_from)[0])), C1, H1)


def adjust(color, step, ok, limit=80):
    """Éclaircit (step > 0) ou fonce (step < 0) une couleur, teinte et chroma gardées, jusqu'à ce que ok() soit vrai."""
    alpha = color[7:]
    L, C, H = to_lch(color)
    # La plus proche dans la direction voulue, sinon la plus proche de l'autre côté
    for i in range(limit * 2):
        for sign in (1, -1):
            candidate = lch(L + sign * step * i / 2, C, H)
            if ok(candidate):
                return candidate + alpha
    raise SystemExit(f'réparation impossible pour {color}')


def repair(p, variant):
    """Adapte au nouveau fond les couleurs reprises du modèle : sélection visible, textes discrets lisibles,
    décorations Git lisibles sur la sélection de liste, couleurs du terminal à 7:1 en contraste élevé."""
    if variant in ('hc', 'hcLight'):
        away = 1 if p['type'] == 'dark' else -1
        bg = p['bg']
        # Couleurs ANSI du terminal : 7:1 sur le fond (3:1 pour le noir, qui sert de fond sur un thème sombre)
        for name, color in p['ansi'].items():
            if p['type'] == 'dark' and name == 'Black':
                continue
            minimum = 3 if name.endswith('Black') else 7
            if contrast(color, bg) < minimum + 0.02:
                p['ansi'][name] = adjust(color, away, lambda c, m=minimum: contrast(c, bg) >= m + 0.1)
        # Texte sur les surlignages de l'éditeur de fusion (ajouts, suppressions, conflits) : 7:1
        merge = [over(p['added'] + '4D', bg), over(p['deleted'] + '4D', bg), over(p['warning'] + '33', bg)]
        if min(contrast(p['fg'], m) for m in merge) < 7.05:
            p['fg'] = adjust(p['fg'], away, lambda c: min(contrast(c, m) for m in merge) >= 7.1)
        if contrast(p['selInactive'], bg) < 1.27:
            p['selInactive'] = adjust(p['selInactive'], away, lambda c: contrast(c, bg) >= 1.3
                                      and contrast(p['fg'], c) >= 7)
    if variant == 'hcLight':
        # Sélection de la console : visible sur le fond, texte et erreurs toujours lisibles dessus
        p['wsel'] = adjust(p['wsel'], -1, lambda c: contrast(c, p['bg']) >= 2.05 and contrast(p['fg'], c) >= 7
                           and contrast(p['debugError'], c) >= 4.6)
        return p
    if variant == 'hc':
        return p
    dark = p['type'] == 'dark'
    away = 1 if dark else -1
    bg, line = p['bg'], p['bgLine'][:7]
    # Visible sur le fond et la ligne courante, sans que le texte ni les erreurs sélectionnés perdent leur contraste
    # Marges au-dessus des seuils de l'audit, réduites si le fond ne laisse pas assez de place
    sel = p['sel']
    for on_bg, on_line, error, text in ((1.38, 1.22, 4.55, 7), (1.36, 1.21, 4.52, 6)):
        try:
            p['sel'] = adjust(sel, away, lambda c: contrast(c, bg) >= on_bg and contrast(c, line) >= on_line
                              and contrast(p['debugError'], c) >= error and contrast(p['fg'], c) >= text)
            break
        except SystemExit:
            if text == 6:
                raise
    p['wsel'] = p['sel']
    p['selInactive'] = adjust(p['selInactive'], away, lambda c: contrast(c, bg) >= 1.3)
    surfaces = [bg, p['bgInput'], p['bgWidget'], p['bgAlt'], line, p['bgDeep']]
    p['fgFaint'] = adjust(p['fgFaint'], away, lambda c: min(contrast(c, s) for s in surfaces) >= 4.7)
    if min(contrast(p['link'], s) for s in surfaces) < 4.6:
        p['link'] = adjust(p['link'], away, lambda c: min(contrast(c, s) for s in surfaces) >= 4.7)
    # Barre d'état distante et éléments mis en avant : texte blanc
    for key in ('statusRemoteBg', 'statusProminentHoverBg'):
        if contrast('#FFFFFF', p[key]) < 4.6:
            p[key] = adjust(p[key], -1, lambda c: contrast('#FFFFFF', c) >= 4.7)
    # Couleurs ANSI du terminal : 4.5:1 sur le fond, sauf la couleur prévue pour le fond opposé
    for name, color in p['ansi'].items():
        if (dark and name == 'Black') or (not dark and name in ('White', 'BrightWhite')):
            continue
        minimum = 3 if name.endswith('Black') else 4.5
        if contrast(color, bg) < minimum + 0.02:
            p['ansi'][name] = adjust(color, away, lambda c, m=minimum: contrast(c, bg) >= m + 0.1)
    p['fgMuted'] = adjust(p['fgMuted'], away, lambda c: min(contrast(c, s) for s in surfaces) >= 4.9)
    git = [p['modified'], p['deleted'], p['added']]
    p['listSel'] = adjust(p['listSel'], -away, lambda c: min(contrast(g, c) for g in git) >= 3.2
                          and contrast(p['listSelFg'], c) >= 7)
    return p


def pick_syntax(p, variant, plan, comment_chroma, seed=1, rounds=20000):
    """Couleurs de syntaxe : contraste sur le fond, la ligne courante et la barre latérale, lisibles une fois
    sélectionnées, distinctes pour les 4 visions (ΔE ≥ 12 visé), étagées en clarté pour l'achromatopsie."""
    hc = variant in ('hc', 'hcLight')
    light = p['type'] == 'light'
    text_min = 7 if hc else 4.5
    surfaces = [p['bg'], p['bgLine'][:7], p['bgAlt'], p['bgWidget'], p['bgInput']]
    # Seul le texte normal est presque noir (ou presque blanc) : une couleur de code trop proche de lui
    # perd sa teinte à l'œil, même quand les mesures la disent distincte (retour d'essai du prototype)
    L_range = {'light': (26, 52), 'dark': (52, 84), 'hc': (62, 88), 'hcLight': (14, 42)}[variant]
    _, _, bg_hue = to_lch(p['bg'])
    random.seed(seed)

    def ok(color):
        if min(contrast(color, s) for s in surfaces) < text_min + 0.15:
            return False
        if not hc and contrast(color, p['sel']) < 3.1:
            return False
        return True

    candidates = {}
    # Les commentaires restent en retrait : plus clairs que le code sur fond clair, plus sombres sur fond sombre
    comment_L = {'light': (38, 52), 'dark': (55, 70), 'hc': (66, 80), 'hcLight': (24, 40)}[variant]
    for role, (h0, h1, c0, c1) in {**plan, 'comment': (int(bg_hue) - 2, int(bg_hue) + 2, 1, comment_chroma)}.items():
        L0, L1 = comment_L if role == 'comment' else L_range
        # Plage vide (couleurs hors de l'espace sRGB, ou fond qui laisse peu de place) : on l'élargit pas à pas,
        # d'abord la saturation minimale, puis la teinte et la clarté
        for widen in range(5):
            found = set()
            low = max(1, c0 - 8 * widen)
            for L in range(L0 - 3 * widen, L1 + 3 * widen + 1):
                for C in range(low, c1 + 1, 3):
                    for H in range(h0 - 4 * widen, h1 + 4 * widen + 1, 3):
                        color = lch_to_hex(L, C, H % 360)
                        if color and ok(color):
                            found.add(color)
            if found:
                break
        if not found:
            raise SystemExit(f'{variant}: aucune couleur pour {role}')
        if widen:
            print(f'   {variant} {role} : plage élargie {widen} fois', file=sys.stderr)
        candidates[role] = sorted(found)

    fixed = {'variable': p['fg']}
    views = [None] + list(CVD.values())

    def score(cur):
        tokens = {**fixed, **cur}
        pairs = list(itertools.combinations(tokens.values(), 2))
        cvd = min(delta_e(a, b, m) for a, b in pairs for m in views)
        achroma = sum(1 for a, b in pairs if delta_e(a, b, ACHROMATOPSIA) >= 10)
        vivid = sum(math.sqrt(math.hypot(*lab(c)[1:])) for r, c in cur.items() if r != 'comment')
        return 3 * achroma + 0.8 * vivid - 60 * max(0, 12 - cvd)

    cur = {r: random.choice(c) for r, c in candidates.items()}
    s = score(cur)
    best = (s, dict(cur))
    T = 8.0
    for _ in range(rounds):
        r = random.choice(list(candidates))
        new = {**cur, r: random.choice(candidates[r])}
        ns = score(new)
        if ns > s or random.random() < math.exp((ns - s) / T):
            cur, s = new, ns
            if s > best[0]:
                best = (s, dict(cur))
        T = max(0.02, T * 0.9998)
    return best[1]


def cvd_margin(tokens):
    """Plus petit ΔE entre deux couleurs de code, en vision normale et pour les 3 daltonismes simulés."""
    views = [None] + list(CVD.values())
    return min(delta_e(a, b, m) for a, b in itertools.combinations(tokens.values(), 2) for m in views)


def apply_syntax(p, variant, syntax, regex_plan):
    t = TEMPLATE[variant]['tok']
    tok = dict(p['tok'])
    main = {k: syntax[k] for k in ('keyword', 'function', 'string', 'number', 'klass', 'comment')}
    tok.update(main)
    tok['variable'] = p['fg']
    # Rôles secondaires : comme dans le modèle, reliés à un rôle principal ou au texte
    links = {'tag': 'keyword', 'heading': 'keyword', 'attribute': 'number', 'link': 'function', 'jsonKey': 'function',
             'code': 'string', 'support': 'klass', 'deprecated': 'comment'}
    for key, role in links.items():
        tok[key] = main[role]
    tok['operator'] = main['keyword'] if t['operator'] == t['keyword'] or variant == 'dark' else p['fgMuted']
    for key in ('property', 'punctuation', 'namespace'):
        tok[key] = tint(t[key], to_lch(p['bg'])[2], 14)
    tok['regex'] = regex_plan
    tok['invalid'] = tok['deleted'] = p['error']
    tok['inserted'] = TEMPLATE[variant]['tok']['inserted']
    tok['changed'] = TEMPLATE[variant]['tok']['changed']
    p['tok'] = tok
    return p


def regex_color(p, variant, hue):
    """Expressions régulières : la couleur la plus saturée de la teinte prévue qui garde le contraste."""
    minimum = 7.2 if variant in ('hc', 'hcLight') else 4.7
    best = None
    for L in range(5, 96):
        for C in range(20, 80, 2):
            c = lch_to_hex(L, C, hue)
            if c and min(contrast(c, s) for s in (p['bg'], p['bgLine'][:7], p['bgAlt'])) >= minimum:
                if best is None or C > best[0] or (C == best[0] and abs(L - 50) < abs(best[1] - 50)):
                    best = (C, L, c)
    return best[2]


def seed(value):
    """Couleur de direction.json : hexadécimal, ou [L, C, H] en CIE LCh."""
    return value if isinstance(value, str) else lch(*value)


def draft(month):
    """Les 4 palettes d'un mois, au format de scripts/themes/palettes."""
    d = DIRECTION[f'{int(month):02d}']
    plan = {role: tuple(v) for role, v in d['syntax'].items()}
    out = {'month': int(month), 'description': d['description']}
    for variant in ('light', 'dark', 'hc', 'hcLight'):
        print(f'{int(month):02d} {variant}…', file=sys.stderr)
        tint_chroma = 12 if variant in ('hc', 'hcLight') else 14
        p = repair(derive(variant, seed(d[variant]['bg']), seed(d[variant]['accent']), tint_chroma), variant)
        # Plusieurs tirages si le premier ne garde pas ΔE 12 entre les couleurs de code pour les 3 daltonismes
        best = None
        for attempt in range(4):
            syntax = pick_syntax(p, variant, plan, comment_chroma=12, seed=int(month) + 100 * attempt)
            margin = cvd_margin({'variable': p['fg'], **syntax})
            if best is None or margin > best[0]:
                best = (margin, syntax)
            if margin >= 12:
                break
            print(f'   {variant} : ΔE {margin:.1f} pour le daltonisme au tirage {attempt + 1}', file=sys.stderr)
        syntax = best[1]
        p = apply_syntax(p, variant, syntax, regex_color(p, variant, d['regexHue']))
        name, level = VARIANT_TEXT[variant]
        p['note'] = (f'Palette {name} ({d["mood"]}) : texte et jetons {level} sur le fond, syntaxe étagée en clarté '
                     "pour l'achromatopsie, alertes, sélection et terminal adaptés au fond. "
                     'Vérifié par script (contraste WCAG + simulation Machado 2009).')
        out[variant] = p
    return out


def main(argv):
    args = [a for a in argv if not a.startswith('-')]
    if len(args) != 1:
        sys.exit(__doc__)
    months = range(1, 13) if args[0] == 'all' else [int(args[0])]
    for month in months:
        palettes = draft(month)
        for variant in ('light', 'dark', 'hc', 'hcLight'):
            tok = palettes[variant]['tok']
            print(f'{month:02d} {variant:8}', ' '.join(f'{k}={tok[k]}' for k in
                                                     ('keyword', 'function', 'string', 'number', 'klass', 'comment')))
        if '--write' in argv:
            path = os.path.join(HERE, 'palettes', f'{month:02d}.json')
            with open(path, 'w', encoding='utf-8') as f:
                f.write(json.dumps(palettes, ensure_ascii=False, indent=2) + '\n')
    return 0


if __name__ == '__main__':
    sys.exit(main(sys.argv[1:]))
