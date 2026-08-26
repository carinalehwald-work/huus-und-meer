import "server-only";

import { compare } from "bcryptjs";
import type { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";

import { prisma } from "@/lib/prisma";

export const authOptions: NextAuthOptions = {
  secret: process.env.NEXTAUTH_SECRET,
  session: {
    strategy: "jwt",
    maxAge: 60 * 60 * 8,
  },
  pages: {
    signIn: "/admin/login",
  },
  providers: [
    CredentialsProvider({
      name: "Admin-Zugang",
      credentials: {
        email: { label: "E-Mail", type: "email" },
        password: { label: "Passwort", type: "password" },
      },
      async authorize(credentials) {
        const email = credentials?.email?.trim().toLowerCase();
        const password = credentials?.password;

        if (!email || !password) {
          return null;
        }

        const admin = await prisma.adminBenutzer.findUnique({
          where: { email },
        });

        if (!admin || !admin.istAktiv || !admin.passwortHash) {
          return null;
        }

        const passwordMatches = await compare(password, admin.passwortHash);

        if (!passwordMatches) {
          return null;
        }

        return {
          id: admin.id,
          name: admin.name,
          email: admin.email,
          sitzungVersion: admin.sitzungVersion,
        };
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.sitzungVersion = user.sitzungVersion;
        token.ungueltig = false;
        return token;
      }

      if (!token.sub || typeof token.sitzungVersion !== "number") {
        token.ungueltig = true;
        delete token.sub;
        return token;
      }

      const admin = await prisma.adminBenutzer.findUnique({
        where: { id: token.sub },
        select: { istAktiv: true, sitzungVersion: true },
      });
      if (!admin?.istAktiv || admin.sitzungVersion !== token.sitzungVersion) {
        token.ungueltig = true;
        delete token.sub;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user && token.sub && !token.ungueltig) {
        session.user.id = token.sub;
      }

      return session;
    },
  },
};
