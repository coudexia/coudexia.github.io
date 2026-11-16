# Coudexia · sitio web

Landing de Coudexia (páginas web con reservas online para negocios con turnos), hecha con Astro.
Publicada en https://coudexia.coudexia.workers.dev con Cloudflare: cada push a `main` se publica solo.

## Publicación
- **Dónde**: Cloudflare (Workers con archivos estáticos, plan gratuito), proyecto `coudexia`, conectado a este repo de GitHub.
- **Cómo**: en cada push a `main` Cloudflare corre `npm run build` y después `npx wrangler deploy`, que sube la carpeta `dist/` según `wrangler.jsonc`. Las otras ramas generan una dirección de vista previa.
- **Sin claves en el repo**: el token de publicación lo creó y lo guarda Cloudflare. El sitio no usa variables de entorno.
- **Dirección del sitio**: está en `astro.config.mjs` (`site`), `public/robots.txt` y `public/sitemap.xml`. Al conectar un dominio propio (panel de Cloudflare → el proyecto → Settings → Domains & Routes) hay que cambiarla en los tres.
- **Espejo en GitHub Pages**: `.github/workflows/deploy.yml` sigue publicando una copia en https://coudexia.github.io/ para que los links viejos no queden desactualizados. Se puede borrar cuando ya nada apunte ahí.
- **Costos**: hosting USD 0. El único costo fijo previsto es el dominio.

## Usar en tu compu
1. `npm install`
2. `npm run dev` y abrí http://localhost:4321
3. `npm run build` para compilar (lo mismo que hace Cloudflare al publicar)

## Qué se edita y dónde
- **`src/data/coudexia.ts`**: contacto (WhatsApp, email, redes), precios de los planes, servicios,
  proyectos, proceso y preguntas frecuentes. Un campo vacío (`''`) no se muestra.
- `src/components/`: una sección por archivo (Header, Hero, Problema, Servicios, Reservas, Proyectos, Precios, Proceso, Faq, Contacto, Footer).
- `src/layouts/Base.astro`: colores de la marca, tipografía y metadatos para Google y redes.
- Marca: logo en `src/assets/logo.svg` (en curvas, se colorea por CSS), `public/favicon.svg`,
  `public/apple-touch-icon.png` y `public/og.png` (imagen al compartir el link).

## Proyectos demostrativos
Cada demo es una carpeta en `public/demos/<nombre>/` (HTML/CSS sin build). Comparten `public/demos/_fx/base.css` y `base.js` (franja de demo, aviso en contactos ficticios, apariciones, menú, galería y formularios a WhatsApp).
Marcas y datos ficticios; fotos de Unsplash. Las capturas de las tarjetas están en `public/proyectos/`
(`<demo>-desk.webp` 960×600 y `<demo>-cel.webp` 390×844): si cambiás una demo, actualizá su captura.

## Borradores para clientes
1. Copiá `clientes/_ejemplo.json` como `clientes/<cliente>.json` y completá los datos.
   - `demo`: `odontologo`, `estetica`, `servicio-tecnico`, `estetica-integral`, `depilacion` o `fletes`
   - Obligatorios: `nombre`, `whatsapp`. El resto de los campos está documentado en `scripts/clientes.mjs`.
2. `npm run clientes` genera el borrador en `public/clientes/<slug>/` (también se genera solo al publicar).
3. Push a `main`: queda en `https://coudexia.coudexia.workers.dev/clientes/<slug>/` (sin indexar en Google).
