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
        for limit in ('No testing with real users', 'Partial forms', 'APCA', 'project rules', 'CIE76 is a simple measure'):
            self.assertIn(limit, self.markdown)

    def test_ciede2000_is_reported_for_each_vision(self):
        for variant in self.data['variants'].values():
            for theme in variant['themes']:
                self.assertEqual(set(theme['ciede2000']), {'normal', 'protanopia', 'deuteranopia', 'tritanopia'})

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

    def test_previews_cover_every_simulation(self):
        for variant in self.data['variants'].values():
            for theme in variant['themes']:
                self.assertEqual(set(theme['simulated']), {'protanopia', 'deuteranopia', 'tritanopia', 'achromatopsia'})
                self.assertEqual(len(theme['colors']['tokens']), 14, theme['name'])
                self.assertEqual(set(theme['syntaxContrast']), set(theme['colors']['tokens']))

    def test_achromatopsia_preview_is_gray(self):
        theme = self.data['variants']['Dark']['themes'][0]
        for color in theme['simulated']['achromatopsia']['tokens'].values():
            self.assertEqual(color[1:3], color[3:5])
            self.assertEqual(color[3:5], color[5:7])

    def test_month_grids_are_symmetric(self):
        for label, variant in self.data['variants'].items():
            for kind in ('background', 'syntax'):
                matrix = variant['grids']['current'][kind]
                self.assertEqual(len(matrix), 12)
                for i in range(12):
                    self.assertEqual(matrix[i][i], 0, label)
                    for j in range(12):
                        self.assertEqual(matrix[i][j], matrix[j][i], label)

    def test_before_grid_exists_only_for_the_variants_of_0_12_0(self):
        grids = {label: variant['grids']['before'] for label, variant in self.data['variants'].items()}
        self.assertIsNone(grids['High Contrast Light'])
        for label in ('Light', 'Dark', 'High Contrast'):
            self.assertEqual(len(grids[label]['syntax']), 12)

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
