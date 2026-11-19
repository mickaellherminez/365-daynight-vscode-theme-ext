"""Génère daltonlens-cvd.json : couleurs simulées par DaltonLens, pour vérifier Brettel et Viénot dans colorlib.py.

Ce script n'est pas lancé par les tests. Il sert seulement à refaire le fichier de référence :

    python3 -m venv /tmp/daltonlens && /tmp/daltonlens/bin/pip install daltonlens==0.1.5 numpy
    /tmp/daltonlens/bin/python -I scripts/themes/tests/data/daltonlens_reference.py > scripts/themes/tests/data/daltonlens-cvd.json

DaltonLens (licence MIT) : https://github.com/DaltonLens/DaltonLens-Python. Les simulateurs sont pris avec leurs
paramètres par défaut : modèle LMS de Smith et Pokorny (1975) adapté à sRGB, blanc RGB comme neutre.
"""
import json
from importlib.metadata import version

import numpy as np
from daltonlens import convert, simulate

LEVELS = (0, 51, 102, 153, 204, 255)
colors = [(r, g, b) for r in LEVELS for g in LEVELS for b in LEVELS]
linear = convert.linearRGB_from_sRGB(np.array([colors], dtype=np.float64) / 255)

DEFICIENCIES = {'protan': simulate.Deficiency.PROTAN, 'deutan': simulate.Deficiency.DEUTAN,
                'tritan': simulate.Deficiency.TRITAN}
MODELS = {
    'Brettel 1997': (simulate.Simulator_Brettel1997(), ('protan', 'deutan', 'tritan')),
    'Viénot 1999': (simulate.Simulator_Vienot1999(), ('protan', 'deutan')),
}

result = {
    'source': f'DaltonLens {version("daltonlens")}, scripts/themes/tests/data/daltonlens_reference.py',
    'input': ['#%02X%02X%02X' % c for c in colors],
    'output': 'RGB linéaire, avant écrêtage entre 0 et 1',
}
for name, (simulator, deficiencies) in MODELS.items():
    result[name] = {}
    for deficiency in deficiencies:
        out = simulator._simulate_dichromacy_linear_rgb(linear.copy(), DEFICIENCIES[deficiency])
        result[name][deficiency] = [[round(float(x), 12) for x in pixel] for pixel in out[0]]

print(json.dumps(result, ensure_ascii=False, indent=1))
