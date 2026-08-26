import type { Metadata } from "next";

import { requireActiveAdmin } from "@/lib/admin-auth";
import { prisma } from "@/lib/prisma";

import { saveMasterData } from "./actions";
import { TimeGroups, type TimeGroup } from "./time-groups";

export const metadata: Metadata = { title: "Stammdaten | Admin | Huus & Meer", robots: { index: false, follow: false } };

const input = "mt-1 min-h-11 w-full rounded-xl border border-mist-line bg-ice px-3 text-sm text-ink";
const days = ["montag", "dienstag", "mittwoch", "donnerstag", "freitag", "samstag", "sonntag"] as const;
const stringValue = (value: unknown) => typeof value === "string" ? value : null;

function savedGroups(value: unknown): TimeGroup[] {
  if (Array.isArray(value)) return value.flatMap((item, index) => {
    if (!item || typeof item !== "object") return [];
    const group = item as Record<string, unknown>;
    const tage = Array.isArray(group.tage) ? group.tage.filter((day): day is TimeGroup["tage"][number] => days.includes(day as TimeGroup["tage"][number])) : [];
    return tage.length ? [{ tage, von: stringValue(group.von), bis: stringValue(group.bis), nachVereinbarung: group.nachVereinbarung === true, termineNachVereinbarung: group.termineNachVereinbarung === true, reihenfolge: index }] : [];
  });
  if (!value || typeof value !== "object") return [];
  const legacy = value as Record<string, unknown>;
  const byRule = new Map<string, TimeGroup>();
  days.forEach((day) => {
    const entry = legacy[day];
    if (!entry || typeof entry !== "object") return;
    const rule = entry as Record<string, unknown>;
    if (rule.geschlossen === true) return;
    const von = stringValue(rule.von); const bis = stringValue(rule.bis);
    const nachVereinbarung = rule.nachVereinbarung === true; const termineNachVereinbarung = rule.termineNachVereinbarung === true;
    const key = JSON.stringify([von, bis, nachVereinbarung, termineNachVereinbarung]);
    const group = byRule.get(key) ?? { tage: [], von, bis, nachVereinbarung, termineNachVereinbarung, reihenfolge: byRule.size };
    group.tage.push(day); byRule.set(key, group);
  });
  return [...byRule.values()];
}

export default async function Page({ searchParams }: { searchParams: Promise<{ hinweis?: string }> }) {
  await requireActiveAdmin();
  const [data, query] = await Promise.all([prisma.stammdatenV1.findUnique({ where: { id: "zentral" } }), searchParams]);
  const field = (name: keyof NonNullable<typeof data>) => data?.[name] ?? "";
  const textFields = [["unternehmensname", "Unternehmensname"], ["inhaber", "Inhaber"], ["website", "Website"], ["strasse", "Straße"], ["plz", "PLZ"], ["ort", "Ort"], ["land", "Land"]] as const;
  const contactFields = [["email", "E-Mail", "email"], ["telefon", "Telefon", "tel"], ["whatsapp", "WhatsApp", "tel"], ["kontaktHinweis", "Büro-/Kontakt-Hinweis", "text"]] as const;
  const socialFields = [["instagramUrl", "Instagram"], ["facebookUrl", "Facebook"], ["tiktokUrl", "TikTok"]] as const;
  const legalFields = [["impressumName", "Name im Impressum"], ["umsatzsteuerId", "USt.-ID"], ["steuernummer", "Steuer-Nr."], ["amtsgericht", "Amtsgericht"], ["registerangabe", "Registerangabe"], ["bankName", "Bank"], ["bankKontoinhaber", "Kontoinhaber"], ["bankKonto", "Konto"], ["bankBlz", "BLZ"], ["bankIban", "IBAN"], ["bankBic", "BIC"]] as const;
  return <main className="min-h-dvh bg-mist p-4 sm:p-6 lg:p-8"><div className="mx-auto w-full max-w-[88rem]"><header className="rounded-2xl border border-mist-line bg-ice p-5 shadow-sm sm:p-7"><p className="text-sm font-semibold uppercase tracking-[.16em] text-brand">Huus & Meer · Verwaltung</p><h1 className="mt-2 text-3xl font-semibold">Stammdaten</h1><p className="mt-2 max-w-2xl text-sm text-ink/70">Zentrale Quelle für Unternehmen, Kontakt, Bürozeiten, Social Media und Impressum. Noch nicht mit der öffentlichen Website verbunden.</p></header>{query.hinweis ? <p aria-live="polite" className="mt-4 rounded-xl bg-ice p-3 text-sm">{query.hinweis}</p> : null}<form action={saveMasterData} className="mt-5 space-y-5"><section className="rounded-2xl border border-mist-line bg-ice p-5 shadow-sm sm:p-7"><h2 className="text-xl font-semibold">Unternehmen</h2><div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">{textFields.map(([name, label]) => <label className="text-sm font-semibold" key={name}>{label}<input className={input} defaultValue={String(field(name))} name={name} type={name === "website" ? "url" : "text"} /></label>)}</div></section><section className="rounded-2xl border border-mist-line bg-ice p-5 shadow-sm sm:p-7"><h2 className="text-xl font-semibold">Kontakt</h2><div className="mt-4 grid gap-4 sm:grid-cols-2">{contactFields.map(([name, label, type]) => <label className="text-sm font-semibold" key={name}>{label}<input className={input} defaultValue={String(field(name))} name={name} type={type} /></label>)}</div></section><TimeGroups initialGroups={savedGroups(data?.buerozeiten)} /><section className="rounded-2xl border border-mist-line bg-ice p-5 shadow-sm sm:p-7"><h2 className="text-xl font-semibold">Social Media</h2><div className="mt-4 grid gap-4 sm:grid-cols-3">{socialFields.map(([name, label]) => <label className="text-sm font-semibold" key={name}>{label}<input className={input} defaultValue={String(field(name))} name={name} type="url" /></label>)}</div></section><section className="rounded-2xl border border-mist-line bg-ice p-5 shadow-sm sm:p-7"><h2 className="text-xl font-semibold">Impressum</h2><div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">{legalFields.map(([name, label]) => <label className="text-sm font-semibold" key={name}>{label}<input className={input} defaultValue={String(field(name))} name={name} /></label>)}</div></section><button className="min-h-11 rounded-xl bg-brand px-5 py-2 text-sm font-semibold text-ice">Stammdaten speichern</button></form></div></main>;
}
