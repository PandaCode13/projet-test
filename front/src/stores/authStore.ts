// src/stores/authStore.ts - Version simplifiée
import { create } from 'zustand';

interface AuthStore {
  user: any | null;
  token: string | null;
  isLoading: boolean;
  error: string | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
}

export const useAuthStore = create<AuthStore>((set) => ({
  user: null,
  token: null,
  isLoading: false,
  error: null,
  
  login: async (email: string, password: string) => {
    set({ isLoading: true, error: null });
    
    try {
      // Simulation - remplacez par votre appel API
      console.log('Tentative de connexion:', email);
      
      // Simuler un délai
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Simulation de succès
      set({
        user: { id: '1', email, name: 'Test User' },
        token: 'fake-jwt-token',
        isLoading: false,
        error: null,
      });
      
      localStorage.setItem('glycamed_token', 'fake-jwt-token');
      localStorage.setItem('glycamed_user', JSON.stringify({ id: '1', email, name: 'Test User' }));
      
    } catch (error: any) {
      set({
        error: error.message || 'Erreur de connexion',
        isLoading: false,
      });
    }
  },
  
  logout: () => {
    set({ user: null, token: null });
    localStorage.removeItem('glycamed_token');
    localStorage.removeItem('glycamed_user');
  },
}));
