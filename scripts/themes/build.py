"""Génère les 3 variantes (Light, Dark, High Contrast) d'un mois à partir de sa palette, puis les audite.

Usage :
    python3 scripts/themes/build.py 10           # aperçu de l'audit, aucun fichier modifié
    python3 scripts/themes/build.py 10 --write   # écrit themes/365-10-{light,dark,hc-dark}-theme.json
    python3 scripts/themes/build.py 10 -v        # affiche aussi les contrôles réussis

La palette est lue dans scripts/themes/palettes/<mois>.json et les règles de syntaxe,
communes à tous les mois, dans scripts/themes/token-rules.json.
"""
import json
import os
import sys

HERE = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, HERE)
from audit import ROOT, report  # noqa: E402

# Variante de palette -> suffixe du fichier de thème
VARIANTS = {'light': 'light', 'dark': 'dark', 'hc': 'hc-dark'}


def a(color, alpha):
    """Ajoute un canal alpha (hex 2 chiffres) à une couleur opaque."""
    return color[:7] + alpha


def ui(p, hc):
    """Couleurs de l'interface à partir des rôles de la palette."""
    t = p['tok']
    border = p['contrastBorder'] or p['border']
    highlight = p['accent'] if hc else t['keyword']
    c = {}
    # Général
    c.update({
        'foreground': p['fg'], 'descriptionForeground': p['fgMuted'], 'disabledForeground': p['fgFaint'],
        'errorForeground': p['error'], 'icon.foreground': p['fgMuted'], 'focusBorder': p['focus'],
        'selection.background': p['wsel'], 'widget.shadow': p['shadow'], 'sash.hoverBorder': p['focus'],
        'textLink.foreground': p['link'], 'textLink.activeForeground': p['accent'],
        'textBlockQuote.background': p['bgWidget'], 'textBlockQuote.border': p['borderStrong'],
        'textCodeBlock.background': p['bgWidget'], 'textPreformat.foreground': t['code'],
        'textSeparator.foreground': p['border'],
        'window.activeBorder': p['accent'], 'window.inactiveBorder': p['border'],
    })
    if hc:
        c['contrastBorder'] = p['contrastBorder']
        c['contrastActiveBorder'] = p['contrastActiveBorder']
    # Barre d'activité
    c.update({
        'activityBar.background': p['bgDeep'], 'activityBar.foreground': p['fg'], 'activityBar.inactiveForeground': p['fgFaint'],
        'activityBar.activeBorder': p['accent'], 'activityBar.activeBackground': p['bgHover'], 'activityBar.border': border,
        'activityBar.dropBorder': p['accent'], 'activityBarBadge.background': p['accent'], 'activityBarBadge.foreground': p['accentFg'],
        'badge.background': p['accent'], 'badge.foreground': p['accentFg'],
    })
    # Barre latérale
    c.update({
        'sideBar.background': p['bgAlt'], 'sideBar.foreground': p['fg'], 'sideBar.border': border,
        'sideBar.dropBackground': a(p['accent'], '33'), 'sideBarTitle.foreground': p['fg'],
        'sideBarSectionHeader.background': p['bgDeep'], 'sideBarSectionHeader.foreground': p['fg'], 'sideBarSectionHeader.border': border,
    })
    # Listes et arbres
    c.update({
        'list.activeSelectionBackground': p['listSel'], 'list.activeSelectionForeground': p['listSelFg'],
        'list.inactiveSelectionBackground': p['listInactive'], 'list.inactiveSelectionForeground': p['fg'],
        'list.focusBackground': p['listSel'], 'list.focusForeground': p['listSelFg'], 'list.focusOutline': p['focus'],
        'list.inactiveFocusBackground': p['listInactive'], 'list.inactiveFocusOutline': p['border'],
        'list.hoverBackground': p['listHover'], 'list.hoverForeground': p['fg'],
        'list.highlightForeground': highlight, 'list.focusHighlightForeground': highlight,
        'list.dropBackground': a(p['accent'], '33'), 'list.invalidItemForeground': p['error'],
        'list.errorForeground': p['error'], 'list.warningForeground': p['warning'], 'list.deemphasizedForeground': p['fgFaint'],
        'listFilterWidget.background': p['bgWidget'], 'listFilterWidget.outline': p['focus'], 'listFilterWidget.noMatchesOutline': p['error'],
        'tree.indentGuidesStroke': p['borderStrong'] if hc else p['border'],
    })
    # Éditeur
    c.update({
        'editor.background': p['bg'], 'editor.foreground': p['fg'],
        'editor.lineHighlightBackground': p['bgLine'], 'editor.lineHighlightBorder': p['lineBorder'],
        'editor.selectionBackground': p['sel'], 'editor.inactiveSelectionBackground': p['selInactive'],
        'editor.selectionHighlightBackground': a(p['sel'], '22' if hc else '55'),
        'editor.selectionHighlightBorder': p['sel'] if hc else p['info'],
        'editor.wordHighlightBackground': p['wordHl'], 'editor.wordHighlightBorder': p['wordHlBorder'],
        'editor.wordHighlightStrongBackground': p['wordHlStrong'], 'editor.wordHighlightStrongBorder': p['wordHlStrongBorder'],
        'editor.wordHighlightTextBackground': p['wordHl'], 'editor.wordHighlightTextBorder': p['wordHlBorder'],
        'editor.findMatchBackground': p['find'], 'editor.findMatchBorder': p['findBorder'],
        'editor.findMatchHighlightBackground': p['findHl'], 'editor.findMatchHighlightBorder': p['findHlBorder'],
        'editor.findRangeHighlightBackground': a(p['sel'], '33'), 'editor.findRangeHighlightBorder': p['border'],
        'editor.hoverHighlightBackground': a(p['sel'], '44'), 'editor.rangeHighlightBackground': a(p['accent'], '1A'),
        'editor.rangeHighlightBorder': p['border'] if hc else '#00000000', 'editor.linkedEditingBackground': a(p['accent'], '22'),
        'editor.snippetTabstopHighlightBackground': a(p['sel'], '44'), 'editor.snippetTabstopHighlightBorder': p['info'],
        'editor.snippetFinalTabstopHighlightBackground': '#00000000', 'editor.snippetFinalTabstopHighlightBorder': p['accent'],
        'editorCursor.foreground': p['accent'], 'editorCursor.background': p['bg'],
        'editorLineNumber.foreground': p['fgFaint'], 'editorLineNumber.activeForeground': p['fg'],
        'editorIndentGuide.background1': p['border'], 'editorIndentGuide.activeBackground1': p['borderStrong'],
        'editorRuler.foreground': p['border'], 'editorWhitespace.foreground': p['border'],
        'editorCodeLens.foreground': p['fgFaint'], 'editorLink.activeForeground': p['link'],
        'editorBracketMatch.background': a(p['sel'], '44'), 'editorBracketMatch.border': p['accent'],
        'editorBracketHighlight.foreground1': t['keyword'], 'editorBracketHighlight.foreground2': t['function'],
        'editorBracketHighlight.foreground3': t['klass'], 'editorBracketHighlight.foreground4': t['keyword'],
        'editorBracketHighlight.foreground5': t['function'], 'editorBracketHighlight.foreground6': t['klass'],
        'editorBracketHighlight.unexpectedBracket.foreground': p['error'],
        'editorInlayHint.foreground': p['fgMuted'], 'editorInlayHint.background': a(p['border'], '66'),
        'editorGhostText.foreground': p['fgFaint'], 'editorStickyScroll.background': p['bg'],
        'editorStickyScrollHover.background': p['bgHover'],
        'editorError.foreground': p['error'], 'editorError.border': '#00000000',
        'editorWarning.foreground': p['warning'], 'editorWarning.border': '#00000000',
        'editorInfo.foreground': p['info'], 'editorInfo.border': '#00000000',
        'editorHint.foreground': p['fgMuted'],
        'editorLightBulb.foreground': p['warning'], 'editorLightBulbAutoFix.foreground': p['info'],
        'editorUnnecessaryCode.opacity': '#000000AA',
    })
    if hc:
        # En contraste élevé, le texte sélectionné passe en noir sur fond clair
        c['editor.selectionForeground'] = p['selFg']
        # Bordures en plus des soulignements : l'information ne repose pas que sur la couleur
        c['editorError.border'] = p['error']
        c['editorWarning.border'] = p['warning']
        c['editorInfo.border'] = p['info']
    # Gouttière, règle de survol, minimap
    c.update({
        'editorGutter.background': p['bg'], 'editorGutter.addedBackground': p['added'], 'editorGutter.modifiedBackground': p['modified'],
        'editorGutter.deletedBackground': p['deleted'], 'editorGutter.foldingControlForeground': p['fgMuted'],
        'editorGutter.commentRangeForeground': p['fgFaint'],
        'editorOverviewRuler.border': p['border'], 'editorOverviewRuler.findMatchForeground': p['accent'],
        'editorOverviewRuler.selectionHighlightForeground': p['info'], 'editorOverviewRuler.wordHighlightForeground': p['fgFaint'],
        'editorOverviewRuler.wordHighlightStrongForeground': p['fgMuted'], 'editorOverviewRuler.modifiedForeground': p['modified'],
        'editorOverviewRuler.addedForeground': p['added'], 'editorOverviewRuler.deletedForeground': p['deleted'],
        'editorOverviewRuler.errorForeground': p['error'], 'editorOverviewRuler.warningForeground': p['warning'],
        'editorOverviewRuler.infoForeground': p['info'], 'editorOverviewRuler.bracketMatchForeground': p['accent'],
        'editorOverviewRuler.rangeHighlightForeground': p['fgFaint'],
        'editorOverviewRuler.currentContentForeground': p['added'], 'editorOverviewRuler.incomingContentForeground': p['info'],
        'editorOverviewRuler.commonContentForeground': p['fgFaint'],
        'minimap.background': p['bg'], 'minimap.findMatchHighlight': p['accent'], 'minimap.selectionHighlight': p['info'],
        'minimap.errorHighlight': p['error'], 'minimap.warningHighlight': p['warning'],
        'minimapGutter.addedBackground': p['added'], 'minimapGutter.modifiedBackground': p['modified'], 'minimapGutter.deletedBackground': p['deleted'],
    })
    # Widgets (suggestion, survol, navigation entre problèmes)
    c.update({
        'editorWidget.background': p['bgWidget'], 'editorWidget.foreground': p['fg'], 'editorWidget.border': border,
        'editorWidget.resizeBorder': p['focus'],
        'editorSuggestWidget.background': p['bgWidget'], 'editorSuggestWidget.border': border,
        'editorSuggestWidget.foreground': p['fg'], 'editorSuggestWidget.selectedBackground': p['listSel'],
        'editorSuggestWidget.selectedForeground': p['listSelFg'], 'editorSuggestWidget.highlightForeground': highlight,
        'editorSuggestWidget.focusHighlightForeground': highlight,
        'editorHoverWidget.background': p['bgWidget'], 'editorHoverWidget.foreground': p['fg'], 'editorHoverWidget.border': border,
        'editorHoverWidget.statusBarBackground': p['bgAlt'],
        'editorMarkerNavigation.background': p['bgWidget'], 'editorMarkerNavigationError.background': p['error'],
        'editorMarkerNavigationWarning.background': p['warning'], 'editorMarkerNavigationInfo.background': p['info'],
        'debugExceptionWidget.background': p['bgWidget'], 'debugExceptionWidget.border': p['error'],
    })
    # Groupes d'éditeurs et onglets
    c.update({
        'editorGroup.border': border, 'editorGroup.dropBackground': a(p['accent'], '22'),
        'editorGroup.emptyBackground': p['bg'], 'editorGroupHeader.tabsBackground': p['bgDeep'],
        'editorGroupHeader.tabsBorder': border, 'editorGroupHeader.noTabsBackground': p['bg'],
        'editorGroupHeader.border': border,
        'tab.activeBackground': p['bg'], 'tab.activeForeground': p['fg'], 'tab.activeBorderTop': p['accent'], 'tab.activeBorder': p['bg'],
        'tab.inactiveBackground': p['bgDeep'], 'tab.inactiveForeground': p['fgMuted'], 'tab.border': border,
        'tab.hoverBackground': p['bgHover'], 'tab.hoverForeground': p['fg'], 'tab.hoverBorder': p['accent'],
        'tab.unfocusedActiveBackground': p['bg'], 'tab.unfocusedActiveForeground': p['fgMuted'], 'tab.unfocusedActiveBorderTop': p['borderStrong'],
        'tab.unfocusedActiveBorder': p['bg'], 'tab.unfocusedInactiveBackground': p['bgDeep'], 'tab.unfocusedInactiveForeground': p['fgFaint'],
        'tab.unfocusedHoverBackground': p['bgHover'], 'tab.unfocusedHoverForeground': p['fg'], 'tab.unfocusedHoverBorder': p['border'],
        'tab.lastPinnedBorder': p['borderStrong'], 'tab.activeModifiedBorder': p['accent'], 'tab.inactiveModifiedBorder': p['fgFaint'],
        'breadcrumb.background': p['bg'], 'breadcrumb.foreground': p['fgMuted'], 'breadcrumb.focusForeground': p['fg'],
        'breadcrumb.activeSelectionForeground': p['fg'], 'breadcrumbPicker.background': p['bgWidget'],
    })
    # Panneau, terminal et console de débogage
    c.update({
        'panel.background': p['bg'], 'panel.border': border, 'panel.dropBorder': p['accent'],
        'panelTitle.activeBorder': p['accent'], 'panelTitle.activeForeground': p['fg'], 'panelTitle.inactiveForeground': p['fgMuted'],
        'panelInput.border': p['borderStrong'], 'panelSection.border': p['border'], 'panelSection.dropBackground': a(p['accent'], '22'),
        'panelSectionHeader.background': p['bgAlt'], 'panelSectionHeader.foreground': p['fg'], 'panelSectionHeader.border': p['border'],
        'terminal.background': p['bg'], 'terminal.foreground': p['fg'], 'terminal.border': border,
        'terminal.selectionBackground': p['sel'], 'terminal.inactiveSelectionBackground': p['selInactive'],
        'terminal.findMatchBackground': p['find'], 'terminal.findMatchBorder': p['findBorder'],
        'terminal.findMatchHighlightBackground': p['findHl'], 'terminal.findMatchHighlightBorder': p['findHlBorder'],
        'terminal.hoverHighlightBackground': a(p['sel'], '44'),
        'terminalCursor.foreground': p['accent'], 'terminalCursor.background': p['bg'],
        'terminalCommandDecoration.defaultBackground': p['fgFaint'], 'terminalCommandDecoration.successBackground': p['added'],
        'terminalCommandDecoration.errorBackground': p['error'], 'terminalOverviewRuler.cursorForeground': p['accent'],
        'terminal.dropBackground': a(p['accent'], '22'),
        'debugConsole.infoForeground': p['debugInfo'], 'debugConsole.warningForeground': p['debugWarning'],
        'debugConsole.errorForeground': p['debugError'], 'debugConsole.sourceForeground': p['fgMuted'],
        'debugConsoleInputIcon.foreground': p['accent'],
        'debugToolBar.background': p['bgWidget'], 'debugToolBar.border': p['border'],
        'debugIcon.breakpointForeground': p['error'], 'debugIcon.breakpointDisabledForeground': p['fgFaint'],
        'debugIcon.breakpointCurrentStackframeForeground': p['warning'], 'debugIcon.startForeground': p['added'],
        'editor.stackFrameHighlightBackground': a(p['warning'], '33'), 'editor.focusedStackFrameHighlightBackground': a(p['added'], '33'),
    })
    if hc:
        # Texte sélectionné du terminal forcé en noir sur la sélection claire
        c['terminal.selectionForeground'] = p['selFg']
    for name, color in p['ansi'].items():
        c['terminal.ansi' + name] = color
    # Barre d'état, barre de titre et menus
    c.update({
        'statusBar.background': p['statusBg'], 'statusBar.foreground': p['statusFg'], 'statusBar.border': p['contrastBorder'] or p['statusBg'],
        'statusBar.noFolderBackground': p['statusBg'], 'statusBar.noFolderForeground': p['statusFg'],
        'statusBar.debuggingBackground': p['statusDebugBg'], 'statusBar.debuggingForeground': '#FFFFFF',
        'statusBar.debuggingBorder': p['contrastBorder'] or p['statusDebugBg'], 'statusBar.focusBorder': p['statusFg'],
        'statusBarItem.hoverBackground': '#FFFFFF26', 'statusBarItem.activeBackground': '#FFFFFF40',
        'statusBarItem.remoteBackground': p['statusRemoteBg'], 'statusBarItem.remoteForeground': '#FFFFFF',
        'statusBarItem.prominentBackground': p['statusRemoteBg'], 'statusBarItem.prominentForeground': '#FFFFFF',
        'statusBarItem.prominentHoverBackground': p['statusProminentHoverBg'],
        'statusBarItem.errorBackground': p['statusDebugBg'], 'statusBarItem.errorForeground': '#FFFFFF',
        'statusBarItem.focusBorder': p['statusFg'],
        'titleBar.activeBackground': p['bgDeep'], 'titleBar.activeForeground': p['fg'], 'titleBar.border': border,
        'titleBar.inactiveBackground': p['bgDeep'], 'titleBar.inactiveForeground': p['fgMuted'],
        'menubar.selectionBackground': p['bgHover'], 'menubar.selectionForeground': p['fg'],
        'menu.background': p['bgWidget'], 'menu.foreground': p['fg'], 'menu.border': border,
        'menu.selectionBackground': p['listSel'], 'menu.selectionForeground': p['listSelFg'], 'menu.separatorBackground': p['border'],
    })
    # Boutons, champs, cases à cocher, barres de défilement
    c.update({
        'button.background': p['accent'], 'button.foreground': p['accentFg'], 'button.hoverBackground': p['accentHover'],
        'button.border': p['contrastBorder'] or '#00000000', 'button.separator': a(p['accentFg'], '66'),
        'button.secondaryBackground': p['bgHover'], 'button.secondaryForeground': p['fg'], 'button.secondaryHoverBackground': p['secondaryHoverBg'],
        'extensionButton.prominentBackground': p['accent'], 'extensionButton.prominentForeground': p['accentFg'],
        'extensionButton.prominentHoverBackground': p['accentHover'],
        'extensionBadge.remoteBackground': p['accent'], 'extensionBadge.remoteForeground': p['accentFg'],
        'input.background': p['bgInput'], 'input.foreground': p['fg'], 'input.border': p['borderStrong'],
        'input.placeholderForeground': p['fgFaint'],
        'inputOption.activeBackground': a(p['accent'], '33'), 'inputOption.activeBorder': p['accent'], 'inputOption.activeForeground': p['fg'],
        'inputValidation.errorBackground': p['bgWidget'], 'inputValidation.errorForeground': p['fg'], 'inputValidation.errorBorder': p['error'],
        'inputValidation.warningBackground': p['bgWidget'], 'inputValidation.warningForeground': p['fg'], 'inputValidation.warningBorder': p['warning'],
        'inputValidation.infoBackground': p['bgWidget'], 'inputValidation.infoForeground': p['fg'], 'inputValidation.infoBorder': p['info'],
        'dropdown.background': p['bgInput'], 'dropdown.listBackground': p['bgWidget'], 'dropdown.foreground': p['fg'], 'dropdown.border': p['borderStrong'],
        'checkbox.background': p['bgInput'], 'checkbox.foreground': p['fg'], 'checkbox.border': p['borderStrong'],
        'checkbox.selectBackground': p['bgWidget'], 'checkbox.selectBorder': p['accent'],
        'keybindingLabel.background': p['bgWidget'], 'keybindingLabel.foreground': p['fg'],
        'keybindingLabel.border': p['border'], 'keybindingLabel.bottomBorder': p['borderStrong'],
        'progressBar.background': p['accent'],
        'scrollbar.shadow': '#00000000' if hc else p['shadow'],
        'scrollbarSlider.background': a(p['borderStrong'], '55'), 'scrollbarSlider.hoverBackground': a(p['borderStrong'], '88'),
        'scrollbarSlider.activeBackground': a(p['borderStrong'], 'BB'),
    })
    # Palette de commandes, notifications, vue peek
    c.update({
        'quickInput.background': p['bgWidget'], 'quickInput.foreground': p['fg'], 'quickInputTitle.background': p['bgAlt'],
        'quickInputList.focusBackground': p['listSel'], 'quickInputList.focusForeground': p['listSelFg'],
        'quickInputList.focusIconForeground': p['listSelFg'],
        'pickerGroup.border': p['border'], 'pickerGroup.foreground': highlight,
        'notifications.background': p['bgWidget'], 'notifications.foreground': p['fg'], 'notifications.border': border,
        'notificationCenterHeader.background': p['bgAlt'], 'notificationCenterHeader.foreground': p['fg'],
        'notificationCenter.border': border, 'notificationToast.border': border,
        'notificationLink.foreground': p['link'], 'notificationsErrorIcon.foreground': p['error'],
        'notificationsWarningIcon.foreground': p['warning'], 'notificationsInfoIcon.foreground': p['info'],
        'peekView.border': p['accent'], 'peekViewEditor.background': p['bg'], 'peekViewEditorGutter.background': p['bg'],
        'peekViewEditor.matchHighlightBackground': p['findHl'], 'peekViewEditor.matchHighlightBorder': p['findHlBorder'],
        'peekViewResult.background': p['bgAlt'], 'peekViewResult.fileForeground': p['fg'], 'peekViewResult.lineForeground': p['fgMuted'],
        'peekViewResult.matchHighlightBackground': p['findHl'], 'peekViewResult.selectionBackground': p['listSel'],
        'peekViewResult.selectionForeground': p['listSelFg'], 'peekViewTitle.background': p['bgDeep'],
        'peekViewTitleLabel.foreground': p['fg'], 'peekViewTitleDescription.foreground': p['fgMuted'],
    })
    # Git, diff, fusion
    c.update({
        'gitDecoration.addedResourceForeground': p['added'], 'gitDecoration.modifiedResourceForeground': p['modified'],
        'gitDecoration.deletedResourceForeground': p['deleted'], 'gitDecoration.untrackedResourceForeground': p['added'],
        'gitDecoration.ignoredResourceForeground': p['fgFaint'], 'gitDecoration.conflictingResourceForeground': p['warning'],
        'gitDecoration.submoduleResourceForeground': t['klass'], 'gitDecoration.renamedResourceForeground': p['modified'],
        'gitDecoration.stageModifiedResourceForeground': p['modified'], 'gitDecoration.stageDeletedResourceForeground': p['deleted'],
        'diffEditor.insertedTextBackground': a(p['added'], '33'), 'diffEditor.removedTextBackground': a(p['deleted'], '33'),
        'diffEditor.insertedLineBackground': a(p['added'], '1A'), 'diffEditor.removedLineBackground': a(p['deleted'], '1A'),
        'diffEditor.border': p['border'], 'diffEditor.diagonalFill': a(p['border'], '88'),
        'merge.currentHeaderBackground': a(p['added'], '66'), 'merge.currentContentBackground': a(p['added'], '22'),
        'merge.incomingHeaderBackground': a(p['info'], '66'), 'merge.incomingContentBackground': a(p['info'], '22'),
        'merge.commonHeaderBackground': a(p['fgFaint'], '66'), 'merge.commonContentBackground': a(p['fgFaint'], '22'),
        'merge.border': p['border'],
    })
    if hc:
        c['diffEditor.insertedTextBorder'] = p['added']
        c['diffEditor.removedTextBorder'] = p['deleted']
    # Paramètres et pages d'accueil
    hover = p['listHover']
    c.update({
        'settings.headerForeground': p['fg'], 'settings.modifiedItemIndicator': p['accent'],
        'settings.dropdownBackground': p['bgInput'], 'settings.dropdownForeground': p['fg'], 'settings.dropdownBorder': p['borderStrong'],
        'settings.checkboxBackground': p['bgInput'], 'settings.checkboxForeground': p['fg'], 'settings.checkboxBorder': p['borderStrong'],
        'settings.textInputBackground': p['bgInput'], 'settings.textInputForeground': p['fg'], 'settings.textInputBorder': p['borderStrong'],
        'settings.numberInputBackground': p['bgInput'], 'settings.numberInputForeground': p['fg'], 'settings.numberInputBorder': p['borderStrong'],
        'settings.focusedRowBackground': a(hover, '99') if len(hover) == 7 else hover,
        'settings.rowHoverBackground': a(hover, '66') if len(hover) == 7 else hover,
        'walkThrough.embeddedEditorBackground': p['bgAlt'],
        'welcomePage.tileBackground': p['bgWidget'], 'welcomePage.tileHoverBackground': p['bgHover'],
    })
    return dict(sorted(c.items()))


def tokens(p, rules):
    """Règles TextMate : chaque règle prend la couleur de son rôle dans la palette."""
    out = []
    for rule in rules:
        settings = {}
        if 'role' in rule:
            settings['foreground'] = p['tok'][rule['role']]
        if 'fontStyle' in rule:
            settings['fontStyle'] = rule['fontStyle']
        out.append({'name': rule['name'], 'scope': rule['scope'], 'settings': settings})
    return out


def semantic(p):
    """Jetons sémantiques (TypeScript, Python, etc.) alignés sur les mêmes rôles."""
    t = p['tok']
    return {
        'variable.readonly': t['number'], 'parameter': {'foreground': t['variable'], 'fontStyle': 'italic'},
        'function': t['function'], 'method': t['function'], 'class': t['klass'], 'enum': t['klass'],
        'interface': {'foreground': t['klass'], 'fontStyle': 'italic'},
        'namespace': t['namespace'], 'typeParameter': {'foreground': t['klass'], 'fontStyle': 'italic'}, 'enumMember': t['number'],
        'property': t['property'], 'variable.defaultLibrary': t['support'], 'keyword': t['keyword'],
        '*.deprecated': {'strikethrough': True}, 'comment.documentation': {'foreground': t['comment'], 'fontStyle': 'italic'},
    }


def build(month, write=False, verbose=False):
    mm = '%02d' % int(month)
    palettes = json.load(open(os.path.join(HERE, 'palettes', f'{mm}.json'), encoding='utf-8'))
    rules = json.load(open(os.path.join(HERE, 'token-rules.json'), encoding='utf-8'))
    pkg = json.load(open(os.path.join(ROOT, 'package.json'), encoding='utf-8'))
    labels = {t['path']: t['label'] for t in pkg['contributes']['themes']}
    failures = 0
    for variant, suffix in VARIANTS.items():
        p, hc = palettes[variant], variant == 'hc'
        rel = f'./themes/365-{mm}-{suffix}-theme.json'
        theme = {
            'name': labels[rel], 'type': p['type'], 'semanticHighlighting': True,
            'colors': ui(p, hc), 'tokenColors': tokens(p, rules), 'semanticTokenColors': semantic(p),
            '_accessibilityNote': p['note'],
        }
        failures += report(theme, hc, verbose)
        if write:
            with open(os.path.join(ROOT, rel), 'w', encoding='utf-8') as f:
                json.dump(theme, f, indent=2, ensure_ascii=False)
                f.write('\n')
            print(f'   écrit : {rel}')
    return failures


if __name__ == '__main__':
    args = [x for x in sys.argv[1:] if not x.startswith('-')]
    if len(args) != 1:
        sys.exit(__doc__)
    failures = build(args[0], write='--write' in sys.argv, verbose='-v' in sys.argv)
    print(f'\n{failures} problème(s)')
    sys.exit(1 if failures else 0)
