import { useGetShare } from 'src/routes/sections/User/shareuser/view/FetchShare/useGetShare';

export const FolderFileShareUser = () => {
  const { data, refetch } = useGetShare();

  if (!data) {
    return { FolderFiles: [], refetch };
  }

  // Use optional chaining to safely access data
  const folderss = data.folders ? data.folders.map((folder) => folder) : [];

  const filess = data.files ? data.files.map((folder) => folder) : [];

  const FolderFiles = [...folderss, ...filess];

  return {
    FolderFiles,
    refetch,
  };
};
