import { useMutation } from '@tanstack/react-query';
import axiosInstance, { endpoints } from 'src/utils/axios';

export const useDeleteInstance = ({ onSuccess, onError }) => {
  return useMutation({
    mutationKey: ['delete.instansi'],
    mutationFn: async (instansiId) => {
      // Ensure instansiId is passed correctly in the delete request
      const response = await axiosInstance.delete(`${endpoints.instance.delete}/${instansiId}`);
      console.log(response);
      return response;
    },
    onSuccess,
    onError,
  });
};
