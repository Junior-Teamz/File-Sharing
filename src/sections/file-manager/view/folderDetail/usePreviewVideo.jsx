import { useQuery } from '@tanstack/react-query';
import axiosInstance, { endpoints } from 'src/utils/axios';

export const usePreviewVideo = (id) => {
  const { data, isLoading, refetch } = useQuery({
    queryKey: ['preview.video', id],
    queryFn: async () => {
      try {
        const response = await axiosInstance.get(`${endpoints.previewVideo.getVideo}${id}`, {
          responseType: 'blob', // Requesting Blob data
        });
        console.log('File ID:', id);


        if (response?.data) {
          // Create a local URL for the Blob object
          const videoUrl = URL.createObjectURL(response.data);
          return videoUrl;
        } else {
          throw new Error('No data found in the response');
        }
      } catch (error) {
        console.error('Error fetching video preview:', error);
        throw error;
      }
    },
    enabled: !!id, // Only enable query if `id` is provided
    initialData: null,
    staleTime: 5 * 60 * 1000, // Cache for 5 minutes
    cacheTime: 10 * 60 * 1000, // Retain cache for 10 minutes
  });

  return {
    data, // `data` will contain the video URL
    isLoading,
    refetch,
  };
};
