# Huus & Meer

Website für Huus & Meer an der Ostsee (Fehmarn). Die Seite richtet sich an zwei
Zielgruppen: **Urlauber/innen** (Hausbootsuche, Buchung, Kurtaxe) und
**Eigentümer/innen** (Verkauf von Hausbooten und Liegeplätzen, Serviceleistungen).
Zusätzlich gibt es einen geschützten **Admin-Bereich** zur Pflege von Angeboten,
Stammdaten, Kontaktanfragen und Stellenangeboten.

## Tech Stack

- [Next.js](https://nextjs.org) 16 (App Router)
- [React](https://react.dev) 19
- TypeScript
- [Tailwind CSS](https://tailwindcss.com) 4
- [Prisma](https://www.prisma.io) 7 (`@prisma/client`, `@prisma/adapter-pg`)
- PostgreSQL
- [NextAuth](https://next-auth.js.org) 4 (Credentials Provider) für die Admin-Authentifizierung

## Voraussetzungen

- Node.js — Version 24 empfohlen (siehe Hinweis unter [Wichtige Hinweise](#wichtige-hinweise))
- npm
- eine lokal erreichbare PostgreSQL-Datenbank

## Installation

```bash
npm install
```

`npm install` führt automatisch `prisma generate` aus (`postinstall`-Script) und
erzeugt den Prisma Client unter `generated/prisma`.

Anschließend die Umgebungsvariablen einrichten:

```bash
cp .env.example .env.local
```

Werte in `.env.local` an die eigene Umgebung anpassen (siehe
[Environment Variables](#environment-variables)).

Danach die Datenbank-Migrationen anwenden:

```bash
npx prisma migrate deploy
```

Optional einen ersten Admin-Zugang anlegen (siehe [Admin-Bereich](#admin-bereich)):

```bash
npm run admin:create
```

## Environment Variables

Alle Variablen sind in [.env.example](.env.example) dokumentiert.

| Variable | Beschreibung |
| --- | --- |
| `DATABASE_URL` | PostgreSQL-Verbindungsstring (Prisma-Format), siehe [prisma/schema.prisma](prisma/schema.prisma) |
| `NEXTAUTH_SECRET` | Signierschlüssel für NextAuth-Sitzungen/JWTs, siehe [lib/auth.ts](lib/auth.ts) |
| `NEXTAUTH_URL` | Basis-URL der Anwendung, von NextAuth für Callback-URLs benötigt |

`NEXTAUTH_SECRET` muss in jeder produktiven Umgebung ein eigenes, sicheres
Zufalls-Secret sein, z. B. erzeugt mit:

```bash
openssl rand -base64 32
```

Der in `.env.example` hinterlegte Wert ist nur ein Platzhalter und **kein**
gültiges Secret.

## Datenbank

Die Anwendung benötigt eine PostgreSQL-Datenbank und greift ausschließlich
serverseitig über Prisma darauf zu (siehe [lib/prisma.ts](lib/prisma.ts)).
Alle Schemaänderungen liegen als nachvollziehbare Migrationen unter
[prisma/migrations](prisma/migrations).

Migrationen anwenden:

```bash
npx prisma migrate deploy
```

Das Datenmodell (Schema) befindet sich in
[prisma/schema.prisma](prisma/schema.prisma).

## Admin-Bereich

Der Admin-Bereich ist unter `/admin` erreichbar und serverseitig über
NextAuth/Middleware geschützt (siehe [proxy.ts](proxy.ts) und
[lib/auth.ts](lib/auth.ts)).

Ein erster Admin-Zugang wird über folgendes Skript angelegt:

```bash
npm run admin:create
```

Das Skript fragt die nötigen Angaben interaktiv ab. Zugangsdaten werden nicht
in diesem Repository hinterlegt.

## Entwicklung

```bash
npm run dev
```

Die Anwendung ist danach unter `http://localhost:3000` erreichbar.

## Build

```bash
npm run build
npm run start
```

## Projektstruktur

| Verzeichnis | Inhalt |
| --- | --- |
| `app/` | Next.js App-Router-Routen (öffentliche Seiten, Admin-Bereich, API-Routen) |
| `components/` | Wiederverwendbare UI- und Bereichs-Komponenten |
| `lib/` | Server-seitige Utilities (Prisma-Client, Auth, Validierungen) |
| `prisma/` | Prisma-Schema und Migrationen |
| `public/` | Statische Assets (Bilder, Icons) |
| `docs/` | Fachliche und technische Projektdokumentation |
| `scripts/` | Node-Skripte für administrative Aufgaben (z. B. Admin-Anlage) |

## Uploads

`storage/` und `public/uploads/` enthalten ausschließlich Laufzeitdaten
(Bewerbungsunterlagen bzw. hochgeladene Bilder aus dem Admin-Bereich) und sind
**nicht** Teil dieses Repositories. Beide Verzeichnisse werden bei Bedarf
automatisch zur Laufzeit angelegt und über `.gitignore` ausgeschlossen.

## Dokumentation

Ausführlichere fachliche und technische Dokumentation befindet sich unter
[docs/admin](docs/admin):

- [ADMIN-PLAN.md](docs/admin/ADMIN-PLAN.md) — fachlicher Plan des Admin-Bereichs
- [DATA-MODEL.md](docs/admin/DATA-MODEL.md) — fachliches Datenmodell
- [TECHNICAL-ARCHITECTURE.md](docs/admin/TECHNICAL-ARCHITECTURE.md) — technischer Architekturplan
- [TECHNICAL-DECISIONS.md](docs/admin/TECHNICAL-DECISIONS.md) — technische Entscheidungen
- [V1-DECISIONS.md](docs/admin/V1-DECISIONS.md) — verbindliche fachliche V1-Entscheidungen

## Deployment

Laut Datenschutzerklärung ([app/datenschutzerklaerung/page.tsx](app/datenschutzerklaerung/page.tsx))
wird das Hosting über All-Inkl.COM realisiert. Eine darüber hinausgehende
Deployment-Konfiguration (CI/CD, Server-Setup) ist aktuell nicht Teil dieses
Repositories.

## Wichtige Hinweise

- `scripts/run-admin-create.mjs` enthält einen expliziten Workaround für
  Node 24, bei dem die Auflösung des Windows-Benutzerkontonamens für das
  temporäre Verzeichnis von `tsx` fehlschlagen kann.
- Umgebungsvariablen aus `.env`-Dateien werden von Prisma nicht automatisch
  geladen; `prisma.config.ts` bindet dafür explizit `dotenv/config` ein.
- Secrets und Zugangsdaten dürfen niemals im Repository oder im Client-Code
  landen — siehe [AGENTS.md](AGENTS.md) für die verbindlichen
  Engineering-Standards dieses Projekts.
