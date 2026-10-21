# 365 Day & Night Themes – Barrierefreie VS-Code-Themes für jeden Monat

**36 Farbthemes für Visual Studio Code: ein helles, ein dunkles und ein kontrastreiches Theme für jeden Monat des Jahres.** Wechsle mit einem Klick zwischen Tag und Nacht oder lass die Erweiterung das für dich erledigen. Jedes Theme ist auf Lesbarkeit (WCAG-Kontrast) und Farbenblindheit getestet.

[![Version im Marketplace](https://img.shields.io/visual-studio-marketplace/v/mickaellherminez.365-daynight-vscode-theme-ext?label=Marketplace)](https://marketplace.visualstudio.com/items?itemName=mickaellherminez.365-daynight-vscode-theme-ext)
[![Installationen](https://img.shields.io/visual-studio-marketplace/i/mickaellherminez.365-daynight-vscode-theme-ext)](https://marketplace.visualstudio.com/items?itemName=mickaellherminez.365-daynight-vscode-theme-ext)
[![Lizenz MIT](https://img.shields.io/github/license/mickaellherminez/365-daynight-vscode-theme-ext)](../LICENSE)

*Diese Seite lesen auf: [English](../README.md) · [Français](README_fr.md) · [Español](README_es.md) · [Português](README_pt.md) · [Русский](README_ru.md) · [中文](README_zh.md) · [日本語](README_ja.md) · [हिंदी](README_hi.md) · [العربية](README_ar.md)*

![Oktober-Themes hell, dunkel und kontrastreich in VS Code: Explorer, Tabs, Syntaxhervorhebung, Textauswahl und Statusleiste](https://raw.githubusercontent.com/mickaellherminez/365-daynight-vscode-theme-ext/main/assets/screenshots/hero.png)

## Warum es dir gefallen wird

- 🗓️ **Jeden Monat ein neuer Look.** Schnee und Winterblau im Januar, Frühlingsgrün im März, volle Sonne im Juli, Herbstfarben im Oktober, Kaminfeuer-Stimmung im Dezember: Dein Editor folgt den Jahreszeiten.
- ☀️🌙 **Tag und Nacht, immer passend.** Jeder Monat hat ein helles Theme für den Tag, ein dunkles für den Abend und ein kontrastreiches, wenn du maximale Lesbarkeit brauchst.
- 🔁 **Wechsel mit einem Klick.** Eine Schaltfläche in der Statusleiste wechselt zwischen hell, dunkel und kontrastreich.
- ⏰ **Optionaler Automatikmodus.** Die Erweiterung kann das Theme des aktuellen Monats selbst anwenden: tagsüber hell, nachts dunkel.
- 👁️ **Augenschonend und für alle lesbar.** Der gesamte Text erfüllt die WCAG-Kontraststufen, und die Syntaxfarben bleiben auch für farbenblinde Menschen unterscheidbar.
- 🖥️ **Vollständige Themes.** Editor, Seitenleiste, Tabs, Terminal, Debugkonsole, Benachrichtigungen und Statusleiste: Alles ist gestaltet, nichts fällt auf die Standardfarben zurück.

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
2. Tippe **365**, um alle 36 Themes zu sehen, zum Beispiel `365 10-October Dark`.
3. Wähle eines aus. Fertig!

Mit der **Schaltfläche in der Statusleiste** (unten rechts: `LGT`, `DRK` oder `HCT`) wechselst du zwischen der hellen, dunklen und kontrastreichen Version des aktuellen Monats.

## Die 12 Monate

![Vorschau der 36 Themes: eine helle, dunkle und kontrastreiche Version für jeden Monat von Januar bis Dezember](https://raw.githubusercontent.com/mickaellherminez/365-daynight-vscode-theme-ext/main/assets/screenshots/year.png)

| Monat | Hell | Dunkel | Kontrastreich |
| --- | --- | --- | --- |
| Januar | Schneeweiß und Winterblau | Marineblaue Nacht mit Gold | Schwarz und kräftiges Blau |
| Februar | Weiß und Grün mit einem Hauch Valentinsrot | Nordischer Schiefer und Raureif | Marineblau und Gold |
| März | Creme und Frühlingsgrün | Indigo-Nacht | Dunkles Petrol und Rotorange |
| April | Creme und Osterorange | Bläulicher Schiefer und Gold | Tiefblau und Gold |
| Mai | Helles Weiß und Orange | Ozeannacht mit Orange | Marineblau und Himmelblau |
| Juni | Himmelblau und Indigotinte | Blaue Nacht mit Orange | Schwarz und Koralle |
| Juli | Volle Sonne: Creme, Braun und Orange | Von Solarized inspirierte Sommernacht | Marineblau, Orange und Gold |
| August | Warmes Creme und Indigotinte | Schiefernacht mit Gelb | Schwarz und Neongrün |
| September | Himmel zum Schulbeginn und Marinetinte | Schiefer und Petrol | Schwarz und kräftiges Orange |
| Oktober | Herbstcreme, gebranntes Orange und Bernstein | Dunkelbraun und Glut | Warmes Schwarz und Bernstein |
| November | Nebel, Schiefer und Stahlblau | Tiefer Schiefer, Orange und Gold | Schwarz und Gold |
| Dezember | Raureif und Petrol | Am Kamin: Schiefer und Glut | Winternacht und eisiges Cyan |

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
| `auto` | Helles Theme von 7:00 bis 19:00 Uhr, sonst dunkles Theme |
| `day` | Immer das helle Theme des aktuellen Monats |
| `night` | Immer das dunkle Theme des aktuellen Monats |

Am ersten Tag jedes Monats wechselt die Erweiterung außerdem zum Theme des neuen Monats.

Gut zu wissen:

- **Du entscheidest.** Der Automatikmodus ist standardmäßig ausgeschaltet: Die Erweiterung ändert dein Theme nie ungefragt.
- **Deine Wahl zählt.** Wählst du ein Theme von Hand, bleibt es bis zum nächsten Periodenwechsel (Tag/Nacht oder neuer Monat).
- **Kontrastreich bleibt kontrastreich.** Nutzt du ein kontrastreiches Theme, aktualisiert der Automatikmodus nur den Monat, nie die Kontraststufe.

## Barrierefreiheit zuerst

Jedes Theme besteht ein automatisiertes Barrierefreiheits-Audit mit mehr als 130 Prüfungen:

- **Lesbarer Text:** Editortext und Syntaxfarben erreichen einen Kontrast von mindestens **4,5:1 (WCAG AA)** in hellen und dunklen Themes und **7:1 (WCAG AAA)** in kontrastreichen Themes.
- **Farbenblind-freundlich:** Syntaxfarben (Schlüsselwörter, Funktionen, Strings, Zahlen, Klassen, Kommentare) und Hinweise (Fehler, Warnungen, Git-Änderungen) werden für **Protanopie, Deuteranopie und Tritanopie** simuliert, damit sie unterscheidbar bleiben.
- **Nicht nur Farbe:** Kommentare, Parameter und Attribute sind *kursiv*, veralteter Code ist ~~durchgestrichen~~, ungültiger Code unterstrichen.
- **Überall sichtbare Auswahl:** Die Textauswahl ist im Editor, im Terminal und in der Debugkonsole gut sichtbar und wird nie mit Suchtreffern verwechselt.
- **Kontrastreiche Themes:** Ausgewählter Text wird schwarz auf Hellblau, und alle Bereiche haben sichtbare Rahmen und eine deutliche Tastaturfokus-Markierung.

Eine Farbe schwer lesbar? [Erstelle ein Issue](https://github.com/mickaellherminez/365-daynight-vscode-theme-ext/issues): Rückmeldungen zur Barrierefreiheit sind immer willkommen.

## Befehle

Öffne die Befehlspalette (`Ctrl+Shift+P` oder `Cmd+Shift+P`) und tippe **365**:

| Befehl | Aktion |
| --- | --- |
| `365: Toggle between Light, Dark and High Contrast themes` | Wechselt hell → dunkel → kontrastreich (wie die Schaltfläche in der Statusleiste) |
| `365: Apply Light theme` | Wendet das helle Theme des aktuellen Monats an |
| `365: Apply Dark theme` | Wendet das dunkle Theme des aktuellen Monats an |
| `365: Apply High Contrast theme` | Wendet das kontrastreiche Theme des aktuellen Monats an |

Diese Befehle findest du auch im Menü **365 Themes** per Rechtsklick im Editor. Du kannst ihnen eigene Tastenkürzel zuweisen (`Ctrl+K Ctrl+S`).

## Einstellungen

| Einstellung | Standard | Beschreibung |
| --- | --- | --- |
| `365DayNight.enable` | `false` | Wendet automatisch das Theme des aktuellen Monats an |
| `365DayNight.mode` | `auto` | `auto` (nach Uhrzeit), `day` (immer hell) oder `night` (immer dunkel) |

## Häufige Fragen

**Wie wechselt VS Code automatisch zwischen hellem und dunklem Theme?**
Installiere die Erweiterung und setze `"365DayNight.enable": true`. Das helle Theme gilt von 7:00 bis 19:00 Uhr, das dunkle nachts.

**Gibt es ein farbenblind-freundliches VS-Code-Theme?**
Ja. Alle 36 Themes werden mit Simulationen von Protanopie, Deuteranopie und Tritanopie getestet und nutzen Kursivschrift, Unterstreichung und Durchstreichung, damit Informationen nie nur von der Farbe abhängen.

**Ändert die Erweiterung mein Theme ungefragt?**
Nein. Der Automatikmodus ist standardmäßig aus. Ohne ihn ändert sich das Theme nur, wenn du eines auswählst oder auf die Schaltfläche in der Statusleiste klickst.

**Kann ich nur ein Theme verwenden, zum Beispiel October Dark?**
Natürlich. Wähle es in der Theme-Auswahl (`Ctrl+K Ctrl+T`) und lass den Automatikmodus aus.

**Wofür sind die kontrastreichen Themes?**
Sie sind für Sehschwäche, sehr helle Umgebungen oder lange Programmiersitzungen gedacht und bieten maximalen Kontrast (AAA), sichtbare Rahmen und eine deutliche Fokusmarkierung.

**Gibt es Feiertags-Themes?**
Noch nicht. Themes für Neujahr, Ostern, Halloween und Weihnachten sind geplant. Folge dem [Projekt auf GitHub](https://github.com/mickaellherminez/365-daynight-vscode-theme-ext), um benachrichtigt zu werden.

## Roadmap

- 🎉 Feiertags-Themes (Neujahr, Ostern, Halloween, Weihnachten)
- ⏰ Einstellbare Tag- und Nachtzeiten

Ideen und Vorschläge sind in den [GitHub-Issues](https://github.com/mickaellherminez/365-daynight-vscode-theme-ext/issues) willkommen.

## Feedback und Mitwirken

- ⭐ Gefallen dir die Themes? Eine [Bewertung im Marketplace](https://marketplace.visualstudio.com/items?itemName=mickaellherminez.365-daynight-vscode-theme-ext&ssr=false#review-details) hilft anderen Entwicklern, sie zu finden.
- 🐞 Fehler, unlesbare Farbe oder Idee: [erstelle ein Issue](https://github.com/mickaellherminez/365-daynight-vscode-theme-ext/issues).
- 🛠️ Möchtest du mitwirken? Siehe [CONTRIBUTING.md](../CONTRIBUTING.md) (auf Englisch).

Die Versionshinweise stehen im [CHANGELOG](../CHANGELOG.md).

## Lizenz

[MIT](../LICENSE) © Mickaël Lherminez
