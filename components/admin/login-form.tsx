"use client";

import { type FormEvent, useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";

export function LoginForm() {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    setIsSubmitting(true);

    const formData = new FormData(event.currentTarget);
    const result = await signIn("credentials", {
      email: formData.get("email"),
      password: formData.get("password"),
      redirect: false,
      callbackUrl: "/admin",
    });

    if (!result || result.error) {
      setError("E-Mail-Adresse oder Passwort ist nicht korrekt.");
      setIsSubmitting(false);
      return;
    }

    router.replace("/admin");
    router.refresh();
  }

  return (
    <form className="grid gap-5" onSubmit={handleSubmit}>
      <div className="grid gap-2">
        <label className="text-sm font-semibold text-ink" htmlFor="email">
          E-Mail-Adresse
        </label>
        <input
          autoComplete="email"
          className="min-h-11 rounded-xl border border-mist-line bg-ice px-3 text-ink outline-none transition focus:border-brand focus:ring-2 focus:ring-sky"
          id="email"
          name="email"
          required
          type="email"
        />
      </div>
      <div className="grid gap-2">
        <label className="text-sm font-semibold text-ink" htmlFor="password">
          Passwort
        </label>
        <input
          autoComplete="current-password"
          className="min-h-11 rounded-xl border border-mist-line bg-ice px-3 text-ink outline-none transition focus:border-brand focus:ring-2 focus:ring-sky"
          id="password"
          name="password"
          required
          type="password"
        />
      </div>
      {error ? (
        <p aria-live="polite" className="rounded-xl bg-mist px-3 py-2 text-sm text-ink">
          {error}
        </p>
      ) : null}
      <button
        className="min-h-11 rounded-xl bg-brand px-4 py-2 font-semibold text-ice transition hover:bg-ink focus:outline-none focus:ring-2 focus:ring-sky focus:ring-offset-2 focus:ring-offset-mist disabled:cursor-not-allowed disabled:opacity-60"
        disabled={isSubmitting}
        type="submit"
      >
        {isSubmitting ? "Anmeldung läuft …" : "Anmelden"}
      </button>
    </form>
  );
}
