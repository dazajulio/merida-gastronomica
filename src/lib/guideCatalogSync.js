import { supabase } from './supabaseClient';

const META_CATEGORY = '__CGEM_BOARD_META__';
const CATEGORIES_VAULT_ID = 'board_meta::guide_categories';
const PROVIDERS_VAULT_ID = 'board_meta::guide_providers';
const LOCAL_CATEGORIES_KEY = 'cgem_guide_categories_v1';
const LOCAL_PROVIDERS_KEY = 'cgem_guide_providers_v1';

export const DEFAULT_GUIDE_CATEGORIES = [
  {
    id: 'restaurantes',
    title: 'Guía de Restaurantes',
    image: '/images/merida_hero_gastronomica.jpg',
    routeTarget: 'guide',
  },
  {
    id: 'hoteles',
    title: 'Hoteles',
    image: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=900&q=80',
    routeTarget: 'prestadores',
  },
  {
    id: 'posadas',
    title: 'Posadas',
    image: '/images/afiliados/piur-5.jpg',
    routeTarget: 'el_valle_ruta',
  },
  {
    id: 'transporte',
    title: 'Transporte',
    image: 'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?auto=format&fit=crop&w=900&q=80',
    routeTarget: 'services',
  },
  {
    id: 'parques',
    title: 'Parques',
    image: '/images/el-valle-paisaje.jpg',
    routeTarget: 'el_valle_ruta',
  },
  {
    id: 'cafeterias',
    title: 'Cafeterías',
    image: 'https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?auto=format&fit=crop&w=900&q=80',
    routeTarget: 'cafe',
  },
  {
    id: 'pueblos',
    title: 'Pueblos Emblemáticos',
    image: '/images/noticias/noticia-3.jpg',
    routeTarget: 'terroir',
  },
  {
    id: 'aventura',
    title: 'Turismo de Aventura',
    image: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=900&q=80',
    routeTarget: 'services',
  },
];

export function getLocalGuideCategories() {
  if (typeof localStorage === 'undefined') return DEFAULT_GUIDE_CATEGORIES;
  try {
    const raw = localStorage.getItem(LOCAL_CATEGORIES_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.length > 0) return parsed;
    }
  } catch (e) {}
  return DEFAULT_GUIDE_CATEGORIES;
}

export function getLocalGuideProviders() {
  if (typeof localStorage === 'undefined') return [];
  try {
    const raw = localStorage.getItem(LOCAL_PROVIDERS_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed)) return parsed;
    }
  } catch (e) {}
  return [];
}

export async function fetchGuideCatalog() {
  let categories = getLocalGuideCategories();
  let providers = getLocalGuideProviders();

  if (supabase) {
    try {
      const { data, error } = await supabase
        .from('eventos_oficiales')
        .select('id, price_tiers')
        .in('id', [CATEGORIES_VAULT_ID, PROVIDERS_VAULT_ID]);

      if (!error && Array.isArray(data)) {
        data.forEach((row) => {
          if (row.id === CATEGORIES_VAULT_ID && Array.isArray(row.price_tiers) && Array.isArray(row.price_tiers[0]) && row.price_tiers[0].length > 0) {
            categories = row.price_tiers[0];
            try {
              localStorage.setItem(LOCAL_CATEGORIES_KEY, JSON.stringify(categories));
            } catch (e) {}
          }
          if (row.id === PROVIDERS_VAULT_ID && Array.isArray(row.price_tiers) && Array.isArray(row.price_tiers[0])) {
            providers = row.price_tiers[0];
            try {
              localStorage.setItem(LOCAL_PROVIDERS_KEY, JSON.stringify(providers));
            } catch (e) {}
          }
        });
      }
    } catch (e) {
      console.warn('Notice fetching guide catalog:', e);
    }
  }

  return { categories, providers };
}

export async function saveGuideCategories(categories) {
  const clean = Array.isArray(categories) && categories.length > 0 ? categories : DEFAULT_GUIDE_CATEGORIES;
  if (typeof localStorage !== 'undefined') {
    try {
      localStorage.setItem(LOCAL_CATEGORIES_KEY, JSON.stringify(clean));
    } catch (e) {}
  }
  if (supabase) {
    try {
      await supabase.from('eventos_oficiales').upsert({
        id: CATEGORIES_VAULT_ID,
        title: 'CGEM La Guía - Secciones',
        date: '2026-01-01',
        month: '1',
        location: 'Mérida Cloud',
        category: META_CATEGORY,
        badge: 'La Guía CGEM',
        access_type: 'private',
        price_tiers: [clean],
        updated_at: new Date().toISOString(),
      });
    } catch (e) {
      console.warn('Notice saving guide categories:', e);
    }
  }
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new Event('cgem_guide_updated'));
  }
  return clean;
}

export async function saveGuideProviders(providers) {
  const clean = Array.isArray(providers) ? providers : [];
  if (typeof localStorage !== 'undefined') {
    try {
      localStorage.setItem(LOCAL_PROVIDERS_KEY, JSON.stringify(clean));
    } catch (e) {}
  }
  if (supabase) {
    try {
      await supabase.from('eventos_oficiales').upsert({
        id: PROVIDERS_VAULT_ID,
        title: 'CGEM La Guía - Prestadores',
        date: '2026-01-01',
        month: '1',
        location: 'Mérida Cloud',
        category: META_CATEGORY,
        badge: 'La Guía CGEM',
        access_type: 'private',
        price_tiers: [clean],
        updated_at: new Date().toISOString(),
      });
    } catch (e) {
      console.warn('Notice saving guide providers:', e);
    }
  }
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new Event('cgem_guide_updated'));
  }
  return clean;
}

export function subscribeToGuideRealtime(onSync) {
  const handleWindowUpdate = () => {
    fetchGuideCatalog().then(onSync);
  };

  if (typeof window !== 'undefined') {
    window.addEventListener('cgem_guide_updated', handleWindowUpdate);
    window.addEventListener('storage', handleWindowUpdate);
  }

  let channel = null;
  if (supabase) {
    channel = supabase
      .channel('cgem_guide_realtime_channel')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'eventos_oficiales',
          filter: `category=eq.${META_CATEGORY}`,
        },
        () => {
          fetchGuideCatalog().then(onSync);
        }
      )
      .subscribe();
  }

  return () => {
    if (typeof window !== 'undefined') {
      window.removeEventListener('cgem_guide_updated', handleWindowUpdate);
      window.removeEventListener('storage', handleWindowUpdate);
    }
    if (channel && supabase) {
      supabase.removeChannel(channel);
    }
  };
}
