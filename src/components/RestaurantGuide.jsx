import React, { useState, useMemo } from 'react';
import { 
  Search, 
  MapPin, 
  ShieldCheck, 
  Star, 
  Sparkles, 
  Utensils,
  Mountain,
  SlidersHorizontal
} from 'lucide-react';
import { RestaurantCard } from './RestaurantCard';

export function RestaurantGuide({ 
  restaurants, 
  onSelectRestaurant, 
  onBookDirect, 
  onViewOnMap,
  t, 
  initialSearch = '' 
}) {
  const [searchTerm, setSearchTerm] = useState(initialSearch);
  const [selectedEje, setSelectedEje] = useState('all');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [onlyCertified, setOnlyCertified] = useState(false);
  const [sortBy, setSortBy] = useState('rating');

  const ejes = [
    { id: 'all', name: 'Todos los Ejes' },
    { id: 'metropolitano', name: 'Eje Metropolitano (Mérida Ciudad)' },
    { id: 'paramo', name: 'Eje Páramo (Apartaderos & Mucubají)' },
    { id: 'mocoties', name: 'Eje Valle del Mocotíes' },
    { id: 'pueblos-sur', name: 'Eje Pueblos del Sur' },
    { id: 'panamericano', name: 'Eje Panamericano & Sur del Lago' },
  ];

  const categories = [
    'all',
    'Alta Cocina Andina',
    'Tradición de Montaña',
    'Café de Especialidad',
    'Chocolatería de Origen',
    'Fusión & Carnes',
    'Gastronomía Ancestral'
  ];

  const filteredRestaurants = useMemo(() => {
    return restaurants.filter((rest) => {
      const matchSearch = searchTerm === '' || 
        rest.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        rest.chef.toLowerCase().includes(searchTerm.toLowerCase()) ||
        rest.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
        rest.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
        rest.signatureDishes.some(d => d.name.toLowerCase().includes(searchTerm.toLowerCase()));

      const matchEje = selectedEje === 'all' || rest.eje === selectedEje;
      const matchCategory = selectedCategory === 'all' || rest.category === selectedCategory;
      const matchCertified = !onlyCertified || rest.isCertifiedByCamara;

      return matchSearch && matchEje && matchCategory && matchCertified;
    }).sort((a, b) => {
      if (sortBy === 'rating') return b.rating - a.rating;
      if (sortBy === 'altitude-desc') return b.altitude - a.altitude;
      if (sortBy === 'altitude-asc') return a.altitude - b.altitude;
      if (sortBy === 'reviews') return b.reviewsCount - a.reviewsCount;
      return 0;
    });
  }, [restaurants, searchTerm, selectedEje, selectedCategory, onlyCertified, sortBy]);

  return (
    <section className="py-12 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      
      {/* Header */}
      <div className="text-center max-w-3xl mx-auto mb-10">
        <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-amber-100 border border-amber-300 text-amber-900 text-xs font-bold mb-3 shadow-sm">
          <ShieldCheck className="w-3.5 h-3.5 text-amber-600" />
          <span>Aval Oficial Cámara Gastronómica</span>
        </div>
        <h2 className="font-serif text-3xl sm:text-5xl font-bold text-slate-900 tracking-tight">
          Guía Oficial de Restaurantes & Alta Cocina
        </h2>
        <p className="mt-3 text-slate-600 text-sm sm:text-base">
          Una selección curada con los más altos estándares de calidad, producto de origen andino y servicio de hospitalidad de Mérida.
        </p>
      </div>

      {/* Filter Control Bar */}
      <div className="p-5 sm:p-7 rounded-3xl bg-white border border-slate-200 shadow-md space-y-4 mb-10">
        
        {/* Search Input */}
        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-amber-600" />
          <input 
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Filtrar por nombre, chef, ingrediente, trucha, café..."
            className="w-full bg-slate-50 border border-slate-200 rounded-2xl pl-12 pr-4 py-3.5 text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:border-amber-500 focus:bg-white transition-colors"
          />
          {searchTerm && (
            <button
              onClick={() => setSearchTerm('')}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-xs font-bold text-slate-500 hover:text-slate-900"
            >
              Limpiar
            </button>
          )}
        </div>

        {/* Dropdowns & Toggles */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 pt-2">
          
          {/* Eje Filter */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1">Eje Territorial</label>
            <select
              value={selectedEje}
              onChange={(e) => setSelectedEje(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-xs font-semibold text-slate-800 focus:outline-none focus:border-amber-500 focus:bg-white"
            >
              {ejes.map(eje => (
                <option key={eje.id} value={eje.id}>{eje.name}</option>
              ))}
            </select>
          </div>

          {/* Category Filter */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1">Tipo de Experiencia</label>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-xs font-semibold text-slate-800 focus:outline-none focus:border-amber-500 focus:bg-white"
            >
              {categories.map(cat => (
                <option key={cat} value={cat}>{cat === 'all' ? 'Todas las Categorías' : cat}</option>
              ))}
            </select>
          </div>

          {/* Sorting */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1">Ordenar Por</label>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-xs font-semibold text-slate-800 focus:outline-none focus:border-amber-500 focus:bg-white"
            >
              <option value="rating">Mayor Puntuación</option>
              <option value="reviews">Más Reseñas</option>
              <option value="altitude-desc">Mayor Altitud (msnm)</option>
              <option value="altitude-asc">Menor Altitud (msnm)</option>
            </select>
          </div>

          {/* Certification Toggle */}
          <div className="flex items-end">
            <button
              onClick={() => setOnlyCertified(!onlyCertified)}
              className={`w-full py-2.5 px-3 rounded-xl border text-xs font-bold flex items-center justify-center gap-2 transition-all ${
                onlyCertified
                  ? 'bg-amber-500 text-white border-amber-500 shadow-sm'
                  : 'bg-slate-50 text-slate-700 border-slate-200 hover:border-amber-400'
              }`}
            >
              <ShieldCheck className={`w-4 h-4 ${onlyCertified ? 'text-white' : 'text-amber-600'}`} />
              <span>Solo Certificados Cámara</span>
            </button>
          </div>

        </div>

      </div>

      {/* Results Count */}
      <div className="flex items-center justify-between mb-6 text-xs text-slate-600 px-1">
        <div>
          Mostrando <span className="font-bold text-amber-700">{filteredRestaurants.length}</span> destinos gastronómicos
        </div>
        {(selectedEje !== 'all' || selectedCategory !== 'all' || onlyCertified || searchTerm) && (
          <button
            onClick={() => {
              setSelectedEje('all');
              setSelectedCategory('all');
              setOnlyCertified(false);
              setSearchTerm('');
            }}
            className="text-amber-700 hover:underline font-bold"
          >
            Restablecer todos los filtros
          </button>
        )}
      </div>

      {/* Restaurants Grid */}
      {filteredRestaurants.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredRestaurants.map((restaurant) => (
            <RestaurantCard
              key={restaurant.id}
              restaurant={restaurant}
              onSelect={onSelectRestaurant}
              onBookDirect={onBookDirect}
              onViewOnMap={onViewOnMap}
              t={t}
            />
          ))}
        </div>
      ) : (
        <div className="text-center py-16 px-4 rounded-3xl bg-white border border-slate-200 shadow-sm">
          <Utensils className="w-12 h-12 text-slate-400 mx-auto mb-3" />
          <h3 className="font-serif text-xl font-bold text-slate-900">No se encontraron restaurantes</h3>
          <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
            Intente ajustar los términos de búsqueda o limpiar los filtros para ver más opciones disponibles.
          </p>
        </div>
      )}

    </section>
  );
}
