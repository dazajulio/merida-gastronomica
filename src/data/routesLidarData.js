export const LIDAR_ROUTES = [
  {
    id: "merida",
    name: "Mérida",
    tag: "Casco Histórico, Alta Cocina & Cultura",
    color: "#22c55e",
    distanceKm: "25 km",
    checkpoints: [
      { name: "Kaffia Caffe (Las Heroínas)", type: "restaurant", refId: "rest-kaffia", lat: 8.5956, lng: -71.1437 },
      { name: "Estación Barinitas (Teleférico Mukumbarí)", type: "attraction", lat: 8.5925, lng: -71.1432 },
      { name: "Plaza Bolívar & Casco Histórico", type: "attraction", lat: 8.5983, lng: -71.1449 },
      { name: "Sector Milla & Jardín Botánico", type: "attraction", lat: 8.6085, lng: -71.1390 },
      { name: "Los Próceres & Centro Gastronómico", type: "attraction", lat: 8.5820, lng: -71.1650 }
    ],
    highlights: [
      "Epicentro cosmopolita y de alta cocina andina",
      "Restaurantes de autor, cafeterías de especialidad y bistrós",
      "Patrimonio arquitectónico colonial y cultural"
    ],
    description: "El epicentro cosmopolita y de alta gastronomía de los Andes. Combina arquitectura colonial, el teleférico más alto del mundo y propuestas gastronómicas de vanguardia."
  },
  {
    id: "valle-san-javier",
    name: "El Valle de San Javier",
    tag: "Naturaleza, Posadas & Sabores de Montaña",
    color: "#10b981",
    distanceKm: "28 km",
    checkpoints: [
      { name: "Tabay Centro & Plaza", type: "town", lat: 8.6315, lng: -71.0712 },
      { name: "Valle de San Javier", type: "attraction", lat: 8.6500, lng: -71.0600 },
      { name: "Parque La Mucuy (Sierra Nevada)", type: "nature", lat: 8.6280, lng: -71.0350 },
      { name: "Aguas Termales de Tabay", type: "thermal", lat: 8.6190, lng: -71.0580 }
    ],
    highlights: [
      "Posadas campestres y gastronomía de montaña",
      "Senderos ecológicos y contacto con la naturaleza",
      "Aguas termales minerales y descanso"
    ],
    description: "Un oasis verde de posadas campestres, arquitectura rústica andina, gastronomía reconfortante y manantiales termales a los pies de la Sierra Nevada."
  },
  {
    id: "paramo",
    name: "Páramo Andino & Sierra Nevada",
    tag: "Truchas, Fogones & Frailejones",
    color: "#06b6d4",
    distanceKm: "76 km",
    checkpoints: [
      { name: "Mucurubá", type: "town", lat: 8.7061, lng: -70.9702 },
      { name: "Mucuchíes & San Rafael", type: "town", lat: 8.7482, lng: -70.9168 },
      { name: "Apartaderos & San Rafael de Mucuchíes", type: "town", lat: 8.7840, lng: -70.8500 },
      { name: "Laguna de Mucubají", type: "nature", lat: 8.8012, lng: -70.8290 },
      { name: "Collado del Cóndor (Pico El Águila)", type: "summit", lat: 8.8523, lng: -70.8124 }
    ],
    highlights: [
      "Trucha andina fresca en múltiples preparaciones",
      "Pizcas andinas, arepas de trigo y dulces típicos",
      "Paisajes de frailejones y lagunas glaciares"
    ],
    description: "Travesía por la Carretera Trasandina entre huertas de hortalizas, iglesias de piedra, lagunas glaciares y fogones donde reina la trucha fresca, la sopa de ajo y el chocolate caliente."
  },
  {
    id: "mocoties",
    name: "Valle del Mocotíes & Ruta del Café",
    tag: "Café de Especialidad, Tostadurías & Arte",
    color: "#c99738",
    distanceKm: "62 km",
    checkpoints: [
      { name: "Santa Cruz de Mora (Haciendas de Café)", type: "coffee", lat: 8.4053, lng: -71.6738 },
      { name: "Tovar Colonial & Centro de Arte", type: "town", lat: 8.3378, lng: -71.7589 },
      { name: "Bailadores & Cascadas", type: "town", lat: 8.2435, lng: -71.8211 },
      { name: "Zea", type: "town", lat: 8.3789, lng: -71.7821 }
    ],
    highlights: [
      "Cuna del café de especialidad y tostadurías",
      "Fincas cafetaleras centenarias y catas sensoriales",
      "Tradición cultural, artes plásticas y quesos ahumados"
    ],
    description: "La cuna del café y la tradición artesanal. Fincas centenarias donde se producen microlotes premiados, tostadurías de vanguardia y una vibrante cultura gastronómica."
  },
  {
    id: "pueblos-sur",
    name: "Pueblos del Sur",
    tag: "Patrimonio Ancestral, Panela & Miche",
    color: "#eec26f",
    distanceKm: "94 km",
    checkpoints: [
      { name: "Aricagua", type: "town", lat: 8.2167, lng: -71.1333 },
      { name: "Canaguá Colonial", type: "town", lat: 8.1124, lng: -71.4356 },
      { name: "Chacantá", type: "town", lat: 8.1633, lng: -71.4889 },
      { name: "Guaraque", type: "town", lat: 8.1500, lng: -71.6500 }
    ],
    highlights: [
      "Sabores autóctonos y cocina campesina auténtica",
      "Moliendas de panela, trapiches y destilados de hierbas",
      "Pueblos coloniales de arquitectura de tapia y teja"
    ],
    description: "Una inmersión profunda en la Venezuela andina rural más pura. Caminos de historia, posadas coloniales, trapiches de caña y recetas autóctonas transmitidas por generaciones."
  },
  {
    id: "panamericano",
    name: "Panamericano, Cacao",
    tag: "Cacao Porcelana Fino & Sabor Lacustre",
    color: "#f59e0b",
    distanceKm: "85 km",
    checkpoints: [
      { name: "El Vigía (Centro Logístico)", type: "city", lat: 8.6256, lng: -71.6508 },
      { name: "Plantaciones de Cacao Sur del Lago", type: "coffee", lat: 8.6401, lng: -71.6812 },
      { name: "Santa Elena de Arenales", type: "town", lat: 8.7845, lng: -71.5122 },
      { name: "Palmarito (Playa Lacustre)", type: "beach", lat: 9.0734, lng: -71.4231 }
    ],
    highlights: [
      "El territorio sagrado del Cacao Criollo Porcelana",
      "Gastronomía de carnes premium, plátano y queso de mano",
      "Tradición lacustre de pescados frescos a orillas del Lago"
    ],
    description: "El cálido contraste del trópico merideño. El origen del legendario Cacao Porcelana, la ganadería de calidad y la cocina lacustre a orillas del Lago de Maracaibo."
  }
];
