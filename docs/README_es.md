# 365 Day & Night Themes – Temas accesibles de VS Code para cada mes

**36 temas de color para Visual Studio Code: un tema claro, uno oscuro y uno de alto contraste para cada mes del año.** Cambia entre el día y la noche con un clic, o deja que la extensión lo haga por ti. Cada tema está probado en legibilidad (contraste WCAG) y en daltonismo.

[![Versión en el Marketplace](https://img.shields.io/visual-studio-marketplace/v/mickaellherminez.365-daynight-vscode-theme-ext?label=Marketplace)](https://marketplace.visualstudio.com/items?itemName=mickaellherminez.365-daynight-vscode-theme-ext)
[![Instalaciones](https://img.shields.io/visual-studio-marketplace/i/mickaellherminez.365-daynight-vscode-theme-ext)](https://marketplace.visualstudio.com/items?itemName=mickaellherminez.365-daynight-vscode-theme-ext)
[![Licencia MIT](https://img.shields.io/github/license/mickaellherminez/365-daynight-vscode-theme-ext)](../LICENSE)

*Leer esta página en: [English](../README.md) · [Français](README_fr.md) · [Deutsch](README_de.md) · [Português](README_pt.md) · [Русский](README_ru.md) · [中文](README_zh.md) · [日本語](README_ja.md) · [हिंदी](README_hi.md) · [العربية](README_ar.md)*

![Temas de octubre claro, oscuro y de alto contraste en VS Code: explorador, pestañas, resaltado de sintaxis, selección de texto y barra de estado](https://raw.githubusercontent.com/mickaellherminez/365-daynight-vscode-theme-ext/main/assets/screenshots/hero.png)

## Por qué te va a gustar

- 🗓️ **Un estilo nuevo cada mes.** Nieve y azul invernal en enero, verde primavera en marzo, pleno sol en julio, colores de otoño en octubre y ambiente de chimenea en diciembre: tu editor sigue las estaciones.
- ☀️🌙 **Día y noche, siempre a juego.** Cada mes tiene un tema claro para el día, uno oscuro para la noche y uno de alto contraste cuando necesitas la máxima legibilidad.
- 🔁 **Cambio con un clic.** Un botón en la barra de estado alterna entre claro, oscuro y alto contraste.
- ⏰ **Modo automático opcional.** La extensión puede aplicar sola el tema del mes actual: claro de día y oscuro de noche.
- 👁️ **Descansa la vista y es legible para todos.** Todo el texto cumple los niveles de contraste WCAG y los colores de sintaxis siguen siendo distintos para personas con daltonismo.
- 🖥️ **Temas completos.** Editor, barra lateral, pestañas, terminal, consola de depuración, notificaciones y barra de estado: todo tiene estilo, nada vuelve a los colores por defecto.

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
2. Escribe **365** para ver los 36 temas, por ejemplo `365 10-October Dark`.
3. Elige uno. ¡Listo!

El **botón de la barra de estado** (abajo a la derecha: `LGT`, `DRK` o `HCT`) cambia entre las versiones clara, oscura y de alto contraste del mes actual.

## Los 12 meses

![Vista previa de los 36 temas: una versión clara, oscura y de alto contraste para cada mes, de enero a diciembre](https://raw.githubusercontent.com/mickaellherminez/365-daynight-vscode-theme-ext/main/assets/screenshots/year.png)

| Mes | Claro | Oscuro | Alto contraste |
| --- | --- | --- | --- |
| Enero | Blanco nieve y azul invernal | Noche azul marino iluminada de oro | Negro y azul vivo |
| Febrero | Blanco y verde, con un toque rojo de San Valentín | Pizarra nórdica y escarcha | Azul marino y oro |
| Marzo | Crema y verde primavera | Noche índigo | Verde azulado oscuro y rojo anaranjado |
| Abril | Crema y naranja de Pascua | Pizarra azulada y oro | Azul profundo y oro |
| Mayo | Blanco luminoso y naranja | Noche oceánica con naranja | Azul marino y azul cielo |
| Junio | Azul cielo y tinta índigo | Noche azul iluminada de naranja | Negro y coral |
| Julio | Pleno sol: crema, marrón y naranja | Noche de verano inspirada en Solarized | Azul marino, naranja y oro |
| Agosto | Crema cálido y tinta índigo | Noche pizarra con amarillo | Negro y verde neón |
| Septiembre | Cielo de vuelta al cole y tinta marina | Pizarra y verde azulado | Negro y naranja vivo |
| Octubre | Crema otoñal, naranja tostado y ámbar | Marrón oscuro y brasas | Negro cálido y ámbar |
| Noviembre | Bruma, pizarra y azul acero | Pizarra profunda, naranja y oro | Negro y oro |
| Diciembre | Escarcha y verde azulado | Junto a la chimenea: pizarra y brasas | Noche de invierno y cian helado |

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
| `auto` | Tema claro de 7:00 a 19:00 y tema oscuro el resto del tiempo |
| `day` | Siempre el tema claro del mes actual |
| `night` | Siempre el tema oscuro del mes actual |

La extensión también pasa al tema del mes siguiente el primer día de cada mes.

Bueno saber:

- **Tú decides.** El modo automático está desactivado por defecto: la extensión nunca cambia tu tema sin que se lo pidas.
- **Tu elección se respeta.** Si eliges un tema a mano, se mantiene hasta el siguiente cambio de periodo (de día a noche o un nuevo mes).
- **El alto contraste se mantiene.** Si usas un tema de alto contraste, el modo automático solo actualiza el mes, nunca el nivel de contraste.

## La accesibilidad, primero

Cada tema supera una auditoría de accesibilidad automatizada de más de 130 comprobaciones:

- **Texto legible:** el texto del editor y los colores de sintaxis alcanzan un contraste de al menos **4,5:1 (WCAG AA)** en los temas claros y oscuros, y **7:1 (WCAG AAA)** en los de alto contraste.
- **Apto para daltónicos:** los colores de sintaxis (palabras clave, funciones, cadenas, números, clases, comentarios) y las alertas (errores, advertencias, cambios de Git) se simulan en **protanopía, deuteranopía y tritanopía** para asegurar que siguen siendo distintos.
- **No solo el color:** comentarios, parámetros y atributos van en *cursiva*, el código obsoleto aparece ~~tachado~~ y el código no válido, subrayado.
- **Selección visible en todas partes:** la selección de texto se ve claramente en el editor, la terminal y la consola de depuración, sin confundirse con los resultados de búsqueda.
- **Temas de alto contraste:** el texto seleccionado se vuelve negro sobre azul claro, y todos los paneles tienen bordes visibles y un contorno de foco de teclado muy marcado.

¿Algún color difícil de leer? [Abre una incidencia](https://github.com/mickaellherminez/365-daynight-vscode-theme-ext/issues): los comentarios sobre accesibilidad siempre son bienvenidos.

## Comandos

Abre la paleta de comandos (`Ctrl+Shift+P` o `Cmd+Shift+P`) y escribe **365**:

| Comando | Acción |
| --- | --- |
| `365: Toggle between Light, Dark and High Contrast themes` | Alterna claro → oscuro → alto contraste (igual que el botón de la barra de estado) |
| `365: Apply Light theme` | Aplica el tema claro del mes actual |
| `365: Apply Dark theme` | Aplica el tema oscuro del mes actual |
| `365: Apply High Contrast theme` | Aplica el tema de alto contraste del mes actual |

Estos comandos también están en el menú **365 Themes**, con un clic derecho en el editor. Puedes asignarles tus propios atajos de teclado (`Ctrl+K Ctrl+S`).

## Configuración

| Ajuste | Valor por defecto | Descripción |
| --- | --- | --- |
| `365DayNight.enable` | `false` | Aplica automáticamente el tema del mes actual |
| `365DayNight.mode` | `auto` | `auto` (según la hora), `day` (siempre claro) o `night` (siempre oscuro) |

## Preguntas frecuentes

**¿Cómo cambio VS Code automáticamente entre un tema claro y uno oscuro?**
Instala la extensión y configura `"365DayNight.enable": true`. El tema claro se aplica de 7:00 a 19:00 y el oscuro por la noche.

**¿Hay un tema de VS Code apto para daltónicos?**
Sí. Los 36 temas se prueban con simulaciones de protanopía, deuteranopía y tritanopía, y usan cursiva, subrayado y tachado para que la información nunca dependa solo del color.

**¿La extensión cambiará mi tema sin preguntar?**
No. El modo automático está desactivado por defecto. Sin él, el tema solo cambia cuando eliges uno o pulsas el botón de la barra de estado.

**¿Puedo usar un solo tema, por ejemplo October Dark?**
Por supuesto. Elígelo en el selector de temas (`Ctrl+K Ctrl+T`) y deja el modo automático desactivado.

**¿Para qué sirven los temas de alto contraste?**
Están pensados para baja visión, entornos muy luminosos o largas sesiones de programación. Ofrecen el máximo contraste (AAA), bordes visibles y un contorno de foco muy marcado.

**¿Hay temas festivos?**
Todavía no. Están previstos temas de Año Nuevo, Pascua, Halloween y Navidad. Sigue el [proyecto en GitHub](https://github.com/mickaellherminez/365-daynight-vscode-theme-ext) para enterarte.

## Hoja de ruta

- 🎉 Temas festivos (Año Nuevo, Pascua, Halloween, Navidad)
- ⏰ Horas de día y de noche configurables

Las ideas y sugerencias son bienvenidas en las [incidencias de GitHub](https://github.com/mickaellherminez/365-daynight-vscode-theme-ext/issues).

## Opiniones y contribuciones

- ⭐ ¿Te gustan los temas? Una [reseña en el Marketplace](https://marketplace.visualstudio.com/items?itemName=mickaellherminez.365-daynight-vscode-theme-ext&ssr=false#review-details) ayuda a otros desarrolladores a descubrirlos.
- 🐞 Un error, un color ilegible o una idea: [abre una incidencia](https://github.com/mickaellherminez/365-daynight-vscode-theme-ext/issues).
- 🛠️ ¿Quieres contribuir? Consulta [CONTRIBUTING.md](../CONTRIBUTING.md) (en inglés).

Las notas de versión están en el [CHANGELOG](../CHANGELOG.md).

## Licencia

[MIT](../LICENSE) © Mickaël Lherminez
