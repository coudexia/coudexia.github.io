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
  titulo: 'Coudexia · Páginas web con reservas online para negocios con turnos',
  descripcion: 'Páginas web profesionales con reservas online para centros de estética, barberías y peluquerías. Tus clientes conocen tus servicios y reservan su turno desde la web.',
};

// Link de WhatsApp con mensaje armado
export const wa = (texto = 'Hola Coudexia! Quiero consultar por una web para mi negocio.') =>
  `https://wa.me/${CONTACTO.whatsapp}?text=${encodeURIComponent(texto)}`;

// Rubros que se muestran en la cinta debajo del hero
export const RUBROS = ['Centros de estética', 'Barberías', 'Peluquerías', 'Uñas y pestañas', 'Depilación', 'Masajistas', 'Profesionales independientes'];

// Opciones del formulario de contacto
export const IDEAS = ['Estética o depilación', 'Barbería o peluquería', 'Uñas o pestañas', 'Masajes', 'Otro rubro'];
export const PLAZOS = ['Lo antes posible', 'En el próximo mes', 'En 2 o 3 meses', 'Sin apuro, estoy averiguando'];

export const SERVICIOS = [
  {
    id: 'web',
    titulo: 'Diseño y desarrollo web',
    problema: 'Te buscan en Google o te piden "pasame tu web" y no tenés dónde mandarlos, o tu Instagram no alcanza para mostrar servicios y precios claros.',
    ideal: 'Negocios que quieren verse profesionales y dar confianza desde el primer vistazo.',
    items: ['Diseño a medida de tu marca', 'Servicios y precios bien presentados', 'Pensada primero para el celular', 'SEO básico para que te encuentren en Google'],
    cta: ['Ver webs de ejemplo', '#proyectos'],
  },
  {
    id: 'landing',
    titulo: 'Landing pages comerciales',
    problema: 'Tenés un servicio o una promo para mostrar y necesitás una sola página, clara y directa, que lleve a la gente a escribirte.',
    ideal: 'Profesionales independientes y negocios que arrancan o quieren promocionar un servicio puntual.',
    items: ['Una página enfocada en un objetivo', 'Botón directo a tu WhatsApp, con el mensaje armado', 'Formulario de contacto', 'Ubicación con Google Maps'],
    cta: ['Ver planes', '#planes'],
  },
  {
    id: 'reservas',
    titulo: 'Reservas online',
    problema: 'Coordinar cada turno por mensaje te lleva tiempo, y las consultas que llegan mientras estás atendiendo o fuera de horario se enfrían.',
    ideal: 'Centros de estética, barberías, peluquerías y profesionales que trabajan con turnos.',
    items: ['Calendario de turnos integrado en tu web', 'Muestra solo los horarios que tenés libres', 'Cada reserva llega a tu Google Calendar', 'Duración y horarios por servicio'],
    cta: ['Ver cómo funciona', '#reservas'],
  },
  {
    id: 'mantenimiento',
    titulo: 'Mantenimiento web',
    problema: 'Una web con precios viejos o que deja de funcionar juega en contra. Cambiás un precio o sumás una promo, nos escribís y la actualizamos.',
    ideal: 'Dueños que prefieren ocuparse de su negocio y no de la tecnología.',
    items: ['Hosting y certificado de seguridad', 'Cambios de precios, textos y promos según tu plan', 'Supervisión de la web y de las reservas', 'Soporte por WhatsApp'],
    cta: ['Ver planes', '#planes'],
  },
];

// Cómo reserva un cliente: los pasos de la sección "Reservas online" (cada uno tiene su pantalla en Reservas.astro)
export const RESERVA = [
  { t: 'Entra a tu web', d: 'Desde Google, Instagram o el link que le pasaste.' },
  { t: 'Elige el servicio', d: 'Con su duración y su precio a la vista.' },
  { t: 'Elige el horario', d: 'Solo ve los días y las horas que tenés libres.' },
  { t: 'Confirma la reserva', d: 'Deja su nombre y su contacto, y recibe la confirmación.' },
  { t: 'Te llega el turno', d: 'Queda agendado en tu Google Calendar.' },
];

// Proyectos demostrativos: marcas y datos ficticios. "img" = nombre de las capturas en /public/proyectos/
export const PROYECTOS = [
  { nombre: 'Prisma Dental', tipo: 'Sitio profesional · 5 páginas', demo: 'odontologo', desc: 'Consultorio de 5 páginas con tratamientos interactivos, turnos online, galería ampliable y formulario que llega por WhatsApp.' },
  { nombre: 'Lúa Studio', tipo: 'Sitio profesional · Armado de turno', demo: 'estetica-integral', desc: 'Catálogo con filtros y buscador: la clienta arma su turno en un panel, ve el total y la duración, y lo reserva por WhatsApp.' },
  { nombre: 'Nácar Estética', tipo: 'Sitio profesional · 5 páginas', demo: 'estetica', desc: 'Identidad editorial: carta de precios con fotos que aparecen al pasar el mouse, packs, galería y reservas.' },
  { nombre: 'Aura Láser', tipo: 'Sitio profesional · 5 páginas', demo: 'depilacion', desc: 'Armado de zonas con total por sesión, packs con ahorro, preguntas frecuentes y reserva de evaluación.' },
];

// Precios en pesos argentinos. "desde" = pago único inicial; "mensual" = mantenimiento.
export const PLANES = [
  {
    nombre: 'Página Web',
    para: 'Para profesionales y negocios que necesitan una página clara para mostrar sus servicios y recibir reservas.',
    desde: '$189.000',
    mensual: '$45.000',
    nota: 'El mensual cubre hosting, mantenimiento y soporte. Sin permanencia mínima.',
    incluye: ['Landing de una página, diseñada a medida de tu marca', 'Adaptada a celular, tablet y escritorio', 'Botón de WhatsApp, ubicación con Google Maps y SEO básico', 'Botón "Reservar turno" que abre tu calendario de turnos', 'Reservas sincronizadas con tu Google Calendar', 'Hasta 2 cambios chicos por mes: precios, textos, fotos o promos'],
    mensaje: 'Hola Coudexia! Me interesa el plan Página Web.',
  },
  {
    nombre: 'Web Pro',
    para: 'Para negocios con varios servicios que quieren un sitio completo, con el calendario de turnos integrado.',
    desde: '$349.000',
    mensual: '$45.000',
    destacado: true,
    nota: 'El mensual cubre hosting, mantenimiento y soporte. Sin permanencia mínima.',
    incluye: ['Todo lo del plan Página Web', 'Sitio de hasta 5 páginas (en vez de una)', 'Servicios y precios, galería, nosotros y preguntas frecuentes', 'Calendario de turnos integrado en la web, con un tipo de turno por servicio', 'Hasta 4 cambios chicos por mes'],
    mensaje: 'Hola Coudexia! Me interesa el plan Web Pro.',
  },
];

// Precio de lanzamiento: vale para los primeros N clientes. Cuando se cubran, subir los precios de PLANES y poner cupos: 0 para ocultar el aviso.
export const LANZAMIENTO = { cupos: 10 };

// "vos" = lo único que tiene que hacer el cliente en ese paso
export const PROCESO = [
  { t: 'Contacto inicial', d: 'Nos escribís por WhatsApp y nos contás de tu negocio. Sin compromiso.', vos: 'un mensaje de WhatsApp.' },
  { t: 'Relevamiento', d: 'Juntamos tus servicios, precios, horarios y fotos, y vemos cómo das turnos hoy.', vos: 'pasarnos precios, horarios y fotos.' },
  { t: 'Diseño y desarrollo', d: 'Armamos tu web a medida de tu marca y configuramos el calendario de turnos.', vos: 'nada, trabajamos nosotros.' },
  { t: 'Revisión y ajustes', d: 'La ves en un enlace de prueba, desde tu celular, y ajustamos lo que haga falta.', vos: 'mirarla y decirnos qué cambiar.' },
  { t: 'Publicación', d: 'La publicamos con tu dominio y probamos juntos una reserva de punta a punta.', vos: 'hacer una reserva de prueba.' },
  { t: 'Mantenimiento', d: 'Quedamos a cargo del hosting, los cambios de tu plan y el soporte.', vos: 'avisarnos cuando cambie algo.' },
];

export const FAQ = [
  { p: '¿Cuánto tarda en estar lista mi web?', r: 'Una landing suele estar lista en 1 a 2 semanas y un sitio de 5 páginas en 2 a 4, contando desde que tenemos tus textos, precios y fotos.' },
  { p: '¿Cómo se paga?', r: 'La instalación se paga 50% al confirmar y 50% en la entrega. El mensual arranca cuando la web queda publicada. Por transferencia o Mercado Pago.' },
  { p: '¿Qué incluye el mensual?', r: 'El hosting, el certificado de seguridad, la supervisión de que la web y las reservas funcionen, el soporte por WhatsApp y los cambios chicos de tu plan (precios, textos, fotos o promos): hasta 2 por mes en Página Web y hasta 4 en Web Pro. Las secciones nuevas y los rediseños se presupuestan aparte.' },
  { p: '¿Cómo funcionan las reservas online?', r: 'Tu cliente entra a la web, elige el servicio y ve los horarios libres. Cuando confirma, el turno queda agendado y a los dos les llega la confirmación por email. Usamos Cal.com, una herramienta de turnos, integrada en tu web.' },
  { p: '¿Necesito Google Calendar?', r: 'Sí, alcanza con una cuenta de Google. Los turnos aparecen en tu Google Calendar, y si bloqueás un horario ahí, la web deja de ofrecerlo. Las cuentas de Google y de Cal.com son tuyas: las configuramos con vos y quedan a tu nombre.' },
  { p: '¿Las reservas tienen algún costo extra?', r: 'Para una persona con una agenda alcanza el plan gratuito de Cal.com, que muestra su marca en el calendario. Si necesitás funciones de sus planes pagos, como varios profesionales o quitar esa marca, se contratan a tu nombre y lo vemos antes de empezar.' },
  { p: '¿Qué pasa con el dominio?', r: 'El dominio (por ejemplo, tunegocio.com.ar) se registra a tu nombre y su costo anual lo pagás vos; te ayudamos a registrarlo y conectarlo.' },
  { p: '¿La web es mía?', r: 'Sí. El dominio, los textos, las fotos y las cuentas de reservas quedan a tu nombre. Si das de baja el mantenimiento, te entregamos los archivos de tu web para que la alojes donde quieras.' },
  { p: '¿Puedo dar de baja el mensual?', r: 'Sí, no tiene permanencia mínima: nos avisás y se corta al terminar el mes que ya pagaste. Desde ese momento dejamos de alojar y mantener la web; el dominio y tus cuentas siguen siendo tuyos.' },
];
