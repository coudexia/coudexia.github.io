import Anthropic from '@anthropic-ai/sdk';
import { readFileSync } from 'node:fs';
import { ahoraAR, horariosLibres, reservar } from './agenda.mjs';

const client = new Anthropic();
const MODELO = process.env.BOT_MODEL || 'claude-haiku-5-5';
const negocio = readFileSync(new URL('./negocio.json', import.meta.url), 'utf8');
export const AVISO_HUMANO = 'Te paso con alguien del equipo, en un ratito te escriben por acá 🙌';

const SISTEMA = `Sos la recepcionista virtual de un centro de estética y atendés su WhatsApp. Hablás en español rioplatense, con voseo, cálida y profesional.

Estilo: mensajes cortos (2 a 4 líneas), sin listas largas ni markdown; para resaltar podés usar *así*. Un emoji ocasional está bien. Hacé una pregunta por vez.

Qué hacés:
- Respondés precios, zonas, packs, horarios y preguntas frecuentes usando SOLO los datos del negocio de abajo. Si te preguntan algo que no está ahí, no lo inventes: usá derivar_a_humano.
- Si eligen varias zonas, sumá el total por sesión y aclarás que es orientativo y se confirma en la evaluación gratis.
- Para dar un turno: averiguá qué quiere hacer (evaluación gratis o sesión, y qué zonas), qué día le queda bien y su nombre. Antes de ofrecer horarios, consultalos con ver_horarios_libres: nunca inventes disponibilidad. Ofrecé 2 o 3 opciones cercanas a lo que pidió. Antes de reservar, confirmá día, hora y motivo con la clienta, y recién cuando diga que sí usá reservar_turno.
- Cada mensaje de la clienta empieza con la fecha y hora en que llegó; usala para entender "mañana", "el jueves", etc.
- Usá derivar_a_humano si la clienta lo pide, se queja, tiene una consulta médica (embarazo, medicación, problemas de piel), quiere cancelar o cambiar un turno, o pregunta algo que no sabés.
- No te hagas pasar por una persona: si te preguntan si sos un bot, decí con naturalidad que sos la asistente virtual del centro.
- Si te escriben de algo que no tiene que ver con el centro, respondé con amabilidad que solo podés ayudar con consultas y turnos del centro.

Datos del negocio:
${negocio}`;

const herramientas = [
  {
    name: 'ver_horarios_libres',
    description: 'Devuelve los horarios libres (turnos de 30 min) de un día. Usala siempre antes de ofrecer horarios.',
    strict: true,
    input_schema: { type: 'object', properties: { fecha: { type: 'string', description: 'Día en formato YYYY-MM-DD' } }, required: ['fecha'], additionalProperties: false },
  },
  {
    name: 'reservar_turno',
    description: 'Reserva un turno. Solo después de que la clienta confirmó día, hora y motivo.',
    strict: true,
    input_schema: {
      type: 'object',
      properties: {
        fecha: { type: 'string', description: 'YYYY-MM-DD' },
        hora: { type: 'string', description: 'HH:MM, uno de los horarios libres' },
        nombre: { type: 'string', description: 'Nombre de la clienta' },
        motivo: { type: 'string', description: 'Evaluación gratis, o sesión y zonas' },
      },
      required: ['fecha', 'hora', 'nombre', 'motivo'],
      additionalProperties: false,
    },
  },
  {
    name: 'derivar_a_humano',
    description: 'Pasa la conversación a una persona del equipo. Después de usarla, el bot deja de responder en este chat.',
    strict: true,
    input_schema: { type: 'object', properties: { motivo: { type: 'string' } }, required: ['motivo'], additionalProperties: false },
  },
];

// shortcut: conversaciones en memoria, se pierden al reiniciar; pasar a una base de datos al tener varios clientes.
const chats = new Map();
const colas = new Map();

async function ejecutar(bloque, chat, id) {
  const { name, input } = bloque;
  try {
    if (name === 'ver_horarios_libres') {
      const libres = await horariosLibres(input.fecha);
      return { content: libres.length ? `Libres el ${input.fecha}: ${libres.join(', ')}` : `El ${input.fecha} no hay turnos (cerrado o completo).` };
    }
    if (name === 'reservar_turno') {
      const t = await reservar({ ...input, contacto: id });
      console.log('[turno]', t);
      return { content: `Reservado: ${t.fecha} ${t.hora}, ${t.nombre}, ${t.motivo}.` };
    }
    if (name === 'derivar_a_humano') {
      chat.derivado = true;
      console.log('[derivado]', id, input.motivo);
      return { content: 'Listo, una persona del equipo sigue la charla. Avisale a la clienta que en un rato le escriben.' };
    }
    return { content: `Herramienta desconocida: ${name}`, is_error: true };
  } catch (e) {
    console.error('[error herramienta]', name, e.message);
    return { content: e.message, is_error: true };
  }
}

async function atender(id, texto) {
  const chat = chats.get(id) ?? { mensajes: [], derivado: false };
  chats.set(id, chat);
  if (chat.derivado) return null; // ya lo sigue una persona
  const ahora = ahoraAR();
  chat.mensajes.push({ role: 'user', content: `[${ahora.fecha} ${ahora.hora}] ${texto}` });

  for (let vuelta = 0; vuelta < 6; vuelta++) {
    const r = await client.beta.messages.create({
      model: MODELO,
      max_tokens: 16000,
      output_config: { effort: 'low' },
      system: [{ type: 'text', text: SISTEMA, cache_control: { type: 'ephemeral' } }],
      tools: herramientas,
      messages: chat.mensajes,
      // Haiku no tiene respaldo del lado del servidor si rechaza un pedido
      ...(MODELO.startsWith('claude-haiku') ? {} : { betas: ['server-side-fallback-2026-07-01'], fallbacks: 'default' }),
    });
    chat.mensajes.push({ role: 'assistant', content: r.content }); // completo: incluye los bloques de razonamiento
    if (r.stop_reason === 'refusal') { chat.derivado = true; return AVISO_HUMANO; }
    if (r.stop_reason !== 'tool_use') return r.content.filter((b) => b.type === 'text').map((b) => b.text).join('\n').trim() || null;
    const resultados = await Promise.all(r.content.filter((b) => b.type === 'tool_use').map(async (b) => ({ type: 'tool_result', tool_use_id: b.id, ...(await ejecutar(b, chat, id)) })));
    chat.mensajes.push({ role: 'user', content: resultados });
  }
  chat.derivado = true;
  return AVISO_HUMANO;
}

// Devuelve el texto a mandar, o null si no hay que responder. Atiende de a un mensaje por chat.
export function responder(id, texto) {
  const p = (colas.get(id) ?? Promise.resolve()).then(() => atender(id, texto));
  colas.set(id, p.catch(() => {}));
  return p;
}
