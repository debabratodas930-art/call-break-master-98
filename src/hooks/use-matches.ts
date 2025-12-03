import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '@/lib/api';
import { Match } from '@/lib/types';

export const useMatches = () => {
  return useQuery({
    queryKey: ['matches'],
    queryFn: () => api.getMatches(),
  });
};

export const useAddMatch = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (match: Omit<Match, '_id'>) => api.addMatch(match),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['matches'] });
    },
  });
};

export const useUpdateMatch = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ id, match }: { id: string; match: Partial<Match> }) => 
      api.updateMatch(id, match),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['matches'] });
    },
  });
};
