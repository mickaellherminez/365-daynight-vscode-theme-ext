# 365 Day & Night Themes – Thèmes VS Code accessibles pour chaque mois

**48 thèmes de couleurs pour Visual Studio Code : un thème clair, un thème sombre, un thème à contraste élevé et un thème à contraste élevé clair pour chaque mois de l'année.** Passez du jour à la nuit en un clic, ou laissez l'extension le faire pour vous. Chaque thème est testé pour la lisibilité (contraste WCAG) et pour le daltonisme.

[![Version sur le Marketplace](https://img.shields.io/visual-studio-marketplace/v/mickaellherminez.365-daynight-vscode-theme-ext?label=Marketplace)](https://marketplace.visualstudio.com/items?itemName=mickaellherminez.365-daynight-vscode-theme-ext)
[![Installations](https://img.shields.io/visual-studio-marketplace/i/mickaellherminez.365-daynight-vscode-theme-ext)](https://marketplace.visualstudio.com/items?itemName=mickaellherminez.365-daynight-vscode-theme-ext)
[![Licence MIT](https://img.shields.io/github/license/mickaellherminez/365-daynight-vscode-theme-ext)](../LICENSE)

*Lire cette page en : [English](../README.md) · [Español](README_es.md) · [Deutsch](README_de.md) · [Português](README_pt.md) · [Русский](README_ru.md) · [中文](README_zh.md) · [日本語](README_ja.md) · [हिंदी](README_hi.md) · [العربية](README_ar.md)*

![Thèmes d'octobre clair, sombre, contraste élevé et contraste élevé clair dans VS Code : explorateur, onglets, coloration syntaxique, sélection de texte et barre d'état](https://raw.githubusercontent.com/mickaellherminez/365-daynight-vscode-theme-ext/main/assets/screenshots/hero.png)

## Pourquoi vous allez l'aimer

- 🗓️ **Un nouveau style chaque mois.** Givre en janvier, jeunes pousses en mars, lagon en juillet, feuilles rousses en octobre, nuit polaire en décembre : toute la fenêtre suit les saisons, pas seulement l'éditeur.
- ☀️🌙 **Jour et nuit, toujours assortis.** Chaque mois propose un thème clair pour la journée, un thème sombre pour le soir et deux thèmes à contraste élevé, sombre et clair (High Contrast Light), quand vous avez besoin d'une lisibilité maximale.
- 🔁 **Bascule en un clic.** Un bouton dans la barre d'état passe du thème clair au sombre, et inversement. Le contraste élevé est accessible par une commande.
- ⏰ **Mode automatique (optionnel).** L'extension peut appliquer seule le thème du mois en cours : clair le jour, sombre la nuit.
- 👁️ **Reposant pour les yeux, lisible par tous.** Tout le texte respecte les niveaux de contraste WCAG, et les couleurs de syntaxe restent distinctes pour les personnes daltoniennes.
- 🖥️ **Des thèmes soignés.** Éditeur, barre latérale, onglets, terminal, console de débogage, notifications et barre d'état : tout est stylé, avec plus de 480 couleurs par thème. Le chat, les résultats de tests, les icônes de symboles, le graphe Git, l'éditeur de fusion et le multi-diff suivent aussi la palette du mois.

## Installation

**Depuis VS Code :** ouvrez la vue Extensions (`Ctrl+Shift+X`, ou `Cmd+Shift+X` sur Mac), cherchez **365 Day & Night Themes** puis cliquez sur **Installer**.

**Depuis le Marketplace :** [installer 365 Day & Night Themes](https://marketplace.visualstudio.com/items?itemName=mickaellherminez.365-daynight-vscode-theme-ext).

**En ligne de commande :**

```sh
code --install-extension mickaellherminez.365-daynight-vscode-theme-ext
```

Nécessite Visual Studio Code 1.96 ou plus récent.

## Prise en main

1. Ouvrez le sélecteur de thèmes : `Ctrl+K` puis `Ctrl+T` (`Cmd+K` puis `Cmd+T` sur Mac).
2. Tapez **365** pour afficher tous les thèmes, par exemple `365 10-October Dark`.
3. Choisissez-en un. C'est tout !

La première fois que vous utilisez un thème 365, une notification propose la bascule automatique : **Follow the clock** (suivre l'heure : clair le jour, sombre la nuit), **Follow my system** (suivre le mode clair ou sombre de votre système) ou **No thanks** (non merci). Rien ne change sans votre choix, et la question n'est posée qu'une fois. Après un choix, un message confirme ce qui est activé, avec un bouton **Open Settings** pour changer les heures ou désactiver. Pour changer d'avis plus tard, voyez la section sur la bascule automatique ci-dessous.

Le **bouton de la barre d'état** (en bas à droite : `LGT`, `DRK`, `HCT` ou `HCL`) permet de passer de la version claire à la version sombre du mois en cours. Pour le contraste élevé, lancez `365: Apply High Contrast theme` depuis la palette de commandes. Dans un thème à contraste élevé, le bouton passe du contraste élevé sombre (`HCT`) au contraste élevé clair (`HCL`), et inversement : un clic ne quitte jamais le contraste élevé. Pour quitter le contraste élevé, lancez `365: Apply Light theme` ou `365: Apply Dark theme`. Vous pouvez aussi survoler le bouton et cliquer sur son lien **Light** ou **Dark**.

Pour essayer un autre mois, cliquez sur les flèches qui l'entourent (`‹ 10 DRK ›`). Le chiffre est le mois, de `01` à `12`, et les flèches gardent la variante : clair, sombre, contraste élevé ou contraste élevé clair. Décembre est suivi de janvier. Pour revenir, lancez `365: Back to the current month` depuis la palette de commandes. Les flèches et le chiffre n'apparaissent qu'avec un thème 365. Survolez le bouton pour voir le nom complet du thème, avec des liens vers le contraste élevé, vers le contraste élevé clair et vers le mois en cours. Dans un thème à contraste élevé, l'infobulle propose à la place des liens vers Light et Dark.

## Les 12 mois

![Aperçu des 48 thèmes : une version claire, sombre, à contraste élevé et à contraste élevé claire pour chaque mois, de janvier à décembre](https://raw.githubusercontent.com/mickaellherminez/365-daynight-vscode-theme-ext/main/assets/screenshots/year.png)

| Mois | Ambiance | Clair | Sombre | Contraste élevé | Contraste élevé clair |
| --- | --- | --- | --- | --- | --- |
| Janvier | Givre | Bleu glacier et bleu profond | Bleu d'hiver profond et bleu glace | Noir bleuté et bleu glace | Blanc glacé et bleu marine |
| Février | Brume lavande | Lavande pâle et violet | Nuit gris-violet et lilas | Noir violacé et lilas pâle | Blanc lavande et prune |
| Mars | Jeunes pousses | Vert tendre et vert bourgeon | Nuit olive et vert bourgeon | Noir olive et vert vif | Vert pâle et vert forêt |
| Avril | Giboulées | Ciel de pluie et rose cerisier | Ardoise de pluie et rose cerisier | Noir bleuté et rose cerisier | Ciel pâle et rose profond |
| Mai | Prairie fleurie | Vert prairie et or olive | Nuit vert profond et jaune bouton-d'or | Noir verdâtre et or pâle | Vert pâle et bronze foncé |
| Juin | Longues journées | Ciel clair et bleu d'été | Nuit bleu pétrole et pervenche | Noir et pervenche | Blanc ciel et bleu roi |
| Juillet | Lagon | Eau turquoise et corail | Lagon profond et corail | Noir sarcelle et corail pâle | Turquoise pâle et rouge corail |
| Août | Sable chaud | Sable doré et caramel | Nuit brune et ambre | Noir brun et ambre | Blanc chaud et ambre foncé |
| Septembre | Vendanges | Rose pâle et prune | Nuit lie-de-vin et prune | Noir lie-de-vin et orchidée | Rose pâle et prune profonde |
| Octobre | Feuilles rousses | Pêche et roux | Nuit brun chaud et roux | Noir brun et saumon | Blanc pêche et roux profond |
| Novembre | Brume et sous-bois | Taupe brumeux et vert mousse | Gris sous-bois et vert mousse | Noir chaud et vert mousse | Crème et mousse sombre |
| Décembre | Nuit polaire | Lavande glacée et sarcelle d'aurore | Bleu nuit et cyan d'aurore | Noir bleuté et cyan d'aurore | Blanc lavande et sarcelle foncé |

## Nouveau style, et comment revenir en arrière

La version 0.13.0 redessine tous les thèmes : chaque mois a désormais sa propre ambiance de saison, et chaque mois reçoit un thème à contraste élevé clair (High Contrast Light). Votre thème, vos réglages et vos raccourcis clavier sont conservés : les noms des thèmes et les commandes n'ont pas changé, seules les couleurs.

Vous préférez l'ancien style ? Revenez à la version 0.12.0 :

1. Ouvrez la vue Extensions (`Ctrl+Shift+X`, ou `Cmd+Shift+X` sur Mac) et trouvez **365 Day & Night Themes**.
2. Cliquez dessus pour ouvrir sa page, cliquez sur la flèche à côté de **Uninstall** (désinstaller), choisissez **Install Specific Version...** (installer une version précise), puis **0.12.0**.
3. Rechargez VS Code s'il vous le demande.

VS Code décoche alors **Auto Update** (mise à jour automatique) pour cette extension, qui reste en 0.12.0. Pour retrouver le nouveau style, cochez de nouveau **Auto Update**, ou choisissez la dernière version dans le même menu. La version 0.12.0 n'a pas de thème à contraste élevé clair : si vous en utilisez un, choisissez un autre thème après le retour en arrière.

## Bascule automatique jour / nuit

Vous voulez que votre éditeur suive l'heure ? Activez le mode automatique :

1. Ouvrez les paramètres (`Ctrl+,` ou `Cmd+,`) et cherchez **365DayNight**.
2. Cochez **365DayNight: Enable**.

Ou ajoutez ceci à votre `settings.json` :

```json
{
  "365DayNight.enable": true,
  "365DayNight.mode": "auto"
}
```

| Mode | Effet |
| --- | --- |
| `auto` | Thème clair de 7 h à 19 h par défaut, thème sombre le reste du temps. Ces heures se changent (voir plus bas) |
| `day` | Toujours le thème clair du mois en cours |
| `night` | Toujours le thème sombre du mois en cours |
| `system` | Suit l'apparence claire, sombre et à contraste élevé de votre système (voir ci-dessous) |

L'extension passe aussi au thème du mois suivant le premier jour de chaque mois.

Bon à savoir :

- **C'est vous qui décidez.** Le mode automatique est désactivé par défaut : l'extension ne change jamais votre thème sans votre accord. La première fois que vous utilisez un thème 365, une notification vous demande une seule fois si vous le voulez.
- **Votre choix est respecté.** Si vous choisissez un thème à la main, il reste en place jusqu'au prochain changement de période (passage jour/nuit ou nouveau mois).
- **Votre mois reste aussi.** Si vous choisissez un autre mois, avec les flèches ou le sélecteur de thèmes, le mode automatique continue d'alterner clair et sombre sur ce mois jusqu'au début du prochain mois réel, même après un redémarrage. Pour revenir plus tôt, lancez `365: Back to the current month`.
- **Le contraste élevé reste en contraste élevé.** Si vous utilisez un thème à contraste élevé, sombre ou clair, le mode automatique met seulement à jour le mois, jamais la variante.

### Choisir vos heures

Par défaut, le thème clair commence à 7 h et le thème sombre à 19 h. Pour changer ces heures :

1. Ouvrez les paramètres (`Ctrl+,` ou `Cmd+,`) et cherchez **365DayNight**.
2. Réglez **365DayNight: Day Start** et **365DayNight: Night Start**, au format HH:MM sur 24 heures.

Ou ajoutez ceci à votre `settings.json` :

```json
{
  "365DayNight.dayStart": "08:30",
  "365DayNight.nightStart": "20:00"
}
```

- **Appliqué rapidement.** Une nouvelle heure s'applique environ 2 secondes après la fin de la saisie, même si vous aviez choisi un thème à la main. Ensuite, le thème change à la minute choisie.
- **Après minuit.** Si le jour commence après la nuit, par exemple `"20:00"` et `"06:00"`, le thème clair passe minuit. Pratique si vous travaillez la nuit.
- **Valeurs invalides.** Une heure illisible, comme `"25:00"` ou `"7h"`, est remplacée par sa valeur par défaut, et un avertissement vous le signale une fois. Deux heures identiques donnent 7 h et 19 h.
- **Seulement en mode `auto`.** Les modes `day`, `night` et `system` ignorent ces heures.
- **Revenir à 7 h et 19 h.** Dans les paramètres, cliquez sur l'engrenage à côté de chaque heure et choisissez **Reset Setting**, ou retirez les deux lignes de votre `settings.json`.

### Suivre votre système

Vous préférez suivre l'apparence de votre système plutôt que l'heure ? Utilisez le mode `system` :

1. Ouvrez les paramètres (`Ctrl+,` ou `Cmd+,`) et cherchez **365DayNight**.
2. Cochez **365DayNight: Enable**.
3. Réglez **365DayNight: Mode** sur `system`.

Ou ajoutez ceci à votre `settings.json` :

```json
{
  "365DayNight.enable": true,
  "365DayNight.mode": "system"
}
```

| Votre système utilise | Thème appliqué |
| --- | --- |
| L'apparence claire | Thème clair du mois |
| L'apparence sombre | Thème sombre du mois |
| Le contraste élevé, avec une apparence sombre | Thème à contraste élevé du mois |
| Le contraste élevé, avec une apparence claire | Le thème à contraste élevé clair du mois |

Le bouton dans ce mode :
- **Flèches.** `‹` et `›` changent le mois de toutes les variantes. Ce mois reste jusqu'au début du prochain mois réel, même après un redémarrage. Pour revenir plus tôt, lancez `365: Back to the current month`.
- **Bouton central.** Votre système décide entre clair et sombre : un clic se contente donc de l'expliquer. Les commandes `365: Apply Light theme`, `365: Apply Dark theme`, `365: Apply High Contrast theme` et `365: Apply High Contrast Light theme` disent la même chose et ne changent rien.
- **Sélecteur de thèmes.** Choisir un thème 365 applique son mois à toutes les variantes. Choisir le thème d'un autre éditeur remplace seulement la variante en cours : il reste les mois suivants, et le bouton n'affiche alors ni flèches ni mois. Cliquez sur le bouton central pour retrouver le thème 365.


- **Ce que le mode change.** Il active `window.autoDetectColorScheme` et écrit les thèmes du mois dans `workbench.preferredLightColorTheme`, `workbench.preferredDarkColorTheme`, `workbench.preferredHighContrastColorTheme` et `workbench.preferredHighContrastLightColorTheme`. `workbench.colorTheme` ne change pas.
- **Pour revenir en arrière.** Décochez **365DayNight: Enable** ou choisissez un autre mode. Vos réglages d'origine reviennent, et ceux qui n'existaient pas sont de nouveau retirés. Un réglage que vous avez changé entre-temps garde votre valeur.
- **Avant de désinstaller ou de désactiver l'extension.** Quittez d'abord ce mode, car une extension ne peut plus rien restaurer ensuite. En cas d'oubli, retirez les cinq réglages ci-dessus de votre `settings.json`.
- **Contraste élevé.** VS Code donne la priorité au contraste élevé de votre système. Pour l'ignorer, désactivez `window.autoDetectHighContrast` : le mode ne change jamais ce réglage.
- **Désactiver la détection.** Si vous désactivez vous-même `window.autoDetectColorScheme`, l'extension le laisse désactivé et le bouton fonctionne comme d'habitude. Un réglage de thème dans un workspace garde la priorité dans ce workspace.
- **Systèmes d'exploitation.** D'après la documentation de VS Code, l'apparence claire ou sombre est détectée sous Windows et macOS.

## L'accessibilité avant tout

Chaque thème passe un audit d'accessibilité automatisé de plus de 250 contrôles :

- **Texte lisible :** le texte de l'éditeur et les couleurs de syntaxe atteignent un contraste d'au moins **4,5:1 (WCAG AA)** dans les thèmes clairs et sombres, et **7:1 (WCAG AAA)** dans les thèmes à contraste élevé.
- **Adapté aux daltoniens :** les couleurs de syntaxe (mots-clés, fonctions, chaînes, nombres, classes, commentaires) et les alertes (erreurs, avertissements, modifications Git) sont simulées en **protanopie, deutéranopie et tritanopie** pour vérifier qu'elles restent distinctes.
- **Pas seulement la couleur :** commentaires, paramètres et attributs sont en *italique*, le code obsolète est ~~barré~~ et le code invalide souligné.
- **Une sélection visible partout :** la sélection de texte se voit clairement dans l'éditeur, le terminal et la console de débogage, sans jamais se confondre avec les résultats de recherche.
- **Thèmes à contraste élevé :** le texte sélectionné passe en noir sur bleu clair (en blanc sur bleu foncé dans le contraste élevé clair), et tous les panneaux ont des bordures visibles et un contour de focus clavier très marqué.
- **Lecteurs d'écran :** chaque partie du bouton de la barre d'état a son propre libellé vocal, par exemple « Next month: November ».

Une couleur difficile à lire ? [Ouvrez un ticket](https://github.com/mickaellherminez/365-daynight-vscode-theme-ext/issues) : les retours sur l'accessibilité sont toujours les bienvenus.

## Commandes

Ouvrez la palette de commandes (`Ctrl+Shift+P` ou `Cmd+Shift+P`) et tapez **365** :

| Commande | Action |
| --- | --- |
| `365: Toggle between Light and Dark themes` | Passe de clair à sombre, et inversement (comme le bouton de la barre d'état) |
| `365: Apply Light theme` | Applique le thème clair du mois affiché |
| `365: Apply Dark theme` | Applique le thème sombre du mois affiché |
| `365: Apply High Contrast theme` | Applique le thème à contraste élevé du mois affiché |
| `365: Apply High Contrast Light theme` | Applique le thème à contraste élevé clair du mois affiché |
| `365: Next month` | Applique le thème du mois suivant, dans la même variante |
| `365: Previous month` | Applique le thème du mois précédent, dans la même variante |
| `365: Back to the current month` | Applique le thème du mois réel, dans la même variante |

L'extension ne définit aucun raccourci clavier par défaut. Pour attribuer les vôtres, ouvrez la liste des raccourcis (`Ctrl+K Ctrl+S`, ou `Cmd+K Cmd+S` sur Mac), tapez **365**, double-cliquez sur une commande, puis appuyez sur vos touches.

## Paramètres

| Paramètre | Valeur par défaut | Description |
| --- | --- | --- |
| `365DayNight.enable` | `false` | Applique automatiquement le thème du mois en cours |
| `365DayNight.mode` | `auto` | `auto` (selon l'heure), `day` (toujours clair), `night` (toujours sombre) ou `system` (suit votre système) |
| `365DayNight.dayStart` | `"07:00"` | Heure de début du thème clair en mode `auto`, au format HH:MM |
| `365DayNight.nightStart` | `"19:00"` | Heure de début du thème sombre en mode `auto`, au format HH:MM |
| `365DayNight.toggleIncludesHighContrast` | `false` | Le bouton de la barre d'état passe par toutes les variantes : clair, sombre, contraste élevé, puis contraste élevé clair |

## Questions fréquentes

**Comment faire passer VS Code automatiquement d'un thème clair à un thème sombre ?**
Installez l'extension et réglez `"365DayNight.enable": true`. Le thème clair s'applique de 7 h à 19 h, le thème sombre la nuit. Vous pouvez changer ces heures avec `365DayNight.dayStart` et `365DayNight.nightStart`.

**VS Code peut-il suivre le mode clair ou sombre de mon système avec ces thèmes ?**
Oui. Réglez `"365DayNight.enable": true` et `"365DayNight.mode": "system"`. Votre système décide entre clair et sombre, et l'extension garde les thèmes sur le mois en cours.

**Existe-t-il un thème VS Code adapté aux daltoniens ?**
Oui. Tous les thèmes sont testés avec des simulations de protanopie, deutéranopie et tritanopie. Ils utilisent aussi l'italique, le soulignement et le barré pour que l'information ne repose jamais sur la couleur seule.

**L'extension va-t-elle changer mon thème sans me demander ?**
Non. Le mode automatique est désactivé par défaut. Sans lui, le thème ne change que lorsque vous en choisissez un ou cliquez sur le bouton de la barre d'état. La première fois que vous utilisez un thème 365, une notification le propose, et rien ne change sans votre choix.

**Puis-je utiliser un seul thème, par exemple October Dark ?**
Bien sûr. Choisissez-le dans le sélecteur de thèmes (`Ctrl+K Ctrl+T`) et laissez le mode automatique désactivé.

**À quoi servent les thèmes à contraste élevé ?**
Ils sont pensés pour la basse vision, les environnements très lumineux ou les longues sessions de code. Ils offrent un contraste maximal (AAA), des bordures visibles et un contour de focus très marqué. Chaque mois en a deux : une version sombre, et une version claire, High Contrast Light, pour les environnements lumineux.

**Comment essayer une nouvelle version avant tout le monde ?**
Quand une préversion existe, ouvrez la page de l'extension dans la vue Extensions et cliquez sur **Switch to Pre-Release Version** (passer à la préversion). VS Code installe alors la préversion et ses mises à jour. Pour revenir à la version normale, cliquez sur **Switch to Release Version** sur la même page. Vos retours sur une préversion sont les bienvenus dans les [tickets GitHub](https://github.com/mickaellherminez/365-daynight-vscode-theme-ext/issues).

## Feuille de route

Idées et suggestions sont les bienvenues dans les [tickets GitHub](https://github.com/mickaellherminez/365-daynight-vscode-theme-ext/issues).

## Avis et contributions

- ⭐ Les thèmes vous plaisent ? Un [avis sur le Marketplace](https://marketplace.visualstudio.com/items?itemName=mickaellherminez.365-daynight-vscode-theme-ext&ssr=false#review-details) aide d'autres développeurs à les découvrir.
- 🐞 Un bug, une couleur illisible ou une idée : [ouvrez un ticket](https://github.com/mickaellherminez/365-daynight-vscode-theme-ext/issues).
- 🛠️ Envie de contribuer ? Consultez [CONTRIBUTING.md](../CONTRIBUTING.md) (en anglais).

Les notes de version sont dans le [CHANGELOG](../CHANGELOG.md).

## Licence

[MIT](../LICENSE) © Mickaël Lherminez
