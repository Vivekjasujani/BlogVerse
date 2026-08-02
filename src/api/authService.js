import api from "./client";
import { normalizeUser } from "./normalizers";

const authService = {
  async createAccount({ name, email, password }) {
    const { data } = await api.post("/auth/register", { name, email, password });
    return normalizeUser(data.user);
  },

  async login({ email, password }) {
    const { data } = await api.post("/auth/login", { email, password });
    return normalizeUser(data.user);
  },

  async getCurrentUser() {
    try {
      const { data } = await api.get("/auth/me");
      return normalizeUser(data.user);
    } catch (error) {
      if (error.response?.status === 401) return null;
      throw error;
    }
  },

  async logout() {
    await api.post("/auth/logout");
  },
};

export default authService;
