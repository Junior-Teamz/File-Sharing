import { useQuery } from '@tanstack/react-query';
import axiosInstance, { endpoints } from 'src/utils/axios';

export const useFetchNews = (filters) => {
  const { data, isLoading, refetch, isFetching } = useQuery({
    queryKey: ['list.news', filters], // Adjusted key to fit 'news'
    queryFn: async () => {
      const response = await axiosInstance.get(endpoints.News.getNews, {
        params: {
          ...filters,
          perPage: filters.perPage || 5, // Set default perPage to 5
        },
      });
      return response.data;
    },
    enabled: !!filters,
  });

  return {
    data,
    isLoading,
    refetch,
    isFetching,
  };
};
