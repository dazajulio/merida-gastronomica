import React, { useState } from 'react';
import { GUILD_BENEFITS_DATA } from '../data/guildBenefitsData';
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
  Play
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

export function GuildBenefitsSection({ setActiveTab }) {
  const [expandedBenefit, setExpandedBenefit] = useState(null);
  const [filterCategory, setFilterCategory] = useState('all');

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
    <div className="space-y-16 pb-12 animate-fadeIn">
      
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
            <div className="flex items-center gap-2 text-xs text-amber-200/80 bg-white/5 px-4 py-3 rounded-2xl border border-white/10">
              <Sparkles className="w-4 h-4 text-amber-400" />
              <span>Cuota anual oficial: $30 USD (tasa BCV)</span>
            </div>
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

      {/* Categories Filter Tabs */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
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
            const isExpanded = expandedBenefit === b.id;

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

      {/* Institutional Table: Comparativa Afiliado vs No Afiliado */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
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
