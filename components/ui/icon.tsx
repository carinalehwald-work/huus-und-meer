type IconName = "phone" | "mail" | "clock" | "ticket" | "instagram" | "facebook" | "tiktok" | "menu" | "close" | "chevron" | "arrow" | "pin" | "users" | "bed" | "anchor" | "check" | "ship" | "send" | "shield";

export function Icon({ name, className = "" }: { name: IconName; className?: string }) {
  const paths: Record<IconName, React.ReactNode> = {
    phone: <path d="M5 3h3l2 5-2 1.5a14 14 0 0 0 6.5 6.5L16 14l5 2v3c0 1-1 2-2 2C10.2 21 3 13.8 3 5c0-1 .9-2 2-2Z" />,
    mail: <><rect x="3" y="5" width="18" height="14" rx="2" /><path d="m4 7 8 6 8-6" /></>, clock: <><circle cx="12" cy="12" r="9" /><path d="M12 7v5l3 2" /></>, ticket: <path d="M4 7a2 2 0 0 0 0 4v2a2 2 0 0 0 0 4v1h16v-1a2 2 0 0 0 0-4v-2a2 2 0 0 0 0-4V6H4v1Zm7 2v6" />,
    instagram: <><rect x="3" y="3" width="18" height="18" rx="5" /><circle cx="12" cy="12" r="4" /><path d="M17.5 6.5h.01" /></>, facebook: <path d="M14 21v-8h3l.5-3H14V8.5c0-.9.3-1.5 1.7-1.5H18V4.3c-.4-.1-1.3-.3-2.5-.3-2.5 0-4.2 1.5-4.2 4.4V10H8v3h3.3v8H14Z" />, tiktok: <path d="M14 4v9.2a3.8 3.8 0 1 1-3-3.7V7.2A6 6 0 1 0 16 13V9.5c1 .9 2.3 1.5 4 1.5V8.3c-2.1 0-4-1.7-4-4.3H14Z" />,
    menu: <path d="M4 7h16M4 12h16M4 17h16" />, close: <path d="m6 6 12 12M18 6 6 18" />, chevron: <path d="m7 10 5 5 5-5" />, arrow: <path d="M5 12h14m-6-6 6 6-6 6" />, pin: <><path d="M20 10c0 5-8 11-8 11S4 15 4 10a8 8 0 1 1 16 0Z" /><circle cx="12" cy="10" r="2.5" /></>,
    users: <><circle cx="9" cy="8" r="3" /><path d="M3 20c0-3.2 2.7-5 6-5s6 1.8 6 5M16 5.5a3 3 0 0 1 0 5.8M18 15c2 0 3 1 3 3" /></>, bed: <><path d="M3 18v-7h18v7M3 15h18M6 11V8h5v3" /><path d="M5 18v2m14-2v2" /></>, anchor: <><circle cx="12" cy="5" r="2" /><path d="M12 7v13m-7-6a7 7 0 0 0 14 0M5 14H2m20 0h-3" /></>, check: <path d="m5 12 4 4L19 6" />, ship: <><path d="M4 15h16l-2 4H6l-2-4Z" /><path d="M12 5v10M12 5 7 9m5-4 5 4M3 21c2 1 4 1 6 0 2 1 4 1 6 0 2 1 4 1 6 0" /></>, send: <path d="m3 4 18 8-18 8 3-8-3-8Zm3 8h15" />,
    shield: <><path d="M12 3 19 6v5c0 4.6-3 8.1-7 10-4-1.9-7-5.4-7-10V6l7-3Z" /><path d="m9 12 2 2 4-4" /></>,
  };
  return <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" className={className}>{paths[name]}</svg>;
}
