import React, { useState, useEffect } from 'react';
import { ArrowRight, Sparkles, ChevronLeft, ChevronRight, Calendar, Mountain, GraduationCap, Phone, MapPin, CheckCircle2 } from 'lucide-react';

export function HeroSection({ setActiveTab, restaurantCount = 25 }) {
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

    </section>
  );
}
