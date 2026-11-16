import { supabase } from './supabaseClient';
import { BOARD_MEMBERS_DATA } from '../data/boardData';

/**
 * =========================================================================
 * CGEM SISTEMA GLOBAL DE AUTOGESTIÓN Y RECUPERACIÓN DE CONTRASEÑAS
 * Sincronizado en tiempo real con Supabase Cloud.
 *
 * Regla oficial del Estatuto CGEM:
 * - Mínimo 8 caracteres (números, letras o combinados; sin más exigencias).
 * =========================================================================
 */

export const VAULT_ID = 'board_meta::user_credentials';
export const VAULT_CATEGORY = '__CGEM_BOARD_AUTH_VAULT__';
export const LOCAL_VAULT_KEY = 'cgem_vault_credentials_cache';

/**
 * Valida la regla única de contraseña: mínimo 8 caracteres.
 */
export function validatePasswordRule(password) {
  if (!password || typeof password !== 'string') {
    return { valid: false, message: 'La contraseña es obligatoria (mínimo 8 caracteres).' };
  }
  const clean = password.trim();
  if (clean.length < 8) {
    return { 
      valid: false, 
      message: `La contraseña debe contener al menos 8 caracteres (actualmente tiene ${clean.length}).` 
    };
  }
  return { valid: true, message: 'Contraseña válida' };
}

/**
 * Obtiene el mapa completo de credenciales activas desde Supabase Cloud,
 * con fallback instantáneo a caché local.
 */
export async function fetchLiveVaultCredentials() {
  let cached = {};
  if (typeof localStorage !== 'undefined') {
    try {
      const local = localStorage.getItem(LOCAL_VAULT_KEY);
      if (local) cached = JSON.parse(local);
    } catch (e) {}
  }

  if (supabase) {
    try {
      const { data, error } = await supabase
        .from('eventos_oficiales')
        .select('price_tiers')
        .eq('id', VAULT_ID)
        .maybeSingle();

      if (!error && data) {
        let vault = {};
        if (Array.isArray(data.price_tiers) && data.price_tiers[0] && typeof data.price_tiers[0] === 'object') {
          vault = data.price_tiers[0];
        } else if (typeof data.price_tiers === 'object' && data.price_tiers !== null) {
          vault = data.price_tiers;
        }

        if (Object.keys(vault).length > 0) {
          if (typeof localStorage !== 'undefined') {
            try {
              localStorage.setItem(LOCAL_VAULT_KEY, JSON.stringify(vault));
            } catch (e) {}
          }
          return { ...cached, ...vault };
        }
      }
    } catch (err) {
      console.warn('Notice al consultar bóveda de credenciales Supabase:', err);
    }
  }

  return cached;
}

/**
 * Actualiza la contraseña de un usuario (Agremiado o Directivo) en Supabase Cloud.
 * Vincula la nueva clave a todos los identificadores del usuario (email, código CGM, RIF).
 */
export async function saveUserCredentialsToSupabase(primaryIdentifier, newPassword, additionalKeys = []) {
  const check = validatePasswordRule(newPassword);
  if (!check.valid) {
    throw new Error(check.message);
  }

  const passClean = newPassword.trim();
  const allKeys = [primaryIdentifier, ...additionalKeys]
    .filter(Boolean)
    .map(k => String(k).trim().toLowerCase());

  if (allKeys.length === 0) {
    throw new Error('Debe proporcionar al menos un identificador de usuario válido.');
  }

  // 1. Obtener estado actual del Vault
  const currentVault = await fetchLiveVaultCredentials();

  // 2. Asignar nueva contraseña a todos sus identificadores
  allKeys.forEach(k => {
    currentVault[k] = passClean;
  });

  // 3. Persistir en Supabase Cloud
  if (supabase) {
    try {
      const { error } = await supabase
        .from('eventos_oficiales')
        .upsert({
          id: VAULT_ID,
          title: 'CGEM Bóveda Central de Credenciales y Contraseñas',
          date: '2026-01-01',
          month: '1',
          location: 'Sistema Mérida Cloud',
          category: VAULT_CATEGORY,
          badge: 'Seguridad CGEM',
          access_type: 'private',
          price_tiers: [currentVault],
          updated_at: new Date().toISOString()
        });

      if (error) {
        console.warn('Error al guardar credenciales en Supabase:', error);
      }
    } catch (e) {
      console.warn('Excepción al conectar con Supabase:', e);
    }
  }

  // 4. Actualizar caché local
  if (typeof localStorage !== 'undefined') {
    try {
      localStorage.setItem(LOCAL_VAULT_KEY, JSON.stringify(currentVault));
    } catch (e) {}
  }

  // 5. Si es agremiado, respaldar en su registro de directorio_agremiados
  const cgmCode = allKeys.find(k => k.startsWith('cgm-'));
  if (cgmCode && supabase) {
    try {
      const { data: member } = await supabase
        .from('directorio_agremiados')
        .select('id, observaciones')
        .ilike('codigo_afiliado', cgmCode)
        .maybeSingle();

      if (member) {
        let obs = member.observaciones || '';
        // Reemplazar o añadir tag [PWD:...]
        if (obs.includes('[PWD:')) {
          obs = obs.replace(/\[PWD:[^\]]+\]/, `[PWD:${passClean}]`);
        } else {
          obs = `${obs} [PWD:${passClean}]`.trim();
        }
        await supabase
          .from('directorio_agremiados')
          .update({ observaciones: obs, updated_at: new Date().toISOString() })
          .eq('id', member.id);
      }
    } catch (err) {
      console.warn('Notice al respaldar credencial en directorio:', err);
    }
  }

  return true;
}

/**
 * Consulta la contraseña configurada para un identificador (email, código, rif).
 */
export async function getStoredPasswordForIdentifier(identifier) {
  if (!identifier) return null;
  const cleanId = String(identifier).trim().toLowerCase();
  const vault = await fetchLiveVaultCredentials();
  return vault[cleanId] || null;
}

/**
 * Búsqueda unificada de Afiliado por correo, código CGM o RIF/Cédula.
 */
export async function findAffiliateByIdentifier(identifier) {
  if (!identifier) return null;
  const clean = String(identifier).trim().toLowerCase();

  // 1. Supabase directorio_agremiados
  if (supabase) {
    try {
      const { data, error } = await supabase
        .from('directorio_agremiados')
        .select('*')
        .or(`email.ilike.${clean},codigo_afiliado.ilike.${clean},rif_cedula.ilike.${clean}`)
        .maybeSingle();

      if (!error && data) return data;
    } catch (e) {}
  }

  // 2. localStorage
  if (typeof localStorage !== 'undefined') {
    try {
      const local = JSON.parse(localStorage.getItem('cgem_directorio_agremiados') || '[]');
      const found = local.find(m => 
        (m.email && m.email.toLowerCase() === clean) ||
        (m.codigo_afiliado && m.codigo_afiliado.toLowerCase() === clean) ||
        (m.rif_cedula && m.rif_cedula.toLowerCase() === clean)
      );
      if (found) return found;
    } catch (e) {}
  }

  // 3. Demo Kaffia
  if (
    clean === 'cafe.kaffia@gmail.com' ||
    clean === 'kaffia@meridagastronomica.com' ||
    clean === 'cgm-2026-001' ||
    clean === 'kaffia'
  ) {
    return {
      codigo_afiliado: 'CGM-2026-001',
      nombre_establecimiento: 'Kaffia Caffe',
      representante_legal: 'Gerencia & Equipo Kaffia',
      email: 'cafe.kaffia@gmail.com',
      rif_cedula: 'J-501234567'
    };
  }

  return null;
}

/**
 * Búsqueda de Directivo por correo o alias.
 */
export function findBoardMemberByIdentifier(identifier) {
  if (!identifier) return null;
  const clean = String(identifier).trim().toLowerCase();

  return BOARD_MEMBERS_DATA.find(m => 
    (m.email && m.email.toLowerCase() === clean) ||
    (Array.isArray(m.aliases) && m.aliases.some(a => a.toLowerCase() === clean)) ||
    (m.id === clean) ||
    (m.id === 'dir-presidente' && (
      clean === 'notificaciones@meridagastronomica.com' ||
      clean === 'presidencia@meridagastronomica.com' ||
      clean === 'meridacamaragastronomica@gmail.com'
    ))
  ) || null;
}
