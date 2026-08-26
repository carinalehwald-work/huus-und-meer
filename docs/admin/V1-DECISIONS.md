# Admin-Bereich: Verbindliche fachliche V1-Entscheidungen

## Zweck und Verbindlichkeit

Dieses Dokument ergänzt [ADMIN-PLAN.md](./ADMIN-PLAN.md) und [DATA-MODEL.md](./DATA-MODEL.md) um die verbindlichen fachlichen Entscheidungen für Version 1 des Huus-&-Meer-Admin-Bereichs.

Die hier als verbindlich bezeichneten Regeln bilden die fachliche Grundlage für die spätere technische Planung. Dieses Dokument enthält bewusst kein Datenbankschema und legt weder PostgreSQL-Tabellen noch Prisma-Modelle, APIs, Authentifizierung oder Benutzeroberflächen fest.

## Verbindlich entschieden

### 1. Stammdaten V1

In V1 gibt es genau eine zentrale Stammdatenquelle für Huus & Meer. Sie verwaltet ausschließlich Unternehmens-, Kontakt-, Bürozeiten-, Social-Media- und Impressumsdaten. Öffentliche Bereiche verwenden diese Quelle später gemeinsam; Header, Footer und Kontaktseite erhalten keine getrennten Datenbestände. Bürozeiten werden als sortierbare Zeitgruppen gepflegt: Eine Zeitgruppe enthält eine gemeinsame Regel mit Uhrzeit von/bis, Nach Vereinbarung und Termine nach Vereinbarung und wird einem oder mehreren Wochentagen zugeordnet. Ein Wochentag darf nur einer Zeitgruppe angehören; nicht zugeordnete Tage gelten als geschlossen. Admin-Zugänge, Rollen, Rechte, Passwörter, 2FA, Audit-Log und sonstige technische Einstellungen sind ausdrücklich keine Stammdaten.

### 2. Services und Service-Kategorien

Services verwenden in Version 1 ausschließlich diese Zustände:

- Aktiv
- Inaktiv

Es gibt in Version 1 keine zusätzliche Archivierungslogik für Services. Wird ein Service nicht mehr verwendet oder öffentlich berücksichtigt, wird er deaktiviert und nicht archiviert.

Auch Service-Kategorien verwenden ausschließlich Aktiv/Inaktiv. Eine zusätzliche Archivierungslogik für Service-Kategorien ist in Version 1 nicht vorgesehen.

### 3. Pflichtfelder öffentlicher Kontaktanfragen

Eine öffentliche Kontaktanfrage benötigt in Version 1:

- Name
- E-Mail-Adresse
- Nachricht

Eine Telefonnummer ist optional.

Ein konkreter Bezug zu einem Hausboot, Liegeplatz, Service oder Stellenangebot wird strukturiert übermittelt. Er wird nicht als freier Zuordnungstext gespeichert.

### 4. Anfragetypen und zulässige Bezüge

Anfragetypen bleiben frei verwaltbar und werden nicht fest im Code vorgegeben.

Für die bekannten Anfragetypen in Version 1 gelten diese fachlichen Zuordnungen:

| Anfragetyp | Zulässiger konkreter Bezug |
| --- | --- |
| Allgemeine Anfrage | Kein konkreter Bezug erforderlich |
| Hausboot | Optional genau ein konkretes Hausboot |
| Liegeplatz | Optional genau ein konkreter Liegeplatz |
| Service | Optional genau ein konkreter Service |
| Stellenangebot | Optional genau ein konkretes Stellenangebot |

Fachlich unpassende Kombinationen sind nicht zulässig. Eine Hausboot-Anfrage darf beispielsweise nicht auf einen Service verweisen. Die konkrete technische Validierung dieser Regel wird später umgesetzt.

Jede Kontaktanfrage besitzt genau einen Anfragetyp und optional keinen oder genau einen konkreten Inhaltsbezug. Mehrere gleichzeitige Inhaltsbezüge sind nicht zulässig. Der frei verwaltbare Anfragetyp legt dafür verbindlich eine Bezugsart fest: kein Bezug, Hausboot, Liegeplatz, Service oder Stellenangebot.

### 5. Historie von Kontaktanfragen

Kontaktanfragen müssen historisch erhalten und nachvollziehbar bleiben.

Wird ein referenzierter Inhalt später archiviert, deaktiviert oder umbenannt, darf die bestehende Kontaktanfrage dadurch weder verloren gehen noch ihren nachvollziehbaren fachlichen Zusammenhang verlieren.

Die konkrete technische Umsetzung dieser historischen Nachvollziehbarkeit wird erst in der technischen Planung entschieden.

### 6. Interne Notizen

Eine Kontaktanfrage kann mehrere interne Notizen besitzen.

Beispiel:

```text
18.08.2026 – Kunde angerufen.
19.08.2026 – Exposé verschickt.
20.08.2026 – Rückmeldung ausstehend.
```

Interne Notizen sind ausschließlich im geschützten Admin-Bereich sichtbar. Sie werden niemals öffentlich ausgegeben.

### 7. Bewerbungskontakt bei Stellenangeboten

Ein veröffentlichtes Stellenangebot benötigt mindestens eine Kontaktmöglichkeit für Bewerber:

- E-Mail-Adresse

oder

- Telefon beziehungsweise WhatsApp

Der Name des Ansprechpartners ist optional. Die konkrete technische Validierung wird später umgesetzt.

### 8. Arbeitsorte von Stellenangeboten

Ein Stellenangebot kann mehrere Arbeitsorte besitzen. Die Arbeitsorte besitzen eine definierte Reihenfolge, damit die öffentliche Website sie kontrolliert sortiert ausgeben kann.

Beispiel:

1. Fehmarn
2. Großenbrode
3. Heiligenhafen

### 9. Hausboot-Exposé-Kategorien

Exposé-Kategorien für Hausboote werden nicht fest im Code vorgegeben. Sie bleiben flexibel verwaltbar.

Der Admin soll eigene Kategorien beziehungsweise Exposé-Bereiche anlegen und sortieren können. Die konkreten technischen Felder werden später aus dem bereits dokumentierten Hausboot-Datenmodell und diesen fachlichen Anforderungen abgeleitet.

### 10. Öffentliche Inhalte und Löschen

Bei veröffentlichten Inhalten wird gegenüber einem sofortigen endgültigen Löschen grundsätzlich das fachlich passende Rücknahmeverfahren bevorzugt:

- Hausboote, Liegeplätze und Stellenangebote werden archiviert.
- Services und Service-Kategorien werden in Version 1 deaktiviert.

Kontaktanfragen dürfen nicht einfach endgültig gelöscht werden. Ihre Historie muss erhalten bleiben.

Konkrete Aufbewahrungs- und Löschfristen werden separat festgelegt und sind nicht Bestandteil dieser V1-Entscheidungen.

### 11. Admin-E-Mail-Adresse

Die E-Mail-Adresse eines Admin-Benutzers ist fachlich eindeutig und dient in Version 1 als Login-Kennung.

Es darf nicht mehrere aktive Admin-Benutzer mit derselben E-Mail-Adresse geben.

### 12. Admin-Authentifizierung und Benutzerverwaltung

### 13. Admin-Einstellungen, Mein Konto und Zugangseinrichtung

V1 verwaltet interne Administratoren ausschließlich im geschützten Bereich Admin-Einstellungen; es gibt nur die Vollzugriffsrolle Administrator. Neue Konten erhalten einen einmalig anzeigbaren, gehasht gespeicherten und zeitlich begrenzten Einrichtungscode statt eines vorgegebenen Passworts oder E-Mail-Versands. Die Einrichtung erfolgt mit E-Mail und Code auf einer öffentlichen, aber nicht registrierenden Zugang-einrichten-Seite und aktiviert das Konto nach eigener Passwortvergabe. Eigene Daten werden nur unter Mein Konto bearbeitet; Passwortänderungen verlangen das aktuelle Passwort und erneuern die Sitzung. Eigene oder letzte aktive Administratoren können nicht deaktiviert werden.

Für die erste technische Umsetzung wird NextAuth.js/Auth.js (`next-auth` 4.24.15) mit einem Credentials-Provider und signierten JWT-Sessions verwendet. Die Anmeldung prüft die E-Mail-Adresse und das Passwort serverseitig gegen aktive Admin-Benutzer in PostgreSQL. Es gibt keine öffentliche Registrierung.

In V1 gibt es ausschließlich die Rolle `Administrator`. Weitere Rollen oder individuelle Berechtigungen werden in diesem Schritt nicht eingeführt.

Passwörter werden ausschließlich als sichere bcrypt-Hashes gespeichert und geprüft; Klartextpasswörter werden weder gespeichert noch ausgegeben. Die geschützte Route `/admin` erhält zusätzlich zur schnellen Proxy-Prüfung bei jeder Seitendarstellung eine serverseitige Datenbankprüfung auf einen weiterhin aktiven Admin-Benutzer. Deaktivierte Benutzer können sich nicht anmelden und erhalten keinen Zugriff auf geschützte Admin-Bereiche.

Der erste Administrator der Produktionsumgebung wird bei deren Einrichtung einmalig über einen sicheren internen Setup- beziehungsweise Bootstrap-Prozess angelegt. Das lokale Kommando `npm run admin:create` bleibt ausschließlich für Entwicklung und initiale lokale Setups bestehen. Der Kunde benötigt später keinen Terminalzugriff: Das Anlegen weiterer Administratoren sowie das Aktivieren und Deaktivieren von Benutzern wird in einer späteren geschützten Benutzerverwaltung im Admin ermöglicht.

Ein angemeldeter Administrator soll sein eigenes Passwort im Admin ändern können. Für vergessene Passwörter wird später ein sicherer Passwort-Reset-Prozess vorgesehen. Beide Funktionen sind mit dieser Entscheidung fachlich festgelegt, aber noch nicht implementiert.

## Bewusst noch offen

Die folgenden Punkte werden mit diesem Dokument ausdrücklich nicht entschieden:

- konkrete technische Ausgestaltung des Passwort-Reset-Prozesses
- Zwei-Faktor-Authentifizierung
- E-Mail-Verifizierung
- weitere Admin-Rollen
- individuelle Berechtigungen
- Audit-Log
- Login-Versuchsbegrenzung
- automatische Abmeldung
- Datenschutz- und Einwilligungsdetails
- Captcha- und Spam-Schutz-Technologie
- konkrete Aufbewahrungs- und Löschfristen
- technische Medienablage
- Rich-Text-Technologie
- konkrete PostgreSQL-Tabellen
- Prisma-Schema
- API-Struktur

Diese Punkte werden erst in den jeweils dafür vorgesehenen technischen oder fachlichen Planungsschritten entschieden.

## Nicht Bestandteil dieses Schritts

Dieses Dokument autorisiert noch keine Implementierung von:

- PostgreSQL oder Datenbankmigrationen
- Prisma oder einem anderen ORM
- API-Routen
- Login, Authentifizierung oder Sessions
- Admin-Seiten oder Admin-UI
- CRUD-Funktionen
- Anwendungscode
