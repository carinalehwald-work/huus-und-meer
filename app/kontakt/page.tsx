import type { Metadata } from "next";
import { connection } from "next/server";

import { ContactForm } from "@/components/contact-form";
import { Footer } from "@/components/layout/footer";
import { Header } from "@/components/layout/header";
import { SectionLabel } from "@/components/ui/section-label";
import { ensureContactInquiryTypes } from "@/lib/contact-inquiry-types";
import { publicMasterDataFrom } from "@/lib/public-master-data";
import { prisma } from "@/lib/prisma";

export const metadata: Metadata = {
  title: "Kontakt | Huus & Meer",
  description: "Kontaktieren Sie Huus & Meer für Fragen rund um Urlaub, Hausboote, Liegeplätze, Service und Stellenangebote.",
};

export default async function ContactPage() {
  await connection();
  await ensureContactInquiryTypes();

  const [masterData, inquiryTypes] = await Promise.all([
    prisma.stammdatenV1.findUnique({ where: { id: "zentral" } }),
    prisma.anfragetyp.findMany({ where: { istAktiv: true }, select: { id: true, name: true }, orderBy: { reihenfolge: "asc" } }),
  ]);
  const publicMasterData = publicMasterDataFrom(masterData);

  return <><Header masterData={publicMasterData} /><main className="bg-sand"><section className="container-page py-[clamp(4rem,8vw,8rem)]"><SectionLabel>KONTAKT</SectionLabel><div className="mt-3 grid gap-10 lg:grid-cols-[.75fr_1.25fr]"><div><h1 className="text-[clamp(2.5rem,5vw,4.5rem)] font-semibold leading-[.98] tracking-tight">Wie können wir helfen?</h1><p className="mt-5 max-w-md leading-relaxed text-ink/70">Schreib uns – ob zu Urlaub, Hausbooten, Liegeplätzen, Service oder einem Stellenangebot. Wir melden uns persönlich zurück.</p></div><ContactForm frameTone="mixed" inquiryTypes={inquiryTypes} defaultInquiryTypeId="standard-allgemeine-anfrage" /></div></section></main><Footer masterData={publicMasterData} /></>;
}
