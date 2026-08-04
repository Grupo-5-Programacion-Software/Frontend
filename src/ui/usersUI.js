/**
 * ==========================================================
 * MÓDULO DE INTERFAZ DE USUARIOS (usersUI.js)
 * ==========================================================
 *
 * Contiene la función que actualiza el DOM del módulo de
 * usuarios: la tabla con el listado registrado.
 *
 * Esta función NO realiza peticiones HTTP: solo recibe los
 * datos y los pinta. La comunicación con la API la hace la
 * capa de servicios.
 */
import { escaparHTML } from "../utils/helpers.js";

/** Formatea la fecha de registro a un formato corto local. */
function formatearFecha(fecha) {
  if (!fecha) return "-";
  const fechaObj = new Date(fecha);
  if (isNaN(fechaObj.getTime())) return escaparHTML(fecha);
  return fechaObj.toLocaleDateString("es-CO");
}

/** Muestra en la tabla todos los usuarios registrados. */
export function renderizarTablaUsuarios(usuarios) {
  const tbody = document.getElementById("users-body");
  tbody.innerHTML = "";
  usuarios.forEach((usuario) => {
    tbody.innerHTML += `
      <tr>
        <td>${usuario.id}</td>
        <td>${escaparHTML(usuario.name)}</td>
        <td>${escaparHTML(usuario.email)}</td>
        <td>${formatearFecha(usuario.createdAt)}</td>
        <td class="actions">
          <button class="edit" data-id="${usuario.id}" data-name="${escaparHTML(usuario.name)}" data-email="${escaparHTML(usuario.email)}">Editar</button>
          <button class="delete" data-id="${usuario.id}">Eliminar</button>
        </td>
      </tr>`;
  });
}
