/**
 * ==========================================================
 * VISTA DE AUTENTICACIÓN (authView.js)
 * ==========================================================
 *
 * Coordina la pantalla de inicio de sesión:
 * - Enlaza el formulario de login.
 * - Enlaza el botón de cerrar sesión.
 * - Alterna entre la vista de login y la aplicación.
 * - Muestra el usuario activo en la barra superior.
 *
 * Capas involucradas:
 * - services/auth.js -> validación simulada y sesión.
 * - utils/helpers.js -> notificaciones.
 */
import {
  iniciarSesion,
  cerrarSesion,
  obtenerSesion,
} from "../services/auth.js";
import { mostrarNotificacion } from "../utils/helpers.js";

/**
 * Muestra la pantalla de login y oculta la aplicación.
 */
export function mostrarLogin() {
  document.getElementById("login-section").classList.add("active");
  document.getElementById("app").classList.add("oculto");
}

/**
 * Oculta la pantalla de login y muestra la aplicación.
 */
export function ocultarLogin() {
  document.getElementById("login-section").classList.remove("active");
  document.getElementById("app").classList.remove("oculto");
}

/**
 * Pinta el nombre y rol del usuario activo en el header.
 */
export function renderizarUsuarioSesion() {
  const sesion = obtenerSesion();
  const nombreEl = document.getElementById("user-name");
  const rolEl = document.getElementById("user-role");

  if (sesion) {
    nombreEl.textContent = sesion.name;
    rolEl.textContent = sesion.role;
    document.getElementById("user-info").style.display = "flex";
  } else {
    document.getElementById("user-info").style.display = "none";
  }
}

/**
 * Enlaza el formulario de login.
 * @param {Function} onExito Callback tras iniciar sesión correctamente.
 */
function setupFormularioLogin(onExito) {
  document.getElementById("login-btn").addEventListener("click", () => {
    const email = document.getElementById("login-email").value;
    const password = document.getElementById("login-password").value;

    if (!email || !password) {
      return mostrarNotificacion("Ingrese correo y contraseña");
    }

    try {
      iniciarSesion(email, password);
      renderizarUsuarioSesion();
      ocultarLogin();
      onExito();
    } catch (error) {
      mostrarNotificacion(error.message);
    }
  });
}

/**
 * Enlaza el botón de cerrar sesión.
 * @param {Function} onSalida Callback tras cerrar sesión.
 */
function setupBotonSalir(onSalida) {
  document.getElementById("logout-btn").addEventListener("click", () => {
    cerrarSesion();
    renderizarUsuarioSesion();
    mostrarLogin();
    onSalida();
  });
}

/**
 * Punto de entrada del módulo: enlaza login y logout.
 * @param {object} acciones Callbacks de éxito de login y de salida.
 */
export function initAuthView(acciones = {}) {
  setupFormularioLogin(acciones.onLogin);
  setupBotonSalir(acciones.onLogout);
  renderizarUsuarioSesion();
}
