"use server";

import { randomUUID } from "node:crypto";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import { requireActiveAdmin } from "@/lib/admin-auth";
import { cleanAdminName, duplicateNameToastMessage, hasDuplicateAdminName, normalizeAdminName } from "@/lib/admin-name-validation";
import { prisma } from "@/lib/prisma";
import { isUniqueConstraintError } from "@/lib/prisma-unique-error";

const servicesPath = "/admin/services";

function value(formData: FormData, name: string) { const item = formData.get(name); return typeof item === "string" && item.trim() ? item.trim() : null; }
function details(formData: FormData) { return (value(formData, "details") ?? "").split("\n").map((item) => item.trim()).filter(Boolean); }
function pathWithNote(note?: string, fields: string[] = []) { return `${servicesPath}${note ? `?hinweis=${encodeURIComponent(note)}` : ""}${fields.length ? `${note ? "&" : "?"}typ=fehler&felder=${encodeURIComponent(fields.join(","))}` : ""}`; }
function refresh(note?: string, fields: string[] = []): never { revalidatePath(servicesPath); revalidatePath("/services"); redirect(pathWithNote(note, fields)); }
function refreshEditor(path: string, note: string, fields: string[]): never { revalidatePath(servicesPath); revalidatePath("/services"); const separator = path.includes("?") ? "&" : "?"; redirect(`${path}${separator}hinweis=${encodeURIComponent(note)}&typ=fehler&felder=${encodeURIComponent(fields.join(","))}`); }

export async function saveServiceCategory(formData: FormData) {
  await requireActiveAdmin();
  const id = value(formData, "id"); const name = value(formData, "name");
  const editorPath = `${servicesPath}?kategorie=${encodeURIComponent(id ?? "neu")}`;
  if (!name) refreshEditor(editorPath, "Bitte prüfe die markierten Felder.", ["name"]);
  const cleanName = cleanAdminName(name);
  const rejectDuplicate = () => refreshEditor(editorPath, duplicateNameToastMessage, ["name"]);
  if (await hasDuplicateAdminName(cleanName, (normalizedName) => prisma.serviceKategorie.findFirst({ where: { nameNormalisiert: normalizedName, ...(id ? { id: { not: id } } : {}) }, select: { id: true } }))) rejectDuplicate();
  const data = { name: cleanName, nameNormalisiert: normalizeAdminName(cleanName), beschreibung: value(formData, "beschreibung"), istAktiv: formData.get("istAktiv") === "on" };
  try {
    if (id) await prisma.serviceKategorie.update({ where: { id }, data });
    else { const reihenfolge = await prisma.serviceKategorie.count(); await prisma.serviceKategorie.create({ data: { id: randomUUID(), reihenfolge, ...data } }); }
  } catch (error) {
    if (isUniqueConstraintError(error, ["nameNormalisiert"])) rejectDuplicate();
    throw error;
  }
  refresh("Kategorie gespeichert.");
}

export async function moveServiceCategory(formData: FormData) {
  await requireActiveAdmin(); const id = value(formData, "id"); const direction = value(formData, "richtung"); if (!id || !direction) return;
  const items = await prisma.serviceKategorie.findMany({ orderBy: { reihenfolge: "asc" } }); const index = items.findIndex((item) => item.id === id); const target = index + (direction === "hoch" ? -1 : 1);
  if (index >= 0 && target >= 0 && target < items.length) { [items[index], items[target]] = [items[target], items[index]]; await prisma.$transaction(items.map((item, reihenfolge) => prisma.serviceKategorie.update({ where: { id: item.id }, data: { reihenfolge } }))); }
  refresh("Reihenfolge aktualisiert.");
}

export async function toggleServiceCategory(formData: FormData) {
  await requireActiveAdmin(); const id = value(formData, "id"); if (!id) return; const category = await prisma.serviceKategorie.findUnique({ where: { id } }); if (!category) return;
  await prisma.serviceKategorie.update({ where: { id }, data: { istAktiv: !category.istAktiv } }); refresh("Kategorie-Status aktualisiert.");
}

export async function deleteServiceCategory(formData: FormData) {
  await requireActiveAdmin(); const id = value(formData, "id"); if (!id) return; const services = await prisma.service.count({ where: { serviceKategorieId: id } });
  if (services > 0) refresh("Kategorie kann nur ohne enthaltene Services gelöscht werden.");
  await prisma.serviceKategorie.delete({ where: { id } }); refresh("Kategorie gelöscht.");
}

export async function saveService(formData: FormData) {
  await requireActiveAdmin(); const id = value(formData, "id"); const serviceKategorieId = value(formData, "serviceKategorieId"); const titel = value(formData, "titel"); const beschreibung = value(formData, "beschreibung");
  if (!serviceKategorieId || !titel || !beschreibung) {
    const missing = [...(!serviceKategorieId ? ["serviceKategorieId"] : []), ...(!titel ? ["titel"] : []), ...(!beschreibung ? ["beschreibung"] : [])];
    refreshEditor(`${servicesPath}?service=${encodeURIComponent(id ?? "neu")}${serviceKategorieId ? `&kategorie=${encodeURIComponent(serviceKategorieId)}` : ""}`, "Bitte prüfe die markierten Felder.", missing);
  }
  const editorPath = `${servicesPath}?service=${encodeURIComponent(id ?? "neu")}&kategorie=${encodeURIComponent(serviceKategorieId)}`;
  const cleanTitle = cleanAdminName(titel);
  const rejectDuplicate = () => refreshEditor(editorPath, duplicateNameToastMessage, ["titel"]);
  if (await hasDuplicateAdminName(cleanTitle, (normalizedName) => prisma.service.findFirst({ where: { serviceKategorieId, titelNormalisiert: normalizedName, ...(id ? { id: { not: id } } : {}) }, select: { id: true } }))) rejectDuplicate();
  const data = { serviceKategorieId, titel: cleanTitle, titelNormalisiert: normalizeAdminName(cleanTitle), beschreibung, details: details(formData), istAktiv: formData.get("istAktiv") === "on" };
  try {
    if (id) await prisma.service.update({ where: { id }, data });
    else { const reihenfolge = await prisma.service.count({ where: { serviceKategorieId } }); await prisma.service.create({ data: { id: randomUUID(), reihenfolge, ...data } }); }
  } catch (error) {
    if (isUniqueConstraintError(error, ["serviceKategorieId", "titelNormalisiert"])) rejectDuplicate();
    throw error;
  }
  refresh("Service gespeichert.");
}

export async function moveService(formData: FormData) {
  await requireActiveAdmin(); const id = value(formData, "id"); const categoryId = value(formData, "serviceKategorieId"); const direction = value(formData, "richtung"); if (!id || !categoryId || !direction) return;
  const items = await prisma.service.findMany({ where: { serviceKategorieId: categoryId }, orderBy: { reihenfolge: "asc" } }); const index = items.findIndex((item) => item.id === id); const target = index + (direction === "hoch" ? -1 : 1);
  if (index >= 0 && target >= 0 && target < items.length) { [items[index], items[target]] = [items[target], items[index]]; await prisma.$transaction(items.map((item, reihenfolge) => prisma.service.update({ where: { id: item.id }, data: { reihenfolge } }))); }
  refresh("Reihenfolge aktualisiert.");
}

export async function toggleService(formData: FormData) {
  await requireActiveAdmin(); const id = value(formData, "id"); if (!id) return; const service = await prisma.service.findUnique({ where: { id } }); if (!service) return;
  await prisma.service.update({ where: { id }, data: { istAktiv: !service.istAktiv } }); refresh("Service-Status aktualisiert.");
}

export async function deleteService(formData: FormData) {
  await requireActiveAdmin(); const id = value(formData, "id"); if (!id) return; const service = await prisma.service.findUnique({ where: { id }, include: { kontaktanfragen: { select: { id: true } } } }); if (!service) return;
  if (service.kontaktanfragen.length > 0) refresh("Service kann wegen bestehender Kontaktanfragen nicht gelöscht werden. Bitte deaktivieren.");
  await prisma.service.delete({ where: { id } }); refresh("Service gelöscht.");
}
