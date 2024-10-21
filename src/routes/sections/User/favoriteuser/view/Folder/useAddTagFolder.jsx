import { useMutation } from '@tanstack/react-query';
import axiosInstance, { endpoints } from 'src/utils/axios';

export const useAddTagFolder = () => {
  return useMutation({
    mutationKey: ['add.tag.folder'],
    mutationFn: async (data) => {
      const response = await axiosInstance.post(endpoints.folders.addTag, data);
      return response;
    },
    // onSuccess,
  });
};
