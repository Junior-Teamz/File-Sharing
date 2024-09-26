import { useFetchFolderUser } from "src/routes/sections/User/DriveUser/view/FetchFolderUser";

export const handleFolderFiles = () => {
    const { data, refetch } = useFetchFolderUser(); // Destructure refetch from the hook
    
    if (!data) {
        // Handle the case where data is not available
        return { FolderFiles: [], refetch }; // Return refetch along with empty data
    }

    const folderss = data.folders ? data.folders.map((folder) => folder) : [];
    const filess = data.files ? data.files.map((file) => file) : [];
    
    const FolderFiles = [...folderss, ...filess];

    return {
        FolderFiles,
        refetch // Return refetch function
    };
};
