import { useQuery } from '@tanstack/react-query';
import { AuthContext } from 'src/auth/context/jwt';
import { useAuthContext } from 'src/auth/hooks';
import axiosInstance, { endpoints } from 'src/utils/axios';

export const useIndexInstance = (filters) => {
  const user = useAuthContext(AuthContext);
  const UserRoles = user?.user?.roles || [];
  // console.log(UserRoles)
  // console.log(user)

  // Pilih endpoint berdasarkan roles
  const endpoint =
    UserRoles.includes('superadmin')
      ? endpoints.instance.list // API untuk superadmin
      : UserRoles.includes('admin')
      ? endpoints.adminIntances.getIntances // API untuk admin
      : null; // Default jika roles tidak sesuai

  const { data, isLoading, refetch, isFetching } = useQuery({
    queryKey: ['list.instansi', filters], // Gunakan filters jika perlu
    queryFn: async () => {
      if (!endpoint) {
        throw new Error('Invalid roles or no endpoint available.');
      }
      const response = await axiosInstance.get(endpoint);
      return response.data;
    },
    enabled: !!endpoint, // Hanya jalankan query jika endpoint valid
  });

  return {
    data,
    isLoading,
    refetch,
    isFetching,
  };
};
