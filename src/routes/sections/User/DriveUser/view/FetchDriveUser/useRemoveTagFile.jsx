import { useMutation } from '@tanstack/react-query';
import axiosInstance, { endpoints } from 'src/utils/axios';

export const useRemoveTagFile = () => {
  return useMutation({
    mutationKey: ['remove.file'],
    mutationFn: async (formData) => {
      const response = await axiosInstance.post(endpoints.file.removeTag, formData);
      return response;
    },
    
  });
};
