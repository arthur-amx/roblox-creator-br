"use client";

import { motion, AnimatePresence } from "framer-motion";
import { Zap, Menu, X } from "lucide-react";
import { useState, useEffect } from "react";

const LINKS = [
  { href: "#como-funciona", label: "Como funciona" },
  { href: "#galeria", label: "Galeria" },
  { href: "#calculadora", label: "Simulador" },
  { href: "#precos", label: "Preços" },
];

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  function close() {
    setOpen(false);
  }

  return (
    <>
      <motion.nav
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className={`fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-6 py-4 backdrop-blur-md border-b transition-colors duration-300 ${
          scrolled ? "border-white/10 bg-surface/80" : "border-white/5 bg-surface/60"
        }`}
      >
        <a href="#hero" className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-brand-purple to-brand-blue flex items-center justify-center">
            <Zap className="w-4 h-4 text-white" fill="white" />
          </div>
          <span className="font-bold text-white tracking-tight">
            Creator<span className="gradient-text">BR</span>
          </span>
        </a>

        <div className="hidden md:flex items-center gap-8 text-sm text-white/60">
          {LINKS.map((l) => (
            <a key={l.href} href={l.href} className="hover:text-white transition-colors">
              {l.label}
            </a>
          ))}
        </div>

        <div className="flex items-center gap-3">
          <a
            href="#waitlist"
            className="hidden md:inline-flex px-4 py-2 rounded-lg bg-brand-purple/20 border border-brand-purple/40 text-brand-purple-light text-sm font-medium hover:bg-brand-purple/30 transition-all duration-200"
          >
            Entrar na lista
          </a>

          <button
            onClick={() => setOpen((v) => !v)}
            className="md:hidden flex items-center justify-center w-9 h-9 rounded-lg border border-white/10 bg-white/5 text-white/70 hover:text-white hover:border-white/20 transition-all"
            aria-label="Menu"
          >
            {open ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
          </button>
        </div>
      </motion.nav>

      {/* Mobile drawer */}
      <AnimatePresence>
        {open && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm md:hidden"
              onClick={close}
            />
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 30, stiffness: 300 }}
              className="fixed top-0 right-0 bottom-0 z-50 w-72 bg-surface border-l border-white/8 flex flex-col md:hidden"
            >
              <div className="flex items-center justify-between px-6 py-4 border-b border-white/8">
                <span className="font-bold text-white tracking-tight">
                  Creator<span className="gradient-text">BR</span>
                </span>
                <button
                  onClick={close}
                  className="flex items-center justify-center w-8 h-8 rounded-lg border border-white/10 text-white/60 hover:text-white"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <nav className="flex flex-col gap-1 p-4 flex-1">
                {LINKS.map((l) => (
                  <a
                    key={l.href}
                    href={l.href}
                    onClick={close}
                    className="px-4 py-3 rounded-xl text-white/70 font-medium hover:text-white hover:bg-white/5 transition-all duration-200"
                  >
                    {l.label}
                  </a>
                ))}
              </nav>

              <div className="p-4 border-t border-white/8">
                <a
                  href="#waitlist"
                  onClick={close}
                  className="block text-center px-6 py-3.5 rounded-xl bg-gradient-to-r from-brand-purple to-brand-blue text-white font-semibold text-sm hover:opacity-90 transition-all duration-200 glow-purple-sm"
                >
                  Entrar na lista de espera
                </a>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
