// Prueba de la agenda (no llama a la IA ni a Google de verdad): node test.mjs
import assert from 'node:assert/strict';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { rmSync, writeFileSync } from 'node:fs';
import { generateKeyPairSync, createVerify } from 'node:crypto';

const antes = { fecha: '2030-01-01', hora: '08:00' };
const lunes = '2030-01-07';

// ---- Modo archivo ----
process.env.TURNOS_FILE = join(tmpdir(), `turnos-test-${process.pid}.json`);
const archivo = await import('./agenda.mjs');

assert.deepEqual(await archivo.horariosLibres('2030-01-06', antes), [], 'domingo cerrado');
const libres = await archivo.horariosLibres(lunes, antes);
assert.equal(libres.length, 24);
assert.equal(libres[0], '09:00');
assert.equal(libres.at(-1), '20:30');

await archivo.reservar({ fecha: lunes, hora: '09:00', nombre: 'Ana', motivo: 'Evaluación', contacto: 'test' }, antes);
assert.ok(!(await archivo.horariosLibres(lunes, antes)).includes('09:00'), 'turno tomado no aparece');
await assert.rejects(archivo.reservar({ fecha: lunes, hora: '09:00', nombre: 'Bea', motivo: 'x', contacto: 'test' }, antes), /no está disponible/);
await assert.rejects(archivo.reservar({ fecha: lunes, hora: '09:15', nombre: 'Bea', motivo: 'x', contacto: 'test' }, antes), /no está disponible/);
assert.equal((await archivo.horariosLibres(lunes, { fecha: lunes, hora: '10:10' }))[0], '10:30', 'hoy no ofrece horas pasadas');
await assert.rejects(archivo.horariosLibres('2029-12-31', antes), /ya pasó/);
await assert.rejects(archivo.horariosLibres('2030-02-30', antes), /inválida/);
rmSync(process.env.TURNOS_FILE);

// ---- Modo Google Calendar, con un Google simulado ----
const { publicKey, privateKey } = generateKeyPairSync('rsa', { modulusLength: 2048 });
const cred = join(tmpdir(), `cred-test-${process.pid}.json`);
writeFileSync(cred, JSON.stringify({ client_email: 'bot@test.iam.gserviceaccount.com', private_key: privateKey.export({ type: 'pkcs8', format: 'pem' }), token_uri: 'https://oauth2.googleapis.com/token' }));
process.env.GOOGLE_CREDENTIALS = cred;
process.env.GOOGLE_CALENDAR_ID = 'centro@gmail.com';

const llamadas = [];
let compartido = true;
globalThis.fetch = async (url, op) => {
  const json = (datos, status = 200) => ({ ok: status < 400, status, json: async () => datos });
  if (url === 'https://oauth2.googleapis.com/token') {
    const jwt = new URLSearchParams(op.body.toString()).get('assertion').split('.');
    assert.ok(createVerify('RSA-SHA256').update(`${jwt[0]}.${jwt[1]}`).verify(publicKey, jwt[2], 'base64url'), 'JWT firmado con la clave');
    assert.equal(JSON.parse(Buffer.from(jwt[1], 'base64url')).iss, 'bot@test.iam.gserviceaccount.com');
    return json({ access_token: 'tok', expires_in: 3600 });
  }
  assert.equal(op.headers.authorization, 'Bearer tok');
  const cuerpo = JSON.parse(op.body);
  llamadas.push([url, cuerpo]);
  if (url.endsWith('/freeBusy')) {
    if (!compartido) return json({ calendars: { 'centro@gmail.com': { errors: [{ reason: 'notFound' }], busy: [] } } });
    // El dueño bloqueó 10:15 a 11:00 a mano
    return json({ calendars: { 'centro@gmail.com': { busy: [{ start: '2030-01-07T13:15:00Z', end: '2030-01-07T14:00:00Z' }] } } });
  }
  if (url.includes('/events')) return json({ id: 'evento1' });
  return json({ error: { message: 'ruta desconocida' } }, 404);
};

const g = await import('./agenda.mjs?google');
const libresG = await g.horariosLibres(lunes, antes);
assert.ok(!libresG.includes('10:00') && !libresG.includes('10:30'), 'respeta lo ocupado en el calendario');
assert.ok(libresG.includes('09:30') && libresG.includes('11:00'));

await g.reservar({ fecha: lunes, hora: '11:00', nombre: 'Sofi', motivo: 'Evaluación', contacto: 'wa:5491122334455' }, antes);
const [url, evento] = llamadas.at(-1);
assert.equal(url, 'https://www.googleapis.com/calendar/v3/calendars/centro%40gmail.com/events');
assert.equal(evento.summary, 'Evaluación – Sofi');
assert.equal(evento.start.dateTime, '2030-01-07T11:00:00-03:00');
assert.equal(evento.end.dateTime, '2030-01-07T11:30:00-03:00');
assert.match(evento.description, /\+5491122334455/);
await assert.rejects(g.reservar({ fecha: lunes, hora: '10:30', nombre: 'X', motivo: 'x', contacto: 'x' }, antes), /no está disponible/);

compartido = false;
await assert.rejects(g.horariosLibres(lunes, antes), /compartieron/);
rmSync(cred);

console.log('agenda OK (archivo y Google Calendar simulado)');
