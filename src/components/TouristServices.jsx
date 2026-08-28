import React from 'react';
import { 
  Compass, 
  MapPin, 
  MessageCircle, 
  Star, 
  ShieldCheck, 
  ArrowRight
} from 'lucide-react';
import { TOURIST_SERVICES_DATA } from '../data/touristServicesData';

export function TouristServices({ t }) {
  const handleServiceContact = (service) => {
    const text = `Hola, me comunico desde la *Guía Oficial de la Cámara Gastronómica del Estado Mérida*. Deseo solicitar información y disponibilidad para el servicio: *${service.title}*.`;
    const cleanPhone = service.contactWhatsapp.replace(/[^0-9]/g, '');
    window.open(`https://wa.me/${cleanPhone}?text=${encodeURIComponent(text)}`, '_blank');
  };

  return (
    <section className="py-12 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      
      {/* Header */}
      <div className="text-center max-w-3xl mx-auto mb-10">
        <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-amber-100 border border-amber-300 text-amber-900 text-xs font-bold mb-3 shadow-sm">
          <Compass className="w-3.5 h-3.5 text-amber-600" />
          <span>Concierge & Experiencias de Élite</span>
        </div>
        <h2 className="font-serif text-3xl sm:text-5xl font-bold text-slate-900 tracking-tight">
          Vinculaciones Turísticas & Servicios VIP
        </h2>
        <p className="mt-3 text-slate-600 text-sm sm:text-base">
          Experiencias de viaje, movilidad, chefs privados y hospitalidad de alto nivel para su estancia en el estado Mérida.
        </p>
      </div>

      {/* Services Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {TOURIST_SERVICES_DATA.map((service) => (
          <div 
            key={service.id}
            className="group rounded-3xl bg-white border border-slate-200 overflow-hidden hover:border-amber-400 hover:shadow-card-hover transition-all duration-300 flex flex-col justify-between"
          >
            {/* Image & Header Badges */}
            <div className="relative h-60 w-full overflow-hidden bg-slate-100">
              <img 
                src={service.image} 
                alt={service.title} 
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/60 via-transparent to-black/20" />
              
              <div className="absolute top-3 left-3 right-3 flex items-center justify-between">
                <span className="px-3 py-1 rounded-full text-xs font-bold bg-white/95 text-slate-900 shadow-sm">
                  {service.badge}
                </span>

                <div className="flex items-center gap-1 bg-white/95 px-2.5 py-1 rounded-full shadow-sm">
                  <Star className="w-3.5 h-3.5 fill-amber-500 text-amber-500" />
                  <span className="text-xs font-bold text-slate-900">{service.rating}</span>
                </div>
              </div>

              <div className="absolute bottom-3 left-3">
                <span className="text-xs font-bold px-3 py-1 rounded-lg bg-sky-600 text-white shadow-sm">
                  {service.category}
                </span>
              </div>
            </div>

            {/* Body */}
            <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
              <div>
                <h3 className="font-serif text-xl font-bold text-slate-900 group-hover:text-amber-700 transition-colors leading-snug">
                  {service.title}
                </h3>

                <div className="flex items-center gap-1.5 text-xs text-slate-600 mt-2">
                  <MapPin className="w-3.5 h-3.5 text-terracotta shrink-0" />
                  <span className="truncate">{service.location}</span>
                </div>

                <p className="text-xs text-slate-600 mt-3 line-clamp-3 leading-relaxed">
                  {service.description}
                </p>

                {/* Features list */}
                <div className="mt-4 pt-3 border-t border-slate-100 space-y-1.5">
                  <span className="text-[10px] uppercase font-bold text-slate-500">Incluye:</span>
                  {service.features.slice(0, 3).map((feat, idx) => (
                    <div key={idx} className="text-xs text-slate-700 flex items-center gap-2">
                      <div className="w-1.5 h-1.5 rounded-full bg-amber-500 shrink-0" />
                      <span className="truncate">{feat}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Pricing & Booking Action */}
              <div className="pt-4 border-t border-slate-100 flex items-center justify-between gap-3">
                <div>
                  <span className="text-[10px] font-semibold text-slate-500 block">Tarifa Referencial:</span>
                  <div className="flex items-baseline gap-1">
                    <span className="text-lg font-serif font-bold text-amber-800">{service.priceFrom}</span>
                    <span className="text-[10px] text-slate-500 truncate max-w-[110px]">{service.unit}</span>
                  </div>
                </div>

                <button
                  onClick={() => handleServiceContact(service)}
                  className="py-2.5 px-4 rounded-xl bg-amber-500 hover:bg-amber-600 text-white font-serif font-bold text-xs uppercase tracking-wider flex items-center gap-1.5 transition-all shadow-sm active:scale-95 shrink-0"
                >
                  <MessageCircle className="w-4 h-4" />
                  <span>Reservar</span>
                </button>
              </div>

            </div>

          </div>
        ))}
      </div>

      {/* Special Guarantee Callout */}
      <div className="mt-12 p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-amber-500 via-amber-600 to-terracotta text-white flex flex-col md:flex-row items-center justify-between gap-6 shadow-xl">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-white/20 flex items-center justify-center text-white shrink-0">
            <ShieldCheck className="w-8 h-8" />
          </div>
          <div>
            <h4 className="font-serif text-lg sm:text-xl font-bold text-white">
              Garantía de Excelencia Turística Cámara Gastronómica
            </h4>
            <p className="text-xs text-amber-100 mt-1 max-w-2xl">
              Todos los prestadores turísticos aliados cuentan con pólizas de seguridad, guías certificados y protocolos de atención de primer nivel.
            </p>
          </div>
        </div>

        <a
          href="https://wa.me/584147481122?text=Hola,%20deseo%20asistencia%20del%20Concierge%20Turístico%20de%20la%20Cámara%20Gastronómica%20de%20Mérida"
          target="_blank"
          rel="noopener noreferrer"
          className="py-3 px-6 rounded-xl bg-white hover:bg-slate-100 text-slate-900 font-serif font-bold text-xs uppercase tracking-wider flex items-center gap-2 shrink-0 transition-all shadow-md"
        >
          <span>Hablar con Concierge Oficial</span>
          <ArrowRight className="w-4 h-4" />
        </a>
      </div>

    </section>
  );
}
