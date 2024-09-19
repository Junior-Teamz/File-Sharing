import { useMutation } from '@tanstack/react-query';
import axiosInstance, { endpoints } from 'src/utils/axios';

export const useDeleteInstance = ({ onSuccess, onError }) => {
  return useMutation({
    mutationKey: ['delete.instansi'],
    mutationFn: async (instansiIdOrIds) => {
      const isArray = Array.isArray(instansiIdOrIds);

    
      const payload = {
        instance_ids: isArray ? instansiIdOrIds : [instansiIdOrIds]
      };

      
      const response = await axiosInstance.post(`${endpoints.instance.delete}`, payload);
      
      console.log(response);
      return response;
    },
    onSuccess,
    onError,
  });
};
