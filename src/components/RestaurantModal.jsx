import React, { useState, useEffect } from 'react';
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
  ExternalLink,
  Grid,
  ChevronLeft,
  ChevronRight,
  Award,
  Camera
} from 'lucide-react';

export function RestaurantModal({ restaurant, onClose, onViewOnMap }) {
  const [copiedLink, setCopiedLink] = useState(false);
  const [showShareBar, setShowShareBar] = useState(false);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState(0);

  // Normalizar lista de fotos para galería estilo Airbnb
  const allImages = React.useMemo(() => {
    if (!restaurant) return [];
    const set = new Set();
    const list = [];
    const add = (img) => {
      if (img && typeof img === 'string' && img.trim() && !set.has(img.trim())) {
        set.add(img.trim());
        list.push(img.trim());
      }
    };

    if (restaurant.coverImage) add(restaurant.coverImage);
    if (restaurant.foto_portada) add(restaurant.foto_portada);
    if (Array.isArray(restaurant.gallery)) restaurant.gallery.forEach(add);
    if (Array.isArray(restaurant.fotos_galeria)) restaurant.fotos_galeria.forEach(add);

    return list.length > 0 
      ? list 
      : ['https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=1200&q=80'];
  }, [restaurant]);

  // Manejo de teclado para cerrar modal o navegar en Lightbox
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        if (lightboxOpen) {
          setLightboxOpen(false);
        } else {
          onClose();
        }
      } else if (lightboxOpen) {
        if (e.key === 'ArrowRight') {
          setLightboxIndex((prev) => (prev + 1) % allImages.length);
        } else if (e.key === 'ArrowLeft') {
          setLightboxIndex((prev) => (prev - 1 + allImages.length) % allImages.length);
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [lightboxOpen, allImages.length, onClose]);

  if (!restaurant) return null;

  const currentOrigin = typeof window !== 'undefined' ? window.location.origin : 'https://meridagastronomica.com';
  const currentUrl = `${currentOrigin}/?restaurante=${restaurant.slug || restaurant.id}`;
  const shareMessage = `¡Mira *${restaurant.name}* en la Guía Oficial de Mérida Gastronómica! 🍽️✨%0A%0A"${restaurant.tagline || ''}"%0A📍 *Ubicación:* ${restaurant.location}%0A%0A📲 *Ver Ficha Oficial y Canales de Contacto:*%0A${currentUrl}`;

  const handleNativeShare = async () => {
    const shareData = {
      title: `${restaurant.name} | Guía Oficial Mérida Gastronómica`,
      text: `${restaurant.name}: ${restaurant.tagline || 'Consulta su carta, fotos y canales oficiales de contacto.'}`,
      url: currentUrl
    };

    if (navigator.share) {
      try {
        await navigator.share(shareData);
        return;
      } catch (err) {
        if (err.name !== 'AbortError') {
          setShowShareBar(!showShareBar);
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

  const openLightbox = (index = 0) => {
    setLightboxIndex(index);
    setLightboxOpen(true);
  };

  const rawPhone = restaurant.phone || restaurant.whatsapp || '';
  const cleanPhone = rawPhone.replace(/[^0-9+]/g, '');
  const cleanWaNumber = cleanPhone.replace(/[^0-9]/g, '');

  const websiteUrl = restaurant.websiteUrl || restaurant.website || restaurant.sitio_web || '';
  const formattedWebsite = websiteUrl ? (websiteUrl.startsWith('http://') || websiteUrl.startsWith('https://') ? websiteUrl : `https://${websiteUrl}`) : '';

  const instagramUser = restaurant.instagram ? restaurant.instagram.replace('@', '') : '';
  const instagramUrl = restaurant.instagramUrl || (instagramUser ? `https://instagram.com/${instagramUser}` : '');

  return (
    <>
      {/* Modal Backdrop & Container */}
      <div className="fixed inset-0 z-[9999] flex items-center justify-center p-2 sm:p-4 md:p-6 overflow-y-auto bg-slate-950/80 backdrop-blur-md animate-fadeIn">
        
        {/* Backdrop Click to Close */}
        <div 
          className="fixed inset-0"
          onClick={onClose}
        />

        {/* Modal Box */}
        <div className="relative w-full max-w-5xl xl:max-w-6xl bg-white rounded-3xl shadow-2xl overflow-hidden z-10 flex flex-col max-h-[94vh] border border-slate-200 animate-scaleUp">
          
          {/* Header Bar - Airbnb Style (Clean, Light & Refined) */}
          <div className="px-5 sm:px-8 py-3.5 sm:py-4 bg-white border-b border-slate-200/80 flex items-center justify-between gap-4 shrink-0">
            <div className="min-w-0 flex items-center gap-3">
              <div className="w-9 h-9 rounded-2xl bg-gradient-to-tr from-amber-600 to-amber-500 flex items-center justify-center text-white font-bold text-sm shadow-md shrink-0">
                🍽️
              </div>
              <div className="min-w-0">
                <div className="flex items-center gap-2">
                  <h2 className="font-serif text-lg sm:text-2xl font-bold text-slate-900 tracking-tight leading-tight truncate">
                    {restaurant.name}
                  </h2>
                  {restaurant.isCertifiedByCamara && (
                    <span className="hidden md:inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-amber-100 text-amber-900 border border-amber-300">
                      <ShieldCheck className="w-3.5 h-3.5 text-amber-600" />
                      Sello CGM
                    </span>
                  )}
                </div>
                <p className="text-xs text-slate-500 truncate mt-0.5">
                  {restaurant.tagline || `${restaurant.category} • Cámara Gastronómica del Estado Mérida`}
                </p>
              </div>
            </div>

            {/* Header Action Buttons */}
            <div className="flex items-center gap-2 shrink-0">
              {/* Direct 3D Map Jump */}
              {onViewOnMap && (
                <button
                  onClick={() => {
                    onViewOnMap(restaurant);
                    onClose();
                  }}
                  className="hidden sm:inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-slate-700 hover:text-amber-800 hover:bg-amber-50 border border-slate-200 text-xs font-bold transition-all shadow-sm"
                  title="Ver en mapa 3D"
                >
                  <Compass className="w-3.5 h-3.5 text-amber-600" />
                  <span>Ver en Mapa</span>
                </button>
              )}

              {/* Compartir Button */}
              <button
                onClick={handleNativeShare}
                className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-slate-700 hover:text-slate-900 hover:bg-slate-100 border border-slate-200 text-xs font-bold transition-all shadow-sm active:scale-95"
                title="Compartir restaurante"
              >
                <Share2 className="w-3.5 h-3.5 text-slate-600" />
                <span>Compartir</span>
              </button>

              {/* Close Button */}
              <button
                onClick={onClose}
                className="p-2 rounded-full text-slate-400 hover:text-slate-800 hover:bg-slate-100 transition-colors"
                title="Cerrar (Esc)"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Social Sharing Drawer (Collapsible) */}
          {showShareBar && (
            <div className="bg-amber-50/90 px-5 sm:px-8 py-3 border-b border-amber-200 flex flex-wrap items-center justify-between gap-3 text-xs animate-fadeIn">
              <div className="flex items-center gap-2 text-slate-700 font-semibold">
                <Share2 className="w-4 h-4 text-amber-700" />
                <span>Compartir este restaurante:</span>
              </div>

              <div className="flex items-center gap-2 flex-wrap">
                <a
                  href={`https://api.whatsapp.com/send?text=${shareMessage}`}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition-colors shadow-sm"
                >
                  <MessageCircle className="w-3.5 h-3.5" />
                  <span>WhatsApp</span>
                </a>

                <a
                  href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(currentUrl)}`}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold transition-colors shadow-sm"
                >
                  <span>Facebook</span>
                </a>

                <a
                  href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(`Descubre ${restaurant.name} en la Guía Oficial de Mérida Gastronómica`)}&url=${encodeURIComponent(currentUrl)}`}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold transition-colors shadow-sm"
                >
                  <span>X (Twitter)</span>
                </a>

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
          )}

          {/* Subtitle / Metadata Row (Airbnb style: Rating, Category, Location) */}
          <div className="px-5 sm:px-8 pt-4 pb-2 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-slate-600 border-b border-slate-100">
            <div className="flex items-center gap-1 font-bold text-slate-900">
              <Star className="w-3.5 h-3.5 fill-amber-500 text-amber-500" />
              <span>{restaurant.rating || '5.0'}</span>
              <span className="font-normal text-slate-500">({restaurant.reviewsCount || 12} reseñas)</span>
            </div>
            <span>•</span>
            <span className="font-medium text-amber-900 bg-amber-50 px-2 py-0.5 rounded-md border border-amber-200">
              {restaurant.category}
            </span>
            <span>•</span>
            <div className="flex items-center gap-1 text-slate-600">
              <MapPin className="w-3.5 h-3.5 text-amber-600" />
              <span className="line-clamp-1">{restaurant.location}</span>
            </div>
          </div>

          {/* Scrollable Content Body */}
          <div className="p-4 sm:p-8 overflow-y-auto space-y-8 flex-1">
            
            {/* ======================================================== */}
            {/* PHOTO GALLERY MOSAIC - REFINED AIRBNB STYLE */}
            {/* ======================================================== */}
            <div className="relative rounded-2xl sm:rounded-3xl overflow-hidden border border-slate-200 shadow-sm bg-slate-100">
              
              {/* MOBILE VIEW (< 640px): Elegant hero with floating badge */}
              <div className="block sm:hidden relative h-64 overflow-hidden group cursor-pointer" onClick={() => openLightbox(0)}>
                <img 
                  src={allImages[0]} 
                  alt={restaurant.name} 
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/20" />
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    openLightbox(0);
                  }}
                  className="absolute bottom-3 right-3 px-3 py-1.5 rounded-xl bg-white/95 text-slate-900 text-xs font-bold shadow-lg flex items-center gap-1.5"
                >
                  <Grid className="w-3.5 h-3.5 text-slate-700" />
                  <span>Ver fotos ({allImages.length})</span>
                </button>
              </div>

              {/* DESKTOP / TABLET VIEW (sm+): Adaptive Airbnb Mosaic Grid */}
              <div className="hidden sm:block h-[340px] md:h-[400px] lg:h-[430px] w-full">
                
                {/* CASE A: 5 OR MORE PHOTOS */}
                {allImages.length >= 5 && (
                  <div className="grid grid-cols-4 grid-rows-2 gap-2 h-full w-full p-2 bg-slate-100">
                    <div 
                      onClick={() => openLightbox(0)} 
                      className="col-span-2 row-span-2 relative group overflow-hidden rounded-2xl cursor-pointer"
                    >
                      <img src={allImages[0]} alt={restaurant.name} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
                      <div className="absolute inset-0 bg-black/0 group-hover:bg-black/15 transition-colors" />
                    </div>
                    <div 
                      onClick={() => openLightbox(1)} 
                      className="col-span-1 row-span-1 relative group overflow-hidden rounded-2xl cursor-pointer"
                    >
                      <img src={allImages[1]} alt={restaurant.name} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
                      <div className="absolute inset-0 bg-black/0 group-hover:bg-black/15 transition-colors" />
                    </div>
                    <div 
                      onClick={() => openLightbox(2)} 
                      className="col-span-1 row-span-1 relative group overflow-hidden rounded-2xl cursor-pointer"
                    >
                      <img src={allImages[2]} alt={restaurant.name} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
                      <div className="absolute inset-0 bg-black/0 group-hover:bg-black/15 transition-colors" />
                    </div>
                    <div 
                      onClick={() => openLightbox(3)} 
                      className="col-span-1 row-span-1 relative group overflow-hidden rounded-2xl cursor-pointer"
                    >
                      <img src={allImages[3]} alt={restaurant.name} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
                      <div className="absolute inset-0 bg-black/0 group-hover:bg-black/15 transition-colors" />
                    </div>
                    <div 
                      onClick={() => openLightbox(4)} 
                      className="col-span-1 row-span-1 relative group overflow-hidden rounded-2xl cursor-pointer"
                    >
                      <img src={allImages[4]} alt={restaurant.name} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
                      <div className="absolute inset-0 bg-black/0 group-hover:bg-black/15 transition-colors" />
                      
                      <button 
                        onClick={(e) => { e.stopPropagation(); openLightbox(0); }}
                        className="absolute bottom-3 right-3 px-3 py-1.5 rounded-xl bg-white/95 hover:bg-white text-slate-900 text-xs font-bold shadow-lg border border-slate-200 flex items-center gap-1.5 transition-all active:scale-95"
                      >
                        <Grid className="w-3.5 h-3.5 text-slate-700" />
                        <span>Mostrar todas las fotos</span>
                      </button>
                    </div>
                  </div>
                )}

                {/* CASE B: EXACTLY 4 PHOTOS (E.G. GLUBBI) */}
                {allImages.length === 4 && (
                  <div className="grid grid-cols-4 grid-rows-2 gap-2 h-full w-full p-2 bg-slate-100">
                    <div 
                      onClick={() => openLightbox(0)} 
                      className="col-span-2 row-span-2 relative group overflow-hidden rounded-2xl cursor-pointer"
                    >
                      <img src={allImages[0]} alt={restaurant.name} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
                      <div className="absolute inset-0 bg-black/0 group-hover:bg-black/15 transition-colors" />
                    </div>
                    <div 
                      onClick={() => openLightbox(1)} 
                      className="col-span-2 row-span-1 relative group overflow-hidden rounded-2xl cursor-pointer"
                    >
                      <img src={allImages[1]} alt={restaurant.name} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
                      <div className="absolute inset-0 bg-black/0 group-hover:bg-black/15 transition-colors" />
                    </div>
                    <div 
                      onClick={() => openLightbox(2)} 
                      className="col-span-1 row-span-1 relative group overflow-hidden rounded-2xl cursor-pointer"
                    >
                      <img src={allImages[2]} alt={restaurant.name} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
                      <div className="absolute inset-0 bg-black/0 group-hover:bg-black/15 transition-colors" />
                    </div>
                    <div 
                      onClick={() => openLightbox(3)} 
                      className="col-span-1 row-span-1 relative group overflow-hidden rounded-2xl cursor-pointer"
                    >
                      <img src={allImages[3]} alt={restaurant.name} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
                      <div className="absolute inset-0 bg-black/0 group-hover:bg-black/15 transition-colors" />
                      
                      <button 
                        onClick={(e) => { e.stopPropagation(); openLightbox(0); }}
                        className="absolute bottom-3 right-3 px-3 py-1.5 rounded-xl bg-white/95 hover:bg-white text-slate-900 text-xs font-bold shadow-lg border border-slate-200 flex items-center gap-1.5 transition-all active:scale-95"
                      >
                        <Grid className="w-3.5 h-3.5 text-slate-700" />
                        <span>Mostrar las 4 fotos</span>
                      </button>
                    </div>
                  </div>
                )}

                {/* CASE C: 3 PHOTOS */}
                {allImages.length === 3 && (
                  <div className="grid grid-cols-5 grid-rows-2 gap-2 h-full w-full p-2 bg-slate-100">
                    <div 
                      onClick={() => openLightbox(0)} 
                      className="col-span-3 row-span-2 relative group overflow-hidden rounded-2xl cursor-pointer"
                    >
                      <img src={allImages[0]} alt={restaurant.name} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
                      <div className="absolute inset-0 bg-black/0 group-hover:bg-black/15 transition-colors" />
                    </div>
                    <div 
                      onClick={() => openLightbox(1)} 
                      className="col-span-2 row-span-1 relative group overflow-hidden rounded-2xl cursor-pointer"
                    >
                      <img src={allImages[1]} alt={restaurant.name} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
                      <div className="absolute inset-0 bg-black/0 group-hover:bg-black/15 transition-colors" />
                    </div>
                    <div 
                      onClick={() => openLightbox(2)} 
                      className="col-span-2 row-span-1 relative group overflow-hidden rounded-2xl cursor-pointer"
                    >
                      <img src={allImages[2]} alt={restaurant.name} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
                      <div className="absolute inset-0 bg-black/0 group-hover:bg-black/15 transition-colors" />
                      
                      <button 
                        onClick={(e) => { e.stopPropagation(); openLightbox(0); }}
                        className="absolute bottom-3 right-3 px-3 py-1.5 rounded-xl bg-white/95 hover:bg-white text-slate-900 text-xs font-bold shadow-lg border border-slate-200 flex items-center gap-1.5 transition-all active:scale-95"
                      >
                        <Grid className="w-3.5 h-3.5 text-slate-700" />
                        <span>Ver fotos (3)</span>
                      </button>
                    </div>
                  </div>
                )}

                {/* CASE D: 2 PHOTOS */}
                {allImages.length === 2 && (
                  <div className="grid grid-cols-2 gap-2 h-full w-full p-2 bg-slate-100">
                    <div 
                      onClick={() => openLightbox(0)} 
                      className="relative group overflow-hidden rounded-2xl cursor-pointer"
                    >
                      <img src={allImages[0]} alt={restaurant.name} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
                      <div className="absolute inset-0 bg-black/0 group-hover:bg-black/15 transition-colors" />
                    </div>
                    <div 
                      onClick={() => openLightbox(1)} 
                      className="relative group overflow-hidden rounded-2xl cursor-pointer"
                    >
                      <img src={allImages[1]} alt={restaurant.name} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
                      <div className="absolute inset-0 bg-black/0 group-hover:bg-black/15 transition-colors" />
                      
                      <button 
                        onClick={(e) => { e.stopPropagation(); openLightbox(0); }}
                        className="absolute bottom-3 right-3 px-3 py-1.5 rounded-xl bg-white/95 hover:bg-white text-slate-900 text-xs font-bold shadow-lg border border-slate-200 flex items-center gap-1.5 transition-all active:scale-95"
                      >
                        <Grid className="w-3.5 h-3.5 text-slate-700" />
                        <span>Ver fotos (2)</span>
                      </button>
                    </div>
                  </div>
                )}

                {/* CASE E: 1 PHOTO */}
                {allImages.length === 1 && (
                  <div 
                    onClick={() => openLightbox(0)} 
                    className="w-full h-full p-2 relative group overflow-hidden cursor-pointer"
                  >
                    <div className="w-full h-full rounded-2xl overflow-hidden relative">
                      <img src={allImages[0]} alt={restaurant.name} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
                      <div className="absolute inset-0 bg-black/0 group-hover:bg-black/15 transition-colors" />
                      <div className="absolute bottom-3 right-3 px-3 py-1.5 rounded-xl bg-white/95 text-slate-900 text-xs font-bold shadow-lg border border-slate-200 flex items-center gap-1.5">
                        <Camera className="w-3.5 h-3.5 text-slate-700" />
                        <span>Ampliar foto</span>
                      </div>
                    </div>
                  </div>
                )}

              </div>

            </div>

            {/* ======================================================== */}
            {/* TWO-COLUMN DETAILS LAYOUT (AIRBNB SPEC) */}
            {/* ======================================================== */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
              
              {/* LEFT COLUMN: Philosophy, Menu, Chef, Features (7 cols) */}
              <div className="lg:col-span-7 xl:col-span-8 space-y-8">
                
                {/* Airbnb Highlight Card: Aval de la Cámara & Calificación */}
                <div className="p-4 sm:p-5 rounded-2xl bg-amber-50/70 border border-amber-200 flex items-center justify-between gap-4 shadow-sm">
                  <div className="flex items-center gap-3.5">
                    <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-amber-600 to-amber-500 flex items-center justify-center text-white shadow-md shrink-0">
                      <Award className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <span className="text-[10px] font-black uppercase tracking-wider text-amber-800 block">
                        Reconocimiento & Aval Gremial
                      </span>
                      <h4 className="font-serif text-sm sm:text-base font-bold text-slate-900 leading-tight">
                        {restaurant.isCertifiedByCamara ? 'Certificado con Sello Oficial CGM' : 'Establecimiento Agremiado Solvente'}
                      </h4>
                      <p className="text-xs text-slate-600 mt-0.5 line-clamp-1">
                        {restaurant.certificateNumber ? `Certificado N°: ${restaurant.certificateNumber}` : 'Miembro verificado por la Cámara de Turismo y Gastronomía de Mérida'}
                      </p>
                    </div>
                  </div>

                  <div className="text-right shrink-0 border-l border-amber-200 pl-4">
                    <div className="flex items-center justify-end gap-1 text-sm font-black text-slate-900">
                      <Star className="w-4 h-4 fill-amber-500 text-amber-500" />
                      <span>{restaurant.rating || '5.0'}</span>
                    </div>
                    <span className="text-[11px] text-slate-500 font-medium block">
                      {restaurant.reviewsCount || 12} reseñas
                    </span>
                  </div>
                </div>

                {/* Description & Culinary Experience */}
                <div className="space-y-3">
                  <h3 className="font-serif text-xl font-bold text-slate-900 flex items-center gap-2">
                    <Utensils className="w-5 h-5 text-amber-600" />
                    Filosofía y Propuesta Gastronómica
                  </h3>
                  <p className="text-sm text-slate-600 leading-relaxed text-justify">
                    {restaurant.description}
                  </p>
                </div>

                {/* Signature Dishes */}
                {restaurant.signatureDishes && restaurant.signatureDishes.length > 0 && (
                  <div className="space-y-4 pt-2">
                    <div className="flex items-center justify-between">
                      <h4 className="font-serif text-lg font-bold text-slate-900 flex items-center gap-2">
                        <Sparkles className="w-4 h-4 text-amber-600" />
                        Platos Insignia de la Carta
                      </h4>
                      <span className="text-xs text-slate-400 font-medium">Recomendados del Chef</span>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {restaurant.signatureDishes.map((dish, i) => (
                        <div key={i} className="p-4 rounded-2xl bg-slate-50 border border-slate-200 hover:border-amber-300 hover:shadow-sm transition-all flex flex-col justify-between">
                          <div>
                            <div className="flex items-start justify-between gap-2">
                              <span className="font-serif font-bold text-sm text-slate-900 leading-snug">{dish.name}</span>
                              {dish.price && dish.price !== 'Consultar' && (
                                <span className="text-xs font-bold text-amber-900 bg-amber-100 px-2.5 py-0.5 rounded-lg border border-amber-200 shrink-0">
                                  {dish.price}
                                </span>
                              )}
                            </div>
                            {dish.description && (
                              <p className="text-xs text-slate-600 mt-1.5 leading-relaxed">
                                {dish.description}
                              </p>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Menu Highlights */}
                {restaurant.menuHighlights && restaurant.menuHighlights.length > 0 && (
                  <div className="pt-2 p-5 rounded-2xl bg-amber-50/40 border border-amber-200/70">
                    <span className="text-xs font-bold uppercase tracking-wider text-slate-500 block mb-3">
                      Otros destacados del menú:
                    </span>
                    <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      {restaurant.menuHighlights.map((item, idx) => (
                        <li key={idx} className="text-xs text-slate-700 flex items-center gap-2">
                          <div className="w-1.5 h-1.5 rounded-full bg-amber-500 shrink-0" />
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Chef Profile Card */}
                {restaurant.chef && (
                  <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200">
                    <div className="flex items-center gap-2 text-amber-800 mb-2">
                      <ChefHat className="w-5 h-5 text-amber-600" />
                      <span className="text-xs font-bold uppercase tracking-wider">Chef Ejecutivo / Dirección Culinaria</span>
                    </div>
                    <h4 className="font-serif font-bold text-slate-900 text-base">{restaurant.chef}</h4>
                    {restaurant.chefBio && (
                      <p className="text-xs text-slate-600 mt-2 italic leading-relaxed">
                        "{restaurant.chefBio}"
                      </p>
                    )}
                  </div>
                )}

                {/* Features / Services Chips */}
                {restaurant.features && restaurant.features.length > 0 && (
                  <div className="space-y-2.5 pt-2">
                    <span className="text-xs font-bold uppercase tracking-wider text-slate-500 block">
                      Servicios & Comodidades:
                    </span>
                    <div className="flex flex-wrap gap-2">
                      {restaurant.features.map((feat, i) => (
                        <span key={i} className="text-xs px-3 py-1.5 rounded-xl bg-slate-100 text-slate-700 border border-slate-200 font-medium">
                          {feat}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

              </div>

              {/* RIGHT COLUMN: Airbnb Sticky Contact & Reservation Card (5 cols) */}
              <div className="lg:col-span-5 xl:col-span-4">
                <div className="sticky top-6 rounded-3xl border border-slate-200 bg-white p-5 sm:p-6 shadow-xl space-y-5">
                  
                  {/* Card Header: Category & Price */}
                  <div className="flex items-center justify-between pb-4 border-b border-slate-100">
                    <div>
                      <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Categoría</span>
                      <p className="font-serif text-base font-bold text-slate-900 leading-tight mt-0.5">
                        {restaurant.category}
                      </p>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
                      <span className="text-xs font-bold text-emerald-700">En línea</span>
                    </div>
                  </div>

                  {/* Primary Call to Action: WhatsApp Oficial */}
                  {cleanWaNumber ? (
                    <a
                      href={`https://wa.me/${cleanWaNumber}?text=${encodeURIComponent(`Hola ${restaurant.name}, le contacto a través de la Guía Oficial de la Cámara Gastronómica del Estado Mérida.`)}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-full py-3.5 px-4 rounded-2xl bg-gradient-to-r from-emerald-600 to-emerald-500 hover:from-emerald-700 hover:to-emerald-600 text-white font-bold text-sm shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2.5 active:scale-[0.98]"
                    >
                      <MessageCircle className="w-5 h-5 text-white" />
                      <span>Contactar por WhatsApp</span>
                    </a>
                  ) : null}

                  {/* Secondary Direct Channels */}
                  <div className="grid grid-cols-2 gap-2">
                    {cleanPhone && (
                      <a
                        href={`tel:${cleanPhone}`}
                        className="p-2.5 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-800 transition-all flex items-center gap-2 text-xs font-semibold"
                        title="Llamada directa"
                      >
                        <Phone className="w-4 h-4 text-amber-600 shrink-0" />
                        <span className="truncate">Llamar directo</span>
                      </a>
                    )}

                    {instagramUrl && (
                      <a
                        href={instagramUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-2.5 rounded-xl border border-slate-200 hover:bg-pink-50 text-slate-800 hover:text-pink-700 transition-all flex items-center gap-2 text-xs font-semibold"
                        title="Instagram"
                      >
                        <Instagram className="w-4 h-4 text-pink-600 shrink-0" />
                        <span className="truncate">Instagram</span>
                      </a>
                    )}

                    {formattedWebsite && (
                      <a
                        href={formattedWebsite}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="col-span-2 p-2.5 rounded-xl border border-slate-200 hover:bg-blue-50 text-slate-800 hover:text-blue-700 transition-all flex items-center justify-center gap-2 text-xs font-semibold"
                      >
                        <Globe className="w-4 h-4 text-blue-600 shrink-0" />
                        <span className="truncate">Visitar Sitio Web Oficial</span>
                        <ExternalLink className="w-3 h-3 text-slate-400" />
                      </a>
                    )}
                  </div>

                  {/* Schedule & Location Details */}
                  <div className="space-y-3 pt-3 border-t border-slate-100 text-xs">
                    <div className="flex items-start gap-2.5 text-slate-600">
                      <Clock className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                      <div>
                        <span className="font-bold text-slate-800 block">Horario de Atención</span>
                        <span>{restaurant.openingHours || 'Consultar por canales directos'}</span>
                      </div>
                    </div>

                    <div className="flex items-start gap-2.5 text-slate-600">
                      <MapPin className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                      <div>
                        <span className="font-bold text-slate-800 block">Dirección</span>
                        <span className="line-clamp-2">{restaurant.location}</span>
                        {onViewOnMap && (
                          <button
                            onClick={() => {
                              onViewOnMap(restaurant);
                              onClose();
                            }}
                            className="mt-1 text-xs font-bold text-amber-700 hover:text-amber-800 hover:underline flex items-center gap-1"
                          >
                            <Compass className="w-3.5 h-3.5" />
                            <span>Ver ubicación en Mapa 3D</span>
                          </button>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Chamber Solvency Guarantee Badge */}
                  <div className="p-3.5 rounded-2xl bg-amber-50/60 border border-amber-200 flex items-center gap-2.5 text-xs text-amber-950">
                    <ShieldCheck className="w-5 h-5 text-emerald-600 shrink-0" />
                    <div>
                      <span className="font-bold block text-[11px] uppercase tracking-wider text-amber-800">Garantía CGM 2026</span>
                      <span className="text-[11px] text-slate-600 leading-tight block">
                        Establecimiento solvente y auditado por la Cámara Gastronómica.
                      </span>
                    </div>
                  </div>

                </div>
              </div>

            </div>

          </div>

        </div>

      </div>

      {/* ======================================================== */}
      {/* FULLSCREEN LIGHTBOX GALLERY MODAL */}
      {/* ======================================================== */}
      {lightboxOpen && (
        <div className="fixed inset-0 z-[100000] bg-black/95 backdrop-blur-xl flex flex-col justify-between p-4 sm:p-6 text-white animate-fadeIn select-none">
          
          {/* Lightbox Top Header */}
          <div className="flex items-center justify-between shrink-0 pb-3 border-b border-white/10">
            <div className="flex items-center gap-3">
              <span className="px-3 py-1 rounded-full bg-white/10 text-xs font-bold text-amber-300">
                {lightboxIndex + 1} / {allImages.length}
              </span>
              <h3 className="font-serif font-bold text-sm sm:text-base text-white truncate max-w-xs sm:max-w-md">
                {restaurant.name}
              </h3>
            </div>

            <button
              onClick={() => setLightboxOpen(false)}
              className="p-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition-all"
              title="Cerrar galería (Esc)"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          {/* Lightbox Center Viewport */}
          <div className="relative flex-1 flex items-center justify-center p-2 sm:p-6 overflow-hidden">
            {/* Prev Button */}
            {allImages.length > 1 && (
              <button
                onClick={() => setLightboxIndex((prev) => (prev - 1 + allImages.length) % allImages.length)}
                className="absolute left-2 sm:left-6 z-20 p-3 rounded-full bg-black/50 hover:bg-black/80 text-white backdrop-blur border border-white/10 transition-all hover:scale-110 active:scale-95"
                title="Foto anterior"
              >
                <ChevronLeft className="w-6 h-6" />
              </button>
            )}

            {/* Main Image */}
            <div className="relative max-w-5xl max-h-[70vh] flex items-center justify-center">
              <img 
                src={allImages[lightboxIndex]} 
                alt={`${restaurant.name} - Foto ${lightboxIndex + 1}`}
                className="max-h-[70vh] max-w-full object-contain rounded-2xl shadow-2xl transition-all duration-300"
              />
            </div>

            {/* Next Button */}
            {allImages.length > 1 && (
              <button
                onClick={() => setLightboxIndex((prev) => (prev + 1) % allImages.length)}
                className="absolute right-2 sm:right-6 z-20 p-3 rounded-full bg-black/50 hover:bg-black/80 text-white backdrop-blur border border-white/10 transition-all hover:scale-110 active:scale-95"
                title="Foto siguiente"
              >
                <ChevronRight className="w-6 h-6" />
              </button>
            )}
          </div>

          {/* Lightbox Bottom Thumbnails Strip */}
          {allImages.length > 1 && (
            <div className="flex items-center justify-center gap-2 overflow-x-auto py-2 shrink-0 max-w-2xl mx-auto">
              {allImages.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setLightboxIndex(idx)}
                  className={`w-14 h-12 rounded-xl overflow-hidden border-2 shrink-0 transition-all ${
                    lightboxIndex === idx ? 'border-amber-400 scale-110 shadow-lg' : 'border-transparent opacity-50 hover:opacity-100'
                  }`}
                >
                  <img src={img} alt="Miniatura" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          )}

        </div>
      )}
    </>
  );
}
