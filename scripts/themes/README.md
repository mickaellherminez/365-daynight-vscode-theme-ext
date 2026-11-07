# Outils de génération et d'audit des thèmes

Ces scripts Python (3.8+, sans dépendance) génèrent les variantes Light, Dark, High Contrast et High Contrast
Light d'un mois à partir d'une palette, et vérifient leur accessibilité : contrastes WCAG
et distinction des couleurs pour les personnes daltoniennes.

| Fichier | Rôle |
|---|---|
| `audit.py` | Audite un ou plusieurs thèmes existants (`npm run themes:audit`) |
| `build.py` | Génère les thèmes d'un mois depuis `palettes/<mois>.json`, puis les audite. Avec `--check`, vérifie que `themes/` correspond aux palettes (`npm run themes:check`) |
| `variety.py` | Mesure la variété entre les mois de chaque déclinaison (`npm run themes:variety`) |
| `draft.py` | Ébauche les 4 palettes d'un mois à partir de son ambiance (`direction.json`) et du modèle `draft-template.json` |
| `direction.json` | Ambiance de chaque mois : fonds et accents de départ, plages de teinte des couleurs de syntaxe |
| `draft-template.json` | Modèle de structure des ébauches : les 4 palettes d'octobre d'avant la refonte, avec l'ajout Git du High Contrast Light retouché pour le seuil de 12 |
| `optimize.py` | Propose des couleurs de syntaxe distinctes pour un fond donné (point de départ d'une palette) |
| `preview.py` | Génère les images d'aperçu des README (`assets/screenshots/`, ou un autre dossier avec `--out`) avec Google Chrome en mode headless : `hero.png` montre les variantes d'un mois dans une fenêtre complète, `year.png` les 12 mois avec, pour chaque variante, le code, une bande de l'accent et la barre d'état avec le bouton de l'extension |
| `colorlib.py` | Calculs de couleur : contraste, composition alpha, simulation du daltonisme et de l'achromatopsie, ΔE CIE76 et CIEDE2000 |
| `tests/` | Tests des outils de mesure contre des données publiées (`npm run themes:test`), et de l'audit et du test de variété |
| `token-rules.json` | Règles de coloration syntaxique communes à tous les mois (scopes → rôle de couleur) |
| `palettes/` | Une palette par mois (`10.json` = octobre) |

## Auditer

```sh
npm run themes:audit                                  # tous les thèmes de package.json
python3 scripts/themes/audit.py themes/365-10-*.json  # thèmes choisis
python3 scripts/themes/audit.py -v themes/365-10-light-theme.json  # détail de chaque contrôle
```

Le script renvoie le code 1 si un contrôle échoue. Il vérifie notamment :

- **Contraste** : texte et jetons de syntaxe ≥ 4.5:1 (AA) ; ≥ 7:1 (AAA) pour les thèmes High Contrast, sombres
  ou clairs (`uiTheme` `hc-black` ou `hc-light`) ; indicateurs (curseur, soulignements, gouttière, focus) ≥ 3:1.
- **Sélection** : visible dans l'éditeur, le terminal et la console de débogage, distincte de la ligne
  courante, et texte sélectionné toujours lisible.
- **Interface** : barre latérale, onglets, barre d'état, boutons, champs, menus, notifications, vue peek, etc.
  La couleur Git d'un fichier (modifié, ajouté, supprimé, non suivi, en conflit) reste visible quand il est
  sélectionné dans l'explorateur (≥ 3:1 sur la sélection).
- **Jetons sémantiques** : chaque couleur de `semanticTokenColors` (fonction, méthode, propriété, paramètre...)
  respecte les mêmes minimums que les jetons de syntaxe, sur le fond et une fois sélectionnée. TypeScript, Python
  et d'autres langages les utilisent à la place des règles TextMate.
- **Surfaces récentes** : chat, chat dans l'éditeur, tests, notebooks, éditeur de fusion, multi-diff, icônes de
  symboles, graphe Git, centre de commande et sessions d'agents. Les couleurs que VS Code fixe sans tenir compte du
  thème (`PRIORITY_KEYS` dans `audit.py`) doivent être définies. Les autres héritent d'une couleur du thème
  (`INHERITED`) : l'audit suit cet héritage et contrôle le contraste obtenu. Les icônes et les lignes du graphe sont
  vérifiées à 3:1, le texte à 4.5:1 (7:1 en High Contrast), et la syntaxe reste lisible sur le fond des cellules de notebook.
- **Bouton de l'extension** : `365DayNight.statusBarButton` est lisible sur la barre d'état (≥ 4.5:1, ≥ 7:1 en High Contrast)
  et se distingue du texte normal de la barre (ΔE ≥ 15). `build.py` la calcule depuis `accent`, en éclaircissant au minimum.
- **Daltonisme** : les jetons principaux (mot-clé, fonction, chaîne, nombre, classe, commentaire, variable)
  et les alertes (erreur, avertissement, ajout, suppression, test réussi ou échoué, lignes du graphe Git) sont simulés en protanopie, deutéranopie et
  tritanopie ([Machado et al., 2009](https://www.inf.ufrgs.br/~oliveira/pubs_files/CVD_Simulation/CVD_Simulation.html)).
  Une différence perçue (ΔE) inférieure à 12 est signalée comme confusion possible et fait échouer l'audit. Le seuil
  était de 10 jusqu'à l'ébauche des 12 mois, qui a montré qu'une marge de 12 était tenable dans les 48 thèmes.
- **Pas seulement la couleur** ([WCAG 2.2, critère 1.4.1](https://www.w3.org/TR/WCAG22/#use-of-color)) : les styles
  qui portent un sens doivent être présents. Commentaires en italique, code invalide souligné, code obsolète barré
  (règle TextMate et jeton sémantique `*.deprecated`), liens soulignés, titres et gras Markdown en gras, italique
  Markdown en italique. La liste est `REQUIRED_STYLES` dans `audit.py`. Un style manquant fait échouer l'audit.

Après les contrôles, le rapport affiche deux mesures **à titre d'information**, qui ne le font jamais échouer :

- **CIEDE2000** (lignes `info ΔE2000`) : les trois paires de jetons principaux les plus proches, pour chaque vision,
  avec la formule CIEDE2000. Elle est plus fidèle à la perception que CIE76, surtout pour les bleus et les couleurs
  peu saturées, mais sur une autre échelle : un ΔE2000 est en général plus petit que le ΔE CIE76 de la même paire.
  Le seuil de 12 reste donc appliqué en CIE76, tant que les seuils n'ont pas été recalibrés pour CIEDE2000.
- **Achromatopsie** (ligne `info achromatopsie`), c'est-à-dire la vision sans couleur : chaque couleur devient le gris
  de même luminance, et seul l'écart de clarté reste. La ligne donne les trois paires de jetons principaux les plus
  proches et le nombre de paires sous 12, sur 21. C'est la mesure qui varie le plus d'un thème à l'autre : deux
  jetons de même clarté ne se distinguent alors que par leur style.

Une clé manquante compte comme un échec : VS Code la remplacerait par sa couleur par défaut, sans rapport avec le thème.
C'est aussi le cas d'un rôle attendu : chacune des 14 catégories de jetons contrôlées (commentaire, mot-clé, fonction,
chaîne, nombre, classe, variable, opérateur, ponctuation, balise, attribut, regex, clé JSON, invalide) et chacun des
14 jetons sémantiques colorés doivent être présents.

## Tester les outils de mesure

```sh
npm run themes:test
```

Les mesures de l'audit et du test de variété ne valent que si les calculs sont justes. Ces tests, lancés aussi par la
CI et avant chaque publication, comparent `colorlib.py` à des valeurs publiées. Les données de référence sont dans
`tests/data/`, avec leur source dans `tests/data/README.md`.

| Ce qui est vérifié | Référence |
|---|---|
| Contraste WCAG : 21:1 pour le noir sur blanc, 4,54:1 pour `#767676` sur blanc (le gris le plus clair qui passe AA), 4,48:1 pour `#777777`, et la luminance des trois primaires | [WCAG 2.2, définitions du ratio de contraste et de la luminance relative](https://www.w3.org/TR/WCAG22/#dfn-contrast-ratio) |
| CIEDE2000 : les 34 paires de test, au dix-millième près, dans les deux sens | Sharma, Wu et Dalal (2005), *Color Research & Application* 30(1), p. 21–30 |
| Simulation du daltonisme : les matrices de `colorlib.py` sont celles publiées pour la sévérité 1,0 ; le tableau complet (sévérités 0,0 à 1,0) laisse le blanc et les gris inchangés ; un rouge-orangé et un vert sur une même ligne de confusion se confondent en protanopie et en deutéranopie, pas en tritanopie | Machado, Oliveira et Fernandes (2009), *IEEE TVCG* 15(6), p. 1291–1298, DOI 10.1109/TVCG.2009.113 |
| Achromatopsie : chaque couleur devient un gris de même clarté, et seul l'écart de clarté reste | Luminance relative de sRGB (coefficients 0,2126, 0,7152, 0,0722) |

Les mêmes tests vérifient aussi l'audit et le test de variété eux-mêmes : un style manquant fait bien échouer
l'audit (`test_audit.py`), et le test de variété réussit ou échoue sur des thèmes fictifs comme prévu, sans jamais
échouer pour un résultat simulé de daltonisme (`test_variety.py`).

## Vérifier que les thèmes correspondent aux palettes

```sh
npm run themes:check
```

Le générateur recalcule tous les thèmes en mémoire et les compare aux fichiers de `themes/`, octet par octet. Un fichier
modifié à la main, une palette changée sans `--write`, un fichier manquant ou un fichier en trop font échouer la
vérification, lancée aussi par la CI et avant chaque publication. Pour corriger, modifier la palette puis relancer
`build.py <mois> --write`.

## Mesurer la variété entre les mois

```sh
npm run themes:variety                    # résumé par déclinaison
python3 scripts/themes/variety.py -v      # liste toutes les paires en échec
```

L'audit vérifie chaque thème seul. Le test de variété compare les mois entre eux : deux mois d'une même
déclinaison (Light, Dark, High Contrast, High Contrast Light) doivent se distinguer à l'œil. Il compare chaque paire
de mois, soit 66 paires pour 12 mois. Une déclinaison qui n'aurait qu'un mois n'a aucune paire : seules ses
familles de teinte sont comptées.

L'écart entre deux couleurs est le ΔE de `colorlib.py` (CIE76) : 0 pour deux couleurs identiques, environ 2 pour un
écart à peine visible, plus de 25 pour deux couleurs nettement différentes.

| Mesure | Couleur comparée | Seuil par paire de mois |
|---|---|---|
| Fond de l'éditeur | `editor.background` | ΔE ≥ 8, ou ≥ 4 en High Contrast et High Contrast Light |
| Cadre | `sideBar.background` (barre latérale) | ΔE ≥ 7, ou ≥ 4 en High Contrast et High Contrast Light |
| Barre d'état | `statusBar.background` | aucun, affichée à titre d'information |
| Accent | `activityBarBadge.background` | ΔE ≥ 25 |
| Syntaxe | mot-clé, fonction, chaîne, nombre, classe, commentaire | moyenne des 6 ΔE, rôle par rôle, ≥ 18 |

Le seuil du fond est plus bas en contraste élevé : ces fonds sont presque noirs ou presque blancs, et leur teinte
ne peut pas beaucoup varier sans perdre du contraste. Le cadre est mesuré pour que toute la fenêtre change d'un mois
à l'autre, pas seulement l'éditeur. Son seuil est de 7 et non 8 : en Dark, le cadre est plus foncé que l'éditeur et
les écarts s'y resserrent.

**Familles de teinte.** Au plus 3 mois d'une même déclinaison peuvent partager une famille, compté séparément pour le
fond de l'éditeur et pour l'accent. Les familles découpent l'angle de teinte CIELAB en 8 secteurs de 45°, nommés
d'après leur centre :

| Famille | Angle de teinte |
|---|---|
| rose | 337,5° à 22,5° |
| rouge-orangé | 22,5° à 67,5° |
| jaune | 67,5° à 112,5° |
| vert | 112,5° à 157,5° |
| vert-bleu | 157,5° à 202,5° |
| cyan | 202,5° à 247,5° |
| bleu | 247,5° à 292,5° |
| violet | 292,5° à 337,5° |

Une couleur presque neutre, de chroma inférieure à 4 (un blanc, un noir ou un gris à peine teinté), forme la famille
`neutre` : sa teinte ne se voit pas. Elle compte aussi pour la limite de 3 mois.

**Lire le rapport.** Pour chaque déclinaison et chaque mesure, le rapport donne le ΔE moyen des paires, le même
avec CIEDE2000 (colonne `ΔE2000`, à titre d'information : les seuils restent ceux de CIE76), le nombre de paires sous
le seuil, puis la paire la plus proche (`01/12 1.0` : janvier et décembre, ΔE de 1,0). En dessous, il
liste les 5 paires les plus proches parmi celles en échec ; `-v` les liste toutes. Les familles affichent leur nombre
de mois puis les mois concernés.

**Daltonisme.** Les mêmes mesures sont recalculées en protanopie, deutéranopie et tritanopie (moyenne et nombre de
paires sous le seuil). Elles sont affichées à titre d'information et ne font jamais échouer le test : la distinction
pour les daltoniens est garantie à l'intérieur de chaque thème par l'audit, pas entre deux mois.

Le script renvoie le code 1 si un seuil ou une famille échoue en vision normale. Avant la refonte, les thèmes se
ressemblaient trop d'un mois à l'autre (325 problèmes) ; les 12 mois redessinés passent toutes les paires. La CI et
la publication lancent la commande, comme l'audit. Les seuils ont été fixés d'après
l'ébauche (constantes en tête de `variety.py`) : le seuil de syntaxe est passé de 10 à 18, les paires les plus
proches de l'ébauche étant à 18,5.

## Ce que l'audit ne vérifie pas

L'audit garantit les contrôles listés ci-dessus, rien de plus. En particulier :

- **Couleurs non définies** : un thème définit environ 485 des quelque 970 couleurs documentées par VS Code. Les autres
  prennent la couleur par défaut de VS Code. Seules celles des surfaces récentes listées ci-dessus sont auditées, en
  suivant l'héritage de VS Code 1.145 : si une version future change une valeur par défaut, l'audit ne le voit pas.
- **Paires contrôlées** : seules les combinaisons texte / fond listées dans `audit.py` sont mesurées. Une couleur
  posée sur un fond non prévu (un badge dans un widget, par exemple) n'est pas vérifiée.
- **Rendu réel** : le contraste est calculé sur les couleurs déclarées. La police, son épaisseur, l'anticrénelage,
  la taille du texte et l'empilement de plusieurs fonds transparents ne sont pas mesurés.
- **Langages** : chaque catégorie de jeton est testée avec un seul scope TextMate représentatif. Une grammaire qui
  utilise d'autres scopes peut afficher d'autres couleurs.
- **Norme** : les ratios sont ceux de WCAG 2.x. Le futur modèle APCA (WCAG 3) n'est pas appliqué.
- **Daltonisme** : la simulation de Machado et al. (2009) porte sur les dichromaties complètes (protanopie,
  deutéranopie, tritanopie). Les formes partielles, plus fréquentes, sont moins sévères mais pas simulées à part.
  Le seuil ΔE de 12 (CIE76) est une règle pratique, pas une norme.
- **CIEDE2000** : il est seulement affiché. Les seuils restent en CIE76, une formule plus simple et moins fidèle,
  tant qu'ils n'ont pas été recalibrés.
- **Achromatopsie** : la simulation utilise la luminance de la vision de jour. Les personnes achromates voient avec
  les bâtonnets, dont la sensibilité rend le bleu un peu plus clair et le rouge plus sombre : c'est une
  approximation, affichée à titre d'information.
- **Styles** : l'audit vérifie qu'un style est déclaré pour un scope représentatif de chaque catégorie, pas qu'une
  police l'affiche. Une police sans italique, par exemple, le remplace par un italique simulé ou l'ignore.
- **Thèmes à contraste élevé clairs** : l'audit leur applique les règles du contraste élevé. L'héritage des
  couleurs non définies qu'il suit a été vérifié pour ce type de thème dans VS Code 1.145, comme pour les autres.
- **Personnes réelles** : aucun calcul ne remplace des essais avec des personnes concernées.

## Générer les thèmes d'un mois

```sh
python3 scripts/themes/build.py 10           # aperçu de l'audit, aucun fichier modifié
python3 scripts/themes/build.py 10 --write   # écrit themes/365-10-{light,dark,hc-dark,hc-light}-theme.json
```

Les 12 mois ont une variante `hcLight`, mais elle reste facultative : seul un mois dont la palette la contient a un
fichier `hc-light`. Un mois avec cette variante doit aussi déclarer le thème dans `package.json`
(`"uiTheme": "hc-light"`) et figurer dans `HIGH_CONTRAST_LIGHT_MONTHS` dans `theme-logic.js`, sinon les tests
unitaires échouent. Un mois qui ne l'a pas passe en High Contrast.

Les fichiers de thème générés ne doivent pas être modifiés à la main : modifier la palette puis relancer `build.py`.

## Ébaucher un mois à partir de son ambiance

```sh
python3 scripts/themes/draft.py 01            # affiche les couleurs de syntaxe choisies, aucun fichier modifié
python3 scripts/themes/draft.py 01 --write    # écrit palettes/01.json
python3 scripts/themes/draft.py all --write   # les 12 mois (environ 1 minute par mois)
python3 scripts/themes/build.py 01 --write    # puis générer les thèmes
```

`draft.py` produit les 4 palettes d'un mois à partir de deux fichiers :

- `direction.json` donne l'ambiance du mois (nom, description), le fond et l'accent de départ de chaque déclinaison
  (hexadécimal, ou `[L, C, H]` en CIE LCh) et, pour chaque rôle de syntaxe, une plage
  `[teinte min, teinte max, chroma min, chroma max]` ;
- `draft-template.json` donne la structure : les 4 palettes d'octobre d'avant la refonte.

Les surfaces prennent la teinte du fond du mois, l'accent et les barres celle de l'accent. En contraste élevé, le
cadre (barre latérale, barre d'activité, barre de titre, onglets inactifs), noir ou blanc pur dans le modèle, prend
aussi la teinte du fond : un peu plus foncé que l'éditeur, en sombre comme en clair. Les alertes, la sélection et le
terminal restent ceux du modèle, puis sont ajustés au nouveau fond jusqu'à passer l'audit.

La syntaxe est cherchée dans les plages du mois : contraste WCAG sur toutes les surfaces du code, clartés étagées pour
l'achromatopsie, et un ΔE d'au moins 12 visé entre les couleurs de code pour les 3 daltonismes simulés. Le script fait
jusqu'à 4 tirages pour l'atteindre et garde le meilleur ; il signale sur la sortie d'erreur un tirage sous 12, ou une
plage trop étroite qu'il a dû élargir. Pour éviter que deux mois se ressemblent, garder des plages de syntaxe qui ne se
chevauchent pas entre mois voisins de teinte, puis lancer `npm run themes:variety`.

Une ébauche est un point de départ : l'ajuster ensuite à la main dans `palettes/<mois>.json`, puis `build.py`. Les
palettes actuelles ont été retouchées après l'ébauche : les couleurs de code de janvier (Light et High Contrast Light),
mai (Light et High Contrast Light) et octobre (High Contrast Light), pour atteindre le seuil de 12 en daltonisme.
Relancer `draft.py --write` sur ces mois effacerait ces retouches.

## Créer la palette d'un autre mois à la main

1. Copier `palettes/10.json` vers `palettes/<mois>.json` (ex. `11.json`).
2. Choisir les fonds et le texte de chaque variante (`bg`, `bgAlt`, `bgDeep`, `fg`...), puis l'accent du mois.
3. Obtenir des couleurs de syntaxe distinctes pour ces fonds :

   ```sh
   python3 scripts/themes/optimize.py --bg '#FAF4EE' --fg '#3B2718' --sel '#B6D1EE'   # Light
   python3 scripts/themes/optimize.py --bg '#2B1B0F' --fg '#EDE3D6' --sel '#2F4C6B' --min 5  # Dark
   python3 scripts/themes/optimize.py --bg '#0D0A07' --fg '#FFF3E6' --min 7            # High Contrast
   python3 scripts/themes/optimize.py --bg '#FFFCF8' --fg '#1A0F08' --min 7            # High Contrast Light
   ```

   Sur fond clair, le minimum de 7:1 impose des couleurs foncées et proches en clarté : jouer aussi sur la clarté
   et la saturation pour garder un ΔE d'au moins 12 entre les rôles.

   Les propositions maximisent la distinction, pas l'esthétique : les ajuster à la main en gardant les
   écarts de clarté entre rôles, c'est ce qui compte le plus pour les daltoniens.
4. Lancer `build.py <mois>` jusqu'à 0 problème, puis `--write`.
5. Tester dans VS Code (F5), y compris la sélection dans le terminal et la console de débogage.

### Rôles de la palette

| Rôle | Utilisation |
|---|---|
| `bg`, `bgAlt`, `bgDeep` | Éditeur et panneau ; barre latérale ; barre d'activité, titre, onglets inactifs |
| `bgWidget`, `bgInput`, `bgHover`, `bgLine` | Widgets et menus ; champs ; survol ; ligne courante |
| `fg`, `fgMuted`, `fgFaint` | Texte principal ; secondaire ; discret (numéros de ligne, texte indicatif) |
| `border`, `borderStrong`, `contrastBorder` | Séparateurs ; bordures de champs ; bordures High Contrast (`null` sinon) |
| `accent`, `accentFg`, `accentHover` | Couleur du mois (boutons, badges, onglet actif) et texte posé dessus |
| `sel`, `selInactive`, `selFg`, `wsel` | Sélection éditeur/terminal ; inactive ; texte sélectionné (High Contrast : noir sur sélection claire, blanc sur sélection foncée en High Contrast Light) ; sélection de la console |
| `find`, `findHl` (+ `Border`) | Résultat de recherche actif ; autres résultats |
| `wordHl`, `wordHlStrong` (+ `Border`) | Occurrences du symbole sous le curseur (lecture ; écriture) |
| `error`, `warning`, `info`, `added`, `modified`, `deleted` | Diagnostics et modifications Git |
| `debugInfo`, `debugWarning`, `debugError` | Messages de la console de débogage (lisibles aussi une fois sélectionnés) |
| `statusBg`, `statusFg`, ... | Barre d'état |
| `ansi` | 16 couleurs du terminal |
| `tok` | Couleurs de syntaxe par rôle (`keyword`, `function`, `string`, `number`, `klass`, `comment`...) |
| `note` | Texte du champ `_accessibilityNote` du thème |
