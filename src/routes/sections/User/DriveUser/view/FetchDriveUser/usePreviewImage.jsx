import { useQuery } from '@tanstack/react-query';
import axiosInstance, { endpoints } from 'src/utils/axios';

export const usePreviewImage = (id) => {
  const { data, isLoading, refetch } = useQuery({
    queryKey: ['preview-image', id],
    queryFn: async () => {
      const token = sessionStorage.getItem('accessToken');

      // Send GET request with headers
      const response = await axiosInstance.get(`${endpoints.files.preview}${id}`, {
        headers: {
          Authorization: `Bearer ${token}`, // Send the token from sessionStorage
          Accept: 'image/*', // Add an 'Accept' header for images
        },
        responseType: 'blob', // Set response type to 'blob' for image data
      });

      // Convert blob to URL for preview
      const imageBlob = response.data;
      return URL.createObjectURL(imageBlob); // Return the image as a URL for preview
    },
  });

  return {
    data,
    isLoading,
    refetch,
  };
};
