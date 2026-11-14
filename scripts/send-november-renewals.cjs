const fs = require('fs');
const dotenv = fs.readFileSync('.env', 'utf8');
const env = {};
dotenv.split('\n').forEach(line => {
  const [k, ...v] = line.trim().split('=');
  if (k && v.length) env[k.trim()] = v.join('=').trim();
});

const { createClient } = require('@supabase/supabase-js');
const { Resend } = require('resend');

const supabase = createClient(env.VITE_SUPABASE_URL, env.VITE_SUPABASE_ANON_KEY);
const resend = new Resend(env.RESEND_API_KEY || env.resend_api_key);

const EXCLUDED_EMAILS = [
  'leonardo.andre.maldonado@gmail.com',
  'cataconmari@gmail.com',
  'alianza_formativa@iutcm.edu.ve',
  'lacasadelvalleca@gmail.com'
].map(e => e.toLowerCase().trim());

function buildEmailHtml(member) {
  const cuotaUsd = (parseFloat(member.monto_cuota_mensual) || 10).toFixed(2);
  const conceptoExacto = `Cuota Noviembre ${member.codigo_afiliado} - ${member.nombre_establecimiento}`;

  return `<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Renovación Membresía Gremial Noviembre 2026 - CGEM</title>
  <style>
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: #f1f5f9; margin: 0; padding: 20px 10px; color: #1e293b; }
    .container { max-width: 620px; margin: 0 auto; background: #ffffff; border-radius: 16px; overflow: hidden; border: 1px solid #e2e8f0; box-shadow: 0 10px 25px -5px rgba(0,0,0,0.06); }
    .header { background: linear-gradient(135deg, #451a03 0%, #78350f 50%, #92400e 100%); padding: 32px 24px; text-align: center; color: #ffffff; }
    .header h1 { margin: 0; font-size: 21px; font-weight: 800; letter-spacing: -0.5px; font-family: Georgia, serif; }
    .header .subtitle { margin: 6px 0 0 0; font-size: 12px; color: #fde68a; font-weight: 600; text-transform: uppercase; letter-spacing: 1px; }
    .header .rif { font-size: 10px; color: #fef3c7; opacity: 0.8; margin-top: 4px; }
    .body-content { padding: 30px 24px; font-size: 14px; line-height: 1.65; color: #334155; }
    .salutation { font-size: 15px; font-weight: 700; color: #0f172a; margin-bottom: 12px; }
    .badge-cycle { display: inline-block; background: #fef3c7; border: 1px solid #fde68a; color: #92400e; padding: 4px 12px; border-radius: 9999px; font-size: 11px; font-weight: 700; text-transform: uppercase; margin-bottom: 16px; }
    .benefits-box { background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 14px; padding: 20px 18px; margin: 24px 0; }
    .benefits-title { font-size: 14px; font-weight: 800; color: #92400e; text-transform: uppercase; letter-spacing: 0.5px; margin-bottom: 14px; display: flex; align-items: center; gap: 6px; }
    .benefit-item { margin-bottom: 14px; padding-bottom: 12px; border-bottom: 1px solid #f1f5f9; }
    .benefit-item:last-child { margin-bottom: 0; padding-bottom: 0; border-bottom: none; }
    .benefit-title { font-weight: 700; color: #0f172a; font-size: 13px; }
    .benefit-desc { font-size: 12.5px; color: #475569; margin: 2px 0 0 0; line-height: 1.5; }
    .payment-box { background: linear-gradient(135deg, #fffbeb 0%, #fef3c7 100%); border: 2px solid #f59e0b; border-radius: 14px; padding: 22px 20px; margin: 26px 0; }
    .payment-title { font-size: 14px; font-weight: 800; color: #78350f; text-transform: uppercase; letter-spacing: 0.5px; margin-bottom: 14px; }
    .payment-table { width: 100%; border-collapse: collapse; font-size: 13px; }
    .payment-table td { padding: 6px 0; vertical-align: top; }
    .payment-table td.label { color: #78350f; font-weight: 600; width: 40%; }
    .payment-table td.value { color: #0f172a; font-weight: 700; width: 60%; }
    .payment-table td.value strong { color: #92400e; font-size: 14px; }
    .concept-highlight { background: #ffffff; border: 1px dashed #d97706; padding: 8px 12px; border-radius: 8px; font-family: monospace; font-size: 12px; font-weight: 700; color: #92400e; display: inline-block; margin-top: 4px; }
    .btn-portal { display: block; width: fit-content; margin: 18px auto 6px auto; background: linear-gradient(135deg, #b45309 0%, #d97706 100%); color: #ffffff !important; text-decoration: none; padding: 12px 24px; border-radius: 10px; font-weight: 700; font-size: 13px; text-align: center; box-shadow: 0 4px 12px rgba(180, 83, 9, 0.25); }
    .signature { margin-top: 30px; padding-top: 20px; border-top: 1px solid #e2e8f0; }
    .signature-name { font-weight: 800; font-size: 14px; color: #0f172a; margin: 0; }
    .signature-title { font-size: 12px; color: #92400e; font-weight: 700; margin: 2px 0 0 0; }
    .signature-org { font-size: 11px; color: #64748b; margin: 2px 0 0 0; }
    .footer { background: #f8fafc; padding: 20px 24px; text-align: center; font-size: 11px; color: #94a3b8; border-top: 1px solid #e2e8f0; }
    .footer a { color: #92400e; text-decoration: underline; }
  </style>
</head>
<body>
  <div class="container">
    
    <!-- Membrete Oficial -->
    <div class="header">
      <div class="subtitle">Cámara Gastronómica del Estado Mérida</div>
      <h1>MÉRIDA GASTRONÓMICA</h1>
      <div class="rif">RIF: J-50508608-0 &bull; Dirección de Tesorería, Gestión & Finanzas</div>
    </div>

    <!-- Contenido del Correo -->
    <div class="body-content">
      
      <div class="badge-cycle">Ciclo Administrativo &bull; Noviembre 2026</div>

      <div class="salutation">
        Estimado(a) ${member.representante_legal || 'Representante Legal'} / ${member.nombre_establecimiento}:
      </div>

      <p style="margin: 0 0 14px 0;">
        Reciba un distinguido y cordial saludo en nombre de la Dirección de Tesorería y la Junta Directiva de la <strong>Cámara Gastronómica del Estado Mérida (CGEM)</strong>.
      </p>

      <p style="margin: 0 0 14px 0;">
        Nos dirigimos a usted con motivo del ciclo administrativo de renovación de su membresía gremial correspondiente al mes de <strong>Noviembre 2026</strong>, cuya fecha de corte es el <strong>05 de Noviembre de 2026</strong>.
      </p>

      <p style="margin: 0 0 20px 0;">
        Ser parte activa de la Cámara Gastronómica ratifica el liderazgo y visión de su empresa en el desarrollo turístico y productivo de la región andina. Como agremiado solvente, su negocio disfruta de ventajas institucionales exclusivas:
      </p>

      <!-- Beneficios -->
      <div class="benefits-box">
        <div class="benefits-title">
          🌟 ¿Qué obtienes como Agremiado?
        </div>

        <div class="benefit-item">
          <div class="benefit-title">💳 Convenio de Descuentos VIP en Suraki (En proceso de emisión de tarjetas):</div>
          <div class="benefit-desc">Descuentos en compras como cliente VIP de Suraki presentando tu tarjeta física de miembro agremiado.</div>
        </div>

        <div class="benefit-item">
          <div class="benefit-title">📰 Presencia en Promoción Web & Revista Impresa:</div>
          <div class="benefit-desc">Difusión oficial en el portal web <a href="https://www.meridagastronomica.com" style="color: #92400e; font-weight: bold;">meridagastronomica.com</a> y en la revista impresa Mérida Gastronómica de alto tiraje.</div>
        </div>

        <div class="benefit-item">
          <div class="benefit-title">🗺️ Geolocalización en Cartografía Turística Oficial:</div>
          <div class="benefit-desc">Tu posada o restaurante geolocalizado en la cartografía turística oficial de Mérida y Mapa Interactivo 3D ante visitantes y turistas.</div>
        </div>

        <div class="benefit-item">
          <div class="benefit-title">🛡️ Respaldo Gremial e Institucional:</div>
          <div class="benefit-desc">Representación sólida ante CORMETUR, MINTUR, SENIAT, SAMAT y acceso a convenios preferenciales de proveeduría.</div>
        </div>

        <div class="benefit-item">
          <div class="benefit-title">🛵 100% de Exoneración en Glubbi.app:</div>
          <div class="benefit-desc">Exoneración total en el pago de la aplicación delivery Glubbi.app para el servicio y despacho digital de su establecimiento.</div>
        </div>

        <div class="benefit-item">
          <div class="benefit-title">🎓 Formación de Vanguardia:</div>
          <div class="benefit-desc">Tarifas preferenciales y becas gremiales en talleres, diplomados y actividades conjuntas con el Instituto Universitario de Tecnología Dr. Cristóbal Mendoza (IUTCM).</div>
        </div>
      </div>

      <!-- Datos Oficiales para Pago Móvil / Transferencia -->
      <div class="payment-box">
        <div class="payment-title">💳 Datos Oficiales para Pago Móvil / Transferencia:</div>
        
        <table class="payment-table">
          <tr>
            <td class="label">Monto Cuota:</td>
            <td class="value"><strong>$${cuotaUsd} USD</strong> (al cambio oficial BCV de la fecha de pago)</td>
          </tr>
          <tr>
            <td class="label">Banco Receptor:</td>
            <td class="value">Banco Provincial (0108)</td>
          </tr>
          <tr>
            <td class="label">RIF / Cédula:</td>
            <td class="value">V-12.517.086</td>
          </tr>
          <tr>
            <td class="label">Teléfono Pago Móvil:</td>
            <td class="value">0414-8817137</td>
          </tr>
          <tr>
            <td class="label">Concepto a Colocar:</td>
            <td class="value">
              <span class="concept-highlight">${conceptoExacto}</span>
            </td>
          </tr>
          <tr>
            <td class="label" style="padding-top: 10px;">Reporte del Comprobante:</td>
            <td class="value" style="padding-top: 10px;">
              Esto se hace directo por su usuario web con carga de comprobante y cálculo automático en Bs.
            </td>
          </tr>
        </table>

        <a href="https://www.meridagastronomica.com/afiliacion" class="btn-portal">
          Ingresar al Portal Web y Reportar Pago &rarr;
        </a>
      </div>

      <!-- Firma Institucional -->
      <div class="signature">
        <p class="signature-name">Edixon Xavier Reyes Dávila</p>
        <p class="signature-title">Director de Tesorería</p>
        <p class="signature-org">Gestión y Finanzas &bull; Cámara Gastronómica del Estado Mérida (CGEM)</p>
      </div>

    </div>

    <!-- Footer -->
    <div class="footer">
      <p style="margin: 0 0 6px 0;">Cámara Gastronómica del Estado Mérida &bull; Plataforma Oficial <a href="https://www.meridagastronomica.com">meridagastronomica.com</a></p>
      <p style="margin: 0;">Para atención directa de Tesorería: WhatsApp Oficial <a href="https://wa.me/584148817137">+58 414-8817137</a></p>
    </div>

  </div>
</body>
</html>`;
}

function buildEmailPlainText(member) {
  const cuotaUsd = (parseFloat(member.monto_cuota_mensual) || 10).toFixed(2);
  const conceptoExacto = `Cuota Noviembre ${member.codigo_afiliado} - ${member.nombre_establecimiento}`;

  return `CÁMARA GASTRONÓMICA DEL ESTADO MÉRIDA (CGEM)
Dirección de Tesorería, Gestión & Finanzas
RIF: J-50508608-0

Estimado(a) ${member.representante_legal || 'Representante'} / ${member.nombre_establecimiento}:

Reciba un distinguido y cordial saludo en nombre de la Dirección de Tesorería y la Junta Directiva de la Cámara Gastronómica del Estado Mérida (CGEM).

Nos dirigimos a usted con motivo del ciclo administrativo de renovación de su membresía gremial correspondiente al mes de Noviembre 2026, cuya fecha de corte es el 05 de Noviembre de 2026.

Ser parte activa de la Cámara Gastronómica ratifica el liderazgo y visión de su empresa en el desarrollo turístico y productivo de la región andina. Como agremiado solvente, su negocio disfruta de ventajas institucionales exclusivas:

🌟 ¿Qué obtienes como Agremiado?

💳 Convenio de Descuentos VIP en Suraki (En proceso de emisión de tarjetas):
Descuentos en compras como cliente VIP de Suraki presentando tu tarjeta física de miembro agremiado.

📰 Presencia en Promoción Web & Revista Impresa:
Difusión oficial en el portal web meridagastronomica.com y en la revista impresa Mérida Gastronómica de alto tiraje.

🗺️ Geolocalización en Cartografía Turística Oficial:
Tu posada o restaurante geolocalizado en la cartografía turística oficial de Mérida y Mapa Interactivo 3D ante visitantes y turistas.

🛡️ Respaldo Gremial e Institucional:
Representación sólida ante CORMETUR, MINTUR, SENIAT, SAMAT y acceso a convenios preferenciales de proveeduría.

🛵 100% de Exoneración en Glubbi.app:
Exoneración total en el pago de la aplicación delivery Glubbi.app para el servicio y despacho digital de su establecimiento.

🎓 Formación de Vanguardia:
Tarifas preferenciales y becas gremiales en talleres, diplomados y actividades conjuntas con el Instituto Universitario de Tecnología Dr. Cristóbal Mendoza (IUTCM).

💳 Datos Oficiales para Pago Móvil / Transferencia:
- Monto Cuota: $${cuotaUsd} USD (al cambio oficial BCV de la fecha de pago)
- Banco Receptor: Banco Provincial (0108)
- RIF / Cédula: V-12.517.086
- Teléfono Pago Móvil: 0414-8817137
- Concepto a Colocar: ${conceptoExacto}
- Reporte del Comprobante: Esto se hace directo por su usuario web en https://www.meridagastronomica.com/afiliacion

Atentamente,

Edixon Xavier Reyes Dávila
Director de Tesorería
Gestión y Finanzas CGEM
Cámara Gastronómica del Estado Mérida`;
}

async function sendAllRenewals() {
  console.log('--- INICIANDO ENVÍO DE CORREOS DE RENOVACIÓN NOVIEMBRE 2026 ---');

  const { data: members, error } = await supabase
    .from('directorio_agremiados')
    .select('codigo_afiliado, nombre_establecimiento, representante_legal, email, telefono, monto_cuota_mensual');

  if (error || !members) {
    console.error('Error cargando agremiados:', error);
    process.exit(1);
  }

  const recipients = members.filter(m => {
    const email = (m.email || '').toLowerCase().trim();
    return email && !EXCLUDED_EMAILS.includes(email);
  });

  console.log(`Total de agremiados en base de datos: ${members.length}`);
  console.log(`Total a enviar (tras excluir a los 4 indicados): ${recipients.length}\n`);

  const results = [];

  for (let i = 0; i < recipients.length; i++) {
    const member = recipients[i];
    const email = member.email.trim();
    const subject = `Renovación de Membresía Gremial Noviembre 2026 - ${member.nombre_establecimiento} (${member.codigo_afiliado})`;
    const html = buildEmailHtml(member);
    const text = buildEmailPlainText(member);

    console.log(`[${i + 1}/${recipients.length}] Enviando a ${member.nombre_establecimiento} <${email}>...`);

    try {
      const res = await resend.emails.send({
        from: env.RESEND_FROM_EMAIL || 'Mérida Gastronómica <notificaciones@meridagastronomica.com>',
        reply_to: 'notificaciones@meridagastronomica.com',
        to: email,
        subject,
        html,
        text
      });

      if (res.error) {
        console.error(`  ❌ Error enviando a ${email}:`, res.error);
        results.push({ email, name: member.nombre_establecimiento, status: 'error', error: res.error });
      } else {
        console.log(`  ✅ Enviado con éxito. ID Resend: ${res.data?.id}`);
        results.push({ email, name: member.nombre_establecimiento, status: 'success', id: res.data?.id });
      }
    } catch (sendErr) {
      console.error(`  ❌ Excepción enviando a ${email}:`, sendErr.message);
      results.push({ email, name: member.nombre_establecimiento, status: 'exception', error: sendErr.message });
    }

    // Delay de 750ms entre envíos para cumplir con rate limits de Resend
    await new Promise(resolve => setTimeout(resolve, 750));
  }

  console.log('\n--- RESUMEN FINAL DE ENVÍOS ---');
  const successCount = results.filter(r => r.status === 'success').length;
  const errorCount = results.filter(r => r.status !== 'success').length;
  console.log(`Exitosos: ${successCount}`);
  console.log(`Fallidos: ${errorCount}`);

  fs.writeFileSync('scripts/last_renewal_email_results.json', JSON.stringify(results, null, 2));
  console.log('Resultados guardados en scripts/last_renewal_email_results.json');
}

sendAllRenewals();
