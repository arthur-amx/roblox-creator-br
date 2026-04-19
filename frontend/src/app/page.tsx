import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import SkinTicker from "@/components/SkinTicker";
import Stats from "@/components/Stats";
import HowItWorks from "@/components/HowItWorks";
import Gallery from "@/components/Gallery";
import Calculator from "@/components/Calculator";
import Pricing from "@/components/Pricing";
import Faq from "@/components/FAQ";
import Waitlist from "@/components/Waitlist";
import Footer from "@/components/Footer";

export default function Home() {
  return (
    <main className="min-h-screen bg-surface overflow-x-hidden">
      <Navbar />
      <Hero />
      <SkinTicker />
      <Stats />

      {/* Elevated surface band */}
      <div className="relative bg-white/[0.018]">
        <HowItWorks />
      </div>

      <Gallery />

      {/* Elevated surface band */}
      <div className="relative bg-white/[0.018]">
        <Calculator />
      </div>

      <Pricing />

      {/* Elevated surface band */}
      <div className="relative bg-white/[0.018]">
        <Faq />
      </div>

      <Waitlist />
      <Footer />
    </main>
  );
}
