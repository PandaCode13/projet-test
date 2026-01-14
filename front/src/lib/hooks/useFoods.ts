// src/lib/hooks/useFoods.ts
import { useQuery } from '@tanstack/react-query';
import { foodAPI } from '@/services/api';

// Hook pour rechercher des aliments
export const useSearchFoods = (query: string) => {
  return useQuery({
    queryKey: ['foods', 'search', query],
    queryFn: () => foodAPI.searchFoods(query),
    enabled: query.length > 2,
    staleTime: 10 * 60 * 1000,
  });
};

// Hook pour obtenir tous les aliments
export const useAllFoods = () => {
  return useQuery({
    queryKey: ['foods', 'all'],
    queryFn: () => foodAPI.getAllFoods(),
  });
};