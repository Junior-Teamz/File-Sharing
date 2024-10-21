import { useMutation } from '@tanstack/react-query';
import axiosInstance, { endpoints } from 'src/utils/axios';

export const useDeleteTag = ({ onSuccess, onError }) => {
  return useMutation({
    mutationKey: ['deletee.tag'],
    mutationFn: async (tagIdOrIds) => {
      const isArray = Array.isArray(tagIdOrIds);

      const payload = {
        tag_ids: isArray ? tagIdOrIds : [tagIdOrIds],
      };

      const response = await axiosInstance.post(`${endpoints.tag.delete}`, payload);

      console.log(response);
      return response;
    },
    onSuccess,
    onError,
  });
};
