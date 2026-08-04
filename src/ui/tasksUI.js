/**
 * ==========================================================
 * MÓDULO DE INTERFAZ DE TAREAS (tasksUI.js)
 * ==========================================================
 *
 * Renderiza la tabla de tareas y el selector de usuarios del
 * formulario. Los estados de cada tarea se muestran mediante
 * un <select> que permite cambiarlos sin recargar la página.
 *
 * Este módulo es el que faltaba en la versión anterior: antes
 * solo se registraban las tareas en consola.
 */
import { escaparHTML } from "../utils/helpers.js";

/** Etiquetas legibles para cada estado de tarea. */
export const ESTADOS_TAREA = {
  pendiente: "Pendiente",
  en_progreso: "En progreso",
  completada: "Completada",
};

/**
 * Renderiza la tabla de tareas con el nombre del usuario asignado.
 * @param {Array} tareas Tareas obtenidas de la API.
 * @param {Array} usuarios Usuarios para traducir `userId` a nombre.
 */
export function renderizarTablaTareas(tareas, usuarios) {
  const userMap = {};
  usuarios.forEach((u) => (userMap[u.id] = u.name));

  const tbody = document.getElementById("tasks-body");
  tbody.innerHTML = "";
  tareas.forEach((tarea) => {
    tbody.innerHTML += `
      <tr>
        <td>${tarea.id}</td>
        <td>${escaparHTML(tarea.title)}</td>
        <td>${escaparHTML(tarea.description || "")}</td>
        <td>
          <select class="task-status" data-id="${tarea.id}">
            ${Object.entries(ESTADOS_TAREA)
              .map(
                ([valor, etiqueta]) =>
                  `<option value="${valor}" ${tarea.status === valor ? "selected" : ""}>${etiqueta}</option>`
              )
              .join("")}
          </select>
        </td>
        <td>${escaparHTML(userMap[tarea.userId] || "Sin asignar")}</td>
        <td class="actions">
          <button class="edit" data-id="${tarea.id}">Editar</button>
          <button class="delete" data-id="${tarea.id}">Eliminar</button>
        </td>
      </tr>`;
  });
}

/** Llena el selector de usuarios del formulario de tareas. */
export function cargarSelectUsuarios(usuarios) {
  const select = document.getElementById("task-user");
  select.innerHTML = '<option value="">Asignar a usuario</option>';
  usuarios.forEach((u) => {
    select.innerHTML += `<option value="${u.id}">${escaparHTML(u.name)}</option>`;
  });
}
