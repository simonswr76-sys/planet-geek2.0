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
