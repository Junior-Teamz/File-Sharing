import { useMutation } from '@tanstack/react-query';
import axiosInstance, { endpoints } from 'src/utils/axios';

export const usePermissionsFile = () => {
  return useMutation({
    mutationKey: ['permissions-file'],
    mutationFn: async (formData) => {
      const response = await axiosInstance.post(endpoints.Permissions.PermissionsFile, formData);
      return response;
    },
   
  });
};
