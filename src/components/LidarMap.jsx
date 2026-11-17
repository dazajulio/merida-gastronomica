import React, { useState, useEffect, useRef, useMemo } from 'react';
import { 
  MapPin, 
  ExternalLink, 
  Search, 
  Navigation,
  ChevronRight,
  Compass
} from 'lucide-react';
import L from 'leaflet';
import { RESTAURANTS_DATA } from '../data/restaurantsData';

/**
 * LIVE COORDINATES RESOLVER
 * Resuelve de forma segura las coordenadas de cualquier establecimiento.
 */
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
          return { lat: parsed.lat, lng: parsed.lng };
        }
      }
    } catch (e) {}
  }
  if (restData.coordinates && typeof restData.coordinates.lat === 'number' && typeof restData.coordinates.lng === 'number' && !isNaN(restData.coordinates.lat) && !isNaN(restData.coordinates.lng)) {
    return { lat: restData.coordinates.lat, lng: restData.coordinates.lng };
  }
  if (typeof restData.latitude === 'number' && typeof restData.longitude === 'number' && !isNaN(restData.latitude) && !isNaN(restData.longitude)) {
    return { lat: restData.latitude, lng: restData.longitude };
  }
  if (typeof restData.lat === 'number' && typeof restData.lng === 'number' && !isNaN(restData.lat) && !isNaN(restData.lng)) {
    return { lat: restData.lat, lng: restData.lng };
  }
  return { lat: 8.5956, lng: -71.1437 };
};

// Dispersa levemente coordenadas idénticas para que todos los pines sean visibles
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
    const radius = 0.00035 * Math.sqrt(count);
    const latOffset = base.lat + radius * Math.cos(angle);
    const lngOffset = base.lng + (radius * Math.sin(angle)) / Math.cos(base.lat * Math.PI / 180);

    return {
      ...rest,
      mapCoords: { lat: latOffset, lng: lngOffset }
    };
  }).filter(Boolean);
};

export function LidarMap({ 
  restaurants: propRestaurants, 
  onSelectRestaurantById, 
  focusedRestaurantId 
}) {
  const mapContainerRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const markersLayerRef = useRef(null);

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedRestId, setSelectedRestId] = useState(focusedRestaurantId || null);

  const allRestaurants = useMemo(() => {
    const source = Array.isArray(propRestaurants) && propRestaurants.length > 0 
      ? propRestaurants 
      : RESTAURANTS_DATA;
    return getDispersedRestaurants(source);
  }, [propRestaurants]);

  const filteredRestaurants = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    if (!q) return allRestaurants;
    return allRestaurants.filter(r =>
      (r.name && r.name.toLowerCase().includes(q)) ||
      (r.zone && r.zone.toLowerCase().includes(q)) ||
      (r.municipio && r.municipio.toLowerCase().includes(q)) ||
      (r.category && r.category.toLowerCase().includes(q))
    );
  }, [allRestaurants, searchQuery]);

  // Inicializar mapa 2D ligero con Leaflet + CartoDB Voyager
  useEffect(() => {
    if (!mapContainerRef.current || mapInstanceRef.current) return;

    const map = L.map(mapContainerRef.current, {
      center: [8.5956, -71.1437],
      zoom: 13,
      zoomControl: true,
      scrollWheelZoom: false
    });

    // Tiles claros y cálidos (CartoDB Voyager)
    L.tileLayer('https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png', {
      attribution: '&copy; OpenStreetMap &copy; CARTO',
      subdomains: 'abcd',
      maxZoom: 19
    }).addTo(map);

    markersLayerRef.current = L.layerGroup().addTo(map);
    mapInstanceRef.current = map;

    return () => {
      map.remove();
      mapInstanceRef.current = null;
      markersLayerRef.current = null;
    };
  }, []);

  // Renderizar marcadores 2D limpios en color terracota
  useEffect(() => {
    const map = mapInstanceRef.current;
    const layer = markersLayerRef.current;
    if (!map || !layer) return;

    layer.clearLayers();

    filteredRestaurants.forEach((rest) => {
      const { lat, lng } = rest.mapCoords;
      const isSelected = selectedRestId === rest.id;

      const customIcon = L.divIcon({
        className: 'custom-2d-pin',
        html: `
          <div style="
            width: ${isSelected ? '34px' : '26px'};
            height: ${isSelected ? '34px' : '26px'};
            background: ${isSelected ? '#1E1C1A' : '#C85A32'};
            border: 3px solid #FFFFFF;
            border-radius: 50%;
            box-shadow: 0 4px 12px rgba(0,0,0,0.22);
            display: flex;
            align-items: center;
            justify-content: center;
            color: white;
            font-weight: bold;
            font-size: 11px;
            transition: all 0.2s ease;
          ">
            <span style="width:6px;height:6px;background:white;border-radius:50%;"></span>
          </div>
        `,
        iconSize: [isSelected ? 34 : 26, isSelected ? 34 : 26],
        iconAnchor: [isSelected ? 17 : 13, isSelected ? 17 : 13]
      });

      const googleMapsUrl = `https://www.google.com/maps/search/?api=1&query=${lat},${lng}`;
      const marker = L.marker([lat, lng], { icon: customIcon });

      const popupContent = `
        <div style="font-family: 'Montserrat', sans-serif; min-width: 210px; padding: 4px;">
          <div style="font-size: 10px; font-weight: 700; color: #C85A32; text-transform: uppercase; letter-spacing: 0.08em;">
            ${rest.category || 'Agremiado CGEM'}
          </div>
          <div style="font-family: 'Playfair Display', serif; font-size: 15px; font-weight: 700; color: #1E1C1A; margin: 2px 0 4px;">
            ${rest.name}
          </div>
          <div style="font-size: 11px; color: #5C554E; margin-bottom: 10px;">
            ${rest.address || rest.zone || 'Mérida, Venezuela'}
          </div>
          <div style="display: flex; gap: 6px;">
            <a href="${googleMapsUrl}" target="_blank" rel="noopener noreferrer"
               style="flex: 1; text-align: center; background: #C85A32; color: white; padding: 6px 10px; border-radius: 999px; font-size: 11px; font-weight: 700; text-decoration: none;">
              Google Maps ↗
            </a>
            <button id="popup-view-${rest.id}" type="button"
               style="background: #FAF7F2; color: #1E1C1A; border: 1px solid #DED5C5; padding: 6px 10px; border-radius: 999px; font-size: 11px; font-weight: 600; cursor: pointer;">
              Ver Ficha
            </button>
          </div>
        </div>
      `;

      marker.bindPopup(popupContent);

      marker.on('popupopen', () => {
        setSelectedRestId(rest.id);
        const btn = document.getElementById(`popup-view-${rest.id}`);
        if (btn && onSelectRestaurantById) {
          btn.onclick = () => onSelectRestaurantById(rest.id);
        }
      });

      marker.addTo(layer);

      if (isSelected) {
        map.flyTo([lat, lng], 15, { duration: 0.7 });
      }
    });
  }, [filteredRestaurants, selectedRestId, onSelectRestaurantById]);

  const handleSelectItem = (rest) => {
    setSelectedRestId(rest.id);
    if (mapInstanceRef.current) {
      mapInstanceRef.current.flyTo([rest.mapCoords.lat, rest.mapCoords.lng], 15, { duration: 0.7 });
    }
  };

  return (
    <div className="w-full">
      {/* Clean Editorial Header */}
      <div className="flex flex-col md:flex-row items-start md:items-end justify-between mb-8 gap-4">
        <div>
          <span className="text-[11px] font-bold uppercase tracking-[0.2em] text-[#C85A32] block mb-1.5">
            Ubicación Rápida
          </span>
          <h2 className="font-playfair text-3xl sm:text-4xl font-bold text-[#1E1C1A] tracking-tight">
            Mapa de <span className="italic font-normal text-[#C85A32]">Ubicación</span> &amp; Google Maps
          </h2>
          <p className="text-xs sm:text-sm text-[#5C554E] mt-1.5 max-w-2xl font-sans">
            Encuentra cada establecimiento en nuestro mapa 2D ligero o abre tu ruta directamente en Google Maps con un solo clic.
          </p>
        </div>

        <a
          href="https://www.google.com/maps/search/Restaurantes+M%C3%A9rida+Venezuela/@8.5956,-71.1437,13z"
          target="_blank"
          rel="noopener noreferrer"
          className="px-5 py-2.5 rounded-full bg-white hover:bg-[#FAF3EB] text-[#1E1C1A] border border-[#DED5C5] text-xs font-semibold flex items-center gap-2 shadow-2xs transition-all shrink-0"
        >
          <Navigation className="w-3.5 h-3.5 text-[#C85A32]" />
          <span>Abrir Mérida en Google Maps</span>
          <ExternalLink className="w-3.5 h-3.5 text-[#7A7168]" />
        </a>
      </div>

      {/* Main 2-Column Clean Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
        
        {/* Left List & Search (4 cols) */}
        <div className="lg:col-span-4 bg-white rounded-3xl border border-[#EAE3D5] p-4 shadow-2xs flex flex-col h-[460px]">
          <div className="relative mb-3">
            <Search className="w-4 h-4 text-[#8C8277] absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Buscar establecimiento o zona..."
              className="w-full pl-10 pr-4 py-2.5 rounded-full bg-[#FAF7F2] border border-[#EAE3D5] text-xs text-[#1E1C1A] placeholder-[#8C8277] focus:outline-none focus:border-[#C85A32] transition-colors"
            />
          </div>

          <div className="flex-1 overflow-y-auto space-y-2 pr-1">
            {filteredRestaurants.length === 0 ? (
              <div className="text-center py-10 text-xs text-[#8C8277]">
                No se encontraron establecimientos.
              </div>
            ) : (
              filteredRestaurants.map((rest) => {
                const isSelected = selectedRestId === rest.id;
                const { lat, lng } = rest.mapCoords;
                const googleMapsUrl = `https://www.google.com/maps/search/?api=1&query=${lat},${lng}`;

                return (
                  <div
                    key={rest.id}
                    onClick={() => handleSelectItem(rest)}
                    className={`p-3 rounded-2xl border cursor-pointer transition-all ${
                      isSelected
                        ? 'bg-[#FAF3EB] border-[#C85A32]/50 shadow-2xs'
                        : 'bg-[#FAF7F2]/60 border-transparent hover:bg-[#FAF7F2] hover:border-[#EAE3D5]'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div className="min-w-0">
                        <h4 className="font-playfair font-bold text-sm text-[#1E1C1A] truncate">
                          {rest.name}
                        </h4>
                        <p className="text-[11px] text-[#7A7168] flex items-center gap-1 mt-0.5 truncate">
                          <MapPin className="w-3 h-3 text-[#C85A32] shrink-0" />
                          <span className="truncate">{rest.zone || rest.municipio || 'Mérida'}</span>
                        </p>
                      </div>
                      <a
                        href={googleMapsUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={(e) => e.stopPropagation()}
                        title="Cómo llegar en Google Maps"
                        className="px-2.5 py-1 rounded-full bg-white border border-[#EAE3D5] hover:border-[#C85A32] text-[10px] font-bold text-[#C85A32] flex items-center gap-1 shrink-0 transition-colors"
                      >
                        <span>Maps</span>
                        <ExternalLink className="w-2.5 h-2.5" />
                      </a>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* Right 2D Lightweight Leaflet Map (8 cols) */}
        <div className="lg:col-span-8 bg-white rounded-3xl border border-[#EAE3D5] p-2 shadow-2xs h-[460px] relative overflow-hidden">
          <div 
            ref={mapContainerRef} 
            className="w-full h-full rounded-2xl z-10"
            style={{ background: '#FAF7F2' }}
          />
          <div className="absolute bottom-4 left-4 z-20 bg-white/95 backdrop-blur-sm px-3 py-1.5 rounded-full border border-[#EAE3D5] shadow-sm text-[11px] font-semibold text-[#5C554E] flex items-center gap-1.5 pointer-events-none">
            <Compass className="w-3.5 h-3.5 text-[#C85A32]" />
            <span>{filteredRestaurants.length} ubicaciones activas</span>
          </div>
        </div>

      </div>
    </div>
  );
}
