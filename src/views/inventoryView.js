/**
 * ==========================================================
 * VISTA DE INVENTARIO (inventoryView.js)
 * ==========================================================
 *
 * Coordina el módulo de inventario de categorías:
 * - Carga las categorías desde la API.
 * - Enlaza el formulario (crear / actualizar).
 * - Maneja edición y eliminación desde la tabla.
 *
 * Los productos tienen su propia pestaña (productsView.js).
 *
 * Capas involucradas:
 * - services/inventoryApi.js -> peticiones HTTP (categorías).
 * - ui/inventoryUI.js        -> pintado de la tabla.
 * - utils/helpers.js         -> notificaciones, confirmaciones.
 */
import {
  obtenerCategorias,
  crearCategoria,
  actualizarCategoria,
  eliminarCategoria,
} from "../services/inventoryApi.js";
import { renderizarTablaCategorias } from "../ui/inventoryUI.js";
import {
  mostrarNotificacion,
  mostrarConfirmacion,
  mostrarCargando,
} from "../utils/helpers.js";

let editingCategoryId = null;

/** Carga las categorías y refresca la vista. */
async function cargarCategorias() {
  mostrarCargando(true);
  try {
    const categorias = await obtenerCategorias();
    renderizarTablaCategorias(categorias);
  } catch (error) {
    mostrarNotificacion("Error al cargar categorías: " + error.message);
  } finally {
    mostrarCargando(false);
  }
}

/** Enlaza el formulario de creación/actualización de categorías. */
function setupFormulario() {
  document.getElementById("add-category").addEventListener("click", async () => {
    const input = document.getElementById("category-name");
    const name = input.value.trim();
    if (!name) return mostrarNotificacion("Ingrese un nombre para la categoría");

    try {
      if (editingCategoryId) {
        await actualizarCategoria(editingCategoryId, name);
        editingCategoryId = null;
        document.getElementById("add-category").textContent = "Agregar";
        mostrarNotificacion("Categoría actualizada correctamente", "exito");
      } else {
        await crearCategoria(name);
        mostrarNotificacion("Categoría creada correctamente", "exito");
      }
      input.value = "";
      await cargarCategorias();
    } catch (error) {
      mostrarNotificacion(error.message);
    }
  });
}

/** Enlaza las acciones de editar/eliminar categorías de la tabla. */
function setupTabla() {
  document.getElementById("categories-body").addEventListener("click", async (e) => {
    const button = e.target.closest("button");
    if (!button) return;
    const id = Number(button.dataset.id);

    if (button.classList.contains("edit")) {
      editingCategoryId = id;
      document.getElementById("category-name").value = button.dataset.name;
      document.getElementById("add-category").textContent = "Actualizar";
    }

    if (button.classList.contains("delete")) {
      const confirmado = await mostrarConfirmacion("¿Eliminar categoría?");
      if (!confirmado) return;
      try {
        await eliminarCategoria(id);
        mostrarNotificacion("Categoría eliminada correctamente", "exito");
        await cargarCategorias();
      } catch (error) {
        mostrarNotificacion(error.message);
      }
    }
  });
}

/** Punto de entrada del módulo: enlaza eventos y carga datos. */
export function initInventoryView() {
  setupFormulario();
  setupTabla();
  cargarCategorias();
}
