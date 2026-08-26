import Link from "next/link";

import type { ActiveAdmin } from "@/lib/admin-auth";
import { AdminSessionActions } from "@/components/admin/admin-session-actions";

type AdminIconName = "anchor" | "briefcase" | "building" | "mail" | "settings" | "ship";

type AdminArea = {
  description: string;
  href: string;
  icon: AdminIconName;
  label: string;
};

const adminAreas: AdminArea[] = [
  { label: "Stammdaten", description: "Zentrale Unternehmens- und Kontaktdaten pflegen.", href: "/admin/stammdaten", icon: "building" },
  { label: "Hausboote", description: "Unterkünfte und ihre Inhalte verwalten.", href: "/admin/hausboote", icon: "ship" },
  { label: "Liegeplätze", description: "Liegeplätze und Verfügbarkeiten vorbereiten.", href: "/admin/liegeplaetze", icon: "anchor" },
  { label: "Services", description: "Zusatzleistungen zentral organisieren.", href: "/admin/services", icon: "building" },
  { label: "Stellenangebote", description: "Karriere-Inhalte künftig pflegen.", href: "/admin/stellenangebote", icon: "briefcase" },
  { label: "Kontaktanfragen", description: "Eingehende Nachrichten künftig bündeln.", href: "/admin/kontaktanfragen", icon: "mail" },
];

function AdminIcon({ name }: { name: AdminIconName }) {
  const paths: Record<AdminIconName, React.ReactNode> = {
    anchor: <><circle cx="12" cy="5" r="2" /><path d="M12 7v13m-7-6a7 7 0 0 0 14 0M5 14H2m20 0h-3" /></>,
    briefcase: <><rect x="3" y="7" width="18" height="13" rx="2" /><path d="M8 7V5h8v2m-13 5h18M10 12v2h4v-2" /></>,
    building: <><path d="M4 21V5h11v16M15 10h5v11M8 9h3m-3 4h3m-3 4h3" /><path d="M8 21v-3h3v3" /></>,
    mail: <><rect x="3" y="5" width="18" height="14" rx="2" /><path d="m4 7 8 6 8-6" /></>,
    settings: <><circle cx="12" cy="12" r="3" /><path d="M19.4 15a1.7 1.7 0 0 0 .3 1.9l.1.1-2.2 2.2-.1-.1a1.7 1.7 0 0 0-1.9-.3 1.7 1.7 0 0 0-1 1.5v.2h-3.2v-.2a1.7 1.7 0 0 0-1-1.5 1.7 1.7 0 0 0-1.9.3l-.1.1-2.2-2.2.1-.1A1.7 1.7 0 0 0 6.6 15a1.7 1.7 0 0 0-1.5-1H5v-3.2h.2a1.7 1.7 0 0 0 1.5-1 1.7 1.7 0 0 0-.3-1.9l-.1-.1 2.2-2.2.1.1a1.7 1.7 0 0 0 1.9.3 1.7 1.7 0 0 0 1-1.5V4h3.2v.2a1.7 1.7 0 0 0 1 1.5 1.7 1.7 0 0 0 1.9-.3l.1-.1 2.2 2.2-.1.1a1.7 1.7 0 0 0-.3 1.9 1.7 1.7 0 0 0 1.5 1h.2V14h-.2a1.7 1.7 0 0 0-1.5 1Z" /></>,
    ship: <><path d="M4 15h16l-2 4H6l-2-4Z" /><path d="M12 5v10M12 5 7 9m5-4 5 4M3 21c2 1 4 1 6 0 2 1 4 1 6 0 2 1 4 1 6 0" /></>,
  };

  return <svg aria-hidden="true" className="h-5 w-5" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.8" viewBox="0 0 24 24">{paths[name]}</svg>;
}

function AdminNavigation() {
  return <nav aria-label="Admin-Navigation" className="grid grid-cols-1 gap-2 sm:grid-cols-2 lg:grid-cols-1">
    <Link className="flex min-h-11 items-center gap-3 rounded-xl bg-brand px-3 py-2 text-sm font-semibold text-ice shadow-sm sm:col-span-2 lg:col-auto" href="/admin"><span className="grid h-7 w-7 place-items-center rounded-lg bg-ice/15"><AdminIcon name="building" /></span>Übersicht</Link>
    {adminAreas.map((area) => <Link className="flex min-h-11 items-center gap-3 rounded-xl px-3 py-2 text-sm font-semibold text-ink transition hover:bg-mist focus:outline-none focus:ring-2 focus:ring-sky" href={area.href} key={area.href}><span className="grid h-7 w-7 shrink-0 place-items-center rounded-lg bg-mist text-brand"><AdminIcon name={area.icon} /></span><span className="min-w-0 break-words">{area.label}</span></Link>)}
    <Link className="flex min-h-11 items-center gap-3 rounded-xl px-3 py-2 text-sm font-semibold text-ink transition hover:bg-mist focus:outline-none focus:ring-2 focus:ring-sky lg:mt-4" href="/admin/einstellungen"><span className="grid h-7 w-7 shrink-0 place-items-center rounded-lg bg-mist text-brand"><AdminIcon name="settings" /></span>Einstellungen</Link>
    <Link className="flex min-h-11 items-center gap-3 rounded-xl px-3 py-2 text-sm font-semibold text-ink transition hover:bg-mist focus:outline-none focus:ring-2 focus:ring-sky" href="/admin/mein-konto"><span className="grid h-7 w-7 shrink-0 place-items-center rounded-lg bg-mist text-brand"><AdminIcon name="settings" /></span>Mein Konto</Link>
  </nav>;
}

export function AdminDashboard({ admin }: { admin: ActiveAdmin }) {
  return <main className="min-h-dvh bg-mist p-3 sm:p-5 lg:p-7">
    <div className="mx-auto grid w-full max-w-[110rem] gap-4 lg:grid-cols-[17rem_minmax(0,1fr)] lg:gap-7">
      <aside className="rounded-2xl border border-mist-line bg-ice p-3 shadow-sm lg:sticky lg:top-7 lg:flex lg:h-[calc(100dvh-3.5rem)] lg:min-h-0 lg:flex-col lg:overflow-hidden lg:p-4">
        <div className="flex shrink-0 items-center justify-between gap-4 px-2 py-2 lg:block"><div><p className="text-xs font-bold uppercase tracking-[0.16em] text-brand">Huus & Meer</p><p className="mt-1 text-lg font-semibold tracking-tight text-ink">Verwaltung</p></div><Link className="min-h-11 rounded-xl px-3 py-2 text-sm font-semibold text-brand transition hover:bg-mist focus:outline-none focus:ring-2 focus:ring-sky lg:mt-5 lg:inline-flex" href="/">Zur Website</Link></div>
        <div className="mt-3 border-t border-mist-line pt-3 lg:mt-5 lg:min-h-0 lg:flex-1 lg:overflow-y-auto"><AdminNavigation /></div>
        <div className="mt-5 shrink-0 border-t border-mist-line px-2 pt-4"><p className="text-xs font-semibold uppercase tracking-[0.14em] text-ink/60">Angemeldet als</p><p className="mt-1 truncate text-sm font-semibold text-ink" title={admin.name}>{admin.name}</p><p className="mt-1 truncate text-xs text-ink/65" title={admin.email}>{admin.email}</p><div className="mt-4"><AdminSessionActions /></div></div>
      </aside>
      <section aria-labelledby="admin-title" className="min-w-0 rounded-2xl border border-mist-line bg-ice p-5 shadow-sm sm:p-7 lg:p-9">
        <div className="flex flex-col gap-4 border-b border-mist-line pb-6 sm:flex-row sm:items-start sm:justify-between"><div><p className="text-sm font-semibold uppercase tracking-[0.16em] text-brand">Admin-Bereich</p><h1 className="mt-2 text-3xl font-semibold tracking-tight text-ink sm:text-4xl" id="admin-title">Übersicht</h1><p className="mt-3 max-w-2xl text-sm leading-6 text-ink/75 sm:text-base">Willkommen zurück, {admin.name}. Wähle einen Bereich, um die Verwaltung vorzubereiten.</p></div><div className="rounded-xl border border-mist-line bg-mist px-3 py-2 text-sm text-ink/75">Dashboard</div></div>
        <div className="mt-7 grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {adminAreas.map((area) => <Link className="group flex min-h-48 flex-col rounded-2xl border border-mist-line bg-mist p-5 transition hover:-translate-y-0.5 hover:border-brand/45 hover:shadow-md focus:outline-none focus:ring-2 focus:ring-sky" href={area.href} key={area.href}><span className="grid h-11 w-11 place-items-center rounded-xl bg-ice text-brand shadow-sm"><AdminIcon name={area.icon} /></span><h2 className="mt-5 text-lg font-semibold tracking-tight text-ink">{area.label}</h2><p className="mt-2 text-sm leading-6 text-ink/70">{area.description}</p><span className="mt-auto pt-4 text-sm font-semibold text-brand">Bereich öffnen <span aria-hidden="true">→</span></span></Link>)}
          <Link className="group flex min-h-48 flex-col rounded-2xl border border-mist-line bg-mist p-5 transition hover:-translate-y-0.5 hover:border-brand/45 hover:shadow-md focus:outline-none focus:ring-2 focus:ring-sky" href="/admin/einstellungen"><span className="grid h-11 w-11 place-items-center rounded-xl bg-ice text-brand shadow-sm"><AdminIcon name="settings" /></span><h2 className="mt-5 text-lg font-semibold tracking-tight text-ink">Admin-Einstellungen</h2><p className="mt-2 text-sm leading-6 text-ink/70">Interne Administrator-Zugänge verwalten.</p><span className="mt-auto pt-4 text-sm font-semibold text-brand">Bereich öffnen <span aria-hidden="true">→</span></span></Link>
        </div>
      </section>
    </div>
  </main>;
}
