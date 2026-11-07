"""Audit d'accessibilité des thèmes : contrastes WCAG et distinction des couleurs pour les daltoniens.

Usage :
    python3 scripts/themes/audit.py                      # tous les thèmes de package.json
    python3 scripts/themes/audit.py themes/365-10-*.json # thèmes choisis
    python3 scripts/themes/audit.py -v ...               # affiche aussi les contrôles réussis

Code de sortie 1 si au moins un contrôle échoue.
"""
import itertools
import json
import os
import re
import sys

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from colorlib import ACHROMATOPSIA, CVD, VIEWS, contrast, delta_e, delta_e_2000, over  # noqa: E402

ROOT = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

# Scope TextMate représentatif de chaque catégorie de jeton
TOKEN_PROBES = {
    'commentaire': 'comment', 'mot-clé': 'keyword', 'fonction': 'entity.name.function', 'chaîne': 'string',
    'nombre': 'constant.numeric', 'classe': 'entity.name.class', 'variable': 'variable', 'opérateur': 'keyword.operator',
    'ponctuation': 'punctuation', 'balise': 'entity.name.tag', 'attribut': 'entity.other.attribute-name',
    'regex': 'string.regexp', 'clé JSON': 'support.type.property-name.json', 'invalide': 'invalid',
}

# Catégories qui doivent rester distinguables entre elles, y compris pour les daltoniens
DISTINCT_TOKENS = ('mot-clé', 'fonction', 'chaîne', 'nombre', 'classe', 'commentaire', 'variable')

# WCAG 2.2, critère 1.4.1 (utilisation de la couleur) : ces styles portent un sens, l'information ne doit pas
# passer par la couleur seule. (catégorie, scope TextMate représentatif, style attendu)
REQUIRED_STYLES = (
    ('commentaire', 'comment', 'italic'),
    ('code invalide', 'invalid', 'underline'),
    ('code obsolète', 'invalid.deprecated', 'strikethrough'),
    ('lien', 'markup.underline.link', 'underline'),
    ('titre Markdown', 'markup.heading', 'bold'),
    ('gras Markdown', 'markup.bold', 'bold'),
    ('italique Markdown', 'markup.italic', 'italic'),
)
STYLE_NAMES = {'italic': 'italique', 'bold': 'gras', 'underline': 'souligné', 'strikethrough': 'barré'}
DISTINCT_ALERTS = (('erreur', 'avertissement'), ('erreur', 'info'), ('ajout', 'suppression'),
                   ('ajout', 'modification'), ('modification', 'suppression'))
ALERT_KEYS = {
    'erreur': 'editorError.foreground', 'avertissement': 'editorWarning.foreground', 'info': 'editorInfo.foreground',
    'ajout': 'editorGutter.addedBackground', 'modification': 'editorGutter.modifiedBackground',
    'suppression': 'editorGutter.deletedBackground',
}
# Jetons sémantiques colorés que chaque thème doit définir (les langages comme TypeScript ou Python
# les utilisent à la place des règles TextMate quand semanticHighlighting est actif)
SEMANTIC_ROLES = (
    'variable.readonly', 'parameter', 'function', 'method', 'class', 'enum', 'interface', 'namespace',
    'typeParameter', 'enumMember', 'property', 'variable.defaultLibrary', 'keyword', 'comment.documentation',
)
# Surfaces récentes : couleurs que VS Code fixe sans tenir compte du thème, que chaque thème doit donc définir
PRIORITY_KEYS = (
    'chat.slashCommandBackground', 'chat.slashCommandForeground', 'chat.avatarBackground', 'chat.editedFileForeground',
    'chat.linesAddedForeground', 'chat.linesRemovedForeground', 'chat.checkpointSeparator',
    'testing.iconPassed', 'testing.iconFailed', 'testing.iconErrored', 'testing.iconQueued', 'testing.iconSkipped',
    'testing.iconUnset', 'testing.runAction',
    'scmGraph.foreground1', 'scmGraph.foreground2', 'scmGraph.foreground3', 'scmGraph.foreground4', 'scmGraph.foreground5',
    'scmGraph.historyItemRefColor', 'scmGraph.historyItemRemoteRefColor', 'scmGraph.historyItemBaseRefColor',
    'scmGraph.historyItemHoverAdditionsForeground', 'scmGraph.historyItemHoverDeletionsForeground',
    'mergeEditor.change.background', 'mergeEditor.change.word.background', 'mergeEditor.changeBase.background',
    'mergeEditor.changeBase.word.background', 'mergeEditor.conflictingLines.background',
    'mergeEditor.conflict.unhandledFocused.border', 'mergeEditor.conflict.handledFocused.border',
    'multiDiffEditor.headerBackground',
) + tuple(f'symbolIcon.{kind}Foreground' for kind in (
    'class', 'constructor', 'enumerator', 'enumeratorMember', 'event', 'field', 'function', 'interface', 'method',
    'variable'))

# Couleurs que VS Code dérive d'une autre quand le thème ne les définit pas (valeurs par défaut de VS Code
# 1.145). L'audit suit cet héritage pour contrôler les surfaces qui n'ont pas besoin d'être redéfinies.
INHERITED = {
    'inlineChat.background': 'editorWidget.background', 'inlineChat.foreground': 'editorWidget.foreground',
    'inlineChatInput.background': 'input.background', 'inlineChatInput.placeholderForeground': 'input.placeholderForeground',
    'commandCenter.foreground': 'titleBar.activeForeground', 'commandCenter.inactiveForeground': 'titleBar.inactiveForeground',
    'notebook.editorBackground': 'editor.background', 'notebook.focusedCellBorder': 'focusBorder',
    'agentsPanel.foreground': 'sideBar.foreground',
    'agentsChatInput.background': 'input.background', 'agentsChatInput.foreground': 'input.foreground',
    'agentsChatInput.placeholderForeground': 'input.placeholderForeground',
    'agentsBadge.background': 'activityBarBadge.background', 'agentsBadge.foreground': 'activityBarBadge.foreground',
}
MIN_DELTA_E = 10
MIN_BUTTON_DELTA_E = 15


def load_theme(path):
    """Charge un thème JSONC (VS Code accepte les commentaires et les virgules finales)."""
    text = open(path, encoding='utf-8').read()
    text = re.sub(r'^\s*//.*$', '', text, flags=re.M)
    text = re.sub(r',(\s*[}\]])', r'\1', text)
    return json.loads(text)


def token_colors(theme):
    """Couleur de chaque catégorie de jeton (la dernière règle correspondante l'emporte, comme dans VS Code)."""
    found = {}
    for rule in theme.get('tokenColors', []):
        scopes = rule.get('scope', [])
        if isinstance(scopes, str):
            scopes = scopes.split(',')
        scopes = {s.strip() for s in scopes}
        color = rule.get('settings', {}).get('foreground')
        if not color:
            continue
        for label, probe in TOKEN_PROBES.items():
            if probe in scopes:
                found[label] = color
    found.setdefault('variable', theme.get('colors', {}).get('editor.foreground'))
    return {k: v for k, v in found.items() if v}


def token_style(theme, scope):
    """Style de police d'un scope TextMate (la dernière règle qui en définit un l'emporte), ou chaîne vide."""
    style = ''
    for rule in theme.get('tokenColors', []):
        scopes = rule.get('scope', [])
        if isinstance(scopes, str):
            scopes = scopes.split(',')
        settings = rule.get('settings', {})
        if scope in {s.strip() for s in scopes} and 'fontStyle' in settings:
            style = settings['fontStyle'] or ''
    return style


def style_checks(theme):
    """Contrôles du critère WCAG 1.4.1 : (libellé, None, style attendu, statut)."""
    rows = []
    for label, scope, style in REQUIRED_STYLES:
        present = style in token_style(theme, scope).split()
        rows.append((f'Style (WCAG 1.4.1) : {label} en {STYLE_NAMES[style]}', None, style, 'OK' if present else 'ÉCHEC'))
    # TypeScript et d'autres langages signalent le code obsolète par un jeton sémantique
    deprecated = theme.get('semanticTokenColors', {}).get('*.deprecated')
    present = isinstance(deprecated, dict) and (deprecated.get('strikethrough') is True
                                                or 'strikethrough' in (deprecated.get('fontStyle') or '').split())
    rows.append(('Style (WCAG 1.4.1) : jeton sémantique obsolète en barré', None, 'strikethrough', 'OK' if present else 'ÉCHEC'))
    return rows


def semantic_colors(theme):
    """Couleur de chaque jeton sémantique ; None pour une règle qui ne change que le style (ex. barré)."""
    found = {}
    for key, value in theme.get('semanticTokenColors', {}).items():
        found[key] = value if isinstance(value, str) else value.get('foreground')
    return found


def resolve(theme, key, hc):
    """Couleur effective d'une clé : celle du thème, sinon celle dont VS Code la dérive."""
    c = theme.get('colors', {})
    if key in c:
        return c[key]
    light = theme.get('type') == 'light'
    if key == 'notebook.cellEditorBackground':
        # Barre latérale en clair et en sombre, fond de l'éditeur en contraste élevé
        return resolve(theme, 'editor.background' if hc else 'sideBar.background', hc)
    if key == 'agentsPanel.background':
        return resolve(theme, 'editor.background' if light and not hc else 'sideBar.background', hc)
    parent = INHERITED.get(key)
    return resolve(theme, parent, hc) if parent else None


def checks(theme, hc):
    """Liste de (libellé, ratio, minimum, statut)."""
    c = theme.get('colors', {})
    g = c.get
    bg = g('editor.background')
    rows = []
    if not bg:
        return [('editor.background', None, 0, 'MANQUANT')]

    def chk(label, fg, back, minimum):
        if fg is None or back is None:
            rows.append((label, None, minimum, 'MANQUANT'))
            return
        back = back if len(back) == 7 else over(back, bg)
        fg = fg if len(fg) == 7 else over(fg, back)
        ratio = contrast(fg, back)
        rows.append((label, ratio, minimum, 'OK' if ratio >= minimum else 'ÉCHEC'))

    text = 7 if hc else 4.5
    sel = g('editor.selectionBackground')
    tbg = g('terminal.background', g('panel.background'))
    tsel = g('terminal.selectionBackground')
    wsel = g('selection.background')

    # Éditeur
    chk('Éditeur : texte / fond', g('editor.foreground'), bg, 7)
    chk('Éditeur : texte / ligne courante', g('editor.foreground'), g('editor.lineHighlightBackground', bg), 7)
    chk('Éditeur : sélection visible / fond', over(sel, bg) if sel else None, bg, 3 if hc else 1.35)
    chk('Éditeur : texte sélectionné', g('editor.selectionForeground') if hc else g('editor.foreground'), sel, 7 if hc else 4.5)
    isel = g('editor.inactiveSelectionBackground')
    chk('Éditeur : sélection inactive visible', over(isel, bg) if isel else None, bg, 1.25)
    chk('Éditeur : texte / sélection inactive', g('editor.foreground'), isel, 4.5)
    line = over(g('editor.lineHighlightBackground', bg), bg)
    chk('Éditeur : sélection ≠ ligne courante', over(sel, bg) if sel else None, line, 1.2)
    chk('Recherche : texte / résultat actif', g('editor.foreground'), g('editor.findMatchBackground'), 4.5)
    chk('Recherche : bordure résultat actif', g('editor.findMatchBorder'), bg, 3)
    chk('Recherche : texte / autres résultats', g('editor.foreground'), g('editor.findMatchHighlightBackground'), 4.5)
    chk('Occurrences : bordure', g('editor.selectionHighlightBorder') or g('editor.wordHighlightBorder'), bg, 3 if hc else 2)
    chk('Numéros de ligne', g('editorLineNumber.foreground'), bg, 4.5)
    chk('Numéro de ligne actif', g('editorLineNumber.activeForeground'), bg, text)
    chk('Curseur', g('editorCursor.foreground'), bg, 3)
    for key in ('editorError.foreground', 'editorWarning.foreground', 'editorInfo.foreground',
                'editorGutter.addedBackground', 'editorGutter.modifiedBackground', 'editorGutter.deletedBackground'):
        chk('Indicateur ' + key, g(key), bg, 3)
    for i in (1, 2, 3):
        chk(f'Paires de crochets {i}', g(f'editorBracketHighlight.foreground{i}'), bg, text)
    chk('Indicateur de focus', g('focusBorder'), bg, 3)

    # Terminal
    chk('Terminal : texte / fond', g('terminal.foreground'), tbg, 7)
    chk('Terminal : sélection visible', over(tsel, tbg) if tsel and tbg else None, tbg, 3 if hc else 1.35)
    chk('Terminal : texte sélectionné', g('terminal.selectionForeground') or g('terminal.foreground'),
        over(tsel, tbg) if tsel and tbg else None, 7 if hc else 4.5)
    tisel = g('terminal.inactiveSelectionBackground')
    chk('Terminal : sélection inactive visible', over(tisel, tbg) if tisel and tbg else None, tbg, 1.25)
    for key in sorted(k for k in c if k.startswith('terminal.ansi')):
        name = key[len('terminal.ansi'):]
        # Noir sur thème sombre et blanc sur thème clair sont prévus pour le fond opposé
        if (theme.get('type') == 'light' and not hc and name in ('White', 'BrightWhite')) or \
                (theme.get('type') != 'light' and name == 'Black'):
            continue
        chk('Terminal ANSI ' + name, g(key), tbg, 3 if name.endswith('Black') else text)

    # Console de débogage (le texte garde sa couleur sur la sélection)
    chk('Console : sélection visible', over(wsel, tbg) if wsel and tbg else None, tbg, 2 if hc else 1.35)
    for key in ('terminal.foreground', 'debugConsole.infoForeground', 'debugConsole.warningForeground',
                'debugConsole.errorForeground', 'debugConsole.sourceForeground'):
        name = key.split('.')[-1]
        chk(f'Console : {name}', g(key), tbg, text)
        chk(f'Console : {name} sélectionné', g(key), over(wsel, tbg) if wsel and tbg else None, 4.5)

    # Interface
    side = g('sideBar.background', bg)
    for fgk, bgk, minimum in [
        ('sideBar.foreground', 'sideBar.background', 7),
        ('list.activeSelectionForeground', 'list.activeSelectionBackground', text),
        ('list.inactiveSelectionForeground', 'list.inactiveSelectionBackground', text),
        ('list.hoverForeground', 'list.hoverBackground', text),
        ('list.highlightForeground', 'sideBar.background', 4.5),
        ('sideBarSectionHeader.foreground', 'sideBarSectionHeader.background', text),
        ('activityBar.foreground', 'activityBar.background', text),
        ('activityBar.inactiveForeground', 'activityBar.background', 4.5),
        ('activityBarBadge.foreground', 'activityBarBadge.background', 4.5),
        ('badge.foreground', 'badge.background', 4.5),
        ('statusBar.foreground', 'statusBar.background', text),
        ('statusBar.debuggingForeground', 'statusBar.debuggingBackground', 4.5),
        ('statusBarItem.remoteForeground', 'statusBarItem.remoteBackground', 4.5),
        ('statusBarItem.prominentForeground', 'statusBarItem.prominentBackground', 4.5),
        ('statusBarItem.prominentForeground', 'statusBarItem.prominentHoverBackground', 4.5),
        ('titleBar.activeForeground', 'titleBar.activeBackground', text),
        ('titleBar.inactiveForeground', 'titleBar.inactiveBackground', 4.5),
        ('tab.activeForeground', 'tab.activeBackground', text),
        ('tab.inactiveForeground', 'tab.inactiveBackground', 4.5),
        ('tab.unfocusedActiveForeground', 'tab.unfocusedActiveBackground', 4.5),
        ('panelTitle.activeForeground', 'panel.background', text),
        ('panelTitle.inactiveForeground', 'panel.background', 4.5),
        ('button.foreground', 'button.background', 4.5),
        ('button.foreground', 'button.hoverBackground', 4.5),
        ('button.secondaryForeground', 'button.secondaryBackground', 4.5),
        ('button.secondaryForeground', 'button.secondaryHoverBackground', 4.5),
        ('input.foreground', 'input.background', text),
        ('input.placeholderForeground', 'input.background', 4.5),
        ('dropdown.foreground', 'dropdown.background', text),
        ('editorWidget.foreground', 'editorWidget.background', text),
        ('editorSuggestWidget.foreground', 'editorSuggestWidget.background', text),
        ('editorSuggestWidget.selectedForeground', 'editorSuggestWidget.selectedBackground', text),
        ('editorSuggestWidget.highlightForeground', 'editorSuggestWidget.background', 4.5),
        ('editorHoverWidget.foreground', 'editorHoverWidget.background', text),
        ('notifications.foreground', 'notifications.background', text),
        ('quickInput.foreground', 'quickInput.background', text),
        ('quickInputList.focusForeground', 'quickInputList.focusBackground', text),
        ('menu.foreground', 'menu.background', text),
        ('menu.selectionForeground', 'menu.selectionBackground', text),
        ('peekViewResult.selectionForeground', 'peekViewResult.selectionBackground', text),
        ('peekViewTitleLabel.foreground', 'peekViewTitle.background', text),
        ('breadcrumb.foreground', 'breadcrumb.background', 4.5),
        ('textLink.foreground', 'editor.background', 4.5),
        ('textPreformat.foreground', 'textCodeBlock.background', 4.5),
        ('inputValidation.errorForeground', 'inputValidation.errorBackground', 4.5),
        ('descriptionForeground', 'sideBar.background', 4.5),
        ('gitDecoration.modifiedResourceForeground', 'sideBar.background', 4.5),
        ('gitDecoration.addedResourceForeground', 'sideBar.background', 4.5),
        ('gitDecoration.deletedResourceForeground', 'sideBar.background', 4.5),
        ('gitDecoration.untrackedResourceForeground', 'sideBar.background', 4.5),
        ('gitDecoration.conflictingResourceForeground', 'sideBar.background', 4.5),
        ('gitDecoration.ignoredResourceForeground', 'sideBar.background', 3),
        # Un fichier sélectionné garde la couleur de son état Git : elle doit rester visible sur la sélection
        ('gitDecoration.modifiedResourceForeground', 'list.activeSelectionBackground', 3),
        ('gitDecoration.addedResourceForeground', 'list.activeSelectionBackground', 3),
        ('gitDecoration.deletedResourceForeground', 'list.activeSelectionBackground', 3),
        ('gitDecoration.untrackedResourceForeground', 'list.activeSelectionBackground', 3),
        ('gitDecoration.conflictingResourceForeground', 'list.activeSelectionBackground', 3),
        ('list.errorForeground', 'sideBar.background', 4.5),
        ('list.warningForeground', 'sideBar.background', 4.5),
        ('settings.headerForeground', 'editor.background', text),
        ('keybindingLabel.foreground', 'keybindingLabel.background', text),
    ]:
        back = g(bgk)
        if back is not None and len(back) == 9:
            back = over(back, side if bgk.startswith('list') else bg)
        chk(f'{fgk} / {bgk}', g(fgk), back, minimum)

    # Bouton de l'extension dans la barre d'état : lisible et distinct du texte normal de la barre
    button = g('365DayNight.statusBarButton')
    chk('Bouton de la barre d\'état / barre', button, g('statusBar.background'), text)
    if button and g('statusBar.foreground'):
        distance = delta_e(button, g('statusBar.foreground'))
        rows.append(('Bouton de la barre d\'état ≠ texte de la barre', distance, MIN_BUTTON_DELTA_E,
                     'OK' if distance >= MIN_BUTTON_DELTA_E else 'ÉCHEC'))

    tokens = token_colors(theme)
    r = lambda key: resolve(theme, key, hc)  # noqa: E731

    # Surfaces récentes : les clés que VS Code fixe sans tenir compte du thème doivent être définies
    for key in PRIORITY_KEYS:
        if key not in c:
            rows.append(('Clé prioritaire : ' + key, None, 0, 'MANQUANT'))
    # Chat
    chk('Chat : commande / pastille', g('chat.slashCommandForeground'), g('chat.slashCommandBackground'), 4.5)
    chk('Chat : avatar', g('chat.avatarForeground'), g('chat.avatarBackground'), text)
    for key in ('chat.editedFileForeground', 'chat.linesAddedForeground', 'chat.linesRemovedForeground'):
        chk(f'Chat : {key} / barre latérale', g(key), side, 4.5)
    chk('Chat dans l\'éditeur : texte', r('inlineChat.foreground'), r('inlineChat.background'), text)
    chk('Chat dans l\'éditeur : texte indicatif', r('inlineChatInput.placeholderForeground'), r('inlineChatInput.background'), 4.5)
    # Tests : icônes de résultat dans l'explorateur, icône d'exécution dans la gouttière
    for key in ('testing.iconPassed', 'testing.iconFailed', 'testing.iconErrored', 'testing.iconQueued',
                'testing.iconSkipped', 'testing.iconUnset'):
        chk(f'Tests : {key} / barre latérale', g(key), side, 3)
    chk('Tests : testing.runAction / éditeur', g('testing.runAction'), bg, 3)
    # Notebooks : le texte et la syntaxe restent lisibles sur le fond des cellules
    cell = r('notebook.cellEditorBackground')
    chk('Notebook : texte / cellule', g('editor.foreground'), cell, 7)
    for label in DISTINCT_TOKENS:
        chk(f'Notebook : jeton {label} / cellule', tokens.get(label), cell, text)
    chk('Notebook : bordure de la cellule active', r('notebook.focusedCellBorder'), r('notebook.editorBackground'), 3)
    # Éditeur de fusion et multi-diff
    for key in ('mergeEditor.change.background', 'mergeEditor.change.word.background', 'mergeEditor.changeBase.background',
                'mergeEditor.changeBase.word.background', 'mergeEditor.conflictingLines.background'):
        chk(f'Fusion : texte / {key}', g('editor.foreground'), over(g(key), bg) if g(key) else None, text)
    chk('Fusion : conflit à traiter', g('mergeEditor.conflict.unhandledFocused.border'), bg, 3)
    chk('Fusion : conflit traité', g('mergeEditor.conflict.handledFocused.border'), bg, 3)
    chk('Multi-diff : texte / en-tête', g('foreground'), g('multiDiffEditor.headerBackground'), text)
    # Icônes de symboles : structure (barre latérale) et suggestions
    for key in sorted(k for k in c if k.startswith('symbolIcon.')):
        chk(f'Symbole : {key} / barre latérale', g(key), side, 3)
        chk(f'Symbole : {key} / suggestions', g(key), g('editorSuggestWidget.background'), 3)
    # Graphe Git
    for i in range(1, 6):
        chk(f'Graphe Git : ligne {i}', g(f'scmGraph.foreground{i}'), side, 3)
    for key in ('scmGraph.historyItemRefColor', 'scmGraph.historyItemRemoteRefColor', 'scmGraph.historyItemBaseRefColor'):
        chk(f'Graphe Git : {key}', g(key), side, 3)
    for key in ('scmGraph.historyItemHoverAdditionsForeground', 'scmGraph.historyItemHoverDeletionsForeground'):
        chk(f'Graphe Git : {key} / survol', g(key), g('editorHoverWidget.background'), 4.5)
    # Centre de commande et sessions d'agents
    chk('Centre de commande : texte', r('commandCenter.foreground'), g('titleBar.activeBackground'), text)
    chk('Centre de commande : texte (fenêtre inactive)', r('commandCenter.inactiveForeground'), g('titleBar.inactiveBackground'), 4.5)
    chk('Sessions d\'agents : texte des panneaux', r('agentsPanel.foreground'), r('agentsPanel.background'), text)
    chk('Sessions d\'agents : champ de saisie', r('agentsChatInput.foreground'), r('agentsChatInput.background'), text)
    chk('Sessions d\'agents : texte indicatif', r('agentsChatInput.placeholderForeground'), r('agentsChatInput.background'), 4.5)
    chk('Sessions d\'agents : badges', r('agentsBadge.foreground'), r('agentsBadge.background'), 4.5)

    # Jetons de syntaxe : une catégorie absente compte comme un échec, sinon elle prendrait la couleur
    # du texte et ne serait plus distinguée
    for label in TOKEN_PROBES:
        color = tokens.get(label)
        chk('Jeton : ' + label, color, bg, text)
        if sel and color:
            chk('Jeton : ' + label + ' sélectionné', g('editor.selectionForeground') if hc else color, sel, 7 if hc else 3)

    # Jetons sémantiques : mêmes minimums que les jetons de syntaxe
    semantic = semantic_colors(theme)
    for key in SEMANTIC_ROLES:
        if key not in semantic:
            rows.append(('Sémantique : ' + key, None, text, 'MANQUANT'))
    for key, color in sorted(semantic.items()):
        if color is None:
            continue
        chk('Sémantique : ' + key, color, bg, text)
        if sel:
            chk('Sémantique : ' + key + ' sélectionné', g('editor.selectionForeground') if hc else color, sel, 7 if hc else 3)

    rows += style_checks(theme)
    return rows


def distinctness(theme):
    """Paires de couleurs les plus proches pour chaque vision (normale, protan, deutan, tritan)."""
    tokens = {k: v for k, v in token_colors(theme).items() if k in DISTINCT_TOKENS}
    c = theme.get('colors', {})
    alerts = {k: c.get(v) for k, v in ALERT_KEYS.items()}
    # Résultats des tests et lignes du graphe Git : distinguées entre elles comme les alertes
    alerts.update({'test réussi': c.get('testing.iconPassed'), 'test échoué': c.get('testing.iconFailed')})
    graph = [f'graphe {i}' for i in range(1, 6)]
    alerts.update({name: c.get(f'scmGraph.foreground{i}') for i, name in enumerate(graph, 1)})
    alert_pairs = list(DISTINCT_ALERTS) + [('test réussi', 'test échoué')] + list(itertools.combinations(graph, 2))
    result = {}
    for view, matrix in VIEWS.items():
        pairs = sorted((delta_e(tokens[a], tokens[b], matrix), a, b) for a, b in itertools.combinations(tokens, 2))
        apairs = sorted((delta_e(alerts[a], alerts[b], matrix), a, b) for a, b in alert_pairs if alerts[a] and alerts[b])
        result[view] = (pairs[:3], apairs[:1])
    return result


def information(theme):
    """Mesures à titre d'information, qui ne font jamais échouer l'audit, sur les jetons principaux :
    CIEDE2000 pour chaque vision, et l'achromatopsie (seul l'écart de clarté reste)."""
    tokens = {k: v for k, v in token_colors(theme).items() if k in DISTINCT_TOKENS}
    pairs = list(itertools.combinations(tokens, 2))
    result = {}
    for view, matrix in VIEWS.items():
        result['ΔE2000 ' + view] = sorted((delta_e_2000(tokens[a], tokens[b], matrix), a, b) for a, b in pairs)
    result['achromatopsie'] = sorted((delta_e(tokens[a], tokens[b], ACHROMATOPSIA), a, b) for a, b in pairs)
    return result


def report(theme, hc, verbose=False):
    """Affiche le rapport d'un thème et renvoie le nombre de contrôles en échec."""
    rows = checks(theme, hc)
    bad = [r for r in rows if r[3] != 'OK']
    print(f"== {theme.get('name')} : {len(rows) - len(bad)}/{len(rows)} contrôles OK")
    for label, ratio, minimum, status in (rows if verbose else bad):
        value = '%.2f' % ratio if ratio else '-'
        expected = f'(attendu : {STYLE_NAMES[minimum]})' if minimum in STYLE_NAMES else f'(min {minimum})'
        print(f'   {status:8} {label:72} {value:>6} {expected}')
    for view, (pairs, apairs) in distinctness(theme).items():
        line = ', '.join(f'{a}/{b} {d:.0f}' for d, a, b in pairs + apairs)
        flag = '' if all(d >= MIN_DELTA_E for d, _, _ in pairs + apairs) else '   <-- confusion possible'
        print(f'   ΔE {view:7} : {line}{flag}')
        bad += [p for p in pairs + apairs if p[0] < MIN_DELTA_E]
    for name, pairs in information(theme).items():
        line = ', '.join(f'{a}/{b} {d:.0f}' for d, a, b in pairs[:3])
        # Le seuil de 10 est sur l'échelle CIE76 : il ne s'applique pas à CIEDE2000. En achromatopsie,
        # l'écart CIE76 entre deux gris est leur écart de clarté, sur la même échelle.
        if name == 'achromatopsie':
            below = sum(1 for d, _, _ in pairs if d < MIN_DELTA_E)
            line += f' ; {below}/{len(pairs)} paires sous {MIN_DELTA_E}'
        print(f'   info {name:18} : {line}')
    return len(bad)


def ui_themes():
    """Chemin du thème -> True si c'est un thème à contraste élevé (d'après package.json)."""
    pkg = json.load(open(os.path.join(ROOT, 'package.json'), encoding='utf-8'))
    return {os.path.normpath(os.path.join(ROOT, t['path'])): t['uiTheme'].startswith('hc')
            for t in pkg['contributes']['themes']}


def main(argv):
    verbose = '-v' in argv
    paths = [a for a in argv if not a.startswith('-')]
    hc_by_path = ui_themes()
    paths = [os.path.normpath(os.path.abspath(p)) for p in paths] or sorted(hc_by_path)
    failures = 0
    for path in paths:
        theme = load_theme(path)
        failures += report(theme, hc_by_path.get(path, False), verbose)
    print(f'\n{failures} problème(s) sur {len(paths)} thème(s)')
    return 1 if failures else 0


if __name__ == '__main__':
    sys.exit(main(sys.argv[1:]))
