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
  DollarSign,
  Lock,
  ArrowRight,
  ArrowLeft,
  Smartphone,
  Check,
  AlertCircle,
  LogOut,
  Copy,
  ExternalLink,
  MapPin,
  Utensils
} from 'lucide-react';
import { AFFILIATES_DATA } from '../data/affiliatesData';

export function AffiliateDashboard({ t }) {
  // Navigation & Authentication states: 'login' | 'register' | 'welcome_preview' | 'dashboard'
  const [viewMode, setViewMode] = useState('login');
  
  // Login Form State
  const [loginIdentifier, setLoginIdentifier] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [loginError, setLoginError] = useState('');
  const [isLoggingIn, setIsLoggingIn] = useState(false);

  // Registration Wizard Step: 1 (Datos) | 2 (Identidad & Carta) | 3 (Pago Móvil) | 4 (Confirmado)
  const [regStep, setRegStep] = useState(1);
  const [regData, setRegData] = useState({
    restaurantName: '',
    rif: 'J-',
    ownerName: '',
    phone: '',
    email: '',
    address: '',
    eje: 'metropolitano',
    category: 'Alta Cocina Andina',
    specialty: '',
    instagram: '@',
    password: '',
    // Pago Móvil Data
    issuingBank: 'Banesco',
    payerPhone: '',
    referenceNumber: '',
    amountPaidBs: '3.650,00',
    receiptFile: null,
    generatedAffiliateCode: ''
  });

  const [copiedBankData, setCopiedBankData] = useState(false);

  // Authenticated User State (defaults to Kaffia or registered user)
  const [activeUser, setActiveUser] = useState(AFFILIATES_DATA.currentUser);

  // Dashboard inner tabs: overview | certificate | jobs | payments | courses | board
  const [activeTab, setActiveTab] = useState('overview');
  const [paymentStep, setPaymentStep] = useState('select');
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState('pago-movil');
  const [contactMessage, setContactMessage] = useState('');
  const [contactSubject, setContactSubject] = useState('Consulta Gremial');
  const [messageSent, setMessageSent] = useState(false);

  // Job creation state
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

  const { boardMembers, internalCourses, guildBenefits } = AFFILIATES_DATA;

  // Handles Affiliate Login
  const handleLoginSubmit = (e) => {
    e.preventDefault();
    setLoginError('');
    setIsLoggingIn(true);

    setTimeout(() => {
      setIsLoggingIn(false);
      const cleanId = loginIdentifier.trim().toLowerCase();
      // Allow demo affiliate Kaffia or any matching password/demo credential
      if (
        cleanId === 'kaffia@meridagastronomica.com' ||
        cleanId === 'cgm-2026-001' ||
        cleanId === 'kaffia' ||
        loginPassword.length >= 4
      ) {
        setActiveUser({
          id: "CGM-2026-001",
          restaurantName: "Kaffia Caffe",
          ownerName: "Gerencia & Equipo Kaffia",
          memberCategory: "Restaurante Élite / Miembro Oficial 2026",
          registrationDate: "01 de Enero de 2026",
          expiryDate: "31 de Diciembre de 2026",
          status: "Activo (Solvente)",
          monthlyDues: "$35.00",
          lastPaymentDate: "01 de Septiembre de 2026",
          certificateCode: "CGM-CERT-2026-001-KAF",
          stats: {
            profileViewsMonth: 4850,
            reservationsMonth: 184,
            chamberRating: "5.0 / 5.0 (Auditoría de Calidad Aprobada)"
          }
        });
        setViewMode('dashboard');
      } else {
        setLoginError('Credenciales no encontradas. Verifique su correo o código de afiliado.');
      }
    }, 800);
  };

  // Handles Registration Step Forwarding
  const handleRegNext = (e) => {
    e.preventDefault();
    if (regStep === 1) {
      if (!regData.restaurantName || !regData.ownerName || !regData.phone || !regData.email) {
        alert('Por favor complete todos los campos obligatorios del Paso 1.');
        return;
      }
      setRegStep(2);
    } else if (regStep === 2) {
      setRegStep(3);
    } else if (regStep === 3) {
      if (!regData.referenceNumber || regData.referenceNumber.length < 4) {
        alert('Por favor ingrese el número de referencia del Pago Móvil (mínimo 4 a 6 dígitos).');
        return;
      }
      const newCode = `CGM-2026-${String(Math.floor(Math.random() * 899) + 101)}`;
      setRegData(prev => ({ ...prev, generatedAffiliateCode: newCode }));
      
      // Configure newly registered active user
      setActiveUser({
        id: newCode,
        restaurantName: regData.restaurantName,
        ownerName: regData.ownerName,
        memberCategory: "Miembro Aspirante Registrado (Pago en Verificación)",
        registrationDate: "Septiembre 2026",
        expiryDate: "Diciembre 2026",
        status: "Activo (En Proceso de Auditoría)",
        monthlyDues: "$35.00",
        lastPaymentDate: "Hoy",
        certificateCode: `${newCode}-PROV`,
        stats: {
          profileViewsMonth: 120,
          reservationsMonth: 0,
          chamberRating: "Pendiente Auditoría Sello AAA"
        }
      });

      setRegStep(4);
    }
  };

  const copyChamberBankDetails = () => {
    const text = `CÁMARA GASTRONÓMICA DEL ESTADO MÉRIDA\nPago Móvil Banesco (0134)\nTeléfono: 0412-6666954\nRIF: J-50493821-0\nConcepto: Afiliación Gremial`;
    if (navigator.clipboard) {
      navigator.clipboard.writeText(text);
      setCopiedBankData(true);
      setTimeout(() => setCopiedBankData(false), 2500);
    }
  };

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

  // ==========================================
  // VIEW 1: LOGIN SCREEN (Acceso con Clave)
  // ==========================================
  if (viewMode === 'login') {
    return (
      <section className="py-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-md mx-auto bg-white rounded-3xl border border-slate-200 shadow-2xl overflow-hidden p-6 sm:p-10 relative">
          
          {/* Header Logo */}
          <div className="text-center mb-8">
            <div className="w-16 h-16 rounded-2xl bg-white border border-amber-300 shadow-md p-1.5 mx-auto mb-4 flex items-center justify-center">
              <img 
                src="/logo-merida-gastronomica.png" 
                alt="Mérida Gastronómica" 
                className="w-full h-full object-contain"
              />
            </div>
            <span className="text-[11px] font-extrabold uppercase tracking-widest text-amber-800 bg-amber-50 px-3 py-1 rounded-full border border-amber-200">
              Cámara Gastronómica de Mérida
            </span>
            <h2 className="font-serif text-2xl sm:text-3xl font-bold text-slate-900 mt-3">
              Portal de Afiliados
            </h2>
            <p className="text-xs text-slate-500 mt-1.5">
              Ingrese con sus credenciales oficiales para gestionar su restaurante, solvencias y certificados.
            </p>
          </div>

          {loginError && (
            <div className="mb-6 p-3 rounded-2xl bg-red-50 border border-red-200 text-red-700 text-xs font-semibold flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{loginError}</span>
            </div>
          )}

          {/* Login Form */}
          <form onSubmit={handleLoginSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Correo Electrónico o Código CGM
              </label>
              <div className="relative">
                <input
                  type="text"
                  required
                  placeholder="ej. contacto@kaffiacaffe.com o CGM-2026-001"
                  value={loginIdentifier}
                  onChange={(e) => setLoginIdentifier(e.target.value)}
                  className="w-full pl-3.5 pr-4 py-3 rounded-xl border border-slate-200 text-xs font-medium focus:outline-none focus:border-amber-500 focus:bg-white bg-slate-50 text-slate-800"
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="text-xs font-bold text-slate-700">
                  Clave de Seguridad
                </label>
                <button
                  type="button"
                  onClick={() => alert('Para restablecer su clave, comuníquese con la Secretaría de la Cámara al 0274-2521448 o presidencia@meridagastronomica.com')}
                  className="text-[11px] text-amber-700 hover:underline font-semibold"
                >
                  ¿Olvidó su clave?
                </button>
              </div>
              <div className="relative">
                <input
                  type="password"
                  required
                  placeholder="••••••••••••"
                  value={loginPassword}
                  onChange={(e) => setLoginPassword(e.target.value)}
                  className="w-full pl-3.5 pr-4 py-3 rounded-xl border border-slate-200 text-xs font-medium focus:outline-none focus:border-amber-500 focus:bg-white bg-slate-50 text-slate-800"
                />
              </div>
            </div>

            {/* Quick Helper for Demo */}
            <div className="p-3 rounded-xl bg-amber-50/70 border border-amber-200/80 text-[11px] text-slate-600 flex items-center justify-between">
              <div>
                <span className="font-bold text-slate-800">Afiliado de Demostración:</span>
                <span className="block text-amber-900 font-mono">kaffia@meridagastronomica.com</span>
              </div>
              <button
                type="button"
                onClick={() => {
                  setLoginIdentifier('kaffia@meridagastronomica.com');
                  setLoginPassword('kaffia2026');
                }}
                className="px-2 py-1 rounded bg-amber-200 text-amber-900 text-[10px] font-bold hover:bg-amber-300"
              >
                Autocompletar
              </button>
            </div>

            <button
              type="submit"
              disabled={isLoggingIn}
              className="w-full py-3 rounded-xl bg-amber-500 hover:bg-amber-600 text-white font-serif font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-md transition-all active:scale-[0.99]"
            >
              <Lock className="w-4 h-4" />
              <span>{isLoggingIn ? 'Verificando...' : 'Ingresar al Portal Gremial'}</span>
            </button>
          </form>

          {/* Registration Trigger */}
          <div className="mt-8 pt-6 border-t border-slate-100 text-center">
            <p className="text-xs text-slate-600 mb-3 font-medium">
              ¿Desea agremiar su restaurante o establecimiento?
            </p>
            <button
              onClick={() => {
                setRegStep(1);
                setViewMode('register');
              }}
              className="w-full py-2.5 px-4 rounded-xl border-2 border-slate-900 text-slate-900 hover:bg-slate-900 hover:text-white font-bold text-xs transition-all flex items-center justify-center gap-2 shadow-sm"
            >
              <Building2 className="w-4 h-4" />
              <span>Solicitar Afiliación / Registrar Nuevo Restaurante</span>
            </button>
          </div>

        </div>
      </section>
    );
  }

  // ==========================================
  // VIEW 2: REGISTRATION WIZARD WITH PAGO MOVIL
  // ==========================================
  if (viewMode === 'register') {
    return (
      <section className="py-12 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Wizard Header */}
        <div className="bg-white rounded-3xl border border-slate-200 shadow-xl p-6 sm:p-8 mb-8">
          <div className="flex items-center justify-between gap-4 pb-6 border-b border-slate-100">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-100 text-amber-900 text-[11px] font-bold mb-2">
                <ShieldCheck className="w-3.5 h-3.5 text-amber-600" />
                <span>Afiliación Oficial 2026</span>
              </div>
              <h2 className="font-serif text-2xl sm:text-3xl font-bold text-slate-900">
                Registro & Bienvenida de Nuevo Agremiado
              </h2>
              <p className="text-xs text-slate-500 mt-1">
                Forme parte del gremio gastronómico más prestigioso del estado Mérida.
              </p>
            </div>

            <button
              onClick={() => setViewMode('login')}
              className="p-2.5 rounded-xl border border-slate-200 hover:bg-slate-100 text-slate-600 text-xs font-semibold flex items-center gap-1.5 transition-colors shrink-0"
            >
              <ArrowLeft className="w-4 h-4" />
              <span className="hidden sm:inline">Volver al Login</span>
            </button>
          </div>

          {/* Stepper Progress */}
          <div className="grid grid-cols-3 gap-2 sm:gap-4 pt-6">
            <div className={`p-3 rounded-2xl border text-center transition-all ${
              regStep === 1 
                ? 'bg-amber-500 text-white border-amber-600 shadow-md ring-2 ring-amber-400/30' 
                : regStep > 1 ? 'bg-emerald-50 text-emerald-800 border-emerald-300' : 'bg-slate-50 text-slate-400 border-slate-200'
            }`}>
              <span className="text-[10px] font-extrabold uppercase block tracking-wider">Paso 1</span>
              <span className="text-xs font-bold truncate block">Datos del Local</span>
            </div>

            <div className={`p-3 rounded-2xl border text-center transition-all ${
              regStep === 2 
                ? 'bg-amber-500 text-white border-amber-600 shadow-md ring-2 ring-amber-400/30' 
                : regStep > 2 ? 'bg-emerald-50 text-emerald-800 border-emerald-300' : 'bg-slate-50 text-slate-400 border-slate-200'
            }`}>
              <span className="text-[10px] font-extrabold uppercase block tracking-wider">Paso 2</span>
              <span className="text-xs font-bold truncate block">Perfil & Carta</span>
            </div>

            <div className={`p-3 rounded-2xl border text-center transition-all ${
              regStep === 3 || regStep === 4
                ? 'bg-amber-500 text-white border-amber-600 shadow-md ring-2 ring-amber-400/30' 
                : 'bg-slate-50 text-slate-400 border-slate-200'
            }`}>
              <span className="text-[10px] font-extrabold uppercase block tracking-wider">Paso 3</span>
              <span className="text-xs font-bold truncate block">Pago Móvil & Activación</span>
            </div>
          </div>
        </div>

        {/* STEP 1: Datos del Establecimiento */}
        {regStep === 1 && (
          <div className="bg-white rounded-3xl border border-slate-200 shadow-xl p-6 sm:p-8 animate-fadeIn">
            <h3 className="font-serif text-xl font-bold text-slate-900 mb-2">
              Paso 1: Información Legal & de Contacto
            </h3>
            <p className="text-xs text-slate-500 mb-6">
              Ingrese los datos principales de su establecimiento comercial para el expediente gremial.
            </p>

            <form onSubmit={handleRegNext} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Nombre Comercial del Restaurante *</label>
                  <input
                    type="text"
                    required
                    placeholder="Ej. Kaffia Caffe / Fogón Andino"
                    value={regData.restaurantName}
                    onChange={(e) => setRegData({ ...regData, restaurantName: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-medium focus:outline-none focus:border-amber-500 bg-slate-50"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">RIF Jurídico o Personal *</label>
                  <input
                    type="text"
                    required
                    placeholder="J-12345678-0"
                    value={regData.rif}
                    onChange={(e) => setRegData({ ...regData, rif: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-medium focus:outline-none focus:border-amber-500 bg-slate-50"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Propietario / Chef Ejecutivo Representante *</label>
                  <input
                    type="text"
                    required
                    placeholder="Ej. Lic. Carlos Méndez"
                    value={regData.ownerName}
                    onChange={(e) => setRegData({ ...regData, ownerName: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-medium focus:outline-none focus:border-amber-500 bg-slate-50"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Teléfono / WhatsApp Directo *</label>
                  <input
                    type="text"
                    required
                    placeholder="+58 412 1234567"
                    value={regData.phone}
                    onChange={(e) => setRegData({ ...regData, phone: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-medium focus:outline-none focus:border-amber-500 bg-slate-50"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Correo Electrónico Oficial *</label>
                  <input
                    type="email"
                    required
                    placeholder="gerencia@mirestaurante.com"
                    value={regData.email}
                    onChange={(e) => setRegData({ ...regData, email: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-medium focus:outline-none focus:border-amber-500 bg-slate-50"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Eje Territorial en Mérida *</label>
                  <select
                    value={regData.eje}
                    onChange={(e) => setRegData({ ...regData, eje: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-medium focus:outline-none focus:border-amber-500 bg-slate-50 text-slate-800"
                  >
                    <option value="metropolitano">Eje Metropolitano (Mérida Ciudad / Casco Central)</option>
                    <option value="paramo">Eje Páramo (Apartaderos, Mucuchíes, Tabay)</option>
                    <option value="mocoties">Eje Valle del Mocotíes (Tovar, Bailadores)</option>
                    <option value="pueblos-sur">Eje Pueblos del Sur</option>
                    <option value="panamericano">Eje Panamericano & Sur del Lago</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Dirección Exacta en Mérida *</label>
                <input
                  type="text"
                  required
                  placeholder="Ej. Av. 8 entre Calles 24 y 25, Sector Las Heroínas, Casco Central"
                  value={regData.address}
                  onChange={(e) => setRegData({ ...regData, address: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-medium focus:outline-none focus:border-amber-500 bg-slate-50"
                />
              </div>

              <div className="pt-4 flex justify-end">
                <button
                  type="submit"
                  className="py-3 px-6 rounded-xl bg-amber-500 hover:bg-amber-600 text-white font-serif font-bold text-xs uppercase tracking-wider flex items-center gap-2 shadow-md transition-all"
                >
                  <span>Continuar al Paso 2: Perfil & Carta</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </form>
          </div>
        )}

        {/* STEP 2: Perfil Culinario */}
        {regStep === 2 && (
          <div className="bg-white rounded-3xl border border-slate-200 shadow-xl p-6 sm:p-8 animate-fadeIn">
            <h3 className="font-serif text-xl font-bold text-slate-900 mb-2">
              Paso 2: Identidad Visual & Propuesta Gastronómica
            </h3>
            <p className="text-xs text-slate-500 mb-6">
              Defina cómo aparecerá su restaurante en la Guía Oficial y en el Mapa 3D.
            </p>

            <form onSubmit={handleRegNext} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Tipo de Experiencia / Categoría *</label>
                  <select
                    value={regData.category}
                    onChange={(e) => setRegData({ ...regData, category: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-medium focus:outline-none focus:border-amber-500 bg-slate-50 text-slate-800"
                  >
                    <option>Alta Cocina Andina</option>
                    <option>Café de Especialidad & Bistro</option>
                    <option>Tradición de Montaña & Truchas</option>
                    <option>Chocolatería de Origen & Repostería</option>
                    <option>Fusión, Carnes & Vinos</option>
                    <option>Gastronomía Ancestral</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Cuenta de Instagram Oficial</label>
                  <input
                    type="text"
                    placeholder="@mirestaurante"
                    value={regData.instagram}
                    onChange={(e) => setRegData({ ...regData, instagram: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-medium focus:outline-none focus:border-amber-500 bg-slate-50"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Plato Insignia o Especialidad de la Casa *</label>
                <input
                  type="text"
                  required
                  placeholder="Ej. Trucha rellena de queso ahumado / Medallones glaseados / Café Geisha de altura"
                  value={regData.specialty}
                  onChange={(e) => setRegData({ ...regData, specialty: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-medium focus:outline-none focus:border-amber-500 bg-slate-50"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Defina su Clave de Acceso para el Portal *</label>
                <input
                  type="password"
                  required
                  placeholder="Mínimo 6 caracteres"
                  value={regData.password}
                  onChange={(e) => setRegData({ ...regData, password: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-medium focus:outline-none focus:border-amber-500 bg-slate-50"
                />
              </div>

              <div className="pt-4 flex items-center justify-between">
                <button
                  type="button"
                  onClick={() => setRegStep(1)}
                  className="py-2.5 px-4 rounded-xl border border-slate-200 text-slate-700 font-bold text-xs hover:bg-slate-50 flex items-center gap-1.5"
                >
                  <ArrowLeft className="w-4 h-4" />
                  <span>Atrás</span>
                </button>

                <button
                  type="submit"
                  className="py-3 px-6 rounded-xl bg-amber-500 hover:bg-amber-600 text-white font-serif font-bold text-xs uppercase tracking-wider flex items-center gap-2 shadow-md transition-all"
                >
                  <span>Continuar a Pago Móvil</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </form>
          </div>
        )}

        {/* STEP 3: Pago Móvil Oficial */}
        {regStep === 3 && (
          <div className="bg-white rounded-3xl border border-slate-200 shadow-xl p-6 sm:p-8 animate-fadeIn">
            <h3 className="font-serif text-xl font-bold text-slate-900 mb-2">
              Paso 3: Pago de Inscripción Gremial por Pago Móvil
            </h3>
            <p className="text-xs text-slate-500 mb-6">
              Realice el pago de la cuota de afiliación anual y reporte los datos bancarios para su acreditación inmediata.
            </p>

            {/* Official Chamber Bank Box */}
            <div className="p-5 sm:p-6 rounded-2xl bg-gradient-to-br from-slate-900 to-slate-800 text-white mb-6 border border-slate-700 shadow-lg relative overflow-hidden">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <Smartphone className="w-5 h-5 text-amber-400" />
                  <span className="text-xs font-bold uppercase tracking-wider text-amber-300">
                    Datos Oficiales Pago Móvil Cámara Gastronómica
                  </span>
                </div>

                <button
                  type="button"
                  onClick={copyChamberBankDetails}
                  className="px-3 py-1 rounded-lg bg-white/10 hover:bg-white/20 text-white text-[11px] font-bold flex items-center gap-1 transition-colors border border-white/20"
                >
                  {copiedBankData ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copiedBankData ? '¡Copiado!' : 'Copiar Datos'}</span>
                </button>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs">
                <div>
                  <span className="text-slate-400 block text-[10px] uppercase font-bold">Banco Receptor</span>
                  <span className="font-bold text-white text-sm">Banesco (0134)</span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[10px] uppercase font-bold">Teléfono</span>
                  <span className="font-mono font-bold text-white text-sm">0412-6666954</span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[10px] uppercase font-bold">RIF Institucional</span>
                  <span className="font-mono font-bold text-white text-sm">J-50493821-0</span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[10px] uppercase font-bold">Monto Anual</span>
                  <span className="font-bold text-amber-400 text-sm">$50 USD (Tasa BCV)</span>
                </div>
              </div>
            </div>

            {/* Form to Report Payment */}
            <form onSubmit={handleRegNext} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Banco Emisor (Su Banco) *</label>
                  <select
                    value={regData.issuingBank}
                    onChange={(e) => setRegData({ ...regData, issuingBank: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-medium focus:outline-none focus:border-amber-500 bg-slate-50 text-slate-800"
                  >
                    <option>Banesco</option>
                    <option>Banco de Venezuela (BDV)</option>
                    <option>Mercantil</option>
                    <option>BBVA Provincial</option>
                    <option>Bancaribe</option>
                    <option>Banco Nacional de Crédito (BNC)</option>
                    <option>BFC Banco Fondo Común</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Teléfono del Titular Pagador *</label>
                  <input
                    type="text"
                    required
                    placeholder="0414-1234567"
                    value={regData.payerPhone}
                    onChange={(e) => setRegData({ ...regData, payerPhone: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-medium focus:outline-none focus:border-amber-500 bg-slate-50"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Número de Referencia (Últimos 4 a 6 dígitos) *</label>
                  <input
                    type="text"
                    required
                    placeholder="Ej. 748291"
                    value={regData.referenceNumber}
                    onChange={(e) => setRegData({ ...regData, referenceNumber: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-medium focus:outline-none focus:border-amber-500 bg-slate-50 font-mono"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Monto Pagado en Bs. *</label>
                  <input
                    type="text"
                    required
                    value={regData.amountPaidBs}
                    onChange={(e) => setRegData({ ...regData, amountPaidBs: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-medium focus:outline-none focus:border-amber-500 bg-slate-50"
                  />
                </div>
              </div>

              <div className="pt-4 flex items-center justify-between">
                <button
                  type="button"
                  onClick={() => setRegStep(2)}
                  className="py-2.5 px-4 rounded-xl border border-slate-200 text-slate-700 font-bold text-xs hover:bg-slate-50 flex items-center gap-1.5"
                >
                  <ArrowLeft className="w-4 h-4" />
                  <span>Atrás</span>
                </button>

                <button
                  type="submit"
                  className="py-3.5 px-6 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-serif font-bold text-xs uppercase tracking-wider flex items-center gap-2 shadow-md transition-all"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Confirmar Pago y Completar Afiliación</span>
                </button>
              </div>
            </form>
          </div>
        )}

        {/* STEP 4: Registro Exitoso & Acciones */}
        {regStep === 4 && (
          <div className="bg-white rounded-3xl border border-emerald-300 shadow-2xl p-6 sm:p-10 text-center animate-fadeIn">
            <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 mx-auto flex items-center justify-center mb-4 shadow-sm">
              <CheckCircle2 className="w-9 h-9" />
            </div>

            <span className="text-xs font-bold uppercase tracking-widest text-emerald-800 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
              Solicitud de Afiliación Registrada
            </span>

            <h3 className="font-serif text-2xl sm:text-3xl font-bold text-slate-900 mt-3">
              ¡Bienvenido a la Cámara Gastronómica de Mérida!
            </h3>

            <p className="text-xs sm:text-sm text-slate-600 mt-2 max-w-lg mx-auto">
              El establecimiento <strong>{regData.restaurantName}</strong> ha sido registrado satisfactoriamente. Se ha generado su expediente y se ha despachado el <strong>Correo Oficial de Bienvenida</strong>.
            </p>

            {/* Generated Code Badge */}
            <div className="my-6 p-4 rounded-2xl bg-slate-50 border border-slate-200 max-w-sm mx-auto">
              <span className="text-[10px] font-bold uppercase text-slate-400 block">Su Código de Afiliado Asignado:</span>
              <span className="font-mono font-extrabold text-2xl text-amber-800 tracking-wider">
                {regData.generatedAffiliateCode || 'CGM-2026-002'}
              </span>
              <span className="text-[11px] text-slate-500 block mt-1">Estatus: Pago en Verificación Conciliatoria</span>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
              <button
                onClick={() => setViewMode('welcome_preview')}
                className="w-full sm:w-auto py-3 px-6 rounded-xl bg-amber-500 hover:bg-amber-600 text-white font-serif font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-md transition-all"
              >
                <Mail className="w-4 h-4" />
                <span>Ver Correo de Bienvenida Generado</span>
              </button>

              <button
                onClick={() => setViewMode('dashboard')}
                className="w-full sm:w-auto py-3 px-6 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-serif font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-md transition-all"
              >
                <Building2 className="w-4 h-4" />
                <span>Ingresar a Mi Panel de Afiliado</span>
              </button>
            </div>
          </div>
        )}

      </section>
    );
  }

  // ==========================================
  // VIEW 3: OFFICIAL HTML WELCOME EMAIL PREVIEW
  // ==========================================
  if (viewMode === 'welcome_preview') {
    return (
      <section className="py-12 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Email Preview Container Toolbar */}
        <div className="bg-slate-900 text-white p-4 sm:p-5 rounded-t-3xl flex items-center justify-between gap-4">
          <div className="flex items-center gap-2.5">
            <Mail className="w-5 h-5 text-amber-400" />
            <div>
              <h4 className="font-bold text-xs sm:text-sm">Vista Previa: Correo Electrónico Institucional de Bienvenida</h4>
              <p className="text-[10px] text-slate-400">Enviado a: {regData.email || 'gerencia@restaurant.com'}</p>
            </div>
          </div>

          <button
            onClick={() => setViewMode('dashboard')}
            className="py-2 px-4 rounded-xl bg-amber-500 hover:bg-amber-600 text-white text-xs font-bold transition-all shrink-0"
          >
            Ir al Dashboard
          </button>
        </div>

        {/* The Exact Pixel-Perfect Email Body */}
        <div className="bg-[#f8f9fa] border-x border-b border-slate-300 rounded-b-3xl p-4 sm:p-8 text-slate-800 font-sans shadow-2xl">
          
          <div className="max-w-2xl mx-auto bg-white rounded-2xl border border-slate-200 shadow-md overflow-hidden">
            
            {/* Email Header */}
            <div className="bg-gradient-to-r from-slate-950 via-slate-900 to-amber-950 p-6 text-center text-white border-b-4 border-amber-500">
              <div className="w-20 h-20 bg-white rounded-2xl p-1.5 mx-auto mb-3 shadow-lg border border-amber-300">
                <img 
                  src="/logo-merida-gastronomica.png" 
                  alt="Mérida Gastronómica" 
                  className="w-full h-full object-contain"
                />
              </div>
              <h1 className="font-serif text-xl sm:text-2xl font-bold tracking-tight text-white uppercase">
                Cámara Gastronómica del Estado Mérida
              </h1>
              <p className="text-xs text-amber-300 tracking-widest uppercase font-bold mt-0.5">
                República Bolivariana de Venezuela
              </p>
            </div>

            {/* Email Content Body */}
            <div className="p-6 sm:p-8 space-y-5 text-xs sm:text-sm leading-relaxed text-slate-700">
              
              <div className="border-b border-slate-100 pb-4">
                <p className="font-bold text-slate-900 text-base">
                  Estimado(a) {regData.ownerName || 'Representante Legal'},
                </p>
                <p className="text-amber-800 font-semibold mt-0.5">
                  Restaurante: {regData.restaurantName || 'Kaffia Caffe'}
                </p>
              </div>

              <p>
                En nombre de la <strong>Junta Directiva de la Cámara Gastronómica del Estado Mérida</strong>, nos complace darle la más cordial y distinguida bienvenida como nuevo miembro agremiado a nuestra institución.
              </p>

              <p>
                Su incorporación fortalece la alianza del sector privado, el talento culinario y los productores de café, cacao y hortalizas de altura que proyectan a Mérida como <strong>Capital Gastronómica de Venezuela</strong>.
              </p>

              {/* Box of Credentials */}
              <div className="p-4 rounded-xl bg-amber-50/80 border border-amber-200 text-xs space-y-2">
                <span className="text-[10px] font-extrabold uppercase text-amber-900 tracking-wider block">
                  Resumen de su Expediente Gremial
                </span>
                <div className="grid grid-cols-2 gap-2 text-slate-800">
                  <div>
                    <strong>Código de Afiliado:</strong>
                    <p className="font-mono text-amber-900 font-bold">{regData.generatedAffiliateCode || 'CGM-2026-002'}</p>
                  </div>
                  <div>
                    <strong>Estatus de Registro:</strong>
                    <p className="text-emerald-700 font-bold">Activo (Pago Móvil Ref: {regData.referenceNumber || '748291'})</p>
                  </div>
                  <div>
                    <strong>Eje Territorial:</strong>
                    <p className="capitalize">{regData.eje || 'Metropolitano'}</p>
                  </div>
                  <div>
                    <strong>Vigencia Membresía:</strong>
                    <p>Año Fiscal 2026</p>
                  </div>
                </div>
              </div>

              {/* Next steps list */}
              <div>
                <h4 className="font-serif font-bold text-slate-900 text-sm mb-2">
                  Próximos Pasos de su Membresía:
                </h4>
                <ul className="space-y-1.5 list-disc pl-5 text-slate-600 text-xs">
                  <li><strong>Auditoría Técnica del Sello AAA:</strong> Nuestro comité de calidad se pondrá en contacto para agendar la visita diagnóstica.</li>
                  <li><strong>Geolocalización en el Mapa 3D:</strong> Su local será publicado con radar de altitud en la plataforma satelital.</li>
                  <li><strong>Comunidad Oficial de Afiliados:</strong> Acceso al canal prioritario de WhatsApp con proveedores agrícolas y asesoría contable/fiscal.</li>
                </ul>
              </div>

              {/* WhatsApp Guild Join Button */}
              <div className="p-4 rounded-2xl bg-slate-900 text-white text-center space-y-2">
                <p className="text-xs text-slate-300">Únase de inmediato a la comunidad oficial de agremiados:</p>
                <a
                  href="https://chat.whatsapp.com/"
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-2 px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs transition-colors shadow-md"
                >
                  <span>Unirse al Grupo Oficial de WhatsApp CGM</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              </div>

              {/* Signature */}
              <div className="pt-6 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500">
                <div>
                  <p className="font-bold text-slate-800">Lic. Rodolfo Carrasquero</p>
                  <p>Presidente — Cámara Gastronómica del Estado Mérida</p>
                </div>
                <div className="text-right">
                  <p>Mérida, Venezuela</p>
                  <p>www.meridagastronomica.com</p>
                </div>
              </div>

            </div>

          </div>

        </div>

      </section>
    );
  }

  // ==========================================
  // VIEW 4: AUTHENTICATED AFFILIATE DASHBOARD
  // ==========================================
  return (
    <section className="py-12 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      
      {/* Header Banner */}
      <div className="p-6 sm:p-8 rounded-3xl bg-white border border-slate-200 shadow-xl mb-8">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-2xl bg-white border border-amber-300 p-1 flex items-center justify-center text-white shadow-md shrink-0">
              <img 
                src="/logo-merida-gastronomica.png" 
                alt="Logo Mérida Gastronómica" 
                className="w-full h-full object-contain"
              />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold uppercase px-2.5 py-0.5 rounded-full bg-amber-100 text-amber-900 border border-amber-300">
                  Portal Exclusivo Gremial
                </span>
                <span className="text-xs font-bold text-emerald-700 flex items-center gap-1">
                  <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                  {activeUser.status}
                </span>
              </div>
              <h2 className="font-serif text-2xl sm:text-3xl font-bold text-slate-900 mt-1">
                {activeUser.restaurantName}
              </h2>
              <p className="text-xs text-slate-600 font-medium">
                Representante: <strong>{activeUser.ownerName}</strong> — Código de Afiliado: <span className="font-mono font-bold text-amber-800">{activeUser.id}</span>
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

            <button
              onClick={() => setViewMode('login')}
              className="p-2.5 rounded-xl border border-slate-200 hover:bg-slate-100 text-slate-600 text-xs font-bold transition-colors"
              title="Cerrar Sesión"
            >
              <LogOut className="w-4 h-4" />
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
              <p className="font-serif text-2xl font-bold text-slate-900 mt-1">{activeUser.stats.profileViewsMonth}</p>
              <span className="text-xs text-emerald-700 font-bold flex items-center gap-1 mt-1">
                <TrendingUp className="w-3.5 h-3.5" /> +24% visitas este mes
              </span>
            </div>

            <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-sm">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-500">Reservas Solicitadas</span>
              <p className="font-serif text-2xl font-bold text-amber-800 mt-1">{activeUser.stats.reservationsMonth}</p>
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
                    <h4 className="font-bold text-sm text-slate-900">{benefit}</h4>
                    <p className="text-xs text-slate-600 mt-0.5">Acceso exclusivo a través del aval institucional.</p>
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

          <div className="w-20 h-20 mx-auto mb-3">
            <img src="/logo-merida-gastronomica.png" alt="Logo" className="w-full h-full object-contain" />
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
              {activeUser.restaurantName}
            </h4>
            <p className="text-xs font-medium text-slate-700 mt-2 max-w-md mx-auto">
              Cumple con los estatutos gremiales, la norma de buenas prácticas de manipulación y el aval de excelencia turística andina.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-4 text-xs text-slate-600 text-left max-w-md mx-auto mb-8">
            <div>
              <span className="block text-slate-400 font-bold uppercase text-[10px]">Número de Registro:</span>
              <span className="font-mono font-bold text-slate-800">{activeUser.id}</span>
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

      {/* Tab 3: Crear Empleos */}
      {activeTab === 'jobs' && (
        <div className="space-y-8 animate-fadeIn">
          <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-slate-900 to-amber-950 text-white shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
            <div className="space-y-1 max-w-2xl">
              <span className="text-xs font-extrabold uppercase px-3 py-1 rounded-full bg-amber-500/20 text-amber-400 border border-amber-500/30">
                Bolsa de Empleo Agremiada
              </span>
              <h3 className="font-serif text-2xl sm:text-3xl font-bold text-white mt-2">
                Gestión & Creación de Ofertas Laborales
              </h3>
              <p className="text-xs sm:text-sm text-slate-300">
                Publique vacantes directamente en la <strong>Bolsa de Empleo Oficial</strong> para captar talento calificado de la ULA y el Hotel Escuela.
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-white/10 border border-white/15 text-center shrink-0">
              <span className="text-xs uppercase font-bold text-amber-400 block">Vacantes Activas</span>
              <span className="text-2xl sm:text-3xl font-serif font-bold text-white block mt-0.5">{createdJobs.length}</span>
              <span className="text-[10px] text-slate-300">Con visibilidad inmediata</span>
            </div>
          </div>

          <div className="p-6 sm:p-8 rounded-3xl bg-white border border-slate-200 shadow-md">
            <div className="flex items-center gap-2 mb-6">
              <PlusCircle className="w-5 h-5 text-amber-600" />
              <h4 className="font-serif text-xl font-bold text-slate-900">
                Publicar Nueva Vacante
              </h4>
            </div>

            {jobCreatedSuccess && (
              <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold flex items-center gap-2 mb-6 animate-fadeIn">
                <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                <span>¡Vacante publicada con éxito! Ya está visible en la sección pública de Empleos.</span>
              </div>
            )}

            <form onSubmit={handleCreateJob} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Título del Cargo *</label>
                  <input
                    type="text"
                    required
                    placeholder="Ej. Chef de Partida / Barista de Especialidad"
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
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Experiencia</label>
                  <select
                    value={newJobExp}
                    onChange={(e) => setNewJobExp(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-medium bg-white focus:outline-none focus:border-amber-500 text-slate-700"
                  >
                    <option>1 a 2 años</option>
                    <option>2 a 3 años</option>
                    <option>4+ años (Senior)</option>
                  </select>
                </div>
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

          {/* List of Published Vacancies */}
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
                    </div>

                    <h5 className="font-serif font-bold text-lg text-slate-900">{job.title}</h5>
                    <p className="text-xs text-slate-600">
                      <strong>Remuneración:</strong> {job.salary} • <strong>Jornada:</strong> {job.type}
                    </p>
                  </div>

                  <button
                    onClick={() => setViewingApplicantsJob(job)}
                    className="py-2 px-4 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs flex items-center gap-1.5 shadow-sm"
                  >
                    <Users className="w-3.5 h-3.5 text-amber-400" />
                    <span>Ver Postulados ({job.applicants?.length || job.applicantsCount})</span>
                  </button>
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
                  <span className="text-xs text-slate-500 block">Restaurante Afiliado Oficial</span>
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
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-800 focus:outline-none focus:border-amber-500"
                  >
                    <option value="pago-movil">Pago Móvil Interbancario (Banesco / Mercantil)</option>
                    <option value="zelle">Zelle / Transferencia Internacional</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Número de Referencia</label>
                  <input 
                    type="text" 
                    required
                    placeholder="Ej. 09847291"
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-800 focus:outline-none focus:border-amber-500 font-mono"
                  />
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
              <h3 className="font-serif text-xl font-bold text-slate-900">Capacitaciones Exclusivas para Brigadas</h3>
              <p className="text-xs text-slate-600">Descuento del 50% al 100% para el personal de restaurantes afiliados.</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {internalCourses.map((course) => (
              <div key={course.id} className="p-5 rounded-2xl bg-white border border-slate-200 shadow-sm flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between gap-2 mb-2">
                    <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded bg-amber-100 text-amber-900">
                      {course.duration}
                    </span>
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
                    onClick={() => alert(`¡Inscrito en ${course.title}! Recibirá el enlace y material.`)}
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
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-xs text-slate-800 focus:outline-none focus:border-amber-500"
                >
                  <option>Consulta Gremial / Legal</option>
                  <option>Solicitud de Auditoría para Sello de Calidad</option>
                  <option>Convenios de Proveedores Agrícolas</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Mensaje</label>
                <textarea 
                  rows={4}
                  required
                  value={contactMessage}
                  onChange={(e) => setContactMessage(e.target.value)}
                  placeholder="Escriba aquí los detalles..."
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-xs text-slate-800 focus:outline-none focus:border-amber-500"
                />
              </div>

              <button
                type="submit"
                className="w-full py-3 rounded-xl bg-amber-500 hover:bg-amber-600 text-white font-serif font-bold text-xs uppercase tracking-wider transition-all shadow-sm"
              >
                {messageSent ? 'Enviando...' : 'Enviar a la Junta Directiva'}
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Modal: View Applicants */}
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
