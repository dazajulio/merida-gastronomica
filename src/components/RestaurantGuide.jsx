import React, { useState, useMemo } from 'react';
import { 
  Search, 
  Star, 
  Utensils,
  ArrowRight,
  Compass
} from 'lucide-react';
import { GASTRONOMIC_CATEGORIES } from './AffiliateDashboard';

export const RESTAURANT_FOOD_TYPES = [
  { id: 'all', label: 'Todos los Restaurantes' },
  { id: 'regional', label: 'Comida Típica Regional', match: ['típica', 'regional', 'andina', 'campestre'] },
  { id: 'autor', label: 'Cocina de Autor', match: ['autor'] },
  { id: 'alta', label: 'Alta Cocina', match: ['alta cocina', 'gourmet'] },
  { id: 'internacional', label: 'Cocina Internacional & Italiana', match: ['internacional', 'italiana', 'pasta', 'fusión'] },
  { id: 'bistro', label: 'Bistró, Pizza & Tascas', match: ['bistró', 'bistro', 'pizza', 'tasca'] },
  { id: 'familiar', label: 'Familiares, Temáticos & Rápida', match: ['familiar', 'temático', 'rápida', 'food truck'] },
];

export const isClassifiedRestaurant = (rest) => {
  if (!rest) return false;
  const cat = (rest.category || rest.categoria_negocio || '').toLowerCase();
  const restaurantKeywords = [
    'restaurante',
    'bistró',
    'bistro',
    'alta cocina',
    'cocina de autor',
    'cocina internacional',
    'comida típica',
    'cocina italiana',
    'tasca',
    'comida rápida',
    'food truck',
    'asador',
    'parrilla',
    'pizzería',
    'pizza',
    'trattoria',
  ];
  return restaurantKeywords.some((kw) => cat.includes(kw));
};

export function RestaurantGuide({ 
  restaurants = [], 
  onSelectRestaurant, 
  onViewOnMap,
  t, 
  initialSearch = '',
  mode = 'restaurants' // 'restaurants' | 'providers'
}) {
  const [searchTerm, setSearchTerm] = useState(initialSearch);
  const [selectedEje, setSelectedEje] = useState('all');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedFoodType, setSelectedFoodType] = useState('all');
  const [sortBy, setSortBy] = useState('rating');

  const isRestaurantsOnly = mode === 'restaurants';

  const ejes = [
    { id: 'all', name: 'Todos los Ejes Territoriales' },
    { id: 'merida', name: 'Mérida (Área Metropolitana)' },
    { id: 'valle-san-javier', name: 'El Valle de San Javier' },
    { id: 'paramo', name: 'Páramo Andino & Sierra Nevada' },
    { id: 'mocoties', name: 'Valle del Mocotíes & Ruta del Café' },
    { id: 'pueblos-sur', name: 'Pueblos del Sur' },
    { id: 'panamericano', name: 'Panamericano & Cacao' }
  ];

  // Base list depending on mode
  const baseList = useMemo(() => {
    const list = Array.isArray(restaurants) ? restaurants : [];
    return isRestaurantsOnly ? list.filter(isClassifiedRestaurant) : list;
  }, [restaurants, isRestaurantsOnly]);

  // Extraer categorías dinámicas para el modo Prestadores de Servicios
  const dynamicCategories = useMemo(() => {
    const set = new Set();
    if (!isRestaurantsOnly && Array.isArray(GASTRONOMIC_CATEGORIES)) {
      GASTRONOMIC_CATEGORIES.forEach(c => {
        if (c && typeof c === 'string' && c.trim()) set.add(c.trim());
      });
    }
    baseList.forEach(r => {
      if (r && r.category && typeof r.category === 'string' && r.category.trim()) {
        set.add(r.category.trim());
      }
    });
    const sorted = Array.from(set).sort((a, b) => a.localeCompare(b, 'es', { sensitivity: 'base' }));
    return ['all', ...sorted];
  }, [baseList, isRestaurantsOnly]);

  const filteredRestaurants = useMemo(() => {
    const search = (searchTerm || '').trim().toLowerCase();
    const selCategory = (selectedCategory || 'all').toLowerCase().trim();
    const foodTypeObj = RESTAURANT_FOOD_TYPES.find(ft => ft.id === selectedFoodType);

    return baseList.filter((rest) => {
      if (!rest) return false;

      const rName = (rest.name || '').toLowerCase();
      const rChef = (rest.chef || '').toLowerCase();
      const rLocation = (rest.location || rest.zone || rest.municipio || '').toLowerCase();
      const rCategory = (rest.category || rest.categoria_negocio || '').toLowerCase();
      const rTagline = (rest.tagline || rest.description || '').toLowerCase();
      const dishes = Array.isArray(rest.signatureDishes) ? rest.signatureDishes : [];

      const matchSearch = search === '' || 
        rName.includes(search) ||
        rChef.includes(search) ||
        rLocation.includes(search) ||
        rCategory.includes(search) ||
        rTagline.includes(search) ||
        dishes.some(d => d && (d.name || '').toLowerCase().includes(search));

      const matchEje = selectedEje === 'all' || rest.eje === selectedEje;
      
      let matchTypeOrCat = true;
      if (isRestaurantsOnly) {
        if (selectedFoodType !== 'all' && foodTypeObj?.match) {
          matchTypeOrCat = foodTypeObj.match.some(kw => rCategory.includes(kw) || rTagline.includes(kw));
        }
      } else {
        matchTypeOrCat = selCategory === 'all' || 
          rCategory === selCategory ||
          rCategory.includes(selCategory) ||
          selCategory.includes(rCategory);
      }

      return matchSearch && matchEje && matchTypeOrCat;
    }).sort((a, b) => {
      if (sortBy === 'rating') return (b.rating || 5) - (a.rating || 5);
      if (sortBy === 'name') return (a.name || '').localeCompare(b.name || '', 'es');
      return 0;
    });
  }, [baseList, searchTerm, selectedEje, selectedCategory, selectedFoodType, isRestaurantsOnly, sortBy]);

  return (
    <section className="py-12 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      
      {/* Warm Editorial Header */}
      <div className="text-center max-w-3xl mx-auto mb-10">
        <span className="inline-block text-[11px] font-bold uppercase tracking-[0.22em] text-[#C85A32] mb-2">
          {isRestaurantsOnly ? 'Selección Culinaria Oficial' : 'Ecosistema Oficial CGEM'}
        </span>
        <h2 className="font-playfair text-3xl sm:text-5xl font-bold text-[#1E1C1A] tracking-tight leading-tight">
          {isRestaurantsOnly ? (
            <>Guía de <span className="italic font-normal text-[#C85A32]">Restaurantes</span></>
          ) : (
            <>Guía de Prestadores de <span className="italic font-normal text-[#C85A32]">Servicios en Mérida</span></>
          )}
        </h2>
        <p className="mt-3 text-[#5C554E] text-xs sm:text-sm leading-relaxed font-sans">
          {isRestaurantsOnly
            ? 'Explora los restaurantes certificados del Estado Mérida clasificados según su tipo de cocina y propuesta gastronómica.'
            : 'Directorio integral de restaurantes, cafeterías, pastelerías, posadas, academias, productores y prestadores turísticos de Mérida.'}
        </p>
      </div>

      {/* Filter Control Bar */}
      <div className="p-5 sm:p-6 rounded-3xl bg-white border border-[#EAE3D5] shadow-2xs space-y-4 mb-8">
        
        {/* Search & Primary Dropdowns */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-3 items-center">
          <div className="lg:col-span-6 relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[#C85A32]" />
            <input 
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder={isRestaurantsOnly ? 'Buscar restaurante, especialidad o zona...' : 'Buscar prestador, categoría, café, posada...'}
              className="w-full bg-[#FAF7F2] border border-[#EAE3D5] rounded-full pl-11 pr-4 py-2.5 text-xs text-[#1E1C1A] placeholder-[#8C8277] focus:outline-none focus:border-[#C85A32] focus:bg-white transition-colors"
            />
          </div>

          <div className="lg:col-span-3">
            <select
              value={selectedEje}
              onChange={(e) => setSelectedEje(e.target.value)}
              className="w-full bg-[#FAF7F2] border border-[#EAE3D5] rounded-full px-4 py-2.5 text-xs font-semibold text-[#1E1C1A] focus:outline-none focus:border-[#C85A32]"
            >
              {ejes.map(eje => (
                <option key={eje.id} value={eje.id}>{eje.name}</option>
              ))}
            </select>
          </div>

          {!isRestaurantsOnly ? (
            <div className="lg:col-span-3">
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="w-full bg-[#FAF7F2] border border-[#EAE3D5] rounded-full px-4 py-2.5 text-xs font-semibold text-[#1E1C1A] focus:outline-none focus:border-[#C85A32]"
              >
                {dynamicCategories.map(cat => (
                  <option key={cat} value={cat}>
                    {cat === 'all' ? 'Todas las Categorías' : cat}
                  </option>
                ))}
              </select>
            </div>
          ) : (
            <div className="lg:col-span-3">
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="w-full bg-[#FAF7F2] border border-[#EAE3D5] rounded-full px-4 py-2.5 text-xs font-semibold text-[#1E1C1A] focus:outline-none focus:border-[#C85A32]"
              >
                <option value="rating">Ordenar: Destacados primero</option>
                <option value="name">Ordenar: Alfabético (A-Z)</option>
              </select>
            </div>
          )}
        </div>

        {/* Food Type Classification Pills (Solo en Guía de Restaurantes) */}
        {isRestaurantsOnly && (
          <div className="pt-2 border-t border-[#EAE3D5]/70 flex flex-wrap items-center gap-2">
            <span className="text-[11px] font-bold text-[#7A7168] mr-1">Tipo de Comida:</span>
            {RESTAURANT_FOOD_TYPES.map((ft) => {
              const active = selectedFoodType === ft.id;
              return (
                <button
                  key={ft.id}
                  type="button"
                  onClick={() => setSelectedFoodType(ft.id)}
                  className={`px-3.5 py-1.5 rounded-full text-[11px] font-semibold transition-all ${
                    active
                      ? 'bg-[#C85A32] text-white shadow-2xs'
                      : 'bg-[#FAF7F2] text-[#5C554E] hover:bg-[#FAF3EB] hover:text-[#1E1C1A] border border-[#EAE3D5]'
                  }`}
                >
                  {ft.label}
                </button>
              );
            })}
          </div>
        )}
      </div>

      {/* Results Count */}
      <div className="flex items-center justify-between mb-6 text-xs text-[#7A7168] px-1">
        <div>
          Mostrando <span className="font-bold text-[#C85A32]">{filteredRestaurants.length}</span> {isRestaurantsOnly ? 'restaurantes clasificados' : 'prestadores de servicios registrados'}
        </div>
        {(selectedEje !== 'all' || selectedCategory !== 'all' || selectedFoodType !== 'all' || searchTerm) && (
          <button
            onClick={() => {
              setSelectedEje('all');
              setSelectedCategory('all');
              setSelectedFoodType('all');
              setSearchTerm('');
            }}
            className="text-[#C85A32] hover:underline font-bold"
          >
            Restablecer filtros
          </button>
        )}
      </div>

      {/* Compact Editorial Grid Cards */}
      {filteredRestaurants.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
          {filteredRestaurants.map((restaurant) => {
            const isFeatured = restaurant.isFeatured || restaurant.destacado_portada;
            const imgSrc = restaurant.coverImage || restaurant.image || restaurant.foto_portada || 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=800&q=80';
            const categoryLabel = restaurant.category || restaurant.categoria_negocio || 'Gastronomía';
            const shortDesc = restaurant.description || restaurant.observaciones || `${restaurant.zone || restaurant.municipio || 'Mérida'}, Estado Mérida.`;

            return (
              <div
                key={restaurant.id}
                onClick={() => onSelectRestaurant && onSelectRestaurant(restaurant)}
                className="rounded-2xl bg-white border border-[#EAE3D5] hover:border-[#C85A32]/60 shadow-2xs hover:shadow-md transition-all duration-300 p-2.5 flex flex-col cursor-pointer group"
              >
                <div className="h-40 w-full rounded-xl overflow-hidden bg-[#F2ECE1] relative">
                  <img
                    src={imgSrc}
                    alt={restaurant.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    loading="lazy"
                  />
                  {isFeatured && (
                    <span className="absolute top-2.5 right-2.5 inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[9px] font-bold bg-white/95 text-[#C85A32] shadow-xs border border-[#EAE3D5]">
                      <Star className="w-2.5 h-2.5 fill-[#C85A32] text-[#C85A32]" />
                      <span>Destacado</span>
                    </span>
                  )}
                </div>

                <div className="pt-3 px-1.5 pb-1 flex-1 flex flex-col justify-between gap-2">
                  <div>
                    <span className="inline-block px-2 py-0.5 rounded-full bg-[#C85A32] text-white text-[9px] font-bold tracking-wide mb-1.5 max-w-full truncate">
                      {categoryLabel}
                    </span>

                    <div className="flex items-end justify-between gap-2">
                      <div className="min-w-0 flex-1">
                        <h3 className="font-playfair font-bold text-base text-[#1E1C1A] group-hover:text-[#C85A32] transition-colors truncate">
                          {restaurant.name}
                        </h3>
                        <p className="text-[11px] text-[#5C554E] line-clamp-2 mt-0.5 leading-snug">
                          {shortDesc}
                        </p>
                      </div>

                      <div className="w-8 h-8 rounded-full border border-[#EAE3D5] bg-[#FAF7F2] group-hover:bg-[#C85A32] group-hover:text-white group-hover:border-[#C85A32] text-[#1E1C1A] flex items-center justify-center shrink-0 transition-colors">
                        <ArrowRight className="w-3.5 h-3.5" />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="text-center py-16 px-4 rounded-3xl bg-white border border-[#EAE3D5] shadow-2xs">
          <Utensils className="w-10 h-10 text-[#C85A32] mx-auto mb-3 opacity-70" />
          <h3 className="font-playfair text-xl font-bold text-[#1E1C1A]">
            No se encontraron resultados
          </h3>
          <p className="text-xs text-[#7A7168] mt-1 max-w-sm mx-auto">
            Intenta ajustar los filtros o limpiar el término de búsqueda para explorar más opciones.
          </p>
        </div>
      )}

    </section>
  );
}
