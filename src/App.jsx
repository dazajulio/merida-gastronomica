import React, { useState, useEffect, useCallback } from 'react';
import { Navbar } from './components/Navbar';
import { HeroSection } from './components/HeroSection';
import { RestaurantGuide } from './components/RestaurantGuide';
import { FeaturedRestaurantsCarousel } from './components/FeaturedRestaurantsCarousel';
import { RestaurantModal } from './components/RestaurantModal';
import { LidarMap } from './components/LidarMap';
import { EventsCalendar } from './components/EventsCalendar';
import { TerroirSection } from './components/TerroirSection';
import { TouristServices } from './components/TouristServices';
import { AffiliateDashboard } from './components/AffiliateDashboard';
import { JobsSection } from './components/JobsSection';
import { CulturalDistrict } from './components/CulturalDistrict';
import { SelloGastronomico } from './components/SelloGastronomico';
import { AcademyGlubbiSection } from './components/AcademyGlubbiSection';
import { LegalResourceCenter } from './components/LegalResourceCenter';
import { CoffeeSection } from './components/CoffeeSection';
import { CacaoSection } from './components/CacaoSection';
import { GuildBenefitsSection } from './components/GuildBenefitsSection';
import { BoardAdminPortal } from './components/BoardAdminPortal';
import { Footer } from './components/Footer';

import { RESTAURANTS_DATA } from './data/restaurantsData';
import { translations } from './data/translations';
import { fetchLiveRestaurants, convertAgremiadoToRestaurant } from './lib/directorySync';
import { 
  Sparkles, 
  ArrowRight, 
  Award, 
  Palette, 
  Briefcase, 
  GraduationCap, 
  Scale, 
  ShieldCheck, 
  Building2, 
  CheckCircle2,
  Lock
} from 'lucide-react';

// Route Definitions with Canonical URLs and Meta Titles
const ROUTE_CONFIG = [
  { tab: 'home', paths: ['/', '/inicio', ''], url: '/', title: 'Mérida Gastronómica | Cámara Gastronómica del Estado Mérida' },
  { tab: 'guide', paths: ['/guia-restaurantes', '/restaurantes', '/directorio'], url: '/guia-restaurantes', title: 'Guía Oficial de Restaurantes | Mérida Gastronómica' },
  { tab: 'lidar', paths: ['/mapa', '/mapa-3d', '/lidar'], url: '/mapa', title: 'Mapa Gastronómico 3D & Cartografía | Mérida Gastronómica' },
  { tab: 'terroir', paths: ['/rutas-origen', '/terroir', '/rutas'], url: '/rutas-origen', title: 'Rutas & Sabores de Origen Andino | Mérida Gastronómica' },
  { tab: 'cafe', paths: ['/cafe-especialidad', '/cafe', '/cafes'], url: '/cafe-especialidad', title: 'Café de Especialidad de Altura | Mérida Gastronómica' },
  { tab: 'cacao', paths: ['/cacao-porcelana', '/cacao'], url: '/cacao-porcelana', title: 'Cacao Porcelana del Sur del Lago | Mérida Gastronómica' },
  { tab: 'cultural', paths: ['/distrito-cultural', '/cultural'], url: '/distrito-cultural', title: 'Distrito Cultural Urbano | Mérida Gastronómica' },
  { tab: 'sello', paths: ['/sello-calidad', '/sello', '/sello-aaa'], url: '/sello-calidad', title: 'Sello de Calidad AAA (226 Ítems) | Mérida Gastronómica' },
  { tab: 'beneficios', paths: ['/beneficios-agremiados', '/beneficios'], url: '/beneficios-agremiados', title: 'Beneficios de Ser Agremiado | Mérida Gastronómica' },
  { tab: 'junta_directiva', paths: ['/junta-directiva', '/directiva', '/junta-directiva-oficial', '/junta'], url: '/junta-directiva', title: 'Junta Directiva Oficial & Coordinaciones | Mérida Gastronómica' },
  { tab: 'jobs', paths: ['/bolsa-empleo', '/empleo', '/jobs'], url: '/bolsa-empleo', title: 'Bolsa de Empleo Agremiada | Mérida Gastronómica' },
  { tab: 'academy', paths: ['/academia', '/expo-2027', '/academia-ula'], url: '/academia', title: 'Academia Gastronómica & Expo 2027 | Mérida Gastronómica' },
  { tab: 'legal', paths: ['/marco-legal', '/legal', '/seniat'], url: '/marco-legal', title: 'Marco Jurídico & SENIAT/SAMAT | Mérida Gastronómica' },
  { tab: 'events', paths: ['/eventos', '/agenda'], url: '/eventos', title: 'Calendario Oficial de Eventos | Mérida Gastronómica' },
  { tab: 'services', paths: ['/servicios-turisticos', '/servicios'], url: '/servicios-turisticos', title: 'Servicios Turísticos & Concierge | Mérida Gastronómica' },
  { tab: 'affiliates', paths: ['/afiliacion', '/afiliados', '/portal-afiliados'], url: '/afiliacion', title: 'Portal Oficial de Afiliados | Mérida Gastronómica' },
  { tab: 'affiliates_register', paths: ['/afiliacion/registro', '/solicitar-afiliacion', '/registro'], url: '/afiliacion/registro', title: 'Solicitar Afiliación / Registrar Nuevo Miembro | Mérida Gastronómica' },
  { tab: 'admin', paths: ['/admin', '/portal-admin', '/portal-directiva'], url: '/admin', title: 'Portal Privado Junta Directiva & Agenda | Cámara Gastronómica de Mérida' },
];

export function App() {
  const [activeTab, setActiveTab] = useState('home');
  const [affiliateViewMode, setAffiliateViewMode] = useState('login');
  const [affiliateAutoVideo, setAffiliateAutoVideo] = useState(false);
  const [lang, setLang] = useState('es');
  const [selectedRestaurant, setSelectedRestaurant] = useState(null);
  const [focusRestaurantId, setFocusRestaurantId] = useState(null);
  const [guideSearchTerm, setGuideSearchTerm] = useState('');

  // Live Synchronized Restaurants State (Includes Supabase Directory Agremiados & Custom Edits)
  const [restaurants, setRestaurants] = useState(() => {
    try {
      if (typeof localStorage !== 'undefined') {
        const localDir = localStorage.getItem('cgem_directorio_agremiados');
        if (localDir) {
          const dirList = JSON.parse(localDir);
          if (Array.isArray(dirList) && dirList.length > 0) {
            const hiddenNames = new Set(
              dirList
                .filter(m => m.visible_en_guia === false)
                .map(m => (m.nombre_establecimiento || '').toLowerCase().replace(/[^a-z0-9]/g, '').trim())
            );
            const list = [];
            const seen = new Set();
            RESTAURANTS_DATA.forEach(r => {
              const norm = (r.name || '').toLowerCase().replace(/[^a-z0-9]/g, '').trim();
              if (!hiddenNames.has(norm)) {
                list.push(r);
                seen.add(norm);
              }
            });
            dirList.forEach(m => {
              if (m.visible_en_guia === false) return;
              const norm = (m.nombre_establecimiento || '').toLowerCase().replace(/[^a-z0-9]/g, '').trim();
              if (seen.has(norm)) return;
              list.push(convertAgremiadoToRestaurant(m));
              seen.add(norm);
            });
            if (list.length > 0) return list;
          }
        }
      }
    } catch (e) {}
    return RESTAURANTS_DATA;
  });

  useEffect(() => {
    let isMounted = true;

    const syncDirectoryRestaurants = async () => {
      try {
        const liveList = await fetchLiveRestaurants();
        if (isMounted && Array.isArray(liveList) && liveList.length > 0) {
          setRestaurants(liveList);
        }
      } catch (err) {
        console.warn('Error syncing directory restaurants:', err);
      }
    };

    // Sincronizar inmediatamente al montar
    syncDirectoryRestaurants();

    const handleBusinessUpdate = () => {
      syncDirectoryRestaurants();
    };

    window.addEventListener('cgm_business_updated', handleBusinessUpdate);
    window.addEventListener('storage', handleBusinessUpdate);

    // Polling ligero para mantener sincronizados los nuevos registros aprobados
    const interval = setInterval(syncDirectoryRestaurants, 30000);

    return () => {
      isMounted = false;
      window.removeEventListener('cgm_business_updated', handleBusinessUpdate);
      window.removeEventListener('storage', handleBusinessUpdate);
      clearInterval(interval);
    };
  }, []);

  const t = translations[lang] || translations.es;

  // Process and parse current URL location
  const parseCurrentUrl = useCallback(() => {
    if (typeof window === 'undefined') return;

    const pathname = window.location.pathname.toLowerCase().replace(/\/$/, '') || '/';
    const params = new URLSearchParams(window.location.search);
    const hash = window.location.hash.replace('#', '').toLowerCase();

    // 1. Check direct restaurant slug in path: /restaurante/:slug
    if (pathname.startsWith('/restaurante/')) {
      const slug = pathname.replace('/restaurante/', '');
      const found = (restaurants || RESTAURANTS_DATA).find(r => 
        (r.slug && r.slug.toLowerCase() === slug) || 
        r.id.toLowerCase() === slug
      );
      if (found) {
        setSelectedRestaurant(found);
        setActiveTab('guide');
        document.title = `${found.name} | Guía Mérida Gastronómica`;
        return;
      }
    }

    // 2. Check query param: ?restaurante=slug or ?restaurant=id or ?r=id
    const restParam = params.get('restaurante') || params.get('restaurant') || params.get('r') || hash;
    if (restParam) {
      const found = (restaurants || RESTAURANTS_DATA).find(r => 
        r.id.toLowerCase() === restParam.toLowerCase() || 
        (r.slug && r.slug.toLowerCase() === restParam.toLowerCase())
      );
      if (found) {
        setFocusRestaurantId(found.id);
        setSelectedRestaurant(found);
        setActiveTab('lidar');
        document.title = `${found.name} en Mapa 3D | Mérida Gastronómica`;
        setTimeout(() => {
          const mapBoxEl = document.getElementById('mapa-lidar-box') || document.getElementById('mapa-lidar');
          if (mapBoxEl) {
            mapBoxEl.scrollIntoView({ behavior: 'smooth', block: 'start' });
          }
        }, 350);
        return;
      }
    }

    // 3. Match Route configuration
    for (const route of ROUTE_CONFIG) {
      if (route.paths.includes(pathname)) {
        if (route.tab === 'affiliates_register') {
          setActiveTab('affiliates');
          setAffiliateViewMode('register');
          setAffiliateAutoVideo(true);
        } else {
          setActiveTab(route.tab);
          if (route.tab === 'affiliates') {
            setAffiliateViewMode('login');
            setAffiliateAutoVideo(false);
          }
        }
        document.title = route.title;
        return;
      }
    }

    // Default to home
    setActiveTab('home');
    document.title = 'Mérida Gastronómica | Cámara Gastronómica del Estado Mérida';
  }, []);

  // Listen to browser navigation (back / forward) and initial load
  useEffect(() => {
    parseCurrentUrl();

    const handlePopState = () => {
      parseCurrentUrl();
    };

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, [parseCurrentUrl]);

  // Navigate function with URL update and history pushing
  const navigateTo = (tabName, extra = {}) => {
    let targetUrl = '/';
    let targetTitle = 'Mérida Gastronómica | Cámara Gastronómica del Estado Mérida';

    if (tabName === 'affiliates_register' || (tabName === 'affiliates' && extra.viewMode === 'register')) {
      setActiveTab('affiliates');
      setAffiliateViewMode('register');
      setAffiliateAutoVideo(extra.autoVideo ?? true);
      targetUrl = '/afiliacion/registro';
      targetTitle = 'Solicitar Afiliación / Registrar Nuevo Miembro | Mérida Gastronómica';
    } else {
      const matchRoute = ROUTE_CONFIG.find(r => r.tab === tabName);
      if (matchRoute) {
        targetUrl = matchRoute.url;
        targetTitle = matchRoute.title;
      }
      setActiveTab(tabName);
      if (tabName === 'affiliates') {
        setAffiliateViewMode(extra.viewMode || 'login');
        setAffiliateAutoVideo(false);
      }
    }

    document.title = targetTitle;
    if (window.location.pathname !== targetUrl) {
      window.history.pushState(null, '', targetUrl);
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSelectRestaurantById = (id) => {
    const found = (restaurants || RESTAURANTS_DATA).find(r => r.id === id);
    if (found) {
      setSelectedRestaurant(found);
      const newUrl = `/restaurante/${found.slug || found.id}`;
      window.history.pushState(null, '', newUrl);
      document.title = `${found.name} | Guía Mérida Gastronómica`;
    }
  };

  const handleCloseRestaurantModal = () => {
    setSelectedRestaurant(null);
    const matchRoute = ROUTE_CONFIG.find(r => r.tab === activeTab);
    const targetUrl = matchRoute ? matchRoute.url : '/';
    window.history.replaceState(null, '', targetUrl);
    document.title = matchRoute ? matchRoute.title : 'Mérida Gastronómica';
  };

  const handleViewOnMap = (restaurant) => {
    setSelectedRestaurant(null);
    setFocusRestaurantId(restaurant.id);
    setActiveTab('lidar');
    const newUrl = `${window.location.pathname}?restaurante=${restaurant.slug || restaurant.id}`;
    window.history.replaceState(null, '', newUrl);
    setTimeout(() => {
      const mapBoxEl = document.getElementById('mapa-lidar-box') || document.getElementById('mapa-lidar');
      if (mapBoxEl) {
        mapBoxEl.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }, 200);
  };

  const handleQuickSearch = (term) => {
    setGuideSearchTerm(term);
    navigateTo('guide');
  };

  return (
    <div className="min-h-screen bg-[#fcfbf9] text-slate-800 flex flex-col font-sans selection:bg-amber-500 selection:text-white">
      
      {/* Fixed Navigation (Hidden when on private board admin portal for clean executive focus) */}
      <Navbar 
        activeTab={activeTab} 
        setActiveTab={(tab) => navigateTo(tab)}
        lang={lang} 
        setLang={setLang} 
        t={t}
      />

      {/* Main Content Areas */}
      <main className="flex-1">
        
        {/* ========================================================= */}
        {/* 1. PORTADA PRINCIPAL / HOME LANDING                       */}
        {/* ========================================================= */}
        {activeTab === 'home' && (
          <div>
            {/* Hero Landing */}
            <HeroSection 
              t={t} 
              setActiveTab={(tab) => navigateTo(tab)} 
              onQuickSearch={handleQuickSearch} 
            />

            {/* Featured Section 1: Gastronomic Highlights Carousel */}
            <FeaturedRestaurantsCarousel 
              restaurants={restaurants} 
              onSelectRestaurant={setSelectedRestaurant}
              onViewOnMap={handleViewOnMap}
              onExploreAll={() => navigateTo('guide')}
              t={t}
            />

            {/* Featured Section 2: Sello Mérida Gastronómica Spotlight */}
            <div className="border-t border-slate-200 bg-gradient-to-br from-slate-950 via-slate-900 to-amber-950 py-16 text-white">
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
                  <div className="lg:col-span-7 space-y-4">
                    <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-amber-500/20 text-amber-400 border border-amber-500/30 text-xs font-bold">
                      <Award className="w-3.5 h-3.5" />
                      <span>Norma Técnica Oficial de la Cámara</span>
                    </div>
                    <h2 className="font-serif text-3xl sm:text-5xl font-black text-white uppercase tracking-tight leading-tight">
                      Sello Mérida Gastronómica
                    </h2>
                    <p className="font-sans text-amber-200/90 italic text-base">
                      "Para ser referentes globales, la excelencia debe ser medible."
                    </p>
                    <p className="text-sm text-slate-300 leading-relaxed max-w-2xl font-sans">
                      A través de una rigurosa auditoría de <strong>226 ítems</strong> sustentada en tres pilares —<strong>Calidad, Servicio y Limpieza</strong>—, evaluamos la gestión operativa, la seguridad alimentaria, el manejo de mermas y la excelencia de servicio. Quien ostente este sello en su fachada acredita ante Venezuela y el mundo una <strong>Calificación AAA</strong>.
                    </p>
                    <div className="pt-2 flex flex-wrap items-center gap-3">
                      <button
                        onClick={() => navigateTo('sello')}
                        className="py-3 px-6 rounded-xl bg-amber-500 hover:bg-amber-600 text-slate-950 font-serif font-black text-xs uppercase tracking-widest flex items-center gap-2 shadow-lg transition-all"
                      >
                        <span>Conocer los 226 Ítems del Sello</span>
                        <ArrowRight className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  <div className="lg:col-span-5 grid grid-cols-1 gap-3">
                    <div className="p-4 rounded-2xl bg-white/10 border border-white/15 backdrop-blur-md">
                      <span className="text-xl font-serif font-black text-amber-400 block uppercase">Pilar I: Calidad (80 Ítems)</span>
                      <p className="text-xs text-slate-300 mt-1 font-sans">Estandarización de recetas, trazabilidad de origen andino y termorregulación.</p>
                    </div>
                    <div className="p-4 rounded-2xl bg-white/10 border border-white/15 backdrop-blur-md">
                      <span className="text-xl font-serif font-black text-sky-400 block uppercase">Pilar II: Servicio (72 Ítems)</span>
                      <p className="text-xs text-slate-300 mt-1 font-sans">Hospitalidad andina, comanda cronometrada y cata de café y vinos.</p>
                    </div>
                    <div className="p-4 rounded-2xl bg-white/10 border border-white/15 backdrop-blur-md">
                      <span className="text-xl font-serif font-black text-emerald-400 block uppercase">Pilar III: Limpieza & Mermas (74 Ítems)</span>
                      <p className="text-xs text-slate-300 mt-1 font-sans">Inocuidad HACCP, desinfección profunda y economía circular de residuos.</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Featured Section 3: Leaflet Route Map */}
            <div className="border-t border-slate-200 bg-[#f8f6f0] py-16">
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <LidarMap 
                  onSelectRestaurantById={handleSelectRestaurantById}
                  t={t}
                />
              </div>
            </div>

            {/* Featured Section 4: Rutas & Sabores de Origen */}
            <div className="border-t border-slate-200 bg-white py-16">
              <TerroirSection 
                t={t}
                setActiveTab={(tab) => navigateTo(tab)}
                onQuickSearch={handleQuickSearch}
              />
            </div>

            {/* Featured Section 5: Distrito Cultural Urbano */}
            <div className="border-t border-slate-200 bg-[#faf8f5] py-16">
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex flex-col md:flex-row items-start md:items-end justify-between mb-10 gap-4">
                  <div>
                    <span className="text-xs uppercase font-extrabold text-amber-800 flex items-center gap-1.5 mb-2">
                      <Palette className="w-4 h-4 text-pink-600" />
                      Arte, Gastronomía & Vida Nocturna
                    </span>
                    <h2 className="font-serif text-3xl sm:text-4xl font-black text-slate-900 uppercase tracking-tight">
                      Distrito Cultural Urbano de Mérida
                    </h2>
                  </div>
                  <button
                    onClick={() => navigateTo('cultural')}
                    className="py-2.5 px-5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs uppercase tracking-wider flex items-center gap-2 shadow-sm transition-all"
                  >
                    <span>Explorar el Distrito</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {/* Card 1: Jobs */}
                  <div className="p-8 rounded-3xl bg-slate-50 border border-slate-200 flex flex-col justify-between hover:border-amber-400 hover:bg-white transition-all shadow-sm">
                    <div>
                      <div className="w-12 h-12 rounded-2xl bg-amber-100 text-amber-800 flex items-center justify-center mb-4">
                        <Briefcase className="w-6 h-6" />
                      </div>
                      <h3 className="font-serif font-black text-xl text-slate-900 uppercase">
                        Bolsa de Empleo Agremiada
                      </h3>
                      <p className="text-xs text-slate-600 mt-2 leading-relaxed">
                        Requerimientos laborales en cocina, barismo, sala y gerencia de A&B con salarios formales en divisas y beneficios preferenciales.
                      </p>
                    </div>
                    <button
                      onClick={() => navigateTo('jobs')}
                      className="mt-6 py-2.5 px-4 rounded-xl bg-amber-500 hover:bg-amber-600 text-white font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-1.5 shadow-sm transition-all"
                    >
                      <span>Ver Vacantes Activas</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  {/* Card 2: Academy & Glubbi & Expo */}
                  <div className="p-8 rounded-3xl bg-slate-50 border border-slate-200 flex flex-col justify-between hover:border-sky-400 hover:bg-white transition-all shadow-sm">
                    <div>
                      <div className="w-12 h-12 rounded-2xl bg-sky-100 text-sky-800 flex items-center justify-center mb-4">
                        <GraduationCap className="w-6 h-6" />
                      </div>
                      <h3 className="font-serif font-black text-xl text-slate-900 uppercase">
                        Academia Gastronómica & Expo 2027
                      </h3>
                      <p className="text-xs text-slate-600 mt-2 leading-relaxed">
                        Alianza con la ULA y Hotel Escuela para la Licenciatura en Gastronomía, centros de formación técnica y rumbo a Expo Andes 2027.
                      </p>
                    </div>
                    <button
                      onClick={() => navigateTo('academy')}
                      className="mt-6 py-2.5 px-4 rounded-xl bg-sky-600 hover:bg-sky-700 text-white font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-1.5 shadow-sm transition-all"
                    >
                      <span>Conocer Alianza & Expo</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  {/* Card 3: Legal & SENIAT */}
                  <div className="p-8 rounded-3xl bg-slate-50 border border-slate-200 flex flex-col justify-between hover:border-indigo-400 hover:bg-white transition-all shadow-sm">
                    <div>
                      <div className="w-12 h-12 rounded-2xl bg-indigo-100 text-indigo-800 flex items-center justify-center mb-4">
                        <Scale className="w-6 h-6" />
                      </div>
                      <h3 className="font-serif font-black text-xl text-slate-900 uppercase">
                        Centro de Recursos & Marco Jurídico
                      </h3>
                      <p className="text-xs text-slate-600 mt-2 leading-relaxed">
                        Repositorio actualizado en normativas del SENIAT, SAMAT, SACS, ordenanzas fiscales y checklist interactivo de deberes formales.
                      </p>
                    </div>
                    <button
                      onClick={() => navigateTo('legal')}
                      className="mt-6 py-2.5 px-4 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-1.5 shadow-sm transition-all"
                    >
                      <span>Consultar Normativas</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>

                </div>
              </div>
            </div>

            {/* Featured Section 7: Events Calendar */}
            <div className="border-t border-slate-200 bg-[#f8f6f0] py-16">
              <EventsCalendar t={t} />
            </div>

            {/* Featured Section 8: Tourist Concierge */}
            <div className="border-t border-slate-200 bg-white py-16">
              <TouristServices t={t} />
            </div>

            {/* Guild Callout Banner */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
              <div className="p-8 sm:p-10 rounded-3xl bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 text-white shadow-xl flex flex-col md:flex-row items-center justify-between gap-6 text-center md:text-left">
                <div className="space-y-2">
                  <span className="text-xs uppercase font-extrabold px-3 py-1 rounded-full bg-amber-500/20 text-amber-400 border border-amber-500/30">
                    Gremio Empresarial
                  </span>
                  <h3 className="font-serif text-2xl sm:text-3xl font-black text-white uppercase tracking-wide">
                    ¿Es Propietario o Chef de un Restaurante en Mérida?
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-300 max-w-2xl font-sans">
                    Únase a la Cámara Gastronómica del Estado Mérida. Obtenga el Sello Oficial de Calidad AAA, auditorías sanitarias, compras conjuntas y posicionamiento en guías turísticas internacionales.
                  </p>
                </div>
                <div className="flex flex-col sm:flex-row gap-3">
                  <button
                    onClick={() => navigateTo('affiliates_register')}
                    className="py-3.5 px-6 rounded-2xl bg-amber-500 hover:bg-amber-600 text-slate-950 font-serif font-black text-xs uppercase tracking-wider shadow-md shrink-0 transition-all"
                  >
                    Solicitar Afiliación
                  </button>
                  <button
                    onClick={() => navigateTo('affiliates')}
                    className="py-3.5 px-6 rounded-2xl bg-slate-800 hover:bg-slate-700 text-amber-300 border border-slate-700 font-serif font-black text-xs uppercase tracking-wider shadow-md shrink-0 transition-all"
                  >
                    Portal de Agremiados
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ========================================================= */}
        {/* 2. RUTAS DEDICADAS DE LA PLATAFORMA                       */}
        {/* ========================================================= */}

        {/* Dedicated Page: Guía de Restaurantes (/guia-restaurantes) */}
        {activeTab === 'guide' && (
          <div className="pt-24 pb-16">
            <RestaurantGuide 
              restaurants={restaurants} 
              onSelectRestaurant={setSelectedRestaurant}
              onViewOnMap={handleViewOnMap}
              t={t}
              initialSearch={guideSearchTerm}
            />
          </div>
        )}

        {/* Dedicated Page: Mapa (/mapa) */}
        {activeTab === 'lidar' && (
          <div className="pt-24 pb-16">
            <LidarMap 
              restaurants={restaurants}
              onSelectRestaurantById={handleSelectRestaurantById}
              focusRestaurantId={focusRestaurantId}
              t={t}
            />
          </div>
        )}

        {/* Dedicated Page: Rutas & Sabores de Origen (/rutas-origen) */}
        {activeTab === 'terroir' && (
          <div className="pt-24 pb-16">
            <TerroirSection 
              t={t}
              setActiveTab={(tab) => navigateTo(tab)}
              onQuickSearch={handleQuickSearch}
            />
          </div>
        )}

        {/* Dedicated Page: Sello Mérida Gastronómica (/sello-calidad) */}
        {activeTab === 'sello' && (
          <div className="pt-24 pb-16">
            <SelloGastronomico 
              t={t}
              setActiveTab={(tab) => navigateTo(tab)}
            />
          </div>
        )}

        {/* Dedicated Page: Distrito Cultural Urbano (/distrito-cultural) */}
        {activeTab === 'cultural' && (
          <div className="pt-24 pb-16">
            <CulturalDistrict 
              t={t}
              setActiveTab={(tab) => navigateTo(tab)}
              onQuickSearch={handleQuickSearch}
            />
          </div>
        )}

        {/* Dedicated Page: Bolsa de Empleo Agremiada (/bolsa-empleo) */}
        {activeTab === 'jobs' && (
          <div className="pt-24 pb-16">
            <JobsSection 
              t={t}
              setActiveTab={(tab) => navigateTo(tab)}
            />
          </div>
        )}

        {/* Dedicated Page: Academia, Glubbi AI & Expo 2027 (/academia) */}
        {activeTab === 'academy' && (
          <div className="pt-24 pb-16">
            <AcademyGlubbiSection 
              t={t}
              setActiveTab={(tab) => navigateTo(tab)}
            />
          </div>
        )}

        {/* Dedicated Page: Centro de Recursos y Marco Jurídico (/marco-legal) */}
        {activeTab === 'legal' && (
          <div className="pt-24 pb-16">
            <LegalResourceCenter 
              t={t}
              setActiveTab={(tab) => navigateTo(tab)}
            />
          </div>
        )}

        {/* Dedicated Page: Eventos (/eventos) */}
        {activeTab === 'events' && (
          <div className="pt-24 pb-16">
            <EventsCalendar t={t} />
          </div>
        )}

        {/* Dedicated Page: Vinculaciones Turísticas (/servicios-turisticos) */}
        {activeTab === 'services' && (
          <div className="pt-24 pb-16">
            <TouristServices t={t} />
          </div>
        )}

        {/* Dedicated Page: Café de Especialidad (/cafe-especialidad) */}
        {activeTab === 'cafe' && (
          <div className="pt-24 pb-16">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <CoffeeSection 
                setActiveTab={(tab) => navigateTo(tab)} 
                onQuickSearch={handleQuickSearch} 
              />
            </div>
          </div>
        )}

        {/* Dedicated Page: Cacao Porcelana (/cacao-porcelana) */}
        {activeTab === 'cacao' && (
          <div className="pt-24 pb-16">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <CacaoSection 
                setActiveTab={(tab) => navigateTo(tab)} 
                onQuickSearch={handleQuickSearch} 
              />
            </div>
          </div>
        )}

        {/* Dedicated Page: Beneficios de Ser Agremiado & Junta Directiva (/beneficios-agremiados, /junta-directiva) */}
        {(activeTab === 'beneficios' || activeTab === 'junta_directiva') && (
          <div className="pt-24 pb-16">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <GuildBenefitsSection 
                setActiveTab={(tab) => navigateTo(tab)} 
                initialView={activeTab === 'junta_directiva' ? 'board' : 'all'}
              />
            </div>
          </div>
        )}

        {/* Dedicated Page: Portal de Afiliados y Registro (/afiliacion, /afiliacion/registro) */}
        {activeTab === 'affiliates' && (
          <div className="pt-24 pb-16">
            <AffiliateDashboard 
              t={t} 
              initialViewMode={affiliateViewMode}
              autoOpenVideo={affiliateAutoVideo}
            />
          </div>
        )}

        {/* Dedicated Page: Portal Junta Directiva (/admin) */}
        {activeTab === 'admin' && (
          <div>
            <BoardAdminPortal 
              t={t} 
              onNavigate={(tab) => navigateTo(tab)}
            />
          </div>
        )}

      </main>

      {/* Full Restaurant Modal */}
      {selectedRestaurant && (
        <RestaurantModal 
          restaurant={selectedRestaurant} 
          onClose={handleCloseRestaurantModal}
          onViewOnMap={handleViewOnMap}
        />
      )}

      {/* Footer */}
      <Footer setActiveTab={(tab) => navigateTo(tab)} t={t} />

    </div>
  );
}
