// ====== Datos de Coudexia: todo lo que se cambia seguido está acá ======
// Los campos vacíos ('') no se muestran en la página.

export const CONTACTO = {
  whatsapp: '5491166103318', // código de país + 9 + número, sin espacios
  telefono: '+54 11 6610-3318',
  email: 'flavio.lovera@hotmail.com',
  ciudad: 'Buenos Aires, Argentina',
  instagram: '', // ej: 'https://instagram.com/coudexia'
  linkedin: '',  // ej: 'https://www.linkedin.com/company/coudexia'
};

export const SITIO = {
  titulo: 'Coudexia · Diseño y desarrollo de sitios web y tiendas online',
  descripcion: 'Diseñamos y desarrollamos sitios web, landing pages y tiendas online en Tiendanube y Shopify para negocios que quieren crecer. Borrador gratis en 48 h.',
};

// Link de WhatsApp con mensaje armado
export const wa = (texto = 'Hola Coudexia! Quiero consultar por una web.') =>
  `https://wa.me/${CONTACTO.whatsapp}?text=${encodeURIComponent(texto)}`;

export const SERVICIOS = [
  {
    id: 'webs',
    titulo: 'Landing pages y sitios web',
    problema: 'Tus clientes te buscan en Google o te piden "pasame tu web" y no tenés dónde mandarlos, o tu sitio actual no se entiende desde el celular.',
    ideal: 'Profesionales, consultorios, comercios y servicios que necesitan mostrar lo que hacen y recibir consultas.',
    items: ['Páginas de aterrizaje', 'Sitios institucionales', 'Sitios profesionales multipágina', 'Diseño responsive'],
  },
  {
    id: 'tiendas',
    titulo: 'Tiendas online',
    problema: 'Vendés por Instagram o WhatsApp y respondés precios uno por uno. Una tienda ordena el catálogo y cobra sola.',
    ideal: 'Marcas y comercios que quieren vender online con pagos y envíos resueltos.',
    items: ['Implementación en Tiendanube', 'Implementación en Shopify', 'Configuración visual y comercial', 'Organización de productos, categorías y navegación'],
  },
  {
    id: 'medida',
    titulo: 'Desarrollo y soluciones a medida',
    problema: 'Necesitás algo que una plantilla no resuelve: un cotizador, reservas, un cálculo o conectar herramientas que ya usás.',
    ideal: 'Negocios con un proceso propio que quieren ahorrar tiempo o dar una mejor experiencia.',
    items: ['Funcionalidades específicas', 'Integraciones', 'Automatizaciones', 'Proyectos web a medida'],
  },
];

// Proyectos demostrativos: marcas y datos ficticios. "img" = nombre de las capturas en /public/proyectos/
export const PROYECTOS = [
  { nombre: 'Prisma Dental', tipo: 'Sitio profesional · 5 páginas', plan: 'Web Business', demo: 'odontologo', desc: 'Consultorio odontológico con tratamientos, preguntas frecuentes, galería, reseñas de ejemplo y turnos por WhatsApp.' },
  { nombre: 'Lúa Studio', tipo: 'Desarrollo a medida · Armado de turno', plan: 'A medida', demo: 'estetica-integral', desc: 'Catálogo de servicios con filtros: la clienta arma su turno, ve el total y la duración, y lo reserva por WhatsApp.' },
  { nombre: 'Rumbo Fletes', tipo: 'Landing page · Cotizador', plan: 'Web Start', demo: 'fletes', desc: 'Una página con cotizador: origen, destino y carga llegan armados por WhatsApp. Barra fija para llamar.' },
  { nombre: 'Nácar Estética', tipo: 'Sitio profesional · 5 páginas', plan: 'Web Business', demo: 'estetica', desc: 'Identidad editorial para un centro de estética: precios por categoría, packs, galería, equipo y reservas.' },
  { nombre: 'HidroClima', tipo: 'Landing page · Urgencias', plan: 'Web Start', demo: 'servicio-tecnico', desc: 'Pensada para urgencias desde el celular: servicios, zonas con mapa y botones para llamar o escribir.' },
  { nombre: 'Aura Láser', tipo: 'Sitio profesional · 5 páginas', plan: 'Web Business', demo: 'depilacion', desc: 'Precios por zona, packs con ahorro, preguntas frecuentes y reserva de evaluación con mapa.' },
];

// Precios en pesos argentinos. Para ocultar un monto, poné desde: ''.
export const PLANES = [
  {
    nombre: 'Web Start',
    para: 'Para negocios que necesitan presencia digital y una página profesional.',
    desde: '$189.000',
    incluye: ['Landing de una página', 'Diseño a medida de tu marca', 'Adaptada a celular, tablet y escritorio', 'Botón de WhatsApp y formulario de consulta', 'Ubicación con Google Maps', 'SEO básico para Google', 'Borrador gratis en 48 h'],
    mensaje: 'Hola Coudexia! Me interesa el plan Web Start.',
  },
  {
    nombre: 'Web Business',
    para: 'Para empresas que necesitan un sitio más completo con varias secciones.',
    desde: '$349.000',
    destacado: true,
    incluye: ['Sitio de hasta 5 páginas', 'Todo lo de Web Start', 'Servicios, galería, nosotros y contacto', 'Preguntas frecuentes', 'Formulario que llega a tu WhatsApp', 'Borrador gratis en 48 h'],
    mensaje: 'Hola Coudexia! Me interesa el plan Web Business.',
  },
  {
    nombre: 'Web Commerce',
    para: 'Para negocios que quieren comenzar a vender online con Tiendanube o Shopify.',
    desde: '$490.000',
    nota: 'El plan mensual de la plataforma se contrata aparte, a tu nombre.',
    incluye: ['Armado de tu tienda en Tiendanube o Shopify', 'Diseño adaptado a tu marca', 'Categorías y navegación organizadas', 'Carga inicial de productos', 'Configuración de medios de pago y envío'],
    mensaje: 'Hola Coudexia! Me interesa el plan Web Commerce para mi tienda online.',
  },
];

export const PROCESO = [
  { t: 'Consulta inicial', d: 'Nos contás qué hace tu negocio y qué necesitás. Por WhatsApp o en una llamada corta.' },
  { t: 'Relevamiento y propuesta', d: 'Definimos secciones, contenidos y alcance. En webs Start y Business te mostramos un borrador gratis en 48 h.' },
  { t: 'Diseño y desarrollo', d: 'Armamos el sitio con tus textos, fotos y colores, pensado primero para el celular.' },
  { t: 'Revisión y ajustes', d: 'Lo recorrés completo y marcás cambios. Ajustamos hasta que quede como lo querés.' },
  { t: 'Entrega y publicación', d: 'Lo publicamos en tu dominio y te explicamos cómo seguir. La web queda a tu nombre.' },
];

export const FAQ = [
  { p: '¿Cuánto tiempo lleva tener mi web?', r: 'El borrador de una web Start o Business está en 48 h hábiles desde que nos pasás tus datos. El tiempo total depende de cuándo tengamos tus textos y fotos: en la propuesta te damos una fecha concreta.' },
  { p: '¿Cómo se paga?', r: '50% al confirmar el proyecto y 50% en la entrega, por transferencia o Mercado Pago. El borrador es gratis y no te compromete a nada.' },
  { p: '¿Qué pasa con el dominio y el hosting?', r: 'El dominio (por ejemplo, tunegocio.com.ar) se registra a tu nombre y su costo anual lo pagás vos; te ayudamos a registrarlo y conectarlo. El hosting lo definimos en la propuesta según el tipo de sitio.' },
  { p: '¿Ofrecen mantenimiento?', r: 'Sí. Después de la entrega podés pedirnos cambios cuando los necesites, y si preferís despreocuparte, acordamos un mantenimiento mensual. Lo cotizamos según lo que haga falta.' },
  { p: '¿Cómo funcionan las tiendas online?', r: 'Armamos tu tienda en Tiendanube o Shopify: diseño, categorías, productos, pagos y envíos. La cuenta y el plan mensual de la plataforma quedan a tu nombre y se pagan aparte, directamente a la plataforma.' },
  { p: '¿Puedo pedir cambios después?', r: 'Sí. Los cambios de la etapa de revisión están incluidos. Las modificaciones posteriores, como sumar una sección o actualizar precios, se cotizan según el trabajo.' },
];
