"use client";

import { motion, useInView } from "framer-motion";
import { useRef } from "react";

export default function FooterSection() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-50px" });

  return (
    <footer ref={ref} className="relative bg-[#d2baf5] text-[#1a0a2e] overflow-hidden">
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
              href="mailto:business@facetlogic.com"
              className="hover:text-[#1a0a2e]/70 transition-colors"
            >
              business@facetlogic.com
            </a>
          </div>

          {/* Social icons */}
          <div className="flex items-center gap-5">
            <a href="#" className="text-[#1a0a2e]/30 hover:text-[#1a0a2e]/70 transition-colors">
              <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
              </svg>
            </a>
            <a href="#" className="text-[#1a0a2e]/30 hover:text-[#1a0a2e]/70 transition-colors">
              <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                <path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z" />
              </svg>
            </a>
            <a href="mailto:business@facetlogic.com" className="text-[#1a0a2e]/30 hover:text-[#1a0a2e]/70 transition-colors">
              <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5}>
                <path d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
