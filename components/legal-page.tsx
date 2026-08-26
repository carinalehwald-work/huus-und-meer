import type { ReactNode } from "react";
import { Footer } from "@/components/layout/footer";
import { Header } from "@/components/layout/header";

export function LegalPage({ eyebrow, title, children }: { eyebrow: string; title: string; children: ReactNode }) {
  return <><Header /><main className="bg-sand"><header className="container-page py-[clamp(4rem,8vw,8rem)]"><p className="whitespace-nowrap text-[clamp(1.15rem,4.8vw,5.25rem)] font-bold leading-[.9] tracking-[-.065em] text-red">{eyebrow}</p><h1 className="mt-8 max-w-5xl text-[clamp(2rem,3.5vw,3.75rem)] font-bold leading-[.98] tracking-[-.05em] text-ink">{title}</h1></header><article className="container-page max-w-[90rem] py-[clamp(3rem,7vw,7rem)]"><div className="max-w-3xl space-y-10 text-base leading-8 text-ink/80">{children}</div></article></main><Footer /></>;
}

export function LegalSection({ title, children }: { title: string; children: ReactNode }) { return <section><h2 className="text-2xl font-bold leading-tight tracking-tight text-ink sm:text-3xl">{title}</h2><div className="mt-4 space-y-4">{children}</div></section>; }
