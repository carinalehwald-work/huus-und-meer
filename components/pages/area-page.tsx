import Link from "next/link";
import { Footer } from "@/components/layout/footer";
import { Header } from "@/components/layout/header";
import { Icon } from "@/components/ui/icon";
import { SectionLabel } from "@/components/ui/section-label";

type AreaTheme = "guest" | "owner";

type AreaPageProps = {
  theme: AreaTheme;
  label: string;
  title: string;
  introductionTitle: string;
  introduction: string;
  ctaLabel: string;
  ctaHref: string;
};

const themes = {
  guest: {
    page: "bg-sand",
    hero: "border-sand-line bg-sand",
    surface: "border-sand-line bg-linen",
    label: "text-red",
    action: "rounded-[0.2rem] border border-red bg-red text-linen outline outline-1 outline-offset-[3px] outline-red/55 shadow-[0_3px_10px_color-mix(in_srgb,var(--color-red)_16%,transparent)] transition-[background-color,color,box-shadow,transform] duration-150 ease-out hover:-translate-y-0.5 hover:bg-sand hover:text-ink hover:shadow-[0_6px_14px_color-mix(in_srgb,var(--color-red)_20%,transparent)] active:translate-y-px active:shadow-none focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-ink",
  },
  owner: {
    page: "bg-mist",
    hero: "border-mist-line bg-mist",
    surface: "border-mist-line bg-ice",
    label: "text-brand",
    action: "rounded-[0.2rem] border border-brand bg-brand text-ice outline outline-1 outline-offset-[3px] outline-brand/55 shadow-[0_3px_10px_color-mix(in_srgb,var(--color-brand)_16%,transparent)] transition-[background-color,color,box-shadow,transform] duration-150 ease-out hover:-translate-y-0.5 hover:bg-ice hover:text-ink hover:shadow-[0_6px_14px_color-mix(in_srgb,var(--color-brand)_20%,transparent)] active:translate-y-px active:shadow-none focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-ink",
  },
} as const;

export function AreaPage({ theme, label, title, introductionTitle, introduction, ctaLabel, ctaHref }: AreaPageProps) {
  const styles = themes[theme];

  return <>
    <Header />
    <main className={styles.page} data-area={theme}>
      <section className={`border-b ${styles.hero}`} aria-labelledby="page-title">
        <div className="container-page py-[clamp(4.5rem,9vw,9rem)]">
          <SectionLabel className={styles.label}>{label}</SectionLabel>
          <h1 id="page-title" className="max-w-4xl text-[clamp(2.5rem,6vw,5rem)] font-bold leading-[.98] tracking-[-.05em] text-ink">
            {title}
          </h1>
        </div>
      </section>

      <section className="container-page py-[clamp(3.5rem,7vw,7rem)]" aria-labelledby="introduction-title">
        <div className={`max-w-3xl rounded-sm border p-[clamp(1.5rem,4vw,3.5rem)] ${styles.surface}`}>
          <h2 id="introduction-title" className="max-w-2xl text-[clamp(1.75rem,3.4vw,3rem)] font-bold leading-tight tracking-[-.035em] text-ink">
            {introductionTitle}
          </h2>
          <p className="mt-6 max-w-xl text-base leading-relaxed text-ink/75 sm:text-lg">{introduction}</p>
        </div>
      </section>

      <section className="container-page pt-2" aria-labelledby="overview-title">
        <div className="max-w-3xl">
          <h2 id="overview-title" className="text-2xl font-bold tracking-[-.03em] text-ink sm:text-3xl">Übersicht</h2>
          <p className="mt-4 max-w-xl text-base leading-relaxed text-ink/75">
            Die weiteren Themenbereiche werden hier schrittweise ergänzt.
          </p>
        </div>
      </section>

      <section className="container-page py-[clamp(3.5rem,7vw,7rem)]" aria-labelledby="information-title">
        <div className="max-w-3xl">
          <h2 id="information-title" className="text-2xl font-bold tracking-[-.03em] text-ink sm:text-3xl">Weitere Informationen</h2>
          <p className="mt-4 max-w-xl text-base leading-relaxed text-ink/75">
            Ergänzende Inhalte erhalten hier ihren eigenen, flexibel erweiterbaren Bereich.
          </p>
        </div>
      </section>

      <section className="container-page pb-[clamp(4.5rem,9vw,9rem)]" aria-label="Nächster Schritt">
        <div className="max-w-3xl">
          <Link href={ctaHref} className={`group inline-flex min-h-12 items-center justify-center px-6 text-sm font-bold ${styles.action}`}>
            {ctaLabel} <Icon name="arrow" className="ml-2 h-4 w-4 transition-transform duration-150 ease-out group-hover:translate-x-1" />
          </Link>
        </div>
      </section>
    </main>
    <Footer />
  </>;
}
