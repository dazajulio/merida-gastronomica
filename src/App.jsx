import React, { useState } from 'react';
import { Navbar } from './components/Navbar';
import { HeroSection } from './components/HeroSection';
import { RestaurantGuide } from './components/RestaurantGuide';
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
import { Footer } from './components/Footer';

import { RESTAURANTS_DATA } from './data/restaurantsData';
import { translations } from './data/translations';
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
  CheckCircle2
} from 'lucide-react';

export function App() {
  const [activeTab, setActiveTab] = useState('home'); // home | guide | lidar | events | terroir | jobs | cultural | sello | academy | legal | services | affiliates
  const [lang, setLang] = useState('es');
  const [selectedRestaurant, setSelectedRestaurant] = useState(null);
  const [focusRestaurantId, setFocusRestaurantId] = useState(null);
  const [guideSearchTerm, setGuideSearchTerm] = useState('');

  const t = translations[lang] || translations.es;

  const handleSelectRestaurantById = (id) => {
    const found = RESTAURANTS_DATA.find(r => r.id === id);
    if (found) {
      setSelectedRestaurant(found);
    }
  };

  const handleViewOnMap = (restaurant) => {
    setSelectedRestaurant(null);
    setFocusRestaurantId(restaurant.id);
    setActiveTab('lidar');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleQuickSearch = (term) => {
    setGuideSearchTerm(term);
    setActiveTab('guide');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleBookDirect = (restaurant) => {
    setSelectedRestaurant(restaurant);
  };

  return (
    <div className="min-h-screen bg-[#fcfbf9] text-slate-800 flex flex-col font-sans selection:bg-amber-500 selection:text-white">
      
      {/* Fixed Navigation */}
      <Navbar 
        activeTab={activeTab} 
        setActiveTab={(tab) => {
          setActiveTab(tab);
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
        lang={lang} 
        setLang={setLang} 
        t={t}
      />

      {/* Main Content Areas */}
      <main className="flex-1">
        {activeTab === 'home' && (
          <div>
            {/* Hero Landing */}
            <HeroSection 
              t={t} 
              setActiveTab={setActiveTab} 
              onQuickSearch={handleQuickSearch} 
            />

            {/* Featured Section 1: Gastronomic Highlights */}
            <div className="border-t border-slate-200 bg-white py-16">
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex flex-col md:flex-row items-start md:items-end justify-between mb-10 gap-4">
                  <div>
                    <span className="text-xs uppercase font-bold text-amber-800 flex items-center gap-1.5 mb-2">
                      <Sparkles className="w-4 h-4 text-amber-600" />
                      Joyas Culinarias de la Cordillera
                    </span>
                    <h2 className="font-serif text-3xl sm:text-4xl font-bold text-slate-900">
                      Restaurantes Destacados & Cocina de Autor
                    </h2>
                  </div>
                  <button
                    onClick={() => { setActiveTab('guide'); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
                    className="py-2.5 px-5 rounded-xl bg-amber-500 hover:bg-amber-600 text-white font-bold text-xs uppercase tracking-wider flex items-center gap-2 shadow-sm transition-all"
                  >
                    <span>Ver Directorio Completo</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>

                <RestaurantGuide 
                  restaurants={RESTAURANTS_DATA.slice(0, 3)} 
                  onSelectRestaurant={setSelectedRestaurant}
                  onBookDirect={handleBookDirect}
                  onViewOnMap={handleViewOnMap}
                  t={t}
                  initialSearch=""
                />
              </div>
            </div>

            {/* Featured Section 2: Sello Mérida Gastronómica Spotlight */}
            <div className="border-t border-slate-200 bg-gradient-to-br from-slate-950 via-slate-900 to-amber-950 py-16 text-white">
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
                  <div className="lg:col-span-7 space-y-4">
                    <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-amber-500/20 text-amber-400 border border-amber-500/30 text-xs font-bold">
                      <Award className="w-3.5 h-3.5" />
                      <span>Norma Técnica Oficial de la Cámara</span>
                    </div>
                    <h2 className="font-serif text-3xl sm:text-5xl font-bold text-white leading-tight">
                      Sello Mérida Gastronómica
                    </h2>
                    <p className="font-serif text-amber-200/90 italic text-base">
                      "Para ser referentes globales, la excelencia debe ser medible."
                    </p>
                    <p className="text-sm text-slate-300 leading-relaxed max-w-2xl">
                      A través de una rigurosa auditoría de <strong>226 ítems</strong> sustentada en tres pilares —<strong>Calidad, Servicio y Limpieza</strong>—, evaluamos la gestión operativa, la seguridad alimentaria, el manejo de mermas y la excelencia de servicio. Quien ostente este sello en su fachada acredita ante Venezuela y el mundo una <strong>Calificación AAA</strong>.
                    </p>
                    <div className="pt-2 flex flex-wrap items-center gap-3">
                      <button
                        onClick={() => { setActiveTab('sello'); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
                        className="py-3 px-6 rounded-xl bg-amber-500 hover:bg-amber-600 text-white font-bold text-xs uppercase tracking-wider flex items-center gap-2 shadow-lg transition-all"
                      >
                        <span>Conocer los 226 Ítems del Sello</span>
                        <ArrowRight className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  <div className="lg:col-span-5 grid grid-cols-1 gap-3">
                    <div className="p-4 rounded-2xl bg-white/10 border border-white/15 backdrop-blur-md">
                      <span className="text-xl font-serif font-bold text-amber-400 block">Pilar I: Calidad (80 Ítems)</span>
                      <p className="text-xs text-slate-300 mt-1">Estandarización de recetas, trazabilidad de origen andino y termorregulación.</p>
                    </div>
                    <div className="p-4 rounded-2xl bg-white/10 border border-white/15 backdrop-blur-md">
                      <span className="text-xl font-serif font-bold text-sky-400 block">Pilar II: Servicio (72 Ítems)</span>
                      <p className="text-xs text-slate-300 mt-1">Hospitalidad andina, comanda cronometrada y cata de café y vinos.</p>
                    </div>
                    <div className="p-4 rounded-2xl bg-white/10 border border-white/15 backdrop-blur-md">
                      <span className="text-xl font-serif font-bold text-emerald-400 block">Pilar III: Limpieza & Mermas (74 Ítems)</span>
                      <p className="text-xs text-slate-300 mt-1">Inocuidad HACCP, desinfección profunda y economía circular de residuos.</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Featured Section 3: Real Interactive Leaflet Route Map */}
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
                setActiveTab={setActiveTab}
                onQuickSearch={handleQuickSearch}
              />
            </div>

            {/* Featured Section 5: Distrito Cultural Urbano (Wynwood / Barcelona) */}
            <div className="border-t border-slate-200 bg-[#faf8f5] py-16">
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex flex-col md:flex-row items-start md:items-end justify-between mb-10 gap-4">
                  <div>
                    <span className="text-xs uppercase font-bold text-purple-800 flex items-center gap-1.5 mb-2">
                      <Palette className="w-4 h-4 text-purple-600" />
                      Turismo Urbano, Arte & Gastronomía
                    </span>
                    <h2 className="font-serif text-3xl sm:text-4xl font-bold text-slate-900">
                      Distrito Cultural & Gastronómico Urbano
                    </h2>
                    <p className="text-xs sm:text-sm text-slate-600 mt-1">
                      Mérida fusiona el muralismo andino monumental, el street food de autor, los cafés literarios y las cavas de jazz en una vibrante experiencia peatonal.
                    </p>
                  </div>
                  <button
                    onClick={() => { setActiveTab('cultural'); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
                    className="py-2.5 px-5 rounded-xl bg-purple-700 hover:bg-purple-800 text-white font-bold text-xs uppercase tracking-wider flex items-center gap-2 shadow-sm transition-all"
                  >
                    <span>Explorar Circuitos Urbanos</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-sm hover:shadow-md transition-all">
                    <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded bg-purple-100 text-purple-900">Muralismo & Street Art</span>
                    <h3 className="font-serif font-bold text-lg text-slate-900 mt-2">Bulevar Santa Juana</h3>
                    <p className="text-xs text-slate-600 mt-1">Más de 1.200 m² de intervenciones artísticas, luces de guirnalda y cervecería artesanal de páramo.</p>
                  </div>
                  <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-sm hover:shadow-md transition-all">
                    <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded bg-amber-100 text-amber-900">Patrimonio & Cafés</span>
                    <h3 className="font-serif font-bold text-lg text-slate-900 mt-2">Portales del Casco Histórico</h3>
                    <p className="text-xs text-slate-600 mt-1">Cafés de tertulia, librerías coloniales y dulcería abrillantada tradicional desde 1948.</p>
                  </div>
                  <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-sm hover:shadow-md transition-all">
                    <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded bg-sky-100 text-sky-900">Mixología & Noche</span>
                    <h3 className="font-serif font-bold text-lg text-slate-900 mt-2">Ruta de Jazz & Tapas</h3>
                    <p className="text-xs text-slate-600 mt-1">Speakeasies con botánicos andinos, chimeneas urbanas y música en vivo.</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Featured Section 6: Ecosystem Grid (Bolsa de Empleo, Academia ULA & Marco Jurídico) */}
            <div className="border-t border-slate-200 bg-white py-16">
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center max-w-3xl mx-auto mb-12">
                  <span className="text-xs uppercase font-bold text-amber-800 tracking-wider">Ecosistema Gremial Integral</span>
                  <h2 className="font-serif text-3xl sm:text-4xl font-bold text-slate-900 mt-1">
                    Servicios, Formación & Seguridad Jurídica
                  </h2>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  
                  {/* Card 1: Jobs */}
                  <div className="p-8 rounded-3xl bg-slate-50 border border-slate-200 flex flex-col justify-between hover:border-amber-400 hover:bg-white transition-all shadow-sm">
                    <div>
                      <div className="w-12 h-12 rounded-2xl bg-amber-100 text-amber-800 flex items-center justify-center mb-4">
                        <Briefcase className="w-6 h-6" />
                      </div>
                      <h3 className="font-serif font-bold text-xl text-slate-900">
                        Bolsa de Empleo Agremiada
                      </h3>
                      <p className="text-xs text-slate-600 mt-2 leading-relaxed">
                        Requerimientos laborales en cocina, barismo, sala y gerencia de A&B con salarios formales en divisas y beneficios preferenciales.
                      </p>
                    </div>
                    <button
                      onClick={() => { setActiveTab('jobs'); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
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
                      <h3 className="font-serif font-bold text-xl text-slate-900">
                        Academia Gastronómica & Expo 2027
                      </h3>
                      <p className="text-xs text-slate-600 mt-2 leading-relaxed">
                        Alianza con la ULA y Hotel Escuela para la Licenciatura en Gastronomía, centros de formación técnica y rumbo a Expo Andes 2027.
                      </p>
                    </div>
                    <button
                      onClick={() => { setActiveTab('academy'); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
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
                      <h3 className="font-serif font-bold text-xl text-slate-900">
                        Centro de Recursos & Marco Jurídico
                      </h3>
                      <p className="text-xs text-slate-600 mt-2 leading-relaxed">
                        Repositorio actualizado en normativas del SENIAT, SAMAT, SACS, ordenanzas fiscales y checklist interactivo de deberes formales.
                      </p>
                    </div>
                    <button
                      onClick={() => { setActiveTab('legal'); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
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

            {/* Featured Section 8: Tourist Concierge & Experiences */}
            <div className="border-t border-slate-200 bg-white py-16">
              <TouristServices t={t} />
            </div>

            {/* Guild Callout Banner */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
              <div className="p-8 sm:p-10 rounded-3xl bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 text-white shadow-xl flex flex-col md:flex-row items-center justify-between gap-6 text-center md:text-left">
                <div className="space-y-2">
                  <span className="text-xs uppercase font-bold px-3 py-1 rounded-full bg-amber-500/20 text-amber-400 border border-amber-500/30">
                    Gremio Empresarial
                  </span>
                  <h3 className="font-serif text-2xl sm:text-3xl font-bold text-white">
                    ¿Es Propietario o Chef de un Restaurante en Mérida?
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-300 max-w-2xl">
                    Únase a la Cámara Gastronómica del Estado Mérida. Obtenga el Sello Oficial de Calidad AAA, auditorías sanitarias, compras conjuntas y posicionamiento en guías turísticas internacionales.
                  </p>
                </div>
                <button
                  onClick={() => { setActiveTab('affiliates'); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
                  className="py-3.5 px-6 rounded-2xl bg-amber-500 hover:bg-amber-600 text-white font-serif font-bold text-xs uppercase tracking-wider shadow-md shrink-0 transition-all"
                >
                  Acceder al Portal de Afiliados
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Dedicated Page: Guía de Restaurantes */}
        {activeTab === 'guide' && (
          <div className="pt-24 pb-16">
            <RestaurantGuide 
              restaurants={RESTAURANTS_DATA} 
              onSelectRestaurant={setSelectedRestaurant}
              onBookDirect={handleBookDirect}
              onViewOnMap={handleViewOnMap}
              t={t}
              initialSearch={guideSearchTerm}
            />
          </div>
        )}

        {/* Dedicated Page: Mapa */}
        {activeTab === 'lidar' && (
          <div className="pt-24 pb-16">
            <LidarMap 
              onSelectRestaurantById={handleSelectRestaurantById}
              focusRestaurantId={focusRestaurantId}
              t={t}
            />
          </div>
        )}

        {/* Dedicated Page: Rutas & Sabores de Origen (Anteriormente Atributos & Terroir) */}
        {activeTab === 'terroir' && (
          <div className="pt-24 pb-16">
            <TerroirSection 
              t={t}
              setActiveTab={setActiveTab}
              onQuickSearch={handleQuickSearch}
            />
          </div>
        )}

        {/* Dedicated Page: Sello Mérida Gastronómica (226 Ítems AAA) */}
        {activeTab === 'sello' && (
          <div className="pt-24 pb-16">
            <SelloGastronomico 
              t={t}
              setActiveTab={setActiveTab}
            />
          </div>
        )}

        {/* Dedicated Page: Distrito Cultural Urbano (Wynwood / Barcelona) */}
        {activeTab === 'cultural' && (
          <div className="pt-24 pb-16">
            <CulturalDistrict 
              t={t}
              setActiveTab={setActiveTab}
              onQuickSearch={handleQuickSearch}
            />
          </div>
        )}

        {/* Dedicated Page: Bolsa de Empleo Agremiada */}
        {activeTab === 'jobs' && (
          <div className="pt-24 pb-16">
            <JobsSection 
              t={t}
              setActiveTab={setActiveTab}
            />
          </div>
        )}

        {/* Dedicated Page: Academia, Glubbi AI & Expo 2027 */}
        {activeTab === 'academy' && (
          <div className="pt-24 pb-16">
            <AcademyGlubbiSection 
              t={t}
              setActiveTab={setActiveTab}
            />
          </div>
        )}

        {/* Dedicated Page: Centro de Recursos y Marco Jurídico */}
        {activeTab === 'legal' && (
          <div className="pt-24 pb-16">
            <LegalResourceCenter 
              t={t}
              setActiveTab={setActiveTab}
            />
          </div>
        )}

        {/* Dedicated Page: Eventos */}
        {activeTab === 'events' && (
          <div className="pt-24 pb-16">
            <EventsCalendar t={t} />
          </div>
        )}

        {/* Dedicated Page: Vinculaciones Turísticas */}
        {activeTab === 'services' && (
          <div className="pt-24 pb-16">
            <TouristServices t={t} />
          </div>
        )}

        {/* Dedicated Page: Portal de Afiliados */}
        {activeTab === 'affiliates' && (
          <div className="pt-24 pb-16">
            <AffiliateDashboard t={t} />
          </div>
        )}
      </main>

      {/* Full Restaurant Modal */}
      {selectedRestaurant && (
        <RestaurantModal 
          restaurant={selectedRestaurant} 
          onClose={() => setSelectedRestaurant(null)}
          onViewOnMap={handleViewOnMap}
        />
      )}

      {/* Footer */}
      <Footer setActiveTab={setActiveTab} t={t} />

    </div>
  );
}
