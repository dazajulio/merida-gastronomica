import React, { useState, useEffect } from 'react';
import { 
  Compass, 
  UtensilsCrossed, 
  Search, 
  Sparkles, 
  ArrowRight, 
  ShieldCheck,
  MapPin
} from 'lucide-react';

export function HeroSection({ t, setActiveTab, onQuickSearch }) {
  const [searchQuery, setSearchQuery] = useState('');
  const [scrollY, setScrollY] = useState(0);

  // Parallax scroll listener
  useEffect(() => {
    const handleScroll = () => {
      setScrollY(window.scrollY);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      onQuickSearch(searchQuery);
      setActiveTab('guide');
    }
  };

  return (
    <section className="relative min-h-[96vh] flex items-center justify-center pt-28 pb-20 overflow-hidden bg-slate-950">
      
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

        {/* Minimal soft vignette overlay: keeps all food details crystal clear */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/15 to-black/45" />
        <div className="absolute inset-0 bg-black/10" />
      </div>

      {/* Floating Location Tag (Top Right) */}
      <div className="absolute top-24 right-4 sm:right-8 z-20 hidden md:flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/85 backdrop-blur-md border border-white/60 text-slate-900 shadow-xl">
        <MapPin className="w-3.5 h-3.5 text-amber-600" />
        <span className="font-sans font-bold text-xs tracking-wide">
          Sierra Nevada & Tradición de Altura
        </span>
      </div>

      {/* Main Hero Editorial Content */}
      <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 w-full text-center text-white">
        
        {/* Prestige Institutional Badge */}
        <div className="inline-flex items-center gap-2.5 px-5 py-1.5 rounded-full bg-white/90 border border-amber-400 backdrop-blur-md mb-6 shadow-xl animate-fadeIn">
          <ShieldCheck className="w-4 h-4 text-amber-600" />
          <span className="text-[11px] sm:text-xs font-extrabold tracking-[0.2em] uppercase text-amber-900 font-sans">
            CÁMARA GASTRONÓMICA DEL ESTADO MÉRIDA
          </span>
        </div>

        {/* Clean, Majestic & Ultra-Professional Typography (Playfair Display) */}
        <h1 className="font-serif text-3xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-white max-w-4xl mx-auto leading-tight sm:leading-[1.15] uppercase drop-shadow-[0_4px_24px_rgba(0,0,0,0.95)]">
          LA COCINA ANDINA,
          <span className="block mt-1 sm:mt-2 text-transparent bg-clip-text bg-gradient-to-r from-amber-300 via-amber-400 to-amber-200 drop-shadow-[0_4px_24px_rgba(0,0,0,0.95)]">
            NUESTRO LEGADO AL MUNDO
          </span>
        </h1>

        {/* Subtitle */}
        <p className="mt-6 text-sm sm:text-lg text-slate-100 max-w-2xl mx-auto font-normal leading-relaxed drop-shadow-[0_2px_10px_rgba(0,0,0,0.95)] font-sans">
          Mérida se posiciona como marca gastronómica global. Descubra la herencia culinaria de los Andes, el café de especialidad y el cacao fino de aroma frente a las cumbres nevadas.
        </p>

        {/* Search Bar */}
        <div className="mt-8 max-w-2xl mx-auto">
          <form 
            onSubmit={handleSearchSubmit}
            className="relative flex items-center bg-white/90 backdrop-blur-xl border-2 border-amber-400 rounded-2xl p-1.5 shadow-2xl focus-within:border-amber-500 focus-within:bg-white focus-within:ring-4 focus-within:ring-amber-400/30 transition-all text-slate-900"
          >
            <div className="pl-3 pr-2 text-amber-600">
              <Search className="w-5 h-5" />
            </div>
            <input 
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Buscar trucha, pizca andina, café de altura, cacao, restaurantes..."
              className="w-full bg-transparent text-slate-900 placeholder-slate-500 text-xs sm:text-sm font-semibold focus:outline-none px-2 py-2"
            />
            <button
              type="submit"
              className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-terracotta text-white font-sans font-bold text-xs uppercase tracking-wider flex items-center gap-1.5 hover:brightness-110 active:scale-95 transition-all shadow-md shrink-0"
            >
              <span>Explorar</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </form>
        </div>

        {/* Action Buttons (White with subtle transparency) */}
        <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3.5">
          <button
            onClick={() => setActiveTab('guide')}
            className="w-full sm:w-auto px-7 py-3.5 rounded-2xl bg-white/90 hover:bg-white text-slate-900 font-sans font-bold text-sm hover:shadow-2xl transition-all duration-300 flex items-center justify-center gap-2.5 shadow-xl hover:scale-105 border border-white/60 backdrop-blur-md"
          >
            <UtensilsCrossed className="w-4 h-4 text-amber-600" />
            <span>Guía de Restaurantes & Menús</span>
          </button>

          <button
            onClick={() => setActiveTab('lidar')}
            className="w-full sm:w-auto px-7 py-3.5 rounded-2xl bg-white/80 hover:bg-white text-slate-900 border border-white/60 font-bold text-sm tracking-wide transition-all duration-300 flex items-center justify-center gap-2.5 shadow-xl backdrop-blur-md hover:scale-105"
          >
            <Compass className="w-4 h-4 text-sky-600" />
            <span>Ver Rutas en el Mapa</span>
          </button>
        </div>

        {/* Stats Grid */}
        <div className="mt-10 pt-6 border-t border-white/20 grid grid-cols-2 md:grid-cols-4 gap-3.5 max-w-4xl mx-auto">
          
          <div className="p-4 rounded-2xl bg-white/85 backdrop-blur-md border border-white/60 shadow-lg text-slate-900">
            <div className="text-2xl font-bold font-serif text-amber-700">
              45+
            </div>
            <p className="text-[11px] text-slate-700 mt-0.5 font-bold uppercase tracking-wider font-sans">
              Restaurantes Certificados
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-white/85 backdrop-blur-md border border-white/60 shadow-lg text-slate-900">
            <div className="text-2xl font-bold font-serif text-sky-700">
              4.765 m
            </div>
            <p className="text-[11px] text-slate-700 mt-0.5 font-bold uppercase tracking-wider font-sans">
              Cocina de Altura
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-white/85 backdrop-blur-md border border-white/60 shadow-lg text-slate-900">
            <div className="text-2xl font-bold font-serif text-terracotta">
              5
            </div>
            <p className="text-[11px] text-slate-700 mt-0.5 font-bold uppercase tracking-wider font-sans">
              Ejes Gastronómicos
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-white/85 backdrop-blur-md border border-white/60 shadow-lg text-slate-900">
            <div className="text-2xl font-bold font-serif text-emerald-700">
              100%
            </div>
            <p className="text-[11px] text-slate-700 mt-0.5 font-bold uppercase tracking-wider font-sans">
              Cacao & Café de Origen
            </p>
          </div>

        </div>

      </div>
    </section>
  );
}
