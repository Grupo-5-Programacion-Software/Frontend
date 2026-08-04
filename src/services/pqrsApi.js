/**
 * ==========================================================
 * SERVICIO DE PQRS (pqrsApi.js)
 * ==========================================================
 *
 * Centraliza las peticiones HTTP relacionadas con las
 * solicitudes PQRS (Peticiones, Quejas, Reclamos y
 * Sugerencias).
 *
 * Funcionalidades:
 * - CRUD de solicitudes.
 * - Cambio de estado (PATCH) para el seguimiento de la PQRS.
 */
import { get, post, patch, del } from "./api.js";

/** Obtiene todas las solicitudes PQRS registradas. */
export const obtenerPqrs = () => get("/pqrs").then((j) => j.data);

/** Consulta una solicitud específica por su identificador. */
export const obtenerPqrsPorId = (id) => get(`/pqrs/${id}`).then((j) => j.data);

/** Crea una nueva solicitud PQRS. */
export const crearPqrs = (pqrsData) =>
  post("/pqrs", pqrsData).then((j) => j.data);

/** Actualiza parcialmente una solicitud (p. ej. su estado). */
export const actualizarPqrs = (id, pqrsData) =>
  patch(`/pqrs/${id}`, pqrsData).then((j) => j.data);

/** Elimina una solicitud según su identificador. */
export const eliminarPqrs = (id) => del(`/pqrs/${id}`);
