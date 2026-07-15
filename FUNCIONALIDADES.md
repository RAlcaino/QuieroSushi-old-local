# QuieroSushi - Panel de Administracion

Aplicacion web tipo SPA (Single Page Application) construida con **Vue 2.6**, **Quasar Framework 1.15** y **Vuex** para la gestion de locales de sushi. Incluye soporte PWA para funcionar como app movil instalable.

---

## Stack Tecnologico

| Categoria | Tecnologias |
|-----------|-------------|
| Framework UI | Quasar Framework v1.15 |
| Frontend | Vue 2.6 + Vuex (persisted state) |
| HTTP | Axios |
| Mapas | vue2-google-maps (Google Maps) |
| Graficos | ApexCharts, vue-apexcharts, ECharts |
| Tiempo real | Laravel Echo + Pusher (WebSockets) |
| Notificaciones | SweetAlert2, Quasar Notify |
| Internacionalizacion | vue-i18n |
| Seguridad | secure-ls (almacenamiento encriptado), JWT (jwt-decode) |
| Audio | howler.js |
| PWA | Workbox (service worker), instalable en movil |
| Drag & Drop | vuedraggable |

---

## Modulos del Sistema

### 1. Autenticacion y Control de Acceso

**Archivos:** `src/pages/login/TheLogin.vue`, `src/store/modules/auth/auth.js`, `src/pages/passwordRecovery/PasswordRecovery.vue`

- **Login:** Formulario con email + password. Al autenticarse, guarda token JWT, datos del usuario, locales asignados, menu de opciones disponibles, y zonas geograficas.
- **Recuperacion de password:** Vista de "olvide mi clave" integrada en el login. Envia correo de recuperacion. La ruta `/cambio-clave/:token` permite establecer nueva contrasena.
- **Control de acceso por rol:** Cada menu es visible segun los permisos (`availableMenuOptions`) devueltos por la API. Las rutas verifican autenticacion y acceso con guards `beforeEnter`.
- **Cierre de sesion:** Limpia el store Vuex y el almacenamiento local.
- **God Mode:** Si el rol del usuario es "God", tiene acceso ilimitado al sistema.
- **Persistencia:** El store se persiste con `vuex-persistedstate` usando `secure-ls` (encriptado). El token JWT se refresca automaticamente.

### 2. Dashboard (Inicio)

**Archivos:** `src/pages/dashboard/Dashboard.vue`

- Pantalla de bienvenida con graficos estadisticos y resumen general del sistema.
- Muestra indicadores clave de ventas y estado de los locales.

### 3. Pedidos QS (Recibidos de la plataforma)

**Ruta:** `/pedidos`
**Archivos:** `src/pages/orders/qs_orders/`

- **Gestion de pedidos entrantes** desde la plataforma QuieroSushi (clientes finales).
- Tabs con estados del pedido:
  - **No confirmados** - Pedidos nuevos pendientes de confirmacion.
  - **Confirmados** - Pedidos aceptados en preparacion.
  - **Listo** - Pedidos terminados listos para despacho/retiro.
- Estados detallados en subcomponentes: `Waiting`, `Started`, `Preparation`, `Ready`, `Delivery`.
- **Acciones por pedido:**
  - Confirmar pedido
  - Cancelar pedido (con modal `ModalOrderCanceled`)
  - Marcar como listo/entregado
  - Ver detalle del pedido
  - Enviar notificaciones al cliente (WhatsApp/email)
- **Busqueda** por texto y **filtro por local**.
- **Sincronizacion en tiempo real** (Pusher/WebSocket) para recibir nuevos pedidos automaticamente. Boton de sincronizacion manual.
- Timer visible para cada pedido mostrando tiempo transcurrido.
- Soporte para **cancelacion externa** de reparto.

### 4. Pedidos Propios (QD - Generados por el local)

**Ruta:** `/pedidos-propios`
**Archivos:** `src/pages/orders/qd_orders/`

- **Creacion manual de pedidos** desde el panel administrativo.
- **Modal de nuevo pedido** (`ModalNewOrder`, `ModalNewOwnOrder`): seleccion de productos, cantidades, datos del cliente, direccion de entrega.
- **Cotizacion de delivery** via Uber/plataformas de reparto (`uber.quote`).
- **Estados del pedido propio:**
  - `Waiting` - Esperando confirmacion
  - `Started` - En preparacion
  - `Preparation` - Preparando
  - `Ready` - Listo
  - `Delivery` - En reparto
- **Integracion con Uber/plataforma de reparto:**
  - Crear delivery (`create-delivery`)
  - Cancelar delivery (`cancel-delivery`)
  - Actualizar delivery (`update-delivery`)
  - Seguimiento de estado (`get-delivery-status`)
- **Solicitar reparto** para pedidos propios.
- Busqueda y filtro por local.

### 5. Cupones

**Ruta:** `/cupones`
**Archivos:** `src/pages/coupons/`

- **CRUD de cupones de descuento** para la plataforma.
- **Dialogos:**
  - `TheEdit.vue` - Crear/editar cupon (nombre, codigo, descuento, fecha expiracion, imagen, etc.)
  - `TheAditionals.vue` - Gestion de adicionales/productos asociados al cupon.
  - `EditPhoto.vue` - Subir/editar foto del cupon.
- **Destacar cupon** (`stand out`): posicionar cupones destacados en la app del cliente. Muestra cupo disponible.
- **Subir cupon** (`go up`): re-posicionar cupones al inicio de la lista. Muestra cupo disponible.
- **Cambio de estado** (activar/desactivar) cupon.
- Filtro por local.

### 6. Administracion de Locales

**Ruta:** `/locales`
**Archivos:** `src/pages/local/`

- **Informacion general:** nombre, telefono, direccion, coordenadas GPS, foto. Integracion con Google Maps y geocodificacion automatica.
- **Horarios semanales:** configuracion de apertura/cierre por dia de la semana.
- **Datos del dueno:** nombre, telefono, tipo de constitucion (juridica/natural), representante legal, RUT empresa, razon social, giro.
- **Comunas de delivery:** agregar/eliminar comunas donde el local realiza despachos.
- **Cambio de foto** del local.
- **Comentarios** (`/comentarios`): visualizacion y respuesta de comentarios de clientes, filtrados por "sin replicas" / "con replicas", con paginacion.

### 7. Administracion de Usuarios

**Ruta:** `/administrar-usuarios`
**Archivos:** `src/pages/cruds/users/`

- **CRUD completo de usuarios** del panel administrativo.
- **Dialogos:**
  - `NewUserDialog` - Crear nuevo usuario con nombre, email, password, rol y locales asignados.
  - `EditUserDialog` - Editar datos de usuario existente.
  - `DeleteUserDialog` - Eliminar usuario con confirmacion.
  - `ChangePassword` - Cambiar contrasena de usuario.
- Filtro por local para ver usuarios asignados a cada sucursal.
- Roles disponibles: administrador, operador, etc.

### 8. Estadisticas de Ventas

**Ruta:** `/ventas`
**Archivos:** `src/pages/ordersStatistics/OrdersStatistics.vue`

- **Panel de analisis de ventas** con multiples tipos de graficos.
- Filtros por local, rango de fechas, y tipo de periodo.
- **Graficos disponibles (ApexCharts + ECharts):**
  - Grafico de barras - Ventas por periodo
  - Grafico circular (pie) - Distribucion de ventas por categoria
  - Grafico de linea - Tendencia temporal
  - Grafico de area - Evolucion acumulada
- **Tablas de datos** con detalle de ventas y posibilidad de descarga.
- Modal de cancelacion de ventas.

### 9. Historico de Cobro Semanal

**Ruta:** `/historico-cobro-semanal`
**Archivos:** `src/pages/Historial/`

- **Tabla de cobros semanales** historicos por local.
- **Componentes:**
  - `TheOverview.vue` - Vista general resumida
  - `TheTable.vue` - Tabla detallada con todos los cobros
  - `TheItem.vue` - Vista individual de cada cobro
  - `TheDetail.vue` - Modal con detalle completo del cobro, incluye reporte descargable
- Proceso de pago semanal (`pay_weekly_local`).
- Integracion con modal de Uber para gestion de pagos de reparto.

### 10. Registrar Transferencia / Pago de Servicios

**Ruta:** `/registrar-transferencia`
**Archivos:** `src/pages/registerServices/RegisterServices.vue`

- **Seleccion de servicios contratables** (planes, funcionalidades adicionales).
- **Registro de pago** mediante transferencia bancaria.
- **Checkout** (`/checkout`): resumen de compra con servicios seleccionados, cantidades y montos.
- **Pasarela de pago:** redireccion a plataforma de pago externa (Flow/Webpay).
- **Paginas de resultado:**
  - `/pago-exito/:type` - Pago exitoso
  - `/pago-error/:type` - Pago fallido
- Seleccion de local al que aplicar el servicio.

### 11. Tickets de Soporte

**Ruta:** `/tickets`
**Archivos:** `src/pages/support/`

- **CRUD de tickets de soporte** para comunicacion con el equipo central.
- **Dialogos:**
  - `NewTicket` - Crear nuevo ticket con asunto y mensaje.
  - `TheChat` - Chat en tiempo real dentro del ticket (WebSocket).
  - `CloseTicket` - Cerrar ticket.
- Filtro por estado: Abierto / Cerrado.
- Seleccion de local asociado al ticket.

### 12. Bienvenida / Onboarding

**Ruta:** `/bienvenido`
**Archivos:** `src/pages/welcome/TheWelcome.vue`

- Pantalla de bienvenida con logo y animacion de carga (gif de sushi).
- Muestra mensaje de bienvenida y carga inicial del sistema.

---

## Componentes Transversales

### Layouts

| Archivo | Descripcion |
|---------|-------------|
| `MainLayout.vue` | Layout principal con sidebar, toolbar y area de contenido. Incluye menu de navegacion, selector de local, notificaciones y boton de cierre de sesion. |
| `Mail.vue` | Layout para vista de correo/mensajes. |
| `Messages.vue` | Layout para chat en tiempo real. |
| `BasicCard.vue` | Layout simple con tarjeta centrada. |

### Boot Files (Plugins de inicializacion)

| Archivo | Funcion |
|---------|---------|
| `axios.js` | Configuracion de Axios con interceptors para refresh de token automatico. |
| `bell.js` | Inicializacion de sistema de notificaciones sonoras con howler.js. |
| `bus.js` | Event bus global para comunicacion entre componentes. |
| `echo.js` | Configuracion de Laravel Echo + Pusher para WebSockets en tiempo real. |
| `apex.js` | Registro de ApexCharts como plugin global. |
| `maps.js` | Configuracion de vue2-google-maps con API key. |
| `i18n.js` | Configuracion de vue-i18n para internacionalizacion ES/EN. |
| `notif.js` | Inicializacion de Quasar Notify. |
| `sweetalert2.js` | Configuracion de SweetAlert2 para dialogos modales. |
| `unix.js` | Filtro/plugin personalizado de timestamp Unix. |

### Componentes Base

| Componente | Descripcion |
|------------|-------------|
| `BasePage.vue` | Contenedor de pagina estandar con toolbar, titulo, icono, boton de sincronizacion, selector de local y boton de notificaciones. |
| `BaseMoreComponent.vue` | Menu contextual de acciones adicionales (tres puntos). |
| `InputComments.vue` | Campo de entrada para escribir respuestas a comentarios. |
| `StatusComponent.vue` | Indicador visual de estado con color y etiqueta. |

### Cards Reutilizables

Cards para perfil, productos, social, timeline, pricing, error, exito, etc. Diseniadas como componentes independientes para armar dashboards y vistas.

### Charts Reutilizables

`AreaChart`, `BarChart`, `BarHorizontalChart`, `LineChart`, `PieChart`, `PieChartTwo`, `ScatterPlot` - Wrappers de ApexCharts para usar en cualquier pagina.

### Modales

| Modal | Uso |
|-------|-----|
| `ModalBase` | Modal generico reutilizable. |
| `ModalAreUSure` | Confirmacion de acciones destructivas. |
| `ModalBlock` | Aviso de local bloqueado por deuda. |
| `ModalDebt` | Informacion de deuda pendiente. |
| `ModalNewOrder` | Creacion de nuevo pedido. |
| `ModalNewOwnOrder` | Creacion de pedido propio. |
| `ModalNotification` | Visualizacion de notificaciones. |
| `ModalOrderCanceled` | Cancelacion de pedido con motivo. |
| `ModalSetting` | Configuracion de preferencias. |
| `ModalStatusOrder` | Cambio de estado de pedido. |
| `ModalSyncPage` | Sincronizacion de pagina con animacion. |
| `ModalUber` | Gestion de delivery (Uber/plataforma). |

### Tablas y Paginacion

- `TableBasic`, `TableCustomGrid`, `TableDarkMode`, `TableProgress`, `TableVisits`, `TableActions` - Distintos estilos de tabla de datos.
- `BasicFilter`, `CardPagination`, `ListPagination` - Componentes de paginacion y filtros.
- `CustomHierarchy`, `SimpleHierarchy` - Tablas jerarquicas tipo arbol.

### Servicios (API)

| Archivo | Endpoints |
|---------|-----------|
| `LoginServices.js` | Autenticacion: login, recuperacion, cambio de contrasena, refresh token. |
| `OrderServices.js` | Pedidos: CRUD de pedidos QS y QD, confirmacion, cancelacion, historial, notificaciones. |

### Store (Vuex)

| Modulo | Almacena |
|--------|----------|
| `auth` | Usuario autenticado, token JWT, locales, menu, zonas geograficas, notificaciones. |
| `mode` | Modo produccion/desarrollo (`prod`). |
| `routes` | Catalogo de rutas de API con reemplazo de parametros dinamicos. |

---

## PWA (Progressive Web App)

- **Service Worker** en `src-pwa/` usando Workbox.
- **Instalable** en dispositivos moviles (Android/iOS) como aplicacion nativa.
- **Iconos y splash screens** en `public/`.
- **Evento `beforeinstallprompt`** capturado en el store para mostrar banner de instalacion personalizado.
- Build de produccion genera `dist/spa/` y `dist/pwa/`.

---

## Flujo de Navegacion

```
/login  -->  / (redirect a /pedidos o /pedidos-propios segun rol)
  |
  +-- /pedidos           (Pedidos de clientes QS)
  +-- /pedidos-propios   (Pedidos propios QD)
  +-- /locales           (Gestion de locales)
  +-- /comentarios       (Comentarios de clientes)
  +-- /cupones           (Cupones de descuento)
  +-- /administrar-usuarios (CRUD usuarios)
  +-- /ventas            (Estadisticas de ventas)
  +-- /historico-cobro-semanal (Historico semanal)
  +-- /registrar-transferencia (Pago de servicios)
  +-- /checkout          (Resumen de pago)
  +-- /tickets           (Soporte)
  +-- /bienvenido        (Onboarding)
  +-- /cambio-clave/:token (Recuperacion contrasena)
  +-- /pago-exito/:type  (Confirmacion pago)
  +-- /pago-error/:type  (Error de pago)
```

---

## Variables de Entorno

| Variable | Descripcion |
|----------|-------------|
| `API_URL` | URL base de la API REST |
| `API_GOOGLE` | API Key de Google Maps |
| `PUSHER_*` | Credenciales de Pusher para WebSockets |
| `MODE` | `spa` o `pwa` |

Archivos: `.development.env`, `.production.env`
