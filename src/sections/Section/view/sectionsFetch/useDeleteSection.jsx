import { useMutation } from '@tanstack/react-query';
import axiosInstance, { endpoints } from 'src/utils/axios';

export const useDeleteSection = ({onError, onSuccess}) => {
  return useMutation({
    mutationKey: ['delete.section'],
    mutationFn: async () => {
      const response = await axiosInstance.delete(`${endpoints.Section.deleteSection}/${id}`);
      return response;
    },
  onError,
  onSuccess
  });
};
