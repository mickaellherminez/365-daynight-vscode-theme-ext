# Contributing to 365 Day & Night Themes

Thanks for your interest! Bug reports, accessibility feedback and pull requests are welcome.

- **Report a bug or a hard-to-read color:** [open an issue](https://github.com/mickaellherminez/365-daynight-vscode-theme-ext/issues). Please mention the theme name (for example `365 10-October Dark`), what is hard to read, and a screenshot if possible.
- **Suggest a feature:** open an issue describing your use case.

## Project structure

| Path | Content |
| --- | --- |
| `package.json` | Extension manifest: themes, commands and settings |
| `extension.js` | Status bar toggle, commands and automatic day/night switching |
| `theme-logic.js` | Theme selection logic, without any VS Code dependency |
| `themes/` | The generated color themes (`365-MM-light`, `365-MM-dark`, `365-MM-hc-dark`, and `365-MM-hc-light` for the months that have it) |
| `scripts/themes/` | Theme generator, accessibility audit and preview images ([documentation](scripts/themes/README.md)) |
| `test/` | Unit tests (`test/unit`) and integration tests run inside VS Code (`test/suite`) |
| `docs/` | Translated README files |

## Development

Requirements: Node.js 22+, and Python 3.8+ for the theme tools.

```sh
npm install
```

- Press `F5` in VS Code (configuration **Run Extension**) to open a new window with the extension loaded.
- After a change, reload that window with `Ctrl+R` (`Cmd+R` on Mac).
- Set breakpoints in `extension.js` and check the output in the Debug Console.

### Tests and lint

```sh
npm run lint
npm run test:unit   # fast tests that don't open VS Code (test/unit, with a fake VS Code API)
npm test            # lint, unit tests, then downloads the latest stable VS Code and runs test/suite inside it
```

If you run the tests from VS Code's integrated terminal, use `env -u ELECTRON_RUN_AS_NODE npm test`: that terminal sets `ELECTRON_RUN_AS_NODE`, which prevents the test instance of VS Code from starting.

When the `system` mode test fails, its error message ends with a timeline of the setting and theme changes it saw, with the time in milliseconds, the dark and light preferences, the theme kind and the button state. This test waits for the new month in the settings instead of reading them right after the arrow command, because setting changes can reach the extension asynchronously.

The extension writes each failed theme change to its log, not only as a notification. Open it with **Help > Toggle Developer Tools > Console**, or look for lines starting with `365DayNight:` in the test output.

### Continuous integration

The [CI workflow](.github/workflows/ci.yml) runs these checks on every branch push and pull request. If one fails, the workflow fails.

| Check | Command | What it verifies |
| --- | --- | --- |
| Theme audit | `npm run themes:audit` | Contrast and color blind distinction in every theme, including semantic token colors, and the font styles that carry meaning (WCAG 1.4.1). A missing color role or style counts as a failure |
| Generated themes | `npm run themes:check` | Each file in `themes/` is exactly what the generator produces from its palette: no hand edit, no palette change without `--write`, no missing or extra file |
| Measuring tools | `npm run themes:test` | The color calculations match published reference data, and the audit and the variety test fail when they should. See below |
| Lint and tests | `npm test` | The lint, the unit tests, then the tests inside VS Code |

The Publish workflow runs the same checks before building the package. See [scripts/themes/README.md](scripts/themes/README.md) for what the audit covers and its limits.

### Measuring tools

The audit and the variety test are only as good as their color calculations. `npm run themes:test` checks `scripts/themes/colorlib.py` against published data, stored in `scripts/themes/tests/data/` with their sources:

| What | Reference |
| --- | --- |
| WCAG contrast ratio: 21:1 for black on white, 4.54:1 for `#767676` on white, 4.48:1 for `#777777`, and the luminance of the primaries | WCAG 2.2 definitions of contrast ratio and relative luminance |
| CIEDE2000: the 34 test pairs, to four decimals, in both orders | Sharma, Wu and Dalal (2005), *Color Research & Application* 30(1) |
| Color vision deficiency simulation: the matrices are the published ones for severity 1.0 | Machado, Oliveira and Fernandes (2009), *IEEE TVCG* 15(6), DOI 10.1109/TVCG.2009.113 |
| Achromatopsia: every color becomes the gray of the same luminance | sRGB relative luminance |

The same command tests the audit's font style check and the variety test with synthetic themes.

The audit also shows two measures for information only, which never fail it: CIEDE2000 for the closest token pairs, and achromatopsia (lightness differences only). Thresholds stay in CIE76 until they are recalibrated for CIEDE2000, whose scale is different.

## Status bar button rules

The button has three items: `‹ 10 DRK ›`. High Contrast Light only exists for the months listed in `HIGH_CONTRAST_LIGHT_MONTHS` (`theme-logic.js`), October for now: a unit test checks that this list matches the themes in `package.json`.

| Situation | Behavior |
| --- | --- |
| Click on a Light or Dark theme | Switches between Light and Dark, in one click |
| Click on a High Contrast theme | Switches between High Contrast Dark and High Contrast Light, so that nobody leaves High Contrast by mistake. A month without High Contrast Light goes to Light |
| `365DayNight.toggleIncludesHighContrast` on | The click cycles through every variant: Light, Dark, High Contrast, High Contrast Light |
| Reaching High Contrast | With the `365: Apply High Contrast theme` or `365: Apply High Contrast Light theme` command, or a link in the tooltip. In a month without High Contrast Light, its command applies High Contrast and says so |
| Leaving High Contrast | With the `365: Apply Light theme` or `365: Apply Dark theme` command, or the **Light** and **Dark** links that the tooltip shows in a High Contrast theme instead of the High Contrast links. In `system` mode, the tooltip has neither: the system decides |
| A month without High Contrast Light | The arrows and automatic mode apply High Contrast instead, to stay in high contrast |
| `‹` and `›` | Change the month and keep the variant. December is followed by January. Fast clicks are grouped into one theme change |
| Commands that apply a variant | Keep the displayed month |
| `365: Back to the current month` | Applies the real month and keeps the variant |
| Automatic mode, Light or Dark theme | Alternates Light and Dark, on the selected month until the next real month, even after a restart. A month picked in the theme picker counts as selected, and a theme from another publisher does not cancel the selection |
| Automatic mode, High Contrast theme | Only updates the month: it never leaves High Contrast, nor switches between its two variants, except to High Contrast in a month without High Contrast Light |
| Active theme from another publisher | No arrows and no month number. The first click applies the 365 theme of the same type |
| `system` mode | The arrows change the month of the three preferred themes. The center button and the variant commands explain that the system decides between light and dark, and change nothing |
| `system` mode, theme from another publisher | Picked in the theme picker, it stays in the preference in use, month after month: no arrows and no month number. The first click brings back the 365 theme |
| `system` mode, leaving it | The settings get their original values back, and absent settings are removed again. A setting that no longer holds a 365 theme of the right variant is a choice of the user: it is kept |
| `system` mode, several windows | Only the focused window saves the original settings and treats a change of the active preference as a choice of month |
| `system` mode, 365 High Contrast theme picked in the theme picker | VS Code stores it in the preference of the current system mode, light or dark, whatever its variant. The button reads it there and shows its month, unless the high contrast preference itself holds a 365 theme of the active kind |
| `system` mode, High Contrast Light | `workbench.preferredHighContrastLightColorTheme` gets the theme of the month when it exists. Otherwise it keeps or gets back its original value, and waits for the next month that has the theme, unless the user changes it. A setup made by 0.12.0, which did not save this setting, saves it before writing it |

The three items share the `365DayNight.statusBarButton` color, so that they read as one control. Each theme derives it from its accent color, and the audit checks that it stays readable on the status bar. While debugging, the items use the normal status bar color, because the bar has another background. Other themes also get the normal color.

The button shows `LGT`, `DRK`, `HCT` (High Contrast Dark) or `HCL` (High Contrast Light). High Contrast Light themes are named `365 01-January High Contrast Light`. The labels of the 36 original themes and the public command IDs must not change.

## Changing a theme

Theme files are **generated**: do not edit `themes/*.json` by hand.

1. Edit the month's palette in `scripts/themes/palettes/MM.json`.
2. Check accessibility: `npm run themes:build -- MM` (nothing is written).
3. When the audit reports 0 problems, write the files: `npm run themes:build -- MM --write`.
4. Regenerate the README previews: `python3 scripts/themes/preview.py`. To look at them without changing `assets/`, add `--out <folder>`.
5. Test the result with `F5`, including text selection in the terminal and the debug console.

To give a month its High Contrast Light theme, add an `hcLight` variant to its palette, declare `365 MM-Month High Contrast Light` with `"uiTheme": "hc-light"` in `package.json`, then add the month to `HIGH_CONTRAST_LIGHT_MONTHS` in `theme-logic.js`.

`npm run themes:audit` checks all the themes, and `npm run themes:check` confirms that every theme file matches its palette. See [scripts/themes/README.md](scripts/themes/README.md) for the palette roles, the audit rules and the audit's limits.

### Variety between months

```sh
npm run themes:variety        # summary for each variant
python3 scripts/themes/variety.py -v   # every failing pair
```

The audit checks each theme on its own. `npm run themes:variety` compares every pair of months within each variant, to make sure that two months do not look alike. The report also gives the mean CIEDE2000 difference, for information:

| Measure | Color | Minimum for each pair of months |
| --- | --- | --- |
| Editor background | `editor.background` | ΔE 8, or 4 in the High Contrast variants |
| Accent | `activityBarBadge.background` | ΔE 25 |
| Syntax | Keyword, function, string, number, class and comment | Average ΔE of the six roles: 10 |
| Status bar | `statusBar.background` | None, for information only |

At most three months of a variant can share a hue family, counted separately for the editor background and the accent. The families are eight 45° sectors of the CIELAB hue angle, plus a `neutre` (neutral) family for nearly gray colors (chroma below 4).

Only normal vision decides the result. The same measures are shown for protanopia, deuteranopia and tritanopia, for information only. The command exits with code 1 when a check fails. The current themes are too similar from month to month and fail it, so CI does not run it yet: it will once all twelve months are redesigned. See [scripts/themes/README.md](scripts/themes/README.md#mesurer-la-variété-entre-les-mois) for the hue angles of each family and how to read the report.

## Packaging

```sh
npm run package   # creates 365-daynight-vscode-theme-ext-<version>.vsix
```

## Publishing

Pushing a version tag that matches `package.json` (for example `git tag 0.11.2 && git push origin 0.11.2`) runs the [Publish workflow](.github/workflows/publish.yml):

1. A pause until a repository admin approves the run in the protected `release` environment: open the run in the Actions tab, then **Review deployments** > **Approve and deploy**. Without approval, nothing is built or published.
2. Theme audit, generated themes check, lint and tests.
3. Build and verification of one `.vsix` package.
4. Publication of that same package to the Marketplace, with Trusted Publishing (OIDC, no token), and to Open VSX, with the `OVSX_PAT` repository secret.

Only repository admins can create version tags, and nobody can move or delete one, so a published tag always points to the published code. The `release` environment only accepts `main` and version tags.

The workflow can also be started manually from the Actions tab, which also asks for approval when it publishes. To check everything except the publication, without approval and from any branch, use the `dry_run` option:

```sh
gh workflow run publish.yml --ref <branch> -f dry_run=true
```

If one registry fails, open the workflow run and choose **Re-run failed jobs**: this publishes the same package to that registry only. A full re-run is also safe, because `--skip-duplicate` skips a registry that already has this version.

## Pull requests

- Create a branch from `main` (for example `feat/...` or `fix/...`).
- Keep commits focused and use the existing prefixes: `ADDED:`, `CHANGED:`, `FIXED:`, `REMOVED:`, `DOCS:`.
- Make sure `npm run lint`, `npm test`, `npm run themes:audit`, `npm run themes:check` and `npm run themes:test` pass.
- Add a line to the `[Unreleased]` section of the [CHANGELOG](CHANGELOG.md) for user-facing changes.
