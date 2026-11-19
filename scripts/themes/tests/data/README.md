# Données de référence

Ces fichiers viennent des publications citées, sans modification autre que le format, sauf
`daltonlens-cvd.json` (voir plus bas). Les tests de `scripts/themes/tests/` comparent les calculs de
`colorlib.py` à ces valeurs.

| Fichier | Contenu | Source |
|---|---|---|
| `sharma2005-ciede2000.txt` | 34 paires de couleurs CIELAB et leur ΔE2000 attendu. Colonnes : L1, a1, b1, L2, a2, b2, ΔE2000 | G. Sharma, W. Wu et E. N. Dalal, « The CIEDE2000 color-difference formula: implementation notes, supplementary test data, and mathematical observations », *Color Research & Application* 30(1), 2005, p. 21–30. Fichier `ciede2000testdata.txt` de la [page de G. Sharma](https://hajim.rochester.edu/ece/sites/gsharma/ciede2000/) |
| `machado2009-cvd.json` | Matrices de simulation de la protanomalie, de la deutéranomalie et de la tritanomalie, en RGB linéaire, pour les sévérités 0,0 à 1,0. La sévérité 1,0 correspond à la dichromatie (protanopie, deutéranopie, tritanopie) | G. M. Machado, M. M. Oliveira et L. A. F. Fernandes, « A Physiologically-based Model for Simulation of Color Vision Deficiency », *IEEE Transactions on Visualization and Computer Graphics* 15(6), 2009, p. 1291–1298, DOI [10.1109/TVCG.2009.113](https://doi.org/10.1109/TVCG.2009.113). Tableau de la [page du projet](https://www.inf.ufrgs.br/~oliveira/pubs_files/CVD_Simulation/CVD_Simulation.html) |

| `daltonlens-cvd.json` | 216 couleurs sRGB (6 niveaux par canal) et leur simulation en RGB linéaire, avant écrêtage, par Brettel 1997 (protanopie, deutéranopie, tritanopie) et Viénot 1999 (protanopie, deutéranopie). Généré par `daltonlens_reference.py`, qui indique la commande | [DaltonLens-Python](https://github.com/DaltonLens/DaltonLens-Python) 0.1.5, licence MIT, simulateurs avec leurs paramètres par défaut. Méthodes : H. Brettel, F. Viénot et J. D. Mollon, « Computerized simulation of color appearance for dichromats », *JOSA A* 14(10), 1997, p. 2647–2655 ; F. Viénot, H. Brettel et J. D. Mollon, « Digital video colourmaps for checking the legibility of displays by dichromats », *Color Research & Application* 24(4), 1999, p. 243–252. Choix des modèles : [comparaison de DaltonLens](https://daltonlens.org/opensource-cvd-simulation/) |

Seul `daltonlens-cvd.json` est calculé et non recopié d'une publication : il vérifie que `colorlib.py` applique
ces méthodes comme une implémentation de référence.

Les données de Sharma et al. sont fournies par leurs auteurs « telles quelles », pour vérifier une
implémentation de CIEDE2000.
