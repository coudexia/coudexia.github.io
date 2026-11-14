import { readFileSync, writeFileSync, existsSync } from 'node:fs';
import { createSign } from 'node:crypto';

// Con GOOGLE_CREDENTIALS y GOOGLE_CALENDAR_ID los turnos van al Google Calendar del negocio.
// Sin eso se guardan en turnos.json (para probar en la compu).
const { GOOGLE_CREDENTIALS, GOOGLE_CALENDAR_ID } = process.env;
const usaGoogle = Boolean(GOOGLE_CREDENTIALS && GOOGLE_CALENDAR_ID);
const ARCHIVO = process.env.TURNOS_FILE || new URL('./turnos.json', import.meta.url);
const ZONA = 'America/Argentina/Buenos_Aires';
const OFFSET = '-03:00'; // shortcut: Argentina no tiene horario de verano; para un cliente de otro país, calcular el offset con Intl.
const ABRE = 9 * 60, CIERRA = 21 * 60, DURACION = 30;
const DIAS_ABIERTO = [1, 2, 3, 4, 5, 6]; // lunes a sábado

const dos = (n) => String(n).padStart(2, '0');
const aHora = (m) => `${dos(Math.floor(m / 60))}:${dos(m % 60)}`;
const aMin = (h) => { const [a, b] = h.split(':').map(Number); return a * 60 + b; };
const iso = (fecha, hora) => `${fecha}T${hora}:00${OFFSET}`;
const leer = () => (existsSync(ARCHIVO) ? JSON.parse(readFileSync(ARCHIVO, 'utf8')) : []);

// Fecha y hora actuales en Argentina, como 'YYYY-MM-DD' y 'HH:MM'
export function ahoraAR() {
  const p = Object.fromEntries(new Intl.DateTimeFormat('en-CA', {
    timeZone: ZONA, year: 'numeric', month: '2-digit', day: '2-digit',
    hour: '2-digit', minute: '2-digit', hourCycle: 'h23',
  }).formatToParts(new Date()).map((x) => [x.type, x.value]));
  return { fecha: `${p.year}-${p.month}-${p.day}`, hora: `${p.hour}:${p.minute}` };
}

function validarFecha(fecha, ahora) {
  const d = new Date(`${fecha}T12:00:00Z`);
  if (!/^\d{4}-\d{2}-\d{2}$/.test(fecha) || isNaN(d) || d.toISOString().slice(0, 10) !== fecha) throw new Error(`Fecha inválida: ${fecha}. Usá el formato YYYY-MM-DD.`);
  if (fecha < ahora.fecha) throw new Error(`La fecha ${fecha} ya pasó.`);
  return d.getUTCDay();
}

// ---- Google Calendar (cuenta de servicio, sin dependencias) ----
let token = null, vence = 0;
async function tokenGoogle() {
  if (token && Date.now() < vence) return token;
  const cred = JSON.parse(readFileSync(GOOGLE_CREDENTIALS, 'utf8'));
  const b64 = (o) => Buffer.from(JSON.stringify(o)).toString('base64url');
  const iat = Math.floor(Date.now() / 1000);
  const datos = `${b64({ alg: 'RS256', typ: 'JWT' })}.${b64({ iss: cred.client_email, scope: 'https://www.googleapis.com/auth/calendar', aud: cred.token_uri, iat, exp: iat + 3600 })}`;
  const firma = createSign('RSA-SHA256').update(datos).sign(cred.private_key, 'base64url');
  const r = await fetch(cred.token_uri, {
    method: 'POST',
    headers: { 'content-type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({ grant_type: 'urn:ietf:params:oauth:grant-type:jwt-bearer', assertion: `${datos}.${firma}` }),
  });
  const j = await r.json();
  if (!r.ok) throw new Error(`Google no aceptó la cuenta de servicio: ${j.error_description || j.error}`);
  token = j.access_token;
  vence = Date.now() + (j.expires_in - 60) * 1000;
  return token;
}

async function google(ruta, cuerpo) {
  const r = await fetch(`https://www.googleapis.com/calendar/v3${ruta}`, {
    method: 'POST',
    headers: { authorization: `Bearer ${await tokenGoogle()}`, 'content-type': 'application/json' },
    body: JSON.stringify(cuerpo),
  });
  const j = await r.json();
  if (!r.ok) throw new Error(`Error de Google Calendar (${r.status}): ${j.error?.message ?? 'sin detalle'}`);
  return j;
}

// Intervalos ocupados del día, en minutos desde las 00:00: [[inicio, fin], ...]
async function ocupados(fecha) {
  if (!usaGoogle) return leer().filter((t) => t.fecha === fecha).map((t) => [aMin(t.hora), aMin(t.hora) + DURACION]);
  const fb = await google('/freeBusy', { timeMin: iso(fecha, '00:00'), timeMax: iso(fecha, '23:59'), timeZone: ZONA, items: [{ id: GOOGLE_CALENDAR_ID }] });
  const cal = fb.calendars?.[GOOGLE_CALENDAR_ID];
  if (!cal || cal.errors?.length) throw new Error(`No puedo leer el calendario (${cal?.errors?.[0]?.reason ?? 'sin respuesta'}). ¿Lo compartieron con la cuenta de servicio?`);
  const base = Date.parse(iso(fecha, '00:00'));
  return cal.busy.map((b) => [(Date.parse(b.start) - base) / 60000, (Date.parse(b.end) - base) / 60000]);
}

export async function horariosLibres(fecha, ahora = ahoraAR()) {
  if (!DIAS_ABIERTO.includes(validarFecha(fecha, ahora))) return [];
  const ocup = await ocupados(fecha);
  const libres = [];
  for (let m = ABRE; m + DURACION <= CIERRA; m += DURACION) {
    const hora = aHora(m);
    if (ocup.some(([a, b]) => m < b && m + DURACION > a)) continue;
    if (fecha === ahora.fecha && hora <= ahora.hora) continue;
    libres.push(hora);
  }
  return libres;
}

export async function reservar({ fecha, hora, nombre, motivo, contacto }, ahora = ahoraAR()) {
  // Se vuelve a consultar justo antes de reservar, por si alguien tomó el horario mientras tanto
  if (!(await horariosLibres(fecha, ahora)).includes(hora)) throw new Error(`El ${fecha} a las ${hora} no está disponible. Consultá los horarios libres de nuevo.`);
  const turno = { fecha, hora, nombre, motivo, contacto, creado: new Date().toISOString() };
  if (usaGoogle) {
    const tel = contacto.startsWith('wa:') ? `+${contacto.slice(3)}` : contacto;
    await google(`/calendars/${encodeURIComponent(GOOGLE_CALENDAR_ID)}/events`, {
      summary: `${motivo} – ${nombre}`,
      description: `Turno reservado por la recepcionista IA.\nContacto: ${tel}`,
      start: { dateTime: iso(fecha, hora), timeZone: ZONA },
      end: { dateTime: iso(fecha, aHora(aMin(hora) + DURACION)), timeZone: ZONA },
    });
  } else {
    writeFileSync(ARCHIVO, JSON.stringify([...leer(), turno], null, 2));
  }
  return turno;
}
