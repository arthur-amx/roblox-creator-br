"use client";

import { motion } from "framer-motion";
import { ArrowRight, Sparkles } from "lucide-react";
import { useEffect, useState } from "react";

const PROMPTS = [
  "jaqueta streetwear roxa com raios elétricos",
  "armadura de cavaleiro neon azul",
  "uniforme de astronauta dourado",
  "capa de mago das sombras",
  "hoodie cyberpunk com led azul",
  "traje de samurai vermelho sangue",
];

function TypewriterPrompt() {
  const [index, setIndex] = useState(0);
  const [displayed, setDisplayed] = useState("");
  const [phase, setPhase] = useState<"typing" | "waiting" | "deleting">("typing");

  useEffect(() => {
    const current = PROMPTS[index];
    if (phase === "typing") {
      if (displayed.length < current.length) {
        const t = setTimeout(() => setDisplayed(current.slice(0, displayed.length + 1)), 42);
        return () => clearTimeout(t);
      }
      const t = setTimeout(() => setPhase("waiting"), 2000);
      return () => clearTimeout(t);
    }
    if (phase === "waiting") {
      const t = setTimeout(() => setPhase("deleting"), 400);
      return () => clearTimeout(t);
    }
    if (phase === "deleting") {
      if (displayed.length > 0) {
        const t = setTimeout(() => setDisplayed((d) => d.slice(0, -1)), 18);
        return () => clearTimeout(t);
      }
      setIndex((i) => (i + 1) % PROMPTS.length);
      setPhase("typing");
    }
  }, [displayed, phase, index]);

  return (
    <span className="text-white font-medium">
      &quot;{displayed}<span className="inline-block w-0.5 h-4 bg-brand-purple-light ml-px animate-pulse align-middle" />&quot;
    </span>
  );
}

/* Mini animated skin card */
function SkinPreview() {
  const skins = [
    { from: "#7c3aed", to: "#ec4899", label: "Streetwear roxa" },
    { from: "#1d4ed8", to: "#06b6d4", label: "Cavaleiro neon" },
    { from: "#b45309", to: "#fbbf24", label: "Astronauta dourado" },
  ];
  const [active, setActive] = useState(0);

  useEffect(() => {
    const t = setInterval(() => setActive((a) => (a + 1) % skins.length), 2800);
    return () => clearInterval(t);
  }, [skins.length]);

  const s = skins[active];
  return (
    <div className="relative w-28 h-36 rounded-2xl overflow-hidden flex items-center justify-center animate-float"
      style={{ background: `linear-gradient(135deg, ${s.from}, ${s.to})` }}>
      <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
      {/* Simple shirt SVG */}
      <svg viewBox="0 0 80 70" className="w-16 h-14 relative z-10 drop-shadow-lg" xmlns="http://www.w3.org/2000/svg">
        <path d="M22,12 L8,28 L16,32 L16,62 L64,62 L64,32 L72,28 L58,12 L50,20 Q40,6 30,20 Z"
          fill="white" fillOpacity="0.25" />
        <path d="M30,20 Q40,12 50,20 L46,34 Q40,28 34,34 Z" fill="white" fillOpacity="0.4" />
      </svg>
      <div className="absolute bottom-2 left-0 right-0 text-center">
        <span className="text-white/70 text-[10px] font-mono">{s.label}</span>
      </div>
    </div>
  );
}

export default function Hero() {
  return (
    <section id="hero" className="relative min-h-screen flex items-center justify-center overflow-hidden pt-16">
      {/* Animated mesh background */}
      <div className="absolute inset-0 bg-gradient-mesh" />
      <div className="absolute inset-0">
        <motion.div
          animate={{ scale: [1, 1.15, 1], opacity: [0.2, 0.3, 0.2] }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-brand-purple/25 rounded-full blur-3xl"
        />
        <motion.div
          animate={{ scale: [1, 1.2, 1], opacity: [0.15, 0.25, 0.15] }}
          transition={{ duration: 10, repeat: Infinity, ease: "easeInOut", delay: 2 }}
          className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-brand-blue/20 rounded-full blur-3xl"
        />
      </div>

      {/* Fine grid */}
      <div
        className="absolute inset-0 opacity-[0.025]"
        style={{
          backgroundImage: "linear-gradient(rgba(255,255,255,1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,1) 1px, transparent 1px)",
          backgroundSize: "48px 48px",
        }}
      />

      <div className="relative z-10 max-w-6xl mx-auto px-6 text-center">

        {/* Badge */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-brand-purple/30 bg-brand-purple/10 text-brand-purple-light text-xs font-semibold tracking-widest uppercase mb-10"
        >
          <Sparkles className="w-3 h-3" />
          Geração de skins com IA · Exclusivo Brasil · Acesso antecipado
        </motion.div>

        {/* Headline */}
        <motion.h1
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
          className="text-[clamp(3rem,9vw,7rem)] font-black tracking-tight leading-[0.88] mb-8 text-balance"
        >
          Escreva um prompt.
          <br />
          <span className="gradient-text">Ganhe Robux.</span>
          <br />
          100% seus.
        </motion.h1>

        {/* Subheadline */}
        <motion.p
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.25 }}
          className="text-lg md:text-xl text-white/55 max-w-xl mx-auto mb-10 leading-relaxed"
        >
          Nossa IA transforma qualquer prompt em português numa skin no padrão Roblox.
          Baixe e publique você mesmo — ficando com <strong className="text-white">100% dos royalties</strong> —
          ou deixa a gente publicar automático.
        </motion.p>

        {/* CTAs */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.35 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-3 mb-14"
        >
          <a
            href="#waitlist"
            className="group flex items-center gap-2.5 px-8 py-4 rounded-xl bg-gradient-to-r from-brand-purple to-brand-blue text-white font-bold text-base hover:opacity-90 transition-all duration-200 glow-purple-sm hover:glow-purple"
          >
            Gerar minha primeira skin
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </a>
          <a
            href="#como-funciona"
            className="flex items-center gap-2 px-8 py-4 rounded-xl border border-white/10 text-white/60 font-medium text-base hover:text-white hover:border-white/20 transition-all duration-200"
          >
            Ver como funciona ↓
          </a>
        </motion.div>

        {/* Trust row */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.45 }}
          className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2 mb-20 text-xs text-white/35"
        >
          <span>🇧🇷 2º maior mercado Roblox do mundo</span>
          <span className="hidden sm:inline text-white/15">·</span>
          <span>💰 US$ 330M em UGC fashion em 2025</span>
          <span className="hidden sm:inline text-white/15">·</span>
          <span>⚡ Zero concorrentes no Brasil</span>
          <span className="hidden sm:inline text-white/15">·</span>
          <span>🎁 3 tokens grátis por dia</span>
          <span className="hidden sm:inline text-white/15">·</span>
          <span>✅ Sem assinatura</span>
        </motion.div>

        {/* Demo card */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 0.5, ease: [0.16, 1, 0.3, 1] }}
          className="relative max-w-3xl mx-auto"
        >
          <div className="relative rounded-2xl border border-white/8 bg-surface-card/70 backdrop-blur-xl p-6 md:p-8 gradient-border shadow-2xl">
            <div className="flex flex-col md:flex-row items-center gap-8">

              {/* Left: prompt */}
              <div className="flex-1 text-left w-full">
                <p className="text-[10px] text-white/30 uppercase tracking-widest mb-2 font-mono">Seu prompt</p>
                <div className="flex items-center gap-3 px-4 py-3.5 rounded-xl bg-black/30 border border-white/8 mb-4 min-h-[52px]">
                  <Sparkles className="w-3.5 h-3.5 text-brand-purple-light flex-shrink-0" />
                  <TypewriterPrompt />
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {["✅ Template 585×559px", "✅ Validação automática", "✅ Upload no Marketplace"].map((item) => (
                    <span key={item} className="text-[10px] text-white/35 bg-white/5 border border-white/8 px-2 py-1 rounded-md font-mono">
                      {item}
                    </span>
                  ))}
                </div>
              </div>

              {/* Arrow */}
              <div className="flex md:flex-col items-center gap-1 text-brand-purple/50">
                <div className="w-8 h-px md:w-px md:h-8 bg-gradient-to-r md:bg-gradient-to-b from-transparent via-brand-purple to-transparent" />
                <ArrowRight className="w-4 h-4 text-brand-purple-light rotate-90 md:rotate-0" />
                <div className="w-8 h-px md:w-px md:h-8 bg-gradient-to-l md:bg-gradient-to-t from-transparent via-brand-purple to-transparent" />
              </div>

              {/* Right: skin preview */}
              <div className="text-center">
                <p className="text-[10px] text-white/30 uppercase tracking-widest mb-3 font-mono">Skin gerada</p>
                <SkinPreview />
                <div className="mt-3 flex items-center justify-center gap-1.5">
                  <span className="text-[10px] text-white/30">Preço sugerido:</span>
                  <span className="text-[10px] font-bold text-brand-purple-light">80 Robux</span>
                </div>
              </div>
            </div>
          </div>

          {/* Floating badges */}
          <motion.div
            animate={{ y: [0, -6, 0] }}
            transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
            className="absolute -top-5 -left-4 hidden md:flex items-center gap-2 px-3 py-2 rounded-xl bg-surface-card border border-white/10 shadow-xl shadow-black/40"
          >
            <span className="text-green-400 text-base">💰</span>
            <div>
              <p className="text-[10px] text-white/40">Royalties</p>
              <p className="text-sm font-black text-white">até 75%</p>
            </div>
          </motion.div>

          <motion.div
            animate={{ y: [0, 6, 0] }}
            transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 1 }}
            className="absolute -bottom-5 -right-4 hidden md:flex items-center gap-2 px-3 py-2 rounded-xl bg-surface-card border border-white/10 shadow-xl shadow-black/40"
          >
            <span className="text-yellow-400 text-base">⚡</span>
            <div>
              <p className="text-[10px] text-white/40">Gerado em</p>
              <p className="text-sm font-black text-white">&lt; 30 seg</p>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
