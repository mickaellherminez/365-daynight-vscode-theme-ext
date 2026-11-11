# Site 365 Day & Night

La page reprend la direction artistique « Accueil v2 — tablette 820 » : Inter pour le texte, JetBrains Mono pour les titres et les chiffres, logo interactif, boutons pilules, sections numérotées et filets. La mise en page s'adapte aux mobiles, tablettes et ordinateurs.

Depuis la racine du dépôt :

```sh
npm run site:build
npm run site:preview
```

Ouvrir http://127.0.0.1:4173. Le build utilise Node.js ; le serveur d'aperçu utilise Python 3. Le dossier généré `site-dist/` est ignoré par Git et peut être hébergé comme site statique. Ne pas ouvrir directement `site/index.html` : c'est un gabarit dont le build remplace les données.

Les couleurs sont lues directement depuis les 48 fichiers JSON publiés dans `themes/` : `editor.background` et `editor.foreground` pour la page, `button.background` et `button.foreground` pour les boutons, `textLink.foreground` pour les liens, et les rôles réels des barres de titre, onglets, numéros de ligne et barres d’état pour les aperçus. Les couleurs de syntaxe et leurs styles sont résolus depuis les règles TextMate et les jetons sémantiques de ces mêmes fichiers. Le build refuse un rapport dont les couleurs ou les contrastes de syntaxe ne correspondent plus aux thèmes. Les capsules du sélecteur et la frise utilisent les couleurs mensuelles exactes, sans interpolation. Les fichiers du logo de marque conservent leur identité visuelle. Les chiffres et mesures viennent de `docs/audit-report.json`, et non des valeurs figées de la maquette. Le mois courant et l'apparence du système déterminent la sélection initiale ; les choix manuels sont ensuite conservés pendant la visite. Les sélecteurs, le comparateur et le dialogue sont utilisables au clavier. Dans le logo, le focus clavier est un anneau qui suit la forme du mois ou du thème ; il n’apparaît pas après un clic ou un toucher. Les variantes High Contrast épaississent les bords avec des ombres, jamais avec des bordures, pour que la mise en page ne bouge pas quand on change de variante. L’en-tête tient sur une ligne : sur ordinateur, « Audit report » et « GitHub » ont chacun une icône et leur texte, et la puce du thème affiche le mois court et la variante (« Nov · High Contrast Light ») ; sous 720 px, il ne reste que les icônes et une pastille ronde du thème, de 44 px chacune, dont les noms complets restent lus par les lecteurs d’écran. La pastille, comme le logo, ouvre le choix du mois et du thème. Les icônes prennent la couleur d’accent du thème (au moins 4,5:1 sur le fond dans les 48 palettes). Sous 720 px, une infobulle nomme chaque icône au survol de la souris et au focus clavier, jamais au toucher ; celle de la pastille donne le mois et la variante en entier, et Échap les masque. Elles ont des coins arrondis et apparaissent en fondu avec un léger glissement (160 ms, 100 ms pour disparaître), sans animation si le système demande de réduire les animations ; un pont invisible sur l’espace de 6 px laisse passer la souris de l’icône à l’infobulle sans la fermer. Trois autres animations accompagnent les changements, toutes coupées quand le système demande de réduire les animations : un changement de mois ou de variante fond toute la page vers la nouvelle palette (View Transitions, 280 ms ; un navigateur qui ne la gère pas change la palette d’un coup, et un nouveau choix rapide interrompt le fondu en cours) ; le dialogue du choix du thème apparaît en fondu en remontant légèrement et disparaît en fondu (200 ms, ouverture immédiate sans `@starting-style`) ; les barres de contraste et de score glissent vers leur nouvelle longueur (350 ms). Aucune animation ne tourne en boucle ni ne se déclenche au défilement. L’en-tête reste fixe en haut de l’écran, avec un trait une fois la page défilée, pour voir un changement de thème là où l’on lit ; les ancres et le focus clavier s’arrêtent sous lui. Sur un écran de moins de 500 px de haut (téléphone à l’horizontale, zoom fort), il défile avec la page. Pour la même raison que les ombres, la puce de l’en-tête garde la largeur de son libellé le plus long, la phrase du comparateur la hauteur de sa version la plus longue, et le résumé sous le logo s’empile toujours sur téléphone. Seule la section des mesures change de hauteur, parce que son contenu dépend de la variante (pas de grille 0.12.0 pour High Contrast Light). La frise calcule le repère du jour et tient compte des années bissextiles.

La vidéo réelle de VS Code est conservée avec ses contrôles et sa légende. Son poster est inclus dans les sources pour que le build et les tests ne nécessitent pas FFmpeg. Si la vidéo est remplacée, régénérer le poster avec :

```sh
ffmpeg -y -i site/media/demo-months.mp4 -frames:v 1 -vf scale=1200:-1 -q:v 4 site/media/demo-poster.jpg
```

Les ressources nécessaires à la page sont copiées dans `media/brand/` et les polices exactes sont hébergées dans `media/fonts/`, avec leur licence SIL OFL. Aucun chargement depuis Google Fonts, un CDN ou les références locales n'est nécessaire. Le HTML de référence et le pack complet `365-day-night-brand/` restent ignorés par Git et exclus du paquet VS Code. Les seules ressources de marque utilisées par le site sont conservées dans les sources du site.

Vérification : `npm run test:unit` couvre les données, contrastes, ressources locales et l'autonomie du build. Les modules du navigateur sont des modules ES natifs, sans dépendance d'exécution.

Les graphiques du lot C sont intégrés sous les chiffres d’audit :

- Contraste des 14 rôles de syntaxe : couleur hexadécimale exacte, barre et ratio sur le fond réel de l’éditeur, repères AA à 4,5:1 et AAA à 7:1. Le tableau constitue à la fois le graphique et ses données accessibles.
- Matrices 12 × 12 avant/après : choix du fond ou de la syntaxe, quatre variantes, valeurs ΔE CIE76 du rapport, échelle commune et lecteur de paire utilisable au clavier. Les couleurs d’encodage viennent aussi de la palette réelle. La diagonale compare un mois avec lui-même ; chaque grille comprend 66 paires uniques. L’absence de High Contrast Light dans la référence 0.12.0 est indiquée au lieu de créer de fausses données.

La sélection du mois et de la variante synchronise la page, les aperçus et les deux graphiques. Les valeurs du rapport sont arrondies à deux décimales pour le contraste et une pour les matrices ; les moyennes affichées dans les grilles sont calculées sur ces valeurs exportées. Les seuils de variété sont des règles du projet, distinctes des seuils WCAG.

Les scores par situation de vision et les aperçus simulés appartiennent au lot D et restent à intégrer. Les contrôles de navigateur ont couvert les 48 combinaisons, les couleurs réellement affichées, les valeurs des graphiques, le clavier et les largeurs de 320 à 1440 px.

## Sécurité et mise en ligne

- Aucun script en ligne : la palette initiale est appliquée par `boot.js`, ce qui permet une CSP stricte (`script-src 'self'`).
- `.htaccess` impose HTTPS et les en-têtes de sécurité. `npm run site:check` teste la page sous la même CSP, avec axe-core.
- Ce README n'est pas copié dans `site-dist/`.
- Mise en ligne : workflow `.github/workflows/site.yml`, environnement GitHub `site` avec validation obligatoire, compte FTPS limité au dossier de la page. Voir `CONTRIBUTING.md`.
