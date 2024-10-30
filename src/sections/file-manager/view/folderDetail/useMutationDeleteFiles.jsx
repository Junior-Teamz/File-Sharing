import { useMutation } from '@tanstack/react-query';
import axiosInstance, { endpoints } from 'src/utils/axios';

export const useMutationDeleteFiles = () => {
  return useMutation({
    mutationKey: ['delete.files.admin'],
    mutationFn: async (fileIdOrIds) => {
      // Pastikan fileIdOrIds selalu array (meskipun hanya satu ID)
      const fileIdsArray = Array.isArray(fileIdOrIds) ? fileIdOrIds : [fileIdOrIds];

      // Buat payload dengan array file_ids
      const payload = {
        file_ids: fileIdsArray,
      };

      try {
        const response = await axiosInstance.post(`${endpoints.files.delete}`, payload);

        return response;
      } catch (error) {
        throw error; // Re-throw error untuk penanganan lebih lanjut
      }
    },
  });
};
