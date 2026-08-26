"use client";

import Image from "next/image";
import { useEffect, useState } from "react";

type ImageItem = { id: string; bildReferenz: string; altText: string | null };
const imageAlt = (image: ImageItem, title: string) => image.altText?.trim() || `${title} – Bild`;

export function SaleGallery({ images, title }: { images: ImageItem[]; title: string }) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [touchStart, setTouchStart] = useState<number | null>(null);
  const activeImage = images[activeIndex] ?? images[0];
  const hasMultiple = images.length > 1;
  const select = (index: number) => setActiveIndex((index + images.length) % images.length);
  const move = (offset: number) => setActiveIndex((current) => (current + offset + images.length) % images.length);

  useEffect(() => {
    if (!lightboxOpen) return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setLightboxOpen(false);
      if (event.key === "ArrowLeft") setActiveIndex((current) => (current - 1 + images.length) % images.length);
      if (event.key === "ArrowRight") setActiveIndex((current) => (current + 1) % images.length);
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [lightboxOpen, images.length]);

  if (!activeImage) return null;
  const onTouchEnd = (event: React.TouchEvent<HTMLDivElement>) => {
    if (touchStart === null) return;
    const delta = event.changedTouches[0].clientX - touchStart;
    if (Math.abs(delta) > 45) {
      if (delta < 0) move(1);
      else move(-1);
    }
    setTouchStart(null);
  };
  return <><section aria-label={`Bilder von ${title}`} className="mt-8"><div className="relative flex h-[min(56vh,28rem)] items-center justify-center overflow-hidden rounded-[.2rem] border border-mist-line bg-ice sm:h-[min(65vh,38rem)] lg:h-[min(70vh,44rem)]" onTouchEnd={onTouchEnd} onTouchStart={(event) => setTouchStart(event.touches[0].clientX)}><button aria-label={`${imageAlt(activeImage, title)} vergrößern`} className="relative h-full w-full cursor-zoom-in focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-[-4px] focus-visible:outline-brand" onClick={() => setLightboxOpen(true)} type="button"><Image alt={imageAlt(activeImage, title)} className="object-contain p-2 sm:p-4" fill priority={activeIndex === 0} sizes="(max-width: 767px) calc(100vw - 2.5rem), (max-width: 1023px) calc(100vw - 5rem), min(88rem, 100vw)" src={activeImage.bildReferenz} /></button><span aria-live="polite" className="absolute bottom-3 right-3 rounded-[.2rem] bg-ink/80 px-3 py-1.5 text-sm font-bold text-ice">{activeIndex + 1} / {images.length}</span>{hasMultiple ? <><GalleryButton direction="previous" onClick={() => move(-1)} /><GalleryButton direction="next" onClick={() => move(1)} /></> : null}</div>{hasMultiple ? <div aria-label="Bildauswahl" className="mt-3 flex max-w-full gap-3 overflow-x-auto pb-2"><div className="flex min-w-max gap-3">{images.map((image, index) => <button aria-current={index === activeIndex ? "true" : undefined} aria-label={`Bild ${index + 1} von ${images.length} anzeigen`} className={`relative h-20 w-20 shrink-0 overflow-hidden rounded-[.2rem] border bg-ice focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand sm:h-24 sm:w-24 ${index === activeIndex ? "border-brand ring-2 ring-brand/30" : "border-mist-line hover:border-brand"}`} key={image.id} onClick={() => select(index)} type="button"><Image alt="" className="object-contain p-1" fill sizes="96px" src={image.bildReferenz} /></button>)}</div></div> : null}</section>{lightboxOpen ? <div aria-label="Große Bildansicht" aria-modal="true" className="fixed inset-0 z-[70] flex items-center justify-center bg-ink/90 p-4 sm:p-8" role="dialog"><button aria-label="Bildansicht schließen" className="absolute right-4 top-4 z-10 min-h-12 rounded-[.2rem] border border-ice px-4 text-sm font-bold text-ice focus-visible:outline focus-visible:outline-2 focus-visible:outline-sky sm:right-6 sm:top-6" onClick={() => setLightboxOpen(false)} type="button">Schließen</button><div className="relative h-[min(78vh,58rem)] w-full max-w-[80rem]"><Image alt={imageAlt(activeImage, title)} className="object-contain" fill sizes="100vw" src={activeImage.bildReferenz} /></div><span aria-live="polite" className="absolute bottom-5 rounded-[.2rem] bg-ice px-3 py-1.5 text-sm font-bold text-ink">{activeIndex + 1} / {images.length}</span>{hasMultiple ? <><GalleryButton direction="previous" lightbox onClick={() => move(-1)} /><GalleryButton direction="next" lightbox onClick={() => move(1)} /></> : null}</div> : null}</>;
}
function GalleryButton({ direction, lightbox = false, onClick }: { direction: "previous" | "next"; lightbox?: boolean; onClick: () => void }) { const previous = direction === "previous"; return <button aria-label={previous ? "Vorheriges Bild" : "Nächstes Bild"} className={`absolute top-1/2 z-10 grid h-12 w-12 -translate-y-1/2 place-items-center rounded-[.2rem] border text-xl font-bold transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 ${previous ? "left-3 sm:left-5" : "right-3 sm:right-5"} ${lightbox ? "border-ice bg-ink/70 text-ice hover:bg-ink" : "border-brand bg-ice/90 text-brand hover:bg-brand hover:text-ice"}`} onClick={onClick} type="button">{previous ? "←" : "→"}</button>; }
