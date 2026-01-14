// src/services/api.ts - Version corrigée
import axios from 'axios';
import { API_CONFIG, STORAGE_KEYS } from '../config/constants';
import type { DashboardStatistics } from '@/types'; // Ajout de l'import

// Créer une instance axios
const apiClient = axios.create({
  baseURL: API_CONFIG.BASE_URL,
  headers: { 'Content-Type': 'application/json' },
});

// Ajouter le token automatiquement
apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem(STORAGE_KEYS.TOKEN);
  if (token && config.headers) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Gérer les erreurs globalement
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem(STORAGE_KEYS.TOKEN);
      localStorage.removeItem(STORAGE_KEYS.USER);
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Services exportés
export const authService = {
  login: (email: string, password: string) => 
    apiClient.post(API_CONFIG.ENDPOINTS.LOGIN, { email, password }),
  
  register: (data: any) => 
    apiClient.post(API_CONFIG.ENDPOINTS.REGISTER, data),
};

export const statsService = {
  getTodayStats: () => apiClient.get(API_CONFIG.ENDPOINTS.STATS),
  getHistory: () => apiClient.get(API_CONFIG.ENDPOINTS.HISTORY),
  getDashboardStats: () => {
    return apiClient.get<DashboardStatistics>('/stats/dashboard');
  }
};

export const foodService = {
  searchFoods: (query: string) => 
    apiClient.get(`${API_CONFIG.ENDPOINTS.FOODS_SEARCH}?q=${encodeURIComponent(query)}`),
  
  addFood: (data: any) => 
    apiClient.post(API_CONFIG.ENDPOINTS.FOODS, data),
};

export default apiClient; // Important: exporter apiClient, pas api