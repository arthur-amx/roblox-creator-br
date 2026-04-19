import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";

const BASE_URL = "https://robloxcreatorbr.com.br";

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

export const metadata: Metadata = {
  metadataBase: new URL(BASE_URL),
  title: "Roblox Creator BR — Crie skins com IA e ganhe Robux",
  description:
    "A plataforma brasileira que transforma um prompt em português numa skin publicada no Roblox Marketplace. Crie, publique e receba royalties em Robux.",
  keywords: ["roblox", "skin roblox", "ugc roblox", "criar skin roblox", "robux", "criador roblox brasil", "ia roblox", "geração skin ia"],
  authors: [{ name: "Roblox Creator BR" }],
  alternates: {
    canonical: BASE_URL,
  },
  openGraph: {
    title: "Roblox Creator BR — A picareta da corrida do ouro do Roblox",
    description:
      "Escreva um prompt em português. A IA cria sua skin. Publique no Marketplace. Ganhe Robux.",
    type: "website",
    locale: "pt_BR",
    siteName: "Roblox Creator BR",
    url: BASE_URL,
  },
  twitter: {
    card: "summary_large_image",
    title: "Roblox Creator BR — Crie skins com IA",
    description: "Escreva um prompt. A IA cria. Você ganha Robux.",
  },
  robots: { index: true, follow: true },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "SoftwareApplication",
  name: "Roblox Creator BR",
  applicationCategory: "GameApplication",
  operatingSystem: "Web",
  description:
    "Plataforma SaaS brasileira para criação de skins e itens UGC para o Roblox via prompt em português, com publicação automática no Marketplace e repasse de royalties.",
  url: BASE_URL,
  offers: [
    {
      "@type": "Offer",
      name: "Explorador",
      price: "0",
      priceCurrency: "BRL",
      description: "1 skin 2D por mês, 50% de royalties",
    },
    {
      "@type": "Offer",
      name: "Criador",
      price: "29",
      priceCurrency: "BRL",
      description: "5 skins 2D + 1 item 3D por mês, 65% de royalties",
    },
    {
      "@type": "Offer",
      name: "Estúdio",
      price: "79",
      priceCurrency: "BRL",
      description: "20 skins 2D + 5 itens 3D por mês, 75% de royalties",
    },
  ],
  inLanguage: "pt-BR",
  audience: {
    "@type": "Audience",
    audienceType: "Gamers, Criadores de Conteúdo, Jogadores de Roblox",
    geographicArea: { "@type": "Country", name: "Brazil" },
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR" className="dark">
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-surface text-white`}
      >
        {children}
      </body>
    </html>
  );
}
