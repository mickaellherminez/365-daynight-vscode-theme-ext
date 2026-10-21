# 365 Day & Night Themes – Accessible VS Code Themes for Every Month

**36 color themes for Visual Studio Code: a Light, a Dark and a High Contrast theme for each month of the year.** Switch between day and night in one click, or let the extension do it for you. Every theme is tested for readability (WCAG contrast) and for color blindness.

[![Visual Studio Marketplace Version](https://img.shields.io/visual-studio-marketplace/v/mickaellherminez.365-daynight-vscode-theme-ext?label=Marketplace)](https://marketplace.visualstudio.com/items?itemName=mickaellherminez.365-daynight-vscode-theme-ext)
[![Installs](https://img.shields.io/visual-studio-marketplace/i/mickaellherminez.365-daynight-vscode-theme-ext)](https://marketplace.visualstudio.com/items?itemName=mickaellherminez.365-daynight-vscode-theme-ext)
[![Rating](https://img.shields.io/visual-studio-marketplace/r/mickaellherminez.365-daynight-vscode-theme-ext)](https://marketplace.visualstudio.com/items?itemName=mickaellherminez.365-daynight-vscode-theme-ext&ssr=false#review-details)
[![License: MIT](https://img.shields.io/github/license/mickaellherminez/365-daynight-vscode-theme-ext)](https://github.com/mickaellherminez/365-daynight-vscode-theme-ext/blob/main/LICENSE)

*Read this page in: [Français](docs/README_fr.md) · [Español](docs/README_es.md) · [Deutsch](docs/README_de.md) · [Português](docs/README_pt.md) · [Русский](docs/README_ru.md) · [中文](docs/README_zh.md) · [日本語](docs/README_ja.md) · [हिंदी](docs/README_hi.md) · [العربية](docs/README_ar.md)*

![October Light, Dark and High Contrast themes in VS Code: explorer, tabs, syntax highlighting, text selection and status bar](https://raw.githubusercontent.com/mickaellherminez/365-daynight-vscode-theme-ext/main/assets/screenshots/hero.png)

## Why you'll like it

- 🗓️ **A new look every month.** Snow and winter blue in January, spring green in March, full sun in July, autumn colors in October, a fireside glow in December. Your editor follows the seasons.
- ☀️🌙 **Day and night, always matched.** Each month has a Light theme for daylight, a Dark theme for the evening, and a High Contrast theme when you need maximum readability.
- 🔁 **One-click switch.** A button in the status bar cycles between Light, Dark and High Contrast.
- ⏰ **Optional automatic mode.** The extension can apply the current month's theme by itself, Light during the day and Dark at night.
- 👁️ **Easy on the eyes, readable for everyone.** All text meets WCAG contrast levels, and syntax colors stay distinct for people with color blindness.
- 🖥️ **Complete themes.** The editor, sidebar, tabs, terminal, debug console, notifications and status bar are all styled. Nothing falls back to the default colors.

## Installation

**From VS Code:** open the Extensions view (`Ctrl+Shift+X`, or `Cmd+Shift+X` on Mac), search for **365 Day & Night Themes**, then click **Install**.

**From the Marketplace:** [install 365 Day & Night Themes](https://marketplace.visualstudio.com/items?itemName=mickaellherminez.365-daynight-vscode-theme-ext).

**From the command line:**

```sh
code --install-extension mickaellherminez.365-daynight-vscode-theme-ext
```

Requires Visual Studio Code 1.96 or later.

## Getting started

1. Open the theme picker: `Ctrl+K` then `Ctrl+T` (`Cmd+K` then `Cmd+T` on Mac).
2. Type **365** to see all 36 themes, for example `365 10-October Dark`.
3. Pick one. That's it!

Use the **status bar button** (bottom right: `LGT`, `DRK` or `HCT`) to switch between the Light, Dark and High Contrast versions of the current month.

## The 12 months

![Preview of the 36 themes: a Light, Dark and High Contrast version for each month from January to December](https://raw.githubusercontent.com/mickaellherminez/365-daynight-vscode-theme-ext/main/assets/screenshots/year.png)

| Month | Light | Dark | High Contrast |
| --- | --- | --- | --- |
| January | Snow white and winter blue | Navy night lit with gold | Black and bright blue |
| February | White and green, with a Valentine's red touch | Nordic slate and frost | Navy and gold |
| March | Cream and spring green | Indigo night | Dark teal and red-orange |
| April | Cream and Easter orange | Bluish slate and gold | Deep blue and gold |
| May | Bright white and orange | Ocean night with orange | Navy and sky blue |
| June | Sky blue and indigo ink | Blue night lit with orange | Black and coral |
| July | Full sun: cream, brown and orange | Solarized-inspired summer night | Navy, orange and gold |
| August | Warm cream and indigo ink | Slate night with yellow | Black and neon green |
| September | Back-to-school sky and navy ink | Slate and teal | Black and bright orange |
| October | Autumn cream, burnt orange and amber | Dark brown and ember | Warm black and amber |
| November | Misty slate and steel blue | Deep slate with orange and gold | Black and gold |
| December | Frost and teal | Fireside slate and ember | Winter night and icy cyan |

## Automatic day and night switching

Want your editor to follow the clock? Turn on the automatic mode:

1. Open the settings (`Ctrl+,` or `Cmd+,`) and search for **365DayNight**.
2. Check **365DayNight: Enable**.

Or add this to your `settings.json`:

```json
{
  "365DayNight.enable": true,
  "365DayNight.mode": "auto"
}
```

| Mode | What it does |
| --- | --- |
| `auto` | Light theme from 7:00 to 19:00, Dark theme the rest of the time |
| `day` | Always the Light theme of the current month |
| `night` | Always the Dark theme of the current month |

The extension also moves to the next month's theme on the first day of each month.

Good to know:
- **It's opt-in.** Automatic mode is off by default, so the extension never changes your theme unless you ask it to.
- **Your choice wins.** If you pick a theme by hand, it stays until the next change of period (day to night, or a new month).
- **High Contrast stays High Contrast.** If you use a High Contrast theme, automatic mode only updates the month, never the contrast level.

## Accessibility first

Every theme passes an automated accessibility audit of more than 130 checks:

- **Readable text:** editor text and syntax colors reach a contrast ratio of at least **4.5:1 (WCAG AA)** in Light and Dark themes, and **7:1 (WCAG AAA)** in High Contrast themes.
- **Color blind friendly:** syntax colors (keywords, functions, strings, numbers, classes, comments) and alerts (errors, warnings, Git changes) are simulated for **protanopia, deuteranopia and tritanopia** to make sure they stay distinct.
- **Not color alone:** comments, parameters and attributes are in *italics*, deprecated code is ~~struck through~~, invalid code is underlined.
- **Visible selection everywhere:** text selection is clearly visible in the editor, the terminal and the debug console, and never confused with search results.
- **High Contrast themes:** selected text turns black on light blue, and all panels have visible borders and a strong keyboard focus outline.

Found something hard to read? Please [open an issue](https://github.com/mickaellherminez/365-daynight-vscode-theme-ext/issues). Accessibility feedback is always welcome.

## Commands

Open the Command Palette (`Ctrl+Shift+P` or `Cmd+Shift+P`) and type **365**:

| Command | Action |
| --- | --- |
| `365: Toggle between Light, Dark and High Contrast themes` | Cycles Light → Dark → High Contrast (same as the status bar button) |
| `365: Apply Light theme` | Applies the current month's Light theme |
| `365: Apply Dark theme` | Applies the current month's Dark theme |
| `365: Apply High Contrast theme` | Applies the current month's High Contrast theme |

These commands are also available in the **365 Themes** menu, from a right-click in the editor. You can assign your own keyboard shortcuts to them (`Ctrl+K Ctrl+S`).

## Settings

| Setting | Default | Description |
| --- | --- | --- |
| `365DayNight.enable` | `false` | Automatically apply the theme of the current month |
| `365DayNight.mode` | `auto` | `auto` (by time of day), `day` (always Light) or `night` (always Dark) |

## FAQ

**How do I automatically switch VS Code between a light and a dark theme?**
Install the extension and set `"365DayNight.enable": true`. The Light theme is applied from 7:00 to 19:00 and the Dark theme at night.

**Is there a color blind friendly VS Code theme?**
Yes. All 36 themes are tested with protanopia, deuteranopia and tritanopia simulations, and they use italics, underline and strikethrough so that information never relies on color alone.

**Will the extension change my theme without asking?**
No. Automatic mode is off by default. Without it, the theme only changes when you pick one or click the status bar button.

**Can I use only one theme, for example October Dark?**
Of course. Pick it in the theme picker (`Ctrl+K Ctrl+T`) and leave automatic mode off.

**What are the High Contrast themes for?**
They are designed for low vision, bright environments or long coding sessions. They use maximum contrast (AAA), visible borders and a strong focus outline.

**Are holiday themes available?**
Not yet. Themes for New Year, Easter, Halloween and Christmas are planned. Follow the [project on GitHub](https://github.com/mickaellherminez/365-daynight-vscode-theme-ext) to be notified.

## Roadmap

- 🎉 Holiday themes (New Year, Easter, Halloween, Christmas)
- ⏰ Configurable day and night hours

Ideas and suggestions are welcome in the [GitHub issues](https://github.com/mickaellherminez/365-daynight-vscode-theme-ext/issues).

## Feedback and contributing

- ⭐ Enjoying the themes? A [review on the Marketplace](https://marketplace.visualstudio.com/items?itemName=mickaellherminez.365-daynight-vscode-theme-ext&ssr=false#review-details) helps other developers find them.
- 🐞 Bug, unreadable color or idea: [open an issue](https://github.com/mickaellherminez/365-daynight-vscode-theme-ext/issues).
- 🛠️ Want to contribute? See [CONTRIBUTING.md](CONTRIBUTING.md).

Release notes are in the [CHANGELOG](CHANGELOG.md).

## License

[MIT](LICENSE) © Mickaël Lherminez
