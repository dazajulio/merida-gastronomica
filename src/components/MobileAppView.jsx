import React, { useState, useMemo } from 'react';
import {
  Search,
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
  Calendar,
  Clock,
  Navigation,
  Share2,
  X,
  Info,
  Utensils,
  Coffee,
  Mountain,
  Tag,
  Plane,
  CableCar
} from 'lucide-react';
import {
  TOURIST_AXES,
  CRAVE_FILTERS,
  WEEKLY_PROMOS_DATA,
  TOURIST_LOGISTICS_HUBS
} from '../data/mobileAppData';

export function MobileAppView({
  restaurants = [],
  onSelectRestaurant,
  onViewOnMap
}) {
  const [mobileTab, setMobileTab] = useState('explore'); // 'explore' | 'restaurants' | 'promos' | 'logistics'
  const [selectedAxis, setSelectedAxis] = useState('todos');
  const [selectedCrave, setSelectedCrave] = useState('todos');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedLogistics, setSelectedLogistics] = useState(null);

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

  // Filtrado reactivo de restaurantes
  const filteredRestaurants = useMemo(() => {
    return restaurants.filter((r) => {
      // 1. Filtro de Búsqueda por Texto
      if (searchTerm.trim()) {
        const query = searchTerm.toLowerCase().trim();
        const inName = (r.name || '').toLowerCase().includes(query);
        const inCat = (r.category || '').toLowerCase().includes(query);
        const inLoc = (r.location || '').toLowerCase().includes(query);
        const inTag = (r.tagline || '').toLowerCase().includes(query);
        const inDishes = Array.isArray(r.signatureDishes) &&
          r.signatureDishes.some(d => (d.name || '').toLowerCase().includes(query));
        if (!inName && !inCat && !inLoc && !inTag && !inDishes) return false;
      }

      // 2. Filtro por Eje Turístico
      if (selectedAxis !== 'todos') {
        const axisObj = TOURIST_AXES.find(a => a.id === selectedAxis);
        if (axisObj && axisObj.keywords) {
          const locStr = `${r.location || ''} ${r.eje || ''} ${r.ejeName || ''}`.toLowerCase();
          const matchAxis = axisObj.keywords.some(kw => locStr.includes(kw));
          if (!matchAxis) return false;
        }
      }

      // 3. Filtro por Antojo / Categoría
      if (selectedCrave !== 'todos') {
        const craveObj = CRAVE_FILTERS.find(c => c.id === selectedCrave);
        if (craveObj && craveObj.keywords) {
          const catStr = `${r.category || ''} ${r.tagline || ''} ${r.description || ''}`.toLowerCase();
          const matchCrave = craveObj.keywords.some(kw => catStr.includes(kw));
          if (!matchCrave) return false;
        }
      }

      return true;
    });
  }, [restaurants, searchTerm, selectedAxis, selectedCrave]);

  return (
    <div className="min-h-screen bg-[#FAF7F2] text-slate-800 pb-24 font-sans select-none antialiased">
      
      {/* ========================================================================= */}
      {/* 1. TOP APP BAR NATIVO CON IDENTIDAD ESMERALDA & ORO                       */}
      {/* ========================================================================= */}
      <header className="sticky top-0 z-40 bg-gradient-to-r from-[#042f2e] via-[#064e3b] to-[#042f2e] text-white px-4 py-3 shadow-md border-b border-amber-500/20">
        <div className="flex items-center justify-between gap-3 max-w-lg mx-auto">
          
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-white/10 p-1 border border-amber-400/40 backdrop-blur-sm flex items-center justify-center shadow-inner">
              <img 
                src="/logo-merida-gastronomica.png" 
                alt="CGEM Logo" 
                className="w-full h-full object-contain"
              />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-playfair font-bold text-base tracking-wide text-white">
                  Mérida Gastronómica
                </span>
                <span className="px-1.5 py-0.2 rounded-full bg-amber-500/20 text-amber-300 border border-amber-400/40 text-[9px] font-bold uppercase tracking-wider">
                  Oficial
                </span>
              </div>
              <p className="text-[10px] text-emerald-200/80 font-medium">
                Cámara Gastronómica del Estado Mérida
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
            className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 border border-emerald-500/30 flex items-center justify-center text-amber-300 transition-colors"
            title="Compartir App"
          >
            <Share2 className="w-4 h-4" />
          </button>

        </div>

        {/* Barra de Búsqueda Rápida In-Header */}
        <div className="mt-2.5 max-w-lg mx-auto">
          <div className="relative">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-emerald-300" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                if (mobileTab !== 'restaurants' && mobileTab !== 'explore') {
                  setMobileTab('restaurants');
                }
              }}
              placeholder="¿Qué comer hoy? (Trucha, pizza, café, burger...)"
              className="w-full pl-10 pr-9 py-2 rounded-xl bg-emerald-950/70 border border-emerald-600/40 text-white placeholder-emerald-200/60 text-xs focus:outline-none focus:ring-2 focus:ring-amber-400/50 backdrop-blur-md transition-all"
            />
            {searchTerm && (
              <button
                type="button"
                onClick={() => setSearchTerm('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-emerald-300 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>

      </header>

      {/* ========================================================================= */}
      {/* 2. CHIPS DE ACCESO DIRECTO A LOS 5 EJES TURÍSTICOS                         */}
      {/* ========================================================================= */}
      <div className="bg-[#FAF7F2] border-b border-[#EAE3D5] py-2.5 px-3 sticky top-[102px] z-30 shadow-2xs">
        <div className="max-w-lg mx-auto overflow-x-auto no-scrollbar flex items-center gap-1.5">
          {TOURIST_AXES.map((axis) => {
            const isActive = selectedAxis === axis.id;
            return (
              <button
                key={axis.id}
                type="button"
                onClick={() => {
                  setSelectedAxis(axis.id);
                  if (mobileTab === 'logistics' || mobileTab === 'promos') {
                    setMobileTab('restaurants');
                  }
                }}
                className={`px-3 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap shrink-0 transition-all flex items-center gap-1.5 border ${
                  isActive
                    ? 'bg-[#042f2e] text-amber-300 border-amber-400 shadow-xs'
                    : 'bg-white text-slate-700 border-[#EAE3D5] hover:border-amber-400/50'
                }`}
              >
                <span>{axis.icon}</span>
                <span>{axis.name}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 3. CONTENIDO PRINCIPAL SEGÚN TAB ACTIVA                                   */}
      {/* ========================================================================= */}
      <main className="max-w-lg mx-auto px-4 pt-4">

        {/* ----------------------------------------------------------------------- */}
        {/* TAB 1: EXPLORE (PORTADA MÓVIL PRINCIPAL)                                */}
        {/* ----------------------------------------------------------------------- */}
        {mobileTab === 'explore' && (
          <div className="space-y-6 animate-fadeIn">
            
            {/* HERO CARD COMPACTO CON IDENTIDAD ANDINA */}
            <div className="relative rounded-3xl overflow-hidden bg-gradient-to-br from-[#042f2e] via-[#064e3b] to-[#0f172a] text-white p-5 shadow-lg border border-emerald-700/30">
              <div className="absolute top-0 right-0 w-36 h-36 bg-amber-500/10 rounded-full blur-2xl pointer-events-none" />
              
              <div className="relative z-10 space-y-2">
                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-amber-400/20 text-amber-300 border border-amber-400/30 text-[10px] font-bold uppercase tracking-wider">
                  <Sparkles className="w-3 h-3 text-amber-400" />
                  Mérida en tu Bolsillo
                </span>
                
                <h1 className="font-playfair text-2xl font-bold leading-tight text-white">
                  El Sabor de los Andes, <span className="italic font-normal text-amber-300">al alcance de un clic.</span>
                </h1>
                
                <p className="text-xs text-emerald-100/80 leading-relaxed font-sans">
                  Conectamos al turista y al merideño con los mejores restaurantes, teleférico, rutas andinas y promociones exclusivas.
                </p>

                <div className="pt-2 flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setMobileTab('promos')}
                    className="flex-1 py-2 px-3 rounded-xl bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold text-xs flex items-center justify-center gap-1.5 shadow-sm active:scale-95 transition-all"
                  >
                    <Tag className="w-3.5 h-3.5" />
                    <span>Planes de la Semana</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setMobileTab('logistics')}
                    className="flex-1 py-2 px-3 rounded-xl bg-white/10 hover:bg-white/20 border border-white/20 text-white font-semibold text-xs flex items-center justify-center gap-1.5 backdrop-blur-sm active:scale-95 transition-all"
                  >
                    <span>🚡 Guía Viajero</span>
                  </button>
                </div>
              </div>
            </div>

            {/* SECCIÓN 1: PLANES & PROMOS DE LA SEMANA (Hook para Merideños y Turistas) */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="font-playfair text-lg font-bold text-slate-900 flex items-center gap-1.5">
                    <span>🔥 Planes &amp; Promos de la Semana</span>
                  </h2>
                  <p className="text-[11px] text-slate-500">
                    Ofertas activas de nuestros agremiados para salir a comer
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setMobileTab('promos')}
                  className="text-xs font-bold text-[#c85a32] hover:underline flex items-center gap-0.5"
                >
                  <span>Ver todas</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>

              {/* Carrusel Horizontal de Promos */}
              <div className="overflow-x-auto no-scrollbar flex gap-3 pb-2 -mx-4 px-4">
                {WEEKLY_PROMOS_DATA.slice(0, 4).map((promo) => (
                  <div
                    key={promo.id}
                    className="w-64 shrink-0 rounded-2xl bg-white border border-[#EAE3D5] overflow-hidden shadow-2xs hover:shadow-md transition-all flex flex-col justify-between"
                  >
                    <div className="relative h-28 w-full overflow-hidden bg-slate-100">
                      <img
                        src={promo.image}
                        alt={promo.title}
                        className="w-full h-full object-cover"
                        loading="lazy"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                      <span className="absolute top-2 left-2 px-2 py-0.5 rounded-full bg-amber-500 text-slate-950 font-bold text-[9px] shadow-sm uppercase tracking-wide">
                        {promo.badge}
                      </span>
                      <span className="absolute bottom-2 left-2 text-white text-[11px] font-bold drop-shadow-md">
                        {promo.restaurantName}
                      </span>
                    </div>

                    <div className="p-3 flex-1 flex flex-col justify-between space-y-2">
                      <div>
                        <h3 className="font-semibold text-xs text-slate-900 leading-snug line-clamp-1">
                          {promo.title}
                        </h3>
                        <p className="text-[10px] text-slate-500 mt-0.5 line-clamp-2">
                          {promo.description}
                        </p>
                      </div>

                      <div className="pt-2 border-t border-slate-100 flex items-center justify-between gap-2">
                        <span className="text-xs font-bold text-emerald-800">
                          {promo.price}
                        </span>
                        <button
                          type="button"
                          onClick={() => handleOpenWhatsApp(promo.whatsapp, promo.whatsappMessage)}
                          className="py-1 px-2.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-[10px] font-bold flex items-center gap-1 shadow-xs transition-colors"
                        >
                          <MessageCircle className="w-3 h-3" />
                          <span>Aprovechar</span>
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* SECCIÓN 2: LOGÍSTICA TURÍSTICA DIRECTA (Teleférico, Vuelos, Parques, Terminal) */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="font-playfair text-lg font-bold text-slate-900">
                    🏔️ Guía del Viajero &amp; Logística
                  </h2>
                  <p className="text-[11px] text-slate-500">
                    Teleférico Mukumbarí, vuelos, terminal y parques oficiales
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setMobileTab('logistics')}
                  className="text-xs font-bold text-[#c85a32] hover:underline flex items-center gap-0.5"
                >
                  <span>Detalles</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>

              <div className="grid grid-cols-2 gap-2.5">
                {TOURIST_LOGISTICS_HUBS.map((hub) => (
                  <button
                    key={hub.id}
                    type="button"
                    onClick={() => setSelectedLogistics(hub)}
                    className="p-3 rounded-2xl bg-white border border-[#EAE3D5] hover:border-amber-400 text-left transition-all shadow-2xs hover:shadow-xs group flex flex-col justify-between"
                  >
                    <div>
                      <div className="flex items-center justify-between mb-1.5">
                        <span className="text-2xl">{hub.icon}</span>
                        <span className="text-[9px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded bg-emerald-50 text-emerald-800 border border-emerald-200">
                          {hub.badge}
                        </span>
                      </div>
                      <h3 className="font-playfair font-bold text-xs text-slate-900 group-hover:text-emerald-800 leading-snug">
                        {hub.title}
                      </h3>
                      <p className="text-[10px] text-slate-500 line-clamp-1 mt-0.5">
                        {hub.subtitle}
                      </p>
                    </div>

                    <div className="mt-2 pt-1.5 border-t border-slate-100 flex items-center justify-between text-[10px] font-semibold text-emerald-700">
                      <span>Ver info</span>
                      <ArrowRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* SECCIÓN 3: TOP RESTAURANTES DESTACADOS CON CONVERSIÓN WHATSAPP & MAPS */}
            <div className="space-y-3 pt-2">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="font-playfair text-lg font-bold text-slate-900">
                    🍴 Restaurantes Oficiales
                  </h2>
                  <p className="text-[11px] text-slate-500">
                    Agremiados avalados con Sello Oficial de la Cámara
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setMobileTab('restaurants')}
                  className="text-xs font-bold text-[#c85a32] hover:underline flex items-center gap-0.5"
                >
                  <span>Ver todos ({restaurants.length})</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>

              {/* Lista Vertical de Tarjetas Móviles */}
              <div className="space-y-3">
                {filteredRestaurants.slice(0, 5).map((r) => (
                  <RestaurantMobileCard
                    key={r.id}
                    restaurant={r}
                    onSelect={() => onSelectRestaurant(r)}
                    onWhatsApp={() => handleOpenWhatsApp(r.whatsapp || r.phone, `Hola ${r.name}, los encontré en la App de Mérida Gastronómica. Quiero consultar disponibilidad / reservar una mesa.`)}
                    onGPS={() => handleOpenGPS(r)}
                    onShare={() => handleShareRestaurant(r)}
                  />
                ))}
              </div>

              {filteredRestaurants.length > 5 && (
                <button
                  type="button"
                  onClick={() => setMobileTab('restaurants')}
                  className="w-full py-3 rounded-2xl bg-white border border-[#EAE3D5] text-slate-900 font-bold text-xs hover:bg-slate-50 flex items-center justify-center gap-1.5 shadow-2xs"
                >
                  <span>Explorar los {filteredRestaurants.length} Restaurantes</span>
                  <ArrowRight className="w-3.5 h-3.5 text-[#c85a32]" />
                </button>
              )}
            </div>

          </div>
        )}

        {/* ----------------------------------------------------------------------- */}
        {/* TAB 2: RESTAURANTES (CATÁLOGO COMPLETO CON FILTROS DE ANTOJO)            */}
        {/* ----------------------------------------------------------------------- */}
        {mobileTab === 'restaurants' && (
          <div className="space-y-4 animate-fadeIn">
            
            {/* Header del Catálogo */}
            <div>
              <h2 className="font-playfair text-xl font-bold text-slate-900">
                Guía Oficial de Restaurantes
              </h2>
              <p className="text-xs text-slate-500">
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
                    className={`px-3 py-1 rounded-full text-xs font-semibold whitespace-nowrap shrink-0 transition-all flex items-center gap-1 border ${
                      isActive
                        ? 'bg-[#c85a32] text-white border-[#c85a32] shadow-xs'
                        : 'bg-white text-slate-600 border-[#EAE3D5]'
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
                <Utensils className="w-10 h-10 text-slate-400 mx-auto" />
                <h3 className="font-playfair font-bold text-base text-slate-800">
                  No se encontraron resultados
                </h3>
                <p className="text-xs text-slate-500 max-w-xs mx-auto">
                  Prueba cambiando los filtros de antojo o seleccionando otro eje turístico.
                </p>
                <button
                  type="button"
                  onClick={() => {
                    setSearchTerm('');
                    setSelectedAxis('todos');
                    setSelectedCrave('todos');
                  }}
                  className="py-2 px-4 rounded-full bg-[#042f2e] text-amber-300 font-bold text-xs"
                >
                  Restablecer Filtros
                </button>
              </div>
            ) : (
              <div className="space-y-3">
                {filteredRestaurants.map((r) => (
                  <RestaurantMobileCard
                    key={r.id}
                    restaurant={r}
                    onSelect={() => onSelectRestaurant(r)}
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
              <span className="text-[10px] font-bold uppercase tracking-wider text-[#c85a32] block">
                Pulso Gastronómico Semanal
              </span>
              <h2 className="font-playfair text-xl font-bold text-slate-900">
                Planes, 2x1 &amp; Salidas en Mérida
              </h2>
              <p className="text-xs text-slate-500">
                La agenda gastronómica activa para disfrutar entre amigos, en pareja o con la familia.
              </p>
            </div>

            <div className="space-y-3.5">
              {WEEKLY_PROMOS_DATA.map((promo) => (
                <div
                  key={promo.id}
                  className="rounded-3xl bg-white border border-[#EAE3D5] overflow-hidden shadow-2xs hover:shadow-md transition-all flex flex-col"
                >
                  <div className="relative h-40 w-full overflow-hidden bg-slate-100">
                    <img
                      src={promo.image}
                      alt={promo.title}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
                    
                    <div className="absolute top-3 left-3 flex items-center gap-1.5">
                      <span className="px-2.5 py-1 rounded-full bg-amber-500 text-slate-950 font-bold text-[10px] uppercase shadow-sm">
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
                        <h3 className="font-playfair font-bold text-sm text-white leading-snug drop-shadow-md">
                          {promo.title}
                        </h3>
                      </div>
                      <span className="text-xs font-bold text-white bg-emerald-700/80 px-2 py-0.5 rounded-lg border border-emerald-400/40 shrink-0">
                        {promo.price}
                      </span>
                    </div>
                  </div>

                  <div className="p-3.5 space-y-3">
                    <p className="text-xs text-slate-600 leading-relaxed">
                      {promo.description}
                    </p>

                    <div className="flex items-center gap-1.5 text-[11px] text-slate-500">
                      <MapPin className="w-3.5 h-3.5 text-[#c85a32] shrink-0" />
                      <span className="truncate">{promo.location}</span>
                    </div>

                    <div className="pt-2 border-t border-slate-100 flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => handleOpenWhatsApp(promo.whatsapp, promo.whatsappMessage)}
                        className="flex-1 py-2.5 px-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs flex items-center justify-center gap-1.5 shadow-sm active:scale-95 transition-all"
                      >
                        <MessageCircle className="w-4 h-4" />
                        <span>Aprovechar por WhatsApp</span>
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

          </div>
        )}

        {/* ----------------------------------------------------------------------- */}
        {/* TAB 4: GUÍA DEL VIAJERO & LOGÍSTICA ANDINA                               */}
        {/* ----------------------------------------------------------------------- */}
        {mobileTab === 'logistics' && (
          <div className="space-y-4 animate-fadeIn">
            
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-800 block">
                Todo Mérida en un Solo Lugar
              </span>
              <h2 className="font-playfair text-xl font-bold text-slate-900">
                Guía del Viajero &amp; Logística
              </h2>
              <p className="text-xs text-slate-500">
                Información oficial del Teleférico Mukumbarí, vuelos, terminales y atractivos turísticos.
              </p>
            </div>

            <div className="space-y-3">
              {TOURIST_LOGISTICS_HUBS.map((hub) => (
                <div
                  key={hub.id}
                  className="rounded-3xl bg-white border border-[#EAE3D5] p-4 shadow-2xs hover:shadow-sm transition-all space-y-3"
                >
                  <div className="flex items-start gap-3">
                    <div className="w-12 h-12 rounded-2xl bg-emerald-50 border border-emerald-200 flex items-center justify-center text-2xl shrink-0">
                      {hub.icon}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between gap-1">
                        <h3 className="font-playfair font-bold text-base text-slate-900">
                          {hub.title}
                        </h3>
                        <span className="text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
                          {hub.badge}
                        </span>
                      </div>
                      <p className="text-xs font-medium text-emerald-700 mt-0.5">
                        {hub.subtitle}
                      </p>
                      <p className="text-[11px] text-slate-500 mt-1 leading-snug">
                        {hub.shortDesc}
                      </p>
                    </div>
                  </div>

                  <div className="pt-2 border-t border-slate-100 flex items-center justify-between gap-2">
                    <button
                      type="button"
                      onClick={() => setSelectedLogistics(hub)}
                      className="flex-1 py-2 px-3 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs flex items-center justify-center gap-1.5 transition-colors"
                    >
                      <Info className="w-3.5 h-3.5 text-amber-400" />
                      <span>Ver Horarios, Tarifas &amp; Guía</span>
                    </button>
                    
                    <button
                      type="button"
                      onClick={() => handleOpenWhatsApp(hub.details.whatsappHelp, hub.details.whatsappText)}
                      className="py-2 px-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold flex items-center gap-1"
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
      {/* 4. MODAL / BOTTOM SHEET DE DETALLES LOGÍSTICOS                            */}
      {/* ========================================================================= */}
      {selectedLogistics && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-end sm:items-center justify-center p-0 sm:p-4 animate-fadeIn">
          <div className="w-full sm:max-w-lg bg-white rounded-t-3xl sm:rounded-3xl max-h-[85vh] overflow-y-auto border border-slate-200 shadow-2xl flex flex-col justify-between">
            
            {/* Modal Header */}
            <div className="sticky top-0 z-10 bg-gradient-to-r from-[#042f2e] to-[#064e3b] text-white p-4 rounded-t-3xl sm:rounded-t-3xl flex items-center justify-between border-b border-amber-500/20">
              <div className="flex items-center gap-2.5">
                <span className="text-2xl">{selectedLogistics.icon}</span>
                <div>
                  <h3 className="font-playfair font-bold text-base text-white">
                    {selectedLogistics.title}
                  </h3>
                  <p className="text-[10px] text-emerald-200">
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
            <div className="p-4 space-y-4 text-xs text-slate-700">
              
              {/* Status & Hours */}
              <div className="p-3 rounded-2xl bg-emerald-50 border border-emerald-200 space-y-1">
                <div className="flex items-center gap-1.5 font-bold text-emerald-900">
                  <Clock className="w-3.5 h-3.5 text-emerald-700" />
                  <span>Estado: {selectedLogistics.details.status}</span>
                </div>
                {selectedLogistics.details.hours && (
                  <p className="text-[11px] text-emerald-800">
                    <strong>Horario:</strong> {selectedLogistics.details.hours}
                  </p>
                )}
                {selectedLogistics.details.location && (
                  <p className="text-[11px] text-emerald-800">
                    <strong>Ubicación:</strong> {selectedLogistics.details.location}
                  </p>
                )}
              </div>

              {/* Tarifas de Referencia si Aplican */}
              {Array.isArray(selectedLogistics.details.rates) && (
                <div className="space-y-1.5">
                  <h4 className="font-bold text-slate-900 flex items-center gap-1">
                    <span>💵 Tarifas de Referencia</span>
                  </h4>
                  <div className="space-y-1">
                    {selectedLogistics.details.rates.map((rate, i) => (
                      <div key={i} className="flex items-center justify-between p-2 rounded-xl bg-slate-50 border border-slate-200">
                        <span className="text-slate-700">{rate.type}</span>
                        <span className="font-bold text-emerald-800">{rate.price}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Estaciones de Teleférico */}
              {Array.isArray(selectedLogistics.details.stations) && (
                <div className="space-y-1.5">
                  <h4 className="font-bold text-slate-900">
                    🚡 Las 5 Estaciones del Mukumbarí
                  </h4>
                  <div className="space-y-1.5">
                    {selectedLogistics.details.stations.map((st, i) => (
                      <div key={i} className="p-2.5 rounded-xl bg-slate-50 border border-slate-200 flex flex-col">
                        <div className="flex items-center justify-between">
                          <span className="font-bold text-slate-900">{st.name}</span>
                          <span className="text-[10px] font-bold text-emerald-700 bg-emerald-100 px-1.5 py-0.5 rounded">
                            {st.alt}
                          </span>
                        </div>
                        <span className="text-[10px] text-slate-500 mt-0.5">{st.note}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Aeropuertos & Vuelos */}
              {Array.isArray(selectedLogistics.details.airports) && (
                <div className="space-y-2">
                  <h4 className="font-bold text-slate-900">
                    ✈️ Terminales Aéreos &amp; Traslados
                  </h4>
                  {selectedLogistics.details.airports.map((ap, i) => (
                    <div key={i} className="p-2.5 rounded-xl bg-slate-50 border border-slate-200 space-y-1">
                      <div className="font-bold text-slate-900">{ap.name}</div>
                      <div className="text-[11px] text-slate-600"><strong>Aerolíneas:</strong> {ap.airlines}</div>
                      <div className="text-[11px] text-slate-600"><strong>Distancia a Mérida:</strong> {ap.distance}</div>
                      <div className="text-[11px] text-emerald-800 bg-emerald-50 p-1.5 rounded-lg border border-emerald-200 mt-1">
                        <strong>Taxis &amp; Costos:</strong> {ap.taxis}
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Parques Temáticos */}
              {Array.isArray(selectedLogistics.details.attractions) && (
                <div className="space-y-2">
                  <h4 className="font-bold text-slate-900">
                    🎡 Parques &amp; Atractivos Destacados
                  </h4>
                  {selectedLogistics.details.attractions.map((att, i) => (
                    <div key={i} className="p-2.5 rounded-xl bg-slate-50 border border-slate-200 space-y-0.5">
                      <div className="font-bold text-slate-900">{att.name}</div>
                      <div className="text-[11px] text-slate-600">{att.highlights}</div>
                      <div className="text-[10px] text-slate-500">📍 {att.location} • ⏰ {att.hours}</div>
                    </div>
                  ))}
                </div>
              )}

              {/* Rutas Terrestres */}
              {Array.isArray(selectedLogistics.details.mainRoutes) && (
                <div className="space-y-2">
                  <h4 className="font-bold text-slate-900">
                    🚌 Rutas Principales de Autobús
                  </h4>
                  {selectedLogistics.details.mainRoutes.map((rt, i) => (
                    <div key={i} className="p-2.5 rounded-xl bg-slate-50 border border-slate-200 space-y-0.5">
                      <div className="font-bold text-slate-900">{rt.route}</div>
                      <div className="text-[11px] text-slate-600"><strong>Líneas:</strong> {rt.lines}</div>
                      <div className="text-[10px] text-slate-500">⏱️ {rt.duration} • {rt.frequency}</div>
                    </div>
                  ))}
                </div>
              )}

              {/* Tips del Viajero */}
              {Array.isArray(selectedLogistics.details.tips) && (
                <div className="p-3 rounded-2xl bg-amber-50 border border-amber-200 space-y-1">
                  <span className="font-bold text-amber-900 text-[11px] uppercase tracking-wider block">
                    💡 Consejos para tu Viaje
                  </span>
                  <ul className="list-disc list-inside space-y-0.5 text-[11px] text-amber-950">
                    {selectedLogistics.details.tips.map((tip, i) => (
                      <li key={i}>{tip}</li>
                    ))}
                  </ul>
                </div>
              )}

            </div>

            {/* Modal Footer Actions */}
            <div className="p-3 bg-slate-50 border-t border-slate-200 rounded-b-3xl flex items-center gap-2">
              <button
                type="button"
                onClick={() => handleOpenWhatsApp(selectedLogistics.details.whatsappHelp, selectedLogistics.details.whatsappText)}
                className="flex-1 py-2.5 px-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs flex items-center justify-center gap-1.5 shadow-sm transition-all"
              >
                <MessageCircle className="w-4 h-4" />
                <span>Asistencia Turística WhatsApp</span>
              </button>
              <button
                type="button"
                onClick={() => setSelectedLogistics(null)}
                className="py-2.5 px-4 rounded-xl bg-slate-200 text-slate-800 font-semibold text-xs"
              >
                Cerrar
              </button>
            </div>

          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 5. BOTTOM NAVIGATION BAR FIJO ESTILO NATIVO                               */}
      {/* ========================================================================= */}
      <nav className="fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-[#EAE3D5] py-2 px-4 shadow-lg pb-safe">
        <div className="max-w-lg mx-auto flex items-center justify-around">
          
          <button
            type="button"
            onClick={() => setMobileTab('explore')}
            className={`flex flex-col items-center gap-1 transition-colors ${
              mobileTab === 'explore' ? 'text-emerald-800 font-bold' : 'text-slate-400 hover:text-slate-600'
            }`}
          >
            <div className={`p-1 rounded-xl transition-all ${mobileTab === 'explore' ? 'bg-emerald-100 text-emerald-900' : ''}`}>
              <Compass className="w-5 h-5" />
            </div>
            <span className="text-[10px]">Inicio</span>
          </button>

          <button
            type="button"
            onClick={() => setMobileTab('restaurants')}
            className={`flex flex-col items-center gap-1 transition-colors ${
              mobileTab === 'restaurants' ? 'text-emerald-800 font-bold' : 'text-slate-400 hover:text-slate-600'
            }`}
          >
            <div className={`p-1 rounded-xl transition-all ${mobileTab === 'restaurants' ? 'bg-emerald-100 text-emerald-900' : ''}`}>
              <Utensils className="w-5 h-5" />
            </div>
            <span className="text-[10px]">Restaurantes</span>
          </button>

          <button
            type="button"
            onClick={() => setMobileTab('promos')}
            className={`flex flex-col items-center gap-1 transition-colors ${
              mobileTab === 'promos' ? 'text-emerald-800 font-bold' : 'text-slate-400 hover:text-slate-600'
            }`}
          >
            <div className={`p-1 rounded-xl transition-all ${mobileTab === 'promos' ? 'bg-emerald-100 text-emerald-900' : ''}`}>
              <Tag className="w-5 h-5" />
            </div>
            <span className="text-[10px]">Promos</span>
          </button>

          <button
            type="button"
            onClick={() => setMobileTab('logistics')}
            className={`flex flex-col items-center gap-1 transition-colors ${
              mobileTab === 'logistics' ? 'text-emerald-800 font-bold' : 'text-slate-400 hover:text-slate-600'
            }`}
          >
            <div className={`p-1 rounded-xl transition-all ${mobileTab === 'logistics' ? 'bg-emerald-100 text-emerald-900' : ''}`}>
              <Mountain className="w-5 h-5" />
            </div>
            <span className="text-[10px]">Guía Viajero</span>
          </button>

        </div>
      </nav>

    </div>
  );
}

// Subcomponente: Tarjeta Móvil de Restaurante de Alta Conversión
function RestaurantMobileCard({
  restaurant,
  onSelect,
  onWhatsApp,
  onGPS,
  onShare
}) {
  return (
    <div className="rounded-3xl bg-white border border-[#EAE3D5] overflow-hidden shadow-2xs hover:shadow-md transition-all flex flex-col justify-between">
      
      {/* Portada & Badges */}
      <div 
        onClick={onSelect}
        className="relative h-44 w-full overflow-hidden bg-slate-100 cursor-pointer"
      >
        <img
          src={restaurant.coverImage || restaurant.foto_portada || 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=800&q=80'}
          alt={restaurant.name}
          className="w-full h-full object-cover"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-transparent to-black/30" />

        {/* Top Badges */}
        <div className="absolute top-2.5 left-2.5 right-2.5 flex items-center justify-between gap-1">
          {restaurant.isCertifiedByCamara ? (
            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-white/95 text-emerald-950 border border-amber-300 backdrop-blur-md shadow-sm">
              <ShieldCheck className="w-3.5 h-3.5 text-amber-600" />
              <span>Sello Oficial</span>
            </span>
          ) : (
            <span />
          )}

          <div className="flex items-center gap-1 bg-black/50 backdrop-blur-md px-2 py-0.5 rounded-full text-[10px] text-amber-300 border border-white/20">
            <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
            <span className="font-bold">{restaurant.rating || '5.0'}</span>
          </div>
        </div>

        {/* Bottom Tag inside Image */}
        <div className="absolute bottom-2.5 left-2.5 right-2.5 flex items-center justify-between text-white">
          <span className="text-[10px] font-bold px-2 py-0.5 rounded-lg bg-amber-500 text-slate-950 shadow-sm line-clamp-1">
            {restaurant.category || 'Gastronomía Andina'}
          </span>
          <span className="text-[10px] font-medium text-slate-200">
            {restaurant.priceTier || '$$'}
          </span>
        </div>
      </div>

      {/* Cuerpo */}
      <div className="p-3.5 space-y-2.5 flex-1 flex flex-col justify-between">
        
        <div>
          <div className="flex items-start justify-between gap-2">
            <h3 
              onClick={onSelect}
              className="font-playfair text-base font-bold text-slate-900 hover:text-emerald-800 leading-snug cursor-pointer"
            >
              {restaurant.name}
            </h3>
            <button
              type="button"
              onClick={onShare}
              className="text-slate-400 hover:text-slate-600 p-1"
              title="Compartir restaurante"
            >
              <Share2 className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="flex items-center gap-1 text-[11px] text-slate-500 mt-1">
            <MapPin className="w-3.5 h-3.5 text-[#c85a32] shrink-0" />
            <span className="truncate">{restaurant.location}</span>
          </div>

          {/* Plato Insignia o Tagline */}
          {restaurant.signatureDishes && restaurant.signatureDishes[0] ? (
            <div className="mt-2 p-2 rounded-xl bg-amber-50/70 border border-amber-200/80 text-[11px]">
              <span className="text-[9px] uppercase font-bold text-amber-800 tracking-wider flex items-center gap-1">
                <Sparkles className="w-2.5 h-2.5 text-amber-600" />
                Especialidad
              </span>
              <p className="text-slate-800 font-serif italic line-clamp-1">
                "{restaurant.signatureDishes[0].name}"
              </p>
            </div>
          ) : restaurant.tagline ? (
            <p className="text-[11px] text-slate-600 italic line-clamp-1 mt-1">
              "{restaurant.tagline}"
            </p>
          ) : null}
        </div>

        {/* Botonera de Conversión Rápida Móvil */}
        <div className="pt-2.5 border-t border-slate-100 grid grid-cols-3 gap-1.5">
          
          {/* Botón 1: WhatsApp Directo */}
          <button
            type="button"
            onClick={onWhatsApp}
            className="py-2 px-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-[11px] flex items-center justify-center gap-1 shadow-2xs active:scale-95 transition-all"
            title="Contactar o Reservar por WhatsApp"
          >
            <MessageCircle className="w-3.5 h-3.5" />
            <span>WhatsApp</span>
          </button>

          {/* Botón 2: GPS / Cómo Llegar */}
          <button
            type="button"
            onClick={onGPS}
            className="py-2 px-2 rounded-xl bg-[#042f2e] hover:bg-[#064e3b] text-amber-300 font-bold text-[11px] flex items-center justify-center gap-1 shadow-2xs active:scale-95 transition-all"
            title="Abrir ubicación en Google Maps"
          >
            <Navigation className="w-3.5 h-3.5 text-amber-400" />
            <span>GPS</span>
          </button>

          {/* Botón 3: Ver Ficha Completa */}
          <button
            type="button"
            onClick={onSelect}
            className="py-2 px-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-semibold text-[11px] flex items-center justify-center gap-1 transition-colors"
          >
            <span>Ficha</span>
            <ChevronRight className="w-3 h-3 text-slate-500" />
          </button>

        </div>

      </div>

    </div>
  );
}
