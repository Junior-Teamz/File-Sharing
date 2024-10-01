import { useQuery } from '@tanstack/react-query';
import axiosInstance, { endpoints } from 'src/utils/axios';

export const useFetchLegall = (filters) => {
    const { data, isLoading, refetch, isFetching } = useQuery({
      queryKey: ['list.legal', filters],
      queryFn: async () => {
        const response = await axiosInstance.get(endpoints.Legalbasis.getLegal, {
          params: filters, 
        });
        return response.data.data; // Return only the array of legal basis
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
