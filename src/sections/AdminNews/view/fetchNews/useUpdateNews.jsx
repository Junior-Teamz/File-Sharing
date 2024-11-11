import { useMutation } from '@tanstack/react-query';
import axiosInstance, { endpoints } from 'src/utils/axios';

export const useUpdateNews = () => {
  return useMutation({
    mutationKey: ['edit.news'],
    mutationFn: async ({ id, data }) => {
      if (!id) {
        throw new Error('news ID is required');
      }
      const response = await axiosInstance.put(`${endpoints.AdminNews.Update}/${id}`, data);
    
      return response;
    },
  });
};
