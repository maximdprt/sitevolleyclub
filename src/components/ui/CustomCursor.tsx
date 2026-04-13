"use client";

import { useEffect, useRef, useState } from "react";

export function CustomCursor() {
  const mainRef = useRef<HTMLDivElement | null>(null);
  const trailRef = useRef<HTMLDivElement | null>(null);
  const [enabled] = useState(() => {
    if (typeof window === "undefined") return false;
    const coarse = window.matchMedia?.("(pointer: coarse)")?.matches ?? false;
    return !coarse;
  });

  useEffect(() => {
    if (!enabled) return;

    const pos = { x: window.innerWidth / 2, y: window.innerHeight / 2 };
    const trail = { x: pos.x, y: pos.y };
    let rafId = 0;
    let hovering = false;

    const updateHoverState = (target: EventTarget | null) => {
      const el = target as HTMLElement | null;
      hovering =
        !!el &&
        (!!el.closest?.("a,button,[data-cursor='hover']") ||
          el.getAttribute?.("data-cursor") === "hover");
      mainRef.current?.setAttribute("data-hover", hovering ? "true" : "false");
      trailRef.current?.setAttribute("data-hover", hovering ? "true" : "false");
    };

    const onMove = (e: MouseEvent) => {
      pos.x = e.clientX;
      pos.y = e.clientY;
      updateHoverState(e.target);
      if (mainRef.current) mainRef.current.style.transform = `translate3d(${pos.x}px, ${pos.y}px, 0)`;
    };

    const tick = () => {
      trail.x += (pos.x - trail.x) * 0.12;
      trail.y += (pos.y - trail.y) * 0.12;
      if (trailRef.current) trailRef.current.style.transform = `translate3d(${trail.x}px, ${trail.y}px, 0)`;
      rafId = requestAnimationFrame(tick);
    };

    window.addEventListener("mousemove", onMove, { passive: true });
    rafId = requestAnimationFrame(tick);

    return () => {
      window.removeEventListener("mousemove", onMove);
      cancelAnimationFrame(rafId);
    };
  }, [enabled]);

  if (!enabled) return null;

  return (
    <>
      <div
        ref={trailRef}
        className="pointer-events-none fixed left-0 top-0 z-9998 h-1 w-1 -translate-x-1/2 -translate-y-1/2 rounded-full bg-accent opacity-90 transition-[width,height,opacity] duration-200 mix-blend-difference data-[hover=true]:h-3 data-[hover=true]:w-3"
      />
      <div
        ref={mainRef}
        className="pointer-events-none fixed left-0 top-0 z-9999 h-3 w-3 -translate-x-1/2 -translate-y-1/2 rounded-full border border-accent bg-transparent opacity-90 transition-[width,height,opacity] duration-200 mix-blend-difference data-[hover=true]:h-10 data-[hover=true]:w-10"
      />
    </>
  );
}

