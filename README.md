# Planet Geek — Édition complète

Site statique de mini-jeux pour GitHub Pages.

## Mise en ligne
1. Remplace les fichiers du dépôt par `index.html`, `style.css`, `app.js` et `games.js`.
2. Fais un commit sur la branche publiée par GitHub Pages.
3. Attends la publication puis recharge avec Ctrl+F5.

## Contenu
- Navigation compacte avec menu à trois barres
- Recherche sans accents et filtres par catégorie
- Mini-jeux, profil, progression, boutique, casier et arène
- Pass de saison, missions quotidiennes, coffre, boss, exploration et tournoi
- Défis hebdomadaires avec récompenses en XP et pièces PG
- Données locales dans le navigateur ; pas de compte serveur ni de multijoueur en ligne

Les récompenses sont virtuelles et ne correspondent à aucune valeur monétaire réelle.


## Nouveau mini-jeu 3D : Vol un Œuf
Ouvre `vol-un-oeuf.html` depuis le site. Le jeu utilise Three.js chargé depuis un CDN, donc une connexion Internet est nécessaire pour les graphismes 3D. Les pièces et améliorations sont sauvegardées dans le navigateur.


## Grande mise à jour Planet Geek
- Navigation séparée : Accueil, Jeux, Profil, Boutique, Casier, Pass, Arène et Statistiques.
- Style gaming néon bleu/violet conservé et ajustements responsive.
- Récompense quotidienne : +50 XP et +25 pièces PG, avec bonus de série progressif plafonné à +100 pièces.
- Les jeux, le moteur de mini-jeux, le Pass et son compte à rebours existants sont conservés.
- Les données restent enregistrées dans le navigateur via localStorage. Il n'y a pas de serveur ni de synchronisation en ligne.
- Hébergement : GitHub Pages. Garder tous les fichiers du ZIP dans le même dossier.

## Vol un Œuf 3D — grande mise à jour
Fichier : `vol-un-oeuf.html` (tout le code du jeu est dans ce fichier ; les autres pages du site sont inchangées).
- **Marché des vitesses** : 8 niveaux à prix croissants (30 → 700 ◈), niveau actuel et prochaine amélioration affichés.
- **Écloserie 3D** : les œufs livrés au nid vont dans l'inventaire ; à l'écloserie violette (touche E ou onglet Œufs), animation d'éclosion avec lumière, secousses, explosion de particules et coquille qui s'ouvre.
- **4 raretés** (commun, rare, épique, légendaire) et **16 créatures** (4 par monde), avec onglet Collection et galerie 3D autour de l'écloserie.
- **4 portails / mondes** : Île Néon (départ), Forêt Prisme (120 ◈ ou 10 œufs livrés), Abysses Cristal (350 ◈ ou 6 créatures), Vide Violet (800 ◈ ou 40 œufs livrés). Chaque monde a ses couleurs, ses probabilités d'œufs et ses créatures.
- **3 IA voleuses** (Zéphyr, Ombre, Tank) : chacune cherche un œuf, le vole, le rapporte à sa base. Touche-les quand elles portent un œuf pour les plaquer et le récupérer. Ombre peut te voler l'œuf que tu portes.
- Sauvegarde dans le navigateur (localStorage, clé `pg_egg_heist_v1`, anciennes sauvegardes compatibles). Bouton « Mode éco » pour les petits PC.
- Three.js 0.160 est chargé depuis unpkg.com : une connexion Internet est nécessaire.

## Nouveau jeu : Vole un Gloubi 3D (`vole-un-gloubi.html`)
Jeu 3D original du genre « voler et revendre » : achète des gloubis sur le tapis roulant (E), ils rapportent des pièces par seconde dans ta base (marche dessus pour collecter), vole ceux des 3 bases rivales (E), verrouille ta base (L), revends (F ou bouton VENDRE). 10 gloubis, 6 raretés (dont SECRET arc-en-ciel), améliorations (vitesse, slots, durée du verrou), IA rivales qui achètent, se verrouillent et attaquent ta base. Sauvegarde dans le navigateur (`pg_gloubi_v1`). Three.js chargé depuis unpkg : Internet requis.

## Nouveau jeu : Cristal Rush 3D (`cristal-rush.html`)
Jeu de minage en vue à la première personne : souris pour regarder, ZQSD/WASD (ou flèches) pour se déplacer, clic maintenu pour miner, Espace pour sauter, Shift pour sprinter, E pour ouvrir le menu/boutique. 6 raretés de cristaux (dont COSMIQUE arc-en-ciel, extrêmement rare), faisceaux lumineux pour les rares, indicateur de distance/direction, 6 améliorations (dont drones qui minent seuls), événement « Ruée dorée », niveaux, Renaissance (bonus permanent), codex, réglages (sensibilité, volume, mode éco), compteur FPS coloré. Sauvegarde : `pg_cristalrush_v1`. Three.js via unpkg : Internet requis.
