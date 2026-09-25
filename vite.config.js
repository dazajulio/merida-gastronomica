import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'
import { Resend } from 'resend'

function resendDevPlugin(resendApiKey) {
  return {
    name: 'resend-dev-middleware',
    configureServer(server) {
      server.middlewares.use('/api/send-email', async (req, res) => {
        res.setHeader('Access-Control-Allow-Origin', '*');
        res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
        res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

        if (req.method === 'OPTIONS') {
          res.writeHead(200);
          res.end();
          return;
        }

        if (req.method !== 'POST') {
          res.writeHead(405, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({ error: 'Method Not Allowed. Use POST.' }));
          return;
        }

        let body = '';
        req.on('data', chunk => {
          body += chunk;
        });

        req.on('end', async () => {
          try {
            const data = JSON.parse(body || '{}');
            const key = resendApiKey || process.env.RESEND_API_KEY || process.env.resend_api_key;
            
            if (!key) {
              res.writeHead(500, { 'Content-Type': 'application/json' });
              res.end(JSON.stringify({ error: 'RESEND_API_KEY no encontrada en el entorno.' }));
              return;
            }

            const resend = new Resend(key);
            const { to, subject, html, text, from, replyTo } = data;
            const defaultFrom = process.env.RESEND_FROM_EMAIL || 'Mérida Gastronómica <notificaciones@meridagastronomica.com>';

            const result = await resend.emails.send({
              from: from || defaultFrom,
              to: Array.isArray(to) ? to : [to],
              subject,
              ...(html ? { html } : {}),
              ...(text ? { text } : {}),
              ...(replyTo ? { reply_to: replyTo } : {})
            });

            if (result.error) {
              res.writeHead(400, { 'Content-Type': 'application/json' });
              res.end(JSON.stringify({ error: result.error }));
              return;
            }

            res.writeHead(200, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ success: true, data: result.data }));
          } catch (err) {
            res.writeHead(500, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ error: err.message || 'Error al procesar envío de correo.' }));
          }
        });
      });
    }
  }
}

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')
  const mapboxToken = env.MAPBOX || env.VITE_MAPBOX_TOKEN || env.VITE_MAPBOX || process.env.MAPBOX || ''
  const resendKey = env.RESEND_API_KEY || env.resend_api_key || process.env.RESEND_API_KEY || process.env.resend_api_key || ''

  return {
    plugins: [
      react(),
      resendDevPlugin(resendKey)
    ],
    define: {
      'import.meta.env.MAPBOX': JSON.stringify(mapboxToken),
      'import.meta.env.VITE_MAPBOX_TOKEN': JSON.stringify(mapboxToken)
    },
    server: {
      port: 3000,
      open: false
    }
  }
})
