import { useQuery } from '@tanstack/react-query';
import axiosInstance, { endpoints } from 'src/utils/axios';

export const useFetchFavorite = () => {
  const { data, isLoading, refetch, isFetching } = useQuery({
    queryKey: ['favorite.user'],
    queryFn: async () => {
      const response = await axiosInstance.get(endpoints.folders.getFavoritUser);
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