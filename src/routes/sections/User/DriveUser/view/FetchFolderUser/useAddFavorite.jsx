import { useMutation } from '@tanstack/react-query';
import axiosInstance, { endpoints } from 'src/utils/axios';

export const useAddFavorite = ({ onSuccess, onError }) => {
  return useMutation({
    mutationKey: ['add.favorite'],
    mutationFn: async (data) => {
      const response = await axiosInstance.post(endpoints.folders.addFavoritUser, data);
      return response;
    },
    onSuccess,
    onError,
  });
};
