export type Accommodation = { name: string; place: string; guests: number; price: string; tag: string };
export type Listing = { title: string; kind: "Hausboot" | "Liegeplatz"; href?: string; place?: string; detail?: string; image?: string; imageAlt?: string };
export type PublicMasterData = { address: string | null; email: string | null; facebookUrl: string | null; instagramUrl: string | null; officeHours: string | null; phone: string | null; tiktokUrl: string | null; companyName: string | null };
export type Job = { title: string; type: string; place: string };
export type NavigationTone = "guest" | "owner" | "neutral";
export type NavigationGroup = { label: string; href: string; links: string[]; tone: NavigationTone };

export const accommodations: Accommodation[] = [{ name: "Hafenkante 7", place: "Heiligenhafen", guests: 4, price: "ab 119 € / Nacht", tag: "Meerblick" }, { name: "Dünenhaus Nord", place: "Fehmarn", guests: 6, price: "ab 159 € / Nacht", tag: "Strandnah" }, { name: "Ankerplatz 14", place: "Großenbrode", guests: 2, price: "ab 89 € / Nacht", tag: "Hafenlage" }];
export const jobs: Job[] = [{ title: "Mitarbeit Gästebetreuung", type: "Teilzeit · Saison", place: "Heiligenhafen" }, { title: "Objektbetreuung Ostsee", type: "Vollzeit", place: "Fehmarn & Großenbrode" }];
export const navGroups: NavigationGroup[] = [
  { label: "Für Urlauber/innen", href: "/suchen-und-buchen", links: ["Finde Hausbooturlaube", "Urlauber A-Z", "Kurtaxe"], tone: "guest" },
  { label: "Für Eigentümer/innen", href: "/eigentuemer", links: ["Verkauf Liegeplätze", "Verkauf Hausboote", "Serviceleistungen"], tone: "owner" },
  { label: "Jobs & Kontakt", href: "/stellenangebote", links: ["Stellenangebote", "Kontakt"], tone: "neutral" },
];
