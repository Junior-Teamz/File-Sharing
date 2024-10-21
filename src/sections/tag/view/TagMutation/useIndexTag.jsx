import { useQuery } from '@tanstack/react-query';
import axiosInstance, { endpoints } from 'src/utils/axios';

export const useIndexTag = () => {
  const { data, isLoading, refetch, isFetching } = useQuery({
    queryKey: ['tag.admin'],
    queryFn: async () => {
      const response = await axiosInstance.get(endpoints.tag.index);
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
