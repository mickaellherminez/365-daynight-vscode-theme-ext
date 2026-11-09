# 365 Day & Night – Monthly Accessible Themes

**Dê ao VS Code um visual novo a cada mês: 48 temas acessíveis que alternam entre dia e noite com um clique ou sozinhos.**

[![Versão no Marketplace](https://vsmarketplacebadges.dev/version-short/mickaellherminez.365-daynight-vscode-theme-ext.svg?subject=Marketplace&style=flat)](https://marketplace.visualstudio.com/items?itemName=mickaellherminez.365-daynight-vscode-theme-ext)
[![Instalações](https://vsmarketplacebadges.dev/installs-short/mickaellherminez.365-daynight-vscode-theme-ext.svg?style=flat)](https://marketplace.visualstudio.com/items?itemName=mickaellherminez.365-daynight-vscode-theme-ext)
[![Downloads](https://vsmarketplacebadges.dev/downloads-short/mickaellherminez.365-daynight-vscode-theme-ext.svg?style=flat)](https://marketplace.visualstudio.com/items?itemName=mickaellherminez.365-daynight-vscode-theme-ext)
[![Avaliação](https://vsmarketplacebadges.dev/rating-short/mickaellherminez.365-daynight-vscode-theme-ext.svg?style=flat)](https://marketplace.visualstudio.com/items?itemName=mickaellherminez.365-daynight-vscode-theme-ext&ssr=false#review-details)
[![Downloads no Open VSX](https://img.shields.io/open-vsx/dt/mickaellherminez/365-daynight-vscode-theme-ext?label=Open%20VSX%20downloads)](https://open-vsx.org/extension/mickaellherminez/365-daynight-vscode-theme-ext)
[![Status da CI](https://img.shields.io/github/actions/workflow/status/mickaellherminez/365-daynight-vscode-theme-ext/ci.yml?branch=main&label=CI)](https://github.com/mickaellherminez/365-daynight-vscode-theme-ext/actions/workflows/ci.yml)
[![Licença MIT](https://img.shields.io/github/license/mickaellherminez/365-daynight-vscode-theme-ext)](../LICENSE)

```sh
code --install-extension mickaellherminez.365-daynight-vscode-theme-ext
```

Ou instale pelo [Marketplace](https://marketplace.visualstudio.com/items?itemName=mickaellherminez.365-daynight-vscode-theme-ext) ou pelo [Open VSX](https://open-vsx.org/extension/mickaellherminez/365-daynight-vscode-theme-ext). Requer o VS Code 1.96 ou mais recente.

*Ler esta página em: [English](../README.md) · [Français](README_fr.md) · [Español](README_es.md) · [Deutsch](README_de.md) · [Русский](README_ru.md) · [中文](README_zh.md) · [日本語](README_ja.md) · [हिंदी](README_hi.md) · [العربية](README_ar.md)*

![Demonstração no VS Code: as setas do botão da barra de status mudam o mês de outubro para dezembro, um clique no botão alterna de Light para Dark e um link na dica aplica High Contrast](https://raw.githubusercontent.com/mickaellherminez/365-daynight-vscode-theme-ext/main/assets/screenshots/demo-months.gif)

## Por que escolher

### 🗓️ Um visual novo a cada mês

Geada em janeiro, brotos novos em março, uma lagoa em julho, folhas de outono em outubro e uma noite polar em dezembro. A janela inteira acompanha a estação: editor, barra lateral, abas, terminal, barra de status, chat, gráfico do Git e editor de mesclagem.

**A prova:** 12 meses com 4 temas cada, Light, Dark, High Contrast e High Contrast Light, e mais de 480 cores em cada tema. [Ver todos](#os-12-meses).

### 👁️ Feita para continuar legível

O texto atinge contraste de pelo menos 4,5:1 (WCAG AA) nos temas Light e Dark, e 7:1 (WCAG AAA) nos temas High Contrast. As cores de sintaxe, os erros e as alterações do Git continuam distintos com daltonismo, e comentários, código obsoleto e código inválido também se diferenciam por itálico, riscado ou sublinhado.

**A prova:** cada tema precisa passar por uma auditoria automática de mais de 250 verificações antes de cada publicação, e [o relatório completo](AUDIT.md) traz os resultados de cada tema e os limites da auditoria. O daltonismo é verificado com simulações, então a opinião de pessoas reais é muito bem-vinda: [participe da chamada para testadores](https://github.com/mickaellherminez/365-daynight-vscode-theme-ext/issues/47).

### 🌗 Dia e noite, sem precisar pensar

Clique no botão da barra de status para alternar entre Light e Dark. Ou deixe a extensão seguir o relógio, nos horários que você escolher, ou a aparência do seu sistema.

**A prova:** o modo automático vem desativado, então seu tema só muda se você pedir. O mês escolhido e suas escolhas manuais são respeitados.

## Os 12 meses

![Prévia dos 48 temas: uma versão clara, escura, de alto contraste e de alto contraste claro para cada mês, de janeiro a dezembro](https://raw.githubusercontent.com/mickaellherminez/365-daynight-vscode-theme-ext/main/assets/screenshots/year.png)

| Mês | Ambiente | Mês | Ambiente |
| --- | --- | --- | --- |
| Janeiro | Geada | Julho | Lagoa |
| Fevereiro | Névoa de lavanda | Agosto | Areia quente |
| Março | Brotos novos | Setembro | Vindima |
| Abril | Chuvas de abril | Outubro | Folhas de outono |
| Maio | Prado florido | Novembro | Névoa e sub-bosque |
| Junho | Dias longos | Dezembro | Noite polar |

O [guia completo](GUIDE_pt.md#os-12-meses) lista as cores de cada tema.

## Como usar

No Mac, use `Cmd` em vez de `Ctrl`.

| Para… | Faça isto |
| --- | --- |
| **Escolher um tema** | Pressione `Ctrl+K` e depois `Ctrl+T`, e digite **365** |
| **Alternar entre Light e Dark** | Clique em `LGT` ou `DRK` na barra de status, no canto inferior direito |
| **Mudar o mês** | Clique nas setas ao redor: `‹ 10 DRK ›` |
| **Voltar ao mês atual** | Execute `365: Back to the current month` na paleta de comandos (`Ctrl+Shift+P`) |
| **Usar alto contraste** | Execute `365: Apply High Contrast theme` ou `365: Apply High Contrast Light theme` |
| **Sair do alto contraste** | Execute `365: Apply Light theme` ou `365: Apply Dark theme` |
| **Ativar o modo automático** | Abra as configurações (`Ctrl+,`), procure **365DayNight** e marque **Enable** |
| **Adicionar um atalho de teclado** | Pressione `Ctrl+K` e depois `Ctrl+S`, digite **365**, clique duas vezes em um comando e pressione suas teclas. Nenhum vem definido |

### Modo automático

Na primeira vez que você usa um tema 365, a extensão pergunta uma única vez se você quer a troca automática. Nada muda sem a sua escolha.

![Demonstração no VS Code: depois de escolher November Light no seletor de temas, uma notificação oferece seguir o relógio, seguir o sistema ou não fazer nada, e um clique em Follow the clock confirma que a troca automática está ativa](https://raw.githubusercontent.com/mickaellherminez/365-daynight-vscode-theme-ext/main/assets/screenshots/demo-first-use.gif)

Depois, você pode escolher seus horários. Um novo horário é aplicado cerca de 2 segundos depois que você para de digitar.

![Demonstração no VS Code: nas configurações, 365 Day Night: Enable é marcado, depois um horário já passado em Night Start aplica Dark, e voltar a 19:00 aplica Light](https://raw.githubusercontent.com/mickaellherminez/365-daynight-vscode-theme-ext/main/assets/screenshots/demo-auto.gif)

**➡️ O [guia completo](GUIDE_pt.md) detalha tudo:** [o modo automático e seus horários](GUIDE_pt.md#troca-automática-entre-dia-e-noite), [seguir o seu sistema](GUIDE_pt.md#seguir-o-seu-sistema), [todos os comandos](GUIDE_pt.md#comandos) e [todas as configurações](GUIDE_pt.md#configurações).

## Acessibilidade

- **Texto legível:** WCAG AA nos temas Light e Dark, AAA nos temas High Contrast.
- **Daltonismo:** as cores de sintaxe e os alertas são simulados para protanopia, deuteranopia e tritanopia.
- **Não só cor:** comentários, parâmetros e atributos ficam em *itálico*, código obsoleto fica ~~riscado~~ e código inválido fica sublinhado.
- **Teclado e leitores de tela:** os temas High Contrast têm um contorno de foco forte, e cada parte do botão da barra de status tem seu próprio rótulo falado.

Algo difícil de ler? [Conte para nós](https://github.com/mickaellherminez/365-daynight-vscode-theme-ext/issues/new/choose). [Mais detalhes](GUIDE_pt.md#acessibilidade-em-primeiro-lugar) e [o relatório de auditoria completo](AUDIT.md).

## Novo visual na 0.13

Todos os temas foram redesenhados na versão 0.13.0, e seu tema, suas configurações e seus atalhos são mantidos. Prefere o visual anterior? [Veja como voltar atrás](GUIDE_pt.md#novo-visual-e-como-voltar-atrás).

## Perguntas frequentes

**Como alternar o VS Code automaticamente entre um tema claro e um escuro?**
Instale a extensão e defina `"365DayNight.enable": true`. O tema claro é aplicado das 7h às 19h e o escuro à noite. Você pode alterar esses horários com `365DayNight.dayStart` e `365DayNight.nightStart`.

**O VS Code pode seguir o modo claro ou escuro do meu sistema com estes temas?**
Sim. Defina `"365DayNight.enable": true` e `"365DayNight.mode": "system"`. Seu sistema decide entre claro e escuro, e a extensão mantém os temas no mês atual.

**Existe um tema do VS Code amigável para daltônicos?**
Sim. Todos os temas são testados com simulações de protanopia, deuteranopia e tritanopia, e comentários, código obsoleto e código inválido também se diferenciam por itálico, riscado ou sublinhado.

**A extensão vai mudar meu tema sem perguntar?**
Não. O modo automático vem desativado. Sem ele, o tema só muda quando você escolhe um ou clica no botão da barra de status. Na primeira vez que você usa um tema 365, uma notificação o oferece, e nada muda sem a sua escolha.

**Posso usar um único tema, por exemplo October Dark?**
Claro. Escolha-o no seletor de temas (`Ctrl+K Ctrl+T`) e deixe o modo automático desativado.

**Para que servem os temas de alto contraste?**
Eles foram pensados para baixa visão, ambientes muito claros ou longas sessões de programação, com contraste máximo (AAA), bordas visíveis e um contorno de foco bem marcado. Cada mês tem duas: uma versão escura e uma clara, High Contrast Light, para ambientes muito claros.

**Como experimentar uma nova versão antes de todo mundo?**
Quando houver uma versão prévia, abra a página da extensão na visualização de Extensões e clique em **Switch to Pre-Release Version** (mudar para a versão prévia). O VS Code instala então a versão prévia e suas atualizações. Para voltar à versão normal, clique em **Switch to Release Version** na mesma página. Comentários sobre uma versão prévia são bem-vindos nas [issues do GitHub](https://github.com/mickaellherminez/365-daynight-vscode-theme-ext/issues). Há uma [chamada para testadores](https://github.com/mickaellherminez/365-daynight-vscode-theme-ext/issues/47) aberta, com uma lista curta de pontos a verificar.

## Gostou dos temas?

⭐ Uma [avaliação no Marketplace](https://marketplace.visualstudio.com/items?itemName=mickaellherminez.365-daynight-vscode-theme-ext&ssr=false#review-details) ajuda outros desenvolvedores a encontrá-los.

Um bug, uma cor ilegível ou uma ideia? [Abra uma issue](https://github.com/mickaellherminez/365-daynight-vscode-theme-ext/issues/new/choose). Quer contribuir? Veja [CONTRIBUTING.md](../CONTRIBUTING.md). As notas de versão estão no [CHANGELOG](../CHANGELOG.md).

[MIT](../LICENSE) © Mickaël Lherminez
