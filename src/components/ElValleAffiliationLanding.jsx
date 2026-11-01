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
  Compass, 
  MapPin, 
  AlertCircle,
  Mail,
  User,
  Phone,
  Tag,
  Mountain,
  Sun,
  Camera,
  HeartHandshake
} from 'lucide-react';
import { supabase } from '../lib/supabaseClient';
import { sendExpressAffiliateWelcomeEmail } from '../lib/emailService';
import { createBlankBusinessProfile } from './AffiliateDashboard';

export function ElValleAffiliationLanding({ onNavigate, onCompleteExpress }) {
  // Exchange Rate State (BCV)
  const [bcvRate, setBcvRate] = useState(null);
  const [bcvLoading, setBcvLoading] = useState(true);
  const [bcvDate, setBcvDate] = useState('');

  // Fixed Pricing Terms for "El Valle te Conecta"
  const PLAN_TERMS = {
    id: 'el_valle_te_conecta',
    title: 'Prestador Turístico / Gastronómico - El Valle',
    groupName: 'El Valle te Conecta',
    inscriptionUsd: 0,
    monthlyUsd: 7,
    regularMonthlyUsd: 15,
    regularInscriptionUsd: 35
  };

  // Payment Method Tab: 'pago-movil' | 'transferencia'
  const [paymentTab, setPaymentTab] = useState('pago-movil');

  // Form Fields
  const [establishmentName, setEstablishmentName] = useState('');
  const [ownerName, setOwnerName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [category, setCategory] = useState('Restaurante / Bistró');
  const [valleySector, setValleySector] = useState('Sector El Playón');
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

  // Official Bank Coordinates (Cámara Gastronómica del Estado Mérida)
  const BANK_COORDINATES = {
    pagoMovil: {
      banco: 'Banco Provincial (0108)',
      telefono: '0414-8817137',
      telefonoRaw: '04148817137',
      cedula: 'V-12517086',
      titular: 'Julio Alberto Daza Celis',
      concepto: 'Afiliacion El Valle te Conecta'
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
    if (navigator?.clipboard?.writeText) {
      navigator.clipboard.writeText(text);
      setCopiedField(fieldName);
      setTimeout(() => setCopiedField(''), 2500);
    }
  };

  // Calculate equivalent in Bs for $7 USD
  const calculatedBs = bcvRate 
    ? (PLAN_TERMS.monthlyUsd * bcvRate).toLocaleString('es-VE', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
    : '---';

  const copyAllBankInfo = (type) => {
    let fullText = '';
    if (type === 'pago-movil') {
      fullText = `CÁMARA GASTRONÓMICA DEL ESTADO MÉRIDA\nConvenio: El Valle te Conecta\nPago Móvil Provincial (0108)\nCédula: ${BANK_COORDINATES.pagoMovil.cedula}\nTeléfono: ${BANK_COORDINATES.pagoMovil.telefonoRaw}\nTitular: ${BANK_COORDINATES.pagoMovil.titular}\nConcepto: ${BANK_COORDINATES.pagoMovil.concepto}\nMonto 1ra Mensualidad: Bs. ${calculatedBs} ($7 USD)`;
    } else {
      fullText = `CÁMARA GASTRONÓMICA DEL ESTADO MÉRIDA\nConvenio: El Valle te Conecta\nTransferencia Banco Provincial\nTitular: ${BANK_COORDINATES.transferencia.titular}\nCédula: ${BANK_COORDINATES.transferencia.cedula}\nTipo: ${BANK_COORDINATES.transferencia.tipoCuenta}\nCuenta: ${BANK_COORDINATES.transferencia.numeroCuenta}\nMonto 1ra Mensualidad: Bs. ${calculatedBs} ($7 USD)`;
    }
    handleCopy(fullText, `${type}-all`);
  };

  // Handle Form Submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage('');

    if (!establishmentName.trim()) {
      setErrorMessage('Por favor ingrese el nombre de su establecimiento o emprendimiento en El Valle.');
      return;
    }

    if (!ownerName.trim()) {
      setErrorMessage('Por favor ingrese el nombre del titular o representante legal.');
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
      // 1. Generate unique CGM Valley Affiliate Code
      const randomSuffix = Math.floor(100 + Math.random() * 899);
      const newAffiliateCode = `CGM-VALLE-${randomSuffix}`;

      // 2. Save into Supabase 'solicitudes_afiliacion'
      if (supabase) {
        try {
          await supabase.from('solicitudes_afiliacion').insert([
            {
              codigo_afiliado: newAffiliateCode,
              nombre_comercial: establishmentName.trim(),
              tipo_negocio: 'el_valle_te_conecta',
              titular_propietario: ownerName.trim(),
              telefono: phone.trim() || 'No especificado',
              correo: email.trim().toLowerCase(),
              banco_pago_movil: issuingBank,
              referencia_pago_movil: referenceNumber.trim(),
              monto_bs: bcvRate ? parseFloat((PLAN_TERMS.monthlyUsd * bcvRate).toFixed(2)) : null,
              municipio: `Libertador / El Valle (${valleySector})`,
              estado: 'pago_en_verificacion',
              created_at: new Date().toISOString()
            }
          ]);
        } catch (dbErr) {
          console.warn('Supabase solicitudes_afiliacion notice:', dbErr);
        }

        // Also register in directorio_agremiados as active provisional with $0 inscription and $7 monthly fee
        try {
          await supabase.from('directorio_agremiados').insert([
            {
              codigo_afiliado: newAffiliateCode,
              nombre_establecimiento: establishmentName.trim(),
              categoria_negocio: `${category} (El Valle)`,
              representante_legal: ownerName.trim(),
              telefono: phone.trim() || '0414-0000000',
              email: email.trim().toLowerCase(),
              direccion_completa: `Ruta Turística El Valle, ${valleySector}, Mérida`,
              municipio: 'Libertador (El Valle)',
              estado_solvencia: 'En Verificación (Activo Provisional)',
              monto_inscripcion: 0.00,
              monto_cuota_mensual: 7.00,
              observaciones: `Convenio Exclusivo: Grupo El Valle te Conecta. Sector: ${valleySector}. Inscripción exonerada ($0). Mensualidad: $7. Ref: ${referenceNumber.trim()}`,
              visible_en_guia: true,
              destacado_portada: true,
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
        nombre_establecimiento: establishmentName.trim(),
        categoria_negocio: `${category} (El Valle)`,
        representante_legal: ownerName.trim(),
        email: email.trim().toLowerCase(),
        telefono: phone.trim() || '0414-0000000',
        direccion_completa: `Ruta Turística El Valle, ${valleySector}, Mérida`,
        municipio: 'Libertador (El Valle)',
        estado_solvencia: 'En Verificación (Activo Provisional)',
        monto_inscripcion: 0.00,
        monto_cuota_mensual: 7.00,
        fecha_registro: new Date().toISOString(),
        visible_en_guia: true,
        destacado_portada: true
      };

      try {
        const localDir = JSON.parse(localStorage.getItem('cgem_directorio_agremiados') || '[]');
        localStorage.setItem(
          'cgem_directorio_agremiados', 
          JSON.stringify([newLocalEntry, ...localDir.filter(i => i.codigo_afiliado !== newAffiliateCode)])
        );
      } catch (e) {}

      // 4. Create Blank Business Profile with El Valle pre-sets
      const newBlankProfile = createBlankBusinessProfile({
        id: newAffiliateCode,
        restaurantName: establishmentName.trim(),
        ownerName: ownerName.trim(),
        category: category,
        phone: phone.trim(),
        email: email.trim().toLowerCase(),
        location: `Ruta El Valle, ${valleySector}, Mérida`,
        instagram: ''
      });

      try {
        localStorage.setItem(`cgem_biz_profile_${newAffiliateCode}`, JSON.stringify(newBlankProfile));
      } catch (e) {}

      // 5. Send Welcome & Customization Email via Resend
      sendExpressAffiliateWelcomeEmail({
        affiliateCode: newAffiliateCode,
        restaurantName: establishmentName.trim(),
        ownerName: ownerName.trim(),
        email: email.trim().toLowerCase(),
        phone: phone.trim(),
        paymentMethod: paymentTab,
        referenceNumber: referenceNumber.trim(),
        amountBs: calculatedBs,
        amountUsd: PLAN_TERMS.monthlyUsd,
        category: `${category} - El Valle te Conecta`
      }).catch(err => console.warn('Resend Express notification notice:', err));

      // 6. Set Active User object for one-click session handoff
      const userPayload = {
        id: newAffiliateCode,
        restaurantName: establishmentName.trim(),
        ownerName: ownerName.trim(),
        memberCategory: 'Prestador Turístico El Valle',
        businessType: 'el_valle_te_conecta',
        email: email.trim().toLowerCase(),
        registrationDate: new Date().toLocaleDateString('es-VE', { day: '2-digit', month: 'long', year: 'numeric' }),
        expiryDate: "31 de Diciembre de 2026",
        status: "Activo (Convenio El Valle)",
        monthlyDues: "$7.00",
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

      setSuccessData({
        affiliateCode: newAffiliateCode,
        establishmentName: establishmentName.trim(),
        ownerName: ownerName.trim(),
        email: email.trim().toLowerCase(),
        referenceNumber: referenceNumber.trim(),
        amountBs: calculatedBs,
        userPayload
      });

    } catch (err) {
      console.error('Submission error:', err);
      setErrorMessage('Ocurrió un error al procesar la solicitud. Por favor intente nuevamente.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // SUCCESS VIEW
  if (successData) {
    const waText = encodeURIComponent(
      `¡Hola Cámara Gastronómica! He completado mi registro del Convenio *El Valle te Conecta*:\n\n` +
      `🌿 Establecimiento: ${successData.establishmentName}\n` +
      `👤 Titular: ${successData.ownerName}\n` +
      `🏷️ Código Asignado: ${successData.affiliateCode}\n` +
      `💳 Método: ${paymentTab === 'transferencia' ? 'Transferencia Banco Provincial' : 'Pago Móvil Provincial'}\n` +
      `🔢 Referencia: ${successData.referenceNumber}\n` +
      `💵 1ra Mensualidad ($7 USD): Bs. ${successData.amountBs}\n\n` +
      `Adjunto comprobante para validación bancaria.`
    );
    const waUrl = `https://wa.me/584148817137?text=${waText}`;

    return (
      <section className="min-h-screen bg-slate-950 text-slate-100 py-12 px-4 sm:px-6 lg:px-8 flex items-center justify-center relative overflow-hidden">
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-xl w-full bg-slate-900 border border-emerald-500/30 rounded-3xl p-6 sm:p-10 shadow-2xl relative z-10 text-center animate-fadeIn">
          
          <div className="w-20 h-20 bg-emerald-500/20 text-emerald-400 rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-inner ring-1 ring-emerald-500/30">
            <CheckCircle2 className="w-10 h-10" />
          </div>

          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-950 border border-emerald-700/60 text-emerald-300 text-xs font-semibold uppercase tracking-wider mb-3">
            <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
            <span>Convenio Especial: El Valle te Conecta</span>
          </div>

          <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight mb-2">
            ¡Bienvenido a Mérida Gastronómica!
          </h2>
          <p className="text-sm text-slate-300 mb-6">
            Hemos recibido el registro de <strong className="text-emerald-300">{successData.establishmentName}</strong> con el beneficio de <strong>Inscripción Exonerada ($0)</strong> y cuota preferencial de <strong>$7/mes</strong>.
          </p>

          <div className="bg-slate-950 border border-slate-800 rounded-2xl p-5 mb-6 text-left space-y-2.5">
            <div className="flex items-center justify-between pb-2 border-b border-slate-800">
              <span className="text-xs text-slate-400">Código Oficial Asignado:</span>
              <span className="font-mono text-base font-black text-emerald-400 tracking-wider">
                {successData.affiliateCode}
              </span>
            </div>
            <div className="flex items-center justify-between text-xs">
              <span className="text-slate-400">Grupo Exclusivo:</span>
              <span className="text-slate-200 font-semibold">El Valle te Conecta</span>
            </div>
            <div className="flex items-center justify-between text-xs">
              <span className="text-slate-400">Inscripción / Matrícula:</span>
              <span className="text-emerald-400 font-bold">¡$0.00 (Exonerada)!</span>
            </div>
            <div className="flex items-center justify-between text-xs">
              <span className="text-slate-400">Cuota Mensual Preferencial:</span>
              <span className="text-white font-bold">$7.00 USD</span>
            </div>
            <div className="flex items-center justify-between text-xs">
              <span className="text-slate-400">1ra Mensualidad Reportada:</span>
              <span className="text-emerald-300 font-bold">Bs. {successData.amountBs} (Ref: {successData.referenceNumber})</span>
            </div>
            <div className="flex items-center justify-between text-xs">
              <span className="text-slate-400">Correo Electrónico:</span>
              <span className="text-slate-200">{successData.email}</span>
            </div>
          </div>

          <div className="space-y-3">
            <a
              href={waUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full py-3.5 px-4 rounded-xl font-bold bg-emerald-600 hover:bg-emerald-500 text-white flex items-center justify-center gap-2 transition-all shadow-lg shadow-emerald-900/40 text-sm"
            >
              <Send className="w-4 h-4" />
              <span>Enviar Comprobante por WhatsApp</span>
            </a>

            <button
              onClick={() => {
                if (onCompleteExpress) {
                  onCompleteExpress(successData.userPayload);
                } else if (onNavigate) {
                  onNavigate('affiliates');
                }
              }}
              className="w-full py-3 px-4 rounded-xl font-bold bg-amber-500 hover:bg-amber-400 text-slate-950 flex items-center justify-center gap-2 transition-all shadow-md text-sm"
            >
              <Store className="w-4 h-4" />
              <span>Personalizar Ficha en el Portal de Agremiados</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </section>
    );
  }

  // MAIN REGISTRATION VIEW
  return (
    <section className="min-h-screen bg-slate-950 text-slate-100 py-10 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      
      {/* Background ambient accents */}
      <div className="absolute top-10 left-1/3 -translate-x-1/2 w-96 h-96 bg-emerald-600/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute top-80 right-10 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-6xl mx-auto relative z-10">

        {/* Back navigation */}
        <div className="flex items-center justify-between mb-8">
          <button
            onClick={() => onNavigate ? onNavigate('home') : window.history.back()}
            className="inline-flex items-center gap-2 text-xs font-semibold text-slate-400 hover:text-white transition-colors py-1.5 px-3 rounded-lg hover:bg-slate-900"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Volver al Inicio</span>
          </button>

          <div className="flex items-center gap-2 text-xs text-emerald-400 bg-emerald-950/60 border border-emerald-800/60 px-3 py-1 rounded-full">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
            <span>Convenio Gremial Oficial Vigente 2026</span>
          </div>
        </div>

        {/* Hero Section with Dual Branding */}
        <div className="text-center max-w-3xl mx-auto mb-10">
          
          {/* Badges / Logos */}
          <div className="flex items-center justify-center gap-4 sm:gap-6 mb-6">
            <div className="p-2.5 rounded-2xl bg-slate-900 border border-slate-800 shadow-lg flex items-center justify-center">
              <img 
                src="/logo-merida-gastronomica.png" 
                alt="Cámara Gastronómica de Mérida" 
                className="h-12 sm:h-14 w-auto object-contain"
                onError={(e) => { e.currentTarget.style.display = 'none'; }}
              />
            </div>
            
            <div className="w-8 h-8 rounded-full bg-slate-800 flex items-center justify-center text-slate-400 font-bold text-sm">
              ✕
            </div>

            <div className="p-2 rounded-2xl bg-white shadow-lg flex items-center justify-center border-2 border-amber-400">
              <img 
                src="/images/el-valle/logo-el-valle.png" 
                alt="El Valle te Conecta" 
                className="h-12 sm:h-14 w-auto object-contain"
              />
            </div>
          </div>

          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-gradient-to-r from-emerald-950 to-amber-950 border border-emerald-500/40 text-emerald-300 text-xs font-bold uppercase tracking-wider mb-4 shadow-sm">
            <Mountain className="w-3.5 h-3.5 text-emerald-400" />
            <span>Ruta Turística El Valle • Mérida</span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-black text-white tracking-tight mb-4">
            Afiliación Especial: <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 via-teal-300 to-amber-400">El Valle te Conecta</span>
          </h1>

          <p className="text-sm sm:text-base text-slate-300 leading-relaxed max-w-2xl mx-auto">
            Enlace exclusivo para posadas, restaurantes, cafeterías, artesanos y prestadores de la ruta turística <strong>El Valle</strong>. Integra tu negocio a la Cámara Gastronómica del Estado Mérida con condiciones institucionales preferenciales.
          </p>
        </div>

        {/* Pricing & Benefit Summary Banner */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-10">
          
          {/* Card 1: Inscripción Exonerada */}
          <div className="bg-gradient-to-br from-emerald-950/80 to-slate-900 border border-emerald-500/40 rounded-3xl p-5 text-center relative overflow-hidden shadow-xl">
            <div className="absolute top-2 right-2 px-2 py-0.5 rounded-full bg-emerald-500 text-slate-950 text-[10px] font-black uppercase">
              100% Descuento
            </div>
            <div className="w-10 h-10 rounded-2xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center mx-auto mb-3">
              <Sparkles className="w-5 h-5" />
            </div>
            <span className="text-xs uppercase font-bold text-slate-400 tracking-wider block mb-1">Inscripción Oficial</span>
            <div className="flex items-center justify-center gap-2 mb-1">
              <span className="text-lg line-through text-slate-500 font-bold">$35 USD</span>
              <span className="text-3xl font-black text-emerald-400">$0 USD</span>
            </div>
            <p className="text-xs text-emerald-300 font-semibold">
              ¡Exonerada por ser miembro de la ruta El Valle te Conecta!
            </p>
          </div>

          {/* Card 2: Mensualidad Preferencial */}
          <div className="bg-gradient-to-br from-amber-950/80 to-slate-900 border border-amber-500/40 rounded-3xl p-5 text-center relative overflow-hidden shadow-xl">
            <div className="absolute top-2 right-2 px-2 py-0.5 rounded-full bg-amber-500 text-slate-950 text-[10px] font-black uppercase">
              Tarifa Exclusiva
            </div>
            <div className="w-10 h-10 rounded-2xl bg-amber-500/20 text-amber-400 flex items-center justify-center mx-auto mb-3">
              <Tag className="w-5 h-5" />
            </div>
            <span className="text-xs uppercase font-bold text-slate-400 tracking-wider block mb-1">Cuota de Sostenimiento</span>
            <div className="flex items-center justify-center gap-2 mb-1">
              <span className="text-lg line-through text-slate-500 font-bold">$15/mes</span>
              <span className="text-3xl font-black text-amber-400">$7 <span className="text-base font-medium text-slate-300">USD/mes</span></span>
            </div>
            <p className="text-xs text-amber-300 font-semibold">
              Aporte mensual a tasa oficial BCV (sin sobreprecio).
            </p>
          </div>

          {/* Card 3: Inversión de Inicio */}
          <div className="bg-gradient-to-br from-slate-900 to-slate-950 border border-slate-800 rounded-3xl p-5 text-center shadow-xl">
            <div className="w-10 h-10 rounded-2xl bg-teal-500/20 text-teal-400 flex items-center justify-center mx-auto mb-3">
              <CheckCircle2 className="w-5 h-5" />
            </div>
            <span className="text-xs uppercase font-bold text-slate-400 tracking-wider block mb-1">Pago Inicial de Activación</span>
            <div className="flex items-center justify-center mb-1">
              <span className="text-3xl font-black text-white">$7 <span className="text-base font-medium text-slate-400">USD</span></span>
            </div>
            <p className="text-xs text-slate-300">
              Solo pagas tu primera mensualidad. Sin gastos ocultos ni matrículas.
            </p>
          </div>

        </div>

        {/* Content Layout: Left Form + Right Benefits & Visuals */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Left Column: Form (7 cols) */}
          <div className="lg:col-span-7 bg-slate-900/90 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl backdrop-blur-sm">
            
            <div className="flex items-center justify-between pb-4 border-b border-slate-800 mb-6">
              <div>
                <h2 className="text-lg font-black text-white flex items-center gap-2">
                  <HeartHandshake className="w-5 h-5 text-emerald-400" />
                  <span>Formulario de Activación Inmediata</span>
                </h2>
                <p className="text-xs text-slate-400 mt-0.5">
                  Completa los datos de tu establecimiento y reporta tu 1ª cuota mensual ($7 USD)
                </p>
              </div>

              {/* BCV Ticker Pill */}
              <div className="hidden sm:flex flex-col items-end">
                <span className="text-[10px] text-slate-400 uppercase font-semibold">Tasa Oficial BCV</span>
                <span className="text-xs font-mono font-bold text-emerald-400">
                  {bcvLoading ? 'Cargando...' : bcvRate ? `Bs. ${bcvRate.toFixed(2)}` : 'Oficial'}
                </span>
              </div>
            </div>

            {/* Error banner */}
            {errorMessage && (
              <div className="p-3.5 mb-5 rounded-xl bg-rose-950/80 border border-rose-800 text-rose-300 text-xs flex items-center gap-2 animate-shake">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{errorMessage}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              
              {/* Establishment / Business Name */}
              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1.5 flex items-center gap-1.5">
                  <Store className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Nombre del Establecimiento o Emprendimiento *</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="ej. Posada El Ensueño, Café Las Cumbres, Dulces Doña María..."
                  value={establishmentName}
                  onChange={(e) => setEstablishmentName(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-700 bg-slate-950 text-white text-xs placeholder:text-slate-500 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500"
                />
              </div>

              {/* Owner / Legal Representative */}
              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1.5 flex items-center gap-1.5">
                  <User className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Nombre del Propietario o Representante *</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="ej. Juan Carlos Pérez"
                  value={ownerName}
                  onChange={(e) => setOwnerName(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-700 bg-slate-950 text-white text-xs placeholder:text-slate-500 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500"
                />
              </div>

              {/* Grid: Email & Phone */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1.5 flex items-center gap-1.5">
                    <Mail className="w-3.5 h-3.5 text-emerald-400" />
                    <span>Correo Electrónico *</span>
                  </label>
                  <input
                    type="email"
                    required
                    placeholder="contacto@minogocio.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-700 bg-slate-950 text-white text-xs placeholder:text-slate-500 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500"
                  />
                  <span className="text-[10px] text-slate-400 mt-1 block">
                    Aquí recibirás tu certificado y código de agremiado.
                  </span>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1.5 flex items-center gap-1.5">
                    <Phone className="w-3.5 h-3.5 text-emerald-400" />
                    <span>Teléfono / WhatsApp *</span>
                  </label>
                  <input
                    type="tel"
                    required
                    placeholder="0414-1234567"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-700 bg-slate-950 text-white text-xs placeholder:text-slate-500 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500"
                  />
                </div>
              </div>

              {/* Grid: Category & Valley Sector */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1.5 flex items-center gap-1.5">
                    <ChefHat className="w-3.5 h-3.5 text-emerald-400" />
                    <span>Tipo de Negocio en la Ruta</span>
                  </label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-700 bg-slate-950 text-white text-xs focus:outline-none focus:border-emerald-500"
                  >
                    <option value="Restaurante / Bistró">Restaurante / Bistró / Comida Típica</option>
                    <option value="Posada / Hospedaje Turístico">Posada / Hospedaje Turístico</option>
                    <option value="Café / Pastelería / Repostería">Café / Pastelería / Chocolatería</option>
                    <option value="Experiencias / Tours / Recreación">Experiencias / Tours / Recreación</option>
                    <option value="Artesanía / Dulces Típicos">Artesanías / Dulces Típicos / Mermeladas</option>
                    <option value="Productor / Finca Agroturística">Productor Local / Finca Agroturística</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1.5 flex items-center gap-1.5">
                    <MapPin className="w-3.5 h-3.5 text-emerald-400" />
                    <span>Sector en El Valle</span>
                  </label>
                  <select
                    value={valleySector}
                    onChange={(e) => setValleySector(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-700 bg-slate-950 text-white text-xs focus:outline-none focus:border-emerald-500"
                  >
                    <option value="Sector El Playón">Sector El Playón</option>
                    <option value="Sector San Javier">Sector San Javier</option>
                    <option value="Sector Monterrey">Sector Monterrey</option>
                    <option value="Sector La Culata">Sector Páramo La Culata</option>
                    <option value="Sector El Vallecito">Sector El Vallecito</option>
                    <option value="Vuelta de Lola / Hoyada de Milla">Vuelta de Lola / Inicio El Valle</option>
                    <option value="Otro sector de la Cuenca El Valle">Otro sector de la Cuenca El Valle</option>
                  </select>
                </div>
              </div>

              {/* PAYMENT SECTION */}
              <div className="pt-4 border-t border-slate-800">
                
                <div className="flex items-center justify-between mb-3">
                  <div>
                    <span className="text-xs font-bold text-white uppercase tracking-wider block">
                      Reporte de Pago de la 1ª Mensualidad
                    </span>
                    <span className="text-[11px] text-slate-400">
                      Inscripción exonerada ($0) • Solo cancelas tus $7 USD
                    </span>
                  </div>

                  <div className="text-right">
                    <span className="text-[10px] uppercase font-bold text-slate-400 block">Total a Pagar</span>
                    <span className="font-mono text-base sm:text-lg font-black text-emerald-400 leading-none">
                      Bs. {calculatedBs} <span className="text-xs text-slate-400 font-normal">($7 USD)</span>
                    </span>
                  </div>
                </div>

                {/* Payment Tabs */}
                <div className="grid grid-cols-2 gap-2 mb-3">
                  <button
                    type="button"
                    onClick={() => setPaymentTab('pago-movil')}
                    className={`py-2 px-3 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-all ${
                      paymentTab === 'pago-movil'
                        ? 'bg-emerald-500 text-slate-950 shadow-md font-extrabold'
                        : 'bg-slate-950/70 text-slate-400 hover:text-white border border-slate-800'
                    }`}
                  >
                    <Smartphone className="w-3.5 h-3.5" />
                    <span>Pago Móvil Provincial</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setPaymentTab('transferencia')}
                    className={`py-2 px-3 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-all ${
                      paymentTab === 'transferencia'
                        ? 'bg-emerald-500 text-slate-950 shadow-md font-extrabold'
                        : 'bg-slate-950/70 text-slate-400 hover:text-white border border-slate-800'
                    }`}
                  >
                    <Building2 className="w-3.5 h-3.5" />
                    <span>Transferencia Provincial</span>
                  </button>
                </div>

                {/* Coordinates Details */}
                {paymentTab === 'pago-movil' ? (
                  <div className="bg-slate-950/80 border border-slate-800 rounded-2xl p-3.5 space-y-2 mb-4 animate-fadeIn text-xs">
                    <div className="flex items-center justify-between pb-1.5 border-b border-slate-800/80">
                      <span className="text-slate-400">Banco:</span>
                      <span className="font-bold text-white">{BANK_COORDINATES.pagoMovil.banco}</span>
                    </div>
                    <div className="flex items-center justify-between pb-1.5 border-b border-slate-800/80">
                      <span className="text-slate-400">Teléfono:</span>
                      <div className="flex items-center gap-1.5">
                        <span className="font-mono font-bold text-white">{BANK_COORDINATES.pagoMovil.telefono}</span>
                        <button
                          type="button"
                          onClick={() => handleCopy(BANK_COORDINATES.pagoMovil.telefonoRaw, 'pm-tel')}
                          className="p-1 rounded hover:bg-slate-800 text-slate-400 hover:text-emerald-400"
                        >
                          {copiedField === 'pm-tel' ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                        </button>
                      </div>
                    </div>
                    <div className="flex items-center justify-between pb-1.5 border-b border-slate-800/80">
                      <span className="text-slate-400">Cédula:</span>
                      <div className="flex items-center gap-1.5">
                        <span className="font-mono font-bold text-white">{BANK_COORDINATES.pagoMovil.cedula}</span>
                        <button
                          type="button"
                          onClick={() => handleCopy(BANK_COORDINATES.pagoMovil.cedula.replace('V-', ''), 'pm-ci')}
                          className="p-1 rounded hover:bg-slate-800 text-slate-400 hover:text-emerald-400"
                        >
                          {copiedField === 'pm-ci' ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                        </button>
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-slate-400">Titular:</span>
                      <span className="text-slate-300 font-medium">{BANK_COORDINATES.pagoMovil.titular}</span>
                    </div>

                    <div className="pt-2 flex justify-end">
                      <button
                        type="button"
                        onClick={() => copyAllBankInfo('pago-movil')}
                        className="text-[10px] text-emerald-400 hover:text-emerald-300 underline font-semibold"
                      >
                        {copiedField === 'pago-movil-all' ? '¡Datos de Pago Móvil Copiados!' : 'Copiar todos los datos de Pago Móvil'}
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="bg-slate-950/80 border border-slate-800 rounded-2xl p-3.5 space-y-2 mb-4 animate-fadeIn text-xs">
                    <div className="flex items-center justify-between pb-1.5 border-b border-slate-800/80">
                      <span className="text-slate-400">Banco:</span>
                      <span className="font-bold text-white">{BANK_COORDINATES.transferencia.banco}</span>
                    </div>
                    <div className="flex items-center justify-between pb-1.5 border-b border-slate-800/80">
                      <span className="text-slate-400">Número de Cuenta:</span>
                      <div className="flex items-center gap-1.5">
                        <span className="font-mono font-bold text-white text-[11px]">{BANK_COORDINATES.transferencia.numeroCuenta}</span>
                        <button
                          type="button"
                          onClick={() => handleCopy(BANK_COORDINATES.transferencia.numeroCuentaRaw, 'tr-cta')}
                          className="p-1 rounded hover:bg-slate-800 text-slate-400 hover:text-emerald-400"
                        >
                          {copiedField === 'tr-cta' ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                        </button>
                      </div>
                    </div>
                    <div className="flex items-center justify-between pb-1.5 border-b border-slate-800/80">
                      <span className="text-slate-400">Cédula Titular:</span>
                      <span className="font-mono font-bold text-white">{BANK_COORDINATES.transferencia.cedula}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-slate-400">Titular:</span>
                      <span className="text-slate-300 font-medium">{BANK_COORDINATES.transferencia.titular}</span>
                    </div>

                    <div className="pt-2 flex justify-end">
                      <button
                        type="button"
                        onClick={() => copyAllBankInfo('transferencia')}
                        className="text-[10px] text-emerald-400 hover:text-emerald-300 underline font-semibold"
                      >
                        {copiedField === 'transferencia-all' ? '¡Datos de Cuenta Copiados!' : 'Copiar datos de Cuenta Bancaria'}
                      </button>
                    </div>
                  </div>
                )}

                {/* Bank Reference Input */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-300 mb-1.5 flex items-center gap-1.5">
                      <CreditCard className="w-3.5 h-3.5 text-emerald-400" />
                      <span>Banco Emisor *</span>
                    </label>
                    <select
                      value={issuingBank}
                      onChange={(e) => setIssuingBank(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-700 bg-slate-950 text-white text-xs focus:outline-none focus:border-emerald-500"
                    >
                      <option value="Banco Provincial">Banco Provincial</option>
                      <option value="Banesco">Banesco</option>
                      <option value="Banco de Venezuela">Banco de Venezuela</option>
                      <option value="Mercantil">Mercantil</option>
                      <option value="Bancaribe">Bancaribe</option>
                      <option value="BNC">BNC</option>
                      <option value="Otro Banco">Otro Banco</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-300 mb-1.5 flex items-center gap-1.5">
                      <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
                      <span>Número de Referencia *</span>
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="ej. 849302 (últimos 6 u 8 dígitos)"
                      value={referenceNumber}
                      onChange={(e) => setReferenceNumber(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-700 bg-slate-950 text-white text-xs placeholder:text-slate-500 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 font-mono"
                    />
                  </div>
                </div>

              </div>

              {/* Submit Button */}
              <div className="pt-4">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-3.5 px-6 rounded-2xl font-black bg-gradient-to-r from-emerald-500 via-teal-500 to-amber-500 hover:from-emerald-400 hover:to-amber-400 text-slate-950 flex items-center justify-center gap-2 transition-all shadow-xl shadow-emerald-950/50 text-sm disabled:opacity-50 cursor-pointer"
                >
                  {isSubmitting ? (
                    <>
                      <div className="w-4 h-4 border-2 border-slate-950 border-t-transparent rounded-full animate-spin" />
                      <span>Registrando Afiliación de El Valle...</span>
                    </>
                  ) : (
                    <>
                      <span>Activar Afiliación "El Valle te Conecta" ($7 USD)</span>
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>

                <p className="text-[11px] text-slate-400 text-center mt-2 flex items-center justify-center gap-1.5">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Tu pago es verificado directamente por la Tesorería de la Cámara Gastronómica.</span>
                </p>
              </div>

            </form>

          </div>

          {/* Right Column: Visual Showcase & Benefits (5 cols) */}
          <div className="lg:col-span-5 space-y-6">
            
            {/* El Valle Images Carousel / Cards */}
            <div className="bg-slate-900/80 border border-slate-800 rounded-3xl p-5 shadow-xl space-y-4">
              
              <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                <div className="flex items-center gap-2">
                  <Compass className="w-4 h-4 text-emerald-400" />
                  <span className="text-xs font-bold text-white uppercase tracking-wider">
                    Ruta Turística El Valle
                  </span>
                </div>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-950 border border-emerald-700/60 text-emerald-300 font-semibold">
                  Mérida, Venezuela
                </span>
              </div>

              {/* Photos Gallery */}
              <div className="grid grid-cols-2 gap-3">
                <div className="group relative rounded-2xl overflow-hidden aspect-[4/5] bg-slate-950 border border-slate-800">
                  <img 
                    src="/images/el-valle/valle-paisaje.png" 
                    alt="Paisajes y Jardines de El Valle" 
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-transparent to-transparent flex items-end p-3">
                    <span className="text-[11px] font-bold text-white">Jardines & Senderos</span>
                  </div>
                </div>

                <div className="group relative rounded-2xl overflow-hidden aspect-[4/5] bg-slate-950 border border-slate-800">
                  <img 
                    src="/images/el-valle/valle-fullday.png" 
                    alt="Full Day El Valle te Conecta" 
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-transparent to-transparent flex items-end p-3">
                    <span className="text-[11px] font-bold text-white">Full Day & Montaña</span>
                  </div>
                </div>
              </div>

              <p className="text-xs text-slate-300 leading-relaxed italic">
                "Conectando la gastronomía de altura, posadas andinas y experiencias naturales en el circuito turístico más emblemático de Mérida."
              </p>
            </div>

            {/* Exclusive Membership Benefits */}
            <div className="bg-slate-900/80 border border-slate-800 rounded-3xl p-6 shadow-xl space-y-4">
              
              <h3 className="text-sm font-black text-white uppercase tracking-wider flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-amber-400" />
                <span>¿Qué obtienes como Agremiado?</span>
              </h3>

              <div className="space-y-3 text-xs">
                
                <div className="flex items-start gap-2.5">
                  <div className="w-5 h-5 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0 mt-0.5">
                    <Check className="w-3 h-3" />
                  </div>
                  <div>
                    <strong className="text-white block">Inscripción Exonerada (100% Gratis)</strong>
                    <span className="text-slate-400">Ahorro inmediato de $35 USD por ser parte del grupo El Valle te Conecta.</span>
                  </div>
                </div>

                <div className="flex items-start gap-2.5">
                  <div className="w-5 h-5 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0 mt-0.5">
                    <Check className="w-3 h-3" />
                  </div>
                  <div>
                    <strong className="text-white block">Tarifa Preferencial de $7/mes</strong>
                    <span className="text-slate-400">Cuota fija preferencial de sostenimiento gremial y asesoría legal.</span>
                  </div>
                </div>

                <div className="flex items-start gap-2.5">
                  <div className="w-5 h-5 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0 mt-0.5">
                    <Check className="w-3 h-3" />
                  </div>
                  <div>
                    <strong className="text-white block">Ficha en Guía Oficial & Mapa 3D LiDAR</strong>
                    <span className="text-slate-400">Tu posada o restaurante geolocalizado en la cartografía turística oficial de Mérida.</span>
                  </div>
                </div>

                <div className="flex items-start gap-2.5">
                  <div className="w-5 h-5 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0 mt-0.5">
                    <Check className="w-3 h-3" />
                  </div>
                  <div>
                    <strong className="text-white block">Co-promoción en Circuitos & Full Days</strong>
                    <span className="text-slate-400">Integración en las campañas turísticas conjuntas de El Valle te Conecta y la Cámara.</span>
                  </div>
                </div>

                <div className="flex items-start gap-2.5">
                  <div className="w-5 h-5 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0 mt-0.5">
                    <Check className="w-3 h-3" />
                  </div>
                  <div>
                    <strong className="text-white block">Respaldo Gremial e Institucional</strong>
                    <span className="text-slate-400">Representación ante CORMETUR, MINTUR, SENIAT, SAMAT y convenios de proveeduría.</span>
                  </div>
                </div>

              </div>

            </div>

            {/* Assistance Card */}
            <div className="p-4 rounded-2xl bg-gradient-to-r from-slate-900 to-slate-950 border border-slate-800 flex items-center justify-between text-xs">
              <div>
                <span className="text-white font-bold block">¿Dudas con tu registro?</span>
                <span className="text-slate-400 text-[11px]">Escríbenos directamente a la coordinación de la Cámara</span>
              </div>
              <a
                href="https://wa.me/584148817137?text=Hola,%20tengo%20una%20consulta%20sobre%20la%20afiliaci%C3%B3n%20especial%20de%20El%20Valle%20te%20Conecta"
                target="_blank"
                rel="noopener noreferrer"
                className="px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-[11px] flex items-center gap-1 shrink-0"
              >
                <span>WhatsApp</span>
                <ArrowRight className="w-3 h-3" />
              </a>
            </div>

          </div>

        </div>

      </div>

    </section>
  );
}
