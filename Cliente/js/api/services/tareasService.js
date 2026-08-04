import {
  obtenerTareas,
  obtenerTarea,
  crearTarea,
  actualizarTarea,
  eliminarTarea
} from "../api/tareasApi.js";

/* ==========================
   SERVICIOS DE TAREAS
========================== */

export async function loadTasks() {
  return await obtenerTareas();
}

export async function loadTask(id) {
  return await obtenerTarea(id);
}

export async function addTask(taskData) {

  if (!taskData.title?.trim()) {
    throw new Error("El título es obligatorio");
  }

  return await crearTarea(taskData);
}

export async function editTask(id, taskData) {
  return await actualizarTarea(id, taskData);
}

export async function removeTask(id) {
  return await eliminarTarea(id);
}