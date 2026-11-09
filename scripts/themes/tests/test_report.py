"""Vérifie que le rapport d'audit est complet, stable, et que sa vérification détecte un fichier périmé."""
import os
import sys
import tempfile
import unittest

HERE = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, os.path.dirname(HERE))
import report  # noqa: E402


class ReportTest(unittest.TestCase):
    @classmethod
    def setUpClass(cls):
        cls.data = report.collect()
        cls.markdown = report.to_markdown(cls.data)

    def test_every_theme_is_reported(self):
        self.assertEqual(self.data['themeCount'], 48)
        self.assertEqual(sum(len(v['themes']) for v in self.data['variants'].values()), 48)

    def test_limits_are_published(self):
        for limit in ('No testing with real users', 'Partial forms', 'APCA', 'project rules'):
            self.assertIn(limit, self.markdown)

    def test_each_theme_has_all_the_scores(self):
        names = {'protanopia', 'deuteranopia', 'tritanopia', 'protanomaly', 'deuteranomaly', 'tritanomaly',
                 'achromatopsia', 'lowVision20/40', 'lowVision20/80'}
        for variant in self.data['variants'].values():
            for theme in variant['themes']:
                self.assertEqual(set(theme['scores']), names, theme['name'])
                for name, score in theme['scores'].items():
                    self.assertTrue(0 <= score <= 100, (theme['name'], name, score))

    def test_a_theme_with_only_two_grays_scores_zero_when_they_look_the_same(self):
        rules = [{'scope': scope, 'settings': {'foreground': '#808080'}} for scope in report.audit.TOKEN_PROBES.values()]
        text = [('text', 3.0, 4.5, 'OK'), ('text', 8.0, 7, 'OK')]
        scores = report.vision_scores({'tokenColors': rules, 'colors': {}}, text)
        self.assertEqual(scores['protanopia'], 0)
        self.assertEqual(scores['achromatopsia'], 0)
        self.assertEqual(scores['lowVision20/40'], 50)
        self.assertEqual(scores['lowVision20/80'], 50)

    def test_report_is_stable(self):
        self.assertEqual(self.markdown, report.to_markdown(report.collect()))

    def test_no_french_label_leaks_into_the_report(self):
        for word in ('Fond', 'Cadre', 'Syntaxe', 'mot-clé', 'chaîne'):
            self.assertNotIn(word, self.markdown)

    def test_stale_detects_missing_and_changed_files(self):
        with tempfile.TemporaryDirectory() as root:
            expected = {'report.md': 'current\n'}
            self.assertEqual(report.stale(expected, root), ['report.md'])
            path = os.path.join(root, 'report.md')
            with open(path, 'w', encoding='utf-8') as handle:
                handle.write('old\n')
            self.assertEqual(report.stale(expected, root), ['report.md'])
            with open(path, 'w', encoding='utf-8') as handle:
                handle.write('current\n')
            self.assertEqual(report.stale(expected, root), [])


if __name__ == '__main__':
    unittest.main()
