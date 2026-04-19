"use client";

import { motion, useInView } from "framer-motion";
import { useRef, useState } from "react";
import { ArrowRight, CheckCircle, Loader2, Users } from "lucide-react";

const WAITLIST_BASE = 312;

export default function Waitlist() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [errorMsg, setErrorMsg] = useState("");
  const [count, setCount] = useState(WAITLIST_BASE);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!email?.includes("@")) {
      setErrorMsg("Insira um e-mail válido.");
      return;
    }

    setStatus("loading");
    setErrorMsg("");

    try {
      const res = await fetch("https://formsubmit.co/ajax/arthur.araujo48@gmail.com", {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify({
          email,
          _subject: "Nova entrada na waitlist — Roblox Creator BR",
          _template: "table",
        }),
      });

      if (res.ok) {
        setStatus("success");
        setCount((c) => c + 1);
        setEmail("");
      } else {
        throw new Error("Falha ao enviar para a waitlist");
      }
    } catch {
      setStatus("error");
      setErrorMsg("Erro ao salvar. Tente novamente.");
    }
  }

  return (
    <section id="waitlist" className="relative py-20 px-6 overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-mesh" />
      <div className="absolute inset-0">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[400px] bg-brand-purple/15 rounded-full blur-3xl" />
      </div>
      <div
        className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage: "linear-gradient(rgba(255,255,255,0.8) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.8) 1px, transparent 1px)",
          backgroundSize: "60px 60px",
        }}
      />

      <div className="relative max-w-3xl mx-auto text-center" ref={ref}>
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7 }}
        >
          <p className="text-brand-purple-light text-sm font-semibold uppercase tracking-widest mb-6">
            Acesso antecipado · Vagas limitadas
          </p>

          <h2 className="text-4xl md:text-6xl font-black tracking-tight text-white mb-6 text-balance leading-[1.05]">
            Crie sua skin.
            <br />
            Publique no Roblox.
            <br />
            <span className="gradient-text">Comece a ganhar.</span>
          </h2>

          <p className="text-white/55 text-lg mb-8 max-w-lg mx-auto leading-relaxed">
            Escreva uma frase em português — em menos de 30 segundos sua skin está pronta para vender no Marketplace.
            Sem desenhar. Sem Photoshop. Sem inglês.
          </p>

          {/* Social proof counter */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={isInView ? { opacity: 1, scale: 1 } : {}}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="inline-flex items-center gap-2.5 px-4 py-2.5 rounded-full bg-white/5 border border-white/10 text-white/60 text-sm mb-10"
          >
            <Users className="w-4 h-4 text-brand-purple-light" />
            <span>
              <span className="font-bold text-white">{count.toLocaleString("pt-BR")}</span> pessoas já na lista
            </span>
            <span className="flex gap-0.5">
              {["a1", "a2", "a3", "a4", "a5"].map((id, i) => (
                <span
                  key={id}
                  className="w-5 h-5 rounded-full bg-gradient-to-br from-brand-purple to-brand-blue border-2 border-surface"
                  style={{ marginLeft: i > 0 ? "-6px" : "0" }}
                />
              ))}
            </span>
          </motion.div>

          {status === "success" ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="inline-flex flex-col items-center gap-3"
            >
              <CheckCircle className="w-12 h-12 text-green-400" />
              <p className="text-white font-semibold text-lg">Você está na lista!</p>
              <p className="text-white/50 text-sm">Vamos te avisar assim que o acesso antecipado abrir.</p>
            </motion.div>
          ) : (
            <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="seu@email.com"
                className="flex-1 px-5 py-4 rounded-xl border border-white/10 text-white placeholder-white/30 focus:outline-none focus:border-brand-purple/50 transition-all duration-200 text-sm"
              />
              <button
                type="submit"
                disabled={status === "loading"}
                className="group flex items-center justify-center gap-2 px-7 py-4 rounded-xl bg-gradient-to-r from-brand-purple to-brand-blue text-white font-semibold text-sm hover:opacity-90 transition-all duration-200 glow-purple-sm hover:glow-purple disabled:opacity-60 disabled:cursor-not-allowed whitespace-nowrap"
              >
                {status === "loading" ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <>
                    Entrar na lista
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </>
                )}
              </button>
            </form>
          )}

          {errorMsg && (
            <p className="text-red-400 text-sm mt-3">{errorMsg}</p>
          )}

          {status !== "success" && (
            <div className="mt-5 space-y-2">
              <p className="text-white/20 text-xs">
                Sem spam. Sem cobrança agora. Você decide quando ativar.
              </p>
              <p className="text-white/30 text-xs font-medium">
                ⚡ Acesso liberado por ordem de inscrição — quem entrar antes começa a vender antes.
              </p>
            </div>
          )}
        </motion.div>
      </div>
    </section>
  );
}
