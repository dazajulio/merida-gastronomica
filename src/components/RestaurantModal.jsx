import React, { useState } from 'react';
import { 
  X, 
  Star, 
  MapPin, 
  Phone, 
  MessageCircle, 
  Clock, 
  ChefHat, 
  ShieldCheck, 
  Sparkles, 
  Utensils,
  Share2,
  Copy,
  Check,
  Compass,
  Globe,
  Instagram,
  ExternalLink
} from 'lucide-react';

export function RestaurantModal({ restaurant, onClose, onViewOnMap }) {
  const [activeImage, setActiveImage] = useState(restaurant?.coverImage);
  const [copiedLink, setCopiedLink] = useState(false);
  const [showShareBar, setShowShareBar] = useState(false);

  if (!restaurant) return null;

  const currentOrigin = typeof window !== 'undefined' ? window.location.origin : 'https://meridagastronomica.com';
  const currentUrl = `${currentOrigin}/?restaurante=${restaurant.slug || restaurant.id}`;
  const shareMessage = `¡Mira *${restaurant.name}* en la Guía Oficial de Mérida Gastronómica! 🍽️✨%0A%0A"${restaurant.tagline}"%0A📍 *Ubicación:* ${restaurant.location}%0A%0A📲 *Ver Ficha Oficial y Canales de Contacto:*%0A${currentUrl}`;

  const handleNativeShare = async () => {
    const shareData = {
      title: `${restaurant.name} | Guía Oficial Mérida Gastronómica`,
      text: `${restaurant.name}: ${restaurant.tagline}. Consulta su carta, fotos y canales oficiales de contacto.`,
      url: currentUrl
    };

    if (navigator.share) {
      try {
        await navigator.share(shareData);
        return;
      } catch (err) {
        if (err.name !== 'AbortError') {
          setShowShareBar(true);
        }
      }
    } else {
      setShowShareBar(!showShareBar);
    }
  };

  const handleCopyLink = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(currentUrl);
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2500);
    }
  };

  const rawPhone = restaurant.phone || restaurant.whatsapp || '';
  const cleanPhone = rawPhone.replace(/[^0-9+]/g, '');
  const cleanWaNumber = cleanPhone.replace(/[^0-9]/g, '');

  const websiteUrl = restaurant.websiteUrl || restaurant.website || restaurant.sitio_web || '';
  const formattedWebsite = websiteUrl ? (websiteUrl.startsWith('http://') || websiteUrl.startsWith('https://') ? websiteUrl : `https://${websiteUrl}`) : '';

  const instagramUser = restaurant.instagram ? restaurant.instagram.replace('@', '') : '';
  const instagramUrl = restaurant.instagramUrl || (instagramUser ? `https://instagram.com/${instagramUser}` : '');

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-3 sm:p-6 overflow-y-auto bg-slate-950/85 backdrop-blur-md animate-fadeIn">
      
      {/* Modal Card Backdrop */}
      <div 
        className="fixed inset-0"
        onClick={onClose}
      />

      {/* Modal Box */}
      <div className="relative w-full max-w-4xl bg-white rounded-3xl shadow-2xl overflow-hidden z-10 flex flex-col max-h-[92vh] border border-slate-200 animate-scaleUp">
        
        {/* Sticky Header Bar */}
        <div className="px-6 py-4 bg-slate-900 text-white flex items-center justify-between gap-4 shrink-0 border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-2xl bg-gradient-to-tr from-amber-600 to-amber-500 flex items-center justify-center text-white font-bold text-sm shadow-md">
              🍽️
            </div>
            <div>
              <h2 className="font-serif text-lg sm:text-xl font-bold text-white tracking-tight leading-snug">
                {restaurant.name}
              </h2>
              <p className="text-xs text-amber-300 line-clamp-1">
                {restaurant.tagline || `${restaurant.category} • Cámara Gastronómica`}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* Direct 3D Map Jump */}
            {onViewOnMap && (
              <button
                onClick={() => {
                  onViewOnMap(restaurant);
                  onClose();
                }}
                className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-amber-300 text-xs font-bold transition-all border border-slate-700"
                title="Ver ubicación en mapa 3D"
              >
                <Compass className="w-3.5 h-3.5 text-amber-400" />
                <span>Ver en Mapa</span>
              </button>
            )}

            {/* Compartir Button */}
            <button
              onClick={handleNativeShare}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-white text-xs font-bold transition-all shadow-sm active:scale-95"
              title="Compartir restaurante"
            >
              <Share2 className="w-3.5 h-3.5" />
              <span>Compartir</span>
            </button>

            <button
              onClick={onClose}
              className="p-2 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Social Sharing Sub-Bar (Visible directly or toggled) */}
        <div className="bg-amber-50/80 px-4 sm:px-6 py-2.5 border-b border-amber-200/80 flex flex-wrap items-center justify-between gap-3 text-xs">
          
          <div className="flex items-center gap-2 text-slate-700 font-semibold">
            <Share2 className="w-4 h-4 text-amber-700" />
            <span>Compartir este restaurante:</span>
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            {/* WhatsApp Share */}
            <a
              href={`https://api.whatsapp.com/send?text=${shareMessage}`}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition-colors shadow-sm"
            >
              <MessageCircle className="w-3.5 h-3.5" />
              <span>Por WhatsApp</span>
            </a>

            {/* Facebook Share */}
            <a
              href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(currentUrl)}`}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold transition-colors shadow-sm"
            >
              <span>Facebook</span>
            </a>

            {/* X / Twitter Share */}
            <a
              href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(`Descubre ${restaurant.name} en la Guía Oficial de Mérida Gastronómica`)}&url=${encodeURIComponent(currentUrl)}`}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold transition-colors shadow-sm"
            >
              <span>X (Twitter)</span>
            </a>

            {/* Copy Link */}
            <button
              onClick={handleCopyLink}
              className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border text-xs font-bold transition-all shadow-sm ${
                copiedLink 
                  ? 'bg-emerald-100 text-emerald-800 border-emerald-300'
                  : 'bg-white text-slate-700 border-slate-300 hover:bg-slate-50'
              }`}
            >
              {copiedLink ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5 text-slate-600" />}
              <span>{copiedLink ? '¡Enlace Copiado!' : 'Copiar Enlace'}</span>
            </button>
          </div>

        </div>

        {/* Scrollable Content Body */}
        <div className="p-4 sm:p-8 overflow-y-auto space-y-8 flex-1">
          
          {/* Gallery Section */}
          <div className="space-y-3">
            <div className="relative h-64 sm:h-96 rounded-2xl overflow-hidden border border-slate-200 shadow-md bg-slate-100">
              <img 
                src={activeImage || restaurant.coverImage} 
                alt={restaurant.name} 
                className="w-full h-full object-cover"
              />
              <div className="absolute top-4 left-4 bg-slate-900/85 backdrop-blur-md px-3.5 py-1.5 rounded-full text-xs font-bold text-white flex items-center gap-1.5 border border-amber-400/40">
                <ShieldCheck className="w-3.5 h-3.5 text-amber-400" />
                <span>{restaurant.category}</span>
              </div>
            </div>

            {/* Thumbnails */}
            {restaurant.gallery && restaurant.gallery.length > 1 && (
              <div className="flex items-center gap-2 overflow-x-auto pb-1">
                {restaurant.gallery.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setActiveImage(img)}
                    className={`relative w-20 h-16 rounded-xl overflow-hidden border-2 shrink-0 transition-all ${
                      activeImage === img ? 'border-amber-500 scale-105 shadow-md' : 'border-transparent opacity-60 hover:opacity-100'
                    }`}
                  >
                    <img src={img} alt="Thumbnail" className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Quick Info Strip */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 p-4 rounded-2xl bg-amber-50/60 border border-amber-200">
            <div>
              <span className="text-[10px] uppercase font-bold text-slate-500">Categoría Gastronómica</span>
              <p className="text-xs font-bold text-amber-900 mt-0.5">{restaurant.category}</p>
            </div>
            <div>
              <span className="text-[10px] uppercase font-bold text-slate-500">Membresía & Aval</span>
              <p className="text-xs font-bold text-emerald-800 mt-0.5 flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 inline" />
                <span>{restaurant.isCertifiedByCamara ? 'Miembro Oficial Solvente' : 'Miembro Agremiado'}</span>
              </p>
            </div>
            <div>
              <span className="text-[10px] uppercase font-bold text-slate-500">Calificación Oficial</span>
              <div className="flex items-center gap-1 text-xs font-bold text-slate-900 mt-0.5">
                <Star className="w-3.5 h-3.5 fill-amber-500 text-amber-500" />
                <span>{restaurant.rating || '5.0'} / 5.0</span>
              </div>
            </div>
          </div>

          {/* Description & Chef Story */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            
            <div className="md:col-span-2 space-y-4">
              <h3 className="font-serif text-lg font-bold text-slate-900 flex items-center gap-2">
                <Utensils className="w-4 h-4 text-amber-600" />
                Filosofía y Experiencia Culinaria
              </h3>
              <p className="text-sm text-slate-600 leading-relaxed">
                {restaurant.description}
              </p>

              {/* Signature Dishes */}
              {restaurant.signatureDishes && restaurant.signatureDishes.length > 0 && (
                <div className="pt-4 space-y-3">
                  <h4 className="font-serif text-base font-bold text-amber-900 flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-amber-600" />
                    Platos Insignia del Menú
                  </h4>

                  <div className="space-y-2.5">
                    {restaurant.signatureDishes.map((dish, i) => (
                      <div key={i} className="p-4 rounded-2xl bg-slate-50 border border-slate-200 hover:border-amber-300 transition-colors">
                        <div className="flex items-start justify-between gap-2">
                          <span className="font-serif font-bold text-sm text-slate-900">{dish.name}</span>
                          {dish.price && dish.price !== 'Consultar' && (
                            <span className="text-xs font-bold text-amber-900 bg-amber-100 px-2.5 py-0.5 rounded-lg border border-amber-200 shrink-0">
                              {dish.price}
                            </span>
                          )}
                        </div>
                        {dish.description && (
                          <p className="text-xs text-slate-600 mt-1">
                            {dish.description}
                          </p>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Menu highlights */}
              {restaurant.menuHighlights && (
                <div className="pt-2">
                  <span className="text-xs font-bold uppercase tracking-wider text-slate-500">Otros destacados de la carta:</span>
                  <ul className="mt-2 space-y-1">
                    {restaurant.menuHighlights.map((item, idx) => (
                      <li key={idx} className="text-xs text-slate-700 flex items-center gap-2">
                        <div className="w-1.5 h-1.5 rounded-full bg-amber-500" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>

            {/* Chef Profile Card & Features */}
            <div className="space-y-5">
              <div className="p-5 rounded-2xl bg-gradient-to-br from-amber-50 to-orange-50 border border-amber-200">
                <div className="flex items-center gap-2 text-amber-800 mb-2">
                  <ChefHat className="w-5 h-5" />
                  <span className="text-xs font-bold uppercase tracking-wider">Chef Ejecutivo / Gerencia</span>
                </div>
                <h4 className="font-serif font-bold text-slate-900 text-base">{restaurant.chef}</h4>
                {restaurant.chefBio && (
                  <p className="text-xs text-slate-600 mt-2 italic leading-relaxed">
                    "{restaurant.chefBio}"
                  </p>
                )}
              </div>

              {/* Chamber Seal of Quality */}
              {restaurant.isCertifiedByCamara && (
                <div className="p-4 rounded-2xl bg-white border border-amber-300 shadow-sm">
                  <div className="flex items-center gap-2 text-amber-800 mb-1">
                    <ShieldCheck className="w-5 h-5 text-amber-600" />
                    <span className="text-xs font-bold font-serif">Sello Oficial de Excelencia</span>
                  </div>
                  <p className="text-[11px] text-slate-600 mt-1">
                    Auditoría de calidad sanitaria, origen de ingredientes y servicio avalados por la Cámara Gastronómica.
                  </p>
                  <p className="text-[11px] font-bold text-amber-800 mt-2">
                    Certificado N°: {restaurant.certificateNumber}
                  </p>
                </div>
              )}

              {/* Features Chips */}
              {restaurant.features && (
                <div className="space-y-2">
                  <span className="text-xs font-bold uppercase tracking-wider text-slate-500">Servicios & Comodidades:</span>
                  <div className="flex flex-wrap gap-1.5">
                    {restaurant.features.map((feat, i) => (
                      <span key={i} className="text-xs px-2.5 py-1 rounded-lg bg-slate-100 text-slate-700 border border-slate-200">
                        {feat}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>

          </div>

          {/* Canales Oficiales de Contacto Directo */}
          <div className="p-6 rounded-3xl bg-slate-900 text-white shadow-xl space-y-4">
            <div>
              <span className="text-[10px] font-black uppercase tracking-wider text-amber-400">Atención Directa</span>
              <h3 className="font-serif text-xl font-bold text-white mt-0.5">
                Canales Oficiales del Establecimiento
              </h3>
              <p className="text-xs text-slate-300 mt-1">
                Comuníquese directamente con el equipo de {restaurant.name} para consultas, pedidos o visitas.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 pt-2">
              
              {/* WhatsApp Directo */}
              {cleanWaNumber && (
                <a
                  href={`https://wa.me/${cleanWaNumber}?text=${encodeURIComponent(`Hola ${restaurant.name}, le contacto a través de la Guía Oficial de la Cámara Gastronómica del Estado Mérida.`)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-3.5 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white transition-all flex items-center gap-3 shadow-md group active:scale-95"
                >
                  <div className="w-9 h-9 rounded-xl bg-white/20 flex items-center justify-center shrink-0">
                    <MessageCircle className="w-5 h-5 text-white" />
                  </div>
                  <div className="overflow-hidden">
                    <span className="block text-[10px] uppercase font-bold text-emerald-200">WhatsApp Oficial</span>
                    <span className="text-xs font-bold truncate block">{restaurant.phone || restaurant.whatsapp}</span>
                  </div>
                </a>
              )}

              {/* Llamada Telefónica */}
              {cleanPhone && (
                <a
                  href={`tel:${cleanPhone}`}
                  className="p-3.5 rounded-2xl bg-slate-800 hover:bg-slate-700 text-white transition-all flex items-center gap-3 border border-slate-700 shadow-md group active:scale-95"
                >
                  <div className="w-9 h-9 rounded-xl bg-amber-500/20 flex items-center justify-center shrink-0">
                    <Phone className="w-5 h-5 text-amber-400" />
                  </div>
                  <div className="overflow-hidden">
                    <span className="block text-[10px] uppercase font-bold text-slate-400">Teléfono Directo</span>
                    <span className="text-xs font-bold truncate block">{restaurant.phone}</span>
                  </div>
                </a>
              )}

              {/* Instagram */}
              {instagramUrl && (
                <a
                  href={instagramUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-3.5 rounded-2xl bg-gradient-to-tr from-purple-700 to-pink-600 hover:opacity-95 text-white transition-all flex items-center gap-3 shadow-md group active:scale-95"
                >
                  <div className="w-9 h-9 rounded-xl bg-white/20 flex items-center justify-center shrink-0">
                    <Instagram className="w-5 h-5 text-white" />
                  </div>
                  <div className="overflow-hidden">
                    <span className="block text-[10px] uppercase font-bold text-pink-200">Instagram Oficial</span>
                    <span className="text-xs font-bold truncate block">{restaurant.instagram || '@cuenta'}</span>
                  </div>
                </a>
              )}

              {/* Sitio Web Oficial */}
              {formattedWebsite && (
                <a
                  href={formattedWebsite}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-3.5 rounded-2xl bg-blue-600 hover:bg-blue-700 text-white transition-all flex items-center gap-3 shadow-md group active:scale-95"
                >
                  <div className="w-9 h-9 rounded-xl bg-white/20 flex items-center justify-center shrink-0">
                    <Globe className="w-5 h-5 text-white" />
                  </div>
                  <div className="overflow-hidden">
                    <span className="block text-[10px] uppercase font-bold text-blue-200">Página Web</span>
                    <span className="text-xs font-bold truncate block flex items-center gap-1">
                      <span>Visitar Sitio</span>
                      <ExternalLink className="w-3 h-3 text-white/80 inline" />
                    </span>
                  </div>
                </a>
              )}

            </div>
          </div>

          {/* Location & Opening Hours */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pt-4 border-t border-slate-200 text-xs text-slate-500">
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-amber-600" />
              <span>{restaurant.openingHours || 'Horario Comercial'}</span>
            </div>

            <div className="flex items-center gap-2">
              <MapPin className="w-4 h-4 text-terracotta" />
              <span className="text-slate-700 font-medium">{restaurant.location}</span>
            </div>
          </div>

        </div>

      </div>

    </div>
  );
}
