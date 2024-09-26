import { useMutation } from '@tanstack/react-query';
import axiosInstance, { endpoints } from 'src/utils/axios';

export const useDeleteFavorite = () => {
  return useMutation({
    mutationKey: ['delete.favorit'],
    mutationFn: async (formData) => {
      const response = await axiosInstance.delete(endpoints.folders.deleteFavoritUser, formData);
      return response;
    },
    
  });
};
