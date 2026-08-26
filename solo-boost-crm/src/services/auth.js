const API = import.meta.env.VITE_API_URL || "http://localhost:8000/api";

export async function login({ email, password }) {
  const response = await fetch(`${API}/auth/login/`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
    body: JSON.stringify({
      email,
      password,
    }),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.detail || "Invalid username or password");
  }

  return data;
}

export async function getMe() {
  const response = await fetch(`${API}/auth/me/`, {
    credentials: "include",
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.detail || "Not authenticated");
  }

  return data;
}

export async function logout() {
  const response = await fetch(`${API}/auth/logout/`, {
    method: "POST",
    credentials: "include",
  });

  if (!response.ok) {
    throw new Error("Logout failed");
  }

  return response.json();
}
