import { useMutation } from '@tanstack/react-query';
import axiosInstance, { endpoints } from 'src/utils/axios';

export const useAddFileTag = () => {
  return useMutation({
    mutationKey: ['add.tag'],
    mutationFn: async (data) => {
      const response = await axiosInstance.post(endpoints.file.addTag, data);
      return response;
    },
    // onSuccess,
  });
};
