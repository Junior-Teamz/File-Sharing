import { useMutation } from '@tanstack/react-query';
import axiosInstance, { endpoints } from 'src/utils/axios';

export const useRemoveFavoriteFolder = () => {
  return useMutation({
    mutationKey: ['remove.favorite.folder'],
    mutationFn: async ({ id }) => {
      const response = await axiosInstance.delete(`${endpoints.folder.deleteFavorit}/${id}`);
      return response;
    },
  });
};
