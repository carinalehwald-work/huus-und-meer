"use client";

import { Suspense } from "react";
import { usePathname } from "next/navigation";
import { AdminBackToDashboard } from "@/components/admin/admin-back-to-dashboard";
import { AdminUxProvider } from "@/components/admin/admin-ux-provider";

const overviewRoutes = new Set(["/admin/einstellungen", "/admin/hausboote", "/admin/kontaktanfragen", "/admin/liegeplaetze", "/admin/services", "/admin/stammdaten", "/admin/stellenangebote"]);

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const showDashboardLink = pathname ? overviewRoutes.has(pathname) : false;

  return <Suspense fallback={children}><AdminUxProvider>{showDashboardLink ? <div className="bg-mist px-4 pt-4 sm:px-6 lg:px-8"><div className="mx-auto w-full max-w-[100rem]"><AdminBackToDashboard /></div></div> : null}{children}</AdminUxProvider></Suspense>;
}
