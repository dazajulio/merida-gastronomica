import React, { useState, useEffect, useRef } from 'react';
import { 
  Mountain, 
  Route as RouteIcon,
  Compass,
  Sparkles,
  MapPin,
  TrendingUp,
  ArrowUpRight
} from 'lucide-react';
import { LIDAR_ROUTES } from '../data/routesLidarData';
import { RESTAURANTS_DATA } from '../data/restaurantsData';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';

// Bulletproof token resolution with base64 fallback to guarantee 100% reliable load
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

const MAPBOX_TOKEN = getMapboxToken();

// LIVE COORDINATES RESOLVER (Gives 100% precedence to the Affiliate Portal Calibrator)
export const getLiveRestaurantCoords = (restData) => {
  if (typeof window !== 'undefined') {
    try {
      const saved = localStorage.getItem(`coords_${restData.id}`) ||
                    localStorage.getItem(`coords_${restData.certificateNumber}`) ||
                    localStorage.getItem(`coords_${restData.slug}`);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed && typeof parsed.lat === 'number' && typeof parsed.lng === 'number') {
          return {
            lat: parsed.lat,
            lng: parsed.lng,
            alt: parsed.alt || restData.altitude || 1620
          };
        }
      }
    } catch (e) {}
  }
  return restData.coordinates;
};

const MAP_STYLES = [
  {
    id: 'outdoors',
    name: 'Relieve 3D',
    icon: '🏔️',
    url: 'mapbox://styles/mapbox/outdoors-v12',
    description: 'Topografía de montaña y senderos'
  },
  {
    id: 'satellite',
    name: 'Satélite HD',
    icon: '🛰️',
    url: 'mapbox://styles/mapbox/satellite-streets-v12',
    description: 'Imágenes satelitales de alta resolución'
  },
  {
    id: 'lidar',
    name: 'Modo LiDAR',
    icon: '⚡',
    url: 'mapbox://styles/mapbox/dark-v11',
    description: 'Matriz espectral y relieve de contraste'
  },
  {
    id: 'streets',
    name: 'Urbano Claro',
    icon: '🗺️',
    url: 'mapbox://styles/mapbox/light-v11',
    description: 'Calles, avenidas y comercios'
  }
];

export function LidarMap({ onSelectRestaurantById, focusRestaurantId, t }) {
  const [activeRouteId, setActiveRouteId] = useState('eje-metropolitano');
  const [selectedCheckpoint, setSelectedCheckpoint] = useState(null);
  const [selectedStyleId, setSelectedStyleId] = useState('outdoors');
  const [is3DMode, setIs3DMode] = useState(true);
  const [isMapLoaded, setIsMapLoaded] = useState(false);

  const mapContainerRef = useRef(null);
  const mapRef = useRef(null);
  const markersRef = useRef([]);

  const currentRoute = LIDAR_ROUTES.find(r => r.id === activeRouteId) || LIDAR_ROUTES[0];

  // Configure 3D terrain and sky in Mapbox
  const configure3DTerrain = (map) => {
    try {
      if (!map.getSource('mapbox-dem')) {
        map.addSource('mapbox-dem', {
          type: 'raster-dem',
          url: 'mapbox://mapbox.mapbox-terrain-dem-v1',
          tileSize: 512,
          maxzoom: 14
        });
      }

      map.setTerrain({ source: 'mapbox-dem', exaggeration: 1.5 });

      if (!map.getLayer('sky')) {
        map.addLayer({
          id: 'sky',
          type: 'sky',
          paint: {
            'sky-type': 'atmosphere',
            'sky-atmosphere-sun': [0.0, 90.0],
            'sky-atmosphere-sun-intensity': 15
          }
        });
      }
    } catch (err) {
      console.warn('3D Terrain notice:', err);
    }
  };

  // Draw Route Polyline & Markers on Mapbox
  const updateRouteLayers = (map, route, autoFocusRefId = null) => {
    if (!map) return;

    // 1. Draw Route Polyline safely if style is ready
    try {
      if (map.isStyleLoaded()) {
        const coordinates = route.checkpoints.map(cp => [cp.lng, cp.lat]);
        const geojsonData = {
          type: 'Feature',
          properties: {},
          geometry: {
            type: 'LineString',
            coordinates: coordinates
          }
        };

        if (map.getLayer('route-glow')) map.removeLayer('route-glow');
        if (map.getLayer('route-line')) map.removeLayer('route-line');
        if (map.getSource('active-route')) map.removeSource('active-route');

        map.addSource('active-route', {
          type: 'geojson',
          data: geojsonData
        });

        map.addLayer({
          id: 'route-glow',
          type: 'line',
          source: 'active-route',
          layout: { 'line-join': 'round', 'line-cap': 'round' },
          paint: {
            'line-color': route.color || '#d97706',
            'line-width': 10,
            'line-opacity': 0.35,
            'line-blur': 4
          }
        });

        map.addLayer({
          id: 'route-line',
          type: 'line',
          source: 'active-route',
          layout: { 'line-join': 'round', 'line-cap': 'round' },
          paint: {
            'line-color': route.color || '#f59e0b',
            'line-width': 4,
            'line-dasharray': [2, 1.5]
          }
        });
      }
    } catch (err) {
      console.warn('Polyline layer notice:', err);
    }

    // 2. Clear old markers
    markersRef.current.forEach(m => m.remove());
    markersRef.current = [];

    // 3. MANDATORY: ALWAYS RENDER ALL REGISTERED RESTAURANTS IN PERMANENT 3D CARDS (LIVE SYNCED)
    RESTAURANTS_DATA.forEach((restData) => {
      const liveCoords = getLiveRestaurantCoords(restData);
      const restLng = liveCoords.lng;
      const restLat = liveCoords.lat;
      const restAlt = liveCoords.alt || restData.altitude || 1620;

      const el = document.createElement('div');
      el.className = 'custom-mapbox-marker group cursor-pointer';
      el.style.zIndex = '30';
      el.style.position = 'relative';

      el.innerHTML = `
        <div style="position: relative; display: flex; flex-direction: column; align-items: center; cursor: pointer; filter: drop-shadow(0 14px 28px rgba(0,0,0,0.55)); pointer-events: auto;">
          
          <!-- Permanent Floating Preview Card (ALWAYS VISIBLE) -->
          <div id="card-pin-${restData.id}" style="
            width: 260px;
            background: #ffffff;
            border-radius: 16px;
            overflow: hidden;
            border: 2.5px solid #f59e0b;
            box-shadow: 0 12px 32px rgba(0,0,0,0.4);
            transition: transform 0.2s ease, box-shadow 0.2s ease;
          ">
            <!-- Cover Image & Badges -->
            <div style="position: relative; width: 100%; height: 110px; background: #0f172a; overflow: hidden;">
              <img src="${restData.coverImage}" alt="${restData.name}" style="width: 100%; height: 100%; object-fit: cover; display: block;" />
              <div style="position: absolute; inset: 0; background: linear-gradient(to top, rgba(15,23,42,0.9) 0%, rgba(15,23,42,0.2) 60%, transparent 100%);"></div>
              
              <span style="position: absolute; top: 7px; left: 7px; background: #d97706; color: #ffffff; font-size: 9px; font-weight: 800; padding: 2.5px 8px; border-radius: 9999px; letter-spacing: 0.4px; box-shadow: 0 2px 6px rgba(0,0,0,0.4);">
                ★ AGREMIADO OFICIAL
              </span>

              <span style="position: absolute; top: 7px; right: 7px; background: rgba(15,23,42,0.85); color: #38bdf8; font-size: 10px; font-weight: 700; padding: 2px 7px; border-radius: 6px; border: 1px solid rgba(56,189,248,0.3);">
                ${restAlt} msnm
              </span>

              <div style="position: absolute; bottom: 6px; left: 8px; right: 8px; display: flex; align-items: center; justify-content: space-between;">
                <span style="font-size: 11px; color: #fbbf24; font-weight: 800;">★ ${restData.rating} <span style="font-size: 10px; color: #e2e8f0; font-weight: 500;">(${restData.reviewsCount})</span></span>
                <span style="font-size: 10px; font-weight: 700; color: #ffffff; background: rgba(0,0,0,0.65); padding: 1px 6px; border-radius: 4px;">${restData.priceTier || '$$'}</span>
              </div>
            </div>

            <!-- Content Body -->
            <div style="padding: 9px 11px 11px 11px; background: #ffffff;">
              <h4 style="font-size: 14px; font-weight: 800; color: #0f172a; margin: 0 0 2px 0; line-height: 1.25;">
                ${restData.name}
              </h4>
              <p style="font-size: 10px; color: #64748b; margin: 0 0 8px 0; line-height: 1.25; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;">
                📍 ${restData.location}
              </p>

              <!-- Button to open full modal -->
              <button 
                id="btn-direct-modal-${restData.id}" 
                type="button"
                style="
                  width: 100%;
                  background: linear-gradient(135deg, #d97706, #b45309);
                  color: #ffffff;
                  border: none;
                  padding: 8px 10px;
                  border-radius: 10px;
                  font-size: 11px;
                  font-weight: 800;
                  cursor: pointer;
                  display: flex;
                  align-items: center;
                  justify-content: center;
                  gap: 5px;
                  box-shadow: 0 4px 12px rgba(217,119,6,0.35);
                "
              >
                <span>Ver Ficha Completa & Reservar</span>
                <span>→</span>
              </button>
            </div>
          </div>

          <!-- Pointer Arrow Stem -->
          <div style="width: 0; height: 0; border-left: 9px solid transparent; border-right: 9px solid transparent; border-top: 10px solid #f59e0b; margin-top: -1px;"></div>

          <!-- Radar Pin Center -->
          <div style="position: relative; width: 36px; height: 36px; display: flex; align-items: center; justify-content: center; margin-top: 2px;">
            <div class="animate-radar-ring" style="
              position: absolute;
              inset: -6px;
              border-radius: 50%;
              background: rgba(217, 119, 6, 0.55);
              pointer-events: none;
            "></div>
            <div class="animate-radar-ring" style="
              position: absolute;
              inset: -14px;
              border-radius: 50%;
              background: rgba(245, 158, 11, 0.3);
              pointer-events: none;
              animation-delay: 0.8s;
            "></div>

            <div style="
              position: relative;
              z-index: 2;
              display: flex;
              align-items: center;
              justify-content: center;
              width: 32px;
              height: 32px;
              border-radius: 50%;
              background: linear-gradient(135deg, #f59e0b, #d97706, #9a3412);
              color: white;
              font-weight: 800;
              font-size: 14px;
              border: 2.5px solid #ffffff;
              box-shadow: 0 4px 12px rgba(0,0,0,0.5);
            ">
              ☕
            </div>
          </div>

        </div>
      `;

      el.addEventListener('click', (e) => {
        if (onSelectRestaurantById) {
          onSelectRestaurantById(restData.id);
        }
      });

      const marker = new mapboxgl.Marker({ element: el, anchor: 'bottom' })
        .setLngLat([restLng, restLat])
        .addTo(map);

      markersRef.current.push(marker);
    });

    // 4. RENDER TOURIST ATTRACTION CHECKPOINTS (Points of interest along current route)
    route.checkpoints
      .filter(cp => cp.type !== 'restaurant')
      .forEach((cp, idx) => {
        const el = document.createElement('div');
        el.className = 'custom-mapbox-attraction-marker cursor-pointer';
        el.style.zIndex = '20';
        el.innerHTML = `
          <div style="position: relative; display: flex; flex-direction: column; align-items: center; filter: drop-shadow(0 4px 10px rgba(0,0,0,0.4));">
            <div style="
              width: 28px;
              height: 28px;
              border-radius: 50%;
              background: linear-gradient(135deg, #0284c7, #0369a1);
              color: white;
              font-weight: 800;
              font-size: 11px;
              display: flex;
              align-items: center;
              justify-content: center;
              border: 2px solid #ffffff;
              box-shadow: 0 4px 8px rgba(0,0,0,0.3);
            ">
              ${idx + 1}
            </div>
            <span style="font-size: 9px; font-weight: 700; color: #0f172a; background: rgba(255,255,255,0.95); padding: 1.5px 5px; border-radius: 4px; margin-top: 3px; white-space: nowrap; box-shadow: 0 2px 4px rgba(0,0,0,0.25);">
              ${cp.name.split('(')[0]}
            </span>
          </div>
        `;

        el.addEventListener('click', () => {
          setSelectedCheckpoint(cp);
        });

        const marker = new mapboxgl.Marker({ element: el, anchor: 'bottom' })
          .setLngLat([cp.lng, cp.lat])
          .addTo(map);

        markersRef.current.push(marker);
      });

    // 5. CAMERA POSITIONING (USING LIVE CALIBRATED COORDINATES)
    if (autoFocusRefId) {
      const targetRest = RESTAURANTS_DATA.find(r => r.id === autoFocusRefId);
      const targetCoords = targetRest ? getLiveRestaurantCoords(targetRest) : null;
      const targetCp = targetCoords 
        ? { lng: targetCoords.lng, lat: targetCoords.lat }
        : route.checkpoints.find(cp => cp.refId === autoFocusRefId);

      if (targetCp) {
        map.flyTo({
          center: [targetCp.lng, targetCp.lat],
          zoom: 17.2,
          pitch: 58,
          bearing: -15,
          duration: 2000,
          essential: true
        });
        setTimeout(() => {
          const mapBoxEl = document.getElementById('mapa-lidar-box');
          if (mapBoxEl) {
            mapBoxEl.scrollIntoView({ behavior: 'smooth', block: 'start' });
          }
        }, 200);
      }
    } else {
      // Default: Center on the primary registered restaurant (Kaffia) with live coordinates
      const primaryRest = RESTAURANTS_DATA[0];
      if (primaryRest) {
        const liveCoords = getLiveRestaurantCoords(primaryRest);
        map.flyTo({
          center: [liveCoords.lng, liveCoords.lat],
          zoom: 16.5,
          pitch: 55,
          bearing: -15,
          duration: 1800,
          essential: true
        });
      }
    }
  };

  // Initialize Mapbox instance
  useEffect(() => {
    if (!mapContainerRef.current) return;

    mapboxgl.accessToken = MAPBOX_TOKEN;

    // Detect if we have an initial focus restaurant
    let initialRoute = LIDAR_ROUTES[0];
    if (focusRestaurantId) {
      const foundRoute = LIDAR_ROUTES.find(r => r.checkpoints.some(cp => cp.refId === focusRestaurantId));
      if (foundRoute) {
        initialRoute = foundRoute;
        setActiveRouteId(foundRoute.id);
      }
    }

    const firstPoint = initialRoute.checkpoints[0];

    const map = new mapboxgl.Map({
      container: mapContainerRef.current,
      style: MAP_STYLES.find(s => s.id === selectedStyleId)?.url || 'mapbox://styles/mapbox/outdoors-v12',
      center: [firstPoint.lng, firstPoint.lat],
      zoom: 12,
      pitch: 55,
      bearing: -20,
      antialias: true
    });

    map.addControl(new mapboxgl.NavigationControl({ visualizePitch: true }), 'top-right');
    
    map.addControl(
      new mapboxgl.GeolocateControl({
        positionOptions: { enableHighAccuracy: true },
        trackUserLocation: true,
        showUserHeading: true
      }),
      'top-right'
    );

    map.addControl(new mapboxgl.FullscreenControl(), 'top-right');

    map.on('load', () => {
      configure3DTerrain(map);
      setIsMapLoaded(true);
      updateRouteLayers(map, initialRoute, focusRestaurantId);
    });

    mapRef.current = map;

    return () => {
      map.remove();
    };
  }, []);

  // Real-time synchronization when coordinates are updated in Affiliate Dashboard
  useEffect(() => {
    const handleCoordsUpdate = () => {
      if (mapRef.current && isMapLoaded) {
        updateRouteLayers(mapRef.current, currentRoute);
      }
    };
    window.addEventListener('cgm_coords_updated', handleCoordsUpdate);
    window.addEventListener('storage', handleCoordsUpdate);
    return () => {
      window.removeEventListener('cgm_coords_updated', handleCoordsUpdate);
      window.removeEventListener('storage', handleCoordsUpdate);
    };
  }, [currentRoute, isMapLoaded]);

  // Handle focusRestaurantId change if map is already loaded
  useEffect(() => {
    if (!mapRef.current || !isMapLoaded || !focusRestaurantId) return;
    
    const targetRoute = LIDAR_ROUTES.find(r => r.checkpoints.some(cp => cp.refId === focusRestaurantId));
    if (targetRoute) {
      setActiveRouteId(targetRoute.id);
      updateRouteLayers(mapRef.current, targetRoute, focusRestaurantId);
    }
  }, [focusRestaurantId, isMapLoaded]);

  // Change Mapbox Style
  const handleStyleChange = (newStyleId) => {
    if (!mapRef.current) return;
    setSelectedStyleId(newStyleId);
    
    const styleObj = MAP_STYLES.find(s => s.id === newStyleId);
    if (!styleObj) return;

    const map = mapRef.current;
    map.setStyle(styleObj.url);

    map.once('style.load', () => {
      configure3DTerrain(map);
      updateRouteLayers(map, currentRoute);
    });
  };

  // Toggle 2D / 3D Mode
  const toggle3DMode = () => {
    if (!mapRef.current) return;
    const nextMode = !is3DMode;
    setIs3DMode(nextMode);

    mapRef.current.easeTo({
      pitch: nextMode ? 60 : 0,
      bearing: nextMode ? -25 : 0,
      duration: 1200
    });
  };

  // Update Route when activeRouteId changes manually
  useEffect(() => {
    if (!mapRef.current || !isMapLoaded) return;
    updateRouteLayers(mapRef.current, currentRoute);
  }, [activeRouteId, isMapLoaded]);

  // Fly to selected checkpoint from sidebar & open modal if it is a restaurant
  const handleCheckpointClick = (cp) => {
    setSelectedCheckpoint(cp);
    if (mapRef.current) {
      mapRef.current.flyTo({
        center: [cp.lng, cp.lat],
        zoom: cp.type === 'restaurant' ? 17.2 : 15.5,
        pitch: 58,
        bearing: -15,
        speed: 1.2,
        curve: 1.4,
        essential: true
      });
    }
    if (cp.refId && onSelectRestaurantById) {
      onSelectRestaurantById(cp.refId);
    }
  };

  return (
    <section id="mapa-lidar" className="py-12 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      
      {/* Header */}
      <div className="text-center max-w-3xl mx-auto mb-10">
        <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-amber-100 border border-amber-300 text-amber-900 text-xs font-semibold mb-3 shadow-sm">
          <Sparkles className="w-3.5 h-3.5 text-amber-700 animate-pulse" />
          <span>Cartografía Satelital & Relieve 3D Mapbox</span>
        </div>
        <h2 className="font-serif text-3xl sm:text-5xl font-bold text-slate-900 tracking-tight">
          Mapa Topográfico & Rutas del Sabor
        </h2>
        <p className="mt-3 text-slate-600 text-sm sm:text-base">
          Haz clic en cualquier restaurante para volar directamente a su ubicación GPS en 3D y abrir su ficha oficial.
        </p>
      </div>

      {/* Main Map Box */}
      <div id="mapa-lidar-box" className="rounded-3xl bg-white border border-slate-200 shadow-2xl overflow-hidden scroll-mt-24">
        
        {/* Top Route & Style Toolbar */}
        <div className="p-4 sm:p-5 bg-slate-900 text-white flex flex-wrap items-center justify-between gap-4">
          
          {/* Route selector buttons */}
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-xs font-bold text-amber-400 uppercase tracking-wider mr-1 flex items-center gap-1.5">
              <RouteIcon className="w-4 h-4" />
              Eje:
            </span>
            {LIDAR_ROUTES.map((route) => (
              <button
                key={route.id}
                onClick={() => {
                  setActiveRouteId(route.id);
                  setSelectedCheckpoint(null);
                }}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all flex items-center gap-2 ${
                  activeRouteId === route.id
                    ? 'bg-amber-600 text-white shadow-lg shadow-amber-600/30 ring-2 ring-amber-400/50 scale-105'
                    : 'bg-slate-800 text-slate-300 hover:bg-slate-700 hover:text-white border border-slate-700'
                }`}
              >
                <div 
                  className="w-2.5 h-2.5 rounded-full"
                  style={{ backgroundColor: activeRouteId === route.id ? '#ffffff' : route.color || '#d97706' }}
                />
                <span>{route.name.split(':')[1] || route.name}</span>
              </button>
            ))}
          </div>

          {/* Quick Metrics */}
          <div className="flex items-center gap-2.5">
            <div className="px-3 py-1 rounded-lg bg-slate-800 border border-slate-700 text-amber-300 text-xs font-medium flex items-center gap-1.5">
              <Mountain className="w-3.5 h-3.5 text-amber-400" />
              <span>{currentRoute.altitudeSpan}</span>
            </div>
          </div>

        </div>

        {/* 2-Column Layout: Mapbox 3D Map + Checkpoint & Elevation Sidebar */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-0 relative">
          
          {/* Left Column: Mapbox GL */}
          <div className="lg:col-span-8 relative min-h-[520px] lg:min-h-[660px] w-full bg-slate-950">
            
            {/* Map Canvas */}
            <div ref={mapContainerRef} className="absolute inset-0 w-full h-full" />

            {/* Floating Top-Left: Style Switcher & 3D Tilt Button */}
            <div className="absolute top-4 left-4 z-10 flex flex-col gap-2">
              <div className="bg-slate-900/90 backdrop-blur-md p-1.5 rounded-2xl border border-slate-700 shadow-xl flex items-center gap-1">
                {MAP_STYLES.map(style => (
                  <button
                    key={style.id}
                    onClick={() => handleStyleChange(style.id)}
                    title={style.description}
                    className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all flex items-center gap-1.5 ${
                      selectedStyleId === style.id
                        ? 'bg-amber-600 text-white shadow-md'
                        : 'text-slate-300 hover:text-white hover:bg-slate-800'
                    }`}
                  >
                    <span>{style.icon}</span>
                    <span className="hidden sm:inline">{style.name}</span>
                  </button>
                ))}
              </div>

              {/* 3D View Toggle */}
              <button
                onClick={toggle3DMode}
                className="self-start bg-slate-900/90 backdrop-blur-md px-3 py-1.5 rounded-xl border border-slate-700 text-xs font-semibold text-slate-200 hover:text-white hover:bg-slate-800 transition-all flex items-center gap-1.5 shadow-lg"
              >
                <Compass className={`w-3.5 h-3.5 text-amber-400 ${is3DMode ? 'animate-spin-slow' : ''}`} />
                <span>{is3DMode ? 'Modo 3D Montaña (Activo)' : 'Cambiar a 3D'}</span>
              </button>
            </div>

            {/* Floating Bottom-Left: Legend */}
            <div className="absolute bottom-4 left-4 z-10 bg-slate-900/90 backdrop-blur-md px-3.5 py-2.5 rounded-2xl border border-slate-700 shadow-xl text-xs space-y-1.5 text-white">
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 rounded-full bg-gradient-to-tr from-amber-500 to-orange-500 border-2 border-white shadow-md flex items-center justify-center text-[8px]">☕</div>
                <span className="font-semibold text-amber-300">Restaurante Agremiado (Radar Activo)</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3.5 h-3.5 rounded-full bg-sky-600 border-2 border-white shadow" />
                <span className="font-medium text-slate-300">Punto Turístico / Atractivo</span>
              </div>
            </div>

          </div>

          {/* Right Column: Checkpoints, Route Details & Elevation Sidebar */}
          <div className="lg:col-span-4 p-5 sm:p-6 bg-slate-50 border-l border-slate-200 flex flex-col justify-between space-y-6">
            
            <div>
              {/* Route Heading */}
              <div className="mb-4">
                <span className="text-[11px] font-bold uppercase tracking-wider text-amber-700">
                  {currentRoute.tag}
                </span>
                <h3 className="text-base font-bold text-slate-900 mt-0.5">
                  {currentRoute.name}
                </h3>
                <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                  {currentRoute.description}
                </p>
              </div>

              {/* Paradas */}
              <div className="flex items-center justify-between mb-2.5">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-700 flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5 text-amber-600" />
                  Paradas de la Ruta
                </span>
                <span className="text-xs text-slate-500 font-medium">
                  {currentRoute.distanceKm}
                </span>
              </div>

              <div className="space-y-2 max-h-[300px] overflow-y-auto pr-1">
                {currentRoute.checkpoints.map((cp, idx) => {
                  const isSelected = selectedCheckpoint?.name === cp.name;
                  const isRest = cp.type === 'restaurant';
                  return (
                    <div
                      key={idx}
                      onClick={() => handleCheckpointClick(cp)}
                      className={`p-3 rounded-2xl border transition-all cursor-pointer ${
                        isSelected
                          ? 'bg-white border-amber-500 shadow-md scale-[1.02] ring-2 ring-amber-500/20'
                          : 'bg-white border-slate-200 hover:border-amber-300 hover:bg-amber-50/30'
                      }`}
                    >
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex items-start gap-2.5">
                          <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold text-white shrink-0 mt-0.5 ${
                            isRest ? 'bg-gradient-to-tr from-amber-600 to-orange-500' : 'bg-gradient-to-tr from-sky-600 to-blue-500'
                          }`}>
                            {isRest ? '☕' : idx + 1}
                          </div>
                          <div>
                            <h4 className="font-bold text-xs sm:text-sm text-slate-900 leading-snug">
                              {cp.name}
                            </h4>
                            <p className="text-[11px] text-slate-500 mt-0.5">
                              {isRest ? '⭐ Agremiado Oficial Cámara' : '📍 Atractivo Natural'}
                            </p>
                          </div>
                        </div>

                        <span className="text-[11px] font-bold text-amber-800 bg-amber-50 px-2 py-0.5 rounded-md border border-amber-200 shrink-0">
                          {cp.alt} m
                        </span>
                      </div>

                      {cp.refId && (
                        <div className="mt-2.5 pt-2 border-t border-slate-100 flex items-center justify-between">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              onSelectRestaurantById(cp.refId);
                            }}
                            className="text-xs font-bold text-amber-700 hover:text-amber-800 flex items-center gap-1 transition-colors"
                          >
                            <span>Abrir Ficha & Reservas</span>
                            <ArrowUpRight className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Profile Elevation Chart */}
            <div className="pt-4 border-t border-slate-200">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
                  <TrendingUp className="w-3.5 h-3.5 text-amber-600" />
                  Gradiente de Altitud:
                </span>
                <span className="text-[11px] font-medium text-amber-700">
                  {currentRoute.altitudeSpan}
                </span>
              </div>
              
              <div className="h-20 w-full bg-white rounded-xl p-2.5 border border-slate-200 flex items-end justify-between gap-1 shadow-inner">
                {currentRoute.elevationProfile.map((pt, idx) => {
                  const maxAlt = 4765;
                  const heightPercent = Math.max(18, Math.min(100, (pt.alt / maxAlt) * 100));
                  return (
                    <div key={idx} className="flex-1 flex flex-col items-center gap-1 group cursor-pointer">
                      <div 
                        style={{ height: `${heightPercent}%` }}
                        className="w-full rounded-t-md bg-gradient-to-t from-amber-600 to-amber-400 group-hover:from-amber-500 group-hover:to-orange-300 transition-all shadow-sm"
                        title={`${pt.label}: ${pt.alt} msnm`}
                      />
                      <span className="text-[8px] font-semibold text-slate-500 truncate max-w-[45px] text-center">
                        {pt.label.split(' ')[0]}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>

          </div>

        </div>

      </div>

    </section>
  );
}
