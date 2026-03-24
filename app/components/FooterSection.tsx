"use client";

import { motion, useInView } from "framer-motion";
import { useRef } from "react";

export default function FooterSection() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-50px" });

  return (
    <footer ref={ref} className="relative bg-[#d2baf5] text-[#1a0a2e] overflow-hidden snap-start">
      {/* Large brand name */}
      <div className="relative min-h-[60vh] flex items-center justify-center px-6">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 1 }}
          className="text-center relative z-10"
        >
          <h2 className="font-display text-[12vw] md:text-[10vw] leading-[0.85] font-light tracking-tight relative inline-block">
            Facet<span className="italic">Logic</span>
            {/* Logo mark - top right of text */}
            <img
              src="/logo.svg"
              alt=""
              className="absolute -top-[3vw] -right-[8vw] md:-right-[5vw] w-[6vw] h-[6vw] min-w-[28px] min-h-[28px] max-w-[70px] max-h-[70px] opacity-90"
              style={{ filter: "brightness(0)" }}
            />
          </h2>
        </motion.div>
      </div>

      {/* Bottom bar */}
      <div className="relative z-10 border-t border-[#1a0a2e]/10">
        <div className="max-w-7xl mx-auto px-6 py-6 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-6 text-xs text-[#1a0a2e]/40">
            <span>&copy; 2026 Facet Logic</span>
            <a
              href="mailto:Info@facetlogic.tech"
              className="hover:text-[#1a0a2e]/70 transition-colors"
            >
              Info@facetlogic.tech
            </a>
          </div>

          <a href="mailto:Info@facetlogic.tech" className="text-[#1a0a2e]/30 hover:text-[#1a0a2e]/70 transition-colors">
            <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5}>
              <path d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </a>
        </div>
      </div>
    </footer>
  );
}
