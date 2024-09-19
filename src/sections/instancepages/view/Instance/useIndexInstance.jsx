import { useQuery } from '@tanstack/react-query';
import axiosInstance, { endpoints } from 'src/utils/axios';

export const useIndexInstance = (filters) => {
  const { data, isLoading, refetch, isFetching } = useQuery({
    queryKey: ['list.instansi', filters],
    queryFn: async () => {
      const response = await axiosInstance.get(endpoints.instance.list, {
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
