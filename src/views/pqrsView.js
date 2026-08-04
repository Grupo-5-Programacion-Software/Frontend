/**
 * ==========================================================
 * VISTA DE PQRS (pqrsView.js)
 * ==========================================================
 *
 * Coordina el módulo de solicitudes PQRS:
 * - Carga las solicitudes y las pinta en la tabla.
 * - Enlaza el formulario de creación.
 * - Permite cambiar el estado de la solicitud desde la tabla.
 * - Maneja la eliminación con confirmación.
 */
import {
  obtenerPqrs,
  crearPqrs,
  actualizarPqrs,
  eliminarPqrs,
} from "../services/pqrsApi.js";
import { renderizarTablaPqrs } from "../ui/pqrsUI.js";
import {
  mostrarNotificacion,
  mostrarConfirmacion,
  mostrarCargando,
} from "../utils/helpers.js";

/** Carga las solicitudes y refresca la tabla. */
async function cargarPqrs() {
  mostrarCargando(true);
  try {
    const pqrs = await obtenerPqrs();
    renderizarTablaPqrs(pqrs);
  } catch (error) {
    mostrarNotificacion("Error al cargar PQRS: " + error.message);
  } finally {
    mostrarCargando(false);
  }
}

/** Enlaza el formulario de creación de solicitudes. */
function setupFormulario() {
  document.getElementById("add-pqrs").addEventListener("click", async () => {
    const type = document.getElementById("pqrs-type").value;
    const description = document.getElementById("pqrs-description").value.trim();

    if (!description) {
      return mostrarNotificacion("Debe describir su solicitud");
    }

    try {
      await crearPqrs({ type, description });
      mostrarNotificacion("Solicitud enviada correctamente", "exito");
      document.getElementById("pqrs-description").value = "";
      await cargarPqrs();
    } catch (error) {
      mostrarNotificacion(error.message);
    }
  });
}

/** Enlaza el cambio de estado y la eliminación en la tabla. */
function setupTabla() {
  const tbody = document.getElementById("pqrs-body");

  tbody.addEventListener("click", async (e) => {
    const button = e.target.closest("button");
    if (!button) return;
    const id = Number(button.dataset.id);

    if (button.classList.contains("delete")) {
      const confirmado = await mostrarConfirmacion("¿Eliminar solicitud?");
      if (!confirmado) return;
      try {
        await eliminarPqrs(id);
        mostrarNotificacion("Solicitud eliminada correctamente", "exito");
        await cargarPqrs();
      } catch (error) {
        mostrarNotificacion(error.message);
      }
    }
  });

  // Cambio de estado de la solicitud desde el <select> de la fila.
  tbody.addEventListener("change", async (e) => {
    const select = e.target.closest(".pqrs-status");
    if (!select) return;
    try {
      await actualizarPqrs(Number(select.dataset.id), { status: select.value });
      mostrarNotificacion("Estado de la solicitud actualizado", "exito");
    } catch (error) {
      mostrarNotificacion(error.message);
      await cargarPqrs();
    }
  });
}

/** Punto de entrada del módulo: enlaza eventos y carga datos. */
export function initPqrsView() {
  setupFormulario();
  setupTabla();
  cargarPqrs();
}
