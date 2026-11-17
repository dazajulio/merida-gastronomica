import React from 'react';
import { Instagram, Newspaper, ExternalLink } from 'lucide-react';

const NEWS_ITEMS = [
  {
    id: 'news-ig-1',
    source: 'Instagram Reel',
    title: 'Gestión & Proyección',
    summary: 'La gastronomía no solo alimenta; conecta, emociona y se convierte en el recuerdo más imborrable de cualquier viaje.',
    url: 'https://www.instagram.com/reel/DfZnHeEJ_xm/?utm_source=ig_web_copy_link&vrfl=MzRlODBiNWFlZA==&srtk=MzRlODBiNWFlZA==',
    image: '/images/noticias/noticia-1.jpg',
    objectPos: 'object-top',
    type: 'instagram',
  },
  {
    id: 'news-ig-2',
    source: 'Instagram Reel',
    title: 'Comité de Regiones ALAV',
    summary: 'Encuentro en la sede de ALAV para destacar la importancia de las regiones en la construcción de una visión turística compartida.',
    url: 'https://www.instagram.com/reel/DfXSm1svTAR/?utm_source=ig_web_copy_link&psln=MzRlODBiNWFlZA==&srtk=MzRlODBiNWFlZA==',
    image: '/images/noticias/noticia-2.jpg',
    objectPos: 'object-top',
    type: 'instagram',
  },
  {
    id: 'news-ig-3',
    source: 'Instagram Reel',
    title: 'Origen & Páramo Andino',
    summary: 'Nuestra gastronomía nace del paisaje, del páramo andino, del aire frío, del esfuerzo de los productores locales y de nuestra gente.',
    url: 'https://www.instagram.com/reel/DdTsBz2JWz9/?utm_source=ig_web_copy_link&exln=MzRlODBiNWFlZA==&srtk=MzRlODBiNWFlZA==',
    image: '/images/noticias/noticia-3.jpg',
    objectPos: 'object-center',
    type: 'instagram',
  },
  {
    id: 'news-press-fedecamaras',
    source: 'Prensa Regional',
    title: 'Respaldo Fedecámaras',
    summary: 'Franco respaldo ha recibido la naciente Cámara Gastronómica del estado Mérida por parte de FEDECÁMARAS Mérida.',
    url: 'https://comunicacioncontinua.com/camara-gastronomica-de-merida-cuenta-con-el-respaldo-de-fedecamaras/',
    image: '/images/noticias/noticia-4.jpg',
    objectPos: 'object-center',
    type: 'press',
  },
];

export function NewsMediaSection() {
  return (
    <section className="py-16 bg-[#FAF7F2] border-t border-[#EAE3D5]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          
          {/* Left Editorial Column (4 cols) */}
          <div className="lg:col-span-4 space-y-4 relative">
            <span className="text-[11px] font-bold uppercase tracking-[0.22em] text-[#C85A32] block">
              Prensa &amp; Redes
            </span>

            <h2 className="font-playfair text-3xl sm:text-4xl font-bold text-[#1E1C1A] leading-tight">
              Noticias &amp;{' '}
              <span className="italic font-normal text-[#C85A32] block sm:inline">
                Actualidad
              </span>
            </h2>

            <p className="text-xs sm:text-sm text-[#5C554E] leading-relaxed font-sans max-w-sm">
              Sigue nuestras publicaciones oficiales, cobertura de prensa y momentos destacados del gremio gastronómico merideño.
            </p>

            {/* Subtle Handwritten Note (matches reference layout) */}
            <div className="hidden lg:inline-block pt-2 -rotate-3">
              <span className="font-handwritten text-xl text-[#7A7168] block leading-tight">
                Prensa, Redes,
                <br />
                Comunidad &rarr;
              </span>
            </div>
          </div>

          {/* Right 4 Vertical Thumbnail Cards (8 cols) */}
          <div className="lg:col-span-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {NEWS_ITEMS.map((item) => {
              const IconComp = item.type === 'press' ? Newspaper : Instagram;

              return (
                <a
                  key={item.id}
                  href={item.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group rounded-2xl bg-white border border-[#EAE3D5] hover:border-[#C85A32]/60 p-3.5 shadow-2xs hover:shadow-md transition-all duration-300 flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-center justify-between mb-2.5">
                      <div className="w-8 h-8 rounded-xl bg-[#FAF3EB] text-[#C85A32] flex items-center justify-center group-hover:scale-105 transition-transform">
                        <IconComp className="w-4 h-4" />
                      </div>
                      <ExternalLink className="w-3.5 h-3.5 text-[#A59B90] group-hover:text-[#C85A32] transition-colors" />
                    </div>

                    <span className="text-[10px] font-bold uppercase tracking-wider text-[#C85A32] block mb-0.5">
                      {item.source}
                    </span>

                    <h3 className="font-playfair font-bold text-sm text-[#1E1C1A] group-hover:text-[#C85A32] transition-colors leading-snug">
                      {item.title}
                    </h3>

                    <p className="text-[11px] text-[#5C554E] mt-1 line-clamp-2 leading-snug">
                      {item.summary}
                    </p>
                  </div>

                  {/* Bottom Rounded Thumbnail Image */}
                  <div className="mt-3 h-32 w-full rounded-xl overflow-hidden bg-[#F2ECE1]">
                    <img
                      src={item.image}
                      alt={item.title}
                      className={`w-full h-full object-cover ${item.objectPos || 'object-center'} group-hover:scale-105 transition-transform duration-500`}
                      loading="lazy"
                    />
                  </div>
                </a>
              );
            })}
          </div>

        </div>
      </div>
    </section>
  );
}
