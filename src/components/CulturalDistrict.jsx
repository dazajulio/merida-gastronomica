import React, { useState } from 'react';
import { 
  Palette, 
  MapPin, 
  Landmark, 
  Compass, 
  Music, 
  Sparkles, 
  Camera, 
  Footprints, 
  Clock, 
  ArrowRight, 
  CheckCircle2, 
  Star,
  ExternalLink,
  Info,
  Radio,
  Coffee,
  Utensils,
  Image as ImageIcon
} from 'lucide-react';
import { CULTURAL_CIRCUITS } from '../data/culturalDistrictData';

export function CulturalDistrict({ t, setActiveTab, onQuickSearch }) {
  const [selectedCircuit, setSelectedCircuit] = useState(CULTURAL_CIRCUITS[0]);
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);
  const [selectedPhotoModal, setSelectedPhotoModal] = useState(null);

  const circuitIcons = {
    'casco-historico': Landmark,
    'santa-juana-street': Palette,
    'milla-parques': Compass,
    'nocturno-jazz': Music
  };

  const galleryImages = [
    {
      url: '/images/distrito_mural_arte.png',
      title: 'Muralismo Andino & Torre Colonial',
      location: 'Circuito Santa Juana / Casco Central',
      category: 'Street Art',
      desc: 'Mural monumental de 30 metros inspirado en los frailejones y la herencia arquitectónica de Mérida.'
    },
    {
      url: '/images/distrito_bulevar_montana.png',
      title: 'Bulevar Peatonal Frente a la Sierra Nevada',
      location: 'Paseo de las Casonas Andinas',
      category: 'Bulevar Turístico',
      desc: 'Arquitectura tradicional de montaña, balcones de madera, terrazas de café y vista a los picos nevados.'
    },
    {
      url: '/images/distrito_nocturno_bulevar.png',
      title: 'Paseo Nocturno, Luces & Street Food',
      location: 'Bulevar Concordia / Ruta Nocturna',
      category: 'Vida Nocturna',
      desc: 'Ambiente vibrante iluminado con farolas modernas, gastronomía urbana al paso y terrazas de degustación.'
    }
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      
      {/* Editorial Header Banner with Urban & Artistic Street Background */}
      <div className="relative rounded-3xl p-8 sm:p-12 text-white shadow-2xl overflow-hidden mb-12 border border-purple-900/40">
        {/* Urban Street Art Background Image & Gradients */}
        <div className="absolute inset-0 z-0">
          <img 
            src="/images/distrito_mural_arte.png" 
            alt="Muralismo y Arte Urbano de Mérida" 
            className="w-full h-full object-cover object-center filter saturate-150 brightness-[0.32]"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-slate-950 via-slate-950/85 to-purple-950/75" />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-transparent" />
        </div>
        
        <div className="absolute -right-20 -top-20 w-96 h-96 bg-purple-600/30 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute left-1/3 bottom-0 w-80 h-80 bg-amber-500/20 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 max-w-3xl">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-purple-500/25 border border-purple-400/40 text-purple-300 text-xs font-bold mb-4 backdrop-blur-md">
            <Palette className="w-3.5 h-3.5 text-pink-400" />
            <span>Turismo Urbano, Street Art & Gastronomía Creativa</span>
          </div>

          <h1 className="font-serif text-3xl sm:text-5xl font-bold tracking-tight text-white leading-tight">
            Distrito Cultural & Gastronómico Urbano
          </h1>

          <p className="mt-4 text-slate-200 text-sm sm:text-base leading-relaxed">
            Mérida fusiona el muralismo andino monumental, el street food de autor, los cafés literarios y las cavas de jazz en una vibrante experiencia peatonal.
          </p>

          <div className="mt-8 flex flex-wrap items-center gap-4">
            <div className="px-4 py-2 rounded-xl bg-white/10 border border-white/20 text-xs font-bold flex items-center gap-2 backdrop-blur-md">
              <Footprints className="w-4 h-4 text-amber-400" />
              <span>4 Circuitos Peatonales Seguros</span>
            </div>
            <div className="px-4 py-2 rounded-xl bg-white/10 border border-white/20 text-xs font-bold flex items-center gap-2 backdrop-blur-md">
              <Camera className="w-4 h-4 text-pink-400" />
              <span>+1.200 m² de Street Art Mural</span>
            </div>
            <div className="px-4 py-2 rounded-xl bg-white/10 border border-white/20 text-xs font-bold flex items-center gap-2 backdrop-blur-md">
              <Utensils className="w-4 h-4 text-sky-400" />
              <span>Street Food & Cafés de Autor</span>
            </div>
          </div>
        </div>
      </div>

      {/* Visual Photography Showcase Grid (The 3 Real Photos) */}
      <div className="mb-12">
        <div className="flex items-center justify-between mb-6">
          <div>
            <span className="text-xs uppercase font-bold text-purple-800 tracking-wider flex items-center gap-1.5">
              <Camera className="w-4 h-4 text-purple-600" />
              Galería Fotográfica del Distrito
            </span>
            <h2 className="font-serif text-2xl sm:text-3xl font-bold text-slate-900 mt-1">
              Postales Reales de los Andes
            </h2>
          </div>
          <span className="text-xs font-bold text-slate-500 hidden sm:inline">
            3 Circuitos en Imágenes
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {galleryImages.map((img, idx) => (
            <div 
              key={idx}
              onClick={() => setSelectedPhotoModal(img)}
              className="group relative rounded-3xl overflow-hidden bg-slate-900 border border-slate-200 shadow-md hover:shadow-2xl transition-all duration-300 cursor-pointer h-80 sm:h-96"
            >
              <img 
                src={img.url} 
                alt={img.title} 
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 brightness-[0.95] group-hover:brightness-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-950/30 to-transparent" />
              
              <div className="absolute top-4 left-4">
                <span className="text-[10px] uppercase font-extrabold px-3 py-1 rounded-full bg-black/60 text-amber-300 border border-amber-400/40 backdrop-blur-md">
                  {img.category}
                </span>
              </div>

              <div className="absolute bottom-4 left-4 right-4 text-white">
                <h3 className="font-serif font-bold text-lg leading-tight group-hover:text-amber-300 transition-colors">
                  {img.title}
                </h3>
                <p className="text-xs text-slate-300 mt-1 flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                  <span>{img.location}</span>
                </p>
                <p className="text-[11px] text-slate-300/80 mt-2 line-clamp-2 leading-relaxed">
                  {img.desc}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Circuit Selection Tabs */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
        {CULTURAL_CIRCUITS.map((circuit) => {
          const Icon = circuitIcons[circuit.id] || Sparkles;
          const isSelected = selectedCircuit.id === circuit.id;
          return (
            <button
              key={circuit.id}
              onClick={() => setSelectedCircuit(circuit)}
              className={`p-5 rounded-2xl border text-left transition-all duration-300 relative overflow-hidden flex flex-col justify-between ${
                isSelected
                  ? 'bg-white border-purple-500 shadow-xl scale-[1.02] ring-2 ring-purple-500/20'
                  : 'bg-white border-slate-200 hover:border-purple-300 text-slate-700 shadow-sm'
              }`}
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <div className={`p-3 rounded-xl ${isSelected ? 'bg-gradient-to-br from-purple-600 to-pink-600 text-white shadow-md' : 'bg-slate-100 text-purple-700'}`}>
                    <Icon className="w-5 h-5" />
                  </div>
                  <span className="text-[10px] font-extrabold uppercase px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-600">
                    {circuit.tag}
                  </span>
                </div>

                <h3 className="font-serif font-bold text-base text-slate-900 leading-snug">
                  {circuit.title}
                </h3>
                <p className="text-xs text-slate-500 mt-1 line-clamp-2">
                  {circuit.subtitle}
                </p>
              </div>

              <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-[11px] font-semibold text-slate-600">
                <span className="flex items-center gap-1">
                  <Footprints className="w-3.5 h-3.5 text-purple-600" />
                  {circuit.distance}
                </span>
                <span className="flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5 text-slate-400" />
                  {circuit.timeEst}
                </span>
              </div>
            </button>
          );
        })}
      </div>

      {/* Selected Circuit Deep Dive Showcase */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-xl overflow-hidden mb-16">
        
        {/* Banner Section with Circuit Hero Image */}
        <div className="relative p-8 sm:p-12 text-white overflow-hidden">
          <div className="absolute inset-0 z-0">
            <img 
              src={selectedCircuit.heroImage} 
              alt={selectedCircuit.title} 
              className="w-full h-full object-cover filter brightness-[0.35]"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-slate-950 via-slate-900/80 to-purple-950/70" />
          </div>

          <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
            <div className="space-y-2 max-w-2xl">
              <span className="text-xs uppercase font-extrabold px-3 py-1 rounded-full bg-purple-500/30 text-purple-300 border border-purple-400/40 backdrop-blur-md">
                Circuito Seleccionado
              </span>
              <h2 className="font-serif text-2xl sm:text-4xl font-bold text-white leading-tight">
                {selectedCircuit.title}
              </h2>
              <p className="text-xs sm:text-sm text-slate-200 leading-relaxed">
                {selectedCircuit.vibe}
              </p>
            </div>

            <div className="flex items-center gap-3 shrink-0">
              <button
                onClick={() => setIsPlayingAudio(!isPlayingAudio)}
                className={`py-3 px-5 rounded-2xl font-bold text-xs uppercase tracking-wider flex items-center gap-2 transition-all shadow-md ${
                  isPlayingAudio 
                    ? 'bg-pink-600 text-white animate-pulse' 
                    : 'bg-white/20 hover:bg-white/30 text-white border border-white/30 backdrop-blur-md'
                }`}
              >
                <Radio className="w-4 h-4" />
                <span>{isPlayingAudio ? 'Reproduciendo Audio-Guía' : 'Escuchar Audio-Guía'}</span>
              </button>
            </div>
          </div>
        </div>

        {/* Spots Grid */}
        <div className="p-6 sm:p-10">
          <div className="flex items-center justify-between mb-6">
            <div>
              <span className="text-xs uppercase font-bold text-purple-800 tracking-wider">Paradas Imperdibles de la Ruta</span>
              <h3 className="font-serif text-2xl font-bold text-slate-900">
                Puntos de Interés Cultural & Gastronómico
              </h3>
            </div>
            <span className="text-xs font-bold text-slate-500">
              {selectedCircuit.spots.length} Paradas Curadas
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {selectedCircuit.spots.map((spot, idx) => (
              <div
                key={idx}
                className="p-6 rounded-2xl bg-[#faf9f6] border border-slate-200/80 hover:border-purple-400 hover:bg-white shadow-sm hover:shadow-lg transition-all duration-300 flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-start justify-between gap-3 mb-2">
                    <span className="text-[10px] uppercase font-bold px-2.5 py-0.5 rounded-md bg-purple-100 text-purple-900 border border-purple-200">
                      {spot.type}
                    </span>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-100 text-amber-900 border border-amber-200">
                      {spot.badge}
                    </span>
                  </div>

                  <h4 className="font-serif font-bold text-lg text-slate-900 mt-1">
                    {spot.name}
                  </h4>

                  {spot.artist && (
                    <p className="text-xs font-semibold text-purple-700 mt-0.5 flex items-center gap-1">
                      <Palette className="w-3.5 h-3.5" />
                      <span>Artista: {spot.artist}</span>
                    </p>
                  )}

                  <p className="text-xs text-slate-500 flex items-center gap-1 mt-1 mb-3">
                    <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                    <span>{spot.address}</span>
                  </p>

                  <p className="text-xs sm:text-sm text-slate-700 leading-relaxed bg-white p-3 rounded-xl border border-slate-100">
                    {spot.highlight}
                  </p>
                </div>

                <div className="mt-4 pt-3 border-t border-slate-200/60 flex items-center justify-between text-xs">
                  <span className="font-bold text-purple-900 flex items-center gap-1">
                    <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                    Experiencia Oficial
                  </span>
                  <button
                    onClick={() => {
                      if (onQuickSearch) onQuickSearch(spot.name.split(' ')[0]);
                      setActiveTab('guide');
                    }}
                    className="text-xs font-bold text-amber-800 hover:text-amber-900 hover:underline flex items-center gap-1"
                  >
                    <span>Ver Gastronomía Cercana</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Practical Tips Box */}
          <div className="mt-8 p-6 rounded-2xl bg-amber-50/80 border border-amber-200/80">
            <h4 className="font-serif font-bold text-sm text-amber-950 flex items-center gap-2 mb-2">
              <Info className="w-4 h-4 text-amber-700" />
              Recomendaciones para el Recorrido:
            </h4>
            <ul className="space-y-1.5 text-xs text-amber-900">
              {selectedCircuit.tips.map((tip, i) => (
                <li key={i} className="flex items-start gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-amber-600 mt-1 shrink-0" />
                  <span>{tip}</span>
                </li>
              ))}
            </ul>
          </div>

        </div>

      </div>

      {/* Urban Culture Callout */}
      <div className="rounded-3xl bg-gradient-to-r from-amber-600 via-terracotta to-purple-800 p-8 sm:p-10 text-white shadow-xl flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="space-y-2">
          <span className="text-xs uppercase font-extrabold px-3 py-1 rounded-full bg-white/20 text-white border border-white/30">
            Muralistas & Creadores Urbanos
          </span>
          <h3 className="font-serif text-2xl sm:text-3xl font-bold text-white">
            ¿Eres Artista Urbano, Food Trucker o Músico en Mérida?
          </h3>
          <p className="text-xs sm:text-sm text-white/90 max-w-2xl">
            Súmate al catálogo oficial de intervenciones del Distrito Cultural. La Cámara Gastronómica financia muros para artistas y autorizaciones especiales para pop-ups culinarios.
          </p>
        </div>
        <button
          onClick={() => {
            setActiveTab('affiliates');
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
          className="py-3.5 px-6 rounded-2xl bg-white text-slate-950 hover:bg-slate-100 font-bold text-xs uppercase tracking-wider shadow-lg shrink-0 transition-all"
        >
          Postular Proyecto al Distrito
        </button>
      </div>

    </div>
  );
}
