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
  UserX,
  BookOpen,
  FolderPlus,
  ExternalLink,
  Layers,
  Calculator,
  Compass,
  FolderOpen,
  Phone,
  Search,
  MessageCircle,
  FileSpreadsheet,
  Copy,
  RefreshCw,
  DollarSign,
  Tag,
  GraduationCap,
  History,
  Ticket,
  Image as ImageIcon
} from 'lucide-react';
import { BOARD_MEMBERS_DATA, INITIAL_BOARD_AGENDA_DATA } from '../data/boardData';
import { LEGAL_DATA } from '../data/legalData';
import { INITIAL_DIRECTORY_DATA } from '../data/initialDirectoryData';
import { sendBoardAttendanceEmail } from '../lib/emailService';
import { supabase } from '../lib/supabaseClient';

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

  // Roles & Permissions
  const isPresident = currentUser?.id === 'dir-presidente' || 
    currentUser?.email?.toLowerCase() === 'dazajulio@gmail.com' || 
    (currentUser?.role && currentUser?.role.toLowerCase().includes('presidente') && !currentUser?.role.toLowerCase().includes('vicepresidente'));

  const isExecutiveDirector = currentUser?.id === 'dir-ejecutivo' || 
    currentUser?.id === 'dir-ejecutiva' || 
    currentUser?.email?.toLowerCase() === 'margiovi@gmail.com' || 
    (currentUser?.role && currentUser?.role.toLowerCase().includes('ejecutivo'));

  // Both President and Executive Director (and admin level) have full access to the Directorio de Agremiados
  const canAccessDirectory = currentUser?.isAdminLevel || isPresident || isExecutiveDirector;

  // Legal Resources State (Synchronized with localStorage)
  const [legalCategories, setLegalCategories] = useState(() => {
    try {
      const saved = localStorage.getItem('cgem_legal_resources_v2');
      if (saved) return JSON.parse(saved);
    } catch (e) {}
    return LEGAL_DATA.categories;
  });

  // Save legal categories whenever changed
  useEffect(() => {
    try {
      localStorage.setItem('cgem_legal_resources_v2', JSON.stringify(legalCategories));
      window.dispatchEvent(new Event('storage'));
    } catch (e) {}
  }, [legalCategories]);

  // =========================================================================
  // DIRECTORIO DE AGREMIADOS STATE (SUPABASE + LOCALSTORAGE RESILIENCE)
  // =========================================================================
  const [directoryMembers, setDirectoryMembers] = useState(() => {
    try {
      const saved = localStorage.getItem('cgem_directorio_agremiados');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed.filter(item => item && item.id !== 'cgm-dir-001').map(item => {
            if (item.codigo_afiliado === 'CGM-2026-001' && item.email === 'kaffia@meridagastronomica.com') {
              return {
                ...item,
                email: 'cafe.kaffia@gmail.com',
                direccion_completa: 'Av. 8 entre Calles 24 y 25, Sector Las Heroínas, Casco Central, Mérida',
                monto_cuota_mensual: 10
              };
            }
            return item;
          });
        }
      }
    } catch (e) {}
    return INITIAL_DIRECTORY_DATA;
  });

  const [isLoadingDirectory, setIsLoadingDirectory] = useState(false);
  const [directorySearch, setDirectorySearch] = useState('');
  const [directoryCategoryFilter, setDirectoryCategoryFilter] = useState('all');
  const [directoryStatusFilter, setDirectoryStatusFilter] = useState('all');
  const [isMemberModalOpen, setIsMemberModalOpen] = useState(false);
  const [editingMember, setEditingMember] = useState(null);
  const [selectedMemberDetail, setSelectedMemberDetail] = useState(null);

  const [memberFormData, setMemberFormData] = useState({
    codigo_afiliado: '',
    nombre_establecimiento: '',
    categoria_negocio: 'Empresas (5 a 19 empleados)',
    representante_legal: '',
    rif_cedula: '',
    telefono: '',
    email: '',
    direccion_completa: '',
    municipio: 'Libertador',
    instagram: '',
    sitio_web: '',
    numero_empleados: 5,
    estado_solvencia: 'Solvente (Activo)',
    monto_inscripcion: 30,
    monto_cuota_mensual: 10,
    observaciones: ''
  });

  // Fetch Directory from Supabase on mount or refresh, plus sync any public web registrations
  const fetchDirectoryFromSupabase = async () => {
    if (!supabase) return;
    try {
      setIsLoadingDirectory(true);
      
      // 1. Fetch from public.directorio_agremiados
      const { data: dirData, error: dirError } = await supabase
        .from('directorio_agremiados')
        .select('*')
        .order('created_at', { ascending: false });

      if (dirError) {
        console.warn('Supabase directorio notice:', dirError.message);
      }

      let mergedData = (dirData && Array.isArray(dirData)) ? [...dirData] : [];

      // 2. Fetch from solicitudes_afiliacion to auto-sync any web registrations
      try {
        const { data: solData, error: solError } = await supabase
          .from('solicitudes_afiliacion')
          .select('*')
          .order('created_at', { ascending: false });

        if (!solError && solData && solData.length > 0) {
          for (const sol of solData) {
            const alreadyInDirectory = mergedData.some(m => 
              (sol.codigo_afiliado && m.codigo_afiliado === sol.codigo_afiliado) ||
              (sol.rif && m.rif_cedula === sol.rif) ||
              (sol.correo && m.email && m.email.toLowerCase() === sol.correo.toLowerCase())
            );

            if (!alreadyInDirectory) {
              const newEntry = {
                codigo_afiliado: sol.codigo_afiliado || `CGM-2026-${Math.floor(Math.random() * 899 + 100)}`,
                nombre_establecimiento: sol.nombre_comercial || 'Establecimiento Solicitante',
                categoria_negocio: sol.tipo_negocio || 'Empresas (5 a 19 empleados)',
                representante_legal: sol.titular_propietario || 'Representante Legal',
                rif_cedula: sol.rif || 'Pendiente',
                telefono: sol.telefono || 'Sin teléfono',
                email: sol.correo || 'sin-correo@meridagastronomica.com',
                direccion_completa: `${sol.direccion || ''}${sol.ciudad_poblacion ? `, ${sol.ciudad_poblacion}` : ''}`,
                municipio: sol.municipio || 'Libertador',
                instagram: sol.instagram || '',
                sitio_web: '',
                numero_empleados: sol.tipo_negocio?.includes('20 o más') ? 20 : sol.tipo_negocio?.includes('5 y 19') ? 8 : 2,
                estado_solvencia: 'En Trámite (Verificación Pago)',
                monto_inscripcion: sol.tipo_negocio?.includes('20 o más') ? 50 : sol.tipo_negocio?.includes('5 y 19') ? 30 : 20,
                monto_cuota_mensual: sol.tipo_negocio?.includes('20 o más') ? 20 : 10,
                fecha_registro: sol.created_at || new Date().toISOString(),
                observaciones: `Registro Web: Ref. ${sol.referencia_pago_movil || 'N/A'} - Banco: ${sol.banco_pago_movil || 'Provincial'} - Tel. Pagador: ${sol.telefono_pagador || ''} - Monto: Bs. ${sol.monto_bs || '0'}`
              };

              // Persist into directorio_agremiados
              try {
                const { data: inserted } = await supabase
                  .from('directorio_agremiados')
                  .insert([newEntry])
                  .select();
                if (inserted && inserted[0]) {
                  mergedData.push(inserted[0]);
                } else {
                  mergedData.push(newEntry);
                }
              } catch (insErr) {
                mergedData.push(newEntry);
              }
            }
          }
        }
      } catch (solEx) {
        console.warn('Sync solicitudes note:', solEx);
      }

      // Filter out any mock/placeholder items and save
      const cleanList = mergedData.filter(item => item && item.id !== 'cgm-dir-001');
      setDirectoryMembers(cleanList);
      localStorage.setItem('cgem_directorio_agremiados', JSON.stringify(cleanList));

    } catch (err) {
      console.warn('Supabase connection note:', err);
    } finally {
      setIsLoadingDirectory(false);
    }
  };

  useEffect(() => {
    if (canAccessDirectory) {
      fetchDirectoryFromSupabase();
    }
  }, [canAccessDirectory]);

  // Calendar View Filters & Navigation
  const [selectedYear, setSelectedYear] = useState(2026);
  const [selectedMonth, setSelectedMonth] = useState('all'); // 'all' or 1..12
  const [activeCategoryFilter, setActiveCategoryFilter] = useState('all');
  const [viewMode, setViewMode] = useState('timeline'); // timeline | directorio | completed_report | courses_management | events_management | board_list | legal_resources

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

  // =========================================================================
  // 1. COMPLETED EVENTS REPORT (ROLLING 90 DAYS WITH AUTO-CLEAN)
  // =========================================================================
  const [completedBoardEvents, setCompletedBoardEvents] = useState(() => {
    try {
      const saved = localStorage.getItem('cgem_completed_board_events');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) {
          const ninetyDaysAgo = Date.now() - 90 * 24 * 60 * 60 * 1000;
          return parsed.filter(ev => {
            const time = ev.completedAt ? new Date(ev.completedAt).getTime() : new Date(ev.date).getTime();
            return time >= ninetyDaysAgo;
          });
        }
      }
    } catch (e) {}
    return [];
  });

  // Auto-clean and persist completed events
  useEffect(() => {
    try {
      const ninetyDaysAgo = Date.now() - 90 * 24 * 60 * 60 * 1000;
      const cleanList = completedBoardEvents.filter(ev => {
        const time = ev.completedAt ? new Date(ev.completedAt).getTime() : new Date(ev.date).getTime();
        return time >= ninetyDaysAgo;
      });
      localStorage.setItem('cgem_completed_board_events', JSON.stringify(cleanList));
    } catch (e) {}
  }, [completedBoardEvents]);

  // =========================================================================
  // 2. OFFICIAL COURSES MANAGEMENT (PRESIDENCY & DIRECTORS)
  // =========================================================================
  const [officialCourses, setOfficialCourses] = useState(() => {
    try {
      const saved = localStorage.getItem('cgem_official_courses');
      if (saved) return JSON.parse(saved);
    } catch (e) {}
    return [];
  });

  useEffect(() => {
    try {
      localStorage.setItem('cgem_official_courses', JSON.stringify(officialCourses));
      window.dispatchEvent(new Event('cgem_courses_updated'));
    } catch (e) {}
  }, [officialCourses]);

  const [isCourseModalOpen, setIsCourseModalOpen] = useState(false);
  const [editingCourse, setEditingCourse] = useState(null);
  const [courseFormData, setCourseFormData] = useState({
    title: '',
    hours: '16 Horas Académicas',
    dates: '',
    schedule: '09:00 AM - 01:00 PM',
    instructor: '',
    location: 'Sede CGEM / Laboratorio ULA',
    isOnline: false,
    category: 'Formación Gastronómica',
    description: '',
    spots: 25,
    priceMemberText: 'Gratuito para Miembros Solventes',
    priceGeneralUSD: 35,
    image: 'https://images.unsplash.com/photo-1556910103-1c02745aae4d?auto=format&fit=crop&w=800&q=80'
  });

  // =========================================================================
  // 3. OFFICIAL PUBLIC EVENTS & FESTIVALS MANAGEMENT (PRESIDENCY)
  // =========================================================================
  const [officialEvents, setOfficialEvents] = useState(() => {
    try {
      const saved = localStorage.getItem('cgem_official_events');
      if (saved) return JSON.parse(saved);
    } catch (e) {}
    return [];
  });

  useEffect(() => {
    try {
      localStorage.setItem('cgem_official_events', JSON.stringify(officialEvents));
      window.dispatchEvent(new Event('cgem_events_updated'));
    } catch (e) {}
  }, [officialEvents]);

  const [isPublicEventModalOpen, setIsPublicEventModalOpen] = useState(false);
  const [editingPublicEvent, setEditingPublicEvent] = useState(null);
  const [publicEventFormData, setPublicEventFormData] = useState({
    title: '',
    date: new Date().toISOString().split('T')[0],
    month: 'Octubre',
    location: 'Centro Histórico / Mérida',
    category: 'Festival Gastronómico',
    badge: 'Evento Oficial 2026',
    accessType: 'member_free_paid_general', // 'free' | 'member_free_paid_general' | 'paid'
    priceGeneralUSD: 10,
    priceMemberUSD: 0,
    ticketPrice: 'Gratuito Miembros / $10 USD General',
    isPagoMovilEnabled: true,
    pagoMovilBank: '0108 - Banco Provincial',
    pagoMovilCi: 'V-12517086',
    pagoMovilPhone: '0414-8817137',
    description: '',
    highlights: ['Catas guiadas y degustaciones', 'Masterclasses con chefs invitados'],
    image: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=1200&q=80'
  });

  // =========================================================================
  // 4. VINCULACIONES TURÍSTICAS & SERVICIOS STATE (PRESIDENCY)
  // =========================================================================
  const [touristServices, setTouristServices] = useState(() => {
    try {
      const saved = localStorage.getItem('cgem_tourist_services');
      if (saved) return JSON.parse(saved);
    } catch (e) {}
    return [];
  });

  useEffect(() => {
    try {
      localStorage.setItem('cgem_tourist_services', JSON.stringify(touristServices));
      window.dispatchEvent(new Event('cgm_tourist_services_updated'));
    } catch (e) {}
  }, [touristServices]);

  const [isTouristServiceModalOpen, setIsTouristServiceModalOpen] = useState(false);
  const [editingTouristService, setEditingTouristService] = useState(null);
  const [touristServiceFormData, setTouristServiceFormData] = useState({
    title: '',
    category: 'Movilidad & Transporte VIP',
    badge: 'Operador Certificado',
    image: '',
    rating: 5.0,
    priceFrom: '$50',
    unit: 'por persona',
    description: '',
    features: ['Atención personalizada', 'Guía bilingüe certificado', 'Póliza de seguro incluida'],
    contactPhone: '+58 412 6408957',
    contactWhatsapp: '+58 414 8817137',
    location: 'Mérida, Venezuela'
  });

  // Legal Document Creation & Editing Modal State (President Only)
  const [isLegalModalOpen, setIsLegalModalOpen] = useState(false);
  const [editingLegalDoc, setEditingLegalDoc] = useState(null);
  const [legalFormData, setLegalFormData] = useState({
    title: '',
    categoryId: 'fiscal',
    categoryTag: 'SENIAT Nacional',
    format: 'PDF',
    size: '1.5 MB',
    dateUpdated: 'Vigente 2026',
    summary: '',
    fileUrl: '',
    isOfficial: true
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

  // Open Edit Modal for Agenda
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

  // Open New Modal for Agenda
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
  // COURSE MANAGEMENT HANDLERS (PRESIDENCY & DIRECTORS)
  // =========================================================================
  const openNewCourseModal = () => {
    setEditingCourse(null);
    setCourseFormData({
      title: '',
      hours: '16 Horas Académicas',
      dates: '',
      schedule: '09:00 AM - 01:00 PM',
      instructor: '',
      location: 'Sede CGEM / Laboratorio ULA',
      isOnline: false,
      category: 'Formación Gastronómica',
      description: '',
      spots: 25,
      priceMemberText: 'Gratuito para Miembros Solventes',
      priceGeneralUSD: 35,
      image: 'https://images.unsplash.com/photo-1556910103-1c02745aae4d?auto=format&fit=crop&w=800&q=80'
    });
    setIsCourseModalOpen(true);
  };

  const openEditCourseModal = (course) => {
    setEditingCourse(course);
    setCourseFormData({
      title: course.title || '',
      hours: course.hours || '16 Horas Académicas',
      dates: course.dates || '',
      schedule: course.schedule || '09:00 AM - 01:00 PM',
      instructor: course.instructor || '',
      location: course.location || 'Sede CGEM / Laboratorio ULA',
      isOnline: course.isOnline || false,
      category: course.category || 'Formación Gastronómica',
      description: course.description || '',
      spots: course.spots || 25,
      priceMemberText: course.priceMemberText || 'Gratuito para Miembros Solventes',
      priceGeneralUSD: course.priceGeneralUSD || 35,
      image: course.image || 'https://images.unsplash.com/photo-1556910103-1c02745aae4d?auto=format&fit=crop&w=800&q=80'
    });
    setIsCourseModalOpen(true);
  };

  const handleSaveCourse = (e) => {
    e.preventDefault();
    if (editingCourse) {
      const updated = officialCourses.map(c => c.id === editingCourse.id ? { ...c, ...courseFormData } : c);
      setOfficialCourses(updated);
      setActionSuccessMessage(`Curso "${courseFormData.title}" actualizado exitosamente.`);
    } else {
      const newCourse = {
        id: `course-${Date.now()}`,
        ...courseFormData,
        created_at: new Date().toISOString()
      };
      setOfficialCourses([newCourse, ...officialCourses]);
      setActionSuccessMessage(`Nuevo curso "${courseFormData.title}" publicado en la Academia.`);
    }
    setIsCourseModalOpen(false);
    setEditingCourse(null);
    setTimeout(() => setActionSuccessMessage(''), 4000);
  };

  const handleDeleteCourse = (courseId, title) => {
    if (window.confirm(`¿Está seguro de eliminar el curso "${title}"?`)) {
      setOfficialCourses(officialCourses.filter(c => c.id !== courseId));
      setActionSuccessMessage(`Curso "${title}" eliminado.`);
      setTimeout(() => setActionSuccessMessage(''), 4000);
    }
  };

  // =========================================================================
  // PUBLIC EVENTS & FESTIVALS HANDLERS (PRESIDENCY)
  // =========================================================================
  const openNewPublicEventModal = () => {
    setEditingPublicEvent(null);
    setPublicEventFormData({
      title: '',
      date: new Date().toISOString().split('T')[0],
      month: 'Octubre',
      location: 'Centro Histórico / Mérida',
      category: 'Festival Gastronómico',
      badge: 'Evento Oficial 2026',
      accessType: 'member_free_paid_general',
      priceGeneralUSD: 10,
      priceMemberUSD: 0,
      ticketPrice: 'Gratuito Miembros / $10 USD General',
      isPagoMovilEnabled: true,
      pagoMovilBank: '0108 - Banco Provincial',
      pagoMovilCi: 'V-12517086',
      pagoMovilPhone: '0414-8817137',
      description: '',
      highlights: ['Catas guiadas y degustaciones', 'Masterclasses con chefs invitados'],
      image: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=1200&q=80'
    });
    setIsPublicEventModalOpen(true);
  };

  const openEditPublicEventModal = (event) => {
    setEditingPublicEvent(event);
    setPublicEventFormData({
      title: event.title || '',
      date: event.date || '',
      month: event.month || 'Octubre',
      location: event.location || '',
      category: event.category || 'Festival Gastronómico',
      badge: event.badge || 'Evento Oficial 2026',
      accessType: event.accessType || (event.ticketPrice?.toLowerCase().includes('gratis') && !event.ticketPrice?.includes('$') ? 'free' : 'member_free_paid_general'),
      priceGeneralUSD: event.priceGeneralUSD !== undefined ? event.priceGeneralUSD : (event.priceUSD || 10),
      priceMemberUSD: event.priceMemberUSD !== undefined ? event.priceMemberUSD : 0,
      ticketPrice: event.ticketPrice || 'Gratuito Miembros / $10 USD General',
      isPagoMovilEnabled: event.isPagoMovilEnabled !== false,
      pagoMovilBank: event.pagoMovilBank || '0108 - Banco Provincial',
      pagoMovilCi: event.pagoMovilCi || 'V-12517086',
      pagoMovilPhone: event.pagoMovilPhone || '0414-8817137',
      description: event.description || '',
      highlights: Array.isArray(event.highlights) ? event.highlights : ['Catas guiadas y degustaciones', 'Masterclasses con chefs'],
      image: event.image || 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=1200&q=80'
    });
    setIsPublicEventModalOpen(true);
  };

  const handleSavePublicEvent = (e) => {
    e.preventDefault();
    // Auto-generate ticketPrice text if needed
    let generatedTicketText = publicEventFormData.ticketPrice;
    if (publicEventFormData.accessType === 'free') {
      generatedTicketText = 'Entrada Totalmente Libre / Gratuito';
    } else if (publicEventFormData.accessType === 'member_free_paid_general') {
      generatedTicketText = `Gratuito Miembros / $${publicEventFormData.priceGeneralUSD || 10} USD General`;
    } else if (publicEventFormData.accessType === 'paid') {
      generatedTicketText = `$${publicEventFormData.priceGeneralUSD || 10} USD Entrada General`;
    }

    const payload = {
      ...publicEventFormData,
      ticketPrice: generatedTicketText,
      priceUSD: parseFloat(publicEventFormData.priceGeneralUSD) || 0
    };

    if (editingPublicEvent) {
      const updated = officialEvents.map(ev => ev.id === editingPublicEvent.id ? { ...ev, ...payload } : ev);
      setOfficialEvents(updated);
      setActionSuccessMessage(`Evento "${publicEventFormData.title}" actualizado con éxito.`);
    } else {
      const newEv = {
        id: `pub-ev-${Date.now()}`,
        ...payload,
        created_at: new Date().toISOString()
      };
      setOfficialEvents([newEv, ...officialEvents]);
      setActionSuccessMessage(`Evento público "${publicEventFormData.title}" publicado en la Agenda Oficial.`);
    }
    setIsPublicEventModalOpen(false);
    setEditingPublicEvent(null);
    setTimeout(() => setActionSuccessMessage(''), 4000);
  };

  const handleDeletePublicEvent = (eventId, title) => {
    if (window.confirm(`¿Está seguro de eliminar el evento "${title}"?`)) {
      setOfficialEvents(officialEvents.filter(ev => ev.id !== eventId));
      setActionSuccessMessage(`Evento "${title}" eliminado.`);
      setTimeout(() => setActionSuccessMessage(''), 4000);
    }
  };

  // =========================================================================
  // VINCULACIONES TURÍSTICAS & SERVICIOS HANDLERS (PRESIDENCY)
  // =========================================================================
  const openNewTouristServiceModal = () => {
    setEditingTouristService(null);
    setTouristServiceFormData({
      title: '',
      category: 'Movilidad & Transporte VIP',
      badge: 'Operador Certificado',
      image: '',
      rating: 5.0,
      priceFrom: '$50',
      unit: 'por persona',
      description: '',
      features: ['Atención personalizada', 'Guía bilingüe certificado', 'Póliza de seguro incluida'],
      contactPhone: '+58 412 6408957',
      contactWhatsapp: '+58 414 8817137',
      location: 'Mérida, Venezuela'
    });
    setIsTouristServiceModalOpen(true);
  };

  const openEditTouristServiceModal = (service) => {
    setEditingTouristService(service);
    setTouristServiceFormData({
      title: service.title || '',
      category: service.category || 'Movilidad & Transporte VIP',
      badge: service.badge || 'Operador Certificado',
      image: service.image || '',
      rating: service.rating || 5.0,
      priceFrom: service.priceFrom || '$50',
      unit: service.unit || 'por persona',
      description: service.description || '',
      features: Array.isArray(service.features) ? service.features : (typeof service.features === 'string' ? service.features.split(',').map(s => s.trim()) : []),
      contactPhone: service.contactPhone || '+58 412 6408957',
      contactWhatsapp: service.contactWhatsapp || '+58 414 8817137',
      location: service.location || 'Mérida, Venezuela'
    });
    setIsTouristServiceModalOpen(true);
  };

  const handleSaveTouristService = (e) => {
    e.preventDefault();
    const payload = {
      ...touristServiceFormData,
      features: Array.isArray(touristServiceFormData.features) ? touristServiceFormData.features : String(touristServiceFormData.features).split(',').map(s => s.trim()).filter(Boolean)
    };

    if (editingTouristService) {
      const updated = touristServices.map(s => s.id === editingTouristService.id ? { ...s, ...payload } : s);
      setTouristServices(updated);
      setActionSuccessMessage(`Servicio turístico "${payload.title}" actualizado con éxito.`);
    } else {
      const newService = {
        id: `tour-serv-${Date.now()}`,
        ...payload,
        created_at: new Date().toISOString()
      };
      setTouristServices([newService, ...touristServices]);
      setActionSuccessMessage(`Nuevo servicio turístico "${payload.title}" publicado en el portal.`);
    }
    setIsTouristServiceModalOpen(false);
    setEditingTouristService(null);
    setTimeout(() => setActionSuccessMessage(''), 4000);
  };

  const handleDeleteTouristService = (serviceId, title) => {
    if (window.confirm(`¿Está seguro de eliminar el servicio turístico "${title}"?`)) {
      setTouristServices(touristServices.filter(s => s.id !== serviceId));
      setActionSuccessMessage(`Servicio "${title}" eliminado.`);
      setTimeout(() => setActionSuccessMessage(''), 4000);
    }
  };

  // =========================================================================
  // EVENTO CUMPLIDO & REPORTE TRIMESTRAL HANDLERS
  // =========================================================================
  const handleMarkEventCompleted = (event) => {
    if (!currentUser?.isAdminLevel) return;
    if (window.confirm(`¿Marcar la actividad "${event.title}" como EVENTO CUMPLIDO?\n\nEsta actividad se archivará formalmente en el Reporte de Gestión de los últimos 3 meses con el registro de sus asistentes confirmados.`)) {
      const completedItem = {
        ...event,
        status: 'cumplido',
        completedAt: new Date().toISOString()
      };
      setCompletedBoardEvents(prev => [completedItem, ...prev]);
      setAgendaEvents(prev => prev.filter(ev => ev.id !== event.id));
      setActionSuccessMessage(`Actividad "${event.title}" marcada como CUMPLIDA y registrada en el Reporte Histórico.`);
      setTimeout(() => setActionSuccessMessage(''), 4000);
    }
  };

  const handleExportCompletedReportCSV = () => {
    const headers = "ID,Titulo,Tipo,Fecha_Actividad,Fecha_Cumplido,Lugar,Organizador,Total_Asistentes,Asistentes_Confirmados\n";
    const rows = completedBoardEvents.map(ev => {
      const attendees = (ev.confirmedAttendees || []).map(a => `${a.name} (${a.role})`).join('; ');
      return `"${ev.id || ''}","${(ev.title || '').replace(/"/g, '""')}","${ev.typeLabel || ev.type || ''}","${ev.date || ''}","${ev.completedAt || ''}","${(ev.location || '').replace(/"/g, '""')}","${(ev.organizer || '').replace(/"/g, '""')}","${(ev.confirmedAttendees || []).length}","${attendees.replace(/"/g, '""')}"`;
    }).join("\n");

    const blob = new Blob([headers + rows], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", `reporte_eventos_cumplidos_cgem_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    setActionSuccessMessage('Reporte de gestión descargado exitosamente en CSV.');
    setTimeout(() => setActionSuccessMessage(''), 4000);
  };

  // =========================================================================
  // LEGAL RESOURCES MANAGEMENT HANDLERS (PRESIDENT ONLY)
  // =========================================================================
  const openNewLegalDocModal = (defaultCatId = 'fiscal') => {
    setEditingLegalDoc(null);
    setLegalFormData({
      title: '',
      categoryId: defaultCatId,
      categoryTag: defaultCatId === 'fiscal' ? 'SENIAT Nacional' : 
                   defaultCatId === 'sanitario' ? 'Contraloría Sanitaria SACS' : 
                   defaultCatId === 'turismo' ? 'INATUR / Cormetur' : 'Ministerio del Trabajo',
      format: 'PDF',
      size: '2.0 MB',
      dateUpdated: 'Vigente 2026',
      summary: '',
      fileUrl: '',
      isOfficial: true
    });
    setIsLegalModalOpen(true);
  };

  const openEditLegalDocModal = (doc, catId) => {
    setEditingLegalDoc({ ...doc, currentCatId: catId });
    setLegalFormData({
      title: doc.title || '',
      categoryId: catId || doc.categoryId || 'fiscal',
      categoryTag: doc.category || 'SENIAT Nacional',
      format: doc.format || 'PDF',
      size: doc.size || '2.0 MB',
      dateUpdated: doc.dateUpdated || 'Vigente 2026',
      summary: doc.summary || '',
      fileUrl: doc.fileUrl || '',
      isOfficial: doc.isOfficial !== false
    });
    setIsLegalModalOpen(true);
  };

  const handleSaveLegalDoc = (e) => {
    e.preventDefault();
    if (!isPresident) return;

    const newDocItem = {
      id: editingLegalDoc ? editingLegalDoc.id : `doc-${Date.now()}`,
      title: legalFormData.title.trim(),
      category: legalFormData.categoryTag.trim(),
      format: legalFormData.format,
      size: legalFormData.size || '1.5 MB',
      dateUpdated: legalFormData.dateUpdated || 'Vigente 2026',
      summary: legalFormData.summary.trim(),
      fileUrl: legalFormData.fileUrl.trim(),
      isOfficial: legalFormData.isOfficial
    };

    setLegalCategories(prevCategories => {
      return prevCategories.map(cat => {
        // If editing and category changed, remove from old category
        if (editingLegalDoc && editingLegalDoc.currentCatId === cat.id && legalFormData.categoryId !== cat.id) {
          const filtered = (cat.items || []).filter(item => item.id !== editingLegalDoc.id);
          return { ...cat, items: filtered, docsCount: filtered.length };
        }

        // If target category
        if (cat.id === legalFormData.categoryId) {
          let updatedItems = [];
          if (editingLegalDoc) {
            const exists = (cat.items || []).some(item => item.id === editingLegalDoc.id);
            if (exists) {
              updatedItems = (cat.items || []).map(item => item.id === editingLegalDoc.id ? newDocItem : item);
            } else {
              updatedItems = [newDocItem, ...(cat.items || [])];
            }
          } else {
            updatedItems = [newDocItem, ...(cat.items || [])];
          }
          return { ...cat, items: updatedItems, docsCount: updatedItems.length };
        }

        return cat;
      });
    });

    setIsLegalModalOpen(false);
    setEditingLegalDoc(null);
    setActionSuccessMessage(editingLegalDoc ? 'Documento normativo actualizado con éxito en el repositorio público.' : 'Nuevo documento normativo cargado exitosamente en el repositorio público.');
    setTimeout(() => setActionSuccessMessage(''), 5000);
  };

  const handleDeleteLegalDoc = (catId, docId, docTitle) => {
    if (!isPresident) return;
    if (window.confirm(`¿Está seguro de que desea eliminar el documento "${docTitle}" del Centro de Recursos & Marco Jurídico?`)) {
      setLegalCategories(prev => prev.map(cat => {
        if (cat.id === catId) {
          const updatedItems = (cat.items || []).filter(i => i.id !== docId);
          return { ...cat, items: updatedItems, docsCount: updatedItems.length };
        }
        return cat;
      }));
      setActionSuccessMessage(`Documento "${docTitle}" eliminado del repositorio.`);
      setTimeout(() => setActionSuccessMessage(''), 4000);
    }
  };

  // Total Legal Docs Count
  const totalLegalDocs = legalCategories.reduce((acc, cat) => acc + (cat.items || []).length, 0);

  // =========================================================================
  // DIRECTORIO DE AGREMIADOS HANDLERS (PRESIDENT & EXECUTIVE DIRECTOR)
  // =========================================================================
  const openNewMemberModal = () => {
    setEditingMember(null);
    const nextNumber = directoryMembers.length + 1;
    const generatedCode = `CGM-2026-${String(nextNumber).padStart(3, '0')}`;
    setMemberFormData({
      codigo_afiliado: generatedCode,
      nombre_establecimiento: '',
      categoria_negocio: 'Empresas (5 a 19 empleados)',
      representante_legal: '',
      rif_cedula: '',
      telefono: '+58 ',
      email: '',
      direccion_completa: '',
      municipio: 'Libertador',
      instagram: '@',
      sitio_web: '',
      numero_empleados: 5,
      estado_solvencia: 'Solvente (Activo)',
      monto_inscripcion: 30,
      monto_cuota_mensual: 10,
      observaciones: ''
    });
    setIsMemberModalOpen(true);
  };

  const openEditMemberModal = (member) => {
    setEditingMember(member);
    setMemberFormData({
      codigo_afiliado: member.codigo_afiliado || '',
      nombre_establecimiento: member.nombre_establecimiento || '',
      categoria_negocio: member.categoria_negocio || 'Empresas (5 a 19 empleados)',
      representante_legal: member.representante_legal || '',
      rif_cedula: member.rif_cedula || '',
      telefono: member.telefono || '',
      email: member.email || '',
      direccion_completa: member.direccion_completa || '',
      municipio: member.municipio || 'Libertador',
      instagram: member.instagram || '',
      sitio_web: member.sitio_web || '',
      numero_empleados: member.numero_empleados || 1,
      estado_solvencia: member.estado_solvencia || 'Solvente (Activo)',
      monto_inscripcion: member.monto_inscripcion || 30,
      monto_cuota_mensual: member.monto_cuota_mensual || 10,
      observaciones: member.observaciones || ''
    });
    setIsMemberModalOpen(true);
  };

  const handleSaveMember = async (e) => {
    e.preventDefault();
    if (!canAccessDirectory) return;

    const code = memberFormData.codigo_afiliado.trim() || `CGM-2026-${String(directoryMembers.length + 1).padStart(3, '0')}`;

    const memberDataToSave = {
      ...memberFormData,
      codigo_afiliado: code,
      numero_empleados: parseInt(memberFormData.numero_empleados, 10) || 1,
      monto_inscripcion: parseFloat(memberFormData.monto_inscripcion) || 0,
      monto_cuota_mensual: parseFloat(memberFormData.monto_cuota_mensual) || 0,
      updated_at: new Date().toISOString()
    };

    if (editingMember) {
      // 1. Update in Supabase
      try {
        if (supabase) {
          await supabase
            .from('directorio_agremiados')
            .update(memberDataToSave)
            .eq('id', editingMember.id);
        }
      } catch (err) {
        console.warn('Supabase update notice:', err);
      }

      // 2. Update local state & localStorage
      const updatedList = directoryMembers.map(m => m.id === editingMember.id ? { ...m, ...memberDataToSave } : m);
      setDirectoryMembers(updatedList);
      localStorage.setItem('cgem_directorio_agremiados', JSON.stringify(updatedList));
      setActionSuccessMessage(`Agremiado "${memberFormData.nombre_establecimiento}" (${code}) actualizado con éxito.`);
    } else {
      // 1. Create record
      const recordToInsert = {
        ...memberDataToSave,
        fecha_registro: new Date().toISOString()
      };
      let createdRecord = {
        id: `cgm-dir-${Date.now()}`,
        ...recordToInsert
      };

      // 2. Insert into Supabase
      try {
        if (supabase) {
          const { data, error } = await supabase
            .from('directorio_agremiados')
            .insert([recordToInsert])
            .select();
          if (data && data[0]) {
            createdRecord = data[0];
          }
        }
      } catch (err) {
        console.warn('Supabase insert notice:', err);
      }

      // 3. Update local state & localStorage
      const updatedList = [createdRecord, ...directoryMembers];
      setDirectoryMembers(updatedList);
      localStorage.setItem('cgem_directorio_agremiados', JSON.stringify(updatedList));
      setActionSuccessMessage(`Nuevo agremiado "${memberFormData.nombre_establecimiento}" incorporado al Directorio con código ${code}.`);
    }

    setIsMemberModalOpen(false);
    setEditingMember(null);
    setTimeout(() => setActionSuccessMessage(''), 5000);
  };

  const handleDeleteMember = async (memberId, name, code) => {
    if (!canAccessDirectory) return;
    if (window.confirm(`¿Está seguro de que desea eliminar a "${name}" (${code}) del Directorio de Agremiados?`)) {
      try {
        if (supabase) {
          await supabase.from('directorio_agremiados').delete().eq('id', memberId);
        }
      } catch (err) {
        console.warn('Supabase delete notice:', err);
      }

      const updated = directoryMembers.filter(m => m.id !== memberId);
      setDirectoryMembers(updated);
      localStorage.setItem('cgem_directorio_agremiados', JSON.stringify(updated));
      setActionSuccessMessage(`Agremiado "${name}" eliminado del Directorio.`);
      setTimeout(() => setActionSuccessMessage(''), 4000);
    }
  };

  // Export Directory to CSV
  const handleExportCSV = () => {
    const headers = "Codigo,Establecimiento,Categoria,Representante,RIF_Cedula,Telefono,Email,Municipio,Direccion,Empleados,Solvencia,Cuota_USD\n";
    const rows = directoryMembers.map(m => 
      `"${m.codigo_afiliado || ''}","${m.nombre_establecimiento || ''}","${m.categoria_negocio || ''}","${m.representante_legal || ''}","${m.rif_cedula || ''}","${m.telefono || ''}","${m.email || ''}","${m.municipio || ''}","${(m.direccion_completa || '').replace(/"/g, '""')}","${m.numero_empleados || ''}","${m.estado_solvencia || ''}","${m.monto_cuota_mensual || ''}"`
    ).join("\n");

    const blob = new Blob([headers + rows], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", `directorio_agremiados_cgem_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    setActionSuccessMessage('Directorio descargado exitosamente en formato CSV / Excel.');
    setTimeout(() => setActionSuccessMessage(''), 4000);
  };

  // Copy Emails list for newsletters
  const handleCopyEmails = () => {
    const emails = directoryMembers.map(m => m.email).filter(Boolean).join(', ');
    navigator.clipboard.writeText(emails);
    setActionSuccessMessage(`Se han copiado ${directoryMembers.length} correos electrónicos al portapapeles.`);
    setTimeout(() => setActionSuccessMessage(''), 4000);
  };

  // Filter Directory Members
  const filteredDirectoryMembers = directoryMembers.filter(member => {
    const s = directorySearch.toLowerCase();
    const matchSearch = 
      (member.nombre_establecimiento || '').toLowerCase().includes(s) ||
      (member.representante_legal || '').toLowerCase().includes(s) ||
      (member.codigo_afiliado || '').toLowerCase().includes(s) ||
      (member.email || '').toLowerCase().includes(s) ||
      (member.telefono || '').toLowerCase().includes(s) ||
      (member.rif_cedula || '').toLowerCase().includes(s) ||
      (member.municipio || '').toLowerCase().includes(s);

    const matchCategory = directoryCategoryFilter === 'all' || 
      (member.categoria_negocio && member.categoria_negocio.toLowerCase().includes(directoryCategoryFilter.toLowerCase()));

    const matchStatus = directoryStatusFilter === 'all' || 
      (member.estado_solvencia && member.estado_solvencia.toLowerCase().includes(directoryStatusFilter.toLowerCase()));

    return matchSearch && matchCategory && matchStatus;
  });

  // Calculate Quick Directory Stats
  const countTotalAgremiados = directoryMembers.length;
  const countSolventes = directoryMembers.filter(m => (m.estado_solvencia || '').toLowerCase().includes('solvente') || (m.estado_solvencia || '').toLowerCase().includes('activo')).length;
  const countEnRevision = directoryMembers.filter(m => (m.estado_solvencia || '').toLowerCase().includes('revisión') || (m.estado_solvencia || '').toLowerCase().includes('pendiente')).length;
  const totalMonthlyIncomeUSD = directoryMembers.reduce((acc, m) => acc + (parseFloat(m.monto_cuota_mensual) || 0), 0);

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
              <div className="mb-6 p-4 rounded-2xl bg-rose-50 border border-rose-200 text-rose-800 text-xs flex items-start gap-3 animate-fadeIn font-sans">
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
                  {canAccessDirectory && (
                    <span className="text-[10px] font-extrabold uppercase tracking-widest px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-900 border border-emerald-300 font-sans">
                      Acceso Directorio Agremiados
                    </span>
                  )}
                </div>

                <h1 className="font-serif font-black text-2xl sm:text-3xl text-slate-900 uppercase tracking-wide">
                  {currentUser.name}
                </h1>
                
                <div className="flex flex-wrap items-center gap-3 text-xs text-slate-600 mt-1 font-sans">
                  {currentUser.instagram && (
                    <span className="font-sans text-amber-900 font-bold bg-amber-50 px-2 py-0.5 rounded border border-amber-200">{currentUser.instagram}</span>
                  )}
                  {currentUser.instagram && <span>&bull;</span>}
                  <span className="font-medium">{currentUser.email}</span>
                  <span>&bull;</span>
                  <span className="text-emerald-700 font-bold flex items-center gap-1">
                    <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                    Sesión Directiva Activa
                  </span>
                </div>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-3 w-full sm:w-auto">
              {currentUser.isAdminLevel && viewMode === 'timeline' && (
                <button
                  onClick={openNewModal}
                  className="flex-1 sm:flex-initial py-3 px-5 rounded-xl bg-amber-500 hover:bg-amber-600 text-slate-950 font-serif font-black text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-md transition-all active:scale-98"
                >
                  <Plus className="w-4 h-4" />
                  <span>Nuevo Evento en Agenda</span>
                </button>
              )}

              {canAccessDirectory && viewMode === 'directorio' && (
                <button
                  onClick={openNewMemberModal}
                  className="flex-1 sm:flex-initial py-3 px-5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-serif font-black text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-md transition-all active:scale-98"
                >
                  <Plus className="w-4 h-4 text-white" />
                  <span>Nuevo Agremiado</span>
                </button>
              )}

              {currentUser.isAdminLevel && viewMode === 'courses_management' && (
                <button
                  onClick={openNewCourseModal}
                  className="flex-1 sm:flex-initial py-3 px-5 rounded-xl bg-sky-600 hover:bg-sky-700 text-white font-serif font-black text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-md transition-all active:scale-98"
                >
                  <Plus className="w-4 h-4 text-white" />
                  <span>Nuevo Curso / Taller</span>
                </button>
              )}

              {currentUser.isAdminLevel && viewMode === 'events_management' && (
                <button
                  onClick={openNewPublicEventModal}
                  className="flex-1 sm:flex-initial py-3 px-5 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-serif font-black text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-md transition-all active:scale-98"
                >
                  <Plus className="w-4 h-4 text-white" />
                  <span>Nuevo Evento / Festival</span>
                </button>
              )}

              {currentUser.isAdminLevel && viewMode === 'tourist_services' && (
                <button
                  onClick={openNewTouristServiceModal}
                  className="flex-1 sm:flex-initial py-3 px-5 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-serif font-black text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-md transition-all active:scale-98"
                >
                  <Plus className="w-4 h-4 text-white" />
                  <span>Nuevo Servicio Turístico</span>
                </button>
              )}

              {viewMode === 'completed_report' && (
                <button
                  onClick={handleExportCompletedReportCSV}
                  className="flex-1 sm:flex-initial py-3 px-5 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-serif font-black text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-md transition-all active:scale-98"
                >
                  <FileSpreadsheet className="w-4 h-4 text-white" />
                  <span>Descargar Reporte CSV</span>
                </button>
              )}

              {isPresident && viewMode === 'legal_resources' && (
                <button
                  onClick={() => openNewLegalDocModal('fiscal')}
                  className="flex-1 sm:flex-initial py-3 px-5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-serif font-black text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-md transition-all active:scale-98"
                >
                  <FolderPlus className="w-4 h-4" />
                  <span>Cargar Documento Jurídico</span>
                </button>
              )}

              <button
                onClick={handleLogout}
                className="py-3 px-4 rounded-xl bg-slate-100 hover:bg-rose-50 text-slate-700 hover:text-rose-700 border border-slate-200 text-xs font-bold flex items-center gap-1.5 transition-all"
                title="Cerrar Sesión Directiva"
              >
                <LogOut className="w-4 h-4" />
                <span className="hidden sm:inline font-sans">Cerrar Sesión</span>
              </button>
            </div>

          </div>

          {/* Success / Error Notification Bars */}
          {actionSuccessMessage && (
            <div className="mt-4 p-4 rounded-2xl bg-emerald-50 border border-emerald-300 text-emerald-900 text-xs flex items-center gap-3 animate-fadeIn shadow-sm font-sans">
              <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
              <span className="font-medium">{actionSuccessMessage}</span>
            </div>
          )}

          {actionErrorMessage && (
            <div className="mt-4 p-4 rounded-2xl bg-rose-50 border border-rose-300 text-rose-900 text-xs flex items-center gap-3 animate-fadeIn shadow-sm font-sans">
              <AlertTriangle className="w-5 h-5 text-rose-600 shrink-0" />
              <span className="font-bold">{actionErrorMessage}</span>
            </div>
          )}

          {/* Navigation Controls: View Modes */}
          <div className="mt-6 space-y-4">
            
            {/* View Mode Switcher */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              
              {/* View Mode Buttons */}
              <div className="flex flex-wrap items-center gap-1.5 bg-slate-100 p-1.5 rounded-2xl border border-slate-200">
                
                {/* 1. Agenda Cronológica */}
                <button
                  onClick={() => setViewMode('timeline')}
                  className={`py-2 px-4 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 font-sans ${
                    viewMode === 'timeline'
                      ? 'bg-white text-amber-900 border border-amber-300 shadow-sm font-extrabold'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  <Clock className="w-3.5 h-3.5 text-amber-600" />
                  <span>Agenda Cronológica</span>
                </button>

                {/* 2. DIRECTORIO DE AGREMIADOS */}
                {canAccessDirectory && (
                  <button
                    onClick={() => setViewMode('directorio')}
                    className={`py-2 px-4 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 font-sans ${
                      viewMode === 'directorio'
                        ? 'bg-emerald-600 text-white shadow-sm font-extrabold'
                        : 'text-emerald-900 hover:text-emerald-950 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200'
                    }`}
                  >
                    <Building2 className={`w-3.5 h-3.5 ${viewMode === 'directorio' ? 'text-white' : 'text-emerald-700'}`} />
                    <span>DIRECTORIO AGREMIADOS ({countTotalAgremiados})</span>
                  </button>
                )}

                {/* 3. Reporte de Eventos Cumplidos (Últimos 3 Meses) */}
                <button
                  onClick={() => setViewMode('completed_report')}
                  className={`py-2 px-4 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 font-sans ${
                    viewMode === 'completed_report'
                      ? 'bg-teal-600 text-white shadow-sm font-extrabold'
                      : 'text-teal-900 hover:text-teal-950 bg-teal-50 hover:bg-teal-100 border border-teal-200'
                  }`}
                >
                  <History className={`w-3.5 h-3.5 ${viewMode === 'completed_report' ? 'text-white' : 'text-teal-700'}`} />
                  <span>Eventos Cumplidos ({completedBoardEvents.length})</span>
                </button>

                {/* 4. Gestión de Cursos & Capacitaciones (Presidente / Directiva) */}
                {currentUser.isAdminLevel && (
                  <button
                    onClick={() => setViewMode('courses_management')}
                    className={`py-2 px-4 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 font-sans ${
                      viewMode === 'courses_management'
                        ? 'bg-sky-600 text-white shadow-sm font-extrabold'
                        : 'text-sky-900 hover:text-sky-950 bg-sky-50 hover:bg-sky-100 border border-sky-200'
                    }`}
                  >
                    <GraduationCap className={`w-3.5 h-3.5 ${viewMode === 'courses_management' ? 'text-white' : 'text-sky-700'}`} />
                    <span>Cursos & Academia ({officialCourses.length})</span>
                  </button>
                )}

                {/* 5. Gestión de Eventos & Festivales Públicos (Presidente / Directiva) */}
                {currentUser.isAdminLevel && (
                  <button
                    onClick={() => setViewMode('events_management')}
                    className={`py-2 px-4 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 font-sans ${
                      viewMode === 'events_management'
                        ? 'bg-amber-600 text-white shadow-sm font-extrabold'
                        : 'text-amber-900 hover:text-amber-950 bg-amber-50 hover:bg-amber-100 border border-amber-200'
                    }`}
                  >
                    <Ticket className={`w-3.5 h-3.5 ${viewMode === 'events_management' ? 'text-white' : 'text-amber-700'}`} />
                    <span>Eventos & Festivales ({officialEvents.length})</span>
                  </button>
                )}

                {/* 6. Vinculaciones Turísticas & Servicios VIP (Presidente / Directiva) */}
                {currentUser.isAdminLevel && (
                  <button
                    onClick={() => setViewMode('tourist_services')}
                    className={`py-2 px-4 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 font-sans ${
                      viewMode === 'tourist_services'
                        ? 'bg-purple-600 text-white shadow-sm font-extrabold'
                        : 'text-purple-900 hover:text-purple-950 bg-purple-50 hover:bg-purple-100 border border-purple-200'
                    }`}
                  >
                    <Compass className={`w-3.5 h-3.5 ${viewMode === 'tourist_services' ? 'text-white' : 'text-purple-700'}`} />
                    <span>Servicios Turísticos ({touristServices.length})</span>
                  </button>
                )}

                {/* 7. Directorio de Junta Directiva */}
                <button
                  onClick={() => setViewMode('board_list')}
                  className={`py-2 px-4 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 font-sans ${
                    viewMode === 'board_list'
                      ? 'bg-white text-amber-900 border border-amber-300 shadow-sm font-extrabold'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  <Users className="w-3.5 h-3.5 text-amber-600" />
                  <span>Junta Directiva</span>
                </button>

                {/* 8. Gestor de Recursos Jurídicos (Exclusivo Presidente) */}
                {isPresident && (
                  <button
                    onClick={() => setViewMode('legal_resources')}
                    className={`py-2 px-4 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 font-sans ${
                      viewMode === 'legal_resources'
                        ? 'bg-indigo-600 text-white shadow-sm font-extrabold'
                        : 'text-indigo-900 hover:text-indigo-950 bg-indigo-50 hover:bg-indigo-100 border border-indigo-200'
                    }`}
                  >
                    <BookOpen className={`w-3.5 h-3.5 ${viewMode === 'legal_resources' ? 'text-white' : 'text-indigo-700'}`} />
                    <span>Marco Jurídico ({totalLegalDocs})</span>
                  </button>
                )}
              </div>

              {/* Year tabs (only in timeline view) */}
              {viewMode === 'timeline' && (
                <div className="flex items-center gap-2 bg-slate-100 p-1.5 rounded-2xl border border-slate-200">
                  <span className="text-[11px] font-bold text-slate-600 uppercase tracking-wider px-3 font-sans">
                    Año:
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
              )}

            </div>

            {/* Month Ribbon (only in timeline view) */}
            {viewMode === 'timeline' && (
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
            )}

            {/* Category Filter Chips (only in timeline view) */}
            {viewMode === 'timeline' && (
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
            )}

          </div>

        </div>
      </div>

      {/* Main Content Area */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-8">
        
        {/* =========================================================================
            VIEW MODE 1: DIRECTORIO DE AGREMIADOS (PRESIDENTE & DIRECCIÓN EJECUTIVA)
            ========================================================================= */}
        {viewMode === 'directorio' && canAccessDirectory && (
          <div className="space-y-6 animate-fadeIn">
            
            {/* Header Box with Quick Stats */}
            <div className="bg-gradient-to-br from-emerald-950 via-slate-900 to-teal-950 text-white rounded-3xl p-6 sm:p-8 shadow-xl border border-emerald-800/40">
              <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6 pb-6 border-b border-emerald-800/50">
                <div>
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-400/40 text-[10px] font-extrabold uppercase tracking-wider mb-2 font-sans">
                    <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                    <span>Control Directivo & Respaldo en Supabase Cloud</span>
                  </div>
                  <h2 className="font-serif font-black text-2xl sm:text-3xl text-white uppercase tracking-wide">
                    Directorio Oficial de Miembros Agremiados
                  </h2>
                  <p className="text-xs sm:text-sm text-emerald-200/80 mt-1 max-w-2xl font-sans">
                    Base de datos oficial de establecimientos gastronómicos, empresas, PYMEs y marcas personales agremiadas a la Cámara Gastronómica del Estado Mérida.
                  </p>
                </div>

                <div className="flex flex-wrap items-center gap-3 font-sans">
                  <button
                    onClick={fetchDirectoryFromSupabase}
                    disabled={isLoadingDirectory}
                    className="py-3 px-4 rounded-xl bg-white/10 hover:bg-white/20 text-emerald-200 border border-emerald-500/30 text-xs font-bold flex items-center gap-1.5 transition-all"
                    title="Sincronizar datos con Supabase"
                  >
                    <RefreshCw className={`w-3.5 h-3.5 ${isLoadingDirectory ? 'animate-spin' : ''}`} />
                    <span>{isLoadingDirectory ? 'Sincronizando...' : 'Actualizar'}</span>
                  </button>

                  <button
                    onClick={handleExportCSV}
                    className="py-3 px-4 rounded-xl bg-white/10 hover:bg-white/20 text-white border border-white/20 text-xs font-bold flex items-center gap-1.5 transition-all"
                  >
                    <FileSpreadsheet className="w-3.5 h-3.5 text-emerald-400" />
                    <span>Exportar Excel/CSV</span>
                  </button>

                  <button
                    onClick={handleCopyEmails}
                    className="py-3 px-4 rounded-xl bg-white/10 hover:bg-white/20 text-white border border-white/20 text-xs font-bold flex items-center gap-1.5 transition-all"
                  >
                    <Copy className="w-3.5 h-3.5 text-amber-400" />
                    <span>Copiar Correos</span>
                  </button>

                  <button
                    onClick={openNewMemberModal}
                    className="py-3 px-5 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-slate-950 font-serif font-black text-xs uppercase tracking-wider shadow-lg flex items-center gap-2 transition-all active:scale-98"
                  >
                    <Plus className="w-4 h-4 text-slate-950" />
                    <span>Registrar Nuevo Agremiado</span>
                  </button>
                </div>
              </div>

              {/* Stats Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-6 font-sans">
                <div className="p-4 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-sm">
                  <span className="text-[10px] uppercase font-bold text-emerald-300 block">Total Agremiados</span>
                  <span className="font-serif font-black text-2xl sm:text-3xl text-white">{countTotalAgremiados}</span>
                  <span className="text-[10px] text-slate-400 block mt-0.5">Empresas & Marcas</span>
                </div>

                <div className="p-4 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-sm">
                  <span className="text-[10px] uppercase font-bold text-emerald-400 block">Solventes (Activos)</span>
                  <span className="font-serif font-black text-2xl sm:text-3xl text-emerald-400">{countSolventes}</span>
                  <span className="text-[10px] text-slate-400 block mt-0.5">Con membresía al día</span>
                </div>

                <div className="p-4 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-sm">
                  <span className="text-[10px] uppercase font-bold text-amber-300 block">En Trámite / Revisión</span>
                  <span className="font-serif font-black text-2xl sm:text-3xl text-amber-300">{countEnRevision}</span>
                  <span className="text-[10px] text-slate-400 block mt-0.5">Pendientes por validar</span>
                </div>

                <div className="p-4 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-sm">
                  <span className="text-[10px] uppercase font-bold text-teal-300 block">Recaudación Cuotas</span>
                  <span className="font-serif font-black text-2xl sm:text-3xl text-white">${totalMonthlyIncomeUSD}</span>
                  <span className="text-[10px] text-slate-400 block mt-0.5">Estimado mensual USD</span>
                </div>
              </div>
            </div>

            {/* Search & Filter Controls */}
            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-12 gap-3 font-sans items-center">
                
                {/* Search Bar */}
                <div className="md:col-span-6 relative">
                  <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={directorySearch}
                    onChange={(e) => setDirectorySearch(e.target.value)}
                    placeholder="Buscar por nombre, código CGM, representante, correo, RIF o municipio..."
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 text-xs sm:text-sm font-medium focus:outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20"
                  />
                </div>

                {/* Category Filter */}
                <div className="md:col-span-3">
                  <select
                    value={directoryCategoryFilter}
                    onChange={(e) => setDirectoryCategoryFilter(e.target.value)}
                    className="w-full px-3 py-2.5 rounded-xl border border-slate-200 text-xs sm:text-sm font-medium text-slate-700 focus:outline-none focus:border-emerald-500"
                  >
                    <option value="all">Todas las Categorías</option>
                    <option value="Grandes Empresas">Grandes Empresas (20+ empleados)</option>
                    <option value="Empresas">Empresas / PYMEs (5-19 empleados)</option>
                    <option value="Marca Personal">Marca Personal & Emprendimientos</option>
                  </select>
                </div>

                {/* Status Filter */}
                <div className="md:col-span-3">
                  <select
                    value={directoryStatusFilter}
                    onChange={(e) => setDirectoryStatusFilter(e.target.value)}
                    className="w-full px-3 py-2.5 rounded-xl border border-slate-200 text-xs sm:text-sm font-medium text-slate-700 focus:outline-none focus:border-emerald-500"
                  >
                    <option value="all">Todos los Estados</option>
                    <option value="Solvente">Solvente (Activo)</option>
                    <option value="Revisión">En Revisión</option>
                    <option value="Pendiente">Pendiente de Pago</option>
                    <option value="Inactivo">Inactivo</option>
                  </select>
                </div>

              </div>

              <div className="flex items-center justify-between text-xs text-slate-500 font-sans pt-1 border-t border-slate-100">
                <span>Mostrando <strong>{filteredDirectoryMembers.length}</strong> de {directoryMembers.length} miembros registrados</span>
                {directorySearch && (
                  <button onClick={() => setDirectorySearch('')} className="text-emerald-700 font-bold underline">
                    Limpiar búsqueda
                  </button>
                )}
              </div>
            </div>

            {/* Directory Cards / Table */}
            {filteredDirectoryMembers.length === 0 ? (
              <div className="p-12 text-center rounded-3xl bg-white border border-slate-200 space-y-3 shadow-sm font-sans">
                <Building2 className="w-12 h-12 text-slate-300 mx-auto" />
                <h3 className="font-serif font-black text-lg text-slate-700 uppercase">
                  No se encontraron agremiados con los filtros actuales
                </h3>
                <p className="text-xs text-slate-500 max-w-md mx-auto">
                  Pruebe ajustando los términos de búsqueda o registre un nuevo establecimiento miembro.
                </p>
                <button
                  onClick={openNewMemberModal}
                  className="mt-2 py-2.5 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-sm"
                >
                  Registrar Primer Agremiado
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-4">
                {filteredDirectoryMembers.map((member) => {
                  const isSolvente = (member.estado_solvencia || '').toLowerCase().includes('solvente') || (member.estado_solvencia || '').toLowerCase().includes('activo');
                  const isRevision = (member.estado_solvencia || '').toLowerCase().includes('revisión') || (member.estado_solvencia || '').toLowerCase().includes('pendiente');

                  return (
                    <div 
                      key={member.id || member.codigo_afiliado}
                      className="bg-white rounded-3xl border border-slate-200 hover:border-emerald-400 p-5 sm:p-6 shadow-sm hover:shadow-md transition-all flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6"
                    >
                      {/* Member Info */}
                      <div className="space-y-2 flex-1">
                        <div className="flex flex-wrap items-center gap-2">
                          <span className="font-mono text-xs font-black px-2.5 py-0.5 rounded-lg bg-emerald-100 text-emerald-950 border border-emerald-300">
                            {member.codigo_afiliado}
                          </span>
                          
                          <span className="text-[10px] uppercase font-bold px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-700 border border-slate-200 font-sans">
                            {member.categoria_negocio}
                          </span>

                          <span className={`text-[10px] font-extrabold uppercase px-2.5 py-0.5 rounded-full border font-sans ${
                            isSolvente 
                              ? 'bg-emerald-50 text-emerald-800 border-emerald-300' 
                              : isRevision 
                                ? 'bg-amber-50 text-amber-800 border-amber-300' 
                                : 'bg-rose-50 text-rose-800 border-rose-300'
                          }`}>
                            {member.estado_solvencia}
                          </span>
                        </div>

                        <div>
                          <h3 className="font-serif font-black text-xl text-slate-900">
                            {member.nombre_establecimiento}
                          </h3>
                          <p className="text-xs text-slate-600 font-sans flex flex-wrap items-center gap-2 mt-0.5">
                            <span>Representante: <strong className="text-slate-800">{member.representante_legal}</strong></span>
                            {member.rif_cedula && (
                              <>
                                <span>&bull;</span>
                                <span className="font-mono text-slate-500 font-semibold">{member.rif_cedula}</span>
                              </>
                            )}
                            {member.numero_empleados && (
                              <>
                                <span>&bull;</span>
                                <span>{member.numero_empleados} empleados</span>
                              </>
                            )}
                          </p>
                        </div>

                        {/* Contact & Location Strip */}
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 pt-1 text-xs text-slate-600 font-sans">
                          <div className="flex items-center gap-1.5">
                            <Phone className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                            <a href={`tel:${member.telefono}`} className="hover:text-emerald-700 font-medium truncate">
                              {member.telefono}
                            </a>
                          </div>

                          <div className="flex items-center gap-1.5">
                            <Mail className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                            <a href={`mailto:${member.email}`} className="hover:text-emerald-700 font-medium truncate" title={member.email}>
                              {member.email}
                            </a>
                          </div>

                          <div className="flex items-center gap-1.5">
                            <MapPin className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                            <span className="truncate" title={member.direccion_completa}>
                              {member.municipio ? `${member.municipio} - ` : ''}{member.direccion_completa || 'Mérida'}
                            </span>
                          </div>
                        </div>

                        {member.observaciones && (
                          <p className="text-[11px] text-slate-500 italic font-sans pt-1 border-t border-slate-100">
                            Nota: {member.observaciones}
                          </p>
                        )}
                      </div>

                      {/* Financial & Actions Column */}
                      <div className="flex flex-row lg:flex-col items-center lg:items-end justify-between w-full lg:w-auto gap-3 pt-3 lg:pt-0 lg:border-l lg:border-slate-100 lg:pl-6 shrink-0 font-sans">
                        
                        <div className="text-left lg:text-right">
                          <span className="text-[10px] uppercase font-bold text-slate-400 block">Cuota Mensual</span>
                          <span className="font-serif font-black text-lg text-slate-900">${member.monto_cuota_mensual || 10} USD</span>
                        </div>

                        {/* Action buttons */}
                        <div className="flex items-center gap-1.5">
                          {/* WhatsApp 1-clic */}
                          {member.telefono && (
                            <a
                              href={`https://api.whatsapp.com/send?phone=${member.telefono.replace(/[^0-9]/g, '')}&text=Estimado(a)%20${encodeURIComponent(member.representante_legal)}%20de%20${encodeURIComponent(member.nombre_establecimiento)}%2C%20le%20escribimos%20desde%20la%20C%C3%A1mara%20Gastron%C3%B3mica%20del%20Estado%20M%C3%A9rida.`}
                              target="_blank"
                              rel="noreferrer"
                              className="p-2.5 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-700 transition-colors"
                              title="Enviar WhatsApp directo"
                            >
                              <MessageCircle className="w-4 h-4" />
                            </a>
                          )}

                          <button
                            onClick={() => openEditMemberModal(member)}
                            className="p-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors text-xs font-bold flex items-center gap-1"
                            title="Editar ficha del agremiado"
                          >
                            <Edit3 className="w-3.5 h-3.5 text-amber-700" />
                            <span className="hidden sm:inline">Editar</span>
                          </button>

                          <button
                            onClick={() => handleDeleteMember(member.id, member.nombre_establecimiento, member.codigo_afiliado)}
                            className="p-2.5 rounded-xl bg-slate-100 hover:bg-rose-100 text-slate-600 hover:text-rose-700 transition-colors"
                            title="Eliminar agremiado"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>

                      </div>

                    </div>
                  );
                })}
              </div>
            )}

          </div>
        )}

        {/* =========================================================================
            VIEW MODE 2: TIMELINE / CHRONOLOGICAL AGENDA
            ========================================================================= */}
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

                          {/* Admin Edit / Delete / Evento Cumplido Controls */}
                          {currentUser.isAdminLevel && (
                            <div className="space-y-2 pt-3 border-t border-slate-100">
                              <button
                                onClick={() => handleMarkEventCompleted(event)}
                                className="w-full py-2 px-3 rounded-xl bg-teal-50 hover:bg-teal-100 text-teal-800 border border-teal-300 transition-all text-xs flex items-center justify-center gap-1.5 font-extrabold font-sans shadow-xs active:scale-98"
                                title="Marcar como cumplido y archivar en el reporte histórico de los últimos 3 meses"
                              >
                                <CheckCircle2 className="w-4 h-4 text-teal-600" />
                                <span>EVENTO CUMPLIDO</span>
                              </button>

                              <div className="flex items-center justify-end gap-2">
                                <button
                                  onClick={() => openEditModal(event)}
                                  className="flex-1 p-2 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 hover:text-slate-900 transition-colors text-xs flex items-center justify-center gap-1 font-bold font-sans"
                                  title="Editar actividad"
                                >
                                  <Edit3 className="w-3.5 h-3.5 text-amber-700" />
                                  <span>Editar</span>
                                </button>

                                <button
                                  onClick={() => handleDeleteEvent(event.id)}
                                  className="flex-1 p-2 rounded-lg bg-slate-100 hover:bg-rose-100 text-slate-600 hover:text-rose-700 transition-colors text-xs flex items-center justify-center gap-1 font-bold font-sans"
                                  title="Eliminar actividad"
                                >
                                  <Trash2 className="w-3.5 h-3.5" />
                                  <span>Eliminar</span>
                                </button>
                              </div>
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

        {/* =========================================================================
            VIEW MODE: REPORTE DE EVENTOS CUMPLIDOS (ÚLTIMOS 3 MESES)
            ========================================================================= */}
        {viewMode === 'completed_report' && (
          <div className="space-y-6 animate-fadeIn">
            {/* Header Box */}
            <div className="bg-gradient-to-br from-teal-950 via-slate-900 to-emerald-950 text-white rounded-3xl p-6 sm:p-8 shadow-xl border border-teal-800/40">
              <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6 pb-6 border-b border-teal-800/50">
                <div>
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-teal-500/20 text-teal-300 border border-teal-400/40 text-[10px] font-extrabold uppercase tracking-wider mb-2 font-sans">
                    <History className="w-3.5 h-3.5 text-teal-400" />
                    <span>Histórico de Gestión & Cumplimiento Directivo (Ventana Móvil 90 Días)</span>
                  </div>
                  <h2 className="font-serif font-black text-2xl sm:text-3xl text-white uppercase tracking-wide">
                    Reporte de Actividades & Compromisos Cumplidos
                  </h2>
                  <p className="text-xs sm:text-sm text-teal-200/80 mt-1 max-w-2xl font-sans">
                    Registro formal de convocatorias, sesiones de junta, eventos institucionales y reuniones gremiales ejecutadas con verificación de asistencia de la Junta Directiva.
                  </p>
                </div>

                <div className="flex flex-wrap items-center gap-3 font-sans">
                  <button
                    onClick={handleExportCompletedReportCSV}
                    className="py-3 px-5 rounded-xl bg-teal-500 hover:bg-teal-600 text-slate-950 font-serif font-black text-xs uppercase tracking-wider shadow-lg flex items-center gap-2 transition-all active:scale-98"
                  >
                    <FileSpreadsheet className="w-4 h-4 text-slate-950" />
                    <span>Descargar Reporte CSV</span>
                  </button>
                </div>
              </div>

              {/* Stats Summary */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-6 font-sans">
                <div className="p-4 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-sm">
                  <span className="text-[10px] uppercase font-bold text-teal-300 block">Actividades Cumplidas</span>
                  <span className="font-serif font-black text-2xl sm:text-3xl text-white">{completedBoardEvents.length}</span>
                  <span className="text-[10px] text-slate-400 block mt-0.5">En los últimos 90 días</span>
                </div>

                <div className="p-4 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-sm">
                  <span className="text-[10px] uppercase font-bold text-emerald-400 block">Total Asistencias Computadas</span>
                  <span className="font-serif font-black text-2xl sm:text-3xl text-emerald-400">
                    {completedBoardEvents.reduce((acc, ev) => acc + (ev.confirmedAttendees?.length || 0), 0)}
                  </span>
                  <span className="text-[10px] text-slate-400 block mt-0.5">Participaciones registradas</span>
                </div>

                <div className="p-4 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-sm">
                  <span className="text-[10px] uppercase font-bold text-amber-300 block">Depuración Automática</span>
                  <span className="font-serif font-black text-2xl sm:text-3xl text-white">90 Días</span>
                  <span className="text-[10px] text-slate-400 block mt-0.5">Ciclo continuo de archivo</span>
                </div>
              </div>
            </div>

            {/* Completed Events List */}
            {completedBoardEvents.length === 0 ? (
              <div className="p-12 text-center rounded-3xl bg-white border border-slate-200 space-y-3 shadow-sm font-sans">
                <CheckCircle2 className="w-12 h-12 text-slate-300 mx-auto" />
                <h3 className="font-serif font-black text-lg text-slate-700 uppercase">
                  No hay actividades archivadas en el período actual
                </h3>
                <p className="text-xs text-slate-500 max-w-md mx-auto">
                  Al marcar actividades como "EVENTO CUMPLIDO" desde la Agenda Cronológica, aparecerán reflejadas aquí con sus métricas de asistencia.
                </p>
                <button
                  onClick={() => setViewMode('timeline')}
                  className="mt-2 py-2.5 px-4 rounded-xl bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold text-xs shadow-sm"
                >
                  Ir a Agenda Cronológica
                </button>
              </div>
            ) : (
              <div className="space-y-4">
                {completedBoardEvents.map((event) => {
                  const attendeeCount = event.confirmedAttendees?.length || 0;
                  return (
                    <div 
                      key={event.id}
                      className="bg-white rounded-3xl border border-teal-200 hover:border-teal-400 p-6 shadow-sm transition-all"
                    >
                      <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4 pb-4 border-b border-slate-100">
                        <div>
                          <div className="flex flex-wrap items-center gap-2 mb-1.5 font-sans">
                            <span className="inline-flex items-center gap-1 text-[10px] font-extrabold uppercase px-2.5 py-0.5 rounded-full bg-teal-100 text-teal-900 border border-teal-300">
                              <CheckCircle2 className="w-3 h-3 text-teal-700" />
                              Evento Cumplido
                            </span>
                            <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded bg-slate-100 text-slate-700 border border-slate-200">
                              {event.typeLabel || event.type}
                            </span>
                            <span className="text-[10px] text-slate-500 font-mono">
                              Fecha Ejecución: {event.date}
                            </span>
                            {event.completedAt && (
                              <span className="text-[10px] text-teal-700 font-mono">
                                &bull; Registrado: {new Date(event.completedAt).toLocaleDateString()}
                              </span>
                            )}
                          </div>

                          <h3 className="font-serif font-black text-xl text-slate-900">
                            {event.title}
                          </h3>
                        </div>

                        <div className="flex items-center gap-2 font-sans text-xs">
                          <span className="font-bold px-3 py-1 rounded-xl bg-teal-50 text-teal-800 border border-teal-200">
                            {attendeeCount} Asistentes Confirmados
                          </span>
                        </div>
                      </div>

                      {/* Details & Location */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs text-slate-600 mt-4 font-sans">
                        <div className="flex items-center gap-2">
                          <MapPin className="w-4 h-4 text-teal-600 shrink-0" />
                          <span>{event.location}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Users className="w-4 h-4 text-sky-600 shrink-0" />
                          <span>Organizó: <strong>{event.organizer}</strong></span>
                        </div>
                      </div>

                      {event.description && (
                        <p className="text-xs text-slate-600 mt-3 font-sans leading-relaxed">
                          {event.description}
                        </p>
                      )}

                      {/* Attendee Roster */}
                      <div className="mt-4 pt-3 border-t border-slate-100 font-sans">
                        <span className="text-[11px] font-bold text-slate-700 uppercase tracking-wider block mb-2">
                          Directivos que Asistieron y Certificaron la Actividad:
                        </span>
                        {attendeeCount === 0 ? (
                          <span className="text-xs text-slate-400 italic">Sin lista nominal registrada.</span>
                        ) : (
                          <div className="flex flex-wrap items-center gap-2">
                            {event.confirmedAttendees.map((att, idx) => (
                              <span 
                                key={idx}
                                className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-slate-50 border border-slate-200 text-xs text-slate-800 font-medium"
                              >
                                <span className="w-2 h-2 rounded-full bg-teal-500" />
                                <span>{att.name}</span>
                                <span className="text-slate-500 text-[10px]">({att.role})</span>
                              </span>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* =========================================================================
            VIEW MODE: GESTIÓN DE CURSOS & CAPACITACIONES (PRESIDENCIA / DIRECTIVA)
            ========================================================================= */}
        {viewMode === 'courses_management' && currentUser.isAdminLevel && (
          <div className="space-y-6 animate-fadeIn">
            {/* Header Box */}
            <div className="bg-gradient-to-br from-sky-950 via-slate-900 to-indigo-950 text-white rounded-3xl p-6 sm:p-8 shadow-xl border border-sky-800/40">
              <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6 pb-6 border-b border-sky-800/50">
                <div>
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-sky-500/20 text-sky-300 border border-sky-400/40 text-[10px] font-extrabold uppercase tracking-wider mb-2 font-sans">
                    <GraduationCap className="w-3.5 h-3.5 text-sky-400" />
                    <span>Control Académico Oficial & Capacitación Técnica</span>
                  </div>
                  <h2 className="font-serif font-black text-2xl sm:text-3xl text-white uppercase tracking-wide">
                    Gestor de Cursos & Capacitaciones
                  </h2>
                  <p className="text-xs sm:text-sm text-sky-200/80 mt-1 max-w-2xl font-sans">
                    Publique programas de formación, talleres y masterclasses. Los agremiados solventes acceden de forma gratuita; para no afiliados se habilita el cobro en USD vía Pago Móvil Provincial.
                  </p>
                </div>

                <div className="flex flex-wrap items-center gap-3 font-sans">
                  <button
                    onClick={openNewCourseModal}
                    className="py-3 px-5 rounded-xl bg-sky-500 hover:bg-sky-600 text-slate-950 font-serif font-black text-xs uppercase tracking-wider shadow-lg flex items-center gap-2 transition-all active:scale-98"
                  >
                    <Plus className="w-4 h-4 text-slate-950" />
                    <span>Crear Nuevo Curso</span>
                  </button>
                </div>
              </div>

              {/* Course Stats */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-6 font-sans">
                <div className="p-4 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-sm">
                  <span className="text-[10px] uppercase font-bold text-sky-300 block">Cursos Publicados</span>
                  <span className="font-serif font-black text-2xl sm:text-3xl text-white">{officialCourses.length}</span>
                  <span className="text-[10px] text-slate-400 block mt-0.5">En oferta académica</span>
                </div>

                <div className="p-4 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-sm">
                  <span className="text-[10px] uppercase font-bold text-emerald-400 block">Afiliados Solventes</span>
                  <span className="font-serif font-black text-2xl sm:text-3xl text-emerald-400">100% Gratis</span>
                  <span className="text-[10px] text-slate-400 block mt-0.5">Beneficio gremial</span>
                </div>

                <div className="p-4 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-sm">
                  <span className="text-[10px] uppercase font-bold text-amber-300 block">Sincronización</span>
                  <span className="font-serif font-black text-2xl sm:text-3xl text-amber-300">En Vivo</span>
                  <span className="text-[10px] text-slate-400 block mt-0.5">Portal & Academia</span>
                </div>

                <div className="p-4 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-sm">
                  <span className="text-[10px] uppercase font-bold text-teal-300 block">Método de Pago</span>
                  <span className="font-serif font-black text-2xl sm:text-3xl text-white">Provincial</span>
                  <span className="text-[10px] text-slate-400 block mt-0.5">Pago Móvil Oficial</span>
                </div>
              </div>
            </div>

            {/* Courses Grid */}
            {officialCourses.length === 0 ? (
              <div className="p-12 text-center rounded-3xl bg-white border border-slate-200 space-y-3 shadow-sm font-sans">
                <GraduationCap className="w-12 h-12 text-slate-300 mx-auto" />
                <h3 className="font-serif font-black text-lg text-slate-700 uppercase">
                  No hay cursos o capacitaciones registradas
                </h3>
                <p className="text-xs text-slate-500 max-w-md mx-auto">
                  Haga clic en el botón a continuación para crear el primer curso oficial con sus horas académicas, instructor y aranceles.
                </p>
                <button
                  onClick={openNewCourseModal}
                  className="mt-2 py-2.5 px-4 rounded-xl bg-sky-600 hover:bg-sky-700 text-white font-bold text-xs shadow-sm"
                >
                  Publicar Primer Curso
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 font-sans">
                {officialCourses.map((course) => (
                  <div 
                    key={course.id}
                    className="bg-white rounded-3xl border border-slate-200 hover:border-sky-400 shadow-sm overflow-hidden flex flex-col justify-between transition-all"
                  >
                    <div>
                      {course.image && (
                        <div className="relative h-44 w-full overflow-hidden bg-slate-100">
                          <img 
                            src={course.image} 
                            alt={course.title} 
                            className="w-full h-full object-cover"
                          />
                          <div className="absolute top-3 left-3">
                            <span className="px-2.5 py-1 rounded-full text-[10px] font-extrabold uppercase bg-sky-600 text-white shadow-sm">
                              {course.category}
                            </span>
                          </div>
                          <div className="absolute top-3 right-3">
                            <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-white/90 text-slate-900 shadow-sm">
                              {course.hours}
                            </span>
                          </div>
                        </div>
                      )}

                      <div className="p-5 space-y-3">
                        <h3 className="font-serif font-black text-lg text-slate-900 leading-snug">
                          {course.title}
                        </h3>

                        <div className="space-y-1.5 text-xs text-slate-600">
                          <div className="flex items-center gap-2">
                            <Users className="w-3.5 h-3.5 text-sky-600 shrink-0" />
                            <span>Instructor: <strong className="text-slate-800">{course.instructor || 'Facilitador CGEM'}</strong></span>
                          </div>
                          <div className="flex items-center gap-2">
                            <CalendarIcon className="w-3.5 h-3.5 text-amber-600 shrink-0" />
                            <span>Fechas: <strong>{course.dates || 'Por definir'}</strong> ({course.schedule})</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <MapPin className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                            <span className="truncate">{course.isOnline ? 'Online / Aula Virtual' : course.location}</span>
                          </div>
                        </div>

                        <p className="text-xs text-slate-600 line-clamp-3 leading-relaxed">
                          {course.description}
                        </p>

                        <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                          <div>
                            <span className="text-[10px] font-bold text-emerald-700 block">Afiliados Solventes:</span>
                            <span className="font-extrabold text-emerald-900">Gratis</span>
                          </div>
                          <div className="text-right">
                            <span className="text-[10px] font-bold text-slate-500 block">Público General:</span>
                            <span className="font-extrabold text-slate-900">${course.priceGeneralUSD || 35} USD</span>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="p-4 bg-slate-50 border-t border-slate-100 flex items-center justify-between gap-2">
                      <span className="text-[10px] text-slate-500 font-medium">
                        Cupos: {course.spots || 25}
                      </span>
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => openEditCourseModal(course)}
                          className="p-2 rounded-lg bg-white hover:bg-slate-100 text-slate-700 border border-slate-200 text-xs font-bold flex items-center gap-1"
                        >
                          <Edit3 className="w-3.5 h-3.5 text-sky-700" />
                          <span>Editar</span>
                        </button>
                        <button
                          onClick={() => handleDeleteCourse(course.id, course.title)}
                          className="p-2 rounded-lg bg-white hover:bg-rose-50 text-slate-600 hover:text-rose-700 border border-slate-200 text-xs font-bold flex items-center gap-1"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                          <span>Eliminar</span>
                        </button>
                      </div>
                    </div>

                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* =========================================================================
            VIEW MODE: GESTIÓN DE EVENTOS & FESTIVALES PÚBLICOS (PRESIDENCIA)
            ========================================================================= */}
        {viewMode === 'events_management' && currentUser.isAdminLevel && (
          <div className="space-y-6 animate-fadeIn">
            {/* Header Box */}
            <div className="bg-gradient-to-br from-amber-950 via-slate-900 to-stone-950 text-white rounded-3xl p-6 sm:p-8 shadow-xl border border-amber-800/40">
              <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6 pb-6 border-b border-amber-800/50">
                <div>
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/20 text-amber-300 border border-amber-400/40 text-[10px] font-extrabold uppercase tracking-wider mb-2 font-sans">
                    <Ticket className="w-3.5 h-3.5 text-amber-400" />
                    <span>Cartelera Oficial & Festivales Gastronómicos 2026</span>
                  </div>
                  <h2 className="font-serif font-black text-2xl sm:text-3xl text-white uppercase tracking-wide">
                    Gestor de Eventos & Festivales
                  </h2>
                  <p className="text-xs sm:text-sm text-amber-200/80 mt-1 max-w-2xl font-sans">
                    Publique y administre los eventos y festividades públicas que se visualizarán en el Calendario Anual de Mérida Gastronómica.
                  </p>
                </div>

                <div className="flex flex-wrap items-center gap-3 font-sans">
                  <button
                    onClick={openNewPublicEventModal}
                    className="py-3 px-5 rounded-xl bg-amber-500 hover:bg-amber-600 text-slate-950 font-serif font-black text-xs uppercase tracking-wider shadow-lg flex items-center gap-2 transition-all active:scale-98"
                  >
                    <Plus className="w-4 h-4 text-slate-950" />
                    <span>Nuevo Evento / Festival</span>
                  </button>
                </div>
              </div>

              {/* Event Stats */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-6 font-sans">
                <div className="p-4 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-sm">
                  <span className="text-[10px] uppercase font-bold text-amber-300 block">Eventos Activos</span>
                  <span className="font-serif font-black text-2xl sm:text-3xl text-white">{officialEvents.length}</span>
                  <span className="text-[10px] text-slate-400 block mt-0.5">En agenda pública</span>
                </div>

                <div className="p-4 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-sm">
                  <span className="text-[10px] uppercase font-bold text-emerald-400 block">Sincronización Web</span>
                  <span className="font-serif font-black text-2xl sm:text-3xl text-emerald-400">Inmediata</span>
                  <span className="text-[10px] text-slate-400 block mt-0.5">Calendario anual</span>
                </div>

                <div className="p-4 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-sm">
                  <span className="text-[10px] uppercase font-bold text-sky-300 block">Acreditaciones</span>
                  <span className="font-serif font-black text-2xl sm:text-3xl text-sky-300">Digitales</span>
                  <span className="text-[10px] text-slate-400 block mt-0.5">Inscripción web</span>
                </div>

                <div className="p-4 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-sm">
                  <span className="text-[10px] uppercase font-bold text-teal-300 block">Garantía Gremial</span>
                  <span className="font-serif font-black text-2xl sm:text-3xl text-white">CGEM</span>
                  <span className="text-[10px] text-slate-400 block mt-0.5">Aval institucional</span>
                </div>
              </div>
            </div>

            {/* Public Events Grid */}
            {officialEvents.length === 0 ? (
              <div className="p-12 text-center rounded-3xl bg-white border border-slate-200 space-y-3 shadow-sm font-sans">
                <Ticket className="w-12 h-12 text-slate-300 mx-auto" />
                <h3 className="font-serif font-black text-lg text-slate-700 uppercase">
                  No hay eventos o festivales publicados actualmente
                </h3>
                <p className="text-xs text-slate-500 max-w-md mx-auto">
                  Agregue una nueva feria gastronómica, cata o congreso para que esté disponible para el público y turistas.
                </p>
                <button
                  onClick={openNewPublicEventModal}
                  className="mt-2 py-2.5 px-4 rounded-xl bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold text-xs shadow-sm"
                >
                  Publicar Primer Evento
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 font-sans">
                {officialEvents.map((event) => (
                  <div 
                    key={event.id}
                    className="bg-white rounded-3xl border border-slate-200 hover:border-amber-400 shadow-sm overflow-hidden flex flex-col justify-between transition-all"
                  >
                    <div>
                      {event.image && (
                        <div className="relative h-44 w-full overflow-hidden bg-slate-100">
                          <img 
                            src={event.image} 
                            alt={event.title} 
                            className="w-full h-full object-cover"
                          />
                          <div className="absolute top-3 left-3">
                            <span className="px-2.5 py-1 rounded-full text-[10px] font-extrabold uppercase bg-amber-500 text-slate-950 shadow-sm">
                              {event.month}
                            </span>
                          </div>
                          <div className="absolute top-3 right-3">
                            <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-white/90 text-slate-900 shadow-sm">
                              {event.badge}
                            </span>
                          </div>
                        </div>
                      )}

                      <div className="p-5 space-y-3">
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-100 text-emerald-800">
                          {event.category}
                        </span>

                        <h3 className="font-serif font-black text-lg text-slate-900 leading-snug">
                          {event.title}
                        </h3>

                        <div className="space-y-1.5 text-xs text-slate-600">
                          <div className="flex items-center gap-2">
                            <Clock className="w-3.5 h-3.5 text-amber-600 shrink-0" />
                            <span>Fecha: <strong>{event.date}</strong></span>
                          </div>
                          <div className="flex items-center gap-2">
                            <MapPin className="w-3.5 h-3.5 text-sky-600 shrink-0" />
                            <span className="truncate">{event.location}</span>
                          </div>
                        </div>

                        <p className="text-xs text-slate-600 line-clamp-3 leading-relaxed">
                          {event.description}
                        </p>

                        <div className="pt-2">
                          <span className="text-[10px] uppercase font-bold text-slate-500 block mb-1">Acceso:</span>
                          <span className="text-xs font-bold text-emerald-700">{event.ticketPrice}</span>
                        </div>
                      </div>
                    </div>

                    <div className="p-4 bg-slate-50 border-t border-slate-100 flex items-center justify-end gap-2">
                      <button
                        onClick={() => openEditPublicEventModal(event)}
                        className="p-2 rounded-lg bg-white hover:bg-slate-100 text-slate-700 border border-slate-200 text-xs font-bold flex items-center gap-1"
                      >
                        <Edit3 className="w-3.5 h-3.5 text-amber-700" />
                        <span>Editar</span>
                      </button>
                      <button
                        onClick={() => handleDeletePublicEvent(event.id, event.title)}
                        className="p-2 rounded-lg bg-white hover:bg-rose-50 text-slate-600 hover:text-rose-700 border border-slate-200 text-xs font-bold flex items-center gap-1"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                        <span>Eliminar</span>
                      </button>
                    </div>

                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* =========================================================================
            VIEW MODE: VINCULACIONES TURÍSTICAS & SERVICIOS (PRESIDENCIA)
            ========================================================================= */}
        {viewMode === 'tourist_services' && currentUser.isAdminLevel && (
          <div className="space-y-6 animate-fadeIn">
            {/* Header Box */}
            <div className="bg-gradient-to-br from-purple-950 via-slate-900 to-indigo-950 text-white rounded-3xl p-6 sm:p-8 shadow-xl border border-purple-800/40">
              <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6 pb-6 border-b border-purple-800/50">
                <div>
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-500/20 text-purple-300 border border-purple-400/40 text-[10px] font-extrabold uppercase tracking-wider mb-2 font-sans">
                    <Compass className="w-3.5 h-3.5 text-purple-400" />
                    <span>Convenios & Prestadores Homologados</span>
                  </div>
                  <h2 className="font-serif font-black text-2xl sm:text-3xl text-white uppercase tracking-wide">
                    Gestor de Vinculaciones Turísticas
                  </h2>
                  <p className="text-xs sm:text-sm text-purple-200/80 mt-1 max-w-2xl font-sans">
                    Cargue y administre los operadores turísticos oficiales, traslados, experiencias de montaña y servicios VIP de Mérida Gastronómica.
                  </p>
                </div>

                <div className="flex flex-wrap items-center gap-3 font-sans">
                  <button
                    onClick={openNewTouristServiceModal}
                    className="py-3 px-5 rounded-xl bg-purple-500 hover:bg-purple-600 text-slate-950 font-serif font-black text-xs uppercase tracking-wider shadow-lg flex items-center gap-2 transition-all active:scale-98"
                  >
                    <Plus className="w-4 h-4 text-slate-950" />
                    <span>Nuevo Servicio Turístico</span>
                  </button>
                </div>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-6 font-sans">
                <div className="p-4 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-sm">
                  <span className="text-[10px] uppercase font-bold text-purple-300 block">Servicios Activos</span>
                  <span className="font-serif font-black text-2xl sm:text-3xl text-white">{touristServices.length}</span>
                  <span className="text-[10px] text-slate-400 block mt-0.5">En portal público</span>
                </div>

                <div className="p-4 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-sm">
                  <span className="text-[10px] uppercase font-bold text-emerald-400 block">Certificación</span>
                  <span className="font-serif font-black text-2xl sm:text-3xl text-emerald-400">Oficial</span>
                  <span className="text-[10px] text-slate-400 block mt-0.5">Aval CGEM</span>
                </div>

                <div className="p-4 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-sm">
                  <span className="text-[10px] uppercase font-bold text-sky-300 block">Atención Directa</span>
                  <span className="font-serif font-black text-2xl sm:text-3xl text-sky-300">WhatsApp</span>
                  <span className="text-[10px] text-slate-400 block mt-0.5">Contacto concierge</span>
                </div>

                <div className="p-4 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-sm">
                  <span className="text-[10px] uppercase font-bold text-amber-300 block">Estado Web</span>
                  <span className="font-serif font-black text-2xl sm:text-3xl text-white">Sincronizado</span>
                  <span className="text-[10px] text-slate-400 block mt-0.5">Tiempo real</span>
                </div>
              </div>
            </div>

            {/* Tourist Services Grid */}
            {touristServices.length === 0 ? (
              <div className="p-12 text-center rounded-3xl bg-white border border-slate-200 space-y-3 shadow-sm font-sans">
                <Compass className="w-12 h-12 text-slate-300 mx-auto" />
                <h3 className="font-serif font-black text-lg text-slate-700 uppercase">
                  No hay vinculaciones turísticas registradas actualmente
                </h3>
                <p className="text-xs text-slate-500 max-w-md mx-auto">
                  Agregue convenios con operadores de transporte 4x4, posadas, senderismo o experiencias gastronómicas para mostrarlas al público y turistas.
                </p>
                <button
                  onClick={openNewTouristServiceModal}
                  className="mt-2 py-2.5 px-4 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs shadow-sm"
                >
                  Agregar Primer Servicio Turístico
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 font-sans">
                {touristServices.map((service) => (
                  <div 
                    key={service.id}
                    className="bg-white rounded-3xl border border-slate-200 hover:border-purple-400 shadow-sm overflow-hidden flex flex-col justify-between transition-all"
                  >
                    <div>
                      {service.image ? (
                        <div className="relative h-44 w-full overflow-hidden bg-slate-100">
                          <img 
                            src={service.image} 
                            alt={service.title} 
                            className="w-full h-full object-cover"
                          />
                          {service.badge && (
                            <div className="absolute top-3 right-3">
                              <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-white/90 text-slate-900 shadow-sm">
                                {service.badge}
                              </span>
                            </div>
                          )}
                        </div>
                      ) : (
                        <div className="h-28 w-full bg-slate-100 flex items-center justify-center text-purple-600">
                          <Compass className="w-8 h-8" />
                        </div>
                      )}

                      <div className="p-5 space-y-3">
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-purple-100 text-purple-800">
                          {service.category}
                        </span>

                        <h3 className="font-serif font-black text-lg text-slate-900 leading-snug">
                          {service.title}
                        </h3>

                        <div className="space-y-1.5 text-xs text-slate-600">
                          {service.location && (
                            <div className="flex items-center gap-2">
                              <MapPin className="w-3.5 h-3.5 text-purple-600 shrink-0" />
                              <span className="truncate">{service.location}</span>
                            </div>
                          )}
                          {service.contactWhatsapp && (
                            <div className="flex items-center gap-2">
                              <Phone className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                              <span>WhatsApp: <strong>{service.contactWhatsapp}</strong></span>
                            </div>
                          )}
                        </div>

                        <p className="text-xs text-slate-600 line-clamp-3 leading-relaxed">
                          {service.description}
                        </p>

                        {service.priceFrom && (
                          <div className="pt-2">
                            <span className="text-[10px] uppercase font-bold text-slate-500 block mb-1">Tarifa:</span>
                            <span className="text-xs font-bold text-purple-700">{service.priceFrom} {service.unit}</span>
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="p-4 bg-slate-50 border-t border-slate-100 flex items-center justify-end gap-2">
                      <button
                        onClick={() => openEditTouristServiceModal(service)}
                        className="p-2 rounded-lg bg-white hover:bg-slate-100 text-slate-700 border border-slate-200 text-xs font-bold flex items-center gap-1"
                      >
                        <Edit3 className="w-3.5 h-3.5 text-purple-700" />
                        <span>Editar</span>
                      </button>
                      <button
                        onClick={() => handleDeleteTouristService(service.id, service.title)}
                        className="p-2 rounded-lg bg-white hover:bg-rose-50 text-slate-600 hover:text-rose-700 border border-slate-200 text-xs font-bold flex items-center gap-1"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                        <span>Eliminar</span>
                      </button>
                    </div>

                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* =========================================================================
            VIEW MODE 3: BOARD DIRECTORY
            ========================================================================= */}
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

                    <div className="flex items-center gap-3.5 mb-3">
                      <div className="relative shrink-0">
                        <img 
                          src={member.avatar} 
                          alt={member.name}
                          className="w-14 h-14 rounded-2xl object-cover border-2 border-amber-300 shadow-sm"
                        />
                        <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-amber-500 rounded-full border-2 border-white flex items-center justify-center text-white text-[9px] font-bold">
                          ✓
                        </div>
                      </div>
                      <div className="min-w-0 flex-1">
                        <h4 className="font-serif font-black text-base text-slate-900 truncate">
                          {member.name}
                        </h4>
                        <p className="text-xs font-bold text-amber-800 font-sans truncate">
                          {member.role}
                        </p>
                      </div>
                    </div>

                    <div className="mt-4 pt-3 border-t border-slate-100 space-y-1.5 text-xs text-slate-600 font-sans">
                      {member.instagram && (
                        <div className="flex justify-between">
                          <span>Instagram:</span>
                          <span className="text-amber-800 font-bold">{member.instagram}</span>
                        </div>
                      )}
                      <div className="flex justify-between">
                          <span>Correo:</span>
                        <span className="text-slate-900 truncate max-w-[170px]" title={member.email}>{member.email}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Acceso:</span>
                        <span className={member.hasPasswordSet ? 'text-emerald-700 font-bold' : 'text-slate-400'}>
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

        {/* =========================================================================
            VIEW MODE 4: LEGAL RESOURCES & DOCUMENTS MANAGER (EXCLUSIVO PRESIDENTE)
            ========================================================================= */}
        {viewMode === 'legal_resources' && isPresident && (
          <div className="space-y-8">
            
            {/* Header info box */}
            <div className="bg-gradient-to-br from-indigo-950 via-slate-900 to-indigo-900 text-white rounded-3xl p-6 sm:p-8 shadow-xl border border-indigo-800/40">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div>
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-400/40 text-[10px] font-extrabold uppercase tracking-wider mb-3">
                    <ShieldCheck className="w-3.5 h-3.5 text-indigo-400" />
                    <span>Facultad Exclusiva de Presidencia</span>
                  </div>
                  <h2 className="font-serif font-black text-2xl sm:text-3xl text-white">
                    Gestor de Recursos & Marco Jurídico Institucional
                  </h2>
                  <p className="text-xs sm:text-sm text-slate-300 mt-2 max-w-3xl leading-relaxed font-sans">
                    Como Presidente de la Cámara Gastronómica del Estado Mérida, usted puede cargar, editar o actualizar las leyes, providencias del SENIAT, normativas sanitarias (SACS), ordenanzas municipales de licores y guías técnicas. 
                    <strong className="text-amber-300 block mt-1">Los documentos guardados aquí quedan inmediatamente disponibles para descarga pública en la sección "Marco Legal".</strong>
                  </p>
                </div>

                <button
                  onClick={() => openNewLegalDocModal('fiscal')}
                  className="py-3.5 px-6 rounded-2xl bg-amber-500 hover:bg-amber-600 text-slate-950 font-serif font-black text-xs uppercase tracking-wider shadow-lg shrink-0 flex items-center justify-center gap-2 transition-all active:scale-98"
                >
                  <Plus className="w-4 h-4 text-slate-950" />
                  <span>Cargar Nuevo Documento</span>
                </button>
              </div>
            </div>

            {/* List by Categories */}
            <div className="space-y-8">
              {legalCategories.map((category) => {
                const items = category.items || [];
                return (
                  <div 
                    key={category.id} 
                    className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-7 shadow-sm overflow-hidden"
                  >
                    {/* Category Title & Action */}
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
                      <div>
                        <div className="flex items-center gap-2.5">
                          <span className="p-2 rounded-xl bg-indigo-50 text-indigo-700 border border-indigo-200">
                            <BookOpen className="w-4 h-4" />
                          </span>
                          <h3 className="font-serif font-bold text-lg text-slate-900">
                            {category.name}
                          </h3>
                        </div>
                        <p className="text-xs text-slate-500 mt-1 font-sans">
                          {category.description}
                        </p>
                      </div>

                      <div className="flex items-center gap-3">
                        <span className="text-xs font-bold px-3 py-1 rounded-full bg-slate-100 text-slate-700 border border-slate-200 font-sans">
                          {items.length} {items.length === 1 ? 'documento' : 'documentos'}
                        </span>
                        <button
                          onClick={() => openNewLegalDocModal(category.id)}
                          className="py-2 px-3.5 rounded-xl bg-indigo-50 hover:bg-indigo-100 text-indigo-700 font-bold text-xs flex items-center gap-1.5 border border-indigo-200 transition-all font-sans"
                        >
                          <Plus className="w-3.5 h-3.5" />
                          <span>Agregar a esta sección</span>
                        </button>
                      </div>
                    </div>

                    {/* Documents List */}
                    {items.length === 0 ? (
                      <div className="py-8 text-center text-slate-400 space-y-2 font-sans">
                        <FolderOpen className="w-8 h-8 text-slate-300 mx-auto" />
                        <p className="text-xs">No hay documentos registrados en esta sección aún.</p>
                        <button
                          onClick={() => openNewLegalDocModal(category.id)}
                          className="text-xs font-bold text-indigo-600 hover:text-indigo-800 underline"
                        >
                          + Cargar el primer documento para {category.name}
                        </button>
                      </div>
                    ) : (
                      <div className="divide-y divide-slate-100 mt-2">
                        {items.map((doc) => (
                          <div 
                            key={doc.id}
                            className="py-4 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 hover:bg-slate-50/70 p-3 rounded-2xl transition-colors"
                          >
                            <div className="space-y-1.5 flex-1">
                              <div className="flex flex-wrap items-center gap-2">
                                <span className="text-[10px] uppercase font-extrabold px-2.5 py-0.5 rounded-md bg-indigo-100 text-indigo-900 border border-indigo-200 font-sans">
                                  {doc.category || 'Organismo Oficial'}
                                </span>
                                <span className="text-[11px] font-bold text-slate-500 font-sans">
                                  {doc.format || 'PDF'} {doc.size ? `• ${doc.size}` : ''}
                                </span>
                                <span className="text-[11px] text-slate-400 font-sans">
                                  Vigencia: <strong>{doc.dateUpdated || 'Vigente'}</strong>
                                </span>
                                {doc.isOfficial && (
                                  <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 font-sans">
                                    Oficial
                                  </span>
                                )}
                              </div>

                              <h4 className="font-serif font-bold text-base text-slate-900">
                                {doc.title}
                              </h4>

                              <p className="text-xs text-slate-600 leading-relaxed font-sans line-clamp-2 max-w-3xl">
                                {doc.summary}
                              </p>

                              {doc.fileUrl && (
                                <div className="text-[11px] text-indigo-600 flex items-center gap-1 font-sans">
                                  <ExternalLink className="w-3 h-3" />
                                  <a href={doc.fileUrl} target="_blank" rel="noreferrer" className="hover:underline truncate max-w-md">
                                    {doc.fileUrl}
                                  </a>
                                </div>
                              )}
                            </div>

                            {/* Actions */}
                            <div className="flex items-center gap-2 shrink-0 self-end md:self-center font-sans">
                              <button
                                onClick={() => openEditLegalDocModal(doc, category.id)}
                                className="p-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs flex items-center gap-1.5 transition-colors"
                                title="Editar ficha del documento"
                              >
                                <Edit3 className="w-3.5 h-3.5 text-indigo-700" />
                                <span>Editar</span>
                              </button>

                              <button
                                onClick={() => handleDeleteLegalDoc(category.id, doc.id, doc.title)}
                                className="p-2.5 rounded-xl bg-slate-100 hover:bg-rose-100 text-slate-600 hover:text-rose-700 font-bold text-xs flex items-center gap-1.5 transition-colors"
                                title="Eliminar documento"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                                <span>Eliminar</span>
                              </button>
                            </div>

                          </div>
                        ))}
                      </div>
                    )}

                  </div>
                );
              })}
            </div>

          </div>
        )}

      </div>

      {/* =========================================================================
          MODAL: CREATE / EDIT DIRECTORIO AGREMIADO (SUPABASE BACKED)
          ========================================================================= */}
      {isMemberModalOpen && canAccessDirectory && (
        <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto animate-fadeIn">
          <div className="bg-white border border-slate-200 rounded-3xl max-w-3xl w-full p-6 sm:p-8 shadow-2xl relative my-8 max-h-[90vh] overflow-y-auto">
            
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-2xl bg-emerald-100 text-emerald-800 border border-emerald-300">
                  <Building2 className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-serif font-black text-xl text-slate-900 uppercase tracking-wider">
                    {editingMember ? 'Editar Datos del Agremiado' : 'Registrar Nuevo Agremiado'}
                  </h3>
                  <p className="text-xs text-slate-500 font-sans">
                    Directorio Oficial CGEM &bull; Respaldo en la nube
                  </p>
                </div>
              </div>

              <button
                onClick={() => setIsMemberModalOpen(false)}
                className="p-2 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-600 transition-colors font-sans"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSaveMember} className="mt-6 space-y-4 text-xs font-sans">
              
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="sm:col-span-2">
                  <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                    Nombre del Establecimiento / Marca *
                  </label>
                  <input
                    type="text"
                    required
                    value={memberFormData.nombre_establecimiento}
                    onChange={(e) => setMemberFormData({ ...memberFormData, nombre_establecimiento: e.target.value })}
                    placeholder="ej: Kaffia Caffe / Cervecería Frailejón"
                    className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-300 text-slate-900 placeholder-slate-400 text-sm focus:outline-none focus:border-emerald-500 focus:bg-white"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                    Código de Afiliado *
                  </label>
                  <input
                    type="text"
                    required
                    value={memberFormData.codigo_afiliado}
                    onChange={(e) => setMemberFormData({ ...memberFormData, codigo_afiliado: e.target.value })}
                    placeholder="CGM-2026-001"
                    className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-300 text-slate-900 font-mono font-bold text-sm focus:outline-none focus:border-emerald-500 focus:bg-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                    Segmento / Categoría *
                  </label>
                  <select
                    value={memberFormData.categoria_negocio}
                    onChange={(e) => setMemberFormData({ ...memberFormData, categoria_negocio: e.target.value })}
                    className="w-full px-3 py-3 rounded-xl bg-slate-50 border border-slate-300 text-slate-900 text-sm focus:outline-none focus:border-emerald-500 focus:bg-white font-medium"
                  >
                    <option value="Grandes Empresas (20+ empleados)">Grandes Empresas (20+ empleados)</option>
                    <option value="Empresas (5 a 19 empleados)">Empresas / PYMEs (5 a 19 empleados)</option>
                    <option value="Marca Personal y Emprendimientos">Marca Personal y Emprendimientos (&lt;5 emp)</option>
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                    Representante Legal / Propietario *
                  </label>
                  <input
                    type="text"
                    required
                    value={memberFormData.representante_legal}
                    onChange={(e) => setMemberFormData({ ...memberFormData, representante_legal: e.target.value })}
                    placeholder="ej: Carlos Mendoza"
                    className="w-full px-3 py-3 rounded-xl bg-slate-50 border border-slate-300 text-slate-900 text-sm focus:outline-none focus:border-emerald-500 focus:bg-white"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                    RIF o Cédula de Identidad
                  </label>
                  <input
                    type="text"
                    value={memberFormData.rif_cedula}
                    onChange={(e) => setMemberFormData({ ...memberFormData, rif_cedula: e.target.value })}
                    placeholder="ej: J-50123849-2 / V-14.281.902"
                    className="w-full px-3 py-3 rounded-xl bg-slate-50 border border-slate-300 text-slate-900 text-sm focus:outline-none focus:border-emerald-500 focus:bg-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                    Teléfono & WhatsApp de Contacto *
                  </label>
                  <input
                    type="tel"
                    required
                    value={memberFormData.telefono}
                    onChange={(e) => setMemberFormData({ ...memberFormData, telefono: e.target.value })}
                    placeholder="+58 414-8817137"
                    className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-300 text-slate-900 text-sm focus:outline-none focus:border-emerald-500 focus:bg-white"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                    Correo Electrónico *
                  </label>
                  <input
                    type="email"
                    required
                    value={memberFormData.email}
                    onChange={(e) => setMemberFormData({ ...memberFormData, email: e.target.value })}
                    placeholder="contacto@establecimiento.com"
                    className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-300 text-slate-900 text-sm focus:outline-none focus:border-emerald-500 focus:bg-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="sm:col-span-2">
                  <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                    Dirección Física del Establecimiento
                  </label>
                  <input
                    type="text"
                    value={memberFormData.direccion_completa}
                    onChange={(e) => setMemberFormData({ ...memberFormData, direccion_completa: e.target.value })}
                    placeholder="ej: Av. 4 entre Calles 19 y 20, Centro Histórico"
                    className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-300 text-slate-900 text-sm focus:outline-none focus:border-emerald-500 focus:bg-white"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                    Municipio
                  </label>
                  <select
                    value={memberFormData.municipio}
                    onChange={(e) => setMemberFormData({ ...memberFormData, municipio: e.target.value })}
                    className="w-full px-3 py-3 rounded-xl bg-slate-50 border border-slate-300 text-slate-900 text-sm focus:outline-none focus:border-emerald-500 focus:bg-white"
                  >
                    <option value="Libertador">Libertador (Mérida)</option>
                    <option value="Campo Elías">Campo Elías (Ejido)</option>
                    <option value="Santos Marquina">Santos Marquina (Tabay)</option>
                    <option value="Rangel">Rangel (Mucuchíes)</option>
                    <option value="Cardenal Quintero">Cardenal Quintero</option>
                    <option value="Pueblo Llano">Pueblo Llano</option>
                    <option value="Tovar">Tovar</option>
                    <option value="Alberto Adriani">Alberto Adriani (El Vigía)</option>
                    <option value="Sucre">Sucre (Lagunillas)</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
                <div>
                  <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                    Instagram
                  </label>
                  <input
                    type="text"
                    value={memberFormData.instagram}
                    onChange={(e) => setMemberFormData({ ...memberFormData, instagram: e.target.value })}
                    placeholder="@establecimiento"
                    className="w-full px-3 py-3 rounded-xl bg-slate-50 border border-slate-300 text-slate-900 text-sm focus:outline-none focus:border-emerald-500 focus:bg-white"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                    N° Empleados
                  </label>
                  <input
                    type="number"
                    min="1"
                    value={memberFormData.numero_empleados}
                    onChange={(e) => setMemberFormData({ ...memberFormData, numero_empleados: e.target.value })}
                    className="w-full px-3 py-3 rounded-xl bg-slate-50 border border-slate-300 text-slate-900 text-sm focus:outline-none focus:border-emerald-500 focus:bg-white"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                    Cuota Mes (USD)
                  </label>
                  <input
                    type="number"
                    min="0"
                    value={memberFormData.monto_cuota_mensual}
                    onChange={(e) => setMemberFormData({ ...memberFormData, monto_cuota_mensual: e.target.value })}
                    className="w-full px-3 py-3 rounded-xl bg-slate-50 border border-slate-300 text-slate-900 text-sm focus:outline-none focus:border-emerald-500 focus:bg-white"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                    Estado Solvencia *
                  </label>
                  <select
                    value={memberFormData.estado_solvencia}
                    onChange={(e) => setMemberFormData({ ...memberFormData, estado_solvencia: e.target.value })}
                    className="w-full px-3 py-3 rounded-xl bg-slate-50 border border-slate-300 text-slate-900 text-sm focus:outline-none focus:border-emerald-500 focus:bg-white font-bold"
                  >
                    <option value="Solvente (Activo)">Solvente (Activo)</option>
                    <option value="En Revisión">En Revisión</option>
                    <option value="Pendiente de Pago">Pendiente de Pago</option>
                    <option value="Inactivo">Inactivo</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Observaciones Internas / Compromiso de Transición
                </label>
                <textarea
                  rows={2}
                  value={memberFormData.observaciones}
                  onChange={(e) => setMemberFormData({ ...memberFormData, observaciones: e.target.value })}
                  placeholder="Detalles sobre acuerdos de pago, asesorías de formalización o notas de la Junta Directiva..."
                  className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-300 text-slate-900 placeholder-slate-400 text-sm focus:outline-none focus:border-emerald-500 focus:bg-white leading-relaxed"
                />
              </div>

              <div className="pt-4 flex items-center justify-end gap-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsMemberModalOpen(false)}
                  className="py-3 px-5 rounded-xl bg-slate-100 text-slate-700 hover:bg-slate-200 font-bold text-xs"
                >
                  Cancelar
                </button>

                <button
                  type="submit"
                  className="py-3 px-6 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-serif font-black text-xs uppercase tracking-widest flex items-center gap-2 shadow-md active:scale-98"
                >
                  <Check className="w-4 h-4" />
                  <span>{editingMember ? 'Actualizar Agremiado' : 'Guardar en Directorio'}</span>
                </button>
              </div>

            </form>

          </div>
        </div>
      )}

      {/* CREATE / EDIT AGENDA EVENT MODAL (ADMIN ONLY) */}
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
                className="p-2 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-600 transition-colors font-sans"
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
                  className="py-3 px-6 rounded-xl bg-amber-500 hover:bg-amber-600 text-slate-950 font-serif font-black text-xs uppercase tracking-widest flex items-center gap-2 shadow-md active:scale-98"
                >
                  <Check className="w-4 h-4" />
                  <span>{editingEvent ? 'Guardar Cambios' : 'Agendar Actividad'}</span>
                </button>
              </div>

            </form>

          </div>
        </div>
      )}

      {/* CREATE / EDIT LEGAL DOCUMENT MODAL (PRESIDENT ONLY) */}
      {isLegalModalOpen && isPresident && (
        <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto animate-fadeIn">
          <div className="bg-white border border-slate-200 rounded-3xl max-w-2xl w-full p-6 sm:p-8 shadow-2xl relative my-8 max-h-[90vh] overflow-y-auto">
            
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-2xl bg-indigo-100 text-indigo-800 border border-indigo-200">
                  <FolderPlus className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-serif font-black text-xl text-slate-900 uppercase tracking-wider">
                    {editingLegalDoc ? 'Editar Documento en Repositorio' : 'Cargar Nuevo Documento al Repositorio'}
                  </h3>
                  <p className="text-xs text-slate-500 font-sans">
                    Centro de Recursos & Marco Jurídico &bull; CGEM
                  </p>
                </div>
              </div>

              <button
                onClick={() => setIsLegalModalOpen(false)}
                className="p-2 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-600 transition-colors font-sans"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSaveLegalDoc} className="mt-6 space-y-4 text-xs font-sans">
              
              <div>
                <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Título Completo del Documento / Normativa *
                </label>
                <input
                  type="text"
                  required
                  value={legalFormData.title}
                  onChange={(e) => setLegalFormData({ ...legalFormData, title: e.target.value })}
                  placeholder="ej: Providencia Administrativa SENIAT SNAT/2024/000032 - Uso de Máquinas Fiscales"
                  className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-300 text-slate-900 placeholder-slate-400 text-sm focus:outline-none focus:border-indigo-500 focus:bg-white"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                    Sección / Módulo Jurídico *
                  </label>
                  <select
                    value={legalFormData.categoryId}
                    onChange={(e) => setLegalFormData({ ...legalFormData, categoryId: e.target.value })}
                    className="w-full px-3 py-3 rounded-xl bg-slate-50 border border-slate-300 text-slate-900 text-sm focus:outline-none focus:border-indigo-500 focus:bg-white font-medium"
                  >
                    {legalCategories.map((cat) => (
                      <option key={cat.id} value={cat.id}>
                        {cat.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                    Organismo Regulador / Etiqueta *
                  </label>
                  <input
                    type="text"
                    required
                    value={legalFormData.categoryTag}
                    onChange={(e) => setLegalFormData({ ...legalFormData, categoryTag: e.target.value })}
                    placeholder="ej: SENIAT Nacional, SAMAT, SACS, INATUR..."
                    className="w-full px-3 py-3 rounded-xl bg-slate-50 border border-slate-300 text-slate-900 text-sm focus:outline-none focus:border-indigo-500 focus:bg-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                    Formato *
                  </label>
                  <select
                    value={legalFormData.format}
                    onChange={(e) => setLegalFormData({ ...legalFormData, format: e.target.value })}
                    className="w-full px-3 py-3 rounded-xl bg-slate-50 border border-slate-300 text-slate-900 text-sm focus:outline-none focus:border-indigo-500 focus:bg-white"
                  >
                    <option value="PDF">PDF (Documento Oficial)</option>
                    <option value="DOCX">Word (DOCX / Modelo)</option>
                    <option value="XLSX">Excel (XLSX / Hoja Cálculo)</option>
                    <option value="ZIP">ZIP (Paquete Normativo)</option>
                    <option value="Enlace Web">Enlace Web Oficial</option>
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                    Tamaño / Referencia
                  </label>
                  <input
                    type="text"
                    value={legalFormData.size}
                    onChange={(e) => setLegalFormData({ ...legalFormData, size: e.target.value })}
                    placeholder="ej: 2.4 MB"
                    className="w-full px-3 py-3 rounded-xl bg-slate-50 border border-slate-300 text-slate-900 text-sm focus:outline-none focus:border-indigo-500 focus:bg-white"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                    Fecha de Vigencia *
                  </label>
                  <input
                    type="text"
                    required
                    value={legalFormData.dateUpdated}
                    onChange={(e) => setLegalFormData({ ...legalFormData, dateUpdated: e.target.value })}
                    placeholder="ej: Octubre 2026 / Vigente"
                    className="w-full px-3 py-3 rounded-xl bg-slate-50 border border-slate-300 text-slate-900 text-sm focus:outline-none focus:border-indigo-500 focus:bg-white"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Enlace de Descarga o Repositorio en la Nube (URL)
                </label>
                <input
                  type="url"
                  value={legalFormData.fileUrl}
                  onChange={(e) => setLegalFormData({ ...legalFormData, fileUrl: e.target.value })}
                  placeholder="https://drive.google.com/... o enlace directo al PDF"
                  className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-300 text-slate-900 placeholder-slate-400 text-sm focus:outline-none focus:border-indigo-500 focus:bg-white"
                />
                <p className="text-[11px] text-slate-500 mt-1">
                  Si deja el enlace vacío, el sistema generará automáticamente la ficha técnica oficial descargable para los usuarios.
                </p>
              </div>

              <div>
                <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Resumen del Contenido & Ficha Técnica *
                </label>
                <textarea
                  rows={4}
                  required
                  value={legalFormData.summary}
                  onChange={(e) => setLegalFormData({ ...legalFormData, summary: e.target.value })}
                  placeholder="Detalles sobre el alcance normativo, deberes formales, excepciones, multas aplicables o pasos para su cumplimiento en restaurantes y cafeterías..."
                  className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-300 text-slate-900 placeholder-slate-400 text-sm focus:outline-none focus:border-indigo-500 focus:bg-white leading-relaxed"
                />
              </div>

              <div className="flex items-center gap-2 pt-2">
                <input
                  type="checkbox"
                  id="isOfficialCheck"
                  checked={legalFormData.isOfficial}
                  onChange={(e) => setLegalFormData({ ...legalFormData, isOfficial: e.target.checked })}
                  className="w-4 h-4 rounded text-indigo-600 focus:ring-indigo-500 border-slate-300"
                />
                <label htmlFor="isOfficialCheck" className="text-xs font-bold text-slate-700 cursor-pointer">
                  Marcar como Normativa Legal Oficial de Obligatorio Cumplimiento
                </label>
              </div>

              <div className="pt-4 flex items-center justify-end gap-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsLegalModalOpen(false)}
                  className="py-3 px-5 rounded-xl bg-slate-100 text-slate-700 hover:bg-slate-200 font-bold text-xs"
                >
                  Cancelar
                </button>

                <button
                  type="submit"
                  className="py-3 px-6 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-serif font-black text-xs uppercase tracking-widest flex items-center gap-2 shadow-md active:scale-98"
                >
                  <Check className="w-4 h-4" />
                  <span>{editingLegalDoc ? 'Actualizar Documento' : 'Publicar Documento'}</span>
                </button>
              </div>

            </form>

          </div>
        </div>
      )}

      {/* =========================================================================
          MODAL: CREATE / EDIT OFFICIAL COURSE (PRESIDENCY / ACADEMY)
          ========================================================================= */}
      {isCourseModalOpen && currentUser.isAdminLevel && (
        <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto animate-fadeIn font-sans">
          <div className="bg-white border border-slate-200 rounded-3xl max-w-2xl w-full p-6 sm:p-8 shadow-2xl relative my-8 max-h-[90vh] overflow-y-auto text-slate-800">
            
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-2xl bg-sky-100 text-sky-800 border border-sky-300">
                  <GraduationCap className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-serif font-black text-xl text-slate-900 uppercase tracking-wider">
                    {editingCourse ? 'Editar Programa de Capacitación' : 'Publicar Nuevo Curso Oficial'}
                  </h3>
                  <p className="text-xs text-slate-500">
                    Academia Gastronómica CGEM &bull; Oferta Formativa
                  </p>
                </div>
              </div>

              <button
                onClick={() => setIsCourseModalOpen(false)}
                className="p-2 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-600 transition-colors"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSaveCourse} className="mt-6 space-y-4 text-xs">
              <div>
                <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Título del Curso / Taller *
                </label>
                <input
                  type="text"
                  required
                  value={courseFormData.title}
                  onChange={(e) => setCourseFormData({ ...courseFormData, title: e.target.value })}
                  placeholder="ej: Costos Gastronómicos & Estandarización de Recetas 2026"
                  className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-300 text-slate-900 font-medium text-sm focus:outline-none focus:border-sky-500 focus:bg-white"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                    Horas Académicas *
                  </label>
                  <input
                    type="text"
                    required
                    value={courseFormData.hours}
                    onChange={(e) => setCourseFormData({ ...courseFormData, hours: e.target.value })}
                    placeholder="ej: 16 Horas Académicas"
                    className="w-full px-3 py-3 rounded-xl bg-slate-50 border border-slate-300 text-slate-900 text-sm focus:outline-none focus:border-sky-500 focus:bg-white"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                    Categoría Formativa *
                  </label>
                  <input
                    type="text"
                    required
                    value={courseFormData.category}
                    onChange={(e) => setCourseFormData({ ...courseFormData, category: e.target.value })}
                    placeholder="ej: Gestión & Finanzas, Cocina Andina, Barismo..."
                    className="w-full px-3 py-3 rounded-xl bg-slate-50 border border-slate-300 text-slate-900 text-sm focus:outline-none focus:border-sky-500 focus:bg-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                    Fechas Programadas *
                  </label>
                  <input
                    type="text"
                    required
                    value={courseFormData.dates}
                    onChange={(e) => setCourseFormData({ ...courseFormData, dates: e.target.value })}
                    placeholder="ej: 15 y 16 de Noviembre 2026"
                    className="w-full px-3 py-3 rounded-xl bg-slate-50 border border-slate-300 text-slate-900 text-sm focus:outline-none focus:border-sky-500 focus:bg-white"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                    Horario de Clases *
                  </label>
                  <input
                    type="text"
                    required
                    value={courseFormData.schedule}
                    onChange={(e) => setCourseFormData({ ...courseFormData, schedule: e.target.value })}
                    placeholder="ej: 09:00 AM - 01:00 PM"
                    className="w-full px-3 py-3 rounded-xl bg-slate-50 border border-slate-300 text-slate-900 text-sm focus:outline-none focus:border-sky-500 focus:bg-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                    Instructor / Facilitador *
                  </label>
                  <input
                    type="text"
                    required
                    value={courseFormData.instructor}
                    onChange={(e) => setCourseFormData({ ...courseFormData, instructor: e.target.value })}
                    placeholder="ej: Chef Ejecutivo / Especialista ULA"
                    className="w-full px-3 py-3 rounded-xl bg-slate-50 border border-slate-300 text-slate-900 text-sm focus:outline-none focus:border-sky-500 focus:bg-white"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                    Locación / Sede Física *
                  </label>
                  <input
                    type="text"
                    required
                    value={courseFormData.location}
                    onChange={(e) => setCourseFormData({ ...courseFormData, location: e.target.value })}
                    placeholder="ej: Sede CGEM / Laboratorio Hotel Escuela ULA"
                    className="w-full px-3 py-3 rounded-xl bg-slate-50 border border-slate-300 text-slate-900 text-sm focus:outline-none focus:border-sky-500 focus:bg-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                    Cupos Disponibles
                  </label>
                  <input
                    type="number"
                    min={1}
                    value={courseFormData.spots}
                    onChange={(e) => setCourseFormData({ ...courseFormData, spots: parseInt(e.target.value, 10) || 20 })}
                    className="w-full px-3 py-3 rounded-xl bg-slate-50 border border-slate-300 text-slate-900 text-sm focus:outline-none focus:border-sky-500 focus:bg-white"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                    Arancel Miembro Solvente
                  </label>
                  <input
                    type="text"
                    value={courseFormData.priceMemberText}
                    onChange={(e) => setCourseFormData({ ...courseFormData, priceMemberText: e.target.value })}
                    className="w-full px-3 py-3 rounded-xl bg-slate-50 border border-slate-300 text-slate-900 text-sm focus:outline-none focus:border-sky-500 focus:bg-white"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                    Precio Público General (USD)
                  </label>
                  <input
                    type="number"
                    min={0}
                    value={courseFormData.priceGeneralUSD}
                    onChange={(e) => setCourseFormData({ ...courseFormData, priceGeneralUSD: parseFloat(e.target.value) || 0 })}
                    className="w-full px-3 py-3 rounded-xl bg-slate-50 border border-slate-300 text-slate-900 text-sm focus:outline-none focus:border-sky-500 focus:bg-white"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Imagen Referencial (URL)
                </label>
                <input
                  type="url"
                  value={courseFormData.image}
                  onChange={(e) => setCourseFormData({ ...courseFormData, image: e.target.value })}
                  placeholder="https://images.unsplash.com/..."
                  className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-300 text-slate-900 text-sm focus:outline-none focus:border-sky-500 focus:bg-white"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Descripción & Contenido Programático *
                </label>
                <textarea
                  rows={4}
                  required
                  value={courseFormData.description}
                  onChange={(e) => setCourseFormData({ ...courseFormData, description: e.target.value })}
                  placeholder="Objetivos de aprendizaje, módulos, materiales incluidos y certificación institucional..."
                  className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-300 text-slate-900 placeholder-slate-400 text-sm focus:outline-none focus:border-sky-500 focus:bg-white leading-relaxed"
                />
              </div>

              <div className="flex items-center gap-2 pt-2">
                <input
                  type="checkbox"
                  id="isOnlineCourse"
                  checked={courseFormData.isOnline}
                  onChange={(e) => setCourseFormData({ ...courseFormData, isOnline: e.target.checked })}
                  className="w-4 h-4 rounded text-sky-600 focus:ring-sky-500 border-slate-300"
                />
                <label htmlFor="isOnlineCourse" className="text-xs font-bold text-slate-700 cursor-pointer">
                  Modalidad Virtual / Online (Zoom / Aula Virtual ULA)
                </label>
              </div>

              <div className="pt-4 flex items-center justify-end gap-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsCourseModalOpen(false)}
                  className="py-3 px-5 rounded-xl bg-slate-100 text-slate-700 hover:bg-slate-200 font-bold text-xs"
                >
                  Cancelar
                </button>

                <button
                  type="submit"
                  className="py-3 px-6 rounded-xl bg-sky-600 hover:bg-sky-700 text-white font-serif font-black text-xs uppercase tracking-widest flex items-center gap-2 shadow-md active:scale-98"
                >
                  <Check className="w-4 h-4" />
                  <span>{editingCourse ? 'Actualizar Curso' : 'Publicar Curso'}</span>
                </button>
              </div>

            </form>

          </div>
        </div>
      )}

      {/* =========================================================================
          MODAL: CREATE / EDIT OFFICIAL PUBLIC EVENT (PRESIDENCY)
          ========================================================================= */}
      {isPublicEventModalOpen && currentUser.isAdminLevel && (
        <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto animate-fadeIn font-sans">
          <div className="bg-white border border-slate-200 rounded-3xl max-w-2xl w-full p-6 sm:p-8 shadow-2xl relative my-8 max-h-[90vh] overflow-y-auto text-slate-800">
            
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-2xl bg-amber-100 text-amber-800 border border-amber-300">
                  <Ticket className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-serif font-black text-xl text-slate-900 uppercase tracking-wider">
                    {editingPublicEvent ? 'Editar Evento / Festival' : 'Publicar Nuevo Evento o Festival'}
                  </h3>
                  <p className="text-xs text-slate-500">
                    Calendario Oficial de Festivales & Festividades Mérida 2026
                  </p>
                </div>
              </div>

              <button
                onClick={() => setIsPublicEventModalOpen(false)}
                className="p-2 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-600 transition-colors"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSavePublicEvent} className="mt-6 space-y-4 text-xs">
              <div>
                <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Título del Evento o Festival *
                </label>
                <input
                  type="text"
                  required
                  value={publicEventFormData.title}
                  onChange={(e) => setPublicEventFormData({ ...publicEventFormData, title: e.target.value })}
                  placeholder="ej: Expo Mérida Gastronómica 2026 & Salón del Cacao Porcelana"
                  className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-300 text-slate-900 font-medium text-sm focus:outline-none focus:border-amber-500 focus:bg-white"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                    Mes Principal *
                  </label>
                  <select
                    value={publicEventFormData.month}
                    onChange={(e) => setPublicEventFormData({ ...publicEventFormData, month: e.target.value })}
                    className="w-full px-3 py-3 rounded-xl bg-slate-50 border border-slate-300 text-slate-900 text-sm focus:outline-none focus:border-amber-500 focus:bg-white"
                  >
                    {MONTHS.map(m => (
                      <option key={m.num} value={m.name}>{m.name}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                    Fecha Exacta o Rango *
                  </label>
                  <input
                    type="text"
                    required
                    value={publicEventFormData.date}
                    onChange={(e) => setPublicEventFormData({ ...publicEventFormData, date: e.target.value })}
                    placeholder="ej: 18 al 22 de Octubre 2026"
                    className="w-full px-3 py-3 rounded-xl bg-slate-50 border border-slate-300 text-slate-900 text-sm focus:outline-none focus:border-amber-500 focus:bg-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                    Categoría *
                  </label>
                  <input
                    type="text"
                    required
                    value={publicEventFormData.category}
                    onChange={(e) => setPublicEventFormData({ ...publicEventFormData, category: e.target.value })}
                    placeholder="ej: Feria Gastronómica, Cata & Maridaje, Congreso..."
                    className="w-full px-3 py-3 rounded-xl bg-slate-50 border border-slate-300 text-slate-900 text-sm focus:outline-none focus:border-amber-500 focus:bg-white"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                    Distintivo / Badge
                  </label>
                  <input
                    type="text"
                    value={publicEventFormData.badge}
                    onChange={(e) => setPublicEventFormData({ ...publicEventFormData, badge: e.target.value })}
                    placeholder="ej: Evento Oficial 2026 / Edición XI"
                    className="w-full px-3 py-3 rounded-xl bg-slate-50 border border-slate-300 text-slate-900 text-sm focus:outline-none focus:border-amber-500 focus:bg-white"
                  />
                </div>
              </div>

              {/* Access Type & Pricing Controls */}
              <div className="p-4 rounded-2xl bg-amber-50/60 border border-amber-200/80 space-y-3">
                <label className="block font-bold text-slate-800 uppercase tracking-wider text-xs">
                  Modalidad de Acceso & Venta de Entradas *
                </label>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                  <button
                    type="button"
                    onClick={() => setPublicEventFormData({
                      ...publicEventFormData,
                      accessType: 'member_free_paid_general',
                      priceMemberUSD: 0,
                      isPagoMovilEnabled: true,
                      ticketPrice: `Gratuito Miembros / $${publicEventFormData.priceGeneralUSD || 10} USD General`
                    })}
                    className={`p-2.5 rounded-xl border text-left transition-all text-xs font-sans ${
                      publicEventFormData.accessType === 'member_free_paid_general'
                        ? 'bg-amber-500 text-slate-950 font-bold border-amber-600 shadow-xs'
                        : 'bg-white text-slate-700 border-slate-300 hover:bg-slate-50'
                    }`}
                  >
                    <span className="block font-extrabold">⭐ Mixto (Recomendado)</span>
                    <span className="text-[10px] opacity-90 block mt-0.5">Gratis Miembros / Pago General</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setPublicEventFormData({
                      ...publicEventFormData,
                      accessType: 'paid',
                      isPagoMovilEnabled: true,
                      ticketPrice: `$${publicEventFormData.priceGeneralUSD || 10} USD Entrada General`
                    })}
                    className={`p-2.5 rounded-xl border text-left transition-all text-xs font-sans ${
                      publicEventFormData.accessType === 'paid'
                        ? 'bg-amber-500 text-slate-950 font-bold border-amber-600 shadow-xs'
                        : 'bg-white text-slate-700 border-slate-300 hover:bg-slate-50'
                    }`}
                  >
                    <span className="block font-extrabold">🎟️ Entrada Paga</span>
                    <span className="text-[10px] opacity-90 block mt-0.5">Pago General con Pago Móvil</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setPublicEventFormData({
                      ...publicEventFormData,
                      accessType: 'free',
                      priceGeneralUSD: 0,
                      priceMemberUSD: 0,
                      isPagoMovilEnabled: false,
                      ticketPrice: 'Entrada Totalmente Libre / Gratuito'
                    })}
                    className={`p-2.5 rounded-xl border text-left transition-all text-xs font-sans ${
                      publicEventFormData.accessType === 'free'
                        ? 'bg-amber-500 text-slate-950 font-bold border-amber-600 shadow-xs'
                        : 'bg-white text-slate-700 border-slate-300 hover:bg-slate-50'
                    }`}
                  >
                    <span className="block font-extrabold">🆓 Entrada Libre</span>
                    <span className="text-[10px] opacity-90 block mt-0.5">Acceso 100% Gratuito</span>
                  </button>
                </div>

                {publicEventFormData.accessType !== 'free' && (
                  <div className="pt-2 space-y-3">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="block font-bold text-slate-700 mb-1 text-[11px]">
                          Precio Público General (USD) *
                        </label>
                        <input
                          type="number"
                          min={1}
                          required
                          value={publicEventFormData.priceGeneralUSD || ''}
                          onChange={(e) => {
                            const val = parseFloat(e.target.value) || 0;
                            setPublicEventFormData({
                              ...publicEventFormData,
                              priceGeneralUSD: val,
                              ticketPrice: publicEventFormData.accessType === 'member_free_paid_general'
                                ? `Gratuito Miembros / $${val} USD General`
                                : `$${val} USD Entrada General`
                            });
                          }}
                          placeholder="ej: 10"
                          className="w-full px-3 py-2.5 rounded-xl bg-white border border-amber-300 text-slate-900 text-sm font-bold focus:outline-none focus:ring-2 focus:ring-amber-500"
                        />
                      </div>

                      <div>
                        <label className="block font-bold text-slate-700 mb-1 text-[11px]">
                          Texto Visible en Entrada
                        </label>
                        <input
                          type="text"
                          required
                          value={publicEventFormData.ticketPrice}
                          onChange={(e) => setPublicEventFormData({ ...publicEventFormData, ticketPrice: e.target.value })}
                          placeholder="ej: Gratuito Miembros / $10 USD General"
                          className="w-full px-3 py-2.5 rounded-xl bg-white border border-slate-300 text-slate-900 text-xs focus:outline-none focus:border-amber-500"
                        />
                      </div>
                    </div>

                    {/* Pago Movil Details Banner */}
                    <div className="p-3 rounded-xl bg-white border border-amber-300 text-xs space-y-1.5 font-mono text-slate-800">
                      <div className="flex items-center gap-2 font-bold text-amber-900 font-sans">
                        <CreditCard className="w-4 h-4 text-amber-600" />
                        <span>Pago Móvil Oficial Habilitado para este Evento:</span>
                      </div>
                      <div className="text-[11px] grid grid-cols-1 sm:grid-cols-3 gap-2 pt-1">
                        <div>Banco: <strong>0108 Provincial</strong></div>
                        <div>C.I.: <strong>V-12517086</strong></div>
                        <div>Tlf: <strong>0414-8817137</strong></div>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                    Sede / Locación *
                  </label>
                  <input
                    type="text"
                    required
                    value={publicEventFormData.location}
                    onChange={(e) => setPublicEventFormData({ ...publicEventFormData, location: e.target.value })}
                    placeholder="ej: Centro de Convenciones Mucumbarila, Mérida"
                    className="w-full px-3 py-3 rounded-xl bg-slate-50 border border-slate-300 text-slate-900 text-sm focus:outline-none focus:border-amber-500 focus:bg-white"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                    Imagen de Banner (URL)
                  </label>
                  <input
                    type="url"
                    value={publicEventFormData.image}
                    onChange={(e) => setPublicEventFormData({ ...publicEventFormData, image: e.target.value })}
                    placeholder="https://images.unsplash.com/..."
                    className="w-full px-3 py-3 rounded-xl bg-slate-50 border border-slate-300 text-slate-900 text-sm focus:outline-none focus:border-amber-500 focus:bg-white"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Descripción del Evento *
                </label>
                <textarea
                  rows={3}
                  required
                  value={publicEventFormData.description}
                  onChange={(e) => setPublicEventFormData({ ...publicEventFormData, description: e.target.value })}
                  placeholder="Reseña general, ponentes invitados, actividades para el público y turistas..."
                  className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-300 text-slate-900 placeholder-slate-400 text-sm focus:outline-none focus:border-amber-500 focus:bg-white leading-relaxed"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Puntos Destacados (separados por coma)
                </label>
                <input
                  type="text"
                  value={Array.isArray(publicEventFormData.highlights) ? publicEventFormData.highlights.join(', ') : ''}
                  onChange={(e) => setPublicEventFormData({ 
                    ...publicEventFormData, 
                    highlights: e.target.value.split(',').map(s => s.trim()).filter(Boolean)
                  })}
                  placeholder="ej: Catas guiadas, Showcookings con chefs, Rueda de negocios"
                  className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-300 text-slate-900 text-sm focus:outline-none focus:border-amber-500 focus:bg-white"
                />
              </div>

              <div className="pt-4 flex items-center justify-end gap-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsPublicEventModalOpen(false)}
                  className="py-3 px-5 rounded-xl bg-slate-100 text-slate-700 hover:bg-slate-200 font-bold text-xs"
                >
                  Cancelar
                </button>

                <button
                  type="submit"
                  className="py-3 px-6 rounded-xl bg-amber-500 hover:bg-amber-600 text-slate-950 font-serif font-black text-xs uppercase tracking-widest flex items-center gap-2 shadow-md active:scale-98"
                >
                  <Check className="w-4 h-4" />
                  <span>{editingPublicEvent ? 'Actualizar Evento' : 'Publicar Evento'}</span>
                </button>
              </div>

            </form>

          </div>
        </div>
      )}

      {/* =========================================================================
          MODAL: CREATE / EDIT TOURIST SERVICE (PRESIDENCY)
          ========================================================================= */}
      {isTouristServiceModalOpen && currentUser.isAdminLevel && (
        <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto animate-fadeIn font-sans">
          <div className="bg-white border border-slate-200 rounded-3xl max-w-2xl w-full p-6 sm:p-8 shadow-2xl relative my-8 max-h-[90vh] overflow-y-auto text-slate-800">
            
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-2xl bg-purple-100 text-purple-800 border border-purple-300">
                  <Compass className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-serif font-black text-xl text-slate-900 uppercase tracking-wider">
                    {editingTouristService ? 'Editar Servicio Turístico' : 'Nueva Vinculación Turística Oficial'}
                  </h3>
                  <p className="text-xs text-slate-500">
                    Convenios, Transporte VIP, Posadas & Operadores Homologados
                  </p>
                </div>
              </div>

              <button
                onClick={() => setIsTouristServiceModalOpen(false)}
                className="p-2 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-600 transition-colors"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSaveTouristService} className="mt-6 space-y-4 text-xs">
              <div>
                <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Título del Servicio u Operador *
                </label>
                <input
                  type="text"
                  required
                  value={touristServiceFormData.title}
                  onChange={(e) => setTouristServiceFormData({ ...touristServiceFormData, title: e.target.value })}
                  placeholder="ej: Traslados Ejecutivos 4x4 & Rutas de Alta Montaña"
                  className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-300 text-slate-900 font-medium text-sm focus:outline-none focus:border-purple-500 focus:bg-white"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                    Categoría del Servicio *
                  </label>
                  <select
                    value={touristServiceFormData.category}
                    onChange={(e) => setTouristServiceFormData({ ...touristServiceFormData, category: e.target.value })}
                    className="w-full px-3 py-3 rounded-xl bg-slate-50 border border-slate-300 text-slate-900 text-sm focus:outline-none focus:border-purple-500 focus:bg-white"
                  >
                    <option value="Movilidad & Transporte VIP">Movilidad & Transporte VIP</option>
                    <option value="Atracción & Ecoturismo">Atracción & Ecoturismo</option>
                    <option value="Hospitalidad & Posadas">Hospitalidad & Posadas</option>
                    <option value="Chefs Privados & Experiencias">Chefs Privados & Experiencias</option>
                    <option value="Aventura & Alta Montaña">Aventura & Alta Montaña</option>
                    <option value="Guías Turísticos Oficiales">Guías Turísticos Oficiales</option>
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                    Distintivo / Badge
                  </label>
                  <input
                    type="text"
                    value={touristServiceFormData.badge}
                    onChange={(e) => setTouristServiceFormData({ ...touristServiceFormData, badge: e.target.value })}
                    placeholder="ej: Operador Certificado / Flota 4x4"
                    className="w-full px-3 py-3 rounded-xl bg-slate-50 border border-slate-300 text-slate-900 text-sm focus:outline-none focus:border-purple-500 focus:bg-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                    Tarifa Referencial
                  </label>
                  <input
                    type="text"
                    value={touristServiceFormData.priceFrom}
                    onChange={(e) => setTouristServiceFormData({ ...touristServiceFormData, priceFrom: e.target.value })}
                    placeholder="ej: $50 o $80"
                    className="w-full px-3 py-3 rounded-xl bg-slate-50 border border-slate-300 text-slate-900 text-sm focus:outline-none focus:border-purple-500 focus:bg-white"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                    Unidad de Cobro
                  </label>
                  <input
                    type="text"
                    value={touristServiceFormData.unit}
                    onChange={(e) => setTouristServiceFormData({ ...touristServiceFormData, unit: e.target.value })}
                    placeholder="ej: por persona / por día"
                    className="w-full px-3 py-3 rounded-xl bg-slate-50 border border-slate-300 text-slate-900 text-sm focus:outline-none focus:border-purple-500 focus:bg-white"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                    WhatsApp de Contacto *
                  </label>
                  <input
                    type="text"
                    required
                    value={touristServiceFormData.contactWhatsapp}
                    onChange={(e) => setTouristServiceFormData({ ...touristServiceFormData, contactWhatsapp: e.target.value })}
                    placeholder="ej: 04148817137"
                    className="w-full px-3 py-3 rounded-xl bg-slate-50 border border-slate-300 text-slate-900 text-sm focus:outline-none focus:border-purple-500 focus:bg-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                    Sede / Cobertura Territorial *
                  </label>
                  <input
                    type="text"
                    required
                    value={touristServiceFormData.location}
                    onChange={(e) => setTouristServiceFormData({ ...touristServiceFormData, location: e.target.value })}
                    placeholder="ej: Mérida Ciudad, El Valle, Páramo..."
                    className="w-full px-3 py-3 rounded-xl bg-slate-50 border border-slate-300 text-slate-900 text-sm focus:outline-none focus:border-purple-500 focus:bg-white"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                    Imagen del Servicio (URL)
                  </label>
                  <input
                    type="url"
                    value={touristServiceFormData.image}
                    onChange={(e) => setTouristServiceFormData({ ...touristServiceFormData, image: e.target.value })}
                    placeholder="https://images.unsplash.com/..."
                    className="w-full px-3 py-3 rounded-xl bg-slate-50 border border-slate-300 text-slate-900 text-sm focus:outline-none focus:border-purple-500 focus:bg-white"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Descripción del Servicio *
                </label>
                <textarea
                  rows={3}
                  required
                  value={touristServiceFormData.description}
                  onChange={(e) => setTouristServiceFormData({ ...touristServiceFormData, description: e.target.value })}
                  placeholder="Detalles de la experiencia, garantías, beneficios para el turista..."
                  className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-300 text-slate-900 placeholder-slate-400 text-sm focus:outline-none focus:border-purple-500 focus:bg-white leading-relaxed"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Puntos Clave / Qué Incluye (separados por coma)
                </label>
                <input
                  type="text"
                  value={Array.isArray(touristServiceFormData.features) ? touristServiceFormData.features.join(', ') : touristServiceFormData.features}
                  onChange={(e) => setTouristServiceFormData({ 
                    ...touristServiceFormData, 
                    features: e.target.value.split(',').map(s => s.trim()).filter(Boolean)
                  })}
                  placeholder="ej: Vehículo 4x4 asegurado, Guía bilingüe, Asistencia médica"
                  className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-300 text-slate-900 text-sm focus:outline-none focus:border-purple-500 focus:bg-white"
                />
              </div>

              <div className="pt-4 flex items-center justify-end gap-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsTouristServiceModalOpen(false)}
                  className="py-3 px-5 rounded-xl bg-slate-100 text-slate-700 hover:bg-slate-200 font-bold text-xs"
                >
                  Cancelar
                </button>

                <button
                  type="submit"
                  className="py-3 px-6 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-serif font-black text-xs uppercase tracking-widest flex items-center gap-2 shadow-md active:scale-98"
                >
                  <Check className="w-4 h-4" />
                  <span>{editingTouristService ? 'Actualizar Servicio' : 'Publicar Servicio'}</span>
                </button>
              </div>

            </form>

          </div>
        </div>
      )}

    </div>
  );
}
