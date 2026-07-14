# Maçonnerie DMD — Application interne

Application web interne (pages HTML statiques) hébergée sur **GitHub → Vercel**, avec **Supabase** comme base de données commune (table `inv_store`) et stockage de photos (bucket `chat-photos`).

## Déploiement

1. Placer **tous les fichiers `.html` à la racine** du dépôt GitHub.
2. Vercel redéploie automatiquement à chaque `push`.
3. Aucune configuration Supabase supplémentaire n'est requise (les nouvelles fonctions écrivent dans la table `inv_store` existante).
4. **Une fois** après le déploiement : ouvrir la tuile **Infos équipe** en mode admin (code `DMD-ADMIN`) pour activer les nouvelles équipes (Réno 1-2, Administration) dans l'inventaire et le Punch.

## Fichiers de l'application (racine)

- **index.html** — Accueil : identification, avis de collecte (Loi 25), contrôle d'accès, grille des tuiles.
- **APPLI__EQUIPES.html** — Infos équipe : infos de chantier (n° projet, contremaître, adresse) + composition des équipes par rôle. Le rôle alimente le statut CCQ du Punch.
- **APPLI__INVENTAIRE.html** — Inventaire par équipe (onglet Machinerie, registre des extincteurs). Infos de chantier en lecture seule (éditées dans Infos équipe).
- **APPLI__MACHINERIE.html** — Suivi machinerie : vérifs, bris, réparations, inspections, extincteur assigné.
- **APPLI__INFOS.html** — Répertoire, formations par employé, contact d'urgence.
- **APPLI__FORMATIONS.html** — Planification des formations (admin) + rappels.
- **APPLI__CHAT.html** — Messagerie de chantier (texte + photos).
- **APPLI__FACTURES.html** — Suivi mensuel des factures de cartes de crédit.
- **APPLI__PUNCH.html** — Pointage géolocalisé (250 m), banque de temps par secteur CCQ, statut du travailleur, vue/export admin.
- **APPLI__POLITIQUES.html** — Politique de confidentialité, Loi 25, consentements datés.

Notes communes :
- Les **noms** s'affichent en casse propre (ex. « Maxime Blouin-Hébert ») et les **téléphones** au format `(450)502-7273` (appel automatique conservé).
- Les **adresses** suivent un format uniforme (ex. « 1100 av. André-Champagne, St-Bruno, Qc ») : exemple affiché dans les champs et reformatage automatique à l'affichage (partout sauf saisie brute conservée). Les codes postaux et n° d'appartement sont préservés.
- Dans les formulaires (toutes les tuiles **sauf Inventaire et Machinerie**), le clavier affiche une flèche **« suivant »** : **Entrée** passe au champ suivant et **corrige le champ au passage** — majuscules des noms, **nom synchronisé avec la liste** quand la correspondance est unique, adresse et téléphone. Les zones de notes, la messagerie et les barres de recherche gardent leur comportement.
- L'**export Excel** de chaque tuile se révèle par **Ctrl+X** et est **réservé au mode admin**.

## Documentation (dossier `docs/`)

- **SUPABASE_CHAT_SETUP.md** — Création du bucket `chat-photos` et politiques d'accès (à faire une seule fois).
- **OPTIMISATION_SUPABASE.sql** — Index sur `inv_store(key)` pour accélérer les recherches par préfixe.
- **GUIDE_FINAL_11JUILLET.md**, **MISES_A_JOUR.md** — Historique et notes de version.

## Clés Supabase utilisées (table `inv_store`)

Préfixes : `chat:`, `chatlast:`, `chatread:`, `fact:`, `inv:person:`, `inv:consent:`, `inv:machine:`, `inv:machineCatalog`, `inv:machines:<équipe>:MACHINERIE`, `inv:info:<équipe>`, `inv:<équipe>:<catégorie>`, `inv:formations`, `inv:formationsPlan`, `inv:extincteur:<n°>`, `inv:teammember:<id>`, `inv:teams`, `punch:<appareil>:<horodatage>`, `punch_site:<équipe>`, `punch_secteur:<équipe>`, `punch_statut:<appareil>`.
