import { useMutation } from '@tanstack/react-query';
import axiosInstance, { endpoints } from 'src/utils/axios';

export const useDeleteLegal = () => {
  return useMutation({
    mutationKey: ['delete.legal'],
    mutationFn: async (legalIdOrIds) => {
      const isArray = Array.isArray(legalIdOrIds);

      const payload = {
        legal_ids: isArray ? legalIdOrIds : [legalIdOrIds],
      };

      const response = await axiosInstance.post(`${endpoints.Legal.DeleteLegal}`, payload);

      console.log(response);
      return response;
    },
 
  });
};
