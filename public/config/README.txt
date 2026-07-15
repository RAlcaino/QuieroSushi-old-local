Configuración de bloqueo del panel antiguo
==========================================

Edita panelBlock.json en este servidor sin volver a compilar.

Lógica:
- Con enabled: true, TODOS los locales quedan bloqueados en este panel.
- Los IDs/correos listados abajo quedan EXCLUIDOS del bloqueo y pueden seguir aquí.
- El admin God (usuario id -1 / rol God) NUNCA se bloquea.
- El modal muestra migración al panel nuevo + contacto WhatsApp si no tienen acceso al correo.

Campos:
- enabled: true/false — activa o desactiva el bloqueo desde el front
- allowClose: true/false — si es false, el modal no se puede cerrar (usar cuando todos los locales estén listos)
- allowedLocalIds: [37, 59] — locales QS que NO se bloquean (excepciones)
- allowedQdLocalIds: [12] — locales QD que NO se bloquean (excepciones)
- allowedEmails: ["admin@quierosushi.cl"] — correos que NO se bloquean
- blockAllAfter: "2026-07-07T08:00:00-04:00" — fecha ISO desde la que aplica el bloqueo masivo
- newPanelUrl: URL del panel nuevo
- finalPanelUrl: URL definitiva del panel
- supportWhatsApp: número WhatsApp soporte (ej. 56955280241)
- supportWhatsAppMessage: mensaje precargado al abrir WhatsApp

Fases sugeridas:
1. Transición: enabled true, allowClose true, excepciones en allowedLocalIds
2. Bloqueo final: enabled true, allowClose false, sin excepciones

Los cambios en panelBlock.json aplican al recargar la página.
Ese archivo NO se guarda en caché del service worker (siempre se lee del servidor).
