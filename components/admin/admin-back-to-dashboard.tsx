import Link from "next/link";

export function AdminBackToDashboard() {
  return <Link className="inline-flex min-h-10 items-center rounded-xl border border-mist-line px-3 py-2 text-sm font-semibold text-ink transition hover:bg-ice hover:text-brand focus:outline-none focus:ring-2 focus:ring-sky" href="/admin">← Zurück zum Dashboard</Link>;
}
