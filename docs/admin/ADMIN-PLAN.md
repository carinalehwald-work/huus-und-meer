# Admin-Bereich: Fachlicher Plan

## Zweck und Verbindlichkeit

Der geplante Admin-Bereich bündelt die interne Verwaltung der Inhalte und Vorgänge von Huus & Meer. Dieses Dokument beschreibt den fachlichen Umfang. Es ist noch keine technische Spezifikation für Datenbank, API, Authentifizierung oder Benutzeroberfläche.

> Die Dokumentation ist die fachliche Quelle der Wahrheit für den Admin-Bereich. Änderungen am Datenmodell werden zuerst in der Dokumentation festgelegt und erst danach technisch implementiert.

## Aktueller Projektstand

Zum Zeitpunkt dieser Dokumentation besteht das Projekt aus:

- Next.js 16 mit App Router
- React 19
- TypeScript
- Tailwind CSS 4
- statischen Website-Daten in `data/site.ts`
- öffentlichen Landingpage- und Bereichsseiten
- einem öffentlichen Kontaktformular ohne persistente Speicherung oder Versand

Noch nicht vorhanden sind:

- Datenbankanbindung
- PostgreSQL-Implementierung
- Prisma-Schema oder eine andere ORM-Entscheidung
- API-Routen für den Admin-Bereich
- Login, Sessions oder Zugriffskontrolle
- Admin-Seiten, Dashboard oder CRUD-Oberflächen
- persistente Kontaktanfragen

Im Footer existiert derzeit lediglich ein Link auf `/login`; eine dazugehörige Route oder Authentifizierung ist noch nicht implementiert.

## Geplanter fachlicher Umfang

Der Admin-Bereich soll später die folgenden Hauptbereiche enthalten:

| Bereich | Fachlicher Zweck | Grundsätzliche Vorgänge | Entscheidungsstand |
| --- | --- | --- | --- |
| Dashboard | Übersicht über relevante Inhalte, Vorgänge und offene Aufgaben | Lesen, navigieren | Kennzahlen und Inhalte noch zu definieren |
| Stammdaten V1 | Zentrale Quelle für Unternehmens-, Kontakt-, Bürozeiten-, Social-Media- und Impressumsdaten | Lesen und bearbeiten | V1 verbindlich definiert |
| Hausboote | Verwaltung aktueller Hausboot-Verkaufsangebote | Erstellen, lesen, bearbeiten, veröffentlichen, archivieren | Grundmodell verbindlich definiert |
| Liegeplätze | Verwaltung von Liegeplatz-Verkaufsangeboten | Erstellen, lesen, bearbeiten, veröffentlichen, archivieren | Grundmodell verbindlich definiert |
| Services | Verwaltung frei pflegbarer Service-Kategorien und Services | Erstellen, lesen, bearbeiten, aktivieren/deaktivieren, sortieren | Grundmodell verbindlich definiert |
| Stellenangebote | Verwaltung frei pflegbarer Stellenangebote | Erstellen, lesen, bearbeiten, veröffentlichen, archivieren | Grundmodell verbindlich definiert |
| Kontaktanfragen | Verwaltung öffentlich eingegangener Anfragen und frei pflegbarer Anfragetypen | Anzeigen, öffnen, bearbeiten, kategorisieren, Status ändern, erledigen, intern kommentieren | Grundmodell verbindlich definiert |
| Admin-Benutzer & Zugriff | Verwaltung der intern angelegten Zugänge zum geschützten Admin-Bereich | Anlegen, anzeigen, bearbeiten, aktivieren/deaktivieren | Grundmodell verbindlich definiert |
| Einstellungen | Zentrale, selten veränderte Konfigurationen | Lesen und bearbeiten | Umfang und Datenmodell noch zu definieren |

Löschen bedeutet nicht automatisch eine physische Entfernung aus der Datenbank. Wo fachlich sinnvoll, ist Archivieren zu bevorzugen. Verbindliche Lösch- und Aufbewahrungsregeln werden später je Bereich festgelegt.

## Hausboote

## Stammdaten V1

Stammdaten V1 sind die eine zentrale Quelle für Huus & Meer. Sie umfassen ausschließlich Unternehmensdaten, Kontaktwege, Bürozeiten, Social-Media-URLs und strukturierte Impressumsangaben. Header, Footer, Kontaktseite und weitere öffentliche Bereiche sollen diese Daten später gemeinsam verwenden; getrennte Bereichsstammdaten sind nicht vorgesehen.

Die Verwaltung umfasst Unternehmensname, Inhaber, Website und Anschrift; E-Mail, Telefon, WhatsApp und einen Büro-/Kontakt-Hinweis; Bürozeiten als sortierbare Zeitgruppen; Instagram, Facebook und TikTok als URLs sowie die bekannten Impressums- und Bankangaben. Eine Zeitgruppe enthält eine gemeinsame Regel mit Uhrzeit von/bis, Nach Vereinbarung und Termine nach Vereinbarung und kann mehreren Wochentagen zugeordnet sein. Jeder Wochentag darf höchstens einer Zeitgruppe angehören; nicht zugeordnete Tage gelten als geschlossen.

Admin-Benutzer, Rollen, Rechte, Passwörter, 2FA, Audit-Log und sonstige technische Einstellungen gehören nicht zu den Stammdaten. Sie bleiben einem späteren, getrennten Bereich Admin-Einstellungen vorbehalten. Es gibt genau einen zentralen Stammdatensatz; er wird nicht archiviert oder pro Website-Bereich dupliziert.

Hausboote werden bei Huus & Meer ausschließlich als Verkaufsangebote verwaltet. Es gibt keine Vermietungslogik für Hausboote.

Der verbindliche fachliche Datenumfang, die Veröffentlichung und die flexiblen Exposé-Einträge sind in [DATA-MODEL.md](./DATA-MODEL.md) beschrieben.

## Liegeplätze

Liegeplätze werden bei Huus & Meer ausschließlich als Verkaufsangebote verwaltet. Es gibt keine Vermietungslogik für Liegeplätze.

Das verbindliche Minimalmodell umfasst Titel bzw. Namen, mehrere Bilder, Veröffentlichungsstatus und die optionale Kennzeichnung „Hervorgehoben“. Zusätzliche technische oder kaufmännische Daten werden aktuell bewusst nicht modelliert.

Der öffentliche Hinweis „Zu verkaufen“ ergibt sich aus der fachlichen Einordnung als Verkaufsangebot und muss nicht als individuelles Feld gespeichert werden. Ebenso ist der Hinweis auf weitere Informationen, ein ausführliches Exposé oder einen Besichtigungstermin aktuell ein allgemeiner öffentlicher Kontakt-Hinweis und kein Feld eines einzelnen Liegeplatz-Angebots.

Die verbindlichen Liegeplatz-Entscheidungen und offenen Punkte sind in [DATA-MODEL.md](./DATA-MODEL.md) beschrieben.

## Services

Services werden hierarchisch verwaltet:

```text
Service-Kategorie
│
├── Service
├── Service
└── Service
```

Admin-Benutzer können beliebig viele Service-Kategorien anlegen. Unter jeder Kategorie können beliebig viele einzelne Services verwaltet werden. Kategorien und Services sind damit eigenständig erstell-, bearbeit-, aktivier- bzw. deaktivier- und sortierbar.

Die Kategorien „Leistungen“ und „Weitere Leistungen“ sind nur aktuelle inhaltliche Beispiele. Sie sind nicht fest programmiert und dürfen weder im Admin noch im späteren Frontend vorausgesetzt werden. Das Frontend soll Kategorien und Services später aus den verwalteten Daten beziehen.

Services erhalten aktuell kein allgemeines Preisfeld. Einzelne Preisangaben oder Verweise auf eine unverbindliche Preisliste auf der bestehenden Website begründen noch kein allgemeines Service-Preismodell.

Der verbindliche Datenumfang, die Beziehung zwischen Kategorie und Service sowie die aktuellen Beispiele sind in [DATA-MODEL.md](./DATA-MODEL.md) beschrieben.

## Stellenangebote

Stellenangebote sind eigenständige Inhalte und nicht fest im Frontend programmiert. Sie werden später vollständig über den Admin erstellt, angezeigt, bearbeitet, veröffentlicht sowie archiviert.

Ein Stellenangebot besitzt strukturierte Stammdaten, eine ausführliche Beschreibung, mehrere zuordenbare Arbeitsorte, sortierbare Aufgaben, sortierbare Qualifikationen und einen eigenen Bewerbungskontakt. Start- und Enddatum werden fachlich als echte Datumswerte und nicht als Freitext behandelt.

Verbindliche Veröffentlichungsstatus sind Entwurf, Veröffentlicht und Archiviert. Archivierte Angebote erscheinen nicht mehr regulär im öffentlichen Stellenangebotsbereich.

Die konkreten Felder, Beziehungen und das aktuelle Inhaltsbeispiel sind in [DATA-MODEL.md](./DATA-MODEL.md) beschrieben.

## Authentifizierung und Zugriffsschutz

## Admin-Einstellungen und Mein Konto

Admin-Einstellungen verwalten ausschließlich interne Administrator-Zugänge. In V1 gibt es nur die Rolle Administrator mit Vollzugriff. Aktive Administratoren können weitere Administratoren mit Name und eindeutiger E-Mail anlegen, fremde Namen und E-Mail-Adressen bearbeiten sowie fremde Konten aktivieren oder deaktivieren. Eine Selbst-Deaktivierung und die Deaktivierung des letzten aktiven Administrators sind ausgeschlossen.

Ein neuer Administrator erhält kein vorgegebenes Passwort und keine E-Mail. Stattdessen wird einmalig ein zeitlich begrenzter Einrichtungscode angezeigt und manuell übergeben. Der Code wird nicht im Klartext dauerhaft gespeichert, kann nur mit derselben E-Mail einmal verwendet werden und wird nach erfolgreicher Passwortvergabe ungültig. Über „Zugang einrichten“ kann der neue Administrator sein eigenes Passwort festlegen und wird anschließend aktiviert.

Unter „Mein Konto“ kann jeder aktive Administrator nur seinen eigenen Namen, seine eigene eindeutige E-Mail-Adresse und mit aktuellem Passwort sein Passwort ändern. Die neue E-Mail ist die künftige Login-Kennung. Eine Passwortänderung erneuert die Sitzung sicher. Dies ermöglicht die Übergabe an einen Eigentümer: Konto anlegen, Code sicher manuell übergeben, Zugang einrichten und danach das Entwickler-Konto deaktivieren.

Die öffentliche Website und der Admin-Bereich sind voneinander getrennt. Der Admin-Bereich ist ausschließlich für authentifizierte und aktive Admin-Benutzer zugänglich.

Der verbindliche fachliche Ablauf lautet:

```text
/admin/login
        ↓
Authentifizierung
        ↓
/admin
```

Nicht authentifizierte Benutzer dürfen keine geschützten Admin-Seiten oder Admin-APIs verwenden. Der Schutz darf nicht allein auf einer ausgeblendeten Navigation oder clientseitigen Prüfung beruhen: Sowohl Seitenzugriffe als auch lesende und schreibende Admin-Schnittstellen müssen serverseitig geschützt werden.

Ein Admin-Benutzer wird intern angelegt bzw. verwaltet; eine öffentliche Registrierung für Admin-Benutzer ist nicht vorgesehen. Fachlich umfasst ein Admin-Benutzer mindestens:

- Name
- E-Mail-Adresse
- Passwort beziehungsweise sicher verwaltete Zugangsdaten
- Rolle
- Aktiv/Inaktiv-Zustand

Das Passwort darf niemals im Klartext gespeichert werden. Deaktivierte Admin-Benutzer dürfen sich nicht mehr regulär anmelden und erhalten keinen Zugriff auf den Admin-Bereich oder Admin-APIs.

Für die erste Version ist ausschließlich die Rolle `Administrator` verbindlich vorgesehen. Ein Administrator besitzt Zugriff auf sämtliche Admin-Bereiche:

- Dashboard
- Hausboote
- Liegeplätze
- Service-Kategorien
- Services
- Stellenangebote
- Kontaktanfragen
- Anfragetypen
- Einstellungen

Die konkreten Login-Daten bestehen fachlich aus:

```text
E-Mail
Passwort
```

Nach erfolgreicher Authentifizierung erhält der Benutzer Zugriff auf den geschützten Admin-Bereich.

Obwohl zunächst nur `Administrator` benötigt wird, muss das fachliche Modell später weitere Rollen und differenzierte Berechtigungen ermöglichen können. Redakteur, Mitarbeiter, Superadmin, individuelle Rechte und Rechte pro CRUD-Aktion werden aktuell bewusst nicht festgelegt.

Vorgesehen und verbindlich sind damit:

- Login
- serverseitige Zugriffskontrolle
- geschützte Admin-Routen
- geschützte Admin-API
- sichere Passwortspeicherung
- sichere Verwaltung der Authentifizierungsinformationen
- Ausschluss deaktivierter Benutzer

Die konkrete Authentifizierungslösung und technische Umsetzung werden erst in einem späteren Schritt entschieden. Die verbindlichen Felder, Rollenregel und offenen Punkte sind in [DATA-MODEL.md](./DATA-MODEL.md) beschrieben.

## Kontaktanfragen

Kontaktanfragen werden über öffentliche Kontaktformulare erzeugt und anschließend vollständig im geschützten Admin-Bereich verwaltet. Es besteht kein Zwang, sie zusätzlich per E-Mail zu versenden.

Der verbindliche grundlegende Ablauf ist:

```text
Öffentliches Kontaktformular
        ↓
Kontaktanfrage
        ↓
API
        ↓
PostgreSQL
        ↓
Admin
```

Eine klassische „Kontaktanfrage erstellen“-Funktion im Admin ist nicht vorgesehen. Im Admin sollen Kontaktanfragen später:

- gelesen und in einer Übersicht angezeigt werden
- einzeln geöffnet werden
- bearbeitet werden
- kategorisiert werden
- einen Status erhalten
- als erledigt markiert werden
- optional interne Notizen erhalten

Anfragetypen sind frei verwaltbare Daten und nicht fest im Code vorgegeben. Sie können erstellt, bearbeitet, aktiviert bzw. deaktiviert und sortiert werden. Aktuelle Beispiele sind „Allgemeine Anfrage“, „Hausboot“, „Liegeplatz“, „Service“ und „Stellenangebot“.

Eine Kontaktanfrage besitzt immer genau einen Anfragetyp und optional höchstens einen konkreten Inhaltsbezug. Sie darf niemals gleichzeitig auf mehrere Inhaltsarten verweisen. Der Anfragetyp beschreibt den fachlichen Kontext und legt fest, ob kein Bezug, ein Hausboot, ein Liegeplatz, ein Service oder ein Stellenangebot zulässig ist. Wo eine echte Beziehung möglich ist, wird der Inhaltsname nicht lediglich als Freitext gespeichert.

Unterschiedliche öffentliche Bereiche können später passende Anfragetypen und, sofern vorhanden, den konkreten Bezug übermitteln. Das öffentliche Frontend soll diese Werte nicht als Freitext zusammenbauen.

Die verbindliche Grundstruktur, Statuswerte und offenen Punkte sind in [DATA-MODEL.md](./DATA-MODEL.md) beschrieben.

## Fachliche Leitlinien

- Die öffentliche Website und der Admin-Bereich greifen später auf dieselbe verbindliche Datenbasis zu.
- Hausboot-Stammdaten werden strukturiert gespeichert; wechselnde Exposé-Details bleiben flexibel erweiterbar.
- Veröffentlichte Inhalte müssen fachlich vollständig sein. Entwürfe dürfen während der Bearbeitung unvollständig sein.
- Veröffentlichungs- und Archivierungszustände müssen eindeutig nachvollziehbar sein.
- Medien benötigen eine festgelegte Reihenfolge, ein Titelbild und aussagekräftige Alt-Texte.
- Kontaktanfragen und interne Notizen sind als schützenswerte Daten zu behandeln.
- Technische Entscheidungen folgen den dokumentierten fachlichen Anforderungen und ersetzen sie nicht.

## Noch nicht Teil dieses Schritts

Diese Dokumentation autorisiert noch keine Implementierung von:

- PostgreSQL oder Datenbankmigrationen
- Prisma oder einem anderen ORM
- API-Routen
- Login, Authentifizierung oder Sessions
- Admin-Routen und Admin-Seiten
- CRUD-Oberflächen oder Formulare
- Dashboard-Komponenten
- Anbindung des öffentlichen Kontaktformulars

## Offene Entscheidungen

Vor einer technischen Umsetzung sind insbesondere noch zu definieren:

- zusätzliche technische oder kaufmännische Daten für Liegeplätze
- zentrale technische Verwaltung des allgemeinen Kontakt-Hinweises für Liegeplätze
- optionale Bilder oder Icons für Service-Kategorien und Services
- genaue technische Umsetzung von Aktiv/Inaktiv sowie Archivierung bei Services
- mögliches späteres Service-Preismodell
- konkrete Rich-Text-Technologie für Stellenbeschreibungen
- technische Modellierung von Arbeitsorten, Aufgaben, Qualifikationen und Bewerbungskontakten
- genaue Archivierungs- und Löschlogik für Stellenangebote
- Gehalt, Bewerbungsformular, Online-Bewerbung, Abteilungen, Benefits, Arbeitszeitmodell, Job-Kategorien, SEO-Felder, Slugs, automatische Veröffentlichung und Bewerbungsstatus
- konkrete Pflichtfelder für Kontaktformulare und Kontaktdaten
- technische Modellierung der Anfragetypen und Inhaltsbeziehungen
- mehrere interne Notizen gegenüber einer einzelnen Notiz sowie mögliche Zuständigkeiten
- Datenschutz-/Einwilligungsfelder, Captcha und Spam-Schutz
- Lösch- und Aufbewahrungsfristen für Kontaktanfragen
- automatische Benachrichtigungen, E-Mail-Benachrichtigungen und Statusänderungen
- Einstellungen und deren administrierbarer Umfang
- konkrete Authentifizierungsbibliothek
- Session-Technologie sowie JWT versus Session
- Passwort-Reset, Zwei-Faktor-Authentifizierung und E-Mail-Verifizierung
- weitere Rollen, Berechtigungen, individuelle Rechte und Rechte pro CRUD-Aktion
- Audit-Log, Login-Versuchsbegrenzung und automatische Abmeldung
- technische Datenbankstruktur für Admin-Benutzer, Rollen und Zugangsdaten
- Archivierungs-, Lösch- und Aufbewahrungsregeln je Bereich
- Dashboard-Kennzahlen und Prioritäten
- konkrete Authentifizierungslösung
- Datenbankzugriff bzw. ORM
- Medienablage und Bildverarbeitung
- URL-/Slug-Konzept und Detailseiten für Angebote
