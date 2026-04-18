
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

## Compilation
```
cd asscript/
npm run asbuild
```
- les fichiers build/release.wasm  et build/release.js sont produits
- le fichier à importer depuis Vue est build/release.js, qui fetch release.wasm, le compile et exporte les fonctions pour JS

## Déploiement
```
cd asscript
npm run build
cd ..
npm run build
```

En production, le fichier .wasm est téléchargé comme une ressouorce avant d'être compilé dynamiquement, puis exécuté.
Lors du fetch du fichier .wasm, il a le mime-type application/octet-stream au lieu de application/wasm (aller dans les devtools
cliquer sur le fichier .wasm et constater qu'il est servi par nginx (server: nginx) et que son mime-type est application/octer-stream)
--> adapter la config nginx:
```
    location ~ \.wasm$ {
        default_type application/wasm;
        try_files $uri =404;
    }
```

## Test
```
node tests/index.js
```

# Front VueJS

frontend/
VueJS frontend, calling AssemblyScript functions
Utilise https://github.com/qwerty084/vue3-chessboard


# Important issues

## Blocking

Synchronous WASM computation blocks the entire main thread — CSS animations, DOM paints, everything --> use a web worker for alphabeta computation

## Game persistence on mobile

Mobile browsers often unload pages from memory when backgrounded --> persist game state to localStorage
and restore it on mount by replaying the move history.    

