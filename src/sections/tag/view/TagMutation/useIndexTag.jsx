import { useQuery } from '@tanstack/react-query';
import axiosInstance, { endpoints } from 'src/utils/axios';

export const useIndexTag = (filters) => {
  const { data, isLoading, refetch, isFetching } = useQuery({
    queryKey: ['list.tag', filters],
    queryFn: async () => {
      const response = await axiosInstance.get(endpoints.tag.index, {
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
