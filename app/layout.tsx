import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = { title: "Huus & Meer | Ostsee erleben. Werte bewahren.", description: "Ferienunterkünfte, Eigentümerservice und Immobilien an der Ostsee." };

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return <html lang="de"><body>{children}</body></html>;
}
