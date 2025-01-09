import { useMutation } from '@tanstack/react-query';
import axiosInstance, { endpoints } from 'src/utils/axios';

export const useMutationDeleteFiles = () => {
  return useMutation({
    mutationKey: ['delete.files.admin'],
    mutationFn: async (fileIdOrIds) => {
      // Determine if fileIdOrIds is an array
        const fileIdsArray = Array.isArray(fileIdOrIds) ? fileIdOrIds : [fileIdOrIds];

      // Buat payload dengan array file_ids
      const payload = {
        file_ids: fileIdsArray,
        
      };

      try {
        const response = await axiosInstance.post(`${endpoints.files.delete}`, payload);
     
        return response;
      } catch (error) {
      
        throw error; // Re-throw the error for further handling
      }
    },
  });
};
