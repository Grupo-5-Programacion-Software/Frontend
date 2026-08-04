/**
 * ==========================================================
 * SERVICIO DE TAREAS (tasksApi.js)
 * ==========================================================
 *
 * Centraliza las peticiones HTTP relacionadas con la gestión
 * de tareas y su asignación a usuarios.
 *
 * NOTA DE CORRECCIÓN:
 * Este módulo reemplaza al antiguo `Cliente/js/api/tareasApi.js`,
 * que contenía un error de sintaxis: la función `crearUsuario`
 * estaba duplicada y con su llave de apertura cortada, lo que
 * impedía que el archivo se compilara. Aquí la lógica quedó
 * limpia, tipada y usando el wrapper `api.js`.
 *
 * Funcionalidades:
 * - CRUD completo de tareas.
 * - Actualización parcial (PATCH) para cambiar el estado.
 */
import { get, post, put, patch, del } from "./api.js";

/** Obtiene todas las tareas registradas. */
export const obtenerTareas = () => get("/tasks").then((j) => j.data);

/** Consulta una tarea específica por su identificador. */
export const obtenerTarea = (id) => get(`/tasks/${id}`).then((j) => j.data);

/** Crea una nueva tarea (title, description, userId). */
export const crearTarea = (taskData) =>
  post("/tasks", taskData).then((j) => j.data);

/** Actualiza los campos enviados de una tarea existente. */
export const actualizarTarea = (id, taskData) =>
  put(`/tasks/${id}`, taskData).then((j) => j.data);

/** Cambia parcialmente una tarea (p. ej. solo el estado). */
export const cambiarEstadoTarea = (id, taskData) =>
  patch(`/tasks/${id}`, taskData).then((j) => j.data);

/** Elimina una tarea según su identificador. */
export const eliminarTarea = (id) => del(`/tasks/${id}`);
