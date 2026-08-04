/**
 * ==========================================================
 * SERVICIO DE COMUNICACIÓN CON LA API (USUARIOS)
 * ==========================================================
 *
 * Este módulo centraliza las peticiones HTTP relacionadas
 * con la gestión de usuarios.
 *
 * Funcionalidades:
 * - Consultar la lista de usuarios registrados.
 * - Crear un nuevo usuario.
 *
 * Nota: el resto de operaciones (tareas) se encuentran en
 * la versión heredada dentro de la carpeta 13/.
 */

const URL = "http://10.5.225.223:3000";

/* ==========================
   USUARIOS
========================== */

// Obtiene todos los usuarios registrados en el servidor.
export async function obtenerUsuarios() {
  const response = await fetch(`${URL}/users`);

  if (!response.ok) {
    throw new Error("Error al cargar usuarios");
  }

  return await response.json();
}

// Registra un nuevo usuario en el servidor.
export async function crearUsuario(userData) {

export async function obtenerUsuarios() {
  const response = await fetch(`${URL}/users`);

  if (!response.ok) {
    throw new Error("Error al cargar usuarios");
  }

  return await response.json();
}

export async function crearUsuario(userData) {
  const response = await fetch(`${URL}/users`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(userData)
  });

  if (!response.ok) {
    throw new Error("Error al crear usuario");
  }

  return await response.json();
}