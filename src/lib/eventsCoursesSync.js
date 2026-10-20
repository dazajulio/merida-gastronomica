import { supabase } from './supabaseClient';
import { EVENTS_DATA } from '../data/eventsData';

/**
 * =========================================================================
 * SINCRONIZACIÓN DE EVENTOS OFICIALES (SUPABASE + LOCALSTORAGE FALLBACK)
 * =========================================================================
 */

// Formateador / Conversor de Supabase a modelo de la app
function formatEventFromSupabase(row) {
  return {
    id: row.id,
    title: row.title,
    date: row.date,
    month: row.month,
    location: row.location,
    category: row.category || 'Festival Gastronómico',
    badge: row.badge || 'Evento Oficial 2026',
    accessType: row.access_type || row.accessType || 'mixed',
    priceTiers: Array.isArray(row.price_tiers) ? row.price_tiers : (typeof row.price_tiers === 'string' ? JSON.parse(row.price_tiers) : []),
    ticketPrice: row.ticket_price || row.ticketPrice || '',
    isPagoMovilEnabled: row.is_pago_movil_enabled !== false,
    pagoMovilBank: row.pago_movil_bank || '0108 - Banco Provincial',
    pagoMovilCi: row.pago_movil_ci || 'V-12517086',
    pagoMovilPhone: row.pago_movil_phone || '0414-8817137',
    description: row.description || '',
    highlights: Array.isArray(row.highlights) ? row.highlights : (typeof row.highlights === 'string' ? JSON.parse(row.highlights) : []),
    image: row.image || 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=1200&q=80',
    imageAspect: row.image_aspect || row.imageAspect || '9:16',
    created_at: row.created_at || new Date().toISOString()
  };
}

// Convertidor de modelo de la app a columnas de Supabase
function formatEventForSupabase(event) {
  return {
    id: event.id,
    title: event.title,
    date: event.date,
    month: event.month,
    location: event.location,
    category: event.category,
    badge: event.badge,
    access_type: event.accessType || 'mixed',
    price_tiers: event.priceTiers || [],
    ticket_price: event.ticketPrice || '',
    is_pago_movil_enabled: event.isPagoMovilEnabled !== false,
    pago_movil_bank: event.pagoMovilBank || '0108 - Banco Provincial',
    pago_movil_ci: event.pagoMovilCi || 'V-12517086',
    pago_movil_phone: event.pagoMovilPhone || '0414-8817137',
    description: event.description || '',
    highlights: event.highlights || [],
    image: event.image || '',
    image_aspect: event.imageAspect || '9:16',
    updated_at: new Date().toISOString()
  };
}

export async function fetchLiveEvents() {
  let events = [];

  // 1. Intentar desde Supabase
  if (supabase) {
    try {
      const { data, error } = await supabase
        .from('eventos_oficiales')
        .select('*')
        .order('created_at', { ascending: false });

      if (!error && Array.isArray(data) && data.length > 0) {
        const publicRows = data.filter(
          row => !String(row.id || '').startsWith('board_') && !String(row.category || '').startsWith('__CGEM_BOARD_')
        );
        if (publicRows.length > 0) {
          events = publicRows.map(formatEventFromSupabase);
          // Guardar copia de respaldo en localStorage
          try {
            localStorage.setItem('cgem_official_events', JSON.stringify(events));
          } catch (e) {}
          return events;
        }
      }
    } catch (e) {
      console.warn('Supabase fetch events notice:', e);
    }
  }

  // 2. Fallback a localStorage
  if (typeof localStorage !== 'undefined') {
    try {
      const saved = localStorage.getItem('cgem_official_events');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch (e) {}
  }

  return Array.isArray(EVENTS_DATA) ? EVENTS_DATA : [];
}

export async function saveEventToSupabase(event) {
  const payload = formatEventForSupabase(event);
  if (supabase) {
    try {
      const { data, error } = await supabase
        .from('eventos_oficiales')
        .upsert(payload, { onConflict: 'id' })
        .select();

      if (error) {
        console.warn('Supabase save event warning:', error.message);
      }
      return { success: !error, data };
    } catch (err) {
      console.warn('Supabase save event err:', err);
      return { success: false, error: err };
    }
  }
  return { success: false, mode: 'local_only' };
}

export async function deleteEventFromSupabase(eventId) {
  if (supabase) {
    try {
      const { error } = await supabase
        .from('eventos_oficiales')
        .delete()
        .eq('id', eventId);

      if (error) console.warn('Supabase delete event warning:', error.message);
      return { success: !error };
    } catch (err) {
      console.warn('Supabase delete event err:', err);
      return { success: false, error: err };
    }
  }
  return { success: false };
}

/**
 * =========================================================================
 * SINCRONIZACIÓN DE CURSOS & CAPACITACIONES (SUPABASE + LOCALSTORAGE)
 * =========================================================================
 */

function formatCourseFromSupabase(row) {
  return {
    id: row.id,
    title: row.title,
    hours: row.hours || '16 Horas Académicas',
    dates: row.dates || '',
    schedule: row.schedule || '09:00 AM - 01:00 PM',
    instructor: row.instructor || '',
    location: row.location || 'Sede CGEM / Laboratorio ULA',
    isOnline: row.is_online === true,
    category: row.category || 'Formación Gastronómica',
    badge: row.badge || 'Certificación Oficial 2026',
    accessType: row.access_type || row.accessType || 'mixed',
    priceTiers: Array.isArray(row.price_tiers) ? row.price_tiers : (typeof row.price_tiers === 'string' ? JSON.parse(row.price_tiers) : []),
    ticketPrice: row.ticket_price || row.ticketPrice || '',
    isPagoMovilEnabled: row.is_pago_movil_enabled !== false,
    pagoMovilBank: row.pago_movil_bank || '0108 - Banco Provincial',
    pagoMovilCi: row.pago_movil_ci || 'V-12517086',
    pagoMovilPhone: row.pago_movil_phone || '0414-8817137',
    description: row.description || '',
    spots: row.spots || 25,
    priceMemberText: row.price_member_text || 'Gratuito para Miembros Solventes',
    priceGeneralUSD: row.price_general_usd ? parseFloat(row.price_general_usd) : 35,
    image: row.image || 'https://images.unsplash.com/photo-1556910103-1c02745aae4d?auto=format&fit=crop&w=800&q=80',
    imageAspect: row.image_aspect || row.imageAspect || '9:16',
    created_at: row.created_at || new Date().toISOString()
  };
}

function formatCourseForSupabase(course) {
  return {
    id: course.id,
    title: course.title,
    hours: course.hours || '16 Horas Académicas',
    dates: course.dates || '',
    schedule: course.schedule || '09:00 AM - 01:00 PM',
    instructor: course.instructor || '',
    location: course.location || 'Sede CGEM / Laboratorio ULA',
    is_online: !!course.isOnline,
    category: course.category || 'Formación Gastronómica',
    badge: course.badge || 'Certificación Oficial 2026',
    access_type: course.accessType || 'mixed',
    price_tiers: course.priceTiers || [],
    ticket_price: course.ticketPrice || '',
    is_pago_movil_enabled: course.isPagoMovilEnabled !== false,
    pago_movil_bank: course.pagoMovilBank || '0108 - Banco Provincial',
    pago_movil_ci: course.pagoMovilCi || 'V-12517086',
    pago_movil_phone: course.pagoMovilPhone || '0414-8817137',
    description: course.description || '',
    spots: parseInt(course.spots, 10) || 25,
    price_member_text: course.priceMemberText || 'Gratuito para Miembros Solventes',
    price_general_usd: parseFloat(course.priceGeneralUSD) || 35.00,
    image: course.image || '',
    image_aspect: course.imageAspect || '9:16',
    updated_at: new Date().toISOString()
  };
}

export async function fetchLiveCourses() {
  let courses = [];

  if (supabase) {
    try {
      const { data, error } = await supabase
        .from('cursos_academia')
        .select('*')
        .order('created_at', { ascending: false });

      if (!error && Array.isArray(data) && data.length > 0) {
        courses = data.map(formatCourseFromSupabase);
        try {
          localStorage.setItem('cgem_official_courses', JSON.stringify(courses));
        } catch (e) {}
        return courses;
      }
    } catch (e) {
      console.warn('Supabase fetch courses notice:', e);
    }
  }

  if (typeof localStorage !== 'undefined') {
    try {
      const saved = localStorage.getItem('cgem_official_courses');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) return parsed;
      }
    } catch (e) {}
  }

  return [];
}

export async function saveCourseToSupabase(course) {
  const fullPayload = formatCourseForSupabase(course);
  if (supabase) {
    try {
      const { data, error } = await supabase
        .from('cursos_academia')
        .upsert(fullPayload, { onConflict: 'id' })
        .select();

      if (!error) {
        return { success: true, data };
      }

      console.warn('Supabase save course warning (retrying with legacy columns fallback):', error.message);

      // Fallback: If table in Supabase has not yet run the migration for access_type / price_tiers
      const basicPayload = {
        id: course.id,
        title: course.title,
        hours: course.hours || '16 Horas Académicas',
        dates: course.dates || '',
        schedule: course.schedule || '09:00 AM - 01:00 PM',
        instructor: course.instructor || '',
        location: course.location || 'Sede CGEM / Laboratorio ULA',
        is_online: !!course.isOnline,
        category: course.category || 'Formación Gastronómica',
        description: course.description || '',
        spots: parseInt(course.spots, 10) || 25,
        price_member_text: course.priceMemberText || (course.accessType === 'free' ? 'Gratuito para todo público' : 'Gratuito para Miembros Solventes'),
        price_general_usd: parseFloat(course.priceGeneralUSD) || 35.00,
        image: course.image || '',
        updated_at: new Date().toISOString()
      };

      const fallbackResult = await supabase
        .from('cursos_academia')
        .upsert(basicPayload, { onConflict: 'id' })
        .select();

      if (fallbackResult.error) {
        console.warn('Supabase fallback save course error:', fallbackResult.error.message);
        return { success: false, error: fallbackResult.error };
      }

      return { success: true, data: fallbackResult.data, mode: 'legacy_schema' };
    } catch (err) {
      console.warn('Supabase save course err:', err);
      return { success: false, error: err };
    }
  }
  return { success: false, mode: 'local_only' };
}

export async function deleteCourseFromSupabase(courseId) {
  if (supabase) {
    try {
      const { error } = await supabase
        .from('cursos_academia')
        .delete()
        .eq('id', courseId);

      if (error) console.warn('Supabase delete course warning:', error.message);
      return { success: !error };
    } catch (err) {
      console.warn('Supabase delete course err:', err);
      return { success: false, error: err };
    }
  }
  return { success: false };
}

/**
 * =========================================================================
 * SINCRONIZACIÓN DE RESERVAS & INSCRIPCIONES (RSVPs)
 * =========================================================================
 */

export async function fetchLiveEventRsvps() {
  if (supabase) {
    try {
      const { data, error } = await supabase
        .from('inscripciones_eventos')
        .select('*')
        .order('created_at', { ascending: false });

      if (!error && Array.isArray(data)) {
        const mapped = data.map(r => ({
          id: r.id,
          eventId: r.event_id,
          eventTitle: r.event_title,
          tierId: r.tier_id,
          tierName: r.tier_name,
          tierPriceUSD: parseFloat(r.tier_price_usd) || 0,
          isFree: r.is_free === true,
          fullName: r.full_name,
          email: r.email,
          phone: r.phone,
          affiliateCode: r.affiliate_code,
          institutionOrRole: r.institution_or_role,
          paymentRef: r.payment_ref,
          paymentBank: r.payment_bank,
          status: r.status,
          registeredAt: r.registered_at || r.created_at
        }));
        try {
          localStorage.setItem('cgem_event_rsvps', JSON.stringify(mapped));
        } catch (e) {}
        return mapped;
      }
    } catch (e) {
      console.warn('Supabase fetch RSVPs notice:', e);
    }
  }

  if (typeof localStorage !== 'undefined') {
    try {
      const saved = localStorage.getItem('cgem_event_rsvps');
      if (saved) return JSON.parse(saved);
    } catch (e) {}
  }
  return [];
}

export async function saveEventRsvpToSupabase(rsvp) {
  const payload = {
    id: rsvp.id || `rsvp-${Date.now()}`,
    event_id: rsvp.eventId,
    event_title: rsvp.eventTitle,
    tier_id: rsvp.tierId || 'tier-general',
    tier_name: rsvp.tierName || 'General',
    tier_price_usd: rsvp.tierPriceUSD || 0,
    is_free: !!rsvp.isFree,
    full_name: rsvp.fullName,
    email: rsvp.email,
    phone: rsvp.phone,
    affiliate_code: rsvp.affiliateCode || '',
    institution_or_role: rsvp.institutionOrRole || '',
    payment_ref: rsvp.paymentRef || '',
    payment_bank: rsvp.paymentBank || '',
    status: rsvp.status || (rsvp.isFree ? 'confirmado' : 'pendiente_conciliacion'),
    registered_at: rsvp.registeredAt || new Date().toISOString()
  };

  if (supabase) {
    try {
      await supabase.from('inscripciones_eventos').insert([payload]);
    } catch (err) {
      console.warn('Supabase RSVP insert notice:', err);
    }
  }
}

export async function updateRsvpStatusInSupabase(rsvpId, newStatus) {
  if (supabase) {
    try {
      await supabase
        .from('inscripciones_eventos')
        .update({ status: newStatus, updated_at: new Date().toISOString() })
        .eq('id', rsvpId);
    } catch (err) {
      console.warn('Supabase update RSVP status notice:', err);
    }
  }
}

export async function deleteRsvpFromSupabase(rsvpId) {
  if (supabase) {
    try {
      await supabase
        .from('inscripciones_eventos')
        .delete()
        .eq('id', rsvpId);
    } catch (err) {
      console.warn('Supabase delete RSVP notice:', err);
    }
  }
}

export async function saveCourseEnrollmentToSupabase(enrollment) {
  const payload = {
    course_id: enrollment.courseId,
    course_title: enrollment.courseTitle,
    attendee_type: enrollment.attendeeType,
    full_name: enrollment.fullName,
    email: enrollment.email,
    phone: enrollment.phone,
    affiliate_code: enrollment.affiliateCode || '',
    payment_ref: enrollment.paymentRef || '',
    payment_bank: enrollment.paymentBank || '',
    status: enrollment.status || 'confirmado'
  };

  if (supabase) {
    try {
      await supabase.from('inscripciones_cursos').insert([payload]);
    } catch (err) {
      console.warn('Supabase course enrollment insert notice:', err);
    }
  }
}

/**
 * =========================================================================
 * SINCRONIZACIÓN DE LA AGENDA INTERNA DE LA JUNTA DIRECTIVA (SUPABASE CLOUD)
 * Garantiza que todas las actividades creadas por Dirección Ejecutiva o
 * Presidencia y las confirmaciones de asistencia sean vistas por todos los
 * miembros de la Junta Directiva en cualquier dispositivo en tiempo real.
 * =========================================================================
 */
const BOARD_AGENDA_CATEGORY = '__CGEM_BOARD_AGENDA__';
const BOARD_COMPLETED_CATEGORY = '__CGEM_BOARD_COMPLETED__';
const BOARD_META_CATEGORY = '__CGEM_BOARD_META__';
const BOARD_DELETED_META_ID = 'board_meta::deleted_ids';

function formatBoardEventForSupabase(event, category = BOARD_AGENDA_CATEGORY) {
  const prefix = category === BOARD_COMPLETED_CATEGORY ? 'board_completed::' : 'board_agenda::';
  const cleanId = String(event.id || `agenda-${Date.now()}`).replace(/^board_(agenda|completed)::/, '');
  const eventYear = event.year || (event.date ? parseInt(String(event.date).split('-')[0], 10) : 2026);
  const eventMonth = event.month || (event.date ? parseInt(String(event.date).split('-')[1], 10) : 10);
  const normalizedEvent = {
    ...event,
    id: cleanId,
    year: eventYear,
    month: eventMonth,
    confirmedAttendees: Array.isArray(event.confirmedAttendees) ? event.confirmedAttendees : []
  };

  return {
    id: `${prefix}${cleanId}`,
    title: normalizedEvent.title || 'Actividad Junta Directiva',
    date: normalizedEvent.date || new Date().toISOString().split('T')[0],
    month: String(eventMonth),
    location: normalizedEvent.location || 'Mérida',
    category,
    badge: normalizedEvent.typeLabel || normalizedEvent.type || 'Institucional',
    description: normalizedEvent.description || '',
    price_tiers: [normalizedEvent],
    highlights: normalizedEvent.confirmedAttendees,
    updated_at: new Date().toISOString()
  };
}

function parseBoardEventFromSupabase(row) {
  let stored = {};
  if (Array.isArray(row.price_tiers) && row.price_tiers.length > 0 && typeof row.price_tiers[0] === 'object') {
    stored = row.price_tiers[0];
  } else if (typeof row.price_tiers === 'string') {
    try {
      const parsed = JSON.parse(row.price_tiers);
      if (Array.isArray(parsed) && parsed[0]) stored = parsed[0];
    } catch (e) {}
  }

  const cleanId = stored.id || String(row.id || '').replace(/^board_(agenda|completed)::/, '');
  const dateStr = stored.date || row.date || new Date().toISOString().split('T')[0];
  const eventYear = stored.year || parseInt(String(dateStr).split('-')[0], 10) || 2026;
  const eventMonth = stored.month || parseInt(String(dateStr).split('-')[1], 10) || 10;
  const attendees = Array.isArray(row.highlights)
    ? row.highlights
    : (Array.isArray(stored.confirmedAttendees) ? stored.confirmedAttendees : []);

  return {
    id: cleanId,
    title: stored.title || row.title || 'Actividad Junta Directiva',
    type: stored.type || 'institucional',
    typeLabel: stored.typeLabel || row.badge || 'Institucional & Academia',
    date: dateStr,
    timeStart: stored.timeStart || '09:00',
    timeEnd: stored.timeEnd || '12:00',
    year: eventYear,
    month: eventMonth,
    location: stored.location || row.location || 'Mérida',
    isVirtual: !!stored.isVirtual,
    virtualLink: stored.virtualLink || '',
    organizer: stored.organizer || 'Presidencia & Dirección Ejecutiva',
    description: stored.description !== undefined ? stored.description : (row.description || ''),
    maxAttendees: stored.maxAttendees !== undefined ? stored.maxAttendees : null,
    status: stored.status || 'confirmado',
    completedAt: stored.completedAt || null,
    confirmedAttendees: attendees
  };
}

async function getDeletedBoardEventIds() {
  if (!supabase) return new Set();
  try {
    const { data, error } = await supabase
      .from('eventos_oficiales')
      .select('highlights')
      .eq('id', BOARD_DELETED_META_ID)
      .maybeSingle();

    if (!error && data && Array.isArray(data.highlights)) {
      return new Set(data.highlights.map(String));
    }
  } catch (e) {}
  return new Set();
}

async function addDeletedBoardEventId(eventId) {
  if (!supabase || !eventId) return;
  try {
    const cleanId = String(eventId).replace(/^board_(agenda|completed)::/, '');
    const currentSet = await getDeletedBoardEventIds();
    currentSet.add(cleanId);
    const updatedArray = Array.from(currentSet);
    await supabase
      .from('eventos_oficiales')
      .upsert({
        id: BOARD_DELETED_META_ID,
        title: 'Metadata Junta Directiva',
        date: '2026-01-01',
        month: '1',
        location: 'Sistema',
        category: BOARD_META_CATEGORY,
        highlights: updatedArray,
        updated_at: new Date().toISOString()
      }, { onConflict: 'id' });
  } catch (e) {
    console.warn('Error saving deleted board event id:', e);
  }
}

export async function fetchLiveBoardAgenda(initialAgendaData = []) {
  let localEvents = [];
  if (typeof localStorage !== 'undefined') {
    try {
      const saved = localStorage.getItem('cgem_board_agenda_v2');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) localEvents = parsed;
      }
    } catch (e) {}
  }

  if (supabase) {
    try {
      const [agendaRes, deletedIds] = await Promise.all([
        supabase
          .from('eventos_oficiales')
          .select('*')
          .eq('category', BOARD_AGENDA_CATEGORY)
          .order('date', { ascending: true }),
        getDeletedBoardEventIds()
      ]);

      if (!agendaRes.error && Array.isArray(agendaRes.data)) {
        const cloudEvents = agendaRes.data
          .map(parseBoardEventFromSupabase)
          .filter(ev => !deletedIds.has(String(ev.id)));

        const cloudMap = new Map(cloudEvents.map(ev => [String(ev.id), ev]));

        // Si la nube aún no tenía actividades inicializadas y no han sido borradas, sembrar datos iniciales + locales
        if (cloudEvents.length === 0 && deletedIds.size === 0) {
          const seedSource = localEvents.length > 0 ? localEvents : initialAgendaData;
          if (seedSource.length > 0) {
            const payloads = seedSource.map(ev => formatBoardEventForSupabase(ev, BOARD_AGENDA_CATEGORY));
            await supabase.from('eventos_oficiales').upsert(payloads, { onConflict: 'id' });
            try {
              localStorage.setItem('cgem_board_agenda_v2', JSON.stringify(seedSource));
            } catch (e) {}
            return seedSource;
          }
        }

        // Si el navegador actual (ej. Directora Ejecutiva o Presidente) tiene actividades creadas localmente
        // que aún no estaban en Supabase y no fueron eliminadas, subirlas automáticamente a la nube
        const unsyncedLocalEvents = localEvents.filter(
          loc => loc && loc.id && !cloudMap.has(String(loc.id)) && !deletedIds.has(String(loc.id))
        );

        if (unsyncedLocalEvents.length > 0) {
          const payloads = unsyncedLocalEvents.map(ev => formatBoardEventForSupabase(ev, BOARD_AGENDA_CATEGORY));
          await supabase.from('eventos_oficiales').upsert(payloads, { onConflict: 'id' });
          unsyncedLocalEvents.forEach(ev => cloudMap.set(String(ev.id), ev));
        }

        const mergedList = Array.from(cloudMap.values()).sort((a, b) => new Date(a.date) - new Date(b.date));
        try {
          localStorage.setItem('cgem_board_agenda_v2', JSON.stringify(mergedList));
        } catch (e) {}
        return mergedList;
      }
    } catch (err) {
      console.warn('Supabase fetch board agenda notice:', err);
    }
  }

  return localEvents.length > 0 ? localEvents : initialAgendaData;
}

export async function saveBoardAgendaEventToSupabase(event) {
  if (!supabase || !event) return { success: false };
  try {
    const payload = formatBoardEventForSupabase(event, BOARD_AGENDA_CATEGORY);
    const { data, error } = await supabase
      .from('eventos_oficiales')
      .upsert(payload, { onConflict: 'id' })
      .select();

    if (error) {
      console.warn('Supabase save board agenda warning:', error.message);
      return { success: false, error };
    }
    return {
      success: true,
      event: data && data[0] ? parseBoardEventFromSupabase(data[0]) : event
    };
  } catch (err) {
    console.warn('Supabase save board agenda err:', err);
    return { success: false, error: err };
  }
}

export async function deleteBoardAgendaEventFromSupabase(eventId) {
  if (!supabase || !eventId) return { success: false };
  try {
    const cleanId = String(eventId).replace(/^board_agenda::/, '');
    const rowId = `board_agenda::${cleanId}`;
    await Promise.all([
      supabase.from('eventos_oficiales').delete().eq('id', rowId),
      addDeletedBoardEventId(cleanId)
    ]);
    return { success: true };
  } catch (err) {
    console.warn('Supabase delete board agenda err:', err);
    return { success: false, error: err };
  }
}

export async function fetchLiveCompletedBoardEvents() {
  const ninetyDaysAgo = Date.now() - 90 * 24 * 60 * 60 * 1000;
  let localCompleted = [];

  if (typeof localStorage !== 'undefined') {
    try {
      const saved = localStorage.getItem('cgem_completed_board_events');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) {
          localCompleted = parsed.filter(ev => {
            const t = ev.completedAt ? new Date(ev.completedAt).getTime() : new Date(ev.date).getTime();
            return t >= ninetyDaysAgo;
          });
        }
      }
    } catch (e) {}
  }

  if (supabase) {
    try {
      const { data, error } = await supabase
        .from('eventos_oficiales')
        .select('*')
        .eq('category', BOARD_COMPLETED_CATEGORY)
        .order('updated_at', { ascending: false });

      if (!error && Array.isArray(data)) {
        const cloudCompleted = data
          .map(parseBoardEventFromSupabase)
          .filter(ev => {
            const t = ev.completedAt ? new Date(ev.completedAt).getTime() : new Date(ev.date).getTime();
            return t >= ninetyDaysAgo;
          });

        const cloudMap = new Map(cloudCompleted.map(ev => [String(ev.id), ev]));
        const unsyncedLocal = localCompleted.filter(loc => loc && loc.id && !cloudMap.has(String(loc.id)));

        if (unsyncedLocal.length > 0) {
          const payloads = unsyncedLocal.map(ev => formatBoardEventForSupabase(ev, BOARD_COMPLETED_CATEGORY));
          await supabase.from('eventos_oficiales').upsert(payloads, { onConflict: 'id' });
          unsyncedLocal.forEach(ev => cloudMap.set(String(ev.id), ev));
        }

        const merged = Array.from(cloudMap.values());
        try {
          localStorage.setItem('cgem_completed_board_events', JSON.stringify(merged));
        } catch (e) {}
        return merged;
      }
    } catch (err) {
      console.warn('Supabase fetch completed board events notice:', err);
    }
  }

  return localCompleted;
}

export async function markBoardEventCompletedInSupabase(completedEvent) {
  if (!supabase || !completedEvent) return { success: false };
  try {
    const cleanId = String(completedEvent.id).replace(/^board_(agenda|completed)::/, '');
    const completedPayload = formatBoardEventForSupabase(
      { ...completedEvent, id: cleanId, status: 'cumplido', completedAt: completedEvent.completedAt || new Date().toISOString() },
      BOARD_COMPLETED_CATEGORY
    );

    await Promise.all([
      supabase.from('eventos_oficiales').upsert(completedPayload, { onConflict: 'id' }),
      supabase.from('eventos_oficiales').delete().eq('id', `board_agenda::${cleanId}`),
      addDeletedBoardEventId(cleanId)
    ]);
    return { success: true };
  } catch (err) {
    console.warn('Supabase mark completed board event err:', err);
    return { success: false, error: err };
  }
}

