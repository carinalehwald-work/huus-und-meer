-- CreateEnum
CREATE TYPE "BewerbungsStatus" AS ENUM ('NEU', 'IN_BEARBEITUNG', 'ERLEDIGT');

-- CreateTable
CREATE TABLE "Bewerbung" (
    "id" TEXT NOT NULL,
    "stellenangebotId" TEXT NOT NULL,
    "vorname" TEXT NOT NULL,
    "nachname" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "telefon" TEXT,
    "bewerbungstext" TEXT NOT NULL,
    "status" "BewerbungsStatus" NOT NULL DEFAULT 'NEU',
    "erstelltAm" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "geaendertAm" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Bewerbung_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "BewerbungsUnterlage" (
    "id" TEXT NOT NULL,
    "bewerbungId" TEXT NOT NULL,
    "dateiname" TEXT NOT NULL,
    "mimeType" TEXT NOT NULL,
    "dateigroesse" INTEGER NOT NULL,
    "dateireferenz" TEXT NOT NULL,
    "erstelltAm" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "BewerbungsUnterlage_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Bewerbung" ADD CONSTRAINT "Bewerbung_stellenangebotId_fkey" FOREIGN KEY ("stellenangebotId") REFERENCES "Stellenangebot"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BewerbungsUnterlage" ADD CONSTRAINT "BewerbungsUnterlage_bewerbungId_fkey" FOREIGN KEY ("bewerbungId") REFERENCES "Bewerbung"("id") ON DELETE CASCADE ON UPDATE CASCADE;
