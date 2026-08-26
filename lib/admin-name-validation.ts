export const duplicateNameToastMessage = "Dieser Name ist bereits vergeben. Bitte wähle einen anderen Namen.";
export const duplicateNameFieldMessage = "Dieser Name ist bereits vergeben.";

export function cleanAdminName(value: string) {
  return value.normalize("NFKC").trim().replace(/\s+/gu, " ");
}

export function normalizeAdminName(value: string) {
  return cleanAdminName(value).toLocaleLowerCase("de-DE");
}

export async function hasDuplicateAdminName(
  value: string,
  lookup: (normalizedName: string) => Promise<unknown>,
) {
  return Boolean(await lookup(normalizeAdminName(value)));
}
