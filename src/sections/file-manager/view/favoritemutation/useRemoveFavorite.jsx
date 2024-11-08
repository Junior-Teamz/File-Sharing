import { useMutation } from '@tanstack/react-query';
import axiosInstance, { endpoints } from 'src/utils/axios';

export const useRemoveFavorite = () => {
  return useMutation({
    mutationKey: ['remove.favorite.file'],
    mutationFn: async ({ file_id }) => {
      const response = await axiosInstance.delete(`${endpoints.files.deleteFavorit}/${file_id}`);
      return response;
    },
  });
};
