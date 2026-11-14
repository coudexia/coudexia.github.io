import { readFileSync, writeFileSync, existsSync } from 'node:fs';

// shortcut: agenda en un JSON local con turnos fijos de 30 min; pasar al Google Calendar del centro cuando haya un cliente real.
const ARCHIVO = process.env.TURNOS_FILE || new URL('./turnos.json', import.meta.url);
const ABRE = 9 * 60, CIERRA = 21 * 60, DURACION = 30;
const DIAS_ABIERTO = [1, 2, 3, 4, 5, 6]; // lunes a sábado

const leer = () => (existsSync(ARCHIVO) ? JSON.parse(readFileSync(ARCHIVO, 'utf8')) : []);
const dos = (n) => String(n).padStart(2, '0');

// Fecha y hora actuales en Argentina, como 'YYYY-MM-DD' y 'HH:MM'
export function ahoraAR() {
  const p = Object.fromEntries(new Intl.DateTimeFormat('en-CA', {
    timeZone: 'America/Argentina/Buenos_Aires', year: 'numeric', month: '2-digit', day: '2-digit',
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

export function horariosLibres(fecha, ahora = ahoraAR()) {
  if (!DIAS_ABIERTO.includes(validarFecha(fecha, ahora))) return [];
  const ocupados = new Set(leer().filter((t) => t.fecha === fecha).map((t) => t.hora));
  const libres = [];
  for (let m = ABRE; m + DURACION <= CIERRA; m += DURACION) {
    const hora = `${dos(Math.floor(m / 60))}:${dos(m % 60)}`;
    if (!ocupados.has(hora) && !(fecha === ahora.fecha && hora <= ahora.hora)) libres.push(hora);
  }
  return libres;
}

export function reservar({ fecha, hora, nombre, motivo, contacto }, ahora = ahoraAR()) {
  if (!horariosLibres(fecha, ahora).includes(hora)) throw new Error(`El ${fecha} a las ${hora} no está disponible. Consultá los horarios libres de nuevo.`);
  const turno = { fecha, hora, nombre, motivo, contacto, creado: new Date().toISOString() };
  writeFileSync(ARCHIVO, JSON.stringify([...leer(), turno], null, 2));
  return turno;
}
