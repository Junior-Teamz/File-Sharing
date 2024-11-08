import { useMutation } from '@tanstack/react-query';
import axiosInstance, { endpoints } from 'src/utils/axios';

export const useEditLegal = () => {
  return useMutation({
    mutationKey: ['edit.legal'],
    mutationFn: async ({ id, data }) => {
      if (!id) {
        throw new Error('Legal ID is required');
      }

      // Create a new FormData object to handle the file upload
      const formData = new FormData();

      // Append regular fields (assuming data is an object)
      Object.keys(data).forEach(key => {
        formData.append(key, data[key]);
      });

      // Make sure to append the file if it exists
      if (data.file) {
        formData.append('file', data.file);
      }

      // Make the PUT request with FormData
      const response = await axiosInstance.put(
        `${endpoints.Legal.UpdateLegal}/${id}`,
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data', // Ensure correct header for file upload
          },
        }
      );

      return response;
    },
  });
};
