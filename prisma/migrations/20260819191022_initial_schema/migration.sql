-- CreateEnum
CREATE TYPE "Veroeffentlichungsstatus" AS ENUM ('ENTWURF', 'VEROEFFENTLICHT', 'ARCHIVIERT');

-- CreateEnum
CREATE TYPE "KontaktanfrageStatus" AS ENUM ('NEU', 'IN_BEARBEITUNG', 'ERLEDIGT');

-- CreateEnum
CREATE TYPE "InhaltsbezugArt" AS ENUM ('KEINER', 'HAUSBOOT', 'LIEGEPLATZ', 'SERVICE', 'STELLENANGEBOT');

-- CreateTable
CREATE TABLE "HausbootAngebot" (
    "id" TEXT NOT NULL,
    "titel" TEXT,
    "standort" TEXT,
    "preis" DECIMAL(65,30),
    "preisHinweis" TEXT,
    "baujahr" TEXT,
    "hersteller" TEXT,
    "zulassung" TEXT,
    "laenge" TEXT,
    "breite" TEXT,
    "rumpftyp" TEXT,
    "bootstyp" TEXT,
    "designKategorie" TEXT,
    "maximaleZuladung" TEXT,
    "anzahlSchlafplaetze" INTEGER,
    "status" "Veroeffentlichungsstatus" NOT NULL DEFAULT 'ENTWURF',
    "hervorgehoben" BOOLEAN NOT NULL DEFAULT false,
    "erstelltAm" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "geaendertAm" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "HausbootAngebot_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "HausbootBild" (
    "id" TEXT NOT NULL,
    "hausbootAngebotId" TEXT NOT NULL,
    "bildReferenz" TEXT NOT NULL,
    "istTitelbild" BOOLEAN NOT NULL DEFAULT false,
    "reihenfolge" INTEGER NOT NULL,
    "altText" TEXT,

    CONSTRAINT "HausbootBild_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "HausbootExposeKategorie" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "reihenfolge" INTEGER NOT NULL,

    CONSTRAINT "HausbootExposeKategorie_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "HausbootExposeEintrag" (
    "id" TEXT NOT NULL,
    "hausbootAngebotId" TEXT NOT NULL,
    "kategorieId" TEXT NOT NULL,
    "bezeichnung" TEXT NOT NULL,
    "beschreibung" TEXT NOT NULL,
    "reihenfolge" INTEGER NOT NULL,

    CONSTRAINT "HausbootExposeEintrag_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "LiegeplatzAngebot" (
    "id" TEXT NOT NULL,
    "titel" TEXT,
    "status" "Veroeffentlichungsstatus" NOT NULL DEFAULT 'ENTWURF',
    "hervorgehoben" BOOLEAN NOT NULL DEFAULT false,
    "erstelltAm" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "geaendertAm" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "LiegeplatzAngebot_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "LiegeplatzBild" (
    "id" TEXT NOT NULL,
    "liegeplatzAngebotId" TEXT NOT NULL,
    "bildReferenz" TEXT NOT NULL,
    "istTitelbild" BOOLEAN NOT NULL DEFAULT false,
    "reihenfolge" INTEGER NOT NULL,
    "altText" TEXT,

    CONSTRAINT "LiegeplatzBild_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ServiceKategorie" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "beschreibung" TEXT,
    "reihenfolge" INTEGER NOT NULL,
    "istAktiv" BOOLEAN NOT NULL DEFAULT true,

    CONSTRAINT "ServiceKategorie_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Service" (
    "id" TEXT NOT NULL,
    "serviceKategorieId" TEXT NOT NULL,
    "titel" TEXT NOT NULL,
    "beschreibung" TEXT NOT NULL,
    "reihenfolge" INTEGER NOT NULL,
    "istAktiv" BOOLEAN NOT NULL DEFAULT true,

    CONSTRAINT "Service_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Stellenangebot" (
    "id" TEXT NOT NULL,
    "titel" TEXT,
    "arbeitgeber" TEXT,
    "arbeitspensum" TEXT,
    "startdatum" DATE,
    "enddatum" DATE,
    "arbeitszeiten" TEXT,
    "beschreibung" TEXT,
    "status" "Veroeffentlichungsstatus" NOT NULL DEFAULT 'ENTWURF',

    CONSTRAINT "Stellenangebot_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "StellenangebotArbeitsort" (
    "id" TEXT NOT NULL,
    "stellenangebotId" TEXT NOT NULL,
    "ort" TEXT NOT NULL,
    "reihenfolge" INTEGER NOT NULL,

    CONSTRAINT "StellenangebotArbeitsort_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "StellenangebotAufgabe" (
    "id" TEXT NOT NULL,
    "stellenangebotId" TEXT NOT NULL,
    "aufgabe" TEXT NOT NULL,
    "reihenfolge" INTEGER NOT NULL,

    CONSTRAINT "StellenangebotAufgabe_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "StellenangebotQualifikation" (
    "id" TEXT NOT NULL,
    "stellenangebotId" TEXT NOT NULL,
    "qualifikation" TEXT NOT NULL,
    "reihenfolge" INTEGER NOT NULL,

    CONSTRAINT "StellenangebotQualifikation_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Bewerbungskontakt" (
    "id" TEXT NOT NULL,
    "stellenangebotId" TEXT NOT NULL,
    "ansprechpartner" TEXT,
    "email" TEXT,
    "telefon" TEXT,
    "whatsapp" TEXT,
    "adresse" TEXT,

    CONSTRAINT "Bewerbungskontakt_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Anfragetyp" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "inhaltsbezugArt" "InhaltsbezugArt" NOT NULL DEFAULT 'KEINER',
    "istAktiv" BOOLEAN NOT NULL DEFAULT true,
    "reihenfolge" INTEGER NOT NULL,

    CONSTRAINT "Anfragetyp_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Kontaktanfrage" (
    "id" TEXT NOT NULL,
    "anfragetypId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "telefon" TEXT,
    "nachricht" TEXT NOT NULL,
    "status" "KontaktanfrageStatus" NOT NULL DEFAULT 'NEU',
    "hausbootAngebotId" TEXT,
    "liegeplatzAngebotId" TEXT,
    "serviceId" TEXT,
    "stellenangebotId" TEXT,
    "erstelltAm" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "geaendertAm" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Kontaktanfrage_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "KontaktanfrageNotiz" (
    "id" TEXT NOT NULL,
    "kontaktanfrageId" TEXT NOT NULL,
    "inhalt" TEXT NOT NULL,
    "erstelltAm" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "KontaktanfrageNotiz_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AdminRolle" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "AdminRolle_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AdminBenutzer" (
    "id" TEXT NOT NULL,
    "adminRolleId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "passwortHash" TEXT NOT NULL,
    "istAktiv" BOOLEAN NOT NULL DEFAULT true,

    CONSTRAINT "AdminBenutzer_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "HausbootBild_hausbootAngebotId_reihenfolge_key" ON "HausbootBild"("hausbootAngebotId", "reihenfolge");

-- CreateIndex
CREATE UNIQUE INDEX "LiegeplatzBild_liegeplatzAngebotId_reihenfolge_key" ON "LiegeplatzBild"("liegeplatzAngebotId", "reihenfolge");

-- CreateIndex
CREATE UNIQUE INDEX "Bewerbungskontakt_stellenangebotId_key" ON "Bewerbungskontakt"("stellenangebotId");

-- CreateIndex
CREATE UNIQUE INDEX "AdminRolle_name_key" ON "AdminRolle"("name");

-- CreateIndex
CREATE UNIQUE INDEX "AdminBenutzer_email_key" ON "AdminBenutzer"("email");

-- AddForeignKey
ALTER TABLE "HausbootBild" ADD CONSTRAINT "HausbootBild_hausbootAngebotId_fkey" FOREIGN KEY ("hausbootAngebotId") REFERENCES "HausbootAngebot"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "HausbootExposeEintrag" ADD CONSTRAINT "HausbootExposeEintrag_hausbootAngebotId_fkey" FOREIGN KEY ("hausbootAngebotId") REFERENCES "HausbootAngebot"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "HausbootExposeEintrag" ADD CONSTRAINT "HausbootExposeEintrag_kategorieId_fkey" FOREIGN KEY ("kategorieId") REFERENCES "HausbootExposeKategorie"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "LiegeplatzBild" ADD CONSTRAINT "LiegeplatzBild_liegeplatzAngebotId_fkey" FOREIGN KEY ("liegeplatzAngebotId") REFERENCES "LiegeplatzAngebot"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Service" ADD CONSTRAINT "Service_serviceKategorieId_fkey" FOREIGN KEY ("serviceKategorieId") REFERENCES "ServiceKategorie"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "StellenangebotArbeitsort" ADD CONSTRAINT "StellenangebotArbeitsort_stellenangebotId_fkey" FOREIGN KEY ("stellenangebotId") REFERENCES "Stellenangebot"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "StellenangebotAufgabe" ADD CONSTRAINT "StellenangebotAufgabe_stellenangebotId_fkey" FOREIGN KEY ("stellenangebotId") REFERENCES "Stellenangebot"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "StellenangebotQualifikation" ADD CONSTRAINT "StellenangebotQualifikation_stellenangebotId_fkey" FOREIGN KEY ("stellenangebotId") REFERENCES "Stellenangebot"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Bewerbungskontakt" ADD CONSTRAINT "Bewerbungskontakt_stellenangebotId_fkey" FOREIGN KEY ("stellenangebotId") REFERENCES "Stellenangebot"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Kontaktanfrage" ADD CONSTRAINT "Kontaktanfrage_anfragetypId_fkey" FOREIGN KEY ("anfragetypId") REFERENCES "Anfragetyp"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Kontaktanfrage" ADD CONSTRAINT "Kontaktanfrage_hausbootAngebotId_fkey" FOREIGN KEY ("hausbootAngebotId") REFERENCES "HausbootAngebot"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Kontaktanfrage" ADD CONSTRAINT "Kontaktanfrage_liegeplatzAngebotId_fkey" FOREIGN KEY ("liegeplatzAngebotId") REFERENCES "LiegeplatzAngebot"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Kontaktanfrage" ADD CONSTRAINT "Kontaktanfrage_serviceId_fkey" FOREIGN KEY ("serviceId") REFERENCES "Service"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Kontaktanfrage" ADD CONSTRAINT "Kontaktanfrage_stellenangebotId_fkey" FOREIGN KEY ("stellenangebotId") REFERENCES "Stellenangebot"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "KontaktanfrageNotiz" ADD CONSTRAINT "KontaktanfrageNotiz_kontaktanfrageId_fkey" FOREIGN KEY ("kontaktanfrageId") REFERENCES "Kontaktanfrage"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AdminBenutzer" ADD CONSTRAINT "AdminBenutzer_adminRolleId_fkey" FOREIGN KEY ("adminRolleId") REFERENCES "AdminRolle"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- Ensure that a contact inquiry has no more than one concrete content reference.
ALTER TABLE "Kontaktanfrage"
ADD CONSTRAINT "Kontaktanfrage_maximal_ein_inhaltsbezug"
CHECK (
  num_nonnulls(
    "hausbootAngebotId",
    "liegeplatzAngebotId",
    "serviceId",
    "stellenangebotId"
  ) <= 1
);

-- Ensure that the optional content reference matches the reference kind of its inquiry type.
CREATE FUNCTION "pruefe_kontaktanfrage_inhaltsbezug"()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
DECLARE
  erlaubte_bezugsart "InhaltsbezugArt";
  gesetzte_bezugsart "InhaltsbezugArt";
BEGIN
  SELECT "inhaltsbezugArt"
  INTO erlaubte_bezugsart
  FROM "Anfragetyp"
  WHERE "id" = NEW."anfragetypId";

  IF NEW."hausbootAngebotId" IS NOT NULL THEN
    gesetzte_bezugsart := 'HAUSBOOT';
  ELSIF NEW."liegeplatzAngebotId" IS NOT NULL THEN
    gesetzte_bezugsart := 'LIEGEPLATZ';
  ELSIF NEW."serviceId" IS NOT NULL THEN
    gesetzte_bezugsart := 'SERVICE';
  ELSIF NEW."stellenangebotId" IS NOT NULL THEN
    gesetzte_bezugsart := 'STELLENANGEBOT';
  END IF;

  IF erlaubte_bezugsart = 'KEINER' AND gesetzte_bezugsart IS NOT NULL THEN
    RAISE EXCEPTION 'Der Anfragetyp erlaubt keinen Inhaltsbezug.';
  END IF;

  IF gesetzte_bezugsart IS NOT NULL AND gesetzte_bezugsart <> erlaubte_bezugsart THEN
    RAISE EXCEPTION 'Der Inhaltsbezug passt nicht zur Bezugsart des Anfragetyps.';
  END IF;

  RETURN NEW;
END;
$$;

CREATE TRIGGER "Kontaktanfrage_bezugsart_pruefen"
BEFORE INSERT OR UPDATE OF
  "anfragetypId",
  "hausbootAngebotId",
  "liegeplatzAngebotId",
  "serviceId",
  "stellenangebotId"
ON "Kontaktanfrage"
FOR EACH ROW
EXECUTE FUNCTION "pruefe_kontaktanfrage_inhaltsbezug"();

-- Prevent changing an inquiry type to a reference kind that conflicts with existing inquiries.
CREATE FUNCTION "pruefe_anfragetyp_bezugsart_aenderung"()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
BEGIN
  IF EXISTS (
    SELECT 1
    FROM "Kontaktanfrage"
    WHERE "anfragetypId" = NEW."id"
      AND (
        (NEW."inhaltsbezugArt" = 'KEINER' AND num_nonnulls(
          "hausbootAngebotId",
          "liegeplatzAngebotId",
          "serviceId",
          "stellenangebotId"
        ) <> 0)
        OR (NEW."inhaltsbezugArt" = 'HAUSBOOT' AND (
          "liegeplatzAngebotId" IS NOT NULL
          OR "serviceId" IS NOT NULL
          OR "stellenangebotId" IS NOT NULL
        ))
        OR (NEW."inhaltsbezugArt" = 'LIEGEPLATZ' AND (
          "hausbootAngebotId" IS NOT NULL
          OR "serviceId" IS NOT NULL
          OR "stellenangebotId" IS NOT NULL
        ))
        OR (NEW."inhaltsbezugArt" = 'SERVICE' AND (
          "hausbootAngebotId" IS NOT NULL
          OR "liegeplatzAngebotId" IS NOT NULL
          OR "stellenangebotId" IS NOT NULL
        ))
        OR (NEW."inhaltsbezugArt" = 'STELLENANGEBOT' AND (
          "hausbootAngebotId" IS NOT NULL
          OR "liegeplatzAngebotId" IS NOT NULL
          OR "serviceId" IS NOT NULL
        ))
      )
  ) THEN
    RAISE EXCEPTION 'Die Bezugsart kann nicht geändert werden, weil bestehende Kontaktanfragen nicht dazu passen.';
  END IF;

  RETURN NEW;
END;
$$;

CREATE TRIGGER "Anfragetyp_bezugsart_aenderung_pruefen"
BEFORE UPDATE OF "inhaltsbezugArt"
ON "Anfragetyp"
FOR EACH ROW
EXECUTE FUNCTION "pruefe_anfragetyp_bezugsart_aenderung"();
