/**
 * ==========================================================
 * MÓDULO DE INTERFAZ DE USUARIO (UI)
 * ==========================================================
 *
 * Este módulo contiene las funciones encargadas de
 * actualizar la interfaz gráfica del sistema.
 *
 * Responsabilidades:
 * - Renderizar la tabla de categorías.
 * - Renderizar la tabla de productos.
 * - Cargar las categorías disponibles en el selector
 *   del formulario de productos.
 *
 * Estas funciones únicamente manipulan el DOM y no
 * realizan comunicación directa con la API.
 */


import { escaparHTML } from '../utils/helpers.js';

// Muestra en la tabla todas las categorías registradas.
export function renderizarTablaCategorias(categorias) {
  const tbody = document.getElementById('categories-body');
  tbody.innerHTML = '';
  categorias.forEach(cat => {
    tbody.innerHTML += `
      <tr>
        <td>${cat.id}</td>
        <td>${escaparHTML(cat.name)}</td>
        <td class="actions">
          <button class="edit" data-id="${cat.id}" data-name="${escaparHTML(cat.name)}">Editar</button>
          <button class="delete" data-id="${cat.id}">Eliminar</button>
        </td>
      </tr>`;
  });
}

// Renderiza la tabla de productos mostrando su categoría correspondiente.
export function renderizarTablaProductos(productos, categorias) {
  const catMap = {};
  categorias.forEach(c => catMap[c.id] = c.name);

  const tbody = document.getElementById('products-body');
  tbody.innerHTML = '';
  productos.forEach(prod => {
    tbody.innerHTML += `
      <tr>
        <td>${prod.id}</td>
        <td>${escaparHTML(prod.name)}</td>
        <td>$${prod.price}</td>
        <td>${escaparHTML(catMap[prod.categoryId] || 'Sin categoría')}</td>
        <td class="actions">
          <button class="edit" data-id="${prod.id}">Editar</button>
          <button class="delete" data-id="${prod.id}">Eliminar</button>
        </td>
      </tr>`;
  });
}

// Llena el selector de categorías utilizado en el formulario de productos.
export function cargarSelectCategorias(categorias) {
  const select = document.getElementById('product-category');
  select.innerHTML = '<option value="">Seleccionar categoría</option>';
  categorias.forEach(cat => {
    select.innerHTML += `<option value="${cat.id}">${cat.name}</option>`;
  });
}
