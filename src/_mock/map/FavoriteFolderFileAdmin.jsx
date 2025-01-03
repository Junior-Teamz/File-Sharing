import { useGetFolderFavorite } from 'src/sections/favorite/view/fetchFavorite';

export const FavoriteFolderFileAdmin = () => {
  const {
    data: DataFavorite,
    refetch
  } = useGetFolderFavorite();

  // Ambil data folder dan file
  const folderss = DataFavorite?.data?.favorite_folders || []; // Pastikan ini mengambil folder
  const filess = DataFavorite?.data?.favorite_files || []; // Pastikan ini mengambil file

  // Gabungkan folder dan file
  const FolderFiles = [...folderss, ...filess];

  return {
    FolderFiles,
    refetch,
  };
};
