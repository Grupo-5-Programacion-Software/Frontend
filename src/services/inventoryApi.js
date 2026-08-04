/**
 * ==========================================================
 * SERVICIO DE INVENTARIO (inventoryApi.js)
 * ==========================================================
 *
 * Centraliza las peticiones HTTP relacionadas con el módulo
 * de inventario: categorías y productos.
 *
 * Cada función delega el transporte en el wrapper `api.js` y
 * devuelve únicamente el campo `data` de la respuesta.
 *
 * Funcionalidades:
 * - CRUD de categorías.
 * - CRUD de productos.
 */
import { get, post, put, del } from "./api.js";

/* ==========================
   CATEGORÍAS
========================== */

/** Obtiene todas las categorías registradas. */
export const obtenerCategorias = () => get("/categories").then((j) => j.data);

/** Obtiene una categoría específica por su identificador. */
export const obtenerCategoriaPorId = (id) =>
  get(`/categories/${id}`).then((j) => j.data);

/** Crea una nueva categoría. */
export const crearCategoria = (name) =>
  post("/categories", { name }).then((j) => j.data);

/** Actualiza el nombre de una categoría existente. */
export const actualizarCategoria = (id, name) =>
  put(`/categories/${id}`, { name }).then((j) => j.data);

/** Elimina una categoría (solo si no tiene productos vinculados). */
export const eliminarCategoria = (id) => del(`/categories/${id}`);

/* ==========================
   PRODUCTOS
========================== */

/** Obtiene todos los productos disponibles. */
export const obtenerProductos = () => get("/products").then((j) => j.data);

/** Consulta un producto específico por su identificador. */
export const obtenerProductoPorId = (id) =>
  get(`/products/${id}`).then((j) => j.data);

/** Registra un nuevo producto en el sistema. */
export const crearProducto = (producto) =>
  post("/products", producto).then((j) => j.data);

/** Actualiza la información de un producto existente. */
export const actualizarProducto = (id, producto) =>
  put(`/products/${id}`, producto).then((j) => j.data);

/** Elimina un producto del sistema. */
export const eliminarProducto = (id) => del(`/products/${id}`);
