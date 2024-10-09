import { useQuery } from '@tanstack/react-query';
import axiosInstance, { endpoints } from 'src/utils/axios';

export const useChartTag = () => {
  const { data, isLoading, refetch, isFetching } = useQuery({
    queryKey: ['chart.tag'],
    queryFn: async () => {
      const response = await axiosInstance.get(endpoints.ChartTagFolderAndFile.getChartTag);
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
