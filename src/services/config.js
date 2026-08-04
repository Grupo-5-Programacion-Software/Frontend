/**
 * ==========================================================
 * CONFIGURACIÓN GLOBAL DEL FRONTEND
 * ==========================================================
 *
 * Centraliza la URL base de la API. El valor se lee desde la
 * variable de entorno `VITE_API_BASE_URL` definida en `.env`.
 *
 * Vite expone a través de `import.meta.env` todas las variables
 * que comienzan con el prefijo `VITE_`.
 *
 * En desarrollo el proxy de Vite redirige `/api` hacia el backend
 * (ver `vite.config.js`), evitando problemas de CORS y URLs
 * hardcodeadas dentro del código.
 */
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "/api";

export { API_BASE_URL };
