import { useMutation } from '@tanstack/react-query';
import axiosInstance, { endpoints } from 'src/utils/axios';

export const useRemoveFavorite = () => {
  return useMutation({
    mutationKey: ['remove.favorite'],
    mutationFn: async (formData) => {
      const response = await axiosInstance.delete(endpoints.files.deleteFavoritUser, formData);
      return response;
    },
    
  });
};
