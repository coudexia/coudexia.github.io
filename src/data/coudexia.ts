// ====== Datos de Coudexia: todo lo que se cambia seguido está acá ======
// Los campos vacíos ('') no se muestran en la página.

export const CONTACTO = {
  whatsapp: '5491166103318', // código de país + 9 + número, sin espacios
  telefono: '+54 11 6610-3318',
  email: 'coudexia@gmail.com',
  ciudad: 'Buenos Aires, Argentina',
  titular: '', // nombre completo o razón social, ej: 'Juan Pérez'. Aparece en el pie y en la política de privacidad
  cuit: '',    // ej: '20-12345678-9'. Cuando estés inscripto en ARCA
  instagram: 'https://www.instagram.com/coudexia',
  linkedin: '',  // ej: 'https://www.linkedin.com/company/coudexia'
};

export const SITIO = {
  titulo: 'Coudexia · Web + recepcionista con IA para WhatsApp',
  descripcion: 'Tu web y una recepcionista con IA que responde por WhatsApp y agenda turnos sola, las 24 h. Para centros de estética, consultorios y negocios con turnos.',
};

// Link de WhatsApp con mensaje armado
export const wa = (texto = 'Hola Coudexia! Quiero consultar por una web.') =>
  `https://wa.me/${CONTACTO.whatsapp}?text=${encodeURIComponent(texto)}`;

// Rubros que se muestran en la cinta debajo del hero
export const RUBROS = ['Centros de estética', 'Depilación láser', 'Consultorios', 'Odontología', 'Barberías', 'Peluquerías', 'Kinesiología', 'Gimnasios y estudios'];

// Opciones del formulario de contacto
export const IDEAS = ['Estética o depilación', 'Consultorio', 'Barbería o peluquería', 'Gimnasio o estudio', 'Otro rubro'];
export const PLAZOS = ['Lo antes posible', 'En el próximo mes', 'En 2 o 3 meses', 'Sin apuro, estoy averiguando'];

export const SERVICIOS = [
  {
    id: 'bot',
    titulo: 'Recepcionista con IA en tu WhatsApp',
    problema: 'Te escriben a toda hora para preguntar precios y turnos, y cada mensaje que tardás en contestar es una clienta que se va a otro lado.',
    ideal: 'Centros de estética, consultorios, barberías y cualquier negocio que da turnos por WhatsApp.',
    items: ['Responde precios, servicios y dudas al instante', 'Consulta tu agenda y reserva el turno', 'Te pasa la charla cuando hace falta una persona', 'Atiende las 24 h, también los fines de semana'],
    cta: ['Ver cómo responde', '#inicio'],
  },
  {
    id: 'web',
    titulo: 'Web profesional con tus precios',
    problema: 'Te piden "pasame tu web" o te buscan en Google y no tenés dónde mandarlos, o tu Instagram no alcanza para mostrar servicios y precios claros.',
    ideal: 'Negocios que quieren verse profesionales y que cada visita termine en un mensaje o un turno.',
    items: ['Diseño a medida de tu marca', 'Carta de servicios y precios', 'Pensada primero para el celular', 'Botón directo a tu WhatsApp'],
    cta: ['Ver webs de ejemplo', '#proyectos'],
  },
  {
    id: 'mantenimiento',
    titulo: 'Lo mantenemos por vos',
    problema: 'Cambiás un precio o sumás una promo y nos escribís: actualizamos la web y lo que sabe tu recepcionista. Vos te ocupás de tu negocio.',
    ideal: 'Dueños que no quieren pelearse con la tecnología.',
    items: ['Cambios de precios, servicios y promos', 'Ajustes del bot según las consultas reales', 'Soporte por WhatsApp', 'Hosting incluido'],
    cta: ['Ver planes', '#planes'],
  },
];

// Proyectos demostrativos: marcas y datos ficticios. "img" = nombre de las capturas en /public/proyectos/
export const PROYECTOS = [
  { nombre: 'Prisma Dental', tipo: 'Sitio profesional · 5 páginas', demo: 'odontologo', desc: 'Consultorio de 5 páginas con tratamientos interactivos, turnos online, galería ampliable y formulario que llega por WhatsApp.' },
  { nombre: 'Lúa Studio', tipo: 'Sitio profesional · Armado de turno', demo: 'estetica-integral', desc: 'Catálogo con filtros y buscador: la clienta arma su turno en un panel, ve el total y la duración, y lo reserva por WhatsApp.' },
  { nombre: 'Nácar Estética', tipo: 'Sitio profesional · 5 páginas', demo: 'estetica', desc: 'Identidad editorial: carta de precios con fotos que aparecen al pasar el mouse, packs, galería y reservas.' },
  { nombre: 'Aura Láser', tipo: 'Sitio profesional · 5 páginas', demo: 'depilacion', desc: 'Armado de zonas con total por sesión, packs con ahorro, preguntas frecuentes y reserva de evaluación.' },
];

// Pesos por dólar para mostrar el equivalente en USD al lado de cada precio
export const DOLAR = 1500;

// Precios en pesos argentinos. "mensual" vacío = pago único; "desde" vacío = solo mensual, sin instalación.
export const PLANES = [
  {
    nombre: 'Recepcionista IA',
    para: 'Para negocios que ya tienen web y quieren que su WhatsApp atienda y agende solo.',
    desde: '',
    mensual: '$45.000',
    incluye: ['Recepcionista con IA en tu WhatsApp', 'Responde precios, servicios y dudas al instante', 'Consulta tu agenda y reserva turnos sola', 'Te pasa la charla cuando hace falta una persona', 'Ajustes y soporte por WhatsApp incluidos'],
    mensaje: 'Hola Coudexia! Me interesa el plan Recepcionista IA para mi WhatsApp.',
  },
  {
    nombre: 'Web + Recepcionista IA',
    para: 'Para negocios con turnos que quieren responder al instante y llenar la agenda.',
    desde: '$349.000',
    mensual: '$90.000',
    destacado: true,
    incluye: ['Web de hasta 5 páginas con tus servicios y precios', 'Recepcionista con IA en tu WhatsApp', 'Consulta tu agenda y reserva turnos sola', 'Te pasa la charla cuando hace falta una persona', 'Mantenimiento y soporte incluidos en el mensual'],
    mensaje: 'Hola Coudexia! Me interesa el plan Web + Recepcionista IA.',
  },
  {
    nombre: 'Página Web',
    para: 'Para negocios que por ahora solo necesitan una web profesional.',
    desde: '$189.000',
    mensual: '',
    nota: 'Podés sumar la recepcionista cuando quieras.',
    incluye: ['Landing de una página', 'Diseño a medida de tu marca', 'Adaptada a celular, tablet y escritorio', 'Botón de WhatsApp y formulario de consulta', 'Ubicación con Google Maps', 'SEO básico para Google'],
    mensaje: 'Hola Coudexia! Me interesa el plan Página Web.',
  },
];

// Precio de lanzamiento: vale para los primeros N clientes. Cuando se cubran, subir los precios de PLANES y poner cupos: 0 para ocultar el aviso.
export const LANZAMIENTO = { cupos: 10 };

export const PROCESO = [
  { t: 'Charla inicial', d: 'Nos contás cómo trabaja tu negocio y cómo das turnos hoy. Por WhatsApp o en una llamada corta.' },
  { t: 'Relevamiento', d: 'Juntamos tus servicios, precios, horarios y las preguntas que más te hacen.' },
  { t: 'Armado', d: 'Diseñamos tu web y entrenamos a tu recepcionista con la información de tu negocio.' },
  { t: 'Prueba juntos', d: 'Le escribís como si fueras una clienta y ajustamos cómo responde hasta que quede como lo querés.' },
  { t: 'Conexión y publicación', d: 'La conectamos a tu WhatsApp, publicamos la web y quedamos a cargo del mantenimiento.' },
];

export const FAQ = [
  { p: '¿Cómo funciona la recepcionista con IA?', r: 'Está conectada a tu WhatsApp y conoce tus servicios, precios y horarios. Cuando alguien escribe, responde al momento, consulta tu agenda y reserva el turno. Si no sabe algo o la clienta pide hablar con una persona, te pasa la charla.' },
  { p: '¿Se nota que es un bot?', r: 'Responde con el tono de tu negocio, en mensajes cortos y naturales. No se hace pasar por una persona: si alguien le pregunta, dice que es la asistente virtual del negocio.' },
  { p: '¿Sigo usando mi WhatsApp?', r: 'Usamos la conexión oficial de Meta. En la charla inicial vemos tu caso: en general podés seguir usando tu número y escribir desde la app de WhatsApp Business cuando quieras tomar una charla.' },
  { p: '¿Dónde veo los turnos?', r: 'Los turnos que reserva quedan en tu agenda de Google Calendar, que ves desde el celular o la compu.' },
  { p: '¿Cómo se paga?', r: 'En los planes con web, la instalación se paga 50% al confirmar y 50% en la entrega. El mensual arranca cuando la recepcionista empieza a atender. Por transferencia o Mercado Pago.' },
  { p: '¿Qué incluye el mensual?', r: 'El funcionamiento de la recepcionista, el hosting, los cambios de precios, servicios y promos en la web y en el bot, los ajustes según las consultas reales y soporte por WhatsApp. No tiene permanencia mínima.' },
  { p: '¿Qué pasa con el dominio?', r: 'El dominio (por ejemplo, tunegocio.com.ar) se registra a tu nombre y su costo anual lo pagás vos; te ayudamos a registrarlo y conectarlo.' },
];
