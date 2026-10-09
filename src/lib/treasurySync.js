import { supabase } from './supabaseClient';

export const INITIAL_PAYMENTS = [
  {
    id: "pago-001",
    numero_recibo: "REC-2026-0001",
    codigo_afiliado: "CGM-2026-001",
    nombre_establecimiento: "Kaffia Caffe",
    representante_legal: "Gerencia & Equipo Kaffia",
    rif_cedula: "J-50123456-7",
    telefono: "04148817137",
    email: "cafe.kaffia@gmail.com",
    concepto: "Inscripción + 1er Mes",
    periodo_mes: "Enero 2026",
    metodo_pago: "pago_movil",
    banco_emisor: "Banco Provincial",
    banco_receptor: "Banco Provincial (0108)",
    referencia: "00492817",
    telefono_pagador: "04148817137",
    monto_bs: 1500.00,
    tasa_bcv: 50.00,
    monto_usd: 30.00,
    estado: "conciliado",
    fecha_pago: "2026-01-05T10:30:00Z",
    fecha_conciliacion: "2026-01-05T11:15:00Z",
    conciliado_por: "Edixon Xavier Reyes Dávila (Tesorero)",
    observaciones: "Pago verificado en cuenta oficial Provincial"
  },
  {
    id: "pago-002",
    numero_recibo: "REC-2026-0002",
    codigo_afiliado: "CGM-2026-001",
    nombre_establecimiento: "Kaffia Caffe",
    representante_legal: "Gerencia & Equipo Kaffia",
    rif_cedula: "J-50123456-7",
    telefono: "04148817137",
    email: "cafe.kaffia@gmail.com",
    concepto: "Cuota Mensual",
    periodo_mes: "Septiembre 2026",
    metodo_pago: "pago_movil",
    banco_emisor: "Banco Provincial",
    banco_receptor: "Banco Provincial (0108)",
    referencia: "00984729",
    telefono_pagador: "04148817137",
    monto_bs: 520.00,
    tasa_bcv: 52.00,
    monto_usd: 10.00,
    estado: "conciliado",
    fecha_pago: "2026-09-01T14:20:00Z",
    fecha_conciliacion: "2026-09-01T15:00:00Z",
    conciliado_por: "Edixon Xavier Reyes Dávila (Tesorero)",
    observaciones: "Cuota ordinaria de Septiembre conciliada"
  },
  {
    id: "pago-003",
    numero_recibo: "REC-2026-0003",
    codigo_afiliado: "CGM-2026-002",
    nombre_establecimiento: "La Sevillana Restaurant",
    representante_legal: "Carlos Mendoza",
    rif_cedula: "J-40987654-3",
    telefono: "04247654321",
    email: "contacto@lasevillanamerida.com",
    concepto: "Inscripción + 1er Mes",
    periodo_mes: "Febrero 2026",
    metodo_pago: "transferencia_nacional",
    banco_emisor: "Banesco",
    banco_receptor: "Banco Provincial (0108)",
    referencia: "78921634",
    telefono_pagador: "04247654321",
    monto_bs: 1600.00,
    tasa_bcv: 53.33,
    monto_usd: 30.00,
    estado: "conciliado",
    fecha_pago: "2026-02-10T09:45:00Z",
    fecha_conciliacion: "2026-02-10T10:30:00Z",
    conciliado_por: "Edixon Xavier Reyes Dávila (Tesorero)",
    observaciones: "Inscripción aprobada"
  },
  {
    id: "pago-004",
    numero_recibo: "REC-2026-0004",
    codigo_afiliado: "CGM-2026-003",
    nombre_establecimiento: "Chocolates La Mucuy",
    representante_legal: "Andreina Ramírez",
    rif_cedula: "J-31245678-9",
    telefono: "04147000001",
    email: "andreinaramirez@camaragastronomicamerida.org",
    concepto: "Cuota Mensual",
    periodo_mes: "Octubre 2026",
    metodo_pago: "pago_movil",
    banco_emisor: "Banco Mercantil",
    banco_receptor: "Banco Provincial (0108)",
    referencia: "83749201",
    telefono_pagador: "04147000001",
    monto_bs: 540.00,
    tasa_bcv: 54.00,
    monto_usd: 10.00,
    estado: "pendiente",
    fecha_pago: new Date().toISOString(),
    fecha_conciliacion: null,
    conciliado_por: null,
    observaciones: "Reporte de pago móvil recibido vía web. Pendiente por conciliación en extracto"
  }
];

export const INITIAL_EXPENSES = [
  {
    id: "egreso-001",
    concepto: "Diseño y Producción de Pendones Institucionales Sello AAA",
    categoria: "Publicidad & Medios",
    monto_usd: 45.00,
    monto_bs: 2430.00,
    metodo_pago: "transferencia",
    referencia_comprobante: "REF-EG-001",
    beneficiario_proveedor: "Impresos Gráficos Los Andes C.A.",
    fecha_gasto: "2026-09-15T11:00:00Z",
    aprobado_por: "Edixon Xavier Reyes Dávila (Tesorero)",
    observaciones: "Material publicitario para eventos gremiales"
  },
  {
    id: "egreso-002",
    concepto: "Dominio Web y Servidor Plataforma Mérida Gastronómica",
    categoria: "Servicios Web & Plataforma",
    monto_usd: 35.00,
    monto_bs: 1890.00,
    metodo_pago: "zelle",
    referencia_comprobante: "ZEL-HOST-2026",
    beneficiario_proveedor: "Infraestructura Cloud & Vercel Services",
    fecha_gasto: "2026-09-20T16:30:00Z",
    aprobado_por: "Edixon Xavier Reyes Dávila (Tesorero)",
    observaciones: "Mantenimiento del portal oficial y base de datos"
  }
];

// Generar número correlativo de recibo
export const generateReceiptNumber = (existingPayments = []) => {
  const currentYear = new Date().getFullYear();
  const count = existingPayments.length + 1;
  const padNum = String(count).padStart(4, '0');
  return `REC-${currentYear}-${padNum}`;
};

// Obtener pagos desde Supabase o localStorage
export async function fetchLivePayments() {
  try {
    const saved = localStorage.getItem('cgem_pagos_tesoreria');
    let localData = saved ? JSON.parse(saved) : INITIAL_PAYMENTS;

    if (supabase) {
      try {
        const { data, error } = await supabase
          .from('pagos_tesoreria')
          .select('*')
          .order('fecha_pago', { ascending: false });

        if (!error && Array.isArray(data) && data.length > 0) {
          localStorage.setItem('cgem_pagos_tesoreria', JSON.stringify(data));
          return data;
        }
      } catch (err) {
        console.warn('Supabase pagos notice:', err);
      }
    }
    return localData;
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
    const existsIndex = list.findIndex(p => p.id === newRecord.id || p.referencia === newRecord.referencia);
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
