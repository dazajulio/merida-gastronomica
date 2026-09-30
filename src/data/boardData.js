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
    email: "dazajulio@gmail.com",
    passwordHash: "Dafaca10*",
    hasPasswordSet: true,
    isAdminLevel: true, // Potestad total de gestión, creación, edición, eliminación y quórum
    avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=400",
    phone: "+58 414 7480000",
    order: 1
  },
  {
    id: "dir-ejecutivo",
    name: "Mary Giovanna Vera",
    ci: "V-9.474.798",
    role: "Director Ejecutivo",
    roleCategory: "Dirección",
    email: "margiovi@gmail.com",
    passwordHash: "margiovi1611",
    hasPasswordSet: true,
    isAdminLevel: true, // Potestad total de gestión de agenda
    phone: "+58 414 0000000",
    order: 2
  },
  {
    id: "dir-vice-1",
    name: "Maryuri Carolina Carmona Campos",
    ci: "V-12.055.310",
    role: "Primera Vicepresidente",
    roleCategory: "Vicepresidencia",
    email: "comercializadoraocmerida@gmail.com",
    passwordHash: "comercializadoraocmerida1201",
    hasPasswordSet: true,
    isAdminLevel: false,
    order: 3
  },
  {
    id: "dir-vice-2",
    name: "María Laura Molina Barillas",
    ci: "V-21.331.263",
    role: "Segunda Vicepresidente",
    roleCategory: "Vicepresidencia",
    email: "marialauramolinab@gmail.com",
    passwordHash: "marialauramolinab0601",
    hasPasswordSet: true,
    isAdminLevel: false,
    order: 4
  },
  {
    id: "dir-operativo",
    name: "Marisabel Prieto Pérez",
    ci: "V-14.255.833",
    role: "Director Operativo",
    roleCategory: "Dirección",
    email: "cataconmari@gmail.com",
    passwordHash: "cataconmari1979",
    hasPasswordSet: true,
    isAdminLevel: false,
    order: 5
  },
  {
    id: "dir-tesorero",
    name: "Edixon Xavier Reyes Dávila",
    ci: "V-18.796.632",
    role: "Tesorero",
    roleCategory: "Dirección",
    email: "edreyesda@gmail.com",
    passwordHash: "edreyesda1608",
    hasPasswordSet: true,
    isAdminLevel: false,
    order: 6
  },
  {
    id: "coord-proveeduria",
    name: "Amthor Romero",
    ci: "V-23.305.327",
    role: "Coordinación de Proveeduría",
    roleCategory: "Coordinación Especializada",
    email: "amthorromero@camaragastronomicamerida.org",
    hasPasswordSet: false,
    isAdminLevel: false,
    order: 7
  },
  {
    id: "coord-rel-institucionales",
    name: "José Gregorio Angulo",
    ci: "V-8.039.160",
    role: "Coordinación de Relaciones Institucionales",
    roleCategory: "Coordinación Especializada",
    email: "joseangulo@camaragastronomicamerida.org",
    hasPasswordSet: false,
    isAdminLevel: false,
    order: 8
  },
  {
    id: "coord-cacao-cafe",
    name: "Andreina Ramírez",
    ci: "V-11.953.787",
    role: "Coordinación de Cacao y Café",
    roleCategory: "Coordinación Especializada",
    email: "andreinaramirez@camaragastronomicamerida.org",
    hasPasswordSet: false,
    isAdminLevel: false,
    order: 9
  },
  {
    id: "coord-capacitacion",
    name: "Yohan Alirio Molina",
    ci: "V-16.019.104",
    role: "Coordinación de Capacitación y Formación",
    roleCategory: "Coordinación Especializada",
    email: "yohanmolina@camaragastronomicamerida.org",
    hasPasswordSet: false,
    isAdminLevel: false,
    order: 10
  }
];

// Agenda Oficial y Cronograma Ejecutivo de la Junta Directiva (2026 - 2027)
export const INITIAL_BOARD_AGENDA_DATA = [
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
    status: "confirmado",
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
    status: "confirmado",
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
    status: "confirmado",
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
    status: "confirmado",
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
  }
];
