import { create } from "zustand"

// Helper function to safely access localStorage
const getLocalStorage = (key: string) => {
  if (typeof window !== "undefined") {
    return localStorage.getItem(key)
  }
  return null
}

// Helper function to safely set localStorage
const setLocalStorage = (key: string, value: string) => {
  if (typeof window !== "undefined") {
    localStorage.setItem(key, value)
  }
}

// Helper function to safely remove from localStorage
const removeLocalStorage = (key: string) => {
  if (typeof window !== "undefined") {
    localStorage.removeItem(key)
  }
}

export type UserRole = "admin" | "doctor" | "nurse" | "patient"

interface UserData {
  email: string
  firstName: string
  lastName: string
  role: UserRole
  specialty?: string
}

interface AuthState {
  token: string | null
  isAuthenticated: boolean
  error: string | null
  loading: boolean
  userData: UserData | null
  login: (email: string, password: string) => Promise<boolean>
  register: (userData: {
    email: string
    password: string
    firstName: string
    lastName: string
    role: UserRole
    specialty?: string
  }) => Promise<boolean>
  logout: () => void
  updateUserData: (data: Partial<UserData>) => void
}

const useAuthStore = create<AuthState>((set) => ({
  token: getLocalStorage("token") || null,
  isAuthenticated: !!getLocalStorage("token"),
  error: null,
  loading: false,
  userData: getLocalStorage("userData") ? JSON.parse(getLocalStorage("userData") || "{}") : null,

  login: async (email, password) => {
    set({ loading: true, error: null })
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1500))

      // For demo purposes, we'll create mock user data based on email
      let role: UserRole = "patient"
      let specialty = ""

      if (email.includes("admin")) {
        role = "admin"
      } else if (email.includes("doctor")) {
        role = "doctor"
        specialty = "Radiology"
      } else if (email.includes("nurse")) {
        role = "nurse"
      }

      const userData = {
        email,
        firstName: email.split("@")[0],
        lastName: "User",
        role,
        specialty,
      }

      const token = "mock-jwt-token-" + Math.random().toString(36).substring(2)

      setLocalStorage("token", token)
      setLocalStorage("userData", JSON.stringify(userData))

      set({
        token,
        isAuthenticated: true,
        userData,
        loading: false,
      })

      return true
    } catch (error: any) {
      set({
        error: error.response?.data?.message || "Login failed",
        loading: false,
      })
      return false
    }
  },

  register: async (userData) => {
    set({ loading: true, error: null })
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 2000))

      const { email, firstName, lastName, role, specialty } = userData

      const newUserData = {
        email,
        firstName,
        lastName,
        role,
        specialty: specialty || "",
      }

      const token = "mock-jwt-token-" + Math.random().toString(36).substring(2)

      setLocalStorage("token", token)
      setLocalStorage("userData", JSON.stringify(newUserData))

      set({
        token,
        isAuthenticated: true,
        userData: newUserData,
        loading: false,
      })

      return true
    } catch (error: any) {
      set({
        error: error.response?.data?.message || "Registration failed",
        loading: false,
      })
      return false
    }
  },

  logout: () => {
    removeLocalStorage("token")
    removeLocalStorage("userData")
    set({ token: null, isAuthenticated: false, userData: null, error: null })
  },

  updateUserData: (data) => {
    set((state) => {
      const updatedUserData = { ...state.userData, ...data } as UserData
      setLocalStorage("userData", JSON.stringify(updatedUserData))
      return { userData: updatedUserData }
    })
  },
}))

export default useAuthStore
