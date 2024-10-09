import { useQuery } from '@tanstack/react-query';
import axiosInstance, { endpoints } from 'src/utils/axios';

export const useChartInstances = () => {
  const { data, isLoading, refetch, isFetching } = useQuery({
    queryKey: ['chart.instances'],
    queryFn: async () => {
      const response = await axiosInstance.get(endpoints.ChartInstansi.getChartInstansi);
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
