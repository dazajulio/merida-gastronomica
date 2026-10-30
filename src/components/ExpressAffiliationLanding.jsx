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
  Phone
} from 'lucide-react';
import { supabase } from '../lib/supabaseClient';
import { sendExpressAffiliateWelcomeEmail } from '../lib/emailService';
import { createBlankBusinessProfile } from './AffiliateDashboard';

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

  // Copy Feedback States
  const [copiedField, setCopiedField] = useState('');

  // Processing & Success States
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [successData, setSuccessData] = useState(null);

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

  // Bank Coordinates
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

      // 2. Save into Supabase 'solicitudes_afiliacion'
      if (supabase) {
        try {
          await supabase.from('solicitudes_afiliacion').insert([
            {
              codigo_afiliado: newAffiliateCode,
              nombre_comercial: fullName.trim(),
              tipo_negocio: currentPlan.id,
              titular_propietario: fullName.trim(),
              telefono: phone.trim() || 'No especificado',
              correo: email.trim().toLowerCase(),
              banco_pago_movil: issuingBank,
              referencia_pago_movil: referenceNumber.trim(),
              monto_bs: bcvRate ? parseFloat((currentPlan.usd * bcvRate).toFixed(2)) : null,
              municipio: 'Libertador (Mérida)',
              estado: 'pago_en_verificacion',
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
              telefono: phone.trim() || '0414-0000000',
              email: email.trim().toLowerCase(),
              municipio: 'Libertador (Mérida Ciudad)',
              estado_solvencia: 'En Verificación (Activo Provisional)',
              monto_inscripcion: currentPlan.usd,
              monto_cuota_mensual: 10,
              observaciones: `Afiliación Express Masiva. Referencia: ${referenceNumber.trim()}`,
              visible_en_guia: true,
              destacado_portada: false,
              created_at: new Date().toISOString()
            }
          ]);
        } catch (dirErr) {
          console.warn('Supabase directorio_agremiados notice:', dirErr);
        }
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
          chamberRating: "Verificación en Proceso"
        }
      };

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

  // --------------------------------------------------------------------------
  // SUCCESS VIEW: HIGH IMPACT CONFIRMATION
  // --------------------------------------------------------------------------
  if (successData) {
    const waText = encodeURIComponent(
      `¡Hola! Acabo de completar mi Afiliación Express a la Cámara Gastronómica del Estado Mérida:\n\n` +
      `🏛️ Establecimiento / Titular: ${successData.restaurantName}\n` +
      `🔑 Código Asignado: ${successData.affiliateCode}\n` +
      `💳 Método: ${paymentTab === 'transferencia' ? 'Transferencia Banco Provincial' : 'Pago Móvil Provincial'}\n` +
      `🔢 Referencia: ${successData.referenceNumber}\n` +
      `💰 Monto: Bs. ${successData.amountBs} ($${successData.plan.usd} USD)\n\n` +
      `Adjunto comprobante bancario para su validación.`
    );
    const waUrl = `https://wa.me/584148817137?text=${waText}`;

    return (
      <section className="min-h-screen bg-slate-950 text-slate-100 py-12 px-4 sm:px-6 lg:px-8 flex items-center justify-center relative overflow-hidden">
        {/* Glow ambient background */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-2xl w-full bg-slate-900 border border-amber-500/30 rounded-3xl p-6 sm:p-10 shadow-2xl relative z-10 animate-fadeIn text-center">
          
          <div className="w-20 h-20 rounded-full bg-emerald-500/20 border-2 border-emerald-500/50 text-emerald-400 flex items-center justify-center mx-auto mb-6 shadow-lg shadow-emerald-500/20">
            <CheckCircle2 className="w-10 h-10" />
          </div>

          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/20 border border-amber-500/40 text-amber-300 text-xs font-bold uppercase tracking-wider mb-3">
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            <span>Afiliación Express Registrada</span>
          </div>

          <h2 className="font-serif text-2xl sm:text-3xl font-bold text-white mb-2">
            ¡Bienvenido a la Cámara Gastronómica!
          </h2>
          <p className="text-sm text-slate-300 max-w-lg mx-auto mb-6 leading-relaxed">
            Hemos registrado con éxito tu afiliación gremial para <strong className="text-white">{successData.restaurantName}</strong>. 
            Te hemos enviado un correo oficial a <span className="text-amber-400 font-semibold">{successData.email}</span> con tu kit de bienvenida.
          </p>

          {/* Assigned Code Card */}
          <div className="bg-slate-950/80 border border-slate-800 rounded-2xl p-5 mb-8 text-left space-y-3">
            <div className="flex items-center justify-between border-b border-slate-800/80 pb-3">
              <div>
                <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider block">
                  Código Oficial de Agremiado
                </span>
                <span className="font-mono text-2xl font-black text-amber-400 tracking-wider">
                  {successData.affiliateCode}
                </span>
              </div>
              <button
                type="button"
                onClick={() => handleCopy(successData.affiliateCode, 'code')}
                className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors flex items-center gap-1.5 text-xs font-semibold"
                title="Copiar código"
              >
                {copiedField === 'code' ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                <span>{copiedField === 'code' ? 'Copiado' : 'Copiar'}</span>
              </button>
            </div>

            <div className="grid grid-cols-2 gap-3 text-xs pt-1">
              <div>
                <span className="text-slate-500 block">Establecimiento:</span>
                <span className="text-slate-200 font-semibold truncate block">{successData.restaurantName}</span>
              </div>
              <div>
                <span className="text-slate-500 block">Referencia Pago:</span>
                <span className="text-slate-200 font-mono font-semibold">{successData.referenceNumber}</span>
              </div>
              <div>
                <span className="text-slate-500 block">Categoría:</span>
                <span className="text-slate-200 font-semibold">{successData.plan.title}</span>
              </div>
              <div>
                <span className="text-slate-500 block">Estatus Inicial:</span>
                <span className="text-emerald-400 font-bold">Activo (En Verificación)</span>
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
              className="w-full py-3.5 px-6 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-lg shadow-emerald-600/20 transition-all"
            >
              <Smartphone className="w-4 h-4" />
              <span>Enviar Comprobante por WhatsApp a la Cámara</span>
              <ExternalLink className="w-3.5 h-3.5 opacity-80" />
            </a>

            <button
              type="button"
              onClick={() => onNavigate && onNavigate('home')}
              className="pt-2 text-xs text-slate-400 hover:text-white transition-colors block mx-auto underline font-medium"
            >
              Volver a la portada de Mérida Gastronómica
            </button>
          </div>

        </div>
      </section>
    );
  }

  // --------------------------------------------------------------------------
  // MAIN LANDING VIEW: HIGH-CONVERSION EXPRESS ONBOARDING
  // --------------------------------------------------------------------------
  return (
    <section className="min-h-screen bg-slate-950 text-slate-100 py-8 sm:py-14 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      
      {/* Background radial glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-96 bg-gradient-to-b from-amber-500/15 via-orange-500/5 to-transparent blur-3xl pointer-events-none" />

      <div className="max-w-4xl mx-auto relative z-10">

        {/* Top Header / Brand */}
        <div className="text-center mb-8 sm:mb-12">
          
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 text-xs font-bold uppercase tracking-widest mb-4 shadow-sm">
            <Sparkles className="w-4 h-4 text-amber-400" />
            <span>Afiliación Gremial Express 2026</span>
          </div>

          <h1 className="font-serif text-3xl sm:text-5xl font-black text-white tracking-tight leading-tight mb-4">
            Únete a la <span className="bg-gradient-to-r from-amber-400 via-amber-200 to-yellow-500 bg-clip-text text-transparent">Cámara Gastronómica</span> en 60 Segundos
          </h1>

          <p className="text-sm sm:text-base text-slate-300 max-w-2xl mx-auto leading-relaxed">
            Proceso de afiliación simplificado para el sector culinario de Mérida. Realiza tu aporte, reporta tu referencia y activa de inmediato tu presencia oficial y respaldo gremial.
          </p>

          {/* Quick Value Pillars */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 max-w-2xl mx-auto mt-6 text-left">
            <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-3 flex items-center gap-3">
              <div className="w-8 h-8 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center shrink-0">
                <Store className="w-4 h-4" />
              </div>
              <span className="text-xs text-slate-300 font-medium">Presencia en Guía Oficial y Mapa 3D</span>
            </div>

            <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-3 flex items-center gap-3">
              <div className="w-8 h-8 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center shrink-0">
                <ShieldCheck className="w-4 h-4" />
              </div>
              <span className="text-xs text-slate-300 font-medium">Blindaje Legal y Respaldo Institucional</span>
            </div>

            <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-3 flex items-center gap-3">
              <div className="w-8 h-8 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center shrink-0">
                <Sparkles className="w-4 h-4" />
              </div>
              <span className="text-xs text-slate-300 font-medium">Sello de Calidad y Eventos Exclusivos</span>
            </div>
          </div>
        </div>

        {/* Main 2-Column Responsive Card */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">

          {/* LEFT COLUMN: PAYMENT COORDINATES & BCV TIER SELECTOR (7 Cols) */}
          <div className="lg:col-span-7 space-y-6">

            {/* 1. TIER / PLAN SELECTOR */}
            <div className="bg-slate-900 border border-slate-800 rounded-3xl p-5 sm:p-6 shadow-xl">
              <div className="flex items-center justify-between mb-4">
                <span className="text-xs font-bold uppercase tracking-wider text-amber-400 flex items-center gap-1.5">
                  <ChefHat className="w-4 h-4" />
                  <span>1. Selecciona tu Tipo de Afiliación</span>
                </span>
                <span className="text-[11px] text-slate-400">Incluye 1er mes de membresía</span>
              </div>

              <div className="space-y-2.5">
                {Object.values(PLAN_DETAILS).map(plan => {
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
                          ? 'bg-amber-500/10 border-amber-500/60 ring-2 ring-amber-500/20 shadow-md' 
                          : 'bg-slate-950/60 border-slate-800 hover:border-slate-700 text-slate-300'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div className={`w-5 h-5 rounded-full border flex items-center justify-center ${
                          isSelected ? 'border-amber-500 bg-amber-500 text-white' : 'border-slate-600'
                        }`}>
                          {isSelected && <div className="w-2 h-2 rounded-full bg-slate-950" />}
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <h4 className="text-xs font-bold text-white">{plan.title}</h4>
                            <span className="text-[9px] px-2 py-0.5 rounded-full bg-slate-800 text-amber-300 border border-slate-700 font-semibold">
                              {plan.badge}
                            </span>
                          </div>
                          <p className="text-[11px] text-slate-400 leading-tight mt-0.5">{plan.description}</p>
                        </div>
                      </div>

                      <div className="text-right shrink-0">
                        <span className="font-mono text-base font-extrabold text-amber-400 block">
                          ${plan.usd} <span className="text-[10px] text-slate-400 font-sans">USD</span>
                        </span>
                        <span className="text-[10px] text-slate-400 font-mono block">
                          Bs. {planBs}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* BCV Exchange Rate Banner */}
              <div className="mt-4 pt-3 border-t border-slate-800 flex items-center justify-between text-[11px] text-slate-400">
                <span className="flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5 text-amber-400" />
                  <span>Tasa Oficial BCV del Día:</span>
                </span>
                <span className="font-mono font-bold text-amber-300">
                  {bcvLoading ? 'Consultando...' : bcvRate ? `Bs. ${bcvRate.toFixed(2)} / USD` : 'Tasa Oficial BCV'}
                  {bcvDate && <span className="text-[10px] text-slate-500 ml-1">({bcvDate})</span>}
                </span>
              </div>
            </div>

            {/* 2. PAYMENT COORDINATES CARD (PAGO MOVIL & TRANSFERENCIA) */}
            <div className="bg-slate-900 border border-amber-500/30 rounded-3xl p-5 sm:p-6 shadow-xl relative overflow-hidden">
              
              <div className="flex items-center justify-between pb-4 border-b border-slate-800">
                <div>
                  <span className="text-xs font-bold uppercase tracking-wider text-amber-400 flex items-center gap-1.5">
                    <CreditCard className="w-4 h-4" />
                    <span>2. Coordenadas Bancarias Oficiales</span>
                  </span>
                  <p className="text-[11px] text-slate-400 mt-0.5">
                    Banco Provincial (0108) • Titular Oficial de la Cámara
                  </p>
                </div>

                <div className="text-right">
                  <span className="text-[10px] uppercase font-bold text-slate-400 block">Total a Pagar</span>
                  <span className="font-mono text-lg font-black text-amber-400 leading-none">
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
                      ? 'bg-amber-500 text-slate-950 shadow-md font-extrabold'
                      : 'bg-slate-950/70 text-slate-400 hover:text-white border border-slate-800'
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
                      ? 'bg-amber-500 text-slate-950 shadow-md font-extrabold'
                      : 'bg-slate-950/70 text-slate-400 hover:text-white border border-slate-800'
                  }`}
                >
                  <Building2 className="w-4 h-4" />
                  <span>Transferencia Provincial</span>
                </button>
              </div>

              {/* Coordinates Content: Pago Móvil */}
              {paymentTab === 'pago-movil' && (
                <div className="bg-slate-950/80 border border-slate-800 rounded-2xl p-4 space-y-3 animate-fadeIn">
                  
                  <div className="flex items-center justify-between pb-2 border-b border-slate-800/80">
                    <span className="text-[11px] text-slate-400">Banco:</span>
                    <span className="text-xs font-bold text-white">{BANK_COORDINATES.pagoMovil.banco}</span>
                  </div>

                  <div className="flex items-center justify-between pb-2 border-b border-slate-800/80">
                    <span className="text-[11px] text-slate-400">Teléfono Pago Móvil:</span>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-mono font-bold text-amber-300">
                        {BANK_COORDINATES.pagoMovil.telefono}
                      </span>
                      <button
                        type="button"
                        onClick={() => handleCopy(BANK_COORDINATES.pagoMovil.telefonoRaw, 'pm-tel')}
                        className="p-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors"
                        title="Copiar teléfono"
                      >
                        {copiedField === 'pm-tel' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                      </button>
                    </div>
                  </div>

                  <div className="flex items-center justify-between pb-2 border-b border-slate-800/80">
                    <span className="text-[11px] text-slate-400">Cédula / RIF:</span>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-mono font-bold text-amber-300">
                        {BANK_COORDINATES.pagoMovil.cedula}
                      </span>
                      <button
                        type="button"
                        onClick={() => handleCopy('12517086', 'pm-cedula')}
                        className="p-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors"
                        title="Copiar cédula"
                      >
                        {copiedField === 'pm-cedula' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                      </button>
                    </div>
                  </div>

                  <div className="flex items-center justify-between pb-2 border-b border-slate-800/80">
                    <span className="text-[11px] text-slate-400">Titular Registrado:</span>
                    <span className="text-xs font-semibold text-white">{BANK_COORDINATES.pagoMovil.titular}</span>
                  </div>

                  <div className="pt-2 flex items-center justify-between gap-3">
                    <button
                      type="button"
                      onClick={() => handleCopyAll('pago-movil')}
                      className="w-full py-2 px-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-amber-300 hover:text-white text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors border border-slate-700"
                    >
                      {copiedField === 'pago-movil-all' ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                      <span>{copiedField === 'pago-movil-all' ? '¡Todos los datos copiados!' : 'Copiar Todos los Datos de Pago Móvil'}</span>
                    </button>
                  </div>

                </div>
              )}

              {/* Coordinates Content: Transferencia Bancaria */}
              {paymentTab === 'transferencia' && (
                <div className="bg-slate-950/80 border border-slate-800 rounded-2xl p-4 space-y-3 animate-fadeIn">
                  
                  <div className="flex items-center justify-between pb-2 border-b border-slate-800/80">
                    <span className="text-[11px] text-slate-400">Banco:</span>
                    <span className="text-xs font-bold text-white">{BANK_COORDINATES.transferencia.banco}</span>
                  </div>

                  <div className="flex items-center justify-between pb-2 border-b border-slate-800/80">
                    <span className="text-[11px] text-slate-400">Titular de Cuenta:</span>
                    <span className="text-xs font-bold text-white">{BANK_COORDINATES.transferencia.titular}</span>
                  </div>

                  <div className="flex items-center justify-between pb-2 border-b border-slate-800/80">
                    <span className="text-[11px] text-slate-400">Cédula:</span>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-mono font-bold text-amber-300">
                        {BANK_COORDINATES.transferencia.cedula}
                      </span>
                      <button
                        type="button"
                        onClick={() => handleCopy('12517086', 'tr-cedula')}
                        className="p-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors"
                        title="Copiar cédula"
                      >
                        {copiedField === 'tr-cedula' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                      </button>
                    </div>
                  </div>

                  <div className="flex items-center justify-between pb-2 border-b border-slate-800/80">
                    <span className="text-[11px] text-slate-400">Tipo de Cuenta:</span>
                    <span className="text-xs font-semibold text-white">{BANK_COORDINATES.transferencia.tipoCuenta}</span>
                  </div>

                  <div className="pb-1">
                    <span className="text-[11px] text-slate-400 block mb-1">Número de Cuenta Corriente (20 dígitos):</span>
                    <div className="flex items-center justify-between gap-2 bg-slate-900 p-2.5 rounded-xl border border-slate-800">
                      <span className="font-mono text-xs sm:text-sm font-black text-amber-300 tracking-wider">
                        {BANK_COORDINATES.transferencia.numeroCuenta}
                      </span>
                      <button
                        type="button"
                        onClick={() => handleCopy(BANK_COORDINATES.transferencia.numeroCuentaRaw, 'tr-cta')}
                        className="py-1 px-2.5 rounded-lg bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold text-[11px] flex items-center gap-1 transition-colors shrink-0"
                      >
                        {copiedField === 'tr-cta' ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                        <span>{copiedField === 'tr-cta' ? '¡Copiado!' : 'Copiar Cuenta'}</span>
                      </button>
                    </div>
                  </div>

                  <div className="pt-2">
                    <button
                      type="button"
                      onClick={() => handleCopyAll('transferencia')}
                      className="w-full py-2 px-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-amber-300 hover:text-white text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors border border-slate-700"
                    >
                      {copiedField === 'transferencia-all' ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                      <span>{copiedField === 'transferencia-all' ? '¡Todos los datos copiados!' : 'Copiar Todos los Datos de Transferencia'}</span>
                    </button>
                  </div>

                </div>
              )}

            </div>

          </div>

          {/* RIGHT COLUMN: ULTRA-FAST FORM (5 Cols) */}
          <div className="lg:col-span-5">
            
            <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-7 shadow-2xl relative">
              
              <div className="mb-5">
                <span className="text-xs font-bold uppercase tracking-wider text-amber-400 flex items-center gap-1.5 mb-1">
                  <FileCheck2 className="w-4 h-4" />
                  <span>3. Reportar Afiliación Express</span>
                </span>
                <h3 className="font-serif text-lg font-bold text-white">
                  Tus Datos de Contacto y Pago
                </h3>
                <p className="text-xs text-slate-400 mt-1">
                  Solo te pedimos estos datos esenciales para emitir tu código CGM y abrir tu cuenta.
                </p>
              </div>

              {errorMessage && (
                <div className="mb-4 p-3 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 text-xs font-medium flex items-center gap-2 animate-fadeIn">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{errorMessage}</span>
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-4">
                
                {/* Full Name / Business Name */}
                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1.5 flex items-center gap-1.5">
                    <User className="w-3.5 h-3.5 text-amber-400" />
                    <span>Nombre de la Persona o Negocio *</span>
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="ej. Café & Bistró El Nevado o Julio Daza"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-700 bg-slate-950 text-white text-xs placeholder:text-slate-500 focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500"
                  />
                </div>

                {/* Email Address */}
                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1.5 flex items-center gap-1.5">
                    <Mail className="w-3.5 h-3.5 text-amber-400" />
                    <span>Correo Electrónico *</span>
                  </label>
                  <input
                    type="email"
                    required
                    placeholder="ej. contacto@mirestaurante.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-700 bg-slate-950 text-white text-xs placeholder:text-slate-500 focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500"
                  />
                  <span className="text-[10px] text-slate-400 mt-1 block">
                    Aquí te llegará de inmediato tu código oficial y enlace de acceso.
                  </span>
                </div>

                {/* Phone / WhatsApp */}
                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1.5 flex items-center gap-1.5">
                    <Phone className="w-3.5 h-3.5 text-amber-400" />
                    <span>Teléfono o WhatsApp (Recomendado)</span>
                  </label>
                  <input
                    type="tel"
                    placeholder="ej. 0414-8817137"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-700 bg-slate-950 text-white text-xs placeholder:text-slate-500 focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500"
                  />
                </div>

                {/* Payment Reference Number */}
                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1.5 flex items-center gap-1.5">
                    <CreditCard className="w-3.5 h-3.5 text-amber-400" />
                    <span>Número de Referencia de Pago *</span>
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="ej. 6 a 8 dígitos de la referencia"
                    value={referenceNumber}
                    onChange={(e) => setReferenceNumber(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-700 bg-slate-950 text-white font-mono text-xs placeholder:text-slate-500 focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500"
                  />
                  <div className="flex items-center justify-between text-[10px] text-slate-400 mt-1">
                    <span>Método: {paymentTab === 'pago-movil' ? 'Pago Móvil' : 'Transferencia'}</span>
                    <span>Monto: Bs. {calculatedBs}</span>
                  </div>
                </div>

                {/* Submit Button */}
                <div className="pt-2">
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full py-4 px-5 rounded-2xl bg-gradient-to-r from-amber-500 via-amber-600 to-amber-500 hover:from-amber-600 hover:to-amber-700 text-white font-serif font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-xl shadow-amber-500/25 transition-all transform hover:scale-[1.01] active:scale-[0.99] disabled:opacity-60 disabled:pointer-events-none"
                  >
                    {isSubmitting ? (
                      <>
                        <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        <span>Validando y Activando Afiliación...</span>
                      </>
                    ) : (
                      <>
                        <Send className="w-4 h-4" />
                        <span>Ya Pagué • Activar Mi Afiliación</span>
                      </>
                    )}
                  </button>
                </div>

                <div className="pt-1 text-center">
                  <p className="text-[11px] text-slate-400 flex items-center justify-center gap-1.5">
                    <ShieldCheck className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                    <span>Transacción directa y segura con Banco Provincial.</span>
                  </p>
                </div>

              </form>

            </div>

            {/* Bottom info link to regular full registration or login */}
            <div className="mt-4 p-4 rounded-2xl bg-slate-900/50 border border-slate-800/80 text-center space-y-1">
              <span className="text-[11px] text-slate-400 block">¿Ya eres miembro registrado?</span>
              <button
                type="button"
                onClick={() => onNavigate && onNavigate('affiliates')}
                className="text-xs text-amber-400 hover:text-amber-300 font-semibold underline transition-colors"
              >
                Ingresar al Portal Gremial Privado
              </button>
            </div>

          </div>

        </div>

      </div>

    </section>
  );
}
