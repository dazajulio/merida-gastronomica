export const RESTAURANTS_DATA = [
  {
    id: "rest-01",
    name: "La Abadía Restaurant & Cava Andina",
    slug: "la-abadia-merida",
    tagline: "Alta cocina de autor en un claustro colonial del siglo XVII",
    eje: "metropolitano",
    ejeName: "Eje Metropolitano (Mérida Ciudad)",
    category: "Alta Cocina Andina",
    rating: 4.9,
    reviewsCount: 184,
    priceTier: "$$$$",
    altitude: 1630,
    location: "Av. 3 entre Calles 17 y 18, Casco Histórico, Mérida",
    chef: "Nelson Castro",
    chefBio: "Pionero en la reinterpretación vanguardista de la despensa andina con técnicas de cocción al vacío y ahumados de leña de café.",
    phone: "+58 274 252 2950",
    whatsapp: "+58 414 748 1122",
    instagram: "@laabadiamerida",
    isCertifiedByCamara: true,
    certificateNumber: "CGM-2026-001",
    badge: "Plato de Oro Cámara 2026",
    coverImage: "https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=1200&q=80",
    gallery: [
      "https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1550966871-3ed3cdb5ed0c?auto=format&fit=crop&w=800&q=80",
      "/images/media_1787912976463.jpg"
    ],
    coordinates: { lat: 8.5983, lng: -71.1449 },
    description: "Ubicado en el corazón histórico de Mérida, La Abadía conjuga muros de piedra colonial con una propuesta de alta gastronomía andina contemporánea. Cuenta con la cava subterránea de vinos y destilados artesanales más prestigiosa del occidente venezolano.",
    signatureDishes: [
      {
        name: "Trucha Asalmonada de Altura al Emulsión de Frailejón y Mantequilla Ahumada",
        description: "Trucha criada a 3.200 msnm con costra de hierbas de páramo, puré de apio criollo y reducción de miche andino.",
        price: "$24"
      },
      {
        name: "Pizca Andina Revisitada con Huevo Poché y Queso Ahumado Curado 18 Meses",
        description: "Fondo blanco de ternera infusionado en cilantro cimarrón silvestre, crumble de arepa de trigo y crema trufada.",
        price: "$16"
      },
      {
        name: "Solomillo de Novillo Andino al Cacao Criollo Porcelana",
        description: "Corte de res de pastoreo de montaña glaseado en salsa demi-glace de cacao Porcelana 72% y nibs tostados.",
        price: "$28"
      }
    ],
    menuHighlights: [
      "Carpaccio de trucha curada con cítricos del Mocotíes",
      "Pastelitos andinos de masa hojaldrada con morcilla y queso de cabra de Lagunillas",
      "Postre: Domo de Chocolate Criollo con corazón líquido de mora silvestre"
    ],
    openingHours: "Martes a Domingo: 12:00 PM - 11:30 PM",
    features: ["Cava Privada", "Terraza Colonial", "Música Andina en Vivo", "Valet Parking", "Carta de Vinos Internacional"]
  },
  {
    id: "rest-02",
    name: "Refugio del Páramo & Fogón Mucubají",
    slug: "refugio-mucubaji",
    tagline: "Cocina de fuego y leña a 3.500 msnm con vista a la Sierra de Santo Domingo",
    eje: "paramo",
    ejeName: "Eje del Páramo (Apartaderos & Mucubají)",
    category: "Tradición de Montaña",
    rating: 4.8,
    reviewsCount: 220,
    priceTier: "$$$",
    altitude: 3550,
    location: "Carretera Trasandina, Sector Laguna de Mucubají, Apartaderos",
    chef: "Doña Gregoria Rangel",
    chefBio: "Guardián de la memoria gustativa andina, preservando recetas centenarias de sopas de páramo, curado de queso y arepas al tiesto de barro.",
    phone: "+58 274 898 5012",
    whatsapp: "+58 412 654 3321",
    instagram: "@refugiodelparamo",
    isCertifiedByCamara: true,
    certificateNumber: "CGM-2026-004",
    badge: "Patrimonio Culinario Vivo",
    coverImage: "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=1200&q=80",
    gallery: [
      "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=800&q=80",
      "/images/media_1787912976453.jpg",
      "/images/media_1787912976463.jpg"
    ],
    coordinates: { lat: 8.7981, lng: -70.8354 },
    description: "Una experiencia sensorial inmersa en la bruma del páramo andino. El aroma a leña de eucalipto, la chimenea encendida y los platos calientes reconstituyen el espíritu tras pasear por las lagunas glaciares.",
    signatureDishes: [
      {
        name: "Sopa de Páramo a la Leña con Papas Nativas Moradas",
        description: "Consomé espeso con hortalizas recién cosechadas de las terrazas de cultivo y costilla ahumada.",
        price: "$14"
      },
      {
        name: "Trucha Andina a la Plancha en Teja de Arcilla",
        description: "Servida con ajo crocante, ensalada tibia de berros y arepas de trigo recién horneadas al budare.",
        price: "$19"
      },
      {
        name: "Chocolate Caliente de Cacao Criollo con Canela y Ron Añejo",
        description: "Bebida densa servida en jarro de barro con queso palmita andino para sumergir al estilo tradicional.",
        price: "$8"
      }
    ],
    menuHighlights: [
      "Arepas de trigo andino hechas a mano",
      "Fresas gigantes con crema de leche fresca del páramo",
      "Chicha andina fermentada en tinaja"
    ],
    openingHours: "Lunes a Domingo: 7:30 AM - 6:00 PM",
    features: ["Chimenea Central", "Vista Panorámica a los Glaciares", "Parqueadero para Carros 4x4", "Tienda de Artesanía Local"]
  },
  {
    id: "rest-03",
    name: "Tostaduría & Laboratorio Café Mocotíes",
    slug: "cafe-mocoties-tovar",
    tagline: "Cafés de especialidad, microlotes de altura y catas sensoriales",
    eje: "mocoties",
    ejeName: "Eje Valle del Mocotíes (Tovar & Santa Cruz)",
    category: "Café de Especialidad",
    rating: 5.0,
    reviewsCount: 142,
    priceTier: "$$",
    altitude: 950,
    location: "Carrera 4 con Calle 6, Tovar, Valle del Mocotíes",
    chef: "Barista Máster Carlos Morales (Q-Grader)",
    chefBio: "Certificado internacionalmente por la SCA, rescata variedades Bourbon Rosado y Geisha cultivadas en las laderas del Mocotíes.",
    phone: "+58 275 873 1400",
    whatsapp: "+58 424 711 9080",
    instagram: "@cafemocotiestovar",
    isCertifiedByCamara: true,
    certificateNumber: "CGM-2026-009",
    badge: "Taza de Excelencia 2026",
    coverImage: "https://images.unsplash.com/photo-1442512595331-e89e73853f31?auto=format&fit=crop&w=1200&q=80",
    gallery: [
      "https://images.unsplash.com/photo-1442512595331-e89e73853f31?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?auto=format&fit=crop&w=800&q=80"
    ],
    coordinates: { lat: 8.3378, lng: -71.7589 },
    description: "El epicentro del café de alta gama en Venezuela. Una tostaduría boutique donde se procesan microlotes con métodos Chemex, V60, Sifón Japonés y Espresso de precisión, maridados con repostería andina.",
    signatureDishes: [
      {
        name: "Experiencia Sensorial: Trilogía de Fermentaciones Mocotíes",
        description: "Degustación de café Geisha en proceso Lavado, Honey y Natural con notas a flor de jazmín y durazno.",
        price: "$12"
      },
      {
        name: "Tarta Hojaldrada de Higo Andino con Crema de Queso Ahumado",
        description: "Higos confitados en almíbar de panela sobre base de almendras y reducción de café espresso.",
        price: "$9"
      }
    ],
    menuHighlights: [
      "Cold Brew infusionado con cáscara de café y naranja valenciana",
      "Pastelería francesa con masa madre de fermentación lenta",
      "Venta de granos tostados en origen con fecha y perfil de taza"
    ],
    openingHours: "Lunes a Sábado: 8:00 AM - 8:00 PM",
    features: ["Laboratorio de Catas", "Barra de Métodos Filtrados", "Venta de Grano en Empaque con Válvula", "Wi-Fi de Alta Velocidad"]
  },
  {
    id: "rest-04",
    name: "Chocolatería Hacienda Porcelana Sur del Lago",
    slug: "hacienda-porcelana",
    tagline: "El cacao criollo más fino del mundo transformado en arte Bean-to-Bar",
    eje: "panamericano",
    ejeName: "Eje Panamericano & Sur del Lago (Palmarito - El Vigía)",
    category: "Chocolatería de Origen",
    rating: 4.9,
    reviewsCount: 167,
    priceTier: "$$$",
    altitude: 65,
    location: "Km 18 Carretera Panamericana, Hacienda La Soledad, Sur del Lago",
    chef: "Maestra Chocolatera Valentina Uzcátegui",
    chefBio: "Formada en Lyon y Bélgica, regresó a su tierra natal para revalorizar el grano blanco criollo ancestral de la cuenca lacustre.",
    phone: "+58 275 881 2290",
    whatsapp: "+58 414 976 5432",
    instagram: "@cacaoporcelanamerida",
    isCertifiedByCamara: true,
    certificateNumber: "CGM-2026-012",
    badge: "Denominación de Origen Protegida",
    coverImage: "https://images.unsplash.com/photo-1511381939415-e44015466834?auto=format&fit=crop&w=1200&q=80",
    gallery: [
      "https://images.unsplash.com/photo-1511381939415-e44015466834?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1549007994-cb92caebd54b?auto=format&fit=crop&w=800&q=80"
    ],
    coordinates: { lat: 8.6256, lng: -71.6508 },
    description: "Una inmersión al origen del mítico Cacao Criollo Porcelana. En la calidez de las laderas que descienden hacia el Lago de Maracaibo, esta boutique ofrece recorridos por plantaciones de sombra, talleres de tostado y bombones de autor.",
    signatureDishes: [
      {
        name: "Colección de Bombones Botánicos Andinos (Caja de 12 Unidades)",
        description: "Bombones de chocolate 70% rellenos de reducción de mora de páramo, ron añejo, miche andino y polen silvestre.",
        price: "$22"
      },
      {
        name: "Mousse de Cacao Blanco Porcelana con Crujiente de Panela",
        description: "Postre aterciopelado sin amargor, notas a mantequilla de nueces y tierra húmeda tropical.",
        price: "$11"
      }
    ],
    menuHighlights: [
      "Bebida ceremonial de cacao con especias autóctonas",
      "Fondue de chocolate amargo con frutas andinas exóticas",
      "Tabletas 100% Porcelana Gran Reserva"
    ],
    openingHours: "Miércoles a Domingo: 9:00 AM - 6:00 PM",
    features: ["Recorrido Guiado por Cacaotales", "Cata a Ciegas", "Tienda Boutique", "Zona de Degustación Climatizada"]
  },
  {
    id: "rest-05",
    name: "La Sevillana Mirador & Cava de Valle Grande",
    slug: "la-sevillana-valle-grande",
    tagline: "Cocina ibérica-andina con panorámica de 360 grados sobre el Valle de San Javier",
    eje: "metropolitano",
    ejeName: "Eje Metropolitano (El Valle - Valle Grande)",
    category: "Fusión & Carnes",
    rating: 4.8,
    reviewsCount: 198,
    priceTier: "$$$$",
    altitude: 2100,
    location: "Sector El Arado, Carretera El Valle, Mérida",
    chef: "Alfonso Gómez & Mariana Briceño",
    chefBio: "Dúo gastronómico que entrelaza la cocina de brasas ibéricas con tubérculos y truchas de los ríos de montaña merideños.",
    phone: "+58 274 244 8920",
    whatsapp: "+58 412 888 7766",
    instagram: "@lasevillanamerida",
    isCertifiedByCamara: true,
    certificateNumber: "CGM-2026-003",
    badge: "Mejor Vista Gastronómica 2026",
    coverImage: "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=1200&q=80",
    gallery: [
      "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=800&q=80"
    ],
    coordinates: { lat: 8.6421, lng: -71.1123 },
    description: "Enclavado en las laderas de Valle Grande, La Sevillana ofrece una de las postales más imponentes de la Sierra de La Culata, con cortes de carne madurados a la brasa, jamones curados en aire andino y paellas de trucha.",
    signatureDishes: [
      {
        name: "Tomahawk Madurado 45 Días a la Brasa de Roble Andino",
        description: "Carne premium con sal marina rosada, mantequilla clarificada de hierbas y papas rústicas al romero.",
        price: "$42"
      },
      {
        name: "Arroz Caldoso con Trucha Ahumada y Setas de Pino Silvestres",
        description: "Arroz bomba cocido en fumet concentrado de trucha y hongos recolectados en los bosques de pino de Tabay.",
        price: "$26"
      }
    ],
    menuHighlights: [
      "Tabla de quesos madurados de San Rafael de Mucuchíes",
      "Sangría de autor con frutas de páramo y especias calientes",
      "Crema catalana perfumada con cáscara de limón criollo"
    ],
    openingHours: "Jueves a Domingo: 12:30 PM - 10:00 PM",
    features: ["Terraza Mirador", "Heli-pad para Traslados VIP", "Bodega Climatizada", "Espacio para Eventos y Bodas"]
  },
  {
    id: "rest-06",
    name: "Posada & Fogón Canaguá Ancestral",
    slug: "canagua-ancestral",
    tagline: "Sabores olvidados de los Pueblos del Sur y cocina de herencia campesina",
    eje: "pueblos-sur",
    ejeName: "Eje Pueblos del Sur (Canaguá & Chacantá)",
    category: "Gastronomía Ancestral",
    rating: 4.9,
    reviewsCount: 89,
    priceTier: "$$",
    altitude: 1490,
    location: "Calle Comercio, Frente a la Plaza Bolívar, Canaguá",
    chef: "Hermelinda Guerrero",
    chefBio: "Matrona culinaria de cuarta generación en los Pueblos del Sur, guardiana de la panela orgánica, miche destilado en alambique de cobre y curado de carnes.",
    phone: "+58 275 442 1005",
    whatsapp: "+58 416 321 9988",
    instagram: "@canagua_ancestral",
    isCertifiedByCamara: true,
    certificateNumber: "CGM-2026-015",
    badge: "Excelencia Tradicional",
    coverImage: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1200&q=80",
    gallery: [
      "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=800&q=80",
      "/images/media_1787912976453.jpg"
    ],
    coordinates: { lat: 8.1124, lng: -71.4356 },
    description: "Una travesía a los pueblos más recónditos y vírgenes del estado Mérida. Aquí el tiempo se detiene para saborear la auténtica gastronomía andina prehispánica y colonial, elaborada con ingredientes 100% orgánicos.",
    signatureDishes: [
      {
        name: "Lapa Criolla Estofada en Salsa de Panela y Clavos de Olor",
        description: "Guiso tradicional de cocción lenta servido con plátano maduro horneado y arepa de maíz pilado.",
        price: "$15"
      },
      {
        name: "Mestiza Andina: Degustación de Cuajadas Frescas y Miche Callejón",
        description: "Quesos recién prensados con hojas de plátano acompañados de aguardiente aromatizado con díctamo real.",
        price: "$10"
      }
    ],
    menuHighlights: [
      "Café colado en manga de tela de lienzo",
      "Dulce de lechosa verde con clavitos y papelón",
      "Mojo trujillano-merideño con leche y huevos criollos"
    ],
    openingHours: "Lunes a Domingo: 7:00 AM - 7:30 PM",
    features: ["Alojamiento Colonial", "Rutas a Caballo", "Taller de Alambique Artesanal", "Huerto Orgánico Visitables"]
  }
];
