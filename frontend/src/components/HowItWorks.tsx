"use client";

import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { PenLine, Zap, Download, Rocket } from "lucide-react";

const STEPS = [
  {
    number: "01",
    icon: PenLine,
    title: "Escreva em português",
    description:
      "Descreva a skin no idioma que você fala. \"Armadura de cavaleiro neon azul\" ou \"jaqueta streetwear roxa com raios elétricos\" — sem inglês, sem Photoshop.",
    example: '"camisa futurista azul com raios"',
    color: "from-violet-500 to-purple-600",
    glow: "rgba(139,92,246,0.3)",
  },
  {
    number: "02",
    icon: Zap,
    title: "IA gera em segundos",
    description:
      "Nossa IA cria a textura, aplica ao template oficial do Roblox (585×559px), valida proporções e mostra um preview completo antes de qualquer ação.",
    example: "Preview em < 30 segundos",
    color: "from-blue-500 to-cyan-500",
    glow: "rgba(59,130,246,0.3)",
  },
];

const DELIVERY = [
  {
    icon: Download,
    tokens: 1,
    title: "Baixar e publicar você mesmo",
    description:
      "Receba o PNG 585×559px pronto. Você faz o upload no Roblox Creator Hub, define o preço e fica com 100% dos royalties. Zero intermediário.",
    tag: "100% seus royalties",
    tagColor: "text-green-400",
    tagBg: "bg-green-500/10 border-green-500/20",
    border: "border-green-500/20 hover:border-green-500/40",
    iconColor: "text-green-400",
    iconBg: "from-green-600 to-emerald-500",
  },
  {
    icon: Rocket,
    tokens: 2,
    title: "Publicar automático",
    description:
      "Aprovamos o preview e fazemos o upload direto no Marketplace via Roblox Open Cloud API. Você só aguarda a moderação (24–72h) e começa a vender.",
    tag: "Hands-free",
    tagColor: "text-brand-purple-light",
    tagBg: "bg-brand-purple/10 border-brand-purple/30",
    border: "border-brand-purple/20 hover:border-brand-purple/40",
    iconColor: "text-brand-purple-light",
    iconBg: "from-brand-purple to-brand-blue",
  },
];

export default function HowItWorks() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section id="como-funciona" className="relative py-20 px-6 overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-brand-purple-dark/20 to-transparent" />

      <div className="relative max-w-6xl mx-auto" ref={ref}>
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-14"
        >
          <p className="text-brand-purple-light text-sm font-semibold uppercase tracking-widest mb-4">
            Como funciona
          </p>
          <h2 className="text-4xl md:text-5xl font-black tracking-tight text-white mb-4">
            Dois passos. Depois{" "}
            <span className="gradient-text">você escolhe.</span>
          </h2>
          <p className="text-white/50 text-lg max-w-xl mx-auto">
            Escreva, gere e decida: baixa o arquivo e publica você mesmo (100% seus royalties)
            ou deixa a gente publicar automático.
          </p>
        </motion.div>

        {/* Steps 01 e 02 */}
        <div className="relative grid md:grid-cols-2 gap-8 mb-14 max-w-3xl mx-auto">
          <div className="hidden md:block absolute top-16 left-[25%] right-[25%] h-px">
            <motion.div
              initial={{ scaleX: 0 }}
              animate={isInView ? { scaleX: 1 } : {}}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="h-full bg-gradient-to-r from-violet-500/50 to-blue-500/50 origin-left"
            />
          </div>

          {STEPS.map((step, i) => {
            const Icon = step.icon;
            return (
              <motion.div
                key={step.number}
                initial={{ opacity: 0, y: 40 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.6, delay: 0.2 + i * 0.15 }}
                className="relative group"
              >
                <div
                  className="relative p-8 rounded-2xl border border-white/8 bg-surface-card/60 backdrop-blur-sm hover:border-white/15 transition-all duration-300"
                  onMouseEnter={(e) => {
                    (e.currentTarget as HTMLElement).style.boxShadow = `0 0 40px ${step.glow}`;
                  }}
                  onMouseLeave={(e) => {
                    (e.currentTarget as HTMLElement).style.boxShadow = "none";
                  }}
                >
                  <span className="absolute top-6 right-6 text-5xl font-black text-white/5 select-none">
                    {step.number}
                  </span>
                  <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${step.color} flex items-center justify-center mb-6 shadow-lg`}>
                    <Icon className="w-7 h-7 text-white" />
                  </div>
                  <h3 className="text-xl font-bold text-white mb-3">{step.title}</h3>
                  <p className="text-white/50 text-sm leading-relaxed mb-4">{step.description}</p>
                  <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-white/5 border border-white/8 text-white/60 text-xs font-mono">
                    {step.example}
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Choice divider */}
        <motion.div
          initial={{ opacity: 0, scaleX: 0 }}
          animate={isInView ? { opacity: 1, scaleX: 1 } : {}}
          transition={{ duration: 0.5, delay: 0.5 }}
          className="flex items-center gap-4 mb-10 max-w-3xl mx-auto"
        >
          <div className="flex-1 h-px bg-white/8" />
          <div className="flex items-center gap-2 px-4 py-2 rounded-full border border-white/10 bg-white/3">
            <span className="text-xs text-white/40 font-semibold uppercase tracking-widest">Sua escolha</span>
          </div>
          <div className="flex-1 h-px bg-white/8" />
        </motion.div>

        {/* Delivery options */}
        <div className="grid md:grid-cols-2 gap-6 max-w-3xl mx-auto">
          {DELIVERY.map((option, i) => {
            const Icon = option.icon;
            return (
              <motion.div
                key={option.title}
                initial={{ opacity: 0, y: 30 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.6, delay: 0.6 + i * 0.12 }}
                className={`relative p-7 rounded-2xl border bg-surface-card/60 backdrop-blur-sm transition-all duration-300 ${option.border}`}
              >
                {/* Token badge */}
                <div className={`absolute top-4 right-4 flex items-center gap-1 px-2 py-1 rounded-lg border text-xs font-mono font-bold ${option.tagBg} ${option.tagColor}`}>
                  {option.tokens} token{option.tokens > 1 ? "s" : ""}
                </div>

                <div className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${option.iconBg} flex items-center justify-center mb-5 shadow-lg`}>
                  <Icon className="w-6 h-6 text-white" />
                </div>

                <h3 className="text-lg font-bold text-white mb-2">{option.title}</h3>
                <p className="text-white/45 text-sm leading-relaxed mb-4">{option.description}</p>

                <div className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border text-xs font-semibold ${option.tagBg} ${option.tagColor}`}>
                  {option.tag}
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Bottom note */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : {}}
          transition={{ duration: 0.5, delay: 0.85 }}
          className="text-center text-white/25 text-sm mt-10"
        >
          Nos dois modos, o arquivo gerado é seu. Sem lock-in.
        </motion.p>
      </div>
    </section>
  );
}
