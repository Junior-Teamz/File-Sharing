import { useMutation } from '@tanstack/react-query';
import axiosInstance, { endpoints } from 'src/utils/axios';


export const useCreateInstance = ({ onSuccess, onError }) => {
    return useMutation({
      mutationKey: ['create.instansi'],
      mutationFn: async (data) => {
        const response = await axiosInstance.post(endpoints.instance.create, data);
        return response;
      },
      onSuccess,
      onError
    });
  };