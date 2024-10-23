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

   // Ambil data folder dan file
   const folders = folderData?.favorite_folders?.data || []; // Pastikan ini mengambil folder
   const files = favoriteData?.favorite_files?.data || []; // Pastikan ini mengambil file
 
   // Gabungkan folder dan file
   const FolderFiles = [...folders, ...files];

  return {
    FolderFiles,
    refetch: refetchFavorites,
  };
};
