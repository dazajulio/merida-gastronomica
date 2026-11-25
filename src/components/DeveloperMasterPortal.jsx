import React, { useState, useEffect } from 'react';
import { 
  ShieldCheck, 
  Terminal, 
  KeyRound, 
  Smartphone, 
  UserCheck, 
  Layers, 
  Settings, 
  Database, 
  Download, 
  Upload, 
  Eye, 
  EyeOff, 
  Lock, 
  Unlock, 
  AlertTriangle, 
  CheckCircle2, 
  RefreshCw, 
  Sparkles, 
  Tag, 
  DollarSign, 
  ExternalLink, 
  Trash2, 
  Plus, 
  Edit3, 
  Sliders, 
  Users, 
  Calendar, 
  Globe, 
  Activity, 
  LogOut, 
  ArrowRight,
  UtensilsCrossed,
  Clock,
  Compass,
  MessageSquare
} from 'lucide-react';

import { 
  DEV_DEFAULT_EMAIL, 
  DEV_DEFAULT_PASSWORD, 
  DEV_AUTH_SESSION_KEY, 
  verifyDevCredentials, 
  updateDevMasterPassword, 
  getDevMasterPassword, 
  getDevSystemConfig, 
  saveDevSystemConfig, 
  getDevAppConfig, 
  saveDevAppConfig, 
  startSimulationMode, 
  generatePlatformBackup, 
  restorePlatformBackup 
} from '../lib/developerSync';

import { BOARD_MEMBERS_DATA } from '../data/boardData';
import { INITIAL_DIRECTORY_DATA } from '../data/initialDirectoryData';
import { RESTAURANTS_DATA } from '../data/restaurantsData';
import { LaGuiaAdminTab } from './LaGuiaAdminTab';
import { saveUserCredentialsToSupabase } from '../lib/authCredentialsSync';

export function DeveloperMasterPortal({ onNavigate, onImpersonateAffiliate, onImpersonateBoardMember }) {
  // Estado de Autenticación Privada
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    if (typeof localStorage !== 'undefined') {
      return localStorage.getItem(DEV_AUTH_SESSION_KEY) === 'true';
    }
    return false;
  });

  // Credenciales de Login
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loginError, setLoginError] = useState('');
  const [isSubmittingLogin, setIsSubmittingLogin] = useState(false);

  // Tab Activo del Master Portal
  const [activeDevTab, setActiveDevTab] = useState('app_control'); // 'app_control' | 'simulation' | 'permissions' | 'catalog' | 'events' | 'system_flags' | 'backup' | 'credentials'

  // Configuración del Sistema & App Móvil
  const [systemConfig, setSystemConfig] = useState(getDevSystemConfig);
  const [appConfig, setAppConfig] = useState(getDevAppConfig);
  const [saveStatus, setSaveStatus] = useState('');

  // Modal para Cambiar Clave de Desarrollador
  const [isChangePassModalOpen, setIsChangePassModalOpen] = useState(false);
  const [newDevPass, setNewDevPass] = useState('');
  const [confirmDevPass, setConfirmDevPass] = useState('');
  const [passChangeError, setPassChangeError] = useState('');
  const [passChangeSuccess, setPassChangeSuccess] = useState('');

  // Gestor de Promociones de la App (Modal de Creación/Edición)
  const [isPromoModalOpen, setIsPromoModalOpen] = useState(false);
  const [editingPromo, setEditingPromo] = useState(null);
  const [promoFormData, setPromoFormData] = useState({
    title: '',
    restaurantName: '',
    badge: 'Jueves a Domingo',
    discountLabel: '15% OFF',
    condition: 'Válido en consumo local',
    photoUrl: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=600&q=80',
    ctaText: 'Ver detalles & Canjear'
  });

  // Modal de Reseteo Rápido de Clave de Usuario
  const [resetUserTarget, setResetUserTarget] = useState(null);
  const [userResetPassword, setUserResetPassword] = useState('');
  const [userResetStatus, setUserResetStatus] = useState('');

  // Guardar cambios automáticamente o notificar
  const notifySuccess = (msg) => {
    setSaveStatus(msg);
    setTimeout(() => setSaveStatus(''), 4000);
  };

  // Manejador de Login de Desarrollador
  const handleLogin = (e) => {
    e.preventDefault();
    setIsSubmittingLogin(true);
    setLoginError('');

    try {
      const isValid = verifyDevCredentials(loginEmail, loginPassword);
      if (isValid) {
        localStorage.setItem(DEV_AUTH_SESSION_KEY, 'true');
        setIsAuthenticated(true);
      } else {
        setLoginError('Credenciales incorrectas. Acceso estrictamente reservado al Desarrollador.');
      }
    } catch (err) {
      setLoginError('Error de autenticación técnica.');
    } finally {
      setIsSubmittingLogin(false);
    }
  };

  // Manejador de Cierre de Sesión
  const handleLogout = () => {
    localStorage.removeItem(DEV_AUTH_SESSION_KEY);
    setIsAuthenticated(false);
  };

  // Guardar Configuración de Sistema
  const handleSaveSystemConfig = (e) => {
    e?.preventDefault?.();
    saveDevSystemConfig(systemConfig);
    notifySuccess('✅ Configuración técnica del sistema guardada con éxito.');
  };

  // Guardar Configuración de la App Móvil
  const handleSaveAppConfig = (e) => {
    e?.preventDefault?.();
    saveDevAppConfig(appConfig);
    notifySuccess('✅ Configuración de la App Móvil sincronizada.');
  };

  // Toggle de Restaurante Destacado en Hero Móvil
  const handleToggleFeaturedRestaurant = (slug) => {
    setAppConfig(prev => {
      const exists = prev.featuredRestaurantSlugs.includes(slug);
      const updated = exists 
        ? prev.featuredRestaurantSlugs.filter(s => s !== slug)
        : [...prev.featuredRestaurantSlugs, slug];
      const newConf = { ...prev, featuredRestaurantSlugs: updated };
      saveDevAppConfig(newConf);
      return newConf;
    });
    notifySuccess('Actualizado restaurante en carrusel de la app.');
  };

  // Abrir modal para crear nueva promoción de la app
  const handleOpenNewPromo = () => {
    setEditingPromo(null);
    setPromoFormData({
      title: '',
      restaurantName: '',
      badge: 'Jueves a Sábado',
      discountLabel: '15% OFF',
      condition: 'Válido en mesa con mención de la App',
      photoUrl: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=600&q=80',
      ctaText: 'Ver detalles & Canjear'
    });
    setIsPromoModalOpen(true);
  };

  // Abrir modal para editar promoción existente
  const handleEditPromo = (promo) => {
    setEditingPromo(promo);
    setPromoFormData({
      title: promo.title || '',
      restaurantName: promo.restaurantName || '',
      badge: promo.badge || 'Todos los días',
      discountLabel: promo.discountLabel || '',
      condition: promo.condition || '',
      photoUrl: promo.photoUrl || '',
      ctaText: promo.ctaText || 'Ver detalles'
    });
    setIsPromoModalOpen(true);
  };

  // Guardar Promoción de la App
  const handleSavePromo = (e) => {
    e.preventDefault();
    if (!promoFormData.title || !promoFormData.restaurantName) {
      alert('El título y el restaurante son obligatorios.');
      return;
    }

    setAppConfig(prev => {
      let updatedPromos = [];
      if (editingPromo) {
        updatedPromos = prev.weeklyPromos.map(p => 
          p.id === editingPromo.id ? { ...p, ...promoFormData } : p
        );
      } else {
        const newPromo = {
          id: `promo-custom-${Date.now()}`,
          ...promoFormData
        };
        updatedPromos = [newPromo, ...prev.weeklyPromos];
      }
      const newConf = { ...prev, weeklyPromos: updatedPromos };
      saveDevAppConfig(newConf);
      return newConf;
    });

    setIsPromoModalOpen(false);
    notifySuccess(editingPromo ? 'Promoción actualizada con éxito.' : 'Nueva promoción añadida a la App.');
  };

  // Eliminar Promoción de la App
  const handleDeletePromo = (promoId) => {
    if (window.confirm('¿Seguro de que deseas eliminar esta promoción de la App?')) {
      setAppConfig(prev => {
        const updatedPromos = prev.weeklyPromos.filter(p => p.id !== promoId);
        const newConf = { ...prev, weeklyPromos: updatedPromos };
        saveDevAppConfig(newConf);
        return newConf;
      });
      notifySuccess('Promoción eliminada.');
    }
  };

  // Iniciar Simulación de Rol
  const handleStartSimulation = (type, member) => {
    startSimulationMode(type, member);
    if (type === 'board') {
      if (onImpersonateBoardMember) {
        onImpersonateBoardMember(member);
      } else if (onNavigate) {
        onNavigate('admin');
      }
    } else if (type === 'affiliate') {
      if (onImpersonateAffiliate) {
        onImpersonateAffiliate(member);
      } else if (onNavigate) {
        onNavigate('affiliates');
      }
    }
  };

  // Cambiar Contraseña del Desarrollador
  const handleChangeDevPassword = async (e) => {
    e.preventDefault();
    setPassChangeError('');
    setPassChangeSuccess('');

    if (newDevPass.length < 8) {
      setPassChangeError('La contraseña debe tener al menos 8 caracteres.');
      return;
    }
    if (newDevPass !== confirmDevPass) {
      setPassChangeError('Las contraseñas no coinciden.');
      return;
    }

    try {
      await updateDevMasterPassword(newDevPass);
      setPassChangeSuccess('¡Contraseña maestra actualizada con éxito!');
      setNewDevPass('');
      setConfirmDevPass('');
      setTimeout(() => {
        setIsChangePassModalOpen(false);
        setPassChangeSuccess('');
      }, 1500);
    } catch (err) {
      setPassChangeError(err.message || 'Error al actualizar contraseña.');
    }
  };

  // Reseteo de Contraseña de Usuario
  const handleResetUserPassword = async (e) => {
    e.preventDefault();
    if (!resetUserTarget || !userResetPassword || userResetPassword.length < 8) {
      setUserResetStatus('La clave debe tener mínimo 8 caracteres.');
      return;
    }

    try {
      const email = resetUserTarget.email || resetUserTarget.correo;
      const code = resetUserTarget.codigo_afiliado || resetUserTarget.id;
      const keys = [email, code, resetUserTarget.rif_cedula, resetUserTarget.ci].filter(Boolean);
      await saveUserCredentialsToSupabase(keys[0], userResetPassword, keys.slice(1));
      setUserResetStatus('✅ Contraseña restablecida correctamente.');
      setTimeout(() => {
        setResetUserTarget(null);
        setUserResetPassword('');
        setUserResetStatus('');
      }, 1800);
    } catch (err) {
      setUserResetStatus(`❌ Error: ${err.message}`);
    }
  };

  // Descargar Backup JSON
  const handleDownloadBackup = () => {
    const backup = generatePlatformBackup();
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(backup, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', `cgem-master-backup-${new Date().toISOString().slice(0, 10)}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
    notifySuccess('Respaldo JSON descargado correctamente.');
  };

  // Restaurar Backup JSON
  const handleUploadBackup = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result;
      if (typeof content === 'string') {
        const res = restorePlatformBackup(content);
        if (res.success) {
          alert('✅ Respaldo restaurado con éxito. Se recargarán las configuraciones.');
          setSystemConfig(getDevSystemConfig());
          setAppConfig(getDevAppConfig());
        } else {
          alert(`❌ ${res.message}`);
        }
      }
    };
    reader.readAsText(file);
  };

  // Purgar Cachés Locales
  const handlePurgeCache = () => {
    if (window.confirm('¿Deseas purgar cachés locales temporales y recargar datos de Supabase Cloud?')) {
      if (typeof localStorage !== 'undefined') {
        localStorage.removeItem('cgem_directorio_agremiados');
        localStorage.removeItem('cgem_vault_credentials_cache');
        localStorage.removeItem('cgem_board_permissions_v1');
      }
      alert('Cachés locales purgados. Se forzará la sincronización limpia.');
      window.location.reload();
    }
  };

  // =========================================================================
  // 1. PANTALLA DE ACCESO PRIVADO / TERMINAL DEL DESARROLLADOR
  // =========================================================================
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-[#181614] text-[#FAF7F2] flex items-center justify-center p-4 selection:bg-[#C85A32] selection:text-white relative overflow-hidden font-sans">
        {/* Luces ambientales de fondo */}
        <div className="absolute top-0 -left-40 w-96 h-96 bg-[#C85A32]/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 -right-40 w-96 h-96 bg-amber-600/10 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-md w-full bg-[#1E1C1A] border border-[#3E3832] rounded-3xl p-8 shadow-2xl relative z-10">
          
          <div className="text-center mb-8">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-[#C85A32] to-amber-700 p-0.5 mx-auto mb-4 shadow-lg shadow-[#C85A32]/20 flex items-center justify-center">
              <div className="w-full h-full bg-[#1E1C1A] rounded-[0.9rem] flex items-center justify-center">
                <Terminal className="w-8 h-8 text-[#FF7A45]" />
              </div>
            </div>

            <span className="text-[10px] font-bold uppercase tracking-[0.25em] text-[#FF8A50] block mb-1">
              Terminal de Control Maestro
            </span>
            <h1 className="font-serif text-2xl font-bold text-white tracking-tight">
              Portal del Desarrollador
            </h1>
            <p className="text-xs text-stone-400 mt-2 max-w-xs mx-auto leading-relaxed">
              Propiedad técnica & control total de la infraestructura de Mérida Gastronómica.
            </p>
          </div>

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-[11px] font-bold uppercase tracking-wider text-stone-300 mb-1.5">
                Usuario / Correo Propietario
              </label>
              <div className="relative">
                <input
                  type="text"
                  required
                  value={loginEmail}
                  onChange={(e) => setLoginEmail(e.target.value)}
                  placeholder="dazajulio@gmail.com"
                  className="w-full bg-[#292420] border border-[#443B33] focus:border-[#C85A32] text-white rounded-xl px-4 py-3 text-sm outline-none transition-colors placeholder:text-stone-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-[11px] font-bold uppercase tracking-wider text-stone-300 mb-1.5">
                Contraseña Maestra
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={loginPassword}
                  onChange={(e) => setLoginPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full bg-[#292420] border border-[#443B33] focus:border-[#C85A32] text-white rounded-xl px-4 py-3 text-sm outline-none transition-colors placeholder:text-stone-500 pr-11"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-400 hover:text-white p-1"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              <p className="text-[10px] text-stone-500 mt-1">
                Clave por defecto preconfigurada: <code className="text-stone-300 font-mono">dafaca10</code>
              </p>
            </div>

            {loginError && (
              <div className="p-3 rounded-xl bg-red-950/50 border border-red-800/80 text-red-200 text-xs flex items-center gap-2 animate-fadeIn">
                <AlertTriangle className="w-4 h-4 text-red-400 shrink-0" />
                <span>{loginError}</span>
              </div>
            )}

            <button
              type="submit"
              disabled={isSubmittingLogin}
              className="w-full py-3.5 px-4 rounded-xl bg-[#C85A32] hover:bg-[#B34E29] active:scale-98 text-white font-bold text-sm tracking-wide shadow-lg shadow-[#C85A32]/30 transition-all flex items-center justify-center gap-2 cursor-pointer mt-2"
            >
              <ShieldCheck className="w-4 h-4" />
              <span>{isSubmittingLogin ? 'Verificando...' : 'Acceder al Master Control'}</span>
            </button>
          </form>

          <div className="mt-8 pt-6 border-t border-[#332C26] text-center">
            <span className="text-[10px] text-stone-500 uppercase tracking-widest block">
              Sin enlace público • Acceso directo restringido
            </span>
            <button
              onClick={() => onNavigate ? onNavigate('home') : (window.location.href = '/')}
              className="text-xs text-stone-400 hover:text-[#FF8A50] transition-colors mt-2 inline-flex items-center gap-1 cursor-pointer"
            >
              <span>← Volver al sitio público</span>
            </button>
          </div>

        </div>
      </div>
    );
  }

  // =========================================================================
  // 2. SHELL MAESTRO DEL DESARROLLADOR
  // =========================================================================
  return (
    <div className="min-h-screen bg-[#FAF7F2] text-[#1E1C1A] font-sans selection:bg-[#C85A32] selection:text-white pb-24">
      
      {/* 2.1 HEADER FIJO DE CONTROL MAESTRO */}
      <header className="sticky top-0 z-40 bg-[#1C1917] text-white border-b border-[#332C26] shadow-xl">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3 flex flex-wrap items-center justify-between gap-4">
          
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#C85A32] to-amber-700 p-0.5 flex items-center justify-center shadow-md shadow-[#C85A32]/30">
              <div className="w-full h-full bg-[#1C1917] rounded-[0.6rem] flex items-center justify-center">
                <Terminal className="w-5 h-5 text-[#FF8A50]" />
              </div>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-serif font-bold text-base tracking-tight text-white">
                  Mérida Gastronómica
                </span>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#C85A32] text-white tracking-wider uppercase">
                  MASTER DEV
                </span>
              </div>
              <p className="text-[11px] text-stone-400 font-mono">
                Propiedad & Infraestructura Técnica • dazajulio@gmail.com
              </p>
            </div>
          </div>

          {/* Acciones Rápidas del Header */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => setActiveDevTab('simulation')}
              className="py-1.5 px-3 rounded-lg bg-[#2E2824] hover:bg-[#3D352F] text-amber-300 border border-amber-600/30 text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
              title="Entrar como Agremiado o Directivo para auditar la web"
            >
              <UserCheck className="w-3.5 h-3.5 text-amber-400" />
              <span>Modo Simulación</span>
            </button>

            <button
              onClick={handleDownloadBackup}
              className="py-1.5 px-3 rounded-lg bg-[#2E2824] hover:bg-[#3D352F] text-stone-200 border border-white/10 text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
              title="Exportar respaldo de configuraciones en JSON"
            >
              <Download className="w-3.5 h-3.5 text-emerald-400" />
              <span className="hidden sm:inline">Backup JSON</span>
            </button>

            <button
              onClick={() => setIsChangePassModalOpen(true)}
              className="py-1.5 px-3 rounded-lg bg-[#2E2824] hover:bg-[#3D352F] text-stone-200 border border-white/10 text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
              title="Cambiar contraseña maestra de desarrollador"
            >
              <KeyRound className="w-3.5 h-3.5 text-sky-400" />
              <span className="hidden sm:inline">Mi Clave</span>
            </button>

            <button
              onClick={handleLogout}
              className="py-1.5 px-3 rounded-lg bg-red-950/60 hover:bg-red-900 text-red-200 border border-red-800/40 text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
              title="Cerrar Sesión de Desarrollador"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Salir</span>
            </button>
          </div>

        </div>

        {/* 2.2 BARRA DE NAVEGACIÓN DE PESTAÑAS TÉCNICAS */}
        <div className="border-t border-[#2B2521] bg-[#141210] px-4 sm:px-6">
          <div className="max-w-7xl mx-auto flex items-center gap-1 overflow-x-auto no-scrollbar py-2">
            
            <button
              onClick={() => setActiveDevTab('app_control')}
              className={`py-2 px-3.5 rounded-xl text-xs font-semibold whitespace-nowrap flex items-center gap-2 transition-all cursor-pointer ${
                activeDevTab === 'app_control'
                  ? 'bg-[#C85A32] text-white shadow-md shadow-[#C85A32]/30'
                  : 'text-stone-400 hover:text-white hover:bg-white/5'
              }`}
            >
              <Smartphone className="w-3.5 h-3.5" />
              <span>Control App Móvil</span>
            </button>

            <button
              onClick={() => setActiveDevTab('simulation')}
              className={`py-2 px-3.5 rounded-xl text-xs font-semibold whitespace-nowrap flex items-center gap-2 transition-all cursor-pointer ${
                activeDevTab === 'simulation'
                  ? 'bg-amber-600 text-white shadow-md shadow-amber-600/30'
                  : 'text-stone-400 hover:text-white hover:bg-white/5'
              }`}
            >
              <UserCheck className="w-3.5 h-3.5" />
              <span>Ghost Mode (Suplantar)</span>
            </button>

            <button
              onClick={() => setActiveDevTab('permissions')}
              className={`py-2 px-3.5 rounded-xl text-xs font-semibold whitespace-nowrap flex items-center gap-2 transition-all cursor-pointer ${
                activeDevTab === 'permissions'
                  ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30'
                  : 'text-stone-400 hover:text-white hover:bg-white/5'
              }`}
            >
              <Sliders className="w-3.5 h-3.5" />
              <span>Permisos & Cuentas</span>
            </button>

            <button
              onClick={() => setActiveDevTab('catalog')}
              className={`py-2 px-3.5 rounded-xl text-xs font-semibold whitespace-nowrap flex items-center gap-2 transition-all cursor-pointer ${
                activeDevTab === 'catalog'
                  ? 'bg-emerald-700 text-white shadow-md shadow-emerald-700/30'
                  : 'text-stone-400 hover:text-white hover:bg-white/5'
              }`}
            >
              <UtensilsCrossed className="w-3.5 h-3.5" />
              <span>La Guía (Prestadores)</span>
            </button>

            <button
              onClick={() => setActiveDevTab('system_flags')}
              className={`py-2 px-3.5 rounded-xl text-xs font-semibold whitespace-nowrap flex items-center gap-2 transition-all cursor-pointer ${
                activeDevTab === 'system_flags'
                  ? 'bg-stone-700 text-white shadow-md'
                  : 'text-stone-400 hover:text-white hover:bg-white/5'
              }`}
            >
              <Settings className="w-3.5 h-3.5" />
              <span>Configuración Global</span>
            </button>

            <button
              onClick={() => setActiveDevTab('backup')}
              className={`py-2 px-3.5 rounded-xl text-xs font-semibold whitespace-nowrap flex items-center gap-2 transition-all cursor-pointer ${
                activeDevTab === 'backup'
                  ? 'bg-cyan-700 text-white shadow-md'
                  : 'text-stone-400 hover:text-white hover:bg-white/5'
              }`}
            >
              <Database className="w-3.5 h-3.5" />
              <span>Respaldos & BD</span>
            </button>

          </div>
        </div>
      </header>

      {/* Banner de Estado / Notificación */}
      {saveStatus && (
        <div className="bg-emerald-600 text-white py-2 px-4 text-center text-xs font-bold animate-fadeIn shadow-sm">
          {saveStatus}
        </div>
      )}

      {/* 2.3 CONTENIDO PRINCIPAL POR PESTAÑAS */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
        
        {/* =================================================================== */}
        {/* TAB 1: CONTROL TOTAL DE LA APP MÓVIL (/app)                         */}
        {/* =================================================================== */}
        {activeDevTab === 'app_control' && (
          <div className="space-y-8 animate-fadeIn">
            
            {/* Cabecera de la sección */}
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#EAE3D5] shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
              <div>
                <span className="text-[11px] font-bold uppercase tracking-[0.2em] text-[#C85A32] block mb-1">
                  Módulo de Personalización Exclusiva
                </span>
                <h2 className="font-serif text-2xl font-bold text-[#1E1C1A]">
                  Control Técnico de la App Móvil
                </h2>
                <p className="text-xs text-[#5C554E] mt-1">
                  Configura tarifas, marcas patrocinadas, destacados del carrusel, promociones y redireccionamientos.
                </p>
              </div>

              <div className="flex items-center gap-3">
                <a
                  href="/app"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="py-2.5 px-4 rounded-xl bg-[#FAF3EB] hover:bg-[#F2ECE1] text-[#C85A32] border border-[#EAE3D5] text-xs font-bold flex items-center gap-1.5 transition-colors"
                >
                  <ExternalLink className="w-4 h-4" />
                  <span>Ver App en Vivo</span>
                </a>
                <button
                  onClick={handleSaveAppConfig}
                  className="py-2.5 px-5 rounded-xl bg-[#C85A32] hover:bg-[#B34E29] text-white text-xs font-bold shadow-md shadow-[#C85A32]/20 flex items-center gap-2 cursor-pointer"
                >
                  <SaveIcon className="w-4 h-4" />
                  <span>Guardar Cambios</span>
                </button>
              </div>
            </div>

            {/* Sub-bloque A: Restaurantes Destacados en el Carrusel Superior de la App */}
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#EAE3D5] shadow-sm">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="font-serif text-lg font-bold text-[#1E1C1A]">
                    ⭐ Posicionamiento de Marcas en Carrusel Superior
                  </h3>
                  <p className="text-xs text-[#5C554E]">
                    Selecciona qué restaurantes aparecen destacados con foto grande en la pantalla principal de la App.
                  </p>
                </div>
                <span className="text-xs font-bold px-3 py-1 rounded-full bg-[#FAF3EB] text-[#C85A32] border border-[#EAE3D5]">
                  {appConfig.featuredRestaurantSlugs?.length || 0} Activos
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 mt-4">
                {RESTAURANTS_DATA.map((rest) => {
                  const isFeatured = appConfig.featuredRestaurantSlugs?.includes(rest.slug || rest.id);
                  return (
                    <div
                      key={rest.id}
                      onClick={() => handleToggleFeaturedRestaurant(rest.slug || rest.id)}
                      className={`p-3 rounded-2xl border transition-all cursor-pointer flex items-center justify-between gap-3 ${
                        isFeatured
                          ? 'bg-[#FAF3EB] border-[#C85A32] shadow-xs'
                          : 'bg-white border-[#EAE3D5] hover:border-stone-400 opacity-70'
                      }`}
                    >
                      <div className="flex items-center gap-2.5 min-w-0">
                        <img 
                          src={rest.image} 
                          alt={rest.name} 
                          className="w-10 h-10 rounded-xl object-cover shrink-0" 
                        />
                        <div className="min-w-0">
                          <p className="text-xs font-bold text-[#1E1C1A] truncate">{rest.name}</p>
                          <span className="text-[10px] text-[#5C554E] block truncate">{rest.zone || rest.cuisine}</span>
                        </div>
                      </div>
                      <span className={`text-[11px] font-bold px-2 py-0.5 rounded-full ${
                        isFeatured ? 'bg-[#C85A32] text-white' : 'bg-stone-200 text-stone-600'
                      }`}>
                        {isFeatured ? 'Destacado' : 'Normal'}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Sub-bloque B: Gestor de Planes & Promociones Semanales */}
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#EAE3D5] shadow-sm">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-6">
                <div>
                  <h3 className="font-serif text-lg font-bold text-[#1E1C1A]">
                    🏷️ Promociones Semanales Activas en la App
                  </h3>
                  <p className="text-xs text-[#5C554E]">
                    Controla las ofertas, 2x1 y descuentos que ven los comensales merideños en la pestaña "Promos".
                  </p>
                </div>
                <button
                  onClick={handleOpenNewPromo}
                  className="py-2 px-4 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold flex items-center gap-1.5 shadow-sm cursor-pointer"
                >
                  <Plus className="w-4 h-4" />
                  <span>Crear Nueva Promo</span>
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {(appConfig.weeklyPromos || []).map((promo) => (
                  <div key={promo.id} className="rounded-2xl border border-[#EAE3D5] bg-[#FAF7F2] p-4 flex flex-col justify-between shadow-2xs">
                    <div>
                      <div className="flex items-center justify-between gap-2 mb-2">
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-[#C85A32]/10 text-[#C85A32] border border-[#C85A32]/20">
                          {promo.badge || 'Vigente'}
                        </span>
                        {promo.discountLabel && (
                          <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-red-100 text-red-700">
                            {promo.discountLabel}
                          </span>
                        )}
                      </div>
                      <h4 className="font-bold text-sm text-[#1E1C1A] leading-snug">{promo.title}</h4>
                      <p className="text-xs text-[#C85A32] font-semibold mt-1">{promo.restaurantName}</p>
                      {promo.condition && (
                        <p className="text-[11px] text-[#5C554E] mt-1 italic">{promo.condition}</p>
                      )}
                    </div>

                    <div className="mt-4 pt-3 border-t border-[#EAE3D5] flex items-center justify-between gap-2">
                      <span className="text-[10px] text-stone-400 font-mono">ID: {promo.id.slice(0, 14)}</span>
                      <div className="flex items-center gap-1.5">
                        <button
                          onClick={() => handleEditPromo(promo)}
                          className="p-1.5 rounded-lg bg-white hover:bg-amber-100 text-stone-700 hover:text-amber-800 border border-[#EAE3D5] transition-colors"
                          title="Editar"
                        >
                          <Edit3 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => handleDeletePromo(promo.id)}
                          className="p-1.5 rounded-lg bg-white hover:bg-red-100 text-stone-700 hover:text-red-700 border border-[#EAE3D5] transition-colors"
                          title="Eliminar"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Sub-bloque C: Tarifas Oficiales & Costos de Publicidad */}
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#EAE3D5] shadow-sm">
              <h3 className="font-serif text-lg font-bold text-[#1E1C1A] mb-1">
                💰 Tarifas Gremiales & Precios de Publicidad en App
              </h3>
              <p className="text-xs text-[#5C554E] mb-6">
                Fija los montos oficiales de afiliación y las tarifas de pauta comercial para restaurantes en la app.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
                <div className="p-4 rounded-2xl bg-[#FAF7F2] border border-[#EAE3D5]">
                  <label className="text-[11px] font-bold text-stone-600 block mb-1">Cuota Mensual Agremiado</label>
                  <div className="flex items-center gap-1">
                    <span className="text-sm font-bold text-[#C85A32]">$</span>
                    <input
                      type="number"
                      value={appConfig.membershipFeeUSD}
                      onChange={(e) => setAppConfig({ ...appConfig, membershipFeeUSD: Number(e.target.value) })}
                      className="w-full bg-white border border-[#EAE3D5] rounded-lg px-2.5 py-1.5 font-bold text-base outline-none text-[#1E1C1A]"
                    />
                    <span className="text-xs text-stone-500">USD</span>
                  </div>
                </div>

                <div className="p-4 rounded-2xl bg-[#FAF7F2] border border-[#EAE3D5]">
                  <label className="text-[11px] font-bold text-stone-600 block mb-1">Inscripción Única Inicial</label>
                  <div className="flex items-center gap-1">
                    <span className="text-sm font-bold text-[#C85A32]">$</span>
                    <input
                      type="number"
                      value={appConfig.inscriptionFeeUSD}
                      onChange={(e) => setAppConfig({ ...appConfig, inscriptionFeeUSD: Number(e.target.value) })}
                      className="w-full bg-white border border-[#EAE3D5] rounded-lg px-2.5 py-1.5 font-bold text-base outline-none text-[#1E1C1A]"
                    />
                    <span className="text-xs text-stone-500">USD</span>
                  </div>
                </div>

                <div className="p-4 rounded-2xl bg-[#FAF7F2] border border-[#EAE3D5]">
                  <label className="text-[11px] font-bold text-stone-600 block mb-1">Pauta Banner Hero (Mensual)</label>
                  <div className="flex items-center gap-1">
                    <span className="text-sm font-bold text-[#C85A32]">$</span>
                    <input
                      type="number"
                      value={appConfig.adPricing?.heroBannerUSD || 40}
                      onChange={(e) => setAppConfig({ 
                        ...appConfig, 
                        adPricing: { ...appConfig.adPricing, heroBannerUSD: Number(e.target.value) } 
                      })}
                      className="w-full bg-white border border-[#EAE3D5] rounded-lg px-2.5 py-1.5 font-bold text-base outline-none text-[#1E1C1A]"
                    />
                    <span className="text-xs text-stone-500">USD</span>
                  </div>
                </div>

                <div className="p-4 rounded-2xl bg-[#FAF7F2] border border-[#EAE3D5]">
                  <label className="text-[11px] font-bold text-stone-600 block mb-1">Mención Promo Spotlight</label>
                  <div className="flex items-center gap-1">
                    <span className="text-sm font-bold text-[#C85A32]">$</span>
                    <input
                      type="number"
                      value={appConfig.adPricing?.promoSpotlightUSD || 15}
                      onChange={(e) => setAppConfig({ 
                        ...appConfig, 
                        adPricing: { ...appConfig.adPricing, promoSpotlightUSD: Number(e.target.value) } 
                      })}
                      className="w-full bg-white border border-[#EAE3D5] rounded-lg px-2.5 py-1.5 font-bold text-base outline-none text-[#1E1C1A]"
                    />
                    <span className="text-xs text-stone-500">USD</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Sub-bloque D: Enlaces Oficiales, Redireccionamientos y Store */}
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#EAE3D5] shadow-sm">
              <h3 className="font-serif text-lg font-bold text-[#1E1C1A] mb-1">
                🔗 Enlaces & Redireccionamientos de la App
              </h3>
              <p className="text-xs text-[#5C554E] mb-6">
                Define a dónde apuntan las descargas y el WhatsApp de Concierge / Soporte oficial.
              </p>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="text-[11px] font-bold text-stone-600 block mb-1">Google Play Store URL</label>
                  <input
                    type="url"
                    value={systemConfig.playStoreUrl}
                    onChange={(e) => setSystemConfig({ ...systemConfig, playStoreUrl: e.target.value })}
                    className="w-full bg-[#FAF7F2] border border-[#EAE3D5] rounded-xl px-3.5 py-2 text-xs text-[#1E1C1A] outline-none font-mono"
                  />
                </div>

                <div>
                  <label className="text-[11px] font-bold text-stone-600 block mb-1">Descarga Directa APK</label>
                  <input
                    type="url"
                    value={systemConfig.apkDownloadUrl}
                    onChange={(e) => setSystemConfig({ ...systemConfig, apkDownloadUrl: e.target.value })}
                    className="w-full bg-[#FAF7F2] border border-[#EAE3D5] rounded-xl px-3.5 py-2 text-xs text-[#1E1C1A] outline-none font-mono"
                  />
                </div>

                <div>
                  <label className="text-[11px] font-bold text-stone-600 block mb-1">WhatsApp Concierge / Soporte</label>
                  <input
                    type="text"
                    value={systemConfig.conciergeWhatsApp}
                    onChange={(e) => setSystemConfig({ ...systemConfig, conciergeWhatsApp: e.target.value })}
                    className="w-full bg-[#FAF7F2] border border-[#EAE3D5] rounded-xl px-3.5 py-2 text-xs text-[#1E1C1A] outline-none font-mono"
                  />
                </div>
              </div>
            </div>

          </div>
        )}

        {/* =================================================================== */}
        {/* TAB 2: MODO SIMULACIÓN / GHOST MODE (AUDITORÍA TOTAL DE ROLES)      */}
        {/* =================================================================== */}
        {activeDevTab === 'simulation' && (
          <div className="space-y-8 animate-fadeIn">
            
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#EAE3D5] shadow-sm">
              <span className="text-[11px] font-bold uppercase tracking-[0.2em] text-amber-700 block mb-1">
                Herramienta Maestra de Auditoría
              </span>
              <h2 className="font-serif text-2xl font-bold text-[#1E1C1A]">
                🎭 Modo Simulación / Suplantación (Ghost Mode)
              </h2>
              <p className="text-xs text-[#5C554E] mt-1 max-w-2xl leading-relaxed">
                Ingresa a la plataforma con 1 solo clic en la vista exacta de cualquier cargo directivo o agremiado. 
                Podrás comprobar qué botones ven, qué permisos tienen y cómo interactúan, manteniendo una barra flotante para regresar de inmediato a este Master Control.
              </p>
            </div>

            {/* Suplantar Cargos de Junta Directiva */}
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#EAE3D5] shadow-sm">
              <h3 className="font-serif text-lg font-bold text-[#1E1C1A] mb-1">
                🏛️ Simular como Cargo de la Junta Directiva
              </h3>
              <p className="text-xs text-[#5C554E] mb-4">
                Elige un directivo para ingresar a su portal administrativo en <code className="text-[#C85A32]">/admin</code>:
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                {BOARD_MEMBERS_DATA.map((member) => (
                  <div
                    key={member.id}
                    className="p-4 rounded-2xl border border-[#EAE3D5] bg-[#FAF7F2] hover:bg-white hover:border-amber-400 transition-all flex items-center justify-between gap-3 shadow-2xs"
                  >
                    <div className="min-w-0">
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-amber-100 text-amber-900 inline-block mb-1">
                        {member.role}
                      </span>
                      <p className="text-xs font-bold text-[#1E1C1A] truncate">{member.name}</p>
                      <p className="text-[10px] text-stone-500 font-mono truncate">{member.email}</p>
                    </div>

                    <button
                      onClick={() => handleStartSimulation('board', member)}
                      className="py-1.5 px-3 rounded-xl bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold shrink-0 shadow-xs flex items-center gap-1 cursor-pointer"
                    >
                      <span>Simular</span>
                      <ArrowRight className="w-3 h-3" />
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* Suplantar Agremiados Reales */}
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#EAE3D5] shadow-sm">
              <h3 className="font-serif text-lg font-bold text-[#1E1C1A] mb-1">
                🍽️ Simular como Agremiado Oficial
              </h3>
              <p className="text-xs text-[#5C554E] mb-4">
                Ingresa a la ficha de autogestión de cualquier agremiado en <code className="text-[#C85A32]">/afiliacion</code>:
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                {INITIAL_DIRECTORY_DATA.map((member) => (
                  <div
                    key={member.id}
                    className="p-4 rounded-2xl border border-[#EAE3D5] bg-[#FAF7F2] hover:bg-white hover:border-[#C85A32] transition-all flex items-center justify-between gap-3 shadow-2xs"
                  >
                    <div className="min-w-0">
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-[#FAF3EB] text-[#C85A32] inline-block mb-1">
                        {member.codigo_afiliado}
                      </span>
                      <p className="text-xs font-bold text-[#1E1C1A] truncate">{member.nombre_establecimiento}</p>
                      <p className="text-[10px] text-stone-500 truncate">{member.representante_legal}</p>
                    </div>

                    <button
                      onClick={() => handleStartSimulation('affiliate', member)}
                      className="py-1.5 px-3 rounded-xl bg-[#C85A32] hover:bg-[#B34E29] text-white text-xs font-bold shrink-0 shadow-xs flex items-center gap-1 cursor-pointer"
                    >
                      <span>Ver Ficha</span>
                      <ArrowRight className="w-3 h-3" />
                    </button>
                  </div>
                ))}
              </div>
            </div>

          </div>
        )}

        {/* =================================================================== */}
        {/* TAB 3: MATRIZ DE PERMISOS & RESETEO DE CLAVES                      */}
        {/* =================================================================== */}
        {activeDevTab === 'permissions' && (
          <div className="space-y-8 animate-fadeIn">
            
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#EAE3D5] shadow-sm">
              <span className="text-[11px] font-bold uppercase tracking-[0.2em] text-indigo-700 block mb-1">
                Seguridad & Control de Identidad
              </span>
              <h2 className="font-serif text-2xl font-bold text-[#1E1C1A]">
                Gestión de Permisos & Credenciales
              </h2>
              <p className="text-xs text-[#5C554E] mt-1">
                Restablece contraseñas y audita los accesos de directivos y agremiados sin intermediarios.
              </p>
            </div>

            {/* Listado de Directivos con opción de resetear clave */}
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#EAE3D5] shadow-sm">
              <h3 className="font-serif text-lg font-bold text-[#1E1C1A] mb-4">
                Directorio de Junta Directiva
              </h3>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead>
                    <tr className="border-b border-[#EAE3D5] text-[#5C554E] font-bold uppercase tracking-wider text-[10px]">
                      <th className="py-3 px-3">Cargo</th>
                      <th className="py-3 px-3">Nombre</th>
                      <th className="py-3 px-3">Correo</th>
                      <th className="py-3 px-3">Nivel Admin</th>
                      <th className="py-3 px-3 text-right">Acción Clave</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#EAE3D5]">
                    {BOARD_MEMBERS_DATA.map((member) => (
                      <tr key={member.id} className="hover:bg-[#FAF7F2]">
                        <td className="py-3 px-3 font-bold text-[#C85A32]">{member.role}</td>
                        <td className="py-3 px-3 font-semibold text-[#1E1C1A]">{member.name}</td>
                        <td className="py-3 px-3 text-stone-500 font-mono">{member.email}</td>
                        <td className="py-3 px-3">
                          <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                            member.isAdminLevel ? 'bg-indigo-100 text-indigo-800' : 'bg-stone-200 text-stone-700'
                          }`}>
                            {member.isAdminLevel ? 'Full Directiva' : 'Coordinación'}
                          </span>
                        </td>
                        <td className="py-3 px-3 text-right">
                          <button
                            onClick={() => {
                              setResetUserTarget(member);
                              setUserResetPassword('');
                              setUserResetStatus('');
                            }}
                            className="py-1 px-2.5 rounded-lg bg-stone-100 hover:bg-stone-200 text-stone-800 text-[11px] font-bold border border-stone-300 transition-colors cursor-pointer"
                          >
                            Reset Clave
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Listado de Agremiados con opción de resetear clave */}
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#EAE3D5] shadow-sm">
              <h3 className="font-serif text-lg font-bold text-[#1E1C1A] mb-4">
                Directorio de Agremiados Oficiales
              </h3>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead>
                    <tr className="border-b border-[#EAE3D5] text-[#5C554E] font-bold uppercase tracking-wider text-[10px]">
                      <th className="py-3 px-3">Código</th>
                      <th className="py-3 px-3">Establecimiento</th>
                      <th className="py-3 px-3">Representante</th>
                      <th className="py-3 px-3">Estatus</th>
                      <th className="py-3 px-3 text-right">Acción Clave</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#EAE3D5]">
                    {INITIAL_DIRECTORY_DATA.map((member) => (
                      <tr key={member.id} className="hover:bg-[#FAF7F2]">
                        <td className="py-3 px-3 font-mono font-bold text-[#C85A32]">{member.codigo_afiliado}</td>
                        <td className="py-3 px-3 font-semibold text-[#1E1C1A]">{member.nombre_establecimiento}</td>
                        <td className="py-3 px-3 text-stone-500">{member.representante_legal}</td>
                        <td className="py-3 px-3">
                          <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800">
                            {member.estado_solvencia || 'Solvente'}
                          </span>
                        </td>
                        <td className="py-3 px-3 text-right">
                          <button
                            onClick={() => {
                              setResetUserTarget(member);
                              setUserResetPassword('');
                              setUserResetStatus('');
                            }}
                            className="py-1 px-2.5 rounded-lg bg-stone-100 hover:bg-stone-200 text-stone-800 text-[11px] font-bold border border-stone-300 transition-colors cursor-pointer"
                          >
                            Reset Clave
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

          </div>
        )}

        {/* =================================================================== */}
        {/* TAB 4: CRUD TOTAL DE PRESTADORES Y LA GUÍA                         */}
        {/* =================================================================== */}
        {activeDevTab === 'catalog' && (
          <div className="space-y-6 animate-fadeIn">
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#EAE3D5] shadow-sm">
              <span className="text-[11px] font-bold uppercase tracking-[0.2em] text-emerald-700 block mb-1">
                Catálogo Oficial & Guía del Visitante
              </span>
              <h2 className="font-serif text-2xl font-bold text-[#1E1C1A]">
                Gestión en Tiempo Real de Prestadores & Secciones
              </h2>
              <p className="text-xs text-[#5C554E] mt-1">
                Añade, edita fotos, teléfonos, coordenadas y visibilidad de los prestadores en cualquiera de las 8 categorías oficiales.
              </p>
            </div>

            {/* Embebido directo del componente de administración de la guía */}
            <div className="bg-white rounded-3xl p-2 sm:p-6 border border-[#EAE3D5] shadow-sm">
              <LaGuiaAdminTab />
            </div>
          </div>
        )}

        {/* =================================================================== */}
        {/* TAB 5: CONFIGURACIÓN GLOBAL & FEATURE FLAGS                         */}
        {/* =================================================================== */}
        {activeDevTab === 'system_flags' && (
          <div className="space-y-8 animate-fadeIn">
            
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#EAE3D5] shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
              <div>
                <span className="text-[11px] font-bold uppercase tracking-[0.2em] text-stone-600 block mb-1">
                  Parámetros Técnicos
                </span>
                <h2 className="font-serif text-2xl font-bold text-[#1E1C1A]">
                  Configuración Global & Interruptores (Feature Flags)
                </h2>
                <p className="text-xs text-[#5C554E] mt-1">
                  Controla la disponibilidad de funciones, tasa de cambio y estado de mantenimiento del sitio.
                </p>
              </div>

              <button
                onClick={handleSaveSystemConfig}
                className="py-2.5 px-5 rounded-xl bg-[#C85A32] hover:bg-[#B34E29] text-white text-xs font-bold shadow-md shadow-[#C85A32]/20 flex items-center gap-2 cursor-pointer"
              >
                <SaveIcon className="w-4 h-4" />
                <span>Guardar Parámetros</span>
              </button>
            </div>

            {/* Feature Flags Switches */}
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#EAE3D5] shadow-sm space-y-4">
              <h3 className="font-serif text-lg font-bold text-[#1E1C1A] mb-3">
                Interruptores de Funcionalidad
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                
                {/* Switch Modo Mantenimiento */}
                <div className="p-4 rounded-2xl bg-[#FAF7F2] border border-[#EAE3D5] flex items-center justify-between gap-3">
                  <div>
                    <p className="text-xs font-bold text-[#1E1C1A]">Modo Mantenimiento Global</p>
                    <p className="text-[11px] text-stone-500">Muestra pantalla de pausa a los visitantes públicos.</p>
                  </div>
                  <input
                    type="checkbox"
                    checked={systemConfig.maintenanceMode}
                    onChange={(e) => setSystemConfig({ ...systemConfig, maintenanceMode: e.target.checked })}
                    className="w-5 h-5 accent-[#C85A32] cursor-pointer"
                  />
                </div>

                {/* Switch Bolsa de Empleo */}
                <div className="p-4 rounded-2xl bg-[#FAF7F2] border border-[#EAE3D5] flex items-center justify-between gap-3">
                  <div>
                    <p className="text-xs font-bold text-[#1E1C1A]">Módulo Bolsa de Empleo</p>
                    <p className="text-[11px] text-stone-500">Habilita ofertas de empleo y recepción de CVs.</p>
                  </div>
                  <input
                    type="checkbox"
                    checked={systemConfig.showJobsSection}
                    onChange={(e) => setSystemConfig({ ...systemConfig, showJobsSection: e.target.checked })}
                    className="w-5 h-5 accent-[#C85A32] cursor-pointer"
                  />
                </div>

                {/* Switch Mapa LiDAR 3D */}
                <div className="p-4 rounded-2xl bg-[#FAF7F2] border border-[#EAE3D5] flex items-center justify-between gap-3">
                  <div>
                    <p className="text-xs font-bold text-[#1E1C1A]">Mapa 3D & Rutas</p>
                    <p className="text-[11px] text-stone-500">Muestra la sección de geolocalización de restaurantes.</p>
                  </div>
                  <input
                    type="checkbox"
                    checked={systemConfig.showLidarMap}
                    onChange={(e) => setSystemConfig({ ...systemConfig, showLidarMap: e.target.checked })}
                    className="w-5 h-5 accent-[#C85A32] cursor-pointer"
                  />
                </div>

                {/* Switch Promoción App en Web */}
                <div className="p-4 rounded-2xl bg-[#FAF7F2] border border-[#EAE3D5] flex items-center justify-between gap-3">
                  <div>
                    <p className="text-xs font-bold text-[#1E1C1A]">Banner Promo App Móvil en Web</p>
                    <p className="text-[11px] text-stone-500">Muestra sección con descarga de Google Play Store.</p>
                  </div>
                  <input
                    type="checkbox"
                    checked={systemConfig.showMobileAppPromo}
                    onChange={(e) => setSystemConfig({ ...systemConfig, showMobileAppPromo: e.target.checked })}
                    className="w-5 h-5 accent-[#C85A32] cursor-pointer"
                  />
                </div>

              </div>
            </div>

            {/* Parámetros Económicos & SEO */}
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#EAE3D5] shadow-sm">
              <h3 className="font-serif text-lg font-bold text-[#1E1C1A] mb-4">
                Tasa de Cambio & Parámetros SEO
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-[11px] font-bold text-stone-600 block mb-1">
                    Tasa Oficial BCV (Bs. por USD)
                  </label>
                  <div className="flex items-center gap-2">
                    <input
                      type="number"
                      step="0.01"
                      value={systemConfig.bcvRate}
                      onChange={(e) => setSystemConfig({ ...systemConfig, bcvRate: parseFloat(e.target.value) || 54.80 })}
                      className="w-full bg-[#FAF7F2] border border-[#EAE3D5] rounded-xl px-3.5 py-2 text-xs font-bold text-[#1E1C1A] outline-none"
                    />
                    <span className="text-xs text-stone-500 font-bold shrink-0">Bs / $</span>
                  </div>
                </div>

                <div>
                  <label className="text-[11px] font-bold text-stone-600 block mb-1">
                    Título SEO Global (Meta Title)
                  </label>
                  <input
                    type="text"
                    value={systemConfig.seoTitle}
                    onChange={(e) => setSystemConfig({ ...systemConfig, seoTitle: e.target.value })}
                    className="w-full bg-[#FAF7F2] border border-[#EAE3D5] rounded-xl px-3.5 py-2 text-xs text-[#1E1C1A] outline-none"
                  />
                </div>
              </div>
            </div>

          </div>
        )}

        {/* =================================================================== */}
        {/* TAB 6: BASE DE DATOS, RESPALDOS & MONITOREO                         */}
        {/* =================================================================== */}
        {activeDevTab === 'backup' && (
          <div className="space-y-8 animate-fadeIn">
            
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#EAE3D5] shadow-sm">
              <span className="text-[11px] font-bold uppercase tracking-[0.2em] text-cyan-700 block mb-1">
                Infraestructura & Datos
              </span>
              <h2 className="font-serif text-2xl font-bold text-[#1E1C1A]">
                Respaldos en JSON & Monitoreo del Servidor
              </h2>
              <p className="text-xs text-[#5C554E] mt-1">
                Genera copias completas de la base de datos o restaura respaldos en caso de migración o contingencia.
              </p>
            </div>

            {/* Panel de Operaciones de Base de Datos */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              
              <div className="bg-white rounded-3xl p-6 border border-[#EAE3D5] shadow-sm flex flex-col justify-between">
                <div>
                  <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center mb-3">
                    <Download className="w-5 h-5" />
                  </div>
                  <h3 className="font-bold text-sm text-[#1E1C1A]">Descargar Respaldo Total</h3>
                  <p className="text-xs text-stone-500 mt-1 leading-relaxed">
                    Exporta un archivo JSON con directorio de agremiados, configuraciones, permisos y promociones.
                  </p>
                </div>
                <button
                  onClick={handleDownloadBackup}
                  className="mt-4 w-full py-2.5 px-4 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold transition-colors shadow-xs flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <Download className="w-4 h-4" />
                  <span>Generar Backup (.JSON)</span>
                </button>
              </div>

              <div className="bg-white rounded-3xl p-6 border border-[#EAE3D5] shadow-sm flex flex-col justify-between">
                <div>
                  <div className="w-10 h-10 rounded-xl bg-cyan-100 text-cyan-800 flex items-center justify-center mb-3">
                    <Upload className="w-5 h-5" />
                  </div>
                  <h3 className="font-bold text-sm text-[#1E1C1A]">Restaurar Respaldo</h3>
                  <p className="text-xs text-stone-500 mt-1 leading-relaxed">
                    Restaura los datos de la plataforma cargando un archivo JSON generado previamente.
                  </p>
                </div>
                <label className="mt-4 w-full py-2.5 px-4 rounded-xl bg-cyan-700 hover:bg-cyan-800 text-white text-xs font-bold transition-colors shadow-xs flex items-center justify-center gap-1.5 cursor-pointer text-center">
                  <Upload className="w-4 h-4" />
                  <span>Subir Archivo (.JSON)</span>
                  <input type="file" accept=".json" onChange={handleUploadBackup} className="hidden" />
                </label>
              </div>

              <div className="bg-white rounded-3xl p-6 border border-[#EAE3D5] shadow-sm flex flex-col justify-between">
                <div>
                  <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-800 flex items-center justify-center mb-3">
                    <RefreshCw className="w-5 h-5" />
                  </div>
                  <h3 className="font-bold text-sm text-[#1E1C1A]">Purgar Caché Local</h3>
                  <p className="text-xs text-stone-500 mt-1 leading-relaxed">
                    Borra los datos temporales del navegador y fuerza la descarga limpia desde Supabase Cloud.
                  </p>
                </div>
                <button
                  onClick={handlePurgeCache}
                  className="mt-4 w-full py-2.5 px-4 rounded-xl bg-amber-700 hover:bg-amber-800 text-white text-xs font-bold transition-colors shadow-xs flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <RefreshCw className="w-4 h-4" />
                  <span>Purgar & Recargar</span>
                </button>
              </div>

            </div>

            {/* Health Check Status */}
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#EAE3D5] shadow-sm">
              <h3 className="font-serif text-lg font-bold text-[#1E1C1A] mb-4">
                🩺 Diagnóstico de Servicios Conectados
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
                <div className="p-3.5 rounded-2xl bg-emerald-50 border border-emerald-200">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-800 block">Supabase DB</span>
                  <p className="text-xs font-bold text-emerald-950 mt-0.5">🟢 Conectado / Sincronizado</p>
                </div>

                <div className="p-3.5 rounded-2xl bg-emerald-50 border border-emerald-200">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-800 block">Vercel Production</span>
                  <p className="text-xs font-bold text-emerald-950 mt-0.5">🟢 Despliegue Activo</p>
                </div>

                <div className="p-3.5 rounded-2xl bg-emerald-50 border border-emerald-200">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-800 block">Capacitor Android</span>
                  <p className="text-xs font-bold text-emerald-950 mt-0.5">🟢 Assets Sincronizados</p>
                </div>

                <div className="p-3.5 rounded-2xl bg-emerald-50 border border-emerald-200">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-800 block">Bóveda de Claves</span>
                  <p className="text-xs font-bold text-emerald-950 mt-0.5">🟢 Bóveda Operativa</p>
                </div>
              </div>
            </div>

          </div>
        )}

      </main>

      {/* ===================================================================== */}
      {/* MODAL 1: CAMBIAR CONTRASEÑA MAESTRA DEL DESARROLLADOR                */}
      {/* ===================================================================== */}
      {isChangePassModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 animate-fadeIn">
          <div className="bg-white border border-[#EAE3D5] rounded-3xl max-w-md w-full p-6 sm:p-8 shadow-2xl relative">
            <h3 className="font-serif text-xl font-bold text-[#1E1C1A]">
              🔐 Cambiar Clave Maestra de Desarrollador
            </h3>
            <p className="text-xs text-[#5C554E] mt-1 mb-6">
              Actualiza tu contraseña privada de acceso. Mínimo 8 caracteres.
            </p>

            <form onSubmit={handleChangeDevPassword} className="space-y-4">
              <div>
                <label className="block text-[11px] font-bold text-stone-600 mb-1">
                  Nueva Contraseña
                </label>
                <input
                  type="password"
                  required
                  value={newDevPass}
                  onChange={(e) => setNewDevPass(e.target.value)}
                  placeholder="Mínimo 8 caracteres"
                  className="w-full bg-[#FAF7F2] border border-[#EAE3D5] rounded-xl px-3.5 py-2.5 text-xs text-[#1E1C1A] outline-none"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-stone-600 mb-1">
                  Confirmar Nueva Contraseña
                </label>
                <input
                  type="password"
                  required
                  value={confirmDevPass}
                  onChange={(e) => setConfirmDevPass(e.target.value)}
                  placeholder="Repite la contraseña"
                  className="w-full bg-[#FAF7F2] border border-[#EAE3D5] rounded-xl px-3.5 py-2.5 text-xs text-[#1E1C1A] outline-none"
                />
              </div>

              {passChangeError && (
                <p className="text-xs text-red-600 font-bold">{passChangeError}</p>
              )}
              {passChangeSuccess && (
                <p className="text-xs text-emerald-600 font-bold">{passChangeSuccess}</p>
              )}

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsChangePassModalOpen(false)}
                  className="py-2 px-4 rounded-xl text-xs font-bold text-stone-600 hover:bg-stone-100 transition-colors"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="py-2 px-5 rounded-xl bg-[#C85A32] hover:bg-[#B34E29] text-white text-xs font-bold shadow-md shadow-[#C85A32]/20"
                >
                  Guardar Nueva Clave
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ===================================================================== */}
      {/* MODAL 2: CREAR / EDITAR PROMOCIÓN DE LA APP MÓVIL                    */}
      {/* ===================================================================== */}
      {isPromoModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 animate-fadeIn">
          <div className="bg-white border border-[#EAE3D5] rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl relative">
            <h3 className="font-serif text-xl font-bold text-[#1E1C1A]">
              {editingPromo ? '✏️ Editar Promoción de la App' : '✨ Crear Nueva Promoción'}
            </h3>
            <p className="text-xs text-[#5C554E] mt-1 mb-6">
              Esta oferta aparecerá destacada en la sección de Promos de la App Móvil.
            </p>

            <form onSubmit={handleSavePromo} className="space-y-3.5 text-xs">
              <div>
                <label className="font-bold text-stone-600 block mb-1">Título de la Promoción</label>
                <input
                  type="text"
                  required
                  value={promoFormData.title}
                  onChange={(e) => setPromoFormData({ ...promoFormData, title: e.target.value })}
                  placeholder="ej. Noches de Burgers de Autor & Sangría 2x1"
                  className="w-full bg-[#FAF7F2] border border-[#EAE3D5] rounded-xl px-3 py-2 text-xs text-[#1E1C1A] outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-stone-600 block mb-1">Nombre del Restaurante</label>
                  <input
                    type="text"
                    required
                    value={promoFormData.restaurantName}
                    onChange={(e) => setPromoFormData({ ...promoFormData, restaurantName: e.target.value })}
                    placeholder="ej. Kaffia Caffe"
                    className="w-full bg-[#FAF7F2] border border-[#EAE3D5] rounded-xl px-3 py-2 text-xs text-[#1E1C1A] outline-none"
                  />
                </div>

                <div>
                  <label className="font-bold text-stone-600 block mb-1">Badge de Descuento</label>
                  <input
                    type="text"
                    value={promoFormData.discountLabel}
                    onChange={(e) => setPromoFormData({ ...promoFormData, discountLabel: e.target.value })}
                    placeholder="ej. 20% OFF / 2x1"
                    className="w-full bg-[#FAF7F2] border border-[#EAE3D5] rounded-xl px-3 py-2 text-xs text-[#1E1C1A] outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-stone-600 block mb-1">Vigencia / Días</label>
                  <input
                    type="text"
                    value={promoFormData.badge}
                    onChange={(e) => setPromoFormData({ ...promoFormData, badge: e.target.value })}
                    placeholder="ej. Jueves a Domingo"
                    className="w-full bg-[#FAF7F2] border border-[#EAE3D5] rounded-xl px-3 py-2 text-xs text-[#1E1C1A] outline-none"
                  />
                </div>

                <div>
                  <label className="font-bold text-stone-600 block mb-1">Texto del Botón</label>
                  <input
                    type="text"
                    value={promoFormData.ctaText}
                    onChange={(e) => setPromoFormData({ ...promoFormData, ctaText: e.target.value })}
                    placeholder="ej. Canjear Promo"
                    className="w-full bg-[#FAF7F2] border border-[#EAE3D5] rounded-xl px-3 py-2 text-xs text-[#1E1C1A] outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="font-bold text-stone-600 block mb-1">Condiciones de Canje</label>
                <input
                  type="text"
                  value={promoFormData.condition}
                  onChange={(e) => setPromoFormData({ ...promoFormData, condition: e.target.value })}
                  placeholder="ej. Válido en consumo en mesa mencionando la app"
                  className="w-full bg-[#FAF7F2] border border-[#EAE3D5] rounded-xl px-3 py-2 text-xs text-[#1E1C1A] outline-none"
                />
              </div>

              <div>
                <label className="font-bold text-stone-600 block mb-1">URL de la Foto</label>
                <input
                  type="url"
                  value={promoFormData.photoUrl}
                  onChange={(e) => setPromoFormData({ ...promoFormData, photoUrl: e.target.value })}
                  className="w-full bg-[#FAF7F2] border border-[#EAE3D5] rounded-xl px-3 py-2 text-xs text-[#1E1C1A] outline-none font-mono"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-3">
                <button
                  type="button"
                  onClick={() => setIsPromoModalOpen(false)}
                  className="py-2 px-4 rounded-xl text-xs font-bold text-stone-600 hover:bg-stone-100 transition-colors"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="py-2 px-5 rounded-xl bg-[#C85A32] hover:bg-[#B34E29] text-white text-xs font-bold shadow-md shadow-[#C85A32]/20"
                >
                  {editingPromo ? 'Guardar Cambios' : 'Crear Promoción'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ===================================================================== */}
      {/* MODAL 3: RESETEO RÁPIDO DE CLAVE DE CUALQUIER USUARIO                */}
      {/* ===================================================================== */}
      {resetUserTarget && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 animate-fadeIn">
          <div className="bg-white border border-[#EAE3D5] rounded-3xl max-w-md w-full p-6 sm:p-8 shadow-2xl relative">
            <h3 className="font-serif text-xl font-bold text-[#1E1C1A]">
              🔑 Restablecer Contraseña
            </h3>
            <p className="text-xs text-[#5C554E] mt-1 mb-4">
              Usuario destino: <strong className="text-[#1E1C1A]">{resetUserTarget.name || resetUserTarget.nombre_establecimiento}</strong>
            </p>

            <form onSubmit={handleResetUserPassword} className="space-y-4">
              <div>
                <label className="block text-[11px] font-bold text-stone-600 mb-1">
                  Nueva Contraseña para el Usuario
                </label>
                <input
                  type="text"
                  required
                  value={userResetPassword}
                  onChange={(e) => setUserResetPassword(e.target.value)}
                  placeholder="Mínimo 8 caracteres"
                  className="w-full bg-[#FAF7F2] border border-[#EAE3D5] rounded-xl px-3.5 py-2.5 text-xs text-[#1E1C1A] outline-none font-mono"
                />
              </div>

              {userResetStatus && (
                <p className="text-xs font-bold">{userResetStatus}</p>
              )}

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setResetUserTarget(null)}
                  className="py-2 px-4 rounded-xl text-xs font-bold text-stone-600 hover:bg-stone-100 transition-colors"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="py-2 px-5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold shadow-md shadow-indigo-600/20"
                >
                  Actualizar Clave
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}

// Icono auxiliar de Guardar
function SaveIcon({ className = "w-4 h-4" }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7H5a2 2 0 00-2 2v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4" />
    </svg>
  );
}
