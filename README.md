# Sistema Integral de Gestión - Frontend

**Software Factory SENA · Metodología "Del Requerimiento al Producto"**

Frontend del sistema de gestión construido con **Vite + JavaScript modular**.
Incluye los módulos de **Inventario, Tareas, PQRS y Panel Administrativo**,
que consumen la API REST del backend (Express + MySQL).

---

## 🧭 Descripción del sistema

Aplicación web de una sola página (SPA) organizada en pestañas. Cada módulo
permite listar, crear, actualizar y eliminar registros de forma visual,
comunicándose con el backend a través de peticiones `fetch`.

| Pestaña | Módulo | Qué permite hacer |
|---------|--------|-------------------|
| Inventario | Categorías y productos | CRUD de categorías y productos (con precio y stock) |
| Tareas | Asignación de tareas | CRUD de tareas con usuario asignado y cambio de estado |
| PQRS | Solicitudes ciudadanas | Enviar y gestionar peticiones, quejas, reclamos y sugerencias |
| Administración | Panel de estadísticas | Conteos globales de usuarios, tareas y PQRS |

---

## 🏗️ Arquitectura y estructura del proyecto

Organización modular por capas para facilitar el mantenimiento:

```
/
├── src/                        # Código fuente principal
│   ├── services/               # Lógica de consumo de datos o APIs
│   │   ├── api.js              # Wrapper de fetch (GET, POST, PUT, PATCH, DELETE)
│   │   ├── config.js           # URL base de la API (desde .env)
│   │   ├── inventoryApi.js     # Peticiones de categorías y productos
│   │   ├── usersApi.js         # Peticiones de usuarios
│   │   ├── tasksApi.js         # Peticiones de tareas
│   │   └── pqrsApi.js          # Peticiones de solicitudes PQRS
│   ├── ui/                     # Renderizado de tablas y selectores (DOM)
│   │   ├── inventoryUI.js
│   │   ├── tasksUI.js
│   │   ├── pqrsUI.js
│   │   └── adminUI.js
│   ├── views/                  # Coordinación de eventos por módulo
│   │   ├── inventoryView.js
│   │   ├── tasksView.js
│   │   ├── pqrsView.js
│   │   └── adminView.js
│   ├── utils/                  # Funciones auxiliares reutilizables
│   │   └── helpers.js          # Notificaciones, confirmaciones, XSS
│   ├── main.js                 # Punto de entrada de la aplicación
│   └── style.css               # Estilos globales
├── .github/                    # Motor de plantillas (Issues y Pull Requests)
├── docs/                       # Guías metodológicas y reportes técnicos
├── .gitignore                  # Archivos que Git debe ignorar
├── .env.example                # Plantilla de variables de entorno
├── index.html                  # Vista raíz (entrada de Vite)
├── package.json                # Dependencias y scripts del proyecto
├── vite.config.js              # Configuración de Vite (build + proxy /api)
└── README.md                   # Manual principal del repositorio
```

### Separación de responsabilidades

| Capa | Responsabilidad |
|------|-----------------|
| `services/` | Realiza las peticiones HTTP (fetch) hacia la API. |
| `ui/` | Pinta los datos en el DOM (tablas, selectores). |
| `views/` | Enlaza los eventos y orquesta services + ui. |
| `utils/` | Helpers genéricos (XSS, notificaciones, modales). |

---

## ✅ Requisitos previos

- **Node.js** 18 o superior (recomendado 20+).
- **Backend levantado** en `http://localhost:3000` (ver README del repositorio `Backend`).
- **Base de datos MySQL** configurada y con las tablas aplicadas (`inventario_adso`).

---

## 🚀 Instalación

```bash
# Paso 1. Instalar dependencias
npm install
```

## ⚙️ Configuración

Copia `.env.example` a `.env` y ajusta si es necesario:

```bash
cp .env.example .env
```

| Variable | Valor por defecto | Descripción |
|----------|-------------------|-------------|
| `VITE_API_BASE_URL` | `/api` | Prefijo de las peticiones a la API. |

En desarrollo, Vite redirige (proxy) las peticiones que empiezan por `/api`
hacia el backend en `http://localhost:3000` (configurado en `vite.config.js`),
eliminando el prefijo y evitando errores de CORS.

## ▶️ Ejecución

```bash
npm run dev       # servidor de desarrollo con recarga en caliente (http://localhost:5173)
npm run build     # genera la versión de producción en dist/
npm run preview   # sirve localmente el build generado
```

### Flujo completo de uso

1. Inicia el backend: en la carpeta `Backend` ejecuta `npm start` (puerto 3000).
2. Inicia el frontend: en la carpeta `Frontend` ejecuta `npm run dev`.
3. Abre `http://localhost:5173` en el navegador.
4. Usa las pestañas superiores para navegar entre los módulos.

---

## 🖥️ Cómo se usa cada módulo

### Inventario

- **Categorías:** escribe el nombre en el primer formulario y presiona
  **Agregar**. Edita o elimina desde las acciones de cada fila.
- **Productos:** llena el segundo formulario con **nombre, precio y categoría**
  (el código `PRD-NNN` y el stock se generan automáticamente) y presiona
  **Agregar**. Edita o elimina desde la tabla.

### Tareas

- Crea una tarea con **título, descripción y usuario asignado**.
- Cambia el estado entre `pendiente`, `en_progreso` y `completada`.
- Elimina la tarea cuando se haya resuelto.

### PQRS

- Selecciona el tipo de solicitud: `peticion`, `queja`, `reclamo` o `sugerencia`.
- Escribe la descripción y envía la solicitud.
- Gestiona su estado (`abierta`, `en_proceso`, `cerrada`) desde la tabla.

### Administración

- Muestra estadísticas globales del sistema: cantidad de **usuarios, tareas y PQRS**.

---

## 🗄️ Base de datos

La base `inventario_adso` es compartida con el backend. El script de creación
y los datos iniciales están en `Backend/project/database/schema.sql`.

---

## CENTRO DE DOCUMENTACIÓN (WIKI DEL PROYECTO)

Antes de escribir la primera línea de código o ejecutar un comando, es obligatorio revisar las guías de trabajo.

### Nivel 1. Sistema
**Ubicación:** `docs/01-guia-sistema/`
- Manuales técnicos: creación de Issues y Milestones

### Nivel 2. Metodología
**Ubicación:** `docs/02-guia-metodologia/`
- Reglas para reportar tareas y solicitar revisiones (PR)

### Nivel 3. Formatos
**Ubicación:** `docs/03-formatos-maestros/`
- Plantillas oficiales de documentos

---

## ROLES DE LA CÉLULA ÁGIL

### Líder (Arquitecto)

- **Responsabilidad:** Integridad del repositorio y control de calidad
- **Tareas en GitHub:**
  - Protección de ramas
  - Gestión de Milestones
  - Aprobación de Pull Requests

### Desarrollador (Albañil)

- **Responsabilidad:** Construcción de módulos y lógica
- **Tareas en GitHub:**
  - Desarrollo en ramas `feat/`
  - Reporte de avances
  - Solicitud de revisión técnica

### El "Por qué"

La división de roles evita duplicidad de tareas y establece una jerarquía clara de responsabilidad (segregación de funciones), esencial en equipos de alto rendimiento.

---

## METODOLOGÍA DE TRABAJO (GITFLOW PROFESIONAL)

El flujo de trabajo es el corazón de nuestra colaboración.
Está estrictamente prohibido hacer commits directos sobre las ramas `main` o `develop`.

### Paso 1. Sincronizar

```bash
git checkout develop
git pull origin develop
```

### Paso 2. Rama de Tarea

```bash
git checkout -b feat/nombre-tarea
```

### Paso 3. Desarrollo

Escribe código limpio y realiza commits descriptivos.

### Paso 4. Sincronización Final

```bash
git checkout develop
git pull origin develop
git checkout feat/nombre-tarea
git merge develop
```

### Paso 5. Solicitud de PR

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
