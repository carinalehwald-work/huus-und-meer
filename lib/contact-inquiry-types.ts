import type { InhaltsbezugArt } from "@/generated/prisma/client";
import { prisma } from "@/lib/prisma";

const defaultInquiryTypes: ReadonlyArray<{ id: string; name: string; inhaltsbezugArt: InhaltsbezugArt; reihenfolge: number }> = [
  { id: "standard-allgemeine-anfrage", name: "Allgemeine Anfrage", inhaltsbezugArt: "KEINER", reihenfolge: 10 },
  { id: "standard-hausboot", name: "Hausboot", inhaltsbezugArt: "HAUSBOOT", reihenfolge: 20 },
  { id: "verkauf-hausboot-frage", name: "Frage zum Hausboot", inhaltsbezugArt: "HAUSBOOT", reihenfolge: 21 },
  { id: "verkauf-hausboot-expose", name: "Hausboot: Exposé oder Besichtigung", inhaltsbezugArt: "HAUSBOOT", reihenfolge: 22 },
  { id: "standard-liegeplatz", name: "Liegeplatz", inhaltsbezugArt: "LIEGEPLATZ", reihenfolge: 30 },
  { id: "verkauf-liegeplatz-frage", name: "Frage zum Liegeplatz", inhaltsbezugArt: "LIEGEPLATZ", reihenfolge: 31 },
  { id: "verkauf-liegeplatz-expose", name: "Liegeplatz: Exposé oder Besichtigung", inhaltsbezugArt: "LIEGEPLATZ", reihenfolge: 32 },
  { id: "standard-service", name: "Service", inhaltsbezugArt: "SERVICE", reihenfolge: 40 },
  { id: "standard-stellenangebot", name: "Stellenangebot", inhaltsbezugArt: "STELLENANGEBOT", reihenfolge: 50 },
];

export async function ensureContactInquiryTypes() {
  const existing = await prisma.anfragetyp.findMany({ where: { name: { in: defaultInquiryTypes.map((item) => item.name) } }, select: { name: true } });
  const existingNames = new Set(existing.map((item) => item.name));
  const missing = defaultInquiryTypes.filter((item) => !existingNames.has(item.name));
  if (missing.length > 0) await prisma.anfragetyp.createMany({ data: missing });
}
