"use client";

import { useState, useSyncExternalStore } from "react";
import Image from "next/image";
import Link from "next/link";
import type { Listing } from "@/data/site";
import { Icon } from "@/components/ui/icon";
import { buttonArrowClassName, buttonClassName } from "@/components/ui/button";

const columnQueries = [
  ["(min-width: 1024px)", 3],
  ["(min-width: 768px)", 2],
] as const;

function subscribeToColumns(callback: () => void) {
  const queries = columnQueries.map(([query]) => window.matchMedia(query));
  queries.forEach((query) => query.addEventListener("change", callback));
  return () => queries.forEach((query) => query.removeEventListener("change", callback));
}

function getVisibleColumns() {
  return columnQueries.find(([query]) => window.matchMedia(query).matches)?.[1] ?? 1;
}

function useVisibleColumns() {
  return useSyncExternalStore(subscribeToColumns, getVisibleColumns, () => 1);
}

function ArrowButton({ direction, disabled, label, onClick }: { direction: "previous" | "next"; disabled: boolean; label: string; onClick: () => void }) {
  const isPrevious = direction === "previous";

  return <button type="button" onClick={onClick} disabled={disabled} className="group grid h-12 w-12 shrink-0 place-items-center rounded-[0.2rem] border border-brand bg-brand text-ice outline outline-1 outline-offset-[3px] outline-brand/55 shadow-[0_3px_10px_color-mix(in_srgb,var(--color-brand)_16%,transparent)] transition-[background-color,color,box-shadow,transform] duration-150 ease-out hover:-translate-y-0.5 hover:bg-ice hover:text-ink hover:shadow-[0_6px_14px_color-mix(in_srgb,var(--color-brand)_20%,transparent)] active:translate-y-px active:shadow-none focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-ink disabled:pointer-events-none disabled:border-brand/30 disabled:bg-brand/15 disabled:text-brand/40 disabled:outline-brand/15 disabled:shadow-none" aria-label={label}>
    <Icon name="arrow" className={`h-4 w-4 transition-transform duration-150 ease-out ${isPrevious ? "rotate-180 group-hover:-translate-x-1" : "group-hover:translate-x-1"}`} />
  </button>;
}

function ListingCard({ listing }: { listing: Listing }) {
  return <article className="relative flex h-full min-w-0 flex-col p-2 transition-transform duration-200 hover:-translate-y-0.5 motion-reduce:transition-none motion-reduce:hover:translate-y-0">
    <span className="pointer-events-none absolute right-0 top-0 h-[3px] w-2/5 rounded-full bg-brand/80" aria-hidden="true" />
    <span className="pointer-events-none absolute bottom-0 right-0 h-[3px] w-3/5 rounded-full bg-brand/80" aria-hidden="true" />
    <span className="pointer-events-none absolute bottom-0 right-0 top-0 w-[3px] rounded-full bg-brand/80" aria-hidden="true" />
    <div className="flex h-full flex-col overflow-hidden bg-mist">
      <div className="relative h-56 shrink-0 overflow-hidden">
        {listing.image ? <Image src={listing.image} alt={listing.imageAlt ?? listing.title} fill sizes="(max-width: 767px) calc(100vw - 5.5rem), (max-width: 1023px) 42vw, 28vw" className="object-cover [filter:saturate(.9)]" /> : null}
      </div>
      <div className="flex min-h-[13.25rem] flex-1 flex-col p-5">
        <p className="text-xs font-bold tracking-[.14em] text-brand">{listing.kind}</p>
        <h4 className="mt-2 text-xl font-bold tracking-[-.025em] text-ink">{listing.title}</h4>
        {listing.place ? <p className="mt-3 text-sm text-ink/65">{listing.place}</p> : null}
        {listing.detail ? <p className="mt-auto border-t border-mist-line pt-4 text-sm font-bold text-ink">{listing.detail}</p> : null}
        {listing.href ? <Link href={listing.href} className={buttonClassName({ tone: "owner", className: "mt-6 w-fit" })}>Mehr erfahren <Icon name="arrow" className={buttonArrowClassName} /></Link> : null}
      </div>
    </div>
  </article>;
}

function SingleListing({ listing }: { listing: Listing }) {
  return <article className="relative mx-auto mt-8 w-full p-[clamp(.6rem,1vw,.9rem)] transition-transform duration-200 hover:-translate-y-0.5 motion-reduce:transition-none motion-reduce:hover:translate-y-0">
    <span className="pointer-events-none absolute right-0 top-0 h-[3px] w-2/5 rounded-full bg-brand/80" aria-hidden="true" />
    <span className="pointer-events-none absolute bottom-0 right-0 h-[3px] w-3/5 rounded-full bg-brand/80" aria-hidden="true" />
    <span className="pointer-events-none absolute bottom-0 right-0 top-0 w-[3px] rounded-full bg-brand/80" aria-hidden="true" />
    <div className="grid min-w-0 bg-mist lg:grid-cols-[minmax(0,1.15fr)_minmax(18rem,.85fr)] lg:items-stretch">
      <div className="relative min-h-64 overflow-hidden sm:min-h-80 lg:min-h-[clamp(22rem,30vw,30rem)]">
        {listing.image ? <Image src={listing.image} alt={listing.imageAlt ?? listing.title} fill sizes="(max-width: 1023px) calc(100vw - 5rem), 54vw" className="object-cover [filter:saturate(.9)]" /> : null}
      </div>
      <div className="flex min-w-0 flex-col justify-center p-[clamp(1.5rem,4vw,3.5rem)]">
        <p className="text-xs font-bold tracking-[.14em] text-brand">{listing.kind}</p>
        <h4 className="mt-3 text-[clamp(1.75rem,3vw,3rem)] font-bold leading-tight tracking-[-.04em] text-ink">{listing.title}</h4>
        <dl className="mt-7 space-y-4 text-sm">
          {listing.place ? <div>
            <dt className="font-bold text-ink/55">Ort</dt>
            <dd className="mt-1 text-base text-ink">{listing.place}</dd>
          </div> : null}
          {listing.detail ? <div>
            <dt className="font-bold text-ink/55">Fakten</dt>
            <dd className="mt-1 text-base text-ink">{listing.detail}</dd>
          </div> : null}
        </dl>
        <div className="mt-8">
          {listing.href ? <Link href={listing.href} className={buttonClassName({ tone: "owner" })}>Mehr erfahren <Icon name="arrow" className={buttonArrowClassName} /></Link> : null}
        </div>
      </div>
    </div>
  </article>;
}

function ListingCarousel({ title, listings }: { title: string; listings: Listing[] }) {
  const visibleColumns = useVisibleColumns();
  const visibleCount = Math.min(visibleColumns, Math.max(listings.length, 1));
  const lastPosition = Math.max(0, listings.length - visibleColumns);
  const [position, setPosition] = useState(0);
  const safePosition = Math.min(position, lastPosition);
  const visibleListings = listings.slice(safePosition, safePosition + visibleColumns);
  const hasNavigation = lastPosition > 0;
  const widthClass = visibleCount === 1 ? "max-w-md" : visibleCount === 2 ? "max-w-4xl" : "max-w-none";

  return <section aria-labelledby={`${title.toLowerCase().replaceAll(" ", "-")}-title`}>
    <h3 id={`${title.toLowerCase().replaceAll(" ", "-")}-title`} className="text-[clamp(1.65rem,2.5vw,2.5rem)] font-bold leading-tight tracking-[-.04em] text-ink">{title}</h3>
    {listings.length === 1 ? <SingleListing listing={listings[0]} /> : listings.length > 1 ? <>
      <div className={`mx-auto mt-8 grid w-full gap-5 ${widthClass}`} style={{ gridTemplateColumns: `repeat(${visibleCount}, minmax(0, 1fr))` }}>
        {visibleListings.map((listing) => <ListingCard listing={listing} key={`${listing.kind}-${listing.title}`} />)}
      </div>
      {hasNavigation ? <div className="mt-8 flex items-center justify-center gap-[clamp(1rem,3vw,2rem)]" aria-label={`${title}: Navigation`}>
        <ArrowButton direction="previous" disabled={safePosition === 0} label="Vorherige Angebote" onClick={() => setPosition((current) => Math.max(0, current - 1))} />
        <div className="flex items-center justify-center gap-2" aria-hidden="true">
          {Array.from({ length: lastPosition + 1 }, (_, index) => <span className={`block h-2.5 w-2.5 rounded-[1px] bg-brand transition-opacity duration-150 ${index === safePosition ? "opacity-100" : "opacity-30"}`} key={index} />)}
        </div>
        <span className="sr-only" aria-live="polite">Position {safePosition + 1} von {lastPosition + 1}</span>
        <ArrowButton direction="next" disabled={safePosition === lastPosition} label="Nächste Angebote" onClick={() => setPosition((current) => Math.min(lastPosition, current + 1))} />
      </div> : null}
    </> : <p className="mt-6 text-base leading-relaxed text-ink/70">Aktuell sind keine Angebote in diesem Bereich verfügbar.</p>}
  </section>;
}

export function OwnerListings({ listings }: { listings: Listing[] }) {
  const houseboats = listings.filter((listing) => listing.kind === "Hausboot");
  const berths = listings.filter((listing) => listing.kind === "Liegeplatz");

  return <section className="container-page mt-[clamp(4.5rem,10vw,9rem)] pb-[clamp(1rem,3vw,3rem)]" aria-labelledby="owner-listings-title">
    <div className="relative p-[clamp(.6rem,1vw,.9rem)]">
      <span className="pointer-events-none absolute left-0 top-0 h-[3px] w-1/3 rounded-full bg-brand" aria-hidden="true" />
      <span className="pointer-events-none absolute left-0 top-0 h-1/3 w-[3px] rounded-full bg-brand" aria-hidden="true" />
      <span className="pointer-events-none absolute bottom-0 right-0 h-[3px] w-1/3 rounded-full bg-brand" aria-hidden="true" />
      <span className="pointer-events-none absolute bottom-0 right-0 h-1/3 w-[3px] rounded-full bg-brand" aria-hidden="true" />
      <div className="bg-ice p-[clamp(1.5rem,5vw,5rem)]">
        <h2 id="owner-listings-title" className="text-[clamp(2rem,4vw,4.5rem)] font-bold leading-[.96] tracking-[-.05em] text-ink">Ihr Platz. Ihr Hausboot.</h2>
        <p className="mt-5 text-base leading-relaxed text-ink/70 sm:text-lg">Entdecken Sie aktuelle Hausboote und Liegeplätze zum Verkauf.</p>
        <div className="mt-[clamp(3.5rem,7vw,6rem)] space-y-[clamp(4rem,8vw,7rem)]">
          <ListingCarousel title="Hausboote zum Verkauf" listings={houseboats} />
          <ListingCarousel title="Liegeplätze zum Verkauf" listings={berths} />
        </div>
      </div>
    </div>
  </section>;
}
