import "server-only";

import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";

import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export type ActiveAdmin = {
  id: string;
  name: string;
  email: string;
};

export async function getActiveAdmin(): Promise<ActiveAdmin | null> {
  const session = await getServerSession(authOptions);
  const adminId = session?.user?.id;

  if (!adminId) {
    return null;
  }

  return prisma.adminBenutzer.findFirst({
    where: {
      id: adminId,
      istAktiv: true,
    },
    select: {
      id: true,
      name: true,
      email: true,
    },
  });
}

export async function requireActiveAdmin(): Promise<ActiveAdmin> {
  const admin = await getActiveAdmin();

  if (!admin) {
    redirect("/admin/login");
  }

  return admin;
}
