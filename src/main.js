/**
 * ==========================================================
 * PUNTO DE ENTRADA DE LA APLICACIÓN (main.js)
 * ==========================================================
 *
 * Es el arranque del frontend empaquetado con Vite.
 *
 * Responsabilidades:
 * - Importar los estilos globales (lo hace Vite en el build).
 * - Configurar el sistema de pestañas (tabs) de navegación.
 * - Inicializar cada vista cuando el DOM está listo.
 *
 * Arquitectura (separación de responsabilidades):
 * - `views/`   -> coordina eventos y orquesta las otras capas.
 * - `services/`-> habla con la API (fetch).
 * - `ui/`      -> pinta en el DOM.
 * - `utils/`   -> funciones auxiliares reutilizables.
 */
import "./style.css";
import { initInventoryView } from "./views/inventoryView.js";
import { initTasksView } from "./views/tasksView.js";
import { initPqrsView } from "./views/pqrsView.js";
import { initAdminView } from "./views/adminView.js";

/**
 * Configura la navegación por pestañas.
 * Cada botón `.tab` muestra la sección cuyo id coincide con
 * su atributo `data-tab` (ej. "tasks" -> #tasks-section).
 */
function setupTabs() {
  document.querySelectorAll(".tab").forEach((tab) => {
    tab.addEventListener("click", () => {
      document.querySelectorAll(".tab").forEach((t) => t.classList.remove("active"));
      document.querySelectorAll(".section").forEach((s) => s.classList.remove("active"));
      tab.classList.add("active");
      document.getElementById(`${tab.dataset.tab}-section`).classList.add("active");
    });
  });
}

// Esperamos a que el DOM esté cargado para enlazar los eventos.
document.addEventListener("DOMContentLoaded", () => {
  setupTabs();
  initInventoryView();
  initTasksView();
  initPqrsView();
  initAdminView();
});
