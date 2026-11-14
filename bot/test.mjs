// Prueba de la agenda y de la carga de negocios (no llama a la IA ni a Google de verdad): node test.mjs
import assert from 'node:assert/strict';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { mkdtempSync, rmSync, writeFileSync, readFileSync } from 'node:fs';
import { generateKeyPairSync, createVerify } from 'node:crypto';

delete process.env.GOOGLE_CREDENTIALS;
process.env.TURNOS_DIR = mkdtempSync(join(tmpdir(), 'turnos-test-'));
const { horariosLibres, reservar } = await import('./agenda.mjs');

const antes = { fecha: '2030-01-01', hora: '08:00' };
const lunes = '2030-01-07', martes = '2030-01-08';
const centro = { slug: 'centro', calendario: '', dias: [1, 2, 3, 4, 5, 6], abre: '09:00', cierra: '21:00', duracion: 30 };
const barberia = { slug: 'barberia', calendario: '', dias: [2, 3, 4, 5, 6], abre: '10:00', cierra: '20:00', duracion: 45 };

// ---- Horario propio de cada negocio ----
assert.deepEqual(await horariosLibres(centro, '2030-01-06', antes), [], 'domingo cerrado');
const libres = await horariosLibres(centro, lunes, antes);
assert.equal(libres.length, 24);
assert.equal(libres[0], '09:00');
assert.equal(libres.at(-1), '20:30');
assert.deepEqual(await horariosLibres(barberia, lunes, antes), [], 'la barbería no abre los lunes');
const libresB = await horariosLibres(barberia, martes, antes);
assert.equal(libresB[0], '10:00');
assert.equal(libresB[1], '10:45', 'turnos de 45 min');
assert.equal(libresB.at(-1), '19:00');

// ---- Reservas: cada negocio en su agenda ----
await reservar(centro, { fecha: martes, hora: '10:00', nombre: 'Ana', motivo: 'Evaluación', contacto: 'test' }, antes);
assert.ok(!(await horariosLibres(centro, martes, antes)).includes('10:00'), 'turno tomado no aparece');
assert.ok((await horariosLibres(barberia, martes, antes)).includes('10:00'), 'el turno de un negocio no ocupa la agenda de otro');
await assert.rejects(reservar(centro, { fecha: martes, hora: '10:00', nombre: 'Bea', motivo: 'x', contacto: 'test' }, antes), /no está disponible/);
await assert.rejects(reservar(centro, { fecha: martes, hora: '10:15', nombre: 'Bea', motivo: 'x', contacto: 'test' }, antes), /no está disponible/);
await reservar(barberia, { fecha: martes, hora: '10:45', nombre: 'Juan', motivo: 'Corte', contacto: 'test' }, antes);
assert.equal(JSON.parse(readFileSync(join(process.env.TURNOS_DIR, 'turnos-barberia.json'), 'utf8')).length, 1);
assert.equal((await horariosLibres(centro, lunes, { fecha: lunes, hora: '10:10' }))[0], '10:30', 'hoy no ofrece horas pasadas');
await assert.rejects(horariosLibres(centro, '2029-12-31', antes), /ya pasó/);
await assert.rejects(horariosLibres(centro, '2030-02-30', antes), /inválida/);
rmSync(process.env.TURNOS_DIR, { recursive: true });

// ---- Google Calendar, con un Google simulado ----
const { publicKey, privateKey } = generateKeyPairSync('rsa', { modulusLength: 2048 });
const cred = join(tmpdir(), `cred-test-${process.pid}.json`);
writeFileSync(cred, JSON.stringify({ client_email: 'bot@test.iam.gserviceaccount.com', private_key: privateKey.export({ type: 'pkcs8', format: 'pem' }), token_uri: 'https://oauth2.googleapis.com/token' }));
process.env.GOOGLE_CREDENTIALS = cred;
const conCalendario = { ...centro, calendario: 'centro@gmail.com' };

const llamadas = [];
let compartido = true;
globalThis.fetch = async (url, op) => {
  const json = (datos, status = 200) => ({ ok: status < 400, status, json: async () => datos });
  if (url === 'https://oauth2.googleapis.com/token') {
    const jwt = new URLSearchParams(op.body.toString()).get('assertion').split('.');
    assert.ok(createVerify('RSA-SHA256').update(`${jwt[0]}.${jwt[1]}`).verify(publicKey, jwt[2], 'base64url'), 'JWT firmado con la clave');
    return json({ access_token: 'tok', expires_in: 3600 });
  }
  assert.equal(op.headers.authorization, 'Bearer tok');
  const cuerpo = JSON.parse(op.body);
  llamadas.push([url, cuerpo]);
  if (url.endsWith('/freeBusy')) {
    assert.deepEqual(cuerpo.items, [{ id: 'centro@gmail.com' }], 'consulta el calendario de ese negocio');
    if (!compartido) return json({ calendars: { 'centro@gmail.com': { errors: [{ reason: 'notFound' }], busy: [] } } });
    // El dueño bloqueó 10:15 a 11:00 a mano
    return json({ calendars: { 'centro@gmail.com': { busy: [{ start: '2030-01-07T13:15:00Z', end: '2030-01-07T14:00:00Z' }] } } });
  }
  if (url.includes('/events')) return json({ id: 'evento1' });
  return json({ error: { message: 'ruta desconocida' } }, 404);
};

const libresG = await horariosLibres(conCalendario, lunes, antes);
assert.ok(!libresG.includes('10:00') && !libresG.includes('10:30'), 'respeta lo ocupado en el calendario');
assert.ok(libresG.includes('09:30') && libresG.includes('11:00'));
await reservar(conCalendario, { fecha: lunes, hora: '11:00', nombre: 'Sofi', motivo: 'Evaluación', contacto: 'wa:5491122334455' }, antes);
const [url, evento] = llamadas.at(-1);
assert.equal(url, 'https://www.googleapis.com/calendar/v3/calendars/centro%40gmail.com/events');
assert.equal(evento.summary, 'Evaluación – Sofi');
assert.equal(evento.start.dateTime, '2030-01-07T11:00:00-03:00');
assert.equal(evento.end.dateTime, '2030-01-07T11:30:00-03:00');
assert.match(evento.description, /\+5491122334455/);
compartido = false;
await assert.rejects(horariosLibres(conCalendario, lunes, antes), /compartieron/);
rmSync(cred);

// ---- Carga de negocios desde bot/negocios/ ----
const { negocios, negocioPorTelefono } = await import('./bot.mjs');
assert.ok(negocios.has('aura-laser') && negocios.has('barberia-norte'));
assert.equal(negocios.get('barberia-norte').agenda.duracion, 45);
assert.ok(negocios.get('aura-laser').sistema.includes('Aura Láser'));
assert.ok(!negocios.get('aura-laser').sistema.includes('whatsapp_phone_id'), 'la configuración no va a la IA');
assert.equal(negocioPorTelefono('no-existe'), undefined);

console.log('OK: agenda por negocio, Google Calendar simulado y carga de negocios');
