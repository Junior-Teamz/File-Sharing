import { useQuery } from '@tanstack/react-query';
import axiosInstance, { endpoints } from 'src/utils/axios';

export const storage = () => {
  const { data, isLoading, refetch, isFetching } = useQuery({
    queryKey: ['storage.user'],
    queryFn: async () => {
      const response = await axiosInstance.get(endpoints.previewStorage.storage);
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