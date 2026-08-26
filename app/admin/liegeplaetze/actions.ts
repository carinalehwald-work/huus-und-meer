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

const berthsPath = "/admin/liegeplaetze";
const uploadDirectory = path.join(process.cwd(), "public", "uploads", "liegeplaetze");
const allowedImageTypes = new Set(["image/jpeg", "image/png", "image/webp"]);
const maximumImageSize = 8 * 1024 * 1024;

function value(formData: FormData, name: string) {
  const entry = formData.get(name);
  return typeof entry === "string" && entry.trim() ? entry.trim() : null;
}

function editPath(id: string, note?: string, fields: string[] = []) {
  return `${berthsPath}?bearbeiten=${encodeURIComponent(id)}${note ? `&hinweis=${encodeURIComponent(note)}` : ""}${fields.length ? `&typ=fehler&felder=${encodeURIComponent(fields.join(","))}` : ""}`;
}

function newPath(note: string, fields: string[] = []) {
  return `${berthsPath}?neu=1&hinweis=${encodeURIComponent(note)}${fields.length ? `&typ=fehler&felder=${encodeURIComponent(fields.join(","))}` : ""}`;
}

function revalidateBerths(id?: string) {
  revalidatePath(berthsPath);
  if (id) revalidatePath(editPath(id));
}

async function requireBerth(id: string) {
  const berth = await prisma.liegeplatzAngebot.findUnique({ where: { id } });
  if (!berth) throw new Error("Liegeplatz wurde nicht gefunden.");
  return berth;
}

export async function saveBerth(formData: FormData) {
  await requireActiveAdmin();
  const id = value(formData, "id");
  const titel = value(formData, "titel");
  if (!titel) redirect(id ? editPath(id, "Bitte prüfe die markierten Felder.", ["titel"]) : newPath("Bitte prüfe die markierten Felder.", ["titel"]));
  const cleanTitle = cleanAdminName(titel);
  const duplicatePath = () => id ? editPath(id, duplicateNameToastMessage, ["titel"]) : newPath(duplicateNameToastMessage, ["titel"]);
  if (await hasDuplicateAdminName(cleanTitle, (normalizedName) => prisma.liegeplatzAngebot.findFirst({ where: { titelNormalisiert: normalizedName, ...(id ? { id: { not: id } } : {}) }, select: { id: true } }))) redirect(duplicatePath());
  const data = { titel: cleanTitle, titelNormalisiert: normalizeAdminName(cleanTitle), slug: value(formData, "slug") ?? saleSlug(cleanTitle), beschreibung: value(formData, "beschreibung"), standort: value(formData, "standort"), hafen: value(formData, "hafen"), preis: value(formData, "preis"), preisHinweis: value(formData, "preisHinweis"), laenge: value(formData, "laenge"), breite: value(formData, "breite"), moeglicheBootsgroesse: value(formData, "moeglicheBootsgroesse"), besonderheiten: value(formData, "besonderheiten"), hervorgehoben: formData.get("hervorgehoben") === "on" };
  if (id) {
    await requireBerth(id);
    try {
      await prisma.liegeplatzAngebot.update({ where: { id }, data });
    } catch (error) {
      if (isUniqueConstraintError(error, ["titelNormalisiert"])) redirect(duplicatePath());
      throw error;
    }
    revalidateBerths(id);
    redirect(editPath(id, "Änderungen gespeichert."));
  }
  let created;
  try {
    created = await prisma.liegeplatzAngebot.create({ data: { id: randomUUID(), ...data } });
  } catch (error) {
    if (isUniqueConstraintError(error, ["titelNormalisiert"])) redirect(duplicatePath());
    throw error;
  }
  revalidateBerths();
  redirect(editPath(created.id, "Entwurf angelegt."));
}

export async function setBerthStatus(formData: FormData) {
  await requireActiveAdmin();
  const id = value(formData, "id");
  const status = value(formData, "status");
  if (!id || !status || !["ENTWURF", "VEROEFFENTLICHT", "VERKAUFT", "ARCHIVIERT"].includes(status)) return;
  const berth = await prisma.liegeplatzAngebot.findUnique({ where: { id }, include: { bilder: true } });
  if (!berth) throw new Error("Liegeplatz wurde nicht gefunden.");
  if (status === "VEROEFFENTLICHT") {
    if (!berth.titel?.trim()) redirect(editPath(id, "Bitte prüfe die markierten Felder.", ["titel"]));
    const imageFields = [...(berth.bilder.length === 0 || berth.bilder.filter((image) => image.istTitelbild).length !== 1 ? ["bild"] : []), ...(berth.bilder.some((image) => !image.altText?.trim()) ? ["altText"] : [])];
    if (imageFields.length) redirect(editPath(id, "Bitte prüfe die markierten Bildangaben.", imageFields));
  }
  await prisma.liegeplatzAngebot.update({ where: { id }, data: { status: status as "ENTWURF" | "VEROEFFENTLICHT" | "VERKAUFT" | "ARCHIVIERT" } });
  revalidateBerths(id);
  redirect(editPath(id, status === "VEROEFFENTLICHT" ? "Erfolgreich veröffentlicht." : status === "ENTWURF" ? "Veröffentlichung aufgehoben." : "Status aktualisiert."));
}

export async function deleteBerth(formData: FormData) {
  await requireActiveAdmin();
  const id = value(formData, "id");
  if (!id) return;
  const berth = await prisma.liegeplatzAngebot.findUnique({ where: { id }, include: { bilder: true, kontaktanfragen: { select: { id: true } } } });
  if (!berth) return;
  if (berth.kontaktanfragen.length > 0) redirect(editPath(id, "Löschen nicht möglich: Es bestehen Kontaktanfragen zu diesem Angebot."));
  await prisma.$transaction([prisma.liegeplatzBild.deleteMany({ where: { liegeplatzAngebotId: id } }), prisma.liegeplatzAngebot.delete({ where: { id } })]);
  await Promise.all(berth.bilder.map(async (image) => { if (image.bildReferenz.startsWith("/uploads/liegeplaetze/")) await unlink(path.join(uploadDirectory, path.basename(image.bildReferenz))).catch(() => undefined); }));
  revalidateBerths();
  redirect(`${berthsPath}?hinweis=Liegeplatz gelöscht.`);
}

export async function uploadBerthImage(formData: FormData) {
  await requireActiveAdmin();
  const liegeplatzAngebotId = value(formData, "liegeplatzAngebotId");
  const file = formData.get("bild");
  if (!liegeplatzAngebotId || !(file instanceof File) || file.size === 0) redirect(editPath(liegeplatzAngebotId ?? "", "Bitte wähle ein Bild aus.", ["bild"]));
  if (!allowedImageTypes.has(file.type) || file.size > maximumImageSize) redirect(editPath(liegeplatzAngebotId, "Erlaubt sind JPG, PNG oder WebP bis 8 MB.", ["bild"]));
  await requireBerth(liegeplatzAngebotId);
  const extension = file.type === "image/png" ? ".png" : file.type === "image/webp" ? ".webp" : ".jpg";
  const fileName = `${randomUUID()}${extension}`;
  await mkdir(uploadDirectory, { recursive: true });
  await writeFile(path.join(uploadDirectory, fileName), Buffer.from(await file.arrayBuffer()));
  const reihenfolge = await prisma.liegeplatzBild.count({ where: { liegeplatzAngebotId } });
  await prisma.liegeplatzBild.create({ data: { id: randomUUID(), liegeplatzAngebotId, bildReferenz: `/uploads/liegeplaetze/${fileName}`, reihenfolge, istTitelbild: reihenfolge === 0, altText: value(formData, "altText") } });
  revalidateBerths(liegeplatzAngebotId);
  redirect(editPath(liegeplatzAngebotId, "Bild hochgeladen."));
}

export async function updateBerthImage(formData: FormData) {
  await requireActiveAdmin();
  const id = value(formData, "bildId"); const berthId = value(formData, "liegeplatzAngebotId");
  if (!id || !berthId) return;
  const image = await prisma.liegeplatzBild.findUnique({ where: { id } });
  if (!image || image.liegeplatzAngebotId !== berthId) return;
  await prisma.liegeplatzBild.update({ where: { id }, data: { altText: value(formData, "altText") } });
  revalidateBerths(berthId); redirect(editPath(berthId, "Alt-Text gespeichert."));
}

export async function setBerthTitleImage(formData: FormData) {
  await requireActiveAdmin();
  const id = value(formData, "bildId"); const berthId = value(formData, "liegeplatzAngebotId");
  if (!id || !berthId) return;
  await prisma.$transaction([prisma.liegeplatzBild.updateMany({ where: { liegeplatzAngebotId: berthId }, data: { istTitelbild: false } }), prisma.liegeplatzBild.update({ where: { id }, data: { istTitelbild: true } })]);
  revalidateBerths(berthId); redirect(editPath(berthId, "Titelbild festgelegt."));
}

export async function moveBerthImage(formData: FormData) {
  await requireActiveAdmin();
  const id = value(formData, "bildId"); const berthId = value(formData, "liegeplatzAngebotId"); const direction = value(formData, "richtung");
  if (!id || !berthId || !direction) return;
  const images = await prisma.liegeplatzBild.findMany({ where: { liegeplatzAngebotId: berthId }, orderBy: { reihenfolge: "asc" } }); const index = images.findIndex((image) => image.id === id); const target = index + (direction === "hoch" ? -1 : 1);
  if (index < 0 || target < 0 || target >= images.length) redirect(editPath(berthId));
  [images[index], images[target]] = [images[target], images[index]];
  await prisma.$transaction(async (transaction) => { await transaction.liegeplatzBild.updateMany({ where: { liegeplatzAngebotId: berthId }, data: { reihenfolge: { increment: 10000 } } }); await Promise.all(images.map((image, position) => transaction.liegeplatzBild.update({ where: { id: image.id }, data: { reihenfolge: position } }))); });
  revalidateBerths(berthId); redirect(editPath(berthId, "Bildreihenfolge aktualisiert."));
}

export async function deleteBerthImage(formData: FormData) {
  await requireActiveAdmin();
  const id = value(formData, "bildId"); const berthId = value(formData, "liegeplatzAngebotId");
  if (!id || !berthId) return;
  const image = await prisma.liegeplatzBild.findUnique({ where: { id } });
  if (!image || image.liegeplatzAngebotId !== berthId) return;
  await prisma.liegeplatzBild.delete({ where: { id } });
  if (image.bildReferenz.startsWith("/uploads/liegeplaetze/")) await unlink(path.join(uploadDirectory, path.basename(image.bildReferenz))).catch(() => undefined);
  const images = await prisma.liegeplatzBild.findMany({ where: { liegeplatzAngebotId: berthId }, orderBy: { reihenfolge: "asc" } });
  await prisma.$transaction(async (transaction) => { await transaction.liegeplatzBild.updateMany({ where: { liegeplatzAngebotId: berthId }, data: { reihenfolge: { increment: 10000 } } }); await Promise.all(images.map((item, position) => transaction.liegeplatzBild.update({ where: { id: item.id }, data: { reihenfolge: position, istTitelbild: position === 0 } }))); });
  revalidateBerths(berthId); redirect(editPath(berthId, "Bild gelöscht."));
}
