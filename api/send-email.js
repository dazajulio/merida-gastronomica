import { Resend } from 'resend';

export default async function handler(req, res) {
  // CORS Headers
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
  );

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed. Expected POST request.' });
  }

  const apiKey = process.env.RESEND_API_KEY || process.env.resend_api_key;

  if (!apiKey) {
    console.error('Missing RESEND_API_KEY environment variable');
    return res.status(500).json({ 
      error: 'RESEND_API_KEY no configurada en las variables de entorno.' 
    });
  }

  try {
    const resend = new Resend(apiKey);
    const { to, subject, html, text, from, replyTo, cc, bcc } = req.body || {};

    if (!to || !subject || (!html && !text)) {
      return res.status(400).json({
        error: 'Campos requeridos faltantes: "to", "subject" y ("html" o "text").'
      });
    }

    const defaultFrom = process.env.RESEND_FROM_EMAIL || 'Mérida Gastronómica <notificaciones@meridagastronomica.com>';

    const emailPayload = {
      from: from || defaultFrom,
      to: Array.isArray(to) ? to : [to],
      subject,
      ...(html ? { html } : {}),
      ...(text ? { text } : {}),
      ...(replyTo ? { reply_to: replyTo } : {}),
      ...(cc ? { cc: Array.isArray(cc) ? cc : [cc] } : {}),
      ...(bcc ? { bcc: Array.isArray(bcc) ? bcc : [bcc] } : {})
    };

    const response = await resend.emails.send(emailPayload);

    if (response.error) {
      console.error('Resend API error:', response.error);
      return res.status(400).json({ error: response.error });
    }

    return res.status(200).json({ 
      success: true, 
      id: response.data?.id,
      message: 'Correo enviado exitosamente con Resend' 
    });
  } catch (error) {
    console.error('Error processing email request:', error);
    return res.status(500).json({ 
      error: error.message || 'Error interno al enviar el correo.' 
    });
  }
}
