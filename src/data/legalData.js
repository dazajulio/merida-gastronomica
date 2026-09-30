export const LEGAL_DATA = {
  overview: {
    title: 'Centro de Recursos & Marco Jurídico',
    subtitle: 'Repositorio oficial actualizado en normativas, deberes formales, ordenanzas fiscales y sanitarias del estado Mérida y Venezuela.',
    badge: 'Asesoría Técnica & Cumplimiento Normativo',
    description: 'La Cámara Gastronómica del Estado Mérida pone a disposición de sus miembros y emprendedores del sector de hospitalidad un compendio legal y técnico rigurosamente actualizado, diseñado para asegurar la viabilidad jurídica, la seguridad fiscal y el cumplimiento sanitario de cada establecimiento.'
  },
  categories: [
    {
      id: 'fiscal',
      name: 'Tributario & Deberes Formales (SENIAT / SAMAT)',
      icon: 'Calculator',
      color: 'amber',
      docsCount: 0,
      description: 'Leyes tributarias nacionales, providencias del SENIAT para máquinas fiscales, retenciones de IVA/ISLR, IGTF y ordenanzas de actividades económicas del Municipio Libertador y municipios turísticos.',
      items: []
    },
    {
      id: 'sanitario',
      name: 'Regulación Sanitaria & Manipulación (SACS / SIACS)',
      icon: 'ShieldCheck',
      color: 'emerald',
      docsCount: 0,
      description: 'Normativa sanitaria de la Contraloría Sanitaria de Venezuela (SACS), tramitación de Permisos Sanitarios para locales de alimentos y Buenas Prácticas de Manufactura (BPM).',
      items: []
    },
    {
      id: 'turismo',
      name: 'Normativa Turística & Licencias (MINTUR / INATUR / Cormetur)',
      icon: 'Compass',
      color: 'sky',
      docsCount: 0,
      description: 'Ley Orgánica de Turismo de Venezuela, Registro Turístico Nacional (RTN), Licencia de Prestador de Servicios Turísticos y pago del 1% INATUR.',
      items: []
    },
    {
      id: 'laboral',
      name: 'Derecho Laboral & Seguridad Ocupacional (LOTTT / INPSASEL)',
      icon: 'Users',
      color: 'purple',
      docsCount: 0,
      description: 'Ley Orgánica del Trabajo (LOTTT), convenios de hostelería, turnos rotativos, propinas, descansos compensatorios y Comités de Seguridad y Salud Laboral (CSSL).',
      items: []
    }
  ],
  checklist: [
    { id: 'chk-1', category: 'Fiscal', label: 'Máquina fiscal homologada por el SENIAT con dispositivo de transmisión activo', required: true },
    { id: 'chk-2', category: 'Fiscal', label: 'Cartelera fiscal visible con RIF actualizado, última declaración de ISLR y Licencia Municipal de Actividades Económicas', required: true },
    { id: 'chk-3', category: 'Sanitario', label: 'Permiso Sanitario de Establecimiento emitido por el SACS vigente', required: true },
    { id: 'chk-4', category: 'Sanitario', label: '100% de la brigada de cocina y sala con Certificado de Salud y Curso de Manipulación de Alimentos', required: true },
    { id: 'chk-5', category: 'Sanitario', label: 'Certificado de Fumigación y Desinfección periódica por empresa registrada ante el SACS', required: true },
    { id: 'chk-6', category: 'Turismo', label: 'Registro Turístico Nacional (RTN) emitido por el MINTUR en estatus activo', required: false },
    { id: 'chk-7', category: 'Laboral', label: 'Libro de Horas Extraordinarias y Control de Jornadas debidamente sellado por la Inspectoría del Trabajo', required: true },
    { id: 'chk-8', category: 'Laboral', label: 'Comité de Seguridad y Salud Laboral (CSSL) registrado ante el INPSASEL', required: true },
    { id: 'chk-9', category: 'Seguridad', label: 'Extintores contra incendios de Acetato de Potasio (Clase K) para cocinas con recarga vigente', required: true },
    { id: 'chk-10', category: 'Sanitario', label: 'Trampa de grasas operativa con registro bitácora de limpieza semanal', required: true }
  ]
};
