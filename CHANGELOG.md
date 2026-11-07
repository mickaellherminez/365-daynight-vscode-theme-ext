# Changelog

All notable changes to the "365-daynight-vscode-theme-ext" extension will be documented in this file.

The format is based on [Keep a Changelog](http://keepachangelog.com/), and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Added
- A first High Contrast Light theme, `365 10-October High Contrast Light`, as a trial before the other months: dark text on a light background, at least 7:1 (AAA). The status bar button shows `HCL` for it
- `365: Apply High Contrast Light theme` command, and a High Contrast Light link in the status bar tooltip for a month that has this theme. A month without it gets its High Contrast theme, and a message says so
- In `system` mode, `workbench.preferredHighContrastLightColorTheme` now gets the High Contrast Light theme of the month, when the month has one. In the other months, it keeps or gets back your value

### Changed
- In a High Contrast theme, the status bar button now switches between High Contrast and High Contrast Light, so that a click never leaves high contrast. A month without High Contrast Light still goes to Light. With `365DayNight.toggleIncludesHighContrast`, the button goes through the four variants
- The month arrows and automatic mode keep High Contrast Light, and use High Contrast in a month that does not have it yet
- December Dark: the selected file in the explorer is a little darker, so that a deleted file stays readable when selected
- A theme change that fails is also written to the log, which stays after the error notification closes: **Help > Toggle Developer Tools > Console**, lines starting with `365DayNight:`
- The chat, test results, symbol icons, Git graph, merge editor and multi-diff now use the month's palette instead of VS Code's fixed colors, which were sometimes hard to read, such as the yellow lines of the Git graph on Light themes. Each theme now defines more than 480 colors, and the accessibility audit checks these surfaces too

### Fixed
- In `system` mode, a month arrow could sometimes do nothing right after the mode was turned on, with an error in the log: the backup of the original settings could lose its values. It now stays complete, and a damaged backup is rebuilt from the current settings

## [0.12.0] - 2026-11-06

### Added
- The first time you use a 365 theme, a notification offers automatic switching once: follow the clock, follow your system, or no thanks. Nothing changes unless you choose
- `365DayNight.dayStart` and `365DayNight.nightStart` settings: choose when the Light and Dark themes start in `auto` mode, in the HH:MM format (7:00 and 19:00 by default). A day that starts after the night runs past midnight, and an invalid time falls back to its default with a warning
- `system` value for `365DayNight.mode`: follow the light, dark and high contrast appearance of your system with the themes of the month. The original settings come back when leaving the mode, except those you changed in the meantime
- The status bar button now uses a color of the month, so that its three parts read as one control. It stays readable in every theme, and takes the normal color while debugging
- Status bar tooltip with the full theme name, what a click does, and links to High Contrast and to the current month
- Screen reader labels on the three parts of the status bar button
- Automatic mode keeps a month you picked, with the arrows or the theme picker, until the next real month begins, even after a restart. Light and Dark keep alternating on that month
- Month arrows in the status bar (`‹ 10 DRK ›`): browse the 12 months while keeping Light, Dark or High Contrast. The number shows the month, from `01` to `12`
- `365: Next month`, `365: Previous month` and `365: Back to the current month` commands, to use from the keyboard
- `365DayNight.toggleIncludesHighContrast` setting: also include High Contrast when switching with the status bar button

### Changed
- When VS Code follows the system, the status bar button now shows the month of the theme really in use, read from the preferred theme settings
- The `365: Apply Light theme`, `365: Apply Dark theme` and `365: Apply High Contrast theme` commands now keep the displayed month
- The status bar button no longer shows an icon, to save space
- The status bar button now switches between Light and Dark in one click. High Contrast is available with the `365: Apply High Contrast theme` command, or with the new setting

### Fixed
- With several windows open, windows that want different themes, because of other workspace settings for example, no longer take turns applying them: each window applies its theme at its own next change of period
- With the high contrast of a light system, the status bar button no longer shows a month that is not active, and a 365 High Contrast theme that VS Code ignores is now reported

## [0.11.2] - 2026-11-05

### Changed
- README: the description of the UI colors now matches what the themes cover

### Fixed
- The status bar button now shows the real type of the active theme: dark themes whose name does not contain "Dark", such as Monokai or Dracula, were shown as `LGT`
- From a theme of another publisher, the first click on the status bar button now applies the 365 theme of the same type
- The status bar button only changes once the theme change has succeeded, and clicking quickly no longer shows an outdated state
- Automatic mode tries again at its next check after a failed theme change
- When a workspace sets its own theme, the commands now say so instead of announcing a change that did not happen
- When VS Code follows the system color mode (`window.autoDetectColorScheme`) or high contrast (`window.autoDetectHighContrast`), the commands now say so instead of announcing a change that did not happen
- Automatic mode no longer replaces a theme picked by hand when a new window opens or VS Code restarts: your choice stays until the next change of period, as documented

### Removed
- "365 Themes" menu in the right-click menu of the editor and in the title bars of views: use the status bar button or the Command Palette instead
- "Theme changed" notification: the change is visible on screen, and errors are still reported
- Holiday themes are no longer planned: the collection stays at 12 months

## [0.11.1] - 2026-10-21

### Changed
- New README in 10 languages: installation, getting started, gallery of the 12 months, automatic mode, accessibility, commands, settings and FAQ
- Preview images of the themes in the README
- More accurate Marketplace description and search keywords

### Added
- CONTRIBUTING.md with the developer guide

## [0.11.0] - 2026-10-21

### Changed
- The 33 remaining themes (Light, Dark and High Contrast for every month except October, redesigned in 0.10.0) regenerated from accessible palettes, keeping each month's identity:
  - January: snow white and winter blue; navy night lit with gold; black and bright blue High Contrast
  - February: white and green with a Valentine's red touch; Nordic slate and frost; navy and gold High Contrast
  - March: cream and spring green; indigo night; dark teal and red-orange High Contrast
  - April: cream and Easter orange; bluish slate and gold; deep blue and gold High Contrast
  - May: bright white and orange; ocean night with orange; navy and sky blue High Contrast
  - June: sky blue and indigo ink; blue night lit with orange; black and coral High Contrast
  - July: full sun (cream, brown, orange); Solarized-inspired summer night; navy, orange and gold High Contrast
  - August: warm cream and indigo ink; slate night with yellow; black and neon green High Contrast
  - September: back-to-school sky and navy ink; slate and teal; black and bright orange High Contrast
  - November: misty slate and steel blue, with rust and gold; black and gold High Contrast
  - December: frost and teal by day, fireside slate and ember by night; winter night and icy cyan High Contrast
- All 36 themes now define all UI colors (terminal, panel, sidebar, status bar, tabs, notifications...) instead of falling back to VS Code defaults
- Blue text selection in the editor, terminal and debug console, clearly distinct from find matches and the current line
- Syntax colors meet WCAG AA (Light, Dark) and AAA (High Contrast) and stay distinguishable with protanopia, deuteranopia and tritanopia
- Integration tests now run on the latest stable VS Code

### Removed
- Unused `themes/exemple-conf.json`

### Security
- Development dependencies updated (mocha 12, @vscode/test-electron 3): 0 known vulnerabilities
- TLS certificate verification is no longer disabled when running the tests

## [0.10.0] - 2026-10-20

### Added
- Theme generator and accessibility audit in `scripts/themes/` (`npm run themes:audit`, `npm run themes:build`)
- Automatic theme switching with the `365DayNight.enable` and `365DayNight.mode` settings (`auto`, `day`, `night`), as documented in the README
- The status bar button now stays in sync when the theme is changed from the theme picker or `settings.json`

### Changed
- October themes (Light, Dark, High Contrast) redesigned for accessibility:
  - Light and High Contrast were missing ~240 UI colors (terminal, panel, sidebar, status bar, tabs, notifications...), which fell back to VS Code defaults
  - Blue text selection in the editor, terminal and debug console, clearly distinct from find matches (orange) and the current line
  - High Contrast: selected text is black on light blue in the editor and terminal
  - Syntax colors meet WCAG AA (Light, Dark) and AAA (High Contrast) and stay distinguishable with protanopia, deuteranopia and tritanopia
  - Italic, bold, underline and strikethrough complement colors (parameters, comments, deprecated code...)
- Theme `name` fields aligned with their labels in `package.json` (several themes had the wrong month or type, e.g. "High Contrast March Dark Theme" for May and June)
- Command titles translated to English and grouped under the `365` category
- Simplified ESLint configuration (no more dependency on the undeclared `@eslint/eslintrc` package)
- README files updated: removed broken badges and links, documented commands and settings, holiday themes marked as coming soon

### Fixed
- High Contrast themes whose name contains "Dark" (e.g. "Dark High Contrast") were detected as Dark themes
- Invalid color `#DAAEOA` in `365-05-hc-dark-theme.json`
- Duplicate color keys in the February, March, April and May themes
- `_accessibilityNote` placed inside `colors` in `365-05-light-theme.json`
- Broken logo in `docs/README_fr.md`
- `npm install` no longer runs the whole test suite (deprecated `prepublish` script replaced by `vscode:prepublish`)

### Removed
- Large source images (`logo-web-full.png`, `logo-web-tshirt.png`) and `themes/exemple-conf.json` excluded from the `.vsix` package (~52 MB less)
- Unused `@typescript-eslint/*` dependencies and the invalid `exports` field in `package.json`
- `NODE_TLS_REJECT_UNAUTHORIZED=0` from the npm scripts (TLS certificate verification was disabled during tests and publishing)

## [0.9.7] - 2025-05-27

### Added
- New commands `extension.setLightTheme`, `extension.setDarkTheme` and `extension.setHighContrastTheme`
- "365 Themes" submenu in the editor context menu and view title bars

### Changed
- Publisher id set to `mickaellherminez`

## [0.9.6] - 2025-05-10

### Added
- New quick toggle button for day/night/high contrast in the status bar:
  - Allows manual switching between day, night and high contrast themes with a single click
  - Displays day, night or high contrast icon based on active mode
  - Improves accessibility by enabling quick theme changes without menu navigation
  - New `extension.toggleTheme` command available in command palette
  - Full support for customizable keyboard shortcuts
  - Shows confirmation message when theme changes

## [0.9.5] - 2025-05-10

### Changed
- Enhanced accessibility and comprehensiveness for themes:  
  - `365-12-dark-theme.json`, `365-12-hc-dark-theme.json`, `365-12-light-theme.json`:  
    - Added all advanced tokens (TOML, INI, XML, JSX/TSX, Python, Rust, Go, C/C++, Java, annotations, special symbols, tags, etc.)  
    - Enriched semantic colors for all types, statuses, entities, structures, etc.  
    - Added scopes for statuses (error, success, info, warning) with strong visual styling (bold, underline) to ensure no reliance on color alone  
    - Updated and compliant `_accessibilityNote` documentation  
    - Optimized contrasts (AA/AAA), colorblind support, visible keyboard focus, and consistent palette across all variants  
    - Ready for exemplary publication in terms of accessibility and WCAG 2.2 compliance

## [0.9.4] - 2025-05-07

### Changed
- Improved accessibility in dark themes:
  - Enhanced `365-05-dark-theme.json` with better color contrast and semantic token support
  - Improved `365-05-hc-dark-theme.json` with additional UI elements for better accessibility
  - Added semantic token colors for better syntax highlighting
  - Optimized colors for editor widgets and notifications
  - Improved Git decorations and debugging experience
  - Enhanced Markdown support with better styling for various elements

## [0.9.3] - 2025-02-27

### Changed
- Improved accessibility in `365-02-light-theme.json`:
  - Enhanced color contrast for better readability
  - Optimized colors for people with color blindness
  - Added bold styling to important syntax elements
  - Improved focus indicators and selection highlights
- Updated version number in `package.json` to 0.9.

## [0.9.1] - 2025-01-05

### Added
- Added dark themes for multiple months:
  - `365-02-hc-dark-theme.json`: dark theme for February
  - `365-03-hc-dark-theme.json`: dark theme for March
  - `365-04-hc-dark-theme.json`: dark theme for April
  - `365-05-hc-dark-theme.json`: dark theme for May
  - `365-06-hc-dark-theme.json`: dark theme for June

## [0.8.0] - 2024-12-14

### Added
- Added light themes for multiple months:
  - `365-02-light-theme.json`: Light theme for February
  - `365-03-light-theme.json`: Light theme for March
  - `365-04-light-theme.json`: Light theme for April
  - `365-06-light-theme.json`: Light theme for June
  - `365-07-light-theme.json`: Light theme for July
  - `365-08-light-theme.json`: Light theme for August
  - `365-09-light-theme.json`: Light theme for September

### Changed
- Updated version number in `package.json` to 0.8.0

## [0.7.9] - 2024-12-11

### Changed
- Added the theme 365-05-light-theme.json

## [0.7.8] - 2024-12-11

### Changed
- Standardized theme labels in package.json:
  - Translated all month names to English
  - Unified capitalization across all theme names
  - Standardized format to "365 MM-Month Theme_Type"
  - Fixed inconsistencies in naming conventions

## [0.7.7] - 2024-12-10

### Added
- Added comprehensive Backlog and Future Updates section to README.md:
  - Next developments tracking
  - Configuration and testing plans
  - CI/CD pipeline tasks
  - Detailed theme creation roadmap for February through September
  - GitHub Issues integration

## [0.7.6] - 2024-11-24

### Added
- Enhanced accessibility features in January theme:
  - Improved color contrast for better readability
  - Added support for color blindness and dyslexia
  - Optimized color combinations for visual comfort

## [0.7.5] - 2024-11-23

### Changed
- Updated README.md badges:
  - Added Visual Studio Marketplace Downloads badge
  - Removed Contributors badge
  - Reorganized badges layout for better readability

## [0.7.4] - 2024-11-23

### Changed
- Updated version number in package.json to 0.7.4
- Improved documentation organization and clarity

## [0.7.3] - 2024-11-07
### Changed
- Updated README files with correct links to all languages.
- Improved color contrast for numbers in `365-11-light-theme.json`.

## [0.7.2] - 2024-11-07
### Changed
- Updated color for numbers to improve readability for colorblind users in `365-11-light-theme.json`.

## [0.7.1] - 2024-11-07
### Added
- Updated the 3 themes for the month of November

## [0.7.0] - 2023-11-14
### Added
- Add all the themes in the package.json

## [0.6.0] - 2023-11-14
### Changed
- Update of the extension images
- Updated '365-day-october-light-color-theme.json' file for testing purposes

## [0.5.0] - 2023-11-05
### Changed
- October Light theme update
- License update
- Correction of README_fr.md and README.md files

## [0.4.0] - 2023-11-03
### Changed
- change extension icon
### Added
- Add an icon to package.json for Microsoft store
- Add October theme

## [0.3.0] - 2023-11-02
### Changed
- Modification of extension image URL in README.md file
- Updated package.json file 
### Added
- Added LICENSE file

## [0.2.0] - 2023-11-01
### Changed
- Changed README.md file

## [0.1.0] - 2023-10-21
### Added
- Initial release
- Added README_fr.md file

[unreleased]: https://github.com/mickaellherminez/365-daynight-vscode-theme-ext/compare/0.11.1...HEAD
[0.11.1]: https://github.com/mickaellherminez/365-daynight-vscode-theme-ext/compare/0.11.0...0.11.1
[0.11.0]: https://github.com/mickaellherminez/365-daynight-vscode-theme-ext/compare/0.10.0...0.11.0
[0.10.0]: https://github.com/mickaellherminez/365-daynight-vscode-theme-ext/compare/0.9.7...0.10.0
[0.9.7]: https://github.com/mickaellherminez/365-daynight-vscode-theme-ext/compare/0.9.6...0.9.7
[0.9.6]: https://github.com/mickaellherminez/365-daynight-vscode-theme-ext/compare/0.9.5...0.9.6
[0.9.5]: https://github.com/mickaellherminez/365-daynight-vscode-theme-ext/compare/0.9.4...0.9.5
[0.9.4]: https://github.com/mickaellherminez/365-daynight-vscode-theme-ext/compare/0.9.2...0.9.4
[0.9.3]: https://github.com/mickaellherminez/365-daynight-vscode-theme-ext/compare/0.9.2...0.9.4
[0.9.1]: https://github.com/mickaellherminez/365-daynight-vscode-theme-ext/compare/0.9.0...0.9.2
[0.8.0]: https://github.com/mickaellherminez/365-daynight-vscode-theme-ext/compare/0.7.9...0.8.0
[0.7.9]: https://github.com/mickaellherminez/365-daynight-vscode-theme-ext/compare/0.7.8...0.7.9
[0.7.8]: https://github.com/mickaellherminez/365-daynight-vscode-theme-ext/compare/0.7.7...0.7.8
[0.7.7]: https://github.com/mickaellherminez/365-daynight-vscode-theme-ext/compare/0.7.6...0.7.7
[0.7.6]: https://github.com/mickaellherminez/365-daynight-vscode-theme-ext/compare/0.7.5...0.7.6
[0.7.5]: https://github.com/mickaellherminez/365-daynight-vscode-theme-ext/compare/0.7.4...0.7.5
[0.7.4]: https://github.com/mickaellherminez/365-daynight-vscode-theme-ext/compare/0.7.3...0.7.4
[0.7.3]: https://github.com/mickaellherminez/365-daynight-vscode-theme-ext/compare/0.7.2...0.7.3
[0.7.2]: https://github.com/mickaellherminez/365-daynight-vscode-theme-ext/compare/0.7.1...0.7.2
[0.7.1]: https://github.com/mickaellherminez/365-daynight-vscode-theme-ext/compare/0.7.0...0.7.1
[0.7.0]: https://github.com/mickaellherminez/365-daynight-vscode-theme-ext/compare/0.6.0...0.7.0
[0.6.0]: https://github.com/mickaellherminez/365-daynight-vscode-theme-ext/compare/0.5.0...0.6.0
[0.5.0]: https://github.com/mickaellherminez/365-daynight-vscode-theme-ext/compare/0.4.0...0.5.0
[0.4.0]: https://github.com/mickaellherminez/365-daynight-vscode-theme-ext/compare/0.3.0...0.4.0
[0.3.0]: https://github.com/mickaellherminez/365-daynight-vscode-theme-ext/compare/0.2.0...0.3.0
[0.2.0]: https://github.com/mickaellherminez/365-daynight-vscode-theme-ext/compare/0.1.0...0.2.0
[0.1.0]: https://github.com/mickaellherminez/365-daynight-vscode-theme-ext/releases/tag/0.1.0

---

### How do I make a good changelog?
#### Guiding Principles :
- Changelogs are for humans, not machines.
- There should be an entry for every single version.
- The same types of changes should be grouped.
- Versions and sections should be linkable.
- The latest version comes first.
- The release date of each version is displayed.
- Mention whether you follow Semantic Versioning.
#### Types of changes :
- `Added` for new features.
- `Changed` for changes in existing functionality.
- `Deprecated` for soon-to-be removed features.
- `Removed` for now removed features.
- `Fixed` for any bug fixes.
- `Security` in case of vulnerabilities.