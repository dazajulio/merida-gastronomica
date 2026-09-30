import React, { useState, useEffect } from 'react';
import { 
  ShieldCheck, 
  Lock, 
  Mail, 
  Calendar as CalendarIcon, 
  Clock, 
  MapPin, 
  Users, 
  UserCheck, 
  Plus, 
  Edit3, 
  Trash2, 
  CheckCircle2, 
  AlertCircle, 
  LogOut, 
  Eye, 
  EyeOff, 
  ChevronLeft, 
  ChevronRight, 
  Award, 
  Briefcase, 
  Sparkles, 
  FileText, 
  Download, 
  Share2, 
  Video, 
  Check, 
  Radio, 
  Send,
  Building2,
  CalendarDays,
  ListFilter
} from 'lucide-react';
import { BOARD_MEMBERS_DATA, INITIAL_BOARD_AGENDA_DATA } from '../data/boardData';
import { sendBoardAttendanceEmail } from '../lib/emailService';

export function BoardAdminPortal({ t, onNavigate }) {
  // Authentication State
  const [currentUser, setCurrentUser] = useState(() => {
    try {
      const saved = localStorage.getItem('cgem_board_user');
      return saved ? JSON.parse(saved) : null;
    } catch (e) {
      return null;
    }
  });

  const [emailInput, setEmailInput] = useState('');
  const [passwordInput, setPasswordInput] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loginError, setLoginError] = useState('');
  const [isLoggingIn, setIsLoggingIn] = useState(false);

  // Agenda State
  const [agendaEvents, setAgendaEvents] = useState(() => {
    try {
      const saved = localStorage.getItem('cgem_board_agenda');
      if (saved) return JSON.parse(saved);
    } catch (e) {}
    return INITIAL_BOARD_AGENDA_DATA;
  });

  // Save agenda to localStorage whenever it changes
  useEffect(() => {
    try {
      localStorage.setItem('cgem_board_agenda', JSON.stringify(agendaEvents));
    } catch (e) {}
  }, [agendaEvents]);

  // Calendar View Filters & Navigation
  const [selectedYear, setSelectedYear] = useState(2026);
  const [selectedMonth, setSelectedMonth] = useState(10); // 1 to 12 (10 = Octubre)
  const [activeCategoryFilter, setActiveCategoryFilter] = useState('all');
  const [viewMode, setViewMode] = useState('timeline'); // timeline | calendar | board_list
  const [selectedEventForDetail, setSelectedEventForDetail] = useState(null);

  // Admin Event Management Modal
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [editingEvent, setEditingEvent] = useState(null);
  const [actionSuccessMessage, setActionSuccessMessage] = useState('');
  const [rsvpLoadingEventId, setRsvpLoadingEventId] = useState(null);

  // Form State for Event Creation / Editing
  const [formData, setFormData] = useState({
    title: '',
    type: 'reunion',
    typeLabel: 'Reunión de Junta',
    date: new Date().toISOString().split('T')[0],
    timeStart: '09:00',
    timeEnd: '11:00',
    location: 'Sede Institucional CGEM / Centro Histórico, Mérida',
    isVirtual: false,
    virtualLink: '',
    organizer: 'Presidencia & Dirección Ejecutiva',
    description: '',
    status: 'confirmado'
  });

  // Months list
  const MONTHS = [
    { num: 1, name: 'Enero' },
    { num: 2, name: 'Febrero' },
    { num: 3, name: 'Marzo' },
    { num: 4, name: 'Abril' },
    { num: 5, name: 'Mayo' },
    { num: 6, name: 'Junio' },
    { num: 7, name: 'Julio' },
    { num: 8, name: 'Agosto' },
    { num: 9, name: 'Septiembre' },
    { num: 10, name: 'Octubre' },
    { num: 11, name: 'Noviembre' },
    { num: 12, name: 'Diciembre' },
  ];

  const EVENT_TYPES = [
    { id: 'all', label: 'Todas las Actividades', color: 'bg-slate-800 text-white' },
    { id: 'reunion', label: 'Reunión de Junta', color: 'bg-amber-100 text-amber-900 border-amber-300' },
    { id: 'medios', label: 'Medios & Entrevistas', color: 'bg-sky-100 text-sky-900 border-sky-300' },
    { id: 'auditoria', label: 'Inspección & Sello AAA', color: 'bg-purple-100 text-purple-900 border-purple-300' },
    { id: 'gremial', label: 'Encuentro Gremial', color: 'bg-emerald-100 text-emerald-900 border-emerald-300' },
    { id: 'institucional', label: 'Institucional & Gobierno', color: 'bg-indigo-100 text-indigo-900 border-indigo-300' },
    { id: 'expo', label: 'Expo Andes 2027', color: 'bg-rose-100 text-rose-900 border-rose-300' }
  ];

  // Handle Login
  const handleLogin = (e) => {
    e.preventDefault();
    setLoginError('');
    setIsLoggingIn(true);

    setTimeout(() => {
      const emailClean = emailInput.trim().toLowerCase();
      
      // Verification for Presidente Julio Daza
      if (emailClean === 'dazajulio@gmail.com' && passwordInput === 'Dafaca10*') {
        const presidentUser = BOARD_MEMBERS_DATA.find(m => m.id === 'dir-presidente');
        setCurrentUser(presidentUser);
        localStorage.setItem('cgem_board_user', JSON.stringify(presidentUser));
        setIsLoggingIn(false);
        return;
      }

      // Check if it matches any other member without password set yet
      const foundMember = BOARD_MEMBERS_DATA.find(m => m.email.toLowerCase() === emailClean);
      if (foundMember && !foundMember.hasPasswordSet) {
        setLoginError('Este cargo directivo está pre-registrado. Las credenciales de acceso individual están en proceso de activación por Presidencia.');
        setIsLoggingIn(false);
        return;
      }

      setLoginError('Credenciales incorrectas. Verifique el correo electrónico y la contraseña institucional.');
      setIsLoggingIn(false);
    }, 400);
  };

  // Handle Logout
  const handleLogout = () => {
    setCurrentUser(null);
    localStorage.removeItem('cgem_board_user');
    setEmailInput('');
    setPasswordInput('');
  };

  // Filter events based on selections
  const filteredEvents = agendaEvents.filter(event => {
    const eventYear = parseInt(event.date.split('-')[0], 10);
    const eventMonth = parseInt(event.date.split('-')[1], 10);

    const matchYear = selectedYear === 'all' || eventYear === selectedYear;
    const matchMonth = selectedMonth === 'all' || eventMonth === selectedMonth;
    const matchCategory = activeCategoryFilter === 'all' || event.type === activeCategoryFilter;

    return matchYear && matchMonth && matchCategory;
  }).sort((a, b) => new Date(a.date) - new Date(b.date));

  // Check if current user has confirmed attendance for an event
  const isUserConfirmed = (event) => {
    if (!currentUser || !event.confirmedAttendees) return false;
    return event.confirmedAttendees.some(a => a.memberId === currentUser.id || a.name === currentUser.name);
  };

  // Toggle RSVP / "VOY A ASISTIR"
  const handleToggleAttendance = async (event) => {
    if (!currentUser) return;
    setRsvpLoadingEventId(event.id);

    const alreadyConfirmed = isUserConfirmed(event);
    let updatedAttendees = [];

    if (alreadyConfirmed) {
      // Remove attendance
      updatedAttendees = (event.confirmedAttendees || []).filter(
        a => a.memberId !== currentUser.id && a.name !== currentUser.name
      );
      setActionSuccessMessage('Has cancelado tu confirmación de asistencia a esta actividad.');
    } else {
      // Add attendance
      const newAttendee = {
        memberId: currentUser.id,
        name: currentUser.name,
        role: currentUser.role,
        confirmedAt: new Date().toISOString()
      };
      updatedAttendees = [...(event.confirmedAttendees || []), newAttendee];
      setActionSuccessMessage('¡Excelente! Tu asistencia ha sido confirmada formalmente. Se ha enviado notificación a tu correo.');

      // Send Email Notification via Resend
      try {
        await sendBoardAttendanceEmail({
          memberName: currentUser.name,
          memberRole: currentUser.role,
          memberEmail: currentUser.email,
          eventTitle: event.title,
          eventType: event.typeLabel || event.type,
          eventDate: event.date,
          eventTime: `${event.timeStart || ''} - ${event.timeEnd || ''}`,
          eventLocation: event.location,
          isVirtual: event.isVirtual,
          virtualLink: event.virtualLink
        });
      } catch (err) {
        console.warn('Error enviando correo de confirmación directiva:', err);
      }
    }

    // Update state
    setAgendaEvents(prev => prev.map(ev => {
      if (ev.id === event.id) {
        return { ...ev, confirmedAttendees: updatedAttendees };
      }
      return ev;
    }));

    setRsvpLoadingEventId(null);
    setTimeout(() => setActionSuccessMessage(''), 5000);
  };

  // Save (Create or Update) Event (Admin Only: Presidente / Director Ejecutivo)
  const handleSaveEvent = (e) => {
    e.preventDefault();
    if (!currentUser?.isAdminLevel) return;

    const eventDate = formData.date;
    const year = parseInt(eventDate.split('-')[0], 10);
    const month = parseInt(eventDate.split('-')[1], 10);

    const typeConfig = EVENT_TYPES.find(t => t.id === formData.type) || { label: 'Actividad Directiva' };

    if (editingEvent) {
      // Update
      setAgendaEvents(prev => prev.map(ev => {
        if (ev.id === editingEvent.id) {
          return {
            ...ev,
            ...formData,
            year,
            month,
            typeLabel: typeConfig.label
          };
        }
        return ev;
      }));
      setActionSuccessMessage('Actividad actualizada exitosamente en la agenda de la Junta Directiva.');
    } else {
      // Create
      const newEvent = {
        id: `agenda-${Date.now()}`,
        ...formData,
        year,
        month,
        typeLabel: typeConfig.label,
        confirmedAttendees: [
          {
            memberId: currentUser.id,
            name: currentUser.name,
            role: currentUser.role,
            confirmedAt: new Date().toISOString()
          }
        ]
      };
      setAgendaEvents(prev => [newEvent, ...prev]);
      setActionSuccessMessage('Nueva actividad creada y agendada en el calendario de la Junta Directiva.');
    }

    setIsCreateModalOpen(false);
    setEditingEvent(null);
    setTimeout(() => setActionSuccessMessage(''), 4000);
  };

  // Delete Event (Admin Only)
  const handleDeleteEvent = (eventId) => {
    if (!currentUser?.isAdminLevel) return;
    if (window.confirm('¿Está seguro de que desea eliminar esta actividad de la agenda institucional?')) {
      setAgendaEvents(prev => prev.filter(ev => ev.id !== eventId));
      setActionSuccessMessage('Actividad eliminada de la agenda directiva.');
      setTimeout(() => setActionSuccessMessage(''), 4000);
    }
  };

  // Open Edit Modal
  const openEditModal = (event) => {
    setEditingEvent(event);
    setFormData({
      title: event.title,
      type: event.type,
      typeLabel: event.typeLabel,
      date: event.date,
      timeStart: event.timeStart,
      timeEnd: event.timeEnd,
      location: event.location,
      isVirtual: event.isVirtual || false,
      virtualLink: event.virtualLink || '',
      organizer: event.organizer,
      description: event.description,
      status: event.status || 'confirmado'
    });
    setIsCreateModalOpen(true);
  };

  // Open New Modal
  const openNewModal = () => {
    setEditingEvent(null);
    setFormData({
      title: '',
      type: 'reunion',
      typeLabel: 'Reunión de Junta',
      date: `${selectedYear}-${String(selectedMonth).padStart(2, '0')}-15`,
      timeStart: '09:30',
      timeEnd: '11:30',
      location: 'Sede Institucional CGEM (Av. 4 entre Calles 19 y 20) / Sala de Juntas',
      isVirtual: false,
      virtualLink: '',
      organizer: 'Presidencia & Dirección Ejecutiva',
      description: '',
      status: 'confirmado'
    });
    setIsCreateModalOpen(true);
  };

  // =========================================================================
  // VIEW 1: LOGIN PORTAL (SI NO ESTÁ AUTENTICADO)
  // =========================================================================
  if (!currentUser) {
    return (
      <div className="min-h-screen bg-[#0f172a] text-slate-100 flex flex-col justify-center items-center px-4 py-16 selection:bg-amber-500 selection:text-white relative overflow-hidden">
        {/* Background glow effects */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-10 right-10 w-[400px] h-[400px] bg-sky-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-xl w-full relative z-10">
          
          {/* Header Card */}
          <div className="text-center mb-8 space-y-3">
            <div className="inline-flex items-center justify-center w-20 h-20 rounded-3xl bg-slate-800/90 border border-amber-500/40 p-2 shadow-2xl shadow-amber-500/10 mb-2">
              <img 
                src="/logo-merida-gastronomica.png" 
                alt="Cámara Gastronómica del Estado Mérida" 
                className="w-full h-full object-contain"
              />
            </div>
            
            <div>
              <span className="text-[10px] font-extrabold uppercase tracking-[0.25em] px-3 py-1 rounded-full bg-amber-500/20 text-amber-400 border border-amber-500/40">
                Acceso Privado &bull; Nivel Directivo
              </span>
              <h1 className="font-serif font-black text-2xl sm:text-3xl uppercase tracking-wider text-white mt-3">
                Portal Junta Directiva
              </h1>
              <p className="text-xs text-slate-400 mt-1 max-w-md mx-auto">
                Cámara Gastronómica del Estado Mérida &bull; Plataforma de Planificación Estratégica, Agenda y Coordinación Gremial
              </p>
            </div>
          </div>

          {/* Login Form Box */}
          <div className="bg-slate-900/90 backdrop-blur-xl border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl">
            
            {loginError && (
              <div className="mb-6 p-4 rounded-2xl bg-rose-500/15 border border-rose-500/40 text-rose-300 text-xs flex items-start gap-3">
                <AlertCircle className="w-5 h-5 shrink-0 mt-0.5 text-rose-400" />
                <div className="leading-relaxed">{loginError}</div>
              </div>
            )}

            <form onSubmit={handleLogin} className="space-y-5">
              <div>
                <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-2">
                  Correo Electrónico Institucional
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-amber-400 absolute left-4 top-1/2 -translate-y-1/2" />
                  <input
                    type="email"
                    required
                    value={emailInput}
                    onChange={(e) => setEmailInput(e.target.value)}
                    placeholder="ej: dazajulio@gmail.com"
                    className="w-full pl-11 pr-4 py-3.5 rounded-xl bg-slate-800/80 border border-slate-700 text-white placeholder-slate-500 text-sm focus:outline-none focus:border-amber-400 focus:ring-1 focus:ring-amber-400 transition-all font-sans"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-2">
                  Contraseña de Acceso
                </label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-amber-400 absolute left-4 top-1/2 -translate-y-1/2" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={passwordInput}
                    onChange={(e) => setPasswordInput(e.target.value)}
                    placeholder="••••••••••"
                    className="w-full pl-11 pr-11 py-3.5 rounded-xl bg-slate-800/80 border border-slate-700 text-white placeholder-slate-500 text-sm focus:outline-none focus:border-amber-400 focus:ring-1 focus:ring-amber-400 transition-all font-sans"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-200 transition-colors"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  disabled={isLoggingIn}
                  className="w-full py-3.5 px-6 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-slate-950 font-serif font-black text-xs uppercase tracking-widest flex items-center justify-center gap-2 shadow-lg shadow-amber-500/20 transition-all disabled:opacity-50"
                >
                  <ShieldCheck className="w-4 h-4 text-slate-950" />
                  <span>{isLoggingIn ? 'Verificando Credenciales...' : 'Ingresar a la Agenda Directiva'}</span>
                </button>
              </div>
            </form>

            {/* Directiva Roles Preview / Information */}
            <div className="mt-8 pt-6 border-t border-slate-800">
              <div className="flex items-center justify-between text-xs text-slate-400 mb-3">
                <span className="font-bold uppercase tracking-wider text-amber-400 flex items-center gap-1.5">
                  <Users className="w-3.5 h-3.5" />
                  Estructura Oficial de la Junta
                </span>
                <span className="text-[10px] bg-slate-800 px-2 py-0.5 rounded text-slate-300">10 Directivos</span>
              </div>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[11px] text-slate-400 max-h-48 overflow-y-auto pr-1">
                {BOARD_MEMBERS_DATA.map((member) => (
                  <div key={member.id} className="p-2 rounded-lg bg-slate-800/40 border border-slate-800/80 flex flex-col justify-between">
                    <div>
                      <span className="font-bold text-slate-200 block truncate">{member.role}</span>
                      <span className="text-slate-400 block truncate">{member.name}</span>
                    </div>
                    <span className="text-[10px] text-amber-500/80 font-mono mt-0.5">{member.ci}</span>
                  </div>
                ))}
              </div>
            </div>

          </div>

          <div className="text-center mt-6">
            <button
              onClick={() => onNavigate ? onNavigate('home') : (window.location.href = '/')}
              className="text-xs text-slate-400 hover:text-amber-400 transition-colors underline"
            >
              &larr; Volver al Portal Principal de Mérida Gastronómica
            </button>
          </div>

        </div>
      </div>
    );
  }

  // =========================================================================
  // VIEW 2: AUTHENTICATED BOARD DASHBOARD & AGENDA
  // =========================================================================
  return (
    <div className="min-h-screen bg-[#0b1120] text-slate-100 pb-24 selection:bg-amber-500 selection:text-white">
      
      {/* Top Directiva Banner */}
      <div className="bg-slate-900 border-b border-slate-800 pt-28 pb-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          
          {/* Top Row: User Card & Actions */}
          <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6 pb-6 border-b border-slate-800/80">
            
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-amber-500 to-amber-700 p-1 flex items-center justify-center shadow-xl shadow-amber-500/10 shrink-0 border border-amber-400/50">
                <ShieldCheck className="w-9 h-9 text-slate-950" />
              </div>

              <div>
                <div className="flex flex-wrap items-center gap-2 mb-1">
                  <span className="text-[10px] font-extrabold uppercase tracking-widest px-2.5 py-0.5 rounded-full bg-amber-500/20 text-amber-400 border border-amber-500/40">
                    {currentUser.roleCategory} &bull; {currentUser.role}
                  </span>
                  {currentUser.isAdminLevel && (
                    <span className="text-[10px] font-extrabold uppercase tracking-widest px-2.5 py-0.5 rounded-full bg-sky-500/20 text-sky-400 border border-sky-500/40">
                      Potestad Total / Administrador
                    </span>
                  )}
                </div>

                <h1 className="font-serif font-black text-2xl sm:text-3xl text-white uppercase tracking-wide">
                  {currentUser.name}
                </h1>
                
                <div className="flex flex-wrap items-center gap-4 text-xs text-slate-400 mt-1">
                  <span className="font-mono text-amber-400/90 font-bold">{currentUser.ci}</span>
                  <span>&bull;</span>
                  <span>{currentUser.email}</span>
                  <span>&bull;</span>
                  <span className="text-emerald-400 font-semibold flex items-center gap-1">
                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                    Sesión Directiva Activa
                  </span>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-3 w-full sm:w-auto">
              {currentUser.isAdminLevel && (
                <button
                  onClick={openNewModal}
                  className="flex-1 sm:flex-initial py-2.5 px-4 rounded-xl bg-amber-500 hover:bg-amber-600 text-slate-950 font-serif font-black text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-lg shadow-amber-500/20 transition-all"
                >
                  <Plus className="w-4 h-4" />
                  <span>Nuevo Evento en Agenda</span>
                </button>
              )}

              <button
                onClick={handleLogout}
                className="py-2.5 px-4 rounded-xl bg-slate-800 hover:bg-rose-900/60 text-slate-300 hover:text-rose-200 border border-slate-700 text-xs font-bold flex items-center gap-1.5 transition-all"
                title="Cerrar Sesión Directiva"
              >
                <LogOut className="w-4 h-4" />
                <span className="hidden sm:inline">Cerrar Sesión</span>
              </button>
            </div>

          </div>

          {/* Success Notification Bar */}
          {actionSuccessMessage && (
            <div className="mt-4 p-4 rounded-2xl bg-emerald-500/20 border border-emerald-500/50 text-emerald-200 text-xs flex items-center gap-3 animate-fadeIn">
              <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
              <span className="font-medium">{actionSuccessMessage}</span>
            </div>
          )}

          {/* Navigation Controls: Year, Month, Category Filter */}
          <div className="mt-6 space-y-4">
            
            {/* Year Selector + View Mode Switcher */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              
              {/* Year tabs */}
              <div className="flex items-center gap-2 bg-slate-950/80 p-1.5 rounded-2xl border border-slate-800">
                <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider px-3">
                  Año de Planificación:
                </span>
                {[2026, 2027, 'all'].map((yr) => (
                  <button
                    key={yr}
                    onClick={() => setSelectedYear(yr)}
                    className={`py-1.5 px-4 rounded-xl text-xs font-serif font-black transition-all ${
                      selectedYear === yr
                        ? 'bg-amber-500 text-slate-950 shadow-md'
                        : 'text-slate-400 hover:text-white hover:bg-slate-800'
                    }`}
                  >
                    {yr === 'all' ? 'Ver Todos los Años' : yr}
                  </button>
                ))}
              </div>

              {/* View Mode Buttons */}
              <div className="flex items-center gap-1 bg-slate-950/80 p-1.5 rounded-2xl border border-slate-800">
                <button
                  onClick={() => setViewMode('timeline')}
                  className={`py-1.5 px-3.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
                    viewMode === 'timeline'
                      ? 'bg-slate-800 text-amber-400 border border-amber-500/30 shadow'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  <Clock className="w-3.5 h-3.5" />
                  <span>Cronograma Día a Día</span>
                </button>

                <button
                  onClick={() => setViewMode('board_list')}
                  className={`py-1.5 px-3.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
                    viewMode === 'board_list'
                      ? 'bg-slate-800 text-amber-400 border border-amber-500/30 shadow'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  <Users className="w-3.5 h-3.5" />
                  <span>Junta Directiva</span>
                </button>
              </div>

            </div>

            {/* Month Ribbon */}
            <div className="flex items-center gap-1 overflow-x-auto pb-2 scrollbar-thin">
              <button
                onClick={() => setSelectedMonth('all')}
                className={`py-2 px-3.5 rounded-xl text-xs font-bold uppercase tracking-wider whitespace-nowrap transition-all ${
                  selectedMonth === 'all'
                    ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                    : 'bg-slate-800/60 text-slate-400 hover:text-slate-200 border border-slate-800'
                }`}
              >
                Todos los Meses
              </button>

              {MONTHS.map((m) => (
                <button
                  key={m.num}
                  onClick={() => setSelectedMonth(m.num)}
                  className={`py-2 px-3.5 rounded-xl text-xs font-bold uppercase tracking-wider whitespace-nowrap transition-all ${
                    selectedMonth === m.num
                      ? 'bg-amber-500 text-slate-950 font-black shadow-md'
                      : 'bg-slate-800/60 text-slate-400 hover:text-slate-200 border border-slate-800'
                  }`}
                >
                  {m.name}
                </button>
              ))}
            </div>

            {/* Category Filter Chips */}
            <div className="flex items-center gap-2 overflow-x-auto pb-1">
              <span className="text-[10px] font-bold uppercase tracking-widest text-slate-500 shrink-0 flex items-center gap-1">
                <ListFilter className="w-3 h-3" />
                Filtrar:
              </span>
              {EVENT_TYPES.map((type) => (
                <button
                  key={type.id}
                  onClick={() => setActiveCategoryFilter(type.id)}
                  className={`py-1 px-3 rounded-lg text-xs font-semibold whitespace-nowrap transition-all border ${
                    activeCategoryFilter === type.id
                      ? 'bg-amber-400/20 text-amber-300 border-amber-400/60 ring-1 ring-amber-400/30'
                      : 'bg-slate-900 text-slate-400 border-slate-800 hover:border-slate-700 hover:text-slate-200'
                  }`}
                >
                  {type.label}
                </button>
              ))}
            </div>

          </div>

        </div>
      </div>

      {/* Main Content Area */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-8">
        
        {/* VIEW MODE 1: TIMELINE / CHRONOLOGICAL DAY BY DAY */}
        {viewMode === 'timeline' && (
          <div className="space-y-6">
            
            {/* Header / Counter */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <CalendarDays className="w-5 h-5 text-amber-400" />
                <h2 className="font-serif font-black text-xl text-white uppercase tracking-wider">
                  Agenda y Compromisos Institucionales
                </h2>
                <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-slate-800 text-amber-400 border border-slate-700">
                  {filteredEvents.length} {filteredEvents.length === 1 ? 'actividad' : 'actividades'}
                </span>
              </div>

              {currentUser.isAdminLevel && (
                <button
                  onClick={openNewModal}
                  className="text-xs text-amber-400 hover:text-amber-300 font-bold flex items-center gap-1"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Agregar otra actividad</span>
                </button>
              )}
            </div>

            {/* Events List */}
            {filteredEvents.length === 0 ? (
              <div className="p-12 text-center rounded-3xl bg-slate-900/60 border border-slate-800 space-y-3">
                <CalendarIcon className="w-12 h-12 text-slate-600 mx-auto" />
                <h3 className="font-serif font-bold text-lg text-slate-300">
                  No hay actividades programadas con los filtros seleccionados
                </h3>
                <p className="text-xs text-slate-500 max-w-md mx-auto">
                  Seleccione otro mes o año, o utilice el botón superior para registrar una nueva sesión, entrevista o evento en la agenda oficial.
                </p>
                {currentUser.isAdminLevel && (
                  <button
                    onClick={openNewModal}
                    className="mt-2 py-2 px-4 rounded-xl bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold text-xs"
                  >
                    Crear Actividad para este Período
                  </button>
                )}
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-6">
                {filteredEvents.map((event) => {
                  const confirmed = isUserConfirmed(event);
                  const attendeeCount = (event.confirmedAttendees || []).length;
                  const isLoadingRsvp = rsvpLoadingEventId === event.id;

                  // Parse date for visual badge
                  const [y, m, d] = event.date.split('-');
                  const monthName = MONTHS.find(mon => mon.num === parseInt(m, 10))?.name || m;

                  return (
                    <div 
                      key={event.id}
                      className={`p-6 sm:p-7 rounded-3xl border transition-all relative overflow-hidden ${
                        confirmed
                          ? 'bg-gradient-to-br from-slate-900 via-slate-900 to-amber-950/30 border-amber-500/40 shadow-xl'
                          : 'bg-slate-900/80 border-slate-800 hover:border-slate-700 shadow-md'
                      }`}
                    >
                      {/* Left vertical accent */}
                      <div className={`absolute top-0 left-0 bottom-0 w-2 ${
                        event.type === 'reunion' ? 'bg-amber-500' :
                        event.type === 'medios' ? 'bg-sky-500' :
                        event.type === 'auditoria' ? 'bg-purple-500' :
                        event.type === 'gremial' ? 'bg-emerald-500' :
                        event.type === 'expo' ? 'bg-rose-500' : 'bg-indigo-500'
                      }`} />

                      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start pl-2">
                        
                        {/* Date Column */}
                        <div className="lg:col-span-2 flex lg:flex-col items-center lg:items-start gap-3 sm:gap-2">
                          <div className="text-center p-3 rounded-2xl bg-slate-950 border border-slate-800 min-w-[70px]">
                            <span className="text-[10px] font-extrabold uppercase tracking-widest text-amber-400 block">
                              {monthName.slice(0, 3)}
                            </span>
                            <span className="font-serif font-black text-2xl sm:text-3xl text-white block leading-tight">
                              {d}
                            </span>
                            <span className="text-[10px] text-slate-500 font-mono block">
                              {y}
                            </span>
                          </div>

                          <span className={`text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full border ${
                            event.type === 'reunion' ? 'bg-amber-500/10 text-amber-300 border-amber-500/30' :
                            event.type === 'medios' ? 'bg-sky-500/10 text-sky-300 border-sky-500/30' :
                            event.type === 'auditoria' ? 'bg-purple-500/10 text-purple-300 border-purple-500/30' :
                            event.type === 'gremial' ? 'bg-emerald-500/10 text-emerald-300 border-emerald-500/30' :
                            event.type === 'expo' ? 'bg-rose-500/10 text-rose-300 border-rose-500/30' : 'bg-indigo-500/10 text-indigo-300 border-indigo-500/30'
                          }`}>
                            {event.typeLabel || event.type}
                          </span>
                        </div>

                        {/* Details Column */}
                        <div className="lg:col-span-7 space-y-3">
                          
                          <div>
                            <h3 className="font-serif font-black text-lg sm:text-xl text-white leading-snug">
                              {event.title}
                            </h3>
                            <p className="text-xs text-slate-300 mt-2 leading-relaxed">
                              {event.description}
                            </p>
                          </div>

                          {/* Time & Location Metadata */}
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-slate-400 pt-1">
                            <div className="flex items-center gap-2">
                              <Clock className="w-4 h-4 text-amber-400 shrink-0" />
                              <span className="text-slate-300">{event.timeStart} - {event.timeEnd}</span>
                            </div>

                            <div className="flex items-center gap-2">
                              <MapPin className="w-4 h-4 text-amber-400 shrink-0" />
                              <span className="text-slate-300 truncate" title={event.location}>
                                {event.isVirtual ? 'Sesión Virtual / Videoconferencia' : event.location}
                              </span>
                            </div>

                            <div className="flex items-center gap-2">
                              <Users className="w-4 h-4 text-sky-400 shrink-0" />
                              <span>Responsable: <strong className="text-slate-200">{event.organizer}</strong></span>
                            </div>
                          </div>

                          {/* Confirmed Attendees list */}
                          <div className="pt-2">
                            <div className="flex items-center gap-2 text-xs text-slate-400 mb-1.5">
                              <UserCheck className="w-3.5 h-3.5 text-emerald-400" />
                              <span className="font-bold uppercase tracking-wider text-[11px] text-slate-300">
                                Asistencias Confirmadas ({attendeeCount}):
                              </span>
                            </div>

                            {attendeeCount === 0 ? (
                              <span className="text-[11px] text-slate-500 italic">
                                Aún no hay confirmaciones registradas para esta convocatoria.
                              </span>
                            ) : (
                              <div className="flex flex-wrap items-center gap-2">
                                {event.confirmedAttendees.map((att, idx) => (
                                  <span 
                                    key={idx}
                                    className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-slate-950 border border-slate-800 text-[11px] text-slate-200 font-medium"
                                  >
                                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                                    <span>{att.name}</span>
                                    <span className="text-slate-500 text-[10px]">({att.role})</span>
                                  </span>
                                ))}
                              </div>
                            )}
                          </div>

                        </div>

                        {/* Actions Column */}
                        <div className="lg:col-span-3 flex flex-col justify-between h-full gap-4 pt-2 lg:pt-0 lg:border-l lg:border-slate-800/80 lg:pl-6">
                          
                          {/* "VOY A ASISTIR" RSVP BUTTON */}
                          <div className="space-y-2">
                            <button
                              onClick={() => handleToggleAttendance(event)}
                              disabled={isLoadingRsvp}
                              className={`w-full py-3 px-4 rounded-xl font-serif font-black text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-lg transition-all ${
                                confirmed
                                  ? 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-emerald-900/30 ring-2 ring-emerald-400/40'
                                  : 'bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-slate-950 shadow-amber-500/20'
                              }`}
                            >
                              {isLoadingRsvp ? (
                                <span>Notificando Resend...</span>
                              ) : confirmed ? (
                                <>
                                  <CheckCircle2 className="w-4 h-4 text-white" />
                                  <span>✓ Asistencia Confirmada</span>
                                </>
                              ) : (
                                <>
                                  <Check className="w-4 h-4 text-slate-950" />
                                  <span>Voy a Asistir</span>
                                </>
                              )}
                            </button>

                            <p className="text-[10px] text-center text-slate-400">
                              {confirmed 
                                ? 'Notificación enviada a tu correo y a Dirección Ejecutiva.' 
                                : 'Al pulsar se registrará tu presencia y se notificará por correo.'}
                            </p>
                          </div>

                          {/* Admin Edit / Delete Controls */}
                          {currentUser.isAdminLevel && (
                            <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-800">
                              <button
                                onClick={() => openEditModal(event)}
                                className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors text-xs flex items-center gap-1 font-bold"
                                title="Editar detalles de la actividad"
                              >
                                <Edit3 className="w-3.5 h-3.5 text-amber-400" />
                                <span>Editar</span>
                              </button>

                              <button
                                onClick={() => handleDeleteEvent(event.id)}
                                className="p-2 rounded-lg bg-slate-800 hover:bg-rose-950 text-slate-400 hover:text-rose-400 transition-colors text-xs flex items-center gap-1 font-bold"
                                title="Eliminar actividad de la agenda"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                                <span>Eliminar</span>
                              </button>
                            </div>
                          )}

                        </div>

                      </div>

                    </div>
                  );
                })}
              </div>
            )}

          </div>
        )}

        {/* VIEW MODE 2: BOARD MEMBERS DIRECTORY */}
        {viewMode === 'board_list' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="font-serif font-black text-xl text-white uppercase tracking-wider">
                  Directorio Oficial de la Junta Directiva
                </h2>
                <p className="text-xs text-slate-400">
                  Cámara Gastronómica del Estado Mérida &bull; Período de Gestión Institucional
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {BOARD_MEMBERS_DATA.map((member) => {
                const isMe = currentUser.id === member.id;
                return (
                  <div 
                    key={member.id}
                    className={`p-5 rounded-3xl border transition-all ${
                      isMe 
                        ? 'bg-gradient-to-br from-slate-900 to-amber-950/40 border-amber-500 shadow-lg' 
                        : 'bg-slate-900/80 border-slate-800'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-3 mb-3">
                      <span className="text-[10px] font-extrabold uppercase tracking-widest px-2.5 py-0.5 rounded-full bg-slate-800 text-amber-400 border border-amber-500/30">
                        {member.roleCategory}
                      </span>
                      {member.isAdminLevel && (
                        <span className="text-[10px] font-extrabold uppercase tracking-widest px-2 py-0.5 rounded bg-sky-900/50 text-sky-300 border border-sky-500/30">
                          Admin
                        </span>
                      )}
                    </div>

                    <h4 className="font-serif font-black text-base text-white">
                      {member.name}
                    </h4>
                    <p className="text-xs font-bold text-amber-400 mt-0.5">
                      {member.role}
                    </p>

                    <div className="mt-4 pt-3 border-t border-slate-800 space-y-1.5 text-xs text-slate-400 font-mono">
                      <div className="flex justify-between">
                        <span>Cédula:</span>
                        <span className="text-slate-200 font-bold">{member.ci}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Correo:</span>
                        <span className="text-slate-300 truncate max-w-[170px]" title={member.email}>{member.email}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Estado:</span>
                        <span className={member.hasPasswordSet ? 'text-emerald-400 font-bold' : 'text-amber-500/80'}>
                          {member.hasPasswordSet ? 'Acceso Habilitado' : 'Pre-registrado'}
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

      </div>

      {/* CREATE / EDIT EVENT MODAL (ADMIN ONLY) */}
      {isCreateModalOpen && currentUser.isAdminLevel && (
        <div className="fixed inset-0 z-50 bg-slate-950/85 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto animate-fadeIn">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-2xl w-full p-6 sm:p-8 shadow-2xl relative my-8 max-h-[90vh] overflow-y-auto">
            
            <div className="flex items-center justify-between pb-4 border-b border-slate-800">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-xl bg-amber-500/20 text-amber-400 border border-amber-500/40">
                  <CalendarDays className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-serif font-black text-xl text-white uppercase tracking-wider">
                    {editingEvent ? 'Editar Actividad en Agenda' : 'Crear Nueva Actividad Institucional'}
                  </h3>
                  <p className="text-xs text-slate-400">
                    Junta Directiva &bull; Cámara Gastronómica del Estado Mérida
                  </p>
                </div>
              </div>

              <button
                onClick={() => setIsCreateModalOpen(false)}
                className="p-2 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSaveEvent} className="mt-6 space-y-4 text-xs">
              
              <div>
                <label className="block font-bold text-slate-300 uppercase tracking-wider mb-1.5">
                  Título de la Actividad / Evento *
                </label>
                <input
                  type="text"
                  required
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="ej: Sesión Ordinaria de Junta Directiva - Balance Trimestral"
                  className="w-full px-4 py-3 rounded-xl bg-slate-800 border border-slate-700 text-white placeholder-slate-500 text-sm focus:outline-none focus:border-amber-400"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-bold text-slate-300 uppercase tracking-wider mb-1.5">
                    Tipo de Convocatoria *
                  </label>
                  <select
                    value={formData.type}
                    onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl bg-slate-800 border border-slate-700 text-white text-sm focus:outline-none focus:border-amber-400"
                  >
                    <option value="reunion">Reunión de Junta Directiva</option>
                    <option value="medios">Medios de Comunicación & Entrevistas</option>
                    <option value="auditoria">Inspección & Auditoría Sello AAA</option>
                    <option value="gremial">Encuentro Gremial / Desayuno Corporativo</option>
                    <option value="institucional">Institucional & Gobierno</option>
                    <option value="expo">Comité Expo Gastronómica Andes 2027</option>
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-slate-300 uppercase tracking-wider mb-1.5">
                    Fecha Convocada *
                  </label>
                  <input
                    type="date"
                    required
                    value={formData.date}
                    onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl bg-slate-800 border border-slate-700 text-white text-sm focus:outline-none focus:border-amber-400 font-sans"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-bold text-slate-300 uppercase tracking-wider mb-1.5">
                    Hora de Inicio
                  </label>
                  <input
                    type="time"
                    value={formData.timeStart}
                    onChange={(e) => setFormData({ ...formData, timeStart: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl bg-slate-800 border border-slate-700 text-white text-sm focus:outline-none focus:border-amber-400"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-300 uppercase tracking-wider mb-1.5">
                    Hora de Culminación
                  </label>
                  <input
                    type="time"
                    value={formData.timeEnd}
                    onChange={(e) => setFormData({ ...formData, timeEnd: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl bg-slate-800 border border-slate-700 text-white text-sm focus:outline-none focus:border-amber-400"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-300 uppercase tracking-wider mb-1.5">
                  Sede / Ubicación Física *
                </label>
                <input
                  type="text"
                  required
                  value={formData.location}
                  onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                  placeholder="ej: Sede Institucional CGEM (Av. 4 entre Calles 19 y 20) / Sala de Juntas"
                  className="w-full px-4 py-3 rounded-xl bg-slate-800 border border-slate-700 text-white text-sm focus:outline-none focus:border-amber-400"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-300 uppercase tracking-wider mb-1.5">
                  Responsable / Convocante
                </label>
                <input
                  type="text"
                  value={formData.organizer}
                  onChange={(e) => setFormData({ ...formData, organizer: e.target.value })}
                  placeholder="ej: Presidencia & Dirección Ejecutiva"
                  className="w-full px-4 py-3 rounded-xl bg-slate-800 border border-slate-700 text-white text-sm focus:outline-none focus:border-amber-400"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-300 uppercase tracking-wider mb-1.5">
                  Descripción / Puntos de Agenda
                </label>
                <textarea
                  rows={3}
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Detalles sobre los temas a tratar, objetivos y preparación previa..."
                  className="w-full px-4 py-3 rounded-xl bg-slate-800 border border-slate-700 text-white text-sm focus:outline-none focus:border-amber-400"
                />
              </div>

              <div className="pt-4 flex items-center justify-end gap-3 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsCreateModalOpen(false)}
                  className="py-3 px-5 rounded-xl bg-slate-800 text-slate-300 hover:text-white font-bold text-xs"
                >
                  Cancelar
                </button>

                <button
                  type="submit"
                  className="py-3 px-6 rounded-xl bg-amber-500 hover:bg-amber-600 text-slate-950 font-serif font-black text-xs uppercase tracking-widest flex items-center gap-2 shadow-lg shadow-amber-500/20"
                >
                  <Check className="w-4 h-4" />
                  <span>{editingEvent ? 'Guardar Cambios' : 'Agendar Actividad'}</span>
                </button>
              </div>

            </form>

          </div>
        </div>
      )}

    </div>
  );
}
