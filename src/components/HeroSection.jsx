import React, { useState, useEffect } from 'react';

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
    <section className="relative min-h-screen flex items-center justify-center pt-20 pb-16 overflow-hidden bg-slate-950">
      
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

      {/* Main Hero Editorial Content - Perfectly Centered */}
      <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 w-full text-center text-white flex flex-col items-center justify-center my-auto">
        <div className="max-w-3xl mx-auto">
          {/* Manuscrita / Script Elegante sin negrita (tamaño moderado y equilibrado) */}
          <span className="block font-script font-normal text-3xl sm:text-5xl md:text-6xl text-amber-100/95 tracking-normal normal-case capitalize leading-tight drop-shadow-[0_4px_16px_rgba(0,0,0,0.95)]">
            La Cocina Andina,
          </span>

          {/* Subtítulo Principal Armonioso */}
          <h1 className="font-serif text-xl sm:text-3xl md:text-4xl font-bold tracking-[0.15em] sm:tracking-[0.18em] text-transparent bg-clip-text bg-gradient-to-r from-amber-300 via-amber-400 to-amber-200 uppercase drop-shadow-[0_4px_16px_rgba(0,0,0,0.95)] mt-1 sm:mt-2 leading-snug">
            NUESTRO LEGADO AL MUNDO
          </h1>
        </div>
      </div>
    </section>
  );
}
