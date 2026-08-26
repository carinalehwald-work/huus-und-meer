# Admin-Bereich: Technische Entscheidungen und Empfehlungen

## Status und Geltungsbereich

Dieses Dokument ergänzt [TECHNICAL-ARCHITECTURE.md](./TECHNICAL-ARCHITECTURE.md) um die ersten technischen Entscheidungen und Empfehlungen für den Huus-&-Meer-Admin-Bereich.

Es dokumentiert technische Entscheidungen und Empfehlungen für den Admin-Bereich. Konkrete Implementierungsdetails sind nur dort festgehalten, wo sie bereits verbindlich entschieden oder umgesetzt wurden.

## Festgelegt

### 1. PostgreSQL als Datenbank

PostgreSQL ist als zentrale relationale Datenbank für die später persistent verwalteten öffentlichen Inhalte, Kontaktanfragen und Admin-Daten vorgesehen.

Die konkrete Bereitstellung, Konfiguration und Tabellenstruktur bleiben offen.

### 2. Prisma als ORM

Prisma ist als ORM und serverseitige Zugriffsschicht zwischen der Next.js-Anwendung und PostgreSQL vorgesehen.

Prisma-Version, Schema, Migrationen und Client-Konfiguration werden erst in einem späteren Planungsschritt festgelegt.

### 3. Serverseitige Datenzugriffsschicht

Die Next.js-Anwendung erhält eine zentrale serverseitige Data Access Layer. Sie bündelt Datenbankzugriffe und stellt der öffentlichen Website sowie dem Admin jeweils nur die benötigten Daten zur Verfügung.

### 4. Admin unter `/admin`

Der Admin-Bereich wird unter `/admin` eingeordnet. Der Login ist innerhalb dieses Bereichs unter `/admin/login` vorgesehen; die übrigen Admin-Routen werden geschützt.

Der derzeitige Footer-Link auf `/login` steht dieser Architektur nicht entgegen, muss bei der späteren Umsetzung aber auf die endgültige Admin-Login-Route abgestimmt werden.

### 5. Admin-API unter `/api/admin`

Geschützte HTTP-Schnittstellen des Admin-Bereichs werden unter dem gemeinsamen Namensraum `/api/admin` eingeordnet.

Die konkreten Ressourcen, Methoden, Nutzlasten und Fehlerformate bleiben offen.

### 6. Logische Trennung von Website und Admin

Öffentliche Website und Admin-Bereich werden logisch getrennt. Sie dürfen dieselbe PostgreSQL-Datenbasis und dieselbe serverseitige Datenzugriffsschicht verwenden, benötigen jedoch getrennte Routen, Zugriffskontrollen, Anwendungsfälle und Rückgabemodelle.

### 7. Authentifizierung und Admin-Benutzer

Für den Admin wird NextAuth.js/Auth.js (`next-auth` 4.24.15) mit Credentials-Provider und signierten JWT-Sessions verwendet. Die Anmeldung und jede serverseitige Prüfung laden den Admin-Benutzer aus PostgreSQL und lassen ausschließlich aktive Benutzer zu.

In V1 existiert technisch und fachlich nur die Rolle `Administrator`. Es gibt keine öffentliche Registrierung. Passwörter werden ausschließlich serverseitig mit bcrypt als sichere Hashes verarbeitet und gespeichert; Klartextpasswörter dürfen weder persistiert noch an Client-Code übertragen werden.

Der erste Produktions-Administrator wird einmalig durch einen sicheren internen Bootstrap-Prozess angelegt. `npm run admin:create` bleibt ein lokales Entwicklungs- und initiales Setup-Werkzeug, ist jedoch kein Prozess für Kunden. Eine spätere geschützte Admin-Benutzerverwaltung muss das Anlegen weiterer Administratoren sowie Aktivieren und Deaktivieren ermöglichen, damit kein Terminalzugriff erforderlich ist. Deaktivierte Benutzer werden bei der Anmeldung und bei geschützten serverseitigen Zugriffen abgewiesen.

Die spätere Benutzerverwaltung muss außerdem die Änderung des eigenen Passworts ermöglichen. Ein Passwort-Reset für vergessene Passwörter wird als gesonderter sicherer Prozess geplant, aber noch nicht implementiert.

### 8. Serverseitige Validierung

Eingaben und Änderungen werden serverseitig validiert. Clientseitige Validierung darf zusätzlich die Bedienung verbessern, ersetzt aber niemals die serverseitige Prüfung.

### 9. Kein direkter Datenbankzugriff aus Client Components

Client Components kommunizieren niemals direkt mit PostgreSQL oder Prisma. Sämtliche Datenbankzugriffe erfolgen über serverseitige Komponenten, Route Handler, Server Actions oder die zentrale serverseitige Datenzugriffsschicht.

## Bewertung im bestehenden Projekt

Keine dieser Entscheidungen ist aufgrund des aktuellen Projekts problematisch. Die bestehende Anwendung besitzt noch keine Datenbank-, Prisma-, API- oder Authentifizierungsschicht und kann daher später kontrolliert um diese Architektur ergänzt werden.

Notwendige Anpassungen wie die Umstellung des Footer-Links und die serverseitige Anbindung des aktuell nur lokal arbeitenden Kontaktformulars gehören zur späteren Implementierung und werden in diesem Schritt nicht vorgenommen.

## Nicht entschieden

Über die genannten Punkte hinaus trifft dieses Dokument keine weiteren technischen Entscheidungen. Insbesondere bleiben Prisma-Schema, API-Details, Validierungsbibliothek, Hosting und Medienablage offen. Die konkrete technische Ausgestaltung des Passwort-Resets bleibt ebenfalls offen.
