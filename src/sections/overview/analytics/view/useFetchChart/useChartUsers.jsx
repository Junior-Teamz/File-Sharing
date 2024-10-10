import { useQuery } from '@tanstack/react-query';
import axiosInstance, { endpoints } from 'src/utils/axios';

export const useChartUsers = () => {
  const { data, isLoading, refetch, isFetching } = useQuery({
    queryKey: ['chart.users'],
    queryFn: async () => {
      const response = await axiosInstance.get(endpoints.ChartUser.getChartUser);
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
