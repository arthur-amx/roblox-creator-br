import { ImageResponse } from "next/og";

export const runtime = "edge";
export const alt = "Roblox Creator BR — Crie skins com IA e ganhe Robux";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OgImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "1200px",
          height: "630px",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          background: "linear-gradient(135deg, #0a0a0f 0%, #1a0533 50%, #0d1f3c 100%)",
          fontFamily: "system-ui, sans-serif",
          position: "relative",
        }}
      >
        {/* Glow blobs */}
        <div
          style={{
            position: "absolute",
            top: "80px",
            left: "100px",
            width: "400px",
            height: "400px",
            borderRadius: "50%",
            background: "rgba(124,58,237,0.25)",
            filter: "blur(80px)",
          }}
        />
        <div
          style={{
            position: "absolute",
            bottom: "60px",
            right: "80px",
            width: "320px",
            height: "320px",
            borderRadius: "50%",
            background: "rgba(29,78,216,0.2)",
            filter: "blur(80px)",
          }}
        />

        {/* Badge */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "8px",
            padding: "8px 20px",
            borderRadius: "999px",
            border: "1px solid rgba(168,85,247,0.4)",
            background: "rgba(124,58,237,0.15)",
            color: "#a855f7",
            fontSize: "18px",
            fontWeight: 600,
            marginBottom: "32px",
          }}
        >
          ✦ Geração de skins com IA — exclusivo Brasil
        </div>

        {/* Headline */}
        <div
          style={{
            fontSize: "72px",
            fontWeight: 900,
            color: "white",
            textAlign: "center",
            lineHeight: 1,
            marginBottom: "16px",
            letterSpacing: "-2px",
          }}
        >
          A picareta da
        </div>
        <div
          style={{
            fontSize: "72px",
            fontWeight: 900,
            textAlign: "center",
            lineHeight: 1,
            marginBottom: "32px",
            letterSpacing: "-2px",
            background: "linear-gradient(135deg, #a855f7 0%, #7c3aed 40%, #1d4ed8 100%)",
            backgroundClip: "text",
            color: "transparent",
          }}
        >
          corrida do ouro do Roblox.
        </div>

        {/* Sub */}
        <div
          style={{
            fontSize: "24px",
            color: "rgba(255,255,255,0.55)",
            textAlign: "center",
            maxWidth: "700px",
            lineHeight: 1.5,
            marginBottom: "48px",
          }}
        >
          Prompt em português → skin publicada no Marketplace → Robux na sua conta.
        </div>

        {/* Stats row */}
        <div style={{ display: "flex", gap: "40px" }}>
          {[
            { value: "US$ 330M", label: "mercado UGC" },
            { value: "até 75%", label: "de royalties" },
            { value: "< 30s", label: "para gerar" },
          ].map((s) => (
            <div
              key={s.label}
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                padding: "16px 32px",
                borderRadius: "16px",
                border: "1px solid rgba(255,255,255,0.08)",
                background: "rgba(255,255,255,0.04)",
              }}
            >
              <span style={{ fontSize: "28px", fontWeight: 800, color: "#a855f7" }}>{s.value}</span>
              <span style={{ fontSize: "14px", color: "rgba(255,255,255,0.4)", marginTop: "4px" }}>{s.label}</span>
            </div>
          ))}
        </div>

        {/* Bottom logo */}
        <div
          style={{
            position: "absolute",
            bottom: "32px",
            right: "48px",
            fontSize: "20px",
            fontWeight: 700,
            color: "rgba(255,255,255,0.3)",
          }}
        >
          CreatorBR
        </div>
      </div>
    ),
    { ...size }
  );
}
