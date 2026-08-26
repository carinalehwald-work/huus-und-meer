import Image from "next/image";
import { Icon } from "@/components/ui/icon";
import { buttonArrowClassName, buttonClassName } from "@/components/ui/button";

export function Hero() {
  return <section id="hero" className="relative overflow-hidden bg-sand">
    <div className="absolute inset-0 bg-[linear-gradient(145deg,#F4F1EA_0%,#F4F1EA_45%,#E8EDF2_63%,#E8EDF2_100%)]" />
    <div className="absolute -left-[20%] top-[38%] h-[42%] w-[82%] rotate-[-13deg] rounded-[50%] bg-linen/70 blur-3xl" />
    <div className="absolute -bottom-[20%] -right-[16%] h-[56%] w-[70%] rotate-[18deg] rounded-[45%] bg-mist/90" />
    <div className="container-page hero-container relative grid min-h-[calc(100svh-var(--site-header-height))] gap-7 py-10 pb-20 sm:gap-10 sm:py-14 sm:pb-24 lg:block lg:py-0">
      <div className="relative z-20 max-w-sm self-start md:max-w-md lg:absolute lg:left-0 lg:top-20 lg:max-w-[clamp(28rem,20vw,34rem)]"><div className="-mt-5 bg-gradient-to-br from-sand via-sand/95 to-sand/10 px-5 py-5 lg:-ml-8 lg:-mt-10 lg:px-10 lg:py-10"><p className="text-xs font-bold tracking-[0.18em] text-red">URLAUBER/INNEN</p><h1 className="mt-4 font-bold tracking-tight text-ink"><span className="block text-[clamp(2rem,3.25vw,3.5rem)] leading-[1.05]">Hausbooturlaub.</span><span className="mt-1 block text-[clamp(1.7rem,2.65vw,2.75rem)] leading-[1.1]">An der Ostsee.</span></h1><p className="mt-3 text-sm font-medium text-ink/60">Fehmarn · Heiligenhafen · Großenbrode</p><a href="#gaeste" className={buttonClassName({ tone: "guest", className: "mt-7 px-6" })}>Hausboot finden <Icon name="arrow" className={buttonArrowClassName} /></a></div></div>
      <div className="relative z-10 mx-auto w-full self-center lg:absolute lg:left-[19%] lg:top-[16%] lg:w-[62%]"><div className="hero-image-fade relative aspect-[16/10]"><Image src="/assets/images/hausboot.jpg" alt="Hausboot an der Ostsee" fill preload sizes="(max-width: 767px) calc(100vw - 2.5rem), (max-width: 1024px) 68vw, (max-width: 1440px) 63vw, 890px" className="object-cover object-center" /></div></div>
      <div className="relative z-20 ml-auto max-w-sm self-end text-right md:max-w-md lg:absolute lg:bottom-18 lg:right-0 lg:max-w-[clamp(28rem,20vw,34rem)]"><div className="-mb-5 bg-gradient-to-tl from-mist via-mist/95 to-mist/10 px-5 py-5 lg:-mr-8 lg:-mb-10 lg:px-10 lg:py-10"><p className="text-xs font-bold tracking-[0.18em] text-brand">EIGENTÜMER/INNEN</p><h2 className="mt-4 font-bold tracking-tight text-ink"><span className="block text-[clamp(2rem,3.25vw,3.5rem)] leading-[1.05]">Hausboot & Liegeplatz.</span><span className="mt-1 block text-[clamp(1.7rem,2.65vw,2.75rem)] leading-[1.1]">Wir kümmern uns.</span></h2><p className="mt-3 text-sm font-medium text-ink/60">Vermietung · Betreuung · Service · Verkauf</p><a href="#eigentuemer" className={buttonClassName({ tone: "owner", className: "mt-7 px-6" })}>Für Eigentümer <Icon name="arrow" className={buttonArrowClassName} /></a></div></div>
      <a href="#gaeste" className="animate-bob absolute bottom-5 left-1/2 z-30 grid h-12 w-12 -translate-x-1/2 place-items-center rounded-full border border-ink/15 bg-linen/75 text-ink shadow-sm backdrop-blur" aria-label="Zu den Unterkünften scrollen"><Icon name="chevron" className="h-6 w-6" /></a>
    </div>
  </section>;
}
