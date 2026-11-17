import React, { useMemo } from 'react';
import { 
  ArrowRight, 
  ArrowLeft, 
  Mountain, 
  Star, 
  Clock, 
  Users, 
  Check, 
  Compass,
  Utensils,
  MessageCircle,
  Sparkles
} from 'lucide-react';

const TOURIST_PACKAGES = [
  {
    id: 'full-day-valle-culata',
    badge: 'Más Popular • Full Day',
    title: 'Full Day Gastronómico El Valle & La Culata',
    duration: '8 Horas (8:30 AM – 4:30 PM)',
    groupSize: '2 a 12 Personas',
    description:
      'Recorrido guiado por las montañas de El Valle hasta el páramo de La Culata con paradas gastronómicas certificadas, degustación de quesos andinos, café de altura y almuerzo campestre.',
    highlights: [
      'Traslado 4x4 confortable ida y vuelta',
      'Desayuno andino en posada tradicional',
      'Parada de postres artesanales y kéfir en Piur',
      'Almuerzo típico frente a las montañas',
    ],
    image: '/images/el-valle-paisaje.jpg',
  },
  {
    id: 'ruta-cafes-bistros',
    badge: 'Experiencia Culinaria',
    title: 'Ruta de Bistros, Postres & Café de Montaña',
    duration: 'Medio Día (4 Horas)',
    groupSize: 'Parejas & Familias',
    description:
      'Tarde entre neblina y sabor recorriendo los bistros boutique, casas de té y cafés artesanales del circuito El Valle te Conecta.',
    highlights: [
      'Cata de café merideño de estricta altura',
      'Degustación de postres probióticos y tortas caseras',
      'Visita a miradores fotográficos de La Joya y La Carbonera',
      'Guía anfitrión especializado en gastronomía local',
    ],
    image: 'https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?auto=format&fit=crop&w=900&q=80',
  },
  {
    id: 'senderismo-ecoturismo',
    badge: 'Ecoturismo & Aventura',
    title: 'Senderismo de Páramo & Fogón Andino',
    duration: '6 Horas (7:30 AM – 1:30 PM)',
    groupSize: '4 a 15 Personas',
    description:
      'Caminata interpretativa por senderos ecológicos, observación de flora de altura y cierre con comida caliente tradicional en posada agremiada.',
    highlights: [
      'Guía certificado de montaña y primeros auxilios',
      'Hidratación y snack energético artesanal',
      'Almuerzo reconfortante de cocina andina',
      'Seguro de recorrido turístico local',
    ],
    image: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=900&q=80',
  },
];

export function ElValleTouristPage({ 
  restaurants = [], 
  onSelectRestaurant, 
  onBack, 
  onNavigate 
}) {
  // Filtrar solo los establecimientos pertenecientes al circuito El Valle te Conecta
  const elValleMembers = useMemo(() => {
    if (!Array.isArray(restaurants)) return [];
    return restaurants.filter((r) => {
      const text = [
        r.codigo_afiliado,
        r.category,
        r.categoria_negocio,
        r.zone,
        r.municipio,
        r.address,
        r.direccion_completa,
      ]
        .filter(Boolean)
        .join(' ')
        .toLowerCase();

      return (
        text.includes('el valle') ||
        text.includes('valle grande') ||
        text.includes('valle-') ||
        text.includes('culata') ||
        text.includes('chapeta') ||
        text.includes('carbonera') ||
        text.includes('la joya') ||
        text.includes('prado verde')
      );
    });
  }, [restaurants]);

  return (
    <div className="min-h-screen bg-[#FAF7F2] pt-24 pb-20">
      
      {/* Top Scenic Tourist Header */}
      <section className="relative py-12 sm:py-16 border-b border-[#EAE3D5] overflow-hidden">
        <div className="absolute inset-0 z-0 pointer-events-none">
          <img
            src="/images/el-valle-paisaje.jpg"
            alt="El Valle y La Culata, Mérida"
            className="w-full h-full object-cover object-center filter saturate-[1.25] contrast-[1.06]"
          />
          <div className="absolute inset-0 bg-[#FAF7F2]/80 lg:hidden" />
          <div
            className="hidden lg:block absolute inset-0"
            style={{
              background:
                'linear-gradient(90deg, #FAF7F2 0%, rgba(250, 247, 242, 0.94) 36%, rgba(250, 247, 242, 0.58) 56%, rgba(250, 247, 242, 0.12) 76%, rgba(250, 247, 242, 0) 100%)',
            }}
          />
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <button
            type="button"
            onClick={onBack}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-white/90 hover:bg-white border border-[#EAE3D5] text-xs font-semibold text-[#1E1C1A] mb-6 shadow-2xs transition-all"
          >
            <ArrowLeft className="w-3.5 h-3.5 text-[#C85A32]" />
            <span>Volver al Inicio</span>
          </button>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            <div className="lg:col-span-8 space-y-4">
              <span className="text-[11px] font-bold uppercase tracking-[0.2em] text-[#C85A32] block">
                Ruta Turística Certificada • Circuito El Valle &amp; La Culata
              </span>
              <h1 className="font-playfair text-4xl sm:text-5xl font-bold text-[#1E1C1A] leading-tight">
                El Valle <span className="italic font-normal text-[#C85A32]">te Conecta</span>
              </h1>
              <p className="text-sm sm:text-base text-[#4F4842] max-w-2xl leading-relaxed font-sans">
                El Valle te conecta es tu puerta de entrada a la experiencia andina perfecta en Mérida. Somos una ruta turística certificada que une las mejores posadas, restaurantes, parques y guías de El Valle y La Culata para que tú solo te preocupes por disfrutar de la montaña, el frío y la buena comida.
              </p>
            </div>

            <div className="lg:col-span-4 flex justify-start lg:justify-end">
              <div className="w-44 sm:w-52 aspect-[4/3] rounded-3xl bg-white p-4 shadow-lg border-2 border-white flex items-center justify-center">
                <img
                  src="/images/el-valle-logo.jpg"
                  alt="Logo El Valle te Conecta"
                  className="w-full h-full object-contain"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Section 1: Establecimientos Afiliados de El Valle te Conecta (Tarjetas tamaño compacto igual a portada) */}
      <section className="py-14 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 gap-4">
          <div>
            <span className="text-[11px] font-bold uppercase tracking-[0.2em] text-[#C85A32] block mb-1">
              Lugares Certificados en la Ruta
            </span>
            <h2 className="font-playfair text-3xl sm:text-4xl font-bold text-[#1E1C1A]">
              Anfitriones de <span className="italic font-normal text-[#C85A32]">El Valle</span>
            </h2>
            <p className="text-xs sm:text-sm text-[#5C554E] mt-1.5 max-w-xl">
              Descubre las posadas, restaurantes, casas de postres y espacios gastronómicos activos en el circuito.
            </p>
          </div>
          <span className="text-xs font-semibold text-[#7A7168] bg-white px-4 py-2 rounded-full border border-[#EAE3D5] self-start sm:self-auto">
            {elValleMembers.length} {elValleMembers.length === 1 ? 'Establecimiento Activo' : 'Establecimientos Activos'}
          </span>
        </div>

        {elValleMembers.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
            {elValleMembers.map((restaurant) => {
              const isFeatured = restaurant.isFeatured || restaurant.destacado_portada;
              const imgSrc = restaurant.coverImage || restaurant.image || restaurant.foto_portada || '/images/el-valle-paisaje.jpg';
              const categoryLabel = restaurant.category || restaurant.categoria_negocio || 'El Valle te Conecta';
              const shortDesc = restaurant.description || restaurant.observaciones || `${restaurant.zone || 'El Valle'}, Mérida.`;

              return (
                <div
                  key={restaurant.id}
                  onClick={() => onSelectRestaurant && onSelectRestaurant(restaurant)}
                  className="rounded-2xl bg-white hover:bg-white border border-[#EAE3D5] hover:border-[#C85A32]/60 shadow-2xs hover:shadow-md transition-all duration-300 p-2.5 flex flex-col cursor-pointer group"
                >
                  {/* Compact Top Image (Mismo tamaño que portada) */}
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

                        <div className="w-8 h-8 rounded-full border border-[#EAE3D5] bg-[#FAF7F2] group-hover:bg-[#C85A32] group-hover:text-white group-hover:border-[#C85A32] text-[#1E1C1A] flex items-center justify-center shrink-0 transition-colors">
                          <ArrowRight className="w-3.5 h-3.5" />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="text-center py-12 rounded-3xl bg-white border border-[#EAE3D5]">
            <Utensils className="w-10 h-10 text-[#C85A32] mx-auto mb-2 opacity-70" />
            <p className="text-sm font-semibold text-[#1E1C1A]">Próximamente más anfitriones en esta ruta.</p>
          </div>
        )}
      </section>

      {/* Section 2: Paquetes Full Day & Rutas Ecoturísticas */}
      <section className="py-14 bg-white border-t border-[#EAE3D5]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-10">
            <span className="text-[11px] font-bold uppercase tracking-[0.2em] text-[#C85A32] block mb-1">
              Experiencias Guiadas &amp; Full Day
            </span>
            <h2 className="font-playfair text-3xl sm:text-4xl font-bold text-[#1E1C1A]">
              Paquetes &amp; Rutas <span className="italic font-normal text-[#C85A32]">Ecoturísticas</span>
            </h2>
            <p className="text-xs sm:text-sm text-[#5C554E] mt-1.5 max-w-2xl">
              Vive El Valle y La Culata sin preocupaciones: elige un itinerario armado con transporte, paradas gastronómicas y guías locales certificados.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {TOURIST_PACKAGES.map((pkg) => {
              const whatsappText = encodeURIComponent(
                `¡Hola! Estoy interesado en información y disponibilidad del paquete turístico: ${pkg.title}`
              );
              const whatsappUrl = `https://wa.me/584148817137?text=${whatsappText}`;

              return (
                <div
                  key={pkg.id}
                  className="rounded-3xl bg-[#FAF7F2] border border-[#EAE3D5] overflow-hidden flex flex-col justify-between shadow-2xs hover:shadow-md transition-all"
                >
                  <div>
                    <div className="h-44 relative overflow-hidden">
                      <img
                        src={pkg.image}
                        alt={pkg.title}
                        className="w-full h-full object-cover"
                      />
                      <span className="absolute top-3 left-3 px-3 py-1 rounded-full bg-white/95 text-[#C85A32] text-[10px] font-bold shadow-xs">
                        {pkg.badge}
                      </span>
                    </div>

                    <div className="p-6 space-y-3">
                      <h3 className="font-playfair text-xl font-bold text-[#1E1C1A] leading-snug">
                        {pkg.title}
                      </h3>

                      <div className="flex flex-wrap items-center gap-3 text-[11px] text-[#7A7168] font-medium">
                        <span className="flex items-center gap-1">
                          <Clock className="w-3.5 h-3.5 text-[#C85A32]" />
                          {pkg.duration}
                        </span>
                        <span className="flex items-center gap-1">
                          <Users className="w-3.5 h-3.5 text-[#C85A32]" />
                          {pkg.groupSize}
                        </span>
                      </div>

                      <p className="text-xs text-[#4F4842] leading-relaxed">
                        {pkg.description}
                      </p>

                      <ul className="space-y-1.5 pt-2">
                        {pkg.highlights.map((h) => (
                          <li key={h} className="flex items-start gap-2 text-[11px] text-[#1E1C1A]">
                            <Check className="w-3.5 h-3.5 text-[#C85A32] shrink-0 mt-0.5" />
                            <span>{h}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  <div className="px-6 pb-6 pt-2">
                    <a
                      href={whatsappUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-full py-3 px-4 rounded-full bg-[#C85A32] hover:bg-[#B04B26] text-white font-sans font-bold text-xs flex items-center justify-center gap-2 shadow-sm transition-all"
                    >
                      <MessageCircle className="w-4 h-4" />
                      <span>Consultar / Reservar Paquete</span>
                    </a>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Bottom Invitation for Business Owners in El Valle */}
      <section className="pt-12 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="p-6 sm:p-8 rounded-3xl bg-white border border-[#EAE3D5] flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-[#FAF3EB] text-[#C85A32] flex items-center justify-center shrink-0">
              <Mountain className="w-5 h-5" />
            </div>
            <div>
              <h4 className="font-playfair font-bold text-base text-[#1E1C1A]">
                ¿Tienes una posada, parque o restaurante en El Valle?
              </h4>
              <p className="text-xs text-[#5C554E]">
                Únete al circuito turístico oficial con condiciones especiales para el sector.
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={() => onNavigate && onNavigate('affiliates_el_valle')}
            className="px-5 py-2.5 rounded-full bg-[#FAF3EB] hover:bg-[#C85A32] text-[#C85A32] hover:text-white border border-[#EAE3D5] font-sans font-bold text-xs flex items-center gap-1.5 transition-all shrink-0"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Afiliar mi Negocio a El Valle</span>
          </button>
        </div>
      </section>

    </div>
  );
}
