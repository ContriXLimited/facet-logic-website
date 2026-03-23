"use client";

import { motion } from "framer-motion";

const fadeUp = (delay: number) => ({
  initial: { opacity: 0, y: 30 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.8, delay, ease: [0.25, 0.4, 0.25, 1] as const },
});

export default function HeroSection() {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden snap-start">
      {/* Removed blobs - purple bg + black overlay provides the atmosphere */}

      {/* Subtle grid */}
      <div
        className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage:
            "radial-gradient(circle, rgba(255,255,255,0.8) 1px, transparent 1px)",
          backgroundSize: "40px 40px",
        }}
      />

      {/* Content */}
      <div className="relative z-10 text-center px-6 max-w-4xl mx-auto">
        <motion.div {...fadeUp(0)} className="mb-8">
          <img
            src="/logo.svg"
            alt=""
            className="w-20 h-20 md:w-36 md:h-36 mx-auto opacity-80"
          />
        </motion.div>

        <motion.p
          {...fadeUp(0.1)}
          className="text-xs tracking-[0.3em] uppercase text-accent-light mb-6 font-body"
        >
          Enterprise Solutions
        </motion.p>

        <motion.h1
          {...fadeUp(0.2)}
          className="font-display text-5xl md:text-8xl lg:text-9xl font-light text-text-primary leading-[0.9] mb-6"
        >
          Facet<span className="italic">Logic</span>
        </motion.h1>

        <motion.p
          {...fadeUp(0.3)}
          className="font-display text-xl md:text-2xl italic text-text-secondary mb-8"
        >
          Decompose complexity. Deliver clarity.
        </motion.p>

        <motion.p
          {...fadeUp(0.4)}
          className="font-body text-sm md:text-base text-text-secondary max-w-xl mx-auto mb-10 leading-relaxed"
        >
          Strategic infrastructure and liquidity solutions for token projects.
          We turn market complexity into sustainable growth.
        </motion.p>

        <motion.div
          {...fadeUp(0.5)}
          className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4"
        >
          <a
            href="mailto:business@facetlogic.com"
            className="px-8 py-3 rounded-full bg-accent text-white text-sm font-medium hover:bg-accent-light transition-colors"
          >
            Get Started
          </a>
          <a
            href="#services"
            className="px-8 py-3 rounded-full border border-white/15 text-text-secondary text-sm hover:border-white/30 hover:text-text-primary transition-all"
          >
            Learn More
          </a>
        </motion.div>
      </div>

      {/* Bottom fade */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-bg-primary to-transparent" />
    </section>
  );
}
