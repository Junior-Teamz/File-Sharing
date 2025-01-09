import { useMutation } from '@tanstack/react-query';
import axiosInstance, { endpoints } from 'src/utils/axios';

export const useUpdateProfile = ({ onSuccess, onError, refetch ,reset}) => {
  return useMutation({
    mutationKey: ['edit.user'],
    mutationFn: async ({ userId, data }) => {
      const response = await axiosInstance.post(`${endpoints.ProfileUser.update}`, data);
      return response.data; 
    },
    onSuccess,
    onError,
    refetch,
    reset
  });
};
