-- ============================================================
--  MAÇONNERIE DMD — Optimisation base de données (Supabase)
--  À exécuter UNE SEULE FOIS dans : Supabase → SQL Editor → New query
-- ============================================================

-- 1) Index sur la colonne "key" de la table inv_store.
--    Accélère toutes les recherches par préfixe (chat, factures,
--    répertoire, machinerie, formations…) qui utilisent LIKE 'prefixe%'.
--    "text_pattern_ops" est ce qui rend les recherches LIKE 'xxx%' rapides.
CREATE INDEX IF NOT EXISTS idx_inv_store_key_pattern
  ON inv_store (key text_pattern_ops);

-- 2) (Recommandé) Statistiques à jour pour que Postgres utilise bien l'index.
ANALYZE inv_store;

-- ============================================================
--  VÉRIFICATION (optionnel) — pour confirmer que l'index existe :
--    SELECT indexname FROM pg_indexes WHERE tablename = 'inv_store';
--  Tu devrais voir "idx_inv_store_key_pattern" dans la liste.
-- ============================================================
