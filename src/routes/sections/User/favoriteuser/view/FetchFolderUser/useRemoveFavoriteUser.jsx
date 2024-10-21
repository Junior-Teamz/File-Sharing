import { useMutation } from '@tanstack/react-query';
import axiosInstance, { endpoints } from 'src/utils/axios';

export const useRemoveFavoriteUser = () => {
  return useMutation({
    mutationKey: ['remove.favorite'],
    mutationFn: async ({ file_id }) => {
      const response = await axiosInstance.delete(`${endpoints.file.deleteFavoritUser}/${file_id}`);
      return response.data; // Ambil data dari respons
    },
    onError: (error) => {
      console.error('Error removing favorite:', error.response ? error.response.data : error.message);
    },
  });
};
