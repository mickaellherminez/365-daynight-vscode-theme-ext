"""Génère les images d'aperçu des thèmes pour les README (assets/screenshots/).

year.png dessine les 12 mois avec les couleurs réelles des thèmes (code, bande de l'accent, barre d'état
avec le bouton de l'extension), puis la capture avec Google Chrome en mode headless. Les autres images des
README sont des démos filmées dans VS Code.

Usage :
    python3 scripts/themes/preview.py                 # year.png
    python3 scripts/themes/preview.py --out /tmp/x    # écrit l'image dans un autre dossier

year.png ne montre que les variantes présentes dans les 12 palettes, pour que les mois restent comparables.
"""
import html
import json
import os
import subprocess
import sys
import tempfile

HERE = os.path.dirname(os.path.abspath(__file__))
ROOT = os.path.dirname(os.path.dirname(HERE))
OUT = os.path.join(ROOT, 'assets', 'screenshots')
CHROME = '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome'
VARIANTS = (('light', 'light', 'Light'), ('dark', 'dark', 'Dark'), ('hc', 'hc-dark', 'High Contrast'),
            ('hcLight', 'hc-light', 'High Contrast Light'))
MONTHS = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']
STATUS = {'light': 'LGT', 'dark': 'DRK', 'hc': 'HCT', 'hcLight': 'HCL'}

# Extrait de code : liste de lignes, chaque ligne = [(texte, rôle de couleur)]
CODE = [
    [('// Switch the theme with the time of day', 'comment')],
    [('import', 'keyword'), (' { ', 'punctuation'), ('workspace', 'variable'), (' } ', 'punctuation'), ('from', 'keyword'), (" 'vscode'", 'string'), (';', 'punctuation')],
    [],
    [('const', 'keyword'), (' DAY_START', 'number'), (' = ', 'operator'), ('7', 'number'), (';', 'punctuation')],
    [('export', 'keyword'), (' class', 'keyword'), (' ', 'punctuation'), ('ThemeClock', 'klass'), (' {', 'punctuation')],
    [('  isDay', 'function'), ('(', 'punctuation'), ('date', 'parameter'), (' = ', 'operator'), ('new', 'keyword'), (' Date', 'klass'), ('()) {', 'punctuation')],
    [('    return', 'keyword'), (' date', 'parameter'), ('.', 'punctuation'), ('getHours', 'function'), ('() >= ', 'punctuation'), ('DAY_START', 'number'), (';', 'punctuation')],
    [('  }', 'punctuation')],
    [('  label', 'property'), (' = ', 'operator'), ("'Day & Night'", 'string'), (';', 'punctuation')],
    [('}', 'punctuation')],
]
SELECTED_LINE = 5   # ligne sélectionnée (index)
FIND_WORD = ('ThemeClock', 4)
ERROR_WORD = ('workspace', 1)


def palettes(month):
    return json.load(open(os.path.join(HERE, 'palettes', f'{month:02d}.json'), encoding='utf-8'))


def variants(months):
    """Variantes présentes dans les palettes de tous ces mois, dans l'ordre de VARIANTS."""
    return [v for v in VARIANTS if all(v[0] in palettes(m) for m in months)]


def load(month, variant_file):
    return json.load(open(os.path.join(ROOT, 'themes', f'365-{month:02d}-{variant_file}-theme.json'), encoding='utf-8'))


def code_html(theme, palette, compact=False):
    c, t = theme['colors'], palette['tok']
    colors = dict(t, parameter=t['variable'])
    rows = []
    for i, line in enumerate(CODE):
        spans = []
        for text, role in line:
            style = f"color:{colors.get(role, c['editor.foreground'])}"
            if role in ('comment', 'parameter'):
                style += ';font-style:italic'
            content = html.escape(text)
            if not compact and (text.strip(), i) == FIND_WORD:
                content = (f"<span style=\"background:{c['editor.findMatchBackground']};outline:1px solid {c['editor.findMatchBorder']}\">"
                           f"{content}</span>")
            if not compact and (text.strip(), i) == ERROR_WORD:
                style += f";text-decoration:underline wavy {c['editorError.foreground']}"
            spans.append(f'<span style="{style}">{content}</span>')
        background = ''
        if i == SELECTED_LINE:
            background = f"background:{c['editor.selectionBackground']};"
            if 'editor.selectionForeground' in c:  # High Contrast : texte sélectionné forcé
                spans = [f"<span style=\"color:{c['editor.selectionForeground']}\">{html.escape(''.join(x for x, _ in line))}</span>"]
        elif i == 3 and not compact:
            background = f"background:{c['editor.lineHighlightBackground']};"
        number = '' if compact else (f"<span class=ln style=\"background:{c['editor.background']};color:{c['editorLineNumber.activeForeground' if i == 3 else 'editorLineNumber.foreground']}\">"
                                     f"{i + 1}</span>")
        rows.append(f'<div class=row style="{background}">{number}{"".join(spans) or "&nbsp;"}</div>')
    return ''.join(rows)


CSS = """
* { box-sizing: border-box; margin: 0; padding: 0; }
body { background: #F4F1EC; font: 13px/1.5 Menlo, Monaco, monospace; padding: 24px; }
.grid { display: grid; gap: 22px; }
.win { width: 600px; border-radius: 10px; overflow: hidden; box-shadow: 0 10px 30px #0003; }
.title { height: 30px; display: flex; align-items: center; justify-content: center; position: relative; font: 12px -apple-system, Helvetica, sans-serif; }
.dots { position: absolute; left: 10px; display: flex; gap: 6px; }
.dots i { width: 11px; height: 11px; border-radius: 50%; background: #FF5F57; } .dots i+i { background: #FEBC2E; } .dots i+i+i { background: #28C840; }
.body { display: flex; height: 268px; }
.activity { width: 40px; padding-top: 6px; } .act { height: 36px; display: flex; align-items: center; justify-content: center; font-size: 16px; }
.side { width: 150px; font: 12px -apple-system, Helvetica, sans-serif; }
.head { padding: 6px 10px; font-size: 10px; font-weight: 700; letter-spacing: .5px; }
.file { padding: 3px 12px; display: flex; justify-content: space-between; }
.main { flex: 1; min-width: 0; }
.tabs { display: flex; height: 32px; } .tab { padding: 6px 14px; font: 12px -apple-system, Helvetica, sans-serif; }
.code { padding: 6px 0; font-size: 12px; white-space: pre; }
.row { padding-right: 8px; height: 22px; line-height: 22px; overflow: hidden; } .ln { display: inline-block; width: 48px; text-align: right; padding-right: 14px; }
.status { height: 24px; display: flex; gap: 16px; align-items: center; padding: 0 10px; font: 11px -apple-system, Helvetica, sans-serif; }
.status .right { margin-left: auto; }
.tile { border-radius: 10px; overflow: hidden; box-shadow: 0 6px 18px #0002; background: #fff; }
.tile h3 { font: 600 14px -apple-system, Helvetica, sans-serif; padding: 8px 12px; color: #222; background: #fff; }
.strip { display: flex; } .variant { flex: 1; min-width: 0; display: flex; flex-direction: column; }
.snippet { flex: 1; padding: 6px 0 6px 10px; font-size: 9px; overflow: hidden; white-space: pre; }
.mini { display: flex; justify-content: space-between; padding: 2px 6px 2px 10px; font: 9px -apple-system, Helvetica, sans-serif; white-space: nowrap; }
.strip .row { height: 15px; line-height: 15px; }
"""


def shoot(body, name, width, height):
    os.makedirs(OUT, exist_ok=True)
    with tempfile.NamedTemporaryFile('w', suffix='.html', delete=False, encoding='utf-8') as f:
        f.write(f'<!doctype html><meta charset=utf-8><style>{CSS}</style><body>{body}</body>')
        page = f.name
    out = os.path.join(OUT, name)
    subprocess.run([CHROME, '--headless=new', '--disable-gpu', '--hide-scrollbars', '--force-device-scale-factor=2',
                    f'--window-size={width},{height}', f'--screenshot={out}', f'file://{page}'],
                   check=True, stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL)
    os.unlink(page)
    print('   écrit :', os.path.relpath(out, ROOT))


def year():
    tiles = []
    for m in range(1, 13):
        strips = []
        for v, f, _ in variants(range(1, 13)):
            theme = load(m, f)
            palette = palettes(m)[v]
            c = theme['colors']
            # Le code, sous une bande de l'accent, au-dessus d'une barre d'état avec le bouton de l'extension :
            # ce sont les trois éléments qui distinguent les mois
            strips.append(f"<div class=variant style=\"border-top:4px solid {c['activityBarBadge.background']}\">"
                          f"<div class=snippet style=\"background:{c['editor.background']}\">{code_html(theme, palette, compact=True)}</div>"
                          f"<div class=mini style=\"background:{c['statusBar.background']};color:{c['statusBar.foreground']}\">"
                          f"⑂ main<span style=\"color:{c['365DayNight.statusBarButton']}\">‹ {m:02d} {STATUS[v]} ›</span></div></div>")
        tiles.append(f'<div class=tile><h3>{MONTHS[m - 1]}</h3><div class=strip>{"".join(strips)}</div></div>')
    shoot(f'<div class=grid style="grid-template-columns:repeat(4,440px)">{"".join(tiles)}</div>', 'year.png', 1876, 760)


if __name__ == '__main__':
    if '--out' in sys.argv:
        OUT = os.path.abspath(sys.argv[sys.argv.index('--out') + 1])
    year()
