const USERS_URL = "http://10.5.225.223:3000/users";

export async function getUsers() {
    const response = await fetch(USERS_URL);
    return await response.json();
}