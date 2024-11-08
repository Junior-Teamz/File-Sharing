import { useMutation } from '@tanstack/react-query';
import axiosInstance, { endpoints } from 'src/utils/axios';

export const useDeleteUser = ({ onSuccess, onError }) => {
  return useMutation({
    mutationKey: ['delete.user'],
    mutationFn: async (userId) => {
      const response = await axiosInstance.delete(`${endpoints.users.delete}/${userId}`);
      return response;
    },
    onSuccess,
    onError,
  });
};
