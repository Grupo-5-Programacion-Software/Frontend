/**
 * ==========================================================
 * MÓDULO PRINCIPAL DEL FRONTEND
 * ==========================================================
 *
 * Este archivo coordina el funcionamiento general de la
 * aplicación de inventario.
 *
 * Responsabilidades:
 * - Inicializar la interfaz.
 * - Gestionar los eventos de los formularios.
 * - Consumir los servicios de la API.
 * - Actualizar la información mostrada al usuario.
 * - Coordinar la interacción entre la capa de interfaz
 *   (UI) y la capa de servicios.
 *
 * Flujo general:
 * 1. El usuario realiza una acción.
 * 2. Se llama al servicio correspondiente.
 * 3. Se procesa la respuesta del servidor.
 * 4. Se actualiza la interfaz.
 */


import {
  obtenerCategorias, obtenerProductos, crearCategoria, actualizarCategoria,
  eliminarCategoria, crearProducto, actualizarProducto, eliminarProducto,
  obtenerProductoPorId
} from './inventarioApi.js';
import {
  renderizarTablaCategorias, renderizarTablaProductos, cargarSelectCategorias
} from './ui/inventarioUI.js';
import { mostrarNotificacion, mostrarConfirmacion, mostrarCargando } from './utils/helpers.js';

let editingCategoryId = null;
let editingProductId = null;

document.querySelectorAll('.tab').forEach(tab => {
  tab.addEventListener('click', () => {
    document.querySelectorAll('.tab').forEach(t => t.classList.remove('active'));
    document.querySelectorAll('.section').forEach(s => s.classList.remove('active'));
    tab.classList.add('active');
    document.getElementById(tab.dataset.tab + '-section').classList.add('active');
  });
});

// Obtiene las categorías desde la API y actualiza la tabla.
async function cargarCategorias() {
  mostrarCargando(true);
  try {
    const categorias = await obtenerCategorias();
    renderizarTablaCategorias(categorias);
    return categorias;
  } catch (error) {
    mostrarNotificacion('Error al cargar categorías: ' + error.message);
    return [];
  } finally {
    mostrarCargando(false);
  }
}

// Obtiene los productos y las categorías para renderizar la información.
async function cargarProductos() {
  mostrarCargando(true);
  try {
    const [productos, categorias] = await Promise.all([
      obtenerProductos(),
      obtenerCategorias()
    ]);
    renderizarTablaCategorias(categorias);
    renderizarTablaProductos(productos, categorias);
    cargarSelectCategorias(categorias);
  } catch (error) {
    mostrarNotificacion('Error al cargar productos: ' + error.message);
  } finally {
    mostrarCargando(false);
  }
}

// Gestiona el registro y actualización de categorías.
document.getElementById('add-category').addEventListener('click', async () => {
  const input = document.getElementById('category-name');
  const name = input.value.trim();
  if (!name) return mostrarNotificacion('Ingrese un nombre para la categoría');

  try {
    if (editingCategoryId) {
      await actualizarCategoria(editingCategoryId, name);
      editingCategoryId = null;
      document.getElementById('add-category').textContent = 'Agregar';
      mostrarNotificacion('Categoría actualizada correctamente', 'exito');
    } else {
      await crearCategoria(name);
      mostrarNotificacion('Categoría creada correctamente', 'exito');
    }
    input.value = '';
    await cargarCategorias();
  } catch (error) {
    mostrarNotificacion(error.message);
  }
});

// Controla las acciones de editar y eliminar categorías.
document.getElementById('categories-body').addEventListener('click', async (e) => {
  const button = e.target.closest('button');
  if (!button) return;
  const id = Number(button.dataset.id);

  if (button.classList.contains('edit')) {
    editingCategoryId = id;
    document.getElementById('category-name').value = button.dataset.name;
    document.getElementById('add-category').textContent = 'Actualizar';
  }

  if (button.classList.contains('delete')) {
    const confirmado = await mostrarConfirmacion('¿Eliminar categoría?');
    if (!confirmado) return;
    try {
      await eliminarCategoria(id);
      mostrarNotificacion('Categoría eliminada correctamente', 'exito');
      await cargarCategorias();
    } catch (error) {
      mostrarNotificacion(error.message);
    }
  }
});

// Gestiona el registro y actualización de productos.
document.getElementById('add-product').addEventListener('click', async () => {
  const name = document.getElementById('product-name').value.trim();
  const price = Number(document.getElementById('product-price').value.trim());
  const categoryId = document.getElementById('product-category').value;

  if (!name || !categoryId || isNaN(price) || price < 0) {
    return mostrarNotificacion('Nombre, categoría y un precio válido son obligatorios');
  }

  try {
    if (editingProductId) {
      await actualizarProducto(editingProductId, { name, price, categoryId: Number(categoryId) });
      editingProductId = null;
      document.getElementById('add-product').textContent = 'Agregar';
      mostrarNotificacion('Producto actualizado correctamente', 'exito');
    } else {
      await crearProducto({ name, price, categoryId: Number(categoryId) });
      mostrarNotificacion('Producto creado correctamente', 'exito');
    }
    document.getElementById('product-name').value = '';
    document.getElementById('product-price').value = '';
    document.getElementById('product-category').value = '';
    await cargarProductos();
  } catch (error) {
    mostrarNotificacion(error.message);
  }
});

// Controla las acciones de editar y eliminar productos.
document.getElementById('products-body').addEventListener('click', async (e) => {
  const button = e.target.closest('button');
  if (!button) return;
  const id = Number(button.dataset.id);

  if (button.classList.contains('edit')) {
    try {
      const producto = await obtenerProductoPorId(id);
      editingProductId = id;
      document.getElementById('product-name').value = producto.name;
      document.getElementById('product-price').value = producto.price;
      document.getElementById('product-category').value = producto.categoryId;
      document.getElementById('add-product').textContent = 'Actualizar';
      document.querySelector('[data-tab="products"]').click();
    } catch (error) {
      mostrarNotificacion('Error al obtener producto: ' + error.message);
    }
  }

  if (button.classList.contains('delete')) {
    const confirmado = await mostrarConfirmacion('¿Eliminar producto?');
    if (!confirmado) return;
    try {
      await eliminarProducto(id);
      mostrarNotificacion('Producto eliminado correctamente', 'exito');
      await cargarProductos();
    } catch (error) {
      mostrarNotificacion(error.message);
    }
  }
});

// Inicializa la aplicación cargando categorías y productos en una sola petición.
cargarProductos();
