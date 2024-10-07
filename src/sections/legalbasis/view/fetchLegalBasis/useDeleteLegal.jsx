import { useMutation } from '@tanstack/react-query';
import axiosInstance, { endpoints } from 'src/utils/axios';

export const useDeleteLegal = () => {
  return useMutation({
    mutationKey: ['delete.legal'],
    mutationFn: async (legalId) => {
     
      const response = await axiosInstance.delete(`${endpoints.Legal.DeleteLegal}/${legalId}`);

      console.log(response);
      return response;
    },
 
  });
};
