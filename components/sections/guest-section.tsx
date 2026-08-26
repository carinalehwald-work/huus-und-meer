"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "@/components/ui/kurtaxe-link";
import { accommodations } from "@/data/site";
import { Icon } from "@/components/ui/icon";
import { VisualPlaceholder } from "@/components/ui/visual-placeholder";

const legacyTraits = [
  ["01", "Persönliche Betreuung", "Vom ersten Kontakt bis zur Abreise kümmern wir uns um Ihre Belange."],
  ["02", "Urlaubserlebnisse", "Unser Ziel ist es, Ihnen unvergessliche Urlaubsmomente zu schenken und ein Lächeln ins Gesicht zu zaubern."],
  ["03", "Faire Tarife", "Bei uns auf der Homepage finden Sie immer den günstigsten Preis für Ihre Unterkunft."],
 ] as const;

const traits = legacyTraits.map(([, title, copy]) => ["", title, copy] as const);

function GuestButton({ children, href }: { children: React.ReactNode; href?: string }) {
  const className = "group inline-flex min-h-12 items-center justify-center rounded-[0.2rem] border border-red bg-red px-5 py-3 text-sm font-bold text-linen outline outline-1 outline-offset-[3px] outline-red/55 shadow-[0_3px_10px_color-mix(in_srgb,var(--color-red)_16%,transparent)] transition-[background-color,color,box-shadow,transform] duration-150 ease-out hover:-translate-y-0.5 hover:bg-sand hover:text-ink hover:shadow-[0_6px_14px_color-mix(in_srgb,var(--color-red)_20%,transparent)] active:translate-y-px active:shadow-none focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-ink";
  const content = <>{children}<Icon name="arrow" className="ml-2 h-4 w-4 transition-transform duration-150 ease-out group-hover:translate-x-1" /></>;

  return href ? <a href={href} className={className}>{content}</a> : <button type="button" className={className}>{content}</button>;
}

function CarouselArrowButton({ direction, disabled, label, onClick }: { direction: "previous" | "next"; disabled: boolean; label: string; onClick: () => void }) {
  const isPrevious = direction === "previous";

  return <button type="button" onClick={onClick} disabled={disabled} className="group grid h-12 w-12 shrink-0 place-items-center rounded-[0.2rem] border border-red bg-red text-linen outline outline-1 outline-offset-[3px] outline-red/55 shadow-[0_3px_10px_color-mix(in_srgb,var(--color-red)_16%,transparent)] transition-[background-color,color,box-shadow,transform] duration-150 ease-out hover:-translate-y-0.5 hover:bg-sand hover:text-ink hover:shadow-[0_6px_14px_color-mix(in_srgb,var(--color-red)_20%,transparent)] active:translate-y-px active:shadow-none focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-ink disabled:pointer-events-none disabled:border-red/30 disabled:bg-red/15 disabled:text-red/40 disabled:outline-red/15 disabled:shadow-none" aria-label={label}><Icon name="arrow" className={`h-4 w-4 transition-transform duration-150 ease-out ${isPrevious ? "rotate-180 group-hover:-translate-x-1" : "group-hover:translate-x-1"}`} /></button>;
}

function SearchFields() {
  return <div className="grid gap-0 border border-sand-line bg-sand sm:grid-cols-3">
    {["Anreise", "Abreise", "Personen"].map((field) => <label className="border-b border-sand-line px-5 py-4 last:border-b-0 sm:border-b-0 sm:border-r sm:last:border-r-0" key={field}><span className="block text-[11px] font-bold tracking-[.16em] text-red">{field}</span><span className="mt-1 block text-sm font-semibold text-ink">{field === "Personen" ? "2 Gäste" : "Datum wählen"}</span></label>)}
  </div>;
}

export function GuestSection() {
  const [activeIndex, setActiveIndex] = useState(0);
  const previous = () => setActiveIndex((index) => Math.max(0, index - 1));
  const next = () => setActiveIndex((index) => Math.min(accommodations.length - 1, index + 1));

  return <section id="gaeste" className="guest-owner-color-transition border-t border-sand-line">
    <header className="container-page pt-[clamp(3rem,6vw,5.5rem)]">
      <p className="whitespace-nowrap text-[clamp(1.35rem,5vw,5.25rem)] font-bold leading-[.9] tracking-[-.065em] text-red">FÜR URLAUBER/INNEN</p>
      <h2 className="mt-7 text-[clamp(2rem,3.5vw,3.75rem)] font-bold leading-[.98] tracking-[-.05em] text-ink lg:whitespace-nowrap">Raus aus dem Alltag. Rein ins Hausboot.</h2>
      <p className="mt-4 text-base leading-relaxed text-ink/72 sm:text-lg">Ein kleines Stück Ostsee beginnt hier: mit offenen Türen, guten Geschichten und einem Platz, der ganz langsam macht.</p>
    </header>

    <section className="container-page mt-[clamp(2.5rem,5vw,4.5rem)] py-[clamp(1.5rem,4vw,3.5rem)]" aria-labelledby="hausboot-story">
      <div className="grid gap-[clamp(1.75rem,3vw,3.5rem)] lg:grid-cols-[minmax(18rem,.9fr)_minmax(0,1.1fr)] lg:items-center"><div className="min-w-0 text-right"><h3 id="hausboot-story" className="text-[clamp(1.9rem,2.6vw,3.25rem)] font-bold leading-[.97] tracking-[-.05em] text-ink">Huus oder Meer? Am besten beides.</h3><p className="mt-4 text-base leading-relaxed text-ink/72 sm:text-lg"><span className="block">Hausboote gibt es in vielen Formen, Größen und Farben.</span><span className="block">Eines haben sie alle gemeinsam: Sie schwimmen.</span><span className="block">Und vielleicht fühlt sich Urlaub genau deshalb ein bisschen anders an.</span></p></div><div className="relative p-[clamp(.6rem,1vw,.9rem)] lg:order-first"><span className="absolute left-0 top-0 h-[3px] w-2/5 rounded-full bg-red/80" aria-hidden="true" /><span className="absolute bottom-0 left-0 h-[3px] w-3/5 rounded-full bg-red/80" aria-hidden="true" /><span className="absolute bottom-0 left-0 top-0 w-[3px] rounded-full bg-red/80" aria-hidden="true" /><div className="relative min-h-80 overflow-hidden sm:min-h-96 lg:min-h-[clamp(21rem,28vw,31rem)]"><Image src="/assets/images/DSC01398.jpg" alt="Hausboot an der Ostsee" fill sizes="(max-width: 1023px) calc(100vw - 2.5rem), 44vw" className="object-cover [filter:saturate(.88)_sepia(.06)]" /></div></div></div>
    </section>

    <section className="container-page mt-[clamp(4rem,9vw,8rem)]" aria-label="Ihre Vorteile">
      <div className="grid gap-x-[clamp(2rem,4vw,5rem)] gap-y-10 md:grid-cols-3">{traits.map(([number, title, copy]) => <article className="grid min-w-0 grid-cols-[3px_minmax(0,1fr)] gap-5" key={title}><div className="min-h-44 w-[3px] rounded-full bg-[linear-gradient(to_bottom,var(--color-red)_0%,var(--color-red)_38%,var(--color-mist-line)_50%,var(--color-mist-line)_100%)]" aria-hidden="true" /><div className="min-w-0"><p className="text-xs font-bold tracking-[.18em] text-red">{number}</p><h3 className="mt-3 text-2xl font-bold tracking-[-.035em] text-ink">{title}</h3><p className="mt-3 leading-relaxed text-ink/70">{copy}</p></div></article>)}</div>
    </section>

    <section className="container-page mt-[clamp(4.5rem,10vw,9rem)]" aria-labelledby="guest-search-title">
      <div className="relative p-[clamp(.6rem,1vw,.9rem)]">
        <span className="pointer-events-none absolute left-0 top-0 h-[3px] w-1/3 rounded-full bg-red" aria-hidden="true" />
        <span className="pointer-events-none absolute left-0 top-0 h-1/3 w-[3px] rounded-full bg-red" aria-hidden="true" />
        <span className="pointer-events-none absolute bottom-0 right-0 h-[3px] w-1/3 rounded-full bg-red" aria-hidden="true" />
        <span className="pointer-events-none absolute bottom-0 right-0 h-1/3 w-[3px] rounded-full bg-red" aria-hidden="true" />
        <div className="bg-linen p-[clamp(1.5rem,5vw,5rem)]">
          <h3 id="guest-search-title" className="text-[clamp(2rem,4vw,4.5rem)] font-bold leading-[.96] tracking-[-.05em] text-ink lg:whitespace-nowrap">Die Ostsee ganz nach Ihrem Geschmack.</h3>
          <p className="mt-5 leading-relaxed text-ink/70 xl:whitespace-nowrap">Gemütliche Hafenblicke, viel Platz für die Familie oder ein stiller Rückzugsort – entdecken Sie Ihr Hausboot.</p>
          <div className="mt-10 grid gap-5 lg:grid-cols-[1fr_auto] lg:items-center"><SearchFields /><GuestButton>Hausboot finden</GuestButton></div>
          <div className="mt-[clamp(3.5rem,7vw,6rem)]" aria-labelledby="stays-title">
            <h3 id="stays-title" className="text-[clamp(2rem,3.5vw,3.75rem)] font-bold leading-none tracking-[-.05em] text-ink">Unsere Hausboote</h3>
            <div className="mt-10 grid grid-cols-1 gap-4 overflow-hidden md:grid-cols-2 lg:grid-cols-3">{accommodations.map((stay, index) => <article className="relative flex h-full min-w-0 flex-col p-2 transition-transform duration-200 hover:-translate-y-0.5" aria-current={index === activeIndex ? "true" : undefined} key={stay.name}><span className="absolute left-0 top-0 h-[3px] w-2/5 rounded-full bg-red/80" aria-hidden="true" /><span className="absolute bottom-0 left-0 h-[3px] w-3/5 rounded-full bg-red/80" aria-hidden="true" /><span className="absolute bottom-0 left-0 top-0 w-[3px] rounded-full bg-red/80" aria-hidden="true" /><div className="flex h-full flex-col overflow-hidden bg-sand"><VisualPlaceholder label={stay.name} className={`h-56 shrink-0 ${index === 1 ? "[filter:hue-rotate(12deg)]" : ""}`} /><div className="flex min-h-[13.25rem] flex-1 flex-col p-5"><div className="flex items-start justify-between gap-3"><div className="min-w-0"><p className="text-xs font-bold tracking-[.14em] text-red">{stay.tag}</p><h4 className="mt-2 text-xl font-bold tracking-[-.025em] text-ink">{stay.name}</h4></div><span className="shrink-0 text-xs font-semibold text-ink/60">{stay.guests} Pers.</span></div><p className="mt-3 text-sm text-ink/65">{stay.place}</p><p className="mt-auto border-t border-sand-line pt-4 text-sm font-bold text-ink">{stay.price}</p></div></div></article>)}</div>
            <div className="mt-8 flex items-center justify-center gap-[clamp(1rem,3vw,2rem)]" aria-label="Hausboot-Auswahl"><CarouselArrowButton direction="previous" disabled={activeIndex === 0} label="Vorherige Unterkunft" onClick={previous} /><div className="flex items-center justify-center gap-2" aria-hidden="true">{accommodations.map((stay, index) => <span className={`block h-2.5 w-2.5 rounded-[1px] bg-red transition-opacity duration-150 ${index === activeIndex ? "opacity-100" : "opacity-30"}`} key={stay.name} />)}</div><span className="sr-only" aria-live="polite">{accommodations[activeIndex].name}, Angebot {activeIndex + 1} von {accommodations.length}</span><CarouselArrowButton direction="next" disabled={activeIndex === accommodations.length - 1} label="Nächste Unterkunft" onClick={next} /></div>
          </div>
        </div>
      </div>
    </section>

    <section className="container-page py-[clamp(4.5rem,9vw,9rem)]" aria-labelledby="discover-title">
      <div className="grid gap-[clamp(2.5rem,5vw,5rem)] py-[clamp(2.5rem,5vw,5rem)] lg:grid-cols-[.9fr_1.1fr] lg:items-center"><div className="min-w-0"><h3 id="discover-title" className="text-[clamp(2.2rem,4.4vw,4.8rem)] font-bold leading-[.94] tracking-[-.055em] text-ink"><span className="block">Drei Orte.</span><span className="block">Ein gutes Gefühl.</span></h3><p className="mt-5 leading-relaxed text-ink/70 xl:whitespace-nowrap">Kleine Wege, große Aussichten und genau die richtige Menge Ostseeluft.</p><div className="mt-8 grid gap-5 sm:grid-cols-3">{["Fehmarn", "Heiligenhafen", "Großenbrode"].map((place) => <p className="grid grid-cols-[3px_minmax(0,1fr)] items-center gap-4 font-bold text-ink" key={place}><span className="h-8 w-[3px] rounded-full bg-red/80" aria-hidden="true" /><span>{place}</span></p>)}</div><aside className="mt-10 grid grid-cols-[3px_minmax(0,1fr)] gap-5"><span className="h-full w-[3px] rounded-full bg-red/80" aria-hidden="true" /><div className="min-w-0"><p className="text-xs font-bold tracking-[.16em] text-red">GUT ZU WISSEN</p><h4 className="mt-3 text-xl font-bold tracking-[-.025em] text-ink">Kurtaxe & Ostseecard</h4><p className="mt-3 max-w-lg text-sm leading-relaxed text-ink/70">Alles Wichtige für Ihre Anreise, die Ostseecard und entspannte Tage vor Ort.</p><Link href="/suchen-und-buchen" className="group mt-4 inline-flex min-h-11 items-center text-sm font-bold text-red underline decoration-red/35 underline-offset-4 transition-colors hover:decoration-red focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-ink">Mehr über Kurtaxe & Ostseecard <Icon name="arrow" className="ml-2 h-4 w-4 transition-transform duration-150 ease-out group-hover:translate-x-1" /></Link></div></aside></div><div className="relative p-[clamp(.6rem,1vw,.9rem)]"><span className="absolute right-0 top-0 h-[3px] w-2/5 rounded-full bg-red/80" aria-hidden="true" /><span className="absolute bottom-0 right-0 h-[3px] w-3/5 rounded-full bg-red/80" aria-hidden="true" /><span className="absolute bottom-0 right-0 top-0 w-[3px] rounded-full bg-red/80" aria-hidden="true" /><div className="relative aspect-[12/7] overflow-hidden sm:aspect-[12/5]"><Image src="/assets/images/orte.png" alt="Ostsee-Impressionen aus Fehmarn, Heiligenhafen und Großenbrode" fill sizes="(max-width: 1023px) calc(100vw - 2.5rem), 52vw" className="object-cover object-center [filter:saturate(.9)_sepia(.04)]" /></div></div></div>
    </section>

    <section className="container-page pb-[clamp(4.5rem,9vw,9rem)]" aria-labelledby="final-cta-title"><div className="relative overflow-hidden"><div className="relative h-[clamp(16rem,68vw,24rem)] lg:absolute lg:inset-y-0 lg:left-0 lg:h-auto lg:w-[74%]"><div className="guest-cta-image-fade absolute bottom-[clamp(.6rem,1vw,.9rem)] left-[clamp(.6rem,1vw,.9rem)] right-0 top-[clamp(.6rem,1vw,.9rem)]"><Image src="/assets/images/DSC01239-Bearbeitet.jpg" alt="Hausboote von Huus & Meer am Hafen" fill sizes="(max-width: 1023px) calc(100vw - 2.5rem), 74vw" className="object-cover object-[58%_center] [filter:saturate(.88)]" /></div><span className="pointer-events-none absolute left-0 top-0 z-[5] h-[3px] w-2/5 rounded-full bg-red" aria-hidden="true" /><span className="pointer-events-none absolute bottom-0 left-0 z-[5] h-[3px] w-3/5 rounded-full bg-red" aria-hidden="true" /><span className="pointer-events-none absolute bottom-0 left-0 top-0 z-[5] w-[3px] rounded-full bg-red" aria-hidden="true" /></div><div className="relative z-10 ml-auto flex min-h-[clamp(20rem,32vw,34rem)] w-full flex-col justify-center px-[clamp(1.5rem,5vw,5rem)] pb-[clamp(2.5rem,7vw,5rem)] pt-2 text-right lg:w-[52%] lg:py-[clamp(3rem,7vw,6rem)] lg:pl-[clamp(3rem,7vw,7rem)]"><p className="text-xs font-bold tracking-[.18em] text-red">ZEIT FÜR IHRE AUSZEIT</p><h3 id="final-cta-title" className="mt-4 text-[clamp(2.3rem,5vw,5.5rem)] font-bold leading-[.92] tracking-[-.06em] text-ink">Ihr Hausboot wartet schon.</h3><div className="mt-7 flex justify-end"><GuestButton href="#hero">Alle Unterkünfte entdecken</GuestButton></div></div></div></section>
  </section>;
}
