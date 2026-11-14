// Prueba de la agenda (no llama a la IA): node test.mjs
import assert from 'node:assert/strict';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { rmSync } from 'node:fs';

process.env.TURNOS_FILE = join(tmpdir(), `turnos-test-${process.pid}.json`);
const { horariosLibres, reservar } = await import('./agenda.mjs');

const antes = { fecha: '2030-01-01', hora: '08:00' };
const lunes = '2030-01-07';

assert.deepEqual(horariosLibres('2030-01-06', antes), [], 'domingo cerrado');
const libres = horariosLibres(lunes, antes);
assert.equal(libres.length, 24);
assert.equal(libres[0], '09:00');
assert.equal(libres.at(-1), '20:30');

reservar({ fecha: lunes, hora: '09:00', nombre: 'Ana', motivo: 'Evaluación', contacto: 'test' }, antes);
assert.ok(!horariosLibres(lunes, antes).includes('09:00'), 'turno tomado no aparece');
assert.throws(() => reservar({ fecha: lunes, hora: '09:00', nombre: 'Bea', motivo: 'x', contacto: 'test' }, antes), /no está disponible/);
assert.throws(() => reservar({ fecha: lunes, hora: '09:15', nombre: 'Bea', motivo: 'x', contacto: 'test' }, antes), /no está disponible/);

assert.equal(horariosLibres(lunes, { fecha: lunes, hora: '10:10' })[0], '10:30', 'hoy no ofrece horas pasadas');
assert.throws(() => horariosLibres('2029-12-31', antes), /ya pasó/);
assert.throws(() => horariosLibres('2030-02-30', antes), /inválida/);

rmSync(process.env.TURNOS_FILE);
console.log('agenda OK');
