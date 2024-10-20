import { useMutation } from '@tanstack/react-query';
import axiosInstance, { endpoints } from 'src/utils/axios';

export const useDownloadFile = () => {
  return useMutation({
    mutationKey: ['download.files'],
    mutationFn: async (fileId) => {
      const isArray = Array.isArray(fileId);

      const payload = {
        file_ids: isArray ? fileId : [fileId],
      };

      const response = await axiosInstance.post(`${endpoints.files.download}`, payload, {
        responseType: 'blob',
      });
      console.log(response);
      return response;
    },
  });
};
