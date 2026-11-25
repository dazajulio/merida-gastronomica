import React from 'react';
import { ShieldCheck, ArrowLeft, Lock, Smartphone, Globe, Mail, MapPin, EyeOff, CheckCircle2 } from 'lucide-react';

export function PrivacyPolicyPage({ onNavigate }) {
  const handleBack = () => {
    if (onNavigate) {
      onNavigate('home');
    } else if (typeof window !== 'undefined') {
      window.location.href = '/';
    }
  };

  return (
    <div className="min-h-screen bg-[#FAF7F2] text-[#1E1C1A] font-sans selection:bg-[#C85A32] selection:text-white py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto space-y-8 animate-fadeIn">
        
        {/* Botón Volver */}
        <button
          type="button"
          onClick={handleBack}
          className="inline-flex items-center gap-2 text-xs font-bold text-[#C85A32] hover:text-[#A44421] transition-colors cursor-pointer bg-white px-4 py-2 rounded-xl border border-[#EAE3D5] shadow-2xs"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Volver al Inicio</span>
        </button>

        {/* Cabecera Principal */}
        <div className="bg-white rounded-3xl p-6 sm:p-10 border border-[#EAE3D5] shadow-sm relative overflow-hidden">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 rounded-2xl bg-[#FAF3EB] border border-[#EAE3D5] p-1.5 flex items-center justify-center">
              <img src="/logo-merida-gastronomica.png" alt="Mérida Gastronómica" className="w-full h-full object-contain" />
            </div>
            <div>
              <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#C85A32] block">
                Documento Legal Oficial
              </span>
              <h1 className="font-playfair text-2xl sm:text-3xl font-bold text-[#1E1C1A]">
                Política de Privacidad
              </h1>
            </div>
          </div>

          <p className="text-xs text-[#5C554E] leading-relaxed">
            <strong>Aplicación Oficial:</strong> Mérida Gastronómica (Android / Web)<br />
            <strong>Responsable &amp; Titular:</strong> Cámara Gastronómica del Estado Mérida (CGEM) &amp; Desarrollador Julio Daza Celis<br />
            <strong>Última actualización:</strong> 24 de Noviembre de 2026
          </p>
        </div>

        {/* Bloques de la Política */}
        <div className="bg-white rounded-3xl p-6 sm:p-10 border border-[#EAE3D5] shadow-sm space-y-8 text-xs sm:text-sm text-[#3E3832] leading-relaxed">
          
          {/* 1. Introducción */}
          <section className="space-y-3">
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-[#C85A32]" />
              <h2 className="font-playfair font-bold text-base sm:text-lg text-[#1E1C1A]">
                1. Compromiso de Privacidad y Alcance
              </h2>
            </div>
            <p>
              La <strong>Cámara Gastronómica del Estado Mérida (CGEM)</strong> y su equipo de desarrollo técnico valoran y respetan profundamente la privacidad de cada usuario. Esta Política de Privacidad describe de manera transparente qué datos se recopilan, cómo se utilizan y las medidas de seguridad implementadas en la aplicación móvil <strong>Mérida Gastronómica</strong> (distribuida en Google Play Store y en la web oficial <code className="bg-[#FAF3EB] px-1.5 py-0.5 rounded text-[#C85A32]">meridagastronomica.com</code>).
            </p>
            <p>
              Nuestra aplicación está diseñada principalmente como una <strong>guía informativa, turística y de conexión directa</strong> entre comensales, turistas y establecimientos gastronómicos y de hospitalidad del estado Mérida, Venezuela.
            </p>
          </section>

          {/* 2. Datos que Recopilamos */}
          <section className="space-y-3">
            <div className="flex items-center gap-2">
              <EyeOff className="w-5 h-5 text-[#C85A32]" />
              <h2 className="font-playfair font-bold text-base sm:text-lg text-[#1E1C1A]">
                2. Información y Permisos Utilizados
              </h2>
            </div>
            <p>
              La aplicación opera bajo el principio de <strong>mínima recopilación de datos</strong>:
            </p>
            <ul className="list-disc pl-5 space-y-2">
              <li>
                <strong>Navegación General de la Guía:</strong> Para explorar restaurantes, hoteles, posadas, cafeterías, teleférico o promociones, <em>no se requiere registro previo ni datos personales</em> del visitante o turista.
              </li>
              <li>
                <strong>Ubicación y Navegación GPS:</strong> La aplicación puede solicitar permiso para acceder a la ubicación del dispositivo exclusivamente cuando el usuario pulsa botones de navegación («Cómo llegar» o «Ver en Mapa»). Este dato se procesa localmente en su dispositivo para abrir Google Maps o Waze y <em>nunca es almacenado ni vendido en servidores remotos</em>.
              </li>
              <li>
                <strong>Contacto por WhatsApp:</strong> Al interactuar con el botón de reserva o consulta de un restaurante o posada, la app abre directamente un enlace seguro <code className="bg-[#FAF3EB] px-1.5 py-0.5 rounded">wa.me</code> en la aplicación oficial de WhatsApp del usuario. La CGEM no tiene acceso a sus conversaciones privadas ni almacena los números telefónicos de los comensales.
              </li>
              <li>
                <strong>Cuentas de Agremiados y Directiva:</strong> Los miembros agremiados y directivos que inician sesión con sus credenciales institucionales para gestionar su ficha comercial o tesorería tienen sus datos protegidos con cifrado y autenticación segura a través de nuestra base de datos en la nube.
              </li>
            </ul>
          </section>

          {/* 3. Finalidad del Tratamiento */}
          <section className="space-y-3">
            <div className="flex items-center gap-2">
              <Globe className="w-5 h-5 text-[#C85A32]" />
              <h2 className="font-playfair font-bold text-base sm:text-lg text-[#1E1C1A]">
                3. Finalidad del Uso de la Información
              </h2>
            </div>
            <p>Los datos procesados se destinan estrictamente a:</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
              <div className="p-3.5 rounded-2xl bg-[#FAF7F2] border border-[#EAE3D5] flex items-start gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <span>Facilitar el contacto directo sin comisiones entre el cliente y el comercio.</span>
              </div>
              <div className="p-3.5 rounded-2xl bg-[#FAF7F2] border border-[#EAE3D5] flex items-start gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <span>Mostrar información geográfica y logística fidedigna del estado Mérida.</span>
              </div>
              <div className="p-3.5 rounded-2xl bg-[#FAF7F2] border border-[#EAE3D5] flex items-start gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <span>Garantizar el funcionamiento técnico y la estabilidad de la app.</span>
              </div>
              <div className="p-3.5 rounded-2xl bg-[#FAF7F2] border border-[#EAE3D5] flex items-start gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <span>Verificar el cumplimiento de estándares de calidad de la Cámara.</span>
              </div>
            </div>
          </section>

          {/* 4. No Comercialización */}
          <section className="space-y-3">
            <div className="flex items-center gap-2">
              <Lock className="w-5 h-5 text-[#C85A32]" />
              <h2 className="font-playfair font-bold text-base sm:text-lg text-[#1E1C1A]">
                4. No Venta ni Transferencia de Datos
              </h2>
            </div>
            <p>
              La Cámara Gastronómica del Estado Mérida <strong>no vende, no alquila, no cede ni comercializa información personal</strong> de sus usuarios con empresas de publicidad, corredores de datos ni terceros con fines comerciales o de rastreo.
            </p>
          </section>

          {/* 5. Seguridad de la Información */}
          <section className="space-y-3">
            <div className="flex items-center gap-2">
              <Smartphone className="w-5 h-5 text-[#C85A32]" />
              <h2 className="font-playfair font-bold text-base sm:text-lg text-[#1E1C1A]">
                5. Seguridad y Almacenamiento
              </h2>
            </div>
            <p>
              Implementamos protocolos de seguridad estándar en la industria, incluyendo transmisión cifrada mediante SSL/HTTPS (TLS 1.3), cortafuegos de aplicaciones web y controles de acceso restringidos basados en roles técnicos (RBAC) para salvaguardar la integridad de la plataforma.
            </p>
          </section>

          {/* 6. Derechos del Usuario & Eliminación de Cuenta */}
          <section className="space-y-3">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5 text-[#C85A32]" />
              <h2 className="font-playfair font-bold text-base sm:text-lg text-[#1E1C1A]">
                6. Derechos del Usuario y Eliminación de Datos
              </h2>
            </div>
            <p>
              Cualquier usuario o establecimiento registrado puede solicitar el acceso, rectificación, actualización o eliminación definitiva de sus datos de nuestro directorio y base de datos en cualquier momento enviando una solicitud por escrito a nuestros canales oficiales de contacto.
            </p>
          </section>

          {/* 7. Contacto */}
          <section className="space-y-3 pt-4 border-t border-[#EAE3D5]">
            <div className="flex items-center gap-2">
              <Mail className="w-5 h-5 text-[#C85A32]" />
              <h2 className="font-playfair font-bold text-base sm:text-lg text-[#1E1C1A]">
                7. Contacto y Consultas de Privacidad
              </h2>
            </div>
            <p>
              Para cualquier consulta, duda o ejercicio de derechos sobre esta política o la aplicación móvil, puede comunicarse con nosotros:
            </p>
            <div className="p-4 rounded-2xl bg-[#FAF3EB] border border-[#EAE3D5] space-y-1.5 font-mono text-xs text-[#1E1C1A]">
              <p><strong>Entidad:</strong> Cámara Gastronómica del Estado Mérida (CGEM)</p>
              <p><strong>Responsable Técnico:</strong> Julio Daza Celis (Desarrollador &amp; Propietario)</p>
              <p><strong>Correo Electrónico:</strong> dazajulio@gmail.com / notificaciones@meridagastronomica.com</p>
              <p><strong>Teléfono / WhatsApp:</strong> +58 414-8817137</p>
              <p><strong>Sede Institucional:</strong> Mérida, Estado Mérida, Venezuela</p>
              <p><strong>Portal Web Oficial:</strong> https://www.meridagastronomica.com</p>
            </div>
          </section>

        </div>

      </div>
    </div>
  );
}
