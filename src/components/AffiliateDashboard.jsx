import React, { useState } from 'react';
import { 
  UserCheck, 
  ShieldCheck, 
  CreditCard, 
  BookOpen, 
  Mail, 
  Award, 
  CheckCircle2, 
  Download, 
  TrendingUp, 
  Clock, 
  Sparkles
} from 'lucide-react';
import { AFFILIATES_DATA } from '../data/affiliatesData';

export function AffiliateDashboard({ t }) {
  const [activeTab, setActiveTab] = useState('overview'); // overview | certificate | payments | courses | board
  const [paymentStep, setPaymentStep] = useState('select'); // select | success
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState('pago-movil');
  const [contactMessage, setContactMessage] = useState('');
  const [contactSubject, setContactSubject] = useState('Consulta Gremial');
  const [messageSent, setMessageSent] = useState(false);

  const { currentUser, boardMembers, internalCourses, guildBenefits } = AFFILIATES_DATA;

  const handleSimulatePayment = (e) => {
    e.preventDefault();
    setPaymentStep('processing');
    setTimeout(() => {
      setPaymentStep('success');
    }, 1000);
  };

  const handleSendMessage = (e) => {
    e.preventDefault();
    setMessageSent(true);
    setTimeout(() => {
      setMessageSent(false);
      setContactMessage('');
      alert('Su mensaje ha sido remitido a la Secretaría Ejecutiva de la Junta Directiva. Recibirá respuesta en menos de 24 horas hábiles.');
    }, 1200);
  };

  return (
    <section className="py-12 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      
      {/* Header Banner */}
      <div className="p-6 sm:p-8 rounded-3xl bg-white border border-slate-200 shadow-xl mb-8">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-2xl bg-amber-500 flex items-center justify-center text-white shadow-md shrink-0">
              <ShieldCheck className="w-9 h-9" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold uppercase px-2.5 py-0.5 rounded-full bg-amber-100 text-amber-900 border border-amber-300">
                  Portal Exclusivo Gremial
                </span>
                <span className="text-xs font-bold text-emerald-700 flex items-center gap-1">
                  <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                  {currentUser.status}
                </span>
              </div>
              <h2 className="font-serif text-2xl sm:text-3xl font-bold text-slate-900 mt-1">
                {currentUser.restaurantName}
              </h2>
              <p className="text-xs text-slate-600 font-medium">
                Representante: <strong>{currentUser.ownerName}</strong> — Código de Afiliado: <span className="font-bold text-amber-800">{currentUser.id}</span>
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => setActiveTab('certificate')}
              className="py-2.5 px-4 rounded-xl bg-amber-500 hover:bg-amber-600 text-white font-serif font-bold text-xs uppercase tracking-wider flex items-center gap-1.5 transition-all shadow-sm"
            >
              <Award className="w-4 h-4" />
              <span>Ver Certificado Digital</span>
            </button>
          </div>
        </div>

        {/* Dashboard Navigation Tabs */}
        <div className="flex items-center gap-2 overflow-x-auto pt-6 mt-6 border-t border-slate-100">
          {[
            { id: 'overview', label: 'Resumen & Estatus', icon: TrendingUp },
            { id: 'certificate', label: 'Certificado Digital', icon: Award },
            { id: 'payments', label: 'Cuotas & Pagos', icon: CreditCard },
            { id: 'courses', label: 'Capacitaciones & Cursos', icon: BookOpen },
            { id: 'board', label: 'Contacto Junta Directiva', icon: Mail },
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 whitespace-nowrap ${
                  isActive
                    ? 'bg-slate-900 text-white shadow-md scale-105'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                }`}
              >
                <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-amber-400' : ''}`} />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Tab 1: Overview */}
      {activeTab === 'overview' && (
        <div className="space-y-6">
          
          {/* Key Metrics */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-sm">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-500">Impacto en Guía Global</span>
              <p className="font-serif text-2xl font-bold text-slate-900 mt-1">{currentUser.stats.profileViewsMonth}</p>
              <span className="text-xs text-emerald-700 font-bold flex items-center gap-1 mt-1">
                <TrendingUp className="w-3.5 h-3.5" /> +24% visitas este mes
              </span>
            </div>

            <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-sm">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-500">Reservas Solicitadas</span>
              <p className="font-serif text-2xl font-bold text-amber-800 mt-1">{currentUser.stats.reservationsMonth}</p>
              <span className="text-xs text-slate-500 mt-1 block">
                Canal oficial de la Cámara
              </span>
            </div>

            <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-sm">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-500">Auditoría Sanitaria y Calidad</span>
              <p className="font-serif text-base font-bold text-emerald-700 mt-1">100% Aprobada</p>
              <span className="text-xs text-slate-500 mt-1 block">
                Vigencia hasta Diciembre 2026
              </span>
            </div>
          </div>

          {/* Benefits Showcase */}
          <div className="p-6 rounded-3xl bg-white border border-slate-200 shadow-md">
            <h3 className="font-serif text-lg font-bold text-slate-900 flex items-center gap-2 mb-4">
              <Sparkles className="w-5 h-5 text-amber-600" />
              Beneficios Activos de su Membresía Élite
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {guildBenefits.map((b, i) => (
                <div key={i} className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 flex items-start gap-3">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 mt-0.5 shrink-0" />
                  <span className="text-xs font-medium text-slate-700">{b}</span>
                </div>
              ))}
            </div>
          </div>

        </div>
      )}

      {/* Tab 2: Digital Certificate */}
      {activeTab === 'certificate' && (
        <div className="max-w-3xl mx-auto p-8 sm:p-12 rounded-3xl bg-amber-50/50 border-4 border-amber-400 shadow-2xl text-center space-y-6">
          <div className="w-20 h-20 mx-auto rounded-full bg-gradient-to-br from-amber-500 to-terracotta flex items-center justify-center text-white shadow-lg">
            <ShieldCheck className="w-10 h-10" />
          </div>

          <div>
            <span className="text-xs font-bold uppercase tracking-widest text-amber-800 block">
              REPÚBLICA BOLIVARIANA DE VENEZUELA — ESTADO MÉRIDA
            </span>
            <h3 className="font-serif text-2xl sm:text-3xl font-bold text-slate-900 mt-1">
              CÁMARA GASTRONÓMICA DEL ESTADO MÉRIDA
            </h3>
            <p className="text-xs font-bold text-slate-500 uppercase tracking-widest mt-1">
              CERTIFICADO OFICIAL DE AFILIACIÓN & EXCELENCIA CULINARIA
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-white border border-amber-300 max-w-xl mx-auto shadow-sm">
            <p className="text-xs text-slate-600 leading-relaxed">
              Por cuanto el establecimiento <strong>{currentUser.restaurantName}</strong>, bajo la dirección de <strong>{currentUser.ownerName}</strong>, ha cumplido con los estándares de excelencia, trazabilidad de insumos andinos, higiene y servicio de sala:
            </p>
            <h4 className="font-serif text-xl font-bold text-amber-800 mt-3">
              SELLO DE CALIDAD GASTRONÓMICA MÉRIDA 2026
            </h4>
            <p className="text-xs font-bold text-slate-500 mt-2">
              Código Único de Verificación: <span className="text-slate-900 font-mono">{currentUser.certificateCode}</span>
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
            <button
              onClick={() => alert(`Descargando Certificado Digital Oficial en PDF (${currentUser.certificateCode})...`)}
              className="py-3 px-6 rounded-xl bg-amber-500 hover:bg-amber-600 text-white font-serif font-bold text-xs uppercase tracking-wider flex items-center gap-2 shadow-md"
            >
              <Download className="w-4 h-4" />
              <span>Descargar Certificado en PDF de Alta Resolución</span>
            </button>
          </div>
        </div>
      )}

      {/* Tab 3: Payments */}
      {activeTab === 'payments' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          <div className="lg:col-span-5 p-6 rounded-3xl bg-white border border-slate-200 shadow-md space-y-4">
            <h3 className="font-serif text-lg font-bold text-slate-900 flex items-center gap-2">
              <CreditCard className="w-5 h-5 text-amber-600" />
              Estado de Cuenta Gremial
            </h3>
            
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
              <div className="flex justify-between text-xs">
                <span className="text-slate-500">Cuota Mensual:</span>
                <span className="font-bold text-slate-900">{currentUser.monthlyDues}</span>
              </div>
              <div className="flex justify-between text-xs">
                <span className="text-slate-500">Último Pago:</span>
                <span className="font-bold text-emerald-700">{currentUser.lastPaymentDate}</span>
              </div>
              <div className="flex justify-between text-xs">
                <span className="text-slate-500">Próximo Vencimiento:</span>
                <span className="font-bold text-amber-800">05 de Septiembre de 2026</span>
              </div>
              <div className="pt-2 border-t border-slate-200 flex justify-between text-xs font-bold">
                <span className="text-slate-900">Total a Pagar (Septiembre):</span>
                <span className="text-amber-800 text-sm">{currentUser.monthlyDues}</span>
              </div>
            </div>

            <p className="text-xs text-slate-500 italic">
              El pago puntual de su membresía garantiza la visibilidad destacada en la Guía Turística Internacional y acceso a compras conjuntas de insumos agrícolas.
            </p>
          </div>

          <div className="lg:col-span-7 p-6 rounded-3xl bg-white border border-slate-200 shadow-md">
            {paymentStep === 'success' ? (
              <div className="text-center py-8 space-y-3 animate-fadeIn">
                <CheckCircle2 className="w-12 h-12 text-emerald-600 mx-auto" />
                <h4 className="font-serif text-xl font-bold text-slate-900">¡Pago Procesado y Conciliado con Éxito!</h4>
                <p className="text-xs text-slate-600 max-w-md mx-auto">
                  Su solvencia gremial ha sido actualizada automáticamente hasta el 30 de Septiembre de 2026. Hemos emitido el recibo electrónico a su correo.
                </p>
                <button
                  onClick={() => setPaymentStep('select')}
                  className="mt-4 py-2 px-5 rounded-xl bg-slate-900 text-white text-xs font-bold"
                >
                  Realizar Otro Movimiento
                </button>
              </div>
            ) : (
              <form onSubmit={handleSimulatePayment} className="space-y-4">
                <h3 className="font-serif text-lg font-bold text-slate-900">Pasarela de Pago Gremial</h3>
                
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {[
                    { id: 'pago-movil', label: 'Pago Móvil (Bs)' },
                    { id: 'zelle', label: 'Zelle (USD)' },
                    { id: 'usdt', label: 'Binance USDT' },
                    { id: 'card', label: 'Tarjeta Int.' }
                  ].map(m => (
                    <button
                      key={m.id}
                      type="button"
                      onClick={() => setSelectedPaymentMethod(m.id)}
                      className={`p-3 rounded-xl text-xs font-bold border transition-all ${
                        selectedPaymentMethod === m.id
                          ? 'bg-amber-500 text-white border-amber-500 shadow-sm'
                          : 'bg-slate-50 text-slate-700 border-slate-200 hover:border-amber-300'
                      }`}
                    >
                      {m.label}
                    </button>
                  ))}
                </div>

                <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 text-xs space-y-1">
                  {selectedPaymentMethod === 'pago-movil' && (
                    <>
                      <p className="font-bold text-amber-800">Banco: Banco Mercantil (0105)</p>
                      <p className="text-slate-700">RIF: J-50192837-0 (Cámara Gastronómica Mérida)</p>
                      <p className="text-slate-700">Teléfono: 0414-7481122</p>
                    </>
                  )}
                  {selectedPaymentMethod === 'zelle' && (
                    <>
                      <p className="font-bold text-amber-800">Titular: Camara Gastronomica Merida Inc.</p>
                      <p className="text-slate-700">Correo Zelle: pagos@camaragastronomicamerida.org</p>
                    </>
                  )}
                  {selectedPaymentMethod === 'usdt' && (
                    <>
                      <p className="font-bold text-amber-800">Red: TRC-20 (USDT Tron Network)</p>
                      <p className="text-slate-700 text-[11px] truncate font-mono">Wallet: TMeridaGastro2026CryptoAndesFin8821V</p>
                    </>
                  )}
                  {selectedPaymentMethod === 'card' && (
                    <p className="text-slate-700">Procesamiento seguro con encriptación SSL</p>
                  )}
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Número de Referencia / Comprobante</label>
                  <input 
                    type="text" 
                    required 
                    placeholder="Ej. REF-98310294" 
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-xs text-slate-800 focus:outline-none focus:border-amber-500 focus:bg-white"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-3 rounded-xl bg-amber-500 hover:bg-amber-600 text-white font-serif font-bold text-xs uppercase tracking-wider shadow-sm transition-all"
                >
                  {paymentStep === 'processing' ? 'Conciliando Pago...' : 'Confirmar Pago de Cuota ($35.00)'}
                </button>
              </form>
            )}
          </div>

        </div>
      )}

      {/* Tab 4: Courses */}
      {activeTab === 'courses' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-serif text-xl font-bold text-slate-900">Programa de Formación & Certificaciones 2026</h3>
            <span className="text-xs font-bold text-amber-800">3 Cursos Disponibles</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {internalCourses.map((course) => (
              <div key={course.id} className="p-5 rounded-2xl bg-white border border-slate-200 shadow-sm flex flex-col justify-between space-y-4">
                <div>
                  <span className="text-[10px] font-bold uppercase px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-300">
                    {course.duration}
                  </span>
                  <h4 className="font-serif font-bold text-base text-slate-900 mt-2 leading-snug">
                    {course.title}
                  </h4>
                  <div className="flex items-center gap-1 text-xs text-amber-800 font-bold mt-2">
                    <Clock className="w-3.5 h-3.5 text-amber-600" />
                    <span>{course.date}</span>
                  </div>
                  <p className="text-xs text-slate-600 mt-2">
                    Instructor: <strong>{course.instructor}</strong>
                  </p>
                </div>

                <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-800">{course.memberPrice}</span>
                  <button
                    onClick={() => alert(`¡Inscrito en ${course.title}! Recibirá el enlace de la sala y material de estudio.`)}
                    className="py-1.5 px-3 rounded-lg bg-amber-500 text-white font-bold text-xs hover:bg-amber-600"
                  >
                    Inscribirse
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab 5: Board */}
      {activeTab === 'board' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          <div className="lg:col-span-5 space-y-4">
            <h3 className="font-serif text-xl font-bold text-slate-900">Junta Directiva 2025-2027</h3>
            <div className="space-y-3">
              {boardMembers.map((member, i) => (
                <div key={i} className="p-4 rounded-2xl bg-white border border-slate-200 shadow-sm">
                  <span className="text-[10px] uppercase font-bold text-amber-800 block">{member.role}</span>
                  <h4 className="font-serif font-bold text-slate-900 text-base mt-0.5">{member.name}</h4>
                  <p className="text-xs text-slate-600 mt-1">{member.bio}</p>
                  <div className="mt-2 text-xs">
                    <a href={`mailto:${member.email}`} className="text-sky-700 font-semibold hover:underline">{member.email}</a>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="lg:col-span-7 p-6 rounded-3xl bg-white border border-slate-200 shadow-md">
            <h3 className="font-serif text-lg font-bold text-slate-900 mb-2 flex items-center gap-2">
              <Mail className="w-5 h-5 text-amber-600" />
              Canal de Comunicación Directo
            </h3>
            <p className="text-xs text-slate-600 mb-4">
              Envíe propuestas, solicitudes de inspección sanitaria o consultas a la Junta Directiva.
            </p>

            <form onSubmit={handleSendMessage} className="space-y-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Asunto</label>
                <select 
                  value={contactSubject}
                  onChange={(e) => setContactSubject(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-xs text-slate-800 focus:outline-none focus:border-amber-500 focus:bg-white"
                >
                  <option>Consulta Gremial / Legal</option>
                  <option>Solicitud de Auditoría para Sello de Calidad</option>
                  <option>Propuesta para Ferias del Sol 2026</option>
                  <option>Convenios de Proveedores Agrícolas</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Mensaje para la Directiva</label>
                <textarea 
                  rows={4}
                  required
                  value={contactMessage}
                  onChange={(e) => setContactMessage(e.target.value)}
                  placeholder="Escriba aquí los detalles de su solicitud o propuesta gremial..."
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-xs text-slate-800 focus:outline-none focus:border-amber-500 focus:bg-white"
                />
              </div>

              <button
                type="submit"
                className="w-full py-3 rounded-xl bg-amber-500 hover:bg-amber-600 text-white font-serif font-bold text-xs uppercase tracking-wider transition-all shadow-sm"
              >
                {messageSent ? 'Enviando Mensaje...' : 'Enviar a la Junta Directiva'}
              </button>
            </form>
          </div>

        </div>
      )}

    </section>
  );
}
