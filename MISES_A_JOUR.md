# Maçonnerie DMD — Récapitulatif des mises à jour (10 juillet 2026)

Ce paquet regroupe **l'ensemble de l'application** à jour. Les fichiers ci-dessous
remplacent ceux de ton dépôt GitHub. Déploie le tout d'un coup — Vercel redéploie
automatiquement.

## Fichiers modifiés

- **index.html** — écran d'accueil, identification, avis de collecte, contrôle d'accès
- **APPLI__INFOS.html** — répertoire, formations, contact d'urgence, outil admin
- **APPLI__POLITIQUES.html** — politique de confidentialité (v1.1)
- **APPLI__INVENTAIRE.html** — onglet Machinerie fusionné + localisation automatique

## Fichiers inchangés (inclus pour avoir un paquet complet)

- SUPABASE_CHAT_SETUP.md
- APPLI__CHAT.html
- APPLI__FACTURES.html
- APPLI__MACHINERIE.html

---

## Ce qui a changé

### 1. Contact d'urgence
- Demandé **dès la première identification** (accueil) : nom + téléphone obligatoires,
  lien optionnel (conjoint, parent, ami).
- Aussi modifiable dans la tuile Infos (« Modifier mes infos »).
- **Jamais affiché en clair** dans le répertoire : caché derrière un bouton rouge
  « En cas d'urgence » sur chaque fiche, révélé seulement au besoin, avec appel direct.
- Exclu de l'export Excel (on ne multiplie pas les copies des numéros de tiers).

### 2. Infos de base obligatoires + note d'accès
- **Nom et numéro de téléphone obligatoires** : impossible d'entrer sans les fournir.
- Note sur l'écran d'identité expliquant que l'identification **empêche l'accès à une
  personne extérieure à l'organisation**.

### 3. Contrôle d'accès par liste d'employés
- L'accès à **tout le site** est refusé si le nom n'est pas autorisé.
- La liste des employés autorisés vient : (a) des noms du **fichier Excel de formations**
  (synchronisé depuis l'ordinateur, en mode admin) + (b) des employés **ajoutés
  manuellement** en mode admin.
- Vérification à l'**identification** et à **chaque lancement**.
- Correspondance des noms **tolérante** aux accents et petites fautes d'orthographe.
- **Garde-fous** : tant qu'aucune liste n'existe (avant le 1er import), l'accès reste
  ouvert le temps de configurer; l'**appareil admin garde toujours l'accès**.
- Le bouton « C'est une tablette de chantier » reste un accès partagé (contourne la
  liste, par design). À verrouiller derrière l'admin si étanchéité totale souhaitée.

### 4. Ajout d'employés en mode admin (tuile Infos)
- Bouton « ➕ Ajouter un employé (accès) » + liste des ajouts + bouton « Retirer ».
- Les noms ajoutés sont **fusionnés automatiquement** au prochain import Excel
  (retirés de la liste manuelle dès qu'ils apparaissent dans le fichier).

### 5. Répertoire et formations
- Le répertoire ne se remplit qu'à mesure que chaque personne **se connecte et
  s'identifie** — un employé présent dans l'Excel mais jamais connecté n'apparaît pas
  (vaut aussi pour l'admin : permet de voir qui s'est identifié).
- **Chaque employé voit désormais SES propres formations** dès sa connexion
  (avec code couleur d'échéance) — jamais celles des autres. L'admin voit toutes.
- Noms et téléphones des utilisateurs connectés visibles par tous (répertoire).

### 6. Conformité Loi 25
- **Avis de collecte** (accueil) réécrit : contact d'urgence (tiers), appareil photo
  (mode direct seulement), géolocalisation (désactivée par défaut, ponctuelle au
  pointage), visibilité entre utilisateurs. Version bumpée au **10 juillet 2026**
  (le consentement sera redemandé à chacun).
- **Politique de confidentialité v1.1** : sections ajoutées (contact d'urgence /
  renseignements sur un tiers, appareil photo, géolocalisation art. 8.1, visibilité,
  durées de conservation).

### 7. Appli inventaire — onglet Machinerie
- Les 4 onglets **Lift, Fraco, Mixeur et Scie** sont regroupés dans un seul onglet
  **« Machinerie »**, avec sous-sections visibles : Lift, Fraco, **Accessoires Fraco**
  (séparée), Rack gris, Mixeur, Scie. La sélection des machines par équipe et le
  catalogue publié pour l'app Machinerie (types Lift/Fraco/Mixeur/Scie conservés)
  fonctionnent comme avant.
- **Localisation automatique** : plus de saisie manuelle dans les fiches machines. La
  localisation affiche, en lecture seule, le chantier de l'équipe qui détient la machine
  (n° de projet + adresse). Prête à recevoir la future fonction **Transport**.

### 8. App Machinerie (tuile Machinerie) — localisation & équipe automatiques
- Dans la tuile **Machinerie**, la **localisation et l'équipe** de chaque machine se
  mettent à jour **automatiquement** dès qu'une machine est cochée dans une équipe dans
  l'inventaire (onglet Machinerie). Fini la saisie manuelle du déplacement : la machine
  affiche l'équipe et son chantier (n° projet + adresse). Une machine non cochée affiche
  « Non assignée ». Un avis apparaît si une même machine est cochée dans plusieurs équipes.

### 9. Tuile Chat
- La description de la tuile Chat sur l'accueil n'indique plus les photos
  (« Discussion de chantier »).

---

## À faire de ton côté (hors code) avant le déploiement officiel

1. **Faire valider** la politique et l'avis par un avocat travail/vie privée ou la CAI.
2. Obtenir un **mandat écrit** des fondateurs (tu n'es pas président) et désigner
   officiellement le responsable de la protection des renseignements personnels.
3. Régler l'usage des **appareils personnels** (appareils de compagnie ou entente BYOD
   avec compensation des frais).
4. Signer les **ententes de traitement (DPA)** avec Supabase et Vercel; garder une note
   d'ÉFVP au dossier.
5. Compléter dans la politique : **titre du responsable** et **numéro de licence RBQ**.

Rappel : les indications ci-dessus sont de l'information générale, pas un avis juridique.
