# README for the "365-daynight-vscode-theme-ext" Extension

![365DayNight VSCode Themes](https://github.com/mickaellherminez/365-daynight-vscode-theme-ext/blob/main/assets/logo-web.png?raw=true)

[![License](https://img.shields.io/github/license/mickaellherminez/365-daynight-vscode-theme-ext)](https://github.com/mickaellherminez/365-daynight-vscode-theme-ext/blob/main/LICENSE)
[![Issues](https://img.shields.io/github/issues/mickaellherminez/365-daynight-vscode-theme-ext)](https://github.com/mickaellherminez/365-daynight-vscode-theme-ext/issues)
[![Pull Requests](https://img.shields.io/github/issues-pr/mickaellherminez/365-daynight-vscode-theme-ext)](https://github.com/mickaellherminez/365-daynight-vscode-theme-ext/pulls)
[![Visual Studio Marketplace Downloads](https://img.shields.io/visual-studio-marketplace/d/mickaellherminez.365-daynight-vscode-theme-ext)](https://marketplace.visualstudio.com/items?itemName=mickaellherminez.365-daynight-vscode-theme-ext)
[![Last Commit](https://img.shields.io/github/last-commit/mickaellherminez/365-daynight-vscode-theme-ext)](https://github.com/mickaellherminez/365-daynight-vscode-theme-ext/commits/main)

<!-- Badges de qualité de code -->
[![CodeFactor](https://www.codefactor.io/repository/github/mickaellherminez/365-daynight-vscode-theme-ext/badge)](https://www.codefactor.io/repository/github/mickaellherminez/365-daynight-vscode-theme-ext)
[![codecov](https://codecov.io/gh/mickaellherminez/365-daynight-vscode-theme-ext/branch/main/graph/badge.svg)](https://codecov.io/gh/mickaellherminez/365-daynight-vscode-theme-ext)

<!-- Badges de version -->
[![npm version](https://badge.fury.io/js/mickaellherminez.365-daynight-vscode-theme-ext.svg)](https://badge.fury.io/js/mickaellherminez.365-daynight-vscode-theme-ext)
[![GitHub release (latest by date)](https://img.shields.io/github/v/release/mickaellherminez/365-daynight-vscode-theme-ext)](https://github.com/mickaellherminez/365-daynight-vscode-theme-ext/releases)

<!-- Badges de statut -->
![GitHub Workflow Status](https://img.shields.io/github/actions/workflow/status/mickaellherminez/365-daynight-vscode-theme-ext/main.yml)
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

- **Monthly Theme Collection**: Twelve unique theme pairs, one for each month of the year
- **Day and Night Themes**: Two themes tailored for natural light during the day and artificial light at night.
- **Special Holiday Themes**: Unique themes for festive periods like New Year, Easter, Halloween, and Christmas.
- **Automatic Theme Switching**: Seamlessly adapts your theme based on the time of day.
- **Quick Theme Toggle**: Dedicated status bar button to quickly switch between day, night and high contrast themes with a single click.
- **Accessibility**: Enhanced accessibility features, especially for users with color blindness.

## Extension Settings

- `365DayNight.enable`: Enable or disable the extension.
- `365DayNight.mode`: Set the mode to `day`, `night`, or `auto` for automatic switching.

## Accessibility

We prioritize accessibility and have optimized the extension to be more inclusive, particularly for individuals with color vision deficiencies. We welcome any suggestions or ideas for further improvements.

## Installation

To install the extension, visit the [Visual Studio Marketplace](https://marketplace.visualstudio.com/items?itemName=mickaellherminez.365-daynight-vscode-theme-ext) and click "Install".

## Release Notes

For detailed information on each version, please refer to the [CHANGELOG](CHANGELOG.md).

## Packaging

Use the command `vsce package` to create the [.vsix](https://learn.microsoft.com/fr-fr/visualstudio/extensibility/walkthrough-publishing-a-visual-studio-extension-via-command-line?view=vs-2022) file.

## Additional Resources

For more information on using Markdown in Visual Studio Code, see the following links:

- [Visual Studio Code Markdown Support](http://code.visualstudio.com/docs/languages/markdown)
- [Markdown Syntax Reference](https://help.github.com/articles/markdown-basics/)

## Backlog and Future Updates

> ⚠️ Note: This section presents planned features and improvements for upcoming versions.

### Next Developments

- [ ] #1 🔗 Update Image URL in README_fr.md
- [ ] #2 📝 Update all README_* files to align with README.md

### Configuration and Testing
- [ ] #3 🧪 Set up unit tests
- [ ] #4 ⚙️ Prettier configuration
- [ ] #5 🔍 ESLint configuration (to evaluate)

### CI/CD Pipeline
- [ ] #6 📦 Create automatic deployment pipeline (GitHub + Marketplace)

> 💡 Follow our progress or contribute via our [GitHub Issues page](https://github.com/mickaellherminez/365-daynight-vscode-theme-ext/issues)

## Developer Guide

### Project Structure
* `package.json` - Manifest file that defines the extension, its commands and configurations.
* `extension.js` - Main file containing the implementation of the extension's functionality.
* `themes/` - Directory containing all theme files.

### Development
* Press `F5` to open a new VS Code window with your extension loaded.
* You can reload the extension after making changes using `Ctrl+R` (or `Cmd+R` on Mac).
* Set breakpoints in `extension.js` to debug your extension.
* Check your extension's output in the debug console.

### Testing
* Open the debug view (`Ctrl+Shift+D` or `Cmd+Shift+D` on Mac) and select `Extension Tests` from the launch configuration dropdown.
* Press `F5` to run the tests in a new window with your extension loaded.
* Tests are located in the `test/suite/` folder.

### API Exploration
* To explore the complete VS Code API, open the file `node_modules/@types/vscode/index.d.ts`.

### Additional Resources
* [Follow UX Guidelines](https://code.visualstudio.com/api/ux-guidelines/overview) to create extensions that seamlessly integrate with VS Code's native interface.
* [Configure Continuous Integration](https://code.visualstudio.com/api/working-with-extensions/continuous-integration) to automate builds.


## Conclusion

Enjoy the flexibility and dynamics of the 365DayNight extension for an enriching coding experience!

**Have fun with 365DayNight VSCode Themes!**