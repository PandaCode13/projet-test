// src/services/api.ts - Version complète et corrigée
import axios from 'axios';
import { API_CONFIG, STORAGE_KEYS } from '../config/constants';
import type { DashboardStatistics } from '@/types';

// ==================== TYPES ====================
export interface LoginData {
  email: string;
  password: string;
}

export interface RegisterData {
  email: string;
  password: string;
  firstName?: string;
  lastName?: string;
}

export interface FoodData {
  name: string;
  sugar: number;
  caffeine: number;
  date?: string;
}

// ==================== AXIOS INSTANCE ====================
const apiClient = axios.create({
  baseURL: API_CONFIG.BASE_URL,
  headers: { 'Content-Type': 'application/json' },
  timeout: 10000,
});

// Request interceptor
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem(STORAGE_KEYS.TOKEN);
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem(STORAGE_KEYS.TOKEN);
      localStorage.removeItem(STORAGE_KEYS.USER);
      window.location.href = '/login';
    }
    
    const errorMessage = error.response?.data?.message || error.message || 'Une erreur est survenue';
    return Promise.reject(new Error(errorMessage));
  }
);

// ==================== API SERVICES ====================
// Auth service
export const authAPI = {
  login: (data: LoginData) => 
    apiClient.post<{ token: string; user: any }>(API_CONFIG.ENDPOINTS.LOGIN, data),
  
  register: (data: RegisterData) => 
    apiClient.post<{ token: string; user: any }>(API_CONFIG.ENDPOINTS.REGISTER, data),
};

// Stats service
export const statsAPI = {
  getTodayStats: () => 
    apiClient.get(API_CONFIG.ENDPOINTS.STATS),
  
  getHistory: (startDate?: string, endDate?: string) => {
    const params = new URLSearchParams();
    if (startDate) params.append('startDate', startDate);
    if (endDate) params.append('endDate', endDate);
    return apiClient.get(`${API_CONFIG.ENDPOINTS.HISTORY}?${params.toString()}`);
  },
  
  getDashboard: () =>
    apiClient.get<DashboardStatistics>(API_CONFIG.ENDPOINTS.DASHBOARD),
};

// Food service - CORRIGEZ ICI
export const foodAPI = {
  searchFoods: (query: string) =>
    apiClient.get(`${API_CONFIG.ENDPOINTS.FOODS_SEARCH}?q=${encodeURIComponent(query)}`),
  
  addConsumption: (foodData: FoodData) =>
    apiClient.post(API_CONFIG.ENDPOINTS.FOODS, foodData),
  
  getAllFoods: () =>
    apiClient.get(API_CONFIG.ENDPOINTS.FOODS),
};

// Export par défaut
export default apiClient;