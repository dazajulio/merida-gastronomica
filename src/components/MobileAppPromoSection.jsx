import React from 'react';
import {
  Smartphone,
  MessageCircle,
  Navigation,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  Tag,
  Star,
  CheckCircle2,
  ExternalLink
} from 'lucide-react';

export function MobileAppPromoSection({ onNavigateToApp }) {
  return (
    <section className="py-16 sm:py-20 bg-[#FAF7F2] border-t border-[#EAE3D5] overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative rounded-[2.5rem] bg-gradient-to-br from-[#1E1C1A] via-[#2A2622] to-[#1E1C1A] text-white p-8 sm:p-12 lg:p-16 border border-[#EAE3D5]/20 shadow-xl overflow-hidden">
          
          {/* Acentos de fondo sutiles */}
          <div className="absolute top-0 right-0 w-96 h-96 bg-[#C85A32]/15 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute bottom-0 left-0 w-80 h-80 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

          <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-center">
            
            {/* Columna Izquierda: Información Editorial de la App */}
            <div className="lg:col-span-7 space-y-6">
              
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#C85A32]/20 border border-[#C85A32]/40 text-[#C85A32] text-xs font-bold uppercase tracking-wider">
                <Smartphone className="w-4 h-4 text-amber-400" />
                <span className="text-amber-200">App Oficial en Google Play Store</span>
              </div>

              <h2 className="font-playfair text-3xl sm:text-4xl lg:text-5xl font-black text-white leading-[1.1] tracking-tight">
                Lleva el Sabor de los Andes <br className="hidden sm:inline" />
                <span className="italic font-normal text-amber-300">en tu Bolsillo</span>
              </h2>

              <p className="text-sm sm:text-base text-stone-300 leading-relaxed max-w-xl font-sans">
                La aplicación oficial de la Cámara Gastronómica del Estado Mérida. Diseñada 100% para el turista y el comensal merideño: reserva directo por WhatsApp sin comisiones, navega con GPS a cualquier local, consulta el estado en vivo del Teleférico Mukumbarí y accede a promociones semanales exclusivas.
              </p>

              {/* 4 Cualidades Principales */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 pt-2">
                <div className="flex items-start gap-2.5">
                  <div className="w-7 h-7 rounded-lg bg-[#25D366]/20 text-[#25D366] flex items-center justify-center shrink-0 mt-0.5 border border-[#25D366]/30">
                    <MessageCircle className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-white">Reserva por WhatsApp</h4>
                    <p className="text-[11px] text-stone-400">Contacto directo con cada restaurante y posada.</p>
                  </div>
                </div>

                <div className="flex items-start gap-2.5">
                  <div className="w-7 h-7 rounded-lg bg-amber-500/20 text-amber-300 flex items-center justify-center shrink-0 mt-0.5 border border-amber-500/30">
                    <Navigation className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-white">Navegación GPS</h4>
                    <p className="text-[11px] text-stone-400">Cómo llegar con Google Maps o Waze con un toque.</p>
                  </div>
                </div>

                <div className="flex items-start gap-2.5">
                  <div className="w-7 h-7 rounded-lg bg-emerald-500/20 text-emerald-300 flex items-center justify-center shrink-0 mt-0.5 border border-emerald-500/30">
                    <Sparkles className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-white">Teleférico &amp; Guía Viajero</h4>
                    <p className="text-[11px] text-stone-400">Horarios en vivo, tarifas oficiales y traslados.</p>
                  </div>
                </div>

                <div className="flex items-start gap-2.5">
                  <div className="w-7 h-7 rounded-lg bg-[#C85A32]/20 text-amber-400 flex items-center justify-center shrink-0 mt-0.5 border border-[#C85A32]/30">
                    <Tag className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-white">Planes &amp; Promos Semanales</h4>
                    <p className="text-[11px] text-stone-400">Ofertas 2x1 y salidas para el comensal local.</p>
                  </div>
                </div>
              </div>

              {/* Botonera de Acción */}
              <div className="pt-4 flex flex-wrap items-center gap-3.5">
                
                {/* Botón Google Play Store */}
                <a
                  href="https://play.google.com/store/apps"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="py-3 px-5 rounded-2xl bg-black hover:bg-stone-900 border border-stone-700 text-white flex items-center gap-3 shadow-lg active:scale-95 transition-all group"
                >
                  <svg className="w-6 h-6 shrink-0 fill-current" viewBox="0 0 24 24">
                    <path d="M3,20.5V3.5C3,2.91 3.34,2.39 3.84,2.15L13.69,12L3.84,21.85C3.34,21.6 3,21.09 3,20.5M16.81,15.12L6.05,21.34L14.54,12.85L16.81,15.12M20.16,10.81C20.5,11.08 20.75,11.5 20.75,12C20.75,12.5 20.53,12.9 20.18,13.18L17.89,14.5L15.39,12L17.89,9.5L20.16,10.81M6.05,2.66L16.81,8.88L14.54,11.15L6.05,2.66Z" />
                  </svg>
                  <div className="text-left">
                    <span className="text-[9px] uppercase tracking-wider text-stone-400 block font-medium leading-none">
                      Disponible en
                    </span>
                    <span className="text-sm font-bold text-white font-sans leading-tight">
                      Google Play
                    </span>
                  </div>
                </a>

                {/* Botón Probar Versión Web Móvil */}
                {onNavigateToApp && (
                  <button
                    type="button"
                    onClick={onNavigateToApp}
                    className="py-3.5 px-6 rounded-2xl bg-[#C85A32] hover:bg-[#B04B26] text-white font-bold text-xs flex items-center gap-2 shadow-sm transition-all active:scale-95"
                  >
                    <span>Explorar Versión Web Móvil</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                )}

              </div>

            </div>

            {/* Columna Derecha: Mockup Visual de Smartphone de Alto Impacto */}
            <div className="lg:col-span-5 flex justify-center">
              <div className="relative w-64 sm:w-72 rounded-[2.5rem] bg-black p-3 shadow-2xl border-4 border-stone-800">
                {/* Notch / Dynamic Island */}
                <div className="absolute top-4 left-1/2 -translate-x-1/2 w-24 h-4 bg-stone-900 rounded-full z-20 flex items-center justify-center">
                  <div className="w-2.5 h-2.5 rounded-full bg-stone-950 ml-auto mr-3" />
                </div>

                {/* Pantalla del Celular */}
                <div className="rounded-[2rem] overflow-hidden bg-[#FAF7F2] text-[#1E1C1A] text-left pt-6 pb-4 px-3 space-y-3">
                  
                  {/* Top Bar inside Mockup */}
                  <div className="flex items-center justify-between border-b border-[#EAE3D5] pb-2">
                    <div className="flex items-center gap-1.5">
                      <div className="w-6 h-6 rounded-lg bg-[#FAF3EB] p-0.5 border border-[#EAE3D5] flex items-center justify-center">
                        <img src="/logo-merida-gastronomica.png" alt="" className="w-full h-full object-contain" />
                      </div>
                      <span className="font-playfair font-bold text-[11px] text-[#1E1C1A]">Mérida Gastronómica</span>
                    </div>
                    <span className="text-[8px] font-bold text-[#C85A32] bg-[#FAF3EB] px-1.5 py-0.5 rounded-full">
                      App
                    </span>
                  </div>

                  {/* Mockup Title */}
                  <div className="space-y-0.5">
                    <span className="text-[8px] font-bold uppercase tracking-wider text-[#C85A32]">Guía del Visitante</span>
                    <h5 className="font-playfair font-bold text-xs text-[#1E1C1A]">Explora <span className="italic text-[#C85A32]">Mérida</span></h5>
                    <p className="font-serif italic text-[9px] text-[#5C554E]">Toda Mérida al alcance de un clic &rarr;</p>
                  </div>

                  {/* Mockup 4 Mini Tiles */}
                  <div className="grid grid-cols-2 gap-1.5">
                    <div className="p-1.5 rounded-xl bg-white border border-[#EAE3D5] flex flex-col justify-between">
                      <span className="text-[9px] font-bold text-[#1E1C1A]">Restaurantes</span>
                      <div className="aspect-[4/3] w-full rounded-lg overflow-hidden bg-slate-100 mt-1">
                        <img src="https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=300&q=80" alt="" className="w-full h-full object-cover" />
                      </div>
                    </div>

                    <div className="p-1.5 rounded-xl bg-white border border-[#EAE3D5] flex flex-col justify-between">
                      <span className="text-[9px] font-bold text-[#1E1C1A]">Hoteles</span>
                      <div className="aspect-[4/3] w-full rounded-lg overflow-hidden bg-slate-100 mt-1">
                        <img src="https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=300&q=80" alt="" className="w-full h-full object-cover" />
                      </div>
                    </div>

                    <div className="p-1.5 rounded-xl bg-white border border-[#EAE3D5] flex flex-col justify-between">
                      <span className="text-[9px] font-bold text-[#1E1C1A]">Teleférico</span>
                      <div className="aspect-[4/3] w-full rounded-lg overflow-hidden bg-slate-100 mt-1">
                        <img src="/images/merida_hero_gastronomica.jpg" alt="" className="w-full h-full object-cover" />
                      </div>
                    </div>

                    <div className="p-1.5 rounded-xl bg-white border border-[#EAE3D5] flex flex-col justify-between">
                      <span className="text-[9px] font-bold text-[#1E1C1A]">Cafeterías</span>
                      <div className="aspect-[4/3] w-full rounded-lg overflow-hidden bg-slate-100 mt-1">
                        <img src="https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?auto=format&fit=crop&w=300&q=80" alt="" className="w-full h-full object-cover" />
                      </div>
                    </div>
                  </div>

                  {/* Mockup Card Promo */}
                  <div className="p-2 rounded-xl bg-white border border-[#EAE3D5] space-y-1 shadow-2xs">
                    <div className="flex items-center justify-between text-[8px]">
                      <span className="font-bold text-[#C85A32] bg-[#FAF3EB] px-1 rounded">PROMO 2x1</span>
                      <span className="font-bold text-emerald-700">WhatsApp Directo</span>
                    </div>
                    <p className="text-[9px] font-bold text-[#1E1C1A] truncate">Noches de Burgers &amp; Sangría</p>
                  </div>

                </div>
              </div>
            </div>

          </div>

        </div>
      </div>
    </section>
  );
}
