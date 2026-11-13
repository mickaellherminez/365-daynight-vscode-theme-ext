# Contributing to 365 Day & Night Themes

Thanks for your interest! Bug reports, accessibility feedback and pull requests are welcome.

- **Report a bug or a hard-to-read color:** [open an issue](https://github.com/mickaellherminez/365-daynight-vscode-theme-ext/issues/new/choose) with the matching form. Please mention the theme name (for example `365 10-October Dark`), what is hard to read, and a screenshot if possible.
- **Suggest a feature:** [open an issue](https://github.com/mickaellherminez/365-daynight-vscode-theme-ext/issues/new/choose) describing your use case.
- **Report a security problem:** follow the [security policy](SECURITY.md), and do not open a public issue.

## Project structure

| Path | Content |
| --- | --- |
| `package.json` | Extension manifest: themes, commands and settings |
| `extension.js` | Status bar toggle, commands and automatic day/night switching |
| `theme-logic.js` | Theme selection logic, without any VS Code dependency |
| `themes/` | The generated color themes (`365-MM-light`, `365-MM-dark`, `365-MM-hc-dark`, and `365-MM-hc-light` for the months that have it) |
| `scripts/themes/` | Theme generator, accessibility audit and preview images ([documentation](scripts/themes/README.md)) |
| `scripts/stats/` | Daily install and download statistics, written to the `stats` branch (see [Download statistics](#download-statistics)) |
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

The integration tests run twice: on the latest VS Code and on the minimum version declared in `engines.vscode` in `package.json`. To run them on a given version, set `VSCODE_TEST_VERSION`, for example `VSCODE_TEST_VERSION=1.96.0 npm test`. An older VS Code embeds a Node.js that Mocha 12 cannot run on: first run `npm install --no-save mocha@11`, as the CI does, and `npm ci` afterwards to go back.

| Check | Command | What it verifies |
| --- | --- | --- |
| Theme audit | `npm run themes:audit` | Contrast and color blind distinction (ΔE of at least 12 for the three simulated types) in every theme, including semantic token colors, and the font styles that carry meaning (WCAG 1.4.1). A missing color role or style counts as a failure |
| Generated themes | `npm run themes:check` | Each file in `themes/` is exactly what the generator produces from its palette: no hand edit, no palette change without `--write`, no missing or extra file |
| Variety | `npm run themes:variety` | Two months of the same variant do not look alike: background, frame, accent and syntax. See below |
| Measuring tools | `npm run themes:test` | The color calculations match published reference data, and the audit and the variety test fail when they should. See below |
| Audit report | `npm run themes:report-check` | [docs/AUDIT.md](docs/AUDIT.md) and its JSON match the themes. After changing a theme, run `npm run themes:report` and commit the result |
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

The button has three items: `‹ 10 DRK ›`. High Contrast Light exists for the months listed in `HIGH_CONTRAST_LIGHT_MONTHS` (`theme-logic.js`), all twelve today: a unit test checks that this list matches the themes in `package.json`. The rules for a month without High Contrast Light below are kept, and tested by simulating that only October has it (`test/helpers/high-contrast-light.cjs`).

| Situation | Behavior |
| --- | --- |
| Click on a Light or Dark theme | Switches between Light and Dark, in one click |
| Click on a High Contrast theme | Switches between High Contrast Dark and High Contrast Light, so that nobody leaves High Contrast by mistake. A month without High Contrast Light goes to Light |
| `365DayNight.toggleIncludesHighContrast` on | The click cycles through every variant: Light, Dark, High Contrast, High Contrast Light |
| Reaching High Contrast | With the `365: Apply High Contrast theme` or `365: Apply High Contrast Light theme` command, or a link in the tooltip. In a month without High Contrast Light, its command applies High Contrast and says so |
| Leaving High Contrast | With the `365: Apply Light theme` or `365: Apply Dark theme` command, or the **Light** and **Dark** links that the tooltip shows in a High Contrast theme instead of the High Contrast links. In `system` mode, the tooltip has neither: the system decides |
| A month without High Contrast Light (none today) | The arrows and automatic mode apply High Contrast instead, to stay in high contrast |
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
| `system` mode, the backup of the original settings | VS Code keeps the whole `globalState` of an extension in one block, which a concurrent write can briefly bring back to an older state: a read may then return no backup, or one without its original values. Each window keeps the last backup it wrote, and uses it when the stored one is missing or incomplete; a valid stored backup comes first, since another window may have written it. A backup without original values is otherwise treated as absent, and the setup starts again |
| `system` mode, 365 High Contrast theme picked in the theme picker | VS Code stores it in the preference of the current system mode, light or dark, whatever its variant. The button reads it there and shows its month, unless the high contrast preference itself holds a 365 theme of the active kind |
| `system` mode, High Contrast Light | `workbench.preferredHighContrastLightColorTheme` gets the theme of the month when it exists. Otherwise it keeps or gets back its original value, and waits for the next month that has the theme, unless the user changes it. A setup made by 0.12.0, which did not save this setting, saves it before writing it |

The three items sit at the far right of the status bar, just before the notifications bell, with a very low priority (`STATUS_BAR_PRIORITY` in `extension.js`, about -10000). When the bar is full, VS Code hides the leftmost right-aligned items first, so the button is the last one to go. The three priorities are close non-integer values, so that no other item slips between them. The API cannot group items: in a very narrow window, `‹` can still disappear before the rest.

The three items share the `365DayNight.statusBarButton` color, so that they read as one control. Each theme derives it from its accent color, and the audit checks that it stays readable on the status bar. While debugging, the items use the normal status bar color, because the bar has another background. Other themes also get the normal color.

The button shows `LGT`, `DRK`, `HCT` (High Contrast Dark) or `HCL` (High Contrast Light). High Contrast Light themes are named `365 01-January High Contrast Light`. The labels of the 36 original themes and the public command IDs must not change: VS Code remembers the selected theme by its label, keyboard shortcuts by the command ID, and settings by their name. `test/unit/compatibility.test.cjs` checks them against `test/fixtures/public-api-0.12.0.json`, taken from the `0.12.0` tag: the 36 labels with their variant, the commands, and the settings with their type, default and values. Do not edit that file.

To test an update from the published version without touching your own VS Code, use an isolated profile (`code` is the VS Code command line, `Visual Studio Code.app/Contents/Resources/app/bin/code` on macOS). Run these commands from a terminal outside VS Code: in VS Code's integrated terminal, `code` talks to the open window and the last command does nothing. Keep the profile path short: on macOS, VS Code creates a socket in it, and a path longer than 103 characters makes it quit silently (`listen EINVAL` in its log).

```sh
code --user-data-dir /tmp/365-data --extensions-dir /tmp/365-ext --install-extension mickaellherminez.365-daynight-vscode-theme-ext@0.12.0
# choose a 365 theme and a few settings in /tmp/365-data/User/settings.json, then:
npx vsce package --no-update-package-json --no-git-tag-version 0.13.0 --out /tmp/365-next.vsix
code --user-data-dir /tmp/365-data --extensions-dir /tmp/365-ext --install-extension /tmp/365-next.vsix
code --user-data-dir /tmp/365-data --extensions-dir /tmp/365-ext   # the same theme must still be active
```

## Changing a theme

Theme files are **generated**: do not edit `themes/*.json` by hand.

1. Edit the month's palette in `scripts/themes/palettes/MM.json`.
2. Check accessibility: `npm run themes:build -- MM` (nothing is written).
3. When the audit reports 0 problems, write the files: `npm run themes:build -- MM --write`.
4. Regenerate the gallery of the 12 months: `python3 scripts/themes/preview.py`. To look at it without changing `assets/`, add `--out <folder>`. The other README images are demos filmed in VS Code.
5. Test the result with `F5`, including text selection in the terminal and the debug console.

Every month has a High Contrast Light theme: an `hcLight` variant in its palette, `365 MM-Month High Contrast Light` declared with `"uiTheme": "hc-light"` in `package.json`, and the month listed in `HIGH_CONTRAST_LIGHT_MONTHS` in `theme-logic.js`. The three must stay in sync, or the unit tests fail.

To draft the four palettes of a month from its mood, use `python3 scripts/themes/draft.py MM --write`, then build the themes as above. The mood, the starting colors and the syntax hue ranges of each month are in `scripts/themes/direction.json`. See [scripts/themes/README.md](scripts/themes/README.md#ébaucher-un-mois-à-partir-de-son-ambiance).

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
| Frame | `sideBar.background` (sidebar) | ΔE 7, or 4 in the High Contrast variants |
| Accent | `activityBarBadge.background` | ΔE 25 |
| Syntax | Keyword, function, string, number, class and comment | Average ΔE of the six roles: 18 |
| Status bar | `statusBar.background` | None, for information only |

At most three months of a variant can share a hue family, counted separately for the editor background and the accent. The families are eight 45° sectors of the CIELAB hue angle, plus a `neutre` (neutral) family for nearly gray colors (chroma below 4).

Only normal vision decides the result. The same measures are shown for protanopia, deuteranopia and tritanopia, for information only. The command exits with code 1 when a check fails. Before the redesign, the themes were too similar from month to month and failed it. The redesigned twelve months pass every pair, and CI and the Publish workflow run it like the audit. See [scripts/themes/README.md](scripts/themes/README.md#mesurer-la-variété-entre-les-mois) for the hue angles of each family and how to read the report.

## Packaging

```sh
npm run package   # creates 365-daynight-vscode-theme-ext-<version>.vsix
```

## Publishing

Pushing a version tag that matches `package.json` (for example `git tag 0.11.2 && git push origin 0.11.2`) runs the [Publish workflow](.github/workflows/publish.yml):

1. A pause until a repository admin approves the run in the protected `release` environment: open the run in the Actions tab, then **Review deployments** > **Approve and deploy**. Without approval, nothing is built or published.
2. Theme audit, generated themes check, variety test, measuring tools, lint and tests.
3. Build and verification of one `.vsix` package.
4. Publication of that same package to the Marketplace, with Trusted Publishing (OIDC, no token), and to Open VSX, with the `OVSX_PAT` repository secret.

Only repository admins can create version tags, and nobody can move or delete one, so a published tag always points to the published code. The `release` environment only accepts `main` and version tags.

The workflow can also be started manually from the Actions tab, which also asks for approval when it publishes. To check everything except the publication, without approval and from any branch, use the `dry_run` option:

```sh
gh workflow run publish.yml --ref <branch> -f dry_run=true
```

To publish a **pre-release**, set the version in `package.json` and the CHANGELOG, merge into `main`, then start the workflow manually on `main` with the `pre_release` option. It needs the same approval:

```sh
gh workflow run publish.yml --ref main -f pre_release=true
```

The package is built with `vsce package --pre-release`, which marks it in `extension.vsixmanifest`. Both registries read that mark: only users who click **Switch to Pre-Release Version** on the extension page get it. `scripts/verify-package.cjs` checks that the mark matches the option. Do not push a tag for a pre-release: a pushed tag always publishes a release version. The Marketplace never reuses a version number, so the next release must have a higher one (for example 1.0.0 after 0.13.0).

If one registry fails, open the workflow run and choose **Re-run failed jobs**: this publishes the same package to that registry only. A full re-run is also safe, because `--skip-duplicate` skips a registry that already has this version.

After a tag publication, once both registries have the package, the workflow creates the [GitHub release](https://github.com/mickaellherminez/365-daynight-vscode-theme-ext/releases) of this version, with the `.vsix` and its notes, taken from the CHANGELOG by `scripts/release-notes.cjs`. The workflow checks for these notes before building, so a missing section stops it before anything is published. Re-running after a release exists only replaces the `.vsix` of that release.

A manual run, pre-release or dry run, creates no GitHub release: it has no tag, and the **Version tags** ruleset of the repository lets only administrators create one. An administrator's tag would also start a release publication, so a tag for a pre-release needs the Publish workflow disabled while it is created.

## Landing page

The page of `365daynight.mickaellherminez.net` lives in `site/`. Its numbers come from `docs/audit-report.json`, so it changes with the themes.

```sh
npm run site:build    # builds site-dist/
npm run site:check    # checks it in Chrome under the production Content-Security-Policy
npm run site:preview  # serves it at http://127.0.0.1:4173
```

`site:check` runs axe-core at 360, 820 and 1280 pixels, in light and dark and in both High Contrast variants, and fails on any accessibility violation, script error, missing file or horizontal overflow. It also checks each translated page at 360 and 1280 pixels: its language and direction, a header on one line, and a language menu that lists the 10 languages and closes with Escape. Set `CHROME_PATH` if Chrome is not in its usual place.

### Translations of the landing page

The page exists in the 10 languages of the README. English is at the root of the site, each other language in its own folder: `/fr/`, `/es/`, `/de/`, `/pt/`, `/ru/`, `/zh/`, `/ja/`, `/hi/` and `/ar/` (right to left). The build writes one static page per language, so each page is readable without JavaScript and by search engines, and links to the others with `hreflang`.

Visitors change the language in three ways:

- **The globe button of the header** (with the language code, such as `FR`, on a computer): it opens a list of the 10 languages, each written in its own language. `Escape`, a click outside or moving the focus out of it closes the list. With the keyboard: `Tab` to the button, `Enter` or `Space` to open it, `Tab` to a language, `Enter` to go to it.
- **The list of languages at the bottom of the page**, after the footer.
- **The address**: add or remove the language folder, for example `https://365daynight.mickaellherminez.net/de/`.

To go back to English, choose **English** in either list or open the root address. The site does not redirect visitors based on their browser language and does not remember the choice: each page is only one link.

The texts are in `site/i18n/`, one JSON file per language, with the same keys:

| Part | Holds |
| --- | --- |
| `meta` | language code, native name, direction (`ltr` or `rtl`), number and date locales, `og:locale`, and whether condition names are lowercase inside a sentence |
| `months` | full and short name of the 12 months |
| `page` | the texts of `site/index.html`, placed by `{{t:key}}` at build time |
| `limits` | the limits of `docs/AUDIT.md`, in its Markdown (English: `null`, read from the report) |
| `js` | the texts written by the scripts of the page, read by `t('key', { name })` from `site/i18n.js` |

Theme names (`Light`, `Dark`, `High Contrast`, `High Contrast Light`), commands, code and units stay in English, as in the translated READMEs. Numbers follow each language (`4,5:1` in French, `13.212` in German); Arabic uses Western digits, as in its README.

The build refuses a translation that does not match English: a missing or extra key, an empty text, an HTML element or link that differs, or a `{{placeholder}}` that differs. Words may change order, not markup. When `docs/AUDIT.md` gains, loses or changes the link of a limit, the build also stops until every translation has the same limits. To change a text, change it in `en.json` and in the 9 other files, then run `npm run test:unit` and `npm run site:check`. To add a language, add its file, its code to `LANGUAGES` in `scripts/site/build.cjs` and its README translation.

`site/.htaccess` holds the security headers of the hosting: HTTPS only, a Content-Security-Policy that allows no script from elsewhere and no inline script, and no directory listing. `site:check` reads the same policy, so the page is tested with it.

The [Site workflow](.github/workflows/site.yml) builds and checks the page on every push to `main` that changes it. When the repository variable `SITE_DEPLOY` is `enabled`, it then deploys over FTPS from the protected `site` environment: **each deployment waits for an approval** (**Review deployments** > **Approve and deploy**). The FTPS account is stored as secrets of that environment and only reaches the folder of the page. Nobody else's pull request can use them.

## Download statistics

The [Stats workflow](.github/workflows/stats.yml) records every day the install and download totals of the extension in the `stats` branch. That branch only holds data, shares no history with `main` and is written only by the workflow. It is created on the first run.

| File in `stats` | Content |
| --- | --- |
| `downloads.csv` | One line per day (UTC): `date,marketplace_install,marketplace_update,marketplace_download,openvsx_download,status` |
| `README.md` | What each column and status means. It is copied from `scripts/stats/branch-readme.md` on each run, so edit that file instead |

**Sources.** Both are public and need no token: the Marketplace gallery API (`install`, `updateCount` and `downloadCount`, recorded as they are, since `downloadCount` is not the sum of the other two) and the Open VSX API (`downloadCount`). They only give the current totals, so a day that is not recorded is lost.

**Schedule and retries.** The workflow runs at 00:17, 06:17, 12:17 and 18:17 UTC.

- A run first reads `downloads.csv`. When the line of the day is complete, it stops without calling the APIs or committing.
- Otherwise it only asks the registries that are still missing. When one answers and the other does not, the line is written with the `partial` status and empty cells, and the next run only asks the missing registry.
- From 18:00 UTC on, a value that is still missing is copied from the previous day, and the status says which one: `carried:marketplace`, `carried:openvsx`, or `carried` for both. The series has no gap, and the data stay honest.
- A day without any run (GitHub dropped every schedule) is copied too, with the `carried` status, on the next run. So is a day left `partial`.
- Totals equal to the previous day are a measured day, with the `ok` status.
- A counter going down is kept, with a notice in the log: the Marketplace sometimes corrects its numbers.
- The very first line is only written once both registries have answered, since there is no previous day to copy.

**Failures and emails.** The runs of 00:17, 06:17 and 12:17 never fail because of a registry: they only add a warning to the log. A run fails only when it had to copy a value, or when it found nothing at all from 18:00 on. GitHub then sends a single email. The values are still committed before the run fails.

**Security.** No secret: the job's `GITHUB_TOKEN` gets `contents: write`, for this job only, and the workflow never runs in forks. Actions are pinned to a commit. The job stops after 5 minutes, and two runs never overlap.

**By hand:**

- Run it now: **Actions** > **Stats** > **Run workflow**, on `main`, or `gh workflow run stats.yml`. A run after 18:00 UTC can turn a `carried` line of the day back into a measured one.
- Test the script locally, without touching the branch: `node scripts/stats/collect.cjs <empty folder>`. It writes `downloads.csv` and `README.md` there, from the live APIs. `npm run test:unit` covers it with fake answers.
- Read the data: open the `stats` branch on GitHub, or `git fetch origin stats && git show origin/stats:downloads.csv`.
- Pause it: **Actions** > **Stats** > **...** > **Disable workflow** (**Enable workflow** to start again). The days in between are then copied with the `carried` status on the next run, so check the line count before pausing for long. GitHub also disables scheduled workflows after 60 days without activity in the repository.
- Delete the data: delete the `stats` branch on GitHub (**Branches** > the bin icon), after removing its protection rule. The next run starts a new branch with no history.

**Branch protection.** A ruleset on `stats` should block deletion and force pushes, like the one on `main`, without blocking normal pushes: the workflow only adds commits.

## Dependencies and security

[Dependabot](.github/dependabot.yml) opens a weekly pull request for the development tools and the GitHub Actions. Merge it when the CI passes. `@types/vscode` is left out, because it must stay on the minimum VS Code version declared in `package.json`. Major updates of `@types/node` and `typescript` are ignored too: the first follows the Node.js version used in CI, and nothing in the project runs the TypeScript compiler.

[CodeQL](.github/workflows/codeql.yml) analyzes the JavaScript and the Python scripts on `main`, on pull requests and every week. Results appear in the **Security** tab.

## Pull requests

- Create a branch from `main` (for example `feat/...` or `fix/...`).
- Keep commits focused and use the existing prefixes: `ADDED:`, `CHANGED:`, `FIXED:`, `REMOVED:`, `DOCS:`.
- Make sure `npm run lint`, `npm test`, `npm run themes:audit`, `npm run themes:check`, `npm run themes:variety`, `npm run themes:test` and `npm run themes:report-check` pass.
- Add a line to the `[Unreleased]` section of the [CHANGELOG](CHANGELOG.md) for user-facing changes.
