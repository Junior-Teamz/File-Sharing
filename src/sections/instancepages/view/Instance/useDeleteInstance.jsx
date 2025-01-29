import { useMutation } from '@tanstack/react-query';
import { AuthContext } from 'src/auth/context/jwt';
import { useAuthContext } from 'src/auth/hooks';
import axiosInstance, { endpoints } from 'src/utils/axios';

export const useDeleteInstance = ({ onSuccess, onError }) => {
  const user = useAuthContext(AuthContext);
  const UserRoles = user?.user?.roles || [];

  // Pilih endpoint berdasarkan roles
  const endpoint = UserRoles.includes('superadmin')
    ? endpoints.instance.delete // API untuk superadmin
    : UserRoles.includes('admin')
    ? endpoints.adminIntances.deleteIntances // API untuk admin
    : null; // Default jika roles tidak sesuai

  // Validasi jika endpoint tidak ditemukan
  if (!endpoint) {
    throw new Error('Invalid roles or no endpoint available.');
  }

  // Mutasi untuk delete
  const mutation = useMutation({
    mutationFn: async (id) => {
      const url = `${endpoint}/${id}`; // Asumsikan endpoint memerlukan ID
      const response = await axiosInstance.delete(url);
      return response.data;
    },
    onSuccess, // Callback saat berhasil
    onError,   // Callback saat gagal
  });

  return mutation;
};
