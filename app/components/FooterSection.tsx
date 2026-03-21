"use client";

import { motion, useInView } from "framer-motion";
import { useRef } from "react";

export default function FooterSection() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-50px" });

  return (
    <footer ref={ref} className="relative py-24 px-6">
      {/* Divider */}
      <div className="max-w-5xl mx-auto mb-20">
        <div className="h-px bg-gradient-to-r from-transparent via-border to-transparent" />
      </div>

      {/* CTA */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={inView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.8 }}
        className="text-center mb-20"
      >
        <h2 className="font-display text-4xl md:text-6xl font-light mb-6">
          Let&apos;s build together.
        </h2>
        <p className="font-body text-text-secondary mb-8 max-w-md mx-auto">
          Reach out to explore how Facet Logic can accelerate your project.
        </p>
        <a
          href="mailto:business@facetlogic.com"
          className="inline-block px-10 py-4 rounded-full bg-accent text-white text-sm font-medium hover:bg-accent-light transition-colors"
        >
          business@facetlogic.com
        </a>
      </motion.div>

      {/* Bottom */}
      <div className="max-w-5xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6 text-text-tertiary text-xs font-body">
        <div className="flex items-center gap-3">
          <img src="/logo.svg" alt="" className="w-5 h-5 opacity-50" />
          <span>&copy; 2026 Facet Logic</span>
        </div>
        <div className="flex items-center gap-6">
          <a href="#" className="hover:text-text-secondary transition-colors">
            Twitter / X
          </a>
          <a href="#" className="hover:text-text-secondary transition-colors">
            Telegram
          </a>
          <a
            href="mailto:business@facetlogic.com"
            className="hover:text-text-secondary transition-colors"
          >
            Email
          </a>
        </div>
      </div>
    </footer>
  );
}
