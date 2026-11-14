import { createServer } from 'node:http';
import { readFileSync } from 'node:fs';
import { createHmac, timingSafeEqual } from 'node:crypto';
import { responder, AVISO_HUMANO } from './bot.mjs';

const { PORT = 3000, CHAT_WEB = '1', WA_TOKEN, WA_PHONE_ID, WA_VERIFY_TOKEN, WA_APP_SECRET } = process.env;
const GRAPH = 'https://graph.facebook.com/v23.0';
const html = readFileSync(new URL('./chat.html', import.meta.url));
const vistos = new Set(); // Meta a veces reenvía el mismo mensaje

const leerCuerpo = (req) => new Promise((ok, mal) => {
  const partes = []; let largo = 0;
  req.on('data', (c) => { largo += c.length; if (largo > 1e6) { req.destroy(); mal(new Error('cuerpo muy grande')); } else partes.push(c); });
  req.on('end', () => ok(Buffer.concat(partes)));
  req.on('error', mal);
});

const json = (res, codigo, datos) => { res.writeHead(codigo, { 'content-type': 'application/json' }); res.end(JSON.stringify(datos)); };

async function contestar(id, texto) {
  try { return await responder(id, texto); }
  catch (e) { console.error('[error IA]', id, e.message); return 'Perdón, tuve un problema para responderte. ' + AVISO_HUMANO; }
}

function firmaValida(cuerpo, firma = '') {
  const esperada = Buffer.from('sha256=' + createHmac('sha256', WA_APP_SECRET).update(cuerpo).digest('hex'));
  const recibida = Buffer.from(firma);
  return recibida.length === esperada.length && timingSafeEqual(recibida, esperada);
}

async function enviarWhatsApp(para, texto) {
  const r = await fetch(`${GRAPH}/${WA_PHONE_ID}/messages`, {
    method: 'POST',
    headers: { authorization: `Bearer ${WA_TOKEN}`, 'content-type': 'application/json' },
    body: JSON.stringify({ messaging_product: 'whatsapp', to: para, type: 'text', text: { body: texto } }),
  });
  if (!r.ok) console.error('[error WhatsApp]', r.status, await r.text());
}

async function procesarWebhook(datos) {
  for (const entrada of datos.entry ?? []) for (const cambio of entrada.changes ?? []) for (const m of cambio.value?.messages ?? []) {
    if (vistos.has(m.id)) continue;
    vistos.add(m.id);
    const respuesta = m.type === 'text'
      ? await contestar(`wa:${m.from}`, m.text.body.slice(0, 2000))
      : 'Por ahora leo solo mensajes de texto 🙂 ¿Me lo escribís?';
    if (respuesta) await enviarWhatsApp(m.from, respuesta);
  }
}

createServer(async (req, res) => {
  try {
    const url = new URL(req.url, 'http://x');

    if (url.pathname === '/webhook' && req.method === 'GET') {
      const ok = url.searchParams.get('hub.mode') === 'subscribe' && WA_VERIFY_TOKEN && url.searchParams.get('hub.verify_token') === WA_VERIFY_TOKEN;
      res.writeHead(ok ? 200 : 403); return res.end(ok ? url.searchParams.get('hub.challenge') : '');
    }
    if (url.pathname === '/webhook' && req.method === 'POST') {
      const cuerpo = await leerCuerpo(req);
      if (!WA_APP_SECRET || !firmaValida(cuerpo, req.headers['x-hub-signature-256'])) { res.writeHead(403); return res.end(); }
      res.writeHead(200); res.end(); // Meta pide responder rápido; el mensaje se procesa después
      return procesarWebhook(JSON.parse(cuerpo)).catch((e) => console.error('[error webhook]', e));
    }

    // Chat de prueba en el navegador. Cada mensaje gasta créditos de la API: apagalo (CHAT_WEB=0) si el servidor queda público.
    if (CHAT_WEB === '1' && url.pathname === '/' && req.method === 'GET') { res.writeHead(200, { 'content-type': 'text/html; charset=utf-8' }); return res.end(html); }
    if (CHAT_WEB === '1' && url.pathname === '/chat' && req.method === 'POST') {
      const { id, texto } = JSON.parse(await leerCuerpo(req));
      if (typeof id !== 'string' || typeof texto !== 'string' || !texto.trim() || texto.length > 2000) return json(res, 400, { error: 'mensaje inválido' });
      return json(res, 200, { respuesta: await contestar(`web:${id.slice(0, 64)}`, texto) });
    }

    res.writeHead(404); res.end();
  } catch (e) {
    console.error('[error]', e.message);
    if (!res.headersSent) json(res, 400, { error: 'pedido inválido' });
  }
}).listen(PORT, () => console.log(`Bot escuchando en http://localhost:${PORT}`));
