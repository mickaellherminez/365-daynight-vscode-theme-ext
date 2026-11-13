# 365 Day & Night – Monthly Accessible Themes

**Dale a VS Code un estilo nuevo cada mes: 48 temas accesibles que cambian entre el día y la noche con un clic o por sí solos.**

[![Versión en el Marketplace](https://vsmarketplacebadges.dev/version-short/mickaellherminez.365-daynight-vscode-theme-ext.svg?subject=Marketplace&style=flat)](https://marketplace.visualstudio.com/items?itemName=mickaellherminez.365-daynight-vscode-theme-ext)
[![Instalaciones](https://vsmarketplacebadges.dev/installs-short/mickaellherminez.365-daynight-vscode-theme-ext.svg?style=flat)](https://marketplace.visualstudio.com/items?itemName=mickaellherminez.365-daynight-vscode-theme-ext)
[![Descargas](https://vsmarketplacebadges.dev/downloads-short/mickaellherminez.365-daynight-vscode-theme-ext.svg?style=flat)](https://marketplace.visualstudio.com/items?itemName=mickaellherminez.365-daynight-vscode-theme-ext)
[![Valoración](https://vsmarketplacebadges.dev/rating-short/mickaellherminez.365-daynight-vscode-theme-ext.svg?style=flat)](https://marketplace.visualstudio.com/items?itemName=mickaellherminez.365-daynight-vscode-theme-ext&ssr=false#review-details)
[![Descargas en Open VSX](https://img.shields.io/open-vsx/dt/mickaellherminez/365-daynight-vscode-theme-ext?label=Open%20VSX%20downloads)](https://open-vsx.org/extension/mickaellherminez/365-daynight-vscode-theme-ext)
[![Estado de la CI](https://img.shields.io/github/actions/workflow/status/mickaellherminez/365-daynight-vscode-theme-ext/ci.yml?branch=main&label=CI)](https://github.com/mickaellherminez/365-daynight-vscode-theme-ext/actions/workflows/ci.yml)
[![Licencia MIT](https://img.shields.io/github/license/mickaellherminez/365-daynight-vscode-theme-ext)](../LICENSE)

```sh
code --install-extension mickaellherminez.365-daynight-vscode-theme-ext
```

O instálala desde el [Marketplace](https://marketplace.visualstudio.com/items?itemName=mickaellherminez.365-daynight-vscode-theme-ext) o [Open VSX](https://open-vsx.org/extension/mickaellherminez/365-daynight-vscode-theme-ext). Requiere VS Code 1.96 o posterior.

Previsualiza cada mes y cada variante, y consulta la auditoría en gráficos, en [el sitio web](https://365daynight.mickaellherminez.net/es/).

*Leer esta página en: [English](../README.md) · [Français](README_fr.md) · [Deutsch](README_de.md) · [Português](README_pt.md) · [Русский](README_ru.md) · [中文](README_zh.md) · [日本語](README_ja.md) · [हिंदी](README_hi.md) · [العربية](README_ar.md)*

![Demostración en VS Code: las flechas del botón de la barra de estado cambian el mes de octubre a diciembre, un clic en el botón cambia de Light a Dark y un enlace de su descripción emergente aplica High Contrast](https://raw.githubusercontent.com/mickaellherminez/365-daynight-vscode-theme-ext/main/assets/screenshots/demo-months.gif)

## Por qué elegirla

### 🗓️ Un estilo nuevo cada mes

Escarcha en enero, brotes tiernos en marzo, una laguna en julio, hojas otoñales en octubre y una noche polar en diciembre. Toda la ventana sigue la estación: editor, barra lateral, pestañas, terminal, barra de estado, chat, gráfico de Git y editor de fusión.

**La prueba:** 12 meses con 4 temas cada uno, Light, Dark, High Contrast y High Contrast Light, y más de 480 colores en cada tema. [Verlos todos](#los-12-meses).

### 👁️ Pensada para seguir siendo legible

El texto alcanza un contraste de al menos 4,5:1 (WCAG AA) en los temas Light y Dark, y de 7:1 (WCAG AAA) en los temas High Contrast. Los colores de sintaxis, los errores y los cambios de Git siguen siendo distinguibles con daltonismo, y los comentarios y el código obsoleto o no válido también se diferencian con cursiva, tachado o subrayado.

**La prueba:** cada tema debe superar una auditoría automática de más de 250 comprobaciones antes de cada publicación, y [el informe completo](AUDIT.md) da los resultados de cada tema y los límites de la auditoría. El daltonismo se comprueba con simulaciones, así que los comentarios de personas reales son muy bienvenidos: [únete a la convocatoria de probadores](https://github.com/mickaellherminez/365-daynight-vscode-theme-ext/issues/47).

### 🌗 El día y la noche, sin pensarlo

Haz clic en el botón de la barra de estado para cambiar entre Light y Dark. O deja que la extensión siga el reloj, con las horas que elijas, o la apariencia de tu sistema.

**La prueba:** el modo automático está desactivado por defecto, así que tu tema solo cambia si lo pides. Se respetan el mes elegido y tus elecciones manuales.

## Los 12 meses

![Vista previa de los 48 temas: una versión clara, oscura, de alto contraste y de alto contraste claro para cada mes, de enero a diciembre](https://raw.githubusercontent.com/mickaellherminez/365-daynight-vscode-theme-ext/main/assets/screenshots/year.png)

| Mes | Ambiente | Mes | Ambiente |
| --- | --- | --- | --- |
| Enero | Escarcha | Julio | Laguna |
| Febrero | Bruma lavanda | Agosto | Arena cálida |
| Marzo | Brotes tiernos | Septiembre | Vendimia |
| Abril | Lluvias de abril | Octubre | Hojas otoñales |
| Mayo | Pradera en flor | Noviembre | Bruma y sotobosque |
| Junio | Días largos | Diciembre | Noche polar |

La [guía completa](GUIDE_es.md#los-12-meses) indica los colores de cada tema.

## Cómo usarla

En Mac, usa `Cmd` en lugar de `Ctrl`.

| Para… | Haz esto |
| --- | --- |
| **Elegir un tema** | Pulsa `Ctrl+K` y luego `Ctrl+T`, y escribe **365** |
| **Cambiar entre Light y Dark** | Haz clic en `LGT` o `DRK` en la barra de estado, abajo a la derecha |
| **Cambiar de mes** | Haz clic en las flechas que lo rodean: `‹ 10 DRK ›` |
| **Volver al mes actual** | Ejecuta `365: Back to the current month` desde la paleta de comandos (`Ctrl+Shift+P`) |
| **Usar el contraste alto** | Ejecuta `365: Apply High Contrast theme` o `365: Apply High Contrast Light theme` |
| **Salir del contraste alto** | Ejecuta `365: Apply Light theme` o `365: Apply Dark theme` |
| **Activar el modo automático** | Abre la configuración (`Ctrl+,`), busca **365DayNight** y marca **Enable** |
| **Añadir un atajo de teclado** | Pulsa `Ctrl+K` y luego `Ctrl+S`, escribe **365**, haz doble clic en un comando y pulsa tus teclas. No hay ninguno por defecto |

### Modo automático

La primera vez que usas un tema 365, la extensión te pregunta una sola vez si quieres el cambio automático. Nada cambia sin tu elección.

![Demostración en VS Code: tras elegir November Light en el selector de temas, una notificación ofrece seguir el reloj, seguir el sistema o no hacer nada, y un clic en Follow the clock confirma que el cambio automático está activo](https://raw.githubusercontent.com/mickaellherminez/365-daynight-vscode-theme-ext/main/assets/screenshots/demo-first-use.gif)

Después puedes elegir tus horas. Una hora nueva se aplica unos 2 segundos después de que dejes de escribir.

![Demostración en VS Code: en la configuración se marca 365 Day Night: Enable, después poner en Night Start una hora pasada aplica Dark, y volver a las 19:00 aplica Light](https://raw.githubusercontent.com/mickaellherminez/365-daynight-vscode-theme-ext/main/assets/screenshots/demo-auto.gif)

**➡️ La [guía completa](GUIDE_es.md) lo detalla todo:** [el modo automático y sus horas](GUIDE_es.md#cambio-automático-entre-día-y-noche), [seguir tu sistema](GUIDE_es.md#seguir-tu-sistema), [todos los comandos](GUIDE_es.md#comandos) y [toda la configuración](GUIDE_es.md#configuración).

## Accesibilidad

- **Texto legible:** WCAG AA en los temas Light y Dark, AAA en los temas High Contrast.
- **Daltonismo:** los colores de sintaxis y las alertas se simulan para protanopía, deuteranopía y tritanopía.
- **No solo color:** los comentarios, parámetros y atributos van en *cursiva*, el código obsoleto está ~~tachado~~ y el código no válido, subrayado.
- **Teclado y lectores de pantalla:** los temas High Contrast tienen un contorno de foco marcado, y cada parte del botón de la barra de estado tiene su propia etiqueta hablada.

¿Algo difícil de leer? [Cuéntanoslo](https://github.com/mickaellherminez/365-daynight-vscode-theme-ext/issues/new/choose). [Más detalles](GUIDE_es.md#la-accesibilidad-primero) y [el informe de auditoría completo](AUDIT.md).

## Nuevo estilo en 1.0

Todos los temas se rediseñaron en la versión 1.0.0, y se conservan tu tema, tu configuración y tus atajos. ¿Prefieres el estilo anterior? [Así puedes volver atrás](GUIDE_es.md#nuevo-estilo-y-cómo-volver-atrás).

## Preguntas frecuentes

**¿Cómo cambio VS Code automáticamente entre un tema claro y uno oscuro?**
Instala la extensión y configura `"365DayNight.enable": true`. El tema claro se aplica de 7:00 a 19:00 y el oscuro por la noche. Puedes cambiar estas horas con `365DayNight.dayStart` y `365DayNight.nightStart`.

**¿Puede VS Code seguir el modo claro u oscuro de mi sistema con estos temas?**
Sí. Configura `"365DayNight.enable": true` y `"365DayNight.mode": "system"`. Tu sistema decide entre claro y oscuro, y la extensión mantiene los temas en el mes actual.

**¿Hay un tema de VS Code apto para daltónicos?**
Sí. Todos los temas se prueban con simulaciones de protanopía, deuteranopía y tritanopía, y los comentarios y el código obsoleto o no válido también se diferencian con cursiva, tachado o subrayado.

**¿La extensión cambiará mi tema sin preguntar?**
No. El modo automático está desactivado por defecto. Sin él, el tema solo cambia cuando eliges uno o pulsas el botón de la barra de estado. La primera vez que usas un tema 365, una notificación lo ofrece, y nada cambia sin tu elección.

**¿Puedo usar un solo tema, por ejemplo October Dark?**
Por supuesto. Elígelo en el selector de temas (`Ctrl+K Ctrl+T`) y deja el modo automático desactivado.

**¿Para qué sirven los temas de alto contraste?**
Están pensados para baja visión, entornos muy luminosos o largas sesiones de programación. Ofrecen el máximo contraste (AAA), bordes visibles y un contorno de foco muy marcado. Cada mes tiene dos: una versión oscura y una clara, High Contrast Light, para entornos luminosos.

**¿Cómo pruebo una nueva versión antes que nadie?**
Cuando exista una versión preliminar, abre la página de la extensión en la vista de Extensiones y haz clic en **Switch to Pre-Release Version** (cambiar a la versión preliminar). VS Code instala entonces la versión preliminar y sus actualizaciones. Para volver a la versión normal, haz clic en **Switch to Release Version** en la misma página. Tus comentarios sobre una versión preliminar son bienvenidos en los [issues de GitHub](https://github.com/mickaellherminez/365-daynight-vscode-theme-ext/issues). Hay una [convocatoria de probadores](https://github.com/mickaellherminez/365-daynight-vscode-theme-ext/issues/47) abierta, con una lista breve de puntos que comprobar.

## ¿Te gustan los temas?

⭐ Una [reseña en el Marketplace](https://marketplace.visualstudio.com/items?itemName=mickaellherminez.365-daynight-vscode-theme-ext&ssr=false#review-details) ayuda a otros desarrolladores a descubrirlos.

¿Un error, un color ilegible o una idea? [Abre una incidencia](https://github.com/mickaellherminez/365-daynight-vscode-theme-ext/issues/new/choose). ¿Quieres contribuir? Consulta [CONTRIBUTING.md](../CONTRIBUTING.md). Las notas de versión están en el [CHANGELOG](../CHANGELOG.md).

[MIT](../LICENSE) © Mickaël Lherminez
