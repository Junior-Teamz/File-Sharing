import { useMutation } from '@tanstack/react-query';
import axiosInstance, { endpoints } from 'src/utils/axios';

export const useDeleteLegal = () => {
  return useMutation({
    mutationKey: ['delete.news'],
    mutationFn: async (newsIdOrIds) => {
      const isArray = Array.isArray(newsIdOrIds);

      const payload = {
        news_ids: isArray ? newsIdOrIds : [newsIdOrIds],
      };

      const response = await axiosInstance.delete(`${endpoints.AdminNews.delete}`, payload);

      console.log(response);
      return response;
    },
  });
};
