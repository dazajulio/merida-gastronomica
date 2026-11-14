const fs = require('fs');
const dotenv = fs.readFileSync('.env', 'utf8');
const env = {};
dotenv.split('\n').forEach(line => {
  const [k, ...v] = line.trim().split('=');
  if (k && v.length) env[k.trim()] = v.join('=').trim();
});

const { Resend } = require('resend');
const resend = new Resend(env.RESEND_API_KEY || env.resend_api_key);

async function sendWelcomePiur() {
  const subject = '¡Bienvenida a la Cámara Gastronómica del Estado Mérida! — Piur (CGM-VALLE-842)';
  
  const html = `<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${subject}</title>
  <style>
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: #f1f5f9; margin: 0; padding: 24px 10px; color: #1e293b; }
    .container { max-width: 620px; margin: 0 auto; background: #ffffff; border-radius: 18px; overflow: hidden; border: 1px solid #e2e8f0; box-shadow: 0 10px 25px -5px rgba(0,0,0,0.06); }
    .header { background: linear-gradient(135deg, #064e3b 0%, #047857 50%, #b45309 100%); padding: 34px 24px; text-align: center; color: #ffffff; }
    .header h1 { margin: 0; font-size: 22px; font-weight: 800; letter-spacing: -0.5px; font-family: Georgia, serif; }
    .header .subtitle { margin: 6px 0 0 0; font-size: 12px; color: #a7f3d0; font-weight: 700; text-transform: uppercase; letter-spacing: 1px; }
    .header .rif { font-size: 10px; color: #d1fae5; opacity: 0.85; margin-top: 4px; }
    .body-content { padding: 30px 26px; font-size: 14px; line-height: 1.65; color: #334155; }
    .salutation { font-size: 16px; font-weight: 800; color: #0f172a; margin-bottom: 12px; }
    .badge-welcome { display: inline-block; background: #dcfce7; border: 1px solid #86efac; color: #166534; padding: 5px 14px; border-radius: 9999px; font-size: 11px; font-weight: 800; text-transform: uppercase; margin-bottom: 18px; }
    .card-credentials { background: #f0fdf4; border: 2px solid #22c55e; border-radius: 14px; padding: 20px; margin: 20px 0; }
    .card-title { font-size: 13px; font-weight: 800; color: #166534; text-transform: uppercase; letter-spacing: 0.5px; margin-bottom: 12px; }
    .table-creds { width: 100%; border-collapse: collapse; font-size: 13px; }
    .table-creds td { padding: 5px 0; vertical-align: top; }
    .table-creds td.lbl { color: #15803d; font-weight: 600; width: 38%; }
    .table-creds td.val { color: #0f172a; font-weight: 700; width: 62%; }
    .table-creds td.val strong { color: #047857; font-size: 14px; font-family: monospace; }
    .benefits-box { background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 14px; padding: 20px; margin: 22px 0; }
    .benefit-item { margin-bottom: 12px; padding-bottom: 10px; border-bottom: 1px solid #f1f5f9; }
    .benefit-item:last-child { margin-bottom: 0; padding-bottom: 0; border-bottom: none; }
    .benefit-title { font-weight: 700; color: #0f172a; font-size: 13px; }
    .benefit-desc { font-size: 12px; color: #475569; margin: 2px 0 0 0; }
    .btn-portal { display: block; width: fit-content; margin: 22px auto 8px auto; background: linear-gradient(135deg, #047857 0%, #059669 100%); color: #ffffff !important; text-decoration: none; padding: 13px 26px; border-radius: 10px; font-weight: 700; font-size: 13px; text-align: center; box-shadow: 0 4px 12px rgba(4, 120, 87, 0.25); }
    .signatures { display: table; width: 100%; margin-top: 30px; padding-top: 20px; border-top: 1px solid #e2e8f0; }
    .sig-col { display: table-cell; width: 50%; vertical-align: top; }
    .sig-name { font-weight: 800; font-size: 13px; color: #0f172a; margin: 0; }
    .sig-role { font-size: 11px; color: #047857; font-weight: 700; margin: 2px 0 0 0; }
    .sig-org { font-size: 10px; color: #64748b; margin: 1px 0 0 0; }
    .footer { background: #f8fafc; padding: 18px 24px; text-align: center; font-size: 11px; color: #94a3b8; border-top: 1px solid #e2e8f0; }
    .footer a { color: #047857; text-decoration: underline; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <div class="subtitle">Cámara Gastronómica del Estado Mérida</div>
      <h1>MÉRIDA GASTRONÓMICA</h1>
      <div class="rif">RIF: J-50508608-0 &bull; Circuito Turístico El Valle te Conecta</div>
    </div>

    <div class="body-content">
      <div class="badge-welcome">Membresía Oficial Activada &bull; Circuito El Valle</div>

      <div class="salutation">
        ¡Estimada Isabel Perdomo y equipo de Piur!
      </div>

      <p style="margin: 0 0 14px 0;">
        En nombre de la Junta Directiva y la Dirección de Tesorería de la <strong>Cámara Gastronómica del Estado Mérida (CGEM)</strong>, nos complace darle la más cordial bienvenida como miembro oficial agremiado bajo el convenio estratégico <strong>El Valle te Conecta</strong>.
      </p>

      <p style="margin: 0 0 16px 0;">
        La propuesta de <strong>Piur</strong> —con sus postres saludables, repostería artesanal, delicias probióticas y helados cremosos elaborados con kéfir de leche en la Posada La Chapeta— enriquece notablemente la ruta gastronómica y el atractivo turístico del Valle de Mérida.
      </p>

      <div class="card-credentials">
        <div class="card-title">📋 Credenciales de tu Ficha Gremial:</div>
        <table class="table-creds">
          <tr>
            <td class="lbl">Establecimiento:</td>
            <td class="val">Piur (Casa de Postres Saludables & Kéfir)</td>
          </tr>
          <tr>
            <td class="lbl">Titular Responsable:</td>
            <td class="val">Isabel Perdomo</td>
          </tr>
          <tr>
            <td class="lbl">Código Asignado:</td>
            <td class="val"><strong>CGM-VALLE-842</strong></td>
          </tr>
          <tr>
            <td class="lbl">Sector / Ubicación:</td>
            <td class="val">Sector La Carbonera, Posada La Chapeta, El Valle</td>
          </tr>
          <tr>
            <td class="lbl">Convenio Aplicado:</td>
            <td class="val">El Valle te Conecta (Inscripción Exonerada $0)</td>
          </tr>
          <tr>
            <td class="lbl">Cuota Mensual:</td>
            <td class="val"><strong>$7.00 USD</strong> / mes (Tarifa Preferencial)</td>
          </tr>
          <tr>
            <td class="lbl">Pago Conciliado:</td>
            <td class="val">Ref: 822831 &bull; Bs. 6.227,03 (BANFANB)</td>
          </tr>
          <tr>
            <td class="lbl">Estatus Actual:</td>
            <td class="val"><span style="color: #15803d; font-weight: bold;">✓ Solvente (Noviembre 2026)</span></td>
          </tr>
        </table>
      </div>

      <div class="benefits-box">
        <div style="font-size: 13px; font-weight: 800; color: #0f172a; text-transform: uppercase; margin-bottom: 12px;">
          🌟 Beneficios Activos para Piur:
        </div>
        <div class="benefit-item">
          <div class="benefit-title">🗺️ Geolocalización en Cartografía Turística 3D:</div>
          <div class="benefit-desc">Tu casa de postres en Posada La Chapeta visible en el mapa interactivo oficial de Mérida Gastronómica.</div>
        </div>
        <div class="benefit-item">
          <div class="benefit-title">💳 Convenio VIP Suraki:</div>
          <div class="benefit-desc">Descuentos exclusivos como cliente VIP en compras comerciales con tu carnet de miembro agremiado.</div>
        </div>
        <div class="benefit-item">
          <div class="benefit-title">🛵 100% Exoneración en Glubbi.app:</div>
          <div class="benefit-desc">Servicio de despacho delivery digital totalmente exonerado de costos de suscripción.</div>
        </div>
        <div class="benefit-item">
          <div class="benefit-title">📰 Difusión en Guía Web & Revista Impresa:</div>
          <div class="benefit-desc">Presencia oficial en meridagastronomica.com y reportajes en la revista física de la Cámara.</div>
        </div>
        <div class="benefit-item">
          <div class="benefit-title">🎓 Formación con IUTCM:</div>
          <div class="benefit-desc">Tarifas preferenciales y becas gremiales en talleres, diplomados y actividades formativas.</div>
        </div>
      </div>

      <div style="background: #fffbeb; border: 1px solid #fde68a; border-radius: 12px; padding: 16px; margin: 20px 0; font-size: 13px;">
        <strong style="color: #92400e; display: block; margin-bottom: 6px;">📲 Ingreso a tu Portal de Negocio:</strong>
        Ya puedes ingresar en <a href="https://www.meridagastronomica.com/afiliacion" style="color: #b45309; font-weight: bold;">meridagastronomica.com/afiliacion</a> usando tu correo <strong>piurmerida@gmail.com</strong> o tu código <strong>CGM-VALLE-842</strong> para personalizar tu menú, fotos y horarios de atención (Viernes a Domingo).
      </div>

      <a href="https://www.meridagastronomica.com/afiliacion" class="btn-portal">
        Ingresar a mi Portal de Afiliado &rarr;
      </a>

      <div class="signatures">
        <div class="sig-col">
          <p class="sig-name">Julio Alberto Daza Celis</p>
          <p class="sig-role">Presidente</p>
          <p class="sig-org">Cámara Gastronómica del Estado Mérida</p>
        </div>
        <div class="sig-col">
          <p class="sig-name">Edixon Xavier Reyes Dávila</p>
          <p class="sig-role">Director de Tesorería</p>
          <p class="sig-org">Gestión y Finanzas CGEM</p>
        </div>
      </div>
    </div>

    <div class="footer">
      <p style="margin: 0 0 4px 0;">Cámara Gastronómica del Estado Mérida &bull; <a href="https://www.meridagastronomica.com">meridagastronomica.com</a></p>
      <p style="margin: 0;">Línea Oficial WhatsApp: <a href="https://wa.me/584148817137">+58 414-8817137</a> &bull; El Valle, Mérida, Venezuela</p>
    </div>
  </div>
</body>
</html>`;

  const text = `¡Bienvenida a la Cámara Gastronómica del Estado Mérida!

Estimada Isabel Perdomo y equipo de Piur:

Nos complace darle la más cordial bienvenida como miembro oficial agremiado bajo el convenio estratégico El Valle te Conecta.

Datos de su Ficha Gremial:
- Establecimiento: Piur (Casa de Postres Saludables & Kéfir Probiótico)
- Titular: Isabel Perdomo
- Código Asignado: CGM-VALLE-842
- Ubicación: La Carbonera, Posada La Chapeta, El Valle, Mérida
- Plan: Convenio El Valle te Conecta ($0 Inscripción, Cuota Preferencial: $7.00 USD/mes)
- Pago Conciliado: Ref BANFANB 822831 (Bs. 6.227,03)
- Estatus: Solvente (Noviembre 2026)

Ya puede ingresar a su portal en https://www.meridagastronomica.com/afiliacion con su correo piurmerida@gmail.com o código CGM-VALLE-842 para cargar sus fotos y menú.

Atentamente,

Julio Alberto Daza Celis - Presidente
Edixon Xavier Reyes Dávila - Director de Tesorería
Cámara Gastronómica del Estado Mérida`;

  const res = await resend.emails.send({
    from: env.RESEND_FROM_EMAIL || 'Mérida Gastronómica <notificaciones@meridagastronomica.com>',
    reply_to: 'notificaciones@meridagastronomica.com',
    to: 'piurmerida@gmail.com',
    subject,
    html,
    text
  });

  console.log('Send welcome email result:', res);
}

sendWelcomePiur();
