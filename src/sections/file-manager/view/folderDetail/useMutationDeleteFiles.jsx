import { useMutation } from '@tanstack/react-query';
import axiosInstance, { endpoints } from 'src/utils/axios';

export const useMutationDeleteFiles = ({ onSuccess, onError }) => {
  return useMutation({
    mutationKey: ['delete.files'],
    mutationFn: async (fileIds) => {
      const response = await axiosInstance.post(
        `${endpoints.files.delete}?ids=${fileIds.join(',')}`
      );
      return response.data;
    },
    onSuccess,
    onError,
  });
};
