import { useMutation, useQueryClient } from '@tanstack/react-query';
import axiosInstance, { endpoints } from 'src/utils/axios';
import { useSnackbar } from 'notistack';
import { fData } from 'src/utils/format-number';

export const useEditLegal = (id, setEditDialogOpen) => {
  const { enqueueSnackbar } = useSnackbar();
  const useClient = useQueryClient();

  return useMutation({
    mutationKey: ['edit.legal'],
    mutationFn: async (data) => {
      const formData = new FormData();

      // Validasi dan tambahkan name jika ada
      if (data.name) {
        formData.append('name', data.name);
      }

      // Validasi dan tambahkan file jika ada
      if (data.file && data.file[0]) {
        const file = data.file[0];
        const allowedTypes = [
          'application/pdf',
          'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
          'application/msword',
        ];
        const maxSize = 5 * 1024 * 1024; // 5 MB

        if (!allowedTypes.includes(file.type)) {
          throw new Error('Tipe file tidak valid. Hanya PDF dan dokumen Word yang diizinkan.');
        }

        if (file.size > maxSize) {
          throw new Error(`Ukuran file terlalu besar. Maksimal ukuran file adalah ${fData(maxSize)}.`);
        }

        formData.append('file', file);
      }

      formData.append('_method', 'PUT');

      // Kirim request
      const response = await axiosInstance.post(`${endpoints.Legal.UpdateLegal}/${id}`, formData);
      return response.data;
    },
    onError: (error) => {
      enqueueSnackbar(error.message || 'Terjadi kesalahan saat mengunggah file.', {
        variant: 'error',
      });
    },
    onSuccess: () => {
      enqueueSnackbar('File berhasil diperbarui!', { variant: 'success' });
      setEditDialogOpen(false); // Tutup dialog
      useClient.invalidateQueries(['legal.admin']);
    },
  });
};
