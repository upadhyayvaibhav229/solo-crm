const API =
  import.meta.env.VITE_API_URL ||
  `http://${typeof window === "undefined" ? "localhost" : window.location.hostname}:8000/api`;

async function readResponse(response) {
  const text = await response.text();
  if (!text) return {};

  try {
    return JSON.parse(text);
  } catch {
    return { detail: text };
  }
}

export async function refreshSession() {
  const response = await fetch(`${API}/auth/login/refresh/`, {
    method: "POST",
    credentials: "include",
  });

  if (!response.ok) return false;
  return true;
}

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

  const data = await readResponse(response);

  if (!response.ok) {
    throw new Error(data.detail || "Invalid username or password");
  }

  return data;
}

export async function getMe() {
  let response = await fetch(`${API}/auth/me/`, {
    credentials: "include",
  });

  if (response.status === 401) {
    if (await refreshSession()) {
      response = await fetch(`${API}/auth/me/`, {
        credentials: "include",
      });
    }
  }

  const data = await readResponse(response);

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
  const data = await readResponse(response);

  if (!response.ok) {
    throw new Error(data.detail || "Logout failed");
  }

  return data;
}
