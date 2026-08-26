import "dotenv/config";

import { randomUUID } from "node:crypto";
import { createInterface } from "node:readline/promises";
import { stdin, stdout } from "node:process";

import { PrismaPg } from "@prisma/adapter-pg";
import { hash } from "bcryptjs";

import { PrismaClient } from "../generated/prisma/client";

const databaseUrl = process.env.DATABASE_URL;

if (!databaseUrl) {
  throw new Error("DATABASE_URL is required to create an admin user.");
}

async function promptPassword(): Promise<string> {
  if (!stdin.isTTY) {
    throw new Error("Der Befehl benötigt ein interaktives Terminal.");
  }

  return new Promise((resolve, reject) => {
    const previousRawMode = stdin.isRaw;
    let password = "";

    function cleanup() {
      stdin.off("data", handleData);
      stdin.setRawMode(previousRawMode);
      stdin.pause();
    }

    function handleData(chunk: Buffer) {
      const input = chunk.toString("utf8");

      for (const character of input) {
        if (character === "\u0003") {
          cleanup();
          reject(new Error("Vorgang abgebrochen."));
          return;
        }

        if (character === "\r" || character === "\n") {
          cleanup();
          stdout.write("\n");
          resolve(password);
          return;
        }

        if (character === "\b" || character === "\u007f") {
          if (password.length > 0) {
            password = password.slice(0, -1);
            stdout.write("\b \b");
          }
          continue;
        }

        password += character;
        stdout.write("•");
      }
    }

    stdout.write("Passwort: ");
    stdin.setRawMode(true);
    stdin.resume();
    stdin.on("data", handleData);
  });
}

async function main() {
  const readline = createInterface({ input: stdin, output: stdout });
  const name = (await readline.question("Name: ")).trim();
  const email = (await readline.question("E-Mail-Adresse: ")).trim().toLowerCase();
  readline.close();

  const password = await promptPassword();

  if (!name || !email || password.length < 12) {
    throw new Error("Name, E-Mail-Adresse und ein Passwort mit mindestens 12 Zeichen sind erforderlich.");
  }

  const prisma = new PrismaClient({
    adapter: new PrismaPg({ connectionString: databaseUrl }),
  });

  try {
    const role = await prisma.adminRolle.upsert({
      where: { name: "Administrator" },
      update: {},
      create: { id: randomUUID(), name: "Administrator" },
    });

    const existingAdmin = await prisma.adminBenutzer.findUnique({ where: { email } });

    if (existingAdmin) {
      throw new Error("Für diese E-Mail-Adresse existiert bereits ein Admin-Benutzer.");
    }

    await prisma.adminBenutzer.create({
      data: {
        id: randomUUID(),
        adminRolleId: role.id,
        name,
        email,
        passwortHash: await hash(password, 12),
        istAktiv: true,
      },
    });

    stdout.write("Admin-Benutzer wurde erfolgreich angelegt.\n");
  } finally {
    await prisma.$disconnect();
  }
}

export const adminCreatePromise = main();
