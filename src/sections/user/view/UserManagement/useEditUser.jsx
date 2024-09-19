import { useMutation } from '@tanstack/react-query';
import axiosInstance, { endpoints } from 'src/utils/axios';

export const useEditUser = ({ onSuccess, onError, refetch ,reset}) => {
  return useMutation({
    mutationKey: ['edit.user'],
    mutationFn: async ({ userId, data }) => {
      const response = await axiosInstance.put(`${endpoints.users.update}/${userId}`, data);
      return response.data; // Pastikan hanya data yang dikembalikan
    },
    onSuccess,
    onError,
    refetch,
    reset
  });
};
