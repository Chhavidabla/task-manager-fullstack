import axios from "axios";

const client = axios.create({
  baseURL: process.env.REACT_APP_API_URL || "http://localhost:3001/api",
  headers: { "Content-Type": "application/json" },
  timeout: 8000,
});

// Unwrap the consistent { success, data, error } envelope
client.interceptors.response.use(
  (res) => res.data,
  (err) => {
    const message =
      err.response?.data?.error ||
      err.message ||
      "Something went wrong. Please try again.";
    return Promise.reject(new Error(message));
  }
);

const taskApi = {
  getAll: (filter = "all") =>
    client.get("/tasks", { params: { filter } }).then((r) => r.data),

  create: (title) =>
    client.post("/tasks", { title }).then((r) => r.data),

  update: (id, updates) =>
    client.patch(`/tasks/${id}`, updates).then((r) => r.data),

  toggle: (id, completed) =>
    client.patch(`/tasks/${id}`, { completed }).then((r) => r.data),

  remove: (id) =>
    client.delete(`/tasks/${id}`).then((r) => r.data),
};

export default taskApi;
