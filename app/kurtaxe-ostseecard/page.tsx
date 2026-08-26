import type { Metadata } from "next";
import { KurtaxeOstseecardPage } from "@/components/kurtaxe-ostseecard-page";

export const metadata: Metadata = { title: "Kurtaxe & Ostseecard | Huus & Meer", description: "Wichtige Informationen zur Kurabgabe und Ostseecard für Fehmarn, Großenbrode und Heiligenhafen." };

export default function Page() {
  return <KurtaxeOstseecardPage />;
}
