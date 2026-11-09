"""Outils de couleur : contraste WCAG, composition alpha, simulation du daltonisme et conversions LCh."""
import math


def parse(color):
    """'#RRGGBB' ou '#RRGGBBAA' -> ((r, g, b) entre 0 et 1, alpha)."""
    c = color.lstrip('#')
    if len(c) in (3, 4):
        c = ''.join(x * 2 for x in c)
    r, g, b = (int(c[i:i + 2], 16) / 255 for i in (0, 2, 4))
    alpha = int(c[6:8], 16) / 255 if len(c) == 8 else 1.0
    return (r, g, b), alpha


def over(color, background):
    """Compose une couleur (avec alpha éventuel) sur un fond opaque."""
    (r, g, b), alpha = parse(color)
    (R, G, B), _ = parse(background)
    mix = ((alpha * x + (1 - alpha) * y) for x, y in ((r, R), (g, G), (b, B)))
    return '#%02X%02X%02X' % tuple(round(v * 255) for v in mix)


def _linear(v):
    return v / 12.92 if v <= 0.04045 else ((v + 0.055) / 1.055) ** 2.4


def luminance(color):
    (r, g, b), _ = parse(color)
    return 0.2126 * _linear(r) + 0.7152 * _linear(g) + 0.0722 * _linear(b)


def contrast(a, b):
    """Ratio de contraste WCAG 2.x entre deux couleurs opaques."""
    la, lb = sorted((luminance(a), luminance(b)), reverse=True)
    return (la + 0.05) / (lb + 0.05)


# Matrices de Machado, Oliveira et Fernandes (2009), sévérité 1.0, en RGB linéaire
CVD = {
    'protan': [[0.152286, 1.052583, -0.204868], [0.114503, 0.786281, 0.099216], [-0.003882, -0.048116, 1.051998]],
    'deutan': [[0.367322, 0.860646, -0.227968], [0.280085, 0.672501, 0.047413], [-0.011820, 0.042940, 0.968881]],
    'tritan': [[1.255528, -0.076749, -0.178779], [-0.078411, 0.930809, 0.147602], [0.004733, 0.691367, 0.303900]],
}

# Vision normale + les 3 formes de dichromatie
VIEWS = {'normal': None, **CVD}

# Achromatopsie (vision sans couleur) : chaque couleur devient le gris de même luminance (CIE Y, coefficients
# de sRGB). C'est une approximation : les personnes achromates voient avec les bâtonnets, dont la sensibilité
# (scotopique) rend le bleu un peu plus clair et le rouge plus sombre. Seul l'écart de clarté reste visible.
ACHROMATOPSIA = [[0.2126, 0.7152, 0.0722]] * 3


def _gamma(v):
    return 12.92 * v if v <= 0.0031308 else 1.055 * v ** (1 / 2.4) - 0.055


def simulate(color, matrix):
    """Couleur telle qu'elle est vue après simulation : '#RRGGBB' -> '#RRGGBB'."""
    (r, g, b), _ = parse(color)
    v = [_linear(r), _linear(g), _linear(b)]
    linear = [max(0, min(1, sum(matrix[i][j] * v[j] for j in range(3)))) for i in range(3)]
    return '#%02X%02X%02X' % tuple(round(_gamma(x) * 255) for x in linear)


def lab(color, matrix=None):
    """Couleur -> CIE L*a*b* (D65), éventuellement après simulation de daltonisme."""
    (r, g, b), _ = parse(color)
    v = [_linear(r), _linear(g), _linear(b)]
    if matrix:
        v = [max(0, min(1, sum(matrix[i][j] * v[j] for j in range(3)))) for i in range(3)]
    X = (0.4124 * v[0] + 0.3576 * v[1] + 0.1805 * v[2]) / 0.95047
    Y = 0.2126 * v[0] + 0.7152 * v[1] + 0.0722 * v[2]
    Z = (0.0193 * v[0] + 0.1192 * v[1] + 0.9505 * v[2]) / 1.08883
    f = lambda t: t ** (1 / 3) if t > 0.008856 else 7.787 * t + 16 / 116
    return 116 * f(Y) - 16, 500 * (f(X) - f(Y)), 200 * (f(Y) - f(Z))


def delta_e(a, b, matrix=None):
    """Différence perçue (CIE76). En dessous de ~10, deux couleurs de texte se confondent."""
    return math.dist(lab(a, matrix), lab(b, matrix))


def ciede2000(lab1, lab2):
    """Différence perçue CIEDE2000 entre deux couleurs L*a*b*, avec kL = kC = kH = 1.

    Plus fidèle à la perception que CIE76, surtout pour les bleus et les couleurs peu saturées, mais sur une
    autre échelle : un ΔE2000 est en général plus petit que le ΔE76 de la même paire. Implémentation suivant
    Sharma, Wu et Dalal (2005), « The CIEDE2000 color-difference formula: implementation notes,
    supplementary test data, and mathematical observations », Color Research & Application 30(1), p. 21-30.
    Vérifiée avec leurs 34 paires de test (scripts/themes/tests/).
    """
    L1, a1, b1 = lab1
    L2, a2, b2 = lab2
    c_mean = (math.hypot(a1, b1) + math.hypot(a2, b2)) / 2
    g = 0.5 * (1 - math.sqrt(c_mean ** 7 / (c_mean ** 7 + 25 ** 7)))
    a1p, a2p = (1 + g) * a1, (1 + g) * a2
    c1p, c2p = math.hypot(a1p, b1), math.hypot(a2p, b2)
    h1p = 0 if a1p == 0 and b1 == 0 else math.degrees(math.atan2(b1, a1p)) % 360
    h2p = 0 if a2p == 0 and b2 == 0 else math.degrees(math.atan2(b2, a2p)) % 360

    delta_l = L2 - L1
    delta_c = c2p - c1p
    if c1p * c2p == 0:
        delta_h = 0
    else:
        delta_h = h2p - h1p
        if delta_h > 180:
            delta_h -= 360
        elif delta_h < -180:
            delta_h += 360
    delta_big_h = 2 * math.sqrt(c1p * c2p) * math.sin(math.radians(delta_h / 2))

    l_mean = (L1 + L2) / 2
    cp_mean = (c1p + c2p) / 2
    if c1p * c2p == 0:
        h_mean = h1p + h2p
    elif abs(h1p - h2p) <= 180:
        h_mean = (h1p + h2p) / 2
    elif h1p + h2p < 360:
        h_mean = (h1p + h2p + 360) / 2
    else:
        h_mean = (h1p + h2p - 360) / 2

    t = (1 - 0.17 * math.cos(math.radians(h_mean - 30)) + 0.24 * math.cos(math.radians(2 * h_mean))
         + 0.32 * math.cos(math.radians(3 * h_mean + 6)) - 0.20 * math.cos(math.radians(4 * h_mean - 63)))
    delta_theta = 30 * math.exp(-((h_mean - 275) / 25) ** 2)
    r_c = 2 * math.sqrt(cp_mean ** 7 / (cp_mean ** 7 + 25 ** 7))
    s_l = 1 + 0.015 * (l_mean - 50) ** 2 / math.sqrt(20 + (l_mean - 50) ** 2)
    s_c = 1 + 0.045 * cp_mean
    s_h = 1 + 0.015 * cp_mean * t
    r_t = -math.sin(math.radians(2 * delta_theta)) * r_c
    dl, dc, dh = delta_l / s_l, delta_c / s_c, delta_big_h / s_h
    return math.sqrt(dl ** 2 + dc ** 2 + dh ** 2 + r_t * dc * dh)


def delta_e_2000(a, b, matrix=None):
    """Différence perçue CIEDE2000 entre deux couleurs, éventuellement après simulation de daltonisme."""
    return ciede2000(lab(a, matrix), lab(b, matrix))


def min_delta_e(a, b):
    """Plus petite différence perçue entre deux couleurs, toutes visions confondues."""
    return min((delta_e(a, b, m), name) for name, m in VIEWS.items())


def readable_on(color, background, minimum):
    """Version de la couleur lisible sur un fond : même teinte, juste assez éclaircie ou foncée, la plus vive possible."""
    if contrast(color, background) >= minimum:
        return color
    L, a, b = lab(color)
    chroma, hue = math.hypot(a, b), math.degrees(math.atan2(b, a)) % 360
    target = 100 if luminance(background) < 0.18 else 0
    direction = 1 if target > L else -1
    best = None
    start = None
    step = 0
    while 0 <= L + direction * step / 4 <= 100:
        lightness = L + direction * step / 4
        step += 1
        if start is not None and abs(lightness - start) > 8:
            break
        for tenth in range(10, -1, -1):
            candidate = lch_to_hex(lightness, chroma * tenth / 10, hue)
            if candidate and contrast(candidate, background) >= minimum:
                start = lightness if start is None else start
                if best is None or tenth > best[0]:
                    best = (tenth, candidate)
                break
    return best[1] if best else None


def lch_to_hex(L, C, H):
    """CIE LCh -> '#RRGGBB', ou None si la couleur sort du gamut sRGB."""
    a, b = C * math.cos(math.radians(H)), C * math.sin(math.radians(H))
    fy = (L + 16) / 116
    fx, fz = fy + a / 500, fy - b / 200
    inv = lambda t: t ** 3 if t ** 3 > 0.008856 else (t - 16 / 116) / 7.787
    X, Y, Z = 0.95047 * inv(fx), inv(fy), 1.08883 * inv(fz)
    rgb = (3.2406 * X - 1.5372 * Y - 0.4986 * Z,
           -0.9689 * X + 1.8758 * Y + 0.0415 * Z,
           0.0557 * X - 0.2040 * Y + 1.0570 * Z)
    out = []
    for v in rgb:
        if v < -0.001 or v > 1.001:
            return None
        v = min(1, max(0, v))
        out.append(12.92 * v if v <= 0.0031308 else 1.055 * v ** (1 / 2.4) - 0.055)
    return '#%02X%02X%02X' % tuple(round(x * 255) for x in out)
