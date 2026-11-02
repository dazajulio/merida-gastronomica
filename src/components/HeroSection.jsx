import React, { useState, useEffect } from 'react';

const SPONSORS = [
  { name: 'Empresas Polar', logo: '/images/patrocinantes/polar.png' },
  { name: 'Suraki', logo: '/images/patrocinantes/suraki.png' },
  { name: 'Pasapalos El Caldero', logo: '/images/patrocinantes/el-caldero.png' },
  { name: 'Lácteos Santa María', logo: '/images/patrocinantes/santa-maria.png' },
];

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

      {/* Bottom Sponsors Bar - Elegant, non-disruptive, symmetrical & translucent */}
      <div className="absolute bottom-5 sm:bottom-7 left-0 right-0 z-10 flex flex-col items-center justify-center px-4 pointer-events-auto">
        <span className="text-[10px] sm:text-[11px] font-sans uppercase tracking-[0.24em] text-amber-100/75 font-medium mb-2.5 drop-shadow-[0_2px_8px_rgba(0,0,0,0.8)]">
          Patrocinantes Oficiales
        </span>
        <div className="flex items-center justify-center gap-3.5 sm:gap-5 md:gap-7">
          {SPONSORS.map((sponsor) => (
            <div
              key={sponsor.name}
              title={sponsor.name}
              className="w-13 h-13 sm:w-16 sm:h-16 rounded-full bg-white/75 hover:bg-white/95 backdrop-blur-md border border-white/30 shadow-lg flex items-center justify-center p-2 sm:p-2.5 transition-all duration-300 hover:scale-105 opacity-75 hover:opacity-100 cursor-pointer group"
            >
              <img
                src={sponsor.logo}
                alt={sponsor.name}
                className="w-full h-full object-contain filter drop-shadow-2xs transition-transform duration-300 group-hover:scale-105"
              />
            </div>
          ))}
        </div>
      </div>

    </section>
  );
}
