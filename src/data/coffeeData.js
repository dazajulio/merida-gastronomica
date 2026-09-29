export const COFFEE_DATA = {
  hero: {
    badge: "Café de Especialidad Andino • Origen Mérida",
    title: "Café de Altura: La Alquimia de la Cordillera Merideña",
    subtitle: "Entre 1.200 y 2.200 metros sobre el nivel del mar, los microclimas andinos, las neblinas vespertinas y los suelos volcánicos dan vida a granos arábica de perfil sensorial extraordinario.",
    quote: "Cada taza de café merideño encierra la pureza de los páramos y la maestría de generaciones caficultoras."
  },
  regions: [
    {
      id: "santa-cruz",
      name: "Santa Cruz de Mora & Valle del Mocotíes",
      altitude: "1.200 - 1.650 msnm",
      varieties: "Typica, Bourbon, Caturra, Catuaí",
      flavorProfile: "Notas a panela, caña de azúcar, cítricos dulces y chocolate con leche. Acidez media-alta muy limpia.",
      description: "Cuna cafetalera histórica del occidente venezolano, con haciendas centenarias y métodos tradicionales combinados con fermentaciones controladas.",
      icon: "Mountain"
    },
    {
      id: "zea-albarregas",
      name: "Zea, Tovar & Cuenca Alta del Escalante",
      altitude: "1.300 - 1.800 msnm",
      varieties: "Caturra Rojo, Bourbon Amarillo, Colombia",
      flavorProfile: "Cuerpo sedoso, notas florales a azahar, frutos amarillos (durazno, maracuyá) y miel de bosque.",
      description: "Terrenos empinados bajo sombra natural de guamos y bucares que permiten una maduración lenta de la cereza.",
      icon: "Sparkles"
    },
    {
      id: "pueblos-sur",
      name: "Los Pueblos del Sur (Canaguá, Chacantá, Mucuchachí)",
      altitude: "1.450 - 2.100 msnm",
      varieties: "Typica Antigua, Geisha Andino, San Bernardo",
      flavorProfile: "Complejidad aromática excelsa, notas a jazmín, mora andina, té negro y cacao criollo.",
      description: "Uno de los terruños más aislados y puros del estado, con prácticas agroecológicas ancestrales y secado en camas africanas.",
      icon: "Compass"
    },
    {
      id: "paramo-chachopo",
      name: "Valle Alto & Piedemonte de Chachopo / Timotes",
      altitude: "1.600 - 2.200 msnm",
      varieties: "Mundo Novo, Caturra de Altura",
      flavorProfile: "Acidez fosfórica brillante, notas a manzana verde, nueces tostadas y caramelo fino.",
      description: "Límite biológico superior para el café arábica. Maduración extrema que concentra azúcares y densidad en grano.",
      icon: "Shield"
    }
  ],
  methods: [
    {
      id: "v60",
      name: "Hario V60",
      type: "Filtrado por Goteo",
      ratio: "1:15 (18g café / 270ml agua)",
      time: "2:45 - 3:15 min",
      highlight: "Destaca la acidez cítrica brillante y notas florales sutiles del café andino.",
      grind: "Media-Fina"
    },
    {
      id: "chemex",
      name: "Chemex Clásica",
      type: "Filtrado Triple Capa",
      ratio: "1:16 (30g café / 480ml agua)",
      time: "4:00 - 4:30 min",
      highlight: "Taza ultra limpia, cristalina, ideal para cafés lavados de Canaguá y Santa Cruz.",
      grind: "Media-Gruesa"
    },
    {
      id: "aeropress",
      name: "AeroPress Invertido",
      type: "Inmersión & Presión",
      ratio: "1:13 (18g café / 234ml agua)",
      time: "1:45 min",
      highlight: "Mayor cuerpo y dulzor acaramelado, excelente para varietales Bourbon y Catuaí Honey.",
      grind: "Media"
    },
    {
      id: "sifon",
      name: "Sifón Japonés al Vacío",
      type: "Vacío Térmico",
      ratio: "1:14 (20g café / 280ml agua)",
      time: "2:00 min",
      highlight: "Espectacular experiencia sensorial y visual, cuerpo sedoso y retrogusto prolongado.",
      grind: "Media"
    }
  ],
  spots: [
    {
      id: "spot-1",
      name: "Laboratorio Andino de Café",
      location: "Sector La Parroquia / Av. Principal",
      specialty: "Microlotes de Canaguá & Tueste en Vivo",
      barista: "Baristas Campeones Regionales",
      tags: ["Tueste Propio", "V60", "Espresso Bar", "Catas Guiadas"]
    },
    {
      id: "spot-2",
      name: "Café de la Niebla - Speakeasy Barista",
      location: "Distrito Cultural Casco Histórico",
      specialty: "Cold Brew infusionado con flores del páramo",
      barista: "Certificación SCA",
      tags: ["Café & Arte", "Sifón Japonés", "Maridaje Andino"]
    },
    {
      id: "spot-3",
      name: "Origen Mocotíes Coffee House",
      location: "Paseo de las Heroínas",
      specialty: "Varietales Bourbon Rosado & Caturra Honey",
      barista: "Tostadores Especialistas",
      tags: ["Grano Entero", "Aeropress", "Repostería de Autor"]
    },
    {
      id: "spot-4",
      name: "Cumbres Cafeteras Boutique",
      location: "Av. Las Américas",
      specialty: "Catas comparativas de 4 altitudes merideñas",
      barista: "Instructores Academy",
      tags: ["Cursos Barismo", "Chemex", "Sello AAA"]
    }
  ],
  qualityMetrics: [
    { label: "Puntaje SCA Promedio", value: "84 - 88+", detail: "Calificación de Grado Especialidad" },
    { label: "Altitud Media", value: "1.650 msnm", detail: "Microclimas de Montaña" },
    { label: "Variedades Principales", value: "100% Arábica", detail: "Sin mezclas robusta" },
    { label: "Secado Artesanal", value: "Solar & Camas", detail: "Control de humedad óptimo (10-12%)" }
  ]
};
