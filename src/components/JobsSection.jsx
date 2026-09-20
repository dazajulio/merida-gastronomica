import React, { useState } from 'react';
import { 
  Briefcase, 
  MapPin, 
  DollarSign, 
  Clock, 
  Search, 
  Filter, 
  CheckCircle2, 
  Send, 
  PlusCircle, 
  X, 
  Building2, 
  GraduationCap, 
  ShieldCheck, 
  Sparkles,
  ChevronRight,
  Award
} from 'lucide-react';
import { JOBS_DATA } from '../data/jobsData';

export function JobsSection({ t, setActiveTab }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDept, setSelectedDept] = useState('all');
  const [selectedZone, setSelectedZone] = useState('all');
  const [selectedJob, setSelectedJob] = useState(null);
  const [applyModalJob, setApplyModalJob] = useState(null);
  const [postJobModalOpen, setPostJobModalOpen] = useState(false);
  const [applicationSuccess, setApplicationSuccess] = useState(false);
  const [postSuccess, setPostSuccess] = useState(false);

  // Filter logic
  const departments = ['all', 'Cocina', 'Sala & Servicio', 'Bar & Cafetería', 'Gestión & Administración'];
  const zones = ['all', 'Eje Metropolitano (Mérida Centro)', 'Eje Metropolitano (El Valle)', 'Eje Metropolitano (Mérida Milla)', 'Eje Metropolitano (Mérida Belén)', 'Eje Páramo (Apartaderos - 3.500 msnm)', 'Eje Valle del Mocotíes (Tovar)', 'Eje Valle del Mocotíes (Bailadores)'];

  const filteredJobs = JOBS_DATA.filter((job) => {
    const matchSearch = 
      job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      job.restaurant.toLowerCase().includes(searchTerm.toLowerCase()) ||
      job.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchDept = selectedDept === 'all' || job.department === selectedDept;
    const matchZone = selectedZone === 'all' || job.zone.toLowerCase().includes(selectedZone.toLowerCase().slice(0, 10));
    return matchSearch && matchDept && matchZone;
  });

  const handleApplySubmit = (e) => {
    e.preventDefault();
    setApplicationSuccess(true);
    setTimeout(() => {
      setApplicationSuccess(false);
      setApplyModalJob(null);
    }, 2500);
  };

  const handlePostSubmit = (e) => {
    e.preventDefault();
    setPostSuccess(true);
    setTimeout(() => {
      setPostSuccess(false);
      setPostJobModalOpen(false);
    }, 2500);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      
      {/* Header Banner */}
      <div className="relative rounded-3xl bg-gradient-to-br from-slate-900 via-slate-800 to-amber-950 p-8 sm:p-12 text-white shadow-2xl overflow-hidden mb-12">
        <div className="absolute -right-10 -bottom-10 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
        
        <div className="relative z-10 max-w-3xl">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-amber-500/20 border border-amber-500/40 text-amber-400 text-xs font-bold mb-4 backdrop-blur-md">
            <Briefcase className="w-3.5 h-3.5" />
            <span>Bolsa de Empleo Oficial de los Agremiados</span>
          </div>

          <h1 className="font-serif text-3xl sm:text-5xl font-bold tracking-tight text-white leading-tight">
            Ofertas de Empleo & Talento Gastronómico
          </h1>

          <p className="mt-4 text-slate-300 text-sm sm:text-base leading-relaxed">
            Conectamos el talento humano más calificado con los restaurantes, hoteles y cavas agremiadas a la Cámara Gastronómica del Estado Mérida. Oportunidades en cocina de autor, barismo, sala de alta gama y gestión de A&B.
          </p>

          <div className="mt-8 flex flex-wrap items-center gap-4">
            <button
              onClick={() => setPostJobModalOpen(true)}
              className="py-3 px-6 rounded-xl bg-amber-500 hover:bg-amber-600 text-white font-bold text-xs uppercase tracking-wider flex items-center gap-2 shadow-lg transition-all"
            >
              <PlusCircle className="w-4 h-4" />
              <span>Publicar Vacante (Agremiados)</span>
            </button>

            <div className="flex items-center gap-2 text-xs text-amber-300/90 font-medium">
              <ShieldCheck className="w-4 h-4 text-amber-400" />
              <span>Vacantes verificadas con condiciones laborales formales</span>
            </div>
          </div>
        </div>

        {/* Quick Stats Grid */}
        <div className="mt-10 pt-8 border-t border-white/10 grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="p-4 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-sm">
            <span className="text-2xl font-bold font-serif text-amber-400">18+</span>
            <span className="text-[11px] uppercase tracking-wider block text-slate-300 mt-0.5">Vacantes Activas</span>
          </div>
          <div className="p-4 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-sm">
            <span className="text-2xl font-bold font-serif text-sky-400">45+</span>
            <span className="text-[11px] uppercase tracking-wider block text-slate-300 mt-0.5">Restaurantes Miembros</span>
          </div>
          <div className="p-4 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-sm">
            <span className="text-2xl font-bold font-serif text-emerald-400">100%</span>
            <span className="text-[11px] uppercase tracking-wider block text-slate-300 mt-0.5">Sueldos en Divisas</span>
          </div>
          <div className="p-4 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-sm">
            <span className="text-2xl font-bold font-serif text-amber-300">ULA / H.E.</span>
            <span className="text-[11px] uppercase tracking-wider block text-slate-300 mt-0.5">Convenio Formativo</span>
          </div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm mb-8 space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
          
          {/* Search Input */}
          <div className="md:col-span-5 relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Buscar por cargo (Sous Chef, Barista), restaurante o técnica..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 text-xs sm:text-sm font-medium focus:outline-none focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20"
            />
          </div>

          {/* Department Filter */}
          <div className="md:col-span-4">
            <select
              value={selectedDept}
              onChange={(e) => setSelectedDept(e.target.value)}
              className="w-full py-2.5 px-3 rounded-xl border border-slate-200 text-xs sm:text-sm font-medium bg-white focus:outline-none focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 text-slate-700"
            >
              <option value="all">Todas las Áreas (Cocina, Sala, Bar, Gestión)</option>
              <option value="Cocina">Cocina & Pastelería</option>
              <option value="Sala & Servicio">Sala & Hospitalidad</option>
              <option value="Bar & Cafetería">Bar & Barismo de Especialidad</option>
              <option value="Gestión & Administración">Gestión & A&B</option>
            </select>
          </div>

          {/* Clear Filters */}
          <div className="md:col-span-3 flex items-center justify-end">
            <span className="text-xs text-slate-500 font-bold">
              Mostrando {filteredJobs.length} vacantes disponibles
            </span>
          </div>

        </div>

        {/* Fast Department Pills */}
        <div className="flex flex-wrap gap-2 pt-2 border-t border-slate-100">
          {departments.map((dept) => (
            <button
              key={dept}
              onClick={() => setSelectedDept(dept)}
              className={`text-xs px-3.5 py-1.5 rounded-full font-bold transition-all ${
                selectedDept === dept
                  ? 'bg-amber-500 text-white shadow-sm'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {dept === 'all' ? 'Ver Todos los Cargos' : dept}
            </button>
          ))}
        </div>
      </div>

      {/* Jobs Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-16">
        {filteredJobs.map((job) => (
          <div 
            key={job.id} 
            className="bg-white rounded-2xl border border-slate-200 hover:border-amber-400 p-6 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-between group"
          >
            <div>
              {/* Card Header */}
              <div className="flex items-start justify-between gap-4 mb-3">
                <div>
                  <div className="flex items-center gap-2 mb-1.5">
                    <span className="text-[10px] font-bold uppercase px-2.5 py-0.5 rounded-md bg-amber-100 text-amber-900 border border-amber-200">
                      {job.department}
                    </span>
                    {job.urgency === 'Alta' && (
                      <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded-md bg-red-100 text-red-700 border border-red-200 animate-pulse">
                        Urgente
                      </span>
                    )}
                  </div>
                  <h3 className="font-serif font-bold text-lg sm:text-xl text-slate-900 group-hover:text-amber-700 transition-colors">
                    {job.title}
                  </h3>
                  <div className="flex items-center gap-1.5 text-xs text-slate-600 font-medium mt-1">
                    <Building2 className="w-3.5 h-3.5 text-amber-600 shrink-0" />
                    <span className="font-bold text-slate-800">{job.restaurant}</span>
                  </div>
                </div>

                <span className="text-[11px] text-slate-400 font-medium shrink-0">
                  {job.postedDate}
                </span>
              </div>

              {/* Location & Salary Chips */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 my-3.5 text-xs">
                <div className="flex items-center gap-1.5 p-2 rounded-xl bg-slate-50 text-slate-700 border border-slate-100">
                  <MapPin className="w-3.5 h-3.5 text-sky-600 shrink-0" />
                  <span className="truncate">{job.zone}</span>
                </div>
                <div className="flex items-center gap-1.5 p-2 rounded-xl bg-emerald-50 text-emerald-800 border border-emerald-100 font-bold">
                  <DollarSign className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                  <span>{job.salaryRange}</span>
                </div>
              </div>

              {/* Description Snippet */}
              <p className="text-xs text-slate-600 line-clamp-3 leading-relaxed mb-4">
                {job.description}
              </p>

              {/* Benefits Highlights */}
              <div className="space-y-1.5 mb-4">
                <span className="text-[10px] uppercase font-bold text-amber-800 tracking-wider block">
                  Beneficios Destacados:
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {job.benefits.slice(0, 2).map((benefit, i) => (
                    <span key={i} className="text-[11px] px-2.5 py-1 rounded-lg bg-amber-50 text-amber-900 border border-amber-100 flex items-center gap-1">
                      <CheckCircle2 className="w-3 h-3 text-amber-600" />
                      <span>{benefit}</span>
                    </span>
                  ))}
                  {job.benefits.length > 2 && (
                    <span className="text-[11px] px-2 py-1 rounded-lg bg-slate-100 text-slate-600 font-semibold">
                      +{job.benefits.length - 2} más
                    </span>
                  )}
                </div>
              </div>
            </div>

            {/* Bottom Action Buttons */}
            <div className="pt-4 border-t border-slate-100 flex items-center justify-between gap-3">
              <button
                onClick={() => setSelectedJob(job)}
                className="text-xs font-bold text-slate-700 hover:text-amber-700 transition-colors flex items-center gap-1"
              >
                <span>Ver Requisitos Completos</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>

              <button
                onClick={() => setApplyModalJob(job)}
                className="py-2 px-4 rounded-xl bg-amber-500 hover:bg-amber-600 text-white font-bold text-xs uppercase tracking-wider flex items-center gap-1.5 shadow-sm transition-all"
              >
                <Send className="w-3.5 h-3.5" />
                <span>Postularme</span>
              </button>
            </div>

          </div>
        ))}
      </div>

      {/* Alliance Banner with Hotel Escuela & ULA */}
      <div className="rounded-3xl bg-slate-100 border border-slate-200 p-8 flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-amber-500 text-white flex items-center justify-center shrink-0 shadow-md">
            <GraduationCap className="w-8 h-8" />
          </div>
          <div>
            <h4 className="font-serif font-bold text-lg text-slate-900">
              ¿Egresado de la ULA o del Hotel Escuela de Los Andes?
            </h4>
            <p className="text-xs text-slate-600 max-w-xl mt-1">
              Los aspirantes formados en las escuelas técnicas y universitarias de Mérida cuentan con ponderación preferencial en los procesos de selección de los restaurantes afiliados.
            </p>
          </div>
        </div>
        <button
          onClick={() => {
            setActiveTab('academy');
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
          className="py-3 px-5 rounded-xl bg-white border border-slate-300 hover:border-amber-500 text-slate-800 font-bold text-xs uppercase tracking-wider shadow-sm transition-all shrink-0"
        >
          Conocer Alianzas Académicas
        </button>
      </div>

      {/* Modal: Job Details */}
      {selectedJob && (
        <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto animate-fadeIn">
          <div className="bg-white rounded-3xl max-w-2xl w-full p-6 sm:p-8 shadow-2xl relative my-8">
            <button
              onClick={() => setSelectedJob(null)}
              className="absolute top-5 right-5 p-2 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-600 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-2 mb-2">
              <span className="text-xs font-bold uppercase px-2.5 py-0.5 rounded bg-amber-100 text-amber-900">
                {selectedJob.department}
              </span>
              <span className="text-xs font-bold text-slate-500">
                {selectedJob.contractType}
              </span>
            </div>

            <h2 className="font-serif text-2xl sm:text-3xl font-bold text-slate-900">
              {selectedJob.title}
            </h2>
            <p className="text-sm font-bold text-amber-700 mt-1 flex items-center gap-1.5">
              <Building2 className="w-4 h-4" />
              <span>{selectedJob.restaurant} — {selectedJob.zone}</span>
            </p>

            <div className="mt-4 p-4 rounded-2xl bg-emerald-50 border border-emerald-200 flex items-center justify-between">
              <span className="text-xs uppercase font-bold text-emerald-900">Remuneración Estimada:</span>
              <span className="font-serif font-bold text-lg text-emerald-800">{selectedJob.salaryRange}</span>
            </div>

            <div className="mt-6 space-y-4 text-xs sm:text-sm text-slate-700">
              <div>
                <h4 className="font-bold text-slate-900 uppercase text-xs mb-1">Descripción del Cargo:</h4>
                <p className="leading-relaxed text-slate-600">{selectedJob.description}</p>
              </div>

              <div>
                <h4 className="font-bold text-slate-900 uppercase text-xs mb-2">Requisitos Indispensables:</h4>
                <ul className="space-y-1.5">
                  {selectedJob.requirements.map((req, i) => (
                    <li key={i} className="flex items-start gap-2">
                      <div className="w-1.5 h-1.5 rounded-full bg-amber-500 mt-1.5 shrink-0" />
                      <span>{req}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div>
                <h4 className="font-bold text-slate-900 uppercase text-xs mb-2">Paquete de Beneficios:</h4>
                <ul className="space-y-1.5">
                  {selectedJob.benefits.map((ben, i) => (
                    <li key={i} className="flex items-start gap-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                      <span>{ben}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            <div className="mt-8 pt-4 border-t border-slate-100 flex items-center justify-end gap-3">
              <button
                onClick={() => setSelectedJob(null)}
                className="py-2.5 px-5 rounded-xl border border-slate-300 text-slate-700 font-bold text-xs"
              >
                Cerrar
              </button>
              <button
                onClick={() => {
                  const jobToApply = selectedJob;
                  setSelectedJob(null);
                  setApplyModalJob(jobToApply);
                }}
                className="py-2.5 px-6 rounded-xl bg-amber-500 hover:bg-amber-600 text-white font-bold text-xs uppercase tracking-wider flex items-center gap-2 shadow-md"
              >
                <Send className="w-4 h-4" />
                <span>Postularme Ahora</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal: Application Form */}
      {applyModalJob && (
        <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto animate-fadeIn">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl relative my-8">
            <button
              onClick={() => setApplyModalJob(null)}
              className="absolute top-5 right-5 p-2 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-600 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            {applicationSuccess ? (
              <div className="text-center py-8 space-y-3">
                <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 mx-auto flex items-center justify-center">
                  <CheckCircle2 className="w-10 h-10" />
                </div>
                <h3 className="font-serif text-2xl font-bold text-slate-900">¡Postulación Enviada con Éxito!</h3>
                <p className="text-xs text-slate-600 max-w-sm mx-auto">
                  Tus datos y perfil profesional han sido remitidos directamente al departamento de Talento Humano de <strong>{applyModalJob.restaurant}</strong> con copia a la Cámara Gastronómica.
                </p>
              </div>
            ) : (
              <form onSubmit={handleApplySubmit} className="space-y-4">
                <div>
                  <span className="text-xs uppercase font-bold text-amber-800">Formulario de Postulación</span>
                  <h3 className="font-serif text-xl font-bold text-slate-900">{applyModalJob.title}</h3>
                  <p className="text-xs text-slate-500">{applyModalJob.restaurant}</p>
                </div>

                <div className="space-y-3 pt-2">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Nombre y Apellido *</label>
                    <input
                      type="text"
                      required
                      placeholder="Ej. Andrés Paredes"
                      className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-xs font-medium focus:outline-none focus:border-amber-500"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">Teléfono / WhatsApp *</label>
                      <input
                        type="tel"
                        required
                        placeholder="+58 414 1234567"
                        className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-xs font-medium focus:outline-none focus:border-amber-500"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">Correo Electrónico *</label>
                      <input
                        type="email"
                        required
                        placeholder="andres@email.com"
                        className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-xs font-medium focus:outline-none focus:border-amber-500"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Años de Experiencia en el Área *</label>
                    <select className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-xs font-medium focus:outline-none focus:border-amber-500 text-slate-700">
                      <option>Menos de 1 año / En formación</option>
                      <option>1 a 2 años</option>
                      <option>3 a 5 años</option>
                      <option>Más de 5 años</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Formación Académica / Escuela</label>
                    <input
                      type="text"
                      placeholder="Ej. ULA Gestión Gastronómica / Hotel Escuela / Autodidacta"
                      className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-xs font-medium focus:outline-none focus:border-amber-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Resumen de Experiencia / Enlace a CV o Instagram Profesional</label>
                    <textarea
                      rows="3"
                      placeholder="Indique los últimos restaurantes donde laboró o enlace a su CV en PDF..."
                      className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-xs font-medium focus:outline-none focus:border-amber-500"
                    />
                  </div>

                  <div className="flex items-center gap-2 pt-1">
                    <input type="checkbox" id="certHealth" required className="rounded text-amber-600 focus:ring-amber-500" />
                    <label htmlFor="certHealth" className="text-[11px] text-slate-600">
                      Poseo Certificado de Salud y Manipulación de Alimentos vigentes (o en trámite).
                    </label>
                  </div>
                </div>

                <div className="pt-4 border-t border-slate-100 flex items-center justify-end gap-3">
                  <button
                    type="button"
                    onClick={() => setApplyModalJob(null)}
                    className="py-2.5 px-4 rounded-xl border border-slate-300 text-slate-700 font-bold text-xs"
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    className="py-2.5 px-6 rounded-xl bg-amber-500 hover:bg-amber-600 text-white font-bold text-xs uppercase tracking-wider flex items-center gap-2 shadow-md"
                  >
                    <Send className="w-4 h-4" />
                    <span>Enviar Postulación</span>
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}

      {/* Modal: Post Job (Members Only) */}
      {postJobModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto animate-fadeIn">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl relative my-8">
            <button
              onClick={() => setPostJobModalOpen(false)}
              className="absolute top-5 right-5 p-2 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-600 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            {postSuccess ? (
              <div className="text-center py-8 space-y-3">
                <div className="w-16 h-16 rounded-full bg-amber-100 text-amber-600 mx-auto flex items-center justify-center">
                  <CheckCircle2 className="w-10 h-10" />
                </div>
                <h3 className="font-serif text-2xl font-bold text-slate-900">¡Vacante Recibida!</h3>
                <p className="text-xs text-slate-600 max-w-sm mx-auto">
                  La vacante ha sido registrada. El equipo de la Cámara Gastronómica validará su número de afiliación gremial y la publicará en la bolsa de empleo en menos de 2 horas.
                </p>
              </div>
            ) : (
              <form onSubmit={handlePostSubmit} className="space-y-4">
                <div>
                  <span className="text-xs uppercase font-bold text-amber-800">Servicio Gremial</span>
                  <h3 className="font-serif text-xl font-bold text-slate-900">Publicar Oferta de Empleo</h3>
                  <p className="text-xs text-slate-500">Exclusivo para restaurantes y establecimientos agremiados</p>
                </div>

                <div className="space-y-3 pt-2">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Nombre del Establecimiento *</label>
                    <input
                      type="text"
                      required
                      placeholder="Ej. Restaurante Los Portales Andinos"
                      className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-xs font-medium focus:outline-none focus:border-amber-500"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">N° de Afiliado Cámara *</label>
                      <input
                        type="text"
                        required
                        placeholder="Ej. CAM-MER-2026-042"
                        className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-xs font-medium focus:outline-none focus:border-amber-500"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">Departamento</label>
                      <select className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-xs font-medium focus:outline-none focus:border-amber-500 text-slate-700">
                        <option>Cocina</option>
                        <option>Sala & Servicio</option>
                        <option>Bar & Cafetería</option>
                        <option>Gestión & Administración</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Cargo a Solicitar *</label>
                    <input
                      type="text"
                      required
                      placeholder="Ej. Jefe de Partida / Barista / Maître"
                      className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-xs font-medium focus:outline-none focus:border-amber-500"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">Rango Salarial Estimado</label>
                      <input
                        type="text"
                        placeholder="Ej. $400 - $600 + Propinas"
                        className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-xs font-medium focus:outline-none focus:border-amber-500"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">Ubicación / Zona</label>
                      <input
                        type="text"
                        placeholder="Ej. Mérida Centro / El Valle"
                        className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-xs font-medium focus:outline-none focus:border-amber-500"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Requisitos y Beneficios Ofrecidos</label>
                    <textarea
                      rows="3"
                      placeholder="Detalle experiencia requerida, horarios, bonos de transporte o alojamiento..."
                      className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-xs font-medium focus:outline-none focus:border-amber-500"
                    />
                  </div>
                </div>

                <div className="pt-4 border-t border-slate-100 flex items-center justify-end gap-3">
                  <button
                    type="button"
                    onClick={() => setPostJobModalOpen(false)}
                    className="py-2.5 px-4 rounded-xl border border-slate-300 text-slate-700 font-bold text-xs"
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    className="py-2.5 px-6 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs uppercase tracking-wider flex items-center gap-2 shadow-md"
                  >
                    <PlusCircle className="w-4 h-4 text-amber-400" />
                    <span>Publicar Vacante</span>
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
