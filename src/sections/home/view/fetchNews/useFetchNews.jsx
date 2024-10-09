import { useQuery } from '@tanstack/react-query';
import axiosInstance, { endpoints } from 'src/utils/axios';

export const useFetchNews = ({ searchQuery = '', page = 1, itemsPerPage = 4 }) => {
  const { data, isLoading, refetch, isFetching, error } = useQuery({
    queryKey: ['list.news', searchQuery, page, itemsPerPage],
    queryFn: async () => {
      const response = await axiosInstance.get(endpoints.News.getNews, {
        params: {
          search: searchQuery,
          page,
          per_page: itemsPerPage,
        },
      });
      return response.data;
    },
    enabled: !!page && !!itemsPerPage, // Ensure pagination is enabled
    onError: (err) => {
      console.error("Error fetching news:", err);
    },
  });

  return {
    data,
    isLoading,
    refetch,
    isFetching,
    error, // Keep returning the error for further usage
  };
};
