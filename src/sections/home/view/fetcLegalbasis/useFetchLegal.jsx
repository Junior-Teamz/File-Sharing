import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import axiosInstance, { endpoints } from 'src/utils/axios';

export const useFetchLegall = () => {
  const [errorMessage, setErrorMessage] = useState(null);

  const { data, isLoading, refetch, isFetching } = useQuery({
    queryKey: ['list.legal'],
    queryFn: async () => {
      try {
        const response = await axiosInstance.get(endpoints.Legalbasis.getLegal);
        return response.data.data; // Return only the array of legal basis
      } catch (error) {
        if (error.response?.status === 429) {
          setErrorMessage('Too many requests. Please try again later.'); // Set error message
        }
        throw error; // Re-throw error for further processing
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
