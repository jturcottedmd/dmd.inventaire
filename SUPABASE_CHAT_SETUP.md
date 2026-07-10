# Configuration Supabase pour le Chat — Maçonnerie DMD

L'app de chat (`APPLI__CHAT.html`) enregistre les **messages** dans la table existante `inv_store`
(aucune configuration à faire) et les **photos** dans un **bucket Supabase Storage** appelé `chat-photos`.
Cette étape est à faire **une seule fois** dans le tableau de bord Supabase.

> Rappel : l'app se connecte avec le compte partagé (`signInWithPassword`), donc les utilisateurs
> sont en rôle **`authenticated`**. Les politiques ci-dessous ciblent ce rôle.

---

## 1. Créer le bucket

1. Dans Supabase → **Storage** → **New bucket**.
2. Nom exact : **`chat-photos`**
3. **Public bucket : activé** (les photos s'affichent alors directement via leur URL dans le fil).
4. (Optionnel) *File size limit* : ex. `15 MB` — l'app compresse déjà à ~2560 px / qualité 0,9,
   donc les fichiers font généralement 200 Ko à 1,5 Mo.
5. Créer.

> **Confidentialité** : un bucket public signifie que quiconque possède le lien exact d'une photo
> peut l'ouvrir (les liens sont difficiles à deviner, mais publics). C'est le plus simple et
> convient à un chat de chantier interne. Pour du privé strict, on passera à des *signed URLs*
> (je peux adapter le code plus tard).

---

## 2. Politiques d'accès (Storage → Policies, ou SQL Editor)

Colle ceci dans **SQL Editor** puis **Run** :

```sql
-- Envoi de photos par les utilisateurs connectés (compte partagé)
create policy "chat_photos_insert"
  on storage.objects for insert
  to authenticated
  with check ( bucket_id = 'chat-photos' );

-- Lecture des photos par les utilisateurs connectés
create policy "chat_photos_select"
  on storage.objects for select
  to authenticated
  using ( bucket_id = 'chat-photos' );

-- (Optionnel) permettre à l'admin de supprimer une photo plus tard
create policy "chat_photos_delete"
  on storage.objects for delete
  to authenticated
  using ( bucket_id = 'chat-photos' );
```

Comme le bucket est **public**, la lecture via `<img src>` fonctionne aussi sans être connecté ;
la politique `select` ci-dessus couvre les accès faits par le client connecté.

---

## 3. Table des messages (déjà en place)

Les messages sont stockés dans `inv_store` (même table que le reste de l'app), une ligne par message :

- **clé** : `chat:<canal>:<horodatage ISO>_<aléatoire>` (triable par ordre chronologique)
- **valeur** : JSON `{ id, ch, author, deviceId, text, photo:{url,path,w,h}, ts }`

L'app charge les 40 messages les plus récents et rafraîchit toutes les 4 secondes.
Aucune migration nécessaire. Assure-toi seulement que la policy RLS existante d'`inv_store`
autorise `insert`/`select` pour le rôle `authenticated` (c'est déjà le cas puisque l'inventaire
et les autres apps écrivent dedans).

---

## 4. Notes d'échelle et de coûts (des milliers de photos)

- **Compression** : chaque photo est ré-encodée en JPEG (max 2560 px, qualité 0,9) avant l'envoi.
  On garde la netteté pour lire/zoomer, tout en évitant les fichiers de 5–10 Mo.
- **Estimation** : ~0,3–1 Mo par photo → **1 000 photos ≈ 0,3–1 Go**, **10 000 ≈ 3–10 Go**.
- **Plan Supabase** : le plan gratuit inclut 1 Go de Storage. Pour des milliers de photos, prévois
  le plan **Pro** (100 Go inclus, puis facturation à l'usage) — ce que tu envisageais déjà.
- **Bande passante** : l'affichage des photos consomme de l'egress ; le plan Pro inclut un quota
  généreux. On pourra ajouter plus tard des **vignettes** (petites images pour le fil, pleine
  résolution seulement au zoom) pour réduire fortement la bande passante quand le volume montera.
- **Rétention** : si un jour tu veux purger les vieilles photos, on pourra ajouter une règle
  (ex. archivage après X mois). Rien n'est supprimé automatiquement pour l'instant.

---

## 5. Vérification rapide

1. Déploie les fichiers (GitHub → Vercel).
2. Ouvre la tuile **Chat**, écris un message → il apparaît et persiste après rechargement.
3. Touche 📷, prends une photo → elle s'envoie, s'affiche dans le fil, et se zoome en plein écran.
4. Depuis un autre appareil/compte, ouvre le même canal → le message et la photo apparaissent.

Si l'envoi de photo échoue avec un message parlant du bucket, c'est que l'étape 1 ou 2 n'est pas
encore faite. Les messages **texte** fonctionnent même sans le bucket.
