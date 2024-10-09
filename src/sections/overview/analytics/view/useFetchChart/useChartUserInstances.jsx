import { useQuery } from '@tanstack/react-query';
import axiosInstance, { endpoints } from 'src/utils/axios';

export const useChartUserInstances = () => {
  const { data, isLoading, refetch, isFetching } = useQuery({
    queryKey: ['chart.instancesUser'],
    queryFn: async () => {
      const response = await axiosInstance.get(endpoints.ChartInstansi.getUserInstansi);
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
