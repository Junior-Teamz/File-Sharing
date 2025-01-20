import { useMutation } from '@tanstack/react-query';
import axiosInstance, { endpoints } from 'src/utils/axios';

export const useMutationUploadFilesId = ({ onSuccess, onError }) => {
  return useMutation({
    mutationKey: ['upload.files'],
    mutationFn: async (formData) => {
      const response = await axiosInstance.post(endpoints.files.upload, formData, {
        onUploadProgress: (progressEvent) => {
          if (onUploadProgress) {
            const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
            onUploadProgress(percentCompleted);
          }
        },
      });
      return response;
    },
    onSuccess,
    onError,
  });
};
