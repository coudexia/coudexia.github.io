# Bot de turnos por WhatsApp (prueba con Aura Láser)

Recepcionista con IA: responde precios y dudas, consulta horarios libres, reserva turnos y pasa la charla a una persona cuando hace falta.

## Probarlo en la compu

1. Sacá una clave en console.anthropic.com (hay que cargar crédito).
2. Copiá `.env.example` como `.env` y completá `ANTHROPIC_API_KEY`.
3. En esta carpeta: `npm start` y abrí http://localhost:3000

Los turnos quedan en `turnos.json`. `npm test` prueba la agenda sin gastar créditos.

## Adaptarlo a otro centro

Cambiá `negocio.json` (precios, zonas, horario, preguntas frecuentes). Si cambia el horario o la duración de los turnos, ajustá las constantes de arriba en `agenda.mjs`.

## Conectarlo a WhatsApp

1. developers.facebook.com → crear app de tipo Business → agregar el producto WhatsApp. Te da un número de prueba gratis.
2. Copiá al `.env` el token (`WA_TOKEN`), el ID del número (`WA_PHONE_ID`) y el app secret (`WA_APP_SECRET`). Inventá un `WA_VERIFY_TOKEN`.
3. El servidor tiene que estar en internet con HTTPS (un servicio como Render o Railway, o `cloudflared tunnel` para probar desde tu compu).
4. En Meta → WhatsApp → Configuración → Webhook: URL `https://tu-dominio/webhook`, el mismo verify token, y suscribite a `messages`.
5. Agregá tu celular como número de prueba y escribile.

Para un cliente real: su cuenta de Meta Business verificada y su número conectado. Cuando el servidor quede público, poné `CHAT_WEB=0`.
