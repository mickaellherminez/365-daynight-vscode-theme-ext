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


def min_delta_e(a, b):
    """Plus petite différence perçue entre deux couleurs, toutes visions confondues."""
    return min((delta_e(a, b, m), name) for name, m in VIEWS.items())


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
