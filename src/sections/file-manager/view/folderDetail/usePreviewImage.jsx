import { useQuery } from '@tanstack/react-query';
import axiosInstance, { endpoints } from 'src/utils/axios';

export const usePreviewImage = (id) => {
  const { data, isLoading, refetch } = useQuery({
    queryKey: ['preview-image', id],
    queryFn: async () => {
      try {
        // Set the responseType to 'blob' to handle binary data
        const response = await axiosInstance.get(`${endpoints.previewImage.preview}${id}`, {
          responseType: 'blob',
        });

        // Log the full response to check its structure
        console.log('Preview image response:', response);

        // Check if we received the blob
        if (response?.data) {
          // Convert the blob into an object URL
          const imageURL = URL.createObjectURL(response.data);
          return imageURL; // Return the image URL
        } else {
          throw new Error('No data found in the response');
        }
      } catch (error) {
        console.error('Error fetching preview image:', error); // Log error for debugging
        throw error;
      }
    },
    enabled: !!id,
    initialData: null,
  });

  return {
    data,  // This will be the image URL
    isLoading,
    refetch,
  };
};
