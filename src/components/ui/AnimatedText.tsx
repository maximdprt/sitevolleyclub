"use client";

import { motion, type Variants } from "framer-motion";

const containerVariants: Variants = {
  hidden: {},
  visible: {
    transition: {
      delayChildren: 0.1,
      staggerChildren: 0.04,
    },
  },
};

const charVariants: Variants = {
  hidden: { y: 80, opacity: 0, rotateX: -40 },
  visible: {
    y: 0,
    opacity: 1,
    rotateX: 0,
    transition: { type: "spring", stiffness: 120, damping: 20 },
  },
};

export function AnimatedText({ text }: { text: string }) {
  const chars = text.split("");
  return (
    <motion.span variants={containerVariants} initial="hidden" animate="visible" aria-label={text}>
      {chars.map((char, i) => (
        <motion.span key={`${char}-${i}`} variants={charVariants} style={{ display: "inline-block" }}>
          {char === " " ? "\u00A0" : char}
        </motion.span>
      ))}
    </motion.span>
  );
}

