export function saleSlug(value: string) {
  const normalized = value.normalize("NFKD").replace(/[\u0300-\u036f]/g, "").toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
  return normalized || "angebot";
}
