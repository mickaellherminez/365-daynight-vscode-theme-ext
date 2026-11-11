# 365 Day & Night – Monthly Accessible Themes

**Donnez à VS Code un nouveau style chaque mois : 48 thèmes accessibles qui passent du jour à la nuit en un clic ou tout seuls.**

[![Version sur le Marketplace](https://vsmarketplacebadges.dev/version-short/mickaellherminez.365-daynight-vscode-theme-ext.svg?subject=Marketplace&style=flat)](https://marketplace.visualstudio.com/items?itemName=mickaellherminez.365-daynight-vscode-theme-ext)
[![Installations](https://vsmarketplacebadges.dev/installs-short/mickaellherminez.365-daynight-vscode-theme-ext.svg?style=flat)](https://marketplace.visualstudio.com/items?itemName=mickaellherminez.365-daynight-vscode-theme-ext)
[![Téléchargements](https://vsmarketplacebadges.dev/downloads-short/mickaellherminez.365-daynight-vscode-theme-ext.svg?style=flat)](https://marketplace.visualstudio.com/items?itemName=mickaellherminez.365-daynight-vscode-theme-ext)
[![Note](https://vsmarketplacebadges.dev/rating-short/mickaellherminez.365-daynight-vscode-theme-ext.svg?style=flat)](https://marketplace.visualstudio.com/items?itemName=mickaellherminez.365-daynight-vscode-theme-ext&ssr=false#review-details)
[![Téléchargements sur Open VSX](https://img.shields.io/open-vsx/dt/mickaellherminez/365-daynight-vscode-theme-ext?label=Open%20VSX%20downloads)](https://open-vsx.org/extension/mickaellherminez/365-daynight-vscode-theme-ext)
[![État de la CI](https://img.shields.io/github/actions/workflow/status/mickaellherminez/365-daynight-vscode-theme-ext/ci.yml?branch=main&label=CI)](https://github.com/mickaellherminez/365-daynight-vscode-theme-ext/actions/workflows/ci.yml)
[![Licence MIT](https://img.shields.io/github/license/mickaellherminez/365-daynight-vscode-theme-ext)](../LICENSE)

```sh
code --install-extension mickaellherminez.365-daynight-vscode-theme-ext
```

Ou installez-la depuis le [Marketplace](https://marketplace.visualstudio.com/items?itemName=mickaellherminez.365-daynight-vscode-theme-ext) ou [Open VSX](https://open-vsx.org/extension/mickaellherminez/365-daynight-vscode-theme-ext). Nécessite VS Code 1.96 ou plus récent.

Prévisualisez chaque mois et chaque variante, et lisez l’audit sous forme de graphiques, sur [le site](https://365daynight.mickaellherminez.net) (en anglais).

*Lire cette page en : [English](../README.md) · [Español](README_es.md) · [Deutsch](README_de.md) · [Português](README_pt.md) · [Русский](README_ru.md) · [中文](README_zh.md) · [日本語](README_ja.md) · [हिंदी](README_hi.md) · [العربية](README_ar.md)*

![Démo dans VS Code : les flèches du bouton de la barre d'état changent le mois d'octobre à décembre, un clic sur le bouton passe de Light à Dark, et un lien de son infobulle applique High Contrast](https://raw.githubusercontent.com/mickaellherminez/365-daynight-vscode-theme-ext/main/assets/screenshots/demo-months.gif)

## Pourquoi la choisir

### 🗓️ Un nouveau style chaque mois

Givre en janvier, jeunes pousses en mars, lagon en juillet, feuilles rousses en octobre, nuit polaire en décembre. Toute la fenêtre suit la saison : éditeur, barre latérale, onglets, terminal, barre d'état, chat, graphe Git et éditeur de fusion.

**La preuve :** 12 mois de 4 thèmes chacun, Light, Dark, High Contrast et High Contrast Light, et plus de 480 couleurs dans chaque thème. [Voir tous les mois](#les-12-mois).

### 👁️ Conçue pour rester lisible

Le texte atteint un contraste d'au moins 4,5:1 (WCAG AA) dans les thèmes Light et Dark, et 7:1 (WCAG AAA) dans les thèmes High Contrast. Les couleurs de syntaxe, les erreurs et les changements Git restent distincts en cas de daltonisme, et les commentaires, le code obsolète et le code invalide se distinguent aussi par l'italique, le barré ou le soulignement.

**La preuve :** chaque thème doit réussir un audit automatique de plus de 250 contrôles avant chaque publication, et [le rapport complet](AUDIT.md) donne les résultats de chaque thème et les limites de l'audit. Le daltonisme est vérifié par simulation : les retours de vraies personnes sont donc très bienvenus, [rejoignez l'appel aux testeurs](https://github.com/mickaellherminez/365-daynight-vscode-theme-ext/issues/47).

### 🌗 Le jour et la nuit, sans y penser

Cliquez sur le bouton de la barre d'état pour passer de Light à Dark. Ou laissez l'extension suivre l'horloge, aux heures de votre choix, ou l'apparence de votre système.

**La preuve :** le mode automatique est désactivé par défaut : votre thème ne change que si vous le demandez. Le mois choisi et vos choix manuels sont respectés.

## Les 12 mois

![Aperçu des 48 thèmes : une version claire, sombre, à contraste élevé et à contraste élevé claire pour chaque mois, de janvier à décembre](https://raw.githubusercontent.com/mickaellherminez/365-daynight-vscode-theme-ext/main/assets/screenshots/year.png)

| Mois | Ambiance | Mois | Ambiance |
| --- | --- | --- | --- |
| Janvier | Givre | Juillet | Lagon |
| Février | Brume lavande | Août | Sable chaud |
| Mars | Jeunes pousses | Septembre | Vendanges |
| Avril | Giboulées | Octobre | Feuilles rousses |
| Mai | Prairie fleurie | Novembre | Brume et sous-bois |
| Juin | Longues journées | Décembre | Nuit polaire |

Le [guide complet](GUIDE_fr.md#les-12-mois) donne les couleurs de chaque thème.

## Comment l'utiliser

Sur Mac, utilisez `Cmd` au lieu de `Ctrl`.

| Pour… | Faites ceci |
| --- | --- |
| **Choisir un thème** | Appuyez sur `Ctrl+K` puis `Ctrl+T`, et tapez **365** |
| **Passer de Light à Dark** | Cliquez sur `LGT` ou `DRK` dans la barre d'état, en bas à droite |
| **Changer de mois** | Cliquez sur les flèches autour : `‹ 10 DRK ›` |
| **Revenir au mois en cours** | Lancez `365: Back to the current month` depuis la palette de commandes (`Ctrl+Shift+P`) |
| **Utiliser le contraste élevé** | Lancez `365: Apply High Contrast theme` ou `365: Apply High Contrast Light theme` |
| **Quitter le contraste élevé** | Lancez `365: Apply Light theme` ou `365: Apply Dark theme` |
| **Activer le mode automatique** | Ouvrez les paramètres (`Ctrl+,`), cherchez **365DayNight** et cochez **Enable** |
| **Ajouter un raccourci clavier** | Appuyez sur `Ctrl+K` puis `Ctrl+S`, tapez **365**, double-cliquez sur une commande et appuyez sur vos touches. Aucun n'est défini par défaut |

### Mode automatique

La première fois que vous utilisez un thème 365, l'extension vous demande une seule fois si vous voulez le changement automatique. Rien ne change sans votre choix.

![Démo dans VS Code : après le choix de November Light dans le sélecteur de thèmes, une notification propose de suivre l'horloge, de suivre le système ou de ne rien faire, et un clic sur Follow the clock confirme que le changement automatique est activé](https://raw.githubusercontent.com/mickaellherminez/365-daynight-vscode-theme-ext/main/assets/screenshots/demo-first-use.gif)

Vous pouvez ensuite choisir vos heures. Une nouvelle heure s'applique environ 2 secondes après la fin de la saisie.

![Démo dans VS Code : dans les paramètres, 365 Day Night: Enable est coché, puis régler Night Start sur une heure passée applique Dark, et le remettre à 19:00 applique Light](https://raw.githubusercontent.com/mickaellherminez/365-daynight-vscode-theme-ext/main/assets/screenshots/demo-auto.gif)

**➡️ Le [guide complet](GUIDE_fr.md) détaille tout :** [le mode automatique et ses heures](GUIDE_fr.md#bascule-automatique-jour--nuit), [suivre votre système](GUIDE_fr.md#suivre-votre-système), [toutes les commandes](GUIDE_fr.md#commandes) et [tous les paramètres](GUIDE_fr.md#paramètres).

## Accessibilité

- **Texte lisible :** WCAG AA dans les thèmes Light et Dark, AAA dans les thèmes High Contrast.
- **Daltonisme :** les couleurs de syntaxe et les alertes sont simulées pour la protanopie, la deutéranopie et la tritanopie.
- **Pas seulement la couleur :** les commentaires, paramètres et attributs sont en *italique*, le code obsolète est ~~barré~~, le code invalide est souligné.
- **Clavier et lecteurs d'écran :** les thèmes High Contrast ont un contour de focus marqué, et chaque partie du bouton de la barre d'état a sa propre étiquette vocale.

Quelque chose de difficile à lire ? [Dites-le-nous](https://github.com/mickaellherminez/365-daynight-vscode-theme-ext/issues/new/choose). [Plus de détails](GUIDE_fr.md#laccessibilité-avant-tout) et [le rapport d'audit complet](AUDIT.md).

## Nouveau style en 1.0

Tous les thèmes ont été refaits en version 1.0.0, et votre thème, vos réglages et vos raccourcis sont conservés. Vous préférez l'ancien style ? [Voici comment revenir en arrière](GUIDE_fr.md#nouveau-style-et-comment-revenir-en-arrière).

## Questions fréquentes

**Comment faire passer VS Code automatiquement d'un thème clair à un thème sombre ?**
Installez l'extension et réglez `"365DayNight.enable": true`. Le thème clair s'applique de 7 h à 19 h, le thème sombre la nuit. Vous pouvez changer ces heures avec `365DayNight.dayStart` et `365DayNight.nightStart`.

**VS Code peut-il suivre le mode clair ou sombre de mon système avec ces thèmes ?**
Oui. Réglez `"365DayNight.enable": true` et `"365DayNight.mode": "system"`. Votre système décide entre clair et sombre, et l'extension garde les thèmes sur le mois en cours.

**Existe-t-il un thème VS Code adapté aux daltoniens ?**
Oui. Tous les thèmes sont testés avec des simulations de protanopie, deutéranopie et tritanopie, et les commentaires, le code obsolète et le code invalide se distinguent aussi par l'italique, le barré ou le soulignement.

**L'extension va-t-elle changer mon thème sans me demander ?**
Non. Le mode automatique est désactivé par défaut. Sans lui, le thème ne change que lorsque vous en choisissez un ou cliquez sur le bouton de la barre d'état. La première fois que vous utilisez un thème 365, une notification le propose, et rien ne change sans votre choix.

**Puis-je utiliser un seul thème, par exemple October Dark ?**
Bien sûr. Choisissez-le dans le sélecteur de thèmes (`Ctrl+K Ctrl+T`) et laissez le mode automatique désactivé.

**À quoi servent les thèmes à contraste élevé ?**
Ils sont pensés pour la basse vision, les environnements très lumineux ou les longues sessions de code. Ils offrent un contraste maximal (AAA), des bordures visibles et un contour de focus très marqué. Chaque mois en a deux : une version sombre, et une version claire, High Contrast Light, pour les environnements lumineux.

**Comment essayer une nouvelle version avant tout le monde ?**
Quand une préversion existe, ouvrez la page de l'extension dans la vue Extensions et cliquez sur **Switch to Pre-Release Version** (passer à la préversion). VS Code installe alors la préversion et ses mises à jour. Pour revenir à la version normale, cliquez sur **Switch to Release Version** sur la même page. Vos retours sur une préversion sont les bienvenus dans les [tickets GitHub](https://github.com/mickaellherminez/365-daynight-vscode-theme-ext/issues). Un [appel aux testeurs](https://github.com/mickaellherminez/365-daynight-vscode-theme-ext/issues/47) est ouvert, avec une courte liste de points à vérifier.

## Les thèmes vous plaisent ?

⭐ Un [avis sur le Marketplace](https://marketplace.visualstudio.com/items?itemName=mickaellherminez.365-daynight-vscode-theme-ext&ssr=false#review-details) aide d'autres développeurs à les découvrir.

Un bug, une couleur illisible ou une idée ? [Ouvrez un ticket](https://github.com/mickaellherminez/365-daynight-vscode-theme-ext/issues/new/choose). Envie de contribuer ? Consultez [CONTRIBUTING.md](../CONTRIBUTING.md). Les notes de version sont dans le [CHANGELOG](../CHANGELOG.md).

[MIT](../LICENSE) © Mickaël Lherminez
