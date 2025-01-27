import { useQuery } from '@tanstack/react-query';
import axiosInstance, { endpoints } from 'src/utils/axios';

export const useChartFile = () => {
  const { data, isLoading, refetch, isFetching } = useQuery({
    queryKey: ['chart.file'],
    queryFn: async () => {
      const response = await axiosInstance.get(endpoints.statistik.getFileCount);
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
