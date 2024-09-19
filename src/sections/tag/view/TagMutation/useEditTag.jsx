import { useMutation } from '@tanstack/react-query';
import axiosInstance, { endpoints } from 'src/utils/axios';

export const useEditTag = ({ onSuccess, onError }) => {
  return useMutation({
    mutationKey: ['edit.tag'],
    mutationFn: async ({ tagId, data }) => {
      if (!tagId) {
        throw new Error('Tag ID is required');
      }
      const response = await axiosInstance.put(`${endpoints.tag.update}/${tagId}`, data);

      return response;
    },
    onSuccess,
    onError,
  });
};
