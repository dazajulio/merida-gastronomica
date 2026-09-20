export const SELLO_DATA = {
  overview: {
    title: 'Sello Mérida Gastronómica',
    subtitle: 'Norma Técnica y Estándar de Confianza Internacional de la Cámara Gastronómica del Estado Mérida',
    heroBadge: 'Certificación Oficial de Excelencia AAA',
    totalItems: 226,
    pillarsCount: 3,
    description: 'Para ser referentes globales, la excelencia debe ser medible. La Cámara Gastronómica crea el Sello Mérida Gastronómica. Más que un reconocimiento, es una norma técnica y un estándar de confianza comparable a certificaciones internacionales. A través de una rigurosa auditoría de 226 ítems sustentada en tres pilares —Calidad, Servicio y Limpieza—, evaluamos la gestión operativa, la seguridad alimentaria, el manejo de mermas y la excelencia de servicio.',
    conclusion: 'Quien ostente este sello en su fachada acredita ante Venezuela y el mundo una Calificación AAA, garantizando un establecimiento seguro, rentable y memorable.'
  },
  pillars: [
    {
      id: 'calidad',
      name: 'Calidad & Excelencia Culinaria',
      itemsCount: 80,
      color: 'amber',
      icon: 'Award',
      description: 'Estandarización de recetas, trazabilidad de materias primas andinas, termorregulación de frío/calor y consistencia en el perfil sensorial.',
      subareas: [
        { name: 'Estandarización y Fichas de Recetas', items: 18, desc: 'Costeo detallado, gramaje exacto, fotografiado de emplatado y alérgenos.' },
        { name: 'Trazabilidad & Cadena de Suministro Andino', items: 22, desc: 'Certificación de origen para café, cacao Porcelana, truchas y quesos de páramo.' },
        { name: 'Control de Cadena de Frío & Termorregulación', items: 20, desc: 'Registros diarios digitales de refrigeración y congelación continua.' },
        { name: 'Perfil Organoléptico & Creatividad', items: 20, desc: 'Auditoría de sabor, textura, equilibrio térmico y respeto a la identidad andina.' }
      ]
    },
    {
      id: 'servicio',
      name: 'Servicio & Hospitalidad Andina',
      itemsCount: 72,
      color: 'sky',
      icon: 'HeartHandshake',
      description: 'Protocolos de atención bilingüe, tiempos de comanda milimétricos, conocimiento experto de la carta de platos, vinos, cafés de altura y gestión de reservas.',
      subareas: [
        { name: 'Protocolos de Bienvenida y Despedida', items: 16, desc: 'Calidez andina, lenguaje no verbal, atención a requerimientos especiales.' },
        { name: 'Tiempos de Servicio y Eficiencia de Comandas', items: 18, desc: 'Auditoría de tiempos de entrega de bebidas (<5 min) y platos fuertes (<20 min).' },
        { name: 'Dominio Técnico de Carta y Maridajes', items: 20, desc: 'Capacitación del personal en notas de cata de café, cacao y vinos de guarda.' },
        { name: 'Resolución de Incidencias & NPS Post-Servicio', items: 18, desc: 'Sistemas de retroalimentación inmediata y políticas de satisfacción garantizada.' }
      ]
    },
    {
      id: 'limpieza',
      name: 'Limpieza, Bioseguridad & Gestión de Mermas',
      itemsCount: 74,
      color: 'emerald',
      icon: 'ShieldCheck',
      description: 'Inocuidad alimentaria basada en principios HACCP/APPCC, desinfección química certificada, manejo ecológico de mermas y salud ocupacional.',
      subareas: [
        { name: 'Inocuidad Alimentaria & Sistema HACCP', items: 24, desc: 'Prevención de contaminación cruzada, tablas codificadas y lavado higiénico.' },
        { name: 'Protocolos de Sanitización y Químicos Grado Alimentario', items: 18, desc: 'Fichas de seguridad de desinfectantes y cronogramas de desinfección profunda.' },
        { name: 'Manejo Técnico de Mermas y Economía Circular', items: 16, desc: 'Registro de desperdicios, compostaje de residuos orgánicos y reciclaje de vidrio/aceites.' },
        { name: 'Salud Ocupacional e Infraestructura Sanitaria', items: 16, desc: 'Certificados de salud al día, uniformidad reglamentaria y trampas de grasa operativas.' }
      ]
    }
  ],
  certificationSteps: [
    {
      step: 1,
      title: 'Postulación & Pre-Diagnóstico Digital',
      desc: 'El establecimiento solicita la auditoría a través de la plataforma de la Cámara completando el formulario inicial de autoevaluación.',
      icon: 'FileText'
    },
    {
      step: 2,
      title: 'Auditoría Técnica In-Situ (226 Ítems)',
      desc: 'Auditores técnicos certificados por la Cámara realizan inspecciones no anunciadas y programadas en cocina, almacenes, sala y baños.',
      icon: 'Search'
    },
    {
      step: 3,
      title: 'Laboratorio de Calidad & Evaluación Sensorial',
      desc: 'Muestreo de platos, verificación de temperaturas en mesa y evaluación de la experiencia completa del comensal.',
      icon: 'Sliders'
    },
    {
      step: 4,
      title: 'Plan de Mejora Continua & Dictamen',
      desc: 'Si el puntaje supera el 92% se otorga la Calificación AAA. En caso contrario, se brinda acompañamiento técnico durante 30 días para solventar no conformidades.',
      icon: 'TrendingUp'
    },
    {
      step: 5,
      title: 'Otorgamiento del Sello AAA & Placa Oficial',
      desc: 'Entrega de la placa física con código QR verificable para la fachada del local y distintivo digital para cartas, web y guías internacionales.',
      icon: 'Award'
    }
  ],
  certifiedEstablishments: [
    {
      id: 'cert-01',
      name: 'Restaurante Los Portales Andinos',
      zone: 'Eje Metropolitano (Mérida Centro)',
      score: 98.4,
      tier: 'AAA Oro Cumbre',
      certNumber: 'MG-2026-001-AAA',
      validUntil: 'Noviembre 2027',
      chef: 'Chef Valentina Morales',
      inspectedDate: '15 de Enero de 2026',
      badge: 'Certificación Vigente'
    },
    {
      id: 'cert-02',
      name: 'La Cava de la Sierra & Grill',
      zone: 'Eje Metropolitano (El Valle)',
      score: 97.2,
      tier: 'AAA Oro Cumbre',
      certNumber: 'MG-2026-004-AAA',
      validUntil: 'Diciembre 2027',
      chef: 'Chef Alejandro Rondón',
      inspectedDate: '22 de Enero de 2026',
      badge: 'Certificación Vigente'
    },
    {
      id: 'cert-03',
      name: 'Refugio Andino Mucubají',
      zone: 'Eje Páramo (Apartaderos)',
      score: 95.8,
      tier: 'AAA Plata Andina',
      certNumber: 'MG-2026-008-AAA',
      validUntil: 'Octubre 2027',
      chef: 'Chef María Eugenia Paredes',
      inspectedDate: '5 de Febrero de 2026',
      badge: 'Certificación Vigente'
    },
    {
      id: 'cert-04',
      name: 'Café Origen & Sierra',
      zone: 'Eje Valle del Mocotíes (Tovar)',
      score: 96.5,
      tier: 'AAA Oro Cumbre',
      certNumber: 'MG-2026-012-AAA',
      validUntil: 'Enero 2028',
      chef: 'Barista Maestro Carlos Albarrán',
      inspectedDate: '12 de Febrero de 2026',
      badge: 'Certificación Vigente'
    },
    {
      id: 'cert-05',
      name: 'Atelier Cacao Porcelana',
      zone: 'Eje Metropolitano (Mérida Milla)',
      score: 99.1,
      tier: 'AAA Diamante de Altura',
      certNumber: 'MG-2026-015-AAA',
      validUntil: 'Marzo 2028',
      chef: 'Maître Chocolatier Elena Briceño',
      inspectedDate: '28 de Febrero de 2026',
      badge: 'Certificación Vigente'
    }
  ]
};
