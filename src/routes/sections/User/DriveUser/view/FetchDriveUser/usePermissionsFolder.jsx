import { useMutation } from '@tanstack/react-query';
import axiosInstance, { endpoints } from 'src/utils/axios';

export const usePermissionsFolder = () => {
  return useMutation({
    mutationKey: ['permissions-folder'],
    mutationFn: async (formData) => {
      const response = await axiosInstance.post(endpoints.Permissions.getPermissionFolder, formData);
      return response;
    },
  });
};
