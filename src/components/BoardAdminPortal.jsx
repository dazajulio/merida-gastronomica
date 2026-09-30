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
  Award, 
  Briefcase, 
  Sparkles, 
  FileText, 
  Download, 
  Share2, 
  Check, 
  Radio, 
  Send,
  Building2,
  CalendarDays,
  ListFilter,
  AlertTriangle,
  UserX
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

  // Agenda State (Stored in localStorage with fallback to INITIAL_BOARD_AGENDA_DATA)
  const [agendaEvents, setAgendaEvents] = useState(() => {
    try {
      const saved = localStorage.getItem('cgem_board_agenda_v2');
      if (saved) return JSON.parse(saved);
    } catch (e) {}
    return INITIAL_BOARD_AGENDA_DATA;
  });

  // Save agenda to localStorage whenever it changes
  useEffect(() => {
    try {
      localStorage.setItem('cgem_board_agenda_v2', JSON.stringify(agendaEvents));
    } catch (e) {}
  }, [agendaEvents]);

  // Calendar View Filters & Navigation
  const [selectedYear, setSelectedYear] = useState(2026);
  const [selectedMonth, setSelectedMonth] = useState('all'); // 'all' or 1..12
  const [activeCategoryFilter, setActiveCategoryFilter] = useState('all');
  const [viewMode, setViewMode] = useState('timeline'); // timeline | board_list

  // Admin Event Management Modal
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [editingEvent, setEditingEvent] = useState(null);
  const [actionSuccessMessage, setActionSuccessMessage] = useState('');
  const [actionErrorMessage, setActionErrorMessage] = useState('');
  const [rsvpLoadingEventId, setRsvpLoadingEventId] = useState(null);

  // Form State for Event Creation / Editing
  const [formData, setFormData] = useState({
    title: '',
    type: 'institucional',
    typeLabel: 'Institucional & Academia',
    date: new Date().toISOString().split('T')[0],
    timeStart: '09:00',
    timeEnd: '11:30',
    location: 'Sede Institucional CGEM (Av. 4 entre Calles 19 y 20) / Sala de Juntas',
    isVirtual: false,
    virtualLink: '',
    organizer: 'Presidencia & Dirección Ejecutiva',
    description: '',
    maxAttendees: '',
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
    { id: 'all', label: 'Todas las Actividades' },
    { id: 'institucional', label: 'Institucional & Gala' },
    { id: 'medios', label: 'Medios & Radio' },
    { id: 'gremial', label: 'Encuentro Gremial & Turismo' },
    { id: 'capacitacion', label: 'Formación & Talleres' },
    { id: 'reunion', label: 'Reunión de Junta Directiva' },
  ];

  // Handle Login
  const handleLogin = (e) => {
    e.preventDefault();
    setLoginError('');
    setIsLoggingIn(true);

    setTimeout(() => {
      const emailClean = emailInput.trim().toLowerCase();
      const passClean = passwordInput.trim();

      // Look up member
      const member = BOARD_MEMBERS_DATA.find(m => m.email.toLowerCase() === emailClean);

      if (member && member.hasPasswordSet && member.passwordHash === passClean) {
        setCurrentUser(member);
        localStorage.setItem('cgem_board_user', JSON.stringify(member));
        setIsLoggingIn(false);
        return;
      }

      if (member && !member.hasPasswordSet) {
        setLoginError('Este cargo directivo está pre-registrado. Las credenciales de acceso están pendientes por activación.');
        setIsLoggingIn(false);
        return;
      }

      setLoginError('Credenciales incorrectas. Verifique el correo electrónico y la contraseña asignada.');
      setIsLoggingIn(false);
    }, 300);
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

  // Check if event is at capacity
  const isEventAtCapacity = (event) => {
    if (!event.maxAttendees || event.maxAttendees <= 0) return false;
    const count = (event.confirmedAttendees || []).length;
    return count >= event.maxAttendees;
  };

  // Toggle RSVP / "VOY A ASISTIR"
  const handleToggleAttendance = async (event) => {
    if (!currentUser) return;
    setActionErrorMessage('');
    setActionSuccessMessage('');
    setRsvpLoadingEventId(event.id);

    const alreadyConfirmed = isUserConfirmed(event);
    const atCapacity = isEventAtCapacity(event);

    // If not confirmed and at capacity, prevent attendance!
    if (!alreadyConfirmed && atCapacity) {
      setActionErrorMessage(`NO HAY DISPONIBILIDAD para asistir a "${event.title}" porque se ocupó el límite máximo de ${event.maxAttendees} asistentes permitidos.`);
      setRsvpLoadingEventId(null);
      return;
    }

    let updatedAttendees = [];

    if (alreadyConfirmed) {
      // Remove attendance
      updatedAttendees = (event.confirmedAttendees || []).filter(
        a => a.memberId !== currentUser.id && a.name !== currentUser.name
      );
      setActionSuccessMessage(`Has cancelado tu confirmación de asistencia a "${event.title}".`);
    } else {
      // Add attendance
      const newAttendee = {
        memberId: currentUser.id,
        name: currentUser.name,
        role: currentUser.role,
        confirmedAt: new Date().toISOString()
      };
      updatedAttendees = [...(event.confirmedAttendees || []), newAttendee];
      setActionSuccessMessage(`¡Excelente ${currentUser.name}! Tu asistencia ha sido confirmada formalmente. Se ha enviado notificación a tu correo registrado y a Dirección Ejecutiva.`);

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
    setTimeout(() => {
      setActionSuccessMessage('');
      setActionErrorMessage('');
    }, 6000);
  };

  // Save (Create or Update) Event (Admin Only: Presidente / Director Ejecutivo)
  const handleSaveEvent = (e) => {
    e.preventDefault();
    if (!currentUser?.isAdminLevel) return;

    const eventDate = formData.date;
    const year = parseInt(eventDate.split('-')[0], 10);
    const month = parseInt(eventDate.split('-')[1], 10);

    const typeConfig = EVENT_TYPES.find(t => t.id === formData.type) || { label: 'Actividad Directiva' };
    const maxParsed = formData.maxAttendees ? parseInt(formData.maxAttendees, 10) : null;

    if (editingEvent) {
      // Update
      setAgendaEvents(prev => prev.map(ev => {
        if (ev.id === editingEvent.id) {
          return {
            ...ev,
            ...formData,
            maxAttendees: maxParsed,
            year,
            month,
            typeLabel: typeConfig.label
          };
        }
        return ev;
      }));
      setActionSuccessMessage('Actividad actualizada exitosamente en la agenda oficial.');
    } else {
      // Create
      const newEvent = {
        id: `agenda-${Date.now()}`,
        ...formData,
        maxAttendees: maxParsed,
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
      setActionSuccessMessage('Nueva actividad creada y agendada en el cronograma institucional.');
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
      maxAttendees: event.maxAttendees || '',
      status: event.status || 'confirmado'
    });
    setIsCreateModalOpen(true);
  };

  // Open New Modal
  const openNewModal = () => {
    setEditingEvent(null);
    setFormData({
      title: '',
      type: 'institucional',
      typeLabel: 'Institucional & Gala',
      date: new Date().toISOString().split('T')[0],
      timeStart: '09:00',
      timeEnd: '12:00',
      location: 'Sede Institucional CGEM / Centro Histórico, Mérida',
      isVirtual: false,
      virtualLink: '',
      organizer: 'Presidencia & Dirección Ejecutiva',
      description: '',
      maxAttendees: '',
      status: 'confirmado'
    });
    setIsCreateModalOpen(true);
  };

  // =========================================================================
  // VIEW 1: LIGHT MODE LOGIN SCREEN (SI NO ESTÁ AUTENTICADO)
  // =========================================================================
  if (!currentUser) {
    return (
      <div className="min-h-screen bg-[#fcfbf9] text-slate-800 flex flex-col justify-center items-center px-4 py-16 selection:bg-amber-500 selection:text-white relative">
        
        {/* Subtle decorative warm background blobs */}
        <div className="absolute top-12 left-1/2 -translate-x-1/2 w-96 h-96 bg-amber-200/40 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-10 right-10 w-80 h-80 bg-orange-100/60 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-xl w-full relative z-10">
          
          {/* Header */}
          <div className="text-center mb-8 space-y-3">
            <div className="inline-flex items-center justify-center w-20 h-20 rounded-3xl bg-white border-2 border-amber-300 p-2 shadow-xl shadow-amber-900/5 mb-1">
              <img 
                src="/logo-merida-gastronomica.png" 
                alt="Cámara Gastronómica del Estado Mérida" 
                className="w-full h-full object-contain"
              />
            </div>
            
            <div>
              <span className="text-[11px] font-extrabold uppercase tracking-[0.25em] px-3.5 py-1 rounded-full bg-amber-100 text-amber-900 border border-amber-300 font-sans">
                Acceso Privado &bull; Nivel Directivo
              </span>
              <h1 className="font-serif font-black text-3xl sm:text-4xl uppercase tracking-wider text-slate-900 mt-3">
                Portal Junta Directiva
              </h1>
              <p className="text-xs text-slate-600 mt-1 max-w-md mx-auto font-sans leading-relaxed">
                Cámara Gastronómica del Estado Mérida &bull; Plataforma Oficial de Agenda, Planificación Estratégica y Coordinación
              </p>
            </div>
          </div>

          {/* Login Form Box - Clean Warm White */}
          <div className="bg-white/95 backdrop-blur-xl border border-slate-200 rounded-3xl p-6 sm:p-9 shadow-2xl shadow-slate-900/5">
            
            {loginError && (
              <div className="mb-6 p-4 rounded-2xl bg-rose-50 border border-rose-200 text-rose-800 text-xs flex items-start gap-3 animate-fadeIn">
                <AlertCircle className="w-5 h-5 shrink-0 mt-0.5 text-rose-600" />
                <div className="leading-relaxed font-sans">{loginError}</div>
              </div>
            )}

            <form onSubmit={handleLogin} className="space-y-5">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2 font-sans">
                  Correo Electrónico Institucional
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-amber-600 absolute left-4 top-1/2 -translate-y-1/2" />
                  <input
                    type="email"
                    required
                    value={emailInput}
                    onChange={(e) => setEmailInput(e.target.value)}
                    placeholder="ej: directivo@camaragastronomicamerida.org"
                    className="w-full pl-11 pr-4 py-3.5 rounded-xl bg-slate-50 border border-slate-300 text-slate-900 placeholder-slate-400 text-sm focus:outline-none focus:border-amber-500 focus:bg-white focus:ring-2 focus:ring-amber-500/20 transition-all font-sans"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2 font-sans">
                  Contraseña de Acceso
                </label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-amber-600 absolute left-4 top-1/2 -translate-y-1/2" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={passwordInput}
                    onChange={(e) => setPasswordInput(e.target.value)}
                    placeholder="••••••••••"
                    className="w-full pl-11 pr-11 py-3.5 rounded-xl bg-slate-50 border border-slate-300 text-slate-900 placeholder-slate-400 text-sm focus:outline-none focus:border-amber-500 focus:bg-white focus:ring-2 focus:ring-amber-500/20 transition-all font-sans"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  disabled={isLoggingIn}
                  className="w-full py-4 px-6 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-slate-950 font-serif font-black text-xs uppercase tracking-widest flex items-center justify-center gap-2 shadow-lg shadow-amber-500/20 transition-all disabled:opacity-50 active:scale-98"
                >
                  <ShieldCheck className="w-4 h-4 text-slate-950" />
                  <span>{isLoggingIn ? 'Verificando...' : 'Ingresar al Portal Directivo'}</span>
                </button>
              </div>
            </form>

          </div>

          <div className="text-center mt-6">
            <button
              onClick={() => onNavigate ? onNavigate('home') : (window.location.href = '/')}
              className="text-xs text-slate-600 hover:text-amber-700 font-semibold transition-colors underline font-sans"
            >
              &larr; Volver al Portal Principal de Mérida Gastronómica
            </button>
          </div>

        </div>
      </div>
    );
  }

  // =========================================================================
  // VIEW 2: AUTHENTICATED BOARD DASHBOARD (LIGHT THEME)
  // =========================================================================
  return (
    <div className="min-h-screen bg-[#fcfbf9] text-slate-800 pb-24 selection:bg-amber-500 selection:text-white">
      
      {/* Top Banner (Clean Warm Luxury Light Theme) */}
      <div className="bg-white border-b border-slate-200 pt-28 pb-8 px-4 sm:px-6 lg:px-8 shadow-sm">
        <div className="max-w-7xl mx-auto">
          
          {/* Top Row: User Card & Actions */}
          <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6 pb-6 border-b border-slate-100">
            
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-amber-400 to-amber-600 p-1 flex items-center justify-center shadow-lg shadow-amber-500/15 shrink-0 border border-amber-300">
                <ShieldCheck className="w-9 h-9 text-slate-950" />
              </div>

              <div>
                <div className="flex flex-wrap items-center gap-2 mb-1">
                  <span className="text-[10px] font-extrabold uppercase tracking-widest px-2.5 py-0.5 rounded-full bg-amber-100 text-amber-900 border border-amber-300 font-sans">
                    {currentUser.roleCategory} &bull; {currentUser.role}
                  </span>
                  {currentUser.isAdminLevel && (
                    <span className="text-[10px] font-extrabold uppercase tracking-widest px-2.5 py-0.5 rounded-full bg-sky-100 text-sky-900 border border-sky-300 font-sans">
                      Gestión Total / Administrador
                    </span>
                  )}
                </div>

                <h1 className="font-serif font-black text-2xl sm:text-3xl text-slate-900 uppercase tracking-wide">
                  {currentUser.name}
                </h1>
                
                <div className="flex flex-wrap items-center gap-3 text-xs text-slate-600 mt-1 font-sans">
                  <span className="font-mono text-amber-900 font-bold bg-amber-50 px-2 py-0.5 rounded border border-amber-200">{currentUser.ci}</span>
                  <span>&bull;</span>
                  <span className="font-medium">{currentUser.email}</span>
                  <span>&bull;</span>
                  <span className="text-emerald-700 font-bold flex items-center gap-1">
                    <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                    Sesión Directiva Activa
                  </span>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-3 w-full sm:w-auto">
              {currentUser.isAdminLevel && (
                <button
                  onClick={openNewModal}
                  className="flex-1 sm:flex-initial py-3 px-5 rounded-xl bg-amber-500 hover:bg-amber-600 text-slate-950 font-serif font-black text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-md transition-all active:scale-98"
                >
                  <Plus className="w-4 h-4" />
                  <span>Nuevo Evento en Agenda</span>
                </button>
              )}

              <button
                onClick={handleLogout}
                className="py-3 px-4 rounded-xl bg-slate-100 hover:bg-rose-50 text-slate-700 hover:text-rose-700 border border-slate-200 text-xs font-bold flex items-center gap-1.5 transition-all"
                title="Cerrar Sesión Directiva"
              >
                <LogOut className="w-4 h-4" />
                <span className="hidden sm:inline">Cerrar Sesión</span>
              </button>
            </div>

          </div>

          {/* Success / Error Notification Bars */}
          {actionSuccessMessage && (
            <div className="mt-4 p-4 rounded-2xl bg-emerald-50 border border-emerald-300 text-emerald-900 text-xs flex items-center gap-3 animate-fadeIn shadow-sm">
              <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
              <span className="font-medium font-sans">{actionSuccessMessage}</span>
            </div>
          )}

          {actionErrorMessage && (
            <div className="mt-4 p-4 rounded-2xl bg-rose-50 border border-rose-300 text-rose-900 text-xs flex items-center gap-3 animate-fadeIn shadow-sm">
              <AlertTriangle className="w-5 h-5 text-rose-600 shrink-0" />
              <span className="font-bold font-sans">{actionErrorMessage}</span>
            </div>
          )}

          {/* Navigation Controls: Year, Month, Category Filter */}
          <div className="mt-6 space-y-4">
            
            {/* Year Selector + View Mode Switcher */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              
              {/* Year tabs */}
              <div className="flex items-center gap-2 bg-slate-100 p-1.5 rounded-2xl border border-slate-200">
                <span className="text-[11px] font-bold text-slate-600 uppercase tracking-wider px-3 font-sans">
                  Año de Planificación:
                </span>
                {[2026, 2027, 'all'].map((yr) => (
                  <button
                    key={yr}
                    onClick={() => setSelectedYear(yr)}
                    className={`py-1.5 px-4 rounded-xl text-xs font-serif font-black transition-all ${
                      selectedYear === yr
                        ? 'bg-amber-500 text-slate-950 shadow-sm'
                        : 'text-slate-600 hover:text-slate-900 hover:bg-white'
                    }`}
                  >
                    {yr === 'all' ? 'Ver Todos' : yr}
                  </button>
                ))}
              </div>

              {/* View Mode Buttons */}
              <div className="flex items-center gap-1 bg-slate-100 p-1.5 rounded-2xl border border-slate-200">
                <button
                  onClick={() => setViewMode('timeline')}
                  className={`py-1.5 px-3.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 font-sans ${
                    viewMode === 'timeline'
                      ? 'bg-white text-amber-800 border border-amber-300 shadow-sm font-extrabold'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  <Clock className="w-3.5 h-3.5 text-amber-600" />
                  <span>Agenda Cronológica</span>
                </button>

                <button
                  onClick={() => setViewMode('board_list')}
                  className={`py-1.5 px-3.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 font-sans ${
                    viewMode === 'board_list'
                      ? 'bg-white text-amber-800 border border-amber-300 shadow-sm font-extrabold'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  <Users className="w-3.5 h-3.5 text-amber-600" />
                  <span>Junta Directiva</span>
                </button>
              </div>

            </div>

            {/* Month Ribbon */}
            <div className="flex items-center gap-1 overflow-x-auto pb-2 scrollbar-thin">
              <button
                onClick={() => setSelectedMonth('all')}
                className={`py-2 px-3.5 rounded-xl text-xs font-bold uppercase tracking-wider whitespace-nowrap transition-all font-sans ${
                  selectedMonth === 'all'
                    ? 'bg-amber-500 text-slate-950 font-black shadow-sm'
                    : 'bg-white text-slate-600 hover:text-slate-900 border border-slate-200 hover:border-slate-300'
                }`}
              >
                Todos los Meses
              </button>

              {MONTHS.map((m) => (
                <button
                  key={m.num}
                  onClick={() => setSelectedMonth(m.num)}
                  className={`py-2 px-3.5 rounded-xl text-xs font-bold uppercase tracking-wider whitespace-nowrap transition-all font-sans ${
                    selectedMonth === m.num
                      ? 'bg-amber-500 text-slate-950 font-black shadow-sm'
                      : 'bg-white text-slate-600 hover:text-slate-900 border border-slate-200 hover:border-slate-300'
                  }`}
                >
                  {m.name}
                </button>
              ))}
            </div>

            {/* Category Filter Chips */}
            <div className="flex items-center gap-2 overflow-x-auto pb-1">
              <span className="text-[10px] font-bold uppercase tracking-widest text-slate-500 shrink-0 flex items-center gap-1 font-sans">
                <ListFilter className="w-3 h-3 text-slate-400" />
                Filtrar:
              </span>
              {EVENT_TYPES.map((type) => (
                <button
                  key={type.id}
                  onClick={() => setActiveCategoryFilter(type.id)}
                  className={`py-1.5 px-3 rounded-xl text-xs font-semibold whitespace-nowrap transition-all border font-sans ${
                    activeCategoryFilter === type.id
                      ? 'bg-amber-100 text-amber-900 border-amber-400 font-bold shadow-xs'
                      : 'bg-white text-slate-600 border-slate-200 hover:border-slate-300 hover:text-slate-900'
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
        
        {/* VIEW MODE 1: TIMELINE / CHRONOLOGICAL */}
        {viewMode === 'timeline' && (
          <div className="space-y-6">
            
            {/* Header / Counter */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <CalendarDays className="w-5 h-5 text-amber-600" />
                <h2 className="font-serif font-black text-xl sm:text-2xl text-slate-900 uppercase tracking-wider">
                  Agenda Ejecutiva & Compromisos Confirmados
                </h2>
                <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-amber-100 text-amber-900 border border-amber-300 font-sans">
                  {filteredEvents.length} {filteredEvents.length === 1 ? 'actividad' : 'actividades'}
                </span>
              </div>

              {currentUser.isAdminLevel && (
                <button
                  onClick={openNewModal}
                  className="text-xs text-amber-800 hover:text-amber-900 font-bold flex items-center gap-1 font-sans underline"
                >
                  <Plus className="w-3.5 h-3.5 text-amber-600" />
                  <span>Crear otra actividad</span>
                </button>
              )}
            </div>

            {/* Events List */}
            {filteredEvents.length === 0 ? (
              <div className="p-12 text-center rounded-3xl bg-white border border-slate-200 space-y-3 shadow-sm">
                <CalendarIcon className="w-12 h-12 text-slate-300 mx-auto" />
                <h3 className="font-serif font-black text-lg text-slate-700 uppercase">
                  No hay actividades con los filtros seleccionados
                </h3>
                <p className="text-xs text-slate-500 max-w-md mx-auto font-sans">
                  Seleccione otro mes o año, o utilice el botón superior para registrar un nuevo compromiso en el cronograma.
                </p>
                {currentUser.isAdminLevel && (
                  <button
                    onClick={openNewModal}
                    className="mt-2 py-2.5 px-4 rounded-xl bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold text-xs shadow-sm font-sans"
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
                  const isFull = isEventAtCapacity(event);
                  const isLoadingRsvp = rsvpLoadingEventId === event.id;

                  // Parse date for visual badge
                  const [y, m, d] = event.date.split('-');
                  const monthName = MONTHS.find(mon => mon.num === parseInt(m, 10))?.name || m;

                  return (
                    <div 
                      key={event.id}
                      className={`p-6 sm:p-7 rounded-3xl border transition-all relative overflow-hidden bg-white shadow-sm hover:shadow-md ${
                        confirmed
                          ? 'border-amber-400 ring-2 ring-amber-400/20 bg-gradient-to-br from-white via-amber-50/20 to-orange-50/30'
                          : 'border-slate-200 hover:border-slate-300'
                      }`}
                    >
                      {/* Left vertical accent */}
                      <div className={`absolute top-0 left-0 bottom-0 w-2 ${
                        event.type === 'reunion' ? 'bg-amber-500' :
                        event.type === 'medios' ? 'bg-sky-500' :
                        event.type === 'capacitacion' ? 'bg-purple-500' :
                        event.type === 'gremial' ? 'bg-emerald-500' : 'bg-indigo-600'
                      }`} />

                      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start pl-2">
                        
                        {/* Date Column */}
                        <div className="lg:col-span-2 flex lg:flex-col items-center lg:items-start gap-3 sm:gap-2">
                          <div className="text-center p-3 rounded-2xl bg-slate-50 border border-slate-200 min-w-[75px] shadow-xs">
                            <span className="text-[10px] font-extrabold uppercase tracking-widest text-amber-800 block font-sans">
                              {monthName.slice(0, 3)}
                            </span>
                            <span className="font-serif font-black text-2xl sm:text-3xl text-slate-900 block leading-tight">
                              {d}
                            </span>
                            <span className="text-[10px] text-slate-500 font-mono block">
                              {y}
                            </span>
                          </div>

                          <span className="text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full border bg-slate-100 text-slate-800 border-slate-200 font-sans">
                            {event.typeLabel || event.type}
                          </span>
                        </div>

                        {/* Details Column */}
                        <div className="lg:col-span-7 space-y-3">
                          
                          <div>
                            <div className="flex flex-wrap items-center gap-2 mb-1">
                              <h3 className="font-serif font-black text-lg sm:text-xl text-slate-900 leading-snug">
                                {event.title}
                              </h3>
                              
                              {/* Capacity Badge */}
                              {event.maxAttendees ? (
                                <span className={`text-[10px] font-extrabold uppercase tracking-wider px-2.5 py-0.5 rounded-full border font-sans ${
                                  isFull 
                                    ? 'bg-rose-100 text-rose-800 border-rose-300' 
                                    : 'bg-emerald-100 text-emerald-800 border-emerald-300'
                                }`}>
                                  {isFull ? 'Cupo Completo' : `${attendeeCount} / ${event.maxAttendees} cupos`}
                                </span>
                              ) : (
                                <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-slate-100 text-slate-600 border border-slate-200 font-sans">
                                  Sin límite de cupo
                                </span>
                              )}
                            </div>

                            <p className="text-xs text-slate-600 mt-1 leading-relaxed font-sans">
                              {event.description}
                            </p>
                          </div>

                          {/* Time & Location Metadata */}
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-slate-600 pt-1 font-sans">
                            <div className="flex items-center gap-2">
                              <Clock className="w-4 h-4 text-amber-600 shrink-0" />
                              <span className="font-medium">{event.timeStart || 'Por confirmar'} - {event.timeEnd || ''}</span>
                            </div>

                            <div className="flex items-center gap-2">
                              <MapPin className="w-4 h-4 text-amber-600 shrink-0" />
                              <span className="font-medium truncate" title={event.location}>
                                {event.isVirtual ? 'Sesión Virtual' : event.location}
                              </span>
                            </div>

                            <div className="flex items-center gap-2 sm:col-span-2">
                              <Users className="w-4 h-4 text-sky-600 shrink-0" />
                              <span>Organiza / Convoca: <strong className="text-slate-800">{event.organizer}</strong></span>
                            </div>
                          </div>

                          {/* Confirmed Attendees list */}
                          <div className="pt-2 border-t border-slate-100">
                            <div className="flex items-center justify-between text-xs text-slate-600 mb-1.5 font-sans">
                              <span className="font-bold uppercase tracking-wider text-[11px] text-slate-700 flex items-center gap-1.5">
                                <UserCheck className="w-3.5 h-3.5 text-emerald-600" />
                                Asistencias Confirmadas ({attendeeCount}):
                              </span>
                              {event.maxAttendees && (
                                <span className="text-[10px] text-slate-500">
                                  Máximo permitido: <strong>{event.maxAttendees} directivos</strong>
                                </span>
                              )}
                            </div>

                            {attendeeCount === 0 ? (
                              <span className="text-[11px] text-slate-400 italic font-sans">
                                Aún no hay confirmaciones registradas.
                              </span>
                            ) : (
                              <div className="flex flex-wrap items-center gap-1.5">
                                {event.confirmedAttendees.map((att, idx) => (
                                  <span 
                                    key={idx}
                                    className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-slate-50 border border-slate-200 text-[11px] text-slate-800 font-medium font-sans"
                                  >
                                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                                    <span>{att.name}</span>
                                    <span className="text-slate-500 text-[10px]">({att.role})</span>
                                  </span>
                                ))}
                              </div>
                            )}
                          </div>

                        </div>

                        {/* Actions Column */}
                        <div className="lg:col-span-3 flex flex-col justify-between h-full gap-4 pt-2 lg:pt-0 lg:border-l lg:border-slate-100 lg:pl-6">
                          
                          {/* "VOY A ASISTIR" RSVP BUTTON */}
                          <div className="space-y-2">
                            <button
                              onClick={() => handleToggleAttendance(event)}
                              disabled={isLoadingRsvp || (!confirmed && isFull)}
                              className={`w-full py-3 px-4 rounded-xl font-serif font-black text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-sm transition-all active:scale-98 ${
                                confirmed
                                  ? 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-emerald-700/20'
                                  : isFull
                                    ? 'bg-slate-200 text-slate-400 cursor-not-allowed border border-slate-300'
                                    : 'bg-amber-500 hover:bg-amber-600 text-slate-950 shadow-amber-500/20'
                              }`}
                            >
                              {isLoadingRsvp ? (
                                <span>Procesando...</span>
                              ) : confirmed ? (
                                <>
                                  <CheckCircle2 className="w-4 h-4 text-white" />
                                  <span>✓ Asistencia Confirmada</span>
                                </>
                              ) : isFull ? (
                                <>
                                  <UserX className="w-4 h-4 text-slate-400" />
                                  <span>Cupo Agotado</span>
                                </>
                              ) : (
                                <>
                                  <Check className="w-4 h-4 text-slate-950" />
                                  <span>Voy a Asistir</span>
                                </>
                              )}
                            </button>

                            <p className="text-[10px] text-center text-slate-500 font-sans leading-tight">
                              {confirmed 
                                ? 'Notificación enviada a tu correo y Dirección Ejecutiva.' 
                                : isFull 
                                  ? 'No hay disponibilidad: límite alcanzado.'
                                  : 'Haz clic para reservar tu participación formal.'}
                            </p>
                          </div>

                          {/* Admin Edit / Delete Controls (Presidente & Director Ejecutivo) */}
                          {currentUser.isAdminLevel && (
                            <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
                              <button
                                onClick={() => openEditModal(event)}
                                className="p-2 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 hover:text-slate-900 transition-colors text-xs flex items-center gap-1 font-bold font-sans"
                                title="Editar actividad"
                              >
                                <Edit3 className="w-3.5 h-3.5 text-amber-700" />
                                <span>Editar</span>
                              </button>

                              <button
                                onClick={() => handleDeleteEvent(event.id)}
                                className="p-2 rounded-lg bg-slate-100 hover:bg-rose-100 text-slate-600 hover:text-rose-700 transition-colors text-xs flex items-center gap-1 font-bold font-sans"
                                title="Eliminar actividad"
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

        {/* VIEW MODE 2: BOARD DIRECTORY */}
        {viewMode === 'board_list' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="font-serif font-black text-xl sm:text-2xl text-slate-900 uppercase tracking-wider">
                  Directorio Institucional de la Junta Directiva
                </h2>
                <p className="text-xs text-slate-600 font-sans">
                  Cámara Gastronómica del Estado Mérida &bull; Estructura Oficial
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {BOARD_MEMBERS_DATA.map((member) => {
                const isMe = currentUser.id === member.id;
                return (
                  <div 
                    key={member.id}
                    className={`p-6 rounded-3xl border transition-all bg-white shadow-sm ${
                      isMe 
                        ? 'border-amber-500 ring-2 ring-amber-400/20 bg-gradient-to-br from-white to-amber-50/40' 
                        : 'border-slate-200'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-3 mb-3">
                      <span className="text-[10px] font-extrabold uppercase tracking-widest px-2.5 py-0.5 rounded-full bg-amber-100 text-amber-900 border border-amber-300 font-sans">
                        {member.roleCategory}
                      </span>
                      {member.isAdminLevel && (
                        <span className="text-[10px] font-extrabold uppercase tracking-widest px-2 py-0.5 rounded bg-sky-100 text-sky-900 border border-sky-300 font-sans">
                          Admin
                        </span>
                      )}
                    </div>

                    <h4 className="font-serif font-black text-lg text-slate-900">
                      {member.name}
                    </h4>
                    <p className="text-xs font-bold text-amber-800 mt-0.5 font-sans">
                      {member.role}
                    </p>

                    <div className="mt-4 pt-3 border-t border-slate-100 space-y-1.5 text-xs text-slate-600 font-mono">
                      <div className="flex justify-between">
                        <span className="font-sans">Cédula:</span>
                        <span className="text-slate-900 font-bold">{member.ci}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="font-sans">Correo:</span>
                        <span className="text-slate-900 truncate max-w-[170px]" title={member.email}>{member.email}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="font-sans">Acceso:</span>
                        <span className={member.hasPasswordSet ? 'text-emerald-700 font-bold font-sans' : 'text-slate-400 font-sans'}>
                          {member.hasPasswordSet ? 'Habilitado' : 'Pre-registrado'}
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

      {/* CREATE / EDIT EVENT MODAL (ADMIN ONLY - LIGHT THEME) */}
      {isCreateModalOpen && currentUser.isAdminLevel && (
        <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto animate-fadeIn">
          <div className="bg-white border border-slate-200 rounded-3xl max-w-2xl w-full p-6 sm:p-8 shadow-2xl relative my-8 max-h-[90vh] overflow-y-auto">
            
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-2xl bg-amber-100 text-amber-800 border border-amber-300">
                  <CalendarDays className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-serif font-black text-xl text-slate-900 uppercase tracking-wider">
                    {editingEvent ? 'Editar Actividad en Agenda' : 'Crear Nueva Actividad Institucional'}
                  </h3>
                  <p className="text-xs text-slate-500 font-sans">
                    Junta Directiva &bull; Cámara Gastronómica del Estado Mérida
                  </p>
                </div>
              </div>

              <button
                onClick={() => setIsCreateModalOpen(false)}
                className="p-2 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-600 transition-colors"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSaveEvent} className="mt-6 space-y-4 text-xs font-sans">
              
              <div>
                <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Título de la Actividad / Evento *
                </label>
                <input
                  type="text"
                  required
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="ej: Conversaciones Institucionales con el IUPTM"
                  className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-300 text-slate-900 placeholder-slate-400 text-sm focus:outline-none focus:border-amber-500 focus:bg-white"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                    Tipo de Convocatoria *
                  </label>
                  <select
                    value={formData.type}
                    onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                    className="w-full px-3 py-3 rounded-xl bg-slate-50 border border-slate-300 text-slate-900 text-sm focus:outline-none focus:border-amber-500 focus:bg-white"
                  >
                    <option value="institucional">Institucional & Gala</option>
                    <option value="medios">Medios & Entrevista</option>
                    <option value="gremial">Encuentro Gremial</option>
                    <option value="capacitacion">Formación & Taller</option>
                    <option value="reunion">Reunión de Junta Directiva</option>
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                    Fecha Convocada *
                  </label>
                  <input
                    type="date"
                    required
                    value={formData.date}
                    onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                    className="w-full px-3 py-3 rounded-xl bg-slate-50 border border-slate-300 text-slate-900 text-sm focus:outline-none focus:border-amber-500 focus:bg-white"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                    Límite de Cupos (Opcional)
                  </label>
                  <input
                    type="number"
                    min="1"
                    max="50"
                    value={formData.maxAttendees}
                    onChange={(e) => setFormData({ ...formData, maxAttendees: e.target.value })}
                    placeholder="Vacío = Ilimitado"
                    className="w-full px-3 py-3 rounded-xl bg-slate-50 border border-slate-300 text-slate-900 text-sm focus:outline-none focus:border-amber-500 focus:bg-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                    Hora de Inicio
                  </label>
                  <input
                    type="time"
                    value={formData.timeStart}
                    onChange={(e) => setFormData({ ...formData, timeStart: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-300 text-slate-900 text-sm focus:outline-none focus:border-amber-500 focus:bg-white"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                    Hora de Culminación
                  </label>
                  <input
                    type="time"
                    value={formData.timeEnd}
                    onChange={(e) => setFormData({ ...formData, timeEnd: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-300 text-slate-900 text-sm focus:outline-none focus:border-amber-500 focus:bg-white"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Sede / Ubicación Física *
                </label>
                <input
                  type="text"
                  required
                  value={formData.location}
                  onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                  placeholder="ej: Hotel Venetur, Salón Bellavista, Mérida"
                  className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-300 text-slate-900 placeholder-slate-400 text-sm focus:outline-none focus:border-amber-500 focus:bg-white"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Organizador / Convocante
                </label>
                <input
                  type="text"
                  value={formData.organizer}
                  onChange={(e) => setFormData({ ...formData, organizer: e.target.value })}
                  placeholder="ej: Cámara de Turismo del Estado Mérida (CATUREM)"
                  className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-300 text-slate-900 placeholder-slate-400 text-sm focus:outline-none focus:border-amber-500 focus:bg-white"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Descripción / Puntos de Agenda
                </label>
                <textarea
                  rows={3}
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Detalles sobre el evento, vestimenta, asistentes convocados..."
                  className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-300 text-slate-900 placeholder-slate-400 text-sm focus:outline-none focus:border-amber-500 focus:bg-white"
                />
              </div>

              <div className="pt-4 flex items-center justify-end gap-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsCreateModalOpen(false)}
                  className="py-3 px-5 rounded-xl bg-slate-100 text-slate-700 hover:bg-slate-200 font-bold text-xs"
                >
                  Cancelar
                </button>

                <button
                  type="submit"
                  className="py-3 px-6 rounded-xl bg-amber-500 hover:bg-amber-600 text-slate-950 font-serif font-black text-xs uppercase tracking-widest flex items-center gap-2 shadow-md"
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
