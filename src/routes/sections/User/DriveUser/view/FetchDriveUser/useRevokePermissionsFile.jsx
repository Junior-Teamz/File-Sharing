import { useMutation } from '@tanstack/react-query';
import axiosInstance, { endpoints } from 'src/utils/axios';

export const useRevokePermissionsFile = ({ onError, onSuccess }) => {
  return useMutation({
    mutationKey: ['delete.filepermissions'],
    mutationFn: async (data) => {
      const response = await axiosInstance.post(endpoints.permission.revoketPermissionFile, data);
      return response.data; // Mengembalikan `response.data` agar lebih bersih
    },
    onError,
    onSuccess,
  });
};
