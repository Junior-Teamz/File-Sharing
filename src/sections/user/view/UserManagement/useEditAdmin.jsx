import { useMutation } from '@tanstack/react-query';
import axiosInstance, { endpoints } from 'src/utils/axios';

export const useEditAdmin = ({ onSuccess, onError, refetch, reset }) => {
  return useMutation({
    mutationKey: ['edit.admin'],
    mutationFn: async ({ userId, data }) => {
      const response = await axiosInstance.put(`${endpoints.users.updateAdmin}/${userId}`, data);
      return response.data;
    },
    onSuccess,
    onError,
    refetch,
    reset,
  });
};
