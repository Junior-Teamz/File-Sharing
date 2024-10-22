import { useQuery } from '@tanstack/react-query';
import axiosInstance, { endpoints } from 'src/utils/axios';

export const usePreviewImage = (id) => {
  const { data, isLoading, refetch } = useQuery({
    queryKey: ['preview.image', id],
    queryFn: async () => {
      try {
        const response = await axiosInstance.get(`${endpoints.previewImage.preview}${id}`, {
          responseType: 'blob',
        });

       

        if (response?.data) {
          const reader = new FileReader();
          return new Promise((resolve, reject) => {
            reader.onloadend = () => {
              resolve(reader.result);
            };
            reader.onerror = reject;
            reader.readAsDataURL(response.data);
          });
        } else {
          throw new Error('No data found in the response');
        }
      } catch (error) {
       
        throw error;
      }
    },
    enabled: !!id,
    initialData: null,
  });

  return {
    data,
    isLoading,
    refetch,
  };
};
