import Link from "next/link";

import type { ActiveAdmin } from "@/lib/admin-auth";

export function AdminAreaPlaceholder({ admin, title }: { admin: ActiveAdmin; title: string }) {
  return <main className="grid min-h-dvh place-items-center bg-mist p-5 sm:p-8"><section aria-labelledby="admin-area-title" className="w-full max-w-2xl rounded-2xl border border-mist-line bg-ice p-6 shadow-sm sm:p-8"><p className="text-sm font-semibold uppercase tracking-[0.16em] text-brand">Huus & Meer · Verwaltung</p><h1 className="mt-3 text-3xl font-semibold tracking-tight text-ink" id="admin-area-title">{title}</h1><p className="mt-3 text-base leading-7 text-ink/75">Dieser Verwaltungsbereich ist vorbereitet. Inhalte und Funktionen folgen in einem späteren Schritt.</p><p className="mt-5 text-sm text-ink/65">Angemeldet als {admin.name}.</p><Link className="mt-7 inline-flex min-h-11 items-center rounded-xl bg-brand px-4 py-2 text-sm font-semibold text-ice transition hover:bg-ink focus:outline-none focus:ring-2 focus:ring-sky focus:ring-offset-2 focus:ring-offset-ice" href="/admin">Zur Übersicht</Link></section></main>;
}
