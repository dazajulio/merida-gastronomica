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
  status,
  isAlliance,
  allianceDetails
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
      ${isAlliance ? `
        <p style="margin: 4px 0;"><strong>Modalidad de Afiliación:</strong> <span style="color: #047857; font-weight: bold;">Convenio / Alianza Estratégica Institucional</span></p>
        <p style="margin: 4px 0;"><strong>Detalles del Convenio:</strong> ${allianceDetails || 'Intercambio institucional de locación para eventos y actividades de la Cámara Gastronómica.'}</p>
      ` : `
        <p style="margin: 4px 0;"><strong>Referencia de Registro:</strong> ${referenceNumber || 'Registrado'}</p>
        ${amountBs ? `<p style="margin: 4px 0;"><strong>Monto Cuota:</strong> Bs. ${amountBs}</p>` : ''}
      `}
      <p style="margin: 4px 0;"><strong>Estado de Solvencia:</strong> <span style="color: #059669; font-weight: bold;">${status || 'Solvente (Activo)'}</span></p>
    </div>

    <h3 style="color: #0f172a; font-size: 16px; margin-top: 24px; margin-bottom: 12px; font-weight: 700; border-bottom: 2px solid #fed7aa; padding-bottom: 6px;">
      Beneficios Exclusivos de su Membresía Gremial:
    </h3>
    
    <table style="width: 100%; border-collapse: collapse; margin-top: 8px;">
      <tbody>
        <tr>
          <td style="padding: 8px 0; vertical-align: top; width: 24px; color: #ea580c; font-weight: bold;">✓</td>
          <td style="padding: 8px 0; vertical-align: top; color: #334155;">
            <strong>Presencia en la Guía Gastronómica y Mapa 3D:</strong> Ficha oficial y georreferenciación en <a href="https://www.meridagastronomica.com" target="_blank" style="color: #c2410c; text-decoration: underline; font-weight: 600;">www.meridagastronomica.com</a>.
          </td>
        </tr>
        <tr>
          <td style="padding: 8px 0; vertical-align: top; width: 24px; color: #ea580c; font-weight: bold;">✓</td>
          <td style="padding: 8px 0; vertical-align: top; color: #334155;">
            <strong>Postulación al Sello de Calidad "Mérida Gastronómica":</strong> Acceso al proceso de auditoría y certificación de excelencia culinaria.
          </td>
        </tr>
        <tr>
          <td style="padding: 8px 0; vertical-align: top; width: 24px; color: #ea580c; font-weight: bold;">✓</td>
          <td style="padding: 8px 0; vertical-align: top; color: #334155;">
            <strong>Integración al Ecosistema Tecnológico Comercial (Glubbi):</strong> Digitalización y delivery predictivo con IA en <a href="https://www.glubbi.app" target="_blank" style="color: #c2410c; text-decoration: underline; font-weight: 600;">www.glubbi.app</a>.
          </td>
        </tr>
        <tr>
          <td style="padding: 8px 0; vertical-align: top; width: 24px; color: #ea580c; font-weight: bold;">✓</td>
          <td style="padding: 8px 0; vertical-align: top; color: #334155;">
            <strong>Acceso al Centro de Recursos Jurídicos y Operativos:</strong> Asesoría en normativas tributarias (SENIAT/SAMAT), ordenanzas y permisos sanitarios.
          </td>
        </tr>
        <tr>
          <td style="padding: 8px 0; vertical-align: top; width: 24px; color: #ea580c; font-weight: bold;">✓</td>
          <td style="padding: 8px 0; vertical-align: top; color: #334155;">
            <strong>Bolsa de Empleo Especializada:</strong> Conexión prioritaria con talento formado en la ULA y Hotel Escuela de Los Andes.
          </td>
        </tr>
        <tr>
          <td style="padding: 8px 0; vertical-align: top; width: 24px; color: #ea580c; font-weight: bold;">✓</td>
          <td style="padding: 8px 0; vertical-align: top; color: #334155;">
            <strong>Portal Privado de Autogestión de Agremiados:</strong> Emisión digital de solvencias, certificados y control de cuotas.
          </td>
        </tr>
        <tr>
          <td style="padding: 8px 0; vertical-align: top; width: 24px; color: #ea580c; font-weight: bold;">✓</td>
          <td style="padding: 8px 0; vertical-align: top; color: #334155;">
            <strong>Participación en los Desayunos Corporativos Mensuales:</strong> Espacios gremiales de networking, negocios y alianzas estratégicas.
          </td>
        </tr>
        <tr>
          <td style="padding: 8px 0; vertical-align: top; width: 24px; color: #ea580c; font-weight: bold;">✓</td>
          <td style="padding: 8px 0; vertical-align: top; color: #334155;">
            <strong>Descarga de Herramientas Operativas (Academia CGEM):</strong> Manuales de servicio, fichas técnicas de costos y programas de formación.
          </td>
        </tr>
        <tr>
          <td style="padding: 8px 0; vertical-align: top; width: 24px; color: #ea580c; font-weight: bold;">✓</td>
          <td style="padding: 8px 0; vertical-align: top; color: #334155;">
            <strong>Precedencia y Beneficios en la Expo Gastronómica 2027:</strong> Descuentos exclusivos y ubicación preferencial en el mayor evento culinario andino.
          </td>
        </tr>
        <tr>
          <td style="padding: 8px 0; vertical-align: top; width: 24px; color: #ea580c; font-weight: bold;">✓</td>
          <td style="padding: 8px 0; vertical-align: top; color: #334155;">
            <strong>Canal Directo para Asesoría Estratégica:</strong> Enlace institucional y acompañamiento continuo por parte de la Junta Directiva.
          </td>
        </tr>
      </tbody>
    </table>

    <p style="font-size: 13px; color: #64748b; margin-top: 24px; border-top: 1px solid #e2e8f0; padding-top: 16px;">
      Puede ingresar en cualquier momento a su panel privado utilizando su correo electrónico o su código de afiliado: <strong>${affiliateCode}</strong> en <a href="https://www.meridagastronomica.com" target="_blank" style="color: #c2410c; font-weight: 600;">meridagastronomica.com</a>.
    </p>
  `;

  return sendEmail({
    to: email,
    replyTo: 'meridacamaragastronomica@gmail.com',
    subject,
    html: getEmailBaseTemplate(subject, content),
    text: `Bienvenido a la Cámara Gastronómica del Estado Mérida. Su código de afiliado asignado es: ${affiliateCode} para el establecimiento ${restaurantName}.`
  });
}

/**
 * Notificación de Confirmación de Asistencia a Actividad de Junta Directiva
 * Envía confirmación al miembro directivo y copia a Dirección Ejecutiva / Presidencia
 */
export async function sendBoardAttendanceEmail({
  memberName,
  memberRole,
  memberEmail,
  eventTitle,
  eventType,
  eventDate,
  eventTime,
  eventLocation,
  isVirtual,
  virtualLink
}) {
  const subject = `Confirmación de Asistencia en Agenda Directiva: ${memberName} (${memberRole}) - ${eventTitle}`;

  const content = `
    <h2 style="color: #0f172a; margin-top: 0;">Confirmación Oficial de Asistencia a Actividad Gremial</h2>
    <p>Se ha registrado formalmente la participación de un miembro de la <strong>Junta Directiva</strong> en la agenda oficial de la Cámara Gastronómica.</p>
    
    <div class="info-box">
      <p style="margin: 4px 0;"><strong>Directivo:</strong> <span style="font-size: 15px; color: #b45309; font-weight: bold;">${memberName}</span></p>
      <p style="margin: 4px 0;"><strong>Cargo / Responsabilidad:</strong> ${memberRole}</p>
      <p style="margin: 4px 0;"><strong>Correo Electrónico:</strong> ${memberEmail}</p>
      <p style="margin: 4px 0;"><strong>Actividad:</strong> ${eventTitle}</p>
      <p style="margin: 4px 0;"><strong>Tipo de Convocatoria:</strong> ${eventType || 'Institucional'}</p>
      <p style="margin: 4px 0;"><strong>Fecha Convocada:</strong> ${eventDate}</p>
      <p style="margin: 4px 0;"><strong>Horario:</strong> ${eventTime || 'Por confirmar'}</p>
      <p style="margin: 4px 0;"><strong>Sede / Ubicación:</strong> ${isVirtual ? `Enlace Virtual: ${virtualLink || 'Por definir'}` : eventLocation}</p>
      <p style="margin: 4px 0;"><strong>Estado de Asistencia:</strong> <span style="color: #059669; font-weight: bold;">✓ CONFIRMADO / VOY A ASISTIR</span></p>
    </div>

    <p style="font-size: 13px; color: #64748b; margin-top: 16px;">
      Esta notificación ha sido enviada automáticamente al buzón del directivo y a la Dirección Ejecutiva para fines de quórum, acreditación y protocolo institucional.
    </p>
  `;

  // Send to board member
  const memberResult = await sendEmail({
    to: memberEmail,
    subject,
    html: getEmailBaseTemplate(subject, content),
    text: `Confirmación de asistencia para ${memberName} (${memberRole}) al evento: ${eventTitle} el ${eventDate}.`
  });

  // Also send notification to Direccion Ejecutiva & Presidencia
  sendEmail({
    to: 'meridacamaragastronomica@gmail.com',
    replyTo: memberEmail,
    subject: `[Agenda Directiva] Asistencia confirmada: ${memberName} (${memberRole}) a ${eventTitle}`,
    html: getEmailBaseTemplate(`Asistencia Directiva: ${memberName}`, content),
    text: `${memberName} (${memberRole}) ha confirmado asistencia a: ${eventTitle} el ${eventDate}.`
  }).catch(() => {});

  return memberResult;
}

/**
 * Notificación de Inscripción a Capacitaciones & Cursos Oficiales (CGEM)
 */
export async function sendCourseRegistrationEmail({
  courseTitle,
  courseHours,
  courseDate,
  instructor,
  location,
  attendeeName,
  attendeeCi,
  attendeePhone,
  attendeeEmail,
  attendeeOccupation,
  isSolventMember,
  affiliateCode,
  isPaid,
  amountUsd,
  referenceNumber,
  bankName
}) {
  const subject = `Confirmación de Inscripción Académica: ${attendeeName} - ${courseTitle}`;

  const content = `
    <h2 style="color: #0f172a; margin-top: 0;">Confirmación Oficial de Inscripción Académica</h2>
    <p>Estimado(a) <strong>${attendeeName}</strong>,</p>
    <p>La <strong>Cámara Gastronómica del Estado Mérida</strong> y su <strong>Coordinación de Capacitación y Formación</strong> confirman formalmente su inscripción en el programa académico:</p>
    
    <div class="info-box">
      <p style="margin: 4px 0;"><strong>Curso / Taller:</strong> <span style="font-size: 15px; color: #b45309; font-weight: bold;">${courseTitle}</span></p>
      <p style="margin: 4px 0;"><strong>Duración Académica:</strong> ${courseHours || 'Certificado Oficial'}</p>
      <p style="margin: 4px 0;"><strong>Fecha & Horario:</strong> ${courseDate}</p>
      <p style="margin: 4px 0;"><strong>Instructor / Facilitador:</strong> ${instructor}</p>
      <p style="margin: 4px 0;"><strong>Locación / Sede:</strong> ${location}</p>
      <hr style="border: 0; border-top: 1px solid #e2e8f0; margin: 10px 0;" />
      <p style="margin: 4px 0;"><strong>Participante:</strong> ${attendeeName} (C.I. ${attendeeCi})</p>
      <p style="margin: 4px 0;"><strong>Ocupación / Cargo:</strong> ${attendeeOccupation || 'Profesional / Estudiante'}</p>
      <p style="margin: 4px 0;"><strong>Condición de Acceso:</strong> ${isSolventMember ? `<span style="color: #059669; font-weight: bold;">✓ Gratuito para Afiliado Solvente (${affiliateCode || 'CGEM'})</span>` : (isPaid ? `Pago Verificado (${amountUsd} USD - Ref: ${referenceNumber} ${bankName})` : 'Entrada Libre')}</p>
      <p style="margin: 4px 0;"><strong>Estatus:</strong> <span style="color: #059669; font-weight: bold;">✓ INSCRIPCIÓN CONFIRMADA</span></p>
    </div>

    <p style="font-size: 13px; color: #64748b; margin-top: 16px;">
      Presente este comprobante o su documento de identidad al inicio de la jornada para recibir su material de apoyo y acreditación de asistencia.
    </p>
  `;

  return sendEmail({
    to: attendeeEmail,
    replyTo: 'meridacamaragastronomica@gmail.com',
    subject,
    html: getEmailBaseTemplate(subject, content),
    text: `Inscripción confirmada para ${attendeeName} en ${courseTitle} (${courseDate}).`
  });
}

/**
 * Notificación de Recibo Oficial de Pago y Conciliación Gremial (Tesorería CGEM)
 */
export async function sendPaymentReceiptEmail({
  recipientEmail,
  receiptNumber,
  establishmentName,
  ownerName,
  affiliateCode,
  rif,
  concept,
  period,
  paymentMethod,
  bankName,
  referenceNumber,
  amountUsd,
  amountBs,
  paymentDate,
  reconciledBy,
  newExpiryDate
}) {
  const subject = `Recibo Oficial de Pago [${receiptNumber}] - ${establishmentName} | Cámara Gastronómica de Mérida`;

  const content = `
    <div style="text-align: center; margin-bottom: 20px;">
      <span style="display: inline-block; background-color: #ecfdf5; color: #047857; border: 1px solid #a7f3d0; padding: 4px 12px; border-radius: 9999px; font-size: 11px; font-weight: 800; text-transform: uppercase; letter-spacing: 0.5px;">
        ✓ Pago Conciliado & Aprobado
      </span>
      <h2 style="color: #0f172a; margin: 12px 0 4px 0; font-size: 20px;">Recibo Oficial de Tesorería</h2>
      <p style="margin: 0; font-family: monospace; font-size: 14px; font-weight: bold; color: #b45309;">
        ${receiptNumber}
      </p>
    </div>

    <p>Estimado(a) <strong>${ownerName || establishmentName}</strong>,</p>
    <p>La Dirección de Tesorería de la <strong>Cámara Gastronómica del Estado Mérida</strong> ha verificado y conciliado satisfactoriamente su pago en la cuenta oficial bancaria.</p>

    <div class="info-box" style="background-color: #f8fafc; border-left: 4px solid #0d9488; padding: 16px; border-radius: 8px; margin: 18px 0;">
      <h3 style="margin: 0 0 10px 0; font-size: 14px; color: #0f172a; text-transform: uppercase; letter-spacing: 0.5px;">Detalles de la Transacción</h3>
      
      <p style="margin: 4px 0;"><strong>Establecimiento:</strong> ${establishmentName}</p>
      <p style="margin: 4px 0;"><strong>Titular / Representante:</strong> ${ownerName || 'Representante Legal'}</p>
      <p style="margin: 4px 0;"><strong>Código Afiliado / RIF:</strong> <span style="font-family: monospace; font-weight: bold;">${affiliateCode || 'N/A'}</span> ${rif ? `• ${rif}` : ''}</p>
      <p style="margin: 4px 0;"><strong>Concepto Liquidado:</strong> <span style="color: #b45309; font-weight: bold;">${concept}</span></p>
      <p style="margin: 4px 0;"><strong>Período Correspondiente:</strong> ${period || 'Mes en curso'}</p>
      <p style="margin: 4px 0;"><strong>Método de Pago:</strong> ${paymentMethod === 'pago_movil' ? 'Pago Móvil Banco Provincial (0108)' : (paymentMethod === 'zelle' ? 'Zelle' : 'Transferencia Bancaria')}</p>
      <p style="margin: 4px 0;"><strong>N° Referencia Bancaria:</strong> <span style="font-family: monospace; font-weight: bold; color: #0f172a;">${referenceNumber}</span></p>
      <p style="margin: 4px 0;"><strong>Fecha de Pago:</strong> ${paymentDate ? new Date(paymentDate).toLocaleString('es-VE') : new Date().toLocaleDateString('es-VE')}</p>
      
      <div style="margin-top: 14px; padding: 12px; background-color: #134e4a; color: #ffffff; border-radius: 8px; display: flex; justify-content: space-between; align-items: center;">
        <span style="font-size: 11px; text-transform: uppercase; font-weight: bold; color: #99f6e4;">Monto Total Conciliado:</span>
        <span style="font-size: 18px; font-weight: 900; color: #fbbf24; margin-left: auto;">
          $${parseFloat(amountUsd || 0).toFixed(2)} USD ${amountBs ? `<span style="font-size: 12px; font-weight: normal; color: #e2e8f0;">(Bs. ${parseFloat(amountBs).toFixed(2)})</span>` : ''}
        </span>
      </div>
    </div>

    <div style="background-color: #ecfdf5; border: 1px solid #a7f3d0; border-radius: 8px; padding: 12px; margin: 16px 0; text-align: center;">
      <p style="margin: 0; font-size: 13px; color: #065f46; font-weight: bold;">
        ✓ Estatus Gremial: SOLVENTE (ACTIVO)
      </p>
      ${newExpiryDate ? `<p style="margin: 4px 0 0 0; font-size: 11px; color: #047857;">Próximo corte de cuota: ${new Date(newExpiryDate).toLocaleDateString('es-VE')}</p>` : ''}
    </div>

    <div style="margin-top: 24px; padding-top: 16px; border-top: 1px solid #e2e8f0; text-align: center;">
      <p style="margin: 0; font-size: 12px; font-weight: bold; color: #0f172a;">${reconciledBy || 'Edixon Xavier Reyes Dávila'}</p>
      <p style="margin: 2px 0 0 0; font-size: 11px; color: #64748b;">Tesorero de la Junta Directiva</p>
      <p style="margin: 2px 0 0 0; font-size: 10px; color: #0d9488; font-weight: bold; text-transform: uppercase;">Cámara Gastronómica del Estado Mérida (CGEM)</p>
    </div>
  `;

  if (!recipientEmail || !recipientEmail.includes('@')) {
    console.warn('sendPaymentReceiptEmail: No valid recipientEmail provided:', recipientEmail);
    return { success: false, error: 'No recipient email' };
  }

  return sendEmail({
    to: recipientEmail,
    replyTo: 'tesoreria@meridagastronomica.com',
    subject,
    html: getEmailBaseTemplate(subject, content),
    text: `Recibo Oficial de Pago ${receiptNumber} para ${establishmentName}. Monto: $${amountUsd} USD (Ref: ${referenceNumber}). Conciliado por ${reconciledBy}.`
  });
}

/**
 * Plantilla Membretada Oficial para Comunicaciones Institucionales
 * Emisión exclusiva para Presidente y Director Ejecutivo (CGEM)
 */
export const getOfficialCommunicationTemplate = ({
  subject = 'Comunicado Oficial',
  category = 'COMUNICADO OFICIAL',
  officialNumber = 'CGEM-COM-2026-001',
  dateFormatted = '',
  targetAudienceName = 'Miembros y Agremiados',
  senderRole = 'Presidencia y Dirección Ejecutiva',
  senderName = 'Julio Alberto Daza Celis & Mary Giovanna Vera',
  signaturesMode = 'both',
  bodyHtml = '',
}) => {
  const todayStr = dateFormatted || new Date().toLocaleDateString('es-VE', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  const signaturesHtml = signaturesMode === 'both' ? `
    <table style="width: 100%; border-collapse: collapse; margin-top: 30px;">
      <tr>
        <td style="width: 50%; text-align: center; vertical-align: top; padding: 0 16px;">
          <div style="border-top: 2px solid #cbd5e1; width: 85%; margin: 0 auto 12px auto;"></div>
          <p style="margin: 0; font-size: 13px; font-weight: 800; color: #0f172a; text-transform: uppercase;">Julio Alberto Daza Celis</p>
          <p style="margin: 2px 0 0 0; font-size: 11px; font-weight: 700; color: #b45309;">Presidente</p>
          <p style="margin: 2px 0 0 0; font-size: 10px; color: #64748b;">Junta Directiva CGEM</p>
        </td>
        <td style="width: 50%; text-align: center; vertical-align: top; padding: 0 16px;">
          <div style="border-top: 2px solid #cbd5e1; width: 85%; margin: 0 auto 12px auto;"></div>
          <p style="margin: 0; font-size: 13px; font-weight: 800; color: #0f172a; text-transform: uppercase;">Mary Giovanna Vera</p>
          <p style="margin: 2px 0 0 0; font-size: 11px; font-weight: 700; color: #b45309;">Directora Ejecutiva</p>
          <p style="margin: 2px 0 0 0; font-size: 10px; color: #64748b;">Dirección General CGEM</p>
        </td>
      </tr>
    </table>
  ` : signaturesMode === 'presidente' ? `
    <div style="text-align: center; margin-top: 30px;">
      <div style="border-top: 2px solid #cbd5e1; width: 220px; margin: 0 auto 12px auto;"></div>
      <p style="margin: 0; font-size: 13px; font-weight: 800; color: #0f172a; text-transform: uppercase;">Julio Alberto Daza Celis</p>
      <p style="margin: 2px 0 0 0; font-size: 11px; font-weight: 700; color: #b45309;">Presidente</p>
      <p style="margin: 2px 0 0 0; font-size: 10px; color: #64748b;">Cámara Gastronómica del Estado Mérida (CGEM)</p>
    </div>
  ` : signaturesMode === 'ejecutivo' ? `
    <div style="text-align: center; margin-top: 30px;">
      <div style="border-top: 2px solid #cbd5e1; width: 220px; margin: 0 auto 12px auto;"></div>
      <p style="margin: 0; font-size: 13px; font-weight: 800; color: #0f172a; text-transform: uppercase;">Mary Giovanna Vera</p>
      <p style="margin: 2px 0 0 0; font-size: 11px; font-weight: 700; color: #b45309;">Directora Ejecutiva</p>
      <p style="margin: 2px 0 0 0; font-size: 10px; color: #64748b;">Cámara Gastronómica del Estado Mérida (CGEM)</p>
    </div>
  ` : `
    <div style="text-align: center; margin-top: 30px;">
      <div style="border-top: 2px solid #cbd5e1; width: 260px; margin: 0 auto 12px auto;"></div>
      <p style="margin: 0; font-size: 13px; font-weight: 800; color: #0f172a; text-transform: uppercase;">Junta Directiva Oficial</p>
      <p style="margin: 2px 0 0 0; font-size: 11px; font-weight: 700; color: #b45309;">Cámara Gastronómica del Estado Mérida</p>
      <p style="margin: 2px 0 0 0; font-size: 10px; color: #64748b;">Período 2026 - 2027</p>
    </div>
  `;

  return `
<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${subject}</title>
  <style>
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: #f1f5f9; margin: 0; padding: 24px; color: #1e293b; }
    .container { max-width: 680px; margin: 0 auto; background: #ffffff; border-radius: 12px; overflow: hidden; border: 1px solid #e2e8f0; box-shadow: 0 8px 24px -4px rgba(0,0,0,0.08); }
    .top-accent { background: #451a03; height: 5px; }
    .header { background: linear-gradient(135deg, #7c2d12 0%, #9a3412 45%, #b45309 100%); padding: 32px 26px; text-align: center; color: #ffffff; }
    .header-badge { display: inline-block; background-color: rgba(255,255,255,0.18); border: 1px solid rgba(253,230,138,0.45); color: #fef3c7; font-size: 11px; font-weight: 800; letter-spacing: 1.2px; text-transform: uppercase; padding: 4px 14px; border-radius: 9999px; margin-bottom: 12px; }
    .header h1 { margin: 0; font-size: 23px; font-weight: 800; letter-spacing: -0.3px; color: #ffffff; text-transform: uppercase; }
    .header p { margin: 6px 0 0 0; font-size: 12.5px; color: #fde68a; font-weight: 500; }
    .letterhead-bar { background-color: #fdf8f6; border-bottom: 2px solid #fed7aa; padding: 14px 24px; }
    .meta-table { width: 100%; border-collapse: collapse; font-size: 11.5px; }
    .meta-table td { padding: 3px 0; color: #475569; }
    .meta-table strong { color: #0f172a; }
    .body-content { padding: 32px 28px; font-size: 14.5px; line-height: 1.7; color: #334155; }
    .body-content h2, .body-content h3 { color: #0f172a; margin-top: 20px; margin-bottom: 10px; font-weight: 700; }
    .body-content h2 { font-size: 19px; border-bottom: 2px solid #fed7aa; padding-bottom: 6px; }
    .body-content h3 { font-size: 16px; }
    .body-content p { margin: 12px 0; }
    .body-content ul, .body-content ol { padding-left: 24px; margin: 14px 0; }
    .body-content li { margin-bottom: 6px; }
    .info-box { background: #fdf8f6; border-left: 4px solid #b45309; padding: 14px 18px; border-radius: 6px; margin: 18px 0; color: #78350f; font-size: 13.5px; }
    .signatures-section { margin-top: 36px; padding-top: 24px; border-top: 1px solid #e2e8f0; }
    .seal-row { text-align: center; margin-top: 20px; }
    .seal-chip { display: inline-block; background-color: #ecfdf5; border: 1px solid #a7f3d0; color: #047857; font-size: 10.5px; font-weight: 800; text-transform: uppercase; letter-spacing: 0.5px; padding: 4px 14px; border-radius: 9999px; }
    .footer { background-color: #0f172a; padding: 24px; text-align: center; font-size: 11.5px; color: #94a3b8; border-top: 1px solid #1e293b; line-height: 1.6; }
    .footer a { color: #fbbf24; text-decoration: none; font-weight: 600; }
  </style>
</head>
<body>
  <div class="container">
    <div class="top-accent"></div>
    <div class="header">
      <div class="header-badge">${category}</div>
      <h1>Mérida Gastronómica</h1>
      <p>Cámara Gastronómica del Estado Mérida &bull; Plataforma y Despacho Oficial</p>
    </div>

    <div class="letterhead-bar">
      <table class="meta-table">
        <tr>
          <td style="width: 60%;"><strong>Ref. Oficial:</strong> <span style="font-family: monospace; font-weight: 700; color: #b45309;">${officialNumber}</span></td>
          <td style="width: 40%; text-align: right;"><strong>Fecha:</strong> ${todayStr}</td>
        </tr>
        <tr>
          <td><strong>Destinatarios:</strong> ${targetAudienceName}</td>
          <td style="text-align: right;"><strong>Emite:</strong> ${senderRole}</td>
        </tr>
      </table>
    </div>

    <div class="body-content">
      ${bodyHtml}

      <div class="signatures-section">
        ${signaturesHtml}
        
        <div class="seal-row">
          <span class="seal-chip">✓ Documento Institucional Avalado por la CGEM</span>
        </div>
      </div>
    </div>

    <div class="footer">
      <p style="margin: 0 0 6px 0; font-weight: 700; color: #ffffff; font-size: 12px; text-transform: uppercase; letter-spacing: 0.5px;">
        Cámara Gastronómica del Estado Mérida (CGEM)
      </p>
      <p style="margin: 0 0 6px 0;">
        Av. 4 con Calles 19 y 20, Centro Empresarial &bull; Mérida, Estado Mérida, Venezuela
      </p>
      <p style="margin: 0 0 10px 0;">
        Canal Oficial: <a href="mailto:meridacamaragastronomica@gmail.com">meridacamaragastronomica@gmail.com</a> &bull; Portal Web: <a href="https://www.meridagastronomica.com" target="_blank">meridagastronomica.com</a>
      </p>
      <p style="margin: 0; font-size: 10px; color: #64748b;">
        Este es un comunicado oficial emitido conforme a los estatutos de la Cámara Gastronómica. Conserva este correo como comprobante formal gremial.
      </p>
    </div>
  </div>
</body>
</html>
  `;
};

/**
 * Envío de Comunicado Oficial Institucional a múltiples destinatarios
 */
export async function sendOfficialCommunication({
  to,
  replyTo = 'meridacamaragastronomica@gmail.com',
  subject,
  category = 'COMUNICADO OFICIAL',
  officialNumber = 'CGEM-COM-2026-001',
  targetAudienceName = 'Miembros y Agremiados',
  senderRole = 'Presidencia y Dirección Ejecutiva',
  senderName = 'Julio Alberto Daza Celis & Mary Giovanna Vera',
  signaturesMode = 'both',
  bodyHtml,
  plainText
}) {
  const fullHtml = getOfficialCommunicationTemplate({
    subject,
    category,
    officialNumber,
    targetAudienceName,
    senderRole,
    senderName,
    signaturesMode,
    bodyHtml
  });

  const fullSubject = `[CGEM ${category}] ${subject}`;

  return sendEmail({
    to,
    replyTo,
    subject: fullSubject,
    html: fullHtml,
    text: plainText || subject
  });
}





