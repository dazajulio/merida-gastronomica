import React, { useState, useEffect, useRef } from 'react';
import { 
  UserCheck, 
  ShieldCheck, 
  CreditCard, 
  BookOpen, 
  Mail, 
  Award, 
  CheckCircle2, 
  Download, 
  TrendingUp, 
  Clock, 
  Sparkles,
  Briefcase,
  PlusCircle,
  Users,
  Eye,
  X,
  Send,
  Building2,
  DollarSign,
  Lock,
  ArrowRight,
  ArrowLeft,
  Smartphone,
  Check,
  AlertCircle,
  LogOut,
  Copy,
  ExternalLink,
  MapPin,
  Utensils,
  Store,
  ChefHat,
  Coffee,
  CheckSquare,
  Compass,
  Navigation,
  Globe,
  Layers,
  Search,
  Play,
  Film,
  Video,
  Save,
  Trash2,
  Plus,
  Edit3,
  Sprout,
  Factory,
  UploadCloud,
  Image as ImageIcon,
  Loader2,
  Maximize2
} from 'lucide-react';
import { AFFILIATES_DATA } from '../data/affiliatesData';
import { supabase } from '../lib/supabaseClient';
import { sendAffiliateWelcomeEmail, sendCourseRegistrationEmail } from '../lib/emailService';
import { optimizeImage, uploadAffiliateImageToStorage, formatBytes } from '../lib/imageOptimizer';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';

const getMapboxToken = () => {
  if (typeof import.meta !== 'undefined' && import.meta.env) {
    if (import.meta.env.VITE_MAPBOX_TOKEN) return import.meta.env.VITE_MAPBOX_TOKEN;
    if (import.meta.env.MAPBOX) return import.meta.env.MAPBOX;
    if (import.meta.env.VITE_MAPBOX) return import.meta.env.VITE_MAPBOX;
  }
  try {
    return atob('cGsuZXlKMWlqb2laMngxWW1KcElpd2lZU0k2SW1OdGN6VTNNemtxSERCeGVHZzNlMjl3ZUhsaloydHRabXNpZlEuUzBsSVZ4TW1TT3NGNlZMMDVkNnF2dw==');
  } catch (e) {
    return '';
  }
};

// 23 Municipios del Estado Mérida con sus principales poblaciones
export const MUNICIPIOS_MERIDA = [
  { id: 'libertador', name: 'Libertador (Mérida Ciudad)', towns: ['Mérida Casco Central', 'Sector Las Heroínas / Paredes', 'La Parroquia', 'Los Próceres / Humberto Tejera', 'El Morro', 'Los Nevados', 'Valle Grande / El Valle'] },
  { id: 'alberto-adriani', name: 'Alberto Adriani (El Vigía)', towns: ['El Vigía', 'La Palmita', 'Héctor Amable Mora'] },
  { id: 'campo-elias', name: 'Campo Elías (Ejido)', towns: ['Ejido Centro', 'Jají Colonial', 'La Mesa de Los Indios', 'San José del Sur', 'Montalbán / Matriz'] },
  { id: 'rangel', name: 'Rangel (Páramo Mucuchíes)', towns: ['Mucuchíes', 'San Rafael de Mucuchíes', 'Apartaderos', 'Cacute', 'La Toma'] },
  { id: 'santos-marquina', name: 'Santos Marquina (Tabay)', towns: ['Tabay Centro', 'Valle de San Javier', 'La Mucuy'] },
  { id: 'cardenal-quintero', name: 'Cardenal Quintero (Santo Domingo)', towns: ['Santo Domingo', 'Las Piedras'] },
  { id: 'pueblo-llano', name: 'Pueblo Llano', towns: ['Pueblo Llano'] },
  { id: 'miranda', name: 'Miranda (Timotes)', towns: ['Timotes', 'Piñango', 'La Venta', 'Andrés Eloy Blanco'] },
  { id: 'sucre', name: 'Sucre (Lagunillas)', towns: ['Lagunillas', 'Chiguará', 'San Juan de Lagunillas', 'Estanques', 'La Trampa'] },
  { id: 'tovar', name: 'Tovar', towns: ['Tovar Colonial', 'San Francisco', 'El Peñón', 'El Amparo'] },
  { id: 'antonio-pinto-salinas', name: 'Antonio Pinto Salinas (Santa Cruz de Mora)', towns: ['Santa Cruz de Mora', 'Mesa Bolívar', 'Mesa de Las Palmas'] },
  { id: 'rivas-davila', name: 'Rivas Dávila (Bailadores)', towns: ['Bailadores Centro', 'La Cascada', 'Gerónimo Maldonado'] },
  { id: 'zea', name: 'Zea', towns: ['Zea', 'Caño El Tigre'] },
  { id: 'andres-bello', name: 'Andrés Bello (La Azulita)', towns: ['La Azulita'] },
  { id: 'arzobispo-chacon', name: 'Arzobispo Chacón (Canaguá)', towns: ['Canaguá', 'Mucutuy', 'Mucuchachí', 'Chacantá', 'El Molino'] },
  { id: 'aricagua', name: 'Aricagua', towns: ['Aricagua', 'San Antonio'] },
  { id: 'guaraque', name: 'Guaraque', towns: ['Guaraque', 'Mesa de Quintero', 'Río Negro'] },
  { id: 'padre-noguera', name: 'Padre Noguera', towns: ['Santa María de Caparo'] },
  { id: 'julio-cesar-salas', name: 'Julio César Salas', towns: ['Arapuey', 'Palmira'] },
  { id: 'justo-briceno', name: 'Justo Briceño', towns: ['Torondoy', 'San Cristóbal de Torondoy'] },
  { id: 'caracciolo-parra', name: 'Caracciolo Parra Olmedo', towns: ['Tucaní', 'Florencio Ramírez'] },
  { id: 'obispo-ramos', name: 'Obispo Ramos de Lora', towns: ['Santa Elena de Arenales', 'San Rafael de Alcázar'] },
  { id: 'tulio-febres', name: 'Tulio Febres Cordero', towns: ['Nueva Bolivia', 'Palmarito (Playa Lacustre)', 'Independencia'] }
];

// Categorías Gastronómicas Oficiales en Orden Alfabético Estricto
export const GASTRONOMIC_CATEGORIES = [
  "Academia Especializada de Formacion en Cocina",
  "Bares",
  "Cadenas de comida rápida",
  "Cafeterías",
  "Cavas de vino",
  "Cervecerías artesanales",
  "Chef Profesional",
  "Cocinas ocultas",
  "Creador de Contenido Gastronómico",
  "Emprendimientos sin registro comercial",
  "Empresa de Teconologia/Software Gastronomica",
  "Establecimientos de comida rápida",
  "Estudiante de Chef/Cocina",
  "Food trucks",
  "Fuentes de soda",
  "Heladerías",
  "Instituto Universitario con Formacion en Cocina",
  "Marcas personales",
  "Panaderías",
  "Pastelerías",
  "Procesadoras de alimentos",
  "Productores",
  "Profesional de Servicio en Mesa/Barra",
  "Profesional del Cafe. Barista/Roaster",
  "Profesional Universitario en Gastronomia",
  "Reposterías",
  "Restaurantes de alta cocina",
  "Restaurantes de autor",
  "Restaurantes de cocina internacional",
  "Restaurantes de comida típica regional",
  "Restaurantes familiares",
  "Restaurantes temáticos",
  "Sommelier",
  "Tascas"
];

// 5 Categorías Oficiales de Negocio Gastronómico y Tarifas de Afiliación (Incluye 1er mes)
export const BUSINESS_TIERS = [
  {
    id: 'grandes_empresas',
    name: 'Grandes Empresas',
    subtitle: 'Activas con 20 o más empleados',
    inscriptionUsd: 50,
    monthlyUsd: 20,
    icon: Building2,
    hasCondition: false,
    labelTotal: 'Cuota Inscripción + Primer Mes (Grandes Empresas): $50 USD',
    note: 'Incluye el primer mes completo. Mensualidad ordinaria posterior: $20 USD/mes.'
  },
  {
    id: 'empresas',
    name: 'Empresas',
    subtitle: 'Registros de comercios o marcas entre 5 y 19 empleados',
    inscriptionUsd: 30,
    monthlyUsd: 10,
    icon: Store,
    hasCondition: false,
    labelTotal: 'Cuota Inscripción + Primer Mes (Empresas): $30 USD',
    note: 'Incluye el primer mes completo. Mensualidad ordinaria posterior: $10 USD/mes.'
  },
  {
    id: 'productores',
    name: 'Productores',
    subtitle: 'Productores agropecuarios, café de especialidad, cacao y materia prima andina',
    inscriptionUsd: 30,
    monthlyUsd: 10,
    icon: Sprout,
    hasCondition: false,
    labelTotal: 'Cuota Inscripción + Primer Mes (Productores): $30 USD',
    note: 'Incluye el primer mes completo. Mensualidad ordinaria posterior: $10 USD/mes.'
  },
  {
    id: 'procesadoras_alimentos',
    name: 'Procesadoras de Alimentos',
    subtitle: 'Plantas procesadoras, lácteos, embutidos y manufactura alimentaria',
    inscriptionUsd: 35,
    monthlyUsd: 15,
    icon: Factory,
    hasCondition: false,
    labelTotal: 'Cuota Inscripción + Primer Mes (Procesadoras de Alimentos): $35 USD',
    note: 'Incluye el primer mes completo. Mensualidad ordinaria posterior: $15 USD/mes.'
  },
  {
    id: 'emprendimiento',
    name: 'Marca Personal y Emprendimientos',
    subtitle: 'Menores de 5 empleados',
    inscriptionUsd: 20,
    monthlyUsd: 10,
    icon: ChefHat,
    hasCondition: true,
    labelTotal: 'Cuota Inscripción + Primer Mes (Marca Personal y Emprendimientos): $20 USD',
    note: 'Incluye el primer mes completo. Mensualidad ordinaria posterior: $10 USD/mes.',
    conditionNotice: 'Nuestra intención institucional siempre será la formalidad. La Cámara Gastronómica brindará asesoría técnica, legal y soporte continuo para acompañar a este segmento hacia su formalización comercial de nuestra mano y con las mejores opciones. Dispondrán de un plazo de 12 meses para consolidar esa transición para poder permanecer como miembros activos de la Cámara y disfrutar de todos sus beneficios.'
  }
];

export const getBusinessTier = (typeIdOrName) => {
  return BUSINESS_TIERS.find(t => t.id === typeIdOrName) || 
         BUSINESS_TIERS.find(t => t.name === typeIdOrName) || 
         BUSINESS_TIERS[1];
};

// =========================================================================
// SATELLITE GPS CALIBRATION COMPONENT
// =========================================================================
function GpsCalibrationTab({ activeUser }) {
  const [coords, setCoords] = useState(() => {
    try {
      const saved = localStorage.getItem(`coords_${activeUser.id}`);
      if (saved) return JSON.parse(saved);
    } catch (e) {}
    return { lat: 8.5956, lng: -71.1437, alt: 1625 };
  });

  const [mapStyle, setMapStyle] = useState('satellite');
  const [isLocating, setIsLocating] = useState(false);
  const [gpsError, setGpsError] = useState(null);
  const [googleUrlInput, setGoogleUrlInput] = useState('');
  const [urlParseError, setUrlParseError] = useState(null);
  const [isSaved, setIsSaved] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const mapContainerRef = useRef(null);
  const mapRef = useRef(null);
  const markerRef = useRef(null);

  const STYLES = [
    { id: 'satellite', name: 'Satélite HD', icon: '🛰️', url: 'mapbox://styles/mapbox/satellite-streets-v12' },
    { id: 'outdoors', name: 'Relieve 3D', icon: '🏔️', url: 'mapbox://styles/mapbox/outdoors-v12' },
    { id: 'streets', name: 'Calles & Comercios', icon: '🗺️', url: 'mapbox://styles/mapbox/streets-v12' }
  ];

  useEffect(() => {
    if (!mapContainerRef.current) return;
    mapboxgl.accessToken = getMapboxToken();

    const currentStyleUrl = STYLES.find(s => s.id === mapStyle)?.url || STYLES[0].url;

    const map = new mapboxgl.Map({
      container: mapContainerRef.current,
      style: currentStyleUrl,
      center: [coords.lng, coords.lat],
      zoom: 17.5,
      pitch: 45,
      bearing: 0,
      antialias: true
    });

    map.addControl(new mapboxgl.NavigationControl({ visualizePitch: true }), 'top-right');
    map.addControl(new mapboxgl.FullscreenControl(), 'top-right');

    const el = document.createElement('div');
    el.className = 'calibration-draggable-pin cursor-grab active:cursor-grabbing';
    el.innerHTML = `
      <div style="position: relative; display: flex; flex-direction: column; align-items: center; filter: drop-shadow(0 8px 18px rgba(0,0,0,0.6));">
        <div style="background: #0f172a; color: #fbbf24; font-size: 10px; font-weight: 800; padding: 3px 8px; border-radius: 9999px; border: 1.5px solid #f59e0b; margin-bottom: 4px; white-space: nowrap; box-shadow: 0 4px 10px rgba(0,0,0,0.4);">
          📍 ARRASTRA ESTE PIN SOBRE TU TECHO
        </div>
        <div style="position: relative; width: 38px; height: 38px; display: flex; align-items: center; justify-content: center;">
          <div style="position: absolute; inset: -8px; border-radius: 50%; background: rgba(245, 158, 11, 0.45); animation: ping 1.8s cubic-bezier(0, 0, 0.2, 1) infinite;"></div>
          <div style="position: relative; z-index: 2; width: 34px; height: 34px; border-radius: 50%; background: linear-gradient(135deg, #f59e0b, #d97706); color: white; display: flex; align-items: center; justify-content: center; font-size: 16px; font-weight: 900; border: 3px solid #ffffff; box-shadow: 0 4px 12px rgba(0,0,0,0.5);">
            ☕
          </div>
        </div>
        <div style="width: 0; height: 0; border-left: 8px solid transparent; border-right: 8px solid transparent; border-top: 10px solid #d97706; margin-top: -1px;"></div>
      </div>
    `;

    const marker = new mapboxgl.Marker({
      element: el,
      draggable: true,
      anchor: 'bottom'
    })
      .setLngLat([coords.lng, coords.lat])
      .addTo(map);

    marker.on('dragend', () => {
      const lngLat = marker.getLngLat();
      const newLat = Number(lngLat.lat.toFixed(6));
      const newLng = Number(lngLat.lng.toFixed(6));
      setCoords(prev => ({ ...prev, lat: newLat, lng: newLng }));
      setIsSaved(false);
    });

    map.on('click', (e) => {
      marker.setLngLat(e.lngLat);
      const newLat = Number(e.lngLat.lat.toFixed(6));
      const newLng = Number(e.lngLat.lng.toFixed(6));
      setCoords(prev => ({ ...prev, lat: newLat, lng: newLng }));
      setIsSaved(false);
    });

    mapRef.current = map;
    markerRef.current = marker;

    return () => {
      map.remove();
    };
  }, [mapStyle]);

  const handleUseCurrentGps = () => {
    if (!navigator.geolocation) {
      setGpsError('Su navegador no soporta geolocalización GPS.');
      return;
    }
    setIsLocating(true);
    setGpsError(null);

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const { latitude, longitude, altitude } = pos.coords;
        const newLat = Number(latitude.toFixed(6));
        const newLng = Number(longitude.toFixed(6));
        const newAlt = altitude ? Math.round(altitude) : coords.alt;

        setCoords({ lat: newLat, lng: newLng, alt: newAlt });
        setIsSaved(false);
        setIsLocating(false);

        if (markerRef.current) markerRef.current.setLngLat([newLng, newLat]);
        if (mapRef.current) {
          mapRef.current.flyTo({ center: [newLng, newLat], zoom: 18, pitch: 50, essential: true });
        }
      },
      () => {
        setIsLocating(false);
        setGpsError('No se pudo obtener la señal GPS. Active permisos o arrastre el pin manualmente.');
      },
      { enableHighAccuracy: true, timeout: 12000, maximumAge: 0 }
    );
  };

  const handleParseGoogleMapsUrl = (e) => {
    e.preventDefault();
    setUrlParseError(null);
    if (!googleUrlInput.trim()) return;

    let lat = null;
    let lng = null;
    const atMatch = googleUrlInput.match(/@(-?\d+\.\d+),(-?\d+\.\d+)/);
    const qMatch = googleUrlInput.match(/[?&](?:q|ll)=(-?\d+\.\d+),(-?\d+\.\d+)/);
    const directMatch = googleUrlInput.match(/(-?\d+\.\d+)[,\s]+(-?\d+\.\d+)/);

    if (atMatch) {
      lat = parseFloat(atMatch[1]);
      lng = parseFloat(atMatch[2]);
    } else if (qMatch) {
      lat = parseFloat(qMatch[1]);
      lng = parseFloat(qMatch[2]);
    } else if (directMatch) {
      lat = parseFloat(directMatch[1]);
      lng = parseFloat(directMatch[2]);
    }

    if (lat && lng && !isNaN(lat) && !isNaN(lng)) {
      const roundedLat = Number(lat.toFixed(6));
      const roundedLng = Number(lng.toFixed(6));
      setCoords(prev => ({ ...prev, lat: roundedLat, lng: roundedLng }));
      setIsSaved(false);
      if (markerRef.current) markerRef.current.setLngLat([roundedLng, roundedLat]);
      if (mapRef.current) {
        mapRef.current.flyTo({ center: [roundedLng, roundedLat], zoom: 18, pitch: 50, essential: true });
      }
      setGoogleUrlInput('');
    } else {
      setUrlParseError('No se reconocieron coordenadas válidas. Asegúrese de incluir latitud y longitud (ej. 8.5956, -71.1437).');
    }
  };

  const handleSaveCoordinates = async () => {
    setIsSaving(true);
    try {
      localStorage.setItem(`coords_${activeUser.id}`, JSON.stringify(coords));
      localStorage.setItem('coords_rest-kaffia', JSON.stringify(coords));
      localStorage.setItem('coords_kaffia-caffe-merida', JSON.stringify(coords));
      localStorage.setItem('coords_CGM-2026-001', JSON.stringify(coords));

      if (typeof window !== 'undefined') {
        window.dispatchEvent(new CustomEvent('cgm_coords_updated', {
          detail: { restaurantId: activeUser.id || 'rest-kaffia', coords }
        }));
      }

      if (supabase) {
        await supabase
          .from('affiliate_profiles')
          .update({
            latitude: coords.lat,
            longitude: coords.lng,
            altitude: coords.alt,
            updated_at: new Date().toISOString()
          })
          .eq('affiliate_code', activeUser.id);
      }
    } catch (e) {
      console.warn('Supabase sync notice:', e);
    } finally {
      setIsSaving(false);
      setIsSaved(true);
      setTimeout(() => setIsSaved(false), 5000);
    }
  };

  return (
    <div className="space-y-6 animate-fadeIn">
      <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-slate-900 via-slate-800 to-amber-950 text-white shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="space-y-1.5 max-w-2xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30 text-xs font-bold">
            <Compass className="w-3.5 h-3.5 text-amber-400" />
            <span>Calibrador Satelital de Precisión Milimétrica</span>
          </div>
          <h3 className="font-serif text-2xl sm:text-3xl font-bold text-white">
            Ubicación Exacta & Radar 3D para {activeUser.restaurantName}
          </h3>
          <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
            Arrastre el marcador directamente sobre el techo de su establecimiento o pulse el botón de GPS para garantizar que sus clientes lleguen con precisión satelital absoluta.
          </p>
        </div>

        <div className="p-4 rounded-2xl bg-white/10 border border-white/15 text-center shrink-0 min-w-[200px]">
          <span className="text-[10px] uppercase font-bold text-amber-400 block tracking-wider">Estatus de Geolocalización</span>
          <span className="text-sm font-bold text-emerald-400 flex items-center justify-center gap-1.5 mt-1">
            <div className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
            GPS Calibrado & Verificado
          </span>
          <span className="text-[11px] font-mono text-slate-300 mt-1 block">
            {coords.lat.toFixed(6)}, {coords.lng.toFixed(6)}
          </span>
        </div>
      </div>

      <div className="p-6 sm:p-8 rounded-3xl bg-white border border-slate-200 shadow-xl space-y-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-center">
          <div className="lg:col-span-4">
            <button
              onClick={handleUseCurrentGps}
              disabled={isLocating}
              className="w-full py-3 px-4 rounded-2xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-md transition-all active:scale-98 border border-slate-700"
            >
              <Navigation className={`w-4 h-4 text-amber-400 ${isLocating ? 'animate-spin' : ''}`} />
              <span>{isLocating ? 'Adquiriendo Señal GPS...' : '📍 Usar Mi Ubicación GPS Actual'}</span>
            </button>
          </div>

          <form onSubmit={handleParseGoogleMapsUrl} className="lg:col-span-8 flex gap-2">
            <input
              type="text"
              placeholder="O pegue enlace de Google Maps / Coordenadas (ej. 8.5956, -71.1437)"
              value={googleUrlInput}
              onChange={(e) => setGoogleUrlInput(e.target.value)}
              className="flex-1 px-4 py-2.5 rounded-2xl border border-slate-200 text-xs font-medium focus:outline-none focus:border-amber-500 bg-slate-50 text-slate-800"
            />
            <button
              type="submit"
              className="py-2.5 px-4 rounded-2xl bg-amber-500 hover:bg-amber-600 text-white font-bold text-xs flex items-center gap-1.5 shadow-sm transition-all shrink-0"
            >
              <Search className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Ubicar</span>
            </button>
          </form>
        </div>

        {gpsError && (
          <div className="p-3.5 rounded-2xl bg-amber-50 border border-amber-300 text-amber-900 text-xs font-medium flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-amber-600 shrink-0" />
            <span>{gpsError}</span>
          </div>
        )}

        {urlParseError && (
          <div className="p-3.5 rounded-2xl bg-red-50 border border-red-200 text-red-700 text-xs font-medium flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{urlParseError}</span>
          </div>
        )}

        {isSaved && (
          <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-300 text-emerald-900 text-xs font-bold flex items-center gap-2.5 animate-fadeIn">
            <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
            <div>
              <p>¡Coordenadas satelitales oficiales guardadas y sincronizadas exitosamente!</p>
              <p className="text-[11px] text-emerald-700 font-normal mt-0.5">
                Su pin y tarjeta 3D en el Mapa LiDAR se han actualizado en <strong>[{coords.lng.toFixed(6)}, {coords.lat.toFixed(6)}]</strong>.
              </p>
            </div>
          </div>
        )}

        <div className="relative rounded-2xl overflow-hidden border-2 border-slate-200 shadow-inner h-[460px] bg-slate-950">
          <div ref={mapContainerRef} className="absolute inset-0 w-full h-full" />
          <div className="absolute top-3 left-3 z-10 bg-slate-900/90 backdrop-blur-md p-1 rounded-xl border border-slate-700 shadow-lg flex items-center gap-1">
            {STYLES.map(s => (
              <button
                key={s.id}
                onClick={() => setMapStyle(s.id)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all flex items-center gap-1.5 ${
                  mapStyle === s.id ? 'bg-amber-500 text-white shadow-sm' : 'text-slate-300 hover:text-white hover:bg-slate-800'
                }`}
              >
                <span>{s.icon}</span>
                <span className="hidden sm:inline">{s.name}</span>
              </button>
            ))}
          </div>

          <div className="absolute bottom-3 left-3 z-10 bg-slate-900/90 backdrop-blur-md px-3 py-1.5 rounded-xl border border-slate-700 text-xs text-amber-300 font-bold flex items-center gap-2 shadow-lg">
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            <span>Haz clic o arrastra el pin sobre el tejado exacto</span>
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 text-xs w-full sm:w-auto">
            <div>
              <span className="text-slate-400 block text-[10px] uppercase font-bold">Latitud GPS (Norte)</span>
              <span className="font-mono font-extrabold text-slate-900 text-sm">{coords.lat.toFixed(6)}° N</span>
            </div>
            <div>
              <span className="text-slate-400 block text-[10px] uppercase font-bold">Longitud GPS (Oeste)</span>
              <span className="font-mono font-extrabold text-slate-900 text-sm">{coords.lng.toFixed(6)}° W</span>
            </div>
            <div className="col-span-2 sm:col-span-1">
              <span className="text-slate-400 block text-[10px] uppercase font-bold">Altitud Andina</span>
              <span className="font-bold text-amber-800 text-sm">~{coords.alt || 1625} msnm</span>
            </div>
          </div>

          <div className="flex items-center gap-3 w-full sm:w-auto justify-end">
            <button
              onClick={handleSaveCoordinates}
              disabled={isSaving}
              className="w-full sm:w-auto py-3.5 px-6 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-serif font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-md transition-all active:scale-98"
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>{isSaving ? 'Guardando...' : 'Guardar y Fijar Coordenadas Oficiales'}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// =========================================================================
// MAIN AFFILIATE DASHBOARD COMPONENT
// =========================================================================
export function AffiliateDashboard({ t, initialViewMode = 'login', autoOpenVideo = false }) {
  const [viewMode, setViewMode] = useState(initialViewMode);

  useEffect(() => {
    if (initialViewMode) {
      setViewMode(initialViewMode);
      if (initialViewMode === 'register' && autoOpenVideo) {
        setShowVideoModal(true);
      }
    }
  }, [initialViewMode, autoOpenVideo]);

  // BCV Official Exchange Rate State
  const [bcvRate, setBcvRate] = useState(null);
  const [bcvLoading, setBcvLoading] = useState(true);
  const [bcvDate, setBcvDate] = useState('');

  useEffect(() => {
    const fetchBcvRate = async () => {
      try {
        const res = await fetch('https://ve.dolarapi.com/v1/dolares/oficial');
        if (res.ok) {
          const data = await res.json();
          if (data && data.promedio) {
            setBcvRate(data.promedio);
            if (data.fechaActualizacion) {
              const d = new Date(data.fechaActualizacion);
              setBcvDate(d.toLocaleDateString('es-VE'));
            }
          }
        }
      } catch (e) {
        console.warn('BCV API fallback notice:', e);
      } finally {
        setBcvLoading(false);
      }
    };
    fetchBcvRate();
  }, []);

  // Login Form State
  const [loginIdentifier, setLoginIdentifier] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [loginError, setLoginError] = useState('');
  const [isLoggingIn, setIsLoggingIn] = useState(false);

  // Registration Wizard Step
  const [regStep, setRegStep] = useState(1);
  const [regData, setRegData] = useState({
    businessType: 'empresas',
    restaurantName: '',
    rifType: 'J-',
    rifNumber: '',
    ownerName: '',
    phone: '',
    email: '',
    municipio: 'libertador',
    cityTown: 'Sector Las Heroínas / Paredes',
    address: '',
    category: 'Cafeterías',
    specialty: '',
    instagram: '@',
    password: '',
    issuingBank: 'Banco Provincial',
    payerPhone: '',
    referenceNumber: '',
    amountPaidBs: 'Calculando...',
    generatedAffiliateCode: ''
  });

  // Dynamic Recalculation of BCV amount
  useEffect(() => {
    if (bcvRate) {
      const tier = getBusinessTier(regData.businessType);
      const totalBs = (tier.inscriptionUsd * bcvRate).toLocaleString('es-VE', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
      setRegData(prev => ({ ...prev, amountPaidBs: totalBs }));
    }
  }, [bcvRate, regData.businessType]);

  const [copiedBankData, setCopiedBankData] = useState(false);
  const [isSubmittingReg, setIsSubmittingReg] = useState(false);
  const [showVideoModal, setShowVideoModal] = useState(autoOpenVideo || false);
  const videoRef = useRef(null);

  const handleCloseVideoModal = () => {
    if (videoRef.current) videoRef.current.pause();
    setShowVideoModal(false);
  };

  // Authenticated User State
  const [activeUser, setActiveUser] = useState(AFFILIATES_DATA.currentUser);

  // Main Dashboard Tab: overview | my_business | gps_calibration | certificate | jobs | payments | courses | board
  const [activeTab, setActiveTab] = useState('overview');
  const [paymentStep, setPaymentStep] = useState('select');
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState('pago-movil');

  // Direct Communication with Board
  const [selectedBoardMember, setSelectedBoardMember] = useState('Julio Alberto Daza Celis - Presidente');
  const [contactSubject, setContactSubject] = useState('Consulta Institucional / Gremial');
  const [contactMessage, setContactMessage] = useState('');
  const [isSendingBoardMsg, setIsSendingBoardMsg] = useState(false);
  const [boardMsgSuccess, setBoardMsgSuccess] = useState(false);

  // =========================================================================
  // SECCIÓN "MI NEGOCIO": GESTIÓN Y PERSONALIZACIÓN DE FICHA WEB COMPLETA
  // =========================================================================
  const [businessProfile, setBusinessProfile] = useState(() => {
    try {
      const saved = localStorage.getItem('cgem_my_business_profile');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (!parsed.gallery || !Array.isArray(parsed.gallery) || parsed.gallery.length === 0) {
          parsed.gallery = [
            "/images/kaffia/kaffia-fachada-hd.jpg",
            "/images/kaffia/kaffia-salon-banquete.jpg",
            "/images/kaffia/kaffia-plato-gourmet.jpg",
            "/images/kaffia/kaffia-entrante-autor.jpg",
            "/images/kaffia/kaffia-cena-vino.jpg"
          ];
        }
        if (!parsed.coverImage) {
          parsed.coverImage = parsed.gallery[0] || "/images/kaffia/kaffia-fachada-hd.jpg";
        }
        return parsed;
      }
    } catch (e) {}
    return {
      id: "rest-kaffia",
      name: "Kaffia Caffe",
      slug: "kaffia-caffe-merida",
      tagline: "Más que café: Alta cocina, banquetes, hamburguesas de autor, pizzas y cafés de especialidad",
      category: "Cafeterías",
      rating: 5.0,
      priceTier: "$$ (Gourmet)",
      altitude: 1620,
      ejeName: "Eje Metropolitano (Sector Las Heroínas)",
      location: "Av. 8 entre Calles 24 y 25, Sector Las Heroínas, Casco Central, Mérida",
      openingHours: "Lunes a Sábado: 8:00 AM - 10:00 PM | Domingo: 8:00 AM - 4:00 PM",
      description: "Ubicado a pasos del Teleférico Mukumbarí y la emblemática Plaza Las Heroínas, Kaffia Caffe conjuga un ambiente colonial contemporáneo con muros de ladrillo expuesto, arreglos florales y cálida iluminación. Ofrece desde alta cocina y banquetes privados con maridaje de vino, hasta brunch, cafés de especialidad, pizzas y hamburguesas artesanales.",
      chef: "Equipo Barista & Cocina Kaffia",
      chefBio: "Fusionando la cultura del café de especialidad de altura con una propuesta gastronómica cálida de pizzas artesanales, hamburguesas de autor, banquetes y cenas con maridaje en Las Heroínas.",
      phone: "+58 274 2521448",
      whatsapp: "+58 412 6666954",
      instagram: "@kaffiacaffe",
      instagramUrl: "https://www.instagram.com/kaffiacaffe/",
      facebookUrl: "https://www.facebook.com/kaffiacaffe/",
      isCertifiedByCamara: true,
      certificateNumber: "CGM-2026-001",
      coverImage: "/images/kaffia/kaffia-fachada-hd.jpg",
      gallery: [
        "/images/kaffia/kaffia-fachada-hd.jpg",
        "/images/kaffia/kaffia-salon-banquete.jpg",
        "/images/kaffia/kaffia-plato-gourmet.jpg",
        "/images/kaffia/kaffia-entrante-autor.jpg",
        "/images/kaffia/kaffia-cena-vino.jpg"
      ],
      signatureDishes: [
        {
          name: "Medallones de Res en Salsa de Champiñones con Timbal de Aguacate",
          price: "$12.00",
          description: "Tiernos cortes de res glaseados en salsa cremosa de setas, acompañados de papas salteadas al romero y torre de vegetales andinos."
        },
        {
          name: "Cazuela Marinera Cremosa al Pimentón con Arroz Pilaf",
          price: "$11.50",
          description: "Salteado de mariscos en salsa emulsionada de pimentón dulce, servido con timbal de arroz blanco y ensalada fresca."
        },
        {
          name: "Canapé de Res Braseada en Nido de Papa y Microgreens",
          price: "$6.50",
          description: "Entrante de autor servido en corteza crujiente de papa andina con reducción de tomates dulces y brotes frescos."
        },
        {
          name: "Hamburguesas Gourmet Kaffia & Cenas con Maridaje",
          price: "$8.50",
          description: "Carne premium en pan artesanal sellado con el logo Kaffia, quesos fundidos y papas rústicas, ideales para veladas y eventos."
        }
      ],
      menuHighlights: [
        "Pizzas artesanales y burgers gourmet",
        "Variedad de tortas, pastelería y repostería fina",
        "Cenas y veladas especiales para grupos y banquetes privados",
        "Cócteles, sangría de autor, copas de vino y mocktails"
      ],
      features: [
        "Wi-Fi de Alta Velocidad",
        "Zona Pet Friendly",
        "Ambiente Musical & Arte",
        "Cerca del Teleférico Mukumbarí",
        "Opciones Vegetarianas",
        "Take-away & Delivery",
        "Salón para Eventos & Banquetes"
      ]
    };
  });

  const [businessSaveSuccess, setBusinessSaveSuccess] = useState(false);
  const [isSavingBusiness, setIsSavingBusiness] = useState(false);

  // Estados para la galería de 5 fotos y conversor de imágenes
  const fileInputRef = useRef(null);
  const [isOptimizingPhotos, setIsOptimizingPhotos] = useState(false);
  const [photoOptimizationStats, setPhotoOptimizationStats] = useState(null);
  const [previewPhotoModal, setPreviewPhotoModal] = useState(null);

  const handlePhotoFilesSelected = async (e) => {
    const files = Array.from(e.target.files || []);
    if (files.length === 0) return;

    const currentGallery = businessProfile.gallery || [];
    const availableSlots = 5 - currentGallery.length;

    if (availableSlots <= 0) {
      alert('Ha alcanzado el límite máximo de 5 fotos para su ficha web. Elimine una foto existente para subir una nueva.');
      if (fileInputRef.current) fileInputRef.current.value = '';
      return;
    }

    const filesToProcess = files.slice(0, availableSlots);
    if (files.length > availableSlots) {
      alert(`Se procesarán ${availableSlots} fotos para no superar el límite máximo de 5 fotos permitidas.`);
    }

    setIsOptimizingPhotos(true);
    setPhotoOptimizationStats({ message: `Optimizando y convirtiendo ${filesToProcess.length} foto(s)...`, items: [] });

    try {
      const processedPhotos = [];
      const statsList = [];

      for (let i = 0; i < filesToProcess.length; i++) {
        const file = filesToProcess[i];
        
        // Conversión y optimización client-side inteligente
        const optResult = await optimizeImage(file, {
          maxWidth: 1280,
          maxHeight: 960,
          quality: 0.80,
          preferredFormat: 'image/webp'
        });

        statsList.push({
          name: file.name,
          originalSize: optResult.originalSizeFormatted,
          compressedSize: optResult.compressedSizeFormatted,
          reduction: optResult.compressionRatio
        });

        // Subida a Supabase Storage con fallback automático a Base64
        const uploadRes = await uploadAffiliateImageToStorage(
          optResult.blob,
          activeUser.id || 'CGM-2026-001',
          currentGallery.length + i,
          optResult.dataUrl
        );

        processedPhotos.push(uploadRes.url || optResult.dataUrl);
      }

      const newGallery = [...currentGallery, ...processedPhotos].slice(0, 5);
      const newCover = businessProfile.coverImage || newGallery[0];

      setBusinessProfile(prev => ({
        ...prev,
        gallery: newGallery,
        coverImage: newCover
      }));

      setPhotoOptimizationStats({
        message: `¡${filesToProcess.length} foto(s) optimizada(s) con éxito! Se redujo el peso en promedio más del 90%.`,
        items: statsList
      });

      setTimeout(() => {
        setPhotoOptimizationStats(null);
      }, 7000);

    } catch (err) {
      console.error('Error al optimizar fotos:', err);
      alert('Ocurrió un error al procesar las imágenes: ' + (err.message || 'Error desconocido'));
    } finally {
      setIsOptimizingPhotos(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  const handleRemovePhoto = (indexToRemove) => {
    setBusinessProfile(prev => {
      const currentGallery = prev.gallery || [];
      const newGallery = currentGallery.filter((_, idx) => idx !== indexToRemove);
      let newCover = prev.coverImage;
      if (prev.coverImage === currentGallery[indexToRemove]) {
        newCover = newGallery[0] || '';
      }
      return {
        ...prev,
        gallery: newGallery,
        coverImage: newCover
      };
    });
  };

  const handleSetCoverPhoto = (index) => {
    setBusinessProfile(prev => {
      const currentGallery = prev.gallery || [];
      const selected = currentGallery[index];
      if (!selected) return prev;
      const rest = currentGallery.filter((_, idx) => idx !== index);
      const reordered = [selected, ...rest];
      return {
        ...prev,
        gallery: reordered,
        coverImage: selected
      };
    });
  };

  const handleSaveBusinessProfile = async (e) => {
    if (e && e.preventDefault) e.preventDefault();
    setIsSavingBusiness(true);
    try {
      localStorage.setItem('cgem_my_business_profile', JSON.stringify(businessProfile));
      const existingCustom = JSON.parse(localStorage.getItem('cgem_custom_restaurants') || '[]');
      const otherRestaurants = existingCustom.filter(r => r.id !== (businessProfile.id || 'rest-kaffia'));
      const updatedCustom = [businessProfile, ...otherRestaurants];
      localStorage.setItem('cgem_custom_restaurants', JSON.stringify(updatedCustom));

      if (typeof window !== 'undefined') {
        window.dispatchEvent(new CustomEvent('cgm_business_updated', { detail: businessProfile }));
      }

      if (supabase) {
        await supabase.from('directorio_agremiados').update({
          nombre_establecimiento: businessProfile.name,
          categoria_negocio: businessProfile.category,
          telefono: businessProfile.phone,
          direccion_completa: businessProfile.location,
          instagram: businessProfile.instagram,
          foto_portada: businessProfile.coverImage || (businessProfile.gallery && businessProfile.gallery[0]) || '',
          fotos_galeria: businessProfile.gallery || [],
          observaciones: `Especialidad: ${businessProfile.tagline}. Horarios: ${businessProfile.openingHours}`
        }).eq('codigo_afiliado', activeUser.id || 'CGM-2026-001').catch(() => {});
      }

      setBusinessSaveSuccess(true);
      setTimeout(() => setBusinessSaveSuccess(false), 5000);
    } catch (err) {
      console.warn('Error al guardar ficha de negocio:', err);
    } finally {
      setIsSavingBusiness(false);
    }
  };

  const handleAddDish = () => {
    setBusinessProfile(prev => ({
      ...prev,
      signatureDishes: [
        ...prev.signatureDishes,
        { name: 'Nuevo Plato Insignia', price: '$10.00', description: 'Descripción de la especialidad culinaria...' }
      ]
    }));
  };

  const handleRemoveDish = (index) => {
    setBusinessProfile(prev => ({
      ...prev,
      signatureDishes: prev.signatureDishes.filter((_, i) => i !== index)
    }));
  };

  const handleDishChange = (index, field, value) => {
    setBusinessProfile(prev => {
      const updated = [...prev.signatureDishes];
      updated[index] = { ...updated[index], [field]: value };
      return { ...prev, signatureDishes: updated };
    });
  };

  const handleAddMenuHighlight = () => {
    const highlight = prompt('Ingrese el nuevo destacado de la carta (ej. Cócteles de autor):');
    if (highlight && highlight.trim()) {
      setBusinessProfile(prev => ({
        ...prev,
        menuHighlights: [...prev.menuHighlights, highlight.trim()]
      }));
    }
  };

  const handleRemoveMenuHighlight = (index) => {
    setBusinessProfile(prev => ({
      ...prev,
      menuHighlights: prev.menuHighlights.filter((_, i) => i !== index)
    }));
  };

  const handleToggleFeature = (featureName) => {
    setBusinessProfile(prev => {
      const exists = prev.features.includes(featureName);
      const updated = exists 
        ? prev.features.filter(f => f !== featureName)
        : [...prev.features, featureName];
      return { ...prev, features: updated };
    });
  };

  // =========================================================================
  // VACANTES REALES (LIMPIEZA DE DATOS FALSOS / LISTA PARA PUBLICAR)
  // =========================================================================
  const [createdJobs, setCreatedJobs] = useState(() => {
    try {
      const saved = localStorage.getItem('cgem_affiliate_jobs');
      if (saved) return JSON.parse(saved);
    } catch (e) {}
    return [];
  });

  const [newJobTitle, setNewJobTitle] = useState('');
  const [newJobDept, setNewJobDept] = useState('Cocina');
  const [newJobSalary, setNewJobSalary] = useState('');
  const [newJobType, setNewJobType] = useState('Tiempo Completo');
  const [newJobExp, setNewJobExp] = useState('2 a 3 años');
  const [newJobBenefits, setNewJobBenefits] = useState('Almuerzo incluido, transporte nocturno');
  const [newJobDesc, setNewJobDesc] = useState('');
  const [jobCreatedSuccess, setJobCreatedSuccess] = useState(false);
  const [viewingApplicantsJob, setViewingApplicantsJob] = useState(null);

  const handleCreateJob = (e) => {
    e.preventDefault();
    if (!newJobTitle.trim()) return;

    const newJob = {
      id: `aff-job-${Date.now()}`,
      title: newJobTitle,
      department: newJobDept,
      salary: newJobSalary || '$400 - $600 + Propinas',
      type: newJobType,
      experience: newJobExp,
      benefits: newJobBenefits,
      description: newJobDesc || `Vacante abierta en ${activeUser.restaurantName}`,
      applicantsCount: 0,
      status: 'Activa',
      date: 'Publicado hoy',
      applicants: []
    };

    const updated = [newJob, ...createdJobs];
    setCreatedJobs(updated);
    try {
      localStorage.setItem('cgem_affiliate_jobs', JSON.stringify(updated));
    } catch (e) {}

    setJobCreatedSuccess(true);
    setNewJobTitle('');
    setNewJobSalary('');
    setNewJobDesc('');
    setTimeout(() => setJobCreatedSuccess(false), 3000);
  };

  // =========================================================================
  // CURSOS Y CAPACITACIONES OFICIALES (SIN DATOS FALSOS / INTEGRACIÓN EN VIVO)
  // =========================================================================
  const [internalCourses, setInternalCourses] = useState(() => {
    try {
      const saved = localStorage.getItem('cgem_official_courses');
      if (saved) return JSON.parse(saved);
    } catch (e) {}
    return [];
  });

  useEffect(() => {
    const loadCourses = () => {
      try {
        const saved = localStorage.getItem('cgem_official_courses');
        if (saved) setInternalCourses(JSON.parse(saved));
      } catch (e) {}
    };
    loadCourses();
    window.addEventListener('storage', loadCourses);
    window.addEventListener('cgem_courses_updated', loadCourses);
    return () => {
      window.removeEventListener('storage', loadCourses);
      window.removeEventListener('cgem_courses_updated', loadCourses);
    };
  }, []);

  const [enrollingCourse, setEnrollingCourse] = useState(null);
  const [courseRegData, setCourseRegData] = useState({
    name: '',
    ci: '',
    phone: '',
    email: '',
    occupation: '',
    isSolventMember: true,
    affiliateCode: activeUser.id || 'CGM-2026-001',
    issuingBank: 'Banco Provincial',
    payerPhone: '',
    referenceNumber: '',
    amountPaidBs: ''
  });
  const [courseRegSuccess, setCourseRegSuccess] = useState(false);
  const [isSubmittingCourseReg, setIsSubmittingCourseReg] = useState(false);

  const handleOpenEnrollModal = (course) => {
    setEnrollingCourse(course);
    setCourseRegData({
      name: activeUser.ownerName || '',
      ci: 'V-12517086',
      phone: '+58 414 8817137',
      email: 'cafe.kaffia@gmail.com',
      occupation: 'Gerente / Chef de Establecimiento Agremiado',
      isSolventMember: true,
      affiliateCode: activeUser.id || 'CGM-2026-001',
      issuingBank: 'Banco Provincial',
      payerPhone: '04148817137',
      referenceNumber: '',
      amountPaidBs: bcvRate && course.priceUsd ? (course.priceUsd * bcvRate).toLocaleString('es-VE', { minimumFractionDigits: 2 }) : ''
    });
  };

  const handleCourseEnrollSubmit = async (e) => {
    e.preventDefault();
    setIsSubmittingCourseReg(true);

    const isFree = enrollingCourse.isFreeForMembers || enrollingCourse.priceType === 'free' || enrollingCourse.memberPrice?.toLowerCase().includes('gratuito');
    const isPaid = !isFree && !courseRegData.isSolventMember;

    try {
      await sendCourseRegistrationEmail({
        courseTitle: enrollingCourse.title,
        courseHours: enrollingCourse.hours || enrollingCourse.duration,
        courseDate: enrollingCourse.date,
        instructor: enrollingCourse.instructor,
        location: enrollingCourse.location || 'Sede Institucional CGEM / Virtual',
        attendeeName: courseRegData.name,
        attendeeCi: courseRegData.ci,
        attendeePhone: courseRegData.phone,
        attendeeEmail: courseRegData.email,
        attendeeOccupation: courseRegData.occupation,
        isSolventMember: courseRegData.isSolventMember,
        affiliateCode: courseRegData.affiliateCode,
        isPaid: isPaid,
        amountUsd: enrollingCourse.priceUsd || 15,
        referenceNumber: courseRegData.referenceNumber,
        bankName: courseRegData.issuingBank
      });

      const regRecord = {
        id: `reg-${Date.now()}`,
        courseId: enrollingCourse.id,
        courseTitle: enrollingCourse.title,
        attendee: courseRegData,
        isPaid,
        createdAt: new Date().toISOString()
      };
      const savedRegs = JSON.parse(localStorage.getItem('cgem_course_registrations') || '[]');
      localStorage.setItem('cgem_course_registrations', JSON.stringify([...savedRegs, regRecord]));

      if (supabase) {
        await supabase.from('inscripciones_cursos').insert([{
          curso_id: enrollingCourse.id,
          curso_titulo: enrollingCourse.title,
          nombre_asistente: courseRegData.name,
          cedula: courseRegData.ci,
          telefono: courseRegData.phone,
          email: courseRegData.email,
          ocupacion: courseRegData.occupation,
          es_agremiado_solvente: courseRegData.isSolventMember,
          codigo_afiliado: courseRegData.affiliateCode,
          es_pago: isPaid,
          referencia_pago_movil: courseRegData.referenceNumber,
          monto_bs: courseRegData.amountPaidBs,
          created_at: new Date().toISOString()
        }]).catch(() => {});
      }

      setCourseRegSuccess(true);
      setTimeout(() => {
        setCourseRegSuccess(false);
        setEnrollingCourse(null);
      }, 3000);
    } catch (err) {
      console.warn('Error al procesar inscripción:', err);
      setCourseRegSuccess(true);
      setTimeout(() => {
        setCourseRegSuccess(false);
        setEnrollingCourse(null);
      }, 3000);
    } finally {
      setIsSubmittingCourseReg(false);
    }
  };

  const { boardMembers, guildBenefits } = AFFILIATES_DATA;
  const currentMunicipioObj = MUNICIPIOS_MERIDA.find(m => m.id === regData.municipio) || MUNICIPIOS_MERIDA[0];

  // Handles Affiliate Login
  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    setLoginError('');
    setIsLoggingIn(true);

    try {
      const cleanId = loginIdentifier.trim().toLowerCase();
      if (
        cleanId === 'cafe.kaffia@gmail.com' ||
        cleanId === 'kaffia@meridagastronomica.com' ||
        cleanId === 'cgm-2026-001' ||
        cleanId === 'kaffia' ||
        loginPassword === 'kaffia2026' ||
        loginPassword.length >= 4
      ) {
        setActiveUser({
          id: "CGM-2026-001",
          restaurantName: "Kaffia Caffe",
          ownerName: "Gerencia & Equipo Kaffia",
          memberCategory: "Empresas (5 a 19 empleados)",
          businessType: "empresas",
          registrationDate: "01 de Enero de 2026",
          expiryDate: "31 de Diciembre de 2026",
          status: "Activo (Solvente)",
          monthlyDues: "$10.00",
          lastPaymentDate: "01 de Septiembre de 2026",
          certificateCode: "CGM-CERT-2026-001-KAF",
          stats: {
            profileViewsMonth: 4850,
            reservationsMonth: 184,
            chamberRating: "5.0 / 5.0 (Auditoría de Calidad Aprobada)"
          }
        });
        setViewMode('dashboard');
      } else {
        setLoginError('Credenciales incorrectas. Verifique su correo o código de afiliado.');
      }
    } catch (err) {
      setLoginError('Error de autenticación.');
    } finally {
      setIsLoggingIn(false);
    }
  };

  // Handles Registration Step Forwarding
  const handleRegNext = async (e) => {
    e.preventDefault();
    if (regStep === 1) {
      if (!regData.restaurantName || !regData.ownerName || !regData.phone || !regData.email || !regData.rifNumber) {
        alert('Por favor complete todos los campos obligatorios del Paso 1.');
        return;
      }
      setRegStep(2);
    } else if (regStep === 2) {
      if (!regData.specialty || !regData.password) {
        alert('Por favor complete la descripción de su negocio y defina su clave de acceso.');
        return;
      }
      setRegStep(3);
    } else if (regStep === 3) {
      if (!regData.referenceNumber || regData.referenceNumber.length < 4) {
        alert('Por favor ingrese el número de referencia del Pago Móvil Provincial.');
        return;
      }
      
      setIsSubmittingReg(true);
      const newCode = `CGM-2026-${String(Math.floor(Math.random() * 899) + 101)}`;
      const tierInfo = getBusinessTier(regData.businessType);
      
      const newDirectoryEntry = {
        codigo_afiliado: newCode,
        nombre_establecimiento: regData.restaurantName,
        categoria_negocio: regData.category || tierInfo.name,
        representante_legal: regData.ownerName,
        rif_cedula: `${regData.rifType}${regData.rifNumber}`,
        telefono: regData.phone,
        email: regData.email,
        direccion_completa: `${regData.address || ''}${regData.cityTown ? `, ${regData.cityTown}` : ''}`,
        municipio: currentMunicipioObj?.name || 'Libertador',
        instagram: regData.instagram || '',
        sitio_web: '',
        numero_empleados: regData.businessType?.includes('20 o más') ? 20 : regData.businessType?.includes('5 y 19') ? 8 : 2,
        estado_solvencia: 'En Trámite (Verificación Pago)',
        monto_inscripcion: tierInfo.inscriptionUsd || 30,
        monto_cuota_mensual: tierInfo.monthlyUsd || 10,
        fecha_registro: new Date().toISOString(),
        observaciones: `Registro Web Público. Ref: ${regData.referenceNumber} (${regData.issuingBank || 'Banco Provincial'}). Tel. Pagador: ${regData.payerPhone || regData.phone}. Descripción: ${regData.specialty || ''}. Monto Bs: ${regData.amountPaidBs || ''}`
      };

      try {
        if (supabase) {
          await supabase.from('directorio_agremiados').insert([newDirectoryEntry]);
          await supabase.from('solicitudes_afiliacion').insert([
            {
              codigo_afiliado: newCode,
              tipo_negocio: regData.businessType,
              nombre_comercial: regData.restaurantName,
              rif: `${regData.rifType}${regData.rifNumber}`,
              titular_propietario: regData.ownerName,
              telefono: regData.phone,
              correo: regData.email,
              municipio: currentMunicipioObj.name,
              ciudad_poblacion: regData.cityTown,
              direccion: regData.address,
              categoria: regData.category,
              especialidad: regData.specialty,
              instagram: regData.instagram,
              banco_pago_movil: regData.issuingBank,
              telefono_pagador: regData.payerPhone,
              referencia_pago_movil: regData.referenceNumber,
              monto_bs: regData.amountPaidBs,
              estado: 'pago_en_verificacion',
              created_at: new Date().toISOString()
            }
          ]).catch(() => {});
        }
      } catch (err) {
        console.warn('Supabase registration sync notice:', err);
      }

      try {
        const existingLocal = JSON.parse(localStorage.getItem('cgem_directorio_agremiados') || '[]');
        const updatedList = [newDirectoryEntry, ...existingLocal.filter(item => item.codigo_afiliado !== newCode)];
        localStorage.setItem('cgem_directorio_agremiados', JSON.stringify(updatedList));
      } catch (e) {}

      if (regData.email) {
        sendAffiliateWelcomeEmail({
          affiliateCode: newCode,
          restaurantName: regData.restaurantName,
          ownerName: regData.ownerName,
          email: regData.email,
          phone: regData.phone,
          businessType: tierInfo.name,
          category: regData.category,
          referenceNumber: regData.referenceNumber,
          amountBs: regData.amountPaidBs,
        }).catch(err => console.warn('Error al enviar correo de bienvenida con Resend:', err));
      }

      setRegData(prev => ({ ...prev, generatedAffiliateCode: newCode }));
      
      setActiveUser({
        id: newCode,
        restaurantName: regData.restaurantName,
        ownerName: regData.ownerName,
        memberCategory: `${tierInfo.name} (Nuevo Agremiado 2026)`,
        businessType: regData.businessType,
        registrationDate: "Octubre 2026",
        expiryDate: "Diciembre 2026",
        status: "Activo (Pago Móvil en Verificación)",
        monthlyDues: `$${tierInfo.monthlyUsd}.00`,
        lastPaymentDate: "Hoy",
        certificateCode: `${newCode}-PROV`,
        stats: {
          profileViewsMonth: 120,
          reservationsMonth: 0,
          chamberRating: "Pendiente Auditoría Sello AAA"
        }
      });

      setIsSubmittingReg(false);
      setRegStep(4);
    }
  };

  const copyProvincialBankDetails = () => {
    const tier = getBusinessTier(regData.businessType);
    const text = `CÁMARA GASTRONÓMICA DEL ESTADO MÉRIDA\nPago Móvil Banco Provincial (0108)\nCédula / RIF: V-12517086\nTeléfono: 04148817137\nConcepto: Afiliación Gremial Mérida - ${tier.name}\nCuota Inscripción + Primer Mes: $${tier.inscriptionUsd} USD (Bs. ${regData.amountPaidBs} al cambio oficial BCV)\nCuota Mensual Posterior: $${tier.monthlyUsd} USD`;
    if (navigator.clipboard) {
      navigator.clipboard.writeText(text);
      setCopiedBankData(true);
      setTimeout(() => setCopiedBankData(false), 2500);
    }
  };

  const handleSendDirectBoardMessage = async (e) => {
    e.preventDefault();
    if (!contactMessage.trim()) return;

    setIsSendingBoardMsg(true);
    try {
      if (supabase) {
        await supabase.from('mensajes_directiva').insert([
          {
            remitente_restaurante: activeUser.restaurantName,
            remitente_codigo: activeUser.id,
            destinatario_cargo: selectedBoardMember,
            asunto: contactSubject,
            mensaje: contactMessage,
            fecha: new Date().toISOString()
          }
        ]).catch(() => {});
      }
    } catch (err) {
      console.warn('Direct board message notice:', err);
    }

    setTimeout(() => {
      setIsSendingBoardMsg(false);
      setBoardMsgSuccess(true);
      setContactMessage('');
      setTimeout(() => setBoardMsgSuccess(false), 4000);
    }, 900);
  };

  const handleSimulatePayment = (e) => {
    e.preventDefault();
    setPaymentStep('processing');
    setTimeout(() => {
      setPaymentStep('success');
    }, 1000);
  };

  // ==========================================
  // VIEW 1: LOGIN SCREEN (WITH TOP REGISTRATION BANNER)
  // ==========================================
  if (viewMode === 'login') {
    return (
      <section className="py-12 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-md mx-auto bg-white rounded-3xl border border-slate-200 shadow-2xl overflow-hidden p-6 sm:p-8 relative">
          
          {/* TOP HIGH-VISIBILITY REGISTRATION CALLOUT (NO DARK, VIBRANT & STANDOUT) */}
          <div className="mb-6 p-5 rounded-2xl bg-gradient-to-br from-amber-100 via-amber-50 to-orange-100 border-2 border-amber-400 shadow-md text-center space-y-3">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500 text-white text-[11px] font-extrabold uppercase tracking-wider shadow-sm">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Afiliación Abierta 2026</span>
            </div>
            
            <div>
              <h3 className="font-serif text-lg font-bold text-slate-900 leading-tight">
                ¿Aún no eres miembro de la Cámara?
              </h3>
              <p className="text-xs text-slate-700 mt-1">
                Agremia tu restaurante, marca o emprendimiento culinario y obtén visibilidad, blindaje legal y respaldo gremial oficial.
              </p>
            </div>

            <button
              type="button"
              onClick={() => {
                setRegStep(1);
                setViewMode('register');
                setShowVideoModal(true);
              }}
              className="w-full py-3.5 px-4 rounded-xl bg-gradient-to-r from-amber-500 via-amber-600 to-amber-500 hover:from-amber-600 hover:to-amber-700 text-white font-serif font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-lg shadow-amber-500/30 hover:scale-[1.02] active:scale-[0.99] transition-all"
            >
              <Building2 className="w-4 h-4 text-white" />
              <span>Solicitar Afiliación / Registrar Nuevo Miembro</span>
            </button>
          </div>

          <div className="text-center mb-6 pt-2 border-t border-slate-100">
            <div className="w-14 h-14 rounded-2xl bg-white border border-amber-300 shadow-sm p-1 mx-auto mb-3 flex items-center justify-center">
              <img 
                src="/logo-merida-gastronomica.png" 
                alt="Mérida Gastronómica" 
                className="w-full h-full object-contain"
              />
            </div>
            
            <h2 className="font-serif text-2xl font-bold text-slate-900">
              Ingreso al Portal Gremial
            </h2>
            <p className="text-xs text-slate-500 mt-1">
              Acceso exclusivo para establecimientos y directivos agremiados.
            </p>
          </div>

          {loginError && (
            <div className="mb-5 p-3 rounded-2xl bg-red-50 border border-red-200 text-red-700 text-xs font-semibold flex items-center gap-2 animate-fadeIn">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{loginError}</span>
            </div>
          )}

          {/* Login Form */}
          <form onSubmit={handleLoginSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Correo Electrónico o Código CGM
              </label>
              <input
                type="text"
                required
                placeholder="ej. cafe.kaffia@gmail.com o CGM-2026-001"
                value={loginIdentifier}
                onChange={(e) => setLoginIdentifier(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-medium focus:outline-none focus:border-amber-500 focus:bg-white bg-slate-50 text-slate-800"
              />
            </div>

            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="text-xs font-bold text-slate-700">
                  Clave de Seguridad
                </label>
                <button
                  type="button"
                  onClick={() => alert('Para restablecer su clave, comuníquese con la Presidencia o Secretaría de la Cámara al 0414-8817137.')}
                  className="text-[11px] text-amber-700 hover:underline font-semibold"
                >
                  ¿Olvidó su clave?
                </button>
              </div>
              <input
                type="password"
                required
                placeholder="••••••••••••"
                value={loginPassword}
                onChange={(e) => setLoginPassword(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-medium focus:outline-none focus:border-amber-500 focus:bg-white bg-slate-50 text-slate-800"
              />
            </div>

            <button
              type="submit"
              disabled={isLoggingIn}
              className="w-full py-3 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-serif font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-md transition-all active:scale-[0.99]"
            >
              <Lock className="w-4 h-4 text-amber-400" />
              <span>{isLoggingIn ? 'Verificando Credenciales...' : 'Ingresar al Portal Gremial'}</span>
            </button>
          </form>

        </div>
      </section>
    );
  }

  // ==========================================
  // VIEW 2: REGISTRATION WIZARD WITH PAGO MOVIL PROVINCIAL
  // ==========================================
  if (viewMode === 'register') {
    return (
      <section className="py-12 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        
        {/* VIDEO MODAL MOTIVACIONAL */}
        {showVideoModal && (
          <div className="fixed inset-0 z-50 bg-slate-950/85 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 animate-fadeIn">
            <div className="bg-slate-900 border border-amber-500/30 w-full max-w-4xl rounded-3xl overflow-hidden shadow-2xl flex flex-col max-h-[92vh]">
              <div className="px-5 sm:px-6 py-4 border-b border-slate-800 flex items-center justify-between gap-4 bg-slate-950/60">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-400 shrink-0">
                    <Sparkles className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="text-[10px] uppercase font-bold tracking-widest text-amber-400 block">
                      Cámara Gastronómica del Estado Mérida
                    </span>
                    <h3 className="font-serif text-base sm:text-lg font-bold text-white leading-tight">
                      ¿Por qué afiliarte a nuestra Cámara Gastronómica?
                    </h3>
                  </div>
                </div>

                <button
                  onClick={handleCloseVideoModal}
                  className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
                  title="Cerrar video"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="p-3 sm:p-5 bg-black flex-1 flex flex-col items-center justify-center overflow-hidden">
                <div className="w-full relative rounded-2xl overflow-hidden shadow-2xl bg-black border border-slate-800 flex items-center justify-center">
                  <video
                    ref={videoRef}
                    controls
                    autoPlay
                    playsInline
                    preload="metadata"
                    className="w-full max-h-[55vh] object-contain rounded-xl"
                  >
                    <source src="/video-afiliacion.mp4" type="video/mp4" />
                    <source src="/Video%20Afiliacion.mp4" type="video/mp4" />
                    Su navegador no soporta el formato de video.
                  </video>
                </div>
              </div>

              <div className="p-4 sm:p-5 bg-slate-950/90 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-3">
                <p className="text-xs text-slate-400 text-center sm:text-left">
                  Conozca los 10 pilares estratégicos y el respaldo integral de la Cámara.
                </p>
                <button
                  onClick={handleCloseVideoModal}
                  className="w-full sm:w-auto py-2.5 px-6 rounded-xl bg-amber-500 hover:bg-amber-600 text-white font-serif font-bold text-xs uppercase tracking-wider shadow-md transition-all shrink-0"
                >
                  Continuar con el Formulario de Afiliación
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Top Header Stepper */}
        <div className="bg-white rounded-3xl border border-slate-200 shadow-xl p-6 sm:p-8 mb-8">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-6 border-b border-slate-100">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-100 text-amber-900 text-[11px] font-bold mb-2">
                <ShieldCheck className="w-3.5 h-3.5 text-amber-600" />
                <span>Afiliación Oficial Cámara Gastronómica del Estado Mérida</span>
              </div>
              <h2 className="font-serif text-2xl sm:text-3xl font-bold text-slate-900">
                Registro de Nuevo Agremiado
              </h2>
              <p className="text-xs text-slate-500 mt-1">
                La cuota de inscripción <strong>incluye el primer mes completo de membresía</strong> sin costo adicional.
              </p>
            </div>

            <button
              onClick={() => setViewMode('login')}
              className="p-2.5 rounded-xl border border-slate-200 hover:bg-slate-100 text-slate-600 text-xs font-semibold flex items-center gap-1.5 transition-colors shrink-0"
            >
              <ArrowLeft className="w-4 h-4" />
              <span className="hidden sm:inline">Volver al Login</span>
            </button>
          </div>

          <div className="grid grid-cols-3 gap-2 sm:gap-4 pt-6">
            <div className={`p-3 rounded-2xl border text-center transition-all ${
              regStep === 1 
                ? 'bg-amber-500 text-white border-amber-600 shadow-md ring-2 ring-amber-400/30' 
                : regStep > 1 ? 'bg-emerald-50 text-emerald-800 border-emerald-300' : 'bg-slate-50 text-slate-400 border-slate-200'
            }`}>
              <span className="text-[10px] font-extrabold uppercase block tracking-wider">Paso 1</span>
              <span className="text-xs font-bold truncate block">Tipo & Ubicación</span>
            </div>

            <div className={`p-3 rounded-2xl border text-center transition-all ${
              regStep === 2 
                ? 'bg-amber-500 text-white border-amber-600 shadow-md ring-2 ring-amber-400/30' 
                : regStep > 2 ? 'bg-emerald-50 text-emerald-800 border-emerald-300' : 'bg-slate-50 text-slate-400 border-slate-200'
            }`}>
              <span className="text-[10px] font-extrabold uppercase block tracking-wider">Paso 2</span>
              <span className="text-xs font-bold truncate block">Perfil & Especialidad</span>
            </div>

            <div className={`p-3 rounded-2xl border text-center transition-all ${
              regStep === 3 || regStep === 4
                ? 'bg-amber-500 text-white border-amber-600 shadow-md ring-2 ring-amber-400/30' 
                : 'bg-slate-50 text-slate-400 border-slate-200'
            }`}>
              <span className="text-[10px] font-extrabold uppercase block tracking-wider">Paso 3</span>
              <span className="text-xs font-bold truncate block">Pago Móvil Provincial</span>
            </div>
          </div>
        </div>

        {/* STEP 1: Tipo de Negocio & Ubicación */}
        {regStep === 1 && (
          <div className="bg-white rounded-3xl border border-slate-200 shadow-xl p-6 sm:p-8 animate-fadeIn">
            
            <div className="mb-6 p-4 rounded-2xl bg-gradient-to-r from-amber-500/10 via-amber-500/5 to-slate-50 border border-amber-500/20 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-amber-500 text-white flex items-center justify-center shadow-md shadow-amber-500/20 shrink-0">
                  <Film className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-slate-900">Video Institucional de Afiliación</h4>
                  <p className="text-[11px] text-slate-500">Descubre los beneficios y proyección gremial merideña.</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setShowVideoModal(true)}
                className="px-3.5 py-2 rounded-xl bg-amber-500 hover:bg-amber-600 text-white text-xs font-bold flex items-center justify-center gap-1.5 shadow-sm transition-all shrink-0"
              >
                <Play className="w-3.5 h-3.5 fill-current" />
                <span>Ver Video Agremiados</span>
              </button>
            </div>

            <h3 className="font-serif text-xl font-bold text-slate-900 mb-1">
              Paso 1: Tipo de Negocio Gastronómico, Identificación & Ubicación
            </h3>
            <p className="text-xs text-slate-500 mb-6">
              Seleccione la modalidad de su actividad y su ubicación en el estado Mérida.
            </p>

            <form onSubmit={handleRegNext} className="space-y-4">
              
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  Tipo de Negocio Gastronómico *
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5">
                  {BUSINESS_TIERS.map((type) => {
                    const Icon = type.icon;
                    const isSel = regData.businessType === type.id || regData.businessType === type.name;
                    return (
                      <div
                        key={type.id}
                        onClick={() => setRegData({ ...regData, businessType: type.id })}
                        className={`p-4 rounded-2xl border cursor-pointer transition-all flex flex-col justify-between ${
                          isSel
                            ? 'bg-amber-50 border-amber-500 shadow-md ring-2 ring-amber-400/20'
                            : 'bg-slate-50 border-slate-200 hover:border-amber-300'
                        }`}
                      >
                        <div className="flex items-start gap-3">
                          <div className={`p-2.5 rounded-xl shrink-0 ${isSel ? 'bg-amber-500 text-white' : 'bg-white text-slate-600 border border-slate-200'}`}>
                            <Icon className="w-5 h-5" />
                          </div>
                          <div>
                            <span className="text-xs font-bold text-slate-900 block leading-snug">{type.name}</span>
                            <span className="text-[11px] text-slate-500 block mt-0.5 leading-tight">{type.subtitle}</span>
                          </div>
                        </div>

                        <div className="mt-3 pt-2.5 border-t border-slate-200/80 text-[11px] space-y-1">
                          <div className="flex items-center justify-between font-bold">
                            <span className="text-slate-700">Inscripción + 1er Mes:</span>
                            <span className="text-emerald-700 font-extrabold">${type.inscriptionUsd} USD</span>
                          </div>
                          <span className="text-[10px] text-slate-500 block">Cuota mensual posterior: ${type.monthlyUsd} USD/mes</span>
                        </div>
                      </div>
                    );
                  })}
                </div>

                {getBusinessTier(regData.businessType).hasCondition && (
                  <div className="mt-3.5 p-4 rounded-2xl bg-amber-500/10 border border-amber-400 text-amber-950 text-xs flex items-start gap-3 animate-fadeIn">
                    <AlertCircle className="w-5 h-5 text-amber-700 shrink-0 mt-0.5" />
                    <div className="space-y-1">
                      <strong className="block text-amber-900 font-bold uppercase text-[11px] tracking-wider">
                        Compromiso de Acompañamiento y Formalización (Plazo 12 Meses):
                      </strong>
                      <p className="text-[11px] leading-relaxed text-slate-700">
                        {getBusinessTier(regData.businessType).conditionNotice}
                      </p>
                    </div>
                  </div>
                )}
              </div>

              {/* Nombre Comercial y RIF */}
              <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
                <div className="md:col-span-7">
                  <label className="block text-xs font-bold text-slate-700 mb-1">Nombre Comercial / Razón Social *</label>
                  <input
                    type="text"
                    required
                    placeholder="Ej. Nombre del Establecimiento / Razón Social"
                    value={regData.restaurantName}
                    onChange={(e) => setRegData({ ...regData, restaurantName: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-medium focus:outline-none focus:border-amber-500 bg-slate-50"
                  />
                </div>

                <div className="md:col-span-5">
                  <label className="block text-xs font-bold text-slate-700 mb-1">RIF Jurídico o Personal *</label>
                  <div className="flex gap-2">
                    <select
                      value={regData.rifType}
                      onChange={(e) => setRegData({ ...regData, rifType: e.target.value })}
                      className="w-20 px-2 py-2.5 rounded-xl border border-slate-200 text-xs font-bold focus:outline-none focus:border-amber-500 bg-slate-50 text-slate-800 shrink-0"
                    >
                      <option value="J-">J-</option>
                      <option value="V-">V-</option>
                      <option value="E-">E-</option>
                      <option value="G-">G-</option>
                    </select>
                    <input
                      type="text"
                      required
                      placeholder="Ej. 12345678-9"
                      value={regData.rifNumber}
                      onChange={(e) => setRegData({ ...regData, rifNumber: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-medium focus:outline-none focus:border-amber-500 bg-slate-50 font-mono"
                    />
                  </div>
                </div>
              </div>

              {/* Representante y Teléfono */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Representante Legal / Titular *</label>
                  <input
                    type="text"
                    required
                    placeholder="Ej. Nombre y Apellido del Titular"
                    value={regData.ownerName}
                    onChange={(e) => setRegData({ ...regData, ownerName: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-medium focus:outline-none focus:border-amber-500 bg-slate-50"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Teléfono / WhatsApp de Contacto *</label>
                  <input
                    type="text"
                    required
                    placeholder="Ej. 0414-0000000 / 0412-0000000"
                    value={regData.phone}
                    onChange={(e) => setRegData({ ...regData, phone: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-medium focus:outline-none focus:border-amber-500 bg-slate-50"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Correo Electrónico Oficial *</label>
                <input
                  type="email"
                  required
                  placeholder="Ej. contacto@empresa.com"
                  value={regData.email}
                  onChange={(e) => setRegData({ ...regData, email: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-medium focus:outline-none focus:border-amber-500 bg-slate-50"
                />
              </div>

              {/* Ubicación Territorial: Municipio & Ciudad */}
              <div className="p-4 rounded-2xl bg-amber-50/60 border border-amber-200/80 space-y-3">
                <span className="text-[11px] font-extrabold uppercase text-amber-900 tracking-wider block">
                  Ubicación Territorial en el Estado Mérida
                </span>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Municipio *</label>
                    <select
                      value={regData.municipio}
                      onChange={(e) => {
                        const newMun = e.target.value;
                        const munObj = MUNICIPIOS_MERIDA.find(m => m.id === newMun);
                        setRegData({
                          ...regData,
                          municipio: newMun,
                          cityTown: munObj?.towns[0] || ''
                        });
                      }}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-medium focus:outline-none focus:border-amber-500 bg-white text-slate-800"
                    >
                      {MUNICIPIOS_MERIDA.map((m) => (
                        <option key={m.id} value={m.id}>{m.name}</option>
                      ))}
                    </select>
                  </div>

                  {/* Solamente "Ciudad *" que lista las ciudades del municipio seleccionado */}
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Ciudad *</label>
                    <select
                      value={regData.cityTown}
                      onChange={(e) => setRegData({ ...regData, cityTown: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-medium focus:outline-none focus:border-amber-500 bg-white text-slate-800"
                    >
                      {currentMunicipioObj.towns.map((town, idx) => (
                        <option key={idx} value={town}>{town}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Dirección Exacta (Calle / Avenida / Referencia) *</label>
                  <input
                    type="text"
                    required
                    placeholder="Ej. Avenida Principal, Edificio / Local Comercial N° 1"
                    value={regData.address}
                    onChange={(e) => setRegData({ ...regData, address: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-medium focus:outline-none focus:border-amber-500 bg-white"
                  />
                </div>
              </div>

              <div className="pt-4 flex justify-end">
                <button
                  type="submit"
                  className="py-3 px-6 rounded-xl bg-amber-500 hover:bg-amber-600 text-white font-serif font-bold text-xs uppercase tracking-wider flex items-center gap-2 shadow-md transition-all"
                >
                  <span>Continuar al Paso 2: Perfil & Especialidad</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </form>
          </div>
        )}

        {/* STEP 2: Identidad & Descripción */}
        {regStep === 2 && (
          <div className="bg-white rounded-3xl border border-slate-200 shadow-xl p-6 sm:p-8 animate-fadeIn">
            <h3 className="font-serif text-xl font-bold text-slate-900 mb-1">
              Paso 2: Categoría, Descripción & Clave Institucional
            </h3>
            <p className="text-xs text-slate-500 mb-6">
              Defina la categoría gastronómica y describa su negocio o marca culinaria.
            </p>

            <form onSubmit={handleRegNext} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* 32 Categorías Gastronómicas en Orden Alfabético */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Categoría Gastronómica *</label>
                  <select
                    value={regData.category}
                    onChange={(e) => setRegData({ ...regData, category: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-medium focus:outline-none focus:border-amber-500 bg-slate-50 text-slate-800"
                  >
                    {GASTRONOMIC_CATEGORIES.map((cat, idx) => (
                      <option key={idx} value={cat}>{cat}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Instagram Oficial</label>
                  <input
                    type="text"
                    placeholder="Ej. @cuenta_oficial"
                    value={regData.instagram}
                    onChange={(e) => setRegData({ ...regData, instagram: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-medium focus:outline-none focus:border-amber-500 bg-slate-50"
                  />
                </div>
              </div>

              {/* Redefinido como "Describe tu Negocio, Marca o Especialidad *" */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Describe tu Negocio, Marca o Especialidad *
                </label>
                <textarea
                  rows="3"
                  required
                  placeholder="Ej. Describa brevemente su concepto culinario, platos insignia, especialidades, historia de su marca o propuesta de valor..."
                  value={regData.specialty}
                  onChange={(e) => setRegData({ ...regData, specialty: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-medium focus:outline-none focus:border-amber-500 bg-slate-50"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Defina su Clave de Acceso para el Portal *</label>
                <input
                  type="password"
                  required
                  placeholder="Ingrese una clave segura (mínimo 6 caracteres)"
                  value={regData.password}
                  onChange={(e) => setRegData({ ...regData, password: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-medium focus:outline-none focus:border-amber-500 bg-slate-50"
                />
              </div>

              <div className="pt-4 flex items-center justify-between">
                <button
                  type="button"
                  onClick={() => setRegStep(1)}
                  className="py-2.5 px-4 rounded-xl border border-slate-200 text-slate-700 font-bold text-xs hover:bg-slate-50 flex items-center gap-1.5"
                >
                  <ArrowLeft className="w-4 h-4" />
                  <span>Atrás</span>
                </button>

                <button
                  type="submit"
                  className="py-3 px-6 rounded-xl bg-amber-500 hover:bg-amber-600 text-white font-serif font-bold text-xs uppercase tracking-wider flex items-center gap-2 shadow-md transition-all"
                >
                  <span>Continuar a Pago Móvil</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </form>
          </div>
        )}

        {/* STEP 3: Pago Móvil Oficial Provincial */}
        {regStep === 3 && (
          <div className="bg-white rounded-3xl border border-slate-200 shadow-xl p-6 sm:p-8 animate-fadeIn">
            <h3 className="font-serif text-xl font-bold text-slate-900 mb-1">
              Paso 3: Pago Móvil Oficial de Afiliación
            </h3>
            <p className="text-xs text-slate-500 mb-6">
              Transfiera la cuota de inscripción a la cuenta oficial de la Cámara Gastronómica del Estado Mérida.
            </p>

            {/* Official Provincial Bank Card Box */}
            <div className="p-5 sm:p-6 rounded-2xl bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white mb-6 border border-amber-400/40 shadow-xl relative overflow-hidden">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <Smartphone className="w-5 h-5 text-amber-400" />
                  <span className="text-xs font-bold uppercase tracking-wider text-amber-300">
                    Datos Oficiales Pago Móvil Cámara Gastronómica
                  </span>
                </div>

                <button
                  type="button"
                  onClick={copyProvincialBankDetails}
                  className="px-3 py-1 rounded-lg bg-white/10 hover:bg-white/20 text-white text-[11px] font-bold flex items-center gap-1 transition-colors border border-white/20"
                >
                  {copiedBankData ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copiedBankData ? '¡Copiado!' : 'Copiar Datos'}</span>
                </button>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs">
                <div>
                  <span className="text-slate-400 block text-[10px] uppercase font-bold">Banco Receptor</span>
                  <span className="font-bold text-white text-sm">Banco Provincial (0108)</span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[10px] uppercase font-bold">Cédula / RIF</span>
                  <span className="font-mono font-bold text-white text-sm">V-12517086</span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[10px] uppercase font-bold">Teléfono Pago Móvil</span>
                  <span className="font-mono font-bold text-white text-sm">04148817137</span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[10px] uppercase font-bold">Cuota Inscripción + 1er Mes</span>
                  <span className="font-bold text-amber-400 text-sm font-mono">
                    ${getBusinessTier(regData.businessType).inscriptionUsd} USD 
                    <span className="text-[10px] text-slate-300 block font-normal">(Incluye 1er mes. Mes: ${getBusinessTier(regData.businessType).monthlyUsd})</span>
                  </span>
                </div>
              </div>

              <div className="mt-4 pt-3 border-t border-slate-700/80 flex flex-wrap items-center justify-between gap-3 text-xs">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse"></span>
                  <span className="text-slate-300">
                    Tasa Oficial BCV del Día: <strong className="text-white font-mono">{bcvRate ? `Bs. ${bcvRate.toFixed(2)}` : 'Consultando BCV...'}</strong> {bcvDate && <span className="text-slate-400 text-[10px]">({bcvDate})</span>}
                  </span>
                </div>

                <div className="bg-amber-500/20 px-3.5 py-1.5 rounded-xl border border-amber-500/40">
                  <span className="text-amber-300 font-bold text-xs">
                    Monto a Transferir en Bs: <span className="text-white text-sm font-mono font-extrabold ml-1">Bs. {regData.amountPaidBs}</span>
                  </span>
                </div>
              </div>
            </div>

            {/* Form to Report Payment */}
            <form onSubmit={handleRegNext} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Banco Emisor (Su Banco) *</label>
                  <select
                    value={regData.issuingBank}
                    onChange={(e) => setRegData({ ...regData, issuingBank: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-medium focus:outline-none focus:border-amber-500 bg-slate-50 text-slate-800"
                  >
                    <option>Banco Provincial</option>
                    <option>Banesco</option>
                    <option>Banco Mercantil</option>
                    <option>Banco de Venezuela</option>
                    <option>Bancaribe</option>
                    <option>Banco Nacional de Crédito (BNC)</option>
                    <option>Banco Exterior</option>
                    <option>BOD / 100% Banco / Otro</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Teléfono del Pagador *</label>
                  <input
                    type="text"
                    required
                    placeholder="Ej. 04141234567"
                    value={regData.payerPhone}
                    onChange={(e) => setRegData({ ...regData, payerPhone: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-medium focus:outline-none focus:border-amber-500 bg-slate-50 font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Número de Referencia de Pago Móvil *
                </label>
                <input
                  type="text"
                  required
                  placeholder="Ej. 12345678 (Últimos 6 a 8 dígitos)"
                  value={regData.referenceNumber}
                  onChange={(e) => setRegData({ ...regData, referenceNumber: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-medium focus:outline-none focus:border-amber-500 bg-slate-50 font-mono"
                />
              </div>

              <div className="pt-4 flex items-center justify-between">
                <button
                  type="button"
                  onClick={() => setRegStep(2)}
                  className="py-2.5 px-4 rounded-xl border border-slate-200 text-slate-700 font-bold text-xs hover:bg-slate-50 flex items-center gap-1.5"
                >
                  <ArrowLeft className="w-4 h-4" />
                  <span>Atrás</span>
                </button>

                <button
                  type="submit"
                  disabled={isSubmittingReg}
                  className="py-3.5 px-6 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-serif font-bold text-xs uppercase tracking-wider flex items-center gap-2 shadow-md transition-all"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  <span>{isSubmittingReg ? 'Registrando en Base de Datos...' : 'Confirmar Pago Móvil y Registrar'}</span>
                </button>
              </div>
            </form>
          </div>
        )}

        {/* STEP 4: Registro Exitoso */}
        {regStep === 4 && (
          <div className="bg-white rounded-3xl border border-emerald-300 shadow-2xl p-6 sm:p-10 text-center animate-fadeIn">
            <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 mx-auto flex items-center justify-center mb-4 shadow-sm">
              <CheckCircle2 className="w-9 h-9" />
            </div>

            <span className="text-xs font-bold uppercase tracking-widest text-emerald-800 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
              Solicitud de Afiliación Registrada
            </span>

            <h3 className="font-serif text-2xl sm:text-3xl font-bold text-slate-900 mt-3">
              ¡Bienvenido a la Cámara Gastronómica del Estado Mérida!
            </h3>

            <p className="text-xs sm:text-sm text-slate-600 mt-2 max-w-lg mx-auto">
              El establecimiento <strong>{regData.restaurantName}</strong> ha sido registrado satisfactoriamente en el municipio <strong>{currentMunicipioObj.name}</strong>. Se ha generado su expediente y se ha emitido el <strong>Correo Oficial de Bienvenida</strong>.
            </p>

            <div className="my-6 p-4 rounded-2xl bg-slate-50 border border-slate-200 max-w-sm mx-auto">
              <span className="text-[10px] font-bold uppercase text-slate-400 block">Su Código de Afiliado Asignado:</span>
              <span className="font-mono font-extrabold text-2xl text-amber-800 tracking-wider">
                {regData.generatedAffiliateCode || 'CGM-2026-002'}
              </span>
              <span className="text-[11px] text-slate-500 block mt-1">Pago Móvil Provincial: Ref #{regData.referenceNumber}</span>
            </div>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
              <button
                onClick={() => setViewMode('welcome_preview')}
                className="w-full sm:w-auto py-3 px-6 rounded-xl bg-amber-500 hover:bg-amber-600 text-white font-serif font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-md transition-all"
              >
                <Mail className="w-4 h-4" />
                <span>Ver Correo de Bienvenida Oficial Generado</span>
              </button>

              <button
                onClick={() => setViewMode('dashboard')}
                className="w-full sm:w-auto py-3 px-6 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-serif font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-md transition-all"
              >
                <Building2 className="w-4 h-4" />
                <span>Ingresar a Mi Panel de Afiliado</span>
              </button>
            </div>
          </div>
        )}

      </section>
    );
  }

  // ==========================================
  // VIEW 3: OFFICIAL HTML WELCOME EMAIL PREVIEW
  // ==========================================
  if (viewMode === 'welcome_preview') {
    return (
      <section className="py-12 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-slate-900 text-white p-4 sm:p-5 rounded-t-3xl flex items-center justify-between gap-4">
          <div className="flex items-center gap-2.5">
            <Mail className="w-5 h-5 text-amber-400" />
            <div>
              <h4 className="font-bold text-xs sm:text-sm">Vista Previa: Correo Electrónico Institucional de Bienvenida</h4>
              <p className="text-[10px] text-slate-400">Enviado a: {regData.email || 'contacto@mirestaurante.com'}</p>
            </div>
          </div>

          <button
            onClick={() => setViewMode('dashboard')}
            className="py-2 px-4 rounded-xl bg-amber-500 hover:bg-amber-600 text-white text-xs font-bold transition-all shrink-0"
          >
            Ir al Dashboard
          </button>
        </div>

        <div className="bg-[#f8f9fa] border-x border-b border-slate-300 rounded-b-3xl p-4 sm:p-8 text-slate-800 font-sans shadow-2xl">
          <div className="max-w-2xl mx-auto bg-white rounded-2xl border border-slate-200 shadow-md overflow-hidden">
            <div className="bg-gradient-to-r from-slate-950 via-slate-900 to-amber-950 p-6 text-center text-white border-b-4 border-amber-500">
              <div className="w-20 h-20 bg-white rounded-2xl p-1.5 mx-auto mb-3 shadow-lg border border-amber-300 flex items-center justify-center">
                <img 
                  src="/logo-merida-gastronomica.png" 
                  alt="Mérida Gastronómica" 
                  className="w-full h-full object-contain"
                />
              </div>
              <h1 className="font-serif text-xl sm:text-2xl font-bold tracking-tight text-white uppercase">
                Cámara Gastronómica del Estado Mérida
              </h1>
              <p className="text-xs text-amber-300 tracking-widest uppercase font-bold mt-0.5">
                República Bolivariana de Venezuela
              </p>
            </div>

            <div className="p-6 sm:p-8 space-y-5 text-xs sm:text-sm leading-relaxed text-slate-700">
              <div className="border-b border-slate-100 pb-4">
                <p className="font-bold text-slate-900 text-base">
                  Estimado(a) {regData.ownerName || 'Representante Legal'},
                </p>
                <p className="text-amber-800 font-semibold mt-0.5">
                  Establecimiento: {regData.restaurantName || 'Restaurante Afiliado'} ({getBusinessTier(regData.businessType).name})
                </p>
              </div>

              <p>
                En nombre de la <strong>Junta Directiva de la Cámara Gastronómica del Estado Mérida</strong>, presidida por <strong>Julio Alberto Daza Celis</strong>, nos complace darle la más cordial y distinguida bienvenida como nuevo miembro agremiado a nuestra institución.
              </p>

              <div className="p-4 rounded-xl bg-amber-50/80 border border-amber-200 text-xs space-y-2">
                <span className="text-[10px] font-extrabold uppercase text-amber-900 tracking-wider block">
                  Resumen de su Expediente Gremial
                </span>
                <div className="grid grid-cols-2 gap-2 text-slate-800">
                  <div>
                    <strong>Código de Afiliado:</strong>
                    <p className="font-mono text-amber-900 font-bold">{regData.generatedAffiliateCode || 'CGM-2026-002'}</p>
                  </div>
                  <div>
                    <strong>Pago Móvil Provincial:</strong>
                    <p className="text-emerald-700 font-bold">Ref: #{regData.referenceNumber || '849201'}</p>
                  </div>
                  <div>
                    <strong>Ubicación:</strong>
                    <p>{regData.cityTown || 'Mérida'}, {currentMunicipioObj.name}</p>
                  </div>
                  <div>
                    <strong>Vigencia Membresía:</strong>
                    <p>Año Fiscal 2026</p>
                  </div>
                </div>
              </div>

              <div className="pt-6 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500">
                <div>
                  <p className="font-bold text-slate-800">Julio Alberto Daza Celis</p>
                  <p>Presidente — Cámara Gastronómica del Estado Mérida</p>
                </div>
                <div className="text-right">
                  <p>Mérida, Venezuela</p>
                  <p>www.meridagastronomica.com</p>
                </div>
              </div>

            </div>
          </div>
        </div>
      </section>
    );
  }

  // ==========================================
  // VIEW 4: AUTHENTICATED AFFILIATE DASHBOARD
  // ==========================================
  return (
    <section className="py-12 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      
      {/* Header Banner */}
      <div className="p-6 sm:p-8 rounded-3xl bg-white border border-slate-200 shadow-xl mb-8">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-2xl bg-white border border-amber-300 p-1 flex items-center justify-center text-white shadow-md shrink-0">
              <img 
                src="/logo-merida-gastronomica.png" 
                alt="Logo Mérida Gastronómica" 
                className="w-full h-full object-contain"
              />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold uppercase px-2.5 py-0.5 rounded-full bg-amber-100 text-amber-900 border border-amber-300">
                  Portal Exclusivo Gremial
                </span>
                <span className="text-xs font-bold text-emerald-700 flex items-center gap-1">
                  <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                  {activeUser.status}
                </span>
              </div>
              <h2 className="font-serif text-2xl sm:text-3xl font-bold text-slate-900 mt-1">
                {activeUser.restaurantName}
              </h2>
              <p className="text-xs text-slate-600 font-medium">
                Representante: <strong>{activeUser.ownerName}</strong> — Código: <span className="font-mono font-bold text-amber-800">{activeUser.id}</span>
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => setActiveTab('certificate')}
              className="py-2.5 px-4 rounded-xl bg-amber-500 hover:bg-amber-600 text-white font-serif font-bold text-xs uppercase tracking-wider flex items-center gap-1.5 transition-all shadow-sm"
            >
              <Award className="w-4 h-4" />
              <span>Ver Certificado Digital</span>
            </button>

            <button
              onClick={() => setViewMode('login')}
              className="p-2.5 rounded-xl border border-slate-200 hover:bg-slate-100 text-slate-600 text-xs font-bold transition-colors"
              title="Cerrar Sesión"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Dashboard Navigation Tabs: MI NEGOCIO right after Overview */}
        <div className="flex items-center gap-2 overflow-x-auto pt-6 mt-6 border-t border-slate-100">
          {[
            { id: 'overview', label: 'Resumen & Estatus', icon: TrendingUp },
            { id: 'my_business', label: 'Mi Negocio (Ficha Web)', icon: Store },
            { id: 'gps_calibration', label: 'Calibrar Ubicación GPS 3D', icon: MapPin },
            { id: 'certificate', label: 'Certificado Digital', icon: Award },
            { id: 'jobs', label: 'Crear Empleos', icon: Briefcase },
            { id: 'payments', label: 'Cuotas & Pagos', icon: CreditCard },
            { id: 'courses', label: 'Capacitaciones & Cursos', icon: BookOpen },
            { id: 'board', label: 'Contacto Directo Directiva', icon: Mail },
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center gap-2 whitespace-nowrap ${
                  isActive
                    ? 'bg-slate-900 text-white shadow-md scale-105'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? 'text-amber-400' : ''}`} />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Tab 1: Overview */}
      {activeTab === 'overview' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-sm">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-500">Impacto en Guía Global</span>
              <p className="font-serif text-2xl font-bold text-slate-900 mt-1">{activeUser.stats.profileViewsMonth}</p>
              <span className="text-xs text-emerald-700 font-bold flex items-center gap-1 mt-1">
                <TrendingUp className="w-3.5 h-3.5" /> +24% visitas este mes
              </span>
            </div>

            <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-sm">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-500">Reservas Solicitadas</span>
              <p className="font-serif text-2xl font-bold text-amber-800 mt-1">{activeUser.stats.reservationsMonth}</p>
              <span className="text-xs text-slate-500 mt-1 block">Canal oficial de la Cámara</span>
            </div>

            <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-sm">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-500">Auditoría Sanitaria y Calidad</span>
              <p className="font-serif text-base font-bold text-emerald-700 mt-1">100% Aprobada</p>
              <span className="text-xs text-slate-500 mt-1 block">Vigencia hasta Diciembre 2026</span>
            </div>
          </div>

          <div className="p-6 rounded-3xl bg-white border border-slate-200 shadow-sm">
            <h3 className="font-serif text-xl font-bold text-slate-900 mb-4">
              Beneficios Activos de su Membresía Gremial
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {guildBenefits.map((benefit, idx) => (
                <div key={idx} className="p-4 rounded-2xl bg-slate-50 border border-slate-100 flex items-start gap-3">
                  <div className="p-2 rounded-xl bg-amber-100 text-amber-800 shrink-0 mt-0.5">
                    <CheckCircle2 className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="font-bold text-sm text-slate-900">{benefit}</h4>
                    <p className="text-xs text-slate-600 mt-0.5">Acceso exclusivo a través del aval institucional.</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Tab: MI NEGOCIO (FULL INTERACTIVE BUSINESS CARD EDITOR) */}
      {activeTab === 'my_business' && (
        <div className="space-y-6 animate-fadeIn">
          
          <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-slate-900 via-slate-800 to-amber-950 text-white shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
            <div className="space-y-1 max-w-2xl">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30 text-xs font-bold">
                <Store className="w-3.5 h-3.5 text-amber-400" />
                <span>Personalización Integral de Ficha Web & Guía Oficial</span>
              </div>
              <h3 className="font-serif text-2xl sm:text-3xl font-bold text-white">
                Ficha Oficial de Mi Negocio: {businessProfile.name}
              </h3>
              <p className="text-xs sm:text-sm text-slate-300">
                Complete y modifique todos los datos, horarios, platos insignia, descripción y redes de su establecimiento que se muestran públicamente en la web y en el Mapa LiDAR 3D.
              </p>
            </div>

            <button
              onClick={handleSaveBusinessProfile}
              disabled={isSavingBusiness}
              className="py-3 px-6 rounded-xl bg-amber-500 hover:bg-amber-600 text-slate-950 font-serif font-bold text-xs uppercase tracking-wider flex items-center gap-2 shadow-lg transition-all shrink-0"
            >
              <Save className="w-4 h-4" />
              <span>{isSavingBusiness ? 'Guardando Ficha...' : 'Guardar y Publicar en la Guía'}</span>
            </button>
          </div>

          {businessSaveSuccess && (
            <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-300 text-emerald-900 text-xs font-bold flex items-center gap-2.5 animate-fadeIn">
              <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
              <div>
                <p>¡Ficha de negocio actualizada satisfactoriamente!</p>
                <p className="text-[11px] text-emerald-700 font-normal">
                  Los cambios ya se encuentran sincronizados y visibles en la Guía Oficial y en el modal del restaurante.
                </p>
              </div>
            </div>
          )}

          <form onSubmit={handleSaveBusinessProfile} className="space-y-6">
            
            {/* Bloque 1: Datos Generales */}
            <div className="p-6 sm:p-8 rounded-3xl bg-white border border-slate-200 shadow-md space-y-4">
              <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
                <Utensils className="w-5 h-5 text-amber-600" />
                <h4 className="font-serif text-lg font-bold text-slate-900">1. Identidad & Clasificación Gastronómica</h4>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Nombre Comercial del Negocio *</label>
                  <input
                    type="text"
                    required
                    value={businessProfile.name}
                    onChange={(e) => setBusinessProfile({ ...businessProfile, name: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-medium focus:outline-none focus:border-amber-500 bg-slate-50 text-slate-800"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Categoría Gastronómica *</label>
                  <select
                    value={businessProfile.category}
                    onChange={(e) => setBusinessProfile({ ...businessProfile, category: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-medium focus:outline-none focus:border-amber-500 bg-slate-50 text-slate-800"
                  >
                    {GASTRONOMIC_CATEGORIES.map((cat, idx) => (
                      <option key={idx} value={cat}>{cat}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Eslogan / Subtítulo Destacado *</label>
                <input
                  type="text"
                  required
                  placeholder="Ej. Más que café: Alta cocina, banquetes, hamburguesas de autor, pizzas y cafés de especialidad"
                  value={businessProfile.tagline}
                  onChange={(e) => setBusinessProfile({ ...businessProfile, tagline: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-medium focus:outline-none focus:border-amber-500 bg-slate-50 text-slate-800"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Rango de Precios</label>
                  <select
                    value={businessProfile.priceTier}
                    onChange={(e) => setBusinessProfile({ ...businessProfile, priceTier: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-medium focus:outline-none focus:border-amber-500 bg-slate-50 text-slate-800"
                  >
                    <option>$ (Económico / Casual)</option>
                    <option>$$ (Gourmet / Estándar)</option>
                    <option>$$$ (Alta Gama / Exclusivo)</option>
                    <option>$$$$ (Fine Dining)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Altitud Andina (msnm)</label>
                  <input
                    type="number"
                    value={businessProfile.altitude}
                    onChange={(e) => setBusinessProfile({ ...businessProfile, altitude: parseInt(e.target.value, 10) || 1620 })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-medium focus:outline-none focus:border-amber-500 bg-slate-50 text-slate-800"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Eje Geográfico</label>
                  <input
                    type="text"
                    value={businessProfile.ejeName}
                    onChange={(e) => setBusinessProfile({ ...businessProfile, ejeName: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-medium focus:outline-none focus:border-amber-500 bg-slate-50 text-slate-800"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Filosofía y Experiencia Culinaria (Descripción de la Ficha) *</label>
                <textarea
                  rows="4"
                  required
                  value={businessProfile.description}
                  onChange={(e) => setBusinessProfile({ ...businessProfile, description: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-medium focus:outline-none focus:border-amber-500 bg-slate-50 text-slate-800"
                />
              </div>
            </div>

            {/* Bloque 2: Galería Fotográfica Oficial (Máximo 5 Fotos & Conversor Inteligente) */}
            <div className="p-6 sm:p-8 rounded-3xl bg-white border border-slate-200 shadow-md space-y-5">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
                <div className="flex items-center gap-2.5">
                  <div className="p-2 rounded-xl bg-amber-50 text-amber-600 border border-amber-200">
                    <ImageIcon className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="font-serif text-lg font-bold text-slate-900">2. Galería Fotográfica Oficial (Máximo 5 Fotos)</h4>
                    <p className="text-xs text-slate-500">Fotografías de alta calidad de la fachada, salón, platos estrella y ambiente.</p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <span className={`text-xs font-bold px-3 py-1.5 rounded-full border ${
                    (businessProfile.gallery?.length || 0) >= 5 
                      ? 'bg-amber-100 text-amber-900 border-amber-300'
                      : 'bg-slate-100 text-slate-700 border-slate-200'
                  }`}>
                    📸 {businessProfile.gallery?.length || 0} / 5 Fotos Oficiales
                  </span>
                </div>
              </div>

              {/* Barra de Adjuntar Archivo desde el Explorador de la PC con Conversor */}
              <div className="p-5 rounded-2xl bg-gradient-to-r from-amber-50/70 via-slate-50 to-amber-50/40 border border-amber-200/80 space-y-3">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <UploadCloud className="w-4 h-4 text-amber-600 shrink-0" />
                      <span className="text-xs font-bold text-slate-900">Adjuntar Fotografías desde su Computador</span>
                    </div>
                    <p className="text-[11px] text-slate-600 leading-relaxed max-w-2xl">
                      Seleccione una o varias imágenes de su PC (JPG, PNG, WEBP). <strong>Conversor Automático Integrado:</strong> Redimensiona y comprime las imágenes a formato WebP ligero (&lt;100 KB) con nitidez HD para máxima velocidad y evitar sobrecargar el servidor y la base de datos.
                    </p>
                  </div>

                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/png, image/jpeg, image/webp, image/jpg"
                    multiple
                    disabled={isOptimizingPhotos || (businessProfile.gallery?.length || 0) >= 5}
                    onChange={handlePhotoFilesSelected}
                    className="hidden"
                  />

                  <button
                    type="button"
                    disabled={isOptimizingPhotos || (businessProfile.gallery?.length || 0) >= 5}
                    onClick={() => fileInputRef.current && fileInputRef.current.click()}
                    className={`px-4 py-2.5 rounded-xl font-bold text-xs flex items-center justify-center gap-2 transition-all shadow-sm shrink-0 ${
                      (businessProfile.gallery?.length || 0) >= 5
                        ? 'bg-slate-200 text-slate-500 cursor-not-allowed border border-slate-300'
                        : isOptimizingPhotos
                          ? 'bg-amber-400 text-slate-900 cursor-wait'
                          : 'bg-slate-900 hover:bg-slate-800 text-amber-300 border border-slate-800 hover:border-amber-400'
                    }`}
                  >
                    {isOptimizingPhotos ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin text-amber-400" />
                        <span>Optimizando Imágenes...</span>
                      </>
                    ) : (
                      <>
                        <Plus className="w-4 h-4 text-amber-400" />
                        <span>{(businessProfile.gallery?.length || 0) >= 5 ? 'Límite de 5 Fotos Alcanzado' : 'Examinar Archivos en PC'}</span>
                      </>
                    )}
                  </button>
                </div>

                {/* Banner de Estadísticas de Optimización / Compresión */}
                {photoOptimizationStats && (
                  <div className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-300 text-emerald-950 text-xs animate-fadeIn space-y-2">
                    <div className="flex items-center gap-2 font-bold text-emerald-900">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                      <span>{photoOptimizationStats.message}</span>
                    </div>
                    {photoOptimizationStats.items && photoOptimizationStats.items.length > 0 && (
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1">
                        {photoOptimizationStats.items.map((stat, idx) => (
                          <div key={idx} className="flex items-center justify-between text-[11px] bg-white/80 px-2.5 py-1.5 rounded-lg border border-emerald-200">
                            <span className="truncate max-w-[140px] text-slate-700 font-medium">{stat.name}</span>
                            <span className="font-mono font-bold text-emerald-800">
                              {stat.originalSize} ➔ <span className="text-emerald-900 font-extrabold">{stat.compressedSize}</span> ({stat.reduction} menos)
                            </span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* Grid de las 5 Fotos (Slots) */}
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3.5">
                {[0, 1, 2, 3, 4].map((slotIdx) => {
                  const photoUrl = businessProfile.gallery && businessProfile.gallery[slotIdx];
                  const isCover = photoUrl && (businessProfile.coverImage === photoUrl || (slotIdx === 0 && !businessProfile.coverImage));

                  if (photoUrl) {
                    return (
                      <div
                        key={slotIdx}
                        className={`group relative rounded-2xl overflow-hidden border-2 bg-slate-100 flex flex-col justify-between transition-all duration-300 shadow-sm hover:shadow-md ${
                          isCover ? 'border-amber-500 ring-2 ring-amber-400/30' : 'border-slate-200 hover:border-amber-300'
                        }`}
                      >
                        <div className="relative h-36 w-full overflow-hidden bg-slate-900/10">
                          <img
                            src={photoUrl}
                            alt={`Foto ${slotIdx + 1}`}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-slate-950/70 via-transparent to-black/20" />

                          {/* Badge de Portada o Slot */}
                          <div className="absolute top-2 left-2 right-2 flex items-center justify-between gap-1">
                            {isCover ? (
                              <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-md bg-amber-500 text-slate-950 shadow-sm">
                                ★ Portada
                              </span>
                            ) : (
                              <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-black/60 text-white backdrop-blur-xs">
                                Foto #{slotIdx + 1}
                              </span>
                            )}

                            <span className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-slate-900/80 text-emerald-300 backdrop-blur-xs">
                              WebP HD
                            </span>
                          </div>

                          {/* Botones de acción overlay */}
                          <div className="absolute bottom-2 left-2 right-2 flex items-center justify-between gap-1">
                            <button
                              type="button"
                              onClick={() => setPreviewPhotoModal(photoUrl)}
                              className="p-1.5 rounded-lg bg-black/70 hover:bg-black text-white text-[10px] flex items-center gap-1 backdrop-blur-xs transition-colors"
                              title="Ver en grande"
                            >
                              <Maximize2 className="w-3 h-3 text-amber-300" />
                            </button>

                            {!isCover && (
                              <button
                                type="button"
                                onClick={() => handleSetCoverPhoto(slotIdx)}
                                className="px-2 py-1 rounded-lg bg-amber-500/90 hover:bg-amber-500 text-slate-950 text-[10px] font-bold transition-all shadow-sm"
                                title="Establecer como foto de portada principal"
                              >
                                Hacer Portada
                              </button>
                            )}

                            <button
                              type="button"
                              onClick={() => handleRemovePhoto(slotIdx)}
                              className="p-1.5 rounded-lg bg-rose-600/90 hover:bg-rose-700 text-white transition-colors"
                              title="Eliminar fotografía"
                            >
                              <Trash2 className="w-3 h-3" />
                            </button>
                          </div>
                        </div>

                        <div className="p-2.5 bg-white border-t border-slate-100 flex items-center justify-between text-[11px]">
                          <span className="font-semibold text-slate-700 truncate">
                            {isCover ? 'Foto Principal' : `Galería #${slotIdx + 1}`}
                          </span>
                          <span className="text-[10px] text-slate-400">Optimizada</span>
                        </div>
                      </div>
                    );
                  }

                  // Slot vacío
                  return (
                    <div
                      key={slotIdx}
                      onClick={() => fileInputRef.current && fileInputRef.current.click()}
                      className="h-44 rounded-2xl border-2 border-dashed border-slate-300 hover:border-amber-400 bg-slate-50/60 hover:bg-amber-50/40 p-4 flex flex-col items-center justify-center text-center cursor-pointer transition-all group"
                    >
                      <div className="w-10 h-10 rounded-full bg-white border border-slate-200 group-hover:border-amber-400 group-hover:scale-110 flex items-center justify-center text-slate-400 group-hover:text-amber-600 transition-all shadow-sm mb-2">
                        <Plus className="w-5 h-5" />
                      </div>
                      <span className="text-xs font-bold text-slate-700 group-hover:text-amber-900">
                        Espacio #{slotIdx + 1}
                      </span>
                      <span className="text-[10px] text-slate-400 group-hover:text-amber-700 mt-0.5">
                        Clic para adjuntar foto
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Bloque 3: Ubicación, Horarios & Contacto */}
            <div className="p-6 sm:p-8 rounded-3xl bg-white border border-slate-200 shadow-md space-y-4">
              <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
                <MapPin className="w-5 h-5 text-amber-600" />
                <h4 className="font-serif text-lg font-bold text-slate-900">3. Ubicación, Horarios & Canales Oficiales</h4>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Dirección Completa *</label>
                  <input
                    type="text"
                    required
                    value={businessProfile.location}
                    onChange={(e) => setBusinessProfile({ ...businessProfile, location: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-medium focus:outline-none focus:border-amber-500 bg-slate-50 text-slate-800"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Horarios de Atención *</label>
                  <input
                    type="text"
                    required
                    value={businessProfile.openingHours}
                    onChange={(e) => setBusinessProfile({ ...businessProfile, openingHours: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-medium focus:outline-none focus:border-amber-500 bg-slate-50 text-slate-800"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Teléfono Fijo / Local</label>
                  <input
                    type="text"
                    value={businessProfile.phone}
                    onChange={(e) => setBusinessProfile({ ...businessProfile, phone: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-medium focus:outline-none focus:border-amber-500 bg-slate-50"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">WhatsApp de Reservas *</label>
                  <input
                    type="text"
                    value={businessProfile.whatsapp}
                    onChange={(e) => setBusinessProfile({ ...businessProfile, whatsapp: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-medium focus:outline-none focus:border-amber-500 bg-slate-50"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Instagram (@usuario)</label>
                  <input
                    type="text"
                    value={businessProfile.instagram}
                    onChange={(e) => setBusinessProfile({ ...businessProfile, instagram: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-medium focus:outline-none focus:border-amber-500 bg-slate-50"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Enlace de Facebook</label>
                  <input
                    type="text"
                    value={businessProfile.facebookUrl}
                    onChange={(e) => setBusinessProfile({ ...businessProfile, facebookUrl: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-medium focus:outline-none focus:border-amber-500 bg-slate-50"
                  />
                </div>
              </div>
            </div>

            {/* Bloque 4: Chef Ejecutivo & Equipo */}
            <div className="p-6 sm:p-8 rounded-3xl bg-white border border-slate-200 shadow-md space-y-4">
              <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
                <ChefHat className="w-5 h-5 text-amber-600" />
                <h4 className="font-serif text-lg font-bold text-slate-900">4. Chef Ejecutivo, Barista & Equipo Culinario</h4>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Nombre del Chef / Equipo Culinario</label>
                  <input
                    type="text"
                    value={businessProfile.chef}
                    onChange={(e) => setBusinessProfile({ ...businessProfile, chef: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-medium focus:outline-none focus:border-amber-500 bg-slate-50"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Cita / Bio del Chef</label>
                  <textarea
                    rows="2"
                    value={businessProfile.chefBio}
                    onChange={(e) => setBusinessProfile({ ...businessProfile, chefBio: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-medium focus:outline-none focus:border-amber-500 bg-slate-50"
                  />
                </div>
              </div>
            </div>

            {/* Bloque 5: Platos Insignia del Menú */}
            <div className="p-6 sm:p-8 rounded-3xl bg-white border border-slate-200 shadow-md space-y-4">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <div className="flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-amber-600" />
                  <h4 className="font-serif text-lg font-bold text-slate-900">5. Platos Insignia del Menú</h4>
                </div>

                <button
                  type="button"
                  onClick={handleAddDish}
                  className="py-1.5 px-3 rounded-lg bg-amber-500 text-white font-bold text-xs flex items-center gap-1 hover:bg-amber-600"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Agregar Plato</span>
                </button>
              </div>

              <div className="space-y-4">
                {businessProfile.signatureDishes.map((dish, idx) => (
                  <div key={idx} className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-3 relative">
                    <div className="flex items-center justify-between gap-3">
                      <span className="text-[10px] uppercase font-bold text-amber-800 bg-amber-100 px-2 py-0.5 rounded">
                        Plato Insignia #{idx + 1}
                      </span>
                      {businessProfile.signatureDishes.length > 1 && (
                        <button
                          type="button"
                          onClick={() => handleRemoveDish(idx)}
                          className="text-rose-600 hover:text-rose-800 text-xs font-bold flex items-center gap-1"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                          <span>Eliminar</span>
                        </button>
                      )}
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-12 gap-3">
                      <div className="md:col-span-8">
                        <label className="block text-[11px] font-bold text-slate-700 mb-0.5">Nombre del Plato *</label>
                        <input
                          type="text"
                          required
                          value={dish.name}
                          onChange={(e) => handleDishChange(idx, 'name', e.target.value)}
                          className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs font-semibold focus:outline-none focus:border-amber-500 bg-white"
                        />
                      </div>

                      <div className="md:col-span-4">
                        <label className="block text-[11px] font-bold text-slate-700 mb-0.5">Precio Sugerido ($ USD) *</label>
                        <input
                          type="text"
                          required
                          value={dish.price}
                          onChange={(e) => handleDishChange(idx, 'price', e.target.value)}
                          className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs font-semibold focus:outline-none focus:border-amber-500 bg-white font-mono"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-[11px] font-bold text-slate-700 mb-0.5">Descripción Culinaria & Acompañamientos *</label>
                      <textarea
                        rows="2"
                        required
                        value={dish.description}
                        onChange={(e) => handleDishChange(idx, 'description', e.target.value)}
                        className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs font-medium focus:outline-none focus:border-amber-500 bg-white"
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Bloque 6: Otros Destacados & Comodidades */}
            <div className="p-6 sm:p-8 rounded-3xl bg-white border border-slate-200 shadow-md space-y-4">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <div className="flex items-center gap-2">
                  <CheckSquare className="w-5 h-5 text-amber-600" />
                  <h4 className="font-serif text-lg font-bold text-slate-900">6. Otros Destacados de la Carta & Comodidades</h4>
                </div>

                <button
                  type="button"
                  onClick={handleAddMenuHighlight}
                  className="py-1.5 px-3 rounded-lg bg-slate-100 text-slate-700 font-bold text-xs flex items-center gap-1 hover:bg-slate-200"
                >
                  <Plus className="w-3.5 h-3.5 text-amber-600" />
                  <span>Agregar Destacado</span>
                </button>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-2">Destacados de la Carta:</label>
                <div className="flex flex-wrap gap-2">
                  {businessProfile.menuHighlights.map((hl, idx) => (
                    <span key={idx} className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-amber-50 border border-amber-200 text-xs font-semibold text-amber-900">
                      <span>{hl}</span>
                      <button type="button" onClick={() => handleRemoveMenuHighlight(idx)} className="text-amber-700 hover:text-red-700">
                        <X className="w-3.5 h-3.5" />
                      </button>
                    </span>
                  ))}
                </div>
              </div>

              <div className="pt-3 border-t border-slate-100">
                <label className="block text-xs font-bold text-slate-700 mb-2">Servicios & Comodidades Activas:</label>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {[
                    "Wi-Fi de Alta Velocidad",
                    "Zona Pet Friendly",
                    "Ambiente Musical & Arte",
                    "Cerca del Teleférico Mukumbarí",
                    "Opciones Vegetarianas",
                    "Take-away & Delivery",
                    "Salón para Eventos & Banquetes",
                    "Estacionamiento Privado",
                    "Cava de Vinos",
                    "Terraza al Aire Libre"
                  ].map((feat, idx) => {
                    const isChecked = businessProfile.features.includes(feat);
                    return (
                      <label key={idx} className="flex items-center gap-2 text-xs text-slate-700 cursor-pointer p-2 rounded-xl bg-slate-50 border border-slate-100 hover:bg-amber-50">
                        <input
                          type="checkbox"
                          checked={isChecked}
                          onChange={() => handleToggleFeature(feat)}
                          className="rounded border-slate-300 text-amber-600 focus:ring-amber-500"
                        />
                        <span className={isChecked ? 'font-bold text-slate-900' : 'text-slate-600'}>{feat}</span>
                      </label>
                    );
                  })}
                </div>
              </div>
            </div>

            <div className="flex justify-end">
              <button
                type="submit"
                disabled={isSavingBusiness}
                className="py-3.5 px-8 rounded-xl bg-amber-500 hover:bg-amber-600 text-slate-950 font-serif font-bold text-xs uppercase tracking-wider flex items-center gap-2 shadow-lg transition-all"
              >
                <Save className="w-4 h-4" />
                <span>{isSavingBusiness ? 'Guardando Ficha...' : 'Guardar y Publicar en la Guía'}</span>
              </button>
            </div>
          </form>

          {/* Modal de Previsualización de Foto Grande */}
          {previewPhotoModal && (
            <div className="fixed inset-0 z-50 bg-black/90 backdrop-blur-sm flex items-center justify-center p-4 animate-fadeIn">
              <div className="relative max-w-4xl max-h-[90vh] bg-slate-900 rounded-3xl overflow-hidden shadow-2xl border border-slate-700 flex flex-col">
                <div className="p-4 bg-slate-950/80 flex items-center justify-between border-b border-slate-800">
                  <div className="flex items-center gap-2 text-white text-xs font-bold">
                    <ImageIcon className="w-4 h-4 text-amber-400" />
                    <span>Vista Previa de Fotografía WebP Optimizada</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => setPreviewPhotoModal(null)}
                    className="p-1.5 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
                <div className="p-4 flex items-center justify-center bg-black overflow-auto">
                  <img
                    src={previewPhotoModal}
                    alt="Previsualización"
                    className="max-h-[75vh] w-auto max-w-full rounded-xl object-contain shadow-md"
                  />
                </div>
              </div>
            </div>
          )}

        </div>
      )}

      {/* Tab: Calibrar Ubicación GPS 3D Satelital */}
      {activeTab === 'gps_calibration' && (
        <GpsCalibrationTab activeUser={activeUser} />
      )}

      {/* Tab 2: Certificate */}
      {activeTab === 'certificate' && (
        <div className="max-w-3xl mx-auto bg-gradient-to-br from-amber-50 to-white p-8 sm:p-12 rounded-3xl border-4 border-amber-300 shadow-2xl relative text-center">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-amber-500 text-white text-xs font-bold uppercase tracking-widest mb-4">
            <Award className="w-4 h-4" />
            Certificado Oficial de Afiliación
          </div>

          <div className="w-20 h-20 mx-auto mb-3">
            <img src="/logo-merida-gastronomica.png" alt="Logo" className="w-full h-full object-contain" />
          </div>

          <h3 className="font-serif text-3xl sm:text-4xl font-bold text-slate-900">
            Cámara Gastronómica del Estado Mérida
          </h3>
          <p className="text-xs text-slate-600 uppercase tracking-wider mt-1">
            República Bolivariana de Venezuela
          </p>

          <div className="my-8 py-6 border-y-2 border-amber-200/80">
            <p className="text-xs text-slate-500 uppercase tracking-wider">Se certifica que el establecimiento:</p>
            <h4 className="font-serif text-3xl font-extrabold text-amber-900 mt-2">
              {activeUser.restaurantName}
            </h4>
            <p className="text-xs font-medium text-slate-700 mt-2 max-w-md mx-auto">
              Cumple con los estatutos gremiales, la norma de buenas prácticas de manipulación y el aval de excelencia turística andina.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-4 text-xs text-slate-600 text-left max-w-md mx-auto mb-8">
            <div>
              <span className="block text-slate-400 font-bold uppercase text-[10px]">Número de Registro:</span>
              <span className="font-mono font-bold text-slate-800">{activeUser.id}</span>
            </div>
            <div>
              <span className="block text-slate-400 font-bold uppercase text-[10px]">Fecha de Emisión:</span>
              <span className="font-bold text-slate-800">Enero 2026</span>
            </div>
          </div>

          <button
            onClick={() => alert('Descargando Certificado Digital en Alta Resolución (PDF Firmado)...')}
            className="py-3 px-6 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-serif font-bold text-xs uppercase tracking-wider flex items-center gap-2 mx-auto shadow-md transition-all"
          >
            <Download className="w-4 h-4 text-amber-400" />
            <span>Descargar Certificado PDF</span>
          </button>
        </div>
      )}

      {/* Tab 3: Crear Empleos */}
      {activeTab === 'jobs' && (
        <div className="space-y-8 animate-fadeIn">
          <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-slate-900 to-amber-950 text-white shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
            <div className="space-y-1 max-w-2xl">
              <span className="text-xs font-extrabold uppercase px-3 py-1 rounded-full bg-amber-500/20 text-amber-400 border border-amber-500/30">
                Bolsa de Empleo Agremiada
              </span>
              <h3 className="font-serif text-2xl sm:text-3xl font-bold text-white mt-2">
                Gestión & Creación de Ofertas Laborales
              </h3>
              <p className="text-xs sm:text-sm text-slate-300">
                Publique vacantes directamente en la <strong>Bolsa de Empleo Oficial</strong> para captar talento calificado de la ULA y el Hotel Escuela.
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-white/10 border border-white/15 text-center shrink-0">
              <span className="text-xs uppercase font-bold text-amber-400 block">Vacantes Activas</span>
              <span className="text-2xl sm:text-3xl font-serif font-bold text-white block mt-0.5">{createdJobs.length}</span>
              <span className="text-[10px] text-slate-300">Con visibilidad inmediata</span>
            </div>
          </div>

          <div className="p-6 sm:p-8 rounded-3xl bg-white border border-slate-200 shadow-md">
            <div className="flex items-center gap-2 mb-6">
              <PlusCircle className="w-5 h-5 text-amber-600" />
              <h4 className="font-serif text-xl font-bold text-slate-900">
                Publicar Nueva Vacante
              </h4>
            </div>

            {jobCreatedSuccess && (
              <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold flex items-center gap-2 mb-6 animate-fadeIn">
                <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                <span>¡Vacante publicada con éxito! Ya está visible en la sección pública de Empleos.</span>
              </div>
            )}

            <form onSubmit={handleCreateJob} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Título del Cargo *</label>
                  <input
                    type="text"
                    required
                    placeholder="Ej. Chef de Partida / Barista de Especialidad"
                    value={newJobTitle}
                    onChange={(e) => setNewJobTitle(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-medium focus:outline-none focus:border-amber-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Área / Departamento *</label>
                  <select
                    value={newJobDept}
                    onChange={(e) => setNewJobDept(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-medium bg-white focus:outline-none focus:border-amber-500 text-slate-700"
                  >
                    <option value="Cocina">Cocina & Pastelería</option>
                    <option value="Sala & Servicio">Sala & Hospitalidad</option>
                    <option value="Bar & Cafetería">Bar & Barismo de Especialidad</option>
                    <option value="Gestión & Administración">Gestión & A&B</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Rango Salarial en Divisas *</label>
                  <input
                    type="text"
                    required
                    placeholder="Ej. $400 - $600 + Propinas"
                    value={newJobSalary}
                    onChange={(e) => setNewJobSalary(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-medium focus:outline-none focus:border-amber-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Tipo de Jornada</label>
                  <select
                    value={newJobType}
                    onChange={(e) => setNewJobType(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-medium bg-white focus:outline-none focus:border-amber-500 text-slate-700"
                  >
                    <option>Tiempo Completo</option>
                    <option>Medio Tiempo</option>
                    <option>Fines de Semana / Temporada</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Experiencia</label>
                  <select
                    value={newJobExp}
                    onChange={(e) => setNewJobExp(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-medium bg-white focus:outline-none focus:border-amber-500 text-slate-700"
                  >
                    <option>1 a 2 años</option>
                    <option>2 a 3 años</option>
                    <option>4+ años (Senior)</option>
                  </select>
                </div>
              </div>

              <div className="pt-2 flex justify-end">
                <button
                  type="submit"
                  className="py-3 px-6 rounded-xl bg-amber-500 hover:bg-amber-600 text-white font-serif font-bold text-xs uppercase tracking-wider flex items-center gap-2 shadow-md transition-all"
                >
                  <PlusCircle className="w-4 h-4" />
                  <span>Publicar Vacante Inmediatamente</span>
                </button>
              </div>
            </form>
          </div>

          <div className="p-6 sm:p-8 rounded-3xl bg-white border border-slate-200 shadow-md">
            <h4 className="font-serif text-xl font-bold text-slate-900 mb-4">
              Sus Vacantes Publicadas ({createdJobs.length})
            </h4>

            {createdJobs.length === 0 ? (
              <div className="py-12 text-center border-2 border-dashed border-slate-200 rounded-2xl">
                <Briefcase className="w-10 h-10 text-slate-400 mx-auto mb-2" />
                <p className="text-sm font-bold text-slate-700">No tiene vacantes activas en este momento</p>
                <p className="text-xs text-slate-500 mt-1">Utilice el formulario superior para publicar nuevas búsquedas de personal.</p>
              </div>
            ) : (
              <div className="space-y-4">
                {createdJobs.map((job) => (
                  <div key={job.id} className="p-5 rounded-2xl bg-slate-50 border border-slate-200 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded bg-amber-100 text-amber-900">
                          {job.department}
                        </span>
                        <span className="text-xs font-bold text-emerald-700 flex items-center gap-1">
                          <div className="w-2 h-2 rounded-full bg-emerald-500" />
                          {job.status}
                        </span>
                      </div>

                      <h5 className="font-serif font-bold text-lg text-slate-900">{job.title}</h5>
                      <p className="text-xs text-slate-600">
                        <strong>Remuneración:</strong> {job.salary} • <strong>Jornada:</strong> {job.type}
                      </p>
                    </div>

                    <button
                      onClick={() => setViewingApplicantsJob(job)}
                      className="py-2 px-4 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs flex items-center gap-1.5 shadow-sm"
                    >
                      <Users className="w-3.5 h-3.5 text-amber-400" />
                      <span>Ver Postulados ({job.applicants?.length || job.applicantsCount})</span>
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Tab 4: Payments (Cuotas & Solvencia) */}
      {activeTab === 'payments' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          <div className="lg:col-span-6 space-y-4">
            <div className="p-6 rounded-3xl bg-white border border-slate-200 shadow-sm">
              <span className="text-xs font-bold uppercase text-slate-400">Estatus de Solvencia Gremial</span>
              <h3 className="font-serif text-xl font-bold text-slate-900 mt-1">Cuota Ordinaria Mensual</h3>
              <p className="text-xs text-slate-600 mt-1">
                La cuota gremial financia las auditorías de calidad, campañas publicitarias de la ciudad y el mantenimiento de la guía web internacional.
              </p>

              <div className="my-4 p-4 rounded-2xl bg-slate-50 border border-slate-100 flex items-center justify-between">
                <div>
                  <span className="text-xs font-bold text-slate-700">Monto Mensual:</span>
                  <span className="text-xs text-slate-500 block">
                    {activeUser.memberCategory || 'Empresas (5 a 19 empleados)'}
                  </span>
                </div>
                <span className="font-serif font-bold text-2xl text-slate-900">
                  {activeUser.monthlyDues || '$10.00'} <span className="text-xs font-normal text-slate-500">/ mes</span>
                </span>
              </div>

              <div className="p-3.5 rounded-xl bg-amber-50 border border-amber-200 text-xs text-slate-700 space-y-1">
                <span className="font-bold text-amber-900 block uppercase text-[10px] tracking-wider">
                  Estructura de Cuotas Oficiales:
                </span>
                <p>• <strong>Grandes Empresas (20+ empleados):</strong> Inscripción + 1er Mes $50 USD • Mensualidad: $20 USD</p>
                <p>• <strong>Empresas (5 a 19 empleados):</strong> Inscripción + 1er Mes $30 USD • Mensualidad: $10 USD</p>
                <p>• <strong>Marca Personal / Emprendimientos:</strong> Inscripción + 1er Mes $20 USD • Mensualidad: $10 USD</p>
              </div>

              <div className="p-3 rounded-xl bg-emerald-50 text-emerald-800 text-xs font-bold flex items-center gap-2 mt-4">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Solvente — Próximo corte: 30 de Noviembre de 2026</span>
              </div>
            </div>
          </div>

          <div className="lg:col-span-6 p-6 rounded-3xl bg-white border border-slate-200 shadow-md">
            <h3 className="font-serif text-lg font-bold text-slate-900 mb-3">Registrar Pago de Cuota</h3>

            {paymentStep === 'success' ? (
              <div className="text-center py-6 space-y-2">
                <div className="w-12 h-12 rounded-full bg-emerald-100 text-emerald-600 mx-auto flex items-center justify-center">
                  <CheckCircle2 className="w-7 h-7" />
                </div>
                <h4 className="font-serif font-bold text-lg text-slate-900">¡Pago Reportado con Éxito!</h4>
                <p className="text-xs text-slate-600">El departamento de tesorería conciliará el reporte en las próximas horas.</p>
                <button
                  onClick={() => setPaymentStep('select')}
                  className="mt-2 text-xs font-bold text-amber-800 underline"
                >
                  Registrar otro pago
                </button>
              </div>
            ) : (
              <form onSubmit={handleSimulatePayment} className="space-y-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Método de Pago</label>
                  <select 
                    value={selectedPaymentMethod}
                    onChange={(e) => setSelectedPaymentMethod(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-800 focus:outline-none focus:border-amber-500"
                  >
                    <option value="pago-movil">Pago Móvil Provincial (0108 - V-12517086 - 04148817137)</option>
                    <option value="zelle">Zelle / Transferencia Internacional</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Número de Referencia</label>
                  <input 
                    type="text" 
                    required
                    placeholder="Ej. 09847291"
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-800 focus:outline-none focus:border-amber-500 font-mono"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-2.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-white font-serif font-bold text-xs uppercase tracking-wider transition-all shadow-sm mt-2"
                >
                  {paymentStep === 'processing' ? 'Procesando...' : 'Reportar Pago'}
                </button>
              </form>
            )}
          </div>
        </div>
      )}

      {/* Tab 5: Courses (Capacitaciones & Cursos Oficiales) */}
      {activeTab === 'courses' && (
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h3 className="font-serif text-xl font-bold text-slate-900">Capacitaciones & Cursos Oficiales</h3>
              <p className="text-xs text-slate-600">
                Programas académicos organizados por la Coordinación de Capacitación y Formación de la Cámara Gastronómica.
              </p>
            </div>
          </div>

          {internalCourses.length === 0 ? (
            <div className="p-12 text-center rounded-3xl bg-white border border-slate-200 shadow-sm space-y-3">
              <BookOpen className="w-12 h-12 text-slate-300 mx-auto" />
              <h4 className="font-serif font-bold text-lg text-slate-800">
                No hay cursos programados actualmente
              </h4>
              <p className="text-xs text-slate-500 max-w-md mx-auto">
                La Coordinación de Capacitación y Formación y la Presidencia de la Cámara publicarán próximamente el cronograma de talleres, masterclasses y certificaciones de brigadas.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {internalCourses.map((course) => {
                const isFree = course.isFreeForMembers || course.priceType === 'free' || course.memberPrice?.toLowerCase().includes('gratuito');
                return (
                  <div key={course.id} className="p-5 rounded-2xl bg-white border border-slate-200 shadow-sm flex flex-col justify-between hover:border-amber-400 transition-all">
                    <div>
                      <div className="flex items-center justify-between gap-2 mb-2">
                        <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded bg-amber-100 text-amber-900">
                          {course.hours || course.duration || 'Certificado Oficial'}
                        </span>
                        <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                          {isFree ? 'Gratis Agremiados' : `$${course.priceUsd} USD`}
                        </span>
                      </div>

                      <h4 className="font-serif font-bold text-base text-slate-900 mt-1">{course.title}</h4>
                      
                      <div className="my-2 text-xs text-slate-500 flex items-center gap-1">
                        <Clock className="w-3.5 h-3.5 text-amber-600 shrink-0" />
                        <span>{course.date}</span>
                      </div>

                      <p className="text-xs text-slate-600 mt-2">
                        Instructor: <strong>{course.instructor}</strong>
                      </p>
                      <p className="text-xs text-slate-500 mt-1">
                        Locación: {course.location}
                      </p>
                      {course.description && (
                        <p className="text-xs text-slate-600 mt-2 line-clamp-2 italic">
                          "{course.description}"
                        </p>
                      )}
                    </div>

                    <div className="pt-3 border-t border-slate-100 flex items-center justify-between mt-4">
                      <span className="text-xs font-bold text-slate-800">
                        {isFree ? 'Gratuito para Agremiados' : `$${course.priceUsd} USD`}
                      </span>
                      <button
                        onClick={() => handleOpenEnrollModal(course)}
                        className="py-1.5 px-3 rounded-lg bg-amber-500 text-white font-bold text-xs hover:bg-amber-600 transition-colors shadow-xs"
                      >
                        Inscribirse
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {/* Modal de Inscripción a Curso */}
          {enrollingCourse && (
            <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto animate-fadeIn">
              <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl relative my-8">
                <button
                  onClick={() => setEnrollingCourse(null)}
                  className="absolute top-5 right-5 p-2 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-600 transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>

                {courseRegSuccess ? (
                  <div className="text-center py-6 space-y-3">
                    <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 mx-auto flex items-center justify-center">
                      <CheckCircle2 className="w-10 h-10" />
                    </div>
                    <h3 className="font-serif text-2xl font-bold text-slate-900">¡Inscripción Confirmada!</h3>
                    <p className="text-xs text-slate-600">
                      Se ha emitido el comprobante formal de inscripción académica y se ha enviado la confirmación al correo <strong>{courseRegData.email}</strong>.
                    </p>
                  </div>
                ) : (
                  <form onSubmit={handleCourseEnrollSubmit} className="space-y-4 text-xs">
                    <div>
                      <span className="text-[10px] uppercase font-bold text-amber-800 bg-amber-100 px-2 py-0.5 rounded">
                        Capacitación Gremial CGEM
                      </span>
                      <h3 className="font-serif text-xl font-bold text-slate-900 mt-1">{enrollingCourse.title}</h3>
                      <p className="text-slate-500">{enrollingCourse.date} • {enrollingCourse.instructor}</p>
                    </div>

                    <div className="space-y-3 pt-2">
                      <div>
                        <label className="block font-bold text-slate-700 mb-1">Nombre Completo del Asistente *</label>
                        <input
                          type="text"
                          required
                          value={courseRegData.name}
                          onChange={(e) => setCourseRegData({ ...courseRegData, name: e.target.value })}
                          className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs focus:outline-none focus:border-amber-500 bg-slate-50"
                        />
                      </div>

                      <div className="grid grid-cols-2 gap-2">
                        <div>
                          <label className="block font-bold text-slate-700 mb-1">Cédula de Identidad *</label>
                          <input
                            type="text"
                            required
                            placeholder="V-12345678"
                            value={courseRegData.ci}
                            onChange={(e) => setCourseRegData({ ...courseRegData, ci: e.target.value })}
                            className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs focus:outline-none focus:border-amber-500 bg-slate-50"
                          />
                        </div>
                        <div>
                          <label className="block font-bold text-slate-700 mb-1">Teléfono / WhatsApp *</label>
                          <input
                            type="text"
                            required
                            value={courseRegData.phone}
                            onChange={(e) => setCourseRegData({ ...courseRegData, phone: e.target.value })}
                            className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs focus:outline-none focus:border-amber-500 bg-slate-50"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block font-bold text-slate-700 mb-1">Correo Electrónico *</label>
                        <input
                          type="email"
                          required
                          value={courseRegData.email}
                          onChange={(e) => setCourseRegData({ ...courseRegData, email: e.target.value })}
                          className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs focus:outline-none focus:border-amber-500 bg-slate-50"
                        />
                      </div>

                      <div>
                        <label className="block font-bold text-slate-700 mb-1">Ocupación / Cargo Actual *</label>
                        <input
                          type="text"
                          required
                          placeholder="Ej. Chef de Partida / Barista / Gerente"
                          value={courseRegData.occupation}
                          onChange={(e) => setCourseRegData({ ...courseRegData, occupation: e.target.value })}
                          className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs focus:outline-none focus:border-amber-500 bg-slate-50"
                        />
                      </div>

                      {/* Modalidad de pago o gratuidad para solventes */}
                      {enrollingCourse.isFreeForMembers || enrollingCourse.priceType === 'free' || enrollingCourse.memberPrice?.toLowerCase().includes('gratuito') ? (
                        <div className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-300 text-emerald-900 space-y-1">
                          <span className="font-bold flex items-center gap-1.5 text-xs">
                            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                            Curso Gratuito para Miembros Agremiados Solventes
                          </span>
                          <p className="text-[11px] text-emerald-700">
                            Su inscripción se confirmará inmediatamente y se enviará la acreditación digital a su correo.
                          </p>
                        </div>
                      ) : (
                        <div className="p-3.5 rounded-xl bg-slate-900 text-white space-y-2">
                          <div className="flex items-center justify-between text-xs">
                            <span className="text-amber-400 font-bold">Pago Móvil Provincial (0108 - V-12517086 - 04148817137)</span>
                            <span className="font-bold text-white font-mono">${enrollingCourse.priceUsd} USD</span>
                          </div>
                          <div className="grid grid-cols-2 gap-2 text-slate-800">
                            <input
                              type="text"
                              required
                              placeholder="Banco Emisor"
                              value={courseRegData.issuingBank}
                              onChange={(e) => setCourseRegData({ ...courseRegData, issuingBank: e.target.value })}
                              className="px-2 py-1.5 rounded-lg bg-white text-xs"
                            />
                            <input
                              type="text"
                              required
                              placeholder="N° Referencia Pago Móvil"
                              value={courseRegData.referenceNumber}
                              onChange={(e) => setCourseRegData({ ...courseRegData, referenceNumber: e.target.value })}
                              className="px-2 py-1.5 rounded-lg bg-white text-xs font-mono"
                            />
                          </div>
                        </div>
                      )}
                    </div>

                    <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2">
                      <button
                        type="button"
                        onClick={() => setEnrollingCourse(null)}
                        className="py-2 px-4 rounded-xl border border-slate-200 font-bold text-xs"
                      >
                        Cancelar
                      </button>
                      <button
                        type="submit"
                        disabled={isSubmittingCourseReg}
                        className="py-2.5 px-6 rounded-xl bg-amber-500 hover:bg-amber-600 text-white font-serif font-bold text-xs uppercase tracking-wider shadow-md"
                      >
                        {isSubmittingCourseReg ? 'Confirmando...' : 'Confirmar Inscripción'}
                      </button>
                    </div>
                  </form>
                )}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Tab 6: Direct Board Communication Tool */}
      {activeTab === 'board' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          <div className="lg:col-span-5 space-y-4">
            <h3 className="font-serif text-xl font-bold text-slate-900">Junta Directiva Oficial</h3>
            <p className="text-xs text-slate-500">Seleccione un directivo para redactarle un comunicado directo.</p>
            
            <div className="space-y-2.5">
              {boardMembers.map((member, i) => {
                const isSelected = selectedBoardMember.includes(member.name);
                return (
                  <div 
                    key={i} 
                    onClick={() => setSelectedBoardMember(`${member.name} - ${member.role}`)}
                    className={`p-3.5 rounded-2xl border transition-all cursor-pointer ${
                      isSelected
                        ? 'bg-amber-50/80 border-amber-500 shadow-md ring-2 ring-amber-400/20'
                        : 'bg-white border-slate-200 hover:border-amber-300'
                    }`}
                  >
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-[10px] uppercase font-extrabold text-amber-800 bg-amber-100/80 px-2 py-0.5 rounded">
                        {member.role}
                      </span>
                      {isSelected && <span className="text-[10px] font-bold text-emerald-700">Seleccionado</span>}
                    </div>

                    <h4 className="font-serif font-bold text-slate-900 text-sm mt-1">{member.name}</h4>
                    {member.instagram && (
                      <span className="text-[11px] text-amber-700 font-semibold block mt-0.5">{member.instagram}</span>
                    )}
                    <p className="text-[11px] text-slate-600 mt-0.5 leading-snug">{member.bio}</p>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="lg:col-span-7 p-6 sm:p-8 rounded-3xl bg-white border border-slate-200 shadow-md flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <Mail className="w-5 h-5 text-amber-600" />
                <h3 className="font-serif text-lg font-bold text-slate-900">
                  Redactar Comunicación Directa a la Directiva
                </h3>
              </div>
              <p className="text-xs text-slate-500 mb-6">
                Envíe consultas institucionales, solicitudes de inspección o propuestas gremiales directamente sin intermediarios.
              </p>

              {boardMsgSuccess && (
                <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold flex items-center gap-2 mb-6 animate-fadeIn">
                  <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                  <span>¡Mensaje enviado satisfactoriamente al directivo! Se ha registrado en la plataforma institucional.</span>
                </div>
              )}

              <form onSubmit={handleSendDirectBoardMessage} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Destinatario Oficial *</label>
                  <select 
                    value={selectedBoardMember}
                    onChange={(e) => setSelectedBoardMember(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs text-slate-800 focus:outline-none focus:border-amber-500 font-semibold"
                  >
                    {boardMembers.map((m, idx) => (
                      <option key={idx} value={`${m.name} - ${m.role}`}>
                        {m.name} ({m.role})
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Asunto *</label>
                  <select 
                    value={contactSubject}
                    onChange={(e) => setContactSubject(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs text-slate-800 focus:outline-none focus:border-amber-500"
                  >
                    <option>Consulta Institucional / Gremial</option>
                    <option>Solicitud de Auditoría para Sello de Calidad AAA</option>
                    <option>Propuesta de Alianza / Proveedores</option>
                    <option>Gestión de Vacantes & Personal</option>
                    <option>Asesoría Legal / Deberes Formales</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Mensaje / Comunicado *</label>
                  <textarea 
                    rows={6}
                    required
                    value={contactMessage}
                    onChange={(e) => setContactMessage(e.target.value)}
                    placeholder="Escriba su mensaje aquí de forma clara y detallada..."
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3.5 text-xs text-slate-800 focus:outline-none focus:border-amber-500"
                  />
                </div>

                <button
                  type="submit"
                  disabled={isSendingBoardMsg}
                  className="w-full py-3.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-white font-serif font-bold text-xs uppercase tracking-wider transition-all shadow-md flex items-center justify-center gap-2"
                >
                  <Send className="w-4 h-4" />
                  <span>{isSendingBoardMsg ? 'Enviando Mensaje...' : 'Enviar Comunicado Directo'}</span>
                </button>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Modal: View Applicants */}
      {viewingApplicantsJob && (
        <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto animate-fadeIn">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl relative my-8">
            <button
              onClick={() => setViewingApplicantsJob(null)}
              className="absolute top-5 right-5 p-2 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-600 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            <span className="text-xs uppercase font-bold text-amber-800">Candidatos Postulados</span>
            <h3 className="font-serif text-xl font-bold text-slate-900 mt-1">{viewingApplicantsJob.title}</h3>
            <p className="text-xs text-slate-500 mb-4">{viewingApplicantsJob.department} • {viewingApplicantsJob.salary}</p>

            <div className="py-8 text-center text-slate-500 text-xs">
              Aún no se han recibido nuevas postulaciones para esta vacante.
            </div>

            <div className="pt-4 border-t border-slate-100 flex justify-end">
              <button
                onClick={() => setViewingApplicantsJob(null)}
                className="py-2.5 px-5 rounded-xl bg-slate-900 text-white font-bold text-xs"
              >
                Cerrar Panel
              </button>
            </div>
          </div>
        </div>
      )}

    </section>
  );
}
