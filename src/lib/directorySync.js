import { supabase } from './supabaseClient';
import { RESTAURANTS_DATA } from '../data/restaurantsData';

// Imágenes por defecto de alta calidad según la categoría del negocio
const DEFAULT_CATEGORY_IMAGES = {
  "Bares": "https://images.unsplash.com/photo-1514933651103-005eec06c04b?auto=format&fit=crop&w=1200&q=80",
  "Cafeterías": "https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?auto=format&fit=crop&w=1200&q=80",
  "Cocinas ocultas": "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=1200&q=80",
  "Productores": "https://images.unsplash.com/photo-1500937386664-56d1dfef3854?auto=format&fit=crop&w=1200&q=80",
  "Procesadoras de alimentos": "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&w=1200&q=80",
  "Panaderías": "https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&w=1200&q=80",
  "Pastelerías": "https://images.unsplash.com/photo-1578985545062-69928b1d9587?auto=format&fit=crop&w=1200&q=80",
  "Heladerías": "https://images.unsplash.com/photo-1501443762994-82bd5dace89a?auto=format&fit=crop&w=1200&q=80",
  "Restaurantes de alta cocina": "https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=1200&q=80",
  "Restaurantes de autor": "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=1200&q=80",
  "Restaurantes familiares": "https://images.unsplash.com/photo-1552566626-52f8b828add9?auto=format&fit=crop&w=1200&q=80",
  "Food trucks": "https://images.unsplash.com/photo-1565123409695-7b5ef63a2efb?auto=format&fit=crop&w=1200&q=80"
};

/**
 * Convierte un registro del Directorio de Agremiados de Supabase
 * al formato completo compatible con la Guía Oficial y Modales
 */
export function convertAgremiadoToRestaurant(m) {
  const isSolvente = (m.estado_solvencia || '').toLowerCase().includes('solvente') || 
                     (m.estado_solvencia || '').toLowerCase().includes('activo');

  const slug = (m.nombre_establecimiento || '')
    .toLowerCase()
    .normalize("NFD").replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');

  let gallery = [];
  if (Array.isArray(m.fotos_galeria) && m.fotos_galeria.length > 0) {
    gallery = m.fotos_galeria;
  } else if (typeof m.fotos_galeria === 'string') {
    try {
      const parsed = JSON.parse(m.fotos_galeria);
      if (Array.isArray(parsed) && parsed.length > 0) gallery = parsed;
    } catch (e) {
      if (m.fotos_galeria.startsWith('http') || m.fotos_galeria.startsWith('data:')) {
        gallery = [m.fotos_galeria];
      }
    }
  }

  const categoryDefaultImage = DEFAULT_CATEGORY_IMAGES[m.categoria_negocio] || 
                               "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=1200&q=80";

  const defaultCover = m.foto_portada || (gallery.length > 0 ? gallery[0] : categoryDefaultImage);
  if (gallery.length === 0) {
    gallery = [defaultCover];
  }

  // Determinar eje según el municipio
  const mun = (m.municipio || '').toLowerCase();
  let eje = 'metropolitano';
  let ejeName = 'Eje Metropolitano (Mérida Ciudad)';
  if (mun.includes('rangel') || mun.includes('cardenal') || mun.includes('pueblo llano') || mun.includes('miranda')) {
    eje = 'paramo';
    ejeName = 'Eje Páramo (Mucuchíes & Apartaderos)';
  } else if (mun.includes('tovar') || mun.includes('pinto') || mun.includes('rivas') || mun.includes('zea')) {
    eje = 'mocoties';
    ejeName = 'Eje Valle del Mocotíes';
  } else if (mun.includes('arzobispo') || mun.includes('aricagua') || mun.includes('guaraque') || mun.includes('canaguá')) {
    eje = 'pueblos-sur';
    ejeName = 'Eje Pueblos del Sur';
  } else if (mun.includes('adriani') || mun.includes('obispo') || mun.includes('tulio') || mun.includes('salas') || mun.includes('caracciolo')) {
    eje = 'panamericano';
    ejeName = 'Eje Panamericano & Sur del Lago';
  }

  // Coordenadas con fallback a Mérida Centro
  const lat = parseFloat(m.latitud || m.latitude || m.lat || m.coordinates?.lat) || 8.5956;
  const lng = parseFloat(m.longitud || m.longitude || m.lng || m.coordinates?.lng) || -71.1437;
  const alt = parseInt(m.altitud || m.altitude || m.alt || m.coordinates?.alt, 10) || 1620;

  // Sanitizar descripción pública para que JAMÁS exponga comprobantes bancarios, referencias o teléfonos de pagadores
  const cleanCategory = m.categoria_negocio || 'Gastronomía Andina';
  const cleanMunicipio = m.municipio || 'Mérida, Venezuela';
  
  let publicDescription = `Establecimiento formal de ${cleanCategory} ubicado en ${cleanMunicipio}, comprometido con la hospitalidad y la excelencia de la gastronomía andina.`;
  let publicTagline = `${cleanCategory} • Miembro Oficial Cámara Gastronómica`;

  if (m.observaciones && typeof m.observaciones === 'string') {
    const raw = m.observaciones.trim();
    if (raw.includes('Ref:') || raw.includes('Tel. Pagador') || raw.includes('Monto Bs') || raw.includes('Registro Web') || raw.includes('Pago Móvil')) {
      const match = raw.match(/Descripción:\s*([^.]+)/i) || raw.match(/Especialidad:\s*([^.]+)/i);
      if (match && match[1] && match[1].trim().length > 3) {
        publicDescription = `${match[1].trim()}. Establecimiento miembro de la Cámara Gastronómica del Estado Mérida.`;
        publicTagline = match[1].trim();
      }
    } else if (raw.length > 5) {
      publicDescription = raw;
      publicTagline = raw;
    }
  }

  return {
    id: m.codigo_afiliado ? `cgm-${m.codigo_afiliado.toLowerCase().replace(/[^a-z0-9]/g, '-')}` : `cgm-${m.id || Math.random()}`,
    codigo_afiliado: m.codigo_afiliado,
    name: m.nombre_establecimiento,
    slug: slug || `miembro-${m.codigo_afiliado || m.id}`,
    tagline: publicTagline,
    eje,
    ejeName,
    category: cleanCategory,
    rating: 5.0,
    reviewsCount: 1,
    priceTier: "$$",
    altitude: alt,
    coordinates: { lat, lng, alt },
    latitude: lat,
    longitude: lng,
    location: m.direccion_completa ? `${m.direccion_completa}${m.municipio ? `, ${m.municipio}` : ''}` : cleanMunicipio,
    chef: m.representante_legal || 'Equipo Gastronómico',
    chefBio: `Establecimiento oficial de la Cámara Gastronómica del Estado Mérida bajo la representación de ${m.representante_legal || 'la gerencia'}.`,
    phone: m.telefono || '',
    whatsapp: m.telefono ? m.telefono.replace(/[^0-9+]/g, '') : '',
    instagram: m.instagram || '',
    instagramUrl: m.instagram ? (m.instagram.startsWith('http') ? m.instagram : `https://instagram.com/${m.instagram.replace('@', '')}`) : '',
    facebookUrl: '',
    isCertifiedByCamara: isSolvente,
    isFeatured: m.destacado_portada === true,
    destacado_portada: m.destacado_portada === true,
    certificateNumber: m.codigo_afiliado || 'CGM-2026',
    badge: m.destacado_portada ? '⭐ Joya Destacada de Portada' : (isSolvente ? 'Miembro Oficial Solvente 2026' : 'En Verificación'),
    coverImage: defaultCover,
    gallery,
    description: publicDescription,
    signatureDishes: [
      {
        name: `Especialidad de la Casa - ${m.categoria_negocio}`,
        description: 'Propuesta gastronómica y productos elaborados con altos estándares de calidad e higiene.',
        price: 'Consultar'
      }
    ],
    menuHighlights: [
      "Atención de excelencia",
      "Producto de origen andino",
      "Afiliado Oficial a la Cámara Gastronómica de Mérida"
    ],
    openingHours: "Lunes a Sábado: Horario Comercial",
    features: [
      "Atención Personalizada",
      "Aval Oficial Cámara Gastronómica",
      "Miembro Solvente 2026"
    ]
  };
}

/**
 * Normaliza un nombre para deduplicación insensible a mayúsculas y acentos
 */
export function normalizeEstablishmentName(name) {
  if (!name) return '';
  return name
    .toLowerCase()
    .normalize("NFD").replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]/g, '')
    .trim();
}

/**
 * Consulta los agremiados en Supabase y localStorage
 * y genera la lista sincronizada para la Guía Oficial y el Mapa 3D.
 * Garantiza cero duplicados y respeto estricto a visible_en_guia === false.
 */
export async function fetchLiveRestaurants() {
  let directoryMembers = [];

  // 1. Intentar desde Supabase
  if (supabase) {
    try {
      const { data, error } = await supabase
        .from('directorio_agremiados')
        .select('*')
        .order('created_at', { ascending: false });

      if (!error && data && data.length > 0) {
        directoryMembers = data;
      }
    } catch (e) {
      console.warn('Error fetching supabase directory:', e);
    }
  }

  // 2. Fallback / Sincronización con localStorage
  if (typeof localStorage !== 'undefined') {
    try {
      const localDir = localStorage.getItem('cgem_directorio_agremiados');
      if (localDir) {
        const parsed = JSON.parse(localDir);
        if (Array.isArray(parsed) && parsed.length > 0) {
          if (directoryMembers.length === 0) {
            directoryMembers = parsed;
          } else {
            // Sincronizar overrides de visibilidad locales recientes si existen
            const localMap = new Map(parsed.map(p => [p.id || p.codigo_afiliado, p]));
            directoryMembers = directoryMembers.map(m => {
              const localMatch = localMap.get(m.id) || localMap.get(m.codigo_afiliado);
              if (localMatch && typeof localMatch.visible_en_guia === 'boolean') {
                return { ...m, visible_en_guia: localMatch.visible_en_guia };
              }
              return m;
            });
          }
        }
      }
    } catch (e) {}
  }

  // 3. Obtener perfil enriquecido guardado localmente si existe
  let localBizProfile = null;
  if (typeof localStorage !== 'undefined') {
    try {
      const p = localStorage.getItem('cgem_my_business_profile');
      if (p) localBizProfile = JSON.parse(p);
    } catch (e) {}
  }

  const resultList = [];
  const hiddenNormalizedNames = new Set();
  const hiddenCodes = new Set();
  const processedCodes = new Set();
  const processedNames = new Set();

  // Paso A: Registrar todos los que están explícitamente OCULTOS por administración (visible_en_guia === false)
  directoryMembers.forEach(m => {
    if (m.visible_en_guia === false) {
      if (m.codigo_afiliado) hiddenCodes.add(m.codigo_afiliado.toLowerCase().trim());
      if (m.nombre_establecimiento) hiddenNormalizedNames.add(normalizeEstablishmentName(m.nombre_establecimiento));
    }
  });

  // Paso B: Cargar base inicial RESTAURANTS_DATA (Kaffia)
  RESTAURANTS_DATA.forEach(r => {
    const normName = normalizeEstablishmentName(r.name);
    const code = (r.certificateNumber || '').toLowerCase().trim();

    // Si la administración lo marcó como oculto, omitir
    if (hiddenNormalizedNames.has(normName) || (code && hiddenCodes.has(code))) {
      return;
    }

    let finalObj = { ...r };
    if (localBizProfile && (localBizProfile.id === r.id || normalizeEstablishmentName(localBizProfile.name) === normName)) {
      finalObj = { ...finalObj, ...localBizProfile };
    }

    resultList.push(finalObj);
    processedNames.add(normName);
    if (code) processedCodes.add(code);
  });

  // Paso C: Procesar y agregar miembros del Directorio de Agremiados
  directoryMembers.forEach(m => {
    // Si está marcado como oculto en web por la junta directiva, JAMÁS mostrar
    if (m.visible_en_guia === false) {
      return;
    }

    const normName = normalizeEstablishmentName(m.nombre_establecimiento);
    const code = (m.codigo_afiliado || '').toLowerCase().trim();

    // Si coincide con un miembro oculto, omitir
    if (hiddenNormalizedNames.has(normName) || (code && hiddenCodes.has(code))) {
      return;
    }

    // Si ya fue procesado (por ejemplo Kaffia de RESTAURANTS_DATA o registro duplicado), omitir para evitar duplicados
    if (processedNames.has(normName) || (code && processedCodes.has(code))) {
      return;
    }

    const converted = convertAgremiadoToRestaurant(m);

    // Si el usuario tiene una ficha enriquecida guardada en local storage para este negocio, fusionarla
    if (localBizProfile && (
      localBizProfile.id === converted.id ||
      normalizeEstablishmentName(localBizProfile.name) === normName ||
      (localBizProfile.certificateNumber && localBizProfile.certificateNumber.toLowerCase().trim() === code)
    )) {
      Object.assign(converted, {
        ...localBizProfile,
        id: converted.id,
        isCertifiedByCamara: converted.isCertifiedByCamara,
        badge: converted.badge
      });
    }

    resultList.push(converted);
    processedNames.add(normName);
    if (code) processedCodes.add(code);
  });

  return resultList;
}
