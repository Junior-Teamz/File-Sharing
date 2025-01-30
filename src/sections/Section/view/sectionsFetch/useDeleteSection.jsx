import { useMutation } from '@tanstack/react-query';
import axiosInstance, { endpoints } from 'src/utils/axios';

export const useDeleteSection = ({ onError, onSuccess }) => {
  return useMutation({
    mutationKey: ['delete.section'],
    mutationFn: async ({ sectionid }) => {
      const response = await axiosInstance.delete(
        `${endpoints.Section.deleteSection}/${sectionid}`
      );
      return response;
    },
    onError,
    onSuccess,
  });
};
