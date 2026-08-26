"use server";

import { randomUUID } from "node:crypto";
import { revalidatePath } from "next/cache";
import type { InhaltsbezugArt } from "@/generated/prisma/client";
import { ensureContactInquiryTypes } from "@/lib/contact-inquiry-types";
import { prisma } from "@/lib/prisma";

type ContactField = "firstName" | "lastName" | "email" | "phone" | "message" | "inquiryType" | "serviceCategory" | "service" | "requestPurpose";
export type ContactFormState = { fieldErrors?: Partial<Record<ContactField, string>>; success?: boolean; values?: Record<ContactField, string> };
type ContactReference = { kind: Exclude<InhaltsbezugArt, "KEINER">; id: string; requirePhone?: boolean };
const trim = (data: FormData, key: string) => { const value = data.get(key); return typeof value === "string" ? value.trim() : ""; };

export async function submitContactRequest(reference: ContactReference | null, _previousState: ContactFormState, data: FormData): Promise<ContactFormState> {
  await ensureContactInquiryTypes();
  const values = { firstName: trim(data, "firstName"), lastName: trim(data, "lastName"), email: trim(data, "email"), phone: trim(data, "phone"), message: trim(data, "message"), inquiryType: trim(data, "inquiryType"), serviceCategory: trim(data, "serviceCategory"), service: trim(data, "service"), requestPurpose: trim(data, "requestPurpose") };
  const fieldErrors: NonNullable<ContactFormState["fieldErrors"]> = {};
  if (!values.firstName) fieldErrors.firstName = "Bitte gib deinen Vornamen an.";
  if (!values.lastName) fieldErrors.lastName = "Bitte gib deinen Nachnamen an.";
  if (!values.email && !values.phone) fieldErrors.email = "Bitte gib entweder eine E-Mail-Adresse oder eine Telefonnummer an.";
  if (reference?.requirePhone && !values.phone) fieldErrors.phone = "Bitte gib eine Telefonnummer an.";
  if (values.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(values.email)) fieldErrors.email = "Bitte gib eine gültige E-Mail-Adresse an.";
  if (!values.message) fieldErrors.message = "Bitte schreib uns eine Nachricht.";
  if (!values.inquiryType) fieldErrors.inquiryType = "Bitte wähle einen Anfragetyp aus.";
  if (Object.keys(fieldErrors).length > 0) return { fieldErrors, values };
  const inquiryType = await prisma.anfragetyp.findFirst({ where: { id: values.inquiryType, istAktiv: true }, select: { id: true, inhaltsbezugArt: true } });
  if (!inquiryType) return { fieldErrors: { inquiryType: "Dieser Anfragetyp ist nicht verfügbar." }, values };
  if (reference && inquiryType.inhaltsbezugArt !== reference.kind) return { fieldErrors: { inquiryType: "Der Anfragetyp passt nicht zum gewählten Inhalt." }, values };
  if (reference) {
    const offer = reference.kind === "HAUSBOOT" ? await prisma.hausbootAngebot.findFirst({ where: { id: reference.id, status: "VEROEFFENTLICHT" }, select: { id: true } }) : reference.kind === "LIEGEPLATZ" ? await prisma.liegeplatzAngebot.findFirst({ where: { id: reference.id, status: "VEROEFFENTLICHT" }, select: { id: true } }) : null;
    if ((reference.kind === "HAUSBOOT" || reference.kind === "LIEGEPLATZ") && !offer) return { fieldErrors: { inquiryType: "Dieses Verkaufsobjekt ist nicht mehr verfügbar." }, values };
  }

  const selectedCategory = values.serviceCategory ? await prisma.serviceKategorie.findFirst({ where: { id: values.serviceCategory, istAktiv: true }, select: { id: true, name: true } }) : null;
  if (values.serviceCategory && !selectedCategory) return { fieldErrors: { serviceCategory: "Diese Kategorie ist nicht verfügbar." }, values };
  if (values.service && !selectedCategory) return { fieldErrors: { service: "Bitte wähle zuerst eine Kategorie." }, values };
  const selectedService = values.service && selectedCategory ? await prisma.service.findFirst({ where: { id: values.service, serviceKategorieId: selectedCategory.id, istAktiv: true }, select: { id: true } }) : null;
  if (values.service && !selectedService) return { fieldErrors: { service: "Dieser Service ist nicht verfügbar." }, values };
  if ((selectedCategory || selectedService) && reference) return { fieldErrors: { serviceCategory: "Ein zusätzlicher Servicebezug ist hier nicht möglich." }, values };

  const referenceData = reference?.kind === "HAUSBOOT" ? { hausbootAngebotId: reference.id } : reference?.kind === "LIEGEPLATZ" ? { liegeplatzAngebotId: reference.id } : reference?.kind === "SERVICE" ? { serviceId: reference.id } : reference?.kind === "STELLENANGEBOT" ? { stellenangebotId: reference.id } : selectedService ? { serviceId: selectedService.id } : {};
  await prisma.kontaktanfrage.create({ data: { id: randomUUID(), anfragetypId: inquiryType.id, name: `${values.firstName} ${values.lastName}`, email: values.email, telefon: values.phone || null, nachricht: values.requestPurpose ? `Wunsch: ${values.requestPurpose}\n\n${values.message}` : values.message, serviceKategorieName: selectedCategory?.name ?? null, ...referenceData } });
  revalidatePath("/admin/kontaktanfragen");
  return { success: true };
}
