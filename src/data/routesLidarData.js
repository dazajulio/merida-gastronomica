export const LIDAR_ROUTES = [
  {
    id: "eje-metropolitano",
    name: "Eje 1: Metropolitano & Valle de San Javier",
    tag: "Alta Cocina, Historia & Cumbres",
    color: "#22c55e",
    altitudeSpan: "1.620 msnm - 4.765 msnm",
    distanceKm: "38 km",
    checkpoints: [
      { name: "Kaffia Caffe (Las Heroínas)", alt: 1620, type: "restaurant", refId: "rest-kaffia", lat: 8.59480, lng: -71.14388 },
      { name: "Estación Barinitas (Teleférico Mukumbarí)", alt: 1577, type: "attraction", lat: 8.5925, lng: -71.1432 },
      { name: "Plaza Bolívar & Casco Histórico", alt: 1630, type: "attraction", lat: 8.5983, lng: -71.1449 },
      { name: "Tabay & Valle de San Javier", alt: 1708, type: "thermal", lat: 8.6315, lng: -71.0712 },
      { name: "Estación Pico Espejo (Mukumbarí)", alt: 4765, type: "summit", lat: 8.5284, lng: -71.0503 }
    ],
    elevationProfile: [
      { label: "Kaffia (Las Heroínas)", alt: 1620 },
      { label: "Plaza Bolívar", alt: 1630 },
      { label: "Tabay", alt: 1708 },
      { label: "La Aguada", alt: 3452 },
      { label: "Loma Redonda", alt: 4045 },
      { label: "Pico Espejo", alt: 4765 }
    ],
    description: "El epicentro cosmopolita y de alta gastronomía de los Andes. Combina arquitectura colonial, el teleférico más alto del mundo y miradores de alta cocina con vistas al Pico Bolívar."
  },
  {
    id: "eje-paramo",
    name: "Eje 2: Páramo Andino & Sierra Nevada",
    tag: "Truchas, Fogones & Frailejones",
    color: "#00ffcc",
    altitudeSpan: "2.300 msnm - 4.118 msnm",
    distanceKm: "76 km",
    checkpoints: [
      { name: "Mucurubá", alt: 2407, type: "town", lat: 8.7061, lng: -70.9702 },
      { name: "Mucuchíes & San Rafael", alt: 2980, type: "town", lat: 8.7482, lng: -70.9168 },
      { name: "Apartaderos & San Rafael de Mucuchíes", alt: 3342, type: "town", lat: 8.7840, lng: -70.8500 },
      { name: "Laguna de Mucubají", alt: 3550, type: "nature", lat: 8.8012, lng: -70.8290 },
      { name: "Collado del Cóndor (Pico El Águila)", alt: 4118, type: "summit", lat: 8.8523, lng: -70.8124 }
    ],
    elevationProfile: [
      { label: "Mucurubá", alt: 2407 },
      { label: "Mucuchíes", alt: 2980 },
      { label: "San Rafael", alt: 3140 },
      { label: "Apartaderos", alt: 3342 },
      { label: "Mucubají", alt: 3550 },
      { label: "Pico Águila", alt: 4118 }
    ],
    description: "Travesía por la Carretera Trasandina entre huertas de hortalizas, iglesias de piedra de Juan Félix Sánchez, lagunas glaciares y parajes con chimenea donde reina la trucha fresca y el chocolate caliente."
  },
  {
    id: "eje-mocoties",
    name: "Eje 3: Valle del Mocotíes & Ruta del Café",
    tag: "Café de Especialidad, Tostadurías & Arte",
    color: "#c99738",
    altitudeSpan: "800 msnm - 1.800 msnm",
    distanceKm: "62 km",
    checkpoints: [
      { name: "Santa Cruz de Mora (Haciendas de Café)", alt: 880, type: "coffee", lat: 8.4053, lng: -71.6738 },
      { name: "Tovar Colonial & Centro de Arte", alt: 950, type: "town", lat: 8.3378, lng: -71.7589 },
      { name: "Bailadores & Cascadas", alt: 1745, type: "town", lat: 8.2435, lng: -71.8211 },
      { name: "Zea", alt: 910, type: "town", lat: 8.3789, lng: -71.7821 }
    ],
    elevationProfile: [
      { label: "Santa Cruz", alt: 880 },
      { label: "Tovar", alt: 950 },
      { label: "Mesa Bolívar", alt: 1150 },
      { label: "Bailadores", alt: 1745 }
    ],
    description: "La cuna del café de altura y la tradición artesanal. Fincas centenarias donde se producen microlotes galardonados mundialmente y una efervescente escena de barismo y quesos ahumados."
  },
  {
    id: "eje-pueblos-sur",
    name: "Eje 4: Pueblos del Sur & Sabores Ancestrales",
    tag: "Patrimonio Oculto, Panela & Miche",
    color: "#eec26f",
    altitudeSpan: "1.200 msnm - 2.800 msnm",
    distanceKm: "94 km",
    checkpoints: [
      { name: "Aricagua", alt: 1610, type: "town", lat: 8.2167, lng: -71.1333 },
      { name: "Canaguá Colonial", alt: 1490, type: "town", lat: 8.1124, lng: -71.4356 },
      { name: "Chacantá", alt: 1800, type: "town", lat: 8.1633, lng: -71.4889 },
      { name: "Guaraque", alt: 1515, type: "town", lat: 8.1500, lng: -71.6500 }
    ],
    elevationProfile: [
      { label: "Aricagua", alt: 1610 },
      { label: "Canaguá", alt: 1490 },
      { label: "Mucuchachí", alt: 1750 },
      { label: "Chacantá", alt: 1800 },
      { label: "Páramo San José", alt: 2800 }
    ],
    description: "Una inmersión profunda a la Venezuela andina rural más pura. Caminos de herradura, posadas de tapia y teja, alambiques de miche de hierbas y agricultura sin químicos."
  },
  {
    id: "eje-panamericano",
    name: "Eje 5: Panamericano, Cacao Porcelana & Lago",
    tag: "Cacao Blanco Fino & Sabor Lacustre",
    color: "#f59e0b",
    altitudeSpan: "10 msnm - 250 msnm",
    distanceKm: "85 km",
    checkpoints: [
      { name: "El Vigía (Centro Logístico)", alt: 130, type: "city", lat: 8.6256, lng: -71.6508 },
      { name: "Plantaciones de Cacao Sur del Lago", alt: 65, type: "coffee", lat: 8.6401, lng: -71.6812 },
      { name: "Santa Elena de Arenales", alt: 85, type: "town", lat: 8.7845, lng: -71.5122 },
      { name: "Palmarito (Playa Lacustre)", alt: 10, type: "beach", lat: 9.0734, lng: -71.4231 }
    ],
    elevationProfile: [
      { label: "El Vigía", alt: 130 },
      { label: "Sur del Lago", alt: 65 },
      { label: "Caño Zancudo", alt: 85 },
      { label: "Palmarito Lago", alt: 10 }
    ],
    description: "El cálido contraste del trópico merideño. El territorio sagrado del Cacao Criollo Porcelana y la desembocadura lacustre en Palmarito con su tradición pesquera y festiva."
  }
];
