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
        events = data.map(formatEventFromSupabase);
        // Guardar copia de respaldo en localStorage
        try {
          localStorage.setItem('cgem_official_events', JSON.stringify(events));
        } catch (e) {}
        return events;
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
