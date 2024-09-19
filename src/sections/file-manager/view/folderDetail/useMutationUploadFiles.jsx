import { useMutation } from '@tanstack/react-query';
import axiosInstance, { endpoints } from 'src/utils/axios';

export const useMutationUploadFiles = ({ onSuccess, onError }) => {
  return useMutation({
    mutationKey: ['upload.files'],
    mutationFn: async (formData) => {
      const response = await axiosInstance.post(endpoints.files.upload, formData);
      return response;
    },
    onSuccess,
    onError,
  });
};
