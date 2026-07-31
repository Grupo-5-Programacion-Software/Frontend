/**
 * ==========================================================
 * SERVICIO DE COMUNICACIÓN CON LA API
 * ==========================================================
 *
 * Este módulo centraliza todas las peticiones HTTP que el
 * frontend realiza hacia el servidor.
 *
 * Funcionalidades:
 * - Consultar categorías.
 * - Crear, actualizar y eliminar categorías.
 * - Consultar productos.
 * - Crear, actualizar y eliminar productos.
 *
 * Todas las funciones utilizan Fetch API y devuelven la
 * información obtenida desde el backend.
 */


const API_BASE_URL = 'http://localhost:3000';

// Obtiene todas las categorías registradas.
export async function obtenerCategorias() {
  const res = await fetch(`${API_BASE_URL}/categories`);
  if (!res.ok) throw new Error('Error al cargar categorías');
  const json = await res.json();
  return json.data;
}

// Obtiene una categoría específica por su identificador.
export async function obtenerCategoriaPorId(id) {
  const res = await fetch(`${API_BASE_URL}/categories/${id}`);
  if (!res.ok) throw new Error('Error al obtener categoría');
  const json = await res.json();
  return json.data;
}

// Envía una solicitud para crear una nueva categoría.
export async function crearCategoria(nombre) {
  const res = await fetch(`${API_BASE_URL}/categories`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ name: nombre })
  });
  if (!res.ok) throw new Error('Error al crear categoría');
  const json = await res.json();
  return json.data;
}

// Actualiza la información de una categoría existente.
export async function actualizarCategoria(id, nombre) {
  const res = await fetch(`${API_BASE_URL}/categories/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ name: nombre })
  });
  if (!res.ok) throw new Error('Error al actualizar categoría');
  const json = await res.json();
  return json.data;
}

// Elimina una categoría según su identificador.
export async function eliminarCategoria(id) {
  const res = await fetch(`${API_BASE_URL}/categories/${id}`, { method: 'DELETE' });
  const json = await res.json();
  if (!json.success) throw new Error(json.message);
  return json;
}

// Obtiene todos los productos disponibles.
export async function obtenerProductos() {
  const res = await fetch(`${API_BASE_URL}/products`);
  if (!res.ok) throw new Error('Error al cargar productos');
  const json = await res.json();
  return json.data;
}

// Consulta un producto específico por su identificador.
export async function obtenerProductoPorId(id) {
  const res = await fetch(`${API_BASE_URL}/products/${id}`);
  if (!res.ok) throw new Error('Error al obtener producto');
  const json = await res.json();
  return json.data;
}

// Registra un nuevo producto en el sistema.
export async function crearProducto(producto) {
  const res = await fetch(`${API_BASE_URL}/products`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(producto)
  });
  if (!res.ok) throw new Error('Error al crear producto');
  const json = await res.json();
  return json.data;
}

// Actualiza la información de un producto existente.
export async function actualizarProducto(id, producto) {
  const res = await fetch(`${API_BASE_URL}/products/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(producto)
  });
  if (!res.ok) throw new Error('Error al actualizar producto');
  const json = await res.json();
  return json.data;
}

// Elimina un producto del sistema.
export async function eliminarProducto(id) {
  const res = await fetch(`${API_BASE_URL}/products/${id}`, { method: 'DELETE' });
  const json = await res.json();
  if (!json.success) throw new Error(json.message);
  return json;
}
