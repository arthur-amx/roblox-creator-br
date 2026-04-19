"use client";

const ITEMS = [
  { user: "Mateus_BR", skin: "Hoodie Cyberpunk Roxo", robux: 85, color: "#a855f7" },
  { user: "Ana_Gamer", skin: "Armadura Cavaleiro Neon", robux: 110, color: "#38bdf8" },
  { user: "Felipe_Dev", skin: "Traje Samurai Vermelho", robux: 120, color: "#f43f5e" },
  { user: "Julia_Play", skin: "Astronauta Dourado", robux: 95, color: "#fbbf24" },
  { user: "Rafa_UGC", skin: "Capa de Mago Sombrio", robux: 80, color: "#818cf8" },
  { user: "Bru_Skin", skin: "Jaqueta Streetwear Roxa", robux: 65, color: "#c084fc" },
  { user: "Caio_R", skin: "Colete Tático Militar", robux: 70, color: "#4ade80" },
  { user: "Mari_BR", skin: "Camisa Havaiana Neon", robux: 45, color: "#fb7185" },
  { user: "Vitor_UGC", skin: "Armadura Dragão Dourado", robux: 150, color: "#fde68a" },
  { user: "Lara_Play", skin: "Hoodie Cyber Pink", robux: 75, color: "#f472b6" },
  { user: "Davi_Skin", skin: "Uniforme Espacial Azul", robux: 100, color: "#60a5fa" },
  { user: "Pedro_BR", skin: "Colete Ninja Preto", robux: 90, color: "#94a3b8" },
];

function TickerRow({ reverse = false }: { reverse?: boolean }) {
  const items = reverse ? [...ITEMS].reverse() : ITEMS;
  const doubled = [...items, ...items];

  return (
    <div className="flex overflow-hidden">
      <div
        className="flex gap-3 py-1"
        style={{
          animation: `ticker-scroll${reverse ? "-reverse" : ""} 32s linear infinite`,
          whiteSpace: "nowrap",
        }}
      >
        {doubled.map((item, i) => (
          <div
            key={`${item.user}-${i}`}
            className="flex-shrink-0 flex items-center gap-2.5 px-4 py-2.5 rounded-xl border border-white/6 bg-surface-card/50 backdrop-blur-sm"
          >
            {/* Avatar dot */}
            <div
              className="w-6 h-6 rounded-full flex-shrink-0 flex items-center justify-center text-[10px] font-bold text-white"
              style={{ background: `linear-gradient(135deg, ${item.color}88, ${item.color}44)`, border: `1px solid ${item.color}44` }}
            >
              {item.user[0]}
            </div>
            <div className="flex items-center gap-1.5">
              <span className="text-white/40 text-xs">{item.user}</span>
              <span className="text-white/20 text-xs">criou</span>
              <span className="text-white/70 text-xs font-medium">{item.skin}</span>
              <span className="text-white/20 text-xs">·</span>
              <span className="text-xs font-bold" style={{ color: item.color }}>{item.robux} R$</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function SkinTicker() {
  return (
    <section className="relative py-16 overflow-hidden border-y border-white/5">
      {/* Fade edges */}
      <div className="absolute left-0 top-0 bottom-0 w-24 z-10 bg-gradient-to-r from-surface to-transparent pointer-events-none" />
      <div className="absolute right-0 top-0 bottom-0 w-24 z-10 bg-gradient-to-l from-surface to-transparent pointer-events-none" />

      <div className="mb-3">
        <div className="text-center mb-4">
          <span className="text-xs text-white/25 uppercase tracking-widest font-mono">
            ⬤ Skins criadas em tempo real
          </span>
        </div>
        <TickerRow />
      </div>
      <TickerRow reverse />

      <style jsx>{`
        @keyframes ticker-scroll {
          from { transform: translateX(0); }
          to { transform: translateX(-50%); }
        }
        @keyframes ticker-scroll-reverse {
          from { transform: translateX(-50%); }
          to { transform: translateX(0); }
        }
      `}</style>
    </section>
  );
}
