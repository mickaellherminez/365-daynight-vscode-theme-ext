# Download statistics

This branch only holds data. It shares no history with `main` and is written by the [Stats workflow](https://github.com/mickaellherminez/365-daynight-vscode-theme-ext/blob/main/.github/workflows/stats.yml), which runs `scripts/stats/collect.cjs` from `main`. Do not edit it by hand: the next run would refuse a file it cannot read.

## downloads.csv

One line per day (UTC), with the running totals as the registries publish them. The daily gains are the difference between two lines.

| Column | Source | Meaning |
| --- | --- | --- |
| `date` | | The day of the measurement, in UTC |
| `marketplace_install` | Visual Studio Marketplace, `install` | New installs |
| `marketplace_update` | Visual Studio Marketplace, `updateCount` | Updates of an installed version |
| `marketplace_download` | Visual Studio Marketplace, `downloadCount` | Downloads as counted by the Marketplace. It is not the sum of the two columns above |
| `openvsx_download` | Open VSX, `downloadCount` | Downloads from Open VSX (VSCodium, Cursor and other editors). Open VSX does not tell installs from updates, and mirrors or bots may add to this count |
| `status` | | See below |

| Status | Meaning |
| --- | --- |
| `ok` | Both registries answered. Totals equal to the previous day mean that nothing changed |
| `partial` | One registry has not answered yet. Its columns are empty, and a later run of the same day tries again |
| `carried:marketplace`, `carried:openvsx` | That registry did not answer all day: its values are copied from the previous day, so the series has no gap. The next measured day includes the gains of both days |
| `carried` | Neither registry answered, or the workflow did not run that day: every value is copied from the previous day |

Both APIs are public and only give the current totals, with no history. A day that is not recorded cannot be measured later.

The Marketplace sometimes lowers its counters slightly when it corrects them. Such a decrease is kept as it was published.

## How it is collected

The workflow runs at 00:17, 06:17, 12:17 and 18:17 UTC. A run stops at once when the line of the day is complete, so the later runs are only retries. From the 18:17 run on, a missing value is copied from the previous day and the run fails, so a real gap is reported once.
