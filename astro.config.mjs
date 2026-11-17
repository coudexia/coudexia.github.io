import { defineConfig } from 'astro/config';

// Dirección pública del sitio (Cloudflare). Al conectar un dominio propio, cambiarla acá, en public/robots.txt y en public/sitemap.xml.
export default defineConfig({
  site: 'https://coudexia.com.ar',
  // El CSS va dentro del HTML: la página se dibuja sin esperar un archivo aparte
  build: { inlineStylesheets: 'always' },
});
