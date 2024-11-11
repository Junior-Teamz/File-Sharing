import { useMutation } from '@tanstack/react-query';
import axiosInstance, { endpoints } from 'src/utils/axios';

export const useEditLegal = (id) => {
  return useMutation({
    mutationKey: ['edit.legal'],
    mutationFn: async (data) => {
      // Create a new FormData object to handle the file upload
      const formData = new FormData();
      formData.append('name', data.name);
      formData.append('file', data.file[0]);
      formData.append('_method', 'PUT');
      console.log('INI LOG DARI DATA yang dikirim', data);
      const response = await axiosInstance.post(`${endpoints.Legal.UpdateLegal}/${id}`, formData);
      console.log(response.data);
      return response.data;
    },
  });
};
