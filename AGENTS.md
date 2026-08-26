<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

## Responsive Design

Responsive Design ist bei jeder zukünftigen UI-Entwicklung verpflichtend.

Jede neue Seite und Komponente muss von Anfang an responsive entwickelt werden.

Folgende Größenbereiche müssen berücksichtigt werden:

* 320–360px: sehr kleine Smartphones
* 360–430px: Smartphones
* 600–768px: kleine Tablets
* 768–1024px: Tablets / kleine Laptops
* 1024–1280px: Laptops
* 1280–1440px: normale Desktop-Bildschirme
* 1440–1920px: große Desktop-Bildschirme
* 1920–2560px: sehr große Desktop-Bildschirme
* 2560px+: Ultrawide-Displays

Mobile First ist zu bevorzugen. Es darf kein horizontaler Overflow entstehen.
`overflow-x-hidden` darf nicht als Workaround verwendet werden, um Layoutfehler zu verstecken.

Bevorzugt werden flexible Breiten, `max-width`, CSS Grid, Flexbox, responsive
Spacing und Typografie sowie `clamp()`, `min()`, `max()` und `minmax()`.
Unnötige feste Breiten, feste Höhen und unnötige Breakpoints vermeiden.

Große Bildschirme dürfen nicht zu übermäßigem Whitespace führen. Prüfe insbesondere:

* Containerbreiten und `max-width`
* Section Padding, Margins und Gaps
* Hero-Höhen, `min-height` und viewport-basierte Höhen
* Grid-Spalten, Textbreiten und Bildgrößen

Neue Komponenten müssen auf kleinen und großen Bildschirmen funktionieren.

### Verbindliche Viewports

Bei jeder zukünftigen UI-Änderung mindestens gedanklich oder im Browser prüfen:

* Mobile: 320px, 360px, 390px, 430px
* Tablet: 768px, 1024px
* Laptop: 1280px, 1366px, 1440px
* Desktop: 1920px, 2560px
* Ultrawide: 3440px, 3840px und größer als 3840px

Auf keiner dieser Größen darf die Website horizontal überlaufen oder eine
horizontale Scrollbar erzeugen, außer diese ist für einen konkreten UI-Bereich
bewusst vorgesehen.

Wenn horizontaler Overflow entsteht, zuerst die Ursache prüfen und beheben:

* feste Breiten, `min-width` und `100vw`
* negative Margins, absolute Positionierung und transformierte Elemente
* Bilder, Grid-Spalten oder Gaps, die zu groß sind
* nicht umbrechende Texte, Buttons und Navigation
* Container- und Hero-Regeln

`overflow-x-hidden` ist keine zulässige Scheinlösung für Layoutfehler.

### Implementierung und Testing

Nicht für jede Bildschirmbreite einen Breakpoint erstellen. Breakpoints nur
verwenden, wenn sich die Layoutstruktur tatsächlich ändern muss. Bevorzugt sind
CSS Grid, Flexbox, `clamp()`, `min()`, `max()`, `minmax()`, Prozentwerte, `rem`,
`fr` und sinnvolle `max-width`-Werte.

Mobile Layouts müssen eigenständig funktionieren und dürfen nicht nur verkleinerte
Desktop-Layouts sein. Touch Targets, lesbare Schrift, Abstände, Buttons, Bilder
und Inhalte müssen vollständig im Viewport bleiben.

1366px und 1440px sind wichtige reale Laptop-Zielgrößen. Zwischen Tablet und
Desktop müssen sich Bildgrößen, Abstände und Positionierungen fluid anpassen.

Bei jeder größeren UI-Änderung zusätzlich prüfen:

* horizontalen Overflow und Elemente außerhalb des Viewports
* abgeschnittene Inhalte sowie Navigation und Buttons
* übermäßig große Leerflächen und zu lange Textzeilen auf großen Screens
* kleine und große Viewport-Höhen

## Large Screens & Ultrawide

Die Responsive-Strategie endet nicht bei 2560px. Bei 2560×1440, 3440×1440,
3840×1600 und größeren Viewports muss das Layout kontrolliert und bewusst
gestaltet bleiben.

Der verfügbare Raum soll sinnvoll genutzt werden, ohne dass Content unkontrolliert
wächst oder Textzeilen zu lang werden. Verwende dafür kontrollierte Maximalbreiten,
`clamp()`, relative Einheiten, CSS Grid und Flexbox statt stetig größerer fixer
Werte.

Besonders prüfen:

* Hero-Komposition und Navigation bleiben ausgewogen.
* Textbereiche bleiben beim zentralen Content und lesbar.
* Komponenten, Abstände und Grid-Spalten wachsen nicht unkontrolliert.
* Es entstehen weder riesige seitliche Leerflächen noch abgeschnittene Elemente.

## Farb-System & Zielgruppenbereiche

Die Huus-&-Meer-Farbpalette ist verbindlich. Neue oder ähnliche Farben dürfen
nicht eingeführt werden, wenn ein vorhandener Token verwendet werden kann.
Reines Weiß (`#FFFFFF`), reines Schwarz (`#000000`) und neue fast-weiße oder
fast-schwarze Farben sind keine Designfarben.

Verwende die bestehenden Tokens wie folgt:

* `ink`: `hsl(204, 52%, 10%)` / `#0D1B2A` für Typografie und Fließtext.
* `sand`: `hsl(33, 31%, 93%)` / `#F4F1EA` als Urlauber/innen-Hintergrund.
* `linen`: `hsl(36, 28%, 97%)` / `#FBF9F5` für Urlauber/innen-Cards.
* `red`: `hsl(0, 48%, 54%)` / `#C44545` als Urlauber/innen-Primary.
* `sky`: `hsl(199, 78%, 68%)` / `#63BCE5` als sekundärer Akzent.
* `mist`: `hsl(204, 22%, 93%)` / `#E8EDF2` als Eigentümer/innen-Hintergrund.
* `ice`: `hsl(204, 18%, 97%)` / `#F2F5F8` für Eigentümer/innen-Cards.
* `brand`: `hsl(204, 81%, 39%)` / `#126EA6` als Eigentümer/innen-Primary.
* `sand-line`, `mist-line`, `footer` und `footer-line` für die jeweiligen
  Trennlinien und Footerflächen.

Die beiden Zielgruppenbereiche bleiben eine gemeinsame Website: Struktur,
Komponenten, Typografie und Layout bleiben grundsätzlich einheitlich; nur die
semantische Farbwelt unterscheidet sich.

### Bestehende Bereichsgrenzen

Die bestehenden Haupt-Sections sind die technischen Bereichsgrenzen:

* `#gaeste` repräsentiert URLAUBER/INNEN und verwendet `sand`, `linen`,
  `sand-line`, `red` und bei Bedarf `sky`.
* `#eigentuemer` repräsentiert EIGENTÜMER/INNEN und verwendet `mist`, `ice`,
  `mist-line`, `brand` und bei Bedarf `sky`.
* Der Hero zeigt beide Bereiche gleichzeitig: links die warme Urlauber/innen-
  Farbwelt, rechts die kühle Eigentümer/innen-Farbwelt.

Komponenten, Typografie, Radien, Schatten, Spacing, Bildsprache und das
responsive System bleiben bereichsübergreifend gleich. Bereichszugehörigkeit
wird über den umgebenden Section-Kontext und die vorhandenen Tokens bestimmt;
keine parallele Farbarchitektur oder neue Farbwerte einführen.

Der Footer ist kein Teil dieses Bereichssystems und bleibt vollständig
unverändert: Farben, Layout, Abstände, Typografie, Links, Icons, Struktur,
Komponente und responsives Verhalten dürfen durch Bereichsänderungen nicht
angepasst werden.

## Hero-Komposition

Der Hero wird nicht neu gestaltet. Die bestehende Komposition bleibt erhalten:
Urlauber/innen links, Hausbootbild zentral und Eigentümer/innen rechts. Der
bestehende Sand-zu-Mist-Gradient bleibt unverändert. Auf großen und Ultrawide-
Screens muss diese Komposition zusammenhängend und kontrolliert bleiben.

## Code Quality & Engineering Standards

Diese Regeln gelten für alle zukünftigen Änderungen am Huus & Meer Projekt.

### 1. Bestehenden Code zuerst verstehen

Vor jeder Änderung:

* relevante Dateien lesen
* bestehende Architektur verstehen
* bestehende Komponenten und Utilities prüfen
* vorhandene Lösungen wiederverwenden
* keine unnötigen neuen Dateien oder Komponenten erstellen

Bestehenden funktionierenden Code nicht ohne Grund neu schreiben.

### 2. Kleine und fokussierte Änderungen

Eine Aufgabe soll möglichst nur die dafür notwendigen Dateien und Bereiche verändern.

Keine ungefragten:

* Refactorings
* Architekturänderungen
* Dependency-Wechsel
* Designänderungen
* Umbenennungen

Wenn ein größerer struktureller Umbau notwendig erscheint, zuerst darauf hinweisen.

### 3. TypeScript

TypeScript konsequent verwenden.

Vermeiden:

* `any`
* unnötige Type Assertions
* `@ts-ignore`
* `@ts-expect-error`

Wenn eine Ausnahme notwendig ist, muss sie begründet sein.

Props, API-Daten und wichtige Datenstrukturen müssen sauber typisiert sein.

### 4. Komponentenarchitektur

Komponenten sollen:

* eine klare Verantwortung haben
* verständlich bleiben
* wiederverwendbar sein, wenn sie tatsächlich mehrfach benötigt werden
* nicht unnötig groß werden

Bestehende wiederverwendbare Komponenten bevorzugen.

Keine künstliche Abstraktion nur um Code zu verkürzen.

### 5. Styling

Das bestehende Styling-System konsequent verwenden.

Vermeiden:

* unnötige Inline Styles
* `!important`
* zufällige Einzelwerte
* doppelte Styling-Lösungen
* unnötige CSS-Dateien

Responsive Design ist immer mitzudenken.

### 6. Daten und API

API- und Datenzugriffslogik von UI-Darstellung trennen.

API-Aufrufe nicht unnötig direkt in vielen UI-Komponenten duplizieren.

Immer berücksichtigen:

* Loading State
* Error State
* Empty State
* erfolgreiche Datenanzeige

Externe API-Daten müssen validiert und typisiert werden.

Secrets und API-Keys dürfen niemals im Client-Code landen.

### 7. Server und Client

Server- und Client-Code klar voneinander trennen.

Client Components nur verwenden, wenn tatsächlich Client-Interaktivität erforderlich ist.

Datenbankzugriffe und sensible Logik müssen serverseitig bleiben.

Keine Secrets oder Zugangsdaten in Client Components.

### 8. Datenbank

Bei zukünftiger PostgreSQL-/Datenbankintegration:

* Datenbankzugriff ausschließlich serverseitig
* Datenbank-Credentials niemals im Frontend
* Schemaänderungen über nachvollziehbare Migrationen
* Eingaben validieren
* Datenbanklogik zentral und nachvollziehbar halten
* keine Datenbankabfragen direkt aus UI-Komponenten

### 9. Sicherheit

Sicherheitsrelevante Prüfungen müssen serverseitig stattfinden.

Insbesondere beim Admin-Bereich:

* Authentifizierung serverseitig prüfen
* Autorisierung serverseitig prüfen
* geschützte API-Routen serverseitig absichern
* niemals nur UI-Elemente verstecken
* keine Secrets im Repository
* keine Zugangsdaten im Client-Code

Keine eigene kryptografische oder Passwort-Sicherheitslösung entwickeln, wenn eine etablierte und geeignete Lösung verwendet werden kann.

### 10. Fehlerbehandlung

Fehler nicht einfach ignorieren.

Vermeiden:

```ts
catch (error) {
  console.log(error)
}
```

wenn dadurch der eigentliche Fehler nicht sinnvoll behandelt wird.

Stattdessen:

* Fehlerzustände bewusst behandeln
* Benutzerfreundliche Fehlermeldungen anzeigen
* technische Details nur dort loggen, wo sie für Entwickler sinnvoll sind
* Loading-, Error- und Empty-States berücksichtigen

### 11. Accessibility

Neue UI muss grundsätzlich zugänglich entwickelt werden.

Beachten:

* semantisches HTML
* korrekte Buttons und Links
* Labels für Formulare
* sinnvolle Alt-Texte
* Tastaturbedienbarkeit
* sichtbare Focus-Zustände
* ausreichende Touch Targets
* ausreichende Kontraste

Keine klickbaren `div`-Elemente verwenden, wenn ein semantischer Button oder Link korrekt wäre.

### 12. SEO

Öffentliche Seiten müssen SEO-Grundlagen berücksichtigen.

Beachten:

* sinnvolle Metadata
* eindeutige Seitentitel
* Meta Descriptions
* korrekte Heading-Hierarchie
* semantisches HTML
* sinnvolle URLs
* Open Graph, wenn relevant
* strukturierte Daten, wenn sinnvoll
* optimierte Bilder

Keine unnötigen Client Components auf öffentlich indexierbaren Seiten.

### 13. Performance

Performance von Anfang an berücksichtigen.

Bevorzugen:

* optimierte Bilder
* Next.js Image
* sinnvolles Lazy Loading
* Server Components, wenn möglich
* kleine Client Components
* minimale Client-JavaScript-Menge
* keine unnötigen Dependencies
* keine unnötigen API-Requests

### 14. Abhängigkeiten

Neue Dependencies nur hinzufügen, wenn sie einen echten Mehrwert bieten.

Vor einer neuen Dependency prüfen:

* Gibt es bereits eine Lösung im Projekt?
* Kann die Funktionalität mit bestehenden Mitteln umgesetzt werden?
* Ist die Dependency notwendig?

Keine unnötigen Libraries für kleine Hilfsfunktionen.

### 15. Validierung

Benutzereingaben und externe Daten niemals ungeprüft vertrauen.

Validierung muss an der richtigen Stelle erfolgen und bei sicherheitsrelevanten Daten serverseitig stattfinden.

### 16. Keine Workarounds für Fehler

Keine Lösungen verwenden, die einen Fehler nur verstecken.

Beispiele:

* `overflow-x-hidden` gegen tatsächliches Layout-Overflow
* `any` gegen TypeScript-Fehler
* `@ts-ignore` gegen Typfehler
* `!important` gegen falsch strukturierte Styles
* UI-Checks gegen fehlende serverseitige Berechtigungsprüfung

Immer möglichst die eigentliche Ursache beheben.

### 17. Qualität vor Geschwindigkeit

Eine schnelle Lösung ist nicht automatisch eine gute Lösung.

Bei jeder Änderung sollen folgende Fragen berücksichtigt werden:

* Ist die Lösung verständlich?
* Ist sie wartbar?
* Ist sie responsive?
* Ist sie zugänglich?
* Ist sie performant?
* Ist sie sicher?
* Passt sie zur bestehenden Architektur?

### 18. Abschlussprüfung

Nach relevanten Änderungen prüfen:

* TypeScript
* ESLint
* Build
* offensichtliche Responsive-Probleme
* offensichtliche Accessibility-Probleme
* offensichtliche Runtime-Fehler

Nur Fehler beheben, die mit der aktuellen Aufgabe zusammenhängen, sofern keine Sicherheits- oder Build-Probleme eine weitergehende Korrektur erfordern.
