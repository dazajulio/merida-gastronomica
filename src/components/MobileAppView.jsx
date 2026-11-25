import React, { useState, useMemo } from 'react';
import {
  MapPin,
  Phone,
  MessageCircle,
  Compass,
  Star,
  ShieldCheck,
  Sparkles,
  ArrowRight,
  ExternalLink,
  ChevronRight,
  Clock,
  Navigation,
  Share2,
  X,
  Info,
  Utensils,
  Coffee,
  Mountain,
  Tag,
  Instagram,
  ChefHat,
  ChevronLeft,
  Plane,
  CableCar,
  Ticket,
  Bus,
  Building2
} from 'lucide-react';
import {
  CRAVE_FILTERS,
  WEEKLY_PROMOS_DATA,
  TOURIST_LOGISTICS_HUBS
} from '../data/mobileAppData';
import {
  DEFAULT_GUIDE_CATEGORIES,
  getLocalGuideCategories,
  getLocalGuideProviders
} from '../lib/guideCatalogSync';

export function MobileAppView({
  restaurants = [],
  onSelectRestaurant,
  onViewOnMap
}) {
  const [mobileTab, setMobileTab] = useState('explore'); // 'explore' | 'restaurants' | 'promos' | 'logistics'
  const [selectedCrave, setSelectedCrave] = useState('todos');
  const [selectedLogistics, setSelectedLogistics] = useState(null);
  const [activeModalRestaurant, setActiveModalRestaurant] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState(null);

  const guideCategories = useMemo(() => {
    const cats = getLocalGuideCategories();
    return Array.isArray(cats) && cats.length > 0 ? cats : DEFAULT_GUIDE_CATEGORIES;
  }, []);

  const guideProviders = useMemo(() => {
    return getLocalGuideProviders();
  }, []);

  // Helper de contacto por WhatsApp
  const handleOpenWhatsApp = (phone, text) => {
    const cleanPhone = (phone || '584148817137').replace(/[^0-9]/g, '');
    const url = `https://wa.me/${cleanPhone}?text=${encodeURIComponent(text)}`;
    window.open(url, '_blank');
  };

  // Helper de GPS / Cómo llegar
  const handleOpenGPS = (restaurant) => {
    if (restaurant.coordinates && restaurant.coordinates.lat && restaurant.coordinates.lng) {
      const url = `https://www.google.com/maps/search/?api=1&query=${restaurant.coordinates.lat},${restaurant.coordinates.lng}`;
      window.open(url, '_blank');
    } else {
      const query = encodeURIComponent(`${restaurant.name}, Mérida, Venezuela`);
      window.open(`https://www.google.com/maps/search/?api=1&query=${query}`, '_blank');
    }
  };

  // Helper de Compartir Ficha
  const handleShareRestaurant = async (r) => {
    const shareText = `¡Mira ${r.name} en la App de Mérida Gastronómica! 🍽️✨\nUbicación: ${r.location}\nhttps://meridagastronomica.com/?restaurante=${r.slug || r.id}`;
    if (navigator.share) {
      try {
        await navigator.share({
          title: `${r.name} | Mérida Gastronómica`,
          text: shareText,
          url: `https://meridagastronomica.com/?restaurante=${r.slug || r.id}`
        });
      } catch (e) {}
    } else {
      const waUrl = `https://wa.me/?text=${encodeURIComponent(shareText)}`;
      window.open(waUrl, '_blank');
    }
  };

  // Abrir Ficha de Restaurante
  const handleOpenRestaurant = (r) => {
    setActiveModalRestaurant(r);
    if (onSelectRestaurant) onSelectRestaurant(r);
  };

  // Abrir restaurante desde una tarjeta de Promo
  const handlePromoClick = (promo) => {
    const found = restaurants.find(r =>
      (r.name || '').toLowerCase().includes(promo.restaurantName.toLowerCase()) ||
      promo.restaurantName.toLowerCase().includes((r.name || '').toLowerCase())
    );
    if (found) {
      handleOpenRestaurant(found);
    } else {
      handleOpenRestaurant({
        id: promo.id,
        name: promo.restaurantName,
        location: promo.location,
        coverImage: promo.image,
        tagline: promo.title,
        description: promo.description,
        whatsapp: promo.whatsapp,
        category: promo.category,
        rating: 5.0,
        priceTier: promo.price,
        isCertifiedByCamara: true
      });
    }
  };

  // Filtrado de restaurantes por antojo táctil
  const filteredRestaurants = useMemo(() => {
    if (selectedCrave === 'todos') return restaurants;
    const craveObj = CRAVE_FILTERS.find(c => c.id === selectedCrave);
    if (!craveObj || !craveObj.keywords) return restaurants;
    return restaurants.filter((r) => {
      const catStr = `${r.category || ''} ${r.tagline || ''} ${r.description || ''}`.toLowerCase();
      return craveObj.keywords.some(kw => catStr.includes(kw));
    });
  }, [restaurants, selectedCrave]);

  // Manejar clic en una de las 8 categorías oficiales de Explora Mérida
  const handleCategoryClick = (cat) => {
    if (cat.id === 'restaurantes') {
      setSelectedCrave('todos');
      setMobileTab('restaurants');
    } else if (cat.id === 'cafeterias') {
      setSelectedCrave('cafe');
      setMobileTab('restaurants');
    } else if (cat.id === 'parques') {
      const parquesHub = TOURIST_LOGISTICS_HUBS.find(h => h.id === 'parques');
      if (parquesHub) setSelectedLogistics(parquesHub);
      else setSelectedCategory(cat);
    } else if (cat.id === 'transporte') {
      const vuelosHub = TOURIST_LOGISTICS_HUBS.find(h => h.id === 'vuelos');
      if (vuelosHub) setSelectedLogistics(vuelosHub);
      else setSelectedCategory(cat);
    } else if (cat.id === 'aventura') {
      const telefericoHub = TOURIST_LOGISTICS_HUBS.find(h => h.id === 'teleferico');
      if (telefericoHub) setSelectedLogistics(telefericoHub);
      else setSelectedCategory(cat);
    } else {
      setSelectedCategory(cat);
    }
  };

  const selectedCategoryProviders = selectedCategory
    ? guideProviders.filter(p => p.categoryId === selectedCategory.id)
    : [];

  return (
    <div className="min-h-screen bg-[#FAF7F2] text-[#1E1C1A] pb-32 sm:pb-36 font-sans select-none antialiased">
      
      {/* ========================================================================= */}
      {/* 1. TOP APP BAR NATIVO: ELEGANTE, MINIMALISTA Y DIRECTO                     */}
      {/* ========================================================================= */}
      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md px-4 py-3 border-b border-[#EAE3D5] shadow-2xs">
        <div className="flex items-center justify-between gap-3 max-w-lg mx-auto">
          
          <div 
            onClick={() => setMobileTab('explore')}
            className="flex items-center gap-2.5 cursor-pointer"
          >
            <div className="w-10 h-10 rounded-2xl bg-[#FAF3EB] p-1 border border-[#EAE3D5] flex items-center justify-center shadow-2xs">
              <img 
                src="/logo-merida-gastronomica.png" 
                alt="CGEM Logo" 
                className="w-full h-full object-contain"
              />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-playfair font-black text-base tracking-tight text-[#1E1C1A]">
                  Mérida Gastronómica
                </span>
                <span className="px-1.5 py-0.2 rounded-full bg-[#FAF3EB] text-[#C85A32] border border-[#EAE3D5] text-[9px] font-bold uppercase tracking-wider">
                  Oficial
                </span>
              </div>
              <p className="text-[11px] text-[#5C554E] font-medium flex items-center gap-1">
                <span>Mérida, Venezuela</span>
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={() => {
              if (navigator.share) {
                navigator.share({
                  title: 'Mérida Gastronómica',
                  text: 'Guía oficial de restaurantes, planes, teleférico y turismo en Mérida:',
                  url: window.location.origin
                }).catch(() => {});
              }
            }}
            className="w-9 h-9 rounded-full bg-[#FAF3EB] hover:bg-[#F5EFE6] border border-[#EAE3D5] flex items-center justify-center text-[#C85A32] transition-colors"
            title="Compartir App"
          >
            <Share2 className="w-4 h-4" />
          </button>

        </div>
      </header>

      {/* ========================================================================= */}
      {/* 2. CONTENIDO PRINCIPAL SEGÚN TAB ACTIVA                                   */}
      {/* ========================================================================= */}
      <main className="max-w-lg mx-auto px-4 pt-4 space-y-6">

        {/* ----------------------------------------------------------------------- */}
        {/* TAB 1: EXPLORE (PORTADA OFICIAL CON 8 TARJETAS DE EXPLORA MÉRIDA)       */}
        {/* ----------------------------------------------------------------------- */}
        {mobileTab === 'explore' && (
          <div className="space-y-6 animate-fadeIn">
            
            {/* SECCIÓN 0: EXPLORA MÉRIDA (IDÉNTICO AL DISEÑO DE LA WEB CON LAS 8 TARJETAS) */}
            <div className="space-y-4">
              
              {/* Bloque Editorial */}
              <div className="space-y-2.5 pt-1">
                <span className="text-[11px] font-bold uppercase tracking-[0.2em] text-[#C85A32] block">
                  Guía del Visitante
                </span>

                <h1 className="font-playfair text-3xl sm:text-4xl font-bold text-[#1E1C1A] leading-[1.08] tracking-tight">
                  Explora <span className="italic font-normal text-[#C85A32]">Mérida</span>
                </h1>

                <p className="text-xs sm:text-sm text-[#5C554E] leading-relaxed font-sans max-w-sm">
                  Accede en un solo lugar a los mejores restaurantes, hoteles, posadas, transporte, parques, cafeterías y rutas de aventura del estado.
                </p>

                <div className="pt-1">
                  <span className="font-handwritten text-2xl sm:text-[1.7rem] text-[#5C554E] -rotate-2 inline-block leading-tight">
                    Toda Mérida al alcance de un clic &rarr;
                  </span>
                </div>
              </div>

              {/* Malla de 8 Tarjetas con Fotos (2 Columnas) Idénticas a la Web */}
              <div className="grid grid-cols-2 gap-3 pt-1">
                {guideCategories.map((cat) => (
                  <button
                    key={cat.id}
                    type="button"
                    onClick={() => handleCategoryClick(cat)}
                    className="group text-left bg-white rounded-3xl p-3 border border-[#EAE3D5] hover:border-[#C85A32]/60 hover:shadow-md transition-all duration-300 flex flex-col justify-between gap-2.5 active:scale-95"
                  >
                    <div className="px-1 pt-0.5 flex items-center justify-between gap-1">
                      <h3 className="font-playfair font-bold text-xs sm:text-sm text-[#1E1C1A] group-hover:text-[#C85A32] transition-colors leading-snug line-clamp-1">
                        {cat.title}
                      </h3>
                      <ArrowRight className="w-3.5 h-3.5 text-[#C85A32] opacity-70 group-hover:translate-x-0.5 transition-all shrink-0" />
                    </div>

                    <div className="relative aspect-[4/3] w-full rounded-2xl overflow-hidden bg-[#EFECE6]">
                      <img
                        src={cat.image}
                        alt={cat.title}
                        loading="lazy"
                        className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
                      />
                    </div>
                  </button>
                ))}
              </div>

            </div>

            {/* SECCIÓN 1: PLANES & PROMOS DE LA SEMANA */}
            <div className="space-y-3 pt-2">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="font-playfair text-xl font-bold text-[#1E1C1A] flex items-center gap-1.5">
                    <span>🔥 Planes &amp; Promos de la Semana</span>
                  </h2>
                  <p className="text-[11px] text-[#5C554E]">
                    Ofertas y salidas activas de nuestros agremiados
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setMobileTab('promos')}
                  className="text-xs font-bold text-[#C85A32] hover:underline flex items-center gap-0.5"
                >
                  <span>Ver todas</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>

              {/* Carrusel Horizontal de Promos */}
              <div className="overflow-x-auto no-scrollbar flex gap-3.5 pb-2 -mx-4 px-4">
                {WEEKLY_PROMOS_DATA.map((promo) => (
                  <div
                    key={promo.id}
                    onClick={() => handlePromoClick(promo)}
                    className="w-72 shrink-0 rounded-[1.75rem] bg-white border border-[#EAE3D5] hover:border-[#C85A32]/60 overflow-hidden shadow-2xs hover:shadow-md transition-all flex flex-col justify-between cursor-pointer group"
                  >
                    <div className="relative h-32 w-full overflow-hidden bg-slate-100">
                      <img
                        src={promo.image}
                        alt={promo.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        loading="lazy"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                      
                      <span className="absolute top-2.5 left-2.5 px-2.5 py-0.5 rounded-full bg-[#C85A32] text-white font-black text-[9px] shadow-sm uppercase tracking-wider flex items-center gap-1">
                        <Tag className="w-2.5 h-2.5" />
                        <span>{promo.badge}</span>
                      </span>

                      <div className="absolute bottom-2.5 left-3 right-3 flex items-center justify-between text-white">
                        <span className="text-xs font-bold drop-shadow-md">
                          {promo.restaurantName}
                        </span>
                        <span className="text-xs font-black text-amber-300 bg-black/40 px-2 py-0.5 rounded-lg backdrop-blur-xs">
                          {promo.price}
                        </span>
                      </div>
                    </div>

                    <div className="p-3.5 flex-1 flex flex-col justify-between space-y-2.5">
                      <div>
                        <h3 className="font-playfair font-bold text-sm text-[#1E1C1A] group-hover:text-[#C85A32] transition-colors leading-snug line-clamp-1">
                          {promo.title}
                        </h3>
                        <p className="text-[11px] text-[#5C554E] mt-0.5 line-clamp-2">
                          {promo.description}
                        </p>
                      </div>

                      <div className="pt-2 border-t border-[#EAE3D5] flex items-center justify-between gap-2">
                        <span className="text-[10px] text-[#5C554E] truncate max-w-[120px]">
                          📍 {promo.location}
                        </span>
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleOpenWhatsApp(promo.whatsapp, promo.whatsappMessage);
                          }}
                          className="py-1.5 px-3 rounded-xl bg-[#25D366] hover:bg-[#1ebd5a] text-white text-[10px] font-bold flex items-center gap-1 shadow-2xs transition-colors shrink-0"
                        >
                          <MessageCircle className="w-3.5 h-3.5" />
                          <span>WhatsApp</span>
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* SECCIÓN 2: LOS IMPERDIBLES DE MÉRIDA */}
            <div className="space-y-3 pt-2">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="font-playfair text-xl font-bold text-[#1E1C1A]">
                    🌟 Los Imperdibles de Mérida
                  </h2>
                  <p className="text-[11px] text-[#5C554E]">
                    Establecimientos con Sello Oficial de Excelencia
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setMobileTab('restaurants')}
                  className="text-xs font-bold text-[#C85A32] hover:underline flex items-center gap-0.5"
                >
                  <span>Ver todos ({restaurants.length})</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>

              {/* Carrusel Horizontal de Restaurantes Top */}
              <div className="overflow-x-auto no-scrollbar flex gap-3.5 pb-2 -mx-4 px-4">
                {restaurants.slice(0, 8).map((r) => (
                  <div
                    key={r.id}
                    onClick={() => handleOpenRestaurant(r)}
                    className="w-64 shrink-0 rounded-[1.75rem] bg-white border border-[#EAE3D5] hover:border-[#C85A32]/60 overflow-hidden shadow-2xs hover:shadow-md transition-all flex flex-col justify-between cursor-pointer group"
                  >
                    <div className="relative h-36 w-full overflow-hidden bg-slate-100">
                      <img
                        src={r.coverImage || r.foto_portada || 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=800&q=80'}
                        alt={r.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        loading="lazy"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-transparent to-black/30" />

                      {/* Top Badges */}
                      <div className="absolute top-2.5 left-2.5 right-2.5 flex items-center justify-between">
                        {r.isCertifiedByCamara ? (
                          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[9px] font-bold bg-white/95 text-[#C85A32] shadow-sm">
                            <ShieldCheck className="w-3 h-3 text-[#C85A32]" />
                            <span>Oficial</span>
                          </span>
                        ) : <span />}

                        <div className="flex items-center gap-1 bg-black/60 backdrop-blur-xs px-2 py-0.5 rounded-full text-[10px] text-amber-300 font-bold border border-white/20">
                          <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                          <span>{r.rating || '5.0'}</span>
                        </div>
                      </div>

                      <div className="absolute bottom-2.5 left-3 right-3 flex items-center justify-between text-white">
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-lg bg-[#C85A32] text-white shadow-sm line-clamp-1">
                          {r.category || 'Gastronomía Andina'}
                        </span>
                        <span className="text-[10px] font-bold text-slate-200">
                          {r.priceTier || '$$'}
                        </span>
                      </div>
                    </div>

                    <div className="p-3.5 space-y-2 flex-1 flex flex-col justify-between">
                      <div>
                        <h3 className="font-playfair font-bold text-sm text-[#1E1C1A] group-hover:text-[#C85A32] transition-colors leading-snug">
                          {r.name}
                        </h3>
                        <p className="text-[10px] text-[#5C554E] mt-0.5 line-clamp-1">
                          📍 {r.location}
                        </p>
                        {r.signatureDishes && r.signatureDishes[0] && (
                          <p className="text-[11px] font-serif italic text-[#C85A32] mt-1.5 line-clamp-1">
                            "{r.signatureDishes[0].name}"
                          </p>
                        )}
                      </div>

                      <div className="pt-2 border-t border-[#EAE3D5] flex items-center justify-between text-[11px] font-bold text-[#C85A32]">
                        <span>Ver Ficha Completa</span>
                        <ChevronRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* SECCIÓN 3: GUÍA DEL VIAJERO */}
            <div className="space-y-3 pt-2">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="font-playfair text-xl font-bold text-[#1E1C1A]">
                    🏔️ Guía del Viajero
                  </h2>
                  <p className="text-[11px] text-[#5C554E]">
                    Teleférico Mukumbarí, vuelos, terminales y parques oficiales
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setMobileTab('logistics')}
                  className="text-xs font-bold text-[#C85A32] hover:underline flex items-center gap-0.5"
                >
                  <span>Todos</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>

              <div className="grid grid-cols-2 gap-3">
                {TOURIST_LOGISTICS_HUBS.map((hub) => (
                  <button
                    key={hub.id}
                    type="button"
                    onClick={() => setSelectedLogistics(hub)}
                    className="p-3.5 rounded-3xl bg-white border border-[#EAE3D5] hover:border-[#C85A32]/60 text-left transition-all shadow-2xs hover:shadow-xs group flex flex-col justify-between min-h-[120px]"
                  >
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-2xl">{hub.icon}</span>
                        <span className="text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-[#FAF3EB] text-[#C85A32] border border-[#EAE3D5]">
                          {hub.badge}
                        </span>
                      </div>
                      <h3 className="font-playfair font-bold text-xs sm:text-sm text-[#1E1C1A] group-hover:text-[#C85A32] leading-snug">
                        {hub.title}
                      </h3>
                      <p className="text-[10px] text-[#5C554E] line-clamp-1 mt-0.5">
                        {hub.subtitle}
                      </p>
                    </div>

                    <div className="mt-2 pt-1.5 border-t border-[#EAE3D5] flex items-center justify-between text-[10px] font-bold text-[#C85A32]">
                      <span>Ver info</span>
                      <ArrowRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* SECCIÓN 4: CATÁLOGO EN FEED VERTICAL */}
            <div className="space-y-3 pt-2">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="font-playfair text-xl font-bold text-[#1E1C1A]">
                    🍴 Directorio Completo
                  </h2>
                  <p className="text-[11px] text-[#5C554E]">
                    Todos los agremiados con canales directos de WhatsApp y GPS
                  </p>
                </div>
              </div>

              {/* Feed de Tarjetas de Restaurante */}
              <div className="space-y-3.5">
                {filteredRestaurants.slice(0, 6).map((r) => (
                  <RestaurantMobileCard
                    key={r.id}
                    restaurant={r}
                    onSelect={() => handleOpenRestaurant(r)}
                    onWhatsApp={() => handleOpenWhatsApp(r.whatsapp || r.phone, `Hola ${r.name}, los encontré en la App de Mérida Gastronómica. Quiero consultar disponibilidad / reservar una mesa.`)}
                    onGPS={() => handleOpenGPS(r)}
                    onShare={() => handleShareRestaurant(r)}
                  />
                ))}
              </div>

              {filteredRestaurants.length > 6 && (
                <button
                  type="button"
                  onClick={() => setMobileTab('restaurants')}
                  className="w-full py-3.5 rounded-2xl bg-white border border-[#EAE3D5] hover:border-[#C85A32] text-[#1E1C1A] font-bold text-xs hover:bg-[#FAF3EB] flex items-center justify-center gap-1.5 shadow-2xs transition-all"
                >
                  <span>Explorar los {filteredRestaurants.length} Restaurantes</span>
                  <ArrowRight className="w-3.5 h-3.5 text-[#C85A32]" />
                </button>
              )}
            </div>

          </div>
        )}

        {/* ----------------------------------------------------------------------- */}
        {/* TAB 2: RESTAURANTES (CATÁLOGO COMPLETO CON FILTROS TÁCTILES)             */}
        {/* ----------------------------------------------------------------------- */}
        {mobileTab === 'restaurants' && (
          <div className="space-y-4 animate-fadeIn">
            
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-[#C85A32] block">
                Directorio Oficial
              </span>
              <h2 className="font-playfair text-2xl font-bold text-[#1E1C1A]">
                Guía Oficial de Restaurantes
              </h2>
              <p className="text-xs text-[#5C554E]">
                {filteredRestaurants.length} establecimientos avalados por la Cámara
              </p>
            </div>

            {/* Chips de Antojo Rápido */}
            <div className="overflow-x-auto no-scrollbar flex items-center gap-1.5 pb-1 -mx-4 px-4">
              {CRAVE_FILTERS.map((crave) => {
                const isActive = selectedCrave === crave.id;
                return (
                  <button
                    key={crave.id}
                    type="button"
                    onClick={() => setSelectedCrave(crave.id)}
                    className={`px-3.5 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap shrink-0 transition-all flex items-center gap-1 border ${
                      isActive
                        ? 'bg-[#C85A32] text-white border-[#C85A32] shadow-xs'
                        : 'bg-white text-[#5C554E] border-[#EAE3D5]'
                    }`}
                  >
                    <span>{crave.icon}</span>
                    <span>{crave.label}</span>
                  </button>
                );
              })}
            </div>

            {/* Lista de Restaurantes Filtrados */}
            {filteredRestaurants.length === 0 ? (
              <div className="p-8 text-center bg-white rounded-3xl border border-[#EAE3D5] space-y-3">
                <Utensils className="w-10 h-10 text-[#5C554E]/40 mx-auto" />
                <h3 className="font-playfair font-bold text-base text-[#1E1C1A]">
                  No se encontraron resultados
                </h3>
                <p className="text-xs text-[#5C554E] max-w-xs mx-auto">
                  Prueba cambiando de antojo o seleccionando otra categoría.
                </p>
                <button
                  type="button"
                  onClick={() => setSelectedCrave('todos')}
                  className="py-2 px-4 rounded-full bg-[#C85A32] text-white font-bold text-xs"
                >
                  Ver Todos los Restaurantes
                </button>
              </div>
            ) : (
              <div className="space-y-3.5">
                {filteredRestaurants.map((r) => (
                  <RestaurantMobileCard
                    key={r.id}
                    restaurant={r}
                    onSelect={() => handleOpenRestaurant(r)}
                    onWhatsApp={() => handleOpenWhatsApp(r.whatsapp || r.phone, `Hola ${r.name}, los encontré en la App de Mérida Gastronómica. Deseo consultar su menú o reservar.`)}
                    onGPS={() => handleOpenGPS(r)}
                    onShare={() => handleShareRestaurant(r)}
                  />
                ))}
              </div>
            )}

          </div>
        )}

        {/* ----------------------------------------------------------------------- */}
        {/* TAB 3: PROMOS & PLANES (EL HOOK SEMANAL PARA EL MERIDEÑO)                 */}
        {/* ----------------------------------------------------------------------- */}
        {mobileTab === 'promos' && (
          <div className="space-y-4 animate-fadeIn">
            
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-[#C85A32] block">
                Pulso Gastronómico Semanal
              </span>
              <h2 className="font-playfair text-2xl font-bold text-[#1E1C1A]">
                Planes, 2x1 &amp; Salidas en Mérida
              </h2>
              <p className="text-xs text-[#5C554E]">
                La agenda gastronómica activa para disfrutar entre amigos, en pareja o con la familia.
              </p>
            </div>

            <div className="space-y-3.5">
              {WEEKLY_PROMOS_DATA.map((promo) => (
                <div
                  key={promo.id}
                  onClick={() => handlePromoClick(promo)}
                  className="rounded-3xl bg-white border border-[#EAE3D5] hover:border-[#C85A32]/60 overflow-hidden shadow-2xs hover:shadow-md transition-all flex flex-col cursor-pointer group"
                >
                  <div className="relative h-44 w-full overflow-hidden bg-slate-100">
                    <img
                      src={promo.image}
                      alt={promo.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                    
                    <div className="absolute top-3 left-3 flex items-center gap-1.5">
                      <span className="px-2.5 py-1 rounded-full bg-[#C85A32] text-white font-black text-[10px] uppercase shadow-sm">
                        {promo.badge}
                      </span>
                      <span className="px-2.5 py-1 rounded-full bg-black/50 backdrop-blur-md text-white font-medium text-[10px] border border-white/20">
                        {promo.category}
                      </span>
                    </div>

                    <div className="absolute bottom-3 left-3 right-3 flex items-end justify-between">
                      <div>
                        <span className="text-[11px] font-semibold text-amber-300 drop-shadow">
                          {promo.restaurantName}
                        </span>
                        <h3 className="font-playfair font-bold text-base text-white leading-snug drop-shadow-md">
                          {promo.title}
                        </h3>
                      </div>
                      <span className="text-xs font-black text-white bg-[#C85A32] px-2.5 py-1 rounded-xl border border-amber-300/40 shrink-0">
                        {promo.price}
                      </span>
                    </div>
                  </div>

                  <div className="p-4 space-y-3">
                    <p className="text-xs text-[#5C554E] leading-relaxed">
                      {promo.description}
                    </p>

                    <div className="flex items-center gap-1.5 text-[11px] text-[#5C554E]">
                      <MapPin className="w-3.5 h-3.5 text-[#C85A32] shrink-0" />
                      <span className="truncate">{promo.location}</span>
                    </div>

                    <div className="pt-2 border-t border-[#EAE3D5] flex items-center gap-2">
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleOpenWhatsApp(promo.whatsapp, promo.whatsappMessage);
                        }}
                        className="flex-1 py-2.5 px-3 rounded-xl bg-[#25D366] hover:bg-[#1ebd5a] text-white font-bold text-xs flex items-center justify-center gap-1.5 shadow-sm active:scale-95 transition-all"
                      >
                        <MessageCircle className="w-4 h-4" />
                        <span>Aprovechar por WhatsApp</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => handlePromoClick(promo)}
                        className="py-2.5 px-3 rounded-xl bg-[#FAF3EB] hover:bg-[#F5EFE6] text-[#1E1C1A] border border-[#EAE3D5] font-semibold text-xs flex items-center gap-1 transition-colors"
                      >
                        <span>Ver Ficha</span>
                        <ChevronRight className="w-3.5 h-3.5 text-[#C85A32]" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

          </div>
        )}

        {/* ----------------------------------------------------------------------- */}
        {/* TAB 4: GUÍA DEL VIAJERO                                                 */}
        {/* ----------------------------------------------------------------------- */}
        {mobileTab === 'logistics' && (
          <div className="space-y-4 animate-fadeIn">
            
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-[#C85A32] block">
                Todo Mérida en un Solo Lugar
              </span>
              <h2 className="font-playfair text-2xl font-bold text-[#1E1C1A]">
                Guía del Viajero
              </h2>
              <p className="text-xs text-[#5C554E]">
                Información oficial del Teleférico Mukumbarí, vuelos, terminales y atractivos turísticos.
              </p>
            </div>

            <div className="space-y-3">
              {TOURIST_LOGISTICS_HUBS.map((hub) => (
                <div
                  key={hub.id}
                  className="rounded-3xl bg-white border border-[#EAE3D5] hover:border-[#C85A32]/60 p-4 shadow-2xs hover:shadow-sm transition-all space-y-3"
                >
                  <div className="flex items-start gap-3">
                    <div className="w-12 h-12 rounded-2xl bg-[#FAF3EB] border border-[#EAE3D5] flex items-center justify-center text-2xl shrink-0">
                      {hub.icon}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between gap-1">
                        <h3 className="font-playfair font-bold text-base text-[#1E1C1A]">
                          {hub.title}
                        </h3>
                        <span className="text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-[#FAF3EB] text-[#C85A32] border border-[#EAE3D5]">
                          {hub.badge}
                        </span>
                      </div>
                      <p className="text-xs font-medium text-[#C85A32] mt-0.5">
                        {hub.subtitle}
                      </p>
                      <p className="text-[11px] text-[#5C554E] mt-1 leading-snug">
                        {hub.shortDesc}
                      </p>
                    </div>
                  </div>

                  <div className="pt-2 border-t border-[#EAE3D5] flex items-center justify-between gap-2">
                    <button
                      type="button"
                      onClick={() => setSelectedLogistics(hub)}
                      className="flex-1 py-2 px-3 rounded-xl bg-[#1E1C1A] hover:bg-[#332F2B] text-white font-bold text-xs flex items-center justify-center gap-1.5 transition-colors"
                    >
                      <Info className="w-3.5 h-3.5 text-amber-300" />
                      <span>Ver Horarios, Tarifas &amp; Guía</span>
                    </button>
                    
                    <button
                      type="button"
                      onClick={() => handleOpenWhatsApp(hub.details.whatsappHelp, hub.details.whatsappText)}
                      className="py-2 px-3 rounded-xl bg-[#25D366] hover:bg-[#1ebd5a] text-white text-xs font-bold flex items-center gap-1"
                      title="Consultar por WhatsApp"
                    >
                      <MessageCircle className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>

          </div>
        )}

      </main>

      {/* ========================================================================= */}
      {/* 3. MODAL DE FICHA COMPLETA DE RESTAURANTE (ABRE AL TOCAR CUALQUIER CARD)   */}
      {/* ========================================================================= */}
      {activeModalRestaurant && (
        <RestaurantMobileDetailModal
          restaurant={activeModalRestaurant}
          onClose={() => setActiveModalRestaurant(null)}
          onGPS={() => handleOpenGPS(activeModalRestaurant)}
          onWhatsApp={(text) => handleOpenWhatsApp(activeModalRestaurant.whatsapp || activeModalRestaurant.phone, text)}
          onShare={() => handleShareRestaurant(activeModalRestaurant)}
        />
      )}

      {/* ========================================================================= */}
      {/* 4. MODAL DE CATEGORÍA DE SERVICIOS / GUÍA DEL VISITANTE                    */}
      {/* ========================================================================= */}
      {selectedCategory && (
        <div
          className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/70 backdrop-blur-xs animate-fadeIn"
          onClick={() => setSelectedCategory(null)}
        >
          <div
            className="w-full sm:max-w-lg bg-white rounded-t-3xl sm:rounded-3xl max-h-[85vh] overflow-y-auto border border-[#EAE3D5] shadow-2xl flex flex-col justify-between"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="p-4 bg-gradient-to-r from-[#C85A32] to-[#B04B26] text-white rounded-t-3xl flex items-center justify-between border-b border-white/20">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-amber-200 block">
                  Guía Oficial • Mérida Gastronómica
                </span>
                <h3 className="font-playfair text-xl font-bold text-white">
                  {selectedCategory.title}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setSelectedCategory(null)}
                className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Body */}
            <div className="p-4 space-y-3.5 text-xs text-[#5C554E]">
              {selectedCategoryProviders.length === 0 ? (
                <div className="p-6 text-center bg-[#FAF3EB] rounded-2xl border border-[#EAE3D5] space-y-3">
                  <div className="w-12 h-12 rounded-2xl bg-white text-[#C85A32] flex items-center justify-center mx-auto shadow-2xs">
                    <Sparkles className="w-6 h-6" />
                  </div>
                  <div>
                    <h4 className="font-playfair font-bold text-base text-[#1E1C1A]">
                      Directorio de {selectedCategory.title}
                    </h4>
                    <p className="text-xs text-[#5C554E] mt-1 leading-relaxed">
                      Consulta los establecimientos homologados y recomendados por la Cámara Gastronómica del Estado Mérida.
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      setSelectedCategory(null);
                      setMobileTab('restaurants');
                    }}
                    className="py-2.5 px-5 rounded-full bg-[#C85A32] text-white font-bold text-xs shadow-xs"
                  >
                    Ver Guía de Establecimientos
                  </button>
                </div>
              ) : (
                <div className="space-y-3">
                  {selectedCategoryProviders.map((prov, i) => (
                    <div key={i} className="p-3 rounded-2xl bg-slate-50 border border-[#EAE3D5] space-y-1">
                      <div className="font-bold text-[#1E1C1A] text-sm">{prov.name}</div>
                      <div className="text-[11px] text-[#5C554E]">{prov.description}</div>
                      {prov.whatsapp && (
                        <button
                          type="button"
                          onClick={() => handleOpenWhatsApp(prov.whatsapp, `Hola ${prov.name}, le contacto desde la App Oficial de Mérida Gastronómica.`)}
                          className="mt-2 py-1.5 px-3 rounded-xl bg-[#25D366] text-white text-[10px] font-bold flex items-center gap-1"
                        >
                          <MessageCircle className="w-3.5 h-3.5" />
                          <span>WhatsApp</span>
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="p-3 bg-slate-50 border-t border-[#EAE3D5] rounded-b-3xl">
              <button
                type="button"
                onClick={() => setSelectedCategory(null)}
                className="w-full py-2.5 rounded-xl bg-[#EAE3D5] text-[#1E1C1A] font-bold text-xs"
              >
                Cerrar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 5. MODAL DE DETALLES DE GUÍA DEL VIAJERO                                  */}
      {/* ========================================================================= */}
      {selectedLogistics && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs flex items-end sm:items-center justify-center p-0 sm:p-4 animate-fadeIn">
          <div className="w-full sm:max-w-lg bg-white rounded-t-3xl sm:rounded-3xl max-h-[85vh] overflow-y-auto border border-[#EAE3D5] shadow-2xl flex flex-col justify-between">
            
            {/* Modal Header */}
            <div className="sticky top-0 z-10 bg-gradient-to-r from-[#C85A32] to-[#B04B26] text-white p-4 rounded-t-3xl sm:rounded-t-3xl flex items-center justify-between border-b border-white/20">
              <div className="flex items-center gap-2.5">
                <span className="text-2xl">{selectedLogistics.icon}</span>
                <div>
                  <h3 className="font-playfair font-bold text-base text-white">
                    {selectedLogistics.title}
                  </h3>
                  <p className="text-[10px] text-amber-200">
                    {selectedLogistics.subtitle}
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setSelectedLogistics(null)}
                className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-4 space-y-4 text-xs text-[#5C554E]">
              
              {/* Status & Hours */}
              <div className="p-3 rounded-2xl bg-[#FAF3EB] border border-[#EAE3D5] space-y-1">
                <div className="flex items-center gap-1.5 font-bold text-[#C85A32]">
                  <Clock className="w-3.5 h-3.5 text-[#C85A32]" />
                  <span>Estado: {selectedLogistics.details.status}</span>
                </div>
                {selectedLogistics.details.hours && (
                  <p className="text-[11px] text-[#1E1C1A]">
                    <strong>Horario:</strong> {selectedLogistics.details.hours}
                  </p>
                )}
                {selectedLogistics.details.location && (
                  <p className="text-[11px] text-[#1E1C1A]">
                    <strong>Ubicación:</strong> {selectedLogistics.details.location}
                  </p>
                )}
              </div>

              {/* Tarifas de Referencia */}
              {Array.isArray(selectedLogistics.details.rates) && (
                <div className="space-y-1.5">
                  <h4 className="font-bold text-[#1E1C1A] flex items-center gap-1">
                    <span>💵 Tarifas de Referencia</span>
                  </h4>
                  <div className="space-y-1">
                    {selectedLogistics.details.rates.map((rate, i) => (
                      <div key={i} className="flex items-center justify-between p-2 rounded-xl bg-slate-50 border border-[#EAE3D5]">
                        <span className="text-[#5C554E]">{rate.type}</span>
                        <span className="font-bold text-[#C85A32]">{rate.price}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Estaciones de Teleférico */}
              {Array.isArray(selectedLogistics.details.stations) && (
                <div className="space-y-1.5">
                  <h4 className="font-bold text-[#1E1C1A]">
                    🚡 Las 5 Estaciones del Mukumbarí
                  </h4>
                  <div className="space-y-1.5">
                    {selectedLogistics.details.stations.map((st, i) => (
                      <div key={i} className="p-2.5 rounded-xl bg-slate-50 border border-[#EAE3D5] flex flex-col">
                        <div className="flex items-center justify-between">
                          <span className="font-bold text-[#1E1C1A]">{st.name}</span>
                          <span className="text-[10px] font-bold text-[#C85A32] bg-[#FAF3EB] px-1.5 py-0.5 rounded">
                            {st.alt}
                          </span>
                        </div>
                        <span className="text-[10px] text-[#5C554E] mt-0.5">{st.note}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Aeropuertos & Vuelos */}
              {Array.isArray(selectedLogistics.details.airports) && (
                <div className="space-y-2">
                  <h4 className="font-bold text-[#1E1C1A]">
                    ✈️ Terminales Aéreos &amp; Traslados
                  </h4>
                  {selectedLogistics.details.airports.map((ap, i) => (
                    <div key={i} className="p-2.5 rounded-xl bg-slate-50 border border-[#EAE3D5] space-y-1">
                      <div className="font-bold text-[#1E1C1A]">{ap.name}</div>
                      <div className="text-[11px] text-[#5C554E]"><strong>Aerolíneas:</strong> {ap.airlines}</div>
                      <div className="text-[11px] text-[#5C554E]"><strong>Distancia a Mérida:</strong> {ap.distance}</div>
                      <div className="text-[11px] text-[#C85A32] bg-[#FAF3EB] p-1.5 rounded-lg border border-[#EAE3D5] mt-1">
                        <strong>Taxis &amp; Costos:</strong> {ap.taxis}
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Parques Temáticos */}
              {Array.isArray(selectedLogistics.details.attractions) && (
                <div className="space-y-2">
                  <h4 className="font-bold text-[#1E1C1A]">
                    🎡 Parques &amp; Atractivos Destacados
                  </h4>
                  {selectedLogistics.details.attractions.map((att, i) => (
                    <div key={i} className="p-2.5 rounded-xl bg-slate-50 border border-[#EAE3D5] space-y-0.5">
                      <div className="font-bold text-[#1E1C1A]">{att.name}</div>
                      <div className="text-[11px] text-[#5C554E]">{att.highlights}</div>
                      <div className="text-[10px] text-[#5C554E]">📍 {att.location} • ⏰ {att.hours}</div>
                    </div>
                  ))}
                </div>
              )}

              {/* Tips del Viajero */}
              {Array.isArray(selectedLogistics.details.tips) && (
                <div className="p-3 rounded-2xl bg-[#FAF3EB] border border-[#EAE3D5] space-y-1">
                  <span className="font-bold text-[#C85A32] text-[11px] uppercase tracking-wider block">
                    💡 Consejos para tu Viaje
                  </span>
                  <ul className="list-disc list-inside space-y-0.5 text-[11px] text-[#5C554E]">
                    {selectedLogistics.details.tips.map((tip, i) => (
                      <li key={i}>{tip}</li>
                    ))}
                  </ul>
                </div>
              )}

            </div>

            {/* Modal Footer Actions */}
            <div className="p-3 bg-slate-50 border-t border-[#EAE3D5] rounded-b-3xl flex items-center gap-2">
              <button
                type="button"
                onClick={() => handleOpenWhatsApp(selectedLogistics.details.whatsappHelp, selectedLogistics.details.whatsappText)}
                className="flex-1 py-2.5 px-3 rounded-xl bg-[#25D366] hover:bg-[#1ebd5a] text-white font-bold text-xs flex items-center justify-center gap-1.5 shadow-sm transition-all"
              >
                <MessageCircle className="w-4 h-4" />
                <span>Asistencia Turística WhatsApp</span>
              </button>
              <button
                type="button"
                onClick={() => setSelectedLogistics(null)}
                className="py-2.5 px-4 rounded-xl bg-[#EAE3D5] text-[#1E1C1A] font-semibold text-xs"
              >
                Cerrar
              </button>
            </div>

          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 6. BOTTOM NAVIGATION BAR TÁCTIL ESTILO DOCK NATIVO                        */}
      {/* ========================================================================= */}
      <nav 
        className="fixed bottom-3 inset-x-3 sm:inset-x-auto sm:left-1/2 sm:-translate-x-1/2 sm:w-full sm:max-w-md z-40 bg-[#1C1917]/95 backdrop-blur-xl border border-[#3E3832]/80 shadow-[0_16px_40px_rgba(0,0,0,0.45)] rounded-2xl p-1.5"
        style={{ bottom: 'calc(0.75rem + env(safe-area-inset-bottom, 0px))' }}
      >
        <div className="grid grid-cols-4 gap-1.5 w-full">
          
          {/* TAB 1: INICIO (Naranja Cámara #C85A32) */}
          <button
            type="button"
            onClick={() => setMobileTab('explore')}
            className={`flex flex-col items-center justify-center py-2 px-1 rounded-xl transition-all duration-200 active:scale-95 ${
              mobileTab === 'explore'
                ? 'bg-[#C85A32] text-white shadow-lg shadow-[#C85A32]/40 font-bold border border-[#E06E45]/40 scale-[1.02]'
                : 'bg-[#292420] text-[#D4CBBF] hover:text-white hover:bg-[#342E29] border border-white/5'
            }`}
          >
            <div className="relative">
              <Compass className={`w-5 h-5 ${mobileTab === 'explore' ? 'text-white' : 'text-[#FF8A50]'}`} />
            </div>
            <span className={`text-[10px] sm:text-[11px] leading-tight mt-0.5 tracking-tight ${
              mobileTab === 'explore' ? 'font-bold text-white' : 'font-medium text-[#C8BFB2]'
            }`}>
              Inicio
            </span>
          </button>

          {/* TAB 2: RESTAURANTES (Ámbar Gourmet #D97706) */}
          <button
            type="button"
            onClick={() => setMobileTab('restaurants')}
            className={`flex flex-col items-center justify-center py-2 px-1 rounded-xl transition-all duration-200 active:scale-95 ${
              mobileTab === 'restaurants'
                ? 'bg-[#D97706] text-white shadow-lg shadow-[#D97706]/40 font-bold border border-[#F59E0B]/40 scale-[1.02]'
                : 'bg-[#292420] text-[#D4CBBF] hover:text-white hover:bg-[#342E29] border border-white/5'
            }`}
          >
            <div className="relative">
              <Utensils className={`w-5 h-5 ${mobileTab === 'restaurants' ? 'text-white' : 'text-[#FBBF24]'}`} />
            </div>
            <span className={`text-[10px] sm:text-[11px] leading-tight mt-0.5 tracking-tight ${
              mobileTab === 'restaurants' ? 'font-bold text-white' : 'font-medium text-[#C8BFB2]'
            }`}>
              Restaurantes
            </span>
          </button>

          {/* TAB 3: PROMOS (Rojo Coral #DC2626) */}
          <button
            type="button"
            onClick={() => setMobileTab('promos')}
            className={`flex flex-col items-center justify-center py-2 px-1 rounded-xl transition-all duration-200 active:scale-95 ${
              mobileTab === 'promos'
                ? 'bg-[#DC2626] text-white shadow-lg shadow-[#DC2626]/40 font-bold border border-[#EF4444]/40 scale-[1.02]'
                : 'bg-[#292420] text-[#D4CBBF] hover:text-white hover:bg-[#342E29] border border-white/5'
            }`}
          >
            <div className="relative">
              <Tag className={`w-5 h-5 ${mobileTab === 'promos' ? 'text-white' : 'text-[#F87171]'}`} />
              {mobileTab !== 'promos' && (
                <span className="absolute -top-1 -right-1 w-2 h-2 rounded-full bg-[#EF4444] ring-2 ring-[#292420] animate-pulse" />
              )}
            </div>
            <span className={`text-[10px] sm:text-[11px] leading-tight mt-0.5 tracking-tight ${
              mobileTab === 'promos' ? 'font-bold text-white' : 'font-medium text-[#C8BFB2]'
            }`}>
              Promos
            </span>
          </button>

          {/* TAB 4: GUÍA DEL VIAJERO (Verde Páramo #15803D) */}
          <button
            type="button"
            onClick={() => setMobileTab('logistics')}
            className={`flex flex-col items-center justify-center py-2 px-1 rounded-xl transition-all duration-200 active:scale-95 ${
              mobileTab === 'logistics'
                ? 'bg-[#15803D] text-white shadow-lg shadow-[#15803D]/40 font-bold border border-[#22C55E]/40 scale-[1.02]'
                : 'bg-[#292420] text-[#D4CBBF] hover:text-white hover:bg-[#342E29] border border-white/5'
            }`}
          >
            <div className="relative">
              <Mountain className={`w-5 h-5 ${mobileTab === 'logistics' ? 'text-white' : 'text-[#4ADE80]'}`} />
            </div>
            <span className={`text-[9.5px] sm:text-[10.5px] leading-tight mt-0.5 tracking-tight text-center truncate max-w-full px-0.5 ${
              mobileTab === 'logistics' ? 'font-bold text-white' : 'font-medium text-[#C8BFB2]'
            }`}>
              Guía del Viajero
            </span>
          </button>

        </div>
      </nav>

    </div>
  );
}

// =============================================================================
// SUBCOMPONENTE: TARJETA MÓVIL DE RESTAURANTE
// =============================================================================
function RestaurantMobileCard({
  restaurant,
  onSelect,
  onWhatsApp,
  onGPS,
  onShare
}) {
  return (
    <div 
      onClick={onSelect}
      className="rounded-[1.75rem] bg-white border border-[#EAE3D5] hover:border-[#C85A32]/60 overflow-hidden shadow-2xs hover:shadow-md transition-all flex flex-col justify-between cursor-pointer group"
    >
      
      {/* Portada & Badges */}
      <div className="relative h-48 w-full overflow-hidden bg-slate-100">
        <img
          src={restaurant.coverImage || restaurant.foto_portada || 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=800&q=80'}
          alt={restaurant.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/30" />

        {/* Top Badges */}
        <div className="absolute top-2.5 left-2.5 right-2.5 flex items-center justify-between gap-1">
          {restaurant.isCertifiedByCamara ? (
            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-white/95 text-[#C85A32] border border-[#EAE3D5] backdrop-blur-md shadow-sm">
              <ShieldCheck className="w-3.5 h-3.5 text-[#C85A32]" />
              <span>Sello Oficial</span>
            </span>
          ) : (
            <span />
          )}

          <div className="flex items-center gap-1 bg-black/60 backdrop-blur-md px-2.5 py-0.5 rounded-full text-[10px] text-amber-300 font-bold border border-white/20">
            <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
            <span>{restaurant.rating || '5.0'}</span>
          </div>
        </div>

        {/* Bottom Tag inside Image */}
        <div className="absolute bottom-2.5 left-3 right-3 flex items-center justify-between text-white">
          <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-lg bg-[#C85A32] text-white shadow-sm line-clamp-1">
            {restaurant.category || 'Gastronomía Andina'}
          </span>
          <span className="text-xs font-bold text-slate-100">
            {restaurant.priceTier || '$$'}
          </span>
        </div>
      </div>

      {/* Cuerpo */}
      <div className="p-4 space-y-2.5 flex-1 flex flex-col justify-between">
        
        <div>
          <div className="flex items-start justify-between gap-2">
            <h3 className="font-playfair text-base sm:text-lg font-bold text-[#1E1C1A] group-hover:text-[#C85A32] leading-snug transition-colors">
              {restaurant.name}
            </h3>
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                onShare();
              }}
              className="text-[#5C554E]/60 hover:text-[#C85A32] p-1"
              title="Compartir restaurante"
            >
              <Share2 className="w-4 h-4" />
            </button>
          </div>

          <div className="flex items-center gap-1 text-[11px] text-[#5C554E] mt-1">
            <MapPin className="w-3.5 h-3.5 text-[#C85A32] shrink-0" />
            <span className="truncate">{restaurant.location}</span>
          </div>

          {/* Plato Insignia o Tagline */}
          {restaurant.signatureDishes && restaurant.signatureDishes[0] ? (
            <div className="mt-2.5 p-2.5 rounded-xl bg-[#FAF3EB] border border-[#EAE3D5] text-[11px]">
              <span className="text-[9px] uppercase font-bold text-[#C85A32] tracking-wider flex items-center gap-1">
                <Sparkles className="w-2.5 h-2.5 text-[#C85A32]" />
                Especialidad Insignia
              </span>
              <p className="text-[#1E1C1A] font-serif italic line-clamp-1 mt-0.5">
                "{restaurant.signatureDishes[0].name}"
              </p>
            </div>
          ) : restaurant.tagline ? (
            <p className="text-[11px] text-[#5C554E] italic line-clamp-1 mt-1">
              "{restaurant.tagline}"
            </p>
          ) : null}
        </div>

        {/* Botonera de Conversión Rápida Móvil */}
        <div className="pt-3 border-t border-[#EAE3D5] grid grid-cols-3 gap-2">
          
          {/* Botón 1: WhatsApp Directo */}
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onWhatsApp();
            }}
            className="py-2.5 px-2 rounded-xl bg-[#25D366] hover:bg-[#1ebd5a] text-white font-bold text-[11px] flex items-center justify-center gap-1 shadow-2xs active:scale-95 transition-all"
            title="Contactar o Reservar por WhatsApp"
          >
            <MessageCircle className="w-4 h-4" />
            <span>WhatsApp</span>
          </button>

          {/* Botón 2: GPS / Cómo Llegar */}
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onGPS();
            }}
            className="py-2.5 px-2 rounded-xl bg-[#1E1C1A] hover:bg-[#332F2B] text-amber-300 font-bold text-[11px] flex items-center justify-center gap-1 shadow-2xs active:scale-95 transition-all"
            title="Abrir ubicación en Google Maps"
          >
            <Navigation className="w-4 h-4 text-amber-400" />
            <span>GPS</span>
          </button>

          {/* Botón 3: Ver Ficha Completa */}
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onSelect();
            }}
            className="py-2.5 px-2 rounded-xl bg-[#FAF3EB] hover:bg-[#F5EFE6] text-[#C85A32] border border-[#EAE3D5] font-bold text-[11px] flex items-center justify-center gap-1 transition-colors"
          >
            <span>Ver Ficha</span>
            <ChevronRight className="w-3.5 h-3.5 text-[#C85A32]" />
          </button>

        </div>

      </div>

    </div>
  );
}

// =============================================================================
// SUBCOMPONENTE: MODAL MÓVIL DE FICHA COMPLETA DE RESTAURANTE
// =============================================================================
function RestaurantMobileDetailModal({
  restaurant,
  onClose,
  onGPS,
  onWhatsApp,
  onShare
}) {
  const [activePhotoIndex, setActivePhotoIndex] = useState(0);

  // Lista normalizada de fotos
  const photos = useMemo(() => {
    const list = [];
    if (restaurant.coverImage) list.push(restaurant.coverImage);
    if (restaurant.foto_portada && !list.includes(restaurant.foto_portada)) list.push(restaurant.foto_portada);
    if (Array.isArray(restaurant.gallery)) {
      restaurant.gallery.forEach(img => {
        if (img && !list.includes(img)) list.push(img);
      });
    }
    return list.length > 0 ? list : ['https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=1200&q=80'];
  }, [restaurant]);

  const cleanPhone = (restaurant.phone || restaurant.whatsapp || '').replace(/[^0-9+]/g, '');
  const instagramHandle = restaurant.instagram ? restaurant.instagram.replace('@', '') : '';
  const instagramUrl = restaurant.instagramUrl || (instagramHandle ? `https://instagram.com/${instagramHandle}` : '');

  return (
    <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs flex items-end sm:items-center justify-center p-0 sm:p-4 animate-fadeIn">
      
      {/* Fondo clickeable para cerrar */}
      <div className="fixed inset-0" onClick={onClose} />

      {/* Contenedor Modal */}
      <div className="relative z-10 w-full sm:max-w-lg bg-white rounded-t-3xl sm:rounded-3xl max-h-[90vh] overflow-y-auto border border-[#EAE3D5] shadow-2xl flex flex-col justify-between">
        
        {/* Cabecera / Foto de Portada con Controles */}
        <div className="relative h-64 w-full bg-slate-900 overflow-hidden shrink-0">
          <img
            src={photos[activePhotoIndex]}
            alt={restaurant.name}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-black/40" />

          {/* Botón Cerrar */}
          <button
            type="button"
            onClick={onClose}
            className="absolute top-3 right-3 w-8 h-8 rounded-full bg-black/50 text-white hover:bg-black/80 flex items-center justify-center backdrop-blur-md border border-white/20 transition-all z-20"
          >
            <X className="w-4 h-4" />
          </button>

          {/* Botón Compartir */}
          <button
            type="button"
            onClick={onShare}
            className="absolute top-3 left-3 w-8 h-8 rounded-full bg-black/50 text-white hover:bg-black/80 flex items-center justify-center backdrop-blur-md border border-white/20 transition-all z-20"
          >
            <Share2 className="w-4 h-4" />
          </button>

          {/* Título & Badges sobre la Foto */}
          <div className="absolute bottom-3 left-4 right-4 text-white space-y-1">
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full bg-[#C85A32] text-white font-bold text-[10px] uppercase shadow-sm">
                {restaurant.category || 'Gastronomía Andina'}
              </span>
              {restaurant.isCertifiedByCamara && (
                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-white/95 text-[#C85A32] shadow-sm">
                  <ShieldCheck className="w-3.5 h-3.5 text-[#C85A32]" />
                  <span>Sello Oficial</span>
                </span>
              )}
            </div>

            <h2 className="font-playfair text-2xl font-bold leading-tight drop-shadow-md">
              {restaurant.name}
            </h2>

            <div className="flex items-center gap-2 text-xs text-slate-200">
              <div className="flex items-center gap-1 text-amber-300">
                <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                <span className="font-bold">{restaurant.rating || '5.0'}</span>
              </div>
              <span>•</span>
              <span className="truncate">{restaurant.location}</span>
            </div>
          </div>

          {/* Indicadores de Galería de Fotos si hay más de 1 */}
          {photos.length > 1 && (
            <div className="absolute bottom-1 right-3 flex gap-1 z-10">
              {photos.map((_, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => setActivePhotoIndex(idx)}
                  className={`w-2 h-2 rounded-full transition-all ${
                    activePhotoIndex === idx ? 'bg-[#C85A32] w-4' : 'bg-white/60'
                  }`}
                />
              ))}
            </div>
          )}
        </div>

        {/* Miniaturas de Galería de Fotos */}
        {photos.length > 1 && (
          <div className="p-2 bg-[#FAF3EB] border-b border-[#EAE3D5] flex gap-2 overflow-x-auto no-scrollbar">
            {photos.map((photo, i) => (
              <button
                key={i}
                type="button"
                onClick={() => setActivePhotoIndex(i)}
                className={`relative w-14 h-12 rounded-xl overflow-hidden shrink-0 border-2 transition-all ${
                  activePhotoIndex === i ? 'border-[#C85A32] scale-105' : 'border-transparent opacity-70'
                }`}
              >
                <img src={photo} alt="" className="w-full h-full object-cover" />
              </button>
            ))}
          </div>
        )}

        {/* Cuerpo del Modal con Información Detallada */}
        <div className="p-4 space-y-4 text-xs text-[#5C554E]">
          
          {/* Tagline / Filosofía */}
          {restaurant.tagline && (
            <div className="p-3 rounded-2xl bg-[#FAF3EB] border border-[#EAE3D5]">
              <p className="font-serif italic text-xs text-[#1E1C1A] leading-relaxed">
                "{restaurant.tagline}"
              </p>
            </div>
          )}

          {/* Descripción del Chef / Local */}
          {restaurant.description && (
            <div className="space-y-1">
              <h4 className="font-bold text-[#1E1C1A] flex items-center gap-1.5 text-xs">
                <ChefHat className="w-3.5 h-3.5 text-[#C85A32]" />
                <span>Propuesta &amp; Ambiente</span>
              </h4>
              <p className="text-xs text-[#5C554E] leading-relaxed">
                {restaurant.description}
              </p>
            </div>
          )}

          {/* Platos Insignia de la Carta */}
          {Array.isArray(restaurant.signatureDishes) && restaurant.signatureDishes.length > 0 && (
            <div className="space-y-2">
              <h4 className="font-bold text-[#1E1C1A] flex items-center gap-1.5 text-xs">
                <Sparkles className="w-3.5 h-3.5 text-[#C85A32]" />
                <span>Platos Insignia Recomendados</span>
              </h4>
              <div className="space-y-1.5">
                {restaurant.signatureDishes.map((dish, i) => (
                  <div key={i} className="p-2.5 rounded-xl bg-slate-50 border border-[#EAE3D5] flex items-start justify-between gap-2">
                    <div>
                      <div className="font-serif font-bold text-xs text-[#1E1C1A]">{dish.name}</div>
                      {dish.description && (
                        <p className="text-[11px] text-[#5C554E] mt-0.5 leading-snug">{dish.description}</p>
                      )}
                    </div>
                    {dish.price && (
                      <span className="text-xs font-bold text-[#C85A32] bg-[#FAF3EB] px-2 py-0.5 rounded-lg shrink-0">
                        {dish.price}
                      </span>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Horario & Ubicación */}
          <div className="space-y-1.5 p-3 rounded-2xl bg-slate-50 border border-[#EAE3D5] text-[11px]">
            <div className="flex items-start gap-2">
              <Clock className="w-3.5 h-3.5 text-[#C85A32] shrink-0 mt-0.5" />
              <div>
                <strong className="text-[#1E1C1A]">Horario:</strong>{' '}
                <span>{restaurant.openingHours || 'Consultar por canales directos'}</span>
              </div>
            </div>
            <div className="flex items-start gap-2">
              <MapPin className="w-3.5 h-3.5 text-[#C85A32] shrink-0 mt-0.5" />
              <div>
                <strong className="text-[#1E1C1A]">Dirección:</strong>{' '}
                <span>{restaurant.location}</span>
              </div>
            </div>
          </div>

          {/* Canales Secundarios (Teléfono & Instagram) */}
          <div className="grid grid-cols-2 gap-2 pt-1">
            {cleanPhone && (
              <a
                href={`tel:${cleanPhone}`}
                className="py-2.5 px-3 rounded-xl bg-slate-100 hover:bg-slate-200 text-[#1E1C1A] font-semibold text-xs flex items-center justify-center gap-1.5 transition-colors"
              >
                <Phone className="w-3.5 h-3.5 text-[#C85A32]" />
                <span>Llamar</span>
              </a>
            )}

            {instagramUrl && (
              <a
                href={instagramUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="py-2.5 px-3 rounded-xl bg-[#FAF3EB] hover:bg-[#F5EFE6] text-[#C85A32] font-semibold text-xs flex items-center justify-center gap-1.5 border border-[#EAE3D5] transition-colors"
              >
                <Instagram className="w-3.5 h-3.5" />
                <span>Instagram</span>
              </a>
            )}
          </div>

        </div>

        {/* Footer con Acciones Principales (WhatsApp & GPS) */}
        <div className="p-3 bg-white border-t border-[#EAE3D5] rounded-b-3xl flex items-center gap-2">
          
          <button
            type="button"
            onClick={() => onWhatsApp(`Hola ${restaurant.name}, le contacto desde la App Oficial de Mérida Gastronómica. Quisiera consultar disponibilidad y reservar una mesa.`)}
            className="flex-1 py-3 px-3 rounded-xl bg-[#25D366] hover:bg-[#1ebd5a] text-white font-bold text-xs flex items-center justify-center gap-2 shadow-sm active:scale-95 transition-all"
          >
            <MessageCircle className="w-4 h-4" />
            <span>Contactar por WhatsApp</span>
          </button>

          <button
            type="button"
            onClick={onGPS}
            className="py-3 px-4 rounded-xl bg-[#1E1C1A] hover:bg-[#332F2B] text-amber-300 font-bold text-xs flex items-center justify-center gap-1.5 transition-colors"
            title="Abrir en Google Maps / Waze"
          >
            <Navigation className="w-4 h-4 text-amber-400" />
            <span>GPS</span>
          </button>

        </div>

      </div>
    </div>
  );
}
