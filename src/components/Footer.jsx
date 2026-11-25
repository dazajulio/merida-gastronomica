import React from 'react';
import { 
  MapPin, 
  Phone, 
  Mail, 
  ArrowUp,
  ShieldCheck
} from 'lucide-react';

export function Footer({ setActiveTab }) {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const go = (tab) => {
    setActiveTab(tab);
    scrollToTop();
  };

  return (
    <footer className="bg-white border-t border-[#EAE3D5] pt-14 pb-10 text-[#5C554E]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Top Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 pb-12 border-b border-[#EAE3D5]">
          
          {/* Col 1 & 2: Brand */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 rounded-2xl bg-[#FAF7F2] border border-[#EAE3D5] p-1.5 flex items-center justify-center shrink-0">
                <img 
                  src="/logo-merida-gastronomica.png" 
                  alt="Mérida Gastronómica Logo Oficial" 
                  className="w-full h-full object-contain"
                />
              </div>
              <div>
                <span className="font-playfair font-bold text-lg text-[#1E1C1A] tracking-tight block">
                  Mérida Gastronómica
                </span>
                <span className="text-[10px] uppercase text-[#C85A32] font-bold tracking-[0.14em] block">
                  Cámara Gastronómica del Estado Mérida
                </span>
              </div>
            </div>

            <p className="text-xs text-[#5C554E] leading-relaxed max-w-md font-sans">
              Organización gremial oficial dedicada a promover e internacionalizar la riqueza gastronómica, agroecológica y turística del estado Mérida, Venezuela.
            </p>

            <div className="pt-1">
              <span className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-[11px] font-semibold bg-[#FAF7F2] text-[#C85A32] border border-[#EAE3D5]">
                <ShieldCheck className="w-3.5 h-3.5" />
                Guía Oficial &amp; Ecosistema Gremial
              </span>
            </div>
          </div>

          {/* Col 3: Guía & Rutas */}
          <div className="space-y-3">
            <h4 className="font-playfair font-bold text-sm text-[#1E1C1A]">
              Guía &amp; Rutas
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <button onClick={() => go('guide')} className="hover:text-[#C85A32] transition-colors">
                  Guía de Restaurantes
                </button>
              </li>
              <li>
                <button onClick={() => go('prestadores')} className="hover:text-[#C85A32] transition-colors">
                  Prestadores de Servicios
                </button>
              </li>
              <li>
                <button onClick={() => go('el_valle_ruta')} className="hover:text-[#C85A32] transition-colors font-semibold text-[#1E1C1A]">
                  El Valle te Conecta
                </button>
              </li>
              <li>
                <button onClick={() => go('directorio')} className="hover:text-[#C85A32] transition-colors">
                  Directorio de Agremiados
                </button>
              </li>
              <li>
                <button onClick={() => go('lidar')} className="hover:text-[#C85A32] transition-colors">
                  Mapa de Ubicación 2D
                </button>
              </li>
              <li>
                <button onClick={() => go('terroir')} className="hover:text-[#C85A32] transition-colors">
                  Rutas Mérida
                </button>
              </li>
              <li>
                <button onClick={() => go('cultural')} className="hover:text-[#C85A32] transition-colors">
                  Distrito Cultural Urbano
                </button>
              </li>
              <li>
                <button onClick={() => go('events')} className="hover:text-[#C85A32] transition-colors">
                  Eventos &amp; Festivales
                </button>
              </li>
            </ul>
          </div>

          {/* Col 4: Gremio & Academia */}
          <div className="space-y-3">
            <h4 className="font-playfair font-bold text-sm text-[#1E1C1A]">
              Gremio &amp; Academia
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <button onClick={() => go('junta_directiva')} className="hover:text-[#C85A32] transition-colors font-semibold text-[#C85A32]">
                  Junta Directiva Oficial
                </button>
              </li>
              <li>
                <button onClick={() => go('beneficios')} className="hover:text-[#C85A32] transition-colors">
                  Beneficios de Ser Agremiado
                </button>
              </li>
              <li>
                <button onClick={() => go('jobs')} className="hover:text-[#C85A32] transition-colors">
                  Bolsa de Empleo Agremiada
                </button>
              </li>
              <li>
                <button onClick={() => go('academy')} className="hover:text-[#C85A32] transition-colors">
                  Cursos &amp; Academia Gastronómica
                </button>
              </li>
              <li>
                <button onClick={() => go('services')} className="hover:text-[#C85A32] transition-colors">
                  Servicios Turísticos VIP
                </button>
              </li>
              <li>
                <button onClick={() => go('affiliates')} className="hover:text-[#C85A32] transition-colors">
                  Portal Privado de Afiliados
                </button>
              </li>
            </ul>
          </div>

          {/* Col 5: Contact */}
          <div className="space-y-3">
            <h4 className="font-playfair font-bold text-sm text-[#1E1C1A]">
              Sede Institucional
            </h4>
            <div className="space-y-2 text-xs text-[#5C554E]">
              <p className="flex items-start gap-2">
                <MapPin className="w-3.5 h-3.5 text-[#C85A32] mt-0.5 shrink-0" />
                <span>Mérida, Estado Mérida, Venezuela</span>
              </p>
              <p className="flex items-center gap-2">
                <Phone className="w-3.5 h-3.5 text-[#C85A32] shrink-0" />
                <a href="tel:04126408957" className="hover:text-[#C85A32] transition-colors">
                  0412-6408957
                </a>
              </p>
              <p className="flex items-center gap-2">
                <Mail className="w-3.5 h-3.5 text-[#C85A32] shrink-0" />
                <a href="mailto:notificaciones@meridagastronomica.com" className="hover:text-[#C85A32] transition-colors truncate">
                  notificaciones@meridagastronomica.com
                </a>
              </p>
            </div>

            <div className="pt-2">
              <button
                onClick={() => go('admin')}
                className="w-full py-2.5 px-4 rounded-full bg-[#FAF7F2] hover:bg-[#C85A32] text-[#1E1C1A] hover:text-white border border-[#DED5C5] hover:border-[#C85A32] text-xs font-sans font-bold text-center block transition-all"
              >
                Portal Junta Directiva
              </button>
            </div>
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-[#7A7168]">
          <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
            <p>© 2026 Cámara Gastronómica del Estado Mérida. Todos los derechos reservados.</p>
            <span className="hidden sm:inline text-[#DED5C5]">•</span>
            <button
              onClick={() => go('privacy')}
              className="text-[#7A7168] hover:text-[#C85A32] underline transition-colors cursor-pointer"
            >
              Política de Privacidad
            </button>
          </div>
          
          <div className="flex flex-wrap items-center justify-center sm:justify-end gap-4">
            <span className="font-bold text-[#C85A32] tracking-wider uppercase text-[11px]">Mérida, Venezuela</span>
            <span className="text-[#DED5C5]">|</span>
            <span className="text-[11px] text-[#7A7168]">
              Powered By:{' '}
              <a
                href="https://www.dazajulio.com/"
                target="_blank"
                rel="noopener noreferrer"
                className="font-bold text-[#1E1C1A] hover:text-[#C85A32] underline transition-colors"
              >
                www.dazajulio.com
              </a>
            </span>
            <button
              onClick={scrollToTop}
              className="p-2 rounded-full bg-[#FAF7F2] border border-[#EAE3D5] text-[#C85A32] hover:bg-[#C85A32] hover:text-white transition-colors"
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
