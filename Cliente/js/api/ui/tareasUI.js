/**
 * ==========================================================
 * MÓDULO DE INTERFAZ DE USUARIO (UI) - TAREAS
 * ==========================================================
 *
 * Este módulo se encarga de cargar y mostrar las tareas
 * obtenidas desde el servicio, actualizando el DOM.
 *
 * Nota: actualmente solo registra las tareas en consola;
 * el renderizado visual queda pendiente de implementar.
 */
import { loadTasks } from "../services/tareasService.js";

export async function mostrarTareas() {

    const tareas = await loadTasks();

    console.log(tareas);
}