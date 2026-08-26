import Link from "next/link";
import { Icon } from "@/components/ui/icon";

const moreLinks = [
  ["ÜBER UNS", "Mehr über Huus & Meer, unser Team und was uns mit der Ostseeküste verbindet."],
  ["STELLENANGEBOTE", "Werden Sie Teil von Huus & Meer und entdecken Sie unsere aktuellen Möglichkeiten."],
  ["KONTAKT", "Sie haben Fragen oder möchten mit uns sprechen? Wir freuen uns auf Ihre Nachricht."],
] as const;

export function MoreSection() {
  return <section id="mehr-von-huus-und-meer" className="more-section-transition pb-[clamp(1.5rem,4vw,3rem)] pt-[clamp(5rem,10vw,9rem)]" aria-labelledby="more-title">
    <div className="container-page">
      <p className="text-xs font-bold tracking-[.18em] text-brand">MEHR VON HUUS & MEER</p>
      <h2 id="more-title" className="mt-5 text-[clamp(2.3rem,5vw,5rem)] font-bold leading-[.96] tracking-[-.055em] text-ink">Noch mehr zu entdecken.</h2>
      <div className="mt-[clamp(3rem,7vw,6rem)] grid gap-x-[clamp(2rem,4vw,5rem)] gap-y-10 md:grid-cols-3">
        {moreLinks.map(([title, copy]) => <Link href={title === "STELLENANGEBOTE" ? "/stellenangebote" : title === "KONTAKT" ? "/kontakt" : "/#kontakt"} className="group grid min-w-0 grid-cols-[3px_minmax(0,1fr)] gap-5 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-ink" key={title}>
          <span className="min-h-44 w-[3px] rounded-full bg-[linear-gradient(to_bottom,var(--color-brand)_0%,var(--color-brand)_38%,var(--color-sky)_54%,var(--color-red)_100%)]" aria-hidden="true" />
          <span className="flex min-w-0 flex-col">
            <span className="flex items-start justify-between gap-4">
              <span className="text-sm font-bold tracking-[.14em] text-ink">{title}</span>
              <Icon name="arrow" className="mt-0.5 h-4 w-4 shrink-0 text-brand transition-transform duration-150 ease-out group-hover:translate-x-1" />
            </span>
            <span className="mt-4 leading-relaxed text-ink/70">{copy}</span>
          </span>
        </Link>)}
      </div>
    </div>
  </section>;
}
