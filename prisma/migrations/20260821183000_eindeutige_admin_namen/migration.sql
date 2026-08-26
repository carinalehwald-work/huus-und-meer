ALTER TABLE "HausbootAngebot" ADD COLUMN "titelNormalisiert" TEXT;
ALTER TABLE "LiegeplatzAngebot" ADD COLUMN "titelNormalisiert" TEXT;
ALTER TABLE "Stellenangebot" ADD COLUMN "titelNormalisiert" TEXT;
ALTER TABLE "ServiceKategorie" ADD COLUMN "nameNormalisiert" TEXT;
ALTER TABLE "Service" ADD COLUMN "titelNormalisiert" TEXT;
ALTER TABLE "HausbootExposeKategorie" ADD COLUMN "nameNormalisiert" TEXT;

UPDATE "HausbootAngebot"
SET "titelNormalisiert" = lower(regexp_replace(btrim("titel"), '\s+', ' ', 'g'))
WHERE "titel" IS NOT NULL;

UPDATE "LiegeplatzAngebot"
SET "titelNormalisiert" = lower(regexp_replace(btrim("titel"), '\s+', ' ', 'g'))
WHERE "titel" IS NOT NULL;

UPDATE "Stellenangebot"
SET "titelNormalisiert" = lower(regexp_replace(btrim("titel"), '\s+', ' ', 'g'))
WHERE "titel" IS NOT NULL;

UPDATE "ServiceKategorie"
SET "nameNormalisiert" = lower(regexp_replace(btrim("name"), '\s+', ' ', 'g'));

UPDATE "Service"
SET "titelNormalisiert" = lower(regexp_replace(btrim("titel"), '\s+', ' ', 'g'));

UPDATE "HausbootExposeKategorie"
SET "nameNormalisiert" = lower(regexp_replace(btrim("name"), '\s+', ' ', 'g'));

ALTER TABLE "ServiceKategorie" ALTER COLUMN "nameNormalisiert" SET NOT NULL;
ALTER TABLE "Service" ALTER COLUMN "titelNormalisiert" SET NOT NULL;
ALTER TABLE "HausbootExposeKategorie" ALTER COLUMN "nameNormalisiert" SET NOT NULL;

CREATE UNIQUE INDEX "HausbootAngebot_titelNormalisiert_key" ON "HausbootAngebot"("titelNormalisiert");
CREATE UNIQUE INDEX "LiegeplatzAngebot_titelNormalisiert_key" ON "LiegeplatzAngebot"("titelNormalisiert");
CREATE UNIQUE INDEX "Stellenangebot_titelNormalisiert_key" ON "Stellenangebot"("titelNormalisiert");
CREATE UNIQUE INDEX "ServiceKategorie_nameNormalisiert_key" ON "ServiceKategorie"("nameNormalisiert");
CREATE UNIQUE INDEX "Service_serviceKategorieId_titelNormalisiert_key" ON "Service"("serviceKategorieId", "titelNormalisiert");
CREATE UNIQUE INDEX "HausbootExposeKategorie_nameNormalisiert_key" ON "HausbootExposeKategorie"("nameNormalisiert");
