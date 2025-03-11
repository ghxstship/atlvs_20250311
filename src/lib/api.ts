import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_XANO_API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add request interceptor for authentication
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const exportToCsv = async (endpoint: string) => {
  const response = await api.get(`${endpoint}/export`, {
    responseType: 'blob',
  });
  
  const url = window.URL.createObjectURL(new Blob([response.data]));
  const link = document.createElement('a');
  link.href = url;
  link.setAttribute('download', `${endpoint}-export.csv`);
  document.body.appendChild(link);
  link.click();
  link.remove();
};

export default api;