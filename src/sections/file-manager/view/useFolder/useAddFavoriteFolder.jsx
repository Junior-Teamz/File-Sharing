import { useMutation } from '@tanstack/react-query';
import axiosInstance, { endpoints } from 'src/utils/axios';

export const useAddFavoriteFolder = () => {
  return useMutation({
    mutationKey: ['add.favorite.folder'],
    mutationFn: async (data) => {
      const response = await axiosInstance.post(endpoints.folder.addFavorit, data);
      return response;
    },
    // onSuccess,
  });
};
