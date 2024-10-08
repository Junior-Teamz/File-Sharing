import { useMutation } from '@tanstack/react-query';
import axiosInstance, { endpoints } from 'src/utils/axios';

export const useCreateNews = ({ onSuccess, onError }) => {
  return useMutation({
    mutationKey: ['create.news'],
    mutationFn: async (data) => {
      const response = await axiosInstance.post(endpoints.AdminNews.create, data);
      return response;
    },
    onSuccess,
    onError
  });
};
