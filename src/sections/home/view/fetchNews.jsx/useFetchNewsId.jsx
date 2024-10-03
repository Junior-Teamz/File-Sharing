import { useQuery } from '@tanstack/react-query';
import axiosInstance, { endpoints } from 'src/utils/axios';

export const useFetchNewsId = (id) => {
  const { data, isLoading, refetch } = useQuery({
    queryKey: ['detail-news'],
    queryFn: async () => {
      const response = await axiosInstance.get(`${endpoints.News.getNewsId}${id}`);
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
