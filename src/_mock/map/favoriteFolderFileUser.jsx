import { useGetFavoriteUser } from 'src/routes/sections/User/favoriteuser/view/FetchDriveUser/useGetFavoriteUser';

export const FavoriteFolderFileUser = () => {
  const { data: DataFavorite, refetch } = useGetFavoriteUser();

  // Ambil data folder dan file
  const folderss = DataFavorite?.data?.favorite_folders || []; // Pastikan ini mengambil folder
  const filess = DataFavorite?.data?.favorite_files || []; // Pastikan ini mengambil file

  // Gabungkan folder dan file
  const FolderFiles = [...folderss, ...filess];

  return {
    FolderFiles,
    refetch
  };
};
