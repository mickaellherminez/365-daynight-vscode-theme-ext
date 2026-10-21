# 365 Day & Night Themes – Temas acessíveis do VS Code para todos os meses

**36 temas de cores para o Visual Studio Code: um tema claro, um escuro e um de alto contraste para cada mês do ano.** Alterne entre dia e noite com um clique ou deixe a extensão fazer isso por você. Cada tema é testado quanto à legibilidade (contraste WCAG) e ao daltonismo.

[![Versão no Marketplace](https://img.shields.io/visual-studio-marketplace/v/mickaellherminez.365-daynight-vscode-theme-ext?label=Marketplace)](https://marketplace.visualstudio.com/items?itemName=mickaellherminez.365-daynight-vscode-theme-ext)
[![Instalações](https://img.shields.io/visual-studio-marketplace/i/mickaellherminez.365-daynight-vscode-theme-ext)](https://marketplace.visualstudio.com/items?itemName=mickaellherminez.365-daynight-vscode-theme-ext)
[![Licença MIT](https://img.shields.io/github/license/mickaellherminez/365-daynight-vscode-theme-ext)](../LICENSE)

*Ler esta página em: [English](../README.md) · [Français](README_fr.md) · [Español](README_es.md) · [Deutsch](README_de.md) · [Русский](README_ru.md) · [中文](README_zh.md) · [日本語](README_ja.md) · [हिंदी](README_hi.md) · [العربية](README_ar.md)*

![Temas de outubro claro, escuro e de alto contraste no VS Code: explorador, abas, realce de sintaxe, seleção de texto e barra de status](https://raw.githubusercontent.com/mickaellherminez/365-daynight-vscode-theme-ext/main/assets/screenshots/hero.png)

## Por que você vai gostar

- 🗓️ **Um visual novo a cada mês.** Neve e azul de inverno em janeiro, verde primavera em março, sol pleno em julho, cores de outono em outubro e clima de lareira em dezembro: seu editor acompanha as estações.
- ☀️🌙 **Dia e noite, sempre combinando.** Cada mês tem um tema claro para o dia, um escuro para a noite e um de alto contraste quando você precisa da máxima legibilidade.
- 🔁 **Troca com um clique.** Um botão na barra de status alterna entre claro, escuro e alto contraste.
- ⏰ **Modo automático opcional.** A extensão pode aplicar sozinha o tema do mês atual: claro de dia e escuro à noite.
- 👁️ **Confortável para os olhos e legível para todos.** Todo o texto atende aos níveis de contraste WCAG, e as cores de sintaxe continuam distintas para pessoas com daltonismo.
- 🖥️ **Temas completos.** Editor, barra lateral, abas, terminal, console de depuração, notificações e barra de status: tudo é estilizado, nada volta às cores padrão.

## Instalação

**Pelo VS Code:** abra a visão de Extensões (`Ctrl+Shift+X`, ou `Cmd+Shift+X` no Mac), pesquise **365 Day & Night Themes** e clique em **Instalar**.

**Pelo Marketplace:** [instalar 365 Day & Night Themes](https://marketplace.visualstudio.com/items?itemName=mickaellherminez.365-daynight-vscode-theme-ext).

**Pela linha de comando:**

```sh
code --install-extension mickaellherminez.365-daynight-vscode-theme-ext
```

Requer o Visual Studio Code 1.96 ou mais recente.

## Primeiros passos

1. Abra o seletor de temas: `Ctrl+K` e depois `Ctrl+T` (`Cmd+K` e depois `Cmd+T` no Mac).
2. Digite **365** para ver os 36 temas, por exemplo `365 10-October Dark`.
3. Escolha um. Pronto!

O **botão da barra de status** (canto inferior direito: `LGT`, `DRK` ou `HCT`) alterna entre as versões clara, escura e de alto contraste do mês atual.

## Os 12 meses

![Prévia dos 36 temas: uma versão clara, escura e de alto contraste para cada mês, de janeiro a dezembro](https://raw.githubusercontent.com/mickaellherminez/365-daynight-vscode-theme-ext/main/assets/screenshots/year.png)

| Mês | Claro | Escuro | Alto contraste |
| --- | --- | --- | --- |
| Janeiro | Branco neve e azul de inverno | Noite azul-marinho iluminada de dourado | Preto e azul vivo |
| Fevereiro | Branco e verde, com um toque vermelho de Dia dos Namorados | Ardósia nórdica e geada | Azul-marinho e dourado |
| Março | Creme e verde primavera | Noite índigo | Verde-azulado escuro e vermelho-alaranjado |
| Abril | Creme e laranja de Páscoa | Ardósia azulada e dourado | Azul profundo e dourado |
| Maio | Branco luminoso e laranja | Noite oceânica com laranja | Azul-marinho e azul-celeste |
| Junho | Azul-celeste e tinta índigo | Noite azul iluminada de laranja | Preto e coral |
| Julho | Sol pleno: creme, marrom e laranja | Noite de verão inspirada no Solarized | Azul-marinho, laranja e dourado |
| Agosto | Creme quente e tinta índigo | Noite de ardósia com amarelo | Preto e verde neon |
| Setembro | Céu de volta às aulas e tinta marinha | Ardósia e verde-azulado | Preto e laranja vivo |
| Outubro | Creme outonal, laranja queimado e âmbar | Marrom escuro e brasa | Preto quente e âmbar |
| Novembro | Névoa, ardósia e azul-aço | Ardósia profunda, laranja e dourado | Preto e dourado |
| Dezembro | Geada e verde-azulado | Ao pé da lareira: ardósia e brasa | Noite de inverno e ciano gelado |

## Troca automática entre dia e noite

Quer que o editor acompanhe o relógio? Ative o modo automático:

1. Abra as configurações (`Ctrl+,` ou `Cmd+,`) e pesquise **365DayNight**.
2. Marque **365DayNight: Enable**.

Ou adicione isto ao seu `settings.json`:

```json
{
  "365DayNight.enable": true,
  "365DayNight.mode": "auto"
}
```

| Modo | O que faz |
| --- | --- |
| `auto` | Tema claro das 7h às 19h e tema escuro no restante do tempo |
| `day` | Sempre o tema claro do mês atual |
| `night` | Sempre o tema escuro do mês atual |

A extensão também passa para o tema do mês seguinte no primeiro dia de cada mês.

Bom saber:

- **Você decide.** O modo automático vem desativado: a extensão nunca muda seu tema sem você pedir.
- **Sua escolha é respeitada.** Se você escolher um tema manualmente, ele permanece até a próxima mudança de período (dia para noite ou novo mês).
- **Alto contraste continua alto contraste.** Se você usa um tema de alto contraste, o modo automático só atualiza o mês, nunca o nível de contraste.

## Acessibilidade em primeiro lugar

Cada tema passa por uma auditoria de acessibilidade automatizada com mais de 130 verificações:

- **Texto legível:** o texto do editor e as cores de sintaxe atingem um contraste de pelo menos **4,5:1 (WCAG AA)** nos temas claros e escuros, e **7:1 (WCAG AAA)** nos de alto contraste.
- **Amigável para daltônicos:** as cores de sintaxe (palavras-chave, funções, strings, números, classes, comentários) e os alertas (erros, avisos, alterações do Git) são simulados em **protanopia, deuteranopia e tritanopia** para garantir que continuem distintos.
- **Não só cor:** comentários, parâmetros e atributos ficam em *itálico*, código obsoleto aparece ~~riscado~~ e código inválido, sublinhado.
- **Seleção visível em todo lugar:** a seleção de texto é bem visível no editor, no terminal e no console de depuração, sem se confundir com os resultados de busca.
- **Temas de alto contraste:** o texto selecionado fica preto sobre azul-claro, e todos os painéis têm bordas visíveis e um contorno de foco do teclado bem marcado.

Alguma cor difícil de ler? [Abra uma issue](https://github.com/mickaellherminez/365-daynight-vscode-theme-ext/issues): comentários sobre acessibilidade são sempre bem-vindos.

## Comandos

Abra a paleta de comandos (`Ctrl+Shift+P` ou `Cmd+Shift+P`) e digite **365**:

| Comando | Ação |
| --- | --- |
| `365: Toggle between Light, Dark and High Contrast themes` | Alterna claro → escuro → alto contraste (igual ao botão da barra de status) |
| `365: Apply Light theme` | Aplica o tema claro do mês atual |
| `365: Apply Dark theme` | Aplica o tema escuro do mês atual |
| `365: Apply High Contrast theme` | Aplica o tema de alto contraste do mês atual |

Esses comandos também estão no menu **365 Themes**, com um clique direito no editor. Você pode atribuir seus próprios atalhos de teclado (`Ctrl+K Ctrl+S`).

## Configurações

| Configuração | Padrão | Descrição |
| --- | --- | --- |
| `365DayNight.enable` | `false` | Aplica automaticamente o tema do mês atual |
| `365DayNight.mode` | `auto` | `auto` (pelo horário), `day` (sempre claro) ou `night` (sempre escuro) |

## Perguntas frequentes

**Como alternar o VS Code automaticamente entre um tema claro e um escuro?**
Instale a extensão e defina `"365DayNight.enable": true`. O tema claro é aplicado das 7h às 19h e o escuro à noite.

**Existe um tema do VS Code amigável para daltônicos?**
Sim. Os 36 temas são testados com simulações de protanopia, deuteranopia e tritanopia e usam itálico, sublinhado e riscado para que a informação nunca dependa só da cor.

**A extensão vai mudar meu tema sem perguntar?**
Não. O modo automático vem desativado. Sem ele, o tema só muda quando você escolhe um ou clica no botão da barra de status.

**Posso usar um único tema, por exemplo October Dark?**
Claro. Escolha-o no seletor de temas (`Ctrl+K Ctrl+T`) e deixe o modo automático desativado.

**Para que servem os temas de alto contraste?**
Eles foram pensados para baixa visão, ambientes muito claros ou longas sessões de programação, com contraste máximo (AAA), bordas visíveis e um contorno de foco bem marcado.

**Há temas de datas comemorativas?**
Ainda não. Temas de Ano-Novo, Páscoa, Halloween e Natal estão planejados. Acompanhe o [projeto no GitHub](https://github.com/mickaellherminez/365-daynight-vscode-theme-ext) para ser avisado.

## Roteiro

- 🎉 Temas de datas comemorativas (Ano-Novo, Páscoa, Halloween, Natal)
- ⏰ Horários de dia e de noite configuráveis

Ideias e sugestões são bem-vindas nas [issues do GitHub](https://github.com/mickaellherminez/365-daynight-vscode-theme-ext/issues).

## Opiniões e contribuições

- ⭐ Gostou dos temas? Uma [avaliação no Marketplace](https://marketplace.visualstudio.com/items?itemName=mickaellherminez.365-daynight-vscode-theme-ext&ssr=false#review-details) ajuda outros desenvolvedores a encontrá-los.
- 🐞 Um bug, uma cor ilegível ou uma ideia: [abra uma issue](https://github.com/mickaellherminez/365-daynight-vscode-theme-ext/issues).
- 🛠️ Quer contribuir? Veja o [CONTRIBUTING.md](../CONTRIBUTING.md) (em inglês).

As notas de versão estão no [CHANGELOG](../CHANGELOG.md).

## Licença

[MIT](../LICENSE) © Mickaël Lherminez
