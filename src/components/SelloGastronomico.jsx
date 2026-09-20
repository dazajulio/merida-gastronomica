import React, { useState } from 'react';
import { 
  Award, 
  ShieldCheck, 
  CheckCircle2, 
  Sparkles, 
  Sliders, 
  FileText, 
  Search, 
  TrendingUp, 
  HeartHandshake, 
  CheckSquare, 
  X, 
  Send, 
  Building2, 
  Star,
  ChevronRight,
  ExternalLink
} from 'lucide-react';
import { SELLO_DATA } from '../data/selloData';

export function SelloGastronomico({ t, setActiveTab }) {
  const [activePillar, setActivePillar] = useState('calidad');
  const [requestModalOpen, setRequestModalOpen] = useState(false);
  const [requestSuccess, setRequestSuccess] = useState(false);
  
  // Interactive mini-simulator state
  const [simAnswers, setSimAnswers] = useState({});

  const sampleChecklist = [
    { id: 'sim-1', pillar: 'Calidad', label: 'Estandarización documentada de fichas técnicas con costos y gramajes al 100%' },
    { id: 'sim-2', pillar: 'Calidad', label: 'Uso de café, cacao y productos andinos con trazabilidad y origen certificado' },
    { id: 'sim-3', pillar: 'Calidad', label: 'Registro diario de termómetros digitales en cámaras de frío (-18°C / +4°C)' },
    { id: 'sim-4', pillar: 'Servicio', label: 'Protocolo de bienvenida andina y comanda en tiempos menores a 5 minutos' },
    { id: 'sim-5', pillar: 'Servicio', label: 'Carta digital bilingüe (Español/Inglés) con detalle de alérgenos e ingredientes' },
    { id: 'sim-6', pillar: 'Servicio', label: 'Personal de sala capacitado en maridaje de vinos y cata de café de especialidad' },
    { id: 'sim-7', pillar: 'Limpieza', label: 'Plan de Análisis de Peligros y Puntos Críticos de Control (HACCP) en ejecución' },
    { id: 'sim-8', pillar: 'Limpieza', label: 'Tablas de corte y cuchillería codificada por color para evitar contaminación cruzada' },
    { id: 'sim-9', pillar: 'Limpieza', label: 'Plan integral de pesaje y control de mermas con reciclaje de aceite usado' },
    { id: 'sim-10', pillar: 'Limpieza', label: 'Certificados de salud y manipulación de alimentos vigentes para todo el equipo' },
  ];

  const toggleSimAnswer = (id) => {
    setSimAnswers(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const checkedCount = Object.values(simAnswers).filter(Boolean).length;
  const simulatedScore = Math.round((checkedCount / sampleChecklist.length) * 100);

  const handleRequestSubmit = (e) => {
    e.preventDefault();
    setRequestSuccess(true);
    setTimeout(() => {
      setRequestSuccess(false);
      setRequestModalOpen(false);
    }, 2500);
  };

  const pillarIcons = {
    'calidad': Award,
    'servicio': HeartHandshake,
    'limpieza': ShieldCheck
  };

  const currentPillarData = SELLO_DATA.pillars.find(p => p.id === activePillar) || SELLO_DATA.pillars[0];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      
      {/* Majestic Institutional Header */}
      <div className="relative rounded-3xl bg-gradient-to-br from-slate-950 via-slate-900 to-amber-950 p-8 sm:p-12 text-white shadow-2xl overflow-hidden mb-12 border border-amber-500/30">
        <div className="absolute -right-16 -bottom-16 w-96 h-96 bg-amber-500/15 rounded-full blur-3xl pointer-events-none" />
        
        <div className="relative z-10 max-w-4xl">
          
          <div className="inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full bg-amber-500/20 border border-amber-400/40 text-amber-300 text-xs font-bold mb-6 backdrop-blur-md">
            <ShieldCheck className="w-4 h-4 text-amber-400" />
            <span>NORMA TÉCNICA OFICIAL — CÁMARA GASTRONÓMICA DEL ESTADO MÉRIDA</span>
          </div>

          <h1 className="font-serif text-3xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-white leading-tight">
            Sello Mérida Gastronómica
          </h1>

          <p className="mt-4 font-serif text-lg sm:text-xl text-amber-200/90 italic font-medium">
            "Para ser referentes globales, la excelencia debe ser medible."
          </p>

          <p className="mt-4 text-slate-200 text-sm sm:text-base leading-relaxed max-w-3xl">
            Más que un reconocimiento, es una <strong>norma técnica y un estándar de confianza comparable a certificaciones internacionales</strong>. A través de una rigurosa auditoría de <strong>226 ítems</strong> sustentada en tres pilares —<strong>Calidad, Servicio y Limpieza</strong>—, evaluamos la gestión operativa, la seguridad alimentaria, el manejo de mermas y la excelencia de servicio.
          </p>

          <div className="mt-6 p-4 rounded-2xl bg-white/10 border border-white/15 backdrop-blur-md max-w-3xl">
            <p className="text-xs sm:text-sm text-white font-medium">
              ⭐ <strong>Acreditación AAA:</strong> Quien ostente este sello en su fachada acredita ante Venezuela y el mundo una Calificación AAA, garantizando un establecimiento seguro, rentable y memorable.
            </p>
          </div>

          <div className="mt-8 flex flex-wrap items-center gap-4">
            <button
              onClick={() => setRequestModalOpen(true)}
              className="py-3.5 px-7 rounded-xl bg-gradient-to-r from-amber-500 to-terracotta text-white font-bold text-xs uppercase tracking-wider flex items-center gap-2 shadow-xl hover:brightness-110 transition-all"
            >
              <Award className="w-4 h-4" />
              <span>Solicitar Auditoría de 226 Ítems</span>
            </button>

            <button
              onClick={() => {
                const el = document.getElementById('simulador-sello');
                if (el) el.scrollIntoView({ behavior: 'smooth' });
              }}
              className="py-3.5 px-6 rounded-xl bg-white/10 hover:bg-white/20 text-white border border-white/30 text-xs font-bold uppercase tracking-wider transition-all"
            >
              Simulador de Autoevaluación
            </button>
          </div>

        </div>

        {/* 3 Pillars Summary Badges */}
        <div className="mt-10 pt-8 border-t border-white/15 grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="p-5 rounded-2xl bg-white/5 border border-white/10 flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-amber-500/20 text-amber-400 border border-amber-500/30 flex items-center justify-center shrink-0">
              <Award className="w-6 h-6" />
            </div>
            <div>
              <span className="text-xl font-serif font-bold text-amber-400">80 Ítems</span>
              <span className="text-xs uppercase font-bold text-slate-300 block">Pilar I: Calidad Culinaria</span>
            </div>
          </div>

          <div className="p-5 rounded-2xl bg-white/5 border border-white/10 flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-sky-500/20 text-sky-400 border border-sky-500/30 flex items-center justify-center shrink-0">
              <HeartHandshake className="w-6 h-6" />
            </div>
            <div>
              <span className="text-xl font-serif font-bold text-sky-400">72 Ítems</span>
              <span className="text-xs uppercase font-bold text-slate-300 block">Pilar II: Servicio & Sala</span>
            </div>
          </div>

          <div className="p-5 rounded-2xl bg-white/5 border border-white/10 flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 flex items-center justify-center shrink-0">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <span className="text-xl font-serif font-bold text-emerald-400">74 Ítems</span>
              <span className="text-xs uppercase font-bold text-slate-300 block">Pilar III: Limpieza & Mermas</span>
            </div>
          </div>
        </div>

      </div>

      {/* Interactive Pillars Exploration */}
      <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-10 shadow-lg mb-16">
        
        <div className="text-center max-w-2xl mx-auto mb-8">
          <span className="text-xs uppercase font-bold text-amber-800 tracking-wider">Estructura de la Norma Técnica</span>
          <h2 className="font-serif text-3xl font-bold text-slate-900 mt-1">
            Los Tres Pilares de la Auditoría Técnica
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 mt-2">
            Haga clic en cada pilar para conocer el desglose de los 226 requerimientos auditados por los inspectores de la Cámara.
          </p>
        </div>

        {/* Tab Buttons */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-8">
          {SELLO_DATA.pillars.map((pillar) => {
            const Icon = pillarIcons[pillar.id] || Award;
            const isSelected = activePillar === pillar.id;
            return (
              <button
                key={pillar.id}
                onClick={() => setActivePillar(pillar.id)}
                className={`p-4 rounded-2xl border text-left transition-all duration-300 flex items-center gap-3.5 ${
                  isSelected
                    ? 'bg-slate-900 border-slate-900 text-white shadow-lg scale-102'
                    : 'bg-slate-50 border-slate-200 hover:border-slate-300 text-slate-700'
                }`}
              >
                <div className={`p-2.5 rounded-xl ${isSelected ? 'bg-amber-500 text-white' : 'bg-white text-slate-700 border border-slate-200'}`}>
                  <Icon className="w-5 h-5" />
                </div>
                <div>
                  <span className={`text-[10px] uppercase font-bold block ${isSelected ? 'text-amber-400' : 'text-slate-500'}`}>
                    {pillar.itemsCount} Ítems Auditados
                  </span>
                  <span className="font-serif font-bold text-sm">
                    {pillar.name}
                  </span>
                </div>
              </button>
            );
          })}
        </div>

        {/* Pillar Details Grid */}
        <div className="p-6 sm:p-8 rounded-2xl bg-slate-50 border border-slate-200">
          <div className="max-w-3xl mb-6">
            <h3 className="font-serif text-2xl font-bold text-slate-900">
              {currentPillarData.name} ({currentPillarData.itemsCount} Requisitos)
            </h3>
            <p className="text-xs sm:text-sm text-slate-600 mt-1 leading-relaxed">
              {currentPillarData.description}
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {currentPillarData.subareas.map((sub, i) => (
              <div key={i} className="p-5 rounded-2xl bg-white border border-slate-200/90 shadow-sm">
                <div className="flex items-center justify-between mb-2">
                  <span className="font-serif font-bold text-sm sm:text-base text-slate-900">
                    {sub.name}
                  </span>
                  <span className="text-xs font-extrabold px-2.5 py-0.5 rounded-full bg-amber-100 text-amber-900">
                    {sub.items} ítems
                  </span>
                </div>
                <p className="text-xs text-slate-600 leading-relaxed">
                  {sub.desc}
                </p>
              </div>
            ))}
          </div>
        </div>

      </div>

      {/* 5-Step Roadmap */}
      <div className="mb-16">
        <div className="text-center max-w-2xl mx-auto mb-10">
          <span className="text-xs uppercase font-bold text-amber-800 tracking-wider">Ruta de Certificación</span>
          <h2 className="font-serif text-3xl font-bold text-slate-900 mt-1">
            ¿Cómo Obtener la Placa y Certificación AAA?
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 mt-2">
            Un proceso transparente, riguroso y acompañado por consultores técnicos especializados.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          {SELLO_DATA.certificationSteps.map((s) => (
            <div key={s.step} className="p-6 rounded-2xl bg-white border border-slate-200 shadow-sm flex flex-col justify-between">
              <div>
                <div className="w-10 h-10 rounded-xl bg-amber-500 text-white font-serif font-bold text-lg flex items-center justify-center mb-4 shadow-md">
                  0{s.step}
                </div>
                <h4 className="font-serif font-bold text-sm text-slate-900 mb-2">
                  {s.title}
                </h4>
                <p className="text-xs text-slate-600 leading-relaxed">
                  {s.desc}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Directory of Certified AAA Establishments */}
      <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-10 shadow-lg mb-16">
        <div className="flex flex-col md:flex-row items-start md:items-end justify-between mb-8 gap-4">
          <div>
            <span className="text-xs uppercase font-bold text-amber-800 tracking-wider flex items-center gap-1.5 mb-1">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              Directorio de Confianza Internacional
            </span>
            <h2 className="font-serif text-2xl sm:text-3xl font-bold text-slate-900">
              Establecimientos con Sello Mérida Gastronómica AAA
            </h2>
          </div>
          <span className="text-xs font-bold text-slate-500">
            Auditados bajo la norma técnica vigente 2026-2028
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {SELLO_DATA.certifiedEstablishments.map((est) => (
            <div key={est.id} className="p-6 rounded-2xl bg-slate-50 border border-slate-200 hover:border-amber-400 hover:bg-white shadow-sm hover:shadow-md transition-all">
              <div className="flex items-center justify-between gap-2 mb-3">
                <span className="text-[10px] font-bold uppercase px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-200">
                  {est.badge}
                </span>
                <span className="text-xs font-serif font-extrabold text-amber-700 bg-amber-100 px-2 py-0.5 rounded">
                  Score: {est.score}%
                </span>
              </div>

              <h3 className="font-serif font-bold text-lg text-slate-900">
                {est.name}
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">{est.zone}</p>

              <div className="mt-4 pt-3 border-t border-slate-200 space-y-1.5 text-xs text-slate-700">
                <p className="flex items-center justify-between">
                  <span className="text-slate-500">N° Certificado:</span>
                  <span className="font-mono font-bold text-slate-800">{est.certNumber}</span>
                </p>
                <p className="flex items-center justify-between">
                  <span className="text-slate-500">Categoría:</span>
                  <span className="font-bold text-amber-800">{est.tier}</span>
                </p>
                <p className="flex items-center justify-between">
                  <span className="text-slate-500">Chef / Responsable:</span>
                  <span className="font-medium text-slate-800">{est.chef}</span>
                </p>
                <p className="flex items-center justify-between">
                  <span className="text-slate-500">Vigencia:</span>
                  <span className="font-medium text-emerald-700">{est.validUntil}</span>
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Interactive Pre-Audit Checklist Simulator */}
      <div id="simulador-sello" className="bg-slate-950 rounded-3xl p-8 sm:p-12 text-white shadow-2xl mb-16 border border-slate-800">
        <div className="max-w-3xl mb-8">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/40 text-xs font-bold mb-3">
            <Sliders className="w-3.5 h-3.5 text-amber-400" />
            <span>Herramienta Interactiva de Diagnóstico</span>
          </div>
          <h2 className="font-serif text-2xl sm:text-4xl font-bold text-white">
            Simulador de Pre-Auditoría (Muestra de 10 Ítems Clave)
          </h2>
          <p className="text-xs sm:text-sm text-slate-300 mt-2">
            Marque los requerimientos que su restaurante cumple actualmente para estimar su nivel de preparación antes de la auditoría oficial de 226 ítems.
          </p>
        </div>

        {/* Score Card Display */}
        <div className="p-6 rounded-2xl bg-white/10 border border-white/15 backdrop-blur-md mb-8 flex flex-col sm:flex-row items-center justify-between gap-6">
          <div>
            <span className="text-xs uppercase font-bold text-amber-400">Puntaje Estimado de Preparación:</span>
            <div className="flex items-baseline gap-2 mt-1">
              <span className="text-4xl sm:text-5xl font-serif font-extrabold text-white">{simulatedScore}%</span>
              <span className="text-xs text-slate-300">({checkedCount} de 10 ítems aprobados)</span>
            </div>
          </div>

          <div className="text-right sm:border-l sm:border-white/20 sm:pl-6">
            <span className="text-xs uppercase font-bold text-slate-400 block">Diagnóstico Preliminar:</span>
            <span className={`font-serif font-bold text-base sm:text-lg ${
              simulatedScore >= 90 ? 'text-emerald-400' : simulatedScore >= 60 ? 'text-amber-400' : 'text-rose-400'
            }`}>
              {simulatedScore >= 90 ? '✅ Listo para Certificación AAA' : simulatedScore >= 60 ? '⚠️ Requiere Ajustes Menores' : '❌ Requiere Plan de Acompañamiento'}
            </span>
          </div>
        </div>

        {/* Interactive Checklist Items */}
        <div className="space-y-3">
          {sampleChecklist.map((item) => {
            const isChecked = !!simAnswers[item.id];
            return (
              <div
                key={item.id}
                onClick={() => toggleSimAnswer(item.id)}
                className={`p-4 rounded-xl border transition-all cursor-pointer flex items-center gap-3.5 ${
                  isChecked
                    ? 'bg-amber-500/20 border-amber-500/60 text-white'
                    : 'bg-white/5 border-white/10 hover:border-white/25 text-slate-300'
                }`}
              >
                <div className={`w-6 h-6 rounded-lg flex items-center justify-center shrink-0 ${
                  isChecked ? 'bg-amber-500 text-white shadow' : 'border border-white/30 text-transparent'
                }`}>
                  <CheckCircle2 className="w-4 h-4" />
                </div>
                <div className="flex-1 text-xs sm:text-sm font-medium">
                  <span className="text-[10px] uppercase font-extrabold px-2 py-0.5 rounded bg-white/10 mr-2 text-amber-300">
                    {item.pillar}
                  </span>
                  <span>{item.label}</span>
                </div>
              </div>
            );
          })}
        </div>

        <div className="mt-8 pt-6 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4">
          <button
            onClick={() => setSimAnswers({})}
            className="text-xs font-bold text-slate-400 hover:text-white"
          >
            Reiniciar Simulador
          </button>
          <button
            onClick={() => setRequestModalOpen(true)}
            className="py-3 px-6 rounded-xl bg-amber-500 hover:bg-amber-600 text-white font-bold text-xs uppercase tracking-wider shadow-lg transition-all"
          >
            Solicitar Auditoría Oficial
          </button>
        </div>

      </div>

      {/* Modal: Request Audit */}
      {requestModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto animate-fadeIn">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl relative my-8">
            <button
              onClick={() => setRequestModalOpen(false)}
              className="absolute top-5 right-5 p-2 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-600 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            {requestSuccess ? (
              <div className="text-center py-8 space-y-3">
                <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 mx-auto flex items-center justify-center">
                  <Award className="w-10 h-10" />
                </div>
                <h3 className="font-serif text-2xl font-bold text-slate-900">¡Solicitud de Auditoría Recibida!</h3>
                <p className="text-xs text-slate-600 max-w-sm mx-auto">
                  El Comité Técnico del Sello Mérida Gastronómica se comunicará en las próximas 48 horas hábiles para coordinar la fecha de la visita diagnóstica.
                </p>
              </div>
            ) : (
              <form onSubmit={handleRequestSubmit} className="space-y-4">
                <div>
                  <span className="text-xs uppercase font-bold text-amber-800">Comité de Certificación</span>
                  <h3 className="font-serif text-xl font-bold text-slate-900">Solicitar Auditoría del Sello</h3>
                  <p className="text-xs text-slate-500">Evaluación oficial de 226 ítems (Calidad, Servicio, Limpieza)</p>
                </div>

                <div className="space-y-3 pt-2">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Nombre del Establecimiento *</label>
                    <input
                      type="text"
                      required
                      placeholder="Ej. Restaurante Valle Nevado"
                      className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-xs font-medium focus:outline-none focus:border-amber-500"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">RIF de la Empresa *</label>
                      <input
                        type="text"
                        required
                        placeholder="J-12345678-9"
                        className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-xs font-medium focus:outline-none focus:border-amber-500"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">Estatus en Cámara</label>
                      <select className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-xs font-medium focus:outline-none focus:border-amber-500 text-slate-700">
                        <option>Afiliado Activo</option>
                        <option>En Proceso de Afiliación</option>
                        <option>No Afiliado (Solicitud Externa)</option>
                      </select>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">Nombre del Propietario / Chef *</label>
                      <input
                        type="text"
                        required
                        placeholder="Ej. Roberto Méndez"
                        className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-xs font-medium focus:outline-none focus:border-amber-500"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">Teléfono Directo *</label>
                      <input
                        type="tel"
                        required
                        placeholder="+58 424 7654321"
                        className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-xs font-medium focus:outline-none focus:border-amber-500"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Dirección Física del Local</label>
                    <input
                      type="text"
                      placeholder="Ej. Av. 3 con Calle 24, Casco Histórico, Mérida"
                      className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-xs font-medium focus:outline-none focus:border-amber-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Capacidad / Aforo de Comensales</label>
                    <input
                      type="text"
                      placeholder="Ej. 60 puestos en sala / 20 en terraza"
                      className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-xs font-medium focus:outline-none focus:border-amber-500"
                    />
                  </div>
                </div>

                <div className="pt-4 border-t border-slate-100 flex items-center justify-end gap-3">
                  <button
                    type="button"
                    onClick={() => setRequestModalOpen(false)}
                    className="py-2.5 px-4 rounded-xl border border-slate-300 text-slate-700 font-bold text-xs"
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    className="py-2.5 px-6 rounded-xl bg-amber-500 hover:bg-amber-600 text-white font-bold text-xs uppercase tracking-wider flex items-center gap-2 shadow-md"
                  >
                    <Send className="w-4 h-4" />
                    <span>Confirmar Solicitud</span>
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
