# Maçonnerie DMD — Version finale (11 juillet 2026)

## Modifications incluses dans cette version

1. **Bouton « Identification » retiré** de l'en-tête de l'inventaire.
2. **Nouvelle tuile Formations** (`APPLI__FORMATIONS.html`) — en cours / en attente, création par l'admin (type, endroit, dates, employé·s, notes).
3. **Pop-up de rappel** de formation à l'accueil, jusqu'à la fin de la formation, avec « Voir la formation » et « Ne plus afficher aujourd'hui ».
4. **Optimisations de charge** — chat allégé (7 s, pause en arrière-plan), caches 60 s pour la liste des employés et le plan de formation.
5. **Nouvel onglet « Accessoire Fraco »** dans l'inventaire — accessoires Fraco + rack gris extraits de Machinerie (les machines F01-F06 restent dans Machinerie).
6. **Filtrage par équipe** dans la tuile Machinerie — chaque utilisateur voit la machinerie de son équipe (celle choisie dans l'inventaire) ; l'admin voit tout.

## Fichiers à déployer sur GitHub
- Modifiés : `index.html`, `APPLI__CHAT.html`, `APPLI__INVENTAIRE.html`, `APPLI__MACHINERIE.html`
- Nouveau : `APPLI__FORMATIONS.html`
- Inchangés : `APPLI__FACTURES.html`, `APPLI__INFOS.html`, `APPLI__POLITIQUES.html`

## Supabase
Le SQL (`OPTIMISATION_SUPABASE.sql`) a déjà été exécuté avec succès le 11 juillet. L'index existe.
Note : à la taille actuelle de la base, l'index n'est pas encore utilisé (la table est trop petite, Postgres lit tout directement, c'est instantané). Il deviendra utile quand le volume de données augmentera.

## Audit et nettoyage effectués le 11 juillet
Vérification directe de la base (données réelles) :
- Aucune erreur dans les logs (Postgres, API).
- Catalogue de 49 machines cohérent, aucun doublon d'identifiant.
- Tous les JSON bien formés.
- La tuile Machinerie lit la bonne clé de sélection (`MACHINERIE`) — le filtrage par équipe est cohérent.
- L'onglet Accessoire Fraco ne fait rien perdre (aucune quantité n'y était saisie).

Nettoyage réalisé (5 clés résiduelles supprimées, avec accord) :
- 4 vieilles clés `inv:machines:team_1:LOURD_*` (plus lues par l'app).
- 1 consentement orphelin de test.
La base est passée de 32 à 27 clés, toutes utiles.

## Ce qui reste hors de portée ici
- Test tactile réel (à faire sur le téléphone).
- Vrai test de charge 100 utilisateurs : nécessite l'outil k6 sur un ordinateur. Demander le script quand un ordinateur est disponible.

## À surveiller pour la suite
- Sous Loi 25 : idéalement, chaque personne du répertoire a un consentement enregistré.
- Avant de renommer/déplacer un onglet d'inventaire déjà rempli de données : attention, les données restent sous l'ancienne clé de stockage. Le faire quand la catégorie est vide (comme Accessoire Fraco aujourd'hui) évite tout problème.
