# Contributing to 365 Day & Night Themes

Thanks for your interest! Bug reports, accessibility feedback and pull requests are welcome.

- **Report a bug or a hard-to-read color:** [open an issue](https://github.com/mickaellherminez/365-daynight-vscode-theme-ext/issues). Please mention the theme name (for example `365 10-October Dark`), what is hard to read, and a screenshot if possible.
- **Suggest a feature:** open an issue describing your use case.

## Project structure

| Path | Content |
| --- | --- |
| `package.json` | Extension manifest: themes, commands, menus and settings |
| `extension.js` | Status bar toggle, commands and automatic day/night switching |
| `themes/` | The 36 generated color themes (`365-MM-light`, `365-MM-dark`, `365-MM-hc-dark`) |
| `scripts/themes/` | Theme generator, accessibility audit and preview images ([documentation](scripts/themes/README.md)) |
| `test/` | Integration tests run inside VS Code |
| `docs/` | Translated README files |

## Development

Requirements: Node.js 20.19+ or 22.12+, and Python 3.8+ for the theme tools.

```sh
npm install
```

- Press `F5` in VS Code (configuration **Run Extension**) to open a new window with the extension loaded.
- After a change, reload that window with `Ctrl+R` (`Cmd+R` on Mac).
- Set breakpoints in `extension.js` and check the output in the Debug Console.

### Tests and lint

```sh
npm run lint
npm test        # downloads the latest stable VS Code and runs the tests inside it
```

If you run the tests from VS Code's integrated terminal, use `env -u ELECTRON_RUN_AS_NODE npm test`: that terminal sets `ELECTRON_RUN_AS_NODE`, which prevents the test instance of VS Code from starting.

## Changing a theme

Theme files are **generated**: do not edit `themes/*.json` by hand.

1. Edit the month's palette in `scripts/themes/palettes/MM.json`.
2. Check accessibility: `npm run themes:build -- MM` (nothing is written).
3. When the audit reports 0 problems, write the files: `npm run themes:build -- MM --write`.
4. Regenerate the README previews: `python3 scripts/themes/preview.py`.
5. Test the result with `F5`, including text selection in the terminal and the debug console.

`npm run themes:audit` checks all 36 themes. See [scripts/themes/README.md](scripts/themes/README.md) for the palette roles and the audit rules.

## Packaging

```sh
npm run package   # creates 365-daynight-vscode-theme-ext-<version>.vsix
```

See [Publishing Extensions](https://code.visualstudio.com/api/working-with-extensions/publishing-extension) for publishing to the Marketplace.

## Pull requests

- Create a branch from `main` (for example `feat/...` or `fix/...`).
- Keep commits focused and use the existing prefixes: `ADDED:`, `CHANGED:`, `FIXED:`, `REMOVED:`, `DOCS:`.
- Make sure `npm run lint`, `npm test` and `npm run themes:audit` pass.
- Add a line to the `[Unreleased]` section of the [CHANGELOG](CHANGELOG.md) for user-facing changes.
