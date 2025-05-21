// ------------ WITH AXIOS ---------------------
// ✅ Step 1: Import axios
import axios from "axios";

// ✅ Step 2: Set your base URL from environment
const baseURL = import.meta.env.VITE_BACKEND_BASE_URL;

// ✅ Step 3: Create an axios instance
const api = axios.create({
  baseURL, // your API base URL
  withCredentials: true, // 👈 this makes it default for all
  headers: {
    "Content-Type": "application/json",
  },
});

// ✅ Step 4: Add a request interceptor to add token to headers automatically
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token"); // get token from localStorage
  if (token) {
    config.headers.Authorization = `Bearer ${token}`; // set Authorization header
  }
  return config;
});

// ✅ Step 5: Export reusable methods for GET, POST, PUT, PATCH, DELETE
export const apiRequest = {
  get: (url, config = {}) => api.get(url, config),
  post: (url, data, config = {}) => api.post(url, data, config),
  put: (url, data, config = {}) => api.put(url, data, config),
  patch: (url, data, config = {}) => api.patch(url, data, config),
  delete: (url, config = {}) => api.delete(url, config),
};
