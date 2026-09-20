import React, { useState } from 'react';
import { 
  GraduationCap, 
  Cpu, 
  Calendar, 
  Sparkles, 
  Building2, 
  QrCode, 
  CreditCard, 
  Truck, 
  TrendingUp, 
  Users, 
  Award, 
  MapPin, 
  ArrowRight, 
  CheckCircle2, 
  Send, 
  X,
  Clock,
  Layers
} from 'lucide-react';
import { ACADEMY_DATA } from '../data/academyData';

export function AcademyGlubbiSection({ t, setActiveTab }) {
  const [activeTabSub, setActiveTabSub] = useState('alliance'); // alliance | glubbi | expo
  const [expoModalOpen, setExpoModalOpen] = useState(false);
  const [expoSuccess, setExpoSuccess] = useState(false);
  const [glubbiDemoActive, setGlubbiDemoActive] = useState(false);

  const handleExpoSubmit = (e) => {
    e.preventDefault();
    setExpoSuccess(true);
    setTimeout(() => {
      setExpoSuccess(false);
      setExpoModalOpen(false);
    }, 2500);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      
      {/* Header Hero */}
      <div className="relative rounded-3xl bg-gradient-to-br from-slate-950 via-slate-900 to-sky-950 p-8 sm:p-12 text-white shadow-2xl overflow-hidden mb-12 border border-sky-500/20">
        <div className="absolute -right-20 -bottom-20 w-96 h-96 bg-sky-500/15 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute left-1/3 top-0 w-80 h-80 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 max-w-4xl">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-sky-500/20 border border-sky-400/40 text-sky-300 text-xs font-bold mb-4 backdrop-blur-md">
            <GraduationCap className="w-4 h-4 text-sky-400" />
            <span>ACADEMIA • TECNOLOGÍA IA • PROYECCIÓN 2027</span>
          </div>

          <h1 className="font-serif text-3xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-white leading-tight">
            Academia, Innovación & Expo Andes 2027
          </h1>

          <p className="mt-4 font-serif text-lg sm:text-xl text-amber-300/90 italic">
            "La técnica sin academia no tiene raíz."
          </p>

          <p className="mt-3 text-slate-300 text-sm sm:text-base leading-relaxed max-w-3xl">
            Articulamos la ilustre <strong>Universidad de Los Andes (ULA)</strong> y el <strong>Hotel Escuela</strong> con el músculo tecnológico predictivo de <strong>Glubbi</strong>, proyectando nuestra cordillera hacia la <strong>Expo Andes Gastronómico 2027</strong>.
          </p>

          {/* Navigation Sub-Pills */}
          <div className="mt-8 flex flex-wrap items-center gap-3">
            <button
              onClick={() => setActiveTabSub('alliance')}
              className={`py-2.5 px-5 rounded-xl font-bold text-xs uppercase tracking-wider flex items-center gap-2 transition-all ${
                activeTabSub === 'alliance'
                  ? 'bg-amber-500 text-white shadow-lg'
                  : 'bg-white/10 hover:bg-white/20 text-slate-300 border border-white/15'
              }`}
            >
              <GraduationCap className="w-4 h-4" />
              <span>1. Alianza ULA & Hotel Escuela</span>
            </button>

            <button
              onClick={() => setActiveTabSub('glubbi')}
              className={`py-2.5 px-5 rounded-xl font-bold text-xs uppercase tracking-wider flex items-center gap-2 transition-all ${
                activeTabSub === 'glubbi'
                  ? 'bg-sky-500 text-white shadow-lg'
                  : 'bg-white/10 hover:bg-white/20 text-slate-300 border border-white/15'
              }`}
            >
              <Cpu className="w-4 h-4" />
              <span>2. Plataforma Glubbi AI</span>
            </button>

            <button
              onClick={() => setActiveTabSub('expo')}
              className={`py-2.5 px-5 rounded-xl font-bold text-xs uppercase tracking-wider flex items-center gap-2 transition-all ${
                activeTabSub === 'expo'
                  ? 'bg-emerald-500 text-white shadow-lg'
                  : 'bg-white/10 hover:bg-white/20 text-slate-300 border border-white/15'
              }`}
            >
              <Calendar className="w-4 h-4" />
              <span>3. Expo Andes 2027</span>
            </button>
          </div>

        </div>
      </div>

      {/* SECTION 1: ACADEMIC ALLIANCE */}
      {activeTabSub === 'alliance' && (
        <div className="space-y-10 animate-fadeIn">
          
          <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-10 shadow-lg">
            <div className="max-w-3xl mb-8">
              <span className="text-xs uppercase font-bold text-amber-800 tracking-wider">Formación Universitaria & Fogones Reales</span>
              <h2 className="font-serif text-2xl sm:text-4xl font-bold text-slate-900 mt-1">
                Alianza Estratégica con la Universidad de Los Andes (ULA)
              </h2>
              <p className="text-xs sm:text-sm text-slate-600 mt-3 leading-relaxed">
                En alianza estratégica con nuestra ilustre Universidad de Los Andes y su Departamento de Gestión Gastronómica, articulamos la teoría con la práctica en fogones reales, impulsando con determinación la consolidación de la <strong>Licenciatura en Gastronomía</strong>. Un esfuerzo que se enlaza de inmediato con el Hotel Escuela y los centros de formación en Tovar, La Playa y El Vigía.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {ACADEMY_DATA.alliance.pillars.map((pil, idx) => (
                <div key={idx} className="p-6 rounded-2xl bg-slate-50 border border-slate-200 flex flex-col justify-between hover:border-amber-400 hover:bg-white transition-all shadow-sm">
                  <div>
                    <div className="w-12 h-12 rounded-xl bg-amber-100 text-amber-800 flex items-center justify-center mb-4">
                      <GraduationCap className="w-6 h-6" />
                    </div>
                    <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 inline-block mb-2">
                      {pil.status}
                    </span>
                    <h3 className="font-serif font-bold text-lg text-slate-900">
                      {pil.institution}
                    </h3>
                    <p className="text-xs font-bold text-amber-800 mt-0.5">
                      {pil.department}
                    </p>
                    <p className="text-xs font-semibold text-slate-700 mt-2">
                      {pil.degree}
                    </p>
                    <p className="text-xs text-slate-600 mt-3 leading-relaxed">
                      {pil.highlight}
                    </p>
                  </div>

                  <div className="pt-4 mt-4 border-t border-slate-200 text-xs font-bold text-slate-600 flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5 text-amber-600" />
                    <span>Prácticas en Restaurantes Miembros</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Regional Network Showcase */}
          <div className="rounded-3xl bg-amber-50/80 border border-amber-200 p-8 sm:p-10 flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="space-y-2">
              <span className="text-xs uppercase font-bold text-amber-800">Descentralización Educativa</span>
              <h3 className="font-serif text-2xl font-bold text-slate-900">
                Sedes de Formación en Tovar, La Playa y El Vigía
              </h3>
              <p className="text-xs sm:text-sm text-slate-700 max-w-2xl">
                Llevamos la formación técnica a los centros agroproductivos: barismo en el Mocotíes, cocina de altura en el Páramo y transformación agroalimentaria del cacao en la zona panamericana.
              </p>
            </div>
            <button
              onClick={() => { setActiveTab('jobs'); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
              className="py-3 px-6 rounded-xl bg-amber-500 hover:bg-amber-600 text-white font-bold text-xs uppercase tracking-wider shadow-md shrink-0 transition-all"
            >
              Ver Bolsa de Empleo para Egresados
            </button>
          </div>

        </div>
      )}

      {/* SECTION 2: GLUBBI AI PLATFORM */}
      {activeTabSub === 'glubbi' && (
        <div className="space-y-10 animate-fadeIn">
          
          <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-10 shadow-lg">
            
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 mb-8">
              <div>
                <span className="text-xs uppercase font-bold text-sky-800 tracking-wider flex items-center gap-1.5">
                  <Cpu className="w-4 h-4 text-sky-600" />
                  Músculo Operativo & Comercial
                </span>
                <h2 className="font-serif text-2xl sm:text-4xl font-bold text-slate-900 mt-1">
                  Integración Oficial con Glubbi
                </h2>
                <p className="text-xs sm:text-sm text-slate-600 mt-2 max-w-2xl">
                  Plataforma de comercio y entrega con analítica de demanda predictiva por inteligencia artificial, cartas digitales inteligentes y pagos integrados para dinamizar las ventas multicanal de nuestros miembros.
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-sky-50 border border-sky-200 text-center shrink-0">
                <span className="text-xs uppercase font-bold text-sky-800 block">Impacto en Operaciones</span>
                <span className="text-2xl sm:text-3xl font-serif font-extrabold text-sky-900 block mt-0.5">-38% Mermas</span>
                <span className="text-[11px] text-slate-600">Por predicción de afluencia</span>
              </div>
            </div>

            {/* Glubbi Features Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              {ACADEMY_DATA.glubbi.features.map((feat, idx) => (
                <div key={idx} className="p-6 rounded-2xl bg-slate-50 border border-slate-200 hover:border-sky-400 hover:bg-white transition-all shadow-sm flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <div className="p-3 rounded-xl bg-sky-100 text-sky-700">
                        {idx === 0 && <Cpu className="w-6 h-6" />}
                        {idx === 1 && <QrCode className="w-6 h-6" />}
                        {idx === 2 && <CreditCard className="w-6 h-6" />}
                        {idx === 3 && <Truck className="w-6 h-6" />}
                      </div>
                      <span className="text-xs font-extrabold px-3 py-1 rounded-full bg-emerald-100 text-emerald-800">
                        {feat.stat}
                      </span>
                    </div>

                    <h3 className="font-serif font-bold text-lg text-slate-900">
                      {feat.title}
                    </h3>
                    <p className="text-xs text-slate-600 mt-2 leading-relaxed">
                      {feat.desc}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            {/* Interactive Live AI Demo Box */}
            <div className="p-6 sm:p-8 rounded-2xl bg-gradient-to-r from-slate-900 to-sky-950 text-white">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-4">
                <div>
                  <span className="text-xs uppercase font-bold text-sky-400">Simulador de Demanda en Tiempo Real</span>
                  <h4 className="font-serif font-bold text-lg text-white">
                    Glubbi AI Demand Engine (Mérida & Ejes)
                  </h4>
                </div>
                <button
                  onClick={() => setGlubbiDemoActive(!glubbiDemoActive)}
                  className="py-2 px-4 rounded-xl bg-sky-500 hover:bg-sky-600 text-white font-bold text-xs uppercase tracking-wider shadow-sm transition-all"
                >
                  {glubbiDemoActive ? 'Pausar Telemetría' : 'Simular Telemetría de Hoy'}
                </button>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
                <div className="p-3 rounded-xl bg-white/10 border border-white/10">
                  <span className="text-slate-400 block">Afluencia Estimada:</span>
                  <span className="font-bold text-white text-sm">{glubbiDemoActive ? 'Alta (+42% fin de semana)' : 'Normal'}</span>
                </div>
                <div className="p-3 rounded-xl bg-white/10 border border-white/10">
                  <span className="text-slate-400 block">Vuelos Alberto Carnevalli:</span>
                  <span className="font-bold text-emerald-400 text-sm">{glubbiDemoActive ? '3 vuelos (98% ocupación)' : '1 vuelo'}</span>
                </div>
                <div className="p-3 rounded-xl bg-white/10 border border-white/10">
                  <span className="text-slate-400 block">Plato Más Proyectado:</span>
                  <span className="font-bold text-amber-300 text-sm">{glubbiDemoActive ? 'Trucha Asalmonada en Brasa' : 'Pizca Andina'}</span>
                </div>
                <div className="p-3 rounded-xl bg-white/10 border border-white/10">
                  <span className="text-slate-400 block">Ahorro en Compras:</span>
                  <span className="font-bold text-sky-300 text-sm">{glubbiDemoActive ? '$340 por local/semana' : 'Calculando...'}</span>
                </div>
              </div>
            </div>

          </div>

        </div>
      )}

      {/* SECTION 3: EXPO ANDES GASTRONOMICO 2027 */}
      {activeTabSub === 'expo' && (
        <div className="space-y-10 animate-fadeIn">
          
          <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-10 shadow-lg">
            
            <div className="max-w-3xl mb-8">
              <span className="text-xs uppercase font-bold text-emerald-800 tracking-wider">El Gran Horizonte de la Gastronomía Nacional</span>
              <h2 className="font-serif text-3xl sm:text-5xl font-bold text-slate-900 mt-1">
                Expo Andes Gastronómico 2027
              </h2>
              <p className="text-xs sm:text-sm text-slate-600 mt-3 leading-relaxed">
                El magno evento que congregará en Mérida a los <strong>grandes proveedores, conferencistas internacionales, concursos de cocina en vivo y ruedas de negocios</strong> del país.
              </p>
            </div>

            {/* Expo Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
              {ACADEMY_DATA.expo2027.stats.map((st, i) => (
                <div key={i} className="p-5 rounded-2xl bg-emerald-50 border border-emerald-200 text-center">
                  <span className="font-serif text-3xl sm:text-4xl font-extrabold text-emerald-900 block">
                    {st.number}
                  </span>
                  <span className="text-xs uppercase font-bold text-emerald-800 block mt-1">
                    {st.label}
                  </span>
                </div>
              ))}
            </div>

            {/* 4 Major Tracks */}
            <h3 className="font-serif font-bold text-xl text-slate-900 mb-4">
              Ejes Centrales de la Expo 2027:
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              {ACADEMY_DATA.expo2027.tracks.map((track, idx) => (
                <div key={idx} className="p-6 rounded-2xl bg-slate-50 border border-slate-200 hover:border-emerald-400 hover:bg-white transition-all shadow-sm">
                  <div className="flex items-center gap-2 mb-2">
                    <div className="w-8 h-8 rounded-lg bg-emerald-500 text-white flex items-center justify-center font-bold text-xs">
                      0{idx + 1}
                    </div>
                    <h4 className="font-serif font-bold text-base text-slate-900">
                      {track.name}
                    </h4>
                  </div>
                  <p className="text-xs text-slate-600 leading-relaxed mt-2">
                    {track.desc}
                  </p>
                </div>
              ))}
            </div>

            <div className="pt-6 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-2 text-xs text-slate-600">
                <MapPin className="w-4 h-4 text-emerald-600" />
                <span>{ACADEMY_DATA.expo2027.location}</span>
              </div>

              <button
                onClick={() => setExpoModalOpen(true)}
                className="py-3 px-6 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs uppercase tracking-wider flex items-center gap-2 shadow-md transition-all"
              >
                <Calendar className="w-4 h-4" />
                <span>Pre-Registro & Patrocinios Expo 2027</span>
              </button>
            </div>

          </div>

        </div>
      )}

      {/* Modal: Expo 2027 Pre-Registration */}
      {expoModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto animate-fadeIn">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl relative my-8">
            <button
              onClick={() => setExpoModalOpen(false)}
              className="absolute top-5 right-5 p-2 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-600 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            {expoSuccess ? (
              <div className="text-center py-8 space-y-3">
                <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 mx-auto flex items-center justify-center">
                  <CheckCircle2 className="w-10 h-10" />
                </div>
                <h3 className="font-serif text-2xl font-bold text-slate-900">¡Pre-Registro Confirmado!</h3>
                <p className="text-xs text-slate-600 max-w-sm mx-auto">
                  Hemos reservado su solicitud informativa para la <strong>Expo Andes Gastronómico 2027</strong>. Recibirá el dossier comercial de stands, bases del concurso culinario y acreditaciones de prensa.
                </p>
              </div>
            ) : (
              <form onSubmit={handleExpoSubmit} className="space-y-4">
                <div>
                  <span className="text-xs uppercase font-bold text-emerald-800">Comité Organizador</span>
                  <h3 className="font-serif text-xl font-bold text-slate-900">Expo Andes Gastronómico 2027</h3>
                  <p className="text-xs text-slate-500">Pre-registro para expositores, conferencistas y concursantes</p>
                </div>

                <div className="space-y-3 pt-2">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Nombre / Empresa *</label>
                    <input
                      type="text"
                      required
                      placeholder="Ej. Distribuidora Culinaria Andina / Chef Carlos Gómez"
                      className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-xs font-medium focus:outline-none focus:border-emerald-500"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">Tipo de Participación</label>
                      <select className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-xs font-medium focus:outline-none focus:border-emerald-500 text-slate-700">
                        <option>Stand Comercial / Proveedor</option>
                        <option>Participante Copa Culinaria</option>
                        <option>Asistente al Congreso</option>
                        <option>Rueda de Negocios B2B</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">Teléfono / WhatsApp *</label>
                      <input
                        type="tel"
                        required
                        placeholder="+58 412 9876543"
                        className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-xs font-medium focus:outline-none focus:border-emerald-500"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Correo Electrónico *</label>
                    <input
                      type="email"
                      required
                      placeholder="contacto@empresa.com"
                      className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-xs font-medium focus:outline-none focus:border-emerald-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Comentarios o Requerimientos de Espacio</label>
                    <textarea
                      rows="3"
                      placeholder="Indique metros cuadrados requeridos para stand o categoría de concurso culinario..."
                      className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-xs font-medium focus:outline-none focus:border-emerald-500"
                    />
                  </div>
                </div>

                <div className="pt-4 border-t border-slate-100 flex items-center justify-end gap-3">
                  <button
                    type="button"
                    onClick={() => setExpoModalOpen(false)}
                    className="py-2.5 px-4 rounded-xl border border-slate-300 text-slate-700 font-bold text-xs"
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    className="py-2.5 px-6 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs uppercase tracking-wider flex items-center gap-2 shadow-md"
                  >
                    <Send className="w-4 h-4" />
                    <span>Enviar Pre-Registro</span>
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}

    </div>
  );
}
