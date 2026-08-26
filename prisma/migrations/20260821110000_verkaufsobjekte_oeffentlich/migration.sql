ALTER TYPE "Veroeffentlichungsstatus" ADD VALUE IF NOT EXISTS 'VERKAUFT';

ALTER TABLE "HausbootAngebot"
  ADD COLUMN "slug" TEXT,
  ADD COLUMN "beschreibung" TEXT,
  ADD COLUMN "hafen" TEXT,
  ADD COLUMN "liegeplatz" TEXT,
  ADD COLUMN "wohnflaeche" TEXT;

ALTER TABLE "LiegeplatzAngebot"
  ADD COLUMN "slug" TEXT,
  ADD COLUMN "beschreibung" TEXT,
  ADD COLUMN "standort" TEXT,
  ADD COLUMN "hafen" TEXT,
  ADD COLUMN "preis" DECIMAL,
  ADD COLUMN "preisHinweis" TEXT,
  ADD COLUMN "laenge" TEXT,
  ADD COLUMN "breite" TEXT,
  ADD COLUMN "moeglicheBootsgroesse" TEXT,
  ADD COLUMN "besonderheiten" TEXT;

UPDATE "HausbootAngebot" SET "slug" = 'hausboot-' || "id" WHERE "slug" IS NULL;
UPDATE "LiegeplatzAngebot" SET "slug" = 'liegeplatz-' || "id" WHERE "slug" IS NULL;

ALTER TABLE "HausbootAngebot" ALTER COLUMN "slug" SET NOT NULL;
ALTER TABLE "LiegeplatzAngebot" ALTER COLUMN "slug" SET NOT NULL;
CREATE UNIQUE INDEX "HausbootAngebot_slug_key" ON "HausbootAngebot"("slug");
CREATE UNIQUE INDEX "LiegeplatzAngebot_slug_key" ON "LiegeplatzAngebot"("slug");
