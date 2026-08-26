import Image from "next/image";
import Link from "next/link";
import type { Listing } from "@/data/site";
import { OwnerListings } from "@/components/sections/owner-listings";

const ownerServices = [
  ["Vermietung & Betreuung", "Vermietung von Hausbooten sowie Betreuung von Eigentümern und Gästen während des gesamten Aufenthalts."],
  ["Pflege & Instandhaltung", "Reinigung, Wartung, Kontrollen, Reparaturen sowie saisonale und weitere Servicearbeiten rund ums Hausboot."],
  ["Hausboote & Liegeplätze", "Kauf und Verkauf von Hausbooten und Liegeplätzen sowie Vermittlung passender Kombinationen."],
] as const;

export function OwnerSection({ listings }: { listings: Listing[] }) {
  return <section id="eigentuemer" className="owner-color-transition">
    <header className="container-page pt-[clamp(3rem,6vw,5.5rem)] text-right">
      <p className="whitespace-nowrap text-[clamp(1.15rem,4.8vw,5.25rem)] font-bold leading-[.9] tracking-[-.065em] text-brand">FÜR EIGENTÜMER/INNEN</p>
      <h2 className="mt-7 text-[clamp(2rem,3.5vw,3.75rem)] font-bold leading-[.98] tracking-[-.05em] text-ink lg:whitespace-nowrap">Raus aus dem Aufwand. Rein ins Genießen.</h2>
      <p className="mt-4 text-base leading-relaxed text-ink/72 sm:text-lg">Ein Platz am Wasser beginnt hier: mit einem Liegeplatz, einem Hausboot oder beidem – und mit der Ruhe, die bleibt.</p>
    </header>
    <section className="container-page mt-[clamp(2.5rem,5vw,4.5rem)] py-[clamp(1.5rem,4vw,3.5rem)]" aria-labelledby="owner-story-title">
      <div className="grid gap-[clamp(1.75rem,3vw,3.5rem)] lg:grid-cols-[minmax(0,1.1fr)_minmax(18rem,.9fr)] lg:items-center">
        <div className="min-w-0 text-left">
          <h3 id="owner-story-title" className="text-[clamp(1.9rem,2.6vw,3.25rem)] font-bold leading-[.97] tracking-[-.05em] text-ink">Ihr Huus. Unser Meer.</h3>
          <p className="mt-4 text-base leading-relaxed text-ink/72 sm:text-lg"><span className="block">Rund ums eigene Hausboot gibt es vieles zu beachten.</span><span className="block">Wir kümmern uns um das, was Ihnen den Wind aus den Segeln nehmen könnte.</span><span className="block">Und vielleicht fühlt sich Eigentum genau deshalb ein bisschen leichter an.</span></p>
        </div>
        <div className="relative p-[clamp(.6rem,1vw,.9rem)]">
          <span className="absolute right-0 top-0 h-[3px] w-2/5 rounded-full bg-brand/80" aria-hidden="true" />
          <span className="absolute bottom-0 right-0 h-[3px] w-3/5 rounded-full bg-brand/80" aria-hidden="true" />
          <span className="absolute bottom-0 right-0 top-0 w-[3px] rounded-full bg-brand/80" aria-hidden="true" />
          <div className="relative aspect-[3/2] overflow-hidden"><Image src="/assets/images/DSC01125.jpg" alt="Hausbootterrasse mit Blick über den Yachthafen" fill sizes="(max-width: 1023px) calc(100vw - 2.5rem), 44vw" className="object-contain object-center [filter:saturate(.88)]" /></div>
        </div>
      </div>
    </section>
    <section className="container-page mt-[clamp(3rem,7vw,6rem)]" aria-label="Leistungen für Eigentümerinnen und Eigentümer">
      <div className="grid gap-x-[clamp(2rem,4vw,5rem)] gap-y-10 md:grid-cols-3">{ownerServices.map(([title, copy]) => <article className="grid min-w-0 grid-cols-[3px_minmax(0,1fr)] gap-5" key={title}><div className="min-h-44 w-[3px] rounded-full bg-[linear-gradient(to_bottom,var(--color-brand)_0%,var(--color-brand)_38%,var(--color-sky)_50%,var(--color-mist-line)_100%)]" aria-hidden="true" /><div className="min-w-0"><h3 className="text-2xl font-bold tracking-[-.035em] text-ink">{title}</h3><p className="mt-3 leading-relaxed text-ink/70">{copy}</p></div></article>)}</div>
      <div className="mt-10 flex justify-center"><Link href="/services" className="inline-flex min-h-12 items-center justify-center rounded-[0.2rem] border border-brand bg-brand px-6 py-3 text-sm font-bold text-ice outline outline-1 outline-offset-[3px] outline-brand/55 shadow-[0_3px_10px_color-mix(in_srgb,var(--color-brand)_16%,transparent)] transition-[background-color,color,box-shadow,transform] duration-150 ease-out hover:-translate-y-0.5 hover:bg-ice hover:text-ink hover:shadow-[0_6px_14px_color-mix(in_srgb,var(--color-brand)_20%,transparent)] active:translate-y-px active:shadow-none focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-ink">Zu unseren Services →</Link></div>
    </section>
    <OwnerListings listings={listings} />
  </section>;
}
