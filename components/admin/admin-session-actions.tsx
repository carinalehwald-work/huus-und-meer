"use client";

import { useState } from "react";
import { signOut } from "next-auth/react";
import { useRouter } from "next/navigation";

export function AdminSessionActions() {
  const router = useRouter();
  const [isSigningOut, setIsSigningOut] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function endSession() {
    setError(null);
    setIsSigningOut(true);

    try {
      await signOut({ redirect: false });
      router.replace("/admin/login");
      router.refresh();
    } catch {
      setError("Abmelden ist gerade nicht möglich. Bitte versuche es erneut.");
      setIsSigningOut(false);
    }
  }

  return <div className="grid gap-2">
    <button className="min-h-11 rounded-xl border border-mist-line px-3 py-2 text-left text-sm font-semibold text-ink transition hover:bg-mist focus:outline-none focus:ring-2 focus:ring-sky disabled:cursor-wait disabled:opacity-60" disabled={isSigningOut} onClick={endSession} type="button">Benutzer wechseln</button>
    <button className="min-h-11 rounded-xl px-3 py-2 text-left text-sm font-semibold text-red transition hover:bg-red/10 focus:outline-none focus:ring-2 focus:ring-sky disabled:cursor-wait disabled:opacity-60" disabled={isSigningOut} onClick={endSession} type="button">{isSigningOut ? "Wird abgemeldet …" : "Abmelden"}</button>
    {error ? <p aria-live="polite" className="text-xs leading-5 text-red">{error}</p> : null}
  </div>;
}
