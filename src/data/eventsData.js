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
  {
    id: 'andes-business-merida-2026',
    title: 'Andes Business Mérida 2026',
    date: '4, 5 y 6 de Diciembre de 2026',
    month: 'Diciembre',
    location: 'Hotel La Pedregosa, Mérida',
    category: 'Encuentro Empresarial & Turístico',
    badge: 'Stands & Ruedas de Negocios B2B',
    accessType: 'third_party',
    ticketPrice: 'Pago Tercero • Coordinar con la empresa',
    thirdPartyNote:
      'Evento organizado por terceros. Espacios para marcas y stands limitados. Coordinar inscripción y disponibilidad directamente con Andes Business Eventos (+58 414-7187233 / +58 426-8316561).',
    description:
      'Punto de encuentro donde el sector empresarial y turístico de Venezuela se reúne para generar negocios reales. Stands de exhibición en Salón Barquisimeto, rueda de negocios y conferencias magistrales con Luis Vicente León y Richard Ujueta en Salón Tibisay.',
    highlights: [
      'Stands y Exhibición de marcas en Salón Barquisimeto',
      'Rueda de Negocios y alianzas estratégicas B2B',
      'Conferencias estelares en Salón Tibisay: Luis Vicente León (5 Dic) y Richard Ujueta (6 Dic)',
      'Contacto directo para marcas y stands: +58 414-7187233 / +58 426-8316561 / @andesbusinesseventos',
    ],
    image: '/images/eventos/andes-business-flyer-main.jpg',
    imageAspect: '3:4',
  },
];
