import { create } from 'zustand';
import axios from 'axios';
import BAKCEND_URL from './urls';

const useDiseaseDetectionStore = create((set) => ({
  disease: null,
  treatment: null,
  error: null,
  detectDisease: async (symptoms, imageFile = null) => {
    try {
      // Prepare the data to be sent in the request
      const requestData = new FormData();
      requestData.append('symptoms', JSON.stringify({ symptoms: symptoms }));
    //   if (imageFile) {
    //     requestData.append('image', imageFile);
    //   }

      const response = await axios.post(`${BAKCEND_URL}/detect/disease/animal/`, requestData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      // Update state with response data
      set({
        disease: response.data.disease,
        treatment: response.data.treatment,
        error: null,
      });
    } catch (error) {
      // Handle errors
      set({
        disease: null,
        treatment: null,
        error: error.response ? error.response.data.error : 'An error occurred',
      });
    }
  },
}));

export default useDiseaseDetectionStore;
