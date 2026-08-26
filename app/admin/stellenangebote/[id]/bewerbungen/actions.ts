"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { requireActiveAdmin } from "@/lib/admin-auth";
import { prisma } from "@/lib/prisma";

const statuses = ["NEU", "IN_BEARBEITUNG", "ERLEDIGT"] as const;
export async function setApplicationStatus(jobId: string, applicationId: string, formData: FormData) {
  await requireActiveAdmin();
  const status = formData.get("status");
  if (!statuses.includes(status as typeof statuses[number])) return;
  const application = await prisma.bewerbung.findFirst({ where: { id: applicationId, stellenangebotId: jobId }, select: { id: true } });
  if (!application) return;
  await prisma.bewerbung.update({ where: { id: application.id }, data: { status: status as typeof statuses[number] } });
  revalidatePath(`/admin/stellenangebote/${jobId}/bewerbungen`);
  redirect(`/admin/stellenangebote/${jobId}/bewerbungen?bewerbung=${applicationId}&hinweis=${encodeURIComponent("Status aktualisiert.")}`);
}
