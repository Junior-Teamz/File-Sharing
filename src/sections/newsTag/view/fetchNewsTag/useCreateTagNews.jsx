import { useMutation } from '@tanstack/react-query';
import axiosInstance, { endpoints } from 'src/utils/axios';

export const useCreateTagNews = ({ onSuccess, onError }) => {
  return useMutation({
    mutationKey: ['create.tag'],
    mutationFn: async (data) => {
      const response = await axiosInstance.post(endpoints.NewsTag.create, data);
      return response;
    },
    onSuccess,
    onError
  });
};
