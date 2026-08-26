# Admin-Bereich: Technischer Architekturplan

## Status, Zweck und Quellen

Dieses Dokument beschreibt den geplanten technischen Aufbau des Huus-&-Meer-Admin-Bereichs. Es ist ein Architekturplan und noch keine Implementierung.

Die fachliche Quelle der Wahrheit bilden:

- [ADMIN-PLAN.md](./ADMIN-PLAN.md)
- [DATA-MODEL.md](./DATA-MODEL.md)
- [V1-DECISIONS.md](./V1-DECISIONS.md)

`V1-DECISIONS.md` konkretisiert für Version 1 diejenigen Punkte, die in den älteren Dokumenten noch als offen beschrieben sind. Dieser Architekturplan leitet daraus technische Bereiche und Abhängigkeiten ab, trifft aber keine neuen fachlichen Entscheidungen.

## 1. Aktueller Stack und Projektstruktur

### Aktueller Stack

Das bestehende Projekt verwendet derzeit:

- Next.js 16.3.1 mit App Router
- React 19.2.8
- TypeScript 5 im Strict-Modus
- Tailwind CSS 4
- ESLint 9 mit `eslint-config-next`
- statische Bilder unter `public/assets/images`
- statische Website-Daten in `data/site.ts`

Aktuell sind keine zusätzlichen Laufzeitabhängigkeiten für Datenbank, Authentifizierung, serverseitige Validierung oder Medienverwaltung installiert.

### Aktuelle Struktur

Die Anwendung besteht aktuell im Wesentlichen aus:

```text
app/
├── layout.tsx
├── page.tsx
├── suchen-und-buchen/
└── vermieten-und-verkaufen/

components/
├── layout/
├── pages/
├── sections/
└── ui/

data/
└── site.ts

public/assets/images/
docs/admin/
```

Die Landingpage und die beiden Bereichsseiten sind öffentlich. Inhalte wie Angebote und Stellen werden aktuell aus `data/site.ts` gelesen.

Das vorhandene Kontaktformular ist eine Client-Komponente. Es prüft und bestätigt Eingaben derzeit nur lokal, sendet keine Anfrage an einen Server und speichert nichts persistent.

Im Footer verweist der Admin-Link aktuell auf `/login`. Eine Login-Route, `/admin`-Route, Authentifizierung, Datenbankanbindung, API, Admin-Oberfläche oder persistente Kontaktverarbeitung existiert noch nicht. Im Zuge der späteren Umsetzung muss dieser Link mit der fachlich vorgesehenen Login-Route `/admin/login` abgeglichen werden.

## 2. Zielbild der PostgreSQL-/Prisma-Architektur

PostgreSQL soll die zentrale persistente Datenbasis für öffentliche Inhalte, Kontaktanfragen und den Admin-Bereich bilden. Prisma soll als serverseitige Zugriffsschicht zwischen Anwendung und PostgreSQL eingesetzt werden. Das konkrete Prisma-Schema und die konkreten Tabellen sind ausdrücklich nicht Bestandteil dieses Dokuments.

Das geplante Zielbild ist:

```text
Öffentlicher Browser                         Admin-Browser
        │                                         │
        ▼                                         ▼
öffentliche Next.js-Routen                 /admin/login und /admin/*
        │                                         │
        ├── öffentliche Lesezugriffe              ├── Authentifizierung
        └── Kontaktanfrage                         └── geschützte Vorgänge
                    │                                  │
                    └──────────────┬───────────────────┘
                                   ▼
                     serverseitige Anwendungslogik
                     Validierung · Rechte · Statusregeln
                                   │
                                   ▼
                    serverseitige Data Access Layer
                    sichere, minimale Rückgabemodelle
                                   │
                                   ▼
                             Prisma Client
                                   │
                                   ▼
                              PostgreSQL
```

### Architekturprinzipien

- Datenbankzugriffe erfolgen ausschließlich serverseitig.
- Prisma Client wird nicht aus Client-Komponenten importiert.
- Eine zentrale serverseitige Data Access Layer bündelt Abfragen und Änderungen.
- Authentifizierung, Autorisierung und fachliche Validierung werden an jedem geschützten serverseitigen Eintrittspunkt geprüft.
- Server Actions und Route Handler gelten als direkt aufrufbare Endpunkte und dürfen sich nicht allein auf den Schutz einer Seite verlassen.
- An Client-Komponenten und öffentliche Antworten werden nur die tatsächlich benötigten Daten übertragen, nicht ungefilterte Datenbankobjekte.
- Öffentliche Lesezugriffe liefern ausschließlich veröffentlichte beziehungsweise aktive Inhalte.
- Admin-Lesezugriffe dürfen abhängig vom Bereich auch Entwürfe, archivierte oder inaktive Inhalte sehen.
- Historische Kontaktanfragen und ihre zulässigen Inhaltsbezüge müssen erhalten bleiben.
- Lösch-, Archivierungs- und Deaktivierungsregeln werden in der Anwendungs- und Datenzugriffsschicht einheitlich durchgesetzt.
- Datenbankmigrationen sollen später versioniert, überprüfbar und reproduzierbar ausgeführt werden.

### Vorgesehene technische Schichten

Eine spätere Struktur kann logisch folgende Verantwortungen trennen; die exakten Ordnernamen bleiben eine Implementierungsentscheidung:

```text
Routing und Darstellung
        ↓
Eingabevalidierung und Anwendungsfälle
        ↓
Authentifizierung und Autorisierung
        ↓
Data Access Layer
        ↓
Prisma
        ↓
PostgreSQL
```

Die öffentliche Website und der Admin verwenden dieselbe fachliche Datenbasis, greifen aber über unterschiedliche, serverseitig kontrollierte Anwendungsfälle und Rückgabemodelle darauf zu.

## 3. Wichtigste Entitäten und Beziehungen

Die folgende Übersicht ist fachlich-logisch. Sie definiert noch keine Tabellen, Fremdschlüssel oder Prisma-Felder.

```text
Hausboot-Angebot
├── 0..n Hausboot-Bilder
└── 0..n Hausboot-Exposé-Einträge
         └── gruppiert durch frei verwaltbare, sortierbare Exposé-Kategorien

Liegeplatz-Angebot
└── 0..n Liegeplatz-Bilder

Service-Kategorie
└── 0..n Services
    Service gehört zu genau einer Kategorie

Stellenangebot
├── 1..n sortierte Arbeitsorte
├── 0..n sortierte Aufgaben
├── 0..n sortierte Qualifikationen
└── 0..1 Bewerbungskontakt

Anfragetyp
└── 0..n Kontaktanfragen

Kontaktanfrage
├── gehört zu genau einem Anfragetyp
├── besitzt optional genau einen fachlich passenden Inhaltsbezug
└── besitzt 0..n interne Notizen

Rolle
└── 0..n Admin-Benutzer
    Admin-Benutzer besitzt in V1 die Rolle Administrator
```

### Inhaltlicher Bezug von Kontaktanfragen

Eine Kontaktanfrage kann sich optional auf genau einen der folgenden Inhalte beziehen:

- Hausboot-Angebot
- Liegeplatz-Angebot
- Service
- Stellenangebot

Der Bezug muss zum Anfragetyp passen. Allgemeine Anfragen benötigen keinen Bezug. Die spätere technische Modellierung dieser unterschiedlichen Bezugsmöglichkeiten ist noch offen; verbindlich sind jedoch Typverträglichkeit, strukturierte Zuordnung und historische Nachvollziehbarkeit.

### Status- und Lebenszyklusmodelle

- Hausboote, Liegeplätze und Stellenangebote: `Entwurf`, `Veröffentlicht`, `Archiviert`
- Services und Service-Kategorien: ausschließlich `Aktiv`, `Inaktiv`
- Anfragetypen: `Aktiv`, `Inaktiv`
- Kontaktanfragen: `Neu`, `In Bearbeitung`, `Erledigt`
- Admin-Benutzer: `Aktiv`, `Inaktiv`

`Hervorgehoben` bleibt bei Hausbooten und Liegeplätzen eine zusätzliche Kennzeichnung und ist kein Status.

## 4. Admin-Authentifizierung und geschützte Routen

### Geplanter Routing-Bereich

```text
/admin/login       öffentlich erreichbarer Login
/admin             geschütztes Dashboard
/admin/*           geschützte Admin-Bereiche
/api/admin/*       geschützte Admin-Schnittstellen, sofern Route Handler verwendet werden
```

Eine öffentliche Registrierung ist nicht vorgesehen. Admin-Benutzer werden intern angelegt und verwaltet.

### Verbindliche Schutzregeln

- Login erfolgt in V1 mit E-Mail-Adresse und Passwort.
- Die Admin-E-Mail dient als eindeutige Login-Kennung.
- Passwörter werden niemals im Klartext gespeichert.
- Nur authentifizierte und aktive Admin-Benutzer erhalten Zugriff.
- In V1 ist ausschließlich die Rolle `Administrator` vorgesehen.
- Die Rollenprüfung und der Aktiv-Zustand werden serverseitig geprüft.
- Geschützte Seiten, Mutationen, Server Actions und Route Handler führen jeweils eine eigene serverseitige Prüfung aus.
- Clientseitig ausgeblendete Navigation ist keine Zugriffskontrolle.
- Interne Notizen, Entwürfe, archivierte Inhalte und Admin-Daten dürfen nicht in öffentliche Rückgabemodelle gelangen.

Die konkrete Authentifizierungsbibliothek, Session-Technologie sowie die Entscheidung zwischen JWT und serverseitiger Session bleiben offen. Ein optionaler zentraler Request-Vorfilter darf später die Navigation unterstützen, ersetzt aber nicht die Autorisierungsprüfung in der Data Access Layer und an den schreibenden Endpunkten.

## 5. Geplante Admin-CRUD-Bereiche

| Bereich | Geplante V1-Vorgänge | Besondere Regeln |
| --- | --- | --- |
| Dashboard | Lesen und zu den Bereichen navigieren | Kennzahlen und Inhalte sind noch offen |
| Hausboote | Erstellen, anzeigen, bearbeiten, veröffentlichen, archivieren | Bilder, Titelbild, Reihenfolge, Stammdaten und flexible Exposé-Inhalte verwalten |
| Hausboot-Exposé | Kategorien beziehungsweise Bereiche verwalten und sortieren; Einträge verwalten und sortieren | Kategorien nicht fest im Code vorgeben |
| Liegeplätze | Erstellen, anzeigen, bearbeiten, veröffentlichen, archivieren | Bewusst schlankes Modell; Bilder und Titelbild verwalten |
| Service-Kategorien | Erstellen, anzeigen, bearbeiten, sortieren, aktivieren, deaktivieren | Keine Archivierungslogik in V1 |
| Services | Erstellen, anzeigen, bearbeiten, sortieren, aktivieren, deaktivieren | Gehören immer zu genau einer Kategorie; kein allgemeines Preisfeld |
| Stellenangebote | Erstellen, anzeigen, bearbeiten, veröffentlichen, archivieren | Arbeitsorte, Aufgaben und Qualifikationen sortieren; Bewerbungskontakt verwalten |
| Kontaktanfragen | Anzeigen, öffnen, bearbeiten, kategorisieren, Status ändern, interne Notizen ergänzen | Keine reguläre Erstellung im Admin; Historie erhalten |
| Anfragetypen | Erstellen, anzeigen, bearbeiten, sortieren, aktivieren, deaktivieren | Nicht fest im Code vorgeben |
| Admin-Benutzer | Intern anlegen, anzeigen, bearbeiten, aktivieren, deaktivieren | Keine öffentliche Registrierung; V1-Rolle Administrator |
| Einstellungen | Noch nicht festgelegt | Erst umsetzen, wenn fachlicher Umfang definiert ist |

Ein endgültiger Löschvorgang ist nicht automatisch Bestandteil eines CRUD-Bereichs. Veröffentlichte Angebote werden bevorzugt archiviert, Services und Kategorien deaktiviert und Kontaktanfragen historisch erhalten. Konkrete Löschrechte und Fristen bleiben offen.

## 6. Geplante API- und Mutationsstruktur

Die endgültige API-Struktur ist laut den V1-Entscheidungen noch offen. Der Architekturplan legt daher nur Verantwortungsbereiche und Schutzgrenzen fest.

### Öffentliche Schnittstellen

Für öffentliche Seiten ist keine allgemeine Browser-API erforderlich, wenn Server Components veröffentlichte beziehungsweise aktive Inhalte direkt über die serverseitige Data Access Layer lesen.

Benötigt wird mindestens ein öffentlicher, schreibender Anwendungsfall für Kontaktanfragen:

```text
Öffentliches Kontaktformular
        ↓
serverseitige Eingabevalidierung
        ↓
Zuordnung von Anfragetyp und optionalem Bezug
        ↓
Kontaktanfrage mit Status Neu speichern
```

Ob dieser Anwendungsfall als Route Handler oder über eine andere von Next.js unterstützte serverseitige Mutation umgesetzt wird, bleibt offen. Unabhängig davon muss er öffentliche Eingaben als nicht vertrauenswürdig behandeln und Name, E-Mail-Adresse, Nachricht, optionales Telefon sowie Typ und Bezug validieren.

### Geschützte Admin-Schnittstellen

Die geschützten Mutationen werden fachlich nach Ressourcen getrennt:

```text
Admin
├── Hausboote, Bilder und Exposé-Inhalte
├── Liegeplätze und Bilder
├── Service-Kategorien und Services
├── Stellenangebote und zugehörige Listen/Kontakte
├── Kontaktanfragen und interne Notizen
├── Anfragetypen
└── Admin-Benutzer
```

Falls HTTP-Route-Handler eingesetzt werden, ist ein gemeinsamer geschützter Namensraum wie `/api/admin/*` sinnvoll. Falls Server Actions eingesetzt werden, müssen dieselben Authentifizierungs-, Autorisierungs-, Validierungs- und Datenzugriffsregeln gelten. Beide Ansätze dürfen nicht zu paralleler, widersprüchlicher Geschäftslogik führen.

Die konkrete URL-Struktur, HTTP-Methoden, Nutzlasten, Fehlerformate, Versionierung und die Aufteilung zwischen Route Handlers und Server Actions werden erst in der API-Planung festgelegt.

## 7. Trennung zwischen öffentlicher Website und Admin

| Aspekt | Öffentliche Website | Admin-Bereich |
| --- | --- | --- |
| Zugriff | Öffentlich | Nur authentifizierte, aktive Administratoren |
| Inhalte | Veröffentlicht beziehungsweise aktiv | Entwürfe, veröffentlichte, archivierte und inaktive Inhalte je nach Bereich |
| Kontaktanfragen | Erstellen | Anzeigen, bearbeiten, kategorisieren, Status und Notizen verwalten |
| Interne Notizen | Niemals sichtbar | Sichtbar und verwaltbar |
| Admin-Benutzer | Kein Zugriff | Interne Verwaltung |
| Datenzugriff | Sichere öffentliche Rückgabemodelle | Geschützte Admin-Rückgabemodelle |
| Layout und Navigation | Bestehende Marken-Website | Eigenständige geschützte Admin-Navigation |

Die Trennung erfolgt nicht durch zwei unabhängige Datenbestände. Beide Bereiche nutzen dieselbe PostgreSQL-Datenbasis, aber getrennte serverseitige Anwendungsfälle, Schutzprüfungen und minimale Rückgabemodelle.

Statische Inhalte aus `data/site.ts` werden erst dann ersetzt, wenn der jeweilige fachliche Bereich vollständig persistent modelliert, administrierbar und für die öffentliche Ausgabe vorbereitet ist. Die Umstellung sollte bereichsweise erfolgen, damit die bestehende Website während der Migration funktionsfähig bleibt.

## 8. Noch offene technische Entscheidungen

### Datenbank und Prisma

- konkrete PostgreSQL-Bereitstellung und Betriebsumgebung
- Prisma-Version, Client-Konfiguration und Migrationsablauf
- konkrete Tabellen, Felder, Schlüssel, Indizes und Constraints
- technische Darstellung von Geld, Währung, Maßen, Einheiten und Baujahr-Zeiträumen
- technische Modellierung frei verwaltbarer Exposé-Kategorien
- technische Modellierung des optionalen Inhaltsbezugs einer Kontaktanfrage
- Strategie zur historischen Nachvollziehbarkeit bei umbenannten, archivierten oder deaktivierten Bezügen
- genaue Kaskaden-, Lösch- und Aufbewahrungsregeln
- Umgang mit Zeitzonen und Systemzeitpunkten
- Verbindungsmanagement und Connection Pooling in der späteren Hosting-Umgebung

### Authentifizierung und Sicherheit

- konkrete Authentifizierungsbibliothek
- Session-Technologie und JWT gegenüber Sessions
- Passwort-Reset, Zwei-Faktor-Authentifizierung und E-Mail-Verifizierung
- Passwort-Hashing-Bibliothek und sichere Parameter
- Login-Versuchsbegrenzung und automatische Abmeldung
- Audit-Log
- weitere Rollen und individuelle Berechtigungen außerhalb von V1
- Verwaltung und Rotation von Geheimnissen

### API und Anwendung

- Route Handlers gegenüber Server Actions für einzelne Mutationen
- konkrete API-Pfade, Nutzlasten, Fehlerformate und Versionierung
- Validierungsbibliothek und gemeinsame Validierung zwischen Formularen und Server
- Cache- und Revalidierungsstrategie für öffentliche Inhalte
- Benachrichtigungen und E-Mail-Versand
- Logging, Monitoring und Fehlerbeobachtung
- Datenschutz- und Einwilligungsdetails
- konkrete Captcha- und Spam-Schutz-Technologie

### Inhalte und Medien

- technische Medienablage sowie Upload-, Lösch- und Zugriffsstrategie
- Bildformate, Größen, Optimierung und Verarbeitung
- Rich-Text-Technologie und sichere Ausgabe formatierter Stellenbeschreibungen
- Slugs, öffentliche Detailseiten und URL-Konzept
- technische Verwaltung des allgemeinen Liegeplatz-Kontakt-Hinweises
- fachlicher Umfang der Einstellungen und des Dashboards

Diese Punkte sind als offen dokumentiert. Dieser Architekturplan entscheidet sie nicht vorweg.

## 9. Sinnvolle Reihenfolge der späteren Implementierung

### Phase 1: Technische Entscheidungen und Sicherheitsgrundlage

1. Offene Infrastrukturentscheidungen zu PostgreSQL-Betrieb, Prisma, Authentifizierung, Sessions und Medienablage treffen.
2. Datenschutz-, Aufbewahrungs- und Löschregeln soweit klären, wie sie Datenmodell und Betrieb beeinflussen.
3. API-/Mutationsansatz, serverseitige Validierung und Sicherheitsgrenzen verbindlich planen.

### Phase 2: Datenmodell und Datenzugriff

4. Fachliche Entitäten in ein überprüfbares Prisma-Schema überführen.
5. Beziehungen, Statuswerte, Reihenfolgen, Eindeutigkeiten und historische Bezüge prüfen.
6. Erste Migration und Entwicklungsdaten erst nach Freigabe des Schemas anlegen.
7. Zentrale serverseitige Data Access Layer und sichere Rückgabemodelle aufbauen.

### Phase 3: Authentifizierung und Admin-Grundgerüst

8. Authentifizierung, Session-Prüfung und serverseitige Schutzmechanismen implementieren.
9. Internen ersten Administrator sicher anlegen.
10. `/admin/login`, geschütztes `/admin`-Layout und minimale Admin-Navigation erstellen.

### Phase 4: Abhängige Stammdaten und CRUD-Bereiche

11. Service-Kategorien und Services umsetzen.
12. Anfragetypen umsetzen.
13. Hausboote einschließlich Bildern und Exposé-Struktur umsetzen.
14. Liegeplätze einschließlich Bildern umsetzen.
15. Stellenangebote einschließlich Arbeitsorten, Aufgaben, Qualifikationen und Bewerbungskontakt umsetzen.

### Phase 5: Kontaktanfragen

16. Öffentliche Kontaktannahme mit serverseitiger Validierung und strukturierter Zuordnung umsetzen.
17. Kontaktanfragen, Statusverwaltung und mehrere interne Notizen im Admin umsetzen.
18. Historische Nachvollziehbarkeit bei geänderten oder deaktivierten Bezügen testen.

### Phase 6: Öffentliche Website anbinden

19. Statische Daten bereichsweise durch freigegebene Datenbankinhalte ersetzen.
20. Öffentliche Seiten strikt auf veröffentlichte beziehungsweise aktive Inhalte begrenzen.
21. Cache- und Revalidierungsverhalten passend zum gewählten Betrieb einrichten.

### Phase 7: Qualitätssicherung und Betrieb

22. Zugriffs-, Validierungs-, Status- und Beziehungstests ergänzen.
23. Prüfen, dass keine internen Daten über öffentliche Seiten oder Schnittstellen ausgegeben werden.
24. Backup, Wiederherstellung, Monitoring, Logging und sicheren Migrationsbetrieb vorbereiten.
25. Erst danach Produktionsmigration und Freigabe planen.

## Zusammenfassung

### Bereits vorhanden

Eine öffentliche Next.js-16-Anwendung mit React, TypeScript, Tailwind CSS, statischen Inhalten, vorhandenen Seiten und einem noch nicht angebundenen Kontaktformular.

### Geplant

Eine gemeinsame PostgreSQL-Datenbasis mit Prisma, einer serverseitigen Data Access Layer, geschützten Admin-Routen, fachlich getrennten CRUD-Bereichen und einer strukturierten öffentlichen Kontaktannahme.

### Noch offen

Vor allem die konkrete Authentifizierungs-, Session-, API-, Medien-, Rich-Text-, Hosting-, Datenschutz-, Lösch- und Prisma-Ausgestaltung.

### Nächster konkreter Schritt

Vor jeder Installation oder Implementierung müssen die noch offenen technischen Grundentscheidungen priorisiert und in einem separaten, freizugebenden Entscheidungsdokument festgehalten werden. Danach kann als erster Implementierungsschritt ein geprüftes Prisma-Datenmodell entworfen werden.
