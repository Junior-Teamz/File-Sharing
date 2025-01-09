import { useMutation } from '@tanstack/react-query';
import axiosInstance, { endpoints } from 'src/utils/axios';

export const useGetSection = ({ onSuccess, onError }) => {
  return useMutation({
    mutationKey: ['get.section'],
    mutationFn: async (data) => {
      const response = await axiosInstance.post(endpoints.Section.getSection);
      return response.data;
    },
    onSuccess,
    onError,
  });
};
