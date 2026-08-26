"use client";

import { useState } from "react";
import { ApplicationForm } from "@/components/application-form";
import { ContactForm } from "@/components/contact-form";
import { Button } from "@/components/ui/button";

type InquiryType = { id: string; name: string };
export function JobDetailActions({ jobId, inquiryTypeId, inquiryTypes }: { jobId: string; inquiryTypeId: string; inquiryTypes: InquiryType[] }) {
  const [questionsOpen, setQuestionsOpen] = useState(false);
  const [applicationOpen, setApplicationOpen] = useState(false);
  return <div className="mt-10 grid items-start gap-5 lg:grid-cols-2">
    <section className="self-start rounded-2xl border border-sand-line bg-linen p-5 sm:p-7"><div className="flex items-start justify-between gap-4"><div><h2 className="text-2xl font-semibold">Fragen zu dieser Stelle?</h2><p className="mt-3 leading-relaxed text-ink/70">Wir beantworten dir gern alle Fragen rund um die ausgeschriebene Stelle.</p></div>{questionsOpen ? <button aria-label="Kontaktformular schließen" aria-expanded="true" className="shrink-0 text-sm font-semibold text-brand underline underline-offset-4" onClick={() => setQuestionsOpen(false)} type="button">Schließen</button> : null}</div>{questionsOpen ? <div className="mt-5"><ContactForm defaultInquiryTypeId={inquiryTypeId} inquiryTypes={inquiryTypes} lockInquiryType reference={{ kind: "STELLENANGEBOT", id: jobId }} /></div> : <Button aria-expanded="false" className="mt-5" onClick={() => setQuestionsOpen(true)} tone="owner">Frage stellen</Button>}</section>
    <section className="self-start rounded-2xl border border-mist-line bg-ice p-5 sm:p-7"><div className="flex items-start justify-between gap-4"><div><h2 className="text-2xl font-semibold">Haben wir dein Interesse geweckt?</h2><p className="mt-3 leading-relaxed text-ink/70">Dann freuen wir uns auf deine Bewerbung.</p></div>{applicationOpen ? <button aria-label="Bewerbungsformular schließen" aria-expanded="true" className="shrink-0 text-sm font-semibold text-red underline underline-offset-4" onClick={() => setApplicationOpen(false)} type="button">Schließen</button> : null}</div>{applicationOpen ? <div className="mt-5"><ApplicationForm jobId={jobId} /></div> : <Button aria-expanded="false" className="mt-5" onClick={() => setApplicationOpen(true)} tone="guest">Jetzt bewerben</Button>}</section>
  </div>;
}
