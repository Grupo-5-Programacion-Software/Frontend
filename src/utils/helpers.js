/**
 * ==========================================================
 * MÓDULO DE FUNCIONES AUXILIARES (helpers.js)
 * ==========================================================
 *
 * Reúne funciones reutilizables que apoyan el funcionamiento
 * de la interfaz de usuario:
 *
 * - escaparHTML: previene inyección de código (XSS) al pintar
 *   texto traído de la API.
 * - mostrarNotificacion: avisos temporales al usuario.
 * - mostrarConfirmacion: diálogo sí/no antes de acciones.
 * - mostrarCargando: indicador de carga mientras se procesa.
 *
 * Estas funciones pueden usarse desde cualquier vista.
 */

/** Escapa caracteres especiales para convertirlos en texto seguro. */
export function escaparHTML(texto) {
  return String(texto).replace(/[&<>"']/g, (c) => ({
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#39;",
  })[c]);
}

/** Muestra un mensaje temporal en la esquina superior derecha. */
export function mostrarNotificacion(mensaje, tipo = "error") {
  const container =
    document.getElementById("notificaciones") || crearContenedorNotificaciones();
  const notificacion = document.createElement("div");
  notificacion.className = `notificacion notificacion-${tipo}`;
  notificacion.textContent = mensaje;
  container.appendChild(notificacion);
  setTimeout(() => notificacion.remove(), 3000);
}

/** Crea (una sola vez) el contenedor de notificaciones. */
function crearContenedorNotificaciones() {
  const div = document.createElement("div");
  div.id = "notificaciones";
  document.body.appendChild(div);
  return div;
}

/**
 * Pide confirmación al usuario antes de una acción destructiva.
 * @param {string} mensaje Texto de la pregunta.
 * @returns {Promise<boolean>} Resuelve `true` si se confirma.
 */
export function mostrarConfirmacion(mensaje) {
  return new Promise((resolve) => {
    const overlay = document.createElement("div");
    overlay.className = "modal-overlay";
    overlay.innerHTML = `
      <div class="modal-confirmacion">
        <p></p>
        <div class="modal-acciones">
          <button class="btn-cancelar">Cancelar</button>
          <button class="btn-confirmar">Eliminar</button>
        </div>
      </div>`;
    overlay.querySelector("p").textContent = mensaje;
    document.body.appendChild(overlay);

    overlay.querySelector(".btn-confirmar").onclick = () => {
      overlay.remove();
      resolve(true);
    };
    overlay.querySelector(".btn-cancelar").onclick = () => {
      overlay.remove();
      resolve(false);
    };
    overlay.addEventListener("click", (e) => {
      if (e.target === overlay) {
        overlay.remove();
        resolve(false);
      }
    });
  });
}

/** Muestra u oculta el indicador de carga de pantalla. */
export function mostrarCargando(mostrar = true) {
  let spinner = document.getElementById("loading-spinner");
  if (mostrar) {
    if (!spinner) {
      spinner = document.createElement("div");
      spinner.id = "loading-spinner";
      spinner.className = "loading-spinner";
      spinner.innerHTML = '<div class="spinner"></div>';
      document.body.appendChild(spinner);
    }
    spinner.style.display = "flex";
  } else if (spinner) {
    spinner.style.display = "none";
  }
}
