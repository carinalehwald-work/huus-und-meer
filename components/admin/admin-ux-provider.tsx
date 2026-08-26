"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useCallback, useEffect, useRef, useState } from "react";

import { duplicateNameFieldMessage, duplicateNameToastMessage, normalizeAdminName } from "@/lib/admin-name-validation";

type ToastTone = "success" | "error";
type Toast = { id: number; message: string; tone: ToastTone };
type ToolbarAction = { id: string; label: string; tone: "primary" | "secondary" | "danger" };
type StoredControl = { checked?: boolean; controlIndex: number; value?: string };
type StoredForm = { controls: StoredControl[]; signature: string };
type StoredPageState = { forms: StoredForm[]; pathname: string; scrollY: number; timestamp: number };

const storageKey = "huus-meer-admin-ux";
const errorPattern = /erforderlich|ungültig|bitte|nicht möglich|kann nicht|kann nur|kann erst|wegen bestehender|wird noch|fehler|prüfe|erlaubt sind/i;
const primaryLabels = ["Änderungen speichern", "Entwurf anlegen", "Stammdaten speichern", "Kontodaten speichern", "Administrator anlegen", "Kontakt speichern", "Kategorie speichern", "Service speichern", "Speichern"];

function formSignature(form: HTMLFormElement) {
  const hiddenValues = Array.from(form.elements)
    .filter((element): element is HTMLInputElement => element instanceof HTMLInputElement && element.type === "hidden" && Boolean(element.name))
    .map((element) => `${element.name}:${element.value}`)
    .sort()
    .join("|");
  const submitLabel = form.querySelector<HTMLButtonElement>('button[type="submit"], button:not([type])')?.textContent?.trim() ?? "";
  return `${hiddenValues}::${submitLabel}`;
}

function savePageState(pathname: string) {
  const forms = Array.from(document.forms).map((form) => ({
    signature: formSignature(form),
    controls: Array.from(form.elements).flatMap((element, controlIndex): StoredControl[] => {
      if (!(element instanceof HTMLInputElement || element instanceof HTMLSelectElement || element instanceof HTMLTextAreaElement)) return [];
      if (!element.name || element instanceof HTMLInputElement && ["file", "hidden", "password", "submit", "button"].includes(element.type)) return [];
      if (element instanceof HTMLInputElement && ["checkbox", "radio"].includes(element.type)) return [{ controlIndex, checked: element.checked }];
      return [{ controlIndex, value: element.value }];
    }),
  }));
  const pageState: StoredPageState = { forms, pathname, scrollY: window.scrollY, timestamp: Date.now() };
  sessionStorage.setItem(storageKey, JSON.stringify(pageState));
}

function restorePageState(pathname: string) {
  const raw = sessionStorage.getItem(storageKey);
  if (!raw) return;
  sessionStorage.removeItem(storageKey);
  try {
    const stored = JSON.parse(raw) as StoredPageState;
    if (stored.pathname !== pathname || Date.now() - stored.timestamp > 30_000) return;
    const availableForms = Array.from(document.forms);
    stored.forms.forEach((savedForm) => {
      const form = availableForms.find((candidate) => formSignature(candidate) === savedForm.signature);
      if (!form) return;
      savedForm.controls.forEach((savedControl) => {
        const element = form.elements.item(savedControl.controlIndex);
        if (!(element instanceof HTMLInputElement || element instanceof HTMLSelectElement || element instanceof HTMLTextAreaElement)) return;
        if (typeof savedControl.checked === "boolean" && element instanceof HTMLInputElement) element.checked = savedControl.checked;
        if (typeof savedControl.value === "string") element.value = savedControl.value;
      });
    });
    requestAnimationFrame(() => requestAnimationFrame(() => window.scrollTo({ top: stored.scrollY, behavior: "auto" })));
  } catch {
    sessionStorage.removeItem(storageKey);
  }
}

function messageForControl(control: HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement) {
  if (control.validity.valueMissing) return control instanceof HTMLSelectElement ? "Bitte wähle eine Option aus." : "Dieses Feld ist erforderlich.";
  if (control.validity.typeMismatch && control instanceof HTMLInputElement && control.type === "email") return "Bitte gib eine gültige E-Mail-Adresse ein.";
  if (control.validity.typeMismatch && control instanceof HTMLInputElement && control.type === "url") return "Bitte gib eine gültige HTTP(S)-Adresse ein.";
  if (control.validity.tooShort && (control instanceof HTMLInputElement || control instanceof HTMLTextAreaElement)) return `Bitte gib mindestens ${control.minLength} Zeichen ein.`;
  if (control.validity.rangeUnderflow && control instanceof HTMLInputElement) return `Der Wert muss mindestens ${control.min} betragen.`;
  return "Bitte prüfe diese Eingabe.";
}

function clearFieldError(control: Element) {
  if (!(control instanceof HTMLInputElement || control instanceof HTMLSelectElement || control instanceof HTMLTextAreaElement)) return;
  control.removeAttribute("aria-invalid");
  control.classList.remove("admin-field-invalid");
  const label = control.closest("label");
  label?.querySelector('[data-admin-field-error="true"]')?.remove();
  const section = control.closest("section");
  section?.classList.remove("admin-section-invalid");
  section?.querySelector('[data-admin-section-error="true"]')?.remove();
}

function markFieldError(control: HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement, message: string) {
  clearFieldError(control);
  control.setAttribute("aria-invalid", "true");
  control.classList.add("admin-field-invalid");
  if (control instanceof HTMLInputElement && control.type === "hidden") {
    const section = control.closest("section");
    if (!section) return;
    section.classList.add("admin-section-invalid");
    const error = document.createElement("p");
    error.dataset.adminSectionError = "true";
    error.className = "admin-field-error mt-3";
    error.textContent = message;
    control.insertAdjacentElement("afterend", error);
    return;
  }
  const label = control.closest("label");
  if (!label) return;
  const error = document.createElement("span");
  error.dataset.adminFieldError = "true";
  error.className = "admin-field-error";
  error.textContent = message;
  label.append(error);
}

function duplicateNameControl(form: HTMLFormElement) {
  const fieldName = form.dataset.adminUniqueNameField;
  if (!fieldName) return null;
  const control = form.elements.namedItem(fieldName);
  return control instanceof HTMLInputElement || control instanceof HTMLSelectElement || control instanceof HTMLTextAreaElement ? control : null;
}

function duplicateNames(form: HTMLFormElement) {
  const rawNames = form.dataset.adminUniqueNames;
  if (!rawNames) return [];
  try {
    const parsed = JSON.parse(rawNames) as unknown;
    if (Array.isArray(parsed)) return parsed.filter((name): name is string => typeof name === "string");
    if (!parsed || typeof parsed !== "object") return [];
    const scopeField = form.dataset.adminUniqueNameScopeField;
    if (!scopeField) return [];
    const scopeControl = form.elements.namedItem(scopeField);
    if (!(scopeControl instanceof HTMLInputElement || scopeControl instanceof HTMLSelectElement)) return [];
    const scopedNames = (parsed as Record<string, unknown>)[scopeControl.value];
    return Array.isArray(scopedNames) ? scopedNames.filter((name): name is string => typeof name === "string") : [];
  } catch {
    return [];
  }
}

function hasClientDuplicateName(form: HTMLFormElement) {
  const control = duplicateNameControl(form);
  if (!control || !control.value.trim()) return false;
  const normalizedValue = normalizeAdminName(control.value);
  return duplicateNames(form).some((name) => normalizeAdminName(name) === normalizedValue);
}

export function AdminUxProvider({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const router = useRouter();
  const rootRef = useRef<HTMLDivElement>(null);
  const actionElements = useRef(new Map<string, HTMLButtonElement>());
  const serverFieldErrors = useRef(new Map<string, string>());
  const toastSequence = useRef(0);
  const [toasts, setToasts] = useState<Toast[]>([]);
  const [showScrollTop, setShowScrollTop] = useState(false);
  const [toolbarActions, setToolbarActions] = useState<ToolbarAction[]>([]);

  const showToast = useCallback((message: string, tone: ToastTone) => {
    const id = Date.now() + toastSequence.current++;
    setToasts((current) => [...current, { id, message, tone }]);
    window.setTimeout(() => setToasts((current) => current.filter((toast) => toast.id !== id)), 4200);
  }, []);

  useEffect(() => {
    const listener = (event: Event) => {
      const detail = (event as CustomEvent<{ message: string; tone: ToastTone }>).detail;
      if (detail?.message) showToast(detail.message, detail.tone);
    };
    window.addEventListener("admin-toast", listener);
    return () => window.removeEventListener("admin-toast", listener);
  }, [showToast]);

  useEffect(() => {
    const onScroll = () => setShowScrollTop(window.scrollY > 360);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    restorePageState(pathname);
    const hint = searchParams.get("hinweis");
    if (!hint) {
      serverFieldErrors.current.forEach((message, field) => {
        document.querySelectorAll<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>(`[name="${CSS.escape(field)}"]`).forEach((control) => markFieldError(control, message));
      });
      return;
    }
    const tone: ToastTone = searchParams.get("typ") === "fehler" || errorPattern.test(hint) ? "error" : "success";
    window.setTimeout(() => showToast(hint, tone), 0);
    rootRef.current?.querySelectorAll("p").forEach((paragraph) => {
      if (paragraph.textContent?.trim() === hint.trim()) paragraph.hidden = true;
    });

    const fields = searchParams.get("felder")?.split(",").filter(Boolean) ?? [];
    serverFieldErrors.current.clear();
    fields.forEach((field) => {
      const controls = document.querySelectorAll<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>(`[name="${CSS.escape(field)}"]`);
      const message = /bereits vergeben/i.test(hint) ? duplicateNameFieldMessage : field === "bild" ? "Bitte lade ein geeignetes Bild hoch und ergänze den Alt-Text." : field === "email" && /E-Mail/i.test(hint) ? "Bitte gib eine gültige E-Mail-Adresse ein." : /Webadressen/i.test(hint) ? "Bitte gib eine gültige HTTP(S)-Adresse ein." : /Kontaktmöglichkeit/i.test(hint) ? "Ergänze mindestens eine Kontaktmöglichkeit." : "Dieses Feld ist erforderlich.";
      serverFieldErrors.current.set(field, message);
      controls.forEach((control) => markFieldError(control, message));
    });

    const clean = new URLSearchParams(searchParams.toString());
    clean.delete("hinweis");
    clean.delete("typ");
    clean.delete("felder");
    router.replace(`${pathname}${clean.size ? `?${clean.toString()}` : ""}`, { scroll: false });
  }, [pathname, router, searchParams, showToast]);

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;

    const prepareForms = () => root.querySelectorAll("form").forEach((form) => { form.noValidate = true; });
    const scanToolbar = () => {
      prepareForms();
      const controls = Array.from(root.querySelectorAll<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>('input:not([type="hidden"]):not([type="submit"]):not([type="button"]), select, textarea'));
      if (controls.length === 0 || pathname === "/admin/login" || pathname === "/admin/zugang-einrichten") {
        actionElements.current.clear();
        setToolbarActions([]);
        return;
      }
      const buttons = Array.from(root.querySelectorAll<HTMLButtonElement>("form button"));
      const actions: ToolbarAction[] = [];
      const elements = new Map<string, HTMLButtonElement>();
      const primary = buttons.find((button) => primaryLabels.includes(button.textContent?.trim() ?? "")) ?? buttons.find((button) => /speichern|anlegen|hinzufügen/i.test(button.textContent ?? ""));
      if (primary) {
        elements.set("primary", primary);
        actions.push({ id: "primary", label: primary.textContent?.trim() || "Speichern", tone: "primary" });
      }

      const published = buttons.find((button) => button.textContent?.trim() === "Veröffentlicht" || button.textContent?.trim() === "Veröffentlichen");
      if (published) {
        const isPublished = published.className.includes("bg-brand");
        const target = isPublished ? buttons.find((button) => button.textContent?.trim() === "Entwurf") : published;
        if (target) {
          elements.set("publish", target);
          actions.push({ id: "publish", label: isPublished ? "Veröffentlichung aufheben" : "Veröffentlichen", tone: "secondary" });
        }
      }

      const publicationSection = Array.from(root.querySelectorAll("section")).find((section) => section.querySelector("h2")?.textContent?.trim() === "Veröffentlichung");
      const deleteButton = publicationSection ? Array.from(publicationSection.querySelectorAll<HTMLButtonElement>("button")).find((button) => button.textContent?.trim() === "Löschen") : undefined;
      if (deleteButton) {
        elements.set("delete", deleteButton);
        actions.push({ id: "delete", label: "Löschen", tone: "danger" });
      }
      actionElements.current = elements;
      setToolbarActions((current) => JSON.stringify(current) === JSON.stringify(actions) ? current : actions);
    };

    const submit = (event: SubmitEvent) => {
      const form = event.target;
      if (!(form instanceof HTMLFormElement)) return;
      const invalid = Array.from(form.elements).filter((element): element is HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement => element instanceof HTMLInputElement || element instanceof HTMLSelectElement || element instanceof HTMLTextAreaElement).filter((control) => !control.checkValidity());
      if (invalid.length) {
        event.preventDefault();
        invalid.forEach((control) => markFieldError(control, messageForControl(control)));
        showToast("Bitte prüfe die markierten Felder.", "error");
        return;
      }
      if (hasClientDuplicateName(form)) {
        event.preventDefault();
        const control = duplicateNameControl(form);
        if (control) markFieldError(control, duplicateNameFieldMessage);
        showToast(duplicateNameToastMessage, "error");
        return;
      }
      savePageState(pathname);
      if (form.querySelector('input[type="file"]')) showToast("Upload läuft …", "success");
    };
    const input = (event: Event) => {
      const target = event.target;
      if (target instanceof HTMLInputElement || target instanceof HTMLSelectElement || target instanceof HTMLTextAreaElement) serverFieldErrors.current.delete(target.name);
      clearFieldError(target as Element);
      if (!(target instanceof HTMLInputElement || target instanceof HTMLSelectElement || target instanceof HTMLTextAreaElement)) return;
      const form = target.form;
      if (!form || target.name !== form.dataset.adminUniqueNameField && target.name !== form.dataset.adminUniqueNameScopeField) return;
      const nameControl = duplicateNameControl(form);
      if (nameControl) clearFieldError(nameControl);
      if (hasClientDuplicateName(form) && nameControl) markFieldError(nameControl, duplicateNameFieldMessage);
    };

    prepareForms();
    scanToolbar();
    root.addEventListener("submit", submit, true);
    root.addEventListener("input", input, true);
    root.addEventListener("change", input, true);
    const observer = new MutationObserver(scanToolbar);
    observer.observe(root, { childList: true, subtree: true });
    return () => {
      observer.disconnect();
      root.removeEventListener("submit", submit, true);
      root.removeEventListener("input", input, true);
      root.removeEventListener("change", input, true);
    };
  }, [pathname, showToast]);

  return (
    <div data-admin-ux="true" ref={rootRef}>
      {toolbarActions.length ? <div className="sticky top-0 z-40 border-y border-mist-line bg-ice/95 px-4 py-3 shadow-sm backdrop-blur sm:px-6 lg:px-8"><div className="mx-auto flex w-full max-w-[100rem] flex-wrap items-center justify-between gap-3"><p className="text-sm font-semibold text-ink/65">Wichtige Aktionen</p><div className="flex flex-wrap gap-2">{toolbarActions.map((action) => <button className={`min-h-11 rounded-xl px-4 py-2 text-sm font-semibold transition-colors ${action.tone === "primary" ? "bg-brand text-ice hover:bg-ink" : action.tone === "danger" ? "border border-red/35 text-red hover:bg-red/10" : "border border-brand/35 text-brand hover:bg-brand/10"}`} key={action.id} onClick={() => actionElements.current.get(action.id)?.click()} type="button">{action.label}</button>)}</div></div></div> : null}
      {children}
      {toasts.length ? <div aria-live="polite" className="pointer-events-none fixed bottom-[calc(5rem+env(safe-area-inset-bottom))] right-[calc(1rem+env(safe-area-inset-right))] z-[100] flex w-[min(28rem,calc(100vw-2rem))] flex-col gap-3 sm:bottom-24 sm:right-6">{toasts.map((toast) => <div className={`pointer-events-auto border px-4 py-3 text-sm font-semibold shadow-xl ${toast.tone === "error" ? "border-red/40 bg-red text-linen" : "border-brand/40 bg-brand text-ice"}`} key={toast.id} role={toast.tone === "error" ? "alert" : "status"}><div className="flex items-start gap-4"><span>{toast.message}</span><button aria-label="Meldung schließen" className="ml-auto shrink-0 text-current/75 hover:text-current" onClick={() => setToasts((current) => current.filter((item) => item.id !== toast.id))} type="button">×</button></div></div>)}</div> : null}
      <button aria-label="Nach oben" className={`fixed bottom-[calc(1rem+env(safe-area-inset-bottom))] right-[calc(1rem+env(safe-area-inset-right))] z-50 grid h-12 w-12 place-items-center rounded-xl border border-mist-line bg-ice text-lg font-bold text-brand shadow-lg transition-[opacity,transform,background-color] hover:bg-mist focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-3 focus-visible:outline-brand sm:bottom-6 sm:right-6 ${showScrollTop ? "translate-y-0 opacity-100" : "pointer-events-none translate-y-3 opacity-0"}`} onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })} type="button">↑</button>
    </div>
  );
}
