import { useMutation } from '@tanstack/react-query';
import axiosInstance, { endpoints } from 'src/utils/axios';

export const useMutationDeleteFiles = () => {
  return useMutation({
    mutationKey: ['delete.files.admin'],
    mutationFn: async (fileIdOrIds) => {
      // Determine if fileIdOrIds is an array
      const isArray = Array.isArray(fileIdOrIds);
      
      // Create the payload with UUID strings instead of objects
      const payload = {
        file_ids: isArray 
          ? fileIdOrIds.map(file => file.file_id) // Extract file_id from each object
          : [fileIdOrIds.file_id], // If single, extract file_id
      };

      console.log("Payload being sent:", payload);

      try {
        const response = await axiosInstance.post(`${endpoints.files.delete}`, payload);
        console.log(response);
        return response;
      } catch (error) {
        console.error("Error deleting files:", error.response.data);
        throw error; // Re-throw the error for further handling
      }
    },
  });
};
