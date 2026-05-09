import { create } from "zustand";
import axios from "../lib/axios.js";
import { toast } from "react-hot-toast";

export const useUserStore = create((set, get) => ({
  user: null,
  loading: false,
  checkingAuth: true,

  signup: async ({ name, email, password, confirmPassword }) => {
    set({ loading: true });
    if (password !== confirmPassword) {
      set({ loading: false });
      return toast.error("Password do not match");
    }
    try {
      const res = await axios.post("/auth/signup", {
        name,
        email,
        password,
      });
      set({ user: res.data, loading: false });
      toast.success("Welcome aboard and happy shopping!");
    } catch (error) {
      set({ loading: false });
      toast.error(error.response.data.message || "An error occured");
    } finally {
      set({ loading: false });
    }
  },

  login: async ({ email, password }) => {
    set({ loading: true });
    try {
      const res = await axios.post("/auth/login", {
        email,
        password,
      });
      set({ user: res.data, loading: false });
      toast.success("Login successfully!");
    } catch (error) {
      set({ loading: false });
      toast.error(error.response?.data?.message || "Login failed");
    } finally {
      set({ loading: false });
    }
  },

  logout: async () => {
    try {
      await axios.post("auth/logout");
      set({
        user: null,
      });
    } catch (error) {
      toast.message(error?.data?.message || "An error occured during logout");
    }
  },

  checkAuth: async () => {
    set({ checkingAuth: true });
    try {
      const response = await axios.get("auth/profile");
      set({
        user: response.data,
        checkingAuth: false,
      });
    } catch (error) {
      console.log("Error in checkingAuth function:", error.message);
      set({
        checkingAuth: false,
        user: null,
        loading: false,
      });
    }
  },

  refreshToken: async () => {
    if (get().checkAuth) return;
    try {
      const response = await axios.post("/auth/refresh-token");
      set({
        checkingAuth: false,
      });
      return response.data;
    } catch (error) {
      set({
        user: null,
        checkingAuth: false,
      });
      throw error;
    }
  },
}));
// TODO: Implement the axios interceptor for refresh accesstoken 15m

// axios interceptor for token referesh
let refreshPromise = null;

axios.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequst = error.config;
    if (error.response?.status === 401 && !originalRequst._retry) {
      originalRequst._retry = true;
      try {
        if (refreshPromise) {
          await refreshPromise;
          return axios(originalRequst);
        }
        refreshPromise = useUserStore.getState().refreshToken();
        await refreshPromise;
        refreshPromise = null;
        return axios(originalRequst);
      } catch (refereshError) {
        // If refresh fails redirect to Login or handle as needed
        useUserStore.getState().logout();
        return Promise.reject(refereshError);
      }
    }
    return Promise.reject(error);
  },
);
