// tests/config.ts
export const TEST_CONFIG = {
  // URL de base (sera combinée avec baseURL de Playwright)
  basePath: '/',
  
  // Timeouts
  navigationTimeout: 30000,
  actionTimeout: 10000,
  
  // Données de test
  testUsers: {
    valid: {
      email: 'test@example.com',
      password: 'password123'
    },
    admin: {
      email: 'admin@example.com',
      password: 'admin123'
    }
  },
  
  // Chemins des pages
  paths: {
    login: '/login',
    register: '/register',
    dashboard: '/dashboard',
    home: '/'
  }
};