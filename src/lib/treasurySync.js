import { supabase } from './supabaseClient';
import { INITIAL_DIRECTORY_DATA } from '../data/initialDirectoryData';

// Función auxiliar para extraer datos de pago de las observaciones del registro
export function parsePaymentFromMember(member, index = 1) {
  const obs = member.observaciones || '';
  
  // Extraer referencia
  const refMatch = obs.match(/Ref:\s*([^\s(]+)/i);
  const referencia = refMatch ? refMatch[1] : (member.rif_cedula ? `REF-${member.rif_cedula.replace(/\D/g, '').slice(-6)}` : `REF-${Math.floor(100000 + Math.random() * 900000)}`);

  // Extraer banco emisor
  const bankMatch = obs.match(/\(([^)]+)\)/);
  const bancoEmisor = bankMatch ? bankMatch[1] : 'Banco Provincial';

  // Extraer teléfono pagador
  const telMatch = obs.match(/Tel\.\s*Pagador:\s*([^\s.]+)/i);
  const telefonoPagador = telMatch ? telMatch[1] : (member.telefono || '');

  // Extraer monto Bs
  const bsMatch = obs.match(/Monto\s*Bs:\s*([0-9.,]+)/i);
  let montoBs = 0;
  if (bsMatch) {
    const rawBs = bsMatch[1].replace(/\./g, '').replace(',', '.');
    montoBs = parseFloat(rawBs) || 0;
  }

  const montoUsd = parseFloat(member.monto_inscripcion) || 30.00;
  if (montoBs === 0) {
    montoBs = montoUsd * 54.00;
  }

  const isSolvent = (member.estado_solvencia || '').toLowerCase().includes('solvente');
  const padIndex = String(index).padStart(4, '0');

  return {
    id: `pago-real-${member.id || member.codigo_afiliado}`,
    numero_recibo: `REC-2026-${padIndex}`,
    codigo_afiliado: member.codigo_afiliado,
    nombre_establecimiento: member.nombre_establecimiento,
    representante_legal: member.representante_legal || '',
    rif_cedula: member.rif_cedula || '',
    telefono: member.telefono || '',
    email: member.email || '',
    concepto: 'Inscripción + 1er Mes de Membresía',
    periodo_mes: 'Octubre 2026',
    metodo_pago: bancoEmisor.toLowerCase().includes('provincial') ? 'pago_movil' : 'transferencia_nacional',
    banco_emisor: bancoEmisor,
    banco_receptor: 'Banco Provincial (0108)',
    referencia: referencia,
    telefono_pagador: telefonoPagador,
    monto_bs: montoBs,
    tasa_bcv: 54.00,
    monto_usd: montoUsd,
    estado: isSolvent ? 'conciliado' : 'pendiente',
    fecha_pago: member.fecha_registro || member.created_at || new Date().toISOString(),
    fecha_conciliacion: isSolvent ? (member.updated_at || member.fecha_registro || new Date().toISOString()) : null,
    conciliado_por: isSolvent ? 'Edixon Xavier Reyes Dávila (Tesorero)' : null,
    observaciones: member.observaciones || 'Registro Web Público'
  };
}

// Lista Real Base de Pagos (Construida directamente a partir de los 12 agremiados reales)
export const INITIAL_PAYMENTS = INITIAL_DIRECTORY_DATA.map((member, idx) => parsePaymentFromMember(member, idx + 1));

// Gastos reales (Inicialmente vacío hasta que Tesorería registre facturas reales)
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
    let baseList = [...INITIAL_PAYMENTS];

    // 1. Intentar cargar desde Supabase directorio_agremiados & pagos_tesoreria
    if (supabase) {
      try {
        // Cargar pagos de tabla pagos_tesoreria
        const { data: pagosData, error: pagosErr } = await supabase
          .from('pagos_tesoreria')
          .select('*')
          .order('fecha_pago', { ascending: false });

        if (!pagosErr && Array.isArray(pagosData) && pagosData.length > 0) {
          localStorage.setItem('cgem_pagos_tesoreria', JSON.stringify(pagosData));
          return pagosData;
        }

        // Si pagos_tesoreria aún está vacía, cargar agremiados de directorio_agremiados y mapear a pagos
        const { data: dirData, error: dirErr } = await supabase
          .from('directorio_agremiados')
          .select('*')
          .order('created_at', { ascending: false });

        if (!dirErr && Array.isArray(dirData) && dirData.length > 0) {
          const mapped = dirData.map((m, idx) => parsePaymentFromMember(m, idx + 1));
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
        return parsed;
      }
    }

    return baseList;
  } catch (e) {
    return INITIAL_PAYMENTS;
  }
}

// Obtener egresos desde Supabase o localStorage
export async function fetchLiveExpenses() {
  try {
    const saved = localStorage.getItem('cgem_egresos_camara');
    let localData = saved ? JSON.parse(saved) : INITIAL_EXPENSES;

    if (supabase) {
      try {
        const { data, error } = await supabase
          .from('egresos_camara')
          .select('*')
          .order('fecha_gasto', { ascending: false });

        if (!error && Array.isArray(data) && data.length > 0) {
          localStorage.setItem('cgem_egresos_camara', JSON.stringify(data));
          return data;
        }
      } catch (err) {
        console.warn('Supabase egresos notice:', err);
      }
    }
    return localData;
  } catch (e) {
    return INITIAL_EXPENSES;
  }
}

// Guardar nuevo reporte de pago (usado tanto por agremiados como por tesorería)
export async function submitPaymentRecord(paymentData) {
  const newRecord = {
    ...paymentData,
    id: paymentData.id || `pago-${Date.now()}`,
    numero_recibo: paymentData.numero_recibo || generateReceiptNumber(),
    created_at: new Date().toISOString(),
    fecha_pago: paymentData.fecha_pago || new Date().toISOString(),
    estado: paymentData.estado || 'pendiente'
  };

  // 1. Guardar localmente
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

  // 2. Persistir en Supabase
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

// Conciliar un pago (Aprobación del Tesorero)
export async function reconcilePaymentRecord(paymentId, conciliatorName = 'Edixon Xavier Reyes Dávila (Tesorero)') {
  const updateData = {
    estado: 'conciliado',
    fecha_conciliacion: new Date().toISOString(),
    conciliado_por: conciliatorName
  };

  // LocalStorage update
  try {
    const saved = localStorage.getItem('cgem_pagos_tesoreria');
    if (saved) {
      const list = JSON.parse(saved);
      const updated = list.map(p => p.id === paymentId ? { ...p, ...updateData } : p);
      localStorage.setItem('cgem_pagos_tesoreria', JSON.stringify(updated));
    }
  } catch (e) {}

  // Supabase update
  if (supabase) {
    try {
      await supabase
        .from('pagos_tesoreria')
        .update(updateData)
        .eq('id', paymentId);
    } catch (err) {
      console.warn('Supabase update payment notice:', err);
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
    const list = saved ? JSON.parse(saved) : [...INITIAL_EXPENSES];
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

  csv += "--- INGRESOS Y RECAUDACIÓN ---\n";
  csv += "Recibo,Codigo Afiliado,Establecimiento,Concepto,Periodo,Metodo,Banco Emisor,Referencia,Monto USD,Monto Bs,Estado,Fecha Pago,Conciliado Por\n";

  payments.forEach(p => {
    csv += `"${p.numero_recibo || ''}","${p.codigo_afiliado || ''}","${(p.nombre_establecimiento || '').replace(/"/g, '""')}","${p.concepto || ''}","${p.periodo_mes || ''}","${p.metodo_pago || ''}","${p.banco_emisor || ''}","${p.referencia || ''}","${p.monto_usd || 0}","${p.monto_bs || 0}","${p.estado || ''}","${p.fecha_pago ? new Date(p.fecha_pago).toLocaleDateString() : ''}","${p.conciliado_por || ''}"\n`;
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
