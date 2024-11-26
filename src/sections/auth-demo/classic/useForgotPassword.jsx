import { useMutation } from '@tanstack/react-query';
import axiosInstance, { endpoints } from 'src/utils/axios';

export const useForgotPassword = ({ onSuccess, onError }) => {
  return useMutation({
    mutationKey: ['link.password'],
    mutationFn: async (data) => {
      const response = await axiosInstance.post(endpoints.auth.sendLinkPassword, data);
      return response;
    },
    onSuccess,
    onError,
  });
};
