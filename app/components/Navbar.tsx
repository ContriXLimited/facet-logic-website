"use client";

import { useEffect, useState } from "react";

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 60);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${scrolled
        ? "bg-bg-primary/80 backdrop-blur-xl border-b border-border"
        : "bg-transparent"
        }`}
    >
      <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <img src="/logo.svg" alt="Facet Logic" className="w-12 h-12" />
          <span className="font-display text-xl tracking-wide text-text-primary">
            Facet<span className="italic">Logic</span>
          </span>
        </div>

        <div className="hidden md:flex items-center gap-8">
          <a
            href="#services"
            className="text-sm text-text-secondary hover:text-text-primary transition-colors"
          >
            Solutions
          </a>
          <a
            href="#clients"
            className="text-sm text-text-secondary hover:text-text-primary transition-colors"
          >
            Clients
          </a>
          <a
            href="mailto:business@facetlogic.com"
            className="text-sm px-5 py-2 rounded-full border border-accent/50 text-accent-light hover:bg-accent/10 transition-all"
          >
            Contact Us
          </a>
        </div>
      </div>
    </nav>
  );
}
