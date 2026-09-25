/**
 * Servicio de envío de correos utilizando Resend a través del endpoint /api/send-email.
 * Compatible tanto en desarrollo local (Vite dev server) como en producción (Vercel Serverless Functions).
 */

const getEmailBaseTemplate = (title, contentHtml) => `
<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${title}</title>
  <style>
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: #f8fafc; margin: 0; padding: 24px; color: #1e293b; }
    .container { max-width: 600px; margin: 0 auto; background: #ffffff; border-radius: 12px; overflow: hidden; border: 1px solid #e2e8f0; box-shadow: 0 4px 6px -1px rgba(0,0,0,0.05); }
    .header { background: linear-gradient(135deg, #7c2d12 0%, #b45309 100%); padding: 28px 24px; text-align: center; color: #ffffff; }
    .header h1 { margin: 0; font-size: 22px; font-weight: 700; letter-spacing: -0.5px; }
    .header p { margin: 6px 0 0 0; font-size: 13px; color: #fde68a; opacity: 0.95; }
    .body { padding: 28px 24px; font-size: 14px; line-height: 1.6; color: #334155; }
    .footer { background-color: #f1f5f9; padding: 18px 24px; text-align: center; font-size: 12px; color: #64748b; border-top: 1px solid #e2e8f0; }
    .info-box { background: #fdf8f6; border-left: 4px solid #b45309; padding: 14px 16px; border-radius: 6px; margin: 16px 0; }
    .badge { display: inline-block; background: #ea580c; color: white; padding: 4px 10px; border-radius: 9999px; font-size: 11px; font-weight: 600; text-transform: uppercase; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>Mérida Gastronómica</h1>
      <p>Cámara Gastronómica del Estado Mérida &bull; Plataforma Oficial</p>
    </div>
    <div class="body">
      ${contentHtml}
    </div>
    <div class="footer">
      <p>© ${new Date().getFullYear()} Cámara Gastronómica del Estado Mérida. Todos los derechos reservados.</p>
      <p>Este correo fue generado automáticamente por la plataforma web.</p>
    </div>
  </div>
</body>
</html>
`;

/**
 * Función base para enviar correo electrónico mediante /api/send-email
 */
export async function sendEmail({ to, subject, html, text, from, replyTo }) {
  try {
    const response = await fetch('/api/send-email', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        to,
        subject,
        html,
        text,
        from,
        replyTo,
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error?.message || data.error || 'Error al enviar correo.');
    }

    return { success: true, data };
  } catch (error) {
    console.error('Error en emailService.sendEmail:', error);
    return { success: false, error: error.message };
  }
}

/**
 * Notificación de Reserva para Restaurante / Cliente
 */
export async function sendReservationEmail({
  restaurantName,
  restaurantEmail,
  guestName,
  guestEmail,
  guestPhone,
  date,
  time,
  guests,
  notes,
}) {
  const subject = `Nueva Solicitud de Reserva: ${guestName} - ${restaurantName}`;
  
  const content = `
    <h2 style="color: #0f172a; margin-top: 0;">Nueva Solicitud de Reserva Formal</h2>
    <p>Se ha recibido una nueva solicitud de reserva a través de la Guía Oficial de <strong>Mérida Gastronómica</strong>.</p>
    
    <div class="info-box">
      <p style="margin: 4px 0;"><strong>Restaurante:</strong> ${restaurantName}</p>
      <p style="margin: 4px 0;"><strong>Nombre del Comensal:</strong> ${guestName}</p>
      <p style="margin: 4px 0;"><strong>Teléfono:</strong> ${guestPhone || 'No especificado'}</p>
      <p style="margin: 4px 0;"><strong>Correo:</strong> ${guestEmail || 'No especificado'}</p>
      <p style="margin: 4px 0;"><strong>Fecha Solicitada:</strong> ${date || 'Próxima disponibilidad'}</p>
      ${time ? `<p style="margin: 4px 0;"><strong>Hora:</strong> ${time}</p>` : ''}
      <p style="margin: 4px 0;"><strong>Número de Personas:</strong> ${guests || 2}</p>
      ${notes ? `<p style="margin: 4px 0;"><strong>Comentarios / Preferencias:</strong> ${notes}</p>` : ''}
    </div>

    <p style="font-size: 13px; color: #64748b;">
      Por favor, comuníquese con el cliente para confirmar la disponibilidad y formalizar la reservación.
    </p>
  `;

  return sendEmail({
    to: restaurantEmail || guestEmail,
    replyTo: guestEmail,
    subject,
    html: getEmailBaseTemplate(subject, content),
    text: `Reserva para ${restaurantName}. Solicitante: ${guestName} (${guestPhone}, ${guestEmail}). Fecha: ${date}, Personas: ${guests}.`,
  });
}

/**
 * Notificación de Solicitud de Certificación Sello Gastronómico
 */
export async function sendSelloRequestEmail({
  businessName,
  applicantName,
  applicantEmail,
  applicantPhone,
  category,
  zone,
  notes,
}) {
  const subject = `Solicitud Sello Gastronómico: ${businessName}`;

  const content = `
    <h2 style="color: #0f172a; margin-top: 0;">Solicitud de Evaluación de Sello Gastronómico</h2>
    <p>Un establecimiento ha postulado para la certificación y auditoría de calidad de la Cámara Gastronómica.</p>
    
    <div class="info-box">
      <p style="margin: 4px 0;"><strong>Establecimiento:</strong> ${businessName}</p>
      <p style="margin: 4px 0;"><strong>Representante / Contacto:</strong> ${applicantName}</p>
      <p style="margin: 4px 0;"><strong>Correo de Contacto:</strong> ${applicantEmail}</p>
      <p style="margin: 4px 0;"><strong>Teléfono:</strong> ${applicantPhone}</p>
      <p style="margin: 4px 0;"><strong>Categoría:</strong> ${category || 'Restaurante / Alta Cocina'}</p>
      <p style="margin: 4px 0;"><strong>Zona / Municipio:</strong> ${zone || 'Mérida'}</p>
      ${notes ? `<p style="margin: 4px 0;"><strong>Detalles adicionales:</strong> ${notes}</p>` : ''}
    </div>
  `;

  return sendEmail({
    to: applicantEmail,
    replyTo: applicantEmail,
    subject,
    html: getEmailBaseTemplate(subject, content),
  });
}

/**
 * Notificación de Postulación a Bolsa de Trabajo
 */
export async function sendJobApplicationEmail({
  jobTitle,
  applicantName,
  applicantEmail,
  applicantPhone,
  experience,
  education,
  message,
}) {
  const subject = `Nueva Postulación Laboral: ${applicantName} - ${jobTitle}`;

  const content = `
    <h2 style="color: #0f172a; margin-top: 0;">Postulación a Vacante Laboral</h2>
    <p>Se ha recibido una nueva postulación para la vacante: <strong>${jobTitle}</strong>.</p>
    
    <div class="info-box">
      <p style="margin: 4px 0;"><strong>Candidato:</strong> ${applicantName}</p>
      <p style="margin: 4px 0;"><strong>Correo:</strong> ${applicantEmail}</p>
      <p style="margin: 4px 0;"><strong>Teléfono:</strong> ${applicantPhone || 'No indicado'}</p>
      <p style="margin: 4px 0;"><strong>Experiencia:</strong> ${experience || 'No especificada'}</p>
      <p style="margin: 4px 0;"><strong>Formación:</strong> ${education || 'No especificada'}</p>
      ${message ? `<p style="margin: 4px 0;"><strong>Mensaje / Presentación:</strong> ${message}</p>` : ''}
    </div>
  `;

  return sendEmail({
    to: applicantEmail,
    replyTo: applicantEmail,
    subject,
    html: getEmailBaseTemplate(subject, content),
  });
}

/**
 * Notificación de Confirmación de Asistencia a Eventos (RSVP)
 */
export async function sendEventRsvpEmail({
  eventTitle,
  eventDate,
  attendeeName,
  attendeeEmail,
  attendeePhone,
  tickets = 1,
}) {
  const subject = `Acreditación Confirmada: ${eventTitle}`;

  const content = `
    <h2 style="color: #0f172a; margin-top: 0;">Acreditación y Pase Digital</h2>
    <p>Estimado/a <strong>${attendeeName}</strong>, tu registro para el evento ha sido procesado con éxito.</p>
    
    <div class="info-box">
      <p style="margin: 4px 0;"><strong>Evento:</strong> ${eventTitle}</p>
      <p style="margin: 4px 0;"><strong>Fecha:</strong> ${eventDate || 'Próximamente'}</p>
      <p style="margin: 4px 0;"><strong>Asistente:</strong> ${attendeeName}</p>
      <p style="margin: 4px 0;"><strong>Pases Reservados:</strong> ${tickets}</p>
    </div>

    <p style="font-size: 13px; color: #64748b;">
      Presenta este correo o tu documento de identidad en el acceso al evento para validar tu entrada.
    </p>
  `;

  return sendEmail({
    to: attendeeEmail,
    subject,
    html: getEmailBaseTemplate(subject, content),
  });
}

/**
 * Notificación y Bienvenida Oficial de Nuevo Miembro Agremiado
 */
export async function sendAffiliateWelcomeEmail({
  affiliateCode,
  restaurantName,
  ownerName,
  email,
  phone,
  businessType,
  category,
  referenceNumber,
  amountBs,
}) {
  const subject = `¡Bienvenido a la Cámara Gastronómica de Mérida! Código: ${affiliateCode}`;

  const content = `
    <h2 style="color: #0f172a; margin-top: 0;">¡Bienvenido a la Cámara Gastronómica del Estado Mérida!</h2>
    <p>Estimado/a <strong>${ownerName}</strong>,</p>
    <p>En nombre de la Junta Directiva de la Cámara Gastronómica del Estado Mérida, nos complace confirmar el registro de afiliación gremial de <strong>${restaurantName}</strong>.</p>
    
    <div class="info-box">
      <p style="margin: 4px 0;"><strong>Código de Afiliado Asignado:</strong> <span style="font-size: 16px; color: #b45309; font-weight: bold;">${affiliateCode}</span></p>
      <p style="margin: 4px 0;"><strong>Establecimiento:</strong> ${restaurantName}</p>
      <p style="margin: 4px 0;"><strong>Titular / Representante:</strong> ${ownerName}</p>
      <p style="margin: 4px 0;"><strong>Tipo de Negocio:</strong> ${businessType || 'Comercial'}</p>
      <p style="margin: 4px 0;"><strong>Categoría:</strong> ${category || 'Gastronomía'}</p>
      <p style="margin: 4px 0;"><strong>Referencia Pago Móvil:</strong> ${referenceNumber || 'Registrado'}</p>
      ${amountBs ? `<p style="margin: 4px 0;"><strong>Monto Cuota:</strong> Bs. ${amountBs}</p>` : ''}
      <p style="margin: 4px 0;"><strong>Estado:</strong> <span style="color: #059669; font-weight: bold;">Activo (Pago en Verificación)</span></p>
    </div>

    <h3 style="color: #0f172a; font-size: 15px; margin-top: 20px;">Beneficios Activos de su Membresía:</h3>
    <ul style="padding-left: 20px; margin: 10px 0; color: #475569;">
      <li>Presencia oficial en la Guía Gastronómica y Mapa 3D interactivo.</li>
      <li>Postulación al Sello de Calidad Gastronómica Mérida AAA.</li>
      <li>Acceso al Centro de Recursos Jurídicos, Fiscales y Sanitarios.</li>
      <li>Bolsa de Empleo con aspirantes formados por la ULA y Hotel Escuela.</li>
      <li>Portal privado de agremiados para descarga de solvencias y certificados.</li>
    </ul>

    <p style="font-size: 13px; color: #64748b; margin-top: 24px;">
      Puede ingresar en cualquier momento a su panel privado utilizando su correo electrónico o su código de afiliado: <strong>${affiliateCode}</strong>.
    </p>
  `;

  return sendEmail({
    to: email,
    replyTo: 'contacto@meridagastronomica.com',
    subject,
    html: getEmailBaseTemplate(subject, content),
    text: `Bienvenido a la Cámara Gastronómica del Estado Mérida. Su código de afiliado asignado es: ${affiliateCode} para el establecimiento ${restaurantName}.`
  });
}

