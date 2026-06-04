const TASKS_URL = "http://10.5.225.223:3000/tasks";

export async function getTasks() {
    const response = await fetch(TASKS_URL);
    return await response.json();
}

export async function createTask(task) {
    const response = await fetch(TASKS_URL, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(task)
    });

    return await response.json();
}

export async function updateTask(id, task) {
    const response = await fetch(`${TASKS_URL}/${id}`, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(task)
    });

    return await response.json();
}

export async function deleteTask(id) {
    await fetch(`${TASKS_URL}/${id}`, {
        method: "DELETE"
    });
}