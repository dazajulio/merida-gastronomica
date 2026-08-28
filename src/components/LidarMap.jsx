import React, { useState, useEffect, useRef } from 'react';
import { 
  MapPin, 
  Mountain, 
  Sparkles, 
  Navigation, 
  Layers, 
  ExternalLink, 
  ArrowUpRight,
  ShieldCheck,
  Compass,
  Star,
  ChevronRight,
  Route as RouteIcon
} from 'lucide-react';
import { LIDAR_ROUTES } from '../data/routesLidarData';
import { RESTAURANTS_DATA } from '../data/restaurantsData';
import L from 'leaflet';

export function LidarMap({ onSelectRestaurantById, t }) {
  const [activeRouteId, setActiveRouteId] = useState('eje-metropolitano');
  const [selectedCheckpoint, setSelectedCheckpoint] = useState(null);
  const mapContainerRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const layerGroupRef = useRef(null);

  const currentRoute = LIDAR_ROUTES.find(r => r.id === activeRouteId) || LIDAR_ROUTES[0];

  // Initialize Map
  useEffect(() => {
    if (!mapContainerRef.current) return;

    if (!mapInstanceRef.current) {
      // Create map centered on Merida city
      const map = L.map(mapContainerRef.current, {
        center: [8.5983, -71.1449],
        zoom: 11,
        zoomControl: false,
      });

      // Add clean, warm, beautiful CartoDB Positron or OSM Voyager tiles
      L.tileLayer('https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png', {
        attribution: '&copy; <a href="https://carto.com/">CARTO</a> | Cámara Gastronómica Mérida',
        maxZoom: 19
      }).addTo(map);

      // Add custom zoom control in top right
      L.control.zoom({ position: 'topright' }).addTo(map);

      mapInstanceRef.current = map;
      layerGroupRef.current = L.layerGroup().addTo(map);
    }

    return () => {
      // clean up on unmount if needed
    };
  }, []);

  // Update Markers & Polylines when activeRouteId changes
  useEffect(() => {
    if (!mapInstanceRef.current || !layerGroupRef.current) return;

    const map = mapInstanceRef.current;
    const layerGroup = layerGroupRef.current;
    layerGroup.clearLayers();

    const latlngs = [];

    // Custom Marker Icons
    const createCustomIcon = (color, number, isRestaurant) => {
      return L.divIcon({
        className: 'custom-map-pin',
        html: `
          <div style="
            background: ${isRestaurant ? '#c2410c' : '#0284c7'};
            color: white;
            width: 32px;
            height: 32px;
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            font-weight: 700;
            font-size: 12px;
            border: 3px solid white;
            box-shadow: 0 4px 12px rgba(0,0,0,0.25);
            cursor: pointer;
            transition: transform 0.2s;
          ">
            ${number}
          </div>
        `,
        iconSize: [32, 32],
        iconAnchor: [16, 16],
        popupAnchor: [0, -18]
      });
    };

    currentRoute.checkpoints.forEach((cp, idx) => {
      const isRestaurant = cp.type === 'restaurant';
      const marker = L.marker([cp.lat, cp.lng], {
        icon: createCustomIcon(currentRoute.color, idx + 1, isRestaurant)
      });

      latlngs.push([cp.lat, cp.lng]);

      // Popup Content
      const popupHtml = `
        <div style="padding: 12px; min-width: 220px; font-family: 'Plus Jakarta Sans', sans-serif;">
          <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 4px;">
            <span style="font-size: 10px; font-weight: 700; color: ${isRestaurant ? '#c2410c' : '#0284c7'}; text-transform: uppercase; letter-spacing: 0.5px;">
              ${isRestaurant ? '⭐ Restaurante Afiliado' : '📍 Punto de Interés'}
            </span>
            <span style="font-size: 11px; font-weight: 700; background: #f1f5f9; padding: 2px 6px; border-radius: 4px; color: #334155;">
              ${cp.alt} msnm
            </span>
          </div>
          <h4 style="font-size: 14px; font-weight: 700; color: #0f172a; margin: 0 0 4px 0;">${cp.name}</h4>
          <p style="font-size: 11px; color: #64748b; margin: 0 0 8px 0;">Coordenadas: ${cp.lat.toFixed(4)}° N, ${cp.lng.toFixed(4)}° W</p>
          ${cp.refId ? `<button id="btn-popup-${cp.refId}" style="width: 100%; background: #d97706; color: white; border: none; padding: 6px 10px; border-radius: 8px; font-size: 11px; font-weight: 700; cursor: pointer;">Ver Ficha Completa →</button>` : ''}
        </div>
      `;

      marker.bindPopup(popupHtml);

      marker.on('click', () => {
        setSelectedCheckpoint(cp);
      });

      marker.on('popupopen', () => {
        if (cp.refId) {
          const btn = document.getElementById(`btn-popup-${cp.refId}`);
          if (btn) {
            btn.onclick = () => onSelectRestaurantById(cp.refId);
          }
        }
      });

      layerGroup.addLayer(marker);
    });

    // Draw route polyline
    if (latlngs.length > 1) {
      const polyline = L.polyline(latlngs, {
        color: '#d97706',
        weight: 4,
        opacity: 0.8,
        dashArray: '8, 8',
        lineCap: 'round'
      });
      layerGroup.addLayer(polyline);

      // Fit map bounds
      map.fitBounds(latlngs, { padding: [50, 50], maxZoom: 13 });
    } else if (latlngs.length === 1) {
      map.setView(latlngs[0], 12);
    }
  }, [activeRouteId, currentRoute, onSelectRestaurantById]);

  return (
    <section className="py-12 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      
      {/* Header */}
      <div className="text-center max-w-3xl mx-auto mb-10">
        <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-amber-100 border border-amber-300 text-amber-900 text-xs font-semibold mb-3 shadow-sm">
          <RouteIcon className="w-3.5 h-3.5 text-amber-700" />
          <span>Geolocalización & Rutas del Sabor</span>
        </div>
        <h2 className="font-serif text-3xl sm:text-5xl font-bold text-slate-900 tracking-tight">
          Mapa de la Ruta Gastronómica de Mérida
        </h2>
        <p className="mt-3 text-slate-600 text-sm sm:text-base">
          Explore los 5 ejes territoriales del estado Mérida, desde el calor lacustre de Palmarito hasta la Sierra Nevada a más de 4.700 metros de altitud.
        </p>
      </div>

      {/* Main Map Box */}
      <div className="rounded-3xl bg-white border border-slate-200 shadow-xl overflow-hidden">
        
        {/* Top Route Selector */}
        <div className="p-4 sm:p-6 bg-slate-50 border-b border-slate-200 flex flex-wrap items-center justify-between gap-4">
          
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-xs font-semibold text-slate-700 uppercase tracking-wider mr-1 flex items-center gap-1">
              <Layers className="w-3.5 h-3.5 text-amber-600" />
              Seleccionar Eje:
            </span>
            {LIDAR_ROUTES.map((route) => (
              <button
                key={route.id}
                onClick={() => {
                  setActiveRouteId(route.id);
                  setSelectedCheckpoint(null);
                }}
                className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all flex items-center gap-2 ${
                  activeRouteId === route.id
                    ? 'bg-amber-600 text-white shadow-md shadow-amber-600/20 scale-105'
                    : 'bg-white text-slate-700 border border-slate-200 hover:border-amber-400 hover:text-amber-700'
                }`}
              >
                <div 
                  className="w-2.5 h-2.5 rounded-full"
                  style={{ backgroundColor: activeRouteId === route.id ? '#ffffff' : '#d97706' }}
                />
                <span>{route.name.split(':')[1] || route.name}</span>
              </button>
            ))}
          </div>

          <div className="flex items-center gap-3">
            <div className="px-3.5 py-1.5 rounded-xl bg-amber-50 border border-amber-200 text-amber-900 text-xs font-semibold flex items-center gap-1.5">
              <Mountain className="w-4 h-4 text-amber-600" />
              <span>Altitud: {currentRoute.altitudeSpan}</span>
            </div>
          </div>

        </div>

        {/* 2-Column Layout: Real Leaflet Map + Interactive Route Sidebar */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-0">
          
          {/* Left Column: Real Map */}
          <div className="lg:col-span-8 relative min-h-[460px] lg:min-h-[580px] w-full">
            <div ref={mapContainerRef} className="absolute inset-0 w-full h-full" />
            
            {/* Map Legend Floating Tag */}
            <div className="absolute bottom-4 left-4 z-[400] bg-white/95 backdrop-blur-md px-3.5 py-2.5 rounded-2xl border border-slate-200 shadow-md text-xs space-y-1.5">
              <div className="flex items-center gap-2">
                <div className="w-3.5 h-3.5 rounded-full bg-terracotta border-2 border-white shadow" />
                <span className="font-medium text-slate-700">Restaurante / Ficha de Autor</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3.5 h-3.5 rounded-full bg-sky-600 border-2 border-white shadow" />
                <span className="font-medium text-slate-700">Paraje Turístico / Cumbre</span>
              </div>
            </div>
          </div>

          {/* Right Column: Checkpoints & Elevation Sidebar */}
          <div className="lg:col-span-4 p-5 sm:p-6 bg-slate-50 border-l border-slate-200 flex flex-col justify-between space-y-6">
            
            <div>
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-bold uppercase tracking-wider text-amber-700">
                  Paradas de la Ruta
                </span>
                <span className="text-xs text-slate-500 font-medium">
                  {currentRoute.distanceKm} aprox.
                </span>
              </div>

              <div className="space-y-2.5 max-h-[320px] overflow-y-auto pr-1">
                {currentRoute.checkpoints.map((cp, idx) => {
                  const isSelected = selectedCheckpoint?.name === cp.name;
                  const isRest = cp.type === 'restaurant';
                  return (
                    <div
                      key={idx}
                      onClick={() => {
                        setSelectedCheckpoint(cp);
                        if (mapInstanceRef.current) {
                          mapInstanceRef.current.flyTo([cp.lat, cp.lng], 13, { duration: 1 });
                        }
                      }}
                      className={`p-3.5 rounded-2xl border transition-all cursor-pointer ${
                        isSelected
                          ? 'bg-white border-amber-500 shadow-md scale-[1.02]'
                          : 'bg-white border-slate-200 hover:border-amber-300'
                      }`}
                    >
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex items-start gap-2.5">
                          <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold text-white shrink-0 mt-0.5 ${
                            isRest ? 'bg-terracotta' : 'bg-sky-600'
                          }`}>
                            {idx + 1}
                          </div>
                          <div>
                            <h4 className="font-bold text-xs sm:text-sm text-slate-900 leading-snug">
                              {cp.name}
                            </h4>
                            <p className="text-[11px] text-slate-500 mt-0.5">
                              {isRest ? 'Restaurante Afiliado Cámara' : 'Atractivo Natural'}
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
                            className="text-xs font-bold text-amber-700 hover:text-amber-800 flex items-center gap-1"
                          >
                            <span>Abrir Ficha de Restaurante</span>
                            <ArrowUpRight className="w-3 h-3" />
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
              <span className="text-xs font-bold text-slate-700 block mb-2">
                Perfil de Altura del Eje ({currentRoute.altitudeSpan}):
              </span>
              
              <div className="h-20 w-full bg-white rounded-xl p-2 border border-slate-200 flex items-end justify-between gap-1">
                {currentRoute.elevationProfile.map((pt, idx) => {
                  const maxAlt = 4765;
                  const heightPercent = Math.max(20, Math.min(100, (pt.alt / maxAlt) * 100));
                  return (
                    <div key={idx} className="flex-1 flex flex-col items-center gap-1 group">
                      <div 
                        style={{ height: `${heightPercent}%` }}
                        className="w-full rounded-t-md bg-gradient-to-t from-amber-600 to-amber-400 group-hover:brightness-110 transition-all"
                        title={`${pt.label}: ${pt.alt} msnm`}
                      />
                      <span className="text-[8px] font-medium text-slate-500 truncate max-w-[45px] text-center">
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
