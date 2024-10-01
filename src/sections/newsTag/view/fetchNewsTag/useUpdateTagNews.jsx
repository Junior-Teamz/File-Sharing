import { useMutation } from '@tanstack/react-query';
import axiosInstance, { endpoints } from 'src/utils/axios';

export const useUpdateTagNews = ({ onSuccess, onError }) => {
  return useMutation({
    mutationKey: ['edit.newstag'],
    mutationFn: async ({ newstagId, data }) => {
      if (!newstagId) {
        throw new Error('News Tag  ID is required');
      }
      const response = await axiosInstance.put(`${endpoints.NewsTag.update}/${newstagId}`, data);

      return response;
    },
    onSuccess,
    onError,
  });
};
