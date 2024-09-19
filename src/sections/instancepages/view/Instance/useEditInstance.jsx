import { useMutation } from '@tanstack/react-query';
import axiosInstance, { endpoints } from 'src/utils/axios';

export const useEditInstance = ({ onSuccess, onError }) => {
  return useMutation({
    mutationKey: ['edit.instansi'],
    mutationFn: async ({ instansiId, data }) => {
      if (!instansiId) {
        throw new Error('Instance ID is required');
      }
      const response = await axiosInstance.put(`${endpoints.instance.update}/${instansiId}`, data);

      return response;
    },
    onSuccess,
    onError,
  });
};
