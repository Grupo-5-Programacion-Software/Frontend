/**
 * ==========================================================
 * MÓDULO DE INTERFAZ DE TAREAS (tasksUI.js)
 * ==========================================================
 *
 * Renderiza la tabla de tareas y los selectores de usuarios:
 * - El selector del formulario (asignar usuario al crear/editar).
 * - El selector del filtro de la tabla (filtrar por usuario).
 * Los estados de cada tarea se muestran mediante un <select>
 * que permite cambiarlos sin recargar la página.
 *
 * Este módulo es el que faltaba en la versión anterior: antes
 * solo se registraban las tareas en consola.
 */
import { escaparHTML } from "../utils/helpers.js";

/** Etiquetas legibles para cada estado de tarea. */
export const ESTADOS_TAREA = {
  // Estado pendiente: la tarea aún no ha comenzado.
  pendiente: "Pendiente",
  // Estado en progreso: la tarea está en ejecución.
  en_progreso: "En progreso",
  // Estado completada: la tarea terminó.
  completada: "Completada",
};

/**
 * Renderiza la tabla de tareas con el nombre del usuario asignado.
 * @param {Array} tareas Tareas obtenidas de la API (ya filtradas si hay filtros activos).
 * @param {Array} usuarios Usuarios para traducir `userId` a nombre.
 */
export function renderizarTablaTareas(tareas, usuarios) {
  // Construye un mapa id -> nombre para traducir userId a texto.
  const userMap = {};
  usuarios.forEach((u) => (userMap[u.id] = u.name));

  // Obtiene el cuerpo de la tabla y lo vacía antes de volver a pintar.
  const tbody = document.getElementById("tasks-body");
  tbody.innerHTML = "";
  // Genera una fila <tr> por cada tarea recibida.
  tareas.forEach((tarea) => {
    // Cada fila incluye: id, título, descripción, select de estado,
    // nombre del usuario asignado y botones de acción.
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

/**
 * Llena el selector de usuarios del formulario de tareas.
 * (Usado al crear o editar una tarea para asignarle un usuario.)
 * @param {Array} usuarios Lista de usuarios de la API.
 */
export function cargarSelectUsuarios(usuarios) {
  const select = document.getElementById("task-user");
  // Resetea el selector dejando solo la opción vacía por defecto.
  select.innerHTML = '<option value="">Asignar a usuario</option>';
  // Agrega una opción por cada usuario (el id como valor y el nombre como texto).
  usuarios.forEach((u) => {
    select.innerHTML += `<option value="${u.id}">${escaparHTML(u.name)}</option>`;
  });
}

/**
 * Llena el selector de filtro por usuario asignado.
 * Conserva la opción previamente seleccionada para que el
 * filtro no se reinicie cuando se recargan las tareas.
 * @param {Array} usuarios Lista de usuarios de la API.
 */
export function cargarSelectFiltroUsuarios(usuarios) {
  // Obtiene el select de filtro por usuario de la barra de filtros.
  const select = document.getElementById("filter-task-user");
  // Guarda el valor elegido por el usuario antes de reconstruir las opciones.
  const seleccionAnterior = select.value;
  // Resetea el selector dejando solo la opción "Todos los usuarios".
  select.innerHTML = '<option value="">Todos los usuarios</option>';
  // Agrega una opción por cada usuario para poder filtrar por él.
  usuarios.forEach((u) => {
    select.innerHTML += `<option value="${u.id}">${escaparHTML(u.name)}</option>`;
  });
  // Si había un usuario seleccionado, lo restaura para no perder el filtro.
  if (seleccionAnterior) {
    select.value = seleccionAnterior;
  }
}
