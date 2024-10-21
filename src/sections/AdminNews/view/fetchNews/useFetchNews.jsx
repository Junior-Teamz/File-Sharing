import { useQuery } from '@tanstack/react-query';
import axiosInstance, { endpoints } from 'src/utils/axios';

export const useFetchNews = () => {
  const { data, isLoading, refetch, isFetching } = useQuery({
    queryKey: ['list.news'],
    queryFn: async () => {
      const response = await axiosInstance.get(endpoints.AdminNews.list);
      return response.data;
    },
  });

  return {
    data,
    isLoading,
    refetch,
    isFetching,
  };
};
