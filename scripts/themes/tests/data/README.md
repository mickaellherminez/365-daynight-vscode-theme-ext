# Données de référence

Ces fichiers viennent des publications citées, sans modification autre que le format. Les tests de
`scripts/themes/tests/` comparent les calculs de `colorlib.py` à ces valeurs.

| Fichier | Contenu | Source |
|---|---|---|
| `sharma2005-ciede2000.txt` | 34 paires de couleurs CIELAB et leur ΔE2000 attendu. Colonnes : L1, a1, b1, L2, a2, b2, ΔE2000 | G. Sharma, W. Wu et E. N. Dalal, « The CIEDE2000 color-difference formula: implementation notes, supplementary test data, and mathematical observations », *Color Research & Application* 30(1), 2005, p. 21–30. Fichier `ciede2000testdata.txt` de la [page de G. Sharma](https://hajim.rochester.edu/ece/sites/gsharma/ciede2000/) |
| `machado2009-cvd.json` | Matrices de simulation de la protanomalie, de la deutéranomalie et de la tritanomalie, en RGB linéaire, pour les sévérités 0,0 à 1,0. La sévérité 1,0 correspond à la dichromatie (protanopie, deutéranopie, tritanopie) | G. M. Machado, M. M. Oliveira et L. A. F. Fernandes, « A Physiologically-based Model for Simulation of Color Vision Deficiency », *IEEE Transactions on Visualization and Computer Graphics* 15(6), 2009, p. 1291–1298, DOI [10.1109/TVCG.2009.113](https://doi.org/10.1109/TVCG.2009.113). Tableau de la [page du projet](https://www.inf.ufrgs.br/~oliveira/pubs_files/CVD_Simulation/CVD_Simulation.html) |

Les données de Sharma et al. sont fournies par leurs auteurs « telles quelles », pour vérifier une
implémentation de CIEDE2000.
