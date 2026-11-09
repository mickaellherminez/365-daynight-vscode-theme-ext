# 365 Day & Night – Monthly Accessible Themes

**Новый облик VS Code каждый месяц: 48 доступных тем, которые переключаются между днём и ночью одним кликом или сами.**

[![Версия в Marketplace](https://vsmarketplacebadges.dev/version-short/mickaellherminez.365-daynight-vscode-theme-ext.svg?subject=Marketplace&style=flat)](https://marketplace.visualstudio.com/items?itemName=mickaellherminez.365-daynight-vscode-theme-ext)
[![Установки](https://vsmarketplacebadges.dev/installs-short/mickaellherminez.365-daynight-vscode-theme-ext.svg?style=flat)](https://marketplace.visualstudio.com/items?itemName=mickaellherminez.365-daynight-vscode-theme-ext)
[![Загрузки](https://vsmarketplacebadges.dev/downloads-short/mickaellherminez.365-daynight-vscode-theme-ext.svg?style=flat)](https://marketplace.visualstudio.com/items?itemName=mickaellherminez.365-daynight-vscode-theme-ext)
[![Рейтинг](https://vsmarketplacebadges.dev/rating-short/mickaellherminez.365-daynight-vscode-theme-ext.svg?style=flat)](https://marketplace.visualstudio.com/items?itemName=mickaellherminez.365-daynight-vscode-theme-ext&ssr=false#review-details)
[![Загрузки в Open VSX](https://img.shields.io/open-vsx/dt/mickaellherminez/365-daynight-vscode-theme-ext?label=Open%20VSX%20downloads)](https://open-vsx.org/extension/mickaellherminez/365-daynight-vscode-theme-ext)
[![Статус CI](https://img.shields.io/github/actions/workflow/status/mickaellherminez/365-daynight-vscode-theme-ext/ci.yml?branch=main&label=CI)](https://github.com/mickaellherminez/365-daynight-vscode-theme-ext/actions/workflows/ci.yml)
[![Лицензия MIT](https://img.shields.io/github/license/mickaellherminez/365-daynight-vscode-theme-ext)](../LICENSE)

```sh
code --install-extension mickaellherminez.365-daynight-vscode-theme-ext
```

Или установите из [Marketplace](https://marketplace.visualstudio.com/items?itemName=mickaellherminez.365-daynight-vscode-theme-ext) или [Open VSX](https://open-vsx.org/extension/mickaellherminez/365-daynight-vscode-theme-ext). Требуется VS Code 1.96 или новее.

*Читать на: [English](../README.md) · [Français](README_fr.md) · [Español](README_es.md) · [Deutsch](README_de.md) · [Português](README_pt.md) · [中文](README_zh.md) · [日本語](README_ja.md) · [हिंदी](README_hi.md) · [العربية](README_ar.md)*

![Демонстрация в VS Code: стрелки кнопки в строке состояния меняют месяц с октября на декабрь, нажатие кнопки переключает Light на Dark, а ссылка во всплывающей подсказке применяет High Contrast](https://raw.githubusercontent.com/mickaellherminez/365-daynight-vscode-theme-ext/main/assets/screenshots/demo-months.gif)

## Почему стоит выбрать

### 🗓️ Новый облик каждый месяц

Иней в январе, молодые побеги в марте, лагуна в июле, осенние листья в октябре, полярная ночь в декабре. За временем года следует всё окно: редактор, боковая панель, вкладки, терминал, строка состояния, чат, граф Git и редактор слияния.

**Доказательство:** 12 месяцев по 4 темы, Light, Dark, High Contrast и High Contrast Light, и более 480 цветов в каждой теме. [Посмотреть все](#12-месяцев).

### 👁️ Создана, чтобы оставаться читаемой

Контраст текста составляет не менее 4,5:1 (WCAG AA) в темах Light и Dark и 7:1 (WCAG AAA) в темах High Contrast. Цвета синтаксиса, ошибки и изменения Git остаются различимыми при дальтонизме, а комментарии, устаревший и недопустимый код отличаются ещё и курсивом, зачёркиванием или подчёркиванием.

**Доказательство:** перед каждой публикацией каждая тема должна пройти автоматический аудит из более чем 250 проверок, а [полный отчёт](AUDIT.md) содержит результаты каждой темы и ограничения аудита. Дальтонизм проверяется моделированием, поэтому отзывы реальных людей очень важны: [примите участие в тестировании](https://github.com/mickaellherminez/365-daynight-vscode-theme-ext/issues/47).

### 🌗 День и ночь, не задумываясь

Нажмите кнопку в строке состояния, чтобы переключиться между Light и Dark. Или пусть расширение следует за часами, в выбранное вами время, или за оформлением вашей системы.

**Доказательство:** автоматический режим по умолчанию выключен, поэтому тема меняется только по вашему желанию. Выбранный месяц и ваши ручные решения сохраняются.

## 12 месяцев

![Предпросмотр 48 тем: светлая, тёмная, высококонтрастная и светлая высококонтрастная версия для каждого месяца с января по декабрь](https://raw.githubusercontent.com/mickaellherminez/365-daynight-vscode-theme-ext/main/assets/screenshots/year.png)

| Месяц | Настроение | Месяц | Настроение |
| --- | --- | --- | --- |
| Январь | Иней | Июль | Лагуна |
| Февраль | Лавандовая дымка | Август | Тёплый песок |
| Март | Молодые побеги | Сентябрь | Сбор винограда |
| Апрель | Апрельские ливни | Октябрь | Осенние листья |
| Май | Цветущий луг | Ноябрь | Туман и подлесок |
| Июнь | Долгие дни | Декабрь | Полярная ночь |

В [полном руководстве](GUIDE_ru.md#12-месяцев) перечислены цвета каждой темы.

## Как пользоваться

На Mac используйте `Cmd` вместо `Ctrl`.

| Чтобы… | Сделайте это |
| --- | --- |
| **Выбрать тему** | Нажмите `Ctrl+K`, затем `Ctrl+T` и введите **365** |
| **Переключиться между Light и Dark** | Нажмите `LGT` или `DRK` в строке состояния, внизу справа |
| **Сменить месяц** | Нажмите стрелки вокруг него: `‹ 10 DRK ›` |
| **Вернуться к текущему месяцу** | Выполните `365: Back to the current month` в палитре команд (`Ctrl+Shift+P`) |
| **Включить высокий контраст** | Выполните `365: Apply High Contrast theme` или `365: Apply High Contrast Light theme` |
| **Выйти из высокого контраста** | Выполните `365: Apply Light theme` или `365: Apply Dark theme` |
| **Включить автоматический режим** | Откройте настройки (`Ctrl+,`), найдите **365DayNight** и отметьте **Enable** |
| **Добавить сочетание клавиш** | Нажмите `Ctrl+K`, затем `Ctrl+S`, введите **365**, дважды щёлкните команду и нажмите нужные клавиши. По умолчанию сочетаний нет |

### Автоматический режим

Когда вы впервые используете тему 365, расширение один раз спрашивает, нужно ли автоматическое переключение. Без вашего выбора ничего не меняется.

![Демонстрация в VS Code: после выбора November Light в списке тем уведомление предлагает следовать часам, следовать системе или ничего не делать, а нажатие Follow the clock подтверждает включение автоматического переключения](https://raw.githubusercontent.com/mickaellherminez/365-daynight-vscode-theme-ext/main/assets/screenshots/demo-first-use.gif)

Затем можно выбрать своё время. Новое время применяется примерно через 2 секунды после окончания ввода.

![Демонстрация в VS Code: в настройках отмечается 365 Day Night: Enable, затем прошедшее время в Night Start применяет Dark, а возврат к 19:00 применяет Light](https://raw.githubusercontent.com/mickaellherminez/365-daynight-vscode-theme-ext/main/assets/screenshots/demo-auto.gif)

**➡️ В [полном руководстве](GUIDE_ru.md) описано всё:** [автоматический режим и его время](GUIDE_ru.md#автоматическое-переключение-дня-и-ночи), [следование системе](GUIDE_ru.md#следовать-системе), [все команды](GUIDE_ru.md#команды) и [все настройки](GUIDE_ru.md#настройки).

## Доступность

- **Читаемый текст:** WCAG AA в темах Light и Dark, AAA в темах High Contrast.
- **Дальтонизм:** цвета синтаксиса и оповещения моделируются для протанопии, дейтеранопии и тританопии.
- **Не только цвет:** комментарии, параметры и атрибуты выделены *курсивом*, устаревший код ~~зачёркнут~~, недопустимый код подчёркнут.
- **Клавиатура и экранные дикторы:** в темах High Contrast заметная рамка фокуса, а у каждой части кнопки в строке состояния своя озвучиваемая подпись.

Что-то плохо читается? [Сообщите нам](https://github.com/mickaellherminez/365-daynight-vscode-theme-ext/issues/new/choose). [Подробнее](GUIDE_ru.md#доступность-прежде-всего) и [полный отчёт об аудите](AUDIT.md).

## Новый облик в 1.0

В версии 1.0.0 переработаны все темы, а выбранная тема, настройки и сочетания клавиш сохраняются. Предпочитаете прежний облик? [Вот как вернуться](GUIDE_ru.md#новый-облик-и-как-вернуться-назад).

## Частые вопросы

**Как автоматически переключать VS Code между светлой и тёмной темой?**
Установите расширение и задайте `"365DayNight.enable": true`. Светлая тема применяется с 7:00 до 19:00, тёмная — ночью. Эти часы можно изменить с помощью `365DayNight.dayStart` и `365DayNight.nightStart`.

**Может ли VS Code следовать светлому или тёмному режиму моей системы с этими темами?**
Да. Задайте `"365DayNight.enable": true` и `"365DayNight.mode": "system"`. Система выбирает между светлой и тёмной темой, а расширение поддерживает темы текущего месяца.

**Есть ли тема VS Code для людей с дальтонизмом?**
Да. Все темы проверены моделированием протанопии, дейтеранопии и тританопии, а комментарии, устаревший и недопустимый код отличаются ещё и курсивом, зачёркиванием или подчёркиванием.

**Изменит ли расширение тему без спроса?**
Нет. Автоматический режим по умолчанию выключен. Без него тема меняется, только когда вы выбираете её сами или нажимаете кнопку в строке состояния. Когда вы впервые используете тему 365, уведомление предлагает его, и без вашего выбора ничего не меняется.

**Можно ли пользоваться только одной темой, например October Dark?**
Конечно. Выберите её в списке тем (`Ctrl+K Ctrl+T`) и не включайте автоматический режим.

**Для чего нужны высококонтрастные темы?**
Они созданы для слабого зрения, очень яркого освещения или долгих сеансов программирования: максимальный контраст (AAA), видимые границы и чёткая рамка фокуса. У каждого месяца их две: тёмная версия и светлая, High Contrast Light, для яркого освещения.

**Как попробовать новую версию раньше всех?**
Когда есть предварительная версия, откройте страницу расширения в представлении «Расширения» и нажмите **Switch to Pre-Release Version** (перейти на предварительную версию). VS Code установит предварительную версию и её обновления. Чтобы вернуться к обычной версии, нажмите **Switch to Release Version** на той же странице. Отзывы о предварительной версии приветствуются в [issues на GitHub](https://github.com/mickaellherminez/365-daynight-vscode-theme-ext/issues). Открыт [набор тестировщиков](https://github.com/mickaellherminez/365-daynight-vscode-theme-ext/issues/47) с коротким списком того, что стоит проверить.

## Нравятся темы?

⭐ [Отзыв в Marketplace](https://marketplace.visualstudio.com/items?itemName=mickaellherminez.365-daynight-vscode-theme-ext&ssr=false#review-details) поможет другим разработчикам их найти.

Ошибка, нечитаемый цвет или идея? [Откройте issue](https://github.com/mickaellherminez/365-daynight-vscode-theme-ext/issues/new/choose). Хотите помочь? См. [CONTRIBUTING.md](../CONTRIBUTING.md). Примечания к выпускам находятся в [CHANGELOG](../CHANGELOG.md).

[MIT](../LICENSE) © Mickaël Lherminez
