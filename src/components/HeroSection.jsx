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
    <section className="relative min-h-screen flex items-center justify-center pt-28 pb-20 overflow-hidden bg-slate-950">
      
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

        {/* Minimal soft vignette overlay: keeps all food and mountain details crystal clear */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/20 to-black/45" />
        <div className="absolute inset-0 bg-black/10" />
      </div>

      {/* Main Hero Editorial Content */}
      <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 w-full text-center text-white flex flex-col items-center justify-center">
        
        {/* Prestige Institutional Badge (Translucent & Soft) */}
        <div className="inline-flex items-center gap-2 px-4 sm:px-5 py-1.5 sm:py-2 rounded-full bg-black/40 backdrop-blur-md border border-white/25 mb-6 sm:mb-8 shadow-xl animate-fadeIn">
          <ShieldCheck className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-amber-400 shrink-0" />
          <span className="text-[10px] sm:text-xs font-bold tracking-[0.18em] sm:tracking-[0.2em] uppercase text-white font-sans">
            CÁMARA GASTRONÓMICA DEL ESTADO MÉRIDA
          </span>
        </div>

        {/* Unified, Minimalist & Elegant Brand Title (No Bold, Sobrio, Alta Gama) */}
        <div className="max-w-4xl mx-auto">
          <h1 className="font-sans font-light text-4xl sm:text-6xl md:text-7xl lg:text-8xl tracking-[0.2em] sm:tracking-[0.25em] md:tracking-[0.28em] text-white uppercase drop-shadow-[0_4px_24px_rgba(0,0,0,0.95)] leading-tight select-none">
            MÉRIDA GASTRONÓMICA
          </h1>

          {/* Subtítulo / Slogan Sobrio */}
          <p className="mt-4 sm:mt-6 text-xs sm:text-sm md:text-base font-light tracking-[0.2em] sm:tracking-[0.25em] text-amber-200/90 uppercase drop-shadow-[0_2px_12px_rgba(0,0,0,0.9)]">
            La Cocina Andina · Nuestro Legado al Mundo
          </p>
        </div>

      </div>
    </section>
  );
}
