/**
 * ==========================================================
 * PUNTO DE ENTRADA DE LA APLICACIÓN (main.js)
 * ==========================================================
 *
 * Es el arranque del frontend empaquetado con Vite.
 *
 * Responsabilidades:
 * - Importar los estilos globales (lo hace Vite en el build).
 * - Mostrar la pantalla de login o la app según la sesión.
 * - Filtrar las pestañas visibles según el rol del usuario.
 * - Configurar el sistema de pestañas (tabs) de navegación.
 * - Inicializar cada vista cuando el DOM está listo.
 *
 * Arquitectura (separación de responsabilidades):
 * - `views/`   -> coordina eventos y orquesta las otras capas.
 * - `services/`-> habla con la API (fetch) y la autenticación.
 * - `ui/`      -> pinta en el DOM.
 * - `utils/`   -> funciones auxiliares reutilizables.
 */
import "./style.css";
import { initInventoryView } from "./views/inventoryView.js";
import { initTasksView } from "./views/tasksView.js";
import { initPqrsView } from "./views/pqrsView.js";
import { initAdminView } from "./views/adminView.js";
import { initAuthView, mostrarLogin, ocultarLogin } from "./views/authView.js";
import { obtenerSesion, tieneAcceso } from "./services/auth.js";

/** Mapa de las funciones de inicialización por pestaña. */
const INIT_VIEWS = {
  inventory: initInventoryView,
  tasks: initTasksView,
  pqrs: initPqrsView,
  admin: initAdminView,
};

/**
 * Muestra solo las pestañas permitidas según el rol actual
 * y activa la primera de ellas.
 */
function filtrarPestanasPorRol() {
  let primerTabVisible = null;

  document.querySelectorAll(".tab").forEach((tab) => {
    const permitido = tieneAcceso(tab.dataset.tab);
    tab.style.display = permitido ? "" : "none";
    tab.classList.remove("active");
    if (permitido && !primerTabVisible) {
      primerTabVisible = tab;
    }
  });

  document.querySelectorAll(".section").forEach((s) => s.classList.remove("active"));

  if (primerTabVisible) {
    primerTabVisible.classList.add("active");
    document
      .getElementById(`${primerTabVisible.dataset.tab}-section`)
      .classList.add("active");
  }
}

/**
 * Inicializa únicamente los módulos cuyas pestañas son visibles
 * para el rol autenticado.
 */
function iniciarVistasPermitidas() {
  Object.entries(INIT_VIEWS).forEach(([tab, init]) => {
    if (tieneAcceso(tab)) {
      init();
    }
  });
}

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

let appInicializada = false;

/**
 * Arranca la aplicación una vez que el usuario inició sesión.
 * La primera vez configura los tabs e inicializa las vistas;
 * en accesos posteriores solo re-filtra las pestañas por rol.
 */
function arrancarApp() {
  filtrarPestanasPorRol();

  if (!appInicializada) {
    setupTabs();
    iniciarVistasPermitidas();
    appInicializada = true;
  }
}

/**
 * Decide entre mostrar la pantalla de login o arrancar la app.
 */
function inicializar() {
  initAuthView({
    onLogin: arrancarApp,
    onLogout: () => {},
  });

  if (obtenerSesion()) {
    ocultarLogin();
    arrancarApp();
  } else {
    mostrarLogin();
  }
}

// Esperamos a que el DOM esté cargado para enlazar los eventos.
document.addEventListener("DOMContentLoaded", inicializar);
