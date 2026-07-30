export function renderizarTablaCategorias(categorias) {
  const tbody = document.getElementById('categories-body');
  tbody.innerHTML = '';
  categorias.forEach(cat => {
    tbody.innerHTML += `
      <tr>
        <td>${cat.id}</td>
        <td>${cat.name}</td>
        <td class="actions">
          <button class="edit" data-id="${cat.id}" data-name="${cat.name}">Editar</button>
          <button class="delete" data-id="${cat.id}">Eliminar</button>
        </td>
      </tr>`;
  });
}

export function renderizarTablaProductos(productos, categorias) {
  const catMap = {};
  categorias.forEach(c => catMap[c.id] = c.name);

  const tbody = document.getElementById('products-body');
  tbody.innerHTML = '';
  productos.forEach(prod => {
    tbody.innerHTML += `
      <tr>
        <td>${prod.id}</td>
        <td>${prod.name}</td>
        <td>$${prod.price}</td>
        <td>${catMap[prod.categoryId] || 'Sin categoría'}</td>
        <td class="actions">
          <button class="edit" data-id="${prod.id}">Editar</button>
          <button class="delete" data-id="${prod.id}">Eliminar</button>
        </td>
      </tr>`;
  });
}

export function cargarSelectCategorias(categorias) {
  const select = document.getElementById('product-category');
  select.innerHTML = '<option value="">Seleccionar categoría</option>';
  categorias.forEach(cat => {
    select.innerHTML += `<option value="${cat.id}">${cat.name}</option>`;
  });
}
