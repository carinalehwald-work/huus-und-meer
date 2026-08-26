"use client";

import { useActionState, useState } from "react";
import { submitApplication, type ApplicationFormState } from "@/app/stellenangebote/actions";

const initialState: ApplicationFormState = {};
const inputClass = "mt-1.5 min-h-12 w-full border border-sand-line bg-linen px-3 outline-none focus:border-red";

export function ApplicationForm({ jobId }: { jobId: string }) {
  const action = submitApplication.bind(null, jobId);
  const [state, formAction, pending] = useActionState(action, initialState);
  const [resumeName, setResumeName] = useState<string | null>(null);
  const [otherDocumentNames, setOtherDocumentNames] = useState<string[]>([]);

  if (state.success) return <div className="rounded-xl bg-sky/25 p-5" role="status"><h3 className="text-xl font-semibold">Vielen Dank für deine Bewerbung.</h3><p className="mt-2 text-ink/70">Wir haben deine Unterlagen erhalten und melden uns persönlich bei dir.</p></div>;

  return <form action={formAction} className="rounded-2xl border border-sand-line bg-linen p-5 shadow-sm" noValidate><div className="grid gap-4 sm:grid-cols-2"><Field error={state.fieldErrors?.firstName} label="Vorname"><input className={inputClass} defaultValue={state.values?.firstName} name="firstName" required /></Field><Field error={state.fieldErrors?.lastName} label="Nachname"><input className={inputClass} defaultValue={state.values?.lastName} name="lastName" required /></Field><Field error={state.fieldErrors?.email} label="E-Mail"><input className={inputClass} defaultValue={state.values?.email} name="email" required type="email" /></Field><Field label="Telefon (optional)"><input className={inputClass} defaultValue={state.values?.phone} name="phone" type="tel" /></Field></div><Field className="mt-4" error={state.fieldErrors?.message} label="Bewerbungstext"><textarea className={`${inputClass} min-h-36 py-3`} defaultValue={state.values?.message} name="message" required rows={6} /></Field><Field className="mt-4" error={state.fieldErrors?.resume} label="Lebenslauf *"><input accept="application/pdf" aria-describedby="resume-note" className={`${inputClass} py-2`} name="lebenslauf" onChange={(event) => setResumeName(event.currentTarget.files?.[0]?.name ?? null)} required type="file" /><span className="mt-1.5 block text-xs font-normal text-ink/60" id="resume-note">PDF, maximal 8 MB</span>{resumeName ? <span className="mt-2 block text-sm font-normal text-ink/75">Ausgewählt: {resumeName}</span> : null}</Field><Field className="mt-4" error={state.fieldErrors?.otherDocuments} label="Sonstige Unterlagen"><input accept="application/pdf,image/jpeg,image/png" aria-describedby="other-documents-note" className={`${inputClass} py-2`} multiple name="sonstigeUnterlagen" onChange={(event) => setOtherDocumentNames(Array.from(event.currentTarget.files ?? [], (file) => file.name))} type="file" /><span className="mt-1.5 block text-xs font-normal text-ink/60" id="other-documents-note">Optional · PDF, JPG oder PNG · maximal 8 MB je Datei · höchstens 5 Dateien</span>{otherDocumentNames.length ? <ul className="mt-2 list-inside list-disc text-sm font-normal text-ink/75">{otherDocumentNames.map((name) => <li key={name}>{name}</li>)}</ul> : null}</Field>{state.error ? <p className="mt-4 text-sm text-red" role="alert">{state.error}</p> : null}<button className="mt-5 min-h-12 rounded-[0.2rem] border border-red bg-red px-5 py-3 text-sm font-bold text-linen transition hover:bg-sand hover:text-ink disabled:opacity-70" disabled={pending}>{pending ? "Wird gesendet …" : "Bewerbung absenden"}</button></form>;
}

function Field({ children, className, error, label }: { children: React.ReactNode; className?: string; error?: string; label: string }) { return <label className={`${className ?? ""} block text-sm font-semibold`}>{label}{children}{error ? <span className="mt-1.5 block font-normal text-red" role="alert">{error}</span> : null}</label>; }
