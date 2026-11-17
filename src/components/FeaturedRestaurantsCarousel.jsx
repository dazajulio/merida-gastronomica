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
import { isClassifiedRestaurant } from './RestaurantGuide';

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

  // Filtrar solo restaurantes clasificados y ordenar destacados primero
  const sortedRestaurants = React.useMemo(() => {
    if (!Array.isArray(restaurants)) return [];
    return restaurants
      .filter(isClassifiedRestaurant)
      .sort((a, b) => {
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
    <div className="bg-white py-16 sm:py-20 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        
        {/* Editorial Header Strip (Abdullah Tariq Inspired) */}
        <div className="flex flex-col md:flex-row items-start md:items-end justify-between mb-10 gap-6">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="text-[11px] uppercase tracking-[0.2em] font-bold text-[#C85A32]">
                Selección Oficial CGEM
              </span>
              {featuredCount > 0 && (
                <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-[#FAF3EB] text-[#C85A32] border border-[#EAE3D5]">
                  {featuredCount} {featuredCount === 1 ? 'Destacado' : 'Destacados'}
                </span>
              )}
            </div>

            <h2 className="font-playfair text-3xl sm:text-4xl font-bold text-[#1E1C1A] tracking-tight">
              Guía de <span className="italic font-normal text-[#C85A32]">Restaurantes</span>
            </h2>
            <p className="text-xs sm:text-sm text-[#5C554E] mt-2 max-w-2xl font-sans leading-relaxed">
              Explora los restaurantes, cafés de especialidad y posadas agremiadas que representan lo mejor de la gastronomía merideña.
            </p>
          </div>

          <div className="flex items-center gap-3 self-end md:self-auto font-sans">
            {/* Carousel Navigation Buttons */}
            <div className="flex items-center gap-1 bg-[#FAF7F2] p-1 rounded-full border border-[#EAE3D5]">
              <button
                onClick={() => scrollByAmount('left')}
                disabled={!canScrollLeft}
                className={`p-2 rounded-full transition-all ${
                  canScrollLeft
                    ? 'bg-white text-[#1E1C1A] shadow-2xs hover:bg-[#FAF3EB] hover:text-[#C85A32]'
                    : 'text-[#B5ADA4] cursor-not-allowed opacity-50'
                }`}
                title="Ver anteriores"
                aria-label="Desplazar a la izquierda"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button
                onClick={() => scrollByAmount('right')}
                disabled={!canScrollRight}
                className={`p-2 rounded-full transition-all ${
                  canScrollRight
                    ? 'bg-white text-[#1E1C1A] shadow-2xs hover:bg-[#FAF3EB] hover:text-[#C85A32]'
                    : 'text-[#B5ADA4] cursor-not-allowed opacity-50'
                }`}
                title="Ver siguientes"
                aria-label="Desplazar a la derecha"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>

            {/* Direct Link to Full Directory */}
            {onExploreAll && (
              <button
                onClick={onExploreAll}
                className="py-2.5 px-5 rounded-full bg-white hover:bg-[#FAF3EB] text-[#1E1C1A] border border-[#DED5C5] font-sans font-semibold text-xs flex items-center gap-2 shadow-2xs transition-all"
              >
                <span>Ver Todos ({sortedRestaurants.length})</span>
                <ArrowRight className="w-3.5 h-3.5 text-[#C85A32]" />
              </button>
            )}
          </div>
        </div>

        {/* Carousel Slider Track - Compact "Selected Projects" Style Cards */}
        <div 
          ref={scrollContainerRef}
          onScroll={checkScroll}
          className="flex gap-5 overflow-x-auto pb-4 pt-2 scroll-smooth snap-x snap-mandatory scrollbar-none"
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        >
          {sortedRestaurants.map((restaurant) => {
            const isFeatured = restaurant.isFeatured || restaurant.destacado_portada;
            const imgSrc = restaurant.coverImage || restaurant.image || restaurant.foto_portada || 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=800&q=80';
            const categoryLabel = restaurant.category || restaurant.categoria_negocio || 'Gastronomía';
            const shortDesc = restaurant.description || restaurant.observaciones || `${restaurant.zone || restaurant.municipio || 'Mérida'}, Estado Mérida.`;

            return (
              <div 
                key={restaurant.id}
                onClick={() => onSelectRestaurant && onSelectRestaurant(restaurant)}
                className="w-[260px] sm:w-[290px] shrink-0 snap-start rounded-2xl bg-[#FAF7F2]/60 hover:bg-white border border-[#EAE3D5] hover:border-[#C85A32]/60 shadow-2xs hover:shadow-md transition-all duration-300 p-2.5 flex flex-col cursor-pointer group"
              >
                {/* Compact Top Image */}
                <div className="h-40 w-full rounded-xl overflow-hidden bg-[#F2ECE1] relative">
                  <img
                    src={imgSrc}
                    alt={restaurant.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    loading="lazy"
                  />
                  {isFeatured && (
                    <span className="absolute top-2.5 right-2.5 inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[9px] font-bold bg-white/95 text-[#C85A32] shadow-xs border border-[#EAE3D5]">
                      <Star className="w-2.5 h-2.5 fill-[#C85A32] text-[#C85A32]" />
                      <span>Destacado</span>
                    </span>
                  )}
                </div>

                {/* Compact Card Body */}
                <div className="pt-3 px-1.5 pb-1 flex-1 flex flex-col justify-between gap-2">
                  <div>
                    <span className="inline-block px-2 py-0.5 rounded-full bg-[#C85A32] text-white text-[9px] font-bold tracking-wide mb-1.5 max-w-full truncate">
                      {categoryLabel}
                    </span>

                    <div className="flex items-end justify-between gap-2">
                      <div className="min-w-0 flex-1">
                        <h3 className="font-playfair font-bold text-base text-[#1E1C1A] group-hover:text-[#C85A32] transition-colors truncate">
                          {restaurant.name}
                        </h3>
                        <p className="text-[11px] text-[#5C554E] line-clamp-2 mt-0.5 leading-snug">
                          {shortDesc}
                        </p>
                      </div>

                      <div className="w-8 h-8 rounded-full border border-[#EAE3D5] bg-white group-hover:bg-[#C85A32] group-hover:text-white group-hover:border-[#C85A32] text-[#1E1C1A] flex items-center justify-center shrink-0 transition-colors">
                        <ArrowRight className="w-3.5 h-3.5" />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Footer Carousel Bar */}
        <div className="mt-4 flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 border-t border-[#EAE3D5]/70 text-xs text-[#7A7168] font-sans">
          <div className="flex items-center gap-2">
            <span className="inline-block w-2 h-2 rounded-full bg-[#C85A32]" />
            <span>Mostrando <strong className="text-[#1E1C1A]">{sortedRestaurants.length}</strong> establecimientos miembros</span>
          </div>

          <div className="flex items-center gap-3">
            {onExploreAll && (
              <button 
                onClick={onExploreAll}
                className="text-[#C85A32] font-bold hover:underline flex items-center gap-1"
              >
                <span>Explorar Guía Completa</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </div>

      </div>
    </div>
  );
}
