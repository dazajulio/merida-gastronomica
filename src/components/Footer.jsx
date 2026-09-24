import React from 'react';
import { 
  Mountain, 
  ShieldCheck, 
  MapPin, 
  Phone, 
  Mail, 
  Compass, 
  ArrowUp,
  Award,
  Briefcase,
  GraduationCap,
  Palette,
  Scale
} from 'lucide-react';

export function Footer({ setActiveTab, t }) {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="bg-slate-900 border-t border-slate-800 pt-16 pb-10 text-slate-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Top Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 pb-12 border-b border-slate-800">
          
          {/* Col 1 & 2: Brand */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-13 h-13 rounded-2xl bg-white/95 border border-amber-400/50 p-1 flex items-center justify-center shadow-lg shrink-0">
                <img 
                  src="/logo-merida-gastronomica.png" 
                  alt="Mérida Gastronómica Logo Oficial" 
                  className="w-11 h-11 object-contain"
                />
              </div>
              <div>
                <span className="font-serif font-bold text-xl text-white tracking-tight block">
                  MÉRIDA GASTRONÓMICA
                </span>
                <span className="text-[11px] uppercase text-amber-400 font-bold tracking-wider block">
                  Cámara Gastronómica del Estado Mérida
                </span>
              </div>
            </div>

            <p className="text-xs text-slate-400 leading-relaxed max-w-md">
              Organización gremial oficial dedicada a certificar, promover e internacionalizar la riqueza gastronómica, agroecológica y turística del estado Mérida, Venezuela.
            </p>

            <div className="pt-2">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-slate-800 text-amber-400 border border-amber-500/30">
                <ShieldCheck className="w-3.5 h-3.5" />
                Norma Técnica y Sello de Calidad AAA
              </span>
            </div>
          </div>

          {/* Col 3: Gastronomía & Rutas */}
          <div className="space-y-3">
            <h4 className="font-serif font-bold text-sm text-white uppercase tracking-wider">
              Guía & Rutas
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <button onClick={() => { setActiveTab('guide'); scrollToTop(); }} className="hover:text-amber-400 transition-colors">
                  Guía de Restaurantes
                </button>
              </li>
              <li>
                <button onClick={() => { setActiveTab('lidar'); scrollToTop(); }} className="hover:text-amber-400 transition-colors flex items-center gap-1">
                  <Compass className="w-3.5 h-3.5 text-amber-400" />
                  <span>Mapa LiDAR 3D</span>
                </button>
              </li>
              <li>
                <button onClick={() => { setActiveTab('terroir'); scrollToTop(); }} className="hover:text-amber-400 transition-colors">
                  Rutas & Sabores de Origen
                </button>
              </li>
              <li>
                <button onClick={() => { setActiveTab('cultural'); scrollToTop(); }} className="hover:text-amber-400 transition-colors flex items-center gap-1">
                  <Palette className="w-3.5 h-3.5 text-pink-400" />
                  <span>Distrito Cultural Urbano</span>
                </button>
              </li>
              <li>
                <button onClick={() => { setActiveTab('events'); scrollToTop(); }} className="hover:text-amber-400 transition-colors">
                  Agenda de Eventos
                </button>
              </li>
              <li>
                <button onClick={() => { setActiveTab('services'); scrollToTop(); }} className="hover:text-amber-400 transition-colors">
                  Vinculaciones Turísticas
                </button>
              </li>
            </ul>
          </div>

          {/* Col 4: Gremio, Calidad & Academia */}
          <div className="space-y-3">
            <h4 className="font-serif font-bold text-sm text-white uppercase tracking-wider">
              Gremio & Academia
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <button onClick={() => { setActiveTab('sello'); scrollToTop(); }} className="hover:text-amber-400 transition-colors flex items-center gap-1 text-amber-300">
                  <Award className="w-3.5 h-3.5 text-amber-400" />
                  <span>Sello Mérida Gastronómica</span>
                </button>
              </li>
              <li>
                <button onClick={() => { setActiveTab('jobs'); scrollToTop(); }} className="hover:text-amber-400 transition-colors flex items-center gap-1">
                  <Briefcase className="w-3.5 h-3.5 text-sky-400" />
                  <span>Bolsa de Empleo Agremiada</span>
                </button>
              </li>
              <li>
                <button onClick={() => { setActiveTab('academy'); scrollToTop(); }} className="hover:text-amber-400 transition-colors flex items-center gap-1">
                  <GraduationCap className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Academia Gastronómica ULA</span>
                </button>
              </li>
              <li>
                <button onClick={() => { setActiveTab('legal'); scrollToTop(); }} className="hover:text-amber-400 transition-colors flex items-center gap-1">
                  <Scale className="w-3.5 h-3.5 text-indigo-400" />
                  <span>Marco Jurídico & SENIAT</span>
                </button>
              </li>
              <li>
                <button onClick={() => { setActiveTab('affiliates'); scrollToTop(); }} className="hover:text-amber-400 transition-colors">
                  Portal Privado de Afiliados
                </button>
              </li>
            </ul>
          </div>

          {/* Col 5: Contact */}
          <div className="space-y-3">
            <h4 className="font-serif font-bold text-sm text-white uppercase tracking-wider">
              Sede Institucional
            </h4>
            <div className="space-y-2 text-xs text-slate-300">
              <p className="flex items-start gap-2">
                <MapPin className="w-3.5 h-3.5 text-amber-400 mt-0.5 shrink-0" />
                <span>Av. 4 entre Calles 19 y 20, Centro Histórico, Mérida, Venezuela</span>
              </p>
              <p className="flex items-center gap-2">
                <Phone className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                <span>+58 (274) 252-8810</span>
              </p>
              <p className="flex items-center gap-2">
                <Mail className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                <span>info@camaragastronomicamerida.org</span>
              </p>
            </div>

            <div className="pt-2">
              <button
                onClick={() => { setActiveTab('affiliates'); scrollToTop(); }}
                className="w-full py-2 px-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-amber-400 border border-amber-500/40 text-xs font-bold text-center block transition-all"
              >
                Portal Privado de Afiliados
              </button>
            </div>
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-400">
          <p>© 2026 Cámara Gastronómica del Estado Mérida. Todos los derechos reservados.</p>
          
          <div className="flex items-center gap-4">
            <span className="font-bold text-amber-400">MÉRIDA, VENEZUELA</span>
            <button
              onClick={scrollToTop}
              className="p-2 rounded-lg bg-slate-800 border border-slate-700 text-amber-400 hover:text-white transition-colors"
              title="Volver arriba"
            >
              <ArrowUp className="w-4 h-4" />
            </button>
          </div>
        </div>

      </div>
    </footer>
  );
}
