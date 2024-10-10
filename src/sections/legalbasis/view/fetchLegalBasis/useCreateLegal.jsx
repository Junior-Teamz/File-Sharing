import { useMutation } from '@tanstack/react-query';
import axiosInstance, { endpoints } from 'src/utils/axios';

export const useCreateLegal = ({ onSuccess , onError}) => {
  return useMutation({
    mutationKey: ['create.legal'],
    mutationFn: async (data) => {
      const response = await axiosInstance.post(endpoints.Legal.SaveLegal, data);
      return response;
    },
    onSuccess,
    onError
  });
};
