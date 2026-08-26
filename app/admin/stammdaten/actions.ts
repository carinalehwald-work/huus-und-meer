"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import { requireActiveAdmin } from "@/lib/admin-auth";
import { prisma } from "@/lib/prisma";

const id = "zentral";
const route = "/admin/stammdaten";
const days = ["montag", "dienstag", "mittwoch", "donnerstag", "freitag", "samstag", "sonntag"] as const;
type Day = (typeof days)[number];
type TimeGroup = { tage: Day[]; von: string | null; bis: string | null; nachVereinbarung: boolean; termineNachVereinbarung: boolean; reihenfolge: number };

function value(data: FormData, key: string) {
  const item = data.get(key);
  return typeof item === "string" && item.trim() ? item.trim() : null;
}

function validUrl(input: string | null) {
  if (!input) return true;

  try {
    const url = new URL(input);
    return url.protocol === "https:" || url.protocol === "http:";
  } catch {
    return false;
  }
}

function timeGroups(data: FormData): TimeGroup[] | null {
  const raw = data.get("zeitgruppen");
  if (typeof raw !== "string") return [];
  try {
    const parsed: unknown = JSON.parse(raw);
    if (!Array.isArray(parsed)) return null;
    const assigned = new Set<Day>();
    const groups: TimeGroup[] = [];
    for (const item of parsed) {
      if (!item || typeof item !== "object") return null;
      const group = item as Record<string, unknown>;
      const tage = Array.isArray(group.tage) ? group.tage.filter((day): day is Day => typeof day === "string" && days.includes(day as Day)) : [];
      if (tage.length === 0 || new Set(tage).size !== tage.length || tage.some((day) => assigned.has(day))) return null;
      const von = typeof group.von === "string" && /^\d{2}:\d{2}$/.test(group.von) ? group.von : null;
      const bis = typeof group.bis === "string" && /^\d{2}:\d{2}$/.test(group.bis) ? group.bis : null;
      const nachVereinbarung = group.nachVereinbarung === true;
      const termineNachVereinbarung = group.termineNachVereinbarung === true;
      if (Boolean(von) !== Boolean(bis) || (!von && !nachVereinbarung && !termineNachVereinbarung)) return null;
      tage.forEach((day) => assigned.add(day));
      groups.push({ tage, von, bis, nachVereinbarung, termineNachVereinbarung, reihenfolge: groups.length });
    }
    return groups;
  } catch {
    return null;
  }
}

export async function saveMasterData(data: FormData) {
  await requireActiveAdmin();

  const urls = [["website", value(data, "website")], ["instagramUrl", value(data, "instagramUrl")], ["facebookUrl", value(data, "facebookUrl")], ["tiktokUrl", value(data, "tiktokUrl")]] as const;
  const invalidUrls = urls.filter(([, url]) => !validUrl(url)).map(([field]) => field);
  if (invalidUrls.length) {
    redirect(`${route}?hinweis=${encodeURIComponent("Bitte prüfe die markierten Webadressen.")}&typ=fehler&felder=${encodeURIComponent(invalidUrls.join(","))}`);
  }

  const email = value(data, "email");
  if (email && !/^\S+@\S+\.\S+$/.test(email)) {
    redirect(`${route}?hinweis=${encodeURIComponent("Bitte gib eine gültige E-Mail-Adresse ein.")}&typ=fehler&felder=email`);
  }

  const buerozeiten = timeGroups(data);
  if (!buerozeiten) redirect(`${route}?hinweis=${encodeURIComponent("Bitte prüfe die Zeitgruppen: Jeder Tag darf nur einmal und jede Gruppe mit einer vollständigen Regel angelegt werden.")}&typ=fehler&felder=zeitgruppen`);
  const fields = ["unternehmensname", "inhaber", "website", "strasse", "plz", "ort", "land", "email", "telefon", "whatsapp", "kontaktHinweis", "instagramUrl", "facebookUrl", "tiktokUrl", "impressumName", "umsatzsteuerId", "steuernummer", "amtsgericht", "registerangabe", "bankName", "bankKontoinhaber", "bankKonto", "bankBlz", "bankIban", "bankBic"] as const;
  const values = Object.fromEntries(fields.map((field) => [field, value(data, field)]));

  await prisma.stammdatenV1.upsert({
    where: { id },
    create: { id, ...values, buerozeiten },
    update: { ...values, buerozeiten },
  });
  revalidatePath(route);
  redirect(`${route}?hinweis=${encodeURIComponent("Stammdaten gespeichert.")}`);
}
