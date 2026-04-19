"use client";

import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { Check, Download, Zap } from "lucide-react";

const PACKS = [
  {
    name: "Starter",
    tokens: 30,
    price: "R$ 14,90",
    priceNote: "pagamento único",
    perToken: "R$ 0,50/token",
    highlight: false,
    features: [
      "30 gerações de skins",
      "Download do PNG (100% royalties)",
      "Auto-publish disponível (2 tokens)",
      "Válido por 6 meses",
    ],
    cta: "Comprar Starter",
    ctaStyle: "border border-white/15 text-white hover:bg-white/5",
  },
  {
    name: "Criador",
    tokens: 100,
    price: "R$ 34,90",
    priceNote: "pagamento único",
    perToken: "R$ 0,35/token",
    highlight: true,
    badge: "Mais popular",
    features: [
      "100 gerações de skins",
      "Download do PNG (100% royalties)",
      "Auto-publish disponível (2 tokens)",
      "Válido por 6 meses",
      "Prioridade na fila de geração",
    ],
    cta: "Comprar Criador",
    ctaStyle: "bg-gradient-to-r from-brand-purple to-brand-blue text-white hover:opacity-90 glow-purple-sm hover:glow-purple",
  },
  {
    name: "Estúdio",
    tokens: 300,
    price: "R$ 79,90",
    priceNote: "pagamento único",
    perToken: "R$ 0,27/token",
    highlight: false,
    features: [
      "300 gerações de skins",
      "Download do PNG (100% royalties)",
      "Auto-publish disponível (2 tokens)",
      "Válido por 12 meses",
      "Prioridade máxima na fila",
      "Acesso antecipado a novidades",
    ],
    cta: "Comprar Estúdio",
    ctaStyle: "border border-white/15 text-white hover:bg-white/5",
  },
];

const TOKEN_EXPLAINER = [
  {
    icon: Download,
    tokens: 1,
    label: "Download",
    desc: "Receba o PNG 585×559px pronto para publicar. Você publica no Roblox e fica com 100% dos royalties.",
    color: "text-green-400",
    bg: "bg-green-500/10 border-green-500/20",
  },
  {
    icon: Zap,
    tokens: 2,
    label: "Auto-publish",
    desc: "A gente faz o upload direto no Marketplace. Você só aprova o preview e espera a moderação do Roblox.",
    color: "text-brand-purple-light",
    bg: "bg-brand-purple/10 border-brand-purple/20",
  },
];

export default function Pricing() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section id="precos" className="relative py-20 px-6 overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-brand-purple-dark/10 to-transparent" />

      <div className="relative max-w-5xl mx-auto" ref={ref}>
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-14"
        >
          <p className="text-brand-purple-light text-sm font-semibold uppercase tracking-widest mb-4">
            Preços
          </p>
          <h2 className="text-4xl md:text-5xl font-black tracking-tight text-white mb-4">
            Pague só pelo que{" "}
            <span className="gradient-text">usar.</span>
          </h2>
          <p className="text-white/50 text-lg max-w-xl mx-auto">
            Sem assinatura. Compre tokens e gere skins no seu ritmo.
            Você decide se baixa ou publica automático.
          </p>
        </motion.div>

        {/* Free tier callout */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="flex items-center justify-center gap-3 mb-10 p-4 rounded-2xl border border-white/8 bg-white/3 max-w-xl mx-auto"
        >
          <span className="text-2xl">🎁</span>
          <p className="text-white/70 text-sm">
            <span className="text-white font-bold">3 tokens gratuitos por dia</span> para todo mundo —
            sem cadastro, sem cartão.
          </p>
        </motion.div>

        {/* Token explainer */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5, delay: 0.15 }}
          className="grid sm:grid-cols-2 gap-4 mb-12 max-w-2xl mx-auto"
        >
          {TOKEN_EXPLAINER.map((item) => {
            const Icon = item.icon;
            return (
              <div key={item.label} className={`flex items-start gap-3 p-4 rounded-xl border ${item.bg}`}>
                <div className={`flex-shrink-0 w-8 h-8 rounded-lg flex items-center justify-center border ${item.bg}`}>
                  <Icon className={`w-4 h-4 ${item.color}`} />
                </div>
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-white text-sm font-bold">{item.label}</span>
                    <span className={`text-xs font-mono font-bold px-1.5 py-0.5 rounded ${item.bg} ${item.color}`}>
                      {item.tokens} token{item.tokens > 1 ? "s" : ""}
                    </span>
                  </div>
                  <p className="text-white/45 text-xs leading-relaxed">{item.desc}</p>
                </div>
              </div>
            );
          })}
        </motion.div>

        {/* Packs grid */}
        <div className="grid md:grid-cols-3 gap-6 mb-10">
          {PACKS.map((pack, i) => (
            <motion.div
              key={pack.name}
              initial={{ opacity: 0, y: 40 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: 0.2 + i * 0.1 }}
              className={`relative rounded-2xl p-8 flex flex-col ${
                pack.highlight
                  ? "gradient-border bg-gradient-to-b from-brand-purple/10 to-brand-blue/5 glow-purple-sm"
                  : "border border-white/8 bg-surface-card/60"
              }`}
            >
              {pack.badge && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                  <span className="px-3 py-1 rounded-full text-xs font-semibold bg-gradient-to-r from-brand-purple to-brand-blue text-white shadow-lg">
                    {pack.badge}
                  </span>
                </div>
              )}

              <div className="mb-2">
                <p className="text-white/50 text-sm font-medium mb-3">{pack.name}</p>
                {/* Token count */}
                <div className="flex items-baseline gap-2 mb-1">
                  <span className="text-5xl font-black text-white">{pack.tokens}</span>
                  <span className="text-white/40 text-base">tokens</span>
                </div>
                <p className="text-xs text-white/30 mb-1">{pack.perToken}</p>
              </div>

              {/* Price */}
              <div className="flex items-baseline gap-1 mb-6">
                <span className="text-2xl font-black text-white">{pack.price}</span>
                <span className="text-white/30 text-xs">{pack.priceNote}</span>
              </div>

              {/* Features */}
              <ul className="space-y-2.5 mb-8 flex-1">
                {pack.features.map((f) => (
                  <li key={f} className="flex items-start gap-2 text-sm text-white/55">
                    <Check className="w-3.5 h-3.5 text-brand-purple-light flex-shrink-0 mt-0.5" />
                    {f}
                  </li>
                ))}
              </ul>

              <a
                href="#waitlist"
                className={`block text-center px-6 py-3.5 rounded-xl font-semibold text-sm transition-all duration-200 ${pack.ctaStyle}`}
              >
                {pack.cta}
              </a>
            </motion.div>
          ))}
        </div>

        {/* Math note */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.55 }}
          className="text-center p-5 rounded-2xl border border-brand-purple/20 bg-brand-purple/5"
        >
          <p className="text-white/60 text-sm">
            💡 Com o pack Criador você gera{" "}
            <span className="text-white font-semibold">100 skins</span> ou faz{" "}
            <span className="text-white font-semibold">50 auto-publishes</span> —
            ou mistura os dois do jeito que preferir.{" "}
            <span className="text-brand-purple-light font-bold">A skin é sempre sua.</span>
          </p>
        </motion.div>
      </div>
    </section>
  );
}
