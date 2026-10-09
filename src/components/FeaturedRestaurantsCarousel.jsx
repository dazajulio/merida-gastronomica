import React, { useRef, useState, useEffect } from 'react';
import { 
  Sparkles, 
  ChevronLeft, 
  ChevronRight, 
  ArrowRight, 
  Award, 
  Star, 
  MapPin, 
  ShieldCheck, 
  Mountain,
  Compass,
  Utensils
} from 'lucide-react';
import { RestaurantCard } from './RestaurantCard';

export function FeaturedRestaurantsCarousel({ 
  restaurants = [], 
  onSelectRestaurant, 
  onViewOnMap, 
  onExploreAll,
  t 
}) {
  const scrollContainerRef = useRef(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);

  // Ordenar: Los marcados como destacados (destacado_portada: true) primero, luego el resto
  const sortedRestaurants = React.useMemo(() => {
    if (!Array.isArray(restaurants)) return [];
    return [...restaurants].sort((a, b) => {
      const aFeatured = a.isFeatured || a.destacado_portada ? 1 : 0;
      const bFeatured = b.isFeatured || b.destacado_portada ? 1 : 0;
      if (bFeatured !== aFeatured) return bFeatured - aFeatured;
      return (b.rating || 5) - (a.rating || 5);
    });
  }, [restaurants]);

  const checkScroll = () => {
    const el = scrollContainerRef.current;
    if (!el) return;
    setCanScrollLeft(el.scrollLeft > 10);
    setCanScrollRight(el.scrollLeft < el.scrollWidth - el.clientWidth - 15);
  };

  useEffect(() => {
    checkScroll();
    window.addEventListener('resize', checkScroll);
    return () => window.removeEventListener('resize', checkScroll);
  }, [sortedRestaurants]);

  const scrollByAmount = (direction) => {
    const el = scrollContainerRef.current;
    if (!el) return;
    const cardWidth = 380; // approximate width of card + gap
    const scrollAmount = direction === 'left' ? -cardWidth : cardWidth;
    el.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    setTimeout(checkScroll, 350);
  };

  const featuredCount = sortedRestaurants.filter(r => r.isFeatured || r.destacado_portada).length;

  if (sortedRestaurants.length === 0) {
    return null;
  }

  return (
    <div className="border-t border-slate-200 bg-white py-16 relative overflow-hidden">
      {/* Background Accent Subtle Glow */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-amber-100/40 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3 pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-emerald-100/30 rounded-full blur-3xl translate-y-1/2 -translate-x-1/3 pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        
        {/* Header Strip */}
        <div className="flex flex-col md:flex-row items-start md:items-end justify-between mb-8 gap-4">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="text-xs uppercase font-extrabold text-amber-800 flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-50 border border-amber-200">
                <Sparkles className="w-3.5 h-3.5 text-amber-600 animate-pulse" />
                Joyas Culinarias de la Cordillera
              </span>
              {featuredCount > 0 && (
                <span className="text-[10px] font-extrabold uppercase px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-900 border border-emerald-300">
                  {featuredCount} {featuredCount === 1 ? 'Selección Oficial' : 'Selecciones Oficiales'}
                </span>
              )}
            </div>

            <h2 className="font-serif text-3xl sm:text-4xl font-black text-slate-900 uppercase tracking-tight">
              Restaurantes Destacados & Cocina de Autor
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 mt-1 max-w-2xl font-sans">
              Deslice lateralmente para explorar los establecimientos agremiados con los más altos estándares de calidad, producto de origen andino y hospitalidad de Mérida.
            </p>
          </div>

          <div className="flex items-center gap-3 self-end md:self-auto font-sans">
            {/* Carousel Navigation Buttons */}
            <div className="flex items-center gap-1.5 bg-slate-100 p-1 rounded-2xl border border-slate-200">
              <button
                onClick={() => scrollByAmount('left')}
                disabled={!canScrollLeft}
                className={`p-2.5 rounded-xl transition-all ${
                  canScrollLeft
                    ? 'bg-white text-slate-900 shadow-xs hover:bg-amber-50 hover:text-amber-800 hover:scale-105 active:scale-95'
                    : 'text-slate-400 cursor-not-allowed opacity-50'
                }`}
                title="Ver anteriores"
                aria-label="Desplazar a la izquierda"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              <button
                onClick={() => scrollByAmount('right')}
                disabled={!canScrollRight}
                className={`p-2.5 rounded-xl transition-all ${
                  canScrollRight
                    ? 'bg-white text-slate-900 shadow-xs hover:bg-amber-50 hover:text-amber-800 hover:scale-105 active:scale-95'
                    : 'text-slate-400 cursor-not-allowed opacity-50'
                }`}
                title="Ver siguientes"
                aria-label="Desplazar a la derecha"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>

            {/* Direct Link to Full Directory */}
            {onExploreAll && (
              <button
                onClick={onExploreAll}
                className="py-3 px-5 rounded-2xl bg-amber-500 hover:bg-amber-600 text-slate-950 font-serif font-black text-xs uppercase tracking-wider flex items-center gap-2 shadow-sm transition-all active:scale-98"
              >
                <span>Ver Todos ({sortedRestaurants.length})</span>
                <ArrowRight className="w-4 h-4 text-slate-950" />
              </button>
            )}
          </div>
        </div>

        {/* Carousel Slider Track */}
        <div 
          ref={scrollContainerRef}
          onScroll={checkScroll}
          className="flex gap-6 overflow-x-auto pb-6 pt-2 scroll-smooth snap-x snap-mandatory scrollbar-none"
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        >
          {sortedRestaurants.map((restaurant) => {
            const isFeatured = restaurant.isFeatured || restaurant.destacado_portada;
            return (
              <div 
                key={restaurant.id}
                className="w-[300px] sm:w-[360px] md:w-[380px] shrink-0 snap-start transition-all duration-300 relative flex flex-col"
              >
                {/* Special Star ribbon for explicitly featured */}
                {isFeatured && (
                  <div className="absolute -top-2.5 left-4 z-10">
                    <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider bg-gradient-to-r from-amber-500 to-amber-600 text-slate-950 shadow-md border border-amber-300 font-sans">
                      <Star className="w-3 h-3 fill-slate-950 text-slate-950" />
                      <span>Destacado Oficial</span>
                    </span>
                  </div>
                )}

                <div className={`h-full flex flex-col ${isFeatured ? 'ring-2 ring-amber-400/80 rounded-3xl' : ''}`}>
                  <RestaurantCard 
                    restaurant={restaurant}
                    onSelect={onSelectRestaurant}
                    onViewOnMap={onViewOnMap}
                    t={t}
                  />
                </div>
              </div>
            );
          })}
        </div>

        {/* Footer Carousel Bar */}
        <div className="mt-4 flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 border-t border-slate-100 text-xs text-slate-500 font-sans">
          <div className="flex items-center gap-2">
            <span className="inline-block w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
            <span>Mostrando <strong>{sortedRestaurants.length}</strong> establecimientos miembros solventes</span>
          </div>

          <div className="flex items-center gap-3">
            <span className="text-[11px] text-slate-400 hidden sm:inline">
              Desliza horizontalmente para ver más opciones &rarr;
            </span>
            {onExploreAll && (
              <button 
                onClick={onExploreAll}
                className="text-amber-800 font-bold hover:underline flex items-center gap-1"
              >
                <span>Explorar Guía con Filtros por Municipio y Eje</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </div>

      </div>
    </div>
  );
}
