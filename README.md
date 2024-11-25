
# Notation

row
 7   8 | r  n  b  q  k  b  n  r
 6   7 | p  p  p  p  p  p  p  p
 5   6 |
 4   5 |
 3   4 |
 2   3 |
 1   2 | P  P  P  P  P  P  P  P
 0   1 | R  N  B  Q  K  B  N  R
       +-----------------------
         a  b  c  d  e  f  g  h
         
col      0  1  2  3  4  5  6  7

Une position alternative ne clone pas toutes les pièces, seulement celles qui se déplacent ou qui disparaissent/apparaissent.
Important pour minimiser l'empreinte mémoire car des très nombreuses positions alternatives sont créée à chaque recherche du meilleur coup


# AssemblyScript

## Compiler
```
cd asscript/
npm run asbuild
```
- les fichiers build/release.wasm  et build/release.js sont produits
- le fichier à importer depuis Vue est build/release.js, qui fetch release.wasm, le compile et exporte les fonctions pour JS
- il n'y a pas de problème de mime-type comme dans NutriEducX, peut-être nouvelle version

## Test
```
node tests/index.js
```


# Front VueJS

frontend/
VueJS frontend, calling AssemblyScript functions
Utilise https://github.com/qwerty084/vue3-chessboard
