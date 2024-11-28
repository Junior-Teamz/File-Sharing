import { useMutation } from '@tanstack/react-query';
import axiosInstance, { endpoints } from 'src/utils/axios';

export const useUpdatePassword = ({ onSuccess, onError, refetch ,reset}) => {
  return useMutation({
    mutationKey: ['edit.user'],
    mutationFn: async ({ userId, data }) => {
      const response = await axiosInstance.put(`${endpoints.ProfileUser.updatePassword}/${userId}`, data);
      return response.data; 
    },
    onSuccess,
    onError,
    refetch,
    reset
  });
};
