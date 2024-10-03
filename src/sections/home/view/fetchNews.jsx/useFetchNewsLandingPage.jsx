import { useQuery } from '@tanstack/react-query';
import axiosInstance, { endpoints } from 'src/utils/axios';
import { useState } from 'react';

export const useFetchNewsLandingPage = () => {
  const [errorMessage, setErrorMessage] = useState(null);

  const { data, isLoading, refetch, isFetching } = useQuery({
    queryKey: ['fetch.news.landingpage'],
    queryFn: async () => {
      try {
        const response = await axiosInstance.get(endpoints.News.getNews);
        const { data: result } = response.data;
        return result;
      } catch (error) {
        console.error('Error fetching news:', error);
        setErrorMessage('Failed to fetch news. Please try again later.'); // Set error message
        throw error; // Re-throw for further processing
      }
    },
  });

  return {
    data,
    isLoading,
    refetch,
    isFetching,
    errorMessage, // Return error message to be displayed in the UI
  };
};