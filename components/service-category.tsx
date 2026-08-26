type PublicService = { id: string; titel: string; beschreibung: string; details: string[] };
type PublicCategory = { id: string; name: string; beschreibung: string | null; services: PublicService[] };

export function ServiceCategory({ category }: { category: PublicCategory }) {
  return <article className="relative mb-8 break-inside-avoid align-top p-[clamp(.65rem,1.2vw,1rem)]">
    <span aria-hidden="true" className="absolute left-0 top-0 h-[3px] w-[76%] bg-brand" /><span aria-hidden="true" className="absolute left-0 top-0 h-[52%] w-[3px] bg-brand" /><span aria-hidden="true" className="absolute bottom-0 right-0 h-[3px] w-[68%] bg-brand" /><span aria-hidden="true" className="absolute bottom-0 right-0 h-[38%] w-[3px] bg-brand" />
    <div className="bg-ice p-6 sm:p-8">
      <h2 className="text-3xl font-semibold uppercase tracking-[.04em] text-brand md:text-4xl">{category.name}</h2>
      {category.beschreibung ? <p className="mt-3 leading-relaxed text-ink/70">{category.beschreibung}</p> : null}
      <div className="mt-8">{category.services.map((service) => <ServiceRow key={service.id} service={service} />)}</div>
    </div>
  </article>;
}

function ServiceRow({ service }: { service: PublicService }) {
  const details = service.details ?? [];
  const content = <><strong className="block text-lg font-semibold tracking-tight">{service.titel}</strong><span className="mt-1 block text-sm leading-relaxed text-ink/65">{service.beschreibung}</span></>;
  if (details.length === 0) return <div className="border-t border-mist-line py-5">{content}</div>;
  return <details className="group border-t border-mist-line"><summary className="flex cursor-pointer list-none items-start justify-between gap-5 py-5 marker:content-none"><span>{content}</span><span aria-hidden="true" className="pt-1 text-xl font-light text-ink/45"><span className="group-open:hidden">+</span><span className="hidden group-open:inline">−</span></span></summary><ul className="grid gap-x-5 gap-y-2 pb-5 text-sm leading-relaxed text-ink/70 sm:grid-cols-2">{details.map((detail) => <li className="border-l-[3px] border-brand/25 pl-4" key={detail}>{detail}</li>)}</ul></details>;
}
