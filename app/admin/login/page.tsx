import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";

import { LoginForm } from "@/components/admin/login-form";
import { getActiveAdmin } from "@/lib/admin-auth";

export const metadata: Metadata = {
  title: "Admin-Anmeldung | Huus & Meer",
  robots: { index: false, follow: false },
};

export default async function AdminLoginPage() {
  const admin = await getActiveAdmin();

  if (admin) {
    redirect("/admin");
  }

  return (
    <main className="grid min-h-dvh place-items-center bg-mist px-5 py-8 sm:px-8">
      <section aria-labelledby="admin-login-title" className="w-full max-w-md rounded-2xl bg-ice p-6 shadow-sm sm:p-8">
        <p className="text-sm font-semibold uppercase tracking-[0.16em] text-brand">Huus & Meer</p>
        <h1 className="mt-3 text-3xl font-semibold tracking-tight text-ink" id="admin-login-title">
          Admin-Anmeldung
        </h1>
        <p className="mt-3 text-sm leading-6 text-ink">Melde dich mit deinem internen Admin-Zugang an.</p>
        <div className="mt-7">
          <LoginForm />
        </div>
        <Link className="mt-5 inline-block text-sm font-semibold text-brand" href="/admin/zugang-einrichten">Zugang einrichten</Link>
      </section>
    </main>
  );
}
