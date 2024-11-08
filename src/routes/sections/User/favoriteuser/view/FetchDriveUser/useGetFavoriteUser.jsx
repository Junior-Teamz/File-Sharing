import { useQuery } from '@tanstack/react-query';
import axiosInstance, { endpoints } from 'src/utils/axios';

export const useGetFavoriteUser = () => {
  const { data, isLoading, refetch, isFetching } = useQuery({
    queryKey: ['favorite.user'],
    queryFn: async () => {
      const response = await axiosInstance.get(endpoints.folders.getFavoritUser);
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
