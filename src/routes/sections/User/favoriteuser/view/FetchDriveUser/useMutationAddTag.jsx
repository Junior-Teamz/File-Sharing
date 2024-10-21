import { useMutation } from '@tanstack/react-query';
import axiosInstance, { endpoints } from 'src/utils/axios';

export const useMutationAddTag = ({ onSuccess, onError }) => {
  return useMutation({
    mutationKey: ['add.tag'],
    mutationFn: async (formData) => {
      const response = await axiosInstance.post(endpoints.folders.addTag, formData);
      return response;
    },
    onSuccess,
    onError,
  });
};
