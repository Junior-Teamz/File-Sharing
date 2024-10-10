import { useMutation } from '@tanstack/react-query';
import axiosInstance, { endpoints } from 'src/utils/axios';

export const useRemoveFavoriteUser = () => {
  return useMutation({
    mutationKey: ['remove.favorite'],
    mutationFn: async (fileId) => {
      const response = await axiosInstance.delete(`${endpoints.file.deleteFavoritUser}${fileId} `);
      return response;
    },
    
  });
};
