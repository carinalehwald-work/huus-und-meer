import { readFile } from "node:fs/promises";
import path from "node:path";
import { NextResponse } from "next/server";
import { requireActiveAdmin } from "@/lib/admin-auth";
import { prisma } from "@/lib/prisma";

const storageRoot = path.resolve(process.cwd(), "storage", "bewerbungsunterlagen");
export async function GET(_request: Request, { params }: { params: Promise<{ id: string; unterlageId: string }> }) { await requireActiveAdmin(); const { id, unterlageId } = await params; const document = await prisma.bewerbungsUnterlage.findFirst({ where: { id: unterlageId, bewerbung: { stellenangebotId: id } }, select: { bewerbungId: true, dateiname: true, mimeType: true } }); if (!document) return new NextResponse("Nicht gefunden", { status: 404 }); const filePath = path.join(storageRoot, document.bewerbungId, unterlageId); try { const file = await readFile(filePath); return new NextResponse(file, { headers: { "Content-Type": document.mimeType, "Content-Disposition": `attachment; filename*=UTF-8''${encodeURIComponent(document.dateiname)}`, "X-Content-Type-Options": "nosniff", "Cache-Control": "private, no-store" } }); } catch { return new NextResponse("Datei nicht gefunden", { status: 404 }); } }
