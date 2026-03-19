"use client";

import { motion, type MotionProps } from "framer-motion";

type ScrollRevealProps = MotionProps & {
  children: React.ReactNode;
  delay?: number;
  className?: string;
};

export function ScrollReveal({ children, delay = 0, className, ...rest }: ScrollRevealProps) {
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.15 }}
      transition={{ duration: 0.7, ease: "easeOut", delay }}
      {...rest}
    >
      {children}
    </motion.div>
  );
}

