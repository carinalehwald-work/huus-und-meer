"use client";

import { useActionState, useMemo, useState } from "react";

import { submitContactRequest, type ContactFormState } from "@/app/kontakt/actions";
import { Icon } from "@/components/ui/icon";

type InquiryType = { id: string; name: string };
type ContactReference = { kind: "HAUSBOOT" | "LIEGEPLATZ" | "SERVICE" | "STELLENANGEBOT"; id: string; requirePhone?: boolean };
type ServiceCategory = { id: string; name: string; services: { id: string; titel: string }[] };
type FrameTone = "guest" | "owner" | "mixed";
type Props = {
  inquiryTypes: InquiryType[];
  defaultInquiryTypeId?: string;
  reference?: ContactReference;
  lockInquiryType?: boolean;
  serviceCategories?: ServiceCategory[];
  requirePhone?: boolean;
  requestOptions?: string[];
  ownerTone?: boolean;
  frameTone?: FrameTone;
};

const initialState: ContactFormState = {};
const inputClass = "mt-1.5 min-h-12 w-full border border-sand-line bg-linen px-3 outline-none focus:border-red";

function FloatingFrame({ children, tone }: { children: React.ReactNode; tone: FrameTone }) {
  const topLeftTone = tone === "owner" ? "bg-brand" : "bg-red";
  const bottomRightTone = tone === "guest" ? "bg-red" : "bg-brand";

  return (
    <div className="relative p-[clamp(.65rem,1.2vw,1rem)]">
      <span aria-hidden="true" className={`pointer-events-none absolute left-0 top-0 h-[3px] w-[min(42%,12rem)] ${topLeftTone}`} />
      <span aria-hidden="true" className={`pointer-events-none absolute left-0 top-0 h-[min(42%,12rem)] w-[3px] ${topLeftTone}`} />
      <span aria-hidden="true" className={`pointer-events-none absolute bottom-0 right-0 h-[3px] w-[min(42%,12rem)] ${bottomRightTone}`} />
      <span aria-hidden="true" className={`pointer-events-none absolute bottom-0 right-0 h-[min(42%,12rem)] w-[3px] ${bottomRightTone}`} />
      {children}
    </div>
  );
}

export function ContactForm({ inquiryTypes, defaultInquiryTypeId, reference, lockInquiryType = false, serviceCategories, requirePhone = false, requestOptions, ownerTone = false, frameTone }: Props) {
  const action = submitContactRequest.bind(null, reference ?? null);
  const [state, formAction, pending] = useActionState(action, initialState);
  const values = state.values;
  const [selectedCategory, setSelectedCategory] = useState(values?.serviceCategory ?? "");
  const availableServices = useMemo(() => serviceCategories?.find((category) => category.id === selectedCategory)?.services ?? [], [selectedCategory, serviceCategories]);
  const resolvedFrameTone = frameTone ?? (ownerTone ? "owner" : "guest");
  const ownerClass = ownerTone ? "border-mist-line bg-ice [&_input]:border-mist-line [&_input]:bg-ice [&_input]:focus:border-brand [&_select]:border-mist-line [&_select]:bg-ice [&_select]:focus:border-brand [&_textarea]:border-mist-line [&_textarea]:bg-ice [&_textarea]:focus:border-brand" : "border-sand-line bg-linen";
  const buttonClass = ownerTone ? "border-brand bg-brand text-ice outline-brand/55 hover:bg-ice hover:text-ink" : "border-red bg-red text-linen outline-red/55 hover:bg-sand hover:text-ink";

  if (state.success) {
    return <FloatingFrame tone={resolvedFrameTone}><div className="rounded-2xl border border-sand-line bg-linen p-6" role="status"><h2 className="text-2xl font-semibold">Vielen Dank für Ihre Anfrage.</h2><p className="mt-3 leading-relaxed text-ink/70">Wir haben Ihre Nachricht erhalten und melden uns so bald wie möglich bei Ihnen.</p></div></FloatingFrame>;
  }

  return (
    <FloatingFrame tone={resolvedFrameTone}>
      <form action={formAction} className={`rounded-2xl border p-5 shadow-sm md:p-7 ${ownerClass}`} noValidate>
        <div className="grid gap-4 sm:grid-cols-2">
          <Field error={state.fieldErrors?.firstName} label="Vorname"><input className={inputClass} defaultValue={values?.firstName} name="firstName" required /></Field>
          <Field error={state.fieldErrors?.lastName} label="Nachname"><input className={inputClass} defaultValue={values?.lastName} name="lastName" required /></Field>
          <Field error={state.fieldErrors?.email} label="E-Mail"><input aria-describedby={state.fieldErrors?.email ? "contact-details-error" : undefined} className={inputClass} defaultValue={values?.email} name="email" type="email" /></Field>
          <Field error={state.fieldErrors?.phone} label={requirePhone ? "Telefon" : "Telefon (optional)"}><input className={inputClass} defaultValue={values?.phone} name="phone" required={requirePhone} type="tel" /></Field>
          {state.fieldErrors?.email ? <p className="text-sm text-red sm:col-span-2" id="contact-details-error" role="alert">{state.fieldErrors.email}</p> : null}
          {lockInquiryType ? <input name="inquiryType" type="hidden" value={defaultInquiryTypeId} /> : <Field error={state.fieldErrors?.inquiryType} label="Anfragetyp"><select className={inputClass} defaultValue={values?.inquiryType ?? defaultInquiryTypeId ?? ""} name="inquiryType" required><option disabled value="">Bitte auswählen</option>{inquiryTypes.map((type) => <option key={type.id} value={type.id}>{type.name}</option>)}</select></Field>}
          {requestOptions ? <Field error={state.fieldErrors?.requestPurpose} label="Wunsch"><select className={inputClass} defaultValue={values?.requestPurpose ?? ""} name="requestPurpose" required><option disabled value="">Bitte auswählen</option>{requestOptions.map((option) => <option key={option} value={option}>{option}</option>)}</select></Field> : null}
          {serviceCategories ? <><Field error={state.fieldErrors?.serviceCategory} label="Kategorie (optional)"><select className={inputClass} name="serviceCategory" onChange={(event) => setSelectedCategory(event.target.value)} value={selectedCategory}><option value="">Allgemeine Anfrage</option>{serviceCategories.map((category) => <option key={category.id} value={category.id}>{category.name}</option>)}</select></Field><Field error={state.fieldErrors?.service} label="Service (optional)"><select className={inputClass} defaultValue={values?.service ?? ""} disabled={!selectedCategory} key={selectedCategory} name="service"><option value="">Keinen Service auswählen</option>{availableServices.map((service) => <option key={service.id} value={service.id}>{service.titel}</option>)}</select></Field></> : null}
        </div>
        <div className="mt-7">
          <Field error={state.fieldErrors?.message} label="Nachricht"><textarea className={`${inputClass} min-h-36 py-3`} defaultValue={values?.message} name="message" required rows={6} /></Field>
        </div>
        <div className="mt-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between"><p className="max-w-lg text-xs leading-relaxed text-ink/60">Mit dem Absenden stimmst du der Verarbeitung deiner Angaben zur Beantwortung deiner Anfrage zu.</p><button className={`group inline-flex min-h-12 shrink-0 items-center justify-center rounded-[0.2rem] border px-5 py-3 text-sm font-bold outline outline-1 outline-offset-[3px] transition focus-visible:outline-ink disabled:cursor-wait disabled:opacity-70 ${buttonClass}`} disabled={pending}>{pending ? "Wird gesendet …" : "Anfrage senden"}<Icon name="arrow" className="ml-2 h-4 w-4" /></button></div>
      </form>
    </FloatingFrame>
  );
}

function Field({ children, error, label }: { children: React.ReactNode; error?: string; label: string }) {
  return <label className="block text-sm font-semibold">{label}{children}{error && label !== "E-Mail" ? <span className="mt-1.5 block text-sm font-normal text-red" role="alert">{error}</span> : null}</label>;
}
