import { useMutation } from '@tanstack/react-query';
import axiosInstance, { endpoints } from 'src/utils/axios';

export const useChangePermisionsFile = ({ onSuccess, onError }) => {
  return useMutation({
    mutationKey: ['change-file'],
    mutationFn: async (data) => {
      const response = await axiosInstance.put(endpoints.permission.changePermissionFile, data);
      return response.data; // Return the response data
    },
    onSuccess,
    onError,
  });
};
