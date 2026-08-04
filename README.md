# Sistema Integral de Gestión - Frontend

Frontend de una SPA construida con Vite y JavaScript modular para gestionar inventario, productos, tareas, PQRS, usuarios y un panel administrativo.

## 1. Qué hace este proyecto

La aplicación permite:

- administrar categorías (inventario) y productos vinculados a una categoría,
- gestionar tareas con asignación a usuarios y cambio de estado,
- registrar y clasificar PQRS con cambio de estado,
- gestionar usuarios (registro, edición y eliminación, solo Admin),
- consultar estadísticas generales en el panel administrativo.

La interfaz está organizada en pestañas y se apoya en una arquitectura modular por capas:

- `services`: consume la API o usa una capa local de respaldo para demo.
- `ui`: renderiza tablas y selectores.
- `views`: orquesta la interacción entre servicios y DOM.
- `utils`: reutiliza helpers para notificaciones, confirmación y escape HTML.

## 2. Flujo real de funcionamiento

La app inicia con una pantalla de login simulada en frontend. Las credenciales se validan localmente con `localStorage`, y según el rol del usuario se muestran solo las pestañas permitidas.

Usuarios de demostración:

| Correo | Contraseña | Rol | Pestañas visibles |
|---|---|---|---|
| lulizcano.aa@hotmail.com | cambiar123 | Admin | Inventario, Productos, Tareas, PQRS, Administración, Usuarios |
| prueba@gmail.com | cambiar123 | Inventario | Inventario, Productos, Tareas |
| juan@gmail.com | cambiar123 | Vendedor | PQRS |

## 3. Estructura actual

```text
.
├── index.html              # Layout: login, barra superior, pestañas y 6 secciones
├── package.json            # Scripts de Vite (dev, build, preview)
├── vite.config.js          # Configuración del build y proxy /api -> localhost:3000
├── .env.example            # Plantilla con VITE_API_BASE_URL
└── src/
    ├── main.js             # Punto de entrada: login, pestañas por rol, arranque de vistas
    ├── style.css           # Estilos globales de toda la interfaz
    ├── services/
    │   ├── api.js          # Wrapper HTTP + respaldo local (mock) para demo
    │   ├── auth.js         # Login simulado, sesión y control de acceso por rol
    │   ├── config.js       # URL base de la API desde VITE_API_BASE_URL
    │   ├── inventoryApi.js # CRUD de categorías y productos
    │   ├── usersApi.js     # CRUD de usuarios
    │   ├── tasksApi.js     # CRUD de tareas y cambio de estado
    │   └── pqrsApi.js      # CRUD de PQRS y cambio de estado
    ├── ui/
    │   ├── inventoryUI.js  # Render de la tabla de categorías
    │   ├── productsUI.js   # Render de la tabla de productos y select de categorías
    │   ├── tasksUI.js      # Render de la tabla de tareas y select de usuarios
    │   ├── pqrsUI.js       # Render de la tabla de PQRS
    │   ├── usersUI.js      # Render de la tabla de usuarios
    │   └── adminUI.js      # Render de las estadísticas del panel
    ├── utils/
    │   └── helpers.js      # Notificaciones, confirmaciones, spinner y escape HTML
    └── views/
        ├── authView.js     # Login, logout y nombre del usuario en el header
        ├── inventoryView.js# Lógica del módulo de categorías
        ├── productsView.js # Lógica del módulo de productos
        ├── tasksView.js    # Lógica del módulo de tareas
        ├── pqrsView.js     # Lógica del módulo de PQRS
        ├── usersView.js    # Lógica del módulo de usuarios
        └── adminView.js    # Lógica del panel administrativo
```

## 4. Requisitos previos

- Node.js 18+
- Backend levantado en `http://localhost:3000` si se desea sincronizar con datos reales.
- MySQL configurado para la base `inventario_adso`.

## 5. Instalación y ejecución

```bash
npm install
npm run dev
npm run build
npm run preview
```

### Variables de entorno

Crea un archivo `.env` a partir de `.env.example`:

```bash
cp .env.example .env
```

Variable principal:

| Variable | Valor | Descripción |
|---|---|---|
| VITE_API_BASE_URL | /api | Prefijo base usado por el frontend para hablar con el backend. |

En desarrollo, Vite redirige cualquier petición `/api/*` hacia el backend (`vite.config.js`), eliminando el prefijo en el camino.

## 6. Cómo usar la interfaz

### Inventario (categorías)

- Agrega una categoría escribiendo su nombre y pulsando "Agregar".
- Edítala o elimínala desde los botones de acción de la tabla.

### Productos

- Agrega un producto indicando nombre, precio y categoría.
- Edita o elimina desde la tabla; al editar se cargan los datos actuales en el formulario.

### Tareas

- Crea tareas con título, descripción y usuario asignado.
- Cambia el estado desde el selector de cada fila (Pendiente / En progreso / Completada).
- Elimina la tarea cuando ya no sea necesaria.

### PQRS

- Selecciona el tipo de solicitud (Petición, Queja, Reclamo, Sugerencia).
- Escribe una descripción y envía la solicitud.
- Cambia el estado desde la tabla (Abierta / En proceso / Cerrada).

### Usuarios (solo Admin)

- Agrega un usuario con nombre, correo y contraseña opcional (por defecto `cambiar123`).
- Pulsa "Editar" en la tabla para cargar sus datos en el formulario y modifícalos con "Actualizar".
- Elimina usuarios con confirmación previa.

Todas las acciones (agregar, modificar, eliminar) actualizan la tabla **sin recargar la página**: la vista vuelve a consultar los datos y re-renderiza la fila o el listado en memoria.

## 7. Cómo se usa el código (arquitectura)

### Punto de entrada (`src/main.js`)

1. `inicializar()` configura la vista de autenticación y decide si mostrar login o arrancar la app.
2. `arrancarApp()` llama a `filtrarPestanasPorRol()`, que oculta las pestañas a las que el rol no tiene acceso (`services/auth.js`).
3. La primera vez, `setupTabs()` enlaza los clics de las pestañas y `iniciarVistasPermitidas()` ejecuta el `init*View()` de cada módulo visible.

### Flujo de una operación (ej. agregar un usuario)

```text
Clic en "Agregar" (usersView.js)
  -> lee los campos del formulario y valida
  -> llama a crearUsuario() (services/usersApi.js)
    -> post() (services/api.js)
      -> fetch a /api/users
      -> si el backend no responde: fallback mock en localStorage
  -> mostrarNotificacion("Usuario creado correctamente")
  -> cargarUsuarios(): re-consulta la API y re-renderiza la tabla (ui/usersUI.js)
```

### Capas y responsabilidades

- **views/**: escuchan eventos del DOM, orquestan la lógica y llaman a los servicios. Nunca hacen `fetch` directamente.
- **services/**: centralizan las peticiones HTTP (`api.js` expone `get/post/put/patch/del`). Si `fetch` falla (backend apagado), `api.js` usa un respaldo local en `localStorage` que simula el contrato del servidor.
- **ui/**: reciben datos y pintan el DOM (tablas y selectores). Sin lógica de red.
- **utils/helpers.js**: `escaparHTML` (previene XSS), `mostrarNotificacion`, `mostrarConfirmacion` y `mostrarCargando`.

### Patrones clave

- **Delegación de eventos**: las tablas usan un único listener con `e.target.closest("button")` y `data-id`, así los botones dinámicos funcionan tras cada re-render.
- **Estado de edición**: cada vista guarda el `id` en edición (ej. `editingUserId`); al guardar, `PUT` actualiza el registro y el botón vuelve a "Agregar".
- **Escape HTML**: todo dato proveniente de la API se pinta con `escaparHTML()`.

## 8. Nota importante sobre el backend

El frontend incluye una capa local de respaldo en `src/services/api.js` para que la UI siga siendo usable en demo incluso si el backend no está corriendo. Cuando el backend real está disponible, la aplicación usa el proxy de Vite y las rutas comenzando con `/api`.

## 9. Estado de compilación verificado

El proyecto se ha verificado de forma real con:

```bash
npm run build
```

Resultado esperado:

- Vite genera el build de producción en `dist/`.
- La app queda lista para servirse o desplegarse.

---

## 10. Políticas de trabajo del equipo

### Blindaje de ramas y seguridad

- **Rama `main`:** representa el estado de producción; solo recibe código desde `develop` cuando un Milestone (Hito) está al 100%.
- **Restricción de Merge:** el botón de integración está bloqueado para los desarrolladores; solo el Líder tiene el permiso final tras la revisión.
- **Flujo de trabajo:** cada tarea se desarrolla en su rama (`git push origin feat/nombre-tarea`) y se integra mediante Pull Request.

### Estándares de calidad (Definition of Done)

- **Limpieza:** cero `console.log`, variables sin uso o código comentado "por si acaso".
- **Responsive:** el diseño se adapta sin romperse a pantallas móviles.
- **Sincronización:** la rama está actualizada y sin conflictos de merge.
- **Automatización:** la descripción del PR incluye `Closes #ID` para cerrar la tarea.

### Criterios de entrega y evaluación

La fase del proyecto se considera exitosa, terminada y lista para calificación únicamente cuando:

- El **Milestone** en GitHub marca el **100%** de progreso.
- Todas las **Issues** del hito están cerradas y vinculadas a un PR aprobado.
- El proyecto está desplegado en vivo (ej. Vercel, GitHub Pages) y funciona sin errores.

### Dirección del proyecto

| Miembro | Rol | Usuario de GitHub |
| :--- | :--- | :--- |
| Julian Jaimes Estupiñan | Líder (Arquitecto) | `@julixnj31` |
| Selena Molina Figueroa | Desarrollador | `@se-26` |
| Yoinel Duvan Martinez Plata | Desarrollador | `@Yoinelmatinez` |

- **Institución:** Servicio Nacional de Aprendizaje (SENA)
- **Programa:** Análisis y Desarrollo de Software
- **Grupo:** 5 - Programación de Software

Este repositorio es propiedad del equipo de desarrollo y se rige por las políticas de formación profesional integral del SENA.
