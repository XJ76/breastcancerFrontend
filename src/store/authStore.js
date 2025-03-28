import { create } from 'zustand';
import axios from 'axios';

const useAuthStore = create((set) => ({
  token: localStorage.getItem('token') || null,
  isAuthenticated: !!localStorage.getItem('token'),
  error: null,
  loading: false,

  login: async (email, password) => {
    set({ loading: true, error: null });
    try {
      const response = await axios.post('https://auth-backend-qyna.onrender.com/api/login', {
        email,
        password,
      });
      const { token } = response.data;
      localStorage.setItem('token', token);
      set({ token, isAuthenticated: true, loading: false });
      return true;
    } catch (error) {
      set({
        error: error.response?.data?.message || 'Login failed',
        loading: false,
      });
      return false;
    }
  },

  register: async (email, password) => {
    set({ loading: true, error: null });
    try {
      const response = await axios.post('https://auth-backend-qyna.onrender.com/api/register', {
        email,
        password,
      });
      const { token } = response.data;
      localStorage.setItem('token', token);
      set({ token, isAuthenticated: true, loading: false });
      return true;
    } catch (error) {
      set({
        error: error.response?.data?.message || 'Registration failed',
        loading: false,
      });
      return false;
    }
  },

  logout: () => {
    localStorage.removeItem('token');
    set({ token: null, isAuthenticated: false, error: null });
  },
}));

export default useAuthStore; 