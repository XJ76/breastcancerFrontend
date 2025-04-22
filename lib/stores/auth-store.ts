import axios from "axios"
import { create } from "zustand"

// Helper function to safely access localStorage
const getLocalStorage = (key: string) => {
  if (typeof window !== "undefined") {
    return localStorage.getItem(key)
  }
  return null
}

const useAuthStore = create((set) => ({
  token: getLocalStorage("token") || null,
  isAuthenticated: !!getLocalStorage("token"),
  error: null,
  loading: false,
  userRole: getLocalStorage("userRole") || null,

  login: async (email, password) => {
    set({ loading: true, error: null })
    try {
      const response = await axios.post("https://auth-backend-qyna.onrender.com/api/login", {
        email,
        password,
      })
      const { token, role } = response.data
      if (typeof window !== "undefined") {
        localStorage.setItem("token", token)
        localStorage.setItem("userRole", role)
      }
      set({ token, isAuthenticated: true, userRole: role, loading: false })
      return true
    } catch (error) {
      set({
        error: error.response?.data?.message || "Login failed",
        loading: false,
      })
      return false
    }
  },

  register: async (email, password) => {
    set({ loading: true, error: null })
    try {
      const response = await axios.post("https://auth-backend-qyna.onrender.com/api/register", {
        email,
        password,
      })
      const { token } = response.data
      if (typeof window !== "undefined") {
        localStorage.setItem("token", token)
      }
      set({ token, isAuthenticated: true, loading: false })
      return true
    } catch (error) {
      set({
        error: error.response?.data?.message || "Registration failed",
        loading: false,
      })
      return false
    }
  },

  logout: () => {
    if (typeof window !== "undefined") {
      localStorage.removeItem("token")
      localStorage.removeItem("userRole")
    }
    set({ token: null, isAuthenticated: false, userRole: null, error: null })
  },
}))

export default useAuthStore
