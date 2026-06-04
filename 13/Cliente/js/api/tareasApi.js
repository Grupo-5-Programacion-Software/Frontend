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

/* ==========================
   TAREAS
========================== */

export async function obtenerTareas() {
  const response = await fetch(`${URL}/tasks`);

  if (!response.ok) {
    throw new Error("Error al cargar tareas");
  }

  return await response.json();
}

export async function obtenerTarea(id) {
  const response = await fetch(`${URL}/tasks/${id}`);

  if (!response.ok) {
    throw new Error("Error al cargar tarea");
  }

  return await response.json();
}

export async function crearTarea(taskData) {
  const response = await fetch(`${URL}/tasks`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(taskData)
  });

  if (!response.ok) {
    throw new Error("Error al crear tarea");
  }

  return await response.json();
}

export async function actualizarTarea(id, taskData) {
  const response = await fetch(`${URL}/tasks/${id}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(taskData)
  });

  if (!response.ok) {
    throw new Error("Error al actualizar tarea");
  }

  return await response.json();
}

export async function eliminarTarea(id) {
  const response = await fetch(`${URL}/tasks/${id}`, {
    method: "DELETE"
  });

  if (!response.ok) {
    throw new Error("Error al eliminar tarea");
  }

  return true;
}