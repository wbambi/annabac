-- Schéma de la file de modération (Cloudflare D1).
-- Appliquer avec :
--   wrangler d1 execute annabac --remote --file=schema.sql

CREATE TABLE IF NOT EXISTS submissions (
  id            TEXT PRIMARY KEY,          -- identifiant unique (uuid)
  created_at    TEXT NOT NULL,             -- ISO 8601
  annee         INTEGER NOT NULL,
  serie         TEXT NOT NULL,
  matiere       TEXT NOT NULL,
  session       TEXT NOT NULL,
  sujet_key     TEXT,                       -- clé R2 du PDF sujet (ou NULL)
  corrige_key   TEXT,                       -- clé R2 du PDF corrigé (ou NULL)
  contributor   TEXT,                       -- e-mail du contributeur (optionnel)
  ip_hash       TEXT,                       -- IP hachée (SHA-256) pour anti-abus, jamais en clair
  status        TEXT NOT NULL DEFAULT 'pending', -- pending | approved | rejected
  decided_at    TEXT,
  decided_by    TEXT,                       -- e-mail de l'admin ayant décidé
  note          TEXT                        -- raison de rejet / commentaire
);

CREATE INDEX IF NOT EXISTS idx_submissions_status
  ON submissions (status, created_at);

-- Anti-abus : compter les soumissions récentes d'une même IP (hachée).
CREATE INDEX IF NOT EXISTS idx_submissions_ip
  ON submissions (ip_hash, created_at);

-- Migration d'une base existante (colonne ajoutée après coup) :
--   ALTER TABLE submissions ADD COLUMN ip_hash TEXT;
