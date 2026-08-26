"use client";

import { useState } from "react";
import { ContactForm } from "@/components/contact-form";
import { Button } from "@/components/ui/button";

type InquiryType = { id: string; name: string };
type Props = { objectId: string; objectKind: "HAUSBOOT" | "LIEGEPLATZ"; inquiryTypes: InquiryType[] };

export function SaleDetailActions({ objectId, objectKind, inquiryTypes }: Props) {
  const [open, setOpen] = useState<"question" | "expose" | null>(null);
  const type = (suffix: "frage" | "expose") => inquiryTypes.find((item) => item.id === `verkauf-${objectKind === "HAUSBOOT" ? "hausboot" : "liegeplatz"}-${suffix}`)?.id;
  const reference = { kind: objectKind, id: objectId } as const;
  const noun = objectKind === "HAUSBOOT" ? "Hausboot" : "Liegeplatz";
  return <section className="mt-[clamp(3.5rem,7vw,6rem)] border-t border-mist-line pt-[clamp(2.5rem,5vw,4rem)]" aria-labelledby="sale-inquiry-title"><p className="text-sm font-semibold uppercase tracking-[.16em] text-brand">Persönlich beraten</p><h2 className="mt-3 text-[clamp(2rem,4vw,3.5rem)] font-semibold leading-[.98] tracking-tight" id="sale-inquiry-title">Interesse an diesem Objekt?</h2><p className="mt-4 max-w-2xl leading-relaxed text-ink/70">Möchtest du mehr über diesen {noun.toLowerCase()} erfahren? Wir helfen dir gern persönlich weiter.</p><div className="mt-7 grid items-start gap-5 lg:grid-cols-2">
    <section className="rounded-2xl border border-mist-line bg-ice p-5 sm:p-7"><h3 className="text-2xl font-semibold">Frage zum Objekt</h3><p className="mt-3 leading-relaxed text-ink/70">Stelle uns deine Fragen zu Ausstattung, Lage oder Ablauf.</p>{open === "question" && type("frage") ? <div className="mt-5"><button className="text-sm font-semibold text-brand underline underline-offset-4" onClick={() => setOpen(null)} type="button">Formular schließen</button><div className="mt-4"><ContactForm defaultInquiryTypeId={type("frage")} inquiryTypes={inquiryTypes} lockInquiryType ownerTone reference={reference} /></div></div> : <Button className="mt-5" onClick={() => setOpen("question")} tone="owner">Frage zum Objekt</Button>}</section>
    <section className="rounded-2xl border border-mist-line bg-mist p-5 sm:p-7"><h3 className="text-2xl font-semibold">Exposé oder Besichtigung</h3><p className="mt-3 leading-relaxed text-ink/70">Fordere Unterlagen an oder vereinbare einen Termin vor Ort.</p>{open === "expose" && type("expose") ? <div className="mt-5"><button className="text-sm font-semibold text-brand underline underline-offset-4" onClick={() => setOpen(null)} type="button">Formular schließen</button><div className="mt-4"><ContactForm defaultInquiryTypeId={type("expose")} inquiryTypes={inquiryTypes} lockInquiryType ownerTone reference={reference} requestOptions={["Exposé anfragen", "Besichtigung vereinbaren", "Exposé + Besichtigung"]} requirePhone /></div></div> : <Button className="mt-5" onClick={() => setOpen("expose")} tone="owner">Exposé anfragen / Besichtigung vereinbaren</Button>}</section>
  </div></section>;
}
