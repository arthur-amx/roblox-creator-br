"use client";

import { motion, useInView, AnimatePresence } from "framer-motion";
import { useRef, useState } from "react";
import { Plus, Minus } from "lucide-react";

const FAQS = [
  {
    q: "O que é um token?",
    a: "Token é a unidade de uso da plataforma. Cada geração de skin consome tokens: 1 token para baixar o arquivo PNG, 2 tokens para publicar automático no Roblox Marketplace. Você recebe 3 tokens grátis por dia para experimentar.",
  },
  {
    q: "Qual a diferença entre baixar e publicar automático?",
    a: "No modo Download (1 token), você recebe o PNG 585×559px pronto para o Roblox. Você mesmo faz o upload no Creator Hub e fica com 100% dos royalties. No modo Auto-publish (2 tokens), a gente faz o upload via API e você só espera a moderação — ideal para quem quer praticidade.",
  },
  {
    q: "Se eu baixar, fico com 100% dos royalties mesmo?",
    a: "Sim. O arquivo é seu. Você publica na sua própria conta Roblox e o Roblox repassa os royalties direto para você, sem nenhum intermediário. A plataforma só cobrou pelo token de geração.",
  },
  {
    q: "Os tokens expiram?",
    a: "Os 3 tokens diários gratuitos reiniciam todo dia. Tokens comprados em packs avulsos têm validade de 6 meses (Starter e Criador) ou 12 meses (Estúdio). Não usou tudo? O saldo fica guardado.",
  },
  {
    q: "Minha skin pode ser rejeitada pelo Roblox?",
    a: "Sim, o Roblox tem moderação própria (24–72h). Nossa IA pré-valida o conteúdo antes de enviar, com meta de mais de 85% de aprovação. No modo Download, a responsabilidade de publicar é sua. No Auto-publish, não cobramos tokens extras em caso de rejeição.",
  },
  {
    q: "Preciso de conta Roblox verificada para usar?",
    a: "Para o modo Download: não. Você só precisa de uma conta Roblox comum para fazer o upload manual. Para o modo Auto-publish: a plataforma usa uma conta verificada própria para fazer o upload via API.",
  },
  {
    q: "Como funciona o limite diário gratuito?",
    a: "O limite de 3 tokens/dia é rastreado por IP e identificador de dispositivo para evitar abuso. Se você precisar de mais gerações no dia, basta comprar um pack avulso — a partir de R$ 14,90.",
  },
  {
    q: "Funciona para itens 3D também?",
    a: "O MVP (fase atual) foca em skins 2D, que representam o maior volume de vendas no Marketplace. Geração de itens 3D UGC (.fbx, acessórios) está planejada para a fase 2.",
  },
];

export default function Faq() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });
  const [open, setOpen] = useState<number | null>(0);

  return (
    <section className="relative py-20 px-6 overflow-hidden">
      <div className="relative max-w-3xl mx-auto" ref={ref}>
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <p className="text-brand-purple-light text-sm font-semibold uppercase tracking-widest mb-4">
            Dúvidas frequentes
          </p>
          <h2 className="text-4xl md:text-5xl font-black tracking-tight text-white">
            Perguntas &{" "}
            <span className="gradient-text">respostas</span>
          </h2>
        </motion.div>

        <div className="space-y-3">
          {FAQS.map((faq, i) => (
            <motion.div
              key={faq.q}
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: i * 0.06 }}
              className={`rounded-2xl border transition-all duration-200 overflow-hidden ${
                open === i
                  ? "border-brand-purple/40 bg-brand-purple/5"
                  : "border-white/8 bg-surface-card/60 hover:border-white/15"
              }`}
            >
              <button
                onClick={() => setOpen(open === i ? null : i)}
                className="w-full flex items-center justify-between p-6 text-left"
              >
                <span className="font-semibold text-white pr-4 text-sm md:text-base">{faq.q}</span>
                {open === i ? (
                  <Minus className="w-4 h-4 text-brand-purple-light flex-shrink-0" />
                ) : (
                  <Plus className="w-4 h-4 text-white/40 flex-shrink-0" />
                )}
              </button>

              <AnimatePresence>
                {open === i && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.25 }}
                    className="overflow-hidden"
                  >
                    <p className="px-6 pb-6 text-white/50 text-sm leading-relaxed">{faq.a}</p>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
