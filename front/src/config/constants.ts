export const API_CONFIG = {
  BASE_URL: 'http://localhost:3000',
  ENDPOINTS: {
    // Auth
    LOGIN: '/auth/login',
    REGISTER: '/auth/register',
    
    // Stats
    STATS: '/stats',
    HISTORY: '/history',
    DASHBOARD: '/stats/dashboard',
    
    // Foods
    FOODS: '/foods',
    FOODS_SEARCH: '/foods/search',
  }
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
