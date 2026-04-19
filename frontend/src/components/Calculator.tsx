"use client";

import { motion, useInView } from "framer-motion";
import { useRef, useState } from "react";
import { TrendingUp, Download, Rocket } from "lucide-react";

const PACKS = [
  { id: "free", label: "Grátis (3/dia)", tokens: 90, cost: 0, note: "~3 tokens/dia × 30 dias" },
  { id: "starter", label: "Starter", tokens: 30, cost: 14.9, note: "" },
  { id: "criador", label: "Criador", tokens: 100, cost: 34.9, note: "" },
  { id: "estudio", label: "Estúdio", tokens: 300, cost: 79.9, note: "" },
];

type PackId = (typeof PACKS)[number]["id"];

const ROBUX_TO_BRL = 0.02;
const ROBLOX_CUT = 0.3;

function fmt(n: number) {
  return n.toLocaleString("pt-BR", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

export default function Calculator() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-80px" });

  const [packId, setPackId] = useState<PackId>("criador");
  const [mode, setMode] = useState<"download" | "autopublish">("download");
  const [skinPrice, setSkinPrice] = useState(80);
  const [salesPerSkin, setSalesPerSkin] = useState(20);

  const pack = PACKS.find((p) => p.id === packId) ?? PACKS[2];
  const tokensPerSkin = mode === "download" ? 1 : 2;
  const skins = Math.floor(pack.tokens / tokensPerSkin);
  const grossRobux = skins * skinPrice * salesPerSkin;
  const netRobux = grossRobux * (1 - ROBLOX_CUT);
  const netBrl = netRobux * ROBUX_TO_BRL;
  const profit = netBrl - pack.cost;

  return (
    <section id="calculadora" className="relative py-20 px-6 overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-brand-blue-dark/15 to-transparent" />

      <div className="relative max-w-4xl mx-auto" ref={ref}>
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-14"
        >
          <p className="text-brand-purple-light text-sm font-semibold uppercase tracking-widest mb-4">
            Simulador
          </p>
          <h2 className="text-4xl md:text-5xl font-black tracking-tight text-white mb-4">
            Quanto você pode{" "}
            <span className="gradient-text">ganhar?</span>
          </h2>
          <p className="text-white/50 text-lg max-w-xl mx-auto">
            Escolha o pack, o modo de entrega e simule seu retorno.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7, delay: 0.1 }}
          className="grid md:grid-cols-2 gap-6"
        >
          {/* Controls */}
          <div className="rounded-2xl border border-white/8 bg-surface-card/60 p-6 space-y-6">
            <p className="text-sm font-semibold text-white flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-brand-purple-light" />
              Configurar simulação
            </p>

            {/* Pack */}
            <div>
              <p className="block text-xs text-white/40 uppercase tracking-widest mb-3">Pack de tokens</p>
              <div className="grid grid-cols-2 gap-2">
                {PACKS.map((p) => (
                  <button
                    key={p.id}
                    onClick={() => setPackId(p.id)}
                    className={`py-2.5 px-3 rounded-xl text-xs font-semibold transition-all duration-200 text-left ${
                      packId === p.id
                        ? "bg-gradient-to-r from-brand-purple to-brand-blue text-white"
                        : "border border-white/10 text-white/50 hover:text-white hover:border-white/20"
                    }`}
                  >
                    <div>{p.label}</div>
                    <div className={`font-mono mt-0.5 ${packId === p.id ? "text-white/70" : "text-white/30"}`}>
                      {p.tokens} tokens{p.cost > 0 ? ` · R$${p.cost}` : " · grátis"}
                    </div>
                  </button>
                ))}
              </div>
              {pack.note && (
                <p className="text-xs text-white/25 mt-2 font-mono">{pack.note}</p>
              )}
            </div>

            {/* Mode */}
            <div>
              <p className="block text-xs text-white/40 uppercase tracking-widest mb-3">Modo de entrega</p>
              <div className="flex gap-2">
                <button
                  onClick={() => setMode("download")}
                  className={`flex-1 flex items-center gap-2 py-3 px-3 rounded-xl text-xs font-semibold transition-all duration-200 ${
                    mode === "download"
                      ? "bg-green-500/15 border border-green-500/40 text-green-400"
                      : "border border-white/10 text-white/40 hover:border-white/20"
                  }`}
                >
                  <Download className="w-3.5 h-3.5" />
                  Download (1 token)
                </button>
                <button
                  onClick={() => setMode("autopublish")}
                  className={`flex-1 flex items-center gap-2 py-3 px-3 rounded-xl text-xs font-semibold transition-all duration-200 ${
                    mode === "autopublish"
                      ? "bg-brand-purple/15 border border-brand-purple/40 text-brand-purple-light"
                      : "border border-white/10 text-white/40 hover:border-white/20"
                  }`}
                >
                  <Rocket className="w-3.5 h-3.5" />
                  Auto-publish (2)
                </button>
              </div>
            </div>

            {/* Skin price */}
            <div>
              <div className="flex justify-between items-center mb-2">
                <label htmlFor="skin-price" className="text-xs text-white/40 uppercase tracking-widest">Preço da skin</label>
                <span className="text-sm font-bold text-brand-purple-light">{skinPrice} Robux</span>
              </div>
              <input id="skin-price" type="range" min={25} max={500} step={5} value={skinPrice}
                onChange={(e) => setSkinPrice(Number(e.target.value))} className="w-full accent-brand-purple" />
              <div className="flex justify-between text-xs text-white/20 mt-1">
                <span>25</span><span>500 Robux</span>
              </div>
            </div>

            {/* Sales */}
            <div>
              <div className="flex justify-between items-center mb-2">
                <label htmlFor="sales-per-skin" className="text-xs text-white/40 uppercase tracking-widest">Vendas por skin</label>
                <span className="text-sm font-bold text-brand-purple-light">{salesPerSkin}×</span>
              </div>
              <input id="sales-per-skin" type="range" min={1} max={200} step={1} value={salesPerSkin}
                onChange={(e) => setSalesPerSkin(Number(e.target.value))} className="w-full accent-brand-purple" />
              <div className="flex justify-between text-xs text-white/20 mt-1">
                <span>1</span><span>200 vendas</span>
              </div>
            </div>
          </div>

          {/* Results */}
          <div className="rounded-2xl border border-brand-purple/30 bg-gradient-to-b from-brand-purple/10 to-brand-blue/5 p-6 flex flex-col">
            <p className="text-sm font-semibold text-white mb-6 flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-brand-purple-light" />
              Resultado estimado
            </p>

            <div className="space-y-3 flex-1 text-sm">
              <div className="flex justify-between py-2.5 border-b border-white/8">
                <span className="text-white/45">Skins geradas</span>
                <span className="text-white font-semibold">{skins} skins</span>
              </div>
              <div className="flex justify-between py-2.5 border-b border-white/8">
                <span className="text-white/45">Total de vendas</span>
                <span className="text-white font-semibold">{(skins * salesPerSkin).toLocaleString("pt-BR")}</span>
              </div>
              <div className="flex justify-between py-2.5 border-b border-white/8">
                <span className="text-white/45">Robux bruto</span>
                <span className="text-white font-semibold">{grossRobux.toLocaleString("pt-BR")}</span>
              </div>
              <div className="flex justify-between py-2.5 border-b border-white/8">
                <span className="text-white/45">Após corte Roblox (30%)</span>
                <span className="text-white font-semibold">{Math.round(netRobux).toLocaleString("pt-BR")} R$</span>
              </div>
              <div className="flex justify-between py-2.5 border-b border-white/8">
                <span className="text-white/45">Em reais (~R$ 0,02/R$)</span>
                <span className="text-green-400 font-bold">R$ {fmt(netBrl)}</span>
              </div>
              {pack.cost > 0 && (
                <div className="flex justify-between py-2.5 border-b border-white/8">
                  <span className="text-white/45">Custo do pack</span>
                  <span className="text-white/60">- R$ {fmt(pack.cost)}</span>
                </div>
              )}
            </div>

            <div className={`mt-6 rounded-xl p-5 text-center ${profit >= 0 ? "bg-green-500/10 border border-green-500/20" : "bg-red-500/10 border border-red-500/20"}`}>
              <p className="text-xs text-white/35 uppercase tracking-widest mb-1">Lucro estimado</p>
              <p className={`text-4xl font-black ${profit >= 0 ? "text-green-400" : "text-red-400"}`}>
                R$ {fmt(profit)}
              </p>
              {mode === "download" && (
                <p className="text-xs text-white/30 mt-2">
                  Publicando você mesmo → <span className="text-green-400 font-semibold">100% dos royalties</span>
                </p>
              )}
            </div>

            <p className="text-white/20 text-xs text-center mt-3">
              * Estimativa com {salesPerSkin} venda(s)/skin. Resultados reais variam.
            </p>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="text-center mt-10"
        >
          <a
            href="#waitlist"
            className="inline-flex items-center gap-2 px-8 py-4 rounded-xl bg-gradient-to-r from-brand-purple to-brand-blue text-white font-semibold hover:opacity-90 transition-all duration-200 glow-purple-sm hover:glow-purple"
          >
            Quero começar com tokens grátis
          </a>
        </motion.div>
      </div>
    </section>
  );
}
