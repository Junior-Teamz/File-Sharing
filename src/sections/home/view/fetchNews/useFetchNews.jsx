import { useQuery } from '@tanstack/react-query';
import axiosInstance, { endpoints } from 'src/utils/axios';

export const useFetchNews = (filters) => {
    const { data, isLoading, refetch, isFetching } = useQuery({
      queryKey: ['list.legal', filters],
      queryFn: async () => {
        const response = await axiosInstance.get(endpoints.News.getNews, {
          params: filters, 
        });
        return response.data; // Return only the array of legal basis
      },
      enabled: !!filters, 
    });
  
    return {
      data, // This will now be the array of legal basis
      isLoading,
      refetch,
      isFetching,
    };
  };
