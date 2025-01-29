import { useQuery } from '@tanstack/react-query';
import axiosInstance, { endpoints } from 'src/utils/axios';

export const useGenerateLinkFolder = (id) => {
  const { data, isLoading, refetch, error } = useQuery({
    queryKey: ['generate.link', id], // Tambahkan id ke queryKey agar unik per folder
    queryFn: async () => {
      const { data } = await axiosInstance.get(`${endpoints.folder.generateLink}/${id}`);
      return data;
    },
    onError: (err) => {
      console.error('Failed to fetch link:', err);
    },
    enabled: !!id, // Pastikan query tidak jalan jika id tidak ada
  });

  return {
    data,
    isLoading,
    refetch,
    error, // Tambahkan error handling jika dibutuhkan
  };
};
