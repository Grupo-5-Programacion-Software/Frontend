/**
 * ==========================================================
 * MÓDULO DE INTERFAZ DE INVENTARIO (inventoryUI.js)
 * ==========================================================
 *
 * Contiene las funciones que actualizan el DOM del módulo de
 * inventario (tabla de categorías).
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
