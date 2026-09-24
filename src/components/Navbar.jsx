import React, { useState, useEffect, useRef } from 'react';
import { 
  Compass, 
  MapPin, 
  Calendar, 
  Sparkles, 
  ShieldCheck, 
  Menu, 
  X, 
  UtensilsCrossed, 
  Mountain, 
  ChevronRight, 
  UserCheck,
  Briefcase,
  Palette,
  Award,
  GraduationCap,
  Scale,
  ChevronDown,
  Layers,
  LayoutGrid
} from 'lucide-react';

export function Navbar({ activeTab, setActiveTab, lang, setLang, t }) {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [allSectionsModalOpen, setAllSectionsModalOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 30);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Main navigation items shown on desktop bar
  const mainBarItems = [
    { id: 'home', label: 'Inicio' },
    { id: 'guide', label: 'Guía de Restaurantes', icon: UtensilsCrossed },
    { id: 'lidar', label: 'Mapa Gastronómico', icon: Compass },
    { id: 'terroir', label: 'Rutas Mérida', icon: Sparkles },
    { id: 'cultural', label: 'Distrito Cultural', icon: Palette },
    { id: 'services', label: 'Servicios Turísticos', icon: MapPin },
  ];

  // Complete catalog of all sections for the "☰ Todos" drawer/modal
  const allPlatformSections = [
    {
      category: "Turismo & Gastronomía",
      items: [
        { id: 'home', label: 'Inicio', desc: 'Portada editorial y bienvenida oficial', icon: Mountain },
        { id: 'guide', label: 'Guía de Restaurantes', desc: 'Fichas oficiales, menús, fotos y reservas', icon: UtensilsCrossed },
        { id: 'lidar', label: 'Mapa Gastronómico 3D', desc: 'Cartografía satelital con radar de altitud', icon: Compass },
        { id: 'terroir', label: 'Rutas Mérida', desc: 'Café de especialidad, cacao porcelana y páramo', icon: Sparkles },
        { id: 'cultural', label: 'Distrito Cultural', desc: 'Muralismo, jazz, speakeasies y casco colonial', icon: Palette },
        { id: 'services', label: 'Servicios Turísticos', desc: 'Teleférico VIP, 4x4, posadas y guías', icon: MapPin },
        { id: 'events', label: 'Calendario de Eventos', desc: 'Festivales del Sol, catas y congresos', icon: Calendar },
      ]
    },
    {
      category: "Gremio & Desarrollo Empresarial",
      items: [
        { id: 'affiliates', label: 'Portal de Afiliados', desc: 'Acceso con clave, solvencias y certificados', icon: ShieldCheck },
        { id: 'sello', label: 'Sello de Calidad AAA', desc: 'Norma técnica de 226 ítems de excelencia', icon: Award },
        { id: 'jobs', label: 'Bolsa de Empleo Agremiada', desc: 'Ofertas laborales en sala, cocina y barismo', icon: Briefcase },
        { id: 'academy', label: 'Academia & Expo 2027', desc: 'Alianza ULA, Hotel Escuela y formación', icon: GraduationCap },
        { id: 'legal', label: 'Marco Jurídico & SENIAT', desc: 'Normativas SAMAT, SACS y ordenanzas', icon: Scale },
      ]
    }
  ];

  const isTransparent = !isScrolled && activeTab === 'home';

  const handleNavClick = (tabId) => {
    setActiveTab(tabId);
    setMobileMenuOpen(false);
    setAllSectionsModalOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <>
      <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isTransparent 
          ? 'bg-transparent py-4 border-b border-white/10' 
          : 'bg-white/95 backdrop-blur-md py-3 border-b border-slate-200 shadow-md'
      }`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            
            {/* Left: Brand Logo & Institutional Title */}
            <div 
              onClick={() => handleNavClick('home')}
              className="flex items-center gap-3 cursor-pointer group shrink-0"
            >
              <div className="relative w-11 h-11 rounded-2xl overflow-hidden shadow-md group-hover:scale-105 transition-transform bg-white/95 p-1 border border-amber-300/80 shrink-0 flex items-center justify-center">
                <img 
                  src="/logo-merida-gastronomica.png" 
                  alt="Mérida Gastronómica Logo Oficial" 
                  className="w-full h-full object-contain filter drop-shadow-sm"
                />
              </div>
              
              <div className="flex flex-col">
                <div className="flex items-center gap-2">
                  <span className={`font-serif tracking-[0.12em] font-extrabold text-base md:text-lg transition-colors ${
                    isTransparent ? 'text-white drop-shadow-md' : 'text-slate-900 group-hover:text-amber-700'
                  }`}>
                    MÉRIDA
                  </span>
                  <span className={`text-[9px] font-extrabold uppercase tracking-[0.2em] px-1.5 py-0.5 rounded transition-colors ${
                    isTransparent 
                      ? 'bg-amber-400/25 text-amber-300 border border-amber-400/40 backdrop-blur-sm' 
                      : 'bg-amber-100 text-amber-900 border border-amber-300'
                  }`}>
                    GASTRONÓMICA
                  </span>
                </div>
                <p className={`text-[9px] uppercase tracking-wider font-bold flex items-center gap-1 mt-0.5 transition-colors ${
                  isTransparent ? 'text-slate-200/90 drop-shadow-sm' : 'text-slate-500'
                }`}>
                  Cámara Gastronómica del Estado Mérida
                </p>
              </div>
            </div>

            {/* Center: Desktop Navigation Bar */}
            <nav className={`hidden lg:flex items-center gap-1 p-1 rounded-full border transition-all ${
              isTransparent 
                ? 'bg-black/35 backdrop-blur-md border-white/20 shadow-lg' 
                : 'bg-slate-100/90 border-slate-200/80 shadow-inner'
            }`}>
              
              {/* "☰ Todos" Trigger Button */}
              <button
                onClick={() => setAllSectionsModalOpen(true)}
                className={`px-3.5 py-1.5 rounded-full text-xs font-bold transition-all duration-200 flex items-center gap-1.5 ${
                  isTransparent
                    ? 'bg-white/20 text-white hover:bg-white/30'
                    : 'bg-slate-200 text-slate-800 hover:bg-slate-300'
                }`}
                title="Ver todas las secciones de la plataforma"
              >
                <LayoutGrid className="w-3.5 h-3.5 text-amber-400" />
                <span>Todos</span>
              </button>

              {/* Main Visible Items */}
              {mainBarItems.map((item) => {
                const Icon = item.icon;
                const isActive = activeTab === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => handleNavClick(item.id)}
                    className={`px-3 py-1.5 rounded-full text-xs font-bold transition-all duration-200 flex items-center gap-1.5 ${
                      isActive 
                        ? 'bg-white text-slate-900 shadow-md font-extrabold scale-105'
                        : isTransparent
                          ? 'text-white/90 hover:text-white hover:bg-white/20'
                          : 'text-slate-600 hover:text-amber-700 hover:bg-white/70'
                    }`}
                  >
                    {Icon && <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-amber-600' : ''}`} />}
                    <span>{item.label}</span>
                  </button>
                );
              })}
            </nav>

            {/* Right: Portal Afiliados Action Button */}
            <div className="hidden sm:flex items-center gap-2">
              <button
                onClick={() => handleNavClick('affiliates')}
                className={`px-3.5 py-2 rounded-xl text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 transition-all shadow-sm ${
                  activeTab === 'affiliates'
                    ? 'bg-amber-500 text-white shadow-md'
                    : isTransparent
                      ? 'bg-white/15 hover:bg-white/25 text-amber-300 border border-amber-400/40 backdrop-blur-md'
                      : 'bg-slate-900 hover:bg-slate-800 text-amber-300 border border-slate-700'
                }`}
              >
                <ShieldCheck className="w-4 h-4 text-amber-400" />
                <span>Portal Afiliados</span>
              </button>
            </div>

            {/* Mobile Menu Button */}
            <div className="lg:hidden flex items-center gap-2">
              <button
                onClick={() => setAllSectionsModalOpen(true)}
                className={`p-2 rounded-xl border ${
                  isTransparent 
                    ? 'bg-white/10 text-white border-white/20' 
                    : 'bg-slate-100 text-slate-800 border-slate-200'
                }`}
                title="Menú Completo"
              >
                <LayoutGrid className="w-5 h-5 text-amber-400" />
              </button>
            </div>

          </div>
        </div>
      </header>

      {/* FULL MEGA-MENU / DRAWER: "☰ TODOS" */}
      {allSectionsModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4 sm:p-6 overflow-y-auto animate-fadeIn">
          <div className="bg-white rounded-3xl max-w-4xl w-full p-6 sm:p-8 shadow-2xl relative my-8 border border-slate-200 max-h-[90vh] overflow-y-auto">
            
            {/* Modal Header */}
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-white border border-amber-300 p-1 flex items-center justify-center shadow-sm">
                  <img src="/logo-merida-gastronomica.png" alt="Logo" className="w-full h-full object-contain" />
                </div>
                <div>
                  <h3 className="font-serif font-bold text-xl text-slate-900">
                    Todas las Secciones & Ecosistema Gremial
                  </h3>
                  <p className="text-xs text-slate-500">
                    Cámara Gastronómica del Estado Mérida — Guía y Portal Oficial
                  </p>
                </div>
              </div>

              <button
                onClick={() => setAllSectionsModalOpen(false)}
                className="p-2 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-600 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Sections Catalog Grid */}
            <div className="py-6 space-y-6">
              {allPlatformSections.map((group, idx) => (
                <div key={idx} className="space-y-3">
                  <h4 className="font-serif font-bold text-xs uppercase tracking-widest text-amber-800 flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-amber-500" />
                    <span>{group.category}</span>
                  </h4>

                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                    {group.items.map((item) => {
                      const Icon = item.icon;
                      const isCurrent = activeTab === item.id;
                      return (
                        <div
                          key={item.id}
                          onClick={() => handleNavClick(item.id)}
                          className={`p-3.5 rounded-2xl border transition-all cursor-pointer flex items-start gap-3 ${
                            isCurrent
                              ? 'bg-amber-50 border-amber-500 shadow-md ring-2 ring-amber-400/20'
                              : 'bg-slate-50/70 border-slate-200 hover:border-amber-400 hover:bg-white hover:shadow-sm'
                          }`}
                        >
                          <div className={`p-2.5 rounded-xl shrink-0 mt-0.5 ${
                            isCurrent ? 'bg-amber-500 text-white' : 'bg-white border border-slate-200 text-amber-600'
                          }`}>
                            <Icon className="w-4 h-4" />
                          </div>

                          <div>
                            <h5 className="font-serif font-bold text-sm text-slate-900 leading-snug">
                              {item.label}
                            </h5>
                            <p className="text-[11px] text-slate-500 mt-0.5 leading-tight">
                              {item.desc}
                            </p>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>

            {/* Footer inside Modal */}
            <div className="pt-4 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
              <span>Mérida Gastronómica © 2026</span>
              <button
                onClick={() => setAllSectionsModalOpen(false)}
                className="py-2 px-4 rounded-xl bg-slate-900 text-white font-bold text-xs"
              >
                Cerrar
              </button>
            </div>

          </div>
        </div>
      )}
    </>
  );
}
