import { useQuery } from '@tanstack/react-query';
import axiosInstance, { endpoints } from 'src/utils/axios';

export const useFetchTagNews = () => {
  const { data, isLoading, refetch, isFetching } = useQuery({
    queryKey: ['list.newstag'],
    queryFn: async () => {
      const response = await axiosInstance.get(endpoints.NewsTag.list);
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
