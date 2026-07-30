import {
  obtenerCategorias, obtenerProductos, crearCategoria, actualizarCategoria,
  eliminarCategoria, crearProducto, actualizarProducto, eliminarProducto,
  obtenerProductoPorId
} from './inventarioApi.js';
import {
  renderizarTablaCategorias, renderizarTablaProductos, cargarSelectCategorias
} from './ui/inventarioUI.js';
import { mostrarMensaje, confirmarAccion } from './utils/helpers.js';

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

async function cargarCategorias() {
  try {
    const categorias = await obtenerCategorias();
    renderizarTablaCategorias(categorias);
    return categorias;
  } catch (error) {
    mostrarMensaje('Error al cargar categorías: ' + error.message);
    return [];
  }
}

async function cargarProductos() {
  try {
    const [productos, categorias] = await Promise.all([
      obtenerProductos(),
      obtenerCategorias()
    ]);
    renderizarTablaProductos(productos, categorias);
    cargarSelectCategorias(categorias);
  } catch (error) {
    mostrarMensaje('Error al cargar productos: ' + error.message);
  }
}

document.getElementById('add-category').addEventListener('click', async () => {
  const input = document.getElementById('category-name');
  const name = input.value.trim();
  if (!name) return mostrarMensaje('Ingrese un nombre para la categoría');

  try {
    if (editingCategoryId) {
      await actualizarCategoria(editingCategoryId, name);
      editingCategoryId = null;
      document.getElementById('add-category').textContent = 'Agregar';
    } else {
      await crearCategoria(name);
    }
    input.value = '';
    await cargarCategorias();
  } catch (error) {
    mostrarMensaje(error.message);
  }
});

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
    if (!confirmarAccion('¿Eliminar categoría?')) return;
    try {
      await eliminarCategoria(id);
      await cargarCategorias();
    } catch (error) {
      mostrarMensaje(error.message);
    }
  }
});

document.getElementById('add-product').addEventListener('click', async () => {
  const name = document.getElementById('product-name').value.trim();
  const price = document.getElementById('product-price').value.trim();
  const categoryId = document.getElementById('product-category').value;

  if (!name || !price || !categoryId) {
    return mostrarMensaje('Nombre, precio y categoría son obligatorios');
  }

  try {
    if (editingProductId) {
      await actualizarProducto(editingProductId, { name, price: Number(price), categoryId: Number(categoryId) });
      editingProductId = null;
      document.getElementById('add-product').textContent = 'Agregar';
    } else {
      await crearProducto({ name, price: Number(price), categoryId: Number(categoryId) });
    }
    document.getElementById('product-name').value = '';
    document.getElementById('product-price').value = '';
    document.getElementById('product-category').value = '';
    await cargarProductos();
  } catch (error) {
    mostrarMensaje(error.message);
  }
});

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
      mostrarMensaje('Error al obtener producto: ' + error.message);
    }
  }

  if (button.classList.contains('delete')) {
    if (!confirmarAccion('¿Eliminar producto?')) return;
    try {
      await eliminarProducto(id);
      await cargarProductos();
    } catch (error) {
      mostrarMensaje(error.message);
    }
  }
});

cargarCategorias();
cargarProductos();
