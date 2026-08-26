import type { Metadata } from "next";
import { AreaPage } from "@/components/pages/area-page";

export const metadata: Metadata = {
  title: "Suchen & Buchen | Huus & Meer",
  description: "Der Bereich für Ferienunterkünfte und Urlaub an der Ostsee bei Huus & Meer.",
};

export default function SearchAndBookPage() {
  return <AreaPage
    theme="guest"
    label="URLAUBER/INNEN"
    title="Suchen & Buchen"
    introductionTitle="Die Ostsee ganz nach Ihrem Geschmack."
    introduction="Gemütliche Hafenblicke, viel Platz für die Familie oder ein stiller Rückzugsort in den Dünen – entdecken Sie unsere sorgfältig ausgewählten Unterkünfte."
    ctaLabel="Unterkunft suchen"
    ctaHref="/#gaeste"
  />;
}
