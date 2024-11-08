import { useMutation } from '@tanstack/react-query';
import axiosInstance, { endpoints } from 'src/utils/axios';

export const useDeleteNews = () => {
  return useMutation({
    mutationKey: ['delete.news'],
    mutationFn: async (id) => {
      const response = await axiosInstance.delete(`${endpoints.AdminNews.delete}/${id}`);
      return response.data;
    },
  });
};
