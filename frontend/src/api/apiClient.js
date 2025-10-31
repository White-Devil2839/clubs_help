// frontend/src/api/apiClient.js

const BASE_URL = "/api";

function getAuthHeader() {
  const token = localStorage.getItem("token");
  return token ? { Authorization: `Bearer ${token}` } : {};
}

async function request(endpoint, options = {}) {
  const headers = {
    "Content-Type": "application/json",
    ...getAuthHeader(),
    ...options.headers,
  };

  const res = await fetch(`${BASE_URL}${endpoint}`, {
    ...options,
    headers,
  });

  let data;
  try {
    data = await res.json();
  } catch {
    data = { message: "No response data" };
  }

  if (!res.ok) {
    const errMsg = data.message || `Request failed: ${res.status}`;
    throw new Error(errMsg);
  }

  return data;
}

// Named helpers (to support both import styles)
export const get = (endpoint) => request(endpoint, { method: "GET" });
export const post = (endpoint, body) => request(endpoint, { method: "POST", body: JSON.stringify(body) });
export const put = (endpoint, body) => request(endpoint, { method: "PUT", body: JSON.stringify(body) });
export const del = (endpoint) => request(endpoint, { method: "DELETE" });

export const apiClient = { get, post, put, del };
export default apiClient;
