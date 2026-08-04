/**
 * ==========================================================
 * MÓDULO DE INTERFAZ DE INVENTARIO (inventoryUI.js)
 * ==========================================================
 *
 * Contiene las funciones que actualizan el DOM del módulo de
 * inventario (tablas de categorías y productos).
 *
 * Estas funciones NO realizan peticiones HTTP: solo reciben
 * datos y los pintan. La comunicación con la API la hace la
 * capa de servicios.
 */
import { escaparHTML } from "../utils/helpers.js";

/** Muestra en la tabla todas las categorías registradas. */
export function renderizarTablaCategorias(categorias) {
  const tbody = document.getElementById("categories-body");
  tbody.innerHTML = "";
  categorias.forEach((cat) => {
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

/** Renderiza la tabla de productos mostrando su categoría. */
export function renderizarTablaProductos(productos, categorias) {
  const catMap = {};
  categorias.forEach((c) => (catMap[c.id] = c.name));

  const tbody = document.getElementById("products-body");
  tbody.innerHTML = "";
  productos.forEach((prod) => {
    tbody.innerHTML += `
      <tr>
        <td>${prod.id}</td>
        <td>${escaparHTML(prod.name)}</td>
        <td>$${prod.price}</td>
        <td>${escaparHTML(catMap[prod.categoryId] || "Sin categoría")}</td>
        <td class="actions">
          <button class="edit" data-id="${prod.id}">Editar</button>
          <button class="delete" data-id="${prod.id}">Eliminar</button>
        </td>
      </tr>`;
  });
}

/** Llena el selector de categorías del formulario de productos. */
export function cargarSelectCategorias(categorias) {
  const select = document.getElementById("product-category");
  select.innerHTML = '<option value="">Seleccionar categoría</option>';
  categorias.forEach((cat) => {
    select.innerHTML += `<option value="${cat.id}">${escaparHTML(cat.name)}</option>`;
  });
}
