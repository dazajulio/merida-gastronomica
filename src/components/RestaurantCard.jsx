import React from 'react';
import { 
  Star, 
  MapPin, 
  ChefHat, 
  ShieldCheck, 
  ArrowUpRight, 
  Mountain, 
  Sparkles
} from 'lucide-react';

export function RestaurantCard({ restaurant, onSelect, onBookDirect, t }) {
  return (
    <div className="group relative rounded-3xl bg-white border border-slate-200 overflow-hidden hover:border-amber-400 hover:shadow-card-hover transition-all duration-300 flex flex-col justify-between">
      
      {/* Image & Badges */}
      <div className="relative h-60 w-full overflow-hidden bg-slate-100">
        <img 
          src={restaurant.coverImage} 
          alt={restaurant.name} 
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/60 via-transparent to-black/20" />
        
        {/* Top Badges */}
        <div className="absolute top-3 left-3 right-3 flex items-center justify-between gap-2">
          {restaurant.isCertifiedByCamara && (
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-white/95 text-amber-900 border border-amber-300 backdrop-blur-md shadow-sm">
              <ShieldCheck className="w-3.5 h-3.5 text-amber-600" />
              <span>Sello Oficial Cámara</span>
            </span>
          )}

          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-slate-900/80 text-white backdrop-blur-md ml-auto">
            <Mountain className="w-3.5 h-3.5 text-sky-400" />
            <span>{restaurant.altitude} msnm</span>
          </span>
        </div>

        {/* Bottom Tag inside Image */}
        <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between">
          <span className="text-xs font-bold px-3 py-1 rounded-lg bg-amber-500 text-white shadow-sm">
            {restaurant.category}
          </span>
          <span className="text-xs font-bold text-white bg-black/50 px-2 py-0.5 rounded-md backdrop-blur-sm">
            {restaurant.priceTier}
          </span>
        </div>
      </div>

      {/* Body Content */}
      <div className="p-6 flex-1 flex flex-col justify-between">
        <div>
          {/* Title and Rating */}
          <div className="flex items-start justify-between gap-2">
            <h3 className="font-serif text-xl font-bold text-slate-900 group-hover:text-amber-700 transition-colors leading-snug">
              {restaurant.name}
            </h3>
            <div className="flex items-center gap-1 bg-amber-50 px-2.5 py-1 rounded-lg border border-amber-200 shrink-0">
              <Star className="w-3.5 h-3.5 fill-amber-500 text-amber-500" />
              <span className="text-xs font-bold text-slate-900">{restaurant.rating}</span>
              <span className="text-[10px] text-slate-500">({restaurant.reviewsCount})</span>
            </div>
          </div>

          {/* Location */}
          <div className="flex items-center gap-1.5 text-xs text-slate-600 mt-2">
            <MapPin className="w-3.5 h-3.5 text-terracotta shrink-0" />
            <span className="truncate">{restaurant.location}</span>
          </div>

          {/* Chef Tag */}
          <div className="flex items-center gap-2 mt-3 pt-3 border-t border-slate-100 text-xs text-slate-600">
            <ChefHat className="w-4 h-4 text-amber-600 shrink-0" />
            <span className="font-semibold text-slate-800">{restaurant.chef}</span>
            {restaurant.badge && (
              <span className="ml-auto text-[10px] font-bold uppercase px-2 py-0.5 rounded bg-amber-100 text-amber-900 border border-amber-200 truncate">
                {restaurant.badge}
              </span>
            )}
          </div>

          {/* Signature Dish Preview */}
          {restaurant.signatureDishes && restaurant.signatureDishes[0] && (
            <div className="mt-3 p-3 rounded-2xl bg-amber-50/70 border border-amber-200/80 text-xs">
              <div className="text-[10px] uppercase font-bold text-amber-800 tracking-wider flex items-center gap-1">
                <Sparkles className="w-3 h-3 text-amber-600" />
                Especialidad Insignia
              </div>
              <p className="text-slate-800 font-serif italic mt-0.5 line-clamp-1">
                "{restaurant.signatureDishes[0].name}"
              </p>
            </div>
          )}
        </div>

        {/* Card Footer Actions */}
        <div className="mt-5 pt-4 border-t border-slate-100 flex items-center gap-2">
          <button
            onClick={() => onSelect(restaurant)}
            className="flex-1 py-2.5 px-3 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold transition-all flex items-center justify-center gap-1.5 border border-slate-200"
          >
            <span>Ver Ficha Completa</span>
            <ArrowUpRight className="w-3.5 h-3.5 text-amber-600" />
          </button>

          <button
            onClick={() => onBookDirect(restaurant)}
            className="py-2.5 px-4 rounded-xl bg-amber-500 hover:bg-amber-600 text-white text-xs font-bold transition-all shrink-0 shadow-sm"
          >
            <span>Reservar</span>
          </button>
        </div>

      </div>

    </div>
  );
}
