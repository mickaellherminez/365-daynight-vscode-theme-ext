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

# Viénot, Brettel et Mollon (1999), « Digital video colourmaps for checking the legibility of displays by
# dichromats », Color Research & Application 24(4), p. 243-252. Une seule projection par dichromatie, valable pour
# la protanopie et la deutéranopie seulement. Matrices en RGB linéaire, calculées par DaltonLens 0.1.5 (modèle LMS
# de Smith et Pokorny adapté à sRGB) et vérifiées contre ses résultats (scripts/themes/tests/).
VIENOT = {
    'protan': [[0.1088893110253553, 0.8911106889746441, 0.0], [0.10888931102535536, 0.8911106889746446, 0.0],
               [0.004471314172181988, -0.004471314172181949, 1.0]],
    'deutan': [[0.2903053212655528, 0.7096946787344469, 0.0], [0.29030532126555286, 0.7096946787344469, 0.0],
               [-0.02197353944733135, 0.021973539447331363, 1.0]],
}

# Brettel, Viénot et Mollon (1997), « Computerized simulation of color appearance for dichromats », Journal of the
# Optical Society of America A 14(10), p. 2647-2655. Deux demi-plans par dichromatie : une couleur est projetée sur
# le premier ou le second selon le côté du plan de séparation où elle se trouve. C'est le seul des trois modèles qui
# vaille pour la tritanopie. Matrices en RGB linéaire, calculées comme les précédentes.
BRETTEL = {
    'protan': {
        'plane1': [[0.14509618931338164, 1.2016532157622424, -0.34674940507562363],
                   [0.10446500989201518, 0.8531639308397114, 0.04237105926827329],
                   [0.0042896394038027625, -0.006029519250709631, 1.0017398798469068]],
        'plane2': [[0.1411517215232287, 1.1678219369471488, -0.30897365847037833],
                   [0.10494700431240045, 0.8572979454877919, 0.0377550501998077],
                   [0.004309431507017369, -0.005859764495996709, 1.0015503329889792]],
        'separation': [0.00048454953529869423, 0.004155929595708196, -0.0046404791310068905],
    },
    'deutan': {
        'plane1': [[0.36198239320435854, 0.8675466622532473, -0.2295290554576064],
                   [0.2609853389970158, 0.6451242766151196, 0.0938903843878646],
                   [-0.01975427669264204, 0.026860946512120308, 0.9928933301805217]],
        'plane2': [[0.37009000982854123, 0.8854017912522372, -0.25549180108077885],
                   [0.2576688645759613, 0.6378205175260239, 0.10451061789801484],
                   [-0.019503248977409616, 0.02741377633197485, 0.9920894726454347]],
        'separation': [-0.0029279800414292994, -0.006448191098510094, 0.009376171139939394],
    },
    'tritan': {
        'plane1': [[1.0135416153085874, 0.14268231071503093, -0.1562239260236198],
                   [-0.01180536477256513, 0.8756118316612331, 0.1361935331113322],
                   [0.07707253450633182, 0.812080912463489, 0.11084655303017935]],
        'plane2': [[0.9333697629350477, 0.19999004994381192, -0.13335981287886017],
                   [0.05808718055484977, 0.8256518563946372, 0.11626096305051282],
                   [-0.3792281148392172, 1.1382497341689028, 0.24097838067031496]],
        'separation': [0.03960095072164182, -0.028307203712766432, -0.011293747008875398],
    },
}

# Modèles retenus pour chaque dichromatie (décision du 19 novembre 2026, issue #96) : une paire de couleurs doit
# rester distincte avec chacun d'eux. Machado 2009 ne vaut pas pour la tritanopie, ni Viénot 1999.
MODELS = {
    'protan': {'Machado 2009': CVD['protan'], 'Brettel 1997': BRETTEL['protan'], 'Viénot 1999': VIENOT['protan']},
    'deutan': {'Machado 2009': CVD['deutan'], 'Brettel 1997': BRETTEL['deutan'], 'Viénot 1999': VIENOT['deutan']},
    'tritan': {'Brettel 1997': BRETTEL['tritan']},
}

# Vision normale + les 3 formes de dichromatie, chacune avec ses modèles. La vision normale n'a pas de modèle (nom vide)
VIEWS = {'normal': {'': None}, **MODELS}
# Toutes les simulations à vérifier, vision normale comprise
SIMULATIONS = [simulation for models in VIEWS.values() for simulation in models.values()]

# Achromatopsie (vision sans couleur) : chaque couleur devient le gris de même luminance (CIE Y, coefficients
# de sRGB). C'est une approximation : les personnes achromates voient avec les bâtonnets, dont la sensibilité
# (scotopique) rend le bleu un peu plus clair et le rouge plus sombre. Seul l'écart de clarté reste visible.
ACHROMATOPSIA = [[0.2126, 0.7152, 0.0722]] * 3


def _gamma(v):
    return 12.92 * v if v <= 0.0031308 else 1.055 * v ** (1 / 2.4) - 0.055


def project(v, simulation):
    """Applique une simulation à une couleur en RGB linéaire, sans écrêtage.

    La simulation est une matrice 3×3 (Machado, Viénot, achromatopsie) ou les deux demi-plans de Brettel.
    """
    if isinstance(simulation, dict):
        side = sum(n * x for n, x in zip(simulation['separation'], v))
        simulation = simulation['plane2'] if side < 0 else simulation['plane1']
    return [sum(simulation[i][j] * v[j] for j in range(3)) for i in range(3)]


def simulate(color, simulation):
    """Couleur telle qu'elle est vue après simulation : '#RRGGBB' -> '#RRGGBB', arrondie à 8 bits comme à l'écran."""
    (r, g, b), _ = parse(color)
    linear = [max(0, min(1, x)) for x in project([_linear(r), _linear(g), _linear(b)], simulation)]
    return '#%02X%02X%02X' % tuple(round(_gamma(x) * 255) for x in linear)


def lab(color, simulation=None):
    """Couleur -> CIE L*a*b* (D65), éventuellement après simulation (couleur simulée arrondie à 8 bits)."""
    if simulation:
        color = simulate(color, simulation)
    (r, g, b), _ = parse(color)
    v = [_linear(r), _linear(g), _linear(b)]
    X = (0.4124 * v[0] + 0.3576 * v[1] + 0.1805 * v[2]) / 0.95047
    Y = 0.2126 * v[0] + 0.7152 * v[1] + 0.0722 * v[2]
    Z = (0.0193 * v[0] + 0.1192 * v[1] + 0.9505 * v[2]) / 1.08883
    f = lambda t: t ** (1 / 3) if t > 0.008856 else 7.787 * t + 16 / 116
    return 116 * f(Y) - 16, 500 * (f(X) - f(Y)), 200 * (f(Y) - f(Z))


def delta_e(a, b, simulation=None):
    """Différence perçue (CIE76). En dessous de ~10, deux couleurs de texte se confondent."""
    return math.dist(lab(a, simulation), lab(b, simulation))


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


def delta_e_2000(a, b, simulation=None):
    """Différence perçue CIEDE2000 entre deux couleurs, éventuellement après simulation de daltonisme."""
    return ciede2000(lab(a, simulation), lab(b, simulation))


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
