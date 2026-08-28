import React, { useState } from 'react';
import { 
  Sparkles, 
  Mountain, 
  Coffee, 
  Droplets, 
  Sprout, 
  ArrowRight,
  ShieldCheck
} from 'lucide-react';
import { TERROIR_DATA } from '../data/terroirData';

export function TerroirSection({ t, setActiveTab, onQuickSearch }) {
  const [selectedTerroir, setSelectedTerroir] = useState(TERROIR_DATA[0]);

  const terroirIcons = {
    'cacao-porcelana': Sparkles,
    'cafe-altura': Coffee,
    'paramo-despensa': Sprout,
    'termales-palmarito': Droplets
  };

  return (
    <section className="py-12 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      
      {/* Header */}
      <div className="text-center max-w-3xl mx-auto mb-10">
        <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-amber-100 border border-amber-300 text-amber-900 text-xs font-bold mb-3 shadow-sm">
          <Sparkles className="w-3.5 h-3.5 text-amber-600" />
          <span>Denominaciones de Origen & Patrimonio</span>
        </div>
        <h2 className="font-serif text-3xl sm:text-5xl font-bold text-slate-900 tracking-tight">
          Atributos Turísticos & Sabores de Origen
        </h2>
        <p className="mt-3 text-slate-600 text-sm sm:text-base">
          Mérida es un territorio de contrastes únicos: desde el frío de los páramos agrícolas hasta el cacao fino del Sur del Lago.
        </p>
      </div>

      {/* Terroir Navigation Pills */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-10">
        {TERROIR_DATA.map((item) => {
          const Icon = terroirIcons[item.id] || Sparkles;
          const isSelected = selectedTerroir.id === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setSelectedTerroir(item)}
              className={`p-4 rounded-2xl border text-left transition-all duration-300 flex items-center gap-3 ${
                isSelected
                  ? 'bg-white border-amber-500 shadow-md scale-105 ring-2 ring-amber-500/20'
                  : 'bg-white border-slate-200 hover:border-amber-300 text-slate-600'
              }`}
            >
              <div className={`p-2.5 rounded-xl ${isSelected ? 'bg-amber-500 text-white' : 'bg-slate-100 text-amber-600'}`}>
                <Icon className="w-5 h-5" />
              </div>
              <div>
                <span className="text-[10px] uppercase font-bold block text-amber-800">
                  {item.tag}
                </span>
                <span className="font-serif font-bold text-xs sm:text-sm text-slate-900 line-clamp-1">
                  {item.title.split(':')[0]}
                </span>
              </div>
            </button>
          );
        })}
      </div>

      {/* Main Feature In-Depth Showcase */}
      <div className="rounded-3xl bg-white border border-slate-200 overflow-hidden shadow-xl">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-0">
          
          {/* Left Column: Image */}
          <div className="lg:col-span-5 relative min-h-[350px] lg:min-h-full bg-slate-100">
            <img 
              src={selectedTerroir.image} 
              alt={selectedTerroir.title} 
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950/60 via-transparent to-black/20" />
            
            <div className="absolute top-4 left-4 right-4 flex items-center justify-between">
              <span className="px-3 py-1 rounded-full text-xs font-bold bg-slate-900/80 text-white backdrop-blur-md flex items-center gap-1.5">
                <Mountain className="w-3.5 h-3.5 text-sky-400" />
                <span>{selectedTerroir.altitudeRange}</span>
              </span>
              <span className="px-3 py-1 rounded-full text-xs font-bold bg-amber-500 text-white shadow-sm">
                {selectedTerroir.region}
              </span>
            </div>

            <div className="absolute bottom-4 left-4 right-4 p-3 rounded-xl bg-white/95 backdrop-blur-md border border-slate-200 text-slate-800 shadow">
              <p className="text-xs font-serif italic">
                "{selectedTerroir.subtitle}"
              </p>
            </div>
          </div>

          {/* Right Column: Content */}
          <div className="lg:col-span-7 p-6 sm:p-10 flex flex-col justify-between space-y-6">
            
            <div>
              <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-amber-800 mb-2">
                <ShieldCheck className="w-4 h-4 text-amber-600" />
                <span>Patrimonio Gastronómico & Agrícola Protegido</span>
              </div>

              <h3 className="font-serif text-2xl sm:text-4xl font-bold text-slate-900 leading-tight">
                {selectedTerroir.title}
              </h3>

              <p className="mt-4 text-sm sm:text-base text-slate-600 leading-relaxed">
                {selectedTerroir.description}
              </p>

              {/* Technical Facts Grid */}
              <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-3">
                {selectedTerroir.facts.map((fact, idx) => (
                  <div key={idx} className="p-4 rounded-2xl bg-slate-50 border border-slate-200">
                    <span className="text-[10px] uppercase font-bold text-amber-800 block">
                      {fact.label}
                    </span>
                    <span className="font-bold text-xs text-slate-800 mt-0.5 block">
                      {fact.value}
                    </span>
                  </div>
                ))}
              </div>

              {/* Curated Experiences */}
              <div className="mt-6 pt-4 border-t border-slate-100">
                <h4 className="font-serif font-bold text-sm text-slate-900 flex items-center gap-2 mb-3">
                  <Sparkles className="w-4 h-4 text-amber-600" />
                  Experiencias Recomendadas para el Turista:
                </h4>
                <ul className="space-y-2">
                  {selectedTerroir.experiences.map((exp, i) => (
                    <li key={i} className="text-xs text-slate-700 flex items-start gap-2.5">
                      <div className="w-1.5 h-1.5 rounded-full bg-amber-500 mt-1 shrink-0" />
                      <span>{exp}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Bottom Action */}
            <div className="pt-4 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-4">
              <button
                onClick={() => {
                  const query = selectedTerroir.id === 'cacao-porcelana' ? 'Cacao' 
                    : selectedTerroir.id === 'cafe-altura' ? 'Café' 
                    : selectedTerroir.id === 'paramo-despensa' ? 'Páramo' 
                    : 'Palmarito';
                  onQuickSearch(query);
                  setActiveTab('guide');
                }}
                className="w-full sm:w-auto py-3 px-6 rounded-xl bg-amber-500 hover:bg-amber-600 text-white font-serif font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-sm transition-all"
              >
                <span>Explorar Restaurantes de este Terroir</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <button
                onClick={() => setActiveTab('lidar')}
                className="text-xs font-bold text-sky-700 hover:underline flex items-center gap-1.5"
              >
                <span>Ver ubicación en Mapa</span>
              </button>
            </div>

          </div>

        </div>
      </div>

    </section>
  );
}
