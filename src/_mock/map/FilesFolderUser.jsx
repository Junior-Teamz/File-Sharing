import { useFetchFolderUser } from "src/routes/sections/User/DriveUser/view/FetchFolderUser";

export const handleFolderFiles = () => {
    const { data } = useFetchFolderUser();
    
    if (!data) {
        // Handle the case where data is not available
        return { FolderFiles: [] }; // or return null, or handle as needed
    }

    const folderss = data.folders ? data.folders.map((folder) => folder) : [];
    const filess = data.files ? data.files.map((file) => file) : [];
    
    const FolderFiles = [...folderss, ...filess];

    return {
        FolderFiles
    };
};
