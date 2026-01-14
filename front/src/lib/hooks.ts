// src/lib/hooks.ts - Version simplifiée
import { useAuthStore } from "@/lib/store"; // Votre store existant
import { useEffect, useState } from "react";

// Utiliser DIRECTEMENT le store Zustand
export const useAuth = () => {
  const { 
    user, 
    setUser, 
    logout: storeLogout,
    // Ajoutez ces méthodes si elles existent dans votre store
    // Sinon, nous les créerons
  } = useAuthStore();
  
  // Créer les méthodes manquantes si besoin
  const login = async (email: string, password: string) => {
    // Logique de login - à déplacer depuis AuthProvider
    // Nous adapterons cela plus tard
  };
  
  const register = async (userData: any) => {
    // Logique d'inscription
  };
  
  return {
    user,
    login,
    logout: storeLogout,
    register,
    // Pour compatibilité avec votre Login.tsx
    isLoading: false, // À implémenter
    error: null,     // À implémenter
    clearError: () => {}, // À implémenter
  };
}

export const useDebounce = <T>(value: T, delay: number): T => {
  const [debouncedValue, setDebouncedValue] = useState(value);
  useEffect(() => {
    const handler = setTimeout(() => setDebouncedValue(value), delay);
    return () => clearTimeout(handler);
  }, [value, delay]);
  return debouncedValue;
}