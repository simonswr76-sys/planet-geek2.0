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


## Grande mise à jour néon — octobre 2026
- Interface harmonisée avec des lumières néon bleues/violettes, des cartes plus lisibles et des états de focus clavier plus visibles.
- Favoris de jeux : bouton étoile sur les cartes, avec enregistrement local.
- Barre d’outils rapide : recherche avec `/` ou `Ctrl+K`, accès aux favoris, options d’affichage et retour en haut.
- Options accessibles : contraste renforcé et réduction des animations, mémorisées sur l’appareil.
- Toutes les pages et les fichiers de jeu de l’archive d’origine sont conservés.
- Les sauvegardes existantes restent dans leurs clés localStorage habituelles ; les nouvelles options utilisent uniquement `pgFavoritesV2` et `pgDisplayPrefsV1`.

Pour mettre à jour GitHub Pages, téléverse le contenu du dossier `planet-geek2.0-main` dans le dépôt publié, en conservant les fichiers ensemble. Les préférences et progressions locales restent enregistrées dans le navigateur où elles ont été créées ; un site statique ne synchronise pas automatiquement les sauvegardes entre appareils.
