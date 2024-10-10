import { useQuery } from '@tanstack/react-query';
import axiosInstance, { endpoints } from 'src/utils/axios';

export const useIndexInstance = (filters) => {
  const { data, isLoading, refetch, isFetching } = useQuery({
    queryKey: ['list.instansi'],
    queryFn: async () => {
      const response = await axiosInstance.get(endpoints.instance.list);
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
