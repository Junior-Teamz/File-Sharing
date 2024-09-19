import { useMutation } from '@tanstack/react-query';
import axiosInstance, { endpoints } from 'src/utils/axios';

export const useMutationFolder = ({ onSuccess, onError }) => {
  return useMutation({
    mutationKey: ['create.folder'],
    mutationFn: async (data) => {
      const response = await axiosInstance.post(endpoints.folder.create, data);
      return response;
    },
    onSuccess,
    onError,
  });
};
