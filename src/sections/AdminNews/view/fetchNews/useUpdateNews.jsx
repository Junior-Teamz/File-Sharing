import { useMutation } from '@tanstack/react-query';
import axiosInstance, { endpoints } from 'src/utils/axios';

export const useUpdateNews = () => {
  return useMutation({
    mutationKey: ['edit.news'],
    mutationFn: async ({ newsId, data }) => {
      if (!newsId) {
        throw new Error('news ID is required');
      }
      const response = await axiosInstance.put(`${endpoints.AdminNews.Update}/${newsId}`, data);
    
      return response;
    },
  });
};
