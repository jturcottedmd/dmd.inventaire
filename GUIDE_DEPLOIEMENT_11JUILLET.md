# Déploiement — Maçonnerie DMD · Mises à jour du 11 juillet 2026

Récapitulatif de **tout ce qui a été fait** dans cette session, avec les étapes pour déployer.

---

## A. Ce qui a été modifié (résumé)

| # | Modification | Fichier(s) touché(s) |
|---|---|---|
| 1 | Retrait du bouton « 👤 Identification » dans l'en-tête de l'inventaire | `APPLI__INVENTAIRE.html` |
| 2 | **Nouvelle tuile Formations** (en cours / en attente) + création admin | `APPLI__FORMATIONS.html` *(nouveau)*, `index.html` |
| 3 | **Pop-up de rappel** de formation à l'accueil (jusqu'à la fin de la formation) | `index.html` |
| 4 | **Optimisations de charge** (chat 7 s + pause en arrière-plan, caches 60 s) | `APPLI__CHAT.html`, `index.html` |
| 5 | **Nouvel onglet « Accessoire Fraco »** (accessoires Fraco + rack gris extraits de Machinerie) | `APPLI__INVENTAIRE.html` |
| 6 | **Filtrage par équipe** dans la tuile Machinerie (chacun voit son chantier, admin voit tout) | `APPLI__MACHINERIE.html` |

**Fichiers à mettre à jour sur GitHub :** `index.html`, `APPLI__CHAT.html`, `APPLI__INVENTAIRE.html`, `APPLI__MACHINERIE.html`, et **ajouter** `APPLI__FORMATIONS.html`.

**Fichiers inchangés (ne pas toucher) :** `APPLI__FACTURES.html`, `APPLI__INFOS.html`, `APPLI__POLITIQUES.html`.

---

## B. Étape 1 — GitHub

Pour chaque fichier modifié : ouvre-le dans ton dépôt → crayon ✏️ → colle le nouveau contenu → « Commit changes ».
Pour le nouveau fichier `APPLI__FORMATIONS.html` : « Add file » → « Upload files » → dépose-le → commit.

Vercel redéploie automatiquement (~1 min après le push).

---

## C. Étape 2 — Supabase (le « code SQL » à passer)

**Une seule fois**, pour accélérer l'app sous forte charge :

1. supabase.com → projet **DMD-INVENTAIRE**.
2. Menu **SQL Editor** → **New query**.
3. Colle le contenu de **`OPTIMISATION_SUPABASE.sql`** (inclus dans ce dossier).
4. **Run**.

C'est sans risque : ça ajoute seulement un index, ça ne modifie ni ne supprime aucune donnée.

> Note : lors de la vérification d'aujourd'hui, la base était en bon état (aucun problème de performance signalé). Deux avertissements de sécurité existent (politique d'accès permissive sur `inv_store`, et protection mots de passe compromis désactivée) — non bloquants, à considérer plus tard si tu veux resserrer la sécurité.

---

## D. Étape 3 — Vérifications après déploiement

**Formations**
- [ ] La tuile Formations apparaît sur l'accueil.
- [ ] En mode admin : bouton « ＋ Nouvelle formation », création avec employé·s, type, endroit, dates, notes.
- [ ] Formation à ton nom + date de fin future → reconnexion → le pop-up apparaît.
- [ ] « Ne plus afficher aujourd'hui » masque le pop-up pour la journée (revient le lendemain).

**Inventaire**
- [ ] Le bouton « 👤 Identification » de l'en-tête n'est plus là.
- [ ] Nouvel onglet **Accessoire Fraco** présent, avec accessoires + rack gris.
- [ ] Onglet Machinerie garde les machines Fraco F01–F06.
- [ ] (À valider) La Grue FRK 2025 (G01) se trouve dans Accessoire Fraco — dis-moi si tu la veux plutôt dans Machinerie.

**Machinerie**
- [ ] Un utilisateur non-admin ne voit que la machinerie de son équipe.
- [ ] Sans équipe choisie : message invitant à choisir son équipe dans l'inventaire.
- [ ] En mode admin : toutes les machines visibles.

---

## E. Test de charge (rappel)

Le vrai test « 100 utilisateurs » demande l'outil **k6** lancé depuis un **ordinateur** (pas possible depuis un cellulaire, et je ne peux pas simuler une vraie charge moi-même). Ce qui a été fait de concret aujourd'hui : vérification directe de l'état de la base Supabase (saine) et optimisations du code aux points sensibles. Quand tu auras un ordinateur, demande-moi le script k6 et tu obtiendras de vrais chiffres (temps de réponse, p95, taux d'erreur).

---

## F. Rappel — mode admin
La création de formations, le pop-up et la vue complète de la machinerie dépendent du **mode admin** de l'appareil (`inv:isAdmin`), déjà utilisé ailleurs dans l'app.
