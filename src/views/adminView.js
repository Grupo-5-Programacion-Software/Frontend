/**
 * ==========================================================
 * VISTA DEL PANEL ADMINISTRATIVO (adminView.js)
 * ==========================================================
 *
 * Coordina el panel administrativo:
 * - Solicita al backend las estadísticas globales.
 * - Las pinta en las tarjetas del panel.
 *
 * Nota: si el backend no está disponible se muestra una
 * notificación, pero no se bloquea el resto de la app.
 */
import { get } from "../services/api.js";
import { renderizarEstadisticas } from "../ui/adminUI.js";
import { mostrarNotificacion } from "../utils/helpers.js";

/** Carga y pinta las estadísticas del sistema. */
async function cargarEstadisticas() {
  try {
    const json = await get("/admin/stats");
    renderizarEstadisticas(json.data);
  } catch (error) {
    mostrarNotificacion("Error al cargar estadísticas: " + error.message);
  }
}

/** Punto de entrada del módulo: carga los datos. */
export function initAdminView() {
  cargarEstadisticas();
}
