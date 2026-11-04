import { api } from "./api";
export const incidents = {
  mine: () => api.get("/api/incidents/my").then((r) => r.data),
  assigned: () => api.get("/api/incidents/assigned").then((r) => r.data),
  all: () => api.get("/api/incidents").then((r) => r.data),
  detail: (id) => api.get(`/api/incidents/${id}`).then((r) => r.data),
  create: (data) => api.post("/api/incidents", data).then((r) => r.data),
  status: (id, status) =>
    api.put(`/api/incidents/${id}/status`, { status }).then((r) => r.data),
  assign: (id, tech) =>
    api.put(`/api/incidents/${id}/assign/${tech}`).then((r) => r.data),
  comment: (id, content) =>
    api.post(`/api/incidents/${id}/comments`, { content }).then((r) => r.data),
};
