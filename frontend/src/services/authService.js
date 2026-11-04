import { api } from "./api";
export const auth = {
  login: async (data) => {
    const { data: r } = await api.post("/auth/login", data);
    localStorage.setItem("token", r.token);
    localStorage.setItem("user", JSON.stringify(r.user));
    return r;
  },
  register: async (data) => {
    const { data: r } = await api.post("/auth/register", data);
    localStorage.setItem("token", r.token);
    localStorage.setItem("user", JSON.stringify(r.user));
    return r;
  },
  logout: () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
  },
  user: () => {
    try {
      return JSON.parse(localStorage.getItem("user"));
    } catch {
      return null;
    }
  },
  logged: () => !!localStorage.getItem("token"),
};
