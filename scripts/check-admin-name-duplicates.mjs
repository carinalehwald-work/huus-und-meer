import "dotenv/config";
import pg from "pg";

const pool = new pg.Pool({ connectionString: process.env.DATABASE_URL });
const sql = `
  SELECT 'Hausboot' AS rubrik, lower(regexp_replace(btrim("titel"), '\\s+', ' ', 'g')) AS name, count(*)::int AS anzahl
  FROM "HausbootAngebot" WHERE "titel" IS NOT NULL GROUP BY 2 HAVING count(*) > 1
  UNION ALL
  SELECT 'Liegeplatz', lower(regexp_replace(btrim("titel"), '\\s+', ' ', 'g')), count(*)::int
  FROM "LiegeplatzAngebot" WHERE "titel" IS NOT NULL GROUP BY 2 HAVING count(*) > 1
  UNION ALL
  SELECT 'Stellenangebot', lower(regexp_replace(btrim("titel"), '\\s+', ' ', 'g')), count(*)::int
  FROM "Stellenangebot" WHERE "titel" IS NOT NULL GROUP BY 2 HAVING count(*) > 1
  UNION ALL
  SELECT 'Service', lower(regexp_replace(btrim("titel"), '\\s+', ' ', 'g')), count(*)::int
  FROM "Service" GROUP BY 2 HAVING count(*) > 1
  UNION ALL
  SELECT 'ServiceKategorie', lower(regexp_replace(btrim("name"), '\\s+', ' ', 'g')), count(*)::int
  FROM "ServiceKategorie" GROUP BY 2 HAVING count(*) > 1
  UNION ALL
  SELECT 'HausbootExposeKategorie', lower(regexp_replace(btrim("name"), '\\s+', ' ', 'g')), count(*)::int
  FROM "HausbootExposeKategorie" GROUP BY 2 HAVING count(*) > 1
`;

try {
  const result = await pool.query(sql);
  console.log(JSON.stringify(result.rows));
  const services = await pool.query(`
    SELECT s."id", s."titel", k."name" AS "kategorie"
    FROM "Service" s
    JOIN "ServiceKategorie" k ON k."id" = s."serviceKategorieId"
    WHERE lower(regexp_replace(btrim(s."titel"), '\\s+', ' ', 'g')) = 'online-werbung'
    ORDER BY k."name", s."id"
  `);
  console.log(JSON.stringify(services.rows));
} finally {
  await pool.end();
}
