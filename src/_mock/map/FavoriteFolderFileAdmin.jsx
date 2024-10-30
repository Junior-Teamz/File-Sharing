import { useGetFolderFavorite } from 'src/sections/favorite/view/fetchFavorite';

export const FavoriteFolderFileAdmin = () => {
  const {
    data: DataFavorite,
    refetch: refetchFavorites,
  } = useGetFolderFavorite();

  // Ambil data folder dan file
  const folderss = DataFavorite?.favorite_folders?.data || []; // Pastikan ini mengambil folder
  const filess = DataFavorite?.favorite_files?.data || []; // Pastikan ini mengambil file

  // Gabungkan folder dan file
  const FolderFiles = [...folderss, ...filess];

  return {
    FolderFiles,
    refetch: refetchFavorites,
  };
};
