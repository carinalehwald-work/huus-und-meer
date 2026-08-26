"use client";

import { MouseEvent, useEffect, useState } from "react";
import { Icon } from "@/components/ui/icon";

const sectionTargets = [
  { id: "hero", label: "Seitenanfang" },
  { id: "gaeste", label: "Für Urlauber/innen" },
  { id: "eigentuemer", label: "Für Eigentümer/innen" },
  { id: "mehr-von-huus-und-meer", label: "Kontakt und Jobs" },
  { id: "footer", label: "Footer" },
] as const;

function detectCurrentSection() {
  if (window.scrollY < 450) return -1;

  const sectionTopThreshold = Math.min(140, window.innerHeight * 0.2);
  let currentIndex = 0;

  sectionTargets.slice(0, -1).forEach(({ id }, index) => {
    const section = document.getElementById(id);
    if (section && section.getBoundingClientRect().top <= sectionTopThreshold) currentIndex = index;
  });

  const footer = document.getElementById("footer");
  if (footer && footer.getBoundingClientRect().top <= window.innerHeight * 0.6) currentIndex = sectionTargets.length - 1;

  return currentIndex;
}

export function SectionBackButton() {
  const [currentIndex, setCurrentIndex] = useState(-1);
  const isVisible = currentIndex > 0;
  const previousSection = sectionTargets[Math.max(0, currentIndex - 1)];

  useEffect(() => {
    let animationFrame = 0;

    function updateCurrentSection() {
      window.cancelAnimationFrame(animationFrame);
      animationFrame = window.requestAnimationFrame(() => setCurrentIndex(detectCurrentSection()));
    }

    updateCurrentSection();
    window.addEventListener("scroll", updateCurrentSection, { passive: true });
    window.addEventListener("resize", updateCurrentSection);

    return () => {
      window.cancelAnimationFrame(animationFrame);
      window.removeEventListener("scroll", updateCurrentSection);
      window.removeEventListener("resize", updateCurrentSection);
    };
  }, []);

  function scrollToPreviousSection(event: MouseEvent<HTMLAnchorElement>) {
    const target = document.getElementById(previousSection.id);
    if (!target) return;

    event.preventDefault();
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    target.scrollIntoView({ behavior: reduceMotion ? "auto" : "smooth", block: "start" });
  }

  return <a
    href={`#${previousSection.id}`}
    onClick={scrollToPreviousSection}
    aria-label={`Zurück zu ${previousSection.label}`}
    aria-hidden={!isVisible}
    tabIndex={isVisible ? 0 : -1}
    title={`Zurück zu ${previousSection.label}`}
    className={`group fixed bottom-[calc(1rem+env(safe-area-inset-bottom))] right-[calc(1rem+env(safe-area-inset-right))] z-[60] grid h-11 w-11 place-items-center rounded-[0.2rem] border border-brand bg-brand text-ice outline outline-1 outline-offset-[3px] outline-brand/55 shadow-[0_3px_10px_color-mix(in_srgb,var(--color-brand)_16%,transparent)] transition-[background-color,color,box-shadow,opacity,transform] duration-200 ease-out hover:-translate-y-0.5 hover:bg-ice hover:text-ink hover:shadow-[0_6px_14px_color-mix(in_srgb,var(--color-brand)_20%,transparent)] active:translate-y-px active:shadow-none focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-ink motion-reduce:transition-none sm:bottom-[calc(1.5rem+env(safe-area-inset-bottom))] sm:right-[calc(1.5rem+env(safe-area-inset-right))] sm:h-12 sm:w-12 ${isVisible ? "translate-y-0 opacity-100" : "pointer-events-none translate-y-2 opacity-0"}`}
  >
    <Icon name="arrow" className="h-4 w-4 -rotate-90 transition-transform duration-150 ease-out group-hover:-translate-y-0.5 motion-reduce:transition-none" />
  </a>;
}
