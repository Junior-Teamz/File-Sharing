import { useMutation } from '@tanstack/react-query';
import axiosInstance, { endpoints } from 'src/utils/axios';

export const useMoveFile = ({ onSuccess, onError }) => {
  return useMutation({
    mutationKey: ['move.file'],
    mutationFn: async ({ Id, data }) => {
      const response = await axiosInstance.put(`${endpoints.files.movefile}/${Id}`, data);
      return response;
    },
    onSuccess,
    onError,
  });
};
