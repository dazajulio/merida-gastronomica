import { supabase } from './supabaseClient';
import { INITIAL_DIRECTORY_DATA } from '../data/initialDirectoryData';
import { BOARD_MEMBERS_DATA } from '../data/boardData';
import { WEEKLY_PROMOS_DATA } from '../data/mobileAppData';

export const DEV_DEFAULT_EMAIL = 'dazajulio@gmail.com';
export const DEV_DEFAULT_PASSWORD = 'dafaca10';
export const DEV_AUTH_SESSION_KEY = 'cgem_dev_master_session';
export const DEV_CUSTOM_PASS_KEY = 'cgem_dev_custom_password';
export const DEV_CONFIG_KEY = 'cgem_dev_system_config';
export const DEV_APP_CUSTOM_KEY = 'cgem_dev_app_custom_config';
export const SIMULATION_SESSION_KEY = 'cgem_simulation_active';

// Configuración inicial del sistema bajo control de Desarrollador
export const DEFAULT_DEV_CONFIG = {
  maintenanceMode: false,
  maintenanceMessage: 'Portal en labores de actualización técnica y mantenimiento programado por la Cámara Gastronómica del Estado Mérida. Estaremos en línea en breves momentos.',
  bcvRate: 54.80,
  showMobileAppPromo: true,
  showJobsSection: true,
  showLidarMap: true,
  showOpenAffiliation: true,
  allowPublicRegistrations: true,
  seoTitle: 'Mérida Gastronómica | Cámara Gastronómica del Estado Mérida',
  seoDescription: 'Cámara Gastronómica del Estado Mérida (CGEM). La plataforma oficial del ecosistema gastronómico, turístico y productivo de los Andes venezolanos.',
  playStoreUrl: 'https://play.google.com/store/apps/details?id=com.meridagastronomica.app',
  apkDownloadUrl: 'https://www.meridagastronomica.com/downloads/merida-gastronomica.apk',
  conciergeWhatsApp: '+584148817137',
  supportEmail: 'dazajulio@gmail.com'
};

// Configuración inicial de la App Móvil personalizada
export const DEFAULT_DEV_APP_CONFIG = {
  heroTagline: 'El sabor y el turismo de los Andes venezolanos en tu bolsillo.',
  featuredRestaurantSlugs: ['kaffia-caffe', 'la-nota-merida', 'chocolates-la-pua', 'la-campesina-valle'],
  weeklyPromos: [...WEEKLY_PROMOS_DATA],
  membershipFeeUSD: 25,
  inscriptionFeeUSD: 50,
  adPricing: {
    heroBannerUSD: 40,
    featuredListingUSD: 20,
    promoSpotlightUSD: 15
  }
};

/**
 * Obtener la contraseña maestra del desarrollador (con fallback a 'dafaca10')
 */
export function getDevMasterPassword() {
  if (typeof localStorage !== 'undefined') {
    const custom = localStorage.getItem(DEV_CUSTOM_PASS_KEY);
    if (custom && custom.trim().length >= 8) {
      return custom.trim();
    }
  }
  return DEV_DEFAULT_PASSWORD;
}

/**
 * Verificar credenciales del desarrollador
 */
export function verifyDevCredentials(email, password) {
  if (!email || !password) return false;
  const cleanEmail = email.trim().toLowerCase();
  const cleanPass = password.trim();

  const isEmailValid = cleanEmail === DEV_DEFAULT_EMAIL.toLowerCase() || 
                       cleanEmail === 'juliodaza' || 
                       cleanEmail === 'dazajulio';

  const currentPass = getDevMasterPassword();
  const isPassValid = cleanPass === currentPass || 
                      cleanPass === DEV_DEFAULT_PASSWORD || 
                      cleanPass === 'Dafaca10*' ||
                      cleanPass === 'dafaca10';

  return isEmailValid && isPassValid;
}

/**
 * Guardar nueva contraseña del desarrollador
 */
export async function updateDevMasterPassword(newPassword) {
  if (!newPassword || newPassword.trim().length < 8) {
    throw new Error('La nueva contraseña debe tener un mínimo de 8 caracteres.');
  }

  const clean = newPassword.trim();
  if (typeof localStorage !== 'undefined') {
    localStorage.setItem(DEV_CUSTOM_PASS_KEY, clean);
  }

  // Intentar sincronizar en Supabase si está disponible
  if (supabase) {
    try {
      await supabase
        .from('eventos_oficiales')
        .upsert({
          id: 'dev_meta::master_credentials',
          category: '__CGEM_DEV_MASTER__',
          title: 'Credencial Maestra Desarrollador',
          description: 'dazajulio@gmail.com',
          price_tiers: [{ passwordHash: clean, updatedAt: new Date().toISOString() }],
          updated_at: new Date().toISOString()
        });
    } catch (err) {
      console.warn('Nota: guardado local activo (Supabase offline o protegido):', err);
    }
  }

  return true;
}

/**
 * Obtener configuración global del desarrollador
 */
export function getDevSystemConfig() {
  if (typeof localStorage !== 'undefined') {
    try {
      const saved = localStorage.getItem(DEV_CONFIG_KEY);
      if (saved) return { ...DEFAULT_DEV_CONFIG, ...JSON.parse(saved) };
    } catch (e) {}
  }
  return DEFAULT_DEV_CONFIG;
}

/**
 * Guardar configuración global del desarrollador
 */
export function saveDevSystemConfig(newConfig) {
  if (typeof localStorage !== 'undefined') {
    localStorage.setItem(DEV_CONFIG_KEY, JSON.stringify(newConfig));
    window.dispatchEvent(new CustomEvent('cgem_dev_config_updated', { detail: newConfig }));
  }
  return newConfig;
}

/**
 * Obtener configuración de la App Móvil
 */
export function getDevAppConfig() {
  if (typeof localStorage !== 'undefined') {
    try {
      const saved = localStorage.getItem(DEV_APP_CUSTOM_KEY);
      if (saved) return { ...DEFAULT_DEV_APP_CONFIG, ...JSON.parse(saved) };
    } catch (e) {}
  }
  return DEFAULT_DEV_APP_CONFIG;
}

/**
 * Guardar configuración de la App Móvil
 */
export function saveDevAppConfig(newAppConfig) {
  if (typeof localStorage !== 'undefined') {
    localStorage.setItem(DEV_APP_CUSTOM_KEY, JSON.stringify(newAppConfig));
    window.dispatchEvent(new CustomEvent('cgem_dev_app_updated', { detail: newAppConfig }));
  }
  return newAppConfig;
}

/**
 * Iniciar Modo Simulación (Ghost Mode)
 */
export function startSimulationMode(targetType, targetData) {
  if (typeof localStorage === 'undefined') return;

  const simulationPayload = {
    active: true,
    targetType, // 'board' | 'affiliate'
    targetData,
    startedAt: new Date().toISOString()
  };

  localStorage.setItem(SIMULATION_SESSION_KEY, JSON.stringify(simulationPayload));

  if (targetType === 'board') {
    localStorage.setItem('cgem_board_user', JSON.stringify(targetData));
    localStorage.setItem('cgem_board_authenticated', 'true');
  } else if (targetType === 'affiliate') {
    localStorage.setItem('cgem_active_session', JSON.stringify(targetData));
    localStorage.setItem('cgem_session_token', `sim_token_${Date.now()}`);
  }

  window.dispatchEvent(new CustomEvent('cgem_simulation_changed', { detail: simulationPayload }));
}

/**
 * Detener Modo Simulación
 */
export function stopSimulationMode() {
  if (typeof localStorage === 'undefined') return;

  const current = localStorage.getItem(SIMULATION_SESSION_KEY);
  if (!current) return;

  try {
    const parsed = JSON.parse(current);
    if (parsed.targetType === 'board') {
      localStorage.removeItem('cgem_board_user');
      localStorage.removeItem('cgem_board_authenticated');
    } else if (parsed.targetType === 'affiliate') {
      localStorage.removeItem('cgem_active_session');
      localStorage.removeItem('cgem_session_token');
    }
  } catch (e) {}

  localStorage.removeItem(SIMULATION_SESSION_KEY);
  window.dispatchEvent(new CustomEvent('cgem_simulation_changed', { detail: null }));
}

/**
 * Generar Snapshot Completo de la Plataforma para Backup JSON
 */
export function generatePlatformBackup() {
  const backup = {
    version: '1.0.0',
    exportDate: new Date().toISOString(),
    exportedBy: 'Julio Daza (Desarrollador & Propietario)',
    systemConfig: getDevSystemConfig(),
    appConfig: getDevAppConfig(),
    localStorageSnapshot: {}
  };

  if (typeof localStorage !== 'undefined') {
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key && (key.startsWith('cgem_') || key.startsWith('board_'))) {
        backup.localStorageSnapshot[key] = localStorage.getItem(key);
      }
    }
  }

  return backup;
}

/**
 * Restaurar Plataforma desde Snapshot JSON
 */
export function restorePlatformBackup(backupJsonString) {
  try {
    const data = JSON.parse(backupJsonString);
    if (!data || typeof data !== 'object') {
      throw new Error('Archivo de respaldo no válido.');
    }

    if (data.systemConfig) {
      saveDevSystemConfig(data.systemConfig);
    }
    if (data.appConfig) {
      saveDevAppConfig(data.appConfig);
    }

    if (data.localStorageSnapshot && typeof localStorage !== 'undefined') {
      for (const [k, v] of Object.entries(data.localStorageSnapshot)) {
        if (v !== null && v !== undefined) {
          localStorage.setItem(k, v);
        }
      }
    }

    return { success: true, message: 'Respaldo restaurado con éxito.' };
  } catch (err) {
    return { success: false, message: err.message || 'Error al procesar el archivo de respaldo.' };
  }
}
