import { supabase } from './supabaseClient';
import { INITIAL_DIRECTORY_DATA } from '../data/initialDirectoryData';

// Función para desglosar y extraer datos de pago reales a partir de un registro de agremiado
export function parsePaymentFromMember(member, index = 1) {
  const obs = member.observaciones || '';
  
  // Extraer referencia bancaria
  const refMatch = obs.match(/Ref:\s*([^\s(]+)/i);
  const referencia = refMatch ? refMatch[1] : (member.rif_cedula ? `REF-${member.rif_cedula.replace(/\D/g, '').slice(-6)}` : `REF-${Math.floor(100000 + Math.random() * 900000)}`);

  // Extraer banco emisor
  const bankMatch = obs.match(/\(([^)]+)\)/);
  const bancoEmisor = bankMatch ? bankMatch[1] : 'Banco Provincial';

  // Extraer teléfono pagador
  const telMatch = obs.match(/Tel\.\s*Pagador:\s*([^\s.]+)/i);
  const telefonoPagador = telMatch ? telMatch[1] : (member.telefono || '');

  // Detectar si ingresó formalmente por Convenio / Alianza Estratégica con pago inicial $0
  const isConvenio = !!(
    member.is_alianza_estrategica || 
    member.modalidad_ingreso === 'convenio' || 
    member.modalidad_ingreso === 'exoneracion' || 
    member.monto_inscripcion === 0 ||
    member.monto_inscripcion === 0.00 ||
    member.monto_inscripcion === '0' ||
    member.monto_inscripcion === '0.00' ||
    obs.toLowerCase().includes('alianza') ||
    obs.toLowerCase().includes('convenio') ||
    obs.toLowerCase().includes('intercambio')
  );

  // Extraer monto Bs exacto reportado en el comprobante
  const bsMatch = obs.match(/Monto\s*Bs:\s*([0-9.,]+)/i);
  let montoBs = 0;
  if (bsMatch) {
    const rawBs = bsMatch[1].replace(/\./g, '').replace(',', '.');
    montoBs = parseFloat(rawBs) || 0;
  }

  let totalUsd = 0;
  let cuotaMesUsd = parseFloat(member.monto_cuota_mensual);
  const isElValle = (member.codigo_afiliado || '').includes('VALLE') || 
                    (member.categoria_negocio || '').toLowerCase().includes('valle') || 
                    (member.municipio || '').toLowerCase().includes('valle') ||
                    (member.observaciones || '').toLowerCase().includes('valle') ||
                    (member.email || '').toLowerCase().includes('lacasadelvalle');

  if (isElValle) {
    cuotaMesUsd = 7.00;
  } else if (isNaN(cuotaMesUsd) || cuotaMesUsd <= 0) {
    cuotaMesUsd = 10.00;
  }
  let inscripcionUsd = 0;

  if (isConvenio) {
    totalUsd = 0.00;
    inscripcionUsd = 0.00;
    montoBs = 0.00;
  } else {
    const parsedInscripcion = parseFloat(member.monto_inscripcion);
    totalUsd = !isNaN(parsedInscripcion) && parsedInscripcion > 0 
      ? parsedInscripcion 
      : (member.categoria_negocio?.toLowerCase().includes('emprend') || member.categoria_negocio?.toLowerCase().includes('creador') ? 20.00 : 30.00);
    inscripcionUsd = totalUsd > 20.00 ? 20.00 : 10.00;

    // Si montoBs no vino en observaciones, calculamos con tasa estimada de la fecha
    if (montoBs === 0) {
      if (member.codigo_afiliado === 'CGM-2026-001') {
        montoBs = 26141.07;
      } else {
        montoBs = totalUsd === 30 ? 26241.96 : 17494.64;
      }
    }
  }

  // Tasa BCV fijada al día del pago
  const tasaBcvFijada = (totalUsd > 0 && montoBs > 0) ? (montoBs / totalUsd).toFixed(2) : '874.73';

  const isSolvent = (member.estado_solvencia || '').toLowerCase().includes('solvente');
  const padIndex = String(index).padStart(4, '0');

  const fechaPrimerPago = member.fecha_primer_pago || (member.fecha_registro ? member.fecha_registro.split('T')[0] : new Date().toISOString().split('T')[0]);
  const diaPagoMensual = parseInt(member.dia_pago_mensual, 10) || 5;
  const fechaInicioCobro = member.fecha_inicio_cobro || 'Noviembre 2026';

  return {
    id: `pago-${member.id || member.codigo_afiliado}`,
    numero_recibo: `REC-2026-${padIndex}`,
    codigo_afiliado: member.codigo_afiliado,
    nombre_establecimiento: member.nombre_establecimiento,
    representante_legal: member.representante_legal || '',
    rif_cedula: member.rif_cedula || '',
    telefono: member.telefono || '',
    email: member.email || '',
    modalidad_ingreso: isConvenio ? 'convenio' : (member.modalidad_ingreso || 'pago_ordinario'),
    concepto: isConvenio ? 'Ingreso por Convenio / Alianza Estratégica ($0 Inicial)' : 'Inscripción + 1er Mes de Membresía',
    periodo_mes: member.primer_mes_cobro || 'Octubre 2026',
    monto_inscripcion_usd: inscripcionUsd,
    monto_cuota_mes_usd: cuotaMesUsd,
    monto_usd: totalUsd,
    monto_bs: montoBs,
    tasa_bcv: parseFloat(tasaBcvFijada) || 874.73,
    metodo_pago: isConvenio ? 'convenio_institucional' : (bancoEmisor.toLowerCase().includes('provincial') ? 'pago_movil' : 'transferencia_nacional'),
    banco_emisor: isConvenio ? 'Convenio Institucional / Alianza' : bancoEmisor,
    banco_receptor: 'Banco Provincial (0108)',
    referencia: isConvenio ? (member.referencia || 'CONVENIO-ALIANZA') : referencia,
    telefono_pagador: telefonoPagador,
    estado: isSolvent ? 'conciliado' : 'pendiente',
    fecha_pago: member.fecha_primer_pago || member.fecha_registro || member.created_at || new Date().toISOString(),
    fecha_primer_pago: fechaPrimerPago,
    dia_pago_mensual: diaPagoMensual,
    fecha_inicio_cobro: fechaInicioCobro,
    fecha_conciliacion: isSolvent ? (member.updated_at || member.fecha_registro || new Date().toISOString()) : null,
    conciliado_por: isSolvent ? 'Edixon Xavier Reyes Dávila (Tesorero)' : null,
    observaciones: member.observaciones || (isConvenio ? 'Afiliación por Convenio / Alianza Estratégica (Inscripción $0)' : 'Registro Web Público')
  };
}

const SPANISH_MONTHS = [
  'enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio',
  'julio', 'agosto', 'septiembre', 'octubre', 'noviembre', 'diciembre'
];

export function isMemberSolventForCurrentMonth(member, payments = []) {
  if (!member) return false;
  const statusLower = (member.estado_solvencia || '').toLowerCase();
  const isMarkedPending =
    statusLower.includes('trámite') ||
    statusLower.includes('tramite') ||
    statusLower.includes('revisión') ||
    statusLower.includes('revision') ||
    statusLower.includes('pendiente') ||
    statusLower.includes('verificación') ||
    statusLower.includes('verificacion') ||
    statusLower.includes('insolvente');

  const now = new Date();
  const currentMonthIdx = now.getMonth();
  const currentYear = now.getFullYear();
  const currentMonthName = SPANISH_MONTHS[currentMonthIdx];

  const memberPayments = (Array.isArray(payments) ? payments : []).filter(p =>
    (p.codigo_afiliado && member.codigo_afiliado && p.codigo_afiliado.toLowerCase().trim() === member.codigo_afiliado.toLowerCase().trim()) ||
    (p.email && member.email && p.email.toLowerCase().trim() === member.email.toLowerCase().trim())
  );

  const hasCurrentMonthReconciled = memberPayments.some(p => {
    if ((p.estado || '').toLowerCase() !== 'conciliado') return false;
    const periodText = `${p.periodo_mes || ''} ${p.concepto || ''}`.toLowerCase();
    if (periodText.includes(currentMonthName)) return true;
    if (p.fecha_pago) {
      const pd = new Date(p.fecha_pago);
      if (!isNaN(pd.getTime()) && pd.getMonth() === currentMonthIdx && pd.getFullYear() === currentYear) {
        return true;
      }
    }
    return false;
  });

  if (hasCurrentMonthReconciled) return true;
  if (isMarkedPending) return false;
  if (memberPayments.some(p => (p.estado || '').toLowerCase() === 'pendiente')) return false;

  if (member.fecha_vencimiento) {
    const exp = new Date(member.fecha_vencimiento);
    if (!isNaN(exp.getTime()) && exp >= now && statusLower.includes('solvente')) {
      return true;
    }
  }

  const monthlyFee = parseFloat(member.monto_cuota_mensual);
  const isExemptConvenio =
    (!isNaN(monthlyFee) && monthlyFee === 0) ||
    member.is_alianza_estrategica ||
    member.modalidad_ingreso === 'exoneracion';
  if (isExemptConvenio && statusLower.includes('solvente')) return true;

  return false;
}

// Lista Real Base de Pagos (Construida estrictamente con los 12 agremiados reales)
export const INITIAL_PAYMENTS = INITIAL_DIRECTORY_DATA.map((member, idx) => parsePaymentFromMember(member, idx + 1));

// Gastos reales: 0 egresos por defecto (sin datos inventados)
export const INITIAL_EXPENSES = [];

// Generar número correlativo de recibo evitando colisiones
export const generateReceiptNumber = (existingPayments = []) => {
  const currentYear = new Date().getFullYear();
  let maxNum = 27; // Baseline post-UFO Candy Store (REC-2026-0027)
  if (Array.isArray(existingPayments)) {
    for (const p of existingPayments) {
      if (p && p.numero_recibo) {
        const match = String(p.numero_recibo).match(/REC-\d+-(\d+)/);
        if (match) {
          const val = parseInt(match[1], 10);
          if (!isNaN(val) && val > maxNum) {
            maxNum = val;
          }
        }
      }
    }
  }
  const nextNum = maxNum + 1;
  return `REC-${currentYear}-${String(nextNum).padStart(4, '0')}`;
};

const DISCARDED_VAULT_ID = 'board_meta::discarded_payments';
const LOCAL_DISCARDED_KEY = 'cgem_discarded_payment_ids';

function getLocalDiscardedPaymentIds() {
  if (typeof localStorage === 'undefined') return new Set();
  try {
    const raw = localStorage.getItem(LOCAL_DISCARDED_KEY);
    const parsed = raw ? JSON.parse(raw) : [];
    return new Set(Array.isArray(parsed) ? parsed : []);
  } catch (e) {
    return new Set();
  }
}

async function fetchDiscardedPaymentIds() {
  const merged = getLocalDiscardedPaymentIds();
  if (supabase) {
    try {
      const { data, error } = await supabase
        .from('eventos_oficiales')
        .select('price_tiers')
        .eq('id', DISCARDED_VAULT_ID)
        .maybeSingle();

      if (!error && data && Array.isArray(data.price_tiers) && Array.isArray(data.price_tiers[0])) {
        data.price_tiers[0].forEach(id => {
          if (id) merged.add(id);
        });
        if (typeof localStorage !== 'undefined') {
          try {
            localStorage.setItem(LOCAL_DISCARDED_KEY, JSON.stringify(Array.from(merged)));
          } catch (e) {}
        }
      }
    } catch (e) {
      console.warn('Notice fetching discarded payments:', e);
    }
  }
  return merged;
}

async function persistDiscardedPaymentId(paymentId) {
  const merged = await fetchDiscardedPaymentIds();
  merged.add(paymentId);
  const idList = Array.from(merged);

  if (typeof localStorage !== 'undefined') {
    try {
      localStorage.setItem(LOCAL_DISCARDED_KEY, JSON.stringify(idList));
    } catch (e) {}
  }

  if (supabase) {
    try {
      await supabase
        .from('eventos_oficiales')
        .upsert({
          id: DISCARDED_VAULT_ID,
          title: 'CGEM Pagos Descartados de Tesorería',
          date: '2026-01-01',
          month: '1',
          location: 'Mérida Cloud',
          category: '__CGEM_BOARD_META__',
          badge: 'Tesorería CGEM',
          access_type: 'private',
          price_tiers: [idList],
          updated_at: new Date().toISOString(),
        });
    } catch (e) {
      console.warn('Notice persisting discarded payment:', e);
    }
  }
}

// Obtener pagos desde Supabase o localStorage con auto-sincronización de registros reales
export async function fetchLivePayments() {
  try {
    const discardedIds = await fetchDiscardedPaymentIds();
    const filterActive = (list) =>
      (Array.isArray(list) ? list : []).filter(
        p => p && p.codigo_afiliado !== 'CGM-2026-383' && !discardedIds.has(p.id) && p.estado !== 'descartado'
      );

    let baseList = filterActive(INITIAL_PAYMENTS);

    // 1. Intentar cargar desde Supabase directorio_agremiados & pagos_tesoreria
    if (supabase) {
      try {
        const { data: pagosData, error: pagosErr } = await supabase
          .from('pagos_tesoreria')
          .select('*')
          .order('fecha_pago', { ascending: false });

        const { data: dirData, error: dirErr } = await supabase
          .from('directorio_agremiados')
          .select('*')
          .order('created_at', { ascending: false });

        const realPagos = (!pagosErr && Array.isArray(pagosData)) ? filterActive(pagosData) : [];
        const cleanDir = (!dirErr && Array.isArray(dirData)) ? dirData.filter(m => m.codigo_afiliado !== 'CGM-2026-383') : [];

        // Generar registros de membresía base para aquellos agremiados sin registros en pagos_tesoreria
        const codesWithPayments = new Set(realPagos.map(p => (p.codigo_afiliado || '').toLowerCase().trim()).filter(Boolean));
        const emailsWithPayments = new Set(realPagos.map(p => (p.email || '').toLowerCase().trim()).filter(Boolean));

        const baselinePayments = [];
        cleanDir.forEach((m, idx) => {
          const code = (m.codigo_afiliado || '').toLowerCase().trim();
          const email = (m.email || '').toLowerCase().trim();
          if (!codesWithPayments.has(code) && (!email || !emailsWithPayments.has(email))) {
            baselinePayments.push(parsePaymentFromMember(m, idx + 1));
          }
        });

        const merged = filterActive([...realPagos, ...baselinePayments]);
        if (merged.length > 0) {
          try {
            localStorage.setItem('cgem_pagos_tesoreria', JSON.stringify(merged));
          } catch (e) {}
          return merged;
        }
      } catch (err) {
        console.warn('Supabase pagos notice:', err);
      }
    }

    // 2. Fallback a localStorage
    const saved = localStorage.getItem('cgem_pagos_tesoreria');
    if (saved) {
      const parsed = JSON.parse(saved);
      if (Array.isArray(parsed) && parsed.length > 0) {
        return filterActive(parsed);
      }
    }

    return baseList;
  } catch (e) {
    return INITIAL_PAYMENTS.filter(p => p.codigo_afiliado !== 'CGM-2026-383');
  }
}

// Obtener egresos desde Supabase o localStorage (0 por defecto)
export async function fetchLiveExpenses() {
  try {
    const saved = localStorage.getItem('cgem_egresos_camara');
    if (saved) {
      const parsed = JSON.parse(saved);
      if (Array.isArray(parsed)) return parsed;
    }

    if (supabase) {
      try {
        const { data, error } = await supabase
          .from('egresos_camara')
          .select('*')
          .order('fecha_gasto', { ascending: false });

        if (!error && Array.isArray(data)) {
          localStorage.setItem('cgem_egresos_camara', JSON.stringify(data));
          return data;
        }
      } catch (err) {
        console.warn('Supabase egresos notice:', err);
      }
    }
    return [];
  } catch (e) {
    return [];
  }
}

// Guardar nuevo reporte de pago
export async function submitPaymentRecord(paymentData) {
  const validUuid =
    typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function'
      ? crypto.randomUUID()
      : undefined;

  const isUuid = (val) =>
    typeof val === 'string' &&
    /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(val);

  const nowIso = new Date().toISOString();
  const safeId = isUuid(paymentData.id) ? paymentData.id : validUuid;

  const supabasePayload = {
    ...(safeId ? { id: safeId } : {}),
    numero_recibo: paymentData.numero_recibo || generateReceiptNumber(),
    codigo_afiliado: paymentData.codigo_afiliado || '',
    nombre_establecimiento: paymentData.nombre_establecimiento || 'Establecimiento Afiliado',
    representante_legal: paymentData.representante_legal || '',
    rif_cedula: paymentData.rif_cedula || '',
    telefono: paymentData.telefono || '',
    email: paymentData.email || '',
    concepto: paymentData.concepto || 'Cuota Mensual',
    periodo_mes: paymentData.periodo_mes || '',
    metodo_pago: paymentData.metodo_pago || 'pago_movil',
    banco_emisor: paymentData.banco_emisor || 'Banco Provincial',
    banco_receptor: paymentData.banco_receptor || 'Banco Provincial (0108)',
    referencia: paymentData.referencia || '',
    telefono_pagador: paymentData.telefono_pagador || '',
    monto_bs: Number(paymentData.monto_bs) || 0,
    tasa_bcv: Number(paymentData.tasa_bcv) || 0,
    monto_usd: Number(paymentData.monto_usd) || 0,
    estado: paymentData.estado || 'pendiente',
    fecha_pago: paymentData.fecha_pago || nowIso,
    fecha_conciliacion: paymentData.fecha_conciliacion || null,
    conciliado_por: paymentData.conciliado_por || null,
    comprobante_url: paymentData.comprobante_url || null,
    observaciones: paymentData.observaciones || '',
    motivo_rechazo: paymentData.motivo_rechazo || null,
    created_at: nowIso,
    updated_at: nowIso,
  };

  const newRecord = {
    ...paymentData,
    ...supabasePayload,
    id: safeId || `pago-${Date.now()}`,
  };

  try {
    const saved = localStorage.getItem('cgem_pagos_tesoreria');
    const list = saved ? JSON.parse(saved) : [...INITIAL_PAYMENTS];
    const existsIndex = list.findIndex(
      p => p.id === newRecord.id || (p.referencia && newRecord.referencia && p.referencia === newRecord.referencia && p.codigo_afiliado === newRecord.codigo_afiliado)
    );
    let updatedList;
    if (existsIndex >= 0) {
      list[existsIndex] = { ...list[existsIndex], ...newRecord };
      updatedList = list;
    } else {
      updatedList = [newRecord, ...list];
    }
    localStorage.setItem('cgem_pagos_tesoreria', JSON.stringify(updatedList));
  } catch (e) {}

  if (supabase) {
    try {
      let { data, error } = await supabase
        .from('pagos_tesoreria')
        .insert([supabasePayload])
        .select();

      // En caso de colisión con un número de recibo existente, auto-resolver el siguiente correlativo
      if (error && error.code === '23505' && (error.message?.includes('numero_recibo') || error.message?.includes('pagos_tesoreria_numero_recibo_key'))) {
        console.warn('Colisión de número de recibo detectada. Auto-incrementando correlativo...');
        const { data: allPagos } = await supabase
          .from('pagos_tesoreria')
          .select('numero_recibo');

        let maxRec = 27;
        if (allPagos) {
          for (const ap of allPagos) {
            const m = String(ap.numero_recibo || '').match(/REC-\d+-(\d+)/);
            if (m) {
              const v = parseInt(m[1], 10);
              if (!isNaN(v) && v > maxRec) maxRec = v;
            }
          }
        }
        supabasePayload.numero_recibo = `REC-${new Date().getFullYear()}-${String(maxRec + 1).padStart(4, '0')}`;
        const retry = await supabase.from('pagos_tesoreria').insert([supabasePayload]).select();
        data = retry.data;
        error = retry.error;
      }

      if (error) {
        console.error('Supabase insert payment error:', error.message, error.details);
        throw new Error(`Error en base de datos al guardar pago: ${error.message}`);
      } else if (data && data.length > 0) {
        if (typeof window !== 'undefined') {
          window.dispatchEvent(new Event('cgem_payments_updated'));
          window.dispatchEvent(new CustomEvent('cgm_treasury_updated'));
        }
        return data[0];
      }
    } catch (err) {
      console.warn('Supabase insert payment notice:', err);
      throw err;
    }
  }

  return newRecord;
}

export const UUID_REGEX = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

export const VALID_PAGOS_COLUMNS = new Set([
  'id',
  'numero_recibo',
  'codigo_afiliado',
  'nombre_establecimiento',
  'representante_legal',
  'rif_cedula',
  'telefono',
  'email',
  'concepto',
  'periodo_mes',
  'metodo_pago',
  'banco_emisor',
  'banco_receptor',
  'referencia',
  'telefono_pagador',
  'monto_bs',
  'tasa_bcv',
  'monto_usd',
  'estado',
  'fecha_pago',
  'fecha_conciliacion',
  'conciliado_por',
  'comprobante_url',
  'observaciones',
  'motivo_rechazo',
  'created_at',
  'updated_at'
]);

export function sanitizePagosPayload(data = {}) {
  const sanitized = {};
  for (const [key, value] of Object.entries(data)) {
    if (VALID_PAGOS_COLUMNS.has(key)) {
      sanitized[key] = value;
    }
  }
  return sanitized;
}

// Conciliar un pago (Aprobación del Tesorero o Presidente)
export async function reconcilePaymentRecord(paymentId, conciliatorName = 'Edixon Xavier Reyes Dávila (Tesorero)', extraDetails = {}) {
  const updateData = {
    estado: 'conciliado',
    fecha_conciliacion: new Date().toISOString(),
    conciliado_por: conciliatorName,
    ...extraDetails
  };

  const cleanTarget = String(paymentId || '').replace(/^pago-/, '').trim();

  try {
    const saved = localStorage.getItem('cgem_pagos_tesoreria');
    if (saved) {
      const list = JSON.parse(saved);
      const updated = list.map(p => 
        (p.id === paymentId || p.codigo_afiliado === paymentId || p.codigo_afiliado === cleanTarget) 
          ? { ...p, ...updateData } 
          : p
      );
      localStorage.setItem('cgem_pagos_tesoreria', JSON.stringify(updated));
    }
  } catch (e) {}

  if (supabase) {
    try {
      const sanitized = sanitizePagosPayload(updateData);
      sanitized.updated_at = new Date().toISOString();

      let query = supabase.from('pagos_tesoreria').update(sanitized);
      if (UUID_REGEX.test(paymentId)) {
        query = query.eq('id', paymentId);
      } else {
        query = query.eq('codigo_afiliado', cleanTarget);
      }

      const { data, error } = await query.select();
      if (error) {
        console.error('Error conciliando pago en Supabase:', error);
        throw new Error(`Error en base de datos: ${error.message}`);
      } else {
        if (typeof window !== 'undefined') {
          window.dispatchEvent(new Event('cgem_payments_updated'));
          window.dispatchEvent(new CustomEvent('cgm_treasury_updated'));
        }
      }
    } catch (err) {
      console.warn('Supabase update payment notice:', err);
      throw err;
    }
  }
}

// Actualizar detalles de facturación y cobro mensual de un pago o agremiado
export async function updatePaymentBillingDetails(paymentIdOrCode, details = {}) {
  const updateData = {
    ...details,
    updated_at: new Date().toISOString()
  };

  const cleanTarget = String(paymentIdOrCode || '').replace(/^pago-/, '').trim();

  try {
    const saved = localStorage.getItem('cgem_pagos_tesoreria');
    if (saved) {
      const list = JSON.parse(saved);
      const updated = list.map(p => 
        (p.id === paymentIdOrCode || p.codigo_afiliado === paymentIdOrCode || p.codigo_afiliado === cleanTarget) 
          ? { ...p, ...updateData } 
          : p
      );
      localStorage.setItem('cgem_pagos_tesoreria', JSON.stringify(updated));
    }
  } catch (e) {}

  if (supabase) {
    try {
      const sanitized = sanitizePagosPayload(updateData);
      sanitized.updated_at = new Date().toISOString();

      let query = supabase.from('pagos_tesoreria').update(sanitized);
      if (UUID_REGEX.test(paymentIdOrCode)) {
        query = query.eq('id', paymentIdOrCode);
      } else {
        query = query.eq('codigo_afiliado', cleanTarget);
      }

      const { error } = await query;
      if (error) {
        console.warn('Supabase update payment billing details notice:', error);
      }
    } catch (err) {
      console.warn('Supabase update payment billing details notice:', err);
    }
  }
}

// Rechazar un pago con motivo
export async function rejectPaymentRecord(paymentId, motivo = '', conciliatorName = 'Edixon Xavier Reyes Dávila (Tesorero)') {
  const updateData = {
    estado: 'rechazado',
    fecha_conciliacion: new Date().toISOString(),
    conciliado_por: conciliatorName,
    motivo_rechazo: motivo,
    updated_at: new Date().toISOString()
  };

  const cleanTarget = String(paymentId || '').replace(/^pago-/, '').trim();

  try {
    const saved = localStorage.getItem('cgem_pagos_tesoreria');
    if (saved) {
      const list = JSON.parse(saved);
      const updated = list.map(p => 
        (p.id === paymentId || p.codigo_afiliado === paymentId || p.codigo_afiliado === cleanTarget) 
          ? { ...p, ...updateData } 
          : p
      );
      localStorage.setItem('cgem_pagos_tesoreria', JSON.stringify(updated));
    }
  } catch (e) {}

  if (supabase) {
    try {
      const sanitized = sanitizePagosPayload(updateData);
      let query = supabase.from('pagos_tesoreria').update(sanitized);
      if (UUID_REGEX.test(paymentId)) {
        query = query.eq('id', paymentId);
      } else {
        query = query.eq('codigo_afiliado', cleanTarget);
      }
      const { error } = await query;
      if (error) {
        console.warn('Supabase reject payment notice:', error);
      }
    } catch (err) {
      console.warn('Supabase reject payment notice:', err);
    }
  }
}

// Eliminar / descartar un registro de pago (duplicados, intentos fallidos, etc.)
export async function deletePaymentRecord(paymentId) {
  if (!paymentId) return false;

  await persistDiscardedPaymentId(paymentId);
  const cleanTarget = String(paymentId || '').replace(/^pago-/, '').trim();

  try {
    const saved = localStorage.getItem('cgem_pagos_tesoreria');
    if (saved) {
      const list = JSON.parse(saved);
      const updated = list.filter(p => p.id !== paymentId && p.codigo_afiliado !== paymentId && p.codigo_afiliado !== cleanTarget);
      localStorage.setItem('cgem_pagos_tesoreria', JSON.stringify(updated));
    }
  } catch (e) {}

  if (supabase) {
    try {
      let query = supabase.from('pagos_tesoreria').delete();
      if (UUID_REGEX.test(paymentId)) {
        query = query.eq('id', paymentId);
      } else {
        query = query.eq('codigo_afiliado', cleanTarget);
      }
      const { error } = await query;
      if (error) {
        console.warn('Supabase delete payment notice:', error);
      }
    } catch (err) {
      console.warn('Supabase delete payment exception:', err);
    }
  }
  return true;
}

// Guardar nuevo egreso
export async function submitExpenseRecord(expenseData) {
  const newExpense = {
    ...expenseData,
    id: expenseData.id || `egreso-${Date.now()}`,
    fecha_gasto: expenseData.fecha_gasto || new Date().toISOString(),
    created_at: new Date().toISOString()
  };

  try {
    const saved = localStorage.getItem('cgem_egresos_camara');
    const list = saved ? JSON.parse(saved) : [];
    const updated = [newExpense, ...list];
    localStorage.setItem('cgem_egresos_camara', JSON.stringify(updated));
  } catch (e) {}

  if (supabase) {
    try {
      const { data, error } = await supabase
        .from('egresos_camara')
        .insert([newExpense])
        .select();

      if (!error && data && data.length > 0) {
        return data[0];
      }
    } catch (err) {
      console.warn('Supabase insert expense notice:', err);
    }
  }

  return newExpense;
}

// Eliminar egreso
export async function deleteExpenseRecord(expenseId) {
  try {
    const saved = localStorage.getItem('cgem_egresos_camara');
    if (saved) {
      const list = JSON.parse(saved);
      const updated = list.filter(e => e.id !== expenseId);
      localStorage.setItem('cgem_egresos_camara', JSON.stringify(updated));
    }
  } catch (e) {}

  if (supabase) {
    try {
      await supabase
        .from('egresos_camara')
        .delete()
        .eq('id', expenseId);
    } catch (err) {
      console.warn('Supabase delete expense notice:', err);
    }
  }
}

// Exportar Reporte de Tesorería a CSV
export function exportTreasuryCSV(payments = [], expenses = []) {
  let csv = "REPORTE OFICIAL DE TESORERÍA - CÁMARA GASTRONÓMICA DEL ESTADO MÉRIDA\n";
  csv += `Generado el: ${new Date().toLocaleString()}\n\n`;

  csv += "--- INGRESOS Y RECAUDACIÓN (DISCRIMINADO) ---\n";
  csv += "Recibo,Codigo Afiliado,Establecimiento,Inscripcion USD,Cuota Mes USD,Total USD,Monto Bs (Fijado BCV),Tasa BCV,Banco Emisor,Referencia,Tel Pagador,Estado,Fecha Pago,Conciliado Por\n";

  payments.forEach(p => {
    csv += `"${p.numero_recibo || ''}","${p.codigo_afiliado || ''}","${(p.nombre_establecimiento || '').replace(/"/g, '""')}","${p.monto_inscripcion_usd || 20}","${p.monto_cuota_mes_usd || 10}","${p.monto_usd || 0}","${p.monto_bs || 0}","${p.tasa_bcv || ''}","${p.banco_emisor || ''}","${p.referencia || ''}","${p.telefono_pagador || ''}","${p.estado || ''}","${p.fecha_pago ? new Date(p.fecha_pago).toLocaleDateString() : ''}","${p.conciliado_por || ''}"\n`;
  });

  csv += "\n--- EGRESOS Y GASTOS OPERATIVOS ---\n";
  csv += "Concepto,Categoria,Proveedor / Beneficiario,Monto USD,Monto Bs,Metodo,Referencia,Fecha Gasto,Aprobado Por\n";

  expenses.forEach(e => {
    csv += `"${(e.concepto || '').replace(/"/g, '""')}","${e.categoria || ''}","${(e.beneficiario_proveedor || '').replace(/"/g, '""')}","${e.monto_usd || 0}","${e.monto_bs || 0}","${e.metodo_pago || ''}","${e.referencia_comprobante || ''}","${e.fecha_gasto ? new Date(e.fecha_gasto).toLocaleDateString() : ''}","${e.aprobado_por || ''}"\n`;
  });

  const blob = new Blob(["\ufeff" + csv], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.setAttribute('href', url);
  link.setAttribute('download', `Reporte_Tesoreria_CGEM_${new Date().toISOString().slice(0, 10)}.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}
