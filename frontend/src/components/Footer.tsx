import { Zap } from "lucide-react";

export default function Footer() {
  return (
    <footer className="border-t border-white/5 py-12 px-6">
      <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
        {/* Logo */}
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-brand-purple to-brand-blue flex items-center justify-center">
            <Zap className="w-3.5 h-3.5 text-white" fill="white" />
          </div>
          <span className="font-bold text-white text-sm tracking-tight">
            Creator<span className="gradient-text">BR</span>
          </span>
        </div>

        {/* Links */}
        <div className="flex items-center gap-6 text-xs text-white/30">
          <a href="#" className="hover:text-white/60 transition-colors">Termos de uso</a>
          <a href="#" className="hover:text-white/60 transition-colors">Privacidade</a>
          <a href="https://wa.me/5511999999999" className="hover:text-white/60 transition-colors">Contato via WhatsApp</a>
        </div>

        {/* Copyright */}
        <p className="text-xs text-white/20">
          © 2026 Roblox Creator BR. Não afiliado ao Roblox Corporation.
        </p>
      </div>
    </footer>
  );
}
