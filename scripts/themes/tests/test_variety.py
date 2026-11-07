"""Vérifie le test de variété avec des thèmes fictifs : il réussit, ou échoue, quand il le doit."""
import contextlib
import io
import os
import random
import sys
import unittest

HERE = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, os.path.dirname(HERE))
import variety  # noqa: E402
from colorlib import CVD, delta_e, lch_to_hex  # noqa: E402

SCOPES = ('comment', 'keyword', 'entity.name.function', 'string', 'constant.numeric', 'entity.name.class')


def theme(background, accent, syntax):
    """Thème minimal : fond, barre d'état, accent et les 6 couleurs de syntaxe comparées"""
    return {
        'name': 'test',
        'colors': {'editor.background': background, 'statusBar.background': background,
                   'activityBarBadge.background': accent, 'editor.foreground': '#000000'},
        'tokenColors': [{'scope': scope, 'settings': {'foreground': color}} for scope, color in zip(SCOPES, syntax)],
    }


def pick(count, generate, minimum, chosen=()):
    """Tire au hasard des couleurs assez éloignées entre elles, au plus 3 par famille de teinte"""
    result = list(chosen)
    while len(result) < count:
        color = generate()
        if (color and all(delta_e(color, other) >= minimum for other in result)
                and sum(variety.hue_family(other) == variety.hue_family(color) for other in result) < 3):
            result.append(color)
    return result


class VarietyTest(unittest.TestCase):

    @classmethod
    def setUpClass(cls):
        random.seed(4)
        cls.backgrounds = pick(12, lambda: lch_to_hex(random.uniform(5, 25), random.uniform(5, 15), random.uniform(0, 360)), 9)
        cls.accents = pick(12, lambda: lch_to_hex(random.uniform(40, 85), random.uniform(30, 70), random.uniform(0, 360)), 26)
        cls.syntax = [[lch_to_hex(60, 30, (i * 30 + k * 60) % 360) for k in range(6)] for i in range(12)]

    def months(self, backgrounds=None, accents=None):
        backgrounds = backgrounds or self.backgrounds
        accents = accents or self.accents
        return {i + 1: theme(backgrounds[i], accents[i], self.syntax[i]) for i in range(12)}

    def run_variety(self, months):
        original = variety.load_variants
        variety.load_variants = lambda: {'vs-dark': months}
        try:
            with contextlib.redirect_stdout(io.StringIO()) as output:
                code = variety.main([])
        finally:
            variety.load_variants = original
        return code, output.getvalue()

    def test_distinct_months_pass(self):
        code, output = self.run_variety(self.months())
        self.assertEqual(code, 0, output)

    def test_two_months_with_the_same_background_fail(self):
        backgrounds = list(self.backgrounds)
        backgrounds[1] = backgrounds[0]
        code, output = self.run_variety(self.months(backgrounds=backgrounds))
        self.assertEqual(code, 1)
        self.assertIn('01/02 0.0', output)

    def test_four_gray_backgrounds_fail_the_family_limit(self):
        backgrounds = ['#101010', '#202020', '#303030', '#404040'] + list(self.backgrounds[4:])
        code, output = self.run_variety(self.months(backgrounds=backgrounds))
        self.assertEqual(code, 1)
        self.assertIn('neutre 4 (01 02 03 04)', output)

    def test_color_vision_deficiency_never_fails(self):
        # Un rouge et un vert de même clarté : distincts en vision normale, confondus en deutéranopie
        red, green = lch_to_hex(55, 55, 40), lch_to_hex(55, 55, 135)
        self.assertGreater(delta_e(red, green), 25)
        self.assertLess(delta_e(red, green, CVD['deutan']), 10)
        random.seed(7)
        accents = pick(12, lambda: lch_to_hex(random.uniform(40, 85), random.uniform(30, 70), random.uniform(0, 360)), 26,
                       chosen=(red, green))
        code, output = self.run_variety(self.months(accents=accents))
        self.assertEqual(code, 0, output)

    def test_hue_families(self):
        self.assertEqual(variety.hue_family('#000000'), 'neutre')
        self.assertEqual(variety.hue_family(lch_to_hex(50, 30, 22)), 'rose')
        self.assertEqual(variety.hue_family(lch_to_hex(50, 30, 23)), 'rouge-orangé')
        self.assertEqual(variety.hue_family(lch_to_hex(50, 30, 340)), 'rose')
        self.assertEqual(variety.hue_family(lch_to_hex(50, 30, 270)), 'bleu')


if __name__ == '__main__':
    unittest.main()
