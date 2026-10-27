import axios from "axios";
const BASE_URL = import.meta.env.VITE_API_URL;
const API_BASE_URL = "https://portfolio-backend-qznm.onrender.com";

export const getToken = () => localStorage.getItem("token");
export const setToken = (token) => localStorage.setItem("token", token);
export const clearToken = () => localStorage.removeItem("token");
export const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

async function request(path, { method = "GET", body } = {}) {
  const headers = {};
  if (body !== undefined) headers["Content-Type"] = "application/json";

  const token = getToken();
  if (token) headers.Authorization = `Bearer ${token}`;

  const res = await fetch(`${BASE_URL}${path}`, {
    method,
    headers,
    body: body !== undefined ? JSON.stringify(body) : undefined,
  });

  // 
  if (res.status === 401) clearToken();

  if (!res.ok) {
    const error = new Error((await res.text()) || `Request failed (${res.status})`);
    error.status = res.status;
    throw error;
  }
  return res.status === 204 ? null : res.json();
}

export const api = {
  get: (path) => request(path),
  post: (path, body) => request(path, { method: "POST", body }),
  put: (path, body) => request(path, { method: "PUT", body }),
  delete: (path) => request(path, { method: "DELETE" }),
};