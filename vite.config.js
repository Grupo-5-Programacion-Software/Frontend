/**
 * ==========================================================
 * CONFIGURACIÓN DEL EMPAQUETADOR VITE
 * ==========================================================
 *
 * Este archivo define cómo Vite empaqueta la aplicación:
 *
 * 1. `build.outDir`: los archivos de producción se generan en
 *    la carpeta `dist/` lista para publicar (npm run build).
 *
 * 2. `server.proxy`: en desarrollo (npm run dev) cualquier
 *    petición que comience por `/api` se redirige al backend
 *    de Express que corre en `http://localhost:3000`.
 *    Beneficios:
 *      - El navegador solo "habla" con Vite -> sin errores CORS.
 *      - No hay que escribir la URL del backend en el código,
 *        esta queda centralizada aquí y en el archivo `.env`.
 *
 * Nota: el `rewrite` elimina el prefijo `/api`, porque el backend
 * expone sus rutas directamente como `/products`, `/tasks`, etc.
 */
import { defineConfig } from "vite";

export default defineConfig({
  build: {
    outDir: "dist",
    emptyOutDir: true,
  },
  server: {
    proxy: {
      "/api": {
        target: "http://localhost:3000",
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, ""),
      },
    },
  },
});
