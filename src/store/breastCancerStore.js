import { create } from 'zustand';
import axios from 'axios';

const useBreastCancerStore = create((set) => ({
  result: null,
  metrics: null,
  loading: false,
  metricsLoading: false,
  error: null,
  metricsError: null,

  detectBreastCancer: async (imageFile) => {
    set({ loading: true, error: null });
    try {
      const formData = new FormData();
      formData.append('image', imageFile);

      const response = await axios.post('http://localhost:8000/api/predict/', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      set({ result: response.data, loading: false });
      return response.data;
    } catch (error) {
      set({
        error: error.response?.data?.message || 'Error detecting breast cancer',
        loading: false,
      });
      throw error;
    }
  },

  fetchModelMetrics: async () => {
    set({ metricsLoading: true, metricsError: null });
    try {
      const response = await axios.get('http://localhost:8000/api/metrics/');
      set({ metrics: response.data, metricsLoading: false });
      return response.data;
    } catch (error) {
      set({
        metricsError: error.response?.data?.message || 'Error fetching metrics',
        metricsLoading: false,
      });
      throw error;
    }
  },

  resetState: () => {
    set({
      result: null,
      metrics: null,
      loading: false,
      metricsLoading: false,
      error: null,
      metricsError: null,
    });
  },
}));

export default useBreastCancerStore; 