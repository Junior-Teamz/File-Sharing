import { useQuery } from '@tanstack/react-query';
import axiosInstance, { endpoints } from 'src/utils/axios';

export const useFetchDetailFolderUsers = (id) => {
  return useQuery({
    queryKey: ['detail.folder'],
    queryFn: async () => {
      const res = await axiosInstance.get(`${endpoints.folders.detail}${id}`);
      console.log(res.data.data);
      return res.data.data;
    },
  });
};