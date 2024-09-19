import { useQuery } from '@tanstack/react-query';
import axiosInstance, { endpoints } from 'src/utils/axios';

export const useFetchFolder = () => {
  const { data, isLoading, refetch, isFetching } = useQuery({
    queryKey: ['fetch.folder'],
    queryFn: async () => {
      const response = await axiosInstance.get(endpoints.folder.list);
      const { data: result } = response.data;
      return result;
    },
  });

  return {
    data,
    isLoading,
    refetch,
    isFetching,
  };
};
