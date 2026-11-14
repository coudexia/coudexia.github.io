# Bot de turnos por WhatsApp (varios negocios)

Recepcionista con IA: responde precios y dudas, consulta horarios libres, reserva turnos y pasa la charla a una persona cuando hace falta.

Un solo servidor atiende a todos los negocios a la vez: cuando entra un mensaje, usa el negocio dueño del número de WhatsApp al que le escribieron (sus precios, su horario y su calendario).

## Probarlo en la compu

1. Sacá una clave en console.anthropic.com (hay que cargar crédito).
2. Copiá `.env.example` como `.env` y completá `ANTHROPIC_API_KEY`.
3. En esta carpeta: `npm start` y abrí http://localhost:3000

Arriba a la derecha elegís con qué negocio charlar. Si un negocio no tiene calendario configurado, sus turnos quedan en `turnos-<negocio>.json`. `npm test` prueba la agenda sin gastar créditos.

## Sumar un cliente

1. Copiá `negocios/barberia-norte/` con el nombre del cliente, por ejemplo `negocios/estetica-luna/`.
2. En su `negocio.json`, en `config`:
   - `dias`: días que abre (0 = domingo … 6 = sábado). `abre` y `cierra`: `"09:00"`, `"20:00"`. `duracion`: minutos de cada turno.
   - `calendario`: el ID de su Google Calendar (ver abajo).
   - `whatsapp_phone_id`: el ID de su número en Meta.
3. Fuera de `config` va todo lo que la recepcionista tiene que saber: nombre, dirección, horario en palabras, servicios y precios, preguntas frecuentes. Podés agregar los campos que quieras.
4. Reiniciá el servidor. Si algo está mal escrito, al arrancar te dice qué y en qué archivo.

Las carpetas de clientes reales no se suben a GitHub (solo los dos ejemplos).

## Conectarlo a Google Calendar

Sin esto los turnos se guardan en `turnos.json`. Con esto van al calendario del negocio, y los horarios que el dueño bloquee a mano el bot ya no los ofrece.

Una sola vez (tu cuenta, sirve para todos los clientes):
1. console.cloud.google.com → crear un proyecto → activar **Google Calendar API**.
2. IAM y administración → Cuentas de servicio → crear una → Claves → Agregar clave → JSON.
3. Guardá el archivo en esta carpeta como `credenciales-google.json` (está ignorado por git, nunca lo subas).

Por cada cliente:
1. En su Google Calendar → Configuración del calendario → Compartir con personas específicas → agregar el mail de la cuenta de servicio (`...@...iam.gserviceaccount.com`) con permiso **Hacer cambios en los eventos**.
2. En la misma pantalla, en "Integrar el calendario", copiá el **ID del calendario** a `calendario` en su `negocio.json`.

## Conectarlo a WhatsApp

1. developers.facebook.com → crear app de tipo Business → agregar el producto WhatsApp. Te da un número de prueba gratis.
2. Copiá al `.env` el token (`WA_TOKEN`) y el app secret (`WA_APP_SECRET`), e inventá un `WA_VERIFY_TOKEN`. El ID de cada número va en el `negocio.json` de ese cliente (`whatsapp_phone_id`).
3. El servidor tiene que estar en internet con HTTPS (un servicio como Render o Railway, o `cloudflared tunnel` para probar desde tu compu).
4. En Meta → WhatsApp → Configuración → Webhook: URL `https://tu-dominio/webhook`, el mismo verify token, y suscribite a `messages`.
5. Agregá tu celular como número de prueba y escribile.

Para un cliente real: su cuenta de Meta Business verificada y su número conectado. Cuando el servidor quede público, poné `CHAT_WEB=0`.
