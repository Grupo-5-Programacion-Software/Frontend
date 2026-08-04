# Sistema Integral de Gestión - Frontend

Frontend de una SPA construida con Vite y JavaScript modular para gestionar inventario, tareas, PQRS y panel administrativo.

## 1. Qué hace este proyecto

La aplicación permite:

- administrar categorías y productos,
- gestionar tareas con asignación a usuarios,
- registrar y actualizar PQRS,
- consultar estadísticas generales en el panel administrativo.

La interfaz está organizada en pestañas y se apoya en una arquitectura modular por capas:

- services: consume la API o usa una capa local de respaldo para demo.
- ui: renderiza tablas y selectores.
- views: orquesta la interacción entre servicios y DOM.
- utils: reutiliza helpers para notificaciones, confirmación y escape HTML.

## 2. Flujo real de funcionamiento

La app inicia con una pantalla de login simulada en frontend. Las credenciales se validan localmente con `localStorage`, y según el rol del usuario se muestran solo las pestañas permitidas.

Usuarios de demostración:

| Correo | Contraseña | Rol | Pestañas visibles |
|---|---|---|---|
| lulizcano.aa@hotmail.com | cambiar123 | Admin | Inventario, Tareas, PQRS, Administración |
| prueba@gmail.com | cambiar123 | Inventario | Inventario, Tareas |
| juan@gmail.com | cambiar123 | Vendedor | PQRS |

## 3. Estructura actual

```text
src/
├── main.js                # Punto de entrada de la aplicación
├── style.css              # Estilos globales y rediseño visual
├── services/
│   ├── api.js              # Wrapper HTTP + respaldo local para demo
│   ├── auth.js             # Login simulado y control por rol
│   ├── config.js           # URL de la API desde VITE_API_BASE_URL
│   ├── inventoryApi.js     # CRUD de categorías y productos
│   ├── usersApi.js         # CRUD de usuarios
│   ├── tasksApi.js         # CRUD de tareas
│   └── pqrsApi.js          # CRUD de PQRS
├── ui/
│   ├── inventoryUI.js      # Render tabla de inventario
│   ├── tasksUI.js          # Render tabla de tareas
│   ├── pqrsUI.js           # Render tabla de PQRS
│   └── adminUI.js          # Render estadísticas
├── views/
│   ├── authView.js         # Login / logout / sesión
│   ├── inventoryView.js    # Lógica del módulo inventario
│   ├── tasksView.js        # Lógica del módulo tareas
│   ├── pqrsView.js         # Lógica del módulo PQRS
│   └── adminView.js        # Lógica del panel administrativo
└── utils/helpers.js        # Notificaciones, confirmación, XSS
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

## 6. Cómo usar la interfaz

### Inventario

- Agrega una categoría desde el primer formulario.
- Agrega un producto indicando nombre, precio y categoría.
- Edita o elimina desde la tabla con los botones de acción.

### Tareas

- Crea tareas con título, descripción y usuario asignado.
- Cambia el estado desde el selector de cada fila.
- Elimina la tarea cuando ya no sea necesaria.

### PQRS

- Selecciona el tipo de solicitud.
- Escribe una descripción y envía la solicitud.
- Cambia el estado desde la tabla.

### Administración

- Consulta los totales de usuarios, tareas y PQRS en la vista administrativa.

## 7. Nota importante sobre el backend

Actualmente el frontend incluye una capa local de respaldo en `src/services/api.js` para que la UI siga siendo usable en demo incluso si el backend no está corriendo. Cuando el backend real está disponible, la aplicación usa el proxy de Vite y las rutas comenzando con `/api`.

## 8. Estado de compilación verificado

El proyecto se ha verificado de forma real con:

```bash
npm run build
```

Resultado esperado:

- Vite genera el build de producción en `dist/`.
- La app queda lista para servirse o desplegarse.


```bash
git push origin feat/nombre-tarea
```

### El "Por qué"

Este flujo protege la estabilidad del código base. Si tu código falla, solo falla en tu rama, manteniendo el proyecto principal intacto y siempre funcional.

---

## BLINDAJE DE RAMAS Y SEGURIDAD

- **Rama `main`:**
  - Representa el estado de producción
  - Solo recibe código desde `develop` cuando un Milestone (Hito) está al 100%

- **Restricción de Merge:**
  - El botón de integración está bloqueado para los desarrolladores
  - Solo el Líder tiene el permiso final tras la revisión

---

## ESTÁNDARES DE CALIDAD (DEFINITION OF DONE)

- **Limpieza:** cero `console.log`, variables sin uso o código comentado (*"por si acaso"*)
- **Responsive:** el diseño se adapta sin romperse a pantallas móviles
- **Sincronización:** la rama está actualizada y sin conflictos de merge
- **Automatización:** la descripción del PR incluye `Closes #ID` para cerrar la tarea

### El "Por qué"

Un control de calidad preventivo reduce la deuda técnica (errores acumulados) y automatiza el proceso administrativo.

---

## CRITERIOS DE ENTREGA Y EVALUACIÓN

La fase del proyecto se considera exitosa, terminada y lista para calificación únicamente cuando:

- El **Milestone** en GitHub marca el **100%** de progreso
- Todas las **Issues** del hito están cerradas y vinculadas a un PR aprobado
- El proyecto está desplegado en vivo (ej. Vercel, GitHub Pages) y funciona sin errores

### El "Por qué"

En la industria, el software que no está publicado no existe. Esto vincula el resultado técnico con la gestión profesional.

---

## DIRECCIÓN DEL PROYECTO

- **Instructor:** [Tu Nombre Aquí]
- **Institución:** Servicio Nacional de Aprendizaje (SENA)
- **Centro:** [Nombre de tu Centro de Formación]
- **Programa:** Análisis y Desarrollo de Software

---

Este repositorio es propiedad del equipo de desarrollo y se rige por las políticas de formación profesional integral del SENA.
