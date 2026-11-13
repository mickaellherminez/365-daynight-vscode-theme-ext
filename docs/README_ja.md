# 365 Day & Night – Monthly Accessible Themes

**VS Code に毎月新しい雰囲気を。ワンクリックでも自動でも昼と夜を切り替えられる、48 のアクセシブルなテーマです。**

[![Marketplace のバージョン](https://vsmarketplacebadges.dev/version-short/mickaellherminez.365-daynight-vscode-theme-ext.svg?subject=Marketplace&style=flat)](https://marketplace.visualstudio.com/items?itemName=mickaellherminez.365-daynight-vscode-theme-ext)
[![インストール数](https://vsmarketplacebadges.dev/installs-short/mickaellherminez.365-daynight-vscode-theme-ext.svg?style=flat)](https://marketplace.visualstudio.com/items?itemName=mickaellherminez.365-daynight-vscode-theme-ext)
[![ダウンロード数](https://vsmarketplacebadges.dev/downloads-short/mickaellherminez.365-daynight-vscode-theme-ext.svg?style=flat)](https://marketplace.visualstudio.com/items?itemName=mickaellherminez.365-daynight-vscode-theme-ext)
[![評価](https://vsmarketplacebadges.dev/rating-short/mickaellherminez.365-daynight-vscode-theme-ext.svg?style=flat)](https://marketplace.visualstudio.com/items?itemName=mickaellherminez.365-daynight-vscode-theme-ext&ssr=false#review-details)
[![Open VSX のダウンロード数](https://img.shields.io/open-vsx/dt/mickaellherminez/365-daynight-vscode-theme-ext?label=Open%20VSX%20downloads)](https://open-vsx.org/extension/mickaellherminez/365-daynight-vscode-theme-ext)
[![CI の状態](https://img.shields.io/github/actions/workflow/status/mickaellherminez/365-daynight-vscode-theme-ext/ci.yml?branch=main&label=CI)](https://github.com/mickaellherminez/365-daynight-vscode-theme-ext/actions/workflows/ci.yml)
[![MIT ライセンス](https://img.shields.io/github/license/mickaellherminez/365-daynight-vscode-theme-ext)](../LICENSE)

```sh
code --install-extension mickaellherminez.365-daynight-vscode-theme-ext
```

[Marketplace](https://marketplace.visualstudio.com/items?itemName=mickaellherminez.365-daynight-vscode-theme-ext) または [Open VSX](https://open-vsx.org/extension/mickaellherminez/365-daynight-vscode-theme-ext) からもインストールできます。VS Code 1.96 以降が必要です。

[ウェブサイト](https://365daynight.mickaellherminez.net/ja/)で各月と各バリアントをプレビューし、監査結果をグラフで確認できます。

*他の言語で読む：[English](../README.md) · [Français](README_fr.md) · [Español](README_es.md) · [Deutsch](README_de.md) · [Português](README_pt.md) · [Русский](README_ru.md) · [中文](README_zh.md) · [हिंदी](README_hi.md) · [العربية](README_ar.md)*

![VS Code でのデモ：ステータスバーのボタンの矢印で月を 10 月から 12 月に変え、ボタンをクリックして Light から Dark に切り替え、ツールチップのリンクで High Contrast を適用します](https://raw.githubusercontent.com/mickaellherminez/365-daynight-vscode-theme-ext/main/assets/screenshots/demo-months.gif)

## 選ばれる理由

### 🗓️ 毎月、新しい雰囲気に

1 月は霜、3 月は若芽、7 月はラグーン、10 月は紅葉、12 月は極夜。 エディター、サイドバー、タブ、ターミナル、ステータスバー、チャット、Git グラフ、マージエディターまで、ウィンドウ全体が季節とともに変わります。

**根拠：** 12 か月それぞれに Light、Dark、High Contrast、High Contrast Light の 4 テーマがあり、各テーマに 480 色以上を定義しています。[すべて見る](#12-か月)。

### 👁️ 読みやすさを保つ設計

テキストのコントラストは、Light と Dark のテーマで 4.5:1 以上（WCAG AA）、High Contrast のテーマで 7:1 以上（WCAG AAA）です。構文の色、エラー、Git の変更は色覚多様性があっても区別でき、コメント、非推奨のコード、無効なコードは斜体、取り消し線、下線でも区別されます。

**根拠：** 各テーマは公開のたびに 250 項目以上の自動監査に合格する必要があり、[詳しいレポート](AUDIT.md)で各テーマの結果と監査の限界を確認できます。色覚はシミュレーションで確認しているため、実際の利用者の声を歓迎します。[テスター募集に参加する](https://github.com/mickaellherminez/365-daynight-vscode-theme-ext/issues/47)。

### 🌗 昼も夜も、意識せずに

ステータスバーのボタンをクリックすると Light と Dark を切り替えられます。指定した時刻や、システムの外観に合わせて自動で切り替えることもできます。

**根拠：** 自動モードは初期状態でオフなので、希望しない限りテーマは変わりません。選んだ月や手動での選択も尊重されます。

## 12 か月

![48 種類のテーマのプレビュー：1 月から 12 月まで各月のライト・ダーク・ハイコントラスト・明るいハイコントラスト版](https://raw.githubusercontent.com/mickaellherminez/365-daynight-vscode-theme-ext/main/assets/screenshots/year.png)

| 月 | 雰囲気 | 月 | 雰囲気 |
| --- | --- | --- | --- |
| 1 月 | 霜 | 7 月 | ラグーン |
| 2 月 | ラベンダーの霞 | 8 月 | 温かな砂 |
| 3 月 | 若芽 | 9 月 | ぶどうの収穫 |
| 4 月 | 春の通り雨 | 10 月 | 紅葉 |
| 5 月 | 花咲く草原 | 11 月 | 霧と下草 |
| 6 月 | 長い日 | 12 月 | 極夜 |

各テーマの色は[完全ガイド](GUIDE_ja.md#12-か月)に記載しています。

## 使いかた

Mac では `Ctrl` の代わりに `Cmd` を使います。

| 目的 | 操作 |
| --- | --- |
| **テーマを選ぶ** | `Ctrl+K` に続けて `Ctrl+T` を押し、**365** と入力します |
| **Light と Dark を切り替える** | 右下のステータスバーで `LGT` または `DRK` をクリックします |
| **月を変える** | 月の両側の矢印をクリックします：`‹ 10 DRK ›` |
| **今月に戻る** | コマンドパレット（`Ctrl+Shift+P`）から `365: Back to the current month` を実行します |
| **ハイコントラストを使う** | `365: Apply High Contrast theme` または `365: Apply High Contrast Light theme` を実行します |
| **ハイコントラストをやめる** | `365: Apply Light theme` または `365: Apply Dark theme` を実行します |
| **自動モードをオンにする** | 設定（`Ctrl+,`）を開き、**365DayNight** を検索して **Enable** をオンにします |
| **キーボードショートカットを追加する** | `Ctrl+K` に続けて `Ctrl+S` を押し、**365** と入力してコマンドをダブルクリックし、キーを押します。初期状態では設定されていません |

### 自動モード

365 テーマを初めて使うと、自動切り替えを使うかどうかを一度だけ確認します。選ばない限り何も変わりません。

![VS Code でのデモ：テーマの選択画面で November Light を選ぶと、時刻に従う、システムに従う、何もしないを選ぶ通知が表示され、Follow the clock をクリックすると自動切り替えがオンになったと表示されます](https://raw.githubusercontent.com/mickaellherminez/365-daynight-vscode-theme-ext/main/assets/screenshots/demo-first-use.gif)

そのあと時刻を選べます。新しい時刻は、入力を終えてから約 2 秒後に適用されます。

![VS Code でのデモ：設定で 365 Day Night: Enable をオンにし、Night Start を過去の時刻にすると Dark になり、19:00 に戻すと Light になります](https://raw.githubusercontent.com/mickaellherminez/365-daynight-vscode-theme-ext/main/assets/screenshots/demo-auto.gif)

**➡️ [完全ガイド](GUIDE_ja.md)ですべて説明しています：** [自動モードと時刻](GUIDE_ja.md#昼と夜の自動切り替え)、[システムに従う](GUIDE_ja.md#システムに従う)、[すべてのコマンド](GUIDE_ja.md#コマンド)、[すべての設定](GUIDE_ja.md#設定)。

## アクセシビリティ

- **読みやすいテキスト：** Light と Dark のテーマは WCAG AA、High Contrast のテーマは AAA です。
- **色覚：** 構文の色と警告を 1 型・2 型・3 型色覚でシミュレーションしています。
- **色だけに頼らない：** コメント、パラメーター、属性は*斜体*、非推奨のコードは~~取り消し線~~、無効なコードは下線で示します。
- **キーボードとスクリーンリーダー：** High Contrast のテーマにははっきりしたフォーカスの輪郭があり、ステータスバーのボタンの各部分には読み上げ用のラベルがあります。

読みにくい箇所がありましたか？[お知らせください](https://github.com/mickaellherminez/365-daynight-vscode-theme-ext/issues/new/choose)。[詳細](GUIDE_ja.md#アクセシビリティを最優先に)と[監査レポート全文](AUDIT.md)もご覧ください。

## 1.0 の新しいデザイン

バージョン 1.0.0 ですべてのテーマを作り直しました。選択中のテーマ、設定、ショートカットはそのまま保持されます。以前のデザインがよい場合は、[元に戻す方法](GUIDE_ja.md#新しいデザインと元に戻す方法)をご覧ください。

## よくある質問

**VS Code をライトテーマとダークテーマで自動的に切り替えるには？**
拡張機能をインストールし、`"365DayNight.enable": true` を設定します。7:00〜19:00 はライトテーマ、夜間はダークテーマが適用されます。 時刻は `365DayNight.dayStart` と `365DayNight.nightStart` で変更できます。

**これらのテーマで VS Code をシステムのライト／ダークモードに従わせることはできますか？**
はい。`"365DayNight.enable": true` と `"365DayNight.mode": "system"` を設定します。ライトとダークはシステムが決め、拡張機能はテーマを当月に保ちます。

**色覚多様性に配慮した VS Code テーマはありますか？**
はい。すべてのテーマを 1 型・2 型・3 型色覚のシミュレーションでテストしており、コメント、非推奨のコード、無効なコードは斜体、取り消し線、下線でも区別されます。

**拡張機能が勝手にテーマを変えることはありますか？**
いいえ。自動モードは初期状態でオフです。オフのままなら、テーマを選んだときかステータスバーのボタンを押したときにだけ変わります。 365 テーマを初めて使うと通知で提案されますが、選ばない限り何も変わりません。

**1 つのテーマだけを使うことはできますか？たとえば October Dark など。**
もちろんです。テーマの選択画面（`Ctrl+K Ctrl+T`）で選び、自動モードをオフのままにしてください。

**ハイコントラストテーマは何のためにありますか？**
ロービジョンの方、とても明るい環境、長時間のコーディング向けです。最大限のコントラスト（AAA）、見やすい枠線、はっきりしたフォーカスの輪郭を備えています。どの月にも、暗い版と、明るい環境向けの明るい版（High Contrast Light）の 2 つがあります。

**新しいバージョンをいち早く試すには？**
プレリリース版がある場合は、拡張機能ビューで拡張機能のページを開き、**Switch to Pre-Release Version**（プレリリース版に切り替え）をクリックします。VS Code がプレリリース版とその更新をインストールします。通常のバージョンに戻すには、同じページで **Switch to Release Version** をクリックします。プレリリース版へのフィードバックは [GitHub の Issue](https://github.com/mickaellherminez/365-daynight-vscode-theme-ext/issues) で歓迎しています。[テスター募集](https://github.com/mickaellherminez/365-daynight-vscode-theme-ext/issues/47)も行っており、確認項目の短いリストを用意しています。

## テーマを気に入っていただけましたか？

⭐ [Marketplace でのレビュー](https://marketplace.visualstudio.com/items?itemName=mickaellherminez.365-daynight-vscode-theme-ext&ssr=false#review-details)が、ほかの開発者に見つけてもらう助けになります。

バグ、読みにくい色、アイデアがあれば [Issue を作成](https://github.com/mickaellherminez/365-daynight-vscode-theme-ext/issues/new/choose)してください。貢献したい方は [CONTRIBUTING.md](../CONTRIBUTING.md) をご覧ください。リリースノートは [CHANGELOG](../CHANGELOG.md) にあります。

[MIT](../LICENSE) © Mickaël Lherminez
