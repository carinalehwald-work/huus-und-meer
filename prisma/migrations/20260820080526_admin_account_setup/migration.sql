-- AlterTable
ALTER TABLE "AdminBenutzer" ADD COLUMN     "einrichtungscodeHash" TEXT,
ADD COLUMN     "einrichtungscodeLaeuftAb" TIMESTAMP(3),
ADD COLUMN     "einrichtungscodeVerwendetAm" TIMESTAMP(3),
ALTER COLUMN "passwortHash" DROP NOT NULL;
