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
  Layers
} from 'lucide-react';

export function Navbar({ activeTab, setActiveTab, lang, setLang, t }) {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [moreDropdownOpen, setMoreDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 30);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setMoreDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const primaryNavItems = [
    { id: 'home', label: t.nav.home, icon: Mountain },
    { id: 'guide', label: t.nav.guide, icon: UtensilsCrossed },
    { id: 'lidar', label: t.nav.lidarMap, icon: Compass },
    { id: 'terroir', label: t.nav.terroir, icon: Sparkles },
    { id: 'cultural', label: t.nav.cultural, icon: Palette },
    { id: 'sello', label: t.nav.sello, icon: Award },
  ];

  const secondaryNavItems = [
    { id: 'jobs', label: t.nav.jobs, icon: Briefcase, desc: 'Bolsa laboral de agremiados' },
    { id: 'academy', label: t.nav.academy, icon: GraduationCap, desc: 'Alianza ULA, Formación & Expo 2027' },
    { id: 'legal', label: t.nav.legal, icon: Scale, desc: 'SENIAT, SACS, ordenanzas y guías' },
    { id: 'events', label: t.nav.events, icon: Calendar, desc: 'Festivales, congresos y catas' },
    { id: 'services', label: t.nav.services, icon: MapPin, desc: 'Teleférico VIP, 4x4 y montaña' },
  ];

  const allNavItems = [
    ...primaryNavItems,
    ...secondaryNavItems
  ];

  const isTransparent = !isScrolled && activeTab === 'home';
  const isSecondaryActive = secondaryNavItems.some(item => item.id === activeTab);

  return (
    <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
      isTransparent 
        ? 'bg-transparent py-4 border-b border-white/10' 
        : 'bg-white/95 backdrop-blur-md py-3 border-b border-slate-200 shadow-md'
    }`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between">
          
          {/* Brand Logo */}
          <div 
            onClick={() => { setActiveTab('home'); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
            className="flex items-center gap-2.5 cursor-pointer group shrink-0"
          >
            <div className="relative w-11 h-11 rounded-2xl overflow-hidden shadow-md group-hover:scale-105 transition-transform bg-white/95 p-1 border border-amber-300/80 shrink-0">
              <img 
                src="/logo-merida-gastronomica.png" 
                alt="Mérida Gastronómica Logo Oficial" 
                className="w-full h-full object-contain filter drop-shadow-sm"
              />
              <div className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 bg-emerald-500 rounded-full ring-2 ring-white" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className={`font-serif font-bold text-base md:text-lg tracking-tight transition-colors ${
                  isTransparent ? 'text-white drop-shadow-md group-hover:text-amber-300' : 'text-slate-900 group-hover:text-amber-700'
                }`}>
                  MÉRIDA
                </span>
                <span className={`text-[9px] font-extrabold uppercase px-1.5 py-0.5 rounded transition-colors ${
                  isTransparent ? 'bg-amber-400/30 text-amber-300 border border-amber-400/40 backdrop-blur-sm' : 'bg-amber-100 text-amber-900 border border-amber-300'
                }`}>
                  GASTRONÓMICA
                </span>
              </div>
              <p className={`text-[10px] font-medium flex items-center gap-1 transition-colors ${
                isTransparent ? 'text-slate-200/90 drop-shadow-sm' : 'text-slate-500'
              }`}>
                <ShieldCheck className={`w-3 h-3 ${isTransparent ? 'text-amber-400' : 'text-amber-600'}`} />
                Cámara Gastronómica Oficial
              </p>
            </div>
          </div>

          {/* Desktop Navigation Links */}
          <nav className={`hidden xl:flex items-center gap-1 p-1 rounded-full border transition-all ${
            isTransparent 
              ? 'bg-black/35 backdrop-blur-md border-white/20 shadow-lg' 
              : 'bg-slate-100/90 border-slate-200/80 shadow-inner'
          }`}>
            {primaryNavItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => {
                    setActiveTab(item.id);
                    setMobileMenuOpen(false);
                  }}
                  className={`px-3 py-1.5 rounded-full text-xs font-bold transition-all duration-200 flex items-center gap-1.5 ${
                    isActive 
                      ? 'bg-white text-slate-900 shadow-md font-extrabold scale-105'
                      : isTransparent
                        ? 'text-white/90 hover:text-white hover:bg-white/20'
                        : 'text-slate-600 hover:text-amber-700 hover:bg-white/70'
                  }`}
                >
                  <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-amber-600' : ''}`} />
                  <span>{item.label}</span>
                </button>
              );
            })}

            {/* More Sections Dropdown */}
            <div className="relative" ref={dropdownRef}>
              <button
                onClick={() => setMoreDropdownOpen(!moreDropdownOpen)}
                className={`px-3 py-1.5 rounded-full text-xs font-bold transition-all duration-200 flex items-center gap-1.5 ${
                  isSecondaryActive
                    ? 'bg-amber-500 text-white shadow-md font-extrabold'
                    : isTransparent
                      ? 'text-white/90 hover:text-white hover:bg-white/20'
                      : 'text-slate-600 hover:text-amber-700 hover:bg-white/70'
                }`}
              >
                <Layers className="w-3.5 h-3.5" />
                <span>Más Gremio</span>
                <ChevronDown className={`w-3 h-3 transition-transform ${moreDropdownOpen ? 'rotate-180' : ''}`} />
              </button>

              {moreDropdownOpen && (
                <div className="absolute right-0 mt-2 w-64 rounded-2xl bg-white border border-slate-200 shadow-2xl p-2 z-50 text-slate-800 animate-fadeIn">
                  <div className="px-3 py-1.5 text-[10px] uppercase font-bold text-amber-800 tracking-wider border-b border-slate-100">
                    Ecosistema & Servicios
                  </div>
                  <div className="space-y-1 mt-1">
                    {secondaryNavItems.map((item) => {
                      const Icon = item.icon;
                      const isActive = activeTab === item.id;
                      return (
                        <button
                          key={item.id}
                          onClick={() => {
                            setActiveTab(item.id);
                            setMoreDropdownOpen(false);
                          }}
                          className={`w-full p-2.5 rounded-xl text-left transition-all flex items-start gap-2.5 ${
                            isActive
                              ? 'bg-amber-50 text-amber-900 border border-amber-200 font-bold'
                              : 'hover:bg-slate-50 text-slate-700'
                          }`}
                        >
                          <div className={`p-1.5 rounded-lg shrink-0 mt-0.5 ${isActive ? 'bg-amber-500 text-white' : 'bg-slate-100 text-slate-600'}`}>
                            <Icon className="w-4 h-4" />
                          </div>
                          <div>
                            <span className="text-xs font-bold block">{item.label}</span>
                            <span className="text-[10px] text-slate-500 block leading-tight">{item.desc}</span>
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          </nav>

          {/* Right Controls */}
          <div className="hidden lg:flex items-center gap-2.5">
            
            {/* Language Switcher */}
            <div className={`flex items-center rounded-full border p-0.5 text-xs font-bold transition-colors ${
              isTransparent 
                ? 'bg-black/35 backdrop-blur-md border-white/20' 
                : 'bg-slate-100 border-slate-200'
            }`}>
              <button
                onClick={() => setLang('es')}
                className={`px-2 py-0.5 rounded-full transition-all ${
                  lang === 'es' 
                    ? 'bg-amber-500 text-white shadow-sm' 
                    : isTransparent ? 'text-white/80 hover:text-white' : 'text-slate-500 hover:text-slate-800'
                }`}
              >
                ES
              </button>
              <button
                onClick={() => setLang('en')}
                className={`px-2 py-0.5 rounded-full transition-all ${
                  lang === 'en' 
                    ? 'bg-amber-500 text-white shadow-sm' 
                    : isTransparent ? 'text-white/80 hover:text-white' : 'text-slate-500 hover:text-slate-800'
                }`}
              >
                EN
              </button>
            </div>

            {/* Affiliate Portal Button */}
            <button
              onClick={() => setActiveTab('affiliates')}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all shadow-md ${
                isTransparent
                  ? 'bg-white/90 hover:bg-white text-slate-900 backdrop-blur-md border border-white/40'
                  : 'bg-slate-900 hover:bg-slate-800 text-white'
              }`}
            >
              <UserCheck className="w-3.5 h-3.5 text-amber-400" />
              <span>{t.nav.affiliates}</span>
            </button>
          </div>

          {/* Mobile Menu Trigger */}
          <div className="flex xl:hidden items-center gap-2">
            <div className={`flex items-center rounded-full border p-0.5 text-xs font-bold ${
              isTransparent ? 'bg-black/40 border-white/20 text-white' : 'bg-slate-100 border-slate-200 text-slate-800'
            }`}>
              <button
                onClick={() => setLang(lang === 'es' ? 'en' : 'es')}
                className="px-2 py-0.5 font-bold"
              >
                {lang.toUpperCase()}
              </button>
            </div>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className={`p-2 rounded-xl border transition-colors ${
                isTransparent ? 'bg-black/40 border-white/20 text-white' : 'bg-slate-100 border-slate-200 text-slate-700 hover:text-amber-600'
              }`}
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>

        </div>
      </div>

      {/* Mobile Dropdown Menu */}
      {mobileMenuOpen && (
        <div className="xl:hidden bg-white border-b border-slate-200 px-4 pt-3 pb-6 mt-2 shadow-2xl animate-fadeIn text-slate-800 max-h-[85vh] overflow-y-auto">
          <div className="space-y-1">
            <div className="px-3 py-1 text-[10px] font-bold uppercase text-amber-800 tracking-wider">
              Navegación Principal
            </div>

            {allNavItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => {
                    setActiveTab(item.id);
                    setMobileMenuOpen(false);
                  }}
                  className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all ${
                    isActive
                      ? 'bg-amber-500 text-white shadow-md'
                      : 'text-slate-700 hover:bg-slate-50'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <Icon className="w-4 h-4" />
                    <span>{item.label}</span>
                  </div>
                  <ChevronRight className="w-3.5 h-3.5 opacity-70" />
                </button>
              );
            })}

            <div className="pt-3 border-t border-slate-100 mt-2">
              <button
                onClick={() => {
                  setActiveTab('affiliates');
                  setMobileMenuOpen(false);
                }}
                className="w-full flex items-center justify-between px-4 py-3 rounded-xl text-xs font-bold bg-slate-900 text-white"
              >
                <div className="flex items-center gap-2.5">
                  <UserCheck className="w-4 h-4 text-amber-400" />
                  <span>{t.nav.affiliates}</span>
                </div>
                <span className="text-[9px] uppercase font-bold px-2 py-0.5 rounded bg-amber-500 text-white">
                  Acceso Gremial
                </span>
              </button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
