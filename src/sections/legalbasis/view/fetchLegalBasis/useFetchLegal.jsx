import { useQuery } from '@tanstack/react-query';
import axiosInstance, { endpoints } from 'src/utils/axios';

export const useFetchLegal = (filters) => {
  const { data, isLoading, refetch, isFetching } = useQuery({
    queryKey: ['list.legal', filters],
    queryFn: async () => {
      const response = await axiosInstance.get(endpoints.Legal.ListLegal, {
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
