import { useQuery } from '@tanstack/react-query';
import axiosInstance, { endpoints } from 'src/utils/axios';

export const useGenerateLinkFile = (id) => {
  const { data, isLoading, refetch } = useQuery({
    queryKey: ['generate.link'],
    queryFn: async () => {
      const response = await axiosInstance.get(`${endpoints.files.generateLink}/${id}`);
      const { data: result } = response.data;
    
      return result;
    },
  });

  return {
    data,
    isLoading,
    refetch,
  };
};
