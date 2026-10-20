# Planet Geek — site de mini-jeux

Un petit site arcade responsive en HTML, CSS et JavaScript, sans framework et sans abonnement nécessaire. Il contient cinq mini-jeux intégrés : Neon Racer, Pixel Jumper, Star Blaster, Memory Matrix et Mahjong Neon, avec trois niveaux de Mahjong.

## Tester sur ton PC
1. Décompresse `planet_geek.zip`.
2. Ouvre le dossier `planet_geek`.
3. Double-clique sur `index.html`. Les jeux fonctionnent dans un navigateur moderne.

## Publier gratuitement avec GitHub Pages
1. Crée un compte sur https://github.com si tu n'en as pas.
2. Clique sur `+` puis `New repository`.
3. Donne-lui le nom `planet-geek`, choisis `Public`, puis clique sur `Create repository`.
4. Dans le dépôt, clique `Add file` → `Upload files`.
5. Envoie les fichiers et le dossier `games` du site (index.html, style.css, app.js, games.js, README.md). Tu peux aussi glisser-déposer leur contenu depuis le dossier décompressé.
6. Clique `Commit changes`.
7. Ouvre `Settings` → `Pages`.
8. Sous `Build and deployment`, choisis `Deploy from a branch`, puis `main` et `/ (root)`, et clique `Save`.
9. Attends quelques minutes. Ton adresse sera généralement `https://TON-PSEUDO.github.io/planet-geek/`.

## À savoir
- L'hébergement GitHub Pages est gratuit pour les dépôts publics et les sites statiques.
- Les quatre mini-jeux sont de petits jeux originaux inclus dans le site. Ils ne nécessitent pas de compte de jeu.
- La police du site est chargée depuis Google Fonts ; sans Internet, le site utilise une police de remplacement.
- Il n'y a pas encore de comptes utilisateurs, de classement en ligne ou de sauvegarde cloud.


Jeux inclus : Neon Racer, Pixel Jumper, Star Blaster, Memory Matrix, Mahjong Neon, Snake Neon, Tic Tac Toe et Reflex Rush.


## Nouveaux jeux ajoutés

- **Neon Pong** : duel contre l’ordinateur, déplacement avec les flèches haut/bas ou W/S; souris/tactile pris en charge.
- **Block Master** : choisis une pièce puis clique sur le plateau pour la placer; complète les lignes ou colonnes pour gagner des points.

Les cartes et le lancement des deux jeux sont déjà intégrés dans `index.html` et `games.js`.


## Système Planet XP
- La progression est enregistrée dans le navigateur avec `localStorage` (clé `planetGeekProgressV1`).
- Le bouton « Terminer la partie · +10 XP » dans la fenêtre d’un jeu ajoute 10 XP une seule fois par ouverture de partie.
- Le tableau affiche l’XP, le niveau, la progression et les badges.
- Les données restent sur le même navigateur/appareil ; elles ne sont pas synchronisées entre appareils.

## Profil joueur et XP
- Le profil permet de choisir un pseudo (jusqu'à 18 caractères), sauvegardé dans le navigateur.
- Le niveau, l'XP totale, les parties validées et les badges sont synchronisés avec le système Planet XP.
- Les données sont locales au navigateur/appareil et ne se synchronisent pas entre appareils.
