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
import { AcademyGlubbiSection } from './components/AcademyGlubbiSection';
import { CoffeeSection } from './components/CoffeeSection';
import { CacaoSection } from './components/CacaoSection';
import { GuildBenefitsSection } from './components/GuildBenefitsSection';
import { BoardAdminPortal } from './components/BoardAdminPortal';
import { Footer } from './components/Footer';
import { DirectoryAgremiadosSection } from './components/DirectoryAgremiadosSection';
import { ElValleAffiliationLanding } from './components/ElValleAffiliationLanding';
import { ElValleSpotlightSection } from './components/ElValleSpotlightSection';
import { AlliesMarqueeStrip } from './components/AlliesMarqueeStrip';
import { ElValleTouristPage } from './components/ElValleTouristPage';
import { NewsMediaSection } from './components/NewsMediaSection';
import { INITIAL_DIRECTORY_DATA } from './data/initialDirectoryData';

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
  Lock,
  UtensilsCrossed,
  Calendar,
  Compass
} from 'lucide-react';

// Route Definitions with Canonical URLs and Meta Titles
const ROUTE_CONFIG = [
  { tab: 'home', paths: ['/', '/inicio', ''], url: '/', title: 'Mérida Gastronómica | Cámara Gastronómica del Estado Mérida' },
  { tab: 'guide', paths: ['/guia-restaurantes', '/restaurantes'], url: '/guia-restaurantes', title: 'Guía de Restaurantes | Mérida Gastronómica' },
  { tab: 'prestadores', paths: ['/prestadores-servicios', '/guia-oficial', '/guia', '/prestadores'], url: '/prestadores-servicios', title: 'Guía de Prestadores de Servicios en Mérida | Mérida Gastronómica' },
  { tab: 'directorio', paths: ['/directorio', '/agremiados', '/directorio-agremiados', '/miembros'], url: '/directorio', title: 'Directorio Oficial de Agremiados | Cámara Gastronómica de Mérida' },
  { tab: 'lidar', paths: ['/mapa', '/mapa-3d', '/lidar'], url: '/mapa', title: 'Mapa de Ubicación | Mérida Gastronómica' },
  { tab: 'terroir', paths: ['/rutas-origen', '/terroir', '/rutas'], url: '/rutas-origen', title: 'Rutas & Sabores de Origen Andino | Mérida Gastronómica' },
  { tab: 'cafe', paths: ['/cafe-especialidad', '/cafe', '/cafes'], url: '/cafe-especialidad', title: 'Café de Especialidad de Altura | Mérida Gastronómica' },
  { tab: 'cacao', paths: ['/cacao-porcelana', '/cacao'], url: '/cacao-porcelana', title: 'Cacao Porcelana del Sur del Lago | Mérida Gastronómica' },
  { tab: 'cultural', paths: ['/distrito-cultural', '/cultural'], url: '/distrito-cultural', title: 'Distrito Cultural Urbano | Mérida Gastronómica' },
  { tab: 'beneficios', paths: ['/beneficios-agremiados', '/beneficios'], url: '/beneficios-agremiados', title: 'Beneficios de Ser Agremiado | Mérida Gastronómica' },
  { tab: 'junta_directiva', paths: ['/junta-directiva', '/directiva', '/junta-directiva-oficial', '/junta'], url: '/junta-directiva', title: 'Junta Directiva Oficial & Coordinaciones | Mérida Gastronómica' },
  { tab: 'jobs', paths: ['/bolsa-empleo', '/empleo', '/jobs'], url: '/bolsa-empleo', title: 'Bolsa de Empleo Agremiada | Mérida Gastronómica' },
  { tab: 'academy', paths: ['/academia', '/expo-2027', '/academia-ula'], url: '/academia', title: 'Academia Gastronómica & Expo 2027 | Mérida Gastronómica' },
  { tab: 'events', paths: ['/eventos', '/agenda'], url: '/eventos', title: 'Calendario Oficial de Eventos | Mérida Gastronómica' },
  { tab: 'services', paths: ['/servicios-turisticos', '/servicios'], url: '/servicios-turisticos', title: 'Servicios Turísticos & Concierge | Mérida Gastronómica' },
  { tab: 'affiliates', paths: ['/afiliacion', '/afiliados', '/portal-afiliados'], url: '/afiliacion', title: 'Portal Oficial de Afiliados | Mérida Gastronómica' },
  { tab: 'affiliates_register', paths: ['/afiliacion/registro', '/solicitar-afiliacion', '/registro'], url: '/afiliacion/registro', title: 'Solicitar Afiliación / Registrar Nuevo Miembro | Mérida Gastronómica' },
  { tab: 'affiliates_el_valle', paths: ['/el-valle-te-conecta', '/el-valle', '/afiliacion-el-valle', '/elvalleteconecta'], url: '/el-valle-te-conecta', title: 'Afiliación Exclusiva: El Valle te Conecta | Cámara Gastronómica del Estado Mérida' },
  { tab: 'el_valle_ruta', paths: ['/ruta-el-valle', '/el-valle-turismo'], url: '/ruta-el-valle', title: 'El Valle te Conecta — Ruta Turística Certificada | Mérida Gastronómica' },
  { tab: 'admin', paths: ['/admin', '/portal-admin', '/portal-directiva'], url: '/admin', title: 'Portal Privado Junta Directiva & Agenda | Cámara Gastronómica de Mérida' },
];

export function App() {
  const [activeTab, setActiveTab] = useState('home');
  const [affiliateViewMode, setAffiliateViewMode] = useState(() => {
    try {
      if (typeof localStorage !== 'undefined' && localStorage.getItem('cgem_active_session')) {
        return 'dashboard';
      }
    } catch (e) {}
    return 'login';
  });
  const [affiliateAutoVideo, setAffiliateAutoVideo] = useState(false);
  const [affiliateInitialTab, setAffiliateInitialTab] = useState('overview');
  const [affiliateDirectUser, setAffiliateDirectUser] = useState(null);
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
    const baseList = [];
    const seenBase = new Set();
    RESTAURANTS_DATA.forEach(r => {
      const norm = (r.name || '').toLowerCase().replace(/[^a-z0-9]/g, '').trim();
      baseList.push(r);
      seenBase.add(norm);
    });
    INITIAL_DIRECTORY_DATA.forEach(m => {
      if (m.visible_en_guia === false) return;
      const norm = (m.nombre_establecimiento || '').toLowerCase().replace(/[^a-z0-9]/g, '').trim();
      if (!seenBase.has(norm)) {
        baseList.push(convertAgremiadoToRestaurant(m));
        seenBase.add(norm);
      }
    });
    return baseList;
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
            const hasSession = typeof localStorage !== 'undefined' && localStorage.getItem('cgem_active_session');
            setAffiliateViewMode(hasSession ? 'dashboard' : 'login');
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
      
      {/* Fixed Navigation (Hidden when on private board admin portal or logged-in affiliate dashboard for clean SaaS focus) */}
      {activeTab !== 'admin' && !(activeTab === 'affiliates' && affiliateViewMode === 'dashboard') && (
        <Navbar 
          activeTab={activeTab} 
          setActiveTab={(tab) => navigateTo(tab)}
          lang={lang} 
          setLang={setLang} 
          t={t}
        />
      )}

      {/* Main Content Areas */}
      <main className="flex-1">
        
        {/* ========================================================= */}
        {/* 1. PORTADA PRINCIPAL / HOME LANDING                       */}
        {/* ========================================================= */}
        {activeTab === 'home' && (
          <div className="bg-[#FAF7F2]">
            {/* Hero Landing */}
            <HeroSection 
              t={t} 
              setActiveTab={(tab) => navigateTo(tab)} 
              onQuickSearch={handleQuickSearch}
              restaurantCount={restaurants.length}
            />

            {/* Ecosystem Quick Cards: "De la Cordillera a tu Mesa" (Inspired by From Ideas to Impact) */}
            <section className="py-16 bg-[#FAF7F2] border-b border-[#EAE3D5]">
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start mb-10">
                  <div className="lg:col-span-5">
                    <span className="text-[11px] font-bold uppercase tracking-[0.2em] text-[#C85A32] block mb-1.5">
                      Qué Ofrecemos
                    </span>
                    <h2 className="font-playfair text-3xl sm:text-4xl font-bold text-[#1E1C1A] leading-tight">
                      De las Ideas al <span className="italic font-normal text-[#C85A32]">Paladar</span>
                    </h2>
                    <p className="text-xs sm:text-sm text-[#5C554E] mt-3 leading-relaxed font-sans max-w-md">
                      Conectamos a comensales y turistas con los establecimientos más auténticos de Mérida, impulsando la calidad y el producto de origen.
                    </p>
                  </div>

                  <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    {[
                      {
                        id: 'prestadores',
                        title: 'Guía Oficial',
                        desc: 'Prestadores de servicios gastronómicos y turísticos en Mérida.',
                        icon: UtensilsCrossed,
                      },
                      {
                        id: 'events',
                        title: 'Eventos & Festivales',
                        desc: 'Ferias, catas, congresos y festividades más prestigiosas de Mérida.',
                        icon: Calendar,
                      },
                      {
                        id: 'cultural',
                        title: 'Distrito Cultural',
                        desc: 'Entre callejones y casonas coloniales, el corazón de Mérida late con fuerza propia.',
                        icon: Palette,
                      },
                      {
                        id: 'terroir',
                        title: 'Rutas Mérida',
                        desc: 'Mérida es un territorio de contrastes únicos: desde el frío de los páramos agrícolas hasta el cacao fino del Sur del Lago.',
                        icon: Compass,
                      },
                    ].map((card) => {
                      const IconComp = card.icon;
                      return (
                        <button
                          key={card.id}
                          type="button"
                          onClick={() => navigateTo(card.id)}
                          className="text-left p-5 rounded-3xl bg-white border border-[#EAE3D5] hover:border-[#C85A32]/60 hover:shadow-md transition-all group flex flex-col justify-between"
                        >
                          <div>
                            <div className="w-10 h-10 rounded-2xl bg-[#FAF3EB] text-[#C85A32] flex items-center justify-center mb-3.5 group-hover:scale-105 transition-transform">
                              <IconComp className="w-5 h-5" />
                            </div>
                            <h3 className="font-playfair font-bold text-base text-[#1E1C1A] group-hover:text-[#C85A32] transition-colors">
                              {card.title}
                            </h3>
                            <p className="text-[11px] text-[#7A7168] mt-1 leading-relaxed">
                              {card.desc}
                            </p>
                          </div>
                          <span className="mt-4 inline-flex items-center gap-1 text-[11px] font-bold text-[#C85A32]">
                            <span>Explorar</span>
                            <ArrowRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
                          </span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>
            </section>

            {/* Cinta de Aliados Oficiales (Desplazamiento lento de izquierda a derecha) */}
            <AlliesMarqueeStrip />

            {/* Featured Section 1: Guía de Restaurantes */}
            <FeaturedRestaurantsCarousel 
              restaurants={restaurants} 
              onSelectRestaurant={setSelectedRestaurant}
              onViewOnMap={handleViewOnMap}
              onExploreAll={() => navigateTo('guide')}
              t={t}
            />

            {/* Featured Section: Noticias & Medios */}
            <NewsMediaSection />

            {/* Featured Section 2: El Valle te Conecta (Case Study Spotlight Style) */}
            <ElValleSpotlightSection onExplore={() => navigateTo('el_valle_ruta')} />

            {/* Featured Section 3: Events Calendar */}
            <div className="border-t border-[#EAE3D5] bg-white py-16">
              <EventsCalendar t={t} />
            </div>

            {/* Clean Editorial Guild Callout (Inspired by "Have a Project in Mind?") */}
            <div className="border-t border-[#EAE3D5] bg-white py-16">
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="p-8 sm:p-12 rounded-[2rem] bg-[#FAF7F2] border border-[#EAE3D5] shadow-2xs flex flex-col lg:flex-row items-start lg:items-center justify-between gap-8">
                  <div className="space-y-3 max-w-2xl">
                    <span className="text-[11px] uppercase tracking-[0.2em] font-bold text-[#C85A32] block">
                      Gremio Empresarial
                    </span>
                    <h3 className="font-playfair text-3xl sm:text-4xl font-bold text-[#1E1C1A] leading-tight">
                      ¿Tienes un Restaurante o Posada en <span className="italic font-normal text-[#C85A32]">Mérida?</span>
                    </h3>
                    <p className="text-xs sm:text-sm text-[#5C554E] font-sans leading-relaxed">
                      Únete a la Cámara Gastronómica del Estado Mérida. Posiciona tu marca en la guía oficial, accede a convenios preferenciales, asesoría gremial y eventos turísticos.
                    </p>
                  </div>
                  <div className="flex flex-wrap items-center gap-3 shrink-0">
                    <button
                      onClick={() => navigateTo('affiliates_register')}
                      className="py-3.5 px-6 rounded-full bg-[#C85A32] hover:bg-[#B04B26] text-white font-sans font-bold text-xs flex items-center gap-2 shadow-sm transition-all"
                    >
                      <span>Solicitar Afiliación</span>
                      <ArrowRight className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => navigateTo('affiliates')}
                      className="py-3.5 px-6 rounded-full bg-white hover:bg-[#FAF3EB] text-[#1E1C1A] border border-[#DED5C5] font-sans font-semibold text-xs shadow-2xs transition-all"
                    >
                      Portal de Agremiados
                    </button>
                  </div>
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
          <div className="pt-24 pb-16 bg-[#FAF7F2]">
            <RestaurantGuide 
              restaurants={restaurants} 
              onSelectRestaurant={setSelectedRestaurant}
              onViewOnMap={handleViewOnMap}
              t={t}
              initialSearch={guideSearchTerm}
              mode="restaurants"
            />
          </div>
        )}

        {/* Dedicated Page: Guía de Prestadores de Servicios en Mérida (/prestadores-servicios) */}
        {activeTab === 'prestadores' && (
          <div className="pt-24 pb-16 bg-[#FAF7F2]">
            <RestaurantGuide 
              restaurants={restaurants} 
              onSelectRestaurant={setSelectedRestaurant}
              onViewOnMap={handleViewOnMap}
              t={t}
              initialSearch={guideSearchTerm}
              mode="providers"
            />
          </div>
        )}

        {/* Dedicated Page: Directorio Oficial de Agremiados (/directorio) */}
        {activeTab === 'directorio' && (
          <div>
            <DirectoryAgremiadosSection 
              restaurants={restaurants} 
              onSelectRestaurant={setSelectedRestaurant}
              onViewOnMap={handleViewOnMap}
              t={t}
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
          <div className="pt-24 pb-16 bg-[#FAF7F2]">
            <TerroirSection 
              t={t}
              setActiveTab={(tab) => navigateTo(tab)}
              onQuickSearch={handleQuickSearch}
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
          <div className="pt-24 pb-16 bg-[#FAF7F2]">
            <AcademyGlubbiSection 
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

        {/* Dedicated Page: Afiliación Exclusiva El Valle te Conecta (/el-valle-te-conecta, /el-valle, /afiliacion-el-valle) */}
        {activeTab === 'affiliates_el_valle' && (
          <div className="pt-20 pb-12">
            <ElValleAffiliationLanding 
              onNavigate={(tab) => navigateTo(tab)}
              onCompleteExpress={(userPayload) => {
                setAffiliateDirectUser(userPayload);
                setAffiliateInitialTab('my_business');
                setAffiliateViewMode('dashboard');
                setActiveTab('affiliates');
                window.history.pushState(null, '', '/afiliacion');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
            />
          </div>
        )}

        {/* Dedicated Page: Ruta Turística El Valle te Conecta para el Turista (/ruta-el-valle) */}
        {activeTab === 'el_valle_ruta' && (
          <ElValleTouristPage
            restaurants={restaurants}
            onSelectRestaurant={setSelectedRestaurant}
            onBack={() => navigateTo('home')}
            onNavigate={(tab) => navigateTo(tab)}
          />
        )}

        {/* Dedicated Page: Portal de Afiliados y Registro (/afiliacion, /afiliacion/registro) */}
        {activeTab === 'affiliates' && (
          <div className={affiliateViewMode === 'dashboard' ? "" : "pt-24 pb-16"}>
            <AffiliateDashboard 
              t={t} 
              initialViewMode={affiliateViewMode}
              autoOpenVideo={affiliateAutoVideo}
              initialActiveTab={affiliateInitialTab}
              initialActiveUser={affiliateDirectUser}
              onNavigate={(tab) => navigateTo(tab)}
              onViewModeChange={(mode) => setAffiliateViewMode(mode)}
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

      {/* Footer (Hidden when on private board admin portal, logged-in affiliate dashboard or express/el-valle landings) */}
      {activeTab !== 'admin' && activeTab !== 'affiliates_express' && activeTab !== 'affiliates_el_valle' && !(activeTab === 'affiliates' && affiliateViewMode === 'dashboard') && <Footer setActiveTab={(tab) => navigateTo(tab)} t={t} />}

    </div>
  );
}
