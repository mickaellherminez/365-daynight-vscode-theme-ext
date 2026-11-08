# 365 Day & Night – Monthly Accessible Themes

**Give VS Code a new look every month: 48 accessible themes that switch between day and night in one click or on their own.**

[![Visual Studio Marketplace Version](https://vsmarketplacebadges.dev/version-short/mickaellherminez.365-daynight-vscode-theme-ext.svg?subject=Marketplace&style=flat)](https://marketplace.visualstudio.com/items?itemName=mickaellherminez.365-daynight-vscode-theme-ext)
[![Installs](https://vsmarketplacebadges.dev/installs-short/mickaellherminez.365-daynight-vscode-theme-ext.svg?style=flat)](https://marketplace.visualstudio.com/items?itemName=mickaellherminez.365-daynight-vscode-theme-ext)
[![Downloads](https://vsmarketplacebadges.dev/downloads-short/mickaellherminez.365-daynight-vscode-theme-ext.svg?style=flat)](https://marketplace.visualstudio.com/items?itemName=mickaellherminez.365-daynight-vscode-theme-ext)
[![Rating](https://vsmarketplacebadges.dev/rating-short/mickaellherminez.365-daynight-vscode-theme-ext.svg?style=flat)](https://marketplace.visualstudio.com/items?itemName=mickaellherminez.365-daynight-vscode-theme-ext&ssr=false#review-details)
[![Open VSX downloads](https://img.shields.io/open-vsx/dt/mickaellherminez/365-daynight-vscode-theme-ext?label=Open%20VSX%20downloads)](https://open-vsx.org/extension/mickaellherminez/365-daynight-vscode-theme-ext)
[![CI status](https://img.shields.io/github/actions/workflow/status/mickaellherminez/365-daynight-vscode-theme-ext/ci.yml?branch=main&label=CI)](https://github.com/mickaellherminez/365-daynight-vscode-theme-ext/actions/workflows/ci.yml)
[![License: MIT](https://img.shields.io/github/license/mickaellherminez/365-daynight-vscode-theme-ext)](https://github.com/mickaellherminez/365-daynight-vscode-theme-ext/blob/main/LICENSE)

```sh
code --install-extension mickaellherminez.365-daynight-vscode-theme-ext
```

Or install it from the [Marketplace](https://marketplace.visualstudio.com/items?itemName=mickaellherminez.365-daynight-vscode-theme-ext) or [Open VSX](https://open-vsx.org/extension/mickaellherminez/365-daynight-vscode-theme-ext). Requires VS Code 1.96 or later.

*Read this page in: [Français](docs/README_fr.md) · [Español](docs/README_es.md) · [Deutsch](docs/README_de.md) · [Português](docs/README_pt.md) · [Русский](docs/README_ru.md) · [中文](docs/README_zh.md) · [日本語](docs/README_ja.md) · [हिंदी](docs/README_hi.md) · [العربية](docs/README_ar.md)*

![October Light, Dark, High Contrast and High Contrast Light themes in VS Code: explorer, tabs, syntax highlighting, text selection and status bar](https://raw.githubusercontent.com/mickaellherminez/365-daynight-vscode-theme-ext/main/assets/screenshots/hero.png)

## Why choose it

### 🗓️ A new look every month

Frost in January, young shoots in March, a lagoon in July, autumn leaves in October, a polar night in December. The whole window follows the season: editor, sidebar, tabs, terminal, status bar, chat, Git graph and merge editor.

**The proof:** 12 months with 4 themes each, Light, Dark, High Contrast and High Contrast Light, and more than 480 colors in every theme. [See them all](#the-12-months).

### 👁️ Built to stay readable

Text reaches a contrast of at least 4.5:1 (WCAG AA) in Light and Dark themes, and 7:1 (WCAG AAA) in High Contrast themes. Syntax colors, errors and Git changes stay distinct with color blindness, and comments, deprecated and invalid code also differ by italics, strikethrough or underline.

**The proof:** every theme must pass an automated audit of more than 250 checks before each release. Color blindness is checked with simulations, so feedback from real eyes is very welcome: [join the call for testers](https://github.com/mickaellherminez/365-daynight-vscode-theme-ext/issues/47).

### 🌗 Day and night, without thinking about it

Click the status bar button to switch between Light and Dark. Or let the extension follow the clock, with hours you choose, or the appearance of your system.

**The proof:** automatic mode is off by default, so your theme only changes if you ask for it. Your selected month and your manual choices are respected.

## The 12 months

![Preview of the 48 themes: a Light, Dark, High Contrast and High Contrast Light version for each month from January to December](https://raw.githubusercontent.com/mickaellherminez/365-daynight-vscode-theme-ext/main/assets/screenshots/year.png)

| Month | Mood | Month | Mood |
| --- | --- | --- | --- |
| January | Frost | July | Lagoon |
| February | Lavender mist | August | Warm sand |
| March | Young shoots | September | Grape harvest |
| April | April showers | October | Autumn leaves |
| May | Flowering meadow | November | Mist and undergrowth |
| June | Long days | December | Polar night |

The [complete guide](docs/GUIDE.md#the-12-months) lists the colors of each theme.

## How to use it

On Mac, use `Cmd` instead of `Ctrl`.

| To… | Do this |
| --- | --- |
| **Pick a theme** | Press `Ctrl+K` then `Ctrl+T`, and type **365** |
| **Switch between Light and Dark** | Click `LGT` or `DRK` in the status bar, bottom right |
| **Change the month** | Click the arrows around it: `‹ 10 DRK ›` |
| **Come back to the current month** | Run `365: Back to the current month` from the Command Palette (`Ctrl+Shift+P`) |
| **Use high contrast** | Run `365: Apply High Contrast theme` or `365: Apply High Contrast Light theme` |
| **Leave high contrast** | Run `365: Apply Light theme` or `365: Apply Dark theme` |
| **Turn on automatic mode** | Open the settings (`Ctrl+,`), search for **365DayNight** and check **Enable** |
| **Add a keyboard shortcut** | Press `Ctrl+K` then `Ctrl+S`, type **365**, double-click a command and press your keys. None is set by default |

**➡️ The [complete guide](docs/GUIDE.md) details everything:** [automatic mode and its hours](docs/GUIDE.md#automatic-day-and-night-switching), [following your system](docs/GUIDE.md#follow-your-system), [all the commands](docs/GUIDE.md#commands) and [all the settings](docs/GUIDE.md#settings).

## Accessibility

- **Readable text:** WCAG AA in Light and Dark themes, AAA in High Contrast themes.
- **Color blindness:** syntax colors and alerts are simulated for protanopia, deuteranopia and tritanopia.
- **Not color alone:** comments, parameters and attributes are in *italics*, deprecated code is ~~struck through~~, invalid code is underlined.
- **Keyboard and screen readers:** High Contrast themes have a strong focus outline, and each part of the status bar button has its own spoken label.

Something hard to read? [Tell us about it](https://github.com/mickaellherminez/365-daynight-vscode-theme-ext/issues/new/choose). [More details](docs/GUIDE.md#accessibility).

## New look in 0.13

Every theme was redesigned in version 0.13.0, and your selected theme, settings and shortcuts are kept. Prefer the previous look? [Here is how to go back](docs/GUIDE.md#new-look-and-how-to-go-back).

## FAQ

**How do I automatically switch VS Code between a light and a dark theme?**
Install the extension and set `"365DayNight.enable": true`. The Light theme is applied from 7:00 to 19:00 and the Dark theme at night. You can change these hours with `365DayNight.dayStart` and `365DayNight.nightStart`.

**Can VS Code follow the light or dark mode of my system with these themes?**
Yes. Set `"365DayNight.enable": true` and `"365DayNight.mode": "system"`. Your system decides between Light and Dark, and the extension keeps the themes on the current month.

**Is there a color blind friendly VS Code theme?**
Yes. All the themes are tested with protanopia, deuteranopia and tritanopia simulations, and comments, deprecated and invalid code also differ by italics, strikethrough or underline.

**Will the extension change my theme without asking?**
No. Automatic mode is off by default. Without it, the theme only changes when you pick one or click the status bar button. The first time you use a 365 theme, a notification offers it, and nothing changes unless you pick an option.

**Can I use only one theme, for example October Dark?**
Of course. Pick it in the theme picker (`Ctrl+K Ctrl+T`) and leave automatic mode off.

**What are the High Contrast themes for?**
They are designed for low vision, bright environments or long coding sessions. They use maximum contrast (AAA), visible borders and a strong focus outline. Each month has two: High Contrast, on a dark background, and High Contrast Light, on a light background for bright environments.

**How do I try a new version before everyone else?**
When a pre-release exists, open the extension page in the Extensions view and click **Switch to Pre-Release Version**. VS Code then installs the pre-release and its updates. To go back to the release version, click **Switch to Release Version** on the same page. Feedback on a pre-release is welcome in the [GitHub issues](https://github.com/mickaellherminez/365-daynight-vscode-theme-ext/issues). A [call for testers](https://github.com/mickaellherminez/365-daynight-vscode-theme-ext/issues/47) is open, with a short list of things to check.

## Enjoying the themes?

⭐ A [review on the Marketplace](https://marketplace.visualstudio.com/items?itemName=mickaellherminez.365-daynight-vscode-theme-ext&ssr=false#review-details) helps other developers find them.

Bug, unreadable color or idea? [Open an issue](https://github.com/mickaellherminez/365-daynight-vscode-theme-ext/issues/new/choose). Want to contribute? See [CONTRIBUTING.md](CONTRIBUTING.md). Release notes are in the [CHANGELOG](CHANGELOG.md).

[MIT](LICENSE) © Mickaël Lherminez
