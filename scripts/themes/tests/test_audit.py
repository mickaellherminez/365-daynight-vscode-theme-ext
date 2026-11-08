"""Vérifie que les contrôles de l'audit échouent quand ils le doivent."""
import copy
import os
import sys
import unittest

HERE = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, os.path.dirname(HERE))
from audit import ROOT, checks, load_theme, style_checks  # noqa: E402

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
