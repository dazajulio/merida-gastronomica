import { supabase } from './supabaseClient';

const BRANCH_CATEGORY = '__CGEM_BOARD_META__';
const getVaultId = (code) => `board_biz_branches::${String(code || '').trim().toUpperCase()}`;
const getLocalKey = (code) => `cgem_biz_branches_${String(code || '').trim().toUpperCase()}`;

export function getLocalBranches(code) {
  if (!code || typeof localStorage === 'undefined') return [];
  try {
    const raw = localStorage.getItem(getLocalKey(code));
    const parsed = raw ? JSON.parse(raw) : [];
    return Array.isArray(parsed) ? parsed : [];
  } catch (e) {
    return [];
  }
}

export async function fetchAffiliateBranches(code) {
  if (!code) return [];
  const local = getLocalBranches(code);
  if (supabase) {
    try {
      const { data, error } = await supabase
        .from('eventos_oficiales')
        .select('price_tiers')
        .eq('id', getVaultId(code))
        .maybeSingle();

      if (!error && data && Array.isArray(data.price_tiers) && Array.isArray(data.price_tiers[0])) {
        const cloudBranches = data.price_tiers[0];
        if (typeof localStorage !== 'undefined') {
          try {
            localStorage.setItem(getLocalKey(code), JSON.stringify(cloudBranches));
          } catch (e) {}
        }
        return cloudBranches;
      }
    } catch (e) {
      console.warn('Notice fetching affiliate branches:', e);
    }
  }
  return local;
}

export async function saveAffiliateBranches(code, branches = []) {
  if (!code) return false;
  const clean = Array.isArray(branches) ? branches : [];

  if (typeof localStorage !== 'undefined') {
    try {
      localStorage.setItem(getLocalKey(code), JSON.stringify(clean));
    } catch (e) {}
  }

  if (supabase) {
    try {
      await supabase
        .from('eventos_oficiales')
        .upsert({
          id: getVaultId(code),
          title: `Sucursales ${code}`,
          date: '2026-01-01',
          month: '1',
          location: 'Mérida Cloud',
          category: BRANCH_CATEGORY,
          badge: 'Sucursales CGEM',
          access_type: 'private',
          price_tiers: [clean],
          updated_at: new Date().toISOString(),
        });
    } catch (e) {
      console.warn('Notice saving affiliate branches:', e);
    }
  }
  return true;
}
