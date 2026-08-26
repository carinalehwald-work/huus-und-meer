ALTER TABLE "Stellenangebot" ADD COLUMN "bewerbungskontaktId" TEXT;

UPDATE "Stellenangebot" AS job
SET "bewerbungskontaktId" = contact."id"
FROM "Bewerbungskontakt" AS contact
WHERE contact."stellenangebotId" = job."id";

ALTER TABLE "Stellenangebot"
ADD CONSTRAINT "Stellenangebot_bewerbungskontaktId_fkey"
FOREIGN KEY ("bewerbungskontaktId") REFERENCES "Bewerbungskontakt"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

ALTER TABLE "Bewerbungskontakt" DROP CONSTRAINT "Bewerbungskontakt_stellenangebotId_fkey";
ALTER TABLE "Bewerbungskontakt" DROP COLUMN "stellenangebotId";
