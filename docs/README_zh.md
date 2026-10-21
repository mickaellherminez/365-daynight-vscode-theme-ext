# 365 Day & Night Themes – 每个月都有的无障碍 VS Code 主题

**为 Visual Studio Code 打造的 36 款配色主题：一年中每个月都有浅色、深色和高对比度三款主题。** 一键切换白天与夜晚，或交给扩展自动完成。每款主题都经过可读性（WCAG 对比度）和色盲友好性测试。

[![Marketplace 版本](https://img.shields.io/visual-studio-marketplace/v/mickaellherminez.365-daynight-vscode-theme-ext?label=Marketplace)](https://marketplace.visualstudio.com/items?itemName=mickaellherminez.365-daynight-vscode-theme-ext)
[![安装量](https://img.shields.io/visual-studio-marketplace/i/mickaellherminez.365-daynight-vscode-theme-ext)](https://marketplace.visualstudio.com/items?itemName=mickaellherminez.365-daynight-vscode-theme-ext)
[![MIT 许可证](https://img.shields.io/github/license/mickaellherminez/365-daynight-vscode-theme-ext)](../LICENSE)

*其他语言：[English](../README.md) · [Français](README_fr.md) · [Español](README_es.md) · [Deutsch](README_de.md) · [Português](README_pt.md) · [Русский](README_ru.md) · [日本語](README_ja.md) · [हिंदी](README_hi.md) · [العربية](README_ar.md)*

![VS Code 中十月的浅色、深色和高对比度主题：资源管理器、标签页、语法高亮、文本选择和状态栏](https://raw.githubusercontent.com/mickaellherminez/365-daynight-vscode-theme-ext/main/assets/screenshots/hero.png)

## 你会喜欢它的理由

- 🗓️ **每个月焕然一新。** 一月的白雪与冬日蓝、三月的春绿、七月的阳光、十月的秋色、十二月的炉火暖意：你的编辑器随季节变化。
- ☀️🌙 **白天与夜晚，始终搭配。** 每个月都有适合白天的浅色主题、适合晚上的深色主题，以及需要最高可读性时使用的高对比度主题。
- 🔁 **一键切换。** 状态栏上的按钮可在浅色、深色和高对比度之间循环切换。
- ⏰ **可选的自动模式。** 扩展可以自动应用当月主题：白天浅色，夜晚深色。
- 👁️ **护眼且人人可读。** 所有文字都符合 WCAG 对比度标准，语法颜色对色盲用户同样易于区分。
- 🖥️ **完整的主题。** 编辑器、侧边栏、标签页、终端、调试控制台、通知和状态栏全部经过设计，不会回退到默认颜色。

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
2. 输入 **365** 查看全部 36 款主题，例如 `365 10-October Dark`。
3. 选择一款，就完成了！

使用**状态栏按钮**（右下角：`LGT`、`DRK` 或 `HCT`）可在当月的浅色、深色和高对比度版本之间切换。

## 12 个月

![36 款主题预览：一月到十二月每个月的浅色、深色和高对比度版本](https://raw.githubusercontent.com/mickaellherminez/365-daynight-vscode-theme-ext/main/assets/screenshots/year.png)

| 月份 | 浅色 | 深色 | 高对比度 |
| --- | --- | --- | --- |
| 一月 | 雪白与冬日蓝 | 金色点缀的藏青夜色 | 黑色与亮蓝 |
| 二月 | 白与绿，点缀情人节红 | 北欧石板灰与霜色 | 藏青与金色 |
| 三月 | 奶油色与春绿 | 靛蓝夜色 | 深青与橙红 |
| 四月 | 奶油色与复活节橙 | 蓝调石板灰与金色 | 深蓝与金色 |
| 五月 | 明亮白与橙色 | 带橙色点缀的海洋夜色 | 藏青与天蓝 |
| 六月 | 天蓝与靛蓝墨色 | 橙色点亮的蓝色夜晚 | 黑色与珊瑚色 |
| 七月 | 烈日：奶油、棕与橙 | 受 Solarized 启发的夏夜 | 藏青、橙与金 |
| 八月 | 暖奶油色与靛蓝墨色 | 黄色点缀的石板夜色 | 黑色与霓虹绿 |
| 九月 | 开学季天空与深蓝墨色 | 石板灰与青色 | 黑色与亮橙 |
| 十月 | 秋日奶油、焦橙与琥珀 | 深棕与余烬 | 暖黑与琥珀 |
| 十一月 | 薄雾、石板灰与钢蓝 | 深石板灰、橙与金 | 黑色与金色 |
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
| `auto` | 7:00 至 19:00 使用浅色主题，其余时间使用深色主题 |
| `day` | 始终使用当月的浅色主题 |
| `night` | 始终使用当月的深色主题 |

每个月的第一天，扩展还会切换到新月份的主题。

须知：

- **由你决定。** 自动模式默认关闭：未经你同意，扩展绝不会更改主题。
- **尊重你的选择。** 如果你手动选择了主题，它会一直保留到下一次时段变化（白天转夜晚或新的月份）。
- **高对比度保持高对比度。** 如果你使用高对比度主题，自动模式只会更新月份，不会改变对比度级别。

## 无障碍优先

每款主题都通过了包含 130 多项检查的自动化无障碍审核：

- **文字清晰可读：** 编辑器文字和语法颜色在浅色和深色主题中对比度至少为 **4.5:1（WCAG AA）**，在高对比度主题中至少为 **7:1（WCAG AAA）**。
- **色盲友好：** 语法颜色（关键字、函数、字符串、数字、类、注释）和提示（错误、警告、Git 更改）都经过**红色盲、绿色盲和蓝色盲**模拟，确保仍可区分。
- **不只依赖颜色：** 注释、参数和属性使用*斜体*，已弃用的代码显示~~删除线~~，无效代码带有下划线。
- **处处可见的选择：** 在编辑器、终端和调试控制台中，文本选择都清晰可见，且不会与搜索结果混淆。
- **高对比度主题：** 选中的文字变为浅蓝底黑字，所有面板都有可见边框和醒目的键盘焦点轮廓。

发现难以阅读的颜色？请[提交 issue](https://github.com/mickaellherminez/365-daynight-vscode-theme-ext/issues)，我们随时欢迎关于无障碍的反馈。

## 命令

打开命令面板（`Ctrl+Shift+P` 或 `Cmd+Shift+P`），输入 **365**：

| 命令 | 作用 |
| --- | --- |
| `365: Toggle between Light, Dark and High Contrast themes` | 在浅色 → 深色 → 高对比度之间循环（与状态栏按钮相同） |
| `365: Apply Light theme` | 应用当月的浅色主题 |
| `365: Apply Dark theme` | 应用当月的深色主题 |
| `365: Apply High Contrast theme` | 应用当月的高对比度主题 |

这些命令也可以在编辑器中右键，通过 **365 Themes** 菜单使用。你还可以为它们设置自己的快捷键（`Ctrl+K Ctrl+S`）。

## 设置

| 设置 | 默认值 | 说明 |
| --- | --- | --- |
| `365DayNight.enable` | `false` | 自动应用当月主题 |
| `365DayNight.mode` | `auto` | `auto`（按时间）、`day`（始终浅色）或 `night`（始终深色） |

## 常见问题

**如何让 VS Code 在浅色和深色主题之间自动切换？**
安装扩展并设置 `"365DayNight.enable": true`。7:00 至 19:00 使用浅色主题，夜间使用深色主题。

**有适合色盲用户的 VS Code 主题吗？**
有。全部 36 款主题都经过红色盲、绿色盲和蓝色盲模拟测试，并使用斜体、下划线和删除线，让信息从不只依赖颜色。

**扩展会在未经询问的情况下更改我的主题吗？**
不会。自动模式默认关闭。未开启时，只有在你选择主题或点击状态栏按钮时主题才会改变。

**我可以只使用一款主题吗，比如 October Dark？**
当然可以。在主题选择器（`Ctrl+K Ctrl+T`）中选择它，并保持自动模式关闭即可。

**高对比度主题有什么用？**
它们专为低视力、强光环境或长时间编码而设计，提供最高对比度（AAA）、可见边框和醒目的焦点轮廓。

**有节日主题吗？**
暂时还没有。新年、复活节、万圣节和圣诞节主题正在计划中。关注 [GitHub 项目](https://github.com/mickaellherminez/365-daynight-vscode-theme-ext)以获取通知。

## 路线图

- 🎉 节日主题（新年、复活节、万圣节、圣诞节）
- ⏰ 可配置的白天和夜晚时间

欢迎在 [GitHub issues](https://github.com/mickaellherminez/365-daynight-vscode-theme-ext/issues) 中提出想法和建议。

## 反馈与贡献

- ⭐ 喜欢这些主题？在 [Marketplace 上留下评价](https://marketplace.visualstudio.com/items?itemName=mickaellherminez.365-daynight-vscode-theme-ext&ssr=false#review-details)，帮助其他开发者发现它们。
- 🐞 发现 bug、难以阅读的颜色或有新想法：[提交 issue](https://github.com/mickaellherminez/365-daynight-vscode-theme-ext/issues)。
- 🛠️ 想要参与贡献？请参阅 [CONTRIBUTING.md](../CONTRIBUTING.md)（英文）。

版本说明见 [CHANGELOG](../CHANGELOG.md)。

## 许可证

[MIT](../LICENSE) © Mickaël Lherminez
