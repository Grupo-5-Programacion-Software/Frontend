/**
 * ==========================================================
 * VISTA DE USUARIOS (usersView.js)
 * ==========================================================
 *
 * Coordina el módulo de gestión de usuarios (acceso solo Admin):
 * - Carga la lista de usuarios desde la API.
 * - Enlaza el formulario de creación / actualización.
 * - Maneja edición y eliminación desde la tabla.
 *
 * Capas involucradas:
 * - services/usersApi.js -> peticiones HTTP.
 * - ui/usersUI.js        -> pintado de la tabla.
 * - utils/helpers.js     -> notificaciones, confirmaciones.
 */
import {
  obtenerUsuarios,
  obtenerUsuario,
  crearUsuario,
  actualizarUsuario,
  eliminarUsuario,
} from "../services/usersApi.js";
import { renderizarTablaUsuarios } from "../ui/usersUI.js";
import {
  mostrarNotificacion,
  mostrarConfirmacion,
  mostrarCargando,
} from "../utils/helpers.js";

let editingUserId = null;

/** Carga y pinta la lista de usuarios. */
async function cargarUsuarios() {
  mostrarCargando(true);
  try {
    const usuarios = await obtenerUsuarios();
    renderizarTablaUsuarios(usuarios);
  } catch (error) {
    mostrarNotificacion("Error al cargar usuarios: " + error.message);
  } finally {
    mostrarCargando(false);
  }
}

/** Enlaza el formulario de creación/actualización de usuarios. */
function setupFormulario() {
  document.getElementById("add-user").addEventListener("click", async () => {
    const name = document.getElementById("user-name").value.trim();
    const email = document.getElementById("user-email").value.trim();
    const password = document.getElementById("user-password").value;

    if (!name || !email) {
      return mostrarNotificacion("Nombre y correo electrónico son obligatorios");
    }

    try {
      if (editingUserId) {
        await actualizarUsuario(editingUserId, { name, email });
        editingUserId = null;
        document.getElementById("add-user").textContent = "Agregar";
        mostrarNotificacion("Usuario actualizado correctamente", "exito");
      } else {
        await crearUsuario({ name, email, password: password || "cambiar123" });
        mostrarNotificacion("Usuario creado correctamente", "exito");
      }
      document.getElementById("user-name").value = "";
      document.getElementById("user-email").value = "";
      document.getElementById("user-password").value = "";
      await cargarUsuarios();
    } catch (error) {
      mostrarNotificacion(error.message);
    }
  });
}

/** Enlaza las acciones de editar/eliminar usuarios de la tabla. */
function setupTabla() {
  document.getElementById("users-body").addEventListener("click", async (e) => {
    const button = e.target.closest("button");
    if (!button) return;
    const id = Number(button.dataset.id);

    if (button.classList.contains("edit")) {
      try {
        const usuario = await obtenerUsuario(id);
        editingUserId = id;
        document.getElementById("user-name").value = usuario.name;
        document.getElementById("user-email").value = usuario.email;
        document.getElementById("add-user").textContent = "Actualizar";
      } catch (error) {
        mostrarNotificacion("Error al obtener usuario: " + error.message);
      }
    }

    if (button.classList.contains("delete")) {
      const confirmado = await mostrarConfirmacion("¿Eliminar usuario?");
      if (!confirmado) return;
      try {
        await eliminarUsuario(id);
        mostrarNotificacion("Usuario eliminado correctamente", "exito");
        await cargarUsuarios();
      } catch (error) {
        mostrarNotificacion(error.message);
      }
    }
  });
}

/** Punto de entrada del módulo: enlaza eventos y carga datos. */
export function initUsersView() {
  setupFormulario();
  setupTabla();
  cargarUsuarios();
}
