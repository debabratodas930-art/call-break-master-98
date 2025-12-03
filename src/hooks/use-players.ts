import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '@/lib/api';
import { Player } from '@/lib/types';

export const usePlayers = () => {
  return useQuery({
    queryKey: ['players'],
    queryFn: () => api.getPlayers(),
  });
};

export const useAddPlayer = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (name: string) => api.addPlayer(name),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['players'] });
    },
  });
};

export const useDeletePlayer = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (id: string) => api.deletePlayer(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['players'] });
    },
  });
};

export const useUpdatePlayerStats = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ id, stats }: { id: string; stats: Partial<Player> }) => 
      api.updatePlayerStats(id, stats),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['players'] });
    },
  });
};
