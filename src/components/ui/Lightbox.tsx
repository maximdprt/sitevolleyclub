"use client";

import { AnimatePresence, motion } from "framer-motion";
import Image from "next/image";
import { useEffect } from "react";
import { createPortal } from "react-dom";

export function Lightbox({
  images,
  open,
  index,
  onClose,
  onPrev,
  onNext,
}: {
  images: { src: string; alt: string }[];
  open: boolean;
  index: number;
  onClose: () => void;
  onPrev: () => void;
  onNext: () => void;
}) {
  useEffect(() => {
    if (!open) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowLeft") onPrev();
      if (e.key === "ArrowRight") onNext();
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [onClose, onNext, onPrev, open]);

  if (typeof document === "undefined") return null;

  return createPortal(
    <AnimatePresence>
      {open ? (
        <motion.div
          className="fixed inset-0 z-100 bg-black/95"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <button
            type="button"
            aria-label="Fermer"
            onClick={onClose}
            className="absolute right-5 top-5 rounded-full bg-white/10 px-4 py-2 font-ui text-xs tracking-[0.18em] text-white backdrop-blur hover:bg-white/15"
          >
            Fermer
          </button>

          <button
            type="button"
            aria-label="Précédent"
            onClick={onPrev}
            className="absolute left-5 top-1/2 -translate-y-1/2 rounded-full bg-white/10 px-4 py-2 font-ui text-xs tracking-[0.18em] text-white backdrop-blur hover:bg-white/15"
          >
            ←
          </button>
          <button
            type="button"
            aria-label="Suivant"
            onClick={onNext}
            className="absolute right-5 top-1/2 -translate-y-1/2 rounded-full bg-white/10 px-4 py-2 font-ui text-xs tracking-[0.18em] text-white backdrop-blur hover:bg-white/15"
          >
            →
          </button>

          <motion.div
            className="absolute inset-0 m-auto flex h-full w-full items-center justify-center px-6 py-16"
            initial={{ scale: 0.92, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.98, opacity: 0 }}
            transition={{ duration: 0.25, ease: "easeOut" }}
            onClick={onClose}
          >
            <div className="relative max-h-[80vh] w-full max-w-5xl" onClick={(e) => e.stopPropagation()}>
              <div className="relative aspect-video w-full overflow-hidden rounded-2xl bg-black">
                <Image
                  src={images[index]?.src ?? images[0]!.src}
                  alt={images[index]?.alt ?? images[0]!.alt}
                  fill
                  className="object-contain"
                  sizes="100vw"
                  priority
                />
              </div>
            </div>
          </motion.div>
        </motion.div>
      ) : null}
    </AnimatePresence>,
    document.body,
  );
}

