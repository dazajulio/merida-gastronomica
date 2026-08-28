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
import { Footer } from './components/Footer';

import { RESTAURANTS_DATA } from './data/restaurantsData';
import { translations } from './data/translations';
import { 
  Sparkles, 
  ArrowRight
} from 'lucide-react';

export function App() {
  const [activeTab, setActiveTab] = useState('home'); // home | guide | lidar | events | terroir | services | affiliates
  const [lang, setLang] = useState('es');
  const [selectedRestaurant, setSelectedRestaurant] = useState(null);
  const [guideSearchTerm, setGuideSearchTerm] = useState('');

  const t = translations[lang] || translations.es;

  const handleSelectRestaurantById = (id) => {
    const found = RESTAURANTS_DATA.find(r => r.id === id);
    if (found) {
      setSelectedRestaurant(found);
    }
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
                  t={t}
                  initialSearch=""
                />
              </div>
            </div>

            {/* Featured Section 2: Real Interactive Leaflet Route Map */}
            <div className="border-t border-slate-200 bg-[#f8f6f0] py-16">
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <LidarMap 
                  onSelectRestaurantById={handleSelectRestaurantById}
                  t={t}
                />
              </div>
            </div>

            {/* Featured Section 3: Terroir, Cacao & Café */}
            <div className="border-t border-slate-200 bg-white py-16">
              <TerroirSection 
                t={t}
                setActiveTab={setActiveTab}
                onQuickSearch={handleQuickSearch}
              />
            </div>

            {/* Featured Section 4: Events Calendar */}
            <div className="border-t border-slate-200 bg-[#f8f6f0] py-16">
              <EventsCalendar t={t} />
            </div>

            {/* Featured Section 5: Tourist Concierge & Experiences */}
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
                    Únase a la Cámara Gastronómica del Estado Mérida. Obtenga el Sello Oficial de Calidad, auditorías sanitarias, compras conjuntas y posicionamiento en guías turísticas internacionales.
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
              t={t}
            />
          </div>
        )}

        {/* Dedicated Page: Eventos */}
        {activeTab === 'events' && (
          <div className="pt-24 pb-16">
            <EventsCalendar t={t} />
          </div>
        )}

        {/* Dedicated Page: Terroir & Atributos */}
        {activeTab === 'terroir' && (
          <div className="pt-24 pb-16">
            <TerroirSection 
              t={t}
              setActiveTab={setActiveTab}
              onQuickSearch={handleQuickSearch}
            />
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
          onNavigateToLidar={() => {
            setSelectedRestaurant(null);
            setActiveTab('lidar');
          }}
        />
      )}

      {/* Footer */}
      <Footer setActiveTab={setActiveTab} t={t} />

    </div>
  );
}
