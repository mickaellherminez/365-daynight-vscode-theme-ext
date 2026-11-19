"""Vérifie que les contrôles de l'audit échouent quand ils le doivent."""
import copy
import os
import sys
import unittest

HERE = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, os.path.dirname(HERE))
from audit import MIN_DELTA_E_2000, ROOT, checks, distinction_checks, load_theme, style_checks  # noqa: E402

THEME = os.path.join(ROOT, 'themes', '365-10-light-theme.json')


def failed(theme):
    return [label for label, _, _, status in style_checks(theme) if status != 'OK']


class HighContrastDefaultsTest(unittest.TestCase):
    """Un fond que le thème ne définit pas est celui de VS Code : le texte du thème doit y rester lisible."""

    INLINE_CODE = 'textPreformat.foreground / textPreformat.background'

    def status(self, theme):
        return {label: status for label, _, _, status in checks(theme, True)}

    def setUp(self):
        self.theme = load_theme(os.path.join(ROOT, 'themes', '365-01-hc-light-theme.json'))

    def test_generated_theme_passes(self):
        self.assertEqual(self.status(self.theme)[self.INLINE_CODE], 'OK')

    def test_inline_code_on_the_default_background_fails(self):
        theme = copy.deepcopy(self.theme)
        del theme['colors']['textPreformat.background']
        self.assertEqual(self.status(theme)[self.INLINE_CODE], 'ÉCHEC')

    def test_terminal_sticky_scroll_on_the_default_background_fails(self):
        theme = load_theme(os.path.join(ROOT, 'themes', '365-01-hc-dark-theme.json'))
        label = 'terminal.foreground / terminalStickyScrollHover.background'
        self.assertEqual(self.status(theme)[label], 'OK')
        del theme['colors']['terminalStickyScrollHover.background']
        self.assertEqual(self.status(theme)[label], 'ÉCHEC')


class HighContrastTextTest(unittest.TestCase):
    """En contraste élevé, tout texte demande 7:1, sauf une ligne sélectionnée de la console de débogage (4.5:1)."""

    WARNING = 'list.warningForeground / sideBar.background'

    def rows(self, theme, hc=True):
        return {label: (minimum, status) for label, _, minimum, status in checks(theme, hc)}

    def setUp(self):
        self.theme = load_theme(os.path.join(ROOT, 'themes', '365-01-hc-light-theme.json'))

    def test_interface_text_requires_7_to_1(self):
        self.assertEqual(self.rows(self.theme)[self.WARNING], (7, 'OK'))
        theme = copy.deepcopy(self.theme)
        theme['colors']['list.warningForeground'] = '#6B4A00'  # 6.61:1 sur la barre latérale de janvier
        self.assertEqual(self.rows(theme)[self.WARNING], (7, 'ÉCHEC'))

    def test_light_and_dark_themes_keep_4_5_to_1(self):
        self.assertEqual(self.rows(load_theme(THEME), False)[self.WARNING][0], 4.5)

    def test_selected_debug_console_text_keeps_4_5_to_1(self):
        rows = self.rows(self.theme)
        self.assertEqual(rows['Console : errorForeground sélectionné'], (4.5, 'OK'))
        self.assertEqual(rows['Console : errorForeground'], (7, 'OK'))

class DistinctionCheckTest(unittest.TestCase):
    """Chaque paire à distinguer compte comme un contrôle, dans chacune des 4 visions."""

    def setUp(self):
        self.theme = load_theme(THEME)

    def test_every_pair_is_a_check(self):
        # 21 paires de jetons principaux, puis 5 paires d'alertes, les tests réussi et échoué, 10 paires du graphe Git
        rows = distinction_checks(self.theme)
        self.assertEqual(len(rows), 4 * (21 + 5 + 1 + 10))
        for view in ('normal', 'protan', 'deutan', 'tritan'):
            self.assertEqual(sum(1 for r in rows if r[0].startswith(f'Distinction {view} :')), 37)

    def test_identical_alerts_fail_in_every_vision(self):
        theme = copy.deepcopy(self.theme)
        theme['colors']['editorWarning.foreground'] = theme['colors']['editorError.foreground']
        failed = [r for r in distinction_checks(theme) if r[3] != 'OK' and 'erreur / avertissement' in r[0]]
        self.assertEqual(len(failed), 4)
        for row in failed:
            self.assertLess(row[1], MIN_DELTA_E_2000)


class StyleCheckTest(unittest.TestCase):
    """WCAG 2.2, critère 1.4.1 : les styles qui portent un sens doivent être présents."""

    def setUp(self):
        self.theme = load_theme(THEME)

    def test_generated_theme_passes(self):
        self.assertEqual(failed(self.theme), [])

    def test_missing_comment_italic_fails(self):
        theme = copy.deepcopy(self.theme)
        for rule in theme['tokenColors']:
            if 'comment' in rule.get('scope', []):
                rule['settings'].pop('fontStyle', None)
        self.assertEqual(failed(theme), ['Style (WCAG 1.4.1) : commentaire en italique'])

    def test_later_rule_without_the_style_wins(self):
        # Comme dans VS Code, la dernière règle qui définit un style pour le scope l'emporte
        theme = copy.deepcopy(self.theme)
        theme['tokenColors'].append({'scope': ['invalid.deprecated'], 'settings': {'fontStyle': ''}})
        self.assertEqual(failed(theme), ['Style (WCAG 1.4.1) : code obsolète en barré'])

    def test_combined_styles_are_accepted(self):
        theme = copy.deepcopy(self.theme)
        theme['tokenColors'].append({'scope': 'comment', 'settings': {'fontStyle': 'italic bold'}})
        self.assertEqual(failed(theme), [])

    def test_missing_semantic_strikethrough_fails(self):
        theme = copy.deepcopy(self.theme)
        del theme['semanticTokenColors']['*.deprecated']
        self.assertEqual(failed(theme), ['Style (WCAG 1.4.1) : jeton sémantique obsolète en barré'])


if __name__ == '__main__':
    unittest.main()
