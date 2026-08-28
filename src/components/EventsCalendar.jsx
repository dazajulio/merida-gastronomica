import React, { useState } from 'react';
import { 
  Calendar, 
  MapPin, 
  Clock, 
  Ticket, 
  Sparkles,
  CheckCircle2,
  X
} from 'lucide-react';
import { EVENTS_DATA } from '../data/eventsData';

export function EventsCalendar({ t }) {
  const [selectedMonth, setSelectedMonth] = useState('all');
  const [rsvpModalEvent, setRsvpModalEvent] = useState(null);
  const [rsvpSuccess, setRsvpSuccess] = useState(false);

  const months = ['all', 'Febrero', 'Abril', 'Junio', 'Agosto', 'Octubre', 'Diciembre'];

  const filteredEvents = EVENTS_DATA.filter(event => {
    return selectedMonth === 'all' || event.month === selectedMonth;
  });

  const handleRsvpSubmit = (e) => {
    e.preventDefault();
    setRsvpSuccess(true);
    setTimeout(() => {
      setRsvpSuccess(false);
      setRsvpModalEvent(null);
      alert(`¡Registro Confirmado! Su acreditación digital para ${rsvpModalEvent.title} ha sido reservada con éxito.`);
    }, 1200);
  };

  return (
    <section className="py-12 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      
      {/* Header */}
      <div className="text-center max-w-3xl mx-auto mb-10">
        <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-amber-100 border border-amber-300 text-amber-900 text-xs font-bold mb-3 shadow-sm">
          <Calendar className="w-3.5 h-3.5 text-amber-600" />
          <span>Programación Oficial 2026</span>
        </div>
        <h2 className="font-serif text-3xl sm:text-5xl font-bold text-slate-900 tracking-tight">
          Agenda Anual de Eventos & Festivales
        </h2>
        <p className="mt-3 text-slate-600 text-sm sm:text-base">
          Programe su visita culinaria y viva las ferias, catas, congresos y festividades más prestigiosas de Mérida.
        </p>
      </div>

      {/* Month Filter Bar */}
      <div className="flex items-center justify-center gap-2 overflow-x-auto pb-4 mb-8">
        {months.map(m => (
          <button
            key={m}
            onClick={() => setSelectedMonth(m)}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
              selectedMonth === m
                ? 'bg-amber-500 text-white shadow-md scale-105'
                : 'bg-white text-slate-700 border border-slate-200 hover:border-amber-400 hover:text-amber-700'
            }`}
          >
            {m === 'all' ? 'Todos los Meses' : m}
          </button>
        ))}
      </div>

      {/* Events Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredEvents.map((event) => (
          <div 
            key={event.id}
            className="group rounded-3xl bg-white border border-slate-200 overflow-hidden hover:border-amber-400 hover:shadow-card-hover transition-all duration-300 flex flex-col justify-between"
          >
            {/* Event Image */}
            <div className="relative h-52 w-full overflow-hidden bg-slate-100">
              <img 
                src={event.image} 
                alt={event.title} 
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/60 via-transparent to-black/20" />
              
              {/* Badges */}
              <div className="absolute top-3 left-3 right-3 flex items-center justify-between">
                <span className="px-3 py-1 rounded-full text-xs font-bold bg-amber-500 text-white shadow-sm">
                  {event.month}
                </span>
                <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-white/90 text-slate-900 shadow-sm">
                  {event.badge}
                </span>
              </div>

              <div className="absolute bottom-3 left-3">
                <span className="text-xs font-bold px-2.5 py-1 rounded-lg bg-emerald-600 text-white shadow-sm">
                  {event.category}
                </span>
              </div>
            </div>

            {/* Event Content */}
            <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
              <div>
                <div className="flex items-center gap-2 text-xs text-amber-800 font-bold mb-1">
                  <Clock className="w-3.5 h-3.5 text-amber-600" />
                  <span>{event.date}</span>
                </div>

                <h3 className="font-serif text-xl font-bold text-slate-900 group-hover:text-amber-700 transition-colors leading-snug">
                  {event.title}
                </h3>

                <div className="flex items-center gap-1.5 text-xs text-slate-600 mt-2">
                  <MapPin className="w-3.5 h-3.5 text-sky-600 shrink-0" />
                  <span>{event.location}</span>
                </div>

                <p className="text-xs text-slate-600 mt-3 line-clamp-3 leading-relaxed">
                  {event.description}
                </p>

                {/* Highlights */}
                <div className="mt-4 pt-3 border-t border-slate-100 space-y-1.5">
                  <span className="text-[10px] uppercase font-bold text-slate-500">Destacados:</span>
                  {event.highlights.slice(0, 2).map((hl, idx) => (
                    <div key={idx} className="text-xs text-slate-700 flex items-center gap-1.5">
                      <Sparkles className="w-3 h-3 text-amber-600 shrink-0" />
                      <span className="truncate">{hl}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Card Footer */}
              <div className="pt-4 border-t border-slate-100 flex items-center justify-between gap-3">
                <div>
                  <span className="text-[10px] font-semibold text-slate-500 block">Acceso:</span>
                  <span className="text-xs font-bold text-emerald-700">{event.ticketPrice}</span>
                </div>

                <button
                  onClick={() => setRsvpModalEvent(event)}
                  className="py-2.5 px-4 rounded-xl bg-amber-500 hover:bg-amber-600 text-white font-bold text-xs flex items-center gap-1.5 shadow-sm transition-all active:scale-95"
                >
                  <Ticket className="w-3.5 h-3.5" />
                  <span>Inscribirse</span>
                </button>
              </div>

            </div>

          </div>
        ))}
      </div>

      {/* RSVP Modal */}
      {rsvpModalEvent && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-fadeIn">
          <div className="relative w-full max-w-lg bg-white rounded-3xl border border-slate-200 shadow-2xl p-6 sm:p-8 space-y-5 text-slate-800">
            
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <div className="flex items-center gap-2 text-amber-700">
                <Ticket className="w-5 h-5" />
                <h3 className="font-serif text-lg font-bold text-slate-900">Inscripción / Acreditación Oficial</h3>
              </div>
              <button 
                onClick={() => setRsvpModalEvent(null)}
                className="p-1 rounded-lg hover:bg-slate-100 text-slate-500"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div>
              <h4 className="font-serif text-xl font-bold text-slate-900">{rsvpModalEvent.title}</h4>
              <p className="text-xs text-amber-800 font-bold mt-1">{rsvpModalEvent.date} — {rsvpModalEvent.location}</p>
            </div>

            <form onSubmit={handleRsvpSubmit} className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-700 font-bold mb-1">Nombre Completo</label>
                <input 
                  type="text" 
                  required 
                  placeholder="Ej. Valentina Morales" 
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-slate-800 focus:outline-none focus:border-amber-500 focus:bg-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-slate-700 font-bold mb-1">Correo Electrónico</label>
                  <input 
                    type="email" 
                    required 
                    placeholder="contacto@ejemplo.com" 
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-slate-800 focus:outline-none focus:border-amber-500 focus:bg-white"
                  />
                </div>
                <div>
                  <label className="block text-slate-700 font-bold mb-1">WhatsApp / Teléfono</label>
                  <input 
                    type="tel" 
                    required 
                    placeholder="+58 414..." 
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-slate-800 focus:outline-none focus:border-amber-500 focus:bg-white"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-700 font-bold mb-1">Tipo de Asistente</label>
                <select className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-slate-800 focus:outline-none focus:border-amber-500 focus:bg-white">
                  <option>Turista / Visitante Gastronómico</option>
                  <option>Chef / Profesional de Cocina</option>
                  <option>Afiliado Cámara Gastronómica</option>
                  <option>Prensa / Medio de Comunicación</option>
                </select>
              </div>

              <button
                type="submit"
                disabled={rsvpSuccess}
                className="w-full py-3 rounded-xl bg-gradient-to-r from-amber-500 to-terracotta text-white font-serif font-bold text-xs uppercase tracking-wider hover:shadow-warm transition-all mt-4"
              >
                {rsvpSuccess ? 'Generando Acreditación...' : 'Confirmar Mi Registro Oficial'}
              </button>
            </form>

          </div>
        </div>
      )}

    </section>
  );
}
