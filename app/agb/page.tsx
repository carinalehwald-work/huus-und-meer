import type { Metadata } from "next";
import { LegalPage, LegalSection } from "@/components/legal-page";

export const metadata: Metadata = { title: "AGB | Huus & Meer" };
const agbPdf = "https://huus-und-meer.de/wp-content/uploads/2026/03/AGB-Huus-Meer-Vermietung-Privatkunden-12-2026.pdf";

export default function AgbPage() {
  return <LegalPage eyebrow="RECHTLICHES" title="Allgemeine Geschäftsbedingungen"><LegalSection title="Huus & Meer"><p>Für die Vermietung von Ferienunterkünften und Hausbooten gelten die Allgemeinen Geschäftsbedingungen von Huus & Meer.</p><p>Die vollständigen Allgemeinen Geschäftsbedingungen können Sie hier als PDF einsehen.</p><a className="inline-flex min-h-12 items-center justify-center border border-red bg-red px-5 py-3 text-sm font-bold text-linen transition hover:bg-sand hover:text-ink focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-ink" href={agbPdf} rel="noreferrer" target="_blank">AGB als PDF ansehen ↗</a></LegalSection></LegalPage>;
}
