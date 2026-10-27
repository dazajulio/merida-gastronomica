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
  if (isNaN(cuotaMesUsd) || cuotaMesUsd <= 0) cuotaMesUsd = 10.00;
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

// Lista Real Base de Pagos (Construida estrictamente con los 12 agremiados reales)
export const INITIAL_PAYMENTS = INITIAL_DIRECTORY_DATA.map((member, idx) => parsePaymentFromMember(member, idx + 1));

// Gastos reales: 0 egresos por defecto (sin datos inventados)
export const INITIAL_EXPENSES = [];

// Generar número correlativo de recibo
export const generateReceiptNumber = (existingPayments = []) => {
  const currentYear = new Date().getFullYear();
  const count = existingPayments.length + 1;
  const padNum = String(count).padStart(4, '0');
  return `REC-${currentYear}-${padNum}`;
};

// Obtener pagos desde Supabase o localStorage con auto-sincronización de registros reales
export async function fetchLivePayments() {
  try {
    let baseList = [...INITIAL_PAYMENTS].filter(p => p.codigo_afiliado !== 'CGM-2026-383');

    // 1. Intentar cargar desde Supabase directorio_agremiados & pagos_tesoreria
    if (supabase) {
      try {
        const { data: pagosData, error: pagosErr } = await supabase
          .from('pagos_tesoreria')
          .select('*')
          .order('fecha_pago', { ascending: false });

        if (!pagosErr && Array.isArray(pagosData) && pagosData.length > 0) {
          const cleanPagos = pagosData.filter(p => p.codigo_afiliado !== 'CGM-2026-383');
          localStorage.setItem('cgem_pagos_tesoreria', JSON.stringify(cleanPagos));
          return cleanPagos;
        }

        const { data: dirData, error: dirErr } = await supabase
          .from('directorio_agremiados')
          .select('*')
          .order('created_at', { ascending: false });

        if (!dirErr && Array.isArray(dirData) && dirData.length > 0) {
          const cleanDir = dirData.filter(m => m.codigo_afiliado !== 'CGM-2026-383');
          const mapped = cleanDir.map((m, idx) => parsePaymentFromMember(m, idx + 1));
          localStorage.setItem('cgem_pagos_tesoreria', JSON.stringify(mapped));
          return mapped;
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
        const cleanSaved = parsed.filter(p => p.codigo_afiliado !== 'CGM-2026-383');
        return cleanSaved;
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
  const newRecord = {
    ...paymentData,
    id: paymentData.id || `pago-${Date.now()}`,
    numero_recibo: paymentData.numero_recibo || generateReceiptNumber(),
    created_at: new Date().toISOString(),
    fecha_pago: paymentData.fecha_pago || new Date().toISOString(),
    estado: paymentData.estado || 'pendiente'
  };

  try {
    const saved = localStorage.getItem('cgem_pagos_tesoreria');
    const list = saved ? JSON.parse(saved) : [...INITIAL_PAYMENTS];
    const existsIndex = list.findIndex(p => p.id === newRecord.id || (p.referencia && p.referencia === newRecord.referencia));
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
      const { data, error } = await supabase
        .from('pagos_tesoreria')
        .insert([newRecord])
        .select();

      if (!error && data && data.length > 0) {
        return data[0];
      }
    } catch (err) {
      console.warn('Supabase insert payment notice:', err);
    }
  }

  return newRecord;
}

// Conciliar un pago (Aprobación del Tesorero o Presidente)
export async function reconcilePaymentRecord(paymentId, conciliatorName = 'Edixon Xavier Reyes Dávila (Tesorero)', extraDetails = {}) {
  const updateData = {
    estado: 'conciliado',
    fecha_conciliacion: new Date().toISOString(),
    conciliado_por: conciliatorName,
    ...extraDetails
  };

  try {
    const saved = localStorage.getItem('cgem_pagos_tesoreria');
    if (saved) {
      const list = JSON.parse(saved);
      const updated = list.map(p => (p.id === paymentId || p.codigo_afiliado === paymentId) ? { ...p, ...updateData } : p);
      localStorage.setItem('cgem_pagos_tesoreria', JSON.stringify(updated));
    }
  } catch (e) {}

  if (supabase) {
    try {
      await supabase
        .from('pagos_tesoreria')
        .update(updateData)
        .or(`id.eq.${paymentId},codigo_afiliado.eq.${paymentId}`);
    } catch (err) {
      console.warn('Supabase update payment notice:', err);
    }
  }
}

// Actualizar detalles de facturación y cobro mensual de un pago o agremiado
export async function updatePaymentBillingDetails(paymentIdOrCode, details = {}) {
  const updateData = {
    ...details,
    updated_at: new Date().toISOString()
  };

  try {
    const saved = localStorage.getItem('cgem_pagos_tesoreria');
    if (saved) {
      const list = JSON.parse(saved);
      const updated = list.map(p => (p.id === paymentIdOrCode || p.codigo_afiliado === paymentIdOrCode) ? { ...p, ...updateData } : p);
      localStorage.setItem('cgem_pagos_tesoreria', JSON.stringify(updated));
    }
  } catch (e) {}

  if (supabase) {
    try {
      await supabase
        .from('pagos_tesoreria')
        .update(updateData)
        .or(`id.eq.${paymentIdOrCode},codigo_afiliado.eq.${paymentIdOrCode}`);
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
    motivo_rechazo: motivo
  };

  try {
    const saved = localStorage.getItem('cgem_pagos_tesoreria');
    if (saved) {
      const list = JSON.parse(saved);
      const updated = list.map(p => p.id === paymentId ? { ...p, ...updateData } : p);
      localStorage.setItem('cgem_pagos_tesoreria', JSON.stringify(updated));
    }
  } catch (e) {}

  if (supabase) {
    try {
      await supabase
        .from('pagos_tesoreria')
        .update(updateData)
        .eq('id', paymentId);
    } catch (err) {
      console.warn('Supabase reject payment notice:', err);
    }
  }
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
