import { useQuery } from '@tanstack/react-query';
import axiosInstance, { endpoints } from 'src/utils/axios';

export const useGetShare = () => {
  const { data, isLoading, refetch, isFetching } = useQuery({
    queryKey: ['fetch.share.user'],
    queryFn: async () => {
      const response = await axiosInstance.get(endpoints.GetFileFolderShare.UserShare);
      
      // Ensure response and data exist
      if (!response || !response.data) {
        throw new Error('No data found');
      }

      // Return folders and files from the response
      return {
        folders: response.data.folders,
        files: response.data.files,
      };
    },
    onError: (error) => {
      console.error('Error fetching user share data:', error);
    },
  });

  return {
    data,
    isLoading,
    refetch,
    isFetching,
  };
};
