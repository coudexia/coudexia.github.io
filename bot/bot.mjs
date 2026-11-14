import Anthropic from '@anthropic-ai/sdk';
import { readFileSync, readdirSync } from 'node:fs';
import { ahoraAR, horariosLibres, reservar } from './agenda.mjs';

const client = new Anthropic();
const MODELO = process.env.BOT_MODEL || 'claude-haiku-5-5';
export const AVISO_HUMANO = 'Te paso con alguien del equipo, en un ratito te escriben por acá 🙌';

const instrucciones = (nombre, datos) => `Sos la recepcionista virtual de ${nombre}, un negocio que da turnos, y atendés su WhatsApp. Hablás en español rioplatense, con voseo, cálida y profesional.

Estilo: mensajes cortos (2 a 4 líneas), sin listas largas ni markdown; para resaltar podés usar *así*. Un emoji ocasional está bien. Hacé una pregunta por vez.

Qué hacés:
- Respondés precios, servicios, horarios y preguntas frecuentes usando SOLO los datos del negocio de abajo. Si te preguntan algo que no está ahí, no lo inventes: usá derivar_a_humano.
- Si piden varios servicios, sumá el total. Si los datos dicen que los precios son orientativos, aclaralo.
- Para dar un turno: averiguá qué servicio quiere, qué día le queda bien y su nombre. Antes de ofrecer horarios, consultalos con ver_horarios_libres: nunca inventes disponibilidad. Ofrecé 2 o 3 opciones cercanas a lo que pidió. Antes de reservar, confirmá día, hora y motivo, y recién cuando te diga que sí usá reservar_turno.
- Cada mensaje del cliente empieza con la fecha y hora en que llegó; usala para entender "mañana", "el jueves", etc.
- Usá derivar_a_humano si lo pide, se queja, tiene una consulta médica o de salud, quiere cancelar o cambiar un turno, o pregunta algo que no sabés.
- No te hagas pasar por una persona: si te preguntan si sos un bot, decí con naturalidad que sos la asistente virtual de ${nombre}.
- Si te escriben de algo que no tiene que ver con el negocio, respondé con amabilidad que solo podés ayudar con consultas y turnos de ${nombre}.

Datos del negocio:
${datos}`;

// ---- Negocios: una carpeta por cliente en negocios/<slug>/negocio.json ----
const HORA = /^([01]\d|2[0-3]):[0-5]\d$/;
function cargarNegocios() {
  const lista = new Map();
  const carpeta = new URL('./negocios/', import.meta.url);
  for (const slug of readdirSync(carpeta, { withFileTypes: true }).filter((d) => d.isDirectory()).map((d) => d.name)) {
    const { config: c, ...datos } = JSON.parse(readFileSync(new URL(`${slug}/negocio.json`, carpeta), 'utf8'));
    const mal = (msj) => { throw new Error(`negocios/${slug}/negocio.json: ${msj}`); };
    if (!c) mal('falta "config"');
    if (!datos.nombre) mal('falta "nombre"');
    if (!Array.isArray(c.dias) || !c.dias.every((d) => Number.isInteger(d) && d >= 0 && d <= 6)) mal('"dias" tiene que ser una lista de números del 0 (domingo) al 6 (sábado)');
    if (!HORA.test(c.abre) || !HORA.test(c.cierra) || c.abre >= c.cierra) mal('"abre" y "cierra" tienen que ser horas HH:MM y "abre" antes que "cierra"');
    if (!Number.isInteger(c.duracion) || c.duracion < 5) mal('"duracion" tiene que ser los minutos de cada turno');
    const repetido = c.whatsapp_phone_id && [...lista.values()].find((n) => n.phoneId === c.whatsapp_phone_id);
    if (repetido) mal(`el whatsapp_phone_id ya lo usa ${repetido.slug}`);
    lista.set(slug, {
      slug,
      nombre: datos.nombre,
      phoneId: c.whatsapp_phone_id || '',
      agenda: { slug, calendario: c.calendario || '', dias: c.dias, abre: c.abre, cierra: c.cierra, duracion: c.duracion },
      sistema: instrucciones(datos.nombre, JSON.stringify(datos, null, 2)),
    });
  }
  if (!lista.size) throw new Error('No hay negocios en bot/negocios/');
  return lista;
}
export const negocios = cargarNegocios();
export const negocioPorTelefono = (phoneId) => [...negocios.values()].find((n) => n.phoneId === phoneId);

const herramientas = [
  {
    name: 'ver_horarios_libres',
    description: 'Devuelve los horarios libres de un día. Usala siempre antes de ofrecer horarios.',
    strict: true,
    input_schema: { type: 'object', properties: { fecha: { type: 'string', description: 'Día en formato YYYY-MM-DD' } }, required: ['fecha'], additionalProperties: false },
  },
  {
    name: 'reservar_turno',
    description: 'Reserva un turno. Solo después de que el cliente confirmó día, hora y motivo.',
    strict: true,
    input_schema: {
      type: 'object',
      properties: {
        fecha: { type: 'string', description: 'YYYY-MM-DD' },
        hora: { type: 'string', description: 'HH:MM, uno de los horarios libres' },
        nombre: { type: 'string', description: 'Nombre del cliente' },
        motivo: { type: 'string', description: 'Servicio o motivo del turno' },
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

// shortcut: conversaciones en memoria, se pierden al reiniciar; pasar a una base de datos cuando haga falta conservarlas.
const chats = new Map();
const colas = new Map();

async function ejecutar(bloque, neg, chat, contacto) {
  const { name, input } = bloque;
  try {
    if (name === 'ver_horarios_libres') {
      const libres = await horariosLibres(neg.agenda, input.fecha);
      return { content: libres.length ? `Libres el ${input.fecha} (turnos de ${neg.agenda.duracion} min): ${libres.join(', ')}` : `El ${input.fecha} no hay turnos (cerrado o completo).` };
    }
    if (name === 'reservar_turno') {
      const t = await reservar(neg.agenda, { ...input, contacto });
      console.log(`[turno ${neg.slug}]`, t);
      return { content: `Reservado: ${t.fecha} ${t.hora}, ${t.nombre}, ${t.motivo}.` };
    }
    if (name === 'derivar_a_humano') {
      chat.derivado = true;
      console.log(`[derivado ${neg.slug}]`, contacto, input.motivo);
      return { content: 'Listo, una persona del equipo sigue la charla. Avisale al cliente que en un rato le escriben.' };
    }
    return { content: `Herramienta desconocida: ${name}`, is_error: true };
  } catch (e) {
    console.error(`[error herramienta ${neg.slug}]`, name, e.message);
    return { content: e.message, is_error: true };
  }
}

async function atender(neg, contacto, texto) {
  const clave = `${neg.slug}|${contacto}`;
  const chat = chats.get(clave) ?? { mensajes: [], derivado: false };
  chats.set(clave, chat);
  if (chat.derivado) return null; // ya lo sigue una persona
  const ahora = ahoraAR();
  chat.mensajes.push({ role: 'user', content: `[${ahora.fecha} ${ahora.hora}] ${texto}` });

  for (let vuelta = 0; vuelta < 6; vuelta++) {
    const r = await client.beta.messages.create({
      model: MODELO,
      max_tokens: 16000,
      output_config: { effort: 'low' },
      system: [{ type: 'text', text: neg.sistema, cache_control: { type: 'ephemeral' } }],
      tools: herramientas,
      messages: chat.mensajes,
      // Haiku no tiene respaldo del lado del servidor si rechaza un pedido
      ...(MODELO.startsWith('claude-haiku') ? {} : { betas: ['server-side-fallback-2026-07-01'], fallbacks: 'default' }),
    });
    chat.mensajes.push({ role: 'assistant', content: r.content }); // completo: incluye los bloques de razonamiento
    if (r.stop_reason === 'refusal') { chat.derivado = true; return AVISO_HUMANO; }
    if (r.stop_reason !== 'tool_use') return r.content.filter((b) => b.type === 'text').map((b) => b.text).join('\n').trim() || null;
    const resultados = await Promise.all(r.content.filter((b) => b.type === 'tool_use').map(async (b) => ({ type: 'tool_result', tool_use_id: b.id, ...(await ejecutar(b, neg, chat, contacto)) })));
    chat.mensajes.push({ role: 'user', content: resultados });
  }
  chat.derivado = true;
  return AVISO_HUMANO;
}

// Devuelve el texto a mandar, o null si no hay que responder. Cada chat atiende de a un mensaje; los chats distintos van en paralelo.
export function responder(neg, contacto, texto) {
  const clave = `${neg.slug}|${contacto}`;
  const p = (colas.get(clave) ?? Promise.resolve()).then(() => atender(neg, contacto, texto));
  colas.set(clave, p.catch(() => {}));
  return p;
}
