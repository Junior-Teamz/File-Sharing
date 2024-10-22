import { useGetFavorite, useGetFolderFavorite } from 'src/sections/favorite/view/fetchFavorite';

export const FavoriteFolderFileAdmin = () => {
  const {
    data: favoriteData,
    isLoading: isLoadingFavorites,
    error: errorFavorites,
    refetch: refetchFavorites,
  } = useGetFavorite();

  const {
    data: folderData,
    isLoading: isLoadingFolders,
    error: errorFolders,
    refetch: refetchFolders,
  } = useGetFolderFavorite();

 

  // Handle loading and error states
  if (isLoadingFavorites || isLoadingFolders) {
    return <div>Loading...</div>;
  }

  if (errorFavorites || errorFolders) {
    return <div>Error loading favorites or folders.</div>;
  }

  // Ambil data folder dan file
  const folderss = folderData?.favorite_folders?.data || []; // Pastikan ini mengambil folder
  const filess = favoriteData?.favorite_files?.data || []; // Pastikan ini mengambil file

  // Gabungkan folder dan file
  const FolderFiles = [...folderss, ...filess];

  return {
    FolderFiles,
    refetch: refetchFavorites,
  };
};
