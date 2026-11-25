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
  LayoutGrid,
  Coffee,
  Lock,
  Users, Building2
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
    { id: 'guide', label: 'Guía de Restaurantes' },
    { id: 'directorio', label: 'Directorio de Agremiados' },
    { id: 'terroir', label: 'Rutas Mérida' },
    { id: 'cultural', label: 'Distrito Cultural' },
    { id: 'services', label: 'Servicios Turísticos' },
  ];

  // Complete catalog of all sections for the "☰ Todos" drawer/modal
  const allPlatformSections = [
    {
      category: "Turismo & Gastronomía",
      items: [
        { id: 'home', label: 'Inicio', desc: 'Portada editorial y bienvenida oficial', icon: Mountain },
        { id: 'guide', label: 'Guía de Restaurantes', desc: 'Restaurantes clasificados por tipo de comida', icon: UtensilsCrossed },
        { id: 'prestadores', label: 'Prestadores de Servicios', desc: 'Guía general de cafés, posadas, marcas y servicios', icon: Building2 },
        { id: 'el_valle_ruta', label: 'Ruta El Valle te Conecta', desc: 'Posadas, bistros y paquetes turísticos de montaña', icon: Mountain },
        { id: 'lidar', label: 'Mapa de Ubicación', desc: 'Mapa 2D interactivo y enlace directo a Google Maps', icon: Compass },
        { id: 'terroir', label: 'Rutas Mérida', desc: 'Productos de páramo, piso térmico y terruño', icon: Sparkles },
        { id: 'cafe', label: 'Café de Especialidad', desc: 'Rutas andinas, microclimas y métodos de extracción', icon: Coffee },
        { id: 'cacao', label: 'Cacao Porcelana', desc: 'Genética criolla pura, bean-to-bar y maridajes', icon: Sparkles },
        { id: 'cultural', label: 'Distrito Cultural', desc: 'Muralismo, jazz, speakeasies y casco colonial', icon: Palette },
        { id: 'services', label: 'Servicios Turísticos', desc: 'Teleférico VIP, 4x4, posadas y guías', icon: MapPin },
        { id: 'events', label: 'Calendario de Eventos', desc: 'Festivales del Sol, catas y congresos', icon: Calendar },
      ]
    },
    {
      category: "Gremio & Desarrollo Empresarial",
      items: [
        { id: 'affiliates_register', label: 'Solicitar Afiliación', desc: 'Registro formal de nuevo establecimiento agremiado', icon: Sparkles },
        { id: 'directorio', label: 'Directorio de Agremiados', desc: 'Nómina oficial de marcas, restaurantes y productores', icon: Building2 },
        { id: 'junta_directiva', label: 'Junta Directiva Oficial', desc: 'Equipo directivo y coordinaciones especializadas', icon: Users },
        { id: 'beneficios', label: 'Beneficios de Ser Agremiado', desc: 'Los 10 pilares estratégicos y valor institucional', icon: Award },
        { id: 'affiliates', label: 'Portal de Afiliados', desc: 'Acceso con clave, solvencias y certificados', icon: ShieldCheck },
        { id: 'jobs', label: 'Bolsa de Empleo Agremiada', desc: 'Ofertas laborales en sala, cocina y barismo', icon: Briefcase },
        { id: 'academy', label: 'Cursos & Academia Gastronómica', desc: 'Capacitaciones oficiales, talleres técnicos, Alianza ULA y Expo 2027', icon: GraduationCap },
        { id: 'admin', label: 'Portal Junta Directiva (Privado)', desc: 'Acceso privado de planificación, agenda y actas', icon: Lock },
      ]
    }
  ];

  const isAtTopHome = !isScrolled && activeTab === 'home';

  const handleNavClick = (tabId) => {
    setActiveTab(tabId);
    setMobileMenuOpen(false);
    setAllSectionsModalOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <>
      <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isAtTopHome 
          ? 'bg-[#FAF7F2]/85 backdrop-blur-md py-3.5 border-b border-[#EAE3D5]/70' 
          : 'bg-[#FAF7F2]/95 backdrop-blur-md py-3 border-b border-[#EAE3D5] shadow-sm'
      }`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between gap-4">
            
            {/* Left: Brand Logo & Institutional Title */}
            <div 
              onClick={() => handleNavClick('home')}
              className="flex items-center gap-3 cursor-pointer group shrink-0"
            >
              <div className="relative w-10 h-10 rounded-xl overflow-hidden shadow-2xs group-hover:scale-105 transition-transform bg-white p-1 border border-[#EAE3D5] shrink-0 flex items-center justify-center">
                <img 
                  src="/logo-merida-gastronomica.png" 
                  alt="Mérida Gastronómica Logo Oficial" 
                  className="w-full h-full object-contain"
                />
              </div>
              
              <div className="flex flex-col">
                <span className="font-playfair tracking-[0.01em] font-bold text-base sm:text-lg text-[#1E1C1A] group-hover:text-[#C85A32] leading-tight transition-colors">
                  Mérida Gastronómica
                </span>
                <p className="text-[10px] tracking-[0.05em] font-medium text-[#7A7168] uppercase mt-0.5 hidden sm:block">
                  Cámara Gastronómica • Mérida
                </p>
              </div>
            </div>

            {/* Center: Clean Editorial Desktop Navigation */}
            <nav className="hidden lg:flex items-center gap-1.5 px-2 py-1 rounded-full bg-white/80 border border-[#EAE3D5] shadow-2xs">
              
              {/* "☰ Todos" Trigger Button */}
              <button
                onClick={() => setAllSectionsModalOpen(true)}
                className="px-3 py-1.5 rounded-full text-xs font-semibold text-[#5C554E] hover:text-[#1E1C1A] hover:bg-[#F5EFE6] transition-all duration-200 flex items-center gap-1.5"
                title="Ver todas las secciones de la plataforma"
              >
                <LayoutGrid className="w-3.5 h-3.5 text-[#C85A32]" />
                <span>Menú</span>
              </button>

              {/* Main Visible Items */}
              {mainBarItems.map((item) => {
                const isActive = activeTab === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => handleNavClick(item.id)}
                    className={`px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all duration-200 flex items-center ${
                      isActive 
                        ? 'text-[#C85A32] bg-[#FAF3EB] font-bold' 
                        : 'text-[#5C554E] hover:text-[#1E1C1A] hover:bg-[#FAF7F2]'
                    }`}
                  >
                    <span>{item.label}</span>
                  </button>
                );
              })}
            </nav>

            {/* Right: Portal Afiliados & Afíliate Pill CTA */}
            <div className="hidden sm:flex items-center gap-2.5 shrink-0">
              <button
                onClick={() => handleNavClick('affiliates')}
                className={`px-4 py-2 rounded-full text-xs font-semibold flex items-center gap-1.5 transition-all border ${
                  activeTab === 'affiliates'
                    ? 'bg-[#1E1C1A] text-white border-[#1E1C1A] shadow-sm'
                    : 'bg-white hover:bg-[#FAF3EB] text-[#1E1C1A] border-[#DED5C5]'
                }`}
              >
                <ShieldCheck className="w-3.5 h-3.5 text-[#C85A32]" />
                <span>Portal Afiliados</span>
              </button>

              <button
                onClick={() => handleNavClick('affiliates_register')}
                className="px-4 py-2 rounded-full text-xs font-bold flex items-center gap-1.5 transition-all shadow-sm bg-[#C85A32] hover:bg-[#B04B26] text-white active:scale-[0.98]"
                title="Solicitar Afiliación"
              >
                <span>Afíliate</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Mobile Action + Menu Button */}
            <div className="lg:hidden flex items-center gap-2">
              <button
                onClick={() => handleNavClick('affiliates_register')}
                className="sm:hidden px-3 py-1.5 rounded-full text-[11px] font-bold bg-[#C85A32] text-white shadow-2xs"
              >
                Afíliate
              </button>
              <button
                onClick={() => setAllSectionsModalOpen(true)}
                className="p-2 rounded-full bg-white text-[#1E1C1A] border border-[#EAE3D5] shadow-2xs"
                title="Menú Completo"
              >
                <LayoutGrid className="w-5 h-5 text-[#C85A32]" />
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