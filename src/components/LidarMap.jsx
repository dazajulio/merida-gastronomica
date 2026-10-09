import React, { useState, useEffect, useRef, useMemo } from 'react';
import { 
  Route as RouteIcon,
  Compass,
  Sparkles,
  MapPin,
  ArrowUpRight,
  ShieldCheck,
  Star,
  CheckCircle2,
  ExternalLink,
  ChevronRight
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

// LIVE COORDINATES RESOLVER
export const getLiveRestaurantCoords = (restData) => {
  if (!restData) return { lat: 8.5956, lng: -71.1437 };
  if (typeof window !== 'undefined') {
    try {
      const saved = (restData.id && localStorage.getItem(`coords_${restData.id}`)) ||
                    (restData.certificateNumber && localStorage.getItem(`coords_${restData.certificateNumber}`)) ||
                    (restData.slug && localStorage.getItem(`coords_${restData.slug}`));
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed && typeof parsed.lat === 'number' && typeof parsed.lng === 'number' && !isNaN(parsed.lat) && !isNaN(parsed.lng)) {
          return {
            lat: parsed.lat,
            lng: parsed.lng
          };
        }
      }
    } catch (e) {}
  }
  if (restData.coordinates && typeof restData.coordinates.lat === 'number' && typeof restData.coordinates.lng === 'number' && !isNaN(restData.coordinates.lat) && !isNaN(restData.coordinates.lng)) {
    return {
      lat: restData.coordinates.lat,
      lng: restData.coordinates.lng
    };
  }
  if (typeof restData.latitude === 'number' && typeof restData.longitude === 'number' && !isNaN(restData.latitude) && !isNaN(restData.longitude)) {
    return { lat: restData.latitude, lng: restData.longitude };
  }
  if (typeof restData.lat === 'number' && typeof restData.lng === 'number' && !isNaN(restData.lat) && !isNaN(restData.lng)) {
    return { lat: restData.lat, lng: restData.lng };
  }
  return { lat: 8.5956, lng: -71.1437 };
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

// Helper to disperse overlapping coordinates
const getDispersedRestaurants = (restList) => {
  const coordGroups = {};
  return (restList || []).map((rest) => {
    if (!rest) return null;
    const base = getLiveRestaurantCoords(rest);
    if (!base || typeof base.lat !== 'number' || typeof base.lng !== 'number') return null;

    const key = `${base.lat.toFixed(3)}_${base.lng.toFixed(3)}`;
    const count = coordGroups[key] || 0;
    coordGroups[key] = count + 1;

    if (count === 0) {
      return { ...rest, mapCoords: base };
    }

    const angle = count * 2.39996;
    const radius = 0.00038 * Math.sqrt(count);
    const latOffset = base.lat + radius * Math.cos(angle);
    const lngOffset = base.lng + (radius * Math.sin(angle)) / Math.cos(base.lat * Math.PI / 180);

    return {
      ...rest,
      mapCoords: {
        lat: latOffset,
        lng: lngOffset
      }
    };
  }).filter(Boolean);
};

export function LidarMap({ onSelectRestaurantById, focusRestaurantId, t, restaurants = RESTAURANTS_DATA }) {
  const [activeRouteId, setActiveRouteId] = useState('merida');
  const [selectedCheckpoint, setSelectedCheckpoint] = useState(null);
  const [selectedRestaurantId, setSelectedRestaurantId] = useState(null);
  const [selectedStyleId, setSelectedStyleId] = useState('outdoors');
  const [is3DMode, setIs3DMode] = useState(true);
  const [isMapLoaded, setIsMapLoaded] = useState(false);

  const mapContainerRef = useRef(null);
  const mapRef = useRef(null);
  const markersRef = useRef([]);
  const restaurantEntriesRef = useRef({});
  const sidebarContainerRef = useRef(null);

  const currentRoute = useMemo(() => {
    return LIDAR_ROUTES.find(r => r.id === activeRouteId) || LIDAR_ROUTES[0];
  }, [activeRouteId]);

  // Establishments in the active Eje
  const restaurantsInCurrentEje = useMemo(() => {
    const list = Array.isArray(restaurants) ? restaurants : RESTAURANTS_DATA;
    const filtered = list.filter(r => {
      if (!r) return false;
      const rEje = (r.eje || '').toLowerCase().trim();
      const targetId = currentRoute.id.toLowerCase().trim();
      if (rEje === targetId) return true;
      if (r.ejeName && r.ejeName.toLowerCase().includes(currentRoute.name.toLowerCase())) return true;
      return false;
    });

    // Fallback: If no establishments match this specific eje, show all solvent members to keep the sidebar active
    if (filtered.length === 0) {
      return list;
    }
    return filtered;
  }, [restaurants, currentRoute]);

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

      map.setFog({
        range: [0.5, 10],
        color: '#f8fafc',
        'horizon-blend': 0.1,
        'high-color': '#0284c7',
        'space-color': '#0f172a',
        'star-intensity': 0.35
      });
    } catch (e) {
      console.warn('Mapbox 3D terrain notice:', e);
    }
  };

  // Scroll to and highlight restaurant card in sidebar
  const highlightSidebarItem = (restId) => {
    if (!restId) return;
    setSelectedRestaurantId(restId);
    setSelectedCheckpoint(null);
    setTimeout(() => {
      const cardEl = document.getElementById(`sidebar-rest-${restId}`);
      if (cardEl && sidebarContainerRef.current) {
        cardEl.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
      }
    }, 80);
  };

  // Update Route Polyline & Markers
  const updateRouteLayers = (map, route, autoFocusRefId = null) => {
    if (!map || !map.isStyleLoaded()) return;

    // 1. Draw glowing polyline
    const validCoords = (route?.checkpoints || [])
      .filter(cp => cp && typeof cp.lng === 'number' && typeof cp.lat === 'number')
      .map(cp => [cp.lng, cp.lat]);

    const geojsonData = {
      type: 'Feature',
      properties: { name: route.name, color: route.color },
      geometry: {
        type: 'LineString',
        coordinates: validCoords
      }
    };

    try {
      if (map.getSource('active-route')) {
        map.getSource('active-route').setData(geojsonData);
      } else {
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

    // 2. Clear old markers and close open popups
    markersRef.current.forEach(m => m.remove());
    markersRef.current = [];
    restaurantEntriesRef.current = {};

    // 3. RENDER COMPACT YELP-STYLE RESTAURANT PINS WITH NO ALTITUDE LABELS
    const dispersedRestaurants = getDispersedRestaurants(restaurants || RESTAURANTS_DATA);

    dispersedRestaurants.forEach((restData) => {
      const liveCoords = restData.mapCoords || getLiveRestaurantCoords(restData);
      if (!liveCoords || typeof liveCoords.lng !== 'number' || typeof liveCoords.lat !== 'number') return;
      const restLng = liveCoords.lng;
      const restLat = liveCoords.lat;

      // Create Sleek Compact Pin DOM element (WITHOUT altitude tag)
      const el = document.createElement('div');
      el.className = 'cgm-restaurant-pin group cursor-pointer';
      el.style.position = 'relative';
      el.style.zIndex = '30';
      el.style.userSelect = 'none';

      el.innerHTML = `
        <div style="position: relative; display: flex; flex-direction: column; align-items: center; cursor: pointer; transition: transform 0.2s cubic-bezier(0.16,1,0.3,1); filter: drop-shadow(0 6px 14px rgba(0,0,0,0.4));">
          
          <!-- Compact Pill Badge -->
          <div class="group-hover:scale-110 group-hover:border-amber-400 group-hover:bg-slate-900" style="
            display: flex;
            align-items: center;
            gap: 6px;
            background: #0f172a;
            color: #ffffff;
            padding: 4px 9px 4px 6px;
            border-radius: 9999px;
            border: 1.5px solid #f59e0b;
            box-shadow: 0 4px 12px rgba(0,0,0,0.35);
            transition: all 0.2s ease;
            white-space: nowrap;
          ">
            <!-- Mini Icon -->
            <div style="
              width: 20px;
              height: 20px;
              border-radius: 50%;
              background: linear-gradient(135deg, #f59e0b, #d97706);
              display: flex;
              align-items: center;
              justify-content: center;
              font-size: 10.5px;
              color: white;
              box-shadow: 0 2px 4px rgba(0,0,0,0.3);
              flex-shrink: 0;
            ">🍽️</div>

            <!-- Name -->
            <span style="font-size: 11.5px; font-weight: 700; color: #f8fafc; max-width: 140px; overflow: hidden; text-overflow: ellipsis; letter-spacing: -0.2px;">
              ${restData.name}
            </span>
          </div>

          <!-- Needle Arrow -->
          <div style="width: 0; height: 0; border-left: 5px solid transparent; border-right: 5px solid transparent; border-top: 6px solid #f59e0b; margin-top: -1px;"></div>
          
          <!-- Anchor Dot -->
          <div style="width: 5px; height: 5px; border-radius: 50%; background: #f59e0b; box-shadow: 0 0 6px rgba(245,158,11,0.9); margin-top: 1px;"></div>
        </div>
      `;

      // Create Rich Popup
      const popupHTML = `
        <div style="width: 270px; font-family: inherit; overflow: hidden; background: #ffffff; border-radius: 18px;">
          <!-- Cover Image & Badges -->
          <div style="position: relative; width: 100%; height: 115px; background: #0f172a; overflow: hidden;">
            <img src="${restData.coverImage || '/images/default-cover.jpg'}" alt="${restData.name}" style="width: 100%; height: 100%; object-fit: cover; display: block;" />
            <div style="position: absolute; inset: 0; background: linear-gradient(to top, rgba(15,23,42,0.92) 0%, rgba(15,23,42,0.25) 60%, transparent 100%);"></div>
            
            <span style="position: absolute; top: 7px; left: 7px; background: #d97706; color: #ffffff; font-size: 9px; font-weight: 800; padding: 2.5px 8px; border-radius: 9999px; letter-spacing: 0.4px; box-shadow: 0 2px 6px rgba(0,0,0,0.4);">
              ★ AGREMIADO OFICIAL
            </span>

            <div style="position: absolute; bottom: 6px; left: 8px; right: 8px; display: flex; align-items: center; justify-content: space-between;">
              <span style="font-size: 11px; color: #fbbf24; font-weight: 800;">★ ${restData.rating || '5.0'} <span style="font-size: 10px; color: #e2e8f0; font-weight: 500;">(${restData.reviewsCount || 1})</span></span>
              <span style="font-size: 10px; font-weight: 700; color: #f8fafc; background: rgba(15,23,42,0.8); padding: 1.5px 6px; border-radius: 4px; border: 1px solid rgba(255,255,255,0.15);">${restData.category || 'Gastronomía'}</span>
            </div>
          </div>

          <!-- Content Body -->
          <div style="padding: 10px 12px 12px 12px; background: #ffffff;">
            <h4 style="font-size: 14px; font-weight: 800; color: #0f172a; margin: 0 0 2px 0; line-height: 1.25;">
              ${restData.name}
            </h4>
            <p style="font-size: 10.5px; color: #64748b; margin: 0 0 10px 0; line-height: 1.3; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;">
              📍 ${restData.location || 'Mérida, Venezuela'}
            </p>

            <button 
              id="btn-popup-${restData.id}" 
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
              <span>Ver Ficha Oficial Completa</span>
              <span>→</span>
            </button>
          </div>
        </div>
      `;

      const popup = new mapboxgl.Popup({
        offset: 14,
        closeButton: true,
        closeOnClick: true,
        maxWidth: '290px',
        className: 'cgm-custom-popup'
      }).setHTML(popupHTML);

      popup.on('open', () => {
        highlightSidebarItem(restData.id);
        setTimeout(() => {
          const btn = document.getElementById(`btn-popup-${restData.id}`);
          if (btn) {
            btn.onclick = (e) => {
              e.stopPropagation();
              if (onSelectRestaurantById) {
                onSelectRestaurantById(restData.id);
              }
            };
          }
        }, 50);
      });

      const marker = new mapboxgl.Marker({ element: el, anchor: 'bottom' })
        .setLngLat([restLng, restLat])
        .setPopup(popup)
        .addTo(map);

      el.addEventListener('click', () => {
        highlightSidebarItem(restData.id);
        map.easeTo({
          center: [restLng, restLat],
          zoom: 16.5,
          duration: 600
        });
      });

      markersRef.current.push(marker);

      if (restData.id) restaurantEntriesRef.current[restData.id] = { marker, popup, coords: { lng: restLng, lat: restLat } };
      if (restData.codigo_afiliado) restaurantEntriesRef.current[restData.codigo_afiliado] = { marker, popup, coords: { lng: restLng, lat: restLat } };
      if (restData.certificateNumber) restaurantEntriesRef.current[restData.certificateNumber] = { marker, popup, coords: { lng: restLng, lat: restLat } };
      if (restData.slug) restaurantEntriesRef.current[restData.slug] = { marker, popup, coords: { lng: restLng, lat: restLat } };
    });

    // 4. RENDER TOURIST ATTRACTIONS (WITHOUT ALTITUDE)
    (route?.checkpoints || [])
      .filter(cp => cp && cp.type !== 'restaurant' && typeof cp.lng === 'number' && typeof cp.lat === 'number')
      .forEach((cp, idx) => {
        const el = document.createElement('div');
        el.className = 'custom-mapbox-attraction-marker cursor-pointer group';
        el.style.zIndex = '20';
        el.innerHTML = `
          <div style="position: relative; display: flex; flex-direction: column; align-items: center; filter: drop-shadow(0 4px 10px rgba(0,0,0,0.4)); transition: transform 0.2s ease;">
            <div class="group-hover:scale-110" style="
              width: 26px;
              height: 26px;
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
              transition: transform 0.2s ease;
            ">
              ${idx + 1}
            </div>
            <span style="font-size: 9px; font-weight: 700; color: #0f172a; background: rgba(255,255,255,0.95); padding: 1px 5px; border-radius: 4px; margin-top: 2px; white-space: nowrap; box-shadow: 0 2px 4px rgba(0,0,0,0.25);">
              ${(cp.name || '').split('(')[0]}
            </span>
          </div>
        `;

        const attractionPopup = new mapboxgl.Popup({
          offset: 12,
          closeButton: true,
          closeOnClick: true,
          maxWidth: '240px'
        }).setHTML(`
          <div style="padding: 10px 12px; font-family: inherit;">
            <div style="display: flex; align-items: center; gap: 6px; margin-bottom: 4px;">
              <span style="background: #0284c7; color: white; width: 20px; height: 20px; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 10px; font-weight: 800;">${idx + 1}</span>
              <h4 style="font-size: 13px; font-weight: 800; color: #0f172a; margin: 0;">${cp.name}</h4>
            </div>
            <p style="font-size: 11px; color: #64748b; margin: 0;">📍 Punto de Interés Turístico & Paisajístico</p>
          </div>
        `);

        el.addEventListener('click', () => {
          setSelectedCheckpoint(cp);
          setSelectedRestaurantId(null);
        });

        const marker = new mapboxgl.Marker({ element: el, anchor: 'bottom' })
          .setLngLat([cp.lng, cp.lat])
          .setPopup(attractionPopup)
          .addTo(map);

        markersRef.current.push(marker);
      });

    // 5. CAMERA POSITIONING & AUTO-FOCUS
    if (autoFocusRefId) {
      const entry = restaurantEntriesRef.current[autoFocusRefId];
      if (entry && entry.coords) {
        map.flyTo({
          center: [entry.coords.lng, entry.coords.lat],
          zoom: 16.8,
          pitch: 52,
          bearing: -15,
          duration: 1800,
          essential: true
        });
        setTimeout(() => {
          if (entry.popup && !entry.popup.isOpen()) {
            entry.popup.addTo(map);
          }
          highlightSidebarItem(autoFocusRefId);
        }, 600);
      }
    } else {
      const primaryRest = dispersedRestaurants[0];
      if (primaryRest && primaryRest.mapCoords) {
        map.flyTo({
          center: [primaryRest.mapCoords.lng, primaryRest.mapCoords.lat],
          zoom: 15.2,
          pitch: 50,
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

    let initialRoute = LIDAR_ROUTES[0];
    if (focusRestaurantId) {
      const foundRoute = LIDAR_ROUTES.find(r => r.checkpoints && r.checkpoints.some(cp => cp && cp.refId === focusRestaurantId));
      if (foundRoute) {
        initialRoute = foundRoute;
        setActiveRouteId(foundRoute.id);
      }
    }

    const firstPoint = (initialRoute?.checkpoints || []).find(cp => cp && typeof cp.lng === 'number' && typeof cp.lat === 'number') || { lng: -71.1437, lat: 8.5956 };

    const map = new mapboxgl.Map({
      container: mapContainerRef.current,
      style: MAP_STYLES.find(s => s.id === selectedStyleId)?.url || 'mapbox://styles/mapbox/outdoors-v12',
      center: [firstPoint.lng, firstPoint.lat],
      zoom: 12.5,
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

  // Synchronize on focusRestaurantId
  useEffect(() => {
    if (!mapRef.current || !isMapLoaded || !focusRestaurantId) return;
    
    const targetRoute = LIDAR_ROUTES.find(r => r.checkpoints && r.checkpoints.some(cp => cp && cp.refId === focusRestaurantId));
    if (targetRoute) {
      setActiveRouteId(targetRoute.id);
      updateRouteLayers(mapRef.current, targetRoute, focusRestaurantId);
    }
  }, [focusRestaurantId, isMapLoaded]);

  // Handle style switch
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

  // Toggle 3D
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

  // Update Route when activeRouteId changes
  useEffect(() => {
    if (!mapRef.current || !isMapLoaded) return;
    updateRouteLayers(mapRef.current, currentRoute);
  }, [activeRouteId, isMapLoaded, restaurants]);

  // Click on a restaurant card in the sidebar
  const handleSidebarRestaurantClick = (rest) => {
    if (!rest) return;
    setSelectedRestaurantId(rest.id);
    setSelectedCheckpoint(null);

    const coords = rest.mapCoords || getLiveRestaurantCoords(rest);
    if (mapRef.current && coords) {
      mapRef.current.flyTo({
        center: [coords.lng, coords.lat],
        zoom: 16.8,
        pitch: 55,
        bearing: -15,
        speed: 1.2,
        curve: 1.4,
        essential: true
      });

      setTimeout(() => {
        const entry = restaurantEntriesRef.current[rest.id] || restaurantEntriesRef.current[rest.codigo_afiliado] || restaurantEntriesRef.current[rest.slug];
        if (entry && entry.popup && mapRef.current) {
          entry.popup.addTo(mapRef.current);
        }
      }, 400);
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
          Explora los destinos gastronómicos por eje territorial. Selecciona cualquier establecimiento para volar en 3D y abrir su ficha oficial.
        </p>
      </div>

      {/* Main Map Box */}
      <div id="mapa-lidar-box" className="rounded-3xl bg-white border border-slate-200 shadow-2xl overflow-hidden scroll-mt-24">
        
        {/* Top Route Toolbar */}
        <div className="p-4 sm:p-5 bg-slate-900 text-white flex flex-wrap items-center justify-between gap-4">
          
          {/* Ejes selector buttons */}
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
                  setSelectedRestaurantId(null);
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
                <span>{route.name}</span>
              </button>
            ))}
          </div>

          {/* Eje distance metric */}
          <div className="flex items-center gap-2.5">
            <div className="px-3 py-1 rounded-lg bg-slate-800 border border-slate-700 text-amber-300 text-xs font-medium flex items-center gap-1.5">
              <Compass className="w-3.5 h-3.5 text-amber-400" />
              <span>Recorrido estimado: {currentRoute.distanceKm}</span>
            </div>
          </div>

        </div>

        {/* 2-Column Layout: Mapbox 3D Map + Synchronized Establishments Sidebar */}
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
                <div className="w-4 h-4 rounded-full bg-gradient-to-tr from-amber-500 to-orange-500 border-2 border-white shadow-md flex items-center justify-center text-[9px]">🍽️</div>
                <span className="font-semibold text-amber-300">Restaurante Agremiado Oficial</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3.5 h-3.5 rounded-full bg-sky-600 border-2 border-white shadow" />
                <span className="font-medium text-slate-300">Punto Turístico / Paisajístico</span>
              </div>
            </div>

          </div>

          {/* Right Column: Checkpoints & Establishments Sidebar */}
          <div className="lg:col-span-4 p-5 sm:p-6 bg-slate-50 border-l border-slate-200 flex flex-col justify-between space-y-6">
            
            <div className="flex-1 flex flex-col min-h-0">
              {/* Route Heading */}
              <div className="mb-4">
                <span className="text-[11px] font-bold uppercase tracking-wider text-amber-700">
                  {currentRoute.tag}
                </span>
                <h3 className="text-base font-bold text-slate-900 mt-0.5">
                  Eje: {currentRoute.name}
                </h3>
                <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                  {currentRoute.description}
                </p>
              </div>

              {/* Establishments & Stops Header */}
              <div className="flex items-center justify-between mb-2.5">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-700 flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5 text-amber-600" />
                  Paradas & Agremiados de la Ruta ({restaurantsInCurrentEje.length})
                </span>
                <span className="text-xs text-slate-500 font-medium">
                  {currentRoute.distanceKm}
                </span>
              </div>

              {/* Scrollable Establishments List */}
              <div ref={sidebarContainerRef} className="space-y-2.5 overflow-y-auto max-h-[380px] pr-1 flex-1">
                {restaurantsInCurrentEje.map((rest) => {
                  const isSelected = selectedRestaurantId === rest.id;
                  return (
                    <div
                      key={rest.id}
                      id={`sidebar-rest-${rest.id}`}
                      onClick={() => handleSidebarRestaurantClick(rest)}
                      className={`p-3 rounded-2xl border transition-all cursor-pointer ${
                        isSelected
                          ? 'bg-white border-amber-500 shadow-lg scale-[1.02] ring-2 ring-amber-500/20'
                          : 'bg-white border-slate-200 hover:border-amber-300 hover:bg-amber-50/30'
                      }`}
                    >
                      <div className="flex items-start gap-3">
                        {/* Thumbnail */}
                        <div className="w-12 h-12 rounded-xl overflow-hidden bg-slate-100 shrink-0 border border-slate-200">
                          <img 
                            src={rest.coverImage || '/images/default-cover.jpg'} 
                            alt={rest.name} 
                            className="w-full h-full object-cover"
                          />
                        </div>

                        {/* Details */}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between gap-1">
                            <h4 className="font-bold text-xs sm:text-sm text-slate-900 truncate">
                              {rest.name}
                            </h4>
                            <span className="text-[10px] font-bold text-amber-700 bg-amber-50 px-1.5 py-0.5 rounded border border-amber-200 shrink-0">
                              ★ {rest.rating || '5.0'}
                            </span>
                          </div>

                          <p className="text-[11px] text-slate-500 truncate mt-0.5">
                            {rest.category || 'Gastronomía'}
                          </p>

                          <p className="text-[10px] text-slate-400 truncate mt-0.5">
                            📍 {rest.location || 'Mérida, Venezuela'}
                          </p>
                        </div>
                      </div>

                      {/* Action Button inside card */}
                      <div className="mt-2.5 pt-2 border-t border-slate-100 flex items-center justify-between text-xs">
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            if (onSelectRestaurantById) onSelectRestaurantById(rest.id);
                          }}
                          className="font-bold text-amber-700 hover:text-amber-800 flex items-center gap-1 transition-colors"
                        >
                          <span>Ver Ficha Oficial</span>
                          <ArrowUpRight className="w-3.5 h-3.5" />
                        </button>

                        <span className="text-[10px] font-bold text-slate-500 flex items-center gap-0.5">
                          <span>Localizar</span>
                          <ChevronRight className="w-3 h-3 text-amber-600" />
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Eje Highlights & Cultural Points */}
            <div className="pt-4 border-t border-slate-200">
              <span className="text-xs font-bold text-slate-800 block mb-2">
                Destacados del Eje:
              </span>
              <div className="space-y-1.5">
                {(currentRoute.highlights || []).map((hl, i) => (
                  <div key={i} className="flex items-center gap-2 text-xs text-slate-600">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                    <span className="truncate">{hl}</span>
                  </div>
                ))}
              </div>
            </div>

          </div>

        </div>

      </div>

    </section>
  );
}
