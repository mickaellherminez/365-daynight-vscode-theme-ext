# 365 Day & Night Themes – Barrierefreie VS-Code-Themes für jeden Monat

**48 Farbthemes für Visual Studio Code: ein helles, ein dunkles, ein kontrastreiches und ein hell kontrastreiches Theme für jeden Monat des Jahres.** Wechsle mit einem Klick zwischen Tag und Nacht oder lass die Erweiterung das für dich erledigen. Jedes Theme ist auf Lesbarkeit (WCAG-Kontrast) und Farbenblindheit getestet.

[![Version im Marketplace](https://vsmarketplacebadges.dev/version-short/mickaellherminez.365-daynight-vscode-theme-ext.svg?subject=Marketplace&style=flat)](https://marketplace.visualstudio.com/items?itemName=mickaellherminez.365-daynight-vscode-theme-ext)
[![Installationen](https://vsmarketplacebadges.dev/installs-short/mickaellherminez.365-daynight-vscode-theme-ext.svg?style=flat)](https://marketplace.visualstudio.com/items?itemName=mickaellherminez.365-daynight-vscode-theme-ext)
[![Downloads](https://vsmarketplacebadges.dev/downloads-short/mickaellherminez.365-daynight-vscode-theme-ext.svg?style=flat)](https://marketplace.visualstudio.com/items?itemName=mickaellherminez.365-daynight-vscode-theme-ext)
[![Bewertung](https://vsmarketplacebadges.dev/rating-short/mickaellherminez.365-daynight-vscode-theme-ext.svg?style=flat)](https://marketplace.visualstudio.com/items?itemName=mickaellherminez.365-daynight-vscode-theme-ext&ssr=false#review-details)
[![Downloads auf Open VSX](https://img.shields.io/open-vsx/dt/mickaellherminez/365-daynight-vscode-theme-ext?label=Open%20VSX%20downloads)](https://open-vsx.org/extension/mickaellherminez/365-daynight-vscode-theme-ext)
[![CI-Status](https://img.shields.io/github/actions/workflow/status/mickaellherminez/365-daynight-vscode-theme-ext/ci.yml?branch=main&label=CI)](https://github.com/mickaellherminez/365-daynight-vscode-theme-ext/actions/workflows/ci.yml)
[![Lizenz MIT](https://img.shields.io/github/license/mickaellherminez/365-daynight-vscode-theme-ext)](../LICENSE)

*Diese Seite lesen auf: [English](../README.md) · [Français](README_fr.md) · [Español](README_es.md) · [Português](README_pt.md) · [Русский](README_ru.md) · [中文](README_zh.md) · [日本語](README_ja.md) · [हिंदी](README_hi.md) · [العربية](README_ar.md)*

![Oktober-Themes hell, dunkel, kontrastreich und hell kontrastreich in VS Code: Explorer, Tabs, Syntaxhervorhebung, Textauswahl und Statusleiste](https://raw.githubusercontent.com/mickaellherminez/365-daynight-vscode-theme-ext/main/assets/screenshots/hero.png)

## Warum es dir gefallen wird

- 🗓️ **Jeden Monat ein neuer Look.** Raureif im Januar, junge Triebe im März, eine Lagune im Juli, Herbstlaub im Oktober, eine Polarnacht im Dezember: Das ganze Fenster folgt den Jahreszeiten, nicht nur der Editor.
- ☀️🌙 **Tag und Nacht, immer passend.** Jeder Monat hat ein helles Theme für den Tag, ein dunkles für den Abend und zwei kontrastreiche, dunkel und hell (High Contrast Light), wenn du maximale Lesbarkeit brauchst.
- 🔁 **Wechsel mit einem Klick.** Eine Schaltfläche in der Statusleiste wechselt zwischen hell und dunkel. Der kontrastreiche Modus ist per Befehl erreichbar.
- ⏰ **Optionaler Automatikmodus.** Die Erweiterung kann das Theme des aktuellen Monats selbst anwenden: tagsüber hell, nachts dunkel.
- 👁️ **Augenschonend und für alle lesbar.** Der gesamte Text erfüllt die WCAG-Kontraststufen, und die Syntaxfarben bleiben auch für farbenblinde Menschen unterscheidbar.
- 🖥️ **Sorgfältig gestaltet.** Editor, Seitenleiste, Tabs, Terminal, Debugkonsole, Benachrichtigungen und Statusleiste: Alles ist gestaltet, mit mehr als 480 Farben pro Theme. Chat, Testergebnisse, Symbol-Icons, Git-Graph, Merge-Editor und Multi-Diff folgen ebenfalls der Palette des Monats.

## Installation

**In VS Code:** Öffne die Erweiterungsansicht (`Ctrl+Shift+X`, auf dem Mac `Cmd+Shift+X`), suche nach **365 Day & Night Themes** und klicke auf **Installieren**.

**Im Marketplace:** [365 Day & Night Themes installieren](https://marketplace.visualstudio.com/items?itemName=mickaellherminez.365-daynight-vscode-theme-ext).

**Über die Kommandozeile:**

```sh
code --install-extension mickaellherminez.365-daynight-vscode-theme-ext
```

Erfordert Visual Studio Code 1.96 oder neuer.

## Erste Schritte

1. Öffne die Theme-Auswahl: `Ctrl+K`, dann `Ctrl+T` (auf dem Mac `Cmd+K`, dann `Cmd+T`).
2. Tippe **365**, um alle Themes zu sehen, zum Beispiel `365 10-October Dark`.
3. Wähle eines aus. Fertig!

Wenn du zum ersten Mal ein 365-Theme verwendest, bietet eine Benachrichtigung den automatischen Wechsel an: **Follow the clock** (der Uhrzeit folgen: tagsüber hell, nachts dunkel), **Follow my system** (dem hellen oder dunklen Modus deines Systems folgen) oder **No thanks** (nein danke). Ohne deine Wahl ändert sich nichts, und die Frage wird nur einmal gestellt. Nach einer Wahl bestätigt eine Meldung, was aktiv ist, mit einer Schaltfläche **Open Settings**, um die Uhrzeiten zu ändern oder den Wechsel auszuschalten. Um es dir später anders zu überlegen, siehe den Abschnitt zum automatischen Wechsel weiter unten.

Mit der **Schaltfläche in der Statusleiste** (unten rechts: `LGT`, `DRK`, `HCT` oder `HCL`) wechselst du zwischen der hellen und der dunklen Version des aktuellen Monats. Für den kontrastreichen Modus führe `365: Apply High Contrast theme` in der Befehlspalette aus. In einem kontrastreichen Theme wechselt die Schaltfläche zwischen dunklem (`HCT`) und hellem (`HCL`) hohem Kontrast, damit ein Klick den hohen Kontrast nie verlässt. Um den hohen Kontrast zu verlassen, führe `365: Apply Light theme` oder `365: Apply Dark theme` aus. Du kannst auch mit der Maus über die Schaltfläche fahren und auf ihren Link **Light** oder **Dark** klicken.

Um einen anderen Monat auszuprobieren, klicke auf die Pfeile daneben (`‹ 10 DRK ›`). Die Zahl ist der Monat, von `01` bis `12`, und die Pfeile behalten die Variante bei: hell, dunkel, kontrastreich oder hell kontrastreich. Auf Dezember folgt Januar. Zum Zurückkehren führe `365: Back to the current month` in der Befehlspalette aus. Pfeile und Zahl erscheinen nur mit einem 365-Theme. Fahre mit der Maus über die Schaltfläche, um den vollständigen Theme-Namen zu sehen, mit Links zum kontrastreichen Modus, zum hellen kontrastreichen Modus und zum aktuellen Monat. In einem kontrastreichen Theme führen die Links stattdessen zum hellen und zum dunklen Theme.

## Die 12 Monate

![Vorschau der 48 Themes: eine helle, dunkle, kontrastreiche und hell kontrastreiche Version für jeden Monat von Januar bis Dezember](https://raw.githubusercontent.com/mickaellherminez/365-daynight-vscode-theme-ext/main/assets/screenshots/year.png)

| Monat | Stimmung | Hell | Dunkel | Kontrastreich | Hell kontrastreich |
| --- | --- | --- | --- | --- | --- |
| Januar | Raureif | Gletscherblau und Tiefblau | Tiefes Winterblau und Eisblau | Blauschwarz und Eisblau | Eisweiß und Marineblau |
| Februar | Lavendelnebel | Blasses Lavendel und Violett | Grauviolette Nacht und Flieder | Violettschwarz und blasser Flieder | Lavendelweiß und Pflaume |
| März | Junge Triebe | Zartgrün und Knospengrün | Olivfarbene Nacht und Knospengrün | Olivschwarz und leuchtendes Grün | Blassgrün und Waldgrün |
| April | Aprilschauer | Regenhimmel und Kirschblütenrosa | Regenschiefer und Kirschblütenrosa | Blauschwarz und Kirschblütenrosa | Blasser Himmel und tiefes Rosa |
| Mai | Blumenwiese | Wiesengrün und Olivgold | Tiefgrüne Nacht und Butterblumengelb | Grünschwarz und blasses Gold | Blassgrün und dunkle Bronze |
| Juni | Lange Tage | Klarer Himmel und Sommerblau | Petrolblaue Nacht und Immergrünblau | Schwarz und Immergrünblau | Himmelweiß und Königsblau |
| Juli | Lagune | Türkises Wasser und Koralle | Tiefe Lagune und Koralle | Petrolschwarz und blasse Koralle | Blasses Türkis und Korallenrot |
| August | Warmer Sand | Goldener Sand und Karamell | Braune Nacht und Bernstein | Braunschwarz und Bernstein | Warmweiß und dunkler Bernstein |
| September | Weinlese | Blassrosa und Pflaume | Weinrote Nacht und Pflaume | Weinschwarz und Orchidee | Blassrosa und tiefe Pflaume |
| Oktober | Herbstlaub | Pfirsich und Rostrot | Warmbraune Nacht und Rostrot | Braunschwarz und Lachs | Pfirsichweiß und tiefes Rostrot |
| November | Nebel und Unterholz | Nebliges Taupe und Moosgrün | Unterholzgrau und Moosgrün | Warmes Schwarz und Moosgrün | Creme und dunkles Moos |
| Dezember | Polarnacht | Eisiges Lavendel und Polarlicht-Petrol | Mitternachtsblau und Polarlicht-Cyan | Blauschwarz und Polarlicht-Cyan | Lavendelweiß und dunkles Petrol |

## Neuer Look und der Weg zurück

Version 0.13.0 gestaltet alle Themes neu: Jeder Monat hat jetzt seine eigene Stimmung der Jahreszeit, und jeder Monat erhält ein helles kontrastreiches Theme (High Contrast Light). Dein ausgewähltes Theme, deine Einstellungen und deine Tastenkürzel bleiben erhalten: Die Namen der Themes und die Befehle haben sich nicht geändert, nur die Farben.

Dir gefällt der alte Look besser? Kehre zu Version 0.12.0 zurück:

1. Öffne die Erweiterungsansicht (`Ctrl+Shift+X`, auf dem Mac `Cmd+Shift+X`) und suche **365 Day & Night Themes**.
2. Klicke sie an, um ihre Seite zu öffnen, klicke auf den Pfeil neben **Uninstall** (deinstallieren), wähle **Install Specific Version...** (bestimmte Version installieren) und dann **0.12.0**.
3. Lade VS Code neu, wenn du dazu aufgefordert wirst.

VS Code deaktiviert dann **Auto Update** (automatische Aktualisierung) für diese Erweiterung, die bei 0.12.0 bleibt. Um den neuen Look zurückzubekommen, aktiviere **Auto Update** wieder oder wähle im selben Menü die neueste Version. Version 0.12.0 hat kein helles kontrastreiches Theme: Nutzt du eines, wähle nach dem Zurückkehren ein anderes Theme.

## Automatischer Tag-/Nachtwechsel

Soll dein Editor der Uhrzeit folgen? Aktiviere den Automatikmodus:

1. Öffne die Einstellungen (`Ctrl+,` oder `Cmd+,`) und suche nach **365DayNight**.
2. Aktiviere **365DayNight: Enable**.

Oder füge Folgendes zu deiner `settings.json` hinzu:

```json
{
  "365DayNight.enable": true,
  "365DayNight.mode": "auto"
}
```

| Modus | Wirkung |
| --- | --- |
| `auto` | Standardmäßig helles Theme von 7:00 bis 19:00 Uhr, sonst dunkles Theme. Die Uhrzeiten lassen sich ändern (siehe unten) |
| `day` | Immer das helle Theme des aktuellen Monats |
| `night` | Immer das dunkle Theme des aktuellen Monats |
| `system` | Folgt der hellen, dunklen und kontrastreichen Darstellung deines Systems (siehe unten) |

Am ersten Tag jedes Monats wechselt die Erweiterung außerdem zum Theme des neuen Monats.

Gut zu wissen:

- **Du entscheidest.** Der Automatikmodus ist standardmäßig ausgeschaltet: Die Erweiterung ändert dein Theme nie ungefragt. Wenn du zum ersten Mal ein 365-Theme verwendest, fragt dich eine Benachrichtigung ein einziges Mal, ob du ihn möchtest.
- **Deine Wahl zählt.** Wählst du ein Theme von Hand, bleibt es bis zum nächsten Periodenwechsel (Tag/Nacht oder neuer Monat).
- **Dein Monat bleibt auch.** Wählst du einen anderen Monat, mit den Pfeilen oder in der Theme-Auswahl, wechselt der Automatikmodus weiter zwischen hell und dunkel in diesem Monat, bis der nächste tatsächliche Monat beginnt, auch nach einem Neustart. Um früher zurückzukehren, führe `365: Back to the current month` aus.
- **Kontrastreich bleibt kontrastreich.** Nutzt du ein kontrastreiches Theme, dunkel oder hell, aktualisiert der Automatikmodus nur den Monat, nie die Variante.

### Uhrzeiten wählen

Standardmäßig beginnt das helle Theme um 7:00 Uhr und das dunkle um 19:00 Uhr. So änderst du diese Uhrzeiten:

1. Öffne die Einstellungen (`Ctrl+,` oder `Cmd+,`) und suche nach **365DayNight**.
2. Setze **365DayNight: Day Start** und **365DayNight: Night Start** im Format HH:MM (24-Stunden-Uhr).

Oder füge Folgendes zu deiner `settings.json` hinzu:

```json
{
  "365DayNight.dayStart": "08:30",
  "365DayNight.nightStart": "20:00"
}
```

- **Schnell angewendet.** Eine neue Uhrzeit gilt etwa 2 Sekunden nach dem Ende der Eingabe, auch wenn du ein Theme von Hand gewählt hast. Danach wechselt das Theme zur gewählten Minute.
- **Über Mitternacht.** Beginnt der Tag nach der Nacht, zum Beispiel `"20:00"` und `"06:00"`, läuft das helle Theme über Mitternacht. Praktisch, wenn du nachts arbeitest.
- **Ungültige Werte.** Eine unlesbare Uhrzeit wie `"25:00"` oder `"7h"` wird durch ihren Standardwert ersetzt, und eine Warnung weist dich einmal darauf hin. Zwei gleiche Uhrzeiten ergeben 7:00 und 19:00 Uhr.
- **Nur im Modus `auto`.** Die Modi `day`, `night` und `system` ignorieren diese Uhrzeiten.
- **Zurück zu 7:00 und 19:00 Uhr.** Klicke in den Einstellungen auf das Zahnrad neben jeder Uhrzeit und wähle **Reset Setting**, oder entferne beide Zeilen aus deiner `settings.json`.

### Deinem System folgen

Du möchtest lieber der Darstellung deines Systems folgen als der Uhrzeit? Nutze den Modus `system`:

1. Öffne die Einstellungen (`Ctrl+,` oder `Cmd+,`) und suche nach **365DayNight**.
2. Aktiviere **365DayNight: Enable**.
3. Stelle **365DayNight: Mode** auf `system`.

Oder füge Folgendes zu deiner `settings.json` hinzu:

```json
{
  "365DayNight.enable": true,
  "365DayNight.mode": "system"
}
```

| Dein System verwendet | Angewendetes Theme |
| --- | --- |
| Helle Darstellung | Helles Theme des Monats |
| Dunkle Darstellung | Dunkles Theme des Monats |
| Hoher Kontrast, mit dunkler Darstellung | Kontrastreiches Theme des Monats |
| Hoher Kontrast, mit heller Darstellung | Das helle kontrastreiche Theme des Monats |

Die Schaltfläche in diesem Modus:
- **Pfeile.** `‹` und `›` ändern den Monat aller Varianten. Dieser Monat bleibt bis zum Beginn des nächsten tatsächlichen Monats, auch nach einem Neustart. Um früher zurückzukehren, führe `365: Back to the current month` aus.
- **Mittlere Schaltfläche.** Dein System entscheidet zwischen hell und dunkel, daher erklärt ein Klick dies nur. Die Befehle `365: Apply Light theme`, `365: Apply Dark theme`, `365: Apply High Contrast theme` und `365: Apply High Contrast Light theme` sagen dasselbe und ändern nichts.
- **Theme-Auswahl.** Wählst du ein 365-Theme, gilt sein Monat für alle Varianten. Wählst du ein Theme eines anderen Anbieters, ersetzt es nur die aktive Variante: Es bleibt auch in den folgenden Monaten, und die Schaltfläche zeigt dann weder Pfeile noch Monat. Klicke auf die mittlere Schaltfläche, um das 365-Theme zurückzubekommen.


- **Was der Modus ändert.** Er schaltet `window.autoDetectColorScheme` ein und schreibt die Themes des Monats in `workbench.preferredLightColorTheme`, `workbench.preferredDarkColorTheme`, `workbench.preferredHighContrastColorTheme` und `workbench.preferredHighContrastLightColorTheme`. `workbench.colorTheme` ändert sich nicht.
- **Zurückkehren.** Deaktiviere **365DayNight: Enable** oder wähle einen anderen Modus. Deine ursprünglichen Einstellungen kommen zurück, und Einstellungen, die es nicht gab, werden wieder entfernt. Eine Einstellung, die du inzwischen geändert hast, behält deinen Wert.
- **Vor dem Deinstallieren oder Deaktivieren der Erweiterung.** Verlasse zuerst diesen Modus, denn danach kann eine Erweiterung nichts mehr wiederherstellen. Falls du es vergessen hast, entferne die fünf oben genannten Einstellungen aus deiner `settings.json`.
- **Hoher Kontrast.** VS Code gibt dem hohen Kontrast deines Systems Vorrang. Um ihn zu ignorieren, schalte `window.autoDetectHighContrast` aus: Der Modus ändert diese Einstellung nie.
- **Erkennung ausschalten.** Schaltest du `window.autoDetectColorScheme` selbst aus, lässt die Erweiterung es aus, und die Schaltfläche funktioniert wie gewohnt. Eine Theme-Einstellung in einem Workspace hat dort weiterhin Vorrang.
- **Betriebssysteme.** Laut der Dokumentation von VS Code wird die helle oder dunkle Darstellung unter Windows und macOS erkannt.

## Barrierefreiheit zuerst

Jedes Theme besteht ein automatisiertes Barrierefreiheits-Audit mit mehr als 250 Prüfungen:

- **Lesbarer Text:** Editortext und Syntaxfarben erreichen einen Kontrast von mindestens **4,5:1 (WCAG AA)** in hellen und dunklen Themes und **7:1 (WCAG AAA)** in kontrastreichen Themes.
- **Farbenblind-freundlich:** Syntaxfarben (Schlüsselwörter, Funktionen, Strings, Zahlen, Klassen, Kommentare) und Hinweise (Fehler, Warnungen, Git-Änderungen) werden für **Protanopie, Deuteranopie und Tritanopie** simuliert, damit sie unterscheidbar bleiben.
- **Nicht nur Farbe:** Kommentare, Parameter und Attribute sind *kursiv*, veralteter Code ist ~~durchgestrichen~~, ungültiger Code unterstrichen.
- **Überall sichtbare Auswahl:** Die Textauswahl ist im Editor, im Terminal und in der Debugkonsole gut sichtbar und wird nie mit Suchtreffern verwechselt.
- **Kontrastreiche Themes:** Ausgewählter Text wird schwarz auf Hellblau (weiß auf Dunkelblau im hellen kontrastreichen Theme), und alle Bereiche haben sichtbare Rahmen und eine deutliche Tastaturfokus-Markierung.
- **Screenreader:** Jeder Teil der Schaltfläche in der Statusleiste hat eine eigene gesprochene Bezeichnung, zum Beispiel „Next month: November“.

Eine Farbe schwer lesbar? [Erstelle ein Issue](https://github.com/mickaellherminez/365-daynight-vscode-theme-ext/issues): Rückmeldungen zur Barrierefreiheit sind immer willkommen.

## Befehle

Öffne die Befehlspalette (`Ctrl+Shift+P` oder `Cmd+Shift+P`) und tippe **365**:

| Befehl | Aktion |
| --- | --- |
| `365: Toggle between Light and Dark themes` | Wechselt zwischen hell und dunkel (wie die Schaltfläche in der Statusleiste) |
| `365: Apply Light theme` | Wendet das helle Theme des angezeigten Monats an |
| `365: Apply Dark theme` | Wendet das dunkle Theme des angezeigten Monats an |
| `365: Apply High Contrast theme` | Wendet das kontrastreiche Theme des angezeigten Monats an |
| `365: Apply High Contrast Light theme` | Wendet das helle kontrastreiche Theme des angezeigten Monats an |
| `365: Next month` | Wendet das Theme des nächsten Monats in derselben Variante an |
| `365: Previous month` | Wendet das Theme des vorherigen Monats in derselben Variante an |
| `365: Back to the current month` | Wendet das Theme des tatsächlichen aktuellen Monats in derselben Variante an |

Die Erweiterung legt standardmäßig keine Tastenkürzel fest. Um eigene zuzuweisen, öffne die Liste der Tastenkürzel (`Ctrl+K Ctrl+S`, auf dem Mac `Cmd+K Cmd+S`), gib **365** ein, doppelklicke auf einen Befehl und drücke deine Tasten.

## Einstellungen

| Einstellung | Standard | Beschreibung |
| --- | --- | --- |
| `365DayNight.enable` | `false` | Wendet automatisch das Theme des aktuellen Monats an |
| `365DayNight.mode` | `auto` | `auto` (nach Uhrzeit), `day` (immer hell), `night` (immer dunkel) oder `system` (folgt deinem System) |
| `365DayNight.dayStart` | `"07:00"` | Uhrzeit, zu der das helle Theme im Modus `auto` beginnt, im Format HH:MM |
| `365DayNight.nightStart` | `"19:00"` | Uhrzeit, zu der das dunkle Theme im Modus `auto` beginnt, im Format HH:MM |
| `365DayNight.toggleIncludesHighContrast` | `false` | Die Schaltfläche in der Statusleiste durchläuft alle Varianten: hell, dunkel, kontrastreich, dann hell kontrastreich |

## Häufige Fragen

**Wie wechselt VS Code automatisch zwischen hellem und dunklem Theme?**
Installiere die Erweiterung und setze `"365DayNight.enable": true`. Das helle Theme gilt von 7:00 bis 19:00 Uhr, das dunkle nachts. Du kannst diese Uhrzeiten mit `365DayNight.dayStart` und `365DayNight.nightStart` ändern.

**Kann VS Code mit diesen Themes dem hellen oder dunklen Modus meines Systems folgen?**
Ja. Setze `"365DayNight.enable": true` und `"365DayNight.mode": "system"`. Dein System entscheidet zwischen hell und dunkel, und die Erweiterung hält die Themes auf dem aktuellen Monat.

**Gibt es ein farbenblind-freundliches VS-Code-Theme?**
Ja. Alle Themes werden mit Simulationen von Protanopie, Deuteranopie und Tritanopie getestet und nutzen Kursivschrift, Unterstreichung und Durchstreichung, damit Informationen nie nur von der Farbe abhängen.

**Ändert die Erweiterung mein Theme ungefragt?**
Nein. Der Automatikmodus ist standardmäßig aus. Ohne ihn ändert sich das Theme nur, wenn du eines auswählst oder auf die Schaltfläche in der Statusleiste klickst. Wenn du zum ersten Mal ein 365-Theme verwendest, bietet eine Benachrichtigung ihn an, und ohne deine Wahl ändert sich nichts.

**Kann ich nur ein Theme verwenden, zum Beispiel October Dark?**
Natürlich. Wähle es in der Theme-Auswahl (`Ctrl+K Ctrl+T`) und lass den Automatikmodus aus.

**Wofür sind die kontrastreichen Themes?**
Sie sind für Sehschwäche, sehr helle Umgebungen oder lange Programmiersitzungen gedacht und bieten maximalen Kontrast (AAA), sichtbare Rahmen und eine deutliche Fokusmarkierung. Jeder Monat hat zwei: eine dunkle Version und eine helle, High Contrast Light, für helle Umgebungen.

**Wie kann ich eine neue Version vor allen anderen ausprobieren?**
Wenn es eine Vorabversion gibt, öffne die Seite der Erweiterung in der Erweiterungsansicht und klicke auf **Switch to Pre-Release Version** (zur Vorabversion wechseln). VS Code installiert dann die Vorabversion und ihre Updates. Um zur normalen Version zurückzukehren, klicke auf derselben Seite auf **Switch to Release Version**. Rückmeldungen zu einer Vorabversion sind in den [GitHub-Issues](https://github.com/mickaellherminez/365-daynight-vscode-theme-ext/issues) willkommen. Ein [Aufruf an Testende](https://github.com/mickaellherminez/365-daynight-vscode-theme-ext/issues/47) ist offen, mit einer kurzen Liste von Punkten zum Prüfen.

## Roadmap

Ideen und Vorschläge sind in den [GitHub-Issues](https://github.com/mickaellherminez/365-daynight-vscode-theme-ext/issues) willkommen.

## Feedback und Mitwirken

- ⭐ Gefallen dir die Themes? Eine [Bewertung im Marketplace](https://marketplace.visualstudio.com/items?itemName=mickaellherminez.365-daynight-vscode-theme-ext&ssr=false#review-details) hilft anderen Entwicklern, sie zu finden.
- 🐞 Fehler, unlesbare Farbe oder Idee: [erstelle ein Issue](https://github.com/mickaellherminez/365-daynight-vscode-theme-ext/issues).
- 🛠️ Möchtest du mitwirken? Siehe [CONTRIBUTING.md](../CONTRIBUTING.md) (auf Englisch).

Die Versionshinweise stehen im [CHANGELOG](../CHANGELOG.md).

## Lizenz

[MIT](../LICENSE) © Mickaël Lherminez
