"""Vérifie les outils de mesure de colorlib.py contre des valeurs de référence publiées.

Lancer : npm run themes:test   (ou python3 -m unittest discover -s scripts/themes/tests)
Les sources des données sont décrites dans data/README.md.
"""
import json
import os
import sys
import unittest

HERE = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, os.path.dirname(HERE))
from colorlib import ACHROMATOPSIA, CVD, simulate, ciede2000, contrast, delta_e, delta_e_2000, lab  # noqa: E402

DATA = os.path.join(HERE, 'data')


class ContrastTest(unittest.TestCase):
    """Ratio de contraste de WCAG 2.x : (L1 + 0,05) / (L2 + 0,05), avec la luminance relative de sRGB."""

    def test_extremes(self):
        self.assertAlmostEqual(contrast('#000000', '#FFFFFF'), 21.0, places=6)
        self.assertAlmostEqual(contrast('#7F7F7F', '#7F7F7F'), 1.0, places=6)

    def test_order_does_not_matter(self):
        self.assertAlmostEqual(contrast('#1565C0', '#FAFCFF'), contrast('#FAFCFF', '#1565C0'), places=9)

    def test_darkest_gray_that_passes_aa_on_white(self):
        # #767676 sur blanc donne 4,54:1, la valeur couramment citée comme le gris le plus clair qui passe AA ;
        # #777777, juste au-dessus, échoue (4,48:1)
        self.assertEqual(round(contrast('#767676', '#FFFFFF'), 2), 4.54)
        self.assertGreaterEqual(contrast('#767676', '#FFFFFF'), 4.5)
        self.assertEqual(round(contrast('#777777', '#FFFFFF'), 2), 4.48)
        self.assertLess(contrast('#777777', '#FFFFFF'), 4.5)

    def test_primary_colors(self):
        # Luminances relatives des primaires sRGB : 0,2126 (rouge), 0,7152 (vert), 0,0722 (bleu)
        self.assertAlmostEqual(contrast('#FF0000', '#000000'), (0.2126 + 0.05) / 0.05, places=4)
        self.assertAlmostEqual(contrast('#00FF00', '#000000'), (0.7152 + 0.05) / 0.05, places=4)
        self.assertAlmostEqual(contrast('#0000FF', '#000000'), (0.0722 + 0.05) / 0.05, places=4)


class Ciede2000Test(unittest.TestCase):
    """Les 34 paires de test de Sharma, Wu et Dalal (2005), au dix-millième près."""

    @classmethod
    def setUpClass(cls):
        with open(os.path.join(DATA, 'sharma2005-ciede2000.txt'), encoding='utf-8') as file:
            cls.rows = [[float(x) for x in line.split()] for line in file if line.strip()]

    def test_all_pairs(self):
        self.assertEqual(len(self.rows), 34)
        for i, row in enumerate(self.rows, 1):
            with self.subTest(pair=i):
                self.assertAlmostEqual(ciede2000(row[0:3], row[3:6]), row[6], places=4)

    def test_symmetry(self):
        for i, row in enumerate(self.rows, 1):
            with self.subTest(pair=i):
                self.assertAlmostEqual(ciede2000(row[0:3], row[3:6]), ciede2000(row[3:6], row[0:3]), places=9)

    def test_identical_colors(self):
        self.assertEqual(delta_e_2000('#3B2718', '#3B2718'), 0)


class ColorVisionDeficiencyTest(unittest.TestCase):
    """Les matrices de colorlib.py sont celles publiées par Machado, Oliveira et Fernandes (2009)."""

    @classmethod
    def setUpClass(cls):
        with open(os.path.join(DATA, 'machado2009-cvd.json'), encoding='utf-8') as file:
            cls.published = json.load(file)

    def test_matrices_match_severity_one(self):
        # La sévérité 1,0 du tableau publié est la dichromatie : protanopie, deutéranopie, tritanopie
        for name in ('protan', 'deutan', 'tritan'):
            with self.subTest(view=name):
                self.assertEqual(CVD[name], self.published['1.0'][name])

    def test_published_table_is_complete(self):
        self.assertEqual(sorted(self.published), [f'{s / 10:.1f}' for s in range(11)])
        identity = [[1.0, 0.0, 0.0], [0.0, 1.0, 0.0], [0.0, 0.0, 1.0]]
        for name in ('protan', 'deutan', 'tritan'):
            self.assertEqual([[abs(x) for x in row] for row in self.published['0.0'][name]], identity)

    def test_white_and_gray_stay_neutral(self):
        # Chaque ligne d'une matrice publiée a une somme proche de 1 : le blanc et les gris ne changent pas
        for severity, matrices in self.published.items():
            for name, matrix in matrices.items():
                for row in matrix:
                    with self.subTest(severity=severity, view=name):
                        self.assertAlmostEqual(sum(row), 1.0, delta=0.002)
        for name, matrix in CVD.items():
            with self.subTest(view=name):
                self.assertLess(delta_e('#808080', '#808080', matrix), 0.01)
                self.assertLess(delta_e('#FFFFFF', '#FFFFFF', matrix), 0.01)
                self.assertLess(delta_e('#808080', '#808080'), 0.01)

    def test_red_and_green_merge_for_red_green_deficiencies(self):
        # Un rouge-orangé et un vert sur une même ligne de confusion : très différents en vision normale
        # (ΔE 72), presque confondus en protanopie et en deutéranopie (ΔE 12), toujours différents en tritanopie
        red, green = '#CA502B', '#5E7F2B'
        self.assertGreater(delta_e(red, green), 40)
        self.assertLess(delta_e(red, green, CVD['protan']), 15)
        self.assertLess(delta_e(red, green, CVD['deutan']), 15)
        self.assertGreater(delta_e(red, green, CVD['tritan']), 30)


class SimulateTest(unittest.TestCase):
    def test_grays_are_unchanged(self):
        for matrix in CVD.values():
            self.assertEqual(simulate('#808080', matrix), '#808080')

    def test_matches_the_color_used_for_the_distances(self):
        for matrix in list(CVD.values()) + [ACHROMATOPSIA]:
            for color in ('#C0392B', '#2ECC71', '#2980B9'):
                expected, seen = lab(color, matrix), lab(simulate(color, matrix))
                for a, b in zip(expected, seen):
                    self.assertAlmostEqual(a, b, delta=0.6)


class AchromatopsiaTest(unittest.TestCase):
    """Sans couleur, il ne reste que la clarté : chaque couleur devient le gris de même luminance."""

    def test_colors_become_gray(self):
        for color in ('#B13F0B', '#1565C0', '#2E7D32', '#FFD700'):
            with self.subTest(color=color):
                lightness, a, b = lab(color, ACHROMATOPSIA)
                self.assertLess(abs(a), 0.05)
                self.assertLess(abs(b), 0.05)
                self.assertAlmostEqual(lightness, lab(color)[0], delta=0.05)

    def test_only_lightness_differences_remain(self):
        red, green = '#B5443D', '#5E7F2B'
        self.assertAlmostEqual(delta_e(red, green, ACHROMATOPSIA), abs(lab(red)[0] - lab(green)[0]), delta=0.1)


if __name__ == '__main__':
    unittest.main()
