// src/config/constants.ts
export const API_CONFIG = {
  BASE_URL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000',
  ENDPOINTS: {
    LOGIN: '/auth/login',
    REGISTER: '/auth/register',
    STATS: '/stats',
    HISTORY: '/history',
    DASHBOARD: '/stats/dashboard',
    FOODS: '/foods',
    FOODS_SEARCH: '/foods/search',
  }
};

export const APP_CONFIG = {
  NAME: import.meta.env.VITE_APP_NAME || 'GlycAmed',
  VERSION: '1.0.0',
  ENV: import.meta.env.VITE_APP_ENV || 'development',
};

export const STORAGE_KEYS = {
  TOKEN: 'glycamed_token',
  USER: 'glycamed_user',
};

export const ROUTES = {
  LOGIN: '/login',
  REGISTER: '/register',
  DASHBOARD: '/',
  HISTORY: '/history',
  PROFILE: '/profile',
} as const;

export const HEALTH_LIMITS = {
  SUGAR_MAX: 50, // 50g
  CAFFEINE_MAX: 400, // 400mg
  CALORIES_MAX: 2000, // 2000 kcal
} as const;

// Optionnel: Ajoutez aussi les endpoints manquants
export const API_ENDPOINTS = {
  AUTH: {
    LOGIN: '/auth/login',
    REGISTER: '/auth/register'
  },
  STATS: {
    DASHBOARD: '/stats/dashboard',
    HISTORY: '/stats/history',
    FOODS: '/stats/foods'
  }
};
