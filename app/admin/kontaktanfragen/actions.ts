"use server";
import { randomUUID } from "node:crypto";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { requireActiveAdmin } from "@/lib/admin-auth";
import { prisma } from "@/lib/prisma";

const path="/admin/kontaktanfragen";
function value(data:FormData,key:string){const item=data.get(key);return typeof item==="string"&&item.trim()?item.trim():null}
function back(id:string,note?:string,fields:string[]=[]):never{revalidatePath(path);redirect(`${path}?anfrage=${id}${note?`&hinweis=${encodeURIComponent(note)}`:""}${fields.length?`&typ=fehler&felder=${encodeURIComponent(fields.join(","))}`:""}`)}
export async function setContactRequestStatus(data:FormData){await requireActiveAdmin();const id=value(data,"id"),status=value(data,"status");if(!id||!status||!["NEU","IN_BEARBEITUNG","ERLEDIGT"].includes(status))return;await prisma.kontaktanfrage.update({where:{id},data:{status:status as "NEU"|"IN_BEARBEITUNG"|"ERLEDIGT"}});back(id,"Status aktualisiert.")}
export async function saveInternalNote(data:FormData){await requireActiveAdmin();const id=value(data,"id"),anfrageId=value(data,"anfrageId"),inhalt=value(data,"inhalt");if(!anfrageId)return;if(!inhalt)back(anfrageId,"Bitte prüfe die markierten Felder.",["inhalt"]);if(id)await prisma.kontaktanfrageNotiz.update({where:{id},data:{inhalt}});else await prisma.kontaktanfrageNotiz.create({data:{id:randomUUID(),kontaktanfrageId:anfrageId,inhalt}});back(anfrageId,"Interne Notiz gespeichert.")}
