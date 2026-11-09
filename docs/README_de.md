# 365 Day & Night – Monthly Accessible Themes

**Gib VS Code jeden Monat einen neuen Look: 48 barrierefreie Themes, die per Klick oder von selbst zwischen Tag und Nacht wechseln.**

[![Version im Marketplace](https://vsmarketplacebadges.dev/version-short/mickaellherminez.365-daynight-vscode-theme-ext.svg?subject=Marketplace&style=flat)](https://marketplace.visualstudio.com/items?itemName=mickaellherminez.365-daynight-vscode-theme-ext)
[![Installationen](https://vsmarketplacebadges.dev/installs-short/mickaellherminez.365-daynight-vscode-theme-ext.svg?style=flat)](https://marketplace.visualstudio.com/items?itemName=mickaellherminez.365-daynight-vscode-theme-ext)
[![Downloads](https://vsmarketplacebadges.dev/downloads-short/mickaellherminez.365-daynight-vscode-theme-ext.svg?style=flat)](https://marketplace.visualstudio.com/items?itemName=mickaellherminez.365-daynight-vscode-theme-ext)
[![Bewertung](https://vsmarketplacebadges.dev/rating-short/mickaellherminez.365-daynight-vscode-theme-ext.svg?style=flat)](https://marketplace.visualstudio.com/items?itemName=mickaellherminez.365-daynight-vscode-theme-ext&ssr=false#review-details)
[![Downloads auf Open VSX](https://img.shields.io/open-vsx/dt/mickaellherminez/365-daynight-vscode-theme-ext?label=Open%20VSX%20downloads)](https://open-vsx.org/extension/mickaellherminez/365-daynight-vscode-theme-ext)
[![CI-Status](https://img.shields.io/github/actions/workflow/status/mickaellherminez/365-daynight-vscode-theme-ext/ci.yml?branch=main&label=CI)](https://github.com/mickaellherminez/365-daynight-vscode-theme-ext/actions/workflows/ci.yml)
[![Lizenz MIT](https://img.shields.io/github/license/mickaellherminez/365-daynight-vscode-theme-ext)](../LICENSE)

```sh
code --install-extension mickaellherminez.365-daynight-vscode-theme-ext
```

Oder installiere es aus dem [Marketplace](https://marketplace.visualstudio.com/items?itemName=mickaellherminez.365-daynight-vscode-theme-ext) oder von [Open VSX](https://open-vsx.org/extension/mickaellherminez/365-daynight-vscode-theme-ext). Erfordert VS Code 1.96 oder neuer.

*Diese Seite lesen auf: [English](../README.md) · [Français](README_fr.md) · [Español](README_es.md) · [Português](README_pt.md) · [Русский](README_ru.md) · [中文](README_zh.md) · [日本語](README_ja.md) · [हिंदी](README_hi.md) · [العربية](README_ar.md)*

![Demo in VS Code: Die Pfeile der Statusleisten-Schaltfläche ändern den Monat von Oktober zu Dezember, ein Klick auf die Schaltfläche wechselt von Light zu Dark, und ein Link in ihrem Tooltip wendet High Contrast an](https://raw.githubusercontent.com/mickaellherminez/365-daynight-vscode-theme-ext/main/assets/screenshots/demo-months.gif)

## Warum diese Erweiterung

### 🗓️ Jeden Monat ein neuer Look

Raureif im Januar, junge Triebe im März, eine Lagune im Juli, Herbstlaub im Oktober, eine Polarnacht im Dezember. Das ganze Fenster folgt der Jahreszeit: Editor, Seitenleiste, Tabs, Terminal, Statusleiste, Chat, Git-Graph und Merge-Editor.

**Der Beweis:** 12 Monate mit je 4 Themes, Light, Dark, High Contrast und High Contrast Light, und mehr als 480 Farben in jedem Theme. [Alle ansehen](#die-12-monate).

### 👁️ Gemacht, um lesbar zu bleiben

Text erreicht einen Kontrast von mindestens 4,5:1 (WCAG AA) in den Light- und Dark-Themes und 7:1 (WCAG AAA) in den High-Contrast-Themes. Syntaxfarben, Fehler und Git-Änderungen bleiben bei Farbenblindheit unterscheidbar, und Kommentare, veralteter und ungültiger Code unterscheiden sich auch durch Kursivschrift, Durchstreichung oder Unterstreichung.

**Der Beweis:** Jedes Theme muss vor jeder Veröffentlichung ein automatisches Audit mit mehr als 250 Prüfungen bestehen, und [der vollständige Bericht](AUDIT.md) nennt die Ergebnisse jedes Themes und die Grenzen des Audits. Farbenblindheit wird per Simulation geprüft, daher sind Rückmeldungen von echten Menschen sehr willkommen: [Mach beim Testaufruf mit](https://github.com/mickaellherminez/365-daynight-vscode-theme-ext/issues/47).

### 🌗 Tag und Nacht, ganz ohne Nachdenken

Klicke auf die Schaltfläche in der Statusleiste, um zwischen Light und Dark zu wechseln. Oder lass die Erweiterung der Uhr folgen, zu Zeiten deiner Wahl, oder dem Erscheinungsbild deines Systems.

**Der Beweis:** Der automatische Modus ist standardmäßig aus, dein Theme ändert sich also nur, wenn du es möchtest. Dein gewählter Monat und deine manuellen Entscheidungen bleiben erhalten.

## Die 12 Monate

![Vorschau der 48 Themes: eine helle, dunkle, kontrastreiche und hell kontrastreiche Version für jeden Monat von Januar bis Dezember](https://raw.githubusercontent.com/mickaellherminez/365-daynight-vscode-theme-ext/main/assets/screenshots/year.png)

| Monat | Stimmung | Monat | Stimmung |
| --- | --- | --- | --- |
| Januar | Raureif | Juli | Lagune |
| Februar | Lavendelnebel | August | Warmer Sand |
| März | Junge Triebe | September | Weinlese |
| April | Aprilschauer | Oktober | Herbstlaub |
| Mai | Blumenwiese | November | Nebel und Unterholz |
| Juni | Lange Tage | Dezember | Polarnacht |

Der [vollständige Leitfaden](GUIDE_de.md#die-12-monate) nennt die Farben jedes Themes.

## So verwendest du es

Auf dem Mac verwendest du `Cmd` statt `Ctrl`.

| Um … | So geht's |
| --- | --- |
| **ein Theme zu wählen** | Drücke `Ctrl+K`, dann `Ctrl+T`, und tippe **365** |
| **zwischen Light und Dark zu wechseln** | Klicke unten rechts in der Statusleiste auf `LGT` oder `DRK` |
| **den Monat zu ändern** | Klicke auf die Pfeile daneben: `‹ 10 DRK ›` |
| **zum aktuellen Monat zurückzukehren** | Führe `365: Back to the current month` in der Befehlspalette aus (`Ctrl+Shift+P`) |
| **hohen Kontrast zu verwenden** | Führe `365: Apply High Contrast theme` oder `365: Apply High Contrast Light theme` aus |
| **hohen Kontrast zu verlassen** | Führe `365: Apply Light theme` oder `365: Apply Dark theme` aus |
| **den automatischen Modus einzuschalten** | Öffne die Einstellungen (`Ctrl+,`), suche nach **365DayNight** und aktiviere **Enable** |
| **eine Tastenkombination hinzuzufügen** | Drücke `Ctrl+K`, dann `Ctrl+S`, tippe **365**, doppelklicke auf einen Befehl und drücke deine Tasten. Standardmäßig ist keine festgelegt |

### Automatischer Modus

Wenn du zum ersten Mal ein 365-Theme verwendest, fragt die Erweiterung einmal, ob du den automatischen Wechsel möchtest. Ohne deine Wahl ändert sich nichts.

![Demo in VS Code: Nach der Wahl von November Light in der Themenauswahl bietet eine Benachrichtigung an, der Uhr oder dem System zu folgen oder nichts zu tun, und ein Klick auf Follow the clock bestätigt den automatischen Wechsel](https://raw.githubusercontent.com/mickaellherminez/365-daynight-vscode-theme-ext/main/assets/screenshots/demo-first-use.gif)

Danach kannst du deine Uhrzeiten wählen. Eine neue Uhrzeit gilt etwa 2 Sekunden, nachdem du aufgehört hast zu tippen.

![Demo in VS Code: In den Einstellungen wird 365 Day Night: Enable aktiviert, dann wendet eine vergangene Uhrzeit in Night Start Dark an, und 19:00 wendet wieder Light an](https://raw.githubusercontent.com/mickaellherminez/365-daynight-vscode-theme-ext/main/assets/screenshots/demo-auto.gif)

**➡️ Der [vollständige Leitfaden](GUIDE_de.md) beschreibt alles:** [den automatischen Modus und seine Uhrzeiten](GUIDE_de.md#automatischer-tag-nachtwechsel), [das Folgen deines Systems](GUIDE_de.md#deinem-system-folgen), [alle Befehle](GUIDE_de.md#befehle) und [alle Einstellungen](GUIDE_de.md#einstellungen).

## Barrierefreiheit

- **Lesbarer Text:** WCAG AA in den Light- und Dark-Themes, AAA in den High-Contrast-Themes.
- **Farbenblindheit:** Syntaxfarben und Warnungen werden für Protanopie, Deuteranopie und Tritanopie simuliert.
- **Nicht nur Farbe:** Kommentare, Parameter und Attribute sind *kursiv*, veralteter Code ist ~~durchgestrichen~~, ungültiger Code ist unterstrichen.
- **Tastatur und Screenreader:** High-Contrast-Themes haben einen deutlichen Fokusrahmen, und jeder Teil der Statusleisten-Schaltfläche hat eine eigene gesprochene Bezeichnung.

Etwas ist schwer zu lesen? [Sag uns Bescheid](https://github.com/mickaellherminez/365-daynight-vscode-theme-ext/issues/new/choose). [Mehr Details](GUIDE_de.md#barrierefreiheit-zuerst) und [der vollständige Audit-Bericht](AUDIT.md).

## Neuer Look in 0.13

In Version 0.13.0 wurde jedes Theme neu gestaltet, und dein gewähltes Theme, deine Einstellungen und Tastenkombinationen bleiben erhalten. Lieber der vorherige Look? [So kommst du zurück](GUIDE_de.md#neuer-look-und-der-weg-zurück).

## Häufige Fragen

**Wie wechselt VS Code automatisch zwischen hellem und dunklem Theme?**
Installiere die Erweiterung und setze `"365DayNight.enable": true`. Das helle Theme gilt von 7:00 bis 19:00 Uhr, das dunkle nachts. Du kannst diese Uhrzeiten mit `365DayNight.dayStart` und `365DayNight.nightStart` ändern.

**Kann VS Code mit diesen Themes dem hellen oder dunklen Modus meines Systems folgen?**
Ja. Setze `"365DayNight.enable": true` und `"365DayNight.mode": "system"`. Dein System entscheidet zwischen hell und dunkel, und die Erweiterung hält die Themes auf dem aktuellen Monat.

**Gibt es ein farbenblind-freundliches VS-Code-Theme?**
Ja. Alle Themes werden mit Simulationen von Protanopie, Deuteranopie und Tritanopie getestet, und Kommentare, veralteter und ungültiger Code unterscheiden sich auch durch Kursivschrift, Durchstreichung oder Unterstreichung.

**Ändert die Erweiterung mein Theme ungefragt?**
Nein. Der Automatikmodus ist standardmäßig aus. Ohne ihn ändert sich das Theme nur, wenn du eines auswählst oder auf die Schaltfläche in der Statusleiste klickst. Wenn du zum ersten Mal ein 365-Theme verwendest, bietet eine Benachrichtigung ihn an, und ohne deine Wahl ändert sich nichts.

**Kann ich nur ein Theme verwenden, zum Beispiel October Dark?**
Natürlich. Wähle es in der Theme-Auswahl (`Ctrl+K Ctrl+T`) und lass den Automatikmodus aus.

**Wofür sind die kontrastreichen Themes?**
Sie sind für Sehschwäche, sehr helle Umgebungen oder lange Programmiersitzungen gedacht und bieten maximalen Kontrast (AAA), sichtbare Rahmen und eine deutliche Fokusmarkierung. Jeder Monat hat zwei: eine dunkle Version und eine helle, High Contrast Light, für helle Umgebungen.

**Wie kann ich eine neue Version vor allen anderen ausprobieren?**
Wenn es eine Vorabversion gibt, öffne die Seite der Erweiterung in der Erweiterungsansicht und klicke auf **Switch to Pre-Release Version** (zur Vorabversion wechseln). VS Code installiert dann die Vorabversion und ihre Updates. Um zur normalen Version zurückzukehren, klicke auf derselben Seite auf **Switch to Release Version**. Rückmeldungen zu einer Vorabversion sind in den [GitHub-Issues](https://github.com/mickaellherminez/365-daynight-vscode-theme-ext/issues) willkommen. Ein [Aufruf an Testende](https://github.com/mickaellherminez/365-daynight-vscode-theme-ext/issues/47) ist offen, mit einer kurzen Liste von Punkten zum Prüfen.

## Gefallen dir die Themes?

⭐ Eine [Bewertung im Marketplace](https://marketplace.visualstudio.com/items?itemName=mickaellherminez.365-daynight-vscode-theme-ext&ssr=false#review-details) hilft anderen Entwicklern, sie zu finden.

Ein Fehler, eine unlesbare Farbe oder eine Idee? [Öffne ein Issue](https://github.com/mickaellherminez/365-daynight-vscode-theme-ext/issues/new/choose). Du möchtest mitwirken? Siehe [CONTRIBUTING.md](../CONTRIBUTING.md). Die Versionshinweise stehen im [CHANGELOG](../CHANGELOG.md).

[MIT](../LICENSE) © Mickaël Lherminez
