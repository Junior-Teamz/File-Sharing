import { useMutation } from '@tanstack/react-query';
import axiosInstance, { endpoints } from 'src/utils/axios';

export const useAddFavorite = () => {
  return useMutation({
    mutationKey: ['add.favorite'],
    mutationFn: async (formData) => {
      const response = await axiosInstance.post(endpoints.files.addFavorit, formData);
      return response;
    },
   
  });
};
