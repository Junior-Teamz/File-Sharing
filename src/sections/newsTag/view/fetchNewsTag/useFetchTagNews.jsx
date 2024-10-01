import { useQuery } from '@tanstack/react-query';
import axiosInstance, { endpoints } from 'src/utils/axios';

export const useFetchTagNews = (filters) => {
  const { data, isLoading, refetch, isFetching } = useQuery({
    queryKey: ['list.newstag', filters],
    queryFn: async () => {
      const response = await axiosInstance.get(endpoints.NewsTag.list, {
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
