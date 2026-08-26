"use client";

import { useState } from "react";

import { ContactForm } from "@/components/contact-form";

type InquiryType = { id: string; name: string };
type ServiceCategory = { id: string; name: string; services: { id: string; titel: string }[] };

export function ServicesInquiry({ defaultInquiryTypeId, inquiryTypes, serviceCategories }: { defaultInquiryTypeId: string; inquiryTypes: InquiryType[]; serviceCategories: ServiceCategory[] }) {
  const [open, setOpen] = useState(false);

  return <section className="bg-transparent py-[clamp(3rem,7vw,6rem)]" id="service-anfrage"><div className="container-page"><div className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between"><div><p className="text-sm font-semibold uppercase tracking-[.18em] text-brand">Serviceanfrage</p><h2 className="mt-3 text-[clamp(2.2rem,4vw,4.2rem)] font-semibold leading-[.98] tracking-tight">Serviceanfrage</h2><p className="mt-4 max-w-xl leading-relaxed text-ink/70">Stellen Sie Ihre Frage zu unseren Services. Kategorie und konkrete Leistung können Sie optional angeben.</p><p className="mt-3 text-sm font-semibold text-ink/70">Auch eine unverbindliche Preisliste können Sie hier anfordern.</p></div><button aria-expanded={open} className="inline-flex min-h-12 shrink-0 items-center justify-center border border-brand bg-brand px-5 py-3 text-sm font-bold text-ice transition hover:bg-ice hover:text-ink" onClick={() => setOpen((current) => !current)} type="button">{open ? "Anfrage schließen" : "Anfrage stellen"}</button></div>{open ? <div className="services-contact-form mt-8 [&_form]:border-0 [&_form]:rounded-none [&_form]:bg-ice [&_form]:shadow-none [&_input]:rounded-none [&_input]:border-mist-line [&_input]:bg-ice [&_input]:focus:border-brand [&_select]:rounded-none [&_select]:border-mist-line [&_select]:bg-ice [&_select]:focus:border-brand [&_textarea]:rounded-none [&_textarea]:border-mist-line [&_textarea]:bg-ice [&_textarea]:focus:border-brand [&_button]:rounded-none [&_button]:border-brand [&_button]:bg-brand [&_button]:text-ice [&_button]:outline-none [&_button:hover]:bg-ice [&_button:hover]:text-ink"><ContactForm defaultInquiryTypeId={defaultInquiryTypeId} inquiryTypes={inquiryTypes} lockInquiryType ownerTone serviceCategories={serviceCategories} /></div> : null}</div></section>;
}
