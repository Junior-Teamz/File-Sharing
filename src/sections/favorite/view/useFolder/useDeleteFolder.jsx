import { useMutation } from '@tanstack/react-query';
import axiosInstance, { endpoints } from 'src/utils/axios';

export const useDeleteFolder = () => {
  return useMutation({
    mutationKey: ['delete.folder'],
    mutationFn: async (folderId) => {
      // Periksa jika folderId adalah array atau bukan
      const isArray = Array.isArray(folderId);

      const payload = {
        folder_ids: isArray ? folderId : [folderId], // Ubah nama field sesuai kebutuhan
      };

      // Mengirim data payload sebagai body request
      const response = await axiosInstance.post(
        `${endpoints.folder.delete}`, // URL endpoint
        payload // Kirim payload langsung, bukan dalam objek data
      );

    
      return response;
    },
  });
};
