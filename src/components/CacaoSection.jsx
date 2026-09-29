import React, { useState } from 'react';
import { CACAO_DATA } from '../data/cacaoData';
import { 
  Sparkles, 
  ShieldCheck, 
  Award, 
  Clock, 
  Layers, 
  Utensils, 
  ArrowRight,
  Heart,
  Store,
  ChevronRight,
  CheckCircle2
} from 'lucide-react';

export function CacaoSection({ setActiveTab, onQuickSearch }) {
  const [activeStep, setActiveStep] = useState(0);

  return (
    <div className="space-y-16 pb-12 animate-fadeIn">
      
      {/* Hero Header */}
      <section className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-stone-950 via-amber-950 to-stone-900 text-white p-8 sm:p-12 shadow-2xl border border-amber-500/20">
        <div className="absolute top-0 right-0 -mr-20 -mt-20 w-96 h-96 bg-amber-600/10 rounded-full blur-3xl pointer-events-none"></div>
        <div className="relative z-10 max-w-3xl">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30 text-xs font-bold mb-4">
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            <span>{CACAO_DATA.hero.badge}</span>
          </div>

          <h1 className="font-serif text-3xl sm:text-5xl font-bold tracking-tight text-white leading-tight mb-4">
            {CACAO_DATA.hero.title}
          </h1>

          <p className="text-sm sm:text-base text-amber-100/90 leading-relaxed mb-6 font-light">
            {CACAO_DATA.hero.subtitle}
          </p>

          <blockquote className="border-l-2 border-amber-400 pl-4 py-1 italic text-xs sm:text-sm text-amber-200/80 mb-6 font-serif">
            "{CACAO_DATA.hero.quote}"
          </blockquote>
        </div>
      </section>

      {/* Herencia Genética & Singularidad */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 gap-4">
          <div>
            <span className="text-xs uppercase font-extrabold text-amber-900 tracking-wider flex items-center gap-1.5 mb-1">
              <Award className="w-4 h-4 text-amber-700" />
              Patrimonio Botánico Ancestral
            </span>
            <h2 className="font-serif text-2xl sm:text-3xl font-bold text-slate-900">
              ¿Por qué el Cacao Porcelana es Único en el Mundo?
            </h2>
          </div>
          <p className="text-xs text-slate-500 max-w-md">
            Mérida y el piedemonte lacustre conservan las condiciones microclimáticas ideales para la variedad criolla más codiciada por chocolateros globales.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {CACAO_DATA.heritage.map((item, idx) => (
            <div
              key={idx}
              className="p-6 rounded-3xl bg-white border border-slate-200 shadow-md hover:shadow-xl hover:border-amber-400 transition-all flex flex-col justify-between"
            >
              <div>
                <div className="w-10 h-10 rounded-2xl bg-amber-100 text-amber-900 flex items-center justify-center font-bold text-sm mb-4">
                  0{idx + 1}
                </div>
                <h3 className="font-serif text-lg font-bold text-slate-900 mb-2">
                  {item.title}
                </h3>
                <p className="text-xs text-slate-600 leading-relaxed">
                  {item.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Proceso Bean-to-Bar Interactivo */}
      <section className="bg-stone-900 text-white py-16 border-y border-stone-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mb-10">
            <span className="text-xs uppercase font-extrabold text-amber-400 tracking-wider flex items-center gap-1.5 mb-1">
              <Layers className="w-4 h-4 text-amber-500" />
              Alquimia Chocolatera
            </span>
            <h2 className="font-serif text-2xl sm:text-4xl font-bold text-white">
              El Arte Bean-to-Bar del Cacao Porcelana
            </h2>
            <p className="text-xs sm:text-sm text-stone-300 mt-2">
              Desde el árbol andino hasta la tableta fundida en boca: cada paso requiere precisión térmica y paciencia artesanal.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            
            {/* Steps Selector */}
            <div className="lg:col-span-6 space-y-2">
              {CACAO_DATA.beanToBarSteps.map((step, idx) => {
                const isCurrent = activeStep === idx;
                return (
                  <button
                    key={idx}
                    onClick={() => setActiveStep(idx)}
                    className={`w-full p-4 rounded-2xl border text-left transition-all flex items-center justify-between gap-4 ${
                      isCurrent
                        ? 'bg-amber-500 text-stone-950 border-amber-400 shadow-xl font-bold'
                        : 'bg-stone-800/80 text-stone-300 border-stone-700 hover:border-amber-500/50'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <span className={`text-xs font-mono font-extrabold px-2.5 py-1 rounded-lg ${
                        isCurrent ? 'bg-stone-950 text-amber-400' : 'bg-stone-900 text-stone-400'
                      }`}>
                        {step.step}
                      </span>
                      <span className="text-xs sm:text-sm font-serif">{step.title}</span>
                    </div>
                    <ChevronRight className={`w-4 h-4 ${isCurrent ? 'text-stone-950' : 'text-stone-500'}`} />
                  </button>
                );
              })}
            </div>

            {/* Step Detail Spotlight */}
            <div className="lg:col-span-6 bg-stone-950 rounded-3xl border border-amber-500/30 p-8 shadow-2xl flex flex-col justify-between min-h-[380px]">
              <div>
                <span className="text-xs uppercase font-extrabold text-amber-400 tracking-wider block mb-2">
                  Paso {CACAO_DATA.beanToBarSteps[activeStep].step} en Detalle
                </span>
                <h3 className="font-serif text-2xl sm:text-3xl font-bold text-white mb-4">
                  {CACAO_DATA.beanToBarSteps[activeStep].title}
                </h3>
                <p className="text-sm text-stone-300 leading-relaxed">
                  {CACAO_DATA.beanToBarSteps[activeStep].desc}
                </p>
              </div>

              <div className="pt-6 border-t border-stone-800 flex items-center justify-between gap-4 mt-6">
                <span className="text-xs text-stone-400">
                  Fase {activeStep + 1} de {CACAO_DATA.beanToBarSteps.length}
                </span>
                <div className="flex gap-2">
                  <button
                    disabled={activeStep === 0}
                    onClick={() => setActiveStep(prev => Math.max(0, prev - 1))}
                    className="px-3 py-1.5 rounded-xl border border-stone-700 text-xs text-stone-300 hover:text-white disabled:opacity-30"
                  >
                    Anterior
                  </button>
                  <button
                    disabled={activeStep === CACAO_DATA.beanToBarSteps.length - 1}
                    onClick={() => setActiveStep(prev => Math.min(CACAO_DATA.beanToBarSteps.length - 1, prev + 1))}
                    className="px-4 py-1.5 rounded-xl bg-amber-500 text-stone-950 font-bold text-xs hover:bg-amber-400 disabled:opacity-30"
                  >
                    Siguiente Paso
                  </button>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* Maridajes de Autor & Rones Andinos */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <span className="text-xs uppercase font-extrabold text-amber-900 tracking-wider flex items-center gap-1.5 mb-1">
            <Utensils className="w-4 h-4 text-amber-700" />
            Experiencias Gastronómicas de Maridaje
          </span>
          <h2 className="font-serif text-2xl sm:text-3xl font-bold text-slate-900">
            Armonías con Café, Ron y Frutas Nativas
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {CACAO_DATA.pairings.map((p, idx) => (
            <div
              key={idx}
              className="bg-white rounded-3xl border border-slate-200 p-6 shadow-md hover:shadow-xl transition-all flex flex-col justify-between"
            >
              <div>
                <span className="text-xs font-bold text-amber-700 uppercase tracking-wider block mb-2">
                  Maridaje #0{idx + 1}
                </span>
                <h3 className="font-serif text-lg font-bold text-slate-900 mb-3">
                  {p.title}
                </h3>
                <p className="text-xs text-slate-600 mb-4 leading-relaxed">
                  {p.notes}
                </p>
              </div>

              <div className="p-3.5 rounded-2xl bg-amber-50/80 border border-amber-200 text-amber-950 text-xs">
                <span className="font-bold block mb-0.5">💡 Consejo de Sommelier:</span>
                {p.sommelierTip}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Chocolaterías y Fincas Agremiadas */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-amber-50/70 rounded-3xl p-8 border border-amber-200">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
            <div>
              <h3 className="font-serif text-2xl font-bold text-slate-900">
                Chocolateros de Autor & Fincas Agremiadas
              </h3>
              <p className="text-xs text-slate-600">
                Marcas con Sello de Calidad que elaboran tabletas y bombones con Cacao Porcelana puro.
              </p>
            </div>
            <button
              onClick={() => onQuickSearch && onQuickSearch('chocolate')}
              className="px-4 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-white font-bold text-xs flex items-center gap-2 transition-all shrink-0"
            >
              <span>Explorar en la Guía</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {CACAO_DATA.artisanMakers.map((maker) => (
              <div key={maker.id} className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
                <div className="flex items-center gap-2 text-xs text-slate-500 mb-1">
                  <Store className="w-3.5 h-3.5 text-amber-600" />
                  <span>{maker.origin}</span>
                </div>
                <h4 className="font-serif font-bold text-slate-900 text-base mb-1.5">{maker.name}</h4>
                <p className="text-xs text-slate-600 mb-3">{maker.focus}</p>
                <div className="inline-flex items-center gap-1.5 text-[11px] font-bold text-amber-800 bg-amber-100/60 px-2.5 py-1 rounded-lg">
                  <Award className="w-3 h-3 text-amber-600" />
                  <span>{maker.awards}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Agremiación Cacaotera */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-gradient-to-r from-stone-950 via-amber-950 to-stone-950 text-white rounded-3xl p-8 sm:p-10 shadow-2xl border border-amber-500/30 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="max-w-xl">
            <span className="text-xs uppercase font-extrabold tracking-wider text-amber-400 block mb-1">
              ¿Elaboras chocolate artesanal o cultivas cacao en Mérida?
            </span>
            <h3 className="font-serif text-2xl sm:text-3xl font-bold text-white mb-2">
              Impulsa tu Marca con el Respaldo de la Cámara
            </h3>
            <p className="text-xs text-slate-300 leading-relaxed">
              Forma parte de las rutas turísticas oficiales, catas en eventos y el sello de denominación de origen.
            </p>
          </div>

          <button
            onClick={() => {
              setActiveTab('affiliates');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            className="px-6 py-3.5 rounded-2xl bg-amber-500 hover:bg-amber-600 text-slate-950 font-serif font-bold text-xs uppercase tracking-wider shadow-lg shadow-amber-500/30 transition-all flex items-center gap-2 shrink-0"
          >
            <span>Afiliar Mi Marca de Chocolate</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </section>

    </div>
  );
}
