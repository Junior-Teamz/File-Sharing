import { indexShareAdmin } from 'src/sections/sharewithme/fetchShare/indexShareAdmin';

export const FolderFileShare = () => {
  const { data, refetch } = indexShareAdmin();

  // Handle case when data is undefined or loading
  if (!data) {
    return { FolderFiles: [], refetch };
  }

  // Access the folders and files properly
  const folderss = Array.isArray(data.folders.data) ? data.folders.data.map((folder) => folder) : [];
  const filess = Array.isArray(data.files.data) ? data.files.data.map((file) => file) : [];

  const FolderFiles = [...folderss, ...filess];

  return {
    FolderFiles,
    refetch,
  };
};
