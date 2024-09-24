import { useMutation } from '@tanstack/react-query';
import axiosInstance, { endpoints } from 'src/utils/axios';

export const useChangeNameFile = () => {
  return useMutation({
    mutationKey: ['change-name'],
    mutationFn: async ({ fileId, data }) => {
      if (!fileId) {
        throw new Error('File ID is required');
      }
      const response = await axiosInstance.put(`${endpoints.file.change}/${fileId}`, data);
      return response.data; // Return the response data
    },
  });
};
