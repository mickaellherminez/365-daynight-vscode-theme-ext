# 365 Day & Night Themes – Thèmes VS Code accessibles pour chaque mois

**36 thèmes de couleurs pour Visual Studio Code : un thème clair, un thème sombre et un thème à contraste élevé pour chaque mois de l'année.** Passez du jour à la nuit en un clic, ou laissez l'extension le faire pour vous. Chaque thème est testé pour la lisibilité (contraste WCAG) et pour le daltonisme.

[![Version sur le Marketplace](https://img.shields.io/visual-studio-marketplace/v/mickaellherminez.365-daynight-vscode-theme-ext?label=Marketplace)](https://marketplace.visualstudio.com/items?itemName=mickaellherminez.365-daynight-vscode-theme-ext)
[![Installations](https://img.shields.io/visual-studio-marketplace/i/mickaellherminez.365-daynight-vscode-theme-ext)](https://marketplace.visualstudio.com/items?itemName=mickaellherminez.365-daynight-vscode-theme-ext)
[![Licence MIT](https://img.shields.io/github/license/mickaellherminez/365-daynight-vscode-theme-ext)](../LICENSE)

*Lire cette page en : [English](../README.md) · [Español](README_es.md) · [Deutsch](README_de.md) · [Português](README_pt.md) · [Русский](README_ru.md) · [中文](README_zh.md) · [日本語](README_ja.md) · [हिंदी](README_hi.md) · [العربية](README_ar.md)*

![Thèmes d'octobre clair, sombre et contraste élevé dans VS Code : explorateur, onglets, coloration syntaxique, sélection de texte et barre d'état](https://raw.githubusercontent.com/mickaellherminez/365-daynight-vscode-theme-ext/main/assets/screenshots/hero.png)

## Pourquoi vous allez l'aimer

- 🗓️ **Un nouveau style chaque mois.** Neige et bleu d'hiver en janvier, vert printanier en mars, plein soleil en juillet, couleurs d'automne en octobre, ambiance coin du feu en décembre : votre éditeur suit les saisons.
- ☀️🌙 **Jour et nuit, toujours assortis.** Chaque mois propose un thème clair pour la journée, un thème sombre pour le soir et un thème à contraste élevé quand vous avez besoin d'une lisibilité maximale.
- 🔁 **Bascule en un clic.** Un bouton dans la barre d'état passe du thème clair au sombre puis au contraste élevé.
- ⏰ **Mode automatique (optionnel).** L'extension peut appliquer seule le thème du mois en cours : clair le jour, sombre la nuit.
- 👁️ **Reposant pour les yeux, lisible par tous.** Tout le texte respecte les niveaux de contraste WCAG, et les couleurs de syntaxe restent distinctes pour les personnes daltoniennes.
- 🖥️ **Des thèmes complets.** Éditeur, barre latérale, onglets, terminal, console de débogage, notifications et barre d'état : tout est stylé, rien ne retombe sur les couleurs par défaut.

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
2. Tapez **365** pour afficher les 36 thèmes, par exemple `365 10-October Dark`.
3. Choisissez-en un. C'est tout !

Le **bouton de la barre d'état** (en bas à droite : `LGT`, `DRK` ou `HCT`) permet de passer d'une version à l'autre du mois en cours : clair, sombre, contraste élevé.

## Les 12 mois

![Aperçu des 36 thèmes : une version claire, sombre et à contraste élevé pour chaque mois, de janvier à décembre](https://raw.githubusercontent.com/mickaellherminez/365-daynight-vscode-theme-ext/main/assets/screenshots/year.png)

| Mois | Clair | Sombre | Contraste élevé |
| --- | --- | --- | --- |
| Janvier | Blanc neige et bleu d'hiver | Nuit bleu marine éclairée d'or | Noir et bleu vif |
| Février | Blanc et vert, touche de rouge Saint-Valentin | Ardoise nordique et givre | Bleu marine et or |
| Mars | Crème et vert printemps | Nuit indigo | Sarcelle sombre et orange-rouge |
| Avril | Crème et orange de Pâques | Ardoise bleutée et or | Bleu profond et or |
| Mai | Blanc lumineux et orange | Nuit océane relevée d'orange | Bleu marine et bleu ciel |
| Juin | Bleu ciel et encre indigo | Nuit bleue éclairée d'orange | Noir et corail |
| Juillet | Plein soleil : crème, brun et orange | Nuit d'été inspirée de Solarized | Bleu marine, orange et or |
| Août | Crème chaud et encre indigo | Nuit d'ardoise étoilée de jaune | Noir et vert néon |
| Septembre | Ciel de rentrée et encre marine | Ardoise et sarcelle | Noir et orange vif |
| Octobre | Crème d'automne, orange brûlé et ambre | Brun profond et braise | Noir chaud et ambre |
| Novembre | Brume, ardoise et bleu acier | Ardoise profonde, orange et or | Noir et or |
| Décembre | Givre et bleu sarcelle | Coin du feu : ardoise et braise | Nuit d'hiver et cyan givré |

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
| `auto` | Thème clair de 7 h à 19 h, thème sombre le reste du temps |
| `day` | Toujours le thème clair du mois en cours |
| `night` | Toujours le thème sombre du mois en cours |

L'extension passe aussi au thème du mois suivant le premier jour de chaque mois.

Bon à savoir :

- **C'est vous qui décidez.** Le mode automatique est désactivé par défaut : l'extension ne change jamais votre thème sans votre accord.
- **Votre choix est respecté.** Si vous choisissez un thème à la main, il reste en place jusqu'au prochain changement de période (passage jour/nuit ou nouveau mois).
- **Le contraste élevé reste en contraste élevé.** Si vous utilisez un thème à contraste élevé, le mode automatique met seulement à jour le mois, jamais le niveau de contraste.

## L'accessibilité avant tout

Chaque thème passe un audit d'accessibilité automatisé de plus de 130 contrôles :

- **Texte lisible :** le texte de l'éditeur et les couleurs de syntaxe atteignent un contraste d'au moins **4,5:1 (WCAG AA)** dans les thèmes clairs et sombres, et **7:1 (WCAG AAA)** dans les thèmes à contraste élevé.
- **Adapté aux daltoniens :** les couleurs de syntaxe (mots-clés, fonctions, chaînes, nombres, classes, commentaires) et les alertes (erreurs, avertissements, modifications Git) sont simulées en **protanopie, deutéranopie et tritanopie** pour vérifier qu'elles restent distinctes.
- **Pas seulement la couleur :** commentaires, paramètres et attributs sont en *italique*, le code obsolète est ~~barré~~ et le code invalide souligné.
- **Une sélection visible partout :** la sélection de texte se voit clairement dans l'éditeur, le terminal et la console de débogage, sans jamais se confondre avec les résultats de recherche.
- **Thèmes à contraste élevé :** le texte sélectionné passe en noir sur bleu clair, et tous les panneaux ont des bordures visibles et un contour de focus clavier très marqué.

Une couleur difficile à lire ? [Ouvrez un ticket](https://github.com/mickaellherminez/365-daynight-vscode-theme-ext/issues) : les retours sur l'accessibilité sont toujours les bienvenus.

## Commandes

Ouvrez la palette de commandes (`Ctrl+Shift+P` ou `Cmd+Shift+P`) et tapez **365** :

| Commande | Action |
| --- | --- |
| `365: Toggle between Light, Dark and High Contrast themes` | Passe de clair à sombre puis à contraste élevé (comme le bouton de la barre d'état) |
| `365: Apply Light theme` | Applique le thème clair du mois en cours |
| `365: Apply Dark theme` | Applique le thème sombre du mois en cours |
| `365: Apply High Contrast theme` | Applique le thème à contraste élevé du mois en cours |

Ces commandes sont aussi disponibles dans le menu **365 Themes**, par un clic droit dans l'éditeur. Vous pouvez leur attribuer vos propres raccourcis clavier (`Ctrl+K Ctrl+S`).

## Paramètres

| Paramètre | Valeur par défaut | Description |
| --- | --- | --- |
| `365DayNight.enable` | `false` | Applique automatiquement le thème du mois en cours |
| `365DayNight.mode` | `auto` | `auto` (selon l'heure), `day` (toujours clair) ou `night` (toujours sombre) |

## Questions fréquentes

**Comment faire passer VS Code automatiquement d'un thème clair à un thème sombre ?**
Installez l'extension et réglez `"365DayNight.enable": true`. Le thème clair s'applique de 7 h à 19 h, le thème sombre la nuit.

**Existe-t-il un thème VS Code adapté aux daltoniens ?**
Oui. Les 36 thèmes sont testés avec des simulations de protanopie, deutéranopie et tritanopie. Ils utilisent aussi l'italique, le soulignement et le barré pour que l'information ne repose jamais sur la couleur seule.

**L'extension va-t-elle changer mon thème sans me demander ?**
Non. Le mode automatique est désactivé par défaut. Sans lui, le thème ne change que lorsque vous en choisissez un ou cliquez sur le bouton de la barre d'état.

**Puis-je utiliser un seul thème, par exemple October Dark ?**
Bien sûr. Choisissez-le dans le sélecteur de thèmes (`Ctrl+K Ctrl+T`) et laissez le mode automatique désactivé.

**À quoi servent les thèmes à contraste élevé ?**
Ils sont pensés pour la basse vision, les environnements très lumineux ou les longues sessions de code. Ils offrent un contraste maximal (AAA), des bordures visibles et un contour de focus très marqué.

**Les thèmes de fêtes sont-ils disponibles ?**
Pas encore. Des thèmes pour le Nouvel An, Pâques, Halloween et Noël sont prévus. Suivez le [projet sur GitHub](https://github.com/mickaellherminez/365-daynight-vscode-theme-ext) pour être prévenu.

## Feuille de route

- 🎉 Thèmes de fêtes (Nouvel An, Pâques, Halloween, Noël)
- ⏰ Heures de jour et de nuit configurables

Idées et suggestions sont les bienvenues dans les [tickets GitHub](https://github.com/mickaellherminez/365-daynight-vscode-theme-ext/issues).

## Avis et contributions

- ⭐ Les thèmes vous plaisent ? Un [avis sur le Marketplace](https://marketplace.visualstudio.com/items?itemName=mickaellherminez.365-daynight-vscode-theme-ext&ssr=false#review-details) aide d'autres développeurs à les découvrir.
- 🐞 Un bug, une couleur illisible ou une idée : [ouvrez un ticket](https://github.com/mickaellherminez/365-daynight-vscode-theme-ext/issues).
- 🛠️ Envie de contribuer ? Consultez [CONTRIBUTING.md](../CONTRIBUTING.md) (en anglais).

Les notes de version sont dans le [CHANGELOG](../CHANGELOG.md).

## Licence

[MIT](../LICENSE) © Mickaël Lherminez
