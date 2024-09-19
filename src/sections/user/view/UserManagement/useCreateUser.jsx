import { useMutation } from '@tanstack/react-query';
import axiosInstance, { endpoints } from 'src/utils/axios';


export const useCreateUser = ({ onSuccess }) => {
    return useMutation({
      mutationKey: ['create.user'],
      mutationFn: async (data) => {
        const response = await axiosInstance.post(endpoints.users.create, data);
        return response;
      },
      onSuccess,
    });
  };