import React, { useState, useEffect, useMemo } from 'react';
import { 
  CircleDollarSign, 
  DollarSign, 
  TrendingUp, 
  TrendingDown, 
  CheckCircle2, 
  Clock, 
  AlertCircle, 
  Search, 
  Filter, 
  FileSpreadsheet, 
  Plus, 
  Receipt, 
  Printer, 
  Download, 
  Share2, 
  Trash2, 
  Check, 
  X, 
  Building2, 
  Phone, 
  MessageCircle, 
  CreditCard, 
  Landmark, 
  ShieldCheck, 
  Calendar, 
  UserCheck, 
  FileText, 
  ExternalLink,
  ChevronRight,
  Info,
  Mail,
  Send,
  Sparkles,
  ArrowUpRight
} from 'lucide-react';
import { 
  fetchLivePayments, 
  fetchLiveExpenses, 
  submitPaymentRecord, 
  reconcilePaymentRecord, 
  rejectPaymentRecord, 
  submitExpenseRecord, 
  deleteExpenseRecord, 
  exportTreasuryCSV,
  generateReceiptNumber,
  parsePaymentFromMember
} from '../lib/treasurySync';
import { supabase } from '../lib/supabaseClient';
import { sendPaymentReceiptEmail } from '../lib/emailService';

export function TreasuryManagementModule({ currentUser, directoryMembers = [], onDirectoryUpdate }) {
  // State
  const [payments, setPayments] = useState([]);
  const [expenses, setExpenses] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [treasuryTab, setTreasuryTab] = useState('conciliacion'); // 'conciliacion' | 'cuotas' | 'egresos' | 'recibos'
  
  // Filters & Search
  const [paymentFilter, setPaymentFilter] = useState('todos'); // 'todos' | 'pendiente' | 'conciliado' | 'rechazado'
  const [searchTerm, setSearchTerm] = useState('');
  
  // Notification Toast
  const [toastMessage, setToastMessage] = useState(null);
  const [isSendingReceiptEmail, setIsSendingReceiptEmail] = useState(false);

  // Modals
  const [selectedReceipt, setSelectedReceipt] = useState(null);
  const [isManualModalOpen, setIsManualModalOpen] = useState(false);
  const [isExpenseModalOpen, setIsExpenseModalOpen] = useState(false);
  const [isRejectModalOpen, setIsRejectModalOpen] = useState(false);
  const [rejectingPayment, setRejectingPayment] = useState(null);
  const [rejectionReason, setRejectionReason] = useState('');

  // Form Data: Manual Payment
  const [manualFormData, setManualFormData] = useState({
    codigo_afiliado: '',
    nombre_establecimiento: '',
    representante_legal: '',
    rif_cedula: '',
    telefono: '',
    email: '',
    concepto: 'Inscripción + 1er Mes de Membresía',
    periodo_mes: 'Octubre 2026',
    monto_inscripcion_usd: 20,
    monto_cuota_mes_usd: 10,
    monto_usd: 30,
    monto_bs: 26241.96,
    tasa_bcv: 874.73,
    metodo_pago: 'pago_movil',
    banco_emisor: 'Banco Provincial',
    banco_receptor: 'Banco Provincial (0108)',
    referencia: '',
    telefono_pagador: '',
    estado: 'conciliado',
    observaciones: 'Pago verificado y registrado directamente por Tesorería'
  });

  // Form Data: Expense
  const [expenseFormData, setExpenseFormData] = useState({
    concepto: '',
    categoria: 'Eventos & Logística',
    monto_usd: 0,
    monto_bs: 0,
    metodo_pago: 'transferencia',
    referencia_comprobante: '',
    beneficiario_proveedor: '',
    observaciones: ''
  });

  // Helper to show Toast
  const showToast = (msg, type = 'success') => {
    setToastMessage({ msg, type });
    setTimeout(() => {
      setToastMessage(null);
    }, 4500);
  };

  // Load Real Data
  const loadTreasuryData = async () => {
    try {
      setIsLoading(true);
      const [paymentsData, expensesData] = await Promise.all([
        fetchLivePayments(),
        fetchLiveExpenses()
      ]);

      let finalPayments = Array.isArray(paymentsData) ? [...paymentsData] : [];
      if (Array.isArray(directoryMembers) && directoryMembers.length > 0) {
        directoryMembers.forEach((m, idx) => {
          const exists = finalPayments.some(p => 
            (m.codigo_afiliado && p.codigo_afiliado === m.codigo_afiliado) ||
            (m.email && p.email && p.email.toLowerCase() === m.email.toLowerCase()) ||
            (m.id && p.id && p.id === m.id)
          );
          if (!exists) {
            finalPayments.push(parsePaymentFromMember(m, finalPayments.length + 1));
          }
        });
      }

      setPayments(finalPayments);
      setExpenses(expensesData || []);
    } catch (err) {
      console.warn('Error loading treasury data:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadTreasuryData();
  }, [directoryMembers]);

  // KPIs Calculations with Real Discrimination
  const reconciledPayments = useMemo(() => payments.filter(p => p.estado === 'conciliado'), [payments]);
  const pendingPayments = useMemo(() => payments.filter(p => p.estado === 'pendiente'), [payments]);

  // Recaudación Conciliada
  const totalReconciledUSD = useMemo(() => {
    return reconciledPayments.reduce((sum, p) => sum + (parseFloat(p.monto_usd) || 0), 0);
  }, [reconciledPayments]);

  const totalReconciledBS = useMemo(() => {
    return reconciledPayments.reduce((sum, p) => sum + (parseFloat(p.monto_bs) || 0), 0);
  }, [reconciledPayments]);

  const reconciledInscripcionUSD = useMemo(() => {
    return reconciledPayments.reduce((sum, p) => sum + (parseFloat(p.monto_inscripcion_usd) || (p.monto_usd > 20 ? 20 : 10)), 0);
  }, [reconciledPayments]);

  const reconciledCuotaUSD = useMemo(() => {
    return reconciledPayments.reduce((sum, p) => sum + (parseFloat(p.monto_cuota_mes_usd) || 10), 0);
  }, [reconciledPayments]);

  // Por Conciliar
  const totalPendingUSD = useMemo(() => {
    return pendingPayments.reduce((sum, p) => sum + (parseFloat(p.monto_usd) || 0), 0);
  }, [pendingPayments]);

  const totalPendingBS = useMemo(() => {
    return pendingPayments.reduce((sum, p) => sum + (parseFloat(p.monto_bs) || 0), 0);
  }, [pendingPayments]);

  const pendingInscripcionUSD = useMemo(() => {
    return pendingPayments.reduce((sum, p) => sum + (parseFloat(p.monto_inscripcion_usd) || (p.monto_usd > 20 ? 20 : 10)), 0);
  }, [pendingPayments]);

  const pendingCuotaUSD = useMemo(() => {
    return pendingPayments.reduce((sum, p) => sum + (parseFloat(p.monto_cuota_mes_usd) || 10), 0);
  }, [pendingPayments]);

  // Total Global (Cartera)
  const totalGlobalUSD = useMemo(() => payments.reduce((sum, p) => sum + (parseFloat(p.monto_usd) || 0), 0), [payments]);
  const totalGlobalBS = useMemo(() => payments.reduce((sum, p) => sum + (parseFloat(p.monto_bs) || 0), 0), [payments]);

  // Egresos
  const totalExpensesUSD = useMemo(() => expenses.reduce((sum, e) => sum + (parseFloat(e.monto_usd) || 0), 0), [expenses]);
  const totalExpensesBS = useMemo(() => expenses.reduce((sum, e) => sum + (parseFloat(e.monto_bs) || 0), 0), [expenses]);

  // Solvencias
  const solventMembersCount = useMemo(() => {
    return directoryMembers.filter(m => (m.estado_solvencia || '').toLowerCase().includes('solvente')).length;
  }, [directoryMembers]);

  const pendingMembersCount = useMemo(() => {
    return directoryMembers.filter(m => !(m.estado_solvencia || '').toLowerCase().includes('solvente')).length;
  }, [directoryMembers]);

  // Filtered Payments
  const filteredPayments = useMemo(() => {
    return payments.filter(p => {
      const matchFilter = paymentFilter === 'todos' ? true : p.estado === paymentFilter;
      const matchSearch = searchTerm === '' || 
        (p.nombre_establecimiento || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
        (p.codigo_afiliado || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
        (p.referencia || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
        (p.numero_recibo || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
        (p.representante_legal || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
        (p.rif_cedula || '').toLowerCase().includes(searchTerm.toLowerCase());
      return matchFilter && matchSearch;
    });
  }, [payments, paymentFilter, searchTerm]);

  // Handle Select Member for Manual Payment
  const handleSelectMemberForManualPayment = (memberCode) => {
    const found = directoryMembers.find(m => m.codigo_afiliado === memberCode);
    if (found) {
      const totalUsd = parseFloat(found.monto_inscripcion) || 30;
      const inscripcion = totalUsd > 20 ? 20 : 10;
      const cuota = 10;
      const tasa = 874.73;
      setManualFormData(prev => ({
        ...prev,
        codigo_afiliado: found.codigo_afiliado,
        nombre_establecimiento: found.nombre_establecimiento,
        representante_legal: found.representante_legal || '',
        rif_cedula: found.rif_cedula || '',
        telefono: found.telefono || '',
        email: found.email || '',
        telefono_pagador: found.telefono || '',
        monto_inscripcion_usd: inscripcion,
        monto_cuota_mes_usd: cuota,
        monto_usd: totalUsd,
        monto_bs: totalUsd === 30 ? 26241.96 : 17494.64,
        tasa_bcv: tasa
      }));
    }
  };

  // SEND RECEIPT EMAIL ACTION (EXPLICIT DIRECT BUTTON)
  const handleSendReceiptDirectly = async (payment) => {
    const targetEmail = payment.email || directoryMembers.find(m => m.codigo_afiliado === payment.codigo_afiliado)?.email;
    if (!targetEmail || !targetEmail.includes('@')) {
      alert(`El establecimiento "${payment.nombre_establecimiento}" no tiene un correo electrónico válido registrado.`);
      return;
    }

    try {
      setIsSendingReceiptEmail(true);
      const conciliator = currentUser?.name ? `${currentUser.name} (Tesorero)` : 'Edixon Xavier Reyes Dávila (Tesorero)';

      await sendPaymentReceiptEmail({
        recipientEmail: targetEmail,
        receiptNumber: payment.numero_recibo,
        establishmentName: payment.nombre_establecimiento,
        ownerName: payment.representante_legal,
        affiliateCode: payment.codigo_afiliado,
        rif: payment.rif_cedula,
        concept: payment.concepto || 'Inscripción + 1er Mes de Membresía',
        period: payment.periodo_mes || 'Octubre 2026',
        paymentMethod: payment.metodo_pago,
        referenceNumber: payment.referencia,
        amountUsd: payment.monto_usd,
        amountBs: payment.monto_bs,
        paymentDate: payment.fecha_pago,
        reconciledBy: conciliator,
        newExpiryDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString()
      });

      showToast(`✓ Recibo ${payment.numero_recibo} enviado exitosamente a ${targetEmail}`);
    } catch (err) {
      alert('Error al enviar correo: ' + err.message);
    } finally {
      setIsSendingReceiptEmail(false);
    }
  };

  // Reconcile / Approve Payment Action
  const handleApprovePayment = async (payment) => {
    try {
      const conciliator = currentUser?.name ? `${currentUser.name} (Tesorero)` : 'Edixon Xavier Reyes Dávila (Tesorero)';
      await reconcilePaymentRecord(payment.id, conciliator);

      // Update state
      setPayments(prev => prev.map(p => p.id === payment.id ? {
        ...p,
        estado: 'conciliado',
        fecha_conciliacion: new Date().toISOString(),
        conciliado_por: conciliator
      } : p));

      // Update member in directory to 'Solvente (Activo)'
      if (payment.codigo_afiliado || payment.email) {
        try {
          const localSaved = localStorage.getItem('cgem_directorio_agremiados');
          if (localSaved) {
            const list = JSON.parse(localSaved);
            const updated = list.map(m => {
              if (
                (payment.codigo_afiliado && m.codigo_afiliado === payment.codigo_afiliado) ||
                (payment.email && m.email && m.email.toLowerCase() === payment.email.toLowerCase())
              ) {
                return {
                  ...m,
                  estado_solvencia: 'Solvente (Activo)',
                  fecha_vencimiento: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString()
                };
              }
              return m;
            });
            localStorage.setItem('cgem_directorio_agremiados', JSON.stringify(updated));
            if (onDirectoryUpdate) onDirectoryUpdate(updated);
          }

          if (supabase) {
            await supabase
              .from('directorio_agremiados')
              .update({
                estado_solvencia: 'Solvente (Activo)',
                fecha_vencimiento: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString()
              })
              .or(`codigo_afiliado.eq.${payment.codigo_afiliado},email.eq.${payment.email}`);
          }
        } catch (e) {
          console.warn('Error updating member status:', e);
        }
      }

      // Automatically dispatch email receipt
      handleSendReceiptDirectly(payment);
      showToast(`✓ Pago conciliado y registrado como Solvente: ${payment.nombre_establecimiento}`);
    } catch (err) {
      alert('Error al conciliar pago: ' + err.message);
    }
  };

  // Reject Payment Action
  const handleOpenRejectModal = (payment) => {
    setRejectingPayment(payment);
    setRejectionReason('Referencia bancaria no encontrada en extracto bancario de Banco Provincial.');
    setIsRejectModalOpen(true);
  };

  const handleConfirmReject = async () => {
    if (!rejectingPayment) return;
    try {
      const conciliator = currentUser?.name ? `${currentUser.name} (Tesorero)` : 'Edixon Xavier Reyes Dávila (Tesorero)';
      await rejectPaymentRecord(rejectingPayment.id, rejectionReason, conciliator);

      setPayments(prev => prev.map(p => p.id === rejectingPayment.id ? {
        ...p,
        estado: 'rechazado',
        fecha_conciliacion: new Date().toISOString(),
        conciliado_por: conciliator,
        motivo_rechazo: rejectionReason
      } : p));

      setIsRejectModalOpen(false);
      setRejectingPayment(null);
      showToast(`Pago rechazado con observación registrada.`, 'warning');
    } catch (err) {
      alert('Error al rechazar pago: ' + err.message);
    }
  };

  // Submit Manual Payment
  const handleSubmitManualPayment = async (e) => {
    e.preventDefault();
    try {
      const newRecibo = generateReceiptNumber(payments);
      const conciliator = currentUser?.name ? `${currentUser.name} (Tesorero)` : 'Edixon Xavier Reyes Dávila (Tesorero)';
      const record = {
        ...manualFormData,
        id: `pago-${Date.now()}`,
        numero_recibo: newRecibo,
        fecha_pago: new Date().toISOString(),
        fecha_conciliacion: new Date().toISOString(),
        conciliado_por: conciliator,
        estado: 'conciliado'
      };

      const saved = await submitPaymentRecord(record);
      setPayments(prev => [saved, ...prev]);

      // Update directory member
      if (record.codigo_afiliado) {
        const localSaved = localStorage.getItem('cgem_directorio_agremiados');
        if (localSaved) {
          const list = JSON.parse(localSaved);
          const updated = list.map(m => {
            if (m.codigo_afiliado === record.codigo_afiliado) {
              return {
                ...m,
                estado_solvencia: 'Solvente (Activo)',
                fecha_vencimiento: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString()
              };
            }
            return m;
          });
          localStorage.setItem('cgem_directorio_agremiados', JSON.stringify(updated));
          if (onDirectoryUpdate) onDirectoryUpdate(updated);
        }
      }

      setIsManualModalOpen(false);
      setSelectedReceipt(saved);
      handleSendReceiptDirectly(saved);
    } catch (err) {
      alert('Error al guardar pago: ' + err.message);
    }
  };

  // Submit Expense
  const handleSubmitExpense = async (e) => {
    e.preventDefault();
    try {
      const record = {
        ...expenseFormData,
        id: `egreso-${Date.now()}`,
        fecha_gasto: new Date().toISOString(),
        aprobado_por: currentUser?.name ? `${currentUser.name} (Tesorero)` : 'Edixon Xavier Reyes Dávila (Tesorero)'
      };

      const saved = await submitExpenseRecord(record);
      setExpenses(prev => [saved, ...prev]);
      setIsExpenseModalOpen(false);
      setExpenseFormData({
        concepto: '',
        categoria: 'Eventos & Logística',
        monto_usd: 0,
        monto_bs: 0,
        metodo_pago: 'transferencia',
        referencia_comprobante: '',
        beneficiario_proveedor: '',
        observaciones: ''
      });
      showToast('✓ Egreso registrado en el libro contable');
    } catch (err) {
      alert('Error al guardar egreso: ' + err.message);
    }
  };

  // Delete Expense
  const handleDeleteExpense = async (expenseId) => {
    if (!window.confirm('¿Está seguro de eliminar este registro de egreso?')) return;
    try {
      await deleteExpenseRecord(expenseId);
      setExpenses(prev => prev.filter(e => e.id !== expenseId));
      showToast('Egreso eliminado.');
    } catch (err) {
      alert('Error al eliminar egreso: ' + err.message);
    }
  };

  // Send WhatsApp Reminder
  const handleSendWhatsAppReminder = (member) => {
    const text = `*CÁMARA GASTRONÓMICA DEL ESTADO MÉRIDA (CGEM)*%0A%0AEstimado(a) *${member.representante_legal || member.nombre_establecimiento}*, le saludamos cordialmente desde la Dirección de Tesorería de la Cámara Gastronómica.%0A%0ALe recordamos amablemente la cuota gremial mensual correspondiente a *${member.nombre_establecimiento}* por un monto de *$${member.monto_cuota_mensual || 10}.00 USD* (al cambio oficial BCV fijado al día del pago).%0A%0A*Datos Oficiales para Pago Móvil:*%0ABanco: *Provincial (0108)*%0ARIF/Cédula: *V-12517086*%0ATeléfono: *04148817137*%0AConcepto: Cuota ${member.codigo_afiliado || member.nombre_establecimiento}%0A%0AUna vez realizado, puede reportarlo directamente por el portal web o respondernos con su comprobante para emitir su recibo y solvencia digital oficial.%0A%0A_Atentamente: Edixon Xavier Reyes Dávila (Tesorero)_`;
    const cleanPhone = (member.telefono || '').replace(/\D/g, '');
    let finalPhone = cleanPhone;
    if (cleanPhone.startsWith('04')) {
      finalPhone = '58' + cleanPhone.substring(1);
    }
    window.open(`https://wa.me/${finalPhone}?text=${text}`, '_blank');
  };

  return (
    <div className="space-y-8 font-sans">
      
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-6 right-6 z-50 animate-bounce">
          <div className={`py-3 px-5 rounded-2xl shadow-2xl border text-xs font-bold flex items-center gap-2 ${
            toastMessage.type === 'warning' 
              ? 'bg-amber-900 text-amber-100 border-amber-500'
              : 'bg-emerald-900 text-emerald-100 border-emerald-400'
          }`}>
            <CheckCircle2 className="w-4 h-4 text-emerald-300" />
            <span>{toastMessage.msg}</span>
          </div>
        </div>
      )}

      {/* Header Banner */}
      <div className="bg-gradient-to-br from-slate-900 via-slate-950 to-teal-950 text-white rounded-3xl p-6 sm:p-8 shadow-2xl border border-teal-800/40 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-teal-500/10 rounded-full blur-3xl pointer-events-none -mr-20 -mt-20"></div>
        
        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-teal-500/20 text-teal-300 border border-teal-400/40 text-[10px] font-extrabold uppercase tracking-wider mb-3">
              <Landmark className="w-3.5 h-3.5 text-teal-400" />
              <span>Dirección de Tesorería & Finanzas Institucionales</span>
            </div>
            
            <h1 className="font-serif font-black text-2xl sm:text-3xl text-white tracking-wide">
              Panel de Control Financiero & Conciliación Gremial
            </h1>
            <p className="text-xs sm:text-sm text-slate-300 mt-2 max-w-3xl leading-relaxed">
              Gestión contable oficial de la Cámara Gastronómica del Estado Mérida. Todos los pagos en bolívares quedan <strong>fijados según la tasa oficial BCV del día de cada comprobante bancario</strong>. Gestión a cargo de <strong>Edixon Xavier Reyes Dávila (Tesorero)</strong>.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={() => setIsManualModalOpen(true)}
              className="py-3 px-4 rounded-2xl bg-amber-500 hover:bg-amber-600 text-slate-950 font-serif font-bold text-xs uppercase tracking-wider shadow-lg flex items-center gap-2 transition-all active:scale-98"
            >
              <Plus className="w-4 h-4 text-slate-950" />
              <span>Registrar Cobro Manual</span>
            </button>

            <button
              onClick={() => setIsExpenseModalOpen(true)}
              className="py-3 px-4 rounded-2xl bg-slate-800 hover:bg-slate-700 text-white font-serif font-bold text-xs uppercase tracking-wider shadow-md flex items-center gap-2 transition-all border border-slate-700"
            >
              <TrendingDown className="w-4 h-4 text-rose-400" />
              <span>Registrar Egreso</span>
            </button>

            <button
              onClick={() => exportTreasuryCSV(payments, expenses)}
              className="py-3 px-4 rounded-2xl bg-teal-900 hover:bg-teal-800 text-teal-100 font-serif font-bold text-xs uppercase tracking-wider shadow-sm flex items-center gap-2 transition-all border border-teal-700"
              title="Descargar informe contable en Excel / CSV con discriminado de cuotas"
            >
              <FileSpreadsheet className="w-4 h-4 text-teal-300" />
              <span>Exportar CSV</span>
            </button>
          </div>
        </div>

        {/* Bank Account Info Header Card */}
        <div className="mt-6 pt-4 border-t border-teal-800/40 grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs text-slate-300">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-teal-500/20 flex items-center justify-center text-teal-300">
              <Building2 className="w-4 h-4" />
            </div>
            <div>
              <span className="text-[10px] text-teal-300 font-bold uppercase block">Cuenta Oficial Recaudadora</span>
              <span className="font-semibold text-white">Banco Provincial (0108)</span>
            </div>
          </div>

          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-teal-500/20 flex items-center justify-center text-teal-300">
              <CreditCard className="w-4 h-4" />
            </div>
            <div>
              <span className="text-[10px] text-teal-300 font-bold uppercase block">Pago Móvil Oficial</span>
              <span className="font-mono text-white">V-12.517.086 &bull; 0414-8817137</span>
            </div>
          </div>

          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-teal-500/20 flex items-center justify-center text-teal-300">
              <UserCheck className="w-4 h-4" />
            </div>
            <div>
              <span className="text-[10px] text-teal-300 font-bold uppercase block">Tesorero Responsable</span>
              <span className="font-semibold text-white">Edixon Xavier Reyes Dávila</span>
            </div>
          </div>
        </div>
      </div>

      {/* KPI Financial Cards (Real & Discriminado) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        
        {/* KPI 1: Recaudación Conciliada */}
        <div className="p-5 rounded-3xl bg-white border border-slate-200 shadow-sm relative overflow-hidden">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-800">Recaudación Conciliada</span>
            <div className="w-8 h-8 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center">
              <CheckCircle2 className="w-4 h-4" />
            </div>
          </div>
          <div className="font-serif font-black text-2xl text-slate-900">
            ${totalReconciledUSD.toFixed(2)} <span className="text-xs font-normal text-slate-500">USD</span>
          </div>
          <div className="text-[11px] text-emerald-700 font-semibold mt-1">
            Bs. {totalReconciledBS.toLocaleString('es-VE', { minimumFractionDigits: 2 })} fijados al BCV
          </div>
          <div className="mt-2 pt-2 border-t border-slate-100 flex items-center justify-between text-[10px] text-slate-500">
            <span>Inscripciones: <strong>${reconciledInscripcionUSD}</strong></span>
            <span>Cuotas 1er Mes: <strong>${reconciledCuotaUSD}</strong></span>
          </div>
        </div>

        {/* KPI 2: Pagos Pendientes por Conciliar */}
        <div className={`p-5 rounded-3xl border shadow-sm relative overflow-hidden transition-all ${
          pendingPayments.length > 0 
            ? 'bg-amber-50/80 border-amber-300 ring-2 ring-amber-400/20' 
            : 'bg-white border-slate-200'
        }`}>
          <div className="flex items-center justify-between mb-2">
            <span className="text-[11px] font-bold uppercase tracking-wider text-amber-900">Por Conciliar en Banco</span>
            <div className={`w-8 h-8 rounded-xl flex items-center justify-center ${
              pendingPayments.length > 0 ? 'bg-amber-500 text-slate-950 animate-pulse' : 'bg-slate-100 text-slate-600'
            }`}>
              <Clock className="w-4 h-4" />
            </div>
          </div>
          <div className="font-serif font-black text-2xl text-slate-900">
            ${totalPendingUSD.toFixed(2)} <span className="text-xs font-normal text-slate-500">USD ({pendingPayments.length} pagos)</span>
          </div>
          <div className="text-[11px] text-amber-800 font-semibold mt-1">
            Bs. {totalPendingBS.toLocaleString('es-VE', { minimumFractionDigits: 2 })} en extracto
          </div>
          <div className="mt-2 pt-2 border-t border-amber-200/60 flex items-center justify-between text-[10px] text-slate-600">
            <span>Inscripciones: <strong>${pendingInscripcionUSD}</strong></span>
            <span>Cuotas: <strong>${pendingCuotaUSD}</strong></span>
          </div>
        </div>

        {/* KPI 3: Recaudación Global Total */}
        <div className="p-5 rounded-3xl bg-white border border-slate-200 shadow-sm relative overflow-hidden">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">Cartera Global Reportada</span>
            <div className="w-8 h-8 rounded-xl bg-teal-100 text-teal-700 flex items-center justify-center">
              <TrendingUp className="w-4 h-4" />
            </div>
          </div>
          <div className="font-serif font-black text-2xl text-teal-900">
            ${totalGlobalUSD.toFixed(2)} <span className="text-xs font-normal text-slate-500">USD ({payments.length} miembros)</span>
          </div>
          <div className="text-[11px] text-teal-700 font-semibold mt-1">
            Bs. {totalGlobalBS.toLocaleString('es-VE', { minimumFractionDigits: 2 })} en total
          </div>
          <div className="mt-2 pt-2 border-t border-slate-100 flex items-center justify-between text-[10px] text-slate-500">
            <span>{solventMembersCount} Solventes</span>
            <span>{pendingMembersCount} En Trámite</span>
          </div>
        </div>

        {/* KPI 4: Egresos & Superávit */}
        <div className="p-5 rounded-3xl bg-white border border-slate-200 shadow-sm relative overflow-hidden">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">Egresos & Balance</span>
            <div className="w-8 h-8 rounded-xl bg-slate-100 text-slate-600 flex items-center justify-center">
              <CircleDollarSign className="w-4 h-4" />
            </div>
          </div>
          <div className="font-serif font-black text-2xl text-emerald-700">
            ${totalExpensesUSD.toFixed(2)} <span className="text-xs font-normal text-slate-500">USD Egresos</span>
          </div>
          <div className="text-[11px] text-emerald-700 font-semibold mt-1">
            Superávit Neto: ${totalReconciledUSD.toFixed(2)} USD
          </div>
          <div className="mt-2 pt-2 border-t border-slate-100 text-[10px] text-slate-500">
            {expenses.length === 0 ? 'Sin egresos registrados a la fecha' : `${expenses.length} egresos en libro`}
          </div>
        </div>
      </div>

      {/* Sub-Navigation Tabs */}
      <div className="flex flex-wrap items-center gap-2 bg-slate-100 p-1.5 rounded-2xl border border-slate-200">
        <button
          onClick={() => setTreasuryTab('conciliacion')}
          className={`py-2.5 px-5 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
            treasuryTab === 'conciliacion'
              ? 'bg-teal-700 text-white shadow-sm font-extrabold ring-2 ring-teal-400/20'
              : 'text-slate-600 hover:text-slate-900 hover:bg-white'
          }`}
        >
          <Clock className="w-4 h-4" />
          <span>Bandeja de Conciliación ({pendingPayments.length} Pendientes)</span>
        </button>

        <button
          onClick={() => setTreasuryTab('cuotas')}
          className={`py-2.5 px-5 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
            treasuryTab === 'cuotas'
              ? 'bg-teal-700 text-white shadow-sm font-extrabold ring-2 ring-teal-400/20'
              : 'text-slate-600 hover:text-slate-900 hover:bg-white'
          }`}
        >
          <Building2 className="w-4 h-4" />
          <span>Control de Cuotas & Agremiados ({directoryMembers.length})</span>
        </button>

        <button
          onClick={() => setTreasuryTab('egresos')}
          className={`py-2.5 px-5 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
            treasuryTab === 'egresos'
              ? 'bg-teal-700 text-white shadow-sm font-extrabold ring-2 ring-teal-400/20'
              : 'text-slate-600 hover:text-slate-900 hover:bg-white'
          }`}
        >
          <TrendingDown className="w-4 h-4" />
          <span>Libro de Egresos ({expenses.length})</span>
        </button>

        <button
          onClick={() => setTreasuryTab('recibos')}
          className={`py-2.5 px-5 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
            treasuryTab === 'recibos'
              ? 'bg-teal-700 text-white shadow-sm font-extrabold ring-2 ring-teal-400/20'
              : 'text-slate-600 hover:text-slate-900 hover:bg-white'
          }`}
        >
          <Receipt className="w-4 h-4" />
          <span>Recibos Digitales Emitidos ({reconciledPayments.length})</span>
        </button>
      </div>

      {/* =========================================================================
          TAB 1: BANDEJA DE CONCILIACIÓN & ENLACE DE RECIBOS
          ========================================================================= */}
      {treasuryTab === 'conciliacion' && (
        <div className="space-y-6">
          
          {/* Controls: Search and Filters */}
          <div className="flex flex-col md:flex-row items-center justify-between gap-4 bg-white p-4 rounded-3xl border border-slate-200 shadow-sm">
            <div className="relative w-full md:w-96">
              <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Buscar por comercio, titular, código, RIF o referencia..."
                className="w-full bg-slate-50 border border-slate-200 rounded-2xl pl-10 pr-4 py-2.5 text-xs text-slate-800 focus:outline-none focus:border-teal-600 focus:bg-white font-medium"
              />
            </div>

            <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider mr-1">Filtrar:</span>
              {[
                { id: 'todos', label: `Todos (${payments.length})` },
                { id: 'pendiente', label: `Pendientes (${pendingPayments.length})` },
                { id: 'conciliado', label: `Conciliados (${reconciledPayments.length})` },
                { id: 'rechazado', label: 'Rechazados' }
              ].map(f => (
                <button
                  key={f.id}
                  onClick={() => setPaymentFilter(f.id)}
                  className={`py-2 px-3.5 rounded-xl text-xs font-bold transition-all ${
                    paymentFilter === f.id
                      ? 'bg-slate-950 text-white shadow-sm font-extrabold'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  {f.label}
                </button>
              ))}
            </div>
          </div>

          {/* Payments Table */}
          <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-slate-600 border-collapse">
                <thead className="bg-slate-50 border-b border-slate-200 text-slate-700 font-bold uppercase tracking-wider text-[10px]">
                  <tr>
                    <th className="py-4 px-4">Recibo / Fecha</th>
                    <th className="py-4 px-4">Establecimiento / Titular</th>
                    <th className="py-4 px-4">Discriminado de Pago</th>
                    <th className="py-4 px-4">Monto Bs. (Fijado BCV)</th>
                    <th className="py-4 px-4">Comprobante Bancario</th>
                    <th className="py-4 px-4 text-center">Estatus</th>
                    <th className="py-4 px-4 text-right">Acciones de Tesorería</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredPayments.length === 0 ? (
                    <tr>
                      <td colSpan="7" className="py-12 text-center text-slate-400">
                        <Receipt className="w-8 h-8 mx-auto mb-2 opacity-40 text-slate-400" />
                        <span>No se encontraron reportes de pago con los filtros actuales.</span>
                      </td>
                    </tr>
                  ) : (
                    filteredPayments.map((p) => {
                      const isPending = p.estado === 'pendiente';
                      const isApproved = p.estado === 'conciliado';
                      const isRejected = p.estado === 'rechazado';
                      const inscripcionUsd = p.monto_inscripcion_usd || (p.monto_usd > 20 ? 20 : 10);
                      const cuotaUsd = p.monto_cuota_mes_usd || 10;

                      return (
                        <tr key={p.id} className="hover:bg-slate-50/90 transition-colors">
                          
                          {/* Recibo & Fecha */}
                          <td className="py-4 px-4">
                            <span className="font-mono font-black text-teal-900 bg-teal-50 px-2 py-0.5 rounded border border-teal-200 text-[11px] block w-fit mb-1">
                              {p.numero_recibo}
                            </span>
                            <span className="text-[10px] text-slate-400 block font-medium">
                              {p.fecha_pago ? new Date(p.fecha_pago).toLocaleDateString('es-VE') : 'N/A'}
                            </span>
                          </td>

                          {/* Establecimiento & Titular */}
                          <td className="py-4 px-4">
                            <span className="font-bold text-slate-900 text-sm block">{p.nombre_establecimiento}</span>
                            <span className="text-[11px] text-slate-500 block">
                              {p.representante_legal} &bull; <strong className="text-slate-700 font-mono">{p.codigo_afiliado}</strong>
                            </span>
                            {p.rif_cedula && (
                              <span className="text-[10px] text-slate-400 block">{p.rif_cedula}</span>
                            )}
                          </td>

                          {/* Discriminado de Pago */}
                          <td className="py-4 px-4">
                            <div className="font-serif font-black text-base text-slate-900 mb-0.5">
                              ${parseFloat(p.monto_usd || 0).toFixed(2)} USD
                            </div>
                            <div className="flex flex-wrap items-center gap-1 text-[10px]">
                              <span className="bg-amber-50 text-amber-900 px-1.5 py-0.5 rounded border border-amber-200 font-bold">
                                Inscripción: ${inscripcionUsd}
                              </span>
                              <span className="bg-sky-50 text-sky-900 px-1.5 py-0.5 rounded border border-sky-200 font-bold">
                                1er Mes: ${cuotaUsd}
                              </span>
                            </div>
                          </td>

                          {/* Monto Bs y Tasa BCV */}
                          <td className="py-4 px-4">
                            <span className="font-mono font-black text-slate-900 text-xs block">
                              Bs. {parseFloat(p.monto_bs || 0).toLocaleString('es-VE', { minimumFractionDigits: 2 })}
                            </span>
                            <span className="text-[10px] text-slate-400 block font-medium">
                              Tasa BCV: {p.tasa_bcv ? `${p.tasa_bcv} Bs/$` : 'Fijada'}
                            </span>
                          </td>

                          {/* Comprobante Bancario */}
                          <td className="py-4 px-4">
                            <div className="font-mono text-slate-900 font-bold text-xs flex items-center gap-1">
                              <span>Ref: {p.referencia}</span>
                            </div>
                            <span className="text-[11px] text-slate-600 font-medium block">
                              {p.banco_emisor} &bull; {p.metodo_pago === 'pago_movil' ? 'Pago Móvil' : 'Transf.'}
                            </span>
                            {p.telefono_pagador && (
                              <span className="text-[10px] text-slate-400 block">Tel: {p.telefono_pagador}</span>
                            )}
                          </td>

                          {/* Estatus */}
                          <td className="py-4 px-4 text-center">
                            {isPending && (
                              <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-[10px] font-bold bg-amber-100 text-amber-900 border border-amber-300 shadow-sm">
                                <Clock className="w-3 h-3 text-amber-600" />
                                Pendiente
                              </span>
                            )}
                            {isApproved && (
                              <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-900 border border-emerald-300 shadow-sm">
                                <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                                Conciliado
                              </span>
                            )}
                            {isRejected && (
                              <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-[10px] font-bold bg-rose-100 text-rose-900 border border-rose-300" title={p.motivo_rechazo}>
                                <AlertCircle className="w-3 h-3 text-rose-600" />
                                Rechazado
                              </span>
                            )}
                          </td>

                          {/* Acciones de Tesorería */}
                          <td className="py-4 px-4 text-right">
                            <div className="flex flex-wrap items-center justify-end gap-1.5">
                              
                              {/* 1. Botón Conciliar */}
                              {isPending && (
                                <button
                                  onClick={() => handleApprovePayment(p)}
                                  className="py-1.5 px-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-[11px] font-bold flex items-center gap-1 shadow-sm transition-all active:scale-98"
                                  title="Aprobar pago y actualizar solvencia a 'Solvente (Activo)'"
                                >
                                  <Check className="w-3.5 h-3.5" />
                                  <span>Conciliar</span>
                                </button>
                              )}

                              {/* 2. BOTÓN PROMINENTE: ENVIAR RECIBO */}
                              <button
                                onClick={() => handleSendReceiptDirectly(p)}
                                disabled={isSendingReceiptEmail}
                                className="py-1.5 px-3 rounded-xl bg-teal-700 hover:bg-teal-800 text-white text-[11px] font-extrabold flex items-center gap-1 shadow-sm transition-all active:scale-98 border border-teal-500/40"
                                title={`Enviar recibo digital oficial al correo: ${p.email || 'registrado'}`}
                              >
                                <Send className="w-3.5 h-3.5 text-amber-300" />
                                <span>ENVIAR RECIBO</span>
                              </button>

                              {/* 3. Ver Recibo Modal */}
                              <button
                                onClick={() => setSelectedReceipt(p)}
                                className="p-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-[11px] font-bold transition-all"
                                title="Visualizar e Imprimir Recibo Oficial Digital"
                              >
                                <Receipt className="w-4 h-4 text-slate-700" />
                              </button>

                              {/* 4. Rechazar (si está pendiente) */}
                              {isPending && (
                                <button
                                  onClick={() => handleOpenRejectModal(p)}
                                  className="p-1.5 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 text-[11px] font-bold transition-all"
                                  title="Rechazar con observación"
                                >
                                  <X className="w-3.5 h-3.5" />
                                </button>
                              )}
                            </div>
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* =========================================================================
          TAB 2: CONTROL DE CUOTAS & CARTERA DE AGREMIADOS
          ========================================================================= */}
      {treasuryTab === 'cuotas' && (
        <div className="space-y-6">
          <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
              <div>
                <h3 className="font-serif font-black text-lg text-slate-900">
                  Matriz de Control de Cuotas Ordinarias & Solvencias
                </h3>
                <p className="text-xs text-slate-600">
                  Supervisión de aportes gremiales, montos mensuales y recordatorios directos por WhatsApp.
                </p>
              </div>

              <div className="flex items-center gap-2">
                <span className="text-xs font-bold px-3 py-1.5 rounded-xl bg-emerald-50 text-emerald-800 border border-emerald-200">
                  {solventMembersCount} Solventes (Activos)
                </span>
                <span className="text-xs font-bold px-3 py-1.5 rounded-xl bg-amber-50 text-amber-800 border border-amber-200">
                  {pendingMembersCount} En Trámite / Pendientes
                </span>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-slate-600 border-collapse">
                <thead className="bg-slate-50 border-b border-slate-200 text-slate-700 font-bold uppercase tracking-wider text-[10px]">
                  <tr>
                    <th className="py-3.5 px-4">Código / RIF</th>
                    <th className="py-3.5 px-4">Establecimiento</th>
                    <th className="py-3.5 px-4">Titular & Contacto</th>
                    <th className="py-3.5 px-4">Cuota Mensual</th>
                    <th className="py-3.5 px-4 text-center">Solvencia</th>
                    <th className="py-3.5 px-4 text-right">Gestión Directa</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {directoryMembers.map((member) => {
                    const isSolvent = (member.estado_solvencia || '').toLowerCase().includes('solvente');

                    return (
                      <tr key={member.id || member.codigo_afiliado} className="hover:bg-slate-50/80 transition-colors">
                        <td className="py-3.5 px-4">
                          <span className="font-mono font-bold text-slate-900 block">{member.codigo_afiliado}</span>
                          <span className="text-[10px] text-slate-400">{member.rif_cedula || 'Sin RIF'}</span>
                        </td>

                        <td className="py-3.5 px-4">
                          <span className="font-bold text-slate-900 block">{member.nombre_establecimiento}</span>
                          <span className="text-[10px] text-slate-500">{member.categoria_negocio || 'Empresas'}</span>
                        </td>

                        <td className="py-3.5 px-4">
                          <span className="text-slate-800 font-medium block">{member.representante_legal || 'Titular'}</span>
                          <span className="text-[10px] text-slate-500">{member.telefono || 'Sin teléfono'}</span>
                        </td>

                        <td className="py-3.5 px-4">
                          <span className="font-serif font-black text-sm text-slate-900 block">
                            ${member.monto_cuota_mensual || 10}.00 USD
                          </span>
                          <span className="text-[10px] text-slate-400">Cuota Mensual</span>
                        </td>

                        <td className="py-3.5 px-4 text-center">
                          {isSolvent ? (
                            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-900 border border-emerald-300">
                              <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                              Solvente
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold bg-amber-100 text-amber-900 border border-amber-300">
                              <Clock className="w-3 h-3 text-amber-600" />
                              Pendiente
                            </span>
                          )}
                        </td>

                        <td className="py-3.5 px-4 text-right">
                          <div className="flex items-center justify-end gap-2">
                            <button
                              onClick={() => {
                                handleSelectMemberForManualPayment(member.codigo_afiliado);
                                setIsManualModalOpen(true);
                              }}
                              className="py-1 px-2.5 rounded-lg bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold text-[11px] shadow-sm transition-all"
                              title="Registrar cobro manual de cuota para este miembro"
                            >
                              + Cobro
                            </button>

                            <button
                              onClick={() => handleSendWhatsAppReminder(member)}
                              className="py-1 px-2.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-[11px] flex items-center gap-1 shadow-sm transition-all"
                              title="Enviar recordatorio de cuota con datos de pago por WhatsApp"
                            >
                              <MessageCircle className="w-3.5 h-3.5" />
                              <span>WhatsApp</span>
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* =========================================================================
          TAB 3: LIBRO DE EGRESOS & GASTOS OPERATIVOS
          ========================================================================= */}
      {treasuryTab === 'egresos' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between bg-white p-6 rounded-3xl border border-slate-200 shadow-sm">
            <div>
              <h3 className="font-serif font-black text-lg text-slate-900">
                Libro de Egresos & Gastos Operativos
              </h3>
              <p className="text-xs text-slate-600">
                Registro contable oficial de facturas, compras, logística y servicios de la Cámara.
              </p>
            </div>

            <button
              onClick={() => setIsExpenseModalOpen(true)}
              className="py-2.5 px-4 rounded-2xl bg-rose-600 hover:bg-rose-700 text-white font-serif font-bold text-xs uppercase tracking-wider shadow-sm flex items-center gap-2 transition-all"
            >
              <Plus className="w-4 h-4 text-white" />
              <span>Nuevo Gasto</span>
            </button>
          </div>

          <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
            <table className="w-full text-left text-xs text-slate-600 border-collapse">
              <thead className="bg-slate-50 border-b border-slate-200 text-slate-700 font-bold uppercase tracking-wider text-[10px]">
                <tr>
                  <th className="py-3.5 px-4">Fecha / Ref.</th>
                  <th className="py-3.5 px-4">Concepto del Gasto</th>
                  <th className="py-3.5 px-4">Categoría</th>
                  <th className="py-3.5 px-4">Proveedor / Beneficiario</th>
                  <th className="py-3.5 px-4">Monto (USD / Bs.)</th>
                  <th className="py-3.5 px-4">Aprobado Por</th>
                  <th className="py-3.5 px-4 text-right">Acciones</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {expenses.length === 0 ? (
                  <tr>
                    <td colSpan="7" className="py-12 text-center text-slate-400">
                      <TrendingDown className="w-8 h-8 mx-auto mb-2 opacity-40 text-slate-400" />
                      <p className="font-bold text-slate-600">No hay egresos registrados a la fecha.</p>
                      <p className="text-[11px] text-slate-400 mt-0.5">Utilice el botón "Nuevo Gasto" para asentar facturas y comprobantes reales.</p>
                    </td>
                  </tr>
                ) : (
                  expenses.map((e) => (
                    <tr key={e.id} className="hover:bg-slate-50/80 transition-colors">
                      <td className="py-3.5 px-4">
                        <span className="font-medium text-slate-900 block">
                          {e.fecha_gasto ? new Date(e.fecha_gasto).toLocaleDateString('es-VE') : 'N/A'}
                        </span>
                        <span className="font-mono text-[10px] text-slate-400">{e.referencia_comprobante || 'S/R'}</span>
                      </td>

                      <td className="py-3.5 px-4">
                        <span className="font-bold text-slate-900 block">{e.concepto}</span>
                        {e.observaciones && <span className="text-[10px] text-slate-400">{e.observaciones}</span>}
                      </td>

                      <td className="py-3.5 px-4">
                        <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-slate-100 text-slate-700 border border-slate-200">
                          {e.categoria}
                        </span>
                      </td>

                      <td className="py-3.5 px-4">
                        <span className="font-semibold text-slate-800">{e.beneficiario_proveedor}</span>
                      </td>

                      <td className="py-3.5 px-4">
                        <span className="font-serif font-black text-sm text-rose-700 block">
                          -${parseFloat(e.monto_usd || 0).toFixed(2)} USD
                        </span>
                        <span className="text-[10px] text-slate-500">
                          Bs. {parseFloat(e.monto_bs || 0).toFixed(2)}
                        </span>
                      </td>

                      <td className="py-3.5 px-4">
                        <span className="text-[11px] text-slate-700">{e.aprobado_por || 'Edixon Reyes (Tesorero)'}</span>
                      </td>

                      <td className="py-3.5 px-4 text-right">
                        <button
                          onClick={() => handleDeleteExpense(e.id)}
                          className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors"
                          title="Eliminar registro de egreso"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* =========================================================================
          TAB 4: RECIBOS DIGITALES EMITIDOS
          ========================================================================= */}
      {treasuryTab === 'recibos' && (
        <div className="space-y-6">
          <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm">
            <h3 className="font-serif font-black text-lg text-slate-900">
              Control & Emisión de Recibos Correlativos
            </h3>
            <p className="text-xs text-slate-600 mb-6">
              Todos los pagos conciliados generan automáticamente un comprobante digital oficial con numeración única fiscal y sello de Tesorería.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {payments.filter(p => p.estado === 'conciliado').map((p) => (
                <div 
                  key={p.id}
                  className="p-5 rounded-3xl border border-slate-200 hover:border-teal-500 hover:shadow-md transition-all bg-gradient-to-br from-white to-slate-50/50 space-y-3"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-xs font-black text-teal-800 bg-teal-50 px-2 py-0.5 rounded border border-teal-200">
                      {p.numero_recibo}
                    </span>
                    <span className="text-[10px] text-slate-400">
                      {p.fecha_conciliacion ? new Date(p.fecha_conciliacion).toLocaleDateString('es-VE') : ''}
                    </span>
                  </div>

                  <div>
                    <h4 className="font-bold text-sm text-slate-900">{p.nombre_establecimiento}</h4>
                    <p className="text-xs text-slate-500">{p.concepto} &bull; {p.periodo_mes}</p>
                    <p className="text-[11px] font-mono text-slate-400">Ref: {p.referencia}</p>
                  </div>

                  <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
                    <div>
                      <span className="font-serif font-black text-base text-slate-900 block">${p.monto_usd}.00 USD</span>
                      <span className="text-[10px] text-slate-400">Bs. {parseFloat(p.monto_bs || 0).toLocaleString('es-VE')}</span>
                    </div>

                    <div className="flex items-center gap-1.5">
                      <button
                        onClick={() => handleSendReceiptDirectly(p)}
                        className="p-2 rounded-xl bg-teal-700 hover:bg-teal-800 text-white text-[10px] font-bold flex items-center gap-1 transition-all"
                        title="Enviar por correo"
                      >
                        <Send className="w-3 h-3 text-amber-300" />
                        <span>Enviar</span>
                      </button>

                      <button
                        onClick={() => setSelectedReceipt(p)}
                        className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-[10px] font-bold transition-all"
                        title="Ver / Imprimir"
                      >
                        <Receipt className="w-3.5 h-3.5 text-teal-700" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* =========================================================================
          MODAL 1: VISOR DE RECIBO DIGITAL OFICIAL (IMPRIMIR / ENVIAR)
          ========================================================================= */}
      {selectedReceipt && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-fade-in overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl border border-slate-200 space-y-6 relative my-8 text-slate-800">
            
            <button
              onClick={() => setSelectedReceipt(null)}
              className="absolute top-5 right-5 p-2 rounded-full text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Receipt Header */}
            <div className="text-center pb-4 border-b border-slate-200 space-y-1">
              <span className="text-[10px] font-extrabold uppercase tracking-widest text-teal-700 bg-teal-50 px-3 py-0.5 rounded-full border border-teal-200">
                Comprobante Oficial de Tesorería
              </span>
              <h2 className="font-serif font-black text-xl text-slate-950 mt-1">
                Cámara Gastronómica del Estado Mérida
              </h2>
              <p className="text-[11px] text-slate-500">
                RIF: J-50123456-7 &bull; Casco Central, Mérida, Venezuela
              </p>
              <div className="font-mono font-extrabold text-sm text-amber-900 pt-1">
                RECIBO N°: {selectedReceipt.numero_recibo}
              </div>
            </div>

            {/* Receipt Details */}
            <div className="space-y-3 text-xs">
              <div className="grid grid-cols-2 gap-2 bg-slate-50 p-3 rounded-2xl border border-slate-100">
                <div>
                  <span className="text-[10px] text-slate-400 uppercase font-bold block">Recibido De:</span>
                  <span className="font-bold text-slate-900">{selectedReceipt.nombre_establecimiento}</span>
                  <span className="text-[10px] text-slate-500 block">{selectedReceipt.representante_legal}</span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 uppercase font-bold block">Código Afiliado / RIF:</span>
                  <span className="font-mono font-bold text-slate-900">{selectedReceipt.codigo_afiliado || 'N/A'}</span>
                  <span className="text-[10px] text-slate-500 block">{selectedReceipt.rif_cedula || ''}</span>
                </div>
              </div>

              <div className="p-3 rounded-2xl bg-slate-50 border border-slate-100 space-y-2">
                <div className="flex justify-between">
                  <span className="text-slate-500">Concepto:</span>
                  <span className="font-bold text-slate-900">{selectedReceipt.concepto}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Desglose:</span>
                  <span className="font-medium text-slate-800">
                    Inscripción: ${selectedReceipt.monto_inscripcion_usd || (selectedReceipt.monto_usd > 20 ? 20 : 10)} USD + Cuota 1er Mes: ${selectedReceipt.monto_cuota_mes_usd || 10} USD
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Período / Mes:</span>
                  <span className="font-bold text-slate-900">{selectedReceipt.periodo_mes || 'Mes en curso'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Método de Pago:</span>
                  <span className="font-semibold text-slate-800">{selectedReceipt.metodo_pago === 'pago_movil' ? 'Pago Móvil Banco Provincial' : 'Transferencia'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Referencia Bancaria:</span>
                  <span className="font-mono font-bold text-slate-900">{selectedReceipt.referencia}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Fecha de Pago:</span>
                  <span className="text-slate-900 font-semibold">{selectedReceipt.fecha_pago ? new Date(selectedReceipt.fecha_pago).toLocaleString('es-VE') : ''}</span>
                </div>
              </div>

              {/* Amount Box */}
              <div className="p-4 rounded-2xl bg-teal-900 text-white flex items-center justify-between">
                <div>
                  <span className="text-[10px] uppercase font-bold text-teal-300 block">Total Recibido (Fijado BCV)</span>
                  <span className="text-xs text-slate-300">Bs. {parseFloat(selectedReceipt.monto_bs || 0).toLocaleString('es-VE', { minimumFractionDigits: 2 })}</span>
                </div>
                <span className="font-serif font-black text-2xl text-amber-400">
                  ${parseFloat(selectedReceipt.monto_usd || 0).toFixed(2)} USD
                </span>
              </div>

              {/* Signatures & Seal */}
              <div className="pt-4 border-t border-slate-200 flex items-center justify-between text-center">
                <div className="flex-1">
                  <div className="w-24 h-1 bg-slate-400 mx-auto mb-1"></div>
                  <span className="text-[10px] font-bold text-slate-900 block">Edixon Xavier Reyes Dávila</span>
                  <span className="text-[9px] text-slate-500 block">Tesorero de la Junta Directiva</span>
                  <span className="text-[9px] text-teal-700 font-extrabold uppercase block mt-0.5">Firma & Sello Digital Válido</span>
                </div>
              </div>
            </div>

            {/* Modal Actions */}
            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                onClick={() => handleSendReceiptDirectly(selectedReceipt)}
                className="py-2.5 px-4 rounded-xl bg-teal-700 hover:bg-teal-800 text-white font-bold text-xs flex items-center gap-1.5 transition-all shadow-sm"
              >
                <Send className="w-3.5 h-3.5 text-amber-300" />
                <span>ENVIAR RECIBO POR EMAIL</span>
              </button>

              <button
                onClick={() => window.print()}
                className="py-2.5 px-4 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs flex items-center gap-1.5 transition-all"
              >
                <Printer className="w-3.5 h-3.5" />
                <span>Imprimir / PDF</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* =========================================================================
          MODAL 2: REGISTRO DE COBRO MANUAL POR TESORERÍA
          ========================================================================= */}
      {isManualModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-fade-in overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl border border-slate-200 space-y-6 relative my-8">
            
            <button
              onClick={() => setIsManualModalOpen(false)}
              className="absolute top-5 right-5 p-2 rounded-full text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            <div>
              <span className="text-[10px] font-bold uppercase tracking-widest text-amber-900 bg-amber-100 px-3 py-0.5 rounded-full border border-amber-300">
                Tesorería CGEM
              </span>
              <h3 className="font-serif font-black text-xl text-slate-900 mt-2">
                Registrar Cobro / Pago Manual
              </h3>
              <p className="text-xs text-slate-600">
                Utilice este formulario para asentar pagos directos verificados en el extracto del Banco Provincial.
              </p>
            </div>

            <form onSubmit={handleSubmitManualPayment} className="space-y-4 text-xs">
              
              {/* Select Existing Member */}
              <div>
                <label className="block text-slate-700 font-bold mb-1">Seleccionar Agremiado Registrado</label>
                <select
                  value={manualFormData.codigo_afiliado}
                  onChange={(e) => handleSelectMemberForManualPayment(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-xs text-slate-800 focus:outline-none focus:border-teal-600"
                >
                  <option value="">-- Seleccione un establecimiento --</option>
                  {directoryMembers.map(m => (
                    <option key={m.codigo_afiliado} value={m.codigo_afiliado}>
                      {m.codigo_afiliado} - {m.nombre_establecimiento} (${m.monto_inscripcion || 30} USD)
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 font-bold mb-1">Nombre Establecimiento *</label>
                  <input
                    type="text"
                    required
                    value={manualFormData.nombre_establecimiento}
                    onChange={(e) => setManualFormData({ ...manualFormData, nombre_establecimiento: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-800 focus:outline-none focus:border-teal-600"
                  />
                </div>

                <div>
                  <label className="block text-slate-700 font-bold mb-1">Representante Legal</label>
                  <input
                    type="text"
                    value={manualFormData.representante_legal}
                    onChange={(e) => setManualFormData({ ...manualFormData, representante_legal: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-800 focus:outline-none focus:border-teal-600"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-slate-700 font-bold mb-1">Total (USD) *</label>
                  <input
                    type="number"
                    step="0.01"
                    required
                    value={manualFormData.monto_usd}
                    onChange={(e) => {
                      const val = parseFloat(e.target.value) || 0;
                      setManualFormData({
                        ...manualFormData,
                        monto_usd: val,
                        monto_inscripcion_usd: val > 20 ? 20 : 10,
                        monto_cuota_mes_usd: 10,
                        monto_bs: val === 30 ? 26241.96 : 17494.64
                      });
                    }}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-800 focus:outline-none focus:border-teal-600 font-bold"
                  />
                </div>

                <div>
                  <label className="block text-slate-700 font-bold mb-1">Monto en Bs. (Fijado)</label>
                  <input
                    type="number"
                    step="0.01"
                    required
                    value={manualFormData.monto_bs}
                    onChange={(e) => setManualFormData({ ...manualFormData, monto_bs: parseFloat(e.target.value) || 0 })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-800 focus:outline-none focus:border-teal-600 font-mono font-bold"
                  />
                </div>

                <div>
                  <label className="block text-slate-700 font-bold mb-1">N° Referencia *</label>
                  <input
                    type="text"
                    required
                    value={manualFormData.referencia}
                    onChange={(e) => setManualFormData({ ...manualFormData, referencia: e.target.value })}
                    placeholder="ej. 12345678"
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-800 focus:outline-none focus:border-teal-600 font-mono"
                  />
                </div>
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsManualModalOpen(false)}
                  className="py-2.5 px-4 rounded-xl text-slate-600 hover:bg-slate-100 font-bold text-xs transition-colors"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="py-2.5 px-5 rounded-xl bg-amber-500 hover:bg-amber-600 text-slate-950 font-serif font-bold text-xs uppercase tracking-wider shadow-sm transition-all"
                >
                  Registrar & Emitir Recibo
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* =========================================================================
          MODAL 3: REGISTRO DE EGRESO
          ========================================================================= */}
      {isExpenseModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-fade-in overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl border border-slate-200 space-y-6 relative my-8">
            
            <button
              onClick={() => setIsExpenseModalOpen(false)}
              className="absolute top-5 right-5 p-2 rounded-full text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            <div>
              <span className="text-[10px] font-bold uppercase tracking-widest text-rose-900 bg-rose-100 px-3 py-0.5 rounded-full border border-rose-300">
                Control de Gastos
              </span>
              <h3 className="font-serif font-black text-xl text-slate-900 mt-2">
                Registrar Egreso Operativo
              </h3>
            </div>

            <form onSubmit={handleSubmitExpense} className="space-y-4 text-xs">
              <div>
                <label className="block text-slate-700 font-bold mb-1">Concepto del Gasto *</label>
                <input
                  type="text"
                  required
                  placeholder="ej. Material logístico para eventos, Impresión de credenciales oficiales, Servicios..."
                  value={expenseFormData.concepto}
                  onChange={(e) => setExpenseFormData({ ...expenseFormData, concepto: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-800 focus:outline-none focus:border-rose-600"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 font-bold mb-1">Categoría</label>
                  <select
                    value={expenseFormData.categoria}
                    onChange={(e) => setExpenseFormData({ ...expenseFormData, categoria: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-800 focus:outline-none focus:border-rose-600"
                  >
                    <option value="Eventos & Logística">Eventos & Logística</option>
                    <option value="Publicidad & Medios">Publicidad & Medios</option>
                    <option value="Servicios Web & Plataforma">Servicios Web & Plataforma</option>
                    <option value="Papelería & Sede">Papelería & Sede</option>
                    <option value="Honorarios & Asesoría">Honorarios & Asesoría</option>
                    <option value="Otros">Otros</option>
                  </select>
                </div>

                <div>
                  <label className="block text-slate-700 font-bold mb-1">Beneficiario / Proveedor *</label>
                  <input
                    type="text"
                    required
                    placeholder="ej. Proveeduría & Servicios Gráficos Integrales C.A."
                    value={expenseFormData.beneficiario_proveedor}
                    onChange={(e) => setExpenseFormData({ ...expenseFormData, beneficiario_proveedor: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-800 focus:outline-none focus:border-rose-600"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 font-bold mb-1">Monto (USD) *</label>
                  <input
                    type="number"
                    step="0.01"
                    required
                    value={expenseFormData.monto_usd}
                    onChange={(e) => {
                      const val = parseFloat(e.target.value) || 0;
                      setExpenseFormData({
                        ...expenseFormData,
                        monto_usd: val,
                        monto_bs: (val * 874.73).toFixed(2)
                      });
                    }}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-800 focus:outline-none focus:border-rose-600 font-bold"
                  />
                </div>

                <div>
                  <label className="block text-slate-700 font-bold mb-1">N° Comprobante / Factura</label>
                  <input
                    type="text"
                    placeholder="ej. FAC-00129"
                    value={expenseFormData.referencia_comprobante}
                    onChange={(e) => setExpenseFormData({ ...expenseFormData, referencia_comprobante: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-800 focus:outline-none focus:border-rose-600 font-mono"
                  />
                </div>
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsExpenseModalOpen(false)}
                  className="py-2.5 px-4 rounded-xl text-slate-600 hover:bg-slate-100 font-bold text-xs transition-colors"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="py-2.5 px-5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-serif font-bold text-xs uppercase tracking-wider shadow-sm transition-all"
                >
                  Guardar Egreso
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* =========================================================================
          MODAL 4: RECHAZAR / OBSERVAR PAGO
          ========================================================================= */}
      {isRejectModalOpen && rejectingPayment && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-fade-in overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-slate-200 space-y-4 relative">
            <h3 className="font-serif font-black text-lg text-rose-900">
              Rechazar / Observar Reporte de Pago
            </h3>
            <p className="text-xs text-slate-600">
              Establecimiento: <strong>{rejectingPayment.nombre_establecimiento}</strong> (Ref: {rejectingPayment.referencia})
            </p>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Motivo de Rechazo u Observación *</label>
              <textarea
                rows="3"
                value={rejectionReason}
                onChange={(e) => setRejectionReason(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-xs text-slate-800 focus:outline-none focus:border-rose-600"
              />
            </div>

            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={() => setIsRejectModalOpen(false)}
                className="py-2 px-3 rounded-xl text-slate-600 hover:bg-slate-100 font-bold text-xs"
              >
                Cancelar
              </button>
              <button
                type="button"
                onClick={handleConfirmReject}
                className="py-2 px-4 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs shadow-sm"
              >
                Confirmar Rechazo
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
