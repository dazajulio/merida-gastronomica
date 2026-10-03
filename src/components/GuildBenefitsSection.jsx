import React, { useState } from 'react';
import { GUILD_BENEFITS_DATA } from '../data/guildBenefitsData';
import { BOARD_MEMBERS_DATA } from '../data/boardData';
import { 
  ShieldCheck, 
  Globe, 
  Users, 
  Briefcase, 
  Sparkles, 
  Scale, 
  Smartphone, 
  Compass, 
  Award, 
  GraduationCap, 
  CheckCircle2, 
  ArrowRight,
  ChevronDown,
  Building2,
  Lock,
  Play,
  Instagram,
  UserCheck,
  ExternalLink
} from 'lucide-react';

const ICONS_MAP = {
  Globe,
  Users,
  Briefcase,
  Sparkles,
  Scale,
  Smartphone,
  Compass,
  Award,
  GraduationCap,
  ShieldCheck
};

export function GuildBenefitsSection({ setActiveTab, initialView = 'all' }) {
  const [mainView, setMainView] = useState(initialView);
  const [expandedBenefit, setExpandedBenefit] = useState(null);
  const [filterCategory, setFilterCategory] = useState('all');

  React.useEffect(() => {
    if (initialView) {
      setMainView(initialView);
    }
  }, [initialView]);

  const categories = [
    { id: 'all', label: 'Los 10 Beneficios Oficiales' },
    { id: 'visibilidad', label: 'Visibilidad & Ventas' },
    { id: 'respaldo', label: 'Blindaje & Gremio' },
    { id: 'formacion', label: 'Formación & Talento' }
  ];

  const filteredBenefits = GUILD_BENEFITS_DATA.benefitsList.filter(b => {
    if (filterCategory === 'all') return true;
    if (filterCategory === 'visibilidad') return [1, 4, 6, 7].includes(b.id);
    if (filterCategory === 'respaldo') return [2, 5, 8].includes(b.id);
    if (filterCategory === 'formacion') return [3, 9, 10].includes(b.id);
    return true;
  });

  const toggleExpand = (id) => {
    setExpandedBenefit(expandedBenefit === id ? null : id);
  };

  const handleGoToAffiliate = () => {
    setActiveTab('affiliates');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="space-y-12 pb-12 animate-fadeIn">
      
      {/* Hero Header */}
      <section className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-slate-950 via-slate-900 to-amber-950 text-white p-8 sm:p-14 shadow-2xl border border-amber-500/30">
        <div className="absolute -right-20 -top-20 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl pointer-events-none"></div>
        
        <div className="relative z-10 max-w-3xl">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30 text-xs font-bold mb-4">
            <ShieldCheck className="w-4 h-4 text-amber-400" />
            <span>{GUILD_BENEFITS_DATA.hero.badge}</span>
          </div>

          <h1 className="font-serif text-3xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-white leading-tight mb-4">
            {GUILD_BENEFITS_DATA.hero.title}
          </h1>

          <p className="text-sm sm:text-base text-slate-300 leading-relaxed mb-8 font-light max-w-2xl">
            {GUILD_BENEFITS_DATA.hero.subtitle}
          </p>

          {/* Quick Affiliation Action */}
          <div className="flex flex-wrap items-center gap-4 pt-2">
            <button
              onClick={handleGoToAffiliate}
              className="px-6 py-3.5 rounded-2xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-slate-950 font-serif font-bold text-xs uppercase tracking-wider shadow-lg shadow-amber-500/30 transition-all flex items-center gap-2"
            >
              <span>Solicitar Afiliación Gremial</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-12 pt-8 border-t border-slate-800">
          {GUILD_BENEFITS_DATA.hero.stats.map((stat, idx) => (
            <div key={idx} className="p-4 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-md">
              <span className="font-serif text-2xl sm:text-3xl font-bold text-amber-400 block">{stat.number}</span>
              <span className="text-xs text-slate-300 font-medium block mt-1">{stat.label}</span>
            </div>
          ))}
        </div>
      </section>

      {/* Main Section Navigation Switcher */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-slate-900/90 backdrop-blur-md border border-amber-500/30 rounded-2xl p-2 shadow-xl flex flex-wrap items-center justify-center gap-2">
          <button
            onClick={() => setMainView('board')}
            className={`flex items-center gap-2 px-5 py-3 rounded-xl text-xs font-bold transition-all ${
              mainView === 'board'
                ? 'bg-gradient-to-r from-amber-500 to-amber-600 text-slate-950 font-black shadow-lg shadow-amber-500/20'
                : 'text-slate-300 hover:text-white hover:bg-slate-800/80'
            }`}
          >
            <Users className="w-4 h-4" />
            <span>Junta Directiva Oficial (10 Miembros)</span>
          </button>

          <button
            onClick={() => setMainView('benefits')}
            className={`flex items-center gap-2 px-5 py-3 rounded-xl text-xs font-bold transition-all ${
              mainView === 'benefits'
                ? 'bg-gradient-to-r from-amber-500 to-amber-600 text-slate-950 font-black shadow-lg shadow-amber-500/20'
                : 'text-slate-300 hover:text-white hover:bg-slate-800/80'
            }`}
          >
            <Award className="w-4 h-4" />
            <span>10 Pilares de Beneficios</span>
          </button>

          <button
            onClick={() => setMainView('comparison')}
            className={`flex items-center gap-2 px-5 py-3 rounded-xl text-xs font-bold transition-all ${
              mainView === 'comparison'
                ? 'bg-gradient-to-r from-amber-500 to-amber-600 text-slate-950 font-black shadow-lg shadow-amber-500/20'
                : 'text-slate-300 hover:text-white hover:bg-slate-800/80'
            }`}
          >
            <ShieldCheck className="w-4 h-4" />
            <span>Comparativa de Valor</span>
          </button>

          <button
            onClick={() => setMainView('all')}
            className={`flex items-center gap-2 px-5 py-3 rounded-xl text-xs font-bold transition-all ${
              mainView === 'all'
                ? 'bg-gradient-to-r from-amber-500 to-amber-600 text-slate-950 font-black shadow-lg shadow-amber-500/20'
                : 'text-slate-300 hover:text-white hover:bg-slate-800/80'
            }`}
          >
            <Sparkles className="w-4 h-4" />
            <span>Ver Dossier Completo</span>
          </button>
        </div>
      </section>

      {/* SECTION: Junta Directiva Oficial (Rendered when mainView is 'board' or 'all') */}
      {(mainView === 'board' || mainView === 'all') && (
        <section id="seccion-junta-directiva" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-4">
          <div className="text-center max-w-3xl mx-auto mb-10">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-amber-100 border border-amber-300 text-amber-900 text-xs font-bold mb-3 shadow-sm">
              <Users className="w-4 h-4 text-amber-600" />
              <span>Liderazgo & Compromiso Institucional</span>
            </div>
            <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold text-slate-900 tracking-tight">
              Junta Directiva Oficial
            </h2>
            <p className="mt-3 text-slate-600 text-xs sm:text-sm leading-relaxed max-w-2xl mx-auto">
              Equipo directivo y coordinadores especializados dedicados al fortalecimiento empresarial, defensa gremial y proyección internacional de Mérida Gastronómica.
            </p>
          </div>

          {/* High Executive Board: 6 members */}
          <div className="mb-12">
            <div className="flex items-center gap-2 mb-6 pb-2.5 border-b border-amber-500/20">
              <ShieldCheck className="w-5 h-5 text-amber-600" />
              <h3 className="font-serif text-base sm:text-lg font-bold text-slate-900 uppercase tracking-wider">
                Alta Dirección & Comité Ejecutivo
              </h3>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
              {BOARD_MEMBERS_DATA.slice(0, 6).map((member) => (
                <div
                  key={member.id}
                  className="bg-white rounded-3xl border border-slate-200/90 overflow-hidden shadow-md hover:shadow-2xl hover:border-amber-400 transition-all duration-300 group flex flex-col"
                >
                  {/* Portrait Photo Container */}
                  <div className="relative w-full aspect-[4/4.5] bg-gradient-to-b from-slate-100 to-slate-200 overflow-hidden">
                    <img
                      src={member.avatar}
                      alt={member.name}
                      className="w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950/60 via-transparent to-transparent opacity-60 group-hover:opacity-40 transition-opacity pointer-events-none" />
                    
                    {/* Verified Badge */}
                    <div className="absolute top-3 right-3 px-2.5 py-1 rounded-full bg-slate-900/80 backdrop-blur-md border border-amber-400/40 text-amber-300 text-[10px] font-bold flex items-center gap-1 shadow-lg">
                      <ShieldCheck className="w-3 h-3 text-amber-400" />
                      <span>Oficial</span>
                    </div>

                    {/* Role Overlay Pill on Image */}
                    <div className="absolute bottom-3 left-3 right-3">
                      <span className="inline-block text-[10px] uppercase font-black tracking-widest text-slate-950 bg-amber-400/95 backdrop-blur-md px-3 py-1 rounded-xl shadow-md border border-amber-300">
                        {member.role}
                      </span>
                    </div>
                  </div>

                  {/* Card Content */}
                  <div className="p-5 sm:p-6 flex flex-col justify-between flex-1 bg-white">
                    <div>
                      <h4 className="font-serif font-black text-slate-900 text-lg sm:text-xl leading-snug group-hover:text-amber-700 transition-colors">
                        {member.name}
                      </h4>
                      <p className="text-xs font-semibold text-slate-500 mt-1">
                        Cámara Gastronómica del Estado Mérida
                      </p>
                    </div>

                    {member.instagram && (
                      <div className="pt-4 mt-4 border-t border-slate-100 flex items-center justify-between">
                        <a
                          href={member.instagramUrl || `https://www.instagram.com/${member.instagram.replace('@', '')}/`}
                          target="_blank"
                          rel="noreferrer"
                          className="inline-flex items-center gap-1.5 text-xs text-amber-700 hover:text-amber-900 font-bold transition-colors group/link"
                        >
                          <Instagram className="w-4 h-4 text-amber-600 group-hover/link:scale-110 transition-transform" />
                          <span>{member.instagram}</span>
                        </a>
                        <ExternalLink className="w-3.5 h-3.5 text-slate-400 group-hover:text-amber-600 transition-colors" />
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Specialized Coordinations: 4 members */}
          <div className="bg-slate-50/80 rounded-3xl p-6 sm:p-8 border border-slate-200">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6 pb-3 border-b border-slate-200">
              <div className="flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-amber-600" />
                <h3 className="font-serif text-base sm:text-lg font-bold text-slate-900 uppercase tracking-wider">
                  Coordinaciones Especializadas
                </h3>
              </div>
              <p className="text-xs text-slate-600 italic max-w-xl">
                Asimismo, y para el desarrollo sectorial, técnico y territorial del gremio, se certifica la instalación de las coordinaciones especializadas bajo la responsabilidad de:
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {BOARD_MEMBERS_DATA.slice(6).map((member) => (
                <div
                  key={member.id}
                  className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-md hover:shadow-xl hover:border-amber-400 transition-all duration-300 group flex flex-col"
                >
                  {/* Portrait Photo Container */}
                  <div className="relative w-full aspect-[4/4.5] bg-gradient-to-b from-slate-100 to-slate-200 overflow-hidden">
                    <img
                      src={member.avatar}
                      alt={member.name}
                      className="w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950/60 via-transparent to-transparent opacity-60 group-hover:opacity-40 transition-opacity pointer-events-none" />

                    {/* Role Overlay Pill on Image */}
                    <div className="absolute bottom-2.5 left-2.5 right-2.5">
                      <span className="inline-block text-[9px] uppercase font-extrabold tracking-wider text-slate-900 bg-amber-300/95 backdrop-blur-md px-2.5 py-0.5 rounded-lg shadow-sm border border-amber-200 truncate max-w-full">
                        {member.role}
                      </span>
                    </div>
                  </div>

                  {/* Card Content */}
                  <div className="p-4 sm:p-5 flex flex-col justify-between flex-1 bg-white">
                    <div>
                      <h4 className="font-serif font-black text-slate-900 text-sm sm:text-base leading-snug group-hover:text-amber-700 transition-colors">
                        {member.name}
                      </h4>
                      <p className="text-[11px] font-semibold text-slate-500 mt-0.5">
                        Coordinación Oficial
                      </p>
                    </div>

                    {member.instagram && (
                      <div className="pt-3 mt-3 border-t border-slate-100 flex items-center justify-between">
                        <a
                          href={member.instagramUrl || `https://www.instagram.com/${member.instagram.replace('@', '')}/`}
                          target="_blank"
                          rel="noreferrer"
                          className="inline-flex items-center gap-1.5 text-[11px] text-amber-700 hover:text-amber-900 font-bold transition-colors group/link truncate"
                        >
                          <Instagram className="w-3.5 h-3.5 text-amber-600 group-hover/link:scale-110 transition-transform shrink-0" />
                          <span className="truncate">{member.instagram}</span>
                        </a>
                        <ExternalLink className="w-3 h-3 text-slate-400 group-hover:text-amber-600 transition-colors shrink-0" />
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* SECTION: 10 Strategic Pillars (Rendered when mainView is 'benefits' or 'all') */}
      {(mainView === 'benefits' || mainView === 'all') && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-4">
          <div className="text-center max-w-3xl mx-auto mb-8">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-amber-100 border border-amber-300 text-amber-900 text-xs font-bold mb-3 shadow-sm">
              <Award className="w-4 h-4 text-amber-600" />
              <span>Propuesta de Valor Integral</span>
            </div>
            <h2 className="font-serif text-3xl sm:text-4xl font-bold text-slate-900 tracking-tight">
              Los 10 Pilares de Beneficios para el Agremiado
            </h2>
            <p className="mt-2 text-slate-600 text-xs sm:text-sm">
              Conoce cada una de las ventajas exclusivas que recibe tu establecimiento gastronómico al pertenecer a la Cámara.
            </p>
          </div>

          {/* Categories Filter Tabs */}
          <div className="flex flex-wrap items-center justify-center gap-2 mb-10">
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setFilterCategory(cat.id)}
                className={`px-5 py-2.5 rounded-2xl text-xs font-bold transition-all ${
                  filterCategory === cat.id
                    ? 'bg-slate-900 text-white shadow-lg ring-2 ring-amber-500/30'
                    : 'bg-white text-slate-600 border border-slate-200 hover:border-amber-300'
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>

          {/* The 10 Strategic Pillars Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {filteredBenefits.map((b) => {
              const IconComponent = ICONS_MAP[b.icon] || ShieldCheck;

              return (
                <div
                  key={b.id}
                  className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-md hover:shadow-xl transition-all flex flex-col justify-between"
                >
                  <div>
                    {/* Card Top Meta */}
                    <div className="flex items-center justify-between gap-4 mb-4">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-600 shadow-sm shrink-0">
                          <IconComponent className="w-6 h-6" />
                        </div>
                        <span className="text-xs font-mono font-extrabold px-3 py-1 rounded-full bg-slate-100 text-slate-700">
                          Pilar #{b.number}
                        </span>
                      </div>

                      <span className="text-[10px] uppercase font-bold tracking-wider px-2.5 py-1 rounded-full bg-amber-100 text-amber-900">
                        {b.tag}
                      </span>
                    </div>

                    {/* Title & Subtitle */}
                    <h3 className="font-serif text-xl sm:text-2xl font-bold text-slate-900 mb-1 leading-snug">
                      {b.title}
                    </h3>
                    <span className="text-xs font-bold text-amber-700 block mb-3">
                      {b.subtitle}
                    </span>

                    {/* Description */}
                    <p className="text-xs sm:text-sm text-slate-600 leading-relaxed mb-6">
                      {b.description}
                    </p>

                    {/* Expandable Details List */}
                    <div className="space-y-2.5 pt-4 border-t border-slate-100">
                      <span className="text-[11px] font-extrabold uppercase tracking-wider text-slate-400 block mb-1">
                        Qué incluye este beneficio:
                      </span>
                      {b.details.map((detail, dIdx) => (
                        <div key={dIdx} className="flex items-start gap-2.5 text-xs text-slate-700">
                          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                          <span>{detail}</span>
                        </div>
                      ))}
                    </div>

                  </div>

                  {/* Card Action Link */}
                  <div className="pt-6 mt-6 border-t border-slate-100 flex items-center justify-between">
                    <span className="text-[11px] text-slate-400 font-medium">
                      Disponible desde el Día 1 de afiliación
                    </span>
                    <button
                      onClick={handleGoToAffiliate}
                      className="text-xs font-bold text-amber-700 hover:text-amber-800 flex items-center gap-1 group"
                    >
                      <span>Activar Membresía</span>
                      <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </section>
      )}

      {/* SECTION: Institutional Table: Comparativa Afiliado vs No Afiliado (Rendered when mainView is 'comparison' or 'all') */}
      {(mainView === 'comparison' || mainView === 'all') && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-4">
          <div className="bg-slate-900 text-white rounded-3xl p-8 sm:p-10 shadow-2xl border border-slate-800">
            <div className="text-center max-w-2xl mx-auto mb-10">
              <span className="text-xs uppercase font-extrabold text-amber-400 tracking-wider block mb-1">
                Impacto Empresarial Directo
              </span>
              <h3 className="font-serif text-2xl sm:text-3xl font-bold text-white">
                ¿Por qué los Líderes Eligen Agremiarse?
              </h3>
              <p className="text-xs text-slate-400 mt-2">
                Comparativa del respaldo y las herramientas entre operar en solitario o respaldado por la Cámara.
              </p>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-xs text-left">
                <thead>
                  <tr className="border-b border-slate-800 text-slate-400 uppercase tracking-wider text-[10px]">
                    <th className="py-3 px-4">Capacidad / Herramienta</th>
                    <th className="py-3 px-4 text-amber-400 font-bold">⭐ Miembro Agremiado</th>
                    <th className="py-3 px-4 text-slate-500">Operación Independiente</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800 text-slate-300">
                  <tr>
                    <td className="py-3.5 px-4 font-bold text-white">Representación Jurídica y SAMAT</td>
                    <td className="py-3.5 px-4 text-emerald-400 font-medium">Respaldo gremial oficial y mesas de diálogo</td>
                    <td className="py-3.5 px-4 text-slate-500">Gestión individual aislada</td>
                  </tr>
                  <tr>
                    <td className="py-3.5 px-4 font-bold text-white">Certificación de Excelencia</td>
                    <td className="py-3.5 px-4 text-emerald-400 font-medium">Sello de Calidad AAA (226 ítems) con placa física</td>
                    <td className="py-3.5 px-4 text-slate-500">Sin certificación técnica formal</td>
                  </tr>
                  <tr>
                    <td className="py-3.5 px-4 font-bold text-white">Geolocalización & Marketing</td>
                    <td className="py-3.5 px-4 text-emerald-400 font-medium">Mapa 3D LiDAR, SEO global y portal internacional</td>
                    <td className="py-3.5 px-4 text-slate-500">Dependiente de redes sociales propias</td>
                  </tr>
                  <tr>
                    <td className="py-3.5 px-4 font-bold text-white">Formación ULA & Escuelas Culinarias</td>
                    <td className="py-3.5 px-4 text-emerald-400 font-medium">Convenios exclusivos, pasantías y becas</td>
                    <td className="py-3.5 px-4 text-slate-500">Costos completos sin aval universitario</td>
                  </tr>
                  <tr>
                    <td className="py-3.5 px-4 font-bold text-white">Contratación de Personal</td>
                    <td className="py-3.5 px-4 text-emerald-400 font-medium">Bolsa precalificada con referencias verificadas</td>
                    <td className="py-3.5 px-4 text-slate-500">Búsqueda abierta con alta rotación</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </section>
      )}


      {/* Massive Call to Action with Video Trigger */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-gradient-to-r from-amber-500 via-amber-600 to-amber-700 rounded-3xl p-8 sm:p-12 text-slate-950 shadow-2xl shadow-amber-500/20 flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-950/10 text-slate-950 text-xs font-bold mb-3">
              <Building2 className="w-3.5 h-3.5" />
              <span>Cámara Gastronómica del Estado Mérida • Afiliación Abierta</span>
            </div>
            <h2 className="font-serif text-3xl sm:text-4xl font-bold leading-tight mb-3">
              Únete a la Red Empresarial Más Sólida de los Andes
            </h2>
            <p className="text-xs sm:text-sm text-slate-900/90 leading-relaxed font-medium">
              Completa el registro en 3 simples pasos, obtén tu número de agremiación gremial, certificado digital inmediato y disfruta de los 10 pilares de valor.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-3 w-full md:w-auto shrink-0">
            <button
              onClick={handleGoToAffiliate}
              className="w-full sm:w-auto px-7 py-4 rounded-2xl bg-slate-950 hover:bg-slate-900 text-white font-serif font-bold text-xs uppercase tracking-wider shadow-2xl transition-all flex items-center justify-center gap-2 group"
            >
              <Building2 className="w-4 h-4 text-amber-400" />
              <span>Comenzar Afiliación Ahora</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </button>
          </div>
        </div>
      </section>

    </div>
  );
}
