# README for the "365-daynight-vscode-theme-ext" Extension

![365DayNight VSCode Themes](https://github.com/mickaellherminez/365-daynight-vscode-theme-ext/blob/main/assets/logo-web.png?raw=true)

[![License](https://img.shields.io/github/license/mickaellherminez/365-daynight-vscode-theme-ext)](https://github.com/mickaellherminez/365-daynight-vscode-theme-ext/blob/main/LICENSE)
[![Issues](https://img.shields.io/github/issues/mickaellherminez/365-daynight-vscode-theme-ext)](https://github.com/mickaellherminez/365-daynight-vscode-theme-ext/issues)
[![Pull Requests](https://img.shields.io/github/issues-pr/mickaellherminez/365-daynight-vscode-theme-ext)](https://github.com/mickaellherminez/365-daynight-vscode-theme-ext/pulls)
[![Visual Studio Marketplace Downloads](https://img.shields.io/visual-studio-marketplace/d/mickaellherminez.365-daynight-vscode-theme-ext)](https://marketplace.visualstudio.com/items?itemName=mickaellherminez.365-daynight-vscode-theme-ext)
[![Last Commit](https://img.shields.io/github/last-commit/mickaellherminez/365-daynight-vscode-theme-ext)](https://github.com/mickaellherminez/365-daynight-vscode-theme-ext/commits/main)

<!-- Badges de qualité de code -->
[![CodeFactor](https://www.codefactor.io/repository/github/mickaellherminez/365-daynight-vscode-theme-ext/badge)](https://www.codefactor.io/repository/github/mickaellherminez/365-daynight-vscode-theme-ext)

<!-- Badges de version -->
[![Visual Studio Marketplace Version](https://img.shields.io/visual-studio-marketplace/v/mickaellherminez.365-daynight-vscode-theme-ext)](https://marketplace.visualstudio.com/items?itemName=mickaellherminez.365-daynight-vscode-theme-ext)
[![GitHub release (latest by date)](https://img.shields.io/github/v/release/mickaellherminez/365-daynight-vscode-theme-ext)](https://github.com/mickaellherminez/365-daynight-vscode-theme-ext/releases)

<!-- Badges de statut -->
[![Maintenance](https://img.shields.io/badge/Maintained%3F-yes-green.svg)](https://github.com/mickaellherminez/365-daynight-vscode-theme-ext/graphs/commit-activity)

<!-- Badges de stats -->
[![GitHub stars](https://img.shields.io/github/stars/mickaellherminez/365-daynight-vscode-theme-ext)](https://github.com/mickaellherminez/365-daynight-vscode-theme-ext/stargazers)
[![GitHub forks](https://img.shields.io/github/forks/mickaellherminez/365-daynight-vscode-theme-ext)](https://github.com/mickaellherminez/365-daynight-vscode-theme-ext/network/members)

*Read this document in other languages: [Français](docs/README_fr.md), [中文](docs/README_zh.md), [हिंदी](docs/README_hi.md), [Deutsch](docs/README_de.md), [Русский](docs/README_ru.md), [Português](docs/README_pt.md), [日本語](docs/README_ja.md), [Español](docs/README_es.md), [العربية](docs/README_ar.md).*

## Introduction

Welcome to the README page for the "365-daynight-vscode-theme-ext" extension for VSCode.

## Overview

365DayNight VSCode Themes is an extension designed to enhance your coding experience throughout the year with dynamic and visually appealing themes. It is crafted to minimize eye strain and optimize readability by adapting your VSCode theme according to natural or artificial light, providing an uninterrupted coding experience 24/7.

## Features

- **Monthly Theme Collection**: Twelve monthly sets of three themes (Light, Dark and High Contrast), named `365 01-January Light`, `365 01-January Dark`, `365 01-January High Contrast`, etc.
- **Day and Night Themes**: A Light theme tailored for natural light during the day and a Dark theme for artificial light at night.
- **Automatic Theme Switching**: When enabled, applies the theme of the current month and switches between Light (7:00–19:00) and Dark according to the time of day.
- **Quick Theme Toggle**: Dedicated status bar button to quickly switch between Light, Dark and High Contrast themes with a single click.
- **Accessibility**: Enhanced accessibility features, especially for users with color blindness.
- **Special Holiday Themes** *(coming soon)*: Unique themes for festive periods like New Year, Easter, Halloween, and Christmas.

## Extension Settings

- `365DayNight.enable`: Enable or disable automatic theme switching (default: `false`).
- `365DayNight.mode`: Set the mode to `day`, `night`, or `auto` for automatic switching according to the time of day (default: `auto`).

When automatic switching is enabled, a theme chosen manually is kept until the next change of period (day/night or month). A High Contrast theme is never replaced by a Light or Dark theme: only its month is updated.

## Commands

- `365: Toggle between Light, Dark and High Contrast themes` (also available from the status bar button)
- `365: Apply Light theme`
- `365: Apply Dark theme`
- `365: Apply High Contrast theme`

## Accessibility

We prioritize accessibility and have optimized the extension to be more inclusive, particularly for individuals with color vision deficiencies. We welcome any suggestions or ideas for further improvements.

## Installation

To install the extension, visit the [Visual Studio Marketplace](https://marketplace.visualstudio.com/items?itemName=mickaellherminez.365-daynight-vscode-theme-ext) and click "Install".

## Release Notes

For detailed information on each version, please refer to the [CHANGELOG](CHANGELOG.md).

## Packaging

Use the command `npm run package` (or `vsce package`) to create the `.vsix` file. See [Publishing Extensions](https://code.visualstudio.com/api/working-with-extensions/publishing-extension) for more details.

## Backlog and Future Updates

> ⚠️ Note: This section presents planned features and improvements for upcoming versions.

### Next Developments

- [x] #1 🔗 Update Image URL in README_fr.md
- [ ] #2 📝 Update all README_* files to align with README.md
- [ ] 🎉 Special holiday themes (New Year, Easter, Halloween, Christmas)

### Configuration and Testing
- [ ] #3 🧪 Set up unit tests
- [ ] #4 ⚙️ Prettier configuration
- [x] #5 🔍 ESLint configuration

### CI/CD Pipeline
- [ ] #6 📦 Create automatic deployment pipeline (GitHub + Marketplace)

> 💡 Follow our progress or contribute via our [GitHub Issues page](https://github.com/mickaellherminez/365-daynight-vscode-theme-ext/issues)

## Developer Guide

### Project Structure
* `package.json` - Manifest file that defines the extension, its commands and configurations.
* `extension.js` - Main file containing the implementation of the extension's functionality.
* `themes/` - Directory containing all theme files.
* `scripts/themes/` - Theme generator and accessibility audit (WCAG contrast, color blindness simulation). See [scripts/themes/README.md](scripts/themes/README.md).

### Theme Accessibility
* Run `npm run themes:audit` to check the contrast and color-blind distinctness of all themes (Python 3.8+ required).
* Run `npm run themes:build -- 10 --write` to regenerate the October themes from `scripts/themes/palettes/10.json`.

### Development
* Press `F5` to open a new VS Code window with your extension loaded.
* You can reload the extension after making changes using `Ctrl+R` (or `Cmd+R` on Mac).
* Set breakpoints in `extension.js` to debug your extension.
* Check your extension's output in the debug console.

### Testing
* Run `npm test` to lint the code and run the tests in a downloaded VS Code instance.
* Tests are located in the `test/suite/` folder.

### API Exploration
* To explore the complete VS Code API, open the file `node_modules/@types/vscode/index.d.ts`.

### Additional Resources
* [Follow UX Guidelines](https://code.visualstudio.com/api/ux-guidelines/overview) to create extensions that seamlessly integrate with VS Code's native interface.
* [Configure Continuous Integration](https://code.visualstudio.com/api/working-with-extensions/continuous-integration) to automate builds.


## Conclusion

Enjoy the flexibility and dynamics of the 365DayNight extension for an enriching coding experience!

**Have fun with 365DayNight VSCode Themes!**
