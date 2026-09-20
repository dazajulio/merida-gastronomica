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
      docsCount: 8,
      description: 'Leyes tributarias nacionales, providencias del SENIAT para máquinas fiscales, retenciones de IVA/ISLR, IGTF y ordenanzas de actividades económicas del Municipio Libertador y municipios turísticos.',
      items: [
        {
          id: 'doc-01',
          title: 'Providencia SENIAT SNAT/2024/000032 - Uso de Máquinas Fiscales y Facturación Electrónica',
          category: 'SENIAT Nacional',
          format: 'PDF',
          size: '2.4 MB',
          dateUpdated: 'Enero 2026',
          summary: 'Guía paso a paso sobre especificaciones de memoria fiscal, dispositivos de transmisión continua y emisión de facturas para restaurantes y bares.',
          isOfficial: true
        },
        {
          id: 'doc-02',
          title: 'Ordenanza de Impuesto sobre Actividades Económicas de Industria, Comercio y Servicios (Municipio Libertador - Mérida)',
          category: 'Municipal SAMAT',
          format: 'PDF',
          size: '3.1 MB',
          dateUpdated: 'Febrero 2026',
          summary: 'Alícuotas impositivas aplicables a restaurantes (código 6.12.01), cafeterías y licorerías. Régimen de rebajas por pronto pago y excepciones para establecimientos turísticos.',
          isOfficial: true
        },
        {
          id: 'doc-03',
          title: 'Manual Práctico de Retenciones de IVA e Impuesto a las Grandes Transacciones Financieras (IGTF)',
          category: 'Gremial Cámara',
          format: 'PDF',
          size: '1.8 MB',
          dateUpdated: 'Enero 2026',
          summary: 'Tratamiento tributario de pagos en divisas en efectivo, transferencias internacionales y cálculo de alícuotas del 3% en hostelería.',
          isOfficial: false
        }
      ]
    },
    {
      id: 'sanitario',
      name: 'Regulación Sanitaria & Manipulación (SACS / SIACS)',
      icon: 'ShieldCheck',
      color: 'emerald',
      docsCount: 6,
      description: 'Normativa sanitaria de la Contraloría Sanitaria de Venezuela (SACS), tramitación de Permisos Sanitarios para locales de alimentos y Buenas Prácticas de Manufactura (BPM).',
      items: [
        {
          id: 'doc-04',
          title: 'Guía Oficial de Requisitos para el Permiso Sanitario de Establecimientos de Alimentos y Bebidas (SIACS)',
          category: 'Contraloría Sanitaria SACS',
          format: 'PDF',
          size: '1.9 MB',
          dateUpdated: 'Enero 2026',
          summary: 'Requisitos de infraestructura, trampas de grasa, vestuarios de brigada, planos sanitarios y cronogramas de fumigación obligatoria.',
          isOfficial: true
        },
        {
          id: 'doc-05',
          title: 'Norma de Manipulación Higiénica de los Alimentos y Certificación Médica del Personal de Cocina',
          category: 'Norma COVENIN / MPPS',
          format: 'PDF',
          size: '2.2 MB',
          dateUpdated: 'Diciembre 2025',
          summary: 'Reglamento para la obtención de certificados de salud, exámenes microbiológicos periódicos y cursos obligatorios de manipulación higiénica.',
          isOfficial: true
        },
        {
          id: 'doc-06',
          title: 'Protocolo de Prevención de Contaminación Cruzada y Gestión de Alérgenos en Cocina',
          category: 'Manual Técnico Cámara',
          format: 'PDF',
          size: '1.5 MB',
          dateUpdated: 'Febrero 2026',
          summary: 'Codificación por colores de tablas de corte, rotulado de fechas de caducidad y protocolos de trazabilidad alimentaria.',
          isOfficial: false
        }
      ]
    },
    {
      id: 'turismo',
      name: 'Normativa Turística & Licencias (MINTUR / INATUR / Cormetur)',
      icon: 'Compass',
      color: 'sky',
      docsCount: 5,
      description: 'Ley Orgánica de Turismo de Venezuela, Registro Turístico Nacional (RTN), Licencia de Prestador de Servicios Turísticos y pago del 1% INATUR.',
      items: [
        {
          id: 'doc-07',
          title: 'Ley Orgánica de Turismo de la República Bolivariana de Venezuela y su Reglamento',
          category: 'Ley Nacional MINTUR',
          format: 'PDF',
          size: '4.5 MB',
          dateUpdated: 'Vigente 2026',
          summary: 'Deberes y derechos de los establecimientos gastronómicos clasificados como de interés turístico. Normas de categorización de tenedores.',
          isOfficial: true
        },
        {
          id: 'doc-08',
          title: 'Procedimiento de Inscripción y Actualización del Registro Turístico Nacional (RTN)',
          category: 'INATUR',
          format: 'PDF',
          size: '1.4 MB',
          dateUpdated: 'Enero 2026',
          summary: 'Instrucciones para la consignación digital de expedientes ante Cormetur y la sede regional del INATUR en Mérida.',
          isOfficial: true
        },
        {
          id: 'doc-09',
          title: 'Guía de Declaración y Pago de la Contribución Especial del 1% al Fondo de Turismo (INATUR)',
          category: 'Tributo Turístico',
          format: 'PDF',
          size: '1.1 MB',
          dateUpdated: 'Febrero 2026',
          summary: 'Cálculo sobre ingresos brutos mensuales, plazos de declaración y exenciones aplicables.',
          isOfficial: true
        }
      ]
    },
    {
      id: 'laboral',
      name: 'Derecho Laboral & Seguridad Ocupacional (LOTTT / INPSASEL)',
      icon: 'Users',
      color: 'purple',
      docsCount: 5,
      description: 'Ley Orgánica del Trabajo (LOTTT), convenios de hostelería, turnos rotativos, propinas, descansos compensatorios y Comités de Seguridad y Salud Laboral (CSSL).',
      items: [
        {
          id: 'doc-10',
          title: 'Régimen Especial de Trabajo en Hostelería, Restaurantes y Hoteles según la LOTTT',
          category: 'Ministerio del Trabajo',
          format: 'PDF',
          size: '2.8 MB',
          dateUpdated: 'Vigente 2026',
          summary: 'Regulación de jornadas nocturnas, descansos continuos, horas extraordinarias en temporadas altas y naturaleza salarial de las propinas y porcentajes de servicio.',
          isOfficial: true
        },
        {
          id: 'doc-11',
          title: 'Manual de Constitución del Comité de Seguridad y Salud Laboral (CSSL) en Cocinas Comerciales',
          category: 'INPSASEL',
          format: 'PDF',
          size: '2.1 MB',
          dateUpdated: 'Diciembre 2025',
          summary: 'Programa de seguridad, ergonomía en brigadas de cocina, prevención de quemaduras, cortes y uso de Equipos de Protección Personal (EPP).',
          isOfficial: true
        }
      ]
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
