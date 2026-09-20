import React, { useState } from 'react';
import { 
  FileText, 
  Download, 
  Search, 
  ShieldCheck, 
  Calculator, 
  Compass, 
  Users, 
  CheckCircle2, 
  AlertCircle, 
  ExternalLink, 
  X, 
  Phone, 
  Mail, 
  Info,
  Layers,
  ChevronRight
} from 'lucide-react';
import { LEGAL_DATA } from '../data/legalData';

export function LegalResourceCenter({ t, setActiveTab }) {
  const [selectedCat, setSelectedCat] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDoc, setSelectedDoc] = useState(null);
  const [checklistAnswers, setChecklistAnswers] = useState({});
  const [downloadSuccessDoc, setDownloadSuccessDoc] = useState(null);

  const categoryIcons = {
    'fiscal': Calculator,
    'sanitario': ShieldCheck,
    'turismo': Compass,
    'laboral': Users
  };

  // Filter docs
  const allDocs = LEGAL_DATA.categories.flatMap(cat => 
    cat.items.map(item => ({ ...item, categoryId: cat.id, categoryName: cat.name }))
  );

  const filteredDocs = allDocs.filter(doc => {
    const matchCat = selectedCat === 'all' || doc.categoryId === selectedCat;
    const matchSearch = 
      doc.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      doc.summary.toLowerCase().includes(searchTerm.toLowerCase()) ||
      doc.category.toLowerCase().includes(searchTerm.toLowerCase());
    return matchCat && matchSearch;
  });

  const toggleChecklistItem = (id) => {
    setChecklistAnswers(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const handleDownload = (doc) => {
    setDownloadSuccessDoc(doc.title);
    setTimeout(() => {
      setDownloadSuccessDoc(null);
    }, 3000);
  };

  const checkedCount = Object.values(checklistAnswers).filter(Boolean).length;
  const complianceScore = Math.round((checkedCount / LEGAL_DATA.checklist.length) * 100);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      
      {/* Header Banner */}
      <div className="relative rounded-3xl bg-gradient-to-br from-slate-950 via-slate-900 to-indigo-950 p-8 sm:p-12 text-white shadow-2xl overflow-hidden mb-12 border border-indigo-900/40">
        <div className="absolute -right-16 -bottom-16 w-96 h-96 bg-indigo-600/15 rounded-full blur-3xl pointer-events-none" />
        
        <div className="relative z-10 max-w-3xl">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-indigo-500/20 border border-indigo-400/40 text-indigo-300 text-xs font-bold mb-4 backdrop-blur-md">
            <ShieldCheck className="w-4 h-4 text-indigo-400" />
            <span>SEGURIDAD JURÍDICA & DEBERES FORMALES</span>
          </div>

          <h1 className="font-serif text-3xl sm:text-5xl font-bold tracking-tight text-white leading-tight">
            Centro de Recursos & Marco Jurídico
          </h1>

          <p className="mt-4 text-slate-300 text-sm sm:text-base leading-relaxed">
            Repositorio oficial actualizado en <strong>normativas tributarias (SENIAT / SAMAT), deberes formales, ordenanzas fiscales municipales, licencias turísticas y permisos sanitarios (SACS)</strong> del estado Mérida y Venezuela.
          </p>

          <div className="mt-8 flex flex-wrap items-center gap-4">
            <div className="flex items-center gap-2 text-xs font-medium text-indigo-200">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              <span>Actualizado al marco normativo vigente 2026</span>
            </div>
            <div className="flex items-center gap-2 text-xs font-medium text-indigo-200">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              <span>Modelos de actas y guías oficiales descargables</span>
            </div>
          </div>
        </div>
      </div>

      {/* Categories Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
        {LEGAL_DATA.categories.map((cat) => {
          const Icon = categoryIcons[cat.id] || FileText;
          const isSelected = selectedCat === cat.id;
          return (
            <button
              key={cat.id}
              onClick={() => setSelectedCat(isSelected ? 'all' : cat.id)}
              className={`p-5 rounded-2xl border text-left transition-all duration-300 flex flex-col justify-between ${
                isSelected
                  ? 'bg-white border-indigo-500 shadow-xl scale-[1.02] ring-2 ring-indigo-500/20'
                  : 'bg-white border-slate-200 hover:border-indigo-300 text-slate-700 shadow-sm'
              }`}
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <div className={`p-3 rounded-xl ${isSelected ? 'bg-indigo-600 text-white shadow-md' : 'bg-slate-100 text-indigo-700'}`}>
                    <Icon className="w-5 h-5" />
                  </div>
                  <span className="text-[10px] font-bold uppercase px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-600">
                    {cat.docsCount} Documentos
                  </span>
                </div>

                <h3 className="font-serif font-bold text-sm sm:text-base text-slate-900 leading-snug">
                  {cat.name}
                </h3>
              </div>

              <div className="mt-4 pt-2 border-t border-slate-100 text-xs font-bold text-indigo-700 flex items-center gap-1">
                <span>{isSelected ? 'Filtrando este Módulo' : 'Ver Normativas'}</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </div>
            </button>
          );
        })}
      </div>

      {/* Search & Filter Bar */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm mb-8">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
          <div className="md:col-span-8 relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Buscar por ley, providencia SENIAT, ordenanza de licores, SACS, IGTF..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 text-xs sm:text-sm font-medium focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20"
            />
          </div>

          <div className="md:col-span-4 flex items-center justify-end">
            <span className="text-xs text-slate-500 font-bold">
              {filteredDocs.length} documentos jurídicos disponibles
            </span>
          </div>
        </div>

        {downloadSuccessDoc && (
          <div className="mt-4 p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold flex items-center gap-2 animate-fadeIn">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            <span>Descargando documento oficial: {downloadSuccessDoc}</span>
          </div>
        )}
      </div>

      {/* Document Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-16">
        {filteredDocs.map((doc) => (
          <div 
            key={doc.id || doc.title}
            className="p-6 rounded-2xl bg-white border border-slate-200 hover:border-indigo-400 hover:shadow-xl transition-all duration-300 flex flex-col justify-between group"
          >
            <div>
              <div className="flex items-start justify-between gap-2 mb-2">
                <span className="text-[10px] uppercase font-bold px-2.5 py-0.5 rounded-md bg-indigo-50 text-indigo-900 border border-indigo-100">
                  {doc.category}
                </span>
                <span className="text-[11px] font-bold text-slate-400">
                  {doc.format} • {doc.size}
                </span>
              </div>

              <h3 className="font-serif font-bold text-base text-slate-900 group-hover:text-indigo-900 transition-colors line-clamp-2">
                {doc.title}
              </h3>

              <p className="text-xs text-slate-600 mt-2.5 line-clamp-3 leading-relaxed">
                {doc.summary}
              </p>

              <div className="mt-3 text-[11px] text-slate-400 font-medium">
                Vigencia / Actualización: <strong className="text-slate-700">{doc.dateUpdated}</strong>
              </div>
            </div>

            <div className="pt-4 mt-4 border-t border-slate-100 flex items-center justify-between gap-2">
              <button
                onClick={() => setSelectedDoc(doc)}
                className="text-xs font-bold text-slate-700 hover:text-indigo-700 transition-colors"
              >
                Ver Ficha Técnica
              </button>

              <button
                onClick={() => handleDownload(doc)}
                className="py-2 px-3.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs uppercase tracking-wider flex items-center gap-1.5 shadow-sm transition-all"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Descargar</span>
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Interactive Compliance Inspector (Checklist) */}
      <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-10 shadow-lg mb-16">
        <div className="max-w-3xl mb-8">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-emerald-100 text-emerald-900 border border-emerald-300 text-xs font-bold mb-3">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
            <span>Herramienta de Diagnóstico Gremial</span>
          </div>
          <h2 className="font-serif text-2xl sm:text-4xl font-bold text-slate-900">
            Checklist Oficial de Deberes Formales & Sanidad
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 mt-2">
            Verifique el estado de cumplimiento de su establecimiento antes de visitas de inspección del SENIAT, SAMAT, Contraloría Sanitaria (SACS) o Ministerio del Trabajo.
          </p>
        </div>

        {/* Score Card */}
        <div className="p-6 rounded-2xl bg-slate-900 text-white mb-8 flex flex-col sm:flex-row items-center justify-between gap-6">
          <div>
            <span className="text-xs uppercase font-bold text-amber-400">Nivel de Cumplimiento Legal:</span>
            <div className="flex items-baseline gap-2 mt-1">
              <span className="text-4xl font-serif font-extrabold text-white">{complianceScore}%</span>
              <span className="text-xs text-slate-300">({checkedCount} de {LEGAL_DATA.checklist.length} deberes al día)</span>
            </div>
          </div>

          <div className="text-right sm:border-l sm:border-slate-800 sm:pl-6">
            <span className="text-xs uppercase font-bold text-slate-400 block">Estatus de Blindaje Fiscal:</span>
            <span className={`font-serif font-bold text-base sm:text-lg ${
              complianceScore >= 90 ? 'text-emerald-400' : complianceScore >= 60 ? 'text-amber-400' : 'text-rose-400'
            }`}>
              {complianceScore >= 90 ? '🛡️ Establecimiento Blindado' : complianceScore >= 60 ? '⚠️ Riesgo Moderado de Multa' : '🚨 Riesgo Alto de Sanción / Clausura'}
            </span>
          </div>
        </div>

        {/* Checklist */}
        <div className="space-y-3">
          {LEGAL_DATA.checklist.map((item) => {
            const isChecked = !!checklistAnswers[item.id];
            return (
              <div
                key={item.id}
                onClick={() => toggleChecklistItem(item.id)}
                className={`p-4 rounded-xl border transition-all cursor-pointer flex items-center gap-3.5 ${
                  isChecked
                    ? 'bg-emerald-50 border-emerald-300 text-slate-900'
                    : 'bg-slate-50 border-slate-200 hover:border-slate-300 text-slate-700'
                }`}
              >
                <div className={`w-6 h-6 rounded-lg flex items-center justify-center shrink-0 ${
                  isChecked ? 'bg-emerald-600 text-white shadow' : 'border border-slate-300 bg-white text-transparent'
                }`}>
                  <CheckCircle2 className="w-4 h-4" />
                </div>
                <div className="flex-1 text-xs sm:text-sm font-medium">
                  <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded bg-slate-200 text-slate-800 mr-2">
                    {item.category}
                  </span>
                  <span>{item.label}</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Legal Team Advisory Callout */}
      <div className="rounded-3xl bg-gradient-to-r from-slate-900 to-indigo-950 p-8 sm:p-10 text-white shadow-xl flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="space-y-2">
          <span className="text-xs uppercase font-extrabold px-3 py-1 rounded-full bg-indigo-500/30 text-indigo-300 border border-indigo-500/40">
            Consultoría Gremial Especializada
          </span>
          <h3 className="font-serif text-2xl sm:text-3xl font-bold text-white">
            ¿Dudas con una fiscalización o trámite de licencia?
          </h3>
          <p className="text-xs sm:text-sm text-slate-300 max-w-2xl">
            La Consultoría Jurídica de la Cámara Gastronómica asiste a los miembros agremiados en descargos tributarios, cálculo de alícuotas municipales y trámites ante el SACS.
          </p>
        </div>
        <button
          onClick={() => { setActiveTab('affiliates'); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
          className="py-3.5 px-6 rounded-2xl bg-amber-500 hover:bg-amber-600 text-white font-bold text-xs uppercase tracking-wider shadow-lg shrink-0 transition-all"
        >
          Contactar Asesor Jurídico
        </button>
      </div>

      {/* Modal: Document Detail */}
      {selectedDoc && (
        <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto animate-fadeIn">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl relative my-8">
            <button
              onClick={() => setSelectedDoc(null)}
              className="absolute top-5 right-5 p-2 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-600 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            <span className="text-xs uppercase font-bold text-indigo-700">{selectedDoc.category}</span>
            <h3 className="font-serif text-xl font-bold text-slate-900 mt-1">{selectedDoc.title}</h3>
            
            <div className="my-4 p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2 text-xs text-slate-700">
              <p><strong>Formato:</strong> {selectedDoc.format} ({selectedDoc.size})</p>
              <p><strong>Fecha de Emisión / Actualización:</strong> {selectedDoc.dateUpdated}</p>
              <p><strong>Carácter:</strong> {selectedDoc.isOfficial ? 'Normativa Legal Oficial de Obligatorio Cumplimiento' : 'Guía Técnica Orientativa de la Cámara'}</p>
            </div>

            <div className="text-xs sm:text-sm text-slate-600 leading-relaxed space-y-2">
              <h4 className="font-bold text-slate-900 uppercase text-xs">Resumen del Contenido:</h4>
              <p>{selectedDoc.summary}</p>
            </div>

            <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-end gap-3">
              <button
                onClick={() => setSelectedDoc(null)}
                className="py-2.5 px-4 rounded-xl border border-slate-300 text-slate-700 font-bold text-xs"
              >
                Cerrar
              </button>
              <button
                onClick={() => {
                  handleDownload(selectedDoc);
                  setSelectedDoc(null);
                }}
                className="py-2.5 px-6 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs uppercase tracking-wider flex items-center gap-2 shadow-md"
              >
                <Download className="w-4 h-4" />
                <span>Descargar Documento</span>
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
