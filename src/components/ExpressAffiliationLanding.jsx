import React, { useState, useEffect } from 'react';
import { 
  Building2, 
  Sparkles, 
  CheckCircle2, 
  Copy, 
  Check, 
  CreditCard, 
  Smartphone, 
  ArrowRight, 
  ArrowLeft, 
  ShieldCheck, 
  Send, 
  Store, 
  ChefHat, 
  ExternalLink, 
  AlertCircle,
  Clock,
  HelpCircle,
  FileCheck2,
  Mail,
  User,
  Phone,
  Paperclip,
  UploadCloud,
  X,
  Loader2
} from 'lucide-react';
import { supabase } from '../lib/supabaseClient';
import { sendExpressAffiliateWelcomeEmail } from '../lib/emailService';
import { createBlankBusinessProfile } from './AffiliateDashboard';
import { optimizeImage, uploadPaymentProofToStorage } from '../lib/imageOptimizer';
import { submitPaymentRecord } from '../lib/treasurySync';

export function ExpressAffiliationLanding({ onNavigate, onCompleteExpress }) {
  // Exchange Rate State (BCV)
  const [bcvRate, setBcvRate] = useState(null);
  const [bcvLoading, setBcvLoading] = useState(true);
  const [bcvDate, setBcvDate] = useState('');

  // Selected Plan / Fee
  const [selectedPlan, setSelectedPlan] = useState('emprendimiento'); // 'emprendimiento' ($20) | 'empresa' ($30) | 'grande' ($50)
  
  // Payment Method Tab: 'pago-movil' | 'transferencia'
  const [paymentTab, setPaymentTab] = useState('pago-movil');

  // Form Fields
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [referenceNumber, setReferenceNumber] = useState('');
  const [issuingBank, setIssuingBank] = useState('Banco Provincial');

  // Payment Proof Image States (con optimización en cliente)
  const [paymentProofOptimized, setPaymentProofOptimized] = useState(null);
  const [isOptimizingProof, setIsOptimizingProof] = useState(false);
  const [proofOptimizeError, setProofOptimizeError] = useState('');

  // Copy Feedback States
  const [copiedField, setCopiedField] = useState('');

  // Processing & Success States
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [successData, setSuccessData] = useState(null);

  const handleProofSelect = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setProofOptimizeError('');
    setIsOptimizingProof(true);
    try {
      const optimized = await optimizeImage(file, {
        maxWidth: 1200,
        maxHeight: 1200,
        quality: 0.82,
        outputType: 'image/webp'
      });
      setPaymentProofOptimized(optimized);
    } catch (err) {
      console.warn('Error optimizando comprobante express:', err);
      setProofOptimizeError('No se pudo optimizar la imagen. Intente con otra.');
    } finally {
      setIsOptimizingProof(false);
    }
  };

  // Fetch BCV Rate
  useEffect(() => {
    let isMounted = true;
    const fetchBcv = async () => {
      try {
        const res = await fetch('https://ve.dolarapi.com/v1/dolares/oficial');
        if (res.ok) {
          const data = await res.json();
          if (data && data.promedio && isMounted) {
            setBcvRate(data.promedio);
            if (data.fechaActualizacion) {
              const d = new Date(data.fechaActualizacion);
              setBcvDate(d.toLocaleDateString('es-VE'));
            }
          }
        }
      } catch (e) {
        console.warn('BCV API fallback notice:', e);
      } finally {
        if (isMounted) setBcvLoading(false);
      }
    };
    fetchBcv();
    return () => { isMounted = false; };
  }, []);

  // Pricing Matrix
  const PLAN_DETAILS = {
    emprendimiento: {
      id: 'emprendimiento',
      title: 'Emprendimiento / Marca Culinaria',
      usd: 20,
      description: 'Ideal para productores locales, marcas gastronómicas y reposteros.',
      badge: 'Tarifa Más Popular'
    },
    empresa: {
      id: 'empresa',
      title: 'Restaurante / Empresa',
      usd: 30,
      description: 'Cafés, bistrós, restaurantes y posadas con servicio gastronómico.',
      badge: 'Recomendado'
    },
    grande: {
      id: 'grande',
      title: 'Cadena o Gran Empresa',
      usd: 50,
      description: 'Hoteles, franquicias y centros gastronómicos de gran escala.',
      badge: 'Corporativo'
    }
  };

  const currentPlan = PLAN_DETAILS[selectedPlan];
  const calculatedBs = bcvRate 
    ? (currentPlan.usd * bcvRate).toLocaleString('es-VE', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
    : '...';

  // Bank Coordinates (Cámara Gastronómica del Estado Mérida)
  const BANK_COORDINATES = {
    pagoMovil: {
      banco: 'Banco Provincial (0108)',
      telefono: '0414-8817137',
      telefonoRaw: '04148817137',
      cedula: 'V-12517086',
      titular: 'Julio Alberto Daza Celis',
      concepto: 'Afiliación Express CGM 2026'
    },
    transferencia: {
      banco: 'Banco Provincial',
      titular: 'Julio Alberto Daza Celis',
      cedula: 'V-12517086',
      tipoCuenta: 'Cuenta Corriente',
      numeroCuenta: '0108-2456-74-0100057723',
      numeroCuentaRaw: '01082456740100057723'
    }
  };

  // Clipboard Helper
  const handleCopy = (text, fieldName) => {
    navigator.clipboard.writeText(text);
    setCopiedField(fieldName);
    setTimeout(() => setCopiedField(''), 2200);
  };

  const handleCopyAll = (type) => {
    let fullText = '';
    if (type === 'pago-movil') {
      fullText = `CÁMARA GASTRONÓMICA DEL ESTADO MÉRIDA\nPago Móvil Provincial (0108)\nCédula: ${BANK_COORDINATES.pagoMovil.cedula}\nTeléfono: ${BANK_COORDINATES.pagoMovil.telefonoRaw}\nTitular: ${BANK_COORDINATES.pagoMovil.titular}\nConcepto: ${BANK_COORDINATES.pagoMovil.concepto}\nMonto: Bs. ${calculatedBs} (ó $${currentPlan.usd} USD)`;
    } else {
      fullText = `CÁMARA GASTRONÓMICA DEL ESTADO MÉRIDA\nTransferencia Banco Provincial\nTitular: ${BANK_COORDINATES.transferencia.titular}\nCédula: ${BANK_COORDINATES.transferencia.cedula}\nTipo: ${BANK_COORDINATES.transferencia.tipoCuenta}\nCuenta: ${BANK_COORDINATES.transferencia.numeroCuenta}\nMonto: Bs. ${calculatedBs} (ó $${currentPlan.usd} USD)`;
    }
    handleCopy(fullText, `${type}-all`);
  };

  // Handle Form Submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage('');

    if (!fullName.trim()) {
      setErrorMessage('Por favor ingrese su nombre o el de su establecimiento.');
      return;
    }

    if (!email.trim() || !email.includes('@')) {
      setErrorMessage('Por favor ingrese un correo electrónico válido para enviarle sus credenciales.');
      return;
    }

    if (!referenceNumber.trim()) {
      setErrorMessage('Por favor ingrese el número de referencia del Pago Móvil o Transferencia.');
      return;
    }

    setIsSubmitting(true);

    try {
      // 1. Generate unique CGM Affiliate Code
      const randomSuffix = Math.floor(100 + Math.random() * 899);
      const newAffiliateCode = `CGM-2026-${randomSuffix}`;

      // Upload proof image if attached (compressed in client)
      let uploadedProofUrl = '';
      if (paymentProofOptimized && paymentProofOptimized.blob) {
        const uploadRes = await uploadPaymentProofToStorage(
          paymentProofOptimized.blob,
          newAffiliateCode,
          paymentProofOptimized.dataUrl
        );
        uploadedProofUrl = uploadRes?.url || '';
      }

      const calcBs = bcvRate ? parseFloat((currentPlan.usd * bcvRate).toFixed(2)) : 0;

      // 2. Save into Supabase 'solicitudes_afiliacion'
      if (supabase) {
        try {
          await supabase.from('solicitudes_afiliacion').insert([
            {
              codigo_afiliado: newAffiliateCode,
              nombre_comercial: fullName.trim(),
              tipo_negocio: currentPlan.id,
              titular_propietario: fullName.trim(),
              rif: 'En trámite',
              telefono: phone.trim() || 'No especificado',
              correo: email.trim().toLowerCase(),
              banco_pago_movil: issuingBank,
              referencia_pago_movil: referenceNumber.trim(),
              monto_bs: calcBs || null,
              municipio: 'Libertador (Mérida)',
              created_at: new Date().toISOString()
            }
          ]);
        } catch (dbErr) {
          console.warn('Supabase solicitudes_afiliacion notice:', dbErr);
        }

        // Also register in directorio_agremiados as active provisional
        try {
          await supabase.from('directorio_agremiados').insert([
            {
              codigo_afiliado: newAffiliateCode,
              nombre_establecimiento: fullName.trim(),
              categoria_negocio: currentPlan.title,
              representante_legal: fullName.trim(),
              rif_cedula: 'En trámite',
              telefono: phone.trim() || '0414-0000000',
              email: email.trim().toLowerCase(),
              municipio: 'Libertador (Mérida Ciudad)',
              estado_solvencia: 'En Verificación (Activo Provisional)',
              monto_inscripcion: currentPlan.usd,
              monto_cuota_mensual: 10,
              observaciones: `Afiliación Express Masiva. Referencia: ${referenceNumber.trim()}${uploadedProofUrl ? ` | Comprobante: ${uploadedProofUrl}` : ''}`,
              visible_en_guia: true,
              destacado_portada: false,
              created_at: new Date().toISOString()
            }
          ]);
        } catch (dirErr) {
          console.warn('Supabase directorio_agremiados notice:', dirErr);
        }
      }

      // 2.1 Register in treasury system (pagos_tesoreria)
      try {
        await submitPaymentRecord({
          codigo_afiliado: newAffiliateCode,
          nombre_establecimiento: fullName.trim(),
          representante_legal: fullName.trim(),
          rif_cedula: 'En trámite',
          telefono: phone.trim() || '',
          email: email.trim().toLowerCase(),
          concepto: `Inscripción + 1er Mes (${currentPlan.title} - Afiliación Express)`,
          periodo_mes: 'Noviembre 2026',
          metodo_pago: paymentTab === 'pago-movil' ? 'pago_movil' : 'transferencia_nacional',
          banco_emisor: issuingBank,
          banco_receptor: 'Banco Provincial (0108)',
          referencia: referenceNumber.trim(),
          telefono_pagador: phone.trim() || '',
          monto_usd: currentPlan.usd,
          monto_bs: calcBs,
          tasa_bcv: bcvRate || 911.62,
          comprobante_url: uploadedProofUrl,
          estado: 'pendiente',
          observaciones: `Afiliación Express. Ref: ${referenceNumber.trim()}. Banco: ${issuingBank}.`
        });
      } catch (payErr) {
        console.warn('Notice submitting treasury payment:', payErr);
      }

      // 3. Fallback / Synchronize to LocalStorage
      const newLocalEntry = {
        id: `cgem-dir-${newAffiliateCode.toLowerCase()}`,
        codigo_afiliado: newAffiliateCode,
        nombre_establecimiento: fullName.trim(),
        categoria_negocio: currentPlan.title,
        representante_legal: fullName.trim(),
        email: email.trim().toLowerCase(),
        telefono: phone.trim() || '0414-0000000',
        municipio: 'Libertador (Mérida Ciudad)',
        estado_solvencia: 'En Verificación (Activo Provisional)',
        monto_inscripcion: currentPlan.usd,
        monto_cuota_mensual: 10,
        fecha_registro: new Date().toISOString(),
        visible_en_guia: true
      };

      try {
        const localDir = JSON.parse(localStorage.getItem('cgem_directorio_agremiados') || '[]');
        localStorage.setItem(
          'cgem_directorio_agremiados', 
          JSON.stringify([newLocalEntry, ...localDir.filter(i => i.codigo_afiliado !== newAffiliateCode)])
        );
      } catch (e) {}

      // 4. Create Blank Business Profile for later instant customization
      const newBlankProfile = createBlankBusinessProfile({
        id: newAffiliateCode,
        restaurantName: fullName.trim(),
        ownerName: fullName.trim(),
        category: currentPlan.title,
        phone: phone.trim(),
        email: email.trim().toLowerCase(),
        location: 'Mérida, Estado Mérida',
        instagram: ''
      });

      try {
        localStorage.setItem(`cgem_biz_profile_${newAffiliateCode}`, JSON.stringify(newBlankProfile));
      } catch (e) {}

      // 5. Send Welcome & Customization Email via Resend
      sendExpressAffiliateWelcomeEmail({
        affiliateCode: newAffiliateCode,
        restaurantName: fullName.trim(),
        ownerName: fullName.trim(),
        email: email.trim().toLowerCase(),
        phone: phone.trim(),
        paymentMethod: paymentTab,
        referenceNumber: referenceNumber.trim(),
        amountBs: calculatedBs,
        amountUsd: currentPlan.usd,
        category: currentPlan.title
      }).catch(err => console.warn('Resend Express notification notice:', err));

      // 6. Set Active User object for one-click session handoff
      const userPayload = {
        id: newAffiliateCode,
        restaurantName: fullName.trim(),
        ownerName: fullName.trim(),
        memberCategory: currentPlan.title,
        businessType: currentPlan.id,
        email: email.trim().toLowerCase(),
        registrationDate: new Date().toLocaleDateString('es-VE', { day: '2-digit', month: 'long', year: 'numeric' }),
        expiryDate: "31 de Diciembre de 2026",
        status: "Activo (Pago en Verificación)",
        monthlyDues: "$10.00",
        lastPaymentDate: "Hoy",
        certificateCode: `${newAffiliateCode}-EXP`,
        stats: {
          profileViewsMonth: 0,
          reservationsMonth: 0,
          reviewRating: "5.0",
          selloStatus: "En Trámite"
        }
      };

      try {
        localStorage.setItem('cgem_active_affiliate', JSON.stringify(userPayload));
      } catch (e) {}

      // 7. Show success state
      setSuccessData({
        affiliateCode: newAffiliateCode,
        restaurantName: fullName.trim(),
        email: email.trim(),
        phone: phone.trim(),
        referenceNumber: referenceNumber.trim(),
        amountBs: calculatedBs,
        plan: currentPlan,
        userPayload
      });

    } catch (err) {
      console.error('Error during express registration:', err);
      setErrorMessage('Ocurrió un error al procesar el registro. Intente nuevamente.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Launch direct profile customization
  const handleGoToCustomizeProfile = () => {
    if (onCompleteExpress && successData?.userPayload) {
      onCompleteExpress(successData.userPayload);
    } else if (onNavigate) {
      onNavigate('affiliates');
    }
  };

  // SUCCESS VIEW (LIGHT PALETTE)
  if (successData) {
    const waText = encodeURIComponent(
      `¡Hola! Acabo de completar mi Afiliación Express a la Cámara Gastronómica del Estado Mérida:\n\n` +
      `🏢 Establecimiento / Titular: ${successData.restaurantName}\n` +
      `🏷️ Código Asignado: ${successData.affiliateCode}\n` +
      `💳 Método: ${paymentTab === 'transferencia' ? 'Transferencia Banco Provincial' : 'Pago Móvil Provincial'}\n` +
      `🔢 Referencia: ${successData.referenceNumber}\n` +
      `💵 Monto: Bs. ${successData.amountBs} ($${successData.plan.usd} USD)\n\n` +
      `Adjunto comprobante bancario para su validación.`
    );
    const waUrl = `https://wa.me/584148817137?text=${waText}`;

    return (
      <section className="min-h-screen bg-[#f8fafc] text-slate-800 py-12 px-4 sm:px-6 lg:px-8 flex items-center justify-center">
        <div className="max-w-2xl w-full bg-white border border-slate-200 rounded-3xl p-6 sm:p-10 shadow-2xl text-center animate-fadeIn">
          
          <div className="w-20 h-20 rounded-full bg-emerald-50 border-2 border-emerald-300 text-emerald-600 flex items-center justify-center mx-auto mb-6 shadow-sm">
            <CheckCircle2 className="w-10 h-10" />
          </div>

          <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-amber-50 border border-amber-200 text-amber-800 text-xs font-bold uppercase tracking-wider mb-3">
            <Sparkles className="w-3.5 h-3.5 text-amber-600" />
            <span>Afiliación Express Registrada</span>
          </div>

          <h2 className="font-serif text-2xl sm:text-3xl font-black text-slate-900 mb-2">
            ¡Bienvenido a la Cámara Gastronómica!
          </h2>
          <p className="text-sm text-slate-600 max-w-lg mx-auto mb-6 leading-relaxed">
            Hemos registrado con éxito tu afiliación gremial para <strong className="text-slate-900">{successData.restaurantName}</strong>. 
            Te hemos enviado un correo oficial a <span className="text-amber-700 font-semibold">{successData.email}</span> con tu kit de bienvenida.
          </p>

          {/* Assigned Code Card */}
          <div className="bg-slate-50 border border-slate-200 rounded-2xl p-5 mb-8 text-left space-y-3">
            <div className="flex items-center justify-between border-b border-slate-200 pb-3">
              <div>
                <span className="text-[10px] uppercase font-bold text-slate-500 tracking-wider block">
                  Código Oficial de Agremiado
                </span>
                <span className="font-mono text-2xl font-black text-amber-700 tracking-wider">
                  {successData.affiliateCode}
                </span>
              </div>
              <button
                type="button"
                onClick={() => handleCopy(successData.affiliateCode, 'code')}
                className="p-2 rounded-xl bg-white border border-slate-200 hover:bg-slate-100 text-slate-700 transition-colors flex items-center gap-1.5 text-xs font-semibold shadow-2xs"
                title="Copiar código"
              >
                {copiedField === 'code' ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
                <span>{copiedField === 'code' ? 'Copiado' : 'Copiar'}</span>
              </button>
            </div>

            <div className="grid grid-cols-2 gap-3 text-xs pt-1">
              <div>
                <span className="text-slate-500 block">Establecimiento:</span>
                <span className="text-slate-900 font-semibold truncate block">{successData.restaurantName}</span>
              </div>
              <div>
                <span className="text-slate-500 block">Referencia Pago:</span>
                <span className="text-slate-900 font-mono font-semibold">{successData.referenceNumber}</span>
              </div>
              <div>
                <span className="text-slate-500 block">Categoría:</span>
                <span className="text-slate-900 font-semibold">{successData.plan.title}</span>
              </div>
              <div>
                <span className="text-slate-500 block">Estatus Inicial:</span>
                <span className="text-emerald-700 font-bold">Activo (En Verificación)</span>
              </div>
            </div>
          </div>

          {/* Call to Actions */}
          <div className="space-y-3">
            <button
              type="button"
              onClick={handleGoToCustomizeProfile}
              className="w-full py-4 px-6 rounded-2xl bg-gradient-to-r from-amber-500 via-amber-600 to-amber-500 hover:from-amber-600 hover:to-amber-700 text-white font-serif font-bold text-sm uppercase tracking-wider flex items-center justify-center gap-2.5 shadow-xl shadow-amber-500/25 transition-all transform hover:scale-[1.01] active:scale-[0.99]"
            >
              <Store className="w-5 h-5" />
              <span>Personalizar la Ficha de Mi Negocio Ahora</span>
              <ArrowRight className="w-5 h-5 ml-1" />
            </button>

            <a
              href={waUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full py-3.5 px-6 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-md shadow-emerald-600/20 transition-all"
            >
              <Smartphone className="w-4 h-4" />
              <span>Enviar Comprobante por WhatsApp a la Cámara</span>
              <ExternalLink className="w-3.5 h-3.5 opacity-80" />
            </a>

            <button
              type="button"
              onClick={() => onNavigate && onNavigate('home')}
              className="pt-2 text-xs text-slate-500 hover:text-slate-900 transition-colors block mx-auto underline font-medium"
            >
              Volver a la portada de Mérida Gastronómica
            </button>
          </div>

        </div>
      </section>
    );
  }

  // MAIN LANDING VIEW (LIGHT PALETTE)
  return (
    <section className="min-h-screen bg-[#f8fafc] text-slate-800 py-8 sm:py-14 px-4 sm:px-6 lg:px-8 relative">
      <div className="max-w-4xl mx-auto">

        {/* Top Header / Brand */}
        <div className="text-center mb-8 sm:mb-12">
          
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-amber-50 border border-amber-200 text-amber-800 text-xs font-extrabold uppercase tracking-widest mb-4 shadow-2xs">
            <Sparkles className="w-4 h-4 text-amber-600" />
            <span>Afiliación Gremial Express 2026</span>
          </div>

          <h1 className="font-serif text-3xl sm:text-5xl font-black text-slate-900 tracking-tight leading-tight mb-4">
            Únete a la <span className="bg-gradient-to-r from-amber-600 to-amber-700 bg-clip-text text-transparent">Cámara Gastronómica</span> en 60 Segundos
          </h1>

          <p className="text-sm sm:text-base text-slate-600 max-w-2xl mx-auto leading-relaxed">
            Proceso de afiliación simplificado para el sector culinario de Mérida. Realiza tu aporte, reporta tu referencia y activa de inmediato tu presencia oficial y respaldo gremial.
          </p>

          {/* Quick Value Pillars */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 max-w-2xl mx-auto mt-6 text-left">
            <div className="bg-white border border-slate-200 rounded-2xl p-3 flex items-center gap-3 shadow-2xs">
              <div className="w-8 h-8 rounded-xl bg-amber-50 text-amber-700 flex items-center justify-center shrink-0 border border-amber-100">
                <Store className="w-4 h-4" />
              </div>
              <span className="text-xs text-slate-700 font-medium">Presencia en Guía Oficial y Mapa 3D</span>
            </div>

            <div className="bg-white border border-slate-200 rounded-2xl p-3 flex items-center gap-3 shadow-2xs">
              <div className="w-8 h-8 rounded-xl bg-amber-50 text-amber-700 flex items-center justify-center shrink-0 border border-amber-100">
                <ShieldCheck className="w-4 h-4" />
              </div>
              <span className="text-xs text-slate-700 font-medium">Blindaje Legal y Respaldo Institucional</span>
            </div>

            <div className="bg-white border border-slate-200 rounded-2xl p-3 flex items-center gap-3 shadow-2xs">
              <div className="w-8 h-8 rounded-xl bg-amber-50 text-amber-700 flex items-center justify-center shrink-0 border border-amber-100">
                <Sparkles className="w-4 h-4" />
              </div>
              <span className="text-xs text-slate-700 font-medium">Acceso Inmediato al Panel de Autogestión</span>
            </div>
          </div>
        </div>

        {/* Main Grid: Left Pricing & Payment, Right Form */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Left Column: Plan Select & Payment Info (7 cols) */}
          <div className="lg:col-span-7 space-y-6">
            
            {/* 1. PLAN SELECTION CARD */}
            <div className="bg-white border border-slate-200 rounded-3xl p-5 sm:p-6 shadow-sm">
              <div className="flex items-center justify-between mb-4">
                <span className="text-xs font-bold uppercase tracking-wider text-amber-800 flex items-center gap-1.5">
                  <ChefHat className="w-4 h-4 text-amber-600" />
                  <span>1. Selecciona tu Tipo de Establecimiento</span>
                </span>
                <span className="text-[10px] text-slate-500 font-medium">Cuota Anual Única</span>
              </div>

              <div className="space-y-3">
                {Object.values(PLAN_DETAILS).map((plan) => {
                  const isSelected = selectedPlan === plan.id;
                  const planBs = bcvRate 
                    ? (plan.usd * bcvRate).toLocaleString('es-VE', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
                    : '...';

                  return (
                    <div
                      key={plan.id}
                      onClick={() => setSelectedPlan(plan.id)}
                      className={`p-3.5 rounded-2xl border cursor-pointer transition-all flex items-center justify-between gap-3 ${
                        isSelected 
                          ? 'bg-amber-50/80 border-2 border-amber-500 ring-2 ring-amber-500/10 shadow-sm' 
                          : 'bg-white border-slate-200 hover:border-slate-300 text-slate-700'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div className={`w-5 h-5 rounded-full border flex items-center justify-center ${
                          isSelected ? 'border-amber-600 bg-amber-600 text-white' : 'border-slate-300 bg-white'
                        }`}>
                          {isSelected && <div className="w-2 h-2 rounded-full bg-white" />}
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <h4 className="text-xs font-bold text-slate-900">{plan.title}</h4>
                            <span className="text-[9px] px-2 py-0.5 rounded-full bg-amber-100 text-amber-800 font-bold">
                              {plan.badge}
                            </span>
                          </div>
                          <p className="text-[11px] text-slate-500 leading-tight mt-0.5">{plan.description}</p>
                        </div>
                      </div>

                      <div className="text-right shrink-0">
                        <span className="font-mono text-base font-extrabold text-amber-800 block">
                          ${plan.usd} <span className="text-[10px] text-slate-500 font-sans">USD</span>
                        </span>
                        <span className="text-[10px] text-slate-500 font-mono block">
                          Bs. {planBs}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* BCV Exchange Rate Banner */}
              <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500">
                <span className="flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5 text-amber-600" />
                  <span>Tasa Oficial BCV del Día:</span>
                </span>
                <span className="font-mono font-bold text-slate-800">
                  {bcvLoading ? 'Consultando...' : bcvRate ? `Bs. ${bcvRate.toFixed(2)} / USD` : 'Tasa Oficial BCV'}
                  {bcvDate && <span className="text-[10px] text-slate-400 ml-1">({bcvDate})</span>}
                </span>
              </div>
            </div>

            {/* 2. PAYMENT COORDINATES CARD (PAGO MOVIL & TRANSFERENCIA) */}
            <div className="bg-white border border-slate-200 rounded-3xl p-5 sm:p-6 shadow-sm relative overflow-hidden">
              
              <div className="flex items-center justify-between pb-4 border-b border-slate-100">
                <div>
                  <span className="text-xs font-bold uppercase tracking-wider text-amber-800 flex items-center gap-1.5">
                    <CreditCard className="w-4 h-4 text-amber-600" />
                    <span>2. Coordenadas Bancarias Oficiales</span>
                  </span>
                  <p className="text-[11px] text-slate-500 mt-0.5">
                    Banco Provincial (0108) • Titular Oficial de la Cámara
                  </p>
                </div>

                <div className="text-right">
                  <span className="text-[10px] uppercase font-bold text-slate-500 block">Total a Pagar</span>
                  <span className="font-mono text-lg font-black text-amber-700 leading-none">
                    Bs. {calculatedBs}
                  </span>
                </div>
              </div>

              {/* Method Switcher Tabs */}
              <div className="grid grid-cols-2 gap-2 my-4">
                <button
                  type="button"
                  onClick={() => setPaymentTab('pago-movil')}
                  className={`py-2.5 px-3 rounded-xl text-xs font-bold flex items-center justify-center gap-2 transition-all ${
                    paymentTab === 'pago-movil'
                      ? 'bg-amber-500 text-white shadow-sm font-extrabold'
                      : 'bg-white text-slate-600 hover:text-slate-900 border border-slate-200 hover:bg-slate-50'
                  }`}
                >
                  <Smartphone className="w-4 h-4" />
                  <span>Pago Móvil Provincial</span>
                </button>

                <button
                  type="button"
                  onClick={() => setPaymentTab('transferencia')}
                  className={`py-2.5 px-3 rounded-xl text-xs font-bold flex items-center justify-center gap-2 transition-all ${
                    paymentTab === 'transferencia'
                      ? 'bg-amber-500 text-white shadow-sm font-extrabold'
                      : 'bg-white text-slate-600 hover:text-slate-900 border border-slate-200 hover:bg-slate-50'
                  }`}
                >
                  <Building2 className="w-4 h-4" />
                  <span>Transferencia Provincial</span>
                </button>
              </div>

              {/* Coordinates Content: Pago Móvil */}
              {paymentTab === 'pago-movil' && (
                <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 space-y-3 animate-fadeIn">
                  
                  <div className="flex items-center justify-between pb-2 border-b border-slate-200">
                    <span className="text-[11px] text-slate-500">Banco:</span>
                    <span className="text-xs font-bold text-slate-900">{BANK_COORDINATES.pagoMovil.banco}</span>
                  </div>

                  <div className="flex items-center justify-between pb-2 border-b border-slate-200">
                    <span className="text-[11px] text-slate-500">Teléfono Pago Móvil:</span>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-mono font-bold text-slate-900">
                        {BANK_COORDINATES.pagoMovil.telefono}
                      </span>
                      <button
                        type="button"
                        onClick={() => handleCopy(BANK_COORDINATES.pagoMovil.telefonoRaw, 'pm-tel')}
                        className="p-1 rounded hover:bg-slate-200 text-slate-500 hover:text-slate-900"
                        title="Copiar teléfono"
                      >
                        {copiedField === 'pm-tel' ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                      </button>
                    </div>
                  </div>

                  <div className="flex items-center justify-between pb-2 border-b border-slate-200">
                    <span className="text-[11px] text-slate-500">Cédula del Titular:</span>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-mono font-bold text-slate-900">
                        {BANK_COORDINATES.pagoMovil.cedula}
                      </span>
                      <button
                        type="button"
                        onClick={() => handleCopy(BANK_COORDINATES.pagoMovil.cedula.replace('V-', ''), 'pm-ci')}
                        className="p-1 rounded hover:bg-slate-200 text-slate-500 hover:text-slate-900"
                        title="Copiar cédula"
                      >
                        {copiedField === 'pm-ci' ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                      </button>
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-[11px] text-slate-500">Beneficiario:</span>
                    <span className="text-xs text-slate-800 font-medium">{BANK_COORDINATES.pagoMovil.titular}</span>
                  </div>

                  <div className="pt-2 flex justify-end">
                    <button
                      type="button"
                      onClick={() => handleCopyAll('pago-movil')}
                      className="text-[11px] text-amber-700 hover:text-amber-800 underline font-bold"
                    >
                      {copiedField === 'pago-movil-all' ? '¡Datos de Pago Móvil Copiados!' : 'Copiar todos los datos de Pago Móvil'}
                    </button>
                  </div>
                </div>
              )}

              {/* Coordinates Content: Transferencia */}
              {paymentTab === 'transferencia' && (
                <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 space-y-3 animate-fadeIn">
                  
                  <div className="flex items-center justify-between pb-2 border-b border-slate-200">
                    <span className="text-[11px] text-slate-500">Banco:</span>
                    <span className="text-xs font-bold text-slate-900">{BANK_COORDINATES.transferencia.banco}</span>
                  </div>

                  <div className="space-y-1 pb-2 border-b border-slate-200">
                    <span className="text-[11px] text-slate-500 block">Número de Cuenta Corriente:</span>
                    <div className="flex items-center justify-between gap-2 bg-white p-2.5 rounded-xl border border-slate-200">
                      <span className="font-mono text-xs sm:text-sm font-black text-slate-900 tracking-wider">
                        {BANK_COORDINATES.transferencia.numeroCuenta}
                      </span>
                      <button
                        type="button"
                        onClick={() => handleCopy(BANK_COORDINATES.transferencia.numeroCuentaRaw, 'tr-cta')}
                        className="p-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-600 hover:text-slate-900 transition-colors"
                        title="Copiar número de cuenta"
                      >
                        {copiedField === 'tr-cta' ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>

                  <div className="flex items-center justify-between pb-2 border-b border-slate-200">
                    <span className="text-[11px] text-slate-500">Cédula del Titular:</span>
                    <span className="text-xs font-mono font-bold text-slate-900">{BANK_COORDINATES.transferencia.cedula}</span>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-[11px] text-slate-500">Titular:</span>
                    <span className="text-xs text-slate-800 font-medium">{BANK_COORDINATES.transferencia.titular}</span>
                  </div>

                  <div className="pt-2 flex justify-end">
                    <button
                      type="button"
                      onClick={() => handleCopyAll('transferencia')}
                      className="text-[11px] text-amber-700 hover:text-amber-800 underline font-bold"
                    >
                      {copiedField === 'transferencia-all' ? '¡Datos de Transferencia Copiados!' : 'Copiar datos completos de Transferencia'}
                    </button>
                  </div>
                </div>
              )}

            </div>

          </div>

          {/* Right Column: Submission Form (5 cols) */}
          <div className="lg:col-span-5">
            <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-7 shadow-xl relative">
              
              <div className="mb-5">
                <span className="text-xs font-bold uppercase tracking-wider text-amber-800 flex items-center gap-1.5">
                  <FileCheck2 className="w-4 h-4 text-amber-600" />
                  <span>3. Reportar Pago y Activar Ficha</span>
                </span>
                <p className="text-xs text-slate-500 mt-0.5">
                  Ingresa tus datos y el número de referencia para emitir tus credenciales.
                </p>
              </div>

              {errorMessage && (
                <div className="mb-4 p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0 text-rose-600" />
                  <span>{errorMessage}</span>
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-4">
                
                {/* Full Name / Business Name */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5 flex items-center gap-1.5">
                    <User className="w-3.5 h-3.5 text-amber-600" />
                    <span>Nombre de la Persona o Negocio *</span>
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="ej. Café & Bistró El Nevado o Julio Daza"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 bg-slate-50 text-slate-900 text-xs placeholder:text-slate-400 focus:outline-none focus:border-amber-500 focus:bg-white focus:ring-2 focus:ring-amber-500/10 transition-all"
                  />
                </div>

                {/* Email Address */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5 flex items-center gap-1.5">
                    <Mail className="w-3.5 h-3.5 text-amber-600" />
                    <span>Correo Electrónico *</span>
                  </label>
                  <input
                    type="email"
                    required
                    placeholder="ej. contacto@mirestaurante.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 bg-slate-50 text-slate-900 text-xs placeholder:text-slate-400 focus:outline-none focus:border-amber-500 focus:bg-white focus:ring-2 focus:ring-amber-500/10 transition-all"
                  />
                  <span className="text-[10px] text-slate-500 mt-1 block">
                    Aquí te llegará de inmediato tu código oficial y enlace de acceso.
                  </span>
                </div>

                {/* Phone */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5 flex items-center gap-1.5">
                    <Phone className="w-3.5 h-3.5 text-amber-600" />
                    <span>Teléfono de Contacto / WhatsApp</span>
                  </label>
                  <input
                    type="tel"
                    placeholder="ej. 0414-8817137"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 bg-slate-50 text-slate-900 text-xs placeholder:text-slate-400 focus:outline-none focus:border-amber-500 focus:bg-white focus:ring-2 focus:ring-amber-500/10 transition-all"
                  />
                </div>

                {/* Payment Reference Number */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5 flex items-center gap-1.5">
                    <CreditCard className="w-3.5 h-3.5 text-amber-600" />
                    <span>Número de Referencia del Pago *</span>
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="ej. 849302 (últimos 6 u 8 dígitos)"
                    value={referenceNumber}
                    onChange={(e) => setReferenceNumber(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 bg-slate-50 text-slate-900 font-mono text-xs placeholder:text-slate-400 focus:outline-none focus:border-amber-500 focus:bg-white focus:ring-2 focus:ring-amber-500/10 transition-all"
                  />
                  <div className="flex items-center justify-between text-[10px] text-slate-500 mt-1">
                    <span>Monto calculado: Bs. {calculatedBs}</span>
                    <span>Tasa BCV</span>
                  </div>
                </div>

                {/* Bank Origin */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">
                    Banco de Origen (desde donde enviaste)
                  </label>
                  <select
                    value={issuingBank}
                    onChange={(e) => setIssuingBank(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 bg-slate-50 text-slate-900 text-xs focus:outline-none focus:border-amber-500 focus:bg-white"
                  >
                    <option value="Banco Provincial">Banco Provincial (Mismo Banco)</option>
                    <option value="Banesco">Banesco</option>
                    <option value="Banco de Venezuela">Banco de Venezuela</option>
                    <option value="Mercantil">Mercantil</option>
                    <option value="Bancaribe">Bancaribe</option>
                    <option value="BNC">Banco Nacional de Crédito (BNC)</option>
                    <option value="BAM">Banco Activo</option>
                    <option value="Banplus">Banplus</option>
                    <option value="Plaza">Banco Plaza</option>
                    <option value="Otro">Otro Banco Nacional</option>
                  </select>
                </div>

                {/* Adjuntar Comprobante de Pago (con Compresión Automática) */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5 flex items-center justify-between">
                    <span className="flex items-center gap-1.5">
                      <Paperclip className="w-3.5 h-3.5 text-amber-600" />
                      <span>Comprobante de Pago (Capture de Pantalla)</span>
                    </span>
                    <span className="text-[10px] text-slate-500 font-normal">
                      Opcional pero recomendado
                    </span>
                  </label>

                  {paymentProofOptimized ? (
                    <div className="p-3 rounded-2xl bg-emerald-50 border border-emerald-200 flex items-center justify-between gap-3">
                      <div className="flex items-center gap-3">
                        <img 
                          src={paymentProofOptimized.dataUrl} 
                          alt="Capture" 
                          className="w-12 h-12 object-cover rounded-xl border border-emerald-300 shadow-sm"
                        />
                        <div>
                          <span className="text-xs font-bold text-emerald-950 block flex items-center gap-1">
                            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                            Comprobante adjuntado
                          </span>
                          <span className="text-[10px] text-emerald-800 block mt-0.5">
                            Optimizado: {paymentProofOptimized.compressedSizeFormatted} ({paymentProofOptimized.compressionRatio})
                          </span>
                        </div>
                      </div>

                      <button
                        type="button"
                        onClick={() => setPaymentProofOptimized(null)}
                        className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50"
                        title="Quitar imagen"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  ) : (
                    <div className="relative border-2 border-dashed border-slate-300 hover:border-amber-400 rounded-2xl p-3.5 text-center bg-slate-50 hover:bg-amber-50/30 transition-all">
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleProofSelect}
                        disabled={isOptimizingProof}
                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer disabled:cursor-not-allowed"
                      />
                      <div className="flex flex-col items-center justify-center space-y-1 pointer-events-none">
                        {isOptimizingProof ? (
                          <>
                            <Loader2 className="w-5 h-5 text-amber-600 animate-spin" />
                            <span className="text-[11px] font-bold text-amber-900">Comprimiendo imagen...</span>
                          </>
                        ) : (
                          <>
                            <UploadCloud className="w-5 h-5 text-amber-600" />
                            <span className="text-xs font-bold text-slate-700">Adjuntar capture o recibo</span>
                            <span className="text-[10px] text-slate-500">Se comprime automáticamente para no consumir megas</span>
                          </>
                        )}
                      </div>
                    </div>
                  )}

                  {proofOptimizeError && (
                    <p className="text-xs text-rose-600 mt-1 flex items-center gap-1">
                      <AlertCircle className="w-3.5 h-3.5" />
                      {proofOptimizeError}
                    </p>
                  )}
                </div>

                {/* Submit Button */}
                <div className="pt-2">
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full py-4 px-6 rounded-2xl bg-gradient-to-r from-amber-500 via-amber-600 to-amber-500 hover:from-amber-600 hover:to-amber-700 text-white font-serif font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-xl shadow-amber-500/25 transition-all transform hover:scale-[1.01] active:scale-[0.99] disabled:opacity-50 disabled:pointer-events-none cursor-pointer"
                  >
                    {isSubmitting ? (
                      <>
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        <span>Validando y Registrando...</span>
                      </>
                    ) : (
                      <>
                        <Sparkles className="w-4 h-4" />
                        <span>Completar Afiliación Express ({currentPlan.usd} USD)</span>
                        <ArrowRight className="w-4 h-4" />
                      </>
                    )}
                  </button>
                </div>

                <div className="pt-2">
                  <p className="text-[11px] text-slate-500 flex items-center justify-center gap-1.5">
                    <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                    <span>Transacción directa y segura con Banco Provincial.</span>
                  </p>
                </div>

              </form>

            </div>

            {/* Bottom info link to regular full registration or login */}
            <div className="mt-4 p-4 rounded-2xl bg-white border border-slate-200 text-center space-y-1 shadow-2xs">
              <span className="text-[11px] text-slate-500 block">¿Ya eres miembro registrado?</span>
              <button
                type="button"
                onClick={() => onNavigate && onNavigate('affiliates')}
                className="text-xs text-amber-700 hover:text-amber-800 font-bold underline inline-flex items-center gap-1"
              >
                <span>Acceder al Portal Privado de Afiliados</span>
                <ArrowRight className="w-3 h-3" />
              </button>
            </div>

          </div>

        </div>

      </div>

    </section>
  );
}
