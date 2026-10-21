"""Génère les images d'aperçu des thèmes pour les README (assets/screenshots/).

Chaque aperçu dessine une fenêtre VS Code simplifiée (barre de titre, explorateur, onglets, code,
sélection, résultat de recherche, erreur, barre d'état) avec les couleurs réelles des thèmes,
puis la capture avec Google Chrome en mode headless.

Usage :
    python3 scripts/themes/preview.py            # hero.png (octobre) + year.png (les 12 mois)
    python3 scripts/themes/preview.py --month 5  # hero.png pour un autre mois
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
VARIANTS = (('light', 'light', 'Light'), ('dark', 'dark', 'Dark'), ('hc', 'hc-dark', 'High Contrast'))
MONTHS = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']
STATUS = {'light': 'LGT', 'dark': 'DRK', 'hc': 'HCT'}

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


def window_html(month, variant, variant_file, label):
    theme = load(month, variant_file)
    palette = json.load(open(os.path.join(HERE, 'palettes', f'{month:02d}.json'), encoding='utf-8'))[variant]
    c = theme['colors']
    border = c.get('contrastBorder', c.get('sideBar.border'))
    files = [('extension.js', c['gitDecoration.modifiedResourceForeground'], 'M'),
             ('package.json', c['sideBar.foreground'], ''),
             ('theme-clock.ts', c['list.activeSelectionForeground'], 'U'),
             ('README.md', c['gitDecoration.addedResourceForeground'], 'A')]
    items = []
    for i, (name, color, mark) in enumerate(files):
        selected = i == 2
        bg = c['list.activeSelectionBackground'] if selected else 'transparent'
        outline = f"outline:1px solid {c['list.focusOutline']};outline-offset:-1px;" if selected else ''
        markc = c['gitDecoration.untrackedResourceForeground'] if mark == 'U' else color
        items.append(f'<div class=file style="background:{bg};{outline}color:{color}">{name}'
                     f'<span style="color:{markc}">{mark}</span></div>')
    return f"""
<div class=win style="background:{c['editor.background']};border:1px solid {border}">
  <div class=title style="background:{c['titleBar.activeBackground']};color:{c['titleBar.activeForeground']};border-bottom:1px solid {c['titleBar.border']}">
    <span class=dots><i></i><i></i><i></i></span>365 {month:02d}-{MONTHS[month - 1]} {label}
  </div>
  <div class=body>
    <div class=activity style="background:{c['activityBar.background']};border-right:1px solid {c['activityBar.border']}">
      <div class=act style="border-left:2px solid {c['activityBar.activeBorder']};color:{c['activityBar.foreground']}">▣</div>
      <div class=act style="color:{c['activityBar.inactiveForeground']}">⌕</div>
      <div class=act style="color:{c['activityBar.inactiveForeground']}">⑂</div>
    </div>
    <div class=side style="background:{c['sideBar.background']};border-right:1px solid {c['sideBar.border']}">
      <div class=head style="color:{c['sideBarSectionHeader.foreground']};background:{c['sideBarSectionHeader.background']}">EXPLORER</div>
      {''.join(items)}
    </div>
    <div class=main>
      <div class=tabs style="background:{c['editorGroupHeader.tabsBackground']};border-bottom:1px solid {c['editorGroupHeader.tabsBorder']}">
        <div class=tab style="background:{c['tab.activeBackground']};color:{c['tab.activeForeground']};border-top:2px solid {c['tab.activeBorderTop']}">theme-clock.ts</div>
        <div class=tab style="background:{c['tab.inactiveBackground']};color:{c['tab.inactiveForeground']}">extension.js</div>
      </div>
      <div class=code style="color:{c['editor.foreground']}">{code_html(theme, palette)}</div>
    </div>
  </div>
  <div class=status style="background:{c['statusBar.background']};color:{c['statusBar.foreground']};border-top:1px solid {c['statusBar.border']}">
    <span>⑂ main</span><span>⚠ 0 ✕ 1</span><span class=right>◐ {STATUS[variant]}</span>
  </div>
</div>"""


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
.strip { display: flex; } .strip > div { flex: 1; padding: 6px 0 6px 10px; font-size: 9px; overflow: hidden; white-space: pre; }
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


def hero(month):
    cards = ''.join(window_html(month, v, f, label) for v, f, label in VARIANTS)
    shoot(f'<div class=grid style="grid-template-columns:repeat(3,600px)">{cards}</div>', 'hero.png', 1896, 380)


def year():
    tiles = []
    for m in range(1, 13):
        strips = []
        for v, f, _ in VARIANTS:
            theme = load(m, f)
            palette = json.load(open(os.path.join(HERE, 'palettes', f'{m:02d}.json'), encoding='utf-8'))[v]
            strips.append(f"<div style=\"background:{theme['colors']['editor.background']}\">{code_html(theme, palette, compact=True)}</div>")
        tiles.append(f'<div class=tile><h3>{MONTHS[m - 1]}</h3><div class=strip>{"".join(strips)}</div></div>')
    shoot(f'<div class=grid style="grid-template-columns:repeat(4,440px)">{"".join(tiles)}</div>', 'year.png', 1876, 694)


if __name__ == '__main__':
    month = int(sys.argv[sys.argv.index('--month') + 1]) if '--month' in sys.argv else 10
    hero(month)
    year()
