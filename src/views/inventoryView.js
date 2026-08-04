/**
 * ==========================================================
 * VISTA DE INVENTARIO (inventoryView.js)
 * ==========================================================
 *
 * Coordina el módulo de inventario:
 * - Carga categorías y productos desde la API.
 * - Enlaza los eventos del formulario (crear / actualizar).
 * - Maneja edición y eliminación desde la tabla.
 *
 * Capas involucradas:
 * - services/inventoryApi.js  -> peticiones HTTP.
 * - ui/inventoryUI.js         -> pintado de tablas y select.
 * - utils/helpers.js          -> notificaciones, confirmaciones.
 */
import {
  obtenerProductos,
  obtenerCategorias,
  crearCategoria,
  actualizarCategoria,
  eliminarCategoria,
  crearProducto,
  actualizarProducto,
  eliminarProducto,
  obtenerProductoPorId,
} from "../services/inventoryApi.js";
import {
  renderizarTablaCategorias,
  renderizarTablaProductos,
  cargarSelectCategorias,
} from "../ui/inventoryUI.js";
import {
  mostrarNotificacion,
  mostrarConfirmacion,
  mostrarCargando,
} from "../utils/helpers.js";

let editingCategoryId = null;
let editingProductId = null;

/** Carga categorías y productos, y refresca toda la vista. */
async function cargarInventario() {
  mostrarCargando(true);
  try {
    const [productos, categorias] = await Promise.all([
      obtenerProductos(),
      obtenerCategorias(),
    ]);
    renderizarTablaCategorias(categorias);
    renderizarTablaProductos(productos, categorias);
    cargarSelectCategorias(categorias);
  } catch (error) {
    mostrarNotificacion("Error al cargar inventario: " + error.message);
  } finally {
    mostrarCargando(false);
  }
}

/** Enlaza el formulario de creación/actualización de categorías. */
function setupCategoriaForm() {
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
      await cargarInventario();
    } catch (error) {
      mostrarNotificacion(error.message);
    }
  });
}

/** Enlaza las acciones de editar/eliminar categorías de la tabla. */
function setupCategoriaTabla() {
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
        await cargarInventario();
      } catch (error) {
        mostrarNotificacion(error.message);
      }
    }
  });
}

/** Enlaza el formulario de creación/actualización de productos. */
function setupProductoForm() {
  document.getElementById("add-product").addEventListener("click", async () => {
    const name = document.getElementById("product-name").value.trim();
    const price = Number(document.getElementById("product-price").value.trim());
    const categoryId = document.getElementById("product-category").value;

    if (!name || !categoryId || isNaN(price) || price < 0) {
      return mostrarNotificacion(
        "Nombre, categoría y un precio válido son obligatorios"
      );
    }

    try {
      if (editingProductId) {
        await actualizarProducto(editingProductId, {
          name,
          price,
          categoryId: Number(categoryId),
        });
        editingProductId = null;
        document.getElementById("add-product").textContent = "Agregar";
        mostrarNotificacion("Producto actualizado correctamente", "exito");
      } else {
        await crearProducto({ name, price, categoryId: Number(categoryId) });
        mostrarNotificacion("Producto creado correctamente", "exito");
      }
      document.getElementById("product-name").value = "";
      document.getElementById("product-price").value = "";
      document.getElementById("product-category").value = "";
      await cargarInventario();
    } catch (error) {
      mostrarNotificacion(error.message);
    }
  });
}

/** Enlaza las acciones de editar/eliminar productos de la tabla. */
function setupProductoTabla() {
  document.getElementById("products-body").addEventListener("click", async (e) => {
    const button = e.target.closest("button");
    if (!button) return;
    const id = Number(button.dataset.id);

    if (button.classList.contains("edit")) {
      try {
        const producto = await obtenerProductoPorId(id);
        editingProductId = id;
        document.getElementById("product-name").value = producto.name;
        document.getElementById("product-price").value = producto.price;
        document.getElementById("product-category").value = producto.categoryId;
        document.getElementById("add-product").textContent = "Actualizar";
        document.querySelector('[data-tab="inventory"]').click();
      } catch (error) {
        mostrarNotificacion("Error al obtener producto: " + error.message);
      }
    }

    if (button.classList.contains("delete")) {
      const confirmado = await mostrarConfirmacion("¿Eliminar producto?");
      if (!confirmado) return;
      try {
        await eliminarProducto(id);
        mostrarNotificacion("Producto eliminado correctamente", "exito");
        await cargarInventario();
      } catch (error) {
        mostrarNotificacion(error.message);
      }
    }
  });
}

/** Punto de entrada del módulo: enlaza eventos y carga datos. */
export function initInventoryView() {
  setupCategoriaForm();
  setupCategoriaTabla();
  setupProductoForm();
  setupProductoTabla();
  cargarInventario();
}
