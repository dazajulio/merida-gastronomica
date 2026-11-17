import React from 'react';

const ALLIES = [
  {
    name: 'Empresas Polar',
    logo: '/images/patrocinantes/polar.png',
    heightClass: 'h-9 sm:h-11',
  },
  {
    name: 'Suraki',
    logo: '/images/patrocinantes/suraki.png',
    heightClass: 'h-9 sm:h-11',
  },
  {
    name: 'Pasapalos El Caldero',
    logo: '/images/patrocinantes/el-caldero.png',
    heightClass: 'h-9 sm:h-11',
  },
  {
    name: 'Lácteos Santa María',
    logo: '/images/patrocinantes/santa-maria.png',
    heightClass: 'h-8 sm:h-10',
  },
  {
    name: 'Hotel Venetur Mérida',
    logo: '/images/patrocinantes/venetur.png',
    heightClass: 'h-12 sm:h-16',
  },
  {
    name: 'Transfers Mérida',
    logo: '/images/patrocinantes/transfers-merida.png',
    heightClass: 'h-7 sm:h-9',
  },
  {
    name: 'Convención Hotel Boutique',
    logo: '/images/patrocinantes/convencion-hotel.png',
    heightClass: 'h-12 sm:h-16',
  },
  {
    name: 'Glubbi',
    logo: '/images/patrocinantes/glubbi.jpg',
    heightClass: 'h-9 sm:h-11',
  },
];

export function AlliesMarqueeStrip() {
  // Duplicar para bucle continuo sin saltos
  const marqueeItems = [...ALLIES, ...ALLIES];

  return (
    <section className="bg-white border-b border-[#EAE3D5] py-4 sm:py-5 overflow-hidden relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-3 flex items-center justify-center">
        <span className="text-[10px] font-sans uppercase tracking-[0.24em] text-[#8C8277] font-bold">
          Aliados Oficiales
        </span>
      </div>

      {/* Marquee Container with Soft Side Fades */}
      <div className="relative w-full overflow-hidden">
        <div className="pointer-events-none absolute inset-y-0 left-0 w-16 sm:w-28 bg-gradient-to-r from-white to-transparent z-10" />
        <div className="pointer-events-none absolute inset-y-0 right-0 w-16 sm:w-28 bg-gradient-to-l from-white to-transparent z-10" />

        <div className="animate-marquee-ltr flex items-center gap-10 sm:gap-16 px-4">
          {marqueeItems.map((ally, idx) => (
            <div
              key={`${ally.name}-${idx}`}
              title={ally.name}
              className="flex items-center justify-center shrink-0 opacity-90 hover:opacity-100 transition-all duration-300 hover:scale-105 cursor-pointer"
            >
              <img
                src={ally.logo}
                alt={ally.name}
                className={`${ally.heightClass} w-auto object-contain block`}
                loading="lazy"
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
