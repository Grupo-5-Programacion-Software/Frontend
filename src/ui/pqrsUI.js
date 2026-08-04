/**
 * ==========================================================
 * MÓDULO DE INTERFAZ DE PQRS (pqrsUI.js)
 * ==========================================================
 *
 * Renderiza la tabla de solicitudes PQRS. El estado de cada
 * solicitud se controla con un <select> para actualizarla
 * directamente desde la tabla.
 */
import { escaparHTML } from "../utils/helpers.js";

/** Etiquetas legibles para cada tipo de solicitud. */
export const TIPOS_PQRS = {
  peticion: "Petición",
  queja: "Queja",
  reclamo: "Reclamo",
  sugerencia: "Sugerencia",
};

/** Etiquetas legibles para cada estado de una solicitud. */
export const ESTADOS_PQRS = {
  abierta: "Abierta",
  en_proceso: "En proceso",
  cerrada: "Cerrada",
};

/** Renderiza la tabla de solicitudes PQRS. */
export function renderizarTablaPqrs(pqrs) {
  const tbody = document.getElementById("pqrs-body");
  tbody.innerHTML = "";
  pqrs.forEach((solicitud) => {
    tbody.innerHTML += `
      <tr>
        <td>${solicitud.id}</td>
        <td>${TIPOS_PQRS[solicitud.type] || solicitud.type}</td>
        <td>${escaparHTML(solicitud.description)}</td>
        <td>
          <select class="pqrs-status" data-id="${solicitud.id}">
            ${Object.entries(ESTADOS_PQRS)
              .map(
                ([valor, etiqueta]) =>
                  `<option value="${valor}" ${solicitud.status === valor ? "selected" : ""}>${etiqueta}</option>`
              )
              .join("")}
          </select>
        </td>
        <td class="actions">
          <button class="delete" data-id="${solicitud.id}">Eliminar</button>
        </td>
      </tr>`;
  });
}
