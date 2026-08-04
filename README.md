# Frontend — Sistema Integral de Gestión

**Repositorio del frontend del proyecto.** SPA construida con **Vite + JavaScript (ES Modules)**
que consume la API REST del backend para gestionar inventario, tareas, PQRS y administración.

El código fuente activo y en desarrollo se encuentra en la rama [`develop`](../../tree/develop).

## Funcionalidades

- **Inventario**: CRUD de categorías y productos (código PRD-NNN autogenerado).
- **Tareas**: asignación a usuarios y cambio de estado (pendiente, en progreso, completada).
- **PQRS**: envío de solicitudes y seguimiento de estado.
- **Panel administrativo**: estadísticas globales del sistema.
- **Inicio de sesión por rol**: Admin, Inventario y Vendedor (simulado en el frontend).

## Tecnologías

- Vite 6 · JavaScript (ES Modules) · CSS propio
- Proxy `/api` → `http://localhost:3000` (sin errores CORS)

## Rama `main`

Esta rama contiene únicamente la documentación general del proyecto.
Para contribuciones, revisión de código y desarrollo, trabajar sobre la rama `develop`.

## Enlaces

- [Código fuente (develop)](../../tree/develop)
- [Backend API](https://github.com/Grupo-5-Programacion-Software/Backend)
- [Documentación general del proyecto](https://github.com/Grupo-5-Programacion-Software/.github)
- Última versión estable: `v2.1`
