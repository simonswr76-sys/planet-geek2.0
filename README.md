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


## Nouveautés
- 4 nouveaux jeux : Dino Dash, Flappy Rocket, Brick Breaker et Critter Pop.
- Mahjong solitaire : 100 niveaux, niveaux suivants déverrouillés en terminant le précédent, indices, annulation, mélange et sauvegarde automatique locale de la partie et des niveaux.
- La progression XP et le profil existants restent inclus.
- La progression est stockée dans le navigateur (localStorage) : elle n'est pas synchronisée entre appareils et peut être perdue si les données du navigateur sont effacées.


## Fonctionnalités ajoutées
- 19 mini-jeux au total, dont Space Invaders, Math Sprint, Color Tap, Orbit Catch et Cave Explorer.
- Missions quotidiennes avec récompenses XP récupérables une seule fois par mission et par date locale.
- Boutique XP avec thèmes Cosmos, Nébuleuse violette, Supernova et Émeraude.
- Collection de 10 badges et statistiques personnelles des parties validées par jeu. Les scores détaillés ne sont affichés que lorsqu'un jeu les transmet; cette version suit surtout les parties validées.
- Défis entre amis par code à copier/coller. C'est une comparaison manuelle des XP et du nombre de parties, pas un multijoueur en temps réel ni un classement serveur.
- Progression enregistrée dans localStorage du navigateur. Elle n'est pas synchronisée entre appareils et peut être effacée en supprimant les données du navigateur.

## Publication sur GitHub Pages
1. Décompresser le ZIP.
2. Ouvrir le dépôt GitHub et cliquer sur **Add file → Upload files**.
3. Envoyer les cinq fichiers de ce dossier en remplaçant les versions correspondantes.
4. Cliquer sur **Commit changes**.
5. Attendre la publication GitHub Pages puis recharger le site avec Ctrl+F5.


## Nouveautés progression (édition enrichie)

- Rangs Bronze, Argent, Or, Platine, Diamant et Légende selon l'XP.
- Inventaire de skins avec achat et équipement.
- Boss hebdomadaire jouable au clic, récompense de 75 XP à la victoire.
- Monde à explorer avec zones déverrouillées selon le nombre de parties validées.
- Statistiques supplémentaires : jeux distincts, parties du jour, série de jours et XP moyenne par partie.
- Coffre quotidien donnant une récompense aléatoire de 25 à 50 XP.
- Tournoi local en 3 manches, avec 50 XP à réclamer.
- Succès secrets qui se révèlent en les débloquant.
- Compagnon virtuel à nourrir avec 20 XP ; il gagne des niveaux.
- Mise en page responsive pour mobiles et tablettes.

**À savoir :** les données sont stockées dans le navigateur avec `localStorage` : elles ne sont pas synchronisées entre appareils. Le boss, le tournoi et les récompenses sont des mécaniques locales, pas du multijoueur en ligne. Les scores détaillés ne peuvent être affichés que si chaque mini-jeu les transmet.
