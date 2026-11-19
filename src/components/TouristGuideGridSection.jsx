import React, { useState, useEffect } from 'react';
import {
  ArrowRight,
  X,
  Phone,
  Mail,
  Globe,
  Instagram,
  MapPin,
  ExternalLink,
  MessageCircle,
  Sparkles,
} from 'lucide-react';
import {
  DEFAULT_GUIDE_CATEGORIES,
  getLocalGuideCategories,
  getLocalGuideProviders,
  fetchGuideCatalog,
  subscribeToGuideRealtime,
} from '../lib/guideCatalogSync';

export function TouristGuideGridSection({ onNavigate }) {
  const [categories, setCategories] = useState(() => getLocalGuideCategories());
  const [providers, setProviders] = useState(() => getLocalGuideProviders());
  const [selectedCategory, setSelectedCategory] = useState(null);

  useEffect(() => {
    fetchGuideCatalog().then(({ categories: cats, providers: provs }) => {
      if (Array.isArray(cats) && cats.length > 0) setCategories(cats);
      if (Array.isArray(provs)) setProviders(provs);
    });

    const unsubscribe = subscribeToGuideRealtime(({ categories: cats, providers: provs }) => {
      if (Array.isArray(cats) && cats.length > 0) setCategories(cats);
      if (Array.isArray(provs)) setProviders(provs);
    });

    return () => unsubscribe();
  }, []);

  const displayCategories =
    Array.isArray(categories) && categories.length > 0 ? categories : DEFAULT_GUIDE_CATEGORIES;

  const selectedProviders = selectedCategory
    ? providers.filter((p) => p.categoryId === selectedCategory.id)
    : [];

  return (
    <section className="py-14 sm:py-16 bg-[#FAF7F2] border-b border-[#EAE3D5]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          {/* Left Editorial Column */}
          <div className="lg:col-span-4 space-y-4">
            <span className="text-[11px] font-bold uppercase tracking-[0.2em] text-[#C85A32] block">
              Guía del Visitante
            </span>

            <h2 className="font-playfair text-3xl sm:text-4xl lg:text-[2.6rem] font-bold text-[#1E1C1A] leading-[1.08]">
              Explora <span className="italic font-normal text-[#C85A32]">Mérida</span>
            </h2>

            <p className="text-xs sm:text-sm text-[#5C554E] leading-relaxed font-sans max-w-sm">
              Accede en un solo lugar a los mejores restaurantes, hoteles, posadas, transporte, parques, cafeterías y rutas de aventura del estado.
            </p>

            <div className="pt-2">
              <span className="font-handwritten text-2xl sm:text-[1.7rem] text-[#5C554E] -rotate-2 inline-block leading-tight">
                Toda Mérida al alcance de un clic &rarr;
              </span>
            </div>
          </div>

          {/* Right 4x2 Clean Photo + Title Cards Grid */}
          <div className="lg:col-span-8 grid grid-cols-2 sm:grid-cols-4 gap-3.5 sm:gap-4">
            {displayCategories.map((cat) => (
              <button
                key={cat.id}
                type="button"
                onClick={() => setSelectedCategory(cat)}
                className="group text-left bg-white rounded-3xl p-3 border border-[#EAE3D5] hover:border-[#C85A32]/60 hover:shadow-lg transition-all duration-300 flex flex-col justify-between gap-2.5"
              >
                <div className="px-1 pt-0.5 flex items-center justify-between gap-1">
                  <h3 className="font-playfair font-bold text-sm sm:text-[15px] text-[#1E1C1A] group-hover:text-[#C85A32] transition-colors leading-snug line-clamp-2">
                    {cat.title}
                  </h3>
                  <ArrowRight className="w-3.5 h-3.5 text-[#C85A32] opacity-0 group-hover:opacity-100 group-hover:translate-x-0.5 transition-all shrink-0" />
                </div>

                <div className="relative aspect-[4/3] w-full rounded-2xl overflow-hidden bg-[#EFECE6]">
                  <img
                    src={cat.image}
                    alt={cat.title}
                    loading="lazy"
                    className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
                  />
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Modal de Prestadores de Servicios por Categoría */}
      {selectedCategory && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#1E1C1A]/75 backdrop-blur-xs animate-fadeIn"
          onClick={() => setSelectedCategory(null)}
        >
          <div
            className="relative w-full max-w-4xl bg-[#FAF7F2] rounded-3xl border border-[#EAE3D5] shadow-2xl overflow-hidden max-h-[90vh] flex flex-col"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="px-6 py-5 bg-white border-b border-[#EAE3D5] flex items-center justify-between gap-4">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#C85A32] block">
                  La Guía • Mérida Gastronómica
                </span>
                <h3 className="font-playfair text-2xl font-bold text-[#1E1C1A]">
                  {selectedCategory.title}
                </h3>
              </div>

              <div className="flex items-center gap-2">
                {selectedCategory.routeTarget && onNavigate && (
                  <button
                    type="button"
                    onClick={() => {
                      const target = selectedCategory.routeTarget;
                      setSelectedCategory(null);
                      onNavigate(target);
                    }}
                    className="hidden sm:inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-[#C85A32] hover:bg-[#b54d28] text-white text-xs font-bold transition-colors shadow-xs"
                  >
                    <span>Explorar Sección Completa</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                )}
                <button
                  type="button"
                  onClick={() => setSelectedCategory(null)}
                  className="p-2 rounded-full bg-[#FAF7F2] hover:bg-[#EFECE6] text-[#1E1C1A] transition-colors"
                  aria-label="Cerrar"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Body */}
            <div className="p-6 overflow-y-auto space-y-5">
              {selectedProviders.length === 0 ? (
                <div className="bg-white rounded-3xl p-8 border border-[#EAE3D5] text-center space-y-4">
                  <div className="w-12 h-12 rounded-2xl bg-[#FAF3EB] text-[#C85A32] flex items-center justify-center mx-auto">
                    <Sparkles className="w-6 h-6" />
                  </div>
                  <div className="space-y-1 max-w-md mx-auto">
                    <h4 className="font-playfair text-xl font-bold text-[#1E1C1A]">
                      Explora {selectedCategory.title}
                    </h4>
                    <p className="text-xs text-[#5C554E] leading-relaxed">
                      Consulta el directorio oficial de establecimientos y servicios recomendados en esta categoría.
                    </p>
                  </div>
                  {selectedCategory.routeTarget && onNavigate && (
                    <button
                      type="button"
                      onClick={() => {
                        const target = selectedCategory.routeTarget;
                        setSelectedCategory(null);
                        onNavigate(target);
                      }}
                      className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-[#C85A32] hover:bg-[#b54d28] text-white text-xs font-bold shadow-md transition-colors"
                    >
                      <span>Ir a {selectedCategory.title}</span>
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  )}
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {selectedProviders.map((prov) => {
                    const cleanPhone = (prov.phone || '').replace(/[^0-9]/g, '');
                    const igHandle = (prov.instagram || '').replace(/^@/, '').trim();
                    const webHref = prov.website
                      ? prov.website.startsWith('http')
                        ? prov.website
                        : `https://${prov.website}`
                      : '';
                    return (
                      <div
                        key={prov.id}
                        className="bg-white rounded-3xl border border-[#EAE3D5] overflow-hidden shadow-xs hover:shadow-md transition-all flex flex-col justify-between"
                      >
                        <div>
                          <div className="aspect-[16/10] w-full bg-[#EFECE6] overflow-hidden">
                            <img
                              src={prov.photo || selectedCategory.image}
                              alt={prov.name}
                              className="w-full h-full object-cover"
                            />
                          </div>
                          <div className="p-4 space-y-2">
                            <h4 className="font-playfair font-bold text-lg text-[#1E1C1A] leading-snug">
                              {prov.name}
                            </h4>
                            {prov.location && (
                              <p className="text-[11px] text-[#7A7168] flex items-center gap-1">
                                <MapPin className="w-3.5 h-3.5 text-[#C85A32] shrink-0" />
                                <span className="truncate">{prov.location}</span>
                              </p>
                            )}
                          </div>
                        </div>

                        <div className="px-4 pb-4 pt-2 border-t border-[#F4EFE6] space-y-2 text-xs">
                          {prov.phone && (
                            <div className="flex items-center justify-between gap-2">
                              <a
                                href={`tel:${cleanPhone}`}
                                className="text-[#1E1C1A] hover:text-[#C85A32] font-medium flex items-center gap-1.5 truncate"
                              >
                                <Phone className="w-3.5 h-3.5 text-[#C85A32] shrink-0" />
                                <span>{prov.phone}</span>
                              </a>
                              {cleanPhone && (
                                <a
                                  href={`https://api.whatsapp.com/send?phone=${cleanPhone}`}
                                  target="_blank"
                                  rel="noreferrer"
                                  className="px-2.5 py-1 rounded-full bg-emerald-50 hover:bg-emerald-100 text-emerald-700 text-[10px] font-bold flex items-center gap-1 shrink-0"
                                >
                                  <MessageCircle className="w-3 h-3" />
                                  <span>WhatsApp</span>
                                </a>
                              )}
                            </div>
                          )}

                          {prov.email && (
                            <a
                              href={`mailto:${prov.email}`}
                              className="text-[#5C554E] hover:text-[#C85A32] flex items-center gap-1.5 truncate"
                            >
                              <Mail className="w-3.5 h-3.5 text-[#C85A32] shrink-0" />
                              <span className="truncate">{prov.email}</span>
                            </a>
                          )}

                          <div className="flex flex-wrap items-center gap-2 pt-1">
                            {igHandle && (
                              <a
                                href={`https://www.instagram.com/${igHandle}/`}
                                target="_blank"
                                rel="noreferrer"
                                className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-[#FAF3EB] hover:bg-[#F3E5D5] text-[#C85A32] text-[11px] font-bold"
                              >
                                <Instagram className="w-3 h-3" />
                                <span>@{igHandle}</span>
                              </a>
                            )}
                            {webHref && (
                              <a
                                href={webHref}
                                target="_blank"
                                rel="noreferrer"
                                className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-[#1E1C1A] hover:bg-[#33302D] text-white text-[11px] font-bold"
                              >
                                <Globe className="w-3 h-3" />
                                <span>Web</span>
                                <ExternalLink className="w-2.5 h-2.5" />
                              </a>
                            )}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}

              {selectedProviders.length > 0 && selectedCategory.routeTarget && onNavigate && (
                <div className="pt-2 flex justify-center sm:hidden">
                  <button
                    type="button"
                    onClick={() => {
                      const target = selectedCategory.routeTarget;
                      setSelectedCategory(null);
                      onNavigate(target);
                    }}
                    className="w-full py-3 rounded-full bg-[#C85A32] text-white text-xs font-bold flex items-center justify-center gap-1.5"
                  >
                    <span>Explorar Sección Completa</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
