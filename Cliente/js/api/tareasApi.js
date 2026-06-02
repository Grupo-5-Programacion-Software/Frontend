const URL = "http://10.5.225.223:3000";

/* ==========================
   USUARIOS
========================== */

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