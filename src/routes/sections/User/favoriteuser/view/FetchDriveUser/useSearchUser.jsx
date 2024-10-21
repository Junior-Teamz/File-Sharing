import { useQuery } from '@tanstack/react-query';
import axiosInstance, { endpoints } from 'src/utils/axios';

export const useSearchUser = (searchParams = {}) => {
  const { email = '' } = searchParams;

  const { data = [], isLoading, refetch, isFetching, error } = useQuery({
    queryKey: ['search-user', email],
    queryFn: async () => {
      const params = new URLSearchParams();
      if (email) params.append('email', email);

      const response = await axiosInstance.get(`${endpoints.SearchUser.User}?${params.toString()}`);
      return response.data?.data || [];
    },
    enabled: Boolean(email), // Only run the query if there’s an email to search for
    onError: (err) => {
      console.error('Error searching for users:', err.response?.data?.errors || 'Unknown error');
    },
  });

  return {
    data,
    isLoading,
    refetch, // Use refetch for the search
    isFetching,
    error,
  };
};
