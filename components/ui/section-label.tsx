export function SectionLabel({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return <p className={`mb-4 text-xs font-bold tracking-[.18em] text-brand ${className}`}>{children}</p>;
}
