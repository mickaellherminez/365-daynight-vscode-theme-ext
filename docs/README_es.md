# 365 Day & Night Themes – Temas accesibles de VS Code para cada mes

**48 temas de color para Visual Studio Code: un tema claro, uno oscuro, uno de alto contraste y uno de alto contraste claro para cada mes del año.** Cambia entre el día y la noche con un clic, o deja que la extensión lo haga por ti. Cada tema está probado en legibilidad (contraste WCAG) y en daltonismo.

[![Versión en el Marketplace](https://img.shields.io/visual-studio-marketplace/v/mickaellherminez.365-daynight-vscode-theme-ext?label=Marketplace)](https://marketplace.visualstudio.com/items?itemName=mickaellherminez.365-daynight-vscode-theme-ext)
[![Instalaciones](https://img.shields.io/visual-studio-marketplace/i/mickaellherminez.365-daynight-vscode-theme-ext)](https://marketplace.visualstudio.com/items?itemName=mickaellherminez.365-daynight-vscode-theme-ext)
[![Licencia MIT](https://img.shields.io/github/license/mickaellherminez/365-daynight-vscode-theme-ext)](../LICENSE)

*Leer esta página en: [English](../README.md) · [Français](README_fr.md) · [Deutsch](README_de.md) · [Português](README_pt.md) · [Русский](README_ru.md) · [中文](README_zh.md) · [日本語](README_ja.md) · [हिंदी](README_hi.md) · [العربية](README_ar.md)*

![Temas de octubre claro, oscuro, de alto contraste y de alto contraste claro en VS Code: explorador, pestañas, resaltado de sintaxis, selección de texto y barra de estado](https://raw.githubusercontent.com/mickaellherminez/365-daynight-vscode-theme-ext/main/assets/screenshots/hero.png)

## Por qué te va a gustar

- 🗓️ **Un estilo nuevo cada mes.** Escarcha en enero, brotes tiernos en marzo, una laguna en julio, hojas otoñales en octubre y una noche polar en diciembre: toda la ventana sigue las estaciones, no solo el editor.
- ☀️🌙 **Día y noche, siempre a juego.** Cada mes tiene un tema claro para el día, uno oscuro para la noche y dos de alto contraste, oscuro y claro (High Contrast Light), cuando necesitas la máxima legibilidad.
- 🔁 **Cambio con un clic.** Un botón en la barra de estado alterna entre claro y oscuro. El alto contraste está disponible con un comando.
- ⏰ **Modo automático opcional.** La extensión puede aplicar sola el tema del mes actual: claro de día y oscuro de noche.
- 👁️ **Descansa la vista y es legible para todos.** Todo el texto cumple los niveles de contraste WCAG y los colores de sintaxis siguen siendo distintos para personas con daltonismo.
- 🖥️ **Temas cuidados.** Editor, barra lateral, pestañas, terminal, consola de depuración, notificaciones y barra de estado: todo tiene estilo, con más de 480 colores por tema. El chat, los resultados de las pruebas, los iconos de símbolos, el grafo de Git, el editor de fusión y el multi-diff también siguen la paleta del mes.

## Instalación

**Desde VS Code:** abre la vista de Extensiones (`Ctrl+Shift+X`, o `Cmd+Shift+X` en Mac), busca **365 Day & Night Themes** y haz clic en **Instalar**.

**Desde el Marketplace:** [instalar 365 Day & Night Themes](https://marketplace.visualstudio.com/items?itemName=mickaellherminez.365-daynight-vscode-theme-ext).

**Desde la línea de comandos:**

```sh
code --install-extension mickaellherminez.365-daynight-vscode-theme-ext
```

Requiere Visual Studio Code 1.96 o posterior.

## Primeros pasos

1. Abre el selector de temas: `Ctrl+K` y luego `Ctrl+T` (`Cmd+K` y luego `Cmd+T` en Mac).
2. Escribe **365** para ver todos los temas, por ejemplo `365 10-October Dark`.
3. Elige uno. ¡Listo!

La primera vez que usas un tema 365, una notificación ofrece el cambio automático: **Follow the clock** (seguir la hora: claro de día, oscuro de noche), **Follow my system** (seguir el modo claro u oscuro de tu sistema) o **No thanks** (no, gracias). Nada cambia sin tu elección, y la pregunta se hace una sola vez. Tras elegir, un mensaje confirma lo que está activado, con un botón **Open Settings** para cambiar las horas o desactivarlo. Para cambiar de opinión más tarde, consulta la sección sobre el cambio automático más abajo.

El **botón de la barra de estado** (abajo a la derecha: `LGT`, `DRK`, `HCT` o `HCL`) cambia entre las versiones clara y oscura del mes actual. Para el alto contraste, ejecuta `365: Apply High Contrast theme` desde la paleta de comandos. En un tema de alto contraste, el botón cambia entre el alto contraste oscuro (`HCT`) y el claro (`HCL`), para que un clic nunca salga del alto contraste. Para salir del alto contraste, ejecuta `365: Apply Light theme` o `365: Apply Dark theme`. También puedes pasar el cursor sobre el botón y hacer clic en su enlace **Light** o **Dark**.

Para probar otro mes, haz clic en las flechas que lo rodean (`‹ 10 DRK ›`). El número es el mes, de `01` a `12`, y las flechas conservan la variante: claro, oscuro, alto contraste o alto contraste claro. Después de diciembre viene enero. Para volver, ejecuta `365: Back to the current month` desde la paleta de comandos. Las flechas y el número solo aparecen con un tema 365. Pasa el cursor sobre el botón para ver el nombre completo del tema, con enlaces al alto contraste, al alto contraste claro y al mes actual. En un tema de alto contraste, la información sobre herramientas enlaza en su lugar con Light y Dark.

## Los 12 meses

![Vista previa de los 48 temas: una versión clara, oscura, de alto contraste y de alto contraste claro para cada mes, de enero a diciembre](https://raw.githubusercontent.com/mickaellherminez/365-daynight-vscode-theme-ext/main/assets/screenshots/year.png)

| Mes | Ambiente | Claro | Oscuro | Alto contraste | Alto contraste claro |
| --- | --- | --- | --- | --- | --- |
| Enero | Escarcha | Azul glaciar y azul profundo | Azul invernal profundo y azul hielo | Negro azulado y azul hielo | Blanco hielo y azul marino |
| Febrero | Bruma lavanda | Lavanda pálido y violeta | Noche gris violácea y lila | Negro violáceo y lila pálido | Blanco lavanda y ciruela |
| Marzo | Brotes tiernos | Verde tierno y verde brote | Noche oliva y verde brote | Negro oliva y verde vivo | Verde pálido y verde bosque |
| Abril | Lluvias de abril | Cielo de lluvia y rosa cerezo | Pizarra de lluvia y rosa cerezo | Negro azulado y rosa cerezo | Cielo pálido y rosa intenso |
| Mayo | Pradera en flor | Verde pradera y oro oliva | Noche verde profundo y amarillo botón de oro | Negro verdoso y oro pálido | Verde pálido y bronce oscuro |
| Junio | Días largos | Cielo despejado y azul de verano | Noche azul petróleo y azul pervinca | Negro y azul pervinca | Blanco cielo y azul real |
| Julio | Laguna | Agua turquesa y coral | Laguna profunda y coral | Negro verde azulado y coral pálido | Turquesa pálido y rojo coral |
| Agosto | Arena cálida | Arena dorada y caramelo | Noche marrón y ámbar | Negro pardo y ámbar | Blanco cálido y ámbar oscuro |
| Septiembre | Vendimia | Rosa pálido y ciruela | Noche color vino y ciruela | Negro vino y orquídea | Rosa pálido y ciruela intensa |
| Octubre | Hojas otoñales | Melocotón y rojizo | Noche marrón cálido y rojizo | Negro pardo y salmón | Blanco melocotón y rojizo intenso |
| Noviembre | Bruma y sotobosque | Gris topo brumoso y verde musgo | Gris sotobosque y verde musgo | Negro cálido y verde musgo | Crema y musgo oscuro |
| Diciembre | Noche polar | Lavanda helado y verde azulado de aurora | Azul medianoche y cian de aurora | Negro azulado y cian de aurora | Blanco lavanda y verde azulado oscuro |

## Nuevo estilo, y cómo volver atrás

La versión 0.13.0 rediseña todos los temas: cada mes tiene ahora su propio ambiente de estación, y cada mes recibe un tema de alto contraste claro (High Contrast Light). Se conservan tu tema, tus ajustes y tus atajos de teclado: los nombres de los temas y los comandos no han cambiado, solo los colores.

¿Prefieres el estilo anterior? Vuelve a la versión 0.12.0:

1. Abre la vista de Extensiones (`Ctrl+Shift+X`, o `Cmd+Shift+X` en Mac) y busca **365 Day & Night Themes**.
2. Haz clic en ella para abrir su página, haz clic en la flecha junto a **Uninstall** (desinstalar), elige **Install Specific Version...** (instalar una versión concreta) y luego **0.12.0**.
3. Recarga VS Code si te lo pide.

VS Code desmarca entonces **Auto Update** (actualización automática) para esta extensión, que se queda en 0.12.0. Para recuperar el nuevo estilo, vuelve a marcar **Auto Update** o elige la última versión en el mismo menú. La versión 0.12.0 no tiene tema de alto contraste claro: si usas uno, elige otro tema después de volver atrás.

## Cambio automático entre día y noche

¿Quieres que tu editor siga la hora? Activa el modo automático:

1. Abre la configuración (`Ctrl+,` o `Cmd+,`) y busca **365DayNight**.
2. Marca **365DayNight: Enable**.

O añade esto a tu `settings.json`:

```json
{
  "365DayNight.enable": true,
  "365DayNight.mode": "auto"
}
```

| Modo | Qué hace |
| --- | --- |
| `auto` | Tema claro de 7:00 a 19:00 por defecto y tema oscuro el resto del tiempo. Puedes cambiar estas horas (ver abajo) |
| `day` | Siempre el tema claro del mes actual |
| `night` | Siempre el tema oscuro del mes actual |
| `system` | Sigue la apariencia clara, oscura y de alto contraste de tu sistema (ver abajo) |

La extensión también pasa al tema del mes siguiente el primer día de cada mes.

Bueno saber:

- **Tú decides.** El modo automático está desactivado por defecto: la extensión nunca cambia tu tema sin que se lo pidas. La primera vez que usas un tema 365, una notificación te pregunta una sola vez si lo quieres.
- **Tu elección se respeta.** Si eliges un tema a mano, se mantiene hasta el siguiente cambio de periodo (de día a noche o un nuevo mes).
- **Tu mes también se mantiene.** Si eliges otro mes, con las flechas o el selector de temas, el modo automático sigue alternando claro y oscuro en ese mes hasta que empiece el siguiente mes real, incluso después de reiniciar. Para volver antes, ejecuta `365: Back to the current month`.
- **El alto contraste se mantiene.** Si usas un tema de alto contraste, oscuro o claro, el modo automático solo actualiza el mes, nunca la variante.

### Elegir tus horas

Por defecto, el tema claro empieza a las 7:00 y el oscuro a las 19:00. Para cambiar estas horas:

1. Abre la configuración (`Ctrl+,` o `Cmd+,`) y busca **365DayNight**.
2. Configura **365DayNight: Day Start** y **365DayNight: Night Start** en formato HH:MM de 24 horas.

O añade esto a tu `settings.json`:

```json
{
  "365DayNight.dayStart": "08:30",
  "365DayNight.nightStart": "20:00"
}
```

- **Se aplica enseguida.** Una nueva hora se aplica unos 2 segundos después de terminar de escribir, aunque hayas elegido un tema a mano. Después, el tema cambia en el minuto elegido.
- **Pasada la medianoche.** Si el día empieza después de la noche, por ejemplo `"20:00"` y `"06:00"`, el tema claro pasa la medianoche. Útil si trabajas de noche.
- **Valores no válidos.** Una hora ilegible, como `"25:00"` o `"7h"`, se sustituye por su valor por defecto, y un aviso te lo indica una vez. Dos horas iguales dan 7:00 y 19:00.
- **Solo en el modo `auto`.** Los modos `day`, `night` y `system` ignoran estas horas.
- **Volver a 7:00 y 19:00.** En la configuración, haz clic en el engranaje junto a cada hora y elige **Reset Setting**, o elimina ambas líneas de tu `settings.json`.

### Seguir tu sistema

¿Prefieres seguir la apariencia de tu sistema en lugar de la hora? Usa el modo `system`:

1. Abre la configuración (`Ctrl+,` o `Cmd+,`) y busca **365DayNight**.
2. Marca **365DayNight: Enable**.
3. Pon **365DayNight: Mode** en `system`.

O añade esto a tu `settings.json`:

```json
{
  "365DayNight.enable": true,
  "365DayNight.mode": "system"
}
```

| Tu sistema usa | Tema aplicado |
| --- | --- |
| Apariencia clara | Tema claro del mes |
| Apariencia oscura | Tema oscuro del mes |
| Alto contraste, con apariencia oscura | Tema de alto contraste del mes |
| Alto contraste, con apariencia clara | El tema de alto contraste claro del mes |

El botón en este modo:
- **Flechas.** `‹` y `›` cambian el mes de todas las variantes. Ese mes se mantiene hasta que empiece el próximo mes real, incluso tras reiniciar. Para volver antes, ejecuta `365: Back to the current month`.
- **Botón central.** Tu sistema decide entre claro y oscuro, así que un clic solo lo explica. Los comandos `365: Apply Light theme`, `365: Apply Dark theme`, `365: Apply High Contrast theme` y `365: Apply High Contrast Light theme` dicen lo mismo y no cambian nada.
- **Selector de temas.** Elegir un tema 365 aplica su mes a todas las variantes. Elegir un tema de otro autor reemplaza solo la variante en uso: se mantiene en los meses siguientes, y el botón no muestra entonces ni flechas ni mes. Haz clic en el botón central para recuperar el tema 365.


- **Qué cambia.** El modo activa `window.autoDetectColorScheme` y escribe los temas del mes en `workbench.preferredLightColorTheme`, `workbench.preferredDarkColorTheme`, `workbench.preferredHighContrastColorTheme` y `workbench.preferredHighContrastLightColorTheme`. `workbench.colorTheme` no cambia.
- **Cómo volver atrás.** Desmarca **365DayNight: Enable** o elige otro modo. Tus ajustes originales vuelven, y los que no existían se eliminan de nuevo. Un ajuste que hayas cambiado mientras tanto conserva tu valor.
- **Antes de desinstalar o desactivar la extensión.** Sal primero de este modo, porque después una extensión ya no puede restaurar nada. Si lo olvidaste, elimina los cinco ajustes anteriores de tu `settings.json`.
- **Alto contraste.** VS Code da prioridad al alto contraste de tu sistema. Para ignorarlo, desactiva `window.autoDetectHighContrast`: el modo nunca cambia este ajuste.
- **Desactivar la detección.** Si desactivas tú mismo `window.autoDetectColorScheme`, la extensión lo deja desactivado y el botón funciona como siempre. Un ajuste de tema en un workspace sigue teniendo prioridad en ese workspace.
- **Sistemas operativos.** Según la documentación de VS Code, la apariencia clara u oscura se detecta en Windows y macOS.

## La accesibilidad, primero

Cada tema supera una auditoría de accesibilidad automatizada de más de 250 comprobaciones:

- **Texto legible:** el texto del editor y los colores de sintaxis alcanzan un contraste de al menos **4,5:1 (WCAG AA)** en los temas claros y oscuros, y **7:1 (WCAG AAA)** en los de alto contraste.
- **Apto para daltónicos:** los colores de sintaxis (palabras clave, funciones, cadenas, números, clases, comentarios) y las alertas (errores, advertencias, cambios de Git) se simulan en **protanopía, deuteranopía y tritanopía** para asegurar que siguen siendo distintos.
- **No solo el color:** comentarios, parámetros y atributos van en *cursiva*, el código obsoleto aparece ~~tachado~~ y el código no válido, subrayado.
- **Selección visible en todas partes:** la selección de texto se ve claramente en el editor, la terminal y la consola de depuración, sin confundirse con los resultados de búsqueda.
- **Temas de alto contraste:** el texto seleccionado se vuelve negro sobre azul claro (blanco sobre azul oscuro en el alto contraste claro), y todos los paneles tienen bordes visibles y un contorno de foco de teclado muy marcado.
- **Lectores de pantalla:** cada parte del botón de la barra de estado tiene su propia etiqueta hablada, por ejemplo «Next month: November».

¿Algún color difícil de leer? [Abre una incidencia](https://github.com/mickaellherminez/365-daynight-vscode-theme-ext/issues): los comentarios sobre accesibilidad siempre son bienvenidos.

## Comandos

Abre la paleta de comandos (`Ctrl+Shift+P` o `Cmd+Shift+P`) y escribe **365**:

| Comando | Acción |
| --- | --- |
| `365: Toggle between Light and Dark themes` | Alterna entre claro y oscuro (igual que el botón de la barra de estado) |
| `365: Apply Light theme` | Aplica el tema claro del mes mostrado |
| `365: Apply Dark theme` | Aplica el tema oscuro del mes mostrado |
| `365: Apply High Contrast theme` | Aplica el tema de alto contraste del mes mostrado |
| `365: Apply High Contrast Light theme` | Aplica el tema de alto contraste claro del mes mostrado |
| `365: Next month` | Aplica el tema del mes siguiente, en la misma variante |
| `365: Previous month` | Aplica el tema del mes anterior, en la misma variante |
| `365: Back to the current month` | Aplica el tema del mes actual real, en la misma variante |

La extensión no define ningún atajo de teclado por defecto. Para asignar los tuyos, abre la lista de atajos (`Ctrl+K Ctrl+S`, o `Cmd+K Cmd+S` en Mac), escribe **365**, haz doble clic en un comando y pulsa tus teclas.

## Configuración

| Ajuste | Valor por defecto | Descripción |
| --- | --- | --- |
| `365DayNight.enable` | `false` | Aplica automáticamente el tema del mes actual |
| `365DayNight.mode` | `auto` | `auto` (según la hora), `day` (siempre claro), `night` (siempre oscuro) o `system` (sigue tu sistema) |
| `365DayNight.dayStart` | `"07:00"` | Hora en que empieza el tema claro en el modo `auto`, en formato HH:MM |
| `365DayNight.nightStart` | `"19:00"` | Hora en que empieza el tema oscuro en el modo `auto`, en formato HH:MM |
| `365DayNight.toggleIncludesHighContrast` | `false` | El botón de la barra de estado pasa por todas las variantes: claro, oscuro, alto contraste y luego alto contraste claro |

## Preguntas frecuentes

**¿Cómo cambio VS Code automáticamente entre un tema claro y uno oscuro?**
Instala la extensión y configura `"365DayNight.enable": true`. El tema claro se aplica de 7:00 a 19:00 y el oscuro por la noche. Puedes cambiar estas horas con `365DayNight.dayStart` y `365DayNight.nightStart`.

**¿Puede VS Code seguir el modo claro u oscuro de mi sistema con estos temas?**
Sí. Configura `"365DayNight.enable": true` y `"365DayNight.mode": "system"`. Tu sistema decide entre claro y oscuro, y la extensión mantiene los temas en el mes actual.

**¿Hay un tema de VS Code apto para daltónicos?**
Sí. Todos los temas se prueban con simulaciones de protanopía, deuteranopía y tritanopía, y usan cursiva, subrayado y tachado para que la información nunca dependa solo del color.

**¿La extensión cambiará mi tema sin preguntar?**
No. El modo automático está desactivado por defecto. Sin él, el tema solo cambia cuando eliges uno o pulsas el botón de la barra de estado. La primera vez que usas un tema 365, una notificación lo ofrece, y nada cambia sin tu elección.

**¿Puedo usar un solo tema, por ejemplo October Dark?**
Por supuesto. Elígelo en el selector de temas (`Ctrl+K Ctrl+T`) y deja el modo automático desactivado.

**¿Para qué sirven los temas de alto contraste?**
Están pensados para baja visión, entornos muy luminosos o largas sesiones de programación. Ofrecen el máximo contraste (AAA), bordes visibles y un contorno de foco muy marcado. Cada mes tiene dos: una versión oscura y una clara, High Contrast Light, para entornos luminosos.

**¿Cómo pruebo una nueva versión antes que nadie?**
Cuando exista una versión preliminar, abre la página de la extensión en la vista de Extensiones y haz clic en **Switch to Pre-Release Version** (cambiar a la versión preliminar). VS Code instala entonces la versión preliminar y sus actualizaciones. Para volver a la versión normal, haz clic en **Switch to Release Version** en la misma página. Tus comentarios sobre una versión preliminar son bienvenidos en los [issues de GitHub](https://github.com/mickaellherminez/365-daynight-vscode-theme-ext/issues).

## Hoja de ruta

Las ideas y sugerencias son bienvenidas en las [incidencias de GitHub](https://github.com/mickaellherminez/365-daynight-vscode-theme-ext/issues).

## Opiniones y contribuciones

- ⭐ ¿Te gustan los temas? Una [reseña en el Marketplace](https://marketplace.visualstudio.com/items?itemName=mickaellherminez.365-daynight-vscode-theme-ext&ssr=false#review-details) ayuda a otros desarrolladores a descubrirlos.
- 🐞 Un error, un color ilegible o una idea: [abre una incidencia](https://github.com/mickaellherminez/365-daynight-vscode-theme-ext/issues).
- 🛠️ ¿Quieres contribuir? Consulta [CONTRIBUTING.md](../CONTRIBUTING.md) (en inglés).

Las notas de versión están en el [CHANGELOG](../CHANGELOG.md).

## Licencia

[MIT](../LICENSE) © Mickaël Lherminez
