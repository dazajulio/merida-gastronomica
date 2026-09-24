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
  Mountain, 
  Calendar, 
  CheckCircle2, 
  Sparkles, 
  Utensils,
  Share2,
  Copy,
  Check,
  Compass,
  Send
} from 'lucide-react';

export function RestaurantModal({ restaurant, onClose, onViewOnMap }) {
  const [activeImage, setActiveImage] = useState(restaurant.coverImage);
  const [resDate, setResDate] = useState('');
  const [resGuests, setResGuests] = useState('2 personas');
  const [resName, setResName] = useState('');
  const [resPhone, setResPhone] = useState('');
  const [bookingSuccess, setBookingSuccess] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);
  const [showShareBar, setShowShareBar] = useState(false);

  if (!restaurant) return null;

  const currentOrigin = typeof window !== 'undefined' ? window.location.origin : 'https://meridagastronomica.com';
  const currentUrl = `${currentOrigin}/?restaurante=${restaurant.slug || restaurant.id}`;
  const shareMessage = `¡Mira *${restaurant.name}* en la Guía Oficial de Mérida Gastronómica! 🍽️✨%0A%0A"${restaurant.tagline}"%0A📍 *Ubicación:* ${restaurant.location}%0A%0A📲 *Ver Ficha Completa, Fotos y Reservar:*%0A${currentUrl}`;

  const handleNativeShare = async () => {
    const shareData = {
      title: `${restaurant.name} | Guía Oficial Mérida Gastronómica`,
      text: `${restaurant.name}: ${restaurant.tagline}. Consulta su carta, fotos y reserva con el Sello Oficial de la Cámara Gastronómica.`,
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

  const handleBookingSubmit = (e) => {
    e.preventDefault();
    setBookingSuccess(true);
    setTimeout(() => {
      const text = `Hola *${restaurant.name}*, deseo solicitar una reserva formal:%0A%0A👤 *Nombre:* ${resName || 'Huésped VIP'}%0A📅 *Fecha:* ${resDate || 'Próxima disponibilidad'}%0A👥 *Comensales:* ${resGuests}%0A📱 *Teléfono:* ${resPhone}%0A%0ASolicitud enviada desde la *Guía Oficial de la Cámara Gastronómica del Estado Mérida*.`;
      const cleanPhone = restaurant.whatsapp.replace(/[^0-9]/g, '');
      window.open(`https://wa.me/${cleanPhone}?text=${text}`, '_blank');
    }, 900);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 overflow-y-auto bg-slate-950/70 backdrop-blur-sm animate-fadeIn">
      
      <div className="relative w-full max-w-4xl bg-white rounded-3xl border border-slate-200 shadow-2xl overflow-hidden my-8 max-h-[90vh] flex flex-col text-slate-800">
        
        {/* Header Bar */}
        <div className="p-4 sm:p-6 bg-slate-50 border-b border-slate-200 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl bg-amber-500 flex items-center justify-center text-white shadow-sm shrink-0">
              <ChefHat className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h2 className="font-serif text-xl sm:text-2xl font-bold text-slate-900">
                  {restaurant.name}
                </h2>
                {restaurant.isCertifiedByCamara && (
                  <span className="hidden sm:inline-flex items-center gap-1 text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-amber-100 text-amber-900 border border-amber-300">
                    <ShieldCheck className="w-3.5 h-3.5 text-amber-600" />
                    Certificado Oficial
                  </span>
                )}
              </div>
              <p className="text-xs text-slate-600 font-medium mt-0.5">
                {restaurant.tagline}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            {onViewOnMap && (
              <button
                onClick={() => onViewOnMap(restaurant)}
                className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-900 text-amber-300 border border-slate-700 text-xs font-semibold hover:bg-slate-800 transition-colors shadow-sm"
              >
                <Compass className="w-3.5 h-3.5 text-amber-400" />
                <span>📍 Ver en Mapa 3D</span>
              </button>
            )}

            {restaurant.instagramUrl && (
              <a
                href={restaurant.instagramUrl}
                target="_blank"
                rel="noreferrer"
                className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-pink-50 text-pink-700 border border-pink-200 text-xs font-semibold hover:bg-pink-100 transition-colors"
              >
                <span>Instagram</span>
              </a>
            )}

            {restaurant.facebookUrl && (
              <a
                href={restaurant.facebookUrl}
                target="_blank"
                rel="noreferrer"
                className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-blue-50 text-blue-700 border border-blue-200 text-xs font-semibold hover:bg-blue-100 transition-colors"
              >
                <span>Facebook</span>
              </a>
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
              className="p-2 rounded-full bg-slate-200 hover:bg-slate-300 text-slate-700 transition-colors"
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
                src={activeImage} 
                alt={restaurant.name} 
                className="w-full h-full object-cover"
              />
              <div className="absolute top-4 right-4 bg-slate-900/80 backdrop-blur-md px-3 py-1.5 rounded-full text-xs font-bold text-white flex items-center gap-1.5">
                <Mountain className="w-3.5 h-3.5 text-sky-400" />
                <span>{restaurant.altitude} msnm</span>
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
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 p-4 rounded-2xl bg-amber-50/60 border border-amber-200">
            <div>
              <span className="text-[10px] uppercase font-bold text-slate-500">Eje Geográfico</span>
              <p className="text-xs font-bold text-slate-900 mt-0.5">{restaurant.ejeName}</p>
            </div>
            <div>
              <span className="text-[10px] uppercase font-bold text-slate-500">Categoría</span>
              <p className="text-xs font-bold text-amber-800 mt-0.5">{restaurant.category}</p>
            </div>
            <div>
              <span className="text-[10px] uppercase font-bold text-slate-500">Calificación</span>
              <div className="flex items-center gap-1 text-xs font-bold text-slate-900 mt-0.5">
                <Star className="w-3.5 h-3.5 fill-amber-500 text-amber-500" />
                <span>{restaurant.rating} / 5.0</span>
              </div>
            </div>
            <div>
              <span className="text-[10px] uppercase font-bold text-slate-500">Rango de Precios</span>
              <p className="text-xs font-bold text-emerald-700 mt-0.5">{restaurant.priceTier} (Gourmet)</p>
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
                        <span className="text-xs font-bold text-amber-900 bg-amber-100 px-2.5 py-0.5 rounded-lg border border-amber-200 shrink-0">
                          {dish.price}
                        </span>
                      </div>
                      <p className="text-xs text-slate-600 mt-1">
                        {dish.description}
                      </p>
                    </div>
                  ))}
                </div>
              </div>

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
                  <span className="text-xs font-bold uppercase tracking-wider">Chef Ejecutivo</span>
                </div>
                <h4 className="font-serif font-bold text-slate-900 text-base">{restaurant.chef}</h4>
                <p className="text-xs text-slate-600 mt-2 italic leading-relaxed">
                  "{restaurant.chefBio}"
                </p>
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

          {/* Table Booking & Direct Contact Module */}
          <div className="p-6 rounded-3xl bg-gradient-to-r from-amber-500 via-amber-600 to-terracotta text-white shadow-xl">
            
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mb-6">
              <div>
                <h3 className="font-serif text-xl font-bold text-white flex items-center gap-2">
                  <Calendar className="w-5 h-5" />
                  Reserva Directa VIP / Contacto Oficial
                </h3>
                <p className="text-xs text-amber-100 mt-1">
                  Atención prioritaria con confirmación directa vía WhatsApp oficial del restaurante.
                </p>
              </div>

              <div className="flex items-center gap-2">
                <a 
                  href={`tel:${restaurant.phone}`}
                  className="px-3.5 py-2 rounded-xl bg-white/20 hover:bg-white/30 text-white text-xs font-bold flex items-center gap-1.5 transition-colors"
                >
                  <Phone className="w-3.5 h-3.5" />
                  <span>{restaurant.phone}</span>
                </a>
              </div>
            </div>

            {bookingSuccess ? (
              <div className="p-6 rounded-2xl bg-white text-slate-900 text-center space-y-2 animate-fadeIn shadow-md">
                <CheckCircle2 className="w-10 h-10 text-emerald-600 mx-auto" />
                <h4 className="font-serif text-lg font-bold text-slate-900">¡Solicitud de Reserva Preparada!</h4>
                <p className="text-xs text-slate-600 max-w-md mx-auto">
                  Hemos abierto la conversación directa de WhatsApp con el concierge de <strong>{restaurant.name}</strong> para coordinar su mesa y requerimientos especiales.
                </p>
              </div>
            ) : (
              <form onSubmit={handleBookingSubmit} className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3 text-slate-900">
                <div>
                  <label className="block text-[10px] uppercase font-bold text-amber-100 mb-1">Nombre Completo</label>
                  <input 
                    type="text" 
                    required
                    value={resName}
                    onChange={(e) => setResName(e.target.value)}
                    placeholder="Ej. Carlos Mendoza" 
                    className="w-full bg-white border border-white/40 rounded-xl px-3 py-2.5 text-xs focus:outline-none focus:ring-2 focus:ring-amber-300"
                  />
                </div>

                <div>
                  <label className="block text-[10px] uppercase font-bold text-amber-100 mb-1">Fecha Deseada</label>
                  <input 
                    type="date" 
                    required
                    value={resDate}
                    onChange={(e) => setResDate(e.target.value)}
                    className="w-full bg-white border border-white/40 rounded-xl px-3 py-2.5 text-xs focus:outline-none focus:ring-2 focus:ring-amber-300"
                  />
                </div>

                <div>
                  <label className="block text-[10px] uppercase font-bold text-amber-100 mb-1">Número de Personas</label>
                  <select 
                    value={resGuests}
                    onChange={(e) => setResGuests(e.target.value)}
                    className="w-full bg-white border border-white/40 rounded-xl px-3 py-2.5 text-xs focus:outline-none focus:ring-2 focus:ring-amber-300"
                  >
                    <option value="1 persona">1 persona</option>
                    <option value="2 personas">2 personas (Mesa Romántica)</option>
                    <option value="4 personas">4 personas (Familiar)</option>
                    <option value="6 a 10 personas">6 a 10 personas (Grupo / Banquete)</option>
                    <option value="Evento Privado +10">Evento Privado (+10 personas)</option>
                  </select>
                </div>

                <div className="flex items-end">
                  <button
                    type="submit"
                    className="w-full py-2.5 px-4 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-serif font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 transition-all shadow-md active:scale-95"
                  >
                    <MessageCircle className="w-4 h-4 text-emerald-400" />
                    <span>Confirmar VIP</span>
                  </button>
                </div>
              </form>
            )}

          </div>

          {/* Location & Opening Hours */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pt-4 border-t border-slate-200 text-xs text-slate-500">
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-amber-600" />
              <span>{restaurant.openingHours}</span>
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
