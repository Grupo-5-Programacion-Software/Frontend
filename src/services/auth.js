/**
 * ==========================================================
 * SERVICIO DE AUTENTICACIÓN (auth.js)
 * ==========================================================
 *
 * Implementa un inicio de sesión SIMULADO solo en el frontend:
 * las credenciales se validan en el navegador contra una lista
 * local de usuarios y la sesión se conserva en `localStorage`.
 *
 * No depende del backend: el propósito es demostrar el flujo
 * de autenticación y el control de acceso por rol en la UI.
 *
 * Roles disponibles (coinciden con la base de datos):
 * - Admin      -> acceso total.
 * - Inventario -> módulos de inventario y tareas.
 * - Vendedor   -> solo PQRS.
 */

const CLAVE_SESION = "sig_sesion";

/** Usuarios de demostración (mismos de la BD inventario_adso). */
const USUARIOS = [
  {
    email: "lulizcano.aa@hotmail.com",
    password: "cambiar123",
    name: "Lucia Lizcano",
    role: "Admin",
  },
  {
    email: "prueba@gmail.com",
    password: "cambiar123",
    name: "Prueba",
    role: "Inventario",
  },
  {
    email: "juan@gmail.com",
    password: "cambiar123",
    name: "Juan Perez",
    role: "Vendedor",
  },
];

/** Mapa de acceso: cada rol puede ver ciertas pestañas. */
const ACCESO_POR_ROL = {
  Admin: ["inventory", "tasks", "pqrs", "admin"],
  Inventario: ["inventory", "tasks"],
  Vendedor: ["pqrs"],
};

/**
 * Valida las credenciales y, si son correctas, guarda la sesión.
 * @param {string} email Correo del usuario.
 * @param {string} password Contraseña del usuario.
 * @returns {object} El usuario autenticado.
 * @throws {Error} Si las credenciales no coinciden.
 */
export function iniciarSesion(email, password) {
  const usuario = USUARIOS.find(
    (u) => u.email === email.trim().toLowerCase() && u.password === password
  );

  if (!usuario) {
    throw new Error("Correo o contraseña incorrectos");
  }

  const sesion = {
    email: usuario.email,
    name: usuario.name,
    role: usuario.role,
    timestamp: Date.now(),
  };
  localStorage.setItem(CLAVE_SESION, JSON.stringify(sesion));
  return sesion;
}

/** Cierra la sesión actual eliminándola del almacenamiento local. */
export function cerrarSesion() {
  localStorage.removeItem(CLAVE_SESION);
}

/** Devuelve la sesión activa o `null` si no hay ninguna. */
export function obtenerSesion() {
  try {
    const raw = localStorage.getItem(CLAVE_SESION);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

/** Indica si el usuario actual tiene acceso a una pestaña. */
export function tieneAcceso(tab) {
  const sesion = obtenerSesion();
  if (!sesion) return false;
  const permitidas = ACCESO_POR_ROL[sesion.role] || [];
  return permitidas.includes(tab);
}
