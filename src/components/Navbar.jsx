import React, { useState, useEffect } from 'react';
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
  UserCheck 
} from 'lucide-react';

export function Navbar({ activeTab, setActiveTab, lang, setLang, t }) {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 30);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navItems = [
    { id: 'home', label: t.nav.home, icon: Mountain },
    { id: 'guide', label: t.nav.guide, icon: UtensilsCrossed },
    { id: 'lidar', label: t.nav.lidarMap, icon: Compass },
    { id: 'events', label: t.nav.events, icon: Calendar },
    { id: 'terroir', label: t.nav.terroir, icon: Sparkles },
    { id: 'services', label: t.nav.services, icon: MapPin },
  ];

  // Dynamic colors depending on whether navbar is over Hero (transparent) or scrolled (white)
  const isTransparent = !isScrolled && activeTab === 'home';

  return (
    <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
      isTransparent 
        ? 'bg-transparent py-5 border-b border-white/10' 
        : 'bg-white/95 backdrop-blur-md py-3.5 border-b border-slate-200 shadow-md'
    }`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between">
          
          {/* Brand Logo */}
          <div 
            onClick={() => { setActiveTab('home'); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
            className="flex items-center gap-3 cursor-pointer group"
          >
            <div className={`relative w-11 h-11 rounded-2xl flex items-center justify-center shadow-md group-hover:scale-105 transition-transform text-white ${
              isTransparent ? 'bg-gradient-to-br from-amber-500 to-terracotta border border-white/30' : 'bg-gradient-to-br from-amber-500 to-terracotta'
            }`}>
              <Mountain className="w-6 h-6" />
              <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-emerald-400 rounded-full ring-2 ring-white" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className={`font-serif font-bold text-lg md:text-xl tracking-tight transition-colors ${
                  isTransparent ? 'text-white drop-shadow-md group-hover:text-amber-300' : 'text-slate-900 group-hover:text-amber-700'
                }`}>
                  MÉRIDA
                </span>
                <span className={`text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-md transition-colors ${
                  isTransparent ? 'bg-amber-400/30 text-amber-300 border border-amber-400/40 backdrop-blur-sm' : 'bg-amber-100 text-amber-900 border border-amber-300'
                }`}>
                  GASTRONÓMICA
                </span>
              </div>
              <p className={`text-[11px] font-medium flex items-center gap-1 transition-colors ${
                isTransparent ? 'text-slate-200/90 drop-shadow-sm' : 'text-slate-500'
              }`}>
                <ShieldCheck className={`w-3.5 h-3.5 ${isTransparent ? 'text-amber-400' : 'text-amber-600'}`} />
                Cámara Gastronómica Oficial
              </p>
            </div>
          </div>

          {/* Desktop Navigation Links */}
          <nav className={`hidden lg:flex items-center gap-1 p-1.5 rounded-full border transition-all ${
            isTransparent 
              ? 'bg-black/35 backdrop-blur-md border-white/20 shadow-lg' 
              : 'bg-slate-100/90 border-slate-200/80 shadow-inner'
          }`}>
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => {
                    setActiveTab(item.id);
                    setMobileMenuOpen(false);
                  }}
                  className={`px-4 py-2 rounded-full text-xs font-bold transition-all duration-200 flex items-center gap-2 ${
                    isActive 
                      ? isTransparent
                        ? 'bg-white text-slate-900 shadow-md font-extrabold scale-105'
                        : 'bg-white text-slate-900 shadow-md font-extrabold scale-105'
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
          </nav>

          {/* Right Controls */}
          <div className="hidden lg:flex items-center gap-3">
            
            {/* Language Switcher */}
            <div className={`flex items-center rounded-full border p-0.5 text-xs font-bold transition-colors ${
              isTransparent 
                ? 'bg-black/35 backdrop-blur-md border-white/20' 
                : 'bg-slate-100 border-slate-200'
            }`}>
              <button
                onClick={() => setLang('es')}
                className={`px-2.5 py-1 rounded-full transition-all ${
                  lang === 'es' 
                    ? 'bg-amber-500 text-white shadow-sm' 
                    : isTransparent ? 'text-white/80 hover:text-white' : 'text-slate-500 hover:text-slate-800'
                }`}
              >
                ES
              </button>
              <button
                onClick={() => setLang('en')}
                className={`px-2.5 py-1 rounded-full transition-all ${
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
              className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-2 transition-all shadow-md ${
                isTransparent
                  ? 'bg-white/90 hover:bg-white text-slate-900 backdrop-blur-md border border-white/40'
                  : 'bg-amber-500 hover:bg-amber-600 text-white'
              }`}
            >
              <UserCheck className="w-3.5 h-3.5 text-amber-600" />
              <span>{t.nav.affiliates}</span>
            </button>
          </div>

          {/* Mobile Menu Trigger */}
          <div className="flex lg:hidden items-center gap-2">
            <div className={`flex items-center rounded-full border p-0.5 text-xs font-bold ${
              isTransparent ? 'bg-black/40 border-white/20 text-white' : 'bg-slate-100 border-slate-200 text-slate-800'
            }`}>
              <button
                onClick={() => setLang(lang === 'es' ? 'en' : 'es')}
                className="px-2.5 py-0.5 font-bold"
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
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>

        </div>
      </div>

      {/* Mobile Dropdown Menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-white border-b border-slate-200 px-4 pt-3 pb-6 mt-2 shadow-xl animate-fadeIn text-slate-800">
          <div className="space-y-1.5">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => {
                    setActiveTab(item.id);
                    setMobileMenuOpen(false);
                  }}
                  className={`w-full flex items-center justify-between px-4 py-3 rounded-xl text-sm font-bold transition-all ${
                    isActive
                      ? 'bg-amber-500 text-white shadow-md'
                      : 'text-slate-700 hover:bg-slate-50'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Icon className="w-4 h-4" />
                    <span>{item.label}</span>
                  </div>
                  <ChevronRight className="w-4 h-4 opacity-70" />
                </button>
              );
            })}

            <div className="pt-3 border-t border-slate-100">
              <button
                onClick={() => {
                  setActiveTab('affiliates');
                  setMobileMenuOpen(false);
                }}
                className="w-full flex items-center justify-between px-4 py-3 rounded-xl text-sm font-bold bg-slate-900 text-white"
              >
                <div className="flex items-center gap-3">
                  <UserCheck className="w-4 h-4 text-amber-400" />
                  <span>{t.nav.affiliates}</span>
                </div>
                <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded bg-amber-500 text-white">
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
