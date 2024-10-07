import { useQuery } from '@tanstack/react-query';
import axiosInstance, { endpoints } from 'src/utils/axios';

export const useFetchLegal = (filters) => {
  const { data, isLoading, refetch, isFetching } = useQuery({
    queryKey: ['legal.admin'],
    queryFn: async () => {
      const response = await axiosInstance.get(endpoints.Legal.ListLegal);
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
