# Admin-Bereich: Fachliches Datenmodell

## Status dieses Dokuments

Dieses Dokument beschreibt die fachliche Grundlage des späteren Datenmodells. Es enthält bewusst kein Prisma-Schema, keine SQL-Definitionen und keine Festlegung konkreter Datenbanktypen.

> Die Dokumentation ist die fachliche Quelle der Wahrheit für den Admin-Bereich. Änderungen am Datenmodell werden zuerst in der Dokumentation festgelegt und erst danach technisch implementiert.

## Modellierungsprinzipien

- Häufig benötigte, filterbare und fachlich stabile Informationen werden strukturiert gespeichert.
- Unterschiedliche oder künftig wechselnde Exposé-Details werden als flexible, sortierbare Einträge gespeichert.
- Entwürfe dürfen unvollständig sein. Vor einer Veröffentlichung müssen alle als verpflichtend definierten Veröffentlichungsdaten vollständig und valide sein.
- Veröffentlichte Angebote werden nicht stillschweigend gelöscht. Die fachlichen Regeln für Archivierung und endgültiges Löschen werden vor der Implementierung festgelegt.
- Beziehungen werden fachlich beschrieben; technische Schlüssel, Constraints und Kaskadenregeln folgen später.

## Übersicht der benötigten Entitäten

### Verbindlich definiert

1. **Hausboot-Angebot** – strukturiertes Verkaufsangebot eines Hausboots
2. **Hausboot-Bild** – geordnetes Bild mit Titelbild-Kennzeichnung und Alt-Text
3. **Hausboot-Exposé-Eintrag** – frei erweiterbarer, kategorisierter Detailpunkt
4. **Liegeplatz-Angebot** – schlankes Verkaufsangebot eines Liegeplatzes
5. **Liegeplatz-Bild** – geordnetes Bild mit Titelbild-Kennzeichnung und Alt-Text
6. **Service-Kategorie** – frei verwaltbare Gruppierung von Services
7. **Service** – einzelner, einer Kategorie zugeordneter Service
8. **Stellenangebot** – frei verwaltbarer Inhalt für eine ausgeschriebene Stelle
9. **Arbeitsort eines Stellenangebots** – einer Stelle zugeordneter Einsatzort
10. **Aufgabe eines Stellenangebots** – sortierbarer Zuständigkeits-Eintrag
11. **Qualifikation eines Stellenangebots** – sortierbarer Anforderungs-Eintrag
12. **Bewerbungskontakt** – fachlich abgegrenzte Kontaktinformationen zu einem Stellenangebot
13. **Anfragetyp** – frei verwaltbare Kategorie für Kontaktanfragen
14. **Kontaktanfrage** – öffentlich erzeugte und intern verwaltete Anfrage
15. **Admin-Benutzer** – intern angelegter Zugang zum geschützten Admin-Bereich
16. **Rolle** – fachliche Zugriffsebene eines Admin-Benutzers; zunächst ausschließlich `Administrator`
17. **Stammdaten V1** – zentrale Unternehmens-, Kontakt-, Bürozeiten-, Social-Media- und Impressumsquelle

### Benötigt, aber noch nicht fachlich definiert

- Einstellung

## Stammdaten V1

## Admin-Benutzer und Zugangseinrichtung

Ein Admin-Benutzer besitzt Name, eindeutige E-Mail, Rolle, Aktiv-Status und einen niemals im Klartext gespeicherten Passwort-Hash. Für neu angelegte Konten kann zusätzlich genau ein gehashter, zeitlich begrenzter Einrichtungscode mit Ablauf und Verwendungsstatus bestehen. Ein eingerichtetes Konto ist aktiv; ein verwendeter oder abgelaufener Code ist ungültig. Passwörter und Einrichtungscodes sind nicht auslesbar. Der letzte aktive Administrator sowie der eigene Account dürfen nicht deaktiviert werden.

Stammdaten V1 bilden genau eine zentrale, langlebige Konfiguration für Huus & Meer. Sie enthalten Unternehmensname, Inhaber, Website, Straße, PLZ, Ort und Land; E-Mail, Telefon, WhatsApp und einen Büro-/Kontakt-Hinweis; Bürozeiten als Zeitgruppen; Social-Media-URLs für Instagram, Facebook und TikTok sowie strukturierte Impressums- und Bankdaten.

Eine Zeitgruppe enthält eine gemeinsame Regel mit Uhrzeit von/bis, „Nach Vereinbarung“ und „Termine nach Vereinbarung“ sowie eine sortierbare Zuordnung von einem oder mehreren Wochentagen. Ein Wochentag darf nur einer Zeitgruppe zugeordnet sein. Nicht zugeordnete Wochentage gelten als geschlossen. Die öffentlichen Bereiche beziehen später dieselbe zentrale Quelle, ohne eigene Kopien der Daten zu führen. Stammdaten besitzen keine Beziehung zu Admin-Benutzern, Rollen, Rechten, Passwörtern oder technischen Admin-Einstellungen und werden nicht archiviert.

Für diese Bereiche werden in diesem Dokument ausdrücklich noch keine Felder, Beziehungen oder Statuswerte festgelegt.

## Hausboot-Angebot

### Fachliche Abgrenzung

Ein Hausboot-Angebot beschreibt ausschließlich ein Hausboot zum Verkauf. Eine Vermietungsart, Buchbarkeit, Verfügbarkeit pro Nacht oder andere Vermietungslogik gehört nicht zu diesem Modell.

Die Angebotsart „Verkauf“ ist damit eine feste fachliche Eigenschaft und aktuell keine auswählbare Alternative.

### Pflichtlogik

„Erforderlich“ bedeutet in der folgenden Tabelle: Die Information muss spätestens für die Veröffentlichung vollständig vorliegen. Ein Entwurf darf während seiner Bearbeitung noch unvollständig sein.

### Strukturierte Felder

| Bereich | Feld | Erforderlichkeit | Fachliche Bedeutung |
| --- | --- | --- | --- |
| System | Kennung | Erforderlich | Stabile interne Identität des Angebots; technische Ausgestaltung noch offen |
| Verkauf | Titel | Erforderlich | Öffentlicher Name des Verkaufsangebots |
| Verkauf | Standort | Erforderlich | Ort bzw. Standort des Hausboots |
| Verkauf | Preis | Erforderlich | Verkaufspreis als strukturiert auswertbarer Geldbetrag |
| Verkauf | Preis-Hinweis | Erforderlich | Ergänzung zum Preis, beispielsweise „Brutto“ |
| Technik | Baujahr | Erforderlich | Baujahr oder fachlich notwendiger Bauzeitraum, beispielsweise „2015/16“ |
| Technik | Hersteller | Erforderlich | Hersteller des Hausboots |
| Technik | Zulassung | Erforderlich | Art und Kennung der Zulassung |
| Technik | Länge | Erforderlich | Länge des Hausboots einschließlich fachlicher Maßeinheit |
| Technik | Breite | Erforderlich | Breite des Hausboots einschließlich fachlicher Maßeinheit |
| Technik | Rumpftyp | Erforderlich | Bauform des Rumpfs, beispielsweise „Katamaran“ |
| Technik | Bootstyp | Erforderlich | Typ bzw. Zulassungskategorie des Boots, beispielsweise „Sportboot“ |
| Technik | Design-Kategorie | Erforderlich | Zugeordnete Design-Kategorie |
| Technik | maximale Zuladung | Erforderlich | Maximal zulässige Angabe mit passender Bedeutung bzw. Einheit, im Beispiel „10 Personen“ |
| Technik | Anzahl Schlafplätze | Erforderlich | Anzahl der vorhandenen Schlafplätze |
| Veröffentlichung | Status | Erforderlich | Aktueller Veröffentlichungszustand |
| Veröffentlichung | Hervorgehoben | Optional | Kennzeichnet ein Angebot bei Bedarf als hervorgehoben |
| System | erstellt am | Erforderlich, systemgeführt | Zeitpunkt der Erstellung |
| System | geändert am | Erforderlich, systemgeführt | Zeitpunkt der letzten Änderung |

Die technische Repräsentation von Geldbeträgen, Maßeinheiten, Jahresbereichen und Kennungen wird später entschieden. Fachlich müssen diese Angaben verlustfrei und eindeutig abbildbar sein.

### Veröffentlichungsstatus

Für Hausboot-Angebote gelten verbindlich diese Statuswerte:

| Status | Bedeutung |
| --- | --- |
| Entwurf | Noch nicht öffentlich; darf unvollständig sein |
| Veröffentlicht | Öffentlich sichtbar; alle Veröffentlichungsanforderungen müssen erfüllt sein |
| Archiviert | Nicht mehr als aktuelles Verkaufsangebot veröffentlicht, bleibt intern nachvollziehbar |

„Hervorgehoben“ ist kein eigener Status, sondern eine optionale zusätzliche Kennzeichnung.

## Hausboot-Bild

Ein Hausboot-Angebot kann mehrere Bilder besitzen. Bilder werden als eigene, dem Angebot zugeordnete Einträge betrachtet.

| Feld | Erforderlichkeit | Fachliche Bedeutung |
| --- | --- | --- |
| Kennung | Erforderlich | Stabile interne Identität des Bildes |
| Bildreferenz | Erforderlich | Verweis auf die gespeicherte Bilddatei; konkrete Medienablage noch offen |
| Titelbild | Erforderlich | Kennzeichnet, ob das Bild das Titelbild des Angebots ist |
| Reihenfolge | Erforderlich | Bestimmt die sichtbare Reihenfolge innerhalb der Galerie |
| Alt-Text | Erforderlich für Veröffentlichung | Inhaltlich aussagekräftige Alternativbeschreibung des Bildes |

Fachliche Regeln:

- Ein veröffentlichtes Hausboot-Angebot benötigt mindestens ein Bild.
- Ein veröffentlichtes Angebot besitzt genau ein Titelbild.
- Jedes Bild gehört genau zu einem Hausboot-Angebot.
- Die Reihenfolge muss innerhalb eines Angebots eindeutig und veränderbar sein.
- Bilder ohne ausreichenden Alt-Text verhindern die Veröffentlichung.

## Hausboot-Exposé-Eintrag

Exposé-Einträge bilden Informationen ab, die nicht als dauerhaft feste Spalten des Hausboot-Angebots modelliert werden sollen.

| Feld | Erforderlichkeit | Fachliche Bedeutung |
| --- | --- | --- |
| Kennung | Erforderlich | Stabile interne Identität des Eintrags |
| Kategorie | Erforderlich | Gruppierung, beispielsweise „Heizung“, „Türen & Fenster“ oder „Zustand“ |
| Bezeichnung | Erforderlich | Kurzer Name des beschriebenen Merkmals |
| Beschreibung | Erforderlich | Freie fachliche Beschreibung des Merkmals |
| Reihenfolge | Erforderlich | Sortierung innerhalb des Exposés |

Fachliche Regeln:

- Ein Hausboot-Angebot kann beliebig viele Exposé-Einträge besitzen.
- Jeder Exposé-Eintrag gehört genau zu einem Hausboot-Angebot.
- Kategorien sind fachliche Gruppierungen; ob sie später frei eingegeben oder zentral verwaltet werden, ist noch offen.
- Bezeichnung und Beschreibung bleiben Freitext, damit neue Exposé-Informationen ohne Änderung des Datenbankschemas ergänzt werden können.
- Die vollständige Exposé-Beschreibung wird nicht in zahlreiche einmalige Datenbankfelder zerlegt.

## Beziehungen

```text
Hausboot-Angebot
├── besitzt 0..n Hausboot-Bilder
└── besitzt 0..n Hausboot-Exposé-Einträge
```

Für einen Entwurf sind zunächst null Bilder und null Exposé-Einträge zulässig. Für die Veröffentlichung gilt mindestens die oben beschriebene Bildanforderung. Eine Mindestanzahl flexibler Exposé-Einträge ist noch nicht festgelegt.

## Beispiel: Kaddi's Sunshine

Dieses Beispiel veranschaulicht ausschließlich die Anwendung des Modells. Es erweitert das Modell nicht um zusätzliche verbindliche Felder.

### Strukturierte Angebotsdaten

| Feld | Beispielwert |
| --- | --- |
| Angebotsart | Verkauf |
| Titel | Kaddi's Sunshine |
| Standort | Fehmarn |
| Preis | 198.500 € |
| Preis-Hinweis | Brutto |
| Baujahr | 2015/16 |
| Hersteller | STERN-Hausboot GmbH Fehmarn |
| Zulassung | Sportbootzulassung DE-SHG D 024-021615 |
| Länge | 12,00 m |
| Breite | 5,00 m |
| Rumpftyp | Katamaran |
| Bootstyp | Sportboot |
| Design-Kategorie | D |
| maximale Zuladung | 10 Personen |
| Anzahl Schlafplätze | 6 |

### Beispielhafte flexible Exposé-Einträge

| Kategorie | Bezeichnung | Beschreibung |
| --- | --- | --- |
| Zustand | Heckterrasse | Neu beplankt in 2025 |
| Zustand | Oberdeck | Neu beplankt in 2025 |
| Zustand | Unterwasserschiff | Neu gestrichen in 2025 |
| Zustand | Wartung | Kein Wartungsstau |
| Heizung | Deckenheizungen | 5 elektrische Deckenheizungen |
| Sanitär | Fäkalientank | 1.000 l |
| Warmwasser | Boiler | 40 l |
| Elektrik | Spannungsversorgung | 230 V / 12 V |
| Elektrik | Außensteckdosen | Außensteckdosen |
| Sicherheit | Feuerlöscher | 2 × ABC-Feuerlöscher |
| Medien | SAT-Anlage | SAT-Anlage |
| Küche | Gasherd | 3-flammiger Gasherd |
| Küche | Pantry-Küche | Pantry-Küche |
| Ausstattung | Glasbodenfenster | Glasbodenfenster |
| Ausstattung | Strandkorb | Strandkorb |
| Ausstattung | Palettenmöbel | Mit Sitzkissen |

Weitere technische und bauliche Angaben aus dem Exposé können nach demselben Prinzip ergänzt und sortiert werden.

## Liegeplatz-Angebot

### Fachliche Abgrenzung

Ein Liegeplatz-Angebot beschreibt ausschließlich einen Liegeplatz zum Verkauf. Eine Vermietungsart, Buchbarkeit, Verfügbarkeit oder andere Vermietungslogik gehört nicht zu diesem Modell.

Die Angebotsart „Verkauf“ ist damit eine feste fachliche Eigenschaft und aktuell keine auswählbare Alternative. Der öffentliche Hinweis „Zu verkaufen“ kann aus dieser fachlichen Einordnung abgeleitet werden und muss nicht als eigenes Feld des Angebots gespeichert werden.

### Pflichtlogik

„Erforderlich“ bedeutet auch bei Liegeplätzen: Die Information muss spätestens für die Veröffentlichung vollständig vorliegen. Ein Entwurf darf während seiner Bearbeitung noch unvollständig sein.

### Strukturierte Felder

| Bereich | Feld | Erforderlichkeit | Fachliche Bedeutung |
| --- | --- | --- | --- |
| System | Kennung | Erforderlich | Stabile interne Identität des Angebots; technische Ausgestaltung noch offen |
| Verkauf | Titel / Name | Erforderlich | Öffentlicher Name des Liegeplatz-Angebots, beispielsweise „Marina Großenbrode Mola Yachting“ |
| Veröffentlichung | Status | Erforderlich | Aktueller Veröffentlichungszustand |
| Veröffentlichung | Hervorgehoben | Optional | Kennzeichnet ein Angebot bei Bedarf als hervorgehoben |
| System | erstellt am | Erforderlich, systemgeführt | Zeitpunkt der Erstellung |
| System | geändert am | Erforderlich, systemgeführt | Zeitpunkt der letzten Änderung |

Es werden aktuell keine zusätzlichen technischen oder kaufmännischen Felder für Liegeplätze festgelegt.

### Veröffentlichungsstatus

Für Liegeplatz-Angebote gelten dieselben verbindlichen Statuswerte wie für Hausboot-Angebote:

| Status | Bedeutung |
| --- | --- |
| Entwurf | Noch nicht öffentlich; darf unvollständig sein |
| Veröffentlicht | Öffentlich sichtbar; alle Veröffentlichungsanforderungen müssen erfüllt sein |
| Archiviert | Nicht mehr als aktuelles Verkaufsangebot veröffentlicht, bleibt intern nachvollziehbar |

„Hervorgehoben“ ist kein eigener Status, sondern eine optionale zusätzliche Kennzeichnung.

## Liegeplatz-Bild

Ein Liegeplatz-Angebot kann mehrere Bilder besitzen. Bilder werden als eigene, dem Angebot zugeordnete Einträge betrachtet.

| Feld | Erforderlichkeit | Fachliche Bedeutung |
| --- | --- | --- |
| Kennung | Erforderlich | Stabile interne Identität des Bildes |
| Bildreferenz | Erforderlich | Verweis auf die gespeicherte Bilddatei; konkrete Medienablage noch offen |
| Titelbild | Erforderlich | Kennzeichnet, ob das Bild das Titelbild des Angebots ist |
| Reihenfolge | Erforderlich | Bestimmt die sichtbare Reihenfolge innerhalb der Galerie |
| Alt-Text | Erforderlich für Veröffentlichung | Inhaltlich aussagekräftige Alternativbeschreibung des Bildes |

Fachliche Regeln:

- Ein veröffentlichtes Liegeplatz-Angebot benötigt mindestens ein Bild.
- Ein veröffentlichtes Angebot besitzt genau ein Titelbild.
- Jedes Bild gehört genau zu einem Liegeplatz-Angebot.
- Die Reihenfolge muss innerhalb eines Angebots eindeutig und veränderbar sein.
- Bilder ohne ausreichenden Alt-Text verhindern die Veröffentlichung.

### Öffentliche Darstellung und Kontakt-Hinweis

Die öffentliche Darstellung eines Liegeplatz-Angebots besteht aktuell sinngemäß aus:

```text
Zu verkaufen

Marina Großenbrode Mola Yachting

[Bildergalerie]

Melden Sie sich bei uns für weitere Informationen,
ein ausführliches Exposé oder einen Besichtigungstermin.
```

Der Kontakt-Hinweis ist aktuell ein allgemeiner öffentlicher Hinweis. Er wird nicht als individueller Text oder Feld eines einzelnen Liegeplatz-Angebots gespeichert. Die technische Umsetzung eines später zentral verwaltbaren Kontakt-Hinweises wird erst in einem späteren Schritt entschieden.

### Beziehungen

```text
Liegeplatz-Angebot
└── besitzt 0..n Liegeplatz-Bilder
```

Für einen Entwurf sind zunächst null Bilder zulässig. Für die Veröffentlichung gilt mindestens die oben beschriebene Bildanforderung.

### Nicht festgelegte Liegeplatz-Daten

Die folgenden Informationen werden aktuell bewusst nicht modelliert und nur ergänzt, wenn sie für tatsächliche Huus-&-Meer-Angebote benötigt werden:

- zusätzliche technische Daten
- Preise
- Maße
- Standortdetails
- Verfügbarkeiten
- Ansprechpartner
- individuelle Exposé-Texte
- Slugs
- SEO-Felder

## Services

### Hierarchisches System

Services bestehen verbindlich aus zwei Ebenen:

```text
Service-Kategorie
│
├── Service
├── Service
└── Service
```

Service-Kategorien sind frei verwaltbare Inhalte. Ein Admin-Benutzer kann beliebig viele Kategorien erstellen. Unter jeder Kategorie können beliebig viele Services erstellt werden.

Die aktuell verwendeten Bezeichnungen „Leistungen“ und „Weitere Leistungen“ sind ausschließlich Beispiele für aktuelle Inhalte. Sie sind keine fest im Code oder Datenmodell vorgegebenen Kategorien. Das spätere Frontend muss die Kategorien und Services aus den verwalteten Daten beziehen.

## Service-Kategorie

| Feld | Erforderlichkeit | Fachliche Bedeutung |
| --- | --- | --- |
| Name | Erforderlich | Sichtbare Bezeichnung der Kategorie |
| Beschreibung | Optional | Zusätzliche Erläuterung der Kategorie |
| Reihenfolge | Erforderlich | Bestimmt die Ausgabereihenfolge der Kategorien |
| Aktiv/Inaktiv | Erforderlich | Steuert, ob die Kategorie aktuell verwendet bzw. öffentlich berücksichtigt wird |

Eine Service-Kategorie kann erstellt, angezeigt, bearbeitet, sortiert sowie archiviert bzw. deaktiviert werden. Ein optionales Bild oder Icon wird aktuell nicht modelliert und kann später ergänzt werden.

## Service

| Feld | Erforderlichkeit | Fachliche Bedeutung |
| --- | --- | --- |
| Titel | Erforderlich | Sichtbarer Name des einzelnen Services |
| Beschreibung | Erforderlich | Inhaltliche Erläuterung des Services |
| Kategorie | Erforderlich | Zugehörige Service-Kategorie |
| Reihenfolge | Erforderlich | Bestimmt die Ausgabereihenfolge innerhalb der Kategorie |
| Aktiv/Inaktiv | Erforderlich | Steuert, ob der Service aktuell verwendet bzw. öffentlich berücksichtigt wird |

Ein Service kann erstellt, angezeigt, bearbeitet, sortiert sowie archiviert bzw. deaktiviert werden. Ein optionales Bild oder Icon wird aktuell nicht modelliert und kann später ergänzt werden.

### Beziehung

```text
Service-Kategorie
       │
       │ 1:n
       ▼
Service
```

Eine Service-Kategorie kann viele Services enthalten. Ein Service gehört genau zu einer Service-Kategorie.

### Keine allgemeine Preislogik

Services erhalten aktuell kein allgemeines Preisfeld. Die bestehende Website enthält zwar einzelne Preisangaben bzw. Verweise auf eine unverbindliche Preisliste, ein allgemeines Service-Preismodell ist jedoch noch nicht entschieden.

Preisfelder werden daher aktuell nicht im Datenmodell für Services oder Service-Kategorien festgelegt.

### Aktuelle Inhalte als Beispiele

Die folgenden Inhalte dienen ausschließlich als Beispiele für die spätere Datenpflege. Sie sind weder fest programmierte Kategorien noch verbindliche, dauerhaft vorhandene Services.

```text
Kategorie:
Leistungen

Services:
- Gästebetreuung
- Eigentümerbetreuung
- Reinigung Matratzenschoner, Inlett Schonbezüge und Tagesdecken
- Starter-Set für Gäste
- Online-Werbung
- Verwaltung der Kurtaxe
- Kurtaxen-Inkasso für externe Vermietagenturen
```

```text
Kategorie:
Weitere Leistungen

Services:
- Vermietung auf Online-Plattformen
- Sichtkontrolle Außen & Innen
- Inventarcheckliste
- Entfernung von Spinnenweben und leichten Flecken
- Entkalken von Wasserkocher und Kaffeemaschine
- Reinigung des Kücheninventars
- Funktionskontrolle
- Erreichbarkeit für Gäste und Eigentümer
- Problemlösungen während des Aufenthalts
- Kleine Aufmerksamkeit für Hochzeitspaare oder Geburtstage
- Sicherungspaket bei Sturm und Hochwasser
- Ein- und Auswintern
- Grund- und Endreinigung
- Bettwäscheservice
- Tankentleerung
- Wartung Kläranlage
- Reparaturen und zusätzliche Arbeiten
```

## Stellenangebot

### Fachliche Abgrenzung

Stellenangebote sind eigenständige, vollständig im Admin verwaltbare Inhalte. Sie werden nicht fest im Frontend programmiert. Ein Admin-Benutzer soll Stellenangebote später erstellen, anzeigen, bearbeiten, veröffentlichen sowie archivieren können.

### Strukturierte Stammdaten

| Feld | Erforderlichkeit | Fachliche Bedeutung |
| --- | --- | --- |
| Stellenbezeichnung / Titel | Erforderlich | Öffentlicher Titel des Stellenangebots |
| Arbeitgeber | Erforderlich | Arbeitgeber des Stellenangebots |
| Arbeitspensum | Erforderlich | Umfang der Beschäftigung, beispielsweise „Teilzeit/Minijob“ |
| Startdatum | Erforderlich | Fachliches Datum für den Beginn der Stelle; kein Freitext |
| Enddatum | Erforderlich | Fachliches Datum für das Ende der Stelle; kein Freitext |
| Arbeitszeiten | Erforderlich | Angabe zu Arbeitszeit oder zeitlichem Rahmen |
| Beschreibung | Erforderlich | Ausführlicher, formatierbarer Beschreibungstext |
| Veröffentlichungsstatus | Erforderlich | Aktueller Veröffentlichungszustand |

Startdatum und Enddatum müssen fachlich als echte Datumswerte abbildbar sein. Beispiel: `01.04.2026` als Startdatum und `31.10.2026` als Enddatum.

Die Beschreibung kann längeren formatierten Inhalt enthalten, beispielsweise eine Unternehmensbeschreibung, die Beschreibung der Tätigkeit, Informationen zum Team oder besondere Hinweise. Die konkrete Rich-Text-Technologie wird nicht festgelegt.

### Arbeitsorte

Ein Stellenangebot kann mehrere Arbeitsorte besitzen. Ein Arbeitsort darf daher nicht als einzelner Textwert des Stellenangebots modelliert werden.

```text
Arbeitsorte
├── Fehmarn
├── Großenbrode
└── Heiligenhafen
```

Der Admin soll später beliebig viele Arbeitsorte einem Stellenangebot zuordnen können. Die konkrete technische Umsetzung dieser Zuordnung wird später entschieden.

### Aufgaben / Zuständigkeiten

Aufgaben werden nicht als ein großer Textblock gespeichert. Ein Stellenangebot besitzt stattdessen eine sortierbare Liste einzelner Aufgaben.

| Feld | Erforderlichkeit | Fachliche Bedeutung |
| --- | --- | --- |
| Aufgabe | Erforderlich | Einzelne Zuständigkeit oder Tätigkeit |
| Reihenfolge | Erforderlich | Bestimmt die Ausgabereihenfolge in der Aufgabenliste |

Der Admin soll Aufgaben später hinzufügen, bearbeiten, löschen und sortieren können.

### Qualifikationen / Anforderungen

Qualifikationen werden ebenfalls als sortierbare Liste einzelner Einträge verwaltet.

| Feld | Erforderlichkeit | Fachliche Bedeutung |
| --- | --- | --- |
| Qualifikation | Erforderlich | Einzelne Anforderung oder gewünschte Qualifikation |
| Reihenfolge | Erforderlich | Bestimmt die Ausgabereihenfolge in der Qualifikationsliste |

Der Admin soll Qualifikationen später hinzufügen, bearbeiten, löschen und sortieren können.

### Bewerbungskontakt

Der Bewerbungskontakt ist ein eigener fachlicher Bereich und kein Bestandteil des Beschreibungstextes. Er kann folgende Angaben enthalten:

| Feld | Erforderlichkeit | Fachliche Bedeutung |
| --- | --- | --- |
| Ansprechpartner | Optional | Kontaktperson für Bewerbungen |
| E-Mail | Optional | E-Mail-Adresse für Bewerbungen |
| Telefon | Optional | Telefonnummer für Bewerbungen |
| WhatsApp | Optional | WhatsApp-Kontakt für Bewerbungen |
| Adresse | Optional | Postanschrift für Bewerbungen |

Die konkrete technische Speicherung und die spätere Mindestanforderung an Kontaktangaben werden noch nicht entschieden.

### Veröffentlichungsstatus

Für Stellenangebote gelten verbindlich diese Statuswerte:

| Status | Bedeutung |
| --- | --- |
| Entwurf | Noch nicht öffentlich; darf unvollständig sein |
| Veröffentlicht | Öffentlich sichtbar |
| Archiviert | Erscheint nicht mehr regulär im öffentlichen Stellenangebotsbereich |

Der Status soll später vom Admin geändert werden können. Die genaue Archivierungs- und Löschlogik bleibt offen.

### Beziehungen

```text
Stellenangebot
├── besitzt 1..n Arbeitsorte
├── besitzt 0..n Aufgaben
├── besitzt 0..n Qualifikationen
└── besitzt 0..1 Bewerbungskontakt
```

Ein Arbeitsort, eine Aufgabe und eine Qualifikation gehören jeweils genau zu einem Stellenangebot. Ein Bewerbungskontakt ist fachlich einem Stellenangebot zugeordnet; die technische Speicherung wird später entschieden.

### Beispiel: Reinigungskraft Teilzeit/Minijob (m/w/d)

Dieses Beispiel dient ausschließlich als Grundlage für die spätere Datenpflege. Es ist kein fest programmierter Inhalt und erweitert das Modell nicht um zusätzliche verbindliche Felder.

#### Strukturierte Stammdaten

| Feld | Beispielwert |
| --- | --- |
| Titel | Reinigungskraft Teilzeit/Minijob (m/w/d) |
| Arbeitgeber | Huus und Meer |
| Arbeitspensum | Teilzeit/Minijob |
| Startdatum | 01.04.2026 |
| Enddatum | 31.10.2026 |
| Arbeitszeiten | Flexibel zwischen 5–15 Stunden pro Woche |

#### Arbeitsorte

- Fehmarn
- Großenbrode
- Heiligenhafen

#### Beispielhafte Beschreibung

Die ausführliche Beschreibung kann Inhalte zur Unternehmensbeschreibung, zur Tätigkeit, zum Team und zu besonderen Hinweisen enthalten.

#### Beispielhafte Aufgaben

1. Reinigung der Gästezimmer nach Abreise
2. Wechseln von Bettwäsche und Handtüchern
3. Bodenpflege
4. Reinigung von Küchen- und Sanitärbereichen
5. Kontrolle der Ausstattung
6. Schäden oder Reparaturbedarf melden

#### Beispielhafte Qualifikationen

1. Erfahrung in der Reinigungsbranche
2. Zuverlässigkeit und Pünktlichkeit
3. Selbstständige und gründliche Arbeitsweise
4. Freundliches Auftreten und Teamfähigkeit
5. Bereitschaft zur Arbeit an Wochenenden und Feiertagen

#### Beispielhafter Bewerbungskontakt

| Feld | Beispielwert |
| --- | --- |
| Ansprechpartner | Frau Olga Kaul |
| Adresse | Huus & Meer, Wallnau 1, 23769 Fehmarn |
| WhatsApp | 0172 9068363 |
| E-Mail | moin@huus-und-meer.de |

### Nicht festgelegte Stellenangebots-Daten

Die folgenden Informationen werden aktuell bewusst nicht modelliert und nur ergänzt, wenn ein tatsächlicher fachlicher Bedarf besteht:

- Gehalt
- Bewerbungsformular
- Online-Bewerbung
- Ansprechpartner als eigener Benutzer
- Abteilungen
- Benefits als eigenes Datenmodell
- Arbeitszeitmodell als separates Datenmodell
- Job-Kategorien
- SEO-Felder
- Slugs
- automatische Veröffentlichung
- Bewerbungsstatus

## Kontaktanfragen und Anfragetypen

### Fachliche Abgrenzung

Kontaktanfragen werden über öffentliche Kontaktformulare erzeugt und anschließend im geschützten Admin-Bereich verwaltet. Es besteht kein Zwang, Kontaktanfragen zusätzlich per E-Mail zu versenden.

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

Der Admin soll Kontaktanfragen später anzeigen, öffnen, bearbeiten, kategorisieren, einem Status zuordnen, mit internen Notizen versehen und als erledigt markieren können. Eine klassische Erstellung von Kontaktanfragen im Admin ist nicht vorgesehen.

### Anfragetyp

Anfragetypen sind selbst verwaltbare Daten. Sie dürfen nicht fest im Code vorgegeben werden.

| Feld | Erforderlichkeit | Fachliche Bedeutung |
| --- | --- | --- |
| Name | Erforderlich | Sichtbare Bezeichnung des fachlichen Kontexts |
| Zulässige Bezugsart | Erforderlich | Legt fest, ob dieser Anfragetyp keinen Bezug, ein Hausboot, einen Liegeplatz, einen Service oder ein Stellenangebot referenzieren darf |
| Aktiv/Inaktiv | Erforderlich | Steuert, ob der Anfragetyp aktuell in öffentlichen Formularen und im Admin verwendet werden kann |
| Reihenfolge | Erforderlich | Bestimmt die Ausgabereihenfolge der Anfragetypen |

Der Admin soll Anfragetypen später erstellen, bearbeiten, aktivieren bzw. deaktivieren und sortieren können.

Aktuelle Beispiele sind:

```text
Allgemeine Anfrage
Hausboot
Liegeplatz
Service
Stellenangebot
```

Diese Liste ist nicht unveränderlich. Sie dient nur als aktuelles Beispiel und darf weder im Admin noch im späteren Frontend fest vorausgesetzt werden.

### Kontaktanfrage: Fachliche Grundstruktur

Eine Kontaktanfrage besitzt grundsätzlich diese Bereiche:

```text
Kontaktanfrage
│
├── Kontaktdaten des Absenders
├── Nachricht
├── Anfragetyp
├── optionaler Bezug
├── Status
├── interne Notizen
├── erstellt am
└── geändert am
```

| Bereich | Erforderlichkeit | Fachliche Bedeutung |
| --- | --- | --- |
| Kontaktdaten des Absenders | Pflichtfelder noch offen | Angaben zur kontaktaufnehmenden Person; Name, E-Mail, Telefon und weitere Pflichtangaben sind noch nicht entschieden |
| Nachricht | Erforderlichkeit noch offen | Inhalt der Anfrage |
| Anfragetyp | Erforderlich | Fachlicher Kontext der Anfrage |
| Bezug | Optional | Konkreter Inhalt, auf den sich die Anfrage bezieht |
| Status | Erforderlich | Bearbeitungsstand der Anfrage |
| interne Notizen | Optional | Nicht öffentliche Hinweise zur Bearbeitung |
| erstellt am | Erforderlich, systemgeführt | Zeitpunkt der Erstellung |
| geändert am | Erforderlich, systemgeführt | Zeitpunkt der letzten Änderung |

### Anfragetyp und optionaler Bezug

Der Anfragetyp beschreibt den fachlichen Kontext der Anfrage und legt ihre zulässige Bezugsart fest. Eine Kontaktanfrage besitzt optional keinen oder genau einen konkreten Bezug. Sie darf niemals gleichzeitig mehrere Inhaltsbezüge besitzen.

```text
Anfragetyp:
Hausboot

Bezug:
Kaddi's Sunshine
```

Wenn eine echte relationale Verknüpfung zu einem verwalteten Inhalt möglich ist, soll dessen Name nicht lediglich als Freitext in der Kontaktanfrage gespeichert werden.

Beispielhafte fachliche Zuordnungen:

| Anfragetyp | Optionaler Bezug |
| --- | --- |
| Allgemeine Anfrage | keiner |
| Hausboot | Kaddi's Sunshine |
| Liegeplatz | Marina Großenbrode Mola Yachting |
| Service | Eigentümerbetreuung bzw. konkreter Service |
| Stellenangebot | Reinigungskraft Teilzeit/Minijob (m/w/d) |

### Status

Für Kontaktanfragen gelten zunächst verbindlich diese Statuswerte:

| Status | Bedeutung |
| --- | --- |
| Neu | Neu eingegangene, noch nicht begonnene Anfrage |
| In Bearbeitung | Anfrage wird intern bearbeitet |
| Erledigt | Bearbeitung ist abgeschlossen |

Der Status soll später im Admin geändert werden können. Weitere Statuswerte werden erst bei tatsächlichem fachlichem Bedarf ergänzt.

### Interne Notizen

Kontaktanfragen können interne Notizen unterstützen. Diese Notizen:

- sind ausschließlich für den geschützten Admin-Bereich bestimmt
- werden nicht öffentlich angezeigt
- dienen der internen Bearbeitung

Beispiel:

```text
Kunde am 20.08. zurückrufen.
```

Ob künftig mehrere eigenständige Notizen oder nur eine Notiz je Kontaktanfrage technisch modelliert wird, ist noch nicht entschieden.

### Öffentliche Kontaktformulare

Unterschiedliche öffentliche Bereiche können künftig unterschiedliche Anfragetypen erzeugen:

```text
Kontaktformular
    → Allgemeine Anfrage

Hausboot-Inserat
    → Hausboot + konkretes Hausboot

Liegeplatz-Inserat
    → Liegeplatz + konkreter Liegeplatz

Service-Bereich
    → Service + konkreter Service

Stellenangebot
    → Stellenangebot + konkrete Stelle
```

Das öffentliche Frontend soll den passenden Anfragetyp und – sofern vorhanden – den konkreten Bezug übermitteln. Es soll diese Daten nicht als zusammengebauten Freitext darstellen.

### Beziehungen

```text
Anfragetyp
└── besitzt 0..n Kontaktanfragen

Kontaktanfrage
├── gehört zu genau einem Anfragetyp
├── verweist optional auf genau einen konkreten Inhalt
└── besitzt 0..n interne Notizen
```

Die zulässige Bezugsart wird durch den Anfragetyp festgelegt. Fachlich unpassende Kombinationen und mehrere gleichzeitige Inhaltsbezüge sind nicht zulässig.

### Nicht festgelegte Kontaktanfrage-Daten

Die folgenden Punkte werden aktuell bewusst nicht entschieden:

- konkrete Pflichtfelder des Kontaktformulars
- Name bzw. Vorname als Pflichtfeld
- E-Mail als Pflichtfeld
- Telefonnummer als Pflichtfeld
- Datenschutz- und Einwilligungsfelder
- Captcha und Spam-Schutz
- Lösch- und Aufbewahrungsfristen
- automatische Benachrichtigungen
- E-Mail-Benachrichtigungen
- automatische Statusänderungen

## Admin-Benutzer, Login und Rollen

### Geschützter Admin-Bereich

Die öffentliche Website und der Admin-Bereich sind fachlich getrennt. Ausschließlich authentifizierte und aktive Admin-Benutzer dürfen geschützte Admin-Seiten sowie Admin-APIs verwenden.

```text
/admin/login
        ↓
Authentifizierung
        ↓
/admin
```

Nicht authentifizierte Benutzer erhalten keinen Zugriff auf geschützte Admin-Seiten oder Admin-APIs. Der Schutz ist serverseitig durchzusetzen; eine ausgeblendete Navigation oder eine ausschließlich clientseitige Prüfung genügt nicht.

### Admin-Benutzer

Ein Admin-Benutzer wird intern angelegt und verwaltet. Eine öffentliche Registrierung für Admin-Benutzer ist nicht vorgesehen.

| Feld | Erforderlichkeit | Fachliche Bedeutung |
| --- | --- | --- |
| Name | Erforderlich | Interne Zuordnung des Benutzerkontos zu einer Person |
| E-Mail-Adresse | Erforderlich | Login-Kennung und Kontaktadresse des Admin-Benutzers |
| Zugangsdaten | Erforderlich | Passwort beziehungsweise sicher verwaltete Zugangsdaten; niemals im Klartext speichern |
| Rolle | Erforderlich | Fachliche Zugriffsebene des Admin-Benutzers |
| Aktiv/Inaktiv | Erforderlich | Steuert, ob eine reguläre Anmeldung und ein Zugriff zulässig sind |

Ein deaktivierter Admin-Benutzer darf sich nicht mehr regulär anmelden und erhält keinen Zugriff auf den Admin-Bereich oder Admin-APIs.

### Login

Der geschützte Login verwendet fachlich die Angaben:

```text
E-Mail
Passwort
```

Nach erfolgreicher Authentifizierung erhält ein aktiver Admin-Benutzer Zugriff auf den geschützten Admin-Bereich. Passwörter dürfen niemals im Klartext gespeichert werden; Authentifizierungsinformationen sind sicher zu verwalten.

### Rolle und Zugriff

Für die erste Version ist genau eine Rolle verbindlich vorgesehen:

| Rolle | Zugriff |
| --- | --- |
| Administrator | Vollzugriff auf Dashboard, Hausboote, Liegeplätze, Service-Kategorien, Services, Stellenangebote, Kontaktanfragen, Anfragetypen und Einstellungen |

Fachliche Beziehung:

```text
Rolle
  │ 1:n
  ▼
Admin-Benutzer
```

Ein Admin-Benutzer besitzt genau eine Rolle. Für die erste Version ist diese Rolle immer `Administrator`.

Das Modell soll später weitere Rollen und differenzierte Berechtigungen ermöglichen können. Redakteur, Mitarbeiter, Superadmin, individuelle Rechte und Rechte pro CRUD-Aktion sind aktuell bewusst nicht festgelegt.

### Nicht festgelegte Admin-Zugriffsdaten

Die folgenden Punkte werden erst bei der technischen Architektur entschieden:

- konkrete Authentifizierungsbibliothek
- Session-Technologie sowie JWT versus Session
- technische Passwort- und Session-Verwaltung
- Passwort-Reset
- Zwei-Faktor-Authentifizierung
- E-Mail-Verifizierung
- weitere Rollen sowie Rollen- und Berechtigungsverwaltung
- individuelle Rechte und Rechte pro CRUD-Aktion
- Audit-Log
- Login-Versuchsbegrenzung
- automatische Abmeldung
- technische Datenbankstruktur

## Strukturierte und flexible Informationen

Strukturiert bleiben:

- Verkaufsinformationen
- technische Stammdaten
- Veröffentlichungszustand
- Hervorhebung
- Medienzuordnung und Medienreihenfolge
- Systemzeitpunkte

Flexibel bleiben:

- wechselnde Ausstattungsmerkmale
- Zustands- und Wartungsangaben
- technische Einzelheiten außerhalb der verbindlichen Stammdaten
- bauliche Besonderheiten
- zusätzliche Inhalte aus individuellen Exposés

Ein flexibler Eintrag darf nicht dazu verwendet werden, ein verbindliches strukturiertes Feld wie Preis, Standort oder Veröffentlichungsstatus zu ersetzen.

## Offene Entscheidungen

Vor einer technischen Umsetzung sind für Hausboote noch zu klären:

- Format und Erzeugung der internen Kennungen
- technische Darstellung von Preis und Währung
- technische Darstellung von Maßen und Einheiten
- Behandlung des Baujahrs als Einzeljahr oder Zeitraum
- Eingabe und Verwaltung von Exposé-Kategorien
- Slugs, öffentliche URLs und Detailseiten
- konkrete Medienablage
- Bildformate, Bildgrößen und Bildverarbeitung
- Verhalten bei Austausch oder Entfernung des Titelbilds
- genaue Veröffentlichungsvalidierung
- Archivierungs- und endgültige Löschregeln
- ob und wie Änderungen fachlich protokolliert werden

Für Liegeplätze sind darüber hinaus noch zu klären:

- Format und Erzeugung der internen Kennungen
- konkrete Medienablage sowie Bildformate und Bildverarbeitung
- Verhalten bei Austausch oder Entfernung des Titelbilds
- genaue Veröffentlichungsvalidierung
- technische Umsetzung eines zentral verwaltbaren öffentlichen Kontakt-Hinweises
- ob und wann zusätzliche technische Daten, Preise, Maße, Standortdetails, Verfügbarkeiten, Ansprechpartner, individuelle Exposé-Texte, Slugs oder SEO-Felder tatsächlich benötigt werden

Für Services sind darüber hinaus noch zu klären:

- genaue technische Umsetzung von Aktiv/Inaktiv sowie Archivierung
- optionale Bilder oder Icons für Kategorien und Services
- ob und wann ein allgemeines Service-Preismodell benötigt wird
- weitere Felder nur bei nachgewiesenem fachlichem Bedarf

Für Stellenangebote sind darüber hinaus noch zu klären:

- konkrete Rich-Text-Technologie für die Beschreibung
- technische Modellierung von Arbeitsorten, Aufgaben, Qualifikationen und Bewerbungskontakten
- Mindestanforderungen an Kontaktangaben
- genaue Archivierungs- und Löschlogik
- ob und wann die nicht festgelegten Stellenangebots-Daten tatsächlich benötigt werden

Für Kontaktanfragen sind darüber hinaus noch zu klären:

- konkrete Pflichtfelder und Validierung der Kontaktdaten
- technische Modellierung der Anfragetypen und Inhaltsbeziehungen
- mehrere interne Notizen gegenüber einer einzelnen Notiz
- Datenschutz, Einwilligung sowie Captcha und Spam-Schutz
- Lösch- und Aufbewahrungsfristen
- automatische Benachrichtigungen, E-Mail-Benachrichtigungen und Statusänderungen
