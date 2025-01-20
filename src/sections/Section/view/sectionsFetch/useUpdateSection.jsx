import { useMutation } from '@tanstack/react-query';
import axiosInstance, { endpoints } from 'src/utils/axios';

export const useUpdateSection = () => {
  return useMutation({
    mutationKey: ['update.section'],
    mutationFn: async ({ id, data }) => {
      if (!id) {
        throw new Error('Unit Kerja ID is required');
      }
      const response = await axiosInstance.put(`${endpoints.Section.updateSection}/${id}`, data);

      return response;
    },
  
  });
};
