import React, { useState, useEffect } from 'react';
import { 
  Calendar, 
  MapPin, 
  Clock, 
  Ticket, 
  Sparkles,
  CheckCircle2,
  X,
  CreditCard,
  Building2,
  Send,
  AlertCircle
} from 'lucide-react';
import { EVENTS_DATA } from '../data/eventsData';

export function EventsCalendar({ t }) {
  const [selectedMonth, setSelectedMonth] = useState('all');
  const [rsvpModalEvent, setRsvpModalEvent] = useState(null);
  const [rsvpSuccess, setRsvpSuccess] = useState(false);

  // Registration Form State
  const [attendeeType, setAttendeeType] = useState('afiliado'); // 'afiliado' | 'publico'
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [affiliateCode, setAffiliateCode] = useState('');
  const [paymentRef, setPaymentRef] = useState('');
  const [paymentBank, setPaymentBank] = useState('Provincial');
  const [paymentPhone, setPaymentPhone] = useState('');

  // Live synced events
  const [eventsList, setEventsList] = useState(() => {
    try {
      const saved = localStorage.getItem('cgem_official_events');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch (e) {}
    return EVENTS_DATA;
  });

  useEffect(() => {
    const handleEventsUpdate = () => {
      try {
        const saved = localStorage.getItem('cgem_official_events');
        if (saved) {
          const parsed = JSON.parse(saved);
          if (Array.isArray(parsed)) setEventsList(parsed);
        }
      } catch (e) {}
    };

    window.addEventListener('cgem_events_updated', handleEventsUpdate);
    window.addEventListener('storage', handleEventsUpdate);
    return () => {
      window.removeEventListener('cgem_events_updated', handleEventsUpdate);
      window.removeEventListener('storage', handleEventsUpdate);
    };
  }, []);

  const months = ['all', 'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'];

  const filteredEvents = eventsList.filter(event => {
    return selectedMonth === 'all' || event.month === selectedMonth;
  });

  const handleOpenRsvp = (event) => {
    setRsvpModalEvent(event);
    const isFree = event.accessType === 'free' || (!event.priceGeneralUSD && !event.priceUSD && event.ticketPrice?.toLowerCase().includes('libre'));
    setAttendeeType(isFree ? 'libre' : 'afiliado');
    setFullName('');
    setEmail('');
    setPhone('');
    setAffiliateCode('');
    setPaymentRef('');
    setPaymentBank('0108 - Banco Provincial');
    setPaymentPhone('');
    setRsvpSuccess(false);
  };

  const handleRsvpSubmit = (e) => {
    e.preventDefault();
    setRsvpSuccess(true);
    
    // Save registration record to localStorage
    try {
      const savedRsvps = localStorage.getItem('cgem_event_rsvps');
      const list = savedRsvps ? JSON.parse(savedRsvps) : [];
      const newRsvp = {
        id: `rsvp-${Date.now()}`,
        eventId: rsvpModalEvent.id,
        eventTitle: rsvpModalEvent.title,
        attendeeType,
        fullName,
        email,
        phone,
        affiliateCode: attendeeType === 'afiliado' ? affiliateCode : '',
        paymentRef: attendeeType === 'publico' ? paymentRef : '',
        paymentBank: attendeeType === 'publico' ? paymentBank : '',
        registeredAt: new Date().toISOString(),
        status: attendeeType === 'afiliado' || attendeeType === 'libre' ? 'confirmado' : 'pendiente_conciliacion'
      };
      localStorage.setItem('cgem_event_rsvps', JSON.stringify([newRsvp, ...list]));
    } catch (err) {}

    setTimeout(() => {
      setRsvpSuccess(false);
      setRsvpModalEvent(null);
      if (attendeeType === 'afiliado') {
        alert(`¡Inscripción Confirmada! Como Miembro Solvente (${affiliateCode || 'CGM'}), su acreditación digital gratuita para "${rsvpModalEvent.title}" ha sido reservada con éxito. Se ha enviado un comprobante a ${email}.`);
      } else if (attendeeType === 'libre') {
        alert(`¡Acreditación Exitosa! Su entrada libre para "${rsvpModalEvent.title}" ha sido registrada con éxito. Se ha enviado su pase a ${email}.`);
      } else {
        alert(`¡Registro en Proceso! Hemos recibido su reporte de Pago Móvil (Ref. ${paymentRef}) para "${rsvpModalEvent.title}". Recibirá su acreditación digital formal en ${email} tras la conciliación bancaria.`);
      }
    }, 1000);
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
        <p className="mt-3 text-slate-600 text-sm sm:text-base leading-relaxed">
          Programe su visita culinaria y viva las ferias, catas, congresos y festividades más prestigiosas de Mérida con el aval de la Cámara Gastronómica del Estado Mérida.
        </p>
      </div>

      {/* Month Filter Bar */}
      {eventsList.length > 0 && (
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
      )}

      {/* Events Grid or Empty State */}
      {filteredEvents.length === 0 ? (
        <div className="p-12 sm:p-16 text-center rounded-3xl bg-white border border-slate-200 shadow-sm space-y-4 max-w-2xl mx-auto font-sans">
          <div className="w-16 h-16 rounded-3xl bg-amber-100 border border-amber-300 flex items-center justify-center mx-auto text-amber-700 shadow-sm">
            <Calendar className="w-8 h-8" />
          </div>
          <h3 className="font-serif font-black text-2xl text-slate-900 uppercase tracking-wide">
            Próximamente Calendario Oficial 2026
          </h3>
          <p className="text-sm text-slate-600 leading-relaxed max-w-lg mx-auto">
            La Presidencia y la Dirección de Eventos de la Cámara Gastronómica del Estado Mérida se encuentran ultimando el cronograma oficial de ferias, catas y festivales gastronómicos de altura para este año.
          </p>
          <div className="pt-2">
            <span className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-slate-100 text-slate-700 border border-slate-200 text-xs font-bold font-mono">
              ★ Convocatorias Institucionales en Proceso
            </span>
          </div>
        </div>
      ) : (
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
                  <span className="px-3 py-1 rounded-full text-xs font-bold bg-amber-500 text-slate-950 shadow-sm font-sans">
                    {event.month}
                  </span>
                  <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-white/90 text-slate-900 shadow-sm font-sans">
                    {event.badge}
                  </span>
                </div>

                <div className="absolute bottom-3 left-3">
                  <span className="text-xs font-bold px-2.5 py-1 rounded-lg bg-emerald-600 text-white shadow-sm font-sans">
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
                  {Array.isArray(event.highlights) && event.highlights.length > 0 && (
                    <div className="mt-4 pt-3 border-t border-slate-100 space-y-1.5">
                      <span className="text-[10px] uppercase font-bold text-slate-500">Destacados:</span>
                      {event.highlights.slice(0, 2).map((hl, idx) => (
                        <div key={idx} className="text-xs text-slate-700 flex items-center gap-1.5">
                          <Sparkles className="w-3 h-3 text-amber-600 shrink-0" />
                          <span className="truncate">{hl}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Card Footer */}
                <div className="pt-4 border-t border-slate-100 flex items-center justify-between gap-3 font-sans">
                  <div>
                    <span className="text-[10px] font-semibold text-slate-500 block">Acceso:</span>
                    <span className="text-xs font-bold text-emerald-700">{event.ticketPrice}</span>
                  </div>

                  <button
                    onClick={() => handleOpenRsvp(event)}
                    className="py-2.5 px-4 rounded-xl bg-amber-500 hover:bg-amber-600 text-slate-950 font-serif font-black text-xs uppercase tracking-wider flex items-center gap-1.5 shadow-sm transition-all active:scale-95"
                  >
                    <Ticket className="w-3.5 h-3.5 text-slate-950" />
                    <span>Inscribirse</span>
                  </button>
                </div>

              </div>

            </div>
          ))}
        </div>
      )}

      {/* RSVP Modal with Solvent Member Free vs Pago Móvil Provincial */}
      {rsvpModalEvent && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-fadeIn">
          <div className="relative w-full max-w-lg bg-white rounded-3xl border border-slate-200 shadow-2xl p-6 sm:p-8 space-y-5 text-slate-800 max-h-[90vh] overflow-y-auto font-sans">
            
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

            {/* Selector if event is not 100% free */}
            {rsvpModalEvent.accessType !== 'free' && !rsvpModalEvent.ticketPrice?.toLowerCase().includes('totalmente libre') && (
              <div className="grid grid-cols-2 gap-2 p-1.5 bg-slate-100 rounded-2xl border border-slate-200 text-xs font-bold">
                <button
                  type="button"
                  onClick={() => setAttendeeType('afiliado')}
                  className={`py-2 px-3 rounded-xl transition-all ${
                    attendeeType === 'afiliado'
                      ? 'bg-emerald-600 text-white shadow-sm font-extrabold'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  ⭐ Miembro Solvente (Gratis)
                </button>
                <button
                  type="button"
                  onClick={() => setAttendeeType('publico')}
                  className={`py-2 px-3 rounded-xl transition-all ${
                    attendeeType === 'publico'
                      ? 'bg-amber-500 text-slate-950 shadow-sm font-extrabold'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  🎟️ Público (${rsvpModalEvent.priceGeneralUSD || rsvpModalEvent.priceUSD || 10} USD)
                </button>
              </div>
            )}

            <form onSubmit={handleRsvpSubmit} className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-700 font-bold mb-1">Nombre Completo *</label>
                <input 
                  type="text" 
                  required 
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="Ej. Valentina Morales" 
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-slate-800 focus:outline-none focus:border-amber-500 focus:bg-white"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                <div>
                  <label className="block text-slate-700 font-bold mb-1">Correo Electrónico *</label>
                  <input 
                    type="email" 
                    required 
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="contacto@ejemplo.com" 
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-slate-800 focus:outline-none focus:border-amber-500 focus:bg-white"
                  />
                </div>
                <div>
                  <label className="block text-slate-700 font-bold mb-1">WhatsApp / Teléfono *</label>
                  <input 
                    type="tel" 
                    required 
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="+58 414..." 
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-slate-800 focus:outline-none focus:border-amber-500 focus:bg-white"
                  />
                </div>
              </div>

              {attendeeType === 'libre' && (
                <div className="p-3.5 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-950 text-xs flex items-center gap-2 font-bold">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>Entrada 100% Libre y Gratuita para todo público</span>
                </div>
              )}

              {attendeeType === 'afiliado' && (
                <div className="p-3.5 rounded-2xl bg-emerald-50 border border-emerald-200 space-y-2">
                  <div className="flex items-center gap-2 text-emerald-900 font-bold">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>Beneficio de Miembro Solvente: Acceso Sin Costo</span>
                  </div>
                  <div>
                    <label className="block text-emerald-950 font-bold mb-1">Código de Afiliado CGM *</label>
                    <input 
                      type="text" 
                      required
                      value={affiliateCode}
                      onChange={(e) => setAffiliateCode(e.target.value)}
                      placeholder="Ej. CGM-2026-001" 
                      className="w-full bg-white border border-emerald-300 rounded-xl px-3 py-2 text-slate-800 uppercase font-mono font-bold focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    />
                  </div>
                </div>
              )}

              {attendeeType === 'publico' && (
                <div className="p-4 rounded-2xl bg-amber-50 border border-amber-300 space-y-3">
                  <div className="flex items-center justify-between gap-2 text-amber-950 font-bold">
                    <div className="flex items-center gap-2">
                      <CreditCard className="w-4 h-4 text-amber-600" />
                      <span>Datos de Pago Móvil Oficial Banco Provincial</span>
                    </div>
                    <span className="text-xs bg-amber-200 text-amber-900 px-2.5 py-0.5 rounded-md font-extrabold">
                      ${rsvpModalEvent.priceGeneralUSD || rsvpModalEvent.priceUSD || 10} USD
                    </span>
                  </div>

                  <div className="text-[11px] text-slate-800 space-y-1 bg-white p-3 rounded-xl border border-amber-200 font-mono">
                    <div className="flex justify-between">
                      <span className="text-slate-500">Banco:</span>
                      <strong>0108 - Banco Provincial</strong>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-500">Cédula / RIF:</span>
                      <strong>V-12517086</strong>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-500">Teléfono:</span>
                      <strong>0414-8817137</strong>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="block text-slate-700 font-bold mb-1 text-[11px]">Banco Emisor *</label>
                      <input 
                        type="text" 
                        required
                        value={paymentBank}
                        onChange={(e) => setPaymentBank(e.target.value)}
                        placeholder="Ej. Banesco, Mercantil, BDV..." 
                        className="w-full bg-white border border-amber-300 rounded-xl px-2.5 py-2 text-slate-800 text-xs focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-slate-700 font-bold mb-1 text-[11px]">Nro. de Referencia *</label>
                      <input 
                        type="text" 
                        required
                        value={paymentRef}
                        onChange={(e) => setPaymentRef(e.target.value)}
                        placeholder="Ej. 123456" 
                        className="w-full bg-white border border-amber-300 rounded-xl px-2.5 py-2 text-slate-800 text-xs font-mono font-bold focus:outline-none"
                      />
                    </div>
                  </div>
                </div>
              )}

              <button
                type="submit"
                disabled={rsvpSuccess}
                className="w-full py-3.5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 text-slate-950 font-serif font-black text-xs uppercase tracking-wider hover:from-amber-600 hover:to-amber-700 transition-all mt-4 shadow-md active:scale-98 disabled:opacity-50"
              >
                {rsvpSuccess ? 'Procesando Registro...' : 'Confirmar Mi Registro Oficial'}
              </button>
            </form>

          </div>
        </div>
      )}

    </section>
  );
}
