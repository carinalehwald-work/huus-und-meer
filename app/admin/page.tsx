import type { Metadata } from "next";

import { AdminDashboard } from "@/components/admin/admin-dashboard";
import { requireActiveAdmin } from "@/lib/admin-auth";

export const metadata: Metadata = {
  title: "Admin | Huus & Meer",
  robots: { index: false, follow: false },
};

export default async function AdminPage() {
  return <AdminDashboard admin={await requireActiveAdmin()} />;
}
