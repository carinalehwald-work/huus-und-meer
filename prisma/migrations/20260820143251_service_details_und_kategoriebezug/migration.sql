-- AlterTable
ALTER TABLE "Kontaktanfrage" ADD COLUMN     "serviceKategorieName" TEXT;

-- AlterTable
ALTER TABLE "Service" ADD COLUMN     "details" TEXT[] DEFAULT ARRAY[]::TEXT[];
