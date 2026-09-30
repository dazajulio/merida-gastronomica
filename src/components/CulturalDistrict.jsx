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
  Image as ImageIcon,
  Users,
  Calendar,
  ShoppingBag,
  Heart,
  Send,
  Download,
  Play,
  X,
  Phone,
  Mail,
  Instagram,
  MessageCircle,
  Share2,
  Building,
  Theater,
  Layers
} from 'lucide-react';
import { CULTURAL_DISTRICT_DATA } from '../data/culturalDistrictData';

export function CulturalDistrict({ t, setActiveTab, onQuickSearch }) {
  const [activeFilter, setActiveFilter] = useState('all');
  const [selectedSpaceModal, setSelectedSpaceModal] = useState(null);
  const [selectedHostModal, setSelectedHostModal] = useState(null);
  const [selectedEventModal, setSelectedEventModal] = useState(null);

  const { hero, spectrum, spaces, circuits, agenda, openCall, hosts, shopLocal, contact } = CULTURAL_DISTRICT_DATA;

  // Filter Spaces
  const filteredSpaces = spaces.filter(space => {
    if (activeFilter === 'all') return true;
    if (activeFilter === 'museo') return space.type.toLowerCase().includes('museo');
    if (activeFilter === 'plaza') return space.type.toLowerCase().includes('plaza');
    if (activeFilter === 'teatro') return space.type.toLowerCase().includes('teatro') || space.type.toLowerCase().includes('centro cultural');
    return true;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 selection:bg-amber-500 selection:text-white">
      
      {/* =========================================================================
          HERO BANNER (Fusión Centro Histórico + Video & Identidad Oficial)
          ========================================================================= */}
      <div className="relative rounded-3xl p-8 sm:p-14 text-white shadow-2xl overflow-hidden mb-12 border border-orange-900/40 bg-slate-950">
        
        {/* Background Visual Texture / Gradient */}
        <div className="absolute inset-0 z-0 opacity-40">
          <img 
            src="https://images.unsplash.com/photo-1539650116574-75c0c6d73f6e?w=1600&auto=format&fit=crop&q=80" 
            alt="Mérida Centro Histórico" 
            className="w-full h-full object-cover object-center filter saturate-150 brightness-[0.4]"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-slate-950 via-slate-950/90 to-orange-950/70" />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-transparent" />
        </div>
        
        <div className="absolute -right-20 -top-20 w-96 h-96 bg-orange-600/25 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute left-1/3 bottom-0 w-80 h-80 bg-amber-500/15 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 max-w-4xl">
          
          {/* Official Location Badge */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-orange-500/20 border border-orange-400/40 text-orange-300 text-xs font-bold mb-5 backdrop-blur-md font-sans">
            <MapPin className="w-3.5 h-3.5 text-orange-400" />
            <span className="uppercase tracking-widest">{hero.locationBadge}</span>
          </div>

          <h1 className="font-serif text-3xl sm:text-5xl lg:text-6xl font-black tracking-tight text-white leading-tight">
            Distrito Cultural y Creativo <span className="text-orange-500 font-serif">Mérida</span>
          </h1>

          <p className="mt-4 text-slate-200 text-sm sm:text-lg leading-relaxed font-sans max-w-3xl">
            {hero.subtitle}
          </p>

          {/* Key Indicators */}
          <div className="mt-8 flex flex-wrap items-center gap-3 font-sans">
            <a 
              href="#circuitos"
              className="py-3 px-5 rounded-2xl bg-orange-600 hover:bg-orange-700 text-white text-xs font-bold uppercase tracking-wider shadow-lg transition-all flex items-center gap-2 active:scale-98"
            >
              <Compass className="w-4 h-4" />
              <span>Descubre los Circuitos</span>
            </a>

            <a 
              href="#agenda"
              className="py-3 px-5 rounded-2xl bg-white/10 hover:bg-white/20 border border-white/25 text-white text-xs font-bold uppercase tracking-wider backdrop-blur-md transition-all flex items-center gap-2"
            >
              <Calendar className="w-4 h-4 text-amber-400" />
              <span>Agenda del Mes</span>
            </a>

            <a 
              href="#shoplocal"
              className="py-3 px-5 rounded-2xl bg-white/10 hover:bg-white/20 border border-white/25 text-white text-xs font-bold uppercase tracking-wider backdrop-blur-md transition-all flex items-center gap-2"
            >
              <ShoppingBag className="w-4 h-4 text-orange-400" />
              <span>Shop Local</span>
            </a>
          </div>

        </div>
      </div>

      {/* =========================================================================
          SECTION 1: EL ESPECTRO CULTURAL (Arte, Patrimonio y Comunidad)
          ========================================================================= */}
      <div id="espectro" className="mb-16 scroll-mt-24">
        <div className="max-w-3xl mb-8">
          <span className="text-xs uppercase font-extrabold text-orange-800 tracking-widest block mb-1 font-sans">
            {spectrum.title}
          </span>
          <h2 className="font-serif text-2xl sm:text-4xl font-bold text-slate-900 leading-tight">
            Una ciudad que se lee en capas: <span className="text-orange-600">Arte, Cultura y Patrimonio</span>
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 mt-2 font-sans leading-relaxed">
            {spectrum.description}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {spectrum.pillars.map((pillar) => {
            const IconComponent = pillar.id === 'arte-vivo' ? Palette : pillar.id === 'patrimonio' ? Landmark : Users;
            return (
              <div 
                key={pillar.id}
                className="p-7 rounded-3xl bg-white border border-slate-200 shadow-sm hover:shadow-xl hover:border-orange-300 transition-all duration-300 flex flex-col justify-between group"
              >
                <div>
                  <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${pillar.color} text-white flex items-center justify-center shadow-lg mb-5 group-hover:scale-105 transition-transform`}>
                    <IconComponent className="w-7 h-7" />
                  </div>

                  <span className="text-[10px] uppercase font-extrabold tracking-wider px-2.5 py-0.5 rounded-full bg-orange-50 text-orange-900 border border-orange-200 font-sans">
                    {pillar.tag}
                  </span>

                  <h3 className="font-serif font-bold text-xl text-slate-900 mt-2.5">
                    {pillar.title}
                  </h3>

                  <p className="text-xs sm:text-sm text-slate-600 mt-2 leading-relaxed font-sans">
                    {pillar.description}
                  </p>
                </div>

                <div className="mt-6 pt-4 border-t border-slate-100 flex items-center text-xs font-bold text-orange-800 font-sans">
                  <span>Espacio de Co-creación Activa</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* =========================================================================
          SECTION 2: NUESTROS ESPACIOS PATRIMONIALES & MUSEOS
          ========================================================================= */}
      <div id="espacios" className="mb-16 scroll-mt-24">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
          <div>
            <span className="text-xs uppercase font-extrabold text-orange-800 tracking-widest block mb-1 font-sans">
              Patrimonio Inmueble & Museos
            </span>
            <h2 className="font-serif text-2xl sm:text-4xl font-bold text-slate-900">
              Nuestros Espacios Culturales
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 font-sans mt-1">
              Museos, galerías, casonas coloniales y plazas históricas repartidas por el casco central de Mérida.
            </p>
          </div>

          {/* Filter Chips */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 font-sans">
            {[
              { id: 'all', label: 'Todos los Espacios' },
              { id: 'museo', label: 'Museos' },
              { id: 'plaza', label: 'Plazas Históricas' },
              { id: 'teatro', label: 'Teatros & Centros' }
            ].map(f => (
              <button
                key={f.id}
                onClick={() => setActiveFilter(f.id)}
                className={`py-1.5 px-3.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all border ${
                  activeFilter === f.id
                    ? 'bg-orange-600 text-white border-orange-600 shadow-sm'
                    : 'bg-white text-slate-600 border-slate-200 hover:border-slate-300'
                }`}
              >
                {f.label}
              </button>
            ))}
          </div>
        </div>

        {/* Spaces Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {filteredSpaces.map((space) => (
            <div 
              key={space.id}
              onClick={() => setSelectedSpaceModal(space)}
              className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-sm hover:shadow-xl hover:border-orange-400 transition-all duration-300 cursor-pointer flex flex-col justify-between group"
            >
              <div>
                <div className="relative h-48 overflow-hidden bg-slate-900">
                  <img 
                    src={space.imageUrl} 
                    alt={space.name} 
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute top-3 left-3">
                    <span className="text-[10px] uppercase font-extrabold px-2.5 py-1 rounded-full bg-black/60 text-white backdrop-blur-md border border-white/20 font-sans">
                      {space.type}
                    </span>
                  </div>
                  <div className="absolute bottom-3 right-3">
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-orange-600 text-white font-sans">
                      {space.badge}
                    </span>
                  </div>
                </div>

                <div className="p-5">
                  <h3 className="font-serif font-bold text-base text-slate-900 group-hover:text-orange-900 transition-colors leading-snug">
                    {space.name}
                  </h3>

                  <p className="text-[11px] text-slate-500 flex items-center gap-1 mt-1 font-sans">
                    <MapPin className="w-3.5 h-3.5 text-orange-600 shrink-0" />
                    <span className="truncate">{space.location}</span>
                  </p>

                  <p className="text-xs text-slate-600 mt-2.5 line-clamp-3 leading-relaxed font-sans">
                    {space.description}
                  </p>
                </div>
              </div>

              <div className="p-5 pt-0">
                <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs font-bold text-orange-800 font-sans">
                  <span>Ver Ficha del Espacio</span>
                  <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* =========================================================================
          SECTION 3: CIRCUITOS CULTURALES (Free Tours, Walking Tours, Casas Creativas)
          ========================================================================= */}
      <div id="circuitos" className="mb-16 scroll-mt-24">
        <div className="max-w-3xl mb-8">
          <span className="text-xs uppercase font-extrabold text-orange-800 tracking-widest block mb-1 font-sans">
            Experiencias Peatonales
          </span>
          <h2 className="font-serif text-2xl sm:text-4xl font-bold text-slate-900">
            Circuitos Culturales
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 font-sans mt-1">
            Recorridos diseñados para vivir la historia, la arquitectura, los murales y los talleres de oficio en primera persona.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {circuits.map((circ) => {
            const Icon = circ.id === 'free-tours' ? Footprints : circ.id === 'walking-tours' ? Compass : Palette;
            return (
              <div 
                key={circ.id}
                className="p-7 rounded-3xl bg-white border border-slate-200 shadow-sm hover:shadow-xl hover:border-orange-400 transition-all duration-300 flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-12 h-12 rounded-2xl bg-orange-100 text-orange-800 flex items-center justify-center border border-orange-200">
                      <Icon className="w-6 h-6" />
                    </div>
                    <span className="text-[10px] font-extrabold uppercase px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-700 font-sans">
                      {circ.category}
                    </span>
                  </div>

                  <h3 className="font-serif font-bold text-xl text-slate-900 leading-snug">
                    {circ.title}
                  </h3>

                  <p className="text-xs sm:text-sm text-slate-600 mt-2.5 leading-relaxed font-sans">
                    {circ.description}
                  </p>

                  <div className="mt-5 space-y-1.5 text-xs text-slate-500 font-sans bg-slate-50 p-3 rounded-xl border border-slate-100">
                    <div className="flex items-center justify-between">
                      <span className="font-medium">Distancia Peatonal:</span>
                      <strong className="text-slate-900">{circ.distance}</strong>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="font-medium">Duración Estimada:</span>
                      <strong className="text-slate-900">{circ.timeEst}</strong>
                    </div>
                  </div>
                </div>

                <div className="mt-6 pt-4 border-t border-slate-100">
                  <a
                    href={`${contact.whatsapp}&text=Hola%2C%20deseo%20información%20y%20reservar%20el%20circuito%3A%20${encodeURIComponent(circ.title)}`}
                    target="_blank"
                    rel="noreferrer"
                    className="w-full py-2.5 px-4 rounded-xl bg-slate-900 hover:bg-orange-600 text-white font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 transition-all font-sans"
                  >
                    <MessageCircle className="w-3.5 h-3.5 text-emerald-400" />
                    <span>Consultar Fechas & Salidas</span>
                  </a>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* =========================================================================
          SECTION 4: ESTE MES EN EL DISTRITO — AGENDA CULTURAL & CONVOCATORIA
          ========================================================================= */}
      <div id="agenda" className="mb-16 scroll-mt-24">
        <div className="max-w-3xl mb-8">
          <span className="text-xs uppercase font-extrabold text-orange-800 tracking-widest block mb-1 font-sans">
            Este Mes en el Distrito
          </span>
          <h2 className="font-serif text-2xl sm:text-4xl font-bold text-slate-900">
            Agenda Cultural
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 font-sans mt-1">
            Exposiciones fotográficas, conciertos de gala, cine documental y muestras de artes gráficas en los Andes.
          </p>
        </div>

        {/* Agenda Events Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
          {agenda.map((ev) => (
            <div 
              key={ev.id}
              onClick={() => setSelectedEventModal(ev)}
              className="p-6 rounded-3xl bg-white border border-slate-200 shadow-sm hover:shadow-xl hover:border-orange-400 transition-all duration-300 flex flex-col justify-between cursor-pointer group"
            >
              <div>
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl bg-orange-600 text-white text-xs font-black uppercase tracking-wider mb-4 shadow-sm font-sans">
                  <Calendar className="w-3.5 h-3.5" />
                  <span>{ev.dateBadge}</span>
                </div>

                <span className="text-[10px] uppercase font-bold text-slate-400 block mb-1 font-sans">
                  {ev.category}
                </span>

                <h3 className="font-serif font-bold text-lg text-slate-900 group-hover:text-orange-900 transition-colors leading-snug">
                  {ev.title}
                </h3>

                <p className="text-xs text-slate-600 mt-2 line-clamp-3 leading-relaxed font-sans">
                  {ev.description}
                </p>
              </div>

              <div className="mt-5 pt-3 border-t border-slate-100 text-xs font-medium text-slate-500 font-sans space-y-1">
                <div className="flex items-center gap-1.5 text-orange-800 font-bold">
                  <MapPin className="w-3.5 h-3.5 shrink-0" />
                  <span className="truncate">{ev.location}</span>
                </div>
                <div className="flex items-center gap-1.5 text-slate-400 text-[11px]">
                  <Clock className="w-3.5 h-3.5 shrink-0" />
                  <span>{ev.time}</span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Convocatoria Abierta Box */}
        <div className="rounded-3xl bg-gradient-to-r from-slate-950 via-slate-900 to-orange-950 p-8 sm:p-10 text-white shadow-xl flex flex-col md:flex-row items-center justify-between gap-6 border border-orange-900/40">
          <div className="space-y-2">
            <span className="text-[10px] uppercase font-extrabold px-3 py-1 rounded-full bg-orange-500/20 text-orange-300 border border-orange-500/40 font-sans">
              {openCall.subtitle}
            </span>
            <h3 className="font-serif text-2xl sm:text-3xl font-bold text-white">
              {openCall.title}
            </h3>
            <p className="text-xs sm:text-sm text-slate-300 max-w-2xl font-sans leading-relaxed">
              {openCall.description}
            </p>
          </div>

          <a
            href={openCall.guidePdfUrl}
            target="_blank"
            rel="noreferrer"
            className="py-3.5 px-6 rounded-2xl bg-orange-500 hover:bg-orange-600 text-slate-950 font-bold text-xs uppercase tracking-wider shadow-lg shrink-0 flex items-center gap-2 transition-all font-sans active:scale-98"
          >
            <Download className="w-4 h-4 text-slate-950" />
            <span>Descargar Guía de Requisitos (PDF)</span>
          </a>
        </div>
      </div>

      {/* =========================================================================
          SECTION 5: ANFITRIONES DEL PATRIMONIO (Guías & Especialistas Reales)
          ========================================================================= */}
      <div id="anfitriones" className="mb-16 scroll-mt-24">
        <div className="max-w-3xl mb-8">
          <span className="text-xs uppercase font-extrabold text-orange-800 tracking-widest block mb-1 font-sans">
            Guías del Patrimonio
          </span>
          <h2 className="font-serif text-2xl sm:text-4xl font-bold text-slate-900">
            Anfitriones del Patrimonio
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 font-sans mt-1">
            Personas que conocen cada esquina del distrito y traducen su historia en experiencias vivas.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {hosts.map((host) => (
            <div 
              key={host.id}
              onClick={() => setSelectedHostModal(host)}
              className="bg-white rounded-3xl border border-slate-200 p-6 shadow-sm hover:shadow-xl hover:border-orange-400 transition-all duration-300 flex flex-col justify-between cursor-pointer group"
            >
              <div>
                <div className="w-20 h-20 rounded-2xl overflow-hidden bg-slate-100 mb-4 mx-auto border-2 border-orange-200 group-hover:border-orange-500 transition-colors shadow-sm">
                  <img 
                    src={host.avatarUrl} 
                    alt={host.name} 
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                  />
                </div>

                <div className="text-center">
                  <h3 className="font-serif font-bold text-lg text-slate-900 group-hover:text-orange-900 transition-colors">
                    {host.name}
                  </h3>
                  <span className="text-[11px] font-bold text-orange-800 block mt-0.5 font-sans">
                    {host.role}
                  </span>
                  <p className="text-xs text-slate-600 mt-2.5 font-sans leading-relaxed line-clamp-3">
                    {host.specialty}
                  </p>
                </div>
              </div>

              <div className="mt-5 pt-3 border-t border-slate-100 text-center">
                <span className="text-xs font-bold text-orange-700 hover:text-orange-900 font-sans">
                  Ver Perfil & Especialidad &rarr;
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* =========================================================================
          SECTION 6: HECHO EN EL DISTRITO — "SHOP LOCAL"
          ========================================================================= */}
      <div id="shoplocal" className="mb-16 scroll-mt-24">
        
        {/* Intro Banner */}
        <div className="bg-gradient-to-br from-amber-50 to-orange-50/60 rounded-3xl border border-amber-200 p-8 sm:p-12 mb-10 shadow-sm">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            
            <div className="lg:col-span-7 space-y-4">
              <span className="text-xs uppercase font-extrabold text-orange-800 tracking-widest font-sans block">
                {shopLocal.title}
              </span>
              <h2 className="font-serif text-3xl sm:text-4xl font-black text-slate-900">
                {shopLocal.headline}
              </h2>
              <p className="text-xs sm:text-sm text-slate-700 leading-relaxed font-sans">
                {shopLocal.intro}
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2 font-sans">
                {shopLocal.reasons.map((r, i) => (
                  <div key={i} className="p-3.5 rounded-2xl bg-white border border-amber-200/80 shadow-xs">
                    <strong className="text-xs text-orange-900 block">{r.title}</strong>
                    <span className="text-[11px] text-slate-600 leading-tight block mt-1">{r.desc}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Embedded Official YouTube Video */}
            <div className="lg:col-span-5">
              <div className="relative rounded-2xl overflow-hidden shadow-2xl border-4 border-white aspect-[4/3] bg-slate-900">
                <iframe 
                  className="w-full h-full"
                  src={shopLocal.videoEmbedUrl} 
                  title="Shop Local en Mérida Venezuela" 
                  frameBorder="0" 
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" 
                  referrerPolicy="strict-origin-when-cross-origin" 
                  allowFullScreen
                />
              </div>
            </div>

          </div>
        </div>

        {/* Real Stores List */}
        <div>
          <div className="flex items-center justify-between mb-6">
            <div>
              <span className="text-xs uppercase font-bold text-orange-800 tracking-wider font-sans">Comercios Agremiados & Creativos</span>
              <h3 className="font-serif text-2xl font-bold text-slate-900">
                Tiendas Emblemáticas del Distrito
              </h3>
            </div>
            <span className="text-xs font-bold text-slate-500 font-sans hidden sm:inline">
              3 Puntos de Tradición
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {shopLocal.stores.map((store) => (
              <div 
                key={store.id}
                className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-sm hover:shadow-xl hover:border-orange-400 transition-all duration-300 flex flex-col justify-between group"
              >
                <div>
                  <div className="relative h-48 overflow-hidden bg-slate-900">
                    <img 
                      src={store.imageUrl} 
                      alt={store.name} 
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute top-3 left-3">
                      <span className="text-[10px] uppercase font-bold px-2.5 py-0.5 rounded-full bg-black/60 text-white backdrop-blur-md font-sans">
                        {store.category}
                      </span>
                    </div>
                  </div>

                  <div className="p-6">
                    <h4 className="font-serif font-bold text-lg text-slate-900 group-hover:text-orange-900 transition-colors">
                      {store.name}
                    </h4>

                    <p className="text-xs text-slate-600 mt-2 leading-relaxed font-sans">
                      {store.description}
                    </p>

                    <p className="text-[11px] text-slate-500 flex items-start gap-1.5 mt-4 p-2.5 rounded-xl bg-slate-50 border border-slate-100 font-sans">
                      <MapPin className="w-3.5 h-3.5 text-orange-600 shrink-0 mt-0.5" />
                      <span>{store.address}</span>
                    </p>
                  </div>
                </div>

                <div className="p-6 pt-0">
                  <button
                    onClick={() => {
                      if (onQuickSearch) onQuickSearch(store.name.split(' ')[0]);
                      setActiveTab('guide');
                    }}
                    className="w-full py-2.5 px-4 rounded-xl bg-orange-50 hover:bg-orange-100 text-orange-900 font-bold text-xs flex items-center justify-center gap-1.5 border border-orange-200 transition-all font-sans"
                  >
                    <span>Ver Gastronomía & Café Alrededor</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>

      {/* =========================================================================
          SECTION 7: CONTACTO DIRECTO & INTEGRACIÓN GREMIAL
          ========================================================================= */}
      <div className="rounded-3xl bg-gradient-to-br from-slate-950 via-slate-900 to-indigo-950 p-8 sm:p-12 text-white shadow-2xl flex flex-col md:flex-row items-center justify-between gap-8 border border-indigo-900/40">
        <div className="space-y-3 max-w-2xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-orange-500/20 text-orange-300 border border-orange-500/40 text-xs font-bold font-sans">
            <Heart className="w-3.5 h-3.5 text-orange-400" />
            <span>Alianza Cultural & Gastronómica</span>
          </div>
          <h3 className="font-serif text-2xl sm:text-3xl font-bold text-white">
            ¿Deseas sumarte o proponer una actividad cultural en Mérida?
          </h3>
          <p className="text-xs sm:text-sm text-slate-300 font-sans leading-relaxed">
            La Cámara Gastronómica del Estado Mérida articula el sector de hospitalidad, restaurantes y cafeterías con los artistas, historiadores y guías patrimoniales del distrito.
          </p>
          
          <div className="flex flex-wrap items-center gap-4 pt-2 text-xs font-sans text-slate-300">
            <a href={`mailto:${contact.email}`} className="flex items-center gap-1.5 hover:text-white underline">
              <Mail className="w-4 h-4 text-orange-400" />
              <span>{contact.email}</span>
            </a>
            <a href={contact.instagram} target="_blank" rel="noreferrer" className="flex items-center gap-1.5 hover:text-white underline">
              <Instagram className="w-4 h-4 text-pink-400" />
              <span>{contact.instagramHandle}</span>
            </a>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 shrink-0 w-full md:w-auto font-sans">
          <a
            href={contact.whatsapp}
            target="_blank"
            rel="noreferrer"
            className="py-3.5 px-6 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs uppercase tracking-wider shadow-lg flex items-center justify-center gap-2 transition-all active:scale-98 text-center"
          >
            <MessageCircle className="w-4 h-4" />
            <span>Escribir por WhatsApp</span>
          </a>

          <button
            onClick={() => {
              setActiveTab('affiliates');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            className="py-3.5 px-6 rounded-2xl bg-orange-500 hover:bg-orange-600 text-slate-950 font-bold text-xs uppercase tracking-wider shadow-lg flex items-center justify-center gap-2 transition-all active:scale-98 text-center"
          >
            <Sparkles className="w-4 h-4 text-slate-950" />
            <span>Afiliar mi Espacio</span>
          </button>
        </div>
      </div>

      {/* =========================================================================
          MODAL 1: DETALLES DE ESPACIO PATRIMONIAL
          ========================================================================= */}
      {selectedSpaceModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto animate-fadeIn">
          <div className="bg-white rounded-3xl max-w-lg w-full overflow-hidden shadow-2xl relative my-8">
            <div className="relative h-56 bg-slate-900">
              <img 
                src={selectedSpaceModal.imageUrl} 
                alt={selectedSpaceModal.name} 
                className="w-full h-full object-cover"
              />
              <button
                onClick={() => setSelectedSpaceModal(null)}
                className="absolute top-4 right-4 p-2 rounded-full bg-black/60 hover:bg-black/80 text-white backdrop-blur-md transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
              <div className="absolute bottom-4 left-4">
                <span className="text-[10px] uppercase font-bold px-2.5 py-1 rounded-full bg-orange-600 text-white font-sans">
                  {selectedSpaceModal.type}
                </span>
              </div>
            </div>

            <div className="p-6 sm:p-8 space-y-4">
              <h3 className="font-serif text-2xl font-bold text-slate-900">
                {selectedSpaceModal.name}
              </h3>

              <p className="text-xs text-slate-500 flex items-center gap-1.5 font-sans">
                <MapPin className="w-4 h-4 text-orange-600 shrink-0" />
                <span>{selectedSpaceModal.location}</span>
              </p>

              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 text-xs sm:text-sm text-slate-700 leading-relaxed font-sans">
                {selectedSpaceModal.description}
              </div>

              <div className="pt-2 flex items-center justify-end gap-3 font-sans">
                <button
                  onClick={() => setSelectedSpaceModal(null)}
                  className="py-2.5 px-4 rounded-xl border border-slate-300 text-slate-700 font-bold text-xs"
                >
                  Cerrar
                </button>
                <a
                  href={`${contact.whatsapp}&text=Hola%2C%20deseo%20visitar%20el%20espacio%20${encodeURIComponent(selectedSpaceModal.name)}`}
                  target="_blank"
                  rel="noreferrer"
                  className="py-2.5 px-5 rounded-xl bg-orange-600 hover:bg-orange-700 text-white font-bold text-xs uppercase tracking-wider flex items-center gap-2 shadow-md"
                >
                  <MessageCircle className="w-4 h-4" />
                  <span>Consultar Visita Guiada</span>
                </a>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* =========================================================================
          MODAL 2: PERFIL DE ANFITRIÓN
          ========================================================================= */}
      {selectedHostModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto animate-fadeIn">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 sm:p-8 shadow-2xl relative my-8">
            <button
              onClick={() => setSelectedHostModal(null)}
              className="absolute top-5 right-5 p-2 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-600 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-4 mb-4">
              <div className="w-16 h-16 rounded-2xl overflow-hidden bg-slate-100 border-2 border-orange-300 shadow-sm shrink-0">
                <img 
                  src={selectedHostModal.avatarUrl} 
                  alt={selectedHostModal.name} 
                  className="w-full h-full object-cover"
                />
              </div>
              <div>
                <h3 className="font-serif text-xl font-bold text-slate-900">
                  {selectedHostModal.name}
                </h3>
                <span className="text-xs font-bold text-orange-800 font-sans block">
                  {selectedHostModal.role}
                </span>
              </div>
            </div>

            <div className="space-y-3 font-sans text-xs text-slate-700">
              <div className="p-3.5 rounded-2xl bg-orange-50 border border-orange-200">
                <strong className="block text-orange-950 mb-1">Especialidad de Guiatura:</strong>
                <span>{selectedHostModal.specialty}</span>
              </div>

              <p className="leading-relaxed">
                {selectedHostModal.description}
              </p>
            </div>

            <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-end gap-3 font-sans">
              <button
                onClick={() => setSelectedHostModal(null)}
                className="py-2.5 px-4 rounded-xl border border-slate-300 text-slate-700 font-bold text-xs"
              >
                Cerrar
              </button>
              <a
                href={`${contact.whatsapp}&text=Hola%2C%20deseo%20contactar%20al%20gu%C3%ADa%20patrimonial%20${encodeURIComponent(selectedHostModal.name)}`}
                target="_blank"
                rel="noreferrer"
                className="py-2.5 px-5 rounded-xl bg-orange-600 hover:bg-orange-700 text-white font-bold text-xs uppercase tracking-wider flex items-center gap-2 shadow-md"
              >
                <MessageCircle className="w-4 h-4" />
                <span>Contactar Guía</span>
              </a>
            </div>
          </div>
        </div>
      )}

      {/* =========================================================================
          MODAL 3: DETALLE DE EVENTO DE AGENDA
          ========================================================================= */}
      {selectedEventModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto animate-fadeIn">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 sm:p-8 shadow-2xl relative my-8 font-sans">
            <button
              onClick={() => setSelectedEventModal(null)}
              className="absolute top-5 right-5 p-2 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-600 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            <span className="text-xs uppercase font-extrabold px-2.5 py-1 rounded-md bg-orange-100 text-orange-900 border border-orange-200">
              {selectedEventModal.category}
            </span>

            <h3 className="font-serif text-2xl font-bold text-slate-900 mt-2 leading-snug">
              {selectedEventModal.title}
            </h3>

            <div className="my-4 p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2 text-xs text-slate-700">
              <div className="flex items-center gap-2 text-orange-800 font-bold">
                <Calendar className="w-4 h-4 text-orange-600" />
                <span>Fecha: {selectedEventModal.dateBadge}</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-slate-500" />
                <span>Hora: {selectedEventModal.time}</span>
              </div>
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-slate-500" />
                <span>Lugar: {selectedEventModal.location}</span>
              </div>
            </div>

            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
              {selectedEventModal.description}
            </p>

            <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-end gap-3">
              <button
                onClick={() => setSelectedEventModal(null)}
                className="py-2.5 px-4 rounded-xl border border-slate-300 text-slate-700 font-bold text-xs"
              >
                Cerrar
              </button>
              <a
                href={`${contact.whatsapp}&text=Hola%2C%20deseo%20asistir%20al%20evento%20${encodeURIComponent(selectedEventModal.title)}`}
                target="_blank"
                rel="noreferrer"
                className="py-2.5 px-5 rounded-xl bg-orange-600 hover:bg-orange-700 text-white font-bold text-xs uppercase tracking-wider flex items-center gap-2 shadow-md"
              >
                <MessageCircle className="w-4 h-4" />
                <span>Confirmar Asistencia</span>
              </a>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
