import { useQuery } from '@tanstack/react-query';
import axiosInstance, { endpoints } from 'src/utils/axios';

export const usePermissionAdmin = (filters) => {
  const { data, isLoading, refetch, isFetching } = useQuery({
    queryKey: ['permission.admin'],
    queryFn: async () => {
      const response = await axiosInstance.get(endpoints.users.permissionAdmin);
      return response.data.permissions; 
    },
   
  });

  return {
    data,
    isLoading,
    refetch,
    isFetching,
  };
};
