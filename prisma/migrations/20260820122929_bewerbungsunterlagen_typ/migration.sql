-- CreateEnum
CREATE TYPE "BewerbungsUnterlagenTyp" AS ENUM ('LEBENSLAUF', 'SONSTIGE_UNTERLAGE');

-- AlterTable
ALTER TABLE "BewerbungsUnterlage" ADD COLUMN     "typ" "BewerbungsUnterlagenTyp" NOT NULL DEFAULT 'SONSTIGE_UNTERLAGE';
