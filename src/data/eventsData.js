/**
 * Agenda Anual de Eventos & Festivales
 * Cámara Gastronómica del Estado Mérida (CGEM)
 * La programación oficial se administra desde la Presidencia de la Cámara.
 */
export const EVENTS_DATA = [
  {
    id: 'noche-atoles-pozo-hondo-2026',
    title: 'Festival La Noche de los Atoles en Pozo Hondo',
    date: '3er Fin de Semana de Diciembre (desde las 4:00 p.m.)',
    month: 'Diciembre',
    location: 'Sector Pozo Hondo, Ejido, Municipio Campo Elías, Mérida',
    category: 'Patrimonio Cultural & Gastronómico',
    badge: 'Patrimonio Cultural del Estado Mérida',
    accessType: 'free',
    hideRsvpButton: true,
    ticketPrice: 'Entrada Libre',
    priceTiers: [
      { id: 'tier-free', name: 'Entrada Libre Comunitaria', priceUSD: 0, isFree: true, note: 'Acceso peatonal al circuito tradicional' }
    ],
    description:
      'Tradicional festividad navideña y cultural declarada Patrimonio Cultural del Estado Mérida. La comunidad de Pozo Hondo se reúne a mostrar pesebres, artesanías y música decembrina, ofreciendo más de 58 variedades de atoles tradicionales junto a hallacas, pan de jamón y dulces criollos.',
    highlights: [
      'Más de 58 variedades de atoles tradicionales (coco, carnavalín, auyama y maíz)',
      'Platos típicos decembrinos: hallacas, pan de jamón, majarete, pasteles, chichas y dulces criollos',
      'Exposición de pesebres comunitarios, artesanías y música navideña en vivo',
      'Recomendación: los visitantes suelen estacionar a 3–4 km y recorrer a pie las calles del sector',
    ],
    image: '/images/eventos/noche-atoles-hero.jpg',
    imageAspect: '16:9',
  },
];
