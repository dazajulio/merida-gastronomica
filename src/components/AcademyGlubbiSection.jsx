import React, { useState, useEffect } from 'react';
import { 
  GraduationCap, 
  Cpu, 
  Calendar, 
  Sparkles, 
  Building2, 
  QrCode, 
  CreditCard, 
  Truck, 
  TrendingUp, 
  Users, 
  Award, 
  MapPin, 
  ArrowRight, 
  CheckCircle2, 
  Send, 
  X,
  Clock,
  Layers,
  BookOpen,
  CalendarDays,
  Maximize2,
  AlertCircle,
  Tag,
  Info,
  Ticket
} from 'lucide-react';
import { ACADEMY_DATA } from '../data/academyData';
import { fetchLiveCourses, saveCourseEnrollmentToSupabase } from '../lib/eventsCoursesSync';

export function AcademyGlubbiSection({ t, setActiveTab }) {
  const [activeTabSub, setActiveTabSub] = useState('courses'); // courses | alliance | glubbi | expo
  const [expoModalOpen, setExpoModalOpen] = useState(false);
  const [expoSuccess, setExpoSuccess] = useState(false);
  const [glubbiDemoActive, setGlubbiDemoActive] = useState(false);
  const [flyerPreviewCourse, setFlyerPreviewCourse] = useState(null);

  // Official courses from Presidencia (Supabase Cloud + localStorage fallback)
  const [officialCourses, setOfficialCourses] = useState(() => {
    try {
      const saved = localStorage.getItem('cgem_official_courses');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) return parsed;
      }
    } catch (e) {}
    return [];
  });

  useEffect(() => {
    // 1. Cargar desde Supabase Cloud al montar
    fetchLiveCourses().then(live => {
      if (Array.isArray(live) && live.length > 0) {
        setOfficialCourses(live);
      }
    });

    const handleCoursesUpdate = () => {
      try {
        const saved = localStorage.getItem('cgem_official_courses');
        if (saved) {
          const parsed = JSON.parse(saved);
          if (Array.isArray(parsed)) setOfficialCourses(parsed);
        }
      } catch (e) {}
    };

    window.addEventListener('cgem_courses_updated', handleCoursesUpdate);
    window.addEventListener('storage', handleCoursesUpdate);
    return () => {
      window.removeEventListener('cgem_courses_updated', handleCoursesUpdate);
      window.removeEventListener('storage', handleCoursesUpdate);
    };
  }, []);

  // Course Enrollment Modal State
  const [selectedCourseForEnroll, setSelectedCourseForEnroll] = useState(null);
  const [selectedCourseTier, setSelectedCourseTier] = useState(null);
  const [courseEnrollSuccess, setCourseEnrollSuccess] = useState(false);
  const [enrollFullName, setEnrollFullName] = useState('');
  const [enrollEmail, setEnrollEmail] = useState('');
  const [enrollPhone, setEnrollPhone] = useState('');
  const [enrollAffiliateCode, setEnrollAffiliateCode] = useState('');
  const [enrollPaymentRef, setEnrollPaymentRef] = useState('');
  const [enrollPaymentBank, setEnrollPaymentBank] = useState('0108 - Banco Provincial');

  const handleOpenEnrollCourse = (course) => {
    setSelectedCourseForEnroll(course);
    
    // Determine available tiers based on accessType ('free' | 'paid' | 'mixed')
    const currentAccessType = course.accessType || (course.ticketPrice?.toLowerCase().includes('libre') ? 'free' : 'mixed');
    
    let validTiers = [];
    if (Array.isArray(course.priceTiers) && course.priceTiers.length > 0) {
      if (currentAccessType === 'paid') {
        validTiers = course.priceTiers.filter(t => !t.isFree && t.priceUSD > 0);
      } else if (currentAccessType === 'free') {
        validTiers = [{ id: 'tier-free', name: 'Entrada Libre', priceUSD: 0, isFree: true, note: 'Taller 100% gratuito' }];
      } else {
        validTiers = course.priceTiers;
      }
    }

    if (validTiers.length > 0) {
      setSelectedCourseTier(validTiers[0]);
    } else {
      const isFree = currentAccessType === 'free';
      setSelectedCourseTier({
        id: isFree ? 'tier-legacy-free' : 'tier-legacy-mixed',
        name: isFree ? 'Entrada Libre' : 'Miembros Solventes CGM',
        priceUSD: isFree ? 0 : 0,
        isFree: isFree || true,
        note: isFree ? 'Taller 100% gratuito' : 'Acceso gratuito para miembros solventes'
      });
    }

    setEnrollFullName('');
    setEnrollEmail('');
    setEnrollPhone('');
    setEnrollAffiliateCode('');
    setEnrollPaymentRef('');
    setEnrollPaymentBank('0108 - Banco Provincial');
    setCourseEnrollSuccess(false);
  };

  const handleCourseEnrollSubmit = (e) => {
    e.preventDefault();
    setCourseEnrollSuccess(true);

    const isFreeTier = selectedCourseTier ? !!selectedCourseTier.isFree : (selectedCourseForEnroll?.accessType === 'free');
    const tierName = selectedCourseTier ? selectedCourseTier.name : 'Inscripción General';
    const tierPrice = selectedCourseTier ? (selectedCourseTier.isFree ? 0 : selectedCourseTier.priceUSD) : (selectedCourseForEnroll?.priceGeneralUSD || 0);

    // Guardar en Supabase Cloud y respaldo
    saveCourseEnrollmentToSupabase({
      courseId: selectedCourseForEnroll?.id,
      courseTitle: selectedCourseForEnroll?.title,
      tierId: selectedCourseTier?.id || 'tier-general',
      tierName,
      tierPriceUSD: tierPrice,
      isFree: isFreeTier,
      attendeeType: isFreeTier ? 'afiliado' : 'publico',
      fullName: enrollFullName,
      email: enrollEmail,
      phone: enrollPhone,
      affiliateCode: isFreeTier && (tierName.toLowerCase().includes('miembro') || tierName.toLowerCase().includes('afiliado')) ? enrollAffiliateCode : '',
      paymentRef: !isFreeTier ? enrollPaymentRef : '',
      paymentBank: !isFreeTier ? enrollPaymentBank : '',
      status: isFreeTier ? 'confirmado' : 'pendiente_conciliacion'
    });

    setTimeout(() => {
      setCourseEnrollSuccess(false);
      setSelectedCourseForEnroll(null);
      if (isFreeTier) {
        alert(`¡Inscripción Confirmada! Su plaza para el curso "${selectedCourseForEnroll.title}" está garantizada (${tierName}). Te hemos enviado los detalles al correo ${enrollEmail}.`);
      } else {
        alert(`¡Registro en Proceso! Hemos recibido su comprobante de Pago Móvil Provincial (Ref: ${enrollPaymentRef}) para el curso "${selectedCourseForEnroll.title}". En breve recibirá su confirmación formal en ${enrollEmail}.`);
      }
    }, 1200);
  };

  const handleExpoSubmit = (e) => {
    e.preventDefault();
    setExpoSuccess(true);
    setTimeout(() => {
      setExpoSuccess(false);
      setExpoModalOpen(false);
    }, 2500);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      
      {/* Header Hero */}
      <div className="relative rounded-3xl bg-gradient-to-br from-slate-950 via-slate-900 to-sky-950 p-8 sm:p-12 text-white shadow-2xl overflow-hidden mb-12 border border-sky-500/20">
        <div className="absolute -right-20 -bottom-20 w-96 h-96 bg-sky-500/15 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute left-1/3 top-0 w-80 h-80 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 max-w-4xl">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-sky-500/20 border border-sky-400/40 text-sky-300 text-xs font-bold mb-4 backdrop-blur-md">
            <GraduationCap className="w-4 h-4 text-sky-400" />
            <span>ACADEMIA • CAPACITACIONES • TECNOLOGÍA IA • PROYECCIÓN 2027</span>
          </div>

          <h1 className="font-serif text-3xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-white leading-tight">
            Academia Gastronómica & Capacitaciones
          </h1>

          <p className="mt-4 font-serif text-lg sm:text-xl text-amber-300/90 italic">
            "La técnica sin academia no tiene raíz."
          </p>

          <p className="mt-3 text-slate-300 text-sm sm:text-base leading-relaxed max-w-3xl">
            Articulamos la ilustre <strong>Universidad de Los Andes (ULA)</strong> y el <strong>Hotel Escuela</strong> con programas de formación continua y tecnología de analítica predictiva, proyectando nuestra cordillera hacia la <strong>Expo Andes Gastronómico 2027</strong>.
          </p>

          {/* Navigation Sub-Pills */}
          <div className="mt-8 flex flex-wrap items-center gap-3">
            <button
              onClick={() => setActiveTabSub('courses')}
              className={`py-2.5 px-5 rounded-xl font-bold text-xs uppercase tracking-wider flex items-center gap-2 transition-all ${
                activeTabSub === 'courses'
                  ? 'bg-sky-500 text-white shadow-lg'
                  : 'bg-white/10 hover:bg-white/20 text-slate-300 border border-white/15'
              }`}
            >
              <BookOpen className="w-4 h-4" />
              <span>1. Cursos & Capacitaciones ({officialCourses.length})</span>
            </button>

            <button
              onClick={() => setActiveTabSub('alliance')}
              className={`py-2.5 px-5 rounded-xl font-bold text-xs uppercase tracking-wider flex items-center gap-2 transition-all ${
                activeTabSub === 'alliance'
                  ? 'bg-amber-500 text-white shadow-lg'
                  : 'bg-white/10 hover:bg-white/20 text-slate-300 border border-white/15'
              }`}
            >
              <GraduationCap className="w-4 h-4" />
              <span>2. Alianza ULA & Hotel Escuela</span>
            </button>

            <button
              onClick={() => setActiveTabSub('glubbi')}
              className={`py-2.5 px-5 rounded-xl font-bold text-xs uppercase tracking-wider flex items-center gap-2 transition-all ${
                activeTabSub === 'glubbi'
                  ? 'bg-sky-500 text-white shadow-lg'
                  : 'bg-white/10 hover:bg-white/20 text-slate-300 border border-white/15'
              }`}
            >
              <Cpu className="w-4 h-4" />
              <span>3. Tecnología & Analítica IA</span>
            </button>

            <button
              onClick={() => setActiveTabSub('expo')}
              className={`py-2.5 px-5 rounded-xl font-bold text-xs uppercase tracking-wider flex items-center gap-2 transition-all ${
                activeTabSub === 'expo'
                  ? 'bg-emerald-500 text-white shadow-lg'
                  : 'bg-white/10 hover:bg-white/20 text-slate-300 border border-white/15'
              }`}
            >
              <Calendar className="w-4 h-4" />
              <span>4. Expo Andes 2027</span>
            </button>
          </div>

        </div>
      </div>

      {/* SECTION 0: CURSOS & CAPACITACIONES GREMIALES */}
      {activeTabSub === 'courses' && (
        <div className="space-y-8 animate-fadeIn">
          
          <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-10 shadow-lg">
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 mb-8 pb-6 border-b border-slate-100">
              <div className="max-w-3xl">
                <span className="text-xs uppercase font-bold text-sky-800 tracking-wider">Oferta Formativa Oficial</span>
                <h2 className="font-serif text-2xl sm:text-4xl font-bold text-slate-900 mt-1">
                  Cursos, Masterclasses & Capacitaciones Técnicas
                </h2>
                <p className="text-xs sm:text-sm text-slate-600 mt-2 leading-relaxed">
                  Programas especializados en costos gastronómicos, estandarización de recetas, higiene y manipulación de alimentos, barismo de altura y servicio de salón. <strong>Acceso gratuito garantizado para todos los agremiados solventes de la Cámara.</strong>
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-sky-50 border border-sky-200 text-xs text-sky-950 shrink-0 font-sans">
                <span className="font-bold text-sky-900 block uppercase tracking-wider text-[11px]">Beneficio de Agremiación:</span>
                <span className="text-slate-700">Miembros solventes acceden <strong>100% gratis</strong> a todos los talleres.</span>
              </div>
            </div>

            {/* Courses List / Empty State */}
            {officialCourses.length === 0 ? (
              <div className="p-12 text-center rounded-3xl bg-slate-50 border border-slate-200 space-y-4 max-w-xl mx-auto font-sans">
                <div className="w-16 h-16 rounded-3xl bg-sky-100 border border-sky-300 flex items-center justify-center mx-auto text-sky-700 shadow-sm">
                  <BookOpen className="w-8 h-8" />
                </div>
                <h3 className="font-serif font-black text-xl text-slate-900 uppercase">
                  Próximamente Nueva Oferta Académica
                </h3>
                <p className="text-xs text-slate-600 leading-relaxed">
                  La Presidencia y la Dirección de Capacitaciones de la Cámara Gastronómica del Estado Mérida publicarán en los próximos días el cronograma de talleres y masterclasses oficiales.
                </p>
                <div className="pt-1">
                  <span className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-white text-sky-900 border border-sky-300 text-xs font-bold font-mono">
                    ★ En Proceso de Convocatoria Directiva
                  </span>
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 font-sans">
                {officialCourses.map((course) => {
                  const tiers = Array.isArray(course.priceTiers) && course.priceTiers.length > 0 ? course.priceTiers : [];
                  const hasFreeTier = tiers.some(t => t.isFree || t.priceUSD === 0);
                  const hasPaidTier = tiers.some(t => !t.isFree && t.priceUSD > 0);
                  const isAllFree = tiers.length > 0 ? !hasPaidTier : (course.accessType === 'free');
                  const isStrictPaid = tiers.length > 0 ? !hasFreeTier : (course.accessType === 'paid');
                  
                  return (
                    <div 
                      key={course.id}
                      className="bg-white rounded-3xl border border-slate-200 hover:border-sky-400 hover:shadow-card-hover transition-all flex flex-col justify-between overflow-hidden group"
                    >
                      <div>
                        {course.image && (
                          <div className="relative h-56 w-full overflow-hidden bg-slate-900">
                            <img 
                              src={course.image} 
                              alt={course.title} 
                              className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-slate-950/30" />

                            <div className="absolute top-3 left-3 flex flex-wrap gap-1.5 items-center">
                              <span className="px-2.5 py-1 rounded-full text-[10px] font-extrabold uppercase bg-sky-600 text-white shadow-sm">
                                {course.category || 'Capacitación'}
                              </span>
                              {course.badge && (
                                <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-amber-400 text-slate-950 shadow-sm">
                                  {course.badge}
                                </span>
                              )}
                            </div>

                            <div className="absolute top-3 right-3 flex items-center gap-1.5">
                              <button
                                type="button"
                                onClick={() => setFlyerPreviewCourse(course)}
                                className="p-1.5 rounded-full bg-black/60 hover:bg-black/80 text-white backdrop-blur-xs transition-colors shadow-xs"
                                title="Ver afiche completo"
                              >
                                <Maximize2 className="w-3.5 h-3.5" />
                              </button>
                              <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-white/90 text-slate-900 shadow-sm backdrop-blur-xs">
                                {course.hours || '16 Horas'}
                              </span>
                            </div>

                            {/* Access Type Ribbon at Bottom of Image */}
                            <div className="absolute bottom-2.5 left-3 right-3 flex items-center justify-between text-[11px] font-bold text-white">
                              <div className="flex items-center gap-1 text-amber-300 drop-shadow-sm">
                                <CalendarDays className="w-3.5 h-3.5" />
                                <span>{course.dates || 'Fechas 2026'}</span>
                              </div>
                              {isAllFree ? (
                                <span className="px-2 py-0.5 rounded-md bg-emerald-500 text-white text-[10px] font-extrabold uppercase tracking-wide shadow-xs">
                                  🆓 100% Gratuito
                                </span>
                              ) : isStrictPaid ? (
                                <span className="px-2 py-0.5 rounded-md bg-amber-500 text-slate-950 text-[10px] font-extrabold uppercase tracking-wide shadow-xs">
                                  🎟️ Arancel Pago
                                </span>
                              ) : (
                                <span className="px-2 py-0.5 rounded-md bg-sky-500 text-white text-[10px] font-extrabold uppercase tracking-wide shadow-xs">
                                  ⭐ Acceso Mixto
                                </span>
                              )}
                            </div>
                          </div>
                        )}

                        <div className="p-6 space-y-3">
                          <h3 className="font-serif font-bold text-xl text-slate-900 group-hover:text-sky-700 transition-colors leading-snug">
                            {course.title}
                          </h3>

                          <div className="space-y-1.5 text-xs text-slate-600">
                            <div className="flex items-center gap-2">
                              <Users className="w-3.5 h-3.5 text-sky-600 shrink-0" />
                              <span>Instructor: <strong className="text-slate-800">{course.instructor || 'Facilitador CGEM'}</strong></span>
                            </div>
                            <div className="flex items-center gap-2">
                              <Clock className="w-3.5 h-3.5 text-amber-600 shrink-0" />
                              <span>Horario: <strong>{course.schedule || '09:00 AM - 01:00 PM'}</strong></span>
                            </div>
                            <div className="flex items-center gap-2">
                              <MapPin className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                              <span className="truncate">{course.isOnline ? 'Online / Aula Virtual ULA' : course.location}</span>
                            </div>
                          </div>

                          <p className="text-xs text-slate-600 mt-2 line-clamp-3 leading-relaxed">
                            {course.description}
                          </p>

                          {/* Dynamic 100% Consistent Pricing Breakdown */}
                          <div className="pt-3 border-t border-slate-100 space-y-2">
                            <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider block">
                              Aranceles & Tarifas Oficiales:
                            </span>

                            {tiers.length > 0 ? (
                              <div className="space-y-1.5">
                                {tiers.map((t, idx) => (
                                  <div 
                                    key={t.id || idx}
                                    className={`p-2 rounded-xl border flex items-center justify-between text-xs transition-all ${
                                      t.isFree 
                                        ? 'bg-emerald-50/90 border-emerald-200 text-emerald-950' 
                                        : 'bg-slate-50 border-slate-200 text-slate-800'
                                    }`}
                                  >
                                    <div className="pr-2">
                                      <span className="font-bold block text-[11px] leading-tight">{t.name}</span>
                                      {t.note && (
                                        <span className="text-[9.5px] text-slate-500 block leading-tight mt-0.5">{t.note}</span>
                                      )}
                                    </div>
                                    <span className={`px-2.5 py-1 rounded-lg font-mono font-black text-xs shrink-0 shadow-xs ${
                                      t.isFree 
                                        ? 'bg-emerald-600 text-white' 
                                        : 'bg-slate-900 text-amber-400'
                                    }`}>
                                      {t.isFree ? '100% GRATIS' : `$${t.priceUSD} USD`}
                                    </span>
                                  </div>
                                ))}
                              </div>
                            ) : (
                              /* Fallback if no custom tiers array exists */
                              isAllFree ? (
                                <div className="p-2.5 rounded-xl bg-emerald-50 border border-emerald-200 flex items-center justify-between text-xs">
                                  <span className="font-bold text-emerald-900">Entrada Libre / Sin Costo</span>
                                  <span className="font-mono font-extrabold text-emerald-700">100% GRATIS</span>
                                </div>
                              ) : isStrictPaid ? (
                                <div className="p-2.5 rounded-xl bg-amber-50 border border-amber-200 flex items-center justify-between text-xs">
                                  <span className="font-bold text-amber-950">Matrícula General</span>
                                  <span className="px-2.5 py-1 rounded-lg bg-amber-400 text-slate-950 font-black font-mono text-xs">
                                    ${course.priceGeneralUSD || 35} USD
                                  </span>
                                </div>
                              ) : (
                                <div className="p-2.5 rounded-xl bg-sky-50 border border-sky-200 space-y-1 text-xs">
                                  <div className="flex items-center justify-between">
                                    <span className="text-[10px] font-bold text-emerald-700">Miembros Solventes CGM:</span>
                                    <span className="font-black text-emerald-800 font-mono text-[11px]">100% GRATIS</span>
                                  </div>
                                  <div className="flex items-center justify-between pt-0.5 border-t border-sky-200/60">
                                    <span className="text-[10px] font-bold text-slate-600">Público General:</span>
                                    <span className="font-black text-slate-900 font-mono text-[11px]">
                                      ${course.priceGeneralUSD || 35} USD
                                    </span>
                                  </div>
                                </div>
                              )
                            )}
                          </div>
                        </div>
                      </div>

                      <div className="p-4 bg-slate-50 border-t border-slate-100 flex items-center justify-between gap-3">
                        <span className="text-[10px] text-slate-500 font-medium">
                          Cupo: {course.spots || 25} plazas
                        </span>

                        <button
                          onClick={() => handleOpenEnrollCourse(course)}
                          className="py-2.5 px-5 rounded-xl bg-sky-600 hover:bg-sky-700 text-white font-serif font-black text-xs uppercase tracking-wider flex items-center gap-1.5 shadow-sm transition-all active:scale-95"
                        >
                          <BookOpen className="w-3.5 h-3.5" />
                          <span>Inscribirse</span>
                        </button>
                      </div>

                    </div>
                  );
                })}
              </div>
            )}

          </div>

        </div>
      )}

      {/* SECTION 1: ACADEMIC ALLIANCE */}
      {activeTabSub === 'alliance' && (
        <div className="space-y-10 animate-fadeIn">
          
          <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-10 shadow-lg">
            <div className="max-w-3xl mb-8">
              <span className="text-xs uppercase font-bold text-amber-800 tracking-wider">Formación Universitaria & Fogones Reales</span>
              <h2 className="font-serif text-2xl sm:text-4xl font-bold text-slate-900 mt-1">
                Alianza Estratégica con la Universidad de Los Andes (ULA)
              </h2>
              <p className="text-xs sm:text-sm text-slate-600 mt-3 leading-relaxed">
                En alianza estratégica con nuestra ilustre Universidad de Los Andes y su Departamento de Gestión Gastronómica, articulamos la teoría con la práctica en fogones reales, impulsando con determinación la consolidación de la <strong>Licenciatura en Gastronomía</strong>. Un esfuerzo que se enlaza de inmediato con el Hotel Escuela y los centros de formación en Tovar, La Playa y El Vigía.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {ACADEMY_DATA.alliance.pillars.map((pil, idx) => (
                <div key={idx} className="p-6 rounded-2xl bg-slate-50 border border-slate-200 flex flex-col justify-between hover:border-amber-400 hover:bg-white transition-all shadow-sm">
                  <div>
                    <div className="w-12 h-12 rounded-xl bg-amber-100 text-amber-800 flex items-center justify-center mb-4">
                      <GraduationCap className="w-6 h-6" />
                    </div>
                    <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 inline-block mb-2">
                      {pil.status}
                    </span>
                    <h3 className="font-serif text-lg font-bold text-slate-900">{pil.title}</h3>
                    <p className="text-xs text-slate-600 mt-2 leading-relaxed">{pil.desc}</p>
                  </div>
                  <div className="mt-4 pt-3 border-t border-slate-200/60 text-xs font-bold text-amber-800">
                    {pil.scope}
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-8 p-6 rounded-2xl bg-amber-50/70 border border-amber-200 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div>
                <h4 className="font-serif font-bold text-amber-950 text-base">¿Estudiante o profesional egresado?</h4>
                <p className="text-xs text-slate-700 mt-0.5">Vincúlese a las pasantías certificadas en los restaurantes agremiados de la Cámara.</p>
              </div>
              <button
                onClick={() => setActiveTab && setActiveTab('jobs')}
                className="py-2.5 px-5 rounded-xl bg-amber-500 hover:bg-amber-600 text-slate-950 font-serif font-bold text-xs uppercase tracking-wider flex items-center gap-2 shadow-sm transition-all whitespace-nowrap"
              >
                <span>Bolsa de Empleo & Pasantías</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>

        </div>
      )}

      {/* SECTION 2: GLUBBI AI TECHNOLOGY */}
      {activeTabSub === 'glubbi' && (
        <div className="space-y-10 animate-fadeIn">
          
          <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-10 shadow-lg">
            <div className="max-w-3xl mb-8">
              <span className="text-xs uppercase font-bold text-sky-800 tracking-wider">Inteligencia Artificial Gastronómica</span>
              <h2 className="font-serif text-2xl sm:text-4xl font-bold text-slate-900 mt-1">
                Tecnología & Analítica Predictiva Glubbi
              </h2>
              <p className="text-xs sm:text-sm text-slate-600 mt-3 leading-relaxed">
                {ACADEMY_DATA.glubbiTech.desc}
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {ACADEMY_DATA.glubbiTech.features.map((feat, idx) => (
                <div key={idx} className="p-6 rounded-2xl bg-slate-50 border border-slate-200 hover:border-sky-400 hover:bg-white transition-all shadow-sm flex flex-col justify-between">
                  <div>
                    <div className="w-12 h-12 rounded-xl bg-sky-100 text-sky-700 flex items-center justify-center mb-4">
                      {idx === 0 && <QrCode className="w-6 h-6" />}
                      {idx === 1 && <CreditCard className="w-6 h-6" />}
                      {idx === 2 && <Truck className="w-6 h-6" />}
                      {idx === 3 && <TrendingUp className="w-6 h-6" />}
                    </div>
                    <h3 className="font-serif text-base font-bold text-slate-900">{feat.title}</h3>
                    <p className="text-xs text-slate-600 mt-2 leading-relaxed">{feat.desc}</p>
                  </div>
                  <div className="mt-4 pt-3 border-t border-slate-200 text-xs font-bold text-sky-700 flex items-center gap-1">
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>{feat.benefit}</span>
                  </div>
                </div>
              ))}
            </div>

            {/* Glubbi Interactive Simulator Demo */}
            <div className="mt-8 p-6 sm:p-8 rounded-3xl bg-slate-950 text-white border border-slate-800 shadow-xl">
              <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6 pb-6 border-b border-slate-800">
                <div>
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-sky-500/20 text-sky-300 text-xs font-bold mb-2">
                    <Cpu className="w-3.5 h-3.5" />
                    <span>Módulo de Control Glubbi AI</span>
                  </div>
                  <h3 className="font-serif text-xl sm:text-2xl font-bold">Simulador de Optimización de Cocina Andina</h3>
                  <p className="text-xs text-slate-400 mt-1 max-w-xl">
                    Pruebe el algoritmo en tiempo real para calcular demanda de trucha deshuesada, hortalizas de Mucuchíes y café de altura según afluencia turística estimada.
                  </p>
                </div>

                <button
                  onClick={() => setGlubbiDemoActive(!glubbiDemoActive)}
                  className="py-3 px-6 rounded-xl bg-gradient-to-r from-sky-500 to-indigo-600 text-white font-serif font-bold text-xs uppercase tracking-wider shadow-lg hover:brightness-110 transition-all whitespace-nowrap"
                >
                  {glubbiDemoActive ? 'Reiniciar Algoritmo' : 'Ejecutar Diagnóstico Predictivo'}
                </button>
              </div>

              {glubbiDemoActive && (
                <div className="mt-6 grid grid-cols-1 sm:grid-cols-3 gap-4 animate-fadeIn font-sans">
                  <div className="p-4 rounded-2xl bg-white/5 border border-white/10">
                    <span className="text-[10px] uppercase font-bold text-slate-400">Eficiencia en Mermas</span>
                    <span className="font-serif font-bold text-2xl text-emerald-400 block mt-1">-34.8%</span>
                    <span className="text-[11px] text-slate-300">Ahorro proyectado mensual</span>
                  </div>
                  <div className="p-4 rounded-2xl bg-white/5 border border-white/10">
                    <span className="text-[10px] uppercase font-bold text-slate-400">Rotación de Mesas (QR)</span>
                    <span className="font-serif font-bold text-2xl text-sky-400 block mt-1">+22 min</span>
                    <span className="text-[11px] text-slate-300">Agilidad en servicio y comanda</span>
                  </div>
                  <div className="p-4 rounded-2xl bg-white/5 border border-white/10">
                    <span className="text-[10px] uppercase font-bold text-slate-400">Integración de Pagos</span>
                    <span className="font-serif font-bold text-2xl text-amber-400 block mt-1">Multi-Divisa</span>
                    <span className="text-[11px] text-slate-300">Pago Móvil, Zelle & Tarjeta</span>
                  </div>
                </div>
              )}
            </div>

          </div>

        </div>
      )}

      {/* SECTION 3: EXPO ANDES 2027 */}
      {activeTabSub === 'expo' && (
        <div className="space-y-10 animate-fadeIn">
          
          <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-10 shadow-lg">
            <div className="max-w-3xl mb-8">
              <span className="text-xs uppercase font-bold text-emerald-800 tracking-wider">Proyección Internacional</span>
              <h2 className="font-serif text-2xl sm:text-4xl font-bold text-slate-900 mt-1">
                {ACADEMY_DATA.expo2027.title}
              </h2>
              <p className="text-xs sm:text-sm text-slate-600 mt-3 leading-relaxed">
                {ACADEMY_DATA.expo2027.desc}
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              {ACADEMY_DATA.expo2027.tracks.map((track, idx) => (
                <div key={idx} className="p-6 rounded-2xl bg-slate-50 border border-slate-200 hover:border-emerald-400 transition-all">
                  <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center mb-3">
                    <Award className="w-5 h-5" />
                  </div>
                  <h3 className="font-serif font-bold text-base text-slate-900">{track.name}</h3>
                  <p className="text-xs text-slate-600 leading-relaxed mt-2">
                    {track.desc}
                  </p>
                </div>
              ))}
            </div>

            <div className="pt-6 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-2 text-xs text-slate-600">
                <MapPin className="w-4 h-4 text-emerald-600" />
                <span>{ACADEMY_DATA.expo2027.location}</span>
              </div>

              <button
                onClick={() => setExpoModalOpen(true)}
                className="py-3 px-6 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs uppercase tracking-wider flex items-center gap-2 shadow-md transition-all"
              >
                <Calendar className="w-4 h-4" />
                <span>Pre-Registro & Patrocinios Expo 2027</span>
              </button>
            </div>

          </div>

        </div>
      )}

      {/* Modal: Course Enrollment Modal */}
      {selectedCourseForEnroll && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-fadeIn font-sans">
          <div className="relative w-full max-w-lg bg-white rounded-3xl border border-slate-200 shadow-2xl p-6 sm:p-8 space-y-5 text-slate-800 max-h-[90vh] overflow-y-auto">
            
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <div className="flex items-center gap-2 text-sky-700">
                <GraduationCap className="w-5 h-5 text-sky-600" />
                <h3 className="font-serif text-lg font-bold text-slate-900">Inscripción Oficial a Capacitación</h3>
              </div>
              <button 
                onClick={() => setSelectedCourseForEnroll(null)}
                className="p-1.5 rounded-full hover:bg-slate-100 text-slate-500 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Course Summary Header */}
            <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-1">
              <div className="flex items-center gap-2">
                <span className="px-2 py-0.5 rounded-full text-[9px] font-extrabold uppercase bg-sky-600 text-white">
                  {selectedCourseForEnroll.category || 'Capacitación'}
                </span>
                {selectedCourseForEnroll.badge && (
                  <span className="px-2 py-0.5 rounded-full text-[9px] font-bold bg-amber-400 text-slate-950">
                    {selectedCourseForEnroll.badge}
                  </span>
                )}
              </div>
              <h4 className="font-serif text-lg font-bold text-slate-900 leading-snug">
                {selectedCourseForEnroll.title}
              </h4>
              <p className="text-xs text-sky-800 font-semibold flex items-center gap-1.5 pt-0.5">
                <CalendarDays className="w-3.5 h-3.5 text-amber-600" />
                <span>{selectedCourseForEnroll.dates} &bull; {selectedCourseForEnroll.hours} ({selectedCourseForEnroll.schedule})</span>
              </p>
            </div>

            {/* Price Tier Selection Selector */}
            {(() => {
              const currentAccessType = selectedCourseForEnroll.accessType || (selectedCourseForEnroll.ticketPrice?.toLowerCase().includes('libre') ? 'free' : 'mixed');
              let availableTiers = [];

              if (Array.isArray(selectedCourseForEnroll.priceTiers) && selectedCourseForEnroll.priceTiers.length > 0) {
                if (currentAccessType === 'paid') {
                  availableTiers = selectedCourseForEnroll.priceTiers.filter(t => !t.isFree && t.priceUSD > 0);
                } else if (currentAccessType === 'free') {
                  availableTiers = [{ id: 'tier-free', name: 'Entrada Libre', priceUSD: 0, isFree: true, note: 'Taller 100% gratuito para todos' }];
                } else {
                  availableTiers = selectedCourseForEnroll.priceTiers;
                }
              }

              if (availableTiers.length === 0) {
                const isFree = currentAccessType === 'free';
                availableTiers = [
                  {
                    id: isFree ? 'tier-free' : 'tier-cgm-free',
                    name: isFree ? 'Entrada Libre' : 'Miembros Solventes CGM',
                    priceUSD: 0,
                    isFree: true,
                    note: isFree ? 'Taller 100% gratuito' : 'Acceso Gremial Gratuito (Requiere Código CGM)'
                  },
                  {
                    id: 'tier-gen',
                    name: 'Público General',
                    priceUSD: selectedCourseForEnroll.priceGeneralUSD || 35,
                    isFree: false,
                    note: 'Inscripción y Certificado General'
                  }
                ];
              }

              return (
                <div>
                  <label className="block text-slate-700 font-bold mb-1.5 uppercase text-[10px] tracking-wider">
                    Seleccione su Categoría / Tarifa de Matrícula *
                  </label>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {availableTiers.map((tier) => {
                      const isSelected = selectedCourseTier?.id === tier.id || (selectedCourseTier?.name === tier.name && selectedCourseTier?.isFree === tier.isFree);
                      return (
                        <button
                          key={tier.id}
                          type="button"
                          onClick={() => setSelectedCourseTier(tier)}
                          className={`p-3 rounded-2xl border text-left transition-all flex flex-col justify-between gap-1.5 ${
                            isSelected
                              ? (tier.isFree 
                                  ? 'bg-emerald-50 border-emerald-500 ring-2 ring-emerald-400/40' 
                                  : 'bg-sky-50 border-sky-500 ring-2 ring-sky-400/40')
                              : 'bg-white border-slate-200 hover:border-slate-300'
                          }`}
                        >
                          <div className="flex items-center justify-between gap-1">
                            <span className="font-bold text-xs text-slate-900 leading-snug">
                              {tier.name}
                            </span>
                            <span className={`px-2 py-0.5 rounded-full text-[10px] font-extrabold shrink-0 ${
                              tier.isFree 
                                ? 'bg-emerald-600 text-white' 
                                : 'bg-sky-600 text-white'
                            }`}>
                              {tier.isFree ? 'GRATIS' : `$${tier.priceUSD} USD`}
                            </span>
                          </div>
                          {tier.note && (
                            <p className="text-[11px] text-slate-500 line-clamp-1">
                              {tier.note}
                            </p>
                          )}
                        </button>
                      );
                    })}
                  </div>
                </div>
              );
            })()}

            <form onSubmit={handleCourseEnrollSubmit} className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-700 font-bold mb-1">Nombre Completo *</label>
                <input 
                  type="text" 
                  required 
                  value={enrollFullName}
                  onChange={(e) => setEnrollFullName(e.target.value)}
                  placeholder="Ej. Chef Manuel Márquez / Lic. María Gómez" 
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-slate-800 focus:outline-none focus:border-sky-500 focus:bg-white font-medium"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                <div>
                  <label className="block text-slate-700 font-bold mb-1">Correo Electrónico *</label>
                  <input 
                    type="email" 
                    required 
                    value={enrollEmail}
                    onChange={(e) => setEnrollEmail(e.target.value)}
                    placeholder="correo@ejemplo.com" 
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-slate-800 focus:outline-none focus:border-sky-500 focus:bg-white"
                  />
                </div>
                <div>
                  <label className="block text-slate-700 font-bold mb-1">WhatsApp / Teléfono *</label>
                  <input 
                    type="tel" 
                    required 
                    value={enrollPhone}
                    onChange={(e) => setEnrollPhone(e.target.value)}
                    placeholder="+58 414 0000000" 
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-slate-800 focus:outline-none focus:border-sky-500 focus:bg-white"
                  />
                </div>
              </div>

              {/* Free Tier Confirmation or Member Code */}
              {selectedCourseTier?.isFree ? (
                <div className="p-3.5 rounded-2xl bg-emerald-50 border border-emerald-200 space-y-2">
                  <div className="flex items-center gap-2 text-emerald-900 font-bold">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>Tarifa Gratuita Seleccionada: {selectedCourseTier.name}</span>
                  </div>
                  {selectedCourseTier.name.toLowerCase().includes('miembro') || selectedCourseTier.name.toLowerCase().includes('afiliado') ? (
                    <div>
                      <label className="block text-emerald-950 font-bold mb-1">Código de Afiliado CGM *</label>
                      <input 
                        type="text" 
                        required
                        value={enrollAffiliateCode}
                        onChange={(e) => setEnrollAffiliateCode(e.target.value)}
                        placeholder="Ej. CGM-2026-001" 
                        className="w-full bg-white border border-emerald-300 rounded-xl px-3 py-2 text-slate-800 uppercase font-mono font-bold focus:outline-none focus:ring-2 focus:ring-emerald-500"
                      />
                    </div>
                  ) : (
                    <p className="text-[11px] text-emerald-800">
                      Su plaza ha sido asignada sin costo. Recibirá su confirmación y material digital en su correo.
                    </p>
                  )}
                </div>
              ) : (
                /* Paid Tier Details & Pago Móvil Banco Provincial */
                <div className="p-4 rounded-2xl bg-sky-50 border border-sky-300 space-y-3">
                  <div className="flex items-center justify-between gap-2 text-sky-950 font-bold">
                    <div className="flex items-center gap-2">
                      <CreditCard className="w-4 h-4 text-sky-600" />
                      <span>Pago Móvil Oficial Banco Provincial</span>
                    </div>
                    <span className="text-xs bg-sky-600 text-white px-2.5 py-0.5 rounded-md font-extrabold font-mono">
                      ${selectedCourseTier?.priceUSD || selectedCourseForEnroll.priceGeneralUSD || 35} USD
                    </span>
                  </div>

                  <div className="text-[11px] text-slate-800 space-y-1 bg-white p-3 rounded-xl border border-sky-200 font-mono">
                    <div className="flex justify-between">
                      <span className="text-slate-500">Banco:</span>
                      <strong>0108 - Banco Provincial</strong>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-500">Cédula / RIF:</span>
                      <strong>V-12517086</strong>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-500">Teléfono:</span>
                      <strong>0414-8817137</strong>
                    </div>
                    <div className="flex justify-between text-sky-900 font-sans font-bold pt-1 border-t border-slate-100">
                      <span>Matrícula a Transferir:</span>
                      <span>{selectedCourseTier?.name || 'General'} (${selectedCourseTier?.priceUSD || 35} USD a tasa BCV)</span>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="block text-slate-700 font-bold mb-1 text-[11px]">Banco Emisor *</label>
                      <input 
                        type="text" 
                        required
                        value={enrollPaymentBank}
                        onChange={(e) => setEnrollPaymentBank(e.target.value)}
                        placeholder="Ej. Provincial, Banesco, Mercantil..." 
                        className="w-full bg-white border border-sky-300 rounded-xl px-2.5 py-2 text-slate-800 text-xs focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-slate-700 font-bold mb-1 text-[11px]">Nro. de Referencia *</label>
                      <input 
                        type="text" 
                        required
                        value={enrollPaymentRef}
                        onChange={(e) => setEnrollPaymentRef(e.target.value)}
                        placeholder="Ej. 12345678" 
                        className="w-full bg-white border border-sky-300 rounded-xl px-2.5 py-2 text-slate-800 text-xs font-mono font-bold focus:outline-none"
                      />
                    </div>
                  </div>
                </div>
              )}

              <button
                type="submit"
                disabled={courseEnrollSuccess}
                className="w-full py-3.5 rounded-xl bg-sky-600 hover:bg-sky-700 text-white font-serif font-black text-xs uppercase tracking-wider transition-all mt-4 shadow-md active:scale-98 disabled:opacity-50"
              >
                {courseEnrollSuccess ? 'Procesando Inscripción...' : `Confirmar Inscripción (${selectedCourseTier?.name || 'Matrícula'} ${selectedCourseTier?.isFree ? '• Gratis' : `• $${selectedCourseTier?.priceUSD || 35} USD`})`}
              </button>
            </form>

          </div>
        </div>
      )}

      {/* Modal: Full Flyer Preview for Course */}
      {flyerPreviewCourse && (
        <div 
          className="fixed inset-0 z-50 bg-slate-950/90 backdrop-blur-md flex items-center justify-center p-4 animate-fadeIn"
          onClick={() => setFlyerPreviewCourse(null)}
        >
          <div 
            className="relative max-w-md w-full max-h-[92vh] flex flex-col items-center"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setFlyerPreviewCourse(null)}
              className="absolute -top-12 right-0 p-2 rounded-full bg-white/20 hover:bg-white/40 text-white transition-colors"
            >
              <X className="w-6 h-6" />
            </button>

            <div className="relative rounded-3xl overflow-hidden shadow-2xl border border-white/20 bg-slate-900 max-h-[85vh]">
              <img 
                src={flyerPreviewCourse.image} 
                alt={flyerPreviewCourse.title} 
                className="w-full h-auto max-h-[80vh] object-contain"
              />
              <div className="p-4 bg-slate-950/95 text-white flex items-center justify-between gap-3 border-t border-slate-800">
                <div>
                  <h4 className="font-serif font-bold text-sm line-clamp-1">{flyerPreviewCourse.title}</h4>
                  <p className="text-xs text-amber-300">{flyerPreviewCourse.dates} &bull; {flyerPreviewCourse.hours}</p>
                </div>
                <button
                  onClick={() => {
                    const c = flyerPreviewCourse;
                    setFlyerPreviewCourse(null);
                    handleOpenEnrollCourse(c);
                  }}
                  className="py-2 px-4 rounded-xl bg-sky-600 hover:bg-sky-700 text-white font-serif font-bold text-xs uppercase tracking-wider shrink-0"
                >
                  Inscribirse
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal: Expo 2027 Pre-Registration */}
      {expoModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto animate-fadeIn font-sans">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl relative my-8">
            <button
              onClick={() => setExpoModalOpen(false)}
              className="absolute top-5 right-5 p-2 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-600 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            {expoSuccess ? (
              <div className="text-center py-8 space-y-3">
                <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 mx-auto flex items-center justify-center">
                  <CheckCircle2 className="w-10 h-10" />
                </div>
                <h3 className="font-serif text-2xl font-bold text-slate-900">¡Pre-Registro Confirmado!</h3>
                <p className="text-xs text-slate-600 max-w-sm mx-auto">
                  Hemos reservado su solicitud informativa para la <strong>Expo Andes Gastronómico 2027</strong>. Recibirá el dossier comercial de stands, bases del concurso culinario y acreditaciones de prensa.
                </p>
              </div>
            ) : (
              <form onSubmit={handleExpoSubmit} className="space-y-4">
                <div>
                  <span className="text-xs uppercase font-bold text-emerald-800">Comité Organizador</span>
                  <h3 className="font-serif text-xl font-bold text-slate-900">Expo Andes Gastronómico 2027</h3>
                  <p className="text-xs text-slate-500">Pre-registro para expositores, conferencistas y concursantes</p>
                </div>

                <div className="space-y-3 pt-2">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Nombre / Empresa *</label>
                    <input
                      type="text"
                      required
                      placeholder="Ej. Distribuidora Culinaria Andina / Chef Carlos Gómez"
                      className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-xs font-medium focus:outline-none focus:border-emerald-500"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">Tipo de Participación</label>
                      <select className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-xs font-medium focus:outline-none focus:border-emerald-500 text-slate-700">
                        <option>Stand Comercial / Proveedor</option>
                        <option>Participante Copa Culinaria</option>
                        <option>Asistente al Congreso</option>
                        <option>Rueda de Negocios B2B</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">Teléfono / WhatsApp *</label>
                      <input
                        type="tel"
                        required
                        placeholder="+58 412 9876543"
                        className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-xs font-medium focus:outline-none focus:border-emerald-500"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Correo Electrónico *</label>
                    <input
                      type="email"
                      required
                      placeholder="contacto@empresa.com"
                      className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-xs font-medium focus:outline-none focus:border-emerald-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Comentarios o Requerimientos de Espacio</label>
                    <textarea
                      rows="3"
                      placeholder="Indique metros cuadrados requeridos para stand o categoría de concurso culinario..."
                      className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-xs font-medium focus:outline-none focus:border-emerald-500"
                    />
                  </div>
                </div>

                <div className="pt-4 border-t border-slate-100 flex items-center justify-end gap-3">
                  <button
                    type="button"
                    onClick={() => setExpoModalOpen(false)}
                    className="py-2.5 px-4 rounded-xl border border-slate-300 text-slate-700 font-bold text-xs"
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    className="py-2.5 px-6 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs uppercase tracking-wider flex items-center gap-2 shadow-md"
                  >
                    <Send className="w-4 h-4" />
                    <span>Enviar Pre-Registro</span>
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}

    </div>
  );
}
