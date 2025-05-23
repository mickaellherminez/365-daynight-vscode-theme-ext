# Journal des modifications
# Changelog

All notable changes to the "365-daynight-vscode-theme-ext" extension will be documented in this file.

The format is based on [Keep a Changelog](http://keepachangelog.com/), and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

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

## [0.8.0] - 2024-01-10

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

## [0.7.9]

### Changed
- Added the theme 365-05-light-theme.json

## [0.7.8] - 2024-01-09

### Changed
- Standardized theme labels in package.json:
  - Translated all month names to English
  - Unified capitalization across all theme names
  - Standardized format to "365 MM-Month Theme_Type"
  - Fixed inconsistencies in naming conventions

## [0.7.7] - 2024-01-09

### Added
- Added comprehensive Backlog and Future Updates section to README.md:
  - Next developments tracking
  - Configuration and testing plans
  - CI/CD pipeline tasks
  - Detailed theme creation roadmap for February through September
  - GitHub Issues integration

## [0.7.6] - 2024-01-09

### Added
- Enhanced accessibility features in January theme:
  - Improved color contrast for better readability
  - Added support for color blindness and dyslexia
  - Optimized color combinations for visual comfort

## [0.7.5] - 2024-01-09

### Changed
- Updated README.md badges:
  - Added Visual Studio Marketplace Downloads badge
  - Removed Contributors badge
  - Reorganized badges layout for better readability

## [0.7.4] - 2024-01-08

### Changed
- Updated version number in package.json to 0.7.4
- Improved documentation organization and clarity

## [0.7.3] - 2024-01-08

### Added
- Two daily themes for each month of the year:
  - January through December: Each month has its own light theme for day and dark theme for night
- Special holiday themes:
   - New Year: Festive day and night themes
   - Easter: Festive day and night themes
   - Halloween: Festive day and night themes
   - Christmas: Festive day and night themes
- Automatic theme switching based on time of day
- Multi-language support for documentation (9 languages)

### Changed
- Optimized color schemes for reduced eye strain and improved readability
- Enhanced color contrast in number highlighting for `365-11-light-theme.json`
- Updated documentation with comprehensive language support
- Updated `package.json` to version 0.7.3

### Fixed
- No fixes in this release

### Security
- No security updates in this release

## [Unreleased]
- Planned improvements for theme transitions
- Additional language support for documentation

## [0.7.3] - 2024-11-09
### Changed
- Updated README files with correct links to all languages.
- Improved color contrast for numbers in `365-11-light-theme.json`.

## [0.7.2] - 2024-11-08
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

[unreleased]: https://github.com/mickaellherminez/365-daynight-vscode-theme-ext/compare/0.7.8...HEAD
[0.9.6]: https://github.com/mickaellherminez/365-daynight-vscode-theme-ext/compare/0.9.5...0.9.6
[0.9.5]: https://github.com/mickaellherminez/365-daynight-vscode-theme-ext/compare/0.9.4...0.9.5
[0.9.4]: https://github.com/mickaellherminez/365-daynight-vscode-theme-ext/compare/0.9.3...0.9.4
[0.9.3]: https://github.com/mickaellherminez/365-daynight-vscode-theme-ext/compare/0.9.2...0.9.3
[0.9.2]: https://github.com/mickaellherminez/365-daynight-vscode-theme-ext/compare/0.9.1...0.9.2
[0.9.1]: https://github.com/mickaellherminez/365-daynight-vscode-theme-ext/compare/0.9.0...0.9.1
[0.9.0]: https://github.com/mickaellherminez/365-daynight-vscode-theme-ext/compare/0.8.0...0.9.0
[0.8.0]: https://github.com/mickaellherminez/365-daynight-vscode-theme-ext/compare/0.7.8...0.8.0
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