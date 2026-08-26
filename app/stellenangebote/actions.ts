"use server";

import { randomUUID } from "node:crypto";
import { mkdir, rm, writeFile } from "node:fs/promises";
import path from "node:path";
import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";

export type ApplicationFormState = { error?: string; fieldErrors?: Partial<Record<"firstName" | "lastName" | "email" | "message" | "resume" | "otherDocuments", string>>; success?: boolean; values?: Record<"firstName" | "lastName" | "email" | "phone" | "message", string> };
type DocumentKind = "LEBENSLAUF" | "SONSTIGE_UNTERLAGE";
type PreparedDocument = { id: string; name: string; mimeType: "application/pdf" | "image/jpeg" | "image/png"; size: number; content: Buffer; typ: DocumentKind };

const maxFileSize = 8 * 1024 * 1024;
const maxOtherDocuments = 5;
const storageRoot = path.join(process.cwd(), "storage", "bewerbungsunterlagen");
const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const value = (data: FormData, key: string) => { const item = data.get(key); return typeof item === "string" ? item.trim() : ""; };
const files = (data: FormData, key: string) => data.getAll(key).filter((item): item is File => typeof item !== "string" && item.size > 0);

function detectedMimeType(content: Buffer): PreparedDocument["mimeType"] | null {
  if (content.subarray(0, 5).toString("ascii") === "%PDF-") return "application/pdf";
  if (content.length > 3 && content[0] === 0xff && content[1] === 0xd8 && content[2] === 0xff) return "image/jpeg";
  if (content.length > 8 && content.subarray(0, 8).equals(Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]))) return "image/png";
  return null;
}

async function prepareDocument(file: File, typ: DocumentKind): Promise<PreparedDocument | null> {
  const content = Buffer.from(await file.arrayBuffer());
  const mimeType = detectedMimeType(content);
  if (!mimeType || (typ === "LEBENSLAUF" && mimeType !== "application/pdf")) return null;
  return { id: randomUUID(), name: path.basename(file.name).replace(/[^a-zA-Z0-9._ -]/g, "_").slice(0, 160) || "unterlage", mimeType, size: file.size, content, typ };
}

export async function submitApplication(jobId: string, _previousState: ApplicationFormState, formData: FormData): Promise<ApplicationFormState> {
  const values = { firstName: value(formData, "firstName"), lastName: value(formData, "lastName"), email: value(formData, "email"), phone: value(formData, "phone"), message: value(formData, "message") };
  const fieldErrors: NonNullable<ApplicationFormState["fieldErrors"]> = {};
  if (!values.firstName) fieldErrors.firstName = "Bitte gib deinen Vornamen an.";
  if (!values.lastName) fieldErrors.lastName = "Bitte gib deinen Nachnamen an.";
  if (!values.email || !emailPattern.test(values.email)) fieldErrors.email = "Bitte gib eine gültige E-Mail-Adresse an.";
  if (!values.message) fieldErrors.message = "Bitte schreib etwas zu deiner Bewerbung.";
  const resume = files(formData, "lebenslauf");
  const otherDocuments = files(formData, "sonstigeUnterlagen");
  if (resume.length !== 1) fieldErrors.resume = "Bitte lade genau einen Lebenslauf als PDF hoch.";
  if (otherDocuments.length > maxOtherDocuments) fieldErrors.otherDocuments = `Bitte lade höchstens ${maxOtherDocuments} sonstige Unterlagen hoch.`;
  if (resume.some((file) => file.size > maxFileSize)) fieldErrors.resume = "Der Lebenslauf darf höchstens 8 MB groß sein.";
  if (otherDocuments.some((file) => file.size > maxFileSize)) fieldErrors.otherDocuments = "Jede sonstige Unterlage darf höchstens 8 MB groß sein.";
  if (Object.keys(fieldErrors).length > 0) return { fieldErrors, values };
  const job = await prisma.stellenangebot.findFirst({ where: { id: jobId, status: "VEROEFFENTLICHT" }, select: { id: true } });
  if (!job) return { error: "Dieses Stellenangebot ist nicht mehr verfügbar.", values };
  const preparedResume = await prepareDocument(resume[0], "LEBENSLAUF");
  if (!preparedResume) return { fieldErrors: { resume: "Der Lebenslauf muss eine gültige PDF-Datei sein." }, values };
  const preparedOtherDocuments = await Promise.all(otherDocuments.map((file) => prepareDocument(file, "SONSTIGE_UNTERLAGE")));
  if (preparedOtherDocuments.some((document) => document === null)) return { fieldErrors: { otherDocuments: "Sonstige Unterlagen dürfen nur gültige PDF-, JPG- oder PNG-Dateien sein." }, values };
  const documents = [preparedResume, ...preparedOtherDocuments.filter((document): document is PreparedDocument => document !== null)];
  const applicationId = randomUUID();
  const directory = path.join(storageRoot, applicationId);
  try {
    await mkdir(directory, { recursive: true });
    await Promise.all(documents.map((document) => writeFile(path.join(directory, document.id), document.content, { flag: "wx" })));
    await prisma.bewerbung.create({ data: { id: applicationId, stellenangebotId: job.id, vorname: values.firstName, nachname: values.lastName, email: values.email, telefon: values.phone || null, bewerbungstext: values.message, unterlagen: { create: documents.map((document) => ({ id: document.id, typ: document.typ, dateiname: document.name, mimeType: document.mimeType, dateigroesse: document.size, dateireferenz: path.relative(process.cwd(), path.join(directory, document.id)) })) } } });
  } catch {
    await rm(directory, { recursive: true, force: true });
    return { error: "Deine Bewerbung konnte nicht gespeichert werden. Bitte versuche es erneut.", values };
  }
  revalidatePath(`/admin/stellenangebote/${job.id}/bewerbungen`);
  return { success: true };
}
