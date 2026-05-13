import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_BASE_URL
});

/**
 * Submit crop and soil images with form data for AI analysis
 * @param {FormData} formData - Multipart form data with images and fields
 * @returns {object} { success, reportId, result }
 */
export const analyzeImage = async (formData) => {
  try {
    const response = await api.post('/analyze', formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
    return response.data;
  } catch (error) {
    const message = error.response?.data?.error || error.message || 'Analysis failed';
    throw new Error(message);
  }
};


