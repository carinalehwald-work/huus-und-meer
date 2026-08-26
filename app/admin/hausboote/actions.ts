"use server";

import { randomUUID } from "node:crypto";
import { mkdir, unlink, writeFile } from "node:fs/promises";
import path from "node:path";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import { requireActiveAdmin } from "@/lib/admin-auth";
import { cleanAdminName, duplicateNameToastMessage, hasDuplicateAdminName, normalizeAdminName } from "@/lib/admin-name-validation";
import { prisma } from "@/lib/prisma";
import { isUniqueConstraintError } from "@/lib/prisma-unique-error";
import { saleSlug } from "@/lib/sale-slug";

const houseboatPath = "/admin/hausboote";
const uploadDirectory = path.join(process.cwd(), "public", "uploads", "hausboote");
const allowedImageTypes = new Set(["image/jpeg", "image/png", "image/webp"]);
// Der Server-Action-Rahmen ist auf 9 MB gesetzt, damit diese 8-MiB-Dateigrenze inklusive Multipart-Overhead erreichbar ist.
const maximumImageSize = 8 * 1024 * 1024;
const equipmentFields = ["heizung", "faekalientankinhalt", "eingangstuerbreite", "terrassentuer", "innentueren", "hauskonstruktion", "sicherungskasten", "boiler", "elektrik", "feuerloescher", "fernseher", "herd", "kueche", "wohnzimmer", "oberdeck"] as const;

function value(formData: FormData, name: string) {
  const entry = formData.get(name);
  return typeof entry === "string" && entry.trim() ? entry.trim() : null;
}

function integer(formData: FormData, name: string) {
  const rawValue = value(formData, name);
  if (!rawValue) return null;
  const parsed = Number.parseInt(rawValue, 10);
  return Number.isInteger(parsed) && parsed >= 0 ? parsed : null;
}

function editPath(id: string, note?: string, fields: string[] = []) {
  return `${houseboatPath}?bearbeiten=${encodeURIComponent(id)}${note ? `&hinweis=${encodeURIComponent(note)}` : ""}${fields.length ? `&typ=fehler&felder=${encodeURIComponent(fields.join(","))}` : ""}`;
}

function newPath(note: string, fields: string[] = []) {
  return `${houseboatPath}?neu=1&hinweis=${encodeURIComponent(note)}${fields.length ? `&typ=fehler&felder=${encodeURIComponent(fields.join(","))}` : ""}`;
}

async function requireHouseboat(id: string) {
  const houseboat = await prisma.hausbootAngebot.findUnique({ where: { id } });
  if (!houseboat) throw new Error("Hausboot wurde nicht gefunden.");
  return houseboat;
}

function revalidateHouseboats(id?: string) {
  revalidatePath(houseboatPath);
  if (id) revalidatePath(editPath(id));
}

export async function saveHouseboat(formData: FormData) {
  await requireActiveAdmin();
  const id = value(formData, "id");
  const title = value(formData, "titel");

  if (!title) redirect(id ? editPath(id, "Bitte prüfe die markierten Felder.", ["titel"]) : newPath("Bitte prüfe die markierten Felder.", ["titel"]));
  const cleanTitle = cleanAdminName(title);
  const duplicatePath = () => id ? editPath(id, duplicateNameToastMessage, ["titel"]) : newPath(duplicateNameToastMessage, ["titel"]);
  if (await hasDuplicateAdminName(cleanTitle, (normalizedName) => prisma.hausbootAngebot.findFirst({ where: { titelNormalisiert: normalizedName, ...(id ? { id: { not: id } } : {}) }, select: { id: true } }))) redirect(duplicatePath());

  const ausstattung = Object.fromEntries(equipmentFields.map((field) => [field, value(formData, field)]));
  const data = {
    titel: cleanTitle,
    titelNormalisiert: normalizeAdminName(cleanTitle),
    slug: value(formData, "slug") ?? saleSlug(cleanTitle),
    beschreibung: value(formData, "beschreibung"),
    standort: value(formData, "standort"),
    hafen: value(formData, "hafen"),
    liegeplatz: value(formData, "liegeplatz"),
    preis: value(formData, "preis"),
    preisHinweis: value(formData, "preisHinweis"),
    baujahr: value(formData, "baujahr"),
    hersteller: value(formData, "hersteller"),
    zulassung: value(formData, "zulassung"),
    laenge: value(formData, "laenge"),
    breite: value(formData, "breite"),
    wohnflaeche: value(formData, "wohnflaeche"),
    rumpftyp: value(formData, "rumpftyp"),
    bootstyp: value(formData, "bootstyp"),
    designKategorie: value(formData, "designKategorie"),
    maximaleZuladung: value(formData, "maximaleZuladung"),
    anzahlSchlafplaetze: integer(formData, "anzahlSchlafplaetze"),
    hervorgehoben: formData.get("hervorgehoben") === "on",
    ausstattung,
  };

  if (id) {
    await requireHouseboat(id);
    try {
      await prisma.hausbootAngebot.update({ where: { id }, data });
    } catch (error) {
      if (isUniqueConstraintError(error, ["titelNormalisiert"])) redirect(duplicatePath());
      throw error;
    }
    revalidateHouseboats(id);
    redirect(editPath(id, "Änderungen gespeichert."));
  }

  let created;
  try {
    created = await prisma.hausbootAngebot.create({ data: { id: randomUUID(), ...data } });
  } catch (error) {
    if (isUniqueConstraintError(error, ["titelNormalisiert"])) redirect(duplicatePath());
    throw error;
  }
  revalidateHouseboats();
  redirect(editPath(created.id, "Entwurf angelegt."));
}

export async function setHouseboatStatus(formData: FormData) {
  await requireActiveAdmin();
  const id = value(formData, "id");
  const status = value(formData, "status");
  if (!id || !status || !["ENTWURF", "VEROEFFENTLICHT", "VERKAUFT", "ARCHIVIERT"].includes(status)) return;
  const houseboat = await prisma.hausbootAngebot.findUnique({ where: { id }, include: { bilder: true } });
  if (!houseboat) throw new Error("Hausboot wurde nicht gefunden.");
  if (status === "VEROEFFENTLICHT") {
    const required = [["titel", houseboat.titel], ["standort", houseboat.standort], ["preis", houseboat.preis], ["preisHinweis", houseboat.preisHinweis], ["baujahr", houseboat.baujahr], ["hersteller", houseboat.hersteller], ["zulassung", houseboat.zulassung], ["laenge", houseboat.laenge], ["breite", houseboat.breite], ["rumpftyp", houseboat.rumpftyp], ["bootstyp", houseboat.bootstyp], ["designKategorie", houseboat.designKategorie], ["maximaleZuladung", houseboat.maximaleZuladung], ["anzahlSchlafplaetze", houseboat.anzahlSchlafplaetze]] as const;
    const missingFields = required.filter(([, field]) => field === null || field === undefined || field === "").map(([field]) => field);
    if (missingFields.length) redirect(editPath(id, "Bitte prüfe die markierten Felder.", missingFields));
    const imageFields = [...(houseboat.bilder.length === 0 || houseboat.bilder.filter((image) => image.istTitelbild).length !== 1 ? ["bild"] : []), ...(houseboat.bilder.some((image) => !image.altText?.trim()) ? ["altText"] : [])];
    if (imageFields.length) redirect(editPath(id, "Bitte prüfe die markierten Bildangaben.", imageFields));
  }
  await prisma.hausbootAngebot.update({ where: { id }, data: { status: status as "ENTWURF" | "VEROEFFENTLICHT" | "VERKAUFT" | "ARCHIVIERT" } });
  revalidateHouseboats(id);
  redirect(editPath(id, status === "VEROEFFENTLICHT" ? "Erfolgreich veröffentlicht." : status === "ENTWURF" ? "Veröffentlichung aufgehoben." : "Status aktualisiert."));
}

export async function deleteHouseboat(formData: FormData) {
  await requireActiveAdmin();
  const id = value(formData, "id");
  if (!id) return;
  const houseboat = await prisma.hausbootAngebot.findUnique({ where: { id }, include: { bilder: true, kontaktanfragen: { select: { id: true } } } });
  if (!houseboat) return;
  if (houseboat.kontaktanfragen.length > 0) redirect(editPath(id, "Löschen nicht möglich: Es bestehen Kontaktanfragen zu diesem Angebot."));
  await prisma.$transaction(async (transaction) => {
    await transaction.hausbootBild.deleteMany({ where: { hausbootAngebotId: id } });
    await transaction.hausbootExposeEintrag.deleteMany({ where: { hausbootAngebotId: id } });
    await transaction.hausbootAngebot.delete({ where: { id } });
  });
  await Promise.all(houseboat.bilder.map(async (image) => {
    if (!image.bildReferenz.startsWith("/uploads/hausboote/")) return;
    await unlink(path.join(uploadDirectory, path.basename(image.bildReferenz))).catch(() => undefined);
  }));
  revalidateHouseboats();
  redirect(`${houseboatPath}?hinweis=Hausboot gelöscht.`);
}

export async function uploadHouseboatImage(formData: FormData) {
  await requireActiveAdmin();
  const houseboatId = value(formData, "hausbootId");
  const file = formData.get("bild");
  if (!houseboatId || !(file instanceof File) || file.size === 0) redirect(editPath(houseboatId ?? "", "Bitte wähle ein Bild aus.", ["bild"]));
  if (!allowedImageTypes.has(file.type) || file.size > maximumImageSize) redirect(editPath(houseboatId, "Erlaubt sind JPG, PNG oder WebP bis 8 MB.", ["bild"]));
  await requireHouseboat(houseboatId);
  const extension = file.type === "image/png" ? ".png" : file.type === "image/webp" ? ".webp" : ".jpg";
  const fileName = `${randomUUID()}${extension}`;
  await mkdir(uploadDirectory, { recursive: true });
  await writeFile(path.join(uploadDirectory, fileName), Buffer.from(await file.arrayBuffer()));
  const count = await prisma.hausbootBild.count({ where: { hausbootAngebotId: houseboatId } });
  await prisma.hausbootBild.create({ data: { id: randomUUID(), hausbootAngebotId: houseboatId, bildReferenz: `/uploads/hausboote/${fileName}`, reihenfolge: count, istTitelbild: count === 0, altText: value(formData, "altText") } });
  revalidateHouseboats(houseboatId);
  redirect(editPath(houseboatId, "Bild hochgeladen."));
}

export async function updateHouseboatImage(formData: FormData) {
  await requireActiveAdmin();
  const id = value(formData, "bildId"); const houseboatId = value(formData, "hausbootId");
  if (!id || !houseboatId) return;
  await prisma.hausbootBild.update({ where: { id }, data: { altText: value(formData, "altText") } });
  revalidateHouseboats(houseboatId); redirect(editPath(houseboatId, "Bildbeschreibung gespeichert."));
}

export async function setTitleImage(formData: FormData) {
  await requireActiveAdmin();
  const id = value(formData, "bildId"); const houseboatId = value(formData, "hausbootId");
  if (!id || !houseboatId) return;
  await prisma.$transaction([prisma.hausbootBild.updateMany({ where: { hausbootAngebotId: houseboatId }, data: { istTitelbild: false } }), prisma.hausbootBild.update({ where: { id }, data: { istTitelbild: true } })]);
  revalidateHouseboats(houseboatId); redirect(editPath(houseboatId, "Titelbild festgelegt."));
}

export async function moveHouseboatImage(formData: FormData) {
  await requireActiveAdmin();
  const id = value(formData, "bildId"); const houseboatId = value(formData, "hausbootId"); const direction = value(formData, "richtung");
  if (!id || !houseboatId || !direction) return;
  const images = await prisma.hausbootBild.findMany({ where: { hausbootAngebotId: houseboatId }, orderBy: { reihenfolge: "asc" } });
  const index = images.findIndex((image) => image.id === id); const target = index + (direction === "hoch" ? -1 : 1);
  if (index < 0 || target < 0 || target >= images.length) redirect(editPath(houseboatId));
  [images[index], images[target]] = [images[target], images[index]];
  await prisma.$transaction(async (transaction) => { await transaction.hausbootBild.updateMany({ where: { hausbootAngebotId: houseboatId }, data: { reihenfolge: { increment: 10000 } } }); await Promise.all(images.map((image, position) => transaction.hausbootBild.update({ where: { id: image.id }, data: { reihenfolge: position } }))); });
  revalidateHouseboats(houseboatId); redirect(editPath(houseboatId, "Bildreihenfolge aktualisiert."));
}

export async function deleteHouseboatImage(formData: FormData) {
  await requireActiveAdmin();
  const id = value(formData, "bildId"); const houseboatId = value(formData, "hausbootId"); if (!id || !houseboatId) return;
  const image = await prisma.hausbootBild.findUnique({ where: { id } }); if (!image || image.hausbootAngebotId !== houseboatId) return;
  await prisma.hausbootBild.delete({ where: { id } });
  if (image.bildReferenz.startsWith("/uploads/hausboote/")) await unlink(path.join(uploadDirectory, path.basename(image.bildReferenz))).catch(() => undefined);
  const remaining = await prisma.hausbootBild.findMany({ where: { hausbootAngebotId: houseboatId }, orderBy: { reihenfolge: "asc" } });
  await prisma.$transaction(async (transaction) => { await transaction.hausbootBild.updateMany({ where: { hausbootAngebotId: houseboatId }, data: { reihenfolge: { increment: 10000 } } }); await Promise.all(remaining.map((item, position) => transaction.hausbootBild.update({ where: { id: item.id }, data: { reihenfolge: position, istTitelbild: position === 0 ? item.istTitelbild : false } }))); });
  revalidateHouseboats(houseboatId); redirect(editPath(houseboatId, "Bild gelöscht."));
}

export async function saveExposeCategory(formData: FormData) {
  await requireActiveAdmin();
  const houseboatId = value(formData, "hausbootId"); const id = value(formData, "kategorieId"); const nameField = value(formData, "nameField") ?? "name"; const name = value(formData, nameField);
  if (!houseboatId) return;
  if (!name) redirect(editPath(houseboatId, "Bitte prüfe die markierten Felder.", [nameField]));
  const cleanName = cleanAdminName(name);
  const duplicatePath = () => editPath(houseboatId, duplicateNameToastMessage, [nameField]);
  if (await hasDuplicateAdminName(cleanName, (normalizedName) => prisma.hausbootExposeKategorie.findFirst({ where: { nameNormalisiert: normalizedName, ...(id ? { id: { not: id } } : {}) }, select: { id: true } }))) redirect(duplicatePath());
  const categoryData = { name: cleanName, nameNormalisiert: normalizeAdminName(cleanName) };
  try {
    if (id) await prisma.hausbootExposeKategorie.update({ where: { id }, data: categoryData });
    else { const count = await prisma.hausbootExposeKategorie.count(); await prisma.hausbootExposeKategorie.create({ data: { id: randomUUID(), reihenfolge: count, ...categoryData } }); }
  } catch (error) {
    if (isUniqueConstraintError(error, ["nameNormalisiert"])) redirect(duplicatePath());
    throw error;
  }
  revalidateHouseboats(houseboatId); redirect(editPath(houseboatId, "Exposé-Kategorie gespeichert."));
}

export async function deleteExposeCategory(formData: FormData) {
  await requireActiveAdmin();
  const houseboatId = value(formData, "hausbootId"); const id = value(formData, "kategorieId"); if (!houseboatId || !id) return;
  const entries = await prisma.hausbootExposeEintrag.count({ where: { kategorieId: id } });
  if (entries > 0) redirect(editPath(houseboatId, "Kategorie kann erst gelöscht werden, wenn keine Einträge mehr zugeordnet sind."));
  await prisma.hausbootExposeKategorie.delete({ where: { id } }); revalidateHouseboats(houseboatId); redirect(editPath(houseboatId, "Exposé-Kategorie gelöscht."));
}

export async function moveExposeCategory(formData: FormData) {
  await requireActiveAdmin();
  const houseboatId = value(formData, "hausbootId"); const id = value(formData, "kategorieId"); const direction = value(formData, "richtung"); if (!houseboatId || !id || !direction) return;
  const categories = await prisma.hausbootExposeKategorie.findMany({ orderBy: { reihenfolge: "asc" } }); const index = categories.findIndex((category) => category.id === id); const target = index + (direction === "hoch" ? -1 : 1);
  if (index >= 0 && target >= 0 && target < categories.length) { [categories[index], categories[target]] = [categories[target], categories[index]]; await prisma.$transaction(categories.map((category, position) => prisma.hausbootExposeKategorie.update({ where: { id: category.id }, data: { reihenfolge: position } }))); }
  revalidateHouseboats(houseboatId); redirect(editPath(houseboatId, "Exposé-Reihenfolge aktualisiert."));
}

export async function saveExposeEntry(formData: FormData) {
  await requireActiveAdmin();
  const houseboatId = value(formData, "hausbootId"); const id = value(formData, "eintragId"); const kategorieId = value(formData, "kategorieId"); const bezeichnung = value(formData, "bezeichnung"); const beschreibung = value(formData, "beschreibung");
  if (!houseboatId || !kategorieId) return;
  if (!bezeichnung || !beschreibung) {
    const missingFields = [...(!bezeichnung ? ["bezeichnung"] : []), ...(!beschreibung ? ["beschreibung"] : [])];
    redirect(editPath(houseboatId, "Bitte prüfe die markierten Felder.", missingFields));
  }
  if (id) await prisma.hausbootExposeEintrag.update({ where: { id }, data: { kategorieId, bezeichnung, beschreibung } });
  else { const count = await prisma.hausbootExposeEintrag.count({ where: { hausbootAngebotId: houseboatId, kategorieId } }); await prisma.hausbootExposeEintrag.create({ data: { id: randomUUID(), hausbootAngebotId: houseboatId, kategorieId, bezeichnung, beschreibung, reihenfolge: count } }); }
  revalidateHouseboats(houseboatId); redirect(editPath(houseboatId, "Exposé-Eintrag gespeichert."));
}

export async function deleteExposeEntry(formData: FormData) {
  await requireActiveAdmin();
  const houseboatId = value(formData, "hausbootId"); const id = value(formData, "eintragId"); if (!houseboatId || !id) return;
  await prisma.hausbootExposeEintrag.delete({ where: { id } }); revalidateHouseboats(houseboatId); redirect(editPath(houseboatId, "Exposé-Eintrag gelöscht."));
}

export async function moveExposeEntry(formData: FormData) {
  await requireActiveAdmin();
  const houseboatId = value(formData, "hausbootId"); const id = value(formData, "eintragId"); const kategorieId = value(formData, "kategorieId"); const direction = value(formData, "richtung");
  if (!houseboatId || !id || !kategorieId || !direction) return;
  const entries = await prisma.hausbootExposeEintrag.findMany({ where: { hausbootAngebotId: houseboatId, kategorieId }, orderBy: { reihenfolge: "asc" } }); const index = entries.findIndex((entry) => entry.id === id); const target = index + (direction === "hoch" ? -1 : 1);
  if (index >= 0 && target >= 0 && target < entries.length) { [entries[index], entries[target]] = [entries[target], entries[index]]; await prisma.$transaction(entries.map((entry, position) => prisma.hausbootExposeEintrag.update({ where: { id: entry.id }, data: { reihenfolge: position } }))); }
  revalidateHouseboats(houseboatId); redirect(editPath(houseboatId, "Exposé-Reihenfolge aktualisiert."));
}
