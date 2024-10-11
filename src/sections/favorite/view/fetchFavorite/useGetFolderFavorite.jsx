import { useQuery } from '@tanstack/react-query';
import axiosInstance, { endpoints } from 'src/utils/axios';

export const useGetFolderFavorite = () => {
  const { data, isLoading, refetch, isFetching } = useQuery({
    queryKey: ['list.favorite'],
    queryFn: async () => {
      const response = await axiosInstance.get(endpoints.folder.getFavoritUser);
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
