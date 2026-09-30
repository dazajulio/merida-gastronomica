import React, { useState } from 'react';
import { COFFEE_DATA } from '../data/coffeeData';
import { 
  Coffee, 
  Mountain, 
  Sparkles, 
  Compass, 
  ShieldCheck, 
  Clock, 
  MapPin, 
  Award, 
  Flame, 
  ChevronRight, 
  ArrowRight,
  Droplets,
  Search
} from 'lucide-react';

export function CoffeeSection({ setActiveTab, onQuickSearch }) {
  const [selectedMethod, setSelectedMethod] = useState(COFFEE_DATA.methods[0]);
  const [activeRegion, setActiveRegion] = useState(COFFEE_DATA.regions[0]);

  return (
    <div className="space-y-16 pb-12 animate-fadeIn">
      
      {/* Hero Header */}
      <section className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-amber-950 via-stone-900 to-amber-900 text-white p-8 sm:p-12 shadow-2xl border border-amber-500/20">
        <div className="absolute top-0 right-0 -mr-16 -mt-16 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl pointer-events-none"></div>
        <div className="relative z-10 max-w-3xl">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30 text-xs font-bold mb-4">
            <Coffee className="w-3.5 h-3.5 text-amber-400" />
            <span>{COFFEE_DATA.hero.badge}</span>
          </div>

          <h1 className="font-serif text-3xl sm:text-5xl font-bold tracking-tight text-white leading-tight mb-4">
            {COFFEE_DATA.hero.title}
          </h1>

          <p className="text-sm sm:text-base text-amber-100/90 leading-relaxed mb-6 font-light">
            {COFFEE_DATA.hero.subtitle}
          </p>

          <blockquote className="border-l-2 border-amber-400 pl-4 py-1 italic text-xs sm:text-sm text-amber-200/80 mb-8 font-serif">
            "{COFFEE_DATA.hero.quote}"
          </blockquote>

          {/* Key Metrics Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
            {COFFEE_DATA.qualityMetrics.map((m, idx) => (
              <div key={idx} className="p-3.5 rounded-2xl bg-white/10 backdrop-blur-md border border-white/10">
                <span className="text-lg sm:text-xl font-bold font-serif text-amber-400 block">{m.value}</span>
                <span className="text-[11px] font-bold text-white block mt-0.5">{m.label}</span>
                <span className="text-[10px] text-amber-200/70 block mt-0.5">{m.detail}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Terruños & Regiones Cafetaleras */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 gap-4">
          <div>
            <span className="text-xs uppercase font-extrabold text-amber-800 tracking-wider flex items-center gap-1.5 mb-1">
              <Mountain className="w-4 h-4 text-amber-600" />
              Microclimas y Pisos Térmicos
            </span>
            <h2 className="font-serif text-2xl sm:text-3xl font-bold text-slate-900">
              Regiones Cafetaleras del Estado Mérida
            </h2>
          </div>
          <p className="text-xs text-slate-500 max-w-md">
            La topografía de la Sierra Nevada crea valles y laderas con humedad, insolación y vientos únicos para cada variedad.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {COFFEE_DATA.regions.map((region) => {
            const isSelected = activeRegion.id === region.id;
            return (
              <div
                key={region.id}
                onClick={() => setActiveRegion(region)}
                className={`p-6 rounded-3xl border transition-all cursor-pointer flex flex-col justify-between ${
                  isSelected 
                    ? 'bg-amber-900 text-white border-amber-600 shadow-xl ring-2 ring-amber-500/30 -translate-y-1' 
                    : 'bg-white text-slate-800 border-slate-200 hover:border-amber-400 hover:shadow-md'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between gap-2 mb-3">
                    <span className={`px-2.5 py-1 rounded-full text-[10px] font-extrabold uppercase tracking-wider ${
                      isSelected ? 'bg-amber-500 text-slate-950' : 'bg-amber-100 text-amber-900'
                    }`}>
                      {region.altitude}
                    </span>
                    <Flame className={`w-4 h-4 ${isSelected ? 'text-amber-400' : 'text-amber-600'}`} />
                  </div>

                  <h3 className="font-serif text-lg font-bold mb-2">
                    {region.name}
                  </h3>

                  <p className={`text-xs leading-relaxed mb-4 ${isSelected ? 'text-amber-100/90' : 'text-slate-600'}`}>
                    {region.description}
                  </p>
                </div>

                <div className={`pt-4 border-t ${isSelected ? 'border-amber-700/60' : 'border-slate-100'}`}>
                  <span className={`text-[10px] uppercase font-bold tracking-wider block mb-1 ${isSelected ? 'text-amber-300' : 'text-amber-800'}`}>
                    Perfil de Taza:
                  </span>
                  <p className={`text-xs font-medium italic ${isSelected ? 'text-amber-200' : 'text-slate-700'}`}>
                    {region.flavorProfile}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Métodos de Extracción en Barra */}
      <section className="bg-amber-50/60 py-14 border-y border-amber-200/60">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mb-10">
            <span className="text-xs uppercase font-extrabold text-amber-900 tracking-wider flex items-center gap-1.5 mb-1">
              <Droplets className="w-4 h-4 text-amber-700" />
              Barismo & Alquimia de Extracción
            </span>
            <h2 className="font-serif text-2xl sm:text-3xl font-bold text-slate-900">
              Métodos de Filtrado Recomendados
            </h2>
            <p className="text-xs text-slate-600 mt-1">
              La molienda, el flujo del agua pura de manantial y el tiempo de contacto desatan la complejidad de los granos andinos.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            
            {/* Method Selectors */}
            <div className="lg:col-span-5 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-3">
              {COFFEE_DATA.methods.map((method) => {
                const isSel = selectedMethod.id === method.id;
                return (
                  <button
                    key={method.id}
                    onClick={() => setSelectedMethod(method)}
                    className={`p-4 rounded-2xl border text-left transition-all flex items-center justify-between gap-4 ${
                      isSel 
                        ? 'bg-slate-900 text-white border-slate-900 shadow-lg' 
                        : 'bg-white text-slate-800 border-slate-200 hover:border-amber-400'
                    }`}
                  >
                    <div>
                      <span className={`text-[10px] font-bold uppercase tracking-wider block ${isSel ? 'text-amber-400' : 'text-amber-700'}`}>
                        {method.type}
                      </span>
                      <h4 className="font-serif font-bold text-base">{method.name}</h4>
                    </div>
                    <ChevronRight className={`w-5 h-5 ${isSel ? 'text-amber-400' : 'text-slate-400'}`} />
                  </button>
                );
              })}
            </div>

            {/* Method Detail Card */}
            <div className="lg:col-span-7 bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-xl">
              <div className="flex items-center justify-between gap-4 pb-6 border-b border-slate-100 mb-6">
                <div>
                  <span className="text-xs uppercase font-extrabold text-amber-700 tracking-wider">
                    Ficha Técnica de Extracción
                  </span>
                  <h3 className="font-serif text-2xl font-bold text-slate-900">
                    {selectedMethod.name} ({selectedMethod.type})
                  </h3>
                </div>
                <div className="p-3 rounded-2xl bg-amber-500 text-white shadow-md">
                  <Coffee className="w-6 h-6" />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
                <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 text-center">
                  <span className="text-[10px] font-extrabold uppercase text-slate-500 block">Ratio Agua/Café</span>
                  <span className="text-sm font-bold text-slate-900 font-mono mt-0.5 block">{selectedMethod.ratio}</span>
                </div>
                <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 text-center">
                  <span className="text-[10px] font-extrabold uppercase text-slate-500 block">Tiempo de Contacto</span>
                  <span className="text-sm font-bold text-slate-900 font-mono mt-0.5 block">{selectedMethod.time}</span>
                </div>
                <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 text-center">
                  <span className="text-[10px] font-extrabold uppercase text-slate-500 block">Molienda Sugerida</span>
                  <span className="text-sm font-bold text-slate-900 font-mono mt-0.5 block">{selectedMethod.grind}</span>
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200 text-amber-950 text-xs leading-relaxed">
                <span className="font-bold block mb-1">Impacto Sensorial en Taza:</span>
                {selectedMethod.highlight}
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* Barras de Especialidad & Cafeterías Agremiadas */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 gap-4">
          <div>
            <span className="text-xs uppercase font-extrabold text-amber-800 tracking-wider flex items-center gap-1.5 mb-1">
              <Award className="w-4 h-4 text-amber-600" />
              Ruta del Café de Especialidad
            </span>
            <h2 className="font-serif text-2xl sm:text-3xl font-bold text-slate-900">
              Cafeterías & Tostadurías Agremiadas
            </h2>
          </div>
          <button
            onClick={() => onQuickSearch && onQuickSearch('café')}
            className="px-4 py-2.5 rounded-xl border border-amber-300 bg-amber-50 hover:bg-amber-100 text-amber-900 font-bold text-xs flex items-center gap-2 transition-all shrink-0"
          >
            <Search className="w-3.5 h-3.5 text-amber-700" />
            <span>Buscar Cafeterías en la Guía</span>
          </button>
        </div>

        {COFFEE_DATA.spots.length === 0 ? (
          <div className="bg-white rounded-3xl border border-dashed border-amber-300 p-8 sm:p-12 text-center shadow-xs">
            <div className="w-14 h-14 rounded-2xl bg-amber-100 text-amber-800 flex items-center justify-center mx-auto mb-4 border border-amber-200">
              <Coffee className="w-7 h-7" />
            </div>
            <h3 className="font-serif font-black text-xl text-slate-900 uppercase tracking-wide mb-2">
              Convocatoria de Certificación en Curso
            </h3>
            <p className="text-xs text-slate-600 max-w-lg mx-auto leading-relaxed font-sans mb-6">
              Las cafeterías, barras de especialidad y tostadurías del estado Mérida se encuentran en fase de auditoría técnica, calibración y registro oficial para su incorporación a la cartografía gremial.
            </p>
            <button
              onClick={() => {
                setActiveTab('affiliates');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className="inline-flex items-center gap-2 py-3 px-6 rounded-xl bg-amber-500 hover:bg-amber-600 text-slate-950 font-serif font-black text-xs uppercase tracking-wider shadow-sm transition-all"
            >
              <span>Postular mi Cafetería o Finca</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {COFFEE_DATA.spots.map((spot) => (
              <div
                key={spot.id}
                className="bg-white rounded-3xl border border-slate-200 p-6 shadow-md hover:shadow-xl transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center gap-2 text-xs font-bold text-slate-500 mb-2">
                    <MapPin className="w-3.5 h-3.5 text-amber-600" />
                    <span>{spot.location}</span>
                  </div>
                  <h3 className="font-serif text-lg font-bold text-slate-900 mb-2">
                    {spot.name}
                  </h3>
                  <p className="text-xs text-amber-900 font-medium bg-amber-50 p-2.5 rounded-xl mb-3 border border-amber-200/60">
                    ☕ {spot.specialty}
                  </p>
                  <span className="text-[11px] text-slate-500 block mb-4">
                    👨‍🌾 {spot.barista}
                  </span>
                </div>

                <div className="flex flex-wrap gap-1.5 pt-3 border-t border-slate-100">
                  {spot.tags.map((tag, idx) => (
                    <span key={idx} className="px-2 py-0.5 rounded-md bg-slate-100 text-slate-700 text-[10px] font-bold">
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* CTA: Agremiar Cafetería o Tostaduría */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-gradient-to-r from-slate-900 via-amber-950 to-slate-900 text-white rounded-3xl p-8 sm:p-10 shadow-2xl border border-amber-500/30 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="max-w-xl">
            <span className="text-xs uppercase font-extrabold tracking-wider text-amber-400 block mb-1">
              ¿Eres caficultor, tostador o barista en Mérida?
            </span>
            <h3 className="font-serif text-2xl sm:text-3xl font-bold text-white mb-2">
              Integra tu Barra o Finca al Circuito Oficial
            </h3>
            <p className="text-xs text-slate-300 leading-relaxed">
              Obtén visibilidad en el mapa 3D LiDAR, certificación con el Sello Mérida Gastronómica y acceso a los eventos del sector.
            </p>
          </div>

          <button
            onClick={() => {
              setActiveTab('affiliates');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            className="px-6 py-3.5 rounded-2xl bg-amber-500 hover:bg-amber-600 text-slate-950 font-serif font-bold text-xs uppercase tracking-wider shadow-lg shadow-amber-500/30 transition-all flex items-center gap-2 shrink-0"
          >
            <span>Afiliar Mi Cafetería / Finca</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </section>

    </div>
  );
}
