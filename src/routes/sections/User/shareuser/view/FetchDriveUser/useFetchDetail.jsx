import { useQuery } from '@tanstack/react-query';
import axiosInstance, { endpoints } from 'src/utils/axios';

export const useFetchDetail = (id) => {
  const { data, isLoading, refetch, error } = useQuery({
    queryKey: ['detail-folder', id], // Include id for uniqueness
    queryFn: async () => {
      const accessToken = localStorage.getItem('accessToken');
   
      
      fetch(`${endpoints.folders.detail}${id}`, {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      })
      .then(response => {
        if (!response.ok) {
          throw new Error('Network response was not ok ' + response.statusText);
        }
        return response.json();
      })
   
       
    },
  });

  return {
    data,
    isLoading,
    refetch,
    error, // Include error in the return object
  };
};
