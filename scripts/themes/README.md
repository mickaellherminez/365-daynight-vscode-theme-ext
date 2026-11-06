# Outils de génération et d'audit des thèmes

Ces scripts Python (3.8+, sans dépendance) génèrent les variantes Light, Dark et High Contrast d'un mois
à partir d'une palette, et vérifient leur accessibilité : contrastes WCAG et distinction des couleurs
pour les personnes daltoniennes.

| Fichier | Rôle |
|---|---|
| `audit.py` | Audite un ou plusieurs thèmes existants (`npm run themes:audit`) |
| `build.py` | Génère les 3 thèmes d'un mois depuis `palettes/<mois>.json`, puis les audite. Avec `--check`, vérifie que `themes/` correspond aux palettes (`npm run themes:check`) |
| `optimize.py` | Propose des couleurs de syntaxe distinctes pour un fond donné (point de départ d'une palette) |
| `preview.py` | Génère les images d'aperçu des README (`assets/screenshots/`) avec Google Chrome en mode headless |
| `colorlib.py` | Calculs de couleur : contraste, composition alpha, simulation du daltonisme |
| `token-rules.json` | Règles de coloration syntaxique communes à tous les mois (scopes → rôle de couleur) |
| `palettes/` | Une palette par mois (`10.json` = octobre) |

## Auditer

```sh
npm run themes:audit                                  # les 36 thèmes
python3 scripts/themes/audit.py themes/365-10-*.json  # thèmes choisis
python3 scripts/themes/audit.py -v themes/365-10-light-theme.json  # détail de chaque contrôle
```

Le script renvoie le code 1 si un contrôle échoue. Il vérifie notamment :

- **Contraste** : texte et jetons de syntaxe ≥ 4.5:1 (AA) ; ≥ 7:1 (AAA) pour les thèmes High Contrast ;
  indicateurs (curseur, soulignements, gouttière, focus) ≥ 3:1.
- **Sélection** : visible dans l'éditeur, le terminal et la console de débogage, distincte de la ligne
  courante, et texte sélectionné toujours lisible.
- **Interface** : barre latérale, onglets, barre d'état, boutons, champs, menus, notifications, vue peek, etc.
- **Jetons sémantiques** : chaque couleur de `semanticTokenColors` (fonction, méthode, propriété, paramètre...)
  respecte les mêmes minimums que les jetons de syntaxe, sur le fond et une fois sélectionnée. TypeScript, Python
  et d'autres langages les utilisent à la place des règles TextMate.
- **Bouton de l'extension** : `365DayNight.statusBarButton` est lisible sur la barre d'état (≥ 4.5:1, ≥ 7:1 en High Contrast)
  et se distingue du texte normal de la barre (ΔE ≥ 15). `build.py` la calcule depuis `accent`, en éclaircissant au minimum.
- **Daltonisme** : les jetons principaux (mot-clé, fonction, chaîne, nombre, classe, commentaire, variable)
  et les alertes (erreur, avertissement, ajout, suppression) sont simulés en protanopie, deutéranopie et
  tritanopie ([Machado et al., 2009](https://www.inf.ufrgs.br/~oliveira/pubs_files/CVD_Simulation/CVD_Simulation.html)).
  Une différence perçue (ΔE) inférieure à 10 est signalée comme confusion possible.

Une clé manquante compte comme un échec : VS Code la remplacerait par sa couleur par défaut, sans rapport avec le thème.
C'est aussi le cas d'un rôle attendu : chacune des 14 catégories de jetons contrôlées (commentaire, mot-clé, fonction,
chaîne, nombre, classe, variable, opérateur, ponctuation, balise, attribut, regex, clé JSON, invalide) et chacun des
14 jetons sémantiques colorés doivent être présents.

## Vérifier que les thèmes correspondent aux palettes

```sh
npm run themes:check
```

Le générateur recalcule les 36 thèmes en mémoire et les compare aux fichiers de `themes/`, octet par octet. Un fichier
modifié à la main, une palette changée sans `--write`, un fichier manquant ou un fichier en trop font échouer la
vérification, lancée aussi par la CI et avant chaque publication. Pour corriger, modifier la palette puis relancer
`build.py <mois> --write`.

## Ce que l'audit ne vérifie pas

L'audit garantit les contrôles listés ci-dessus, rien de plus. En particulier :

- **Couleurs non définies** : un thème définit environ 420 des quelque 970 couleurs documentées par VS Code. Les autres
  prennent la couleur par défaut de VS Code et ne sont pas auditées (par exemple le chat, les tests, les notebooks).
- **Paires contrôlées** : seules les combinaisons texte / fond listées dans `audit.py` sont mesurées. Une couleur
  posée sur un fond non prévu (un badge dans un widget, par exemple) n'est pas vérifiée.
- **Rendu réel** : le contraste est calculé sur les couleurs déclarées. La police, son épaisseur, l'anticrénelage,
  la taille du texte et l'empilement de plusieurs fonds transparents ne sont pas mesurés.
- **Langages** : chaque catégorie de jeton est testée avec un seul scope TextMate représentatif. Une grammaire qui
  utilise d'autres scopes peut afficher d'autres couleurs.
- **Norme** : les ratios sont ceux de WCAG 2.x. Le futur modèle APCA (WCAG 3) n'est pas appliqué.
- **Daltonisme** : la simulation de Machado et al. (2009) porte sur les dichromaties complètes (protanopie,
  deutéranopie, tritanopie). Les formes partielles, plus fréquentes, sont moins sévères mais pas simulées à part.
  Le seuil ΔE de 10 (CIE76) est une règle pratique, pas une norme.
- **Thèmes à contraste élevé clairs** : il n'en existe pas encore, l'audit ne les couvre donc pas.
- **Personnes réelles** : aucun calcul ne remplace des essais avec des personnes concernées.

## Générer les thèmes d'un mois

```sh
python3 scripts/themes/build.py 10           # aperçu de l'audit, aucun fichier modifié
python3 scripts/themes/build.py 10 --write   # écrit themes/365-10-{light,dark,hc-dark}-theme.json
```

Les fichiers de thème générés ne doivent pas être modifiés à la main : modifier la palette puis relancer `build.py`.

## Créer la palette d'un autre mois

1. Copier `palettes/10.json` vers `palettes/<mois>.json` (ex. `11.json`).
2. Choisir les fonds et le texte de chaque variante (`bg`, `bgAlt`, `bgDeep`, `fg`...), puis l'accent du mois.
3. Obtenir des couleurs de syntaxe distinctes pour ces fonds :

   ```sh
   python3 scripts/themes/optimize.py --bg '#FAF4EE' --fg '#3B2718' --sel '#B6D1EE'   # Light
   python3 scripts/themes/optimize.py --bg '#2B1B0F' --fg '#EDE3D6' --sel '#2F4C6B' --min 5  # Dark
   python3 scripts/themes/optimize.py --bg '#0D0A07' --fg '#FFF3E6' --min 7            # High Contrast
   ```

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
| `sel`, `selInactive`, `selFg`, `wsel` | Sélection éditeur/terminal ; inactive ; texte sélectionné (High Contrast) ; sélection de la console |
| `find`, `findHl` (+ `Border`) | Résultat de recherche actif ; autres résultats |
| `wordHl`, `wordHlStrong` (+ `Border`) | Occurrences du symbole sous le curseur (lecture ; écriture) |
| `error`, `warning`, `info`, `added`, `modified`, `deleted` | Diagnostics et modifications Git |
| `debugInfo`, `debugWarning`, `debugError` | Messages de la console de débogage (lisibles aussi une fois sélectionnés) |
| `statusBg`, `statusFg`, ... | Barre d'état |
| `ansi` | 16 couleurs du terminal |
| `tok` | Couleurs de syntaxe par rôle (`keyword`, `function`, `string`, `number`, `klass`, `comment`...) |
| `note` | Texte du champ `_accessibilityNote` du thème |
