import { useMutation } from '@tanstack/react-query';
import axiosInstance, { endpoints } from 'src/utils/axios';

export const useChangePermisionsFolder = ({ onSuccess, onError }) => {
  return useMutation({
    mutationKey: ['change-folder'],
    mutationFn: async (data) => {
      const response = await axiosInstance.put(endpoints.permission.changePermissionFolder, data);
      return response.data; // Return the response data
    },
    onSuccess,
    onError,
  });
};
