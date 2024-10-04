import { useQuery } from '@tanstack/react-query';
import axiosInstance, { endpoints } from 'src/utils/axios';

export const useFetchNewsSlug = (slug) => {  // Change to use slug
  const { data, isLoading, refetch } = useQuery({
    queryKey: ['detail-news', slug],  // Include slug in queryKey to cache data based on slug
    queryFn: async () => {
      const response = await axiosInstance.get(`${endpoints.News.getNewsSlug}/${slug}`);  // Use slug in the API call
      const { data: result } = response.data;
      console.log(result);
      return result;
    },
  });

  return {
    data,
    isLoading,
    refetch,
  };
};
