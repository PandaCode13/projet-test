// src/lib/hooks/useAuth.ts
import { useState } from 'react';
import { useAuthStore } from '@/lib/store'; // Votre store existant
import { authAPI } from '@/services/api'; // Correction: Import depuis services/api

export const useAuth = () => {
  // Utilisez les méthodes existantes de votre store
  const { user, setUser, logout: storeLogout } = useAuthStore();
  
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const login = async (email: string, password: string) => {
    setIsLoading(true);
    setError(null);
    
    try {
      const response = await authAPI.login({ email, password });
      const { token, user: userData } = response.data;
      
      if (token && userData) {
        // Stocker dans localStorage
        localStorage.setItem('glycamed_token', token);
        localStorage.setItem('glycamed_user', JSON.stringify(userData));
        
        // Mettre à jour le store
        setUser(userData);
        return { success: true };
      } else {
        throw new Error('Réponse invalide du serveur');
      }
    } catch (err: any) {
      const errorMessage = err.message || 'Échec de connexion';
      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (userData: any) => {
    setIsLoading(true);
    setError(null);
    
    try {
      const response = await authAPI.register(userData);
      const { token, user: newUser } = response.data;
      
      if (token && newUser) {
        localStorage.setItem('glycamed_token', token);
        localStorage.setItem('glycamed_user', JSON.stringify(newUser));
        setUser(newUser);
        return { success: true };
      } else {
        throw new Error('Réponse invalide du serveur');
      }
    } catch (err: any) {
      const errorMessage = err.message || "Échec d'inscription";
      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    localStorage.removeItem('glycamed_token');
    localStorage.removeItem('glycamed_user');
    storeLogout();
  };

  return {
    user,
    isLoading,
    error,
    login,
    register,
    logout,
    clearError: () => setError(null),
  };
};