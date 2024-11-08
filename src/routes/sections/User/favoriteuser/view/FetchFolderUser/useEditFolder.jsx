import { useMutation } from '@tanstack/react-query';
import axiosInstance, { endpoints } from 'src/utils/axios';

export const useEditFolder = ({  onSuccess = () => {}, onError = () => {} } = {}) => {
  return useMutation({
    mutationKey: ['edit.folder'],
    mutationFn: async ({ folderId, data }) => {
      const response = await axiosInstance.put(`${endpoints.folders.edit}/${folderId}`, data);
    
      return response;
    },
    onSuccess,
    onError,
  });
};
