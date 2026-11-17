import { supabase } from './supabaseClient';

const PERMS_VAULT_ID = 'board_meta::board_permissions';
const PERMS_VAULT_CATEGORY = '__CGEM_BOARD_META__';
const LOCAL_PERMS_KEY = 'cgem_board_permissions_v1';

export const PERMISSION_SECTIONS = [
  {
    id: 'dashboard',
    label: 'Panel General',
    actions: [{ id: 'view', label: 'Ver Panel' }],
  },
  {
    id: 'directorio',
    label: 'Directorio de Agremiados',
    actions: [
      { id: 'view', label: 'Ver Directorio' },
      { id: 'edit', label: 'Editar Agremiados' },
      { id: 'create', label: 'Registrar Nuevos' },
    ],
  },
  {
    id: 'treasury',
    label: 'Tesorería & Finanzas',
    actions: [
      { id: 'view', label: 'Ver Módulo Tesorería' },
      { id: 'showStatusOnly', label: 'Restringir: Solo Estatus (Pagado/Pendiente)' },
      { id: 'showMonthlyFeeOnly', label: 'Restringir: Solo Cuota Mensual' },
      { id: 'reconcile', label: 'Conciliar / Rechazar Pagos' },
      { id: 'deleteDuplicates', label: 'Eliminar / Descartar Duplicados' },
    ],
  },
  {
    id: 'communications',
    label: 'Comunicaciones Oficiales',
    actions: [
      { id: 'view', label: 'Ver Comunicaciones' },
      { id: 'send', label: 'Enviar Correos Institucionales' },
    ],
  },
  {
    id: 'timeline',
    label: 'Agenda',
    actions: [
      { id: 'view', label: 'Ver Agenda' },
      { id: 'create', label: 'Crear / Editar Actividades' },
      { id: 'delete', label: 'Eliminar Actividades' },
    ],
  },
  {
    id: 'courses_management',
    label: 'Cursos & Academia',
    actions: [
      { id: 'view', label: 'Ver Cursos' },
      { id: 'create', label: 'Cargar / Editar Cursos' },
      { id: 'delete', label: 'Eliminar Cursos' },
    ],
  },
  {
    id: 'events_management',
    label: 'Eventos & Festivales',
    actions: [
      { id: 'view', label: 'Ver Eventos' },
      { id: 'create', label: 'Cargar / Editar Eventos' },
      { id: 'delete', label: 'Eliminar Eventos' },
    ],
  },
  {
    id: 'tourist_services',
    label: 'Servicios Turísticos VIP',
    actions: [
      { id: 'view', label: 'Ver Servicios' },
      { id: 'create', label: 'Cargar / Editar Servicios' },
      { id: 'delete', label: 'Eliminar Servicios' },
    ],
  },
  {
    id: 'completed_report',
    label: 'Eventos Cumplidos (Memoria)',
    actions: [{ id: 'view', label: 'Ver Memoria' }],
  },
  {
    id: 'board_list',
    label: 'Junta Directiva',
    actions: [{ id: 'view', label: 'Ver Nómina Directiva' }],
  },
];

export function getDefaultPermissionsForMember(member) {
  if (!member) return {};
  const isPres = member.id === 'dir-presidente' || member.email?.toLowerCase() === 'dazajulio@gmail.com';
  const isTreas = member.id === 'dir-tesorero' || member.isTesorero || member.email?.toLowerCase() === 'edreyesda@gmail.com';
  const isAdmin = !!member.isAdminLevel;

  if (isPres) {
    return {
      dashboard: { view: true },
      directorio: { view: true, edit: true, create: true },
      treasury: { view: true, showStatusOnly: false, showMonthlyFeeOnly: false, reconcile: true, deleteDuplicates: true },
      communications: { view: true, send: true },
      timeline: { view: true, create: true, delete: true },
      courses_management: { view: true, create: true, delete: true },
      events_management: { view: true, create: true, delete: true },
      tourist_services: { view: true, create: true, delete: true },
      completed_report: { view: true },
      board_list: { view: true },
    };
  }

  if (isTreas) {
    return {
      dashboard: { view: true },
      directorio: { view: true, edit: false, create: false },
      treasury: { view: true, showStatusOnly: false, showMonthlyFeeOnly: false, reconcile: true, deleteDuplicates: true },
      communications: { view: false, send: false },
      timeline: { view: true, create: false, delete: false },
      courses_management: { view: false, create: false, delete: false },
      events_management: { view: false, create: false, delete: false },
      tourist_services: { view: false, create: false, delete: false },
      completed_report: { view: true },
      board_list: { view: true },
    };
  }

  if (isAdmin) {
    return {
      dashboard: { view: true },
      directorio: { view: true, edit: true, create: true },
      treasury: { view: false, showStatusOnly: true, showMonthlyFeeOnly: true, reconcile: false, deleteDuplicates: false },
      communications: { view: true, send: true },
      timeline: { view: true, create: true, delete: true },
      courses_management: { view: true, create: true, delete: true },
      events_management: { view: true, create: true, delete: true },
      tourist_services: { view: true, create: true, delete: true },
      completed_report: { view: true },
      board_list: { view: true },
    };
  }

  return {
    dashboard: { view: true },
    directorio: { view: false, edit: false, create: false },
    treasury: { view: false, showStatusOnly: true, showMonthlyFeeOnly: true, reconcile: false, deleteDuplicates: false },
    communications: { view: false, send: false },
    timeline: { view: true, create: false, delete: false },
    courses_management: { view: false, create: false, delete: false },
    events_management: { view: false, create: false, delete: false },
    tourist_services: { view: false, create: false, delete: false },
    completed_report: { view: true },
    board_list: { view: true },
  };
}

export async function fetchBoardPermissions() {
  let local = {};
  if (typeof localStorage !== 'undefined') {
    try {
      const raw = localStorage.getItem(LOCAL_PERMS_KEY);
      if (raw) local = JSON.parse(raw);
    } catch (e) {}
  }

  if (supabase) {
    try {
      const { data, error } = await supabase
        .from('eventos_oficiales')
        .select('price_tiers')
        .eq('id', PERMS_VAULT_ID)
        .maybeSingle();

      if (!error && data && Array.isArray(data.price_tiers) && data.price_tiers[0]) {
        const cloudPerms = data.price_tiers[0];
        if (typeof localStorage !== 'undefined') {
          try {
            localStorage.setItem(LOCAL_PERMS_KEY, JSON.stringify(cloudPerms));
          } catch (e) {}
        }
        return cloudPerms;
      }
    } catch (err) {
      console.warn('Notice fetching board permissions:', err);
    }
  }

  return local;
}

export async function saveBoardPermissions(permissionsMap) {
  if (typeof localStorage !== 'undefined') {
    try {
      localStorage.setItem(LOCAL_PERMS_KEY, JSON.stringify(permissionsMap));
    } catch (e) {}
  }

  if (supabase) {
    try {
      await supabase
        .from('eventos_oficiales')
        .upsert({
          id: PERMS_VAULT_ID,
          title: 'CGEM Matriz de Permisos de Junta Directiva',
          date: '2026-01-01',
          month: '1',
          location: 'Mérida Cloud',
          category: PERMS_VAULT_CATEGORY,
          badge: 'Permisos CGEM',
          access_type: 'private',
          price_tiers: [permissionsMap],
          updated_at: new Date().toISOString(),
        });
    } catch (err) {
      console.warn('Notice saving board permissions:', err);
    }
  }
  return true;
}
