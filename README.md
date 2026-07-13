# Maçonnerie DMD — Application interne

Application web interne (pages HTML statiques) hébergée sur **GitHub → Vercel**, avec **Supabase** comme base de données commune (table `inv_store`) et stockage de photos (bucket `chat-photos`).

## Déploiement

1. Placer **tous les fichiers `.html` à la racine** du dépôt GitHub.
2. Vercel redéploie automatiquement à chaque `push`.
3. Aucune configuration Supabase supplémentaire n'est requise pour ces mises à jour (les nouvelles fonctions écrivent dans la table `inv_store` existante).

## Fichiers de l'application (racine)

- **index.html** — Accueil : identification, avis de collecte (Loi 25), contrôle d'accès, grille des tuiles.
- **APPLI__INVENTAIRE.html** — Inventaire par équipe (dont onglet Machinerie et registre des extincteurs).
- **APPLI__MACHINERIE.html** — Suivi machinerie : vérifs, bris, réparations, inspections, extincteur assigné.
- **APPLI__INFOS.html** — Répertoire, formations par employé, contact d'urgence.
- **APPLI__FORMATIONS.html** — Planification des formations (admin) + rappels.
- **APPLI__CHAT.html** — Messagerie de chantier (texte + photos).
- **APPLI__FACTURES.html** — Suivi mensuel des factures de cartes de crédit.
- **APPLI__PUNCH.html** — Pointage géolocalisé (250 m), banque de temps par secteur CCQ, statut du travailleur, vue/export admin.
- **APPLI__POLITIQUES.html** — Politique de confidentialité, Loi 25, consentements datés.

## Documentation (dossier `docs/`)

- **SUPABASE_CHAT_SETUP.md** — Création du bucket `chat-photos` et politiques d'accès (à faire une seule fois).
- **OPTIMISATION_SUPABASE.sql** — Index sur `inv_store(key)` pour accélérer les recherches par préfixe.
- **GUIDE_FINAL_11JUILLET.md**, **MISES_A_JOUR.md** — Historique et notes de version.

## Clés Supabase utilisées (table `inv_store`)

Préfixes principaux : `chat:`, `chatlast:`, `chatread:`, `fact:`, `inv:person:`, `inv:consent:`, `inv:machine:`, `inv:machineCatalog`, `inv:machines:<équipe>:MACHINERIE`, `inv:info:<équipe>`, `inv:<équipe>:<catégorie>`, `inv:formations`, `inv:formationsPlan`, `inv:extincteur:<n°>`, `punch:<appareil>:<horodatage>`, `punch_site:<équipe>`, `punch_secteur:<équipe>`, `punch_statut:<appareil>`.
