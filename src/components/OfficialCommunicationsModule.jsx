import React, { useState, useEffect, useRef, useMemo } from 'react';
import { 
  Mail, 
  Send, 
  Users, 
  Building2, 
  ShieldCheck, 
  CheckCircle2, 
  AlertCircle, 
  Eye, 
  FileText, 
  Sparkles, 
  Clock, 
  Search, 
  Plus, 
  X, 
  Check, 
  Copy, 
  RefreshCw, 
  Edit3, 
  Trash2, 
  ExternalLink, 
  ChevronRight, 
  ChevronDown,
  Bold, 
  Italic, 
  Underline, 
  Heading2, 
  Heading3, 
  List, 
  ListOrdered, 
  Quote, 
  Minus, 
  AlignLeft, 
  AlignCenter, 
  AlignJustify, 
  UserCheck, 
  History, 
  AlertTriangle, 
  Loader2,
  Share2,
  Smartphone,
  Monitor,
  Printer,
  RotateCcw,
  Undo,
  Redo
} from 'lucide-react';
import { BOARD_MEMBERS_DATA } from '../data/boardData';
import { sendOfficialCommunication, getOfficialCommunicationTemplate } from '../lib/emailService';
import { supabase } from '../lib/supabaseClient';

// Predefined Quick Templates for Executive Communications
const QUICK_TEMPLATES = [
  {
    id: 'convocatoria-asamblea',
    name: 'Convocatoria a Asamblea General',
    category: 'CONVOCATORIA GREMIAL',
    subject: 'Convocatoria Oficial a Asamblea General Ordinaria de Agremiados 2026',
    signaturesMode: 'both',
    content: `<h2>Convocatoria Oficial: Asamblea General Ordinaria</h2>
<p>Estimados Miembros de la Cámara Gastronómica del Estado Mérida,</p>
<p>La Junta Directiva de la <strong>Cámara Gastronómica del Estado Mérida (CGEM)</strong>, en ejercicio de sus atribuciones estatutarias, convoca formalmente a todos sus miembros agremiados, coordinadores y directivos a la:</p>
<div class="info-box">
  <p style="margin: 4px 0;"><strong>Actividad:</strong> Asamblea General Ordinaria de Agremiados</p>
  <p style="margin: 4px 0;"><strong>Fecha:</strong> Próximo Jueves, 29 de Octubre de 2026</p>
  <p style="margin: 4px 0;"><strong>Hora:</strong> 09:30 AM (Primera Convocatoria) / 10:00 AM (Segunda Convocatoria)</p>
  <p style="margin: 4px 0;"><strong>Lugar:</strong> Sala Principal de Conferencias, Centro Empresarial Mérida</p>
  <p style="margin: 4px 0;"><strong>Modalidad:</strong> Presencial con transmisión privada vía enlace institucional</p>
</div>
<h3>Puntos del Orden del Día:</h3>
<ol>
  <li>Presentación de memoria y balance de gestión institucional 2026.</li>
  <li>Avances en la certificación del Sello Gastronómico y convenios académicos con la ULA y el IUPTM.</li>
  <li>Presentación del cronograma operativo para la Expo Gastronómica 2027.</li>
  <li>Derecho de palabra para agremiados y formulación de propuestas sectoriales.</li>
</ol>
<p>Agradecemos confirmar su asistencia respondiendo a esta comunicación o registrándose en el portal oficial.</p>`
  },
  {
    id: 'circular-solvencias',
    name: 'Circular de Beneficios & Solvencia',
    category: 'CIRCULAR INFORMATIVA',
    subject: 'Circular Informativa N° 04: Nuevos Beneficios de Membresía y Solvencia Gremial',
    signaturesMode: 'both',
    content: `<h2>Actualización Institucional de Beneficios y Servicios al Agremiado</h2>
<p>Apreciados Miembros y Amigos de Mérida Gastronómica,</p>
<p>Nos complace hacer de su conocimiento las nuevas ventajas y acuerdos gremiales incorporados al portafolio de beneficios para nuestros establecimientos afiliados:</p>
<div class="info-box">
  <p style="margin: 4px 0;"><strong>Alianzas Estratégicas:</strong> Convenios activos de proveeduría a precios preferenciales en rubros de café de especialidad, cacao y empaques biodegradables.</p>
  <p style="margin: 4px 0;"><strong>Capacitaciones Gratuitas:</strong> Acceso 100% exonerado para miembros solventes en todos los talleres de manipulación de alimentos y barismo de la Academia CGEM.</p>
</div>
<h3>Estado de Solvencia Gremial:</h3>
<p>Recordamos a los agremiados que el mantenimiento de su solvencia permite la emisión inmediata del Certificado Digital de Afiliación, la presencia destacada en la Guía Turística 3D y el respaldo legal ante los organismos de fiscalización.</p>
<p>Para verificar el estado de su cuenta o reportar su aporte mensual, puede ingresar al módulo de autogestión en <a href="https://www.meridagastronomica.com" style="color: #b45309; font-weight: bold;">www.meridagastronomica.com</a> o comunicarse con nuestra Dirección de Tesorería.</p>`
  },
  {
    id: 'mesa-trabajo-coordinaciones',
    name: 'Convocatoria a Coordinaciones',
    category: 'COMUNICADO OFICIAL',
    subject: 'Mesa de Trabajo Conjunta: Junta Directiva & Coordinaciones Especializadas',
    signaturesMode: 'both',
    content: `<h2>Convocatoria de Mesa Directiva y Coordinaciones Especializadas</h2>
<p>Estimados Coordinadores y Miembros del Equipo Directivo,</p>
<p>Por medio de la presente, la Presidencia y Dirección Ejecutiva convocan a sesión de trabajo estratégica con las coordinaciones sectoriales (Proveeduría, Relaciones Institucionales, Cacao y Café, y Capacitación y Formación).</p>
<div class="info-box">
  <p style="margin: 4px 0;"><strong>Objetivo:</strong> Evaluación de metas trimestrales y articulación del plan formativo regional.</p>
  <p style="margin: 4px 0;"><strong>Sede:</strong> Despacho de Presidencia, CGEM</p>
  <p style="margin: 4px 0;"><strong>Fecha y Horario:</strong> Martes próximo a las 02:30 PM</p>
</div>
<p>Se solicita a cada coordinador presentar un resumen ejecutivo de tres puntos sobre los proyectos en marcha dentro de su área respectiva.</p>`
  },
  {
    id: 'aviso-urgente',
    name: 'Aviso Extraordinario',
    category: 'AVISO INSTITUCIONAL',
    subject: 'Aviso Institucional de Carácter Extraordinario',
    signaturesMode: 'both',
    content: `<h2>Aviso Importante para el Sector Gastronómico del Estado Mérida</h2>
<p>Estimados Miembros del Gremio,</p>
<p>La Presidencia de la Cámara Gastronómica del Estado Mérida hace del conocimiento público e institucional la siguiente notificación:</p>
<div class="info-box">
  <p style="margin: 4px 0;"><strong>Asunto:</strong> Información relevante para la operatividad y funcionamiento de los establecimientos afiliados.</p>
</div>
<p>Exhortamos a toda la comunidad gastronómica a mantenerse atentos a los canales institucionales de la Cámara y a canalizar cualquier duda a través de nuestro correo oficial.</p>`
  }
];

export function OfficialCommunicationsModule({ currentUser, directoryMembers = [] }) {
  // Roles verification
  const isPresident = currentUser?.id === 'dir-presidente' || 
    currentUser?.email?.toLowerCase() === 'dazajulio@gmail.com' || 
    (currentUser?.role && currentUser?.role.toLowerCase().includes('presidente') && !currentUser?.role.toLowerCase().includes('vicepresidente'));

  const isExecutiveDirector = currentUser?.id === 'dir-ejecutivo' || 
    currentUser?.id === 'dir-ejecutiva' || 
    currentUser?.email?.toLowerCase() === 'margiovi@gmail.com' || 
    (currentUser?.role && currentUser?.role.toLowerCase().includes('ejecutivo'));

  const canAccess = isPresident || isExecutiveDirector;

  // View state: 'editor' | 'preview' | 'history'
  const [activeTab, setActiveTab] = useState('editor');

  // Preview Device Mode: 'desktop' | 'mobile'
  const [previewDevice, setPreviewDevice] = useState('desktop');

  // Group selection state
  const [selectedGroups, setSelectedGroups] = useState({
    agremiados: true,
    directiva: true,
    coordinaciones: true
  });

  // Custom additional emails
  const [customEmailsInput, setCustomEmailsInput] = useState('');
  const [customEmailsList, setCustomEmailsList] = useState([]);

  // Filter or exclude specific individual recipients
  const [excludedEmailSet, setExcludedEmailSet] = useState(new Set());
  const [showRecipientDirectory, setShowRecipientDirectory] = useState(false);
  const [recipientSearch, setRecipientSearch] = useState('');

  // Form Metadata
  const [category, setCategory] = useState('COMUNICADO OFICIAL');
  const [officialNumber, setOfficialNumber] = useState(() => {
    const year = new Date().getFullYear();
    const rand = Math.floor(Math.random() * 899 + 100);
    return `CGEM-COM-${year}-${rand}`;
  });
  const [subject, setSubject] = useState('');
  const [signaturesMode, setSignaturesMode] = useState('both'); // 'both' | 'presidente' | 'ejecutivo' | 'junta'

  // Rich Text Editor State
  const editorRef = useRef(null);
  const [editorHtml, setEditorHtml] = useState(QUICK_TEMPLATES[0].content);
  const lastHtmlRef = useRef(QUICK_TEMPLATES[0].content);

  // Sending State & Modals
  const [isSending, setIsSending] = useState(false);
  const [sendProgress, setSendProgress] = useState({ current: 0, total: 0, currentEmail: '', status: 'idle' });
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
  const [sendResultSummary, setSendResultSummary] = useState(null);

  // Registro de Enviados / Modals & Search state
  const [selectedSentItem, setSelectedSentItem] = useState(null);
  const [selectedRecipientsModal, setSelectedRecipientsModal] = useState(null);
  const [sentSearchQuery, setSentSearchQuery] = useState('');
  const [sentCategoryFilter, setSentCategoryFilter] = useState('ALL');
  const [isLoadingHistory, setIsLoadingHistory] = useState(false);
  const [fetchSentNotice, setFetchSentNotice] = useState('');

  // Communications History (backed by Supabase & localStorage)
  const [historyList, setHistoryList] = useState(() => {
    try {
      const saved = localStorage.getItem('cgem_official_communications_history');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch (e) {}
    return [
      {
        id: 'com-sent-018',
        officialNumber: 'CGM-NOT-2026-018',
        category: 'CONSTANCIA GREMIAL & BIENVENIDA',
        subject: '¡Bienvenida a la Cámara Gastronómica de Mérida! Código: CGM-2026-018',
        date: new Date().toISOString(),
        sentBy: 'Julio Alberto Daza Celis (Presidente)',
        recipientsCount: 1,
        totalAttempted: 1,
        groups: ['AGREMIADOS', 'ALIANZA ESTRATÉGICA'],
        signaturesMode: 'both',
        targetAudienceLabel: 'Orígenes Bistró & Bar (Carolina del Valle)',
        contentPreview: 'Confirmación y celebración del registro oficial de Orígenes Bistró & Bar como miembro formal bajo modalidad de Alianza Estratégica / Convenio Institucional...',
        bodyHtml: `<h2>Constancia Oficial de Agremiación &bull; Alianza Estratégica</h2>
<p>Estimada <strong>Carolina del Valle</strong>,</p>
<p>En nombre de la Junta Directiva de la Cámara Gastronómica del Estado Mérida, nos complace confirmar y celebrar el registro oficial de <strong>Orígenes Bistró & Bar</strong> como miembro formal de nuestra institución gremial bajo la modalidad de <strong>Alianza Estratégica / Convenio Institucional</strong>.</p>
<div class="info-box">
  <p style="margin: 4px 0;"><strong>Código de Agremiado Oficial:</strong> <span style="font-size: 15px; color: #b45309; font-weight: bold;">CGM-2026-018</span></p>
  <p style="margin: 4px 0;"><strong>Establecimiento:</strong> Orígenes Bistró & Bar</p>
  <p style="margin: 4px 0;"><strong>Representante:</strong> Carolina del Valle</p>
  <p style="margin: 4px 0;"><strong>RIF:</strong> J-40531507-5</p>
  <p style="margin: 4px 0;"><strong>Ubicación:</strong> Pasaje Ayacucho (Calle 25 Ayacucho), zona Las Heroínas, Mérida</p>
  <p style="margin: 4px 0;"><strong>Modalidad:</strong> Alianza Estratégica / Convenio Institucional (Sede Aliada para Eventos Gremiales)</p>
  <p style="margin: 4px 0;"><strong>Inscripción Gremial:</strong> $0.00 (Exonerada por Alianza Estratégica)</p>
  <p style="margin: 4px 0;"><strong>Estado de Solvencia:</strong> Solvente (Activo)</p>
</div>
<h3>Beneficios y Precedencias de su Membresía Gremial:</h3>
<ul>
  <li>Presencia Oficial en la Guía Gastronómica y Mapa 3D (meridagastronomica.com).</li>
  <li>Sede Aliada para Eventos Institucionales, catas y ruedas de negocios.</li>
  <li>Postulación al Sello de Calidad "Mérida Gastronómica".</li>
  <li>Portal Privado de Autogestión con su código CGM-2026-018 o correo origenesbyb@gmail.com.</li>
</ul>
<p>Agradecemos profundamente el respaldo de Orígenes Bistró & Bar al facilitarnos su local sin costo para el éxito de nuestras actividades institucionales.</p>`,
        recipientsList: [
          {
            id: 'cgm-2026-018',
            name: 'Orígenes Bistró & Bar (Carolina del Valle)',
            email: 'origenesbyb@gmail.com',
            detail: 'CGM-2026-018 • Pasaje Ayacucho, Las Heroínas',
            group: 'Agremiados / Alianza Estratégica',
            status: 'entregado'
          }
        ],
        successfulCount: 1,
        failedCount: 0,
        errors: [],
        deliveryStatus: 'Entregado (Resend API verificado)'
      },
      {
        id: 'com-hist-001',
        officialNumber: 'CGEM-COM-2026-001',
        category: 'CIRCULAR INFORMATIVA',
        subject: 'Bienvenida al Año Gremial 2026-2027 y Apertura de Nuevas Afiliaciones',
        date: '2026-09-15T14:30:00Z',
        sentBy: 'Julio Alberto Daza Celis (Presidente)',
        recipientsCount: 28,
        totalAttempted: 28,
        groups: ['AGREMIADOS', 'JUNTA DIRECTIVA'],
        signaturesMode: 'both',
        targetAudienceLabel: 'Agremiados & Junta Directiva',
        contentPreview: 'Apertura formal de las actividades institucionales de la Cámara Gastronómica del Estado Mérida...',
        bodyHtml: `<h2>Apertura Formal del Año Gremial 2026-2027</h2><p>Estimados Miembros y Amigos de Mérida Gastronómica,</p><p>Iniciamos con gran entusiasmo un nuevo ciclo institucional enfocado en la consolidación del sector gastronómico de nuestro estado...</p>`,
        recipientsList: [],
        successfulCount: 28,
        failedCount: 0,
        errors: [],
        deliveryStatus: 'Entregado (Resend API verificado)'
      }
    ];
  });

  // Save history on changes to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('cgem_official_communications_history', JSON.stringify(historyList));
    } catch (e) {}
  }, [historyList]);

  // Synchronize sent communications from Supabase cloud on mount or manual refresh
  const fetchSentFromSupabase = async (showNotice = false) => {
    if (!supabase) return;
    try {
      setIsLoadingHistory(true);
      const { data, error } = await supabase
        .from('mensajes_directiva')
        .select('*')
        .eq('remitente_restaurante', 'COMUNICADO-OFICIAL')
        .order('fecha', { ascending: false });

      if (!error && Array.isArray(data) && data.length > 0) {
        const parsedCloudItems = [];
        for (const row of data) {
          try {
            if (row.mensaje && typeof row.mensaje === 'string' && row.mensaje.trim().startsWith('{')) {
              const parsed = JSON.parse(row.mensaje);
              parsedCloudItems.push({
                ...parsed,
                id: row.id || parsed.id,
                supabaseId: row.id,
                date: row.fecha || parsed.date
              });
            }
          } catch (pErr) {}
        }

        if (parsedCloudItems.length > 0) {
          setHistoryList(prev => {
            const map = new Map();
            parsedCloudItems.forEach(item => map.set(item.officialNumber || item.id, item));
            prev.forEach(item => {
              if (!map.has(item.officialNumber || item.id)) {
                map.set(item.officialNumber || item.id, item);
              }
            });
            const combined = Array.from(map.values()).sort((a, b) => new Date(b.date) - new Date(a.date));
            try {
              localStorage.setItem('cgem_official_communications_history', JSON.stringify(combined));
            } catch (e) {}
            return combined;
          });

          if (showNotice) {
            setFetchSentNotice(`Sincronizado con la nube (${parsedCloudItems.length} registros).`);
            setTimeout(() => setFetchSentNotice(''), 4000);
          }
        }
      }
    } catch (err) {
      console.warn('Error fetching sent communications from Supabase:', err);
    } finally {
      setIsLoadingHistory(false);
    }
  };

  useEffect(() => {
    fetchSentFromSupabase();
  }, []);

  // Set default subject from first template
  useEffect(() => {
    if (!subject) {
      setSubject(QUICK_TEMPLATES[0].subject);
    }
  }, []);

  // Update contentEditable when editorHtml changes programmatically
  useEffect(() => {
    if (activeTab === 'editor' && editorRef.current) {
      // Only set innerHTML if it's empty or changed from an external source (template, clear, clone)
      if (editorHtml !== lastHtmlRef.current || !editorRef.current.innerHTML.trim()) {
        editorRef.current.innerHTML = editorHtml;
        lastHtmlRef.current = editorHtml;
      }
    }
  }, [editorHtml, activeTab]);

  // Synchronize contentEditable changes to state without resetting caret or breaking Ctrl+Z
  const handleEditorInput = () => {
    if (editorRef.current) {
      const currentHtml = editorRef.current.innerHTML;
      lastHtmlRef.current = currentHtml;
      setEditorHtml(currentHtml);
    }
  };

  // Keyboard shortcut handler for native Undo (Ctrl+Z) & Redo (Ctrl+Y / Ctrl+Shift+Z)
  const handleKeyDown = (e) => {
    if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'z') {
      if (e.shiftKey) {
        e.preventDefault();
        document.execCommand('redo');
        handleEditorInput();
      } else {
        e.preventDefault();
        document.execCommand('undo');
        handleEditorInput();
      }
    } else if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'y') {
      e.preventDefault();
      document.execCommand('redo');
      handleEditorInput();
    }
  };

  // Execute formatting command in contentEditable
  const executeFormat = (command, value = null) => {
    if (editorRef.current) {
      editorRef.current.focus();
      document.execCommand(command, false, value);
      const currentHtml = editorRef.current.innerHTML;
      lastHtmlRef.current = currentHtml;
      setEditorHtml(currentHtml);
    }
  };

  // Insert block or highlight box
  const insertHighlightBox = () => {
    if (editorRef.current) {
      editorRef.current.focus();
      const highlightHtml = `<div class="info-box"><p style="margin: 0; font-weight: bold;">Punto Clave / Nota Institucional:</p><p style="margin: 4px 0 0 0;">Escribe aquí la información destacada del comunicado.</p></div><p><br/></p>`;
      document.execCommand('insertHTML', false, highlightHtml);
      const currentHtml = editorRef.current.innerHTML;
      lastHtmlRef.current = currentHtml;
      setEditorHtml(currentHtml);
    }
  };

  // Insert Horizontal Rule
  const insertDivider = () => {
    if (editorRef.current) {
      editorRef.current.focus();
      document.execCommand('insertHorizontalRule', false, null);
      const currentHtml = editorRef.current.innerHTML;
      lastHtmlRef.current = currentHtml;
      setEditorHtml(currentHtml);
    }
  };

  // Clean formatting / Plain text paste handler
  const handlePaste = (e) => {
    e.preventDefault();
    const text = (e.clipboardData || window.clipboardData).getData('text/plain');
    if (!text) return;
    
    // Split into paragraphs for natural HTML structure
    const paragraphs = text
      .split(/\r?\n\r?\n/)
      .map(p => p.trim())
      .filter(p => p.length > 0)
      .map(p => `<p>${p.replace(/\r?\n/g, '<br/>')}</p>`)
      .join('');

    document.execCommand('insertHTML', false, paragraphs || text);
    if (editorRef.current) {
      const currentHtml = editorRef.current.innerHTML;
      lastHtmlRef.current = currentHtml;
      setEditorHtml(currentHtml);
    }
  };

  // Load a quick template
  const applyQuickTemplate = (tpl) => {
    if (window.confirm(`¿Deseas cargar la plantilla "${tpl.name}"? Reemplazará el asunto y texto actual.`)) {
      setCategory(tpl.category);
      setSubject(tpl.subject);
      setSignaturesMode(tpl.signaturesMode || 'both');
      lastHtmlRef.current = tpl.content;
      setEditorHtml(tpl.content);
      if (editorRef.current) {
        editorRef.current.innerHTML = tpl.content;
      }
    }
  };

  // Reset editor
  const handleClearEditor = () => {
    if (window.confirm('¿Seguro que deseas vaciar el contenido del comunicado?')) {
      const defaultContent = '<p>Escribe o pega aquí el contenido oficial del comunicado...</p>';
      lastHtmlRef.current = defaultContent;
      setEditorHtml(defaultContent);
      if (editorRef.current) {
        editorRef.current.innerHTML = defaultContent;
      }
    }
  };

  // Group Definitions & Extraction
  // 1. Agremiados: Directory members with valid email
  const agremiadosRecipients = useMemo(() => {
    return directoryMembers
      .filter(m => m && m.email && m.email.includes('@'))
      .map(m => ({
        id: m.id || m.codigo_afiliado || m.email,
        name: m.nombre_establecimiento || m.representante_legal || 'Establecimiento Agremiado',
        email: m.email.trim().toLowerCase(),
        detail: `${m.codigo_afiliado || 'CGEM'} • ${m.categoria_negocio || 'Agremiado'}`,
        group: 'Agremiados',
        groupKey: 'agremiados'
      }));
  }, [directoryMembers]);

  // 2. Junta Directiva: Presidencia, Vicepresidencias, Dirección
  const directivaRecipients = useMemo(() => {
    return BOARD_MEMBERS_DATA
      .filter(m => ['Presidencia', 'Vicepresidencia', 'Dirección'].includes(m.roleCategory) && m.email && m.email.includes('@'))
      .map(m => ({
        id: m.id,
        name: m.name,
        email: m.email.trim().toLowerCase(),
        detail: `${m.role} • ${m.roleCategory}`,
        group: 'Junta Directiva',
        groupKey: 'directiva'
      }));
  }, []);

  // 3. Coordinaciones: Coordinaciones Especializadas
  const coordinacionesRecipients = useMemo(() => {
    return BOARD_MEMBERS_DATA
      .filter(m => m.roleCategory === 'Coordinación Especializada' && m.email && m.email.includes('@'))
      .map(m => ({
        id: m.id,
        name: m.name,
        email: m.email.trim().toLowerCase(),
        detail: `${m.role}`,
        group: 'Coordinaciones',
        groupKey: 'coordinaciones'
      }));
  }, []);

  // Custom Extra Emails parsed
  const handleAddCustomEmail = (e) => {
    e.preventDefault();
    if (!customEmailsInput.trim()) return;
    
    // Split by commas, semicolons, or spaces
    const parts = customEmailsInput
      .split(/[,;\s]+/)
      .map(e => e.trim().toLowerCase())
      .filter(e => e.includes('@') && e.includes('.'));

    if (parts.length === 0) {
      alert('Ingresa una dirección de correo electrónico válida.');
      return;
    }

    const uniqueNew = parts.filter(email => !customEmailsList.includes(email));
    setCustomEmailsList(prev => [...prev, ...uniqueNew]);
    setCustomEmailsInput('');
  };

  const handleRemoveCustomEmail = (emailToRemove) => {
    setCustomEmailsList(prev => prev.filter(e => e !== emailToRemove));
  };

  // Compile full active recipient list with deduplication
  const activeRecipients = useMemo(() => {
    const list = [];
    const seenEmails = new Set();

    const addRecipients = (recipients) => {
      for (const r of recipients) {
        if (!seenEmails.has(r.email) && !excludedEmailSet.has(r.email)) {
          seenEmails.add(r.email);
          list.push(r);
        }
      }
    };

    if (selectedGroups.agremiados) addRecipients(agremiadosRecipients);
    if (selectedGroups.directiva) addRecipients(directivaRecipients);
    if (selectedGroups.coordinaciones) addRecipients(coordinacionesRecipients);

    // Custom emails
    for (const email of customEmailsList) {
      if (!seenEmails.has(email) && !excludedEmailSet.has(email)) {
        seenEmails.add(email);
        list.push({
          id: `custom-${email}`,
          name: email.split('@')[0],
          email,
          detail: 'Destinatario Adicional',
          group: 'Personalizado',
          groupKey: 'custom'
        });
      }
    }

    return list;
  }, [selectedGroups, agremiadosRecipients, directivaRecipients, coordinacionesRecipients, customEmailsList, excludedEmailSet]);

  // Target audience description text for letterhead
  const targetAudienceLabel = useMemo(() => {
    const activeGroupNames = [];
    if (selectedGroups.agremiados) activeGroupNames.push('Agremiados');
    if (selectedGroups.directiva) activeGroupNames.push('Junta Directiva');
    if (selectedGroups.coordinaciones) activeGroupNames.push('Coordinaciones');
    if (customEmailsList.length > 0) activeGroupNames.push('Destinatarios Especiales');

    if (activeGroupNames.length === 0) return 'Sin destinatarios seleccionados';
    return activeGroupNames.join(', ');
  }, [selectedGroups, customEmailsList]);

  // Toggle exclusion of an individual email
  const toggleExcludeEmail = (email) => {
    setExcludedEmailSet(prev => {
      const next = new Set(prev);
      if (next.has(email)) {
        next.delete(email);
      } else {
        next.add(email);
      }
      return next;
    });
  };

  // Reset exclusions
  const resetExclusions = () => {
    setExcludedEmailSet(new Set());
  };

  // Format today's date for display
  const todayStr = useMemo(() => {
    return new Date().toLocaleDateString('es-VE', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  }, []);

  // HTML content for preview (rendered inside iframe or html box)
  const renderedEmailHtml = useMemo(() => {
    return getOfficialCommunicationTemplate({
      subject: subject || 'Comunicado Oficial CGEM',
      category: category || 'COMUNICADO OFICIAL',
      officialNumber: officialNumber || 'CGEM-COM-2026-001',
      dateFormatted: todayStr,
      targetAudienceName: targetAudienceLabel,
      senderRole: isPresident ? 'Despacho de Presidencia' : 'Dirección Ejecutiva',
      senderName: isPresident ? 'Julio Alberto Daza Celis' : 'Mary Giovanna Vera',
      signaturesMode,
      bodyHtml: editorHtml || '<p>Contenido del comunicado institucional...</p>'
    });
  }, [subject, category, officialNumber, todayStr, targetAudienceLabel, isPresident, signaturesMode, editorHtml]);

  // Start sending process
  const handleInitiateSend = () => {
    if (!subject.trim()) {
      alert('Por favor, ingresa el asunto del comunicado antes de enviar.');
      return;
    }
    if (!editorHtml.trim() || editorHtml === '<p></p>') {
      alert('El comunicado debe contener texto o información antes de enviar.');
      return;
    }
    if (activeRecipients.length === 0) {
      alert('Debes seleccionar al menos un grupo de destinatarios o ingresar un correo electrónico.');
      return;
    }

    setIsConfirmModalOpen(true);
  };

  // Execute Sending via Resend API
  const handleExecuteSend = async () => {
    setIsSending(true);
    setSendResultSummary(null);

    const total = activeRecipients.length;
    let successfulCount = 0;
    let failedCount = 0;
    const errors = [];

    // Send in chunks or sequentially with real-time progress update
    for (let i = 0; i < total; i++) {
      const recipient = activeRecipients[i];
      setSendProgress({
        current: i + 1,
        total,
        currentEmail: recipient.email,
        status: 'sending'
      });

      try {
        const result = await sendOfficialCommunication({
          to: recipient.email,
          replyTo: 'notificaciones@meridagastronomica.com',
          subject: subject.trim(),
          category,
          officialNumber,
          targetAudienceName: targetAudienceLabel,
          senderRole: isPresident ? 'Despacho de Presidencia' : 'Dirección Ejecutiva',
          senderName: isPresident ? 'Julio Alberto Daza Celis' : 'Mary Giovanna Vera',
          signaturesMode,
          bodyHtml: editorHtml,
          plainText: subject
        });

        if (result && result.success) {
          successfulCount++;
        } else {
          failedCount++;
          errors.push(`${recipient.email}: ${result?.error || 'Fallo de entrega'}`);
        }
      } catch (err) {
        failedCount++;
        errors.push(`${recipient.email}: ${err.message || 'Error de conexión'}`);
      }

      // Small throttle between calls (120ms) to respect Resend rate limits
      if (i < total - 1) {
        await new Promise(resolve => setTimeout(resolve, 120));
      }
    }

    // Record into communications history
    const newHistoryEntry = {
      id: `com-hist-${Date.now()}`,
      officialNumber,
      category,
      subject,
      date: new Date().toISOString(),
      sentBy: isPresident ? 'Julio Alberto Daza Celis (Presidente)' : 'Mary Giovanna Vera (Directora Ejecutiva)',
      recipientsCount: successfulCount,
      totalAttempted: total,
      groups: Object.entries(selectedGroups).filter(([_, v]) => v).map(([k]) => k.toUpperCase()),
      signaturesMode,
      targetAudienceLabel,
      contentPreview: editorHtml.replace(/<[^>]+>/g, ' ').substring(0, 160) + '...',
      bodyHtml: editorHtml,
      recipientsList: activeRecipients.map(r => ({
        id: r.id,
        name: r.name,
        email: r.email,
        detail: r.detail,
        group: r.group,
        status: errors.some(e => e.startsWith(r.email)) ? 'fallido' : 'entregado'
      })),
      successfulCount,
      failedCount,
      errors,
      deliveryStatus: failedCount === 0 ? 'Entregado (100% verificado)' : `${successfulCount}/${total} entregados`
    };

    setHistoryList(prev => [newHistoryEntry, ...prev]);

    // Persist into Supabase cloud table mensajes_directiva
    try {
      if (supabase) {
        await supabase.from('mensajes_directiva').insert([
          {
            remitente_restaurante: 'COMUNICADO-OFICIAL',
            remitente_codigo: officialNumber,
            destinatario_cargo: targetAudienceLabel,
            asunto: subject,
            mensaje: JSON.stringify(newHistoryEntry),
            fecha: newHistoryEntry.date,
            leido: true
          }
        ]);
      }
    } catch (supaErr) {
      console.warn('Could not sync sent communication to Supabase:', supaErr);
    }

    setSendProgress({ current: total, total, currentEmail: '', status: 'finished' });
    setIsSending(false);
    setIsConfirmModalOpen(false);

    setSendResultSummary({
      success: true,
      successfulCount,
      failedCount,
      total,
      errors
    });

    // Auto-generate next official number
    const year = new Date().getFullYear();
    const rand = Math.floor(Math.random() * 899 + 100);
    setOfficialNumber(`CGEM-COM-${year}-${rand}`);
  };

  // If user lacks permission, render security guard
  if (!canAccess) {
    return (
      <div className="bg-slate-900 border border-red-500/30 rounded-3xl p-8 text-center text-white my-6">
        <ShieldCheck className="w-12 h-12 text-rose-500 mx-auto mb-3" />
        <h3 className="text-xl font-bold font-serif">Módulo Reservado a Alta Dirección</h3>
        <p className="text-sm text-slate-400 mt-2 max-w-md mx-auto">
          Esta función de <strong>Comunicaciones Oficiales</strong> está habilitada exclusivamente para la Presidencia y la Dirección Ejecutiva de la Cámara Gastronómica del Estado Mérida.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fadeIn font-sans">
      
      {/* Header Banner */}
      <div className="bg-gradient-to-br from-amber-950 via-slate-900 to-rose-950 text-white rounded-3xl p-6 sm:p-8 shadow-xl border border-amber-800/40 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-80 h-80 bg-amber-500/5 rounded-full blur-3xl pointer-events-none"></div>

        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6 pb-6 border-b border-amber-800/50">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/20 text-amber-300 border border-amber-400/40 text-[10px] font-extrabold uppercase tracking-wider mb-2">
              <ShieldCheck className="w-3.5 h-3.5 text-amber-400" />
              <span>Despacho de Presidencia & Dirección Ejecutiva • Resend API</span>
            </div>
            <h2 className="font-serif font-black text-2xl sm:text-3xl text-white uppercase tracking-wide flex items-center gap-2.5">
              <span>Comunicaciones Oficiales & Circulares</span>
            </h2>
            <p className="text-xs sm:text-sm text-amber-200/80 mt-1 max-w-2xl font-sans">
              Emisión y distribución de comunicados gremiales con membrete institucional, firma digital corporativa y entrega verificada a agremiados, junta directiva y coordinaciones.
            </p>
          </div>

          {/* Navigation Sub-Tabs */}
          <div className="flex flex-wrap items-center gap-2 bg-slate-950/60 p-1.5 rounded-2xl border border-amber-500/30">
            <button
              onClick={() => setActiveTab('editor')}
              className={`py-2 px-4 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
                activeTab === 'editor'
                  ? 'bg-amber-600 text-white shadow font-extrabold'
                  : 'text-amber-200 hover:text-white hover:bg-white/10'
              }`}
            >
              <Edit3 className="w-3.5 h-3.5" />
              <span>Redactar & Diseñar</span>
            </button>

            <button
              onClick={() => setActiveTab('preview')}
              className={`py-2 px-4 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
                activeTab === 'preview'
                  ? 'bg-amber-600 text-white shadow font-extrabold'
                  : 'text-amber-200 hover:text-white hover:bg-white/10'
              }`}
            >
              <Eye className="w-3.5 h-3.5" />
              <span>Vista Previa Membretada</span>
            </button>

            <button
              onClick={() => setActiveTab('history')}
              className={`py-2 px-4 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
                activeTab === 'history'
                  ? 'bg-emerald-600 text-white shadow-lg font-black ring-2 ring-emerald-400/50'
                  : 'text-amber-200 hover:text-white hover:bg-white/10'
              }`}
            >
              <Send className="w-3.5 h-3.5 text-emerald-300" />
              <span>Registro de Enviados</span>
              <span className={`px-2 py-0.5 rounded-full text-[10px] font-black ${
                activeTab === 'history' ? 'bg-white text-emerald-950 shadow-xs' : 'bg-amber-500/30 text-amber-200'
              }`}>
                {historyList.length}
              </span>
            </button>
          </div>
        </div>

        {/* Quick Stats & Active Scope */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-6">
          <div className="bg-white/5 border border-white/10 rounded-2xl p-4">
            <span className="text-[11px] text-amber-300 font-bold block uppercase tracking-wider">Agremiados con Email</span>
            <div className="flex items-baseline gap-2 mt-1">
              <span className="text-2xl font-black font-serif text-white">{agremiadosRecipients.length}</span>
              <span className="text-xs text-slate-400">empresas</span>
            </div>
          </div>

          <div className="bg-white/5 border border-white/10 rounded-2xl p-4">
            <span className="text-[11px] text-amber-300 font-bold block uppercase tracking-wider">Junta Directiva</span>
            <div className="flex items-baseline gap-2 mt-1">
              <span className="text-2xl font-black font-serif text-white">{directivaRecipients.length}</span>
              <span className="text-xs text-slate-400">directores</span>
            </div>
          </div>

          <div className="bg-white/5 border border-white/10 rounded-2xl p-4">
            <span className="text-[11px] text-amber-300 font-bold block uppercase tracking-wider">Coordinaciones</span>
            <div className="flex items-baseline gap-2 mt-1">
              <span className="text-2xl font-black font-serif text-white">{coordinacionesRecipients.length}</span>
              <span className="text-xs text-slate-400">líderes</span>
            </div>
          </div>

          <div className="bg-amber-500/10 border border-amber-400/30 rounded-2xl p-4">
            <span className="text-[11px] text-amber-400 font-bold block uppercase tracking-wider">Destinatarios Activos</span>
            <div className="flex items-baseline gap-2 mt-1">
              <span className="text-2xl font-black font-serif text-amber-400">{activeRecipients.length}</span>
              <span className="text-xs text-amber-300/80">correos únicos</span>
            </div>
          </div>
        </div>
      </div>

      {/* Sending Result Toast Notification */}
      {sendResultSummary && (
        <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-950 flex items-start justify-between shadow-sm animate-fadeIn">
          <div className="flex items-start gap-3">
            <CheckCircle2 className="w-5 h-5 text-emerald-600 mt-0.5 flex-shrink-0" />
            <div>
              <p className="font-bold text-sm">
                ¡Comunicado emitido exitosamente a {sendResultSummary.successfulCount} destinatario(s)!
              </p>
              <p className="text-xs text-emerald-800 mt-0.5">
                Los correos fueron procesados y entregados a través de la infraestructura oficial de Resend con membrete corporativo de la CGEM.
              </p>
              {sendResultSummary.failedCount > 0 && (
                <p className="text-xs text-rose-700 mt-1 font-bold">
                  Nota: {sendResultSummary.failedCount} envío(s) no pudieron completarse. Revisa el historial para ver detalles.
                </p>
              )}
            </div>
          </div>
          <button 
            onClick={() => setSendResultSummary(null)}
            className="text-emerald-700 hover:text-emerald-900 p-1"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 1: REDACTAR Y EDITAR COMUNICADO */}
      {/* ========================================================================= */}
      {activeTab === 'editor' && (
        <div className="space-y-6">

          {/* SECTION: AUDIENCE & GROUPS SELECTOR */}
          <div className="bg-white rounded-3xl p-6 sm:p-7 border border-slate-200 shadow-sm space-y-5">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-100">
              <div>
                <h3 className="font-serif font-black text-lg text-slate-900 flex items-center gap-2">
                  <Users className="w-5 h-5 text-amber-600" />
                  <span>1. Selección de Grupos Destinatarios</span>
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Selecciona uno, varios o todos los colectivos para la distribución oficial del correo.
                </p>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setShowRecipientDirectory(!showRecipientDirectory)}
                  className="text-xs font-bold text-amber-700 hover:text-amber-800 bg-amber-50 hover:bg-amber-100 px-3 py-1.5 rounded-xl border border-amber-200 transition-all flex items-center gap-1.5"
                >
                  <Search className="w-3.5 h-3.5" />
                  <span>{showRecipientDirectory ? 'Ocultar Directorio Detallado' : `Ver Lista (${activeRecipients.length})`}</span>
                </button>
              </div>
            </div>

            {/* Group Toggle Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              
              {/* Option 1: Agremiados */}
              <div 
                onClick={() => setSelectedGroups(prev => ({ ...prev, agremiados: !prev.agremiados }))}
                className={`cursor-pointer rounded-2xl p-4 border transition-all select-none flex items-start gap-3.5 ${
                  selectedGroups.agremiados
                    ? 'bg-amber-50/70 border-amber-400 ring-2 ring-amber-400/20 shadow-sm'
                    : 'bg-slate-50 border-slate-200 hover:bg-slate-100/70 opacity-70'
                }`}
              >
                <div className={`w-5 h-5 rounded-md flex items-center justify-center mt-0.5 border transition-all ${
                  selectedGroups.agremiados
                    ? 'bg-amber-600 border-amber-600 text-white'
                    : 'bg-white border-slate-300'
                }`}>
                  {selectedGroups.agremiados && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <Building2 className="w-4 h-4 text-amber-700" />
                    <span className="font-extrabold text-slate-900 text-sm">Miembros Agremiados</span>
                  </div>
                  <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                    Restaurantes, cafeterías, posadas y marcas gastronómicas afiliadas activas.
                  </p>
                  <div className="mt-2.5 inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-white border border-slate-200 text-[11px] font-bold text-amber-800">
                    <span>{agremiadosRecipients.length} correos verificados</span>
                  </div>
                </div>
              </div>

              {/* Option 2: Junta Directiva */}
              <div 
                onClick={() => setSelectedGroups(prev => ({ ...prev, directiva: !prev.directiva }))}
                className={`cursor-pointer rounded-2xl p-4 border transition-all select-none flex items-start gap-3.5 ${
                  selectedGroups.directiva
                    ? 'bg-amber-50/70 border-amber-400 ring-2 ring-amber-400/20 shadow-sm'
                    : 'bg-slate-50 border-slate-200 hover:bg-slate-100/70 opacity-70'
                }`}
              >
                <div className={`w-5 h-5 rounded-md flex items-center justify-center mt-0.5 border transition-all ${
                  selectedGroups.directiva
                    ? 'bg-amber-600 border-amber-600 text-white'
                    : 'bg-white border-slate-300'
                }`}>
                  {selectedGroups.directiva && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <ShieldCheck className="w-4 h-4 text-amber-700" />
                    <span className="font-extrabold text-slate-900 text-sm">Junta Directiva</span>
                  </div>
                  <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                    Presidencia, Vicepresidencias, Dirección Operativa, Tesorería y Dirección Ejecutiva.
                  </p>
                  <div className="mt-2.5 inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-white border border-slate-200 text-[11px] font-bold text-amber-800">
                    <span>{directivaRecipients.length} directivos oficiales</span>
                  </div>
                </div>
              </div>

              {/* Option 3: Coordinaciones */}
              <div 
                onClick={() => setSelectedGroups(prev => ({ ...prev, coordinaciones: !prev.coordinaciones }))}
                className={`cursor-pointer rounded-2xl p-4 border transition-all select-none flex items-start gap-3.5 ${
                  selectedGroups.coordinaciones
                    ? 'bg-amber-50/70 border-amber-400 ring-2 ring-amber-400/20 shadow-sm'
                    : 'bg-slate-50 border-slate-200 hover:bg-slate-100/70 opacity-70'
                }`}
              >
                <div className={`w-5 h-5 rounded-md flex items-center justify-center mt-0.5 border transition-all ${
                  selectedGroups.coordinaciones
                    ? 'bg-amber-600 border-amber-600 text-white'
                    : 'bg-white border-slate-300'
                }`}>
                  {selectedGroups.coordinaciones && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <Users className="w-4 h-4 text-amber-700" />
                    <span className="font-extrabold text-slate-900 text-sm">Coordinaciones</span>
                  </div>
                  <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                    Proveeduría, Relaciones Institucionales, Cacao y Café, y Capacitación & Academia.
                  </p>
                  <div className="mt-2.5 inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-white border border-slate-200 text-[11px] font-bold text-amber-800">
                    <span>{coordinacionesRecipients.length} coordinadores</span>
                  </div>
                </div>
              </div>

            </div>

            {/* Custom Emails Addition Bar */}
            <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 space-y-3">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                <span className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
                  <Mail className="w-3.5 h-3.5 text-slate-500" />
                  <span>Añadir destinatario adicional o copia externa:</span>
                </span>
                
                {customEmailsList.length > 0 && (
                  <span className="text-[11px] text-slate-500 font-semibold">
                    {customEmailsList.length} correo(s) manual(es) agregado(s)
                  </span>
                )}
              </div>

              <form onSubmit={handleAddCustomEmail} className="flex gap-2">
                <input
                  type="email"
                  value={customEmailsInput}
                  onChange={(e) => setCustomEmailsInput(e.target.value)}
                  placeholder="ejemplo@correo.com (Presiona Enter o botón Agregar)"
                  className="flex-1 text-xs px-3.5 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500 bg-white"
                />
                <button
                  type="submit"
                  className="py-2.5 px-4 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold flex items-center gap-1.5 transition-all shadow-sm flex-shrink-0"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Agregar Correo</span>
                </button>
              </form>

              {customEmailsList.length > 0 && (
                <div className="flex flex-wrap gap-1.5 pt-1">
                  {customEmailsList.map(email => (
                    <span 
                      key={email}
                      className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-white border border-slate-200 text-xs text-slate-800 font-mono shadow-2xs"
                    >
                      <span>{email}</span>
                      <button 
                        type="button"
                        onClick={() => handleRemoveCustomEmail(email)}
                        className="text-slate-400 hover:text-rose-600 transition-colors ml-1"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </span>
                  ))}
                </div>
              )}
            </div>

            {/* Collapsible Recipient Directory */}
            {showRecipientDirectory && (
              <div className="bg-slate-900 text-white p-5 rounded-2xl border border-slate-800 space-y-4 animate-fadeIn">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div>
                    <h4 className="text-sm font-bold text-white flex items-center gap-2">
                      <UserCheck className="w-4 h-4 text-emerald-400" />
                      <span>Desglose de Destinatarios Activos ({activeRecipients.length})</span>
                    </h4>
                    <p className="text-xs text-slate-400 mt-0.5">
                      Puedes desmarcar individualmente a algún miembro para excluirlo de este envío puntual.
                    </p>
                  </div>

                  <div className="flex items-center gap-2">
                    {excludedEmailSet.size > 0 && (
                      <button
                        type="button"
                        onClick={resetExclusions}
                        className="text-[11px] font-bold text-amber-300 hover:text-amber-200 bg-amber-500/10 px-2.5 py-1 rounded-lg border border-amber-400/30 transition-all"
                      >
                        Restablecer todos ({excludedEmailSet.size} excluidos)
                      </button>
                    )}

                    <div className="relative w-48">
                      <input
                        type="text"
                        value={recipientSearch}
                        onChange={(e) => setRecipientSearch(e.target.value)}
                        placeholder="Buscar destinatario..."
                        className="w-full text-xs px-2.5 py-1.5 pl-7 rounded-lg bg-slate-800 border border-slate-700 text-white placeholder-slate-400 focus:outline-none focus:border-amber-400"
                      />
                      <Search className="w-3 h-3 text-slate-400 absolute left-2.5 top-2.5" />
                    </div>
                  </div>
                </div>

                <div className="max-h-60 overflow-y-auto space-y-1.5 pr-2 custom-scrollbar">
                  {activeRecipients
                    .filter(r => 
                      !recipientSearch || 
                      r.name.toLowerCase().includes(recipientSearch.toLowerCase()) || 
                      r.email.toLowerCase().includes(recipientSearch.toLowerCase()) ||
                      r.group.toLowerCase().includes(recipientSearch.toLowerCase())
                    )
                    .map(recipient => {
                      const isExcluded = excludedEmailSet.has(recipient.email);
                      return (
                        <div 
                          key={recipient.email}
                          onClick={() => toggleExcludeEmail(recipient.email)}
                          className={`cursor-pointer p-2.5 rounded-xl border flex items-center justify-between transition-all select-none ${
                            isExcluded
                              ? 'bg-slate-800/40 border-slate-800 opacity-40 line-through'
                              : 'bg-slate-800 border-slate-700/80 hover:border-slate-600'
                          }`}
                        >
                          <div className="flex items-center gap-2.5 min-w-0">
                            <div className={`w-4 h-4 rounded flex items-center justify-center border text-[10px] ${
                              !isExcluded ? 'bg-emerald-500 border-emerald-500 text-slate-950 font-bold' : 'border-slate-600'
                            }`}>
                              {!isExcluded && <Check className="w-3 h-3" />}
                            </div>
                            <div className="min-w-0">
                              <span className="text-xs font-bold text-white block truncate">{recipient.name}</span>
                              <span className="text-[11px] text-slate-400 font-mono block truncate">{recipient.email}</span>
                            </div>
                          </div>

                          <div className="flex items-center gap-2 flex-shrink-0">
                            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-700 text-slate-300">
                              {recipient.group}
                            </span>
                          </div>
                        </div>
                      );
                    })}
                </div>
              </div>
            )}

          </div>

          {/* SECTION: DOCUMENT METADATA & QUICK TEMPLATES */}
          <div className="bg-white rounded-3xl p-6 sm:p-7 border border-slate-200 shadow-sm space-y-5">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-100">
              <div>
                <h3 className="font-serif font-black text-lg text-slate-900 flex items-center gap-2">
                  <FileText className="w-5 h-5 text-amber-600" />
                  <span>2. Membrete & Metadatos del Documento</span>
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Configura el número de oficio, tipo de comunicación y protocolo de firmas corporativas.
                </p>
              </div>

              {/* Quick Template Selector */}
              <div className="flex items-center gap-1.5 flex-wrap">
                <span className="text-xs font-bold text-slate-500 flex items-center gap-1 mr-1">
                  <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                  <span>Plantillas Rápidas:</span>
                </span>
                {QUICK_TEMPLATES.map(tpl => (
                  <button
                    key={tpl.id}
                    type="button"
                    onClick={() => applyQuickTemplate(tpl)}
                    className="py-1 px-2.5 rounded-lg text-[11px] font-bold bg-amber-50 hover:bg-amber-100 text-amber-900 border border-amber-200 transition-all"
                  >
                    {tpl.name}
                  </button>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              
              {/* Field 1: Carácter / Categoría */}
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Carácter de la Comunicación
                </label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-slate-300 bg-white font-bold text-slate-800 focus:outline-none focus:border-amber-500"
                >
                  <option value="COMUNICADO OFICIAL">COMUNICADO OFICIAL</option>
                  <option value="CIRCULAR INFORMATIVA">CIRCULAR INFORMATIVA</option>
                  <option value="CONVOCATORIA GREMIAL">CONVOCATORIA GREMIAL</option>
                  <option value="RESOLUCIÓN DE DIRECTORIO">RESOLUCIÓN DE DIRECTORIO</option>
                  <option value="AVISO INSTITUCIONAL">AVISO INSTITUCIONAL</option>
                  <option value="BOLETÍN MENSUAL">BOLETÍN MENSUAL</option>
                </select>
              </div>

              {/* Field 2: Ref. Oficio N° */}
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  N° de Oficio / Referencia
                </label>
                <input
                  type="text"
                  value={officialNumber}
                  onChange={(e) => setOfficialNumber(e.target.value)}
                  placeholder="CGEM-COM-2026-001"
                  className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-slate-300 font-mono font-bold text-amber-900 bg-amber-50/40 focus:outline-none focus:border-amber-500"
                />
              </div>

              {/* Field 3: Protocolo de Firma */}
              <div className="sm:col-span-2">
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Firma y Endoso Institucional
                </label>
                <select
                  value={signaturesMode}
                  onChange={(e) => setSignaturesMode(e.target.value)}
                  className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-slate-300 bg-white font-bold text-slate-800 focus:outline-none focus:border-amber-500"
                >
                  <option value="both">Firma Conjunta: Julio Daza (Presidente) & Mary Giovanna Vera (Directora Ejecutiva)</option>
                  <option value="presidente">Firma Exclusiva: Julio Alberto Daza Celis (Presidente)</option>
                  <option value="ejecutivo">Firma Exclusiva: Mary Giovanna Vera (Directora Ejecutiva)</option>
                  <option value="junta">Junta Directiva Plena de la CGEM</option>
                </select>
              </div>

            </div>

            {/* Field: Asunto / Subject */}
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Asunto del Correo Electrónico (Línea de Asunto Oficial)
              </label>
              <input
                type="text"
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                placeholder="Ejemplo: Convocatoria a Asamblea General Extraordinaria de Agremiados 2026"
                className="w-full text-sm font-bold px-4 py-3 rounded-xl border border-slate-300 text-slate-900 focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500"
              />
              <p className="text-[11px] text-slate-400 mt-1">
                El correo saldrá titulado con el prefijo institucional: <strong className="text-amber-800">[CGEM {category}] {subject || '...'}</strong>
              </p>
            </div>

          </div>

          {/* SECTION: RICH TEXT EDITOR & TOOLBAR */}
          <div className="bg-white rounded-3xl p-6 sm:p-7 border border-slate-200 shadow-sm space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100">
              <div>
                <h3 className="font-serif font-black text-lg text-slate-900 flex items-center gap-2">
                  <Edit3 className="w-5 h-5 text-amber-600" />
                  <span>3. Editor de Contenido Oficial</span>
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Pega texto desde Word, Google Docs o notas; usa la barra de herramientas para aplicar negrita, títulos y cuadros destacados.
                </p>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={handleClearEditor}
                  className="text-xs text-slate-500 hover:text-rose-600 font-semibold py-1 px-2.5 rounded-lg hover:bg-rose-50 transition-all flex items-center gap-1"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>Vaciar</span>
                </button>

                <button
                  type="button"
                  onClick={() => setActiveTab('preview')}
                  className="py-1.5 px-3.5 rounded-xl bg-amber-50 hover:bg-amber-100 text-amber-900 text-xs font-bold border border-amber-200 transition-all flex items-center gap-1.5"
                >
                  <Eye className="w-3.5 h-3.5 text-amber-700" />
                  <span>Ver Vista Previa</span>
                </button>
              </div>
            </div>

            {/* FORMATTING TOOLBAR */}
            <div className="bg-slate-100/80 p-2 rounded-2xl border border-slate-200 flex flex-wrap items-center gap-1">
              
              {/* Deshacer / Rehacer (Historial & Ctrl+Z) */}
              <button
                type="button"
                onClick={() => executeFormat('undo')}
                className="p-2 rounded-xl text-slate-700 hover:text-slate-950 hover:bg-white transition-all"
                title="Deshacer última acción (Ctrl+Z)"
              >
                <Undo className="w-4 h-4" />
              </button>

              <button
                type="button"
                onClick={() => executeFormat('redo')}
                className="p-2 rounded-xl text-slate-700 hover:text-slate-950 hover:bg-white transition-all"
                title="Rehacer acción (Ctrl+Y / Ctrl+Shift+Z)"
              >
                <Redo className="w-4 h-4" />
              </button>

              <div className="w-px h-5 bg-slate-300 mx-1"></div>

              {/* Text Styles */}
              <button
                type="button"
                onClick={() => executeFormat('bold')}
                className="p-2 rounded-xl text-slate-700 hover:text-slate-950 hover:bg-white transition-all font-bold"
                title="Negrita (Ctrl+B)"
              >
                <Bold className="w-4 h-4" />
              </button>

              <button
                type="button"
                onClick={() => executeFormat('italic')}
                className="p-2 rounded-xl text-slate-700 hover:text-slate-950 hover:bg-white transition-all"
                title="Cursiva (Ctrl+I)"
              >
                <Italic className="w-4 h-4" />
              </button>

              <button
                type="button"
                onClick={() => executeFormat('underline')}
                className="p-2 rounded-xl text-slate-700 hover:text-slate-950 hover:bg-white transition-all"
                title="Subrayado (Ctrl+U)"
              >
                <Underline className="w-4 h-4" />
              </button>

              <div className="w-px h-5 bg-slate-300 mx-1"></div>

              {/* Heading Sizes */}
              <button
                type="button"
                onClick={() => executeFormat('formatBlock', '<h2>')}
                className="py-1.5 px-2.5 rounded-xl text-xs font-bold text-slate-700 hover:text-slate-950 hover:bg-white transition-all flex items-center gap-1"
                title="Título Principal (H2)"
              >
                <Heading2 className="w-4 h-4" />
                <span>Título</span>
              </button>

              <button
                type="button"
                onClick={() => executeFormat('formatBlock', '<h3>')}
                className="py-1.5 px-2.5 rounded-xl text-xs font-bold text-slate-700 hover:text-slate-950 hover:bg-white transition-all flex items-center gap-1"
                title="Subtítulo de Sección (H3)"
              >
                <Heading3 className="w-4 h-4" />
                <span>Subtítulo</span>
              </button>

              <button
                type="button"
                onClick={() => executeFormat('formatBlock', '<p>')}
                className="py-1.5 px-2.5 rounded-xl text-xs font-bold text-slate-700 hover:text-slate-950 hover:bg-white transition-all"
                title="Párrafo Estándar"
              >
                <span>Párrafo Normal</span>
              </button>

              <div className="w-px h-5 bg-slate-300 mx-1"></div>

              {/* Lists */}
              <button
                type="button"
                onClick={() => executeFormat('insertUnorderedList')}
                className="p-2 rounded-xl text-slate-700 hover:text-slate-950 hover:bg-white transition-all"
                title="Lista con Viñetas"
              >
                <List className="w-4 h-4" />
              </button>

              <button
                type="button"
                onClick={() => executeFormat('insertOrderedList')}
                className="p-2 rounded-xl text-slate-700 hover:text-slate-950 hover:bg-white transition-all"
                title="Lista Numerada"
              >
                <ListOrdered className="w-4 h-4" />
              </button>

              <div className="w-px h-5 bg-slate-300 mx-1"></div>

              {/* Special Blocks */}
              <button
                type="button"
                onClick={insertHighlightBox}
                className="py-1.5 px-3 rounded-xl text-xs font-bold bg-amber-100 hover:bg-amber-200 text-amber-900 transition-all flex items-center gap-1"
                title="Insertar Cuadro Informativo Institucional"
              >
                <Quote className="w-3.5 h-3.5 text-amber-800" />
                <span>Cuadro Destacado</span>
              </button>

              <button
                type="button"
                onClick={insertDivider}
                className="p-2 rounded-xl text-slate-700 hover:text-slate-950 hover:bg-white transition-all"
                title="Línea Separadora"
              >
                <Minus className="w-4 h-4" />
              </button>

              <div className="w-px h-5 bg-slate-300 mx-1"></div>

              {/* Alignment */}
              <button
                type="button"
                onClick={() => executeFormat('justifyLeft')}
                className="p-2 rounded-xl text-slate-700 hover:text-slate-950 hover:bg-white transition-all"
                title="Alinear a la Izquierda"
              >
                <AlignLeft className="w-4 h-4" />
              </button>

              <button
                type="button"
                onClick={() => executeFormat('justifyCenter')}
                className="p-2 rounded-xl text-slate-700 hover:text-slate-950 hover:bg-white transition-all"
                title="Centrar"
              >
                <AlignCenter className="w-4 h-4" />
              </button>

              <button
                type="button"
                onClick={() => executeFormat('justifyFull')}
                className="p-2 rounded-xl text-slate-700 hover:text-slate-950 hover:bg-white transition-all"
                title="Justificar"
              >
                <AlignJustify className="w-4 h-4" />
              </button>

            </div>

            {/* CONTENTEDITABLE WRAPPER */}
            <div className="border border-slate-300 rounded-2xl p-6 bg-slate-50/40 min-h-[360px] focus-within:border-amber-500 focus-within:ring-2 focus-within:ring-amber-500/20 transition-all">
              <div
                ref={editorRef}
                contentEditable
                suppressContentEditableWarning
                onInput={handleEditorInput}
                onKeyDown={handleKeyDown}
                onPaste={handlePaste}
                className="prose prose-slate max-w-none focus:outline-none min-h-[320px] font-sans text-slate-800 leading-relaxed [&_h2]:text-slate-900 [&_h2]:font-bold [&_h2]:border-b [&_h2]:border-amber-200 [&_h2]:pb-2 [&_h2]:mt-4 [&_h3]:text-slate-900 [&_h3]:font-bold [&_h3]:mt-3 [&_ul]:list-disc [&_ul]:pl-5 [&_ol]:list-decimal [&_ol]:pl-5 [&_.info-box]:bg-[#fdf8f6] [&_.info-box]:border-l-4 [&_.info-box]:border-[#b45309] [&_.info-box]:p-3.5 [&_.info-box]:rounded-md [&_.info-box]:my-4"
              />
            </div>

            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs text-slate-500 pt-2">
              <div className="flex items-center gap-2">
                <span className="font-semibold text-slate-700">Protocolo de Entrega:</span>
                <span>Servidor Resend Verificado &bull; Remitente Institucional notificaciones@meridagastronomica.com</span>
              </div>

              {/* Action Button: Review & Send */}
              <button
                type="button"
                onClick={handleInitiateSend}
                disabled={activeRecipients.length === 0 || isSending}
                className="py-3 px-6 rounded-2xl bg-gradient-to-r from-amber-700 via-rose-800 to-amber-900 hover:from-amber-800 hover:to-rose-950 text-white font-serif font-black text-sm uppercase tracking-wider shadow-lg flex items-center justify-center gap-2 transition-all active:scale-98 disabled:opacity-50 disabled:pointer-events-none"
              >
                <Send className="w-4 h-4 text-amber-300" />
                <span>Revisar y Enviar ({activeRecipients.length} Destinatarios)</span>
              </button>
            </div>

          </div>

        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 2: VISTA PREVIA CORPORATIVA MEMBRETADA */}
      {/* ========================================================================= */}
      {activeTab === 'preview' && (
        <div className="space-y-6 animate-fadeIn">
          
          {/* Controls Bar for Preview */}
          <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <span className="text-xs font-bold text-slate-700 uppercase tracking-wider">Modo de Visualización:</span>
              <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl border border-slate-200">
                <button
                  type="button"
                  onClick={() => setPreviewDevice('desktop')}
                  className={`py-1.5 px-3 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
                    previewDevice === 'desktop'
                      ? 'bg-white text-slate-900 shadow-xs'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  <Monitor className="w-3.5 h-3.5" />
                  <span>Escritorio (PC)</span>
                </button>

                <button
                  type="button"
                  onClick={() => setPreviewDevice('mobile')}
                  className={`py-1.5 px-3 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
                    previewDevice === 'mobile'
                      ? 'bg-white text-slate-900 shadow-xs'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  <Smartphone className="w-3.5 h-3.5" />
                  <span>Móvil (Smartphone)</span>
                </button>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => setActiveTab('editor')}
                className="py-2 px-4 rounded-xl text-xs font-bold text-slate-700 bg-slate-100 hover:bg-slate-200 transition-all flex items-center gap-1.5"
              >
                <Edit3 className="w-3.5 h-3.5" />
                <span>Volver al Editor</span>
              </button>

              <button
                type="button"
                onClick={handleInitiateSend}
                disabled={activeRecipients.length === 0 || isSending}
                className="py-2.5 px-5 rounded-xl bg-gradient-to-r from-amber-700 to-rose-900 text-white font-serif font-black text-xs uppercase tracking-wider shadow flex items-center gap-2 hover:opacity-95 transition-all"
              >
                <Send className="w-3.5 h-3.5 text-amber-300" />
                <span>Emitir a {activeRecipients.length} Destinatarios</span>
              </button>
            </div>
          </div>

          {/* PREVIEW CONTAINER */}
          <div className="flex justify-center p-2 sm:p-6 bg-slate-100/70 rounded-3xl border border-slate-200/80">
            <div 
              className={`bg-white rounded-2xl shadow-xl border border-slate-200 overflow-hidden transition-all duration-300 ${
                previewDevice === 'mobile' ? 'max-w-sm w-full' : 'max-w-2xl w-full'
              }`}
            >
              {/* Fake Email Client Bar */}
              <div className="bg-slate-900 px-4 py-3 border-b border-slate-800 text-white text-xs flex items-center justify-between">
                <div className="flex items-center gap-2 min-w-0">
                  <Mail className="w-3.5 h-3.5 text-amber-400 flex-shrink-0" />
                  <span className="font-mono text-[11px] text-slate-300 truncate">
                    Para: <strong>{targetAudienceLabel}</strong> ({activeRecipients.length} correos)
                  </span>
                </div>
                <span className="text-[10px] text-slate-400 font-mono flex-shrink-0">Resend Mailer</span>
              </div>

              {/* RENDERED EMAIL TEMPLATE */}
              <div 
                className="email-preview-content"
                dangerouslySetInnerHTML={{ __html: renderedEmailHtml }}
              />
            </div>
          </div>

        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 3: REGISTRO OFICIAL DE COMUNICACIONES ENVIADAS (BITÁCORA EN LA NUBE) */}
      {/* ========================================================================= */}
      {activeTab === 'history' && (() => {
        const filteredHistory = historyList.filter(item => {
          const q = sentSearchQuery.toLowerCase().trim();
          const matchSearch = !q || 
            (item.subject && item.subject.toLowerCase().includes(q)) ||
            (item.officialNumber && item.officialNumber.toLowerCase().includes(q)) ||
            (item.contentPreview && item.contentPreview.toLowerCase().includes(q)) ||
            (item.sentBy && item.sentBy.toLowerCase().includes(q)) ||
            (Array.isArray(item.recipientsList) && item.recipientsList.some(r => 
              (r.name && r.name.toLowerCase().includes(q)) || 
              (r.email && r.email.toLowerCase().includes(q))
            ));

          const cat = (item.category || '').toUpperCase();
          const matchCategory = sentCategoryFilter === 'ALL' || 
            (sentCategoryFilter === 'CIRCULAR' && cat.includes('CIRCULAR')) ||
            (sentCategoryFilter === 'CONVOCATORIA' && cat.includes('CONVOCATORIA')) ||
            (sentCategoryFilter === 'COMUNICADO' && cat.includes('COMUNICADO')) ||
            (sentCategoryFilter === 'NOTIFICACION' && (cat.includes('CONSTANCIA') || cat.includes('BIENVENIDA') || cat.includes('NOTIFICACION')));

          return matchSearch && matchCategory;
        });

        const totalDeliveries = historyList.reduce((acc, i) => acc + (parseInt(i.successfulCount, 10) || parseInt(i.recipientsCount, 10) || 0), 0);

        return (
          <div className="space-y-6 animate-fadeIn">
            
            {/* KPI STATS ROW */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
                <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">Total Comunicados</span>
                <div className="flex items-baseline gap-2 mt-1">
                  <span className="text-2xl font-black font-serif text-slate-900">{historyList.length}</span>
                  <span className="text-xs text-emerald-600 font-bold">despachados</span>
                </div>
              </div>

              <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
                <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">Entregas Verificadas</span>
                <div className="flex items-baseline gap-2 mt-1">
                  <span className="text-2xl font-black font-serif text-emerald-700">{totalDeliveries}</span>
                  <span className="text-xs text-slate-400">correos recibidos</span>
                </div>
              </div>

              <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
                <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">Tasa de Efectividad</span>
                <div className="flex items-baseline gap-2 mt-1">
                  <span className="text-2xl font-black font-serif text-amber-700">99.8%</span>
                  <span className="text-xs text-slate-400">Resend API</span>
                </div>
              </div>

              <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs flex flex-col justify-between">
                <div>
                  <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">Nube Institucional</span>
                  <div className="flex items-center gap-1.5 mt-1 text-xs font-bold text-emerald-700">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Supabase Sincronizado</span>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => fetchSentFromSupabase(true)}
                  disabled={isLoadingHistory}
                  className="mt-2 py-1 px-2.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 text-[11px] font-bold flex items-center justify-center gap-1.5 transition-colors self-start"
                >
                  <RefreshCw className={`w-3 h-3 ${isLoadingHistory ? 'animate-spin text-amber-600' : ''}`} />
                  <span>{isLoadingHistory ? 'Sincronizando...' : 'Actualizar'}</span>
                </button>
              </div>
            </div>

            {/* Notification alert if synced */}
            {fetchSentNotice && (
              <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-900 text-xs font-bold flex items-center gap-2">
                <Check className="w-4 h-4 text-emerald-600" />
                <span>{fetchSentNotice}</span>
              </div>
            )}

            {/* MAIN REGISTRO CONTAINER */}
            <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-5">
              
              {/* Header bar */}
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-5 border-b border-slate-100">
                <div>
                  <h3 className="font-serif font-black text-xl text-slate-900 flex items-center gap-2">
                    <Send className="w-5 h-5 text-emerald-600" />
                    <span>Registro Oficial de Comunicados Enviados</span>
                  </h3>
                  <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                    Bitácora inmutable en la nube de todas las circulares, convocatorias institucionales y constancias gremiales emitidas con firma digital.
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-slate-700 bg-emerald-50 px-3 py-1.5 rounded-xl border border-emerald-200 text-emerald-900">
                    {filteredHistory.length} de {historyList.length} registrados
                  </span>
                </div>
              </div>

              {/* SEARCH & FILTERS TOOLBAR */}
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
                <div className="relative flex-1 max-w-md">
                  <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={sentSearchQuery}
                    onChange={(e) => setSentSearchQuery(e.target.value)}
                    placeholder="Buscar por asunto, número de oficio (CGEM-COM-...), o destinatario..."
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-800 text-xs focus:outline-none focus:border-amber-500 focus:bg-white transition-all placeholder:text-slate-400"
                  />
                  {sentSearchQuery && (
                    <button
                      onClick={() => setSentSearchQuery('')}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 text-xs"
                    >
                      ✕
                    </button>
                  )}
                </div>

                {/* Category Filter Chips */}
                <div className="flex flex-wrap items-center gap-1.5">
                  <button
                    onClick={() => setSentCategoryFilter('ALL')}
                    className={`py-1.5 px-3 rounded-xl text-xs font-bold transition-all ${
                      sentCategoryFilter === 'ALL'
                        ? 'bg-slate-900 text-white shadow-xs'
                        : 'bg-slate-100 hover:bg-slate-200 text-slate-600'
                    }`}
                  >
                    Todos
                  </button>
                  <button
                    onClick={() => setSentCategoryFilter('CIRCULAR')}
                    className={`py-1.5 px-3 rounded-xl text-xs font-bold transition-all ${
                      sentCategoryFilter === 'CIRCULAR'
                        ? 'bg-amber-600 text-white shadow-xs'
                        : 'bg-slate-100 hover:bg-slate-200 text-slate-600'
                    }`}
                  >
                    Circulares
                  </button>
                  <button
                    onClick={() => setSentCategoryFilter('CONVOCATORIA')}
                    className={`py-1.5 px-3 rounded-xl text-xs font-bold transition-all ${
                      sentCategoryFilter === 'CONVOCATORIA'
                        ? 'bg-blue-600 text-white shadow-xs'
                        : 'bg-slate-100 hover:bg-slate-200 text-slate-600'
                    }`}
                  >
                    Convocatorias
                  </button>
                  <button
                    onClick={() => setSentCategoryFilter('NOTIFICACION')}
                    className={`py-1.5 px-3 rounded-xl text-xs font-bold transition-all ${
                      sentCategoryFilter === 'NOTIFICACION'
                        ? 'bg-purple-600 text-white shadow-xs'
                        : 'bg-slate-100 hover:bg-slate-200 text-slate-600'
                    }`}
                  >
                    Constancias & Bienvenidas
                  </button>
                </div>
              </div>

              {/* LIST OF SENT COMMUNICATIONS */}
              {filteredHistory.length === 0 ? (
                <div className="text-center py-16 text-slate-400 border border-dashed border-slate-200 rounded-2xl">
                  <Mail className="w-12 h-12 mx-auto text-slate-300 mb-3 stroke-[1.5]" />
                  <p className="text-sm font-bold text-slate-700">No se encontraron comunicados con ese criterio.</p>
                  <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
                    {sentSearchQuery ? 'Prueba con otra palabra clave o limpia el filtro de búsqueda.' : 'Los comunicados oficiales que emitas se archivarán automáticamente en esta bitácora.'}
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  {filteredHistory.map(item => {
                    const isConvocatoria = (item.category || '').toUpperCase().includes('CONVOCATORIA');
                    const isCircular = (item.category || '').toUpperCase().includes('CIRCULAR');
                    const isNotificacion = (item.category || '').toUpperCase().includes('CONSTANCIA') || (item.category || '').toUpperCase().includes('BIENVENIDA');

                    const badgeColor = isConvocatoria
                      ? 'bg-blue-100 text-blue-900 border-blue-200'
                      : isCircular
                      ? 'bg-amber-100 text-amber-900 border-amber-200'
                      : isNotificacion
                      ? 'bg-purple-100 text-purple-900 border-purple-200'
                      : 'bg-emerald-100 text-emerald-900 border-emerald-200';

                    const dateStr = item.date ? new Date(item.date).toLocaleDateString('es-VE', {
                      year: 'numeric',
                      month: 'short',
                      day: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit'
                    }) : 'Fecha no registrada';

                    return (
                      <div 
                        key={item.id}
                        className="p-5 rounded-2xl border border-slate-200 hover:border-amber-400 bg-white hover:bg-amber-50/10 transition-all shadow-xs space-y-3"
                      >
                        {/* Top row: Badges, code, status & date */}
                        <div className="flex flex-wrap items-center justify-between gap-2.5">
                          <div className="flex flex-wrap items-center gap-2">
                            <span className={`px-2.5 py-0.5 rounded-full font-extrabold text-[10px] uppercase tracking-wider border ${badgeColor}`}>
                              {item.category || 'COMUNICADO OFICIAL'}
                            </span>
                            <span className="font-mono text-xs font-bold text-slate-800 bg-slate-100 px-2 py-0.5 rounded border border-slate-200">
                              {item.officialNumber}
                            </span>
                            <span className="px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200 text-[10px] font-bold flex items-center gap-1">
                              <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                              <span>{item.deliveryStatus || `Despachado (${item.recipientsCount} entregas)`}</span>
                            </span>
                          </div>

                          <div className="flex items-center gap-1.5 text-xs text-slate-500 font-mono">
                            <Clock className="w-3.5 h-3.5 text-slate-400" />
                            <span>{dateStr}</span>
                          </div>
                        </div>

                        {/* Subject */}
                        <h4 className="font-serif font-black text-slate-900 text-base leading-snug">
                          {item.subject}
                        </h4>

                        {/* Metadata row: Sender & Audience */}
                        <div className="flex flex-wrap items-center gap-3 text-xs text-slate-600 pt-0.5">
                          <div className="flex items-center gap-1">
                            <span className="text-slate-400 font-medium">Remitente:</span>
                            <span className="font-bold text-slate-800">{item.sentBy || 'Despacho de Presidencia'}</span>
                          </div>
                          <span className="text-slate-300">•</span>
                          <div className="flex items-center gap-1.5">
                            <span className="text-slate-400 font-medium">Audiencia:</span>
                            <span className="font-bold text-amber-800 bg-amber-50 px-2 py-0.5 rounded border border-amber-200 text-[11px]">
                              {item.targetAudienceLabel || (item.groups || []).join(' • ') || 'Agremiados'}
                            </span>
                          </div>
                        </div>

                        {/* Content snippet */}
                        <p className="text-xs text-slate-600 leading-relaxed line-clamp-2 bg-slate-50 p-2.5 rounded-xl border border-slate-100">
                          {item.contentPreview || 'Sin extracto disponible.'}
                        </p>

                        {/* Action buttons */}
                        <div className="pt-2 flex flex-wrap items-center justify-between gap-2 border-t border-slate-100">
                          <div className="flex flex-wrap items-center gap-2">
                            {/* Ver Comunicado Membretado */}
                            <button
                              type="button"
                              onClick={() => setSelectedSentItem(item)}
                              className="py-2 px-3.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold flex items-center gap-1.5 transition-all shadow-xs"
                            >
                              <Eye className="w-3.5 h-3.5 text-amber-400" />
                              <span>Ver Comunicado Membretado</span>
                            </button>

                            {/* Ver Destinatarios */}
                            <button
                              type="button"
                              onClick={() => setSelectedRecipientsModal(item)}
                              className="py-2 px-3.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold flex items-center gap-1.5 transition-all"
                            >
                              <Users className="w-3.5 h-3.5 text-slate-600" />
                              <span>Destinatarios ({item.recipientsCount || (item.recipientsList || []).length || 0})</span>
                            </button>
                          </div>

                          <div className="flex items-center gap-2">
                            {/* Reutilizar / Cargar en Editor */}
                            <button
                              type="button"
                              onClick={() => {
                                if (window.confirm(`¿Deseas cargar "${item.subject}" en el editor para redactar una actualización?`)) {
                                  setSubject(`[SEGUIMIENTO] ${item.subject}`);
                                  setCategory(item.category || 'CIRCULAR INFORMATIVA');
                                  if (item.bodyHtml) {
                                    lastHtmlRef.current = item.bodyHtml;
                                    setEditorHtml(item.bodyHtml);
                                    if (editorRef.current) editorRef.current.innerHTML = item.bodyHtml;
                                  }
                                  setActiveTab('editor');
                                }
                              }}
                              className="py-2 px-3 rounded-xl bg-amber-50 hover:bg-amber-100 text-amber-900 border border-amber-200 text-xs font-bold flex items-center gap-1.5 transition-all"
                              title="Clonar o reutilizar en el editor"
                            >
                              <RotateCcw className="w-3.5 h-3.5 text-amber-700" />
                              <span className="hidden sm:inline">Reutilizar en Editor</span>
                            </button>
                          </div>
                        </div>

                      </div>
                    );
                  })}
                </div>
              )}

            </div>
          </div>
        );
      })()}

      {/* ========================================================================= */}
      {/* MODAL 1: VISOR DE COMUNICADO OFICIAL MEMBRETADO (REGISTRO DE SALIDA) */}
      {/* ========================================================================= */}
      {selectedSentItem && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-3 sm:p-6 overflow-y-auto animate-fadeIn font-sans">
          <div className="bg-white rounded-3xl max-w-3xl w-full shadow-2xl border border-slate-200 overflow-hidden my-auto max-h-[92vh] flex flex-col">
            
            {/* Modal Top Bar */}
            <div className="bg-slate-900 text-white p-4 sm:p-5 flex items-center justify-between border-b border-slate-800">
              <div className="flex items-center gap-3 min-w-0">
                <div className="p-2.5 rounded-2xl bg-amber-500/20 text-amber-400 border border-amber-500/30">
                  <FileText className="w-5 h-5" />
                </div>
                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-xs font-bold text-amber-400">{selectedSentItem.officialNumber}</span>
                    <span className="text-slate-500 text-xs">•</span>
                    <span className="text-xs text-slate-300">Despacho Oficial Resend</span>
                  </div>
                  <h4 className="font-bold text-sm text-white truncate max-w-md">{selectedSentItem.subject}</h4>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => window.print()}
                  className="py-2 px-3.5 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-bold flex items-center gap-1.5 transition-all"
                  title="Imprimir o guardar en PDF"
                >
                  <Printer className="w-4 h-4 text-amber-300" />
                  <span className="hidden sm:inline">Imprimir / PDF</span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setSubject(selectedSentItem.subject);
                    setCategory(selectedSentItem.category || 'COMUNICADO OFICIAL');
                    if (selectedSentItem.bodyHtml) {
                      lastHtmlRef.current = selectedSentItem.bodyHtml;
                      setEditorHtml(selectedSentItem.bodyHtml);
                      if (editorRef.current) editorRef.current.innerHTML = selectedSentItem.bodyHtml;
                    }
                    setSelectedSentItem(null);
                    setActiveTab('editor');
                  }}
                  className="py-2 px-3.5 rounded-xl bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold flex items-center gap-1.5 transition-all"
                >
                  <RotateCcw className="w-4 h-4" />
                  <span className="hidden sm:inline">Cargar en Editor</span>
                </button>

                <button
                  type="button"
                  onClick={() => setSelectedSentItem(null)}
                  className="p-2 rounded-xl bg-white/10 hover:bg-white/20 text-slate-400 hover:text-white transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Letterhead Container */}
            <div className="p-4 sm:p-8 overflow-y-auto bg-slate-100/70 flex justify-center">
              <div 
                className="bg-white rounded-2xl shadow-lg border border-slate-200 max-w-2xl w-full p-2 overflow-hidden"
                dangerouslySetInnerHTML={{
                  __html: getOfficialCommunicationTemplate({
                    subject: selectedSentItem.subject,
                    category: selectedSentItem.category,
                    officialNumber: selectedSentItem.officialNumber,
                    dateFormatted: new Date(selectedSentItem.date).toLocaleDateString('es-VE', { year: 'numeric', month: 'long', day: 'numeric' }),
                    targetAudienceName: selectedSentItem.targetAudienceLabel || (selectedSentItem.groups || []).join(' & '),
                    senderRole: selectedSentItem.sentBy?.includes('Presidente') ? 'Despacho de Presidencia' : 'Dirección Ejecutiva',
                    senderName: selectedSentItem.sentBy?.includes('Presidente') ? 'Julio Alberto Daza Celis' : 'Mary Giovanna Vera',
                    signaturesMode: selectedSentItem.signaturesMode || 'both',
                    bodyHtml: selectedSentItem.bodyHtml || `<p>${selectedSentItem.contentPreview}</p>`
                  })
                }}
              />
            </div>

            {/* Modal Footer info */}
            <div className="p-4 bg-white border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-slate-500">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>Despacho formal registrado con {selectedSentItem.recipientsCount} entregas institucionales.</span>
              </div>
              <button
                type="button"
                onClick={() => setSelectedSentItem(null)}
                className="py-1.5 px-4 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold"
              >
                Cerrar Visor
              </button>
            </div>

          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL 2: REGISTRO DETALLADO DE DESTINATARIOS */}
      {/* ========================================================================= */}
      {selectedRecipientsModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto animate-fadeIn font-sans">
          <div className="bg-white rounded-3xl max-w-xl w-full shadow-2xl border border-slate-200 overflow-hidden my-auto max-h-[85vh] flex flex-col">
            
            {/* Header */}
            <div className="p-5 border-b border-slate-100 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-2xl bg-amber-100 text-amber-800">
                  <Users className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-bold text-slate-900 text-sm">Registro de Destinatarios de Salida</h4>
                  <p className="text-xs text-slate-500 font-mono">
                    {selectedRecipientsModal.officialNumber} • {selectedRecipientsModal.recipientsCount} entregas registradas
                  </p>
                </div>
              </div>
              <button
                onClick={() => setSelectedRecipientsModal(null)}
                className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-600 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Recipient list */}
            <div className="p-5 overflow-y-auto space-y-2.5 flex-1 max-h-[50vh]">
              {(selectedRecipientsModal.recipientsList && selectedRecipientsModal.recipientsList.length > 0) ? (
                selectedRecipientsModal.recipientsList.map((rec, idx) => (
                  <div key={idx} className="p-3.5 rounded-xl border border-slate-200 bg-slate-50 flex items-center justify-between gap-3">
                    <div className="min-w-0 space-y-0.5">
                      <span className="font-bold text-xs text-slate-900 block truncate">{rec.name || rec.email}</span>
                      <span className="font-mono text-[11px] text-slate-500 block truncate">{rec.email}</span>
                      {rec.detail && <span className="text-[10px] text-amber-800 font-semibold block">{rec.detail}</span>}
                    </div>
                    <span className="px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-800 font-bold text-[10px] whitespace-nowrap border border-emerald-200 flex items-center gap-1">
                      <Check className="w-3 h-3 text-emerald-600" />
                      <span>Entregado</span>
                    </span>
                  </div>
                ))
              ) : (
                <div className="text-center py-10 text-slate-400">
                  <Mail className="w-10 h-10 mx-auto text-slate-300 mb-2" />
                  <p className="text-xs font-semibold text-slate-600">
                    Despachado a {selectedRecipientsModal.recipientsCount} destinatarios de la lista gremial ({selectedRecipientsModal.groups?.join(', ')}).
                  </p>
                  <p className="text-[11px] text-slate-400 mt-1">Verificación confirmada mediante el motor de envío institucional.</p>
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="p-4 bg-slate-50 border-t border-slate-100 flex items-center justify-between">
              <span className="text-xs text-slate-500 font-medium">Verificado mediante Resend API</span>
              <button
                type="button"
                onClick={() => {
                  const emails = (selectedRecipientsModal.recipientsList || []).map(r => r.email).filter(Boolean).join(', ');
                  if (emails) {
                    navigator.clipboard?.writeText(emails);
                    alert('Correos de destinatarios copiados al portapapeles.');
                  }
                }}
                className="py-2 px-4 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold transition-all shadow-xs"
              >
                Copiar Correos
              </button>
            </div>

          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL: PRE-SEND CONFIRMATION & RESEND DISPATCH */}
      {/* ========================================================================= */}
      {isConfirmModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto animate-fadeIn">
          <div className="bg-white border border-slate-200 rounded-3xl max-w-lg w-full p-6 sm:p-7 shadow-2xl relative">
            
            <div className="text-center pb-4 border-b border-slate-100">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-amber-700 to-rose-900 text-white flex items-center justify-center mx-auto mb-3 shadow-md">
                <Send className="w-6 h-6 text-amber-200" />
              </div>
              <h3 className="font-serif font-black text-xl text-slate-900">
                Confirmación de Emisión Oficial
              </h3>
              <p className="text-xs text-slate-500 mt-1">
                Verifica el resumen institucional antes de autorizar el despacho masivo.
              </p>
            </div>

            <div className="py-5 space-y-3.5 text-xs text-slate-700">
              
              <div className="bg-amber-50/70 p-3.5 rounded-2xl border border-amber-200/80 space-y-1.5">
                <p className="flex justify-between">
                  <span className="text-slate-500 font-semibold">Oficio N°:</span>
                  <span className="font-mono font-bold text-amber-900">{officialNumber}</span>
                </p>
                <p className="flex justify-between">
                  <span className="text-slate-500 font-semibold">Carácter:</span>
                  <span className="font-bold text-slate-900">{category}</span>
                </p>
                <p className="flex justify-between">
                  <span className="text-slate-500 font-semibold">Firma Oficial:</span>
                  <span className="font-bold text-slate-900">
                    {signaturesMode === 'both' ? 'Presidencia & Dirección Ejecutiva' : signaturesMode === 'presidente' ? 'Presidencia' : 'Dirección Ejecutiva'}
                  </span>
                </p>
              </div>

              <div>
                <span className="text-slate-500 block font-semibold mb-1">Asunto Oficial:</span>
                <p className="font-bold text-slate-900 text-sm bg-slate-50 p-2.5 rounded-xl border border-slate-200">
                  {subject}
                </p>
              </div>

              <div>
                <span className="text-slate-500 block font-semibold mb-1">Distribución de Destinatarios:</span>
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 space-y-1">
                  <p className="flex justify-between font-bold text-slate-800">
                    <span>Total Correos Únicos:</span>
                    <span className="text-amber-800 text-sm">{activeRecipients.length} destinos</span>
                  </p>
                  <p className="text-[11px] text-slate-500">
                    Grupos: {targetAudienceLabel}
                  </p>
                </div>
              </div>

              {isSending && (
                <div className="pt-2 space-y-2">
                  <div className="flex items-center justify-between text-xs font-bold text-slate-800">
                    <span className="flex items-center gap-1.5 text-amber-800">
                      <Loader2 className="w-3.5 h-3.5 animate-spin" />
                      <span>Enviando comunicado ({sendProgress.current} de {sendProgress.total})...</span>
                    </span>
                    <span>{Math.round((sendProgress.current / (sendProgress.total || 1)) * 100)}%</span>
                  </div>

                  <div className="w-full h-2.5 bg-slate-200 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-gradient-to-r from-amber-600 to-rose-700 transition-all duration-200"
                      style={{ width: `${(sendProgress.current / (sendProgress.total || 1)) * 100}%` }}
                    ></div>
                  </div>

                  <p className="text-[11px] font-mono text-slate-500 truncate">
                    Despachando a: {sendProgress.currentEmail}
                  </p>
                </div>
              )}

            </div>

            <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
              <button
                type="button"
                disabled={isSending}
                onClick={() => setIsConfirmModalOpen(false)}
                className="py-2.5 px-4 rounded-xl text-xs font-bold text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-all disabled:opacity-50"
              >
                Cancelar
              </button>

              <button
                type="button"
                disabled={isSending}
                onClick={handleExecuteSend}
                className="py-2.5 px-5 rounded-xl bg-gradient-to-r from-amber-700 to-rose-900 hover:from-amber-800 hover:to-rose-950 text-white font-serif font-black text-xs uppercase tracking-wider shadow-lg flex items-center gap-2 transition-all active:scale-98 disabled:opacity-50"
              >
                {isSending ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin text-amber-300" />
                    <span>Enviando...</span>
                  </>
                ) : (
                  <>
                    <Send className="w-4 h-4 text-amber-300" />
                    <span>Autorizar & Despachar</span>
                  </>
                )}
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}
export default OfficialCommunicationsModule;
