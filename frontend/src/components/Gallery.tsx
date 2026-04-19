"use client";

import { motion, useInView } from "framer-motion";
import { useRef } from "react";

const SKINS = [
  {
    prompt: "armadura de cavaleiro neon azul",
    price: "80 Robux",
    from: "#1e40af",
    to: "#06b6d4",
    accent: "#38bdf8",
    type: "armor",
  },
  {
    prompt: "jaqueta streetwear roxa com raios",
    price: "65 Robux",
    from: "#7c3aed",
    to: "#ec4899",
    accent: "#c084fc",
    type: "jacket",
  },
  {
    prompt: "uniforme de astronauta dourado",
    price: "120 Robux",
    from: "#b45309",
    to: "#fbbf24",
    accent: "#fde68a",
    type: "suit",
  },
  {
    prompt: "capa de mago das sombras",
    price: "95 Robux",
    from: "#1e1b4b",
    to: "#6d28d9",
    accent: "#a78bfa",
    type: "cape",
  },
  {
    prompt: "colete tático militar verde",
    price: "70 Robux",
    from: "#14532d",
    to: "#15803d",
    accent: "#4ade80",
    type: "vest",
  },
  {
    prompt: "camisa havaiana neon pink",
    price: "45 Robux",
    from: "#9f1239",
    to: "#f43f5e",
    accent: "#fb7185",
    type: "shirt",
  },
  {
    prompt: "traje de samurai vermelho",
    price: "110 Robux",
    from: "#7f1d1d",
    to: "#ef4444",
    accent: "#fca5a5",
    type: "armor",
  },
  {
    prompt: "hoodie cyberpunk com led azul",
    price: "85 Robux",
    from: "#1e3a8a",
    to: "#6366f1",
    accent: "#818cf8",
    type: "hoodie",
  },
];

type SkinSVGProps = Readonly<{ type: string; accent: string; from: string; to: string }>;

function SkinSVG({ type, accent, from, to }: SkinSVGProps) {
  const id = `grad-${type}-${from.replace("#", "")}`;

  if (type === "jacket" || type === "hoodie") {
    return (
      <svg viewBox="0 0 120 100" xmlns="http://www.w3.org/2000/svg" className="w-24 h-20 drop-shadow-lg">
        <defs>
          <linearGradient id={id} x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor={from} />
            <stop offset="100%" stopColor={to} />
          </linearGradient>
        </defs>
        {/* Body */}
        <path d="M30,20 L10,40 L22,45 L22,90 L98,90 L98,45 L110,40 L90,20 L75,30 Q60,10 45,30 Z" fill={`url(#${id})`} />
        {/* Collar */}
        <path d="M45,30 Q60,20 75,30 L70,50 Q60,40 50,50 Z" fill={accent} opacity="0.6" />
        {/* Pocket */}
        <rect x="30" y="60" width="18" height="14" rx="3" fill={accent} opacity="0.25" />
        {/* Zipper */}
        <line x1="60" y1="45" x2="60" y2="88" stroke={accent} strokeWidth="2" opacity="0.4" />
        {/* Sleeve lines */}
        <path d="M22,50 L10,40" stroke={accent} strokeWidth="1.5" opacity="0.3" fill="none" />
        <path d="M98,50 L110,40" stroke={accent} strokeWidth="1.5" opacity="0.3" fill="none" />
      </svg>
    );
  }

  if (type === "armor") {
    return (
      <svg viewBox="0 0 120 100" xmlns="http://www.w3.org/2000/svg" className="w-24 h-20 drop-shadow-lg">
        <defs>
          <linearGradient id={id} x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor={from} />
            <stop offset="100%" stopColor={to} />
          </linearGradient>
        </defs>
        {/* Chest plate */}
        <path d="M35,15 L15,38 L24,44 L24,88 L96,88 L96,44 L105,38 L85,15 L72,22 Q60,8 48,22 Z" fill={`url(#${id})`} />
        {/* Chest detail */}
        <path d="M40,35 L40,75 L80,75 L80,35 Q60,28 40,35 Z" fill={accent} opacity="0.15" />
        {/* Shoulder pads */}
        <ellipse cx="20" cy="42" rx="12" ry="8" fill={accent} opacity="0.5" />
        <ellipse cx="100" cy="42" rx="12" ry="8" fill={accent} opacity="0.5" />
        {/* Center gem */}
        <polygon points="60,38 66,46 60,54 54,46" fill={accent} opacity="0.9" />
        {/* Rivets */}
        {[42, 52, 62, 72].map((x) => (
          <circle key={x} cx={x} cy="78" r="2" fill={accent} opacity="0.6" />
        ))}
      </svg>
    );
  }

  if (type === "cape") {
    return (
      <svg viewBox="0 0 120 100" xmlns="http://www.w3.org/2000/svg" className="w-24 h-20 drop-shadow-lg">
        <defs>
          <linearGradient id={id} x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor={from} />
            <stop offset="100%" stopColor={to} />
          </linearGradient>
        </defs>
        {/* Cape body */}
        <path d="M30,15 L10,30 L15,92 Q60,100 105,92 L110,30 L90,15 Q60,5 30,15 Z" fill={`url(#${id})`} />
        {/* Inner lining */}
        <path d="M38,20 L20,35 L25,88 Q60,94 95,88 L100,35 L82,20 Q60,14 38,20 Z" fill={from} opacity="0.4" />
        {/* Clasp */}
        <circle cx="60" cy="20" r="6" fill={accent} opacity="0.9" />
        <circle cx="60" cy="20" r="3" fill={from} opacity="0.9" />
        {/* Star pattern */}
        <text x="60" y="65" textAnchor="middle" fontSize="22" fill={accent} opacity="0.3">✦</text>
      </svg>
    );
  }

  if (type === "vest") {
    return (
      <svg viewBox="0 0 120 100" xmlns="http://www.w3.org/2000/svg" className="w-24 h-20 drop-shadow-lg">
        <defs>
          <linearGradient id={id} x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor={from} />
            <stop offset="100%" stopColor={to} />
          </linearGradient>
        </defs>
        {/* Body */}
        <path d="M35,18 L20,42 L32,46 L32,88 L88,88 L88,46 L100,42 L85,18 L72,26 Q60,12 48,26 Z" fill={`url(#${id})`} />
        {/* Tactical pockets */}
        <rect x="34" y="52" width="16" height="18" rx="2" fill={accent} opacity="0.3" />
        <rect x="70" y="52" width="16" height="18" rx="2" fill={accent} opacity="0.3" />
        <rect x="40" y="30" width="12" height="14" rx="2" fill={accent} opacity="0.25" />
        <rect x="68" y="30" width="12" height="14" rx="2" fill={accent} opacity="0.25" />
        {/* Straps */}
        <line x1="46" y1="18" x2="46" y2="88" stroke={accent} strokeWidth="3" opacity="0.2" />
        <line x1="74" y1="18" x2="74" y2="88" stroke={accent} strokeWidth="3" opacity="0.2" />
        {/* Buckle */}
        <rect x="52" y="54" width="16" height="10" rx="2" fill={accent} opacity="0.6" />
      </svg>
    );
  }

  if (type === "suit") {
    return (
      <svg viewBox="0 0 120 100" xmlns="http://www.w3.org/2000/svg" className="w-24 h-20 drop-shadow-lg">
        <defs>
          <linearGradient id={id} x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor={from} />
            <stop offset="100%" stopColor={to} />
          </linearGradient>
        </defs>
        {/* Body */}
        <path d="M32,16 L10,38 L22,44 L22,90 L98,90 L98,44 L110,38 L88,16 L74,24 Q60,8 46,24 Z" fill={`url(#${id})`} />
        {/* Visor/helmet style detail at top */}
        <ellipse cx="60" cy="16" rx="14" ry="8" fill={accent} opacity="0.7" />
        {/* Suit panels */}
        <path d="M36,42 L36,82 L60,82 L60,42 Z" fill={accent} opacity="0.08" />
        <path d="M84,42 L84,82 L60,82 L60,42 Z" fill={accent} opacity="0.08" />
        {/* Chest badge */}
        <rect x="50" y="50" width="20" height="14" rx="3" fill={accent} opacity="0.4" />
        {/* Oxygen tank circles */}
        <circle cx="28" cy="65" r="5" fill={accent} opacity="0.4" />
        <circle cx="92" cy="65" r="5" fill={accent} opacity="0.4" />
      </svg>
    );
  }

  /* Default: shirt */
  return (
    <svg viewBox="0 0 120 100" xmlns="http://www.w3.org/2000/svg" className="w-24 h-20 drop-shadow-lg">
      <defs>
        <linearGradient id={id} x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor={from} />
          <stop offset="100%" stopColor={to} />
        </linearGradient>
      </defs>
      {/* Shirt body */}
      <path d="M32,18 L12,40 L26,46 L26,88 L94,88 L94,46 L108,40 L88,18 L74,28 Q60,12 46,28 Z" fill={`url(#${id})`} />
      {/* Collar */}
      <path d="M46,28 Q60,18 74,28 L68,46 Q60,38 52,46 Z" fill={accent} opacity="0.5" />
      {/* Print / pattern */}
      <circle cx="60" cy="64" r="10" fill={accent} opacity="0.2" />
      <circle cx="60" cy="64" r="5" fill={accent} opacity="0.3" />
    </svg>
  );
}

export default function Gallery() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-50px" });

  return (
    <section id="galeria" className="relative py-20 px-6 overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-brand-blue-dark/15 to-transparent" />

      <div className="relative max-w-6xl mx-auto" ref={ref}>
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <p className="text-brand-purple-light text-sm font-semibold uppercase tracking-widest mb-4">
            Galeria
          </p>
          <h2 className="text-4xl md:text-5xl font-black tracking-tight text-white mb-4">
            Criado com um{" "}
            <span className="gradient-text">simples prompt</span>
          </h2>
          <p className="text-white/50 text-lg max-w-xl mx-auto">
            Cada skin abaixo foi gerada por IA a partir de uma frase em português. É isso que você vai criar.
          </p>
        </motion.div>

        {/* Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {SKINS.map((skin, i) => (
            <motion.div
              key={skin.prompt}
              initial={{ opacity: 0, y: 30 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: i * 0.07 }}
              className="group relative rounded-2xl overflow-hidden border border-white/8 bg-surface-card/60 cursor-pointer hover:border-white/20 transition-all duration-300"
              style={{ transform: "perspective(1000px)" }}
              onMouseMove={(e) => {
                const rect = e.currentTarget.getBoundingClientRect();
                const x = (e.clientX - rect.left) / rect.width - 0.5;
                const y = (e.clientY - rect.top) / rect.height - 0.5;
                (e.currentTarget as HTMLElement).style.transform =
                  `perspective(1000px) rotateX(${-y * 8}deg) rotateY(${x * 8}deg) translateZ(4px)`;
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLElement).style.transform = "perspective(1000px) rotateX(0) rotateY(0)";
              }}
            >
              {/* Skin preview */}
              <div
                className="h-44 flex items-center justify-center relative overflow-hidden"
                style={{ background: `linear-gradient(135deg, ${skin.from}cc, ${skin.to}cc)` }}
              >
                {/* Subtle grid pattern */}
                <div
                  className="absolute inset-0 opacity-[0.06]"
                  style={{
                    backgroundImage: "linear-gradient(rgba(255,255,255,0.8) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.8) 1px, transparent 1px)",
                    backgroundSize: "20px 20px",
                  }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />
                {/* Glow behind skin */}
                <div
                  className="absolute inset-0 flex items-center justify-center"
                  style={{ filter: `blur(28px)`, opacity: 0.5 }}
                >
                  <div className="w-16 h-16 rounded-full" style={{ background: skin.accent }} />
                </div>
                <div className="relative z-10 group-hover:scale-105 transition-transform duration-300">
                  <SkinSVG type={skin.type} accent={skin.accent} from={skin.from} to={skin.to} />
                </div>
                {/* Shine on hover */}
                <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              </div>

              {/* Info */}
              <div className="p-3">
                <p className="text-xs text-white/50 font-mono leading-tight mb-2 line-clamp-2">
                  &quot;{skin.prompt}&quot;
                </p>
                <div className="flex items-center justify-between">
                  <span className="text-xs text-white/30">Preço</span>
                  <span className="text-xs font-bold" style={{ color: skin.accent }}>{skin.price}</span>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Bottom note */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : {}}
          transition={{ duration: 0.6, delay: 0.8 }}
          className="text-center text-white/30 text-sm mt-8"
        >
          * Mockups ilustrativos. Skins reais geradas após integração com DALL-E 3.
        </motion.p>
      </div>
    </section>
  );
}
