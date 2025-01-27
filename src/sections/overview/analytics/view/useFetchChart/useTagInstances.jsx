import { useQuery } from '@tanstack/react-query';
import axiosInstance, { endpoints } from 'src/utils/axios';

export const useTagInstances = () => {
  const { data, isLoading, refetch, isFetching } = useQuery({
    queryKey: ['tag.instances'],
    queryFn: async () => {
      const response = await axiosInstance.get(endpoints.statistik.tagUsageInstance);
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
