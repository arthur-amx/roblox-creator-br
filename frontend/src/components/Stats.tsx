"use client";

import { motion, useInView } from "framer-motion";
import { useRef, useEffect, useState } from "react";

const STATS = [
  { value: 330, suffix: "M", prefix: "US$ ", label: "em UGC fashion no Roblox em 2025", decimals: 0 },
  { value: 274, suffix: "M", prefix: "", label: "atualizações de avatar por dia", decimals: 0 },
  { value: 181, suffix: "%", prefix: "", label: "crescimento de jogadores brasileiros (2020→2024)", decimals: 0 },
  { value: 71, suffix: "%", prefix: "", label: "de margem bruta por item publicado", decimals: 0 },
];

type CountUpProps = Readonly<{
  value: number;
  prefix: string;
  suffix: string;
  decimals: number;
  isInView: boolean;
}>;

function CountUp({ value, prefix, suffix, decimals, isInView }: CountUpProps) {
  const [display, setDisplay] = useState("0");
  const hasAnimated = useRef(false);

  useEffect(() => {
    if (!isInView || hasAnimated.current) return;
    hasAnimated.current = true;

    const start = 0;
    const duration = 1800;
    const startTime = performance.now();

    function update(now: number) {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      const current = start + (value - start) * eased;
      setDisplay(decimals > 0 ? current.toFixed(decimals) : Math.floor(current).toString());
      if (progress < 1) requestAnimationFrame(update);
    }

    requestAnimationFrame(update);
  }, [isInView, value, decimals]);

  return (
    <span>
      {prefix}{display}{suffix}
    </span>
  );
}

export default function Stats() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section className="relative py-24 px-6 overflow-hidden">
      <div className="absolute inset-0 border-y border-white/5" />
      <div className="absolute inset-0 bg-gradient-to-r from-brand-purple-dark/30 via-transparent to-brand-blue-dark/30" />

      <div className="relative max-w-5xl mx-auto" ref={ref}>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5 }}
          className="text-center mb-12"
        >
          <p className="text-white/40 text-sm uppercase tracking-widest">O mercado em números</p>
        </motion.div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {STATS.map((stat, i) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 30 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              className="text-center"
            >
              <div className="text-3xl md:text-4xl font-black gradient-text mb-2">
                <CountUp
                  value={stat.value}
                  prefix={stat.prefix}
                  suffix={stat.suffix}
                  decimals={stat.decimals}
                  isInView={isInView}
                />
              </div>
              <p className="text-white/40 text-xs leading-relaxed">{stat.label}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
