import { useMutation } from '@tanstack/react-query';
import axiosInstance, { endpoints } from 'src/utils/axios';

export const useEditLegal = () => {
  return useMutation({
    mutationKey: ['edit.legal'],
    mutationFn: async ({ id, data }) => {
      if (!id) {
        throw new Error('Legal ID is required');
      }
      const response = await axiosInstance.put(`${endpoints.Legal.UpdateLegal}/${id}`, data);

      return response;
    },
   
  });
};
