const API_URL = "http://localhost:3333/api/v1";

export async function loginDemoAdmin() {
  try {
    const res = await fetch(`${API_URL}/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: "admin@demo.com", password: "Password@123" }),
    });
    
    if (res.ok) {
      const data = await res.json();
      const token = data.data?.accessToken;
      if (token) {
        localStorage.setItem("access_token", token);
        return token;
      }
    }
  } catch (error) {
    console.warn("Failed to login as demo admin (is the backend running?)", error);
  }
  return null;
}

export async function apiFetch(endpoint: string, options: RequestInit = {}) {
  let token = typeof window !== "undefined" ? localStorage.getItem("access_token") : null;
  
  if (!token && typeof window !== "undefined") {
    // Attempt auto-login
    token = await loginDemoAdmin();
  }

  const headers = new Headers(options.headers || {});
  headers.set("Content-Type", "application/json");
  if (token) {
    headers.set("Authorization", `Bearer ${token}`);
  }

  const response = await fetch(`${API_URL}${endpoint}`, {
    ...options,
    headers,
  });

  // Basic interceptor to handle unauth
  if (response.status === 401 && typeof window !== "undefined") {
    console.warn("Unauthorized. Clearing token.");
    localStorage.removeItem("access_token");
  }

  return response;
}
