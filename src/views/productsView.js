/**
 * ==========================================================
 * VISTA DE PRODUCTOS (productsView.js)
 * ==========================================================
 *
 * Coordina el módulo de productos (pestaña propia, independiente
 * del inventario de categorías):
 * - Carga productos y categorías desde la API.
 * - Enlaza el formulario de creación / actualización.
 * - Maneja edición y eliminación desde la tabla.
 *
 * Capas involucradas:
 * - services/inventoryApi.js -> peticiones HTTP (productos).
 * - ui/productsUI.js         -> pintado de la tabla y el select.
 * - utils/helpers.js         -> notificaciones, confirmaciones.
 */
import {
  obtenerProductos,
  obtenerCategorias,
  crearProducto,
  actualizarProducto,
  eliminarProducto,
  obtenerProductoPorId,
} from "../services/inventoryApi.js";
import {
  renderizarTablaProductos,
  cargarSelectCategorias,
} from "../ui/productsUI.js";
import {
  mostrarNotificacion,
  mostrarConfirmacion,
  mostrarCargando,
} from "../utils/helpers.js";

let editingProductId = null;

/** Carga productos y categorías, y refresca toda la vista. */
async function cargarProductos() {
  mostrarCargando(true);
  try {
    const [productos, categorias] = await Promise.all([
      obtenerProductos(),
      obtenerCategorias(),
    ]);
    renderizarTablaProductos(productos, categorias);
    cargarSelectCategorias(categorias);
  } catch (error) {
    mostrarNotificacion("Error al cargar productos: " + error.message);
  } finally {
    mostrarCargando(false);
  }
}

/** Enlaza el formulario de creación/actualización de productos. */
function setupFormulario() {
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
      await cargarProductos();
    } catch (error) {
      mostrarNotificacion(error.message);
    }
  });
}

/** Enlaza las acciones de editar/eliminar productos de la tabla. */
function setupTabla() {
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
        await cargarProductos();
      } catch (error) {
        mostrarNotificacion(error.message);
      }
    }
  });
}

/** Punto de entrada del módulo: enlaza eventos y carga datos. */
export function initProductsView() {
  setupFormulario();
  setupTabla();
  cargarProductos();
}
