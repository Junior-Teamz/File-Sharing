import { useMutation } from '@tanstack/react-query';
import axiosInstance, { endpoints } from 'src/utils/axios';

export const useEditUser = ({ onSuccess, onError, refetch ,reset}) => {
  return useMutation({
    mutationKey: ['edit.user'],
    mutationFn: async ({ userId, data }) => {
      const response = await axiosInstance.post(`${endpoints.users.update}/${userId}`, data);
      return response.data; 
    },
    onSuccess,
    onError,
    refetch,
    reset
  });
};
