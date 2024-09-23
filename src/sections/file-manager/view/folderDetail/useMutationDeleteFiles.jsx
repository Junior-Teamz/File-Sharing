import { useMutation } from '@tanstack/react-query';
import axiosInstance, { endpoints } from 'src/utils/axios';

export const useMutationDeleteFiles = () => {
  return useMutation({
    mutationKey: ['delete.instansi'],
    mutationFn: async (fileIdOrIds) => {
      const isArray = Array.isArray(fileIdOrIds);

      const payload = {
        file_ids: isArray ? fileIdOrIds : [fileIdOrIds],
      };

      const response = await axiosInstance.post(`${endpoints.files.delete}`, payload);

      console.log(response);
      return response;
    },
  });
};
