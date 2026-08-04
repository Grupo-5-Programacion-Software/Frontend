/**
 * ==========================================================
 * MÓDULO DE INTERFAZ DEL PANEL ADMINISTRATIVO (adminUI.js)
 * ==========================================================
 *
 * Actualiza las tarjetas de estadísticas del panel admin con
 * los conteos que devuelve el backend.
 *
 * Únicamente manipula el DOM; los datos llegan desde la vista.
 */
/** Pinta los totales en las tarjetas del panel. */
export function renderizarEstadisticas(stats) {
  document.getElementById("stat-users").textContent = stats.users || 0;
  document.getElementById("stat-tasks").textContent = stats.tasks || 0;
  document.getElementById("stat-pqrs").textContent = stats.pqrs || 0;
}
