import { useQuery } from '@tanstack/react-query';
import axiosInstance, { endpoints } from 'src/utils/axios';

export const useFetchDetail = (id) => {
  const { data, isLoading, refetch } = useQuery({
    queryKey: ['detail-folder'],
    queryFn: async () => {
      const response = await axiosInstance.get(`${endpoints.folders.detail}${id}`);
      const { data: result } = response.data;
      console.log(result);
      return result;
    },
  });

  return {
    data,
    isLoading,
    refetch,
  };
};
