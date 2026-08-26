import type { StammdatenV1 } from "@/generated/prisma/client";
import type { PublicMasterData } from "@/data/site";
import { formatOfficeHours } from "@/lib/format-office-hours";

export function publicMasterDataFrom(masterData: StammdatenV1 | null): PublicMasterData {
  return {
    address: [masterData?.strasse, [masterData?.plz, masterData?.ort].filter(Boolean).join(" · "), masterData?.land].filter(Boolean).join(" · ") || null,
    companyName: masterData?.unternehmensname ?? null,
    email: masterData?.email ?? null,
    facebookUrl: masterData?.facebookUrl ?? null,
    instagramUrl: masterData?.instagramUrl ?? null,
    officeHours: formatOfficeHours(masterData?.buerozeiten),
    phone: masterData?.telefon ?? null,
    tiktokUrl: masterData?.tiktokUrl ?? null,
  };
}
