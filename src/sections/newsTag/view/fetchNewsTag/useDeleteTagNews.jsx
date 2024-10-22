import { useMutation } from '@tanstack/react-query';
import axiosInstance, { endpoints } from 'src/utils/axios';

export const useDeleteTagNews = ({ onSuccess, onError }) => {
  return useMutation({
    mutationKey: ['delete.newstag'],
    mutationFn: async (newstagIdOrIds) => {
      const isArray = Array.isArray(newstagIdOrIds);

      const payload = {
        news_tag_ids: isArray ? newstagIdOrIds : [newstagIdOrIds],
      };

      const response = await axiosInstance.post(`${endpoints.NewsTag.delete}`, payload);

    
      return response;
    },
    onSuccess,
    onError,
  });
};
