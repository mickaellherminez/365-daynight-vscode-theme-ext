# README pour l'extension "365-daynight-vscode-theme-ext"

![365DayNight VSCode Themes](https://github.com/mickaellherminez/365-daynight-vscode-theme-ext/blob/main/assets/logo-web.png?raw=true)

![GitHub release (latest by date)](https://img.shields.io/github/v/release/mickaellherminez/365-daynight-vscode-theme-ext)
![Visual Studio Marketplace Downloads](https://img.shields.io/visual-studio-marketplace/d/mickaellherminez.365-daynight-vscode-theme-ext)

*Lire ce document dans d'autres langues : [English](../README.md), [中文](README_zh.md), [हिंदी](README_hi.md), [Deutsch](README_de.md), [Русский](README_ru.md), [Português](README_pt.md), [日本語](README_ja.md), [Español](README_es.md), [العربية](README_ar.md).*

## Introduction

Bienvenue sur la page README de l'extension "365-daynight-vscode-theme-ext" pour VSCode.

## Aperçu

365DayNight VSCode Themes est une extension conçue pour améliorer votre expérience de codage tout au long de l'année avec des thèmes dynamiques et visuellement attrayants. Elle est conçue pour minimiser la fatigue oculaire et optimiser la lisibilité en adaptant votre thème VSCode selon la lumière naturelle ou artificielle, offrant ainsi une expérience de codage ininterrompue 24/7.

## Caractéristiques

- **Collection de thèmes mensuels** : Douze séries mensuelles de trois thèmes (Light, Dark et High Contrast), nommés `365 01-January Light`, `365 01-January Dark`, `365 01-January High Contrast`, etc.
- **Thèmes Jour et Nuit** : Un thème clair adapté à la lumière naturelle pendant la journée et un thème sombre pour la lumière artificielle la nuit.
- **Changement Automatique de Thème** : Une fois activé, applique le thème du mois en cours et bascule entre clair (7h–19h) et sombre selon le moment de la journée.
- **Bascule rapide** : Un bouton dans la barre d'état permet de passer d'un clic entre les thèmes clair, sombre et à contraste élevé.
- **Accessibilité** : Fonctionnalités d'accessibilité améliorées, notamment pour les utilisateurs daltoniens.
- **Thèmes Spéciaux pour les Fêtes** *(bientôt disponible)* : Thèmes uniques pour les périodes festives comme le Nouvel An, Pâques, Halloween et Noël.

## Paramètres de l'Extension

- `365DayNight.enable` : Activer ou désactiver le changement automatique de thème (par défaut : `false`).
- `365DayNight.mode` : Définir le mode à `day` (jour), `night` (nuit) ou `auto` pour un changement automatique selon l'heure (par défaut : `auto`).

Quand le changement automatique est activé, un thème choisi manuellement est conservé jusqu'au prochain changement de période (jour/nuit ou mois). Un thème à contraste élevé n'est jamais remplacé par un thème clair ou sombre : seul son mois est mis à jour.

## Commandes

- `365: Toggle between Light, Dark and High Contrast themes` (aussi accessible via le bouton de la barre d'état)
- `365: Apply Light theme`
- `365: Apply Dark theme`
- `365: Apply High Contrast theme`

## Accessibilité

Nous accordons une grande importance à l'accessibilité et avons optimisé l'extension pour être plus inclusive, notamment pour les personnes atteintes de daltonisme. Si vous avez des suggestions ou des idées pour améliorer l'accessibilité, n'hésitez pas à nous en faire part.

## Installation

Pour installer l'extension, visitez le [Visual Studio Marketplace](https://marketplace.visualstudio.com/items?itemName=mickaellherminez.365-daynight-vscode-theme-ext) et cliquez sur "Install".

## Notes de Version

Pour des informations détaillées sur chaque version, veuillez consulter le [CHANGELOG](../CHANGELOG.md).

## Packaging

Utilisez la commande `npm run package` (ou `vsce package`) pour créer le fichier `.vsix`. Voir [Publishing Extensions](https://code.visualstudio.com/api/working-with-extensions/publishing-extension) pour plus de détails.

## Conclusion

Profitez de la flexibilité et de la dynamique de l'extension 365DayNight pour une expérience de codage enrichissante !

**Amusez-vous bien avec l'extension 365DayNight VSCode Themes!**
