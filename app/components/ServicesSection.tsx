"use client";

import { motion, useInView } from "framer-motion";
import { useRef } from "react";

const services = [
  {
    title: "OpenWhale Framework",
    desc: "A production-ready trading agent framework that reduces execution cost and decision latency.",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} className="w-6 h-6">
        <path d="M3 17l4-4 4 4 4-8 4 4h2" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
  },
  {
    title: "White-labeled Volume Growth Engine",
    desc: "Increase PerpDex daily volume, user engagement, and retention through coordinated agent execution and strategy orchestration.",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} className="w-6 h-6">
        <path d="M12 2L2 7l10 5 10-5-10-5z" />
        <path d="M2 17l10 5 10-5" />
        <path d="M2 12l10 5 10-5" />
      </svg>
    ),
  },
];

const clients = [
  { name: "0G", logo: "/clients/0g.svg" },
  { name: "HackQuest", logo: "/clients/hackquest.svg" },
  { name: "amber.ac", logo: "/clients/amber.svg" },
];

export default function ServicesSection() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section
      id="services"
      ref={ref}
      className="relative bg-bg-card min-h-screen h-[calc(140vh)] lg:h-[calc(100vh-40px)] flex flex-col justify-evenly py-10 md:py-14 snap-start"
    >
      {/* Header */}
      <div className="text-center px-6">
        <motion.p
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 1 } : {}}
          transition={{ duration: 0.6 }}
          className="text-xs tracking-[0.3em] uppercase text-accent-light mb-3 font-body"
        >
          What We Do
        </motion.p>
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, delay: 0.1 }}
          className="font-display text-3xl md:text-4xl font-light"
        >
          One input. Multiple outcomes.
        </motion.h2>
      </div>

      {/* Cards */}
      <div className="max-w-5xl mx-auto px-6 w-full">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-3xl mx-auto">
          {services.map((s, i) => (
            <motion.div
              key={s.title}
              initial={{ opacity: 0, y: 30 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: 0.2 + i * 0.1 }}
              className="group relative p-5 rounded-xl border border-white/5 bg-white/[0.03] hover:border-accent/20 hover:bg-white/[0.06] transition-all duration-500"
            >
              <div className="w-8 h-8 rounded-lg bg-accent/10 flex items-center justify-center text-accent-light mb-3 group-hover:bg-accent/20 transition-colors">
                {s.icon}
              </div>
              <h3 className="font-display text-base mb-1 text-text-primary">
                {s.title}
              </h3>
              <p className="font-body text-xs text-text-secondary leading-relaxed">
                {s.desc}
              </p>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Clients & Partners */}
      <div>
        <motion.div
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 1 } : {}}
          transition={{ duration: 0.8, delay: 0.5 }}
        >
          <p className="text-xs tracking-[0.3em] uppercase text-accent-light mb-5 text-center font-body">
            Clients &amp; Partners
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 1 } : {}}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="flex items-center justify-center gap-8 md:gap-14 px-6"
        >
          {clients.map((c, i) => (
            <motion.div
              key={c.name}
              initial={{ opacity: 0, y: 10 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: 0.6 + i * 0.1 }}
              className="flex items-center justify-center h-12 md:h-14"
            >
              <img
                src={c.logo}
                alt={c.name}
                className="h-8 md:h-10 w-auto object-contain opacity-50 hover:opacity-80 transition-opacity"
                style={{ filter: "brightness(0) invert(1)" }}
              />
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
