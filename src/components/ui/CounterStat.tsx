"use client";

import { useEffect, useRef, useState } from "react";
import { useInView } from "framer-motion";

function easeOutQuart(t: number) {
  return 1 - Math.pow(1 - t, 4);
}

function prefersReducedMotion() {
  if (typeof window === "undefined") return false;
  return window.matchMedia?.("(prefers-reduced-motion: reduce)")?.matches ?? false;
}

export function CounterStat({
  value,
  suffix,
  duration = 2000,
}: {
  value: number;
  suffix?: string;
  duration?: number;
}) {
  const ref = useRef<HTMLSpanElement | null>(null);
  // Trigger earlier to avoid “stuck at 0” on short viewports / fast scroll.
  const inView = useInView(ref, { once: true, amount: 0.25, margin: "0px 0px -15% 0px" });
  const [display, setDisplay] = useState(0);

  useEffect(() => {
    if (prefersReducedMotion()) {
      setDisplay(value);
      return;
    }

    // Fallback: if IntersectionObserver is unavailable, render the final value.
    if (typeof window !== "undefined" && !("IntersectionObserver" in window)) {
      setDisplay(value);
      return;
    }

    if (!inView) return;
    let rafId = 0;
    const start = performance.now();
    const tick = (now: number) => {
      const progress = Math.min((now - start) / duration, 1);
      setDisplay(Math.round(easeOutQuart(progress) * value));
      if (progress < 1) rafId = requestAnimationFrame(tick);
    };
    rafId = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafId);
  }, [duration, inView, value]);

  return (
    <span ref={ref} className="font-display text-6xl leading-none text-accent md:text-7xl">
      {display}
      {suffix}
    </span>
  );
}

