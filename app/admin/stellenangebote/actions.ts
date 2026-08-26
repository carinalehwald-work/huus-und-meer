"use server";

import { randomUUID } from "node:crypto";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import { requireActiveAdmin } from "@/lib/admin-auth";
import { cleanAdminName, duplicateNameToastMessage, hasDuplicateAdminName, normalizeAdminName } from "@/lib/admin-name-validation";
import { prisma } from "@/lib/prisma";
import { isUniqueConstraintError } from "@/lib/prisma-unique-error";

const root = "/admin/stellenangebote";
type ListKind = "ort" | "aufgabe" | "qualifikation";

function value(data: FormData, key: string) {
  const entry = data.get(key);
  return typeof entry === "string" && entry.trim() ? entry.trim() : null;
}

function go(id?: string | null, note?: string, fields: string[] = []): never {
  revalidatePath(root);
  const base = id ? `${root}?bearbeiten=${encodeURIComponent(id)}` : root;
  const separator = base.includes("?") ? "&" : "?";
  redirect(`${base}${note ? `${separator}hinweis=${encodeURIComponent(note)}` : ""}${fields.length ? `${note ? "&" : separator}typ=fehler&felder=${encodeURIComponent(fields.join(","))}` : ""}`);
}

function goNew(note: string, fields: string[] = []): never {
  revalidatePath(root);
  redirect(`${root}?neu=1&hinweis=${encodeURIComponent(note)}${fields.length ? `&typ=fehler&felder=${encodeURIComponent(fields.join(","))}` : ""}`);
}

function date(data: FormData, key: string) {
  const entry = value(data, key);
  return entry ? new Date(`${entry}T00:00:00`) : null;
}

async function requireJob(id: string) {
  const job = await prisma.stellenangebot.findUnique({ where: { id }, include: { bewerbungskontakt: true } });
  if (!job) throw new Error("Stellenangebot nicht gefunden.");
  return job;
}

export async function saveJob(data: FormData) {
  await requireActiveAdmin();
  const id = value(data, "id");
  const titel = value(data, "titel");
  if (!titel) {
    if (id) go(id, "Bitte prüfe die markierten Felder.", ["titel"]);
    else goNew("Bitte prüfe die markierten Felder.", ["titel"]);
  }
  const cleanTitle = cleanAdminName(titel);
  const duplicatePath = () => id ? go(id, duplicateNameToastMessage, ["titel"]) : goNew(duplicateNameToastMessage, ["titel"]);
  if (await hasDuplicateAdminName(cleanTitle, (normalizedName) => prisma.stellenangebot.findFirst({ where: { titelNormalisiert: normalizedName, ...(id ? { id: { not: id } } : {}) }, select: { id: true } }))) duplicatePath();
  const values = { titel: cleanTitle, titelNormalisiert: normalizeAdminName(cleanTitle), arbeitgeber: value(data, "arbeitgeber"), arbeitspensum: value(data, "arbeitspensum"), startdatum: date(data, "startdatum"), enddatum: date(data, "enddatum"), arbeitszeiten: value(data, "arbeitszeiten"), beschreibung: value(data, "beschreibung") };
  if (id) {
    try {
      await prisma.stellenangebot.update({ where: { id }, data: values });
    } catch (error) {
      if (isUniqueConstraintError(error, ["titelNormalisiert"])) duplicatePath();
      throw error;
    }
    go(id, "Änderungen gespeichert.");
  }
  let created;
  try {
    created = await prisma.stellenangebot.create({ data: { id: randomUUID(), ...values } });
  } catch (error) {
    if (isUniqueConstraintError(error, ["titelNormalisiert"])) duplicatePath();
    throw error;
  }
  go(created.id, "Entwurf angelegt.");
}

export async function setJobStatus(data: FormData) {
  await requireActiveAdmin();
  const id = value(data, "id");
  const status = value(data, "status");
  if (!id || !status || !["ENTWURF", "VEROEFFENTLICHT", "ARCHIVIERT"].includes(status)) return;
  const job = await requireJob(id);
  if (status === "VEROEFFENTLICHT") {
    const required = [["titel", job.titel], ["arbeitgeber", job.arbeitgeber], ["arbeitspensum", job.arbeitspensum], ["startdatum", job.startdatum], ["enddatum", job.enddatum], ["arbeitszeiten", job.arbeitszeiten], ["beschreibung", job.beschreibung]] as const;
    const missing = required.filter(([, entry]) => !entry).map(([field]) => field);
    if (missing.length) go(id, "Bitte prüfe die markierten Felder.", missing);
    if (!job.bewerbungskontakt?.email && !job.bewerbungskontakt?.telefon && !job.bewerbungskontakt?.whatsapp) go(id, "Bitte ergänze mindestens eine Kontaktmöglichkeit.", ["email", "telefon", "whatsapp"]);
  }
  await prisma.stellenangebot.update({ where: { id }, data: { status: status as "ENTWURF" | "VEROEFFENTLICHT" | "ARCHIVIERT" } });
  go(id, status === "VEROEFFENTLICHT" ? "Erfolgreich veröffentlicht." : status === "ENTWURF" ? "Veröffentlichung aufgehoben." : "Status aktualisiert.");
}

export async function saveApplicationContact(data: FormData) {
  await requireActiveAdmin();
  const id = value(data, "id");
  const jobId = value(data, "stellenangebotId");
  const email = value(data, "email");
  if (email && !/^\S+@\S+\.\S+$/.test(email)) go(jobId, "Bitte gib eine gültige E-Mail-Adresse ein.", ["email"]);
  const values = { ansprechpartner: value(data, "ansprechpartner"), email, telefon: value(data, "telefon"), whatsapp: value(data, "whatsapp"), adresse: value(data, "adresse") };
  if (id) {
    await prisma.bewerbungskontakt.update({ where: { id }, data: values });
    go(jobId, "Kontakt gespeichert.");
  }
  const created = await prisma.bewerbungskontakt.create({ data: { id: randomUUID(), ...values } });
  go(jobId, `Kontakt angelegt: ${created.id}`);
}

export async function assignApplicationContact(data: FormData) {
  await requireActiveAdmin();
  const jobId = value(data, "stellenangebotId");
  const contactId = value(data, "bewerbungskontaktId");
  if (!jobId) return;
  await prisma.stellenangebot.update({ where: { id: jobId }, data: { bewerbungskontaktId: contactId } });
  go(jobId, "Bewerbungskontakt zugeordnet.");
}

export async function deleteApplicationContact(data: FormData) {
  await requireActiveAdmin();
  const id = value(data, "id");
  const jobId = value(data, "stellenangebotId");
  if (!id) return;
  const count = await prisma.stellenangebot.count({ where: { bewerbungskontaktId: id } });
  if (count > 0) go(jobId, "Kontakt wird noch von Stellenangeboten verwendet und kann nicht gelöscht werden.");
  await prisma.bewerbungskontakt.delete({ where: { id } });
  go(jobId, "Kontakt gelöscht.");
}

export async function saveJobListItem(data: FormData) {
  await requireActiveAdmin();
  const type = value(data, "typ") as ListKind | null;
  const id = value(data, "id");
  const jobId = value(data, "stellenangebotId");
  const content = value(data, "inhalt");
  if (!type || !jobId) return;
  if (!content) go(jobId, "Bitte prüfe die markierten Felder.", ["inhalt"]);
  if (type === "ort") {
    if (id) await prisma.stellenangebotArbeitsort.update({ where: { id }, data: { ort: content } });
    else await prisma.stellenangebotArbeitsort.create({ data: { id: randomUUID(), stellenangebotId: jobId, ort: content, reihenfolge: await prisma.stellenangebotArbeitsort.count({ where: { stellenangebotId: jobId } }) } });
  }
  if (type === "aufgabe") {
    if (id) await prisma.stellenangebotAufgabe.update({ where: { id }, data: { aufgabe: content } });
    else await prisma.stellenangebotAufgabe.create({ data: { id: randomUUID(), stellenangebotId: jobId, aufgabe: content, reihenfolge: await prisma.stellenangebotAufgabe.count({ where: { stellenangebotId: jobId } }) } });
  }
  if (type === "qualifikation") {
    if (id) await prisma.stellenangebotQualifikation.update({ where: { id }, data: { qualifikation: content } });
    else await prisma.stellenangebotQualifikation.create({ data: { id: randomUUID(), stellenangebotId: jobId, qualifikation: content, reihenfolge: await prisma.stellenangebotQualifikation.count({ where: { stellenangebotId: jobId } }) } });
  }
  go(jobId, "Liste gespeichert.");
}

export async function deleteJobListItem(data: FormData) {
  await requireActiveAdmin();
  const type = value(data, "typ") as ListKind | null;
  const id = value(data, "id");
  const jobId = value(data, "stellenangebotId");
  if (!type || !id || !jobId) return;
  if (type === "ort") await prisma.stellenangebotArbeitsort.delete({ where: { id } });
  if (type === "aufgabe") await prisma.stellenangebotAufgabe.delete({ where: { id } });
  if (type === "qualifikation") await prisma.stellenangebotQualifikation.delete({ where: { id } });
  go(jobId, "Eintrag gelöscht.");
}

export async function moveJobListItem(data: FormData) {
  await requireActiveAdmin();
  const type = value(data, "typ") as ListKind | null;
  const id = value(data, "id");
  const jobId = value(data, "stellenangebotId");
  const direction = value(data, "richtung");
  if (!type || !id || !jobId || !direction) return;
  if (type === "ort") {
    const items = await prisma.stellenangebotArbeitsort.findMany({ where: { stellenangebotId: jobId }, orderBy: { reihenfolge: "asc" } });
    await reorder(items, id, direction, (item, position) => prisma.stellenangebotArbeitsort.update({ where: { id: item.id }, data: { reihenfolge: position } }));
  }
  if (type === "aufgabe") {
    const items = await prisma.stellenangebotAufgabe.findMany({ where: { stellenangebotId: jobId }, orderBy: { reihenfolge: "asc" } });
    await reorder(items, id, direction, (item, position) => prisma.stellenangebotAufgabe.update({ where: { id: item.id }, data: { reihenfolge: position } }));
  }
  if (type === "qualifikation") {
    const items = await prisma.stellenangebotQualifikation.findMany({ where: { stellenangebotId: jobId }, orderBy: { reihenfolge: "asc" } });
    await reorder(items, id, direction, (item, position) => prisma.stellenangebotQualifikation.update({ where: { id: item.id }, data: { reihenfolge: position } }));
  }
  go(jobId, "Reihenfolge aktualisiert.");
}

async function reorder<T extends { id: string }>(items: T[], id: string, direction: string, update: (item: T, position: number) => Promise<unknown>) {
  const index = items.findIndex((item) => item.id === id);
  const target = index + (direction === "hoch" ? -1 : 1);
  if (index < 0 || target < 0 || target >= items.length) return;
  [items[index], items[target]] = [items[target], items[index]];
  await Promise.all(items.map(update));
}
