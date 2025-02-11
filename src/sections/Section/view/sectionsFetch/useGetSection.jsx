import { useQuery } from '@tanstack/react-query';
import axiosInstance, { endpoints } from 'src/utils/axios';

export const useGetSection = (filters) => {
  const { data, isLoading, refetch, isFetching } = useQuery({
    queryKey: ['list.section'],
    queryFn: async () => {
      const response = await axiosInstance.get(endpoints.Section.getSection);
      return response.data.data;
    },
  });

  return {
    data,
    isLoading,
    refetch,
    isFetching,
  };
};
