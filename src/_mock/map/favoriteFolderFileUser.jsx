import { useGetFavoriteUser } from 'src/routes/sections/User/favoriteuser/view/FetchDriveUser/useGetFavoriteUser';

export const FavoriteFolderFileUser = () => {
  const { data: DataFavorite, refetch } = useGetFavoriteUser();

  // Ambil data folder dan file
  const folderss = DataFavorite?.favorite_folders?.data || []; // Pastikan ini mengambil folder
  const filess = DataFavorite?.favorite_files?.data || []; // Pastikan ini mengambil file

  // Gabungkan folder dan file
  const FolderFiles = [...folderss, ...filess];

  return {
    FolderFiles,
    refetch
  };
};
