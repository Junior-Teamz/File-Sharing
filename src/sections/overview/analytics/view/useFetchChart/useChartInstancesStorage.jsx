import { useQuery } from '@tanstack/react-query';
import axiosInstance, { endpoints } from 'src/utils/axios';

export const useChartInstancesStorage = () => {
  const { data, isLoading, refetch, isFetching } = useQuery({
    queryKey: ['instances.storage'],
    queryFn: async () => {
      const response = await axiosInstance.get(endpoints.SuperAdminChart.Instansi);
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
