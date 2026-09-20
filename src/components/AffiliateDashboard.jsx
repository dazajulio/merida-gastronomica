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
  Sparkles,
  Briefcase,
  PlusCircle,
  Users,
  Eye,
  X,
  Send,
  Building2,
  DollarSign
} from 'lucide-react';
import { AFFILIATES_DATA } from '../data/affiliatesData';

export function AffiliateDashboard({ t }) {
  const [activeTab, setActiveTab] = useState('overview'); // overview | certificate | payments | courses | jobs | board
  const [paymentStep, setPaymentStep] = useState('select'); // select | success
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState('pago-movil');
  const [contactMessage, setContactMessage] = useState('');
  const [contactSubject, setContactSubject] = useState('Consulta Gremial');
  const [messageSent, setMessageSent] = useState(false);

  // Job creation state for affiliates
  const [createdJobs, setCreatedJobs] = useState([
    {
      id: 'aff-job-1',
      title: 'Sous Chef Ejecutivo & Jefe de Partida',
      department: 'Cocina',
      salary: '$450 - $650 + Propinas en Divisas',
      type: 'Tiempo Completo',
      applicantsCount: 6,
      status: 'Activa',
      date: 'Publicado hace 2 días',
      applicants: [
        { name: 'Andrés Paredes', school: 'Hotel Escuela de Los Andes', exp: '4 años', status: 'En Evaluación' },
        { name: 'Mariana Rojas', school: 'ULA Gestión Gastronómica', exp: '3 años', status: 'Entrevista Agendada' },
        { name: 'Carlos Briceño', school: 'Centro Técnico Tovar', exp: '5 años', status: 'Revisado' }
      ]
    },
    {
      id: 'aff-job-2',
      title: 'Barista de Especialidad & Latte Art',
      department: 'Bar & Cafetería',
      salary: '$320 - $480 + Propinas',
      type: 'Tiempo Completo',
      applicantsCount: 4,
      status: 'Activa',
      date: 'Publicado hace 4 días',
      applicants: [
        { name: 'Gabriel Mendoza', school: 'Certificado SCA / Barismo Mérida', exp: '2 años', status: 'En Evaluación' },
        { name: 'Lucía Valero', school: 'Hotel Escuela', exp: '1 año', status: 'Revisado' }
      ]
    }
  ]);

  const [newJobTitle, setNewJobTitle] = useState('');
  const [newJobDept, setNewJobDept] = useState('Cocina');
  const [newJobSalary, setNewJobSalary] = useState('');
  const [newJobType, setNewJobType] = useState('Tiempo Completo');
  const [newJobExp, setNewJobExp] = useState('2 a 3 años');
  const [newJobBenefits, setNewJobBenefits] = useState('Almuerzo incluido, transporte nocturno');
  const [newJobDesc, setNewJobDesc] = useState('');
  const [jobCreatedSuccess, setJobCreatedSuccess] = useState(false);
  const [viewingApplicantsJob, setViewingApplicantsJob] = useState(null);

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

  const handleCreateJob = (e) => {
    e.preventDefault();
    if (!newJobTitle.trim()) return;

    const newJob = {
      id: `aff-job-${Date.now()}`,
      title: newJobTitle,
      department: newJobDept,
      salary: newJobSalary || '$400 - $600 + Propinas',
      type: newJobType,
      applicantsCount: 0,
      status: 'Activa',
      date: 'Publicado hoy',
      applicants: []
    };

    setCreatedJobs([newJob, ...createdJobs]);
    setJobCreatedSuccess(true);
    setNewJobTitle('');
    setNewJobSalary('');
    setNewJobDesc('');

    setTimeout(() => {
      setJobCreatedSuccess(false);
    }, 3000);
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
            { id: 'jobs', label: 'Crear Empleos', icon: Briefcase },
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
                className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center gap-2 whitespace-nowrap ${
                  isActive
                    ? 'bg-slate-900 text-white shadow-md scale-105'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? 'text-amber-400' : ''}`} />
                <span>{tab.label}</span>
                {tab.id === 'jobs' && (
                  <span className="text-[9px] uppercase font-extrabold px-1.5 py-0.2 rounded bg-amber-500 text-white">
                    Nuevo
                  </span>
                )}
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

          {/* Guild Benefits */}
          <div className="p-6 rounded-3xl bg-white border border-slate-200 shadow-sm">
            <h3 className="font-serif text-xl font-bold text-slate-900 mb-4">
              Beneficios Activos de su Membresía Gremial
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {guildBenefits.map((benefit, idx) => (
                <div key={idx} className="p-4 rounded-2xl bg-slate-50 border border-slate-100 flex items-start gap-3">
                  <div className="p-2 rounded-xl bg-amber-100 text-amber-800 shrink-0 mt-0.5">
                    <CheckCircle2 className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="font-bold text-sm text-slate-900">{benefit.title}</h4>
                    <p className="text-xs text-slate-600 mt-0.5">{benefit.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>
      )}

      {/* Tab 2: Certificate */}
      {activeTab === 'certificate' && (
        <div className="max-w-3xl mx-auto bg-gradient-to-br from-amber-50 to-white p-8 sm:p-12 rounded-3xl border-4 border-amber-300 shadow-2xl relative text-center">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-amber-500 text-white text-xs font-bold uppercase tracking-widest mb-4">
            <Award className="w-4 h-4" />
            Certificado Oficial de Afiliación
          </div>

          <h3 className="font-serif text-3xl sm:text-4xl font-bold text-slate-900">
            Cámara Gastronómica del Estado Mérida
          </h3>
          <p className="text-xs text-slate-600 uppercase tracking-wider mt-1">
            República Bolivariana de Venezuela
          </p>

          <div className="my-8 py-6 border-y-2 border-amber-200/80">
            <p className="text-xs text-slate-500 uppercase tracking-wider">Se certifica que el establecimiento:</p>
            <h4 className="font-serif text-3xl font-extrabold text-amber-900 mt-2">
              {currentUser.restaurantName}
            </h4>
            <p className="text-xs font-medium text-slate-700 mt-2 max-w-md mx-auto">
              Cumple con los estatutos gremiales, la norma de buenas prácticas de manipulación y el aval de excelencia turística andina.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-4 text-xs text-slate-600 text-left max-w-md mx-auto mb-8">
            <div>
              <span className="block text-slate-400 font-bold uppercase text-[10px]">Número de Registro:</span>
              <span className="font-mono font-bold text-slate-800">{currentUser.id}</span>
            </div>
            <div>
              <span className="block text-slate-400 font-bold uppercase text-[10px]">Fecha de Emisión:</span>
              <span className="font-bold text-slate-800">Enero 2026</span>
            </div>
          </div>

          <button
            onClick={() => alert('Descargando Certificado Digital en Alta Resolución (PDF Firmado)...')}
            className="py-3 px-6 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-serif font-bold text-xs uppercase tracking-wider flex items-center gap-2 mx-auto shadow-md transition-all"
          >
            <Download className="w-4 h-4 text-amber-400" />
            <span>Descargar Certificado PDF</span>
          </button>
        </div>
      )}

      {/* Tab 3: Crear Empleos (NUEVA PESTAÑA) */}
      {activeTab === 'jobs' && (
        <div className="space-y-8 animate-fadeIn">
          
          {/* Header */}
          <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-slate-900 to-amber-950 text-white shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
            <div className="space-y-1 max-w-2xl">
              <span className="text-xs font-extrabold uppercase px-3 py-1 rounded-full bg-amber-500/20 text-amber-400 border border-amber-500/30">
                Bolsa de Empleo Agremiada
              </span>
              <h3 className="font-serif text-2xl sm:text-3xl font-bold text-white mt-2">
                Gestión & Creación de Ofertas Laborales
              </h3>
              <p className="text-xs sm:text-sm text-slate-300">
                Publique vacantes directamente en la <strong>Bolsa de Empleo Oficial</strong> de la Cámara Gastronómica para captar talento calificado de la ULA, el Hotel Escuela y escuelas técnicas regionales.
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-white/10 border border-white/15 text-center shrink-0">
              <span className="text-xs uppercase font-bold text-amber-400 block">Vacantes Activas</span>
              <span className="text-2xl sm:text-3xl font-serif font-bold text-white block mt-0.5">{createdJobs.length}</span>
              <span className="text-[10px] text-slate-300">Con visibilidad inmediata</span>
            </div>
          </div>

          {/* Form to Create Job */}
          <div className="p-6 sm:p-8 rounded-3xl bg-white border border-slate-200 shadow-md">
            <div className="flex items-center gap-2 mb-6">
              <PlusCircle className="w-5 h-5 text-amber-600" />
              <h4 className="font-serif text-xl font-bold text-slate-900">
                Publicar Nueva Vacante en la Bolsa de Empleo
              </h4>
            </div>

            {jobCreatedSuccess && (
              <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold flex items-center gap-2 mb-6 animate-fadeIn">
                <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                <span>¡Vacante publicada con éxito! Ya está visible en la sección pública de Ofertas de Empleo.</span>
              </div>
            )}

            <form onSubmit={handleCreateJob} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Título del Cargo *</label>
                  <input
                    type="text"
                    required
                    placeholder="Ej. Chef de Partida / Sommelier de Café / Capitán de Mesoneros"
                    value={newJobTitle}
                    onChange={(e) => setNewJobTitle(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-medium focus:outline-none focus:border-amber-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Área / Departamento *</label>
                  <select
                    value={newJobDept}
                    onChange={(e) => setNewJobDept(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-medium bg-white focus:outline-none focus:border-amber-500 text-slate-700"
                  >
                    <option value="Cocina">Cocina & Pastelería</option>
                    <option value="Sala & Servicio">Sala & Hospitalidad</option>
                    <option value="Bar & Cafetería">Bar & Barismo de Especialidad</option>
                    <option value="Gestión & Administración">Gestión & A&B</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Rango Salarial en Divisas *</label>
                  <input
                    type="text"
                    required
                    placeholder="Ej. $400 - $600 + Propinas"
                    value={newJobSalary}
                    onChange={(e) => setNewJobSalary(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-medium focus:outline-none focus:border-amber-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Tipo de Jornada</label>
                  <select
                    value={newJobType}
                    onChange={(e) => setNewJobType(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-medium bg-white focus:outline-none focus:border-amber-500 text-slate-700"
                  >
                    <option>Tiempo Completo</option>
                    <option>Medio Tiempo</option>
                    <option>Fines de Semana / Temporada</option>
                    <option>Rotativo (Páramo)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Experiencia Requerida</label>
                  <select
                    value={newJobExp}
                    onChange={(e) => setNewJobExp(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-medium bg-white focus:outline-none focus:border-amber-500 text-slate-700"
                  >
                    <option>Sin experiencia / Egresado ULA o Hotel Escuela</option>
                    <option>1 a 2 años</option>
                    <option>2 a 3 años</option>
                    <option>4+ años (Senior / Jefe)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Beneficios Ofrecidos</label>
                <input
                  type="text"
                  placeholder="Ej. Almuerzo incluido, transporte nocturno garantizado, capacitaciones certificadas"
                  value={newJobBenefits}
                  onChange={(e) => setNewJobBenefits(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-medium focus:outline-none focus:border-amber-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Descripción de Funciones y Requisitos</label>
                <textarea
                  rows="3"
                  placeholder="Detalle las responsabilidades clave, manejo de recetas, estandarización y requerimientos técnicos..."
                  value={newJobDesc}
                  onChange={(e) => setNewJobDesc(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-medium focus:outline-none focus:border-amber-500"
                />
              </div>

              <div className="pt-2 flex justify-end">
                <button
                  type="submit"
                  className="py-3 px-6 rounded-xl bg-amber-500 hover:bg-amber-600 text-white font-serif font-bold text-xs uppercase tracking-wider flex items-center gap-2 shadow-md transition-all"
                >
                  <PlusCircle className="w-4 h-4" />
                  <span>Publicar Vacante Inmediatamente</span>
                </button>
              </div>
            </form>
          </div>

          {/* List of Published Vacancies by this Member */}
          <div className="p-6 sm:p-8 rounded-3xl bg-white border border-slate-200 shadow-md">
            <h4 className="font-serif text-xl font-bold text-slate-900 mb-4">
              Sus Vacantes Publicadas ({createdJobs.length})
            </h4>

            <div className="space-y-4">
              {createdJobs.map((job) => (
                <div key={job.id} className="p-5 rounded-2xl bg-slate-50 border border-slate-200 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded bg-amber-100 text-amber-900">
                        {job.department}
                      </span>
                      <span className="text-xs font-bold text-emerald-700 flex items-center gap-1">
                        <div className="w-2 h-2 rounded-full bg-emerald-500" />
                        {job.status}
                      </span>
                      <span className="text-[11px] text-slate-400">
                        {job.date}
                      </span>
                    </div>

                    <h5 className="font-serif font-bold text-lg text-slate-900">{job.title}</h5>
                    <p className="text-xs text-slate-600">
                      <strong>Remuneración:</strong> {job.salary} • <strong>Jornada:</strong> {job.type}
                    </p>
                  </div>

                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => setViewingApplicantsJob(job)}
                      className="py-2 px-4 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs flex items-center gap-1.5 shadow-sm"
                    >
                      <Users className="w-3.5 h-3.5 text-amber-400" />
                      <span>Ver Postulados ({job.applicants?.length || job.applicantsCount})</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>
      )}

      {/* Tab 4: Payments */}
      {activeTab === 'payments' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          <div className="lg:col-span-6 space-y-4">
            <div className="p-6 rounded-3xl bg-white border border-slate-200 shadow-sm">
              <span className="text-xs font-bold uppercase text-slate-400">Estatus de Solvencia Gremial</span>
              <h3 className="font-serif text-xl font-bold text-slate-900 mt-1">Cuota Ordinaria Mensual</h3>
              <p className="text-xs text-slate-600 mt-1">
                La cuota gremial financia las auditorías de calidad, campañas publicitarias de la ciudad y el mantenimiento de la guía web internacional.
              </p>

              <div className="my-4 p-4 rounded-2xl bg-slate-50 border border-slate-100 flex items-center justify-between">
                <div>
                  <span className="text-xs font-bold text-slate-700">Monto Mensual:</span>
                  <span className="text-xs text-slate-500 block">Restaurante Categoría A</span>
                </div>
                <span className="font-serif font-bold text-2xl text-slate-900">$25.00 <span className="text-xs font-normal text-slate-500">/ mes</span></span>
              </div>

              <div className="p-3 rounded-xl bg-emerald-50 text-emerald-800 text-xs font-bold flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>Solvente — Próximo corte: 30 de Noviembre de 2026</span>
              </div>
            </div>
          </div>

          <div className="lg:col-span-6 p-6 rounded-3xl bg-white border border-slate-200 shadow-md">
            <h3 className="font-serif text-lg font-bold text-slate-900 mb-3">Registrar Pago de Cuota</h3>

            {paymentStep === 'success' ? (
              <div className="text-center py-6 space-y-2">
                <div className="w-12 h-12 rounded-full bg-emerald-100 text-emerald-600 mx-auto flex items-center justify-center">
                  <CheckCircle2 className="w-7 h-7" />
                </div>
                <h4 className="font-serif font-bold text-lg text-slate-900">¡Pago Reportado con Éxito!</h4>
                <p className="text-xs text-slate-600">El departamento de administración conciliará el reporte en las próximas 2 horas.</p>
                <button
                  onClick={() => setPaymentStep('select')}
                  className="mt-2 text-xs font-bold text-amber-800 underline"
                >
                  Registrar otro pago
                </button>
              </div>
            ) : (
              <form onSubmit={handleSimulatePayment} className="space-y-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Método de Pago</label>
                  <select 
                    value={selectedPaymentMethod}
                    onChange={(e) => setSelectedPaymentMethod(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-800 focus:outline-none focus:border-amber-500 focus:bg-white"
                  >
                    <option value="pago-movil">Pago Móvil Interbancario (Banesco / Mercantil)</option>
                    <option value="zelle">Zelle / Transferencia Internacional</option>
                    <option value="efectivo">Efectivo en Sede de la Cámara</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Número de Referencia / Comprobante</label>
                  <input 
                    type="text" 
                    required
                    placeholder="Ej. 09847291"
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-800 focus:outline-none focus:border-amber-500 focus:bg-white"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Meses a Pagar</label>
                  <select className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-800 focus:outline-none focus:border-amber-500 focus:bg-white">
                    <option>1 Mes ($25.00)</option>
                    <option>3 Meses ($75.00 - 5% Descuento)</option>
                    <option>Año Completo ($270.00 - 10% Descuento)</option>
                  </select>
                </div>

                <button
                  type="submit"
                  className="w-full py-2.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-white font-serif font-bold text-xs uppercase tracking-wider transition-all shadow-sm mt-2"
                >
                  {paymentStep === 'processing' ? 'Procesando...' : 'Reportar Pago'}
                </button>
              </form>
            )}
          </div>

        </div>
      )}

      {/* Tab 5: Courses */}
      {activeTab === 'courses' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-serif text-xl font-bold text-slate-900">Capacitaciones Exclusivas para Brigadas de Miembros</h3>
              <p className="text-xs text-slate-600">Descuento del 50% al 100% para el personal de restaurantes afiliados.</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {internalCourses.map((course) => (
              <div key={course.id} className="p-5 rounded-2xl bg-white border border-slate-200 shadow-sm flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between gap-2 mb-2">
                    <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded bg-amber-100 text-amber-900">
                      {course.category}
                    </span>
                    <span className="text-xs text-slate-500 font-medium">{course.hours}</span>
                  </div>

                  <h4 className="font-serif font-bold text-base text-slate-900 mt-1">{course.title}</h4>
                  
                  <div className="my-2 text-xs text-slate-500 flex items-center gap-1">
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

      {/* Tab 6: Board */}
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

      {/* Modal: View Applicants for a Job */}
      {viewingApplicantsJob && (
        <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto animate-fadeIn">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl relative my-8">
            <button
              onClick={() => setViewingApplicantsJob(null)}
              className="absolute top-5 right-5 p-2 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-600 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            <span className="text-xs uppercase font-bold text-amber-800">Candidatos Postulados</span>
            <h3 className="font-serif text-xl font-bold text-slate-900 mt-1">{viewingApplicantsJob.title}</h3>
            <p className="text-xs text-slate-500 mb-4">{viewingApplicantsJob.department} • {viewingApplicantsJob.salary}</p>

            {viewingApplicantsJob.applicants && viewingApplicantsJob.applicants.length > 0 ? (
              <div className="space-y-3 my-4">
                {viewingApplicantsJob.applicants.map((cand, idx) => (
                  <div key={idx} className="p-4 rounded-2xl bg-slate-50 border border-slate-200 flex items-center justify-between">
                    <div>
                      <h5 className="font-bold text-sm text-slate-900">{cand.name}</h5>
                      <p className="text-xs text-slate-600">{cand.school} • Exp: {cand.exp}</p>
                    </div>
                    <span className="text-[10px] uppercase font-bold px-2.5 py-1 rounded-full bg-amber-100 text-amber-900">
                      {cand.status}
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              <div className="py-8 text-center text-slate-500 text-xs">
                Aún no se han recibido nuevas postulaciones para esta vacante.
              </div>
            )}

            <div className="pt-4 border-t border-slate-100 flex justify-end">
              <button
                onClick={() => setViewingApplicantsJob(null)}
                className="py-2.5 px-5 rounded-xl bg-slate-900 text-white font-bold text-xs"
              >
                Cerrar Panel
              </button>
            </div>
          </div>
        </div>
      )}

    </section>
  );
}
