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
    hasPasswordSet: true,
    isAdminLevel: true, // Potestad total de crear, editar, eliminar y conformar agenda
    avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=400",
    phone: "+58 414 7480000",
    order: 1
  },
  {
    id: "dir-vice-1",
    name: "Maryuri Carolina Carmona Campos",
    ci: "V-12.055.310",
    role: "Primera Vicepresidente",
    roleCategory: "Vicepresidencia",
    email: "maryuricarmona@camaragastronomicamerida.org",
    hasPasswordSet: false,
    isAdminLevel: false,
    order: 2
  },
  {
    id: "dir-vice-2",
    name: "María Laura Molina Barillas",
    ci: "V-21.331.263",
    role: "Segunda Vicepresidente",
    roleCategory: "Vicepresidencia",
    email: "marialauramolina@camaragastronomicamerida.org",
    hasPasswordSet: false,
    isAdminLevel: false,
    order: 3
  },
  {
    id: "dir-operativo",
    name: "Marisabel Prieto Pérez",
    ci: "V-14.255.833",
    role: "Director Operativo",
    roleCategory: "Dirección",
    email: "marisabelprieto@camaragastronomicamerida.org",
    hasPasswordSet: false,
    isAdminLevel: false,
    order: 4
  },
  {
    id: "dir-tesorero",
    name: "Edixon Xavier Reyes Dávila",
    ci: "V-18.796.632",
    role: "Tesorero",
    roleCategory: "Dirección",
    email: "edixonreyes@camaragastronomicamerida.org",
    hasPasswordSet: false,
    isAdminLevel: false,
    order: 5
  },
  {
    id: "dir-ejecutivo",
    name: "Mary Giovanna Vera",
    ci: "V-9.474.798",
    role: "Director Ejecutivo",
    roleCategory: "Dirección",
    email: "marygiovannavera@camaragastronomicamerida.org",
    hasPasswordSet: false,
    isAdminLevel: true, // Potestad de gestión de calendario
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

// Agenda y Calendario Inicial de la Junta Directiva (2026 - 2027)
export const INITIAL_BOARD_AGENDA_DATA = [
  {
    id: "agenda-001",
    title: "Sesión Ordinaria de Junta Directiva - Balance Trimestral Q3",
    type: "reunion", // reunion | medios | auditoria | gremial | institucional | expo
    typeLabel: "Reunión de Junta",
    date: "2026-10-05",
    timeStart: "09:30",
    timeEnd: "12:00",
    year: 2026,
    month: 10,
    location: "Sede Institucional CGEM (Av. 4 entre Calles 19 y 20) / Sala de Juntas",
    isVirtual: false,
    virtualLink: "",
    organizer: "Presidencia & Dirección Ejecutiva",
    description: "Revisión de informes de gestión, incorporación de nuevos agremiados al Sello AAA, acuerdos con la Escuela de Gastronomía ULA y revisión presupuestaria.",
    status: "confirmado", // borrador | confirmado | realizado | cancelado
    confirmedAttendees: [
      {
        memberId: "dir-presidente",
        name: "Julio Alberto Daza Celis",
        role: "Presidente",
        confirmedAt: "2026-09-29T10:00:00Z"
      }
    ]
  },
  {
    id: "agenda-002",
    title: "Rueda de Prensa & Entrevista Especial: Lanzamiento Ruta del Café de Especialidad",
    type: "medios",
    typeLabel: "Medios & Entrevistas",
    date: "2026-10-12",
    timeStart: "10:00",
    timeEnd: "11:30",
    year: 2026,
    month: 10,
    location: "Estudio Principal ULA FM 107.7 / Transmisión Streaming Regional",
    isVirtual: false,
    virtualLink: "",
    organizer: "Coordinación de Cacao y Café & Relaciones Institucionales",
    description: "Presentación ante medios de comunicación regionales y corresponsales nacionales sobre la certificación de origen del café merideño y el primer circuito de cafeterías agremiadas.",
    status: "confirmado",
    confirmedAttendees: [
      {
        memberId: "dir-presidente",
        name: "Julio Alberto Daza Celis",
        role: "Presidente",
        confirmedAt: "2026-09-29T10:15:00Z"
      }
    ]
  },
  {
    id: "agenda-003",
    title: "Auditoría en Terreno: Evaluación Técnica Sello Mérida Gastronómica (226 Ítems)",
    type: "auditoria",
    typeLabel: "Inspección & Calidad",
    date: "2026-10-20",
    timeStart: "14:00",
    timeEnd: "17:30",
    year: 2026,
    month: 10,
    location: "Circuito Eje Metropolitano / Restaurantes Postulantes",
    isVirtual: false,
    virtualLink: "",
    organizer: "Dirección Operativa & Capacitación",
    description: "Inspección técnica de los pilares de Calidad, Servicio e Inocuidad con el equipo auditor técnico de la Cámara.",
    status: "confirmado",
    confirmedAttendees: []
  },
  {
    id: "agenda-004",
    title: "Desayuno Corporativo Mensual de Agremiados & Networking",
    type: "gremial",
    typeLabel: "Encuentro Gremial",
    date: "2026-11-06",
    timeStart: "08:30",
    timeEnd: "11:00",
    year: 2026,
    month: 11,
    location: "Salón de Convenciones Kaffia Caffe / Sector Las Heroínas",
    isVirtual: false,
    virtualLink: "",
    organizer: "Dirección Ejecutiva & Proveeduría",
    description: "Espacio mensual de articulación comercial, compras consolidadas y presentación de proveedores aliados para restaurantes agremiados.",
    status: "confirmado",
    confirmedAttendees: [
      {
        memberId: "dir-presidente",
        name: "Julio Alberto Daza Celis",
        role: "Presidente",
        confirmedAt: "2026-09-29T10:30:00Z"
      }
    ]
  },
  {
    id: "agenda-005",
    title: "Mesa Interinstitucional con Gobernación y Alcaldía: Plan Turístico 2027",
    type: "institucional",
    typeLabel: "Institucional & Gobierno",
    date: "2026-11-18",
    timeStart: "10:00",
    timeEnd: "12:30",
    year: 2026,
    month: 11,
    location: "Palacio de Gobierno del Estado Mérida / Sala de Reuniones",
    isVirtual: false,
    virtualLink: "",
    organizer: "Presidencia & Relaciones Institucionales",
    description: "Presentación del plan de incentivos tributarios, exoneración de tasas de permisología y apoyo a la señalética de rutas gastronómicas.",
    status: "confirmado",
    confirmedAttendees: [
      {
        memberId: "dir-presidente",
        name: "Julio Alberto Daza Celis",
        role: "Presidente",
        confirmedAt: "2026-09-29T11:00:00Z"
      }
    ]
  },
  {
    id: "agenda-006",
    title: "Comité Técnico Promotor: Cumbre Expo Gastronómica Los Andes 2027",
    type: "expo",
    typeLabel: "Expo Andes 2027",
    date: "2027-01-22",
    timeStart: "09:00",
    timeEnd: "13:00",
    year: 2027,
    month: 1,
    location: "Centro de Convenciones Mucumbarí / Sala VIP",
    isVirtual: false,
    virtualLink: "",
    organizer: "Junta Directiva en Pleno",
    description: "Revisión del cronograma de patrocinantes internacionales, pabellones temáticos de cacao y café, y confirmación de chefs invitados de honor.",
    status: "confirmado",
    confirmedAttendees: []
  },
  {
    id: "agenda-007",
    title: "Conferencia Internacional: Genética del Cacao Porcelana del Sur del Lago",
    type: "institucional",
    typeLabel: "Conferencia Magistral",
    date: "2027-03-15",
    timeStart: "15:00",
    timeEnd: "18:00",
    year: 2027,
    month: 3,
    location: "Aula Magna de la Universidad de Los Andes (ULA)",
    isVirtual: false,
    virtualLink: "",
    organizer: "Coordinación de Cacao y Café & Academia ULA",
    description: "Jornada académica y cata sensorial con expertos internacionales en chocolatería fina de aroma.",
    status: "confirmado",
    confirmedAttendees: []
  }
];
