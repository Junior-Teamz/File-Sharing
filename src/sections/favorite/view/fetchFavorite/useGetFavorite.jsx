import { useQuery } from '@tanstack/react-query';
import axiosInstance, { endpoints } from 'src/utils/axios';

export const useGetFavorite = () => {
  const { data, isLoading, refetch, isFetching } = useQuery({
    queryKey: ['list.favorite'],
    queryFn: async () => {
      const response = await axiosInstance.get(endpoints.files.getFavorit);
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
