import { loadTasks } from "../services/tareasService.js";

export async function mostrarTareas() {

    const tareas = await loadTasks();

    console.log(tareas);
}