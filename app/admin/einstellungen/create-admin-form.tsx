"use client";

import { useActionState, useEffect } from "react";

import { createAdmin, type CreateAdminState } from "./actions";

const input = "mt-1 min-h-11 w-full rounded-xl border border-mist-line bg-ice px-3 text-sm";
const initialState: CreateAdminState = { error: null, code: null, fieldErrors: {} };

export function CreateAdminForm() {
  const [state, action, pending] = useActionState(createAdmin, initialState);

  useEffect(() => {
    if (state.error) window.dispatchEvent(new CustomEvent("admin-toast", { detail: { message: state.error, tone: "error" } }));
    else if (state.code) window.dispatchEvent(new CustomEvent("admin-toast", { detail: { message: "Administrator erfolgreich erstellt.", tone: "success" } }));
  }, [state.code, state.error]);

  return <section className="mt-5 rounded-2xl bg-ice p-5 shadow-sm"><h2 className="text-xl font-semibold">Administrator anlegen</h2><form action={action} className="mt-4 grid gap-3 sm:grid-cols-3"><label>Name<input aria-invalid={Boolean(state.fieldErrors?.name)} className={`${input} ${state.fieldErrors?.name ? "admin-field-invalid" : ""}`} name="name" required />{state.fieldErrors?.name ? <span className="admin-field-error">{state.fieldErrors.name}</span> : null}</label><label>E-Mail<input aria-invalid={Boolean(state.fieldErrors?.email)} className={`${input} ${state.fieldErrors?.email ? "admin-field-invalid" : ""}`} name="email" required type="email" />{state.fieldErrors?.email ? <span className="admin-field-error">{state.fieldErrors.email}</span> : null}</label><button className="min-h-11 self-end rounded-xl bg-brand px-4 font-semibold text-ice disabled:opacity-60" disabled={pending}>{pending ? "Wird angelegt …" : "Administrator anlegen"}</button></form>{state.code ? <div className="mt-4 rounded-xl border border-brand/30 bg-mist p-4"><h3 className="font-semibold">Einrichtungscode – einmalig anzeigen</h3><p className="mt-2 break-all rounded-lg bg-ice p-3 font-mono text-sm">{state.code}</p><p className="mt-2 text-sm text-ink/70">Sicher manuell übergeben. Gültig für sieben Tage und nur einmal verwendbar.</p></div> : null}</section>;
}
