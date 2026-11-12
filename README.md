# Coudexia · sitio web

Landing de Coudexia (diseño y desarrollo de sitios web y tiendas online), hecha con Astro.
Publicada en https://coudexia.github.io/ con GitHub Pages: cada push a `main` se publica solo.

## Usar en tu compu
1. `npm install`
2. `npm run dev` y abrí http://localhost:4321
3. `npm run build` para compilar (lo mismo que hace GitHub al publicar)

## Qué se edita y dónde
- **`src/data/coudexia.ts`**: contacto (WhatsApp, email, redes), precios de los planes, servicios,
  proyectos, proceso y preguntas frecuentes. Un campo vacío (`''`) no se muestra.
- `src/components/`: una sección por archivo (Header, Hero, Servicios, Proyectos, Precios, Proceso, Faq, Contacto, Footer).
- `src/layouts/Base.astro`: colores de la marca, tipografía y metadatos para Google y redes.
- Marca: logo en `src/assets/logo.svg` (en curvas, se colorea por CSS), `public/favicon.svg`,
  `public/apple-touch-icon.png` y `public/og.png` (imagen al compartir el link).

## Proyectos demostrativos
Cada demo es una carpeta en `public/demos/<nombre>/` (HTML/CSS sin build, efectos en `public/demos/_fx/`).
Marcas y datos ficticios; fotos de Unsplash. Las capturas de las tarjetas están en `public/proyectos/`
(`<demo>-desk.webp` 960×600 y `<demo>-cel.webp` 390×844): si cambiás una demo, actualizá su captura.

## Borradores para clientes
1. Copiá `clientes/_ejemplo.json` como `clientes/<cliente>.json` y completá los datos.
   - `demo`: `odontologo`, `estetica`, `servicio-tecnico`, `estetica-integral`, `depilacion` o `fletes`
   - Obligatorios: `nombre`, `whatsapp`. El resto de los campos está documentado en `scripts/clientes.mjs`.
2. `npm run clientes` genera el borrador en `public/clientes/<slug>/` (también se genera solo al publicar).
3. Push a `main`: queda en `https://coudexia.github.io/clientes/<slug>/` (sin indexar en Google).
