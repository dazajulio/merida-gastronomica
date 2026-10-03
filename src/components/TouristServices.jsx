import React, { useState, useEffect } from 'react';
import { 
  Compass, 
  MapPin, 
  MessageCircle, 
  Star, 
  ShieldCheck, 
  ArrowRight,
  Sparkles,
  Phone,
  Building2,
  Clock
} from 'lucide-react';
import { TOURIST_SERVICES_DATA } from '../data/touristServicesData';

export function TouristServices({ t }) {
  const [services, setServices] = useState(() => {
    try {
      const saved = localStorage.getItem('cgem_tourist_services');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) return parsed;
      }
    } catch (e) {}
    return TOURIST_SERVICES_DATA;
  });

  useEffect(() => {
    const handleUpdate = () => {
      try {
        const saved = localStorage.getItem('cgem_tourist_services');
        if (saved) {
          const parsed = JSON.parse(saved);
          if (Array.isArray(parsed)) setServices(parsed);
        } else {
          setServices(TOURIST_SERVICES_DATA);
        }
      } catch (e) {}
    };

    window.addEventListener('cgm_tourist_services_updated', handleUpdate);
    window.addEventListener('storage', handleUpdate);
    return () => {
      window.removeEventListener('cgm_tourist_services_updated', handleUpdate);
      window.removeEventListener('storage', handleUpdate);
    };
  }, []);

  const handleServiceContact = (service) => {
    const text = `Hola, me comunico desde la *Guía Oficial de la Cámara Gastronómica del Estado Mérida*. Deseo solicitar información y disponibilidad para el servicio: *${service.title}*.`;
    const cleanPhone = (service.contactWhatsapp || '04148817137').replace(/[^0-9]/g, '');
    window.open(`https://wa.me/${cleanPhone}?text=${encodeURIComponent(text)}`, '_blank');
  };

  return (
    <section className="py-12 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 animate-fadeIn">
      
      {/* Header */}
      <div className="text-center max-w-3xl mx-auto mb-10">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-amber-100 border border-amber-300 text-amber-900 text-xs font-bold mb-3 shadow-sm">
          <Compass className="w-4 h-4 text-amber-600" />
          <span>Concierge & Convenios Certificados</span>
        </div>
        <h2 className="font-serif text-3xl sm:text-5xl font-bold text-slate-900 tracking-tight">
          Vinculaciones Turísticas & Servicios Oficiales
        </h2>
        <p className="mt-3 text-slate-600 text-xs sm:text-sm max-w-2xl mx-auto">
          Alianzas estratégicas, operadores turísticos certificados, traslados y hospitalidad avalada por la Cámara Gastronómica del Estado Mérida.
        </p>
      </div>

      {/* Services Grid or Institutional Empty Notice */}
      {services.length === 0 ? (
        <div className="bg-gradient-to-br from-slate-900 via-slate-950 to-amber-950 text-white rounded-3xl p-8 sm:p-14 border border-amber-500/30 shadow-2xl text-center max-w-3xl mx-auto">
          <div className="w-16 h-16 rounded-2xl bg-amber-500/20 border border-amber-400/40 flex items-center justify-center mx-auto mb-5 text-amber-400 shadow-lg">
            <ShieldCheck className="w-8 h-8" />
          </div>
          
          <span className="inline-block px-3 py-1 rounded-full bg-amber-500/20 text-amber-300 text-[11px] font-bold uppercase tracking-wider mb-3">
            Homologación en Curso • 2026 - 2027
          </span>

          <h3 className="font-serif text-2xl sm:text-3xl font-bold text-white mb-3">
            Certificación de Vinculaciones Turísticas
          </h3>

          <p className="text-xs sm:text-sm text-slate-300 max-w-xl mx-auto leading-relaxed mb-6 font-light">
            Actualmente la Presidencia y la Dirección de la Cámara Gastronómica del Estado Mérida se encuentran en fase de homologación técnica y suscripción de convenios oficiales con operadores de transporte, hotelería y actividades turísticas de élite.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-3">
            <a
              href="https://wa.me/584148817137?text=Hola,%20deseo%20información%20sobre%20convenios%20y%20vinculaciones%20turísticas%20con%20la%20Cámara%20Gastronómica%20de%20Mérida"
              target="_blank"
              rel="noopener noreferrer"
              className="py-3 px-6 rounded-2xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-slate-950 font-serif font-bold text-xs uppercase tracking-wider flex items-center gap-2 shadow-lg shadow-amber-500/20 transition-all"
            >
              <MessageCircle className="w-4 h-4" />
              <span>Contactar a la Dirección de Turismo</span>
            </a>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {services.map((service) => (
            <div 
              key={service.id}
              className="group rounded-3xl bg-white border border-slate-200 overflow-hidden hover:border-amber-400 hover:shadow-2xl transition-all duration-300 flex flex-col justify-between"
            >
              {/* Image & Header Badges */}
              <div className="relative h-60 w-full overflow-hidden bg-slate-100">
                {service.image ? (
                  <img 
                    src={service.image} 
                    alt={service.title} 
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                ) : (
                  <div className="w-full h-full bg-slate-800 flex items-center justify-center text-slate-400">
                    <Compass className="w-12 h-12 text-amber-500/40" />
                  </div>
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/60 via-transparent to-black/20" />
                
                <div className="absolute top-3 left-3 right-3 flex items-center justify-between">
                  {service.badge && (
                    <span className="px-3 py-1 rounded-full text-xs font-bold bg-white/95 text-slate-900 shadow-sm">
                      {service.badge}
                    </span>
                  )}

                  {service.rating && (
                    <div className="flex items-center gap-1 bg-white/95 px-2.5 py-1 rounded-full shadow-sm ml-auto">
                      <Star className="w-3.5 h-3.5 fill-amber-500 text-amber-500" />
                      <span className="text-xs font-bold text-slate-900">{service.rating}</span>
                    </div>
                  )}
                </div>

                {service.category && (
                  <div className="absolute bottom-3 left-3">
                    <span className="text-xs font-bold px-3 py-1 rounded-lg bg-sky-600 text-white shadow-sm">
                      {service.category}
                    </span>
                  </div>
                )}
              </div>

              {/* Body */}
              <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
                <div>
                  <h3 className="font-serif text-xl font-bold text-slate-900 group-hover:text-amber-700 transition-colors leading-snug">
                    {service.title}
                  </h3>

                  {service.location && (
                    <div className="flex items-center gap-1.5 text-xs text-slate-600 mt-2">
                      <MapPin className="w-3.5 h-3.5 text-amber-600 shrink-0" />
                      <span className="truncate">{service.location}</span>
                    </div>
                  )}

                  <p className="text-xs text-slate-600 mt-3 line-clamp-3 leading-relaxed">
                    {service.description}
                  </p>

                  {/* Features list */}
                  {Array.isArray(service.features) && service.features.length > 0 && (
                    <div className="mt-4 pt-3 border-t border-slate-100 space-y-1.5">
                      <span className="text-[10px] uppercase font-bold text-slate-500">Incluye:</span>
                      {service.features.slice(0, 3).map((feat, idx) => (
                        <div key={idx} className="text-xs text-slate-700 flex items-center gap-2">
                          <div className="w-1.5 h-1.5 rounded-full bg-amber-500 shrink-0" />
                          <span className="truncate">{feat}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Pricing & Booking Action */}
                <div className="pt-4 border-t border-slate-100 flex items-center justify-between gap-3">
                  <div>
                    {service.priceFrom && (
                      <>
                        <span className="text-[10px] font-semibold text-slate-500 block">Tarifa Referencial:</span>
                        <div className="flex items-baseline gap-1">
                          <span className="text-lg font-serif font-bold text-amber-800">{service.priceFrom}</span>
                          {service.unit && (
                            <span className="text-[10px] text-slate-500 truncate max-w-[110px]">{service.unit}</span>
                          )}
                        </div>
                      </>
                    )}
                  </div>

                  {service.contactWhatsapp && (
                    <button
                      onClick={() => handleServiceContact(service)}
                      className="py-2.5 px-4 rounded-xl bg-amber-500 hover:bg-amber-600 text-slate-950 font-serif font-bold text-xs uppercase tracking-wider flex items-center gap-1.5 transition-all shadow-sm active:scale-95 shrink-0"
                    >
                      <MessageCircle className="w-4 h-4" />
                      <span>Contactar</span>
                    </button>
                  )}
                </div>

              </div>

            </div>
          ))}
        </div>
      )}

      {/* Special Guarantee Callout */}
      <div className="mt-12 p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-amber-500 via-amber-600 to-amber-700 text-slate-950 flex flex-col md:flex-row items-center justify-between gap-6 shadow-xl">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-slate-950/15 flex items-center justify-center text-slate-950 shrink-0">
            <ShieldCheck className="w-8 h-8" />
          </div>
          <div>
            <h4 className="font-serif text-lg sm:text-xl font-bold text-slate-950">
              Garantía de Excelencia Turística & Gremial
            </h4>
            <p className="text-xs text-slate-900/90 mt-1 max-w-2xl font-medium">
              Todos los prestadores turísticos aliados son homologados por la Cámara Gastronómica del Estado Mérida bajo estándares de calidad y seguridad.
            </p>
          </div>
        </div>

        <a
          href="https://wa.me/584148817137?text=Hola,%20deseo%20asistencia%20del%20Concierge%20Turístico%20de%20la%20Cámara%20Gastronómica%20de%20Mérida"
          target="_blank"
          rel="noopener noreferrer"
          className="py-3 px-6 rounded-2xl bg-slate-950 hover:bg-slate-900 text-white font-serif font-bold text-xs uppercase tracking-wider flex items-center gap-2 shrink-0 transition-all shadow-md"
        >
          <span>Hablar con Concierge Oficial</span>
          <ArrowRight className="w-4 h-4 text-amber-400" />
        </a>
      </div>

    </section>
  );
}
