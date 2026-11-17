import React from 'react';
import { ArrowRight, Check } from 'lucide-react';

export function ElValleSpotlightSection({ onExplore }) {
  const highlights = [
    'Posadas y alojamientos de montaña',
    'Restaurantes, cafés y gastronomía local',
    'Parques temáticos y naturaleza viva',
    'Guías certificados en El Valle y La Culata',
  ];

  return (
    <section className="relative py-16 sm:py-20 bg-[#FAF7F2] border-t border-[#EAE3D5] overflow-hidden">
      {/* Full-Bleed Scenic Background Image (El Valle / La Culata) */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        <img
          src="/images/el-valle-paisaje.jpg"
          alt="Paisaje andino de El Valle y La Culata, Mérida"
          className="w-full h-full object-cover object-center"
        />

        {/* Mobile light readability veil */}
        <div className="absolute inset-0 bg-[#FAF7F2]/88 lg:hidden" />

        {/* Desktop Seamless Melt Gradient (matches Solara Stays reference layout) */}
        <div
          className="hidden lg:block absolute inset-0"
          style={{
            background:
              'linear-gradient(90deg, rgba(250, 247, 242, 0.18) 0%, rgba(250, 247, 242, 0.92) 34%, rgba(250, 247, 242, 0.96) 58%, rgba(250, 247, 242, 0.42) 80%, rgba(250, 247, 242, 0.05) 100%)',
          }}
        />

        {/* Subtle Top & Bottom Transitions */}
        <div className="absolute inset-x-0 top-0 h-16 bg-gradient-to-b from-[#FAF7F2] to-transparent" />
        <div className="absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-[#FAF7F2] to-transparent" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-center">
          
          {/* Left: Organic Rounded Pill Showcase for El Valle te Conecta Logo */}
          <div className="lg:col-span-5 flex justify-center lg:justify-start">
            <div className="relative w-full max-w-[230px] sm:max-w-[360px] lg:max-w-[400px] aspect-[4/3] rounded-[2.25rem] sm:rounded-[3.5rem] bg-white/95 backdrop-blur-md p-4 sm:p-8 shadow-xl border-4 border-white flex items-center justify-center overflow-hidden">
              <img
                src="/images/el-valle-logo.jpg"
                alt="El Valle te Conecta - Ruta Turística Certificada"
                className="w-full h-full object-contain hover:scale-105 transition-transform duration-500"
              />
            </div>
          </div>

          {/* Center: Editorial Copy & Checklist */}
          <div className="lg:col-span-5 space-y-4 text-left">
            <span className="text-[11px] font-bold uppercase tracking-[0.2em] text-[#C85A32] block">
              Ruta Turística Certificada
            </span>

            <div>
              <h2 className="font-playfair text-3xl sm:text-4xl font-bold text-[#1E1C1A] tracking-tight leading-tight">
                El Valle <span className="italic font-normal text-[#C85A32]">te Conecta</span>
              </h2>
              <p className="text-[11px] font-bold uppercase tracking-[0.16em] text-[#C85A32] mt-1">
                La Experiencia Andina Perfecta en Mérida
              </p>
            </div>

            <p className="text-xs sm:text-sm text-[#4F4842] leading-relaxed font-sans">
              El Valle te conecta es tu puerta de entrada a la experiencia andina perfecta en Mérida. Somos una ruta turística certificada que une las mejores posadas, restaurantes, parques y guías de El Valle y La Culata para que tú solo te preocupes por disfrutar de la montaña, el frío y la buena comida.
            </p>

            {/* Clean Checkmark Highlights */}
            <ul className="space-y-2 pt-1">
              {highlights.map((item) => (
                <li key={item} className="flex items-center gap-2.5 text-xs sm:text-[13px] font-medium text-[#1E1C1A]">
                  <Check className="w-4 h-4 text-[#C85A32] shrink-0 stroke-[2.5]" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>

            <div className="pt-3">
              <button
                type="button"
                onClick={onExplore}
                className="px-6 py-3 rounded-full bg-[#C85A32] hover:bg-[#B04B26] text-white font-sans font-bold text-xs sm:text-sm inline-flex items-center gap-2 shadow-sm transition-all active:scale-[0.98]"
              >
                <span>Explorar El Valle te Conecta</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Right: Open Scenic Area + Handwritten Note */}
          <div className="hidden lg:flex lg:col-span-2 h-full min-h-[260px] items-end justify-end pointer-events-none">
            <div className="bg-[#FAF7F2]/85 backdrop-blur-xs px-3.5 py-2 rounded-2xl border border-[#EAE3D5]/80 shadow-sm -rotate-3 mb-2">
              <span className="font-handwritten text-xl text-[#1E1C1A] leading-tight block text-center">
                “Montaña, frío
                <br />
                y buena comida”
              </span>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
