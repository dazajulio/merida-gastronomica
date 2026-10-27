/**
 * Datos Institucionales y Estructura Oficial de la Junta Directiva
 * Cámara Gastronómica del Estado Mérida (CGEM)
 */

export const BOARD_MEMBERS_DATA = [
  {
    id: "dir-presidente",
    name: "Julio Alberto Daza Celis",
    ci: "V-12.517.086",
    role: "Presidente",
    roleCategory: "Presidencia",
    instagram: "@juliodazacelis",
    instagramUrl: "https://www.instagram.com/juliodazacelis/",
    email: "dazajulio@gmail.com",
    passwordHash: "Dafaca10*",
    hasPasswordSet: true,
    isAdminLevel: true,
    avatar: "/images/Presidente Julio Alberto Daza Celis.png",
    phone: "+58 414 8817137",
    order: 1
  },
  {
    id: "dir-vice-1",
    name: "Maryuri Carolina Carmona Campos",
    ci: "V-12.055.310",
    role: "Primera Vicepresidente",
    roleCategory: "Vicepresidencia",
    instagram: "@productos_taotao",
    instagramUrl: "https://www.instagram.com/productos_taotao/",
    email: "comercializadoraocmerida@gmail.com",
    passwordHash: "comercializadoraocmerida1201",
    hasPasswordSet: true,
    isAdminLevel: false,
    avatar: "/images/Primera Vicepresidente Maryuri Carolina Carmona Campos.png",
    order: 2
  },
  {
    id: "dir-vice-2",
    name: "María Laura Molina Barillas",
    ci: "V-21.331.263",
    role: "Segunda Vicepresidente",
    roleCategory: "Vicepresidencia",
    instagram: "@marialauraumami",
    instagramUrl: "https://www.instagram.com/marialauraumami/",
    email: "marialauramolinab@gmail.com",
    passwordHash: "marialauramolinab0601",
    hasPasswordSet: true,
    isAdminLevel: false,
    avatar: "/images/Segunda Vicepresidente María Laura Molina Barillas.png",
    order: 3
  },
  {
    id: "dir-operativo",
    name: "Marisabel Prieto Pérez",
    ci: "V-14.255.833",
    role: "Director Operativo",
    roleCategory: "Dirección",
    instagram: "@cataconmari",
    instagramUrl: "https://www.instagram.com/cataconmari/",
    email: "cataconmari@gmail.com",
    passwordHash: "cataconmari1979",
    hasPasswordSet: true,
    isAdminLevel: false,
    avatar: "/images/Director Operativo Marisabel Prieto Pérez.png",
    order: 4
  },
  {
    id: "dir-tesorero",
    name: "Edixon Xavier Reyes Dávila",
    ci: "V-18.796.632",
    role: "Tesorero",
    roleCategory: "Dirección",
    instagram: "@habemuspastas",
    instagramUrl: "https://www.instagram.com/habemuspastas/",
    email: "edreyesda@gmail.com",
    passwordHash: "edreyesda1608",
    hasPasswordSet: true,
    isAdminLevel: false,
    isTesorero: true,
    avatar: "/images/Tesorero Edixon Xavier Reyes Dávila.png",
    phone: "+58 274 2528813",
    order: 5
  },
  {
    id: "dir-ejecutivo",
    name: "Mary Giovanna Vera",
    ci: "V-9.474.798",
    role: "Director Ejecutivo",
    roleCategory: "Dirección",
    instagram: "@margiovi",
    instagramUrl: "https://www.instagram.com/margiovi/",
    email: "margiovi@gmail.com",
    passwordHash: "margiovi1611",
    hasPasswordSet: true,
    isAdminLevel: true,
    avatar: "/images/Director Ejecutivo Mary Giovanna Vera.png",
    phone: "+58 414 0000000",
    order: 6
  },
  {
    id: "coord-proveeduria",
    name: "Amthor Romero",
    ci: "V-23.305.327",
    role: "Coordinación de Proveeduría",
    roleCategory: "Coordinación Especializada",
    instagram: "@amthorcito",
    instagramUrl: "https://www.instagram.com/amthorcito/",
    email: "amthorromero@camaragastronomicamerida.org",
    hasPasswordSet: false,
    isAdminLevel: false,
    avatar: "/images/Coordinación de Proveeduría Amthor Romero.png",
    order: 7
  },
  {
    id: "coord-rel-institucionales",
    name: "José Gregorio Angulo",
    ci: "V-8.039.160",
    role: "Coordinación de Relaciones Institucionales",
    roleCategory: "Coordinación Especializada",
    instagram: "@josegregorioangulor",
    instagramUrl: "https://www.instagram.com/josegregorioangulor/",
    email: "joseangulo@camaragastronomicamerida.org",
    hasPasswordSet: false,
    isAdminLevel: false,
    avatar: "/images/Coordinación de Relaciones Institucionales José Gregorio Angulo.png",
    order: 8
  },
  {
    id: "coord-cacao-cafe",
    name: "Andreina Ramírez",
    ci: "V-11.953.787",
    role: "Coordinación de Cacao y Café",
    roleCategory: "Coordinación Especializada",
    instagram: "@chocolateslamucuy",
    instagramUrl: "https://www.instagram.com/chocolateslamucuy/",
    email: "andreinafehr5@gmail.com",
    passwordHash: "andreinaramirez0501",
    hasPasswordSet: true,
    isAdminLevel: false,
    avatar: "/images/Coordinación de Cacao y Café Andreina Ramírez.png",
    order: 9
  },
  {
    id: "coord-capacitacion",
    name: "Yohan Alirio Molina",
    ci: "V-16.019.104",
    role: "Coordinación de Capacitación y Formación",
    roleCategory: "Coordinación Especializada",
    instagram: "@chef_internacional_junior",
    instagramUrl: "https://www.instagram.com/chef_internacional_junior/",
    email: "yohanmolina@camaragastronomicamerida.org",
    hasPasswordSet: false,
    isAdminLevel: false,
    avatar: "/images/Coordinación de Capacitación y Formación Yohan Alirio Molina.png",
    order: 10
  }
];

// Agenda Oficial y Cronograma Ejecutivo de la Junta Directiva (2026 - 2027)
// Solo actividades activas y próximas por ejecutar
export const INITIAL_BOARD_AGENDA_DATA = [
  {
    id: "agenda-005",
    title: "Taller: Comida Navideña No Tradicional",
    type: "capacitacion",
    typeLabel: "Formación & Taller",
    date: "2026-11-13",
    timeStart: "09:00",
    timeEnd: "15:00",
    year: 2026,
    month: 11,
    location: "Tovar Umami, Tovar, Mérida",
    isVirtual: false,
    virtualLink: "",
    organizer: "Chef Valentina Inglessis & Cámara Gastronómica",
    description: "Taller culinario de alta cocina navideña de autor, técnicas de preservación y reinterpretación de sabores andinos. Asiste la Directiva en pleno.",
    maxAttendees: 12,
    status: "confirmado",
    confirmedAttendees: [
      {
        memberId: "dir-presidente",
        name: "Julio Alberto Daza Celis",
        role: "Presidente",
        confirmedAt: "2026-09-29T12:40:00Z"
      },
      {
        memberId: "dir-ejecutivo",
        name: "Mary Giovanna Vera",
        role: "Director Ejecutivo",
        confirmedAt: "2026-09-29T12:41:00Z"
      },
      {
        memberId: "dir-vice-1",
        name: "Maryuri Carolina Carmona Campos",
        role: "Primera Vicepresidente",
        confirmedAt: "2026-09-29T12:42:00Z"
      },
      {
        memberId: "dir-vice-2",
        name: "María Laura Molina Barillas",
        role: "Segunda Vicepresidente",
        confirmedAt: "2026-09-29T12:43:00Z"
      },
      {
        memberId: "dir-operativo",
        name: "Marisabel Prieto Pérez",
        role: "Director Operativo",
        confirmedAt: "2026-09-29T12:44:00Z"
      },
      {
        memberId: "dir-tesorero",
        name: "Edixon Xavier Reyes Dávila",
        role: "Tesorero",
        confirmedAt: "2026-09-29T12:45:00Z"
      }
    ]
  },
  {
    id: "agenda-1793060265892",
    title: "FAMTRIP BONAVITA SOY GOURMET",
    type: "medios",
    typeLabel: "Medios & Radio",
    date: "2026-10-27",
    timeStart: "09:00",
    timeEnd: "15:00",
    year: 2026,
    month: 10,
    location: "LA JOYA. EL VALLE",
    isVirtual: false,
    virtualLink: "",
    organizer: "LA CABAÑA DEL ABUELO",
    description: "AFILIACION AL GREMIO Y CONOCIMIENTO DEL DESTINO",
    maxAttendees: 1,
    status: "confirmado",
    confirmedAttendees: [
      {
        memberId: "dir-presidente",
        name: "Julio Alberto Daza Celis",
        role: "Presidente",
        confirmedAt: "2026-10-27T00:17:45.892Z"
      }
    ]
  },
  {
    id: "agenda-1793065468130",
    title: "RADIO. Todo Incluido 88.7 FM ",
    type: "medios",
    typeLabel: "Medios & Radio",
    date: "2026-10-27",
    timeStart: "09:00",
    timeEnd: "10:00",
    year: 2026,
    month: 10,
    location: "Plaza Bolivar",
    isVirtual: false,
    virtualLink: "",
    organizer: "Frank Andrade",
    description: "PARA INVITAR AL EVENTO DEL 30 EN VENETUR. ",
    maxAttendees: 4,
    status: "confirmado",
    confirmedAttendees: [
      {
        memberId: "dir-presidente",
        name: "Julio Alberto Daza Celis",
        role: "Presidente",
        confirmedAt: "2026-10-27T01:44:28.130Z"
      }
    ]
  },
  {
    id: "agenda-1793060420415",
    title: "PRE LANZAMIENTO MARCA MERIDA",
    type: "institucional",
    typeLabel: "Institucional & Gala",
    date: "2026-10-29",
    timeStart: "08:30",
    timeEnd: "12:00",
    year: 2026,
    month: 10,
    location: "GRUPO OPTIMUS",
    isVirtual: false,
    virtualLink: "",
    organizer: "GRUPO OPTIMUS",
    description: "EVENTO PRIVADO POR INVITACION. NOS ASIGNARON SOLO UN CUPO POR EL ESPACIO FISICO. ASISTE PRESIDENCIA",
    maxAttendees: 1,
    status: "confirmado",
    confirmedAttendees: [
      {
        memberId: "dir-presidente",
        name: "Julio Alberto Daza Celis",
        role: "Presidente",
        confirmedAt: "2026-10-27T00:20:20.415Z"
      }
    ]
  },
  {
    id: "agenda-1793060058603",
    title: "Encuentro Gastronómico y Empresarial: Evolución, Servicio y Tecnología 2026–2027",
    type: "gremial",
    typeLabel: "Encuentro Gremial & Turismo",
    date: "2026-10-30",
    timeStart: "13:00",
    timeEnd: "18:00",
    year: 2026,
    month: 10,
    location: "Salón Bella Vista, Hotel Venetur Mérida",
    isVirtual: false,
    virtualLink: "",
    organizer: "Presidencia & Dirección Ejecutiva",
    description: "Ejes centrales de la jornada\nConferencias orientadas al panorama 2026–2027, profundizando en:\nExcelencia operativa y transformación del servicio en sala y cocina.\nAdopción de herramientas tecnológicas.\nAnálisis de los nuevos hábitos del comensal y estrategias modernas de fidelización.\nCompetitividad, estándares de calidad y proyección regional.",
    maxAttendees: 12,
    status: "confirmado",
    confirmedAttendees: [
      {
        memberId: "dir-presidente",
        name: "Julio Alberto Daza Celis",
        role: "Presidente",
        confirmedAt: "2026-10-27T00:14:18.603Z"
      }
    ]
  }
];

// Registro Histórico de Actividades y Eventos Cumplidos (Memoria de Gestión)
export const INITIAL_BOARD_COMPLETED_DATA = [
  {
    id: "agenda-001",
    title: "Conversaciones Institucionales con el IUPTM",
    type: "institucional",
    typeLabel: "Institucional & Academia",
    date: "2026-09-30",
    timeStart: "09:00",
    timeEnd: "12:00",
    year: 2026,
    month: 9,
    location: "Sede del IUPTM, Mérida",
    isVirtual: false,
    virtualLink: "",
    organizer: "IUPTM & Cámara Gastronómica",
    description: "Reunión de vinculación estratégica y convenios formativos entre el Instituto Universitario Politécnico Territorial del Estado Mérida y la Cámara Gastronómica.",
    maxAttendees: 5,
    status: "cumplido",
    completedAt: "2026-10-27T01:46:59.943Z",
    confirmedAttendees: [
      {
        memberId: "dir-presidente",
        name: "Julio Alberto Daza Celis",
        role: "Presidente",
        confirmedAt: "2026-09-29T12:00:00Z"
      },
      {
        memberId: "dir-vice-1",
        name: "Maryuri Carolina Carmona Campos",
        role: "Primera Vicepresidente",
        confirmedAt: "2026-09-29T12:05:00Z"
      },
      {
        memberId: "dir-operativo",
        name: "Marisabel Prieto Pérez",
        role: "Director Operativo",
        confirmedAt: "2026-09-29T12:10:00Z"
      }
    ]
  },
  {
    id: "agenda-002",
    title: "Entrevista Radial en CDR 98.7 FM",
    type: "medios",
    typeLabel: "Medios & Radio",
    date: "2026-10-01",
    timeStart: "07:00",
    timeEnd: "08:30",
    year: 2026,
    month: 10,
    location: "Estudios CDR 98.7 FM, Mérida",
    isVirtual: false,
    virtualLink: "",
    organizer: "Dirección de Medios CDR / Cámara Gastronómica",
    description: "Entrevista matutina en vivo sobre los avances gremiales, la Ruta del Café de Especialidad, el Sello de Calidad AAA y la agenda gastronómica del estado Mérida.",
    maxAttendees: 2,
    status: "cumplido",
    completedAt: "2026-10-03T03:41:34.825Z",
    confirmedAttendees: [
      {
        memberId: "dir-presidente",
        name: "Julio Alberto Daza Celis",
        role: "Presidente",
        confirmedAt: "2026-09-29T12:15:00Z"
      },
      {
        memberId: "dir-vice-1",
        name: "Maryuri Carolina Carmona Campos",
        role: "Primera Vicepresidente",
        confirmedAt: "2026-09-29T12:20:00Z"
      }
    ]
  },
  {
    id: "agenda-003",
    title: "Evento \"Influyentes del Turismo\"",
    type: "gremial",
    typeLabel: "Turismo & Gremial",
    date: "2026-10-01",
    timeStart: "14:00",
    timeEnd: "18:00",
    year: 2026,
    month: 10,
    location: "Hotel Venetur, Salón Bellavista, Mérida",
    isVirtual: false,
    virtualLink: "",
    organizer: "Cámara de Turismo del Estado Mérida (CATUREM)",
    description: "Magno evento de articulación turística regional. Invitación formal de la Cámara de Turismo a todo el equipo directivo de la Cámara Gastronómica.",
    maxAttendees: 10,
    status: "cumplido",
    completedAt: "2026-10-03T03:41:39.703Z",
    confirmedAttendees: [
      {
        memberId: "dir-presidente",
        name: "Julio Alberto Daza Celis",
        role: "Presidente",
        confirmedAt: "2026-09-29T12:25:00Z"
      },
      {
        memberId: "dir-ejecutivo",
        name: "Mary Giovanna Vera",
        role: "Director Ejecutivo",
        confirmedAt: "2026-09-29T12:26:00Z"
      },
      {
        memberId: "dir-vice-1",
        name: "Maryuri Carolina Carmona Campos",
        role: "Primera Vicepresidente",
        confirmedAt: "2026-09-29T12:27:00Z"
      },
      {
        memberId: "dir-vice-2",
        name: "María Laura Molina Barillas",
        role: "Segunda Vicepresidente",
        confirmedAt: "2026-09-29T12:28:00Z"
      },
      {
        memberId: "dir-operativo",
        name: "Marisabel Prieto Pérez",
        role: "Director Operativo",
        confirmedAt: "2026-09-29T12:29:00Z"
      },
      {
        memberId: "dir-tesorero",
        name: "Edixon Xavier Reyes Dávila",
        role: "Tesorero",
        confirmedAt: "2026-09-29T12:30:00Z"
      }
    ]
  },
  {
    id: "agenda-004",
    title: "Premios MUCUTATUY — Honor al Mérito Turístico y Gastronómico",
    type: "institucional",
    typeLabel: "Gala & Premiaciones",
    date: "2026-10-05",
    timeStart: "13:00",
    timeEnd: "17:30",
    year: 2026,
    month: 10,
    location: "Hotel Venetur, Mérida",
    isVirtual: false,
    virtualLink: "",
    organizer: "Comité Organizador Premios MUCUTATUY",
    description: "Ceremonia solemne de entrega del Premio al Mérito Turístico y Gastronómico de trayectoria en el estado Mérida. Asiste el equipo directivo.",
    maxAttendees: 10,
    status: "cumplido",
    completedAt: "2026-10-27T00:12:22.666Z",
    confirmedAttendees: [
      {
        memberId: "dir-presidente",
        name: "Julio Alberto Daza Celis",
        role: "Presidente",
        confirmedAt: "2026-09-29T12:35:00Z"
      },
      {
        memberId: "dir-ejecutivo",
        name: "Mary Giovanna Vera",
        role: "Director Ejecutivo",
        confirmedAt: "2026-09-29T12:36:00Z"
      },
      {
        memberId: "dir-vice-1",
        name: "Maryuri Carolina Carmona Campos",
        role: "Primera Vicepresidente",
        confirmedAt: "2026-09-29T12:37:00Z"
      },
      {
        memberId: "dir-operativo",
        name: "Marisabel Prieto Pérez",
        role: "Director Operativo",
        confirmedAt: "2026-09-29T12:38:00Z"
      }
    ]
  },
  {
    id: "agenda-1792807451224",
    title: "Congreso Meme",
    type: "medios",
    typeLabel: "Medios & Radio",
    date: "2026-10-24",
    timeStart: "09:00",
    timeEnd: "12:00",
    year: 2026,
    month: 10,
    location: "Micumbarila",
    isVirtual: false,
    virtualLink: "",
    organizer: "Presidencia & Dirección Ejecutiva",
    description: "Cobertura y participación en el Congreso Meme.",
    maxAttendees: 12,
    status: "cumplido",
    completedAt: "2026-10-27T00:12:18.352Z",
    confirmedAttendees: [
      {
        memberId: "dir-ejecutivo",
        name: "Mary Giovanna Vera",
        role: "Director Ejecutivo",
        confirmedAt: "2026-10-24T02:04:11.224Z"
      }
    ]
  }
];
