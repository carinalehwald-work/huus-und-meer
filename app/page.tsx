import { connection } from "next/server";

import { Footer } from "@/components/layout/footer";
import { Header } from "@/components/layout/header";
import { ContactSection } from "@/components/sections/contact-section";
import { GuestSection } from "@/components/sections/guest-section";
import { Hero } from "@/components/sections/hero";
import { MoreSection } from "@/components/sections/more-section";
import { OwnerSection } from "@/components/sections/owner-section";
import { SectionBackButton } from "@/components/ui/section-back-button";
import type { Listing, PublicMasterData } from "@/data/site";
import { publicMasterDataFrom } from "@/lib/public-master-data";
import { prisma } from "@/lib/prisma";

function formatPrice(value: { toString(): string } | null): string | undefined {
  if (!value) return undefined;
  const price = Number(value.toString());
  return Number.isFinite(price) ? new Intl.NumberFormat("de-DE", { style: "currency", currency: "EUR", maximumFractionDigits: 0 }).format(price) : undefined;
}

export default async function Home() {
  await connection();
  const [houseboats, berths, masterData] = await Promise.all([
    prisma.hausbootAngebot.findMany({ where: { status: "VEROEFFENTLICHT" }, include: { bilder: { orderBy: [{ istTitelbild: "desc" }, { reihenfolge: "asc" }] } }, orderBy: [{ hervorgehoben: "desc" }, { geaendertAm: "desc" }] }),
    prisma.liegeplatzAngebot.findMany({ where: { status: "VEROEFFENTLICHT" }, include: { bilder: { orderBy: [{ istTitelbild: "desc" }, { reihenfolge: "asc" }] } }, orderBy: [{ hervorgehoben: "desc" }, { geaendertAm: "desc" }] }),
    prisma.stammdatenV1.findUnique({ where: { id: "zentral" } }),
  ]);
  const listings: Listing[] = [
    ...houseboats.map((houseboat) => {
      const image = houseboat.bilder[0];
      return { kind: "Hausboot" as const, href: `/eigentuemer/verkauf/hausboote/${houseboat.slug}`, title: houseboat.titel ?? "Hausboot", place: houseboat.standort ?? undefined, detail: formatPrice(houseboat.preis) ?? houseboat.preisHinweis ?? undefined, image: image?.bildReferenz, imageAlt: image?.altText ?? houseboat.titel ?? "Hausboot" };
    }),
    ...berths.map((berth) => {
      const image = berth.bilder[0];
      return { kind: "Liegeplatz" as const, href: `/eigentuemer/verkauf/liegeplaetze/${berth.slug}`, title: berth.titel ?? "Liegeplatz", image: image?.bildReferenz, imageAlt: image?.altText ?? berth.titel ?? "Liegeplatz" };
    }),
  ];
  const publicMasterData: PublicMasterData = publicMasterDataFrom(masterData);
  return <><Header masterData={publicMasterData} /><main><Hero /><GuestSection /><OwnerSection listings={listings} /><MoreSection /><ContactSection masterData={publicMasterData} /></main><Footer masterData={publicMasterData} /><SectionBackButton /></>;
}
