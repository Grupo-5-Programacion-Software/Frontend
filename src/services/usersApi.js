/**
 * ==========================================================
 * SERVICIO DE USUARIOS (usersApi.js)
 * ==========================================================
 *
 * Centraliza las peticiones HTTP relacionadas con la gestión
 * de usuarios del sistema. Los usuarios son el recurso base
 * para la asignación de tareas.
 *
 * Funcionalidades:
 * - CRUD completo de usuarios (create, read, update, delete).
 */
import { get, post, put, del } from "./api.js";

/** Obtiene todos los usuarios registrados en el servidor. */
export const obtenerUsuarios = () => get("/users").then((j) => j.data);

/** Consulta un usuario específico por su identificador. */
export const obtenerUsuario = (id) => get(`/users/${id}`).then((j) => j.data);

/** Registra un nuevo usuario en el servidor. */
export const crearUsuario = (userData) =>
  post("/users", userData).then((j) => j.data);

/** Actualiza la información de un usuario existente. */
export const actualizarUsuario = (id, userData) =>
  put(`/users/${id}`, userData).then((j) => j.data);

/** Elimina un usuario según su identificador. */
export const eliminarUsuario = (id) => del(`/users/${id}`);
