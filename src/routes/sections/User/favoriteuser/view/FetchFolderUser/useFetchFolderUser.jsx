import { useQuery } from '@tanstack/react-query';
import axiosInstance, { endpoints } from 'src/utils/axios';

export const useFetchFolderUser = () => {
  const { data, isLoading, refetch, isFetching } = useQuery({
    queryKey: ['fetch.folder'],
    queryFn: async () => {
      const response = await axiosInstance.get(endpoints.folders.list);
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
