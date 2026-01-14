// src/lib/hooks/useDashboard.ts
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { statsAPI, foodAPI } from '@/services/api'; // Import corrigé
import type { DashboardStatistics } from '@/types'; // Import depuis types, pas api

// Interface locale pour FoodData
interface FoodData {
  name: string;
  sugar: number;
  caffeine: number;
  date?: string;
}

// Hook pour les statistiques du dashboard
export const useDashboardStats = () => {
  return useQuery<DashboardStatistics>({
    queryKey: ['dashboard', 'stats'],
    queryFn: () => statsAPI.getDashboard(),
    staleTime: 5 * 60 * 1000,
    retry: 1,
  });
};

// Hook pour les stats du jour
export const useTodayStats = () => {
  return useQuery({
    queryKey: ['stats', 'today'],
    queryFn: () => statsAPI.getTodayStats(),
    refetchInterval: 30000,
  });
};

// Hook pour l'historique
export const useHistory = (params?: { startDate?: string; endDate?: string }) => {
  return useQuery({
    queryKey: ['history', params],
    queryFn: () => statsAPI.getHistory(params?.startDate, params?.endDate),
  });
};

// Hook pour ajouter une consommation
export const useAddConsumption = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (foodData: FoodData) => foodAPI.addConsumption(foodData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['dashboard', 'stats'] });
      queryClient.invalidateQueries({ queryKey: ['stats', 'today'] });
      queryClient.invalidateQueries({ queryKey: ['history'] });
    },
    onError: (error) => {
      console.error('Erreur lors de l\'ajout:', error);
    },
  });
};