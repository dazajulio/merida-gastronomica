import React, { useState, useEffect } from 'react';
import { ShieldCheck } from 'lucide-react';

export function HeroSection() {
  const [scrollY, setScrollY] = useState(0);

  // Parallax scroll listener
  useEffect(() => {
    const handleScroll = () => {
      setScrollY(window.scrollY);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <section className="relative min-h-[85vh] sm:min-h-[92vh] flex items-center justify-center pt-24 pb-16 overflow-hidden bg-slate-950">
      
      {/* High-Resolution Hero Background with Smooth Parallax Scroll */}
      <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
        <div 
          className="absolute inset-0 w-full h-[120%] -top-[10%] will-change-transform"
          style={{
            transform: `translate3d(0, ${scrollY * 0.35}px, 0)`,
            transition: 'transform 0.05s ease-out'
          }}
        >
          <img 
            src="/images/merida_hero_gastronomica.jpg" 
            alt="Mérida Gastronómica - Tradición culinaria frente a los Andes"
            className="w-full h-full object-cover object-center filter saturate-[1.12] brightness-[0.98]"
          />
        </div>

        {/* Minimal soft vignette overlay: keeps food and mountain details crystal clear */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-black/45" />
        <div className="absolute inset-0 bg-black/15" />
      </div>

      {/* Main Hero Editorial Content */}
      <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 w-full text-center text-white flex flex-col items-center justify-center">
        
        {/* Prestige Institutional Badge (Translucent & Soft) */}
        <div className="inline-flex items-center gap-2.5 px-5 py-2 rounded-full bg-black/40 backdrop-blur-md border border-white/25 mb-8 shadow-xl animate-fadeIn">
          <ShieldCheck className="w-4 h-4 text-amber-400 shrink-0" />
          <span className="text-[11px] sm:text-xs font-bold tracking-[0.2em] uppercase text-white font-sans">
            CÁMARA GASTRONÓMICA DEL ESTADO MÉRIDA
          </span>
        </div>

        {/* Clean, Majestic & Elegant Typography */}
        <div className="max-w-4xl mx-auto">
          {/* Manuscrita / Script Elegante sin negrita */}
          <span className="block font-script font-normal text-5xl sm:text-7xl md:text-8xl lg:text-9xl text-amber-100/95 tracking-normal normal-case capitalize leading-[1.1] drop-shadow-[0_4px_24px_rgba(0,0,0,0.95)]">
            La Cocina Andina,
          </span>

          {/* Subtítulo Principal de Alto Impacto */}
          <h1 className="font-serif text-2xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-widest text-transparent bg-clip-text bg-gradient-to-r from-amber-300 via-amber-400 to-amber-200 uppercase drop-shadow-[0_4px_24px_rgba(0,0,0,0.95)] mt-2 sm:mt-4 leading-tight">
            NUESTRO LEGADO AL MUNDO
          </h1>
        </div>

      </div>
    </section>
  );
}
