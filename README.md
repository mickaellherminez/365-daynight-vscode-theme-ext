# 365 Day & Night Themes – Accessible VS Code Themes for Every Month

**48 color themes for Visual Studio Code: a Light, a Dark, a High Contrast and a High Contrast Light theme for each month of the year.** Switch between day and night in one click, or let the extension do it for you. Every theme is tested for readability (WCAG contrast) and for color blindness.

[![Visual Studio Marketplace Version](https://img.shields.io/visual-studio-marketplace/v/mickaellherminez.365-daynight-vscode-theme-ext?label=Marketplace)](https://marketplace.visualstudio.com/items?itemName=mickaellherminez.365-daynight-vscode-theme-ext)
[![Installs](https://img.shields.io/visual-studio-marketplace/i/mickaellherminez.365-daynight-vscode-theme-ext)](https://marketplace.visualstudio.com/items?itemName=mickaellherminez.365-daynight-vscode-theme-ext)
[![Rating](https://img.shields.io/visual-studio-marketplace/r/mickaellherminez.365-daynight-vscode-theme-ext)](https://marketplace.visualstudio.com/items?itemName=mickaellherminez.365-daynight-vscode-theme-ext&ssr=false#review-details)
[![License: MIT](https://img.shields.io/github/license/mickaellherminez/365-daynight-vscode-theme-ext)](https://github.com/mickaellherminez/365-daynight-vscode-theme-ext/blob/main/LICENSE)

*Read this page in: [Français](docs/README_fr.md) · [Español](docs/README_es.md) · [Deutsch](docs/README_de.md) · [Português](docs/README_pt.md) · [Русский](docs/README_ru.md) · [中文](docs/README_zh.md) · [日本語](docs/README_ja.md) · [हिंदी](docs/README_hi.md) · [العربية](docs/README_ar.md)*

![October Light, Dark and High Contrast themes in VS Code: explorer, tabs, syntax highlighting, text selection and status bar](https://raw.githubusercontent.com/mickaellherminez/365-daynight-vscode-theme-ext/main/assets/screenshots/hero.png)

## Why you'll like it

- 🗓️ **A new look every month.** Frost in January, young shoots in March, a lagoon in July, autumn leaves in October, a polar night in December. The whole window follows the seasons, not just the editor.
- ☀️🌙 **Day and night, always matched.** Each month has a Light theme for daylight, a Dark theme for the evening, and two High Contrast themes, dark and light, when you need maximum readability.
- 🔁 **One-click switch.** A button in the status bar switches between Light and Dark. High Contrast is one command away.
- ⏰ **Optional automatic mode.** The extension can apply the current month's theme by itself, Light during the day and Dark at night.
- 👁️ **Easy on the eyes, readable for everyone.** All text meets WCAG contrast levels, and syntax colors stay distinct for people with color blindness.
- 🖥️ **Carefully styled.** The editor, sidebar, tabs, terminal, debug console, notifications and status bar are all styled, with more than 480 colors in each theme. The chat, test results, symbol icons, Git graph, merge editor and multi-diff follow the month's palette too.

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
2. Type **365** to see all the themes, for example `365 10-October Dark`.
3. Pick one. That's it!

The first time you use a 365 theme, a notification offers automatic switching: **Follow the clock** (Light by day, Dark at night), **Follow my system** (the light and dark mode of your system) or **No thanks**. Nothing changes unless you choose, and the question is asked only once. After a choice, a message confirms what is on, with an **Open Settings** button to change the hours or turn it off. To change your mind later, see the automatic switching section below.

Use the **status bar button** (bottom right: `LGT`, `DRK`, `HCT` or `HCL`) to switch between the Light and Dark versions of the current month. For High Contrast, run `365: Apply High Contrast theme` from the Command Palette. In a High Contrast theme, the button switches between High Contrast (`HCT`) and High Contrast Light (`HCL`), so that a click never leaves high contrast. To leave high contrast, run `365: Apply Light theme` or `365: Apply Dark theme`. You can also hover over the button and click its **Light** or **Dark** link.

To try another month, click the arrows around it (`‹ 10 DRK ›`). The number is the month, from `01` to `12`, and the arrows keep the variant: Light, Dark, High Contrast or High Contrast Light. December is followed by January. To come back, run `365: Back to the current month` from the Command Palette. The arrows and the number only appear with a 365 theme. Hover over the button to see the full theme name, with links to High Contrast, to High Contrast Light and to the current month. In a high contrast theme, the tooltip links to Light and Dark instead.

## The 12 months

![Preview of the 36 themes: a Light, Dark and High Contrast version for each month from January to December](https://raw.githubusercontent.com/mickaellherminez/365-daynight-vscode-theme-ext/main/assets/screenshots/year.png)

| Month | Mood | Light | Dark | High Contrast | High Contrast Light |
| --- | --- | --- | --- | --- | --- |
| January | Frost | Glacier blue and deep blue | Deep winter blue and icy blue | Blue-black and ice blue | Ice white and navy |
| February | Lavender mist | Pale lavender and violet | Gray-violet night and lilac | Violet-black and pale lilac | Lavender white and plum |
| March | Young shoots | Tender green and bud green | Olive night and bud green | Olive-black and bright green | Pale green and forest green |
| April | April showers | Rainy sky and cherry blossom pink | Rainy slate and cherry blossom pink | Blue-black and cherry blossom pink | Pale sky and deep pink |
| May | Flowering meadow | Meadow green and olive gold | Deep green night and buttercup yellow | Green-black and pale gold | Pale green and dark bronze |
| June | Long days | Clear sky and summer blue | Petrol blue night and periwinkle | Black and periwinkle | Sky white and royal blue |
| July | Lagoon | Turquoise water and coral | Deep lagoon and coral | Teal-black and pale coral | Pale turquoise and red coral |
| August | Warm sand | Golden sand and caramel | Brown night and amber | Brown-black and amber | Warm white and dark amber |
| September | Grape harvest | Pale pink and plum | Wine-red night and plum | Wine-black and orchid | Pale pink and deep plum |
| October | Autumn leaves | Peach and russet | Warm brown night and russet | Brown-black and salmon | Peach white and deep russet |
| November | Mist and undergrowth | Misty taupe and moss green | Undergrowth gray and moss green | Warm black and moss green | Cream and dark moss |
| December | Polar night | Icy lavender and aurora teal | Midnight blue and aurora cyan | Blue-black and aurora cyan | Lavender white and dark teal |

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
| `auto` | Light theme from 7:00 to 19:00 by default, Dark theme the rest of the time. You can change these hours (see below) |
| `day` | Always the Light theme of the current month |
| `night` | Always the Dark theme of the current month |
| `system` | Follows the light, dark and high contrast appearance of your system (see below) |

The extension also moves to the next month's theme on the first day of each month.

Good to know:
- **It's opt-in.** Automatic mode is off by default, so the extension never changes your theme unless you ask it to. The first time you use a 365 theme, a notification asks you once whether you want it.
- **Your choice wins.** If you pick a theme by hand, it stays until the next change of period (day to night, or a new month).
- **Your month stays too.** If you pick another month, with the arrows or the theme picker, automatic mode keeps alternating Light and Dark on that month until the next real month begins, even after a restart. To come back sooner, run `365: Back to the current month`.
- **High Contrast stays High Contrast.** If you use a High Contrast or High Contrast Light theme, automatic mode only updates the month, never the variant.

### Choose your hours

By default, the Light theme starts at 7:00 and the Dark theme at 19:00. To change these hours:

1. Open the settings (`Ctrl+,` or `Cmd+,`) and search for **365DayNight**.
2. Set **365DayNight: Day Start** and **365DayNight: Night Start**, in the HH:MM format on a 24-hour clock.

Or add this to your `settings.json`:

```json
{
  "365DayNight.dayStart": "08:30",
  "365DayNight.nightStart": "20:00"
}
```

- **Applied quickly.** A new time applies about 2 seconds after you stop typing, even if you picked a theme by hand. Then the theme changes at the minute you chose.
- **Past midnight.** If the day starts after the night, for example `"20:00"` and `"06:00"`, the Light theme runs past midnight. Handy if you work at night.
- **Invalid values.** A time that cannot be read, such as `"25:00"` or `"7h"`, is replaced by its default value, and a warning tells you once. Two identical times give 7:00 and 19:00.
- **Only in `auto` mode.** The `day`, `night` and `system` modes ignore these hours.
- **Back to 7:00 and 19:00.** In the settings, click the gear icon next to each time and choose **Reset Setting**, or remove both lines from your `settings.json`.

### Follow your system

Prefer to follow the appearance of your system rather than the clock? Use the `system` mode:

1. Open the settings (`Ctrl+,` or `Cmd+,`) and search for **365DayNight**.
2. Check **365DayNight: Enable**.
3. Set **365DayNight: Mode** to `system`.

Or add this to your `settings.json`:

```json
{
  "365DayNight.enable": true,
  "365DayNight.mode": "system"
}
```

| Your system uses | Theme applied |
| --- | --- |
| Light appearance | Light theme of the month |
| Dark appearance | Dark theme of the month |
| High contrast, with a dark appearance | High Contrast theme of the month |
| High contrast, with a light appearance | High Contrast Light theme of the month |

Using the button in this mode:
- **Arrows.** `‹` and `›` change the month of all the variants. That month stays until the next real month begins, even after a restart. To come back sooner, run `365: Back to the current month`.
- **Center button.** Your system decides between Light and Dark, so a click only explains this. The `365: Apply Light theme`, `365: Apply Dark theme`, `365: Apply High Contrast theme` and `365: Apply High Contrast Light theme` commands say the same and change nothing.
- **Theme picker.** Picking a 365 theme applies its month to all the variants. Picking a theme from another publisher replaces only the variant in use: it stays during the following months, and the button shows no arrows and no month with it. Click the center button to get the 365 theme back.

Good to know:
- **What it changes.** The mode turns on `window.autoDetectColorScheme` and writes the themes of the month in `workbench.preferredLightColorTheme`, `workbench.preferredDarkColorTheme`, `workbench.preferredHighContrastColorTheme` and `workbench.preferredHighContrastLightColorTheme`. `workbench.colorTheme` does not change.
- **How to go back.** Uncheck **365DayNight: Enable**, or choose another mode. Your original settings come back, and settings that did not exist are removed again. A setting you changed in the meantime keeps your value.
- **Before uninstalling or disabling the extension.** Leave this mode first, because an extension can no longer restore anything afterwards. If you forgot, remove the five settings above from your `settings.json`.
- **High contrast.** VS Code gives priority to the high contrast of your system. To ignore it, turn off `window.autoDetectHighContrast`: the mode never changes this setting.
- **Turning the detection off.** If you turn off `window.autoDetectColorScheme` yourself, the extension leaves it off and the button works as usual. A theme setting in a workspace still wins in that workspace.
- **Operating systems.** According to the VS Code documentation, the light and dark appearance is detected on Windows and macOS.

## Accessibility first

Every theme passes an automated accessibility audit of more than 250 checks:

- **Readable text:** editor text and syntax colors reach a contrast ratio of at least **4.5:1 (WCAG AA)** in Light and Dark themes, and **7:1 (WCAG AAA)** in High Contrast themes.
- **Color blind friendly:** syntax colors (keywords, functions, strings, numbers, classes, comments) and alerts (errors, warnings, Git changes) are simulated for **protanopia, deuteranopia and tritanopia** to make sure they stay distinct.
- **Not color alone:** comments, parameters and attributes are in *italics*, deprecated code is ~~struck through~~, invalid code is underlined.
- **Visible selection everywhere:** text selection is clearly visible in the editor, the terminal and the debug console, and never confused with search results.
- **High Contrast themes:** selected text turns black on light blue (white on dark blue in High Contrast Light), and all panels have visible borders and a strong keyboard focus outline.
- **Screen readers:** each part of the status bar button has its own spoken label, such as "Next month: November".

Found something hard to read? Please [open an issue](https://github.com/mickaellherminez/365-daynight-vscode-theme-ext/issues). Accessibility feedback is always welcome.

## Commands

Open the Command Palette (`Ctrl+Shift+P` or `Cmd+Shift+P`) and type **365**:

| Command | Action |
| --- | --- |
| `365: Toggle between Light and Dark themes` | Switches between Light and Dark (same as the status bar button) |
| `365: Apply Light theme` | Applies the Light theme of the displayed month |
| `365: Apply Dark theme` | Applies the Dark theme of the displayed month |
| `365: Apply High Contrast theme` | Applies the High Contrast theme of the displayed month |
| `365: Apply High Contrast Light theme` | Applies the High Contrast Light theme of the displayed month |
| `365: Next month` | Applies the next month's theme, in the same variant |
| `365: Previous month` | Applies the previous month's theme, in the same variant |
| `365: Back to the current month` | Applies the theme of the real current month, in the same variant |

The extension defines no keyboard shortcut by default. To assign your own, open the shortcuts list (`Ctrl+K Ctrl+S`, or `Cmd+K Cmd+S` on Mac), type **365**, double-click a command and press your keys.

## Settings

| Setting | Default | Description |
| --- | --- | --- |
| `365DayNight.enable` | `false` | Automatically apply the theme of the current month |
| `365DayNight.mode` | `auto` | `auto` (by time of day), `day` (always Light), `night` (always Dark) or `system` (follows your system) |
| `365DayNight.dayStart` | `"07:00"` | Time when the Light theme starts in `auto` mode, in the HH:MM format |
| `365DayNight.nightStart` | `"19:00"` | Time when the Dark theme starts in `auto` mode, in the HH:MM format |
| `365DayNight.toggleIncludesHighContrast` | `false` | The status bar button goes through all the variants: Light, Dark, High Contrast, then High Contrast Light |

## FAQ

**How do I automatically switch VS Code between a light and a dark theme?**
Install the extension and set `"365DayNight.enable": true`. The Light theme is applied from 7:00 to 19:00 and the Dark theme at night. You can change these hours with `365DayNight.dayStart` and `365DayNight.nightStart`.

**Can VS Code follow the light or dark mode of my system with these themes?**
Yes. Set `"365DayNight.enable": true` and `"365DayNight.mode": "system"`. Your system decides between Light and Dark, and the extension keeps the themes on the current month.

**Is there a color blind friendly VS Code theme?**
Yes. All the themes are tested with protanopia, deuteranopia and tritanopia simulations, and they use italics, underline and strikethrough so that information never relies on color alone.

**Will the extension change my theme without asking?**
No. Automatic mode is off by default. Without it, the theme only changes when you pick one or click the status bar button. The first time you use a 365 theme, a notification offers it, and nothing changes unless you pick an option.

**Can I use only one theme, for example October Dark?**
Of course. Pick it in the theme picker (`Ctrl+K Ctrl+T`) and leave automatic mode off.

**What are the High Contrast themes for?**
They are designed for low vision, bright environments or long coding sessions. They use maximum contrast (AAA), visible borders and a strong focus outline. Each month has two: High Contrast, on a dark background, and High Contrast Light, on a light background for bright environments.

## Roadmap

Ideas and suggestions are welcome in the [GitHub issues](https://github.com/mickaellherminez/365-daynight-vscode-theme-ext/issues).

## Feedback and contributing

- ⭐ Enjoying the themes? A [review on the Marketplace](https://marketplace.visualstudio.com/items?itemName=mickaellherminez.365-daynight-vscode-theme-ext&ssr=false#review-details) helps other developers find them.
- 🐞 Bug, unreadable color or idea: [open an issue](https://github.com/mickaellherminez/365-daynight-vscode-theme-ext/issues).
- 🛠️ Want to contribute? See [CONTRIBUTING.md](CONTRIBUTING.md).

Release notes are in the [CHANGELOG](CHANGELOG.md).

## License

[MIT](LICENSE) © Mickaël Lherminez
