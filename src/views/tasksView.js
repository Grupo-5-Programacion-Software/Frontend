/**
 * ==========================================================
 * VISTA DE TAREAS (tasksView.js)
 * ==========================================================
 *
 * Coordina el módulo de gestión de tareas:
 * - Carga tareas y usuarios para poblar la tabla y el select.
 * - Enlaza el formulario (crear / actualizar tarea).
 * - Permite cambiar el estado de la tarea desde la tabla.
 * - Maneja edición y eliminación.
 */
import {
  obtenerTareas,
  obtenerTarea,
  crearTarea,
  actualizarTarea,
  cambiarEstadoTarea,
  eliminarTarea,
} from "../services/tasksApi.js";
import { obtenerUsuarios } from "../services/usersApi.js";
import {
  renderizarTablaTareas,
  cargarSelectUsuarios,
  cargarSelectFiltroUsuarios,
} from "../ui/tasksUI.js";
import {
  mostrarNotificacion,
  mostrarConfirmacion,
  mostrarCargando,
} from "../utils/helpers.js";

let editingTaskId = null;
let todasLasTareas = [];
let usuariosCargados = [];

/**
 * Aplica los filtros de estado y usuario asignado sobre las
 * tareas cargadas y vuelve a pintar la tabla con el resultado.
 */
function aplicarFiltros() {
  const estado = document.getElementById("filter-task-status").value;
  const usuarioId = document.getElementById("filter-task-user").value;

  const tareasFiltradas = todasLasTareas.filter((tarea) => {
    const cumpleEstado = !estado || tarea.status === estado;
    const cumpleUsuario =
      !usuarioId || String(tarea.userId) === String(usuarioId);
    return cumpleEstado && cumpleUsuario;
  });

  renderizarTablaTareas(tareasFiltradas, usuariosCargados);
}

/** Carga tareas y usuarios, y refresca la vista completa. */
async function cargarTareas() {
  mostrarCargando(true);
  try {
    const [tareas, usuarios] = await Promise.all([
      obtenerTareas(),
      obtenerUsuarios(),
    ]);
    todasLasTareas = tareas;
    usuariosCargados = usuarios;
    cargarSelectUsuarios(usuarios);
    cargarSelectFiltroUsuarios(usuarios);
    aplicarFiltros();
  } catch (error) {
    mostrarNotificacion("Error al cargar tareas: " + error.message);
  } finally {
    mostrarCargando(false);
  }
}

/** Enlaza los filtros de la tabla (estado y usuario asignado). */
function setupFiltros() {
  document.getElementById("filter-task-status").addEventListener("change", aplicarFiltros);
  document.getElementById("filter-task-user").addEventListener("change", aplicarFiltros);
}

/** Enlaza el formulario de creación/actualización de tareas. */
function setupFormulario() {
  document.getElementById("add-task").addEventListener("click", async () => {
    const title = document.getElementById("task-title").value.trim();
    const description = document.getElementById("task-description").value.trim();
    const userId = document.getElementById("task-user").value;

    if (!title) {
      return mostrarNotificacion("El título de la tarea es obligatorio");
    }
    if (!userId) {
      return mostrarNotificacion("Debe asignar la tarea a un usuario");
    }

    const taskData = { title, description, userId: Number(userId) };

    try {
      if (editingTaskId) {
        await actualizarTarea(editingTaskId, taskData);
        editingTaskId = null;
        document.getElementById("add-task").textContent = "Agregar";
        mostrarNotificacion("Tarea actualizada correctamente", "exito");
      } else {
        await crearTarea(taskData);
        mostrarNotificacion("Tarea creada correctamente", "exito");
      }
      document.getElementById("task-title").value = "";
      document.getElementById("task-description").value = "";
      document.getElementById("task-user").value = "";
      await cargarTareas();
    } catch (error) {
      mostrarNotificacion(error.message);
    }
  });
}

/** Enlaza las acciones de editar/eliminar y el cambio de estado. */
function setupTabla() {
  const tbody = document.getElementById("tasks-body");

  tbody.addEventListener("click", async (e) => {
    const button = e.target.closest("button");
    if (!button) return;
    const id = Number(button.dataset.id);

    if (button.classList.contains("edit")) {
      try {
        const tarea = await obtenerTarea(id);
        editingTaskId = id;
        document.getElementById("task-title").value = tarea.title;
        document.getElementById("task-description").value = tarea.description || "";
        document.getElementById("task-user").value = tarea.userId;
        document.getElementById("add-task").textContent = "Actualizar";
      } catch (error) {
        mostrarNotificacion("Error al obtener tarea: " + error.message);
      }
    }

    if (button.classList.contains("delete")) {
      const confirmado = await mostrarConfirmacion("¿Eliminar tarea?");
      if (!confirmado) return;
      try {
        await eliminarTarea(id);
        mostrarNotificacion("Tarea eliminada correctamente", "exito");
        await cargarTareas();
      } catch (error) {
        mostrarNotificacion(error.message);
      }
    }
  });

  // Cambio de estado de la tarea desde el <select> de la fila.
  tbody.addEventListener("change", async (e) => {
    const select = e.target.closest(".task-status");
    if (!select) return;
    try {
      await cambiarEstadoTarea(Number(select.dataset.id), {
        status: select.value,
      });
      mostrarNotificacion("Estado de la tarea actualizado", "exito");
    } catch (error) {
      mostrarNotificacion(error.message);
      await cargarTareas();
    }
  });
}

/** Punto de entrada del módulo: enlaza eventos y carga datos. */
export function initTasksView() {
  setupFormulario();
  setupTabla();
  setupFiltros();
  cargarTareas();
}
