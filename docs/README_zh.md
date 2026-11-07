# 365 Day & Night Themes – 每个月都有的无障碍 VS Code 主题

**为 Visual Studio Code 打造的 36 款配色主题：一年中每个月都有浅色、深色和高对比度三款主题。** 一键切换白天与夜晚，或交给扩展自动完成。每款主题都经过可读性（WCAG 对比度）和色盲友好性测试。

[![Marketplace 版本](https://img.shields.io/visual-studio-marketplace/v/mickaellherminez.365-daynight-vscode-theme-ext?label=Marketplace)](https://marketplace.visualstudio.com/items?itemName=mickaellherminez.365-daynight-vscode-theme-ext)
[![安装量](https://img.shields.io/visual-studio-marketplace/i/mickaellherminez.365-daynight-vscode-theme-ext)](https://marketplace.visualstudio.com/items?itemName=mickaellherminez.365-daynight-vscode-theme-ext)
[![MIT 许可证](https://img.shields.io/github/license/mickaellherminez/365-daynight-vscode-theme-ext)](../LICENSE)

*其他语言：[English](../README.md) · [Français](README_fr.md) · [Español](README_es.md) · [Deutsch](README_de.md) · [Português](README_pt.md) · [Русский](README_ru.md) · [日本語](README_ja.md) · [हिंदी](README_hi.md) · [العربية](README_ar.md)*

![VS Code 中十月的浅色、深色和高对比度主题：资源管理器、标签页、语法高亮、文本选择和状态栏](https://raw.githubusercontent.com/mickaellherminez/365-daynight-vscode-theme-ext/main/assets/screenshots/hero.png)

## 你会喜欢它的理由

- 🗓️ **每个月焕然一新。** 一月的白雪与冬日蓝、三月的春绿、七月的阳光、十月的秋色、十二月的炉火暖意：你的编辑器随季节变化。
- ☀️🌙 **白天与夜晚，始终搭配。** 每个月都有适合白天的浅色主题、适合晚上的深色主题，以及需要最高可读性时使用的高对比度主题。10 月还有一款浅色高对比度主题（High Contrast Light），这是推广到其他月份之前的首次尝试。
- 🔁 **一键切换。** 状态栏上的按钮可在浅色和深色之间切换。高对比度可通过命令启用。
- ⏰ **可选的自动模式。** 扩展可以自动应用当月主题：白天浅色，夜晚深色。
- 👁️ **护眼且人人可读。** 所有文字都符合 WCAG 对比度标准，语法颜色对色盲用户同样易于区分。
- 🖥️ **精心设计。** 编辑器、侧边栏、标签页、终端、调试控制台、通知和状态栏全部经过设计，每个主题包含 480 多种颜色。聊天、测试结果、符号图标、Git 图、合并编辑器和多文件差异也同样采用当月的调色板。

## 安装

**在 VS Code 中：** 打开扩展视图（`Ctrl+Shift+X`，Mac 上为 `Cmd+Shift+X`），搜索 **365 Day & Night Themes**，然后点击**安装**。

**通过 Marketplace：** [安装 365 Day & Night Themes](https://marketplace.visualstudio.com/items?itemName=mickaellherminez.365-daynight-vscode-theme-ext)。

**通过命令行：**

```sh
code --install-extension mickaellherminez.365-daynight-vscode-theme-ext
```

需要 Visual Studio Code 1.96 或更高版本。

## 快速上手

1. 打开主题选择器：先按 `Ctrl+K`，再按 `Ctrl+T`（Mac 上为 `Cmd+K`，再按 `Cmd+T`）。
2. 输入 **365** 查看全部主题，例如 `365 10-October Dark`。
3. 选择一款，就完成了！

首次使用 365 主题时，会有一条通知提供自动切换：**Follow the clock**（跟随时间：白天浅色，夜晚深色）、**Follow my system**（跟随系统的浅色或深色模式）或 **No thanks**（不用了）。除非你做出选择，否则什么都不会改变，而且这个问题只问一次。做出选择后，会有一条消息确认已开启的内容，并提供 **Open Settings** 按钮，用于更改时间或关闭。之后若想改变主意，请参阅下文的自动切换部分。

使用**状态栏按钮**（右下角：`LGT`、`DRK`、`HCT` 或 `HCL`）可在当月的浅色和深色版本之间切换。如需高对比度，请在命令面板中运行 `365: Apply High Contrast theme`。使用高对比度主题时，按钮会在深色高对比度（`HCT`）和浅色高对比度（`HCL`）之间切换，点击不会离开高对比度。没有浅色高对比度的月份会改为回到浅色主题：目前只有 10 月提供。要离开高对比度，请运行 `365: Apply Light theme` 或 `365: Apply Dark theme`。 也可以将鼠标悬停在按钮上，点击 **Light** 或 **Dark** 链接。

要试用其他月份，请点击两侧的箭头（`‹ 10 DRK ›`）。数字表示月份，从 `01` 到 `12`，箭头会保持版本不变：浅色、深色、高对比度或浅色高对比度。在还没有浅色高对比度的月份，它会变为深色高对比度。12 月之后是 1 月。要返回，请在命令面板中运行 `365: Back to the current month`。箭头和数字仅在使用 365 主题时显示。 将鼠标悬停在按钮上可查看完整的主题名称，以及指向高对比度、浅色高对比度（该月提供时）和当前月份的链接。 使用高对比度主题时，提示中改为显示指向 Light 和 Dark 的链接。

## 12 个月

![36 款主题预览：一月到十二月每个月的浅色、深色和高对比度版本](https://raw.githubusercontent.com/mickaellherminez/365-daynight-vscode-theme-ext/main/assets/screenshots/year.png)

| 月份 | 浅色 | 深色 | 高对比度 |
| --- | --- | --- | --- |
| 一月 | 霜白与冰川蓝 | 深冬蓝与冰蓝 | 黑色与冰蓝 |
| 二月 | 白与绿，点缀情人节红 | 北欧石板灰与霜色 | 藏青与金色 |
| 三月 | 奶油色与春绿 | 靛蓝夜色 | 深青与橙红 |
| 四月 | 阵雨天空与樱花粉 | 雨中石板灰与樱花粉 | 黑色与樱花粉 |
| 五月 | 明亮白与橙色 | 带橙色点缀的海洋夜色 | 藏青与天蓝 |
| 六月 | 天蓝与靛蓝墨色 | 橙色点亮的蓝色夜晚 | 黑色与珊瑚色 |
| 七月 | 烈日：奶油、棕与橙 | 受 Solarized 启发的夏夜 | 藏青、橙与金 |
| 八月 | 暖奶油色与靛蓝墨色 | 黄色点缀的石板夜色 | 黑色与霓虹绿 |
| 九月 | 开学季天空与深蓝墨色 | 石板灰与青色 | 黑色与亮橙 |
| 十月 | 秋日奶油、焦橙与琥珀 | 深棕与余烬 | 暖黑与琥珀 |
| 十一月 | 雾中灰褐与苔绿 | 林下灰与苔绿 | 黑色与苔绿 |
| 十二月 | 霜白与青色 | 炉火旁：石板灰与余烬 | 冬夜与冰青 |

## 白天与夜晚自动切换

希望编辑器跟随时间变化？开启自动模式：

1. 打开设置（`Ctrl+,` 或 `Cmd+,`），搜索 **365DayNight**。
2. 勾选 **365DayNight: Enable**。

或在 `settings.json` 中添加：

```json
{
  "365DayNight.enable": true,
  "365DayNight.mode": "auto"
}
```

| 模式 | 作用 |
| --- | --- |
| `auto` | 默认 7:00 至 19:00 使用浅色主题，其余时间使用深色主题。时间可以更改（见下文） |
| `day` | 始终使用当月的浅色主题 |
| `night` | 始终使用当月的深色主题 |
| `system` | 跟随系统的浅色、深色和高对比度外观（见下文） |

每个月的第一天，扩展还会切换到新月份的主题。

须知：

- **由你决定。** 自动模式默认关闭：未经你同意，扩展绝不会更改主题。 首次使用 365 主题时，会有一条通知询问你一次是否需要它。
- **尊重你的选择。** 如果你手动选择了主题，它会一直保留到下一次时段变化（白天转夜晚或新的月份）。
- **你选择的月份也会保留。** 如果你通过箭头或主题选择器选择了其他月份，自动模式会继续在该月份的浅色和深色之间切换，直到下一个实际月份开始，重启后也一样。要提前返回，请运行 `365: Back to the current month`。
- **高对比度保持高对比度。** 如果你使用深色或浅色高对比度主题，自动模式只会更新月份，不会改变版本。在没有浅色高对比度的月份，会使用深色高对比度。

### 选择时间

默认情况下，浅色主题从 7:00 开始，深色主题从 19:00 开始。要更改这些时间：

1. 打开设置（`Ctrl+,` 或 `Cmd+,`），搜索 **365DayNight**。
2. 设置 **365DayNight: Day Start** 和 **365DayNight: Night Start**，格式为 24 小时制的 HH:MM。

或在 `settings.json` 中添加：

```json
{
  "365DayNight.dayStart": "08:30",
  "365DayNight.nightStart": "20:00"
}
```

- **很快生效。** 新时间会在你停止输入约 2 秒后生效，即使你手动选择了主题也是如此。之后，主题会在你选择的那一分钟切换。
- **跨越午夜。** 如果白天在夜晚之后开始，例如 `"20:00"` 和 `"06:00"`，浅色主题会跨越午夜。适合夜间工作的人。
- **无效的值。** 无法读取的时间（如 `"25:00"` 或 `"7h"`）会被替换为默认值，并只提示一次警告。两个相同的时间会使用 7:00 和 19:00。
- **仅限 `auto` 模式。** `day`、`night` 和 `system` 模式会忽略这些时间。
- **恢复为 7:00 和 19:00。** 在设置中点击每个时间旁的齿轮图标并选择 **Reset Setting**，或从 `settings.json` 中删除这两行。

### 跟随系统

想跟随系统外观而不是时间？请使用 `system` 模式：

1. 打开设置（`Ctrl+,` 或 `Cmd+,`），搜索 **365DayNight**。
2. 勾选 **365DayNight: Enable**。
3. 将 **365DayNight: Mode** 设为 `system`。

或在 `settings.json` 中添加：

```json
{
  "365DayNight.enable": true,
  "365DayNight.mode": "system"
}
```

| 系统使用 | 应用的主题 |
| --- | --- |
| 浅色外观 | 当月的浅色主题 |
| 深色外观 | 当月的深色主题 |
| 高对比度，深色外观 | 当月的高对比度主题 |
| 高对比度，浅色外观 | 当月的浅色高对比度主题。其他月份在提供此版本之前保留你的设置，默认是 VS Code 自带的 High Contrast Light 主题 |

此模式下的按钮：
- **箭头。** `‹` 和 `›` 更改所有版本的月份。该月份会一直保留到下一个实际月份开始，即使重启也不变。要提前返回，请运行 `365: Back to the current month`。
- **中间按钮。** 浅色和深色由系统决定，因此点击只会显示说明。`365: Apply Light theme`、`365: Apply Dark theme`、`365: Apply High Contrast theme` 和 `365: Apply High Contrast Light theme` 命令也会显示同样的说明，不做任何更改。
- **主题选择器。** 选择 365 主题会把它的月份应用到所有版本。选择其他发布者的主题只会替换当前使用的版本：它在之后的月份中也会保留，按钮此时不显示箭头和月份。点击中间按钮可恢复 365 主题。


- **更改的内容。** 此模式会开启 `window.autoDetectColorScheme`，并把当月主题写入 `workbench.preferredLightColorTheme`、`workbench.preferredDarkColorTheme`、`workbench.preferredHighContrastColorTheme` 和 `workbench.preferredHighContrastLightColorTheme`。最后一项只在有浅色高对比度主题的月份写入，其他月份会恢复你的值。`workbench.colorTheme` 不会改变。
- **如何恢复。** 取消勾选 **365DayNight: Enable**，或选择其他模式。你的原始设置会恢复，原本不存在的设置会再次被移除。在此期间你更改过的设置会保留你的值。
- **卸载或禁用扩展之前。** 请先退出此模式，因为之后扩展无法再恢复任何内容。如果忘记了，请从 `settings.json` 中删除上述五项设置。
- **高对比度。** VS Code 优先采用系统的高对比度。要忽略它，请关闭 `window.autoDetectHighContrast`：此模式绝不会更改该设置。
- **关闭检测。** 如果你自己关闭 `window.autoDetectColorScheme`，扩展会保持关闭，按钮照常工作。工作区中的主题设置在该工作区内仍然优先。
- **操作系统。** 根据 VS Code 文档，浅色或深色外观可在 Windows 和 macOS 上检测。

## 无障碍优先

每款主题都通过了包含 250 多项检查的自动化无障碍审核：

- **文字清晰可读：** 编辑器文字和语法颜色在浅色和深色主题中对比度至少为 **4.5:1（WCAG AA）**，在高对比度主题中至少为 **7:1（WCAG AAA）**。
- **色盲友好：** 语法颜色（关键字、函数、字符串、数字、类、注释）和提示（错误、警告、Git 更改）都经过**红色盲、绿色盲和蓝色盲**模拟，确保仍可区分。
- **不只依赖颜色：** 注释、参数和属性使用*斜体*，已弃用的代码显示~~删除线~~，无效代码带有下划线。
- **处处可见的选择：** 在编辑器、终端和调试控制台中，文本选择都清晰可见，且不会与搜索结果混淆。
- **高对比度主题：** 选中的文字变为浅蓝底黑字（浅色高对比度中为深蓝底白字），所有面板都有可见边框和醒目的键盘焦点轮廓。
- **屏幕阅读器：** 状态栏按钮的每个部分都有自己的语音标签，例如“Next month: November”。

发现难以阅读的颜色？请[提交 issue](https://github.com/mickaellherminez/365-daynight-vscode-theme-ext/issues)，我们随时欢迎关于无障碍的反馈。

## 命令

打开命令面板（`Ctrl+Shift+P` 或 `Cmd+Shift+P`），输入 **365**：

| 命令 | 作用 |
| --- | --- |
| `365: Toggle between Light and Dark themes` | 在浅色和深色之间切换（与状态栏按钮相同） |
| `365: Apply Light theme` | 应用所显示月份的浅色主题 |
| `365: Apply Dark theme` | 应用所显示月份的深色主题 |
| `365: Apply High Contrast theme` | 应用所显示月份的高对比度主题 |
| `365: Apply High Contrast Light theme` | 应用所显示月份的浅色高对比度主题。还没有该主题的月份会改用深色高对比度主题，并显示提示 |
| `365: Next month` | 以相同版本应用下个月的主题 |
| `365: Previous month` | 以相同版本应用上个月的主题 |
| `365: Back to the current month` | 以相同版本应用实际当月的主题 |

此扩展默认不定义任何键盘快捷键。要设置自己的快捷键，请打开快捷键列表（`Ctrl+K Ctrl+S`，Mac 上为 `Cmd+K Cmd+S`），输入 **365**，双击某个命令，然后按下你的按键。

## 设置

| 设置 | 默认值 | 说明 |
| --- | --- | --- |
| `365DayNight.enable` | `false` | 自动应用当月主题 |
| `365DayNight.mode` | `auto` | `auto`（按时间）、`day`（始终浅色）、`night`（始终深色）或 `system`（跟随系统） |
| `365DayNight.dayStart` | `"07:00"` | `auto` 模式下浅色主题开始的时间，格式为 HH:MM |
| `365DayNight.nightStart` | `"19:00"` | `auto` 模式下深色主题开始的时间，格式为 HH:MM |
| `365DayNight.toggleIncludesHighContrast` | `false` | 状态栏按钮依次切换所有版本：浅色、深色、高对比度，以及该月提供时的浅色高对比度 |

## 常见问题

**如何让 VS Code 在浅色和深色主题之间自动切换？**
安装扩展并设置 `"365DayNight.enable": true`。7:00 至 19:00 使用浅色主题，夜间使用深色主题。 你可以通过 `365DayNight.dayStart` 和 `365DayNight.nightStart` 更改这些时间。

**VS Code 能否使用这些主题跟随系统的浅色或深色模式？**
可以。设置 `"365DayNight.enable": true` 和 `"365DayNight.mode": "system"`。浅色和深色由系统决定，扩展会让主题保持在当前月份。

**有适合色盲用户的 VS Code 主题吗？**
有。全部主题都经过红色盲、绿色盲和蓝色盲模拟测试，并使用斜体、下划线和删除线，让信息从不只依赖颜色。

**扩展会在未经询问的情况下更改我的主题吗？**
不会。自动模式默认关闭。未开启时，只有在你选择主题或点击状态栏按钮时主题才会改变。 首次使用 365 主题时，会有一条通知提供该功能，除非你做出选择，否则什么都不会改变。

**我可以只使用一款主题吗，比如 October Dark？**
当然可以。在主题选择器（`Ctrl+K Ctrl+T`）中选择它，并保持自动模式关闭即可。

**高对比度主题有什么用？**
它们专为低视力、强光环境或长时间编码而设计，提供最高对比度（AAA）、可见边框和醒目的焦点轮廓。每个月都有深色版本。浅色版本 High Contrast Light 目前只有 10 月提供，其他月份随后跟进。

## 路线图

欢迎在 [GitHub issues](https://github.com/mickaellherminez/365-daynight-vscode-theme-ext/issues) 中提出想法和建议。

## 反馈与贡献

- ⭐ 喜欢这些主题？在 [Marketplace 上留下评价](https://marketplace.visualstudio.com/items?itemName=mickaellherminez.365-daynight-vscode-theme-ext&ssr=false#review-details)，帮助其他开发者发现它们。
- 🐞 发现 bug、难以阅读的颜色或有新想法：[提交 issue](https://github.com/mickaellherminez/365-daynight-vscode-theme-ext/issues)。
- 🛠️ 想要参与贡献？请参阅 [CONTRIBUTING.md](../CONTRIBUTING.md)（英文）。

版本说明见 [CHANGELOG](../CHANGELOG.md)。

## 许可证

[MIT](../LICENSE) © Mickaël Lherminez
