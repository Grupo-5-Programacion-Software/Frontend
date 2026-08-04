/**
 * ==========================================================
 * VISTA DE TAREAS (tasksView.js)
 * ==========================================================
 *
 * Coordina el módulo de gestión de tareas:
 * - Carga tareas y usuarios para poblar la tabla y el select.
 * - Aplica filtros de estado y usuario asignado sobre la tabla.
 * - Enlaza el formulario (crear / actualizar tarea).
 * - Permite cambiar el estado de la tarea desde la tabla.
 * - Maneja edición y eliminación.
 */

// Servicios HTTP de tareas: CRUD completo + cambio de estado (PATCH).
import {
  obtenerTareas,
  obtenerTarea,
  crearTarea,
  actualizarTarea,
  cambiarEstadoTarea,
  eliminarTarea,
} from "../services/tasksApi.js";
// Servicio de usuarios: se usa para poblar los selects (formulario y filtro).
import { obtenerUsuarios } from "../services/usersApi.js";
// Capa de interfaz: pinta la tabla y llena los selectores de usuarios.
import {
  renderizarTablaTareas,
  cargarSelectUsuarios,
  cargarSelectFiltroUsuarios,
} from "../ui/tasksUI.js";
// Utilidades reutilizables: avisos, confirmación y spinner de carga.
import {
  mostrarNotificacion,
  mostrarConfirmacion,
  mostrarCargando,
} from "../utils/helpers.js";

// ID de la tarea que está en modo edición (null = modo crear).
let editingTaskId = null;

// Copia completa de las tareas traídas de la API: sobre esta lista
// se aplican los filtros, sin necesidad de volver a pedir datos.
let todasLasTareas = [];

// Copia de los usuarios cargados: se pasa al render de la tabla para
// traducir cada userId a su nombre.
let usuariosCargados = [];

/**
 * Aplica los filtros de estado y usuario asignado sobre las
 * tareas cargadas y vuelve a pintar la tabla con el resultado.
 * Se ejecuta cada vez que el usuario cambia un filtro y también
 * después de cada recarga de datos (para que los filtros persistan).
 */
function aplicarFiltros() {
  // Lee el valor actual del select de estados ("", "pendiente", "en_progreso", "completada").
  const estado = document.getElementById("filter-task-status").value;
  // Lee el valor actual del select de usuarios ("" = todos, o el id del usuario).
  const usuarioId = document.getElementById("filter-task-user").value;

  // Recorre la lista completa y conserva solo las tareas que cumplan ambos criterios.
  const tareasFiltradas = todasLasTareas.filter((tarea) => {
    // Sin filtro de estado ("") toda tarea pasa; si hay filtro, debe coincidir el status.
    const cumpleEstado = !estado || tarea.status === estado;
    // Sin filtro de usuario toda tarea pasa; si hay filtro, se compara el userId
    // como texto para evitar diferencias entre número y string.
    const cumpleUsuario =
      !usuarioId || String(tarea.userId) === String(usuarioId);
    // Solo pasan las tareas que cumplan el estado Y el usuario a la vez.
    return cumpleEstado && cumpleUsuario;
  });

  // Pinta en la tabla únicamente las tareas que superaron el filtro,
  // conservando la lista de usuarios para mostrar los nombres.
  renderizarTablaTareas(tareasFiltradas, usuariosCargados);
}

/** Carga tareas y usuarios, y refresca la vista completa. */
async function cargarTareas() {
  // Muestra el indicador de carga mientras se consulta la API.
  mostrarCargando(true);
  try {
    // Lanza ambas peticiones en paralelo (tareas y usuarios) para esperar menos.
    const [tareas, usuarios] = await Promise.all([
      obtenerTareas(),
      obtenerUsuarios(),
    ]);
    // Guarda las copias completas que usarán el render y los filtros.
    todasLasTareas = tareas;
    usuariosCargados = usuarios;
    // Llena el select de asignación del formulario de creación/edición.
    cargarSelectUsuarios(usuarios);
    // Llena el select del filtro por usuario (conserva la selección previa).
    cargarSelectFiltroUsuarios(usuarios);
    // Reaplica los filtros: si hay alguno activo, la tabla se pinta filtrada.
    aplicarFiltros();
  } catch (error) {
    // Si la carga falla, avisa al usuario sin romper el resto de la app.
    mostrarNotificacion("Error al cargar tareas: " + error.message);
  } finally {
    // Oculta el indicador de carga ocurra lo que ocurra (éxito o error).
    mostrarCargando(false);
  }
}

/** Enlaza los filtros de la tabla (estado y usuario asignado). */
function setupFiltros() {
  // Al cambiar el select de estado se vuelve a filtrar al instante.
  document.getElementById("filter-task-status").addEventListener("change", aplicarFiltros);
  // Al cambiar el select de usuario se vuelve a filtrar al instante.
  document.getElementById("filter-task-user").addEventListener("change", aplicarFiltros);
}

/** Enlaza el formulario de creación/actualización de tareas. */
function setupFormulario() {
  // Un único listener sobre el botón "Agregar"/"Actualizar".
  document.getElementById("add-task").addEventListener("click", async () => {
    // Lee y limpia los valores de los tres campos del formulario.
    const title = document.getElementById("task-title").value.trim();
    const description = document.getElementById("task-description").value.trim();
    const userId = document.getElementById("task-user").value;

    // Validación: el título es obligatorio.
    if (!title) {
      return mostrarNotificacion("El título de la tarea es obligatorio");
    }
    // Validación: la tarea debe asignarse a un usuario.
    if (!userId) {
      return mostrarNotificacion("Debe asignar la tarea a un usuario");
    }

    // Prepara el cuerpo de la petición; userId se convierte a número.
    const taskData = { title, description, userId: Number(userId) };

    try {
      // Si hay una tarea en edición, se actualiza; si no, se crea una nueva.
      if (editingTaskId) {
        await actualizarTarea(editingTaskId, taskData);
        // Sale del modo edición y restaura el texto del botón.
        editingTaskId = null;
        document.getElementById("add-task").textContent = "Agregar";
        mostrarNotificacion("Tarea actualizada correctamente", "exito");
      } else {
        await crearTarea(taskData);
        mostrarNotificacion("Tarea creada correctamente", "exito");
      }
      // Limpia el formulario después de guardar.
      document.getElementById("task-title").value = "";
      document.getElementById("task-description").value = "";
      document.getElementById("task-user").value = "";
      // Recarga la vista: se reaplican los filtros activos automáticamente.
      await cargarTareas();
    } catch (error) {
      // Si la API devuelve un error, se muestra al usuario.
      mostrarNotificacion(error.message);
    }
  });
}

/** Enlaza las acciones de editar/eliminar y el cambio de estado. */
function setupTabla() {
  // El tbody se vuelve a pintar en cada render, por eso el listener
  // se coloca sobre él (delegación de eventos) y no sobre cada botón.
  const tbody = document.getElementById("tasks-body");

  // Delegación de clics: detecta si se pulsó un botón dentro de una fila.
  tbody.addEventListener("click", async (e) => {
    // Sube desde el elemento pulsado hasta el botón más cercano.
    const button = e.target.closest("button");
    // Si el clic no fue sobre un botón, se ignora.
    if (!button) return;
    // Lee el id de la tarea desde el atributo data-id del botón.
    const id = Number(button.dataset.id);

    // Acción "Editar": carga la tarea y rellena el formulario.
    if (button.classList.contains("edit")) {
      try {
        // Consulta la tarea completa a la API para rellenar el formulario.
        const tarea = await obtenerTarea(id);
        // Guarda el id en edición para que el guardado haga PUT y no POST.
        editingTaskId = id;
        document.getElementById("task-title").value = tarea.title;
        document.getElementById("task-description").value = tarea.description || "";
        document.getElementById("task-user").value = tarea.userId;
        // Cambia el texto del botón para indicar que se va a actualizar.
        document.getElementById("add-task").textContent = "Actualizar";
      } catch (error) {
        mostrarNotificacion("Error al obtener tarea: " + error.message);
      }
    }

    // Acción "Eliminar": pide confirmación antes de borrar.
    if (button.classList.contains("delete")) {
      // Muestra el diálogo sí/no; si el usuario cancela, no se elimina.
      const confirmado = await mostrarConfirmacion("¿Eliminar tarea?");
      if (!confirmado) return;
      try {
        await eliminarTarea(id);
        mostrarNotificacion("Tarea eliminada correctamente", "exito");
        // Recarga la vista para que la fila eliminada desaparezca.
        await cargarTareas();
      } catch (error) {
        mostrarNotificacion(error.message);
      }
    }
  });

  // Cambio de estado de la tarea desde el <select> de la fila.
  tbody.addEventListener("change", async (e) => {
    // Detecta si el cambio ocurrió en un select de estado (.task-status).
    const select = e.target.closest(".task-status");
    if (!select) return;
    try {
      // Envía solo el nuevo estado con PATCH (actualización parcial).
      await cambiarEstadoTarea(Number(select.dataset.id), {
        status: select.value,
      });
      mostrarNotificacion("Estado de la tarea actualizado", "exito");
    } catch (error) {
      mostrarNotificacion(error.message);
      // Si falló, recarga la tabla para restaurar el estado real.
      await cargarTareas();
    }
  });
}

/** Punto de entrada del módulo: enlaza eventos y carga datos. */
export function initTasksView() {
  setupFormulario(); // Enlaza el formulario de crear/actualizar.
  setupTabla();      // Enlaza editar, eliminar y cambio de estado.
  setupFiltros();    // Enlaza los selectores de filtro de la tabla.
  cargarTareas();    // Trae los datos iniciales y pinta la tabla.
}
