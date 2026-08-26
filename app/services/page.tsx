import type { Metadata } from "next";
import { connection } from "next/server";

import { Footer } from "@/components/layout/footer";
import { Header } from "@/components/layout/header";
import { ServiceCategory } from "@/components/service-category";
import { ServicesInquiry } from "@/components/services-inquiry";
import { ensureContactInquiryTypes } from "@/lib/contact-inquiry-types";
import { prisma } from "@/lib/prisma";
import { publicMasterDataFrom } from "@/lib/public-master-data";

export const metadata: Metadata = { title: "Services | Huus & Meer", description: "Persönliche Services für Gäste, Eigentümer, Vermietung und Hausbootobjekte an der Ostsee." };

export default async function ServicesPage() {
  await connection();
  await ensureContactInquiryTypes();
  const [categories, masterData, inquiryTypes] = await Promise.all([
    prisma.serviceKategorie.findMany({ where: { istAktiv: true }, include: { services: { where: { istAktiv: true }, orderBy: { reihenfolge: "asc" } } }, orderBy: { reihenfolge: "asc" } }),
    prisma.stammdatenV1.findUnique({ where: { id: "zentral" } }),
    prisma.anfragetyp.findMany({ where: { istAktiv: true }, select: { id: true, name: true, inhaltsbezugArt: true }, orderBy: { reihenfolge: "asc" } }),
  ]);
  const serviceInquiryTypeId = inquiryTypes.find((type) => type.inhaltsbezugArt === "SERVICE")?.id;
  if (!serviceInquiryTypeId) throw new Error("Anfragetyp für Services fehlt.");
  const master = publicMasterDataFrom(masterData);
  const serviceCategories = categories.map((category) => ({ id: category.id, name: category.name, services: category.services.map((service) => ({ id: service.id, titel: service.titel })) }));
  return <><Header masterData={master} /><main className="owner-color-transition"><section className="container-page pb-[clamp(3rem,6vw,5rem)] pt-[clamp(4rem,8vw,8rem)]"><p className="whitespace-nowrap text-[clamp(1.15rem,4.8vw,5.25rem)] font-bold leading-[.9] tracking-[-.065em] text-brand">SERVICELEISTUNGEN</p><h1 className="mt-10 text-[clamp(2rem,3.5vw,3.75rem)] font-bold leading-[.98] tracking-[-.05em] text-ink lg:whitespace-nowrap">Sorgfalt, die man spürt.</h1><p className="mt-8 text-base leading-relaxed text-ink/72 sm:text-lg">Persönliche Betreuung, verlässliche Abläufe und ein gutes Gefühl – für Gäste, Eigentümer, Vermietung und jedes einzelne Objekt.</p></section><section className="container-page pb-[clamp(2rem,5vw,5rem)] pt-[clamp(1rem,3vw,3rem)]"><div className="columns-1 gap-x-6 md:columns-2">{categories.map((category) => <ServiceCategory category={category} key={category.id} />)}</div></section><ServicesInquiry defaultInquiryTypeId={serviceInquiryTypeId} inquiryTypes={inquiryTypes} serviceCategories={serviceCategories} /></main><Footer masterData={master} /></>;
}
