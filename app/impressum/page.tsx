import type { Metadata } from "next";
import { connection } from "next/server";
import { LegalPage, LegalSection } from "@/components/legal-page";
import { prisma } from "@/lib/prisma";

export const metadata: Metadata = { title: "Impressum | Huus & Meer" };

export default async function ImpressumPage() {
  await connection();
  const data = await prisma.stammdatenV1.findUnique({ where: { id: "zentral" } });
  return <LegalPage eyebrow="RECHTLICHES" title="Impressum"><LegalSection title="Angaben gemäß § 5 TMG"><p className="whitespace-pre-line">{[data?.impressumName ?? data?.inhaber ?? "Olga Kaul", data?.unternehmensname ?? "Huus und Meer", data?.strasse ?? "Am Soll 12", [data?.plz, data?.ort].filter(Boolean).join(" ") || "23769 Fehmarn"].join("\n")}</p><p>USt.-ID: {data?.umsatzsteuerId ?? "DE365732296"}<br />Steuer-Nr.: {data?.steuernummer ?? "25/059/01183"}</p></LegalSection><LegalSection title="Kontakt"><p>Telefon: {data?.telefon ?? "+49 (0) 4372 8066594"}<br />E-Mail: {data?.email ?? "moin@huus-und-meer.de"}</p></LegalSection></LegalPage>;
}
