"use client";

import { motion, useInView } from "framer-motion";
import { useRef } from "react";

const clients = [
  "Protocol Alpha",
  "ChainVerse",
  "Nexus Finance",
  "Orbital Labs",
  "Quantum DEX",
  "Stellar Bridge",
  "Vortex DAO",
  "Apex Network",
  "Prism Exchange",
  "Lumen Capital",
];

function ClientLogo({ name }: { name: string }) {
  return (
    <div className="flex-shrink-0 w-48 h-20 mx-6 flex items-center justify-center rounded-xl border border-border bg-bg-card/30">
      <span className="font-body text-sm text-text-tertiary tracking-wide">
        {name}
      </span>
    </div>
  );
}

export default function ClientsSection() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-50px" });

  return (
    <section id="clients" ref={ref} className="relative py-24 overflow-hidden">
      <motion.div
        initial={{ opacity: 0 }}
        animate={inView ? { opacity: 1 } : {}}
        transition={{ duration: 0.8 }}
        className="text-center mb-12 px-6"
      >
        <p className="text-xs tracking-[0.3em] uppercase text-accent-light mb-4 font-body">
          Trusted Partners
        </p>
        <h2 className="font-display text-3xl md:text-4xl font-light">
          Projects We&apos;ve Worked With
        </h2>
      </motion.div>

      {/* Marquee */}
      <div className="relative">
        {/* Left fade */}
        <div className="absolute left-0 top-0 bottom-0 w-32 bg-gradient-to-r from-bg-primary to-transparent z-10" />
        {/* Right fade */}
        <div className="absolute right-0 top-0 bottom-0 w-32 bg-gradient-to-l from-bg-primary to-transparent z-10" />

        <div className="flex animate-marquee">
          {[...clients, ...clients].map((name, i) => (
            <ClientLogo key={`${name}-${i}`} name={name} />
          ))}
        </div>
      </div>
    </section>
  );
}
