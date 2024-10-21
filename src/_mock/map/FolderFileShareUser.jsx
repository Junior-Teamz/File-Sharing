import { useGetShare } from 'src/routes/sections/User/shareuser/view/FetchShare/useGetShare';

export const FolderFileShareUser = () => {
  const { data, refetch } = useGetShare();

  if (!data) {
    return { FolderFiles: [], refetch };
  }

  // Use optional chaining to safely access data
  const folderss = Array.isArray(data?.folders?.data) ? data.folders.data : [];
  const filess = Array.isArray(data?.files?.data) ? data.files.data : [];

  const FolderFiles = [...folderss, ...filess];

  return {
    FolderFiles,
    refetch,
  };
};
