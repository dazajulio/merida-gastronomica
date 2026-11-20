import React, { useState, useEffect } from 'react';
import {
  ArrowRight,
  Sparkles,
  ChevronLeft,
  ChevronRight,
  Calendar,
  Mountain,
  GraduationCap,
  Phone,
  MapPin,
  CheckCircle2,
  MessageCircle,
  Instagram,
  Award,
  Maximize2,
  X,
} from 'lucide-react';

export function HeroSection({ setActiveTab, restaurantCount = 25 }) {
  const [activeFlyerIndex, setActiveFlyerIndex] = useState(0);
  const [selectedFlyer, setSelectedFlyer] = useState(null);

  const slides = [
    {
      id: 'legacy-hero',
      layout: 'melt-left', // Diseño 1 (Intocable): Degradado cálido fundido sobre foto full-bleed
      eyebrow: 'Cámara Gastronómica del Estado Mérida',
      titlePrefix: 'La Cocina',
      titleItalic: 'Andina,',
      titleSuffix: 'Nuestro Legado',
      description:
        'Descubre la guía oficial de restaurantes, posadas, café de especialidad y cacao criollo en la cordillera merideña. Tradición, diseño y hospitalidad de altura.',
      primaryCta: { label: 'Explorar Guía', target: 'guide', icon: ArrowRight },
      secondaryCta: { label: 'Afiliar mi Negocio', target: 'affiliates_register', icon: Sparkles },
      image: '/images/merida_hero_gastronomica.jpg',
      imageAlt: 'Mérida Gastronómica - Tradición culinaria frente a los Andes',
      handwrittenNote: '“Sabores con historia de altura” — CGEM',
      metrics: [
        { value: restaurantCount > 0 ? `${restaurantCount}+` : '25+', label: 'Establecimientos Oficiales' },
        { value: '4', label: 'Circuitos Gastronómicos' },
        { value: '100%', label: 'Identidad Merideña' },
      ],
    },
    {
      id: 'iutcm-convenio-hero',
      layout: 'academic-banner', // Diseño 4 (Distinto): Azul académico institucional + acento dorado + foto campus
      eyebrow: 'Convenio Institucional • CGEM × IUTCM',
      titlePrefix: 'Acredita tu',
      titleItalic: 'Experiencia',
      titleSuffix: 'Gastronómica',
      description:
        'Estudio de acreditación de saberes sin costo y tarifas preferenciales en licenciaturas de Turismo y Gastronomía para agremiados, empleados y familiares.',
      image: '/images/iutcm-estudiantes.jpg',
      imageAlt: 'Convenio Académico CGEM e IUTCM en Mérida',
      logoOverlay: '/images/iutcm-logo.png',
      phone: '+58 424-7837583',
      phoneHref: 'tel:+584247837583',
      address: 'Sede: Av. Urdaneta, Mérida',
      highlights: [
        'Acreditación de saberes gratis',
        '4 menciones en Turismo y Gastronomía',
        'Dueños, empleados y familiares',
      ],
    },
    {
      id: 'el-valle-hero',
      layout: 'floating-card', // Diseño 2 (Distinto): Tarjeta editorial flotante sobre paisaje panorámico + logo
      eyebrow: 'Ruta Turística Certificada • El Valle & La Culata',
      titlePrefix: 'El Valle',
      titleItalic: 'te Conecta',
      titleSuffix: 'con la Montaña',
      description:
        'Tu puerta de entrada a la experiencia andina perfecta en Mérida: las mejores posadas, restaurantes, parques y guías de El Valle y La Culata en un solo circuito.',
      primaryCta: { label: 'Explorar El Valle', target: 'el_valle_ruta', icon: ArrowRight },
      secondaryCta: { label: 'Paquetes Full Day', target: 'el_valle_ruta', icon: Mountain },
      image: '/images/el-valle-paisaje.jpg',
      imageAlt: 'Paisaje andino de El Valle y La Culata, Mérida',
      logoOverlay: '/images/el-valle-logo.jpg',
      handwrittenNote: '“Montaña, frío y buena comida” — El Valle',
      metrics: [
        { value: 'Posadas', label: '& Alojamientos de Altura' },
        { value: 'Full Day', label: 'Rutas Ecoturísticas' },
        { value: '100%', label: 'Guías Certificados' },
      ],
    },
    {
      id: 'noche-atoles-hero',
      layout: 'framed-split', // Diseño 3 (Distinto): Split editorial sobre lino cálido + marco fotográfico nítido
      eyebrow: 'Patrimonio Cultural del Estado Mérida • Pozo Hondo, Ejido',
      titlePrefix: 'La Noche de',
      titleItalic: 'los Atoles',
      titleSuffix: 'en Pozo Hondo',
      description:
        'Tradicional festividad navideña en Campo Elías (3er fin de semana de diciembre, desde las 4:00 p.m.) con más de 58 variedades de atoles, hallacas, dulces criollos, música y pesebres.',
      primaryCta: { label: 'Ver Agenda de Eventos', target: 'events', icon: Calendar },
      secondaryCta: { label: 'Guía de Restaurantes', target: 'guide', icon: ArrowRight },
      image: '/images/eventos/noche-atoles-hero.jpg',
      imageAlt: 'La Noche de los Atoles en Pozo Hondo, Ejido, Mérida',
      handwrittenNote: '“58+ sabores y tradición decembrina” — Ejido',
      metrics: [
        { value: '58+', label: 'Variedades de Atoles' },
        { value: '3er FDS', label: 'Diciembre • 4:00 p.m.' },
        { value: 'Patrimonio', label: 'Cultural del Estado Mérida' },
      ],
    },
    {
      id: 'andes-business-hero',
      layout: 'summit-showcase', // Diseño 5 (Distinto): Verde bosque andino + oro metalizado + tarjeta ejecutiva
      eyebrow: 'Encuentro Empresarial & Turístico • 4, 5 y 6 Dic 2026',
      titlePrefix: 'Andes Business',
      titleItalic: 'Mérida 2026',
      titleSuffix: 'Negocios Reales',
      tagline: 'Conectamos empresas, turismo y oportunidades',
      description:
        'El punto de encuentro donde el sector empresarial y turístico de Venezuela se reúne para generar negocios reales. Durante tres días en el Hotel La Pedregosa, unimos marcas, emprendedores e inversionistas en un espacio estratégico de alto impacto.',
      venue: 'Hotel La Pedregosa, Mérida',
      dates: '4, 5 y 6 de Diciembre 2026',
      whatsappUrl:
        'https://wa.me/584147187233?text=Hola,%20deseo%20más%20información%20y%20disponibilidad%20de%20stands%20para%20Andes%20Business%20Mérida%202026',
      instagramUrl: 'https://www.instagram.com/andesbusinesseventos/',
      instagramHandle: '@andesbusinesseventos',
      phones: ['+58 414-7187233', '+58 426-8316561'],
      image: '/images/eventos/andes-business-flyer-main.jpg',
      imageAlt: 'Andes Business Mérida 2026 en Hotel La Pedregosa',
      flyers: [
        { title: 'Afiche Oficial', src: '/images/eventos/andes-business-flyer-main.jpg' },
        { title: '¿Qué es Andes Business?', src: '/images/eventos/andes-business-flyer-info.jpg' },
        { title: 'Conferencias & Precios', src: '/images/eventos/andes-business-flyer-speakers.jpg' },
      ],
      speakers: [
        { name: 'Luis Vicente León', title: 'Presidente Datanálisis', date: '5 Dic' },
        { name: 'Richard Ujueta', title: 'Presidente Cavecom-e', date: '6 Dic' },
      ],
      highlights: [
        'Stands en Salón Barquisimeto',
        'Rueda de Negocios & Alianzas B2B',
        'Conferencias en Salón Tibisay',
      ],
      metrics: [
        { value: '3 Días', label: 'Conexiones & Oportunidades' },
        { value: 'Hotel', label: 'La Pedregosa • Mérida' },
        { value: 'B2B', label: 'Alianzas & Inversión' },
      ],
    },
  ];

  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  // Desplazamiento automático de derecha a izquierda cada 3 segundos
  useEffect(() => {
    if (slides.length <= 1 || isPaused) return;
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % slides.length);
    }, 3000);
    return () => clearInterval(timer);
  }, [slides.length, isPaused]);

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev - 1 + slides.length) % slides.length);
  };

  const handleNext = () => {
    setCurrentIndex((prev) => (prev + 1) % slides.length);
  };

  return (
    <section
      className="relative bg-[#FAF7F2] border-b border-[#EAE3D5] overflow-hidden"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      {/* Horizontal Sliding Track (Right-to-Left Smooth Displacement) */}
      <div
        className="flex transition-transform duration-700 ease-in-out w-full"
        style={{ transform: `translateX(-${currentIndex * 100}%)` }}
      >
        {slides.map((slide) => {
          const PrimaryIcon = slide.primaryCta?.icon || ArrowRight;
          const SecondaryIcon = slide.secondaryCta?.icon || Sparkles;

          /* ================================================================
             LAYOUT 4 (CONVENIO IUTCM): Azul académico + acento dorado + logo
             ================================================================ */
          if (slide.layout === 'academic-banner') {
            return (
              <div
                key={slide.id}
                className="w-full shrink-0 relative min-h-[66vh] sm:min-h-[70vh] flex items-center pt-24 pb-14 sm:pt-28 sm:pb-14 bg-[#0B2239] text-white overflow-hidden"
              >
                {/* Subtle Academic Pattern */}
                <div className="absolute inset-0 pointer-events-none opacity-25 bg-[radial-gradient(circle_at_top_right,#F4B41A_0%,transparent_45%)]" />

                <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
                  <div className="grid grid-cols-1 lg:grid-cols-12 items-center gap-8">
                    {/* Left: Brief & Punctual Convenio Info */}
                    <div className="lg:col-span-7 space-y-5">
                      <div className="flex flex-wrap items-center gap-3">
                        <span className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-[#F4B41A] text-[#0B2239] text-[11px] font-extrabold uppercase tracking-wider">
                          <GraduationCap className="w-3.5 h-3.5" />
                          <span>{slide.eyebrow}</span>
                        </span>
                      </div>

                      <h1 className="font-playfair text-3xl sm:text-5xl lg:text-[3.4rem] font-bold text-white leading-[1.08] tracking-tight">
                        {slide.titlePrefix}{' '}
                        <span className="italic font-normal text-[#F4B41A]">
                          {slide.titleItalic}
                        </span>{' '}
                        {slide.titleSuffix}
                      </h1>

                      <p className="font-sans text-sm sm:text-base text-slate-200 max-w-xl leading-relaxed">
                        {slide.description}
                      </p>

                      {/* 3 Brief Highlights */}
                      <div className="flex flex-wrap gap-2">
                        {(slide.highlights || []).map((hl, idx) => (
                          <span
                            key={idx}
                            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/10 border border-white/15 text-xs font-semibold text-white"
                          >
                            <CheckCircle2 className="w-3.5 h-3.5 text-[#F4B41A] shrink-0" />
                            <span>{hl}</span>
                          </span>
                        ))}
                      </div>

                      {/* Direct Contact Info (No CTA redirect) */}
                      <div className="pt-1 flex flex-wrap items-center gap-3">
                        <a
                          href={slide.phoneHref}
                          className="inline-flex items-center gap-2 px-5 py-3 rounded-full bg-[#F4B41A] hover:bg-[#e5a60e] text-[#0B2239] font-sans font-extrabold text-sm shadow-md transition-all active:scale-[0.98]"
                        >
                          <Phone className="w-4 h-4" />
                          <span>{slide.phone}</span>
                        </a>

                        <div className="inline-flex items-center gap-2 px-4 py-3 rounded-full bg-white/10 border border-white/20 text-white font-sans font-semibold text-xs sm:text-sm">
                          <MapPin className="w-4 h-4 text-[#F4B41A] shrink-0" />
                          <span>{slide.address}</span>
                        </div>
                      </div>
                    </div>

                    {/* Right: IUTCM Logo Pill + Campus Photo */}
                    <div className="hidden lg:flex lg:col-span-5 flex-col items-end gap-4">
                      <div className="relative w-full max-w-md rounded-3xl overflow-hidden border-2 border-[#F4B41A]/50 shadow-2xl bg-white">
                        <img
                          src={slide.image}
                          alt={slide.imageAlt}
                          className="w-full h-64 sm:h-72 object-cover object-center"
                        />
                        {slide.logoOverlay && (
                          <div className="p-3.5 bg-white flex items-center justify-between border-t border-slate-100">
                            <img
                              src={slide.logoOverlay}
                              alt="IUTCM Logo"
                              className="h-10 w-auto object-contain"
                            />
                            <span className="text-[11px] font-bold uppercase tracking-wider text-[#0B2239] bg-amber-100 px-3 py-1 rounded-full">
                              Beneficio Agremiado
                            </span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            );
          }

          /* ================================================================
             LAYOUT 1 (INTOCABLE): Degradado cálido fundido sobre foto full-bleed
             ================================================================ */
          if (slide.layout === 'melt-left') {
            return (
              <div
                key={slide.id}
                className="w-full shrink-0 relative min-h-[66vh] sm:min-h-[70vh] flex items-center pt-24 pb-14 sm:pt-28 sm:pb-14 overflow-hidden"
              >
                <div className="absolute inset-0 z-0 pointer-events-none">
                  <img
                    src={slide.image}
                    alt={slide.imageAlt}
                    className="w-full h-full object-cover object-center lg:object-right filter saturate-[1.12]"
                  />
                  <div className="absolute inset-0 bg-[#FAF7F2]/88 lg:hidden" />
                  <div
                    className="hidden lg:block absolute inset-0"
                    style={{
                      background:
                        'linear-gradient(90deg, #FAF7F2 0%, rgba(250, 247, 242, 0.97) 35%, rgba(250, 247, 242, 0.86) 50%, rgba(250, 247, 242, 0.34) 68%, rgba(250, 247, 242, 0.04) 86%, rgba(250, 247, 242, 0) 100%)',
                    }}
                  />
                  <div className="absolute inset-x-0 top-0 h-24 bg-gradient-to-b from-[#FAF7F2]/75 via-[#FAF7F2]/25 to-transparent" />
                  <div className="absolute inset-x-0 bottom-0 h-20 bg-gradient-to-t from-[#FAF7F2] via-[#FAF7F2]/40 to-transparent" />
                </div>

                <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
                  <div className="grid grid-cols-1 lg:grid-cols-12 items-center gap-8">
                    <div className="lg:col-span-6 space-y-4 text-left">
                      <span className="inline-block text-[11px] font-bold uppercase tracking-[0.2em] text-[#C85A32]">
                        {slide.eyebrow}
                      </span>

                      <h1 className="font-playfair text-4xl sm:text-5xl lg:text-[3.5rem] font-bold text-[#1E1C1A] leading-[1.06] tracking-tight">
                        {slide.titlePrefix}{' '}
                        <span className="italic font-normal text-[#C85A32]">
                          {slide.titleItalic}
                        </span>
                        <br />
                        {slide.titleSuffix}
                      </h1>

                      <p className="text-sm sm:text-[15px] text-[#4F4842] leading-relaxed max-w-lg font-sans">
                        {slide.description}
                      </p>

                      <div className="flex flex-wrap items-center gap-3 pt-1">
                        <button
                          type="button"
                          onClick={() => setActiveTab && setActiveTab(slide.primaryCta.target)}
                          className="px-6 py-3 rounded-full bg-[#C85A32] hover:bg-[#B04B26] text-white font-sans font-bold text-xs sm:text-sm flex items-center gap-2 shadow-sm transition-all active:scale-[0.98]"
                        >
                          <span>{slide.primaryCta.label}</span>
                          <PrimaryIcon className="w-4 h-4" />
                        </button>

                        <button
                          type="button"
                          onClick={() => setActiveTab && setActiveTab(slide.secondaryCta.target)}
                          className="px-6 py-3 rounded-full bg-white/95 hover:bg-[#FAF3EB] text-[#1E1C1A] border border-[#DED5C5] font-sans font-semibold text-xs sm:text-sm flex items-center gap-2 shadow-2xs transition-all active:scale-[0.98]"
                        >
                          <SecondaryIcon className="w-4 h-4 text-[#C85A32]" />
                          <span>{slide.secondaryCta.label}</span>
                        </button>
                      </div>

                      <div className="pt-4 flex flex-wrap items-center gap-5 sm:gap-7">
                        {slide.metrics.map((metric, mIdx) => (
                          <React.Fragment key={metric.label}>
                            {mIdx > 0 && <div className="h-8 w-px bg-[#DED5C5]" />}
                            <div>
                              <span className="block font-playfair text-2xl sm:text-3xl font-bold text-[#1E1C1A]">
                                {metric.value}
                              </span>
                              <span className="block text-[11px] text-[#6E655D] font-medium mt-0.5">
                                {metric.label}
                              </span>
                            </div>
                          </React.Fragment>
                        ))}
                      </div>
                    </div>

                    <div className="hidden lg:flex lg:col-span-6 relative h-full min-h-[260px] items-end justify-end pointer-events-none">
                      {slide.handwrittenNote && (
                        <div className="bg-[#FAF7F2]/85 backdrop-blur-xs px-4 py-2 rounded-2xl border border-[#EAE3D5]/80 shadow-sm -rotate-2 mb-2 mr-2">
                          <span className="font-handwritten text-xl text-[#4F4842] whitespace-pre-line leading-tight block">
                            {slide.handwrittenNote}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            );
          }

          /* ================================================================
             LAYOUT 2 (EL VALLE): Tarjeta editorial flotante + paisaje vibrante + logo
             ================================================================ */
          if (slide.layout === 'floating-card') {
            return (
              <div
                key={slide.id}
                className="w-full shrink-0 relative min-h-[66vh] sm:min-h-[70vh] flex items-center pt-24 pb-14 sm:pt-28 sm:pb-14 overflow-hidden"
              >
                <div className="absolute inset-0 z-0 pointer-events-none">
                  <img
                    src={slide.image}
                    alt={slide.imageAlt}
                    className="w-full h-full object-cover object-center filter saturate-[1.2] contrast-[1.04]"
                  />
                  <div className="absolute inset-0 bg-gradient-to-b from-[#FAF7F2]/60 via-transparent to-[#FAF7F2]/75" />
                </div>

                <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
                  <div className="grid grid-cols-1 lg:grid-cols-12 items-center gap-8">
                    
                    {/* Floating Warm Ivory Glass Card */}
                    <div className="lg:col-span-7 bg-[#FAF7F2]/92 backdrop-blur-md rounded-[2rem] p-6 sm:p-8 border border-white shadow-xl space-y-4">
                      <span className="inline-block text-[11px] font-bold uppercase tracking-[0.2em] text-[#C85A32]">
                        {slide.eyebrow}
                      </span>

                      <h1 className="font-playfair text-3xl sm:text-5xl font-bold text-[#1E1C1A] leading-[1.08] tracking-tight">
                        {slide.titlePrefix}{' '}
                        <span className="italic font-normal text-[#C85A32]">
                          {slide.titleItalic}
                        </span>{' '}
                        {slide.titleSuffix}
                      </h1>

                      <p className="text-sm text-[#4F4842] leading-relaxed font-sans">
                        {slide.description}
                      </p>

                      <div className="flex flex-wrap items-center gap-3 pt-1">
                        <button
                          type="button"
                          onClick={() => setActiveTab && setActiveTab(slide.primaryCta.target)}
                          className="px-6 py-3 rounded-full bg-[#C85A32] hover:bg-[#B04B26] text-white font-sans font-bold text-xs sm:text-sm flex items-center gap-2 shadow-sm transition-all active:scale-[0.98]"
                        >
                          <span>{slide.primaryCta.label}</span>
                          <PrimaryIcon className="w-4 h-4" />
                        </button>

                        <button
                          type="button"
                          onClick={() => setActiveTab && setActiveTab(slide.secondaryCta.target)}
                          className="px-6 py-3 rounded-full bg-white hover:bg-[#FAF3EB] text-[#1E1C1A] border border-[#DED5C5] font-sans font-semibold text-xs sm:text-sm flex items-center gap-2 shadow-2xs transition-all active:scale-[0.98]"
                        >
                          <SecondaryIcon className="w-4 h-4 text-[#C85A32]" />
                          <span>{slide.secondaryCta.label}</span>
                        </button>
                      </div>

                      <div className="pt-3 border-t border-[#EAE3D5] flex flex-wrap items-center gap-5 sm:gap-7">
                        {slide.metrics.map((metric, mIdx) => (
                          <React.Fragment key={metric.label}>
                            {mIdx > 0 && <div className="h-7 w-px bg-[#DED5C5]" />}
                            <div>
                              <span className="block font-playfair text-xl sm:text-2xl font-bold text-[#1E1C1A]">
                                {metric.value}
                              </span>
                              <span className="block text-[11px] text-[#6E655D] font-medium">
                                {metric.label}
                              </span>
                            </div>
                          </React.Fragment>
                        ))}
                      </div>
                    </div>

                    {/* Right: Floating Logo Badge & Handwritten Quote */}
                    <div className="hidden lg:flex lg:col-span-5 flex-col items-end justify-between h-full min-h-[280px] pointer-events-none">
                      {slide.logoOverlay && (
                        <div className="w-44 aspect-[4/3] rounded-3xl bg-white/95 p-4 shadow-xl border-2 border-white flex items-center justify-center rotate-2">
                          <img
                            src={slide.logoOverlay}
                            alt="El Valle te Conecta Logo"
                            className="w-full h-full object-contain"
                          />
                        </div>
                      )}
                      {slide.handwrittenNote && (
                        <div className="bg-[#FAF7F2]/90 backdrop-blur-xs px-4 py-2 rounded-2xl border border-white shadow-md -rotate-2">
                          <span className="font-handwritten text-xl text-[#1E1C1A] block">
                            {slide.handwrittenNote}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            );
          }

          /* ================================================================
             LAYOUT 5 (ANDES BUSINESS MÉRIDA 2026): Verde Bosque Andino + Oro Metalizado + Tarjeta Ejecutiva
             ================================================================ */
          if (slide.layout === 'summit-showcase') {
            return (
              <div
                key={slide.id}
                className="w-full shrink-0 relative min-h-[66vh] sm:min-h-[70vh] flex items-center pt-24 pb-14 sm:pt-28 sm:pb-14 bg-gradient-to-br from-[#051713] via-[#0A2922] to-[#041410] text-white overflow-hidden"
              >
                {/* Background decorative luxury accents */}
                <div className="absolute inset-0 pointer-events-none opacity-30 bg-[radial-gradient(circle_at_top_right,#D4AF37_0%,transparent_50%)]" />
                <div className="absolute inset-0 pointer-events-none opacity-20 bg-[radial-gradient(circle_at_bottom_left,#10B981_0%,transparent_45%)]" />

                {/* Subtle technical / networking grid watermark */}
                <div
                  className="absolute inset-0 pointer-events-none opacity-[0.04]"
                  style={{
                    backgroundImage: 'linear-gradient(#fff 1px, transparent 1px), linear-gradient(90deg, #fff 1px, transparent 1px)',
                    backgroundSize: '48px 48px',
                  }}
                />

                <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
                  <div className="grid grid-cols-1 lg:grid-cols-12 items-center gap-8 lg:gap-10">
                    {/* Left Column: High-Impact Executive Presentation */}
                    <div className="lg:col-span-7 space-y-4 text-left">
                      {/* Eyebrow Badge */}
                      <div className="flex flex-wrap items-center gap-2.5">
                        <span className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-[#D4AF37]/15 border border-[#D4AF37]/40 text-[#F5D061] text-[11px] font-extrabold uppercase tracking-wider backdrop-blur-xs">
                          <Calendar className="w-3.5 h-3.5 text-[#F5D061]" />
                          <span>{slide.eyebrow}</span>
                        </span>
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-500/20 border border-emerald-400/30 text-[10px] font-bold text-emerald-300 uppercase tracking-wide">
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                          Stands Limitados
                        </span>
                      </div>

                      {/* Title */}
                      <h1 className="font-playfair text-3xl sm:text-5xl lg:text-[3.35rem] font-bold text-white leading-[1.08] tracking-tight">
                        {slide.titlePrefix}{' '}
                        <span className="italic font-normal text-[#F5D061] drop-shadow-sm">
                          {slide.titleItalic}
                        </span>
                        <span className="block text-base sm:text-xl lg:text-2xl font-sans font-medium text-emerald-100/90 mt-1.5 tracking-normal">
                          {slide.tagline}
                        </span>
                      </h1>

                      {/* Description */}
                      <p className="font-sans text-xs sm:text-sm text-slate-200 leading-relaxed max-w-xl">
                        {slide.description}
                      </p>

                      {/* Key Highlights / Pillars */}
                      <div className="flex flex-wrap gap-2 pt-0.5">
                        {(slide.highlights || []).map((hl, hIdx) => (
                          <span
                            key={hIdx}
                            className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 border border-white/15 text-[11px] sm:text-xs font-semibold text-slate-100"
                          >
                            <CheckCircle2 className="w-3.5 h-3.5 text-[#F5D061] shrink-0" />
                            <span>{hl}</span>
                          </span>
                        ))}
                      </div>

                      {/* Featured Keynote Speakers Pill */}
                      {slide.speakers && (
                        <div className="p-3 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-xs max-w-xl">
                          <div className="flex items-center justify-between text-[11px] font-bold uppercase tracking-wider text-[#F5D061] mb-2">
                            <span className="flex items-center gap-1.5">
                              <Award className="w-3.5 h-3.5" />
                              Conferencias Magistrales (Salón Tibisay)
                            </span>
                            <span className="text-slate-300 font-normal">60$ c/u</span>
                          </div>
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                            {slide.speakers.map((spk, sIdx) => (
                              <div
                                key={sIdx}
                                className="flex items-center gap-2 bg-black/25 p-2 rounded-xl border border-white/5"
                              >
                                <div className="w-7 h-7 rounded-full bg-[#D4AF37]/20 border border-[#D4AF37]/50 flex items-center justify-center font-bold text-[#F5D061] text-[11px] shrink-0">
                                  {spk.date.split(' ')[0]}
                                </div>
                                <div className="min-w-0">
                                  <p className="font-bold text-white truncate">{spk.name}</p>
                                  <p className="text-[10px] text-slate-300 truncate">
                                    {spk.title} • {spk.date}
                                  </p>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Direct CTA Buttons (Stand Booking & Info) */}
                      <div className="flex flex-wrap items-center gap-3 pt-1">
                        <a
                          href={slide.whatsappUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="px-5 py-3 rounded-full bg-gradient-to-r from-[#D4AF37] via-[#E5BF47] to-[#C99C2E] hover:brightness-110 text-[#07211B] font-sans font-extrabold text-xs sm:text-sm flex items-center gap-2 shadow-lg shadow-[#D4AF37]/25 transition-all active:scale-[0.98]"
                        >
                          <MessageCircle className="w-4 h-4 fill-[#07211B]/20" />
                          <span>Reservar Stand (WhatsApp)</span>
                        </a>

                        <a
                          href={slide.instagramUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="px-4 py-3 rounded-full bg-white/10 hover:bg-white/20 text-white border border-white/20 font-sans font-semibold text-xs sm:text-sm flex items-center gap-2 shadow-xs transition-all active:scale-[0.98]"
                        >
                          <Instagram className="w-4 h-4 text-[#F5D061]" />
                          <span>{slide.instagramHandle}</span>
                        </a>

                        {/* Direct Phone Numbers */}
                        <div className="flex items-center gap-2 text-xs text-slate-300 px-3 py-2 rounded-full bg-white/5 border border-white/10">
                          <Phone className="w-3.5 h-3.5 text-[#F5D061] shrink-0" />
                          <span>{slide.phones.join(' • ')}</span>
                        </div>

                        {/* Mobile-only View Flyer Button */}
                        <button
                          type="button"
                          onClick={() => setSelectedFlyer(0)}
                          className="lg:hidden px-4 py-2.5 rounded-full bg-white/10 border border-[#D4AF37]/40 text-[#F5D061] text-xs font-bold flex items-center gap-1.5"
                        >
                          <Maximize2 className="w-3.5 h-3.5" />
                          <span>Ver Afiche Oficial</span>
                        </button>
                      </div>
                    </div>

                    {/* Right Column: Executive Showcase Card & Flyer Previews */}
                    <div className="hidden lg:flex lg:col-span-5 flex-col items-center">
                      <div className="relative w-full max-w-sm rounded-[2rem] overflow-hidden border-2 border-[#D4AF37]/50 shadow-2xl bg-[#07211B] group">
                        {/* Main Flyer Display */}
                        <div
                          className="relative aspect-[3/4] overflow-hidden bg-slate-900 cursor-pointer"
                          onClick={() => setSelectedFlyer(activeFlyerIndex)}
                        >
                          <img
                            src={slide.flyers[activeFlyerIndex].src}
                            alt={slide.flyers[activeFlyerIndex].title}
                            className="w-full h-full object-cover object-top transition-transform duration-500 group-hover:scale-105"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-transparent to-black/30 pointer-events-none" />

                          {/* Top Floating Badge */}
                          <div className="absolute top-3 left-3 right-3 flex items-center justify-between pointer-events-none">
                            <span className="px-3 py-1 rounded-full bg-[#0A2E27]/90 backdrop-blur-md border border-[#D4AF37]/50 text-[10px] font-extrabold uppercase text-[#F5D061] tracking-wider flex items-center gap-1">
                              <MapPin className="w-3 h-3 text-[#F5D061]" />
                              Hotel La Pedregosa
                            </span>
                            <span className="p-1.5 rounded-full bg-black/60 backdrop-blur-md text-white/90">
                              <Maximize2 className="w-3.5 h-3.5" />
                            </span>
                          </div>

                          {/* Bottom Floating Banner */}
                          <div className="absolute bottom-3 inset-x-3 p-2.5 rounded-xl bg-black/75 backdrop-blur-md border border-white/10 text-center">
                            <p className="text-[11px] font-bold text-[#F5D061] tracking-wide">
                              {slide.flyers[activeFlyerIndex].title}
                            </p>
                            <p className="text-[10px] text-slate-300">
                              4 • 5 • 6 de Diciembre 2026 • Mérida
                            </p>
                          </div>
                        </div>

                        {/* Interactive Flyer Selector Tabs */}
                        <div className="p-2.5 bg-[#061B16] border-t border-[#D4AF37]/30 flex items-center justify-between gap-1.5">
                          {slide.flyers.map((fl, idx) => (
                            <button
                              key={idx}
                              type="button"
                              onClick={() => setActiveFlyerIndex(idx)}
                              className={`flex-1 py-1.5 px-2 rounded-lg text-[10px] font-bold transition-all text-center truncate ${
                                activeFlyerIndex === idx
                                  ? 'bg-[#D4AF37] text-[#07211B] shadow-xs'
                                  : 'bg-white/5 text-slate-300 hover:bg-white/10 hover:text-white'
                              }`}
                            >
                              {idx === 0 ? 'Afiche' : idx === 1 ? 'Concepto' : 'Speakers'}
                            </button>
                          ))}
                          <button
                            type="button"
                            onClick={() => setSelectedFlyer(activeFlyerIndex)}
                            className="p-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-[#F5D061] transition-colors"
                            title="Ampliar afiche"
                          >
                            <Maximize2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>

                      {/* Small Caption */}
                      <p className="mt-2 text-[11px] text-slate-400 text-center flex items-center gap-1">
                        <span>Haz clic sobre el afiche para ampliar en alta resolución</span>
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            );
          }

          /* ================================================================
             LAYOUT 3 (NOCHE DE LOS ATOLES): Split Editorial + Marco Fotográfico Nítido
             ================================================================ */
          return (
            <div
              key={slide.id}
              className="w-full shrink-0 relative min-h-[66vh] sm:min-h-[70vh] flex items-center pt-24 pb-14 sm:pt-28 sm:pb-14 bg-[#FAF7F2] overflow-hidden"
            >
              {/* Subtle warm radial glow */}
              <div className="absolute top-0 right-0 w-[520px] h-[520px] bg-[#F2E6D8]/70 rounded-full blur-3xl -translate-y-1/4 translate-x-1/4 pointer-events-none" />

              <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
                <div className="grid grid-cols-1 lg:grid-cols-12 items-center gap-8 lg:gap-10">
                  
                  {/* Left Editorial Typography */}
                  <div className="lg:col-span-6 space-y-4 text-left">
                    <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#FAF3EB] border border-[#EAE3D5] text-[10px] font-bold uppercase tracking-[0.18em] text-[#C85A32]">
                      {slide.eyebrow}
                    </span>

                    <h1 className="font-playfair text-4xl sm:text-5xl font-bold text-[#1E1C1A] leading-[1.08] tracking-tight">
                      {slide.titlePrefix}{' '}
                      <span className="italic font-normal text-[#C85A32]">
                        {slide.titleItalic}
                      </span>
                      <br />
                      {slide.titleSuffix}
                    </h1>

                    <p className="text-sm text-[#4F4842] leading-relaxed max-w-lg font-sans">
                      {slide.description}
                    </p>

                    <div className="flex flex-wrap items-center gap-3 pt-1">
                      <button
                        type="button"
                        onClick={() => setActiveTab && setActiveTab(slide.primaryCta.target)}
                        className="px-6 py-3 rounded-full bg-[#C85A32] hover:bg-[#B04B26] text-white font-sans font-bold text-xs sm:text-sm flex items-center gap-2 shadow-sm transition-all active:scale-[0.98]"
                      >
                        <span>{slide.primaryCta.label}</span>
                        <PrimaryIcon className="w-4 h-4" />
                      </button>

                      <button
                        type="button"
                        onClick={() => setActiveTab && setActiveTab(slide.secondaryCta.target)}
                        className="px-6 py-3 rounded-full bg-white hover:bg-[#FAF3EB] text-[#1E1C1A] border border-[#DED5C5] font-sans font-semibold text-xs sm:text-sm flex items-center gap-2 shadow-2xs transition-all active:scale-[0.98]"
                      >
                        <SecondaryIcon className="w-4 h-4 text-[#C85A32]" />
                        <span>{slide.secondaryCta.label}</span>
                      </button>
                    </div>

                    <div className="pt-4 flex flex-wrap items-center gap-5 sm:gap-7">
                      {slide.metrics.map((metric, mIdx) => (
                        <React.Fragment key={metric.label}>
                          {mIdx > 0 && <div className="h-8 w-px bg-[#DED5C5]" />}
                          <div>
                            <span className="block font-playfair text-2xl font-bold text-[#1E1C1A]">
                              {metric.value}
                            </span>
                            <span className="block text-[11px] text-[#6E655D] font-medium mt-0.5">
                              {metric.label}
                            </span>
                          </div>
                        </React.Fragment>
                      ))}
                    </div>
                  </div>

                  {/* Right: Framed Crisp Festival Photo */}
                  <div className="lg:col-span-6 relative">
                    <div className="relative rounded-[2.25rem] overflow-hidden shadow-2xl border-[6px] border-white bg-white aspect-[16/10]">
                      <img
                        src={slide.image}
                        alt={slide.imageAlt}
                        className="w-full h-full object-cover object-center filter saturate-[1.08]"
                      />
                    </div>
                    {slide.handwrittenNote && (
                      <div className="hidden sm:block absolute -bottom-4 right-5 bg-white/95 px-4 py-1.5 rounded-2xl border border-[#EAE3D5] shadow-md -rotate-2">
                        <span className="font-handwritten text-xl text-[#4F4842]">
                          {slide.handwrittenNote}
                        </span>
                      </div>
                    )}
                  </div>

                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Bottom Slider Indicators & Arrows (Visible cleanly inside initial viewport) */}
      <div className="absolute bottom-3.5 left-0 right-0 z-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between pointer-events-none">
        <div className="flex items-center gap-2 bg-white/95 backdrop-blur-sm px-3 py-1.5 rounded-full border border-[#EAE3D5] shadow-sm pointer-events-auto">
          <button
            type="button"
            onClick={handlePrev}
            className="p-1 rounded-full text-[#5C554E] hover:text-[#C85A32] transition-colors"
            aria-label="Hero anterior"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>

          <div className="flex items-center gap-1.5">
            {slides.map((s, idx) => (
              <button
                key={s.id}
                type="button"
                onClick={() => setCurrentIndex(idx)}
                className={`h-2 rounded-full transition-all duration-300 ${
                  idx === currentIndex ? 'w-6 bg-[#C85A32]' : 'w-2 bg-[#DED5C5] hover:bg-[#C85A32]/50'
                }`}
                aria-label={`Ver slide ${idx + 1}`}
              />
            ))}
          </div>

          <button
            type="button"
            onClick={handleNext}
            className="p-1 rounded-full text-[#5C554E] hover:text-[#C85A32] transition-colors"
            aria-label="Siguiente Hero"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Lightbox Modal for Andes Business Flyers */}
      {selectedFlyer !== null && (
        <div
          className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-3 sm:p-5"
          onClick={() => setSelectedFlyer(null)}
        >
          <div
            className="relative max-w-xl w-full max-h-[92vh] bg-[#0A2621] border border-[#D4AF37]/50 rounded-3xl p-4 sm:p-6 shadow-2xl flex flex-col items-center"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              type="button"
              onClick={() => setSelectedFlyer(null)}
              className="absolute top-3.5 right-3.5 p-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors"
              aria-label="Cerrar vista previa"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="text-center mb-3">
              <span className="text-[10px] font-extrabold uppercase tracking-widest text-[#F5D061] px-2.5 py-0.5 rounded-full bg-[#D4AF37]/20 border border-[#D4AF37]/40">
                Andes Business Mérida 2026
              </span>
              <h3 className="font-playfair text-lg sm:text-xl font-bold text-white mt-1">
                Hotel La Pedregosa • 4, 5 y 6 Dic
              </h3>
            </div>

            <div className="w-full flex-1 overflow-auto rounded-2xl border border-white/10 flex justify-center bg-black/50 p-1">
              <img
                src={
                  slides.find((s) => s.id === 'andes-business-hero')?.flyers[selectedFlyer]?.src ||
                  '/images/eventos/andes-business-flyer-main.jpg'
                }
                alt="Afiche oficial Andes Business Mérida 2026"
                className="max-h-[64vh] w-auto object-contain rounded-xl shadow-lg"
              />
            </div>

            {/* Flyer Selector Tabs in Modal */}
            <div className="flex flex-wrap items-center justify-center gap-2 mt-3.5">
              {slides
                .find((s) => s.id === 'andes-business-hero')
                ?.flyers.map((fl, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => setSelectedFlyer(idx)}
                    className={`px-3 py-1.5 rounded-full text-xs font-bold transition-all ${
                      selectedFlyer === idx
                        ? 'bg-[#D4AF37] text-[#07211B] shadow-md'
                        : 'bg-white/10 text-slate-300 hover:bg-white/20 hover:text-white'
                    }`}
                  >
                    {fl.title}
                  </button>
                ))}
            </div>

            <div className="mt-3 flex items-center justify-center gap-3 text-[11px] text-slate-300">
              <a
                href="https://wa.me/584147187233?text=Hola,%20deseo%20más%20información%20y%20disponibilidad%20de%20stands%20para%20Andes%20Business%20Mérida%202026"
                target="_blank"
                rel="noopener noreferrer"
                className="text-[#F5D061] hover:underline font-bold"
              >
                Reservar Stands (+58 414-7187233)
              </a>
              <span>•</span>
              <a
                href="https://www.instagram.com/andesbusinesseventos/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-slate-300 hover:text-white"
              >
                @andesbusinesseventos
              </a>
            </div>
          </div>
        </div>
      )}

    </section>
  );
}
