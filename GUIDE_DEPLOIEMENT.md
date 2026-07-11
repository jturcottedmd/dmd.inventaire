# Déploiement — Mise à jour Maçonnerie DMD

Guide pour mettre en ligne la version optimisée + la nouvelle tuile **Formations**.

---

## 1. Fichiers à remplacer sur GitHub

Remplace ces **3 fichiers existants** par les versions fournies :

| Fichier | Ce qui change |
|---|---|
| `index.html` | Nouvelle tuile Formations dans la grille · pop-up rappel de formation · cache liste employés (60 s) |
| `APPLI__CHAT.html` | Poll allégé (7 s), suspendu en arrière-plan, relancé au retour · pastilles autres canaux 1 tour sur 3 |
| `APPLI__INVENTAIRE.html` | Bouton « 👤 Identification » de l'en-tête retiré |

Et **ajoute ce nouveau fichier** :

| Fichier | Rôle |
|---|---|
| `APPLI__FORMATIONS.html` | La nouvelle tuile Formations (en cours / en attente) |

> ⚠️ **Ne touche pas** aux autres fichiers : `APPLI__FACTURES.html`, `APPLI__INFOS.html`, `APPLI__MACHINERIE.html`, `APPLI__POLITIQUES.html`. Ils n'ont pas changé.

### Comment faire (au choix)
- **Site GitHub (le plus simple)** : ouvre ton dépôt → pour chaque fichier existant, clique dessus puis l'icône crayon ✏️ → colle le nouveau contenu → « Commit changes ». Pour le nouveau fichier : « Add file » → « Upload files » → dépose `APPLI__FORMATIONS.html` → commit.
- **GitHub Desktop / glisser-déposer** : remplace les fichiers dans ton dossier local, ajoute le nouveau, puis commit + push.

---

## 2. Base de données Supabase — 1 commande à passer

Cette étape rend **toute l'app plus rapide** sous forte charge (ton test à 60 utilisateurs).

1. Va sur **supabase.com** → ton projet.
2. Menu de gauche : **SQL Editor** → **New query**.
3. Colle le contenu du fichier **`OPTIMISATION_SUPABASE.sql`** (fourni).
4. Clique **Run** (ou Ctrl/Cmd + Entrée).

C'est à faire **une seule fois**. Tu devrais voir « Success ». (Détail technique : ça crée un index sur la colonne `key` de la table `inv_store`.)

---

## 3. Vérification après déploiement (Vercel se met à jour tout seul)

Vercel redéploie automatiquement après ton push GitHub (~1 min). Ensuite, ouvre l'app et vérifie :

- [ ] La tuile **Formations** apparaît sur l'accueil.
- [ ] En **mode admin**, tu vois le bouton « ＋ Nouvelle formation » et tu peux créer une formation (type, endroit, dates, employé·s, notes).
- [ ] Crée une formation à **ton propre nom** avec une date de fin dans le futur → **déconnexion / reconnexion** → le **pop-up** doit apparaître sur l'accueil.
- [ ] Bouton **« Ne plus afficher aujourd'hui »** → le pop-up ne revient pas de la journée (mais reviendra demain).
- [ ] Le **chat** fonctionne toujours normalement.
- [ ] Dans l'**inventaire**, le bouton « 👤 Identification » de l'en-tête n'est plus là (les boutons 🧱 Matériel / ⬇ Excel restent à droite).

---

## 4. Pour ton test de charge (60 utilisateurs)

Une fois les 3 étapes faites, tu peux lancer le test. Points de repère :
- L'accueil et l'identification doivent être quasi instantanés (l'identité s'enregistre en local avant le réseau).
- Sur mauvaise connexion, un écran peut mettre quelques secondes mais ne doit **pas** figer (protections de délai en place).
- Le chat se rafraîchit toutes les 7 s quand il est ouvert, et se met en pause quand l'app est en arrière-plan.

---

### Rappel — rôle admin
La création de formations et le pop-up dépendent du **mode admin** de l'appareil (déjà utilisé ailleurs dans l'app). Assure-toi que ton appareil est en mode admin pour voir le bouton d'ajout.
