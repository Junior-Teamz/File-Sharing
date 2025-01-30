import { useMutation } from '@tanstack/react-query';
import axiosInstance, { endpoints } from 'src/utils/axios';

export const useRevokePermissionsFolder = ({ onError, onSuccess }) => {
  return useMutation({
    mutationKey: ['delete.folderpermissions'],
    mutationFn: async (data) => {
      const response = await axiosInstance.post(endpoints.permission.revokePermissionFolder, data);
      return response.data; // Mengembalikan `response.data` agar lebih bersih
    },
    onError,
    onSuccess,
  });
};
