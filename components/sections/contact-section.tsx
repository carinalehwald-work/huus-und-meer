import Link from "next/link";

import { Icon } from "@/components/ui/icon";
import { SectionLabel } from "@/components/ui/section-label";
import type { PublicMasterData } from "@/data/site";

export function ContactSection({ masterData }: { masterData: PublicMasterData }) {
  return (
    <section id="kontakt" className="bg-sand">
      <div className="container-page">
        <div className="relative p-[clamp(.55rem,1vw,.9rem)]">
          <span aria-hidden="true" className="pointer-events-none absolute left-0 top-0 h-[3px] w-1/3 rounded-full bg-red" />
          <span aria-hidden="true" className="pointer-events-none absolute left-0 top-0 h-1/3 w-[3px] rounded-full bg-red" />
          <span aria-hidden="true" className="pointer-events-none absolute bottom-0 right-0 h-[3px] w-1/3 rounded-full bg-brand" />
          <span aria-hidden="true" className="pointer-events-none absolute bottom-0 right-0 h-1/3 w-[3px] rounded-full bg-brand" />

          <div className="bg-linen p-[clamp(1.75rem,4vw,4.5rem)]">
            <div>
              <SectionLabel>KONTAKT</SectionLabel>
              <h2 className="max-w-2xl text-3xl font-semibold tracking-tight md:text-4xl">Moin. Womit dürfen wir Ihnen helfen?</h2>
              <p className="mt-4 max-w-xl leading-relaxed text-ink/70">Ob Urlaub, Vermietung, Verkauf oder eine gute Frage: Unser Team ist gern persönlich für Sie da.</p>
              {masterData.phone || masterData.email ? (
                <div className="mt-6 flex flex-wrap gap-x-6 gap-y-2 text-sm font-semibold">
                  {masterData.phone ? <a className="hover:text-brand" href={`tel:${masterData.phone.replaceAll(/[^+\d]/g, "")}`}>{masterData.phone}</a> : null}
                  {masterData.email ? <a className="hover:text-brand" href={`mailto:${masterData.email}`}>{masterData.email}</a> : null}
                </div>
              ) : null}
              <div className="mt-5">
                <Link href="/kontakt" className="group inline-flex min-h-12 shrink-0 items-center justify-center rounded-[0.2rem] border border-red bg-red px-5 py-3 text-sm font-bold text-linen outline outline-1 outline-offset-[3px] outline-red/55 shadow-[0_3px_10px_color-mix(in_srgb,var(--color-red)_16%,transparent)] transition-[background-color,color,box-shadow,transform] duration-150 ease-out hover:-translate-y-0.5 hover:bg-sand hover:text-ink hover:shadow-[0_6px_14px_color-mix(in_srgb,var(--color-red)_20%,transparent)] active:translate-y-px active:shadow-none focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-ink">Kontakt aufnehmen <Icon name="arrow" className="ml-2 h-4 w-4 transition-transform duration-150 ease-out group-hover:translate-x-1" /></Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
