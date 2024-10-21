import { useQuery } from '@tanstack/react-query';
import axiosInstance, { endpoints } from 'src/utils/axios';

export const indexShareAdmin = () => {
  const { data, isLoading, refetch, isFetching } = useQuery({
    queryKey: ['share.admin'],
    queryFn: async () => {
      const response = await axiosInstance.get(endpoints.FolderFileShare.getShareFolderFile);
      
      // Log the full response to check its structure
      console.log('API Response:', response);

      // Use response directly or modify it based on the actual structure
      const result = response.data?.data || response.data || null;
      
      if (!result) {
        throw new Error('No data available');
      }

      return result;
    },
  });

  return {
    data,
    isLoading,
    refetch,
    isFetching,
  };
};
