import type { Metadata } from "next";
import { AreaPage } from "@/components/pages/area-page";

export const metadata: Metadata = {
  title: "Vermieten & Verkaufen | Huus & Meer",
  description: "Der Bereich für Eigentümerinnen und Eigentümer an der Ostsee bei Huus & Meer.",
};

export default function RentAndSellPage() {
  return <AreaPage
    theme="owner"
    label="EIGENTÜMER/INNEN"
    title="Vermieten & Verkaufen"
    introductionTitle="Das gute Gefühl, alles in besten Händen zu wissen."
    introduction="Wir begleiten Ihre Immobilie mit Erfahrung, Aufmerksamkeit und einem starken Netzwerk entlang der Ostseeküste."
    ctaLabel="Gespräch vereinbaren"
    ctaHref="/#kontakt"
  />;
}
