import { useMutation } from '@tanstack/react-query';
import axiosInstance, { endpoints } from 'src/utils/axios';

export const useEditLegal = ({ onSuccess, onError }) => {
  return useMutation({
    mutationKey: ['edit.legal'],
    mutationFn: async ({ legalId, data }) => {
      if (!legalId) {
        throw new Error('Legal ID is required');
      }
      const response = await axiosInstance.put(`${endpoints.Legal.UpdateLegal}/${legalId}`, data);

      return response;
    },
    onSuccess,
    onError,
  });
};
