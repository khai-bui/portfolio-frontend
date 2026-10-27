import axios from "axios";

// URL Backend Spring Boot trên Render
const API_BASE_URL = "https://portfolio-backend-qznm.onrender.com";

export const getToken = () => localStorage.getItem("token");
export const setToken = (token) => localStorage.setItem("token", token);
export const clearToken = () => localStorage.removeItem("token");

// Khai báo duy nhất 1 biến api sử dụng Axios
export const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Tự động gắn JWT Token vào Header khi gọi API
api.interceptors.request.use((config) => {
  const token = getToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Tự động giải nén response.data và tự xóa token nếu bị 401 Unauthorized
api.interceptors.response.use(
  (response) => response.data,
  (error) => {
    if (error.response?.status === 401) {
      clearToken();
    }
    const errMessage = error.response?.data?.message || error.message || "Request failed";
    const customError = new Error(errMessage);
    customError.status = error.response?.status;
    return Promise.reject(customError);
  }
);