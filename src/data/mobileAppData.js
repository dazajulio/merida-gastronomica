/**
 * Datos y configuración especializada para la Experiencia Móvil de Mérida Gastronómica
 * Diseñado con doble enfoque:
 * 1. Para el Turista: Logística, Teleférico, Vuelos, Parques, Circuitos y Navegación GPS.
 * 2. Para el Merideño Local: Planes y Promociones semanales, música en vivo, salidas de fin de semana y WhatsApp directo.
 */

// 1. Los 5 Ejes Turísticos & Gastronómicos Oficiales de Mérida
export const TOURIST_AXES = [
  {
    id: 'todos',
    name: 'Todos',
    icon: '🌟',
    badge: 'Toda Mérida',
    description: 'Catálogo completo de establecimientos oficiales'
  },
  {
    id: 'metropolitano',
    name: 'Metropolitano',
    icon: '🏙️',
    badge: 'Mérida Urbana',
    description: 'Casco Histórico, Las Heroínas, Av. Las Américas, Los Próceres y Chorros de Milla',
    keywords: ['merida', 'casco central', 'las heroinas', 'las americas', 'los proceres', 'centro']
  },
  {
    id: 'paramo',
    name: 'Páramo Andino',
    icon: '⛰️',
    badge: 'Páramo Alto',
    description: 'Tabay, Cacute, Mucuchíes, San Rafael de Mucuchíes y Apartaderos',
    keywords: ['paramo', 'tabay', 'mucuchies', 'apartaderos', 'cacute', 'san rafael']
  },
  {
    id: 'valle',
    name: 'El Valle & La Culata',
    icon: '🌲',
    badge: 'Ruta de Montaña',
    description: 'Vía El Valle, La Culata, posadas de encanto, truchas y paseos a caballo',
    keywords: ['valle', 'la culata', 'el valle', 'culata']
  },
  {
    id: 'mocoties',
    name: 'Valle del Mocotíes',
    icon: '🍇',
    badge: 'Mocotíes',
    description: 'Tovar, Bailadores, Zea y Santa Cruz de Mora',
    keywords: ['tovar', 'bailadores', 'mocoties', 'zea', 'santa cruz']
  },
  {
    id: 'sur',
    name: 'Pueblos del Sur',
    icon: '🌾',
    badge: 'Cultura Viva',
    description: 'Canaguá, San José del Sur, Chacantá, Aricagua y Los Nevados',
    keywords: ['sur', 'canagua', 'los nevados', 'aricagua', 'san jose']
  }
];

// 2. Filtros de Antojo Rápido ("¿Qué comer hoy?")
export const CRAVE_FILTERS = [
  { id: 'todos', label: 'Todo', icon: '🍽️' },
  { id: 'cafe', label: 'Café & Dulces', icon: '☕', keywords: ['café', 'cafe', 'postre', 'torta', 'chocolate', 'dulce'] },
  { id: 'carnes', label: 'Carnes & Brasas', icon: '🥩', keywords: ['carne', 'parrilla', 'brasa', 'steak', 'corte', 'grill'] },
  { id: 'trucha', label: 'Trucha & Andino', icon: '🐟', keywords: ['trucha', 'andino', 'sopa', 'pizca', 'criollo'] },
  { id: 'burger_pizza', label: 'Burgers & Pizzas', icon: '🍔', keywords: ['hamburguesa', 'burger', 'pizza', 'italiana', 'pasta'] },
  { id: 'cocteles', label: 'Tragos & Veladas', icon: '🍸', keywords: ['bar', 'coctel', 'vino', 'resto', 'trago', 'cerveza', 'marisqueria'] },
  { id: 'montana', label: 'Bistró de Montaña', icon: '🌄', keywords: ['bistro', 'posada', 'montaña', 'paisaje', 'campo'] }
];

// 3. Planes & Promos de la Semana (El Hook para el Merideño Local y Turista)
export const WEEKLY_PROMOS_DATA = [
  {
    id: 'promo-kaffia-burger',
    title: 'Noches de Burgers de Autor & Sangría 2x1',
    restaurantName: 'Kaffia Caffe',
    badge: 'Jueves a Sábado',
    category: 'Burgers & Tragos',
    image: '/images/kaffia/kaffia-salon-banquete.jpg',
    description: 'Disfruta nuestras hamburguesas gourmet en pan brioche sellado y sangría artesanal con 2x1 en cócteles seleccionados a pasos del teleférico.',
    whatsapp: '584126666954',
    whatsappMessage: 'Hola Kaffia Caffe, vi su promo de Burgers & Sangría en la App de Mérida Gastronómica. Deseo reservar mesa.',
    location: 'Sector Las Heroínas, Casco Central, Mérida',
    price: '$8.50'
  },
  {
    id: 'promo-serrania-parrilla',
    title: 'Domingo de Parrilla Familiar & Cerveza Andina',
    restaurantName: 'Serranía Grill',
    badge: 'Válido Domingos',
    category: 'Carnes & Brasas',
    image: 'https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=900&q=80',
    description: 'Cortes especiales de carne a la parrilla de leña con guasacaca, yuca frita y ensalada andina. 15% de descuento para grupos de 4 o más personas.',
    whatsapp: '584148817137',
    whatsappMessage: 'Hola Serranía Grill, vi su promo de Parrilla Familiar en la App de Mérida Gastronómica. Quiero consultar disponibilidad.',
    location: 'Av. Las Américas, Mérida',
    price: '$22.00 (Combo 4 personas)'
  },
  {
    id: 'promo-chocolates-lamucuy',
    title: 'Cata Guiada de Cacao Criollo & Chocolate Caliente',
    restaurantName: 'Chocolates La Mucuy',
    badge: 'Viernes a Domingo',
    category: 'Café & Dulces',
    image: 'https://images.unsplash.com/photo-1511381939415-e44015466834?auto=format&fit=crop&w=900&q=80',
    description: 'Vive la experiencia Bean-to-Bar al pie del Parque Nacional Sierra Nevada. Degustación de 4 barras de origen y chocolate caliente espeso tradicional.',
    whatsapp: '584148817137',
    whatsappMessage: 'Hola Chocolates La Mucuy, vi la Cata de Chocolate en la App de Mérida Gastronómica. Quisiera agendar para este fin de semana.',
    location: 'Vía La Mucuy Baja, Tabay, Páramo',
    price: '$7.00 p/p'
  },
  {
    id: 'promo-bonavita-fullday',
    title: 'Almuerzo Campestre & Trucha al Romero en El Valle',
    restaurantName: 'Bonavita Bistró',
    badge: 'Fin de Semana',
    category: 'Bistró de Montaña',
    image: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=900&q=80',
    description: 'Escápate del calor de la ciudad al frío de El Valle. Trucha asalmonada fresca cosechada en truchicultura local con papas salteadas y copa de vino blanco.',
    whatsapp: '584148817137',
    whatsappMessage: 'Hola Bonavita Bistró, vi su Almuerzo de Trucha en El Valle en la App de Mérida Gastronómica. Deseo apartar mesa.',
    location: 'Sector El Valle, vía La Culata',
    price: '$12.00'
  },
  {
    id: 'promo-chistorra-mar',
    title: 'Festival de Paella & Cazuelas Marineras',
    restaurantName: 'La Chistorra Marisquería',
    badge: 'Viernes & Sábado Noche',
    category: 'Tragos & Veladas',
    image: 'https://images.unsplash.com/photo-1534422298391-e4f8c172dddb?auto=format&fit=crop&w=900&q=80',
    description: 'La tradición de los frutos del mar en los Andes. Paella valenciana para compartir, tapas ibéricas y música acústica en vivo.',
    whatsapp: '584148817137',
    whatsappMessage: 'Hola La Chistorra Marisquería, vi su Festival de Paella en la App de Mérida Gastronómica. Quiero información para reservar.',
    location: 'Casco Central, Mérida',
    price: '$18.00 (2 personas)'
  },
  {
    id: 'promo-origenes-bistro',
    title: 'Tarde de Café & Dulcería Criolla en Casco Colonial',
    restaurantName: 'Orígenes Bistró & Bar',
    badge: 'Tardes 3:00 PM a 7:00 PM',
    category: 'Café & Dulces',
    image: 'https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?auto=format&fit=crop&w=900&q=80',
    description: 'Disfruta de café de especialidad de Canaguá con torta de queso andino o marquesa de chocolate criollo en una casona colonial patrimonial.',
    whatsapp: '584148817137',
    whatsappMessage: 'Hola Orígenes Bistró, vi la promo de Tardes de Café en la App de Mérida Gastronómica. Deseo ir hoy.',
    location: 'Centro Histórico, Mérida',
    price: '$5.50'
  }
];

// 4. Guía del Viajero & Logística Andina (Información Oficial de Alto Valor)
export const TOURIST_LOGISTICS_HUBS = [
  {
    id: 'teleferico',
    title: 'Teleférico Mukumbarí',
    badge: 'Ícono Mundial',
    subtitle: 'El más alto y largo del mundo',
    shortDesc: 'Horarios de ascenso, tarifas de referencia, estaciones y tips de aclimatación.',
    icon: '🚡',
    image: '/images/merida_hero_gastronomica.jpg',
    color: 'from-emerald-900 to-teal-950',
    details: {
      status: 'Operativo (Jueves a Domingo)',
      hours: '8:00 AM a 1:00 PM (Último ascenso a Loma Redonda / Pico Espejo según clima)',
      location: 'Estación Barinitas, final Calle 24 frente a Plaza Las Heroínas, Mérida',
      rates: [
        { type: 'Turista General (Nacional / Internacional)', price: '$20 USD aprox.' },
        { type: 'Niños (3 a 12 años) y Estudiantes con carnet', price: '$12 USD aprox.' },
        { type: 'Adultos Mayores (60+) y Niños menores de 3 años', price: 'Exonerados / Tarifa preferencial' }
      ],
      stations: [
        { name: '1. Barinitas', alt: '1.577 msnm', note: 'Salida en Las Heroínas. Cafeterías, souvenirs y baños.' },
        { name: '2. La Montaña', alt: '2.436 msnm', note: 'Vista panorámica sobre la meseta de la ciudad.' },
        { name: '3. La Aguada', alt: '3.452 msnm', note: 'Bosque nublado y páramo. Sendero ecológico.' },
        { name: '4. Loma Redonda', alt: '4.045 msnm', note: 'Páramo andino puro. Paseos a caballo a Los Nevados.' },
        { name: '5. Pico Espejo', alt: '4.765 msnm', note: 'Frente a la Virgen de las Nieves y Pico Bolívar. Clima polar.' }
      ],
      tips: [
        'Llevar ropa térmica, guantes, gorro y cortaviento.',
        'Aclimatarse 15 minutos en cada estación para evitar mal de páramo (soroche).',
        'Consumir bebidas calientes y chocolate antes de subir.',
        'Al bajar, almuerza o toma un café en Kaffia Caffe justo al cruzar la Plaza Las Heroínas.'
      ],
      whatsappHelp: '584148817137',
      whatsappText: 'Hola, deseo asesoría turística para visitar el Teleférico Mukumbarí desde la App de Mérida Gastronómica.'
    }
  },
  {
    id: 'vuelos',
    title: 'Vuelos & Aeropuertos',
    badge: 'Conectividad Aérea',
    subtitle: 'El Vigía (VIG) & Mérida (MRD)',
    shortDesc: 'Aeropuertos activos, aerolíneas, líneas de taxi seguras y tiempos de traslado.',
    icon: '✈️',
    image: 'https://images.unsplash.com/photo-1436491865332-7a61a109cc05?auto=format&fit=crop&w=900&q=80',
    color: 'from-sky-950 to-blue-950',
    details: {
      status: 'Vuelos Diarios Activos',
      airports: [
        {
          name: 'Aeropuerto Intl. Juan Pablo Pérez Alfonso (El Vigía - VIG)',
          status: 'Principal entrada aérea',
          airlines: 'Laser, Conviasa, Rutaca',
          routes: 'Caracas (Maiquetía) directos diarios',
          distance: 'A 65 km de Mérida (aprox. 1h 15 min por los túneles de la Autopista Rafael Caldera)',
          taxis: 'Línea de Taxi Oficial del Aeropuerto El Vigía. Tarifa estándar: $40 - $50 USD por viaje en vehículo privado.'
        },
        {
          name: 'Aeropuerto Nal. Alberto Carnevalli (Mérida Ciudad - MRD)',
          status: 'Vuelos comerciales directos en el corazón de la ciudad',
          airlines: 'Conviasa (Atr 42)',
          routes: 'Caracas - Mérida (frecuencias semanales jueves y domingos)',
          distance: 'Ubicado en Av. Urdaneta (a 5 minutos del centro y hoteles de la ciudad)',
          taxis: 'Taxis urbanos disponibles en la terminal ($5 - $10 USD a cualquier punto de la ciudad).'
        }
      ],
      tips: [
        'Coordinar tu traslado El Vigía - Mérida antes de aterrizar con líneas autorizadas.',
        'Los túneles hacia Mérida son una autopista panorámica con vistas a la cordillera.',
        'Lleva efectivo en divisas o pago móvil para los peajes y traslados.'
      ],
      whatsappHelp: '584148817137',
      whatsappText: 'Hola, necesito contacto de taxis y traslados seguros El Vigía - Mérida desde la App de Mérida Gastronómica.'
    }
  },
  {
    id: 'parques',
    title: 'Parques & Atracciones',
    badge: 'Turismo Familiar',
    subtitle: 'La magia de los parques merideños',
    shortDesc: 'Los Aleros, La Venezuela de Antier, Jardín Botánico, Chorros de Milla y Páramo.',
    icon: '🎡',
    image: '/images/el-valle-paisaje.jpg',
    color: 'from-amber-950 to-emerald-950',
    details: {
      status: 'Abiertos en Temporadas & Fines de Semana',
      attractions: [
        {
          name: 'La Venezuela de Antier',
          location: 'Vía Chiguará (a 35 min de Mérida)',
          highlights: 'Pueblo temático con los 12 estados de Venezuela, autos antiguos y comiquerías.',
          hours: '9:00 AM a 5:00 PM (En temporadas y fines de semana)'
        },
        {
          name: 'Los Aleros',
          location: 'Carretera Trasandina, sector Mucurubá (Páramo)',
          highlights: 'El primer pueblo temático de Venezuela. Tradiciones andinas de 1930.',
          hours: '9:00 AM a 5:00 PM'
        },
        {
          name: 'Parque Zoológico Chorros de Milla',
          location: 'Extremo norte de la Av. Chorros de Milla, Mérida',
          highlights: 'Catarata natural, osos frontinos, vegetación andina y clima fresco.',
          hours: 'Martes a Domingo: 8:30 AM a 4:30 PM'
        },
        {
          name: 'Jardín Botánico de Mérida',
          location: 'Sector La Hechicera (cerca de la ULA)',
          highlights: 'Bosque de niebla, senderos de orquídeas, puentes colgantes y café.',
          hours: 'Martes a Domingo: 9:00 AM a 4:00 PM'
        },
        {
          name: 'Laguna de Mucubají & Laguna Negra',
          location: 'Parque Nacional Sierra Nevada (Apartaderos)',
          highlights: 'Pesca de trucha, paseos a caballo, frailejones gigantes y senderismo.',
          hours: 'Abierto todos los días: 8:00 AM a 5:00 PM'
        }
      ],
      tips: [
        'Planifica 1 parque temático por día para disfrutarlo con calma.',
        'En el Páramo la temperatura baja de 10°C; viste abrigo adecuado.',
        'Aprovecha para probar la trucha fresca y el vino de mora en las paradas gastronómicas.'
      ],
      whatsappHelp: '584148817137',
      whatsappText: 'Hola, deseo información sobre entradas y tours a los parques de Mérida desde la App de Mérida Gastronómica.'
    }
  },
  {
    id: 'terminal',
    title: 'Terminal de Autobuses',
    badge: 'Vía Terrestre',
    subtitle: 'Rutas Interurbanas Nacionales',
    shortDesc: 'Expresos ejecutivos directos desde Caracas, Maracaibo, Valencia y San Cristóbal.',
    icon: '🚌',
    image: 'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?auto=format&fit=crop&w=900&q=80',
    color: 'from-stone-900 to-zinc-950',
    details: {
      status: 'Operaciones 24/7',
      terminalName: 'Terminal de Pasajeros José Antonio Paredes',
      location: 'Av. Las Américas con Av. Alberto Carnevalli, Mérida',
      mainRoutes: [
        {
          route: 'Caracas &rarr; Mérida (Directo)',
          lines: 'Expresos Flamingo, Expresos Mérida, Rodovias de Venezuela',
          duration: 'Aprox. 12 - 14 horas (Ruta nocturna recomendada)',
          frequency: 'Salidas diarias entre 4:00 PM y 7:00 PM'
        },
        {
          route: 'Maracaibo &rarr; Mérida',
          lines: 'Expresos San Cristóbal, Flamingo, Autobuses de Barinas',
          duration: 'Aprox. 8 - 9 horas por El Vigía / Caja Seca',
          frequency: 'Salidas diarias diurnas y nocturnas'
        },
        {
          route: 'San Cristóbal (Táchira) &rarr; Mérida',
          lines: 'Líneas Andinas y Expresos Unidos',
          duration: 'Aprox. 5 - 6 horas por la vía Panamericana o Trasandina',
          frequency: 'Salidas continuas durante la mañana'
        }
      ],
      tips: [
        'Comprar boletos con 24 a 48 horas de anticipación en temporadas festivas (Feria del Sol, Navidad y Semana Santa).',
        'Llevar abrigo dentro de la unidad de autobús por el aire acondicionado.',
        'Hay servicio de taxi autorizado las 24 horas en la salida del terminal de Mérida.'
      ],
      whatsappHelp: '584148817137',
      whatsappText: 'Hola, deseo información sobre líneas de autobuses a Mérida desde la App de Mérida Gastronómica.'
    }
  }
];
