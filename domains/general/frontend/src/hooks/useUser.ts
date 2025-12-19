import { useMutation, useQueryClient } from '@tanstack/react-query';
import type { CurrentUser } from '../types.ts';

// Since we're storing user data in localStorage and managing it through context,
// we don't need a query for getting current user
// But we can still use mutations for updating user data

export const useUpdateProfile = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (userData: Partial<CurrentUser>) => {
      // This would need to be implemented based on actual backend endpoints
      // For now, we'll just update localStorage
      const currentUserData = localStorage.getItem('user');
      if (currentUserData) {
        const currentUser = JSON.parse(currentUserData);
        const updatedUser = { ...currentUser, ...userData };
        localStorage.setItem('user', JSON.stringify(updatedUser));
        return updatedUser;
      }
      throw new Error('No user data found');
    },
    onSuccess: (updatedUser) => {
      // Update the user data in the cache
      queryClient.setQueryData(['user'], updatedUser);
    },
  });
};