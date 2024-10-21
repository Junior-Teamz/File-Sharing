import { useMutation } from '@tanstack/react-query';
import axiosInstance, { endpoints } from 'src/utils/axios';

export const useRemoveTagFolder = () => {
  return useMutation({
    mutationKey: ['remove.tag.folder'],
    mutationFn: async (formData) => {
      const response = await axiosInstance.post(endpoints.folders.removeTag, formData);
      return response;
    },
    
  });
};
