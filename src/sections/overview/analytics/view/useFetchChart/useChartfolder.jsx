import { useQuery } from '@tanstack/react-query';
import axiosInstance, { endpoints } from 'src/utils/axios';

export const useChartFolder = () => {
  const { data, isLoading, refetch, isFetching } = useQuery({
    queryKey: ['chart.folder'],
    queryFn: async () => {
      const response = await axiosInstance.get(endpoints.ChartFolder.getChartFolder);
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
