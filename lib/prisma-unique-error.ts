import "server-only";

import { Prisma } from "@/generated/prisma/client";

export function isUniqueConstraintError(error: unknown, fields: string[]) {
  if (!(error instanceof Prisma.PrismaClientKnownRequestError) || error.code !== "P2002") return false;
  const target = error.meta?.target;
  const targetFields = Array.isArray(target) ? target.map(String) : [String(target ?? "")];
  return fields.every((field) => targetFields.some((targetField) => targetField.includes(field)));
}
