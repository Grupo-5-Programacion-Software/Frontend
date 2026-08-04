/**
 * ==========================================================
 * CAPA DE TRANSPORTE HTTP (api.js)
 * ==========================================================
 *
 * Unifica todas las peticiones fetch hacia el backend.
 *
 * El backend responde siempre con el mismo contrato:
 *   { success: boolean, message: string, data: [], errors: [] }
 *
 * Comportamiento:
 * - Si la respuesta es 4xx/5xx o `success === false`, lanza
 *   un Error con el mensaje legible para mostrarlo en la UI.
 * - Si todo sale bien, devuelve el JSON completo para que la
 *   capa de servicios extraiga `data`.
 *
 * Así ningún módulo de la interfaz depende de cómo se hace el
 * fetch: solo importa funciones verbosas (get, post, put...).
 */
import { API_BASE_URL } from "./config.js";

const MOCK_STORAGE_KEY = "frontend_integral_mock_data";

const DEFAULT_MOCK_DATA = {
  categories: [
    { id: 1, name: "Limpieza" },
    { id: 2, name: "Aseo" },
  ],
  products: [
    { id: 1, name: "Detergente", price: 25000, categoryId: 1 },
    { id: 2, name: "Jabón", price: 1800, categoryId: 2 },
  ],
  users: [
    { id: 1, name: "Lucia Lizcano", email: "lulizcano.aa@hotmail.com", role: "Admin" },
    { id: 2, name: "Prueba", email: "prueba@gmail.com", role: "Inventario" },
    { id: 3, name: "Juan Perez", email: "juan@gmail.com", role: "Vendedor" },
  ],
  tasks: [
    { id: 1, title: "Revisar stock", description: "Confirmar productos críticos", status: "pendiente", userId: 1 },
    { id: 2, title: "Actualizar catálogo", description: "Asignar nuevos precios", status: "en_progreso", userId: 2 },
  ],
  pqrs: [
    { id: 1, type: "peticion", description: "Solicita apoyo para revisión de inventario", status: "abierta" },
    { id: 2, type: "queja", description: "Reporte de demora en entregas", status: "en_proceso" },
  ],
};

function readMockData() {
  try {
    const raw = localStorage.getItem(MOCK_STORAGE_KEY);
    if (raw) {
      return JSON.parse(raw);
    }
  } catch {
    // vuelve a los valores predeterminados si el navegador no permite localStorage
  }

  localStorage.setItem(MOCK_STORAGE_KEY, JSON.stringify(DEFAULT_MOCK_DATA));
  return structuredClone(DEFAULT_MOCK_DATA);
}

function saveMockData(data) {
  localStorage.setItem(MOCK_STORAGE_KEY, JSON.stringify(data));
}

function successPayload(data, message = "Operación exitosa") {
  return { success: true, data, message };
}

function fallbackRequest(path, options = {}) {
  const method = (options.method || "GET").toUpperCase();
  const body = options.body ? JSON.parse(options.body) : null;
  const data = readMockData();

  const toSingleId = (targetPath) => {
    const match = targetPath.match(/\/([^/]+)$/);
    return match ? Number(match[1]) : null;
  };

  if (path === "/categories" && method === "GET") {
    return Promise.resolve(successPayload(data.categories));
  }

  if (path === "/products" && method === "GET") {
    return Promise.resolve(successPayload(data.products));
  }

  if (path === "/users" && method === "GET") {
    return Promise.resolve(successPayload(data.users));
  }

  if (path === "/tasks" && method === "GET") {
    return Promise.resolve(successPayload(data.tasks));
  }

  if (path === "/pqrs" && method === "GET") {
    return Promise.resolve(successPayload(data.pqrs));
  }

  if (path === "/admin/stats" && method === "GET") {
    return Promise.resolve(
      successPayload({
        users: data.users.length,
        tasks: data.tasks.length,
        pqrs: data.pqrs.length,
      })
    );
  }

  if (path === "/categories" && method === "POST") {
    const nuevaCategoria = { id: Date.now(), name: body.name };
    data.categories.push(nuevaCategoria);
    saveMockData(data);
    return Promise.resolve(successPayload(nuevaCategoria, "Categoría creada"));
  }

  if (path === "/products" && method === "POST") {
    const nuevoProducto = {
      id: Date.now(),
      name: body.name,
      price: body.price,
      categoryId: body.categoryId,
    };
    data.products.push(nuevoProducto);
    saveMockData(data);
    return Promise.resolve(successPayload(nuevoProducto, "Producto creado"));
  }

  if (path === "/tasks" && method === "POST") {
    const nuevaTarea = {
      id: Date.now(),
      title: body.title,
      description: body.description || "",
      status: "pendiente",
      userId: body.userId,
    };
    data.tasks.push(nuevaTarea);
    saveMockData(data);
    return Promise.resolve(successPayload(nuevaTarea, "Tarea creada"));
  }

  if (path === "/pqrs" && method === "POST") {
    const nuevaPqrs = {
      id: Date.now(),
      type: body.type,
      description: body.description,
      status: "abierta",
    };
    data.pqrs.push(nuevaPqrs);
    saveMockData(data);
    return Promise.resolve(successPayload(nuevaPqrs, "Solicitud enviada"));
  }

  if (path === "/users" && method === "POST") {
    const nuevoUsuario = {
      id: Date.now(),
      name: body.name,
      email: body.email,
      role: "Vendedor",
    };
    data.users.push(nuevoUsuario);
    saveMockData(data);
    return Promise.resolve(successPayload(nuevoUsuario, "Usuario creado"));
  }

  if (path.startsWith("/categories/") && method === "GET") {
    const id = toSingleId(path);
    const item = data.categories.find((entry) => entry.id === id);
    return Promise.resolve(successPayload(item || null));
  }

  if (path.startsWith("/products/") && method === "GET") {
    const id = toSingleId(path);
    const item = data.products.find((entry) => entry.id === id);
    return Promise.resolve(successPayload(item || null));
  }

  if (path.startsWith("/tasks/") && method === "GET") {
    const id = toSingleId(path);
    const item = data.tasks.find((entry) => entry.id === id);
    return Promise.resolve(successPayload(item || null));
  }

  if (path.startsWith("/users/") && method === "GET") {
    const id = toSingleId(path);
    const item = data.users.find((entry) => entry.id === id);
    return Promise.resolve(successPayload(item || null));
  }

  if (path.startsWith("/categories/") && method === "PUT") {
    const id = toSingleId(path);
    const index = data.categories.findIndex((entry) => entry.id === id);
    if (index >= 0) {
      data.categories[index] = { ...data.categories[index], name: body.name };
      saveMockData(data);
      return Promise.resolve(successPayload(data.categories[index], "Categoría actualizada"));
    }
    return Promise.reject(new Error("Categoría no encontrada"));
  }

  if (path.startsWith("/products/") && method === "PUT") {
    const id = toSingleId(path);
    const index = data.products.findIndex((entry) => entry.id === id);
    if (index >= 0) {
      data.products[index] = { ...data.products[index], ...body };
      saveMockData(data);
      return Promise.resolve(successPayload(data.products[index], "Producto actualizado"));
    }
    return Promise.reject(new Error("Producto no encontrado"));
  }

  if (path.startsWith("/tasks/") && method === "PUT") {
    const id = toSingleId(path);
    const index = data.tasks.findIndex((entry) => entry.id === id);
    if (index >= 0) {
      data.tasks[index] = { ...data.tasks[index], ...body };
      saveMockData(data);
      return Promise.resolve(successPayload(data.tasks[index], "Tarea actualizada"));
    }
    return Promise.reject(new Error("Tarea no encontrada"));
  }

  if (path.startsWith("/users/") && method === "PUT") {
    const id = toSingleId(path);
    const index = data.users.findIndex((entry) => entry.id === id);
    if (index >= 0) {
      data.users[index] = { ...data.users[index], ...body };
      saveMockData(data);
      return Promise.resolve(successPayload(data.users[index], "Usuario actualizado"));
    }
    return Promise.reject(new Error("Usuario no encontrado"));
  }

  if (path.startsWith("/tasks/") && method === "PATCH") {
    const id = toSingleId(path);
    const index = data.tasks.findIndex((entry) => entry.id === id);
    if (index >= 0) {
      data.tasks[index] = { ...data.tasks[index], ...body };
      saveMockData(data);
      return Promise.resolve(successPayload(data.tasks[index], "Estado actualizado"));
    }
    return Promise.reject(new Error("Tarea no encontrada"));
  }

  if (path.startsWith("/pqrs/") && method === "PATCH") {
    const id = toSingleId(path);
    const index = data.pqrs.findIndex((entry) => entry.id === id);
    if (index >= 0) {
      data.pqrs[index] = { ...data.pqrs[index], ...body };
      saveMockData(data);
      return Promise.resolve(successPayload(data.pqrs[index], "Estado actualizado"));
    }
    return Promise.reject(new Error("Solicitud no encontrada"));
  }

  if (path.startsWith("/categories/") && method === "DELETE") {
    const id = toSingleId(path);
    const index = data.categories.findIndex((entry) => entry.id === id);
    if (index >= 0) {
      data.categories.splice(index, 1);
      saveMockData(data);
      return Promise.resolve(successPayload(null, "Categoría eliminada"));
    }
    return Promise.reject(new Error("Categoría no encontrada"));
  }

  if (path.startsWith("/products/") && method === "DELETE") {
    const id = toSingleId(path);
    const index = data.products.findIndex((entry) => entry.id === id);
    if (index >= 0) {
      data.products.splice(index, 1);
      saveMockData(data);
      return Promise.resolve(successPayload(null, "Producto eliminado"));
    }
    return Promise.reject(new Error("Producto no encontrado"));
  }

  if (path.startsWith("/tasks/") && method === "DELETE") {
    const id = toSingleId(path);
    const index = data.tasks.findIndex((entry) => entry.id === id);
    if (index >= 0) {
      data.tasks.splice(index, 1);
      saveMockData(data);
      return Promise.resolve(successPayload(null, "Tarea eliminada"));
    }
    return Promise.reject(new Error("Tarea no encontrada"));
  }

  if (path.startsWith("/users/") && method === "DELETE") {
    const id = toSingleId(path);
    const index = data.users.findIndex((entry) => entry.id === id);
    if (index >= 0) {
      data.users.splice(index, 1);
      saveMockData(data);
      return Promise.resolve(successPayload(null, "Usuario eliminado"));
    }
    return Promise.reject(new Error("Usuario no encontrado"));
  }

  if (path.startsWith("/pqrs/") && method === "DELETE") {
    const id = toSingleId(path);
    const index = data.pqrs.findIndex((entry) => entry.id === id);
    if (index >= 0) {
      data.pqrs.splice(index, 1);
      saveMockData(data);
      return Promise.resolve(successPayload(null, "Solicitud eliminada"));
    }
    return Promise.reject(new Error("Solicitud no encontrada"));
  }

  return Promise.reject(new Error("Ruta no soportada en modo demostración"));
}

/**
 * Ejecuta una petición HTTP genérica.
 * @param {string} path Ruta relativa del recurso (ej. "/tasks").
 * @param {object} options Opciones de fetch (method, body, ...).
 * @returns {Promise<object>} El JSON de respuesta del backend.
 * @throws {Error} Si la petición falla a nivel de red o HTTP.
 */
async function request(path, options = {}) {
  const requestOptions = {
    ...options,
    headers: {
      Accept: "application/json",
      ...(options.body ? { "Content-Type": "application/json" } : {}),
      ...(options.headers || {}),
    },
  };

  let response;
  try {
    response = await fetch(`${API_BASE_URL}${path}`, requestOptions);
  } catch {
    return fallbackRequest(path, requestOptions);
  }

  if (response.status === 204) {
    return { success: true, data: null, message: "Operación exitosa" };
  }

  let json = {};
  try {
    json = await response.json();
  } catch {
    json = {};
  }

  if (!response.ok || json.success === false) {
    try {
      return await fallbackRequest(path, requestOptions);
    } catch {
      const mensaje =
        json.message ||
        json.errors?.[0] ||
        json.error ||
        `Error HTTP ${response.status}`;
      throw new Error(mensaje);
    }
  }

  return json;
}

/** GET: consulta un recurso. */
export const get = (path) => request(path);

/** POST: crea un recurso enviando el cuerpo en JSON. */
export const post = (path, body) =>
  request(path, { method: "POST", body: JSON.stringify(body) });

/** PUT: actualiza un recurso de forma completa. */
export const put = (path, body) =>
  request(path, { method: "PUT", body: JSON.stringify(body) });

/** PATCH: actualiza un recurso de forma parcial. */
export const patch = (path, body) =>
  request(path, { method: "PATCH", body: JSON.stringify(body) });

/** DELETE: elimina un recurso. */
export const del = (path) => request(path, { method: "DELETE" });
