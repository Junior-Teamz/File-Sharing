import { useMutation } from '@tanstack/react-query';
import axiosInstance, { endpoints } from 'src/utils/axios';

export const useCreateSection = ({ onSuccess, onError}) => {
  return useMutation({
    mutationKey: ['create.section'],
    mutationFn: async (data) => {
      const response = await axiosInstance.post(endpoints.Section.createSection, data);
      return response;
    },
    onSuccess,
    onError,
  });
};
