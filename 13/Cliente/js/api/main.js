/**
 * ==========================================================
 * PUNTO DE ENTRADA DE LA APP DE TAREAS
 * ==========================================================
 *
 * Este módulo arranca la aplicación cuando el DOM termina
 * de cargarse, delegando el renderizado inicial a la capa
 * de interfaz (ui/tareasUI.js).
 */
import { mostrarTareas } from "./ui/tareasUI.js";

document.addEventListener("DOMContentLoaded", () => {
    mostrarTareas();
});