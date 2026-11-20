// Saca las capturas de una demo para la sección Proyectos: public/proyectos/<demo>-full.webp (800x1750) y <demo>-cel.webp (390x844).
// Uso: con el sitio corriendo (npx astro preview --port 4322), node scripts/capturar-demo.mjs barberia [otra-demo ...]
// Usa Edge sin ventana y el protocolo de DevTools, así no hace falta instalar Puppeteer.
import { spawn } from 'node:child_process';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import sharp from 'sharp';

const EDGE = 'C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe';
const BASE = process.env.BASE || 'http://localhost:4322';
const SALIDA = path.resolve(import.meta.dirname, '../public/proyectos');
const demos = process.argv.slice(2);
if (!demos.length) { console.error('Uso: node scripts/capturar-demo.mjs <demo> [...]'); process.exit(1); }

const perfil = fs.mkdtempSync(path.join(os.tmpdir(), 'capturas-'));
const edge = spawn(EDGE, ['--headless=new', '--remote-debugging-port=9333', '--hide-scrollbars', `--user-data-dir=${perfil}`, 'about:blank']);
const espera = (ms) => new Promise((r) => setTimeout(r, ms));

let ws;
for (let i = 0; i < 40 && !ws; i++) {
  try { const t = await (await fetch('http://127.0.0.1:9333/json')).json(); ws = t.find((x) => x.type === 'page').webSocketDebuggerUrl; } catch { await espera(250); }
}
const sock = new WebSocket(ws);
await new Promise((r) => sock.addEventListener('open', r));
let id = 0; const pend = new Map();
sock.addEventListener('message', (e) => { const m = JSON.parse(e.data); if (pend.has(m.id)) { pend.get(m.id)(m); pend.delete(m.id); } });
const cdp = (method, params = {}) => new Promise((r) => { pend.set(++id, r); sock.send(JSON.stringify({ id, method, params })); });

// Revela las animaciones de aparición y oculta la franja de demo, como se ve dentro de la vista previa
const preparar = `document.documentElement.classList.add('embed');document.querySelectorAll('.rv').forEach(e=>e.classList.add('in'));document.querySelectorAll('img[loading=lazy]').forEach(i=>i.loading='eager');`
  // En una captura más alta que la pantalla, lo "sticky" queda flotando en cualquier lado: se deja en su lugar
  + `document.querySelectorAll('body *').forEach(e=>{if(getComputedStyle(e).position==='sticky')e.style.position='static'});`;

async function captura(url, ancho, alto, movil, escala, salida, tam) {
  await cdp('Emulation.setDeviceMetricsOverride', { width: ancho, height: alto, deviceScaleFactor: escala, mobile: movil });
  await cdp('Page.navigate', { url });
  await espera(4500); // fuentes y fotos de Unsplash
  await cdp('Runtime.evaluate', { expression: preparar });
  await espera(3000);
  const { result } = await cdp('Page.captureScreenshot', { format: 'png', captureBeyondViewport: true, clip: { x: 0, y: 0, width: ancho, height: tam.h * ancho / tam.w, scale: 1 } });
  await sharp(Buffer.from(result.data, 'base64')).resize(tam.w, tam.h, { fit: 'cover', position: 'top' }).webp({ quality: 78 }).toFile(salida);
  console.log('ok', path.basename(salida));
}

await cdp('Page.enable');
for (const d of demos) {
  const url = `${BASE}/demos/${d}/index.html`;
  await captura(url, 1280, 800, false, 1, `${SALIDA}/${d}-full.webp`, { w: 800, h: 1750 });
  await captura(url, 390, 844, true, 2, `${SALIDA}/${d}-cel.webp`, { w: 390, h: 844 });
}
sock.close(); edge.kill();
