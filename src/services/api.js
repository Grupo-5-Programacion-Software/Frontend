/**
 * ==========================================================
 * CAPA DE TRANSPORTE HTTP (api.js)
 * ==========================================================
 *
 * Unifica todas las peticiones fetch hacia el backend.
 *
 * El backend responde siempre con el mismo contrato:
 *   { success: boolean, message: string, data: [], errors: [] }
 *
 * Comportamiento:
 * - Si la respuesta es 4xx/5xx o `success === false`, lanza
 *   un Error con el mensaje legible para mostrarlo en la UI.
 * - Si todo sale bien, devuelve el JSON completo para que la
 *   capa de servicios extraiga `data`.
 *
 * Así ningún módulo de la interfaz depende de cómo se hace el
 * fetch: solo importa funciones verbosas (get, post, put...).
 */
import { API_BASE_URL } from "./config.js";

/**
 * Ejecuta una petición HTTP genérica.
 * @param {string} path Ruta relativa del recurso (ej. "/tasks").
 * @param {object} options Opciones de fetch (method, body, ...).
 * @returns {Promise<object>} El JSON de respuesta del backend.
 * @throws {Error} Si la petición falla a nivel de red o HTTP.
 */
async function request(path, options = {}) {
  const response = await fetch(`${API_BASE_URL}${path}`, {
    headers: { "Content-Type": "application/json" },
    ...options,
  });

  const json = await response.json().catch(() => ({}));

  if (!response.ok || json.success === false) {
    const mensaje =
      json.message || json.errors?.[0] || `Error HTTP ${response.status}`;
    throw new Error(mensaje);
  }

  return json;
}

/** GET: consulta un recurso. */
export const get = (path) => request(path);

/** POST: crea un recurso enviando el cuerpo en JSON. */
export const post = (path, body) =>
  request(path, { method: "POST", body: JSON.stringify(body) });

/** PUT: actualiza un recurso de forma completa. */
export const put = (path, body) =>
  request(path, { method: "PUT", body: JSON.stringify(body) });

/** PATCH: actualiza un recurso de forma parcial. */
export const patch = (path, body) =>
  request(path, { method: "PATCH", body: JSON.stringify(body) });

/** DELETE: elimina un recurso. */
export const del = (path) => request(path, { method: "DELETE" });
