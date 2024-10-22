import { useQuery } from '@tanstack/react-query';
import axiosInstance, { endpoints } from 'src/utils/axios';

export const usePreviewImage = (id) => {
  const { data, isLoading, refetch, isError } = useQuery({
    queryKey: ['preview-image', id],
    queryFn: async () => {
      const token = sessionStorage.getItem('accessToken');
    

      // Send GET request with Authorization header
      const response = await axiosInstance.get(`${endpoints.previewImage.preview}${id}`, {
        headers: {
          'Content-Type': '/',
          Authorization: `Bearer ${token}`, // Token dari sessionStorage
        },
        responseType: 'blob', // Mendapatkan respon sebagai Blob
      });

      // Convert blob to a URL for image preview
      const imageBlob = response.data;
      return URL.createObjectURL(imageBlob); // Menghasilkan URL untuk preview
    },
    enabled: !!id, // Query akan berjalan hanya jika ID ada
  });

  return {
    data, // URL gambar yang dihasilkan
    isLoading, // Status loading
    isError, // Status error jika ada masalah
    refetch, // Untuk manual refetch jika diperlukan
  };
};
