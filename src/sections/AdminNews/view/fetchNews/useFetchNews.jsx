import { useQuery } from '@tanstack/react-query';
import axiosInstance, { endpoints } from 'src/utils/axios';

export const useFetchNews = (filters) => {
  const { data, isLoading, refetch, isFetching } = useQuery({
    queryKey: ['list.news', filters],
    queryFn: async () => {
      const response = await axiosInstance.get(endpoints.AdminNews.list, {
        params: filters, 
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
