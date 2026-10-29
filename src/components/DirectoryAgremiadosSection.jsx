import React, { useState, useMemo } from 'react';
import { 
  Search, 
  MapPin, 
  ShieldCheck, 
  Star, 
  Sparkles, 
  Utensils, 
  Coffee, 
  Cake, 
  Factory, 
  GraduationCap, 
  Store, 
  ArrowRight, 
  SlidersHorizontal, 
  X, 
  CheckCircle2, 
  Building2, 
  ExternalLink,
  Award,
  Users
} from 'lucide-react';

export function DirectoryAgremiadosSection({ 
  restaurants = [], 
  onSelectRestaurant, 
  onViewOnMap, 
  t 
}) {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSector, setSelectedSector] = useState('all');
  const [selectedMunicipio, setSelectedMunicipio] = useState('all');
  const [onlySolvent, setOnlySolvent] = useState(false);

  // Sectores institucionales agrupados para visualización elegante (Mockup parte superior)
  const SECTOR_DEFINITIONS = [
    {
      id: 'all',
      name: 'Todos los Agremiados',
      icon: Building2,
      color: 'amber',
      matcher: () => true
    },
    {
      id: 'restaurantes',
      name: 'Restaurantes & Alta Cocina',
      icon: Utensils,
      color: 'orange',
      matcher: (r) => {
        const cat = (r.category || '').toLowerCase();
        return cat.includes('restaurante') || cat.includes('cocina') || cat.includes('bistro') || cat.includes('grill');
      }
    },
    {
      id: 'cafeterias',
      name: 'Cafeterías & Café de Altura',
      icon: Coffee,
      color: 'amber',
      matcher: (r) => {
        const cat = (r.category || '').toLowerCase();
        const name = (r.name || '').toLowerCase();
        return cat.includes('café') || cat.includes('cafe') || cat.includes('barista') || name.includes('caffe') || name.includes('cafe');
      }
    },
    {
      id: 'pasteleria',
      name: 'Pastelería & Repostería',
      icon: Cake,
      color: 'rose',
      matcher: (r) => {
        const cat = (r.category || '').toLowerCase();
        const name = (r.name || '').toLowerCase();
        return cat.includes('pastel') || cat.includes('repost') || cat.includes('torta') || cat.includes('panad') || name.includes('cake') || name.includes('merengue');
      }
    },
    {
      id: 'procesadoras',
      name: 'Procesadoras & Productores',
      icon: Factory,
      color: 'emerald',
      matcher: (r) => {
        const cat = (r.category || '').toLowerCase();
        const name = (r.name || '').toLowerCase();
        return cat.includes('procesadora') || cat.includes('productor') || cat.includes('comercializadora') || name.includes('comercializadora');
      }
    },
    {
      id: 'formacion_tech',
      name: 'Formación & FoodTech',
      icon: GraduationCap,
      color: 'sky',
      matcher: (r) => {
        const cat = (r.category || '').toLowerCase();
        const name = (r.name || '').toLowerCase();
        return cat.includes('instituto') || cat.includes('universitario') || cat.includes('contenido') || cat.includes('software') || name.includes('glubbi') || name.includes('iutcm');
      }
    },
    {
      id: 'emprendimientos',
      name: 'Emprendimientos & Tendencias',
      icon: Store,
      color: 'purple',
      matcher: (r) => {
        const cat = (r.category || '').toLowerCase();
        return cat.includes('emprendimiento') || cat.includes('candy') || cat.includes('marca personal');
      }
    }
  ];

  // Cálculo de totales dinámicos por sector
  const sectorCounts = useMemo(() => {
    const counts = {};
    SECTOR_DEFINITIONS.forEach(sec => {
      counts[sec.id] = (restaurants || []).filter(r => sec.matcher(r)).length;
    });
    return counts;
  }, [restaurants]);

  // Lista de municipios representados
  const municipios = useMemo(() => {
    const set = new Set();
    (restaurants || []).forEach(r => {
      const mun = r.municipio || (r.location && r.location.includes('Libertador') ? 'Libertador (Mérida Ciudad)' : 'Mérida');
      if (mun) set.add(mun);
    });
    return ['all', ...Array.from(set)];
  }, [restaurants]);

  // Filtrado reactivo de agremiados
  const filteredAgremiados = useMemo(() => {
    return (restaurants || []).filter(r => {
      // 1. Búsqueda por texto (nombre, código, especialidad, dirección, representante)
      if (searchTerm.trim()) {
        const q = searchTerm.toLowerCase().trim();
        const matchName = (r.name || '').toLowerCase().includes(q);
        const matchCode = (r.certificateNumber || r.codigo_afiliado || '').toLowerCase().includes(q);
        const matchCat = (r.category || '').toLowerCase().includes(q);
        const matchLoc = (r.location || '').toLowerCase().includes(q);
        const matchChef = (r.chef || r.legalRepresentative || '').toLowerCase().includes(q);
        if (!matchName && !matchCode && !matchCat && !matchLoc && !matchChef) {
          return false;
        }
      }

      // 2. Filtro de sector
      if (selectedSector !== 'all') {
        const secDef = SECTOR_DEFINITIONS.find(s => s.id === selectedSector);
        if (secDef && !secDef.matcher(r)) {
          return false;
        }
      }

      // 3. Filtro de municipio
      if (selectedMunicipio !== 'all') {
        const mun = r.municipio || (r.location && r.location.includes('Libertador') ? 'Libertador (Mérida Ciudad)' : 'Mérida');
        if (mun !== selectedMunicipio) {
          return false;
        }
      }

      // 4. Filtro de solvencia
      if (onlySolvent) {
        const isSolvent = (r.estado_solvencia || '').toLowerCase().includes('solvente') || 
                          r.isCertifiedByCamara === true;
        if (!isSolvent) return false;
      }

      return true;
    });
  }, [restaurants, searchTerm, selectedSector, selectedMunicipio, onlySolvent]);

  return (
    <div className="bg-[#fcfbf9] min-h-screen text-slate-800">
      
      {/* ============================================================== */}
      {/* 1. HERO HEADER INSTITUCIONAL                                   */}
      {/* ============================================================== */}
      <section className="relative pt-28 pb-16 overflow-hidden bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 text-white">
        <div className="absolute inset-0 z-0 opacity-20 pointer-events-none">
          <img 
            src="/images/merida_hero_gastronomica.jpg" 
            alt="Fondo Los Andes" 
            className="w-full h-full object-cover object-center"
          />
        </div>
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-black/60 pointer-events-none" />

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/40 text-xs font-bold uppercase tracking-wider mb-4 backdrop-blur-md shadow-sm">
            <ShieldCheck className="w-4 h-4 text-amber-400" />
            <span>Cámara Gastronómica del Estado Mérida &bull; Registro Oficial 2026</span>
          </div>

          <h1 className="font-serif text-3xl sm:text-5xl md:text-6xl font-black text-white uppercase tracking-tight leading-tight max-w-4xl mx-auto">
            Directorio Oficial de Agremiados
          </h1>

          <p className="font-sans text-sm sm:text-base md:text-lg text-slate-300 max-w-3xl mx-auto mt-4 leading-relaxed">
            Nómina pública de restaurantes, cafeterías de especialidad, bistrós, marcas y empresas productoras certificadas que integran el ecosistema culinario formal de Mérida.
          </p>

          {/* Quick Metrics */}
          <div className="mt-8 pt-6 border-t border-white/10 max-w-3xl mx-auto grid grid-cols-2 sm:grid-cols-3 gap-4">
            <div className="p-3 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-sm">
              <span className="font-serif font-black text-2xl sm:text-3xl text-amber-400 block">
                {restaurants.length || 17}
              </span>
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                Marcas Agremiadas
              </span>
            </div>
            <div className="p-3 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-sm">
              <span className="font-serif font-black text-2xl sm:text-3xl text-emerald-400 block">
                100%
              </span>
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                Formalidad Verificada
              </span>
            </div>
            <div className="col-span-2 sm:col-span-1 p-3 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-sm">
              <span className="font-serif font-black text-2xl sm:text-3xl text-sky-400 block">
                AAA
              </span>
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                Estándar Calidad CGEM
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* ============================================================== */}
      {/* 2. TOP SECTION: CATEGORÍAS POPULARES / SECTORES (Modelo Ejemplo)*/}
      {/* ============================================================== */}
      <section className="py-12 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-6">
        <div className="bg-white rounded-3xl border border-slate-200/90 p-6 sm:p-8 shadow-xl">
          
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6 pb-4 border-b border-slate-100">
            <div>
              <span className="text-xs font-bold uppercase tracking-widest text-amber-600 block">
                Sectores & Especialidades
              </span>
              <h2 className="font-serif text-xl sm:text-2xl font-black text-slate-900 uppercase tracking-tight mt-0.5">
                Categorías de los Agremiados
              </h2>
            </div>
            {selectedSector !== 'all' && (
              <button
                onClick={() => setSelectedSector('all')}
                className="text-xs font-bold text-amber-700 hover:text-amber-900 bg-amber-50 hover:bg-amber-100 px-3.5 py-1.5 rounded-xl border border-amber-200 transition-colors flex items-center gap-1.5"
              >
                <span>Mostrar Todas las Categorías</span>
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* Grid de botones de categorías inspirada en el modelo de ejemplo */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3.5">
            {SECTOR_DEFINITIONS.map((sector) => {
              const Icon = sector.icon;
              const count = sectorCounts[sector.id] || 0;
              const isSelected = selectedSector === sector.id;

              return (
                <button
                  key={sector.id}
                  onClick={() => {
                    setSelectedSector(sector.id);
                    // Desplazamiento suave al catálogo si se desea
                    const catEl = document.getElementById('catalogo-agremiados');
                    if (catEl) catEl.scrollIntoView({ behavior: 'smooth', block: 'start' });
                  }}
                  className={`flex items-center justify-between p-3.5 rounded-2xl border text-left transition-all duration-200 group ${
                    isSelected 
                      ? 'bg-amber-500 text-slate-950 border-amber-600 shadow-md font-bold' 
                      : 'bg-slate-50/70 hover:bg-white border-slate-200 hover:border-amber-400 hover:shadow-md text-slate-700'
                  }`}
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 transition-transform group-hover:scale-105 ${
                      isSelected 
                        ? 'bg-slate-950 text-amber-400' 
                        : 'bg-white text-slate-700 shadow-xs border border-slate-200/80 group-hover:text-amber-600'
                    }`}>
                      <Icon className="w-4 h-4" />
                    </div>
                    <span className="text-xs font-semibold truncate leading-tight">
                      {sector.name}
                    </span>
                  </div>

                  <span className={`text-[11px] font-bold px-2 py-0.5 rounded-full shrink-0 ml-2 ${
                    isSelected 
                      ? 'bg-slate-950/20 text-slate-950' 
                      : 'bg-slate-200/80 text-slate-600 group-hover:bg-amber-100 group-hover:text-amber-800'
                  }`}>
                    ( {count} )
                  </span>
                </button>
              );
            })}
          </div>

        </div>
      </section>

      {/* ============================================================== */}
      {/* 3. BARRA DE BÚSQUEDA Y FILTRADO (Explore Directory)             */}
      {/* ============================================================== */}
      <section id="catalogo-agremiados" className="pt-4 pb-8 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 scroll-mt-24">
        
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-6">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-amber-600 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Nómina Gremial Verificada</span>
            </span>
            <h2 className="font-serif text-2xl sm:text-3xl font-black text-slate-900 uppercase tracking-tight mt-1">
              Explorar Agremiados Oficiales
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 mt-1">
              Haz clic en cualquier establecimiento para abrir su <strong>Ficha Oficial de Negocio</strong>, consultar carta, fotos y canales directos.
            </p>
          </div>

          <div className="text-xs font-medium text-slate-600 shrink-0">
            Mostrando <strong className="text-slate-950 font-bold">{filteredAgremiados.length}</strong> de <strong className="text-slate-950 font-bold">{restaurants.length}</strong> miembros
          </div>
        </div>

        {/* Buscador y Controles */}
        <div className="bg-white rounded-2xl border border-slate-200/90 p-4 shadow-sm space-y-3">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-3 items-center">
            
            {/* Input de Búsqueda */}
            <div className="md:col-span-6 relative">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input 
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Buscar por nombre, código CGM, especialidad, dirección o propietario..."
                className="w-full pl-10 pr-10 py-2.5 rounded-xl border border-slate-200 bg-slate-50/50 hover:bg-white focus:bg-white text-xs sm:text-sm font-medium focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 transition-all text-slate-900"
              />
              {searchTerm && (
                <button
                  onClick={() => setSearchTerm('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-1 rounded-md"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>

            {/* Selector de Municipio */}
            <div className="md:col-span-3">
              <select
                value={selectedMunicipio}
                onChange={(e) => setSelectedMunicipio(e.target.value)}
                className="w-full py-2.5 px-3 rounded-xl border border-slate-200 bg-slate-50/50 hover:bg-white focus:bg-white text-xs font-semibold text-slate-700 focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 transition-all cursor-pointer"
              >
                <option value="all">📍 Todos los Municipios</option>
                {municipios.filter(m => m !== 'all').map(mun => (
                  <option key={mun} value={mun}>{mun}</option>
                ))}
              </select>
            </div>

            {/* Checkbox Solo Solventes Activos */}
            <div className="md:col-span-3 flex items-center justify-end">
              <label className="inline-flex items-center gap-2 cursor-pointer select-none text-xs font-bold text-slate-700 bg-slate-50 hover:bg-amber-50/50 px-3 py-2 rounded-xl border border-slate-200 transition-colors w-full sm:w-auto justify-center sm:justify-start">
                <input 
                  type="checkbox"
                  checked={onlySolvent}
                  onChange={(e) => setOnlySolvent(e.target.checked)}
                  className="rounded border-slate-300 text-amber-600 focus:ring-amber-500 w-3.5 h-3.5"
                />
                <span className="flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Solo Solventes Activos</span>
                </span>
              </label>
            </div>

          </div>
        </div>
      </section>

      {/* ============================================================== */}
      {/* 4. GRID DE TARJETAS DE AGREMIADOS (4 Columnas - Modelo Ejemplo) */}
      {/* ============================================================== */}
      <section className="pb-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {filteredAgremiados.length === 0 ? (
          <div className="text-center py-16 px-4 bg-white rounded-3xl border border-slate-200 shadow-sm max-w-xl mx-auto">
            <div className="w-16 h-16 rounded-2xl bg-amber-100 text-amber-700 flex items-center justify-center mx-auto mb-4">
              <Search className="w-8 h-8" />
            </div>
            <h3 className="font-serif font-black text-xl text-slate-900 uppercase">
              No se encontraron agremiados
            </h3>
            <p className="text-xs text-slate-600 mt-2 max-w-md mx-auto">
              No hay establecimientos que coincidan con los criterios de búsqueda o filtros seleccionados.
            </p>
            <button
              onClick={() => {
                setSearchTerm('');
                setSelectedSector('all');
                setSelectedMunicipio('all');
                setOnlySolvent(false);
              }}
              className="mt-5 py-2.5 px-5 rounded-xl bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold text-xs uppercase tracking-wider transition-colors shadow-sm"
            >
              Restablecer Todos los Filtros
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredAgremiados.map((restaurant) => {
              const code = restaurant.certificateNumber || restaurant.codigo_afiliado || 'CGM-2026';
              const isSolvent = (restaurant.estado_solvencia || '').toLowerCase().includes('solvente') || 
                                restaurant.isCertifiedByCamara === true;

              return (
                <div
                  key={restaurant.id}
                  onClick={() => onSelectRestaurant && onSelectRestaurant(restaurant)}
                  className="group relative rounded-3xl bg-white border border-slate-200/90 hover:border-amber-400 overflow-hidden shadow-sm hover:shadow-2xl transition-all duration-300 flex flex-col justify-between cursor-pointer hover:-translate-y-1.5"
                >
                  
                  {/* Imagen de Cabecera con Placas Gremiales */}
                  <div className="relative h-52 w-full overflow-hidden bg-slate-900">
                    <img 
                      src={restaurant.coverImage || '/images/kaffia/kaffia-fachada-hd.jpg'} 
                      alt={restaurant.name}
                      className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500 filter brightness-[0.96]"
                      loading="lazy"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-black/20 to-black/30 pointer-events-none" />

                    {/* Placa Superior Izquierda: Código Oficial CGM */}
                    <div className="absolute top-3 left-3">
                      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-slate-950/85 backdrop-blur-md text-amber-300 border border-amber-500/50 text-[10px] font-black uppercase tracking-wider shadow-sm">
                        <Award className="w-3 h-3 text-amber-400" />
                        <span>{code}</span>
                      </span>
                    </div>

                    {/* Placa Superior Derecha: Solvencia */}
                    <div className="absolute top-3 right-3">
                      <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-[10px] font-black uppercase tracking-wider shadow-sm backdrop-blur-md ${
                        isSolvent 
                          ? 'bg-emerald-600/90 text-white border border-emerald-400/60' 
                          : 'bg-amber-600/90 text-white border border-amber-400/60'
                      }`}>
                        <CheckCircle2 className="w-3 h-3" />
                        <span>{isSolvent ? 'Solvente' : 'En Trámite'}</span>
                      </span>
                    </div>

                    {/* Icono Central de Pin Georreferenciado (Inspirado en el mockup del usuario) */}
                    <div className="absolute -bottom-4 left-1/2 -translate-x-1/2 z-10">
                      <div className="w-10 h-10 rounded-full bg-white text-emerald-600 flex items-center justify-center shadow-lg border-2 border-emerald-500 group-hover:scale-110 transition-transform">
                        <MapPin className="w-5 h-5 fill-emerald-600 text-emerald-600" />
                      </div>
                    </div>

                  </div>

                  {/* Cuerpo de la Tarjeta */}
                  <div className="p-5 pt-7 flex-1 flex flex-col justify-between text-center">
                    <div>
                      {/* Categoría / Rubro */}
                      <span className="inline-block text-[10px] font-bold uppercase tracking-wider text-amber-700 bg-amber-50 border border-amber-200/80 px-2.5 py-0.5 rounded-full mb-2 max-w-full truncate">
                        {restaurant.category || 'Gastronomía Andina'}
                      </span>

                      {/* Nombre del Establecimiento */}
                      <h3 className="font-serif text-lg font-black text-slate-900 group-hover:text-amber-700 transition-colors leading-snug line-clamp-1">
                        {restaurant.name}
                      </h3>

                      {/* Dirección / Ubicación */}
                      <p className="text-xs text-slate-500 mt-2 line-clamp-2 leading-relaxed flex items-center justify-center gap-1">
                        <span>{restaurant.location || restaurant.direccion_completa || 'Mérida, Venezuela'}</span>
                      </p>

                      {/* Representante Legal si existe */}
                      {(restaurant.legalRepresentative || restaurant.chef) && (
                        <p className="text-[11px] text-slate-400 mt-2 italic font-sans truncate">
                          Responsable: {restaurant.legalRepresentative || restaurant.chef}
                        </p>
                      )}
                    </div>

                    {/* Valoración / Estrellas & Sello */}
                    <div className="pt-4 mt-3 border-t border-slate-100 flex items-center justify-between">
                      <div className="flex items-center gap-1 text-amber-500">
                        <Star className="w-3.5 h-3.5 fill-amber-500" />
                        <Star className="w-3.5 h-3.5 fill-amber-500" />
                        <Star className="w-3.5 h-3.5 fill-amber-500" />
                        <Star className="w-3.5 h-3.5 fill-amber-500" />
                        <Star className="w-3.5 h-3.5 fill-amber-500" />
                        <span className="text-xs font-bold text-slate-800 ml-1">5.0</span>
                      </div>

                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                        Certificado CGEM
                      </span>
                    </div>

                    {/* Botón de Ficha de Negocio */}
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        if (onSelectRestaurant) onSelectRestaurant(restaurant);
                      }}
                      className="mt-3.5 w-full py-2.5 px-4 rounded-xl bg-slate-900 hover:bg-amber-500 text-white hover:text-slate-950 font-serif font-black text-xs uppercase tracking-wider flex items-center justify-center gap-1.5 transition-all duration-200 shadow-sm"
                    >
                      <span>Ver Ficha de Negocio</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>

                  </div>

                </div>
              );
            })}
          </div>
        )}

      </section>

      {/* ============================================================== */}
      {/* 5. CTA INVITACIÓN A AFILIARSE                                  */}
      {/* ============================================================== */}
      <section className="border-t border-slate-200 bg-white py-14">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="rounded-3xl bg-gradient-to-r from-slate-950 via-slate-900 to-amber-950 text-white p-8 sm:p-10 shadow-xl flex flex-col md:flex-row items-center justify-between gap-6 text-center md:text-left">
            <div>
              <span className="text-xs uppercase font-extrabold px-3 py-1 rounded-full bg-amber-500/20 text-amber-400 border border-amber-500/30">
                Gremio Empresarial Formal
              </span>
              <h3 className="font-serif text-2xl sm:text-3xl font-black text-white uppercase tracking-wide mt-2">
                ¿Tu Negocio Gastronómico aún no está registrado?
              </h3>
              <p className="text-xs sm:text-sm text-slate-300 max-w-2xl mt-1 leading-relaxed">
                Únete a la Cámara Gastronómica del Estado Mérida. Obtén presencia oficial en la guía y mapa, postulación al Sello de Calidad AAA y beneficios gremiales exclusivos.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 shrink-0">
              <a 
                href="/afiliacion/registro" 
                className="py-3 px-6 rounded-xl bg-amber-500 hover:bg-amber-600 text-slate-950 font-serif font-black text-xs uppercase tracking-wider transition-all shadow-md text-center"
              >
                Solicitar Afiliación
              </a>
              <a 
                href="/afiliacion" 
                className="py-3 px-6 rounded-xl bg-slate-800 hover:bg-slate-700 text-amber-300 border border-slate-700 font-serif font-black text-xs uppercase tracking-wider transition-all shadow-md text-center"
              >
                Portal de Afiliados
              </a>
            </div>
          </div>
        </div>
      </section>

    </div>
  );
}
